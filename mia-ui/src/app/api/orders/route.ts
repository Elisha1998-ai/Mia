import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { orders as ordersTable, customers as customersTable, orderItems as orderItemsTable, products as productsTable } from '@/lib/schema';
import { desc, count, eq, sql } from 'drizzle-orm';

// GET /api/orders - Get all orders with pagination
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const skip = parseInt(searchParams.get('skip') || '0');
    const limit = parseInt(searchParams.get('limit') || '100');
    
    const ordersWithDetails = await db.select({
      id: ordersTable.id,
      orderNumber: ordersTable.orderNumber,
      externalId: ordersTable.externalId,
      customerId: ordersTable.customerId,
      storeId: ordersTable.storeId,
      totalAmount: ordersTable.totalAmount,
      profitMargin: ordersTable.profitMargin,
      status: ordersTable.status,
      createdAt: ordersTable.createdAt,
      customer: {
        id: customersTable.id,
        email: customersTable.email,
        fullName: customersTable.fullName
      },
      itemsCount: sql<number>`CAST(count(${orderItemsTable.id}) AS integer)`,
      totalQuantity: sql<number>`CAST(sum(${orderItemsTable.quantity}) AS integer)`,
      firstProductName: sql<string>`min(${productsTable.name})`
    })
    .from(ordersTable)
    .leftJoin(customersTable, eq(ordersTable.customerId, customersTable.id))
    .leftJoin(orderItemsTable, eq(ordersTable.id, orderItemsTable.orderId))
    .leftJoin(productsTable, eq(orderItemsTable.productId, productsTable.id))
    .groupBy(ordersTable.id, customersTable.id)
    .orderBy(desc(ordersTable.createdAt))
    .limit(limit)
    .offset(skip);

    const [totalResult] = await db.select({ count: count() }).from(ordersTable);
    const total = totalResult?.count || 0;

    return NextResponse.json({
      orders: ordersWithDetails.map(o => ({
        id: o.id,
        order_number: o.orderNumber,
        external_id: o.externalId || undefined,
        customer_id: o.customerId || undefined,
        store_id: o.storeId || undefined,
        total_amount: Number(o.totalAmount),
        profit_margin: o.profitMargin ? Number(o.profitMargin) : undefined,
        status: o.status,
        created_at: new Date(o.createdAt).toISOString(),
        customer: o.customer && (o.customer.id || o.customer.fullName || o.customer.email) ? {
          id: o.customer.id || '',
          email: o.customer.email || '',
          full_name: o.customer.fullName || undefined
        } : undefined,
        items_count: o.itemsCount || 0,
        total_quantity: o.totalQuantity || 0,
        product_name: (o.itemsCount || 0) > 1 
          ? `${o.firstProductName} (+${(o.itemsCount || 0) - 1} more)`
          : (o.firstProductName || 'No items')
      })),
      total,
      skip,
      limit
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}

// POST /api/orders - Create a new order
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { 
      order_number,
      customer_id, 
      customer_name,
      total_amount, 
      status = 'pending', 
      external_id,
      items = [] 
    } = body;

    // In Drizzle, we handle transactions for nested creations
    const result = await db.transaction(async (tx) => {
      let finalCustomerId = customer_id;

      // Create a new customer if one doesn't exist but a name was provided
      if (!finalCustomerId && customer_name) {
        // Generate a simple email for new customers if not provided
        const placeholderEmail = `customer_${Date.now()}@mia-auto.ai`;
        const [newCustomer] = await tx.insert(customersTable).values({
          fullName: customer_name,
          email: placeholderEmail,
          lifetimeValue: "0"
        }).returning();
        finalCustomerId = newCustomer.id;
      }

      const [order] = await tx.insert(ordersTable).values({
        customerId: finalCustomerId,
        totalAmount: total_amount.toString(),
        status,
        externalId: external_id,
        orderNumber: order_number || `ORD-${Date.now()}` // Use provided order number or generate one
      }).returning();

      if (items.length > 0) {
        await tx.insert(orderItemsTable).values(
          items.map((item: any) => ({
            orderId: order.id,
            productId: item.product_id,
            quantity: item.quantity,
            price: item.price.toString()
          }))
        );
      }

      // Fetch the created order with details to return a complete object
      const orderWithDetails = await tx.select({
        id: ordersTable.id,
        orderNumber: ordersTable.orderNumber,
        externalId: ordersTable.externalId,
        customerId: ordersTable.customerId,
        totalAmount: ordersTable.totalAmount,
        status: ordersTable.status,
        createdAt: ordersTable.createdAt,
        customer: {
          id: customersTable.id,
          email: customersTable.email,
          fullName: customersTable.fullName
        },
        itemsCount: sql<number>`CAST(count(${orderItemsTable.id}) AS integer)`,
        firstProductName: sql<string>`min(${productsTable.name})`
      })
      .from(ordersTable)
      .leftJoin(customersTable, eq(ordersTable.customerId, customersTable.id))
      .leftJoin(orderItemsTable, eq(ordersTable.id, orderItemsTable.orderId))
      .leftJoin(productsTable, eq(orderItemsTable.productId, productsTable.id))
      .where(eq(ordersTable.id, order.id))
      .groupBy(ordersTable.id, customersTable.id);

      return orderWithDetails[0];
    });

    return NextResponse.json({
      id: result.id,
      order_number: result.orderNumber,
      external_id: result.externalId || undefined,
      customer_id: result.customerId || undefined,
      total_amount: Number(result.totalAmount),
      status: result.status,
      created_at: new Date(result.createdAt).toISOString(),
      customer: result.customer && (result.customer.id || result.customer.fullName || result.customer.email) ? {
        id: result.customer.id || '',
        email: result.customer.email || '',
        full_name: result.customer.fullName || undefined
      } : undefined,
      items_count: result.itemsCount || 0,
      product_name: (result.itemsCount || 0) > 1 
        ? `${result.firstProductName} (+${(result.itemsCount || 0) - 1} more)`
        : (result.firstProductName || (items.length > 0 ? 'Multiple items' : 'No items'))
    }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { 
        error: 'Failed to create order', 
        details: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}

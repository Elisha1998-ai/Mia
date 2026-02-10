import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { orders as ordersTable, customers as customersTable, orderItems as orderItemsTable } from '@/lib/schema';
import { desc, count, eq } from 'drizzle-orm';

// GET /api/orders - Get all orders with pagination
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const skip = parseInt(searchParams.get('skip') || '0');
    const limit = parseInt(searchParams.get('limit') || '100');
    
    const [orders, totalResult] = await Promise.all([
      db.select({
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
        }
      })
      .from(ordersTable)
      .leftJoin(customersTable, eq(ordersTable.customerId, customersTable.id))
      .orderBy(desc(ordersTable.createdAt))
      .limit(limit)
      .offset(skip),
      db.select({ count: count() }).from(ordersTable)
    ]);

    const total = totalResult[0]?.count || 0;

    return NextResponse.json({
      orders: orders.map(o => ({
        id: o.id,
        order_number: o.orderNumber,
        external_id: o.externalId || undefined,
        customer_id: o.customerId || undefined,
        store_id: o.storeId || undefined,
        total_amount: Number(o.totalAmount),
        profit_margin: o.profitMargin ? Number(o.profitMargin) : undefined,
        status: o.status,
        created_at: o.createdAt.toISOString(),
        customer: o.customer.id ? {
          id: o.customer.id,
          email: o.customer.email,
          full_name: o.customer.fullName || undefined
        } : undefined
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
      customer_id, 
      total_amount, 
      status = 'pending', 
      external_id,
      items = [] 
    } = body;

    // In Drizzle, we handle transactions for nested creations
    const result = await db.transaction(async (tx) => {
      const [order] = await tx.insert(ordersTable).values({
        customerId: customer_id,
        totalAmount: total_amount.toString(),
        status,
        externalId: external_id,
        orderNumber: `ORD-${Date.now()}` // Basic order number generation
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

      return order;
    });

    return NextResponse.json({
      id: result.id,
      order_number: result.orderNumber,
      external_id: result.externalId || undefined,
      customer_id: result.customerId || undefined,
      total_amount: Number(result.totalAmount),
      status: result.status,
      created_at: result.createdAt.toISOString()
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    );
  }
}

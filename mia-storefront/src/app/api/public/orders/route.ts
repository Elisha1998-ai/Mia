import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { orders as ordersTable, customers as customersTable, orderItems as orderItemsTable, products as productsTable, users as usersTable } from '@/lib/schema';
import { eq, sql, and } from 'drizzle-orm';

// POST /api/public/orders - Create a new order (Public)
export async function POST(request: Request) {
  try {
    // Determine the merchant (store owner)
    // For this MVP, we assume the first user in the database is the store owner
    const [merchant] = await db.select().from(usersTable).limit(1);
    
    if (!merchant) {
      return NextResponse.json({ error: 'Store configuration error: No merchant found' }, { status: 500 });
    }
    
    const userId = merchant.id;

    const body = await request.json();
    const { 
      order_number,
      customer_id, 
      customer_name,
      customer_email,
      customer_phone,
      total_amount, 
      status = 'pending', 
      external_id,
      shipping_address,
      shipping_method,
      payment_method,
      items = [] 
    } = body;

    // In Drizzle, we handle transactions for nested creations
    const result = await db.transaction(async (tx) => {
      let finalCustomerId = customer_id;

      // Create a new customer if one doesn't exist but a name was provided
      if (!finalCustomerId && customer_name) {
        // Use provided email or generate a placeholder
        const finalEmail = customer_email || `customer_${Date.now()}@mia-auto.ai`;
        
        // Check if customer with this email already exists for this merchant
        const [existingCustomer] = await tx.select()
          .from(customersTable)
          .where(and(
            eq(customersTable.userId, userId),
            eq(customersTable.email, finalEmail)
          ))
          .limit(1);

        if (existingCustomer) {
          finalCustomerId = existingCustomer.id;
        } else {
          const [newCustomer] = await tx.insert(customersTable).values({
            userId: userId,
            fullName: customer_name,
            email: finalEmail,
            phone: customer_phone || null,
          }).returning();
          finalCustomerId = newCustomer.id;
        }
      }

      // 1. Create the order
      const [order] = await tx.insert(ordersTable).values({
        userId: userId,
        orderNumber: order_number || `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
        customerId: finalCustomerId,
        totalAmount: total_amount.toString(),
        status: status,
        externalId: external_id,
        shippingAddress: shipping_address,
        shippingMethod: shipping_method,
        paymentMethod: payment_method
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
        shippingAddress: ordersTable.shippingAddress,
        shippingMethod: ordersTable.shippingMethod,
        paymentMethod: ordersTable.paymentMethod,
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
      shipping_address: result.shippingAddress || undefined,
      shipping_method: result.shippingMethod || undefined,
      payment_method: result.paymentMethod || undefined,
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

import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { orders as ordersTable, customers as customersTable, orderItems as orderItemsTable, products as productsTable } from '@/lib/schema';
import { eq, and } from 'drizzle-orm';
import { auth } from '@/auth';

// GET /api/orders/[id] - Get a specific order
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const order = await db.query.orders.findFirst({
      where: and(
        eq(ordersTable.id, id),
        eq(ordersTable.userId, userId)
      ),
      with: {
        customer: true,
        items: {
          with: {
            product: true
          }
        }
      }
    });

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      id: order.id,
      order_number: order.orderNumber,
      external_id: order.externalId || undefined,
      customer_id: order.customerId || undefined,
      store_id: order.storeId || undefined,
      total_amount: Number(order.totalAmount),
      profit_margin: order.profitMargin ? Number(order.profitMargin) : undefined,
      status: order.status,
      shipping_address: order.shippingAddress || undefined,
      shipping_method: order.shippingMethod || undefined,
      payment_method: order.paymentMethod || undefined,
      created_at: order.createdAt.toISOString(),
      customer: order.customer ? {
        id: order.customer.id,
        email: order.customer.email,
        full_name: order.customer.fullName || undefined,
        phone: order.customer.phone || undefined
      } : undefined,
      items: order.items.map(item => ({
        id: item.id,
        product_id: item.productId,
        product_name: item.product?.name || 'Deleted Product',
        quantity: item.quantity,
        price: Number(item.price)
      }))
    });
  } catch (error) {
    console.error('Error fetching order:', error);
    return NextResponse.json(
      { error: 'Failed to fetch order' },
      { status: 500 }
    );
  }
}

// PUT /api/orders/[id] - Update an order
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { status, total_amount, customer_id, shipping_address, shipping_method, payment_method } = body;
    
    const [order] = await db.update(ordersTable)
      .set({
        status,
        totalAmount: total_amount?.toString(),
        customerId: customer_id,
        shippingAddress: shipping_address,
        shippingMethod: shipping_method,
        paymentMethod: payment_method,
        updatedAt: new Date()
      })
      .where(and(
        eq(ordersTable.id, id),
        eq(ordersTable.userId, userId)
      ))
      .returning();

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    const customer = order.customerId ? await db.query.customers.findFirst({
      where: and(
        eq(customersTable.id, order.customerId),
        eq(customersTable.userId, userId)
      )
    }) : null;

    return NextResponse.json({
      id: order.id,
      order_number: order.orderNumber,
      external_id: order.externalId || undefined,
      customer_id: order.customerId || undefined,
      total_amount: Number(order.totalAmount),
      status: order.status,
      created_at: order.createdAt.toISOString(),
      customer: customer ? {
        id: customer.id,
        email: customer.email,
        full_name: customer.fullName || undefined
      } : undefined
    });
  } catch (error) {
    console.error('Error updating order:', error);
    return NextResponse.json(
      { error: 'Failed to update order' },
      { status: 500 }
    );
  }
}

// DELETE /api/orders/[id] - Delete an order
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    
    const [order] = await db.delete(ordersTable)
      .where(and(
        eq(ordersTable.id, id),
        eq(ordersTable.userId, userId)
      ))
      .returning();

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting order:', error);
    return NextResponse.json(
      { error: 'Failed to delete order' },
      { status: 500 }
    );
  }
}

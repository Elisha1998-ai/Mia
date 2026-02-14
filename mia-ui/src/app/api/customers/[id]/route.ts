import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { customers as customersTable, orders as ordersTable } from '@/lib/schema';
import { eq, and, sql, desc } from 'drizzle-orm';
import { auth } from '@/auth';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    
    // Fetch customer with order history
    const customerResult = await db.select({
      id: customersTable.id,
      email: customersTable.email,
      fullName: customersTable.fullName,
      phone: customersTable.phone,
      lifetimeValue: customersTable.lifetimeValue,
      createdAt: customersTable.createdAt,
      ordersCount: sql<number>`count(${ordersTable.id})`,
      lastOrderDate: sql<Date>`max(${ordersTable.createdAt})`
    })
    .from(customersTable)
    .leftJoin(ordersTable, eq(customersTable.id, ordersTable.customerId))
    .where(and(
      eq(customersTable.id, id),
      eq(customersTable.userId, session.user.id)
    ))
    .groupBy(customersTable.id);

    if (customerResult.length === 0) {
      return NextResponse.json(
        { error: 'Customer not found' },
        { status: 404 }
      );
    }

    const customer = customerResult[0];

    // Fetch recent orders
    const recentOrders = await db.select()
      .from(ordersTable)
      .where(eq(ordersTable.customerId, id))
      .orderBy(desc(ordersTable.createdAt))
      .limit(10);

    return NextResponse.json({
      id: customer.id,
      email: customer.email,
      full_name: customer.fullName || undefined,
      phone: customer.phone || undefined,
      lifetime_value: Number(customer.lifetimeValue),
      created_at: new Date(customer.createdAt).toISOString(),
      orders_count: Number(customer.ordersCount),
      last_order_date: customer.lastOrderDate ? new Date(customer.lastOrderDate).toISOString() : null,
      recent_orders: recentOrders.map(o => ({
        id: o.id,
        order_number: o.orderNumber,
        total_amount: Number(o.totalAmount),
        status: o.status,
        created_at: new Date(o.createdAt).toISOString()
      }))
    });
  } catch (error) {
    console.error('Error fetching customer details:', error);
    return NextResponse.json(
      { error: 'Failed to fetch customer details' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    
    const [customer] = await db.delete(customersTable)
      .where(and(
        eq(customersTable.id, id),
        eq(customersTable.userId, session.user.id)
      ))
      .returning();

    if (!customer) {
      return NextResponse.json(
        { error: 'Customer not found' },
        { status: 404 }
      );
    }
      
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting customer:', error);
    return NextResponse.json(
      { error: 'Failed to delete customer' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { name, email, phone } = body;

    const [updatedCustomer] = await db.update(customersTable)
      .set({
        fullName: name,
        email: email,
        phone: phone,
      })
      .where(and(
        eq(customersTable.id, id),
        eq(customersTable.userId, session.user.id)
      ))
      .returning();

    if (!updatedCustomer) {
      return NextResponse.json(
        { error: 'Customer not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      id: updatedCustomer.id,
      email: updatedCustomer.email,
      full_name: updatedCustomer.fullName || undefined,
      phone: updatedCustomer.phone || undefined,
      lifetime_value: Number(updatedCustomer.lifetimeValue),
      created_at: new Date(updatedCustomer.createdAt).toISOString(),
    });
  } catch (error) {
    console.error('Error updating customer:', error);
    return NextResponse.json(
      { error: 'Failed to update customer' },
      { status: 500 }
    );
  }
}

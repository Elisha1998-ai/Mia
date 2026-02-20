import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { customers as customersTable, orders as ordersTable, users as usersTable } from '@/lib/schema';
import { desc, count, eq, sql, and } from 'drizzle-orm';
import { auth } from '@/auth';

// GET /api/customers - Get all customers with pagination
export async function GET(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let finalUserId = userId;
    if (userId.includes('@')) {
      const userRecord = await db.select({ id: usersTable.id })
        .from(usersTable)
        .where(eq(usersTable.email, userId))
        .limit(1);
      
      if (userRecord.length > 0) {
        finalUserId = userRecord[0].id;
      }
    }

    const { searchParams } = new URL(request.url);
    const skip = parseInt(searchParams.get('skip') || '0');
    const limit = parseInt(searchParams.get('limit') || '100');
    
    // In Drizzle, we'll use a subquery or join to get order counts and last order date
    const customersQuery = db.select({
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
    .where(eq(customersTable.userId, userId))
    .groupBy(customersTable.id)
    .orderBy(desc(customersTable.createdAt))
    .limit(limit)
    .offset(skip);

    const [customers, totalResult] = await Promise.all([
      customersQuery,
      db.select({ count: count() })
        .from(customersTable)
        .where(eq(customersTable.userId, userId))
    ]);

    const total = totalResult[0]?.count || 0;

    return NextResponse.json({
      customers: customers.map(c => ({
        id: c.id,
        email: c.email,
        full_name: c.fullName || undefined,
        phone: c.phone || undefined,
        lifetime_value: Number(c.lifetimeValue),
        created_at: new Date(c.createdAt).toISOString(),
        orders_count: Number(c.ordersCount),
        last_order_date: c.lastOrderDate ? new Date(c.lastOrderDate).toISOString() : null
      })),
      total,
      skip,
      limit
    });
  } catch (error) {
    console.error('Error fetching customers:', error);
    return NextResponse.json(
      { error: 'Failed to fetch customers' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { name, email, phone } = body;

    // Basic validation
    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    const [customer] = await db.insert(customersTable).values({
      userId: userId,
      email,
      fullName: name,
      phone,
    }).returning();

    return NextResponse.json({
      id: customer.id,
      email: customer.email,
      full_name: customer.fullName || undefined,
      phone: customer.phone || undefined,
      lifetime_value: Number(customer.lifetimeValue),
      created_at: new Date(customer.createdAt).toISOString(),
      orders_count: 0,
      last_order_date: null
    });

  } catch (error) {
    console.error('Error creating customer:', error);
    return NextResponse.json(
      { error: 'Failed to create customer' },
      { status: 500 }
    );
  }
}

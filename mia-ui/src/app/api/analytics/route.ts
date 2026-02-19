import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { orders as ordersTable, orderItems as orderItemsTable, products as productsTable, users as usersTable } from '@/lib/schema';
import { eq, and, gte, sql, desc } from 'drizzle-orm';
import { auth } from '@/auth';

export const revalidate = 0;

export async function GET(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let userId = session.user.id;
    
    // In development, the session ID might be an email (from Credentials provider),
    // but the database might have a different ID for that user.
    // Let's try to find the actual user record.
    if (userId.includes('@')) {
      const userRecord = await db.select({ id: usersTable.id })
        .from(usersTable)
        .where(eq(usersTable.email, userId))
        .limit(1);
      
      if (userRecord.length > 0) {
        userId = userRecord[0].id;
      }
    }

    const { searchParams } = new URL(request.url);
    const range = searchParams.get('range') || '30d';
    
    const startDate = new Date();
    switch (range) {
      case '7d':
        startDate.setDate(startDate.getDate() - 7);
        break;
      case '30d':
        startDate.setDate(startDate.getDate() - 30);
        break;
      case '90d':
        startDate.setDate(startDate.getDate() - 90);
        break;
      case '1y':
        startDate.setDate(startDate.getDate() - 365);
        break;
      default:
        startDate.setDate(startDate.getDate() - 30);
    }

    // 1. Revenue and Orders over time (last 30 days)
    const salesOverTime = await db.select({
      date: sql`TO_CHAR(date_trunc('day', ${ordersTable.createdAt}), 'YYYY-MM-DD')`.as('date'),
      revenue: sql`COALESCE(SUM(${ordersTable.totalAmount}), 0)`.mapWith(Number).as('revenue'),
      orders: sql`COUNT(${ordersTable.id})`.mapWith(Number).as('orders'),
    })
    .from(ordersTable)
    .where(and(
      eq(ordersTable.userId, userId),
      gte(ordersTable.createdAt, startDate)
    ))
    .groupBy(sql`date_trunc('day', ${ordersTable.createdAt})`)
    .orderBy(sql`date_trunc('day', ${ordersTable.createdAt})`);

    // 2. Top Products by Revenue
    const topProducts = await db.select({
      id: productsTable.id,
      name: productsTable.name,
      revenue: sql`COALESCE(SUM(${orderItemsTable.price} * ${orderItemsTable.quantity}), 0)`.mapWith(Number).as('revenue'),
      quantity: sql`SUM(${orderItemsTable.quantity})`.mapWith(Number).as('quantity'),
    })
    .from(orderItemsTable)
    .innerJoin(productsTable, eq(orderItemsTable.productId, productsTable.id))
    .innerJoin(ordersTable, eq(orderItemsTable.orderId, ordersTable.id))
    .where(eq(ordersTable.userId, userId))
    .groupBy(productsTable.id, productsTable.name)
    .orderBy(desc(sql`revenue`))
    .limit(5);

    // 3. Overall Stats
    const statsResult = await db.select({
      totalRevenue: sql`COALESCE(SUM(${ordersTable.totalAmount}), 0)`.mapWith(Number),
      totalOrders: sql`COUNT(${ordersTable.id})`.mapWith(Number),
      avgOrderValue: sql`COALESCE(AVG(${ordersTable.totalAmount}), 0)`.mapWith(Number),
    })
    .from(ordersTable)
    .where(eq(ordersTable.userId, userId));

    const stats = statsResult[0] || { totalRevenue: 0, totalOrders: 0, avgOrderValue: 0 };

    return NextResponse.json({
      salesOverTime: salesOverTime || [],
      topProducts: topProducts || [],
      summary: {
        totalRevenue: Number(stats.totalRevenue || 0),
        totalOrders: Number(stats.totalOrders || 0),
        avgOrderValue: Number(stats.avgOrderValue || 0),
      }
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 });
  }
}

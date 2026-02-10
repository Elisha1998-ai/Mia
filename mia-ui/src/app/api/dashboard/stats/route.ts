import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { products as productsTable, orders as ordersTable, customers as customersTable } from '@/lib/schema';
import { count, gte, lt, sum } from 'drizzle-orm';

// GET /api/dashboard/stats - Get dashboard statistics
export async function GET() {
  try {
    // Fetch all statistics in parallel
    const [
      totalProductsResult,
      totalOrdersResult,
      totalCustomersResult,
      totalRevenueResult,
      recentOrdersResult,
      lowStockProductsResult
    ] = await Promise.all([
      // Total products
      db.select({ count: count() }).from(productsTable),
      
      // Total orders
      db.select({ count: count() }).from(ordersTable),
      
      // Total customers
      db.select({ count: count() }).from(customersTable),
      
      // Total revenue (sum of all order totals)
      db.select({ total: sum(ordersTable.totalAmount) }).from(ordersTable),
      
      // Recent orders (last 30 days)
      db.select({ count: count() })
        .from(ordersTable)
        .where(gte(ordersTable.createdAt, new Date(Date.now() - 30 * 24 * 60 * 60 * 1000))),
      
      // Low stock products (stock < 10)
      db.select({ count: count() })
        .from(productsTable)
        .where(lt(productsTable.stockQuantity, 10))
    ]);

    return NextResponse.json({
      total_products: totalProductsResult[0]?.count || 0,
      total_orders: totalOrdersResult[0]?.count || 0,
      total_customers: totalCustomersResult[0]?.count || 0,
      total_revenue: Number(totalRevenueResult[0]?.total) || 0,
      recent_orders: recentOrdersResult[0]?.count || 0,
      low_stock_products: lowStockProductsResult[0]?.count || 0
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard statistics' },
      { status: 500 }
    );
  }
}

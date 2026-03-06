// GET /api/digital/analytics — aggregate stats for the Digital Hub
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { digitalProducts, digitalOrders, digitalDownloads, users } from "@/lib/schema";
import { eq, sql, and, gte } from "drizzle-orm";
import { auth } from "@/auth";

async function resolveUserId(rawId: string): Promise<string> {
    if (!rawId.includes("@")) return rawId;
    const [row] = await db.select({ id: users.id }).from(users).where(eq(users.email, rawId)).limit(1);
    return row?.id ?? rawId;
}

export async function GET() {
    try {
        const session = await auth();
        if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const userId = await resolveUserId(session.user.id);

        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        // Run all aggregates in parallel
        const [
            productStats,
            orderStats,
            recentOrderStats,
            weeklyOrderStats,
            topProducts,
            revenueByType,
            downloadStats,
        ] = await Promise.all([
            // Total products by status
            db
                .select({
                    status: digitalProducts.status,
                    count: sql<number>`CAST(COUNT(*) AS INT)`,
                })
                .from(digitalProducts)
                .where(eq(digitalProducts.userId, userId))
                .groupBy(digitalProducts.status),

            // All-time order totals
            db
                .select({
                    totalRevenue: sql<number>`CAST(SUM(${digitalOrders.amountPaid}) AS FLOAT)`,
                    totalOrders: sql<number>`CAST(COUNT(*) AS INT)`,
                    uniqueCustomers: sql<number>`CAST(COUNT(DISTINCT ${digitalOrders.customerEmail}) AS INT)`,
                })
                .from(digitalOrders)
                .where(and(eq(digitalOrders.userId, userId), eq(digitalOrders.status, "completed"))),

            // Last 30 days
            db
                .select({
                    totalRevenue: sql<number>`CAST(SUM(${digitalOrders.amountPaid}) AS FLOAT)`,
                    totalOrders: sql<number>`CAST(COUNT(*) AS INT)`,
                })
                .from(digitalOrders)
                .where(
                    and(
                        eq(digitalOrders.userId, userId),
                        eq(digitalOrders.status, "completed"),
                        gte(digitalOrders.createdAt, thirtyDaysAgo)
                    )
                ),

            // Last 7 days (for sparkline)
            db
                .select({
                    day: sql<string>`TO_CHAR(${digitalOrders.createdAt}, 'Dy')`,
                    revenue: sql<number>`CAST(SUM(${digitalOrders.amountPaid}) AS FLOAT)`,
                    orders: sql<number>`CAST(COUNT(*) AS INT)`,
                })
                .from(digitalOrders)
                .where(
                    and(
                        eq(digitalOrders.userId, userId),
                        eq(digitalOrders.status, "completed"),
                        gte(digitalOrders.createdAt, sevenDaysAgo)
                    )
                )
                .groupBy(sql`TO_CHAR(${digitalOrders.createdAt}, 'Dy'), DATE_TRUNC('day', ${digitalOrders.createdAt})`)
                .orderBy(sql`DATE_TRUNC('day', ${digitalOrders.createdAt})`),

            // Top 5 products by revenue
            db
                .select({
                    id: digitalProducts.id,
                    title: digitalProducts.title,
                    productType: digitalProducts.productType,
                    price: digitalProducts.price,
                    salesCount: digitalProducts.salesCount,
                    revenue: digitalProducts.revenue,
                    status: digitalProducts.status,
                })
                .from(digitalProducts)
                .where(eq(digitalProducts.userId, userId))
                .orderBy(sql`${digitalProducts.revenue} DESC`)
                .limit(5),

            // Revenue by product type
            db
                .select({
                    productType: digitalProducts.productType,
                    revenue: sql<number>`CAST(SUM(${digitalOrders.amountPaid}) AS FLOAT)`,
                    orders: sql<number>`CAST(COUNT(${digitalOrders.id}) AS INT)`,
                })
                .from(digitalOrders)
                .leftJoin(digitalProducts, eq(digitalOrders.productId, digitalProducts.id))
                .where(and(eq(digitalOrders.userId, userId), eq(digitalOrders.status, "completed")))
                .groupBy(digitalProducts.productType),

            // Download stats
            db
                .select({
                    totalDownloads: sql<number>`CAST(SUM(${digitalDownloads.downloadCount}) AS INT)`,
                    activeLinks: sql<number>`CAST(COUNT(*) AS INT)`,
                })
                .from(digitalDownloads)
                .where(eq(digitalDownloads.userId, userId)),
        ]);

        const productsByStatus = Object.fromEntries(productStats.map((s) => [s.status, s.count]));
        const allTime = orderStats[0] ?? { totalRevenue: 0, totalOrders: 0, uniqueCustomers: 0 };
        const last30 = recentOrderStats[0] ?? { totalRevenue: 0, totalOrders: 0 };
        const dlStats = downloadStats[0] ?? { totalDownloads: 0, activeLinks: 0 };

        return NextResponse.json({
            overview: {
                total_revenue: Number(allTime.totalRevenue ?? 0),
                total_orders: Number(allTime.totalOrders ?? 0),
                unique_customers: Number(allTime.uniqueCustomers ?? 0),
                total_downloads: Number(dlStats.totalDownloads ?? 0),
                published_products: productsByStatus["published"] ?? 0,
                draft_products: productsByStatus["draft"] ?? 0,
                archived_products: productsByStatus["archived"] ?? 0,
            },
            last_30_days: {
                revenue: Number(last30.totalRevenue ?? 0),
                orders: Number(last30.totalOrders ?? 0),
            },
            weekly_chart: weeklyOrderStats.map((w) => ({
                day: w.day,
                revenue: Number(w.revenue ?? 0),
                orders: Number(w.orders ?? 0),
            })),
            top_products: topProducts.map((p) => ({
                id: p.id,
                title: p.title,
                product_type: p.productType,
                price: Number(p.price),
                sales_count: p.salesCount,
                revenue: Number(p.revenue),
                status: p.status,
            })),
            revenue_by_type: revenueByType.map((r) => ({
                product_type: r.productType ?? "other",
                revenue: Number(r.revenue ?? 0),
                orders: Number(r.orders ?? 0),
            })),
        });
    } catch (err) {
        console.error("[Digital Analytics GET]", err);
        return NextResponse.json({ error: "Failed to fetch analytics" }, { status: 500 });
    }
}

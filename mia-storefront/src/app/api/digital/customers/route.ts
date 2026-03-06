// GET /api/digital/customers — list customers who purchased digital products
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { digitalOrders, users } from "@/lib/schema";
import { eq, sql, desc } from "drizzle-orm";
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

        // Group by customer email to aggregate their purchase history
        const customers = await db
            .select({
                customerEmail: digitalOrders.customerEmail,
                customerName: digitalOrders.customerName,
                totalSpent: sql<number>`CAST(SUM(${digitalOrders.amountPaid}) AS FLOAT)`,
                orderCount: sql<number>`CAST(COUNT(*) AS INT)`,
                lastOrderAt: sql<string>`MAX(${digitalOrders.createdAt})`,
                firstOrderAt: sql<string>`MIN(${digitalOrders.createdAt})`,
            })
            .from(digitalOrders)
            .where(eq(digitalOrders.userId, userId))
            .groupBy(digitalOrders.customerEmail, digitalOrders.customerName)
            .orderBy(desc(sql`SUM(${digitalOrders.amountPaid})`));

        return NextResponse.json({
            customers: customers.map((c, i) => ({
                id: `dc-${c.customerEmail}`,
                email: c.customerEmail,
                name: c.customerName,
                total_spent: Number(c.totalSpent),
                order_count: Number(c.orderCount),
                last_order_at: c.lastOrderAt,
                first_order_at: c.firstOrderAt,
            })),
        });
    } catch (err) {
        console.error("[Digital Customers GET]", err);
        return NextResponse.json({ error: "Failed to fetch digital customers" }, { status: 500 });
    }
}

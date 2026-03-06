// GET /api/digital/orders — list all digital orders for user
// POST /api/digital/orders — record a manual sale
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { digitalOrders, digitalProducts, digitalDownloads, users } from "@/lib/schema";
import { desc, eq, sql } from "drizzle-orm";
import { auth } from "@/auth";
import crypto from "crypto";

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

        const orders = await db
            .select({
                id: digitalOrders.id,
                orderNumber: digitalOrders.orderNumber,
                productId: digitalOrders.productId,
                productTitle: digitalProducts.title,
                productType: digitalProducts.productType,
                customerName: digitalOrders.customerName,
                customerEmail: digitalOrders.customerEmail,
                amountPaid: digitalOrders.amountPaid,
                currency: digitalOrders.currency,
                paymentMethod: digitalOrders.paymentMethod,
                paymentReference: digitalOrders.paymentReference,
                status: digitalOrders.status,
                note: digitalOrders.note,
                source: digitalOrders.source,
                createdAt: digitalOrders.createdAt,
            })
            .from(digitalOrders)
            .leftJoin(digitalProducts, eq(digitalOrders.productId, digitalProducts.id))
            .where(eq(digitalOrders.userId, userId))
            .orderBy(desc(digitalOrders.createdAt));

        return NextResponse.json({
            orders: orders.map((o) => ({
                id: o.id,
                order_number: o.orderNumber,
                product_id: o.productId,
                product_title: o.productTitle ?? "Unknown Product",
                product_type: o.productType ?? "other",
                customer_name: o.customerName,
                customer_email: o.customerEmail,
                amount_paid: Number(o.amountPaid),
                currency: o.currency,
                payment_method: o.paymentMethod,
                payment_reference: o.paymentReference ?? undefined,
                status: o.status,
                note: o.note ?? undefined,
                source: o.source,
                createdAt: o.createdAt.toISOString(),
            })),
        });
    } catch (err) {
        console.error("[Digital Orders GET]", err);
        return NextResponse.json({ error: "Failed to fetch digital orders" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const session = await auth();
        if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const userId = await resolveUserId(session.user.id);
        const body = await request.json();

        const {
            product_id, customer_name, customer_email, amount_paid,
            payment_method = "Bank Transfer", payment_reference, note, source = "manual",
        } = body;

        if (!product_id || !customer_name || !customer_email || amount_paid == null) {
            return NextResponse.json({ error: "product_id, customer_name, customer_email and amount_paid are required" }, { status: 400 });
        }

        // Verify product belongs to this user
        const [product] = await db
            .select()
            .from(digitalProducts)
            .where(eq(digitalProducts.id, product_id))
            .limit(1);

        if (!product || product.userId !== userId) {
            return NextResponse.json({ error: "Product not found" }, { status: 404 });
        }

        const orderNumber = `DIG-${Date.now().toString(36).toUpperCase()}`;

        const result = await db.transaction(async (tx) => {
            // 1. Create order
            const [order] = await tx
                .insert(digitalOrders)
                .values({
                    userId,
                    orderNumber,
                    productId: product_id,
                    customerName: customer_name,
                    customerEmail: customer_email,
                    amountPaid: amount_paid.toString(),
                    paymentMethod: payment_method,
                    paymentReference: payment_reference ?? null,
                    status: "completed",
                    note: note ?? null,
                    source,
                })
                .returning();

            // 2. Generate a unique download token
            const token = crypto.randomBytes(32).toString("hex");
            const expiresAt = new Date();
            expiresAt.setDate(expiresAt.getDate() + 30); // 30-day access

            await tx.insert(digitalDownloads).values({
                userId,
                orderId: order.id,
                productId: product_id,
                customerEmail: customer_email,
                token,
                expiresAt,
            });

            // 3. Increment product sales count and revenue
            await tx
                .update(digitalProducts)
                .set({
                    salesCount: sql`${digitalProducts.salesCount} + 1`,
                    revenue: sql`${digitalProducts.revenue} + ${amount_paid}`,
                    updatedAt: new Date(),
                })
                .where(eq(digitalProducts.id, product_id));

            return { ...order, downloadToken: token };
        });

        return NextResponse.json(
            {
                id: result.id,
                order_number: result.orderNumber,
                product_id: result.productId,
                product_title: product.title,
                customer_name: result.customerName,
                customer_email: result.customerEmail,
                amount_paid: Number(result.amountPaid),
                currency: result.currency,
                payment_method: result.paymentMethod,
                status: result.status,
                source: result.source,
                download_token: result.downloadToken,
                createdAt: result.createdAt.toISOString(),
            },
            { status: 201 }
        );
    } catch (err) {
        console.error("[Digital Orders POST]", err);
        return NextResponse.json({ error: "Failed to record sale" }, { status: 500 });
    }
}

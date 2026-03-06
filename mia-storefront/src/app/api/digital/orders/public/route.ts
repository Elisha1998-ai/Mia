import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { digitalOrders, digitalDownloads, digitalProducts } from "@/lib/schema";
import { inArray, eq, sql } from "drizzle-orm";
import { randomBytes } from "crypto";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { items, customerName, customerEmail, amountPaid } = body;

        if (!items || !items.length) {
            return NextResponse.json({ error: "No items provided" }, { status: 400 });
        }

        const productIds = items.map((i: any) => i.id);

        // Fetch products to verify pricing and get the seller userId
        const products = await db
            .select()
            .from(digitalProducts)
            .where(inArray(digitalProducts.id, productIds));

        if (products.length === 0) {
            return NextResponse.json({ error: "Products not found" }, { status: 404 });
        }

        // Just use the first product's userId as the seller
        const sellerId = products[0].userId;

        // Create the order
        const [order] = await db.insert(digitalOrders).values({
            userId: sellerId,
            customerName: customerName || "Guest User",
            customerEmail: customerEmail || "guest@example.com",
            amountPaid: amountPaid ? amountPaid.toString() : "0",
            paymentMethod: "simulated_checkout",
            status: "completed",
        }).returning();

        const tokens: string[] = [];

        // Create download records for each product
        for (const product of products) {
            const token = randomBytes(16).toString("hex");
            tokens.push(token);

            // Set expiry based on your preference (e.g. 7 days from now)
            const expiry = new Date();
            expiry.setDate(expiry.getDate() + 7);

            await db.insert(digitalDownloads).values({
                userId: sellerId,
                productId: product.id,
                orderId: order.id,
                customerEmail: customerEmail || "guest@example.com",
                token: token,
                maxDownloads: 5,
                expiresAt: expiry,
            });

            // Increment sales count randomly to simulate activity
            await db.update(digitalProducts)
                .set({
                    salesCount: sql`${digitalProducts.salesCount} + 1`,
                    revenue: sql`${digitalProducts.revenue} + ${product.price}`,
                })
                .where(eq(digitalProducts.id, product.id));
        }

        return NextResponse.json({
            success: true,
            orderId: order.id,
            tokens: tokens
        });
    } catch (err) {
        console.error("[Public Checkout Order Error]", err);
        return NextResponse.json({ error: "Failed to process checkout" }, { status: 500 });
    }
}

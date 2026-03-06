// PUT /api/digital/products/[id] — update a digital product
// DELETE /api/digital/products/[id] — delete a digital product
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { digitalProducts, users } from "@/lib/schema";
import { eq, and } from "drizzle-orm";
import { auth } from "@/auth";

async function resolveUserId(rawId: string): Promise<string> {
    if (!rawId.includes("@")) return rawId;
    const [row] = await db.select({ id: users.id }).from(users).where(eq(users.email, rawId)).limit(1);
    return row?.id ?? rawId;
}

export async function PUT(request: Request, context: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await context.params;
        const session = await auth();
        if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const userId = await resolveUserId(session.user.id);
        const body = await request.json();

        const { title, slug, description, product_type, price, compare_at_price, cover_image_url, file_name, file_type, file_url, file_size_bytes, status } = body;

        const [updated] = await db
            .update(digitalProducts)
            .set({
                ...(title !== undefined && { title: title.trim() }),
                ...(slug !== undefined && { slug: slug.trim() }),
                ...(description !== undefined && { description }),
                ...(product_type !== undefined && { productType: product_type }),
                ...(price !== undefined && { price: price.toString() }),
                ...(compare_at_price !== undefined && { compareAtPrice: compare_at_price != null ? compare_at_price.toString() : null }),
                ...(cover_image_url !== undefined && { coverImageUrl: cover_image_url }),
                ...(file_name !== undefined && { fileName: file_name }),
                ...(file_type !== undefined && { fileType: file_type }),
                ...(file_url !== undefined && { fileUrl: file_url }),
                ...(file_size_bytes !== undefined && { fileSizeBytes: file_size_bytes }),
                ...(status !== undefined && { status }),
                updatedAt: new Date(),
            })
            .where(and(eq(digitalProducts.id, id), eq(digitalProducts.userId, userId)))
            .returning();

        if (!updated) return NextResponse.json({ error: "Product not found" }, { status: 404 });

        return NextResponse.json({
            id: updated.id,
            title: updated.title,
            slug: updated.slug,
            product_type: updated.productType,
            price: Number(updated.price),
            compare_at_price: updated.compareAtPrice ? Number(updated.compareAtPrice) : undefined,
            currency: updated.currency,
            cover_image_url: updated.coverImageUrl ?? undefined,
            file_name: updated.fileName ?? undefined,
            file_type: updated.fileType ?? undefined,
            file_url: updated.fileUrl ?? undefined,
            file_size_bytes: updated.fileSizeBytes ?? undefined,
            status: updated.status,
            sales_count: updated.salesCount,
            revenue: Number(updated.revenue),
            createdAt: updated.createdAt.toISOString(),
            updatedAt: updated.updatedAt.toISOString(),
        });
    } catch (err) {
        console.error("[Digital Products PUT]", err);
        return NextResponse.json({ error: "Failed to update digital product" }, { status: 500 });
    }
}

export async function DELETE(_request: Request, context: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await context.params;
        const session = await auth();
        if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const userId = await resolveUserId(session.user.id);

        await db
            .delete(digitalProducts)
            .where(and(eq(digitalProducts.id, id), eq(digitalProducts.userId, userId)));

        return NextResponse.json({ success: true });
    } catch (err) {
        console.error("[Digital Products DELETE]", err);
        return NextResponse.json({ error: "Failed to delete digital product" }, { status: 500 });
    }
}

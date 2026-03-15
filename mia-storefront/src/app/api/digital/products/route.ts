// GET /api/digital/products — list all digital products for user
// POST /api/digital/products — create a new digital product
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { digitalProducts, users, storeSettings } from "@/lib/schema";
import { desc, eq } from "drizzle-orm";
import { auth } from "@/auth";

async function resolveUserId(rawId: string): Promise<string> {
    if (!rawId.includes("@")) return rawId;
    const [row] = await db.select({ id: users.id }).from(users).where(eq(users.email, rawId)).limit(1);
    return row?.id ?? rawId;
}

export async function GET(request: Request) {
    try {
        let userId: string | undefined = undefined;

        // 1. Check if we are being accessed via a public subdomain
        const host = request.headers.get('host') || '';
        const isLocal = host.includes('localhost') || host.includes('127.0.0.1');
        const baseDomain = isLocal ? 'localhost' : 'bloume.shop';
        const isSubdomain = host.includes(`.${baseDomain}`) && !host.startsWith(`www.${baseDomain}`);

        if (isSubdomain) {
            const subdomain = host.split(`.${baseDomain}`)[0];
            const settings = await db.query.storeSettings.findFirst({
                where: eq(storeSettings.storeDomain, subdomain)
            });
            if (settings) {
                userId = settings.userId;
            } else {
                return NextResponse.json({ error: 'Store not found' }, { status: 404 });
            }
        } else {
            // 2. Otherwise we are relying on an active session (dashboard access)
            const session = await auth();
            if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
            userId = await resolveUserId(session.user.id);
        }

        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const products = await db
            .select()
            .from(digitalProducts)
            .where(eq(digitalProducts.userId, userId))
            .orderBy(desc(digitalProducts.createdAt));

        return NextResponse.json({
            products: products.map((p) => ({
                id: p.id,
                title: p.title,
                slug: p.slug,
                description: p.description,
                product_type: p.productType,
                price: Number(p.price),
                compare_at_price: p.compareAtPrice ? Number(p.compareAtPrice) : undefined,
                currency: p.currency,
                cover_image_url: p.coverImageUrl ?? undefined,
                file_url: p.fileUrl ?? undefined,
                file_name: p.fileName ?? undefined,
                file_type: p.fileType ?? undefined,
                file_size_bytes: p.fileSizeBytes ?? undefined,
                status: p.status,
                sales_count: p.salesCount,
                revenue: Number(p.revenue),
                createdAt: (p.createdAt as Date).toISOString(),
                updatedAt: (p.updatedAt as Date).toISOString(),
            })),
        });
    } catch (err) {
        console.error("[Digital Products GET]", err);
        return NextResponse.json({ error: "Failed to fetch digital products" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const session = await auth();
        if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const userId = await resolveUserId(session.user.id);
        const body = await request.json();

        const { title, slug, description, product_type, price, compare_at_price, cover_image_url, file_name, file_type, file_url, file_size_bytes, status } = body;

        if (!title || !slug || !product_type || price === undefined) {
            return NextResponse.json({ error: "title, slug, product_type and price are required" }, { status: 400 });
        }

        const [product] = await db
            .insert(digitalProducts)
            .values({
                userId,
                title: title.trim(),
                slug: slug.trim(),
                description: description ?? null,
                productType: product_type,
                price: price.toString(),
                compareAtPrice: compare_at_price != null ? compare_at_price.toString() : null,
                coverImageUrl: cover_image_url ?? null,
                fileName: file_name ?? null,
                fileType: file_type ?? null,
                fileUrl: file_url ?? null,
                fileSizeBytes: file_size_bytes ?? null,
                status: status ?? "draft",
            })
            .returning();

        return NextResponse.json(
            {
                id: product.id,
                title: product.title,
                slug: product.slug,
                product_type: product.productType,
                price: Number(product.price),
                compare_at_price: product.compareAtPrice ? Number(product.compareAtPrice) : undefined,
                currency: product.currency,
                cover_image_url: product.coverImageUrl ?? undefined,
                file_name: product.fileName ?? undefined,
                file_type: product.fileType ?? undefined,
                file_url: product.fileUrl ?? undefined,
                file_size_bytes: product.fileSizeBytes ?? undefined,
                status: product.status,
                sales_count: product.salesCount,
                revenue: Number(product.revenue),
                createdAt: product.createdAt.toISOString(),
            },
            { status: 201 }
        );
    } catch (err) {
        console.error("[Digital Products POST]", err);
        return NextResponse.json({ error: "Failed to create digital product" }, { status: 500 });
    }
}

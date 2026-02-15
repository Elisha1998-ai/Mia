import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { products as productsTable, productVariants as variantsTable } from '@/lib/schema';
import { desc, count, eq } from 'drizzle-orm';
import { auth } from '@/auth';

// GET /api/products - Get all products with pagination
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

    const { searchParams } = new URL(request.url);
    const skip = parseInt(searchParams.get('skip') || '0');
    const limit = parseInt(searchParams.get('limit') || '100');
    
    console.log('Fetching products for user:', userId);

    const [products, totalResult] = await Promise.all([
      db.query.products.findMany({
        where: eq(productsTable.userId, userId),
        orderBy: [desc(productsTable.createdAt)],
        limit: limit,
        offset: skip,
        with: {
          variants: true
        }
      }),
      db.select({ count: count() })
        .from(productsTable)
        .where(eq(productsTable.userId, userId))
    ]);

    console.log(`Found ${products.length} products out of ${totalResult[0]?.count} total for this user`);

    const total = totalResult[0]?.count || 0;

    return NextResponse.json({
      products: products.map(p => ({
        id: p.id,
        name: p.name,
        sku: p.sku,
        price: Number(p.price),
        stock_quantity: p.stockQuantity,
        description: p.description || undefined,
        image_url: p.imageUrl || undefined,
        platform: p.platform || undefined,
        created_at: new Date(p.createdAt).toISOString(),
        variants: p.variants?.map(v => ({
          id: v.id,
          name: v.name,
          sku: v.sku,
          price: v.price ? Number(v.price) : undefined,
          stock_quantity: v.stockQuantity,
          image_url: v.imageUrl || undefined
        }))
      })),
      total,
      skip,
      limit
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

// POST /api/products - Create a new product
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
    const { variants, ...productData } = body;
    
    // Generate SKU if not provided
    const sku = productData.sku && productData.sku.trim() !== '' 
      ? productData.sku 
      : `SKU-${Math.random().toString(36).toUpperCase().substring(2, 10)}`;

    const result = await db.transaction(async (tx) => {
      const [product] = await tx.insert(productsTable).values({
        userId: userId,
        name: productData.name,
        sku: sku,
        price: (productData.price || 0).toString(),
        stockQuantity: productData.stock_quantity || 0,
        description: productData.description,
        imageUrl: productData.image_url,
        platform: productData.platform
      }).returning();

      let createdVariants = [];
      if (variants && variants.length > 0) {
        createdVariants = await tx.insert(variantsTable).values(
          variants.map((v: any) => ({
            productId: product.id,
            name: v.name,
            sku: v.sku || `${sku}-${v.name.replace(/\s+/g, '-').toUpperCase()}`,
            price: v.price ? v.price.toString() : null,
            stockQuantity: v.stock_quantity || 0,
            imageUrl: v.image_url
          }))
        ).returning();
      }

      return { ...product, variants: createdVariants };
    });

    return NextResponse.json({
      id: result.id,
      name: result.name,
      sku: result.sku,
      price: Number(result.price),
      stock_quantity: result.stockQuantity,
      description: result.description || undefined,
      image_url: result.imageUrl || undefined,
      platform: result.platform || undefined,
      created_at: new Date(result.createdAt).toISOString(),
      variants: result.variants?.map(v => ({
        id: v.id,
        name: v.name,
        sku: v.sku,
        price: v.price ? Number(v.price) : undefined,
        stock_quantity: v.stockQuantity,
        image_url: v.imageUrl || undefined
      }))
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    );
  }
}

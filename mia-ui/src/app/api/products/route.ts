import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { products as productsTable } from '@/lib/schema';
import { desc, count, sql, eq, and } from 'drizzle-orm';
import { auth } from '@/auth';

// GET /api/products - Get all products with pagination
export async function GET(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const skip = parseInt(searchParams.get('skip') || '0');
    const limit = parseInt(searchParams.get('limit') || '100');
    
    const [products, totalResult] = await Promise.all([
      db.select()
        .from(productsTable)
        .where(eq(productsTable.userId, session.user.id))
        .orderBy(desc(productsTable.createdAt))
        .limit(limit)
        .offset(skip),
      db.select({ count: count() })
        .from(productsTable)
        .where(eq(productsTable.userId, session.user.id))
    ]);

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
        created_at: new Date(p.createdAt).toISOString()
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

    const body = await request.json();
    
    // Generate SKU if not provided
    const sku = body.sku && body.sku.trim() !== '' 
      ? body.sku 
      : `SKU-${Math.random().toString(36).toUpperCase().substring(2, 10)}`;

    const [product] = await db.insert(productsTable).values({
      userId: session.user.id,
      name: body.name,
      sku: sku,
      price: (body.price || 0).toString(),
      stockQuantity: body.stock_quantity || 0,
      description: body.description,
      imageUrl: body.image_url,
      platform: body.platform
    }).returning();

    return NextResponse.json({
      id: product.id,
      name: product.name,
      sku: product.sku,
      price: Number(product.price),
      stock_quantity: product.stockQuantity,
      description: product.description || undefined,
      image_url: product.imageUrl || undefined,
      platform: product.platform || undefined,
      created_at: new Date(product.createdAt).toISOString()
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    );
  }
}

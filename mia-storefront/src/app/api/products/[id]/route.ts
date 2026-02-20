import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { products as productsTable, productVariants as variantsTable } from '@/lib/schema';
import { eq, and } from 'drizzle-orm';
import { auth } from '@/auth';

// GET /api/products/[id] - Get a specific product
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const product = await db.query.products.findFirst({
      where: and(
        eq(productsTable.id, id),
        eq(productsTable.userId, userId)
      ),
      with: {
        variants: true
      }
    });

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      id: product.id,
      name: product.name,
      sku: product.sku,
      price: Number(product.price),
      stock_quantity: product.stockQuantity,
      description: product.description || undefined,
      image_url: product.imageUrl || undefined,
      platform: product.platform || undefined,
      created_at: new Date(product.createdAt).toISOString(),
      variants: product.variants?.map(v => ({
        id: v.id,
        name: v.name,
        sku: v.sku,
        price: v.price ? Number(v.price) : undefined,
        stock_quantity: v.stockQuantity,
        image_url: v.imageUrl || undefined
      }))
    });
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json(
      { error: 'Failed to fetch product' },
      { status: 500 }
    );
  }
}

// PUT /api/products/[id] - Update a product
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { variants, ...productData } = body;
    
    const result = await db.transaction(async (tx) => {
      const [product] = await tx.update(productsTable)
        .set({
          name: productData.name,
          sku: productData.sku && productData.sku.trim() !== '' ? productData.sku : undefined,
          price: (productData.price || 0).toString(),
          stockQuantity: productData.stock_quantity,
          description: productData.description,
          imageUrl: productData.image_url,
          platform: productData.platform,
          updatedAt: new Date()
        })
        .where(and(
          eq(productsTable.id, id),
          eq(productsTable.userId, userId)
        ))
        .returning();

      if (!product) return null;

      // Simple variant update strategy: delete and recreate
      // For a more robust app, we would update existing ones, but this is faster for now
      await tx.delete(variantsTable).where(eq(variantsTable.productId, id));
      
      let createdVariants = [];
      if (variants && variants.length > 0) {
        createdVariants = await tx.insert(variantsTable).values(
          variants.map((v: any) => ({
            productId: id,
            name: v.name,
            sku: v.sku || `${product.sku}-${v.name.replace(/\s+/g, '-').toUpperCase()}`,
            price: v.price ? v.price.toString() : null,
            stockQuantity: v.stock_quantity || 0,
            imageUrl: v.image_url
          }))
        ).returning();
      }

      return { ...product, variants: createdVariants };
    });

    if (!result) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

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
    });
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json(
      { error: 'Failed to update product' },
      { status: 500 }
    );
  }
}

// DELETE /api/products/[id] - Delete a product
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    
    const [product] = await db.delete(productsTable)
      .where(and(
        eq(productsTable.id, id),
        eq(productsTable.userId, userId)
      ))
      .returning();

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json(
      { error: 'Failed to delete product' },
      { status: 500 }
    );
  }
}

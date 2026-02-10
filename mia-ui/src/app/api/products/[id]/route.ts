import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { products as productsTable } from '@/lib/schema';
import { eq } from 'drizzle-orm';

// GET /api/products/[id] - Get a specific product
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const product = await db.query.products.findFirst({
      where: eq(productsTable.id, id)
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
      created_at: new Date(product.createdAt).toISOString()
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
    const { id } = await params;
    const body = await request.json();
    
    const [product] = await db.update(productsTable)
      .set({
        name: body.name,
        sku: body.sku && body.sku.trim() !== '' ? body.sku : undefined, // Don't overwrite with empty SKU if updating
        price: (body.price || 0).toString(),
        stockQuantity: body.stock_quantity,
        description: body.description,
        imageUrl: body.image_url,
        platform: body.platform,
        updatedAt: new Date()
      })
      .where(eq(productsTable.id, id))
      .returning();

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
      created_at: new Date(product.createdAt).toISOString()
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
    const { id } = await params;
    await db.delete(productsTable)
      .where(eq(productsTable.id, id));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json(
      { error: 'Failed to delete product' },
      { status: 500 }
    );
  }
}

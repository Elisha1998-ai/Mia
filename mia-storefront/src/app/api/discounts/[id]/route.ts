import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { discounts as discountsTable } from '@/lib/schema';
import { eq, and } from 'drizzle-orm';
import { auth } from '@/auth';

// DELETE /api/discounts/[id] - Delete a discount
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    await db.delete(discountsTable)
      .where(and(
        eq(discountsTable.id, id),
        eq(discountsTable.userId, session.user.id)
      ));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting discount:', error);
    return NextResponse.json(
      { error: 'Failed to delete discount' },
      { status: 500 }
    );
  }
}

// PATCH /api/discounts/[id] - Update a discount
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { code, type, value, status, startDate, endDate } = body;

    const updateData: any = {};
    if (code !== undefined) updateData.code = code;
    if (type !== undefined) updateData.type = type;
    if (value !== undefined) updateData.value = value.toString();
    if (status !== undefined) updateData.status = status;
    if (startDate !== undefined) updateData.startDate = new Date(startDate);
    if (endDate !== undefined) updateData.endDate = endDate ? new Date(endDate) : null;
    updateData.updatedAt = new Date();

    const [updatedDiscount] = await db.update(discountsTable)
      .set(updateData)
      .where(and(
        eq(discountsTable.id, id),
        eq(discountsTable.userId, session.user.id)
      ))
      .returning();

    if (!updatedDiscount) {
      return NextResponse.json({ error: 'Discount not found' }, { status: 404 });
    }

    return NextResponse.json({
      id: updatedDiscount.id,
      code: updatedDiscount.code,
      type: updatedDiscount.type,
      value: Number(updatedDiscount.value),
      status: updatedDiscount.status,
      usageCount: updatedDiscount.usageCount,
      startDate: updatedDiscount.startDate.toISOString().split('T')[0],
      endDate: updatedDiscount.endDate ? updatedDiscount.endDate.toISOString().split('T')[0] : undefined,
      createdAt: updatedDiscount.createdAt.toISOString()
    });
  } catch (error) {
    console.error('Error updating discount:', error);
    return NextResponse.json(
      { error: 'Failed to update discount' },
      { status: 500 }
    );
  }
}

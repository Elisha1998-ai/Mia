import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { discounts as discountsTable } from '@/lib/schema';
import { desc, count, eq } from 'drizzle-orm';
import { auth } from '@/auth';

// GET /api/discounts - Get all discounts for the current user
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

    const [discounts, totalResult] = await Promise.all([
      db.select()
        .from(discountsTable)
        .where(eq(discountsTable.userId, userId))
        .orderBy(desc(discountsTable.createdAt))
        .limit(limit)
        .offset(skip),
      db.select({ count: count() })
        .from(discountsTable)
        .where(eq(discountsTable.userId, userId))
    ]);

    const total = totalResult[0]?.count || 0;

    return NextResponse.json({
      discounts: discounts.map(d => {
        try {
          return {
            id: d.id,
            code: d.code,
            type: d.type as 'percentage' | 'fixed',
            value: Number(d.value),
            status: d.status as 'Active' | 'Scheduled' | 'Expired',
            usageCount: d.usageCount,
            startDate: d.startDate instanceof Date ? d.startDate.toISOString().split('T')[0] : String(d.startDate),
            endDate: d.endDate instanceof Date ? d.endDate.toISOString().split('T')[0] : (d.endDate ? String(d.endDate) : undefined),
            createdAt: d.createdAt instanceof Date ? d.createdAt.toISOString() : String(d.createdAt)
          };
        } catch (e) {
          console.error(`Error mapping discount ${d.id}:`, e);
          return null;
        }
      }).filter(Boolean),
      total,
      skip,
      limit
    });
  } catch (error) {
    console.error('Error fetching discounts:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch discounts',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}

// POST /api/discounts - Create a new discount
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
    const { code, type, value, startDate, endDate } = body;

    const [discount] = await db.insert(discountsTable).values({
      userId: userId,
      code,
      type,
      value: value.toString(),
      status: 'Active', // Default status
      startDate: new Date(startDate),
      endDate: endDate ? new Date(endDate) : null,
      usageCount: 0
    }).returning();

    return NextResponse.json({
      id: discount.id,
      code: discount.code,
      type: discount.type,
      value: Number(discount.value),
      status: discount.status,
      usageCount: discount.usageCount,
      startDate: discount.startDate.toISOString().split('T')[0],
      endDate: discount.endDate ? discount.endDate.toISOString().split('T')[0] : undefined,
      createdAt: discount.createdAt.toISOString()
    });
  } catch (error) {
    console.error('Error creating discount:', error);
    return NextResponse.json(
      { error: 'Failed to create discount' },
      { status: 500 }
    );
  }
}

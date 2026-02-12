import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { customers as customersTable } from '@/lib/schema';
import { eq, and } from 'drizzle-orm';
import { auth } from '@/auth';

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
    
    const [customer] = await db.delete(customersTable)
      .where(and(
        eq(customersTable.id, id),
        eq(customersTable.userId, session.user.id)
      ))
      .returning();

    if (!customer) {
      return NextResponse.json(
        { error: 'Customer not found' },
        { status: 404 }
      );
    }
      
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting customer:', error);
    return NextResponse.json(
      { error: 'Failed to delete customer' },
      { status: 500 }
    );
  }
}

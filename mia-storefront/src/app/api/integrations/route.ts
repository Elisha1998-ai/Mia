import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { stores as storesTable, users as usersTable } from '@/lib/schema';
import { eq } from 'drizzle-orm';
import { auth } from '@/auth';

export const revalidate = 0;

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let userId = session.user.id;
    
    // In development, handle email as ID
    if (userId.includes('@')) {
      const userRecord = await db.select({ id: usersTable.id })
        .from(usersTable)
        .where(eq(usersTable.email, userId))
        .limit(1);
      
      if (userRecord.length > 0) {
        userId = userRecord[0].id;
      }
    }

    const stores = await db.select()
      .from(storesTable)
      .where(eq(storesTable.userId, userId));

    return NextResponse.json({
      integrations: stores.map(store => ({
        id: store.id,
        name: store.name,
        platform: store.platform,
        storeUrl: store.storeUrl,
        isActive: store.isActive,
        createdAt: store.createdAt,
        status: store.isActive ? 'Connected' : 'Disconnected',
        // Map to common UI format
        type: 'Marketplace',
        logo: store.platform.toLowerCase() === 'shopify' 
          ? 'https://cdn.worldvectorlogo.com/logos/shopify.svg' 
          : 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg'
      }))
    });
  } catch (error) {
    console.error('Error fetching integrations:', error);
    return NextResponse.json({ error: 'Failed to fetch integrations' }, { status: 500 });
  }
}

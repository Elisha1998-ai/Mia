import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { storeSettings as storeSettingsTable } from '@/lib/schema';
import { eq } from 'drizzle-orm';
import { auth } from '@/auth';

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const settings = await db.query.storeSettings.findFirst({
      where: eq(storeSettingsTable.userId, userId)
    });
    
    // If no settings exist, create default for this user
    if (!settings) {
      const [defaultSettings] = await db.insert(storeSettingsTable).values({
        userId: userId,
        adminName: session.user.name || '',
        adminEmail: session.user.email || '',
        currency: 'Nigerian Naira (₦)',
        location: 'Nigeria',
      }).returning();
      return NextResponse.json(defaultSettings);
    }

    return NextResponse.json(settings);
  } catch (error) {
    console.error('Error fetching settings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch settings' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
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
    
    // Validate storeDomain if provided
    if (body.storeDomain) {
      const existingWithDomain = await db.query.storeSettings.findFirst({
        where: (settings, { eq, and, ne }) => and(
          eq(settings.storeDomain, body.storeDomain),
          ne(settings.userId, userId)
        )
      });

      if (existingWithDomain) {
        return NextResponse.json(
          { error: 'Store domain is already taken' },
          { status: 400 }
        );
      }
    }

    const existingSettings = await db.query.storeSettings.findFirst({
      where: eq(storeSettingsTable.userId, userId)
    });

    let settings;
    if (!existingSettings) {
      [settings] = await db.insert(storeSettingsTable).values({
        ...body,
        userId: userId,
      }).returning();
    } else {
      [settings] = await db.update(storeSettingsTable)
        .set({
          ...body,
          updatedAt: new Date()
        })
        .where(eq(storeSettingsTable.userId, userId))
        .returning();
    }

    return NextResponse.json(settings);
  } catch (error) {
    console.error('Error updating settings:', error);
    return NextResponse.json(
      { error: 'Failed to update settings' },
      { status: 500 }
    );
  }
}

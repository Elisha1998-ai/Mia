import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { storeSettings as storeSettingsTable } from '@/lib/schema';
import { eq } from 'drizzle-orm';

export async function GET() {
  try {
    const settings = await db.query.storeSettings.findFirst();
    
    // If no settings exist, create default
    if (!settings) {
      const [defaultSettings] = await db.insert(storeSettingsTable).values({}).returning();
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
    const body = await request.json();
    const { 
      storeName, 
      storeDomain, 
      currency, 
      location, 
      aiTone,
      adminRole
    } = body;

    const existingSettings = await db.query.storeSettings.findFirst();

    let settings;
    if (!existingSettings) {
      [settings] = await db.insert(storeSettingsTable).values({
        storeName,
        storeDomain,
        currency,
        location,
        aiTone,
        adminRole
      }).returning();
    } else {
      [settings] = await db.update(storeSettingsTable)
        .set({
          storeName,
          storeDomain,
          currency,
          location,
          aiTone,
          adminRole,
          updatedAt: new Date()
        })
        .where(eq(storeSettingsTable.id, existingSettings.id))
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

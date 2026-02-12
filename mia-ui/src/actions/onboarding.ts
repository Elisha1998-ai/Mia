"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { users, storeSettings, stores } from "@/lib/schema";
import { eq, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function saveOnboardingData(data: any) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "Unauthorized" };
    }

    const userId = session.user.id;

    // 1. Update User Details
    const userResults = await db.select().from(users).where(eq(users.id, userId)).limit(1);
    const existingUser = userResults[0];

    if (existingUser) {
      await db.update(users)
        .set({
          firstName: data.firstName,
          lastName: data.lastName,
          name: `${data.firstName} ${data.lastName}`.trim(),
        })
        .where(eq(users.id, userId));
    } else {
      await db.insert(users).values({
        id: userId,
        email: session.user.email || "dev@example.com",
        firstName: data.firstName,
        lastName: data.lastName,
        name: `${data.firstName} ${data.lastName}`.trim(),
      });
    }

    // 2. Create or Update Store
    // For now, we assume one store per user
    const results = await db.select()
      .from(stores)
      .where(and(
        eq(stores.name, data.storeName),
        eq(stores.userId, userId)
      ))
      .limit(1);
    
    let store = results[0];

  if (!store) {
    const slug = data.storeName.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    const [newStore] = await db.insert(stores).values({
      userId: userId,
      name: data.storeName,
      platform: "Custom",
      storeUrl: `bloume.shop/@${slug}`,
      isActive: true,
    }).returning();
    store = newStore;
  }

  // 3. Create or Update Store Settings
  const settingsResults = await db.select()
    .from(storeSettings)
    .where(eq(storeSettings.userId, userId))
    .limit(1);
  
  const existingSettings = settingsResults[0];
  const storeSlug = data.storeName.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

  const settingsData = {
    userId: userId,
    storeName: data.storeName,
    storeDomain: storeSlug,
    niche: data.niche,
      storeAddress: data.storeAddress,
      storePhone: data.storePhone,
      bankName: data.bankName,
      accountName: data.accountName,
      accountNumber: data.accountNumber,
      socialInstagram: data.socialInstagram,
      socialTwitter: data.socialTwitter,
      socialFacebook: data.socialFacebook,
      socialTiktok: data.socialTiktok,
      socialYoutube: data.socialYoutube,
      socialSnapchat: data.socialSnapchat,
      onboardingCompleted: true,
      adminName: `${data.firstName} ${data.lastName}`.trim(),
      adminEmail: session.user.email || "",
    };

    if (existingSettings) {
      await db.update(storeSettings)
        .set(settingsData)
        .where(eq(storeSettings.id, existingSettings.id));
    } else {
      await db.insert(storeSettings).values(settingsData);
    }

    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Error saving onboarding data:", error);
    return { success: false, error: "Internal Server Error" };
  }
}

export async function checkOnboardingStatus() {
  try {
    const session = await auth();
    if (!session?.user?.id) return { completed: false };

    // Use a standard select query instead of the query API to be safer
    const results = await db.select()
      .from(storeSettings)
      .where(eq(storeSettings.userId, session.user.id))
      .limit(1);

    const settings = results[0];

    return { completed: settings?.onboardingCompleted || false };
  } catch (error) {
    console.error("Error checking onboarding status:", error);
    return { completed: false };
  }
}

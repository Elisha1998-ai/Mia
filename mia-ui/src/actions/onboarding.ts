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
    // Try to find user by ID first, then by email
    let userResults = await db.select().from(users).where(eq(users.id, userId)).limit(1);
    if (userResults.length === 0 && session.user.email) {
      userResults = await db.select().from(users).where(eq(users.email, session.user.email)).limit(1);
    }
    
    const existingUser = userResults[0];
    
    // If we found a user by email but the ID in the session is different,
    // we should still use the database ID as the primary key.
    const targetUserId = existingUser ? existingUser.id : userId;

    const userData: any = {
      name: `${data.firstName} ${data.lastName}`.trim(),
    };

    // Check if schema has firstName/lastName columns before setting them
    if ("firstName" in users) userData.firstName = data.firstName;
    if ("lastName" in users) userData.lastName = data.lastName;

    if (existingUser) {
      await db.update(users)
        .set(userData)
        .where(eq(users.id, targetUserId));
    } else {
      await db.insert(users).values({
        id: targetUserId,
        email: session.user.email || "dev@example.com",
        ...userData
      });
    }

    // Use targetUserId for all subsequent operations
    const activeUserId = targetUserId;

    // 2. Create or Update Store
    // For now, we assume one store per user
    const results = await db.select()
      .from(stores)
      .where(eq(stores.userId, activeUserId))
      .limit(1);
    
    let store = results[0];

    const slug = data.storeName.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    const storeUrl = `bloume.shop/@${slug}`;

    if (!store) {
      const [newStore] = await db.insert(stores).values({
        userId: activeUserId,
        name: data.storeName,
        platform: "Custom",
        storeUrl: storeUrl,
        isActive: true,
      }).returning();
      store = newStore;
    } else {
      // Update existing store name and URL if needed
      await db.update(stores)
        .set({
          name: data.storeName,
          storeUrl: storeUrl,
        })
        .where(eq(stores.id, store.id));
    }

  // 3. Create or Update Store Settings
  const settingsResults = await db.select()
    .from(storeSettings)
    .where(eq(storeSettings.userId, activeUserId))
    .limit(1);
  
  const existingSettings = settingsResults[0];
  const storeSlug = data.storeName.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

  const settingsData = {
    userId: activeUserId,
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

    // Force revalidate all related paths
    revalidatePath("/dashboard", "layout");
    revalidatePath("/onboarding");
    revalidatePath("/", "layout");

    return { success: true };
  } catch (error) {
    console.error("Onboarding error:", error);
    // Return a more descriptive error if it's a known issue
    const errorMessage = error instanceof Error ? error.message : "Internal Server Error";
    return { success: false, error: errorMessage };
  }
}

export async function checkOnboardingStatus() {
  try {
    const session = await auth();
    if (!session?.user?.id) return { completed: false };

    const userId = session.user.id;
    const userEmail = session.user.email;

    // First try with the session ID
    let results = await db.select()
      .from(storeSettings)
      .where(eq(storeSettings.userId, userId))
      .limit(1);

    // If not found and we have an email, try finding the user by email first
    // to get their real database ID
    if (results.length === 0 && userEmail) {
      const userResults = await db.select().from(users).where(eq(users.email, userEmail)).limit(1);
      if (userResults.length > 0) {
        const realUserId = userResults[0].id;
        results = await db.select()
          .from(storeSettings)
          .where(eq(storeSettings.userId, realUserId))
          .limit(1);
      }
    }

    const settings = results[0];
    return { completed: settings?.onboardingCompleted || false };
  } catch (error) {
    console.error("Error checking onboarding status:", error);
    return { completed: false };
  }
}

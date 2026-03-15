import { db } from "@/lib/db";
import { storeSettings } from "@/lib/schema";
import { eq } from "drizzle-orm";

/**
 * Converts a string to a URL-safe slug.
 */
export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')     // Replace spaces with -
    .replace(/[^\w-]+/g, '')   // Remove all non-word chars
    .replace(/--+/g, '-')      // Replace multiple - with single -
    .replace(/^-+/, '')        // Trim - from start of text
    .replace(/-+$/, '');       // Trim - from end of text
}

/**
 * Generates a unique store domain based on a preferred name.
 * If the preferred name is taken, it appends a number.
 */
export async function generateUniqueDomain(preferredName: string, excludeUserId?: string): Promise<string> {
  const baseSlug = slugify(preferredName) || "store";
  let slug = baseSlug;
  let counter = 1;
  let isUnique = false;

  while (!isUnique) {
    // Check if this domain exists
    const existing = await db.query.storeSettings.findFirst({
        where: eq(storeSettings.storeDomain, slug)
    });

    if (!existing || (excludeUserId && existing.userId === excludeUserId)) {
      isUnique = true;
    } else {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    // Safety break
    if (counter > 100) {
      slug = `${baseSlug}-${Math.random().toString(36).substring(2, 7)}`;
      break;
    }
  }

  return slug;
}

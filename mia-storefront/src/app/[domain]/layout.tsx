import { StorefrontHeader, StorefrontFooter } from '@/components/storefront/StorefrontLayout';
import { auth } from '@/auth';
import { db } from '@/lib/db';
import { storeSettings as storeSettingsTable } from '@/lib/schema';
import { eq } from 'drizzle-orm';

export default async function StoreLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ domain: string }>;
}) {
  const session = await auth();
  const { domain } = await params;
  
  // Fetch store settings for the specific subdomain/domain
  let settings = await db.query.storeSettings.findFirst({
    where: eq(storeSettingsTable.storeDomain, domain)
  });

  // Fallback to user settings if logged in and store not found by domain 
  // (useful for previewing via main domain)
  if (!settings && session?.user?.id) {
    settings = await db.query.storeSettings.findFirst({
      where: eq(storeSettingsTable.userId, session.user.id)
    });
  }

  // Final fallback to any first store settings if still null 
  if (!settings) {
    settings = await db.query.storeSettings.findFirst();
  }

  const primaryColor = settings?.primaryColor || '#000000';
  const headingFont = settings?.headingFont || 'Instrument Serif';
  const bodyFont = settings?.bodyFont || 'Inter';

  // Map font names to CSS variables if they match our loaded Google fonts
   const fontMap: Record<string, string> = {
     'Instrument Serif': 'var(--font-serif)',
     'Inter': 'var(--font-inter)',
     'Playfair Display': 'var(--font-playfair)',
     'Montserrat': 'var(--font-montserrat)',
     'Roboto': 'var(--font-roboto)',
     'Lora': 'var(--font-lora)',
     'Bebas Neue': 'var(--font-bebas)',
     'Oswald': 'var(--font-oswald)',
     'Libre Baskerville': 'var(--font-baskerville)',
     'Cinzel': 'var(--font-cinzel)',
     'Poppins': 'var(--font-poppins)',
     'Raleway': 'var(--font-raleway)',
     'Quicksand': 'var(--font-quicksand)',
     'Space Grotesk': 'var(--font-space)',
     'Cormorant Garamond': 'var(--font-cormorant)',
     'Work Sans': 'var(--font-work)'
   };

  const headingFontValue = fontMap[headingFont] || headingFont;
  const bodyFontValue = fontMap[bodyFont] || bodyFont;

  return (
    <div 
      className="min-h-screen bg-white flex flex-col"
      style={{
        '--primary-color': primaryColor,
        '--heading-font': headingFontValue,
        '--body-font': bodyFontValue,
      } as React.CSSProperties}
    >
      <StorefrontHeader session={session} />
      <main className="flex-1 w-full lg:max-w-[70%] mx-auto px-6">
        {children}
      </main>
      <StorefrontFooter session={session} />
    </div>
  );
}

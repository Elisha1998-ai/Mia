import { StorefrontHeader, StorefrontFooter } from '@/components/storefront/StorefrontLayout';
import { auth } from '@/auth';
import { db } from '@/lib/db';
import { storeSettings as storeSettingsTable } from '@/lib/schema';
import { eq } from 'drizzle-orm';

export default async function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  
  // Fetch store settings for styling
  // For now, we fetch the first store settings or the user's settings if logged in
  let settings = null;
  if (session?.user?.id) {
    settings = await db.query.storeSettings.findFirst({
      where: eq(storeSettingsTable.userId, session.user.id)
    });
  } else {
    // Default settings if not logged in
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
      <main className="flex-1">
        {children}
      </main>
      <StorefrontFooter session={session} />
    </div>
  );
}

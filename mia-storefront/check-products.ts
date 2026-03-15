import { db } from './src/lib/db';
import { products, storeSettings } from './src/lib/schema';
import { eq } from 'drizzle-orm';

async function checkProducts() {
  try {
    const allSettings = await db.query.storeSettings.findMany();
    console.log('Stores found in DB:', allSettings.map(s => s.storeDomain).join(', '));
    
    for (const store of allSettings) {
      const storeProducts = await db.query.products.findMany({
        where: eq(products.userId, store.userId)
      });
      console.log(`Store [${store.storeDomain}] (User: ${store.userId}) has ${storeProducts.length} products.`);
    }
  } catch (err) {
    console.error('Error during check:', err);
  } finally {
    process.exit(0);
  }
}

checkProducts();

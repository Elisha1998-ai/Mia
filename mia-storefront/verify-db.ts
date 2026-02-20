
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { sql } from "drizzle-orm";
import * as fs from "fs";
import * as path from "path";

// Manually load .env.local
try {
  const envPath = path.resolve(process.cwd(), ".env.local");
  if (fs.existsSync(envPath)) {
    const envConfig = fs.readFileSync(envPath, 'utf8');
    envConfig.split('\n').forEach(line => {
      const match = line.match(/^([^=]+)=(.*)$/);
      if (match) {
        const key = match[1].trim();
        const value = match[2].trim().replace(/^"(.*)"$/, '$1');
        process.env[key] = value;
      }
    });
  }
} catch (e) {
  console.error("Error loading .env.local", e);
}

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error("DATABASE_URL is not set");
  process.exit(1);
}

const pool = new Pool({
  connectionString,
  ssl: { rejectUnauthorized: false }, 
});

const db = drizzle(pool);

async function main() {
  try {
    console.log("Connected to database...");
    
    // Raw SQL query to list all products
    const result = await db.execute(sql`SELECT * FROM products LIMIT 10`);
    
    console.log(`\nFound ${result.rowCount} products in the database:`);
    result.rows.forEach((row: any) => {
      console.log(`- [${row.id}] ${row.name} (Price: ${row.price}, Stock: ${row.stockQuantity || row.stock_quantity}, UserID: ${row.userId || row.user_id})`);
    });

    if (result.rowCount === 0) {
        console.log("\nWARNING: Table 'products' exists but is empty.");
    }

  } catch (error) {
    console.error("Error executing query:", error);
  } finally {
    await pool.end();
  }
}

main();

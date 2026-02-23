import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error("❌ DATABASE_URL is not set in environment variables");
  // Don't throw here to avoid crashing the whole app startup, 
  // but db operations will fail.
} else {
  console.log("✅ DATABASE_URL is found");
}

const pool = new Pool({
  connectionString: connectionString || "postgres://dummy:dummy@localhost:5432/dummy",
  ssl: process.env.NODE_ENV === "production" ? true : false,
});

export const db = drizzle(pool, { schema });

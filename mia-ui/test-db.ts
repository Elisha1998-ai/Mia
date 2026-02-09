import { db } from "./src/lib/db";

async function main() {
  try {
    const userCount = await db.user.count();
    console.log("User count:", userCount);
    process.exit(0);
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
}

main();

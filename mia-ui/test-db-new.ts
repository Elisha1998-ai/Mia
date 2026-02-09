import { db } from "./src/lib/db";

async function main() {
    try {
        // Testing the new schema structure
        const userCount = await db.user.count();
        console.log("Connection successful! User count:", userCount);
        process.exit(0);
    } catch (error) {
        console.error("Connection failed with new schema:", error);
        process.exit(1);
    }
}

main();

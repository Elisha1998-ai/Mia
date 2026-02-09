require('dotenv').config();
const { Pool } = require('@neondatabase/serverless');

const connectionString = process.env.DATABASE_URL;
console.log("Testing with URL:", connectionString ? "Found" : "Missing");

const pool = new Pool({ connectionString });

pool.query('SELECT COUNT(*) FROM "User"', (err, res) => {
    if (err) {
        console.error('Schema check failed:', err);
        process.exit(1);
    }
    console.log('Schema check successful! User count:', res.rows[0].count);
    pool.end();
});

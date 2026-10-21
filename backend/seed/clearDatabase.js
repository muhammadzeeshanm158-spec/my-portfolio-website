import mysql from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config();

const db = await mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

console.log("🧹 Database Clearing...");

const tables = ["hero", "about", "projects", "skills", "experience", "education", "messages"];

for (const table of tables) {
  try {
    await db.query(`DELETE FROM ${table}`);
    console.log(`✅ ${table} → Cleared`);
  } catch (err) {
    console.log(`⚠️ ${table} → ${err.message}`);
  }
}

console.log("\n🎉 All Tables Cleared! Database is now fresh & empty!");
await db.end();
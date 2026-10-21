import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

// Check karo saari env variables hain ya nahi
if (!process.env.DB_HOST || !process.env.DB_USER || !process.env.DB_NAME) {
    console.error("FATAL ERROR: DB credentials missing in .env file");
    process.exit(1);
}

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 3306, // Port add karna zaroori hai
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    enableKeepAlive: true, // Connection ko alive rakhega
    keepAliveInitialDelay: 0,
});

// Connection test ke liye function
const testConnection = async () => {
    try {
        const connection = await pool.getConnection();
        console.log("Connected to the database! successfully");
        connection.release();
    } catch (error) {
        console.error("Error connecting to the database:", error.message);
    }
};

testConnection();

export default pool;
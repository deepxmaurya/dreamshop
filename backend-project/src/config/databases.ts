import dotenv from "dotenv";
import mysql from "mysql2/promise";

dotenv.config({
  path: "./src/.env",
});

const pool = mysql.createPool({

  host: process.env.DB_HOST!,
  user: process.env.DB_USER!,
  password: process.env.DB_PASSWORD!,
  database: process.env.DB_NAME!,
  port: Number(process.env.DB_PORT || 4000),
  ssl: {
    minVersion: "TLSv1.2",
    rejectUnauthorized: true,
  },
  waitForConnections: true,
  connectionLimit: 10,
});

export async function testDatabaseConnection() {
  try {
    const connection = await pool.getConnection();
    console.log("MySQL connected successfully");
    connection.release();
  } catch (error) {
    console.error("MySQL connection failed:", error);
  }
}
<<<<<<< HEAD
export default pool;
=======

export default pool;
>>>>>>> d6bdb13 (database file changes)

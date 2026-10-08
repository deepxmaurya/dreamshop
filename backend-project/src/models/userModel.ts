import pool from "../config/databases";

export async function getAllUsers() {
    const [rows] = await pool.query(
        "SELECT id, username, role, image FROM users"
    );

    return rows;
}

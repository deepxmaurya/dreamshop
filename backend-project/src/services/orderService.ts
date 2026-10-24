import pool from "../config/databases";

export const getAllOrders = async () => {
    const [rows] = await pool.execute(
        `SELECT
            o.id,
            o.user_id,
            r.username AS customer_name,
            o.total_amount,
            o.status,
            o.created_at
         FROM orders o
         LEFT JOIN register r
            ON o.user_id = r.id
         ORDER BY o.created_at DESC`
    );

    return rows;
};



export const getOrderSummary = async () => {
    const [rows] = await pool.execute(`
        SELECT
            COUNT(*) AS total_orders,
            SUM(status = 'Pending') AS pending_orders,
            SUM(status = 'Delivered') AS delivered_orders,
            SUM(status = 'Cancelled') AS cancelled_orders
        FROM orders
        WHERE is_hidden = 0
    `);

    return rows;
};
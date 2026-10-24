
import { Request, Response } from "express";
import pool from "../config/databases";

export const getDashboard = async (
    req: Request,
    res: Response
) => {
    try {
        // JWT middleware se logged-in user ki ID
        const userId = req.user?.id;

        if (!userId) {
            return res.status(401).json({
                message: "User ID token mein nahi hai. Dobara login karo."
            });
        }

        // User ki profile
        const [userRows] = await pool.query(
            `SELECT id, username, role
             FROM register
             WHERE id = ?`,
            [userId]
        );

        const users = userRows as any[];

        if (users.length === 0) {
            return res.status(404).json({
                message: "User nahi mila"
            });
        }

        // Sirf isi user ke orders aur purchased products
        const [orderRows] = await pool.query(
            `SELECT
                o.id AS order_id,
                o.total_amount,
                o.status,
                o.created_at,
                oi.product_id,
                oi.quantity,
                oi.price AS purchase_price,
                p.name AS product_name,
                p.image AS product_image
             FROM orders o
             LEFT JOIN order_items oi
                ON o.id = oi.order_id
             LEFT JOIN products p
                ON oi.product_id = p.id
             WHERE o.user_id = ?
               AND o.is_hidden = 0
             ORDER BY o.created_at DESC`,
            [userId]
        );

        const rows = orderRows as any[];

        // Rows ko order ke hisaab se group karna
        const orderMap = new Map<number, any>();

        for (const row of rows) {
            if (!orderMap.has(row.order_id)) {
                orderMap.set(row.order_id, {
                    id: row.order_id,
                    total_amount: row.total_amount,
                    status: row.status,
                    created_at: row.created_at,
                    items: []
                });
            }

            if (row.product_id !== null) {
                orderMap.get(row.order_id).items.push({
                    product_id: row.product_id,
                    name: row.product_name,
                    image: row.product_image,
                    quantity: row.quantity,
                    price: row.purchase_price
                });
            }
        }

        return res.json({
            user: users[0],
            orders: Array.from(orderMap.values())
        });

    } catch (error) {
        console.error("Dashboard error:", error);

        return res.status(500).json({
            message: "Dashboard data fetch nahi ho paya"
        });
    }
};

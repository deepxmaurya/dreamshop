
import { Request, Response } from "express";
import pool from "../config/databases";
import { getAllOrders,getOrderSummary } from "../services/orderService";
import { RowDataPacket } from "mysql2";
// Customer apna Pending order cancel karega
export const cancelOrder = async (req: Request, res: Response) => {
    const userId = req.user?.id;
    const orderId = Number(req.params.id);

    if (!userId) {
        return res.status(401).json({
            message: "Login required"
        });
    }

    if (!Number.isInteger(orderId) || orderId <= 0) {
        return res.status(400).json({
            message: "Valid order ID required"
        });
    }

    const connection = await pool.getConnection();

    try {
        await connection.beginTransaction();

        const [orderRows] = await connection.query(
            `SELECT id, user_id, status
             FROM orders
             WHERE id = ?
             FOR UPDATE`,
            [orderId]
        );

        const orders = orderRows as any[];

        if (orders.length === 0) {
            await connection.rollback();
            return res.status(404).json({
                message: "Order nahi mila"
            });
        }

        const order = orders[0];

        // Customer sirf apna order cancel kar sakta hai
        if (Number(order.user_id) !== Number(userId)) {
            await connection.rollback();
            return res.status(403).json({
                message: "Ye order tumhara nahi hai"
            });
        }

        if (order.status !== "Pending") {
            await connection.rollback();
            return res.status(400).json({
                message: "Sirf Pending order cancel kar sakte ho"
            });
        }

        const [itemRows] = await connection.query(
            `SELECT product_id, quantity
             FROM order_items
             WHERE order_id = ?`,
            [orderId]
        );

        const items = itemRows as any[];

        // Cancel hone par products ka stock wapas badhao
        for (const item of items) {
            await connection.query(
                `UPDATE products
                 SET stock = stock + ?
                 WHERE id = ?`,
                [item.quantity, item.product_id]
            );
        }

        await connection.query(
            `UPDATE orders
             SET status = 'Cancelled'
             WHERE id = ?`,
            [orderId]
        );

        await connection.commit();

        return res.json({
            message: "Order successfully cancelled",
            order_id: orderId,
            status: "Cancelled"
        });
    } catch (error) {
        await connection.rollback();
        console.error("Cancel order error:", error);

        return res.status(500).json({
            message: "Order cancel nahi ho paya"
        });
    } finally {
        connection.release();
    }
};


// Admin order ko Delivered mark karega
export const markDelivered = async (req: Request, res: Response) => {
    const userId = req.user?.id;
    const orderId = Number(req.params.id);

    if (!userId) {
        return res.status(401).json({
            message: "Login required"
        });
    }

    if (!Number.isInteger(orderId) || orderId <= 0) {
        return res.status(400).json({
            message: "Valid order ID required"
        });
    }

    try {
        // Role database se verify karo
        const [userRows] = await pool.query(
            `SELECT role FROM register WHERE id = ?`,
            [userId]
        );

        const users = userRows as any[];

        if (users.length === 0 || users[0].role !== "admin") {
            return res.status(403).json({
                message: "Sirf admin order Delivered kar sakta hai"
            });
        }

        const [result]: any = await pool.query(
            `UPDATE orders
             SET status = 'Delivered'
             WHERE id = ?
               AND status IN ('Pending', 'Confirmed', 'Shipped')`,
            [orderId]
        );

        if (result.affectedRows === 0) {
            return res.status(400).json({
                message: "Order nahi mila ya uski status change nahi ho sakti"
            });
        }

        return res.json({
            message: "Order marked as Delivered",
            order_id: orderId,
            status: "Delivered"
        });
    } catch (error) {
        console.error("Mark delivered error:", error);

        return res.status(500).json({
            message: "Order status update nahi ho payi"
        });
    }
};



export const hideOrder = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const orderId = Number(req.params.id);

    if (!userId) {
      return res.status(401).json({
        message: "Login karna zaroori hai",
      });
    }

    if (!Number.isInteger(orderId) || orderId <= 0) {
      return res.status(400).json({
        message: "Invalid order ID",
      });
    }

    const [result]: any = await pool.query(
      `UPDATE orders
       SET is_hidden = 1
       WHERE id = ?
         AND user_id = ?
         AND status = 'Cancelled'
         AND is_hidden = 0`,
      [orderId, userId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Cancelled order nahi mila",
      });
    }

    return res.json({
      message: "Order Dashboard se hide ho gaya",
      order_id: orderId,
    });
  } catch (error) {
    console.error("Hide order error:", error);

    return res.status(500).json({
      message: "Order hide nahi ho paya",
    });
  }
};





export const getOrders = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const orders =  (await getAllOrders()) as RowDataPacket[];

        res.status(200).json({
            success: true,
            total: orders.length,
            orders: orders
        });
    } catch (error) {
        console.error("Get Orders Error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch orders"
        });
    }
};



export const getOrderSummaryController = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const summary = (await getOrderSummary())as RowDataPacket[] ;

        res.status(200).json({
            success: true,
            summary: summary[0]
        });
    } catch (error) {
        console.error("Order Summary Error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch order summary"
        });
    }
};
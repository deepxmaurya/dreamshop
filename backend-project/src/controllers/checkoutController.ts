
import { Request, Response } from "express";
import pool from "../config/databases";

export const checkout = async (req: Request, res: Response) => {
    const userId = req.user?.id;
    const { items } = req.body;

    if (!userId) {
        return res.status(401).json({
            message: "Not authenticated"
        });
    }

    if (!Array.isArray(items) || items.length === 0) {
        return res.status(400).json({
            message: "Cart items required"
        });
    }

    // Validate product IDs and quantities
    const seen = new Set<number>();

    for (const item of items) {
        if (
            !Number.isInteger(Number(item.product_id)) ||
            Number(item.product_id) <= 0 ||
            !Number.isInteger(Number(item.quantity)) ||
            Number(item.quantity) <= 0
        ) {
            return res.status(400).json({
                message: "Valid product_id and quantity required"
            });
        }

        if (seen.has(Number(item.product_id))) {
            return res.status(400).json({
                message: "Same product ko items mein ek hi baar bhejo"
            });
        }

        seen.add(Number(item.product_id));
    }

    const connection = await pool.getConnection();

    try {
        await connection.beginTransaction();

        let totalAmount = 0;
        const orderItems: {
            product_id: number;
            quantity: number;
            price: number;
        }[] = [];

        for (const item of items) {
            const productId = Number(item.product_id);
            const quantity = Number(item.quantity);

            const [rows] = await connection.query(
                `SELECT id, price, discount, stock
                 FROM products
                 WHERE id = ?
                 FOR UPDATE`,
                [productId]
            );

            const products = rows as any[];

            if (products.length === 0) {
                throw new Error(`Product ${productId} not found`);
            }

            const product = products[0];

            if (
                product.stock === null ||
                product.stock === undefined ||
                Number(product.stock) < quantity
            ) {
                throw new Error(
                    `Insufficient or undefined stock for product ${productId}`
                );
            }

            const price = Number(product.price);
            const discount = Number(product.discount ?? 0);

            if (
                !Number.isFinite(price) ||
                price < 0 ||
                !Number.isFinite(discount) ||
                discount < 0 ||
                discount > 100
            ) {
                throw new Error(`Invalid price or discount for product ${productId}`);
            }

            // Price after discount, rounded to 2 decimal places
            const finalPrice = Number(
                (price * (1 - discount / 100)).toFixed(2)
            );

            totalAmount += finalPrice * quantity;

            orderItems.push({
                product_id: productId,
                quantity,
                price: finalPrice
            });

            await connection.query(
                `UPDATE products
                 SET stock = stock - ?
                 WHERE id = ? AND stock >= ?`,
                [quantity, productId, quantity]
            );
        }

        totalAmount = Number(totalAmount.toFixed(2));

        const [orderResult]: any = await connection.query(
            `INSERT INTO orders (user_id, total_amount, status)
             VALUES (?, ?, ?)`,
            [userId, totalAmount, "Pending"]
        );

        const orderId = orderResult.insertId;

        for (const item of orderItems) {
            await connection.query(
                `INSERT INTO order_items
                 (order_id, product_id, quantity, price)
                 VALUES (?, ?, ?, ?)`,
                [
                    orderId,
                    item.product_id,
                    item.quantity,
                    item.price
                ]
            );
        }

        await connection.commit();

        return res.status(201).json({
            message: "Order placed successfully",
            order: {
                id: orderId,
                user_id: userId,
                total_amount: totalAmount,
                status: "Pending",
                items: orderItems
            }
        });
    } catch (error) {
        await connection.rollback();

        console.error("Checkout error:", error);

        return res.status(400).json({
            message: error instanceof Error
                ? error.message
                : "Checkout failed"
        });
    } finally {
        connection.release();
    }
};

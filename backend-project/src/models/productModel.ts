 import pool from "../config/databases";

import { Request, Response } from "express";
 export async function getAllProducts() {
    const [rows] = await pool.query(
        "SELECT id, image, price, discount FROM products"
    );

    return rows;
}  

export async function getProductById(
    req: Request,
    res: Response
) {
    try {
        const { id } = req.params;

        const [rows] = await pool.query(
            `SELECT * FROM products
             WHERE id = ?`,
            [id]
        );

        const products = rows as any[];

        if (products.length === 0) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        res.json(products[0]);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to get product"
        });
    }
}
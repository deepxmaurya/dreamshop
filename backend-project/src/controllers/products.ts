import { Request, Response } from "express";
import { getAllProducts } from "../models/productModel";

export async function getProducts(req: Request, res: Response) {
    try {
      const users = await getAllProducts();
        res.json(users);
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch product"
        });
    }
}
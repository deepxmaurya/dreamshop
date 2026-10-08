import { Router } from "express";
import { getProducts } from "../controllers/products";
import { getProductById } from "../models/productModel";
import { getMe } from "../controllers/userLogout";
const router = Router();


router.get("/", getProducts);
router.get("/:id", getProductById);

export default router;
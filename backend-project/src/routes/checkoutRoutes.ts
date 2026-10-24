
import { Router } from "express";
import { checkout } from "../controllers/checkoutController";
import { authenticate } from "../middleware/authMiddleware";

const router = Router();

router.post("/", authenticate, checkout);

export default router;

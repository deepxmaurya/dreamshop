
import { Router } from "express";
import { authenticate,authorizeAdmin } from "../middleware/authMiddleware";
import {
    cancelOrder,
    markDelivered,
      hideOrder
} from "../controllers/orderController";
import { getOrders ,getOrderSummaryController} from "../controllers/orderController";
const router = Router();

router.post("/:id/cancel", authenticate, cancelOrder);

router.patch("/:id/delivered", authenticate, markDelivered);
router.delete("/:id", authenticate, hideOrder);
router.get("/", authenticate,authorizeAdmin,getOrders);
router.get("/summary", authenticate,authorizeAdmin,getOrderSummaryController);

export default router;

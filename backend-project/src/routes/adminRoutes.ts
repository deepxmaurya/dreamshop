
import { Router } from "express";
import {
    authenticate,
    authorizeAdmin
} from "../middleware/authMiddleware";

const router = Router();

router.get(
    "/dashboard",
    authenticate,
    authorizeAdmin,
    (req, res) => {
        res.json({
            message: "Admin Panel access successful",
            admin: req.user
        });
    }
);

export default router;

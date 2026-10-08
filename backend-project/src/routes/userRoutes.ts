import { Router } from "express";
import { getUsers } from "../controllers/userController";
import { register } from "../controllers/userRegister";
import { login } from "../controllers/userLogin";
import { logout } from "../controllers/userLogout";
import { authenticate } from "../middleware/authMiddleware";

import { getMe } from "../controllers/userLogout";
const router = Router();

router.get("/", getUsers);
router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/me", authenticate, getMe);


export default router;
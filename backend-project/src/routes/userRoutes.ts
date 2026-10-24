import { Router } from "express";
import { getUsers,getRegister } from "../controllers/userController";
import { register } from "../controllers/userRegister";
import { login } from "../controllers/userLogin";
import { logout } from "../controllers/userLogout";
import { authenticate ,authorizeAdmin} from "../middleware/authMiddleware";
import { getDashboard } from "../controllers/dashboardController";
import { getMe } from "../controllers/userLogout";
const router = Router();

router.get("/", getUsers);
router.get("/register",authenticate,authorizeAdmin,getRegister);

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/me", authenticate, getMe);
router.get("/dashboard", authenticate, getDashboard);


export default router;
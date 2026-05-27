import UserController from "../controllers/UserController.js";
import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = Router();
router.post("/api/register", UserController.register);
router.post("/api/login", UserController.login);
router.get("/api/users", UserController.getUserById);
router.get("/api/users/all", UserController.getAllUsers);
router.put("/api/users", UserController.updateUser);
router.post("/api/users/reset-password", UserController.resetPassword);
router.post("/google", authMiddleware, UserController.googleLogin);

export default router;
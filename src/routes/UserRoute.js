import UserController from "../controllers/UserController.js";
import { Router } from "express";

const router = Router();
router.post("/api/register", UserController.register);
router.post("/api/login", UserController.login);
router.get("/api/users", UserController.getUserById);
router.get("/api/users/all", UserController.getAllUsers);

export default router;
import {Router} from "express";
import OrderController from "../controllers/OrderController.js";
import authMiddleware from "../middleware/authMiddleware.js";
const router = Router();

router.post("/api/orders", authMiddleware, OrderController.placeOrder);
router.get("/api/orders", authMiddleware, OrderController.getOrderByUserId);

export default router;
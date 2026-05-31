import { Router } from "express";
import CartController from "../controllers/CartController.js";
import authMiddleware from "../middleware/authMiddleware.js";
const router = Router();

router.post("/api/cart", authMiddleware, CartController.addToCart);
router.get("/api/cart", authMiddleware, CartController.getCartByUserId);
router.delete("/api/cart", authMiddleware, CartController.removeFromCart);
router.put("/api/cart", authMiddleware, CartController.updateQuantity);

export default router;
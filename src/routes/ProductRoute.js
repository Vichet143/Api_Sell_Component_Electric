import { Router } from "express";
import ProductController from "../controllers/ProductController.js";
import upload from "../middleware/middlewareUploadImage.js";
const router = Router();

router.post("/api/products",upload.single("image"), ProductController.addProduct);
router.put("/api/products",upload.single("image"), ProductController.updateProduct);
router.delete("/api/products", ProductController.deleteProduct);
router.get("/api/allProducts", ProductController.getAllProducts);
router.get("/api/products", ProductController.getProductById);
export default router;

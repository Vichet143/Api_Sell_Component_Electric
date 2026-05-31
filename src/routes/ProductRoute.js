import { Router } from "express";
import ProductController from "../controllers/ProductController.js";
import upload from "../middleware/middlewareUploadImage.js";
const router = Router();

router.post("/api/products",upload.single("image"), ProductController.addProduct);
export default router;

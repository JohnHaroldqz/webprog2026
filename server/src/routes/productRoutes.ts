import express from "express"
import { getProducts } from "../controllers/productController.ts";
const router = express.Router()

// Routes
router.get('/', getProducts)

export default router
import express from "express"
import { getAbout } from "../controllers/aboutController.ts";
const router = express.Router()

// Routes
router.get('/', getAbout)

export default router
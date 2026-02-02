import { Router } from "express";
import * as category from "../controllers/categoryController.js";

const router = Router();

router.get("/", category.getAll);
router.get("/:slug", category.getBySlug);

export default router;

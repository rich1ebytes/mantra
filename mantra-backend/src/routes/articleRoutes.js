import { Router } from "express";
import * as article from "../controllers/articleController.js";
import { authenticate } from "../middleware/auth.js";
import { roleGuard } from "../middleware/roleGuard.js";
import { validate } from "../middleware/validate.js";
import { createArticleSchema, updateArticleSchema } from "../validators/articleSchema.js";

const router = Router();

// Public
router.get("/", article.getAll);
router.get("/trending", article.getTrending);
router.get("/search", article.search);
router.get("/:slug", article.getBySlug);

// Authenticated — article CRUD
router.post("/", authenticate, validate(createArticleSchema), article.create);
router.patch("/:id", authenticate, validate(updateArticleSchema), article.update);
router.delete("/:id", authenticate, article.remove);

// Moderation — ADMIN / MODERATOR only
router.patch("/:id/status", authenticate, roleGuard(["ADMIN", "MODERATOR"]), article.updateStatus);
router.get("/pending/review", authenticate, roleGuard(["ADMIN", "MODERATOR"]), article.getPending);

export default router;

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

// Moderation — ADMIN / MODERATOR only (MUST be before /:slug)
router.get("/pending/review", authenticate, roleGuard(["ADMIN", "MODERATOR"]), article.getPending);

// User's own drafts (MUST be before /:slug)
router.get("/my/drafts", authenticate, article.getMyDrafts);

// Public — single article by slug
router.get("/:slug", article.getBySlug);

// Authenticated — article CRUD
router.post("/", authenticate, validate(createArticleSchema), article.create);
router.patch("/:id", authenticate, validate(updateArticleSchema), article.update);
router.delete("/:id", authenticate, article.remove);

// Moderation — status update
router.patch("/:id/status", authenticate, roleGuard(["ADMIN", "MODERATOR"]), article.updateStatus);

export default router;

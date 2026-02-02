import { Router } from "express";
import authRoutes from "./authRoutes.js";
import userRoutes from "./userRoutes.js";
import articleRoutes from "./articleRoutes.js";
import originRoutes from "./originRoutes.js";
import categoryRoutes from "./categoryRoutes.js";
import bookmarkRoutes from "./bookmarkRoutes.js";
import chatRoutes from "./chatRoutes.js";
import { globalRateLimit } from "../middleware/rateLimit.js";

const router = Router();

// Apply global rate limiter
router.use(globalRateLimit);

// Mount all route modules
router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/articles", articleRoutes);
router.use("/origins", originRoutes);
router.use("/categories", categoryRoutes);
router.use("/bookmarks", bookmarkRoutes);
router.use("/chat", chatRoutes);

export default router;

import { Router } from "express";
import * as bookmark from "../controllers/bookmarkController.js";
import { authenticate } from "../middleware/auth.js";

const router = Router();

router.use(authenticate); // All bookmark routes require auth

router.get("/", bookmark.getUserBookmarks);
router.post("/:articleId", bookmark.add);
router.delete("/:articleId", bookmark.remove);
router.get("/check/:articleId", bookmark.isBookmarked);

export default router;

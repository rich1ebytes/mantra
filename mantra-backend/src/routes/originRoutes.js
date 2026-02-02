import { Router } from "express";
import * as origin from "../controllers/originController.js";
import { authenticate } from "../middleware/auth.js";
import { roleGuard } from "../middleware/roleGuard.js";

const router = Router();

router.get("/", origin.getAll);
router.get("/:id", origin.getById);
router.post("/", authenticate, roleGuard(["ADMIN"]), origin.create);
router.patch("/:id", authenticate, roleGuard(["ADMIN"]), origin.update);

export default router;

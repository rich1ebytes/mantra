import { Router } from "express";
import * as auth from "../controllers/authController.js";
import { validate } from "../middleware/validate.js";
import { registerSchema, loginSchema } from "../validators/authSchema.js";

const router = Router();

router.post("/register", validate(registerSchema), auth.register);
router.post("/login", validate(loginSchema), auth.login);
router.post("/logout", auth.logout);
router.post("/refresh", auth.refreshToken);
router.post("/forgot-password", auth.forgotPassword);

// REMOVED: router.post("/reset-password", auth.resetPassword)
// Password reset is handled on the frontend via Supabase client SDK

export default router;

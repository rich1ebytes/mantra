import { Router } from "express";
import * as user from "../controllers/userController.js";
import { authenticate } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { updateProfileSchema, updatePreferencesSchema } from "../validators/userSchema.js";

const router = Router();

router.get("/me", authenticate, user.getMe);
router.patch("/me", authenticate, validate(updateProfileSchema), user.updateProfile);
router.put("/me/preferences", authenticate, validate(updatePreferencesSchema), user.updatePreferences);
router.get("/me/reading-history", authenticate, user.getReadingHistory);
router.get("/:username", user.getPublicProfile);

export default router;

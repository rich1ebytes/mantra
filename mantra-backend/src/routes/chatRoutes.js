import { Router } from "express";
import * as chat from "../controllers/chatController.js";
import { authenticate } from "../middleware/auth.js";
import { chatRateLimit } from "../middleware/rateLimit.js";
import { validate } from "../middleware/validate.js";
import { sendMessageSchema, createSessionSchema } from "../validators/chatSchema.js";

const router = Router();

router.use(authenticate); // All chat routes require auth

// Sessions
router.get("/sessions", chat.getSessions);
router.post("/sessions", validate(createSessionSchema), chat.createSession);
router.get("/sessions/:id", chat.getSessionWithMessages);
router.delete("/sessions/:id", chat.deleteSession);

// Messages
router.post("/messages", chatRateLimit, validate(sendMessageSchema), chat.sendMessage);
router.post("/messages/stream", chatRateLimit, validate(sendMessageSchema), chat.streamMessage);

// AI Features
router.post("/briefing", chatRateLimit, chat.generateBriefing);
router.post("/summarize/:articleId", chatRateLimit, chat.summarizeArticle);
router.get("/suggestions", chat.getSuggestions);

export default router;

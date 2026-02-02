import rateLimit from "express-rate-limit";
import { RATE_LIMITS } from "../utils/constants.js";

/**
 * Global API rate limiter
 */
export const globalRateLimit = rateLimit({
  windowMs: RATE_LIMITS.GLOBAL_WINDOW_MS,
  max: RATE_LIMITS.GLOBAL_MAX_REQUESTS,
  message: { error: "Too many requests, please try again later" },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * Stricter rate limiter for AI chat endpoints
 */
export const chatRateLimit = rateLimit({
  windowMs: RATE_LIMITS.CHAT_WINDOW_MS,
  max: RATE_LIMITS.CHAT_MAX_REQUESTS,
  message: { error: "Too many chat messages. Please wait a moment." },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => req.userId || req.ip, // rate limit per user
});

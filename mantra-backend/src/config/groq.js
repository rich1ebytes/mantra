import Groq from "groq-sdk";
import { env } from "./env.js";

const groq = new Groq({
  apiKey: env.GROQ_API_KEY,
});

// Model choices — Groq free tier
export const PRIMARY_MODEL = "llama-3.3-70b-versatile"; // Chat, recommendations, briefings
export const FAST_MODEL = "llama-3.1-8b-instant"; // Quick summarization, intent detection

export default groq;

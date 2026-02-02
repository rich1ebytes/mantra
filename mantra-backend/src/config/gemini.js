import { GoogleGenerativeAI } from "@google/generative-ai";
import { env } from "./env.js";

const genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY);

// Primary model — chat, recommendations, briefings
export const geminiModel = genAI.getGenerativeModel({
  model: "gemini-2.0-flash",
});

// Lightweight model — quick summarization, intent detection
export const geminiFlash = genAI.getGenerativeModel({
  model: "gemini-2.0-flash-lite",
});

export default genAI;

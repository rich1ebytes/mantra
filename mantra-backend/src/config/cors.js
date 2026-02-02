import { env } from "./env.js";

export const corsOptions = {
  origin: env.NODE_ENV === "production"
    ? [env.FRONTEND_URL]
    : ["http://localhost:5173", "http://localhost:3000"],
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

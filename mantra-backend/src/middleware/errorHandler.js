import { ApiError } from "../utils/ApiError.js";
import { formatPrismaError } from "../utils/helpers.js";

/**
 * Centralized error handling middleware.
 * Must be registered LAST in the middleware chain.
 */
export function errorHandler(err, _req, res, _next) {
  // Log in development
  if (process.env.NODE_ENV === "development") {
    console.error("❌ Error:", err);
  }

  // Known API errors
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      error: err.message,
      ...(err.details && { details: err.details }),
    });
  }

  // Supabase Auth errors
  if (err.status && err.message) {
    return res.status(err.status).json({ error: err.message });
  }

  // Prisma errors
  if (err.code?.startsWith("P")) {
    const message = formatPrismaError(err);
    const status = err.code === "P2025" ? 404 : 400;
    return res.status(status).json({ error: message });
  }

  // Zod validation errors
  if (err.name === "ZodError") {
    return res.status(400).json({
      error: "Validation failed",
      details: err.issues.map((i) => ({
        field: i.path.join("."),
        message: i.message,
      })),
    });
  }

  // Fallback
  return res.status(500).json({
    error:
      process.env.NODE_ENV === "production"
        ? "Internal server error"
        : err.message,
  });
}

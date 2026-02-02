import slugify from "slugify";
import readingTime from "reading-time";

/**
 * Generate a URL-safe slug from a title, with a random suffix to prevent collisions
 */
export function generateSlug(title) {
  const base = slugify(title, { lower: true, strict: true, trim: true });
  const suffix = Math.random().toString(36).substring(2, 8);
  return `${base}-${suffix}`;
}

/**
 * Calculate reading time in minutes from article content (HTML or plain text)
 */
export function calculateReadingTime(content) {
  const text = content.replace(/<[^>]*>/g, ""); // strip HTML tags
  const stats = readingTime(text);
  return Math.max(1, Math.ceil(stats.minutes));
}

/**
 * Build pagination metadata
 */
export function paginate(page = 1, limit = 20) {
  const p = Math.max(1, parseInt(page, 10) || 1);
  const l = Math.min(100, Math.max(1, parseInt(limit, 10) || 20));
  return { skip: (p - 1) * l, take: l, page: p, limit: l };
}

/**
 * Format Prisma errors into user-friendly messages
 */
export function formatPrismaError(error) {
  if (error.code === "P2002") {
    const field = error.meta?.target?.[0] || "field";
    return `A record with this ${field} already exists`;
  }
  if (error.code === "P2025") {
    return "Record not found";
  }
  return "Database error";
}

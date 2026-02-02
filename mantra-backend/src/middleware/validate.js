import { ApiError } from "../utils/ApiError.js";

/**
 * Validate request body against a Zod schema.
 *
 * Usage: validate(createArticleSchema)
 */
export function validate(schema) {
  return (req, _res, next) => {
    try {
      const result = schema.safeParse(req.body);
      if (!result.success) {
        const errors = result.error.issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message,
        }));
        throw ApiError.badRequest("Validation failed", errors);
      }
      req.body = result.data; // use the parsed (sanitized) data
      next();
    } catch (err) {
      next(err);
    }
  };
}

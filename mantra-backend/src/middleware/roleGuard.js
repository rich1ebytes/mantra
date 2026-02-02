import prisma from "../config/prisma.js";
import { ApiError } from "../utils/ApiError.js";

/**
 * Restrict access to specific roles.
 * Must be used AFTER `authenticate` middleware.
 *
 * Usage: roleGuard(["ADMIN", "MODERATOR"])
 */
export function roleGuard(allowedRoles = []) {
  return async (req, _res, next) => {
    try {
      const user = await prisma.user.findUnique({
        where: { id: req.userId },
        select: { role: true },
      });

      if (!user) {
        throw ApiError.unauthorized("User not found");
      }

      if (!allowedRoles.includes(user.role)) {
        throw ApiError.forbidden(
          `Access denied. Required role: ${allowedRoles.join(" or ")}`
        );
      }

      req.userRole = user.role;
      next();
    } catch (err) {
      next(err);
    }
  };
}

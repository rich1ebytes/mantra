import { supabase } from "../config/supabase.js";
import { ApiError } from "../utils/ApiError.js";

/**
 * Authenticate requests using Supabase JWT from Authorization header.
 * Attaches `req.user` (Supabase user object) and `req.userId` on success.
 */
export async function authenticate(req, _res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
      throw ApiError.unauthorized("Missing or invalid authorization header");
    }

    const token = authHeader.split(" ")[1];

    const {
      data: { user },
      error,
    } = await supabase.auth.getUser(token);

    if (error || !user) {
      throw ApiError.unauthorized("Invalid or expired token");
    }

    req.user = user;
    req.userId = user.id;
    next();
  } catch (err) {
    next(err);
  }
}

import * as authService from "../services/authService.js";
import { env } from "../config/env.js";

export async function register(req, res, next) {
  try {
    const result = await authService.register(req.body);
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
}

export async function login(req, res, next) {
  try {
    const result = await authService.login(req.body);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

export async function logout(_req, res, next) {
  try {
    await authService.logout();
    res.json({ message: "Logged out successfully" });
  } catch (err) {
    next(err);
  }
}

export async function refreshToken(req, res, next) {
  try {
    const { refresh_token } = req.body;
    const session = await authService.refreshSession(refresh_token);
    res.json({ session });
  } catch (err) {
    next(err);
  }
}

export async function forgotPassword(req, res, next) {
  try {
    const redirectTo = `${env.FRONTEND_URL}/reset-password`;
    await authService.forgotPassword(req.body.email, redirectTo);
    res.json({ message: "Password reset email sent" });
  } catch (err) {
    next(err);
  }
}

// REMOVED: resetPassword — handled entirely on the frontend via Supabase client SDK

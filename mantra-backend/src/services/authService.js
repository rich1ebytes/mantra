import { supabase, supabaseAdmin } from "../config/supabase.js";
import prisma from "../config/prisma.js";

/**
 * Register a new user via Supabase Auth + create profile in DB
 */
export async function register({ email, password, username, displayName }) {
  // 1. Create Supabase auth user
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { username, display_name: displayName },
    },
  });

  if (authError) throw authError;

  // 2. Create user profile in Prisma DB
  const user = await prisma.user.create({
    data: {
      id: authData.user.id, // use Supabase UID as primary key
      email,
      username,
      displayName: displayName || username,
      role: "READER",
    },
  });

  return { user, session: authData.session };
}

/**
 * Sign in with email/password
 */
export async function login({ email, password }) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;

  const user = await prisma.user.findUnique({
    where: { id: data.user.id },
    include: { preferences: true },
  });

  return { user, session: data.session };
}

/**
 * Sign out
 */
export async function logout() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

/**
 * Refresh session
 */
export async function refreshSession(refreshToken) {
  const { data, error } = await supabase.auth.refreshSession({
    refresh_token: refreshToken,
  });
  if (error) throw error;
  return data.session;
}

/**
 * Send password reset email
 * CHANGED: use supabaseAdmin instead of supabase so it works server-side without a session
 */
export async function forgotPassword(email, redirectTo) {
  const { error } = await supabaseAdmin.auth.resetPasswordForEmail(email, {
    redirectTo,
  });
  if (error) throw error;
}

// REMOVED: resetPassword() — the server has no session context so updateUser() can't know
// which user to update. The frontend ResetPasswordPage handles this correctly via the
// client-side Supabase SDK using the token from the email link.

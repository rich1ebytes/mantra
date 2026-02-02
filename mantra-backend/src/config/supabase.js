import { createClient } from "@supabase/supabase-js";
import { env } from "./env.js";

// Public client — respects Row Level Security (use for user-facing operations)
export const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY);

// Admin client — bypasses RLS (use for server-side operations like admin tasks)
export const supabaseAdmin = createClient(
  env.SUPABASE_URL,
  env.SUPABASE_SERVICE_ROLE_KEY
);

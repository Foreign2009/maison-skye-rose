import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// Server-only admin client using the service role key.
// Bypasses RLS — only call this from API routes, never from client components or pages.
// Lazy-initialized so build-time evaluation does not require the env var to be present.

let _admin: SupabaseClient | null = null;

export function getSupabaseAdmin(): SupabaseClient {
  if (_admin) return _admin;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error(
      "[supabaseAdmin] NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is not configured"
    );
  }

  _admin = createClient(url, key, {
    auth: {
      autoRefreshToken: false,
      persistSession:   false,
    },
  });

  return _admin;
}

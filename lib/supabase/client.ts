import { createClient, SupabaseClient } from "@supabase/supabase-js";

// Next.js keeps fetch() results in its Data Cache - on Vercel even across
// deployments - unless a request opts out. Supabase reads must always be live
// (the job portal's counts stayed frozen at the first import's 12 jobs).
const liveFetch: typeof fetch = (input, init) => fetch(input, { ...init, cache: "no-store" });

/**
 * Public/anon client - safe to use anywhere (RLS enforces read-only access
 * to journeys/blueprints/questions, and session-owner-only reads elsewhere).
 * Never use this one to write assessment_sessions/responses/scores from a
 * context you don't fully trust - that's what the admin client is for.
 */
export function getSupabaseClient(): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY"
    );
  }
  return createClient(url, anonKey, { global: { fetch: liveFetch } });
}

/**
 * Admin client - service role key, bypasses RLS entirely.
 * Server-only. Never import this into a client component or expose the key
 * to the browser. Used by API routes to generate sessions, write session
 * questions, and compute scores.
 */
export function getSupabaseAdmin(): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY"
    );
  }
  return createClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
    global: { fetch: liveFetch },
  });
}

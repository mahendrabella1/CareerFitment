/**
 * The Supabase side of the job portal. SERVER ONLY: uses the service-role
 * key (bypasses row-level security). Never import this from a client
 * component - the guard below throws if it is ever bundled for the browser.
 */
import type { SupabaseClient } from "@supabase/supabase-js";
import { getSupabaseAdmin } from "@/lib/supabase/client";
import type { JobStore } from "./importer";
import type { JobSource, NormalizedJob, SourceRunResult } from "./types";

if (typeof window !== "undefined") {
  throw new Error("lib/jobs/store.ts is server-only");
}

export function isJobsDbConfigured(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
}

export function supabaseJobStore(db: SupabaseClient = getSupabaseAdmin()): JobStore {
  return {
    async ensureSources(sources: JobSource[]) {
      const rows = sources.map((s) => ({
        id: s.id, name: s.name, kind: s.kind, terms_url: s.termsUrl, permission_note: s.permissionNote,
        reviewed_on: s.reviewedOn, complete_snapshot: s.completeSnapshot, stale_days: s.staleDays, updated_at: new Date().toISOString(),
      }));
      if (!rows.length) return;
      const { error } = await db.from("job_sources").upsert(rows, { onConflict: "id" });
      if (error) throw new Error(`job_sources: ${error.message}`);
    },
    async activeCount(source: string) {
      const { count, error } = await db.from("jobs").select("id", { count: "exact", head: true }).eq("source", source).eq("is_active", true);
      if (error) throw new Error(`jobs count: ${error.message}`);
      return count ?? 0;
    },
    async upsertJobs(rows: NormalizedJob[], seenAt: string) {
      if (!rows.length) return 0;
      const payload = rows.map((r) => ({ ...r, last_seen_at: seenAt, is_active: true, inactive_reason: null, updated_at: seenAt }));
      const { error, count } = await db.from("jobs").upsert(payload, { onConflict: "source,external_id", count: "exact" });
      if (error) throw new Error(error.message);
      return count ?? rows.length;
    },
    async expireUnseen(source: string, before: string, reason: string) {
      const { error, count } = await db.from("jobs")
        .update({ is_active: false, inactive_reason: reason, updated_at: new Date().toISOString() }, { count: "exact" })
        .eq("source", source).eq("is_active", true).lt("last_seen_at", before);
      if (error) throw new Error(`expire: ${error.message}`);
      return count ?? 0;
    },
    async recordSource(source: string, p: { status: SourceRunResult["status"]; message: string; at: string; success: boolean; complete: boolean }) {
      await db.from("job_sources").update({
        last_run_at: p.at, last_status: p.status, last_message: p.message.slice(0, 300),
        ...(p.success ? { last_success_at: p.at } : {}),
        ...(p.success && p.complete ? { last_complete_sync_at: p.at } : {}),
        updated_at: new Date().toISOString(),
      }).eq("id", source);
    },
    async startRun(trigger: string) {
      const { data, error } = await db.from("job_sync_runs").insert({ trigger }).select("id").single();
      if (error) throw new Error(`job_sync_runs: ${error.message}`);
      return data.id as string;
    },
    async finishRun(id: string, status: "ok" | "partial" | "failed", results: SourceRunResult[]) {
      await db.from("job_sync_runs").update({ finished_at: new Date().toISOString(), status, results }).eq("id", id);
    },
  };
}

/** fetch with a timeout, a fixed user agent and a size cap - for the adapters. */
export async function fetchJson(url: string, init: { headers?: Record<string, string> } = {}): Promise<unknown> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 20_000);
  try {
    const res = await fetch(url, {
      headers: { Accept: "application/json", "User-Agent": "OneGraspJobsImporter/1.0 (+https://onegrasp.com)", ...(init.headers ?? {}) },
      signal: controller.signal,
      cache: "no-store",
      redirect: "follow",
    });
    if (!res.ok) throw new Error(`HTTP ${res.status} from ${new URL(url).hostname}`);
    const len = Number(res.headers.get("content-length") ?? 0);
    if (len > 60_000_000) throw new Error(`Response too large from ${new URL(url).hostname}`);
    const text = await res.text();
    if (text.length > 60_000_000) throw new Error(`Response too large from ${new URL(url).hostname}`);
    return JSON.parse(text);
  } finally {
    clearTimeout(timer);
  }
}

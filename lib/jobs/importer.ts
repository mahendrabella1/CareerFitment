/**
 * The daily import, independent of the database (the store is passed in), so
 * it is tested with an in-memory store (tests/jobs/importer.test.mjs).
 *
 * All sources run at the same time (so the run fits a 60 s serverless limit),
 * each in isolation - one failing source never stops the others:
 *   fetch (time-limited) -> normalise + validate -> dedupe -> upsert in batches
 *   on (source, external_id), stamping last_seen_at.
 * Expiry happens ONLY after a source's run fully succeeded:
 *   - complete snapshot (the source returned all its live jobs): a job of that
 *     source not seen in this run is closed - unless the run returned
 *     suspiciously few jobs (under half of what was live), then nothing is;
 *   - otherwise the fallback: jobs unseen for staleDays are marked stale.
 * A failed, partial or empty run expires nothing. Rows are never deleted.
 */
import type { JobSource, NormalizedJob, SourceContext, SourceRunResult } from "./types";
import { dedupeBatch, normalizeJob } from "./normalize";

export interface JobStore {
  ensureSources(sources: JobSource[]): Promise<void>;
  activeCount(source: string): Promise<number>;
  /** Upsert on (source, external_id); sets last_seen_at = seenAt, is_active = true. Returns rows written. */
  upsertJobs(rows: NormalizedJob[], seenAt: string): Promise<number>;
  /** Close active jobs of a source last seen before `before`. Returns how many. */
  expireUnseen(source: string, before: string, reason: string): Promise<number>;
  recordSource(source: string, patch: { status: SourceRunResult["status"]; message: string; at: string; success: boolean; complete: boolean }): Promise<void>;
  startRun(trigger: string): Promise<string>;
  finishRun(id: string, status: "ok" | "partial" | "failed", results: SourceRunResult[]): Promise<void>;
}

export interface ImportOptions {
  trigger: string;
  now?: Date;
  batchSize?: number;
  /** Total time budget; a source that would start after it is skipped. */
  deadlineMs?: number;
  perSourceTimeoutMs?: number;
}

const MIN_SHARE_FOR_SNAPSHOT_EXPIRY = 0.5;

function withTimeout<T>(p: Promise<T>, ms: number, what: string): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const t = setTimeout(() => reject(new Error(`${what} timed out`)), ms);
    p.then((v) => { clearTimeout(t); resolve(v); }, (e) => { clearTimeout(t); reject(e); });
  });
}

/** A short, safe message (no stack, no URLs with keys). */
function safeMessage(e: unknown): string {
  const m = e instanceof Error ? e.message : String(e);
  return m.replace(/(app_key|app_id|key|token|secret)=[^&\s]+/gi, "$1=…").slice(0, 160);
}

export async function runImport(sources: JobSource[], store: JobStore, ctx: Omit<SourceContext, "now">, opts: ImportOptions): Promise<{ status: "ok" | "partial" | "failed"; results: SourceRunResult[] }> {
  const now = opts.now ?? new Date();
  const started = Date.now();
  const deadline = started + (opts.deadlineMs ?? 50_000);
  const batchSize = opts.batchSize ?? 200;
  const seenAt = now.toISOString();
  await store.ensureSources(sources);
  const runId = await store.startRun(opts.trigger);
  const results: SourceRunResult[] = [];

  const runOne = async (source: JobSource): Promise<SourceRunResult> => {
    const base: SourceRunResult = { source: source.id, status: "skipped", fetched: 0, valid: 0, upserted: 0, expired: 0, complete: false, message: "" };
    if (!source.enabled) return { ...base, message: source.disabledReason ?? "Disabled" };
    const remaining = deadline - Date.now();
    if (remaining < 5_000) return { ...base, message: "Not started - the run's time budget was used up" };
    const result = { ...base };
    try {
      const previouslyActive = await store.activeCount(source.id);
      const fetched = await withTimeout(source.fetch({ ...ctx, now }), Math.min(opts.perSourceTimeoutMs ?? 30_000, remaining - 3_000), source.name);
      result.fetched = fetched.jobs.length;
      const rows: NormalizedJob[] = [];
      let invalid = 0;
      for (const raw of fetched.jobs) {
        const n = normalizeJob(raw, source, now);
        if (n.ok) rows.push(n.job); else invalid++;
      }
      const unique = dedupeBatch(rows);
      result.valid = unique.length;

      let failedBatches = 0;
      for (let i = 0; i < unique.length; i += batchSize) {
        try {
          result.upserted += await store.upsertJobs(unique.slice(i, i + batchSize), seenAt);
        } catch (e) {
          failedBatches++;
          result.message = `A batch failed to save: ${safeMessage(e)}`;
        }
      }

      if (failedBatches) {
        result.status = "partial";
      } else if (!unique.length) {
        // An empty answer is treated as a hiccup, never as "every job closed".
        result.status = "partial";
        result.message = `No valid jobs returned${invalid ? ` (${invalid} rejected)` : ""} - nothing expired`;
      } else {
        result.status = "ok";
        result.complete = fetched.complete && source.completeSnapshot;
        if (result.complete && unique.length >= previouslyActive * MIN_SHARE_FOR_SNAPSHOT_EXPIRY) {
          result.expired = await store.expireUnseen(source.id, seenAt, "No longer on the source's full list");
        } else {
          const cutoff = new Date(now.getTime() - source.staleDays * 86_400_000).toISOString();
          result.expired = await store.expireUnseen(source.id, cutoff, `Not seen for ${source.staleDays} days - may have closed (fallback rule)`);
          if (result.complete) result.message = "Fewer jobs than usual - used the stale-days fallback instead of closing missing jobs";
        }
        if (invalid && !result.message) result.message = `${invalid} listing(s) rejected (missing fields or unsafe link)`;
      }
    } catch (e) {
      result.status = "failed";
      result.message = safeMessage(e);
    }
    await store.recordSource(source.id, { status: result.status, message: result.message, at: seenAt, success: result.status === "ok", complete: result.complete }).catch(() => undefined);
    return result;
  };
  // Results keep the sources' order.
  results.push(...(await Promise.all(sources.map(runOne))));

  const ran = results.filter((r) => r.status !== "skipped");
  const status = !ran.length ? "failed" : ran.every((r) => r.status === "ok") ? "ok" : ran.some((r) => r.status === "ok" || r.status === "partial") ? "partial" : "failed";
  await store.finishRun(runId, status, results).catch(() => undefined);
  return { status, results };
}

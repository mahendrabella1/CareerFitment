import { NextResponse } from "next/server";
import { fail, requireAdmin } from "@/lib/institution/server";
import { envKey, keyShape } from "@/lib/ai/keys";
import { isFirestoreConfigured } from "@/lib/firebase/admin";

export const dynamic = "force-dynamic";

type Check = { name: string; env: string; state: "ok" | "bad" | "missing" | "warn"; detail: string; shape?: ReturnType<typeof keyShape>; usedBy: string };

async function probe(url: string, key: string): Promise<{ status: number; body: Record<string, unknown> }> {
  try {
    const res = await fetch(url, { headers: { Authorization: `Bearer ${key}` }, signal: AbortSignal.timeout(12_000), cache: "no-store" });
    return { status: res.status, body: (await res.json().catch(() => ({}))) as Record<string, unknown> };
  } catch (e) {
    return { status: 0, body: { error: { message: e instanceof Error ? e.message : "no answer" } } };
  }
}
const errMsg = (b: Record<string, unknown>) => String((b.error as { message?: string } | undefined)?.message ?? "");

/**
 * GET /api/admin/ai-status (admins only) - checks every AI key the server
 * holds against its provider, without revealing it: Groq (speech-to-text and
 * feedback), DeepSeek (feedback, with its balance), plus Firebase admin and SMTP.
 */
export async function GET(req: Request) {
  try {
    await requireAdmin(req);
    const checks: Check[] = [];

    const groq = envKey("GROQ_API_KEY");
    const gShape = keyShape("GROQ_API_KEY", "gsk_");
    if (!groq) checks.push({ name: "Groq", env: "GROQ_API_KEY", state: "missing", detail: "Not set. Voice feedback (speech-to-text) can't work without it.", shape: gShape, usedBy: "Communication Lab voice, mock interviews, AI feedback fallback, Test-Drive" });
    else {
      const r = await probe("https://api.groq.com/openai/v1/models", groq);
      checks.push({
        name: "Groq", env: "GROQ_API_KEY", shape: gShape, usedBy: "Communication Lab voice, mock interviews, AI feedback fallback, Test-Drive",
        state: r.status === 200 ? "ok" : "bad",
        detail: r.status === 200 ? `Accepted. ${Array.isArray(r.body.data) ? `${(r.body.data as unknown[]).length} models available.` : ""}`
          : r.status === 401 || r.status === 403 ? `Rejected by Groq (${r.status}: ${errMsg(r.body) || "invalid key"}). Create a new key at console.groq.com, set it in Vercel, and redeploy.`
          : `Groq answered ${r.status || "nothing"}${errMsg(r.body) ? `: ${errMsg(r.body)}` : ""}.`,
      });
    }

    const ds = envKey("DEEPSEEK_API_KEY");
    const dShape = keyShape("DEEPSEEK_API_KEY", "sk-");
    if (!ds) checks.push({ name: "DeepSeek", env: "DEEPSEEK_API_KEY", state: "missing", detail: "Not set (optional) - Groq is used for AI feedback.", shape: dShape, usedBy: "AI feedback, tried before Groq" });
    else {
      const r = await probe("https://api.deepseek.com/user/balance", ds);
      const infos = (r.body.balance_infos as { currency?: string; total_balance?: string }[] | undefined) ?? [];
      const bal = infos.map((b) => `${b.total_balance} ${b.currency}`).join(", ");
      checks.push({
        name: "DeepSeek", env: "DEEPSEEK_API_KEY", shape: dShape, usedBy: "AI feedback, tried before Groq",
        state: r.status === 200 ? (r.body.is_available ? "ok" : "warn") : r.status === 401 ? "bad" : "warn",
        detail: r.status === 200 ? (r.body.is_available ? `Accepted. Balance: ${bal || "available"}.` : `Key accepted, but no balance${bal ? ` (${bal})` : ""} - top up at platform.deepseek.com. Groq is used meanwhile.`)
          : r.status === 401 ? `Rejected by DeepSeek (${errMsg(r.body) || "invalid key"}). Groq is used meanwhile.`
          : `DeepSeek answered ${r.status || "nothing"}${errMsg(r.body) ? `: ${errMsg(r.body)}` : ""}.`,
      });
    }

    checks.push({ name: "Firebase admin", env: "FIREBASE_PROJECT_ID / CLIENT_EMAIL / PRIVATE_KEY", usedBy: "Every signed-in API (voice, resume AI, requests, portals)", state: isFirestoreConfigured() ? "ok" : "missing", detail: isFirestoreConfigured() ? "Configured." : "Not configured - signed-in features return 503." });
    const smtp = ["SMTP_HOST", "SMTP_USER", "SMTP_PASS"].every((k) => envKey(k));
    checks.push({ name: "Email (SMTP)", env: "SMTP_HOST / SMTP_USER / SMTP_PASS", usedBy: "Spotlight requests, lead and report emails", state: smtp ? "ok" : "warn", detail: smtp ? "Configured (not test-sent)." : "Not configured - requests are saved but not emailed." });

    return NextResponse.json({ checks, checkedAt: Date.now() });
  } catch (e) {
    return fail(e);
  }
}

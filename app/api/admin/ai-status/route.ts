import { NextResponse } from "next/server";
import { fail, requireAdmin } from "@/lib/institution/server";
import { envKey, keyShape } from "@/lib/ai/keys";
import { groqExtras, groqModels } from "@/lib/ai/llm";
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
      // An accepted key isn't enough: Groq retires models (llama-3.3-70b-versatile went on 16 Aug 2026).
      const live = new Set((Array.isArray(r.body.data) ? r.body.data as { id?: string }[] : []).map((m) => String(m.id ?? "")));
      const chat = groqModels().find((m) => live.has(m));
      const whisper = live.has("whisper-large-v3-turbo");
      // One tiny real request with the same settings jsonChat() sends, so a rejected parameter shows up here too.
      let reply = "";
      if (chat) {
        try {
          const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST", headers: { Authorization: `Bearer ${groq}`, "Content-Type": "application/json" }, signal: AbortSignal.timeout(20_000), cache: "no-store",
            body: JSON.stringify({ model: chat, temperature: 0, max_tokens: 100 + groqExtras(chat).headroom, response_format: { type: "json_object" }, ...groqExtras(chat).extra, messages: [{ role: "user", content: "Reply with this JSON object only: {\"ok\": true}" }] }),
          });
          const body = (await res.json().catch(() => ({}))) as Record<string, unknown> & { choices?: { message?: { content?: string } }[] };
          let ok = false; try { ok = JSON.parse(body.choices?.[0]?.message?.content ?? "").ok === true; } catch { /* reported below */ }
          reply = res.ok ? (ok ? "Test reply: OK." : "Test reply came back, but not as the expected JSON.") : `Test reply failed (${res.status}: ${errMsg(body) || "no message"}).`;
        } catch (e) { reply = `Test reply failed (${e instanceof Error ? e.message : "no answer"}).`; }
      }
      const replyOk = reply === "Test reply: OK.";
      checks.push({
        name: "Groq", env: "GROQ_API_KEY", shape: gShape, usedBy: "Communication Lab voice, mock interviews, AI feedback fallback, Test-Drive",
        state: r.status === 200 ? (chat && whisper && replyOk ? (chat === groqModels()[0] ? "ok" : "warn") : "bad") : "bad",
        detail: r.status === 200
          ? [`Key accepted.`,
            chat ? `Feedback model: ${chat}${chat === groqModels()[0] ? "" : ` (${groqModels()[0]} isn't available - set GROQ_MODEL to a current model)`}. ${reply}` : `None of the feedback models (${groqModels().join(", ")}) exist on Groq any more - set GROQ_MODEL in Vercel to a current chat model and redeploy.`,
            whisper ? "Speech-to-text: whisper-large-v3-turbo." : "whisper-large-v3-turbo is no longer listed - voice falls back to the browser's speech recognition."].join(" ")
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

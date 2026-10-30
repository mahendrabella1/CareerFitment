/**
 * Server-only JSON chat for the app's AI feedback (Communication Lab, resume
 * help, interview answers). DeepSeek first when DEEPSEEK_API_KEY is set,
 * Groq's Llama when it isn't or DeepSeek fails - so feedback keeps working
 * whichever key is live. A DeepSeek account that is out of balance or whose
 * key is refused is skipped for 15 minutes rather than tried on every call.
 * Neither provider hears audio: speech-to-text stays on Groq Whisper.
 */
import { ApiError } from "@/lib/institution/server";
import { envKey } from "./keys";

export interface JsonChat {
  system: string;
  prompt: string;
  /** JSON schema the reply must follow (sent as text; both providers use JSON mode). */
  schema: Record<string, unknown>;
  maxTokens?: number;
  temperature?: number;
}

interface Provider { name: "deepseek" | "groq"; url: string; key: string; model: string }

let deepseekDownUntil = 0;

function providers(): Provider[] {
  const out: Provider[] = [];
  const ds = envKey("DEEPSEEK_API_KEY");
  if (ds && Date.now() > deepseekDownUntil) out.push({ name: "deepseek", url: "https://api.deepseek.com/chat/completions", key: ds, model: envKey("DEEPSEEK_MODEL") || "deepseek-flash" });
  const groq = envKey("GROQ_API_KEY");
  if (groq) out.push({ name: "groq", url: "https://api.groq.com/openai/v1/chat/completions", key: groq, model: "llama-3.3-70b-versatile" });
  return out;
}

/** One JSON reply. Throws ApiError (503 no provider / busy, 502 refused / garbled). */
export async function jsonChat(req: JsonChat): Promise<{ json: Record<string, unknown>; provider: Provider["name"] }> {
  const list = providers();
  if (!list.length) throw new ApiError(503, "AI feedback isn't switched on yet - the server needs DEEPSEEK_API_KEY or GROQ_API_KEY.");
  let last: ApiError | null = null;
  for (const p of list) {
    try {
      const res = await fetch(p.url, {
        method: "POST",
        headers: { Authorization: `Bearer ${p.key}`, "Content-Type": "application/json" },
        signal: AbortSignal.timeout(45_000),
        body: JSON.stringify({
          model: p.model, temperature: req.temperature ?? 0.3, max_tokens: req.maxTokens ?? 1500, response_format: { type: "json_object" },
          messages: [
            { role: "system", content: `${req.system} Reply with one JSON object only.` },
            { role: "user", content: `${req.prompt}\n\nReturn ONLY a JSON object matching this JSON schema:\n${JSON.stringify(req.schema)}` },
          ],
        }),
      });
      const data = (await res.json().catch(() => ({}))) as { choices?: { message?: { content?: string } }[]; error?: { message?: string; type?: string } };
      if (!res.ok) {
        const msg = data.error?.message ?? String(res.status);
        if (p.name === "deepseek" && (res.status === 401 || res.status === 402 || /balance/i.test(msg))) deepseekDownUntil = Date.now() + 15 * 60_000;
        const auth = res.status === 401 || res.status === 403 || res.status === 402;
        console.error(`[ai] ${p.name} ${res.status}: ${msg}${auth ? ` - check ${p.name === "groq" ? "GROQ_API_KEY" : "DEEPSEEK_API_KEY / balance"} at /admin/ai-status` : ""}`);
        last = res.status === 429 ? new ApiError(503, "Lots of people are using this right now - please try again in a minute.")
          : auth ? new ApiError(503, "AI feedback is paused: the AI service didn't accept OneGrasp's key. The team has been alerted - please try again later.")
          : new ApiError(502, "The AI service couldn't answer just now - please try again.");
        continue;
      }
      const text = (data.choices?.[0]?.message?.content ?? "").replace(/^```(?:json)?\s*|\s*```$/g, "");
      try { return { json: JSON.parse(text) as Record<string, unknown>, provider: p.name }; }
      catch { last = new ApiError(502, "The feedback came back garbled - please try again."); }
    } catch (e) {
      console.error(`[ai] ${p.name} failed:`, e instanceof Error ? e.message : e);
      last = new ApiError(502, "The AI service didn't answer in time - please try again.");
    }
  }
  throw last ?? new ApiError(502, "The AI service didn't answer - please try again.");
}

/** Clamp helpers for model output. */
export const int = (v: unknown, max: number) => Math.min(max, Math.max(0, Math.round(Number(v) || 0)));
export const strList = (v: unknown, n: number) => (Array.isArray(v) ? v : []).map((x) => String(x ?? "").trim()).filter(Boolean).slice(0, n);

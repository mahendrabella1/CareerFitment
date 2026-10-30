/**
 * Server-only JSON chat for the app's AI feedback (Communication Lab, resume
 * help, interview answers). DeepSeek first when DEEPSEEK_API_KEY is set,
 * Groq's Llama when it isn't or DeepSeek fails - so feedback keeps working
 * whichever key is live. A DeepSeek account that is out of balance or whose
 * key is refused is skipped for 15 minutes rather than tried on every call.
 * Neither provider hears audio: speech-to-text stays on Groq Whisper.
 *
 * Groq retires models: llama-3.3-70b-versatile was shut down on 16 Aug 2026
 * and every feedback call failed until the model was changed. So Groq is
 * tried with a short list of models (GROQ_MODEL first when set), and
 * /admin/ai-status checks that they still exist.
 */
import { ApiError } from "@/lib/institution/server";
import { envKey } from "./keys";

export interface JsonChat {
  system: string;
  prompt: string;
  /** JSON schema the reply must follow (sent as text; both providers use JSON mode). Leave out when the prompt already shows the shape. */
  schema?: Record<string, unknown>;
  maxTokens?: number;
  temperature?: number;
}

interface Provider { name: "deepseek" | "groq"; url: string; key: string; model: string; extra: Record<string, unknown>; headroom: number }

/** Groq chat models in the order to try: GROQ_MODEL (Vercel) overrides the first. */
export function groqModels(): string[] {
  return [...new Set([envKey("GROQ_MODEL") || "openai/gpt-oss-120b", "openai/gpt-oss-20b"])];
}

/** GPT-OSS thinks before answering: keep that short and out of the reply, and leave tokens for it. */
export function groqExtras(model: string): { extra: Record<string, unknown>; headroom: number } {
  return model.startsWith("openai/gpt-oss") ? { extra: { reasoning_effort: "low", include_reasoning: false }, headroom: 1500 } : { extra: {}, headroom: 0 };
}

let deepseekDownUntil = 0;

function providers(): Provider[] {
  const out: Provider[] = [];
  const ds = envKey("DEEPSEEK_API_KEY");
  if (ds && Date.now() > deepseekDownUntil) out.push({ name: "deepseek", url: "https://api.deepseek.com/chat/completions", key: ds, model: envKey("DEEPSEEK_MODEL") || "deepseek-flash", extra: {}, headroom: 0 });
  const groq = envKey("GROQ_API_KEY");
  if (groq) for (const model of groqModels()) out.push({ name: "groq", url: "https://api.groq.com/openai/v1/chat/completions", key: groq, model, ...groqExtras(model) });
  return out;
}

/** One JSON reply. Throws ApiError (503 no provider / busy, 502 refused / garbled). */
export async function jsonChat(req: JsonChat): Promise<{ json: Record<string, unknown>; provider: Provider["name"]; model: string }> {
  const list = providers();
  if (!list.length) throw new ApiError(503, "AI feedback isn't switched on yet - the server needs DEEPSEEK_API_KEY or GROQ_API_KEY.");
  let last: ApiError | null = null;
  const refused = new Set<Provider["name"]>();
  for (const p of list) {
    if (refused.has(p.name)) continue; // a refused key fails the same way for every model
    try {
      const res = await fetch(p.url, {
        method: "POST",
        headers: { Authorization: `Bearer ${p.key}`, "Content-Type": "application/json" },
        signal: AbortSignal.timeout(45_000),
        body: JSON.stringify({
          model: p.model, temperature: req.temperature ?? 0.3, max_tokens: (req.maxTokens ?? 1500) + p.headroom, response_format: { type: "json_object" }, ...p.extra,
          messages: [
            { role: "system", content: `${req.system} Reply with one JSON object only.` },
            { role: "user", content: req.schema ? `${req.prompt}\n\nReturn ONLY a JSON object matching this JSON schema:\n${JSON.stringify(req.schema)}` : req.prompt },
          ],
        }),
      });
      const data = (await res.json().catch(() => ({}))) as { choices?: { message?: { content?: string } }[]; error?: { message?: string; type?: string; code?: string } };
      if (!res.ok) {
        const msg = data.error?.message ?? String(res.status);
        if (p.name === "deepseek" && (res.status === 401 || res.status === 402 || /balance/i.test(msg))) deepseekDownUntil = Date.now() + 15 * 60_000;
        const auth = res.status === 401 || res.status === 403 || res.status === 402;
        if (auth) refused.add(p.name);
        const retired = /decommission|model_not_found|not found|does not exist|no longer supported/i.test(`${data.error?.code ?? ""} ${msg}`);
        console.error(`[ai] ${p.name} ${p.model} ${res.status}: ${msg}${auth ? ` - check ${p.name === "groq" ? "GROQ_API_KEY" : "DEEPSEEK_API_KEY / balance"} at /admin/ai-status` : retired ? ` - this model is gone; set ${p.name === "groq" ? "GROQ_MODEL" : "DEEPSEEK_MODEL"} in Vercel to a current one` : ""}`);
        last = res.status === 429 ? new ApiError(503, "Lots of people are using this right now - please try again in a minute.")
          : auth ? new ApiError(503, "AI feedback is paused: the AI service didn't accept OneGrasp's key. The team has been alerted - please try again later.")
          : new ApiError(502, "The AI service couldn't answer just now - please try again.");
        continue;
      }
      const text = (data.choices?.[0]?.message?.content ?? "").replace(/^```(?:json)?\s*|\s*```$/g, "");
      try { return { json: JSON.parse(text) as Record<string, unknown>, provider: p.name, model: p.model }; }
      catch { last = new ApiError(502, "The feedback came back garbled - please try again."); }
    } catch (e) {
      console.error(`[ai] ${p.name} ${p.model} failed:`, e instanceof Error ? e.message : e);
      last = new ApiError(502, "The AI service didn't answer in time - please try again.");
    }
  }
  throw last ?? new ApiError(502, "The AI service didn't answer - please try again.");
}

/** Clamp helpers for model output. */
export const int = (v: unknown, max: number) => Math.min(max, Math.max(0, Math.round(Number(v) || 0)));
export const strList = (v: unknown, n: number) => (Array.isArray(v) ? v : []).map((x) => String(x ?? "").trim()).filter(Boolean).slice(0, n);

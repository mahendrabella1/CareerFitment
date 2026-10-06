"use client";

/**
 * /account/gps - Career GPS: three small missions a week, picked from the
 * student's own situation and ticked off automatically from what they do in
 * the app. Points and a weekly streak keep them going; their school sees
 * both in the portal, and parents see this week's progress on their page.
 */
import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { Logo } from "@/app/Logo";
import { useAuth } from "@/lib/auth/AuthProvider";
import { getDb } from "@/lib/firebase/client";
import { apiFetch } from "@/lib/institution/client";
import { HowItWorks } from "@/components/HowItWorks";
import { liveStreak, missionDone, missionsFor, updateGps, weekOf, type GpsEvidence, type GpsState, type Mission } from "@/lib/gps";

const CSS = `
.gp{min-height:100vh;background:#f6f7fb;color:#141417;font-family:Inter,system-ui,"Segoe UI",sans-serif}
.gp *{box-sizing:border-box}
.gp-top{display:flex;align-items:center;gap:12px;padding:12px 20px;background:#fff;border-bottom:1px solid #ececef}
.gp-wrap{max-width:820px;margin:0 auto;padding:22px 16px 60px}
.gp-card{background:#fff;border:1px solid #ececef;border-radius:18px;padding:20px;margin-bottom:14px}
.gp h1{font-size:26px;margin:0 0 4px;letter-spacing:-.015em}
.gp-muted{color:#63636f;font-size:14px;line-height:1.6}
.gp-stats{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-bottom:14px}
.gp-stat{background:#fff;border:1px solid #ececef;border-radius:16px;padding:14px 16px}
.gp-stat b{display:block;font-size:26px;font-variant-numeric:tabular-nums}
.gp-stat span{font-size:12px;font-weight:700;color:#63636f;text-transform:uppercase;letter-spacing:.06em}
.gp-m{display:flex;gap:14px;align-items:center;padding:14px 0;border-top:1px solid #f0f0f3}
.gp-m:first-of-type{border-top:none}
.gp-tick{flex:none;width:34px;height:34px;border-radius:999px;display:grid;place-items:center;font-weight:900;border:2px solid #d5d7e6;color:#8a8a96}
.gp-tick.on{background:#1f9d6b;border-color:#1f9d6b;color:#fff}
.gp-kind{font-size:11px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;color:#4c5fd5}
.gp-btn{background:#4c5fd5;color:#fff;border:none;border-radius:12px;padding:10px 16px;font:inherit;font-size:14px;font-weight:800;cursor:pointer;text-decoration:none;white-space:nowrap}
.gp-btn.ghost{background:#fff;color:#3d3d45;border:1px solid #ececef}
.gp-bar{height:8px;border-radius:999px;background:#ececef;overflow:hidden;margin:10px 0 2px}
.gp-bar>div{height:100%;background:#1f9d6b;transition:width .4s}
.gp-weeks{display:flex;gap:6px;flex-wrap:wrap;margin-top:10px}
.gp-wk{font-size:12px;font-weight:700;border-radius:10px;padding:6px 10px;background:#f4f4f6;color:#63636f}
.gp-wk.full{background:#eaf6f0;color:#1f7a55}
@media (max-width:560px){.gp-stats{grid-template-columns:1fr 1fr 1fr}.gp-stat b{font-size:20px}.gp-m{flex-wrap:wrap}}
`;

const KIND = { watch: "Explore", do: "Do", build: "Build" } as const;
const num = (v: unknown) => (typeof v === "number" && Number.isFinite(v) ? v : 0);
/** JSON with sorted keys - Firestore doesn't keep a map's key order. */
const stable = (v: unknown): string => JSON.stringify(v, (_k, x) => (x && typeof x === "object" && !Array.isArray(x) ? Object.fromEntries(Object.entries(x).sort(([a], [b]) => (a < b ? -1 : 1))) : x)) ?? "";

export default function CareerGpsPage() {
  const { user, profile, loading } = useAuth();
  const [missions, setMissions] = useState<Mission[]>([]);
  const [done, setDone] = useState<string[]>([]);
  const [gps, setGps] = useState<GpsState | null>(null);
  const [checking, setChecking] = useState(false);
  const [error, setError] = useState("");
  const wk = weekOf();
  const lastWk = weekOf(new Date(wk.start - 86400000)).key;

  const check = useCallback(async () => {
    const db = getDb();
    if (!user || !db) return;
    setChecking(true); setError("");
    try {
      const [snap, ms] = await Promise.all([
        getDoc(doc(db, "users", user.uid)),
        apiFetch<{ milestones: { createdAt: number }[] }>("/api/student/milestones").catch(() => ({ milestones: [] })),
      ]);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const d = (snap.data() ?? {}) as any;
      const a = d.latestAssessment;
      const fits: string[] = a?.customFields?.length ? a.customFields.map((f: { name: string }) => f.name) : (a?.matches ?? []).map((m: { title: string }) => m.title);
      const courseUpdatedAt: Record<string, number> = {};
      for (const [k, c] of Object.entries((d.progress?.courses ?? {}) as Record<string, { updatedAt?: number }>)) courseUpdatedAt[k] = num(c?.updatedAt);
      const e: GpsEvidence = {
        hasAssessment: !!a,
        category: d.category ?? "",
        goal: a?.desiredCareer || d.desiredCareer || null,
        topFit: fits[0] ?? a?.topCareer ?? null,
        lastByFeature: d.activity?.lastByFeature ?? {},
        courseUpdatedAt,
        goalsUpdatedAt: num(d.progress?.goals?.updatedAt),
        testDriveAt: Math.max(0, ...Object.values((d.testDrives ?? {}) as Record<string, { completedAt?: number }>).map((t) => num(t.completedAt))),
        decisionAt: num(d.decision?.savedAt),
        milestoneAt: Math.max(0, ...ms.milestones.map((m) => num(m.createdAt))),
      };
      const prev = d.gps as GpsState | undefined;
      const list = missionsFor(e, wk.key, prev?.weeks?.[wk.key]?.missions);
      const doneIds = list.filter((m) => missionDone(m, e, wk.start)).map((m) => m.id);
      const next = updateGps(prev, wk.key, list, doneIds, lastWk);
      if (stable(next) !== stable(prev)) await updateDoc(doc(db, "users", user.uid), { gps: next });
      setMissions(list); setDone(next.weeks[wk.key]?.done ?? []); setGps(next);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't check your missions.");
    } finally {
      setChecking(false);
    }
  }, [user, wk.key, wk.start, lastWk]);

  useEffect(() => { if (user && profile) void check(); }, [user, profile, check]);
  // Coming back to this tab after doing a mission: check again.
  useEffect(() => {
    const onShow = () => { if (document.visibilityState === "visible") void check(); };
    document.addEventListener("visibilitychange", onShow);
    return () => document.removeEventListener("visibilitychange", onShow);
  }, [check]);

  const doneCount = missions.filter((m) => done.includes(m.id)).length;
  const weekLabel = new Date(wk.start).toLocaleDateString("en-IN", { day: "numeric", month: "short" });
  const history = gps ? Object.entries(gps.weeks).filter(([k]) => k !== wk.key).sort(([x], [y]) => (x < y ? 1 : -1)).slice(0, 8) : [];

  return (
    <div className="gp">
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <header className="gp-top"><Link href="/account"><Logo height={32} /></Link><span style={{ flex: 1 }} /><Link href="/account" style={{ fontWeight: 700, color: "#3d3d45", textDecoration: "none" }}>← Dashboard</Link></header>
      <div className="gp-wrap">
        {loading ? <p className="gp-muted">Loading…</p> : !user || !profile ? <p className="gp-muted">Please <Link href="/signin">sign in</Link> to see your Career GPS.</p> : (
          <>
            <div className="gp-card">
              <h1>Career GPS</h1>
              <p className="gp-muted">Three small missions a week, chosen for you, that move you closer to the right career. Finish all three to keep your streak going.</p>
            </div>
            <HowItWorks id="gps" steps={[
              "Every Monday you get three missions picked from your class, your report and your goal: one to explore, one to do, one to build.",
              "Tap Go on a mission and do it - each one takes 10 to 20 minutes.",
              "Missions tick themselves off from what you actually do in the app (it can take up to a minute to show). Press 'Check again' if one hasn't ticked.",
              "Each mission earns 10 points. Finish all three in a week to build your streak - miss a whole week and it starts again.",
            ]} sync="Your points, streak and this week's missions are seen by your school in its portal and by your parents on their family page." />
            <div className="gp-stats">
              <div className="gp-stat"><span>Points</span><b>{gps?.points ?? 0}</b></div>
              <div className="gp-stat"><span>Week streak</span><b>{gps ? liveStreak(gps, wk.key, lastWk) : 0}🔥</b></div>
              <div className="gp-stat"><span>Best streak</span><b>{gps?.bestStreak ?? 0}</b></div>
            </div>
            <div className="gp-card">
              <div style={{ display: "flex", alignItems: "baseline", gap: 10, flexWrap: "wrap" }}>
                <b style={{ fontSize: 17 }}>This week&apos;s missions</b>
                <span className="gp-muted">Week of {weekLabel}</span>
                <span style={{ flex: 1 }} />
                <button className="gp-btn ghost" style={{ padding: "6px 12px", fontSize: 13 }} disabled={checking} onClick={() => void check()}>{checking ? "Checking…" : "Check again"}</button>
              </div>
              <div className="gp-bar"><div style={{ width: `${missions.length ? (doneCount / missions.length) * 100 : 0}%` }} /></div>
              <div className="gp-muted" style={{ fontSize: 12.5 }}>{doneCount} of {missions.length || 3} done{doneCount === missions.length && missions.length > 0 ? " - brilliant, your streak is safe this week! 🎉" : ""}</div>
              <div style={{ marginTop: 6 }}>
                {missions.length === 0 && <p className="gp-muted">{checking ? "Finding your missions…" : "No missions yet."}</p>}
                {missions.map((m) => {
                  const ok = done.includes(m.id);
                  return (
                    <div className="gp-m" key={m.id}>
                      <div className={`gp-tick${ok ? " on" : ""}`}>{ok ? "✓" : ""}</div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div className="gp-kind">{KIND[m.kind]}</div>
                        <div style={{ fontWeight: 800, fontSize: 15.5, textDecoration: ok ? "line-through" : "none", color: ok ? "#63636f" : undefined }}>{m.title}</div>
                        <div className="gp-muted" style={{ fontSize: 13 }}>{m.why}</div>
                      </div>
                      {ok ? <span style={{ color: "#1f7a55", fontWeight: 800, fontSize: 13 }}>+10 pts</span> : <Link className="gp-btn" href={m.href}>Go →</Link>}
                    </div>
                  );
                })}
              </div>
              {error && <p style={{ color: "#c62828", fontSize: 13 }}>{error}</p>}
            </div>
            {history.length > 0 && (
              <div className="gp-card">
                <b>Earlier weeks</b>
                <div className="gp-weeks">{history.map(([k, w]) => {
                  const full = w.missions.length > 0 && w.missions.every((id) => w.done.includes(id));
                  return <span key={k} className={`gp-wk${full ? " full" : ""}`}>{k.replace(/^\d{4}-W/, "Week ")} · {w.done.length}/{w.missions.length}{full ? " ✓" : ""}</span>;
                })}</div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

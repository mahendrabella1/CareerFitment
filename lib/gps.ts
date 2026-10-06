/**
 * Career GPS - three small missions a week, chosen from the student's own
 * situation (class, assessment, goal, what they've already done), checked
 * automatically from what they actually do in the app.
 *
 * Progress lives on the student's own profile (users/{uid}.gps); their
 * school sees points, streaks and this week's progress in the portal.
 */
import { areasFor } from "@/lib/institution/features";

export interface Mission {
  id: string;
  kind: "watch" | "do" | "build";
  title: string;
  why: string;
  href: string;
}

export interface GpsState {
  weeks: Record<string, { missions: string[]; done: string[] }>;
  points: number;
  streak: number;
  bestStreak: number;
  /** The last week with all three missions done. */
  lastFullWeek?: string;
}

/** The streak still running: broken once a whole week passes without finishing. */
export function liveStreak(s: GpsState | undefined, weekKey: string, lastWeekKey: string): number {
  if (!s?.lastFullWeek) return 0;
  return s.lastFullWeek === weekKey || s.lastFullWeek === lastWeekKey ? s.streak : 0;
}

/** What a mission is checked against - all from the student's own data. */
export interface GpsEvidence {
  hasAssessment: boolean;
  category: string;
  goal: string | null;
  topFit: string | null;
  lastByFeature: Record<string, number>;
  courseUpdatedAt: Record<string, number>;
  goalsUpdatedAt: number;
  testDriveAt: number;
  decisionAt: number;
  milestoneAt: number;
}

/** ISO week key, e.g. "2026-W41", and the week's Monday 00:00 (local). */
export function weekOf(d: Date = new Date()): { key: string; start: number } {
  const day = (d.getDay() + 6) % 7; // Monday = 0
  const monday = new Date(d.getFullYear(), d.getMonth(), d.getDate() - day);
  const thursday = new Date(monday.getFullYear(), monday.getMonth(), monday.getDate() + 3);
  const yearStart = new Date(thursday.getFullYear(), 0, 1);
  const week = 1 + Math.round(((thursday.getTime() - yearStart.getTime()) / 86400000 - 3 + ((yearStart.getDay() + 6) % 7)) / 7);
  return { key: `${thursday.getFullYear()}-W${String(week).padStart(2, "0")}`, start: monday.getTime() };
}

const SENIOR = ["class_11", "class_12", "class_11_12"];

/** All missions that make sense for this student, most useful first. */
function candidates(e: GpsEvidence): Mission[] {
  const out: Mission[] = [];
  const fit = e.goal || e.topFit;
  if (!e.hasAssessment) out.push({ id: "assessment", kind: "do", title: "Complete your career assessment", why: "Everything else - your report, roadmap and these missions - builds on it.", href: "/?begin=1" });
  out.push({ id: "test-drive", kind: "watch", title: fit ? `Test-drive a day as a ${fit}` : "Test-drive a career", why: "Fifteen minutes in the job tells you more than any description.", href: "/account/test-drive" });
  out.push({ id: "library", kind: "watch", title: fit ? `Explore careers related to ${fit}` : "Explore 2 careers in the career library", why: "See the roles, salaries and routes before you choose.", href: "/account/career-library" });
  if (SENIOR.includes(e.category)) out.push({ id: "exams", kind: "do", title: "Finish one lesson in Entrance Exams", why: "Know your exams' dates and pattern well before registration opens.", href: "/account/exams" });
  if (SENIOR.includes(e.category) || e.category === "graduate") out.push({ id: "scholarships", kind: "do", title: "Check one scholarship you could apply for", why: "Many close months before admissions.", href: "/account/scholarships" });
  out.push({ id: "money", kind: "do", title: "Play a round of Scam Shield", why: "Spotting a scam once can save your family real money.", href: "/account/money/scam-shield" });
  out.push({ id: "passport", kind: "build", title: "Add one achievement to your Career Passport", why: "A project, certificate or win - with proof your school can verify.", href: "/account/passport" });
  if (e.hasAssessment) out.push({ id: "goals", kind: "build", title: "Tick one step in your 30-day action plan", why: "Small steps every week add up to a real head start.", href: "/account" });
  if (["class_9_10", ...SENIOR].includes(e.category)) out.push({ id: "decision", kind: "build", title: "Compare two paths in the Family Decision Room", why: "Make the next big choice with facts - and with your parents.", href: "/account/decision-room" });
  if (fit && areasFor(fit).includes("computing")) out.push({ id: "research", kind: "do", title: "Start a mini research project", why: "Builds the evidence colleges and employers look for.", href: "/account/research" });
  out.push({ id: "legal", kind: "do", title: "Try two 'What would you do?' legal scenarios", why: "Know your rights before you need them.", href: "/account/legal/learn" });
  return out;
}

/** Every mission by id, including ones no longer offered (a week's list stays fixed once chosen). */
function byId(e: GpsEvidence): Map<string, Mission> {
  const all = candidates({ ...e, hasAssessment: false, category: "class_12" });
  const out = new Map(all.map((m) => [m.id, m]));
  for (const m of candidates(e)) out.set(m.id, m);
  if (!out.has("research")) out.set("research", { id: "research", kind: "do", title: "Start a mini research project", why: "Builds the evidence colleges and employers look for.", href: "/account/research" });
  if (!out.has("decision")) out.set("decision", { id: "decision", kind: "build", title: "Compare two paths in the Family Decision Room", why: "Make the next big choice with facts - and with your parents.", href: "/account/decision-room" });
  return out;
}

/**
 * This week's three missions: one to watch, one to do, one to build where
 * possible - rotating weekly. Once a week's missions are saved (`stored`),
 * they stay the same all week even as the student's situation changes.
 */
export function missionsFor(e: GpsEvidence, weekKey: string, stored?: string[]): Mission[] {
  if (stored?.length) {
    const ids = byId(e);
    const kept = stored.map((id) => ids.get(id)).filter((m): m is Mission => !!m);
    if (kept.length === stored.length) return kept;
  }
  const all = candidates(e);
  const seed = Number(weekKey.replace(/\D/g, "")) || 0;
  const pick = (kind: Mission["kind"], skip: Set<string>) => {
    const list = all.filter((m) => m.kind === kind && !skip.has(m.id));
    return list.length ? list[seed % list.length] : undefined;
  };
  const chosen: Mission[] = [];
  const used = new Set<string>();
  // The assessment always comes first until it's done.
  const first = all.find((m) => m.id === "assessment");
  if (first) { chosen.push(first); used.add(first.id); }
  for (const kind of ["watch", "do", "build"] as const) {
    if (chosen.length >= 3) break;
    const m = pick(kind, used);
    if (m && !chosen.some((c) => c.kind === kind && c.id !== "assessment")) { chosen.push(m); used.add(m.id); }
  }
  for (const m of all) { if (chosen.length >= 3) break; if (!used.has(m.id)) { chosen.push(m); used.add(m.id); } }
  return chosen.slice(0, 3);
}

/** Whether a mission was done this week, judged from the student's own activity. */
export function missionDone(m: Mission, e: GpsEvidence, weekStart: number): boolean {
  const since = (t: number | undefined) => (t ?? 0) >= weekStart;
  switch (m.id) {
    case "assessment": return e.hasAssessment;
    case "test-drive": return since(e.testDriveAt);
    case "library": return since(e.lastByFeature.careers);
    case "exams": return since(e.courseUpdatedAt.exams) || since(e.lastByFeature.exams);
    case "scholarships": return since(e.lastByFeature.scholarships);
    case "money": return since(e.lastByFeature.money);
    case "passport": return since(e.milestoneAt);
    case "goals": return since(e.goalsUpdatedAt);
    case "decision": return since(e.decisionAt);
    case "research": return since(e.lastByFeature.research);
    case "legal": return since(e.lastByFeature.legal);
    default: return false;
  }
}

/** The new GPS state after checking this week: +10 points per newly done
 *  mission; the streak counts weeks in a row with all three done. */
export function updateGps(prev: GpsState | undefined, weekKey: string, missions: Mission[], doneIds: string[], lastWeekKey: string): GpsState {
  const s: GpsState = prev ? { ...prev, weeks: { ...prev.weeks } } : { weeks: {}, points: 0, streak: 0, bestStreak: 0 };
  if (s.lastFullWeek && s.lastFullWeek !== weekKey && s.lastFullWeek !== lastWeekKey) s.streak = 0;
  const before = new Set(s.weeks[weekKey]?.done ?? []);
  const fresh = doneIds.filter((id) => !before.has(id));
  s.weeks[weekKey] = { missions: missions.map((m) => m.id), done: [...new Set([...before, ...doneIds])] };
  s.points += fresh.length * 10;
  const full = (k: string) => { const w = s.weeks[k]; return !!w && w.missions.length > 0 && w.missions.every((id) => w.done.includes(id)); };
  if (full(weekKey) && fresh.length) {
    s.streak = s.lastFullWeek === lastWeekKey ? s.streak + 1 : 1;
    s.lastFullWeek = weekKey;
    s.bestStreak = Math.max(s.bestStreak, s.streak);
  }
  // Keep only the last 26 weeks.
  const keys = Object.keys(s.weeks).sort();
  for (const k of keys.slice(0, Math.max(0, keys.length - 26))) delete s.weeks[k];
  return s;
}

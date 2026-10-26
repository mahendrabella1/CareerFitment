/**
 * Words for the Stress & Resilience results page: zones, pillars, what drives
 * stress, career-stage notes and the action library behind the 30-day plan.
 * Plain, warm, non-clinical language - this is a wellbeing check, never a
 * diagnosis.
 */
import { PRESSURE_PILLARS, type Band, type PillarKey, type StressScores, type Zone } from "./types";

export const HELPLINE = { name: "Tele-MANAS", number: "14416", alt: "1-800-891-4416", note: "Free, 24x7 mental-health support from the Government of India, in 20+ languages." };

export const BAND_META: Record<Band, { label: string; title: string; blurb: string; typical: string[] }> = {
  "0-5": {
    label: "0 - 5 years", title: "Early career",
    blurb: "The first years at work are a steep climb: new skills, a first manager, proving yourself and often a first salary to manage.",
    typical: ["Learning fast while expected to deliver", "Self-doubt and comparing with friends", "Saying yes to everything to prove yourself", "Rent, EMIs and a first budget"],
  },
  "5-15": {
    label: "5 - 15 years", title: "Mid career",
    blurb: "Mid-career brings more responsibility at work and at home at the same time - often the most loaded years.",
    typical: ["Leading people for the first time", "Growth that seems to have stalled", "Children, parents and work all at once", "Skills that AI and new tools are changing"],
  },
  "15+": {
    label: "15+ years", title: "Senior career",
    blurb: "Senior roles carry decisions that affect many people, and fewer people to share them with.",
    typical: ["Weight of decisions after work hours", "Staying relevant as the field changes", "Few people to speak openly with", "Long-term family finances and health"],
  },
};

export const ZONE_META: Record<Zone, { label: string; color: string; tint: string; headline: string }> = {
  thriving: { label: "Thriving", color: "#15803d", tint: "#ecfdf3", headline: "You're handling pressure well and have resources to spare." },
  managing: { label: "Managing", color: "#0f766e", tint: "#ecfdfa", headline: "Some pressure, but you're coping well. Small habits will keep it this way." },
  stretched: { label: "Stretched", color: "#b45309", tint: "#fffbeb", headline: "Pressure is starting to outrun your recovery. A good moment to act early." },
  strained: { label: "Strained", color: "#c2410c", tint: "#fff7ed", headline: "Stress is affecting you noticeably. A few targeted changes can turn this around." },
  burnout: { label: "Burnout risk", color: "#be123c", tint: "#fff1f2", headline: "Your answers show signs of burnout. Please make recovery your first priority." },
};

export const PILLAR_META: Record<PillarKey, { label: string; short: string; icon: string; high: string; mid: string; low: string }> = {
  load: { label: "Pressure load", short: "How much is weighing on you", icon: "briefcase", high: "A lot is weighing on you right now.", mid: "A noticeable load - worth keeping an eye on.", low: "Your load feels manageable." },
  signals: { label: "Stress signals", short: "How stress shows in body and mind", icon: "pulse", high: "Stress is showing in your sleep, body or mood.", mid: "Some stress signals are showing.", low: "Few stress signals right now." },
  burnout: { label: "Burnout", short: "Copenhagen Burnout Inventory", icon: "power", high: "Your energy is running low.", mid: "Your energy is starting to dip.", low: "Your energy is holding up." },
  coping: { label: "Coping balance", short: "Helpful vs risky ways of coping", icon: "shield", high: "You mostly cope in helpful ways.", mid: "A mix of helpful and less helpful coping.", low: "Some ways of coping are working against you." },
  resilience: { label: "Resilience", short: "How fast you bounce back", icon: "route", high: "You bounce back well.", mid: "You usually bounce back, given time.", low: "Setbacks stay with you for a while." },
  recovery: { label: "Recovery", short: "Sleep, breaks and switching off", icon: "clock", high: "You recharge well.", mid: "You recharge some of the time.", low: "You're not getting enough time to recharge." },
  control: { label: "Staying calm", short: "Noticing and managing your reactions", icon: "heart", high: "You manage your reactions well.", mid: "Mostly calm, with some reactive moments.", low: "Pressure can push you into reactions you regret." },
  support: { label: "Support", short: "Manager, team, family and friends", icon: "users", high: "You have good people around you.", mid: "Some support, with room for more.", low: "You may be carrying this alone." },
};

/** A pillar score in plain words, whichever direction "good" is for that pillar. */
export function pillarTone(key: PillarKey, score: number): "good" | "okay" | "watch" {
  const strain = PRESSURE_PILLARS.includes(key) ? score : 100 - score;
  return strain < 40 ? "good" : strain < 60 ? "okay" : "watch";
}

export const DRIVER_META: Record<string, { label: string; icon: string }> = {
  workload: { label: "Too much work", icon: "briefcase" },
  deadlines: { label: "Tight deadlines", icon: "clock" },
  role: { label: "Unclear or changing priorities", icon: "signpost" },
  control: { label: "Little say over your work", icon: "lock" },
  manager: { label: "Your manager", icon: "user" },
  people: { label: "Tension with colleagues or clients", icon: "users" },
  security: { label: "Job security", icon: "shield" },
  money: { label: "Money worries", icon: "wallet" },
  family: { label: "Responsibilities at home", icon: "home" },
  health: { label: "Health worries", icon: "heart" },
  career: { label: "Feeling stuck in your career", icon: "route" },
  confidence: { label: "Self-doubt at work", icon: "help" },
  comparison: { label: "Comparing yourself with others", icon: "users" },
  learning: { label: "Steep learning curve", icon: "book" },
  proving: { label: "Saying yes to everything", icon: "check" },
  leading: { label: "Managing people", icon: "users" },
  plateau: { label: "Growth has stalled", icon: "flag" },
  balance: { label: "Work-family balance", icon: "home" },
  future: { label: "AI and changing skills", icon: "cpu" },
  responsibility: { label: "Weight of big decisions", icon: "scale" },
  relevance: { label: "Staying relevant", icon: "compass" },
  isolation: { label: "Isolation at the top", icon: "user" },
  longterm: { label: "Long-term family finances", icon: "bank" },
  longhours: { label: "Long working hours", icon: "clock" },
  sleep: { label: "Short sleep", icon: "clock" },
  noleave: { label: "No time off this year", icon: "calendar" },
  commute: { label: "Long commute", icon: "route" },
};

export interface StressAction {
  id: string;
  title: string;
  why: string;
  steps: string[];
  link?: { href: string; label: string };
  /** Driver sources or weak pillars this action answers. */
  for: string[];
}

export const ACTIONS: StressAction[] = [
  { id: "talk", title: "Talk to someone this week", for: ["safety"], why: "Carrying heavy feelings alone makes them heavier. Talking is the fastest relief.",
    steps: ["Tell one person you trust how you've really been feeling", `If it feels heavy, call ${HELPLINE.name} on ${HELPLINE.number} - free and confidential`, "If your company has an employee assistance programme, book a session"] },
  { id: "priorities", title: "Agree your top 3 priorities every Monday", for: ["workload", "deadlines", "role", "proving"], why: "Most overload comes from everything feeling urgent at once.",
    steps: ["List everything on your plate, then pick the 3 that matter most this week", "Share the 3 with your manager in two lines and ask: \"Anything to drop or delay?\"", "Say \"not this week\" to anything outside the 3 unless it's truly urgent"] },
  { id: "focus", title: "Protect two focus blocks a day", for: ["workload", "deadlines", "longhours"], why: "Deep work in short protected blocks gets more done in fewer hours.",
    steps: ["Block two 90-minute slots in your calendar each day", "Turn off chat and email notifications during them", "Do your hardest task in the first block"] },
  { id: "manager-talk", title: "Have a 20-minute workload talk with your manager", for: ["manager", "control", "role", "leading"], why: "Managers often don't see the full load. A calm, specific ask changes more than silent effort.",
    steps: ["Write down your current tasks and roughly how long each takes", "Ask for one specific change: a deadline, a priority, or support", "Agree a date to check in again"] },
  { id: "conflict", title: "Reset one difficult working relationship", for: ["people"], why: "One unresolved tension can drain more energy than a heavy workload.",
    steps: ["Pick the one relationship that bothers you most", "Ask for a short private chat: \"I'd like us to work better together\"", "Describe one situation and one request - no blame, just the change you need"] },
  { id: "money", title: "Make a 30-day money plan", for: ["money", "longterm", "security"], why: "Money worry eases fastest when you can see the numbers and have a buffer.",
    steps: ["List income, fixed costs (rent, EMIs) and what's left", "Set aside a small fixed amount each month towards a 3-month emergency fund", "Use OneGrasp's Money labs to build the plan"], link: { href: "/account/money", label: "Open Money labs" } },
  { id: "career-map", title: "Map your next career step", for: ["career", "plateau", "relevance", "future", "security"], why: "Feeling stuck is stressful mostly because the next step is unclear.",
    steps: ["Pick 3 roles you'd like in 2-3 years", "Check what each needs in the Career Library and live job listings", "Choose one skill to build this month and block an hour a week for it"], link: { href: "/account/jobs", label: "Explore jobs on your path" } },
  { id: "learning-buddy", title: "Find a learning buddy", for: ["learning", "confidence", "isolation"], why: "Learning alongside someone halves the stress of a steep curve.",
    steps: ["Ask a colleague or senior for a 30-minute weekly chat", "Bring your 2 biggest questions each time", "Write down one thing you learned after each chat"] },
  { id: "wins-log", title: "Keep a daily wins log", for: ["confidence", "comparison", "selfblame"], why: "Self-doubt and self-blame shrink when you have evidence of what you do well.",
    steps: ["Each evening, write 2 things that went well and 1 thing you learned", "Re-read the week's list every Friday", "Mute or limit the social feeds that make you compare"] },
  { id: "no-practice", title: "Practise one polite \"not now\"", for: ["proving", "workload", "boundaries"], why: "Saying yes to everything spreads you too thin - and people respect clear limits.",
    steps: ["When a new request comes, ask for 5 minutes before you answer", "Reply: \"I can do this by [date], or now if we move [task]\"", "Note how it went - most people accept it"] },
  { id: "shutdown", title: "Start a 10-minute shutdown ritual", for: ["recovery", "detach", "longhours", "responsibility"], why: "Switching off after work is the single strongest habit for recovering from stress.",
    steps: ["At the end of work, write tomorrow's top 3 tasks", "Close the laptop and say \"done for today\"", "Do one thing that marks the switch: a walk, a shower, music"] },
  { id: "boundaries", title: "Set an off-hours limit for work messages", for: ["recovery", "boundaries", "balance", "longhours"], why: "Constant availability keeps stress switched on all evening.",
    steps: ["Choose a time after which you don't check work messages", "Turn off work notifications after that time", "Tell your team, and agree how they reach you only for true emergencies"] },
  { id: "sleep", title: "Fix your sleep window", for: ["sleep", "signals", "body"], why: "Sleep is when your body clears the day's stress. Short sleep makes everything harder.",
    steps: ["Same sleep and wake time every day, weekends included (within an hour)", "No screens for 30 minutes before bed", "Keep caffeine to before 2 pm"] },
  { id: "move", title: "Move for 20 minutes a day", for: ["recovery", "signals", "body", "active"], why: "Physical activity is one of the most reliable ways to bring stress down.",
    steps: ["Walk, cycle or do any exercise for 20 minutes daily", "Try a walking call or a walk after lunch", "Track the days you did it - aim for 5 a week"] },
  { id: "breathe", title: "Use the 90-second pause", for: ["control", "signals", "emotions"], why: "A short pause turns a reaction into a response.",
    steps: ["When you feel stress rising, stop for 90 seconds before replying", "Breathe in for 4 counts, out for 6, five times", "Then ask: \"What's the one thing I need here?\""] },
  { id: "coping-swap", title: "Swap one escape habit for a reset", for: ["substance", "givingup", "behaviour"], why: "Alcohol, endless scrolling or giving up bring short relief but make stress come back stronger.",
    steps: ["Notice when you reach for the habit and what triggered it", "Replace it 3 times this week with a walk, a call or 10 minutes outside", "If cutting down feels hard, talk to a doctor or counsellor"] },
  { id: "support-circle", title: "Rebuild your support circle", for: ["support", "isolation", "people", "emotional"], why: "People with support around them handle the same pressure with less strain.",
    steps: ["Name 2 people you can talk to - one at work, one outside", "Reach out to each this week, even just for a chai or a call", "Ask a senior person to be an informal mentor"] },
  { id: "break-plan", title: "Plan a real break", for: ["noleave", "burnout", "recovery", "dayoff"], why: "Without time off, recovery never fully catches up with pressure.",
    steps: ["Block at least 2-3 days of leave in the next 6 weeks", "Keep one full day each week completely work-free", "Before leave, hand over and set an out-of-office"] },
  { id: "family-share", title: "Share the load at home", for: ["family", "balance", "health"], why: "Home responsibilities feel lighter when they're planned and shared.",
    steps: ["List the week's home tasks with your partner or family", "Agree who does what, and one thing to drop or outsource", "Protect one family evening a week from work"] },
  { id: "commute", title: "Make your commute count", for: ["commute"], why: "A long commute can become recovery time instead of lost time.",
    steps: ["Use it for music, a podcast or a call with a friend - not work email", "Ask about one or two work-from-home days a week", "Shift travel by 30 minutes to avoid peak traffic if you can"] },
  { id: "delegate", title: "Delegate one thing you hold too tightly", for: ["leading", "responsibility", "workload"], why: "Leaders burn out when they carry what their team could carry.",
    steps: ["Pick one recurring task someone else could do 80% as well", "Hand it over with a clear outcome and a check-in date", "Use the time freed for thinking, not more tasks"] },
];

const ACTION = new Map(ACTIONS.map((a) => [a.id, a]));

/** The 3 actions for the 30-day plan: support first when needed, then the
 *  strongest driver, then the weakest resource. */
export function planActionsFor(s: StressScores): string[] {
  const picks: string[] = [];
  const add = (id?: string) => { if (id && !picks.includes(id) && picks.length < 3) picks.push(id); };
  const forKey = (key: string) => ACTIONS.find((a) => a.for.includes(key) && !picks.includes(a.id))?.id;

  if (s.safety === "high") add("talk");
  for (const d of s.drivers.slice(0, 2)) add(forKey(d.source));
  if (s.coping.scales.substance >= 50 || s.coping.scales.givingup >= 50) add("coping-swap");
  if (s.recovery.sleep !== null && s.recovery.sleep <= 25) add("sleep");
  const resources: PillarKey[] = ["recovery", "support", "control", "resilience", "coping"];
  const weakest = [...resources].sort((a, b) => s.pillars[a] - s.pillars[b]);
  for (const k of weakest) add(forKey(k));
  if (s.burnout.band !== "low") add("break-plan");
  return picks.length ? picks : ["shutdown", "move", "support-circle"];
}

export const actionById = (id: string) => ACTION.get(id);

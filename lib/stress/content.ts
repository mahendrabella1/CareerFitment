/**
 * Words for the Stress & Resilience results page: zones, pillars, the four
 * workplace stressor areas, what drives stress, career-stage notes and the
 * action library behind the 30-day plan. Plain, warm, non-clinical language -
 * this is a wellbeing check, never a diagnosis.
 */
import { PRESSURE_PILLARS, type Band, type DomainKey, type PillarKey, type StressScores, type Zone } from "./types";

export const HELPLINE = { name: "Tele-MANAS", number: "14416", alt: "1-800-891-4416", note: "Free, 24x7 mental-health support from the Government of India, in 20+ languages." };

export const BAND_META: Record<Band, { label: string; title: string; blurb: string; typical: string[] }> = {
  "0-5": {
    label: "0 - 5 years", title: "Early career",
    blurb: "The first years at work are a steep climb: new skills, a first manager, proving yourself and often a first salary to manage.",
    typical: ["Learning fast while expected to deliver", "Self-doubt and comparing with friends", "Saying yes to everything to prove yourself", "A salary that has to cover rent and EMIs"],
  },
  "5-15": {
    label: "5 - 15 years", title: "Mid career",
    blurb: "Mid-career brings more responsibility at work and at home at the same time - often the most loaded years.",
    typical: ["Leading people for the first time", "Staying at the same level too long", "Children, parents and work all at once", "Skills that AI and new tools are changing"],
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
  load: { label: "Work pressures", short: "Workload, behaviour at work, culture, career security", icon: "briefcase", high: "A lot is weighing on you at work right now.", mid: "Noticeable pressure at work - worth keeping an eye on.", low: "Pressure at work feels manageable." },
  signals: { label: "Stress signals", short: "How stress shows in body and mind", icon: "pulse", high: "Stress is showing in your sleep, body or mood.", mid: "Some stress signals are showing.", low: "Few stress signals right now." },
  burnout: { label: "Burnout", short: "Copenhagen Burnout Inventory", icon: "power", high: "Your energy is running low.", mid: "Your energy is starting to dip.", low: "Your energy is holding up." },
  coping: { label: "Coping balance", short: "Helpful vs risky ways of coping", icon: "shield", high: "You mostly cope in helpful ways.", mid: "A mix of helpful and less helpful coping.", low: "Some ways of coping are working against you." },
  resilience: { label: "Resilience", short: "How fast you bounce back", icon: "route", high: "You bounce back well.", mid: "You usually bounce back, given time.", low: "Setbacks stay with you for a while." },
  recovery: { label: "Recovery", short: "Sleep, breaks and switching off", icon: "clock", high: "You recharge well.", mid: "You recharge some of the time.", low: "You're not getting enough time to recharge." },
  control: { label: "Staying calm", short: "Noticing and managing your reactions", icon: "heart", high: "You manage your reactions well.", mid: "Mostly calm, with some reactive moments.", low: "Pressure can push you into reactions you regret." },
  support: { label: "Support", short: "Manager, family, friends and mentors", icon: "users", high: "You have good people around you.", mid: "Some support, with room for more.", low: "You may be carrying this alone." },
};

/** The four workplace stressor areas (together: "Work pressures"). */
export const DOMAIN_META: Record<DomainKey, { label: string; icon: string; short: string; high: string; mid: string; low: string }> = {
  workload: { label: "Workload", icon: "briefcase", short: "Tasks, deadlines, hours, control, clarity",
    high: "Your workload and how work is organised are a major strain.", mid: "Your workload is noticeable - worth keeping an eye on.", low: "Your workload feels under control." },
  toxicity: { label: "Behaviour at work", icon: "shield", short: "Fear-based leadership, gaslighting, gossip, harassment",
    high: "You're dealing with harmful behaviour at work. That isn't your fault - and it's worth acting on.", mid: "Some harmful behaviour around you - don't let it become normal.", low: "Little harmful behaviour around you." },
  culture: { label: "Culture & relationships", icon: "users", short: "Politics, bullying, psychological safety, fit",
    high: "Your workplace culture or relationships are wearing you down.", mid: "Parts of your workplace culture are a strain.", low: "Your workplace feels safe and respectful." },
  career: { label: "Career & job security", icon: "route", short: "Job security, growth, pay, recognition",
    high: "Worry about your job, pay or growth is weighing on you.", mid: "Some worry about your job, pay or growth.", low: "You feel reasonably secure about your career." },
};

/** A pillar or area score in plain words, whichever direction "good" is for it. */
export function pillarTone(key: PillarKey | DomainKey, score: number): "good" | "okay" | "watch" {
  const isResource = !(PRESSURE_PILLARS as string[]).includes(key) && !["workload", "toxicity", "culture", "career"].includes(key);
  const strain = isResource ? 100 - score : score;
  return strain < 40 ? "good" : strain < 60 ? "okay" : "watch";
}

export const DRIVER_META: Record<string, { label: string; icon: string }> = {
  // Workload
  tasks: { label: "Too many tasks", icon: "briefcase" },
  deadlines: { label: "Unrealistic deadlines", icon: "clock" },
  overtime: { label: "Working overtime", icon: "clock" },
  balance: { label: "Work-life imbalance", icon: "home" },
  boundaries: { label: "No boundaries after work hours", icon: "phone" },
  outside: { label: "Responsibilities outside your job", icon: "home" },
  flexibility: { label: "No freedom or flexibility", icon: "lock" },
  excluded: { label: "Left out of decisions", icon: "user" },
  expectations: { label: "Unclear expectations", icon: "signpost" },
  communication: { label: "Poor communication", icon: "doc" },
  roleconflict: { label: "Conflicting demands", icon: "scale" },
  learning: { label: "Steep learning curve", icon: "book" },
  proving: { label: "Saying yes to everything", icon: "check" },
  leading: { label: "Managing people", icon: "users" },
  familybalance: { label: "Work-family balance", icon: "home" },
  responsibility: { label: "Weight of big decisions", icon: "scale" },
  longhours: { label: "Long working hours", icon: "clock" },
  noleave: { label: "No time off this year", icon: "calendar" },
  commute: { label: "Long commute", icon: "route" },
  sleep: { label: "Short sleep", icon: "clock" },
  // Behaviour at work
  fearleader: { label: "Fear-based leadership", icon: "power" },
  gaslighting: { label: "Gaslighting - facts twisted or denied", icon: "help" },
  gossip: { label: "Gossip and rumours", icon: "users" },
  cliques: { label: "Cliques and exclusion", icon: "users" },
  credit: { label: "Undermining or credit stealing", icon: "xcircle" },
  discrimination: { label: "Unfair or unethical treatment", icon: "scale" },
  harassment: { label: "Harassment", icon: "shield" },
  hostileteam: { label: "Hostile team dynamics", icon: "users" },
  // Culture & relationships
  politics: { label: "Office politics", icon: "compass" },
  bullying: { label: "Bullying or being belittled", icon: "shield" },
  psychsafety: { label: "Not safe to speak up", icon: "lock" },
  peers: { label: "No support from colleagues", icon: "users" },
  fit: { label: "Your values don't fit the organisation", icon: "compass" },
  orgchange: { label: "Organisational change", icon: "layers" },
  relations: { label: "Strained relationships at work", icon: "users" },
  isolation: { label: "No one to confide in at work", icon: "user" },
  // Career & job security
  layoffs: { label: "Fear of layoffs", icon: "shield" },
  suddenloss: { label: "Risk of sudden job loss", icon: "xcircle" },
  promotion: { label: "No chance of promotion", icon: "flag" },
  skills: { label: "No skill development", icon: "book" },
  costofliving: { label: "Salary below cost of living", icon: "wallet" },
  payeffort: { label: "Pay doesn't match effort", icon: "wallet" },
  recognition: { label: "No recognition", icon: "award" },
  stuck: { label: "Feeling stuck in your career", icon: "route" },
  confidence: { label: "Self-doubt at work", icon: "help" },
  comparison: { label: "Comparing yourself with others", icon: "users" },
  plateau: { label: "Same level for too long", icon: "flag" },
  future: { label: "AI and changing skills", icon: "cpu" },
  relevance: { label: "Staying relevant", icon: "compass" },
  longterm: { label: "Long-term family finances", icon: "bank" },
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
  { id: "harassment-rights", title: "Know your rights - and use them", for: ["harassment"], why: "Harassment at work is never your fault, and Indian law gives you a clear way to act on it.",
    steps: ["Write down each incident privately: date, what happened, who saw it - and keep any messages", "Organisations with 10 or more employees must have an Internal Committee under the POSH Act; a complaint is normally made within 3 months of the incident (this can be extended by another 3). Women employees can also use the government's SHe-Box portal (shebox.wcd.gov.in)", "Talk to someone you trust, and see OneGrasp's Law & Rights section for your options"],
    link: { href: "/account/legal", label: "Open Law & Rights" } },
  { id: "toxic-record", title: "Keep a private record and know your options", for: ["discrimination", "gaslighting", "fearleader", "credit", "bullying", "hostileteam"], why: "Harmful behaviour wears you down partly because it's hard to pin down. A record makes it real - for you and for anyone you report it to.",
    steps: ["After each incident, note the date, what was said or done, and who was there - email it to yourself", "Share what's happening with one trusted person outside the situation", "If it continues, raise it with HR or a senior leader, using your notes - and check your rights in Law & Rights"],
    link: { href: "/account/legal", label: "Open Law & Rights" } },
  { id: "allies", title: "Build two allies at work", for: ["politics", "gossip", "cliques", "peers", "relations", "isolation", "orgchange"], why: "Politics and exclusion hit hardest when you're on your own. Two trusted allies change how work feels.",
    steps: ["Pick two colleagues you respect - ideally in different teams", "Have a coffee or a 15-minute call with each this week, with no agenda", "Stay out of gossip yourself: change the subject or simply don't add to it"] },
  { id: "speak-safely", title: "Raise one concern the safe way", for: ["psychsafety", "excluded", "communication", "fit"], why: "In places where speaking up feels risky, a calm one-to-one with facts is the safest way to be heard.",
    steps: ["Choose one concern that matters most and write it in two sentences", "Raise it one-to-one, not in a group: \"I noticed X; it affects Y; could we try Z?\"", "Ask to be included in the next decision that affects your work"] },
  { id: "clarity", title: "Get your expectations in writing", for: ["expectations", "roleconflict", "communication", "orgchange"], why: "Unclear or conflicting expectations create stress you can't work your way out of.",
    steps: ["Write down what you think your top priorities and deliverables are", "Send it to your manager and ask: \"Is this right? What would you change?\"", "When two people ask for conflicting things, ask your manager to decide the order"] },
  { id: "priorities", title: "Agree your top 3 priorities every Monday", for: ["tasks", "deadlines", "proving", "overtime"], why: "Most overload comes from everything feeling urgent at once.",
    steps: ["List everything on your plate, then pick the 3 that matter most this week", "Share the 3 with your manager in two lines and ask: \"Anything to drop or delay?\"", "Say \"not this week\" to anything outside the 3 unless it's truly urgent"] },
  { id: "focus", title: "Protect two focus blocks a day", for: ["tasks", "deadlines", "longhours", "overtime"], why: "Deep work in short protected blocks gets more done in fewer hours.",
    steps: ["Block two 90-minute slots in your calendar each day", "Turn off chat and email notifications during them", "Do your hardest task in the first block"] },
  { id: "manager-talk", title: "Have a 20-minute workload talk with your manager", for: ["excluded", "flexibility", "leading", "deadlines"], why: "Managers often don't see the full load. A calm, specific ask changes more than silent effort.",
    steps: ["Write down your current tasks and roughly how long each takes", "Ask for one specific change: a deadline, a priority, or support", "Agree a date to check in again"] },
  { id: "flex-proposal", title: "Propose a flexible arrangement", for: ["flexibility", "balance", "familybalance", "outside", "commute"], why: "A small, specific change in when or where you work can ease a lot of pressure.",
    steps: ["Decide what would help most: start/end times, a work-from-home day, or a compressed week", "Write a short proposal showing how your work will still get done", "Ask for a one-month trial, then review it together"] },
  { id: "pay-talk", title: "Prepare a pay and recognition conversation", for: ["payeffort", "recognition", "costofliving"], why: "Feeling underpaid or unseen is a strong, lasting stressor - and asking with evidence works better than waiting.",
    steps: ["List your achievements from the last 12 months, with numbers where you can", "Check what similar roles pay in your city", "Ask your manager for a review meeting, and request one clear outcome"] },
  { id: "safety-net", title: "Build your safety net", for: ["layoffs", "suddenloss"], why: "Job insecurity eases when you know you'd land on your feet.",
    steps: ["Update your CV and LinkedIn this week", "Start (or top up) an emergency fund towards 3-6 months of expenses", "Reconnect with 3 people in your field - and look at live roles on your path"],
    link: { href: "/account/jobs", label: "Explore jobs on your path" } },
  { id: "money", title: "Make a 30-day money plan", for: ["costofliving", "longterm"], why: "Money worry eases fastest when you can see the numbers and have a buffer.",
    steps: ["List income, fixed costs (rent, EMIs) and what's left", "Set aside a small fixed amount each month towards a 3-month emergency fund", "Use OneGrasp's Money labs to build the plan"], link: { href: "/account/money", label: "Open Money labs" } },
  { id: "career-map", title: "Map your next career step", for: ["stuck", "promotion", "skills", "plateau", "relevance", "future", "fit"], why: "Feeling stuck is stressful mostly because the next step is unclear.",
    steps: ["Pick 3 roles you'd like in 2-3 years", "Check what each needs in the Career Library and live job listings", "Choose one skill to build this month and block an hour a week for it"], link: { href: "/account/jobs", label: "Explore jobs on your path" } },
  { id: "learning-buddy", title: "Find a learning buddy", for: ["learning", "confidence", "skills"], why: "Learning alongside someone halves the stress of a steep curve.",
    steps: ["Ask a colleague or senior for a 30-minute weekly chat", "Bring your 2 biggest questions each time", "Write down one thing you learned after each chat"] },
  { id: "wins-log", title: "Keep a daily wins log", for: ["confidence", "comparison", "selfblame", "recognition"], why: "Self-doubt and self-blame shrink when you have evidence of what you do well.",
    steps: ["Each evening, write 2 things that went well and 1 thing you learned", "Re-read the week's list every Friday", "Mute or limit the social feeds that make you compare"] },
  { id: "no-practice", title: "Practise one polite \"not now\"", for: ["proving", "tasks", "boundaries"], why: "Saying yes to everything spreads you too thin - and people respect clear limits.",
    steps: ["When a new request comes, ask for 5 minutes before you answer", "Reply: \"I can do this by [date], or now if we move [task]\"", "Note how it went - most people accept it"] },
  { id: "boundaries", title: "Set an off-hours limit for work messages", for: ["boundaries", "balance", "recovery", "longhours"], why: "Constant availability keeps stress switched on all evening.",
    steps: ["Choose a time after which you don't check work messages", "Turn off work notifications after that time", "Tell your team, and agree how they reach you only for true emergencies"] },
  { id: "shutdown", title: "Start a 10-minute shutdown ritual", for: ["recovery", "overtime", "longhours", "responsibility"], why: "Switching off after work is the single strongest habit for recovering from stress.",
    steps: ["At the end of work, write tomorrow's top 3 tasks", "Close the laptop and say \"done for today\"", "Do one thing that marks the switch: a walk, a shower, music"] },
  { id: "sleep", title: "Fix your sleep window", for: ["sleep", "signals"], why: "Sleep is when your body clears the day's stress. Short sleep makes everything harder.",
    steps: ["Same sleep and wake time every day, weekends included (within an hour)", "No screens for 30 minutes before bed", "Keep caffeine to before 2 pm"] },
  { id: "move", title: "Move for 20 minutes a day", for: ["recovery", "signals"], why: "Physical activity is one of the most reliable ways to bring stress down.",
    steps: ["Walk, cycle or do any exercise for 20 minutes daily", "Try a walking call or a walk after lunch", "Track the days you did it - aim for 5 a week"] },
  { id: "breathe", title: "Use the 90-second pause", for: ["control", "signals"], why: "A short pause turns a reaction into a response.",
    steps: ["When you feel stress rising, stop for 90 seconds before replying", "Breathe in for 4 counts, out for 6, five times", "Then ask: \"What's the one thing I need here?\""] },
  { id: "coping-swap", title: "Swap one escape habit for a reset", for: ["substance", "givingup"], why: "Alcohol, endless scrolling or giving up bring short relief but make stress come back stronger.",
    steps: ["Notice when you reach for the habit and what triggered it", "Replace it 3 times this week with a walk, a call or 10 minutes outside", "If cutting down feels hard, talk to a doctor or counsellor"] },
  { id: "support-circle", title: "Rebuild your support circle", for: ["support", "isolation", "peers"], why: "People with support around them handle the same pressure with less strain.",
    steps: ["Name 2 people you can talk to - one at work, one outside", "Reach out to each this week, even just for a chai or a call", "Ask a senior person to be an informal mentor"] },
  { id: "break-plan", title: "Plan a real break", for: ["noleave", "burnout", "recovery"], why: "Without time off, recovery never fully catches up with pressure.",
    steps: ["Block at least 2-3 days of leave in the next 6 weeks", "Keep one full day each week completely work-free", "Before leave, hand over and set an out-of-office"] },
  { id: "family-share", title: "Share the load at home", for: ["outside", "familybalance", "balance"], why: "Home responsibilities feel lighter when they're planned and shared.",
    steps: ["List the week's home tasks with your partner or family", "Agree who does what, and one thing to drop or outsource", "Protect one family evening a week from work"] },
  { id: "commute", title: "Make your commute count", for: ["commute"], why: "A long commute can become recovery time instead of lost time.",
    steps: ["Use it for music, a podcast or a call with a friend - not work email", "Ask about one or two work-from-home days a week", "Shift travel by 30 minutes to avoid peak traffic if you can"] },
  { id: "delegate", title: "Delegate one thing you hold too tightly", for: ["leading", "responsibility", "tasks"], why: "Leaders burn out when they carry what their team could carry.",
    steps: ["Pick one recurring task someone else could do 80% as well", "Hand it over with a clear outcome and a check-in date", "Use the time freed for thinking, not more tasks"] },
];

const ACTION = new Map(ACTIONS.map((a) => [a.id, a]));

/** The 3 actions for the 30-day plan: support and rights first when needed,
 *  then the strongest drivers, then the weakest resource. */
export function planActionsFor(s: StressScores): string[] {
  const picks: string[] = [];
  const add = (id?: string) => { if (id && !picks.includes(id) && picks.length < 3) picks.push(id); };
  const forKey = (key: string) => ACTIONS.find((a) => a.for.includes(key) && !picks.includes(a.id))?.id;

  if (s.safety === "high") add("talk");
  if (s.rights?.harassment) add("harassment-rights");
  else if (s.rights?.discrimination) add("toxic-record");
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

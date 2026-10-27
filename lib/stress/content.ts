/**
 * The words of the Workplace Stress Check: levels, the four areas, notes per
 * career stage, the "work or workplace" quadrants and the action library the
 * 30-day plan is built from. Pure data + small pure helpers.
 */
import { BANK, areaOf } from "./bank";
import { driverByKey } from "./drivers";
import { AREAS, type AreaKey, type Band, type Level, type Quadrant, type StressScores } from "./types";
import { valueOf } from "./scoring";

export const HELPLINE = { name: "Tele-MANAS", number: "14416", alt: "1-800-891-4416", note: "Free, confidential, 24x7 mental-health support from the Government of India, in 20+ languages." };

export const BAND_META: Record<Band, { label: string; title: string }> = {
  "0-5": { label: "0-5 years", title: "Early career" },
  "5-15": { label: "5-15 years", title: "Mid career" },
  "15+": { label: "15+ years", title: "Senior career" },
};

/** One hue, light -> dark: the darker the step, the more stress. */
export const LEVEL_META: Record<Level, { label: string; color: string; range: string }> = {
  low: { label: "Low", color: "#86b6ef", range: "0-24" },
  mild: { label: "Mild", color: "#5598e7", range: "25-44" },
  moderate: { label: "Moderate", color: "#256abf", range: "45-64" },
  high: { label: "High", color: "#104281", range: "65-100" },
};
export const LEVELS: Level[] = ["low", "mild", "moderate", "high"];

/** One colour per area (identity, not level) - the first four slots of the
 *  validated categorical palette, used the same way in every chart. */
export const AREA_COLOR: Record<AreaKey, string> = { workload: "#2a78d6", toxicity: "#eb6834", culture: "#1baf7a", career: "#eda100" };

export const AREA_META: Record<AreaKey, { label: string; icon: string; question: string; text: Record<Level, string> }> = {
  workload: {
    label: "Workload", icon: "briefcase", question: "Is your load sustainable?",
    text: {
      low: "Your workload feels manageable - the hours, deadlines and clarity are working for you.",
      mild: "Mostly manageable, with a few pressure points worth keeping an eye on.",
      moderate: "Your workload is regularly more than is sustainable. This is usually the most fixable area - through priorities, deadlines and boundaries.",
      high: "Your workload is consistently too heavy. Left as it is, this is the classic route to burnout - start with one conversation about priorities this week.",
    },
  },
  toxicity: {
    label: "Toxic behaviour", icon: "shield", question: "How do people behave around you?",
    text: {
      low: "You see little toxic behaviour at work - a real asset.",
      mild: "Some difficult behaviour shows up now and then. Worth noticing; not yet a pattern.",
      moderate: "Toxic behaviour is a regular part of your work life. Protect yourself: keep a record, build allies and know your options.",
      high: "You're working in a hostile environment. It isn't your fault and it isn't normal - keep a record, use the routes open to you, and think about your options.",
    },
  },
  culture: {
    label: "Culture & safety", icon: "users", question: "Is it safe to be yourself?",
    text: {
      low: "Your workplace feels safe and supportive - you can speak up and get help.",
      mild: "Mostly supportive, with some politics or tension in places.",
      moderate: "It often doesn't feel safe to speak up or rely on others. Allies and careful framing help while you work out what can change.",
      high: "The culture around you is draining - politics, poor support or a poor fit. Look after your energy, and be honest with yourself about whether this can change.",
    },
  },
  career: {
    label: "Career & security", icon: "route", question: "Is this job building your future?",
    text: {
      low: "You feel secure, you're growing and you feel fairly rewarded.",
      mild: "Mostly positive, with one or two worries about growth, pay or security.",
      moderate: "Worries about job security, growth or pay are weighing on you. A safety net and one clear growth conversation will reduce them.",
      high: "Your career feels stuck or insecure, and that weighs on everything else. Build your safety net now, and get clear on what it would take to grow - here or elsewhere.",
    },
  },
};

export const STAGE_NOTES: Record<Band, Record<AreaKey, string>> = {
  "0-5": {
    workload: "Early on, many people say yes to everything to prove themselves. Agreeing priorities is a career skill, not a weakness.",
    toxicity: "Newer employees are more often on the receiving end of blame and credit-stealing. A written trail protects you more than seniority would.",
    culture: "In your first jobs, a good manager and a few supportive peers matter more than the company's name. If you have neither, that's worth acting on.",
    career: "Slow promotion in the first two years is common; how much you're learning matters more. If you aren't learning, that's the real warning sign.",
  },
  "5-15": {
    workload: "Mid-career is often the most loaded stage - more responsibility at work and at home at the same time. Delegating and saying no become essential.",
    toxicity: "You may be handling difficult behaviour from above and below. Model the behaviour you want - and still keep records.",
    culture: "Office politics often peaks here, as roles near the top get fewer. Allies across teams are your best protection.",
    career: "Staying at one level for 3+ years, or skills that new tools are replacing, are the most common mid-career worries. A skill sprint and a growth conversation help.",
  },
  "15+": {
    workload: "Senior roles carry decisions that follow you home. Protecting thinking time and delegating matter as much as the hours.",
    toxicity: "At senior level you set the tone. If the behaviour comes from above you, your experience and network give you more options than it may feel like.",
    culture: "Senior people often have few people to speak openly with. An outside mentor or peer group fills that gap.",
    career: "Restructuring hits senior roles hard. Your network, a refreshed profile and savings are your safety net - and experience is valued in advisory, consulting and teaching roles too.",
  },
};

export const QUADRANT_META: Record<Quadrant, { title: string; text: string; focus: string }> = {
  steady: {
    title: "Steady ground",
    text: "Neither the work nor the workplace is weighing heavily on you. Keep the habits that protect this.",
    focus: "Keep your boundaries and recovery time.",
  },
  load: {
    title: "Good place, heavy load",
    text: "The workplace itself seems okay - it's the amount and organisation of the work that hurts. That's the most fixable combination: change how the work is set up, not where you work.",
    focus: "Focus on priorities, deadlines and boundaries.",
  },
  place: {
    title: "Manageable work, hard place",
    text: "The work itself is manageable, but the people, culture or prospects are not. Talking about workload won't fix this - protect yourself and start building options.",
    focus: "Focus on records, allies and your safety net.",
  },
  both: {
    title: "Heavy load in a hard place",
    text: "Both the work and the workplace are weighing on you. Look after your health first, fix what you can quickly, and start a calm 6-month plan for your options.",
    focus: "Start with recovery and one priorities conversation; build your safety net alongside.",
  },
};

export interface Action {
  id: string;
  area: AreaKey | "support";
  title: string;
  why: string;
  time: string;
  /** week 3 = weeks 3-4. */
  steps: { week: 1 | 2 | 3; text: string }[];
  script?: { label: string; text: string };
  link?: { href: string; label: string };
}

export const ACTIONS: Action[] = [
  {
    id: "talk", area: "support", title: "Talk to someone this week", time: "15 min",
    why: "You said you're struggling. You don't have to work this out alone - talking to someone is the most useful first step.",
    steps: [
      { week: 1, text: "Tell one person you trust how things really are." },
      { week: 1, text: "If it feels heavy, call Tele-MANAS on 14416 - free, confidential, 24x7, in your language." },
      { week: 2, text: "Ask HR whether your company offers an Employee Assistance Programme (free, private counselling)." },
      { week: 3, text: "If sleep, appetite or mood stay low for two weeks or more, see a doctor or counsellor." },
    ],
  },
  // ---------- Workload ----------
  {
    id: "priorities", area: "workload", title: "Agree your top priorities with your manager", time: "30 min to prepare, 20 min to talk",
    why: "Too many tasks usually means nobody has said what can wait. One conversation can take a third off your list.",
    steps: [
      { week: 1, text: "List everything on your plate, with rough hours for each." },
      { week: 1, text: "Book 20 minutes with your manager - say it's about priorities, not a complaint." },
      { week: 2, text: "Agree your top three, and what can wait, move or be dropped." },
      { week: 3, text: "Re-check the list in your weekly 1:1 before saying yes to anything new." },
    ],
    script: { label: "Message to book the conversation", text: "Hi [Name], could we take 20 minutes this week to go through my current work? I have more on my plate than I can do well, and I'd like to agree the top priorities so the important things get my best effort. I'll bring a list." },
  },
  {
    id: "deadline", area: "workload", title: "Answer unrealistic deadlines with options", time: "5 min each time",
    why: "Saying yes to every deadline and missing some hurts you more than an early, calm \"here's what's possible\".",
    steps: [
      { week: 1, text: "When the next deadline lands, estimate it honestly before you reply." },
      { week: 1, text: "Reply with two options: the full thing later, or a smaller version on time." },
      { week: 2, text: "Note which option was chosen, in a short email or chat message." },
      { week: 3, text: "Track how often deadlines move - bring the pattern to your manager." },
    ],
    script: { label: "Reply to an unrealistic deadline", text: "Thanks - I want to get this right. To do all of it by [date], I'd have to pause [other task]. Two options: (1) the full version by [later date], or (2) [smaller scope] by [date] and the rest by [later date]. Which works better for you?" },
  },
  {
    id: "boundary", area: "workload", title: "Set one after-hours boundary", time: "15 min to set up",
    why: "Being always available keeps your stress response switched on. One clear, announced boundary is easier to keep than many vague ones.",
    steps: [
      { week: 1, text: "Pick one rule - for example no work messages after 9 pm, or no laptop on Sundays." },
      { week: 1, text: "Turn off work notifications for that time on your phone." },
      { week: 2, text: "Tell your team, and agree what counts as a real emergency and how to reach you." },
      { week: 3, text: "Keep a tally: how often you broke it, and whether anything actually went wrong." },
    ],
    script: { label: "Message to your team", text: "Quick note: from this week I'll be offline from [9 pm] to [8 am] on weekdays. If something is truly urgent, please call me on [number]. Everything else I'll pick up first thing in the morning." },
  },
  {
    id: "flex", area: "workload", title: "Propose a 4-week flexibility trial", time: "30 min",
    why: "A small, time-limited trial is far easier for a manager to say yes to than a permanent change.",
    steps: [
      { week: 1, text: "Decide the one change that would help most - start time, one home day, a fixed finish time." },
      { week: 1, text: "Write a short proposal: what changes, how work stays covered, how you'll measure it." },
      { week: 2, text: "Share it with your manager and ask for a 4-week trial." },
      { week: 3, text: "At the end, review the results together and agree what continues." },
    ],
    script: { label: "Flexibility trial proposal", text: "I'd like to propose a 4-week trial: [the change, e.g. working from home on Wednesdays / starting at 8 and finishing at 5]. My deliverables and response times stay the same, and [how meetings and cover are handled]. After 4 weeks we can review [deadlines met, output] and decide together whether to continue." },
  },
  {
    id: "clarity", area: "workload", title: "Write down what \"good\" looks like in your role", time: "45 min",
    why: "Unclear expectations and clashing requests are among the most common - and most fixable - causes of work stress.",
    steps: [
      { week: 1, text: "Write your top 5 responsibilities and how you think success is measured." },
      { week: 1, text: "Note the requests that clash, and who they come from." },
      { week: 2, text: "Go through it with your manager and correct it together." },
      { week: 2, text: "Send a short recap email so the agreement is in writing." },
      { week: 3, text: "When requests clash, point both people to the agreed priorities." },
    ],
    script: { label: "Recap email after the conversation", text: "Thanks for the time today. To confirm what we agreed: my main priorities are (1) …, (2) …, (3) … Success looks like … When requests clash with these, I'll check with you before switching. Please tell me if I've missed anything." },
  },
  {
    id: "recovery", area: "workload", title: "Protect your recovery time", time: "10-20 min a day",
    why: "Exhaustion builds when recovery shrinks. Small, fixed recovery habits work better than a once-a-year holiday.",
    steps: [
      { week: 1, text: "Set a fixed sleep window and keep it on weekdays for a week." },
      { week: 1, text: "Take one real 10-minute break in your workday, away from screens." },
      { week: 2, text: "Keep one day a week fully work-free, messages included." },
      { week: 3, text: "Put your next leave on the calendar, even if it's only 2-3 days." },
    ],
  },
  // ---------- Toxic behaviour ----------
  {
    id: "rights", area: "toxicity", title: "Know your options on harassment and unfair treatment", time: "20 min to read",
    why: "You don't have to put up with it. Indian law gives you clear routes - with deadlines that matter.",
    steps: [
      { week: 1, text: "Find your company's POSH policy and who sits on its Internal Committee - every organisation with 10 or more employees must have one." },
      { week: 1, text: "Start a private, dated record of what happened (use the incident template in \"Keep a private, dated record\")." },
      { week: 2, text: "A POSH complaint should be filed within 3 months of the incident (the committee can extend this by 3 more). For unfair treatment, use HR's grievance process or the ethics helpline, in writing." },
      { week: 3, text: "If it isn't handled, women can also complain on the government's SHe-Box portal (shebox.wcd.gov.in); a lawyer or our Law & Rights page can help with next steps." },
    ],
    link: { href: "/account/legal", label: "Open Law & Rights" },
  },
  {
    id: "record", area: "toxicity", title: "Keep a private, dated record", time: "5 min after each incident",
    why: "Gaslighting, credit-stealing and bullying thrive on vague memories. A same-day written record protects you and makes any complaint credible.",
    steps: [
      { week: 1, text: "Start a private note on your own phone or email - not a company device or drive." },
      { week: 1, text: "For each incident, write the date, what was said or done, who was there and how it affected your work." },
      { week: 2, text: "Keep copies of related emails and messages, within your company's rules." },
      { week: 3, text: "Read it back: is there a pattern? That's the basis for any conversation with HR." },
    ],
    script: { label: "Incident record template", text: "Date and time:\nWhere:\nWho was involved:\nWhat was said or done (exact words if you can):\nWho else saw or heard it:\nHow it affected you or your work:\nEvidence (emails, messages, files):" },
  },
  {
    id: "visible", area: "toxicity", title: "Make your work visible", time: "10 min a week",
    why: "If someone takes credit or later \"remembers it differently\", a short written trail settles it - calmly.",
    steps: [
      { week: 1, text: "After important meetings, send a 3-line recap of decisions and who does what." },
      { week: 2, text: "Send your manager a short weekly update: done, in progress, blocked." },
      { week: 3, text: "Present your own work in reviews and demos wherever you can." },
    ],
    script: { label: "Meeting recap", text: "Thanks all. To recap today: we decided …; I'll do … by …; [Name] will do … by … Let me know if I've got anything wrong." },
  },
  {
    id: "gossip", area: "toxicity", title: "Step out of gossip and cliques", time: "A few minutes a day",
    why: "You can't fix a team's culture alone, but you can stop it pulling you in - and build ties outside the clique.",
    steps: [
      { week: 1, text: "Prepare one neutral line to leave gossip without offending anyone." },
      { week: 2, text: "Have one coffee or lunch with someone outside your usual group." },
      { week: 3, text: "Share credit openly in team settings - it lowers the temperature." },
    ],
    script: { label: "Neutral ways to step out", text: "\"I don't know the full story, so I'll stay out of it.\"\n\"Let's not talk about them when they're not here - shall we get back to the plan?\"\n\"If it matters, I'd rather ask them directly.\"" },
  },
  {
    id: "escalate", area: "toxicity", title: "Raise a pattern safely", time: "1 hour to prepare",
    why: "One-off rudeness can be talked through. A pattern of fear, blame or belittling is a management problem - raise it with facts.",
    steps: [
      { week: 1, text: "Keep your record for 2-3 weeks so you can show a pattern." },
      { week: 2, text: "Decide where to raise it: your manager's manager, HR or an ethics channel." },
      { week: 2, text: "Ask for the meeting in writing, and bring 2-3 specific examples." },
      { week: 3, text: "Send a short summary afterwards and ask what happens next, and by when." },
    ],
    script: { label: "Email to HR or a skip-level manager", text: "Hi [Name], I'd like to request a confidential conversation about a pattern of behaviour in my team that is affecting my work. I have notes of specific incidents from [dates]. Could we meet this week or next? Thank you." },
  },
  // ---------- Culture & psychological safety ----------
  {
    id: "allies", area: "culture", title: "Build two allies", time: "30 min a week",
    why: "Peer support is one of the strongest buffers against work stress - and it makes politics less dangerous.",
    steps: [
      { week: 1, text: "Name two people you trust or respect, ideally in different teams." },
      { week: 2, text: "Have a coffee or call with each - ask about their work and offer help first." },
      { week: 3, text: "Keep a regular check-in going, even 15 minutes every two weeks." },
    ],
  },
  {
    id: "speakup", area: "culture", title: "Speak up with less risk", time: "5 min before a meeting",
    why: "When it doesn't feel safe to disagree, framing matters. Questions and facts get heard; accusations get defended.",
    steps: [
      { week: 1, text: "Before your next meeting, write down the one point you want to raise." },
      { week: 1, text: "Phrase it as a question or a risk, backed by one fact." },
      { week: 2, text: "Share it with an ally first, so you're not alone in the room." },
      { week: 3, text: "Follow up in writing so your input is on record." },
    ],
    script: { label: "Safer ways to disagree", text: "\"Can I check one risk before we decide? …\"\n\"What would we need to see to know this is working?\"\n\"I might be missing something - the data I have shows …\"" },
  },
  {
    id: "values", area: "culture", title: "Run a values check on this job", time: "30 min",
    why: "Feeling you don't fit is draining over time. Knowing what you need tells you what to fix - and what to walk away from.",
    steps: [
      { week: 1, text: "Write your 5 non-negotiables at work (for example honesty, learning, fair pay, family time)." },
      { week: 1, text: "Score this job from 1 to 5 on each." },
      { week: 2, text: "For each low score, decide honestly: can this change here, or not?" },
      { week: 3, text: "If two or more can't change, start building your safety net and options." },
    ],
  },
  {
    id: "change", area: "culture", title: "Get clarity on the change", time: "20 min",
    why: "Uncertainty is often more stressful than bad news. Three good questions usually tell you more than the town hall did.",
    steps: [
      { week: 1, text: "Write down what you don't know about the change and how it might affect you." },
      { week: 1, text: "Ask your manager the three questions in the script." },
      { week: 2, text: "Agree what you'll focus on during the change, so you're judged on the right things." },
    ],
    script: { label: "Three questions for your manager", text: "1. What does this change mean for my role and my team in the next 3 months?\n2. What will matter most in how my work is judged during the change?\n3. When will we know more, and how will we hear?" },
  },
  // ---------- Career & job security ----------
  {
    id: "safetynet", area: "career", title: "Build your 6-month safety net", time: "2 hours over the month",
    why: "Fear of layoffs is worst when you feel trapped. Savings, an updated CV and a warm network turn fear into a plan.",
    steps: [
      { week: 1, text: "Update your CV and LinkedIn with your results from the last 2 years." },
      { week: 1, text: "Check your notice period, notice pay and any severance terms in your appointment letter." },
      { week: 2, text: "Work out your monthly must-pay costs and set a target of 3-6 months' savings." },
      { week: 3, text: "Reconnect with 3 people in your field - not to ask for a job, just to stay in touch." },
      { week: 3, text: "Look at what's open in your field, so you know your market." },
    ],
    link: { href: "/jobs", label: "Browse current jobs" },
  },
  {
    id: "growth", area: "career", title: "Ask for a growth conversation", time: "20 min",
    why: "Many people wait years for a promotion that was never discussed. Asking what it takes - and writing it down - makes the path visible.",
    steps: [
      { week: 1, text: "Book time with your manager about your next 12 months." },
      { week: 2, text: "Ask what the next role needs, and what's missing today." },
      { week: 2, text: "Agree 2-3 goals and a date to review them, in writing." },
      { week: 3, text: "Start on the first goal and mention progress in your 1:1s." },
    ],
    script: { label: "Message to your manager", text: "Hi [Name], I'd like to talk about my growth here. Could we take 30 minutes to discuss what the next level looks like for me, what I'd need to show, and a realistic timeline? I want to be sure I'm working on the right things." },
  },
  {
    id: "pay", area: "career", title: "Prepare a pay conversation", time: "2 hours to prepare",
    why: "Pay that doesn't match your effort or your costs is a real stressor - and a conversation backed by facts is far more likely to work.",
    steps: [
      { week: 1, text: "Collect salary data for your role, city and experience from 2-3 sources." },
      { week: 1, text: "List your results from the last year - with numbers wherever possible." },
      { week: 2, text: "Ask for a meeting before the appraisal cycle closes, not after." },
      { week: 3, text: "Make your ask with a number and a reason. If it's \"not now\", ask what would make it \"yes\", and when." },
    ],
    script: { label: "Opening your pay conversation", text: "I'd like to discuss my compensation. Over the last year I've [2-3 results]. From what I can see, similar roles in [city] pay around [range]. I'd like to ask for a revision to [number]. What would it take to get there, and by when?" },
  },
  {
    id: "skills", area: "career", title: "Start a 30-day skill sprint", time: "3 hours a week",
    why: "Learning something that moves your career forward is one of the fastest ways to feel less stuck - and it makes you safer in a layoff.",
    steps: [
      { week: 1, text: "Pick one skill that keeps appearing in job posts for your next role." },
      { week: 1, text: "Block 3 hours a week for it in your calendar." },
      { week: 2, text: "Use it on one real task at work, however small." },
      { week: 3, text: "Add it to your CV and tell your manager what you've learned." },
    ],
  },
  {
    id: "wins", area: "career", title: "Keep a wins log", time: "5 min a week",
    why: "When effort goes unnoticed, people stop noticing it themselves. A weekly log fixes both - and makes appraisals much easier.",
    steps: [
      { week: 1, text: "Every Friday, write down 3 things you finished, fixed or helped with." },
      { week: 2, text: "Add numbers where you can: time saved, money, customers, quality." },
      { week: 3, text: "Share one win in your next 1:1 or team update." },
    ],
  },
];

export const actionById = (id: string): Action | undefined => ACTIONS.find((a) => a.id === id);

/** For each stress point, the actions that address it, best first. */
export const SOURCE_ACTIONS: Record<string, string[]> = {
  tasks: ["priorities", "deadline"], deadlines: ["deadline", "priorities"], overtime: ["boundary", "recovery"],
  balance: ["boundary", "flex"], outside: ["flex", "boundary"], control: ["flex", "clarity"],
  excluded: ["speakup", "clarity"], expectations: ["clarity", "priorities"], communication: ["clarity", "change"],
  roleconflict: ["clarity", "priorities"], exhaustion: ["recovery", "boundary"],
  fearleader: ["record", "escalate"], gaslighting: ["record", "visible"], gossip: ["gossip", "allies"],
  cliques: ["gossip", "allies"], credit: ["visible", "record"], discrimination: ["rights", "record"],
  harassment: ["rights", "record"], hostileteam: ["escalate", "record"],
  politics: ["allies", "speakup"], bullying: ["record", "escalate"], psychsafety: ["speakup", "allies"],
  peers: ["allies"], fit: ["values"], orgchange: ["change", "values"], relations: ["allies", "gossip"],
  layoffs: ["safetynet", "skills"], suddenloss: ["safetynet"], promotion: ["growth", "skills"],
  skills: ["skills", "growth"], costofliving: ["pay", "safetynet"], payeffort: ["pay", "wins"], recognition: ["wins", "visible"],
};
/** When an area has no clear stress point: a habit that keeps it healthy. */
const AREA_DEFAULT: Record<AreaKey, string> = { workload: "recovery", toxicity: "allies", culture: "allies", career: "wins" };

/** Stress points answered "Sometimes" or more, strongest first (ties: the more stressed area). */
export function rankedPoints(s: StressScores, answers: Record<string, number>) {
  return BANK.items
    .map((i, n) => ({ item: i, value: valueOf(answers[i.id]) ?? 0, n }))
    .filter((x) => x.value >= 50)
    .sort((a, b) => b.value - a.value || s.areas[b.item.area] - s.areas[a.item.area] || a.n - b.n);
}

/** The drivers that are actually pushing stress up (intensity 50+), strongest first. */
export const activeDrivers = (s: StressScores) => s.drivers.filter((d) => d.score >= 50);

/** The actions that best address one area: its strongest drivers' actions first. */
export function actionsForArea(area: AreaKey, s: StressScores, answers: Record<string, number>): string[] {
  const out: string[] = [];
  for (const d of activeDrivers(s)) {
    const def = driverByKey(d.key);
    if (def?.area === area) for (const id of def.actions) if (!out.includes(id)) out.push(id);
  }
  for (const p of rankedPoints(s, answers).filter((x) => x.item.area === area)) {
    for (const id of SOURCE_ACTIONS[p.item.source] ?? []) if (!out.includes(id)) out.push(id);
  }
  for (const a of ACTIONS) if (a.area === area && !out.includes(a.id)) out.push(a.id);
  return out;
}

/** The 30-day plan: support first when needed, the rights card when relevant,
 *  then 3 actions aimed at the strongest drivers (at most 2 per area). */
export function planActionsFor(s: StressScores, answers: Record<string, number>): string[] {
  const out: string[] = [];
  if (s.support !== "none") out.push("talk");
  if (s.rights.harassment || s.rights.discrimination) out.push("rights");
  const focus: string[] = [];
  const perArea: Partial<Record<string, number>> = {};
  const take = (id: string) => {
    const a = actionById(id);
    if (!a || out.includes(id) || focus.includes(id) || (perArea[a.area] ?? 0) >= 2) return false;
    focus.push(id);
    perArea[a.area] = (perArea[a.area] ?? 0) + 1;
    return true;
  };
  for (const d of activeDrivers(s)) {
    if (focus.length >= 3) break;
    for (const id of driverByKey(d.key)?.actions ?? []) if (take(id)) break;
  }
  for (const p of rankedPoints(s, answers)) {
    if (focus.length >= 3) break;
    for (const id of SOURCE_ACTIONS[p.item.source] ?? []) if (take(id)) break;
  }
  for (const area of [...AREAS].sort((a, b) => s.areas[b] - s.areas[a])) {
    if (focus.length >= 3) break;
    take(AREA_DEFAULT[area]);
  }
  return [...out, ...focus];
}

const lower = (t: string) => t.charAt(0).toLowerCase() + t.slice(1);

const and = (xs: string[], sep = " and ") => (xs.length < 2 ? xs.join("") : `${xs.slice(0, -1).join(", ")}${sep}${xs[xs.length - 1]}`);

/** One plain sentence: where the stress is coming from - the top 3 predicted
 *  drivers, each group followed by its own area. */
export function summaryLine(s: StressScores): string {
  const groups = new Map<AreaKey, string[]>();
  for (const d of activeDrivers(s).slice(0, 3)) {
    const def = driverByKey(d.key);
    if (def) groups.set(def.area, [...(groups.get(def.area) ?? []), lower(def.label)]);
  }
  const top = [...AREAS].filter((a) => s.areas[a] >= 25).sort((a, b) => s.areas[b] - s.areas[a]).slice(0, 2);
  if (!groups.size && !top.length) return "Nothing stands out as a strong source of stress at work right now.";
  if (!groups.size) return `Mild pressure, mostly from ${top.map((a) => areaOf(a).title).join(" and ")}.`;
  const parts = [...groups].map(([a, labels]) => `${and(labels)} (${AREA_META[a].label})`);
  const multi = [...groups.values()].some((l) => l.length > 1);
  return `Your stress is coming mainly from ${and(parts, multi ? ", and " : " and ")}.`;
}

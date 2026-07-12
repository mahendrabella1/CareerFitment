// Reference knowledge for the in-depth career report: the eight career DOMAINS
// (broad fields, not exact roles), a per-category deep-dive generator, and a
// stage-aware "next 20 years" roadmap. Content is illustrative guidance — salary
// figures are typical ranges, not guarantees.
import type { AssessmentSummary } from "@/lib/auth/AuthProvider";

const IMG = (id: string, w = 900) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=72`;

export type Domain = {
  key: string;
  name: string;
  tagline: string;
  image: string;
  whatItIs: string;
  roles: string[];
  skills: string[];
  howToJoin: string[];
  salaryIndia: string;
  salaryAbroad: string;
  futureScope: string;
  links: { label: string; url: string }[];
};

const COMMON = (specific: { label: string; url: string }): { label: string; url: string }[] => [
  specific,
  { label: "Explore courses — Coursera", url: "https://www.coursera.org" },
  { label: "Live jobs — LinkedIn", url: "https://www.linkedin.com/jobs" },
  { label: "National Career Service (India)", url: "https://www.ncs.gov.in" },
];

export const DOMAINS: Record<string, Domain> = {
  A: {
    key: "A", name: "Engineering & Construction",
    tagline: "Designing and building the physical world.",
    image: IMG("photo-1503387762-592deb58ef4e"),
    whatItIs: "Turning ideas into real structures, machines, infrastructure and energy systems — from bridges and factories to renewable power and smart cities.",
    roles: ["Civil / Structural Engineer", "Construction & Project Manager", "Mechanical / Industrial Engineer", "Renewable-Energy Engineer", "Supply-Chain / Logistics Manager"],
    skills: ["Applied maths & physics", "CAD / design tools", "Structured problem-solving", "Project & site management", "Safety and standards"],
    howToJoin: ["Take Science (PCM) in classes 11–12", "B.E./B.Tech via JEE — or a diploma with lateral entry", "Specialise (civil, mechanical, etc.) and intern on real projects", "Add certifications: PMP, AutoCAD, LEED (green building)"],
    salaryIndia: "₹3.5–7 LPA entry · ₹10–22 LPA mid · ₹30 LPA+ as lead / project manager",
    salaryAbroad: "$60k–85k entry · $95k–140k mid (US / EU / Gulf)",
    futureScope: "Infrastructure, clean-energy transition and smart-construction keep demand steady. Green + digital-construction skills earn a clear premium.",
    links: COMMON({ label: "Free engineering courses — NPTEL", url: "https://nptel.ac.in" }),
  },
  B: {
    key: "B", name: "Information Technology",
    tagline: "Building the digital world.",
    image: IMG("photo-1461749280684-dccba630e2f6"),
    whatItIs: "Creating the software, data, cloud, security and AI systems that power modern life — one of the fastest-growing and most remote-friendly fields.",
    roles: ["Software Developer", "Data Scientist / Analyst", "Cybersecurity Analyst", "Cloud / DevOps Engineer", "UI/UX Designer"],
    skills: ["Programming (Python / JS)", "Logic & data structures", "One deep specialisation", "Debugging & systems thinking", "Never-stop learning"],
    howToJoin: ["Get comfortable with logic and one language", "B.Tech / BCA / BSc CS — or self-taught with a portfolio", "Build real projects and contribute on GitHub", "Certify in cloud (AWS/Azure), data or security"],
    salaryIndia: "₹4–9 LPA entry · ₹15–35 LPA mid · ₹50 LPA+ senior / lead",
    salaryAbroad: "$75k–110k entry · $130k–200k mid (US) · €50k–90k (EU)",
    futureScope: "AI, data and cloud are reshaping every industry — the highest-paid, most flexible and globally portable of all the domains.",
    links: COMMON({ label: "Developer roadmaps — roadmap.sh", url: "https://roadmap.sh" }),
  },
  C: {
    key: "C", name: "Health Science",
    tagline: "Caring for human health and wellbeing.",
    image: IMG("photo-1576091160550-2173dba999ef"),
    whatItIs: "Diagnosis, treatment, therapy, research and public health — deeply meaningful work with durable, worldwide demand.",
    roles: ["Doctor / Dentist", "Nurse", "Physiotherapist / Allied Health", "Pharmacist / Biotech Researcher", "Psychologist / Counsellor"],
    skills: ["Biology & chemistry", "Empathy & communication", "Precision and care", "Resilience under pressure", "Ethics"],
    howToJoin: ["Science (PCB) in classes 11–12", "NEET → MBBS / BDS / BSc Nursing / Allied Health", "Clinical rotations and internships", "Specialise via PG, or add allied-health certifications"],
    salaryIndia: "₹3–6 LPA (allied / nursing) · ₹8–20 LPA (doctors post-PG) · ₹30 LPA+ specialists",
    salaryAbroad: "$60k–90k (nursing / allied) · $200k+ (licensed physicians, US)",
    futureScope: "Ageing populations, mental-health awareness and biotech guarantee stable, respected and rising demand.",
    links: COMMON({ label: "NEET (official)", url: "https://neet.nta.nic.in" }),
  },
  D: {
    key: "D", name: "Arts, Media & Design",
    tagline: "Shaping how the world looks and feels.",
    image: IMG("photo-1513364776144-60967b0f800f"),
    whatItIs: "Design, media, storytelling and creative technology — turning ideas into experiences people love, across products, brands and screens.",
    roles: ["Graphic / UX Designer", "Film & Video Producer", "Animator", "Fashion Designer", "Journalist / Content Creator"],
    skills: ["Creativity & taste", "Craft & tools", "Visual storytelling", "A strong portfolio", "Collaboration"],
    howToJoin: ["Start building a portfolio early", "Design / media degree or bootcamp — or self-taught", "Freelance & intern to build a real body of work", "Specialise (UX, motion, film, fashion)"],
    salaryIndia: "₹3–6 LPA entry · ₹8–18 LPA mid · ₹25 LPA+ senior (UX / product especially)",
    salaryAbroad: "$50k–75k entry · $90k–140k mid (UX / product design, US / EU)",
    futureScope: "Digital products, content and brand experience keep creative + tech-savvy talent in high, well-paid demand.",
    links: COMMON({ label: "Design portfolios — Behance", url: "https://www.behance.net" }),
  },
  E: {
    key: "E", name: "Business & Marketing",
    tagline: "Making organisations work and grow.",
    image: IMG("photo-1552664730-d307ca884978"),
    whatItIs: "Strategy, marketing, sales, finance and entrepreneurship — broad, flexible paths with a very high ceiling for ambitious, people-smart individuals.",
    roles: ["Management Consultant", "Digital Marketer", "Sales / Business Development", "Financial Analyst", "Entrepreneur / Founder"],
    skills: ["Communication & persuasion", "Analytical & commercial thinking", "People and negotiation", "Initiative and ownership", "Data literacy"],
    howToJoin: ["Any degree + strong internships", "BBA / B.Com → MBA (CAT/GMAT) optional but valued", "Certify in digital marketing or finance", "Build a network and measurable wins"],
    salaryIndia: "₹3.5–7 LPA entry · ₹12–30 LPA mid · ₹40 LPA+ (consulting / leadership)",
    salaryAbroad: "$60k–90k entry · $110k–180k mid (US / EU)",
    futureScope: "Every company needs growth, data-driven marketing and sound finance — one of the most versatile, opportunity-rich domains.",
    links: COMMON({ label: "MBA & business — mba.com", url: "https://www.mba.com" }),
  },
  F: {
    key: "F", name: "Human & Public Services",
    tagline: "Serving people and society.",
    image: IMG("photo-1541339907198-e08756dedf3f"),
    whatItIs: "Education, law, social work, policy and public safety — high-impact roles that shape communities and lives.",
    roles: ["Teacher / Educator", "Social Worker / Counsellor", "Policy Analyst", "Lawyer", "Police / Public-Safety Officer"],
    skills: ["Communication", "Empathy & integrity", "Patience", "Subject mastery", "Judgement"],
    howToJoin: ["Relevant degree (B.Ed, LLB, social work, public admin)", "Qualifying exams (CTET / UGC-NET, CLAT, UPSC / state)", "Field practice and internships", "Specialise (a law area, subject, or policy domain)"],
    salaryIndia: "₹3–6 LPA entry · ₹7–15 LPA mid · higher in law & civil services with seniority",
    salaryAbroad: "$45k–70k entry · $80k–130k mid (varies by field & country)",
    futureScope: "Stable, respected and meaningful; ed-tech and legal-tech are adding modern, better-paid pathways.",
    links: COMMON({ label: "UPSC / civil services", url: "https://www.upsc.gov.in" }),
  },
  G: {
    key: "G", name: "Science, Nature & Agriculture",
    tagline: "Understanding and improving the natural world.",
    image: IMG("photo-1532094349884-543bc11b234d"),
    whatItIs: "Research, environment, agriculture and emerging science / robotics — the frontier of climate, food security, biotech and AI-for-science.",
    roles: ["Research Scientist", "Agricultural Scientist", "Environmental Engineer", "Biotechnologist", "Robotics / AI Researcher"],
    skills: ["Curiosity & rigor", "Maths & analysis", "Lab / field methods", "Patience and persistence", "Communication of findings"],
    howToJoin: ["Science stream with strong fundamentals", "BSc / BTech → MSc / PhD for research", "Lab and field internships; publish or present", "Specialise (biotech, environment, agri-tech, robotics)"],
    salaryIndia: "₹3–6 LPA entry · ₹8–18 LPA mid · ₹25 LPA+ (industry R&D, agri-tech)",
    salaryAbroad: "$55k–80k entry · $95k–150k mid (R&D, US / EU)",
    futureScope: "Climate, food and biotech are fast-growing, well-funded fields — deep impact and rising industry demand.",
    links: COMMON({ label: "Nature Careers", url: "https://www.nature.com/naturecareers" }),
  },
  H: {
    key: "H", name: "Sports, Hospitality & Lifestyle",
    tagline: "Creating experiences and wellbeing.",
    image: IMG("photo-1414235077428-338989a2e8c0"),
    whatItIs: "Hospitality, events, travel, sports, fitness and culinary arts — the booming experience-and-wellness economy.",
    roles: ["Hotel / Events Manager", "Sports Coach / Trainer", "Travel Consultant", "Sports Scientist / Physio", "Chef / Culinary Professional"],
    skills: ["People & service mindset", "Energy and stamina", "Coordination & planning", "Creativity", "Calm under pressure"],
    howToJoin: ["Hospitality / sports / culinary degree or diploma", "Hands-on training in hotels, academies or kitchens", "Certify (fitness, event management, sommelier)", "Build a network and a reputation"],
    salaryIndia: "₹2.5–5 LPA entry · ₹6–14 LPA mid · ₹20 LPA+ (management, top chefs / coaches)",
    salaryAbroad: "$40k–65k entry · $75k–120k mid (hospitality mgmt, sports science)",
    futureScope: "The experience economy, wellness and sports are booming globally — strong scope for travel and for building your own venture.",
    links: COMMON({ label: "Hospitality & lifestyle courses — edX", url: "https://www.edx.org" }),
  },
};

/* ------------------------- per-category deep-dive ---------------------- */
export type DeepDive = {
  meaning: string;
  strengths: string[];
  grow: string[];
  recommend: string[];
  next: string;
};

const band = (p: number) => (p >= 65 ? "high" : p >= 40 ? "mid" : "low");
const pick = <T,>(arr: T[], n: number) => arr.slice(0, n);

export function categoryDeepDive(key: string, a: AssessmentSummary): DeepDive {
  const r = a.radar?.find((x) => x.key === key);
  const p = r?.score ?? 0;
  const lvl = band(p);
  switch (key) {
    case "personality": {
      const t = temperamentOf(a);
      const dual = t.scores[1].score > 45;
      return {
        meaning: `Your natural temperament is ${t.primary.name} — ${t.primary.tagline.toLowerCase()}${dual ? `, with a ${t.secondary.name} side` : ""}. ${t.primary.strength} This is the "operating system" behind how you engage with people, handle pressure, make decisions and recharge.`,
        strengths: [t.primary.strength, `As a${/^[AEIOU]/.test(t.primary.name) ? "n" : ""} ${t.primary.name}, you bring ${t.primary.traits.slice(0, 2).join(" and ").toLowerCase()} energy to a team`, "Knowing your temperament helps you pick environments that fit you"],
        grow: [t.primary.watch, `Borrow from your ${t.secondary.name} side when a situation needs it`, "Notice which situations drain vs. energise you, and plan around them"],
        recommend: ["Choose roles and teams that fit your natural style rather than fighting it", "Pair up with people whose strengths cover your blind spots", "Keep a simple journal of what energises and what exhausts you for a month"],
        next: "Shortlist 2–3 work environments that match your temperament and talk to someone already in them.",
      };
    }
    case "career_interest": {
      const top = a.themes?.[0];
      return {
        meaning: top
          ? `Your interests lean most strongly toward ${top.title} (${top.meaning}). Interest is the single biggest driver of long-term satisfaction — this is where to look first.`
          : "Your interests are spread fairly evenly, which means you have room to explore several fields before committing.",
        strengths: top ? [`A clear pull toward ${top.title}`, "Interest-aligned work sustains motivation for years", "You can speak to what genuinely excites you"] : ["Flexibility to try multiple directions", "You're not boxed into one narrow field"],
        grow: (a.themes?.length ?? 0) > 1 ? ["You have more than one strong interest — test them hands-on before narrowing"] : ["Explore adjacent fields so your choice is informed, not default"],
        recommend: ["Do a short internship, project or job-shadow in your top interest area", "Follow 3 professionals in that field and study their journeys", "Try one small real project this month to test the interest"],
        next: "Book one conversation with someone working in your top interest cluster.",
      };
    }
    case "multiple_intelligence": {
      const top = a.topIntelligences?.[0]?.name || "your leading intelligence";
      const second = a.topIntelligences?.[1]?.name;
      return {
        meaning: `Across Gardner's eight intelligences, ${top}${second ? ` and ${second}` : ""} are most pronounced — the ways you most naturally take in and work with the world.`,
        strengths: pick([`${top} is a genuine strength to build a career around`, second ? `${second} gives you a strong secondary lever` : "", "Tasks that use these will feel easier and more rewarding"].filter(Boolean), 3),
        grow: ["Your lower intelligences aren't weaknesses — just less-default. Build a minimum working level in the ones your goal needs", "Deliberately practise one non-dominant intelligence for range"],
        recommend: [`Seek work and projects that lean on ${top}`, "Learn using your strongest intelligence (e.g. visual, hands-on, verbal)", "Team up with people strong where you're not"],
        next: `Pick one upcoming task and redesign how you do it to play to ${top}.`,
      };
    }
    case "emotional_intelligence": {
      const ei = a.ei ?? p;
      return {
        meaning: `Your emotional intelligence reads at ${ei}% — how well you notice situations, manage your own reactions and respond to others. It's one of the strongest predictors of teamwork, leadership and wellbeing.`,
        strengths: band(ei) !== "low" ? ["You read people and situations reasonably well", "You can stay composed and adapt your response", "A real asset for teamwork and leadership"] : ["Awareness that this is a growth area is itself a strong start"],
        grow: band(ei) === "high" ? ["Keep stretching into high-stakes, emotionally charged situations to lead others through them"] : ["Practise the pause: name what you feel before you react", "Ask for feedback on how you come across under pressure"],
        recommend: ["Practise active listening — reflect back what you hear before replying", "Keep a 2-line note after tense moments: trigger → better response", "Read one practical book on emotional intelligence"],
        next: "In your next disagreement, pause and name the other person's feeling before responding.",
      };
    }
    case "learning_styles": {
      const top = a.learningStyles?.[0]?.name || "a mixed";
      return {
        meaning: `You learn best through a ${top} approach. Matching how you study and work to this style makes new material noticeably faster to absorb and retain.`,
        strengths: [`A clear, usable ${top} learning preference`, "You can design study and work around what actually sticks", "Faster upskilling when you use the right method"],
        grow: ["Build some flexibility in other modes — not every course or job will match your style", "Combine two modes (e.g. visual + doing) for tougher material"],
        recommend: [`Convert notes into your ${top} format (diagrams, recordings, summaries or practice)`, "Teach a concept to someone else to lock it in", "Space your revision instead of cramming"],
        next: `Re-do your current study/work notes in a ${top} format this week.`,
      };
    }
    case "motivators": {
      const top = a.topValues?.[0]?.tag || "a balance of drivers";
      return {
        meaning: `What drives you most is ${top}. Roles and environments that feed this keep you engaged for years; ones that starve it quietly burn people out — even if the pay is good.`,
        strengths: [`A clear core motivator (${top}) to steer decisions by`, "You can filter jobs by what actually sustains you", "Less likely to be lured by the wrong role"],
        grow: ["Notice when short-term rewards pull you away from your real driver", "Check that your current path actually feeds this motivator"],
        recommend: [`Rank job offers and projects by how well they serve ${top}`, "Have an honest talk with a mentor about what motivates you", "Avoid environments that clash with your core driver, even for more money"],
        next: `List your top 3 options and score each on how well it feeds ${top}.`,
      };
    }
    case "strengths": {
      const topB = a.strengthsBreakdown?.slice().sort((x, y) => y.score - x.score)[0]?.name;
      return {
        meaning: `On the quick reasoning and self-report tasks you scored ${p}% overall${topB ? `, strongest in ${topB}` : ""}. This is a coarse, directional read of your problem-solving, decisions and communication — combine a few sittings for a steadier picture.`,
        strengths: topB ? [`${topB} came through as a clear strength`, "You bring a usable mix of thinking and people skills", "Strengths compound when you build a career around them"] : ["A workable spread of reasoning and self-report strengths"],
        grow: lvl === "low" ? ["Some areas scored low on a short test — practice and a calm retake will lift these", "Target the specific sub-skill (logic, decisions, communication) that was weakest"] : ["Push your strongest area from good to excellent — that's where careers are made"],
        recommend: ["Do short daily reasoning / critical-thinking practice", "Volunteer for tasks that stretch your weaker sub-skill", "Ask for feedback on your decisions and communication"],
        next: "Pick your single weakest sub-skill and do 10 minutes of practice daily for two weeks.",
      };
    }
    case "aptitude": {
      const top = a.topAptitudes?.[0]?.skill;
      const apt = a.aptitudePct ?? p;
      return {
        meaning: `Your aptitude across words, numbers, logic and shapes came out at ${apt}%${top ? `, sharpest in ${top}` : ""}. Aptitude shows how quickly you can pick up the skills a field demands — a strong signal for study and career fit.`,
        strengths: top ? [`${top} reasoning is a clear strength`, "You can learn skills in aligned fields faster", "A good base for exams and technical roles"] : ["A workable all-round reasoning base"],
        grow: lvl === "low" ? ["Aptitude grows with practice — this is trainable, not fixed", "Target the specific area (verbal / numerical / logical / spatial) that lagged"] : ["Sharpen your top area toward competitive-exam level if your goal needs it"],
        recommend: ["Practise timed reasoning sets 2–3× a week", `Lean into fields that reward ${top || "your strongest reasoning"}`, "Use official mock tests to track progress"],
        next: "Take one timed aptitude mock this week and note your weakest section to target.",
      };
    }
    default:
      return { meaning: `This area scored ${p}%.`, strengths: [], grow: [], recommend: [], next: "" };
  }
}

/* ------------------------- next-20-years roadmap ----------------------- */
export type Phase = { period: string; title: string; points: string[] };

export function roadmap(stageLabel: string, domainName: string): Phase[] {
  return [
    {
      period: "Now → 2 years",
      title: "Explore & build foundations",
      points: [
        `Confirm your fit for ${domainName} with a real project, internship or job-shadow`,
        "Build the core skills and get the qualifications your path needs",
        "Find one mentor and a peer group in the field",
      ],
    },
    {
      period: "2 → 5 years",
      title: "Enter & specialise",
      points: [
        `Land your first role in ${domainName} and pick a specialisation`,
        "Ship visible work — a portfolio, results or a track record",
        "Add one or two respected certifications",
      ],
    },
    {
      period: "5 → 10 years",
      title: "Grow into expertise & leadership",
      points: [
        "Become a go-to specialist or step into leading people/projects",
        "Widen your network and consider a bigger platform (or going abroad)",
        "Keep learning as your field's tools and demands evolve",
      ],
    },
    {
      period: "10 → 20 years",
      title: "Lead, mentor or build",
      points: [
        "Move into senior leadership, deep expertise, or your own venture",
        "Mentor the next generation and shape direction, not just tasks",
        "Design work around the life and impact you want — you'll have the leverage to",
      ],
    },
  ];
}

/* ------------------------- archetype (Career DNA) ---------------------- */
export type Archetype = { name: string; tagline: string };

const ARCH: Record<string, Archetype> = {
  R: { name: "The Hands-On Builder", tagline: "You learn by doing and love turning ideas into something real and working." },
  I: { name: "The Analytical Investigator", tagline: "You’re driven to understand how things work — logic leads, curiosity never stops." },
  A: { name: "The Creative Originator", tagline: "You see what could be, and bring new ideas, designs and stories to life." },
  S: { name: "The People Champion", tagline: "You’re at your best helping, teaching and bringing people together." },
  E: { name: "The Driven Leader", tagline: "You spot opportunities, take initiative and move people toward a goal." },
  C: { name: "The Systematic Organiser", tagline: "You bring order, accuracy and reliability to everything you take on." },
};

/** A memorable identity for the Career DNA page — from the top interest theme,
 *  with a robust fallback to the strongest dimension. */
export function archetype(a: AssessmentSummary): Archetype {
  const top = (a.themes ?? []).slice().sort((x, y) => y.score - x.score)[0];
  if (top && ARCH[top.letter]) return ARCH[top.letter];
  const rd = (a.radar ?? []).slice().sort((x, y) => y.score - x.score)[0]?.key ?? "";
  const map: Record<string, string> = {
    multiple_intelligence: "I", aptitude: "I", career_interest: "I",
    strengths: "E", motivators: "E", personality: "C",
    emotional_intelligence: "S", learning_styles: "A",
  };
  return ARCH[map[rd] ?? "I"];
}

/** Rough, monotonic "higher than X% of students" read from a 0–100 score. */
export const percentileOf = (score: number) => Math.max(5, Math.min(97, Math.round(score * 0.95)));

/** Per-dimension sub-trait bars, drawn from whatever breakdown data exists. */
export function subTraits(key: string, a: AssessmentSummary): { label: string; value: number }[] {
  const clean = (arr: { label: string; value: number }[]) =>
    arr.filter((x) => x.label && x.value > 0).slice(0, 8);
  switch (key) {
    case "career_interest": return clean((a.themes ?? []).map((t) => ({ label: t.title, value: t.score })));
    case "multiple_intelligence": return clean((a.topIntelligences ?? []).map((x) => ({ label: x.name, value: x.score })));
    case "learning_styles": return clean((a.learningStyles ?? []).map((x) => ({ label: x.name, value: x.score })));
    case "motivators": return clean((a.topValues ?? []).map((x) => ({ label: x.tag, value: x.score })));
    case "strengths": return clean((a.strengthsBreakdown ?? []).map((x) => ({ label: x.name, value: x.score })));
    case "aptitude": return clean((a.topAptitudes ?? []).map((x) => ({ label: x.skill, value: x.score })));
    case "personality": return clean((a.topStrengths ?? []).map((x) => ({ label: x.subTraitName, value: x.normalizedScore })));
    default: return [];
  }
}

/* ------------------------- action plan (30 / 90 days) ------------------ */
export function actionPlan(a: AssessmentSummary, domainName: string): { days30: string[]; days90: string[] } {
  const strength = a.topIntelligences?.[0]?.name || a.strengthsBreakdown?.[0]?.name || "your strongest skill";
  const dom = domainName.toLowerCase();
  return {
    days30: [
      `Start one small project in ${dom} to test the fit first-hand.`,
      `Try a free intro course that builds on ${strength.toLowerCase()}.`,
      "Each week, explain one thing you learned to a friend or family member.",
    ],
    days90: [
      "Finish and share your first project publicly.",
      "Join a club, community or group active in this field.",
      `Shortlist three next steps — streams, courses or mentors — toward ${domainName}.`,
    ],
  };
}

/* ------------------------- four temperaments --------------------------- */
export type Temperament = { key: string; name: string; tagline: string; traits: string[]; strength: string; watch: string; emoji: string };

export const TEMPERAMENTS: Record<string, Temperament> = {
  sanguine: { key: "sanguine", name: "Sanguine", tagline: "Enthusiastic, social & optimistic", traits: ["Outgoing", "Expressive", "Warm", "Spontaneous"], strength: "You energise people and thrive on connection, variety and new experiences.", watch: "Can lose focus on long, detailed or repetitive tasks.", emoji: "☀", },
  choleric: { key: "choleric", name: "Choleric", tagline: "Driven, decisive & goal-focused", traits: ["Ambitious", "Confident", "Direct", "Natural leader"], strength: "You take charge, set clear goals and get things done fast.", watch: "Can be impatient with slower people or processes.", emoji: "🔥", },
  melancholic: { key: "melancholic", name: "Melancholic", tagline: "Analytical, deep & detail-oriented", traits: ["Thoughtful", "Precise", "Loyal", "Reflective"], strength: "You think deeply, plan carefully and hold yourself to high standards.", watch: "Can over-analyse, or be too hard on yourself.", emoji: "🌙", },
  phlegmatic: { key: "phlegmatic", name: "Phlegmatic", tagline: "Calm, steady & easy-going", traits: ["Patient", "Reliable", "Diplomatic", "Consistent"], strength: "You stay calm under pressure and keep teams balanced and grounded.", watch: "Can avoid conflict, or resist change longer than needed.", emoji: "🍃", },
};

/** Read Big-Five sub-trait scores from the saved data, matching by name. */
function bigFive(a: AssessmentSummary) {
  const find = (needle: string) => (a.topStrengths ?? []).find((x) => x.subTraitName?.toLowerCase().includes(needle))?.normalizedScore;
  const O = find("open"), C = find("consc"), E = find("extra"), A = find("agree");
  let S = find("stab"); const neuro = find("neuro"); if (S == null && neuro != null) S = 100 - neuro;
  const v = (x?: number) => (x == null ? 50 : x);
  return { O: v(O), C: v(C), E: v(E), A: v(A), S: v(S), has: [O, C, E, A].some((x) => x != null) };
}

export function temperamentScores(a: AssessmentSummary): { key: string; score: number }[] {
  const { O, C, E, A, S } = bigFive(a);
  const raw = {
    sanguine: E * 0.6 + A * 0.25 + O * 0.15,
    choleric: E * 0.5 + C * 0.3 + (100 - A) * 0.2,
    melancholic: (100 - E) * 0.4 + C * 0.35 + O * 0.25,
    phlegmatic: (100 - E) * 0.35 + A * 0.4 + S * 0.25,
  };
  return Object.entries(raw).map(([key, score]) => ({ key, score: Math.round(score) })).sort((x, y) => y.score - x.score);
}

export function temperamentOf(a: AssessmentSummary): { primary: Temperament; secondary: Temperament; scores: { key: string; score: number }[] } {
  const scores = temperamentScores(a);
  return { primary: TEMPERAMENTS[scores[0].key], secondary: TEMPERAMENTS[scores[1].key], scores };
}

/* ------------------------- clear per-dimension result ------------------ */
const eiBand = (p: number) => (p >= 75 ? "High EQ" : p >= 55 ? "Solid EQ" : p >= 40 ? "Developing EQ" : "Emerging EQ");

/** A short, unambiguous "here is your result" for each dimension. */
export function resultOf(key: string, a: AssessmentSummary): { label: string; value: string } | null {
  const two = (arr?: { n: string }[]) => (arr ?? []).slice(0, 2).map((x) => x.n).join(" · ");
  switch (key) {
    case "personality": { const t = temperamentOf(a); return { label: "Your temperament", value: `${t.primary.name}${t.secondary && t.scores[1].score > 45 ? " · " + t.secondary.name : ""}` }; }
    case "career_interest": { const code = a.riasecCode || (a.themes ?? []).slice(0, 3).map((t) => t.letter).join(""); return code ? { label: "Your Holland code", value: code } : null; }
    case "multiple_intelligence": return { label: "Top intelligences", value: two((a.topIntelligences ?? []).map((x) => ({ n: x.name }))) };
    case "emotional_intelligence": return { label: "EQ level", value: eiBand(a.ei ?? 0) };
    case "learning_styles": { const t = a.learningStyles?.[0]?.name; return t ? { label: "Your learning style", value: t } : null; }
    case "motivators": { const t = a.topValues?.[0]?.tag; return t ? { label: "Your core driver", value: t } : null; }
    case "strengths": return { label: "Signature strengths", value: two((a.strengthsBreakdown ?? []).map((x) => ({ n: x.name }))) };
    case "aptitude": { const t = a.topAptitudes?.[0]?.skill; return t ? { label: "Sharpest reasoning", value: t } : null; }
    default: return null;
  }
}

/* ------------------------- concrete career fits (all parameters) ------- */
export type RoleFit = { role: string; domain: string; fit: number; why: string; salaryIndia: string; salaryAbroad: string };

/** Specific job roles the whole profile points to — drawn from the best-fit
 *  domains, but justified with the student's own intelligences/values. */
export function careerRoles(a: AssessmentSummary): RoleFit[] {
  const doms = (a.themes ?? [])
    .filter((t) => t.score > 0 && DOMAINS[t.letter])
    .slice(0, 3)
    .map((t) => ({ d: DOMAINS[t.letter], fit: Math.round(t.score) }));
  const list = doms.length ? doms : [{ d: DOMAINS.B, fit: a.overallFitmentPct ?? 70 }];
  const intel = a.topIntelligences?.[0]?.name;
  const apt = a.topAptitudes?.[0]?.skill;
  const val = a.topValues?.[0]?.tag;
  const whyFor = (role: string, i: number) => {
    const bits = [intel && `your ${intel.toLowerCase()} intelligence`, apt && `strong ${apt.toLowerCase()} reasoning`, val && `a drive for ${String(val).toLowerCase()}`].filter(Boolean);
    return bits.length ? `Fits ${bits[i % bits.length]}.` : "Aligns with your overall profile.";
  };
  const out: RoleFit[] = [];
  list.forEach(({ d, fit }, di) => {
    d.roles.slice(0, 2).forEach((role, ri) => {
      out.push({ role, domain: d.name, fit: Math.max(40, Math.min(97, fit - ri * 4 - di * 2)), why: whyFor(role, ri + di), salaryIndia: d.salaryIndia, salaryAbroad: d.salaryAbroad });
    });
  });
  return out.slice(0, 6);
}

/* ------------------------- future outlook ------------------------------ */
export const FUTURE = {
  rising: [
    { t: "AI & Machine Learning", d: "Reshaping every field — the biggest skill multiplier of the decade." },
    { t: "Green & Climate Tech", d: "Renewable energy, EVs and sustainability engineering are booming." },
    { t: "Data & Cybersecurity", d: "As everything goes digital, protecting and reading data is critical." },
    { t: "Healthcare & Biotech", d: "Ageing populations and genomics keep demand rising worldwide." },
    { t: "Robotics & Automation", d: "Designing the machines and systems that automate physical work." },
    { t: "Creative × Tech", d: "UX, product, content and design — human taste plus technology." },
  ],
  declining: [
    "Routine data entry & manual bookkeeping",
    "Basic, scripted telemarketing & call handling",
    "Repetitive assembly-line and manual sorting work",
    "Simple form-processing and clerical filing",
    "Generic content writing without real expertise",
  ],
  note: "Jobs that combine human judgement with technology are the safest. Focus on skills you can keep building — they outlast any single job title.",
};

/* ------------------------- learn & opportunities ----------------------- */
export const LEARNING: { label: string; url: string; note: string }[] = [
  { label: "NPTEL", url: "https://nptel.ac.in", note: "Free courses from the IITs (India)" },
  { label: "Coursera", url: "https://www.coursera.org", note: "University courses, many free to audit" },
  { label: "edX", url: "https://www.edx.org", note: "Courses from MIT, Harvard & more" },
  { label: "freeCodeCamp", url: "https://www.freecodecamp.org", note: "Free, hands-on coding" },
  { label: "Khan Academy", url: "https://www.khanacademy.org", note: "Strong for maths & science basics" },
  { label: "YouTube", url: "https://www.youtube.com", note: "Free channels for almost any skill" },
];

export const JOB_PORTALS: { region: string; sites: { label: string; url: string }[] }[] = [
  { region: "India", sites: [
    { label: "LinkedIn Jobs", url: "https://www.linkedin.com/jobs" },
    { label: "Naukri", url: "https://www.naukri.com" },
    { label: "Indeed India", url: "https://in.indeed.com" },
    { label: "Internshala (internships)", url: "https://internshala.com" },
    { label: "Wellfound (startups)", url: "https://wellfound.com" },
  ] },
  { region: "Abroad", sites: [
    { label: "LinkedIn", url: "https://www.linkedin.com/jobs" },
    { label: "Indeed", url: "https://www.indeed.com" },
    { label: "Glassdoor", url: "https://www.glassdoor.com" },
    { label: "We Work Remotely", url: "https://weworkremotely.com" },
  ] },
];

export const SCHOLARSHIPS_2026: { name: string; who: string; url: string }[] = [
  { name: "National Scholarship Portal (NSP)", who: "Indian students — the single window for central & state scholarships", url: "https://scholarships.gov.in" },
  { name: "INSPIRE (SHE) Scholarship", who: "Top science students pursuing BSc / BS — ₹80,000/year", url: "https://online-inspire.gov.in" },
  { name: "Reliance Foundation Scholarships", who: "UG & PG students, strong support for STEM", url: "https://www.reliancefoundation.org" },
  { name: "Tata Trusts / Tata Scholarships", who: "Merit-cum-means across fields", url: "https://www.tatatrusts.org" },
  { name: "Fulbright-Nehru Fellowships", who: "Postgraduate study & research in the USA", url: "https://www.usief.org.in" },
  { name: "Chevening Scholarships", who: "Fully-funded Master's in the UK", url: "https://www.chevening.org" },
  { name: "DAAD Scholarships", who: "Study in Germany — strong for engineering & science", url: "https://www.daad.de" },
];

/* ------------------------- academic path ------------------------------- */
const DOMAIN_ACADEMICS: Record<string, { stream: string; subjects: string[]; exams: string[] }> = {
  A: { stream: "Science (PCM)", subjects: ["Physics", "Chemistry", "Maths"], exams: ["JEE Main / Advanced", "BITSAT", "State CETs"] },
  B: { stream: "Science (PCM) or Computer Science", subjects: ["Maths", "Computer Science", "Physics"], exams: ["JEE", "CUET", "BCA / BSc-CS entrances"] },
  C: { stream: "Science (PCB)", subjects: ["Biology", "Chemistry", "Physics"], exams: ["NEET", "AIIMS / allied-health", "State medical"] },
  D: { stream: "Any stream + a design portfolio", subjects: ["Fine Arts", "English", "any core subjects"], exams: ["NID DAT", "NIFT", "UCEED / CEED"] },
  E: { stream: "Commerce (or any)", subjects: ["Accountancy", "Economics", "Business Studies", "Maths"], exams: ["CUET", "IPMAT", "CA / CS Foundation"] },
  F: { stream: "Humanities / Arts (or any)", subjects: ["Political Science", "History", "English", "Sociology"], exams: ["CLAT (law)", "CTET (teaching)", "UPSC / State (civil services)"] },
  G: { stream: "Science (PCM / PCB)", subjects: ["Biology or Physics", "Chemistry", "Maths"], exams: ["IISER / NEST", "JEE (for tech)", "ICAR (agriculture)"] },
  H: { stream: "Any stream + skill training", subjects: ["Physical Education", "any core subjects"], exams: ["NCHMCT JEE (hotel mgmt)", "Sports / fitness certifications"] },
};

export type AcademicPath = { stream: string; subjects: string[]; exams: string[]; skills: string[]; note: string; isSchool: boolean };

export function academicPath(a: AssessmentSummary, journeyCode: string): AcademicPath {
  const topLetter = (a.themes ?? []).filter((t) => t.score > 0 && DOMAINS[t.letter])[0]?.letter ?? "B";
  const d = DOMAIN_ACADEMICS[topLetter] ?? DOMAIN_ACADEMICS.B;
  const dom = DOMAINS[topLetter] ?? DOMAINS.B;
  const isSchool = ["6-8", "9-10"].includes(journeyCode);
  const note = journeyCode === "11-12"
    ? "You’re already in senior school — lock your subjects and start focused exam prep now."
    : ["6-8", "9-10"].includes(journeyCode)
      ? "You’ll choose your stream in Class 11 — this is the direction to aim for."
      : "Here’s the academic route this direction typically follows.";
  return { stream: d.stream, subjects: d.subjects, exams: d.exams, skills: dom.skills, note, isSchool };
}

/* ------------------------- work-environment fit ------------------------ */
export function workEnvironment(a: AssessmentSummary): { fit: string; blurb: string; tags: string[] } {
  const t = temperamentOf(a).primary;
  const val = a.topValues?.[0]?.tag;
  const map: Record<string, { fit: string; tags: string[] }> = {
    choleric: { fit: "Fast-paced, goal-driven teams", tags: ["Ownership", "Ambitious teams", "Room to lead"] },
    sanguine: { fit: "Collaborative, people-facing environments", tags: ["Teamwork", "Variety", "Client-facing"] },
    melancholic: { fit: "Focused, deep-work environments", tags: ["Deep work", "Autonomy", "Craft & quality"] },
    phlegmatic: { fit: "Stable, supportive organisations", tags: ["Stability", "Clear structure", "Steady growth"] },
  };
  const base = map[t.key] ?? map.melancholic;
  const blurb = `As a ${t.name.toLowerCase()} personality${val ? ` who values ${String(val).toLowerCase()}` : ""}, you’ll do your best work in ${base.fit.toLowerCase()}. Look for that when choosing colleges, teams and first jobs — the environment matters as much as the role.`;
  return { fit: base.fit, blurb, tags: base.tags };
}

/* ------------------------- role models --------------------------------- */
export const ROLE_MODELS: Record<string, { name: string; note: string }[]> = {
  A: [{ name: "E. Sreedharan", note: "The “Metro Man” — engineering that moved a nation" }, { name: "Sundar Pichai", note: "Engineer → CEO of Google" }],
  B: [{ name: "Nandan Nilekani", note: "Co-founded Infosys; architect of Aadhaar" }, { name: "Sundar Pichai", note: "Computer science → Google CEO" }],
  C: [{ name: "Dr. Devi Shetty", note: "Cardiac surgeon who made heart care affordable" }, { name: "Dr. Soumya Swaminathan", note: "Paediatrician → WHO Chief Scientist" }],
  D: [{ name: "Prasoon Joshi", note: "Lyricist & adman — ideas into feeling" }, { name: "Ilaiyaraaja", note: "Self-taught composer, global influence" }],
  E: [{ name: "Falguni Nayar", note: "Founder of Nykaa — built a brand from scratch" }, { name: "Nithin Kamath", note: "Founder of Zerodha" }],
  F: [{ name: "Dr. A.P.J. Abdul Kalam", note: "Scientist, teacher & President" }, { name: "Kiran Bedi", note: "Reforming public service" }],
  G: [{ name: "Dr. M.S. Swaminathan", note: "Father of India’s Green Revolution" }, { name: "Tessy Thomas", note: "“Missile Woman” of India" }],
  H: [{ name: "Vikas Khanna", note: "Chef who took Indian food global" }, { name: "P.T. Usha", note: "Athlete → mentor & administrator" }],
};

export const PARENT_TIPS: string[] = [
  "Ask open questions (“what did you enjoy most?”) instead of pushing one career.",
  "Back exploration — a short project or workshop teaches more than advice ever will.",
  "Fit and genuine interest predict long-term success better than a “safe” label.",
  "Revisit this report together every 6–12 months — your child is still growing.",
];

export function stageLabelOf(journeyCode: string): string {
  const m: Record<string, string> = {
    "6-8": "school (classes 6–8)", "9-10": "school (classes 9–10)", "11-12": "senior school (11–12)",
    grad: "graduate", early: "early professional", prof: "experienced professional",
  };
  return m[journeyCode] || "your stage";
}

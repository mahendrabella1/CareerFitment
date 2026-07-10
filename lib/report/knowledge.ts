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
      const temp = a.outcomeLabel || "balanced temperament";
      const trait = a.topStrengths?.[0]?.subTraitName || "steadiness";
      return {
        meaning: `Your responses map to a ${temp}, with ${trait} standing out. This shapes how you engage with people, handle pressure, make decisions and recharge — the "operating system" behind your day-to-day choices.`,
        strengths: [`${trait} gives you a dependable edge in the right environment`, "You know your natural default under pressure", "Self-awareness here makes teams and mentors trust you"],
        grow: lvl === "high"
          ? ["Watch for over-relying on your dominant trait — flex the opposite when a situation demands it"]
          : ["Your temperament signals were mixed — a steadier read comes from re-testing calmly", "Notice which situations drain vs. energise you and plan around them"],
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

export function stageLabelOf(journeyCode: string): string {
  const m: Record<string, string> = {
    "6-8": "school (classes 6–8)", "9-10": "school (classes 9–10)", "11-12": "senior school (11–12)",
    grad: "graduate", early: "early professional", prof: "experienced professional",
  };
  return m[journeyCode] || "your stage";
}

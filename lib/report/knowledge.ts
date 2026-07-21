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

// Each domain gets its own links — no shared filler, so consecutive career
// cards in the report never repeat the same resources.

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
    links: [
      { label: "Free engineering courses — NPTEL", url: "https://nptel.ac.in" },
      { label: "JEE Main (official) — NTA", url: "https://jeemain.nta.nic.in" },
      { label: "Free CAD tools — Autodesk Education", url: "https://www.autodesk.com/education" },
    ],
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
    links: [
      { label: "Developer roadmaps — roadmap.sh", url: "https://roadmap.sh" },
      { label: "Free coding certificates — freeCodeCamp", url: "https://www.freecodecamp.org" },
      { label: "Harvard CS50 (free)", url: "https://cs50.harvard.edu/x/" },
    ],
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
    links: [
      { label: "NEET (official) — NTA", url: "https://neet.nta.nic.in" },
      { label: "National Medical Commission", url: "https://www.nmc.org.in" },
      { label: "Free health & medicine lessons — Khan Academy", url: "https://www.khanacademy.org/science/health-and-medicine" },
    ],
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
    links: [
      { label: "Design portfolios — Behance", url: "https://www.behance.net" },
      { label: "Free design courses — Canva Design School", url: "https://www.canva.com/designschool/" },
      { label: "NID admissions (official)", url: "https://admissions.nid.edu" },
    ],
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
    links: [
      { label: "MBA & business — mba.com", url: "https://www.mba.com" },
      { label: "Free marketing certifications — HubSpot Academy", url: "https://academy.hubspot.com" },
      { label: "Free business simulations — Forage", url: "https://www.theforage.com/simulations" },
    ],
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
    links: [
      { label: "UPSC / civil services", url: "https://www.upsc.gov.in" },
      { label: "CLAT (official) — Consortium of NLUs", url: "https://consortiumofnlus.ac.in" },
      { label: "CTET — teaching eligibility", url: "https://ctet.nic.in" },
    ],
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
    links: [
      { label: "Nature Careers", url: "https://www.nature.com/naturecareers" },
      { label: "ICAR — agriculture entrance & research", url: "https://icar.org.in" },
      { label: "Join real research — Zooniverse", url: "https://www.zooniverse.org" },
    ],
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
    links: [
      { label: "Hospitality & lifestyle courses — edX", url: "https://www.edx.org" },
      { label: "NCHM JEE — hotel management (official)", url: "https://nchmjee.nta.nic.in" },
      { label: "Sports Authority of India", url: "https://sportsauthorityofindia.nic.in" },
    ],
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

const keyOfDomain = (domainName: string): string =>
  Object.values(DOMAINS).find((d) => d.name === domainName)?.key ?? "B";

/** Domain-specific 20-year roadmaps — each domain has its own milestones, so
 *  no two sections of the report (or two domains) read the same. */
const ROADMAPS: Record<string, Phase[]> = {
  A: [
    { period: "Now → 2 years", title: "Foundations in maths & making", points: ["Get strong in physics and maths — they are the entry ticket to every engineering branch", "Build something physical: a model bridge, a robot kit, an Arduino circuit", "Visit a construction site, factory or metro project to see engineers at work"] },
    { period: "2 → 5 years", title: "B.Tech / diploma & first site experience", points: ["Clear JEE / CET into a core branch (civil, mechanical, electrical)", "Learn AutoCAD and one analysis tool well before final year", "Do vacation training with a contractor, PSU or manufacturing plant"] },
    { period: "5 → 10 years", title: "Site engineer → project lead", points: ["Take charge of small sites or production lines early — responsibility compounds", "Add PMP or a green-building (LEED/IGBC) credential", "Consider M.Tech or an infrastructure MBA if you aim at design or management"] },
    { period: "10 → 20 years", title: "Chief engineer, PMC or your own firm", points: ["Lead large projects or move into project-management consultancy", "Renewables, metro-rail and smart-city work will pay the premium", "Many senior engineers start their own contracting or design practice here"] },
  ],
  B: [
    { period: "Now → 2 years", title: "Learn to code properly", points: ["Pick one language (Python or JavaScript) and get past the basics into real programs", "Publish 2–3 small projects on GitHub — a game, a website, a data script", "Complete one structured course end-to-end (CS50 or freeCodeCamp)"] },
    { period: "2 → 5 years", title: "Degree + portfolio + first job", points: ["B.Tech/BCA/BSc-CS — but let your portfolio, not marks alone, speak", "Do at least two internships; contribute to one open-source project", "Choose a first specialisation: web, data, cloud, security or mobile"] },
    { period: "5 → 10 years", title: "Senior engineer or specialist", points: ["Go deep in one area (AI/ML, cloud architecture, security) — depth is what pays", "Mentor juniors and lead a small team or module", "Certify where it counts: AWS/Azure architect, CISSP, or an ML specialisation"] },
    { period: "10 → 20 years", title: "Architect, leader or founder", points: ["Choose the track: principal engineer, engineering manager, or your own product", "Remote and global roles are normal in IT — your market is the world", "Keep one day a week for learning; the stack will change twice more"] },
  ],
  C: [
    { period: "Now → 2 years", title: "Biology first, NEET in sight", points: ["Master biology and chemistry fundamentals — NCERT deeply, not just coaching notes", "Volunteer or shadow at a clinic, hospital or pharmacy to test the reality", "Decide early between MBBS, dentistry, nursing, pharmacy and allied health"] },
    { period: "2 → 5 years", title: "Medical / allied education", points: ["Clear NEET (or allied-health entrances) and commit to the long course", "Treat internships and clinical rotations as the real classroom", "Build patient-communication skills — they matter as much as marks"] },
    { period: "5 → 10 years", title: "PG specialisation & licensure", points: ["Choose a speciality via NEET-PG (or MSc/certifications for allied paths)", "Consider rural or public-health service — it builds range and reputation", "Research or teaching tracks open here if hospitals aren't your fit"] },
    { period: "10 → 20 years", title: "Consultant, researcher or founder", points: ["Senior consultant or department head in your speciality", "Health-tech, telemedicine and hospital management are growing side doors", "Many clinicians open their own practice or diagnostics centre in this window"] },
  ],
  D: [
    { period: "Now → 2 years", title: "Make things, keep everything", points: ["Create weekly — posters, reels, sketches, UI mock-ups — and save it all", "Learn one tool deeply (Figma, Photoshop or Premiere) instead of five shallowly", "Start a public portfolio on Behance or Instagram; feedback is fuel"] },
    { period: "2 → 5 years", title: "Formal craft & first clients", points: ["B.Des / mass-comm / fine-arts — or a portfolio-first self-taught route", "Freelance small: logos, edits, college fests — real briefs teach fastest", "Intern at a studio, agency or production house at least once"] },
    { period: "5 → 10 years", title: "Specialist with a name", points: ["Pick a lane — UX, motion, film editing, fashion, brand — and get known for it", "Raise your rates as your portfolio compounds; keep shipping personal work", "UX and product design pay the most consistently if income matters"] },
    { period: "10 → 20 years", title: "Creative director or studio owner", points: ["Lead creative teams, or run your own studio/channel with a client base", "License, teach or productise your work for income beyond hours", "Your taste and network are the moat now — invest in both"] },
  ],
  E: [
    { period: "Now → 2 years", title: "Sell something, run something", points: ["Run a small venture — a stall, a reselling page, an event — and track the numbers", "Learn Excel/Sheets properly; money fluency starts there", "Follow real businesses: read one annual report or founder story a month"] },
    { period: "2 → 5 years", title: "Degree + internships that count", points: ["BBA/B.Com (or any degree) + internships in sales, marketing or finance", "Get one measurable win you can talk about: grew X, sold Y, saved Z", "Certify in digital marketing or financial modelling — cheap, high-signal"] },
    { period: "5 → 10 years", title: "Manager with a P&L", points: ["Move from executing to owning targets — a territory, a brand, a budget", "An MBA (CAT/GMAT) is optional but accelerates consulting and leadership tracks", "Build your network deliberately; deals and roles both travel through people"] },
    { period: "10 → 20 years", title: "Leadership or your own company", points: ["Head of sales/marketing, consulting partner, or founder — the paths fork here", "Equity and profit-share start mattering more than salary", "Mentor younger operators; the best deal-flow comes from people you helped"] },
  ],
  F: [
    { period: "Now → 2 years", title: "Read widely, serve locally", points: ["Debate, MUN, school leadership and volunteering build the core muscles", "Read the newspaper daily — current affairs is the raw material of this field", "Shadow a teacher, lawyer or local official to see the work up close"] },
    { period: "2 → 5 years", title: "Degree + qualifying exams", points: ["BA/B.Ed/LLB depending on the track — law needs CLAT, teaching needs B.Ed", "Intern with courts, NGOs, schools or government offices", "Start UPSC/state-services prep only after understanding the commitment"] },
    { period: "5 → 10 years", title: "Establish in your service", points: ["Clear the qualifying exam (CTET, judiciary, UPSC) or build your practice/classroom", "Specialise: a subject, a branch of law, a policy area", "Reputation compounds slowly here — consistency beats brilliance"] },
    { period: "10 → 20 years", title: "Senior service & public impact", points: ["Principal, senior advocate/judge, or senior administrative roles", "Policy, ed-tech and legal-tech offer modern, higher-paid branches", "Your work now shapes institutions — mentor the next generation in"] },
  ],
  G: [
    { period: "Now → 2 years", title: "Be a scientist already", points: ["Do real experiments at home or school; document them like a researcher", "Join a citizen-science project (bird counts, star maps, soil tests)", "Strengthen maths — it is the language of every science"] },
    { period: "2 → 5 years", title: "BSc/BTech & first lab", points: ["IISER/NISER/ICAR or a strong BSc — research needs the right environment", "Get into a lab early; wash the glassware if that's what it takes", "Present at one student conference or science fair"] },
    { period: "5 → 10 years", title: "MSc/PhD & publications", points: ["Pick the problem you can stay curious about for a decade", "Publish, present, collaborate — your papers are your portfolio", "Industry R&D (biotech, agri-tech, climate) pays well if academia isn't the fit"] },
    { period: "10 → 20 years", title: "Principal scientist or founder", points: ["Lead a lab, a field station or an R&D team", "Climate, food-security and biotech funding keep growing — ride it", "Deep-tech startups founded by scientists are India's next wave"] },
  ],
  H: [
    { period: "Now → 2 years", title: "Train, host, cook, compete", points: ["Play a sport seriously or cook/host regularly — this field rewards doing", "Volunteer at school events, tournaments or family functions as an organiser", "Basic fitness and people skills are your first certifications"] },
    { period: "2 → 5 years", title: "Professional training", points: ["Hotel management (NCHM JEE), culinary school, or sports-science degree", "Industrial training in a hotel, academy or kitchen — reputation starts there", "Add certifications: fitness training, event management, food safety"] },
    { period: "5 → 10 years", title: "Build your name in service", points: ["Move up: sous chef, duty manager, head coach, senior physio", "International postings (cruise, Gulf, hotel chains) accelerate pay here", "Start building a personal brand — this industry runs on reputation"] },
    { period: "10 → 20 years", title: "Run the show", points: ["GM of a property, own restaurant/academy, or head of sports science", "The experience economy keeps growing — wellness and travel especially", "Your network of guests, clients and athletes becomes your business"] },
  ],
};

export function roadmap(stageLabel: string, domainName: string): Phase[] {
  return ROADMAPS[keyOfDomain(domainName)] ?? ROADMAPS.B;
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

/* ------------------ real free programs, per domain --------------------- */
export type Opportunity = { label: string; url: string; note: string };

/** Three real, free programs per domain — the same programs listed on the
 *  OneGrasp dashboard, so the report and the dashboard recommend one truth. */
export const OPPORTUNITIES: Record<string, Opportunity[]> = {
  A: [
    { label: "Tinkercad (Autodesk)", url: "https://www.tinkercad.com", note: "Free 3D design & circuits — build your first model this week" },
    { label: "NPTEL intro engineering courses", url: "https://nptel.ac.in", note: "Free IIT courses with certificates" },
    { label: "GE Aerospace job simulation (Forage)", url: "https://www.theforage.com/simulations", note: "Free virtual work experience, ~4 hrs" },
  ],
  B: [
    { label: "freeCodeCamp — Responsive Web Design", url: "https://www.freecodecamp.org/learn/", note: "Free certification; start with one lesson a day" },
    { label: "Harvard CS50x", url: "https://cs50.harvard.edu/x/", note: "The world's most popular intro to computer science, free" },
    { label: "JPMorgan Software Engineering simulation (Forage)", url: "https://www.theforage.com/simulations", note: "Free virtual internship with certificate, ~5 hrs" },
  ],
  C: [
    { label: "Khan Academy — Health & Medicine", url: "https://www.khanacademy.org/science/health-and-medicine", note: "Free foundation for biology & medicine" },
    { label: "Stanford AIMI — AI in medicine", url: "https://aimi.stanford.edu", note: "Free resources at the frontier of health + AI" },
    { label: "Foldit — protein-folding research game", url: "https://fold.it", note: "Contribute to real biochemistry research" },
  ],
  D: [
    { label: "Canva Design School", url: "https://www.canva.com/designschool/", note: "Free courses; make one poster a week" },
    { label: "Figma for Education", url: "https://www.figma.com/education/", note: "Free pro tools for students — learn UI design" },
    { label: "Behance", url: "https://www.behance.net", note: "Start your public portfolio today" },
  ],
  E: [
    { label: "BCG Strategy simulation (Forage)", url: "https://www.theforage.com/simulations", note: "Free consulting work experience, ~6 hrs" },
    { label: "HubSpot Academy", url: "https://academy.hubspot.com", note: "Free marketing & sales certifications" },
    { label: "Diamond Challenge", url: "https://diamondchallenge.org", note: "Global entrepreneurship competition for high-schoolers" },
  ],
  F: [
    { label: "Queen's Commonwealth Essay Competition", url: "https://www.royalcwsociety.org", note: "The world's oldest schools writing contest, free entry" },
    { label: "MyGov quizzes & contests", url: "https://quiz.mygov.in", note: "Free civic & current-affairs challenges" },
    { label: "OpenLearn — law & society courses", url: "https://www.open.edu/openlearn/", note: "Free Open University short courses" },
  ],
  G: [
    { label: "Zooniverse", url: "https://www.zooniverse.org", note: "Contribute to real research projects today" },
    { label: "GLOBE Program", url: "https://www.globe.gov", note: "NASA-backed student earth-science research" },
    { label: "iNaturalist", url: "https://www.inaturalist.org", note: "Document biodiversity like a field biologist" },
  ],
  H: [
    { label: "lululemon marketing simulation (Forage)", url: "https://www.theforage.com/simulations", note: "Free brand & retail work experience" },
    { label: "edX hospitality & lifestyle courses", url: "https://www.edx.org", note: "Free to audit university courses" },
    { label: "Khan Academy — Personal Finance", url: "https://www.khanacademy.org/college-careers-more/personal-finance", note: "Money skills every venture needs" },
  ],
};

export const opportunitiesFor = (domainName: string): Opportunity[] =>
  OPPORTUNITIES[keyOfDomain(domainName)] ?? OPPORTUNITIES.B;

/* ------------------------- action plan (30 / 90 days) ------------------ */
/** Domain-specific 30/90-day plans. Deliberately different wording from the
 *  roadmap and deep-dives so the report never repeats itself. */
const PLANS: Record<string, { days30: string[]; days90: string[] }> = {
  A: {
    days30: ["Build one physical thing — a cardboard bridge, an Arduino blink circuit, a 3D model in Tinkercad.", "Watch how one everyday machine works (lift, mixer, bike gears) and sketch its parts.", "Check the maths topics your dream branch needs and patch the weakest one."],
    days90: ["Finish a project you can hold or demo, and photograph the build steps.", "Attend a science exhibition, metro site tour or maker fair.", "Talk to one working engineer about what their week actually looks like."],
  },
  B: {
    days30: ["Write your first 100 lines of code — Python or JavaScript, any editor.", "Finish the first module of freeCodeCamp or CS50.", "Automate one tiny thing you do often (a calculation, a to-do list)."],
    days90: ["Ship one small app or website and put the code on GitHub.", "Complete a free job simulation (Forage) to see a tech workplace.", "Join one coding community or school club and ask one question a week."],
  },
  C: {
    days30: ["Master one NCERT biology chapter beyond the syllabus — diagrams and all.", "Interview someone who works in healthcare about their daily routine.", "Start a health-science notebook: one condition, cause and treatment a week."],
    days90: ["Volunteer or observe at a clinic, pharmacy or health camp.", "Finish one free anatomy/physiology course module online.", "Map the NEET (or allied-health) route: subjects, cutoffs, timelines."],
  },
  D: {
    days30: ["Create five finished pieces — posters, edits, sketches — not perfect, finished.", "Recreate one design you admire to learn its tricks.", "Set up a portfolio page on Behance and post your first piece."],
    days90: ["Take one real brief — a poster for a school event, an edit for a friend.", "Learn the basics of one professional tool (Figma, Photoshop or Premiere).", "Get feedback from one working designer or creator on your portfolio."],
  },
  E: {
    days30: ["Track your pocket money like a CFO for a month — every rupee, in a sheet.", "Pick one brand you love and write down how it makes money.", "Sell something small — old books, snacks at an event — and note what worked."],
    days90: ["Run a mini-venture with a profit target and report the numbers.", "Finish one free business or marketing certification (HubSpot / Forage).", "Present your venture results to family like a board meeting."],
  },
  F: {
    days30: ["Read the newspaper 15 minutes daily and summarise one story a week.", "Join or start a debate on a real policy issue at school.", "Write one short essay on a problem in your community and a fix."],
    days90: ["Volunteer with a local NGO, library or civic drive.", "Enter one essay or public-speaking competition.", "Interview a teacher, lawyer or official about how they chose the path."],
  },
  G: {
    days30: ["Run one real experiment at home and record it like a lab notebook.", "Join a citizen-science project and log your first observations.", "Pick one scientist's story and trace how they got there."],
    days90: ["Complete a mini research project with a question, method and result.", "Present your findings at school or at a science fair.", "Visit a lab, botanical garden, observatory or research farm."],
  },
  H: {
    days30: ["Commit to a daily training or practice block — sport, cooking or fitness.", "Plan and host one small event end-to-end for friends or family.", "Study one great hotel, restaurant or academy and list what makes it work."],
    days90: ["Take charge of organising a school event, tournament or food stall.", "Finish one free course in fitness, food safety or event management.", "Shadow a chef, coach or hotel manager for a day."],
  },
};

export function actionPlan(a: AssessmentSummary, domainName: string): { days30: string[]; days90: string[] } {
  return PLANS[keyOfDomain(domainName)] ?? PLANS.B;
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
  const intel2 = a.topIntelligences?.[1]?.name;
  const apt = a.topAptitudes?.[0]?.skill;
  const val = a.topValues?.[0]?.tag;
  const ls = a.learningStyles?.[0]?.name;
  const themeTitle = a.themes?.[0]?.title;
  const bits = [
    intel && `your ${intel.toLowerCase()} intelligence`,
    apt && `strong ${apt.toLowerCase()} reasoning`,
    val && `a drive for ${String(val).toLowerCase()}`,
    themeTitle && `your ${themeTitle.toLowerCase()} interests`,
    ls && `a ${ls.toLowerCase()} learning style`,
    intel2 && `your ${intel2.toLowerCase()} side`,
  ].filter(Boolean) as string[];
  const whyFor = (i: number) => (bits.length ? `Fits ${bits[i % bits.length]}.` : "Aligns with your overall profile.");
  const out: RoleFit[] = [];
  let w = 0;
  list.forEach(({ d, fit }, di) => {
    d.roles.slice(0, 2).forEach((role, ri) => {
      out.push({
        role, domain: d.name,
        fit: Math.max(40, Math.min(97, fit - ri * 4 - di * 2)),
        why: whyFor(w++),
        // salary is a domain-level range — print it once per domain, not on every role
        salaryIndia: ri === 0 ? d.salaryIndia : "",
        salaryAbroad: ri === 0 ? d.salaryAbroad : "",
      });
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

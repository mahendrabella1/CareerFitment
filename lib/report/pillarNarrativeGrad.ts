/**
 * Report text for the 8 pillars of the Graduates (UG) assessment, written for
 * a student reading it alone: plain names for every sub-area, a full sentence
 * for every strength or growth point (never a bare "Resilience: 83%"), and a
 * plain explanation of what each score means. Every sentence is chosen from
 * the student's own results. The display text is built here, from the stored
 * scores, so older saved reports get the same wording.
 */
import type { CustomDimension } from "@/lib/auth/AuthProvider";
import type { PillarScoreGrad, PsychometricProfileGrad, UgPillarKey } from "@/lib/newAssessment/scoringGrad";

const ICON: Record<UgPillarKey, string> = {
  ug_personality_behaviour: "personality",
  ug_interests_motivation: "career_interest",
  ug_cognitive_capability: "aptitude",
  ug_academic_domain_fit: "cap",
  ug_human_professional_skills: "heart",
  ug_digital_future_skills: "cpu",
  ug_career_readiness: "briefcase",
  ug_future_adaptability: "compass",
};

const MEANING: Record<UgPillarKey, string> = {
  ug_personality_behaviour: "How you naturally work, decide and react to change. There are no right or wrong answers here - this is simply your style.",
  ug_interests_motivation: "The kind of work you enjoy, what keeps you going, and the life you want your career to give you.",
  ug_cognitive_capability: "How well you solved reasoning questions with numbers, words, logic, patterns, charts and practical problems. Each question had one correct answer.",
  ug_academic_domain_fit: "How well you know your subject, how clearly you see the jobs your degree leads to, and whether you enjoy your specialisation.",
  ug_human_professional_skills: "How you would handle real situations at work: explaining ideas, handling feedback, working in a team, leading, finishing what you start and bouncing back.",
  ug_digital_future_skills: "How you learn new digital tools, use AI sensibly, check data before trusting it, and prepare for skills that will matter in future.",
  ug_career_readiness: "How ready you are for your first job: knowing what role you want, real experience, proof of your skills, and being able to show your value.",
  ug_future_adaptability: "How quickly you learn, how you handle change, and the kind of career, industry and location that suit you long term.",
};

/** What each score on the page means, in plain words. */
const SCORE_MEANING: Record<UgPillarKey, (p: PillarScoreGrad, l1: PsychometricProfileGrad) => string> = {
  ug_personality_behaviour: () => "This score shows how clear your preferences are. A lower score just means you adapt to the situation - it is not good or bad.",
  ug_interests_motivation: () => "This score shows how clearly your answers pointed to particular interests and motivations. It is not good or bad.",
  ug_cognitive_capability: (_p, l1) => `You answered ${l1.aptitude.correct} of ${l1.aptitude.total} reasoning questions correctly.`,
  ug_academic_domain_fit: () => "Based on how you rated your own knowledge of your subject and degree.",
  ug_human_professional_skills: () => "How often you chose the most effective way to handle each work situation.",
  ug_digital_future_skills: () => "How often you chose the most effective way to work with digital tools, AI and data.",
  ug_career_readiness: () => "Based on how you rated your own preparation for your first job.",
  ug_future_adaptability: () => "How often you chose the most effective way to learn and handle change.",
};

/** Plain names for every sub-area, shown instead of the internal labels. */
const PLAIN: Record<string, string> = {
  // Pillar 1
  "Personality": "Your natural style",
  "Work Behaviour": "How you work",
  "Decision Style": "How you decide",
  "Work Environment Preference": "Where you work best",
  // Pillar 2
  "RIASEC Interests": "Work you enjoy",
  "Motivators": "What drives you",
  "Values": "What you won't compromise",
  "Lifestyle Preferences": "The life you want",
  // Pillar 3
  "Aptitude": "Number & shape puzzles",
  "Numerical Reasoning": "Working with numbers",
  "Verbal Reasoning": "Reasoning with words",
  "Logical Reasoning": "Logic puzzles",
  "Abstract Reasoning": "Spotting patterns",
  "Analytical Reasoning": "Reading charts & data",
  "Problem Solving": "Solving practical problems",
  // Pillar 4
  "Subject Strength": "How you study best",
  "Domain Knowledge": "Understanding your subject",
  "Degree Knowledge": "Knowing where your degree leads",
  "Specialisation Fit": "Enjoying your specialisation",
  // Pillar 5
  "Communication": "Explaining ideas clearly",
  "Emotional Intelligence": "Handling feelings & feedback",
  "Teamwork": "Working in a team",
  "Leadership": "Taking the lead",
  "Execution": "Finishing what you start",
  "Resilience": "Bouncing back from setbacks",
  // Pillar 6
  "Digital Literacy": "Learning new digital tools",
  "AI Readiness": "Using AI sensibly",
  "Data Literacy": "Checking data before trusting it",
  "Technology Adoption": "Trying new technology",
  "Future Skills": "Preparing for future skills",
  // Pillar 7
  "Career Readiness": "Knowing the job you want",
  "Experience": "Real-world experience",
  "Skill Portfolio": "Proof of your skills",
  "Skill Gaps": "Knowing what to improve",
  "Professional Identity": "Showing your value",
  // Pillar 8
  "Learning Agility": "Learning new things",
  "Adaptability": "Handling change",
  "Sector Fit": "Industry that suits you",
  "Geographic Mobility": "Willingness to relocate",
  "Long-Term Adaptability": "Your long-term career style",
};
export const plainName = (sub: string) => PLAIN[sub] ?? sub;

/** One sentence when a sub-area is a strength, one when it needs work. */
const SAY: Record<string, { strong: string; grow: string }> = {
  "Aptitude": { strong: "You handle number and shape puzzles well.", grow: "Number and shape puzzles (like work-rate and rotation questions) were difficult for you." },
  "Numerical Reasoning": { strong: "You work confidently with percentages, averages and growth.", grow: "Questions with percentages, averages and growth tripped you up." },
  "Verbal Reasoning": { strong: "You read arguments carefully and spot what really follows.", grow: "Working out what an argument really proves was difficult for you." },
  "Logical Reasoning": { strong: "You solve logic puzzles - rankings, schedules, if-then rules - well.", grow: "Logic puzzles with several conditions were difficult for you." },
  "Abstract Reasoning": { strong: "You spot hidden patterns in series and shapes quickly.", grow: "Finding the rule in number series and shape patterns was difficult for you." },
  "Analytical Reasoning": { strong: "You read charts and tables accurately.", grow: "Reading charts and tables accurately is an area to practise." },
  "Problem Solving": { strong: "You solve practical problems with several limits at once.", grow: "Practical problems with several limits (time, budget) were difficult for you." },
  "Domain Knowledge": { strong: "You understand your subject well and can explain it to others.", grow: "You're not yet confident explaining your subject and how it's used outside class." },
  "Degree Knowledge": { strong: "You know the jobs your degree leads to and what employers expect.", grow: "You're not yet sure which jobs your degree leads to or what employers expect." },
  "Specialisation Fit": { strong: "You enjoy your specialisation and feel engaged by it.", grow: "Your specialisation doesn't fully match what you enjoy - worth exploring which parts do." },
  "Communication": { strong: "You explain ideas in a way others understand, using examples.", grow: "Explaining ideas so others understand them is an area to build." },
  "Emotional Intelligence": { strong: "You stay calm with criticism and disagreement, and notice how others feel.", grow: "Handling criticism and disagreement calmly is an area to build." },
  "Teamwork": { strong: "You work well in teams and deal with problems openly.", grow: "Working in teams - sharing ideas and raising problems early - is an area to build." },
  "Leadership": { strong: "You step up and organise the next steps when a group is stuck.", grow: "You tend to wait for others to lead; practise taking the first step." },
  "Execution": { strong: "You plan in steps and finish what you start.", grow: "Finishing long tasks without a last-minute rush is an area to build." },
  "Resilience": { strong: "You bounce back after setbacks and try a different approach.", grow: "Setbacks can stop you; practise reviewing what went wrong and trying again." },
  "Digital Literacy": { strong: "You pick up new digital tools on your own and check information is accurate.", grow: "Learning new digital tools properly is an area to build." },
  "AI Readiness": { strong: "You use AI tools sensibly - testing them and checking their answers.", grow: "Using AI tools confidently, and checking what they produce, is an area to build." },
  "Data Literacy": { strong: "You check where data comes from before trusting it.", grow: "Questioning data - where it came from, how it was analysed - is an area to build." },
  "Technology Adoption": { strong: "You try new technology early and learn it.", grow: "You tend to wait before trying new technology; try new tools earlier." },
  "Future Skills": { strong: "You actively prepare for skills the future will need.", grow: "You're not yet preparing for skills the future will need." },
  "Career Readiness": { strong: "You know clearly what job you want and what it requires.", grow: "You're not yet clear on the job you want or what it requires." },
  "Experience": { strong: "You already have real-world experience in your field.", grow: "You have little real-world experience yet - internships and projects will help." },
  "Skill Portfolio": { strong: "You can show proof of your skills through projects or work.", grow: "You can't yet show proof of your skills - start collecting work samples." },
  "Skill Gaps": { strong: "You know exactly which skills you need to improve.", grow: "You haven't yet compared your skills with what your target job needs." },
  "Professional Identity": { strong: "You can clearly explain the value you bring to an employer.", grow: "Explaining the value you bring to an employer is an area to build." },
  "Learning Agility": { strong: "You learn new things quickly and go deeper when needed.", grow: "Going deeper when you learn something new is an area to build." },
  "Adaptability": { strong: "You adjust well when plans or surroundings change.", grow: "Adjusting when plans change is an area to build." },
};

/** One practical next step per sub-area, used for the weakest ones. */
const STEP: Record<string, string> = {
  "Aptitude": "Practise number and shape puzzles (work-rate and rotation questions) a few times a week.",
  "Numerical Reasoning": "Practise percentage, ratio and average problems until you can solve them without a calculator.",
  "Verbal Reasoning": "Practise questions that ask what weakens or follows from an argument.",
  "Logical Reasoning": "Work through ranking and scheduling puzzles, drawing each condition before answering.",
  "Abstract Reasoning": "Practise series and pattern puzzles, and say the rule out loud before choosing an answer.",
  "Analytical Reasoning": "When you read a chart, separate what the data shows from what it proves.",
  "Problem Solving": "Before solving a problem, list every limit (time, money, order), then check each option against all of them.",
  "Domain Knowledge": "Each week, explain one key idea from your subject to a friend from another course.",
  "Degree Knowledge": "Look at real job adverts and list five jobs your degree leads to and the skills each asks for.",
  "Specialisation Fit": "Do a short project in the part of your subject you enjoy most, and notice what keeps you interested.",
  "Communication": "When explaining something, first ask what the listener already knows, then use one concrete example.",
  "Emotional Intelligence": "In a disagreement or when you get feedback, repeat the other person's point in your own words before replying.",
  "Teamwork": "In group work, agree who does what at the start, and raise problems with teammates early.",
  "Leadership": "The next time a group project stalls, suggest the next three steps yourself.",
  "Execution": "Break long tasks into weekly goals and track them somewhere you'll see daily.",
  "Resilience": "After a setback, write down what went wrong and one thing you'll change before trying again.",
  "Digital Literacy": "Learn one new tool properly this month - a tutorial plus a real task.",
  "AI Readiness": "Use an AI tool on real coursework, then check its answer against a reliable source.",
  "Data Literacy": "For every chart you read, ask where the data came from and what else could explain it.",
  "Technology Adoption": "Try new tools early and compare them with your current way on a real task.",
  "Future Skills": "Pick one new skill related to your field and spend an hour a week on it.",
  "Career Readiness": "Write one paragraph on the job you want and the qualifications it needs.",
  "Experience": "Apply for an internship, project, competition or volunteering role in your field this term.",
  "Skill Portfolio": "Collect your best work into a simple portfolio you could show an employer.",
  "Skill Gaps": "Compare your skills with three real job adverts for your target role and list what's missing.",
  "Professional Identity": "Write two lines on the value you bring, backed by one real example.",
  "Learning Agility": "When you learn something new, go one level deeper than you need for today.",
  "Adaptability": "When plans change, list related options that use the skills you already have.",
};

const RIASEC_PLAIN: Record<string, string> = {
  R: "Realistic - hands-on work with tools, machines or the outdoors",
  I: "Investigative - research, analysis and solving complex problems",
  A: "Artistic - creating, designing and expressing ideas",
  S: "Social - helping, teaching and supporting people",
  E: "Enterprising - leading, persuading and building things",
  C: "Conventional - organising, records and accuracy",
};

const BALANCED = "Balanced / no single preference";

/** Labels for preference questions that sit in the same sub-area as scored
 *  ones - "Explaining ideas clearly: handling questions" reads like a score,
 *  so the preference gets its own plain question-style label. */
const PREF_LABEL: Record<string, string> = {
  "Communication": "Your strength when presenting",
  "Leadership": "What you think a good leader does",
  "Experience": "Why you take on extra projects",
  "Specialisation Fit": "What you'd choose to study further",
  "Technology Adoption": "What makes you try new technology",
  "Future Skills": "The skill you think will matter most",
  "Learning Agility": "How you like to learn",
};

function prefsOf(p: PillarScoreGrad) {
  // Only preferences that actually point somewhere; "balanced" ones are
  // summarised once instead of repeated line after line.
  return p.subDimensions
    .filter((s) => s.result && s.result !== BALANCED)
    .map((s) => ({ label: PREF_LABEL[s.name] ?? plainName(s.name), value: s.result as string }));
}
function scoredOf(p: PillarScoreGrad) {
  return p.subDimensions
    .filter((s) => s.score !== null && s.answered > 0)
    .map((s) => ({ key: s.name, label: plainName(s.name), value: s.score as number }));
}

function textFor(p: PillarScoreGrad, l1: PsychometricProfileGrad): Pick<CustomDimension, "strengths" | "grow" | "recommend"> {
  const strengths: string[] = [];
  const grow: string[] = [];
  let order: { key: string; value: number }[] = [];

  switch (p.key) {
    case "ug_personality_behaviour": {
      strengths.push(l1.personality.summary);
      const prefs = prefsOf(p);
      prefs.forEach((x) => strengths.push(`${x.label}: ${x.value.toLowerCase()}.`));
      grow.push(p.score < 40
        ? "Your answers didn't lean strongly one way, which usually means you adapt to the situation. Notice which approach works best for you in practice."
        : "Clear preferences are useful. Practise the opposite style in situations that call for it.");
      break;
    }
    case "ug_interests_motivation": {
      const top = l1.riasec.slice(0, 2);
      top.forEach((r) => strengths.push(`You enjoy ${RIASEC_PLAIN[r.code].split(" - ")[1]}.`));
      const mot = l1.motivators.ranked.slice(0, 2).map((m) => m.tag.toLowerCase());
      if (mot.length) strengths.push(`What drives you most: ${mot.join(" and ")}.`);
      grow.push("Test your interests against real work: shadow, intern or talk to people in jobs that match them.");
      break;
    }
    case "ug_cognitive_capability": {
      const subs = l1.aptitude.subdomains.filter((s) => s.total);
      subs.filter((s) => s.score >= 67).forEach((s) => strengths.push(`${SAY[s.name]?.strong ?? plainName(s.name)} (${s.correct} of ${s.total} correct)`));
      subs.filter((s) => s.score < 50).forEach((s) => grow.push(`${SAY[s.name]?.grow ?? plainName(s.name)} (${s.correct} of ${s.total} correct)`));
      order = subs.map((s) => ({ key: s.name, value: s.score }));
      break;
    }
    default: {
      const scored = scoredOf(p);
      scored.filter((s) => s.value >= 67).sort((a, b) => b.value - a.value).forEach((s) => strengths.push(SAY[s.key]?.strong ?? `${s.label}.`));
      scored.filter((s) => s.value < 50).sort((a, b) => a.value - b.value).forEach((s) => grow.push(SAY[s.key]?.grow ?? `${s.label}.`));
      order = scored.map((s) => ({ key: s.key, value: s.value }));
    }
  }

  if (!strengths.length) strengths.push(p.score >= 50 ? "You have a solid base across this area." : "No single part stands out yet - a good area to build on step by step.");
  if (!grow.length) grow.push("No clear gaps here - keep using these strengths in projects and internships.");

  const recommend = order.slice().sort((a, b) => a.value - b.value).map((s) => STEP[s.key]).filter(Boolean).slice(0, 3);
  return { strengths: strengths.slice(0, 4), grow: grow.slice(0, 4), recommend };
}

function resultFor(p: PillarScoreGrad, l1: PsychometricProfileGrad): string {
  switch (p.key) {
    case "ug_personality_behaviour":
      return l1.personality.type;
    case "ug_interests_motivation":
      return l1.riasec.slice(0, 2).map((r) => RIASEC_PLAIN[r.code].split(" - ")[0]).join(" & ");
    case "ug_cognitive_capability":
      return `${l1.aptitude.correct} of ${l1.aptitude.total} correct`;
    default: {
      const scored = scoredOf(p).sort((a, b) => b.value - a.value);
      if (scored.length < 2 || scored[0].value === scored[scored.length - 1].value || scored[0].value === 0) return `${p.score}%`;
      return `Best at: ${scored[0].label}`;
    }
  }
}

function preferencesFor(p: PillarScoreGrad, l1: PsychometricProfileGrad) {
  if (p.key === "ug_interests_motivation") {
    return [
      ...l1.riasec.slice(0, 3).map((r, i) => ({ label: i === 0 ? "Top interest" : i === 1 ? "Second interest" : "Third interest", value: RIASEC_PLAIN[r.code] })),
      ...prefsOf(p).filter((x) => x.label !== plainName("RIASEC Interests")),
    ];
  }
  const prefs = prefsOf(p);
  const hadPrefs = p.subDimensions.some((s) => s.result);
  if (hadPrefs && !prefs.length) return [{ label: "Your style", value: "No strong preference - you adapt to the situation." }];
  return prefs;
}

export function pillarDimensionsGrad(l1: PsychometricProfileGrad): CustomDimension[] {
  return l1.pillars.map((p) => ({
    key: p.key,
    label: p.label,
    short: p.short,
    icon: ICON[p.key],
    score: p.score,
    scoreBasis: SCORE_MEANING[p.key](p, l1),
    result: resultFor(p, l1),
    meaning: MEANING[p.key],
    subs: p.key === "ug_cognitive_capability"
      ? l1.aptitude.subdomains.filter((s) => s.total).map((s) => ({ label: plainName(s.name), value: s.score }))
      : scoredOf(p).map(({ label, value }) => ({ label, value })),
    preferences: preferencesFor(p, l1),
    ...textFor(p, l1),
  }));
}

/**
 * Report text for the 8 pillars of the Graduates (UG) assessment. Every
 * sentence is built from the student's own pillar and sub-dimension results;
 * the fixed parts are plain descriptions of what each pillar measures and
 * practical next steps tied to a specific sub-dimension.
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
  ug_personality_behaviour: "How you naturally approach unfamiliar tasks, organise your work, make decisions and the kind of environment you work best in. These are preferences, not right or wrong answers.",
  ug_interests_motivation: "The kinds of work you enjoy (your RIASEC interest code), what motivates you to do your best, the values you won't compromise and the lifestyle you want your career to support.",
  ug_cognitive_capability: "Reasoning with numbers, words, logic, abstract patterns, figures and data, and solving multi-step problems. These questions have one correct answer each.",
  ug_academic_domain_fit: "How well you understand your field and degree, how clearly you see where they lead, and how well your specialisation matches what you enjoy.",
  ug_human_professional_skills: "How you communicate, handle emotions and conflict, work in teams, lead, follow through on ideas and recover from setbacks - judged from what you said you would actually do.",
  ug_digital_future_skills: "How you learn new digital tools, use AI responsibly, read and question data, adopt new technology and prepare for skills the future will need.",
  ug_career_readiness: "How clearly you know your target role, the experience and evidence of skills you can already show, and how deliberately you are building your professional identity.",
  ug_future_adaptability: "How quickly you learn, how you adapt when plans change, the sectors that suit you, your openness to relocating and how you picture your long-term career.",
};

/** One practical next step per sub-dimension, used when that sub-dimension is a growth area. */
const STEP: Record<string, string> = {
  "Aptitude": "Practise timed quantitative and spatial puzzles (rates of work, rotations) a few times a week.",
  "Numerical Reasoning": "Practise percentage, ratio and weighted-average problems until you can solve them without a calculator.",
  "Verbal Reasoning": "Practise critical-reasoning questions that ask what weakens or follows from an argument.",
  "Logical Reasoning": "Work through ranking, scheduling and if-then puzzles, drawing each condition out before answering.",
  "Abstract Reasoning": "Practise series and matrix puzzles, and name the rule for rows and columns before choosing an answer.",
  "Analytical Reasoning": "Read charts and tables carefully: separate what the data shows from what it proves.",
  "Problem Solving": "Before solving, list the constraints and dependencies, then check each option against all of them.",
  "Domain Knowledge": "Explain one core concept of your field to a friend from another discipline each week.",
  "Degree Knowledge": "List five roles your degree leads to and the skills employers ask for in each (use real job postings).",
  "Specialisation Fit": "Do a short project in the part of your field you enjoy most, and note what keeps you engaged.",
  "Communication": "When explaining something, check what the listener already knows and use one concrete example.",
  "Emotional Intelligence": "In disagreements or feedback, pause and restate the other person's view before replying.",
  "Teamwork": "Agree roles and check-ins at the start of group work, and raise problems with teammates early and directly.",
  "Leadership": "Volunteer to organise the next steps the next time a group project stalls.",
  "Execution": "Break long tasks into weekly milestones and track them somewhere visible.",
  "Resilience": "After a setback, write down what went wrong and one thing you'll change before trying again.",
  "Digital Literacy": "Learn one new tool properly this month (tutorial plus a real task), not just the features you need today.",
  "AI Readiness": "Use an AI tool on real coursework, then check its output against a reliable source.",
  "Data Literacy": "For every chart you read, ask where the data came from and what else could explain the pattern.",
  "Technology Adoption": "Try new tools early, and compare them with your current method on a real task.",
  "Future Skills": "Pick one emerging skill near your field and spend an hour a week on it.",
  "Career Readiness": "Write one paragraph on the role you want and the qualifications it needs.",
  "Experience": "Look for an internship, project, competition or volunteering role connected to your field this term.",
  "Skill Portfolio": "Collect your best work samples into a simple portfolio you could show an employer.",
  "Skill Gaps": "Compare your skills with three job postings for your target role and list the gaps.",
  "Professional Identity": "Write a two-line statement of the value you bring, backed by one piece of evidence.",
  "Learning Agility": "When you meet something new, go one level deeper than the immediate problem needs.",
  "Adaptability": "When plans change, list adjacent options that use the skills you already have.",
};

function preferenceSubs(p: PillarScoreGrad) {
  return p.subDimensions.filter((s) => s.result).map((s) => ({ label: s.name, value: s.result as string }));
}
function scoredSubs(p: PillarScoreGrad) {
  return p.subDimensions.filter((s) => s.score !== null && s.answered > 0).map((s) => ({ label: s.name, value: s.score as number }));
}

function textFor(p: PillarScoreGrad, l1: PsychometricProfileGrad): Pick<CustomDimension, "strengths" | "grow" | "recommend"> {
  const scored = scoredSubs(p).sort((a, b) => b.value - a.value);
  const prefs = preferenceSubs(p);
  const strong = scored.filter((s) => s.value >= 67);
  const weak = scored.filter((s) => s.value < 50).sort((a, b) => a.value - b.value);
  const strengths: string[] = [];
  const grow: string[] = [];

  switch (p.key) {
    case "ug_personality_behaviour":
      strengths.push(l1.personality.summary);
      prefs.forEach((x) => strengths.push(`${x.label}: ${x.value}.`));
      grow.push(p.score < 40 ? "Your answers point in different directions, which often means you adapt to the situation. Notice which approach works best for you in practice." : "Strong preferences are useful; stretch yourself in situations that call for the opposite style.");
      break;
    case "ug_interests_motivation": {
      const top = l1.riasec.slice(0, 3).map((r) => r.name).join(", ");
      strengths.push(`Your strongest interests are ${top}.`);
      if (l1.motivators.ranked[0]) strengths.push(`You are most motivated by ${l1.motivators.ranked.slice(0, 2).map((m) => m.tag.toLowerCase()).join(" and ")}.`);
      prefs.filter((x) => x.label !== "RIASEC Interests").forEach((x) => strengths.push(`${x.label}: ${x.value}.`));
      grow.push("Check your top interests against real work: shadow, intern or talk to people in roles that match your interest code.");
      break;
    }
    case "ug_cognitive_capability": {
      const apt = l1.aptitude;
      apt.subdomains.filter((s) => s.total && s.score >= 67).forEach((s) => strengths.push(`${s.name}: ${s.correct} of ${s.total} correct.`));
      apt.subdomains.filter((s) => s.total && s.score < 50).forEach((s) => grow.push(`${s.name}: ${s.correct} of ${s.total} correct.`));
      break;
    }
    default:
      strong.forEach((s) => strengths.push(`${s.label}: ${s.value}%.`));
      prefs.forEach((x) => strengths.push(`${x.label}: ${x.value}.`));
      weak.forEach((s) => grow.push(`${s.label}: ${s.value}%.`));
  }

  if (!strengths.length) strengths.push(p.score >= 50 ? "You show a solid base across this pillar." : "No single area stands out yet - a good pillar to build on deliberately.");
  if (!grow.length) grow.push("No clear gaps in this pillar - keep using these strengths in projects and internships.");

  const stepSubs = (p.key === "ug_cognitive_capability"
    ? l1.aptitude.subdomains.filter((s) => s.total).sort((a, b) => a.score - b.score).map((s) => s.name)
    : scored.slice().sort((a, b) => a.value - b.value).map((s) => s.label));
  const recommend = stepSubs.map((n) => STEP[n]).filter(Boolean).slice(0, 3);
  return { strengths: strengths.slice(0, 4), grow: grow.slice(0, 4), recommend };
}

export function pillarDimensionsGrad(l1: PsychometricProfileGrad): CustomDimension[] {
  return l1.pillars.map((p) => ({
    key: p.key,
    label: p.label,
    short: p.short,
    icon: ICON[p.key],
    score: p.score,
    scoreBasis: p.scoreBasis,
    result: p.result,
    meaning: MEANING[p.key],
    subs: p.key === "ug_cognitive_capability"
      ? l1.aptitude.subdomains.filter((s) => s.total).map((s) => ({ label: s.name, value: s.score }))
      : scoredSubs(p),
    preferences: p.key === "ug_interests_motivation"
      ? [{ label: "Interest code", value: l1.riasec.slice(0, 3).map((r) => `${r.code} (${r.name})`).join(", ") }, ...preferenceSubs(p).filter((x) => x.label !== "RIASEC Interests")]
      : preferenceSubs(p),
    ...textFor(p, l1),
  }));
}

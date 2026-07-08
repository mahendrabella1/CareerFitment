"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth, type AssessmentSummary } from "@/lib/auth/AuthProvider";
import {
  Sparkles,
  ArrowRight,
  Brain,
  Compass,
  Target,
  LineChart,
  ShieldCheck,
  Clock,
  Lightbulb,
  Layers,
  Star,
  Users,
  Award,
  CheckCircle2,
  GraduationCap,
  Rocket,
  Briefcase,
  FlaskConical,
  Quote,
  BookOpen,
  Flag,
  Timer,
} from "lucide-react";

type ApiEnvelope<T> = {
  success: boolean;
  message: string;
  statusCode: number;
  data: T;
};

type Journey = {
  code: string;
  name: string;
  age_group: string;
  total_questions: number;
};

type BlueprintParameter = {
  name: string;
  weightPct: number;
  questionCount: number;
  subTraitCount: number;
  poolSize: number;
  status: "ready" | "thin" | "no_pool";
};

type BlueprintData = {
  journey: {
    code: string;
    name: string;
    ageGroup: string;
  };
  totalQuestions: number;
  parameters: BlueprintParameter[];
};

type QuestionType = "likert5" | "yes_no" | "mcq";

type SessionQuestion = {
  id: string;
  parameterId: string;
  parameterName: string;
  subTraitId: string;
  subTraitName: string;
  text: string;
  type: QuestionType;
  options: string[] | null;
  displayOrder: number;
};

type SessionParameter = {
  parameterId: string;
  name: string;
  weightPct: number;
  questionCount: number;
  status: "live" | "missing_pool" | "insufficient_pool";
  warnings: string[];
  questions: SessionQuestion[];
};

type SessionData = {
  sessionId: string;
  journeyCode: string;
  parameters: SessionParameter[];
  questions: SessionQuestion[];
  totalQuestions: number;
};

type FitmentTheme = {
  letter: string;
  title: string;
  score: number;
  meaning: string;
  suggestions: string[];
};

type FitmentData = {
  primaryCode: string;
  outcomeLabel: string;
  summary: string;
  themes: FitmentTheme[];
  recommendations: string[];
  nextStep: string;
} | null;

type ScoreParameterGroup = {
  parameterName: string;
  scoringStrategy: string;
  subTraits: {
    subTraitName: string;
    rawScore: number;
    normalizedScore: number;
  }[];
};

type ScoreData = {
  sessionId: string;
  journey: {
    code: string;
    name: string;
    ageGroup: string;
  };
  fitment: FitmentData;
  topStrengths: {
    parameterName: string;
    subTraitName: string;
    rawScore: number;
    normalizedScore: number;
    scoringStrategy: string;
  }[];
  parameters: ScoreParameterGroup[];
  totalScores: number;
};

type MatchCategory =
  | "interest"
  | "aptitude"
  | "personality"
  | "values"
  | "mi"
  | "ei"
  | "academic";

type FitmentResult = {
  profile: {
    riasecCode: string | null;
    riasec: Record<string, number> | null;
    topAptitudes: { skill: string; score: number }[];
    topValues: { tag: string; score: number }[];
    topIntelligences: { name: string; score: number }[];
    ei: number | null;
    learningStyles: { name: string; score: number }[];
  };
  matches: {
    careerId: string;
    title: string;
    family: string;
    cluster: string;
    roles: string[];
    blurb: string;
    fitmentPct: number;
    band: "Very High" | "High" | "Good" | "Moderate" | "Low";
    contributions: {
      category: MatchCategory;
      similarity: number;
      weight: number;
      contributionPct: number;
    }[];
    gaps: string[];
  }[];
  clusters: { cluster: string; score: number }[];
  validity: {
    straightLining: boolean;
    lowCompleteness: boolean;
    reliableCategoryCount: number;
    confidence: "high" | "medium" | "low";
    notes: string[];
  };
};

const CATEGORY_LABEL: Record<MatchCategory, string> = {
  interest: "Interest",
  aptitude: "Aptitude",
  personality: "Personality",
  values: "Values",
  mi: "Intelligences",
  ei: "Emotional Int.",
  academic: "Academics",
};

const RIASEC_TITLES: Record<string, string> = {
  R: "Realistic",
  I: "Investigative",
  A: "Artistic",
  S: "Social",
  E: "Enterprising",
  C: "Conventional",
};

const LIKERT_OPTIONS = [
  { value: "1", label: "Strongly disagree" },
  { value: "2", label: "Disagree" },
  { value: "3", label: "Neutral" },
  { value: "4", label: "Agree" },
  { value: "5", label: "Strongly agree" },
];

// Class / life-stage options shown in the lead form, each mapped to a journey.
const MILESTONES: { value: string; label: string; hint: string }[] = [
  { value: "career_discovery", label: "Class 6 – 8", hint: "Discover interests & multiple intelligences" },
  { value: "stream_selection", label: "Class 9 – 10", hint: "Find the right stream & subjects" },
  { value: "career_planning", label: "Class 11 – 12", hint: "Career road map & execution plan" },
  { value: "graduate_readiness", label: "Graduate", hint: "Best-fit path & readiness" },
  { value: "career_growth", label: "Early Professional", hint: "Early-career direction & growth" },
  { value: "leadership_excellence", label: "Experienced Professional", hint: "Leadership & pivot planning" },
];

const CAREER_LIBRARY_SIZE = 36;

const HERO_WORDS = [
  "Designer",
  "Doctor",
  "Founder",
  "Engineer",
  "Scientist",
  "Creator",
  "Leader",
];

const CLARITY_STAGES = [
  "I have no idea about my career",
  "I am confused among various options",
  "I am a bit sure but want to explore more",
  "I am sure but need an execution plan",
];

const STAGE_ORDER: Record<string, number> = {
  career_discovery: 1,
  stream_selection: 2,
  career_planning: 3,
  graduate_readiness: 4,
  career_growth: 5,
  leadership_excellence: 6,
};

async function fetchJson<T>(input: RequestInfo, init?: RequestInit): Promise<T> {
  const response = await fetch(input, init);
  const payload = (await response.json()) as ApiEnvelope<T>;

  if (!response.ok || !payload.success) {
    throw new Error(payload.message || "Request failed");
  }

  return payload.data;
}

function fmtTime(totalSeconds: number): string {
  const s = Math.max(0, Math.floor(totalSeconds));
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${m}:${r.toString().padStart(2, "0")}`;
}

// Inline styles for the timers + the pre-exam instructions screen.
const EX: Record<string, React.CSSProperties> = {
  timerChip: { display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.25)", borderRadius: 999, padding: "6px 12px", fontSize: "0.82rem", fontWeight: 700, color: "#fff" },
  timerLabel: { fontSize: "0.68rem", fontWeight: 500, color: "rgba(255,255,255,0.7)" },
  totalTimer: { fontSize: "0.82rem", color: "rgba(255,255,255,0.8)", whiteSpace: "nowrap" },

  insWrap: { minHeight: "70vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "30px 16px" },
  insCard: { width: "100%", maxWidth: 560, background: "#fff", border: "1px solid var(--line)", borderRadius: 20, padding: "34px 36px", boxShadow: "var(--shadow)", textAlign: "center" },
  insBadge: { fontSize: 40, marginBottom: 8 },
  insTitle: { fontSize: 26, fontWeight: 800, margin: "0 0 4px" },
  insSub: { fontSize: 13.5, color: "var(--muted)", margin: "0 0 22px" },
  insList: { listStyle: "none", padding: 0, margin: "0 0 20px", display: "flex", flexDirection: "column", gap: 12, textAlign: "left" },
  insItem: { display: "flex", gap: 10, fontSize: 14, lineHeight: 1.5, color: "var(--ink-2)" },
  insAgree: { display: "flex", alignItems: "center", gap: 10, justifyContent: "center", fontSize: 13.5, color: "var(--ink)", margin: "0 0 20px", cursor: "pointer" },
  insStart: { width: "100%", padding: "14px", background: "var(--accent)", color: "#fff", border: "none", borderRadius: 12, fontSize: 15.5, fontWeight: 800, cursor: "pointer", boxShadow: "0 10px 24px rgba(224,36,46,0.28)" },
  insStartDisabled: { background: "#d7dae0", color: "#8a8f98", cursor: "not-allowed", boxShadow: "none" },
};

// Clean single-column exam UI (mirrors the /testing exam screen).
const BLUE = "#3b4a9c";
const XS: Record<string, React.CSSProperties> = {
  wrap: { minHeight: "82vh", display: "flex", flexDirection: "column", background: "#fff", border: "1px solid var(--line)", borderRadius: 20, overflow: "hidden", boxShadow: "var(--shadow)" },
  header: { background: BLUE, color: "#fff" },
  headerInner: { padding: "18px 26px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, flexWrap: "wrap" },
  eyebrow: { fontSize: "0.66rem", textTransform: "uppercase", letterSpacing: "0.12em", color: "rgba(255,255,255,0.62)", marginBottom: 3 },
  counter: { fontSize: "1.05rem", fontWeight: 800 },
  timers: { display: "flex", alignItems: "center", gap: 12 },
  timerChip: { display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.25)", borderRadius: 999, padding: "6px 12px", fontSize: "0.82rem", fontWeight: 700 },
  timerLabel: { fontSize: "0.66rem", fontWeight: 500, color: "rgba(255,255,255,0.7)" },
  totalTimer: { fontSize: "0.8rem", color: "rgba(255,255,255,0.82)", whiteSpace: "nowrap" },
  progressBar: { height: 7, background: "rgba(255,255,255,0.25)" },
  progressFill: { height: "100%", background: "#fff", transition: "width 0.35s ease" },

  split: { display: "grid", gridTemplateColumns: "1fr 300px", flex: 1, minHeight: 0 },
  mainCol: { display: "flex", flexDirection: "column", minWidth: 0 },
  palette: { borderLeft: "1px solid var(--line)", background: "#f8fafc", padding: "18px 18px 22px", overflow: "auto" },
  palTitle: { fontSize: 13, fontWeight: 800, color: "#334155", marginBottom: 12 },
  legend: { display: "flex", flexDirection: "column", gap: 7, marginBottom: 16 },
  legItem: { display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: "#64748b", fontWeight: 600 },
  dot: { width: 13, height: 13, borderRadius: 4, display: "inline-block", flexShrink: 0 },
  palGrid: { display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 8 },
  cell: { height: 38, borderRadius: 9, border: "1px solid #d7dbe6", background: "#fff", color: "#64748b", fontWeight: 800, fontSize: 13, cursor: "pointer", transition: "transform .1s ease" },
  cellAnswered: { background: "#16a34a", borderColor: "#16a34a", color: "#fff" },
  cellMarked: { background: "#f2c94c", borderColor: "#e0b53c", color: "#3a2f00" },
  cellAnsMark: { background: "#16a34a", borderColor: "#16a34a", color: "#fff", boxShadow: "inset 0 0 0 2px #f2c94c" },
  cellCurrent: { outline: "3px solid #3b4a9c", outlineOffset: 1 },
  palHint: { fontSize: 11, color: "#94a3b8", marginTop: 12 },

  body: { flex: 1, width: "100%", maxWidth: 720, margin: "0 auto", padding: "34px 28px 22px" },
  subtrait: { display: "inline-block", fontSize: "0.68rem", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 700, color: BLUE, background: "#eef2ff", padding: "5px 13px", borderRadius: 999, marginBottom: 16 },
  qLabel: { fontSize: 14, fontWeight: 700, color: BLUE, marginBottom: 8 },
  question: { fontSize: "1.42rem", lineHeight: 1.45, margin: "0 0 24px", fontWeight: 600, color: "#1f2937" },
  options: { display: "flex", flexDirection: "column", gap: 10, maxWidth: 620 },
  option: { display: "flex", alignItems: "center", gap: 14, width: "100%", textAlign: "left", padding: "14px 18px", border: "1px solid #d7dbe6", borderRadius: 12, background: "#fff", fontSize: "1rem", fontWeight: 600, color: "#334155", cursor: "pointer", transition: "all .14s ease" },
  optionOn: { borderColor: "#4a90d9", background: "#f0f7ff" },
  radio: { flex: "0 0 auto", width: 20, height: 20, borderRadius: "50%", border: "2px solid #94a3b8", display: "grid", placeItems: "center" },
  radioOn: { borderColor: "#4a90d9" },
  radioDot: { width: 10, height: 10, borderRadius: "50%", background: "#4a90d9" },
  optionText: { fontSize: "1rem" },
  optionTextOn: { color: "#1d4ed8" },

  footer: { background: "#eef1f6", borderTop: "1px solid var(--line)", padding: "16px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 },
  footerCenter: { display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "center" },
  exit: { width: 44, background: "none", border: "none", color: "var(--muted)", fontSize: 13, fontWeight: 600, cursor: "pointer", textAlign: "left" },
  navBtn: { padding: "11px 24px", borderRadius: 10, fontSize: 14.5, fontWeight: 700, cursor: "pointer", border: "none" },
  prevBtn: { background: "#fff", color: "#475569", border: "1px solid #cbd5e1" },
  markBtn: { background: "#fff", color: "#b08900", border: "1px solid #e2c15a" },
  markOn: { background: "#fef3c7", color: "#92400e" },
  nextBtn: { background: "#4a90d9", color: "#fff" },
  submitBtn: { background: "#16a34a", color: "#fff" },
  navDisabled: { opacity: 0.45, cursor: "not-allowed" },
};

function formatAgeGroup(ageGroup: string): string {
  if (ageGroup === "Class 11-12") return "Class 11-12 (Inter)";
  return ageGroup;
}

function categoryHint(code: string): string {
  switch (code) {
    case "career_discovery":
      return "Class 6, 7, and 8";
    case "stream_selection":
      return "Class 9 and 10";
    case "career_planning":
      return "Inter / Class 11 and 12";
    case "graduate_readiness":
      return "Graduate students";
    case "career_growth":
      return "Early-career professionals";
    case "leadership_excellence":
      return "Experienced professionals";
    default:
      return "Career fitment journey";
  }
}

function statusTone(status: BlueprintParameter["status"]): "good" | "warn" | "soft" {
  if (status === "ready") return "good";
  if (status === "thin") return "warn";
  return "soft";
}

function optionList(question: SessionQuestion) {
  if (question.type === "likert5") return LIKERT_OPTIONS;
  if (question.type === "yes_no") {
    return [
      { value: "Y", label: "Yes" },
      { value: "N", label: "No" },
    ];
  }

  return (question.options ?? []).map((option, index) => ({
    value: ["A", "B", "C", "D"][index] ?? String(index + 1),
    label: option,
  }));
}

export default function AssessmentExperience() {
  const router = useRouter();
  const { user, profile, loading: authLoading, saveAssessment } = useAuth();
  const [beginHandled, setBeginHandled] = useState(false);
  const [feedbackRating, setFeedbackRating] = useState<number | null>(null);
  const [feedbackSubmitting, setFeedbackSubmitting] = useState(false);
  const [instructionsAccepted, setInstructionsAccepted] = useState(false);
  const [agreeChecked, setAgreeChecked] = useState(false);
  const [qLeft, setQLeft] = useState(60); // seconds left on the current question
  const [totalLeft, setTotalLeft] = useState(0); // seconds left overall
  const [journeys, setJourneys] = useState<Journey[]>([]);
  const [selectedJourneyCode, setSelectedJourneyCode] = useState<string | null>(null);
  const [blueprint, setBlueprint] = useState<BlueprintData | null>(null);
  const [session, setSession] = useState<SessionData | null>(null);
  const [results, setResults] = useState<ScoreData | null>(null);
  const [fitment, setFitment] = useState<FitmentResult | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [savedAnswers, setSavedAnswers] = useState<Record<string, string>>({});
  const [marked, setMarked] = useState<Record<string, boolean>>({});
  const [visited, setVisited] = useState<Record<string, boolean>>({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loadingJourneys, setLoadingJourneys] = useState(true);
  const [loadingBlueprint, setLoadingBlueprint] = useState(false);
  const [starting, setStarting] = useState(false);
  const [savingQuestionId, setSavingQuestionId] = useState<string | null>(null);
  const [completing, setCompleting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Front-of-funnel: landing -> details (lead capture) -> exam -> results
  const [view, setView] = useState<"landing" | "details">("landing");
  const [wordIdx, setWordIdx] = useState(0);
  const [leadId, setLeadId] = useState<string | null>(null);
  const [lead, setLead] = useState({
    name: "",
    email: "",
    phone: "",
    city: "",
    age: "",
    journeyCode: "",
    stage: "",
    dreamCareer: "",
  });

  const sortedJourneys = [...journeys].sort(
    (a, b) => (STAGE_ORDER[a.code] ?? 99) - (STAGE_ORDER[b.code] ?? 99)
  );
  const selectedJourney =
    sortedJourneys.find((journey) => journey.code === selectedJourneyCode) ?? null;
  const currentQuestion = session?.questions[currentIndex] ?? null;
  const answeredCount = Object.keys(savedAnswers).length;
  const expectedQuestionCount =
    selectedJourney?.total_questions ?? blueprint?.totalQuestions ?? 120;
  const blueprintWarnings =
    blueprint?.parameters.filter((parameter) => parameter.status !== "ready") ?? [];
  const sessionWarnings =
    session?.parameters.flatMap((parameter) =>
      parameter.warnings.map((warning) => `${parameter.name}: ${warning}`)
    ) ?? [];

  useEffect(() => {
    void loadJourneys();
  }, []);

  // Rotating career word in the hero.
  useEffect(() => {
    if (session || results || view !== "landing") return;
    const id = setInterval(() => setWordIdx((i) => (i + 1) % HERO_WORDS.length), 2200);
    return () => clearInterval(id);
  }, [session, results, view]);

  // Scroll-reveal: hide `.reveal` elements, then reveal them as they enter the
  // viewport. Fail-safe: anything not revealed within 1.6s is force-shown, so a
  // missed observer can never leave content invisible.
  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>(".reveal"));
    if (els.length === 0) return;
    els.forEach((el) => el.classList.add("pre"));
    const show = (el: Element) => {
      el.classList.add("in");
      el.classList.remove("pre");
    };
    let io: IntersectionObserver | null = null;
    if (typeof IntersectionObserver !== "undefined") {
      io = new IntersectionObserver(
        (entries) => {
          for (const e of entries) {
            if (e.isIntersecting) {
              show(e.target);
              io?.unobserve(e.target);
            }
          }
        },
        { threshold: 0.1, rootMargin: "0px 0px -8% 0px" }
      );
      els.forEach((el) => io!.observe(el));
    }
    const failsafe = window.setTimeout(() => els.forEach(show), 1600);
    return () => {
      io?.disconnect();
      window.clearTimeout(failsafe);
    };
  }, [view, session, results, loadingJourneys]);

  // Mark the currently-shown question as visited (drives the palette colours).
  useEffect(() => {
    const q = session?.questions[currentIndex];
    if (q) setVisited((v) => (v[q.id] ? v : { ...v, [q.id]: true }));
  }, [session, currentIndex]);

  const markedCount = Object.values(marked).filter(Boolean).length;

  async function loadJourneys() {
    setLoadingJourneys(true);
    setErrorMessage(null);

    try {
      const data = await fetchJson<Journey[]>("/api/journeys");
      setJourneys(data);
      if (data.length > 0) {
        const firstCode = [...data].sort(
          (a, b) => (STAGE_ORDER[a.code] ?? 99) - (STAGE_ORDER[b.code] ?? 99)
        )[0]?.code;
        if (firstCode) {
          await selectJourney(firstCode);
        }
      }
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Unable to load journey categories."
      );
    } finally {
      setLoadingJourneys(false);
    }
  }

  async function selectJourney(code: string) {
    setSelectedJourneyCode(code);
    setBlueprint(null);
    setSession(null);
    setResults(null);
    setFitment(null);
    setAnswers({});
    setSavedAnswers({});
    setCurrentIndex(0);
    setErrorMessage(null);
    setLoadingBlueprint(true);

    try {
      const data = await fetchJson<BlueprintData>(`/api/journeys/${code}/blueprint`);
      setBlueprint(data);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Unable to load this journey blueprint."
      );
    } finally {
      setLoadingBlueprint(false);
    }
  }

  async function submitDetails() {
    setErrorMessage(null);
    if (lead.name.trim().length < 2) {
      setErrorMessage("Please enter the student's name.");
      return;
    }
    if (!lead.email.includes("@")) {
      setErrorMessage("Please enter a valid email address.");
      return;
    }
    if (!lead.journeyCode) {
      setErrorMessage("Please select the current class / stage.");
      return;
    }

    setStarting(true);
    try {
      const created = await fetchJson<{ id: string }>("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: lead.name,
          email: lead.email,
          phone: lead.phone,
          city: lead.city,
          age: lead.age,
          journeyCode: lead.journeyCode,
          stage: lead.stage,
          dreamCareer: lead.dreamCareer,
        }),
      });
      setLeadId(created.id);
      await selectJourney(lead.journeyCode);
      await startAssessment(lead.journeyCode);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Unable to start the assessment."
      );
      setStarting(false);
    }
  }

  async function startAssessment(journeyCode?: string) {
    const code = journeyCode ?? selectedJourneyCode;
    if (!code) return;

    setStarting(true);
    setErrorMessage(null);

    try {
      const data = await fetchJson<SessionData>("/api/assessment/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ journeyCode: code }),
      });

      setSession(data);
      setResults(null);
      setFitment(null);
      setAnswers({});
      setSavedAnswers({});
      setMarked({});
      setVisited({});
      setCurrentIndex(0);
      setInstructionsAccepted(false);
      setAgreeChecked(false);
      setTotalLeft(60 * (data.totalQuestions || 0));
      setQLeft(60);
      if (leadId) {
        void fetch("/api/leads", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ leadId, sessionId: data.sessionId }),
        }).catch(() => {});
      }
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Unable to generate the assessment session."
      );
    } finally {
      setStarting(false);
    }
  }

  async function saveAnswer(value: string) {
    if (!session || !currentQuestion) return;

    const questionId = currentQuestion.id;
    setAnswers((current) => ({ ...current, [questionId]: value }));
    setErrorMessage(null);
    setSavingQuestionId(questionId);

    try {
      await fetchJson(`/api/assessment/${session.sessionId}/answers`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ questionId, value }),
      });
      setSavedAnswers((current) => ({ ...current, [questionId]: value }));
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Unable to save the current response."
      );
    } finally {
      setSavingQuestionId(null);
    }
  }

  async function finishAssessment() {
    if (!session) return;

    setCompleting(true);
    setErrorMessage(null);

    try {
      await fetchJson(`/api/assessment/${session.sessionId}/complete`, {
        method: "POST",
      });
      const scoreData = await fetchJson<ScoreData>(
        `/api/assessment/${session.sessionId}/score`
      );
      setResults(scoreData);
      try {
        const fitmentData = await fetchJson<FitmentResult>(
          `/api/assessment/${session.sessionId}/fitment`
        );
        setFitment(fitmentData);
        if (leadId) {
          await fetch("/api/leads", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              leadId,
              complete: true,
              topCareer: fitmentData.matches[0]?.title ?? null,
            }),
          }).catch(() => {});
        }
        // Hand off to the full premium report / student dashboard.
        window.location.href = `/report/${session.sessionId}`;
        return;
      } catch {
        setFitment(null);
      }
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Unable to complete the assessment."
      );
    } finally {
      setCompleting(false);
    }
  }

  function resetToBlueprint() {
    setSession(null);
    setResults(null);
    setFitment(null);
    setAnswers({});
    setSavedAnswers({});
    setCurrentIndex(0);
    setErrorMessage(null);
    setLeadId(null);
    setFeedbackRating(null);
    setInstructionsAccepted(false);
    setAgreeChecked(false);
    setView("landing");
  }

  // Start the assessment directly from the signed-in profile (category ->
  // journey), skipping the extra details step. Falls back to details if the
  // profile has no journey yet.
  async function startFromProfile() {
    if (!profile?.journeyCode) {
      setView("details");
      return;
    }
    setErrorMessage(null);
    setLead((l) => ({
      ...l,
      name: profile.name,
      email: profile.email,
      phone: profile.phone,
      journeyCode: profile.journeyCode,
      dreamCareer: profile.desiredCareer || "",
    }));
    try {
      const created = await fetchJson<{ id: string }>("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: profile.name,
          email: profile.email,
          phone: profile.phone,
          journeyCode: profile.journeyCode,
          dreamCareer: profile.desiredCareer,
          stage: profile.clarity,
        }),
      });
      setLeadId(created.id);
      await selectJourney(profile.journeyCode);
      await startAssessment(profile.journeyCode);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Unable to start the assessment.");
      setView("details");
    }
  }

  // "Start assessment": signed-in users with a category go straight into the
  // exam; everyone else is sent to register (which returns via ?begin=1).
  function startFlow() {
    setErrorMessage(null);
    if (!user) {
      router.push("/register");
      return;
    }
    if (profile?.journeyCode) void startFromProfile();
    else setView("details");
  }

  // Handle the post-register redirect (/?begin=1) once auth has settled.
  useEffect(() => {
    if (beginHandled || authLoading) return;
    if (typeof window === "undefined") return;
    const begin = new URLSearchParams(window.location.search).get("begin");
    if (begin !== "1") return;
    setBeginHandled(true);
    if (!user) {
      router.replace("/register");
    } else if (profile?.journeyCode) {
      void startFromProfile();
    } else {
      setView("details");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authLoading, user, profile, beginHandled, router]);

  // Prefill the lead form from the signed-in profile.
  useEffect(() => {
    if (!profile) return;
    setLead((l) => ({
      ...l,
      name: l.name || profile.name || "",
      email: l.email || profile.email || "",
      phone: l.phone || profile.phone || "",
      journeyCode: l.journeyCode || profile.journeyCode || "",
      dreamCareer: l.dreamCareer || profile.desiredCareer || "",
    }));
  }, [profile]);

  // --- Exam timers: 1 minute per question + a total budget ---------------
  const examLive = Boolean(session && !results && instructionsAccepted);

  // Reset the per-question timer whenever the question changes.
  useEffect(() => {
    if (examLive) setQLeft(60);
  }, [currentIndex, examLive]);

  // Tick both timers once per second while the exam is live.
  useEffect(() => {
    if (!examLive) return;
    const id = setInterval(() => {
      setQLeft((q) => Math.max(0, q - 1));
      setTotalLeft((t) => Math.max(0, t - 1));
    }, 1000);
    return () => clearInterval(id);
  }, [examLive]);

  // Per-question time up -> move to the next question (last one just waits).
  useEffect(() => {
    if (!examLive || qLeft > 0 || !session) return;
    if (currentIndex < session.totalQuestions - 1) setCurrentIndex((i) => i + 1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [qLeft, examLive]);

  // Total time up -> auto-submit.
  useEffect(() => {
    if (examLive && totalLeft === 0 && !completing && savingQuestionId === null) {
      void finishAssessment();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [totalLeft, examLive]);

  // After scoring, save a trimmed report under the user + record their rating.
  async function submitFeedback() {
    if (feedbackRating == null || !results) return;
    setFeedbackSubmitting(true);
    const desired = (profile?.desiredCareer || "").trim();
    const desiredMatch = desired
      ? (fitment?.matches ?? []).find((m) => {
          const t = m.title.toLowerCase();
          const d = desired.toLowerCase();
          return t.includes(d) || d.includes(t);
        })
      : undefined;
    const p = fitment?.profile;
    const summary: AssessmentSummary = {
      journeyCode: results.journey.code,
      journeyName: results.journey.name,
      completedAt: new Date().toISOString(),
      feedbackRating,
      overallFitmentPct: fitment?.matches?.[0]?.fitmentPct ?? null,
      topCareer: fitment?.matches?.[0]?.title ?? results.fitment?.outcomeLabel ?? null,
      desiredCareer: desired || null,
      desiredCareerFitPct: desiredMatch?.fitmentPct ?? null,
      summary: results.fitment?.summary ?? null,
      outcomeLabel: results.fitment?.outcomeLabel ?? null,
      confidence: fitment?.validity?.confidence ?? null,
      matches: (fitment?.matches ?? []).slice(0, 5).map((m) => ({
        title: m.title,
        fitmentPct: m.fitmentPct,
        band: m.band,
        blurb: m.blurb,
        roles: (m.roles ?? []).slice(0, 4),
      })),
      topStrengths: (results.topStrengths ?? []).slice(0, 8).map((s) => ({
        parameterName: s.parameterName,
        subTraitName: s.subTraitName,
        normalizedScore: s.normalizedScore,
      })),
      riasecCode: p?.riasecCode ?? results.fitment?.primaryCode ?? null,
      themes: (results.fitment?.themes ?? []).slice(0, 6).map((t) => ({
        letter: t.letter,
        title: t.title,
        score: t.score,
        meaning: t.meaning,
      })),
      topIntelligences: (p?.topIntelligences ?? []).slice(0, 5),
      topValues: (p?.topValues ?? []).slice(0, 5),
      topAptitudes: (p?.topAptitudes ?? []).slice(0, 5),
      ei: p?.ei ?? null,
      learningStyles: (p?.learningStyles ?? []).slice(0, 4),
      clusters: (fitment?.clusters ?? []).slice(0, 6),
      recommendations: (results.fitment?.recommendations ?? []).slice(0, 6),
      nextStep: results.fitment?.nextStep ?? null,
    };
    try {
      await saveAssessment(summary);
    } catch {
      /* best-effort — still send them to the dashboard */
    }
    router.push("/account");
  }

  return (
    <main className="shell">
      <header className="ognav">
        <span className="og-logo">
          One<span>Grasp</span>
        </span>
        {!session && !results ? (
          <nav className="ognav-links">
            <a href="#how">How it works</a>
            <a href="#measure">How we score</a>
            <a href="#benefits">Benefits</a>
            <button className="ognav-cta" onClick={startFlow} type="button">
              Start now
            </button>
          </nav>
        ) : null}
      </header>

      {!session && !results ? (
        <section className="cine">
          <div className="cine-bg" aria-hidden>
            <div className="cine-aurora a1" />
            <div className="cine-aurora a2" />
            <div className="cine-aurora a3" />
            <div className="cine-grid" />
            <div className="cine-noise" />
          </div>

          <div className="cine-inner">
            <span className="cine-badge anim-up">
              <Sparkles size={14} /> Career fitment, engineered — not guessed
            </span>

            <h1 className="cine-title anim-up d1">
              Discover the
              <span className="cine-rotate">
                <span key={wordIdx} className="cine-word">
                  {HERO_WORDS[wordIdx]}
                </span>
              </span>
              in you.
            </h1>

            <p className="cine-sub anim-up d2">
              One {expectedQuestionCount}-question assessment. Eight scientific dimensions.
              A clear, ranked <strong>top-5 career fit</strong> with the reasons behind
              every match — for classes 6–12, graduates &amp; professionals.
            </p>

            <div className="cine-cta anim-up d3">
              <button
                className="cine-btn"
                onClick={() => router.push("/register")}
                type="button"
              >
                <span>Start free assessment</span>
                <ArrowRight size={18} />
              </button>
              <a className="cine-ghost" href="#how">
                See how it works
              </a>
            </div>

            <div className="cine-cards anim-up d4">
              <article className="glass g1">
                <span className="g-tag">Holland code</span>
                <strong className="g-code">AIE</strong>
                <span className="g-mut">Artistic · Investigative · Enterprising</span>
              </article>
              <article className="glass g2 featured">
                <div className="g-photo">
                  <img
                    src="https://images.unsplash.com/photo-1531482615713-2afd69097998?w=500&q=80&auto=format&fit=crop"
                    alt="Creative professional at work"
                    loading="eager"
                  />
                </div>
                <span className="g-tag">Top match</span>
                <strong>Product &amp; Design</strong>
                <div className="g-meter">
                  <div style={{ width: "88%" }} />
                </div>
                <span className="g-pct">88% fit</span>
              </article>
              <article className="glass g3">
                <span className="g-tag">Strengths</span>
                <ul className="g-list">
                  <li>Creativity 92</li>
                  <li>Communication 84</li>
                  <li>Leadership 79</li>
                </ul>
              </article>
            </div>

            <div className="cine-trust anim-up d5">
              <div className="cine-stars">
                {[0, 1, 2, 3, 4].map((i) => (
                  <Star key={i} size={15} fill="currentColor" />
                ))}
              </div>
              <span>
                Trusted by <strong>14,200+</strong> students &amp; parents
              </span>
            </div>
          </div>
        </section>
      ) : null}

      {errorMessage ? (
        <div className="banner error">
          <strong>Attention:</strong> {errorMessage}
        </div>
      ) : null}


      {!session && !results && view === "landing" ? (
        <>
          {/* ---- Stats strip ---- */}
          <section className="statstrip reveal">
            {[
              { icon: <Users size={20} />, v: "14,200+", l: "Students guided" },
              { icon: <Layers size={20} />, v: "8", l: "Science-backed dimensions" },
              { icon: <Target size={20} />, v: `${CAREER_LIBRARY_SIZE}+`, l: "Careers matched" },
              { icon: <Award size={20} />, v: "98%", l: "Found it helpful" },
            ].map((s) => (
              <div key={s.l} className="statstrip-item">
                <span className="statstrip-icon">{s.icon}</span>
                <div>
                  <strong>{s.v}</strong>
                  <span>{s.l}</span>
                </div>
              </div>
            ))}
          </section>

          {/* ---- How it works ---- */}
          <section className="lx reveal" id="how">
            <div className="lx-head">
              <span className="lx-eyebrow">How it works</span>
              <h2>Three simple steps to clarity</h2>
              <p>No jargon. Answer honestly, and the engine does the rest.</p>
            </div>
            <div className="lx-steps">
              {[
                {
                  icon: <Compass size={24} />,
                  n: "01",
                  t: "Answer the questions",
                  d: `${expectedQuestionCount} quick statements across 8 categories. No right or wrong — just go with your instinct.`,
                },
                {
                  icon: <Brain size={24} />,
                  n: "02",
                  t: "We score 8 dimensions",
                  d: "Each category is normalised 0–100 with the right method for your age group — interests, aptitude, personality and more.",
                },
                {
                  icon: <Target size={24} />,
                  n: "03",
                  t: "Get your top-5 careers",
                  d: "A ranked fit %, the reasons behind each match, gaps to develop, and a clear next-step plan.",
                },
              ].map((s, i) => (
                <article key={s.n} className="lx-step anim-up" style={{ animationDelay: `${i * 90}ms` }}>
                  <div className="lx-step-icon">{s.icon}</div>
                  <span className="lx-step-n">{s.n}</span>
                  <strong>{s.t}</strong>
                  <p>{s.d}</p>
                </article>
              ))}
            </div>
          </section>

          {/* ---- Inside the test ---- */}
          <section className="test-showcase reveal" id="test">
            <div className="test-left">
              <span className="lx-eyebrow">Inside the assessment</span>
              <h2>An exam experience that feels effortless</h2>
              <p className="test-lead">
                {expectedQuestionCount} adaptive questions across 8 categories — with a
                calm, distraction-free interface built for focus, not pressure.
              </p>
              <ul className="test-feats">
                {[
                  { icon: <Timer size={18} />, t: "No time limit", d: "Go at your own pace — answer honestly, not quickly." },
                  { icon: <Flag size={18} />, t: "Mark for review", d: "Flag any question and come back to it before you submit." },
                  { icon: <Layers size={18} />, t: "Jump anywhere", d: "A live question palette lets you move freely across the paper." },
                  { icon: <CheckCircle2 size={18} />, t: "Auto-saved", d: "Every answer is saved instantly — never lose your progress." },
                ].map((f) => (
                  <li key={f.t}>
                    <span className="test-feat-icon">{f.icon}</span>
                    <div>
                      <strong>{f.t}</strong>
                      <span>{f.d}</span>
                    </div>
                  </li>
                ))}
              </ul>
              <button className="btn-red" onClick={startFlow} type="button">
                Try the assessment <ArrowRight size={18} />
              </button>
            </div>

            {/* stylised exam mock */}
            <div className="test-mock">
              <div className="tm-bar">
                <span className="tm-dot" />
                <span className="tm-dot" />
                <span className="tm-dot" />
                <span className="tm-title">Question 14 of {expectedQuestionCount}</span>
                <span className="tm-pct">32%</span>
              </div>
              <div className="tm-prog">
                <div style={{ width: "32%" }} />
              </div>
              <div className="tm-body">
                <span className="tm-cat">Career Interests</span>
                <p className="tm-q">I enjoy coming up with original ideas and designs.</p>
                <div className="tm-opts">
                  {["Strongly agree", "Agree", "Neutral", "Disagree"].map((o, i) => (
                    <div key={o} className={`tm-opt${i === 0 ? " sel" : ""}`}>
                      <span className="tm-radio">{i === 0 ? <span /> : null}</span>
                      {o}
                    </div>
                  ))}
                </div>
              </div>
              <div className="tm-palette">
                {Array.from({ length: 20 }).map((_, i) => {
                  const cls =
                    i < 13 ? "ans" : i === 13 ? "cur" : i === 15 ? "mk" : "lf";
                  return <span key={i} className={`tm-cell ${cls}`} />;
                })}
              </div>
            </div>
          </section>

          {/* ---- How we score (the counting) ---- */}
          <section className="lx measure reveal" id="measure">
            <div className="lx-head">
              <span className="lx-eyebrow">How we count your fit</span>
              <h2>Not a quiz score — a real profile match</h2>
              <p>
                Your answers build a profile in 8 dimensions. Each is weighted by how much
                it actually predicts career fit, then matched against a career library.
              </p>
            </div>
            <div className="measure-flow">
              <div className="measure-cats">
                {[
                  "Career Interests",
                  "Aptitude",
                  "Personality",
                  "Motivators",
                  "Intelligences",
                  "Emotional Int.",
                  "Learning Style",
                  "Academics",
                ].map((c) => (
                  <span key={c} className="measure-chip">
                    {c}
                  </span>
                ))}
              </div>
              <div className="measure-arrow">
                <LineChart size={22} />
                <span>weighted fitment engine</span>
              </div>
              <div className="measure-out">
                <span className="measure-out-label">Your result</span>
                <strong>Top 5 career matches</strong>
                <p>with fit %, reasons &amp; gaps</p>
              </div>
            </div>
            <div className="measure-weights">
              {[
                ["Interests", 30],
                ["Aptitude", 25],
                ["Personality", 15],
                ["Values", 12],
                ["Intelligences", 8],
                ["Emotional Int.", 6],
                ["Academics", 4],
              ].map(([k, v]) => (
                <div key={k as string} className="measure-w">
                  <div className="measure-w-bar">
                    <div style={{ width: `${(v as number) * 3.2}%` }} />
                  </div>
                  <span>
                    {k} <em>{v}%</em>
                  </span>
                </div>
              ))}
              <p className="measure-note">
                Learning style is shown for advice but weighted 0% — it&apos;s how you
                study, not which career fits.
              </p>
            </div>
          </section>

          {/* ---- Sample report preview ---- */}
          <section className="report-showcase reveal">
            <div className="rs-mock">
              <div className="rs-cover">
                <span className="rs-eyebrow">Career Fitment Report</span>
                <strong>Your top-5 career matches</strong>
                <span className="rs-code">AIE</span>
              </div>
              <div className="rs-rows">
                {[
                  ["Product & Design", 88],
                  ["Marketing Strategy", 84],
                  ["Media & Communication", 79],
                  ["Architecture", 74],
                  ["Entrepreneurship", 71],
                ].map(([t, v], i) => (
                  <div key={t as string} className="rs-row">
                    <span className="rs-rank">{i + 1}</span>
                    <span className="rs-role">{t}</span>
                    <span className="rs-track">
                      <span style={{ width: `${v}%` }} />
                    </span>
                    <strong>{v}%</strong>
                  </div>
                ))}
              </div>
            </div>
            <div className="rs-copy">
              <span className="lx-eyebrow">The deliverable</span>
              <h2>A clear, beautiful report — not a raw score</h2>
              <p>
                Every assessment ends in a shareable report: your top-5 career fits with
                the reasons behind each, your strengths and gaps, learning style, and a
                simple next-step plan. Printable, revisitable, and easy to discuss with a
                mentor.
              </p>
              <ul className="rs-checks">
                {[
                  "Ranked fit % with per-category reasoning",
                  "Strengths and exactly what to develop",
                  "Age-appropriate, defensible methods",
                  "One-click Save / Print to PDF",
                ].map((c) => (
                  <li key={c}>
                    <CheckCircle2 size={17} /> {c}
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* ---- Age-group coverage ---- */}
          <section className="lx reveal">
            <div className="lx-head">
              <span className="lx-eyebrow">For every stage</span>
              <h2>The right assessment for the right age</h2>
              <p>Each stage uses age-appropriate, validated instruments — not one generic test.</p>
            </div>
            <div className="agegrid">
              {[
                { icon: <BookOpen size={22} />, t: "Class 6–8", d: "Discover interests & multiple intelligences", j: "career_discovery" },
                { icon: <Compass size={22} />, t: "Class 9–10", d: "Find the right stream & subjects", j: "stream_selection" },
                { icon: <GraduationCap size={22} />, t: "Class 11–12", d: "Career road map & execution plan", j: "career_planning" },
                { icon: <Rocket size={22} />, t: "Graduates", d: "Best-fit path & job readiness", j: "graduate_readiness" },
                { icon: <Briefcase size={22} />, t: "Professionals", d: "Growth, leadership & pivots", j: "leadership_excellence" },
              ].map((a) => (
                <button
                  key={a.t}
                  className="agecard"
                  onClick={() => {
                    setLead((l) => ({ ...l, journeyCode: a.j }));
                    startFlow();
                  }}
                  type="button"
                >
                  <span className="agecard-icon">{a.icon}</span>
                  <strong>{a.t}</strong>
                  <span>{a.d}</span>
                  <em className="agecard-go">Start →</em>
                </button>
              ))}
            </div>
          </section>

          {/* ---- Backed by science ---- */}
          <section className="science reveal">
            <div className="science-inner">
              <FlaskConical size={26} className="science-flask" />
              <div>
                <span className="lx-eyebrow">Trusted methodology</span>
                <h3>Built on validated psychometric science</h3>
                <div className="science-tags">
                  {["RIASEC / Holland", "Big Five", "DBDA / DAT", "MIDAS", "EQ-i", "SWVI", "VARK", "O*NET"].map((t) => (
                    <span key={t}>{t}</span>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* ---- Benefits ---- */}
          <section className="lx reveal" id="benefits">
            <div className="lx-head">
              <span className="lx-eyebrow">Why it helps</span>
              <h2>What we take care of for you</h2>
            </div>
            <div className="lx-benefits">
              {[
                { icon: <Target size={22} />, t: "Clear top-5 direction", d: "No vague labels — specific careers ranked by real fit, with the reasons spelled out." },
                { icon: <ShieldCheck size={22} />, t: "Defensible & validated", d: "Age-appropriate psychometric methods (RIASEC, aptitude, Big-Five style), not a personality meme." },
                { icon: <Lightbulb size={22} />, t: "Strengths & gaps", d: "See what you're strong at and exactly what to build to reach your target careers." },
                { icon: <Layers size={22} />, t: "8 dimensions, one picture", d: "Interests, aptitude, personality, motivators, EI and more — combined, not averaged." },
                { icon: <Clock size={22} />, t: "No time pressure", d: "Go at your own pace. Mark questions for review and jump around freely." },
                { icon: <Award size={22} />, t: "A shareable report", d: "A clean, printable report you can revisit, download and discuss with a mentor." },
              ].map((b, i) => (
                <article key={b.t} className="lx-benefit anim-up" style={{ animationDelay: `${i * 60}ms` }}>
                  <div className="lx-benefit-icon">{b.icon}</div>
                  <strong>{b.t}</strong>
                  <p>{b.d}</p>
                </article>
              ))}
            </div>
          </section>

          {/* ---- Testimonials ---- */}
          <section className="lx reveal">
            <div className="lx-head">
              <span className="lx-eyebrow">What families say</span>
              <h2>Clarity that changes decisions</h2>
            </div>
            <div className="tgrid">
              {[
                { q: "For the first time my daughter could explain why a path suits her — not just what's trending. The report made our stream decision easy.", n: "Meera R.", r: "Parent · Class 10" },
                { q: "The top-5 matches were spot on. Seeing the strengths and the gaps side by side told me exactly what to work on.", n: "Aditya S.", r: "Class 12 student" },
                { q: "We use it with every counselling student. It's rigorous, clear, and the report does half our conversation for us.", n: "K. Prasad", r: "Career counsellor" },
              ].map((t) => (
                <article key={t.n} className="tcard">
                  <Quote size={22} className="tcard-quote" />
                  <p>{t.q}</p>
                  <div className="tcard-by">
                    <span className="tcard-av">{t.n.charAt(0)}</span>
                    <div>
                      <strong>{t.n}</strong>
                      <span>{t.r}</span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>

          {/* ---- CTA ---- */}
          <section className="lx-cta reveal">
            <div className="lx-cta-inner">
              <h2>Ready to see where you fit?</h2>
              <p>Takes about 15–20 minutes. Get your top-5 career report instantly.</p>
              <button className="btn-light" onClick={startFlow} type="button">
                Start Career Assessment <ArrowRight size={18} />
              </button>
              <div className="lx-cta-trust">
                <Users size={16} /> 14,200+ students · <CheckCircle2 size={16} /> Instant report ·{" "}
                <ShieldCheck size={16} /> Private
              </div>
            </div>
          </section>
        </>
      ) : null}

      {!session && !results && view === "details" ? (
        <section className="og-form-wrap">
          <div className="panel og-form">
            <div className="panel-head">
              <div>
                <p className="eyebrow">Your details</p>
                <h2>Tell us who is taking the assessment</h2>
              </div>
              <button
                className="ghost-button"
                onClick={() => setView("landing")}
                type="button"
              >
                Back
              </button>
            </div>

            <div className="og-field-grid">
              <label className="og-field">
                <span>Full name *</span>
                <input
                  value={lead.name}
                  onChange={(e) => setLead({ ...lead, name: e.target.value })}
                  placeholder="e.g. Ruhan Kumar"
                />
              </label>
              <label className="og-field">
                <span>Email *</span>
                <input
                  type="email"
                  value={lead.email}
                  onChange={(e) => setLead({ ...lead, email: e.target.value })}
                  placeholder="name@example.com"
                />
              </label>
              <label className="og-field">
                <span>Phone</span>
                <input
                  value={lead.phone}
                  onChange={(e) => setLead({ ...lead, phone: e.target.value })}
                  placeholder="+91 …"
                />
              </label>
              <label className="og-field">
                <span>City</span>
                <input
                  value={lead.city}
                  onChange={(e) => setLead({ ...lead, city: e.target.value })}
                  placeholder="e.g. Hyderabad"
                />
              </label>
              <label className="og-field">
                <span>Age</span>
                <input
                  value={lead.age}
                  onChange={(e) => setLead({ ...lead, age: e.target.value })}
                  placeholder="e.g. 15"
                />
              </label>
              <label className="og-field">
                <span>Dream career (optional)</span>
                <input
                  value={lead.dreamCareer}
                  onChange={(e) => setLead({ ...lead, dreamCareer: e.target.value })}
                  placeholder="e.g. Doctor, Designer"
                />
              </label>
            </div>

            <p className="og-field-label">Current class / stage *</p>
            <div className="og-milestone-grid">
              {MILESTONES.map((m) => {
                const active = lead.journeyCode === m.value;
                return (
                  <button
                    key={m.value}
                    type="button"
                    className={`og-milestone${active ? " active" : ""}`}
                    onClick={() => setLead({ ...lead, journeyCode: m.value })}
                  >
                    <strong>{m.label}</strong>
                    <span>{m.hint}</span>
                  </button>
                );
              })}
            </div>

            <p className="og-field-label">Where are you in your career thinking?</p>
            <div className="og-stage-grid">
              {CLARITY_STAGES.map((s) => {
                const active = lead.stage === s;
                return (
                  <button
                    key={s}
                    type="button"
                    className={`og-stage${active ? " active" : ""}`}
                    onClick={() => setLead({ ...lead, stage: s })}
                  >
                    {s}
                  </button>
                );
              })}
            </div>

            <div className="panel-actions">
              <button
                className="og-btn-primary"
                disabled={starting}
                onClick={() => void submitDetails()}
                type="button"
              >
                {starting ? "Preparing your assessment…" : "Begin assessment →"}
              </button>
            </div>
          </div>
        </section>
      ) : null}

      {session && !results && !instructionsAccepted ? (
        <section style={EX.insWrap}>
          <div style={EX.insCard}>
            <div style={EX.insBadge}>📋</div>
            <h2 style={EX.insTitle}>Before you begin</h2>
            <p style={EX.insSub}>
              {selectedJourney?.name ?? "Career assessment"} · {session.totalQuestions} questions
            </p>
            <ul style={EX.insList}>
              <li style={EX.insItem}>⏱️ <span><b>1 minute per question</b> — when the timer runs out, we move you to the next one automatically.</span></li>
              <li style={EX.insItem}>⌛ <span>Total time is about <b>{Math.round((60 * session.totalQuestions) / 60)} minutes</b>. When it ends, the test submits automatically.</span></li>
              <li style={EX.insItem}>💡 <span>Answer honestly — there are <b>no wrong answers</b>. Go with your first instinct.</span></li>
              <li style={EX.insItem}>🚩 <span>You can <b>Mark for review</b> and jump between questions using the palette.</span></li>
              <li style={EX.insItem}>💾 <span>Your answers are <b>saved as you go</b>.</span></li>
            </ul>
            <label style={EX.insAgree}>
              <input type="checkbox" checked={agreeChecked} onChange={(e) => setAgreeChecked(e.target.checked)} />
              <span>I have read and agree to the instructions above.</span>
            </label>
            <button
              type="button"
              style={{ ...EX.insStart, ...(agreeChecked ? {} : EX.insStartDisabled) }}
              disabled={!agreeChecked}
              onClick={() => setInstructionsAccepted(true)}
            >
              Agree &amp; start the test →
            </button>
          </div>
        </section>
      ) : null}

      {session && !results && instructionsAccepted && currentQuestion ? (
        <section style={XS.wrap}>
          {/* header */}
          <div style={XS.header}>
            <div style={XS.headerInner}>
              <div style={{ minWidth: 0 }}>
                <div style={XS.eyebrow}>
                  {selectedJourney?.name ?? "Assessment"} · {currentQuestion.parameterName}
                </div>
                <div style={XS.counter}>
                  Question {currentIndex + 1} of {session.totalQuestions}
                </div>
              </div>
              <div style={XS.timers}>
                <span style={XS.timerChip}>
                  ⏱ <b style={{ color: qLeft <= 10 ? "#ffd0d0" : "#fff" }}>{fmtTime(qLeft)}</b>
                  <span style={XS.timerLabel}>this question</span>
                </span>
                <span style={XS.totalTimer}>Total left <b>{fmtTime(totalLeft)}</b></span>
              </div>
            </div>
            <div style={XS.progressBar}>
              <div style={{ ...XS.progressFill, width: `${((currentIndex + 1) / session.totalQuestions) * 100}%` }} />
            </div>
          </div>

          <div className="xs-split" style={XS.split}>
            <div style={XS.mainCol}>
          {/* body */}
          <div style={XS.body}>
            <div style={XS.subtrait}>{currentQuestion.subTraitName}</div>
            <div style={XS.qLabel}>Question {currentIndex + 1}</div>
            <h2 style={XS.question}>{currentQuestion.text}</h2>

            <div style={XS.options}>
              {optionList(currentQuestion).map((option) => {
                const selected = answers[currentQuestion.id] === option.value;
                const saving = savingQuestionId === currentQuestion.id;
                return (
                  <button
                    key={option.value}
                    type="button"
                    disabled={saving}
                    onClick={() => void saveAnswer(option.value)}
                    style={{ ...XS.option, ...(selected ? XS.optionOn : {}) }}
                  >
                    <span style={{ ...XS.radio, ...(selected ? XS.radioOn : {}) }}>
                      {selected && <span style={XS.radioDot} />}
                    </span>
                    <span style={{ ...XS.optionText, ...(selected ? XS.optionTextOn : {}) }}>
                      {option.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* footer nav */}
          <div style={XS.footer}>
            <button style={XS.exit} onClick={resetToBlueprint} type="button">Exit</button>
            <div style={XS.footerCenter}>
              <button
                style={{ ...XS.navBtn, ...XS.prevBtn, ...(currentIndex === 0 ? XS.navDisabled : {}) }}
                disabled={currentIndex === 0}
                onClick={() => setCurrentIndex((i) => Math.max(i - 1, 0))}
                type="button"
              >
                Previous
              </button>
              <button
                style={{ ...XS.navBtn, ...XS.markBtn, ...(marked[currentQuestion.id] ? XS.markOn : {}) }}
                onClick={() => setMarked((m) => ({ ...m, [currentQuestion.id]: !m[currentQuestion.id] }))}
                type="button"
              >
                {marked[currentQuestion.id] ? "★ Marked" : "☆ Mark for review"}
              </button>
              {currentIndex < session.totalQuestions - 1 ? (
                <button
                  style={{ ...XS.navBtn, ...XS.nextBtn, ...(answers[currentQuestion.id] ? {} : XS.navDisabled) }}
                  disabled={!answers[currentQuestion.id]}
                  onClick={() => setCurrentIndex((i) => Math.min(i + 1, session.totalQuestions - 1))}
                  type="button"
                >
                  Save &amp; Next →
                </button>
              ) : (
                <button
                  style={{ ...XS.navBtn, ...XS.submitBtn, ...((!answers[currentQuestion.id] || completing || savingQuestionId !== null) ? XS.navDisabled : {}) }}
                  disabled={!answers[currentQuestion.id] || completing || savingQuestionId !== null}
                  onClick={() => void finishAssessment()}
                  type="button"
                >
                  {completing ? "Scoring…" : "Submit test"}
                </button>
              )}
            </div>
            <div style={{ width: 44 }} />
          </div>
            </div>

            <aside className="xs-palette" style={XS.palette}>
              <div style={XS.palTitle}>Question palette</div>
              <div style={XS.legend}>
                <span style={XS.legItem}><i style={{ ...XS.dot, background: "#16a34a" }} /> Answered ({Object.keys(answers).length})</span>
                <span style={XS.legItem}><i style={{ ...XS.dot, background: "#f2c94c" }} /> Marked ({Object.values(marked).filter(Boolean).length})</span>
                <span style={XS.legItem}><i style={{ ...XS.dot, border: "1px solid #cbd5e1", background: "#fff" }} /> Not answered ({session.totalQuestions - Object.keys(answers).length})</span>
              </div>
              <div style={XS.palGrid}>
                {session.questions.map((q, i) => {
                  const isCurrent = i === currentIndex;
                  const isAnswered = answers[q.id] !== undefined;
                  const isMarked = Boolean(marked[q.id]);
                  let cell: React.CSSProperties = { ...XS.cell };
                  if (isAnswered && isMarked) cell = { ...cell, ...XS.cellAnsMark };
                  else if (isAnswered) cell = { ...cell, ...XS.cellAnswered };
                  else if (isMarked) cell = { ...cell, ...XS.cellMarked };
                  return (
                    <button
                      key={q.id}
                      type="button"
                      onClick={() => setCurrentIndex(i)}
                      style={{ ...cell, ...(isCurrent ? XS.cellCurrent : {}) }}
                    >
                      {i + 1}
                    </button>
                  );
                })}
              </div>
              <div style={XS.palHint}>Tap a number to jump to that question.</div>
            </aside>
          </div>
        </section>
      ) : null}

      {results && user ? (
        <section
          style={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "40px 20px",
            background: "#eef1f6",
          }}
        >
          <div
            style={{
              width: "100%",
              maxWidth: 560,
              background: "#fff",
              borderRadius: 18,
              padding: "38px 34px",
              boxShadow: "0 16px 50px rgba(30,41,59,.14)",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: 40, marginBottom: 8 }}>🎉</div>
            <h2 style={{ fontSize: 24, fontWeight: 800, margin: "0 0 6px" }}>
              Assessment complete!
            </h2>
            <p style={{ color: "#64748b", fontSize: 15, margin: "0 0 26px", lineHeight: 1.6 }}>
              Before we show your report — how would you rate this assessment
              experience?
            </p>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 8,
                justifyContent: "center",
                marginBottom: 10,
              }}
            >
              {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => {
                const active = feedbackRating === n;
                return (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setFeedbackRating(n)}
                    style={{
                      width: 42,
                      height: 42,
                      borderRadius: 10,
                      border: active ? "2px solid #3b4a9c" : "1px solid #cbd5e1",
                      background: active ? "#3b4a9c" : "#fff",
                      color: active ? "#fff" : "#334155",
                      fontWeight: 800,
                      fontSize: 15,
                      cursor: "pointer",
                    }}
                  >
                    {n}
                  </button>
                );
              })}
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: 12,
                color: "#94a3b8",
                maxWidth: 460,
                margin: "0 auto 26px",
              }}
            >
              <span>1 — Poor</span>
              <span>10 — Excellent</span>
            </div>
            <button
              type="button"
              disabled={feedbackRating == null || feedbackSubmitting}
              onClick={() => void submitFeedback()}
              style={{
                width: "100%",
                padding: "14px",
                borderRadius: 12,
                border: "none",
                background: feedbackRating == null ? "#cbd5e1" : "#3b4a9c",
                color: feedbackRating == null ? "#64748b" : "#fff",
                fontSize: 15.5,
                fontWeight: 800,
                cursor: feedbackRating == null ? "not-allowed" : "pointer",
              }}
            >
              {feedbackSubmitting ? "Saving…" : "Submit & view my report →"}
            </button>
          </div>
        </section>
      ) : null}

      {results && !user ? (
        <section className="results-layout">
          {fitment ? (
            <div className="panel report-panel">
              <div className="panel-head">
                <div>
                  <p className="eyebrow">Career Fitment Report</p>
                  <h2>
                    Careers that fit you{" "}
                    {fitment.profile.riasecCode ? (
                      <span className="code-badge">{fitment.profile.riasecCode}</span>
                    ) : null}
                  </h2>
                </div>
                <span className={`confidence-pill ${fitment.validity.confidence}`}>
                  {fitment.validity.confidence} confidence
                </span>
              </div>

              {fitment.validity.notes.length > 0 ? (
                <div
                  className={`banner ${
                    fitment.validity.confidence === "low" ? "warn" : "soft"
                  }`}
                >
                  {fitment.validity.notes.join(" ")}
                </div>
              ) : null}

              {fitment.profile.riasec ? (
                <div className="riasec-strip">
                  {(["R", "I", "A", "S", "E", "C"] as const).map((letter) => {
                    const value = Math.round(fitment.profile.riasec?.[letter] ?? 0);
                    return (
                      <div key={letter} className="riasec-bar">
                        <div className="riasec-track">
                          <div
                            className="riasec-fill"
                            style={{ height: `${Math.max(value, 3)}%` }}
                          />
                        </div>
                        <strong>{value}</strong>
                        <span>{RIASEC_TITLES[letter]}</span>
                      </div>
                    );
                  })}
                </div>
              ) : null}

              <div className="match-list">
                {fitment.matches.map((match, index) => (
                  <article key={match.careerId} className="match-card">
                    <div className="match-rank">{index + 1}</div>
                    <div className="match-body">
                      <div className="match-title-row">
                        <div>
                          <strong>{match.title}</strong>
                          <span className="match-cluster">
                            {match.cluster} · {match.roles.join(", ")}
                          </span>
                        </div>
                        <div className="match-score">
                          <span className={`band-pill band-${match.band.replace(/\s/g, "")}`}>
                            {match.band}
                          </span>
                          <strong>{match.fitmentPct}%</strong>
                        </div>
                      </div>
                      <div className="match-fit-track">
                        <div
                          className="match-fit-fill"
                          style={{ width: `${match.fitmentPct}%` }}
                        />
                      </div>
                      <p className="match-blurb">{match.blurb}</p>
                      <div className="contrib-row">
                        {match.contributions.slice(0, 4).map((c) => (
                          <span key={c.category} className="contrib-chip">
                            {CATEGORY_LABEL[c.category]}{" "}
                            {Math.round(c.similarity * 100)}%
                          </span>
                        ))}
                      </div>
                      {match.gaps.length > 0 ? (
                        <ul className="gap-list">
                          {match.gaps.map((gap) => (
                            <li key={gap}>{gap}</li>
                          ))}
                        </ul>
                      ) : null}
                    </div>
                  </article>
                ))}
              </div>

              <div className="report-columns">
                <div>
                  <h3>Top career clusters</h3>
                  <div className="cluster-list">
                    {fitment.clusters.slice(0, 6).map((cluster) => (
                      <div key={cluster.cluster} className="cluster-row">
                        <span>{cluster.cluster}</span>
                        <div className="cluster-track">
                          <div
                            className="cluster-fill"
                            style={{ width: `${cluster.score}%` }}
                          />
                        </div>
                        <strong>{cluster.score}%</strong>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="profile-highlights">
                  <h3>Your profile at a glance</h3>
                  {fitment.profile.topAptitudes.length > 0 ? (
                    <p>
                      <span className="muted">Strongest aptitudes:</span>{" "}
                      {fitment.profile.topAptitudes
                        .map((a) => `${a.skill} (${a.score})`)
                        .join(", ")}
                    </p>
                  ) : null}
                  {fitment.profile.topValues.length > 0 ? (
                    <p>
                      <span className="muted">Core motivators:</span>{" "}
                      {fitment.profile.topValues.map((v) => v.tag).join(", ")}
                    </p>
                  ) : null}
                  {fitment.profile.topIntelligences.length > 0 ? (
                    <p>
                      <span className="muted">Top intelligences:</span>{" "}
                      {fitment.profile.topIntelligences
                        .map((m) => m.name)
                        .join(", ")}
                    </p>
                  ) : null}
                  {fitment.profile.ei !== null ? (
                    <p>
                      <span className="muted">Emotional intelligence:</span>{" "}
                      {fitment.profile.ei}/100
                    </p>
                  ) : null}
                  {fitment.profile.learningStyles.length > 0 ? (
                    <p>
                      <span className="muted">Learning style (advisory):</span>{" "}
                      {fitment.profile.learningStyles[0].name}
                    </p>
                  ) : null}
                </div>
              </div>
            </div>
          ) : null}

          <div className="panel">
            <div className="panel-head">
              <div>
                <p className="eyebrow">Fitment Summary</p>
                <h2>
                  {results.journey.name} | {formatAgeGroup(results.journey.ageGroup)}
                </h2>
              </div>
              <button className="ghost-button" onClick={resetToBlueprint} type="button">
                Start another session
              </button>
            </div>

            {results.fitment ? (
              <>
                <div className="fitment-hero">
                  <div>
                    <span className="muted">Primary code</span>
                    <h3>{results.fitment.primaryCode}</h3>
                    <p>{results.fitment.summary}</p>
                  </div>
                  <div>
                    <span className="muted">Best used for</span>
                    <strong>{results.fitment.outcomeLabel}</strong>
                  </div>
                </div>

                <div className="theme-grid">
                  {results.fitment.themes.map((theme) => (
                    <article key={theme.letter} className="theme-card">
                      <span className="theme-letter">{theme.letter}</span>
                      <strong>{theme.title}</strong>
                      <p>{theme.meaning}</p>
                      <span className="theme-score">{theme.score}/100</span>
                    </article>
                  ))}
                </div>

                <div className="results-columns">
                  <div>
                    <h3>Suggested {results.fitment.outcomeLabel}</h3>
                    <ul className="simple-list">
                      {results.fitment.recommendations.map((recommendation) => (
                        <li key={recommendation}>{recommendation}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3>Next step</h3>
                    <p>{results.fitment.nextStep}</p>
                  </div>
                </div>
              </>
            ) : (
              <div className="banner soft">
                Career-interest fitment could not be derived from the current score set, but the
                sub-trait results are still available below.
              </div>
            )}
          </div>

          <div className="results-columns">
            <div className="panel">
              <div className="panel-head">
                <div>
                  <p className="eyebrow">Top Strengths</p>
                  <h2>Highest scored sub-traits</h2>
                </div>
              </div>

              <div className="parameter-list">
                {results.topStrengths.map((item) => (
                  <article key={`${item.parameterName}-${item.subTraitName}`} className="parameter-card">
                    <div className="parameter-head">
                      <strong>{item.subTraitName}</strong>
                      <span className="score-chip">{item.normalizedScore}/100</span>
                    </div>
                    <p>{item.parameterName}</p>
                  </article>
                ))}
              </div>
            </div>

            <div className="panel">
              <div className="panel-head">
                <div>
                  <p className="eyebrow">Score Breakdown</p>
                  <h2>Parameter-wise scoring</h2>
                </div>
              </div>

              <div className="parameter-list">
                {results.parameters.map((parameter) => (
                  <article key={parameter.parameterName} className="parameter-card">
                    <div className="parameter-head">
                      <strong>{parameter.parameterName}</strong>
                      <StatusPill label={parameter.scoringStrategy} tone="soft" />
                    </div>
                    <div className="subtrait-list">
                      {parameter.subTraits.slice(0, 4).map((subTrait) => (
                        <div key={subTrait.subTraitName} className="subtrait-row">
                          <span>{subTrait.subTraitName}</span>
                          <strong>{subTrait.normalizedScore}/100</strong>
                        </div>
                      ))}
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>
      ) : null}
    </main>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <article className="stat-card">
      <span>{label}</span>
      <strong>{value}</strong>
    </article>
  );
}

function StatusPill({
  label,
  tone,
}: {
  label: string;
  tone: "good" | "warn" | "soft";
}) {
  return <span className={`status-pill ${tone}`}>{label}</span>;
}

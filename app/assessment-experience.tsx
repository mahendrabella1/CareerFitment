"use client";

import { useEffect, useState } from "react";
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
    setView("landing");
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
            <button className="ognav-cta" onClick={() => setView("details")} type="button">
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
                onClick={() => {
                  setView("details");
                  setErrorMessage(null);
                }}
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
              <button className="btn-red" onClick={() => setView("details")} type="button">
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
                    setView("details");
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
              <button className="btn-light" onClick={() => setView("details")} type="button">
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

      {session && !results && currentQuestion ? (
        <section className="exam2">
          <div className="exam2-main">
            {/* dark header bar */}
            <div className="exam2-topbar">
              <div>
                <p className="exam2-eyebrow">
                  {selectedJourney?.name ?? "Assessment"} · {currentQuestion.parameterName}
                </p>
                <p className="exam2-qcount">
                  Question {currentIndex + 1} of {session.totalQuestions}
                </p>
              </div>
              <span className="exam2-pct">
                {Math.round(((currentIndex + 1) / session.totalQuestions) * 100)}% complete
              </span>
            </div>
            <div className="exam2-progress">
              <div
                className="exam2-progress-fill"
                style={{ width: `${((currentIndex + 1) / session.totalQuestions) * 100}%` }}
              />
            </div>

            <div className="exam2-body">
              <p className="exam2-subtrait">{currentQuestion.subTraitName}</p>
              <h2 className="exam2-question">{currentQuestion.text}</h2>

              <div className="exam2-options">
                {optionList(currentQuestion).map((option) => {
                  const selected = answers[currentQuestion.id] === option.value;
                  const saving = savingQuestionId === currentQuestion.id;
                  return (
                    <button
                      key={option.value}
                      className={`exam2-option${selected ? " selected" : ""}`}
                      onClick={() => void saveAnswer(option.value)}
                      disabled={saving}
                      type="button"
                    >
                      <span className="exam2-radio">{selected ? <span /> : null}</span>
                      {option.label}
                    </button>
                  );
                })}
              </div>

              <div className="exam2-actions">
                <button
                  className="exam2-back"
                  disabled={currentIndex === 0}
                  onClick={() => setCurrentIndex((i) => Math.max(i - 1, 0))}
                  type="button"
                >
                  ‹ Back
                </button>
                <button
                  className={`exam2-mark${marked[currentQuestion.id] ? " on" : ""}`}
                  onClick={() =>
                    setMarked((m) => ({
                      ...m,
                      [currentQuestion.id]: !m[currentQuestion.id],
                    }))
                  }
                  type="button"
                >
                  {marked[currentQuestion.id] ? "★ Marked for review" : "☆ Mark for review"}
                </button>
                {currentIndex < session.totalQuestions - 1 ? (
                  <button
                    className="exam2-next"
                    disabled={!answers[currentQuestion.id]}
                    onClick={() =>
                      setCurrentIndex((i) => Math.min(i + 1, session.totalQuestions - 1))
                    }
                    type="button"
                  >
                    Save &amp; Next ›
                  </button>
                ) : (
                  <button
                    className="exam2-finish"
                    disabled={!answers[currentQuestion.id] || completing || savingQuestionId !== null}
                    onClick={() => void finishAssessment()}
                    type="button"
                  >
                    {completing ? "Scoring…" : "✓ See my results"}
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="exam2-mid">
            <div className="exam2-mid-art">
              <CheckCircle2 size={40} />
            </div>
            <h3>
              You&apos;re doing great{lead.name ? `, ${lead.name.trim().split(/\s+/)[0]}` : ""}!
            </h3>
            <p>
              There are no wrong answers here — go with your first instinct. Every
              response helps us map the careers that fit you best.
            </p>
            <div className="exam2-mid-progress">
              <div className="exam2-mid-track">
                <div
                  className="exam2-mid-fill"
                  style={{ width: `${(answeredCount / session.totalQuestions) * 100}%` }}
                />
              </div>
              <span>
                {answeredCount} of {session.totalQuestions} answered
              </span>
            </div>
          </div>

          <aside className="exam2-palette">
            <div className="exam2-palette-head">
              <p className="exam2-palette-title">Question palette</p>
              <div className="exam2-legend">
                <span>
                  <i className="dot answered" />
                  Answered ({answeredCount})
                </span>
                <span>
                  <i className="dot marked" />
                  Marked ({markedCount})
                </span>
                <span>
                  <i className="dot left" />
                  Left ({session.totalQuestions - answeredCount})
                </span>
              </div>
            </div>
            <div className="exam2-grid">
              {session.questions.map((question, index) => {
                const isCurrent = index === currentIndex;
                const isAnswered = Boolean(savedAnswers[question.id]);
                const isMarked = Boolean(marked[question.id]);
                const wasVisited = Boolean(visited[question.id]);
                let cls = "left";
                if (isAnswered && isMarked) cls = "ansmark";
                else if (isAnswered) cls = "answered";
                else if (isMarked) cls = "marked";
                else if (wasVisited) cls = "visited";
                return (
                  <button
                    key={question.id}
                    className={`exam2-cell ${cls}${isCurrent ? " current" : ""}`}
                    onClick={() => setCurrentIndex(index)}
                    type="button"
                  >
                    {index + 1}
                  </button>
                );
              })}
            </div>
            <button className="exam2-quit" onClick={resetToBlueprint} type="button">
              Exit assessment
            </button>
          </aside>
        </section>
      ) : null}

      {results ? (
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

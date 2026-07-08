import { createHash, randomUUID } from "crypto";
import { promises as fs } from "fs";
import path from "path";
import { deriveCareerFit } from "@/lib/engine/careerFitment";
import { computeFitment } from "@/lib/engine/fitment/computeFitment";
import { FitmentResult } from "@/lib/engine/fitment/types";
import { isFirestoreConfigured } from "@/lib/firebase/admin";
import { getFirestoreBank } from "@/lib/firebase/questionBank";
import {
  fsAttachSession,
  fsCompleteLead,
  fsCreateLead,
  fsGetLeadBySession,
  fsListLeads,
  Lead,
} from "@/lib/firebase/leads";

export type { Lead };
import { distributeAcrossSubtraits } from "@/lib/engine/blueprintEngine";
import { getScoringStrategy } from "@/lib/engine/scoring/registry";
import { ScoredResponse } from "@/lib/engine/scoring/types";
import {
  GeneratedSession,
  JourneyRow,
  QuestionType,
  SessionParameter,
  SessionQuestion,
} from "@/lib/engine/types";

type ExtractedQuestion = {
  text: string;
  type: QuestionType;
  options: string[] | null;
  answer: string | null;
};

type SourceKey =
  | "Personality"
  | "CareerInterest"
  | "Aptitude"
  | "LearningStyle"
  | "MultipleIntelligences"
  | "AcademicStrengths"
  | "EmotionalIntelligence"
  | "Motivators";

type AgeGroup =
  | "Class 6-8"
  | "Class 9-10"
  | "Class 11-12"
  | "Graduate 18-21"
  | "Early Career 21-25"
  | "Professionals 25-55";

type ExtractedBank = Record<
  SourceKey,
  Record<AgeGroup, Record<string, ExtractedQuestion[]>>
>;

type BlueprintDefinition = {
  name: string;
  weightPct: number;
  questionCount: number;
  sortOrder: number;
  minPerSubtrait: number;
  idealPerSubtrait: number;
  maxPerSubtrait: number;
};

type PoolQuestion = {
  id: string;
  parameterId: string;
  parameterName: string;
  subTraitId: string;
  subTraitName: string;
  text: string;
  type: QuestionType;
  options: string[] | null;
  correctAnswer: string | null;
  reverseScored: boolean;
};

type StoredSessionQuestion = SessionQuestion & {
  correctAnswer: string | null;
  reverseScored: boolean;
};

type StoredSession = {
  sessionId: string;
  journeyCode: string;
  journeyName: string;
  ageGroup: AgeGroup;
  generatedAt: string;
  completedAt: string | null;
  status: "in_progress" | "completed";
  parameters: SessionParameter[];
  questions: StoredSessionQuestion[];
  answers: Record<string, string>;
  scoreRows: LocalScoreRow[];
};

type SessionStore = {
  sessions: StoredSession[];
};

export type AuthoredQuestion = {
  id: string;
  journeyCode: string;
  parameterName: string;
  subTraitName: string;
  questionText: string;
  questionType: QuestionType;
  options: string[] | null;
  correctAnswer: string | null;
  reverseScored: boolean;
  createdAt: string;
};

type AuthoredQuestionStore = {
  questions: AuthoredQuestion[];
};

type LocalScoreRow = {
  parameterName: string;
  subTraitName: string;
  rawScore: number;
  normalizedScore: number;
  scoringStrategy: string;
};

type LocalScorePayload = {
  sessionId: string;
  journey: {
    code: string;
    name: string;
    ageGroup: string;
  };
  fitment: ReturnType<typeof deriveCareerFit>;
  topStrengths: LocalScoreRow[];
  parameters: {
    parameterName: string;
    scoringStrategy: string;
    subTraits: {
      subTraitName: string;
      rawScore: number;
      normalizedScore: number;
    }[];
  }[];
  totalScores: number;
};

const DATA_DIR = path.join(process.cwd(), "data");
const AUTHORED_QUESTIONS_FILE = path.join(DATA_DIR, "local-authored-questions.json");
const SESSIONS_FILE = path.join(DATA_DIR, "local-sessions.json");
const LEADS_FILE = path.join(DATA_DIR, "local-leads.json");
const EXTRACTED_QUESTIONS_FILE = path.join(
  process.cwd(),
  "scripts",
  "extracted_questions.json"
);

const JOURNEYS: JourneyRow[] = [
  {
    id: "journey-career-discovery",
    code: "career_discovery",
    name: "Career Discovery",
    age_group: "Class 6-8",
    total_questions: 120,
    is_active: true,
  },
  {
    id: "journey-stream-selection",
    code: "stream_selection",
    name: "Stream Selection",
    age_group: "Class 9-10",
    total_questions: 120,
    is_active: true,
  },
  {
    id: "journey-career-planning",
    code: "career_planning",
    name: "Career Planning",
    age_group: "Class 11-12",
    total_questions: 120,
    is_active: true,
  },
  {
    id: "journey-graduate-readiness",
    code: "graduate_readiness",
    name: "Graduate Readiness",
    age_group: "Graduate 18-21",
    total_questions: 120,
    is_active: true,
  },
  {
    id: "journey-career-growth",
    code: "career_growth",
    name: "Career Growth",
    age_group: "Early Career 21-25",
    total_questions: 120,
    is_active: true,
  },
  {
    id: "journey-leadership-excellence",
    code: "leadership_excellence",
    name: "Leadership Excellence",
    age_group: "Professionals 25-55",
    total_questions: 120,
    is_active: true,
  },
];

const DEFAULT_SUBTRAIT_RULES = {
  minPerSubtrait: 4,
  idealPerSubtrait: 6,
  maxPerSubtrait: 8,
};

const BLUEPRINTS: Record<string, BlueprintDefinition[]> = {
  career_discovery: [
    { name: "Personality", weightPct: 15, questionCount: 18, sortOrder: 0, ...DEFAULT_SUBTRAIT_RULES },
    { name: "Career Interests", weightPct: 20, questionCount: 24, sortOrder: 1, ...DEFAULT_SUBTRAIT_RULES },
    { name: "Aptitude / Cognitive Ability", weightPct: 20, questionCount: 24, sortOrder: 2, ...DEFAULT_SUBTRAIT_RULES },
    { name: "Learning Style", weightPct: 10, questionCount: 12, sortOrder: 3, ...DEFAULT_SUBTRAIT_RULES },
    { name: "Multiple Intelligences", weightPct: 10, questionCount: 12, sortOrder: 4, ...DEFAULT_SUBTRAIT_RULES },
    { name: "Academic Strengths & Weaknesses", weightPct: 10, questionCount: 12, sortOrder: 5, ...DEFAULT_SUBTRAIT_RULES },
    { name: "Subject Preference Mapping", weightPct: 5, questionCount: 6, sortOrder: 6, ...DEFAULT_SUBTRAIT_RULES },
    { name: "Creativity & Innovation", weightPct: 5, questionCount: 6, sortOrder: 7, ...DEFAULT_SUBTRAIT_RULES },
    { name: "Self-Esteem & Self-Concept", weightPct: 5, questionCount: 6, sortOrder: 8, ...DEFAULT_SUBTRAIT_RULES },
  ],
  stream_selection: [
    { name: "Personality", weightPct: 15, questionCount: 18, sortOrder: 0, ...DEFAULT_SUBTRAIT_RULES },
    { name: "Career Interests", weightPct: 18, questionCount: 22, sortOrder: 1, ...DEFAULT_SUBTRAIT_RULES },
    { name: "Aptitude / Cognitive Ability", weightPct: 18, questionCount: 22, sortOrder: 2, ...DEFAULT_SUBTRAIT_RULES },
    { name: "Subject Preference Mapping", weightPct: 10, questionCount: 12, sortOrder: 3, ...DEFAULT_SUBTRAIT_RULES },
    { name: "Critical Thinking", weightPct: 8, questionCount: 10, sortOrder: 4, ...DEFAULT_SUBTRAIT_RULES },
    { name: "Problem-Solving Ability", weightPct: 8, questionCount: 10, sortOrder: 5, ...DEFAULT_SUBTRAIT_RULES },
    { name: "Emotional Intelligence", weightPct: 5, questionCount: 6, sortOrder: 6, ...DEFAULT_SUBTRAIT_RULES },
    { name: "Values / Motivators", weightPct: 5, questionCount: 6, sortOrder: 7, ...DEFAULT_SUBTRAIT_RULES },
    { name: "Goal Orientation", weightPct: 5, questionCount: 6, sortOrder: 8, ...DEFAULT_SUBTRAIT_RULES },
    { name: "Decision-Making Style", weightPct: 3, questionCount: 4, sortOrder: 9, ...DEFAULT_SUBTRAIT_RULES },
    { name: "Time Management", weightPct: 3, questionCount: 4, sortOrder: 10, ...DEFAULT_SUBTRAIT_RULES },
    { name: "Creativity & Innovation", weightPct: 2, questionCount: 2, sortOrder: 11, ...DEFAULT_SUBTRAIT_RULES },
  ],
  career_planning: [
    { name: "Personality", weightPct: 15, questionCount: 18, sortOrder: 0, ...DEFAULT_SUBTRAIT_RULES },
    { name: "Career Interests", weightPct: 20, questionCount: 24, sortOrder: 1, ...DEFAULT_SUBTRAIT_RULES },
    { name: "Aptitude / Cognitive Ability", weightPct: 20, questionCount: 24, sortOrder: 2, ...DEFAULT_SUBTRAIT_RULES },
    { name: "Emotional Intelligence", weightPct: 10, questionCount: 12, sortOrder: 3, ...DEFAULT_SUBTRAIT_RULES },
    { name: "Values / Motivators", weightPct: 10, questionCount: 12, sortOrder: 4, ...DEFAULT_SUBTRAIT_RULES },
    { name: "Critical Thinking", weightPct: 10, questionCount: 12, sortOrder: 5, ...DEFAULT_SUBTRAIT_RULES },
    { name: "Problem-Solving Ability", weightPct: 5, questionCount: 6, sortOrder: 6, ...DEFAULT_SUBTRAIT_RULES },
    { name: "Career Readiness", weightPct: 5, questionCount: 6, sortOrder: 7, ...DEFAULT_SUBTRAIT_RULES },
    { name: "Leadership Potential", weightPct: 3, questionCount: 3, sortOrder: 8, ...DEFAULT_SUBTRAIT_RULES },
    { name: "Communication Style", weightPct: 2, questionCount: 3, sortOrder: 9, ...DEFAULT_SUBTRAIT_RULES },
  ],
  graduate_readiness: [
    { name: "Personality", weightPct: 12, questionCount: 14, sortOrder: 0, ...DEFAULT_SUBTRAIT_RULES },
    { name: "Career Interests", weightPct: 10, questionCount: 12, sortOrder: 1, ...DEFAULT_SUBTRAIT_RULES },
    { name: "Aptitude / Cognitive Ability", weightPct: 12, questionCount: 14, sortOrder: 2, ...DEFAULT_SUBTRAIT_RULES },
    { name: "Employability Skills", weightPct: 15, questionCount: 18, sortOrder: 3, ...DEFAULT_SUBTRAIT_RULES },
    { name: "Career Readiness", weightPct: 10, questionCount: 12, sortOrder: 4, ...DEFAULT_SUBTRAIT_RULES },
    { name: "Career Adaptability", weightPct: 8, questionCount: 10, sortOrder: 5, ...DEFAULT_SUBTRAIT_RULES },
    { name: "Emotional Intelligence", weightPct: 8, questionCount: 10, sortOrder: 6, ...DEFAULT_SUBTRAIT_RULES },
    { name: "Decision-Making Style", weightPct: 8, questionCount: 10, sortOrder: 7, ...DEFAULT_SUBTRAIT_RULES },
    { name: "Critical Thinking", weightPct: 7, questionCount: 8, sortOrder: 8, ...DEFAULT_SUBTRAIT_RULES },
    { name: "Problem-Solving Ability", weightPct: 5, questionCount: 6, sortOrder: 9, ...DEFAULT_SUBTRAIT_RULES },
    { name: "Leadership Potential", weightPct: 3, questionCount: 3, sortOrder: 10, ...DEFAULT_SUBTRAIT_RULES },
    { name: "Teamwork & Collaboration", weightPct: 2, questionCount: 3, sortOrder: 11, ...DEFAULT_SUBTRAIT_RULES },
  ],
  career_growth: [
    { name: "Emotional Intelligence", weightPct: 15, questionCount: 18, sortOrder: 0, ...DEFAULT_SUBTRAIT_RULES },
    { name: "Leadership Potential", weightPct: 15, questionCount: 18, sortOrder: 1, ...DEFAULT_SUBTRAIT_RULES },
    { name: "Personality", weightPct: 10, questionCount: 12, sortOrder: 2, ...DEFAULT_SUBTRAIT_RULES },
    { name: "Employability Skills", weightPct: 10, questionCount: 12, sortOrder: 3, ...DEFAULT_SUBTRAIT_RULES },
    { name: "Work Values", weightPct: 10, questionCount: 12, sortOrder: 4, ...DEFAULT_SUBTRAIT_RULES },
    { name: "Communication Style", weightPct: 8, questionCount: 10, sortOrder: 5, ...DEFAULT_SUBTRAIT_RULES },
    { name: "Teamwork & Collaboration", weightPct: 8, questionCount: 10, sortOrder: 6, ...DEFAULT_SUBTRAIT_RULES },
    { name: "Career Adaptability", weightPct: 8, questionCount: 10, sortOrder: 7, ...DEFAULT_SUBTRAIT_RULES },
    { name: "Resilience / Grit", weightPct: 6, questionCount: 7, sortOrder: 8, ...DEFAULT_SUBTRAIT_RULES },
    { name: "Stress Management", weightPct: 4, questionCount: 5, sortOrder: 9, ...DEFAULT_SUBTRAIT_RULES },
    { name: "Conflict Management", weightPct: 3, questionCount: 3, sortOrder: 10, ...DEFAULT_SUBTRAIT_RULES },
    { name: "Entrepreneurial Orientation", weightPct: 3, questionCount: 3, sortOrder: 11, ...DEFAULT_SUBTRAIT_RULES },
  ],
  leadership_excellence: [
    { name: "Leadership Competencies", weightPct: 20, questionCount: 24, sortOrder: 0, ...DEFAULT_SUBTRAIT_RULES },
    { name: "Emotional Intelligence", weightPct: 15, questionCount: 18, sortOrder: 1, ...DEFAULT_SUBTRAIT_RULES },
    { name: "Leadership Style", weightPct: 10, questionCount: 12, sortOrder: 2, ...DEFAULT_SUBTRAIT_RULES },
    { name: "Personality", weightPct: 10, questionCount: 12, sortOrder: 3, ...DEFAULT_SUBTRAIT_RULES },
    { name: "Work Values", weightPct: 10, questionCount: 12, sortOrder: 4, ...DEFAULT_SUBTRAIT_RULES },
    { name: "Conflict Management", weightPct: 8, questionCount: 10, sortOrder: 5, ...DEFAULT_SUBTRAIT_RULES },
    { name: "Coaching Readiness", weightPct: 7, questionCount: 8, sortOrder: 6, ...DEFAULT_SUBTRAIT_RULES },
    { name: "Work Engagement", weightPct: 5, questionCount: 6, sortOrder: 7, ...DEFAULT_SUBTRAIT_RULES },
    { name: "Burnout Risk", weightPct: 5, questionCount: 6, sortOrder: 8, ...DEFAULT_SUBTRAIT_RULES },
    { name: "Career Satisfaction", weightPct: 4, questionCount: 5, sortOrder: 9, ...DEFAULT_SUBTRAIT_RULES },
    { name: "Emotional Resilience", weightPct: 3, questionCount: 3, sortOrder: 10, ...DEFAULT_SUBTRAIT_RULES },
    { name: "Life Role Balance", weightPct: 3, questionCount: 4, sortOrder: 11, ...DEFAULT_SUBTRAIT_RULES },
  ],
};

const SOURCE_KEY_BY_PARAMETER: Record<
  string,
  { sourceKey: SourceKey; mockFallback: boolean }
> = {
  Personality: { sourceKey: "Personality", mockFallback: false },
  "Career Interests": { sourceKey: "CareerInterest", mockFallback: false },
  "Aptitude / Cognitive Ability": { sourceKey: "Aptitude", mockFallback: false },
  "Learning Style": { sourceKey: "LearningStyle", mockFallback: false },
  "Multiple Intelligences": { sourceKey: "MultipleIntelligences", mockFallback: false },
  "Academic Strengths & Weaknesses": { sourceKey: "AcademicStrengths", mockFallback: false },
  "Emotional Intelligence": { sourceKey: "EmotionalIntelligence", mockFallback: false },
  "Values / Motivators": { sourceKey: "Motivators", mockFallback: false },
  "Work Values": { sourceKey: "Motivators", mockFallback: true },
  "Subject Preference Mapping": { sourceKey: "AcademicStrengths", mockFallback: true },
  "Creativity & Innovation": { sourceKey: "MultipleIntelligences", mockFallback: true },
  "Self-Esteem & Self-Concept": { sourceKey: "Personality", mockFallback: true },
  "Critical Thinking": { sourceKey: "Aptitude", mockFallback: true },
  "Problem-Solving Ability": { sourceKey: "Aptitude", mockFallback: true },
  "Goal Orientation": { sourceKey: "Motivators", mockFallback: true },
  "Decision-Making Style": { sourceKey: "EmotionalIntelligence", mockFallback: true },
  "Time Management": { sourceKey: "EmotionalIntelligence", mockFallback: true },
  "Career Readiness": { sourceKey: "EmotionalIntelligence", mockFallback: true },
  "Leadership Potential": { sourceKey: "Personality", mockFallback: true },
  "Communication Style": { sourceKey: "EmotionalIntelligence", mockFallback: true },
  "Employability Skills": { sourceKey: "EmotionalIntelligence", mockFallback: true },
  "Career Adaptability": { sourceKey: "EmotionalIntelligence", mockFallback: true },
  "Teamwork & Collaboration": { sourceKey: "EmotionalIntelligence", mockFallback: true },
  "Resilience / Grit": { sourceKey: "Personality", mockFallback: true },
  "Stress Management": { sourceKey: "EmotionalIntelligence", mockFallback: true },
  "Conflict Management": { sourceKey: "EmotionalIntelligence", mockFallback: true },
  "Entrepreneurial Orientation": { sourceKey: "Motivators", mockFallback: true },
  "Leadership Competencies": { sourceKey: "EmotionalIntelligence", mockFallback: true },
  "Leadership Style": { sourceKey: "Personality", mockFallback: true },
  "Coaching Readiness": { sourceKey: "EmotionalIntelligence", mockFallback: true },
  "Work Engagement": { sourceKey: "Motivators", mockFallback: true },
  "Burnout Risk": { sourceKey: "EmotionalIntelligence", mockFallback: true },
  "Career Satisfaction": { sourceKey: "Motivators", mockFallback: true },
  "Emotional Resilience": { sourceKey: "EmotionalIntelligence", mockFallback: true },
  "Life Role Balance": { sourceKey: "Motivators", mockFallback: true },
};

let extractedBankCache: ExtractedBank | null = null;

function stableId(...parts: string[]): string {
  return createHash("sha1").update(parts.join("|")).digest("hex");
}

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

async function ensureJsonFile<T>(filePath: string, fallback: T): Promise<void> {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  try {
    await fs.access(filePath);
  } catch {
    await fs.writeFile(filePath, JSON.stringify(fallback, null, 2), "utf8");
  }
}

async function readJsonFile<T>(filePath: string, fallback: T): Promise<T> {
  await ensureJsonFile(filePath, fallback);
  const raw = await fs.readFile(filePath, "utf8");
  return JSON.parse(raw) as T;
}

async function writeJsonFile<T>(filePath: string, data: T): Promise<void> {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf8");
}

async function getExtractedBank(): Promise<ExtractedBank> {
  if (extractedBankCache) {
    return extractedBankCache;
  }

  if (isFirestoreConfigured()) {
    // Pull the bank from Firestore (question_banks/{Source} docs) instead of the
    // bundled JSON. Same nested shape, so the rest of the engine is unchanged.
    extractedBankCache = (await getFirestoreBank()) as unknown as ExtractedBank;
    return extractedBankCache;
  }

  const raw = await fs.readFile(EXTRACTED_QUESTIONS_FILE, "utf8");
  extractedBankCache = JSON.parse(raw) as ExtractedBank;
  return extractedBankCache;
}

async function getAuthoredQuestionStore(): Promise<AuthoredQuestionStore> {
  return readJsonFile<AuthoredQuestionStore>(AUTHORED_QUESTIONS_FILE, {
    questions: [],
  });
}

async function saveAuthoredQuestionStore(store: AuthoredQuestionStore): Promise<void> {
  await writeJsonFile(AUTHORED_QUESTIONS_FILE, store);
}

async function getSessionStore(): Promise<SessionStore> {
  return readJsonFile<SessionStore>(SESSIONS_FILE, {
    sessions: [],
  });
}

async function saveSessionStore(store: SessionStore): Promise<void> {
  await writeJsonFile(SESSIONS_FILE, store);
}

function getJourneyOrThrow(journeyCode: string): JourneyRow {
  const journey = JOURNEYS.find((item) => item.code === journeyCode && item.is_active);
  if (!journey) {
    throw new Error(`Unknown or inactive journey: ${journeyCode}`);
  }
  return journey;
}

function getBlueprintOrThrow(journeyCode: string): BlueprintDefinition[] {
  const blueprint = BLUEPRINTS[journeyCode];
  if (!blueprint) {
    throw new Error(`No local blueprint configured for journey: ${journeyCode}`);
  }
  return blueprint;
}

function toQuestionType(value: string): QuestionType {
  if (value === "mcq" || value === "yes_no" || value === "likert5") {
    return value;
  }
  return "likert5";
}

async function buildPoolForParameter(
  journey: JourneyRow,
  parameter: BlueprintDefinition
): Promise<{
  subTraits: {
    id: string;
    name: string;
    questions: PoolQuestion[];
  }[];
  warnings: string[];
}> {
  const extractedBank = await getExtractedBank();
  const authoredStore = await getAuthoredQuestionStore();
  const warnings: string[] = [];
  const parameterId = stableId(journey.code, parameter.name);
  const subTraitMap = new Map<string, { id: string; name: string; questions: PoolQuestion[] }>();
  const sourceConfig = SOURCE_KEY_BY_PARAMETER[parameter.name];

  if (sourceConfig) {
    const ageGroup = journey.age_group as AgeGroup;
    const sourcePool = extractedBank[sourceConfig.sourceKey]?.[ageGroup] ?? {};

    if (sourceConfig.mockFallback) {
      warnings.push(
        `Local mock mode reused the "${sourceConfig.sourceKey}" bank to simulate "${parameter.name}".`
      );
    }

    for (const [subTraitName, questions] of Object.entries(sourcePool)) {
      const subTraitId = stableId(parameterId, subTraitName);
      const bucket = subTraitMap.get(subTraitName) ?? {
        id: subTraitId,
        name: subTraitName,
        questions: [],
      };

      questions.forEach((question, index) => {
        bucket.questions.push({
          id: stableId(
            "base",
            journey.code,
            parameter.name,
            subTraitName,
            String(index),
            question.text
          ),
          parameterId,
          parameterName: parameter.name,
          subTraitId,
          subTraitName,
          text: question.text,
          type: toQuestionType(question.type),
          options: question.options,
          correctAnswer: question.answer,
          reverseScored: false,
        });
      });

      subTraitMap.set(subTraitName, bucket);
    }
  }

  const authoredQuestions = authoredStore.questions.filter(
    (question) =>
      question.journeyCode === journey.code &&
      question.parameterName === parameter.name
  );

  for (const question of authoredQuestions) {
    const subTraitId = stableId(parameterId, question.subTraitName);
    const bucket = subTraitMap.get(question.subTraitName) ?? {
      id: subTraitId,
      name: question.subTraitName,
      questions: [],
    };

    bucket.questions.push({
      id: question.id,
      parameterId,
      parameterName: parameter.name,
      subTraitId,
      subTraitName: question.subTraitName,
      text: question.questionText,
      type: question.questionType,
      options: question.options,
      correctAnswer: question.correctAnswer,
      reverseScored: question.reverseScored,
    });
    subTraitMap.set(question.subTraitName, bucket);
  }

  return {
    subTraits: [...subTraitMap.values()],
    warnings,
  };
}

function stripStoredQuestion(question: StoredSessionQuestion): SessionQuestion {
  return {
    id: question.id,
    parameterId: question.parameterId,
    parameterName: question.parameterName,
    subTraitId: question.subTraitId,
    subTraitName: question.subTraitName,
    text: question.text,
    type: question.type,
    options: question.options,
    displayOrder: question.displayOrder,
  };
}

function stripStoredSession(session: StoredSession): GeneratedSession {
  return {
    sessionId: session.sessionId,
    journeyCode: session.journeyCode,
    parameters: session.parameters,
    questions: session.questions.map(stripStoredQuestion),
    totalQuestions: session.questions.length,
  };
}

function buildScorePayloadFromSession(session: StoredSession): LocalScorePayload {
  const shaped = session.scoreRows;
  const parameterMap = new Map<
    string,
    {
      parameterName: string;
      scoringStrategy: string;
      subTraits: {
        subTraitName: string;
        rawScore: number;
        normalizedScore: number;
      }[];
    }
  >();

  for (const row of shaped) {
    const bucket = parameterMap.get(row.parameterName) ?? {
      parameterName: row.parameterName,
      scoringStrategy: row.scoringStrategy,
      subTraits: [],
    };
    bucket.subTraits.push({
      subTraitName: row.subTraitName,
      rawScore: row.rawScore,
      normalizedScore: row.normalizedScore,
    });
    parameterMap.set(row.parameterName, bucket);
  }

  const parameters = [...parameterMap.values()].map((parameter) => ({
    ...parameter,
    subTraits: parameter.subTraits.sort(
      (a, b) => b.normalizedScore - a.normalizedScore
    ),
  }));

  const fitment = deriveCareerFit(
    session.journeyCode,
    shaped
      .filter((row) => row.parameterName === "Career Interests")
      .map((row) => ({
        subTraitName: row.subTraitName,
        normalizedScore: row.normalizedScore,
      }))
  );

  return {
    sessionId: session.sessionId,
    journey: {
      code: session.journeyCode,
      name: session.journeyName,
      ageGroup: session.ageGroup,
    },
    fitment,
    topStrengths: [...shaped]
      .sort((a, b) => b.normalizedScore - a.normalizedScore)
      .slice(0, 6),
    parameters,
    totalScores: shaped.length,
  };
}

export async function listLocalJourneys(): Promise<JourneyRow[]> {
  return JOURNEYS.filter((journey) => journey.is_active);
}

export async function getLocalBlueprint(journeyCode: string): Promise<{
  journey: { code: string; name: string; ageGroup: string };
  totalQuestions: number;
  parameters: {
    name: string;
    weightPct: number;
    questionCount: number;
    subTraitCount: number;
    poolSize: number;
    status: "ready" | "thin" | "no_pool";
  }[];
}> {
  const journey = getJourneyOrThrow(journeyCode);
  const blueprint = getBlueprintOrThrow(journeyCode);
  const parameters = [];

  for (const parameter of blueprint) {
    const pool = await buildPoolForParameter(journey, parameter);
    const poolSize = pool.subTraits.reduce(
      (sum, subTrait) => sum + subTrait.questions.length,
      0
    );

    parameters.push({
      name: parameter.name,
      weightPct: parameter.weightPct,
      questionCount: parameter.questionCount,
      subTraitCount: pool.subTraits.length,
      poolSize,
      status: (poolSize === 0
        ? "no_pool"
        : poolSize < parameter.questionCount * 2
          ? "thin"
          : "ready") as "ready" | "thin" | "no_pool",
    });
  }

  return {
    journey: {
      code: journey.code,
      name: journey.name,
      ageGroup: journey.age_group,
    },
    totalQuestions: journey.total_questions,
    parameters,
  };
}

export async function generateLocalSession(
  journeyCode: string,
  userId: string | null
): Promise<GeneratedSession> {
  void userId;
  const journey = getJourneyOrThrow(journeyCode);
  const blueprint = getBlueprintOrThrow(journeyCode);
  const sessionId = randomUUID();
  const usedIds = new Set<string>();
  const parameterDrafts: Omit<SessionParameter, "questions">[] = [];
  const selectedQuestions: Omit<StoredSessionQuestion, "displayOrder">[] = [];

  for (const parameter of blueprint) {
    const parameterId = stableId(journey.code, parameter.name);
    const pool = await buildPoolForParameter(journey, parameter);

    if (pool.subTraits.length === 0) {
      parameterDrafts.push({
        parameterId,
        name: parameter.name,
        weightPct: parameter.weightPct,
        questionCount: parameter.questionCount,
        status: "missing_pool",
        warnings: [`No question bank exists yet for "${parameter.name}" - skipped.`],
      });
      continue;
    }

    const poolSizes: Record<string, number> = {};
    for (const subTrait of pool.subTraits) {
      poolSizes[subTrait.id] = subTrait.questions.length;
    }

    const { alloc, warnings } = distributeAcrossSubtraits(
      parameter.questionCount,
      poolSizes,
      parameter.minPerSubtrait,
      parameter.idealPerSubtrait,
      parameter.maxPerSubtrait
    );

    const questions: Omit<StoredSessionQuestion, "displayOrder">[] = [];
    let insufficientAny = false;

    for (const subTrait of pool.subTraits) {
      const need = alloc[subTrait.id] ?? 0;
      if (need === 0) continue;

      const picked = shuffle(subTrait.questions).filter(
        (question) => !usedIds.has(question.id)
      );
      const chosen = picked.slice(0, need);
      if (chosen.length < need) insufficientAny = true;

      for (const question of chosen) {
        usedIds.add(question.id);
        questions.push({
          id: question.id,
          parameterId: question.parameterId,
          parameterName: question.parameterName,
          subTraitId: question.subTraitId,
          subTraitName: question.subTraitName,
          text: question.text,
          type: question.type,
          options: question.options,
          correctAnswer: question.correctAnswer,
          reverseScored: question.reverseScored,
        });
      }
    }

    const parameterWarnings = [...pool.warnings, ...warnings];
    if (questions.length < parameter.questionCount) {
      parameterWarnings.push(
        `Only ${questions.length} of ${parameter.questionCount} questions could be allocated for "${parameter.name}".`
      );
    }

    parameterDrafts.push({
      parameterId,
      name: parameter.name,
      weightPct: parameter.weightPct,
      questionCount: parameter.questionCount,
      status: insufficientAny ? "insufficient_pool" : "live",
      warnings: parameterWarnings,
    });
    selectedQuestions.push(...questions);
  }

  const orderedQuestions: StoredSessionQuestion[] = shuffle(selectedQuestions).map(
    (question, index) => ({
      ...question,
      displayOrder: index,
    })
  );

  const questionsByParameter = new Map<string, SessionQuestion[]>();
  for (const question of orderedQuestions) {
    const bucket = questionsByParameter.get(question.parameterId) ?? [];
    bucket.push(stripStoredQuestion(question));
    questionsByParameter.set(question.parameterId, bucket);
  }

  const parameters: SessionParameter[] = parameterDrafts.map((draft) => ({
    ...draft,
    questions: questionsByParameter.get(draft.parameterId) ?? [],
  }));

  const store = await getSessionStore();
  store.sessions.push({
    sessionId,
    journeyCode: journey.code,
    journeyName: journey.name,
    ageGroup: journey.age_group as AgeGroup,
    generatedAt: new Date().toISOString(),
    completedAt: null,
    status: "in_progress",
    parameters,
    questions: orderedQuestions,
    answers: {},
    scoreRows: [],
  });
  await saveSessionStore(store);

  return {
    sessionId,
    journeyCode: journey.code,
    parameters,
    questions: orderedQuestions.map(stripStoredQuestion),
    totalQuestions: orderedQuestions.length,
  };
}

export async function saveLocalAnswer(
  sessionId: string,
  questionId: string,
  value: string
): Promise<{ sessionId: string; questionId: string; raw_value: string }> {
  const store = await getSessionStore();
  const session = store.sessions.find((item) => item.sessionId === sessionId);
  if (!session) {
    throw new Error("Session not found");
  }

  const assigned = session.questions.find((question) => question.id === questionId);
  if (!assigned) {
    throw new Error("This question was not assigned to this session");
  }

  session.answers[questionId] = value;
  await saveSessionStore(store);

  return {
    sessionId,
    questionId,
    raw_value: value,
  };
}

export async function completeLocalSession(
  sessionId: string
): Promise<{ sessionId: string; scoresComputed: number }> {
  const store = await getSessionStore();
  const session = store.sessions.find((item) => item.sessionId === sessionId);
  if (!session) {
    throw new Error("Session not found");
  }

  const byParameter = new Map<
    string,
    { parameterName: string; responses: ScoredResponse[] }
  >();

  for (const question of session.questions) {
    const rawValue = session.answers[question.id];
    if (!rawValue) continue;

    const bucket = byParameter.get(question.parameterId) ?? {
      parameterName: question.parameterName,
      responses: [],
    };
    bucket.responses.push({
      questionId: question.id,
      subTraitId: question.subTraitId,
      subTraitName: question.subTraitName,
      rawValue,
      questionType: question.type,
      correctAnswer: question.correctAnswer,
      reverseScored: question.reverseScored,
    });
    byParameter.set(question.parameterId, bucket);
  }

  const scoreRows: LocalScoreRow[] = [];
  for (const [, { parameterName, responses }] of byParameter) {
    const strategy = getScoringStrategy(parameterName);
    const scores = strategy.score(responses);
    for (const score of scores) {
      scoreRows.push({
        parameterName,
        subTraitName: score.subTraitName,
        rawScore: score.rawScore,
        normalizedScore: score.normalizedScore,
        scoringStrategy: strategy.id,
      });
    }
  }

  session.scoreRows = scoreRows;
  session.status = "completed";
  session.completedAt = new Date().toISOString();
  await saveSessionStore(store);

  return {
    sessionId,
    scoresComputed: scoreRows.length,
  };
}

export async function getLocalScore(
  sessionId: string
): Promise<LocalScorePayload> {
  const store = await getSessionStore();
  const session = store.sessions.find((item) => item.sessionId === sessionId);
  if (!session) {
    throw new Error("Session not found");
  }

  return buildScorePayloadFromSession(session);
}

type LeadStore = { leads: Lead[] };

async function getLeadStore(): Promise<LeadStore> {
  return readJsonFile<LeadStore>(LEADS_FILE, { leads: [] });
}

async function saveLeadStore(store: LeadStore): Promise<void> {
  await writeJsonFile(LEADS_FILE, store);
}

export async function createLocalLead(input: {
  name: string;
  email: string;
  phone?: string | null;
  city?: string | null;
  age?: string | null;
  journeyCode: string;
  stage?: string | null;
  dreamCareer?: string | null;
}): Promise<Lead> {
  const journey = getJourneyOrThrow(input.journeyCode);
  const lead: Lead = {
    id: `lead-${randomUUID()}`,
    name: input.name.trim(),
    email: input.email.trim(),
    phone: input.phone?.trim() || null,
    city: input.city?.trim() || null,
    age: input.age?.trim() || null,
    journeyCode: journey.code,
    journeyName: journey.name,
    ageGroup: journey.age_group,
    stage: input.stage?.trim() || null,
    dreamCareer: input.dreamCareer?.trim() || null,
    sessionId: null,
    status: "started",
    topCareer: null,
    createdAt: new Date().toISOString(),
    completedAt: null,
  };

  if (isFirestoreConfigured()) {
    return fsCreateLead(lead);
  }

  const store = await getLeadStore();
  store.leads.push(lead);
  await saveLeadStore(store);
  return lead;
}

export async function attachSessionToLead(
  leadId: string,
  sessionId: string
): Promise<void> {
  if (isFirestoreConfigured()) {
    await fsAttachSession(leadId, sessionId);
    return;
  }
  const store = await getLeadStore();
  const lead = store.leads.find((l) => l.id === leadId);
  if (!lead) return;
  lead.sessionId = sessionId;
  await saveLeadStore(store);
}

export async function completeLocalLead(
  leadId: string,
  topCareer: string | null
): Promise<void> {
  if (isFirestoreConfigured()) {
    await fsCompleteLead(leadId, topCareer);
    return;
  }
  const store = await getLeadStore();
  const lead = store.leads.find((l) => l.id === leadId);
  if (!lead) return;
  lead.status = "completed";
  lead.topCareer = topCareer;
  lead.completedAt = new Date().toISOString();
  await saveLeadStore(store);
}

export async function listLocalLeads(): Promise<Lead[]> {
  if (isFirestoreConfigured()) {
    return fsListLeads();
  }
  const store = await getLeadStore();
  return [...store.leads].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function findLeadBySession(sessionId: string): Promise<Lead | null> {
  if (isFirestoreConfigured()) {
    return fsGetLeadBySession(sessionId);
  }
  const store = await getLeadStore();
  return store.leads.find((l) => l.sessionId === sessionId) ?? null;
}

export async function getLocalFitment(sessionId: string): Promise<FitmentResult> {
  const store = await getSessionStore();
  const session = store.sessions.find((item) => item.sessionId === sessionId);
  if (!session) {
    throw new Error("Session not found");
  }

  const score = buildScorePayloadFromSession(session);
  const rawAnswers = Object.values(session.answers);
  return computeFitment(
    score.parameters.map((p) => ({
      parameterName: p.parameterName,
      scoringStrategy: p.scoringStrategy,
      subTraits: p.subTraits.map((s) => ({
        subTraitName: s.subTraitName,
        rawScore: s.rawScore,
        normalizedScore: s.normalizedScore,
      })),
    })),
    { rawAnswers }
  );
}

export async function getLocalReportHtml(sessionId: string): Promise<string> {
  const store = await getSessionStore();
  const session = store.sessions.find((item) => item.sessionId === sessionId);
  if (!session) {
    throw new Error("Session not found");
  }

  const score = buildScorePayloadFromSession(session);
  const completedAt = session.completedAt
    ? new Date(session.completedAt).toLocaleString()
    : "In progress";

  const fitmentSection = score.fitment
    ? `
      <section class="card">
        <h2>Career Fitment Summary</h2>
        <p><strong>Primary code:</strong> ${score.fitment.primaryCode}</p>
        <p>${score.fitment.summary}</p>
        <p><strong>Best used for:</strong> ${score.fitment.outcomeLabel}</p>
        <ul>${score.fitment.recommendations.map((item) => `<li>${item}</li>`).join("")}</ul>
        <p><strong>Next step:</strong> ${score.fitment.nextStep}</p>
      </section>
    `
    : `
      <section class="card">
        <h2>Career Fitment Summary</h2>
        <p>The current score set did not produce a career-interest fitment code.</p>
      </section>
    `;

  const parameterCards = score.parameters
    .map(
      (parameter) => `
      <section class="card">
        <h3>${parameter.parameterName}</h3>
        <p><strong>Strategy:</strong> ${parameter.scoringStrategy}</p>
        <table>
          <thead>
            <tr>
              <th>Sub-trait</th>
              <th>Score</th>
            </tr>
          </thead>
          <tbody>
            ${parameter.subTraits
              .map(
                (subTrait) => `
                  <tr>
                    <td>${subTrait.subTraitName}</td>
                    <td>${subTrait.normalizedScore}/100</td>
                  </tr>
                `
              )
              .join("")}
          </tbody>
        </table>
      </section>
    `
    )
    .join("");

  return `
    <!doctype html>
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <title>OneGrasp Assessment Report</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 32px; color: #20322f; background: #f7f2ea; }
          h1, h2, h3 { margin: 0 0 12px; }
          p { line-height: 1.5; }
          .hero, .card { background: white; border: 1px solid #d7d0c5; border-radius: 16px; padding: 20px; margin-bottom: 16px; }
          .meta { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 12px; margin-top: 16px; }
          .meta div { background: #f4f0e8; border-radius: 12px; padding: 12px; }
          table { width: 100%; border-collapse: collapse; margin-top: 12px; }
          th, td { border-bottom: 1px solid #e8e1d6; padding: 8px 6px; text-align: left; }
          ul { padding-left: 18px; }
        </style>
      </head>
      <body>
        <section class="hero">
          <h1>OneGrasp Assessment Report</h1>
          <p><strong>Journey:</strong> ${score.journey.name}</p>
          <p><strong>Category:</strong> ${score.journey.ageGroup}</p>
          <p><strong>Session ID:</strong> ${score.sessionId}</p>
          <div class="meta">
            <div><strong>Completed</strong><br />${completedAt}</div>
            <div><strong>Questions answered</strong><br />${Object.keys(session.answers).length}</div>
            <div><strong>Scores computed</strong><br />${score.totalScores}</div>
          </div>
        </section>
        ${fitmentSection}
        <section class="card">
          <h2>Top Strengths</h2>
          <ul>
            ${score.topStrengths
              .map(
                (item) =>
                  `<li>${item.subTraitName} (${item.parameterName}) - ${item.normalizedScore}/100</li>`
              )
              .join("")}
          </ul>
        </section>
        ${parameterCards}
      </body>
    </html>
  `;
}

export async function listLocalAdminQuestions(): Promise<{
  journeys: {
    code: string;
    name: string;
    ageGroup: string;
    parameters: string[];
  }[];
  questions: AuthoredQuestion[];
}> {
  const store = await getAuthoredQuestionStore();
  return {
    journeys: JOURNEYS.filter((journey) => journey.is_active).map((journey) => ({
      code: journey.code,
      name: journey.name,
      ageGroup: journey.age_group,
      parameters: getBlueprintOrThrow(journey.code).map((parameter) => parameter.name),
    })),
    questions: store.questions.sort((a, b) =>
      b.createdAt.localeCompare(a.createdAt)
    ),
  };
}

export async function createLocalAdminQuestion(input: {
  journeyCode: string;
  parameterName: string;
  subTraitName: string;
  questionText: string;
  questionType: QuestionType;
  options: string[] | null;
  correctAnswer: string | null;
  reverseScored?: boolean;
}): Promise<AuthoredQuestion> {
  const journey = getJourneyOrThrow(input.journeyCode);
  const blueprint = getBlueprintOrThrow(journey.code);
  if (!blueprint.some((parameter) => parameter.name === input.parameterName)) {
    throw new Error("The selected parameter does not belong to this journey");
  }

  const authoredStore = await getAuthoredQuestionStore();
  const question: AuthoredQuestion = {
    id: `authored-${randomUUID()}`,
    journeyCode: input.journeyCode,
    parameterName: input.parameterName.trim(),
    subTraitName: input.subTraitName.trim(),
    questionText: input.questionText.trim(),
    questionType: input.questionType,
    options: input.options,
    correctAnswer: input.correctAnswer,
    reverseScored: Boolean(input.reverseScored),
    createdAt: new Date().toISOString(),
  };

  authoredStore.questions.push(question);
  await saveAuthoredQuestionStore(authoredStore);
  return question;
}

export async function deleteLocalAdminQuestion(questionId: string): Promise<void> {
  const authoredStore = await getAuthoredQuestionStore();
  authoredStore.questions = authoredStore.questions.filter(
    (question) => question.id !== questionId
  );
  await saveAuthoredQuestionStore(authoredStore);
}

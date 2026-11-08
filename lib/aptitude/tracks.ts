/**
 * Aptitude Lab - the light part: each topic's name, section and target time,
 * the four class tracks and their mock tests. No questions here, so the
 * dashboard tile and My Progress can use it without loading the question
 * generators and the written bank (lib/aptitude/topics.ts).
 */
import type { Level, Section } from "./core";
import { trackIdFor } from "../commLab/scoring";

export interface TopicInfo { title: string; section: Section; /** Seconds a well-practised answer takes - the speed target. */ targetSec: number }

export const TOPIC_INFO = {
  "q-arith": { title: "Simplification (BODMAS)", section: "quant", targetSec: 40 },
  "q-numbers": { title: "Number system", section: "quant", targetSec: 50 },
  "q-fractions": { title: "Fractions", section: "quant", targetSec: 45 },
  "q-percent": { title: "Percentages", section: "quant", targetSec: 45 },
  "q-ratio": { title: "Ratio and proportion", section: "quant", targetSec: 50 },
  "q-average": { title: "Averages", section: "quant", targetSec: 45 },
  "q-profit": { title: "Profit, loss and discount", section: "quant", targetSec: 60 },
  "q-interest": { title: "Simple and compound interest", section: "quant", targetSec: 60 },
  "q-timework": { title: "Time and work", section: "quant", targetSec: 70 },
  "q-speed": { title: "Speed, distance and time", section: "quant", targetSec: 60 },
  "q-ages": { title: "Problems on ages", section: "quant", targetSec: 60 },
  "q-mensuration": { title: "Area and volume", section: "quant", targetSec: 50 },
  "q-mixture": { title: "Mixtures and alligation", section: "quant", targetSec: 70 },
  "q-probability": { title: "Probability", section: "quant", targetSec: 60 },
  "q-pnc": { title: "Permutations and combinations", section: "quant", targetSec: 60 },
  "di-table": { title: "Data interpretation: tables", section: "di", targetSec: 60 },
  "r-series": { title: "Number series", section: "reasoning", targetSec: 40 },
  "r-letters": { title: "Alphabet and letter series", section: "reasoning", targetSec: 40 },
  "r-coding": { title: "Coding and decoding", section: "reasoning", targetSec: 45 },
  "r-direction": { title: "Direction sense", section: "reasoning", targetSec: 50 },
  "r-ranking": { title: "Order and ranking", section: "reasoning", targetSec: 35 },
  "r-clock": { title: "Clocks", section: "reasoning", targetSec: 50 },
  "r-calendar": { title: "Calendars", section: "reasoning", targetSec: 50 },
  "r-odd": { title: "Analogies and odd one out", section: "reasoning", targetSec: 35 },
  "r-blood": { title: "Blood relations", section: "reasoning", targetSec: 45 },
  "r-syllogism": { title: "Syllogisms", section: "reasoning", targetSec: 50 },
  "v-synonyms": { title: "Synonyms", section: "verbal", targetSec: 20 },
  "v-antonyms": { title: "Antonyms", section: "verbal", targetSec: 20 },
  "v-grammar": { title: "Grammar and error spotting", section: "verbal", targetSec: 35 },
  "v-idioms": { title: "Idioms and phrases", section: "verbal", targetSec: 20 },
  "v-onesub": { title: "One-word substitution", section: "verbal", targetSec: 20 },
  "v-sentence": { title: "Sentence completion", section: "verbal", targetSec: 30 },
  "v-rc": { title: "Reading comprehension", section: "verbal", targetSec: 60 },
} satisfies Record<string, TopicInfo>;

export type TopicId = keyof typeof TOPIC_INFO;
export const topicInfo = (id: string): TopicInfo | undefined => (TOPIC_INFO as Record<string, TopicInfo>)[id];

// ------------------------------------------------------------------ tracks

export interface TrackTopic { id: string; min: Level; max: Level }
export interface MockBlueprint { title: string; minutes: number; sections: { section: Section; count: number }[] }

export interface AptTrack {
  id: "a1" | "a2" | "a3" | "a4";
  title: string;
  level: string;
  /** Exams this practice is in the style of. */
  forExams: string;
  topics: TrackTopic[];
  mock: MockBlueprint;
}

const tt = (spec: string): TrackTopic[] => spec.split(/\s+/).filter(Boolean).map((s) => {
  const [id, range] = s.split(":");
  return { id, min: Number(range[0]) as Level, max: Number(range[2]) as Level };
});

export const APT_TRACKS: AptTrack[] = [
  {
    id: "a1", title: "Think Sharp", level: "Class 6–8", forExams: "Olympiads, NMMS mental ability and school reasoning tests",
    topics: tt("q-arith:1-2 q-numbers:1-1 q-fractions:1-2 q-percent:1-1 q-ratio:1-1 q-average:1-1 q-mensuration:1-2 r-series:1-2 r-letters:1-2 r-coding:1-2 r-direction:1-2 r-ranking:1-2 r-odd:1-2 r-blood:1-1 r-calendar:1-1 v-synonyms:1-1 v-antonyms:1-1 v-grammar:1-1 v-idioms:1-1 v-onesub:1-1"),
    mock: { title: "Mental ability test", minutes: 20, sections: [{ section: "reasoning", count: 10 }, { section: "quant", count: 6 }, { section: "verbal", count: 4 }] },
  },
  {
    id: "a2", title: "Sharpen Up", level: "Class 9–10", forExams: "NMMS and NTSE-style mental ability, Olympiads and school aptitude tests",
    topics: tt("q-arith:1-3 q-numbers:1-2 q-fractions:1-3 q-percent:1-2 q-ratio:1-2 q-average:1-2 q-profit:1-2 q-interest:1-2 q-speed:1-2 q-ages:1-2 q-timework:1-1 q-mensuration:1-3 q-probability:1-1 r-series:1-3 r-letters:1-3 r-coding:1-3 r-direction:1-2 r-ranking:1-3 r-clock:1-2 r-calendar:1-2 r-odd:1-3 r-blood:1-2 v-synonyms:1-2 v-antonyms:1-2 v-grammar:1-2 v-idioms:1-2 v-onesub:1-2 v-sentence:1-2 v-rc:2-2"),
    mock: { title: "Mental ability and aptitude test", minutes: 30, sections: [{ section: "reasoning", count: 12 }, { section: "quant", count: 12 }, { section: "verbal", count: 6 }] },
  },
  {
    id: "a3", title: "Entrance Ready", level: "Class 11–12", forExams: "CUET General Test, IPMAT/BBA, hotel management and other entrance aptitude sections",
    topics: tt("q-arith:1-3 q-numbers:1-3 q-percent:1-3 q-ratio:1-3 q-average:1-3 q-profit:1-3 q-interest:1-3 q-timework:1-3 q-speed:1-3 q-ages:1-3 q-mensuration:1-3 q-mixture:1-2 q-probability:1-3 q-pnc:1-2 di-table:1-2 r-series:1-3 r-letters:1-3 r-coding:1-3 r-direction:1-3 r-ranking:1-3 r-clock:1-3 r-calendar:1-3 r-odd:1-3 r-blood:1-3 r-syllogism:1-3 v-synonyms:1-3 v-antonyms:1-3 v-grammar:1-3 v-idioms:1-3 v-onesub:1-3 v-sentence:1-3 v-rc:2-3"),
    mock: { title: "Entrance aptitude test", minutes: 35, sections: [{ section: "quant", count: 10 }, { section: "reasoning", count: 10 }, { section: "verbal", count: 6 }, { section: "di", count: 4 }] },
  },
  {
    id: "a4", title: "Placement Ready", level: "College and working professionals", forExams: "campus placement tests (TCS NQT, Infosys, Wipro, Accenture, AMCAT-style), bank and government exam aptitude",
    topics: tt("q-arith:2-3 q-numbers:1-3 q-percent:1-3 q-ratio:1-3 q-average:1-3 q-profit:1-3 q-interest:1-3 q-timework:1-3 q-speed:1-3 q-ages:1-3 q-mensuration:1-3 q-mixture:1-3 q-probability:1-3 q-pnc:1-3 di-table:1-3 r-series:1-3 r-letters:1-3 r-coding:1-3 r-direction:1-3 r-ranking:1-3 r-clock:1-3 r-calendar:1-3 r-odd:1-3 r-blood:1-3 r-syllogism:1-3 v-synonyms:2-3 v-antonyms:2-3 v-grammar:1-3 v-idioms:1-3 v-onesub:1-3 v-sentence:1-3 v-rc:2-3"),
    mock: { title: "Placement aptitude test", minutes: 35, sections: [{ section: "quant", count: 10 }, { section: "reasoning", count: 10 }, { section: "verbal", count: 6 }, { section: "di", count: 4 }] },
  },
];

export const aptTrackById = (id?: string | null) => APT_TRACKS.find((t) => t.id === id);

/** A student's own track from their registration category - the same class bands as the Communication Lab (no category = college). */
export function aptTrackFor(category?: string | null): AptTrack {
  return APT_TRACKS[Number(trackIdFor(category).slice(1)) - 1];
}

/** How many mock tests each track has with fixed questions (and a "surprise" one besides). */
export const MOCKS_PER_TRACK = 3;

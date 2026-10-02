/**
 * Situation Navigator decision tree - pure data walked entirely on the
 * client (see components/legal/Navigator.tsx). Answers never leave the
 * device: this file has no Firestore import and no "use client" directive
 * because it needs neither - it's just a lookup table.
 *
 * Safety-first by construction: "start" is always the danger check, and
 * every path that answers "Yes" goes straight to "sos" before anything
 * else - never buried behind other questions.
 */

export type NavNode =
  | { kind: "question"; id: string; text: string; options: { label: string; next: string }[] }
  | { kind: "sos" }
  | { kind: "guide"; slug: string };

export const tree: Record<string, NavNode> = {
  start: {
    kind: "question", id: "start", text: "Are you in danger right now?",
    options: [{ label: "Yes", next: "sos" }, { label: "No", next: "area" }],
  },
  sos: { kind: "sos" },
  area: {
    kind: "question", id: "area", text: "What is it about?",
    options: [
      { label: "Something online", next: "online" },
      { label: "Safety or an unsafe situation", next: "safety" },
      { label: "Police, arrest or a legal notice", next: "police" },
    ],
  },
  online: {
    kind: "question", id: "online", text: "What happened?",
    options: [
      { label: "I lost money to a scam", next: "g-online-fraud" },
      { label: "Someone is harassing or bullying me online", next: "g-cyberbullying" },
    ],
  },
  safety: {
    kind: "question", id: "safety", text: "What's going on?",
    options: [
      { label: "Someone touched me in a way that felt wrong, or I'm worried about a child", next: "g-safe-touch" },
      { label: "I don't feel safe in a public place or while travelling", next: "g-public-safety" },
    ],
  },
  police: {
    kind: "question", id: "police", text: "What's happening?",
    options: [
      { label: "Police want to question me or someone I know, or an arrest is happening", next: "g-police-rights" },
      { label: "I want to understand my rights in general", next: "g-police-rights" },
    ],
  },
  "g-online-fraud": { kind: "guide", slug: "online-fraud" },
  "g-cyberbullying": { kind: "guide", slug: "cyberbullying" },
  "g-safe-touch": { kind: "guide", slug: "safe-unsafe-touch" },
  "g-public-safety": { kind: "guide", slug: "public-safety" },
  "g-police-rights": { kind: "guide", slug: "police-rights" },
};

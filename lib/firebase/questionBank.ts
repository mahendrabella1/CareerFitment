import { getFirestore } from "./admin";

// Firestore stores the whole question bank as one document per source (8 docs
// in the `question_banks` collection), each holding that source's questions
// nested by age group and sub-trait. This keeps reads cheap (a handful of docs,
// cached in memory) versus one doc per question (8,232 reads/session).
//
// Doc shape: question_banks/{Source} = { ageGroups: { [ageGroup]: { [subTrait]: Q[] } } }

type ExtractedQuestion = {
  text: string;
  type: string;
  options: string[] | null;
  answer: string | null;
};

export type FirestoreBank = Record<
  string,
  Record<string, Record<string, ExtractedQuestion[]>>
>;

const COLLECTION = "question_banks";

let cache: FirestoreBank | null = null;

/** Fetch and assemble the full bank from Firestore (cached after first load). */
export async function getFirestoreBank(): Promise<FirestoreBank> {
  if (cache) return cache;
  const db = await getFirestore();
  const snap = await db.collection(COLLECTION).get();
  const bank: FirestoreBank = {};
  for (const doc of snap.docs) {
    const data = doc.data() as { ageGroups?: FirestoreBank[string] };
    bank[doc.id] = data.ageGroups ?? {};
  }
  cache = bank;
  return bank;
}

export function clearFirestoreBankCache(): void {
  cache = null;
}

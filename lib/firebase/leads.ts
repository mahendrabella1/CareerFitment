import { randomUUID } from "crypto";
import { getFirestore } from "./admin";

// Lead is the canonical captured-user record. Defined here (not in the local
// service) so both the Firestore and local-JSON stores share one shape.
export type Lead = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  city: string | null;
  age: string | null;
  journeyCode: string;
  journeyName: string;
  ageGroup: string;
  stage: string | null;
  dreamCareer: string | null;
  sessionId: string | null;
  status: "started" | "completed";
  topCareer: string | null;
  createdAt: string;
  completedAt: string | null;
};

const COLLECTION = "leads";

export async function fsCreateLead(
  lead: Omit<Lead, "id"> & { id?: string }
): Promise<Lead> {
  const db = await getFirestore();
  const id = lead.id ?? `lead-${randomUUID()}`;
  const record: Lead = { ...lead, id };
  await db.collection(COLLECTION).doc(id).set(record);
  return record;
}
export async function fsAttachSession(
  leadId: string,
  sessionId: string
): Promise<void> {
  const db = await getFirestore();
  await db.collection(COLLECTION).doc(leadId).set({ sessionId }, { merge: true });
}

export async function fsCompleteLead(
  leadId: string,
  topCareer: string | null
): Promise<void> {
  const db = await getFirestore();
  await db.collection(COLLECTION).doc(leadId).set(
    {
      status: "completed",
      topCareer,
      completedAt: new Date().toISOString(),
    },
    { merge: true }
  );
}

export async function fsListLeads(): Promise<Lead[]> {
  const db = await getFirestore();
  const snap = await db
    .collection(COLLECTION)
    .orderBy("createdAt", "desc")
    .get();
  return snap.docs.map((d) => d.data() as Lead);
}

export async function fsGetLeadBySession(sessionId: string): Promise<Lead | null> {
  const db = await getFirestore();
  const snap = await db
    .collection(COLLECTION)
    .where("sessionId", "==", sessionId)
    .limit(1)
    .get();
  return snap.empty ? null : (snap.docs[0].data() as Lead);
}

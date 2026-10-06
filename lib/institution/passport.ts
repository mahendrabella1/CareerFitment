/** Career Passport milestones - shared by the student, institution and public routes. */

export type MilestoneKind = "project" | "certificate" | "internship" | "competition" | "course" | "volunteering" | "other";
export type MilestoneStatus = "pending" | "verified" | "rejected";

export interface Milestone {
  id: string;
  uid: string;
  /** The student's institution when they added it (who verifies it); null if none. */
  institutionId: string | null;
  title: string;
  kind: MilestoneKind;
  /** Link to the proof (project, certificate, photo, repository). */
  evidenceUrl: string;
  /** When it happened (YYYY-MM-DD). */
  date: string;
  note: string;
  status: MilestoneStatus;
  reviewNote?: string;
  reviewedBy?: string;
  reviewedAt?: number;
  createdAt: number;
}

export const MILESTONE_KINDS: { key: MilestoneKind; label: string }[] = [
  { key: "project", label: "Project" },
  { key: "certificate", label: "Certificate" },
  { key: "internship", label: "Internship" },
  { key: "competition", label: "Competition / olympiad" },
  { key: "course", label: "Course completed" },
  { key: "volunteering", label: "Volunteering" },
  { key: "other", label: "Other achievement" },
];

export const KIND_LABEL: Record<string, string> = Object.fromEntries(MILESTONE_KINDS.map((k) => [k.key, k.label]));

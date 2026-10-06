/**
 * Institution portal data - shared by the server routes (app/api/institution,
 * app/api/admin/institutions, app/api/student/messages) and the screens.
 *
 * Firestore collections, all read and written ONLY through those server
 * routes with the Admin SDK (nothing here is readable from a browser by
 * guessing a collection name - the default-deny rule covers them):
 *
 *   institutions/{id}           a school or college: its name and the other
 *                                spellings students have typed for it
 *   institutionAccounts/{uid}   a login for one institution (Firebase Auth
 *                                user created by an admin)
 *   institutionMessages/{id}    a message, reminder or alert sent to students
 *   parentLinks/{token}         a parent's survey link for one student
 *   parentSurveys/{uid}         what the parents want for their child
 *   milestones/{id}             a Career Passport milestone and its review
 *   passports/{id}              a student's public Career Passport link
 *   opportunities/{id}          an opportunity targeted at matching students
 *   mentorPairs/{id}            a senior matched to mentor a junior
 *   observations/{inst}_{uid}   teachers' ratings of a student's traits
 *   voiceCalls/{id}             automated calls to parents
 *
 * A student belongs to an institution when their profile's `institution`
 * (set by the school's registration link, typed at sign-up, or assigned by an
 * admin on the Users page) matches the institution's name or one of its
 * aliases, ignoring spacing and capitals.
 */
import type { AssessmentQuality } from "@/lib/assessmentQuality";

export interface Institution {
  id: string;
  name: string;
  /** Other exact spellings in students' profiles that mean this institution. */
  aliases: string[];
  contactName?: string;
  contactEmail?: string;
  contactPhone?: string;
  createdAt: number;
  createdBy: string;
}

export interface InstitutionAccount {
  uid: string;
  institutionId: string;
  username: string;
  displayName: string;
  active: boolean;
  createdAt: number;
  createdBy: string;
  lastLoginAt?: number;
}

export type MessageKind = "message" | "reminder" | "alert" | "recommendation";

export interface MessageAudience {
  type: "all" | "classes" | "students";
  /** Registration categories ("class_10", "graduate", ...) when type is "classes". */
  classes?: string[];
  /** Human-readable summary shown in the history ("All students", "Class 10", "3 students"). */
  label: string;
}

export interface InstitutionMessage {
  id: string;
  institutionId: string;
  institutionName: string;
  kind: MessageKind;
  title: string;
  body: string;
  /** Optional link inside the app the message points to ("/account/exams"). */
  link?: string;
  audience: MessageAudience;
  recipients: string[];
  /** uid -> when they opened it (epoch ms). */
  readBy: Record<string, number>;
  /** uid -> when they followed its button (epoch ms). */
  clickedBy?: Record<string, number>;
  /** An outside link (opportunities: the olympiad's or hackathon's page). */
  externalUrl?: string;
  /** Set when the message announces an opportunity (opportunities/{id}). */
  opportunityId?: string;
  sentBy: string;
  sentByName: string;
  createdAt: number;
  /** How many recipients were also emailed. */
  emailed?: number;
}

/** What a student sees in their inbox. */
export interface StudentInboxMessage {
  id: string;
  kind: MessageKind;
  title: string;
  body: string;
  link?: string;
  from: string;
  createdAt: number;
  read: boolean;
  externalUrl?: string;
  opportunityId?: string;
  /** For an opportunity: whether the student said they applied. */
  applied?: boolean;
}

export type OpportunityType = "olympiad" | "hackathon" | "competition" | "workshop" | "internship" | "scholarship" | "event";

export interface Opportunity {
  id: string;
  institutionId: string;
  title: string;
  type: OpportunityType;
  description: string;
  url: string;
  deadline: string;
  classes: string[];
  areas: string[];
  recipients: string[];
  applied: Record<string, number>;
  /** uid -> what happened ("participated", "shortlisted", "won"). */
  outcomes: Record<string, string>;
  messageId: string;
  createdAt: number;
  createdBy: string;
}

/** One student as the institution sees them in lists (no answers, no report body). */
export interface StudentRow {
  uid: string;
  name: string;
  email: string;
  phone: string;
  category: string;
  city: string;
  createdAt: number | null;
  archived: boolean;
  assessment: {
    status: "completed" | "in_progress" | "not_started";
    completedAt: number | null;
    /** Best-fit career/field, as the student's own report ranks it. */
    topFit: string | null;
    topFits: string[];
    fitPct: number | null;
    desiredCareer: string | null;
    /** Names of the test's top strengths / intelligences (for the teacher check). */
    strengths: string[];
    /** How much the result can be trusted (lib/assessmentQuality.ts); null for older reports. */
    quality: AssessmentQuality | null;
  };
  activity: {
    totalSec: number;
    byFeature: Record<string, number>;
    /** Only the last 60 days ("dYYYYMMDD" -> seconds). */
    byDay: Record<string, number>;
    lastActiveAt: number | null;
    lastFeature: string | null;
  };
  courses: Record<string, { done: number; total: number }>;
  goals: { done: number; total: number } | null;
  /** Legal "What would you do?" practice: counts only. */
  legal: { done: number; safest: number; byArea: Record<string, { done: number; safest: number }> } | null;
}

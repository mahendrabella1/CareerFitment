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
 *
 * A student belongs to an institution when their profile's `institution`
 * (set by the school's registration link, typed at sign-up, or assigned by an
 * admin on the Users page) equals the institution's name or one of its
 * aliases.
 */

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
}

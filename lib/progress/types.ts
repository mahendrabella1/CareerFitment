/**
 * What a student's own account records about their progress and time spent,
 * stored on their `users/{uid}` document (which only they and admins can
 * read directly; their institution sees it through the server routes under
 * app/api/institution). Times are epoch milliseconds.
 */

/** Lessons marked complete in one feature course (Legal, Money, Exams...). */
export interface CourseProgress {
  done: string[];
  total: number;
  updatedAt: number;
}

/** The dashboard's 30/90-day goal checklist, for one assessment result. */
export interface GoalProgress {
  /** The assessment the checklist was built from (its completedAt). */
  key: string;
  done: Record<string, boolean>;
  total: number;
  updatedAt: number;
}

export interface StudentProgress {
  courses?: Record<string, CourseProgress>;
  goals?: GoalProgress;
}

/**
 * Active time in the app, counted only while the tab is visible and the
 * student has interacted in the last few minutes. `byDay` is keyed
 * "dYYYYMMDD" (a Firestore field name cannot start with a digit in every
 * SDK); `byFeature` by the area of the app (see lib/progress/activity.ts).
 */
export interface StudentActivity {
  totalSec?: number;
  byFeature?: Record<string, number>;
  byDay?: Record<string, number>;
  lastActiveAt?: number;
  lastFeature?: string;
}

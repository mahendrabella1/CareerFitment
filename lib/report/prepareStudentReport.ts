/**
 * Turns a student's saved `latestAssessment` into what FullReport renders -
 * the per-class adaptation Dashboard.tsx/DashboardMobile.tsx do: `a` is the
 * raw document, not the AssessmentSummary shape FullReport expects. Without
 * running it through the matching class-specific adapter (and, for 11-12 and
 * Graduates, building their extra sheets), every dimension reads as 0% and
 * those sections never appear.
 *
 * Used by every screen that shows someone else's report: the admin's
 * /admin/report/[uid] and the institution portal's student report.
 */
import type { ReactNode } from "react";
import type { AssessmentSummary } from "@/lib/auth/AuthProvider";
import { adaptClass11ToSummary, isCurrentClass11Shape } from "@/lib/report/adaptClass11";
import { buildClass11ExtraSheets } from "@/lib/report/class11ExtraSheets";
import { buildCareerFit1112Sheets } from "@/lib/report/careerFit1112Sheets";
import { adaptGraduateToSummary, isCurrentGraduateShape } from "@/lib/report/adaptGraduate";
import { buildCareerFitGradSheets } from "@/lib/report/careerFitGradSheets";
import { buildGradExtraSheets } from "@/lib/report/gradExtraSheets";
import {
  adaptClass6ToSummary, adaptClass7ToSummary, adaptClass8ToSummary,
  isCurrentClass6Shape, isCurrentClass7Shape, isCurrentClass8Shape,
} from "@/lib/report/adaptClass678";

export interface PreparedReport {
  summary: AssessmentSummary;
  extraSheets: { id: string; kicker: string; node: ReactNode }[];
  /** 11-12 and Graduates draw their own career-fit sections. */
  hideCareerFitSections: boolean;
  /** Saved by an earlier version of the assessment - cannot be rendered with today's scoring. */
  stale: boolean;
}

export function prepareStudentReport(a: AssessmentSummary): PreparedReport {
  const journeyCode = a.journeyCode || "";
  const isClass6 = journeyCode === "6";
  const isClass7 = journeyCode === "7";
  const isClass8 = journeyCode === "8";
  const isClass1112 = journeyCode === "11" || journeyCode === "12" || journeyCode === "11-12";

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const raw = a as any;
  const class11Output = raw.class11Output;
  const class11Ready = isClass1112 && isCurrentClass11Shape(class11Output);
  const class11Stale = isClass1112 && !!class11Output && !class11Ready;

  const isGraduate = journeyCode === "grad";
  const graduateOutput = raw.graduateOutput;
  const graduateReady = isGraduate && isCurrentGraduateShape(graduateOutput);
  const graduateStale = isGraduate && !!graduateOutput && !graduateReady;

  const class6Output = raw.class6Output;
  const class7Output = raw.class7Output;
  const class8Output = raw.class8Output;
  const class6Ready = isClass6 && isCurrentClass6Shape(class6Output);
  const class7Ready = isClass7 && isCurrentClass7Shape(class7Output);
  const class8Ready = isClass8 && isCurrentClass8Shape(class8Output);
  const class678Stale =
    (isClass6 && !!class6Output && !class6Ready) ||
    (isClass7 && !!class7Output && !class7Ready) ||
    (isClass8 && !!class8Output && !class8Ready);

  let summary = a;
  let extraSheets: PreparedReport["extraSheets"] = [];
  if (class11Ready) {
    summary = adaptClass11ToSummary(class11Output, a);
    const c1112Category = journeyCode === "11" ? "class_11" : journeyCode === "12" ? "class_12" : "class_11_12";
    extraSheets = [...buildCareerFit1112Sheets(class11Output, c1112Category), ...buildClass11ExtraSheets(class11Output)];
  } else if (graduateReady) {
    summary = adaptGraduateToSummary(graduateOutput, a);
    extraSheets = [...buildCareerFitGradSheets(graduateOutput), ...buildGradExtraSheets(graduateOutput)];
  } else if (class6Ready) {
    summary = adaptClass6ToSummary(class6Output, a);
  } else if (class7Ready) {
    summary = adaptClass7ToSummary(class7Output, a);
  } else if (class8Ready) {
    summary = adaptClass8ToSummary(class8Output, a);
  }

  return {
    summary,
    extraSheets,
    hideCareerFitSections: class11Ready || graduateReady,
    stale: class11Stale || class678Stale || graduateStale,
  };
}

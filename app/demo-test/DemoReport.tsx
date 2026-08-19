"use client";

/**
 * /demo-test report, shown immediately after the paper.
 *
 * It is the SAME report a class 9-10 student gets - the full dashboard, the
 * eight dimensions, best-fit fields, how you think, the plan, and the in-depth
 * FullReport one click away - with the demo's two extra sections injected.
 *
 * Both the sections and the dashboard are reused rather than rebuilt, so this
 * file is only the join between them. /account renders exactly the same pair
 * from the saved profile; see reportSections.tsx.
 */

import Dashboard from "@/app/account/Dashboard";
import { demoExtraSections, type DemoReportExtras } from "@/app/demo-test/reportSections";
import type { AssessmentSummary, UserProfile } from "@/lib/auth/AuthProvider";

export type { DemoReportExtras };

export interface DemoReportData extends DemoReportExtras {
  summary: AssessmentSummary;
}

export default function DemoReport({ data, profile, email, onExit }: {
  data: DemoReportData;
  profile?: UserProfile | null;
  email?: string | null;
  onExit?: () => void;
}) {
  return (
    <Dashboard
      a={data.summary}
      profile={profile}
      email={email}
      onSignOut={onExit}
      extraSections={demoExtraSections(data)}
    />
  );
}

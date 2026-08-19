"use client";

/**
 * /demo-test — the class 11-12 demo assessment.
 *
 * Separate from the paid flow on purpose. It has its own question bank (the
 * client's 2026 workbook, stage "11-12-demo"), its own stream-to-career
 * mapping, its own report, and no payment gate. The live exam at "/" is
 * untouched by all of it.
 *
 * Three phases, held here rather than in the URL so a student cannot land
 * mid-exam by pasting a link and skip the intake:
 *
 *   intake -> the class, stream, desired career and details
 *   exam   -> the same exam engine the paid paper uses, pointed at the demo
 *             bank and at the demo scoring endpoint
 *   report -> wanted-vs-found, then the roadmaps
 */

import { useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { useAuth } from "@/lib/auth/AuthProvider";
import DemoIntake, { type IntakeResult } from "@/app/demo-test/DemoIntake";
import type { DemoReportData } from "@/app/demo-test/DemoReport";

// The exam engine and the report are both large and neither can appear until
// the student has finished the intake, so they stay out of the first download.
const NewExam = dynamic(() => import("@/app/NewExam"), { ssr: false, loading: () => <Spinner /> });
const DemoReport = dynamic(() => import("@/app/demo-test/DemoReport"), { ssr: false, loading: () => <Spinner /> });

function Spinner() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f7f7f8" }}>
      <div style={{ width: 38, height: 38, borderRadius: "50%", border: "3px solid #e4e4ea", borderTopColor: "#2f3f9e", animation: "ogSpin .8s linear infinite" }} />
      <style dangerouslySetInnerHTML={{ __html: "@keyframes ogSpin{to{transform:rotate(360deg)}}" }} />
    </div>
  );
}

export default function DemoTestPage() {
  const router = useRouter();
  const { profile, user } = useAuth();
  const [intake, setIntake] = useState<IntakeResult | null>(null);
  const [report, setReport] = useState<DemoReportData | null>(null);

  if (report) {
    return (
      <DemoReport
        data={report}
        profile={profile}
        email={profile?.email ?? user?.email ?? null}
        onExit={() => router.push("/account")}
      />
    );
  }

  if (intake) {
    return (
      <NewExam
        // Routes the generate call to the demo bank. See stageForCategory.
        category="class_11_12_demo"
        name={(profile?.name || "").trim().split(/\s+/)[0]}
        onExit={() => router.push("/account")}
        scoring={{
          url: "/api/demo-test/report",
          // The stream and the career the student named BEFORE the paper. Sent
          // with the answers because the comparison cannot be reconstructed
          // afterwards - the whole point is that the choice was made blind.
          extraBody: {
            combination: intake.combination,
            desiredCareerId: intake.careerId,
          },
          // The demo endpoint returns the summary nested alongside the
          // alignment and roadmaps; the profile only stores the summary.
          pickSummary: (d) => d.summary,
          // Never into `latestAssessment` when a paid report already exists.
          persist: "demo",
          // The comparison and roadmaps are saved too, so /account can show
          // the same report later instead of the plain dashboard.
          pickExtras: (d) => ({
            figures: d.figures ?? null,
            alignment: d.alignment ?? null,
            desiredCareer: d.desiredCareer,
            measuredCareer: d.measuredCareer ?? null,
            combination: d.combination,
          }),
          onResult: (d) => setReport(d as DemoReportData),
        }}
      />
    );
  }

  return <DemoIntake onDone={setIntake} />;
}

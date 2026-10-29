"use client";
/** /account/resume - the ATS-friendly resume builder (components/jobready/ResumeBuilder.tsx). */
import { JobReadyShell } from "@/components/jobready/JobReadyShell";
import { ResumeBuilder } from "@/components/jobready/ResumeBuilder";

export default function ResumePage() {
  return <JobReadyShell wide><ResumeBuilder /></JobReadyShell>;
}

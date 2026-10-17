"use client";

/**
 * /account/jobs - the job board inside the student dashboard: the public board
 * plus "On my path" (careers from the student's own report) and the
 * My jobs tracker (saved, applied, interview, offer, closed).
 */
import { JobBoard } from "@/components/jobs/JobBoard";

export default function AccountJobsPage() {
  return <JobBoard variant="account" />;
}

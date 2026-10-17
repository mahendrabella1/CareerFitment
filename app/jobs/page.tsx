/**
 * /jobs - the public job board (no sign-in needed to browse). Signed-in
 * students get the same board inside their dashboard at /account/jobs, with
 * "on my path" and the saved / applied tracker.
 *
 * No JobPosting structured data on purpose: some sources (Remotive) forbid
 * resubmitting their listings to Google Jobs and similar boards.
 */
import type { Metadata } from "next";
import { JobBoard } from "@/components/jobs/JobBoard";

export const metadata: Metadata = {
  title: "Jobs and internships | OneGrasp",
  description: "Internships and entry-level jobs, updated daily, each checked for scam warning signs. Apply on the employer's own site.",
};

export default function JobsPage() {
  return <JobBoard variant="public" />;
}

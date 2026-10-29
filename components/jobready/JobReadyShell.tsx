"use client";
/**
 * Resume & Interview (/account/resume, /account/interview/*): the shell with
 * its three tabs, and the signed-in POST helper the AI features use.
 */
import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { FEATURES } from "@/lib/features/catalog";
import { getFirebaseAuth } from "@/lib/firebase/client";
import { CoursePlayerShell } from "@/components/course/CoursePlayerShell";

const TABS = [
  { href: "/account/resume", label: "Resume builder" },
  { href: "/account/interview", label: "Interview questions" },
  { href: "/account/interview/practice", label: "Mock interview" },
];

export function JobReadyShell({ children, wide }: { children: ReactNode; wide?: boolean }) {
  const meta = FEATURES.jobready;
  const pathname = usePathname() ?? "";
  return (
    <CoursePlayerShell
      accent={meta.accent}
      banner={{ title: meta.title, icon: "doc", backHref: "/account", backLabel: "Dashboard" }}
      homeHref="/account/resume"
      tabs={TABS.map((t) => ({ ...t, active: pathname === t.href }))}
    >
      <div className={`fp${wide ? " jr-wide" : ""}`} style={{ ["--accent" as string]: meta.accent }}>{children}</div>
    </CoursePlayerShell>
  );
}

/** POST to one of the signed-in AI routes; throws with the server's message. */
export async function authedPost<T>(url: string, body: FormData | Record<string, unknown>): Promise<T> {
  const token = await getFirebaseAuth()?.currentUser?.getIdToken();
  if (!token) throw new Error("Please sign in again.");
  const form = body instanceof FormData;
  const res = await fetch(url, {
    method: "POST",
    headers: form ? { Authorization: `Bearer ${token}` } : { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: form ? body : JSON.stringify(body),
  });
  const data = (await res.json().catch(() => ({}))) as T & { error?: string };
  if (!res.ok) throw new Error(data.error || "That didn't work - please try again.");
  return data;
}

"use client";

/**
 * Counts a signed-in student's active time in the app, by area and by day,
 * on their own `users/{uid}` document (field `activity`, see
 * lib/progress/types.ts). Their institution reads it to see how much time
 * each student spends and where.
 *
 * Time only counts while the tab is visible AND the student has touched,
 * typed, scrolled or moved the mouse in the last few minutes - an open tab
 * left alone overnight adds nothing. Counted seconds are sent once a minute
 * (and when the tab is hidden or closed) as atomic increments, so two open
 * tabs or devices add up rather than overwrite each other.
 *
 * Only students are tracked: an admin or institution login has no student
 * profile, and their own pages are skipped anyway.
 */
import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { doc, increment, updateDoc } from "firebase/firestore";
import { getDb } from "@/lib/firebase/client";
import { useAuth } from "@/lib/auth/AuthProvider";
import { areaForPath, dayKey } from "@/lib/progress/activity";

const TICK_SEC = 5;
const IDLE_MS = 3 * 60 * 1000;
const FLUSH_MS = 60 * 1000;
const UNTRACKED = ["/admin", "/institution", "/signin", "/register"];

export function ActivityTracker() {
  const { user, profile } = useAuth();
  const pathname = usePathname() ?? "/";
  const pathRef = useRef(pathname);
  useEffect(() => { pathRef.current = pathname; }, [pathname]);
  const uid = user && profile ? user.uid : null;

  useEffect(() => {
    const db = getDb();
    if (!uid || !db) return;
    let lastInput = Date.now();
    let pending: Record<string, number> = {};
    let lastArea = "";

    const onInput = () => { lastInput = Date.now(); };
    const inputs = ["pointerdown", "pointermove", "keydown", "scroll", "touchstart", "wheel"] as const;
    inputs.forEach((e) => window.addEventListener(e, onInput, { passive: true }));

    const tick = window.setInterval(() => {
      const path = pathRef.current;
      if (document.visibilityState !== "visible" || Date.now() - lastInput > IDLE_MS) return;
      if (UNTRACKED.some((p) => path === p || path.startsWith(`${p}/`))) return;
      const area = areaForPath(path);
      pending[area] = (pending[area] ?? 0) + TICK_SEC;
      lastArea = area;
    }, TICK_SEC * 1000);

    const flush = () => {
      const entries = Object.entries(pending);
      const total = entries.reduce((s, [, n]) => s + n, 0);
      if (!total) return;
      pending = {};
      const patch: Record<string, unknown> = {
        "activity.totalSec": increment(total),
        [`activity.byDay.${dayKey()}`]: increment(total),
        "activity.lastActiveAt": Date.now(),
        "activity.lastFeature": lastArea,
      };
      for (const [area, n] of entries) {
        patch[`activity.byFeature.${area}`] = increment(n);
        // When each area was last used - lets a school see whether a message
        // pointing to it was acted on.
        patch[`activity.lastByFeature.${area}`] = Date.now();
      }
      updateDoc(doc(db, "users", uid), patch).catch(() => {
        // Offline or blocked: this minute is lost rather than double-counted later.
      });
    };
    const flushTimer = window.setInterval(flush, FLUSH_MS);
    const onHide = () => { if (document.visibilityState === "hidden") flush(); };
    document.addEventListener("visibilitychange", onHide);
    window.addEventListener("pagehide", flush);

    return () => {
      flush();
      window.clearInterval(tick);
      window.clearInterval(flushTimer);
      inputs.forEach((e) => window.removeEventListener(e, onInput));
      document.removeEventListener("visibilitychange", onHide);
      window.removeEventListener("pagehide", flush);
    };
  }, [uid]);

  return null;
}

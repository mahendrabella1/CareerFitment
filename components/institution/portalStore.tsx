"use client";

/**
 * Shared state for the institution portal (/institution): who is signed in,
 * their institution, and its students (loaded once, refreshed on demand) -
 * so moving between Overview, Students and Messages doesn't reload them.
 */
import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { apiFetch } from "@/lib/institution/client";
import type { StudentRow } from "@/lib/institution/types";

export interface PortalMe {
  account: { username: string; displayName: string };
  institution: { id: string; name: string; aliases: string[] };
}

interface PortalState {
  me: PortalMe;
  students: StudentRow[] | null;
  studentsError: string;
  loadedAt: number | null;
  reload: () => Promise<void>;
  logout: () => Promise<void>;
}

export type { PortalState };
export const PortalContext = createContext<PortalState | null>(null);
const Ctx = PortalContext;

export function PortalProvider({ me, logout, children }: { me: PortalMe; logout: () => Promise<void>; children: ReactNode }) {
  const [students, setStudents] = useState<StudentRow[] | null>(null);
  const [studentsError, setStudentsError] = useState("");
  const [loadedAt, setLoadedAt] = useState<number | null>(null);

  const reload = useCallback(async () => {
    setStudentsError("");
    try {
      const res = await apiFetch<{ students: StudentRow[]; generatedAt: number }>("/api/institution/students");
      setStudents(res.students.sort((a, b) => a.name.localeCompare(b.name)));
      setLoadedAt(res.generatedAt);
    } catch (e) {
      setStudentsError(e instanceof Error ? e.message : "Could not load students.");
      setStudents((s) => s ?? []);
    }
  }, []);

  useEffect(() => { void reload(); }, [reload]);

  return <Ctx.Provider value={{ me, students, studentsError, loadedAt, reload, logout }}>{children}</Ctx.Provider>;
}

export function usePortal(): PortalState {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("usePortal must be used inside the /institution layout");
  return ctx;
}

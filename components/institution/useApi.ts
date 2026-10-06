"use client";

import { useCallback, useEffect, useState } from "react";
import { apiFetch } from "@/lib/institution/client";

/** GET a portal route: { data, error, reload } - data null while loading. */
export function useApi<T>(path: string): { data: T | null; error: string; reload: () => Promise<void> } {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState("");
  const reload = useCallback(async () => {
    setError("");
    try {
      setData(await apiFetch<T>(path));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load.");
    }
  }, [path]);
  useEffect(() => { void reload(); }, [reload]);
  return { data, error, reload };
}

/** POST/PATCH/DELETE helper returning the route's JSON. */
export function send<T>(path: string, method: "POST" | "PATCH" | "DELETE", body?: unknown): Promise<T> {
  return apiFetch<T>(path, { method, ...(body !== undefined ? { body: JSON.stringify(body) } : {}) });
}

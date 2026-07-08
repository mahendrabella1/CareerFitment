"use client";

import { useEffect, useState } from "react";
import ReportView, { type ReportData } from "../ReportView";

type Envelope<T> = { success: boolean; message: string; data: T };

export default function ReportPage({ params }: { params: { sessionId: string } }) {
  const [data, setData] = useState<ReportData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`/api/report/${params.sessionId}`);
        const payload = (await res.json()) as Envelope<ReportData>;
        if (!res.ok || !payload.success) throw new Error(payload.message);
        if (!cancelled) setData(payload.data);
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : "Failed to load report");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [params.sessionId]);

  if (loading) {
    return (
      <main className="shell">
        <div className="rep-loading">
          <div className="rep-spinner" />
          <p>Loading your report…</p>
        </div>
      </main>
    );
  }

  if (error || !data) {
    return (
      <main className="shell">
        <div className="panel">
          <h2>Report not available</h2>
          <p className="muted">{error ?? "This report could not be found."}</p>
          <a className="og-btn-primary" href="/">
            Take the assessment
          </a>
        </div>
      </main>
    );
  }

  return (
    <main className="shell rep-shell">
      <ReportView data={data} />
    </main>
  );
}

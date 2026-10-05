"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { fetchPublicProfile, type ResearchProfileDoc } from "@/lib/research/clientProfile";
import { PublicProfileView } from "@/components/research/PublicProfileView";

/** Public research profile, linked from a learner's poster QR code. */
export default function PublicResearchProfilePage({ params }: { params: { slug: string } }) {
  const [profile, setProfile] = useState<ResearchProfileDoc | null | "error" | undefined>(undefined);

  useEffect(() => {
    fetchPublicProfile(params.slug).then(setProfile);
  }, [params.slug]);

  return (
    <main style={{ minHeight: "100vh", background: "#faf5ff", padding: "32px 16px" }}>
      <div style={{ maxWidth: 760, margin: "0 auto", background: "#fff", border: "1px solid #ede9fe", borderRadius: 20, padding: "24px 22px" }}>
        {profile === undefined && <p style={{ fontSize: 14, color: "#64748b" }}>Loading…</p>}
        {profile === "error" && <p style={{ fontSize: 14, color: "#64748b" }}>This profile could not be loaded right now. Please try again later.</p>}
        {profile === null && (
          <>
            <h1 style={{ fontSize: 22, fontWeight: 900, color: "#0f172a", margin: "0 0 8px" }}>Profile not found</h1>
            <p style={{ fontSize: 14, color: "#475569", margin: 0 }}>The learner may have made it private.</p>
          </>
        )}
        {profile && profile !== "error" && <PublicProfileView profile={profile} />}
        <div style={{ marginTop: 20, fontSize: 12.5 }}>
          <Link href="/" style={{ color: "#7c3aed", fontWeight: 800, textDecoration: "none" }}>OneGrasp</Link>
        </div>
      </div>
    </main>
  );
}

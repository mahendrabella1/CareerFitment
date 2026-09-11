"use client";

import { useState, useEffect } from "react";
import { Copy, Check, Eye, ToggleLeft, ToggleRight, Plus, BarChart3, Users, X } from "lucide-react";
import { getDb, getFirebaseAuth } from "@/lib/firebase/client";
import { collection, addDoc, query, where, getDocs, updateDoc, doc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import type { InstitutionalLink } from "@/lib/types/institutional";

interface StudentData {
  id: string;
  name: string;
  email: string;
  phone: string;
  class: string;
  registeredAt: string;
  completedAt?: string;
  reportSent: boolean;
}

const C = {
  primary: "#7C3AED",
  primaryDark: "#6D28D9",
  success: "#10B981",
  danger: "#EF4444",
  warning: "#F59E0B",
  gray50: "#F9FAFB",
  gray100: "#F3F4F6",
  gray200: "#E5E7EB",
  gray300: "#D1D5DB",
  gray600: "#4B5563",
  gray700: "#374151",
  gray800: "#1F2937",
  gray900: "#111827",
};

export default function InstitutionalLinksAdmin() {
  const [links, setLinks] = useState<InstitutionalLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedLink, setSelectedLink] = useState<InstitutionalLink | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"links" | "report">("links");
  const [reportStudents, setReportStudents] = useState<StudentData[]>([]);
  const [reportLoading, setReportLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const [formData, setFormData] = useState({
    schoolName: "",
    schoolEmail: "",
    schoolPhone: "",
    schoolCity: "",
    schoolState: "",
    contactPersonName: "",
    contactPersonEmail: "",
    contactPersonPhone: "",
    expiresAt: "",
    maxStudents: "",
    notes: "",
  });

  useEffect(() => {
    const auth = getFirebaseAuth();
    if (!auth) {
      setError("Firebase not configured");
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsAuthenticated(true);
        fetchLinks();
      } else {
        setError("You must be logged in to access this page");
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchLinks = async () => {
    try {
      setLoading(true);
      const db = getDb();
      if (!db) {
        setError("Firebase not configured");
        setLoading(false);
        return;
      }

      const snapshot = await getDocs(collection(db, "institutional_links"));
      const linksData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as InstitutionalLink[];

      setLinks(linksData);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error fetching links");
    } finally {
      setLoading(false);
    }
  };

  const generateLinkCode = () => {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `INST-${timestamp.toString().slice(-6)}-${random}`;
  };

  const handleCreateLink = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const db = getDb();
      if (!db) {
        setError("Firebase not configured");
        return;
      }

      const linkCode = generateLinkCode();
      const newLink: Omit<InstitutionalLink, "id"> = {
        code: linkCode,
        schoolName: formData.schoolName,
        schoolEmail: formData.schoolEmail,
        schoolPhone: formData.schoolPhone,
        schoolCity: formData.schoolCity,
        schoolState: formData.schoolState,
        status: "active",
        createdAt: new Date().toISOString(),
        expiresAt: formData.expiresAt ? new Date(formData.expiresAt).toISOString() : null,
        maxStudents: formData.maxStudents ? parseInt(formData.maxStudents) : undefined,
        usedCount: 0,
        contactPersonName: formData.contactPersonName,
        contactPersonEmail: formData.contactPersonEmail,
        contactPersonPhone: formData.contactPersonPhone,
        originalPrice: 5999,
        institutionPrice: 2999,
        notes: formData.notes,
      };

      const docRef = await addDoc(collection(db, "institutional_links"), newLink);
      setLinks([...links, { id: docRef.id, ...newLink }]);
      setShowCreateForm(false);
      setFormData({
        schoolName: "",
        schoolEmail: "",
        schoolPhone: "",
        schoolCity: "",
        schoolState: "",
        contactPersonName: "",
        contactPersonEmail: "",
        contactPersonPhone: "",
        expiresAt: "",
        maxStudents: "",
        notes: "",
      });
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error creating link");
    }
  };

  const handleToggleStatus = async (linkId: string, currentStatus: string) => {
    const newStatus = currentStatus === "active" ? "inactive" : "active";
    try {
      const db = getDb();
      if (!db) {
        setError("Firebase not configured");
        return;
      }

      await updateDoc(doc(db, "institutional_links", linkId), {
        status: newStatus,
      });

      setLinks(
        links.map((link) =>
          link.id === linkId ? { ...link, status: newStatus } : link
        )
      );
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error updating status");
    }
  };

  const viewLinkReport = async (link: InstitutionalLink) => {
    try {
      setReportLoading(true);
      setSelectedLink(link);
      setViewMode("report");

      const db = getDb();
      if (!db) {
        setError("Firebase not configured");
        setReportLoading(false);
        return;
      }

      const q = query(
        collection(db, "institutional_students"),
        where("linkId", "==", link.id)
      );
      const snapshot = await getDocs(q);

      const students = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          name: data.name || "",
          email: data.email || "",
          phone: data.phone || "",
          class: data.class || "",
          registeredAt: typeof data.registeredAt === "string" ? data.registeredAt : new Date(data.registeredAt).toISOString(),
          completedAt: data.completedAt ? (typeof data.completedAt === "string" ? data.completedAt : new Date(data.completedAt).toISOString()) : undefined,
          reportSent: data.reportSent || false,
        };
      }) as StudentData[];

      setReportStudents(students);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error fetching students");
    } finally {
      setReportLoading(false);
    }
  };

  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: C.gray50 }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ width: 40, height: 40, borderRadius: "50%", border: `3px solid ${C.gray200}`, borderTopColor: C.primary, margin: "0 auto 16px", animation: "spin 1s linear infinite" }} />
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          <p style={{ color: C.gray600 }}>Loading institutional links...</p>
        </div>
      </div>
    );
  }

  if (viewMode === "report" && selectedLink) {
    return (
      <div style={{ minHeight: "100vh", background: C.gray50, padding: "32px 20px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <button
            onClick={() => {
              setViewMode("links");
              setSelectedLink(null);
              setReportStudents([]);
            }}
            style={{
              background: "none",
              border: "none",
              color: C.primary,
              fontWeight: 600,
              cursor: "pointer",
              marginBottom: 24,
              fontSize: 14,
            }}
          >
            ← Back to Links
          </button>

          <div style={{ background: "white", borderRadius: 12, padding: 32, boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 32 }}>
              <BarChart3 size={32} color={C.primary} />
              <div>
                <h1 style={{ fontSize: 28, fontWeight: 800, margin: 0, color: C.gray900 }}>{selectedLink.schoolName}</h1>
                <p style={{ margin: 0, color: C.gray600, fontSize: 14 }}>Student Assessment Report</p>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, marginBottom: 32 }}>
              <div style={{ background: C.gray50, padding: 20, borderRadius: 8 }}>
                <p style={{ margin: 0, color: C.gray600, fontSize: 12, fontWeight: 600, marginBottom: 8 }}>TOTAL STUDENTS</p>
                <p style={{ margin: 0, fontSize: 32, fontWeight: 800, color: C.primary }}>{reportStudents.length}</p>
              </div>
              <div style={{ background: C.gray50, padding: 20, borderRadius: 8 }}>
                <p style={{ margin: 0, color: C.gray600, fontSize: 12, fontWeight: 600, marginBottom: 8 }}>COMPLETED</p>
                <p style={{ margin: 0, fontSize: 32, fontWeight: 800, color: C.success }}>{reportStudents.filter((s) => s.completedAt).length}</p>
              </div>
              <div style={{ background: C.gray50, padding: 20, borderRadius: 8 }}>
                <p style={{ margin: 0, color: C.gray600, fontSize: 12, fontWeight: 600, marginBottom: 8 }}>REPORTS SENT</p>
                <p style={{ margin: 0, fontSize: 32, fontWeight: 800, color: C.success }}>{reportStudents.filter((s) => s.reportSent).length}</p>
              </div>
              <div style={{ background: C.gray50, padding: 20, borderRadius: 8 }}>
                <p style={{ margin: 0, color: C.gray600, fontSize: 12, fontWeight: 600, marginBottom: 8 }}>COMPLETION RATE</p>
                <p style={{ margin: 0, fontSize: 32, fontWeight: 800, color: C.warning }}>
                  {Math.round((reportStudents.filter((s) => s.completedAt).length / reportStudents.length) * 100) || 0}%
                </p>
              </div>
            </div>

            <div style={{ marginTop: 24 }}>
              <h2 style={{ fontSize: 18, fontWeight: 700, margin: "0 0 16px 0", color: C.gray900 }}>Students</h2>
              {reportLoading ? (
                <p style={{ color: C.gray600 }}>Loading students...</p>
              ) : reportStudents.length === 0 ? (
                <p style={{ color: C.gray600 }}>No students registered yet.</p>
              ) : (
                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                      <tr style={{ borderBottom: `2px solid ${C.gray200}` }}>
                        <th style={{ textAlign: "left", padding: 12, fontWeight: 600, fontSize: 12, color: C.gray600, textTransform: "uppercase" }}>Name</th>
                        <th style={{ textAlign: "left", padding: 12, fontWeight: 600, fontSize: 12, color: C.gray600, textTransform: "uppercase" }}>Email</th>
                        <th style={{ textAlign: "left", padding: 12, fontWeight: 600, fontSize: 12, color: C.gray600, textTransform: "uppercase" }}>Class</th>
                        <th style={{ textAlign: "left", padding: 12, fontWeight: 600, fontSize: 12, color: C.gray600, textTransform: "uppercase" }}>Registered</th>
                        <th style={{ textAlign: "left", padding: 12, fontWeight: 600, fontSize: 12, color: C.gray600, textTransform: "uppercase" }}>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reportStudents.map((student) => (
                        <tr key={student.id} style={{ borderBottom: `1px solid ${C.gray100}` }}>
                          <td style={{ padding: 12, fontWeight: 500, color: C.gray900 }}>{student.name}</td>
                          <td style={{ padding: 12, color: C.gray600, fontSize: 13 }}>{student.email}</td>
                          <td style={{ padding: 12, color: C.gray600 }}>{student.class}</td>
                          <td style={{ padding: 12, color: C.gray600, fontSize: 13 }}>{new Date(student.registeredAt).toLocaleDateString()}</td>
                          <td style={{ padding: 12 }}>
                            <span
                              style={{
                                display: "inline-block",
                                padding: "4px 12px",
                                borderRadius: 20,
                                fontSize: 12,
                                fontWeight: 600,
                                background: student.reportSent ? C.success + "20" : student.completedAt ? "#3B82F6" + "20" : C.warning + "20",
                                color: student.reportSent ? C.success : student.completedAt ? "#3B82F6" : C.warning,
                              }}
                            >
                              {student.reportSent ? "✓ Sent" : student.completedAt ? "✓ Completed" : "In Progress"}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: C.gray50, padding: "32px 20px" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        {/* Header */}
        <div style={{ marginBottom: 32 }}>
          <h1 style={{ fontSize: 32, fontWeight: 800, margin: "0 0 8px 0", color: C.gray900 }}>🏫 Institutional Links</h1>
          <p style={{ margin: 0, color: C.gray600, fontSize: 15 }}>Create and manage institutional assessment links for schools</p>
        </div>

        {error && (
          <div style={{ background: "#FEE2E2", border: `1px solid ${C.danger}`, color: "#991B1B", padding: 12, borderRadius: 8, marginBottom: 16 }}>
            {error}
          </div>
        )}

        {/* Create Form */}
        {showCreateForm && (
          <div style={{ background: "white", borderRadius: 12, padding: 24, marginBottom: 24, boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h2 style={{ fontSize: 20, fontWeight: 700, margin: 0, color: C.gray900 }}>Create New Institutional Link</h2>
              <button onClick={() => setShowCreateForm(false)} style={{ background: "none", border: "none", cursor: "pointer" }}>
                <X size={20} color={C.gray600} />
              </button>
            </div>

            <form onSubmit={handleCreateLink}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: 16, marginBottom: 20 }}>
                <div>
                  <label style={{ display: "block", fontWeight: 600, marginBottom: 6, color: C.gray700, fontSize: 14 }}>School Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.schoolName}
                    onChange={(e) => setFormData({ ...formData, schoolName: e.target.value })}
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      border: `1px solid ${C.gray300}`,
                      borderRadius: 6,
                      fontSize: 14,
                      boxSizing: "border-box",
                    }}
                    placeholder="Enter school name"
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontWeight: 600, marginBottom: 6, color: C.gray700, fontSize: 14 }}>School Email *</label>
                  <input
                    type="email"
                    required
                    value={formData.schoolEmail}
                    onChange={(e) => setFormData({ ...formData, schoolEmail: e.target.value })}
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      border: `1px solid ${C.gray300}`,
                      borderRadius: 6,
                      fontSize: 14,
                      boxSizing: "border-box",
                    }}
                    placeholder="school@example.com"
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontWeight: 600, marginBottom: 6, color: C.gray700, fontSize: 14 }}>Contact Person Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.contactPersonName}
                    onChange={(e) => setFormData({ ...formData, contactPersonName: e.target.value })}
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      border: `1px solid ${C.gray300}`,
                      borderRadius: 6,
                      fontSize: 14,
                      boxSizing: "border-box",
                    }}
                    placeholder="Contact person name"
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontWeight: 600, marginBottom: 6, color: C.gray700, fontSize: 14 }}>Contact Email *</label>
                  <input
                    type="email"
                    required
                    value={formData.contactPersonEmail}
                    onChange={(e) => setFormData({ ...formData, contactPersonEmail: e.target.value })}
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      border: `1px solid ${C.gray300}`,
                      borderRadius: 6,
                      fontSize: 14,
                      boxSizing: "border-box",
                    }}
                    placeholder="contact@example.com"
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontWeight: 600, marginBottom: 6, color: C.gray700, fontSize: 14 }}>Expires At (Optional)</label>
                  <input
                    type="date"
                    value={formData.expiresAt}
                    onChange={(e) => setFormData({ ...formData, expiresAt: e.target.value })}
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      border: `1px solid ${C.gray300}`,
                      borderRadius: 6,
                      fontSize: 14,
                      boxSizing: "border-box",
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontWeight: 600, marginBottom: 6, color: C.gray700, fontSize: 14 }}>Max Students (Optional)</label>
                  <input
                    type="number"
                    value={formData.maxStudents}
                    onChange={(e) => setFormData({ ...formData, maxStudents: e.target.value })}
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      border: `1px solid ${C.gray300}`,
                      borderRadius: 6,
                      fontSize: 14,
                      boxSizing: "border-box",
                    }}
                    placeholder="No limit if empty"
                  />
                </div>
              </div>

              <div style={{ display: "flex", gap: 12 }}>
                <button
                  type="submit"
                  style={{
                    padding: "10px 24px",
                    background: C.primary,
                    color: "white",
                    border: "none",
                    borderRadius: 6,
                    fontWeight: 600,
                    cursor: "pointer",
                    fontSize: 14,
                  }}
                >
                  Create Link
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  style={{
                    padding: "10px 24px",
                    background: C.gray200,
                    color: C.gray800,
                    border: "none",
                    borderRadius: 6,
                    fontWeight: 600,
                    cursor: "pointer",
                    fontSize: 14,
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Links Table */}
        <div style={{ background: "white", borderRadius: 12, boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
          <div style={{ padding: 24, borderBottom: `1px solid ${C.gray200}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: C.gray900 }}>Your Links ({links.length})</h2>
            <button
              onClick={() => setShowCreateForm(true)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "10px 16px",
                background: C.primary,
                color: "white",
                border: "none",
                borderRadius: 6,
                fontWeight: 600,
                cursor: "pointer",
                fontSize: 14,
              }}
            >
              <Plus size={18} /> New Link
            </button>
          </div>

          {links.length === 0 ? (
            <div style={{ padding: 32, textAlign: "center", color: C.gray600 }}>
              <p>No institutional links created yet. Click "New Link" to get started.</p>
            </div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ borderBottom: `2px solid ${C.gray200}` }}>
                    <th style={{ textAlign: "left", padding: 16, fontWeight: 600, fontSize: 12, color: C.gray600, textTransform: "uppercase" }}>School</th>
                    <th style={{ textAlign: "left", padding: 16, fontWeight: 600, fontSize: 12, color: C.gray600, textTransform: "uppercase" }}>Link Code</th>
                    <th style={{ textAlign: "left", padding: 16, fontWeight: 600, fontSize: 12, color: C.gray600, textTransform: "uppercase" }}>Students</th>
                    <th style={{ textAlign: "left", padding: 16, fontWeight: 600, fontSize: 12, color: C.gray600, textTransform: "uppercase" }}>Status</th>
                    <th style={{ textAlign: "left", padding: 16, fontWeight: 600, fontSize: 12, color: C.gray600, textTransform: "uppercase" }}>Expires</th>
                    <th style={{ textAlign: "left", padding: 16, fontWeight: 600, fontSize: 12, color: C.gray600, textTransform: "uppercase" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {links.map((link) => (
                    <tr key={link.id} style={{ borderBottom: `1px solid ${C.gray100}` }}>
                      <td style={{ padding: 16, fontWeight: 500, color: C.gray900 }}>{link.schoolName}</td>
                      <td style={{ padding: 16 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <code style={{ background: C.gray100, padding: "4px 8px", borderRadius: 4, fontSize: 12, fontFamily: "monospace" }}>
                            {link.code}
                          </code>
                          <button
                            onClick={() => copyToClipboard(link.code)}
                            style={{ background: "none", border: "none", cursor: "pointer", color: C.gray600 }}
                          >
                            {copiedCode === link.code ? <Check size={16} color={C.success} /> : <Copy size={16} />}
                          </button>
                        </div>
                      </td>
                      <td style={{ padding: 16, color: C.gray700 }}>{link.usedCount}/{link.maxStudents || "∞"}</td>
                      <td style={{ padding: 16 }}>
                        <span
                          style={{
                            display: "inline-block",
                            padding: "4px 12px",
                            borderRadius: 20,
                            fontSize: 12,
                            fontWeight: 600,
                            background: link.status === "active" ? C.success + "20" : C.danger + "20",
                            color: link.status === "active" ? C.success : C.danger,
                          }}
                        >
                          {link.status === "active" ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td style={{ padding: 16, color: C.gray600, fontSize: 13 }}>
                        {link.expiresAt ? new Date(link.expiresAt).toLocaleDateString() : "Never"}
                      </td>
                      <td style={{ padding: 16 }}>
                        <div style={{ display: "flex", gap: 8 }}>
                          <button
                            onClick={() => viewLinkReport(link)}
                            style={{ background: "none", border: "none", cursor: "pointer", color: C.primary, padding: 4 }}
                            title="View report"
                          >
                            <BarChart3 size={18} />
                          </button>
                          <button
                            onClick={() => handleToggleStatus(link.id, link.status)}
                            style={{
                              background: "none",
                              border: "none",
                              cursor: "pointer",
                              color: link.status === "active" ? C.warning : C.success,
                              padding: 4,
                            }}
                            title={link.status === "active" ? "Deactivate" : "Activate"}
                          >
                            {link.status === "active" ? <ToggleRight size={18} /> : <ToggleLeft size={18} />}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

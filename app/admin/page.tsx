"use client";

/**
 * /admin — admin dashboard (2026 redesign). An admin (email in lib/auth/admins.ts)
 * signs in and sees every registered user, their details, and assessment
 * status/result, with school management and one-click / bulk report emailing.
 * Reads the Firestore `users` collection (allowed for admins by firestore.rules).
 *
 * Styling matches the student dashboard: white / near-black / grey with a single
 * light-red accent. Logic is unchanged from the previous version.
 */

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Logo } from "@/app/Logo";
import { collection, getDocs, addDoc, doc, updateDoc, setDoc } from "firebase/firestore";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useAuth, authErrorMessage, type UserProfile } from "@/lib/auth/AuthProvider";
import { isAdmin, ADMIN_LOGIN_EMAIL } from "@/lib/auth/admins";
import { categoryLabel } from "@/lib/auth/formOptions";
import { getDb, getFirebaseAuth } from "@/lib/firebase/client";
import { Icon } from "@/app/Icons";
import { C, Ring } from "@/app/account/viz";
import { OFFER, formatPaise } from "@/lib/offer";
// The same report component the student sees on their own dashboard. It takes
// the whole summary as a prop and fetches nothing, so the admin view is the
// student's view — there is no second rendering path to drift out of step.
import FullReport from "@/app/account/FullReport";

/**
 * ⚠️ DEV-ONLY admin shortcut. Lets the redesigned /admin be reviewed with a
 * hardcoded credential, WITHOUT a live Firebase admin user. Automatically
 * disabled in production builds (NODE_ENV === "production").
 * REMOVE this block (and the `bypass` logic below) before shipping.
 */
const DEV_ADMIN = { email: "support@onegrasp.com", password: "onegrasp@2026" };
const DEV_BYPASS_ENABLED = process.env.NODE_ENV !== "production";

export default function AdminPage() {
  const { ready, loading, user, logout, signIn } = useAuth();
  const [bypass, setBypass] = useState(false); // DEV-ONLY local admin shortcut
  const admin = isAdmin(user?.email) || bypass;

  const [email, setEmail] = useState(ADMIN_LOGIN_EMAIL);
  const [password, setPassword] = useState(DEV_BYPASS_ENABLED ? DEV_ADMIN.password : "");
  const [signingIn, setSigningIn] = useState(false);
  const [loginError, setLoginError] = useState("");

  async function adminSignIn(e: React.FormEvent) {
    e.preventDefault();
    setLoginError("");
    setSigningIn(true);
    const isDevAdmin = email.trim().toLowerCase() === DEV_ADMIN.email && password === DEV_ADMIN.password;
    try {
      // Real Firebase sign-in — sets request.auth so Firestore rules allow the reads.
      await signIn(email, password);
    } catch (err) {
      const code = (err as { code?: string })?.code || "";
      const notFound = code.includes("user-not-found") || code.includes("invalid-credential");
      // DEV-ONLY: bootstrap the admin account so the hardcoded credential becomes
      // a real Firebase admin the first time it's used (rules then pass on data).
      if (DEV_BYPASS_ENABLED && isDevAdmin && notFound) {
        try {
          const auth = getFirebaseAuth();
          if (auth) await createUserWithEmailAndPassword(auth, DEV_ADMIN.email, DEV_ADMIN.password);
          // onAuthStateChanged picks up the new session → dashboard + data load.
          return;
        } catch (e2) {
          const c2 = (e2 as { code?: string })?.code || "";
          if (c2.includes("operation-not-allowed")) {
            setLoginError("Enable Email/Password sign-in in Firebase → Authentication → Sign-in method, then try again.");
          } else if (DEV_BYPASS_ENABLED) {
            // Last resort: show the redesigned shell without live data.
            setBypass(true);
          } else {
            setLoginError(authErrorMessage(e2));
          }
        }
      } else {
        setLoginError(authErrorMessage(err));
      }
    } finally {
      setSigningIn(false);
    }
  }

  const [rows, setRows] = useState<UserProfile[] | null>(null);
  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState("");
  const [q, setQ] = useState("");
  const [sent, setSent] = useState<Record<string, string>>({}); // uid -> sending|sent|error msg
  const [bulk, setBulk] = useState(false);
  const [schools, setSchools] = useState<string[]>([]); // admin-managed school list
  const [schoolFilter, setSchoolFilter] = useState("");
  const [newSchool, setNewSchool] = useState("");
  const [assigning, setAssigning] = useState<string | null>(null);
  // The student whose report is open full-screen, or null for the user table.
  // Everything it needs is already in `rows` — latestAssessment is part of the
  // profile document — so opening a report costs no extra Firestore read.
  const [viewing, setViewing] = useState<UserProfile | null>(null);

  // ---- Payment settings (Firestore `settings/payment`) --------------------
  // Loaded from /api/payment/status rather than read straight out of Firestore,
  // because that endpoint reports what the SERVER will actually do — including
  // whether Razorpay credentials exist and whether the toggle is even reaching
  // it. Saving writes the doc, then re-reads the endpoint to confirm.
  const [payEnabled, setPayEnabled] = useState(true);
  const [payPrice, setPayPrice] = useState(""); // rupees, as typed
  const [payLoaded, setPayLoaded] = useState(false);
  const [paySaving, setPaySaving] = useState(false);
  const [payMsg, setPayMsg] = useState<{ kind: "ok" | "err"; text: string } | null>(null);
  const [payConfigured, setPayConfigured] = useState(true); // Razorpay secret present
  const [paySource, setPaySource] = useState<"firestore" | "env">("firestore");
  const [payForcedOff, setPayForcedOff] = useState(false); // code-level kill switch

  async function loadPaymentSettings() {
    try {
      const res = await fetch("/api/payment/status", { cache: "no-store" });
      const d = await res.json();
      setPayEnabled(d?.enabled !== false);
      setPayPrice(String((Number(d?.amountPaise) || 4900) / 100));
      setPayConfigured(Boolean(d?.configured));
      setPaySource(d?.settingsSource === "env" ? "env" : "firestore");
      setPayForcedOff(Boolean(d?.forcedOff));
    } catch {
      setPayMsg({ kind: "err", text: "Couldn't read the current payment settings." });
    } finally {
      setPayLoaded(true);
    }
  }

  async function savePaymentSettings() {
    const rupees = Number(payPrice);
    if (!Number.isFinite(rupees) || rupees < 1 || rupees > 100000) {
      setPayMsg({ kind: "err", text: "Enter a price between ₹1 and ₹1,00,000." });
      return;
    }
    const db = getDb();
    if (!db) { setPayMsg({ kind: "err", text: "Firebase isn't configured on this deployment." }); return; }
    setPaySaving(true);
    setPayMsg(null);
    try {
      await setDoc(
        doc(db, "settings", "payment"),
        {
          enabled: payEnabled,
          amountPaise: Math.round(rupees * 100),
          updatedAt: new Date().toISOString(),
          updatedBy: user?.email || "admin",
        },
        { merge: true }
      );
      // Confirm the server sees the change — a write that Firestore accepted but
      // the server can't read back would silently leave the old price live.
      await loadPaymentSettings();
      setPayMsg({
        kind: "ok",
        text: payEnabled
          ? `Saved — students are charged ₹${rupees % 1 === 0 ? rupees : rupees.toFixed(2)} before the exam.`
          : "Saved — payment is off. Students go straight to the exam.",
      });
    } catch (e) {
      setPayMsg({
        kind: "err",
        text: e instanceof Error ? e.message : "Could not save — check Firestore admin write rules.",
      });
    } finally {
      setPaySaving(false);
    }
  }

  async function addSchool() {
    const name = newSchool.trim();
    if (!name) return;
    const db = getDb();
    if (!db) return;
    try {
      await addDoc(collection(db, "schools"), { name });
      setSchools((s) => Array.from(new Set([...s, name])).sort());
      setNewSchool("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not add school — check Firestore admin write rules.");
    }
  }

  async function assignSchool(u: UserProfile, school: string) {
    const db = getDb();
    if (!db) return;
    setAssigning(u.uid);
    try {
      await updateDoc(doc(db, "users", u.uid), { institution: school });
      setRows((rs) => (rs ?? []).map((r) => (r.uid === u.uid ? { ...r, institution: school } : r)));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not assign school — check Firestore admin write rules.");
    } finally {
      setAssigning(null);
    }
  }

  async function sendReport(u: UserProfile) {
    if (!u.email || !u.latestAssessment) return;
    setSent((s) => ({ ...s, [u.uid]: "sending" }));
    try {
      const idToken = await getFirebaseAuth()?.currentUser?.getIdToken();
      const res = await fetch("/api/admin/send-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken, to: u.email, name: u.name, report: u.latestAssessment }),
      });
      const data = await res.json();
      setSent((s) => ({ ...s, [u.uid]: res.ok && data.success ? "sent" : `error: ${data.message || "failed"}` }));
    } catch (e) {
      setSent((s) => ({ ...s, [u.uid]: `error: ${e instanceof Error ? e.message : "failed"}` }));
    }
  }

  async function sendAll(list: UserProfile[]) {
    setBulk(true);
    for (const u of list) {
      if (u.email && u.latestAssessment && sent[u.uid] !== "sent") {
        // eslint-disable-next-line no-await-in-loop
        await sendReport(u);
      }
    }
    setBulk(false);
  }

  useEffect(() => {
    if (!admin) return;
    void loadPaymentSettings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [admin]);

  useEffect(() => {
    if (!admin) return;
    const db = getDb();
    if (!db) return;
    setFetching(true);
    Promise.all([
      getDocs(collection(db, "users")),
      getDocs(collection(db, "schools")).catch(() => null),
    ])
      .then(([usnap, ssnap]) => {
        setRows(usnap.docs.map((d) => d.data() as UserProfile));
        if (ssnap) setSchools(ssnap.docs.map((d) => (d.data() as { name?: string }).name || "").filter(Boolean));
      })
      .catch((e) => setError(e?.message || "Failed to load users."))
      .finally(() => setFetching(false));
  }, [admin]);

  // All selectable schools = admin-added list ∪ schools users typed at registration.
  const allSchools = useMemo(() => {
    const set = new Set<string>(schools);
    (rows ?? []).forEach((u) => { if (u.institution) set.add(u.institution); });
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [schools, rows]);

  const filtered = useMemo(() => {
    let list = rows ?? [];
    if (schoolFilter) list = list.filter((u) => (u.institution || "") === schoolFilter);
    const term = q.trim().toLowerCase();
    if (term) list = list.filter((u) =>
      [u.name, u.email, u.phone, u.institution].filter(Boolean).some((v) => v!.toLowerCase().includes(term))
    );
    return list;
  }, [rows, q, schoolFilter]);

  const stats = useMemo(() => {
    const list = rows ?? [];
    const completed = list.filter((u) => u.latestAssessment).length;
    const ratings = list
      .map((u) => u.latestAssessment?.feedbackRating)
      .filter((r): r is number => typeof r === "number");
    const avg = ratings.length ? (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1) : "—";
    const rate = list.length ? Math.round((completed / list.length) * 100) : 0;
    return { total: list.length, completed, pending: list.length - completed, avg, rate };
  }, [rows]);

  if (!ready && !DEV_BYPASS_ENABLED) return <Center>Accounts aren’t configured on this deployment yet.</Center>;
  if (loading && !bypass) return <Center>Loading…</Center>;

  if (!user && !bypass) {
    return (
      <div style={{ ...S.page, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
        <style dangerouslySetInnerHTML={{ __html: ADMIN_CSS }} />
        <form onSubmit={adminSignIn} style={S.loginCard}>
          <div style={S.loginBadge}><Icon name="lock" size={26} /></div>
          <h1 style={S.loginTitle}>Admin sign in</h1>
          <p style={S.loginSub}>Restricted to OneGrasp administrators.</p>
          {loginError && <div style={S.error}>{loginError}</div>}
          <label style={S.loginLabel}>Email</label>
          <input style={S.loginInput} type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@onegrasp.com" />
          <label style={{ ...S.loginLabel, marginTop: 12 }}>Password</label>
          <input style={S.loginInput} type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
          <button type="submit" style={{ ...S.loginBtn, ...(signingIn ? { opacity: 0.6 } : {}) }} disabled={signingIn}>
            {signingIn ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </div>
    );
  }
  if (!admin) {
    return (
      <Center>
        <p style={S.muted}>You’re signed in as <b>{user?.email}</b>, which isn’t an admin account.</p>
        <button style={S.linkBtn} onClick={() => void logout()}>Sign out</button>
      </Center>
    );
  }

  // A student's report, full screen. Rendered instead of the console rather
  // than over it so the browser's own print/save-as-PDF captures the report
  // alone — an overlay would carry the whole admin page into the printout.
  if (viewing?.latestAssessment) {
    const a = viewing.latestAssessment;
    const st = sent[viewing.uid];
    const completed = (() => {
      try { return new Date(a.completedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }); }
      catch { return ""; }
    })();
    return (
      <div style={S.reportPage}>
        <style dangerouslySetInnerHTML={{ __html: ADMIN_CSS }} />
        <div style={S.reportBar} className="og-noprint og-adm-repbar">
          <button style={S.reportBack} onClick={() => { setViewing(null); window.scrollTo(0, 0); }}>
            <Icon name="chevronLeft" size={16} /> Back to users
          </button>
          <div style={S.reportWho}>
            <b style={{ fontSize: 14 }}>{viewing.name || "—"}</b>
            <span style={{ fontSize: 12, color: C.muted }}>
              {viewing.email || "—"}
              {viewing.institution ? ` · ${viewing.institution}` : ""}
              {completed ? ` · completed ${completed}` : ""}
            </span>
          </div>
          <div style={S.reportActions}>
            <button style={S.sendBtn} onClick={() => window.print()}>
              <Icon name="save" size={14} /> Print / PDF
            </button>
            {st === "sent" ? (
              <span style={{ ...S.pill, ...S.pillSent }}><Icon name="check" size={13} /> Emailed</span>
            ) : (
              <button
                style={{ ...S.sendBtn, ...(st === "sending" ? { opacity: 0.6 } : {}) }}
                disabled={st === "sending"}
                onClick={() => void sendReport(viewing)}
              >
                {st === "sending" ? "Sending…" : "Email to student"}
              </button>
            )}
          </div>
        </div>
        <FullReport a={a} name={viewing.name} />
      </div>
    );
  }

  return (
    <div style={S.page}>
      <style dangerouslySetInnerHTML={{ __html: ADMIN_CSS }} />
      <header style={S.header} className="og-adm-header">
        <Link href="/" style={{ textDecoration: "none" }}><Logo height={38} /></Link>
        <div style={S.headRight}>
          <span style={S.adminTag}><Icon name="shield" size={14} /> {user?.email ?? DEV_ADMIN.email}</span>
          <button style={S.logout} onClick={() => { setBypass(false); void logout(); }}>Sign out</button>
        </div>
      </header>

      <div style={S.body} className="og-adm-body">
        {/* overview */}
        <section style={S.overview} className="og-adm-overview">
          <div>
            <div style={S.eyebrow}>Admin console</div>
            <h1 style={S.title}>Users & reports</h1>
            <p style={S.subtitle}>Track registrations, assessment completion and report delivery across all schools.</p>
          </div>
          <div style={S.overviewRing}>
            <Ring value={stats.rate} size={92} stroke={10} color={C.red} track="#efeff2">
              <div style={S.ringPct}>{stats.rate}<small>%</small></div>
              <div style={S.ringLab}>completed</div>
            </Ring>
          </div>
        </section>

        <div style={S.statGrid} className="og-adm-stats">
          <Stat icon="user" label="Registered users" value={stats.total} />
          <Stat icon="check" label="Completed assessment" value={stats.completed} accent={C.good} />
          <Stat icon="clock" label="Not yet taken" value={stats.pending} accent={C.muted} />
          <Stat icon="star" label="Avg. feedback" value={stats.avg} accent={C.red} />
        </div>

        {/* payment control — the fee gate students hit before the exam */}
        <section style={S.payCard} className="og-adm-pay">
          <div style={S.payHead}>
            <span style={S.payIcon}><Icon name="card" size={18} /></span>
            <div style={{ flex: 1, minWidth: 200 }}>
              <div style={S.payTitle}>Assessment payment</div>
              <p style={S.paySub}>
                When this is on, students pay the fee below before the exam opens. Turn it off and
                they go straight into the exam — no payment screen at all.
              </p>
            </div>
            <label style={S.toggleWrap}>
              <span style={{ ...S.toggleLabel, color: payEnabled ? C.ink : C.muted }}>
                {payEnabled ? "Payment on" : "Payment off"}
              </span>
              <button
                type="button"
                role="switch"
                aria-checked={payEnabled}
                aria-label="Enable payment"
                disabled={!payLoaded || paySaving}
                onClick={() => { setPayEnabled((v) => !v); setPayMsg(null); }}
                style={{ ...S.toggle, ...(payEnabled ? S.toggleOn : {}), ...(payLoaded ? {} : { opacity: 0.5 }) }}
              >
                <span style={{ ...S.toggleKnob, ...(payEnabled ? S.toggleKnobOn : {}) }} />
              </button>
            </label>
          </div>

          <div style={S.payRow}>
            <div>
              <label style={S.payLabel} htmlFor="og-price">Price (₹)</label>
              <div style={S.priceWrap}>
                <span style={S.pricePrefix}>₹</span>
                <input
                  id="og-price"
                  style={{ ...S.priceInput, ...(payEnabled ? {} : { color: C.muted }) }}
                  type="number" min={1} max={100000} step="1" inputMode="decimal"
                  value={payPrice}
                  disabled={!payLoaded || paySaving}
                  onChange={(e) => { setPayPrice(e.target.value); setPayMsg(null); }}
                  onKeyDown={(e) => { if (e.key === "Enter") void savePaymentSettings(); }}
                />
              </div>
            </div>
            <button
              style={{ ...S.paySave, ...(paySaving || !payLoaded ? { opacity: 0.6, cursor: "default" } : {}) }}
              disabled={paySaving || !payLoaded}
              onClick={() => void savePaymentSettings()}
            >
              {paySaving ? "Saving…" : "Save changes"}
            </button>
            <div style={S.payState} data-pay-state>
              {!payLoaded ? (
                <span style={S.payNote}>Loading current settings…</span>
              ) : payEnabled && payConfigured ? (
                <span style={{ ...S.pill, ...S.pillOk }}>
                  <span style={{ ...S.dot, background: C.good }} /> Live — students are charged
                </span>
              ) : (
                <span style={{ ...S.pill, ...S.pillWait }}>
                  <span style={{ ...S.dot, background: C.muted }} /> Free — exam opens without payment
                </span>
              )}
            </div>
          </div>

          {payMsg && (
            <div style={payMsg.kind === "ok" ? S.payOk : S.error}>
              <Icon name={payMsg.kind === "ok" ? "check" : "info"} size={15} /> {payMsg.text}
            </div>
          )}
          {/* Kill switch is on — say so, or this whole card looks broken. */}
          {payLoaded && payForcedOff && (
            <div style={S.payWarn}>
              <Icon name="info" size={15} style={{ flex: "none", marginTop: 1 }} />
              <span>
                Payment is switched off in the code for everyone, so this toggle has no effect
                right now and nobody is being charged. To hand control back to this switch, set
                <b> FORCE_PAYMENT_OFF</b> to <b>false</b> in <b>lib/paymentSettings.ts</b> and redeploy.
              </span>
            </div>
          )}
          {/* The message goes in a single <span>: this row is a flex container,
              so a bare <b> would become its own flex item and get pushed away
              from the surrounding words by the row's gap. */}
          {payLoaded && payEnabled && !payConfigured && (
            <div style={S.payWarn}>
              <Icon name="info" size={15} style={{ flex: "none", marginTop: 1 }} />
              <span>
                Payment is switched on, but no Razorpay key secret is set on this deployment —
                students still get in free. Add <b>RAZORPAY_KEY_SECRET</b> to the host environment
                to start charging.
              </span>
            </div>
          )}
          {/* Not shown while forced off: the kill switch returns before the
              Firestore read, so "env" there says nothing about connectivity. */}
          {payLoaded && paySource === "env" && !payForcedOff && (
            <div style={S.payWarn}>
              <Icon name="info" size={15} style={{ flex: "none", marginTop: 1 }} />
              <span>
                The server can&apos;t reach Firestore, so it&apos;s falling back to the environment
                variables and this switch won&apos;t take effect. Add the Firebase admin credentials
                (<b>serviceAccountKey.json</b> or the <b>FIREBASE_*</b> env vars) on the server.
              </span>
            </div>
          )}

          {/* What the student actually sees on the payment screen. These are
              code constants (lib/offer.ts + lib/coupons.ts), not settings — so
              this is read-only, and says where to change them. */}
          {payLoaded && payEnabled && (
            <div style={S.payOffer}>
              <div style={S.payOfferHead}>
                <span style={{ ...S.pill, ...S.pillOk }}>
                  <span style={{ ...S.dot, background: C.good }} /> {OFFER.active ? "Sale running" : "Sale off"}
                </span>
                <b style={{ fontSize: 13 }}>{OFFER.name}</b>
                <span style={{ fontSize: 12, color: C.muted }}>ends {OFFER.endsOnLabel}</span>
              </div>
              <div style={S.payOfferRow}>
                <span>Shown as</span>
                <b><s style={{ color: C.muted, fontWeight: 600 }}>{formatPaise(OFFER.listPaise)}</s> → {payPrice ? `₹${payPrice}` : formatPaise(OFFER.salePaise)}</b>
              </div>
              <div style={S.payOfferRow}>
                <span><b>{OFFER.autoCouponCode}</b> — applied automatically on the payment screen</span>
                <b>{OFFER.discountPct}% off</b>
              </div>
              <div style={S.payOfferRow}>
                <span><b>{OFFER.freeCouponCode}</b> — typed in by the student</span>
                <b>Free entry</b>
              </div>
              <div style={{ ...S.payNote, marginTop: 6 }}>
                Coupons and sale copy live in <b>lib/offer.ts</b> and <b>lib/coupons.ts</b> — edit and redeploy to change them.
                Free-code uses are logged to the <b>couponRedemptions</b> collection.
              </div>
            </div>
          )}
        </section>

        <div style={S.tableCard}>
          <div style={S.tableHead}>
            <div style={S.tableTitle}>Users {rows ? <span style={S.count}>{filtered.length}</span> : null}</div>
            <div style={S.toolbar}>
              <select style={S.schoolSel} value={schoolFilter} onChange={(e) => setSchoolFilter(e.target.value)}>
                <option value="">All schools ({rows?.length ?? 0})</option>
                {allSchools.map((s) => (
                  <option key={s} value={s}>{s} ({(rows ?? []).filter((u) => u.institution === s).length})</option>
                ))}
              </select>
              <div style={S.addSchoolWrap}>
                <input style={S.addSchoolInput} placeholder="Add a school…" value={newSchool}
                  onChange={(e) => setNewSchool(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") void addSchool(); }} />
                <button style={{ ...S.addSchoolBtn, ...(newSchool.trim() ? {} : { opacity: 0.5, cursor: "default" }) }} onClick={() => void addSchool()} disabled={!newSchool.trim()}>Add</button>
              </div>
              <input style={S.search} placeholder="Search name / email / phone…" value={q} onChange={(e) => setQ(e.target.value)} />
              <button
                style={{ ...S.bulkBtn, ...(bulk || !filtered.some((u) => u.latestAssessment) ? { opacity: 0.55, cursor: bulk ? "wait" : "default" } : {}) }}
                disabled={bulk || !filtered.some((u) => u.latestAssessment)}
                onClick={() => void sendAll(filtered)}
              >
                <Icon name="save" size={15} /> {bulk ? "Emailing…" : schoolFilter ? `Email ${schoolFilter}` : "Email all completed"}
              </button>
            </div>
          </div>

          {error && <div style={S.error}>{error}</div>}
          {fetching && <div style={S.muted}>Loading users…</div>}
          {rows && filtered.length === 0 && !fetching && <div style={S.emptyRow}>No users found.</div>}

          {filtered.length > 0 && (
            <div style={S.scroll}>
              <table style={S.table} className="og-adm-table">
                <thead>
                  <tr>
                    {["Name", "Email", "Phone", "School", "Category", "Status", "Assessment", "Top career", "Fit %", "Report"].map((h) => (
                      <th key={h} style={S.th}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((u, i) => {
                    const a = u.latestAssessment;
                    return (
                      <tr key={u.uid || i}>
                        <td style={S.td}>
                          {/* The name is the obvious thing to click for "show
                              me this student" — but only once there's a report
                              behind it, or the click does nothing and reads as
                              broken. */}
                          {a ? (
                            <button style={S.nameBtn} onClick={() => { setViewing(u); window.scrollTo(0, 0); }} title="Open this student's report">
                              {u.name || "—"}
                            </button>
                          ) : (
                            <b style={S.name}>{u.name || "—"}</b>
                          )}
                        </td>
                        <td style={S.td}>{u.email || "—"}</td>
                        <td style={S.td}>{u.phone || "—"}</td>
                        <td style={S.td}>
                          <select
                            style={{ ...S.assignSel, ...(assigning === u.uid ? { opacity: 0.5 } : {}) }}
                            value={u.institution || ""}
                            disabled={assigning === u.uid}
                            onChange={(e) => void assignSchool(u, e.target.value)}
                          >
                            <option value="">— unassigned —</option>
                            {allSchools.map((s) => <option key={s} value={s}>{s}</option>)}
                          </select>
                        </td>
                        <td style={S.td}>{u.category ? categoryLabel(u.category) : "—"}</td>
                        <td style={S.td}>{u.clarity || "—"}</td>
                        <td style={S.td}>
                          {a
                            ? <span style={{ ...S.pill, ...S.pillOk }}><span style={{ ...S.dot, background: C.good }} /> Completed</span>
                            : <span style={{ ...S.pill, ...S.pillWait }}><span style={{ ...S.dot, background: C.muted }} /> Pending</span>}
                        </td>
                        <td style={S.td}>{a?.topCareer || "—"}</td>
                        <td style={S.td}>{a?.overallFitmentPct != null ? <b style={{ color: C.red }}>{a.overallFitmentPct}%</b> : "—"}</td>
                        <td style={S.td}>
                          {a ? (
                            <div style={S.reportCell}>
                              <button style={S.viewBtn} onClick={() => { setViewing(u); window.scrollTo(0, 0); }}>
                                <Icon name="explain" size={14} /> View report
                              </button>
                              {(() => {
                                const st = sent[u.uid];
                                if (st === "sent") return <span style={{ ...S.pill, ...S.pillSent }}><Icon name="check" size={13} /> Sent</span>;
                                if (st?.startsWith("error")) return (
                                  <div style={{ display: "flex", flexDirection: "column", gap: 4, alignItems: "flex-start" }}>
                                    <button style={S.sendBtn} onClick={() => void sendReport(u)}>Retry</button>
                                    <span style={{ fontSize: 11, color: C.redStrong, maxWidth: 240, lineHeight: 1.35 }}>{st.replace(/^error:\s*/, "")}</span>
                                  </div>
                                );
                                return (
                                  <button style={{ ...S.sendBtn, ...(st === "sending" ? { opacity: 0.6 } : {}) }} disabled={st === "sending"} onClick={() => void sendReport(u)}>
                                    {st === "sending" ? "Sending…" : "Email report"}
                                  </button>
                                );
                              })()}
                            </div>
                          ) : "—"}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Stat({ icon, label, value, accent }: { icon: string; label: string; value: number | string; accent?: string }) {
  return (
    <div style={S.statCard}>
      <span style={{ ...S.statIcon, ...(accent ? { color: accent, background: tint(accent) } : {}) }}><Icon name={icon} size={17} /></span>
      <div style={S.statValue}>{value}</div>
      <div style={S.statLabel}>{label}</div>
    </div>
  );
}

function tint(hex: string) {
  if (hex === C.red) return C.redTint;
  if (hex === C.good) return C.goodTint;
  return C.line2;
}

function Center({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ ...S.page, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ textAlign: "center", maxWidth: 420, padding: 24 }}>{children}</div>
    </div>
  );
}

const ADMIN_CSS = `
.og-adm-table tbody tr{transition:background .12s}
.og-adm-table tbody tr:hover{background:${C.line2}}
/* Keep the printed report to the report itself — the toolbar is navigation,
   and report-premium.css already hides the student-facing chrome. */
@media print{.og-noprint{display:none !important}}
@media (max-width: 640px){
  .og-adm-repbar{padding:10px 12px !important;gap:10px !important}
}
@media (max-width: 720px){
  .og-adm-stats{grid-template-columns:repeat(2,1fr) !important}
  .og-adm-overview{flex-direction:column;align-items:flex-start !important;gap:18px}
}
@media (max-width: 640px){
  .og-adm-header{padding:12px 14px !important}
  .og-adm-body{padding:16px 12px !important}
  .og-adm-pay [data-pay-state]{margin-left:0 !important}
}
`;

const S: Record<string, React.CSSProperties> = {
  page: { minHeight: "100vh", background: C.bg, fontFamily: "Inter, system-ui, Segoe UI, sans-serif", color: C.ink },
  header: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 24px", background: "#fff", borderBottom: `1px solid ${C.line}` },
  headRight: { display: "flex", alignItems: "center", gap: 12 },
  adminTag: { display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12.5, color: C.ink2, fontWeight: 600, background: C.line2, border: `1px solid ${C.line}`, borderRadius: 999, padding: "6px 12px" },
  logout: { padding: "9px 16px", background: "#fff", color: C.redStrong, border: `1px solid ${C.redLine}`, borderRadius: 10, fontSize: 13.5, fontWeight: 700, cursor: "pointer" },
  body: { maxWidth: 1120, margin: "0 auto", padding: "24px" },

  overview: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: 20, background: "#fff", border: `1px solid ${C.line}`, borderRadius: 18, padding: "24px 26px", marginBottom: 16, boxShadow: "0 2px 10px rgba(20,20,25,.04)" },
  eyebrow: { fontSize: 11, fontWeight: 800, letterSpacing: ".13em", textTransform: "uppercase", color: C.red },
  title: { fontSize: 26, fontWeight: 800, margin: "8px 0 0", letterSpacing: "-0.02em" },
  subtitle: { fontSize: 13.5, color: C.ink3, margin: "8px 0 0", maxWidth: "56ch", lineHeight: 1.55 },
  overviewRing: { flex: "none" },
  ringPct: { fontSize: 22, fontWeight: 800, color: C.ink, lineHeight: 1 },
  ringLab: { fontSize: 9.5, fontWeight: 800, letterSpacing: ".06em", textTransform: "uppercase", color: C.muted, marginTop: 3 },

  statGrid: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 16 },
  statCard: { background: "#fff", border: `1px solid ${C.line}`, borderRadius: 16, padding: "16px 18px", boxShadow: "0 2px 10px rgba(20,20,25,.04)" },
  statIcon: { width: 32, height: 32, borderRadius: 9, display: "grid", placeItems: "center", background: C.line2, color: C.ink2, marginBottom: 12 },
  statValue: { fontSize: 26, fontWeight: 800, color: C.ink, lineHeight: 1.1 },
  statLabel: { fontSize: 12, color: C.ink3, fontWeight: 600, marginTop: 4 },

  payCard: { background: "#fff", border: `1px solid ${C.line}`, borderRadius: 18, padding: "20px 22px", marginBottom: 16, boxShadow: "0 2px 10px rgba(20,20,25,.04)" },
  payHead: { display: "flex", alignItems: "flex-start", gap: 12, flexWrap: "wrap" },
  payIcon: { width: 32, height: 32, borderRadius: 9, display: "grid", placeItems: "center", background: C.redTint, color: C.red, flex: "none" },
  payTitle: { fontSize: 15.5, fontWeight: 800, color: C.ink },
  paySub: { fontSize: 13, color: C.ink3, margin: "5px 0 0", maxWidth: "62ch", lineHeight: 1.55 },
  toggleWrap: { display: "inline-flex", alignItems: "center", gap: 10, cursor: "pointer", flex: "none" },
  toggleLabel: { fontSize: 13, fontWeight: 700, whiteSpace: "nowrap" },
  toggle: { position: "relative", width: 46, height: 26, borderRadius: 999, border: `1px solid ${C.line}`, background: C.line2, cursor: "pointer", padding: 0, transition: "background .15s, border-color .15s", flex: "none" },
  toggleOn: { background: C.good, borderColor: C.good },
  toggleKnob: { position: "absolute", top: 2, left: 2, width: 20, height: 20, borderRadius: "50%", background: "#fff", boxShadow: "0 1px 3px rgba(20,20,25,.25)", transition: "transform .15s", display: "block" },
  toggleKnobOn: { transform: "translateX(20px)" },
  payRow: { display: "flex", alignItems: "flex-end", gap: 12, flexWrap: "wrap", marginTop: 18 },
  payLabel: { display: "block", fontSize: 12, fontWeight: 700, color: C.ink2, marginBottom: 6 },
  priceWrap: { display: "flex", alignItems: "stretch", border: `1px solid ${C.line}`, borderRadius: 10, overflow: "hidden", background: "#fff" },
  pricePrefix: { display: "grid", placeItems: "center", padding: "0 11px", background: C.line2, color: C.ink3, fontSize: 14, fontWeight: 700, borderRight: `1px solid ${C.line}` },
  priceInput: { width: 120, padding: "9px 12px", border: "none", outline: "none", fontSize: 14.5, fontWeight: 700, color: C.ink, fontFamily: "inherit" },
  paySave: { padding: "10px 18px", background: C.red, color: "#fff", border: "none", borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap" },
  payState: { marginLeft: "auto", paddingBottom: 2 },
  payNote: { fontSize: 12.5, color: C.muted, fontWeight: 600 },
  payOk: { display: "flex", alignItems: "center", gap: 8, background: C.goodTint, border: "1px solid #cbe8db", color: "#1f7a55", padding: "10px 14px", borderRadius: 10, fontSize: 13, marginTop: 14, fontWeight: 600 },
  payWarn: { display: "flex", alignItems: "flex-start", gap: 8, background: "#fff8e8", border: "1px solid #f2e0b5", color: "#8a6516", padding: "10px 14px", borderRadius: 10, fontSize: 12.5, marginTop: 12, lineHeight: 1.5, fontWeight: 600 },

  payOffer: { background: "#fbfcff", border: `1px dashed ${C.line}`, borderRadius: 12, padding: "13px 15px", marginTop: 14 },
  payOfferHead: { display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", marginBottom: 4 },
  payOfferRow: { display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 14, padding: "7px 0", borderTop: `1px solid ${C.line}`, fontSize: 12.5, color: C.muted, lineHeight: 1.45 },

  tableCard: { background: "#fff", border: `1px solid ${C.line}`, borderRadius: 18, padding: "20px 22px", boxShadow: "0 2px 10px rgba(20,20,25,.04)" },
  tableHead: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, marginBottom: 16, flexWrap: "wrap" },
  tableTitle: { fontSize: 15.5, fontWeight: 800, display: "inline-flex", alignItems: "center", gap: 8 },
  count: { fontSize: 12, fontWeight: 800, color: C.red, background: C.redTint, borderRadius: 999, padding: "3px 10px" },
  toolbar: { display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap", justifyContent: "flex-end" },
  search: { padding: "9px 13px", borderRadius: 10, border: `1px solid ${C.line}`, fontSize: 13.5, outline: "none", minWidth: 220, background: "#fff", color: C.ink },
  schoolSel: { padding: "9px 12px", borderRadius: 10, border: `1px solid ${C.line}`, fontSize: 13, outline: "none", background: "#fff", cursor: "pointer", maxWidth: 220, color: C.ink },
  addSchoolWrap: { display: "flex", alignItems: "center" },
  addSchoolInput: { padding: "9px 12px", borderRadius: "10px 0 0 10px", border: `1px solid ${C.line}`, borderRight: "none", fontSize: 13, outline: "none", width: 140, color: C.ink },
  addSchoolBtn: { padding: "9px 15px", borderRadius: "0 10px 10px 0", border: `1px solid ${C.red}`, background: C.red, color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap" },
  assignSel: { padding: "5px 8px", borderRadius: 8, border: `1px solid ${C.line}`, fontSize: 12.5, background: "#fff", cursor: "pointer", maxWidth: 150, color: C.ink2 },
  bulkBtn: { display: "inline-flex", alignItems: "center", gap: 7, padding: "9px 16px", background: C.red, color: "#fff", border: "none", borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap" },

  error: { display: "flex", alignItems: "center", gap: 8, background: C.redTint, border: `1px solid ${C.redLine}`, color: C.redStrong, padding: "10px 14px", borderRadius: 10, fontSize: 13, marginBottom: 12, fontWeight: 600 },
  scroll: { overflowX: "auto" },
  table: { width: "100%", borderCollapse: "collapse", fontSize: 13.5 },
  th: { textAlign: "left", padding: "10px 12px", color: C.muted, fontWeight: 800, fontSize: 11, textTransform: "uppercase", letterSpacing: .5, borderBottom: `1px solid ${C.line}`, whiteSpace: "nowrap", background: "#fff", position: "sticky", top: 0 },
  td: { padding: "12px", borderBottom: `1px solid ${C.line2}`, color: C.ink2, whiteSpace: "nowrap" },
  name: { color: C.ink, fontWeight: 700 },
  pill: { display: "inline-flex", alignItems: "center", gap: 6, padding: "4px 11px", borderRadius: 999, fontSize: 12, fontWeight: 700 },
  dot: { width: 7, height: 7, borderRadius: "50%", flex: "none" },
  pillOk: { background: C.goodTint, color: "#1f7a55" },
  pillWait: { background: C.line2, color: C.ink3 },
  pillSent: { background: C.goodTint, color: "#1f7a55" },
  sendBtn: { padding: "6px 13px", background: "#fff", color: C.ink2, border: `1px solid ${C.line}`, borderRadius: 8, fontSize: 12.5, fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap" },

  // ---- report viewer ----
  reportCell: { display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" },
  viewBtn: { display: "inline-flex", alignItems: "center", gap: 6, padding: "6px 13px", background: C.ink, color: "#fff", border: "none", borderRadius: 8, fontSize: 12.5, fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap" },
  nameBtn: { background: "none", border: "none", padding: 0, font: "inherit", color: C.ink, fontWeight: 700, cursor: "pointer", textAlign: "left", textDecoration: "underline", textDecorationColor: C.line, textUnderlineOffset: 3 },
  reportPage: { minHeight: "100vh", background: "#f7f7f8", fontFamily: "Inter, system-ui, Segoe UI, sans-serif", color: C.ink },
  reportBar: { position: "sticky", top: 0, zIndex: 40, display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap", padding: "12px 22px", background: "rgba(255,255,255,.94)", backdropFilter: "saturate(160%) blur(10px)", borderBottom: `1px solid ${C.line}` },
  reportBack: { display: "inline-flex", alignItems: "center", gap: 6, padding: "8px 14px", background: "#fff", color: C.ink2, border: `1px solid ${C.line}`, borderRadius: 9, fontSize: 13, fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap" },
  reportWho: { display: "flex", flexDirection: "column", gap: 1, flex: 1, minWidth: 160 },
  reportActions: { display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" },
  muted: { color: C.ink3, fontSize: 14, padding: "8px 0" },
  emptyRow: { color: C.ink3, fontSize: 14, padding: "28px 0", textAlign: "center" },
  linkBtn: { marginTop: 12, background: "none", border: "none", color: C.red, fontWeight: 700, fontSize: 14, cursor: "pointer" },

  loginCard: { width: "100%", maxWidth: 400, background: "#fff", borderRadius: 18, padding: "34px 32px", boxShadow: "0 20px 50px rgba(20,20,25,.14)", textAlign: "center", border: `1px solid ${C.line}` },
  loginBadge: { width: 56, height: 56, borderRadius: 16, background: C.redTint, color: C.red, display: "grid", placeItems: "center", margin: "0 auto 14px" },
  loginTitle: { fontSize: 22, fontWeight: 800, margin: "0 0 4px" },
  loginSub: { fontSize: 13.5, color: C.ink3, margin: "0 0 22px" },
  loginLabel: { display: "block", textAlign: "left", fontSize: 12.5, fontWeight: 700, color: C.ink2, marginBottom: 6 },
  loginInput: { width: "100%", padding: "11px 13px", borderRadius: 10, border: `1px solid ${C.line}`, fontSize: 14.5, outline: "none", boxSizing: "border-box", color: C.ink },
  loginBtn: { width: "100%", marginTop: 20, padding: "13px", background: C.red, color: "#fff", border: "none", borderRadius: 11, fontSize: 15, fontWeight: 800, cursor: "pointer" },
};

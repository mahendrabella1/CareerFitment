"use client";

/**
 * The exam screen's look, shared by the student assessment (app/NewExam.tsx)
 * and the Working Professionals' Workplace Stress Check
 * (components/stress/StressTest.tsx) so both are the same screen. Moved here
 * unchanged from NewExam.tsx - edit with care: every class's exam uses it.
 */
import { Icon } from "@/app/Icons";

/* ------------------------------- styling ------------------------------- */
export const NAVY = "#17233f", BLUE = "#2563eb", BLUE_SOFT = "#eef4ff", INK = "#1e293b", MUTED = "#64748b", ACCENT = "#2563eb";
export const GREEN = "#16a34a", GREEN_SOFT = "#e7f6ec", AMBER = "#f59e0b", AMBER_SOFT = "#fef3c7", LINE = "#e6e9f0", BG = "#f5f7fb";
export const S: Record<string, React.CSSProperties> = {
  center: { position: "fixed", inset: 0, zIndex: 1000, background: BG, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12, fontFamily: "Inter, system-ui, Segoe UI, sans-serif", textAlign: "center", padding: 24 },
  big: { fontSize: 19, fontWeight: 800, color: INK },
  subT: { fontSize: 14, color: MUTED },

  page: { position: "fixed", inset: 0, zIndex: 1000, background: BG, fontFamily: "Inter, system-ui, Segoe UI, sans-serif", color: INK, display: "flex", flexDirection: "column" },
  // top bar (white)
  top: { flexShrink: 0, background: "#fff", borderBottom: `1px solid ${LINE}`, padding: "10px 22px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 },
  topLeft: { display: "flex", alignItems: "center", gap: 12 },
  logoBox: { border: `1px solid ${LINE}`, borderRadius: 10, padding: "5px 8px", display: "grid", placeItems: "center", background: "#fff" },
  topTitle: { fontSize: 17, fontWeight: 800, color: INK },
  topSub: { fontSize: 12.5, color: MUTED },
  statsPanel: { display: "flex", alignItems: "center", gap: 16, background: "#f8fafc", border: `1px solid ${LINE}`, borderRadius: 12, padding: "8px 20px" },
  topDiv: { width: 1, height: 26, background: "#e6e9f0" },
  stat: { display: "flex", alignItems: "center", gap: 9 },
  statIc: { color: "#94a3b8", display: "grid", placeItems: "center" },
  statLabel: { fontSize: 9.5, letterSpacing: .6, color: "#94a3b8", fontWeight: 700, textTransform: "uppercase" },
  statVal: { fontSize: 15, fontWeight: 800, lineHeight: 1.1, color: INK },
  topRight: { display: "flex", gap: 10, flexShrink: 0 },
  saveBtn: { display: "flex", alignItems: "center", gap: 7, background: "#fff", border: `1px solid ${LINE}`, color: "#475569", fontSize: 13.5, fontWeight: 700, cursor: "pointer", padding: "9px 16px", borderRadius: 9, whiteSpace: "nowrap" },
  saveBtnOk: { background: GREEN_SOFT, borderColor: "#bbe6cc", color: "#15803d" },
  exitBtn: { display: "flex", alignItems: "center", gap: 7, background: "#fef2f2", border: "1px solid #fecaca", color: "#dc2626", fontSize: 13.5, fontWeight: 700, cursor: "pointer", padding: "9px 16px", borderRadius: 9 },

  // horizontal categories bar - content-sized chips on the light page
  catBar: { flexShrink: 0, display: "flex", gap: 8, padding: "12px 22px", background: BG, overflowX: "auto" },
  catChip: { display: "flex", alignItems: "center", gap: 8, flexShrink: 0, padding: "8px 15px", border: `1px solid ${LINE}`, borderRadius: 10, background: "#fff", cursor: "pointer" },
  catChipOn: { background: BLUE_SOFT, borderColor: "#bcd0fb" },
  catChipName: { fontSize: 13, fontWeight: 700, color: INK, whiteSpace: "nowrap" },
  catChipBadge: { flexShrink: 0, fontSize: 11, fontWeight: 800, color: "#94a3b8", background: "#f1f3f7", borderRadius: 6, padding: "1px 7px" },
  catChipBadgeOn: { background: "#dbe6ff", color: BLUE },
  catChipBadgeDone: { background: GREEN_SOFT, color: "#15803d" },

  grid: { flex: 1, minHeight: 0, display: "grid", gridTemplateColumns: "minmax(0,1fr) 300px", background: BG },
  side: { borderRight: `1px solid ${LINE}`, background: "#fff", padding: "16px 12px", overflowY: "auto", display: "flex", flexDirection: "column", gap: 3 },
  sideLabel: { fontSize: 11, fontWeight: 800, textTransform: "uppercase", letterSpacing: .7, color: "#9aa1ad", margin: "0 6px 10px" },
  secItem: { width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "11px 10px", border: "1px solid transparent", borderLeft: "3px solid transparent", borderRadius: 10, background: "transparent", cursor: "pointer", textAlign: "left" },
  secItemOn: { background: BLUE_SOFT, borderColor: "#d7e0f7", borderLeftColor: BLUE },
  secIcon: { flexShrink: 0, width: 22, display: "grid", placeItems: "center" },
  secName: { display: "block", fontSize: 13.5, fontWeight: 700, color: INK, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" },
  secBadge: { flexShrink: 0, fontSize: 11.5, fontWeight: 800, color: "#94a3b8", background: "#f1f3f7", borderRadius: 7, padding: "2px 7px" },
  secBadgeOn: { background: "#dce4fb", color: BLUE },
  secBadgeDone: { background: "#dcfce7", color: "#15803d" },
  nowBox: { marginTop: 12, background: "#f6f8fc", border: `1px solid ${LINE}`, borderRadius: 11, padding: "11px 12px", display: "flex", flexDirection: "column", gap: 3 },
  nowLabel: { display: "flex", alignItems: "center", gap: 5, fontSize: 11, fontWeight: 700, color: "#94a3b8" },
  nowVal: { fontSize: 13.5, fontWeight: 800, color: BLUE },

  main: { minWidth: 0, overflowY: "auto", padding: "22px 34px 50px" },
  mainInner: { maxWidth: 960, margin: 0 },
  autoHint: { fontSize: 12.5, color: "#9aa1ad", fontWeight: 600 },
  qTopRow: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 },
  qPill: { background: BLUE, color: "#fff", fontSize: 12.5, fontWeight: 700, padding: "6px 14px", borderRadius: 999 },
  reviewBtn: { display: "flex", alignItems: "center", gap: 6, background: "#fff", border: `1px solid ${LINE}`, color: MUTED, fontSize: 12.5, fontWeight: 700, cursor: "pointer", padding: "6px 12px", borderRadius: 9 },
  reviewOn: { background: "#fef3c7", borderColor: "#f4d06a", color: "#b45309" },
  progOuter: { height: 5, background: "#e3e7ee", borderRadius: 999, overflow: "hidden", marginBottom: 16 },
  progFill: { height: "100%", background: BLUE, borderRadius: 999, transition: "width .3s" },

  catCard: { display: "flex", gap: 14, alignItems: "center", background: "#fff", border: `1px solid ${LINE}`, borderRadius: 14, padding: "15px 18px", marginBottom: 14 },
  catKicker: { fontSize: 10.5, fontWeight: 800, textTransform: "uppercase", letterSpacing: .6, color: BLUE },
  catTitle: { fontSize: 17, fontWeight: 800, margin: "3px 0 2px", color: INK },
  catBlurb: { fontSize: 13, color: MUTED, lineHeight: 1.5 },
  catIcon: { flexShrink: 0, width: 52, height: 52, borderRadius: 13, background: BLUE_SOFT, color: BLUE, display: "grid", placeItems: "center" },
  qBlock: { position: "relative" },
  qNum: { display: "inline-flex", alignItems: "center", justifyContent: "center", minWidth: 42, background: BLUE, color: "#fff", fontSize: 16, fontWeight: 800, padding: "6px 15px", borderRadius: 8, marginBottom: 10, marginLeft: 2 },
  qCard: { background: "#fff", border: `1px solid ${LINE}`, borderRadius: 16, padding: "24px 28px 14px", boxShadow: "0 2px 12px rgba(20,20,40,.05)" },
  qHead: { display: "flex", alignItems: "flex-start", gap: 14, marginBottom: 4 },
  qText: { flex: 1, fontSize: 19, fontWeight: 700, lineHeight: 1.5, color: INK, whiteSpace: "pre-line" },
  qHeadBtns: { display: "flex", gap: 8, flexShrink: 0 },
  speakBtn: { width: 36, height: 36, borderRadius: "50%", background: NAVY, color: "#fff", border: "none", display: "grid", placeItems: "center", cursor: "pointer" },
  reviewIcon: { width: 36, height: 36, borderRadius: "50%", background: "#f1f5f9", color: "#9aa3b2", border: `1px solid ${LINE}`, display: "grid", placeItems: "center", cursor: "pointer" },
  reviewIconOn: { background: AMBER_SOFT, color: "#d97706", borderColor: "#fadf9a" },
  optList: { display: "flex", flexDirection: "column", borderTop: "1px solid #eef0f4", marginTop: 14 },
  optRow: { display: "flex", alignItems: "center", gap: 13, width: "100%", textAlign: "left", padding: "13px 16px", border: "1px solid transparent", borderBottom: "1px solid #eef0f4", cursor: "pointer", outline: "none" },
  optRowOn: { border: `1px solid ${BLUE}`, borderRadius: 10, background: BLUE_SOFT },
  // One radio control for every option (text rows and SVG tiles). The ring is
  // deliberately dark enough to read against both the white card and the blue
  // selected tint - a faint hairline disappears on screen.
  radio: { flexShrink: 0, width: 20, height: 20, borderRadius: "50%", border: "2px solid #8d97a8", background: "#fff", display: "grid", placeItems: "center", boxSizing: "border-box" },
  radioOn: { borderColor: BLUE, boxShadow: `0 0 0 3px ${BLUE}1f` },
  radioDot: { width: 10, height: 10, borderRadius: "50%", background: BLUE },
  optLabel: { fontSize: 15, color: "#3a4356", lineHeight: 1.4 },
  optLabelOn: { color: INK, fontWeight: 600 },
  // Career Selector's two 210-option "up to THREE" questions only — see
  // CareerMultiPicker / the useDropdown condition in QuestionInput.
  pickerBox: { display: "flex", flexWrap: "wrap", alignItems: "center", gap: 8, minHeight: 48, padding: "8px 12px", border: `1.5px solid ${LINE}`, borderRadius: 12, background: "#fff", cursor: "text" },
  pickerBoxOpen: { borderColor: BLUE, boxShadow: `0 0 0 3px ${BLUE}1f` },
  pickerTag: { display: "inline-flex", alignItems: "center", gap: 6, padding: "6px 8px 6px 12px", borderRadius: 999, background: BLUE_SOFT, color: INK, fontSize: 13.5, fontWeight: 600 },
  pickerTagX: { display: "grid", placeItems: "center", width: 18, height: 18, borderRadius: "50%", border: "none", background: "rgba(0,0,0,.08)", color: INK, fontSize: 13, lineHeight: 1, cursor: "pointer" },
  pickerInput: { flex: 1, minWidth: 140, border: "none", outline: "none", fontSize: 14.5, color: INK, background: "transparent" },
  pickerPanel: { position: "absolute", zIndex: 20, top: "calc(100% + 6px)", left: 0, right: 0, maxHeight: 280, overflowY: "auto", background: "#fff", border: `1px solid ${LINE}`, borderRadius: 12, boxShadow: "0 12px 30px rgba(20,20,40,.14)", padding: 6 },
  pickerRow: { display: "block", width: "100%", textAlign: "left", padding: "9px 12px", border: "none", background: "transparent", borderRadius: 8, fontSize: 14, color: "#3a4356", cursor: "pointer" },
  pickerEmpty: { padding: "12px 12px", fontSize: 13, color: "#9aa1ad" },
  tapHint: { textAlign: "center", fontSize: 13, color: "#94a3b8", marginTop: 16 },
  optTag: { color: "#9aa1ad", fontWeight: 500, fontStyle: "italic" },

  mGrid: { display: "grid", gap: 6, maxWidth: 270, margin: "0 0 16px", background: "#fafbfc", padding: 8, borderRadius: 12, border: `1px solid ${LINE}` },
  mSeq: { display: "flex", gap: 6, alignItems: "center", flexWrap: "wrap", marginBottom: 16, background: "#fafbfc", padding: 8, borderRadius: 12, border: `1px solid ${LINE}` },
  mCell: { background: "#fff", border: `1px solid ${LINE}`, borderRadius: 6, display: "grid", placeItems: "center", minHeight: 58, overflow: "hidden", padding: 2 },
  mQ: { fontSize: 22, fontWeight: 800, color: "#c2c7d0" },
  mFigure: { display: "flex", justifyContent: "center", marginBottom: 16, background: "#fafbfc", padding: 10, borderRadius: 12, border: `1px solid ${LINE}` },
  mHtml: { marginBottom: 16, overflowX: "auto", fontSize: 14 },
  mPassage: { margin: "0 0 16px", padding: "12px 16px", borderLeft: `3px solid ${BLUE}`, background: BLUE_SOFT, borderRadius: "0 10px 10px 0", fontSize: 14.5, lineHeight: 1.6, color: "#334155" },
  mImage: { maxWidth: "100%", borderRadius: 12, marginBottom: 16, border: `1px solid ${LINE}` },
  mVideo: { width: "100%", maxWidth: 480, borderRadius: 12, marginBottom: 16 },

  audioCard: { marginBottom: 16, background: BLUE_SOFT, border: "1px solid #d7e0f7", borderRadius: 12, padding: 14 },
  audioRow: { display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" },
  audioBtn: { background: BLUE, color: "#fff", border: "none", borderRadius: 9, padding: "9px 18px", fontSize: 14, fontWeight: 700, cursor: "pointer" },
  audioNote: { fontSize: 13, color: "#4b6086" },
  transToggle: { background: "none", border: "none", color: BLUE, fontSize: 12.5, fontWeight: 700, cursor: "pointer", marginTop: 8, padding: 0 },
  transText: { marginTop: 8, fontSize: 14, lineHeight: 1.6, color: "#475569", background: "#fff", padding: 12, borderRadius: 9, border: `1px solid ${LINE}` },

  chartWrap: { display: "flex", gap: 18, alignItems: "center", flexWrap: "wrap", marginBottom: 16, background: "#fafbfc", padding: 14, borderRadius: 12, border: `1px solid ${LINE}` },
  chartLegend: { display: "flex", flexDirection: "column", gap: 6 },
  chartLeg: { display: "flex", alignItems: "center", gap: 7, fontSize: 13, color: "#475569" },
  barWrap: { display: "flex", flexDirection: "column", gap: 9, marginBottom: 16, background: "#fafbfc", padding: 14, borderRadius: 12, border: `1px solid ${LINE}` },
  barRow: { display: "flex", alignItems: "center", gap: 10, fontSize: 13 },
  barLabel: { width: 90, flexShrink: 0, color: "#475569" },
  barTrack: { flex: 1, height: 16, background: "#eceef2", borderRadius: 8, overflow: "hidden" },
  barFill: { height: "100%", borderRadius: 8 },
  barVal: { width: 32, textAlign: "right", fontWeight: 700, color: INK },

  choices: { display: "flex", flexDirection: "column", gap: 8 },
  choice: { display: "flex", alignItems: "center", gap: 11, textAlign: "left", padding: "11px 14px", border: `1.5px solid ${LINE}`, borderRadius: 10, background: "#fff", cursor: "pointer", fontSize: 14, lineHeight: 1.4, color: "#3a4356" },
  choiceOn: { borderColor: BLUE, background: BLUE_SOFT },
  ab: { flexShrink: 0, width: 25, height: 25, borderRadius: "50%", border: "1.5px solid #cdced8", display: "grid", placeItems: "center", fontWeight: 700, fontSize: 12, color: MUTED },
  abOn: { background: BLUE, borderColor: BLUE, color: "#fff" },
  ck: { color: BLUE, display: "grid", placeItems: "center" },

  svgChoices: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(84px, 1fr))", gap: 8, maxWidth: 520 },
  svgChoice: { display: "flex", flexDirection: "column", alignItems: "center", gap: 6, padding: "8px", border: `1.5px solid ${LINE}`, borderRadius: 10, background: "#fff", cursor: "pointer", outline: "none", boxShadow: "none", WebkitTapHighlightColor: "transparent" },
  svgChoiceOn: { borderColor: BLUE, background: BLUE_SOFT },
  svgHolder: { display: "grid", placeItems: "center", width: "100%" },

  sliderTop: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 },
  sliderEnd: { fontSize: 12, color: "#94a3b8", fontWeight: 600 },
  sliderVal: { fontSize: 22, fontWeight: 800, color: BLUE, minWidth: 30, textAlign: "center" },
  slider: { width: "100%" },
  sliderTicks: { display: "flex", justifyContent: "space-between", fontSize: 10.5, color: "#b6bcc7", padding: "4px 2px 0" },

  mlWrap: { display: "flex", flexDirection: "column", gap: 9 },
  mlRow: { display: "flex", alignItems: "center", gap: 12, border: `1px solid ${LINE}`, borderRadius: 12, padding: "10px 14px" },
  mlText: { flex: 1, fontSize: 14, color: "#3a4356", lineHeight: 1.4 },
  mlBtns: { display: "flex", gap: 6, flexShrink: 0 },
  mlBtn: { padding: "6px 13px", borderRadius: 8, border: `1px solid ${LINE}`, background: "#fff", fontSize: 12, fontWeight: 700, cursor: "pointer", color: MUTED },
  mlMost: { background: "#dcfce7", borderColor: GREEN, color: "#15803d" },
  mlLeast: { background: "#fee2e2", borderColor: "#dc2626", color: "#b91c1c" },

  open: { width: "100%", padding: "12px 14px", borderRadius: 12, border: `1.5px solid ${LINE}`, fontSize: 14.5, fontFamily: "inherit", resize: "vertical", boxSizing: "border-box" },

  actions: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, marginTop: 18, flexWrap: "wrap" },
  ghost: { display: "flex", alignItems: "center", gap: 6, padding: "12px 20px", background: "#fff", color: "#475569", border: "1px solid #cbd5e1", borderRadius: 11, fontSize: 14, fontWeight: 700, cursor: "pointer" },
  clearBtn: { display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", color: "#94a3b8", fontSize: 13, fontWeight: 700, cursor: "pointer" },
  next: { display: "flex", alignItems: "center", gap: 6, padding: "12px 24px", background: BLUE, color: "#fff", border: "none", borderRadius: 11, fontSize: 14.5, fontWeight: 800, cursor: "pointer", boxShadow: "0 8px 20px rgba(47,91,214,.28)" },
  finish: { display: "flex", alignItems: "center", gap: 6, padding: "12px 24px", background: GREEN, color: "#fff", border: "none", borderRadius: 11, fontSize: 14.5, fontWeight: 800, cursor: "pointer" },
  disabled: { opacity: .45, cursor: "not-allowed", boxShadow: "none" },
  hint: { fontSize: 12.5, color: "#9aa1ad", textAlign: "right", marginTop: 10 },
  err: { marginTop: 14, background: "#fbeaea", border: "1px solid #e5b3ae", color: "#a83e38", padding: "10px 14px", borderRadius: 10, fontSize: 13.5, fontWeight: 600 },

  nav: { background: "#fff", border: `1px solid ${LINE}`, borderRadius: 14, padding: "18px 16px", margin: "22px 22px 22px 6px", boxShadow: "0 2px 12px rgba(20,20,40,.04)", display: "flex", flexDirection: "column", overflow: "hidden", minHeight: 0 },
  navTitle: { fontSize: 15, fontWeight: 800, color: INK, marginBottom: 14, flexShrink: 0 },
  legend: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "9px 10px", marginBottom: 16, flexShrink: 0 },
  legItem: { display: "flex", alignItems: "center", gap: 7, fontSize: 12.5, color: MUTED },
  navScroll: { overflowY: "auto", minHeight: 0, flex: 1, margin: "0 -4px", padding: "0 4px" },
  navGrid: { display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 8, paddingBottom: 4 },
  navCell: { aspectRatio: "1", display: "grid", placeItems: "center", borderRadius: 8, fontSize: 13, fontWeight: 700, border: "1px solid transparent", cursor: "pointer", padding: 0 },
  navPend: { background: "#f1f5f9", color: "#94a3b8" },
  navAns: { background: GREEN_SOFT, color: "#15803d", borderColor: "#c9ebd5" },
  navRev: { background: AMBER_SOFT, color: "#b45309", borderColor: "#fadf9a" },
  navCur: { background: BLUE, color: "#fff", borderColor: BLUE },
  overview: { fontSize: 11, fontWeight: 800, textTransform: "uppercase", letterSpacing: .7, color: "#9aa1ad", margin: "0 2px 10px" },
  donutRow: { display: "flex", gap: 12, alignItems: "center" },
  breakdown: { display: "flex", flexDirection: "column", gap: 6, fontSize: 12, color: MUTED },
  brTotal: { paddingTop: 5, borderTop: `1px solid ${LINE}`, fontWeight: 600 },
  dot: { width: 9, height: 9, borderRadius: "50%", display: "inline-block", marginRight: 6 },
  donut: { width: 96, height: 96, flexShrink: 0 },

  introWrap: { position: "fixed", inset: 0, zIndex: 1000, background: BG, display: "flex", alignItems: "center", justifyContent: "center", padding: 20, overflow: "auto", fontFamily: "Inter, system-ui, Segoe UI, sans-serif" },
  introCard: { width: "100%", maxWidth: 560, background: "#fff", borderRadius: 18, padding: "32px 34px", boxShadow: "0 16px 50px rgba(30,41,59,.12)", border: `1px solid ${LINE}` },
  introTitle: { fontSize: 24, fontWeight: 800, margin: "0 0 4px", color: INK },
  introSub: { fontSize: 13.5, color: MUTED, margin: "0 0 20px" },
  introList: { listStyle: "none", padding: 0, margin: "0 0 20px", display: "flex", flexDirection: "column", gap: 12 },
  introItem: { display: "flex", gap: 11, fontSize: 14.5, lineHeight: 1.5, color: "#475569", alignItems: "flex-start" },
  introIc: { color: BLUE, flexShrink: 0, marginTop: 1 },
  disclaimer: {
    fontSize: 13, lineHeight: 1.6, color: MUTED, background: BLUE_SOFT,
    border: `1px solid ${LINE}`, borderRadius: 10, padding: "12px 14px", margin: "0 0 16px",
  },
  agree: {
    display: "flex", alignItems: "center", gap: 10, fontSize: 16, fontWeight: 800, color: NAVY,
    background: BLUE_SOFT, border: `1.5px solid ${BLUE}`, borderRadius: 10, padding: "12px 16px",
    margin: "0 0 18px", cursor: "pointer",
  },
  primary: { padding: "13px 26px", background: BLUE, color: "#fff", border: "none", borderRadius: 11, fontSize: 15, fontWeight: 800, cursor: "pointer" },
  resumeStats: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, margin: "0 0 20px" },
  resumeStat: { background: "#f6f8fc", border: `1px solid ${LINE}`, borderRadius: 12, padding: "14px 16px", textAlign: "center" },
  resumeStatN: { fontSize: 22, fontWeight: 800, color: INK },
  resumeStatL: { fontSize: 12, color: MUTED, marginTop: 2 },
  resumeRestart: { display: "block", width: "100%", background: "none", border: "none", color: MUTED, fontSize: 13, fontWeight: 600, cursor: "pointer", marginTop: 12, textDecoration: "underline" },

  thanks: { position: "fixed", inset: 0, zIndex: 1200, background: "linear-gradient(160deg,#eef2fe,#eef1f6)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Inter, system-ui, Segoe UI, sans-serif", textAlign: "center", padding: 24 },
  check: { width: 92, height: 92, borderRadius: "50%", margin: "0 auto 18px", background: "linear-gradient(135deg,#16a34a,#22c55e)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 14px 34px rgba(22,163,74,.35)" },
  thanksT: { fontSize: 28, fontWeight: 800, color: "#0f172a", marginBottom: 8 },
};

export const CSS = `
@keyframes ogSpin{to{transform:rotate(360deg)}}
.og-spin{width:44px;height:44px;border:4px solid #d7e0f7;border-top-color:${BLUE};border-radius:50%;animation:ogSpin .8s linear infinite}
@keyframes ogPop{0%{opacity:0;transform:scale(.6)}60%{opacity:1;transform:scale(1.12)}100%{opacity:1;transform:scale(1)}}
.og-pop{animation:ogPop .55s cubic-bezier(.2,.9,.3,1.2) both}
.og-range{accent-color:${BLUE};height:6px;width:100%}
.datatable{border-collapse:collapse;width:100%;font-size:13.5px}
.datatable th,.datatable td{border:1px solid ${LINE};padding:6px 10px;text-align:center}
.datatable th{background:${BLUE_SOFT};font-weight:700}
.og-setup{margin:0 0 8px;font-weight:600}
.og-exam-catbar::-webkit-scrollbar{height:6px}
.og-exam-catbar::-webkit-scrollbar-thumb{background:#d7dbe3;border-radius:6px}
.og-nav-scroll::-webkit-scrollbar{width:6px}
.og-nav-scroll::-webkit-scrollbar-thumb{background:#d7dbe3;border-radius:6px}
/* no black focus ring on click; keep a subtle ring for keyboard users */
.og-exam-grid button{-webkit-tap-highlight-color:transparent}
.og-exam-grid button:focus{outline:none}
.og-exam-grid button:focus-visible{outline:none;box-shadow:0 0 0 2px ${ACCENT}44}
/* Options (text rows + SVG tiles): border/highlight is FULLY state-driven -
   grey/plain when unselected, blue only when actually chosen. Never let a
   focus/keyboard/tap ring make an unselected option look boxed or selected. */
.og-exam-grid .og-svgc:focus,.og-exam-grid .og-svgc:focus-visible,
.og-exam-grid .og-opt:focus,.og-exam-grid .og-opt:focus-visible,
.og-exam-grid .og-opt:active,.og-exam-grid .og-svgc:active{outline:none !important;box-shadow:none !important}
.og-opt{transition:background .12s ease;background:transparent}
.og-opt:hover{background:#f7f9fc}
/* The radio ring answers to the SELECTED state and nothing else. Hover, focus,
   keyboard focus and the mid-tap active state must never darken one ring -
   a single dark circle among four reads to a student as the marked answer. */
.og-exam-grid .og-radio{border-color:#8d97a8 !important;box-shadow:none !important;outline:none !important}
.og-exam-grid .og-radio.on{border-color:${BLUE} !important;box-shadow:0 0 0 3px ${BLUE}1f !important}
.og-exam-grid .og-opt:hover .og-radio,.og-exam-grid .og-opt:focus .og-radio,
.og-exam-grid .og-opt:focus-visible .og-radio,.og-exam-grid .og-opt:active .og-radio,
.og-exam-grid .og-svgc:hover .og-radio,.og-exam-grid .og-svgc:focus .og-radio,
.og-exam-grid .og-svgc:focus-visible .og-radio,.og-exam-grid .og-svgc:active .og-radio{border-color:#8d97a8 !important}
.og-exam-grid .og-opt:hover .og-radio.on,.og-exam-grid .og-opt:focus .og-radio.on,
.og-exam-grid .og-opt:focus-visible .og-radio.on,.og-exam-grid .og-opt:active .og-radio.on,
.og-exam-grid .og-svgc:hover .og-radio.on,.og-exam-grid .og-svgc:focus .og-radio.on,
.og-exam-grid .og-svgc:focus-visible .og-radio.on,.og-exam-grid .og-svgc:active .og-radio.on{border-color:${BLUE} !important}
/* scale visual (SVG) matrix cells + options to fit - no giant grids / scrolling */
.og-exam-grid .og-mcell svg,.og-exam-grid .og-svgh svg{width:100% !important;height:auto !important;display:block}
.og-exam-grid .og-mfig svg{max-width:200px !important;height:auto !important;display:block}
@media (max-width: 1040px){
  .og-exam-grid{grid-template-columns:1fr !important}
  .og-exam-nav{display:none !important}
  .og-exam-grid main{padding:18px 16px 50px !important}
}
@media (max-width: 760px){
  .og-exam-catbar{overflow-x:auto}
  .og-exam-catbar button{flex:0 0 auto !important;min-width:auto !important}
  .og-exam-top{padding:8px 12px !important; gap:8px !important; flex-wrap:wrap}
  .og-exam-topmeta{display:none !important}
  .og-exam-stats{gap:8px !important; padding:6px 10px !important; order:3; width:100%; justify-content:space-between}
  /* keep TIME + QUESTION; drop ANSWERED / MARKED (and their dividers) */
  .og-exam-stats > :nth-child(n+4){display:none !important}
  .og-exam-btn-label{display:none !important}
  .og-exam-topright button{padding:9px 11px !important}
}
@media (max-width: 420px){
  .og-exam-grid main{padding:14px 12px 46px !important}
  .og-exam-introcard{padding:24px 20px !important}
}
`;

export function Stat({ icon, label, value, color }: { icon: string; label: string; value: string; color?: string }) {
  return (
    <div style={S.stat}>
      <span style={{ ...S.statIc, ...(color ? { color } : {}) }}><Icon name={icon} size={17} /></span>
      <div><div style={S.statLabel}>{label}</div><div style={{ ...S.statVal, ...(color ? { color } : {}) }}>{value}</div></div>
    </div>
  );
}

/** The one radio control used by every option in the exam - text rows and
 *  SVG tiles alike. Clearly visible when unselected, filled blue when chosen. */
export function Radio({ on }: { on: boolean }) {
  // The class is what lets CSS pin the ring colour to the SELECTED state alone
  // (see .og-radio in CSS). Without a hook, hover/focus styling on the parent
  // button could darken one unselected ring and read as a hint.
  return (
    <span className={`og-radio${on ? " on" : ""}`} style={{ ...S.radio, ...(on ? S.radioOn : {}) }}>
      {on && <span style={S.radioDot} />}
    </span>
  );
}

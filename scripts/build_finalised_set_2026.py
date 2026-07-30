# -*- coding: utf-8 -*-
"""Render the finalised 2026 question set as a workbook and as Markdown.

Reads finalised_set_2026_data.py — the same module import_finalised_set_2026.py
writes into project/data/*.json — so the reviewable sheet and the live bank
cannot drift apart. Edit the data module, then re-run both scripts.

Outputs:
    project/docs/finalised set 2026.xlsx   reviewable workbook
    project/docs/finalised set 2026.md     renders on GitHub
    ../finalised set 2026.xlsx             convenience mirror (best effort)

Usage:  python scripts/build_finalised_set_2026.py [output.xlsx]
"""

from __future__ import annotations

import shutil
import sys
from pathlib import Path

from openpyxl import Workbook
from openpyxl.styles import Alignment, Border, Font, PatternFill, Side
from openpyxl.utils import get_column_letter

sys.path.insert(0, str(Path(__file__).resolve().parent))
import finalised_set_2026_data as D  # noqa: E402

HERE = Path(__file__).resolve().parent
PROJECT = HERE.parent
OUTER = PROJECT.parent
TARGET = PROJECT / "docs" / "finalised set 2026.xlsx"
MIRROR = OUTER / "finalised set 2026.xlsx"

HEAD_FILL = PatternFill("solid", fgColor="1F3864")
HEAD_FONT = Font(bold=True, color="FFFFFF", size=10)
TOTAL_FILL = PatternFill("solid", fgColor="D9E2F3")
FLAG_FILL = PatternFill("solid", fgColor="FFF2CC")
NEW_FILL = PatternFill("solid", fgColor="E2EFDA")
REQ_FILL = PatternFill("solid", fgColor="FFC7CE")
BODY_FONT = Font(size=10)
THIN = Side(style="thin", color="BFBFBF")
BOX = Border(left=THIN, right=THIN, top=THIN, bottom=THIN)
TOP_WRAP = Alignment(vertical="top", wrap_text=True)
CENTER = Alignment(horizontal="center", vertical="center", wrap_text=True)


def per_option(labels):
    return "\n".join(f"{chr(65 + i)} · {v}" for i, v in enumerate(labels))


def points_str(d):
    return ", ".join(f"{k}+{v}" for k, v in d.items()) if d else "not scored"


def riasec_code(d):
    return "+".join(sorted(d, key=d.get, reverse=True)) if d else "—"


def write_sheet(ws, headers, widths, rows, row_height=100):
    ws.append(headers)
    for c, (h, w) in enumerate(zip(headers, widths), 1):
        cell = ws.cell(row=1, column=c)
        cell.fill, cell.font, cell.alignment, cell.border = HEAD_FILL, HEAD_FONT, CENTER, BOX
        ws.column_dimensions[get_column_letter(c)].width = w
    ws.row_dimensions[1].height = 34
    for r in rows:
        ws.append(r)
    for row in ws.iter_rows(min_row=2, max_row=ws.max_row, max_col=len(headers)):
        for cell in row:
            cell.font, cell.alignment, cell.border = BODY_FONT, TOP_WRAP, BOX
    for r in range(2, ws.max_row + 1):
        ws.row_dimensions[r].height = row_height
        ws.cell(row=r, column=1).alignment = CENTER
    ws.freeze_panes = "C2"


def shade(ws, col, predicate, fill):
    for r in range(2, ws.max_row + 1):
        cell = ws.cell(row=r, column=col)
        if predicate(cell.value):
            cell.fill = fill


def footnote(ws, text, width):
    r = ws.max_row + 2
    ws.cell(row=r, column=1, value="NOTE").font = Font(bold=True, size=10)
    n = ws.cell(row=r, column=2, value=text)
    n.alignment, n.font, n.fill = TOP_WRAP, BODY_FONT, FLAG_FILL
    ws.merge_cells(start_row=r, start_column=2, end_row=r, end_column=width)
    ws.row_dimensions[r].height = 64


# --------------------------------------------------------------------------- #
def build():
    wb = Workbook()
    wb.remove(wb.active)

    # ---- Blueprint
    ws = wb.create_sheet("Blueprint (60)")
    rows = [[rng.split("-")[0][1:], name, rng, count, 5, D.BLUEPRINT_NOTE[name]]
            for name, _cat, count, rng in D.BLUEPRINT]
    rows.append(["", "TOTAL", "Q1-Q60", sum(b[2] for b in D.BLUEPRINT), 5,
                 "8 sections · 60 questions · 5 options each — matches the old count exactly"])
    write_sheet(ws, ["#", "Sheet", "Q.No Range", "Questions", "Options / Q", "Construct Measured"],
                [5, 24, 13, 11, 12, 88], rows, row_height=30)
    for c in range(1, 7):
        ws.cell(row=ws.max_row, column=c).font = Font(bold=True, size=10)
        ws.cell(row=ws.max_row, column=c).fill = TOTAL_FILL

    # ---- interests
    ws = wb.create_sheet("interests")
    rows = []
    for qid, text, opts, source, note in D.INTERESTS:
        rows.append([qid, text, *[o[0] for o in opts],
                     per_option([f"{o[1]} — {D.CLUSTER_NAMES[o[1]]}" for o in opts]),
                     per_option([o[2] for o in opts]),
                     per_option([riasec_code(o[3]) for o in opts]),
                     per_option([points_str(o[3]) for o in opts]),
                     source, note])
    write_sheet(ws, ["Q.No", "Situation", "Option A", "Option B", "Option C", "Option D",
                     "Option E", "Career Cluster (per option)", "Primary Career Matches (per option)",
                     "RIASEC Code (per option)", "RIASEC Weights (per option)", "Source", "Review Note"],
                [7, 40, 30, 30, 30, 30, 30, 30, 50, 16, 24, 26, 46], rows, row_height=112)
    shade(ws, 12, lambda v: isinstance(v, str) and v.startswith(D.KEPT[:12]), NEW_FILL)
    shade(ws, 13, lambda v: bool(v), FLAG_FILL)

    # ---- aptitude
    ws = wb.create_sheet("aptitude")
    rows = [[qid, text, *opts, correct, dim, img, spec, cl, pr, src, note]
            for (qid, text, opts, correct, dim, cl, pr, img, spec, src, note) in D.APTITUDE]
    write_sheet(ws, ["Q.No", "Question", "Option A", "Option B", "Option C", "Option D", "Option E",
                     "Correct Answer", "Aptitude Dimension", "Image", "Image / Visual Specification",
                     "Career Clusters", "Representative Professions", "Source", "Review Note"],
                [7, 44, 16, 16, 18, 16, 18, 9, 20, 12, 58, 26, 30, 24, 62], rows, row_height=104)
    for r in range(2, ws.max_row + 1):
        c8, c10 = ws.cell(row=r, column=8), ws.cell(row=r, column=10)
        c8.alignment, c8.font, c10.alignment = CENTER, Font(bold=True, size=10), CENTER
        if c10.value == "Required":
            c10.font, c10.fill = Font(bold=True, size=10, color="9C0006"), REQ_FILL
        elif c10.value == "Recommended":
            c10.fill = FLAG_FILL
    shade(ws, 15, lambda v: isinstance(v, str) and v.startswith("DEFECT"), REQ_FILL)
    shade(ws, 15, lambda v: bool(v) and not str(v).startswith("DEFECT"), FLAG_FILL)

    # ---- personality
    ws = wb.create_sheet("personality")
    rows = [[qid, text, *[t for t, _p in opts], trait, facet,
             per_option([points_str(p) for _t, p in opts]), D.CLIENT, note]
            for qid, text, opts, trait, facet, note in D.PERSONALITY]
    write_sheet(ws, ["Q.No", "Situation", "Option A", "Option B", "Option C", "Option D", "Option E",
                     "Big Five Trait", "Personality Facet", "Trait Weights (per option)",
                     "Source", "Review Note"],
                [7, 44, 30, 30, 30, 30, 16, 18, 18, 26, 20, 58], rows, row_height=96)
    shade(ws, 12, lambda v: bool(v), FLAG_FILL)
    footnote(ws, D.PERSONALITY_NOTE, 12)

    # ---- Strenghts
    ws = wb.create_sheet("Strenghts")
    rows = [[qid, text, *[o[0] for o in opts], domains,
             per_option(D.STRENGTHS_DOMAINS[qid]),
             per_option(D.STRENGTHS_GROUPS[qid]),
             per_option([points_str(w) for w in D.STRENGTHS_WEIGHTS[qid]]),
             cl, pr, D.STRENGTHS[0][2][0][3]]
            for qid, text, opts, domains, cl, pr in D.STRENGTHS]
    write_sheet(ws, ["Q.No", "Scenario", "Option A", "Option B", "Option C", "Option D", "Option E",
                     "Domains Measured", "Domain (per option)", "Report Group (per option)",
                     "Strength Weights (per option)", "Career Clusters", "Example Professions", "Source"],
                [7, 40, 30, 30, 30, 30, 30, 28, 20, 22, 30, 32, 36, 20], rows, row_height=112)
    footnote(ws, D.STRENGTHS_NOTE, 14)

    # ---- motivators
    ws = wb.create_sheet("motivators")
    rows = [[qid, text, *[o[0] for o in opts],
             ", ".join(dict.fromkeys(max(o[1], key=o[1].get) for o in opts)),
             per_option([max(o[1], key=o[1].get) for o in opts]),
             per_option([points_str(o[1]) for o in opts]),
             cl, pr, per_option([o[2] for o in opts])]
            for qid, text, opts, cl, pr in D.MOTIVATORS]
    write_sheet(ws, ["Q.No", "Question", "Option A", "Option B", "Option C", "Option D", "Option E",
                     "Motivator Dimensions Measured", "Motivator (per option)",
                     "Motivator Weights (per option)", "Career Clusters", "Example Professions",
                     "Source (per option)"],
                [7, 42, 30, 30, 30, 30, 32, 28, 18, 30, 36, 36, 18], rows, row_height=112)

    # ---- Learning styles
    ws = wb.create_sheet("Learning styles")
    rows = [[qid, text, *options, per_option(D.LEARNING_STYLES_ORDER),
             " / ".join(D.LEARNING_STYLES_ORDER), cl, pr, src]
            for qid, text, options, cl, pr, src in D.LEARNING]
    write_sheet(ws, ["Q.No", "Scenario", "Option A (Visual)", "Option B (Auditory)",
                     "Option C (Reading/Writing)", "Option D (Kinesthetic)", "Option E (Multimodal)",
                     "Learning Preference (per option)", "Preferences Measured",
                     "Career Clusters", "Example Professions", "Source"],
                [7, 44, 28, 28, 30, 30, 38, 22, 40, 38, 44, 20], rows, row_height=100)

    # ---- multiple intellligence
    ws = wb.create_sheet("multiple intellligence")
    rows = [[qid, text, *options, per_option(D.MI_ORDER),
             per_option([points_str(p) for p in D.MI_POINTS]), cl, pr, D.CLIENT]
            for qid, text, options, cl, pr in D.MI]
    write_sheet(ws, ["Q.No", "Question", "Option A", "Option B", "Option C", "Option D", "Option E",
                     "Primary Intelligence (per option)", "Intelligence Weights (per option)",
                     "Career Clusters", "Example Professions", "Source"],
                [7, 44, 32, 32, 32, 34, 32, 26, 32, 34, 40, 20], rows, row_height=104)

    # ---- emotional intelligence
    ws = wb.create_sheet("emotional intelligence")
    rows = [[qid, text, *options, per_option(D.EI_ORDER), dim, fw, cl, pr, D.CLIENT]
            for qid, text, options, dim, fw, cl, pr in D.EI]
    write_sheet(ws, ["Q.No", "Question", "Option A (Self-Awareness)", "Option B (Self-Regulation)",
                     "Option C (Self-Motivation)", "Option D (Empathy)",
                     "Option E (Relationship Mgmt)", "EQ Domain (per option)",
                     "Question Dimension", "Framework Inspiration", "Career Clusters",
                     "Example Professions", "Source"],
                [7, 42, 28, 28, 28, 28, 30, 24, 22, 20, 30, 36, 20], rows, row_height=100)
    footnote(ws, D.EI_NOTE, 13)

    # ---- Review Notes
    ws = wb.create_sheet("Review Notes")
    n = []
    n.append(["Interests", "Only 10 supplied", D.INTERESTS_SHORTFALL, "Needs 2 more"])
    n.append(["Strengths", "Construct", D.STRENGTHS_NOTE, "Needs a decision"])
    n.append(["Personality", "Option E + wording", D.PERSONALITY_NOTE, "Handled — review"])
    n.append(["Emotional intelligence", "Scoring model", D.EI_NOTE, "Handled — review"])
    for qid, _t, _o, _c, _d, _cl, _p, img, spec, _s, note in D.APTITUDE:
        if str(note).startswith("DEFECT"):
            n.append(["Aptitude", f"{qid} — defect, left as supplied", note, "Needs a fix"])
        if img in ("Required", "Recommended"):
            n.append(["Aptitude", f"{qid} — artwork {img.lower()}", spec, img])
    for what, why in D.APTITUDE_DROPPED:
        n.append(["Aptitude", f"dropped: {what}", why, "Over count"])
    for what, why in D.STRENGTHS_DROPPED:
        n.append(["Strengths", f"dropped: {what}", why, "Over count"])
    for what, why in D.LEARNING_DROPPED:
        n.append(["Learning styles", f"dropped: {what}", why, "Over count"])
    for what, why in D.EI_DROPPED:
        n.append(["Emotional intelligence", f"dropped: {what}", why, "Over count"])
    n.append(["Bank", "Live questions replaced",
              "scripts/import_finalised_set_2026.py writes this set into "
              "project/data/*.json (classes 9-10, Set 1). All other life stages and sets are "
              "untouched. Previous bank kept as data/*.pre-2026.json.", "Done"])
    write_sheet(ws, ["Sheet", "Item", "Detail", "Status"], [22, 46, 104, 18], n, row_height=48)
    shade(ws, 4, lambda v: v in ("Needs a fix", "Needs a decision", "Needs 2 more", "Required"), REQ_FILL)
    shade(ws, 4, lambda v: v in ("Recommended", "Over count"), FLAG_FILL)
    shade(ws, 4, lambda v: v in ("Done", "Handled — review"), NEW_FILL)

    # ---- verify
    problems, grand = [], 0
    for name, _cat, count, _rng in D.BLUEPRINT:
        data = [r for r in wb[name].iter_rows(min_row=2, values_only=True)
                if r[0] and str(r[0]).startswith("Q")]
        grand += len(data)
        if len(data) != count:
            problems.append(f"{name}: {len(data)} questions, blueprint says {count}")
        for row in data:
            if any(row[c] in (None, "") for c in range(2, 7)):
                problems.append(f"{name} {row[0]}: fewer than 5 options")
    if grand != 60:
        problems.append(f"total is {grand}, expected 60")
    if problems:
        raise SystemExit("VERIFY FAILED:\n  " + "\n  ".join(problems))

    TARGET.parent.mkdir(parents=True, exist_ok=True)
    wb.save(TARGET)
    print(f"wrote {TARGET.relative_to(PROJECT)}")
    for name, _c, count, rng in D.BLUEPRINT:
        print(f"  {name:<24} {count:>2} questions  {rng}")
    print(f"  {'TOTAL':<24} {grand:>2} questions  · 5 options each")


# --------------------------------------------------------------------------- #
def write_markdown(path: Path):
    L = ["# Finalised Question Set 2026", "",
         "60 questions · 5 options each · classes 9-10. Questions and options are exactly as "
         "supplied in the sheet; mappings are added. Generated from "
         "`project/scripts/finalised_set_2026_data.py`, which is also what "
         "`import_finalised_set_2026.py` writes into the live bank — edit that module, not this file.",
         "", "| # | Section | Q.No | Questions | Options | Construct |", "|---|---|---|---|---|---|"]
    for i, (name, _cat, count, rng) in enumerate(D.BLUEPRINT, 1):
        L.append(f"| {i} | {name} | {rng} | {count} | 5 | {D.BLUEPRINT_NOTE[name]} |")
    L.append(f"| | **TOTAL** | Q1-Q60 | **{sum(b[2] for b in D.BLUEPRINT)}** | 5 | |")
    L.append("")

    def block(texts, tags=None):
        for i, t in enumerate(texts):
            L.append(f"- **{chr(65 + i)}.** {t}" + (f" — _{tags[i]}_" if tags else ""))
        L.append("")

    L += ["---", "", "## 1. Interests — Q1-Q12", "", f"> {D.INTERESTS_SHORTFALL}", ""]
    for qid, text, opts, source, note in D.INTERESTS:
        L += [f"### {qid}. {text}", ""]
        block([o[0] for o in opts],
              [f"{o[1]} · {D.CLUSTER_NAMES[o[1]]} · RIASEC {points_str(o[3])}" for o in opts])
        L.append(f"_Source: {source}_")
        if note:
            L += ["", f"> **Note.** {note}"]
        L.append("")

    L += ["---", "", "## 2. Aptitude — Q13-Q22", "",
          "`Required` in the Image line means the item cannot be answered without artwork.", ""]
    for (qid, text, opts, correct, dim, cl, pr, img, spec, src, note) in D.APTITUDE:
        L += [f"### {qid}. {text}", ""]
        block([f"{o}{'  ✅' if chr(65 + i) == correct else ''}" for i, o in enumerate(opts)])
        L += [f"- **Answer:** {correct}", f"- **Dimension:** {dim}",
              f"- **Image:** {img} — {spec}", f"- **Clusters:** {cl}",
              f"- **Professions:** {pr}", f"- _Source: {src}_"]
        if note:
            L += ["", f"> **Note.** {note}"]
        L.append("")

    L += ["---", "", "## 3. Personality — Q23-Q34", "", f"> {D.PERSONALITY_NOTE}", ""]
    for qid, text, opts, trait, facet, note in D.PERSONALITY:
        L += [f"### {qid}. {text}", ""]
        block([t for t, _p in opts], [points_str(p) for _t, p in opts])
        L.append(f"- **Trait / facet:** {trait} · {facet}")
        if note:
            L += ["", f"> **Note.** {note}"]
        L.append("")

    L += ["---", "", "## 4. Strengths — Q35-Q42", "", f"> {D.STRENGTHS_NOTE}", ""]
    for qid, text, opts, client_dom, cl, pr in D.STRENGTHS:
        L += [f"### {qid}. {text}", ""]
        block([o[0] for o in opts],
              [f"{o[1]} · engine {points_str(o[2])} · {o[3]}" for o in opts])
        L += [f"- **Sheet domains:** {client_dom}", f"- **Clusters:** {cl}",
              f"- **Professions:** {pr}", ""]

    L += ["---", "", "## 5. Motivators — Q43-Q47", ""]
    for qid, text, opts, cl, pr in D.MOTIVATORS:
        L += [f"### {qid}. {text}", ""]
        block([o[0] for o in opts], [f"{points_str(o[1])} · {o[2]}" for o in opts])
        L += [f"- **Clusters:** {cl}", f"- **Professions:** {pr}", ""]

    L += ["---", "", "## 6. Learning Styles — Q48-Q51", ""]
    for qid, text, options, cl, pr, src in D.LEARNING:
        L += [f"### {qid}. {text}", ""]
        block(options, D.LEARNING_STYLES_ORDER)
        L += [f"- **Clusters:** {cl}", f"- _Source: {src}_", ""]

    L += ["---", "", "## 7. Multiple Intelligence — Q52-Q55", "",
          "> The one section the sheet supplied complete — used exactly as given.", ""]
    for qid, text, options, cl, pr in D.MI:
        L += [f"### {qid}. {text}", ""]
        block(options, D.MI_ORDER)
        L += [f"- **Clusters:** {cl}", f"- **Professions:** {pr}", ""]

    L += ["---", "", "## 8. Emotional Intelligence — Q56-Q60", "", f"> {D.EI_NOTE}", ""]
    for qid, text, options, dim, fw, cl, pr in D.EI:
        L += [f"### {qid}. {text}", ""]
        block(options, D.EI_ORDER)
        L += [f"- **Question dimension:** {dim} · _{fw}_", f"- **Clusters:** {cl}", ""]

    L += ["---", "", "## Open items", "", "| Area | Item | Status |", "|---|---|---|"]
    for qid, _t, _o, _c, _d, _cl, _p, img, _s, _src, note in D.APTITUDE:
        if str(note).startswith("DEFECT"):
            L.append(f"| Aptitude | {qid} — defect, left as supplied | Needs a fix |")
        if img in ("Required", "Recommended"):
            L.append(f"| Aptitude | {qid} artwork | {img} |")
    L.append("| Interests | Only 10 questions supplied; Q11-Q12 kept from the live bank | Needs 2 more |")
    L.append("| Strengths | Section measures career interest, not working style | Needs a decision |")
    L += ["", "Dropped items and every correction are on the **Review Notes** tab of the workbook.", ""]

    path.write_text("\n".join(L), encoding="utf-8")
    return path


if __name__ == "__main__":
    if len(sys.argv) > 1:
        TARGET = Path(sys.argv[1]).resolve()
        MIRROR = None
    build()
    md = write_markdown(TARGET.with_suffix(".md"))
    print(f"wrote {md.relative_to(PROJECT) if md.is_relative_to(PROJECT) else md}")
    if MIRROR:
        try:
            shutil.copy2(TARGET, MIRROR)
            print(f"mirrored to {MIRROR}")
        except PermissionError:
            print(f"could not refresh {MIRROR.name} — open in Excel (repo copy is current)")

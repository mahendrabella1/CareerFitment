#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Exports every authored FIGURE in the demo for review.

Salary bands, entrance-exam timings and college lists are authored from general
sector knowledge, not read from a live source. That is fine for a demo and not
fine to leave unchecked once real students see it, so this prints all of them
as one document a domain expert can go through in a sitting.

Three tables:

  1. Salary bands per career - the numbers most likely to be challenged, and
     the ones a student is most likely to act on.
  2. Entrance exams per family - names and rough windows.
  3. College lists per family - representative institutions.

Careers are grouped by family, and a career appears in the salary table only
once. Where a career states no salary of its own it inherits its family's,
which is flagged so a reviewer knows whether they are correcting one career or
a whole family at once.

Writes:  docs/demo-11-12-figures-for-review.md

Run:     python scripts/export_demo_figures.py
"""

import io
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
PROJECT = os.path.join(HERE, "..")
OUT = os.path.join(PROJECT, "docs", "demo-11-12-figures-for-review.md")

sys.path.insert(0, HERE)
from demo_11_12_families import FAMILIES, FIGURES              # noqa: E402
from demo_11_12_careers_stem import CAREERS_STEM               # noqa: E402
from demo_11_12_careers_commerce import CAREERS_COMMERCE       # noqa: E402
from demo_11_12_careers_creative import CAREERS_CREATIVE       # noqa: E402

CAREERS = CAREERS_STEM + CAREERS_COMMERCE + CAREERS_CREATIVE


def main():
    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    by_family = {}
    for c in CAREERS:
        by_family.setdefault(c["family"], []).append(c)

    with io.open(OUT, "w", encoding="utf-8") as fh:
        fh.write("# Demo figures - for expert review\n\n")
        fh.write("Every number below is **authored**, not sourced from a live feed of\n")
        fh.write("salary surveys, fee schedules or exam calendars.\n\n")
        fh.write("| | |\n|---|---|\n")
        fh.write("| Compiled | {} |\n".format(FIGURES["asOf"]))
        fh.write("| Basis | {} |\n".format(FIGURES["basis"]))
        fh.write("| Confidence | {} |\n".format(FIGURES["confidence"]))
        fh.write("| Review needed | {} |\n\n".format("yes" if FIGURES["reviewNeeded"] else "no"))
        fh.write("The report shows a caveat beside each of these blocks, so a student is\n")
        fh.write("not invited to read them as measurements. Correct anything wrong here,\n")
        fh.write("then bump `FIGURES['asOf']` in `scripts/demo_11_12_families.py` and\n")
        fh.write("re-run `python scripts/build_demo_careers.py`.\n\n")

        # ---------------------------------------------------------- salaries
        fh.write("## 1. Salary bands\n\n")
        fh.write("`family` means the career inherits its family's band rather than\n")
        fh.write("stating its own - correcting it there fixes every career in that family.\n\n")
        fh.write("| Career | Family | Starting | Mid-career | Senior | Source |\n")
        fh.write("|--------|--------|----------|------------|--------|--------|\n")
        rows = 0
        for family in sorted(by_family):
            for c in sorted(by_family[family], key=lambda x: x["title"]):
                own = "salary" in c
                sal = c.get("salary", FAMILIES[family]["salary"])
                fh.write("| {} | {} | {} | {} | {} | {} |\n".format(
                    c["title"], FAMILIES[family]["label"],
                    sal["entry"], sal["mid"], sal["senior"],
                    "career" if own else "family"))
                rows += 1

        # ------------------------------------------------------------- exams
        fh.write("\n## 2. Entrance exams\n\n")
        fh.write("Windows are the shape of the calendar, not exact dates.\n\n")
        exam_rows = 0
        for family in sorted(FAMILIES):
            fam = FAMILIES[family]
            fh.write("### {}\n\n".format(fam["label"]))
            fh.write("| Exam | When | What it opens |\n|------|------|---------------|\n")
            for e in fam["entranceExams"]:
                fh.write("| {} | {} | {} |\n".format(e["name"], e["when"], e["opens"]))
                exam_rows += 1
            overrides = [c for c in by_family.get(family, []) if "entranceExams" in c]
            if overrides:
                fh.write("\nCareers overriding the above: {}\n".format(
                    ", ".join(sorted(c["title"] for c in overrides))))
                for c in sorted(overrides, key=lambda x: x["title"]):
                    fh.write("\n**{}**\n\n".format(c["title"]))
                    fh.write("| Exam | When | What it opens |\n|------|------|---------------|\n")
                    for e in c["entranceExams"]:
                        fh.write("| {} | {} | {} |\n".format(e["name"], e["when"], e["opens"]))
                        exam_rows += 1
            fh.write("\n")

        # ---------------------------------------------------------- colleges
        fh.write("## 3. College lists\n\n")
        fh.write("Representative institutions, not rankings.\n\n")
        fh.write("| Family | Institutions |\n|--------|-------------|\n")
        for family in sorted(FAMILIES):
            fh.write("| {} | {} |\n".format(
                FAMILIES[family]["label"], "; ".join(FAMILIES[family]["topColleges"])))
        fh.write("\n### Career-specific college lists\n\n")
        fh.write("| Career | Institutions |\n|--------|-------------|\n")
        col_overrides = 0
        for c in sorted(CAREERS, key=lambda x: x["title"]):
            if "topColleges" in c:
                fh.write("| {} | {} |\n".format(c["title"], "; ".join(c["topColleges"])))
                col_overrides += 1

    print("Wrote", os.path.relpath(OUT, PROJECT))
    print("  {} salary bands ({} stated per career, {} inherited from a family)".format(
        rows,
        sum(1 for c in CAREERS if "salary" in c),
        rows - sum(1 for c in CAREERS if "salary" in c)))
    print("  {} entrance-exam entries".format(exam_rows))
    print("  {} family college lists + {} career-specific ones".format(
        len(FAMILIES), col_overrides))
    print("  compiled {} - review flag: {}".format(
        FIGURES["asOf"], "SET" if FIGURES["reviewNeeded"] else "clear"))


if __name__ == "__main__":
    sys.stdout.reconfigure(encoding="utf-8")
    main()

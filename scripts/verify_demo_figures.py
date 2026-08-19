#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Audits the authored salary bands for internal consistency.

What this can and cannot do
---------------------------
It CANNOT tell you whether "Rs 6-25 LPA" is the right number for a graduate
software engineer in India. Nothing here has access to a salary survey, and
pretending otherwise would be worse than the current honest caveat. That
judgement needs a domain expert working from
docs/demo-11-12-figures-for-review.md.

What it CAN do is catch the errors that are checkable without a source, and
those are the ones most likely to embarrass:

  * a band that goes backwards - senior paying less than mid, or a range whose
    low is above its high
  * a career whose entry pay exceeds its own senior pay
  * bands that are identical across every stage, which usually means a
    copy-paste rather than a judgement
  * ranges so wide they say nothing (a 50x spread is not a range, it is a
    shrug)
  * malformed or unparseable text where a number was intended

Figures are normalised to lakh per annum (1 Cr = 100 LPA) before comparison.
Deliberately prose entries ("Often nothing for 1-3 years") are reported
separately rather than failed - a founder's pay genuinely is not a range.

Run:  python scripts/verify_demo_figures.py
"""

import os
import re
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
PROJECT = os.path.join(HERE, "..")

sys.path.insert(0, HERE)
from demo_11_12_families import FAMILIES                       # noqa: E402
from demo_11_12_careers_stem import CAREERS_STEM               # noqa: E402
from demo_11_12_careers_commerce import CAREERS_COMMERCE       # noqa: E402
from demo_11_12_careers_creative import CAREERS_CREATIVE       # noqa: E402

CAREERS = CAREERS_STEM + CAREERS_COMMERCE + CAREERS_CREATIVE
STAGES = ["entry", "mid", "senior"]

# "Rs 6-25 LPA", "Rs 60 LPA-2 Cr+", "Rs 35 LPA-1 Cr+ (consultant)"
NUM = r"(\d+(?:\.\d+)?)"
UNIT = r"\s*(LPA|Cr)?"


def to_lakh(value, unit):
    return float(value) * (100.0 if unit == "Cr" else 1.0)


def parse_band(text):
    """Return (low, high) in lakh per annum, or None if the text is prose."""
    t = text.replace(",", "")
    # Strip any parenthetical qualifier - "(fresh CA)", "(post-MD)".
    t = re.sub(r"\([^)]*\)", "", t)
    m = re.search(NUM + UNIT + r"\s*[-–]\s*" + NUM + UNIT, t)
    if not m:
        return None
    lo_v, lo_u, hi_v, hi_u = m.groups()
    # "Rs 6-25 LPA": the unit trails the pair, so an absent first unit inherits
    # the second. "Rs 60 LPA-2 Cr": both are stated.
    lo_u = lo_u or hi_u or "LPA"
    hi_u = hi_u or "LPA"
    return to_lakh(lo_v, lo_u), to_lakh(hi_v, hi_u)


def main():
    problems = []
    prose = []
    parsed_count = 0

    entries = [(c["title"], c["family"], c["salary"]) for c in CAREERS if "salary" in c]
    entries += [("[family] " + f["label"], k, f["salary"]) for k, f in FAMILIES.items()]

    for title, family, salary in entries:
        bands = {}
        for stage in STAGES:
            raw = salary.get(stage, "")
            if not raw:
                problems.append("{}: no {} band at all".format(title, stage))
                continue
            band = parse_band(raw)
            if band is None:
                prose.append("{} [{}]: {!r}".format(title, stage, raw))
                continue
            parsed_count += 1
            lo, hi = band
            if lo > hi:
                problems.append("{} [{}]: range runs backwards, {} to {}".format(title, stage, lo, hi))
            if hi > 0 and hi / max(lo, 0.01) > 50:
                problems.append("{} [{}]: {}x spread is too wide to mean anything ({!r})".format(
                    title, stage, round(hi / max(lo, 0.01)), raw))
            bands[stage] = band

        # Progression must not go backwards.
        for a, b in [("entry", "mid"), ("mid", "senior")]:
            if a in bands and b in bands:
                if bands[b][0] < bands[a][0]:
                    problems.append("{}: {} floor ({}) is below {} floor ({})".format(
                        title, b, bands[b][0], a, bands[a][0]))
                if bands[b][1] < bands[a][1]:
                    problems.append("{}: {} ceiling ({}) is below {} ceiling ({})".format(
                        title, b, bands[b][1], a, bands[a][1]))
        if "entry" in bands and "senior" in bands and bands["entry"][1] > bands["senior"][1]:
            problems.append("{}: entry ceiling exceeds senior ceiling".format(title))
        if len(bands) == 3 and len({bands[s] for s in STAGES}) == 1:
            problems.append("{}: all three bands are identical - looks copy-pasted".format(title))

    print("Salary bands audited: {} careers + {} families".format(
        sum(1 for c in CAREERS if "salary" in c), len(FAMILIES)))
    print("  {} bands parsed numerically, {} deliberately prose".format(parsed_count, len(prose)))
    if prose:
        print()
        print("Prose bands (not an error - some careers genuinely have no range):")
        for p in prose:
            print("  " + p)
    print()
    print("NOTE: this checks internal consistency only. Whether the numbers are")
    print("      RIGHT needs a domain expert - see docs/demo-11-12-figures-for-review.md")

    if problems:
        print()
        print("{} PROBLEM(S):".format(len(problems)))
        for p in problems:
            print("  " + p)
        sys.exit(1)
    print()
    print("All salary bands are internally consistent.")


if __name__ == "__main__":
    sys.stdout.reconfigure(encoding="utf-8")
    main()

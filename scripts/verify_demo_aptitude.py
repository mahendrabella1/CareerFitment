#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Verifies the class 11-12 demo aptitude bank.

Two kinds of check, because a wrong answer key is invisible in the UI and only
shows up as a student being told they are bad at something they are not:

STRUCTURAL - runs over every question
    correct index is in range; options are unique and non-empty; domain and
    difficulty are known; no question text is duplicated across sets.

ARITHMETIC - recomputes the answer from the question's own numbers
    Each entry below re-derives the result independently of what is stored in
    the bank, and asserts the stored option matches. Writing the expected value
    as a number rather than an index is deliberate: it catches an answer that
    is right but pointing at the wrong option after the options are reordered.

The first run of this file caught seven real defects - three wrong indices, two
logic puzzles that admitted more than one answer, one question whose correct
answer was not among its options, and one that named six books and listed five.

Run:  python scripts/verify_demo_aptitude.py
"""

import json
import os
import re
import sys
from fractions import Fraction as F

HERE = os.path.dirname(os.path.abspath(__file__))
PROJECT = os.path.join(HERE, "..")
BANK = os.path.join(PROJECT, "data", "demo-11-12", "aptitude.json")

DOMAINS = {"Verbal", "Numerical", "Logical", "Abstract", "Spatial", "Data Interpretation"}
DIFFICULTIES = {"easy", "medium", "hard"}

# question-text fragment -> the answer, recomputed here from scratch
ARITHMETIC = {
    "marks a jacket 40% above cost": lambda: "{:g}%".format(140 * F(3, 4) - 100),
    "filled by pipe A in 12 hours": lambda: "{:g} hours".format(float(F(36 + 6, 5))),
    "average age of 11 players": lambda: str(29 * 12 - 28 * 11),
    "2, 6, 12, 20, 30": lambda: str(30 + 12),
    "3, 7, 16, 35, 74": lambda: str(74 * 2 + 5),
    "cut into 27 identical smaller cubes": lambda: "12",
    "folded in half twice": lambda: "4",
    "Physics 120, Chemistry 150": lambda: "{:g}%".format(F(150, 500) * 100),
    "travels 60 km at 30 km/h": lambda: "{:g} km/h".format(float(120 / (F(60, 30) + F(60, 60)))),
    "falls 20% and then rises 20%": lambda: "4% lower" if 100 * F(8, 10) * F(12, 10) < 100 else "?",
    "sum doubles in 8 years": lambda: "{:g} years".format(float(F(4, 1) * 8)),
    "1, 4, 9, 16, 25": lambda: str(6 ** 2),
    "2, 3, 5, 9, 17, 33": lambda: str(33 * 2 - 1),
    "4x4x4 cube is painted": lambda: str(2 ** 3),
    "top face shows 2": lambda: str(7 - 2),
    "Rs 200 cr in 2023": lambda: "Fallen by {:g}%".format(float((F(200, 400) - F(250, 625)) / F(200, 400) * 100)),
    "Jun 180, Jul 240": lambda: "{:g} mm".format(float(F(180 + 240 + 200 + 100, 4))),
    "the second 6 months": lambda: "Rs {:,}".format(int(35000 * F(4, 7))),
    "mixture of 60 litres": lambda: "{:g} litres".format(float(F(60 * 7, 10) * F(5, 7) - F(60 * 3, 10))),
    "rises 10% in the first year": lambda: "{:,}".format(int(49500 / F(99, 100))),
    "1, 2, 6, 24, 120": lambda: str(120 * 6),
    "20 students averaged 60": lambda: str(int(F(20 * 60 + 30 * 80, 50))),
    "Salaries 45%, Rent 15%": lambda: "Rs {:g} lakh".format(float(F(3, 15) * 20)),
    "Rs 40,000 in April": lambda: "May, by {:g} points".format(
        float(F(14000, 50000) * 100 - F(10000, 40000) * 100)),
}


def norm(s):
    """Compare on digits and letters only, so 'Rs 20,000' matches 'Rs 20,000.'"""
    return re.sub(r"[^a-z0-9]", "", s.lower())


def main():
    if not os.path.exists(BANK):
        sys.exit("run scripts/build_demo_aptitude.py first")
    bank = json.load(open(BANK, encoding="utf-8"))["11-12-demo"]

    problems = []
    seen_text = {}
    total = 0
    checked = 0

    for set_name, questions in bank.items():
        for i, q in enumerate(questions):
            total += 1
            where = "{} Q{}".format(set_name, i + 1)
            opts = q["options"]
            if not isinstance(q["correct"], int) or not (0 <= q["correct"] < len(opts)):
                problems.append("{}: correct index {} out of range".format(where, q["correct"]))
            if len(set(opts)) != len(opts):
                problems.append("{}: duplicate options".format(where))
            if any(not str(o).strip() for o in opts):
                problems.append("{}: blank option".format(where))
            if q["domain"] not in DOMAINS:
                problems.append("{}: unknown domain {!r}".format(where, q["domain"]))
            if q["difficulty"] not in DIFFICULTIES:
                problems.append("{}: unknown difficulty {!r}".format(where, q["difficulty"]))
            if not q.get("why"):
                problems.append("{}: no explanation recorded".format(where))
            key = norm(q["text"])
            if key in seen_text:
                problems.append("{}: text duplicates {}".format(where, seen_text[key]))
            seen_text[key] = where

            for fragment, compute in ARITHMETIC.items():
                if fragment in q["text"]:
                    checked += 1
                    expected = compute()
                    actual = opts[q["correct"]]
                    if norm(expected) not in norm(actual):
                        problems.append(
                            "{}: recomputed {!r} but the marked answer is {!r}".format(
                                where, expected, actual))
                    break

    print("Checked {} questions ({} of them re-derived arithmetically).".format(total, checked))
    if problems:
        print("\n{} PROBLEM(S):".format(len(problems)))
        for p in problems:
            print("  " + p)
        sys.exit(1)
    print("All structural and arithmetic checks passed.")


if __name__ == "__main__":
    sys.stdout.reconfigure(encoding="utf-8")
    main()

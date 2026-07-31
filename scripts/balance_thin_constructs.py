# -*- coding: utf-8 -*-
"""Give the barely-measured constructs enough items to be measurable.

The problem
-----------
Shuffling option order fixed the positional tells everywhere except where a
construct appears exactly ONCE in its whole section. A single occurrence can
only ever sit in one slot, so no ordering helps — and worse, a dimension
measured by one option out of twenty is not really measured at all: a student's
score on it turns entirely on a single click.

    motivators              Security 1 of 20 slots, Learning 1
                            (against Innovation 5, Impact 5)
    multiple intelligence   Musical 1 of 16, Naturalistic 1
                            (against Logical-Mathematical 3, Spatial 3)

So "Security" and "Musical" were effectively decorative: present in the report,
but resting on one answer each.

The fix
-------
Add a fifth option to each item in those two sections, the same purely additive
approach used for the missing health option in interests. No existing option,
weight or wording changes, so nothing a student could already say changes
meaning.

One weighting is also corrected: motivators Q44 "Advanced training in the thing
I'm already best at" was scored Achievement-primary with Learning secondary.
Advanced training is learning; the primary and secondary are swapped.

Every option added here has a cost, in keeping with the rest of the bank — a
steady path means no surprises, learning something outside your subject means
time away from what you are good at.

Run shuffle_option_order.py afterwards, or the new options sit last on every
item and reintroduce exactly the positional tell this bank just had.

Usage:  python scripts/balance_thin_constructs.py [--dry-run]
"""

from __future__ import annotations

import json
import sys
from collections import Counter
from pathlib import Path

BANK = Path(__file__).resolve().parent.parent / "data" / "assessment-questions.json"
STAGE, SET = "9-10", "Set 1"

# category -> qid -> (option text, weights)
ADD = {
    "motivators": {
        "Q43": ("Work on something well-defined where I know exactly what is expected.",
                {"Security": 3, "Achievement": 1}),
        "Q44": ("Time and space to learn something well outside my own subject.",
                {"Learning": 3, "Innovation": 1}),
        "Q45": ("Building something steady that supports my family for life.",
                {"Security": 3, "Impact": 1}),
        "Q46": ("A challenge with clear rules, where I know what counts as done.",
                {"Security": 3, "Achievement": 1}),
        "Q47": ("A place where I take charge and am judged on the results.",
                {"Leadership": 3, "Achievement": 2}),
    },
    "multiple_intelligence": {
        "Q52": ("Choose the music and mix the sound.",
                {"Musical": 3, "Spatial": 1}),
        "Q53": ("Build a rough model and test the idea by hand.",
                {"Bodily–Kinesthetic": 3, "Logical–Mathematical": 1}),
        "Q54": ("Spend it with people, organising something together.",
                {"Interpersonal": 3, "Linguistic": 1}),
        "Q55": ("“You notice things about the natural world the rest of us miss.”",
                {"Naturalistic": 3, "Logical–Mathematical": 1}),
    },
}
FIELD = {"motivators": "motivatorPoints", "multiple_intelligence": "intelPoints"}

# Corrections to existing weightings, where the primary was simply wrong.
REWEIGHT = {
    ("motivators", "Q44", "Advanced training in the thing I'm already best at."):
        ({"Learning": 3, "Achievement": 2}, "advanced training is learning, not achievement"),
}


def spread(qs, field) -> Counter:
    c: Counter = Counter()
    for q in qs:
        for w in q.get(field, []):
            if w:
                c[max(w, key=w.get)] += 1
    return c


def show(qs, field, label) -> None:
    c = spread(qs, field)
    thin = [k for k, n in c.items() if n <= 1]
    print(f"  {label:<7} " + "  ".join(f"{k} {n}" for k, n in sorted(c.items())))
    print(f"          measured only once: {', '.join(sorted(thin)) if thin else 'none'}")


def main(dry_run: bool) -> None:
    bank = json.loads(BANK.read_text(encoding="utf-8"))
    added = 0

    for cat, per_q in ADD.items():
        field = FIELD[cat]
        qs = bank[cat][STAGE][SET]
        index = {q["q"]: q for q in qs}
        print(f"\n{cat}")
        show(qs, field, "before")

        for (rc, rq, rtext), (weights, why) in REWEIGHT.items():
            if rc != cat:
                continue
            q = index.get(rq)
            if q and rtext in q["options"]:
                i = q["options"].index(rtext)
                if q[field][i] != weights:
                    q[field][i] = weights
                    print(f"          reweighted {rq} '{rtext[:44]}...' — {why}")

        for qid, (text, weights) in per_q.items():
            q = index.get(qid)
            if q is None:
                raise SystemExit(f"{cat}: {qid} not found")
            if text in q["options"]:
                continue  # idempotent
            q["options"].append(text)
            q[field].append(weights)
            q["type"] = "choice5"
            added += 1

        show(qs, field, "after")
        for q in qs:
            if len(q["options"]) != len(q[field]):
                raise SystemExit(f"{cat} {q['q']}: options and {field} out of step")

    print(f"\n{added} options added")
    print("NOTE: run scripts/shuffle_option_order.py next — these sit last until you do.")
    if dry_run:
        print("--dry-run: nothing written")
        return
    BANK.write_text(json.dumps(bank, ensure_ascii=False, indent=1), encoding="utf-8")
    print(f"wrote {BANK.name}")


if __name__ == "__main__":
    main("--dry-run" in sys.argv)

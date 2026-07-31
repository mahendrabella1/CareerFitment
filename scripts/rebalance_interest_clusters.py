# -*- coding: utf-8 -*-
"""Let Science/Nature and Sports/Hospitality actually be chosen.

The problem
-----------
Interest options carry cluster weights, and two clusters were effectively
missing from them:

    G  Science, Nature & Agriculture   4.7% of weight, led 2 of 60 options
    H  Sports, Hospitality & Lifestyle 0.0% of weight, led 0 of 60 options

G only ever appeared as a weight-1 garnish on the technical option, even where
the option is squarely about the natural world ("predicts weather or crop
diseases", "science experiments ... space exploration"). H appeared nowhere at
all.

Once career matching lets a profession inherit interest support from its cluster
— which is what lifted top-match agreement from 43% to 62% — a cluster nobody
can express becomes a cluster whose careers can never be recommended. That left
8 of 14 Science careers and 6 of 12 Sports/Hospitality careers unreachable.

The fix
-------
Re-weight ONLY options whose existing wording already describes that cluster's
work. No option text changes, and no option is given a cluster it does not
genuinely describe — a student choosing "coordinate with teachers and students"
for a school event really is expressing the thing event management is made of.

Where the questions genuinely do not cover a cluster, this leaves it alone
rather than fabricating a signal.

Usage:  python scripts/rebalance_interest_clusters.py [--dry-run]
"""

from __future__ import annotations

import json
import sys
from collections import Counter
from pathlib import Path

BANK = Path(__file__).resolve().parent.parent / "data" / "assessment-questions.json"
STAGE, SET = "9-10", "Set 1"

# (qid, option index) -> new cluster weights, with the reason it is justified.
REWEIGHT = {
    # --- G: options already describing science, nature or agriculture ---------
    ("Q2", 0): ({"G": 3, "A": 1, "C": 1},
                "water shortage: root-cause testing is environmental science"),
    ("Q4", 0): ({"G": 3, "B": 2},
                "'predicts weather or crop diseases' is agricultural science"),
    ("Q6", 0): ({"G": 3, "B": 1, "A": 1},
                "'live demos of experiments' is lab science before it is engineering"),
    ("Q9", 0): ({"G": 2, "A": 2, "B": 1},
                "prototype/technology solution spans engineering and applied science"),
    ("Q10", 0): ({"G": 3, "B": 2},
                 "'science experiments ... space exploration' leads with science"),
    # --- H: options already describing hospitality, events or service ---------
    ("Q1", 2): ({"H": 3, "E": 2, "F": 1},
                "running the customer side of a food outlet is hospitality"),
    ("Q5", 2): ({"H": 3, "E": 2, "F": 1},
                "coordinating an event is what event management is"),
    ("Q5", 3): ({"E": 3, "H": 2, "A": 1},
                "schedules and on-the-day delivery for an event"),
    ("Q6", 3): ({"E": 4, "H": 1},
                "running a market stall has a service component"),
}

NAMES = {"A": "Engineering & Construction", "B": "Information Technology",
         "C": "Health Science", "D": "Arts, Media & Design",
         "E": "Business & Marketing", "F": "Human & Public Services",
         "G": "Science, Nature & Agriculture", "H": "Sports, Hospitality & Lifestyle"}


def summarise(qs) -> None:
    weight, leads = Counter(), Counter()
    for q in qs:
        for w in q["clusterWeights"]:
            leads[max(w, key=w.get)] += 1
            for k, v in w.items():
                weight[k] += v
    total = sum(weight.values())
    print(f"{'cluster':<36}{'share':>8}{'leads':>8}")
    for k in sorted(NAMES):
        print(f"  {k} {NAMES[k]:<32}{weight.get(k, 0) / total * 100:>7.1f}%{leads.get(k, 0):>8}")


def main(dry_run: bool) -> None:
    bank = json.loads(BANK.read_text(encoding="utf-8"))
    qs = bank["career_interest"][STAGE][SET]
    index = {q["q"]: q for q in qs}

    print("BEFORE")
    summarise(qs)

    changed = 0
    for (qid, oi), (weights, reason) in REWEIGHT.items():
        q = index.get(qid)
        if q is None or oi >= len(q["clusterWeights"]):
            raise SystemExit(f"{qid} option {oi} does not exist")
        if q["clusterWeights"][oi] != weights:
            q["clusterWeights"][oi] = weights
            changed += 1
        print(f"  {qid} {chr(65 + oi)}  {weights}  — {reason}")

    print(f"\nAFTER  ({changed} option weightings changed, no option text touched)")
    summarise(qs)

    for q in qs:
        if not (len(q["options"]) == len(q["clusterWeights"]) == len(q["riasec"])):
            raise SystemExit(f"{q['q']}: parallel arrays out of step")

    if dry_run:
        print("\n--dry-run: nothing written")
        return
    BANK.write_text(json.dumps(bank, ensure_ascii=False, indent=1), encoding="utf-8")
    print(f"\nwrote {BANK.name}")


if __name__ == "__main__":
    main("--dry-run" in sys.argv)

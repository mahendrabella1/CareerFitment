# -*- coding: utf-8 -*-
"""Make Sports, Hospitality & Lifestyle expressible in the interest questions.

The problem
-----------
The twelve interest questions contained no sport, fitness, travel, food-service
or events scenario at all, so cluster H carried 0% of the weight. Re-weighting
existing options lifted it to 3%, but that was the honest limit: you cannot tag
an option with a cluster its wording does not describe.

Because career matching now lets a profession inherit interest support from its
cluster, a cluster nobody can choose is a cluster whose careers can never be
recommended. Five careers stayed unreachable no matter how a student answered:
Hotel Manager, Travel Consultant, Pilot, Sports Scientist and Dietician.

The fix
-------
Widen the wording of TWO existing options so they genuinely cover it, rather
than adding questions or bolting a sixth option onto every item:

  Q6 D  a market stall selling something bought in  ->  food you cook and serve
        Q6 is "a weekend market gives students a free stall" — running a food
        stall is the most natural hospitality answer that scenario can have, and
        it keeps the commercial framing the option already had.

  Q10 C a channel about psychology and social issues -> adds sport and travel
        Q10 is "which channel would you watch for two hours", a pure
        what-draws-you question. Sport, fitness and travel are among the most
        watched categories for this age group and were absent from every option.

No other option changes, and both keep their original cluster alongside the new
one, so a student who picked them for the old reason is not re-scored away.

Usage:  python scripts/add_sports_hospitality_coverage.py [--dry-run]
"""

from __future__ import annotations

import json
import sys
from collections import Counter
from pathlib import Path

BANK = Path(__file__).resolve().parent.parent / "data" / "assessment-questions.json"
MAP = Path(__file__).resolve().parent.parent / "data" / "career-map-9-10.json"
STAGE, SET = "9-10", "Set 1"

# qid -> option index -> (new text, new cluster weights, new riasec, professions)
EDITS = {
    ("Q6", 3): (
        "Food I've cooked and served, priced to make a margin.",
        {"H": 4, "E": 2},
        {"E": 3, "R": 2},
        ["Chef", "Hotel Manager", "Entrepreneur"],
    ),
    ("Q10", 2): (
        "Sport, fitness, travel, food, and how people live well.",
        {"H": 4, "F": 1},
        {"S": 3, "R": 1},
        ["Sports Coach", "Travel Consultant", "Fitness Trainer"],
    ),
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
    for k in sorted(NAMES):
        print(f"  {k} {NAMES[k]:<32}{weight.get(k, 0) / total * 100:>7.1f}%{leads.get(k, 0):>8}")


def main(dry_run: bool) -> None:
    bank = json.loads(BANK.read_text(encoding="utf-8"))
    known = set(json.loads(MAP.read_text(encoding="utf-8"))["professionCluster"])
    qs = bank["career_interest"][STAGE][SET]
    index = {q["q"]: q for q in qs}

    for (qid, oi), (_t, _cw, _ri, profs) in EDITS.items():
        for p in profs:
            if p not in known:
                raise SystemExit(f"{qid}: career map does not know {p!r}")

    print(f"{'cluster':<36}{'share':>8}{'leads':>8}\nBEFORE")
    summarise(qs)

    for (qid, oi), (text, cw, ri, profs) in EDITS.items():
        q = index[qid]
        print(f"\n  {qid} {chr(65 + oi)}")
        print(f"     was: {q['options'][oi]}   {q['clusterWeights'][oi]}")
        q["options"][oi] = text
        q["clusterWeights"][oi] = cw
        q["riasec"][oi] = ri
        if isinstance(q.get("careers"), list) and oi < len(q["careers"]):
            q["careers"][oi] = profs
        print(f"     now: {text}   {cw}")

    print("\nAFTER")
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

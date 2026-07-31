# -*- coding: utf-8 -*-
"""Add a Health Science option to every Class 9-10 career-interest question.

The problem
-----------
The interest section had no healthcare in it. Every question offered the same
four shapes — A technical, B creative, C people, D business — and Health Science
carried 0.8% of the total cluster weight while leading NONE of the 48 options.
Only one option in the whole section even mentioned a hospital, and that one was
about missed appointments rather than an interest in care.

Medicine is among the most common aspirations for Indian Class 9-10 students, so
a student who wants to be a doctor had no answer that said so. Worse, because
Health was offered so rarely, it was exactly the cluster the old scoring bug
inflated out of nothing (it scored 47 for students who never picked it).

The fix
-------
Add a fifth option carrying Health Science to each of the 12 questions. This is
purely ADDITIVE: not one existing option, weight or career list is touched, so
nothing a student could already say changes meaning. Only the previously
unsayable becomes sayable.

Every profession named here is checked against career-map-9-10.json, because an
option pointing at a name the map does not know scores on the interest dimension
alone and then ranks below everything else.

Usage:  python scripts/add_health_interest_options.py [--dry-run]
"""

from __future__ import annotations

import json
import sys
from collections import Counter
from pathlib import Path

DATA = Path(__file__).resolve().parent.parent / "data"
BANK = DATA / "assessment-questions.json"
MAP = DATA / "career-map-9-10.json"
STAGE, SET = "9-10", "Set 1"

# qid -> (option text, cluster weights, riasec weights, professions)
# Cluster letters: C = Health Science, G = Science/Nature, A = Engineering,
# D = Arts/Media, F = Human & Public Services.
# RIASEC letters are a separate namespace: C there means Conventional.
HEALTH = {
    "Q1": ("Make sure the food is safe, clean and genuinely good for people.",
           {"C": 4, "G": 1}, {"S": 3, "I": 2},
           ["Nutritionist", "Public Health Specialist", "Food Technologist"]),
    "Q2": ("Test the water for contamination and treat anyone who has fallen ill.",
           {"C": 5}, {"S": 3, "I": 2},
           ["Doctor", "Public Health Specialist", "Microbiologist"]),
    "Q3": ("Run sessions on sleep, stress and staying well enough to study.",
           {"C": 4, "F": 1}, {"S": 3, "I": 1},
           ["Clinical Psychologist", "Counsellor", "Nutritionist"]),
    "Q4": ("Model how an infection spreads through a school and how to stop it.",
           {"C": 4, "G": 1}, {"I": 3, "S": 1},
           ["Doctor", "Microbiologist", "Public Health Specialist"]),
    "Q5": ("Take charge of first aid, hygiene and everyone's safety on the day.",
           {"C": 4, "F": 1}, {"S": 3, "R": 1},
           ["Paramedic", "Nurse", "Public Health Specialist"]),
    "Q6": ("Free health checks — height, weight, eyesight — with simple advice.",
           {"C": 5}, {"S": 3, "I": 1},
           ["Nurse", "Doctor", "Nutritionist"]),
    "Q7": ("Build an assistive device — a prosthetic hand or a mobility aid.",
           {"C": 3, "A": 2}, {"R": 3, "I": 2},
           ["Biomedical Engineer", "Physiotherapist", "Occupational Therapist"]),
    "Q8": ("Sit in with the clinical staff and learn how patient care really works.",
           {"C": 5}, {"S": 3, "I": 2},
           ["Doctor", "Nurse", "Physiotherapist"]),
    "Q9": ("Set up a first-aid point and a health awareness corner for the school.",
           {"C": 4, "F": 1}, {"S": 3, "R": 1},
           ["Nurse", "Paramedic", "Public Health Specialist"]),
    "Q10": ("Medicine, surgery, the human body, nutrition and fitness science.",
            {"C": 5}, {"I": 3, "S": 2},
            ["Doctor", "Surgeon", "Nutritionist"]),
    "Q11": ("The team testing whether the product is safe for people to use.",
            {"C": 4, "G": 1}, {"I": 3, "C": 2},
            ["Pharmacist", "Biomedical Engineer", "Public Health Specialist"]),
    "Q12": ("Cover health, fitness and wellbeing for students.",
            {"C": 4, "D": 1}, {"S": 2, "A": 2},
            ["Nutritionist", "Public Health Specialist", "Journalist"]),
}


def main(dry_run: bool) -> None:
    bank = json.loads(BANK.read_text(encoding="utf-8"))
    known = set(json.loads(MAP.read_text(encoding="utf-8"))["professionCluster"])
    qs = bank["career_interest"][STAGE][SET]

    problems = []
    for qid, (_t, _cw, _ri, profs) in HEALTH.items():
        for p in profs:
            if p not in known:
                problems.append(f"{qid}: career map does not know {p!r}")
    missing = {q["q"] for q in qs} - set(HEALTH)
    if missing:
        problems.append(f"no health option written for {sorted(missing)}")
    if problems:
        raise SystemExit("VERIFY FAILED:\n  " + "\n  ".join(problems))

    added = 0
    for q in qs:
        text, cw, ri, profs = HEALTH[q["q"]]
        if any(str(o) == text for o in q["options"]):
            continue  # already applied — this script is idempotent
        q["options"].append(text)
        q["clusterWeights"].append(cw)
        q["riasec"].append(ri)
        q.setdefault("careers", []).append(profs)
        q["type"] = "choice5"
        added += 1

    # Report the effect on cluster balance, which is the point of the change.
    weight = Counter()
    leads = Counter()
    for q in qs:
        for w in q["clusterWeights"]:
            leads[max(w, key=w.get)] += 1
            for k, v in w.items():
                weight[k] += v
    total = sum(weight.values())
    names = {"A": "Engineering & Construction", "B": "Information Technology",
             "C": "Health Science", "D": "Arts, Media & Design",
             "E": "Business & Marketing", "F": "Human & Public Services",
             "G": "Science, Nature & Agriculture", "H": "Sports, Hospitality"}
    print(f"added {added} health options across {len(qs)} interest questions\n")
    print(f"{'cluster':<32}{'weight':>8}{'share':>8}{'leads':>8}")
    for k in sorted(names):
        print(f"{k} {names[k]:<30}{weight.get(k, 0):>8}"
              f"{weight.get(k, 0) / total * 100:>7.1f}%{leads.get(k, 0):>8}")

    for q in qs:
        if len(q["options"]) != len(q["clusterWeights"]) != len(q["riasec"]):
            raise SystemExit(f"{q['q']}: parallel arrays out of step")
        if len(q.get("careers", [])) != len(q["options"]):
            raise SystemExit(f"{q['q']}: careers list out of step")

    if dry_run:
        print("\n--dry-run: nothing written")
        return
    BANK.write_text(json.dumps(bank, ensure_ascii=False, indent=1), encoding="utf-8")
    print(f"\nwrote {BANK.name}")


if __name__ == "__main__":
    main("--dry-run" in sys.argv)

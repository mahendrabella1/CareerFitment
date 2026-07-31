# -*- coding: utf-8 -*-
"""Rebuild data/career-map-9-10.json with a broader, balanced career pool.

Why this exists
---------------
The previous map held 61 professions, but they were badly distributed:

    Health Science               3      Business & Marketing        16
    Science, Nature & Agri       2      Arts, Media & Design        14
    Information Technology       4      Engineering & Construction  11
    Sports, Hospitality          1      Human & Public Services     10

A health-leaning student could therefore only ever be told Doctor, Pharmacist or
Physiotherapist. Thirteen professions had no affinity entries at all and were
unreachable. And breadth was wildly uneven — Research Scientist appeared in 18
of 191 affinity slots against a mean of 4, so it matched whatever a student
scored and topped almost every profile.

What this does
--------------
Declares each profession ONCE, with the traits that actually predict it, then
inverts that into the affinity table the scorer reads. Two consequences:

  * every profession is reachable, because it always has affinity entries
  * breadth is bounded and near-uniform (2 aptitude + 2 personality + 2
    strengths + 2 motivators + 1-2 intelligences + 1 EQ domain), so no
    profession can win on breadth alone

`professionCluster` is generated from the same table, so the two can never
disagree.

Usage:  python scripts/build_career_map_2026.py [--dry-run]
"""

from __future__ import annotations

import json
import shutil
import sys
from collections import Counter, defaultdict
from pathlib import Path

DATA = Path(__file__).resolve().parent.parent / "data"
TARGET = DATA / "career-map-9-10.json"

# Vocabularies the scorer keys on. Anything outside these is a silent no-op.
APT = {"Numerical", "Verbal", "Logical", "Abstract", "Spatial", "Attention to Detail", "Mechanical"}
PERS = {"Openness", "Conscientiousness", "Extraversion", "Agreeableness", "Emotional Stability"}
STR = {"Analytical", "Creative", "Leadership", "Relationship", "Execution", "Communication",
       "Adaptability", "Learning"}
MOT = {"Achievement", "Innovation", "Impact", "Leadership", "Security", "Learning"}
MI = {"Logical–Mathematical", "Linguistic", "Spatial", "Bodily–Kinesthetic", "Musical",
      "Interpersonal", "Intrapersonal", "Naturalistic"}
EI = {"Self-Awareness", "Self-Regulation", "Self-Motivation", "Empathy", "Relationship Management"}

# name, cluster, aptitude, personality, strengths, motivators, intelligences, EQ
C = [
    # ---------------------------------------------- A  Engineering & Construction
    ("Civil Engineer", "A", "Numerical Spatial", "Conscientiousness Emotional Stability", "Analytical Execution", "Achievement Security", "Spatial", "Self-Regulation"),
    ("Structural Engineer", "A", "Numerical Spatial", "Conscientiousness Emotional Stability", "Analytical Execution", "Achievement Security", "Spatial", "Self-Regulation"),
    ("Mechanical Engineer", "A", "Mechanical Spatial", "Conscientiousness Openness", "Analytical Execution", "Achievement Innovation", "Bodily–Kinesthetic", "Self-Motivation"),
    ("Electrical Engineer", "A", "Numerical Mechanical", "Conscientiousness Openness", "Analytical Learning", "Achievement Learning", "Logical–Mathematical", "Self-Regulation"),
    ("Electronics Engineer", "A", "Logical Mechanical", "Conscientiousness Openness", "Analytical Learning", "Innovation Learning", "Logical–Mathematical", "Self-Motivation"),
    ("Robotics Engineer", "A", "Mechanical Abstract", "Openness Conscientiousness", "Analytical Creative", "Innovation Achievement", "Bodily–Kinesthetic Logical–Mathematical", "Self-Motivation"),
    ("Automation Engineer", "A", "Logical Mechanical", "Conscientiousness Openness", "Execution Analytical", "Achievement Innovation", "Logical–Mathematical", "Self-Regulation"),
    ("Environmental Engineer", "A", "Numerical Logical", "Conscientiousness Agreeableness", "Analytical Execution", "Impact Achievement", "Naturalistic", "Empathy"),
    ("Renewable Energy Engineer", "A", "Numerical Mechanical", "Openness Conscientiousness", "Analytical Learning", "Impact Innovation", "Naturalistic Logical–Mathematical", "Self-Motivation"),
    ("Architect", "A", "Spatial Abstract", "Openness Conscientiousness", "Creative Analytical", "Innovation Achievement", "Spatial", "Self-Awareness"),
    ("Urban Planner", "A", "Spatial Numerical", "Openness Agreeableness", "Analytical Communication", "Impact Leadership", "Spatial Interpersonal", "Relationship Management"),
    ("Construction Manager", "A", "Numerical Attention to Detail", "Conscientiousness Extraversion", "Leadership Execution", "Leadership Security", "Interpersonal", "Relationship Management"),
    ("Quantity Surveyor", "A", "Numerical Attention to Detail", "Conscientiousness Emotional Stability", "Analytical Execution", "Security Achievement", "Logical–Mathematical", "Self-Regulation"),
    ("Aerospace Engineer", "A", "Mechanical Spatial", "Conscientiousness Openness", "Analytical Learning", "Achievement Innovation", "Spatial", "Self-Regulation"),
    ("Engineer", "A", "Mechanical Numerical", "Conscientiousness Openness", "Analytical Execution", "Achievement Innovation", "Logical–Mathematical", "Self-Motivation"),

    # ---------------------------------------------- B  Information Technology
    ("Software Engineer", "B", "Logical Abstract", "Openness Conscientiousness", "Analytical Learning", "Achievement Innovation", "Logical–Mathematical", "Self-Motivation"),
    ("AI Engineer", "B", "Logical Numerical", "Openness Conscientiousness", "Analytical Creative", "Innovation Learning", "Logical–Mathematical", "Self-Motivation"),
    ("Data Scientist", "B", "Numerical Logical", "Openness Conscientiousness", "Analytical Learning", "Learning Achievement", "Logical–Mathematical", "Self-Awareness"),
    ("Data Analyst", "B", "Numerical Attention to Detail", "Conscientiousness Openness", "Analytical Execution", "Achievement Security", "Logical–Mathematical", "Self-Regulation"),
    ("Cybersecurity Analyst", "B", "Logical Attention to Detail", "Conscientiousness Emotional Stability", "Analytical Adaptability", "Security Learning", "Logical–Mathematical", "Self-Regulation"),
    ("Cloud Engineer", "B", "Logical Abstract", "Conscientiousness Openness", "Execution Learning", "Achievement Learning", "Logical–Mathematical", "Self-Motivation"),
    ("Mobile App Developer", "B", "Logical Spatial", "Openness Conscientiousness", "Creative Execution", "Innovation Achievement", "Spatial Logical–Mathematical", "Self-Motivation"),
    ("Game Developer", "B", "Abstract Spatial", "Openness Extraversion", "Creative Analytical", "Innovation Achievement", "Spatial", "Self-Motivation"),
    ("UX Designer", "B", "Spatial Abstract", "Openness Agreeableness", "Creative Communication", "Innovation Impact", "Spatial Interpersonal", "Empathy"),
    ("Database Administrator", "B", "Logical Attention to Detail", "Conscientiousness Emotional Stability", "Execution Analytical", "Security Achievement", "Logical–Mathematical", "Self-Regulation"),
    ("Network Engineer", "B", "Logical Mechanical", "Conscientiousness Emotional Stability", "Analytical Execution", "Security Learning", "Logical–Mathematical", "Self-Regulation"),
    ("DevOps Engineer", "B", "Logical Abstract", "Conscientiousness Openness", "Execution Adaptability", "Achievement Learning", "Logical–Mathematical", "Self-Regulation"),
    ("IT Support Specialist", "B", "Logical Mechanical", "Agreeableness Conscientiousness", "Relationship Execution", "Security Impact", "Interpersonal", "Empathy"),
    ("Research Engineer", "B", "Abstract Logical", "Openness Conscientiousness", "Analytical Learning", "Learning Innovation", "Logical–Mathematical", "Self-Motivation"),

    # ---------------------------------------------- C  Health Science
    ("Doctor", "C", "Attention to Detail Logical", "Conscientiousness Agreeableness", "Analytical Relationship", "Impact Achievement", "Interpersonal", "Empathy"),
    ("Surgeon", "C", "Spatial Attention to Detail", "Conscientiousness Emotional Stability", "Execution Analytical", "Achievement Impact", "Bodily–Kinesthetic", "Self-Regulation"),
    ("Dentist", "C", "Spatial Attention to Detail", "Conscientiousness Agreeableness", "Execution Relationship", "Achievement Impact", "Bodily–Kinesthetic", "Empathy"),
    ("Nurse", "C", "Attention to Detail Verbal", "Agreeableness Emotional Stability", "Relationship Execution", "Impact Security", "Interpersonal", "Empathy"),
    ("Pharmacist", "C", "Attention to Detail Numerical", "Conscientiousness Agreeableness", "Analytical Execution", "Security Impact", "Logical–Mathematical", "Self-Regulation"),
    ("Physiotherapist", "C", "Mechanical Attention to Detail", "Agreeableness Extraversion", "Relationship Execution", "Impact Achievement", "Bodily–Kinesthetic Interpersonal", "Empathy"),
    ("Clinical Psychologist", "C", "Verbal Logical", "Agreeableness Openness", "Relationship Learning", "Impact Learning", "Intrapersonal Interpersonal", "Empathy"),
    ("Nutritionist", "C", "Numerical Verbal", "Agreeableness Conscientiousness", "Relationship Learning", "Impact Security", "Naturalistic Interpersonal", "Empathy"),
    ("Radiologist", "C", "Spatial Attention to Detail", "Conscientiousness Emotional Stability", "Analytical Execution", "Achievement Security", "Spatial", "Self-Regulation"),
    ("Paramedic", "C", "Mechanical Attention to Detail", "Emotional Stability Extraversion", "Execution Adaptability", "Impact Achievement", "Bodily–Kinesthetic", "Self-Regulation"),
    ("Biomedical Engineer", "C", "Mechanical Logical", "Openness Conscientiousness", "Analytical Creative", "Innovation Impact", "Logical–Mathematical", "Self-Motivation"),
    ("Public Health Specialist", "C", "Numerical Verbal", "Agreeableness Conscientiousness", "Analytical Communication", "Impact Leadership", "Interpersonal", "Empathy"),
    ("Veterinarian", "C", "Attention to Detail Logical", "Agreeableness Emotional Stability", "Relationship Analytical", "Impact Learning", "Naturalistic Interpersonal", "Empathy"),
    ("Occupational Therapist", "C", "Attention to Detail Verbal", "Agreeableness Extraversion", "Relationship Adaptability", "Impact Learning", "Bodily–Kinesthetic Interpersonal", "Empathy"),

    # ---------------------------------------------- D  Arts, Media & Design
    ("Graphic Designer", "D", "Spatial Abstract", "Openness Extraversion", "Creative Communication", "Innovation Achievement", "Spatial", "Self-Awareness"),
    ("Animator", "D", "Spatial Abstract", "Openness Conscientiousness", "Creative Execution", "Innovation Achievement", "Spatial Bodily–Kinesthetic", "Self-Motivation"),
    ("Film Maker", "D", "Spatial Verbal", "Openness Extraversion", "Creative Leadership", "Innovation Impact", "Spatial Interpersonal", "Relationship Management"),
    ("Journalist", "D", "Verbal Attention to Detail", "Openness Extraversion", "Communication Learning", "Impact Innovation", "Linguistic", "Relationship Management"),
    ("Content Creator", "D", "Verbal Abstract", "Openness Extraversion", "Creative Communication", "Innovation Impact", "Linguistic", "Relationship Management"),
    ("Fashion Designer", "D", "Spatial Abstract", "Openness Extraversion", "Creative Execution", "Innovation Achievement", "Spatial", "Self-Awareness"),
    ("Interior Designer", "D", "Spatial Attention to Detail", "Openness Agreeableness", "Creative Relationship", "Innovation Impact", "Spatial", "Empathy"),
    ("Product Designer", "D", "Spatial Abstract", "Openness Conscientiousness", "Creative Analytical", "Innovation Achievement", "Spatial Logical–Mathematical", "Self-Awareness"),
    ("Industrial Designer", "D", "Spatial Mechanical", "Openness Conscientiousness", "Creative Execution", "Innovation Achievement", "Spatial", "Self-Motivation"),
    ("Creative Director", "D", "Abstract Verbal", "Openness Extraversion", "Creative Leadership", "Innovation Leadership", "Spatial Interpersonal", "Relationship Management"),
    ("Photographer", "D", "Spatial Attention to Detail", "Openness Conscientiousness", "Creative Execution", "Innovation Achievement", "Spatial", "Self-Awareness"),
    ("Music Producer", "D", "Abstract Attention to Detail", "Openness Extraversion", "Creative Execution", "Innovation Achievement", "Musical", "Self-Awareness"),
    ("Media Professional", "D", "Verbal Abstract", "Extraversion Openness", "Communication Adaptability", "Impact Innovation", "Linguistic Interpersonal", "Relationship Management"),
    ("Event Designer", "D", "Spatial Attention to Detail", "Openness Extraversion", "Creative Execution", "Innovation Impact", "Spatial Interpersonal", "Relationship Management"),

    # ---------------------------------------------- E  Business & Marketing
    ("Chartered Accountant", "E", "Numerical Attention to Detail", "Conscientiousness Emotional Stability", "Analytical Execution", "Security Achievement", "Logical–Mathematical", "Self-Regulation"),
    ("Financial Analyst", "E", "Numerical Logical", "Conscientiousness Openness", "Analytical Learning", "Achievement Security", "Logical–Mathematical", "Self-Regulation"),
    ("Investment Banker", "E", "Numerical Logical", "Conscientiousness Extraversion", "Analytical Leadership", "Achievement Leadership", "Logical–Mathematical", "Self-Regulation"),
    ("Banker", "E", "Numerical Attention to Detail", "Conscientiousness Agreeableness", "Execution Relationship", "Security Achievement", "Interpersonal", "Relationship Management"),
    ("Auditor", "E", "Numerical Attention to Detail", "Conscientiousness Emotional Stability", "Analytical Execution", "Security Achievement", "Logical–Mathematical", "Self-Regulation"),
    ("Economist", "E", "Numerical Logical", "Openness Conscientiousness", "Analytical Learning", "Learning Achievement", "Logical–Mathematical", "Self-Awareness"),
    ("Business Analyst", "E", "Numerical Logical", "Conscientiousness Openness", "Analytical Communication", "Achievement Learning", "Logical–Mathematical", "Relationship Management"),
    ("Business Manager", "E", "Numerical Verbal", "Extraversion Conscientiousness", "Leadership Execution", "Leadership Achievement", "Interpersonal", "Relationship Management"),
    ("Operations Manager", "E", "Numerical Attention to Detail", "Conscientiousness Extraversion", "Execution Leadership", "Leadership Security", "Interpersonal", "Self-Regulation"),
    ("Project Manager", "E", "Numerical Logical", "Conscientiousness Extraversion", "Execution Leadership", "Achievement Leadership", "Interpersonal", "Relationship Management"),
    ("Digital Marketer", "E", "Verbal Abstract", "Extraversion Openness", "Communication Creative", "Innovation Achievement", "Linguistic", "Relationship Management"),
    ("Entrepreneur", "E", "Numerical Abstract", "Openness Extraversion", "Leadership Adaptability", "Innovation Leadership", "Interpersonal", "Self-Motivation"),
    ("Startup Founder", "E", "Abstract Numerical", "Openness Extraversion", "Leadership Creative", "Innovation Achievement", "Interpersonal", "Self-Motivation"),
    ("Supply Chain Manager", "E", "Numerical Attention to Detail", "Conscientiousness Emotional Stability", "Execution Analytical", "Security Leadership", "Logical–Mathematical", "Self-Regulation"),
    ("Consultant", "E", "Logical Verbal", "Openness Extraversion", "Analytical Communication", "Learning Leadership", "Interpersonal", "Relationship Management"),
    ("Financial Planner", "E", "Numerical Verbal", "Conscientiousness Agreeableness", "Analytical Relationship", "Security Impact", "Interpersonal", "Empathy"),

    # ---------------------------------------------- F  Human & Public Services
    ("Lawyer", "F", "Verbal Logical", "Conscientiousness Extraversion", "Communication Analytical", "Achievement Impact", "Linguistic", "Self-Regulation"),
    ("Judge", "F", "Verbal Logical", "Conscientiousness Emotional Stability", "Analytical Communication", "Impact Security", "Linguistic Intrapersonal", "Self-Regulation"),
    ("IAS Officer", "F", "Verbal Logical", "Conscientiousness Extraversion", "Leadership Communication", "Impact Leadership", "Interpersonal Linguistic", "Relationship Management"),
    ("Policy Analyst", "F", "Verbal Numerical", "Openness Conscientiousness", "Analytical Communication", "Impact Learning", "Linguistic", "Self-Awareness"),
    ("Teacher", "F", "Verbal Attention to Detail", "Agreeableness Extraversion", "Communication Relationship", "Impact Learning", "Linguistic Interpersonal", "Empathy"),
    ("Counsellor", "F", "Verbal Attention to Detail", "Agreeableness Emotional Stability", "Relationship Communication", "Impact Learning", "Intrapersonal Interpersonal", "Empathy"),
    ("Psychologist", "F", "Verbal Logical", "Agreeableness Openness", "Relationship Analytical", "Impact Learning", "Intrapersonal Interpersonal", "Empathy"),
    ("Social Worker", "F", "Verbal Attention to Detail", "Agreeableness Emotional Stability", "Relationship Adaptability", "Impact Security", "Interpersonal", "Empathy"),
    ("HR Manager", "F", "Verbal Numerical", "Agreeableness Extraversion", "Relationship Communication", "Leadership Impact", "Interpersonal", "Relationship Management"),
    ("Civil Services Officer", "F", "Verbal Logical", "Conscientiousness Emotional Stability", "Leadership Execution", "Impact Security", "Interpersonal", "Self-Regulation"),
    ("Police Officer", "F", "Attention to Detail Logical", "Emotional Stability Conscientiousness", "Execution Leadership", "Impact Security", "Bodily–Kinesthetic", "Self-Regulation"),
    ("Public Speaker", "F", "Verbal Abstract", "Extraversion Openness", "Communication Leadership", "Impact Achievement", "Linguistic Interpersonal", "Relationship Management"),
    ("Technical Trainer", "F", "Verbal Logical", "Extraversion Conscientiousness", "Communication Learning", "Learning Impact", "Linguistic Interpersonal", "Relationship Management"),
    ("Science Communicator", "F", "Verbal Abstract", "Openness Extraversion", "Communication Learning", "Learning Impact", "Linguistic", "Relationship Management"),

    # ---------------------------------------------- G  Science, Nature & Agriculture
    ("Research Scientist", "G", "Abstract Logical", "Openness Conscientiousness", "Analytical Learning", "Learning Innovation", "Logical–Mathematical", "Self-Motivation"),
    ("Biotechnologist", "G", "Logical Attention to Detail", "Openness Conscientiousness", "Analytical Learning", "Innovation Learning", "Naturalistic Logical–Mathematical", "Self-Motivation"),
    ("Microbiologist", "G", "Attention to Detail Logical", "Conscientiousness Openness", "Analytical Learning", "Learning Achievement", "Naturalistic", "Self-Regulation"),
    ("Environmental Scientist", "G", "Numerical Logical", "Openness Agreeableness", "Analytical Learning", "Impact Learning", "Naturalistic", "Empathy"),
    ("Agricultural Scientist", "G", "Numerical Attention to Detail", "Conscientiousness Agreeableness", "Analytical Execution", "Impact Achievement", "Naturalistic", "Self-Motivation"),
    ("Agronomist", "G", "Numerical Mechanical", "Conscientiousness Agreeableness", "Analytical Execution", "Impact Security", "Naturalistic", "Self-Regulation"),
    ("Horticulturist", "G", "Attention to Detail Mechanical", "Agreeableness Conscientiousness", "Execution Learning", "Impact Security", "Naturalistic Bodily–Kinesthetic", "Self-Regulation"),
    ("Food Technologist", "G", "Numerical Attention to Detail", "Conscientiousness Openness", "Analytical Execution", "Innovation Security", "Naturalistic", "Self-Regulation"),
    ("Wildlife Biologist", "G", "Attention to Detail Logical", "Openness Agreeableness", "Learning Analytical", "Impact Learning", "Naturalistic", "Empathy"),
    ("Geologist", "G", "Spatial Numerical", "Openness Conscientiousness", "Analytical Learning", "Learning Achievement", "Naturalistic Spatial", "Self-Motivation"),
    ("Marine Biologist", "G", "Attention to Detail Logical", "Openness Agreeableness", "Learning Analytical", "Learning Impact", "Naturalistic", "Empathy"),
    ("Forestry Officer", "G", "Attention to Detail Mechanical", "Conscientiousness Emotional Stability", "Execution Leadership", "Impact Security", "Naturalistic", "Self-Regulation"),
    ("Astrophysicist", "G", "Numerical Abstract", "Openness Conscientiousness", "Analytical Learning", "Learning Innovation", "Logical–Mathematical", "Self-Awareness"),
    ("Chemist", "G", "Numerical Attention to Detail", "Conscientiousness Openness", "Analytical Execution", "Learning Achievement", "Logical–Mathematical", "Self-Regulation"),

    # ---------------------------------------------- H  Sports, Hospitality & Lifestyle
    ("Sports Coach", "H", "Mechanical Attention to Detail", "Extraversion Emotional Stability", "Leadership Relationship", "Achievement Impact", "Bodily–Kinesthetic Interpersonal", "Relationship Management"),
    ("Sports Scientist", "H", "Numerical Attention to Detail", "Conscientiousness Openness", "Analytical Learning", "Achievement Learning", "Bodily–Kinesthetic Logical–Mathematical", "Self-Motivation"),
    ("Athlete", "H", "Mechanical Spatial", "Emotional Stability Conscientiousness", "Execution Adaptability", "Achievement Learning", "Bodily–Kinesthetic", "Self-Motivation"),
    ("Hotel Manager", "H", "Numerical Verbal", "Extraversion Agreeableness", "Leadership Relationship", "Leadership Security", "Interpersonal", "Relationship Management"),
    ("Chef", "H", "Attention to Detail Mechanical", "Openness Emotional Stability", "Creative Execution", "Achievement Innovation", "Bodily–Kinesthetic", "Self-Regulation"),
    ("Event Manager", "H", "Numerical Attention to Detail", "Extraversion Conscientiousness", "Execution Leadership", "Leadership Achievement", "Interpersonal", "Relationship Management"),
    ("Travel Consultant", "H", "Verbal Attention to Detail", "Extraversion Agreeableness", "Communication Relationship", "Impact Security", "Interpersonal Linguistic", "Empathy"),
    ("Pilot", "H", "Spatial Attention to Detail", "Emotional Stability Conscientiousness", "Execution Adaptability", "Achievement Security", "Spatial Bodily–Kinesthetic", "Self-Regulation"),
    ("Fitness Trainer", "H", "Mechanical Attention to Detail", "Extraversion Agreeableness", "Relationship Execution", "Impact Achievement", "Bodily–Kinesthetic Interpersonal", "Relationship Management"),
    ("Dietician", "H", "Numerical Attention to Detail", "Agreeableness Conscientiousness", "Relationship Analytical", "Impact Security", "Naturalistic Interpersonal", "Empathy"),
    ("Sales Engineer", "H", "Mechanical Verbal", "Extraversion Conscientiousness", "Communication Relationship", "Achievement Leadership", "Interpersonal", "Relationship Management"),
    ("Product Engineer", "H", "Mechanical Spatial", "Conscientiousness Openness", "Analytical Execution", "Achievement Innovation", "Spatial", "Self-Motivation"),
]

DIMENSION_WEIGHTS = {
    "career_interest": 0.2, "personality": 0.2, "aptitude": 0.13, "strengths": 0.13,
    "motivators": 0.1, "emotional_intelligence": 0.1, "learning_styles": 0.07,
    "multiple_intelligence": 0.07,
}
MI_WEIGHTS = {
    "Logical–Mathematical": 0.15, "Linguistic": 0.15, "Spatial": 0.15, "Interpersonal": 0.15,
    "Intrapersonal": 0.1, "Bodily–Kinesthetic": 0.1, "Naturalistic": 0.1, "Musical": 0.1,
}


def build(dry_run: bool):
    seen = Counter(c[0] for c in C)
    dupes = [n for n, k in seen.items() if k > 1]
    if dupes:
        raise SystemExit(f"duplicate profession names: {dupes}")

    affinity = {d: defaultdict(list) for d in ("aptitude", "personality", "strengths",
                                               "motivators", "mi", "ei")}
    profession_cluster = {}
    problems = []
    for name, cluster, apt, pers, stre, mot, mi, ei in C:
        profession_cluster[name] = cluster
        for dim, raw, vocab in (("aptitude", apt, APT), ("personality", pers, PERS),
                                ("strengths", stre, STR), ("motivators", mot, MOT),
                                ("mi", mi, MI), ("ei", ei, EI)):
            # multi-word vocabulary entries are matched greedily
            keys, rest = [], raw
            for term in sorted(vocab, key=len, reverse=True):
                if term in rest:
                    keys.append(term)
                    rest = rest.replace(term, "", 1)
            if rest.strip():
                problems.append(f"{name}/{dim}: unrecognised {rest.strip()!r}")
            for k in keys:
                affinity[dim][k].append(name)

    if problems:
        raise SystemExit("VOCAB ERRORS:\n  " + "\n  ".join(problems))

    # The EI affinity table is keyed by whatever the question bank calls its
    # dimensions, and the two banks name them differently: the pre-2026 set uses
    # "Emotional Awareness / Emotional Regulation / Empathy & Social Awareness /
    # Adaptability & Resilience", the 2026 set uses "Self-Awareness /
    # Self-Regulation / Empathy / Self-Motivation". A key the bank does not emit
    # is simply never matched, so EI silently contributes nothing. Emitting BOTH
    # namings against the same profession lists makes the map work with either
    # bank, and costs nothing when only one is in use.
    EI_ALSO = {
        "Self-Awareness": "Emotional Awareness",
        "Self-Regulation": "Emotional Regulation",
        "Empathy": "Empathy & Social Awareness",
        "Self-Motivation": "Adaptability & Resilience",
    }
    for new_key, old_key in EI_ALSO.items():
        if new_key in affinity["ei"]:
            affinity["ei"][old_key] = list(affinity["ei"][new_key])

    out = {
        "dimensionWeights": DIMENSION_WEIGHTS,
        "miWeights": MI_WEIGHTS,
        "affinity": {d: {k: sorted(v) for k, v in sorted(t.items())} for d, t in affinity.items()},
        "professionCluster": dict(sorted(profession_cluster.items())),
    }

    breadth = Counter()
    for t in affinity.values():
        for lst in t.values():
            breadth.update(lst)
    unreachable = [p for p in profession_cluster if breadth[p] == 0]
    if unreachable:
        raise SystemExit(f"unreachable professions: {unreachable}")

    by_cluster = Counter(profession_cluster.values())
    print("professions per cluster:")
    for k in sorted(by_cluster):
        print(f"   {k}  {by_cluster[k]:>3}")
    print(f"   total {len(profession_cluster)}")
    print(f"affinity slots: {sum(breadth.values())}   "
          f"breadth min {min(breadth.values())} / mean "
          f"{sum(breadth.values()) / len(breadth):.1f} / max {max(breadth.values())}")
    top = breadth.most_common(3)
    print(f"broadest: {', '.join(f'{p}({n})' for p, n in top)}")

    if dry_run:
        print("--dry-run: nothing written")
        return
    backup = TARGET.with_suffix(".pre-2026.json")
    if not backup.exists():
        shutil.copy2(TARGET, backup)
        print(f"backed up -> {backup.name}")
    TARGET.write_text(json.dumps(out, ensure_ascii=False, indent=1), encoding="utf-8")
    print(f"wrote {TARGET.name}")


if __name__ == "__main__":
    build("--dry-run" in sys.argv)

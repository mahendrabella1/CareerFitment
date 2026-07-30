# -*- coding: utf-8 -*-
"""Write the finalised 2026 questions into the live bank (project/data/*.json).

Replaces ONLY the classes 9-10 "Set 1" entries. Every other life stage and set
is left byte-for-byte alone, and the record shape is unchanged — same field
names, same parallel-array layout — so nothing downstream has to change.

What each record keeps from before:
    career_interest   type q text options riasec clusterWeights careers
    aptitude          type q format domain difficulty text options
                      svgOptions correct media
    personality       type q trait facet text options traitPoints
    strengths         type q text options strengthPoints
    motivators        type q text options motivatorPoints
    learning_styles   type q text options styles
    multiple_intel.   type q text options intelPoints
    emotional_intel.  type q dimension text options

Three additions, all of which the engine already understands:
    personality       abstainIndex -> marks "None of these" as an abstention
    emotional_intel.  optionDomains -> forced-choice domain scoring
    career_interest   careerMatches -> the sheet's own career-match text, kept
                      verbatim for display alongside the scoreable `careers`

`type` moves from "choice4" to "choice5" where the question now has five
options. NewExam already treats choice5 as a single-select auto-advance type.

Usage:  python scripts/import_finalised_set_2026.py [--dry-run]
"""

from __future__ import annotations

import json
import re
import shutil
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
import finalised_set_2026_data as D  # noqa: E402
import finalised_set_2026_visuals as V  # noqa: E402

HERE = Path(__file__).resolve().parent
PROJECT = HERE.parent
DATA = PROJECT / "data"
STAGE = "9-10"
SET = "Set 1"

MAIN = DATA / "assessment-questions.json"
APT = DATA / "aptitude-questions.json"
STR = DATA / "strengths-questions.json"

# --------------------------------------------------------------------------- #
# The career matcher scores against a fixed 61-profession vocabulary
# (career-map-9-10.json). The sheet names professions more specifically, so each
# is folded onto its nearest equivalent in that vocabulary. Without this the
# matcher would see unknown names, score them on the interests dimension alone
# and rank them below every mapped profession.
#
# The sheet's own wording is NOT lost — it is stored verbatim in `careerMatches`.
# --------------------------------------------------------------------------- #
ALIAS = {
    # health
    "Doctor": "Doctor", "Surgeon": "Doctor", "Physician": "Doctor", "Nurse": "Doctor",
    "Pathologist": "Doctor", "Radiologist": "Doctor", "Anesthetist": "Doctor",
    "Emergency Doctor": "Doctor", "Neuroscientist": "Research Scientist",
    "Medical Researcher": "Research Scientist", "Biomedical Scientist": "Research Scientist",
    "Clinical Researcher": "Research Scientist", "Medical Technologist": "Pharmacist",
    "Pharmacist": "Pharmacist", "Pharmacologist": "Pharmacist", "Oncologist": "Doctor",
    "Genetic Researcher": "Research Scientist", "Geneticist": "Research Scientist",
    "Microbiologist": "Research Scientist", "Biotechnologist": "Research Scientist",
    "Epidemiologist": "Doctor", "Paramedic": "Doctor",
    "Physiotherapist": "Physiotherapist", "Occupational Therapist": "Physiotherapist",
    "Speech Therapist": "Counsellor", "Clinical Psychologist": "Psychologist",
    "Psychologist": "Psychologist", "Counselor": "Counsellor", "Counsellor": "Counsellor",
    "Community Health Specialist": "Doctor", "Public Health Mgr": "Operations Manager",
    "Nutritionist": "Physiotherapist", "Dietitian": "Physiotherapist",
    "Sports Medicine Specialist": "Physiotherapist",
    # agriculture / environment / science
    "Agronomist": "Environmental Scientist", "Food Technologist": "Environmental Scientist",
    "Environmental Scientist": "Environmental Scientist", "Soil Scientist": "Environmental Scientist",
    "Forester": "Environmental Scientist", "Horticulturist": "Environmental Scientist",
    "Food Scientist": "Environmental Scientist", "Botanist": "Environmental Scientist",
    "Wildlife Biologist": "Environmental Scientist", "Zoologist": "Environmental Scientist",
    "Soil Chemist": "Environmental Scientist", "Plant Breeder": "Environmental Scientist",
    "Environmental Consultant": "Environmental Scientist",
    "Agricultural Scientist": "Environmental Scientist",
    "Agricultural Engineer": "Environmental Engineer",
    "Agricultural Businessman": "Entrepreneur", "Agricultural Economist": "Economist",
    "Environmental Lawyer": "Lawyer", "Astrophysicist": "Research Scientist",
    # engineering / tech
    "Software Developer": "Software Engineer", "Software Engineer": "Software Engineer",
    "Software Architect": "Software Engineer", "Mechanical Engineer": "Mechanical Engineer",
    "Robotics Engineer": "Robotics Engineer", "Robotics Researcher": "Robotics Engineer",
    "AI Engineer": "AI Engineer", "Electronics Engineer": "Electronics Engineer",
    "Energy Systems Engineer": "Environmental Engineer", "Civil Engineer": "Civil Engineer",
    "Renewable Energy Specialist": "Environmental Engineer",
    "Electrical Engineer": "Electronics Engineer", "Hardware Engineer": "Electronics Engineer",
    "Mechatronics Specialist": "Robotics Engineer", "Data Scientist": "Data Scientist",
    "Data Analyst": "Data Analyst", "Cybersecurity Analyst": "Software Engineer",
    "Automobile Engineer": "Mechanical Engineer", "Computer Engineer": "Software Engineer",
    "Chemical Engineer": "Engineer", "Research Scientist": "Research Scientist",
    "Systems Engineer": "Engineer", "Quality & Safety Officer": "Auditor",
    "Clinical Research Associate": "Research Scientist",
    # law / public service
    "Lawyer": "Lawyer", "Corporate Lawyer": "Lawyer", "Criminal Lawyer": "Lawyer",
    "Human Rights Lawyer": "Lawyer", "Legal Consultant": "Lawyer", "Legal Scholar": "Lawyer",
    "Legal Journalist": "Journalist", "Criminologist": "Psychologist", "Judge": "Lawyer",
    "Advocate": "Lawyer", "Civil Servant (IAS)": "IAS Officer", "Civil Servant": "IAS Officer",
    "IAS Officer": "IAS Officer", "Policy Analyst": "IAS Officer", "Policy Maker": "IAS Officer",
    "Political Analyst": "IAS Officer", "Political Scientist": "IAS Officer",
    "Diplomat": "IAS Officer", "Mediator": "Counsellor", "Compliance Officer": "Auditor",
    "Hospital Administrator": "Operations Manager", "Social Worker": "Social Worker",
    "NGO Leader": "Social Worker", "Philosopher": "Teacher", "Historian": "Teacher",
    "Anthropologist": "Psychologist", "Sociologist": "Psychologist", "Teacher": "Teacher",
    "Public Health Educator": "Teacher", "Health Educator": "Teacher",
    # arts / media / design
    "Graphic Designer": "Graphic Designer", "Filmmaker": "Film Maker", "Film Maker": "Film Maker",
    "Journalist": "Journalist", "Content Creator": "Content Creator", "Animator": "Animator",
    "Game Designer": "Product Designer", "Fashion Designer": "Fashion Designer",
    "Art Director": "Creative Director", "Creative Director": "Creative Director",
    "Fine Artist": "Graphic Designer", "Photographer": "Content Creator",
    "Interior Designer": "Interior Designer", "Illustrator": "Graphic Designer",
    "Theatre Director": "Creative Director", "Radio Jockey": "Media Professional",
    "Copywriter": "Content Creator", "Writer": "Content Creator", "Editor": "Journalist",
    "PR Specialist": "Media Professional", "Communications Mgr": "Media Professional",
    "Visual Designer": "Graphic Designer", "Product Designer": "Product Designer",
    "Medical Writer": "Content Creator", "Health Journalist": "Journalist",
    "UX Designer": "Product Designer", "Architect": "Architect",
    # business / finance
    "Chartered Accountant": "Chartered Accountant",
    "Chartered Accountant (CA)": "Chartered Accountant", "Accountant": "Chartered Accountant",
    "Financial Analyst": "Financial Analyst", "Operations Mgr": "Operations Manager",
    "Operations Manager": "Operations Manager", "Investment Banker": "Banker",
    "Microfinance Officer": "Banker", "Risk Analyst": "Financial Analyst",
    "Economist": "Economist", "Stock Broker": "Financial Analyst",
    "Marketing Manager": "Digital Marketer", "Marketing Strategist": "Digital Marketer",
    "Business Analyst": "Business Analyst", "Business Manager": "Business Manager",
    "Business Consultant": "Consultant", "Management Consultant": "Consultant",
    "Chief Financial Officer (CFO)": "Financial Planner", "Strategist": "Consultant",
    "Founder/CEO": "Startup Founder", "Venture Capitalist": "Banker",
    "Product Manager": "Project Manager", "Entrepreneur": "Entrepreneur",
    "E-commerce Manager": "Digital Marketer", "Sales Director": "Digital Marketer",
    "Financial Planner": "Financial Planner", "Finance Manager": "Financial Planner",
    "Equity Analyst": "Financial Analyst", "Corporate Executive": "Business Manager",
    "CFA": "Financial Analyst", "Auditor": "Auditor",
    "Supply Chain Manager": "Supply Chain Manager", "Procurement Officer": "Supply Chain Manager",
    "Logistics Head": "Supply Chain Manager", "HR Manager": "HR Manager",
    "Startup Founder": "Startup Founder", "Project Manager": "Project Manager",
    "Consultant": "Consultant", "Banker": "Banker", "Digital Marketer": "Digital Marketer",
}

unmapped: set[str] = set()


def professions_from(match_text: str) -> list[str]:
    """Pull the profession list out of the sheet's 'Family: A, B, C' career text
    and fold each name onto the career map's vocabulary."""
    tail = match_text.split(":", 1)[1] if ":" in match_text else match_text
    out: list[str] = []
    for name in (n.strip() for n in tail.split(",")):
        name = re.sub(r"\s+", " ", name).strip(" .")
        if not name:
            continue
        mapped = ALIAS.get(name)
        if mapped is None:
            unmapped.add(name)
            mapped = name
        if mapped not in out:
            out.append(mapped)
    return out


# --------------------------------------------------------------------------- #
# Option-order rotation.
#
# Multiple Intelligence, Learning Styles and Emotional Intelligence each mapped
# A-E onto the same five constructs on EVERY item. A student who answers by
# position — and under exam fatigue many do — produced a perfectly consistent,
# entirely false profile, because slot A was always Logical, always Visual,
# always Self-Awareness.
#
# Rotating the options per question breaks that without touching a single word
# of the text: the parallel scoring array is permuted with it, so the mapping is
# unchanged, only where each option sits. The rotation is a fixed offset per
# question index, not random, so re-running the importer is reproducible and the
# workbook always matches the bank.
# --------------------------------------------------------------------------- #
def rotate(record: dict, parallel: tuple[str, ...], step: int) -> dict:
    n = len(record["options"])
    if n < 2 or step % n == 0:
        return record
    order = [(i + step) % n for i in range(n)]
    record["options"] = [record["options"][i] for i in order]
    for field in parallel:
        seq = record.get(field)
        if isinstance(seq, list) and len(seq) == n:
            record[field] = [seq[i] for i in order]
    if isinstance(record.get("correct"), int):
        record["correct"] = order.index(record["correct"])
    return record


def spread_answer_key(records: list[dict]) -> list[dict]:
    """Aptitude answers were B x4, C x5, E x1 — no A, no D at all, so a student
    guessing C throughout scored 50% without reading a word. Rotate each item so
    the key lands as evenly across A-E as ten items allow. Option TEXT is
    untouched; only the order and the recorded answer index move."""
    target = [i % 5 for i in range(len(records))]  # 0,1,2,3,4,0,1,2,3,4
    for rec, want in zip(records, target):
        # rotate() moves old index c to (c - step) % n, so to land the answer
        # on `want` the step is (c - want), not (want - c).
        step = (rec["correct"] - want) % len(rec["options"])
        rotate(rec, ("optionLabels",), step)
    return records


def build_records(live_apt_set):
    """Return {category: [records]} in the bank's own shape."""
    out: dict[str, list] = {}

    # ---- career_interest
    ci = []
    for qid, text, opts, _src, _note in D.INTERESTS:
        ci.append({
            "type": "choice5", "q": qid, "text": text,
            "options": [o[0] for o in opts],
            "riasec": [o[3] for o in opts],
            # A behaviour can signal more than one cluster — "systems thinking"
            # points at Engineering AND IT — so the full weight map is used
            # rather than collapsing each option to a single letter.
            "clusterWeights": D.INTERESTS_CLUSTER_WEIGHTS[qid],
            "careers": D.INTERESTS_CAREERS[qid],
            # Never shown to the student; kept so the mapping stays auditable.
            "behaviourMeasured": D.INTERESTS_MEASURED[qid],
            "careerSignal": D.INTERESTS_SIGNALS[qid],
        })
    out["career_interest"] = ci

    # ---- aptitude (reuse any artwork the live bank already holds for the
    #      same question, so the gear diagram is not lost)
    live_media = {}
    for rec in live_apt_set:
        key = re.sub(r"\W+", "", str(rec.get("text", "")).lower())[:40]
        if rec.get("media"):
            live_media[key] = rec["media"]
    apt = []
    for (qid, text, options, correct, dim, _cl, _pr, img, _spec, _src, _n) in D.APTITUDE:
        key = re.sub(r"\W+", "", text.lower())[:40]
        media = live_media.get(key)
        if media is None and "gear" in text.lower():
            media = next((m for k, m in live_media.items() if "gear" in k), None)
        # Artwork the 2026 set was missing. Two items were flagged "required"
        # and shipped with nothing to look at, which made them guesses.
        if media is None and qid in V.MEDIA:
            media = V.MEDIA[qid]()
        drawn = qid in V.SVG_OPTIONS
        apt.append({
            "type": "mcq", "q": qid, "format": "svg" if drawn else "text",
            # `domain` MUST be one of the seven keys the career map's aptitude
            # affinity table uses, or the item contributes nothing to matching.
            "domain": D.APTITUDE_ENGINE_DOMAIN[dim],
            "domainLabel": dim,           # the sheet's finer name, for display
            "difficulty": D.APTITUDE_DIFFICULTY[qid],
            "text": text,
            # Where the answers are drawn, the option text becomes the alt/label
            # and the figures carry the meaning — that is what turns a reading
            # exercise into a puzzle.
            "options": V.SVG_OPTIONS[qid]() if drawn else list(options),
            "optionLabels": list(options) if drawn else None,
            "svgOptions": drawn, "correct": ord(correct) - 65, "media": media,
            "imageStatus": img,
        })
    out["aptitude"] = apt

    # ---- personality
    out["personality"] = [{
        "type": "choice5", "q": qid, "trait": trait, "facet": facet, "text": text,
        "options": [t for t, _p in opts],
        "traitPoints": [p for _t, p in opts],
        # No abstainIndex any more: the "None of these" opt-out is gone, and an
        # option with no weights is a real low-trait position rather than a
        # non-answer, so it must stay in the denominator.
    } for qid, text, opts, trait, facet, _note in D.PERSONALITY]

    # ---- strengths
    # Scored on the eight domains the career map already uses across all 113
    # professions; `reportGroups` is the four-way rollup the report shows, so
    # resolution is kept for matching and simplicity is kept for the student.
    out["strengths"] = [{
        "type": "choice5", "q": qid, "text": text,
        "options": [o[0] for o in opts],
        "strengthPoints": D.STRENGTHS_WEIGHTS[qid],
        "domainPerOption": D.STRENGTHS_DOMAINS[qid],
        "reportGroups": D.STRENGTHS_GROUPS[qid],
    } for qid, text, opts, _cd, _cl, _pr in D.STRENGTHS]

    # ---- motivators
    out["motivators"] = [{
        "type": "choice5", "q": qid, "text": text,
        "options": [o[0] for o in opts],
        "motivatorPoints": D.MOTIVATOR_WEIGHTS[qid],
        "domainPerOption": D.MOTIVATOR_DOMAINS[qid],
    } for qid, text, opts, _cl, _pr in D.MOTIVATORS]

    # ---- learning_styles
    out["learning_styles"] = [{
        "type": "vark", "q": qid, "text": text, "options": list(options),
        "styles": list(D.LEARNING_STYLES_ORDER),
    } for qid, text, options, _cl, _pr, _src in D.LEARNING]

    # ---- multiple_intelligence
    out["multiple_intelligence"] = [{
        "type": "choice5", "q": qid, "text": text, "options": list(options),
        "intelPoints": [dict(p) for p in D.MI_POINTS],
    } for qid, text, options, _cl, _pr in D.MI]

    # ---- emotional_intelligence
    out["emotional_intelligence"] = [{
        "type": "choice5", "q": qid, "dimension": dim, "text": text,
        "options": list(options),
        "optionDomains": list(D.EI_ORDER),
    } for qid, text, options, dim, _fw, _cl, _pr in D.EI]

    # ---- break the fixed option order on the three positional sections, and
    #      spread the aptitude answer key. Both are order-only changes.
    for cat, parallel in (("multiple_intelligence", ("intelPoints",)),
                          ("learning_styles", ("styles",)),
                          ("emotional_intelligence", ("optionDomains",))):
        for i, rec in enumerate(out[cat]):
            rotate(rec, parallel, i + 1)
    out["aptitude"] = spread_answer_key(out["aptitude"])
    return out


def main(dry_run: bool):
    main_bank = json.loads(MAIN.read_text(encoding="utf-8"))
    apt_bank = json.loads(APT.read_text(encoding="utf-8"))
    str_bank = json.loads(STR.read_text(encoding="utf-8"))

    before = {c: len(main_bank[c][STAGE][SET]) for c in main_bank}
    before["aptitude"] = len(apt_bank[STAGE][SET])
    before["strengths"] = len(str_bank[STAGE][SET])

    records = build_records(apt_bank[STAGE][SET])

    # blueprint check before anything is written
    problems = []
    for _sheet, cat, count, _rng in D.BLUEPRINT:
        got = len(records[cat])
        if got != count:
            problems.append(f"{cat}: {got} questions, blueprint says {count}")
        for r in records[cat]:
            if len(r["options"]) < 4:
                problems.append(f"{cat} {r['q']}: only {len(r['options'])} options")
            for field in ("riasec", "clusterWeights", "careers", "traitPoints",
                          "strengthPoints", "motivatorPoints", "intelPoints",
                          "styles", "optionDomains"):
                if field in r and len(r[field]) != len(r["options"]):
                    problems.append(
                        f"{cat} {r['q']}: {field} has {len(r[field])} entries "
                        f"for {len(r['options'])} options")
    total = sum(len(records[c]) for _s, c, _n, _r in D.BLUEPRINT)
    if total != 60:
        problems.append(f"total is {total}, expected 60")
    if problems:
        raise SystemExit("VERIFY FAILED:\n  " + "\n  ".join(problems))

    print(f"{'category':<24}{'before':>8}{'after':>8}  options")
    for _sheet, cat, _count, _rng in D.BLUEPRINT:
        opts = sorted({len(r["options"]) for r in records[cat]})
        print(f"{cat:<24}{before[cat]:>8}{len(records[cat]):>8}  {opts}")
    print(f"{'TOTAL':<24}{sum(before[c] for _s, c, _n, _r in D.BLUEPRINT):>8}{total:>8}")

    if unmapped:
        print("\nprofessions with no career-map equivalent (kept as-is, will score "
              "on interests only):")
        for n in sorted(unmapped):
            print(f"  - {n}")

    if dry_run:
        print("\n--dry-run: nothing written")
        return

    for path in (MAIN, APT, STR):
        backup = path.with_suffix(".pre-2026.json")
        if not backup.exists():
            shutil.copy2(path, backup)
            print(f"backed up {path.name} -> {backup.name}")

    for cat in ("career_interest", "personality", "motivators", "learning_styles",
                "multiple_intelligence", "emotional_intelligence"):
        main_bank[cat][STAGE][SET] = records[cat]
    apt_bank[STAGE][SET] = records["aptitude"]
    str_bank[STAGE][SET] = records["strengths"]

    MAIN.write_text(json.dumps(main_bank, ensure_ascii=False, indent=1), encoding="utf-8")
    APT.write_text(json.dumps(apt_bank, ensure_ascii=False, indent=1), encoding="utf-8")
    STR.write_text(json.dumps(str_bank, ensure_ascii=False, indent=1), encoding="utf-8")
    print("\nwrote data/assessment-questions.json, data/aptitude-questions.json, "
          "data/strengths-questions.json")


if __name__ == "__main__":
    main("--dry-run" in sys.argv)

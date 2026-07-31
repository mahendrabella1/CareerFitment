# -*- coding: utf-8 -*-
"""Break the positional pattern in every section of the Class 9-10 bank.

The problem
-----------
Options were laid out in the same order on every question, so the exam could be
answered without reading it:

    emotional intelligence  scores are [3,2,2,1] on every item — the BEST answer
                            is always option A. Pick A five times and you score
                            a perfect EQ.
    motivators              all six motivators sat in a fixed slot: B was always
                            Innovation, E was always Security.
    multiple intelligence   seven of eight intelligences locked to one slot.
    learning styles         identical order on all four items — Visual always A.
    career interest         six of eight clusters locked; the health option was
                            always last, because it was appended to each item.
    aptitude                the answer key was C x5, B x3, D x2, so guessing C
                            throughout scored 50% without reading anything.

A student answering by position — and under exam fatigue many do — produced a
perfectly consistent and completely false profile. It also means an alert
student can steer the result, which is what a reviewer noticed in testing.

The fix
-------
Permute each question's options, carrying every parallel array with them so the
mapping from an option to what it scores is untouched. Not one word of text
changes; only where each option sits.

The permutation is derived from the question id, so it is stable across runs —
re-importing or regenerating never reshuffles, and the workbook always matches
the live bank. Aptitude additionally has its answer index moved with the option,
and the key is spread deliberately rather than left to chance.

Verification is exact: for every question the mapping {option text -> its
scoring} must be identical before and after, or the script refuses to write.

Usage:  python scripts/shuffle_option_order.py [--dry-run]
"""

from __future__ import annotations

import copy
import hashlib
import json
import sys
from collections import Counter, defaultdict
from pathlib import Path

DATA = Path(__file__).resolve().parent.parent / "data"
STAGE, SET = "9-10", "Set 1"

MAIN = DATA / "assessment-questions.json"
APT = DATA / "aptitude-questions.json"
STR = DATA / "strengths-questions.json"

# category -> the arrays that must move with `options`
PARALLEL = {
    "career_interest": ("clusterWeights", "riasec", "careers", "careerMatches"),
    "personality": ("traitPoints",),
    "strengths": ("strengthPoints", "domainPerOption", "reportGroups", "clientDomains"),
    "motivators": ("motivatorPoints", "domainPerOption"),
    "multiple_intelligence": ("intelPoints",),
    "learning_styles": ("styles",),
    "emotional_intelligence": ("scores", "optionDomains"),
    "aptitude": ("optionLabels",),
}
# the field whose value identifies what an option scores, for verification
SCORED_BY = {
    "career_interest": "clusterWeights", "personality": "traitPoints",
    "strengths": "strengthPoints", "motivators": "motivatorPoints",
    "multiple_intelligence": "intelPoints", "learning_styles": "styles",
    "emotional_intelligence": "scores", "aptitude": None,
}


def construct_of(value) -> str:
    """What an option scores, as a single comparable label."""
    if isinstance(value, dict):
        return max(value, key=value.get) if value else "-"
    return str(value)


def choose_orders(qs: list[dict], field: str | None) -> dict[str, list[int]]:
    """Pick an option order per question that spreads each construct across the
    five slots as evenly as the section allows.

    A hash-derived shuffle is not enough here. With only four or five questions
    in a section, a random-looking permutation still leaves constructs pinned to
    one slot surprisingly often — which is the whole defect. So this searches
    every permutation of each question and greedily takes the one that keeps the
    worst (construct, slot) concentration lowest. Ties break on a hash of the
    question id, so the result is stable across runs.
    """
    from itertools import permutations

    seen: Counter = Counter()
    chosen: dict[str, list[int]] = {}
    for q in qs:
        n = len(q["options"])
        if n < 2:
            continue
        constructs = ([construct_of(v) for v in q.get(field, [])] if field
                      else [str(i) for i in range(n)])
        if len(constructs) != n:
            constructs = [str(i) for i in range(n)]
        tie = int.from_bytes(hashlib.sha256(q["q"].encode()).digest()[:4], "big")

        best, best_key = None, None
        for order in permutations(range(n)):
            # order[i] = which original option ends up at slot i
            worst = 0
            total = 0
            for slot, orig in enumerate(order):
                c = seen[(constructs[orig], slot)]
                worst = max(worst, c)
                total += c
            key = (worst, total, (hash(order) ^ tie) & 0xffff)
            if best_key is None or key < best_key:
                best, best_key = order, key
        chosen[q["q"]] = list(best)
        for slot, orig in enumerate(best):
            seen[(constructs[orig], slot)] += 1
    return chosen


def fingerprint(q: dict, cat: str) -> set:
    """{option text -> what it scores}, order-independent."""
    field = SCORED_BY[cat]
    if field is None:  # aptitude: the correct answer must follow its option
        return {(str(q["options"][q["correct"]]), "CORRECT")}
    out = set()
    for text, score in zip(q["options"], q.get(field, [])):
        out.add((str(text), json.dumps(score, sort_keys=True)))
    return out


def apply(qs: list[dict], cat: str) -> int:
    orders = choose_orders(qs, SCORED_BY[cat])
    changed = 0
    for q in qs:
        n = len(q["options"])
        if n < 2:
            continue
        before = fingerprint(q, cat)
        order = orders.get(q["q"], list(range(n)))
        if order == list(range(n)):
            continue
        q["options"] = [q["options"][i] for i in order]
        for field in PARALLEL[cat]:
            seq = q.get(field)
            if isinstance(seq, list) and len(seq) == n:
                q[field] = [seq[i] for i in order]
        if isinstance(q.get("correct"), int):
            q["correct"] = order.index(q["correct"])
        if fingerprint(q, cat) != before:
            raise SystemExit(f"{cat} {q['q']}: option-to-score mapping changed — refusing to write")
        changed += 1
    return changed


def report(qs: list[dict], cat: str, label: str) -> None:
    field = SCORED_BY[cat]
    if field is None:
        key = Counter(chr(65 + q["correct"]) for q in qs)
        best = max(key.values())
        print(f"  {label:<7} answer key {dict(sorted(key.items()))} "
              f"-> a pure guesser scores {best / len(qs) * 100:.0f}%")
        return
    slots = defaultdict(set)
    for q in qs:
        for i, v in enumerate(q.get(field, [])):
            k = (max(v, key=v.get) if isinstance(v, dict) and v else
                 "-" if isinstance(v, dict) else str(v))
            slots[k].add(i)
    stuck = sorted(k for k, s in slots.items() if len(s) == 1 and len(qs) > 1)
    print(f"  {label:<7} locked to a single slot: {', '.join(stuck) if stuck else 'none'}")


def main(dry_run: bool) -> None:
    main_bank = json.loads(MAIN.read_text(encoding="utf-8"))
    apt_bank = json.loads(APT.read_text(encoding="utf-8"))
    str_bank = json.loads(STR.read_text(encoding="utf-8"))

    sets = {c: main_bank[c][STAGE][SET] for c in main_bank}
    sets["aptitude"] = apt_bank[STAGE][SET]
    sets["strengths"] = str_bank[STAGE][SET]

    total = 0
    for cat in PARALLEL:
        qs = sets[cat]
        print(f"\n{cat}")
        report(qs, cat, "before")
        before = [copy.deepcopy(q) for q in qs]
        total += apply(qs, cat)
        report(qs, cat, "after")
        # every option text must survive, just in a different place
        for a, b in zip(before, qs):
            if sorted(map(str, a["options"])) != sorted(map(str, b["options"])):
                raise SystemExit(f"{cat} {a['q']}: option text changed")

    # Aptitude: spread the key deliberately instead of leaving it to the shuffle.
    apt = sets["aptitude"]
    for i, q in enumerate(apt):
        want = i % len(q["options"])
        n = len(q["options"])
        step = (q["correct"] - want) % n
        if step:
            order = [(j + step) % n for j in range(n)]
            q["options"] = [q["options"][j] for j in order]
            for f in PARALLEL["aptitude"]:
                s = q.get(f)
                if isinstance(s, list) and len(s) == n:
                    q[f] = [s[j] for j in order]
            q["correct"] = order.index(q["correct"])
    print("\naptitude (key spread)")
    report(apt, "aptitude", "after")

    print(f"\n{total} questions reordered; no option text or mapping changed")
    if dry_run:
        print("--dry-run: nothing written")
        return
    MAIN.write_text(json.dumps(main_bank, ensure_ascii=False, indent=1), encoding="utf-8")
    APT.write_text(json.dumps(apt_bank, ensure_ascii=False, indent=1), encoding="utf-8")
    STR.write_text(json.dumps(str_bank, ensure_ascii=False, indent=1), encoding="utf-8")
    print("wrote assessment-questions.json, aptitude-questions.json, strengths-questions.json")


if __name__ == "__main__":
    main("--dry-run" in sys.argv)

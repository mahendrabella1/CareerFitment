#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Builds the class 11-12 DEMO question bank from "11-12th questionare-v1.xlsx".

This bank is deliberately SEPARATE from the live exam. It is written under its
own stage key ("11-12-demo") so that /demo-test can serve it without any risk
of altering what class 9-10 students sit today. Nothing here is read by the
paid flow.

Source of truth: the 7 dimension tabs of that workbook. Question wording,
options and dimension mappings are transcribed VERBATIM. Two things the
workbook leaves implicit are resolved here and documented at the point of use:

  * RIASEC (interests) is given as bare letters ("I+R") with no magnitudes, so
    the first letter is scored 3 and the second 1 — a clear primary with a
    supporting secondary, matching how the 9-10 bank was built.
  * Multiple-intelligence names are written with an ASCII hyphen in the sheet
    ("Logical-Mathematical") but the scoring engine keys on the EN DASH form
    ("Logical–Mathematical", see miWeights in career-map-9-10.json). They are
    normalised on the way in; a mismatch here would silently zero the whole
    dimension.

Aptitude is NOT in the workbook — the client's sheet has no aptitude tab. It is
authored separately in scripts/build_demo_11_12_aptitude.py.

Writes:  data/demo-11-12/questions.json

Run:     python scripts/build_demo_11_12.py
"""

import json
import os
import re
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
PROJECT = os.path.join(HERE, "..")
DATA = os.path.join(PROJECT, "data", "demo-11-12")
XLSX = os.path.join(PROJECT, "..", "11-12th questionare-v1.xlsx")

sys.path.insert(0, HERE)
from demo_11_12_overlay import overlay_for  # noqa: E402
from demo_11_12_extra_interests import as_bank_questions  # noqa: E402
from demo_11_12_professions import canonicalise  # noqa: E402

try:
    import openpyxl
except ImportError:
    sys.exit("openpyxl is required:  pip install openpyxl")

# Option markers in the mapping columns look like "A · <payload>B · <payload>",
# run together with no separator. Split on the marker itself rather than on any
# punctuation inside the payload.
MARKER = re.compile(r"(?=[A-E] · )")

# The sheet writes these with an ASCII hyphen; the engine keys on an en dash.
MI_CANON = {
    "Logical-Mathematical": "Logical–Mathematical",
    "Bodily-Kinesthetic": "Bodily–Kinesthetic",
}

WARNINGS: list[str] = []


def warn(sheet: str, qno: str, msg: str) -> None:
    WARNINGS.append(f"  [{sheet} {qno}] {msg}")


def cell(v) -> str:
    return "" if v is None else str(v).strip()


def split_by_option(raw: str, sheet: str, qno: str, field: str) -> dict[str, str]:
    """"A · xB · y" -> {"A": "x", "B": "y"}."""
    raw = cell(raw)
    if not raw:
        return {}
    out: dict[str, str] = {}
    for part in MARKER.split(raw):
        part = part.strip()
        if not part or len(part) < 3 or part[1:4] != " · ":
            if part:
                warn(sheet, qno, f"{field}: unparsed fragment {part[:40]!r}")
            continue
        out[part[0]] = part[4:].strip().rstrip(",").strip()
    return out


def parse_points(payload: str, canon=None) -> dict[str, int]:
    """"Analytical+3, Learning+1" -> {"Analytical": 3, "Learning": 1}."""
    pts: dict[str, int] = {}
    for chunk in payload.split(","):
        chunk = chunk.strip()
        if not chunk:
            continue
        if chunk in ("—", "-", "–"):
            continue
        # Emotional Stability is reverse-scored on some items ("S-3"), so the
        # sign is part of the data, not a typo. Dropping it would turn a
        # penalty into nothing and inflate the trait.
        m = re.match(r"^(.+?)\s*([+-])\s*(\d+)$", chunk)
        if not m:
            continue
        name = m.group(1).strip()
        if canon:
            name = canon.get(name, name)
        pts[name] = int(m.group(3)) * (1 if m.group(2) == "+" else -1)
    return pts


def parse_letters(payload: str) -> dict[str, int]:
    """"I+R" -> {"I": 3, "R": 1}. Bare RIASEC letters carry no magnitude in the
    sheet; primary 3 / secondary 1 is this build's convention."""
    letters = [x.strip() for x in payload.split("+") if x.strip()]
    out: dict[str, int] = {}
    for i, ltr in enumerate(letters[:2]):
        if len(ltr) == 1 and ltr.isalpha():
            out[ltr.upper()] = 3 if i == 0 else 1
    return out


def option_texts(row: dict, keys: list[str]) -> list[str]:
    """Options in workbook order, dropping trailing blanks and em-dash fillers
    (the Learning Styles tab pads to five columns with "—")."""
    vals = [cell(row.get(k)) for k in keys]
    while vals and vals[-1] in ("", "—", "-", "–"):
        vals.pop()
    return vals


def rows_of(ws) -> list[dict]:
    raw = [r for r in ws.iter_rows(values_only=True)]
    hdr = [cell(h) for h in raw[0]]
    out = []
    for r in raw[1:]:
        d = {h: v for h, v in zip(hdr, r) if h}
        qno = cell(d.get("Q.No"))
        # The Interests tab repeats its header row between blocks; those rows
        # carry the literal string "Q.No" and are not questions.
        if qno and qno != "Q.No":
            out.append(d)
    return out


def aligned(per_opt: dict[str, str], n: int, sheet: str, qno: str, field: str) -> list[str]:
    """Line a per-option mapping up with the option list, in A..E order."""
    letters = ["A", "B", "C", "D", "E"][:n]
    missing = [l for l in letters if l not in per_opt]
    if missing:
        warn(sheet, qno, f"{field}: no mapping for option(s) {','.join(missing)}")
    extra = [l for l in per_opt if l not in letters]
    if extra:
        warn(sheet, qno, f"{field}: mapping for non-existent option(s) {','.join(extra)}")
    return [per_opt.get(l, "") for l in letters]


# ===========================================================================
# Per-sheet parsers. Each returns questions in the v2 bank shape that
# lib/newAssessment/scoring60.ts already reads for class 9-10.
# ===========================================================================

def parse_interests(ws) -> list[dict]:
    out = []
    for row in rows_of(ws):
        qno = cell(row["Q.No"])
        opts = option_texts(row, ["Option A", "Option B", "Option C", "Option D", "Option E"])
        n = len(opts)
        if cell(row.get("Cluster Weights")):
            clusters = [parse_points(x) for x in aligned(split_by_option(row.get("Cluster Weights"), "Interests", qno, "Cluster Weights"), n, "Interests", qno, "Cluster Weights")]
            riasec = [parse_letters(x) for x in aligned(split_by_option(row.get("RIASEC (per option)"), "Interests", qno, "RIASEC"), n, "Interests", qno, "RIASEC")]
            # The workbook's career names are a SCORING input, not display
            # text: scoring60 turns them into interest votes. Titles it does
            # not know ("Healthcare Professional", "Smart-City Engineer") enter
            # a student's match list carrying no cluster at all, which is how a
            # career title ended up printed beside an unrelated cluster name.
            # Mapped onto the engine's vocabulary here; the wording the student
            # reads is untouched.
            careers = [canonicalise([c.strip() for c in x.split(",") if c.strip()])
                       for x in aligned(split_by_option(row.get("Example Careers (per option)"), "Interests", qno, "Careers"), n, "Interests", qno, "Careers")]
            authored = False
        else:
            # The workbook leaves Q13-Q24 unmapped. scripts/demo_11_12_overlay.py
            # supplies them; see that file for how each option was read.
            ov = overlay_for(qno)
            if ov is None:
                warn("Interests", qno, "no workbook mapping AND no overlay entry - question dropped")
                continue
            clusters, riasec, careers = ov
            authored = True
        out.append({
            "type": f"choice{n}",
            "q": qno,
            "text": cell(row["Question"]),
            "options": opts,
            "riasec": riasec,
            "clusterWeights": clusters,
            "careers": careers,
            "mappingAuthored": authored,
        })
    return out


def parse_personality(ws) -> list[dict]:
    out = []
    for row in rows_of(ws):
        qno = cell(row["Q.No"])
        opts = option_texts(row, ["Option A", "Option B", "Option C", "Option D", "Option E"])
        n = len(opts)
        # The workbook fills "Weights per option" for eight questions and puts
        # the SAME weight notation in "Trait per option" for the other 22
        # (which then hold "O+3" rather than "Openness"). Read whichever column
        # actually carries the notation; treating the second group as unmapped
        # would silently drop three quarters of the personality items.
        src = row.get("Weights per option")
        if not cell(src):
            src = row.get("Trait per option")
        w = aligned(split_by_option(src, "Personality", qno, "Weights"), n, "Personality", qno, "Weights")
        out.append({
            "type": f"choice{n}",
            "q": qno,
            "trait": cell(row.get("Big Five Trait")),
            "facet": cell(row.get("Facet")),
            "text": cell(row["Situation"]),
            "options": opts,
            "traitPoints": [parse_points(x) for x in w],
        })
    return out


def parse_weighted(ws, text_col: str, weight_col: str, field: str, label: str, canon=None) -> list[dict]:
    """Shared shape for Strengths / Motivators / Multiple Intelligence: one
    weights column of "<Trait>+<n>, <Trait>+<n>" per option."""
    out = []
    for row in rows_of(ws):
        qno = cell(row["Q.No"])
        opts = option_texts(row, ["Option A", "Option B", "Option C", "Option D", "Option E"])
        n = len(opts)
        w = aligned(split_by_option(row.get(weight_col), label, qno, weight_col), n, label, qno, weight_col)
        out.append({
            "type": f"choice{n}",
            "q": qno,
            "text": cell(row[text_col]),
            "options": opts,
            field: [parse_points(x, canon) for x in w],
        })
    return out


def parse_learning(ws) -> list[dict]:
    out = []
    for row in rows_of(ws):
        qno = cell(row["Q.No"])
        opts = option_texts(row, ["Option A", "Option B", "Option C", "Option D", "Option E"])
        n = len(opts)
        styles = aligned(split_by_option(row.get("Style (per option)"), "Learning", qno, "Style"), n, "Learning", qno, "Style")
        out.append({
            "type": "vark",
            "q": qno,
            "text": cell(row["Scenario"]),
            "options": opts,
            "styles": styles,
        })
    return out


def parse_ei(ws) -> list[dict]:
    out = []
    for row in rows_of(ws):
        qno = cell(row["Q.No"])
        opts = option_texts(row, ["Option A", "Option B", "Option C", "Option D", "Option E"])
        n = len(opts)
        sc = aligned(split_by_option(row.get("Scoring"), "EI", qno, "Scoring"), n, "EI", qno, "Scoring")
        scores = []
        for s in sc:
            m = re.match(r"^(\d+)$", s.strip())
            scores.append(int(m.group(1)) if m else 0)
        out.append({
            "type": f"choice{n}",
            "q": qno,
            "dimension": cell(row.get("Dimension")),
            "text": cell(row["Situation / Question"]),
            "options": opts,
            "scores": scores,
        })
    return out


# ===========================================================================
# Set construction
# ===========================================================================
#
# The workbook holds far more questions than one sitting uses (201 across the
# seven self-report tabs). A sitting is 60 questions, so the bank is cut into
# parallel SETS: every set draws a different slice of each tab, and a student
# gets one set at random. Two students therefore rarely see the same paper,
# and each paper still covers every dimension in the agreed proportions.
#
# Blueprint per 60-question sitting (aptitude is added by the aptitude script):
#   Interests 12 · Aptitude 15 · Personality 10 · Strengths 7
#   Motivators 5 · Multiple intelligence 5 · Learning styles 3 · EI 3
BLUEPRINT = {
    "career_interest": 12,
    "personality": 10,
    "strengths": 7,
    "motivators": 5,
    "multiple_intelligence": 5,
    "learning_styles": 3,
    "emotional_intelligence": 3,
}


def balanced_interest_sets(client, authored, per_set):
    """Build each interest paper from HALF client questions and HALF authored.

    Interleaving them into one list and slicing was not enough. Every client
    question carries one Arts, one Business and one Science option, so a paper
    weighted towards their questions is automatically weighted towards those
    three clusters - which is the bias the authored questions exist to correct.
    Taking a fixed half from each pool is what actually flattens it:

        6 client   -> D6 E6 G6, plus ~12 slots over A/B/C/F
        6 authored -> A6 B6 C6 F6 H6

    giving every cluster 6-10 offers per paper instead of 3-12.

    Both pools wrap independently, so no question is stranded and every paper is
    the same length however unevenly the two pools are sized.
    """
    if not authored:
        return build_sets(client, per_set)
    half = per_set // 2
    count = max(1, -(-max(len(client), len(authored)) // half))
    sets = {}
    for i in range(count):
        chunk = [client[(i * half + j) % len(client)] for j in range(per_set - half)]
        chunk += [authored[(i * half + j) % len(authored)] for j in range(half)]
        sets[f"Set {i + 1}"] = chunk
    return sets


def build_sets(questions: list[dict], per_set: int) -> dict[str, list[dict]]:
    """Deal the tab's questions into sets, wrapping so every set is full length.

    Set COUNT rounds UP, not down. Rounding down silently discarded every
    question past the last whole set - with 34 interest questions at 12 per
    set, `34 // 12` built two sets and ten questions (including three quarters
    of the cluster-H coverage) were written to the bank but never dealt to
    anybody. Rounding up and wrapping the tail keeps every question in play and
    keeps all sets the same length, so paper length never depends on which set
    a student draws."""
    n = len(questions)
    if n == 0 or per_set == 0:
        return {"Set 1": []}
    count = max(1, -(-n // per_set))  # ceiling division
    sets: dict[str, list[dict]] = {}
    for i in range(count):
        chunk = [questions[(i * per_set + j) % n] for j in range(per_set)]
        sets[f"Set {i + 1}"] = chunk
    return sets


def main() -> None:
    if not os.path.exists(XLSX):
        sys.exit(f"workbook not found: {XLSX}")
    wb = openpyxl.load_workbook(XLSX, data_only=True)

    parsed = {
        # The client's 24 interest questions, plus ten authored ones that give
        # cluster H any coverage at all. See demo_11_12_extra_interests.py.
        "career_interest": parse_interests(wb["Intresets"]) + as_bank_questions(),
        "personality": parse_personality(wb["Personality"]),
        "strengths": parse_weighted(wb["Strengths"], "Question", "Weights", "strengthPoints", "Strengths"),
        "motivators": parse_weighted(wb["Motivators"], "Question", "Weights", "motivatorPoints", "Motivators"),
        "multiple_intelligence": parse_weighted(wb["Multiple Intelligence"], "Question", "Weights", "intelPoints", "MI", MI_CANON),
        "learning_styles": parse_learning(wb["Learning Styles"]),
        "emotional_intelligence": parse_ei(wb["Emotional Intelligence"]),
    }

    bank = {}
    for cat, qs in parsed.items():
        if cat == "career_interest":
            client = [q for q in qs if not q.get("questionAuthored")]
            authored = [q for q in qs if q.get("questionAuthored")]
            bank[cat] = {"11-12-demo": balanced_interest_sets(client, authored, BLUEPRINT[cat])}
        else:
            bank[cat] = {"11-12-demo": build_sets(qs, BLUEPRINT[cat])}

    os.makedirs(DATA, exist_ok=True)
    out = os.path.join(DATA, "questions.json")
    with open(out, "w", encoding="utf-8") as fh:
        json.dump(bank, fh, ensure_ascii=False, indent=1)

    print("Parsed from", os.path.basename(XLSX))
    for cat, qs in parsed.items():
        sets = bank[cat]["11-12-demo"]
        print(f"  {cat:24s} {len(qs):3d} questions -> {len(sets)} set(s) x {BLUEPRINT[cat]}")
    print(f"\nPer sitting: {sum(BLUEPRINT.values())} self-report + 15 aptitude = {sum(BLUEPRINT.values()) + 15}")
    print("Wrote", os.path.relpath(out, PROJECT))
    # Interest options are what drive cluster matching (40% of the weight), so
    # a cluster no option ever points at is a cluster no student can be matched
    # to. Report it rather than let it hide in the data.
    seen = {}
    for q in parsed["career_interest"]:
        for vec in q["clusterWeights"]:
            for k in vec:
                seen[k] = seen.get(k, 0) + 1
    missing = [c for c in "ABCDEFGH" if c not in seen]
    # Per-set coverage is the number that actually matters: a cluster present
    # in the bank but absent from the set a student draws is still unreachable
    # for that student.
    print()
    print("Interest cluster coverage per SET (options pointing at each cluster):")
    for set_name, qs in bank["career_interest"]["11-12-demo"].items():
        per = {}
        for q in qs:
            for vec in q["clusterWeights"]:
                for k in vec:
                    per[k] = per.get(k, 0) + 1
        gaps = [c for c in "ABCDEFGH" if c not in per]
        print("  {:8s} {}{}".format(
            set_name,
            " ".join("{}={}".format(k, per.get(k, 0)) for k in "ABCDEFGH"),
            "   MISSING: " + ",".join(gaps) if gaps else ""))

    print()
    print("Interest cluster coverage:", ", ".join(f"{k}={seen[k]}" for k in sorted(seen)))
    if missing:
        print(f"  NOTE: cluster(s) {', '.join(missing)} are never pointed at by any")
        print("  option in the client workbook, so careers in them cannot surface")
        print("  from interests. Needs client questions to fix, not a code change.")

    if WARNINGS:
        print(f"\n{len(WARNINGS)} WARNING(S):")
        for w in WARNINGS[:40]:
            print(w)
    else:
        print("\nNo warnings — every option mapped cleanly.")


if __name__ == "__main__":
    sys.stdout.reconfigure(encoding="utf-8")
    main()

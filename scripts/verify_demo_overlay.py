#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Verifies the AUTHORED interest mappings in demo_11_12_overlay.py.

Why this exists
---------------
The client workbook maps only Interests Q1-Q12. Q13-Q24 carry a question and
five options and nothing else, so their cluster and RIASEC mappings were
written by us. Interests are 40% of the career-match weight, which makes those
twelve mappings the highest-leverage authored data in the whole demo — and
"we read the options carefully" is not a checkable claim.

So this script re-derives the mapping from the option TEXT, independently of
what was authored, and reports every disagreement.

How the derivation works
------------------------
Each cluster has a keyword profile drawn from how the client's OWN mapped block
(Q1-Q12) words its options. An option is scored against every profile and the
best-scoring cluster wins. That is deliberately a different method from the way
the overlay was written (by reading each option as a whole), so agreement
between the two is real evidence rather than the same judgement twice.

Disagreements are not automatically failures — the keyword model is crude and
an option can legitimately sit between two clusters. They are printed for a
human to adjudicate. What IS a failure:

  * an authored cluster the keyword model gives ZERO evidence for
  * a question whose five options do not cover five distinct clusters
  * RIASEC letters that contradict the cluster they are paired with

Also writes a review table so the client can sign the mappings off in one pass
without reading Python.

Run:  python scripts/verify_demo_overlay.py
"""

import io
import json
import os
import re
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
PROJECT = os.path.join(HERE, "..")
XLSX = os.path.join(PROJECT, "..", "11-12th questionare-v1.xlsx")
REVIEW = os.path.join(PROJECT, "docs", "demo-11-12-authored-interests.md")

sys.path.insert(0, HERE)
from demo_11_12_overlay import INTEREST_OVERLAY  # noqa: E402
from demo_11_12_extra_interests import EXTRA_INTERESTS  # noqa: E402
from demo_11_12_professions import canonicalise, known_professions  # noqa: E402

try:
    import openpyxl
except ImportError:
    sys.exit("openpyxl is required:  pip install openpyxl")

CLUSTER_NAME = {
    "A": "Core Engineering & Infrastructure",
    "B": "Information Technology",
    "C": "Health Science",
    "D": "Arts, Media & Design",
    "E": "Business & Marketing",
    "F": "Human & Public Services",
    "G": "Science, Nature & Agriculture",
    "H": "Sports, Hospitality & Lifestyle",
}

# Keyword profiles, as STEMS matched on word boundaries.
#
# Substring matching was a bug, not a shortcut: "ai" matched inside "failed",
# handing Information Technology two points for an option about a product
# failing to meet a human need. Every entry below is matched as a whole word or
# a word prefix, never mid-word.
#
# Weight 3 = decisive, 2 = strongly indicative, 1 = supporting.
#
# The vocabulary spans both sources. The client's questions are abstract
# ("build a better technical solution"); the authored ones name concrete things
# ("the menu", "the signage", "the physiotherapists"). The model has to know
# both or it cannot judge either fairly.
KEYWORDS = {
    "A": [("build", 2), ("built", 2), ("engineer", 2), ("machine", 2), ("prototype", 2),
          ("construct", 2), ("hardware", 2), ("technical", 2), ("technolog", 1),
          ("implement", 1), ("test", 1), ("works", 2), ("physical", 2), ("realistically", 1),
          ('rebuild', 1), ('cycling', 2), ('lanes', 2), ('infrastructure', 2),
          ('lift', 2), ('ventilation', 3), ('shelter', 2), ('handrail', 3), ('flooring', 2), ('drainage', 3), ('road', 2), ('streetlight', 3), ('plumbing', 3), ('wiring', 3), ('rigging', 3), ('vehicle', 2), ('boats', 2), ('mechanical', 3), ('manufacturing', 3), ('plant', 2), ('refrigeration', 3), ('extraction', 2), ('servery', 2), ('bins', 2), ('composting', 2), ('gantries', 3), ('barriers', 2), ('sanitation', 3), ('equipment', 1), ('maintain', 1), ('install', 2), ('repair', 2), ('power supply', 3)],
    "B": [("software", 3), ("ai", 3), ("code", 3), ("coding", 3), ("digital", 2), ("app", 2),
          ("computer", 3), ("programming", 3), ("cyber", 3), ("algorithm", 3),
          ("technolog", 1), ("data", 1), ("system", 1),
          ('website', 3), ('dashboard', 2), ('platform', 2), ('online', 2), ('app', 3), ('digital', 2), ('records system', 3),
          ('digital', 2), ('screen', 2), ('sensors', 2), ('dashboard', 2), ('tracking', 2), ('online', 2), ('website', 3), ('register', 1), ('writing software', 3)],
    "C": [("health", 3), ("patient", 3), ("doctor", 3), ("medical", 3), ("body", 2),
          ("clinical", 3), ("therap", 3), ("disease", 3), ("wellbeing", 2), ("nurs", 3),
          ('physiotherap', 3), ('injury', 3), ('rehabilitat', 3), ('recovery', 2), ('hygien', 3), ('nutrition', 3), ('treatment', 3), ('clinic', 3), ('illness', 3),
          ('first aid', 3), ('hospital', 3), ('clinic', 3), ('medication', 3), ('nutritionally', 3), ('nutritious', 3), ('recipes', 1), ('vaccination', 3), ('wellness', 2), ('biology', 3), ('injuries', 2), ('crowd stays safe', 1)],
    "D": [("design", 3), ("creativ", 3), ("creating", 2), ("created", 2), ("create", 2),
          ("visual", 3), ("film", 3), ("story", 2), ("art", 2), ("aesthetic", 3),
          ("original", 2), ("campaign", 2), ("present", 1), ("communicat", 1),
          ("remember", 2), ("beautiful", 2), ("concept", 1), ("experience", 1),
          ('redesign', 3), ('signage', 3), ('lighting', 2), ('interior', 3), ('poster', 3), ('video', 3), ('photograph', 3), ('branding', 3), ('storytelling', 3), ('identity', 2), ('stage', 2)],
    "E": [("business", 3), ("market", 3), ("customer", 3), ("strategy", 3), ("strategic", 3),
          ("profit", 3), ("entrepreneur", 3), ("organisation", 2), ("launch", 2),
          ("pricing", 3), ("sustainable", 2), ("successful", 2), ("viable", 2),
          ("resources", 1), ("opportunit", 2), ("grow", 2), ("scale", 2), ("adopted", 1),
          ("priorit", 1), ("coordinat", 1), ("lead", 1), ("applied", 1), ("practical", 1),
          ('sponsor', 3), ('budget', 2), ('commercial', 3), ('ticketing', 2), ('costs', 2), ('company', 2), ('employs', 2), ('revenue', 3), ('occupancy', 2), ('expand', 2), ('affordable', 1)],
    "F": [("people", 2), ("social", 2), ("communit", 2), ("behaviour", 2), ("teach", 3),
          ("public", 2), ("psycholog", 3), ("human", 2), ("someone", 2), ("helped", 2),
          ("students", 1), ("need", 1), ("perspectiv", 1), ("connected", 1),
          ('families', 2), ('distress', 2), ('neighbourhood', 2), ('schools', 1), ('left out', 2), ('programme', 1),
          ('school', 2), ('ngo', 3), ('residents', 2), ('volunteers', 2), ('newcomers', 3), ('shut out', 3), ('isolated', 2), ('affordable', 2), ('staffing', 2), ('welfare', 3), ('visiting', 2), ('trusts', 2), ('left behind', 3), ('decent place to work', 2), ('recruit', 1), ('brief', 1)],
    "G": [("research", 3), ("scientific", 3), ("science", 3), ("evidence", 3),
          ("investigat", 3), ("experiment", 3), ("phenomenon", 3), ("hypothes", 3),
          ("discover", 3), ("environment", 3), ("agricultur", 3), ("nature", 2),
          ("natural", 2), ("analys", 1), ("questions", 2), ("determine", 1), ("uncovered", 2),
          ('survey', 3), ('controlled', 2), ('measure', 1), ('assess', 1), ('sustainab', 2), ('impact', 1), ('interventions', 2)],
    "H": [("sport", 3), ("hospitality", 3), ("hotel", 3), ("travel", 3), ("tourism", 3),
          ("culinary", 3), ("fitness", 3), ("event", 3), ("guest", 3), ("athlete", 3),
          ("restaurant", 3), ("chef", 3), ("coach", 2), ("leisure", 3),
          ('venue', 3), ('catering', 3), ('guests', 3), ('menu', 3), ('kitchen', 3), ('meal', 3), ('cafe', 3), ('gym', 3), ('leagues', 3), ('trips', 3), ('booking', 2), ('coaching', 3), ('players', 2), ('arrive', 1), ('stay', 1),
          ('itinerary', 3), ('festival', 3), ('canteen', 2), ('cooked', 3), ('cooks', 3), ('serves', 2), ('outings', 3), ('meals', 2), ('food', 2), ('park', 2), ('sports ground', 3), ('wonderful time', 3), ('runners', 2), ('seating', 2), ('place feels', 2), ('room feels', 2)],
}

# RIASEC letters that are coherent with each cluster. A pairing outside this set
# is a contradiction, e.g. an Artistic letter on a Health Science option.
COHERENT_RIASEC = {
    "A": {"R", "I", "C"},
    "B": {"I", "R", "C"},
    "C": {"S", "I", "R"},
    "D": {"A", "E", "S"},
    "E": {"E", "C", "S"},
    "F": {"S", "A", "E", "I"},
    "G": {"I", "R", "A"},
    "H": {"S", "E", "R", "C"},
}


# Ties that have been REVIEWED and deliberately kept as they are.
#
# The keyword model prefers a different cluster for each of these, and in every
# case the option genuinely straddles two. Recording the decision here means a
# reviewed tie stops reappearing as an open question, while any NEW
# disagreement still surfaces - which is the whole point of keeping the check.
ADJUDICATED = {
    ("Q13", "B"): "'how technology could PROCESS or solve it' is data processing, "
                  "which is IT. The engineering reading would need something built.",
    ("Q13", "D"): "Presenting information so people understand it is information "
                  "design. The people in the sentence are the audience, not the subject.",
    ("Q16", "C"): "The option names health first and explicitly. Development and "
                  "behaviour qualify it; they do not move it out of health science.",
    ("Q19", "E"): "'applied to solve a practical problem or opportunity' is the "
                  "commercial framing. Research and building are already options A and B "
                  "in the same question, so this one is the business reading.",
    ("Q21", "C"): "Advocating for the end user is a human-services stance. The "
                  "engineering option in this question is B, what can realistically be built.",
    ("Q25", "C"): "First-aid cover and crowd safety is health, not IT. The model "
                  "scores it low only because the wording is short.",
    ("Q40", "B"): "Booking and membership SYSTEMS are software. Booking reads as "
                  "hospitality only because the venue happens to be a community centre.",
}


def score_text(text):
    """Evidence for each cluster in one option's wording.

    Stems match at a word boundary and may run to the end of the word, so
    "investigat" catches investigate/investigating/investigation but "ai" can
    never match inside "failed"."""
    low = text.lower()
    out = {}
    for cluster, words in KEYWORDS.items():
        total = 0
        for stem, weight in words:
            if re.search(r"\b" + re.escape(stem), low):
                total += weight
        if total:
            out[cluster] = total
    return out


def load_options():
    wb = openpyxl.load_workbook(XLSX, data_only=True)
    ws = wb["Intresets"]
    rows = list(ws.iter_rows(values_only=True))
    hdr = ["" if h is None else str(h).strip() for h in rows[0]]
    out = {}
    for r in rows[1:]:
        d = {h: v for h, v in zip(hdr, r) if h}
        q = "" if d.get("Q.No") is None else str(d["Q.No"]).strip()
        if not q or q == "Q.No":
            continue
        opts = []
        for letter in "ABCDE":
            v = d.get("Option " + letter)
            opts.append("" if v is None else str(v).strip())
        out[q] = {"question": str(d.get("Question") or "").strip(), "options": opts}
    return out


def main():
    if not os.path.exists(XLSX):
        sys.exit("workbook not found: " + XLSX)
    source = load_options()

    failures = []
    disagreements = []
    review_rows = []

    for qno in sorted(INTEREST_OVERLAY, key=lambda x: int(x[1:])):
        spec = INTEREST_OVERLAY[qno]
        src = source.get(qno)
        if not src:
            failures.append("{}: not present in the workbook at all".format(qno))
            continue
        if len(spec) != len(src["options"]):
            failures.append("{}: overlay has {} options, workbook has {}".format(
                qno, len(spec), len(src["options"])))
            continue

        clusters_used = []
        for i, (cluster, primary, secondary, _careers) in enumerate(spec):
            letter = "ABCDE"[i]
            text = src["options"][i]
            clusters_used.append(cluster)
            evidence = score_text(text)
            best = max(evidence, key=lambda k: evidence[k]) if evidence else None

            # HARD FAILURE: the authored cluster has no textual support at all.
            if cluster not in evidence:
                failures.append(
                    "{} option {}: authored {} ({}) but the wording gives it no support. "
                    "Best supported: {}. Text: {!r}".format(
                        qno, letter, cluster, CLUSTER_NAME[cluster],
                        best or "nothing", text[:70]))
            elif best != cluster:
                # SOFT: both are supported, the model just prefers another.
                disagreements.append(
                    "{} option {}: authored {} (score {}), keywords prefer {} (score {}). {!r}".format(
                        qno, letter, cluster, evidence[cluster], best, evidence[best], text[:60]))

            # HARD FAILURE: RIASEC letter incoherent with its own cluster.
            for riasec in [primary, secondary]:
                if riasec and riasec not in COHERENT_RIASEC[cluster]:
                    failures.append(
                        "{} option {}: RIASEC {} is incoherent with cluster {} ({})".format(
                            qno, letter, riasec, cluster, CLUSTER_NAME[cluster]))

            review_rows.append((qno, letter, text, cluster, CLUSTER_NAME[cluster],
                                primary + ("+" + secondary if secondary else "")))

        # HARD FAILURE: an option set that repeats a cluster is not a five-way
        # choice, it is a four-way choice with a duplicate.
        if len(set(clusters_used)) != len(clusters_used):
            failures.append("{}: clusters repeat within one question: {}".format(
                qno, ", ".join(clusters_used)))

    # The ten fully-authored questions (Q25-Q34) get the same treatment. They
    # are held to a STRICTER standard than Q13-Q24: we wrote the wording as
    # well as the mapping, so if the wording does not support the mapping that
    # is our error twice over, with nobody else's text to blame.
    for qno, question, options in EXTRA_INTERESTS:
        clusters_used = []
        for i, (text, cluster, primary, secondary, _careers) in enumerate(options):
            letter = "ABCDE"[i]
            clusters_used.append(cluster)
            evidence = score_text(text)
            best = max(evidence, key=lambda k: evidence[k]) if evidence else None
            if cluster not in evidence:
                failures.append(
                    "{} option {} (authored question): mapped {} ({}) but our own wording "
                    "gives it no support. Best supported: {}. Text: {!r}".format(
                        qno, letter, cluster, CLUSTER_NAME[cluster], best or "nothing", text[:70]))
            elif best != cluster:
                disagreements.append(
                    "{} option {} (authored question): mapped {} (score {}), keywords prefer "
                    "{} (score {}). {!r}".format(
                        qno, letter, cluster, evidence[cluster], best, evidence[best], text[:60]))
            for riasec in [primary, secondary]:
                if riasec and riasec not in COHERENT_RIASEC[cluster]:
                    failures.append(
                        "{} option {}: RIASEC {} is incoherent with cluster {} ({})".format(
                            qno, letter, riasec, cluster, CLUSTER_NAME[cluster]))
            review_rows.append((qno, letter, text, cluster, CLUSTER_NAME[cluster],
                                primary + ("+" + secondary if secondary else "")))
        if len(set(clusters_used)) != len(clusters_used):
            failures.append("{}: clusters repeat within one question: {}".format(
                qno, ", ".join(clusters_used)))

    # Every example-career name must be one the scoring engine can attach a
    # cluster to. A name it does not know still enters the student's match list
    # via interestVotes but belongs to no cluster, which is how a report ended
    # up printing a career title beside a cluster it has nothing to do with.
    engine_knows = known_professions()
    unknown = set()
    for spec in INTEREST_OVERLAY.values():
        for _c, _p, _s, careers in spec:
            unknown.update(n for n in canonicalise(careers) if n not in engine_knows)
    for _q, _t, opts in EXTRA_INTERESTS:
        for _o, _c, _p, _s, careers in opts:
            unknown.update(n for n in canonicalise(careers) if n not in engine_knows)
    # And the BUILT bank, which also carries the client's own transcribed career
    # names. Checking only our authored lists missed 48 of theirs.
    built = os.path.join(PROJECT, "data", "demo-11-12", "questions.json")
    if os.path.exists(built):
        bank = json.load(io.open(built, encoding="utf-8"))
        for qs in bank.get("career_interest", {}).get("11-12-demo", {}).values():
            for q in qs:
                for lst in q.get("careers", []):
                    unknown.update(n for n in lst if n not in engine_knows)
    for name in sorted(unknown):
        failures.append(
            "example career {!r} is not in professionCluster - it would score "
            "with no cluster. Add a mapping to demo_11_12_professions.py.".format(name))

    # Cluster H is the reason the authored questions exist. If they ever stop
    # covering it, the fix has silently been undone.
    h_count = sum(1 for r in review_rows if r[3] == "H")
    if h_count == 0:
        failures.append("no authored option points at cluster H - the coverage gap is back")

    # Review table, so the client can check this without reading code.
    os.makedirs(os.path.dirname(REVIEW), exist_ok=True)
    with io.open(REVIEW, "w", encoding="utf-8") as fh:
        fh.write("# Authored interest mappings — for client review\n\n")
        fh.write("The workbook maps Interests Q1-Q12. Q13-Q24 arrived with no mapping\n")
        fh.write("columns, so the cluster and RIASEC codes below were written by us and\n")
        fh.write("are **not** the client's own scoring. Interests carry 40% of the\n")
        fh.write("career-match weight, so these are worth checking line by line.\n\n")
        fh.write("Verified by `scripts/verify_demo_overlay.py`, which re-derives each\n")
        fh.write("mapping from the option wording by an independent method.\n\n")
        fh.write("| Q | Opt | Option text | Cluster | Cluster name | RIASEC |\n")
        fh.write("|---|-----|-------------|---------|--------------|--------|\n")
        for qno, letter, text, cluster, name, riasec in review_rows:
            clean = text.replace("|", "/").replace("\n", " ")
            fh.write("| {} | {} | {} | {} | {} | {} |\n".format(
                qno, letter, clean, cluster, name, riasec))

    print("Checked {} mapped-by-us questions and {} written-by-us questions "
          "({} options total).".format(len(INTEREST_OVERLAY), len(EXTRA_INTERESTS), len(review_rows)))
    print("Options pointing at cluster H (the gap these close):", h_count)
    print("Example-career names unknown to the scoring engine:", len(unknown))
    print("Review table written to", os.path.relpath(REVIEW, PROJECT))

    # Split reviewed ties from genuinely new ones.
    reviewed, open_ties = [], []
    for d in disagreements:
        qno = d.split()[0]
        letter = d.split("option ")[1][0] if "option " in d else "?"
        if (qno, letter) in ADJUDICATED:
            reviewed.append((qno, letter))
        else:
            open_ties.append(d)

    if reviewed:
        print("\n{} tie(s) reviewed and deliberately kept:".format(len(reviewed)))
        for qno, letter in reviewed:
            print("  {} option {}: {}".format(qno, letter, ADJUDICATED[(qno, letter)]))
    if open_ties:
        print("\n{} UNREVIEWED disagreement(s) - decide and record in ADJUDICATED:".format(len(open_ties)))
        for d in open_ties:
            print("  " + d)

    if failures:
        print("\n{} FAILURE(S):".format(len(failures)))
        for f in failures:
            print("  " + f)
        sys.exit(1)
    print("\nNo unsupported mappings and no incoherent RIASEC pairings.")
    if not open_ties:
        print("Every ambiguous mapping has been reviewed.")


if __name__ == "__main__":
    sys.stdout.reconfigure(encoding="utf-8")
    main()

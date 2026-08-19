#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Builds the class 11-12 demo career catalogue.

Takes the three career files plus the family roadmaps, resolves each career's
full roadmap (family base overlaid with the career's own fields), links careers
to the stream data, and writes one file the app can read directly.

The important output is `byCombination`: for each of the 32 stream combinations
in the client workbook, the careers a student in that combination may pick,
each carrying a verdict that is the BEST verdict across the degrees leading to
that career. A career is "green" if any single degree route to it is open.

Validation is deliberately strict - a career pointing at a degree that does not
exist in the workbook, or at a cluster letter the scoring engine does not know,
is a silent wrong answer in the report later. Both fail the build.

Writes:  data/demo-11-12/careers.json

Run:     python scripts/build_demo_careers.py
         (run build_demo_streams.py first)
"""

import json
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
PROJECT = os.path.join(HERE, "..")
DATA = os.path.join(PROJECT, "data", "demo-11-12")

sys.path.insert(0, HERE)
from demo_11_12_families import FAMILIES, FIGURES           # noqa: E402
from demo_11_12_careers_stem import CAREERS_STEM             # noqa: E402
from demo_11_12_careers_commerce import CAREERS_COMMERCE     # noqa: E402
from demo_11_12_careers_creative import CAREERS_CREATIVE     # noqa: E402
from demo_11_12_careers_extra import CAREERS_EXTRA           # noqa: E402

CAREERS = CAREERS_STEM + CAREERS_COMMERCE + CAREERS_CREATIVE + CAREERS_EXTRA

# Fields a career may override on its family. Anything not listed here is
# family-only; anything a career omits falls back to the family value.
ROADMAP_FIELDS = [
    "entranceExams", "afterSchool", "topColleges",
    "coreSkills", "buildNow", "salary", "realityCheck",
]

VERDICT_RANK = {"green": 3, "yellow": 2, "red": 1}


def build_roadmap(career):
    fam = FAMILIES[career["family"]]
    roadmap = {}
    for field in ROADMAP_FIELDS:
        roadmap[field] = career.get(field, fam.get(field))
    # Career-only fields; no family default exists for these.
    roadmap["whatYouDo"] = career.get("whatYouDo", [])
    roadmap["dayInLife"] = career.get("dayInLife", "")
    roadmap["alternates"] = career.get("alternates", [])
    # Recorded so the report can say which parts are specific to this career
    # and which are shared with everything in its family.
    roadmap["bespokeFields"] = sorted(f for f in ROADMAP_FIELDS if f in career)
    return roadmap


def main():
    streams_path = os.path.join(DATA, "streams.json")
    if not os.path.exists(streams_path):
        sys.exit("run scripts/build_demo_streams.py first - streams.json missing")
    streams = json.load(open(streams_path, encoding="utf-8"))

    clusters = json.load(open(os.path.join(PROJECT, "data", "career-clusters.json"), encoding="utf-8"))
    known_degrees = {d["degree"] for d in streams["degrees"]}

    errors = []
    ids = set()
    for c in CAREERS:
        if c["id"] in ids:
            errors.append("duplicate career id: " + c["id"])
        ids.add(c["id"])
        if c["cluster"] not in clusters:
            errors.append("{}: unknown cluster letter {!r}".format(c["id"], c["cluster"]))
        if c["family"] not in FAMILIES:
            errors.append("{}: unknown family {!r}".format(c["id"], c["family"]))
        for deg in c["degrees"]:
            if deg not in known_degrees:
                errors.append("{}: degree {!r} is not in the streams workbook".format(c["id"], deg))
    # Cross-references between careers must resolve, or "you might also consider"
    # renders a dead link.
    for c in CAREERS:
        for alt in c.get("alternates", []):
            if alt not in ids:
                errors.append("{}: alternate {!r} is not a known career id".format(c["id"], alt))
    if errors:
        print("BUILD FAILED - {} problem(s):".format(len(errors)))
        for e in errors[:40]:
            print("  " + e)
        sys.exit(1)

    catalogue = []
    for c in CAREERS:
        catalogue.append({
            "id": c["id"],
            "title": c["title"],
            "cluster": c["cluster"],
            "clusterName": clusters[c["cluster"]]["cluster"],
            "family": c["family"],
            "familyLabel": FAMILIES[c["family"]]["label"],
            "degrees": c["degrees"],
            "blurb": c["blurb"],
            "roadmap": build_roadmap(c),
        })
    by_id = {c["id"]: c for c in catalogue}

    # `byCombination` used to be precomputed here - 32 combinations x 121
    # careers, each row repeating the title, cluster and domain already present
    # in `careers`. 947KB of a 1.26MB file, all derivable, and enough to push
    # the Next build out of memory. Resolved at request time instead, by
    # lib/demo11/catalogue.ts.

    out = {
        "careers": catalogue,
        "families": {k: {"label": v["label"]} for k, v in FAMILIES.items()},
        # Carried through to the report so the salary and college blocks can
        # say where their numbers come from instead of implying they are
        # measured. See the caveat rendered under each in DemoReport.tsx.
        "figures": FIGURES,
    }
    path = os.path.join(DATA, "careers.json")
    with open(path, "w", encoding="utf-8") as fh:
        json.dump(out, fh, ensure_ascii=False, indent=1)

    print("Careers: {} across {} families".format(len(catalogue), len(FAMILIES)))
    bespoke = sum(1 for c in catalogue if c["roadmap"]["bespokeFields"])
    print("  {} carry career-specific roadmap overrides; {} inherit their family's entirely".format(
        bespoke, len(catalogue) - bespoke))
    print()
    print("Cluster spread (how many careers sit in each A-H cluster):")
    for letter in "ABCDEFGH":
        n = sum(1 for c in catalogue if c["cluster"] == letter)
        print("  {}  {:3d}  {}".format(letter, n, clusters[letter]["cluster"]))
    print()
    print("Per-combination career eligibility is resolved at request time;")
    print("run scripts/verify_demo_eligibility.py to check it.")
    print()
    print("Wrote", os.path.relpath(path, PROJECT))


if __name__ == "__main__":
    sys.stdout.reconfigure(encoding="utf-8")
    main()

#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Stream combinations missing from the client workbook.

The workbook's "Class 12 Streams" tab uses Andhra Pradesh / Telangana naming
for the science streams - MPC, BiPC, MBiPC - but then switches to CBSE-style
descriptions for commerce and humanities ("Commerce without Mathematics").

The three most common AP/TS intermediate combinations are therefore missing
entirely, and they are not rare: between them CEC, HEC and MEC cover most
non-science intermediate students in those states.

    CEC   Commerce, Economics, Civics          commerce, no mathematics
    HEC   History, Economics, Civics           humanities, no mathematics
    MEC   Mathematics, Economics, Commerce     commerce, with mathematics

A student in any of them had to pick a CBSE label that only approximated what
they actually study, and MEC students in particular would have been pushed
towards "Commerce without Mathematics" and quietly lost every maths-gated
degree - actuarial science, statistics, economics honours.

Each entry maps to an existing eligibility GROUP, so no new columns are needed
in the degree matrices: CEC and HEC behave exactly as the equivalent CBSE
combination already does, and MEC as commerce-with-maths.

Kept out of build_demo_streams.py so the transcription stays a faithful copy of
the sheet. If the client adds these to their workbook, delete this file.
"""

# (combination, family, eligibility group, note shown nowhere but useful here)
EXTRA_COMBINATIONS = [
    ("CEC (Commerce, Economics, Civics)", "Commerce", "Commerce no Math",
     "AP/TS intermediate. No mathematics, so maths-gated degrees stay closed."),
    ("MEC (Mathematics, Economics, Commerce)", "Commerce", "Commerce+Math",
     "AP/TS intermediate. Carries mathematics, so it opens statistics, "
     "actuarial science and economics honours that CEC does not."),
    ("HEC (History, Economics, Civics)", "Humanities / Arts", "Humanities no Math",
     "AP/TS intermediate. The humanities equivalent of CEC."),
]


def as_combinations():
    """In the shape build_demo_streams.py writes into streams.json."""
    return [
        {"combination": name, "family": family, "group": group, "authored": True}
        for name, family, group, _note in EXTRA_COMBINATIONS
    ]


def family_additions():
    """combination names to append to each family's list on the streams tab."""
    out = {}
    for name, family, _group, _note in EXTRA_COMBINATIONS:
        out.setdefault(family, []).append(name)
    return out

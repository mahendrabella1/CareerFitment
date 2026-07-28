#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Rebuilds the class 9-10 question bank from "60 set questions.xlsx".

Source of truth: the 8 dimension tabs + the "Logic you can use for reference"
tab of that workbook. Question wording, options and dimension/career mappings
are transcribed verbatim; the per-option SCORING VECTORS (which the workbook
only sketches) are authored here and documented inline.

Numbering follows the workbook's own Q.No column:
    Interests 1-12 · Aptitude 13-22 · Personality 23-34 · Strengths 35-42
    Motivators 43-47 · Learning styles 48-51 · Multiple intelligence 52-55
    Emotional intelligence 56-60

Writes:
    data/assessment-questions.json   ("9-10" key of each self-report category)
    data/aptitude-questions.json     ("9-10")
    data/strengths-questions.json    ("9-10")
    data/career-map-9-10.json        (dimension -> profession affinity tables)

Run:  python scripts/build_bank_9_10.py
"""

import json
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
DATA = os.path.join(HERE, "..", "data")

# ===========================================================================
# SVG helpers for the three aptitude items the workbook marks
# "(Illustration required.)" / "(Use a visual figure in the final assessment.)"
# ===========================================================================

INK = "#1f2937"


def _sq_frame(inner: str) -> str:
    return (
        '<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" width="72" height="72">'
        f'<rect x="8" y="8" width="84" height="84" rx="6" fill="#fff" stroke="{INK}" stroke-width="3"/>'
        f"{inner}</svg>"
    )


# Corner markers for the "rotates 90 clockwise each step" item. A right-angled
# triangle sits in one corner and a dot in the next corner CLOCKWISE from it,
# so the whole configuration (not just a symmetric blob) turns with the frame.
_TRI = {
    "TL": "16,16 46,16 16,46",
    "TR": "84,16 54,16 84,46",
    "BR": "84,84 54,84 84,54",
    "BL": "16,84 46,84 16,54",
}
_DOT = {"TL": (27, 27), "TR": (73, 27), "BR": (73, 73), "BL": (27, 73)}
_CW = {"TL": "TR", "TR": "BR", "BR": "BL", "BL": "TL"}


def rot_figure(corner: str) -> str:
    cx, cy = _DOT[_CW[corner]]
    return _sq_frame(
        f'<polygon points="{_TRI[corner]}" fill="{INK}"/>'
        f'<circle cx="{cx}" cy="{cy}" r="8" fill="none" stroke="{INK}" stroke-width="3"/>'
    )


# --- cube net item --------------------------------------------------------
# Net (cross): top=circle, middle row = triangle | square | plus | cross,
# bottom = diamond.  Folding gives the opposite-face pairs
#   square <-> cross,  triangle <-> plus,  circle <-> diamond
# so any option showing two members of a pair on adjacent faces is impossible.

def _glyph(kind: str, cx: float, cy: float, s: float = 1.0) -> str:
    r = 11 * s
    if kind == "circle":
        return f'<circle cx="{cx}" cy="{cy}" r="{r}" fill="none" stroke="{INK}" stroke-width="{3*s}"/>'
    if kind == "square":
        return f'<rect x="{cx-r}" y="{cy-r}" width="{2*r}" height="{2*r}" fill="{INK}"/>'
    if kind == "triangle":
        return f'<polygon points="{cx},{cy-r} {cx+r},{cy+r} {cx-r},{cy+r}" fill="{INK}"/>'
    if kind == "diamond":
        return f'<polygon points="{cx},{cy-r} {cx+r},{cy} {cx},{cy+r} {cx-r},{cy}" fill="{INK}"/>'
    if kind == "plus":
        t = r * 0.42
        return (
            f'<rect x="{cx-t}" y="{cy-r}" width="{2*t}" height="{2*r}" fill="{INK}"/>'
            f'<rect x="{cx-r}" y="{cy-t}" width="{2*r}" height="{2*t}" fill="{INK}"/>'
        )
    if kind == "cross":
        return (
            f'<line x1="{cx-r}" y1="{cy-r}" x2="{cx+r}" y2="{cy+r}" stroke="{INK}" stroke-width="{3.4*s}" stroke-linecap="round"/>'
            f'<line x1="{cx+r}" y1="{cy-r}" x2="{cx-r}" y2="{cy+r}" stroke="{INK}" stroke-width="{3.4*s}" stroke-linecap="round"/>'
        )
    raise ValueError(kind)


def cube_net_svg() -> str:
    cell = 52
    x0, y0 = 10, 10
    faces = [
        ("circle", 1, 0),
        ("triangle", 0, 1),
        ("square", 1, 1),
        ("plus", 2, 1),
        ("cross", 3, 1),
        ("diamond", 1, 2),
    ]
    parts = []
    for kind, col, row in faces:
        x, y = x0 + col * cell, y0 + row * cell
        parts.append(
            f'<rect x="{x}" y="{y}" width="{cell}" height="{cell}" fill="#fff" stroke="{INK}" stroke-width="2.5"/>'
        )
        parts.append(_glyph(kind, x + cell / 2, y + cell / 2, 0.92))
    return (
        '<svg viewBox="0 0 240 180" xmlns="http://www.w3.org/2000/svg" width="240" height="180">'
        + "".join(parts)
        + "</svg>"
    )


def cube_svg(top: str, left: str, right: str) -> str:
    """Isometric cube showing three mutually-adjacent faces."""
    return (
        '<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" width="76" height="76">'
        f'<polygon points="50,10 88,32 50,54 12,32" fill="#fff" stroke="{INK}" stroke-width="2.5"/>'
        f'<polygon points="12,32 50,54 50,92 12,70" fill="#fbfbfc" stroke="{INK}" stroke-width="2.5"/>'
        f'<polygon points="88,32 50,54 50,92 88,70" fill="#f2f3f5" stroke="{INK}" stroke-width="2.5"/>'
        + _glyph(top, 50, 32, 0.62)
        + _glyph(left, 31, 63, 0.62)
        + _glyph(right, 69, 63, 0.62)
        + "</svg>"
    )


def gears_svg() -> str:
    """Two MESHING gears; A is driven clockwise, B is the unknown.

    The tooth circles must actually overlap — the whole item depends on the
    student seeing that the gears are engaged.
    """
    import math

    R, TOOTH, TEETH = 44, 10, 12
    CY, AX, BX = 112, 78, 78 + 2 * R + TOOTH  # centres 98 apart < 2*(R+TOOTH)=108

    def gear(cx, cy, offset, label):
        out = [f'<circle cx="{cx}" cy="{cy}" r="{R}" fill="#fff" stroke="{INK}" stroke-width="3"/>']
        for i in range(TEETH):
            a = 2 * math.pi * (i + offset) / TEETH
            x1, y1 = cx + (R - 2) * math.cos(a), cy + (R - 2) * math.sin(a)
            x2, y2 = cx + (R + TOOTH) * math.cos(a), cy + (R + TOOTH) * math.sin(a)
            out.append(
                f'<line x1="{x1:.1f}" y1="{y1:.1f}" x2="{x2:.1f}" y2="{y2:.1f}" '
                f'stroke="{INK}" stroke-width="8" stroke-linecap="round"/>'
            )
        out.append(f'<circle cx="{cx}" cy="{cy}" r="12" fill="#fff" stroke="{INK}" stroke-width="3"/>')
        out.append(
            f'<text x="{cx}" y="{cy + R + TOOTH + 30}" text-anchor="middle" '
            f'font-family="Inter, sans-serif" font-size="19" font-weight="700" fill="{INK}">{label}</text>'
        )
        return "".join(out)

    ar = R + TOOTH + 14  # rotation arc sits clear of the teeth
    return (
        f'<svg viewBox="0 0 {BX + ar + 16} 200" xmlns="http://www.w3.org/2000/svg" width="330" height="200">'
        # gear B's teeth are offset half a pitch so they interleave with A's
        + gear(AX, CY, 0, "Gear A")
        + gear(BX, CY, 0.5, "Gear B")
        # clockwise indicator on A: arc from 9 o'clock round to 12 o'clock, so
        # the arrowhead finishes at the top and never sits over the mesh point
        + f'<path d="M{AX - ar} {CY} A{ar} {ar} 0 0 1 {AX} {CY - ar}" fill="none" stroke="#2563eb" stroke-width="4"/>'
        + f'<polygon points="{AX + 10},{CY - ar} {AX - 6},{CY - ar - 9} {AX - 6},{CY - ar + 9}" fill="#2563eb"/>'
        + f'<text x="{AX}" y="{CY - ar - 22}" text-anchor="middle" font-family="Inter, sans-serif" '
        + 'font-size="16" font-weight="700" fill="#2563eb">clockwise</text>'
        + f'<text x="{BX}" y="{CY - ar - 8}" text-anchor="middle" font-family="Inter, sans-serif" '
        + 'font-size="26" font-weight="800" fill="#94a3b8">?</text>'
        + "</svg>"
    )


# ===========================================================================
# 1. CAREER INTERESTS  (Q1-Q12)
# ===========================================================================
# Workbook tab: "interests". Wording + "Primary Career Matches" verbatim.
# `riasec` per option is authored from Holland theory (see logic tab: "Every
# option contributes to one or more RIASEC dimensions").
# NOTE: the workbook ships 11 interest items but its own logic tab says
# "After all 12 questions" and the Q.No sequence leaves slot 12 empty, so Q12
# below is AUTHORED to the same template. Swap it when the real one arrives.

INTERESTS = [
    {
        "q": 1,
        "text": "Your school is hosting an Innovation Fair. Which role would you enjoy the most?",
        "options": [
            "Build a working prototype and test how it performs.",
            "Design an attractive and user-friendly model or presentation.",
            "Lead the team, explain the idea to judges, and coordinate everyone.",
            "Plan the budget, schedule, and ensure everything is organized.",
        ],
        "riasec": [{"R": 3, "I": 2}, {"A": 3, "R": 1}, {"E": 3, "S": 2}, {"C": 3, "E": 1}],
        "careers": [
            ["Robotics Engineer", "Mechanical Engineer", "AI Engineer", "Electronics Engineer", "Product Engineer"],
            ["Architect", "UX Designer", "Graphic Designer", "Product Designer", "Animator"],
            ["Entrepreneur", "Project Manager", "Teacher", "Lawyer", "HR Manager"],
            ["Business Manager", "Chartered Accountant", "Financial Analyst", "Operations Manager", "Auditor"],
        ],
    },
    {
        "q": 2,
        "text": "Your community faces a serious water shortage. What would you do first?",
        "options": [
            "Collect data, identify the root cause, and test possible solutions.",
            "Design an awareness campaign using creative posters and videos.",
            "Meet local residents and organize volunteers to solve the issue together.",
            "Prepare a budget and action plan to implement the solution efficiently.",
        ],
        "riasec": [{"I": 3, "R": 1}, {"A": 3, "E": 1}, {"S": 3, "E": 2}, {"C": 3, "E": 2}],
        "careers": [
            ["Scientist", "Environmental Engineer", "Doctor", "Data Scientist", "Civil Engineer"],
            ["Graphic Designer", "Digital Marketer", "Content Creator", "Media Professional", "UX Designer"],
            ["IAS Officer", "Social Worker", "Psychologist", "NGO Manager", "Teacher"],
            ["Business Analyst", "Operations Manager", "Financial Planner", "Project Manager", "Banker"],
        ],
    },
    {
        "q": 3,
        "text": "Your teacher asks you to create something that helps students learn better.",
        "options": [
            "Develop a smart study app or simple learning device.",
            "Design engaging illustrations, animations, or interactive visuals.",
            "Create a mentoring or peer-learning program for classmates.",
            "Organize the project timeline, budget, and responsibilities.",
        ],
        "riasec": [{"I": 3, "R": 2}, {"A": 3}, {"S": 3, "E": 1}, {"C": 3, "E": 1}],
        "careers": [
            ["Software Engineer", "AI Engineer", "Electronics Engineer", "Robotics Engineer", "Research Engineer"],
            ["Animator", "Graphic Designer", "Architect", "Product Designer", "UI Designer"],
            ["Teacher", "Counsellor", "Psychologist", "HR Professional", "Social Worker"],
            ["Project Manager", "Chartered Accountant", "Business Manager", "Operations Executive", "Consultant"],
        ],
    },
    {
        "q": 4,
        "text": "During a science exhibition, which project would excite you the most?",
        "options": [
            "Build an AI model that predicts weather or crop diseases.",
            "Design an interactive exhibit that makes science easy to understand.",
            "Explain your project to visitors and answer their questions confidently.",
            "Plan the exhibition schedule, budget, and logistics.",
        ],
        "riasec": [{"I": 3, "R": 2}, {"A": 3, "I": 1}, {"S": 3, "E": 2}, {"C": 3, "E": 2}],
        "careers": [
            ["AI Engineer", "Data Scientist", "Research Scientist", "Software Engineer", "Environmental Scientist"],
            ["Product Designer", "UX Designer", "Graphic Designer", "Science Communicator", "Animator"],
            ["Teacher", "Lawyer", "Psychologist", "Science Communicator", "Public Speaker"],
            ["Project Manager", "Operations Manager", "Business Manager", "Event Manager", "Financial Planner"],
        ],
    },
    {
        "q": 5,
        "text": "Your class must organize an event with a limited budget. Which responsibility would you prefer?",
        "options": [
            "Calculate expenses and find the most cost-effective solutions.",
            "Design invitations, posters, and stage decorations.",
            "Lead the team and coordinate with teachers and students.",
            "Prepare the schedule, assign tasks, and ensure everything runs on time.",
        ],
        "riasec": [{"C": 3, "I": 2}, {"A": 3}, {"E": 3, "S": 2}, {"C": 3, "E": 1}],
        "careers": [
            ["Chartered Accountant", "Financial Analyst", "Data Analyst", "Economist", "Business Analyst"],
            ["Graphic Designer", "Event Designer", "Architect", "Interior Designer", "Animator"],
            ["Entrepreneur", "HR Manager", "Project Manager", "Lawyer", "Teacher"],
            ["Operations Manager", "Event Manager", "Banker", "Auditor", "Supply Chain Manager"],
        ],
    },
    {
        "q": 6,
        "text": "You have one week of vacation to learn something new. What would you spend most of your time doing?",
        "options": [
            "Learn coding, robotics, or conduct science experiments.",
            "Learn drawing, animation, music production, or video editing.",
            "Volunteer, mentor younger students, or join public speaking workshops.",
            "Learn investing, business planning, or entrepreneurship.",
        ],
        "riasec": [{"I": 3, "R": 2}, {"A": 3}, {"S": 3, "E": 1}, {"E": 3, "C": 2}],
        "careers": [
            ["Software Engineer", "Robotics Engineer", "Scientist", "AI Engineer", "Electronics Engineer"],
            ["Animator", "Graphic Designer", "Architect", "Film Maker", "Fashion Designer"],
            ["Teacher", "Psychologist", "IAS Officer", "Social Worker", "HR Manager"],
            ["Entrepreneur", "Chartered Accountant", "Business Manager", "Banker", "Financial Planner"],
        ],
    },
    {
        "q": 7,
        "text": "Your school is launching a robotics club. Which activity interests you the most?",
        "options": [
            "Build and test the robot's hardware and programming.",
            "Design how the robot looks and interacts with users.",
            "Demonstrate the robot to visitors and explain how it works.",
            "Plan the team's timeline, resources, and competition strategy.",
        ],
        "riasec": [{"R": 3, "I": 3}, {"A": 3, "R": 1}, {"S": 3, "E": 2}, {"C": 3, "E": 2}],
        "careers": [
            ["Robotics Engineer", "Mechanical Engineer", "Electronics Engineer", "Automation Engineer", "AI Engineer"],
            ["Product Designer", "Industrial Designer", "UX Designer", "Graphic Designer", "Animator"],
            ["Teacher", "Sales Engineer", "Technical Trainer", "Consultant", "Lawyer"],
            ["Project Manager", "Operations Manager", "Entrepreneur", "Business Analyst", "Event Manager"],
        ],
    },
    {
        "q": 8,
        "text": "Your teacher gives your team a difficult challenge. What role would you naturally take?",
        "options": [
            "Analyze the problem and suggest the best technical solution.",
            "Think of creative ideas that make the solution unique.",
            "Motivate everyone and ensure all voices are heard.",
            "Divide the work, track progress, and ensure deadlines are met.",
        ],
        "riasec": [{"I": 3, "R": 1}, {"A": 3}, {"S": 3, "E": 2}, {"C": 3, "E": 2}],
        "careers": [
            ["Engineer", "Scientist", "Data Scientist", "Researcher", "Software Developer"],
            ["Designer", "Architect", "Animator", "Product Designer", "Creative Director"],
            ["HR Manager", "Teacher", "Psychologist", "Entrepreneur", "Team Leader"],
            ["Project Manager", "Operations Manager", "Chartered Accountant", "Business Manager", "Consultant"],
        ],
    },
    {
        "q": 9,
        "text": "You receive ₹5,000 to create a useful student project. How would you use it?",
        "options": [
            "Build a prototype or develop a technology-based solution.",
            "Create a creative product, app design, or awareness campaign.",
            "Organize workshops or mentoring sessions for students.",
            "Develop a business plan and track the project's finances.",
        ],
        "riasec": [{"R": 3, "I": 2}, {"A": 3, "E": 1}, {"S": 3, "E": 2}, {"E": 3, "C": 3}],
        "careers": [
            ["Engineer", "AI Engineer", "Scientist", "Robotics Engineer", "Software Developer"],
            ["UX Designer", "Graphic Designer", "Product Designer", "Architect", "Animator"],
            ["Teacher", "Psychologist", "Entrepreneur", "HR Manager", "Counsellor"],
            ["Startup Founder", "Chartered Accountant", "Financial Analyst", "Business Manager", "Consultant"],
        ],
    },
    {
        "q": 10,
        "text": "Which YouTube channel would you watch for two hours without getting bored?",
        "options": [
            "Science experiments, coding, engineering, or space exploration.",
            "Art, animation, filmmaking, architecture, or design tutorials.",
            "Psychology, public speaking, education, leadership, or social issues.",
            "Business, finance, startups, investing, and productivity.",
        ],
        "riasec": [{"I": 3, "R": 2}, {"A": 3}, {"S": 3, "E": 1}, {"E": 3, "C": 2}],
        "careers": [
            ["Scientist", "Software Engineer", "AI Engineer", "Mechanical Engineer", "Researcher"],
            ["Architect", "Graphic Designer", "Animator", "Fashion Designer", "Product Designer"],
            ["Teacher", "Psychologist", "Lawyer", "IAS Officer", "HR Manager"],
            ["Entrepreneur", "Banker", "Chartered Accountant", "Financial Analyst", "Business Consultant"],
        ],
    },
    {
        "q": 11,
        "text": "Imagine your ideal future workplace. What would you like to spend most of your day doing?",
        "options": [
            "Solving complex technical problems and inventing new solutions.",
            "Designing products, creating experiences, or expressing ideas creatively.",
            "Helping people, leading teams, teaching, or influencing decisions.",
            "Managing projects, finances, operations, and business growth.",
        ],
        "riasec": [{"I": 3, "R": 2}, {"A": 3}, {"S": 3, "E": 3}, {"C": 3, "E": 3}],
        "careers": [
            ["Scientist", "AI Engineer", "Software Engineer", "Research Engineer", "Doctor"],
            ["Architect", "UX Designer", "Graphic Designer", "Animator", "Product Designer"],
            ["Teacher", "Psychologist", "Lawyer", "IAS Officer", "Entrepreneur"],
            ["Business Manager", "Chartered Accountant", "Operations Manager", "Financial Planner", "Startup Founder"],
        ],
    },
    {
        # AUTHORED (workbook slot 12 was empty) - same template as Q1-Q11.
        "q": 12,
        "authored": True,
        "text": "Your school is starting a student-run magazine and website. Which role would you take?",
        "options": [
            "Research the stories, check the facts, and build the website.",
            "Design the layout, illustrations, photographs, and cover art.",
            "Interview people, build the writing team, and reply to readers.",
            "Handle advertising, budgets, and the publishing schedule.",
        ],
        "riasec": [{"I": 3, "R": 2}, {"A": 3}, {"S": 3, "E": 2}, {"C": 3, "E": 2}],
        "careers": [
            ["Software Engineer", "Data Analyst", "Researcher", "Research Engineer", "Science Communicator"],
            ["Graphic Designer", "Animator", "Product Designer", "Architect", "Content Creator"],
            ["Teacher", "Lawyer", "Psychologist", "HR Manager", "Public Speaker"],
            ["Business Manager", "Financial Analyst", "Digital Marketer", "Operations Manager", "Chartered Accountant"],
        ],
    },
]

# ===========================================================================
# 2. APTITUDE  (Q13-Q22)  - workbook tab "Aptitude"
# ===========================================================================
# Difficulty weights come from the logic tab: Easy 1, Medium 2, Hard 3.
#
# DATA FIX (Q21): the workbook lists 987654 / 987645 / 987564 / 987654 and
# marks 987564 correct - but 987654 appears twice and 987645 is unique too, so
# as printed the item has no single answer. The classic attention-to-detail
# form (three identical, one different) is restored, keeping the workbook's
# question text and its marked answer.

APTITUDE = [
    {
        "q": 13, "domain": "Numerical", "difficulty": "easy",
        "text": "Which number comes next in the series? 6, 12, 24, 48, ?",
        "options": ["72", "84", "96", "100"], "correct": 2,
    },
    {
        "q": 14, "domain": "Numerical", "difficulty": "easy",
        "text": "A school bag costs ₹800. During a sale, you get 25% off. How much will you pay?",
        "options": ["₹500", "₹600", "₹650", "₹700"], "correct": 1,
    },
    {
        # REPLACES the workbook's "Book is to Reading as Fork is to ___".
        # The analogy format is dropped entirely for a number-pattern grid.
        #
        # The rule is two-dimensional, which is what makes it analytical: rows
        # are multiples of the first row (x1, x2, x3) AND each column steps by
        # its own first entry (+3, +5, +8). Both readings converge on 24, so
        # the item is unambiguous while still needing a real pattern to be
        # found — a single left-to-right sequence cannot solve it.
        #
        # Distractors are specific reasoning errors, not filler:
        #   20  16 + 4     (invented step)
        #   21  15 + 6     (borrowed column 1's step)
        #   32  16 x 2     (read 8 -> 16 as doubling, ignoring the row rule)
        "q": 15, "domain": "Numerical", "difficulty": "medium",
        "text": "Study how the numbers in the grid relate to each other. Which number replaces the question mark?",
        "media": {
            "type": "html",
            "html": (
                # width:auto overrides .datatable's width:100% — a 3x3 grid
                # stretched across the card does not read as a matrix
                '<table class="datatable" style="width:auto;min-width:210px;font-size:16px">'
                "<tbody>"
                "<tr><td>3</td><td>5</td><td>8</td></tr>"
                "<tr><td>6</td><td>10</td><td>16</td></tr>"
                "<tr><td>9</td><td>15</td><td><b>?</b></td></tr>"
                "</tbody></table>"
            ),
        },
        "options": ["20", "21", "24", "32"], "correct": 2,
    },
    {
        "q": 16, "domain": "Verbal", "difficulty": "easy",
        "text": "Which word is closest in meaning to Reliable?",
        "options": ["Lazy", "Careless", "Dependable", "Curious"], "correct": 2,
    },
    {
        "q": 17, "domain": "Logical", "difficulty": "medium",
        "text": "Find the next number: 2, 5, 11, 23, ?",
        "options": ["35", "47", "49", "51"], "correct": 1,
    },
    {
        "q": 18, "domain": "Logical", "difficulty": "easy",
        "text": "Rahul is taller than Mohan. Mohan is taller than Arjun. Who is the tallest?",
        "options": ["Mohan", "Arjun", "Cannot be determined", "Rahul"], "correct": 3,
    },
    {
        "q": 19, "domain": "Abstract", "difficulty": "medium",
        "text": "The pattern rotates 90° clockwise at each step. Which figure should come next?",
        "media": {"type": "sequence", "items": [rot_figure("TL"), rot_figure("TR"), rot_figure("BR")]},
        "svgOptions": True,
        "options": [rot_figure("TL"), rot_figure("TR"), rot_figure("BL"), rot_figure("BR")],
        "correct": 2,
    },
    {
        "q": 20, "domain": "Spatial", "difficulty": "hard",
        "text": "Which cube can be formed by folding the net shown above?",
        "media": {"type": "figure", "svg": cube_net_svg()},
        "svgOptions": True,
        "options": [
            cube_svg("circle", "square", "cross"),    # square/cross are opposite faces
            cube_svg("circle", "triangle", "plus"),   # triangle/plus are opposite faces
            cube_svg("diamond", "circle", "plus"),    # circle/diamond are opposite faces
            cube_svg("circle", "square", "plus"),     # valid fold
        ],
        "correct": 3,
    },
    {
        "q": 21, "domain": "Attention to Detail", "difficulty": "medium",
        "text": "Which of the following numbers is different?",
        "options": ["987654", "987654", "987564", "987654"], "correct": 2,
    },
    {
        "q": 22, "domain": "Mechanical", "difficulty": "medium",
        "text": "Two gears are connected. Gear A rotates clockwise. In which direction will Gear B rotate?",
        "media": {"type": "figure", "svg": gears_svg()},
        "options": ["Clockwise", "Counter-clockwise", "It will not rotate", "Depends on size"],
        "correct": 1,
    },
]

# ===========================================================================
# 3. PERSONALITY  (Q23-Q34)  - workbook tab "personality"
# ===========================================================================
# Trait keys: O=Openness  C=Conscientiousness  E=Extraversion
#             A=Agreeableness  S=Emotional Stability
# Logic tab: "Every option maps to Big Five" - so each option carries a full
# point vector, not a single-trait score.

PERSONALITY = [
    {
        "q": 23, "trait": "Openness", "facet": "Curiosity",
        "text": "Your teacher announces a project on a completely new topic you've never learned before. What would you most likely do?",
        "options": [
            "Start exploring books, videos, and online resources to understand the topic deeply.",
            "Think of a unique and creative way to present the project.",
            "Discuss ideas with classmates before deciding your approach.",
            "Read the teacher's instructions carefully and complete exactly what is expected.",
        ],
        "points": [{"O": 3, "C": 1}, {"O": 2, "E": 1}, {"E": 2, "A": 2, "O": 1}, {"C": 3}],
    },
    {
        "q": 24, "trait": "Openness", "facet": "Creativity",
        "text": "Your school is conducting an exhibition where students can present anything they like. What would you choose?",
        "options": [
            "A science experiment that solves a real-life problem.",
            "A creative art, animation, or design project.",
            "A presentation that teaches visitors something useful.",
            "A well-organized project with clear planning and documentation.",
        ],
        "points": [{"O": 2, "C": 1}, {"O": 3}, {"E": 2, "A": 2}, {"C": 3}],
    },
    {
        "q": 25, "trait": "Conscientiousness", "facet": "Planning",
        "text": "You have two weeks to complete an important assignment. How do you usually approach it?",
        "options": [
            "Break it into smaller tasks and finish a little each day.",
            "Gather different ideas before deciding how to begin.",
            "Work best when the deadline is close.",
            "Discuss the plan with friends and work together.",
        ],
        "points": [{"C": 3}, {"O": 3, "C": 1}, {"S": 1}, {"E": 2, "A": 2}],
    },
    {
        "q": 26, "trait": "Conscientiousness", "facet": "Persistence",
        "text": "While preparing for exams, you realize one subject is much harder than the others. What do you usually do?",
        "options": [
            "Create a study schedule and practice regularly.",
            "Look for different learning methods or videos to understand it better.",
            "Ask teachers or classmates to explain difficult concepts.",
            "Focus more on subjects you already enjoy.",
        ],
        "points": [{"C": 3}, {"O": 3, "C": 1}, {"E": 2, "A": 2}, {"O": 1}],
    },
    {
        "q": 27, "trait": "Conscientiousness", "facet": "Responsibility",
        "text": "Your class is organizing a major event, and your teacher assigns you an important responsibility. How do you usually handle it?",
        "options": [
            "Prepare a detailed checklist and complete every task on time.",
            "Suggest creative ideas that make the event memorable.",
            "Coordinate with everyone and keep the team motivated.",
            "Solve unexpected problems as they arise during the event.",
        ],
        "points": [{"C": 3}, {"O": 3}, {"E": 3, "A": 2}, {"S": 3, "C": 1}],
    },
    {
        "q": 28, "trait": "Extraversion", "facet": "Confidence",
        "text": "During a school assembly, volunteers are invited to speak in front of everyone. What are you most likely to do?",
        "options": [
            "Volunteer confidently and enjoy addressing the audience.",
            "Speak only if the topic is something you know well.",
            "Support the speaker from behind the scenes.",
            "Prefer to avoid speaking unless necessary.",
        ],
        "points": [{"E": 3, "S": 2}, {"E": 1, "C": 2}, {"A": 2, "C": 1}, {}],
    },
    {
        "q": 29, "trait": "Extraversion", "facet": "Social Interaction",
        "text": "You join a new class where you don't know anyone. What do you usually do during the first few days?",
        "options": [
            "Start conversations and make new friends quickly.",
            "Observe people first before joining groups.",
            "Connect with classmates through shared interests or activities.",
            "Focus on your work and let friendships develop naturally.",
        ],
        "points": [{"E": 3, "A": 2}, {"O": 1, "C": 1}, {"E": 2, "A": 2}, {"C": 2}],
    },
    {
        "q": 30, "trait": "Agreeableness", "facet": "Empathy",
        "text": "During a group activity, one of your teammates is struggling to complete their work. What would you most likely do?",
        "options": [
            "Help them understand the task while encouraging them to do it themselves.",
            "Complete part of the work to ensure the team succeeds.",
            "Suggest dividing the work differently so everyone contributes.",
            "Focus on finishing your own responsibilities first.",
        ],
        "points": [{"A": 3, "S": 1}, {"A": 2, "C": 2}, {"A": 2, "E": 2}, {"C": 2}],
    },
    {
        "q": 31, "trait": "Agreeableness", "facet": "Cooperation",
        "text": "Two of your close friends disagree during a team project. What would you naturally do?",
        "options": [
            "Listen to both sides and help them reach a solution.",
            "Suggest a practical compromise that benefits the project.",
            "Stay neutral and continue your assigned work.",
            "Encourage the team to vote and move forward.",
        ],
        "points": [{"A": 3, "S": 2}, {"A": 2, "C": 2}, {"C": 2, "S": 1}, {"E": 2, "C": 1}],
    },
    {
        "q": 32, "trait": "Emotional Stability", "facet": "Emotional Control",
        "text": "You receive a lower score than expected in an important exam despite preparing well. What would you most likely do next?",
        "options": [
            "Review your mistakes and make a better plan for the next exam.",
            "Talk to your teacher to understand where you can improve.",
            "Take some time to relax before starting again.",
            "Feel disappointed but keep trying with a positive attitude.",
        ],
        "points": [{"S": 3, "C": 2}, {"S": 2, "A": 1, "E": 1}, {"S": 2}, {"S": 1, "C": 1}],
    },
    {
        "q": 33, "trait": "Emotional Stability", "facet": "Composure",
        "text": "During a competition, something unexpected goes wrong at the last moment. What is your first reaction?",
        "options": [
            "Stay calm and quickly look for another solution.",
            "Discuss possible solutions with your teammates.",
            "Continue with whatever is still working and adapt if needed.",
            "Pause briefly, understand the situation, and then decide the next step.",
        ],
        "points": [{"S": 3, "O": 1}, {"A": 2, "E": 2, "S": 1}, {"S": 2, "C": 1}, {"S": 3, "C": 2}],
    },
    {
        "q": 34, "trait": "Integrated Big Five", "facet": "Overall Personality Profile",
        "text": "Imagine your future workplace. Which environment would make you happiest every day?",
        "options": [
            "A place where I solve challenging problems and keep learning new things.",
            "A place where I create new ideas, products, or experiences.",
            "A place where I work with people, guide others, and make a positive impact.",
            "A place where I organize work, improve systems, and achieve goals efficiently.",
        ],
        "points": [{"O": 3, "C": 2}, {"O": 3, "E": 1}, {"E": 3, "A": 3}, {"C": 3, "S": 1}],
    },
]

# ===========================================================================
# 4. STRENGTHS  (Q35-Q42)  - workbook tab "Strenghts"
# ===========================================================================
# Eight domains. Each option: primary +3, supporting +1 (logic tab pattern
# "Analyze data -> Analytical +3, Strategic +2"). Domains are assigned by
# reading each option, not by the order of the workbook's summary column.

STRENGTHS = [
    {
        "q": 35,
        "text": "Your school announces a month-long innovation challenge where teams must solve a real-life problem. Which role would you naturally choose?",
        "options": [
            "Study the problem carefully, collect information, and identify the best solution before starting.",
            "Generate creative ideas and design an innovative solution that stands out.",
            "Lead the team, motivate everyone, and coordinate responsibilities.",
            "Prepare a clear action plan, timeline, and ensure every task is completed on schedule.",
        ],
        "domains": [
            {"Analytical": 3, "Learning": 1},
            {"Creative": 3, "Analytical": 1},
            {"Leadership": 3, "Relationship": 1},
            {"Execution": 3, "Analytical": 1},
        ],
    },
    {
        "q": 36,
        "text": "Your teacher asks your class to organize an awareness campaign. Which responsibility would you enjoy the most?",
        "options": [
            "Deliver presentations and explain the campaign to different audiences.",
            "Work closely with classmates to ensure everyone feels involved.",
            "Design eye-catching posters, videos, or creative content.",
            "Organize schedules, permissions, and logistics for the campaign.",
        ],
        "domains": [
            {"Communication": 3, "Leadership": 1},
            {"Relationship": 3, "Communication": 1},
            {"Creative": 3},
            {"Execution": 3, "Leadership": 1},
        ],
    },
    {
        "q": 37,
        "text": "You have the opportunity to join a new club at school. Which one excites you the most?",
        "options": [
            "Science and Discovery Club.",
            "Robotics and Coding Club.",
            "Student Leadership Council.",
            "Art, Design, and Innovation Club.",
        ],
        "domains": [
            {"Learning": 3, "Analytical": 1},
            {"Analytical": 3, "Execution": 1},
            {"Leadership": 3, "Communication": 1},
            {"Creative": 3, "Adaptability": 1},
        ],
    },
    {
        "q": 38,
        "text": "Your class receives feedback that your project needs improvement. What would you naturally do first?",
        "options": [
            "Analyze the feedback to identify exactly what needs improvement.",
            "Learn new techniques or ideas that could improve the project.",
            "Discuss the feedback with teammates and gather everyone's suggestions.",
            "Quickly adjust the project and try a different approach.",
        ],
        "domains": [
            {"Analytical": 3, "Execution": 1},
            {"Learning": 3, "Creative": 1},
            {"Relationship": 3, "Communication": 1},
            {"Adaptability": 3, "Execution": 1},
        ],
    },
    {
        "q": 39,
        "text": "Your school is conducting an entrepreneurship competition. Which part interests you the most?",
        "options": [
            "Pitch the idea confidently to the judges.",
            "Develop a unique product or service idea.",
            "Organize the team's work and ensure deadlines are met.",
            "Motivate everyone and help the team perform at its best.",
        ],
        "domains": [
            {"Communication": 3, "Leadership": 1},
            {"Creative": 3, "Analytical": 1},
            {"Execution": 3, "Analytical": 1},
            {"Leadership": 3, "Relationship": 1},
        ],
    },
    {
        "q": 40,
        "text": "Your teacher gives your class an open-ended challenge with no fixed solution. What would you enjoy most?",
        "options": [
            "Analyze different possible solutions before choosing one.",
            "Think of an original idea that no one else has considered.",
            "Learn about similar challenges and improve your approach.",
            "Experiment with different methods until one works well.",
        ],
        "domains": [
            {"Analytical": 3, "Execution": 1},
            {"Creative": 3, "Learning": 1},
            {"Learning": 3, "Analytical": 1},
            {"Adaptability": 3, "Creative": 1},
        ],
    },
    {
        "q": 41,
        "text": "During a group activity, everyone has different opinions. What role do you naturally take?",
        "options": [
            "Help everyone understand each other's viewpoints.",
            "Clearly explain ideas and keep discussions focused.",
            "Make decisions and guide the team toward a solution.",
            "Ensure agreed tasks are completed efficiently.",
        ],
        "domains": [
            {"Relationship": 3, "Communication": 1},
            {"Communication": 3, "Analytical": 1},
            {"Leadership": 3, "Execution": 1},
            {"Execution": 3, "Relationship": 1},
        ],
    },
    {
        "q": 42,
        "integrated": True,
        "text": "Looking back at the projects you've enjoyed the most, what usually made them enjoyable?",
        "options": [
            "Solving challenging problems and discovering answers.",
            "Creating something original or improving an existing idea.",
            "Working with people, guiding them, and achieving goals together.",
            "Organizing work and making sure everything runs smoothly.",
        ],
        "domains": [
            {"Analytical": 3, "Learning": 2},
            {"Creative": 3, "Adaptability": 1},
            {"Leadership": 3, "Relationship": 2},
            {"Execution": 3, "Analytical": 1},
        ],
    },
]

# ===========================================================================
# 5. MOTIVATORS  (Q43-Q47)  - workbook tab "motivators"
# ===========================================================================
# Six dimensions. Q43-Q46 follow the workbook's option-score matrix
# (A 3/1/0/0/0, B 1/3/1/0/0, C 0/1/3/1/0, D 1/0/1/3/0); Q47 is the workplace
# item whose options map to Learning / Autonomy-Innovation / Impact / Security.

MOTIVATORS = [
    {
        "q": 43,
        "text": "Your school gives you an opportunity to select one special project for the entire year. Which project would excite you the most?",
        "options": [
            "Work on a challenging project where I can improve my skills and achieve excellent results.",
            "Create something completely new that nobody has tried before.",
            "Work on a project that solves a problem faced by people or society.",
            "Lead a team and make important decisions to achieve the goal.",
        ],
        "motivators": [
            {"Achievement": 3, "Innovation": 1, "Learning": 1},
            {"Innovation": 3, "Achievement": 1, "Impact": 1},
            {"Impact": 3, "Innovation": 1, "Leadership": 1},
            {"Leadership": 3, "Achievement": 1, "Impact": 1},
        ],
    },
    {
        "q": 44,
        "text": "You are given extra time after school. Which activity would make you feel most satisfied?",
        "options": [
            "Practicing a skill until I become better at it.",
            "Exploring new ideas and experimenting with creative possibilities.",
            "Helping someone learn or solve a problem they are facing.",
            "Taking responsibility for organizing a group activity.",
        ],
        "motivators": [
            {"Achievement": 3, "Learning": 2},
            {"Innovation": 3, "Learning": 1},
            {"Impact": 3, "Learning": 1},
            {"Leadership": 3, "Achievement": 1},
        ],
    },
    {
        "q": 45,
        "text": "Imagine you have achieved success in your future career. What would make you feel most proud?",
        "options": [
            "Becoming highly skilled and recognized as an expert in my field.",
            "Creating something innovative that changes the way people do things.",
            "Making a meaningful difference in people's lives.",
            "Becoming someone who leads teams and influences important decisions.",
        ],
        "motivators": [
            {"Achievement": 3, "Learning": 2},
            {"Innovation": 3, "Achievement": 1},
            {"Impact": 3},
            {"Leadership": 3, "Achievement": 1},
        ],
    },
    {
        "q": 46,
        "text": "Your school announces a competition where students can choose their own challenge. Which challenge would you prefer?",
        "options": [
            "A difficult challenge where I can test my abilities and compete with others.",
            "A creative challenge where I can design something unique.",
            "A challenge that helps improve the school or community.",
            "A challenge where I can coordinate a team and manage the entire activity.",
        ],
        "motivators": [
            {"Achievement": 3, "Learning": 1},
            {"Innovation": 3},
            {"Impact": 3},
            {"Leadership": 3},
        ],
    },
    {
        "q": 47,
        "text": "When choosing your future workplace, which environment would motivate you the most?",
        "options": [
            "A place where I can continuously learn, improve, and achieve bigger goals.",
            "A place where I have freedom to explore ideas and try new approaches.",
            "A place where my work helps people and creates positive change.",
            "A place with stability, clear systems, and a structured career path.",
        ],
        "motivators": [
            {"Learning": 3, "Achievement": 2},
            {"Innovation": 3, "Learning": 1},
            {"Impact": 3},
            {"Security": 3},
        ],
    },
]

# ===========================================================================
# 6. LEARNING STYLES  (Q48-Q51)  - workbook tab "Learning styles"
# ===========================================================================
# Every item runs A=Visual, B=Aural, C=Read/Write, D=Kinesthetic.

VARK = ["Visual", "Aural", "Read/Write", "Kinesthetic"]
LEARNING = [
    {
        "q": 48,
        "text": "Your teacher introduces a difficult new concept in science. How would you prefer to understand it?",
        "options": [
            "Watch an animation, diagram, or visual demonstration explaining the concept.",
            "Discuss the concept with the teacher and classmates to understand different viewpoints.",
            "Read detailed notes, textbook explanations, and examples about the topic.",
            "Perform an experiment or practical activity to understand how it works.",
        ],
    },
    {
        "q": 49,
        "text": "You have an important exam coming up. How do you prefer to prepare?",
        "options": [
            "Create mind maps, charts, diagrams, and visual summaries.",
            "Explain concepts aloud or discuss topics with friends or teachers.",
            "Prepare written notes, summaries, and read reference materials.",
            "Practice questions, solve problems, and learn through activities.",
        ],
    },
    {
        "q": 50,
        "text": "You want to learn a new skill outside academics. Which approach would you enjoy most?",
        "options": [
            "Watch tutorials, demonstrations, or step-by-step visual guides.",
            "Attend discussions, workshops, or learn by listening to experts.",
            "Read books, articles, manuals, or detailed instructions.",
            "Try the skill yourself through practice and real-world activities.",
        ],
    },
    {
        "q": 51,
        "text": "You are exploring different career options for your future. How would you prefer to learn about them?",
        "options": [
            "Watch videos showing professionals working in different careers.",
            "Attend career talks and interact with professionals or counsellors.",
            "Read career guides, articles, and detailed information about professions.",
            "Visit workplaces, attend internships, or experience the work practically.",
        ],
    },
]

# ===========================================================================
# 7. MULTIPLE INTELLIGENCE  (Q52-Q55)  - workbook tab "multiple intelligence"
# ===========================================================================
# Q52 follows the workbook's own option matrix (A Log3/Spa1, B Log1/Spa3,
# C Lin3/Inter2, D Log1/Inter2 + kinesthetic); Q53-Q55 extend the same shape.

MI_WEIGHTS = {
    "Logical–Mathematical": 0.15, "Linguistic": 0.15, "Spatial": 0.15, "Interpersonal": 0.15,
    "Intrapersonal": 0.10, "Bodily–Kinesthetic": 0.10, "Naturalistic": 0.10, "Musical": 0.10,
}
MULTIPLE_INTELLIGENCE = [
    {
        "q": 52,
        "text": "Your school asks you to participate in an annual exhibition. Which activity would you enjoy the most?",
        "options": [
            "Create a working model, experiment, or solve a technical problem for the exhibition.",
            "Design the exhibition layout, visuals, posters, or presentation style.",
            "Explain the project to visitors and answer their questions confidently.",
            "Create a practical demonstration, performance, or interactive activity for visitors.",
        ],
        "intel": [
            {"Logical–Mathematical": 3, "Spatial": 1},
            {"Spatial": 3, "Logical–Mathematical": 1},
            {"Linguistic": 3, "Interpersonal": 2},
            {"Bodily–Kinesthetic": 3, "Interpersonal": 2},
        ],
    },
    {
        "q": 53,
        "text": "Your team is given a difficult problem to solve. Which role would you naturally prefer?",
        "options": [
            "Analyze information, identify patterns, and find a logical solution.",
            "Think about how the solution can be presented creatively or visually.",
            "Understand everyone's ideas and help the team work together.",
            "Reflect on your own ideas and suggest improvements based on your experience.",
        ],
        "intel": [
            {"Logical–Mathematical": 3, "Spatial": 1},
            {"Spatial": 3, "Logical–Mathematical": 1},
            {"Interpersonal": 3, "Linguistic": 2},
            {"Intrapersonal": 3, "Logical–Mathematical": 1},
        ],
    },
    {
        "q": 54,
        "text": "You have a free weekend and want to learn something new. Which activity would attract you the most?",
        "options": [
            "Learn about plants, animals, environment, or how nature works.",
            "Write stories, create content, learn a language, or practice communication skills.",
            "Learn music, rhythm, instruments, or create audio content.",
            "Build something, practice a sport, perform, or learn through hands-on activities.",
        ],
        "intel": [
            {"Naturalistic": 3, "Logical–Mathematical": 1},
            {"Linguistic": 3, "Intrapersonal": 1},
            {"Musical": 3, "Spatial": 1},
            {"Bodily–Kinesthetic": 3, "Spatial": 1},
        ],
    },
    {
        "q": 55,
        "text": "Imagine you are choosing your ideal future workplace. Which environment would make you happiest?",
        "options": [
            "A place where I solve complex problems using logic, numbers, and technology.",
            "A place where I create designs, ideas, visuals, or innovative solutions.",
            "A place where I work with people, guide others, and make a positive difference.",
            "A place where I explore my own ideas, research deeply, and continuously improve myself.",
        ],
        "intel": [
            {"Logical–Mathematical": 3, "Spatial": 1},
            {"Spatial": 3, "Linguistic": 1},
            {"Interpersonal": 3, "Linguistic": 2},
            {"Intrapersonal": 3, "Naturalistic": 1},
        ],
    },
]

# ===========================================================================
# 8. EMOTIONAL INTELLIGENCE  (Q56-Q60)  - workbook tab "emotional intelligence"
# ===========================================================================
# Quality-scored: the best response for the dimension scores 3, partial 2,
# weak 1, avoidant 0.

EI = [
    {
        "q": 56, "dimension": "Emotional Awareness",
        "text": "Your teacher gives you feedback that your performance needs improvement. What would you most likely do?",
        "options": [
            "Think about the feedback carefully and identify what areas you need to improve.",
            "Feel disappointed initially but use the feedback as motivation to perform better.",
            "Discuss with your teacher to understand how you can improve further.",
            "Ignore the feedback because you feel your current approach is already enough.",
        ],
        "scores": [3, 2, 2, 0],
    },
    {
        "q": 57, "dimension": "Emotional Regulation",
        "text": "You are preparing for an important competition, but your preparation is not going as planned. How would you respond?",
        "options": [
            "Stay calm, review the situation, and create a new strategy.",
            "Take some time to manage your stress and regain focus before continuing.",
            "Ask teammates, teachers, or mentors for suggestions and support.",
            "Continue working hard but feel worried until the competition is completed.",
        ],
        "scores": [3, 2, 2, 1],
    },
    {
        "q": 58, "dimension": "Empathy & Social Awareness",
        "text": "Your classmate is upset because they performed poorly in an exam. What would you most likely do?",
        "options": [
            "Talk to them, understand their feelings, and encourage them.",
            "Share your own experiences and suggest ways they can improve.",
            "Help them prepare better for the next attempt.",
            "Give them time and allow them to handle the situation independently.",
        ],
        "scores": [3, 2, 2, 1],
    },
    {
        "q": 59, "dimension": "Relationship Management",
        "text": "During a group project, two team members disagree strongly about the best approach. What would you naturally do?",
        "options": [
            "Listen to both sides and help them find a solution everyone can accept.",
            "Clearly explain your viewpoint while encouraging respectful discussion.",
            "Suggest dividing responsibilities so everyone can contribute effectively.",
            "Allow the team leader to decide and focus only on your own task.",
        ],
        "scores": [3, 2, 2, 1],
    },
    {
        "q": 60, "dimension": "Adaptability & Resilience",
        "text": "Your plans suddenly change because of an unexpected situation. How do you usually respond?",
        "options": [
            "Quickly understand the new situation and adjust your approach.",
            "Look for new opportunities that may come from the change.",
            "Discuss the situation with others before deciding the next step.",
            "Take some time to process the change before deciding what to do.",
        ],
        "scores": [3, 3, 2, 1],
    },
]

# ===========================================================================
# CAREER MAP - dimension sub-score -> professions, transcribed from the
# "Career Clusters / Example Professions" columns of every workbook tab.
# ===========================================================================

CAREER_MAP = {
    "aptitude": {
        "Numerical": ["Engineer", "Chartered Accountant", "Data Scientist", "Economist", "Financial Analyst", "Banker"],
        "Verbal": ["Teacher", "Lawyer", "Journalist", "Psychologist", "Counsellor", "HR Manager"],
        "Logical": ["Software Engineer", "AI Engineer", "Scientist", "Data Analyst", "Research Scientist"],
        "Abstract": ["Architect", "UX Designer", "Product Designer", "AI Engineer"],
        "Spatial": ["Architect", "Civil Engineer", "Pilot", "Mechanical Engineer"],
        "Attention to Detail": ["Doctor", "Pharmacist", "Auditor", "Chartered Accountant"],
        "Mechanical": ["Mechanical Engineer", "Robotics Engineer", "Automation Engineer", "Electronics Engineer"],
    },
    "personality": {
        "Openness": ["Research Scientist", "Scientist", "Product Designer", "Architect", "Entrepreneur", "AI Engineer"],
        "Conscientiousness": ["Engineer", "Doctor", "Chartered Accountant", "IAS Officer", "Civil Engineer", "Auditor"],
        "Extraversion": ["Entrepreneur", "Teacher", "HR Manager", "Lawyer", "Business Manager", "Digital Marketer"],
        "Agreeableness": ["Doctor", "Psychologist", "Counsellor", "Teacher", "Social Worker", "HR Manager"],
        "Emotional Stability": ["Doctor", "Pilot", "IAS Officer", "Project Manager", "Operations Manager", "Entrepreneur"],
    },
    "strengths": {
        "Analytical": ["Data Scientist", "Scientist", "Software Engineer", "Research Scientist", "Engineer"],
        "Creative": ["Architect", "UX Designer", "Animator", "Graphic Designer", "Product Designer"],
        "Leadership": ["Entrepreneur", "IAS Officer", "Project Manager", "Business Manager", "Startup Founder"],
        "Relationship": ["Teacher", "Psychologist", "HR Manager", "Counsellor", "Social Worker"],
        "Execution": ["Chartered Accountant", "Operations Manager", "Project Manager", "Banker", "Auditor"],
        "Communication": ["Lawyer", "Journalist", "Teacher", "Digital Marketer", "Public Speaker"],
        "Adaptability": ["Consultant", "Startup Founder", "Product Designer", "Entrepreneur", "Business Analyst"],
        "Learning": ["Research Scientist", "Doctor", "Scientist", "Researcher", "AI Engineer"],
    },
    "motivators": {
        "Achievement": ["Doctor", "Engineer", "Scientist", "Chartered Accountant", "Research Scientist"],
        "Innovation": ["Entrepreneur", "Product Designer", "AI Engineer", "Startup Founder", "Architect"],
        "Impact": ["Teacher", "Psychologist", "Doctor", "Social Worker", "IAS Officer"],
        "Leadership": ["IAS Officer", "Business Manager", "Entrepreneur", "Project Manager", "Operations Manager"],
        "Security": ["Banker", "Chartered Accountant", "Auditor", "IAS Officer", "Financial Planner"],
        "Learning": ["Researcher", "Scientist", "Research Scientist", "Doctor", "Data Scientist"],
    },
    "mi": {
        "Logical–Mathematical": ["Engineer", "Data Scientist", "Software Engineer", "Financial Analyst", "AI Engineer"],
        "Linguistic": ["Lawyer", "Journalist", "Teacher", "Content Creator", "Public Speaker"],
        "Spatial": ["Architect", "Product Designer", "UX Designer", "Civil Engineer", "Animator"],
        "Bodily–Kinesthetic": ["Doctor", "Mechanical Engineer", "Physiotherapist", "Robotics Engineer"],
        "Musical": ["Music Producer", "Content Creator", "Media Professional"],
        "Interpersonal": ["Business Manager", "Psychologist", "Teacher", "HR Manager", "Counsellor"],
        "Intrapersonal": ["Entrepreneur", "Researcher", "Research Scientist", "Startup Founder", "Psychologist"],
        "Naturalistic": ["Environmental Scientist", "Doctor", "Environmental Engineer", "Scientist"],
    },
    "ei": {
        "Emotional Awareness": ["Entrepreneur", "Research Scientist", "Business Manager", "Startup Founder"],
        "Emotional Regulation": ["Doctor", "Pilot", "Project Manager", "Operations Manager"],
        "Empathy & Social Awareness": ["Doctor", "Teacher", "Psychologist", "Counsellor", "Social Worker"],
        "Relationship Management": ["Business Manager", "Lawyer", "Consultant", "IAS Officer", "HR Manager"],
        "Adaptability & Resilience": ["Entrepreneur", "Product Designer", "Consultant", "Startup Founder"],
    },
}

# Profession -> career cluster letter (matches data/career-clusters.json).
PROFESSION_CLUSTER = {
    # A  Engineering & Construction
    "Civil Engineer": "A", "Mechanical Engineer": "A", "Electronics Engineer": "A",
    "Robotics Engineer": "A", "Automation Engineer": "A", "Product Engineer": "A",
    "Environmental Engineer": "A", "Research Engineer": "A", "Engineer": "A",
    "Supply Chain Manager": "A", "Industrial Designer": "A",
    # B  Information Technology
    "Software Engineer": "B", "Software Developer": "B", "AI Engineer": "B",
    "Data Scientist": "B", "Data Analyst": "B", "UI Designer": "B",
    # C  Health Science
    "Doctor": "C", "Pharmacist": "C", "Physiotherapist": "C",
    # D  Arts, Media & Design
    "Architect": "D", "Graphic Designer": "D", "Animator": "D", "Product Designer": "D",
    "UX Designer": "D", "Fashion Designer": "D", "Film Maker": "D", "Content Creator": "D",
    "Media Professional": "D", "Event Designer": "D", "Interior Designer": "D",
    "Creative Director": "D", "Designer": "D", "Science Communicator": "D",
    "Music Producer": "D",
    # E  Business & Marketing
    "Entrepreneur": "E", "Startup Founder": "E", "Business Manager": "E",
    "Business Analyst": "E", "Chartered Accountant": "E", "Financial Analyst": "E",
    "Financial Planner": "E", "Banker": "E", "Auditor": "E", "Operations Manager": "E",
    "Operations Executive": "E", "Project Manager": "E", "Event Manager": "E",
    "Consultant": "E", "Economist": "E", "Digital Marketer": "E", "Sales Engineer": "E",
    "Business Consultant": "E", "Team Leader": "E",
    # F  Human & Public Services
    "Teacher": "F", "Psychologist": "F", "Counsellor": "F", "Social Worker": "F",
    "IAS Officer": "F", "Lawyer": "F", "HR Manager": "F", "HR Professional": "F",
    "NGO Manager": "F", "Public Speaker": "F", "Technical Trainer": "F", "Journalist": "F",
    # G  Science, Nature & Agriculture
    "Scientist": "G", "Research Scientist": "G", "Researcher": "G",
    "Environmental Scientist": "G",
    # H  Sports, Hospitality & Lifestyle
    "Pilot": "H",
}

# Canonical spellings for professions the workbook names inconsistently.
ALIASES = {
    "Software Developer": "Software Engineer",
    "UI Designer": "UX Designer",
    "Designer": "Product Designer",
    "Engineer": "Engineer",
    "HR Professional": "HR Manager",
    "Business Consultant": "Consultant",
    "Operations Executive": "Operations Manager",
    "Team Leader": "Project Manager",
    "Researcher": "Research Scientist",
    "Scientist": "Research Scientist",
    "NGO Manager": "Social Worker",
}


def canon(name: str) -> str:
    return ALIASES.get(name, name)


# ===========================================================================
# Build the bank
# ===========================================================================

def build_interests():
    out = []
    for it in INTERESTS:
        careers = [[canon(c) for c in opt] for opt in it["careers"]]
        clusters = []
        for opt in careers:
            tally = {}
            for c in opt:
                letter = PROFESSION_CLUSTER.get(c)
                if letter:
                    tally[letter] = tally.get(letter, 0) + 1
            clusters.append(tally)
        out.append({
            "type": "choice4", "q": f"Q{it['q']}", "text": it["text"], "options": it["options"],
            "riasec": it["riasec"], "clusterWeights": clusters, "careers": careers,
            **({"authored": True} if it.get("authored") else {}),
        })
    return out


def build_aptitude():
    out = []
    for it in APTITUDE:
        out.append({
            "type": "mcq", "q": f"Q{it['q']}", "format": "svg" if it.get("svgOptions") else "text",
            "domain": it["domain"], "difficulty": it["difficulty"], "text": it["text"],
            "options": it["options"], "svgOptions": bool(it.get("svgOptions")),
            "correct": it["correct"], "media": it.get("media"),
        })
    return out


def build_personality():
    return [{
        "type": "choice4", "q": f"Q{it['q']}", "trait": it["trait"], "facet": it["facet"],
        "text": it["text"], "options": it["options"], "traitPoints": it["points"],
    } for it in PERSONALITY]


def build_strengths():
    return [{
        "type": "choice4", "q": f"Q{it['q']}", "text": it["text"], "options": it["options"],
        "strengthPoints": it["domains"], **({"integrated": True} if it.get("integrated") else {}),
    } for it in STRENGTHS]


def build_motivators():
    return [{
        "type": "choice4", "q": f"Q{it['q']}", "text": it["text"], "options": it["options"],
        "motivatorPoints": it["motivators"],
    } for it in MOTIVATORS]


def build_learning():
    return [{
        "type": "vark", "q": f"Q{it['q']}", "text": it["text"], "options": it["options"],
        "styles": list(VARK),
    } for it in LEARNING]


def build_mi():
    return [{
        "type": "choice4", "q": f"Q{it['q']}", "text": it["text"], "options": it["options"],
        "intelPoints": it["intel"],
    } for it in MULTIPLE_INTELLIGENCE]


def build_ei():
    return [{
        "type": "choice4", "q": f"Q{it['q']}", "dimension": it["dimension"], "text": it["text"],
        "options": it["options"], "scores": it["scores"],
    } for it in EI]


def load(name):
    with open(os.path.join(DATA, name), encoding="utf-8") as f:
        return json.load(f)


def save(name, obj):
    with open(os.path.join(DATA, name), "w", encoding="utf-8") as f:
        json.dump(obj, f, ensure_ascii=False, indent=1)
    print("wrote", name)


def main():
    sets = {
        "career_interest": build_interests(),
        "personality": build_personality(),
        "motivators": build_motivators(),
        "learning_styles": build_learning(),
        "multiple_intelligence": build_mi(),
        "emotional_intelligence": build_ei(),
    }

    bank = load("assessment-questions.json")
    for cat, qs in sets.items():
        bank.setdefault(cat, {})["9-10"] = {"Set 1": qs}
    save("assessment-questions.json", bank)

    apt = load("aptitude-questions.json")
    apt["9-10"] = {"Set 1": build_aptitude()}
    save("aptitude-questions.json", apt)

    stg = load("strengths-questions.json")
    stg["9-10"] = {"Set 1": build_strengths()}
    save("strengths-questions.json", stg)

    # career map + MI weights + the logic tab's dimension weights
    save("career-map-9-10.json", {
        "dimensionWeights": {
            "career_interest": 0.20, "personality": 0.20, "aptitude": 0.13, "strengths": 0.13,
            "motivators": 0.10, "emotional_intelligence": 0.10, "learning_styles": 0.07,
            "multiple_intelligence": 0.07,
        },
        "miWeights": MI_WEIGHTS,
        "affinity": {d: {k: [canon(c) for c in v] for k, v in m.items()} for d, m in CAREER_MAP.items()},
        "professionCluster": {canon(k): v for k, v in PROFESSION_CLUSTER.items()},
    })

    total = sum(len(v) for v in sets.values()) + len(APTITUDE) + len(STRENGTHS)
    print("total questions:", total)
    if total != 60:
        print("!! expected 60", file=sys.stderr)
        sys.exit(1)


if __name__ == "__main__":
    main()

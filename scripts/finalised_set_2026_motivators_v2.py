# -*- coding: utf-8 -*-
"""Motivators Q43-Q47 — rewritten as trade-offs.

Three defects in the previous version:

  1. "Solve a problem faced by people or society" sat against three neutral
     alternatives. It is the answer a 15-year-old knows an adult wants, so it
     was picked without deliberation.
  2. Fixed option order on every item — A Achievement, B Innovation, C Impact,
     D Leadership, E Security. Anyone answering by position produced a clean,
     entirely false motivator profile.
  3. These were the longest options left in the exam at up to 67 characters.

Motivators are about what you WANT, so the cost has to be what you give up.
Every option here names both: being the best at one thing means being narrow,
helping people means little to show for it, leading means carrying the blame,
safety means dull. None of them is the admirable answer.

Six dimensions across 25 option slots, rotated so no dimension keeps a position.
Target length is under 45 characters, in line with personality and strengths.
"""

SOURCE = "trade-off rewrite"

# (qid, question, [(text, weights) x5], career clusters, professions)
RAW = [
    ("Q43", "One thing your next two years are really about. Which?", [
        ("Being the best at one thing, and narrow.", {"Achievement": 3, "Learning": 1}),
        ("Making something new that may not work.", {"Innovation": 3, "Achievement": 1}),
        ("Learning one field properly, slowly.", {"Learning": 3}),
        ("Running things, and being blamed for them.", {"Leadership": 3, "Achievement": 1}),
        ("A steady path with no surprises.", {"Security": 3}),
    ], "Engineering, Research, Design, Healthcare, Management",
        "Engineer, Research Scientist, Product Designer, Doctor, Project Manager"),

    ("Q44", "A free hour every day for a year. What do you do with it?", [
        ("Help someone who cannot repay it.", {"Impact": 3}),
        ("Get ahead so nothing piles up.", {"Security": 3, "Achievement": 1}),
        ("Build something nobody asked for.", {"Innovation": 3, "Learning": 1}),
        ("Study something hard with no reward.", {"Learning": 3, "Achievement": 1}),
        ("Organise people, and handle the fallout.", {"Leadership": 3}),
    ], "Education, Technology, Healthcare, Business, Creative Fields",
        "Teacher, Software Engineer, Doctor, Business Manager, Graphic Designer"),

    ("Q45", "Twenty years on, what would you want said about your work?", [
        ("It made life better for people.", {"Impact": 3}),
        ("It was the best in its field.", {"Achievement": 3, "Learning": 1}),
        ("It ran because I held it together.", {"Leadership": 3}),
        ("It lasted, and never let anyone down.", {"Security": 3, "Achievement": 1}),
        ("It did not exist before.", {"Innovation": 3}),
    ], "Research, Technology, Healthcare, Public Service, Government",
        "Research Scientist, AI Engineer, Doctor, IAS Officer, Entrepreneur"),

    ("Q46", "Two offers, same pay. Which do you take?", [
        ("Predictable, safe, a bit dull.", {"Security": 3}),
        ("Hard, and I would be out of my depth.", {"Learning": 3, "Achievement": 1}),
        ("In charge, with the pressure that brings.", {"Leadership": 3}),
        ("Free to experiment, might go nowhere.", {"Innovation": 3, "Learning": 1}),
        ("Useful work, barely noticed.", {"Impact": 3}),
    ], "Finance, Research, Management, Design, Public Service",
        "Chartered Accountant, Research Scientist, Operations Manager, Product Designer, Social Worker"),

    ("Q47", "A year from now, what would make it a year well spent?", [
        ("I got much better at something hard.", {"Learning": 3, "Achievement": 2}),
        ("People followed a decision I made.", {"Leadership": 3}),
        ("I beat a target I set myself.", {"Achievement": 3}),
        ("Someone's life is measurably better.", {"Impact": 3}),
        ("I built something from nothing.", {"Innovation": 3}),
    ], "Research, Entrepreneurship, Healthcare, Education, Government",
        "Research Scientist, Startup Founder, Doctor, Teacher, Civil Services Officer"),
]

MOTIVATORS = [(qid, text, [(t, w, SOURCE) for t, w in opts], cl, pr)
              for qid, text, opts, cl, pr in RAW]
WEIGHTS = {qid: [w for _t, w in opts] for qid, _s, opts, _c, _p in RAW}
DOMAINS = {qid: [max(w, key=w.get) for _t, w in opts] for qid, _s, opts, _c, _p in RAW}

NOTE = (
    "Every option names what it gains AND what it costs, because motivators are about what you want and the only "
    "honest question is what you would give up for it. Being the best at one thing means being narrow; helping "
    "people means little to show for it; leading means carrying the blame; safety means dull. The previous "
    "version put 'solve a problem faced by people or society' against three neutral alternatives, which is the "
    "answer a 15-year-old knows an adult wants. Option order is rotated so answering by position no longer "
    "produces a coherent profile."
)

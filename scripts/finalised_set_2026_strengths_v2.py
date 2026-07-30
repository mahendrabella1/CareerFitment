# -*- coding: utf-8 -*-
"""Strengths Q35-Q42 rebuilt as a genuine working-style instrument.

Two defects in the supplied section:

  1. Every item varied by SUBJECT (tech / health / agri / law) while the action
     stayed constant, so it re-measured career interest and duplicated Q1-Q12.
  2. Twenty of the forty options were prefixed with their own category
     ("Smart Tech & AI: ...", "Law & Public Policy: ..."), telling the student
     exactly what each option was scoring.

Rebuilt so each item is ONE scenario and the five options are different ways of
responding to it. The subject is invisible; only the working style differs.

EVERY OPTION CARRIES A COST. That is the part that makes a student stop and
decide. An option set where all five are admirable — "rally the team", "ease the
tension", "find a smarter way" — still lets them pick whoever they would like to
be, which is the social-desirability problem in a nicer suit. Here, covering for
a teammate means resenting it, arguing your case means annoying the teacher, and
asking for help means looking clueless. There is no free answer.

Scoring stays on the eight domains the career map already uses across all 113
professions, and rolls up to four reporting groups. Scoring at eight keeps the
resolution that separates, say, an Architect from an Accountant; reporting at
four gives the student a story they can hold. Nothing in the career map changes.

    Delivering    <- Execution
    Persuading    <- Leadership, Communication
    Connecting    <- Relationship, Adaptability
    Reasoning     <- Analytical, Creative, Learning

Deliberately NOT using the Gallup/CliftonStrengths theme names or their four
published domain labels: that instrument is trademarked and this is a paid
product. The idea of grouping strengths this way is not ownable; their naming is.

Coverage is exactly 5 options per domain across the 40 slots, and neither the
domain nor its option position repeats in a fixed pattern — a student who always
picks A cannot produce a coherent profile.
"""

ROLLUP = {
    "Execution": "Delivering",
    "Leadership": "Persuading", "Communication": "Persuading",
    "Relationship": "Connecting", "Adaptability": "Connecting",
    "Analytical": "Reasoning", "Creative": "Reasoning", "Learning": "Reasoning",
}

SOURCE = "working-style rebuild"

# (qid, scenario, [(option text, weights) x5], career clusters, professions)
RAW = [
    ("Q35", "Your group presents next week and one member still hasn't done anything. What do you actually do?", [
        ("Tell them straight, even if it gets awkward.",
         {"Leadership": 3, "Communication": 1}),
        ("Check whether the plan was ever realistic.",
         {"Analytical": 3, "Learning": 1}),
        ("Ask them privately, and lose a day over it.",
         {"Relationship": 3, "Adaptability": 1}),
        ("Do their part myself and say nothing.",
         {"Execution": 3, "Analytical": 1}),
        ("Cut their section out of the presentation.",
         {"Creative": 3, "Adaptability": 1}),
    ], "Management, Education, Research, Operations",
        "Project Manager, Teacher, Research Scientist, Operations Manager"),

    ("Q36", "You are handed a task nobody has explained, with no instructions. How do you start?", [
        ("Read up first, even if it eats my time.",
         {"Learning": 3, "Analytical": 1}),
        ("Start now and get some of it wrong.",
         {"Execution": 3, "Adaptability": 1}),
        ("Keep asking until someone explains it.",
         {"Communication": 3, "Relationship": 1}),
        ("Try something, switch when it fails.",
         {"Adaptability": 3, "Creative": 1}),
        ("Map it out before touching anything.",
         {"Analytical": 3, "Execution": 1}),
    ], "Research, Technology, Consulting, Operations",
        "Research Scientist, Software Engineer, Consultant, Data Analyst"),

    ("Q37", "Your school is raising money for a new library and you can pick your role.", [
        ("Try something new that might flop.",
         {"Creative": 3, "Adaptability": 1}),
        ("Stand up and do the asking.",
         {"Communication": 3, "Leadership": 1}),
        ("Keep volunteers going when they lose interest.",
         {"Relationship": 3, "Execution": 1}),
        ("Decide, and carry the blame if it fails.",
         {"Leadership": 3, "Execution": 1}),
        ("Copy what worked at other schools.",
         {"Learning": 3, "Analytical": 1}),
    ], "Marketing, Public Service, Education, Entrepreneurship",
        "Digital Marketer, Social Worker, Teacher, Entrepreneur"),

    ("Q38", "A teacher rejects the idea you spent a week on. What is your honest next move?", [
        ("Drop it and start something else.",
         {"Adaptability": 3, "Creative": 1}),
        ("Rebuild it to the brief, duller but safe.",
         {"Execution": 3, "Analytical": 1}),
        ("Keep the idea, change how I sell it.",
         {"Creative": 3, "Communication": 1}),
        ("Find the exact part that failed.",
         {"Analytical": 3, "Learning": 1}),
        ("Argue back, and risk annoying them.",
         {"Leadership": 3, "Communication": 1}),
    ], "Design, Engineering, Law, Research",
        "Product Designer, Engineer, Lawyer, Research Scientist"),

    ("Q39", "Younger students are joining and someone has to look after them. What appeals to you?", [
        ("Run the sessions and do the talking.",
         {"Communication": 3, "Leadership": 1}),
        ("Sit with the one who is struggling.",
         {"Relationship": 3, "Adaptability": 1}),
        ("Work out why they struggle first.",
         {"Analytical": 3, "Learning": 1}),
        ("Get good at it before I start.",
         {"Learning": 3, "Execution": 1}),
        ("Turn up and work it out as I go.",
         {"Adaptability": 3, "Relationship": 1}),
    ], "Education, Psychology, Human Resources, Public Service",
        "Teacher, Psychologist, HR Manager, Counsellor"),

    ("Q40", "Two weeks into a plan, the situation changes completely. What do you do?", [
        ("Check how everyone is taking it.",
         {"Relationship": 3, "Communication": 1}),
        ("Decide fast, without full agreement.",
         {"Leadership": 3, "Execution": 1}),
        ("Use it to build something better.",
         {"Creative": 3, "Adaptability": 1}),
        ("Adjust as we go, no re-planning.",
         {"Adaptability": 3, "Execution": 1}),
        ("Stop until I understand what changed.",
         {"Learning": 3, "Analytical": 1}),
    ], "Management, Operations, Design, Consulting",
        "Business Manager, Operations Manager, Creative Director, Consultant"),

    ("Q41", "You are asked to check someone's work before it is handed in. How do you do it?", [
        ("List every single thing that is wrong.",
         {"Analytical": 3, "Execution": 1}),
        ("Fix what I can so it goes in on time.",
         {"Execution": 3, "Analytical": 1}),
        ("Flag the big things, ignore the rest.",
         {"Adaptability": 3, "Analytical": 1}),
        ("Tell them honestly, even if it stings.",
         {"Communication": 3, "Leadership": 1}),
        ("Suggest a different angle entirely.",
         {"Creative": 3, "Learning": 1}),
    ], "Quality, Finance, Media, Education",
        "Auditor, Chartered Accountant, Journalist, Teacher"),

    ("Q42", "Next year you could give up your Saturdays to one thing. Which would you choose?", [
        ("Finish something big I can point at.",
         {"Execution": 3, "Analytical": 1}),
        ("Get properly good at one hard skill.",
         {"Learning": 3, "Analytical": 1}),
        ("Run something, and own what goes wrong.",
         {"Leadership": 3, "Execution": 1}),
        ("Help people who need it, unglamorously.",
         {"Relationship": 3, "Adaptability": 1}),
        ("Speak well enough that a room listens.",
         {"Communication": 3, "Leadership": 1}),
    ], "Integrated validation — all career clusters",
        "Engineering, Healthcare, Business, Design, Education, Public Service"),
]

STRENGTHS = [(qid, text, [(t, max(w, key=w.get), w, SOURCE) for t, w in opts],
              ", ".join(dict.fromkeys(max(w, key=w.get) for _t, w in opts)), cl, pr)
             for qid, text, opts, cl, pr in RAW]

WEIGHTS = {qid: [w for _t, w in opts] for qid, _s, opts, _c, _p in RAW}
DOMAINS = {qid: [max(w, key=w.get) for _t, w in opts] for qid, _s, opts, _c, _p in RAW}
GROUPS = {qid: [ROLLUP[d] for d in DOMAINS[qid]] for qid in DOMAINS}

NOTE = (
    "Each item is one scenario; the five options are different ways of responding to it, so the section measures "
    "working style rather than subject preference — the previous version varied the subject and duplicated the "
    "Interests scale. Every option carries a cost (covering for a teammate means resenting it; arguing your case "
    "means annoying the teacher; asking for help means looking clueless), so there is no flattering answer to "
    "pick without thinking. Scored on the eight domains the career map already uses, and rolled up to four "
    "reporting groups: Delivering, Persuading, Connecting, Reasoning."
)

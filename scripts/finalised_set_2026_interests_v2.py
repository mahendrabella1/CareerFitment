# -*- coding: utf-8 -*-
"""Interests Q1-Q12 rewritten as BEHAVIOUR choices, not career labels.

The problem with the supplied set: every option named its own field — "Diagnose
community health issues", "Manage stall budgets", "Create posters and branding".
A student who wants to look like a doctor simply picks the medical-sounding
option twelve times. That measures self-presentation, not interest.

Here each option describes HOW the student prefers to think and act. The career
signal is derived from that behaviour and never shown to them. Pattern follows
the client's worked example for Q1, which is reproduced verbatim.

Five behaviour families, one per option:

    INVESTIGATIVE  understand and diagnose before acting
                   -> Health & Medical, Psychology, Life Sciences      C + G
    SYSTEMS        make things work better; build and optimise
                   -> Engineering, Computing, Robotics                 B + A
    ETHICAL        fairness, rules, considered judgement
                   -> Law, Public Policy, Civil Services               F + E
    CREATIVE       express an idea so it lands
                   -> Media, Design, Communication                     D
    PLANNING       organise resources and make it happen on time
                   -> Business, Commerce, Management                   E + A

OPTION ORDER IS ROTATED across the twelve items on purpose. If the same
behaviour always sat in slot A, a student who habitually picks the first option
would produce a perfectly consistent — and completely false — profile. The
rotation is recorded in BEHAVIOUR_ORDER so the mapping stays auditable.
"""

# behaviour key -> (clusters, riasec, career signal, professions for scoring)
BEHAVIOUR = {
    "INVESTIGATIVE": (
        {"C": 3, "G": 2}, {"I": 3, "S": 1},
        "Health & Medical Sciences, Psychology, Life Sciences & Research",
        ["Doctor", "Research Scientist", "Psychologist", "Pharmacist"],
    ),
    "SYSTEMS": (
        {"B": 3, "A": 2}, {"R": 3, "I": 2},
        "Engineering & Technology, Computer Science, Robotics",
        ["Software Engineer", "Mechanical Engineer", "Robotics Engineer",
         "AI Engineer", "Civil Engineer"],
    ),
    "ETHICAL": (
        {"F": 4, "E": 1}, {"S": 2, "E": 2, "C": 1},
        "Law, Public Policy & Governance, Civil Services",
        ["Lawyer", "IAS Officer", "Social Worker", "Counsellor"],
    ),
    "CREATIVE": (
        {"D": 5}, {"A": 3, "E": 1},
        "Media, Design, Mass Communication, Digital Marketing",
        ["Graphic Designer", "Animator", "Journalist", "Architect", "Content Creator"],
    ),
    "PLANNING": (
        {"E": 4, "A": 1}, {"C": 3, "E": 2},
        "Business, Commerce, Management, Entrepreneurship",
        ["Operations Manager", "Chartered Accountant", "Project Manager",
         "Business Manager", "Financial Analyst"],
    ),
}

BEHAVIOUR_MEASURED = {
    "INVESTIGATIVE": "Investigative thinking, diagnosis, evidence gathering, analytical observation",
    "SYSTEMS": "Systems thinking, innovation, optimization, technical reasoning",
    "ETHICAL": "Ethical reasoning, governance, policy awareness, structured decision-making",
    "CREATIVE": "Creative communication, storytelling, audience awareness, visual thinking",
    "PLANNING": "Planning, resource management, execution, operational coordination",
}

# (qid, stem, [(behaviour, option text) x5])  — order deliberately rotated
RAW = [
    ("Q1", "Your school is organizing a District-Level Community Fair. Which responsibility would you enjoy the most?", [
        ("INVESTIGATIVE", "Understand the problem before fixing it."),
        ("SYSTEMS", "Finding smarter ways to make things work better."),
        ("ETHICAL", "Make sure the decision is a fair one."),
        ("CREATIVE", "Get people interested in the idea."),
        ("PLANNING", "Keep the whole thing on schedule."),
    ]),
    ("Q2", "You can spend a week shadowing anyone at work. What would you most want to watch them do?", [
        ("CREATIVE", "Turn a rough idea into something noticed."),
        ("PLANNING", "Keep a messy operation on schedule."),
        ("INVESTIGATIVE", "Work out what is really going on."),
        ("SYSTEMS", "Make something half-working work."),
        ("ETHICAL", "Weigh a hard call and justify it."),
    ]),
    ("Q3", "Your town is setting up a new Model Village Project. Where would you want to be involved?", [
        ("SYSTEMS", "Design how the whole thing works."),
        ("ETHICAL", "Set rules that are fair to everyone."),
        ("PLANNING", "Turn the plan into a budget that holds."),
        ("INVESTIGATIVE", "Find out what is actually needed, and why."),
        ("CREATIVE", "Tell it so people want to join in."),
    ]),
    ("Q4", "For your Class 10 exhibition you can lead one project. Which appeals to you most?", [
        ("PLANNING", "Many moving parts, all due at once."),
        ("CREATIVE", "Looks like nothing else on show."),
        ("SYSTEMS", "Build it, then keep improving it."),
        ("ETHICAL", "Take a contested issue and argue it."),
        ("INVESTIGATIVE", "Test an idea and see if it holds up."),
    ]),
    ("Q5", "You are given ₹10,000 for a student-led initiative. What would you put it into?", [
        ("ETHICAL", "Fix an unfairness people ignore."),
        ("INVESTIGATIVE", "Find out why it keeps coming back."),
        ("CREATIVE", "Something people remember afterwards."),
        ("PLANNING", "Runs every week without me."),
        ("SYSTEMS", "Build a tool that saves time."),
    ]),
    ("Q6", "Which kind of story keeps you reading or watching the longest?", [
        ("INVESTIGATIVE", "How someone found the cause."),
        ("PLANNING", "How something huge held together."),
        ("ETHICAL", "How a hard decision got settled."),
        ("SYSTEMS", "How something impossible got built."),
        ("CREATIVE", "How an idea changed minds."),
    ]),
    ("Q7", "Something goes badly wrong on a school trip. What do you find yourself doing?", [
        ("SYSTEMS", "Fix whatever has stopped working."),
        ("CREATIVE", "Get a clear message out fast."),
        ("INVESTIGATIVE", "Work out what actually happened."),
        ("ETHICAL", "Check what the rules actually say."),
        ("PLANNING", "Get people and supplies organised."),
    ]),
    ("Q8", "Which problem would you be proudest to have solved twenty years from now?", [
        ("CREATIVE", "I changed how people see something."),
        ("ETHICAL", "I left a system fairer than I found it."),
        ("PLANNING", "I made it work at a huge scale."),
        ("SYSTEMS", "I made a thing far better."),
        ("INVESTIGATIVE", "I found the answer nobody else could."),
    ]),
    ("Q9", "Picture your work ten years from now. What would make it a good day?", [
        ("PLANNING", "Everything I set up just worked."),
        ("SYSTEMS", "I got a stubborn thing working."),
        ("CREATIVE", "I made something worth showing."),
        ("INVESTIGATIVE", "I understood something long puzzling."),
        ("ETHICAL", "I argued a hard case and got it right."),
    ]),
    ("Q10", "You can add one extra subject next term, purely because you want to. What draws you?", [
        ("ETHICAL", "Reasoning through contested questions."),
        ("CREATIVE", "Expressing an idea so it lands."),
        ("INVESTIGATIVE", "Testing a claim properly."),
        ("PLANNING", "Running something end to end."),
        ("SYSTEMS", "Designing and building things."),
    ]),
    ("Q11", "A company offers you a month with any one of its teams. Which do you ask for?", [
        ("INVESTIGATIVE", "Working out why it keeps failing."),
        ("SYSTEMS", "Rebuilding how the product works."),
        ("PLANNING", "Keeping costs and delivery on track."),
        ("ETHICAL", "Making sure it is safe and legal."),
        ("CREATIVE", "Deciding how it looks and feels."),
    ]),
    ("Q12", "Your school starts a student magazine and website. Which job do you take?", [
        ("CREATIVE", "Deciding how each story gets told."),
        ("INVESTIGATIVE", "Digging out facts and checking them."),
        ("SYSTEMS", "Building the site and keeping it fast."),
        ("PLANNING", "Running the schedule and the budget."),
        ("ETHICAL", "Deciding what we should not publish."),
    ]),
]

SOURCE = "behaviour-based rewrite"

BEHAVIOUR_ORDER = {qid: [b for b, _t in opts] for qid, _s, opts in RAW}

# Which cluster LEADS, per question.
#
# Two behaviours each straddle a pair of clusters: SYSTEMS points at both
# Engineering & Construction (A) and IT (B); INVESTIGATIVE points at both Health
# (C) and Science/Nature/Agriculture (G). If the same member always led, the
# other could never come top for anyone — with a fixed order, A and G were
# dominant on zero options out of sixty, so a student who cares about building
# things or about the natural world had no answer that read as theirs.
#
# So the lead alternates, chosen by what each scenario is actually about:
# physical, built-environment scenarios lead with A; scenarios about causes in
# the living world lead with G.
LEAD_OVERRIDE = {
    # question -> behaviour -> weights that replace the default
    "Q3": {"SYSTEMS": {"A": 3, "B": 2}, "INVESTIGATIVE": {"G": 3, "C": 2}},   # model village
    "Q5": {"INVESTIGATIVE": {"G": 3, "C": 2}},                                # why a problem recurs
    "Q6": {"INVESTIGATIVE": {"G": 3, "C": 2}},                                # cause of something puzzling
    "Q7": {"SYSTEMS": {"A": 3, "B": 2}},                                      # fixing what stopped working
    "Q8": {"INVESTIGATIVE": {"G": 3, "C": 2}},                                # the answer nobody could find
    "Q9": {"SYSTEMS": {"A": 3, "B": 2}},                                      # got a stubborn thing working
    "Q11": {"SYSTEMS": {"A": 3, "B": 2}},                                     # why the product keeps failing
}


# Expanded into the same shape the rest of the pipeline expects:
#   (qid, stem, [(text, cluster letter, career signal, riasec)], source, note)
INTERESTS = []
for _qid, _stem, _opts in RAW:
    rows = []
    for _b, _text in _opts:
        clusters, riasec, signal, profs = BEHAVIOUR[_b]
        clusters = LEAD_OVERRIDE.get(_qid, {}).get(_b, clusters)
        dominant = max(clusters, key=clusters.get)
        rows.append((_text, dominant, f"{signal}: {', '.join(profs)}", riasec))
    INTERESTS.append((_qid, _stem, rows, SOURCE, ""))


# Full per-option weights, for the importer (a behaviour can signal more than
# one cluster — "systems thinking" points at both Engineering and IT).
CLUSTER_WEIGHTS = {
    qid: [LEAD_OVERRIDE.get(qid, {}).get(b, BEHAVIOUR[b][0]) for b, _t in opts]
    for qid, _s, opts in RAW
}
CAREERS = {qid: [BEHAVIOUR[b][3] for b, _t in opts] for qid, _s, opts in RAW}
MEASURED = {qid: [BEHAVIOUR_MEASURED[b] for b, _t in opts] for qid, _s, opts in RAW}
SIGNALS = {qid: [BEHAVIOUR[b][2] for b, _t in opts] for qid, _s, opts in RAW}

NOTE = (
    "Options describe BEHAVIOUR, never a field of work, so a student cannot pick the medical-sounding or "
    "business-sounding answer to shape the result. The career signal is derived from the behaviour and is never "
    "shown. Option order is rotated across the twelve items so that habitually picking slot A cannot produce a "
    "consistent false profile — which the previous fixed order allowed."
)

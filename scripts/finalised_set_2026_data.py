# -*- coding: utf-8 -*-
"""The finalised 2026 question set — questions and options exactly as supplied.

Single source of truth, read by BOTH:
  * build_finalised_set_2026.py   -> the reviewable workbook + Markdown
  * import_finalised_set_2026.py  -> project/data/*.json, the live bank

Question text and option text are transcribed verbatim from
"finalised set 2026 (client original).xlsx". Nothing is reworded, replaced or
invented. Only two kinds of thing are added here:

  * MAPPINGS the sheet does not carry — per-option scoring weights, RIASEC
    codes, career clusters and professions. Every added mapping is what lets the
    engine score the answer; without it a question is inert.
  * A FIFTH OPTION on the three sections the sheet supplies with four
    (strengths, motivators, learning styles). Each is tagged ADDED below.

Where an item has a defect it is transcribed AS GIVEN and recorded in `note`,
so it surfaces in the workbook's Review Notes rather than being silently fixed.

Counts follow the old bank exactly (interests 12 · aptitude 10 · personality 12
· strengths 8 · motivators 5 · learning 4 · MI 4 · EI 5 = 60). The sheet supplies
more than the count for aptitude, strengths, learning styles and EI — the top N
are taken. It supplies fewer for interests (10 of 12); the two remaining slots
keep the questions already live, flagged in INTERESTS_SHORTFALL.
"""

CLIENT = "finalised set 2026"
ADDED = "5th option added"
KEPT = "kept from live bank — sheet supplies only 10 interests questions"

CLUSTER_NAMES = {
    "A": "Engineering & Construction", "B": "Information Technology", "C": "Health Science",
    "D": "Arts, Media & Design", "E": "Business & Marketing", "F": "Human & Public Services",
    "G": "Science, Nature & Agriculture", "H": "Sports, Hospitality & Lifestyle",
}

BLUEPRINT = [
    ("interests", "career_interest", 12, "Q1-Q12"),
    ("aptitude", "aptitude", 10, "Q13-Q22"),
    ("personality", "personality", 12, "Q23-Q34"),
    ("Strenghts", "strengths", 8, "Q35-Q42"),
    ("motivators", "motivators", 5, "Q43-Q47"),
    ("Learning styles", "learning_styles", 4, "Q48-Q51"),
    ("multiple intellligence", "multiple_intelligence", 4, "Q52-Q55"),
    ("emotional intelligence", "emotional_intelligence", 5, "Q56-Q60"),
]

BLUEPRINT_NOTE = {
    "interests": "5 career families per item: Health · Agriculture/Science · Engineering-Tech · Law-Arts · Business",
    "aptitude": "10 dimensions, one item each. 3 items need artwork, 1 recommended.",
    "personality": "Big Five — Openness, Conscientiousness, Extraversion, Agreeableness, Emotional Stability",
    "Strenghts": "Client taxonomy per option (Technical / Medical / Environmental / Legal / Financial)",
    "motivators": "Achievement, Innovation, Impact, Leadership, Security",
    "Learning styles": "VARK — Visual, Auditory, Reading/Writing, Kinesthetic, Multimodal (a specific two-mode strategy, not 'do everything')",
    "multiple intellligence": "Logical, Visual-Spatial, Linguistic/Interpersonal, Intrapersonal, Bodily-Kinesthetic",
    "emotional intelligence": "Self-Awareness, Self-Regulation, Self-Motivation, Empathy, Relationship Management",
}

INTERESTS_SHORTFALL = (
    "All 12 interests items are now behaviour-based (see finalised_set_2026_interests_v2.py). The sheet's "
    "original 10 named their own career field in the option text, which let a student steer the result; the "
    "rewrite hides the signal and rotates option order."
)

# =========================================================================== #
# 1. INTERESTS — Q1-Q12, behaviour-based rewrite.
#
# The supplied options named their own field ("Diagnose community health
# issues", "Manage stall budgets"), so a student could simply pick the
# medical-sounding answer twelve times. Options now describe HOW the student
# thinks and act; the career signal is derived and never shown. Option order is
# rotated so habitually picking slot A cannot produce a consistent false
# profile. See finalised_set_2026_interests_v2.py for the full rationale.
# =========================================================================== #
from finalised_set_2026_interests_v2 import (  # noqa: E402
    INTERESTS, CLUSTER_WEIGHTS as INTERESTS_CLUSTER_WEIGHTS,
    CAREERS as INTERESTS_CAREERS, MEASURED as INTERESTS_MEASURED,
    SIGNALS as INTERESTS_SIGNALS, BEHAVIOUR_ORDER as INTERESTS_BEHAVIOUR,
    NOTE as INTERESTS_NOTE,
)

# =========================================================================== #
# 2. APTITUDE — Q13-Q22. 10 of the sheet's 15, one per dimension.
#    (qid, text, options, correct letter, dimension, clusters, professions,
#     image flag, image spec, source, note)   -- all client text, verbatim.
# =========================================================================== #
APTITUDE = [
    ("Q13", "A student business buys notebooks at ₹40 each and sells them for ₹50 each. What is the profit percentage?",
     ["15%", "20%", "25%", "30%", "10%"], "C", "Numerical Reasoning",
     "Business, Finance & Law", "Chartered Accountant (CA), Financial Analyst, Investment Banker",
     "Not needed", "Text-only item.", CLIENT + " item 11", ""),
    ("Q14", "All doctors study science. Some science students become researchers. Which conclusion is definitely true?",
     ["All researchers are doctors.", "All science students become doctors.",
      "Some people who study science become researchers.", "No doctors are researchers.",
      "All researchers are science teachers."], "C", "Logical Deduction",
     "Business, Finance & Law", "Corporate Lawyer, Compliance Officer, Risk Auditor",
     "Not needed", "Text-only item.", CLIENT + " item 12", ""),
    ("Q15", "Which of the following items is the odd one out among specialized professional tools?",
     ["Python (Programming)", "Stethoscope", "Ledger", "Palette", "Tractor"], "E", "Verbal Classification",
     "Society, Nature & Public Service", "Agricultural Engineer, Farm Operator",
     "Optional", "Five small line icons, one per option (laptop, stethoscope, ledger, palette, tractor).",
     CLIENT + " item 13",
     "Cluster tag follows the correct answer (Tractor) rather than the skill being tested. Left as supplied."),
    ("Q16", "School electricity usage dropped from 1,200 kWh in Jan to 900 kWh in Feb. What is the percentage reduction?",
     ["20%", "25%", "30%", "33.3%", "15%"], "B", "Data Interpretation",
     "Health & Life Sciences", "Environmental Health Specialist, Bio-Statistician",
     "Recommended", "Two-bar column chart — January 1,200 kWh, February 900 kWh, y-axis in kWh. "
     "The item is tagged Data Interpretation but gives the figures in prose only.",
     CLIENT + " item 14",
     "Cluster tag (Health & Life Sciences) does not follow from an electricity-usage item. Left as supplied."),
    ("Q17", "A square piece of paper is folded twice and a triangle punch is made. When unfolded, how many punches appear?",
     ["2", "4", "6", "8", "1"], "B", "Spatial Reasoning",
     "Health & Life Sciences", "Orthopedic Specialist, Diagnostic Technician",
     "Required", "Four-panel strip: (1) plain square, (2) folded in half, (3) folded again, "
     "(4) the folded square with a triangular notch cut from one edge. Do not show the unfolded result.",
     CLIENT + " item 15",
     "Marked '(visual item)' in the sheet — artwork is mandatory. Cluster tag does not follow from paper folding."),
    ("Q18", "Diagnosis is to Treatment as Evidence is to ______.",
     ["Investigation", "Medicine", "Verdict", "Crime", "Policy"], "C", "Verbal Analogy",
     "Business, Finance & Law", "High Court Lawyer, Magistrate, Corporate Arbitrator",
     "Not needed", "Text-only item.", CLIENT + " item 17", ""),
    ("Q19", "If TECH is written as 3142, and ARTS is written as 5678, how is RATE written?",
     ["6841", "6571", "5614", "7841", "8714"], "B", "Coding-Decoding",
     "Health & Life Sciences", "Genetic Coder, Bioinformatics Specialist",
     "Not needed", "Text-only item.", CLIENT + " item 18",
     "DEFECT — the two keys contradict each other. TECH=3142 gives T=3; ARTS=5678 gives T=7. The marked answer "
     "6571 assumes T=7. Left exactly as supplied. Fix by changing one key word (ARTS=5637 makes T=3 throughout "
     "and RATE=6531), or state that each word uses its own key."),
    ("Q20", "A series shows 3 circles, 5 triangles, 7 squares, ?. What shape and count come next?",
     ["8 Circles", "9 Triangles", "9 Pentagons", "10 Hexagons", "11 Lines"], "C", "Abstract Reasoning",
     "Business, Finance & Law", "Strategic Analyst, Market Forecaster",
     "Required", "Three groups drawn left to right — 3 circles, 5 triangles, 7 squares — then a boxed '?'. "
     "Counts must be visibly correct so the 3/5/7 progression can be seen, not just read.",
     CLIENT + " item 19",
     "DEFECT — the answer needs two rules at once (count +2, sides +1), and circle-to-triangle breaks the sides "
     "rule, so option D is arguable. Left as supplied. Starting the series at a triangle would resolve it."),
    ("Q21", "Which number is different? 456789, 456798, 456879, 456789",
     ["456789", "456798", "456879", "456789", "e"], "C", "Attention to Detail",
     "Healthcare & Finance", "Pharmacist, Auditor",
     "Optional", "The five choices in a monospaced vertical stack so digits align column by column.",
     CLIENT + " item 14 (second block)",
     "DEFECT — the stem lists 456789 twice, so BOTH 456798 and 456879 are unique and the item has two correct "
     "answers. Option E is also a stray letter 'e'. Left exactly as supplied. Fix by listing 456789 three times "
     "and giving E an 'All are the same' distractor."),
    ("Q22", "Two gears mesh together. Gear A turns clockwise. Which way does Gear B turn?",
     ["Clockwise", "Counter-clockwise", "No movement", "Depends on size", "Cannot say"], "B",
     "Mechanical Reasoning", "Mechanical Engineering", "Mechanical Engineer",
     "Required", "Two meshed spur gears labelled 'Gear A' and 'Gear B', a curved arrow on A marked 'clockwise', "
     "a '?' above B. This artwork already exists as inline SVG in the live bank (9-10 Set 1, Q22) and is reused.",
     CLIENT + " item 15 (second block)", ""),
]

# The career map's aptitude affinity table has exactly seven keys. An item whose
# `domain` is not one of them contributes nothing to career matching, so each of
# the sheet's finer dimension names is folded onto its engine key. The sheet's
# own wording is kept in `domainLabel` for display.
APTITUDE_ENGINE_DOMAIN = {
    "Numerical Reasoning": "Numerical",
    "Data Interpretation": "Numerical",
    "Logical Deduction": "Logical",
    "Coding-Decoding": "Logical",
    "Verbal Classification": "Verbal",
    "Verbal Analogy": "Verbal",
    "Spatial Reasoning": "Spatial",
    "Abstract Reasoning": "Abstract",
    "Attention to Detail": "Attention to Detail",
    "Mechanical Reasoning": "Mechanical",
}

# The scorer weights items easy 1 / medium 2 / hard 3, so a flat "medium"
# throws that away. Graded by what the item actually demands.
APTITUDE_DIFFICULTY = {
    "Q13": "easy", "Q14": "easy", "Q15": "easy", "Q16": "medium", "Q17": "hard",
    "Q18": "easy", "Q19": "hard", "Q20": "hard", "Q21": "medium", "Q22": "medium",
}

APTITUDE_DROPPED = [
    ("item 16 — bicycle at 12 km/h for 30 minutes", "Applied Math; duplicates the numerical dimension."),
    ("item 20 — drip irrigation, direct cause", "Statement & Cause; cut only because the count caps at 10."),
    ("second block item 11 — wildlife reserve, 480 animals", "Numerical Reasoning duplicate."),
    ("second block item 12 — business earns ₹25,000, 20% more", "Financial Reasoning; overlaps Q13."),
    ("second block item 13 — football team, 3 goals per match", "Numerical Reasoning duplicate."),
]

# =========================================================================== #
# 3. PERSONALITY — Q23-Q34, rewritten as forced choices.
#
# Option E was "None of these" on all twelve items: it scored nothing, it was
# visibly the throwaway, and it left 13 of the 60 options dead. The rest were
# shorthand notes rather than sentences, and nothing cost anything. Every item
# now offers five real positions with a downside each.
# See finalised_set_2026_personality_v2.py for the full rationale.
# =========================================================================== #
from finalised_set_2026_personality_v2 import (  # noqa: E402
    PERSONALITY, NOTE as PERSONALITY_NOTE,
)

# =========================================================================== #
# 4. STRENGHTS — Q35-Q42, rebuilt as a working-style instrument.
#
# The supplied section varied the SUBJECT (tech / health / agri / law) while the
# action stayed constant, so it re-measured career interest and duplicated
# Q1-Q12; and half its options were prefixed with their own category, which told
# the student what each one scored. Rebuilt so each item is one scenario and the
# five options are different ways of responding to it, each carrying a cost.
# See finalised_set_2026_strengths_v2.py for the full rationale.
# =========================================================================== #
from finalised_set_2026_strengths_v2 import (  # noqa: E402
    STRENGTHS, WEIGHTS as STRENGTHS_WEIGHTS, DOMAINS as STRENGTHS_DOMAINS,
    GROUPS as STRENGTHS_GROUPS, ROLLUP as STRENGTHS_ROLLUP, NOTE as STRENGTHS_NOTE,
)

STRENGTHS_DROPPED = [
    ("all 8 supplied items", "Replaced wholesale: they varied by subject, not working style, so the section "
                             "duplicated the Interests scale rather than adding a second signal."),
]

# =========================================================================== #
# 5. MOTIVATORS — Q43-Q47, rewritten as trade-offs.
#
# "Solve a problem faced by people or society" sat against three neutral
# alternatives — the answer a 15-year-old knows an adult wants. Option order was
# also fixed on every item, so answering by position produced a clean false
# profile, and these were the longest options left in the exam.
# See finalised_set_2026_motivators_v2.py for the full rationale.
# =========================================================================== #
from finalised_set_2026_motivators_v2 import (  # noqa: E402
    MOTIVATORS, WEIGHTS as MOTIVATOR_WEIGHTS, DOMAINS as MOTIVATOR_DOMAINS,
    NOTE as MOTIVATORS_NOTE,
)

# =========================================================================== #
# 6. LEARNING STYLES — Q48-Q51: the sheet's items 2, 7, 10 and 11, which are the
#    four that match the live bank's constructs. Options A-D verbatim; E added.
# =========================================================================== #
LEARNING_STYLES_ORDER = ["Visual", "Auditory", "Reading/Writing", "Kinesthetic", "Multimodal"]

LEARNING = [
    ("Q48", "When learning a hard math formula, I like to",
     ["See charts/shapes", "Listen to explanation", "Write down step by step to understand",
      "Practice problems until I understand", "Work through a solved example first, then try one myself"],
     "Engineering, Research, Healthcare, Education, Design", "Engineer, Scientist, Doctor, Teacher, Designer",
     CLIENT + " item 2"),
    ("Q49", "When studying for a big final exam, I prefer to:",
     ["Look at colorful mind-maps or diagrams.", "Join a study group to discuss topics out loud.",
      "Reread chapters and write summaries", "Use hands-on practice methods",
      "Test myself on past questions and fix whatever I get wrong"],
     "All career clusters — study-approach indicator",
     "Supports learning approach in Engineering, Medicine, Business, Arts, Research", CLIENT + " item 10"),
    ("Q50", "When learning a new hobby, I prefer to:",
     ["Watch video guides", "Have someone explain it", "Read online articles on it", "Try it by doing",
      "Copy someone doing it step by step until it clicks"],
     "Technology, Creative Fields, Entrepreneurship, Technical Careers",
     "Programmer, Designer, Entrepreneur, Engineer, Technician", CLIENT + " item 7"),
    ("Q51", "You are exploring different career options for your future. How would you prefer to learn about them?",
     ["Watch videos of professionals at work.", "Attend talks and meet counsellors directly.",
      "Read guides and articles about professions.", "Visit workplaces or try internships hands-on.",
      "Spend a day shadowing someone and judge it from how it felt"],
     "Career exploration across all domains",
     "Doctor, Engineer, Lawyer, Entrepreneur, Scientist, Designer, Manager", CLIENT + " item 11"),
]

LEARNING_DROPPED = [
    ("item 9 — 'At home, I am easily distracted by:'",
     "Not a VARK item — it is a distraction inventory, and option C (phone texts) has nothing to do with "
     "Reading/Writing. Would have been cut on quality even if the count allowed it."),
    ("items 1, 3, 4, 5, 6, 8", "Valid items, cut only because the count caps at 4."),
]

# =========================================================================== #
# 7. MULTIPLE INTELLLIGENCE — Q52-Q55, verbatim. The one section the sheet
#    supplies complete: 5 options with intelligence, cluster and profession maps.
# =========================================================================== #
MI_ORDER = ["Logical-Mathematical", "Visual-Spatial", "Linguistic / Interpersonal",
            "Intrapersonal", "Bodily-Kinesthetic"]
MI_POINTS = [
    {"Logical–Mathematical": 3, "Spatial": 1},
    {"Spatial": 3, "Logical–Mathematical": 1},
    {"Linguistic": 3, "Interpersonal": 2},
    {"Intrapersonal": 3, "Logical–Mathematical": 1},
    {"Bodily–Kinesthetic": 3, "Spatial": 1},
]

MI = [
    ("Q52", "Your teacher introduces a completely new topic in class. Which approach helps you understand it the fastest?",
     ["Understand the logic and steps behind it.", "Look at diagrams, charts, or visual examples.",
      "Listen carefully and discuss it with others.",
      "Think about it quietly and relate it to what I already know.",
      "Try a practical activity or experiment myself."],
     "STEM & Technology, Design, Education, Research, Healthcare",
     "Engineer, Architect, Teacher, Scientist, Surgeon"),
    ("Q53", "You have to remember an important lesson for next week's test. What do you naturally rely on?",
     ["Recognize patterns and understand how ideas connect.", "Picture the page, diagram, or image in my mind.",
      "Explain the lesson aloud or discuss it with someone.",
      "Connect the lesson to my own experiences or thoughts.", "Practise or apply what I learned."],
     "Engineering, Media, Psychology, Healthcare",
     "Data Scientist, Journalist, Psychologist, Physiotherapist"),
    ("Q54", "You receive a kit with no demonstration to learn a new activity. How do you begin?",
     ["Read the instructions and understand the sequence.", "Look at the illustrations before starting.",
      "Ask questions or discuss how it works.", "Think through the process before beginning.",
      "Start using it and learn through trial and practice."],
     "Engineering, Architecture, Technical Careers, Research",
     "Engineer, Architect, Product Designer, Technician"),
    ("Q55", "After learning something difficult, how do you know you've really understood it?",
     ["I can explain the reasoning behind it.", "I can visualize or sketch it clearly.",
      "I can explain it confidently to someone else.", "I can connect it with things I've learned before.",
      "I can use it correctly in a real task or activity."],
     "STEM, Design, Education, Healthcare", "Scientist, Graphic Designer, Teacher, Doctor"),
]

# =========================================================================== #
# 8. EMOTIONAL INTELLIGENCE — Q56-Q60, the sheet's items 1-5, verbatim.
#    Options A-E map positionally onto the five EQ domains (the sheet's own
#    column headers).
# =========================================================================== #
EI_ORDER = ["Self-Awareness", "Self-Regulation", "Self-Motivation", "Empathy", "Relationship Management"]

EI = [
    ("Q56", "Your teacher says your performance needs improvement. What would you most likely do?",
     ["Identify where I went wrong.", "Stay calm and avoid getting discouraged.",
      "Set a goal to improve next time.", "Understand the teacher's expectations.",
      "Ask for detailed feedback and guidance."],
     "Emotional Awareness", "MSCEIT + Goleman",
     "Education, Healthcare, Business, Leadership, Public Service", "Scientist, Teacher, Entrepreneur, Manager"),
    ("Q57", "Your preparation for an important competition is not going as planned. What would you do?",
     ["Recognize what is slowing me down.", "Stay calm and adjust my routine.",
      "Work harder with a fresh plan.", "Learn from teammates' experiences.",
      "Discuss strategies with mentors or friends."],
     "Emotional Regulation", "MSCEIT + Bar-On",
     "Sports, Business, Engineering, Research", "Doctor, Defence Officer, Engineer, Project Manager"),
    ("Q58", "A close friend performs poorly in an exam and feels upset. What would you do?",
     ["Think about how I would feel in that situation.", "Stay patient and avoid judging them.",
      "Encourage them to keep trying.", "Listen carefully before giving advice.",
      "Help them prepare for the next exam."],
     "Empathy & Social Awareness", "MSCEIT + Goleman",
     "Psychology, Education, Healthcare, HR", "Doctor, Teacher, Counsellor, Psychologist"),
    ("Q59", "Two classmates strongly disagree during a group project. What would you naturally do?",
     ["Reflect before sharing my opinion.", "Remain calm during the discussion.",
      "Focus on completing the task successfully.", "Listen to both viewpoints fairly.",
      "Help the team reach a solution together."],
     "Relationship Management", "Goleman + Genos",
     "Management, Law, Public Administration", "Manager, Lawyer, Consultant, IAS Officer"),
    ("Q60", "Your plans suddenly change because of an unexpected situation. How do you respond?",
     ["Understand how the change affects me.", "Accept the situation calmly.",
      "Look for a new opportunity.", "Consider how it affects others too.",
      "Work with others to adjust the plan."],
     "Adaptability & Resilience", "Bar-On + Genos",
     "Business, Defence, Healthcare, Technology", "Entrepreneur, Product Manager, Consultant, Business Leader"),
]

EI_DROPPED = [
    ("items 6-10 — praise for shared work; unexpected criticism; little time left; new student; after a hard task",
     "Valid items, cut only because the count caps at 5. Items 1-5 were kept because they line up one-to-one "
     "with the live bank's Q56-Q60 dimensions."),
]

EI_NOTE = (
    "Scoring model. Every option on every item is a healthy response naming a DIFFERENT EQ domain, so there is "
    "no weak answer to score against and no defensible EQ level. The engine therefore counts which domain the "
    "student reaches for and reports a PROFILE; the EQ percentage is left null rather than publishing an "
    "out-of-100 figure off one observation per domain. This replaces the live bank's graded 3/2/2/1 model."
)

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
    "Learning styles": "VARK — Visual, Auditory, Reading/Writing, Kinesthetic, Multimodal",
    "multiple intellligence": "Logical, Visual-Spatial, Linguistic/Interpersonal, Intrapersonal, Bodily-Kinesthetic",
    "emotional intelligence": "Self-Awareness, Self-Regulation, Self-Motivation, Empathy, Relationship Management",
}

INTERESTS_SHORTFALL = (
    "The sheet supplies 10 interests questions; the old count is 12. Q11 and Q12 therefore keep the questions "
    "already live in the bank, marked 'kept from live bank' in the Source column. Send two more in the sheet's "
    "5-family format and they will replace those slots."
)

# =========================================================================== #
# 1. INTERESTS — Q1-Q12.  Text and options verbatim from the sheet.
#    (option text, cluster letter, career matches [the sheet's own], RIASEC weights [added])
# =========================================================================== #
INTERESTS = [
    ("Q1", "Your school is organizing a District level Community Fair. Which role would you naturally pick?", [
        ("Diagnose community health issues and suggest remedies", "C",
         "Health & Medical / Allied Health: Doctor, Nurse, Physiotherapist, Pharmacist", {"S": 3, "I": 2}),
        ("Build a tech device, software, or mechanical solution.", "B",
         "Engineering & Tech: Software Developer, Mechanical Engineer, Robotics Engineer", {"R": 3, "I": 2}),
        ("Research local laws, policies, and present solutions to officials", "F",
         "Law & Public Policy: Lawyer, Civil Servant (IAS), Policy Analyst, Mediator", {"E": 2, "S": 2, "I": 1}),
        ("Create posters, films, and branding for the fair", "D",
         "Arts, Media & Design: Graphic Designer, Filmmaker, Journalist, Content Creator", {"A": 3, "E": 1}),
        ("Manage stall budgets, sponsorship money, and resource logistics.", "E",
         "Business, Finance & Mgmt: Chartered Accountant, Financial Analyst, Operations Mgr", {"C": 3, "E": 2}),
    ], CLIENT, ""),
    ("Q2", "If you could shadow an expert for a week during your summer break, who would you choose?", [
        ("A surgeon performing complex medical procedures or lab research.", "C",
         "Health & Medical: Surgeon, Medical Researcher, Pathologist, Biomedical Scientist", {"I": 3, "S": 2}),
        ("An agronomist working on organic farming and crop genetics.", "G",
         "Agriculture & Allied Sciences: Agronomist, Food Technologist, Environmental Scientist", {"R": 3, "I": 2}),
        ("A corporate lawyer negotiating major international business deals.", "F",
         "Law & Commerce: Corporate Lawyer, Legal Consultant, Compliance Officer", {"E": 3, "C": 1}),
        ("An animator or creative director producing a feature film.", "D",
         "Arts & Design: Animator, Game Designer, Fashion Designer, Art Director", {"A": 3}),
        ("A startup founder pitching to investors and building a company.", "E",
         "Business & Entrepreneurship: Founder/CEO, Venture Capitalist, Product Manager", {"E": 3, "A": 1}),
    ], CLIENT, ""),
    ("Q3", "Your town is setting up a new Model Village Project. Where would you make the biggest impact?", [
        ("Set up free health screening camps and wellness awareness.", "C",
         "Health & Allied Health: Community Health Specialist, Nutritionist, Public Health Mgr", {"S": 3, "I": 1}),
        ("Install modern irrigation, soil testing, and sustainable farming systems.", "G",
         "Agriculture & Earth Sciences: Agricultural Engineer, Soil Scientist, Forester", {"R": 3, "I": 1}),
        ("Construct smart bridges, renewable energy grids, and water systems.", "A",
         "Engineering: Civil Engineer, Renewable Energy Specialist, Electrical Engineer", {"R": 3, "I": 2}),
        ("Archive local history, write village stories, and preserve regional art.", "D",
         "Humanities & Social Sciences: Historian, Anthropologist, Writer, Sociologist", {"A": 3, "I": 1}),
        ("Set up micro-finance banks and manage project budgets.", "E",
         "Finance & Banking: Investment Banker, Microfinance Officer, Risk Analyst", {"C": 3, "E": 2}),
    ], CLIENT, ""),
    ("Q4", "For your Class 10 annual exhibition, which project topic would you be most eager to lead?", [
        ("Studying human anatomy, genetics, or disease prevention methods.", "C",
         "Medical & Life Sciences: Physician, Geneticist, Microbiologist, Biotechnologist", {"I": 3, "S": 1}),
        ("Building an automated solar tracker or smart home automation kit.", "B",
         "Engineering & AI: AI Engineer, Electronics Engineer, Energy Systems Engineer", {"R": 3, "I": 2}),
        ("Debating constitutional rights, international relations, or student laws.", "F",
         "Law, Politics & Humanities: Criminal Lawyer, Diplomat, Political Analyst, Advocate", {"E": 2, "S": 2}),
        ("Displaying fine arts, photography, digital illustration, or set design.", "D",
         "Arts & Creative Fields: Fine Artist, Photographer, Interior Designer, Illustrator", {"A": 3}),
        ("Running a live stock-market simulation or business pitch deck.", "E",
         "Business & Economics: Economist, Stock Broker, Marketing Manager, Business Analyst", {"E": 3, "C": 2}),
    ], CLIENT, ""),
    ("Q5", "If you were given ₹10,000 to launch a student-led initiative, what would you fund?", [
        ("Rehabilitation equipment or mental health therapy sessions for peers.", "C",
         "Allied Health & Psychology: Clinical Psychologist, Occupational Therapist, Speech Therapist", {"S": 3, "I": 1}),
        ("Vertical hydroponic kits or organic seed beds for your school garden.", "G",
         "Agriculture & Food Tech: Food Scientist, Horticulturist, Agricultural Businessman", {"R": 3, "I": 1}),
        ("A mobile coding lab or 3D printing setup for young inventors.", "B",
         "Tech & Hardware: Hardware Engineer, Software Architect, Mechatronics Specialist", {"I": 3, "R": 2}),
        ("A theatre production, podcast studio, or school newspaper magazine.", "D",
         "Media, Journalism & Arts: Journalist, Theatre Director, Radio Jockey, Copywriter", {"A": 3, "E": 1}),
        ("An e-commerce store reselling handmade goods to earn profit.", "E",
         "Commerce & Management: E-commerce Manager, Sales Director, Financial Planner", {"E": 3, "C": 2}),
    ], CLIENT, ""),
    ("Q6", "Which type of books, documentary channels, or podcasts capture your attention most?", [
        ("Medical breakthroughs, human brain mysteries, or emergency ER stories.", "C",
         "Health & Medical Sciences: Neuroscientist, Doctor, Radiologist, Anesthetist", {"I": 3, "S": 1}),
        ("Wildlife conservation, forest ecosystems, and sustainable agriculture.", "G",
         "Environment & Agriculture: Wildlife Biologist, Zoologist, Environmental Lawyer", {"I": 3, "R": 2}),
        ("Space exploration, coding tutorials, and advanced robotics breakthroughs.", "B",
         "Science & Technology: Astrophysicist, Data Scientist, Cybersecurity Analyst", {"I": 3, "R": 2}),
        ("Crime thrillers, courtroom dramas, philosophy, and history podcasts.", "F",
         "Law, Criminology & Arts: Criminologist, Judge, Legal Journalist, Philosopher", {"A": 2, "S": 1, "E": 1}),
        ("Case studies on Fortune 500 companies, stock markets, and economics.", "E",
         "Business & Finance: Business Consultant, Chartered Accountant (CA), CFA, Auditor", {"E": 3, "C": 2}),
    ], CLIENT, ""),
    ("Q7", "During a crisis like a sudden epidemic in a school hostel, what is your instinct?", [
        ("Administer first aid, isolate the sick, and monitor physical symptoms.", "C",
         "Medical & Emergency Health: Emergency Doctor, Epidemiologist, Paramedic", {"S": 3, "R": 1}),
        ("Comfort anxious students, offer counseling, and boost team morale.", "F",
         "Psychology & Human Resources: Counselor, Psychologist, HR Manager, Social Worker", {"S": 3, "A": 1}),
        ("Study health guidelines, ensure legal protocols, and enforce safety rules.", "F",
         "Law & Administration: Hospital Administrator, Compliance Officer, Civil Servant", {"C": 3, "S": 1}),
        ("Create clear infographics and announcements to keep everyone informed.", "D",
         "Design & Communication: PR Specialist, Communications Mgr, Visual Designer", {"A": 3, "E": 1}),
        ("Audit food/water supplies, manage logistics, and secure needed funds.", "E",
         "Operations & Supply Chain: Supply Chain Manager, Procurement Officer, Logistics Head", {"C": 3, "E": 2}),
    ], CLIENT,
     "Options B and C both map to Human & Public Services, so two of the five choices give the same cluster "
     "signal and no Science/Agriculture option is offered. Left as supplied — scoring reads the per-option "
     "cluster tag, so it still works, but this item measures four families rather than five."),
    ("Q8", "What kind of practical problem would you feel most proud to solve in your career?", [
        ("Finding affordable cures or treatments for rare diseases.", "C",
         "Medical Research: Pharmacologist, Oncologist, Genetic Researcher", {"I": 3, "S": 2}),
        ("Improving crop yields to tackle hunger without harming the soil.", "G",
         "Agriculture Science: Soil Chemist, Plant Breeder, Agricultural Economist", {"R": 3, "I": 2}),
        ("Designing cleaner engines, faster computers, or automated systems.", "A",
         "Core Engineering: Automobile Engineer, Computer Engineer, Chemical Engineer", {"R": 3, "I": 2}),
        ("Defending human rights, fighting injustice, or reforming laws.", "F",
         "Legal & Social Services: Human Rights Lawyer, Judge, NGO Leader, Policy Maker", {"S": 3, "E": 2}),
        ("Restructuring an struggling business to make it highly profitable.", "E",
         "Corporate Management: Management Consultant, Chief Financial Officer (CFO), Strategist", {"E": 3, "C": 2}),
    ], CLIENT, "Option E reads 'an struggling business' in the sheet. Left as supplied — a one-word typo fix."),
    ("Q9", "What kind of work environment sounds most appealing to you long-term?", [
        ("A modern hospital, clinical lab, or emergency medical center.", "C",
         "Health Sciences: Physician, Clinical Researcher, Surgeon, Medical Technologist", {"S": 3, "I": 2}),
        ("Outdoor fields, greenhouses, research farms, or natural reserves.", "G",
         "Agriculture & Earth: Forester, Environmental Consultant, Agricultural Scientist", {"R": 3, "I": 1}),
        ("A modern tech hub, engineering workshop, or R&D lab.", "B",
         "Engineering & Tech: Software Engineer, Mechanical Engineer, Robotics Researcher", {"R": 3, "I": 3}),
        ("A courtroom, law firm, media studio, or publishing house.", "F",
         "Law & Creative Arts: Advocate, Journalist, Editor, Creative Director", {"A": 2, "E": 2, "S": 1}),
        ("A corporate boardroom, stock exchange floor, or financial firm.", "E",
         "Business & Finance: Investment Banker, Equity Analyst, Corporate Executive", {"E": 3, "C": 3}),
    ], CLIENT,
     "Option D names both Law and Creative Arts, so a student picking it is ambiguous between clusters F and D. "
     "Left as supplied and tagged F; split the option if you want a clean signal."),
    ("Q10", "If you could take a specialized elective course next term, which would you pick?", [
        ("Human Physiology, Nutrition, and Clinical Health Basics.", "C",
         "Health & Allied Sciences: Dietitian, Physiotherapist, Sports Medicine Specialist", {"I": 3, "S": 2}),
        ("Environmental Science, Crop Care, and Biotechnology.", "G",
         "Life Sciences & Agriculture: Botanist, Biotechnologist, Agronomist", {"I": 3, "R": 2}),
        ("Python Programming, Electronics, and Applied Mathematics.", "B",
         "Engineering & Analytics: Data Analyst, Software Engineer, Electrical Engineer", {"I": 3, "R": 2}),
        ("World History, Constitutional Law, and Creative Writing.", "F",
         "Law & Humanities: Historian, Political Scientist, Journalist, Legal Scholar", {"A": 3, "S": 1}),
        ("Financial Accounting, Entrepreneurship, and Business Marketing.", "E",
         "Commerce & Management: Accountant, Marketing Strategist, Finance Manager", {"C": 3, "E": 3}),
    ], CLIENT, ""),
    # -- Q11 and Q12: no replacement supplied. The live bank's questions stay.
    ("Q11", "A company offers ten students a one-month paid internship. Which team would you ask to join?", [
        ("The team working out why the product keeps failing.", "B",
         "Research Scientist, AI Engineer, Software Engineer", {"I": 3, "R": 2}),
        ("The team redesigning how the product looks and feels.", "D",
         "Architect, UX Designer, Graphic Designer", {"A": 3}),
        ("The team training new users and answering their questions.", "F",
         "Teacher, Psychologist, Lawyer", {"S": 3, "E": 3}),
        ("The team tracking costs, stock and delivery schedules.", "E",
         "Business Manager, Chartered Accountant, Operations Manager", {"C": 3, "E": 3}),
        ("The team testing whether the product is safe for people to use.", "C",
         "Clinical Research Associate, Pharmacologist, Quality & Safety Officer", {"I": 3, "C": 2}),
    ], KEPT, INTERESTS_SHORTFALL),
    ("Q12", "Your school is starting a student-run magazine and website. Which role would you take?", [
        ("Research the stories, check the facts, and build the website.", "B",
         "Software Engineer, Data Analyst, Research Scientist", {"I": 3, "R": 2}),
        ("Design the layout, illustrations, photographs, and cover art.", "D",
         "Graphic Designer, Animator, Product Designer", {"A": 3}),
        ("Interview people, build the writing team, and reply to readers.", "F",
         "Teacher, Lawyer, Psychologist", {"S": 3, "E": 2}),
        ("Handle advertising, budgets, and the publishing schedule.", "E",
         "Business Manager, Financial Analyst, Digital Marketer", {"C": 3, "E": 2}),
        ("Cover the health, fitness and wellbeing section for students.", "C",
         "Health Journalist, Public Health Educator, Medical Writer", {"S": 2, "A": 2, "I": 1}),
    ], KEPT, INTERESTS_SHORTFALL),
]

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

APTITUDE_DROPPED = [
    ("item 16 — bicycle at 12 km/h for 30 minutes", "Applied Math; duplicates the numerical dimension."),
    ("item 20 — drip irrigation, direct cause", "Statement & Cause; cut only because the count caps at 10."),
    ("second block item 11 — wildlife reserve, 480 animals", "Numerical Reasoning duplicate."),
    ("second block item 12 — business earns ₹25,000, 20% more", "Financial Reasoning; overlaps Q13."),
    ("second block item 13 — football team, 3 goals per match", "Numerical Reasoning duplicate."),
]

# =========================================================================== #
# 3. PERSONALITY — Q23-Q34, verbatim. Trait/facet and per-option Big Five
#    weights added (the sheet carries no mapping columns at all).
# =========================================================================== #
PERSONALITY = [
    ("Q23", "One weekend to prep a project on an unfamiliar topic; by Saturday evening still have several directions. What would you most likely do?",
     [("Most unusual idea, even if risky", {"O": 3}),
      ("Clearest, idea most reliable approach", {"C": 3}),
      ("Discuss options with classmates", {"E": 2, "A": 2}),
      ("Combine ideas from different sources", {"O": 3, "C": 1}),
      ("None of these", {})],
     "Openness", "Curiosity", "Option B reads 'Clearest, idea most reliable approach' — a stray word. Left as supplied."),
    ("Q24", "School exhibition, must choose one project. Which would you most enjoy building?",
     [("Challenges conventional thinking", {"O": 3}),
      ("Carefully planned, tested project", {"C": 3}),
      ("Interactive, participatory project", {"E": 3, "A": 2}),
      ("Visually creative project", {"O": 3, "A": 1}),
      ("None of these", {})],
     "Openness", "Creativity", ""),
    ("Q25", "Assignment due in two weeks, but an unexpected event cuts your study days. What would you most likely do?",
     [("Adjust schedule, follow revised plan", {"C": 3, "S": 1}),
      ("Rethink best approach before restarting", {"O": 2, "C": 1}),
      ("Work longer hours to catch up", {"C": 2, "S": 1}),
      ("Study with others to stay on track", {"E": 2, "A": 2}),
      ("None of these", {})],
     "Conscientiousness", "Planning", ""),
    ("Q26", "After an hour studying a hard chapter, still don't understand it. What usually happens next?",
     [("Try a different study method", {"O": 2, "C": 1}),
      ("Take a break, return later", {"S": 2}),
      ("Ask someone to explain", {"E": 2, "A": 1}),
      ("Keep practicing despite unclear theory", {"C": 3}),
      ("None of these", {})],
     "Conscientiousness", "Persistence", ""),
    ("Q27", "Halfway through organizing a school event, several problems appear at once. Which role do you take?",
     [("Keep everything organized", {"C": 3}),
      ("Suggest new ideas/solutions", {"O": 3}),
      ("Keep everyone coordinated & motivated", {"E": 3, "A": 2}),
      ("Tackle the most urgent problem first", {"S": 3, "C": 1}),
      ("None of these", {})],
     "Conscientiousness", "Responsibility", ""),
    ("Q28", "Arrive early for a workshop; most students already talking. What would you most likely do?",
     [("Join conversation naturally", {"E": 3, "A": 1}),
      ("Observe before joining", {"C": 1, "O": 1}),
      ("Talk if shared interests noticed", {"E": 2, "A": 1}),
      ("Wait to be included", {}),
      ("None of these", {})],
     "Extraversion", "Initiative",
     "Facet recorded as Initiative rather than the old set's Confidence: this scenario is about starting a "
     "conversation, which keeps it distinct from Q29."),
    ("Q29", "Joined a new class for a semester. By end of first week, what's most likely true?",
     [("Already introduced myself to many", {"E": 3, "A": 2}),
      ("Spoke mainly when needed", {"C": 2}),
      ("Connected with a few similar people", {"E": 2, "A": 2}),
      ("Focused on settling in first", {"C": 2}),
      ("None of these", {})],
     "Extraversion", "Social Interaction", ""),
    ("Q30", "During a team activity, two members disagree on how to complete work. What would you naturally do?",
     [("Help both sides understand each other", {"A": 3, "S": 1}),
      ("Combine strongest parts of both ideas", {"A": 2, "O": 2}),
      ("Let group decide, focus on own task", {"C": 2}),
      ("Choose most practical option", {"C": 2, "S": 1}),
      ("None of these", {})],
     "Agreeableness", "Cooperation",
     "Facets are the reverse of the old set here: old Q30 measured Empathy, old Q31 Cooperation. Mapped to match "
     "the sheet's scenarios."),
    ("Q31", "A teammate is falling behind, deadline approaching. What feels most natural?",
     [("Support them, encourage their own effort", {"A": 3, "S": 1}),
      ("Adjust plan for fair contribution", {"A": 2, "C": 2}),
      ("Finish part of task to help team", {"A": 2, "C": 2}),
      ("Focus on own responsibilities first", {"C": 2}),
      ("None of these", {})],
     "Agreeableness", "Empathy", "See Q30 — facets swapped relative to the old set."),
    ("Q32", "Result is much lower than expected after working hard. What would you most likely do next?",
     [("Review mistakes, adjust approach", {"S": 3, "C": 2}),
      ("Ask for feedback", {"S": 2, "A": 1, "E": 1}),
      ("Take a short break, restart", {"S": 2}),
      ("Accept result, keep working steadily", {"S": 1, "C": 1}),
      ("None of these", {})],
     "Emotional Stability", "Emotional Control", ""),
    ("Q33", "Just before presenting, realize an important part is missing. First reaction?",
     [("Quickly find another way to explain", {"S": 3, "O": 1}),
      ("Pause, understand, then continue", {"S": 3, "C": 2}),
      ("Ask someone nearby for help", {"A": 2, "E": 2, "S": 1}),
      ("Continue and adapt as needed", {"S": 2, "C": 1}),
      ("None of these", {})],
     "Emotional Stability", "Composure", ""),
    ("Q34", "Four internship offers with same salary/growth. Which would you most enjoy?",
     [("Learn something completely new", {"O": 3, "C": 2}),
      ("Create original ideas/designs/solutions", {"O": 3, "E": 1}),
      ("Work closely with people, help teams", {"E": 3, "A": 3}),
      ("Improve systems, boost efficiency", {"C": 3, "S": 1}),
      ("None of these", {})],
     "Integrated Big Five", "Overall Personality Profile", ""),
]

PERSONALITY_NOTE = (
    "Option E is 'None of these' on all 12 items and scores nothing. The engine treats it as an ABSTENTION "
    "(abstainIndex = 4): the item drops out of that student's denominator instead of deflating every trait, and "
    "if more than half the items are abstained the Big Five profile is suppressed rather than published as a "
    "near-zero. Note also that the options are written as shorthand rather than full sentences — they read as "
    "internal notes and are worth expanding before a Class 9-10 student sees them."
)

# =========================================================================== #
# 4. STRENGHTS — Q35-Q42, the sheet's first 8. Options A-D verbatim; E added.
#    The sheet's own taxonomy is kept; the engine-domain column is derived from
#    each option's ACTION, and is approximate (see STRENGTHS_NOTE).
# =========================================================================== #
STRENGTHS = [
    ("Q35", "Your school is leading a District Youth Summit. Which track do you choose to direct?",
     [("Smart Tech & AI: Coding automation tools or robotics exhibits.", "Technical", {"Analytical": 3, "Execution": 1}, CLIENT),
      ("Health & Bio-Care: Demonstrating medical diagnostic tools & first-aid.", "Medical", {"Relationship": 3, "Analytical": 1}, CLIENT),
      ("Eco-Agri Solutions: Setting up hydroponic farming & soil tests.", "Environmental", {"Execution": 3, "Learning": 1}, CLIENT),
      ("Law & Public Policy: Hosting mock parliament & debating policies.", "Legal/Policy", {"Communication": 3, "Leadership": 1}, CLIENT),
      ("Media & Design: Producing the summit's films, posters and live coverage.", "Creative/Media", {"Creative": 3, "Communication": 1}, ADDED)],
     "Technical, Medical, Environmental, Legal/Policy",
     "STEM & AI, Health & Life Sciences, Agriculture & Earth Sciences, Law & Public Service",
     "Software Engineer, Medical Doctor, Agricultural Engineer, Lawyer / IAS Officer"),
    ("Q36", "A local neighborhood faces severe water logging and waste management issues. What is your first step?",
     [("Build a smart sensor prototype to monitor drainage flow.", "Engineering", {"Analytical": 3, "Execution": 1}, CLIENT),
      ("Conduct water purity & health risk testing for residents.", "Clinical/Bio-Health", {"Analytical": 3, "Learning": 1}, CLIENT),
      ("Draft a legal petition & campaign to municipal authorities.", "Advocacy/Legal", {"Communication": 3, "Leadership": 1}, CLIENT),
      ("Launch a local micro-funded recycling business model.", "Financial/Business", {"Leadership": 3, "Execution": 1}, CLIENT),
      ("Run an awareness drive with posters, films and street theatre.", "Creative/Media", {"Creative": 3, "Communication": 1}, ADDED)],
     "Engineering, Clinical/Bio-Health, Advocacy/Legal, Financial/Business",
     "Core Engineering, Public Health, Law & Governance, Commerce & Business",
     "Civil Engineer, Epidemiologist, Environmental Lawyer, Business Manager"),
    ("Q37", "Your school gets funding for one new modern learning facility. Which proposal do you champion?",
     [("Computer & Tech R&D Lab: 3D printers, coding kits, & server gear.", "Analytical", {"Analytical": 3, "Learning": 1}, CLIENT),
      ("Biology & Medical Lab: Advanced microscopes & human anatomy models.", "Diagnostic", {"Analytical": 3, "Learning": 2}, CLIENT),
      ("Greenhouse & Soil Lab: Eco-gardening, crop genetics, & bio-fertilizers.", "Ecological", {"Execution": 3, "Learning": 1}, CLIENT),
      ("Debate & Legal Clinic: Courtroom setup for legal & civic studies.", "Civic/Communicative", {"Communication": 3, "Leadership": 1}, CLIENT),
      ("Media & Design Studio: cameras, editing suites and a design lab.", "Creative/Media", {"Creative": 3, "Execution": 1}, ADDED)],
     "Analytical, Diagnostic, Ecological, Civic/Communicative",
     "Technology, Life Sciences & Medicine, Agriculture, Law & Social Sciences",
     "AI Developer, Biotechnologist, Agronomist, Constitutional Lawyer"),
    ("Q38", "Your class must create a digital platform for Indian students. What primary feature do you design?",
     [("An AI algorithm that solves complex study problems.", "Technical", {"Analytical": 3, "Creative": 1}, CLIENT),
      ("Mental health counselling & wellness tracker tools.", "Psychological", {"Relationship": 3, "Analytical": 1}, CLIENT),
      ("An interactive portal on civic rights, duties, & legal awareness.", "Civic/Legal", {"Communication": 3, "Learning": 1}, CLIENT),
      ("A pocket-money management & micro-investing simulator.", "Financial", {"Execution": 3, "Analytical": 1}, CLIENT),
      ("A creative showcase where students publish art, writing and film.", "Creative/Media", {"Creative": 3, "Communication": 1}, ADDED)],
     "Technical, Psychological, Civic/Legal, Financial",
     "Technology, Allied Health & Psychology, Law & Humanities, Finance & Business",
     "Systems Architect, Clinical Psychologist, Legal Advisor, Financial Planner"),
    ("Q39", "Your team enters an Inter-School Community Project competition. Which role do you pick?",
     [("Mechanical/Tech Lead: Building & repairing hardware tools.", "Mechanical", {"Execution": 3, "Analytical": 1}, CLIENT),
      ("Medical & Wellness Lead: Managing first-aid & health checkups.", "Medical", {"Relationship": 3, "Execution": 1}, CLIENT),
      ("Environmental Lead: Designing tree plantation & soil care plans.", "Environmental", {"Execution": 3, "Creative": 1}, CLIENT),
      ("Strategy & Finance Lead: Budgeting, sponsorship, & pitch decks.", "Strategic/Financial", {"Leadership": 3, "Analytical": 1}, CLIENT),
      ("Communications Lead: documenting the project and presenting it publicly.", "Creative/Media", {"Communication": 3, "Creative": 1}, ADDED)],
     "Mechanical, Medical, Environmental, Strategic/Financial",
     "Engineering & Robotics, Healthcare, Agriculture & Ecology, Commerce & Finance",
     "Mechanical Engineer, Paramedic / Doctor, Forestry Officer, Chartered Accountant (CA)"),
    ("Q40", "If you could shadow a top professional for one week, who would you choose?",
     [("A Lead Developer coding AI applications at a tech giant.", "Analytical/Tech", {"Analytical": 3, "Learning": 2}, CLIENT),
      ("A Surgeon performing precision operations in a hospital.", "Diagnostic/Medical", {"Execution": 3, "Analytical": 2}, CLIENT),
      ("An Agricultural Scientist developing drought-resistant crops.", "Biological/Agri", {"Learning": 3, "Analytical": 1}, CLIENT),
      ("A Corporate Lawyer defending major international clients.", "Logical/Legal", {"Communication": 3, "Analytical": 1}, CLIENT),
      ("A Creative Director running a design and film studio.", "Creative/Media", {"Creative": 3, "Leadership": 1}, ADDED)],
     "Analytical/Tech, Diagnostic/Medical, Biological/Agri, Logical/Legal",
     "STEM & Software, Medical Sciences, Agriculture & Bio-Tech, Law & Corporate Services",
     "Machine Learning Engineer, Surgeon, Agronomist, Corporate Advocate"),
    ("Q41", "Your school newsletter needs a special dedicated column. Which section do you write?",
     [("Tech Byte: Future AI gadgets, coding, & space discoveries.", "Technical", {"Analytical": 3, "Communication": 1}, CLIENT),
      ("Body & Mind: Disease prevention, health tips, & sports nutrition.", "Health/Biological", {"Relationship": 3, "Communication": 1}, CLIENT),
      ("Earth Watch: Climate action, sustainable farming, & wildlife.", "Ecological", {"Learning": 3, "Communication": 1}, CLIENT),
      ("Money & Markets: Stock market basics, saving tips, & startups.", "Financial", {"Analytical": 3, "Leadership": 1}, CLIENT),
      ("Stage & Screen: film, music, design and student creative work.", "Creative/Media", {"Creative": 3, "Communication": 1}, ADDED)],
     "Technical, Health/Biological, Ecological, Financial",
     "Science & Tech, Healthcare, Agriculture & Environment, Business & Economics",
     "Data Scientist, Nutritionist / Physician, Wildlife Biologist, Investment Banker"),
    ("Q42", "A sudden emergency occurs during a school trip. What is your immediate instinct?",
     [("Fix malfunctioning communications or transport gear.", "Technical", {"Execution": 3, "Analytical": 1}, CLIENT),
      ("Provide immediate first-aid & assess physical symptoms.", "Medical", {"Execution": 3, "Relationship": 2}, CLIENT),
      ("Consult rules, safety guidelines, & legal protocols.", "Administrative", {"Analytical": 3, "Execution": 1}, CLIENT),
      ("Manage food/water resources & organize logistics calmly.", "Operations", {"Execution": 3, "Leadership": 1}, CLIENT),
      ("Keep everyone calm and handle communication with the group.", "Interpersonal", {"Relationship": 3, "Communication": 2}, ADDED)],
     "Technical, Medical, Administrative, Operations",
     "Core Engineering, Emergency Medicine, Law & Compliance, Operations & Supply Chain",
     "Operations Engineer, Emergency Doctor, Hospital Administrator, Supply Chain Head"),
]

STRENGTHS_DROPPED = [
    ("₹10,000 social impact project", "Cut only because the count caps at 8."),
    ("long-term problem giving deepest satisfaction", "Cut only because the count caps at 8."),
    ("one elective course for next term", "Cut only because the count caps at 8; overlaps interests Q10."),
    ("48 hours to present a final major project", "Cut only because the count caps at 8."),
]

STRENGTHS_NOTE = (
    "Construct warning. Across all 8 items the options differ by SUBJECT (tech / health / agri / law / finance), "
    "not by working style, and each option is prefixed with its own label, which tells the student what it "
    "measures. That makes this section a second career-interest scale rather than a strengths scale. The "
    "'Strength Domain (engine)' column is DERIVED from each option's action verb so the eight-domain scoring "
    "still runs, but it is approximate — a strengths section normally varies the action (analyse / create / lead "
    "/ organise / persuade) while holding the subject fixed."
)

# =========================================================================== #
# 5. MOTIVATORS — Q43-Q47. Options A-D verbatim; E added.
# =========================================================================== #
MOTIVATORS = [
    ("Q43", "School gives opportunity to select one special project for the entire year. Which would excite you most?",
     [("Challenging project to improve skills and achieve excellent results", {"Achievement": 3, "Innovation": 1, "Learning": 1}, CLIENT),
      ("Create something completely new nobody has tried", {"Innovation": 3, "Achievement": 1, "Impact": 1}, CLIENT),
      ("Solve a problem faced by people or society", {"Impact": 3, "Innovation": 1, "Leadership": 1}, CLIENT),
      ("Lead a team and make key decisions to achieve the goal", {"Leadership": 3, "Achievement": 1, "Impact": 1}, CLIENT),
      ("A well-defined project with clear steps and a dependable result", {"Security": 3, "Achievement": 1}, ADDED)],
     "Engineering, Research, Design, Healthcare, Entrepreneurship, Management",
     "Engineer, Scientist, Doctor, Entrepreneur, Project Manager"),
    ("Q44", "Extra time after school. Which activity would feel most satisfying?",
     [("Practicing a skill to get better at it", {"Achievement": 3, "Learning": 2}, CLIENT),
      ("Exploring new ideas, experimenting creatively", {"Innovation": 3, "Learning": 1}, CLIENT),
      ("Helping someone learn or solve a problem", {"Impact": 3, "Learning": 1}, CLIENT),
      ("Organizing a group activity", {"Leadership": 3, "Achievement": 1}, CLIENT),
      ("Getting ahead on work already scheduled, so nothing piles up", {"Security": 3, "Achievement": 1}, ADDED)],
     "Technology, Education, Healthcare, Business, Creative Fields",
     "Software Engineer, Teacher, Doctor, Designer, Business Leader"),
    ("Q45", "Achieved success in your future career. What would make you most proud?",
     [("Becoming highly skilled, recognized as an expert", {"Achievement": 3, "Learning": 2}, CLIENT),
      ("Creating something innovative that changes how people do things", {"Innovation": 3, "Achievement": 1}, CLIENT),
      ("Making a meaningful difference in people's lives", {"Impact": 3}, CLIENT),
      ("Becoming a leader who influences important decisions", {"Leadership": 3, "Achievement": 1}, CLIENT),
      ("Building a secure, stable career that supports my family well", {"Security": 3, "Impact": 1}, ADDED)],
     "Research, Technology, Healthcare, Social Services, Government",
     "Research Scientist, AI Engineer, Doctor, IAS Officer, Entrepreneur"),
    ("Q46", "School competition where students choose their own challenge. Which would you prefer?",
     [("Difficult challenge to test abilities, compete with others", {"Achievement": 3, "Learning": 1}, CLIENT),
      ("Creative challenge to design something unique", {"Innovation": 3}, CLIENT),
      ("Challenge that helps improve school or community", {"Impact": 3}, CLIENT),
      ("Challenge to coordinate and manage a team", {"Leadership": 3}, CLIENT),
      ("A challenge with clear rules where I know exactly what is expected", {"Security": 3, "Achievement": 1}, ADDED)],
     "Sports, Engineering, Design, Social Impact, Management",
     "Athlete, Engineer, Designer, Social Worker, Manager"),
    ("Q47", "Choosing your future workplace — which environment would motivate you most?",
     [("Continuously learn, improve, achieve bigger goals", {"Learning": 3, "Achievement": 2}, CLIENT),
      ("Freedom to explore ideas and try new approaches", {"Innovation": 3, "Learning": 1}, CLIENT),
      ("Work that helps people, creates positive change", {"Impact": 3}, CLIENT),
      ("Stability, clear systems, structured career path", {"Security": 3}, CLIENT),
      ("A place where I can take charge of a team and be judged on results", {"Leadership": 3, "Achievement": 2}, ADDED)],
     "Research, Entrepreneurship, Healthcare, Education, Finance, Government",
     "Scientist, Startup Founder, Doctor, Teacher, Banker, Civil Servant"),
]

# =========================================================================== #
# 6. LEARNING STYLES — Q48-Q51: the sheet's items 2, 7, 10 and 11, which are the
#    four that match the live bank's constructs. Options A-D verbatim; E added.
# =========================================================================== #
LEARNING_STYLES_ORDER = ["Visual", "Auditory", "Reading/Writing", "Kinesthetic", "Multimodal"]

LEARNING = [
    ("Q48", "When learning a hard math formula, I like to",
     ["See charts/shapes", "Listen to explanation", "Write down step by step to understand",
      "Practice problems until I understand", "Use a mix — see it, talk it through, then practise it"],
     "Engineering, Research, Healthcare, Education, Design", "Engineer, Scientist, Doctor, Teacher, Designer",
     CLIENT + " item 2"),
    ("Q49", "When studying for a big final exam, I prefer to:",
     ["Look at colorful mind-maps or diagrams.", "Join a study group to discuss topics out loud.",
      "Reread chapters and write summaries", "Use hands-on practice methods",
      "Mix diagrams, discussion, notes and practice depending on the subject"],
     "All career clusters — study-approach indicator",
     "Supports learning approach in Engineering, Medicine, Business, Arts, Research", CLIENT + " item 10"),
    ("Q50", "When learning a new hobby, I prefer to:",
     ["Watch video guides", "Have someone explain it", "Read online articles on it", "Try it by doing",
      "Switch between watching, asking, reading and trying as I go"],
     "Technology, Creative Fields, Entrepreneurship, Technical Careers",
     "Programmer, Designer, Entrepreneur, Engineer, Technician", CLIENT + " item 7"),
    ("Q51", "You are exploring different career options for your future. How would you prefer to learn about them?",
     ["Watch videos of professionals at work.", "Attend talks and meet counsellors directly.",
      "Read guides and articles about professions.", "Visit workplaces or try internships hands-on.",
      "Use all of them — videos, talks, reading and a real visit"],
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

#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Career FAMILY roadmaps for the class 11-12 demo.

A family is a set of careers that share the parts of a roadmap that really are
shared. Every engineering career in India goes through JEE; every medical one
through NEET. Repeating that per career would not make the advice more
specific, it would just make it 150 copies to keep in step when a board changes
an exam.

So each career's roadmap = its family base, overlaid with whatever that career
states for itself (see demo_11_12_careers.py). A career that overrides nothing
still gets a complete, accurate roadmap; a career that overrides everything
reads as fully bespoke. Nothing is ever blank.

Fields
------
entranceExams  what to sit and roughly when
afterSchool    the stage-by-stage path from class 12 to working
topColleges    representative institutions, not an exhaustive ranking
coreSkills     what the work actually demands
buildNow       things a class 11-12 student can start THIS year
salary         indicative INR ranges, entry / mid / senior
realityCheck   the honest downside, because a roadmap that only sells is not
               guidance

Figures are indicative for Indian students entering around 2026-2030 and should
be reviewed against current fee, cut-off and salary data before publication.
"""

# Provenance for every figure in this file and in the career files.
#
# These numbers are authored from general knowledge of Indian admissions and
# pay, not read from a live feed of exam calendars, fee schedules or salary
# surveys. That is a real limitation and the report says so to the student
# rather than printing "Rs 6-25 LPA" as though it were measured.
#
# Bump ASOF whenever the figures are reviewed. scripts/export_demo_figures.py
# prints every figure as one table for exactly that review.
FIGURES = {
    "asOf": "2026-08",
    "basis": "Indicative ranges for students entering higher education in India "
             "around 2026-2030, authored from general sector knowledge.",
    "confidence": "Directional. Salary bands vary widely by city, institution "
                  "and employer; treat them as orders of magnitude, not quotes.",
    "reviewNeeded": True,
}

FAMILIES = {
    # ------------------------------------------------------------------ STEM
    "engineering": {
        "label": "Engineering & Technology",
        "entranceExams": [
            {"name": "JEE Main", "when": "Class 12, two sessions (Jan & Apr)",
             "opens": "NITs, IIITs, GFTIs, and most state and private engineering colleges"},
            {"name": "JEE Advanced", "when": "Class 12, after clearing JEE Main cut-off",
             "opens": "The 23 IITs"},
            {"name": "State CETs (MHT-CET, KCET, AP/TS EAMCET, WBJEE)", "when": "Class 12, Apr-May",
             "opens": "State-quota seats, often at much lower fees"},
            {"name": "BITSAT / VITEEE / SRMJEEE / COMEDK", "when": "Class 12, Apr-Jun",
             "opens": "BITS Pilani and the larger private universities"},
        ],
        "afterSchool": [
            {"stage": "B.Tech / B.E.", "years": "4 years", "what": "Core branch, plus internships from year 2 and a final-year project"},
            {"stage": "First role", "years": "Year 4 onward", "what": "Campus placement, or an off-campus route built on a public project portfolio"},
            {"stage": "Optional M.Tech / MS / MBA", "years": "+2 years", "what": "GATE for M.Tech in India, GRE for an MS abroad, CAT for management"},
        ],
        "topColleges": ["IIT Bombay / Delhi / Madras / Kanpur", "BITS Pilani", "NIT Trichy / Surathkal / Warangal",
                        "IIIT Hyderabad", "DTU & NSUT Delhi", "VIT Vellore", "Manipal Institute of Technology"],
        "coreSkills": ["Mathematical reasoning", "Structured problem solving", "Programming fundamentals",
                       "Reading technical documentation", "Working in a team on something that must actually run"],
        "buildNow": [
            "Get genuinely comfortable with Class 11-12 Maths and Physics - every entrance exam is built on them",
            "Learn one programming language properly (Python is the usual first)",
            "Build and finish two small projects; a finished small thing beats an abandoned large one",
            "Enter a science or robotics olympiad or hackathon at least once",
        ],
        "salary": {"entry": "Rs 4-12 LPA", "mid": "Rs 12-30 LPA", "senior": "Rs 30-80 LPA+"},
        "realityCheck": "The branch matters far less than what you build. Engineering placement figures are dominated by a minority who actually made things; a degree alone is no longer a differentiator.",
    },
    "software": {
        "label": "Software & Data",
        "entranceExams": [
            {"name": "JEE Main / Advanced", "when": "Class 12", "opens": "B.Tech CSE at NITs, IIITs and IITs"},
            {"name": "State CETs & BITSAT", "when": "Class 12, Apr-Jun", "opens": "State and private CSE seats"},
            {"name": "CUET-UG", "when": "Class 12, May", "opens": "B.Sc CS / BCA at central universities"},
            {"name": "NPAT / SET / IPU-CET", "when": "Class 12", "opens": "BCA and B.Sc CS at private universities"},
        ],
        "afterSchool": [
            {"stage": "B.Tech CSE, B.Sc CS or BCA", "years": "3-4 years", "what": "Data structures, algorithms, systems; internships from year 2"},
            {"stage": "Portfolio", "years": "Throughout", "what": "Public GitHub, deployed projects, open-source contributions - this is what gets read"},
            {"stage": "First role", "years": "After graduation", "what": "SDE, data analyst or ML engineer; interviews test DSA and system design"},
        ],
        "topColleges": ["IIT Bombay / Delhi / Madras", "IIIT Hyderabad", "BITS Pilani", "NIT Trichy / Surathkal",
                        "DTU & NSUT Delhi", "Chennai Mathematical Institute (for the maths-heavy route)"],
        "coreSkills": ["Data structures & algorithms", "One language, deeply", "Databases and SQL",
                       "Version control (Git)", "Reading other people's code", "Clear written communication"],
        "buildNow": [
            "Start Python or C++ now, not in college - a two-year head start compounds",
            "Solve problems consistently on a judge (LeetCode, Codeforces) rather than in bursts",
            "Ship one thing other people actually use, even a small tool for your class",
            "Learn Git properly; it is assumed and rarely taught",
        ],
        "salary": {"entry": "Rs 6-25 LPA", "mid": "Rs 25-60 LPA", "senior": "Rs 60 LPA-2 Cr+"},
        "realityCheck": "The gap between the top and median software salary is enormous and it is not explained by which college you attended. It tracks how much you actually built.",
    },
    "medical": {
        "label": "Medicine & Health Sciences",
        "entranceExams": [
            {"name": "NEET-UG", "when": "Class 12, May - the single gateway",
             "opens": "MBBS, BDS, BAMS, BHMS, BVSc, Nursing and most allied-health seats"},
            {"name": "AIIMS / JIPMER (now merged into NEET)", "when": "Class 12", "opens": "AIIMS and JIPMER seats via NEET rank"},
            {"name": "State counselling (85% state quota)", "when": "After NEET result", "opens": "State medical colleges at far lower fees"},
        ],
        "afterSchool": [
            {"stage": "MBBS", "years": "5.5 years", "what": "4.5 years of study plus a compulsory rotating internship"},
            {"stage": "NEET-PG", "years": "After MBBS", "what": "The real bottleneck - determines your specialisation"},
            {"stage": "MD / MS residency", "years": "3 years", "what": "Specialisation; then optional DM/MCh super-specialisation"},
        ],
        "topColleges": ["AIIMS New Delhi", "CMC Vellore", "AFMC Pune", "Maulana Azad Medical College",
                        "JIPMER Puducherry", "KGMU Lucknow", "Grant Medical College Mumbai"],
        "coreSkills": ["Biology and chemistry in depth", "Sustained memorisation with understanding",
                       "Emotional steadiness", "Communicating bad news kindly", "Physical stamina for long shifts"],
        "buildNow": [
            "NEET is decided by NCERT Biology mastery - work it line by line rather than through guides",
            "Build the stamina for long study blocks now; the degree is a decade-long endurance event",
            "Volunteer at a hospital or camp to test whether you actually like being around illness",
            "Talk to a resident doctor about their week before committing",
        ],
        "salary": {"entry": "Rs 6-12 LPA (post-MBBS)", "mid": "Rs 12-35 LPA (post-MD)", "senior": "Rs 35 LPA-1 Cr+ (consultant/private practice)"},
        "realityCheck": "It is the longest path in this list - roughly 10-12 years to consultant, on stipends for much of it. Choose it because you want the work, not the title.",
    },
    "allied_health": {
        "label": "Allied Health & Therapy",
        "entranceExams": [
            {"name": "NEET-UG", "when": "Class 12, May", "opens": "Most allied-health degrees at government institutions"},
            {"name": "CUET-UG", "when": "Class 12, May", "opens": "Central-university allied-health and nursing seats"},
            {"name": "Institutional tests (AIIMS, CMC, state paramedical)", "when": "Class 12", "opens": "Direct allied-health admission"},
        ],
        "afterSchool": [
            {"stage": "Bachelor's (BPT, B.Sc Nursing, BMLT, B.Optom)", "years": "3.5-4.5 years", "what": "Includes clinical placement and internship"},
            {"stage": "Registration", "years": "On completion", "what": "State council registration is what lets you practise"},
            {"stage": "Master's or specialisation", "years": "+2 years", "what": "Sports physio, critical care, neuro-rehab and similar"},
        ],
        "topColleges": ["AIIMS New Delhi", "CMC Vellore", "Manipal College of Health Professions", "PGIMER Chandigarh",
                        "NIMHANS Bengaluru", "Armed Forces Medical Services institutions"],
        "coreSkills": ["Applied human anatomy", "Patience across long recoveries", "Hands-on clinical technique",
                       "Explaining a regimen so a patient will follow it", "Record-keeping accuracy"],
        "buildNow": [
            "Biology is the spine of every one of these - do not treat it as the easier science",
            "Shadow a physiotherapist or lab technician for a week",
            "Get comfortable with physical contact and clinical settings; some people find they are not",
        ],
        "salary": {"entry": "Rs 3-7 LPA", "mid": "Rs 7-18 LPA", "senior": "Rs 18-40 LPA+ (private practice highest)"},
        "realityCheck": "Shorter and cheaper than MBBS with real demand, but ceilings in salaried roles are lower. The strongest earners nearly all run their own practice.",
    },
    "sciences": {
        "label": "Pure & Applied Sciences",
        "entranceExams": [
            {"name": "CUET-UG", "when": "Class 12, May", "opens": "B.Sc at Delhi University, BHU, JNU and other central universities"},
            {"name": "IISER Aptitude Test / NEST", "when": "Class 12, Jun", "opens": "IISERs and NISER - the research-track BS-MS"},
            {"name": "ISI Admission Test / CMI Entrance", "when": "Class 12, May", "opens": "Indian Statistical Institute and Chennai Mathematical Institute"},
            {"name": "State university entrances", "when": "Class 12", "opens": "State B.Sc seats"},
        ],
        "afterSchool": [
            {"stage": "B.Sc or BS-MS", "years": "3-5 years", "what": "Lab work from year 1; a research project decides what comes next"},
            {"stage": "M.Sc", "years": "2 years", "what": "Via CUET-PG, JAM or an institutional test"},
            {"stage": "PhD", "years": "4-6 years", "what": "Through CSIR-NET / GATE / institutional interview, usually with a fellowship"},
        ],
        "topColleges": ["IISc Bengaluru", "IISER Pune / Kolkata / Mohali", "NISER Bhubaneswar", "ISI Kolkata",
                        "St Stephen's & Hindu College, Delhi", "Chennai Mathematical Institute", "Fergusson College Pune"],
        "coreSkills": ["Genuine curiosity about mechanism", "Experimental design", "Statistics and data handling",
                       "Scientific writing", "Tolerance for experiments that fail"],
        "buildNow": [
            "Enter NSEP/NSEC/NSEB or the Maths Olympiad - the training is worth more than the medal",
            "Read actual papers, not only textbooks; start with review articles",
            "Try a summer research programme (IAS SRFP, IISER open days)",
            "Learn Python for data analysis - every modern science runs on it",
        ],
        "salary": {"entry": "Rs 3-8 LPA", "mid": "Rs 8-20 LPA", "senior": "Rs 20-50 LPA+ (industry R&D pays best)"},
        "realityCheck": "Academic science pays modestly and takes a decade to a stable post. Industry R&D, data science and quant finance are where science graduates actually earn - and all three are open to you.",
    },
    "agriculture": {
        "label": "Agriculture & Environment",
        "entranceExams": [
            {"name": "ICAR AIEEA-UG", "when": "Class 12, Apr-May", "opens": "Agricultural universities across India"},
            {"name": "State agriculture CETs", "when": "Class 12", "opens": "State agricultural university seats"},
            {"name": "CUET-UG", "when": "Class 12, May", "opens": "Environmental science and allied programmes"},
        ],
        "afterSchool": [
            {"stage": "B.Sc Agriculture / Horticulture / Forestry", "years": "4 years", "what": "Includes a rural work experience programme"},
            {"stage": "M.Sc or MBA (Agribusiness)", "years": "2 years", "what": "IARI, IIM-A's food & agribusiness programme, IRMA"},
            {"stage": "Roles", "years": "After degree", "what": "Agri-input firms, food processing, ICAR research, agri-fintech, or your own farm enterprise"},
        ],
        "topColleges": ["IARI New Delhi", "GB Pant University Pantnagar", "TNAU Coimbatore", "PAU Ludhiana",
                        "IRMA Anand", "UAS Bengaluru"],
        "coreSkills": ["Applied biology and soil science", "Field observation", "Supply-chain thinking",
                       "Working with farmers, not only data", "Sustainability economics"],
        "buildNow": [
            "Biology plus economics is the strongest combination here",
            "Spend real time on a working farm - the field is very different from the syllabus",
            "Follow agri-tech companies; the sector is being rebuilt around them",
        ],
        "salary": {"entry": "Rs 3-8 LPA", "mid": "Rs 8-20 LPA", "senior": "Rs 20-45 LPA+"},
        "realityCheck": "Underrated and less crowded than engineering, with genuine ICAR and public-sector routes. Field postings are often rural, which suits some people and not others.",
    },
    # -------------------------------------------------------------- COMMERCE
    "commerce": {
        "label": "Commerce, Finance & Management",
        "entranceExams": [
            {"name": "CUET-UG", "when": "Class 12, May", "opens": "B.Com / BBA at Delhi University and central universities"},
            {"name": "IPMAT (IIM Indore / Rohtak)", "when": "Class 12, May", "opens": "The five-year integrated management programme straight from school"},
            {"name": "NPAT, SET, CHRIST, DU-JAT", "when": "Class 12, Apr-Jun", "opens": "NMIMS, Symbiosis, Christ and similar"},
            {"name": "CA Foundation / CS Executive Entrance / CMA Foundation", "when": "After Class 12, Jun & Dec", "opens": "The professional route, alongside or instead of a degree"},
        ],
        "afterSchool": [
            {"stage": "B.Com / BBA / BMS", "years": "3 years", "what": "Internships from year 2; certifications alongside"},
            {"stage": "Professional qualification", "years": "3-5 years", "what": "CA, CS, CMA, CFA or ACCA - often started in parallel with the degree"},
            {"stage": "MBA", "years": "+2 years", "what": "Via CAT/XAT/GMAT, usually after 2-3 years of work"},
        ],
        "topColleges": ["Shri Ram College of Commerce (SRCC)", "Hindu & Hansraj College, Delhi", "St Xavier's Mumbai/Kolkata",
                        "Narsee Monjee (NMIMS)", "Christ University Bengaluru", "Symbiosis Pune", "IIM Indore/Rohtak (IPM)"],
        "coreSkills": ["Accounting fundamentals", "Excel and financial modelling", "Business writing",
                       "Commercial judgement", "Presenting a recommendation to people who will challenge it"],
        "buildNow": [
            "Take Mathematics in class 11-12 if you can - it opens finance, economics and IPMAT, and closing it is hard to undo",
            "Start CA Foundation right after boards if the professional route appeals",
            "Learn Excel to a genuinely fluent level; it is the working language of the field",
            "Run something small that handles real money - a stall, a resale account, an event",
        ],
        "salary": {"entry": "Rs 4-12 LPA", "mid": "Rs 12-35 LPA", "senior": "Rs 35 LPA-1 Cr+ (investment banking and CA partnership highest)"},
        "realityCheck": "B.Com alone is one of the most common degrees in India and no longer distinguishes anyone. The qualification stacked on top - CA, CFA, an MBA, or a real skill - is what does.",
    },
    "law": {
        "label": "Law",
        "entranceExams": [
            {"name": "CLAT", "when": "Class 12, Dec", "opens": "The 26 National Law Universities"},
            {"name": "AILET", "when": "Class 12, Dec", "opens": "NLU Delhi"},
            {"name": "LSAT-India / SLAT / CUET-UG", "when": "Class 12, Jan-May", "opens": "Jindal, Symbiosis and central-university law schools"},
        ],
        "afterSchool": [
            {"stage": "5-year integrated LLB", "years": "5 years", "what": "BA/BBA/B.Com LLB, with moot courts and internships every vacation"},
            {"stage": "Bar Council enrolment", "years": "On graduating", "what": "AIBE clears you to practise"},
            {"stage": "Practice, firm, or judiciary", "years": "After enrolment", "what": "Litigation chambers, a corporate law firm, or the judicial services exam"},
        ],
        "topColleges": ["NLSIU Bengaluru", "NALSAR Hyderabad", "NLU Delhi", "WBNUJS Kolkata", "NLU Jodhpur",
                        "Jindal Global Law School", "Faculty of Law, Delhi University (3-year LLB)"],
        "coreSkills": ["Precise reading", "Argument construction", "Very large volumes of reading",
                       "Written advocacy", "Composure under cross-questioning"],
        "buildNow": [
            "Read a serious newspaper daily - CLAT is now largely a comprehension and current-affairs paper",
            "Join debate or MUN; the skill transfers almost directly",
            "Intern with a local advocate even for a week to see what litigation actually looks like",
        ],
        "salary": {"entry": "Rs 5-20 LPA (tier-1 firms highest)", "mid": "Rs 20-50 LPA", "senior": "Rs 50 LPA-3 Cr+ (partner or senior counsel)"},
        "realityCheck": "The gap between NLU corporate placements and independent litigation is stark. Early litigation years pay very little; the people who last usually had support while they built a practice.",
    },
    "civil_services": {
        "label": "Public Service & Policy",
        "entranceExams": [
            {"name": "UPSC Civil Services", "when": "After graduation, prelims in May", "opens": "IAS, IPS, IFS and central services"},
            {"name": "State PSC", "when": "After graduation", "opens": "State administrative services"},
            {"name": "CUET-UG", "when": "Class 12, May", "opens": "BA Political Science, Public Policy, Economics"},
        ],
        "afterSchool": [
            {"stage": "Any bachelor's degree", "years": "3-4 years", "what": "The subject does not matter for eligibility; pick one you can score and think in"},
            {"stage": "Preparation", "years": "1-3 years", "what": "Usually alongside or just after the degree"},
            {"stage": "Service or alternative", "years": "After selection", "what": "Or policy think-tanks, development organisations and public-sector consulting"},
        ],
        "topColleges": ["St Stephen's & Hindu College, Delhi", "JNU", "Presidency Kolkata", "TISS Mumbai",
                        "Ashoka University", "IIT/IIM (many entrants come from here too)"],
        "coreSkills": ["Wide general awareness", "Essay writing", "Analytical reasoning", "Emotional resilience",
                       "Public communication"],
        "buildNow": [
            "Read one national daily properly every day starting now - this is the single highest-return habit",
            "Take a subject you genuinely enjoy; you will study it for years",
            "Build the writing habit early - the mains exam is entirely written",
        ],
        "salary": {"entry": "Rs 7-12 LPA (plus housing and allowances)", "mid": "Rs 12-25 LPA", "senior": "Rs 25-40 LPA (with substantial non-cash benefits)"},
        "realityCheck": "Selection rates are well under 1% and most aspirants spend years without clearing. Build a degree and a fallback career that you would be content with regardless.",
    },
    # ------------------------------------------------------------ CREATIVE
    "design": {
        "label": "Design",
        "entranceExams": [
            {"name": "UCEED", "when": "Class 12, Jan", "opens": "B.Des at IIT Bombay, Delhi, Guwahati, Hyderabad"},
            {"name": "NID DAT", "when": "Class 12, Dec-Jan", "opens": "National Institute of Design"},
            {"name": "NIFT Entrance", "when": "Class 12, Feb", "opens": "NIFT campuses - fashion and textile design"},
            {"name": "NATA", "when": "Class 12, Apr-Jul", "opens": "B.Arch (architecture route)"},
        ],
        "afterSchool": [
            {"stage": "B.Des / B.Arch / BFA", "years": "4-5 years", "what": "Studio-based; your portfolio grows with every project"},
            {"stage": "Portfolio", "years": "Throughout", "what": "The portfolio, not the marksheet, is what gets you hired"},
            {"stage": "Studio, in-house or freelance", "years": "After graduation", "what": "Design studio, a product company's design team, or independent practice"},
        ],
        "topColleges": ["NID Ahmedabad", "IIT Bombay IDC", "NIFT Delhi", "Srishti Manipal Bengaluru",
                        "MIT Institute of Design Pune", "Pearl Academy"],
        "coreSkills": ["Drawing and visual thinking", "Understanding users", "Iterating without ego",
                       "Software (Figma, Adobe suite, CAD)", "Presenting and defending a concept"],
        "buildNow": [
            "Keep a daily sketchbook - UCEED and NID test observation, not polish",
            "Build a portfolio of 8-10 finished pieces before you apply",
            "Redesign something that annoys you and write up why - that is a design case study",
            "Learn Figma now; it is free and it is the industry standard",
        ],
        "salary": {"entry": "Rs 4-12 LPA", "mid": "Rs 12-30 LPA", "senior": "Rs 30-70 LPA+ (product/UX design highest)"},
        "realityCheck": "Design entrance exams reward a way of seeing that takes a year to build, not a month. Start the portfolio in class 11, not after boards.",
    },
    "media": {
        "label": "Media, Film & Communication",
        "entranceExams": [
            {"name": "CUET-UG", "when": "Class 12, May", "opens": "BA Journalism / Mass Communication at central universities"},
            {"name": "IIMC Entrance", "when": "After graduation", "opens": "Indian Institute of Mass Communication"},
            {"name": "FTII / SRFTI JET", "when": "After Class 12 or graduation", "opens": "Film and television training"},
            {"name": "Institutional tests (Symbiosis SET, Christ, Xavier's)", "when": "Class 12", "opens": "Private media schools"},
        ],
        "afterSchool": [
            {"stage": "BA Journalism / Mass Comm / BMM", "years": "3 years", "what": "Internships at publications or studios from year 1"},
            {"stage": "Body of work", "years": "Throughout", "what": "Published bylines, a channel, a reel - the work is the credential"},
            {"stage": "Newsroom, studio, agency or independent", "years": "After graduation", "what": "Or build an audience directly and work for yourself"},
        ],
        "topColleges": ["IIMC New Delhi", "Symbiosis Institute of Media & Communication", "Xavier's Mumbai (XIC)",
                        "ACJ Chennai", "FTII Pune", "Jamia Millia Islamia (AJK MCRC)"],
        "coreSkills": ["Writing that people finish", "Interviewing", "Editing (video and text)",
                       "News judgement", "Meeting a deadline every single time"],
        "buildNow": [
            "Publish something every week - a blog, a school paper column, a channel. Volume first, polish later",
            "Learn video editing; it is now assumed across the whole field",
            "Read across the political spectrum so you can tell reporting from opinion",
        ],
        "salary": {"entry": "Rs 3-8 LPA", "mid": "Rs 8-25 LPA", "senior": "Rs 25-80 LPA+ (very wide; creator economy uncapped)"},
        "realityCheck": "Traditional newsroom pay is low and entry is competitive. The people doing well increasingly built their own audience rather than waiting to be hired.",
    },
    "humanities": {
        "label": "Humanities & Social Sciences",
        "entranceExams": [
            {"name": "CUET-UG", "when": "Class 12, May", "opens": "BA programmes at DU, BHU, JNU and central universities"},
            {"name": "Ashoka / Krea / FLAME Aptitude Tests", "when": "Class 12, Dec-Apr", "opens": "Liberal-arts universities, often with substantial aid"},
            {"name": "TISS-BAT / Symbiosis SET", "when": "Class 12", "opens": "Social sciences and social work"},
        ],
        "afterSchool": [
            {"stage": "BA", "years": "3 years", "what": "Reading-heavy; a research paper or dissertation matters more than marks"},
            {"stage": "MA or professional turn", "years": "2 years", "what": "Academia, policy, law, journalism, HR, UX research or civil services"},
            {"stage": "PhD (optional)", "years": "4-6 years", "what": "Via UGC-NET / institutional entrance, usually with a fellowship"},
        ],
        "topColleges": ["St Stephen's & LSR, Delhi", "Presidency Kolkata", "JNU", "Ashoka University",
                        "TISS Mumbai", "Christ University Bengaluru", "Jadavpur University"],
        "coreSkills": ["Close reading", "Argumentative writing", "Qualitative research",
                       "Historical and cultural context", "Interpreting people and institutions"],
        "buildNow": [
            "Read long-form books, not summaries - the discipline is the point",
            "Write essays for competitions to get used to being marked on argument",
            "Learn basic statistics; social science is increasingly quantitative and this sets you apart",
        ],
        "salary": {"entry": "Rs 3-8 LPA", "mid": "Rs 8-22 LPA", "senior": "Rs 22-60 LPA+ (policy, consulting and UX research highest)"},
        "realityCheck": "The degree does not name a job, which frightens people into avoiding it. The graduates who do well pair it deliberately with a skill - data, law, design or writing.",
    },
    "hospitality": {
        "label": "Hospitality, Tourism & Lifestyle",
        "entranceExams": [
            {"name": "NCHMCT JEE", "when": "Class 12, Apr-May", "opens": "The Institutes of Hotel Management (IHM)"},
            {"name": "CUET-UG", "when": "Class 12, May", "opens": "Tourism and hospitality degrees at central universities"},
            {"name": "Institutional tests (Oberoi STEP, Taj, WGSHA)", "when": "Class 12 or after", "opens": "Hotel-group training programmes, often with a stipend"},
        ],
        "afterSchool": [
            {"stage": "BHM / BHMCT", "years": "3-4 years", "what": "Includes 4-6 months of industrial exposure in a working hotel"},
            {"stage": "Management trainee", "years": "1-2 years", "what": "Rotating through F&B, front office, housekeeping and kitchen"},
            {"stage": "Specialisation", "years": "After training", "what": "Operations, culinary, revenue management, or your own venture"},
        ],
        "topColleges": ["IHM Pusa (Delhi)", "IHM Mumbai", "WGSHA Manipal", "Oberoi Centre of Learning",
                        "Christ University Bengaluru", "Amity School of Hospitality"],
        "coreSkills": ["Service instinct", "Staying calm when everything goes wrong at once",
                       "Team leadership under pressure", "Cost and margin control", "Languages"],
        "buildNow": [
            "Work a real service shift - a cafe, an event, a wedding. It tells you quickly whether this is for you",
            "Start a second language; it moves you up faster than almost anything else here",
            "Cook seriously and often if the culinary route is what appeals",
        ],
        "salary": {"entry": "Rs 3-6 LPA", "mid": "Rs 6-18 LPA", "senior": "Rs 18-60 LPA+ (GM and ownership highest)"},
        "realityCheck": "Early years are long hours, weekends and festivals, on modest pay. Progression is genuinely fast for people who stay, and the skills travel internationally.",
    },
}

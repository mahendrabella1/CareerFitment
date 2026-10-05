# Usage: python scripts/build-ug-bank.py <repo root>
# Builds data/graduates/questions-corrected.json from the 100-question
# "OneGrasp Undergraduate Career Discovery & Goal-Fit Assessment" document.
#
# Every question keeps its document number (docNo), pillar and sub-dimension.
# Each option is mapped explicitly, one question at a time:
#   scoring "nominal"   - a preference; no better/worse answer. `style` names
#                         each option's preference for the sub-dimension result.
#   scoring "weighted"  - situational judgement / readiness; `weights` 0-3 per
#                         option (higher = stronger evidence of the skill).
#   scoring "objective" - aptitude; one correct option (`correctIndex`).
# `tags` (per option) feed the derived constructs the career-matching engine
# uses: mbti:X, riasec:X, mot:<motivator>, str:<strength area>.
# `ei` names the Emotional Intelligence quadrant a weighted item evidences.
import json, sys, os

ROOT = sys.argv[1]

# ------------------------------------------------------------------ SVG figures
def svg(inner, w=100, h=100):
    return f'<svg viewBox="0 0 {w} {h}" width="{w}" height="{h}" xmlns="http://www.w3.org/2000/svg"><rect x="1" y="1" width="{w-2}" height="{h-2}" fill="white" stroke="#D9D9D9" stroke-width="1"/>{inner}</svg>'

F_POLY = "35,20 70,20 70,32 47,32 47,44 62,44 62,55 47,55 47,80 35,80"
def f_shape(transform=""):
    t = f' transform="{transform}"' if transform else ""
    return svg(f'<polygon points="{F_POLY}" fill="#1F3864"{t}/>')

ROT_OPTIONS = [
    f_shape("translate(100,0) scale(-1,1)"),  # mirror image
    f_shape("rotate(-90 50 50)"),             # 90 deg anticlockwise
    f_shape("rotate(90 50 50)"),              # 90 deg clockwise  (correct)
    f_shape("rotate(180 50 50)"),             # 180 deg
]

def shape_svg(kind, dots):
    if kind == "circle":
        body = '<circle cx="50" cy="50" r="34" fill="none" stroke="#1F3864" stroke-width="3"/>'
    elif kind == "square":
        body = '<rect x="17" y="17" width="66" height="66" fill="none" stroke="#1F3864" stroke-width="3"/>'
    else:
        body = '<polygon points="50,12 88,84 12,84" fill="none" stroke="#1F3864" stroke-width="3"/>'
    # Dots on a fixed layout so counts read clearly.
    layout = {1: [(50, 55)], 2: [(40, 55), (60, 55)], 3: [(35, 55), (50, 55), (65, 55)],
              4: [(40, 46), (60, 46), (40, 64), (60, 64)],
              5: [(36, 46), (50, 46), (64, 46), (43, 64), (57, 64)]}[dots]
    # Triangles are narrow near the top, so their dots sit lower to stay inside.
    dy = 14 if kind == "triangle" else 0
    d = "".join(f'<circle cx="{x}" cy="{y + dy}" r="4.5" fill="#C0392B"/>' for x, y in layout)
    return svg(body + d)

ROWS = [["circle", "square", "triangle"], ["square", "triangle", "circle"], ["triangle", "circle", "square"]]
MATRIX_CELLS = []
for r in range(3):
    for c in range(3):
        if r == 2 and c == 2:
            MATRIX_CELLS.append("?")
        else:
            MATRIX_CELLS.append(shape_svg(ROWS[r][c], r + c + 1))
MATRIX_OPTIONS = [shape_svg("square", 4), shape_svg("triangle", 5), shape_svg("square", 5), shape_svg("circle", 5)]  # correct: square, 5

def bar_chart():
    data = [("0-2", 58), ("3-5", 64), ("6-8", 71), ("9-11", 73), ("12+", 72)]
    W, H = 340, 220
    x0, y0, plot_h = 46, 180, 140
    parts = [f'<line x1="{x0}" y1="{y0}" x2="{W-12}" y2="{y0}" stroke="#555" stroke-width="1.5"/>',
             f'<line x1="{x0}" y1="{y0}" x2="{x0}" y2="{y0-plot_h-6}" stroke="#555" stroke-width="1.5"/>']
    for v in (50, 60, 70, 80):
        y = y0 - (v - 50) / 30 * plot_h
        parts.append(f'<line x1="{x0}" y1="{y:.1f}" x2="{W-12}" y2="{y:.1f}" stroke="#E5E7EB" stroke-width="1"/>')
        parts.append(f'<text x="{x0-6}" y="{y+4:.1f}" font-size="11" text-anchor="end" fill="#444">{v}</text>')
    bw = 38
    for i, (lab, v) in enumerate(data):
        x = x0 + 18 + i * 54
        hgt = (v - 50) / 30 * plot_h
        parts.append(f'<rect x="{x}" y="{y0-hgt:.1f}" width="{bw}" height="{hgt:.1f}" fill="#2E75B6"/>')
        parts.append(f'<text x="{x+bw/2}" y="{y0-hgt-5:.1f}" font-size="11" text-anchor="middle" fill="#111" font-weight="bold">{v}</text>')
        parts.append(f'<text x="{x+bw/2}" y="{y0+15}" font-size="11" text-anchor="middle" fill="#444">{lab}</text>')
    parts.append(f'<text x="{(x0+W)/2}" y="{H-6}" font-size="11" text-anchor="middle" fill="#444">Practical sessions attended</text>')
    parts.append(f'<text x="12" y="{y0-plot_h/2}" font-size="11" text-anchor="middle" fill="#444" transform="rotate(-90 12 {y0-plot_h/2})">Avg project score</text>')
    return svg("".join(parts), W, H)

TEAM_TABLE = ('<table style="border-collapse:collapse;font-size:14px;margin:4px 0">'
              '<tr><th style="border:1px solid #ccc;padding:6px 10px;text-align:left">Team</th><th style="border:1px solid #ccc;padding:6px 10px">Tasks due</th><th style="border:1px solid #ccc;padding:6px 10px">Finished on time</th></tr>'
              '<tr><td style="border:1px solid #ccc;padding:6px 10px">Team A</td><td style="border:1px solid #ccc;padding:6px 10px;text-align:center">40</td><td style="border:1px solid #ccc;padding:6px 10px;text-align:center">32</td></tr>'
              '<tr><td style="border:1px solid #ccc;padding:6px 10px">Team B</td><td style="border:1px solid #ccc;padding:6px 10px;text-align:center">25</td><td style="border:1px solid #ccc;padding:6px 10px;text-align:center">21</td></tr>'
              '<tr><td style="border:1px solid #ccc;padding:6px 10px">Team C</td><td style="border:1px solid #ccc;padding:6px 10px;text-align:center">60</td><td style="border:1px solid #ccc;padding:6px 10px;text-align:center">45</td></tr>'
              '</table>')

# ------------------------------------------------------------------ helpers
def nominal(no, sub, text, opts, style, tags=None):
    assert len(style) == len(opts), no
    if tags: assert len(tags) == len(opts), no
    return {"docNo": no, "sub": sub, "scoring": "nominal", "text": text, "options": opts, "style": style, "tags": tags or [[] for _ in opts]}

def weighted(no, sub, text, opts, weights, tags=None, ei=None):
    assert len(weights) == len(opts) and max(weights) == 3, no
    if tags: assert len(tags) == len(opts), no
    q = {"docNo": no, "sub": sub, "scoring": "weighted", "text": text, "options": opts, "weights": weights, "tags": tags or [[] for _ in opts]}
    if ei: q["ei"] = ei
    return q

def objective(no, sub, text, opts, correct, working, media=None, svg_options=False):
    q = {"docNo": no, "sub": sub, "scoring": "objective", "type": "choice4", "text": text, "options": opts, "correctIndex": correct, "working": working}
    if media: q["media"] = media
    if svg_options: q["svgOptions"] = True
    return q

GRADED = [3, 2, 1, 0]  # A strongest ... D weakest, for self-rating scales ordered that way

# ================================================================== PILLAR 1
P1 = [
    nominal(1, "Personality", "When you are given a completely unfamiliar task, your first natural response is to:",
        ["Explore it independently and figure out how it works", "Ask someone experienced to explain where to begin", "Break it into smaller steps and create a plan", "Start experimenting and adjust as you learn"],
        ["Independent explorer", "Guided starter", "Planner", "Experimenter"],
        [["mbti:I", "str:Intellectual & Analytical"], ["mbti:E"], ["mbti:J", "str:Execution & Achievement"], ["mbti:P", "str:Relationship & Adaptability"]]),
    nominal(2, "Personality", "When working on something important, you generally prefer to:",
        ["Follow a clear structure and defined process", "Keep flexibility to change direction when needed", "Work independently with control over your approach", "Discuss your approach with others before proceeding"],
        ["Structured", "Flexible", "Independent", "Collaborative"],
        [["mbti:J"], ["mbti:P"], ["mbti:I", "mot:Independence"], ["mbti:E"]]),
    nominal(3, "Personality", "Which situation feels most natural to you?",
        ["Solving a complex problem that requires concentration", "Interacting with different people and exchanging ideas", "Creating something original from your own ideas", "Organising people, information or activities toward an outcome"],
        ["Deep problem-solver", "Connector", "Creator", "Organiser"],
        [["mbti:I", "riasec:I", "str:Intellectual & Analytical"], ["mbti:E", "riasec:S"], ["mbti:N", "riasec:A", "str:Creative & Innovative"], ["mbti:J", "riasec:E", "str:Execution & Achievement"]]),
    nominal(4, "Personality", "When your plans suddenly change, you usually:",
        ["Quickly adjust and continue", "First understand why the change happened", "Feel uncomfortable until a new structure is established", "Look for a new opportunity created by the change"],
        ["Quick adjuster", "Reason-seeker", "Structure-seeker", "Opportunity-spotter"],
        [["mbti:P", "str:Relationship & Adaptability"], ["mbti:T"], ["mbti:J"], ["mbti:N", "str:Strategic & Futuristic"]]),
    nominal(5, "Work Behaviour", "When you have several tasks with the same deadline, you usually:",
        ["Prioritise them and work systematically", "Start with the task you find most interesting", "Complete the easiest tasks first to build momentum", "Discuss priorities with others before deciding"],
        ["Systematic prioritiser", "Interest-led", "Momentum builder", "Consultative"],
        [["mbti:J", "str:Execution & Achievement"], ["mbti:P"], ["mbti:S"], ["mbti:E"]]),
    nominal(6, "Work Behaviour", "When working independently, your productivity is usually highest when:",
        ["You have clear goals but freedom in how to achieve them", "Someone regularly checks your progress", "You have a detailed step-by-step plan", "You can change your approach as you learn"],
        ["Goal-led autonomy", "External check-ins", "Detailed plan", "Adaptive approach"],
        [["mbti:N", "mot:Independence"], ["mbti:S"], ["mbti:J"], ["mbti:P"]]),
    nominal(7, "Work Behaviour", "If you discover an error in work you submitted, you are most likely to:",
        ["Correct it immediately and understand what caused it", "Inform the relevant person and ask how to fix it", "Move on unless the error has significant consequences", "Review the entire work to check for similar errors"],
        ["Fix and find the cause", "Escalate and ask", "Proportionate", "Full review"],
        [["mbti:T", "str:Execution & Achievement"], ["mbti:F"], ["mbti:P"], ["mbti:J", "str:Intellectual & Analytical"]]),
    nominal(8, "Work Behaviour", "In a group assignment, you naturally tend to:",
        ["Organise the work and track progress", "Generate ideas and alternative approaches", "Make sure everyone contributes", "Focus on completing the technical or analytical work"],
        ["Organiser", "Ideas generator", "Includer", "Technical specialist"],
        [["mbti:J", "riasec:C", "str:Execution & Achievement"], ["mbti:N", "riasec:A", "str:Creative & Innovative"], ["mbti:F", "riasec:S", "str:Relationship & Adaptability"], ["mbti:T", "riasec:I", "str:Intellectual & Analytical"]]),
    nominal(9, "Decision Style", "When making an important decision, you usually rely most on:",
        ["Facts and available evidence", "Your experience and intuition", "Advice and perspectives from others", "A comparison of possible outcomes"],
        ["Evidence-led", "Intuitive", "Consultative", "Outcome-comparing"],
        [["mbti:S", "str:Intellectual & Analytical"], ["mbti:N"], ["mbti:F"], ["mbti:T", "str:Strategic & Futuristic"]]),
    nominal(10, "Decision Style", "When there is no obvious correct answer, you prefer to:",
        ["Gather more information before deciding", "Choose an option and learn from the outcome", "Discuss the possibilities with people you trust", "Compare the risks and benefits systematically"],
        ["Evidence-led", "Experimental", "Consultative", "Risk-weighing"],
        [["mbti:S"], ["mbti:P"], ["mbti:F"], ["mbti:T", "str:Strategic & Futuristic"]]),
    nominal(11, "Decision Style", "If two opportunities appear equally attractive, you are most likely to choose the one that:",
        ["Provides greater long-term growth", "Gives you more freedom and flexibility", "Has clearer financial or practical benefits", "Feels more meaningful or personally interesting"],
        ["Growth-led", "Freedom-led", "Practical", "Meaning-led"],
        [["mbti:N", "mot:Achievement", "str:Strategic & Futuristic"], ["mbti:P", "mot:Independence"], ["mbti:S", "mot:Financial Security"], ["mbti:F", "mot:Purpose"]]),
    nominal(12, "Work Environment Preference", "Which working environment would you naturally prefer?",
        ["Structured, predictable and clearly organised", "Fast-moving, challenging and constantly changing", "Collaborative, social and people-oriented", "Independent, flexible and self-directed"],
        ["Structured", "Fast-paced", "Collaborative", "Self-directed"],
        [["mbti:J", "riasec:C", "mot:Stability"], ["mbti:P", "riasec:E", "mot:Variety"], ["mbti:E", "riasec:S"], ["mbti:I", "mot:Independence"]]),
    nominal(13, "Work Environment Preference", "You are most comfortable when your work involves:",
        ["Clear responsibilities and measurable outcomes", "Continuous learning and new challenges", "Interaction with different people", "Freedom to decide how the work gets done"],
        ["Clear outcomes", "Continuous learning", "People interaction", "Autonomy"],
        [["mbti:J", "mot:Achievement"], ["mbti:N", "mot:Learning"], ["mbti:E"], ["mbti:P", "mot:Independence"]]),
    nominal(14, "Work Environment Preference", "If you could choose between these work settings, which would you prefer?",
        ["A specialised environment requiring deep expertise", "A dynamic environment where you handle different situations", "A team environment with frequent collaboration", "An environment where you can create and experiment"],
        ["Specialist", "Dynamic generalist", "Team-based", "Creative lab"],
        [["mbti:I", "riasec:I"], ["mbti:P", "mot:Variety"], ["mbti:E", "riasec:S"], ["mbti:N", "riasec:A", "mot:Creativity"]]),
]

# ================================================================== PILLAR 2
RIASEC6 = [["riasec:R"], ["riasec:I"], ["riasec:A"], ["riasec:S"], ["riasec:E"], ["riasec:C"]]
RIASEC_STYLE = ["Realistic", "Investigative", "Artistic", "Social", "Enterprising", "Conventional"]
P2 = [
    nominal(15, "RIASEC Interests", "Which activity would you most willingly spend several hours doing?",
        ["Building, repairing or operating something", "Investigating how something works", "Designing or creating something original", "Helping or teaching someone", "Persuading, leading or negotiating with people", "Organising information, records or processes"], RIASEC_STYLE, RIASEC6),
    nominal(16, "RIASEC Interests", "Which type of challenge attracts you most?",
        ["A practical problem requiring hands-on action", "A complex problem requiring investigation and analysis", "An open-ended challenge requiring creativity", "A problem involving people's needs or development", "A challenge involving influence, leadership or competition", "A challenge involving accuracy, organisation and structure"], RIASEC_STYLE, RIASEC6),
    nominal(17, "RIASEC Interests", "If you had to choose a university project, which would interest you most?",
        ["Build or test a physical system", "Conduct research and analyse findings", "Create a new design, concept or media product", "Develop a programme that helps people", "Develop a business or persuade people to adopt an idea", "Create a system for managing information efficiently"], RIASEC_STYLE, RIASEC6),
    nominal(18, "RIASEC Interests", "Which outcome would give you the greatest satisfaction?",
        ["Seeing something tangible that you built or improved", "Discovering an explanation for something previously unclear", "Producing something unique and expressive", "Seeing another person improve because of your contribution", "Turning an idea into an initiative that attracts people or resources", "Creating an organised system that works accurately and efficiently"], RIASEC_STYLE, RIASEC6),
    nominal(19, "RIASEC Interests", "Which activity sounds least like a chore to you?",
        ["Working with tools, equipment or physical systems", "Reading, analysing and investigating information", "Writing, designing, creating or experimenting", "Coaching, mentoring or supporting others", "Presenting, negotiating, selling or leading", "Planning, documenting, organising or managing information"], RIASEC_STYLE, RIASEC6),
    nominal(20, "Motivators", "Which factor most strongly motivates you to perform at your best?",
        ["Mastering something difficult", "Receiving recognition for your contribution", "Having freedom and independence", "Making a meaningful impact"],
        ["Mastery", "Recognition", "Independence", "Impact"],
        [["mot:Learning"], ["mot:Recognition"], ["mot:Independence"], ["mot:Social Impact"]]),
    nominal(21, "Motivators", "When choosing between two opportunities, which reward matters most to you?",
        ["Learning and intellectual growth", "Financial growth and security", "Status, recognition or influence", "Flexibility and quality of life"],
        ["Learning", "Financial security", "Influence", "Quality of life"],
        [["mot:Learning"], ["mot:Financial Security"], ["mot:Leadership"], ["mot:Work-Life Balance"]]),
    nominal(22, "Motivators", "You are most likely to stay committed to a difficult goal when:",
        ["You can see yourself becoming highly skilled", "The goal has meaningful personal importance", "You can see measurable progress", "Other people depend on your contribution"],
        ["Becoming skilled", "Personal meaning", "Visible progress", "Responsibility to others"],
        [["mot:Learning"], ["mot:Purpose"], ["mot:Achievement"], ["mot:Social Impact"]]),
    nominal(23, "Values", "Which principle would you be least willing to compromise in your professional life?",
        ["Honesty and integrity", "Independence and personal freedom", "Excellence and high standards", "Helping people and creating positive impact"],
        ["Integrity", "Independence", "Excellence", "Positive impact"],
        [[], ["mot:Independence"], ["mot:Achievement"], ["mot:Social Impact"]]),
    nominal(24, "Values", "Which statement best reflects what you want your future work to provide?",
        ["Stability and security", "Continuous challenge and growth", "Freedom to pursue my own ideas", "Purpose and meaningful contribution"],
        ["Stability", "Challenge and growth", "Own ideas", "Purpose"],
        [["mot:Financial Security"], ["mot:Achievement"], ["mot:Creativity"], ["mot:Social Impact"]]),
    nominal(25, "Values", "If a high-paying opportunity conflicted with an important personal value, you would most likely:",
        ["Choose the opportunity if the conflict can be managed", "Reject it if the conflict is significant", "Investigate whether another option exists", "Discuss the situation with people whose judgment I trust"],
        ["Pragmatic", "Principled", "Option-seeking", "Consultative"],
        [["mbti:T", "mot:Financial Security"], ["mbti:F"], [], ["mbti:E"]]),
    nominal(26, "Lifestyle Preferences", "Which future lifestyle appeals most to you?",
        ["Stable routine with predictable working hours", "Dynamic work with frequent new experiences", "Flexible work allowing control over my schedule", "Work that allows travel and exposure to different places"],
        ["Stable routine", "Dynamic", "Flexible schedule", "Travel and exposure"],
        [["mot:Stability"], ["mot:Variety"], ["mot:Work-Life Balance"], ["mot:Variety"]]),
    nominal(27, "Lifestyle Preferences", "Which trade-off would you be most comfortable making?",
        ["Higher responsibility for greater career growth", "Lower income for greater flexibility", "Longer working hours for faster advancement", "Less predictability for more variety and experience"],
        ["Responsibility for growth", "Flexibility over income", "Hours for advancement", "Variety over predictability"],
        [["mot:Leadership"], ["mot:Work-Life Balance"], ["mot:Achievement"], ["mot:Variety"]]),
    nominal(28, "Lifestyle Preferences", "Ideally, your future career should allow you to:",
        ["Build deep expertise in one area", "Explore different areas throughout your career", "Balance professional and personal priorities", "Take on increasingly challenging responsibilities"],
        ["Deep expertise", "Exploration", "Balance", "Growing responsibility"],
        [["mot:Learning"], ["mot:Variety"], ["mot:Work-Life Balance"], ["mot:Leadership"]]),
]

# ================================================================== PILLAR 3 (objective)
P3 = [
    objective(29, "Aptitude", "Two inlet pipes can fill a tank in 12 hours and 15 hours respectively, while an outlet pipe can empty the full tank in 20 hours. If all three are opened together on an empty tank, how long will it take to fill?",
        ["8 hours", "9 hours", "10 hours", "12 hours"], 2,
        "1/12 + 1/15 - 1/20 = (5 + 4 - 3)/60 = 6/60 = 1/10 of the tank per hour, so 10 hours."),
    objective(30, "Aptitude", "The figure below is rotated 90° clockwise. Which option shows the result?",
        ROT_OPTIONS, 2, "Rotating the F a quarter-turn clockwise lays its spine along the top with the arms pointing down. Option 1 is a mirror image, option 2 is anticlockwise and option 4 is a half-turn.",
        media={"type": "figure", "svg": f_shape()}, svg_options=True),
    objective(31, "Numerical Reasoning", "A shop marks a laptop 25% above its cost price and then offers a 12% discount on the marked price. What is the shop's profit percentage?",
        ["8%", "10%", "12%", "13%"], 1, "1.25 × 0.88 = 1.10, so the selling price is 110% of cost: a 10% profit."),
    objective(32, "Numerical Reasoning", "Section A has 30 students with an average score of 72. Section B has 45 students with an average score of 82. What is the combined average of both sections?",
        ["76", "77", "78", "79"], 2, "(30 × 72 + 45 × 82) ÷ 75 = (2,160 + 3,690) ÷ 75 = 5,850 ÷ 75 = 78."),
    objective(33, "Numerical Reasoning", "A town's population rises 10% in the first year, falls 10% in the second year and rises 20% in the third year. What is the overall change over the three years?",
        ["18% increase", "18.8% increase", "20% increase", "21% increase"], 1, "1.10 × 0.90 × 1.20 = 1.188, an 18.8% increase."),
    objective(34, "Verbal Reasoning", "Choose the statement that logically follows: All researchers analyse information. Some students are researchers.",
        ["All students analyse information.", "Some students analyse information.", "No students analyse information.", "All people who analyse information are researchers."], 1,
        "The students who are researchers must analyse information, so at least some students do. Nothing is known about the rest."),
    objective(35, "Verbal Reasoning", "A college says: \"Students who joined our internship programme had higher placement rates than other students, so the programme improves employability.\" Which statement, if true, most weakens this conclusion?",
        ["Students with higher grades were more likely to be selected for the programme.", "The programme runs for eight weeks.", "Placement rates rose at most colleges this year.", "A few students did not finish the programme."], 0,
        "If stronger students were chosen for the programme, they might have been placed anyway, so the programme may not be the cause. A general rise affects both groups equally."),
    objective(36, "Logical Reasoning", "Five students - P, Q, R, S and T - are ranked 1st to 5th with no ties. P ranks higher than Q. R ranks lower than S but higher than T. Q ranks higher than T. Which student must be ranked 5th?",
        ["Q", "R", "S", "T"], 3, "T is below R (and so below S) and below Q (and so below P). T is below all four others, so T must be 5th."),
    objective(37, "Logical Reasoning", "Every student selected for Research is also selected for Entrepreneurship. Every student selected for Entrepreneurship is also selected for Leadership. A student is NOT selected for Leadership. Which statement must be true?",
        ["The student may still be selected for Entrepreneurship.", "The student is selected for Research.", "The student is selected for neither Research nor Entrepreneurship.", "The student must be selected for some other activity."], 2,
        "Research ⊂ Entrepreneurship ⊂ Leadership. Outside Leadership means outside both smaller groups too."),
    objective(38, "Logical Reasoning", "Four presentations - W, X, Y and Z - are scheduled Monday to Thursday, one per day. W is before X. Y is the day immediately after Z. Z is on Monday or Tuesday. X is not on Wednesday. Which presentation must be on Thursday?",
        ["W", "X", "Y", "Z"], 1,
        "If Z is Monday, Y is Tuesday and W, X take Wednesday and Thursday with W first, so X is Thursday. If Z is Tuesday, Y is Wednesday and W, X take Monday and Thursday, so X is again Thursday."),
    objective(39, "Abstract Reasoning", "Identify the next term: 2A, 5C, 10F, 17J, 26O, ___",
        ["35T", "37U", "37V", "38U"], 1,
        "Numbers are n² + 1 (2, 5, 10, 17, 26, 37). Letters move +2, +3, +4, +5, +6: A, C, F, J, O, U."),
    objective(40, "Abstract Reasoning", "Each row and column of the grid follows the same two rules. Which figure completes the grid?",
        MATRIX_OPTIONS, 2,
        "Each row and column contains one circle, one square and one triangle, so the missing shape is a square. The dots equal row number + column number - 1, so the last cell has 3 + 3 - 1 = 5 dots.",
        media={"type": "grid", "cols": 3, "cells": MATRIX_CELLS}, svg_options=True),
    objective(41, "Analytical Reasoning", "A university grouped students by the number of practical sessions they attended and compared their average project scores (chart below). Which statement is best supported by the chart?",
        ["Scores rise with sessions up to about 9-11 sessions, then level off.", "Attending practical sessions causes higher project scores.", "Students who attended 12+ sessions scored the lowest.", "Each additional session adds the same number of marks."], 0,
        "Averages climb from 58 to 73 and then stay about the same (72). The chart shows an association, not proof of cause, and the gains are not equal per session.",
        media={"type": "figure", "svg": bar_chart()}),
    objective(42, "Analytical Reasoning", "Three teams' deadline records for the term are shown in the table. Which statement is supported by the data?",
        ["Team C has both the most late tasks and the lowest on-time rate.", "Team A has the highest on-time rate.", "Team B finished the most tasks on time.", "Every team finished more than 80% of tasks on time."], 0,
        "On-time rates: A 80%, B 84%, C 75%. Late tasks: A 8, B 4, C 15. Only the first statement is true.",
        media={"type": "html", "html": TEAM_TABLE}),
    objective(43, "Problem Solving", "A project has three tasks. Task X takes 3 hours, Task Y takes 2 hours and Task Z takes 4 hours. Z can start only after X is finished; Y has no dependency. With two people working in parallel, what is the minimum time to finish all three tasks?",
        ["5 hours", "6 hours", "7 hours", "9 hours"], 2,
        "X then Z must run one after the other (3 + 4 = 7 hours), while the second person does Y alongside. The chain X→Z sets the minimum: 7 hours."),
    objective(44, "Problem Solving", "You must order equipment with a total budget of ₹50,000 (including delivery), and it must arrive within 10 days. Which supplier meets both conditions?",
        ["Supplier P: ₹44,000 + ₹4,000 delivery, arrives in 12 days", "Supplier Q: ₹46,500 + ₹2,500 delivery, arrives in 9 days", "Supplier R: ₹47,000 + ₹3,500 delivery, arrives in 6 days", "Supplier S: ₹49,000 with free delivery, arrives in 11 days"], 1,
        "P and S are too late. R costs ₹50,500, over budget. Q costs ₹49,000 and arrives in 9 days."),
]

# ================================================================== PILLAR 4
P4 = [
    nominal(45, "Subject Strength", "Which statement best describes your strongest academic ability?",
        ["Understanding theories and concepts", "Applying concepts to practical situations", "Analysing information and identifying patterns", "Explaining concepts clearly to others"],
        ["Conceptual understanding", "Practical application", "Analysis and patterns", "Explaining to others"],
        [["mbti:N", "str:Intellectual & Analytical"], ["mbti:S", "str:Execution & Achievement"], ["str:Intellectual & Analytical"], ["mbti:E", "str:Influence & Leadership"]]),
    nominal(46, "Subject Strength", "When studying a difficult subject, you are most likely to succeed when you:",
        ["Understand the underlying concept", "Practise several examples", "Discuss the topic with others", "Connect it to real-world applications"],
        ["Concept first", "Practice", "Discussion", "Real-world links"],
        [["mbti:N"], ["mbti:S"], ["mbti:E"], ["mbti:S"]]),
    nominal(47, "Subject Strength", "When your academic performance in a subject is weaker than expected, you usually:",
        ["Increase practice until your understanding improves", "Try a different learning method", "Seek help from someone knowledgeable", "Examine whether the subject genuinely interests you"],
        ["More practice", "New method", "Seek help", "Re-check interest"],
        [["str:Execution & Achievement"], ["str:Relationship & Adaptability"], [], ["mbti:F"]]),
    weighted(48, "Domain Knowledge", "How confidently can you explain the major concepts of your current field of study to someone from another discipline?",
        ["Very confidently", "Fairly confidently", "Only the basic concepts", "I would struggle to explain them"], GRADED),
    weighted(49, "Domain Knowledge", "How well do you understand how your academic discipline is applied outside the classroom?",
        ["I understand several real-world applications", "I understand a few common applications", "I know the general idea but not the details", "I have not explored this much"], GRADED),
    weighted(50, "Domain Knowledge", "When you encounter a new development in your academic field, you generally:",
        ["Explore it because I want to understand where the field is heading", "Learn about it when it becomes relevant to my coursework", "Discuss it with teachers or peers", "Usually wait until it becomes part of my curriculum"], [3, 1, 2, 0],
        [["str:Strategic & Futuristic", "mot:Learning"], [], [], []]),
    weighted(51, "Degree Knowledge", "How clearly do you understand the different career directions available after your current degree?",
        ["I know several possible directions", "I know a few common options", "I mainly know the most obvious career path", "I am still exploring them"], GRADED),
    weighted(52, "Degree Knowledge", "How well do you understand which skills employers or professional organisations expect from graduates of your degree?",
        ["Very clearly", "Reasonably clearly", "Only at a basic level", "I have not researched this yet"], GRADED),
    weighted(53, "Degree Knowledge", "If you were asked to explain why your degree is valuable in the professional world, you would:",
        ["Clearly connect its knowledge and skills to several applications", "Explain a few common applications", "Mainly describe the subjects covered", "Find it difficult to explain its professional relevance"], GRADED),
    weighted(54, "Specialisation Fit", "How strongly does your current specialisation match the subjects you naturally enjoy working with?",
        ["Very strongly", "Moderately", "Slightly", "Not at all"], GRADED),
    weighted(55, "Specialisation Fit", "When working on projects related to your specialisation, you generally feel:",
        ["Highly engaged and curious", "Interested when the topic is practical", "Neutral but capable of completing the work", "Disconnected from the subject"], GRADED),
    nominal(56, "Specialisation Fit", "If you could deepen your knowledge in one part of your current discipline, you would most likely choose an area that:",
        ["Matches what I already enjoy", "Has strong future applications", "Challenges me intellectually", "Opens opportunities beyond my current specialisation"],
        ["Enjoyment-led", "Future-led", "Challenge-led", "Breadth-led"],
        [[], ["str:Strategic & Futuristic"], ["mot:Learning", "str:Intellectual & Analytical"], ["mot:Variety"]]),
]

# ================================================================== PILLAR 5
P5 = [
    weighted(57, "Communication", "When explaining a complex idea to someone unfamiliar with the subject, you usually:",
        ["Simplify the idea and use examples", "Explain the technical details first", "Ask questions to understand what they already know", "Provide written information for them to review"], [3, 1, 3, 1],
        [["str:Influence & Leadership"], [], ["str:Relationship & Adaptability"], []]),
    nominal(58, "Communication", "When presenting an idea to a group, your biggest strength is usually:",
        ["Structuring the message clearly", "Speaking confidently", "Using examples or stories", "Responding to questions"],
        ["Clear structure", "Confident delivery", "Storytelling", "Handling questions"],
        [["mbti:J"], ["mbti:E", "str:Influence & Leadership"], ["mbti:N", "str:Creative & Innovative"], ["str:Relationship & Adaptability"]]),
    weighted(59, "Communication", "If someone misunderstands something you explained, you usually:",
        ["Rephrase it in a simpler way", "Ask them which part was unclear", "Provide more evidence or examples", "Repeat the explanation more slowly"], [2, 3, 2, 1]),
    weighted(60, "Emotional Intelligence", "During a disagreement with a teammate, your first priority is to:",
        ["Understand their perspective", "Defend your position with evidence", "Find a compromise", "Take time to calm down before continuing"], [3, 1, 2, 2],
        [["str:Relationship & Adaptability"], [], [], []], ei="Relationship Management"),
    weighted(61, "Emotional Intelligence", "You receive unexpected criticism about your work. Your most likely response is to:",
        ["Consider whether the criticism is valid", "Immediately explain why your approach was reasonable", "Ask for specific examples", "Feel discouraged but continue working"], [3, 1, 3, 1], ei="Self-Awareness"),
    weighted(62, "Emotional Intelligence", "When you notice that someone on your team is struggling, you usually:",
        ["Offer help directly", "Ask whether they need support", "Give them space unless they ask", "Try to understand what is causing the difficulty first"], [2, 3, 1, 3],
        [["mot:Social Impact"], ["str:Relationship & Adaptability"], [], []], ei="Social Awareness"),
    weighted(63, "Teamwork", "A strong team, in your view, is one where:",
        ["Everyone has clearly defined responsibilities", "People freely exchange ideas and support one another", "The most capable person makes the major decisions", "Everyone works independently and combines the results"], [2, 3, 0, 1],
        [["str:Execution & Achievement"], ["str:Relationship & Adaptability"], [], []]),
    weighted(64, "Teamwork", "If a teammate is not completing their responsibilities, you would most likely:",
        ["Talk to them directly", "Offer help to understand the problem", "Complete their part yourself if the deadline is close", "Escalate the issue to the team leader"], [3, 3, 1, 1],
        [["str:Influence & Leadership"], ["str:Relationship & Adaptability"], [], []], ei="Relationship Management"),
    weighted(65, "Leadership", "When a group has no clear direction, you naturally tend to:",
        ["Step forward and organise the next steps", "Ask the group to decide together", "Wait for someone with more authority to lead", "Focus on completing your own responsibility"], [3, 2, 0, 1],
        [["str:Influence & Leadership", "mot:Leadership"], ["str:Relationship & Adaptability"], [], []]),
    nominal(66, "Leadership", "A good leader, in your opinion, should primarily:",
        ["Make clear decisions", "Develop and support people", "Ensure goals are achieved", "Create direction while allowing others autonomy"],
        ["Decisive", "People-developing", "Results-focused", "Empowering"],
        [["mbti:T"], ["mbti:F", "str:Relationship & Adaptability"], ["str:Execution & Achievement"], ["str:Influence & Leadership", "str:Strategic & Futuristic"]]),
    weighted(67, "Execution", "When you have an idea you strongly believe in, your next natural step is to:",
        ["Create an action plan", "Research whether the idea is practical", "Discuss it with people who can help", "Start experimenting with a small version"], [3, 2, 2, 3],
        [["str:Execution & Achievement"], ["str:Intellectual & Analytical"], ["str:Influence & Leadership"], ["str:Creative & Innovative"]]),
    weighted(68, "Execution", "Which statement best describes your approach to completing long-term tasks?",
        ["I consistently work toward milestones", "I work intensely when deadlines approach", "I need external accountability to stay consistent", "I adjust my plan as circumstances change"], [3, 1, 1, 2],
        [["str:Execution & Achievement"], [], [], ["str:Relationship & Adaptability"]]),
    weighted(69, "Resilience", "After experiencing a significant setback, you generally:",
        ["Analyse what went wrong and try again", "Take some time before deciding what to do next", "Seek advice from someone experienced", "Move toward another approach or goal"], [3, 2, 2, 2], ei="Self-Management"),
    weighted(70, "Resilience", "When repeated attempts at something do not work, you are most likely to:",
        ["Keep trying with the same approach", "Change the strategy", "Take a break and return later", "Decide whether the goal is still worth pursuing"], [0, 3, 2, 2],
        [[], ["str:Relationship & Adaptability"], [], ["str:Strategic & Futuristic"]], ei="Self-Management"),
]

# ================================================================== PILLAR 6
P6 = [
    weighted(71, "Digital Literacy", "When you need to learn how to use an unfamiliar digital tool, you usually:",
        ["Explore it independently", "Watch tutorials first", "Ask someone to demonstrate it", "Learn only the features immediately required"], [3, 3, 1, 1]),
    weighted(72, "Digital Literacy", "When working with digital information, you are most careful about:",
        ["Accuracy and reliability", "Speed of completing the task", "Organisation and accessibility", "Presentation and usability"], [3, 1, 2, 2]),
    weighted(73, "AI Readiness", "If an AI tool can complete part of a task you normally do manually, you would most likely:",
        ["Explore how it works and test its output", "Use it immediately if it saves time", "Wait until you understand its limitations", "Prefer doing the task yourself unless AI is necessary"], [3, 1, 2, 0]),
    weighted(74, "AI Readiness", "When using AI to help with important work, what matters most to you?",
        ["Checking whether the output is accurate", "Saving time", "Understanding how the output was produced", "Using your own judgment alongside the AI output"], [3, 0, 2, 3]),
    weighted(75, "AI Readiness", "If AI significantly changes the skills required in your field, you would most likely:",
        ["Learn the new tools and adapt", "Wait until the changes become unavoidable", "Develop skills that complement AI", "Consider whether another area of the field suits you better"], [3, 0, 3, 1],
        [["str:Relationship & Adaptability"], [], ["str:Strategic & Futuristic"], []]),
    weighted(76, "Data Literacy", "When presented with a graph or dataset, your first instinct is to:",
        ["Look for the main pattern or trend", "Check the source and reliability of the data", "Look for unusual values or inconsistencies", "Think about what decision the data can support"], [2, 3, 3, 2],
        [["str:Intellectual & Analytical"], ["str:Intellectual & Analytical"], ["str:Intellectual & Analytical"], ["str:Strategic & Futuristic"]]),
    weighted(77, "Data Literacy", "Two reports present different conclusions using similar data. What would you do first?",
        ["Check how the data was collected", "Choose the report from the more credible source", "Examine how the data was analysed", "Look for additional evidence"], [3, 1, 3, 2],
        [["str:Intellectual & Analytical"], [], ["str:Intellectual & Analytical"], []]),
    weighted(78, "Technology Adoption", "Your organisation introduces a new technology that changes how you work. Your initial response is most likely to be:",
        ["Explore its benefits and learn it", "Compare it with the existing method", "Wait until someone trains you", "Continue with the old method until required to change"], [3, 2, 1, 0]),
    nominal(79, "Technology Adoption", "You are most likely to adopt a new technology when:",
        ["It clearly improves results", "It makes your work faster", "It provides opportunities to learn", "It becomes widely accepted in your field"],
        ["Results-driven", "Efficiency-driven", "Learning-driven", "Follows the field"],
        [["str:Execution & Achievement"], [], ["mot:Learning"], []]),
    nominal(80, "Future Skills", "Which ability do you think will become increasingly important across many careers?",
        ["Continuous learning", "Working effectively with technology", "Solving unfamiliar problems", "Communicating and collaborating effectively"],
        ["Continuous learning", "Technology fluency", "Novel problem-solving", "Collaboration"],
        [["mot:Learning"], [], ["str:Intellectual & Analytical"], ["str:Relationship & Adaptability"]]),
    weighted(81, "Future Skills", "If your current field changes substantially over the next five years, you would prefer to:",
        ["Develop new skills within the same field", "Combine your existing expertise with a new field", "Move toward an emerging area", "Wait until the direction of the industry becomes clearer"], [3, 3, 2, 0],
        [[], ["str:Strategic & Futuristic"], ["mot:Variety"], []]),
    weighted(82, "Future Skills", "When learning a new skill that may not be immediately useful, you are most likely to:",
        ["Learn it if it could create future opportunities", "Learn it only when there is a clear application", "Explore it out of curiosity", "Prioritise skills directly relevant to my current path"], [3, 1, 3, 1],
        [["str:Strategic & Futuristic"], [], ["mot:Learning"], []]),
]

# ================================================================== PILLAR 7
P7 = [
    weighted(83, "Career Readiness", "How clearly can you describe the type of professional role you want to pursue after graduation?",
        ["Very clearly", "I have a few possible directions", "I have a general idea but not a specific direction", "I am still exploring"], GRADED),
    weighted(84, "Career Readiness", "How well do you understand the qualifications, skills and experience required for your intended career direction?",
        ["Very well", "Reasonably well", "I know some requirements", "I have not investigated them deeply"], GRADED),
    weighted(85, "Experience", "Which best describes your exposure to real-world professional environments?",
        ["Internship/work experience in my field", "Projects, competitions, volunteering or similar experiences", "Short-term exposure through workshops or events", "Mostly academic exposure so far"], GRADED),
    nominal(86, "Experience", "When participating in a project outside regular coursework, your main objective is usually to:",
        ["Gain practical experience", "Build something I can demonstrate professionally", "Learn something new", "Strengthen my academic profile"],
        ["Practical experience", "Portfolio building", "Learning", "Academic profile"],
        [["str:Execution & Achievement"], ["mot:Achievement"], ["mot:Learning"], []]),
    weighted(87, "Skill Portfolio", "If an employer asked you to demonstrate your strongest skills, you could currently show them through:",
        ["Projects or work samples", "Certifications or formal qualifications", "Internships or practical experience", "I would mainly describe my abilities verbally"], [3, 2, 3, 0]),
    weighted(88, "Skill Portfolio", "How intentionally are you building skills beyond your university curriculum?",
        ["Very intentionally with a clear plan", "Regularly, but based on opportunities", "Occasionally when something interests me", "Not yet in a structured way"], GRADED),
    weighted(89, "Skill Gaps", "When you compare your current abilities with those required for your desired professional direction, you:",
        ["Know exactly which skills I need to strengthen", "Know some of the gaps", "Have a general sense but not a clear picture", "Have not yet compared them"], GRADED),
    weighted(90, "Professional Identity", "If someone asked, \"What professional value can you bring to an organisation?\", you would:",
        ["Clearly describe my strengths and evidence", "Explain my academic knowledge and interests", "Describe the skills I am currently developing", "Find it difficult to answer"], [3, 1, 2, 0]),
    weighted(91, "Professional Identity", "How intentionally are you building your professional identity through projects, networking, portfolios, online presence or other activities?",
        ["Very intentionally", "To some extent", "Occasionally", "Not yet"], GRADED),
]

# ================================================================== PILLAR 8
P8 = [
    weighted(92, "Learning Agility", "When you encounter something you do not know, your usual response is to:",
        ["Learn enough to solve the immediate problem", "Explore the topic deeply", "Find someone who can teach you", "Look for an alternative way around the problem"], [2, 3, 2, 1],
        [[], ["mot:Learning"], [], []]),
    nominal(93, "Learning Agility", "Which learning situation is most comfortable for you?",
        ["Learning by doing", "Learning through structured courses", "Learning independently through exploration", "Learning through discussion and collaboration"],
        ["Hands-on", "Structured courses", "Self-directed", "Collaborative"],
        [["mbti:S"], ["mbti:J"], ["mbti:I"], ["mbti:E"]]),
    weighted(94, "Adaptability", "If your planned career path became significantly less attractive because of industry changes, you would most likely:",
        ["Identify adjacent career options using your existing skills", "Retrain for a different direction", "Wait to see whether the situation improves", "Explore several completely different possibilities"], [3, 2, 0, 2],
        [["str:Strategic & Futuristic"], [], [], ["mot:Variety"]]),
    weighted(95, "Adaptability", "When entering an unfamiliar environment, you usually:",
        ["Observe first and then adjust", "Quickly interact and learn from people", "Establish a routine as soon as possible", "Experiment until you find what works"], [3, 3, 2, 2],
        [["mbti:I"], ["mbti:E", "str:Relationship & Adaptability"], ["mbti:J"], ["mbti:P"]]),
    nominal(96, "Sector Fit", "Which type of sector environment would you most naturally prefer?",
        ["A highly specialised technical or professional sector", "A research and knowledge-intensive sector", "A people-focused service or social sector", "A commercial, entrepreneurial or competitive sector"],
        ["Technical / professional", "Research & knowledge", "People & social", "Commercial & entrepreneurial"],
        [["riasec:R"], ["riasec:I"], ["riasec:S"], ["riasec:E"]]),
    nominal(97, "Sector Fit", "If you discovered that your skills could be applied across several industries, you would prefer to:",
        ["Build deep expertise in one industry", "Explore multiple industries before specialising", "Choose the industry with the strongest growth opportunities", "Choose the industry that best matches your interests and values"],
        ["Industry specialist", "Explore first", "Growth-led", "Values-led"],
        [[], ["mot:Variety"], ["mot:Achievement"], ["mot:Purpose"]]),
    nominal(98, "Geographic Mobility", "If your preferred career opportunity required you to relocate to another city or country, you would most likely:",
        ["Relocate if the opportunity significantly supports my career", "Consider it depending on personal circumstances", "Prefer to remain in my current location", "Actively seek opportunities that provide international exposure"],
        ["Mobile for the right role", "Open, depending on circumstances", "Prefers current location", "Seeks international exposure"]),
    nominal(99, "Long-Term Adaptability", "When you imagine your career 10 years from now, which statement best describes your preference?",
        ["I want to become a recognised expert in one area", "I want to grow into leadership and greater responsibility", "I want to build a career that allows multiple transitions", "I want to develop a combination of expertise across different areas"],
        ["Recognised expert", "Leader", "Multiple transitions", "Combined expertise"],
        [["mot:Learning"], ["mot:Leadership", "str:Influence & Leadership"], ["mot:Variety"], ["str:Strategic & Futuristic"]]),
    nominal(100, "Long-Term Adaptability", "Which statement best describes your approach to your long-term career?",
        ["I prefer to define a clear destination and work systematically toward it", "I prefer a direction but want flexibility to change along the way", "I prefer to explore opportunities and let experience shape my direction", "I want to continuously reinvent my career as my interests and the world change"],
        ["Destination planner", "Flexible direction", "Explorer", "Reinventor"],
        [["mbti:J"], ["mbti:P"], ["mbti:P"], ["mbti:N"]]),
]

PILLARS = [
    ("ug_personality_behaviour", P1), ("ug_interests_motivation", P2), ("ug_cognitive_capability", P3),
    ("ug_academic_domain_fit", P4), ("ug_human_professional_skills", P5), ("ug_digital_future_skills", P6),
    ("ug_career_readiness", P7), ("ug_future_adaptability", P8),
]

# ------------------------------------------------------------------ checks
nums = [q["docNo"] for _, qs in PILLARS for q in qs]
assert nums == list(range(1, 101)), "document numbering broken"
for cat, qs in PILLARS:
    for q in qs:
        n = len(q["options"])
        assert n in (4, 6), q["docNo"]
        if q["scoring"] == "objective":
            assert 0 <= q["correctIndex"] < n
        for t in q.get("tags", []):
            for tag in t:
                ns, val = tag.split(":", 1)
                assert ns in ("mbti", "riasec", "mot", "str"), (q["docNo"], tag)

path = os.path.join(ROOT, "data", "graduates", "questions-corrected.json")
old = json.load(open(path, encoding="utf-8"))
out = {cat: {"ug": {"Set 1": qs}} for cat, qs in PILLARS}
# Context questions answered after the pillars are unchanged.
for keep in ("degree_fit", "career_cluster_fit", "career_selector"):
    out[keep] = old[keep]
json.dump(out, open(path, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
print("wrote", path, sum(len(qs) for _, qs in PILLARS), "pillar questions")

# UG assessment — question-by-question mapping

Generated from `data/graduates/questions-corrected.json` (the live bank). Edit `scripts/build-ug-bank.py` and re-run it (`python scripts/build-ug-bank.py .`), not this file or the JSON.

How options are scored:
- **Preference** (no right answer): the option's label becomes the sub-dimension result.
- **Weighted** (0–3): higher = stronger evidence of the skill; the pillar score is points earned ÷ points available.
- **Objective**: one correct answer (✔).
- Evidence tags feed the derived profiles: `mbti:` personality type, `riasec:` interest code, `mot:` motivators, `str:` strength areas; `EI` marks emotional-intelligence items.

## Changes from the source document

- **Q29–Q33**: replaced with harder items (pipes and cistern; markup and discount; weighted average; successive percentage change). Same sub-sections.
- **Q30**: now a picture question (rotate the figure 90° clockwise).
- **Q35**: now a ‘which weakens the argument’ item (the original's answer was very obvious).
- **Q36**: the original had three correct orders (A, B and C). Now asks who must rank 5th (answer: T).
- **Q37**: the original had two correct answers (A and C). Options rewritten so only one is correct.
- **Q38**: the original conditions contradicted each other (with Z on Monday, X had to be Thursday, which was forbidden). Conditions rewritten; answer X.
- **Q40**: the original explained its own rule. Now a 3×3 picture matrix.
- **Q41**: now reads a bar chart (picture). **Q42**: now reads a data table.
- **Q43–Q44**: replaced with a task-scheduling item and a two-constraint supplier choice (the originals had one obviously right option).
- All other questions are word-for-word from the document.

## Pillar 1 — Personality & Behaviour

**Q1** · Personality · Preference  
When you are given a completely unfamiliar task, your first natural response is to:  
- A. Explore it independently and figure out how it works — “Independent explorer”; `mbti:I`, `str:Intellectual & Analytical`
- B. Ask someone experienced to explain where to begin — “Guided starter”; `mbti:E`
- C. Break it into smaller steps and create a plan — “Planner”; `mbti:J`, `str:Execution & Achievement`
- D. Start experimenting and adjust as you learn — “Experimenter”; `mbti:P`, `str:Relationship & Adaptability`

**Q2** · Personality · Preference  
When working on something important, you generally prefer to:  
- A. Follow a clear structure and defined process — “Structured”; `mbti:J`
- B. Keep flexibility to change direction when needed — “Flexible”; `mbti:P`
- C. Work independently with control over your approach — “Independent”; `mbti:I`, `mot:Independence`
- D. Discuss your approach with others before proceeding — “Collaborative”; `mbti:E`

**Q3** · Personality · Preference  
Which situation feels most natural to you?  
- A. Solving a complex problem that requires concentration — “Deep problem-solver”; `mbti:I`, `riasec:I`, `str:Intellectual & Analytical`
- B. Interacting with different people and exchanging ideas — “Connector”; `mbti:E`, `riasec:S`
- C. Creating something original from your own ideas — “Creator”; `mbti:N`, `riasec:A`, `str:Creative & Innovative`
- D. Organising people, information or activities toward an outcome — “Organiser”; `mbti:J`, `riasec:E`, `str:Execution & Achievement`

**Q4** · Personality · Preference  
When your plans suddenly change, you usually:  
- A. Quickly adjust and continue — “Quick adjuster”; `mbti:P`, `str:Relationship & Adaptability`
- B. First understand why the change happened — “Reason-seeker”; `mbti:T`
- C. Feel uncomfortable until a new structure is established — “Structure-seeker”; `mbti:J`
- D. Look for a new opportunity created by the change — “Opportunity-spotter”; `mbti:N`, `str:Strategic & Futuristic`

**Q5** · Work Behaviour · Preference  
When you have several tasks with the same deadline, you usually:  
- A. Prioritise them and work systematically — “Systematic prioritiser”; `mbti:J`, `str:Execution & Achievement`
- B. Start with the task you find most interesting — “Interest-led”; `mbti:P`
- C. Complete the easiest tasks first to build momentum — “Momentum builder”; `mbti:S`
- D. Discuss priorities with others before deciding — “Consultative”; `mbti:E`

**Q6** · Work Behaviour · Preference  
When working independently, your productivity is usually highest when:  
- A. You have clear goals but freedom in how to achieve them — “Goal-led autonomy”; `mbti:N`, `mot:Independence`
- B. Someone regularly checks your progress — “External check-ins”; `mbti:S`
- C. You have a detailed step-by-step plan — “Detailed plan”; `mbti:J`
- D. You can change your approach as you learn — “Adaptive approach”; `mbti:P`

**Q7** · Work Behaviour · Preference  
If you discover an error in work you submitted, you are most likely to:  
- A. Correct it immediately and understand what caused it — “Fix and find the cause”; `mbti:T`, `str:Execution & Achievement`
- B. Inform the relevant person and ask how to fix it — “Escalate and ask”; `mbti:F`
- C. Move on unless the error has significant consequences — “Proportionate”; `mbti:P`
- D. Review the entire work to check for similar errors — “Full review”; `mbti:J`, `str:Intellectual & Analytical`

**Q8** · Work Behaviour · Preference  
In a group assignment, you naturally tend to:  
- A. Organise the work and track progress — “Organiser”; `mbti:J`, `riasec:C`, `str:Execution & Achievement`
- B. Generate ideas and alternative approaches — “Ideas generator”; `mbti:N`, `riasec:A`, `str:Creative & Innovative`
- C. Make sure everyone contributes — “Includer”; `mbti:F`, `riasec:S`, `str:Relationship & Adaptability`
- D. Focus on completing the technical or analytical work — “Technical specialist”; `mbti:T`, `riasec:I`, `str:Intellectual & Analytical`

**Q9** · Decision Style · Preference  
When making an important decision, you usually rely most on:  
- A. Facts and available evidence — “Evidence-led”; `mbti:S`, `str:Intellectual & Analytical`
- B. Your experience and intuition — “Intuitive”; `mbti:N`
- C. Advice and perspectives from others — “Consultative”; `mbti:F`
- D. A comparison of possible outcomes — “Outcome-comparing”; `mbti:T`, `str:Strategic & Futuristic`

**Q10** · Decision Style · Preference  
When there is no obvious correct answer, you prefer to:  
- A. Gather more information before deciding — “Evidence-led”; `mbti:S`
- B. Choose an option and learn from the outcome — “Experimental”; `mbti:P`
- C. Discuss the possibilities with people you trust — “Consultative”; `mbti:F`
- D. Compare the risks and benefits systematically — “Risk-weighing”; `mbti:T`, `str:Strategic & Futuristic`

**Q11** · Decision Style · Preference  
If two opportunities appear equally attractive, you are most likely to choose the one that:  
- A. Provides greater long-term growth — “Growth-led”; `mbti:N`, `mot:Achievement`, `str:Strategic & Futuristic`
- B. Gives you more freedom and flexibility — “Freedom-led”; `mbti:P`, `mot:Independence`
- C. Has clearer financial or practical benefits — “Practical”; `mbti:S`, `mot:Financial Security`
- D. Feels more meaningful or personally interesting — “Meaning-led”; `mbti:F`, `mot:Purpose`

**Q12** · Work Environment Preference · Preference  
Which working environment would you naturally prefer?  
- A. Structured, predictable and clearly organised — “Structured”; `mbti:J`, `riasec:C`, `mot:Stability`
- B. Fast-moving, challenging and constantly changing — “Fast-paced”; `mbti:P`, `riasec:E`, `mot:Variety`
- C. Collaborative, social and people-oriented — “Collaborative”; `mbti:E`, `riasec:S`
- D. Independent, flexible and self-directed — “Self-directed”; `mbti:I`, `mot:Independence`

**Q13** · Work Environment Preference · Preference  
You are most comfortable when your work involves:  
- A. Clear responsibilities and measurable outcomes — “Clear outcomes”; `mbti:J`, `mot:Achievement`
- B. Continuous learning and new challenges — “Continuous learning”; `mbti:N`, `mot:Learning`
- C. Interaction with different people — “People interaction”; `mbti:E`
- D. Freedom to decide how the work gets done — “Autonomy”; `mbti:P`, `mot:Independence`

**Q14** · Work Environment Preference · Preference  
If you could choose between these work settings, which would you prefer?  
- A. A specialised environment requiring deep expertise — “Specialist”; `mbti:I`, `riasec:I`
- B. A dynamic environment where you handle different situations — “Dynamic generalist”; `mbti:P`, `mot:Variety`
- C. A team environment with frequent collaboration — “Team-based”; `mbti:E`, `riasec:S`
- D. An environment where you can create and experiment — “Creative lab”; `mbti:N`, `riasec:A`, `mot:Creativity`

## Pillar 2 — Interests & Motivation

**Q15** · RIASEC Interests · Preference  
Which activity would you most willingly spend several hours doing?  
- A. Building, repairing or operating something — “Realistic”; `riasec:R`
- B. Investigating how something works — “Investigative”; `riasec:I`
- C. Designing or creating something original — “Artistic”; `riasec:A`
- D. Helping or teaching someone — “Social”; `riasec:S`
- E. Persuading, leading or negotiating with people — “Enterprising”; `riasec:E`
- F. Organising information, records or processes — “Conventional”; `riasec:C`

**Q16** · RIASEC Interests · Preference  
Which type of challenge attracts you most?  
- A. A practical problem requiring hands-on action — “Realistic”; `riasec:R`
- B. A complex problem requiring investigation and analysis — “Investigative”; `riasec:I`
- C. An open-ended challenge requiring creativity — “Artistic”; `riasec:A`
- D. A problem involving people's needs or development — “Social”; `riasec:S`
- E. A challenge involving influence, leadership or competition — “Enterprising”; `riasec:E`
- F. A challenge involving accuracy, organisation and structure — “Conventional”; `riasec:C`

**Q17** · RIASEC Interests · Preference  
If you had to choose a university project, which would interest you most?  
- A. Build or test a physical system — “Realistic”; `riasec:R`
- B. Conduct research and analyse findings — “Investigative”; `riasec:I`
- C. Create a new design, concept or media product — “Artistic”; `riasec:A`
- D. Develop a programme that helps people — “Social”; `riasec:S`
- E. Develop a business or persuade people to adopt an idea — “Enterprising”; `riasec:E`
- F. Create a system for managing information efficiently — “Conventional”; `riasec:C`

**Q18** · RIASEC Interests · Preference  
Which outcome would give you the greatest satisfaction?  
- A. Seeing something tangible that you built or improved — “Realistic”; `riasec:R`
- B. Discovering an explanation for something previously unclear — “Investigative”; `riasec:I`
- C. Producing something unique and expressive — “Artistic”; `riasec:A`
- D. Seeing another person improve because of your contribution — “Social”; `riasec:S`
- E. Turning an idea into an initiative that attracts people or resources — “Enterprising”; `riasec:E`
- F. Creating an organised system that works accurately and efficiently — “Conventional”; `riasec:C`

**Q19** · RIASEC Interests · Preference  
Which activity sounds least like a chore to you?  
- A. Working with tools, equipment or physical systems — “Realistic”; `riasec:R`
- B. Reading, analysing and investigating information — “Investigative”; `riasec:I`
- C. Writing, designing, creating or experimenting — “Artistic”; `riasec:A`
- D. Coaching, mentoring or supporting others — “Social”; `riasec:S`
- E. Presenting, negotiating, selling or leading — “Enterprising”; `riasec:E`
- F. Planning, documenting, organising or managing information — “Conventional”; `riasec:C`

**Q20** · Motivators · Preference  
Which factor most strongly motivates you to perform at your best?  
- A. Mastering something difficult — “Mastery”; `mot:Learning`
- B. Receiving recognition for your contribution — “Recognition”; `mot:Recognition`
- C. Having freedom and independence — “Independence”; `mot:Independence`
- D. Making a meaningful impact — “Impact”; `mot:Social Impact`

**Q21** · Motivators · Preference  
When choosing between two opportunities, which reward matters most to you?  
- A. Learning and intellectual growth — “Learning”; `mot:Learning`
- B. Financial growth and security — “Financial security”; `mot:Financial Security`
- C. Status, recognition or influence — “Influence”; `mot:Leadership`
- D. Flexibility and quality of life — “Quality of life”; `mot:Work-Life Balance`

**Q22** · Motivators · Preference  
You are most likely to stay committed to a difficult goal when:  
- A. You can see yourself becoming highly skilled — “Becoming skilled”; `mot:Learning`
- B. The goal has meaningful personal importance — “Personal meaning”; `mot:Purpose`
- C. You can see measurable progress — “Visible progress”; `mot:Achievement`
- D. Other people depend on your contribution — “Responsibility to others”; `mot:Social Impact`

**Q23** · Values · Preference  
Which principle would you be least willing to compromise in your professional life?  
- A. Honesty and integrity — “Integrity”
- B. Independence and personal freedom — “Independence”; `mot:Independence`
- C. Excellence and high standards — “Excellence”; `mot:Achievement`
- D. Helping people and creating positive impact — “Positive impact”; `mot:Social Impact`

**Q24** · Values · Preference  
Which statement best reflects what you want your future work to provide?  
- A. Stability and security — “Stability”; `mot:Financial Security`
- B. Continuous challenge and growth — “Challenge and growth”; `mot:Achievement`
- C. Freedom to pursue my own ideas — “Own ideas”; `mot:Creativity`
- D. Purpose and meaningful contribution — “Purpose”; `mot:Social Impact`

**Q25** · Values · Preference  
If a high-paying opportunity conflicted with an important personal value, you would most likely:  
- A. Choose the opportunity if the conflict can be managed — “Pragmatic”; `mbti:T`, `mot:Financial Security`
- B. Reject it if the conflict is significant — “Principled”; `mbti:F`
- C. Investigate whether another option exists — “Option-seeking”
- D. Discuss the situation with people whose judgment I trust — “Consultative”; `mbti:E`

**Q26** · Lifestyle Preferences · Preference  
Which future lifestyle appeals most to you?  
- A. Stable routine with predictable working hours — “Stable routine”; `mot:Stability`
- B. Dynamic work with frequent new experiences — “Dynamic”; `mot:Variety`
- C. Flexible work allowing control over my schedule — “Flexible schedule”; `mot:Work-Life Balance`
- D. Work that allows travel and exposure to different places — “Travel and exposure”; `mot:Variety`

**Q27** · Lifestyle Preferences · Preference  
Which trade-off would you be most comfortable making?  
- A. Higher responsibility for greater career growth — “Responsibility for growth”; `mot:Leadership`
- B. Lower income for greater flexibility — “Flexibility over income”; `mot:Work-Life Balance`
- C. Longer working hours for faster advancement — “Hours for advancement”; `mot:Achievement`
- D. Less predictability for more variety and experience — “Variety over predictability”; `mot:Variety`

**Q28** · Lifestyle Preferences · Preference  
Ideally, your future career should allow you to:  
- A. Build deep expertise in one area — “Deep expertise”; `mot:Learning`
- B. Explore different areas throughout your career — “Exploration”; `mot:Variety`
- C. Balance professional and personal priorities — “Balance”; `mot:Work-Life Balance`
- D. Take on increasingly challenging responsibilities — “Growing responsibility”; `mot:Leadership`

## Pillar 3 — Cognitive Capability

**Q29** · Aptitude · Objective  
Two inlet pipes can fill a tank in 12 hours and 15 hours respectively, while an outlet pipe can empty the full tank in 20 hours. If all three are opened together on an empty tank, how long will it take to fill?  
- A. 8 hours
- B. 9 hours
- C. 10 hours — ✔ correct
- D. 12 hours
- *Working:* 1/12 + 1/15 - 1/20 = (5 + 4 - 3)/60 = 6/60 = 1/10 of the tank per hour, so 10 hours.

**Q30** · Aptitude · Objective  
The figure below is rotated 90° clockwise. Which option shows the result?  
- A. (figure 1)
- B. (figure 2)
- C. (figure 3) — ✔ correct
- D. (figure 4)
- *Working:* Rotating the F a quarter-turn clockwise lays its spine along the top with the arms pointing down. Option 1 is a mirror image, option 2 is anticlockwise and option 4 is a half-turn.

**Q31** · Numerical Reasoning · Objective  
A shop marks a laptop 25% above its cost price and then offers a 12% discount on the marked price. What is the shop's profit percentage?  
- A. 8%
- B. 10% — ✔ correct
- C. 12%
- D. 13%
- *Working:* 1.25 × 0.88 = 1.10, so the selling price is 110% of cost: a 10% profit.

**Q32** · Numerical Reasoning · Objective  
Section A has 30 students with an average score of 72. Section B has 45 students with an average score of 82. What is the combined average of both sections?  
- A. 76
- B. 77
- C. 78 — ✔ correct
- D. 79
- *Working:* (30 × 72 + 45 × 82) ÷ 75 = (2,160 + 3,690) ÷ 75 = 5,850 ÷ 75 = 78.

**Q33** · Numerical Reasoning · Objective  
A town's population rises 10% in the first year, falls 10% in the second year and rises 20% in the third year. What is the overall change over the three years?  
- A. 18% increase
- B. 18.8% increase — ✔ correct
- C. 20% increase
- D. 21% increase
- *Working:* 1.10 × 0.90 × 1.20 = 1.188, an 18.8% increase.

**Q34** · Verbal Reasoning · Objective  
Choose the statement that logically follows: All researchers analyse information. Some students are researchers.  
- A. All students analyse information.
- B. Some students analyse information. — ✔ correct
- C. No students analyse information.
- D. All people who analyse information are researchers.
- *Working:* The students who are researchers must analyse information, so at least some students do. Nothing is known about the rest.

**Q35** · Verbal Reasoning · Objective  
A college says: "Students who joined our internship programme had higher placement rates than other students, so the programme improves employability." Which statement, if true, most weakens this conclusion?  
- A. Students with higher grades were more likely to be selected for the programme. — ✔ correct
- B. The programme runs for eight weeks.
- C. Placement rates rose at most colleges this year.
- D. A few students did not finish the programme.
- *Working:* If stronger students were chosen for the programme, they might have been placed anyway, so the programme may not be the cause. A general rise affects both groups equally.

**Q36** · Logical Reasoning · Objective  
Five students - P, Q, R, S and T - are ranked 1st to 5th with no ties. P ranks higher than Q. R ranks lower than S but higher than T. Q ranks higher than T. Which student must be ranked 5th?  
- A. Q
- B. R
- C. S
- D. T — ✔ correct
- *Working:* T is below R (and so below S) and below Q (and so below P). T is below all four others, so T must be 5th.

**Q37** · Logical Reasoning · Objective  
Every student selected for Research is also selected for Entrepreneurship. Every student selected for Entrepreneurship is also selected for Leadership. A student is NOT selected for Leadership. Which statement must be true?  
- A. The student may still be selected for Entrepreneurship.
- B. The student is selected for Research.
- C. The student is selected for neither Research nor Entrepreneurship. — ✔ correct
- D. The student must be selected for some other activity.
- *Working:* Research ⊂ Entrepreneurship ⊂ Leadership. Outside Leadership means outside both smaller groups too.

**Q38** · Logical Reasoning · Objective  
Four presentations - W, X, Y and Z - are scheduled Monday to Thursday, one per day. W is before X. Y is the day immediately after Z. Z is on Monday or Tuesday. X is not on Wednesday. Which presentation must be on Thursday?  
- A. W
- B. X — ✔ correct
- C. Y
- D. Z
- *Working:* If Z is Monday, Y is Tuesday and W, X take Wednesday and Thursday with W first, so X is Thursday. If Z is Tuesday, Y is Wednesday and W, X take Monday and Thursday, so X is again Thursday.

**Q39** · Abstract Reasoning · Objective  
Identify the next term: 2A, 5C, 10F, 17J, 26O, ___  
- A. 35T
- B. 37U — ✔ correct
- C. 37V
- D. 38U
- *Working:* Numbers are n² + 1 (2, 5, 10, 17, 26, 37). Letters move +2, +3, +4, +5, +6: A, C, F, J, O, U.

**Q40** · Abstract Reasoning · Objective  
Each row and column of the grid follows the same two rules. Which figure completes the grid?  
- A. (figure 1)
- B. (figure 2)
- C. (figure 3) — ✔ correct
- D. (figure 4)
- *Working:* Each row and column contains one circle, one square and one triangle, so the missing shape is a square. The dots equal row number + column number - 1, so the last cell has 3 + 3 - 1 = 5 dots.

**Q41** · Analytical Reasoning · Objective  
A university grouped students by the number of practical sessions they attended and compared their average project scores (chart below). Which statement is best supported by the chart?  
- A. Scores rise with sessions up to about 9-11 sessions, then level off. — ✔ correct
- B. Attending practical sessions causes higher project scores.
- C. Students who attended 12+ sessions scored the lowest.
- D. Each additional session adds the same number of marks.
- *Working:* Averages climb from 58 to 73 and then stay about the same (72). The chart shows an association, not proof of cause, and the gains are not equal per session.

**Q42** · Analytical Reasoning · Objective  
Three teams' deadline records for the term are shown in the table. Which statement is supported by the data?  
- A. Team C has both the most late tasks and the lowest on-time rate. — ✔ correct
- B. Team A has the highest on-time rate.
- C. Team B finished the most tasks on time.
- D. Every team finished more than 80% of tasks on time.
- *Working:* On-time rates: A 80%, B 84%, C 75%. Late tasks: A 8, B 4, C 15. Only the first statement is true.

**Q43** · Problem Solving · Objective  
A project has three tasks. Task X takes 3 hours, Task Y takes 2 hours and Task Z takes 4 hours. Z can start only after X is finished; Y has no dependency. With two people working in parallel, what is the minimum time to finish all three tasks?  
- A. 5 hours
- B. 6 hours
- C. 7 hours — ✔ correct
- D. 9 hours
- *Working:* X then Z must run one after the other (3 + 4 = 7 hours), while the second person does Y alongside. The chain X→Z sets the minimum: 7 hours.

**Q44** · Problem Solving · Objective  
You must order equipment with a total budget of ₹50,000 (including delivery), and it must arrive within 10 days. Which supplier meets both conditions?  
- A. Supplier P: ₹44,000 + ₹4,000 delivery, arrives in 12 days
- B. Supplier Q: ₹46,500 + ₹2,500 delivery, arrives in 9 days — ✔ correct
- C. Supplier R: ₹47,000 + ₹3,500 delivery, arrives in 6 days
- D. Supplier S: ₹49,000 with free delivery, arrives in 11 days
- *Working:* P and S are too late. R costs ₹50,500, over budget. Q costs ₹49,000 and arrives in 9 days.

## Pillar 4 — Academic & Domain Fit

**Q45** · Subject Strength · Preference  
Which statement best describes your strongest academic ability?  
- A. Understanding theories and concepts — “Conceptual understanding”; `mbti:N`, `str:Intellectual & Analytical`
- B. Applying concepts to practical situations — “Practical application”; `mbti:S`, `str:Execution & Achievement`
- C. Analysing information and identifying patterns — “Analysis and patterns”; `str:Intellectual & Analytical`
- D. Explaining concepts clearly to others — “Explaining to others”; `mbti:E`, `str:Influence & Leadership`

**Q46** · Subject Strength · Preference  
When studying a difficult subject, you are most likely to succeed when you:  
- A. Understand the underlying concept — “Concept first”; `mbti:N`
- B. Practise several examples — “Practice”; `mbti:S`
- C. Discuss the topic with others — “Discussion”; `mbti:E`
- D. Connect it to real-world applications — “Real-world links”; `mbti:S`

**Q47** · Subject Strength · Preference  
When your academic performance in a subject is weaker than expected, you usually:  
- A. Increase practice until your understanding improves — “More practice”; `str:Execution & Achievement`
- B. Try a different learning method — “New method”; `str:Relationship & Adaptability`
- C. Seek help from someone knowledgeable — “Seek help”
- D. Examine whether the subject genuinely interests you — “Re-check interest”; `mbti:F`

**Q48** · Domain Knowledge · Weighted  
How confidently can you explain the major concepts of your current field of study to someone from another discipline?  
- A. Very confidently — weight 3
- B. Fairly confidently — weight 2
- C. Only the basic concepts — weight 1
- D. I would struggle to explain them — weight 0

**Q49** · Domain Knowledge · Weighted  
How well do you understand how your academic discipline is applied outside the classroom?  
- A. I understand several real-world applications — weight 3
- B. I understand a few common applications — weight 2
- C. I know the general idea but not the details — weight 1
- D. I have not explored this much — weight 0

**Q50** · Domain Knowledge · Weighted  
When you encounter a new development in your academic field, you generally:  
- A. Explore it because I want to understand where the field is heading — weight 3; `str:Strategic & Futuristic`, `mot:Learning`
- B. Learn about it when it becomes relevant to my coursework — weight 1
- C. Discuss it with teachers or peers — weight 2
- D. Usually wait until it becomes part of my curriculum — weight 0

**Q51** · Degree Knowledge · Weighted  
How clearly do you understand the different career directions available after your current degree?  
- A. I know several possible directions — weight 3
- B. I know a few common options — weight 2
- C. I mainly know the most obvious career path — weight 1
- D. I am still exploring them — weight 0

**Q52** · Degree Knowledge · Weighted  
How well do you understand which skills employers or professional organisations expect from graduates of your degree?  
- A. Very clearly — weight 3
- B. Reasonably clearly — weight 2
- C. Only at a basic level — weight 1
- D. I have not researched this yet — weight 0

**Q53** · Degree Knowledge · Weighted  
If you were asked to explain why your degree is valuable in the professional world, you would:  
- A. Clearly connect its knowledge and skills to several applications — weight 3
- B. Explain a few common applications — weight 2
- C. Mainly describe the subjects covered — weight 1
- D. Find it difficult to explain its professional relevance — weight 0

**Q54** · Specialisation Fit · Weighted  
How strongly does your current specialisation match the subjects you naturally enjoy working with?  
- A. Very strongly — weight 3
- B. Moderately — weight 2
- C. Slightly — weight 1
- D. Not at all — weight 0

**Q55** · Specialisation Fit · Weighted  
When working on projects related to your specialisation, you generally feel:  
- A. Highly engaged and curious — weight 3
- B. Interested when the topic is practical — weight 2
- C. Neutral but capable of completing the work — weight 1
- D. Disconnected from the subject — weight 0

**Q56** · Specialisation Fit · Preference  
If you could deepen your knowledge in one part of your current discipline, you would most likely choose an area that:  
- A. Matches what I already enjoy — “Enjoyment-led”
- B. Has strong future applications — “Future-led”; `str:Strategic & Futuristic`
- C. Challenges me intellectually — “Challenge-led”; `mot:Learning`, `str:Intellectual & Analytical`
- D. Opens opportunities beyond my current specialisation — “Breadth-led”; `mot:Variety`

## Pillar 5 — Human & Professional Skills

**Q57** · Communication · Weighted  
When explaining a complex idea to someone unfamiliar with the subject, you usually:  
- A. Simplify the idea and use examples — weight 3; `str:Influence & Leadership`
- B. Explain the technical details first — weight 1
- C. Ask questions to understand what they already know — weight 3; `str:Relationship & Adaptability`
- D. Provide written information for them to review — weight 1

**Q58** · Communication · Preference  
When presenting an idea to a group, your biggest strength is usually:  
- A. Structuring the message clearly — “Clear structure”; `mbti:J`
- B. Speaking confidently — “Confident delivery”; `mbti:E`, `str:Influence & Leadership`
- C. Using examples or stories — “Storytelling”; `mbti:N`, `str:Creative & Innovative`
- D. Responding to questions — “Handling questions”; `str:Relationship & Adaptability`

**Q59** · Communication · Weighted  
If someone misunderstands something you explained, you usually:  
- A. Rephrase it in a simpler way — weight 2
- B. Ask them which part was unclear — weight 3
- C. Provide more evidence or examples — weight 2
- D. Repeat the explanation more slowly — weight 1

**Q60** · Emotional Intelligence · Weighted · EI: Relationship Management  
During a disagreement with a teammate, your first priority is to:  
- A. Understand their perspective — weight 3; `str:Relationship & Adaptability`
- B. Defend your position with evidence — weight 1
- C. Find a compromise — weight 2
- D. Take time to calm down before continuing — weight 2

**Q61** · Emotional Intelligence · Weighted · EI: Self-Awareness  
You receive unexpected criticism about your work. Your most likely response is to:  
- A. Consider whether the criticism is valid — weight 3
- B. Immediately explain why your approach was reasonable — weight 1
- C. Ask for specific examples — weight 3
- D. Feel discouraged but continue working — weight 1

**Q62** · Emotional Intelligence · Weighted · EI: Social Awareness  
When you notice that someone on your team is struggling, you usually:  
- A. Offer help directly — weight 2; `mot:Social Impact`
- B. Ask whether they need support — weight 3; `str:Relationship & Adaptability`
- C. Give them space unless they ask — weight 1
- D. Try to understand what is causing the difficulty first — weight 3

**Q63** · Teamwork · Weighted  
A strong team, in your view, is one where:  
- A. Everyone has clearly defined responsibilities — weight 2; `str:Execution & Achievement`
- B. People freely exchange ideas and support one another — weight 3; `str:Relationship & Adaptability`
- C. The most capable person makes the major decisions — weight 0
- D. Everyone works independently and combines the results — weight 1

**Q64** · Teamwork · Weighted · EI: Relationship Management  
If a teammate is not completing their responsibilities, you would most likely:  
- A. Talk to them directly — weight 3; `str:Influence & Leadership`
- B. Offer help to understand the problem — weight 3; `str:Relationship & Adaptability`
- C. Complete their part yourself if the deadline is close — weight 1
- D. Escalate the issue to the team leader — weight 1

**Q65** · Leadership · Weighted  
When a group has no clear direction, you naturally tend to:  
- A. Step forward and organise the next steps — weight 3; `str:Influence & Leadership`, `mot:Leadership`
- B. Ask the group to decide together — weight 2; `str:Relationship & Adaptability`
- C. Wait for someone with more authority to lead — weight 0
- D. Focus on completing your own responsibility — weight 1

**Q66** · Leadership · Preference  
A good leader, in your opinion, should primarily:  
- A. Make clear decisions — “Decisive”; `mbti:T`
- B. Develop and support people — “People-developing”; `mbti:F`, `str:Relationship & Adaptability`
- C. Ensure goals are achieved — “Results-focused”; `str:Execution & Achievement`
- D. Create direction while allowing others autonomy — “Empowering”; `str:Influence & Leadership`, `str:Strategic & Futuristic`

**Q67** · Execution · Weighted  
When you have an idea you strongly believe in, your next natural step is to:  
- A. Create an action plan — weight 3; `str:Execution & Achievement`
- B. Research whether the idea is practical — weight 2; `str:Intellectual & Analytical`
- C. Discuss it with people who can help — weight 2; `str:Influence & Leadership`
- D. Start experimenting with a small version — weight 3; `str:Creative & Innovative`

**Q68** · Execution · Weighted  
Which statement best describes your approach to completing long-term tasks?  
- A. I consistently work toward milestones — weight 3; `str:Execution & Achievement`
- B. I work intensely when deadlines approach — weight 1
- C. I need external accountability to stay consistent — weight 1
- D. I adjust my plan as circumstances change — weight 2; `str:Relationship & Adaptability`

**Q69** · Resilience · Weighted · EI: Self-Management  
After experiencing a significant setback, you generally:  
- A. Analyse what went wrong and try again — weight 3
- B. Take some time before deciding what to do next — weight 2
- C. Seek advice from someone experienced — weight 2
- D. Move toward another approach or goal — weight 2

**Q70** · Resilience · Weighted · EI: Self-Management  
When repeated attempts at something do not work, you are most likely to:  
- A. Keep trying with the same approach — weight 0
- B. Change the strategy — weight 3; `str:Relationship & Adaptability`
- C. Take a break and return later — weight 2
- D. Decide whether the goal is still worth pursuing — weight 2; `str:Strategic & Futuristic`

## Pillar 6 — Digital & Future Skills

**Q71** · Digital Literacy · Weighted  
When you need to learn how to use an unfamiliar digital tool, you usually:  
- A. Explore it independently — weight 3
- B. Watch tutorials first — weight 3
- C. Ask someone to demonstrate it — weight 1
- D. Learn only the features immediately required — weight 1

**Q72** · Digital Literacy · Weighted  
When working with digital information, you are most careful about:  
- A. Accuracy and reliability — weight 3
- B. Speed of completing the task — weight 1
- C. Organisation and accessibility — weight 2
- D. Presentation and usability — weight 2

**Q73** · AI Readiness · Weighted  
If an AI tool can complete part of a task you normally do manually, you would most likely:  
- A. Explore how it works and test its output — weight 3
- B. Use it immediately if it saves time — weight 1
- C. Wait until you understand its limitations — weight 2
- D. Prefer doing the task yourself unless AI is necessary — weight 0

**Q74** · AI Readiness · Weighted  
When using AI to help with important work, what matters most to you?  
- A. Checking whether the output is accurate — weight 3
- B. Saving time — weight 0
- C. Understanding how the output was produced — weight 2
- D. Using your own judgment alongside the AI output — weight 3

**Q75** · AI Readiness · Weighted  
If AI significantly changes the skills required in your field, you would most likely:  
- A. Learn the new tools and adapt — weight 3; `str:Relationship & Adaptability`
- B. Wait until the changes become unavoidable — weight 0
- C. Develop skills that complement AI — weight 3; `str:Strategic & Futuristic`
- D. Consider whether another area of the field suits you better — weight 1

**Q76** · Data Literacy · Weighted  
When presented with a graph or dataset, your first instinct is to:  
- A. Look for the main pattern or trend — weight 2; `str:Intellectual & Analytical`
- B. Check the source and reliability of the data — weight 3; `str:Intellectual & Analytical`
- C. Look for unusual values or inconsistencies — weight 3; `str:Intellectual & Analytical`
- D. Think about what decision the data can support — weight 2; `str:Strategic & Futuristic`

**Q77** · Data Literacy · Weighted  
Two reports present different conclusions using similar data. What would you do first?  
- A. Check how the data was collected — weight 3; `str:Intellectual & Analytical`
- B. Choose the report from the more credible source — weight 1
- C. Examine how the data was analysed — weight 3; `str:Intellectual & Analytical`
- D. Look for additional evidence — weight 2

**Q78** · Technology Adoption · Weighted  
Your organisation introduces a new technology that changes how you work. Your initial response is most likely to be:  
- A. Explore its benefits and learn it — weight 3
- B. Compare it with the existing method — weight 2
- C. Wait until someone trains you — weight 1
- D. Continue with the old method until required to change — weight 0

**Q79** · Technology Adoption · Preference  
You are most likely to adopt a new technology when:  
- A. It clearly improves results — “Results-driven”; `str:Execution & Achievement`
- B. It makes your work faster — “Efficiency-driven”
- C. It provides opportunities to learn — “Learning-driven”; `mot:Learning`
- D. It becomes widely accepted in your field — “Follows the field”

**Q80** · Future Skills · Preference  
Which ability do you think will become increasingly important across many careers?  
- A. Continuous learning — “Continuous learning”; `mot:Learning`
- B. Working effectively with technology — “Technology fluency”
- C. Solving unfamiliar problems — “Novel problem-solving”; `str:Intellectual & Analytical`
- D. Communicating and collaborating effectively — “Collaboration”; `str:Relationship & Adaptability`

**Q81** · Future Skills · Weighted  
If your current field changes substantially over the next five years, you would prefer to:  
- A. Develop new skills within the same field — weight 3
- B. Combine your existing expertise with a new field — weight 3; `str:Strategic & Futuristic`
- C. Move toward an emerging area — weight 2; `mot:Variety`
- D. Wait until the direction of the industry becomes clearer — weight 0

**Q82** · Future Skills · Weighted  
When learning a new skill that may not be immediately useful, you are most likely to:  
- A. Learn it if it could create future opportunities — weight 3; `str:Strategic & Futuristic`
- B. Learn it only when there is a clear application — weight 1
- C. Explore it out of curiosity — weight 3; `mot:Learning`
- D. Prioritise skills directly relevant to my current path — weight 1

## Pillar 7 — Career & Employability Readiness

**Q83** · Career Readiness · Weighted  
How clearly can you describe the type of professional role you want to pursue after graduation?  
- A. Very clearly — weight 3
- B. I have a few possible directions — weight 2
- C. I have a general idea but not a specific direction — weight 1
- D. I am still exploring — weight 0

**Q84** · Career Readiness · Weighted  
How well do you understand the qualifications, skills and experience required for your intended career direction?  
- A. Very well — weight 3
- B. Reasonably well — weight 2
- C. I know some requirements — weight 1
- D. I have not investigated them deeply — weight 0

**Q85** · Experience · Weighted  
Which best describes your exposure to real-world professional environments?  
- A. Internship/work experience in my field — weight 3
- B. Projects, competitions, volunteering or similar experiences — weight 2
- C. Short-term exposure through workshops or events — weight 1
- D. Mostly academic exposure so far — weight 0

**Q86** · Experience · Preference  
When participating in a project outside regular coursework, your main objective is usually to:  
- A. Gain practical experience — “Practical experience”; `str:Execution & Achievement`
- B. Build something I can demonstrate professionally — “Portfolio building”; `mot:Achievement`
- C. Learn something new — “Learning”; `mot:Learning`
- D. Strengthen my academic profile — “Academic profile”

**Q87** · Skill Portfolio · Weighted  
If an employer asked you to demonstrate your strongest skills, you could currently show them through:  
- A. Projects or work samples — weight 3
- B. Certifications or formal qualifications — weight 2
- C. Internships or practical experience — weight 3
- D. I would mainly describe my abilities verbally — weight 0

**Q88** · Skill Portfolio · Weighted  
How intentionally are you building skills beyond your university curriculum?  
- A. Very intentionally with a clear plan — weight 3
- B. Regularly, but based on opportunities — weight 2
- C. Occasionally when something interests me — weight 1
- D. Not yet in a structured way — weight 0

**Q89** · Skill Gaps · Weighted  
When you compare your current abilities with those required for your desired professional direction, you:  
- A. Know exactly which skills I need to strengthen — weight 3
- B. Know some of the gaps — weight 2
- C. Have a general sense but not a clear picture — weight 1
- D. Have not yet compared them — weight 0

**Q90** · Professional Identity · Weighted  
If someone asked, "What professional value can you bring to an organisation?", you would:  
- A. Clearly describe my strengths and evidence — weight 3
- B. Explain my academic knowledge and interests — weight 1
- C. Describe the skills I am currently developing — weight 2
- D. Find it difficult to answer — weight 0

**Q91** · Professional Identity · Weighted  
How intentionally are you building your professional identity through projects, networking, portfolios, online presence or other activities?  
- A. Very intentionally — weight 3
- B. To some extent — weight 2
- C. Occasionally — weight 1
- D. Not yet — weight 0

## Pillar 8 — Future Career Adaptability & Fit

**Q92** · Learning Agility · Weighted  
When you encounter something you do not know, your usual response is to:  
- A. Learn enough to solve the immediate problem — weight 2
- B. Explore the topic deeply — weight 3; `mot:Learning`
- C. Find someone who can teach you — weight 2
- D. Look for an alternative way around the problem — weight 1

**Q93** · Learning Agility · Preference  
Which learning situation is most comfortable for you?  
- A. Learning by doing — “Hands-on”; `mbti:S`
- B. Learning through structured courses — “Structured courses”; `mbti:J`
- C. Learning independently through exploration — “Self-directed”; `mbti:I`
- D. Learning through discussion and collaboration — “Collaborative”; `mbti:E`

**Q94** · Adaptability · Weighted  
If your planned career path became significantly less attractive because of industry changes, you would most likely:  
- A. Identify adjacent career options using your existing skills — weight 3; `str:Strategic & Futuristic`
- B. Retrain for a different direction — weight 2
- C. Wait to see whether the situation improves — weight 0
- D. Explore several completely different possibilities — weight 2; `mot:Variety`

**Q95** · Adaptability · Weighted  
When entering an unfamiliar environment, you usually:  
- A. Observe first and then adjust — weight 3; `mbti:I`
- B. Quickly interact and learn from people — weight 3; `mbti:E`, `str:Relationship & Adaptability`
- C. Establish a routine as soon as possible — weight 2; `mbti:J`
- D. Experiment until you find what works — weight 2; `mbti:P`

**Q96** · Sector Fit · Preference  
Which type of sector environment would you most naturally prefer?  
- A. A highly specialised technical or professional sector — “Technical / professional”; `riasec:R`
- B. A research and knowledge-intensive sector — “Research & knowledge”; `riasec:I`
- C. A people-focused service or social sector — “People & social”; `riasec:S`
- D. A commercial, entrepreneurial or competitive sector — “Commercial & entrepreneurial”; `riasec:E`

**Q97** · Sector Fit · Preference  
If you discovered that your skills could be applied across several industries, you would prefer to:  
- A. Build deep expertise in one industry — “Industry specialist”
- B. Explore multiple industries before specialising — “Explore first”; `mot:Variety`
- C. Choose the industry with the strongest growth opportunities — “Growth-led”; `mot:Achievement`
- D. Choose the industry that best matches your interests and values — “Values-led”; `mot:Purpose`

**Q98** · Geographic Mobility · Preference  
If your preferred career opportunity required you to relocate to another city or country, you would most likely:  
- A. Relocate if the opportunity significantly supports my career — “Mobile for the right role”
- B. Consider it depending on personal circumstances — “Open, depending on circumstances”
- C. Prefer to remain in my current location — “Prefers current location”
- D. Actively seek opportunities that provide international exposure — “Seeks international exposure”

**Q99** · Long-Term Adaptability · Preference  
When you imagine your career 10 years from now, which statement best describes your preference?  
- A. I want to become a recognised expert in one area — “Recognised expert”; `mot:Learning`
- B. I want to grow into leadership and greater responsibility — “Leader”; `mot:Leadership`, `str:Influence & Leadership`
- C. I want to build a career that allows multiple transitions — “Multiple transitions”; `mot:Variety`
- D. I want to develop a combination of expertise across different areas — “Combined expertise”; `str:Strategic & Futuristic`

**Q100** · Long-Term Adaptability · Preference  
Which statement best describes your approach to your long-term career?  
- A. I prefer to define a clear destination and work systematically toward it — “Destination planner”; `mbti:J`
- B. I prefer a direction but want flexibility to change along the way — “Flexible direction”; `mbti:P`
- C. I prefer to explore opportunities and let experience shape my direction — “Explorer”; `mbti:P`
- D. I want to continuously reinvent my career as my interests and the world change — “Reinventor”; `mbti:N`

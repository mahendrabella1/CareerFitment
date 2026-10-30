/**
 * Track T4 (Undergraduate, "Professional Communication"), modules 3-8
 * (spec §4): presentations, GD and HR rounds, interview mastery, workplace
 * communication, IELTS/TOEFL-style speaking, and the capstone portfolio.
 * Videos checked embeddable October 2026; takeaways follow each video's
 * chapters and description - `reviewedBy: "pending"` until a teacher has
 * watched them.
 */
import type { Module } from "../types";
import { v } from "./shared";

export const T4_M3: Module = {
  id: "m3",
  title: "Presentation Skills",
  summary: "Plan a talk, design clean slides, and deliver a 3-minute presentation.",
  outcomes: ["Choose a delivery style that suits the talk", "Design slides that support, not repeat, what you say", "Deliver a 3-minute presentation and handle questions"],
  minutes: 65,
  badge: { id: "presenter", title: "Presenter" },
  lessons: [
    {
      id: "t4-m3-l1", type: "video", title: "The Best Way to Give a Presentation", minutes: 9, xp: 10, skill: "listening",
      youtubeId: "1sOgYNgq88E", durationSec: 487, channel: "TED-Ed", reviewedBy: "pending",
      takeaways: [
        "Start by developing the talk itself - the idea you want the audience to leave with.",
        "Then choose a delivery style: memorising a script, speaking from a script or notes, or speaking unscripted from an outline.",
        "Each style has trade-offs; choose the plan that lets you communicate your idea confidently.",
      ],
      check: [
        { q: "What comes before choosing a delivery style?", options: ["Developing the talk and its idea", "Designing the slides", "Booking the room"], answer: 0 },
        { q: "Which is a delivery style discussed?", options: ["Speaking unscripted from an outline", "Reading slides word for word", "Playing a recording"], answer: 0 },
        { q: "How should you pick your style?", options: ["Whatever lets you communicate the idea confidently", "Always memorise", "Always improvise"], answer: 0 },
      ],
    },
    {
      id: "t4-m3-l2", type: "reading", title: "Structure, Slides and Q&A", minutes: 8, xp: 10, skill: "reading",
      body: [
        "Most student presentations fail in the same three ways: no clear message, slides full of text, and a rushed ending. Fix those and you're ahead of most of the room.",
        { h: "Structure" },
        { list: ["Open with the problem or a question - why should they care?", "State your message in one sentence early: \"Our survey shows the canteen queue, not the food, is why students skip lunch.\"", "Three supporting points, each with evidence.", "Close with the message again and what you want them to do or decide."] },
        { h: "Slides" },
        { list: ["One idea per slide; the title states the takeaway (\"Queues peak at 1:05 p.m.\"), not the topic (\"Queue data\").", "Few words, large text - if you need to read it, they will too, and stop listening.", "One clear chart beats a table of numbers; highlight the bar that matters.", "Keep detail in the handout or appendix."] },
        { h: "Delivery" },
        { list: ["Rehearse out loud at least three times; time it.", "Face the audience, not the screen.", "Pause after each key point."] },
        { h: "Q&A" },
        { list: ["Listen to the whole question; repeat it if the room didn't hear.", "Answer briefly, then check: \"Does that answer your question?\"", "If you don't know: \"I don't have that number - I'll email it to you today.\""] },
      ],
    },
    {
      id: "t4-m3-l3", type: "activity", title: "Fix the Slide", minutes: 5, xp: 20, skill: "reading",
      activity: {
        kind: "choice", prompt: "Choose the best fix.",
        scenarios: [
          { situation: "A slide titled \"Results\" with 12 bullet points.", options: [
            { text: "Make the font smaller so it all fits.", why: "Smaller text is harder to read and still too much." },
            { text: "Retitle it with the main finding and keep 2-3 key points; move the rest to an appendix.", best: true, why: "A takeaway title and less text keep attention on you." },
            { text: "Read all 12 points aloud.", why: "Reading slides loses the audience." },
          ] },
          { situation: "Your data slide is a table with 40 numbers.", options: [
            { text: "Show one chart of the comparison that matters, with that bar highlighted.", best: true, why: "The audience sees the point in seconds." },
            { text: "Add more colours to the table.", why: "Colour doesn't fix too much data." },
            { text: "Tell people to read it later.", why: "Then it doesn't belong on the slide." },
          ] },
          { situation: "You've run out of time with two slides left.", options: [
            { text: "Speed-read the last two slides.", why: "Rushing the end weakens your message." },
            { text: "Skip to your conclusion slide and restate your message.", best: true, why: "Protect the ending - it's what people remember." },
            { text: "Ask for ten more minutes.", why: "Respect the time limit." },
          ] },
        ],
      },
    },
    {
      id: "t4-m3-l4", type: "activity", title: "Order the Presentation", minutes: 4, xp: 20, skill: "writing",
      activity: { kind: "order", prompt: "Put these parts of a 3-minute project presentation in the best order.", items: [
        "\"Raise your hand if you've skipped lunch because of the queue.\"",
        "\"Our message: the queue, not the food, is why students skip lunch.\"",
        "\"Our survey of 200 students found the queue peaks between 1:00 and 1:15.\"",
        "\"A second counter for packed meals would halve waiting time, based on our test day.\"",
        "\"So we're asking the committee to approve a second counter for one month's trial.\"",
        "\"Happy to take your questions.\"",
      ] },
    },
    {
      id: "t4-m3-l5", type: "task", title: "Plan a 5-Slide Deck", minutes: 20, xp: 40, skill: "writing",
      instructions: "Plan a 5-slide presentation on a project, internship or topic from your course. For each slide write: the takeaway title, 1-3 key points, and the visual you'd use (chart, photo, diagram). Start with the problem and end with your message and ask.",
      minWords: 120, maxWords: 320,
      rubric: ["Each slide title states a takeaway", "Clear message that runs through the deck", "Little text per slide; visuals suggested", "Opens with the problem and closes with the message and ask", "Logical flow"],
    },
    {
      id: "t4-m3-l6", type: "voice", title: "Your 3-Minute Presentation", minutes: 10, xp: 30, skill: "speaking",
      prompt: v({
        id: "t4-m3-voice", type: "topic", minSec: 140, maxSec: 210, targetSec: 180,
        text: "Deliver your 5-slide presentation in about three minutes, as if presenting to a panel. Open with the problem, state your message early, cover your points with evidence, and close with your message and ask.",
        tips: ["Say your one-sentence message within the first 30 seconds.", "Signpost each slide: \"Next, the data...\"", "Slow down for the close."],
      }),
    },
    {
      id: "t4-m3-l7", type: "quiz", title: "Module Check-in", minutes: 5, xp: 20, skill: "reading", assessment: true,
      reflection: "Listen to your recording: where did you rush, and where did you pause well?",
      questions: [
        { q: "A strong slide title...", options: ["States the takeaway", "Just names the topic", "Is left blank"], answer: 0 },
        { q: "Where should your main message appear?", options: ["Early, and again at the end", "Only on the last slide", "Nowhere - let them guess"], answer: 0 },
        { q: "Why avoid slides full of text?", options: ["The audience reads instead of listening", "Text is not allowed", "It saves ink"], answer: 0 },
        { q: "You don't know the answer to a question. Best response:", options: ["Say so and offer to follow up", "Guess a number", "Ignore it"], answer: 0 },
        { q: "You're running out of time. You should...", options: ["Jump to your conclusion", "Talk faster", "Skip the conclusion"], answer: 0 },
      ],
    },
  ],
};

export const T4_M4: Module = {
  id: "m4",
  title: "Group Discussion and HR Rounds",
  summary: "Handle campus-placement GDs and the HR interview with clear, honest answers.",
  outcomes: ["Know how campus selection rounds work", "Stand out in a placement GD", "Answer \"Tell me about yourself\" and other HR questions"],
  minutes: 60,
  badge: { id: "placement-ready", title: "Placement Ready" },
  lessons: [
    {
      id: "t4-m4-l1", type: "video", title: "Answering \"Tell Me About Yourself\"", minutes: 5, xp: 10, skill: "listening",
      youtubeId: "Oy6S0iTZx54", durationSec: 296, channel: "Career Sidekick", reviewedBy: "pending",
      takeaways: [
        "\"Tell me about yourself\" can be answered in three simple steps.",
        "Who are you and what do you do? Why should they care? What do you want?",
        "Practise, then record yourself giving the answer so you can see and hear how it comes across.",
      ],
      check: [
        { q: "What's the first step in the answer?", options: ["Who you are and what you do", "Your salary expectation", "Your family background"], answer: 0 },
        { q: "\"Why should they care?\" means...", options: ["What value you bring them", "Why you're nervous", "Your hobbies"], answer: 0 },
        { q: "What does the video suggest after practising?", options: ["Record yourself and watch it back", "Memorise it word for word", "Skip practice"], answer: 0 },
      ],
    },
    {
      id: "t4-m4-l2", type: "reading", title: "Campus Rounds: GD and HR", minutes: 8, xp: 10, skill: "reading",
      body: [
        "Many campus placements follow a similar path: an online aptitude test, then (at some companies) a group discussion, one or more technical interviews, and an HR interview. Each round filters for something different.",
        { h: "The placement GD" },
        { list: ["Topics are often current affairs, business or abstract (\"Work from home is here to stay\", \"Red\").", "Recruiters look for clear points, listening, teamwork and composure - not volume.", "Speak 3-4 times with substance; one strong, early entry helps.", "If you can, close with a fair summary."] },
        { h: "The HR round" },
        "HR checks fit, attitude and honesty. Common questions:",
        { list: ["Tell me about yourself.", "Why this company? Why this role?", "Strengths and a real weakness (with what you're doing about it).", "Are you willing to relocate or work shifts?", "Where do you see yourself in five years?", "Do you have other offers? What are your salary expectations?"] },
        { h: "Rules for HR answers" },
        { list: ["Be honest - HR will check facts against your resume.", "Research the company: what it does, a recent project or product, its values.", "For a fresher, salary: \"I'd go with the company's standard package for this role.\"", "Never criticise a previous employer, college or teammate."] },
      ],
    },
    {
      id: "t4-m4-l3", type: "activity", title: "GD Simulation", minutes: 6, xp: 20, skill: "reading",
      activity: {
        kind: "choice", prompt: "Placement GD: \"Should India move to a four-day work week?\" Choose your best move.",
        scenarios: [
          { situation: "The moderator starts the clock and there's silence.", options: [
            { text: "Open by framing it: \"Let's look at productivity, employee well-being and which sectors could manage it.\"", best: true, why: "A structured opening gives the group direction - and marks you as a leader." },
            { text: "Wait until everyone else has spoken.", why: "A late first entry is harder in a crowded GD." },
            { text: "Say \"I agree\" without a reason.", why: "Agreement without substance earns no credit." },
          ] },
          { situation: "One participant is dominating and others can't get in.", options: [
            { text: "Talk over them.", why: "Recruiters mark down aggression." },
            { text: "When they pause: \"Good point - I'd like to hear from Neha, who hasn't spoken yet.\"", best: true, why: "You show teamwork and calm leadership." },
            { text: "Complain to the moderator.", why: "Handle it within the group." },
          ] },
          { situation: "Someone says a statistic you know is wrong.", options: [
            { text: "\"I think the latest figure is different - but even taking that number, my point is...\"", best: true, why: "Polite correction, then you move the discussion forward." },
            { text: "\"That's completely wrong.\"", why: "Too blunt - it turns the GD into a fight." },
            { text: "Ignore it.", why: "A wrong fact left unchallenged can steer the group wrongly." },
          ] },
        ],
      },
    },
    {
      id: "t4-m4-l4", type: "activity", title: "What HR Is Really Asking", minutes: 4, xp: 20, skill: "reading",
      activity: { kind: "match", prompt: "Match each HR question to what it checks.", pairs: [
        ["\"Why this company?\"", "Have you researched us, and do you really want this?"],
        ["\"What's your biggest weakness?\"", "Self-awareness and honesty"],
        ["\"Where do you see yourself in five years?\"", "Your goals and whether you'll stay"],
        ["\"Are you willing to relocate?\"", "Practical fit for the role"],
        ["\"Tell me about a conflict in your team.\"", "How you handle people and pressure"],
      ] },
    },
    {
      id: "t4-m4-l5", type: "task", title: "Write Your HR Answers", minutes: 15, xp: 40, skill: "writing",
      instructions: "Write your answers to two HR questions for a role you'd apply to: (1) \"Tell me about yourself\" - using who you are and what you do, why they should care, and what you want; and (2) \"Why should we hire you?\" - with three reasons, each backed by evidence.",
      minWords: 150, maxWords: 300,
      rubric: ["\"Tell me about yourself\" follows the three steps", "Tailored to a specific role", "Reasons backed by concrete evidence", "Honest, confident and concise", "Correct grammar"],
    },
    {
      id: "t4-m4-l6", type: "voice", title: "GD Opening + HR Answer", minutes: 8, xp: 30, skill: "speaking",
      prompt: v({
        id: "t4-m4-voice", type: "interview", minSec: 75, maxSec: 150, targetSec: 110,
        text: "Two parts in one recording. First, a 45-second GD opening on \"Work from home is here to stay\". Then say \"HR round\" and answer \"Tell me about yourself\" in about 60 seconds.",
        tips: ["Frame the GD topic before taking a side.", "Pause clearly between the two parts.", "In the HR answer: who you are, why they should care, what you want."],
      }),
    },
    {
      id: "t4-m4-l7", type: "quiz", title: "Module Check-in", minutes: 5, xp: 20, skill: "reading", assessment: true,
      reflection: "Which HR question would you least like to be asked? Draft a first answer to it now.",
      questions: [
        { q: "What do recruiters reward in a GD?", options: ["Clear points, listening and composure", "The loudest voice", "Speaking the most"], answer: 0 },
        { q: "A good answer to \"What's your weakness?\"", options: ["A real weakness and what you're doing about it", "\"I'm a perfectionist\" with no detail", "\"I have none\""], answer: 0 },
        { q: "Why must HR answers match your resume?", options: ["HR checks facts and consistency", "They don't need to", "It makes them longer"], answer: 0 },
        { q: "A fresher asked about salary can say...", options: ["\"I'd go with the company's standard package for this role.\"", "\"As much as possible.\"", "Refuse to answer"], answer: 0 },
        { q: "\"Tell me about yourself\" should cover...", options: ["Who you are, why they should care, what you want", "Your whole life story", "Your weaknesses only"], answer: 0 },
      ],
    },
  ],
};

export const T4_M5: Module = {
  id: "m5",
  title: "Interview Mastery",
  summary: "Build a story bank and answer behavioural questions with STAR and PAR.",
  outcomes: ["Recognise behavioural questions", "Build a bank of reusable stories", "Complete a 5-question mock interview"],
  minutes: 70,
  badge: { id: "interview-ace", title: "Interview Ace" },
  lessons: [
    {
      id: "t4-m5-l1", type: "video", title: "Behavioural Questions with STAR", minutes: 9, xp: 10, skill: "listening",
      youtubeId: "ZSSID5mp93o", durationSec: 522, channel: "Self Made Millennial", reviewedBy: "pending",
      takeaways: [
        "Behavioural questions (\"Tell me about a time when...\") ask for real examples of how you acted in the past.",
        "Prepare a \"toolbox\" of stories in advance, so you can adapt one to many different questions.",
        "A simple structure - STAR, or PAR (Problem, Action, Result) - keeps each story tight and focused on what you did.",
      ],
      check: [
        { q: "What do behavioural questions ask for?", options: ["Real examples of past behaviour", "Hypothetical opinions", "Technical definitions"], answer: 0 },
        { q: "What's the \"story toolbox\" idea?", options: ["Prepare stories you can adapt to many questions", "Memorise one answer", "Avoid stories"], answer: 0 },
        { q: "PAR stands for...", options: ["Problem, Action, Result", "Plan, Act, Review", "Point, Answer, Repeat"], answer: 0 },
      ],
    },
    {
      id: "t4-m5-l2", type: "reading", title: "Your Story Bank", minutes: 8, xp: 10, skill: "reading",
      body: [
        "Most interviews mix four kinds of questions: about you, behavioural (\"Tell me about a time...\"), situational (\"What would you do if...\"), and technical or case questions. Stories handle the first three.",
        { h: "Build a bank of 6-8 stories" },
        "Pick experiences from projects, internships, clubs, part-time work and coursework. Each story should be able to answer several questions:",
        { list: ["A challenge or failure - and what you learned", "Teamwork - and a disagreement you helped resolve", "Leadership or taking initiative", "A tight deadline or juggling priorities", "A mistake you owned and fixed", "Learning something new quickly", "Going beyond what was asked"] },
        { h: "Make each story strong" },
        { list: ["Keep it to 60-90 seconds.", "Situation and task in two sentences; spend most of the time on your actions.", "End with a measurable result and one learning.", "Use \"I\" for your part and give the team credit for theirs."] },
        { example: "\"Our final-year project's sensor kept giving noisy readings two weeks before the demo (Problem). I tested each component, found the power supply was causing interference, added a filter circuit and rewrote the averaging code (Action). Readings stabilised to within 2%, and we were rated the top project in the department (Result).\"" },
        { h: "Technical and situational questions" },
        { list: ["Think aloud - interviewers want your reasoning, not only the answer.", "Clarify the question before solving.", "For \"What would you do if...\", answer, then back it with a real example."] },
        { h: "After the interview" },
        "Send a short thank-you email within a day. OneGrasp's Resume & Interview section can draft one from your application.",
      ],
    },
    {
      id: "t4-m5-l3", type: "activity", title: "STAR Builder", minutes: 4, xp: 20, skill: "writing",
      activity: { kind: "order", prompt: "\"Tell me about a time you handled a tight deadline.\" Put this answer in STAR order.", items: [
        "During my internship at a logistics start-up, a client asked for a delivery-route report a week early.",
        "I had five days instead of twelve to clean three months of data and present the findings.",
        "I split the work into daily goals, automated the cleaning with a Python script, and checked my draft with my manager on day three.",
        "We delivered on time, the client extended their contract, and my script is now used for every monthly report.",
      ] },
    },
    {
      id: "t4-m5-l4", type: "activity", title: "Make the Result Count", minutes: 5, xp: 20, skill: "reading",
      activity: {
        kind: "choice", prompt: "Choose the strongest way to end the story.",
        scenarios: [
          { situation: "A story about improving a college fest's ticket sales.", options: [
            { text: "\"...and it went really well.\"", why: "Vague - no evidence of impact." },
            { text: "\"...ticket sales rose from 600 to 1,100, and the committee now uses our online booking every year.\"", best: true, why: "Numbers plus a lasting change." },
            { text: "\"...and everyone was happy.\"", why: "Nice, but not measurable." },
          ] },
          { situation: "A story about a mistake you made.", options: [
            { text: "\"...it wasn't really my fault.\"", why: "Deflecting blame is a red flag." },
            { text: "\"...I fixed it within a day, told my lead, and now I double-check every data source - it hasn't happened again.\"", best: true, why: "Ownership, a fix and a lasting learning." },
            { text: "\"...luckily nobody noticed.\"", why: "Suggests you'd hide mistakes." },
          ] },
          { situation: "A team project story.", options: [
            { text: "\"...we got an A.\"", why: "A result, but it doesn't show your part." },
            { text: "\"...my testing plan cut our bugs before submission from 30 to 4, and we got the top grade.\"", best: true, why: "Your contribution, measured, plus the team result." },
            { text: "\"...I did everything myself.\"", why: "Sounds like you can't work in a team." },
          ] },
        ],
      },
    },
    {
      id: "t4-m5-l5", type: "task", title: "Build Your Story Bank", minutes: 25, xp: 40, skill: "writing",
      instructions: "Write three STAR (or PAR) stories from your own experience: a challenge or failure, teamwork or a disagreement, and leadership or initiative. Label each part, use \"I\" for your actions, and end each with a measurable result and one learning.",
      minWords: 250, maxWords: 480,
      rubric: ["Three complete stories with clear structure", "Actions are specific and personal", "Results are measurable where possible", "Each ends with a learning", "Concise and well written"],
    },
    {
      id: "t4-m5-l6", type: "voice", title: "Mock Interview: 5 Questions", minutes: 12, xp: 30, skill: "speaking",
      prompt: v({
        id: "t4-m5-voice", type: "interview", minSec: 150, maxSec: 330, targetSec: 240,
        text: "Answer five questions in one recording, saying the number first, about 45 seconds each: (1) Tell me about yourself. (2) Tell me about a time you failed. (3) Describe a disagreement in a team and how you handled it. (4) What would you do if you were given a task you'd never done before? (5) Why should we hire you?",
        tips: ["Use your story bank - one story can answer two questions.", "For question 4, answer, then back it with a real example.", "Finish each answer with a result, not a trail-off."],
      }),
    },
    {
      id: "t4-m5-l7", type: "quiz", title: "Module Check-in", minutes: 5, xp: 20, skill: "reading", assessment: true,
      reflection: "Which story in your bank is the most versatile? Which question type still needs a story?",
      questions: [
        { q: "\"What would you do if a client was unhappy?\" is a...", options: ["Situational question", "Behavioural question", "Technical question"], answer: 0 },
        { q: "How many stories should a good bank have?", options: ["6-8 adaptable stories", "One", "Fifty"], answer: 0 },
        { q: "For a technical question, interviewers mainly want...", options: ["Your reasoning, said aloud", "Silence until you're sure", "A memorised definition"], answer: 0 },
        { q: "Best ending for a story about a mistake:", options: ["What you fixed and what you changed since", "That it wasn't your fault", "That nobody noticed"], answer: 0 },
        { q: "When should you send a thank-you email?", options: ["Within a day of the interview", "After a month", "Never"], answer: 0 },
      ],
    },
  ],
};

export const T4_M6: Module = {
  id: "m6",
  title: "Workplace Communication",
  summary: "Give and receive feedback, handle conflict, and keep your team informed.",
  outcomes: ["Give feedback with the four-part formula", "Handle disagreements calmly and early", "Write clear status updates"],
  minutes: 60,
  badge: { id: "feedback-pro", title: "Feedback Pro" },
  lessons: [
    {
      id: "t4-m6-l1", type: "video", title: "The Secret to Giving Great Feedback", minutes: 5, xp: 10, skill: "listening",
      youtubeId: "wtl5UrrgU8c", durationSec: 302, channel: "TED (LeeAnn Renninger)", reviewedBy: "pending",
      takeaways: [
        "Most feedback fails because it's vague or puts people on the defensive.",
        "The four-part formula: ask a \"micro-yes\" question, give specific data points, say the impact, and end with a question.",
        "Effective people also actively ask for feedback themselves.",
      ],
      check: [
        { q: "What is a \"micro-yes\" question?", options: ["Asking if the person is ready for feedback", "A yes/no quiz", "Agreeing with everything"], answer: 0 },
        { q: "What makes a good data point?", options: ["Something specific you observed", "A general label like \"unprofessional\"", "A rumour"], answer: 0 },
        { q: "How does the formula end?", options: ["With a question", "With a warning", "With silence"], answer: 0 },
      ],
    },
    {
      id: "t4-m6-l2", type: "reading", title: "Feedback, Conflict and Updates", minutes: 8, xp: 10, skill: "reading",
      body: [
        "At work, most problems aren't about skill - they're about something that wasn't said, was said too late, or was said badly.",
        { h: "Giving feedback: four parts" },
        { list: ["Micro-yes: \"Do you have five minutes for some feedback on the report?\"", "Data point: \"The report was due at 10 and came in at 4.\" (Observable, not \"you're careless\".)", "Impact: \"Because of that, I couldn't send it to the client today.\"", "Question: \"What happened, and how can we avoid it next time?\""] },
        { h: "Receiving feedback" },
        { list: ["Listen fully; don't defend yourself mid-sentence.", "Ask for an example if it's vague.", "Thank them, even if you disagree.", "Act on it - then tell them you did."] },
        { h: "Handling conflict" },
        { list: ["Raise it early and in private.", "Use \"I\" statements: \"I'm worried we'll miss the deadline\", not \"You always delay\".", "Look for the shared goal behind both positions.", "Agree on a next step and a check-in date."] },
        { h: "Status updates that people read" },
        { list: ["Lead with the status: on track, at risk or blocked.", "What's done, what's next, what you need.", "Flag risks early - bad news gets worse with age."] },
        { example: "\"Status: at risk. Done: survey design and 60 of 100 responses. Next: chase the remaining 40 by Wednesday. Need: approval to extend the deadline by two days if we fall short.\"" },
      ],
    },
    {
      id: "t4-m6-l3", type: "activity", title: "Feedback and Conflict Scenarios", minutes: 6, xp: 20, skill: "reading",
      activity: {
        kind: "choice", prompt: "Choose the best response.",
        scenarios: [
          { situation: "A teammate has missed two deadlines this month.", options: [
            { text: "Mention it in the team group chat so everyone knows.", why: "Public criticism makes people defensive." },
            { text: "Privately: \"Got a few minutes? The last two drafts came in a day late, which pushed back our reviews. What's getting in the way?\"", best: true, why: "Micro-yes, data, impact and a question - in private." },
            { text: "Say nothing and do their work yourself.", why: "The problem continues and you burn out." },
          ] },
          { situation: "Your manager says your presentation was \"not great\".", options: [
            { text: "\"Thanks - could you point to one or two parts I should change first?\"", best: true, why: "Asking for specifics turns vague feedback into something useful." },
            { text: "\"It was fine, you just didn't get it.\"", why: "Defensive - it closes the conversation." },
            { text: "Nod and change nothing.", why: "Feedback you don't act on is wasted." },
          ] },
          { situation: "You and a colleague disagree on which design to use.", options: [
            { text: "\"We both want users to finish sign-up faster. Could we test both designs with five users and decide on the data?\"", best: true, why: "Finds the shared goal and a fair way to decide." },
            { text: "Escalate to the manager immediately.", why: "Try to resolve it together first." },
            { text: "Insist on your design because you've been there longer.", why: "Seniority isn't a reason." },
          ] },
          { situation: "You realise you'll miss a deadline in three days.", options: [
            { text: "Wait and hope you'll catch up.", why: "Late surprises damage trust more than early warnings." },
            { text: "Tell your lead today: what's done, what's left, a new date, and what would help.", best: true, why: "Early, specific and solution-focused." },
            { text: "Submit incomplete work without saying anything.", why: "It hides the problem." },
          ] },
        ],
      },
    },
    {
      id: "t4-m6-l4", type: "activity", title: "Order the Feedback", minutes: 4, xp: 20, skill: "writing",
      activity: { kind: "order", prompt: "Put this feedback in the four-part order.", items: [
        "\"Hey Kabir, do you have a couple of minutes for some feedback on today's client call?\"",
        "\"When the client asked about pricing, you said you'd check, but we didn't send it afterwards.\"",
        "\"They followed up with our manager, and it made our team look disorganised.\"",
        "\"How do you think we could make sure follow-ups don't slip next time?\"",
      ] },
    },
    {
      id: "t4-m6-l5", type: "task", title: "Write the Feedback Message", minutes: 12, xp: 40, skill: "writing",
      instructions: "A project teammate has stopped replying to messages for a week and the deadline is close. Write the message you'd send them (or the opening of a conversation) using the four parts: micro-yes, data point, impact, question. Then add a short status update for your lead.",
      minWords: 100, maxWords: 230,
      rubric: ["Uses all four feedback parts", "Specific and observable, not a personal attack", "Respectful and calm tone", "Status update leads with status and next steps", "Clear and concise"],
    },
    {
      id: "t4-m6-l6", type: "voice", title: "Role-play: Giving Feedback", minutes: 6, xp: 30, skill: "speaking",
      prompt: v({
        id: "t4-m6-voice", type: "roleplay", minSec: 45, maxSec: 120, targetSec: 75,
        text: "Role-play: you're the project lead. A teammate's code has broken the build twice this week, and they didn't tell anyone. Speak to them as you would in a one-to-one: micro-yes, data point, impact, and a question. Stay kind and specific.",
        tips: ["Start by asking if they have a few minutes.", "Describe what happened, not what kind of person they are.", "End with a genuine question and listen."],
        modelAnswer: "Hey Arjun, do you have five minutes for some quick feedback? On Tuesday and again this morning, the build broke after your commits, and we found out only when QA flagged it. Because of that, the testing team lost about half a day each time, and we're now behind for Friday's release. I know you're juggling a lot - what do you think happened, and could we agree that you run the tests before pushing and give the channel a heads-up if something breaks?",
      }),
    },
    {
      id: "t4-m6-l7", type: "quiz", title: "Module Check-in", minutes: 5, xp: 20, skill: "reading", assessment: true,
      reflection: "Think of feedback you've been holding back. How would you say it using the four parts?",
      questions: [
        { q: "Which is a data point, not a judgement?", options: ["\"The report came in at 4 p.m.\"", "\"You're lazy.\"", "\"You never care.\""], answer: 0 },
        { q: "Where should critical feedback be given?", options: ["In private", "In the group chat", "In front of the client"], answer: 0 },
        { q: "An \"I\" statement sounds like...", options: ["\"I'm worried we'll miss the deadline.\"", "\"You always delay.\"", "\"Everyone thinks you're slow.\""], answer: 0 },
        { q: "A status update should lead with...", options: ["On track, at risk or blocked", "A long background", "An apology"], answer: 0 },
        { q: "When is the best time to warn about a missed deadline?", options: ["As soon as you know", "On the deadline day", "After it's passed"], answer: 0 },
      ],
    },
  ],
};

export const T4_M7: Module = {
  id: "m7",
  title: "IELTS/TOEFL-style Speaking",
  summary: "Know the test format and practise all three parts of a speaking test.",
  outcomes: ["Understand the IELTS speaking format and criteria", "Plan a cue-card talk in one minute", "Complete a Part 1-2-3 simulation"],
  minutes: 60,
  badge: { id: "test-ready", title: "Test Ready" },
  lessons: [
    {
      id: "t4-m7-l1", type: "video", title: "How to Start Your Part 2 Talk", minutes: 6, xp: 10, skill: "listening",
      youtubeId: "f5t8EQrg5dI", durationSec: 313, channel: "IELTS Liz", reviewedBy: "pending",
      takeaways: [
        "How you begin your Part 2 talk matters - a good start sets up a fluent talk.",
        "Having a ready way to begin takes the pressure off the first few seconds, so you get into the topic smoothly and keep talking.",
        "The tips are aimed at candidates working towards band 6 and above.",
      ],
      check: [
        { q: "Which part of the speaking test is the video about?", options: ["Part 2 - the long talk", "Part 1 - the interview", "Writing Task 1"], answer: 0 },
        { q: "What does a good start help you do?", options: ["Get into the topic and keep talking fluently", "Finish early", "Avoid the cue card"], answer: 0 },
        { q: "Who are the tips aimed at?", options: ["Candidates aiming for band 6 and above", "Only native speakers", "Examiners"], answer: 0 },
      ],
    },
    {
      id: "t4-m7-l2", type: "reading", title: "The Speaking Test, Part by Part", minutes: 8, xp: 10, skill: "reading",
      body: [
        "The IELTS Speaking test is a face-to-face conversation with an examiner, lasting 11-14 minutes, in three parts.",
        { list: ["Part 1 (4-5 minutes): questions about familiar topics - your studies, home town, hobbies.", "Part 2 (3-4 minutes): a cue card with a topic and points to cover. You get one minute to prepare and make notes, then speak for up to two minutes.", "Part 3 (4-5 minutes): a discussion of more abstract questions linked to the Part 2 topic."] },
        { h: "How it's scored" },
        "Four criteria count equally: Fluency and Coherence, Lexical Resource (vocabulary), Grammatical Range and Accuracy, and Pronunciation.",
        { h: "Tips for each part" },
        { list: ["Part 1: answer, then add a reason or detail - two or three sentences, not one word.", "Part 2: use your minute to jot a few key words for each point; start directly on the topic and keep going until the examiner stops you.", "Part 3: give an opinion, explain it, and consider another view: \"It depends... On the one hand... but on the other...\"", "Mistakes are fine - keep talking. Self-correct only if it's quick.", "Use natural, precise words over rare, memorised ones."] },
        { h: "TOEFL" },
        "TOEFL iBT's speaking section is taken on a computer and its tasks changed in 2026. Check ETS's official site for the current task types before you prepare.",
      ],
    },
    {
      id: "t4-m7-l3", type: "activity", title: "Useful Phrases", minutes: 5, xp: 20, skill: "reading",
      activity: {
        kind: "flashcards", prompt: "Natural phrases that help you sound fluent. Tap to see when to use each.",
        cards: [
          { word: "\"I'd like to talk about...\"", meaning: "A simple, direct way to start your Part 2 talk.", example: "I'd like to talk about a teacher who changed how I study." },
          { word: "\"That's an interesting question...\"", meaning: "Buys a second to think - use it once, not every time.", example: "That's an interesting question - I suppose it depends on the city." },
          { word: "\"It depends on...\"", meaning: "Introduces a balanced Part 3 answer.", example: "It depends on whether people live near their workplace." },
          { word: "\"On the other hand...\"", meaning: "Shows a contrasting view.", example: "On the other hand, online classes save travel time." },
          { word: "\"What I mean is...\"", meaning: "Lets you rephrase smoothly instead of stopping.", example: "What I mean is, it helped me become more independent." },
          { word: "\"Looking back...\"", meaning: "Moves to reflection - useful at the end of a cue card.", example: "Looking back, it was the best decision I made in college." },
        ],
      },
    },
    {
      id: "t4-m7-l4", type: "activity", title: "Better Part 1 Answers", minutes: 5, xp: 20, skill: "reading",
      activity: {
        kind: "choice", prompt: "Choose the best Part 1 answer.",
        scenarios: [
          { situation: "\"Do you like reading?\"", options: [
            { text: "\"Yes.\"", why: "Too short - give the examiner something to assess." },
            { text: "\"Yes, mostly non-fiction. I've been reading about space exploration lately, because I find it relaxing after studying.\"", best: true, why: "Answer, detail and a reason - natural and fluent." },
            { text: "A memorised two-minute speech about reading.", why: "Part 1 answers should be short and natural; memorised answers are easy to spot." },
          ] },
          { situation: "\"What's your home town like?\"", options: [
            { text: "\"I'm from Mysuru. It's quite calm and green, and it's famous for its palace - though traffic has grown a lot recently.\"", best: true, why: "Specific details with a balanced comment." },
            { text: "\"It is a city.\"", why: "No detail." },
            { text: "\"I don't want to talk about it.\"", why: "Always engage with the question." },
          ] },
        ],
      },
    },
    {
      id: "t4-m7-l5", type: "task", title: "Plan a Cue Card", minutes: 8, xp: 40, skill: "writing",
      instructions: "Cue card: \"Describe a place you visited that you'd like to go back to. Say where it is, when you went, what you did there, and explain why you'd like to return.\" Write the short notes you'd make in your one minute (key words for each point), then write the first three sentences of your talk.",
      minWords: 50, maxWords: 170,
      rubric: ["Notes cover every point on the card", "Notes are brief key words, usable in one minute", "Opening sentences start directly on the topic", "Natural vocabulary and correct grammar"],
    },
    {
      id: "t4-m7-l6", type: "voice", title: "Part 1, 2, 3 Simulation", minutes: 10, xp: 30, skill: "speaking",
      prompt: v({
        id: "t4-m7-voice", type: "interview", minSec: 150, maxSec: 300, targetSec: 240,
        text: "A mini speaking test in one recording. Part 1: \"What are you studying?\" and \"How do you usually spend weekends?\" (about 20 seconds each). Part 2: talk for up to two minutes on your cue card - a place you'd like to go back to. Part 3: \"Why do people enjoy travelling more today than in the past?\" (about a minute).",
        tips: ["Say \"Part one\", \"Part two\", \"Part three\" as you go.", "In Part 2, keep talking until the two minutes are nearly up.", "In Part 3, give a view, a reason and another side."],
      }),
    },
    {
      id: "t4-m7-l7", type: "quiz", title: "Module Check-in", minutes: 5, xp: 20, skill: "reading", assessment: true,
      reflection: "Which of the four criteria do you think is your weakest? What will you practise daily?",
      questions: [
        { q: "How long do you get to prepare for Part 2?", options: ["One minute", "Five minutes", "No time"], answer: 0 },
        { q: "How long should you speak in Part 2?", options: ["Up to two minutes", "Ten seconds", "Five minutes"], answer: 0 },
        { q: "Which is one of the four scoring criteria?", options: ["Lexical Resource", "Handwriting", "Accent"], answer: 0 },
        { q: "A strong Part 1 answer is...", options: ["Two or three sentences with a reason", "One word", "A memorised speech"], answer: 0 },
        { q: "You make a small grammar mistake. You should...", options: ["Keep talking - correct it quickly only if it's easy", "Stop and start over", "Apologise at length"], answer: 0 },
      ],
    },
  ],
};

export const T4_M8: Module = {
  id: "m8",
  title: "Capstone: Career Communication Portfolio",
  summary: "Pull together your pitch, stories and documents - and take a final 5-minute mock interview.",
  outcomes: ["Write a 30-second pitch with a clear ask", "Compile a career communication portfolio", "Complete a final 5-minute mock interview"],
  minutes: 80,
  badge: { id: "career-communicator", title: "Career Communicator" },
  lessons: [
    {
      id: "t4-m8-l1", type: "video", title: "Your 30-Second Elevator Pitch", minutes: 7, xp: 10, skill: "listening",
      youtubeId: "Lb0Yz_5ZYzI", durationSec: 370, channel: "The Intern Queen (Lauren Berger)", reviewedBy: "pending",
      takeaways: [
        "A good pitch is short and ready to use at a moment's notice - it creates a lasting impression.",
        "Say who you are and your background, then make a connection to the person or company you're talking to.",
        "Make a clear ask, then close the pitch politely.",
      ],
      check: [
        { q: "How long is an elevator pitch?", options: ["About 30 seconds", "Five minutes", "Ten minutes"], answer: 0 },
        { q: "What comes after who you are and your background?", options: ["Making a connection to them", "Your salary expectation", "Your weaknesses"], answer: 0 },
        { q: "What should every pitch include?", options: ["A clear ask", "A joke", "Your full CV"], answer: 0 },
      ],
    },
    {
      id: "t4-m8-l2", type: "reading", title: "Your Career Communication Portfolio", minutes: 8, xp: 10, skill: "reading",
      body: [
        "A portfolio is everything you need to introduce yourself, prove what you can do, and follow up - ready before the opportunity arrives.",
        { h: "What goes in it" },
        { list: ["A 30-second pitch: who you are, the connection, your ask.", "A LinkedIn headline and About section.", "Your resume - OneGrasp's Resume & Interview section builds an ATS-friendly one and checks it.", "Three STAR stories from your story bank.", "A 2-minute explanation of your best project for a non-expert.", "A cold email or message you can adapt.", "A writing sample: a report, article or SOP."] },
        { h: "The pitch, step by step" },
        { list: ["Who you are and your background: \"I'm Rahul, a final-year B.Com student specialising in finance.\"", "Make the connection: \"I read about your team's work on rural credit...\"", "Make the ask: \"Could I send you my research summary and ask about internships?\"", "Close: \"Thank you - may I connect with you on LinkedIn?\""] },
        { h: "Keep it alive" },
        "Update your portfolio every semester: new projects, new results, new stories. The best time to prepare for an interview is before you get the call.",
      ],
    },
    {
      id: "t4-m8-l3", type: "activity", title: "Order the Pitch", minutes: 4, xp: 20, skill: "writing",
      activity: { kind: "order", prompt: "Put this pitch at a career fair in the best order.", items: [
        "\"Hi, I'm Ananya - a third-year computer science student at NIT Trichy.\"",
        "\"I've built two Android apps, one now used by 3,000 students for bus timings.\"",
        "\"I saw your team is hiring for mobile development, and I use your app every day.\"",
        "\"Could I share my portfolio and ask about your summer internship?\"",
        "\"Thank you for your time - may I connect with you on LinkedIn?\"",
      ] },
    },
    {
      id: "t4-m8-l4", type: "activity", title: "Which Piece Fits?", minutes: 5, xp: 20, skill: "reading",
      activity: {
        kind: "choice", prompt: "Pick the portfolio piece that fits each moment.",
        scenarios: [
          { situation: "You meet an alumnus from your target company at a seminar.", options: [
            { text: "Your 30-second pitch with a clear ask.", best: true, why: "Short, personal and ends with a next step." },
            { text: "Hand over a 10-page project report.", why: "Too much for a quick meeting." },
            { text: "Start with your weaknesses.", why: "Not the time - lead with value." },
          ] },
          { situation: "An interviewer asks, \"Explain your final-year project to me - I'm not an engineer.\"", options: [
            { text: "Your 2-minute non-expert project explanation.", best: true, why: "Prepared for exactly this question." },
            { text: "Read out the technical abstract.", why: "Jargon loses a non-expert." },
            { text: "Say it's too technical to explain.", why: "Explaining simply is the skill being tested." },
          ] },
          { situation: "A recruiter you've never met posts about an opening on LinkedIn.", options: [
            { text: "Your adapted cold message: a short intro, the connection, a specific ask.", best: true, why: "Brief, relevant and easy to say yes to." },
            { text: "\"Plz give me job.\"", why: "Unprofessional and gives no reason to reply." },
            { text: "Send your whole portfolio with no message.", why: "Without context, it probably won't be opened." },
          ] },
        ],
      },
    },
    {
      id: "t4-m8-l5", type: "task", title: "Compile Your Portfolio", minutes: 30, xp: 40, skill: "writing",
      instructions: "Write the core of your portfolio for a role you want: (1) your 30-second pitch, (2) a LinkedIn headline, (3) one STAR story with a measurable result, (4) a 3-4 sentence explanation of your best project for a non-expert, and (5) a short cold message to someone at a target company with a specific ask.",
      minWords: 300, maxWords: 520,
      rubric: ["Pitch covers who you are, the connection and a clear ask", "Headline is specific to the target role", "STAR story is complete with a measurable result", "Project explanation is clear to a non-expert", "Cold message is brief, relevant and has a specific ask"],
    },
    {
      id: "t4-m8-l6", type: "voice", title: "Final 5-Minute Mock Interview", minutes: 12, xp: 30, skill: "speaking",
      prompt: v({
        id: "t4-m8-voice", type: "interview", minSec: 180, maxSec: 330, targetSec: 270,
        text: "Your final mock interview, about five minutes. Say each number first and answer in about 45-60 seconds: (1) Tell me about yourself. (2) Walk me through your best project as if I'm not an expert. (3) Tell me about a time you had to deal with a difficult teammate. (4) Why do you want this role? (5) Why should we hire you? End with one question for the interviewer.",
        tips: ["Use your portfolio - pitch, stories, project explanation.", "Say \"Question three...\" to signal each answer.", "Close every answer with a result or a clear point."],
      }),
    },
    {
      id: "t4-m8-l7", type: "quiz", title: "Final Check-in", minutes: 5, xp: 20, skill: "reading", assessment: true,
      reflection: "Compare this mock with your elevator pitch in Module 1. What are you most proud of improving?",
      questions: [
        { q: "What should end an elevator pitch?", options: ["A clear ask and a polite close", "Your life story", "A list of skills"], answer: 0 },
        { q: "Why prepare a non-expert project explanation?", options: ["Interviewers test whether you can explain simply", "It's never asked", "To use more jargon"], answer: 0 },
        { q: "How often should you update your portfolio?", options: ["Every semester or after each new project", "Never", "Only after an interview"], answer: 0 },
        { q: "A good cold message to a recruiter is...", options: ["Brief, relevant and with a specific ask", "Long and general", "Just your resume"], answer: 0 },
        { q: "The best time to prepare for an interview is...", options: ["Before you get the call", "The night before", "During the interview"], answer: 0 },
      ],
    },
  ],
};

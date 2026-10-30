/**
 * Track T3 (Class 11-12, "College and Career Ready"), modules 1-7 (spec §4):
 * foundations, listening and note-taking, group discussion, interviews
 * (STAR), SOPs, MUN, and the capstone mock admission interview. Videos
 * checked embeddable October 2026; takeaways follow each video's chapters
 * and description - `reviewedBy: "pending"` until a teacher has watched them.
 */
import type { Module } from "../types";
import { v } from "./shared";

export const T3_M1: Module = {
  id: "m1",
  title: "Communication Foundations",
  summary: "How communication works, and the 7 Cs that make any message land.",
  outcomes: ["Explain the communication process", "Apply the 7 Cs to your writing and speech", "Introduce yourself confidently in a minute"],
  minutes: 45,
  badge: { id: "seven-cs", title: "Seven Cs" },
  lessons: [
    {
      id: "t3-m1-l1", type: "video", title: "The 7 Cs of Communication", minutes: 3, xp: 10, skill: "listening",
      youtubeId: "sYBw9-8eCuM", durationSec: 166, channel: "Mindtools", reviewedBy: "pending",
      takeaways: [
        "Most of a working day goes into communicating - emails, reports, meetings and presentations.",
        "The 7 Cs: messages should be Clear, Concise, Concrete, Correct, Coherent, Complete and Courteous.",
        "Checking a message against the 7 Cs makes it more effective and more engaging.",
      ],
      check: [
        { q: "Which of these is one of the 7 Cs?", options: ["Complicated", "Concise", "Casual"], answer: 1 },
        { q: "A \"concrete\" message is...", options: ["Specific, with facts and details", "Very long", "Written in capital letters"], answer: 0 },
        { q: "Where do the 7 Cs apply?", options: ["Only in emails", "Emails, reports, meetings and presentations", "Only in exams"], answer: 1 },
      ],
    },
    {
      id: "t3-m1-l2", type: "reading", title: "How Communication Works", minutes: 7, xp: 10, skill: "reading",
      body: [
        "Every message travels: a sender encodes an idea, sends it through a channel (speech, email, a slide), and a receiver decodes it. Feedback tells the sender whether it arrived. Anything that blocks it - noise, jargon, a bad mood, a weak network - is called noise.",
        { h: "Three kinds of communication" },
        { list: ["Verbal - the words you choose.", "Non-verbal - tone, eye contact, posture, gestures, pace.", "Written - emails, applications, statements, reports."] },
        "When your words and your body language disagree, people believe your body language. Saying \"I'm very interested\" while looking at the floor sends a mixed message.",
        { h: "The 7 Cs in practice" },
        { list: ["Clear - one purpose per message.", "Concise - cut words that add nothing.", "Concrete - specific facts: \"92% in physics\", not \"good marks\".", "Correct - grammar, names, dates, numbers.", "Coherent - ideas in a logical order.", "Complete - everything the reader needs to act.", "Courteous - polite and respectful."] },
        { example: "Before: \"Hi, I wanted to ask about the thing for the event, can you tell me?\" After: \"Dear Ms. Rao, could you confirm the reporting time for Saturday's science fair? Thank you, Arnav (12B).\"" },
      ],
    },
    {
      id: "t3-m1-l3", type: "activity", title: "Match the C", minutes: 4, xp: 20, skill: "reading",
      activity: { kind: "match", prompt: "Match each fix to the C it improves.", pairs: [
        ["Replacing \"soon\" with \"by 5 p.m. Friday\"", "Concrete"],
        ["Cutting a 60-word sentence to 20 words", "Concise"],
        ["Adding the venue that was missing", "Complete"],
        ["Fixing the misspelt name of the principal", "Correct"],
        ["Adding \"please\" and \"thank you\"", "Courteous"],
        ["Putting the steps in the order they happen", "Coherent"],
      ] },
    },
    {
      id: "t3-m1-l4", type: "quiz", title: "Self-check: How You Communicate", minutes: 5, xp: 20, skill: "reading",
      reflection: "Which of the 7 Cs is your weakest? Write one thing you'll do this week to work on it.",
      questions: [
        { q: "In the communication process, \"feedback\" is...", options: ["The receiver's response that shows the message arrived", "Background noise", "The channel used"], answer: 0 },
        { q: "Which is an example of non-verbal communication?", options: ["Eye contact", "An email", "A written report"], answer: 0 },
        { q: "Your words say \"I'm excited\" but your voice is flat. People will most likely believe...", options: ["Your words", "Your tone", "Neither"], answer: 1 },
        { q: "Which message is most concrete?", options: ["\"I did well in my exams.\"", "\"I scored 94% in Class 10 boards.\"", "\"My results were nice.\""], answer: 1 },
        { q: "Which is \"noise\" in communication?", options: ["Jargon the listener doesn't know", "A clear subject line", "A short sentence"], answer: 0 },
      ],
    },
    {
      id: "t3-m1-l5", type: "task", title: "Fix the Message", minutes: 10, xp: 40, skill: "writing",
      instructions: "Rewrite this message using the 7 Cs: \"hey so i wanted to know about the workshop thing, like when is it and where, also can my friend come?? also do we need anything. thanks\" - it's going to the coordinator of a college's summer workshop. Then add one line saying which Cs you improved.",
      minWords: 50, maxWords: 150,
      rubric: ["Clear purpose and complete details", "Concise - no unnecessary words", "Courteous, appropriate greeting and sign-off", "Correct grammar, spelling and punctuation", "Names the Cs that were improved"],
    },
    {
      id: "t3-m1-l6", type: "voice", title: "Your 1-Minute Introduction", minutes: 6, xp: 30, skill: "speaking",
      prompt: v({
        id: "t3-m1-voice", type: "self_intro", minSec: 40, maxSec: 90, targetSec: 60,
        text: "Introduce yourself in one minute as you would at a college orientation or workshop: who you are, what you're studying, one thing you're passionate about (with a concrete detail), and what you hope to do next.",
        tips: ["Be concrete - a real project, number or example.", "Keep to one or two interests, not five.", "End with what you're looking forward to."],
        modelAnswer: "Hi, I'm Meera Nair, a Class 12 science student from Kochi. I'm really interested in environmental science. Last year I ran a project in our colony to separate wet and dry waste - we got forty families to join and cut the waste going to the landfill by almost half. I'm hoping to study environmental engineering, and I'd love to meet people here who are working on climate or water problems. Thank you.",
      }),
    },
    {
      id: "t3-m1-l7", type: "quiz", title: "Module Check-in", minutes: 5, xp: 20, skill: "reading", assessment: true,
      questions: [
        { q: "What are the parts of the communication process?", options: ["Sender, message, channel, receiver, feedback", "Only speaker and listener", "Question and answer"], answer: 0 },
        { q: "\"Please find the form attached. Kindly submit it by 10 March.\" This is mainly...", options: ["Clear and complete", "Casual and vague", "Too long"], answer: 0 },
        { q: "Making a message \"concise\" means...", options: ["Removing words that add nothing", "Removing all details", "Writing in short forms like \"u\" and \"pls\""], answer: 0 },
        { q: "Why does body language matter?", options: ["It can support or contradict your words", "It doesn't matter at all", "Only in drama"], answer: 0 },
        { q: "A good self-introduction includes...", options: ["A concrete detail about you", "Your whole life story", "Only your name"], answer: 0 },
      ],
    },
  ],
};

const LECTURE = "Good morning, everyone. Today I want to talk about why sleep matters so much for students, and what you can do about it. I'll cover three things: what happens in the brain when we sleep, how lack of sleep affects learning, and three practical habits. First, what happens when we sleep. Sleep is not the brain switching off. During deep sleep, the brain replays and sorts what you learned during the day, and moves the important parts into long-term memory. So the night after you study is when much of the learning actually gets locked in. Second, how lack of sleep affects learning. When you sleep too little, your attention drops and you make more careless mistakes. You also find it harder to control your mood, so small problems feel bigger. In other words, staying up all night before an exam often means you remember less, not more. Third, three practical habits. One: keep a fixed wake-up time, even on weekends, because a regular routine helps your body clock. Two: put your phone away at least thirty minutes before bed - the light and the scrolling both keep your brain alert. Three: if you need a break in the afternoon, keep any nap short, about twenty minutes, so it doesn't spoil your night's sleep. To sum up: sleep is when learning is stored, too little sleep hurts attention and mood, and a fixed wake-up time, a phone-free half hour, and short naps can make a real difference. Try just one of these habits for the next two weeks and notice how you feel. Thank you.";

const COUNSELLOR = "Hello, everyone. Many of you have asked me how to choose a college course, so let me share a simple way to think about it. Start with three questions. The first question is: what do I enjoy learning, even when nobody is testing me? Look at what you read, watch or build in your free time. If you spend weekends fixing gadgets or watching science videos, that's a signal. The second question is: what am I good at, based on evidence? Not just marks - look at projects, competitions, and feedback from teachers. Someone who scores well in biology but hated every lab session may not enjoy a lab-heavy course. The third question is: what kind of work life do I want? Some careers mean long years of study, some mean a lot of travel, some mean working mostly alone. Talk to at least two people who actually do the job you're considering - ask what a normal day looks like, and what they wish they had known at eighteen. Now, a few mistakes to avoid. Don't pick a course only because your friends are taking it. Don't decide based only on the starting salary you heard from someone; salaries change, and you'll be in this field for many years. And don't treat the decision as permanent - many people switch fields after their first degree, through a master's, a diploma or job experience. Finally, make a short list of three courses, and for each one, write down two colleges, the entrance exam, and the deadline. Bring that list to our next session, and we'll go through it together.";

export const T3_M2: Module = {
  id: "m2",
  title: "Active Listening and Note-taking",
  summary: "Listen for structure, take Cornell notes, and summarise a talk accurately.",
  outcomes: ["Spot signal words in a lecture", "Take notes with the Cornell method", "Summarise a 3-minute talk in your own words"],
  minutes: 60,
  badge: { id: "sharp-listener", title: "Sharp Listener" },
  lessons: [
    {
      id: "t3-m2-l1", type: "video", title: "How to Use Cornell Notes", minutes: 4, xp: 10, skill: "listening",
      youtubeId: "nX-xshA_0m8", durationSec: 244, channel: "Cornell University Learning Strategies Center", reviewedBy: "pending",
      takeaways: [
        "Cornell notes divide the page: a wide column for notes during class, a narrow column for questions or cues, and a space at the bottom for a summary.",
        "After class, write questions in the cue column that your notes answer - then cover the notes and test yourself.",
        "Writing a short summary in your own words keeps you active and shows what you really understood.",
      ],
      check: [
        { q: "What goes in the narrow (cue) column?", options: ["Questions or key words that your notes answer", "Doodles", "The full lecture word for word"], answer: 0 },
        { q: "How do you use the cue column to revise?", options: ["Cover the notes and answer the questions", "Copy it again", "Throw it away"], answer: 0 },
        { q: "Where does the summary go?", options: ["At the bottom of the page", "Before the lecture starts", "Nowhere"], answer: 0 },
      ],
    },
    {
      id: "t3-m2-l2", type: "reading", title: "Listening for Structure", minutes: 6, xp: 10, skill: "reading",
      body: [
        "In college you'll hear far more than you read. Good listeners don't write everything down - they listen for the structure of the talk and note the main ideas.",
        { h: "Signal words to listen for" },
        { list: ["Big picture: \"Today I'll cover three things...\"", "Order: \"First...\", \"Second...\", \"Finally...\"", "Importance: \"The key point is...\", \"Remember this...\"", "Contrast: \"However...\", \"On the other hand...\"", "Examples: \"For instance...\"", "Summary: \"To sum up...\", \"In short...\""] },
        { h: "Note-taking shortcuts" },
        { list: ["Use symbols: → (leads to), ↑ (increase), ↓ (decrease), ∴ (therefore), w/ (with), b/c (because).", "Write key words, not sentences.", "Leave space - you'll add to your notes later.", "Mark anything you didn't understand with a \"?\" and ask afterwards."] },
        { h: "Summarising" },
        "A good summary keeps the speaker's main point and their key supporting points, in your own words, and leaves out the small examples. Aim for about a quarter of the original length.",
      ],
    },
    {
      id: "t3-m2-l3", type: "quiz", title: "Listen: A Talk on Sleep", minutes: 8, xp: 20, skill: "listening",
      listen: LECTURE,
      questions: [
        { q: "How many main parts did the speaker say the talk would cover?", options: ["Two", "Three", "Five"], answer: 1 },
        { q: "According to the talk, what does the brain do during deep sleep?", options: ["Switches off completely", "Replays and sorts what you learned, storing the important parts", "Forgets the day's lessons"], answer: 1 },
        { q: "What does the speaker say about staying up all night before an exam?", options: ["It helps you remember more", "It often means you remember less", "It has no effect"], answer: 1 },
        { q: "Which was NOT one of the three habits?", options: ["A fixed wake-up time", "No phone 30 minutes before bed", "Drinking coffee at night"], answer: 2 },
        { q: "How long should an afternoon nap be, according to the talk?", options: ["About twenty minutes", "Two hours", "As long as you like"], answer: 0 },
      ],
    },
    {
      id: "t3-m2-l4", type: "activity", title: "Signal Words", minutes: 4, xp: 20, skill: "reading",
      activity: { kind: "match", prompt: "Match each signal phrase to what it tells you.", pairs: [
        ["\"Today I'll cover three things...\"", "The structure of the talk"],
        ["\"The key point is...\"", "Something important - note it"],
        ["\"However...\"", "A contrast is coming"],
        ["\"For instance...\"", "An example"],
        ["\"To sum up...\"", "The summary"],
      ] },
    },
    {
      id: "t3-m2-l5", type: "task", title: "Your Cornell Note Sheet", minutes: 15, xp: 40, skill: "writing",
      instructions: "Play the counsellor's talk below (as many times as you need) and make Cornell notes. Write three parts: CUES - 3-5 questions or key words; NOTES - the main points in short form; SUMMARY - 2-3 sentences in your own words.",
      listen: COUNSELLOR,
      minWords: 80, maxWords: 260,
      rubric: ["Cues are useful questions or key words", "Notes capture the talk's main points accurately", "Notes are short and well organised", "Summary is accurate and in the student's own words"],
    },
    {
      id: "t3-m2-l6", type: "voice", title: "Summarise the Talk", minutes: 8, xp: 30, skill: "speaking",
      prompt: v({
        id: "t3-m2-voice", type: "retell", minSec: 45, maxSec: 120, targetSec: 75,
        listen: LECTURE,
        text: "Play the 3-minute talk on sleep (take notes if you like), then summarise it out loud in about 75 seconds: the speaker's main point, the three parts, and what they asked listeners to do.",
        tips: ["Start with the main point in one sentence.", "Follow the speaker's own structure: first, second, third.", "Leave out small details - keep the big ideas."],
      }),
    },
    {
      id: "t3-m2-l7", type: "quiz", title: "Module Check-in", minutes: 5, xp: 20, skill: "reading", assessment: true,
      reflection: "In your next class, try Cornell notes for one lecture. What did you notice?",
      questions: [
        { q: "What should you mainly listen for in a lecture?", options: ["Its structure and main ideas", "Every single word", "The speaker's accent"], answer: 0 },
        { q: "\"On the other hand...\" signals...", options: ["A contrast", "An example", "The end"], answer: 0 },
        { q: "A good summary...", options: ["Keeps the main points in your own words", "Copies the speaker's sentences", "Includes every example"], answer: 0 },
        { q: "In Cornell notes, when do you write the cue questions?", options: ["After class, when reviewing", "Before the class", "Never"], answer: 0 },
        { q: "The symbol \"∴\" in notes means...", options: ["Therefore", "Increase", "With"], answer: 0 },
      ],
    },
  ],
};

export const T3_M3: Module = {
  id: "m3",
  title: "Group Discussion (GD)",
  summary: "Open, contribute to and close a group discussion like evaluators want to see.",
  outcomes: ["Know what GD evaluators look for", "Enter, agree and disagree politely", "Give a strong GD opening statement"],
  minutes: 55,
  badge: { id: "gd-ready", title: "GD Ready" },
  lessons: [
    {
      id: "t3-m3-l1", type: "video", title: "8 Tips to Master Group Discussion", minutes: 8, xp: 10, skill: "listening",
      youtubeId: "3w32jIsRlsw", durationSec: 484, channel: "Simplilearn", reviewedBy: "pending",
      takeaways: [
        "A group discussion is often an eliminating round in selection, so it pays to prepare - including reading up on common, general topics.",
        "Initiate if you can, speak with care and confidence, and really listen to others instead of only waiting to talk.",
        "Keep good body language, don't drift from the topic, and help bring the discussion to a clear conclusion.",
      ],
      check: [
        { q: "Why does preparing for a GD matter?", options: ["It's often an eliminating round", "It's never assessed", "It replaces the interview"], answer: 0 },
        { q: "Which is one of the tips in the video?", options: ["Don't just hear - listen", "Speak as loudly as possible", "Change the topic often"], answer: 0 },
        { q: "How should a good GD end?", options: ["With a clear conclusion", "With an argument", "Suddenly"], answer: 0 },
      ],
    },
    {
      id: "t3-m3-l2", type: "reading", title: "How a GD Works", minutes: 7, xp: 10, skill: "reading",
      body: [
        "In a GD, a small group (often 6-12 people) discusses a topic for about 10-20 minutes while evaluators watch. There's no winner - each person is assessed on how they think and how they work with others.",
        { h: "What evaluators look for" },
        { list: ["Content - relevant points, facts and examples.", "Communication - clear, concise, confident.", "Listening - building on what others said.", "Leadership - starting, steering or summarising the discussion.", "Attitude - calm, respectful, open to other views."] },
        { h: "Ways to open" },
        { list: ["Define the topic: \"Let's first agree what we mean by 'smart cities'...\"", "Ask a question: \"Who really benefits from online learning?\"", "Use a fact you're sure of, or a short example.", "Lay out angles: \"We could look at this economically, socially and environmentally.\""] },
        { h: "Useful phrases" },
        { list: ["Entering: \"I'd like to add to what Riya said...\"", "Agreeing: \"That's a good point, and another example is...\"", "Disagreeing: \"I see it differently, because...\"", "Bringing back on track: \"Coming back to the main question...\"", "Including others: \"Arjun, we haven't heard your view yet.\"", "Summarising: \"So we seem to agree on X, but differ on Y.\""] },
      ],
    },
    {
      id: "t3-m3-l3", type: "activity", title: "GD Scenarios", minutes: 6, xp: 20, skill: "reading",
      activity: {
        kind: "choice", prompt: "What's the best move?",
        scenarios: [
          { situation: "Two people keep talking over each other and you haven't spoken yet.", options: [
            { text: "Wait for a natural pause, then say: \"Building on that, I'd like to add...\"", best: true, why: "You enter politely and link to the discussion." },
            { text: "Speak louder than both of them.", why: "Shouting over others counts against you." },
            { text: "Stay silent for the whole GD.", why: "Evaluators can't assess you if you don't contribute." },
          ] },
          { situation: "You don't know much about the topic.", options: [
            { text: "Make up statistics to sound informed.", why: "Wrong facts damage your credibility." },
            { text: "Listen first, then add a reasoned point or a link between others' ideas.", best: true, why: "Good reasoning and summarising earn credit even without deep facts." },
            { text: "Change the topic to something you know.", why: "Drifting from the topic is marked down." },
          ] },
          { situation: "One participant strongly disagrees with you, a little rudely.", options: [
            { text: "Stay calm: \"I understand your view. My reason is...\"", best: true, why: "Calm, reasoned disagreement shows maturity." },
            { text: "Tell them they're being rude.", why: "It turns the GD personal." },
            { text: "Drop your point completely.", why: "You can respect them and still keep your view." },
          ] },
          { situation: "Two minutes are left and nobody has summarised.", options: [
            { text: "Offer a short summary of the main views and where the group agreed.", best: true, why: "Summarising shows leadership and listening." },
            { text: "Start a new argument.", why: "There's no time to develop it - it's better to bring things together." },
            { text: "Repeat your first point again.", why: "It adds nothing new." },
          ] },
        ],
      },
    },
    {
      id: "t3-m3-l4", type: "activity", title: "GD Phrases", minutes: 4, xp: 20, skill: "reading",
      activity: { kind: "match", prompt: "Match each phrase to its purpose.", pairs: [
        ["\"I'd like to add to Sana's point...\"", "Entering the discussion"],
        ["\"I see it differently, because...\"", "Disagreeing politely"],
        ["\"Coming back to the main question...\"", "Bringing it back on track"],
        ["\"Karan, what do you think?\"", "Including a quiet member"],
        ["\"So most of us agree that...\"", "Summarising"],
      ] },
    },
    {
      id: "t3-m3-l5", type: "task", title: "Plan Your GD Contribution", minutes: 12, xp: 40, skill: "writing",
      instructions: "Topic: \"Should coaching centres be regulated by the government?\" Write: (1) an opening statement (2-3 sentences), (2) two points with an example each, (3) one polite way to respond to the opposite view, and (4) a 2-sentence summary you could use to close.",
      minWords: 120, maxWords: 260,
      rubric: ["Opening is clear and sets up the discussion", "Two relevant points, each with an example", "Responds to the opposite view politely", "Closing summary is balanced", "Clear, concise language"],
    },
    {
      id: "t3-m3-l6", type: "voice", title: "Your GD Opening Statement", minutes: 6, xp: 30, skill: "speaking",
      prompt: v({
        id: "t3-m3-voice", type: "opinion", minSec: 40, maxSec: 90, targetSec: 60,
        text: "You're opening a group discussion on \"Should coaching centres be regulated by the government?\" Give a 60-second opening: define the issue, give your view with one reason and example, and invite others in.",
        tips: ["Start by framing the topic, not by attacking one side.", "One reason and one example are enough.", "End with an invitation: \"I'd like to hear what others think about...\""],
        modelAnswer: "Good morning, everyone. Coaching centres are now a huge part of how students prepare for entrance exams, so the question is whether they should have rules like schools do. I believe some regulation is needed, mainly to protect students. For example, many centres run classes for twelve hours a day, and there have been worrying reports about student stress in coaching hubs. Basic rules - on class hours, fees and safety - could protect students without stopping good teaching. At the same time, too much regulation might raise costs. I'd like to hear what others think about where that balance should be.",
      }),
    },
    {
      id: "t3-m3-l7", type: "quiz", title: "Module Check-in", minutes: 5, xp: 20, skill: "reading", assessment: true,
      reflection: "Are you more likely to speak too much or too little in a group? What will you change?",
      questions: [
        { q: "Is there a \"winner\" in a group discussion?", options: ["No - each person is assessed individually", "Yes, whoever speaks most", "Yes, whoever speaks last"], answer: 0 },
        { q: "Which shows good listening in a GD?", options: ["Building on someone else's point", "Repeating your own point", "Interrupting"], answer: 0 },
        { q: "If you don't know a fact for sure, you should...", options: ["Not use it, and argue from reasoning", "Make one up", "Say nothing all GD"], answer: 0 },
        { q: "Summarising near the end shows...", options: ["Leadership and listening", "Weakness", "Nothing"], answer: 0 },
        { q: "Best way to disagree:", options: ["\"I see it differently, because...\"", "\"That's nonsense.\"", "Rolling your eyes"], answer: 0 },
      ],
    },
  ],
};

export const T3_M4: Module = {
  id: "m4",
  title: "Interview Basics",
  summary: "Answer common interview questions with clear, true stories using STAR.",
  outcomes: ["Use STAR to answer \"Tell me about a time...\"", "Prepare answers to common questions", "Handle the interview's start and end well"],
  minutes: 55,
  badge: { id: "star-speaker", title: "STAR Speaker" },
  lessons: [
    {
      id: "t3-m4-l1", type: "video", title: "The STAR Method", minutes: 6, xp: 10, skill: "listening",
      youtubeId: "UQrTMxouDUY", durationSec: 359, channel: "Inside Amazon", reviewedBy: "pending",
      takeaways: [
        "Preparation is key - once you have an interview, plan your examples in advance.",
        "STAR stands for Situation, Task, Action, Result: set the scene, say what needed doing, explain what you did, and share the outcome.",
        "Use real examples from your own experience, and make clear what you personally did.",
      ],
      check: [
        { q: "What does STAR stand for?", options: ["Situation, Task, Action, Result", "Story, Time, Answer, Reason", "Start, Talk, Ask, Repeat"], answer: 0 },
        { q: "Which part explains what you personally did?", options: ["Situation", "Action", "Result"], answer: 1 },
        { q: "When should you prepare your STAR examples?", options: ["Before the interview", "During the interview", "After the interview"], answer: 0 },
      ],
    },
    {
      id: "t3-m4-l2", type: "reading", title: "Common Questions and How to Answer", minutes: 7, xp: 10, skill: "reading",
      body: [
        "College, scholarship and internship interviews ask the same handful of questions again and again. Prepared answers - not memorised scripts - make you calm and clear.",
        { h: "The questions you will almost certainly hear" },
        { list: ["Tell me about yourself.", "Why do you want to study this course / join this programme?", "What are your strengths? Give an example.", "Tell me about a challenge you faced.", "Tell me about a time you worked in a team.", "Where do you see yourself in five years?", "Do you have any questions for us?"] },
        { h: "STAR, step by step" },
        { list: ["Situation (10%) - where and when, briefly.", "Task (10%) - what you had to achieve.", "Action (60%) - what YOU did, step by step. Say \"I\", not \"we\".", "Result (20%) - what happened, with a number if you can, and what you learned."] },
        { example: "\"(S) In Class 11, our school's science club had only six members. (T) As secretary, I wanted to double that before the annual fair. (A) I organised two short demo sessions during lunch, made a reel of our projects for the school page, and paired each new member with a senior. (R) We grew to fifteen members, and our team won second place at the district fair.\"" },
        { h: "First and last impressions" },
        { list: ["Greet, sit when invited, and keep your phone away.", "It's fine to pause and think before answering.", "Always have one or two questions ready to ask them.", "Thank them at the end."] },
      ],
    },
    {
      id: "t3-m4-l3", type: "activity", title: "Build a STAR Answer", minutes: 4, xp: 20, skill: "writing",
      activity: { kind: "order", prompt: "\"Tell me about a time you solved a problem.\" Put this answer in STAR order.", items: [
        "During our Class 11 trip, our group's train was cancelled at the last minute.",
        "As the group leader, I had to get twelve students to the camp before dark.",
        "I called the camp, found a bus leaving in an hour, and split the group so everyone had a buddy.",
        "We reached on time, and our teacher asked me to plan the return journey too.",
      ] },
    },
    {
      id: "t3-m4-l4", type: "activity", title: "Strong or Weak?", minutes: 5, xp: 20, skill: "reading",
      activity: {
        kind: "choice", prompt: "Choose the strongest answer.",
        scenarios: [
          { situation: "\"What is your biggest strength?\"", options: [
            { text: "\"I'm hardworking, honest, creative and a team player.\"", why: "A list of adjectives with no proof is forgettable." },
            { text: "\"I'm persistent. I failed my first coding contest, practised every evening for two months, and placed in the top 50 in the next one.\"", best: true, why: "One strength, proven by a short story with a result." },
            { text: "\"I don't really have any.\"", why: "Too modest - every student has strengths to share." },
          ] },
          { situation: "\"Tell me about a time you worked in a team.\"", options: [
            { text: "\"We did a project and it went well.\"", why: "No situation, no action, no result." },
            { text: "\"We all did everything together.\"", why: "The interviewer can't see what YOU did." },
            { text: "\"In our robotics project, I handled the wiring and set up weekly check-ins when we fell behind. We finished a week early.\"", best: true, why: "Clear personal action and a result." },
          ] },
          { situation: "\"Do you have any questions for us?\"", options: [
            { text: "\"No, thank you.\"", why: "It can sound like you're not interested." },
            { text: "\"What do students who do well in this programme have in common?\"", best: true, why: "Shows genuine interest and thought." },
            { text: "\"How many holidays do we get?\"", why: "Fine to know, but not the best first question." },
          ] },
        ],
      },
    },
    {
      id: "t3-m4-l5", type: "task", title: "Write Two STAR Stories", minutes: 15, xp: 40, skill: "writing",
      instructions: "Write two true STAR stories from your own life: one about a challenge you overcame, and one about teamwork or leadership. Label S, T, A and R in each. Use \"I\" for your actions and include a result.",
      minWords: 150, maxWords: 320,
      rubric: ["Both stories follow Situation, Task, Action, Result", "Actions are specific and personal (\"I\")", "Each has a clear result", "Concise - the Action gets the most space", "Correct grammar"],
    },
    {
      id: "t3-m4-l6", type: "voice", title: "Mock Interview: 3 Questions", minutes: 8, xp: 30, skill: "speaking",
      prompt: v({
        id: "t3-m4-voice", type: "interview", minSec: 90, maxSec: 210, targetSec: 150,
        text: "Answer these three questions in one recording, pausing briefly between them: (1) Tell me about yourself. (2) Why do you want to study the course you've chosen? (3) Tell me about a time you worked in a team. Use STAR for the third.",
        tips: ["Keep each answer to about 45-50 seconds.", "Say \"Question two...\" before each new answer to keep it clear.", "For the team story, focus on what you did."],
      }),
    },
    {
      id: "t3-m4-l7", type: "quiz", title: "Module Check-in", minutes: 5, xp: 20, skill: "reading", assessment: true,
      reflection: "Which of your STAR stories is strongest? Which question still makes you nervous?",
      questions: [
        { q: "Which part of a STAR answer should be the longest?", options: ["Situation", "Action", "Task"], answer: 1 },
        { q: "Why say \"I\" rather than \"we\"?", options: ["The interviewer wants to know what you did", "It sounds more confident to be selfish", "It's shorter"], answer: 0 },
        { q: "What makes a result strong?", options: ["A specific outcome, ideally a number, and what you learned", "\"It went fine\"", "Skipping it"], answer: 0 },
        { q: "\"Do you have any questions for us?\" Best response:", options: ["A thoughtful question about the programme", "\"No.\"", "Asking about the interviewer's salary"], answer: 0 },
        { q: "Is it okay to pause before answering?", options: ["Yes - a short pause to think is fine", "No, never", "Only for maths questions"], answer: 0 },
      ],
    },
  ],
};

export const T3_M5: Module = {
  id: "m5",
  title: "SOP and Personal Statement",
  summary: "Write a personal statement that shows - with evidence - why this course is right for you.",
  outcomes: ["Know what admissions readers look for", "Show, don't tell, with specific evidence", "Draft a strong opening and body paragraph"],
  minutes: 65,
  badge: { id: "sop-ready", title: "SOP Ready" },
  lessons: [
    {
      id: "t3-m5-l1", type: "video", title: "Writing a Personal Statement", minutes: 9, xp: 10, skill: "listening",
      youtubeId: "FtCeRCVwfH4", durationSec: 552, channel: "Jack Edwards", reviewedBy: "pending",
      takeaways: [
        "Before you start writing, collect evidence of your interest in the subject - what you've read, done, made or explored.",
        "Most of the statement should be about your subject and your engagement with it; other activities take a smaller share, ideally linked back to the subject.",
        "Don't expect your first draft to be perfect - strong statements go through many drafts.",
      ],
      check: [
        { q: "What should you do before you start writing?", options: ["Collect evidence of your interest in the subject", "Copy a sample statement", "Write the conclusion first"], answer: 0 },
        { q: "What should most of the statement focus on?", options: ["Your subject and how you've engaged with it", "Your hobbies only", "Your family history"], answer: 0 },
        { q: "How many drafts should you expect?", options: ["One perfect draft", "Several drafts", "None - just submit"], answer: 1 },
      ],
    },
    {
      id: "t3-m5-l2", type: "reading", title: "What Admissions Readers Want", minutes: 8, xp: 10, skill: "reading",
      body: [
        "Personal statements and SOPs (statements of purpose) answer one question: why are you a good fit for this course, and this course a good fit for you? Readers look for genuine interest, backed by evidence.",
        { h: "Know your format" },
        { list: ["UK (UCAS): for 2026 entry onwards, the single essay was replaced by three questions - why this subject, how your studies prepared you, and what else you've done to prepare - within one character limit.", "US (Common App): a personal essay of up to 650 words, plus college-specific supplements.", "Other countries and Indian universities that ask for an SOP each set their own length and questions.", "Always check the current year's instructions on the official site before you write."] },
        { h: "Show, don't tell" },
        { list: ["Tell: \"I am passionate about economics.\"", "Show: \"After reading about why onion prices suddenly shot up, I tracked mandi prices in my town for three months and wrote up what I found.\""] },
        { h: "A simple structure" },
        { list: ["Opening - a specific moment or question that sparked your interest (2-3 sentences, not a quote).", "Academic engagement - what you've studied, read and done, and what you learned from it.", "Wider experience - projects, competitions, volunteering, work - linked back to the subject.", "Closing - what you want to explore at university and where it might lead."] },
        { h: "Avoid" },
        { list: ["Famous quotes as openings.", "Lists of achievements with no reflection.", "Statements that could be about anyone.", "Anything you can't talk about confidently in an interview."] },
      ],
    },
    {
      id: "t3-m5-l3", type: "activity", title: "Show, Don't Tell", minutes: 5, xp: 20, skill: "reading",
      activity: {
        kind: "choice", prompt: "Which sentence shows the quality best?",
        scenarios: [
          { situation: "Showing interest in computer science.", options: [
            { text: "\"I have always been fascinated by computers.\"", why: "It tells, but gives no evidence." },
            { text: "\"When our school's attendance register kept losing entries, I built a simple Google Sheets app that teachers now use daily.\"", best: true, why: "A specific action that proves the interest." },
            { text: "\"Computers are the future of the world.\"", why: "A general claim about the world, not about you." },
          ] },
          { situation: "Showing interest in medicine.", options: [
            { text: "\"Shadowing at a rural health camp, I watched one nurse screen eighty patients in a morning - and began reading about how triage works.\"", best: true, why: "A real experience, plus what you did next." },
            { text: "\"I want to be a doctor to serve humanity.\"", why: "Very common and gives no evidence." },
            { text: "\"My parents are doctors, so I will be one too.\"", why: "It says nothing about your own interest." },
          ] },
          { situation: "Ending the statement.", options: [
            { text: "\"Thank you for reading my statement.\"", why: "Wastes the last line." },
            { text: "\"I hope to explore how behavioural economics can improve public health campaigns in India.\"", best: true, why: "Looks ahead with a specific, genuine direction." },
            { text: "\"In conclusion, I am the best candidate.\"", why: "An unproven claim." },
          ] },
        ],
      },
    },
    {
      id: "t3-m5-l4", type: "activity", title: "Order the Statement", minutes: 4, xp: 20, skill: "writing",
      activity: { kind: "order", prompt: "Put these paragraph summaries of a personal statement in the best order.", items: [
        "The moment I tried to repair our water pump and realised I didn't understand how motors worked.",
        "What I studied in physics and maths, and the online course on electrical machines I completed.",
        "Building a solar-powered phone charger for my school's science exhibition, and what failed first.",
        "What I want to explore in electrical engineering, and the kind of problems I hope to work on.",
      ] },
    },
    {
      id: "t3-m5-l5", type: "task", title: "Draft Your Opening and One Body Paragraph", minutes: 25, xp: 40, skill: "writing",
      instructions: "Choose a course you're considering. Write the opening paragraph of your personal statement (a specific moment or question, not a quote) and one body paragraph showing what you've done to explore the subject and what you learned.",
      minWords: 180, maxWords: 400,
      rubric: ["Opening is specific and personal (no clichés or quotes)", "Shows interest with concrete evidence", "Reflects on what was learned", "Clearly connected to the chosen course", "Polished grammar and natural tone"],
    },
    {
      id: "t3-m5-l6", type: "voice", title: "Read Your Opening Aloud", minutes: 5, xp: 30, skill: "speaking",
      prompt: v({
        id: "t3-m5-voice", type: "topic", minSec: 30, maxSec: 90, targetSec: 50,
        text: "Read the opening paragraph of your personal statement aloud, as if to an admissions panel. Then add one sentence, in your own words, on why this course matters to you.",
        tips: ["Reading aloud is the best way to catch clunky sentences.", "Slow down on the specific details.", "Your extra sentence should sound natural, not rehearsed."],
      }),
    },
    {
      id: "t3-m5-l7", type: "quiz", title: "Module Check-in", minutes: 5, xp: 20, skill: "reading", assessment: true,
      reflection: "What's one experience you've had that you could write about - and what did it teach you?",
      questions: [
        { q: "What do admissions readers mainly look for?", options: ["Genuine interest backed by evidence", "Famous quotes", "Long lists of awards"], answer: 0 },
        { q: "\"Show, don't tell\" means...", options: ["Give specific evidence instead of just claiming a quality", "Add pictures", "Write less"], answer: 0 },
        { q: "What's a weak way to open?", options: ["A famous quote", "A specific moment", "A question you've been exploring"], answer: 0 },
        { q: "Before writing an application, you should...", options: ["Check the current official instructions", "Use last year's format", "Copy a friend's"], answer: 0 },
        { q: "Why avoid writing about things you can't discuss?", options: ["Interviewers may ask you about anything in your statement", "Readers don't read it", "It makes it longer"], answer: 0 },
      ],
    },
  ],
};

export const T3_M6: Module = {
  id: "m6",
  title: "MUN and Public Speaking",
  summary: "Represent a country, write a position paper, and give an opening speech with Hook, Point, Action.",
  outcomes: ["Understand how Model UN works", "Write a short position paper", "Deliver a 2-minute opening speech"],
  minutes: 60,
  badge: { id: "delegate", title: "Distinguished Delegate" },
  lessons: [
    {
      id: "t3-m6-l1", type: "video", title: "The Perfect MUN Opening Speech", minutes: 3, xp: 10, skill: "listening",
      youtubeId: "R-t8qqi_vO8", durationSec: 123, channel: "Best Delegate (Model United Nations Institute)", reviewedBy: "pending",
      takeaways: [
        "Public speaking is a huge part of Model UN - even experienced delegates find it hard.",
        "A simple framework helps: Hook, Point, Action (HPA).",
        "Grab attention with a hook, make your country's point, and end with the action you want the committee to take.",
      ],
      check: [
        { q: "What does HPA stand for?", options: ["Hook, Point, Action", "Hello, Policy, Applause", "History, Problem, Answer"], answer: 0 },
        { q: "What does the \"Action\" part do?", options: ["Says what the committee should do", "Tells a joke", "Introduces yourself"], answer: 0 },
        { q: "Why start with a hook?", options: ["To grab the committee's attention", "To fill time", "Because it's the rule"], answer: 0 },
      ],
    },
    {
      id: "t3-m6-l2", type: "reading", title: "How Model UN Works", minutes: 7, xp: 10, skill: "reading",
      body: [
        "In Model United Nations, students act as delegates of countries in a UN committee, debate a global issue, and try to pass a resolution. You speak for your country's position - not your personal opinion.",
        { h: "Before the conference" },
        { list: ["Research the topic and your country's real position.", "Write a position paper: the problem, your country's stance and past actions, and the solutions it supports.", "Prepare an opening speech (often 60-90 seconds - check your committee's rules)."] },
        { h: "During committee" },
        { list: ["Formal debate - delegates speak from a list.", "Moderated caucus - short speeches on one sub-topic.", "Unmoderated caucus - informal time to negotiate and draft.", "Resolution - the document with proposed solutions, voted on at the end."] },
        { h: "Diplomatic language" },
        { list: ["Speak in the third person: \"The delegate of India believes...\"", "\"We urge member states to...\", \"We call upon...\"", "Disagree with policies, never with people."] },
        { example: "\"Every minute, a truckload of plastic enters the ocean. (Hook) The delegation of India believes that tackling plastic pollution requires both reducing single-use plastics and helping developing nations build waste systems. (Point) We urge this committee to support a fund for waste-management infrastructure. (Action)\"" },
      ],
    },
    {
      id: "t3-m6-l3", type: "activity", title: "MUN Terms", minutes: 4, xp: 20, skill: "reading",
      activity: { kind: "match", prompt: "Match each MUN term to its meaning.", pairs: [
        ["Position paper", "A short document stating your country's stance before the conference"],
        ["Moderated caucus", "Short, structured speeches on one sub-topic"],
        ["Unmoderated caucus", "Informal time to move around, negotiate and draft"],
        ["Resolution", "The formal document of solutions that committee votes on"],
        ["Yield", "Giving away the rest of your speaking time"],
        ["Point of order", "Raised when the rules of procedure aren't being followed"],
      ] },
    },
    {
      id: "t3-m6-l4", type: "activity", title: "Order the Opening Speech", minutes: 4, xp: 20, skill: "writing",
      activity: { kind: "order", prompt: "Arrange this opening speech in Hook, Point, Action order.", items: [
        "Honourable Chair, fellow delegates: by 2050, nearly seven in ten people will live in cities.",
        "The delegation of Brazil believes affordable public transport is the key to cities that are both fair and green.",
        "Our nation has seen how bus rapid transit can move millions of people at low cost.",
        "We call upon member states to share funding and expertise for public transport in developing cities. Thank you.",
      ] },
    },
    {
      id: "t3-m6-l5", type: "task", title: "Write a Position Paper", minutes: 25, xp: 40, skill: "writing",
      instructions: "Choose a country and one topic (for example: plastic pollution in the oceans, access to clean water, or AI in education). Write a short position paper in three parts: the problem, your country's position and past actions (state only facts you've checked), and the solutions your country supports.",
      minWords: 200, maxWords: 400,
      rubric: ["Clearly explains the problem", "States the country's position (not personal opinion)", "Proposes realistic solutions", "Formal, diplomatic language", "Well organised in three parts"],
    },
    {
      id: "t3-m6-l6", type: "voice", title: "Your 2-Minute Opening Speech", minutes: 8, xp: 30, skill: "speaking",
      prompt: v({
        id: "t3-m6-voice", type: "opinion", minSec: 75, maxSec: 150, targetSec: 110,
        text: "Give your country's opening speech on the topic of your position paper, in about two minutes. Use Hook, Point, Action, and speak in the third person (\"The delegation of...\").",
        tips: ["Open with a striking fact you've checked, or a short image.", "State your country's position clearly.", "End with a specific call to action."],
      }),
    },
    {
      id: "t3-m6-l7", type: "quiz", title: "Module Check-in", minutes: 5, xp: 20, skill: "reading", assessment: true,
      reflection: "What did you find hardest about speaking for a country instead of for yourself?",
      questions: [
        { q: "In MUN, whose view do you represent?", options: ["Your assigned country's", "Your own", "Your school's"], answer: 0 },
        { q: "Which phrase is diplomatic?", options: ["\"We urge member states to...\"", "\"You're all wrong.\"", "\"Whatever.\""], answer: 0 },
        { q: "What gets voted on at the end of committee?", options: ["The resolution", "The position paper", "The opening speech"], answer: 0 },
        { q: "What should a position paper include?", options: ["The problem, the country's stance and proposed solutions", "Only a list of facts", "Your personal opinion"], answer: 0 },
        { q: "\"We call upon this committee to fund...\" is which part of HPA?", options: ["Hook", "Point", "Action"], answer: 2 },
      ],
    },
  ],
};

export const T3_M7: Module = {
  id: "m7",
  title: "Capstone: Mock Admission Interview",
  summary: "Prepare for an admission interview and take a full 5-minute mock.",
  outcomes: ["Research a college and course", "Prepare answers to the key admission questions", "Complete a 5-minute mock interview"],
  minutes: 75,
  badge: { id: "admission-ready", title: "Admission Ready" },
  lessons: [
    {
      id: "t3-m7-l1", type: "video", title: "College Interview Questions and Answers", minutes: 10, xp: 10, skill: "listening",
      youtubeId: "SJdaX0cqBXY", durationSec: 592, channel: "CareerVidz", reviewedBy: "pending",
      takeaways: [
        "Prepare for the questions that come up again and again: tell me about yourself, why this college, what you can bring, and the biggest challenge you've overcome.",
        "\"Why this college?\" needs specific reasons - which means researching the college and course first.",
        "Colleges look for students who will contribute and who can show how they handle challenges.",
      ],
      check: [
        { q: "Which question is common in college interviews?", options: ["\"Why do you want to study here?\"", "\"What's your favourite film?\" only", "\"How tall are you?\""], answer: 0 },
        { q: "What do you need to answer \"Why this college?\" well?", options: ["Research on the college and course", "A memorised generic answer", "Nothing"], answer: 0 },
        { q: "\"What can you bring to our college?\" is about...", options: ["How you'll contribute", "What you'll take home", "The fees"], answer: 0 },
      ],
    },
    {
      id: "t3-m7-l2", type: "reading", title: "Your Interview Plan", minutes: 8, xp: 10, skill: "reading",
      body: [
        "An admission interview is a conversation to check that you're genuinely interested, can think aloud, and will contribute. Preparation is mostly about knowing yourself, the course and the college.",
        { h: "One week before" },
        { list: ["Read the course structure: 2-3 modules you're excited about.", "Know what makes the college different: a programme, a lab, a club, its location.", "Re-read your application - you may be asked about anything in it.", "Prepare 3-4 STAR stories: a challenge, teamwork, leadership, curiosity."] },
        { h: "Ten questions to prepare" },
        { list: ["Tell me about yourself.", "Why this course?", "Why this college?", "What have you read or done recently about your subject?", "What's your greatest strength? Weakness?", "Tell me about a challenge you overcame.", "What will you contribute to campus life?", "Where do you see yourself after graduating?", "Describe a time you changed your mind.", "Do you have any questions for us?"] },
        { h: "On the day" },
        { list: ["Online: test camera and mic, sit at eye level, plain background, quiet room.", "Answer in 45-90 seconds - long enough to prove, short enough to stay sharp.", "If you don't know, say so and reason aloud: \"I'm not sure, but I'd guess...\"", "End with a real question and a thank-you."] },
      ],
    },
    {
      id: "t3-m7-l3", type: "activity", title: "Why This College?", minutes: 5, xp: 20, skill: "reading",
      activity: {
        kind: "choice", prompt: "Choose the strongest answer.",
        scenarios: [
          { situation: "\"Why do you want to study at our college?\"", options: [
            { text: "\"It's a famous college with a good ranking.\"", why: "True of many colleges - it shows no research." },
            { text: "\"Your B.Sc. lets students take an environmental science minor, and your field station would let me continue my water-quality project.\"", best: true, why: "Specific features linked to your own interests." },
            { text: "\"My cousin studied here.\"", why: "A personal link, but not a reason to study here." },
          ] },
          { situation: "\"What will you bring to our campus?\"", options: [
            { text: "\"I'll bring my experience running our school's coding club - I'd love to start beginner workshops here.\"", best: true, why: "Concrete evidence and a specific plan." },
            { text: "\"I'm a very good student.\"", why: "Vague - it doesn't show contribution." },
            { text: "\"I'll bring my laptop.\"", why: "This misreads the question." },
          ] },
          { situation: "You're asked something you don't know.", options: [
            { text: "Make up an answer confidently.", why: "Interviewers can tell, and it damages trust." },
            { text: "\"I haven't studied that yet, but I'd approach it by...\"", best: true, why: "Honest, and shows how you think." },
            { text: "Stay silent until they move on.", why: "Silence wastes a chance to show your thinking." },
          ] },
        ],
      },
    },
    {
      id: "t3-m7-l4", type: "quiz", title: "Quick Check", minutes: 5, xp: 20, skill: "reading",
      questions: [
        { q: "How long should most interview answers be?", options: ["5 seconds", "About 45-90 seconds", "Five minutes"], answer: 1 },
        { q: "What should you re-read before the interview?", options: ["Your own application", "A random textbook", "Nothing"], answer: 0 },
        { q: "For an online interview, the camera should be...", options: ["At eye level", "Pointing at the ceiling", "Turned off"], answer: 0 },
        { q: "\"Describe a time you changed your mind\" tests...", options: ["Open-mindedness and reflection", "Your marks", "Your memory"], answer: 0 },
        { q: "Which is a good question to ask them?", options: ["\"What do first-year students find most surprising about the course?\"", "\"Is attendance optional?\"", "\"Did I get in?\""], answer: 0 },
      ],
    },
    {
      id: "t3-m7-l5", type: "task", title: "Your Interview Brief", minutes: 20, xp: 40, skill: "writing",
      instructions: "Choose a real college and course you're interested in. Write an interview brief: (1) three specific reasons for this college and course, (2) bullet-point answers to \"Tell me about yourself\" and \"What will you bring?\", (3) one STAR story about a challenge, and (4) two questions you'll ask them.",
      minWords: 200, maxWords: 420,
      rubric: ["Reasons are specific to the college and course", "Answers are concise and backed by evidence", "STAR story is complete with a result", "Questions to ask show genuine interest", "Clear and well organised"],
    },
    {
      id: "t3-m7-l6", type: "voice", title: "5-Minute Mock Admission Interview", minutes: 12, xp: 30, skill: "speaking",
      prompt: v({
        id: "t3-m7-voice", type: "interview", minSec: 180, maxSec: 330, targetSec: 270,
        text: "Your 5-minute mock interview. Answer each question in turn, saying the question number first, in about 45-60 seconds each: (1) Tell me about yourself. (2) Why this course? (3) Why our college? (4) Tell me about a challenge you overcame. (5) What will you bring to our campus? Finish with one question you'd ask the panel.",
        tips: ["Use your interview brief, but don't read it.", "Say \"Question three...\" to signal each answer.", "Use STAR for question four.", "Keep a steady pace - five minutes goes quickly."],
      }),
    },
    {
      id: "t3-m7-l7", type: "quiz", title: "Final Check-in", minutes: 5, xp: 20, skill: "reading", assessment: true,
      reflection: "Listen back to your mock interview. Which answer would you change, and how?",
      questions: [
        { q: "What does an admission interview mainly check?", options: ["Genuine interest, thinking and contribution", "Only your marks", "Your clothes"], answer: 0 },
        { q: "Best structure for \"Tell me about a challenge\":", options: ["STAR", "A list of adjectives", "A quote"], answer: 0 },
        { q: "What makes \"Why this college?\" convincing?", options: ["Specific features linked to your interests", "Its ranking alone", "Its location alone"], answer: 0 },
        { q: "If you don't know an answer...", options: ["Be honest and reason aloud", "Invent facts", "Change the subject"], answer: 0 },
        { q: "How should you end the interview?", options: ["With a real question and a thank-you", "By asking if you passed", "By leaving quickly"], answer: 0 },
      ],
    },
  ],
};

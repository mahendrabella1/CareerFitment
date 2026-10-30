/**
 * Track T2 (Class 9-10, "Express Clearly"), modules 1-6 (spec §4):
 * PREP, pronunciation, letters and emails (no voice), essays, debate, and
 * the capstone. Videos checked embeddable October 2026; takeaways follow
 * each video's chapters and description - `reviewedBy: "pending"` until a
 * teacher has watched them.
 */
import type { Module } from "../types";
import { v } from "./shared";

export const T2_M1: Module = {
  id: "m1",
  title: "Clear Thinking, Clear Speaking",
  summary: "Answer any question in a clear order with PREP - and write paragraphs with PEE.",
  outcomes: ["Structure a spoken answer with Point, Reason, Example, Point", "Write an exam paragraph with Point, Evidence, Explain", "Give a 1-minute structured answer"],
  minutes: 45,
  badge: { id: "prep-pro", title: "PREP Pro" },
  lessons: [
    {
      id: "t2-m1-l1", type: "video", title: "The PREP Framework", minutes: 4, xp: 10, skill: "listening",
      youtubeId: "2zvvQj9ezWg", durationSec: 174, channel: "Vinh Giang", reviewedBy: "pending",
      takeaways: [
        "When someone asks your opinion, it's easy to get lost in your thoughts - usually because you have no framework to organise them.",
        "PREP is a simple framework: Point, Reason, Example, Point.",
        "Having a ready structure (a \"mental model\") helps you sound clear and confident in any situation.",
      ],
      check: [
        { q: "Why do people often ramble when answering a question?", options: ["They have no framework to organise their thoughts", "They speak too slowly", "They know too much"], answer: 0 },
        { q: "What does PREP stand for?", options: ["Prepare, Rehearse, Explain, Present", "Point, Reason, Example, Point", "Plan, Read, Edit, Publish"], answer: 1 },
        { q: "In PREP, why do you say your point twice?", options: ["To fill time", "To open clearly and finish strongly", "Because you forgot"], answer: 1, why: "Starting and ending on your point makes your answer easy to follow and remember." },
      ],
    },
    {
      id: "t2-m1-l2", type: "reading", title: "PREP for Speaking, PEE for Writing", minutes: 6, xp: 10, skill: "reading",
      body: [
        "Clear speakers and writers don't have better ideas - they put the same ideas in a better order. Two tiny frameworks do most of the work.",
        { h: "PREP - for spoken answers" },
        { list: ["Point - your answer in one sentence.", "Reason - why you think so.", "Example - a fact, story or experience that proves it.", "Point - say your answer again, in slightly different words."] },
        { example: "\"I think schools should start at 9 a.m. (Point) Teenagers' body clocks make them sleepy early in the morning, so they learn better later. (Reason) In our school, test scores in the first period are always the lowest. (Example) So a 9 a.m. start would help us learn more, not less. (Point)\"" },
        { h: "PEE - for exam paragraphs" },
        { list: ["Point - the topic sentence that answers the question.", "Evidence - a quote, fact or example from the text or your knowledge.", "Explain - how the evidence proves your point."] },
        "Board exam answers that follow PEE are easier for examiners to mark, because every paragraph clearly shows the point, the proof and the thinking.",
        { h: "Quick tips" },
        { list: ["Pick one point - not three half-points.", "One good example beats three vague ones.", "Pause for a second before you answer. It makes you look thoughtful, not stuck."] },
      ],
    },
    {
      id: "t2-m1-l3", type: "activity", title: "Build a PREP Answer", minutes: 4, xp: 20, skill: "writing",
      activity: { kind: "order", prompt: "Question: \"Should students learn a third language?\" Put this answer in PREP order.", items: [
        "Yes, I think every student should learn a third language.",
        "Knowing more languages helps you connect with more people and opens more job options.",
        "My cousin learned German in school and now works with a car company in Pune that hires German speakers.",
        "So a third language isn't extra load - it's an investment in our future.",
      ] },
    },
    {
      id: "t2-m1-l4", type: "quiz", title: "Quick Check", minutes: 5, xp: 20, skill: "reading",
      questions: [
        { q: "\"For example, last year our school saved 20% on electricity with solar panels.\" Which PREP part is this?", options: ["Point", "Reason", "Example"], answer: 2 },
        { q: "What should the first sentence of a PREP answer do?", options: ["Give your answer directly", "Thank the listener", "Tell a long story"], answer: 0 },
        { q: "In PEE, \"Explain\" means...", options: ["Repeat the quote", "Show how the evidence proves your point", "Start a new topic"], answer: 1 },
        { q: "Which is the best \"Point\" for \"Is cricket India's most popular sport?\"", options: ["\"Well, there are many sports...\"", "\"Yes - cricket is clearly India's most-watched sport.\"", "\"I'm not sure.\""], answer: 1 },
        { q: "Why pause before answering?", options: ["It looks thoughtful and gives you time to pick your point", "It wastes time", "Examiners prefer silence"], answer: 0 },
      ],
    },
    {
      id: "t2-m1-l5", type: "task", title: "Write a PREP Answer", minutes: 10, xp: 40, skill: "writing",
      instructions: "Answer this question in one PREP paragraph: \"Should homework be banned on weekends?\" Take a side, give one reason, one specific example, and finish by restating your point.",
      minWords: 70, maxWords: 160,
      rubric: ["Opens with a clear point", "Gives a reason that supports the point", "Uses a specific example", "Ends by restating the point", "Correct grammar and punctuation"],
    },
    {
      id: "t2-m1-l6", type: "voice", title: "Your 1-Minute Structured Answer", minutes: 6, xp: 30, skill: "speaking",
      prompt: v({
        id: "t2-m1-voice", type: "opinion", minSec: 45, maxSec: 90, targetSec: 60,
        text: "Is it better to study in a group or alone? Answer in about one minute using PREP: Point, Reason, Example, Point.",
        tips: ["Say your point in the first sentence.", "Give one real example - from your own studies if you can.", "Finish by repeating your point in new words."],
        modelAnswer: "I think studying alone works better for most of my subjects. When I study alone, I can go at my own speed and spend extra time on what I find hard. For example, before my maths test I spent two hours on just one chapter, trigonometry, because that's where I make mistakes - in a group we would have moved on much sooner. Group study is great for revising together, but for real learning, studying alone works best for me.",
      }),
    },
    {
      id: "t2-m1-l7", type: "quiz", title: "Module Check-in", minutes: 5, xp: 20, skill: "reading", assessment: true,
      reflection: "Think of a question you were asked recently in class. How would you answer it now with PREP?",
      questions: [
        { q: "Which order is PREP?", options: ["Point, Reason, Example, Point", "Reason, Point, Example, Reason", "Example, Point, Reason, Example"], answer: 0 },
        { q: "Which framework suits an exam paragraph?", options: ["PEE - Point, Evidence, Explain", "ABC", "Only a long introduction"], answer: 0 },
        { q: "What makes an example strong?", options: ["It's specific and real", "It's very long", "It's about a different topic"], answer: 0 },
        { q: "\"So, that's why I believe girls' sports deserve equal funding.\" This is the...", options: ["First point", "Final point", "Evidence"], answer: 1 },
        { q: "How many main points should a 1-minute answer have?", options: ["One clear point", "Five points", "No point at all"], answer: 0 },
      ],
    },
  ],
};

export const T2_M2: Module = {
  id: "m2",
  title: "Pronunciation and Fluency",
  summary: "Stress the right syllables and words, and speak smoothly at a steady pace.",
  outcomes: ["Find the stressed syllable in long words", "Stress the important words in a sentence", "Read aloud clearly and fluently"],
  minutes: 45,
  badge: { id: "clear-voice", title: "Clear Voice" },
  lessons: [
    {
      id: "t2-m2-l1", type: "video", title: "Stress in Long Words", minutes: 5, xp: 10, skill: "listening",
      youtubeId: "SGRIyLimIwU", durationSec: 272, channel: "BBC Learning English", reviewedBy: "pending",
      takeaways: [
        "In long English words it's often hard to know which syllable is stressed - and getting it wrong can make a word hard to recognise.",
        "Word endings (suffixes) give clues: many of them follow a regular stress pattern.",
        "Learning the patterns for common endings helps you stress new words correctly.",
      ],
      check: [
        { q: "Why does word stress matter?", options: ["Wrong stress can make a word hard to understand", "It only matters in poetry", "It changes the spelling"], answer: 0 },
        { q: "What gives a useful clue to where the stress goes?", options: ["The first letter", "The word's ending (suffix)", "How long the word is"], answer: 1 },
        { q: "A stressed syllable is usually...", options: ["Quieter and shorter", "Louder, longer and higher", "Silent"], answer: 1 },
      ],
    },
    {
      id: "t2-m2-l2", type: "reading", title: "Stress, Intonation and Pace", minutes: 6, xp: 10, skill: "reading",
      body: [
        "Clear speech isn't about an accent - it's about being easy to understand. Three things matter most: word stress, sentence stress and pace.",
        { h: "Word stress" },
        "Every word of two or more syllables has one strong syllable. Some endings move the stress:",
        { list: ["-tion / -sion: stress the syllable just before - in-for-MA-tion, de-CI-sion.", "-ic: stress the syllable just before - e-co-NOM-ic, sci-en-TIF-ic.", "-ity: stress the syllable just before - a-BIL-i-ty, u-ni-VER-si-ty.", "Watch the family: PHO-to-graph, pho-TOG-ra-phy, pho-to-GRAPH-ic."] },
        { h: "Sentence stress" },
        "Stress the words that carry meaning (nouns, main verbs, adjectives, \"not\"), and say the small words (a, the, to, of) lightly.",
        { example: "\"I NEED to FINISH my PROJECT by FRIDAY.\"" },
        { h: "Intonation" },
        { list: ["Statements usually fall at the end: \"I live in Hyderabad.\" ↘", "Yes/no questions usually rise: \"Are you coming?\" ↗", "Wh- questions usually fall: \"Where do you live?\" ↘"] },
        { h: "Pace and pauses" },
        "Aim for about 120-150 words a minute. Pause at commas and full stops - a pause is far better than \"um\".",
      ],
    },
    {
      id: "t2-m2-l3", type: "activity", title: "Find the Stress", minutes: 4, xp: 20, skill: "reading",
      activity: { kind: "match", prompt: "Match each word to how it's stressed (capitals = the stressed syllable).", pairs: [
        ["photograph", "PHO-to-graph"],
        ["photography", "pho-TOG-ra-phy"],
        ["education", "ed-u-CA-tion"],
        ["economic", "e-co-NOM-ic"],
        ["ability", "a-BIL-i-ty"],
        ["comfortable", "COM-fort-a-ble"],
      ] },
    },
    {
      id: "t2-m2-l4", type: "activity", title: "Sounds That Get Mixed Up", minutes: 5, xp: 20, skill: "reading",
      activity: {
        kind: "flashcards", prompt: "Say each pair aloud. Tap a card to see the difference, and mark the ones you can say clearly.",
        cards: [
          { word: "ship · sheep", meaning: "Short \"i\" (ship) vs long \"ee\" (sheep).", example: "The sheep were loaded onto the ship." },
          { word: "full · fool", meaning: "Short \"u\" (full) vs long \"oo\" (fool).", example: "Don't be a fool - the bus is full." },
          { word: "vest · west", meaning: "\"v\" - top teeth on the lower lip; \"w\" - rounded lips, no teeth.", example: "He wore a vest on his trip west." },
          { word: "thin · tin", meaning: "\"th\" - tongue lightly between the teeth; \"t\" - tongue behind the teeth.", example: "The thin tin box was empty." },
          { word: "sip · ship", meaning: "\"s\" - a hiss; \"sh\" - lips pushed forward, a softer rush of air.", example: "Take a sip of water on the ship." },
          { word: "bed · bad", meaning: "\"e\" (bed) - mouth half open; \"a\" (bad) - mouth wider open.", example: "It's a bad idea to stay in bed all day." },
        ],
      },
    },
    {
      id: "t2-m2-l5", type: "task", title: "Write a Tongue Twister", minutes: 8, xp: 40, skill: "writing",
      instructions: "Write your own tongue twister of 2-3 lines that practises one of the sound pairs (for example v/w or s/sh). Then, in 2-4 sentences, explain which sounds it practises and why they're tricky.",
      minWords: 35, maxWords: 140,
      rubric: ["The tongue twister repeats the chosen sounds", "Makes sense as a sentence (even if silly)", "Explains which sounds it practises", "Correct spelling and punctuation"],
    },
    {
      id: "t2-m2-l6", type: "voice", title: "Tongue Twister and Read-Aloud", minutes: 6, xp: 30, skill: "speaking",
      prompt: v({
        id: "t2-m2-voice", type: "read_aloud", minSec: 25, maxSec: 75, targetSec: 45,
        text: "Read the tongue twister twice - slowly, then a little faster - then read the passage at a steady pace, stressing the important words.",
        passage: "Vivek's violet van went west on a very wet Wednesday. Vivek's violet van went west on a very wet Wednesday. Our school's science exhibition opens on Friday. The students have built a solar cooker, a rainwater filter and a working model of a metro train. Visitors can vote for their favourite project, and the winning team will present it at the district fair.",
        tips: ["Clear beats fast - speed up only when every sound is clear.", "Stress the meaning words: exhibition, Friday, solar cooker...", "Pause at every full stop."],
      }),
    },
    {
      id: "t2-m2-l7", type: "quiz", title: "Module Check-in", minutes: 5, xp: 20, skill: "reading", assessment: true,
      reflection: "Which sound or word was hardest for you? Practise it five times a day this week.",
      questions: [
        { q: "Where is the stress in \"information\"?", options: ["IN-for-ma-tion", "in-for-MA-tion", "in-for-ma-TION"], answer: 1 },
        { q: "Which words should you stress in a sentence?", options: ["Small words like \"the\" and \"of\"", "Words that carry the meaning", "Every word equally"], answer: 1 },
        { q: "\"Are you coming to the match?\" usually ends with...", options: ["A rising tone", "A falling tone", "No tone"], answer: 0 },
        { q: "A comfortable speaking pace is about...", options: ["60 words a minute", "120-150 words a minute", "250 words a minute"], answer: 1 },
        { q: "To say \"v\" (as in \"van\")...", options: ["Round your lips with no teeth", "Touch your top teeth to your lower lip", "Put your tongue between your teeth"], answer: 1 },
      ],
    },
  ],
};

export const T2_M3: Module = {
  id: "m3",
  title: "Writing Letters and Emails",
  summary: "Write formal letters and emails in the right format and tone.",
  outcomes: ["Use the formal letter format", "Choose a polite, clear tone", "Write a formal letter and a formal email"],
  minutes: 55,
  badge: { id: "letter-writer", title: "Letter Writer" },
  lessons: [
    {
      id: "t2-m3-l1", type: "video", title: "How to Write a Formal Letter", minutes: 9, xp: 10, skill: "listening",
      youtubeId: "hoIPduR_egg", durationSec: 526, channel: "Nihir Shah", reviewedBy: "pending",
      takeaways: [
        "Letters are of two main types: formal and informal.",
        "A formal letter is written for an official or professional purpose - to a principal, a company or a government office - with a specific objective.",
        "Formal letters use simple, polite language that is easy to read; informal letters to friends and family can be casual.",
      ],
      check: [
        { q: "Which is a formal letter?", options: ["A letter to your best friend", "A letter to the municipal office about a broken streetlight", "A birthday note to your cousin"], answer: 1 },
        { q: "A formal letter is written...", options: ["With a specific objective in mind", "Only to share feelings", "Without any format"], answer: 0 },
        { q: "What kind of language suits a formal letter?", options: ["Slang and emojis", "Simple, polite and clear", "Very long, difficult words"], answer: 1 },
      ],
    },
    {
      id: "t2-m3-l2", type: "reading", title: "The Formal Letter and Email Format", minutes: 7, xp: 10, skill: "reading",
      body: [
        "Board exams and real life both reward the same thing: the right format, a clear purpose, and a polite tone.",
        { h: "Formal letter - the parts, in order" },
        { list: ["Sender's address (and email, if asked)", "Date", "Receiver's designation and address (\"The Principal, ...\")", "Subject: one line that says what the letter is about", "Salutation: \"Dear Sir/Madam\" or \"Respected Sir/Madam\"", "Body: (1) why you're writing, (2) the details, (3) what you'd like done", "Complimentary close: \"Yours faithfully\" (to Sir/Madam) or \"Yours sincerely\" (to a named person)", "Your name (and class/designation)"] },
        { example: "Subject: Request to repair the drinking water cooler on the second floor\n\nRespected Madam,\nI am writing to bring to your notice that the water cooler outside Class 9B has not worked for two weeks. ..." },
        { h: "Formal email" },
        { list: ["Subject line that tells the reader what you need.", "Greeting: \"Dear Mr. Rao,\" or \"Dear Ma'am,\"", "Short paragraphs - one idea each.", "A clear request and, if needed, a date.", "Sign-off: \"Regards,\" or \"Thank you,\" then your full name and class."] },
        { h: "Tone" },
        "Be polite and direct. Replace \"I want\" with \"I would like\" or \"I request\". Avoid emojis, SMS spellings and exclamation marks.",
      ],
    },
    {
      id: "t2-m3-l3", type: "activity", title: "Put the Letter in Order", minutes: 4, xp: 20, skill: "writing",
      activity: { kind: "order", prompt: "Arrange the parts of this formal letter in the correct order.", items: [
        "12, Gandhi Nagar, Nagpur",
        "14 November 2026",
        "The Principal, Sunrise Public School, Nagpur",
        "Subject: Request for permission to start a school photography club",
        "Respected Sir,",
        "I am writing to request your permission to start a photography club for Classes 8-10...",
        "Yours faithfully,",
        "Kavya Iyer, Class 9C",
      ] },
    },
    {
      id: "t2-m3-l4", type: "activity", title: "Choose the Right Tone", minutes: 5, xp: 20, skill: "reading",
      activity: {
        kind: "choice", prompt: "Which line suits a formal letter or email best?",
        scenarios: [
          { situation: "Opening a letter to your principal.", options: [
            { text: "Hi Sir!! Hope ur doing gr8.", why: "Too casual - SMS spellings and \"Hi\" don't suit a formal letter." },
            { text: "Respected Sir, I am writing to request leave for two days.", best: true, why: "Polite greeting and a clear purpose in the first line." },
            { text: "Sir, I want leave. Give it.", why: "Sounds rude - use \"I would like to request\"." },
          ] },
          { situation: "Asking a teacher for more time on a project.", options: [
            { text: "Could I please submit my project on Monday instead of Friday? I was unwell this week.", best: true, why: "A polite, specific request with a reason." },
            { text: "I need more time.", why: "Too short - it doesn't say how much time or why." },
            { text: "Everyone else is late too so I should get more time.", why: "Blaming others isn't a good reason." },
          ] },
          { situation: "Closing a letter that began \"Dear Sir/Madam\".", options: [
            { text: "Love,", why: "Only for friends and family." },
            { text: "Yours faithfully,", best: true, why: "\"Yours faithfully\" is used when you don't know the reader's name." },
            { text: "Bye!", why: "Too casual for a formal letter." },
          ] },
        ],
      },
    },
    {
      id: "t2-m3-l5", type: "task", title: "Write a Formal Letter", minutes: 15, xp: 40, skill: "writing",
      instructions: "Write a formal letter to your principal requesting a water cooler, a library period, or a sports facility for your class (choose one). Use the full format: addresses, date, subject, salutation, three-part body, close and name.",
      minWords: 100, maxWords: 220,
      rubric: ["Uses the full formal letter format", "Subject line is clear and specific", "Body explains the purpose, details and request", "Polite, formal tone throughout", "Correct grammar and punctuation"],
    },
    {
      id: "t2-m3-l6", type: "task", title: "Write a Formal Email", minutes: 10, xp: 40, skill: "writing",
      instructions: "Write an email to your class teacher asking to change your project topic. Include a subject line, a greeting, the reason, your new topic, and a polite sign-off with your name and class.",
      minWords: 60, maxWords: 160,
      rubric: ["Has a clear subject line", "Explains the reason briefly", "Makes a specific, polite request", "Signs off properly with name and class"],
    },
    {
      id: "t2-m3-l7", type: "quiz", title: "Module Check-in", minutes: 5, xp: 20, skill: "reading", assessment: true,
      reflection: "Who could you write a formal letter or email to this month - and about what?",
      questions: [
        { q: "What comes right after the receiver's address in a formal letter?", options: ["The subject", "The signature", "The complimentary close"], answer: 0 },
        { q: "You began with \"Dear Mr. Khan\". How do you close?", options: ["Yours faithfully", "Yours sincerely", "Cheers"], answer: 1 },
        { q: "A good subject line is...", options: ["\"Hello\"", "\"Request for a library period on Saturdays\"", "Left blank"], answer: 1 },
        { q: "Which sentence sounds most formal?", options: ["\"I would like to request your permission...\"", "\"Pls allow me...\"", "\"I want it now.\""], answer: 0 },
        { q: "How should the body of a formal letter be organised?", options: ["One long paragraph", "Purpose, details, then the request", "Request only"], answer: 1 },
      ],
    },
  ],
};

export const T2_M4: Module = {
  id: "m4",
  title: "Essay and Paragraph Writing",
  summary: "Write strong paragraphs and a well-organised 250-word essay.",
  outcomes: ["Write a paragraph with a topic sentence and support", "Plan an essay: introduction, body, conclusion", "Use linking words to connect ideas"],
  minutes: 60,
  badge: { id: "essayist", title: "Essayist" },
  lessons: [
    {
      id: "t2-m4-l1", type: "video", title: "Basic Essay Structure", minutes: 4, xp: 10, skill: "listening",
      youtubeId: "7P4fzbzwwAg", durationSec: 213, channel: "Smrt English", reviewedBy: "pending",
      takeaways: [
        "An essay has three parts: an introduction, body paragraphs, and a conclusion.",
        "The introduction opens with a hook to catch the reader's interest, then gives background information that leads to your main idea.",
        "The body develops your main idea, and the conclusion wraps the essay up.",
      ],
      check: [
        { q: "What are the three parts of an essay?", options: ["Hook, title, end", "Introduction, body, conclusion", "Question, answer, quote"], answer: 1 },
        { q: "What is a hook?", options: ["An opening that catches the reader's interest", "The last line", "A list of sources"], answer: 0 },
        { q: "What comes after the hook in the introduction?", options: ["The conclusion", "Background information leading to the main idea", "A new topic"], answer: 1 },
      ],
    },
    {
      id: "t2-m4-l2", type: "reading", title: "From Paragraph to Essay", minutes: 7, xp: 10, skill: "reading",
      body: [
        "A good essay is just a few good paragraphs, in a sensible order, all answering the same question.",
        { h: "A strong paragraph" },
        { list: ["Topic sentence - the one idea of this paragraph.", "Supporting sentences - reasons, facts and examples.", "Closing or linking sentence - sums up or leads to the next paragraph."] },
        { h: "A 250-word essay plan" },
        { list: ["Introduction (about 40-50 words): hook, background, your main idea (thesis).", "Body paragraph 1 (about 60-70 words): first reason with an example.", "Body paragraph 2 (about 60-70 words): second reason with an example.", "Conclusion (about 40 words): restate your main idea and end with a thought or suggestion."] },
        { example: "Hook: \"A city of 10 lakh people can produce hundreds of tonnes of waste every single day.\" Thesis: \"Segregating waste at home is the simplest way each of us can help.\"" },
        { h: "Linking words" },
        { list: ["Adding: moreover, in addition, also", "Contrast: however, on the other hand, although", "Example: for example, for instance", "Result: therefore, as a result, so", "Ending: in conclusion, to sum up"] },
        "Spend two minutes planning before you write. In exams, a planned essay almost always scores better than a longer, unplanned one.",
      ],
    },
    {
      id: "t2-m4-l3", type: "activity", title: "Order the Paragraph", minutes: 4, xp: 20, skill: "writing",
      activity: { kind: "order", prompt: "Put these sentences in order to make a strong paragraph.", items: [
        "Public libraries are one of the most valuable spaces a town can have.",
        "They give every student free access to books, newspapers and the internet.",
        "For example, many students preparing for competitive exams study in libraries because they cannot afford coaching material.",
        "Therefore, every town should invest in a well-stocked public library.",
      ] },
    },
    {
      id: "t2-m4-l4", type: "activity", title: "Linking Words", minutes: 4, xp: 20, skill: "reading",
      activity: { kind: "match", prompt: "Match each linking word to its job.", pairs: [
        ["Moreover", "Adds another point"],
        ["However", "Shows a contrast"],
        ["For instance", "Introduces an example"],
        ["Therefore", "Shows a result"],
        ["Firstly", "Starts a sequence"],
        ["To sum up", "Begins the conclusion"],
      ] },
    },
    {
      id: "t2-m4-l5", type: "task", title: "Write a 250-Word Essay", minutes: 25, xp: 40, skill: "writing",
      instructions: "Write an essay of about 250 words on ONE topic: \"The role of sports in a student's life\", \"Should mobile phones be allowed in schools?\" or \"How my city can reduce plastic waste\". Use an introduction with a hook and your main idea, two body paragraphs with examples, and a conclusion.",
      minWords: 200, maxWords: 330,
      rubric: ["Introduction has a hook and a clear main idea", "Each body paragraph has a topic sentence and an example", "Uses linking words to connect ideas", "Conclusion restates the main idea", "Correct grammar, spelling and punctuation"],
    },
    {
      id: "t2-m4-l6", type: "voice", title: "Read Your Essay Aloud", minutes: 6, xp: 30, skill: "speaking",
      prompt: v({
        id: "t2-m4-voice", type: "topic", minSec: 60, maxSec: 150, targetSec: 100,
        text: "Read the essay you wrote aloud, as if presenting it to your class. Pause between paragraphs and stress the key words.",
        tips: ["Look up from the page at the end of each paragraph.", "Pause between paragraphs - it shows your structure.", "Slow down for your main idea and your conclusion."],
      }),
    },
    {
      id: "t2-m4-l7", type: "quiz", title: "Module Check-in", minutes: 5, xp: 20, skill: "reading", assessment: true,
      reflection: "Which part of your essay was hardest to write - the opening, the body or the ending? What will you try next time?",
      questions: [
        { q: "What does a topic sentence do?", options: ["States the main idea of the paragraph", "Ends the essay", "Lists every example"], answer: 0 },
        { q: "Where does the thesis (main idea) usually go?", options: ["End of the introduction", "Middle of the conclusion", "Nowhere"], answer: 0 },
        { q: "\"However\" is used to...", options: ["Add a similar point", "Show a contrast", "Give an example"], answer: 1 },
        { q: "In a 250-word essay, about how long is each body paragraph?", options: ["10 words", "60-70 words", "200 words"], answer: 1 },
        { q: "A good conclusion...", options: ["Introduces a brand-new argument", "Restates the main idea and ends with a thought", "Repeats the introduction word for word"], answer: 1 },
      ],
    },
  ],
};

export const T2_M5: Module = {
  id: "m5",
  title: "Debate and Elocution",
  summary: "Argue a side, answer the other side, and deliver it with conviction.",
  outcomes: ["Build an argument with claim, reason and evidence", "Rebut an opposing point in four steps", "Deliver a 90-second argument"],
  minutes: 55,
  badge: { id: "debate-champ", title: "Debate Champ" },
  lessons: [
    {
      id: "t2-m5-l1", type: "video", title: "How to Write a Persuasive Speech", minutes: 9, xp: 10, skill: "listening",
      youtubeId: "MIxCgkWoh9U", durationSec: 507, channel: "Fearless Presentations", reviewedBy: "pending",
      takeaways: [
        "Piling up research, pros and cons and lots of data is often a weak way to persuade - it can even make listeners push back.",
        "Stories persuade better than statistics alone, because people remember them and feel them.",
        "End with an action-benefit statement: what you want the audience to do, and what they will gain from doing it.",
      ],
      check: [
        { q: "What's the problem with relying only on facts and data?", options: ["It often fails to persuade and can raise resistance", "Facts are always wrong", "It makes speeches too short"], answer: 0 },
        { q: "Why do stories persuade well?", options: ["People remember them and connect with them", "They're always funny", "They replace your argument"], answer: 0 },
        { q: "An action-benefit statement tells the audience...", options: ["Your name and school", "What to do and what they'll gain", "A list of sources"], answer: 1 },
      ],
    },
    {
      id: "t2-m5-l2", type: "reading", title: "Debate Basics", minutes: 7, xp: 10, skill: "reading",
      body: [
        "In a debate you argue for or against a motion - for example, \"This house believes that homework should be optional.\" The proposition supports it; the opposition argues against it.",
        { h: "Build each argument" },
        { list: ["Claim - what you say is true.", "Reason - why it's true.", "Evidence - a fact, example or story.", "Impact - why it matters."] },
        { h: "Rebut in four steps" },
        { list: ["\"They said...\" - repeat their point fairly.", "\"But...\" - say what's wrong with it.", "\"Because...\" - give your reason or evidence.", "\"Therefore...\" - show why your side is stronger."] },
        { example: "\"The opposition said homework builds discipline. But discipline comes from routine, not volume. Because students already follow a timetable of six hours of classes, extra homework mostly adds stress. Therefore optional homework keeps the discipline without the burnout.\"" },
        { h: "Elocution - how you say it" },
        { list: ["Vary your voice: slow and low for serious points, a little louder for your key line.", "Pause before and after your strongest point.", "Stand still, look at the audience, and use open hand gestures.", "Attack the argument, never the person."] },
      ],
    },
    {
      id: "t2-m5-l3", type: "activity", title: "Rebuttal Practice", minutes: 5, xp: 20, skill: "reading",
      activity: {
        kind: "choice", prompt: "Choose the strongest rebuttal.",
        scenarios: [
          { situation: "Opponent: \"School uniforms make everyone look the same, which kills creativity.\"", options: [
            { text: "\"That's a silly point.\"", why: "It attacks the point without any reasoning." },
            { text: "\"They said uniforms kill creativity. But creativity shows in ideas and work, not clothes. Students still write, paint and invent in uniform - so uniforms don't block it.\"", best: true, why: "It restates the point, says what's wrong, gives a reason and concludes." },
            { text: "\"My friend likes uniforms.\"", why: "One person's liking isn't evidence against the point." },
          ] },
          { situation: "Opponent: \"Online classes are useless because students get distracted.\"", options: [
            { text: "\"They said online classes are useless due to distraction. But distraction happens in classrooms too. Because recorded lessons let students replay hard parts, online learning can actually help.\"", best: true, why: "It uses the four steps and offers a benefit the opponent missed." },
            { text: "\"You are always distracted yourself.\"", why: "That's a personal attack - never attack the speaker." },
            { text: "\"I disagree.\"", why: "Disagreeing without a reason doesn't win the point." },
          ] },
          { situation: "Opponent gives a statistic you think is wrong.", options: [
            { text: "Shout that they're lying.", why: "It loses you credibility." },
            { text: "Politely question the source, then show your argument holds even if the number were true.", best: true, why: "You challenge it fairly and still win on reasoning." },
            { text: "Ignore it completely.", why: "Unanswered points are usually counted against you." },
          ] },
        ],
      },
    },
    {
      id: "t2-m5-l4", type: "activity", title: "Order the Rebuttal", minutes: 4, xp: 20, skill: "writing",
      activity: { kind: "order", prompt: "Put this rebuttal in the four-step order.", items: [
        "The proposition said that banning junk food in canteens takes away students' freedom.",
        "But schools already limit many choices to protect students' health, like banning tobacco nearby.",
        "Because what children eat every day shapes their health for life, the canteen should offer healthy options.",
        "Therefore, a junk-food ban protects students rather than restricting them.",
      ] },
    },
    {
      id: "t2-m5-l5", type: "task", title: "Write Your Debate Speech", minutes: 15, xp: 40, skill: "writing",
      instructions: "Choose a side on the motion \"This house believes homework should be optional\" and write a short debate speech: an opening line, two arguments (each with a reason and evidence), one rebuttal of the other side, and a closing action-benefit line.",
      minWords: 150, maxWords: 260,
      rubric: ["Takes a clear side on the motion", "Two arguments, each with a reason and evidence", "Includes a fair rebuttal of the other side", "Ends with a clear action-benefit close", "Persuasive, respectful language"],
    },
    {
      id: "t2-m5-l6", type: "voice", title: "Your 90-Second Argument", minutes: 6, xp: 30, skill: "speaking",
      prompt: v({
        id: "t2-m5-voice", type: "opinion", minSec: 60, maxSec: 120, targetSec: 90,
        text: "Deliver your debate speech on \"This house believes homework should be optional\" in about 90 seconds: your side, two arguments, one rebuttal, and a strong close.",
        tips: ["State your side in the first sentence.", "Pause before your strongest line.", "End by telling the audience what to do and why."],
        modelAnswer: "Homework should be optional - and I'll show you why. First, rest is part of learning. Students already spend six or seven hours in school, and tired minds don't remember. Second, optional homework lets each student practise what they need. My friend Rohan is strong in science but weak in grammar; optional homework lets him spend his evening on grammar instead of repeating what he already knows. The other side says homework builds discipline. But discipline comes from routine, not from piles of worksheets. So let's make homework optional - and get students who learn more, and burn out less.",
      }),
    },
    {
      id: "t2-m5-l7", type: "quiz", title: "Module Check-in", minutes: 5, xp: 20, skill: "reading", assessment: true,
      reflection: "Which was harder for you - making your own argument or answering the other side's? Why?",
      questions: [
        { q: "The side that supports the motion is called...", options: ["The proposition", "The opposition", "The jury"], answer: 0 },
        { q: "What are the four steps of a rebuttal?", options: ["They said, But, Because, Therefore", "Hello, Point, Story, Bye", "Claim, Joke, Fact, End"], answer: 0 },
        { q: "Which is a fair way to respond to an opponent?", options: ["Criticise their argument", "Criticise them as a person", "Ignore them"], answer: 0 },
        { q: "Why pause before your strongest point?", options: ["To build attention and make it land", "Because you forgot it", "To end early"], answer: 0 },
        { q: "Evidence in an argument can be...", options: ["A fact, example or story", "Only your feelings", "A louder voice"], answer: 0 },
      ],
    },
  ],
};

export const T2_M6: Module = {
  id: "m6",
  title: "Capstone: Speak and Write",
  summary: "Write an essay and give a speech on the same idea - and make it worth sharing.",
  outcomes: ["Focus a piece on one idea", "Turn written work into a spoken speech", "Give a 2-minute speech"],
  minutes: 70,
  badge: { id: "clear-communicator", title: "Clear Communicator" },
  lessons: [
    {
      id: "t2-m6-l1", type: "video", title: "TED's Secret to Great Public Speaking", minutes: 8, xp: 10, skill: "listening",
      youtubeId: "-FOCpMAww28", durationSec: 477, channel: "TED (Chris Anderson)", reviewedBy: "pending",
      takeaways: [
        "The best talks share one thing: the speaker builds an idea in the listeners' minds - a gift they take away.",
        "Limit your talk to one major idea, and give people a reason to care by stirring their curiosity.",
        "Build your idea piece by piece using things your audience already understands, and make it worth sharing.",
      ],
      check: [
        { q: "According to the video, what do great talks have in common?", options: ["They transfer an idea to the listeners", "They are always funny", "They use many slides"], answer: 0 },
        { q: "How many major ideas should a talk focus on?", options: ["One", "Five", "As many as possible"], answer: 0 },
        { q: "How should you build an idea for your audience?", options: ["Using concepts they already understand", "With technical words only", "By skipping the explanation"], answer: 0 },
      ],
    },
    {
      id: "t2-m6-l2", type: "reading", title: "From Essay to Speech", minutes: 7, xp: 10, skill: "reading",
      body: [
        "An essay is read by the eye; a speech is heard by the ear. Listeners can't go back a line, so a speech needs more signposts and simpler sentences.",
        { h: "What changes" },
        { list: ["Shorter sentences - one idea each.", "Signposts - \"My first reason is...\", \"Here's the surprising part...\"", "Repetition - say your main idea at the start, the middle and the end.", "Questions to the audience - \"Have you ever...?\"", "A personal example - a story beats a statistic."] },
        { h: "Your capstone plan" },
        { list: ["Choose one topic and one main idea.", "Write the essay (250 words) - it forces you to think clearly.", "Turn it into a 2-minute speech: a hook, three points with examples, and a closing call to action.", "Practise twice, then record."] },
        { example: "Essay line: \"In conclusion, it is evident that waste segregation is essential.\" Speech line: \"So here's my one request: tonight, put out two bins - wet and dry. That's it.\"" },
      ],
    },
    {
      id: "t2-m6-l3", type: "activity", title: "Essay Line or Speech Line?", minutes: 4, xp: 20, skill: "reading",
      activity: { kind: "match", prompt: "Match each essay line to its speech version.", pairs: [
        ["\"This essay will discuss three benefits of reading.\"", "\"Let me give you three reasons to pick up a book tonight.\""],
        ["\"Statistics indicate that screen time has increased.\"", "\"How many hours did you spend on your phone yesterday?\""],
        ["\"Furthermore, reading improves vocabulary.\"", "\"Here's my second reason - words.\""],
        ["\"In conclusion, reading is beneficial.\"", "\"So tonight, read just ten pages. That's my challenge to you.\""],
      ] },
    },
    {
      id: "t2-m6-l4", type: "quiz", title: "Quick Check", minutes: 5, xp: 20, skill: "reading",
      questions: [
        { q: "Why do speeches need more signposts than essays?", options: ["Listeners can't go back and re-read", "Speeches are always longer", "Teachers prefer them"], answer: 0 },
        { q: "Which is a signpost?", options: ["\"My second reason is...\"", "\"Etc.\"", "\"Um, so...\""], answer: 0 },
        { q: "What works best to make a point memorable in a speech?", options: ["A short personal story", "A long list of numbers", "A complex sentence"], answer: 0 },
        { q: "How long is a 2-minute speech, roughly?", options: ["50 words", "250 words", "800 words"], answer: 1 },
        { q: "A call to action...", options: ["Tells listeners one thing to do", "Lists your sources", "Introduces a new topic"], answer: 0 },
      ],
    },
    {
      id: "t2-m6-l5", type: "task", title: "Capstone Essay", minutes: 25, xp: 40, skill: "writing",
      instructions: "Choose one topic you care about (for example: a problem in your town, a habit worth building, or a change your school should make). Write a 250-word essay on ONE main idea, with an introduction, two body paragraphs with examples, and a conclusion. You'll turn this into your speech next.",
      minWords: 200, maxWords: 330,
      rubric: ["Focuses on one clear main idea", "Introduction hooks the reader and states the idea", "Body paragraphs give reasons with examples", "Conclusion restates the idea with a thought or suggestion", "Correct grammar and good linking words"],
    },
    {
      id: "t2-m6-l6", type: "voice", title: "Your 2-Minute Speech", minutes: 8, xp: 30, skill: "speaking",
      prompt: v({
        id: "t2-m6-voice", type: "topic", minSec: 90, maxSec: 150, targetSec: 120,
        text: "Give a 2-minute speech on the same idea as your essay. Start with a hook, give your points with examples, use signposts, and finish with a clear call to action. Speak from notes - don't read the essay.",
        tips: ["Open with a question or a short story.", "Use signposts: \"First...\", \"Here's why it matters...\"", "End with one thing you want listeners to do."],
      }),
    },
    {
      id: "t2-m6-l7", type: "quiz", title: "Final Check-in", minutes: 5, xp: 20, skill: "reading", assessment: true,
      reflection: "Compare your speech with your first PREP answer in Module 1. What has improved most?",
      questions: [
        { q: "What should a talk or essay focus on?", options: ["One main idea", "Every idea you have", "Only facts"], answer: 0 },
        { q: "Which is better for listeners?", options: ["Short sentences and signposts", "Long sentences with many clauses", "No structure"], answer: 0 },
        { q: "Which makes an argument most persuasive?", options: ["A clear point with a real example", "Speaking very fast", "Using difficult words"], answer: 0 },
        { q: "In an exam paragraph, PEE stands for...", options: ["Point, Evidence, Explain", "Plan, Edit, End", "Point, Example, Exit"], answer: 0 },
        { q: "The best way to deliver a speech is...", options: ["From short notes, looking at the audience", "Reading the essay word for word", "Without any preparation"], answer: 0 },
      ],
    },
  ],
};

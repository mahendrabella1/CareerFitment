/**
 * Communication Lab content (spec "communication-lab.md" v1.0). Every
 * track's full curriculum (spec §4) is built: modules 1-2 of T1 and T4 live
 * here (the MVP, spec §20), the rest in lib/commLab/modules/t1-t4.ts.
 * Every track also has a daily voice challenge.
 *
 * Videos are public YouTube embeds that allow embedding (checked October
 * 2026 with YouTube's oEmbed and the watch page's playableInEmbed). Their
 * takeaways and check questions follow each video's published description
 * and chapters; `reviewedBy` stays "pending" until a teacher has watched
 * them (spec §5 sourcing checklist).
 */
import type { Lesson, Module, Track, VoicePrompt } from "./types";
import { trackIdFor } from "./scoring";
import { v } from "./modules/shared";
import { T1_M3, T1_M4, T1_M5, T1_M6 } from "./modules/t1";
import { T2_M1, T2_M2, T2_M3, T2_M4, T2_M5, T2_M6 } from "./modules/t2";
import { T3_M1, T3_M2, T3_M3, T3_M4, T3_M5, T3_M6, T3_M7 } from "./modules/t3";
import { T4_M3, T4_M4, T4_M5, T4_M6, T4_M7, T4_M8 } from "./modules/t4";

// ------------------------------------------------------------------ T1 · Class 6-8

const T1_M1: Module = {
  id: "m1",
  title: "Hello, I'm Me",
  summary: "Introduce yourself clearly and confidently.",
  outcomes: ["Introduce yourself clearly in 30 seconds", "Use 3 greeting patterns", "Speak at a steady pace"],
  minutes: 45,
  badge: { id: "first-hello", title: "First Hello" },
  lessons: [
    {
      id: "t1-m1-l1", type: "video", title: "Why Communication Matters", minutes: 6, xp: 10, skill: "listening",
      youtubeId: "gCfzeONu3Mo", durationSec: 273, channel: "TED-Ed", reviewedBy: "pending",
      takeaways: [
        "What you mean and what someone else understands are not always the same.",
        "Everyone hears a message through their own experiences and feelings.",
        "Listen carefully, and check that you have understood each other.",
      ],
      check: [
        { q: "Why do misunderstandings happen so often?", options: ["People hear messages through their own experiences", "People talk too fast", "Some words are too long"], answer: 0, why: "Each person makes sense of a message in their own way." },
        { q: "Good communication is…", options: ["Talking as much as you can", "Two people building the same understanding", "Saying the message once, loudly"], answer: 1 },
        { q: "What helps you avoid miscommunication?", options: ["Changing the topic", "Listening and checking you understood", "Never asking questions"], answer: 1 },
      ],
    },
    {
      id: "t1-m1-l2", type: "reading", title: "Parts of a Good Introduction", minutes: 5, xp: 10, skill: "reading",
      body: [
        "A good introduction is short, clear and friendly. It tells people who you are and gives them something to remember you by.",
        { h: "The five parts" },
        { list: ["Name - \"My name is Riya.\"", "Class and school - \"I'm in class 7 at Sunrise Public School.\"", "A hobby - \"I love drawing comics.\"", "A goal - \"I want to become an animator.\"", "A closing - \"Thank you!\" or \"Nice to meet you!\""] },
        { h: "Three ways to greet" },
        { list: ["\"Good morning, everyone!\" - for the class or a stage", "\"Hi, I'm…\" - for new friends", "\"Hello! My name is…\" - works everywhere"] },
        { h: "Keep a steady pace" },
        "Most people speak too fast when they are nervous. Take a breath before you start, smile, and pause for a moment between the parts.",
        { example: "Good morning, everyone! My name is Riya. I'm in class 7 at Sunrise Public School. I love drawing comics, and I want to become an animator. Thank you!" },
      ],
    },
    {
      id: "t1-m1-l3", type: "activity", title: "Build Your Introduction", minutes: 5, xp: 20, skill: "writing",
      activity: { kind: "order", prompt: "Put the parts of the introduction in the best order.", items: ["Good morning, everyone!", "My name is Arjun.", "I'm in class 6 at Little Flower School.", "I love playing cricket.", "I want to become a pilot one day.", "Thank you!"] },
    },
    {
      id: "t1-m1-l4", type: "quiz", title: "Quick Check", minutes: 5, xp: 20, skill: "reading",
      questions: [
        { q: "What should you say first in an introduction?", options: ["Your marks", "A greeting and your name", "Your favourite food"], answer: 1 },
        { q: "Which is a good closing?", options: ["\"That's it.\"", "\"Bye, I'm done.\"", "\"Thank you!\""], answer: 2 },
        { q: "How long should a quick self-introduction be?", options: ["About 30 seconds", "About 5 minutes", "As long as possible"], answer: 0 },
        { q: "You feel nervous. What helps most?", options: ["Speaking faster to finish", "Taking a breath and pausing between parts", "Looking at the floor"], answer: 1 },
        { q: "Which sentence shares a goal?", options: ["\"I'm in class 8.\"", "\"I want to become a doctor.\"", "\"Hello!\""], answer: 1 },
      ],
    },
    {
      id: "t1-m1-l5", type: "task", title: "Write It Down", minutes: 10, xp: 40, skill: "writing",
      instructions: "Write 5 lines about yourself: your name, your class and school, one thing you love doing, one thing you want to become, and a friendly closing.",
      minWords: 25, maxWords: 120,
      rubric: ["Has all five parts", "Complete sentences", "Clear and easy to follow", "Correct spelling and capital letters"],
    },
    {
      id: "t1-m1-l6", type: "voice", title: "Say It Out Loud", minutes: 5, xp: 30, skill: "speaking",
      prompt: v({
        id: "t1-m1-voice", type: "self_intro", minSec: 20, maxSec: 45, targetSec: 30,
        text: "Hi! Tell us your name, your class, one thing you love doing, and one thing you want to become. You have 30 seconds. Take a deep breath and smile before you start!",
        tips: ["Speak slowly.", "Look up, not down.", "Pause instead of saying \"um\"."],
        modelAnswer: "Hi everyone! My name is Asha, and I'm in class seven at Green Valley School. I love painting birds and trees. One day I want to become a wildlife photographer. Thank you!",
      }),
    },
    {
      id: "t1-m1-l7", type: "quiz", title: "Module Check-in", minutes: 5, xp: 20, skill: "reading", assessment: true,
      reflection: "What was the hardest part of introducing yourself, and what will you do differently next time?",
      questions: [
        { q: "Which introduction is the clearest?", options: ["\"Um, so, yeah, I'm Ravi I guess.\"", "\"Hello! I'm Ravi, in class 8. I love chess and want to be an engineer.\"", "\"Ravi. Class 8. Done.\""], answer: 1 },
        { q: "Why do we pause between the parts?", options: ["So listeners can follow", "To fill time", "Because we forgot"], answer: 0 },
        { q: "Which is NOT a greeting?", options: ["\"Good morning!\"", "\"Hello!\"", "\"I like football.\""], answer: 2 },
        { q: "Where should you look while speaking?", options: ["At the floor", "At your listeners", "At the ceiling"], answer: 1 },
        { q: "What makes people remember you?", options: ["One interesting detail, like a hobby", "Speaking very fast", "Saying only your name"], answer: 0 },
      ],
    },
  ],
};

const T1_M2: Module = {
  id: "m2",
  title: "Words that Work",
  summary: "Build new words and use them in sentences.",
  outcomes: ["Use prefixes and suffixes to make new words", "Learn 10 useful speaking words", "Use new words in your own sentences"],
  minutes: 50,
  badge: { id: "word-builder", title: "Word Builder" },
  lessons: [
    {
      id: "t1-m2-l1", type: "video", title: "Prefix or Suffix?", minutes: 4, xp: 10, skill: "listening",
      youtubeId: "H2Z4p0au1yk", durationSec: 193, channel: "The Bazillions", reviewedBy: "pending",
      takeaways: ["A prefix goes at the start of a word.", "A suffix goes at the end of a word.", "Both change what the word means."],
      check: [
        { q: "Where does a prefix go?", options: ["At the start of a word", "At the end of a word", "In the middle"], answer: 0 },
        { q: "In \"helpful\", which part is the suffix?", options: ["help", "-ful", "he-"], answer: 1 },
        { q: "What do prefixes and suffixes do?", options: ["Change a word's meaning", "Make a word louder", "Nothing at all"], answer: 0 },
      ],
    },
    {
      id: "t1-m2-l2", type: "reading", title: "How Words Are Built", minutes: 6, xp: 10, skill: "reading",
      body: [
        "Many English words are built from smaller parts. If you know the parts, you can guess the meaning of words you have never seen.",
        { h: "Prefixes (at the start)" },
        { list: ["un- = not: unhappy, unkind", "re- = again: redo, rewrite", "pre- = before: preview, prepaid", "dis- = opposite: disagree, dislike", "mis- = wrongly: misspell, misunderstand"] },
        { h: "Suffixes (at the end)" },
        { list: ["-ful = full of: careful, hopeful", "-less = without: careless, fearless", "-ness = a state: kindness, happiness", "-er = a person who: teacher, painter", "-able = can be: readable, washable"] },
        { h: "Use a new word in three steps" },
        { list: ["Say it out loud three times.", "Make one sentence about your own life.", "Use it once today when you talk to someone."] },
        { example: "\"I was fearless on the stage today, even though I felt nervous.\"" },
      ],
    },
    {
      id: "t1-m2-l3", type: "activity", title: "Word Flashcards", minutes: 8, xp: 20, skill: "reading",
      activity: {
        kind: "flashcards", prompt: "Tap a card to see what it means. Mark the ones you know.",
        cards: [
          { word: "confident", meaning: "sure of yourself", example: "She felt confident before her speech." },
          { word: "curious", meaning: "wanting to know more", example: "I am curious about how rockets fly." },
          { word: "generous", meaning: "happy to give or share", example: "He was generous with his lunch." },
          { word: "patient", meaning: "able to wait calmly", example: "Be patient while your friend speaks." },
          { word: "describe", meaning: "say what something is like", example: "Describe your favourite place." },
          { word: "explain", meaning: "make something clear", example: "Can you explain the game rules?" },
          { word: "imagine", meaning: "make a picture in your mind", example: "Imagine you are on the moon." },
          { word: "respect", meaning: "treat someone as important", example: "We respect every speaker in class." },
          { word: "improve", meaning: "get better", example: "I practise every day to improve." },
          { word: "achieve", meaning: "succeed in doing something", example: "She achieved her goal of reading 20 books." },
        ],
      },
    },
    {
      id: "t1-m2-l4", type: "activity", title: "Match the Word Parts", minutes: 5, xp: 20, skill: "reading",
      activity: { kind: "match", prompt: "Match each word part to its meaning.", pairs: [["un-", "not"], ["re-", "again"], ["pre-", "before"], ["mis-", "wrongly"], ["-ful", "full of"], ["-less", "without"]] },
    },
    {
      id: "t1-m2-l5", type: "quiz", title: "Words in Action", minutes: 6, xp: 20, skill: "reading",
      questions: [
        { q: "\"The instructions were unclear.\" Unclear means…", options: ["very clear", "not clear", "clear again"], answer: 1 },
        { q: "Which word means \"to write again\"?", options: ["prewrite", "rewrite", "miswrite"], answer: 1 },
        { q: "A person who paints is a…", options: ["painter", "paintful", "painting"], answer: 0 },
        { q: "\"Be careful on the stairs.\" Careful means…", options: ["full of care", "without care", "care again"], answer: 0 },
        { q: "Pick the best word: \"I want to ___ my handwriting.\"", options: ["imagine", "improve", "describe"], answer: 1 },
        { q: "Which sentence uses \"curious\" correctly?", options: ["\"The cake was curious.\"", "\"I'm curious about volcanoes.\"", "\"He curious the ball.\""], answer: 1 },
      ],
    },
    {
      id: "t1-m2-l6", type: "voice", title: "Say Your New Words", minutes: 5, xp: 30, skill: "speaking",
      prompt: v({
        id: "t1-m2-voice", type: "read_aloud", minSec: 30, maxSec: 90, targetSec: 60,
        text: "Pick 5 words from the flashcards. Say one sentence about your own life with each word.",
        tips: ["Say each word clearly, then pause.", "Use sentences about you - your school, home or friends.", "Smile - it makes your voice sound friendly."],
        modelAnswer: "I feel confident when I speak in class. I am curious about how planes stay in the sky. My grandmother is very generous. I try to be patient with my little brother. Every week I practise to improve my reading.",
      }),
    },
    {
      id: "t1-m2-l7", type: "quiz", title: "Module Check-in", minutes: 5, xp: 20, skill: "reading", assessment: true,
      reflection: "Which new word will you use this week, and where?",
      questions: [
        { q: "\"Disagree\" means…", options: ["agree again", "not agree", "agree before"], answer: 1 },
        { q: "Which word has a suffix?", options: ["kindness", "kind", "unkind"], answer: 0 },
        { q: "\"Fearless\" means…", options: ["full of fear", "without fear", "fear again"], answer: 1 },
        { q: "Best way to remember a new word?", options: ["Use it in your own sentence", "Read it once", "Skip it"], answer: 0 },
        { q: "Pick the best word: \"Can you ___ what happened?\"", options: ["explain", "achieve", "generous"], answer: 0 },
      ],
    },
  ],
};

// ------------------------------------------------------------------ T4 · Undergraduate

const T4_M1: Module = {
  id: "m1",
  title: "Professional Communication Basics",
  summary: "Speak so people want to listen, and pitch yourself in 60 seconds.",
  outcomes: ["Avoid the habits that make people stop listening", "Plan any message by audience and purpose", "Deliver a 60-second elevator pitch"],
  minutes: 60,
  badge: { id: "pitch-ready", title: "Pitch Ready" },
  lessons: [
    {
      id: "t4-m1-l1", type: "video", title: "How to Speak So People Want to Listen", minutes: 10, xp: 10, skill: "listening",
      youtubeId: "eIho2S0ZahI", durationSec: 598, channel: "TED (Julian Treasure)", reviewedBy: "pending",
      takeaways: [
        "Seven habits make people stop listening: gossip, judging, negativity, complaining, excuses, exaggeration or lying, and dogmatism.",
        "Four foundations make speech powerful: honesty, authenticity, integrity and love (HAIL).",
        "Your voice is a toolbox: register, timbre, prosody, pace, silence, pitch and volume - and it gets better with warm-ups.",
      ],
      check: [
        { q: "Which of these is one of the \"deadly sins\" of speaking?", options: ["Asking questions", "Complaining", "Pausing"], answer: 1 },
        { q: "What does the \"A\" in HAIL stand for?", options: ["Authenticity", "Attention", "Accuracy"], answer: 0 },
        { q: "Which is part of the vocal toolbox?", options: ["Prosody - the melody of your speech", "Slides", "Body language"], answer: 0 },
      ],
    },
    {
      id: "t4-m1-l2", type: "reading", title: "Audience, Purpose, Point", minutes: 8, xp: 10, skill: "reading",
      body: [
        "Every professional message - an email, a meeting update, an interview answer - is easier when you decide three things before you start.",
        { list: ["Audience: who is this for, and what do they already know?", "Purpose: what should they know, feel or do afterwards?", "Point: the one sentence they must remember. Say it first."] },
        { h: "Lead with the point" },
        "Busy listeners decide in seconds whether to keep listening. Put the conclusion or the request first, then the reasons.",
        { example: "Weak: \"So last week I was looking at the data and there were a few things…\"\nStrong: \"We can cut the delivery time by two days. Here's how.\"" },
        { h: "The 60-second elevator pitch" },
        { list: ["Who you are - name and what you study", "What you're good at - one strength with proof (a project, result or role)", "What you're looking for - an internship, a mentor, a role", "A call to action - \"Could we talk for 15 minutes next week?\""] },
        { example: "\"Hi, I'm Karthik, a third-year B.Com student. I've run the finances for our college fest for two years - a ₹6 lakh budget, closed on time. I'm looking for a summer internship in financial analysis. Could I send you my CV?\"" },
      ],
    },
    {
      id: "t4-m1-l3", type: "activity", title: "What Would You Say?", minutes: 8, xp: 20, skill: "reading",
      activity: {
        kind: "choice", prompt: "Pick the best response in each situation.",
        scenarios: [
          { situation: "Your manager asks for a quick project update in the corridor.", options: [
            { text: "\"We're on track for Friday; one risk is the vendor delay - I'll confirm by tomorrow.\"", best: true, why: "Point first, one risk, a clear next step." },
            { text: "\"So, Monday we started the design, then Tuesday…\"", why: "A timeline buries the point." },
            { text: "\"It's fine.\"", why: "Too vague to be useful." },
          ] },
          { situation: "A recruiter at a career fair says, \"Tell me about yourself.\"", options: [
            { text: "Your full life story from school onwards", why: "Too long - you lose them in the first minute." },
            { text: "A 60-second pitch: who you are, one strength with proof, what you want", best: true, why: "Short, specific and ends with what you're looking for." },
            { text: "\"What would you like to know?\"", why: "Hands the work back to them." },
          ] },
          { situation: "In a group meeting, someone interrupts your point.", options: [
            { text: "Talk louder over them", why: "Turns a discussion into a contest." },
            { text: "Stay silent for the rest of the meeting", why: "Your idea is lost." },
            { text: "\"Can I finish this thought? Then I'd love to hear yours.\"", best: true, why: "Calm, respectful and keeps your turn." },
          ] },
          { situation: "You don't know the answer to a client's question.", options: [
            { text: "Make up an answer so you sound confident", why: "Credibility lost later is hard to win back." },
            { text: "\"Good question - I'll check and get back to you by 4 pm today.\"", best: true, why: "Honest, with a specific follow-up." },
            { text: "\"That's not my department.\"", why: "True perhaps, but unhelpful." },
          ] },
        ],
      },
    },
    {
      id: "t4-m1-l4", type: "quiz", title: "Quick Check", minutes: 6, xp: 20, skill: "reading",
      questions: [
        { q: "Before writing or speaking, decide your audience, your purpose and…", options: ["your font", "your main point", "your outfit"], answer: 1 },
        { q: "Where should the main point go in a work message?", options: ["At the start", "In the middle", "At the very end"], answer: 0 },
        { q: "A good elevator pitch ends with…", options: ["your marks", "a call to action", "an apology"], answer: 1 },
        { q: "Which strength is most convincing?", options: ["\"I'm hard-working.\"", "\"I led a 12-person team that raised ₹40,000 for the library.\"", "\"I'm a people person.\""], answer: 1 },
        { q: "About how long is an elevator pitch?", options: ["60 seconds", "5 minutes", "15 minutes"], answer: 0 },
        { q: "Which habit makes people stop listening?", options: ["Asking for feedback", "Constant complaining", "Speaking clearly"], answer: 1 },
      ],
    },
    {
      id: "t4-m1-l5", type: "activity", title: "Build an Elevator Pitch", minutes: 5, xp: 20, skill: "writing",
      activity: { kind: "order", prompt: "Put this pitch in the most effective order.", items: ["Hi, I'm Neha - a final-year B.Tech student in electronics.", "Last semester I built a low-cost air-quality sensor that our college now uses in six classrooms.", "I'm looking for an internship in embedded systems this summer.", "Could I send you my project report and CV?"] },
    },
    {
      id: "t4-m1-l6", type: "voice", title: "Your Elevator Pitch", minutes: 8, xp: 30, skill: "speaking",
      prompt: v({
        id: "t4-m1-voice", type: "interview", minSec: 45, maxSec: 75, targetSec: 60,
        text: "Give your 60-second elevator pitch: who you are, one strength with proof, what you're looking for, and a call to action.",
        tips: ["Open with your name and what you study.", "Use one specific number or result as proof.", "End with a clear ask."],
        modelAnswer: "Hi, I'm Karthik, a third-year B.Com student at Loyola College. For the last two years I've managed the finances for our college fest, a six lakh rupee budget, and we closed on time and under budget both years. I enjoy turning messy numbers into clear decisions. I'm looking for a summer internship in financial analysis. Could I send you my CV and talk for fifteen minutes next week?",
      }),
    },
    {
      id: "t4-m1-l7", type: "quiz", title: "Module Check-in", minutes: 5, xp: 20, skill: "reading", assessment: true,
      reflection: "Listen back to your pitch. Which sentence would you cut or sharpen?",
      questions: [
        { q: "HAIL stands for honesty, authenticity, integrity and…", options: ["leadership", "love", "logic"], answer: 1 },
        { q: "\"Pace\" in the vocal toolbox means…", options: ["how fast you speak", "how loud you speak", "how you stand"], answer: 0 },
        { q: "A pause before a key point…", options: ["looks unprepared", "adds weight to the point", "should be avoided"], answer: 1 },
        { q: "Which opening leads with the point?", options: ["\"I'd like to start with some background…\"", "\"We should launch in March - here are three reasons.\"", "\"Sorry, this might be boring…\""], answer: 1 },
        { q: "Best proof of a strength?", options: ["A specific result with a number", "An adjective", "A quote from a friend"], answer: 0 },
      ],
    },
  ],
};

const T4_M2: Module = {
  id: "m2",
  title: "Email and LinkedIn Etiquette",
  summary: "Write emails people act on, and a LinkedIn profile that gets read.",
  outcomes: ["Write a clear subject line and lead with the point", "Write a short, specific cold email", "Write a LinkedIn headline and summary"],
  minutes: 65,
  badge: { id: "inbox-pro", title: "Inbox Pro" },
  lessons: [
    {
      id: "t4-m2-l1", type: "video", title: "8 Email Etiquette Tips", minutes: 7, xp: 10, skill: "listening",
      youtubeId: "1XctnF7C74s", durationSec: 421, channel: "Harvard Business Review", reviewedBy: "pending",
      takeaways: [
        "Put the action you need in the subject line, and keep one thread per topic.",
        "Lead with your main point; when replying, sum up what you understood.",
        "Use hyperlinks instead of long raw links, and default to Reply - not Reply all.",
      ],
      check: [
        { q: "What should a good subject line include?", options: ["The action you need", "Just \"Hi\"", "Nothing - leave it empty"], answer: 0 },
        { q: "Where should your main point go?", options: ["At the top", "After the sign-off", "In an attachment"], answer: 0 },
        { q: "What should your default reply button be?", options: ["Reply all", "Reply", "Forward"], answer: 1 },
      ],
    },
    {
      id: "t4-m2-l2", type: "reading", title: "Cold Emails and LinkedIn Profiles", minutes: 10, xp: 10, skill: "reading",
      body: [
        "A cold email goes to someone who doesn't know you. They will give it about ten seconds, so every line has to earn its place.",
        { h: "A cold email in six parts" },
        { list: ["Subject - specific: \"B.Com student - finance internship enquiry (June-July)\"", "Greeting - use their name: \"Dear Ms. Rao,\"", "Who you are - one line", "Why them - one specific reason you're writing to this person or company", "The ask - small and clear: a 15-minute call, or whether to apply", "Thanks and sign-off - with your phone number and LinkedIn link"] },
        { h: "Keep it under 150 words" },
        "Attach your CV as a PDF named \"Firstname-Lastname-CV.pdf\". Send from a professional address, not \"coolguy2004\".",
        { h: "LinkedIn headline" },
        "Your headline shows next to your name everywhere. Say what you do and what you're aiming for.",
        { example: "\"Final-year B.Tech (ECE) | Embedded systems & IoT | Built a sensor used in 6 classrooms\"" },
        { h: "LinkedIn summary (About)" },
        { list: ["Line 1: what you study and what you care about", "Lines 2-3: two achievements with numbers", "Line 4: what you're looking for", "Line 5: how to reach you"] },
      ],
    },
    {
      id: "t4-m2-l3", type: "activity", title: "Order the Cold Email", minutes: 5, xp: 20, skill: "writing",
      activity: { kind: "order", prompt: "Put the parts of this cold email in order.", items: [
        "Subject: B.Com student - finance internship enquiry (June-July)",
        "Dear Ms. Rao,",
        "I'm a third-year B.Com student at Loyola College and I manage the budget for our college fest.",
        "I read about your team's work on small-business lending and would love to learn how you assess risk.",
        "Would you have 15 minutes for a call next week, or could you tell me whether I should apply through the careers page?",
        "Thank you for your time. Karthik S. | +91 98xxxxxx10 | linkedin.com/in/karthik-s",
      ] },
    },
    {
      id: "t4-m2-l4", type: "activity", title: "Email Judgement Calls", minutes: 6, xp: 20, skill: "reading",
      activity: {
        kind: "choice", prompt: "Choose the best option.",
        scenarios: [
          { situation: "Pick the best subject line for an internship enquiry.", options: [
            { text: "\"Hi\"", why: "Says nothing - easy to ignore." },
            { text: "\"Internship enquiry - 2nd-year CSE, ML projects (May-July)\"", best: true, why: "Who, what and when, at a glance." },
            { text: "\"URGENT!!! PLEASE READ\"", why: "Looks like spam." },
          ] },
          { situation: "A class group email asks who can attend Friday's session. You can.", options: [
            { text: "Reply all: \"Yes, I'll come!\"", why: "Fills 60 inboxes with one person's answer." },
            { text: "Reply only to the organiser", best: true, why: "Only the organiser needs it." },
            { text: "Don't reply", why: "The organiser can't plan." },
          ] },
          { situation: "You want to share a long Google Drive link.", options: [
            { text: "Paste the full raw link mid-sentence", why: "Long links clutter the email." },
            { text: "Hyperlink a few words like \"project report\"", best: true, why: "Clean and clear." },
            { text: "Ask them to search for it", why: "Extra work for the reader." },
          ] },
        ],
      },
    },
    {
      id: "t4-m2-l5", type: "quiz", title: "Quick Check", minutes: 6, xp: 20, skill: "reading",
      questions: [
        { q: "How long should a cold email ideally be?", options: ["Under 150 words", "500-800 words", "As long as needed"], answer: 0 },
        { q: "Which ask is best in a cold email?", options: ["\"Please give me a job.\"", "\"Could we talk for 15 minutes next week?\"", "\"Tell me everything about your company.\""], answer: 1 },
        { q: "Best CV file name?", options: ["\"cv final final2.docx\"", "\"Priya-Sharma-CV.pdf\"", "\"resume.doc\""], answer: 1 },
        { q: "A LinkedIn headline should say…", options: ["only \"Student\"", "what you do and what you're aiming for", "your phone number"], answer: 1 },
        { q: "Replying to a thread with a new, unrelated topic is…", options: ["fine", "better as a new email", "required"], answer: 1 },
        { q: "Which sign-off is professional?", options: ["\"Thanks, Riya Menon | +91 … | LinkedIn\"", "\"bye\"", "No sign-off"], answer: 0 },
      ],
    },
    {
      id: "t4-m2-l6", type: "task", title: "Write a Cold Email and Your LinkedIn Profile", minutes: 20, xp: 40, skill: "writing",
      instructions: "Write (1) a cold email to a recruiter at a company you'd like to intern with - subject line included - and (2) a LinkedIn headline and a 4-5 line summary for yourself.",
      minWords: 120, maxWords: 400,
      rubric: ["Specific subject line", "Leads with who you are and why you're writing", "One clear, small ask", "Email under about 150 words", "Headline says what you do and what you're aiming for", "Summary includes achievements with numbers", "Professional, polite tone and correct grammar"],
    },
    {
      id: "t4-m2-l7", type: "quiz", title: "Module Check-in", minutes: 5, xp: 20, skill: "reading", assessment: true,
      reflection: "Who is one real person you could send your cold email to this month?",
      questions: [
        { q: "One email thread should cover…", options: ["one topic", "every open question you have", "the whole semester"], answer: 0 },
        { q: "When replying to a long, messy email, it helps to…", options: ["sum up what you understood first", "reply only \"ok\"", "forward it to everyone"], answer: 0 },
        { q: "Best place for the action you need?", options: ["The subject line and the first lines", "A P.S. at the end", "An attachment"], answer: 0 },
        { q: "A LinkedIn summary should include…", options: ["achievements with numbers", "your marks from class 5", "a list of hobbies only"], answer: 0 },
        { q: "Which address looks professional?", options: ["priya.sharma@gmail.com", "rockstar_priya99@gmail.com", "xyz123@gmail.com"], answer: 0 },
      ],
    },
  ],
};

// ------------------------------------------------------------------ daily challenges (every track)

const DAILY_T1: VoicePrompt[] = [
  v({ id: "d-t1-festival", type: "topic", text: "Speak on: my favourite festival. What happens, and why do you love it?", minSec: 30, maxSec: 90, targetSec: 60 }),
  v({ id: "d-t1-place", type: "topic", text: "Describe your favourite place so we can picture it - what you see, hear and feel there.", minSec: 30, maxSec: 90, targetSec: 60 }),
  v({ id: "d-t1-phones", type: "opinion", text: "Should mobile phones be allowed in school? Say what you think and give two reasons.", minSec: 30, maxSec: 90, targetSec: 60 }),
  v({ id: "d-t1-hero", type: "topic", text: "Tell us about someone you look up to and one thing you learned from them.", minSec: 30, maxSec: 90, targetSec: 60 }),
  v({ id: "d-t1-story", type: "topic", text: "Tell a short story about a time something funny happened to you. Give it a beginning, middle and end.", minSec: 45, maxSec: 90, targetSec: 60 }),
  v({ id: "d-t1-read", type: "read_aloud", text: "Read this passage aloud, clearly and at a steady pace.", minSec: 20, maxSec: 60, targetSec: 35,
    passage: "Every morning, the old banyan tree near our school fills with birds. Parrots argue on the high branches, sparrows hop along the roots, and a single grey crow watches everything from the gate. My friends and I like to guess which bird will fly away first." }),
  v({ id: "d-t1-superpower", type: "opinion", text: "If you could have one superpower for a day, which would you choose and what would you do with it?", minSec: 30, maxSec: 90, targetSec: 60 }),
];

const DAILY_T2: VoicePrompt[] = [
  v({ id: "d-t2-uniform", type: "opinion", text: "Should school uniforms be compulsory? Give a clear point, a reason, an example, and come back to your point (PREP).", minSec: 45, maxSec: 90, targetSec: 60 }),
  v({ id: "d-t2-book", type: "topic", text: "Talk about a book, film or show that changed how you think about something.", minSec: 45, maxSec: 90, targetSec: 60 }),
  v({ id: "d-t2-exams", type: "opinion", text: "Are board exams the best way to measure what students learn? Argue one side in 90 seconds.", minSec: 60, maxSec: 120, targetSec: 90 }),
  v({ id: "d-t2-read", type: "read_aloud", text: "Read this passage aloud with clear stress on the important words.", minSec: 25, maxSec: 70, targetSec: 40,
    passage: "Clean water is something most of us take for granted. Yet in many villages, girls still walk for hours to fetch it. When a village gets a nearby tap, attendance at school often rises. A single change in daily life can open doors that once seemed shut." }),
  v({ id: "d-t2-change", type: "topic", text: "If you could change one thing about your town or city, what would it be, and how?", minSec: 45, maxSec: 90, targetSec: 60 }),
  v({ id: "d-t2-ai", type: "opinion", text: "Should students be allowed to use AI tools for homework? Take a side and give two reasons.", minSec: 45, maxSec: 90, targetSec: 60 }),
];

const DAILY_T3: VoicePrompt[] = [
  v({ id: "d-t3-course", type: "interview", text: "Why do you want to study the course you have chosen? Answer as you would in an admission interview.", minSec: 45, maxSec: 120, targetSec: 75 }),
  v({ id: "d-t3-gd", type: "opinion", text: "Group discussion opening: \"Social media does more harm than good to teenagers.\" Give an opening statement for 60 seconds.", minSec: 45, maxSec: 90, targetSec: 60 }),
  v({ id: "d-t3-challenge", type: "interview", text: "Tell me about a challenge you faced and how you handled it. Use Situation, Task, Action, Result.", minSec: 60, maxSec: 120, targetSec: 90 }),
  v({ id: "d-t3-strength", type: "interview", text: "What is your biggest strength? Give one example that proves it.", minSec: 45, maxSec: 90, targetSec: 60 }),
  v({ id: "d-t3-read", type: "read_aloud", text: "Read this SOP opening aloud as if to an admissions panel.", minSec: 25, maxSec: 70, targetSec: 40,
    passage: "The first time I repaired our neighbour's radio, I was eleven and had no idea what a capacitor was. What I did understand was the joy of making something broken work again. That curiosity has guided my choices ever since, and it is why I want to study electrical engineering." }),
  v({ id: "d-t3-mun", type: "opinion", text: "You are a delegate at a Model UN. In 60 seconds, give your country's opening position on plastic pollution in the oceans.", minSec: 45, maxSec: 90, targetSec: 60 }),
];

const DAILY_T4: VoicePrompt[] = [
  v({ id: "d-t4-about", type: "interview", text: "\"Tell me about yourself.\" Answer as you would in a first-round interview.", minSec: 45, maxSec: 120, targetSec: 75 }),
  v({ id: "d-t4-why", type: "interview", text: "\"Why should we hire you?\" Give three reasons with proof.", minSec: 45, maxSec: 120, targetSec: 75 }),
  v({ id: "d-t4-feedback", type: "roleplay", text: "Roleplay: a teammate keeps missing deadlines. Give them feedback - specific, kind and with a clear next step.", minSec: 45, maxSec: 90, targetSec: 60 }),
  v({ id: "d-t4-weakness", type: "interview", text: "\"What is your biggest weakness?\" Answer honestly and say what you're doing about it.", minSec: 45, maxSec: 90, targetSec: 60 }),
  v({ id: "d-t4-cue", type: "topic", text: "IELTS-style cue card: Describe a skill you learned outside the classroom - what it is, how you learned it, and why it matters to you.", minSec: 60, maxSec: 120, targetSec: 110 }),
  v({ id: "d-t4-project", type: "interview", text: "Explain your best project to someone outside your field, in 90 seconds.", minSec: 60, maxSec: 120, targetSec: 90 }),
  v({ id: "d-t4-read", type: "read_aloud", text: "Read this update aloud as if presenting it in a team meeting.", minSec: 25, maxSec: 70, targetSec: 40,
    passage: "Quick update on the onboarding project. We're on track for the March release. User testing showed that new customers drop off at the payment step, so we've simplified it from four screens to two. The one risk is the bank integration, which we'll confirm by Thursday." }),
];

// ------------------------------------------------------------------ tracks

export const TRACKS: Track[] = [
  {
    id: "t1", code: "T1", title: "Speak with Confidence", level: "Class 6–8", focus: "Confidence, vocabulary, storytelling", weeks: 8,
    modules: [T1_M1, T1_M2, T1_M3, T1_M4, T1_M5, T1_M6],
    planned: [],
    daily: DAILY_T1,
  },
  {
    id: "t2", code: "T2", title: "Express Clearly", level: "Class 9–10", focus: "Structured expression, exam writing, debate", weeks: 8,
    modules: [T2_M1, T2_M2, T2_M3, T2_M4, T2_M5, T2_M6],
    planned: [],
    daily: DAILY_T2,
  },
  {
    id: "t3", code: "T3", title: "College and Career Ready", level: "Class 11–12", focus: "College readiness, GD, interviews, SOP", weeks: 10,
    modules: [T3_M1, T3_M2, T3_M3, T3_M4, T3_M5, T3_M6, T3_M7],
    planned: [],
    daily: DAILY_T3,
  },
  {
    id: "t4", code: "T4", title: "Professional Communication", level: "Undergraduate", focus: "Professional communication, interviews, presentations", weeks: 12,
    modules: [T4_M1, T4_M2, T4_M3, T4_M4, T4_M5, T4_M6, T4_M7, T4_M8],
    planned: [],
    daily: DAILY_T4,
  },
];

// ------------------------------------------------------------------ lookups

export const trackById = (id: string) => TRACKS.find((t) => t.id === id);

/** The track a student is assigned from their class (spec §2). */
export const trackForCategory = (category?: string | null): Track => trackById(trackIdFor(category))!;

export interface LessonRef { track: Track; module: Module; moduleIndex: number; lesson: Lesson; index: number }

export function findLesson(lessonId: string): LessonRef | null {
  for (const track of TRACKS) {
    for (const [moduleIndex, module] of track.modules.entries()) {
      const index = module.lessons.findIndex((l) => l.id === lessonId);
      if (index >= 0) return { track, module, moduleIndex, lesson: module.lessons[index], index };
    }
  }
  return null;
}

/** Every voice prompt (module lessons and daily challenges), with its track. */
export function findPrompt(promptId: string): { prompt: VoicePrompt; track: Track } | null {
  for (const track of TRACKS) {
    for (const m of track.modules) for (const l of m.lessons) if (l.type === "voice" && l.prompt.id === promptId) return { prompt: l.prompt, track };
    const d = track.daily.find((p) => p.id === promptId);
    if (d) return { prompt: d, track };
  }
  return null;
}

/** The daily challenge for a track on a given day (the same all day, for everyone). */
export function dailyPrompt(track: Track, day: Date = new Date()): VoicePrompt {
  const n = Math.floor(Date.UTC(day.getFullYear(), day.getMonth(), day.getDate()) / 86_400_000);
  return track.daily[n % track.daily.length];
}

export const lessonHref = (t: Track, m: Module, l: Lesson) => `/account/communication/${t.id}/${m.id}/${l.id}`;
export const moduleHref = (t: Track, m: Module) => `/account/communication/${t.id}/${m.id}`;

export const TYPE_LABEL: Record<Lesson["type"], string> = { video: "Video", reading: "Reading", quiz: "Quiz", activity: "Activity", task: "Task", voice: "Voice practice" };
export const TYPE_ICON: Record<Lesson["type"], string> = { video: "play", reading: "book", quiz: "check", activity: "target", task: "answer", voice: "audio" };

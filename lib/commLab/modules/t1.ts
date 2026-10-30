/**
 * Track T1 (Class 6-8, "Speak with Confidence"), modules 3-6 (spec §4):
 * Story Time, Listen Like a Pro, Show and Tell, and the capstone My Big Talk.
 * Videos checked embeddable October 2026; takeaways follow each video's
 * chapters and description - `reviewedBy: "pending"` until a teacher has
 * watched them.
 */
import type { Module } from "../types";
import { v } from "./shared";

export const T1_M3: Module = {
  id: "m3",
  title: "Story Time",
  summary: "Tell a story with a clear beginning, middle and end.",
  outcomes: ["Use the Story Spine to plan a story", "Build a problem and a solution", "Tell a 1-minute story out loud"],
  minutes: 50,
  badge: { id: "storyteller", title: "Storyteller" },
  lessons: [
    {
      id: "t1-m3-l1", type: "video", title: "How Stories Are Built", minutes: 5, xp: 10, skill: "listening",
      youtubeId: "bKrCKg9ggVI", durationSec: 237, channel: "Khan Academy (Pixar in a Box)", reviewedBy: "pending",
      takeaways: [
        "Every story has a structure - a frame that holds it together, like a skeleton.",
        "The Story Spine is one way to build it: Once upon a time... Every day... One day... Because of that... Until finally...",
        "The beginning sets up the world, something changes in the middle, and the end shows how things turned out.",
      ],
      check: [
        { q: "What does a story's structure do?", options: ["Holds the story together", "Makes it longer", "Adds pictures"], answer: 0 },
        { q: "Which line in the Story Spine brings the change?", options: ["\"Every day...\"", "\"One day...\"", "\"Once upon a time...\""], answer: 1, why: "\"One day\" is when something new happens and the story starts moving." },
        { q: "What happens at the end of a story?", options: ["We meet the characters", "We find out how things turned out", "Nothing changes"], answer: 1 },
      ],
    },
    {
      id: "t1-m3-l2", type: "reading", title: "Beginning, Middle and End", minutes: 6, xp: 10, skill: "reading",
      body: [
        "Good stories make listeners want to know what happens next. They do that by setting something up, making it difficult, and then solving it.",
        { h: "The three parts" },
        { list: ["Beginning - who, where and what normal life looks like.", "Middle - a problem appears and gets bigger.", "End - the problem is solved, and something has changed."] },
        { h: "The Story Spine" },
        { list: ["Once upon a time...", "Every day...", "One day...", "Because of that...", "Because of that...", "Until finally...", "And ever since then..."] },
        { example: "Once upon a time there was a girl called Meena who was scared of dogs. Every day she took the long way to school to avoid the street dog near the shop. One day it rained, and the long way was flooded. Because of that, she had to walk past the dog. Because of that, she saw it was shivering and hungry. Until finally she shared her biscuit with it. And ever since then, the dog walks her to school." },
        { h: "Make it come alive" },
        { list: ["Use one or two details people can picture (a red umbrella, a squeaky gate).", "Show feelings: \"my hands were shaking\" is better than \"I was scared\".", "Slow down at the exciting part."] },
      ],
    },
    {
      id: "t1-m3-l3", type: "activity", title: "Put the Story in Order", minutes: 5, xp: 20, skill: "writing",
      activity: { kind: "order", prompt: "Put this Story Spine in the right order.", items: [
        "Once upon a time, there was a boy named Ravi who loved kites.",
        "Every day, he flew his kite from the rooftop after school.",
        "One day, a strong wind snapped the string.",
        "Because of that, the kite flew far away over the river.",
        "Because of that, Ravi ran across the bridge to find it.",
        "Until finally, he found it stuck in a mango tree.",
        "And ever since then, he ties a double knot.",
      ] },
    },
    {
      id: "t1-m3-l4", type: "quiz", title: "Quick Check", minutes: 5, xp: 20, skill: "reading",
      questions: [
        { q: "Where do we usually meet the characters?", options: ["The end", "The beginning", "The title only"], answer: 1 },
        { q: "What makes the middle of a story interesting?", options: ["A problem that gets bigger", "A list of names", "The ending first"], answer: 0 },
        { q: "Which line shows a feeling instead of just naming it?", options: ["\"I was scared.\"", "\"My hands were shaking.\"", "\"It was a day.\""], answer: 1 },
        { q: "What should you do at the most exciting part?", options: ["Speak faster to finish", "Slow down", "Skip it"], answer: 1 },
        { q: "\"And ever since then...\" tells us...", options: ["How things changed after the story", "Who the hero is", "Where the story starts"], answer: 0 },
      ],
    },
    {
      id: "t1-m3-l5", type: "task", title: "Write Your Story", minutes: 12, xp: 40, skill: "writing",
      instructions: "Write a short story of 6-8 sentences using the Story Spine. It can be real or made up. Give it a problem in the middle and a clear ending.",
      minWords: 60, maxWords: 220,
      rubric: ["Has a beginning, middle and end", "Has a clear problem and a solution", "Uses at least one detail people can picture", "Complete sentences with correct punctuation"],
    },
    {
      id: "t1-m3-l6", type: "voice", title: "Tell It Out Loud", minutes: 6, xp: 30, skill: "speaking",
      prompt: v({
        id: "t1-m3-voice", type: "topic", minSec: 40, maxSec: 90, targetSec: 60,
        text: "Tell a short story about a time something surprising happened - real or imagined. Use a beginning, a middle with a problem, and an ending. About one minute.",
        tips: ["Start with \"Once...\" or \"One day...\" to pull listeners in.", "Slow down at the exciting part.", "End with how things changed."],
        modelAnswer: "One day last summer, my little brother and I found a tiny bird on our balcony. It couldn't fly and kept hopping in circles. We were worried a cat would get it. So we put it in a shoebox with some water and rice, and asked our neighbour, who works at a vet clinic. She said its wing was only hurt a little. For three days we fed it, and on the fourth morning it flapped twice and flew to the neem tree. Now, every morning, I look for it there.",
      }),
    },
    {
      id: "t1-m3-l7", type: "quiz", title: "Module Check-in", minutes: 5, xp: 20, skill: "reading", assessment: true,
      reflection: "Which part of your story was easiest to tell, and which part would you change next time?",
      questions: [
        { q: "Which is the best opening for a story?", options: ["\"Story finished.\"", "\"One rainy morning, our school bus broke down.\"", "\"Here are some facts.\""], answer: 1 },
        { q: "What is the job of the middle of a story?", options: ["To introduce a problem", "To say thank you", "To list the characters"], answer: 0 },
        { q: "Why add a small detail, like a red umbrella?", options: ["It helps listeners picture the scene", "It makes the story shorter", "Teachers need it"], answer: 0 },
        { q: "\"Because of that...\" in the Story Spine shows...", options: ["How one event leads to the next", "The title", "The moral only"], answer: 0 },
        { q: "A one-minute story is about...", options: ["10 words", "120-150 words", "1,000 words"], answer: 1 },
      ],
    },
  ],
};

const SCIENCE_FAIR = "Good morning, students. This is an important announcement about the Inter-School Science Fair. The fair will be held on Saturday, the fourteenth of December, in the school auditorium, from nine in the morning to one in the afternoon. Students from classes six to eight can take part in teams of two or three. Each team must register with Mrs. Fernandes in the science lab by Friday the sixth. Your project must solve a problem in your home or neighbourhood. The best three projects will go to the district fair in January. Please bring your own chart paper. Thank you.";
const LOST_KITTEN = "Last Sunday, Anu and her friend Kabir were cycling near the lake when they heard a soft crying sound under a parked scooter. It was a tiny grey kitten with a blue collar. The collar had a phone number on it. Kabir's phone had no charge, so they rode to the tea stall and asked the owner to call the number. Twenty minutes later, an old man arrived on a bicycle, almost in tears. The kitten's name was Pepper, and she had been missing for two days. To thank them, he gave them each a bar of chocolate and invited them to visit Pepper anytime.";
const LIBRARY = "Our school library has changed its rules this term. You can now borrow three books at a time instead of two, for fourteen days. If you return a book late, you will not be fined, but you cannot borrow a new book for one week. The library will be open during lunch break on Mondays, Wednesdays and Fridays. Every month, the student who reads the most books will get a free bookmark and their name on the notice board.";

export const T1_M4: Module = {
  id: "m4",
  title: "Listen Like a Pro",
  summary: "Listen carefully, catch the details, and retell what you heard.",
  outcomes: ["Use active listening habits", "Catch who, what, when and where", "Retell a story in your own words"],
  minutes: 45,
  badge: { id: "super-listener", title: "Super Listener" },
  lessons: [
    {
      id: "t1-m4-l1", type: "video", title: "What Is Active Listening?", minutes: 3, xp: 10, skill: "listening",
      youtubeId: "rzsVh8YwZEQ", durationSec: 87, channel: "GCFLearnFree (LearnFree)", reviewedBy: "pending",
      takeaways: [
        "Active listening means giving the speaker your full attention so you truly understand them.",
        "Be patient - let them finish instead of jumping in.",
        "Show you're listening with words (short questions, repeating back) and without words (eye contact, nodding).",
      ],
      check: [
        { q: "Active listening means...", options: ["Waiting for your turn to talk", "Giving the speaker your full attention", "Listening to music while someone talks"], answer: 1 },
        { q: "Which is a non-verbal listening sign?", options: ["Nodding", "Interrupting", "Checking your phone"], answer: 0 },
        { q: "What does \"being patient\" mean when listening?", options: ["Letting the speaker finish", "Finishing their sentences for them", "Changing the topic"], answer: 0 },
      ],
    },
    {
      id: "t1-m4-l2", type: "reading", title: "Five Habits of a Super Listener", minutes: 5, xp: 10, skill: "reading",
      body: [
        "Listening is a skill you can practise, just like a sport. Super listeners catch details others miss - and people love talking to them.",
        { h: "The five habits" },
        { list: ["Look at the speaker and put everything else down.", "Let them finish before you speak.", "Listen for the 5 Ws: who, what, when, where, why.", "Ask one good question if something isn't clear.", "Repeat the main idea in your own words: \"So you're saying...\""] },
        { h: "When you listen to an announcement" },
        "Announcements are full of details: dates, times, places and names. Pick out the ones that ask you to do something - like a deadline to register.",
        { example: "\"Register with Mrs. Fernandes by Friday\" → What? Register. Who? Mrs. Fernandes. When? By Friday." },
      ],
    },
    {
      id: "t1-m4-l3", type: "quiz", title: "Listen: The Science Fair", minutes: 6, xp: 20, skill: "listening",
      listen: SCIENCE_FAIR,
      questions: [
        { q: "When is the science fair?", options: ["Friday the sixth", "Saturday the fourteenth of December", "In January"], answer: 1 },
        { q: "How many students can be in a team?", options: ["Two or three", "Only one", "Five"], answer: 0 },
        { q: "Who do you register with?", options: ["The principal", "Mrs. Fernandes", "Your class teacher"], answer: 1 },
        { q: "What must the project do?", options: ["Win a prize", "Solve a problem at home or in your neighbourhood", "Use a computer"], answer: 1 },
        { q: "What should you bring?", options: ["Your own chart paper", "A laptop", "Your parents"], answer: 0 },
      ],
    },
    {
      id: "t1-m4-l4", type: "activity", title: "Who's Really Listening?", minutes: 5, xp: 20, skill: "reading",
      activity: {
        kind: "choice", prompt: "Choose the best listener in each situation.",
        scenarios: [
          { situation: "Your friend is telling you about a bad day at school.", options: [
            { text: "Look at them, nod, and ask \"What happened next?\"", best: true, why: "You're paying attention and inviting them to share more." },
            { text: "Check your phone while they talk.", why: "It tells them you don't care." },
            { text: "Start talking about your own bad day.", why: "It takes the conversation away from them." },
          ] },
          { situation: "Your teacher is giving instructions for homework.", options: [
            { text: "Note the main points: what, how much, by when.", best: true, why: "Writing the key details helps you remember them." },
            { text: "Talk to the person next to you.", why: "You'll miss the details." },
            { text: "Guess later what you were meant to do.", why: "Guessing often leads to mistakes." },
          ] },
          { situation: "You didn't understand something a classmate explained.", options: [
            { text: "Pretend you understood.", why: "The confusion stays with you." },
            { text: "Ask: \"Can you explain the second part again?\"", best: true, why: "A specific question helps them help you." },
            { text: "Walk away.", why: "That ends the conversation without understanding." },
          ] },
        ],
      },
    },
    {
      id: "t1-m4-l5", type: "quiz", title: "Listen: Library News", minutes: 5, xp: 20, skill: "listening",
      listen: LIBRARY,
      questions: [
        { q: "How many books can you borrow now?", options: ["Two", "Three", "Five"], answer: 1 },
        { q: "What happens if you return a book late?", options: ["You pay a fine", "You can't borrow for a week", "Nothing"], answer: 1 },
        { q: "On which days is the library open at lunch?", options: ["Monday, Wednesday, Friday", "Every day", "Only Saturday"], answer: 0 },
        { q: "What does the top reader each month get?", options: ["A free book", "A bookmark and their name on the notice board", "A day off"], answer: 1 },
      ],
    },
    {
      id: "t1-m4-l6", type: "voice", title: "Listen and Retell", minutes: 6, xp: 30, skill: "speaking",
      prompt: v({
        id: "t1-m4-voice", type: "retell", minSec: 30, maxSec: 75, targetSec: 45,
        listen: LOST_KITTEN,
        text: "Play the clip and listen carefully. Then retell the story in your own words in about 45 seconds: who, what happened, and how it ended.",
        tips: ["You can play the clip more than once.", "Cover who, what, where and how it ended.", "Use your own words - you don't need to remember every word."],
      }),
    },
    {
      id: "t1-m4-l7", type: "quiz", title: "Module Check-in", minutes: 5, xp: 20, skill: "reading", assessment: true,
      reflection: "When do you find it hardest to listen - and what's one habit you'll try this week?",
      questions: [
        { q: "Which is NOT one of the 5 Ws?", options: ["Who", "Wow", "When"], answer: 1 },
        { q: "\"So you're saying...\" is a way to...", options: ["Repeat the main idea back", "Interrupt", "End the chat"], answer: 0 },
        { q: "In an announcement, which detail usually matters most?", options: ["What you must do, and by when", "The speaker's voice", "How long it is"], answer: 0 },
        { q: "A super listener...", options: ["Lets the speaker finish", "Thinks about lunch", "Finishes the speaker's sentences"], answer: 0 },
        { q: "When you retell a story, you should...", options: ["Use your own words and keep the main events", "Add a new ending", "Only say the names"], answer: 0 },
      ],
    },
  ],
};

export const T1_M5: Module = {
  id: "m5",
  title: "Show and Tell",
  summary: "Speak in front of your class about something that matters to you.",
  outcomes: ["Plan a short talk about an object", "Manage stage nerves", "Stand, look and speak with confidence"],
  minutes: 50,
  badge: { id: "show-and-tell-star", title: "Show-and-Tell Star" },
  lessons: [
    {
      id: "t1-m5-l1", type: "video", title: "Be a More Confident Speaker", minutes: 5, xp: 10, skill: "listening",
      youtubeId: "tShavGuo0_E", durationSec: 279, channel: "WellCast", reviewedBy: "pending",
      takeaways: [
        "Fear of public speaking is extremely common - most people feel it, so you're not alone.",
        "Preparing and practising your talk is the best way to calm your nerves.",
        "Stand tall, use your body naturally, and connect with your audience by looking at them.",
      ],
      check: [
        { q: "How common is the fear of public speaking?", options: ["Very rare", "Very common", "Only adults have it"], answer: 1 },
        { q: "What helps most with nerves before a talk?", options: ["Preparing and practising", "Not thinking about it", "Speaking very fast"], answer: 0 },
        { q: "Which helps you connect with your audience?", options: ["Looking at the floor", "Looking at people", "Reading from the paper the whole time"], answer: 1 },
      ],
    },
    {
      id: "t1-m5-l2", type: "reading", title: "Plan Your Show-and-Tell", minutes: 5, xp: 10, skill: "reading",
      body: [
        "Pick an object that has a story - a gift, a medal, a photo, something you made. The story is what makes people listen.",
        { h: "Four parts, about one minute" },
        { list: ["What it is - hold it up so everyone can see.", "Where it came from - who gave it to you, or how you got it.", "Why it matters to you - the feeling or memory.", "One fun fact or surprise about it."] },
        { h: "Before you start" },
        { list: ["Stand with your feet apart and shoulders back.", "Take one slow breath.", "Smile and look at three friends in different parts of the room."] },
        { example: "\"This is my grandfather's old compass. He used it when he was in the Navy. He gave it to me when I was eight, and he said, 'This will always point you home.' The funny thing is - it actually points a little bit wrong, because it's so old!\"" },
      ],
    },
    {
      id: "t1-m5-l3", type: "activity", title: "Order Your Talk", minutes: 4, xp: 20, skill: "writing",
      activity: { kind: "order", prompt: "Put these lines of a show-and-tell talk in the best order.", items: [
        "Good morning, everyone! I've brought something special today.",
        "This is the trophy I won at the inter-school chess tournament.",
        "I practised every evening for three months with my uncle.",
        "It matters to me because I almost gave up after losing my first two games.",
        "Fun fact: the final game lasted almost two hours!",
        "Thank you for listening.",
      ] },
    },
    {
      id: "t1-m5-l4", type: "activity", title: "Beat the Nerves", minutes: 5, xp: 20, skill: "reading",
      activity: {
        kind: "choice", prompt: "What's the best thing to do?",
        scenarios: [
          { situation: "Your heart is racing just before your turn.", options: [
            { text: "Take a slow, deep breath and remember your first line.", best: true, why: "Slow breathing calms your body, and a first line gets you started." },
            { text: "Tell the teacher you feel sick.", why: "Avoiding it makes the fear bigger next time." },
            { text: "Speak as fast as you can to finish.", why: "Rushing makes it harder for people to understand you." },
          ] },
          { situation: "You forget what comes next in the middle of your talk.", options: [
            { text: "Stop and say \"Sorry, I forgot\" and sit down.", why: "You can recover easily - don't give up." },
            { text: "Pause, glance at your cue card, and carry on.", best: true, why: "A short pause looks normal to the audience." },
            { text: "Start the whole talk again.", why: "Just carry on from where you are." },
          ] },
          { situation: "Some classmates giggle while you're speaking.", options: [
            { text: "Look at friendly faces and keep going.", best: true, why: "Focusing on supportive people keeps you steady." },
            { text: "Stop and argue with them.", why: "It takes attention away from your talk." },
            { text: "Lower your voice so they can't hear.", why: "Then nobody can hear you." },
          ] },
        ],
      },
    },
    {
      id: "t1-m5-l5", type: "task", title: "Make Your Cue Card", minutes: 10, xp: 40, skill: "writing",
      instructions: "Choose your object and write your talk notes: what it is, where it came from, why it matters, and one fun fact. Keep it short - these are the notes you'd glance at, not a full script.",
      minWords: 40, maxWords: 160,
      rubric: ["Covers all four parts", "Explains why it matters to you", "Includes one interesting detail or fact", "Short and easy to glance at"],
    },
    {
      id: "t1-m5-l6", type: "voice", title: "Your Show-and-Tell", minutes: 6, xp: 30, skill: "speaking",
      prompt: v({
        id: "t1-m5-voice", type: "topic", minSec: 40, maxSec: 90, targetSec: 60,
        text: "Give your one-minute show-and-tell: what your object is, where it came from, why it matters to you, and one fun fact. Imagine your class in front of you.",
        tips: ["Start with a greeting.", "Hold up (or describe) your object early.", "End with \"Thank you for listening.\""],
        modelAnswer: "Good morning, everyone! This is a bracelet made of seeds. My grandmother made it for me when I visited her village in Kerala. She showed me how she picked the seeds from a tree near her house and dried them in the sun. It matters to me because she taught me patience - it took her three days to make it. Fun fact: when it rains, the seeds smell a little sweet! Thank you for listening.",
      }),
    },
    {
      id: "t1-m5-l7", type: "quiz", title: "Module Check-in", minutes: 5, xp: 20, skill: "reading", assessment: true,
      reflection: "What helped you feel calmer when you recorded your talk?",
      questions: [
        { q: "What makes a show-and-tell interesting?", options: ["The story behind the object", "The price of the object", "How quickly you finish"], answer: 0 },
        { q: "How should you stand?", options: ["Feet apart, shoulders back", "Leaning on the wall", "Hands in pockets"], answer: 0 },
        { q: "You forget a line. What do you do?", options: ["Pause and check your cue card", "Give up", "Laugh and leave"], answer: 0 },
        { q: "Where should you look while speaking?", options: ["At a few friendly faces around the room", "At the ceiling", "Only at the teacher's desk"], answer: 0 },
        { q: "A cue card should have...", options: ["Short notes", "The whole talk word for word", "Nothing"], answer: 0 },
      ],
    },
  ],
};

export const T1_M6: Module = {
  id: "m6",
  title: "My Big Talk (capstone)",
  summary: "Plan, practise and give a 2-minute talk on a topic you care about.",
  outcomes: ["Choose a delivery style that suits you", "Plan a talk with a hook, three points and an ending", "Give a 2-minute talk"],
  minutes: 60,
  badge: { id: "big-talk", title: "Big Talk Champion" },
  lessons: [
    {
      id: "t1-m6-l1", type: "video", title: "The Best Way to Give a Talk", minutes: 9, xp: 10, skill: "listening",
      youtubeId: "1sOgYNgq88E", durationSec: 487, channel: "TED-Ed", reviewedBy: "pending",
      takeaways: [
        "There's more than one way to deliver a talk: memorise a script, read it, or speak from notes or an outline.",
        "Memorising word for word can sound stiff, and it's easy to lose your place.",
        "Many speakers plan their key points and practise until speaking from notes feels natural.",
      ],
      check: [
        { q: "What's a risk of memorising your talk word for word?", options: ["It can sound stiff and you can lose your place", "It's always perfect", "It's too short"], answer: 0 },
        { q: "Speaking from an outline means...", options: ["Reading every word", "Using your key points as a guide", "Making it up with no plan"], answer: 1 },
        { q: "What's the best delivery style?", options: ["The same for everyone", "The one that helps you speak clearly and confidently", "Always reading from paper"], answer: 1 },
      ],
    },
    {
      id: "t1-m6-l2", type: "reading", title: "Plan Your Big Talk", minutes: 6, xp: 10, skill: "reading",
      body: [
        "A two-minute talk is about 250 words. That's enough for one idea, explained well.",
        { h: "Pick your topic" },
        "Choose something you care about: a hobby, a problem in your area, a person you admire, or something you've learned.",
        { h: "The plan" },
        { list: ["Hook (10 seconds) - a question, a surprising fact or a tiny story.", "Three points (90 seconds) - each with one example.", "Ending (20 seconds) - your message, and what you want listeners to think or do."] },
        { example: "Hook: \"How many of you threw away plastic today?\" Points: 1) how much plastic one family uses, 2) where it goes, 3) three easy swaps. Ending: \"Try one swap this week.\"" },
        { h: "Practise three times" },
        { list: ["Once alone, from your notes.", "Once timing yourself.", "Once in front of a family member or mirror."] },
      ],
    },
    {
      id: "t1-m6-l3", type: "activity", title: "Match the Talk Parts", minutes: 4, xp: 20, skill: "reading",
      activity: { kind: "match", prompt: "Match each part of a talk to an example.", pairs: [
        ["Hook", "\"Did you know a mango tree can live for 100 years?\""],
        ["Point", "\"First, trees cool our streets in summer.\""],
        ["Example", "\"Our street is 3 degrees cooler since we planted ten trees.\""],
        ["Ending", "\"So this monsoon, let's each plant one tree.\""],
      ] },
    },
    {
      id: "t1-m6-l4", type: "quiz", title: "Quick Check", minutes: 5, xp: 20, skill: "reading",
      questions: [
        { q: "About how many words is a 2-minute talk?", options: ["50", "250", "1,000"], answer: 1 },
        { q: "Which is a good hook?", options: ["\"My talk is about trees.\"", "\"What if our city had no trees?\"", "\"Okay, so, um...\""], answer: 1 },
        { q: "How many main points suit a 2-minute talk?", options: ["About three", "Ten", "One sentence only"], answer: 0 },
        { q: "A good ending...", options: ["Repeats your message and asks listeners to do something", "Stops suddenly", "Adds a new topic"], answer: 0 },
        { q: "How should you practise?", options: ["Never - it's better to be natural", "A few times, including once with a listener", "Only in your head"], answer: 1 },
      ],
    },
    {
      id: "t1-m6-l5", type: "task", title: "Write Your Talk Outline", minutes: 15, xp: 40, skill: "writing",
      instructions: "Write the outline for your 2-minute talk: your hook, three points with one example each, and your ending message. Bullet points are fine.",
      minWords: 80, maxWords: 300,
      rubric: ["Has a hook that grabs attention", "Three clear points, each with an example", "A clear ending message", "Fits a 2-minute talk"],
    },
    {
      id: "t1-m6-l6", type: "voice", title: "Give Your Big Talk", minutes: 8, xp: 30, skill: "speaking",
      prompt: v({
        id: "t1-m6-voice", type: "topic", minSec: 90, maxSec: 150, targetSec: 120,
        text: "This is your Big Talk! Speak for about two minutes on the topic you planned: start with your hook, give your three points with examples, and finish with your message.",
        tips: ["Glance at your outline, then look up.", "Pause between your points.", "Finish strong - say your message slowly."],
        modelAnswer: "What if our city had no trees? It would be hotter, noisier and much less beautiful. Today I want to tell you why trees matter, and what we can do. First, trees cool our streets. On our road, since the residents planted ten neem trees, it feels cooler even in May. Second, trees clean the air. Their leaves trap dust, which is why parks feel fresher. Third, trees are homes. One tree can have nests, squirrels and hundreds of insects. So this monsoon, let's each plant one sapling and look after it for a year. One tree each - imagine what our city would look like. Thank you.",
      }),
    },
    {
      id: "t1-m6-l7", type: "quiz", title: "Final Check-in", minutes: 5, xp: 20, skill: "reading", assessment: true,
      reflection: "Look back at your first self-introduction in Module 1. What has changed about the way you speak?",
      questions: [
        { q: "Which delivery style helps you keep eye contact?", options: ["Speaking from short notes", "Reading every word", "Looking at the floor"], answer: 0 },
        { q: "The hook should come...", options: ["At the very start", "In the middle", "After the ending"], answer: 0 },
        { q: "Each main point is stronger with...", options: ["An example", "A longer sentence", "A different topic"], answer: 0 },
        { q: "What's a healthy speaking speed?", options: ["As fast as possible", "Steady, with pauses between points", "Very slow, one word at a time"], answer: 1 },
        { q: "After your talk, the best way to improve is to...", options: ["Never listen to it", "Listen back and pick one thing to change", "Give up speaking"], answer: 1 },
      ],
    },
  ],
};

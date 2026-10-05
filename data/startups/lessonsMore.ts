/**
 * Builder-track lessons for Modules 2-11 beyond the original Phase 1 seed,
 * following the module and lesson list in "Startups Section - Complete Build
 * Plan" (section 3). Each lesson has five quiz questions, like the plan's
 * sample lesson. Video IDs are only those from the plan's verified library
 * (data/startups/videos.ts); lessons without a fitting verified video use null.
 *
 * India-specific rules in Module 10 and the grants in Module 11 were checked in
 * October 2026 and are dated in the text. Learners are told to confirm on the
 * official portal, because these rules change.
 */
import type { Lesson, QuizQuestion, SkillTag } from "@/data/startups/content";

type Opt = string;

function q(id: string, skillTag: SkillTag, prompt: string, options: Opt[], correct: number | number[], explanation: string): QuizQuestion {
  const ids = ["a", "b", "c", "d", "e"];
  const correctIdx = Array.isArray(correct) ? correct : [correct];
  return {
    id, skillTag, prompt, explanation,
    type: correctIdx.length > 1 ? "MULTI" : "SINGLE",
    options: options.map((text, i) => ({ id: ids[i], text })),
    correctOptionIds: correctIdx.map((i) => ids[i]),
  };
}

function tf(id: string, skillTag: SkillTag, prompt: string, answer: boolean, explanation: string): QuizQuestion {
  return { id, skillTag, type: "TRUE_FALSE", prompt: `True or false: ${prompt}`, options: [{ id: "true", text: "True" }, { id: "false", text: "False" }], correctOptionIds: [answer ? "true" : "false"], explanation };
}

function lesson(l: { slug: string; title: string; min: number; video?: string; hook: string; points: string[]; example: string; task: string; quiz: QuizQuestion[] }): Lesson {
  return { slug: l.slug, title: l.title, order: 0, durationMin: l.min, youtubeId: l.video ?? null, hook: l.hook, contentMd: l.points.join("\n"), exampleMd: l.example, taskPrompt: l.task, passMark: 60, quiz: l.quiz };
}

// ---------------- Module 2: Finding the right problem ----------------

export const M2_WHO_HAS_IT = lesson({
  slug: "who-has-this-problem",
  title: "Who Has This Problem?",
  min: 9,
  hook: "\"Everyone has this problem\" sounds exciting, but you can't talk to everyone, sell to everyone or build for everyone. Who has it worst?",
  points: [
    "A problem belongs to people. Name them as exactly as you can: not \"students\", but \"class 11 students in hostels who eat dinner after 9 pm\".",
    "Look for the people who feel the problem most often and most painfully. They are your first customers.",
    "Check whether they are already trying to fix it. Workarounds such as WhatsApp groups, spreadsheets or asking a friend show the pain is real.",
    "Check whether you can reach them. A group you can meet at school or in your colony is easier to learn from than one you'd only find online.",
    "Different groups can have the same problem for different reasons, so pick one group to start.",
  ],
  example: "Late-night hunger in hostels affects many students, but it is worst for those with coaching classes until 9 pm, after the mess closes. That narrower group is easier to find and to help first.",
  task: "For your problem, write three different groups who face it. For each, note how often it happens to them and whether you can reach them. Circle the group to start with.",
  quiz: [
    q("q1", "customers", "Which description of a customer group is most useful?", ["Everyone in India", "Students", "Class 11 hostel students with coaching classes until 9 pm", "People who like food"], 2, "A specific group can be found, talked to and served first."),
    q("q2", "customers", "What sign shows a group really feels the problem?", ["They say it sounds interesting", "They already use a workaround to deal with it", "They follow you on Instagram", "They have never thought about it"], 1, "Existing workarounds show people are already spending effort to fix it."),
    tf("q3", "customers", "starting with one narrow group is a mistake because it makes your market too small forever.", false, "You start narrow to learn fast, then expand once something works."),
    q("q4", "customers", "Why does it matter whether you can reach the group easily?", ["It doesn't matter", "You need to talk to them, test ideas and later sell to them", "Investors check this first", "It makes your logo better"], 1, "Easy access lets you learn quickly and cheaply."),
    q("q5", "customers", "Which TWO things help you choose which group to start with?", ["How often they face the problem", "How famous they are", "Whether you can reach them", "Whether they have the newest phones"], [0, 2], "Frequency of the pain and your access to the group matter most at the start."),
  ],
});

export const M2_HOW_BIG = lesson({
  slug: "how-big-is-the-problem",
  title: "How Big Is the Problem?",
  min: 10,
  hook: "A problem that bothers 20 people once a year is very different from one that costs 2 lakh people money every week. How do you tell which you have?",
  points: [
    "Size has three parts: how many people have it, how often it happens, and how much it costs them in money, time or stress.",
    "Make a rough estimate with numbers you can check, for example the number of schools in your city × students per school × the share who face the problem.",
    "Write down every number you assume, and where it came from. A rough estimate with clear assumptions beats a big number you can't explain.",
    "Small is not always bad. A small, painful problem that people pay to fix can be a great first business.",
    "Use public data where you can, such as government statistics, school or college counts, or your own survey results.",
  ],
  example: "A student estimates exam-stationery demand: 60 schools in the town × about 800 students × 2 refills a term = about 96,000 refills a term. Every number is written down with its source, so a teacher can check it.",
  task: "Estimate how many people in your town or city face your problem. Show each number you multiply and say where it came from.",
  quiz: [
    q("q1", "validation", "Which three things together describe how big a problem is?", ["Logo, colour and name", "How many people, how often, and how much it costs them", "Number of competitors, investors and apps", "Your age, class and school"], 1, "Count, frequency and cost together give the size."),
    q("q2", "validation", "What makes an estimate trustworthy?", ["A very large final number", "Clear, checkable assumptions for each step", "Using as many zeros as possible", "Copying a number from a pitch deck"], 1, "People trust estimates they can follow and check."),
    tf("q3", "validation", "a small problem can never become a good business.", false, "A small but painful problem that people pay to fix can be a great start."),
    q("q4", "validation", "A problem happens to many people but costs them almost nothing. What is the risk?", ["None", "People may not care enough to pay for a fix", "It is illegal", "It is too easy to build"], 1, "Low pain often means low willingness to pay."),
    q("q5", "validation", "Which is the best source for counting schools in your district?", ["A random social media post", "Official education data or a district list", "Your guess", "An advertisement"], 1, "Official data is the most reliable starting point."),
  ],
});

// ---------------- Module 3: Customer discovery ----------------

export const M3_WHY_TALK = lesson({
  slug: "why-talk-to-customers",
  title: "Why Talk to Customers?",
  min: 8,
  hook: "Two teams build the same school app. One spends a week talking to 15 students first; the other starts coding on day one. Six weeks later, only one has users. Guess which?",
  points: [
    "Your idea is a set of guesses: who has the problem, how bad it is, what they do now, and what they'd pay. Talking to customers tests those guesses cheaply.",
    "One week of conversations can save months of building the wrong thing.",
    "You aren't selling in these talks. You are learning how people live with the problem today.",
    "Talk to people who actually face the problem, not just friends and family who want to be kind.",
    "Write notes straight after every conversation, while you still remember the exact words people used.",
  ],
  example: "Before building a lost-and-found app for school, a team asked 12 students about the last thing they lost. Most had found it by asking in class WhatsApp groups within a day, so the team moved to a different problem and saved weeks.",
  task: "List the five biggest guesses behind your idea. Next to each, write one question you could ask a real person to test it.",
  quiz: [
    q("q1", "customers", "Why talk to customers before building?", ["To get compliments", "To test your guesses cheaply before spending time building", "Because it's a rule", "To sell them something immediately"], 1, "Conversations are the cheapest way to find out if your guesses are wrong."),
    q("q2", "customers", "Who should you mostly interview?", ["Only your family", "People who actually face the problem", "Famous founders", "Anyone online, whoever they are"], 1, "Only people with the problem can tell you about it."),
    tf("q3", "customers", "the main goal of an early customer conversation is to sell your product.", false, "Early conversations are for learning, not selling."),
    q("q4", "customers", "When should you write your notes?", ["A month later", "Straight after the conversation", "Only if the person liked the idea", "Never"], 1, "Exact words fade quickly, so write them down at once."),
    q("q5", "validation", "In the lost-and-found example, what did the team learn?", ["The app would be a huge hit", "Students already solved the problem quickly, so it wasn't painful enough", "They needed more money", "They should copy a competitor"], 1, "Learning that a problem is already solved saves wasted effort."),
  ],
});

export const M3_RUNNING = lesson({
  slug: "running-interviews",
  title: "Running an Interview",
  min: 11,
  hook: "You've written good questions. Now you're face to face with a stranger, your mind goes blank, and you start pitching your idea. How do you keep the conversation useful?",
  points: [
    "Start by explaining you're learning about a problem, not selling anything. Ask permission before taking notes.",
    "Keep it short: 10 to 15 minutes, five or six questions, mostly about their past behaviour.",
    "Follow up on interesting answers with \"Tell me more\" or \"Why was that?\" The best information often comes from the second answer.",
    "Stay quiet after asking. Silence gives people time to remember real details.",
    "End by asking: \"Who else should I talk to?\" Each interview can lead you to the next.",
    "If you're under 18, interview people you can meet safely, such as classmates, teachers or family friends, and tell a parent or teacher who you're meeting.",
  ],
  example: "Interviewing a shopkeeper about stock problems, a student asked, \"When did you last run out of something?\" then \"What happened next?\" The second answer revealed he lost regular customers to the next shop, which was the real pain.",
  task: "Run one practice interview with a classmate using your five questions. Afterwards, write down one thing you learned that surprised you.",
  quiz: [
    q("q1", "customers", "How should you open an interview?", ["Pitch your product straight away", "Say you're learning about a problem and ask permission to take notes", "Ask them to sign up", "Ask about their salary"], 1, "Setting the purpose makes people relaxed and honest."),
    q("q2", "customers", "What is a good follow-up when someone gives an interesting answer?", ["\"Great, next question\"", "\"Tell me more about that\"", "\"Would you buy my app?\"", "\"You're wrong\""], 1, "Follow-ups dig into the real reasons behind behaviour."),
    tf("q3", "customers", "staying silent for a few seconds after a question can help people remember real details.", true, "A short pause gives people time to think."),
    q("q4", "customers", "What useful question can end every interview?", ["\"Do you love my idea?\"", "\"Who else should I talk to?\"", "\"Can you invest?\"", "\"What is your password?\""], 1, "Referrals help you find your next interviews."),
    q("q5", "customers", "About how long should an early interview take?", ["2 minutes", "10 to 15 minutes", "3 hours", "A whole day"], 1, "Short interviews respect people's time and keep you focused."),
  ],
});

export const M3_PATTERNS = lesson({
  slug: "finding-patterns",
  title: "Finding Patterns in Your Interviews",
  min: 10,
  hook: "Five interviews, five pages of notes, and everyone said something different. Where is the signal?",
  points: [
    "Put every interview in one table: who they are, how often the problem happens, what they do now, and what it costs them.",
    "Highlight anything that comes up in three or more interviews. Repeated pain is a pattern; a single comment is an anecdote.",
    "Watch for strong emotion, such as \"I hate this\" or \"this happens every single week\". Strong feelings point to real pain.",
    "Notice what people already pay for or spend time on. That shows what they value.",
    "Be honest when patterns don't support your idea. Changing direction early is a win, not a failure.",
  ],
  example: "After eight interviews about tuition, six parents mentioned not knowing how their child was doing between tests. Only one mentioned fees. The pattern was about progress updates, not price.",
  task: "Make a table of your interviews with columns for frequency, current workaround and cost. Write the top two patterns you see.",
  quiz: [
    q("q1", "customers", "How many interviews should mention something before you call it a pattern?", ["Just one", "About three or more", "Exactly 100", "None"], 1, "Repetition across several people separates patterns from one-off comments."),
    q("q2", "customers", "What do strong emotional words like \"I hate this\" suggest?", ["The person is rude", "The pain may be real and serious", "You should stop the interview", "Nothing useful"], 1, "Strong feelings often point to real pain worth solving."),
    tf("q3", "validation", "if your interviews don't support your idea, you should ignore them and build anyway.", false, "Evidence that contradicts your idea is valuable. Changing direction early saves time."),
    q("q4", "customers", "In the tuition example, what was the real pattern?", ["Fees were too high", "Parents wanted progress updates between tests", "Children wanted more homework", "Teachers wanted apps"], 1, "Six of eight parents raised progress updates."),
    q("q5", "customers", "Which table columns help you compare interviews?", ["Favourite colour and pet's name", "Frequency, current workaround and cost of the problem", "Phone model and shoe size", "Height and weight"], 1, "These columns capture how painful and common the problem is."),
  ],
});

export const M3_PERSONA = lesson({
  slug: "customer-persona",
  title: "Building a Customer Persona",
  min: 9,
  hook: "Your team keeps arguing about features because each of you pictures a different user. A persona puts one real-feeling person in front of everyone.",
  points: [
    "A persona is a short profile of your typical customer, built from your interview patterns, not imagination.",
    "Include: a name and short description, their goal, their main frustration, what they do today, and where you can reach them.",
    "Keep it to one page. Add a real quote from an interview if you can.",
    "Use the persona to decide: \"Would Meera actually use this feature?\"",
    "Update it as you learn more. A persona is a working tool, not a poster.",
  ],
  example: "\"Meera, 16, class 11, lives in a hostel. Coaching ends at 9 pm, after the mess closes. Spends ₹60-₹100 on snacks most nights. Frustration: 'I'm hungry and there's nothing healthy left.' Reach: hostel WhatsApp group.\"",
  task: "Write a one-page persona for your main customer using only what you learned in interviews. Include one real quote.",
  quiz: [
    q("q1", "customers", "What should a persona be built from?", ["Imagination", "Patterns from real interviews", "A movie character", "Your own preferences only"], 1, "A persona summarises real evidence."),
    q("q2", "customers", "Which TWO belong in a persona?", ["Their main frustration", "Your favourite cricket team", "Where you can reach them", "The colour of your logo"], [0, 2], "Frustrations and channels guide product and marketing decisions."),
    tf("q3", "customers", "a persona should never change once it's written.", false, "Update it as you learn more."),
    q("q4", "customers", "How does a persona help a team?", ["It replaces talking to customers", "It helps decide whether a feature fits the real customer", "It guarantees sales", "It is needed for registration"], 1, "It keeps decisions focused on one real-feeling customer."),
    q("q5", "customers", "What makes Meera's persona believable?", ["It is very long", "It includes real habits, spending and a quote", "It uses fancy words", "It has a stock photo"], 1, "Specific behaviour and real words make a persona useful."),
  ],
});

// ---------------- Module 4: Solution and idea validation ----------------

export const M4_VALUE_PROP = lesson({
  slug: "value-proposition",
  title: "Writing a Clear Value Proposition",
  min: 9,
  hook: "If you can't explain why someone should choose you in one sentence, a customer scrolling past won't work it out for you.",
  points: [
    "A value proposition says who it's for, what problem it solves, and why it's better than what they do now.",
    "A simple template: \"For [customer] who [problem], [product] [benefit], unlike [current alternative].\"",
    "Use your customer's words from interviews, not technical words.",
    "Focus on one main benefit. Listing ten features makes the message weaker.",
    "Test it: show it to five people with the problem and ask them to explain it back. If they can't, rewrite it.",
  ],
  example: "\"For hostel students who are hungry after 9 pm, LateBite delivers healthy snack boxes from a nearby kitchen in 20 minutes, unlike the vending machine's chips.\"",
  task: "Write your value proposition with the template. Show it to three people and note how they explained it back.",
  quiz: [
    q("q1", "business-model", "What three parts does a value proposition need?", ["Founder, office, logo", "Customer, problem solved, and why it's better than the alternative", "Price, discount, offer", "Investors, valuation, profit"], 1, "It must say who, what problem, and why you over the alternative."),
    q("q2", "business-model", "Whose words should it use?", ["Technical jargon", "The customer's own words", "Investor language", "Legal language"], 1, "Customer words make the message instantly understood."),
    tf("q3", "business-model", "a stronger value proposition lists as many features as possible.", false, "One clear main benefit beats a long list."),
    q("q4", "validation", "How can you test a value proposition?", ["Ask friends if they like it", "Ask people with the problem to explain it back", "Count its words", "Print it on T-shirts"], 1, "If people can explain it back, it is clear."),
    q("q5", "business-model", "In the LateBite example, what is the current alternative?", ["A restaurant", "The vending machine's chips", "The mess", "Cooking at home"], 1, "It names the vending machine as what students use today."),
  ],
});

export const M4_COMPETITORS = lesson({
  slug: "competitor-research",
  title: "Researching Competitors",
  min: 10,
  hook: "\"We have no competitors\" is the scariest sentence in a pitch. It usually means the founder didn't look, or nobody wants the thing.",
  points: [
    "Competitors include direct ones (similar products), indirect ones (different products solving the same problem) and the customer's current workaround.",
    "Make a table: competitor, price, what customers like, what customers complain about, and who it's for.",
    "Read real reviews on app stores, Google Maps and social media. Complaints show gaps you could fill.",
    "Don't copy. Find the one thing you can do clearly better for your specific customer.",
    "Competitors are evidence that people care about the problem.",
  ],
  example: "A student planning a used-textbook marketplace listed: big online stores (new books, costly), local second-hand shops (cheap but hard to find specific editions) and class WhatsApp groups (free but messy). The gap: finding the exact edition fast within the same city.",
  task: "Build a competitor table with at least four rows, including the customer's current workaround. Mark the gap you could fill.",
  quiz: [
    q("q1", "validation", "Which of these counts as competition?", ["Only companies with the same app", "Direct rivals, indirect alternatives and the current workaround", "Only foreign companies", "Nothing, if your idea is new"], 1, "Anything customers use instead of you is competition."),
    q("q2", "validation", "Where can you find honest information about what customers dislike?", ["The competitor's advertisements", "Real reviews and complaints", "Your imagination", "Their logo"], 1, "Reviews show real frustrations and gaps."),
    tf("q3", "validation", "saying \"we have no competitors\" impresses investors.", false, "It usually signals the founder hasn't researched, or that there's no demand."),
    q("q4", "business-model", "What should you aim for after studying competitors?", ["Copy the biggest one", "Do one thing clearly better for your customer", "Lower your price to zero", "Give up"], 1, "A clear, specific advantage matters more than copying."),
    q("q5", "validation", "In the textbook example, what gap was found?", ["Cheaper new books", "Finding an exact edition quickly in the same city", "Free delivery worldwide", "Book printing"], 1, "Each alternative failed on fast, exact-edition, local search."),
  ],
});

export const M4_CHEAP_TESTS = lesson({
  slug: "cheap-ways-to-test",
  title: "Cheap Ways to Test an Idea",
  min: 10,
  hook: "Before spending three months building an app, what if you could find out in three days whether anyone wants it?",
  points: [
    "Test the riskiest guess first, usually \"Will people use or pay for this?\"",
    "A smoke test: a simple poster, form or landing page describing the product with a \"Sign up\" button. Count real sign-ups.",
    "A concierge test: deliver the service by hand to a few customers, for example taking orders on WhatsApp and delivering yourself.",
    "A Wizard of Oz test: it looks automatic to the customer, but you do the work behind the scenes.",
    "Decide your success number before you start, such as \"20 sign-ups from 200 visitors\", so you can't fool yourself afterwards.",
  ],
  example: "To test a notes-sharing service, a student posted a Google Form in three class groups: \"Get topper-quality chemistry notes for ₹49.\" 31 of about 150 students filled it in within two days, beating the target of 15.",
  task: "Design one cheap test for your idea. Write the riskiest guess, the test, and the success number you'll accept.",
  quiz: [
    q("q1", "validation", "Which guess should you usually test first?", ["The logo colour", "Whether people will use or pay for it", "The office location", "The app's font"], 1, "Demand is usually the biggest risk."),
    q("q2", "validation", "What is a concierge test?", ["Hiring a hotel worker", "Delivering the service by hand to a few customers", "Building the full app first", "Asking investors for advice"], 1, "Doing it manually tests demand before automating."),
    tf("q3", "validation", "you should set your success number before running the test.", true, "Deciding beforehand stops you from explaining away weak results."),
    q("q4", "mvp", "In a Wizard of Oz test, what does the customer see?", ["An obviously manual process", "Something that looks automatic, while you do the work", "Nothing at all", "A finished company"], 1, "The front looks real while the founder does the work behind it."),
    q("q5", "validation", "Did the notes test pass?", ["No, only 31 people saw it", "Yes, 31 sign-ups beat the target of 15", "No, forms don't count", "It can't be judged"], 1, "The result beat the target that was set in advance."),
  ],
});

export const M4_PRESELL = lesson({
  slug: "pre-selling",
  title: "Pre-selling: The Strongest Signal",
  min: 9,
  hook: "Fifty people said \"I'd buy it.\" Three paid when you asked. Which number tells the truth?",
  points: [
    "Pre-selling means asking people to pay, or pay a small deposit, before the product is fully ready.",
    "Money is the strongest proof of demand. A sign-up is good; a payment is much better.",
    "Be honest about what they're buying and when they'll get it. Offer a full refund if you can't deliver.",
    "Keep amounts small and records clear. If you're under 18, involve a parent or teacher in collecting and holding any money.",
    "If nobody pays, that's valuable information: change the offer, the price or the customer, and test again.",
  ],
  example: "A class 12 team pre-sold 40 custom farewell T-shirts with a ₹100 deposit each, collected through their class teacher, before ordering from a printer. They knew the exact quantity and avoided leftover stock.",
  task: "Write a short, honest pre-sale offer for your product: what the buyer gets, when, the price or deposit, and your refund promise.",
  quiz: [
    q("q1", "validation", "What is the strongest signal of demand?", ["A like on a post", "Someone saying \"cool idea\"", "Someone paying or leaving a deposit", "A follower"], 2, "Payment shows real commitment."),
    q("q2", "legal", "What must a pre-sale offer always be?", ["Secret", "Honest about what, when and refunds", "As expensive as possible", "Only for friends"], 1, "Honesty protects customers and your reputation."),
    tf("q3", "validation", "if nobody pre-pays, the test failed and taught you nothing.", false, "It tells you to change the offer, price or customer."),
    q("q4", "finance", "Why did the T-shirt team pre-sell before ordering?", ["To pay a tax", "To know the exact quantity and avoid leftover stock", "To get famous", "Because printers require it"], 1, "Pre-orders removed the risk of unsold stock."),
    q("q5", "legal", "If you're under 18 and collecting deposits, what should you do?", ["Keep cash in your bag", "Involve a parent or teacher and keep clear records", "Ask for large amounts", "Avoid writing anything down"], 1, "An adult and clear records keep everyone safe."),
  ],
});

// ---------------- Module 5: Building the MVP ----------------

export const M5_WHAT_MVP = lesson({
  slug: "what-an-mvp-is",
  title: "What an MVP Is (and Isn't)",
  min: 12,
  video: "1hHMwLxN6EM",
  hook: "Your list has 25 features. A minimum viable product has as few as possible. Which ones survive?",
  points: [
    "An MVP (minimum viable product) is the simplest version that lets real customers get the main benefit, so you can learn from them.",
    "It is not a bad or broken product. It does one job well enough that people will use it.",
    "Cut every feature that isn't needed for the main benefit. Logins, profiles and settings can usually wait.",
    "Set a short deadline, such as two to four weeks. Waiting for perfection is the most common way MVPs die.",
    "The goal is learning: what do people actually use, and what do they ask for next?",
  ],
  example: "The first version of a canteen pre-order idea was a Google Form plus a printed list for the canteen at 11 am. No app, no payments. Two weeks later the team knew which items sold and at what times.",
  task: "List every feature you've imagined. Cross out everything not needed for the main benefit. Write what's left: that's your MVP.",
  quiz: [
    q("q1", "mvp", "What is an MVP?", ["The final, perfect product", "The simplest version that delivers the main benefit so you can learn", "A broken prototype", "A business plan"], 1, "It's the smallest useful version that lets you learn."),
    q("q2", "mvp", "Which feature can usually wait in an MVP?", ["The main benefit", "User profiles and settings", "A way for customers to get value", "Feedback from users"], 1, "Extras like profiles rarely matter at first."),
    tf("q3", "mvp", "an MVP should be delayed until every feature is perfect.", false, "Speed to learning matters more than polish."),
    q("q4", "mvp", "What is the main goal of an MVP?", ["Winning design awards", "Learning what real customers use and want", "Raising a big round", "Hiring a team"], 1, "MVPs exist to learn."),
    q("q5", "mvp", "What was the canteen team's MVP?", ["A full mobile app", "A Google Form and a printed list", "A robot", "A website with payments"], 1, "Simple tools tested demand in two weeks."),
  ],
});

export const M5_NO_CODE = lesson({
  slug: "no-code-tools",
  title: "No-code Tools for Your First Version",
  min: 10,
  hook: "You don't need to code to launch. Many first versions are built from forms, spreadsheets and simple website builders.",
  points: [
    "Forms (Google Forms, Tally) collect sign-ups, orders and feedback.",
    "Spreadsheets (Google Sheets) work as a simple database for orders, stock or users.",
    "Website builders (Google Sites, Carrd) make a one-page site without code.",
    "No-code app builders (Glide, Softr) turn a spreadsheet into a simple app.",
    "Check each tool's age rules and privacy settings. Many tools need users to be 13 or older, and some need a parent's account. Collect only the data you truly need.",
  ],
  example: "A tutoring-match MVP used a Google Form for students, another for tutors, and a Google Sheet to match them by subject and area, all set up in an afternoon.",
  task: "Pick the no-code tools you'd use for your MVP and write what each one does in your setup.",
  quiz: [
    q("q1", "mvp", "Which tool is best for collecting sign-ups quickly?", ["A form tool such as Google Forms or Tally", "A video editor", "A calculator", "A music app"], 0, "Forms are built for collecting responses."),
    q("q2", "mvp", "What can a spreadsheet act as in an MVP?", ["A simple database", "A payment bank", "A legal contract", "A phone"], 0, "Sheets can store and organise records."),
    tf("q3", "mvp", "you must learn to code before launching anything.", false, "No-code tools let you launch and learn first."),
    q("q4", "legal", "What should you check before using a tool, especially if you're under 18?", ["Only its colour scheme", "Its age rules and privacy settings", "Its stock price", "Nothing"], 1, "Age limits and privacy protect you and your users."),
    q("q5", "mvp", "How was the tutoring-match MVP built?", ["A custom app", "Two forms and a sheet", "A call centre", "Paid ads"], 1, "Simple tools were enough to match people."),
  ],
});

export const M5_LANDING = lesson({
  slug: "landing-page",
  title: "Building a Landing Page",
  min: 11,
  hook: "A landing page is a single web page with one job: get a visitor to take one action.",
  points: [
    "The headline states the main benefit in your customer's words.",
    "Add two or three short points explaining how it works, plus a picture or mock-up.",
    "Have one clear button: \"Join the waitlist\", \"Pre-order\" or \"Book a trial\".",
    "Share it where your customers already are, and count visitors and sign-ups. Sign-ups ÷ visitors is your conversion rate.",
    "Never promise what you can't deliver, and don't collect more personal data than you need.",
  ],
  example: "A plant-care idea's page said: \"Your hostel plant, alive all term. We water it while you're away.\" One button: \"Reserve for ₹149 a month.\" 120 visitors gave 14 reservations, a 12% conversion rate.",
  task: "Write the text for your landing page: headline, three points and one button. Build it on a free website builder if you can.",
  quiz: [
    q("q1", "marketing", "How many main actions should a landing page ask for?", ["One", "Five", "Ten", "As many as possible"], 0, "One clear action works best."),
    q("q2", "marketing", "What should the headline say?", ["The founder's name", "The main benefit in the customer's words", "The company's registration number", "A joke"], 1, "Visitors decide in seconds based on the benefit."),
    q("q3", "marketing", "120 visitors and 14 sign-ups is a conversion rate of about:", ["1%", "12%", "50%", "120%"], 1, "14 ÷ 120 ≈ 0.12, or 12%."),
    tf("q4", "legal", "a landing page can promise features you haven't planned, to get more sign-ups.", false, "Misleading promises break trust and can break the law."),
    q("q5", "marketing", "Where should you share the page?", ["Nowhere", "Where your customers already spend time", "Only with investors", "Only on a billboard"], 1, "Go where your customers are."),
  ],
});

export const M5_PROTOTYPES = lesson({
  slug: "prototypes-and-mockups",
  title: "Prototypes and Mock-ups",
  min: 9,
  hook: "Before writing code, you can show people a picture of the app and watch where they tap. It costs a sheet of paper.",
  points: [
    "A mock-up shows how something looks. A prototype lets people try how it works.",
    "Paper prototypes are hand-drawn screens you swap as the user \"taps\". They're fast and cheap.",
    "Clickable prototypes (for example in Figma or Canva) link screens together so it feels like an app.",
    "Ask people to do one task, like \"order a snack\", and watch silently. Note where they get stuck.",
    "Change the prototype and test again. Several quick rounds beat one perfect design.",
  ],
  example: "Testing a paper prototype of a bus-pass app, five of six students looked for the pass on the home screen, not under \"Profile\". The team moved it before writing any code.",
  task: "Sketch three screens of your product on paper. Ask two people to complete one task while you watch, and write what confused them.",
  quiz: [
    q("q1", "mvp", "What's the difference between a mock-up and a prototype?", ["None", "A mock-up shows the look; a prototype lets people try how it works", "A prototype is always code", "A mock-up is a video"], 1, "Prototypes are interactive."),
    q("q2", "mvp", "Why use a paper prototype?", ["It looks professional", "It's fast and cheap to test and change", "Investors require paper", "It replaces customers"], 1, "Paper lets you learn in minutes."),
    tf("q3", "mvp", "while someone tests your prototype, you should explain every button.", false, "Watch silently so you see where people really get stuck."),
    q("q4", "mvp", "What did the bus-pass test reveal?", ["Students wanted games", "The pass should be on the home screen", "Paper doesn't work", "The app was perfect"], 1, "Most users looked for it on the home screen."),
    q("q5", "mvp", "What's better than one perfect design?", ["No design", "Several quick rounds of testing and changing", "Asking only the founder", "Copying a famous app"], 1, "Fast iterations improve the product."),
  ],
});

export const M5_FEEDBACK = lesson({
  slug: "getting-first-feedback",
  title: "Getting Your First Feedback",
  min: 9,
  hook: "Your MVP is live. Ten people used it. Now what do you ask, and what do you do with the answers?",
  points: [
    "Watch behaviour first: did people come back, finish the task, or tell a friend? Actions beat opinions.",
    "Ask open questions: \"What was hardest?\" and \"What did you expect to happen?\"",
    "A powerful question: \"How would you feel if you could no longer use this?\" Many \"very disappointed\" answers are a strong sign.",
    "Sort feedback into bugs to fix now, requests that many people make, and one-off wishes.",
    "Thank people and tell them what you changed. Early users who feel heard often become your best promoters.",
  ],
  example: "After a week, a homework-reminder bot had 40 users but only 9 came back. Interviews showed reminders arrived too late in the evening. Moving them to 5 pm lifted weekly returns to 22.",
  task: "Write five feedback questions for your MVP users, including the \"how would you feel\" question. Plan how you'll sort the answers.",
  quiz: [
    q("q1", "mvp", "Which is the stronger evidence?", ["People saying they like it", "People coming back and using it again", "A compliment from a teacher", "Your own opinion"], 1, "Repeat use shows real value."),
    q("q2", "mvp", "Which question helps measure how much people need your product?", ["\"Do you like the colours?\"", "\"How would you feel if you could no longer use this?\"", "\"Is it good?\"", "\"Will you invest?\""], 1, "It reveals how much people would miss it."),
    tf("q3", "mvp", "every feature request should be built immediately.", false, "Sort requests; build what many people need."),
    q("q4", "mvp", "What fixed the reminder bot's problem?", ["More features", "Sending reminders earlier, at 5 pm", "A new logo", "Paid ads"], 1, "Timing was the real issue."),
    q("q5", "marketing", "Why tell early users what you changed?", ["It's required by law", "People who feel heard often become promoters", "It wastes time", "To sell them more"], 1, "Closing the loop builds loyalty."),
  ],
});

// ---------------- Module 6: Business model ----------------

export const M6_LEAN_CANVAS = lesson({
  slug: "lean-canvas",
  title: "The Lean Canvas",
  min: 12,
  hook: "A 40-page business plan takes weeks and is out of date in days. A Lean Canvas fits your whole business on one page.",
  points: [
    "The Lean Canvas has nine boxes: problem, customer segments, unique value proposition, solution, channels, revenue streams, cost structure, key metrics and unfair advantage.",
    "Fill it in the order problem → customers → value proposition → solution, because problems and customers come first.",
    "Write short phrases, not paragraphs. It should take about 20 minutes.",
    "Mark each box as \"tested\" or \"guess\". Your next experiments should test the riskiest guesses.",
    "\"Unfair advantage\" is something hard to copy or buy, such as special access or expertise. It's fine to leave it blank at first.",
  ],
  example: "LateBite's canvas: Problem: no healthy food after 9 pm in hostels. Customers: hostel students with late coaching. Channels: hostel WhatsApp groups. Revenue: ₹70 snack box. Costs: ingredients, packaging, delivery helper. Key metric: boxes sold per night.",
  task: "Fill in a Lean Canvas for your startup on one page. Mark each box as tested or guess.",
  quiz: [
    q("q1", "business-model", "Why use a Lean Canvas instead of a long plan?", ["It looks nicer", "It fits the whole business on one page and is quick to update", "Banks require it", "It replaces customers"], 1, "It is fast to make and change."),
    q("q2", "business-model", "Which box should you fill first?", ["Revenue streams", "Problem", "Unfair advantage", "Key metrics"], 1, "Start with the problem and customers."),
    tf("q3", "business-model", "you should leave \"unfair advantage\" blank rather than invent one.", true, "Honesty beats a made-up advantage. Many early startups don't have one yet."),
    q("q4", "validation", "Why mark boxes as tested or guess?", ["For decoration", "To choose which guesses to test next", "To impress judges", "It's required by law"], 1, "It shows where your biggest risks are."),
    q("q5", "business-model", "What is LateBite's key metric?", ["Instagram likes", "Boxes sold per night", "Number of founders", "Office size"], 1, "It measures the core activity."),
  ],
});

export const M6_HOW_MONEY = lesson({
  slug: "how-startups-make-money",
  title: "How Startups Make Money",
  min: 11,
  video: "oWZbWzAyHAE",
  hook: "Two apps both have one lakh users. One earns ₹50 lakh a year; the other earns nothing. The difference is the revenue model.",
  points: [
    "Common models: selling a product, subscriptions (pay every month), commission (a share of each sale, as marketplaces take), advertising, and freemium (free basic version, paid extras).",
    "Pick the model that fits how your customer already likes to pay.",
    "Advertising usually needs a very large audience before it earns much, so it's hard for a new startup.",
    "Know who pays and who uses. In some models, such as many marketplaces, they're different people.",
    "A good model earns money each time the customer gets value.",
  ],
  example: "Amul is a cooperative: farmers own it and share in its earnings, which is a very different model from a company owned by investors. Food-delivery apps earn a commission from restaurants plus delivery fees from customers.",
  task: "List two revenue models that could work for your startup. For each, write who pays, how much, and how often.",
  quiz: [
    q("q1", "business-model", "What is a subscription model?", ["Paying once forever", "Paying regularly, such as every month", "Never paying", "Paying only with ads"], 1, "Customers pay at regular intervals."),
    q("q2", "business-model", "How does a marketplace usually earn?", ["A commission on each sale", "Government grants only", "Selling user passwords", "Nothing"], 0, "Marketplaces take a share of transactions."),
    tf("q3", "business-model", "advertising is usually the easiest way for a new startup with few users to earn.", false, "Ads need a large audience to earn much."),
    q("q4", "business-model", "In a freemium model, who pays?", ["Everyone", "Users who want paid extras", "Only investors", "No one"], 1, "Basic is free; extras are paid."),
    q("q5", "business-model", "What makes Amul's model different from a typical company?", ["It has no customers", "It's a cooperative owned by its farmer members", "It only sells online", "It's owned by one person"], 1, "Members own the cooperative."),
  ],
});

export const M6_PRICING = lesson({
  slug: "pricing-your-product",
  title: "Pricing Your Product",
  min: 10,
  hook: "Many young founders price too low because it feels safer. Too low can quietly kill a business.",
  points: [
    "Three ways to think about price: cost-plus (cost plus a margin), competitor-based (near what alternatives charge) and value-based (what the benefit is worth to the customer).",
    "Your price must at least cover the cost of each unit, or every sale loses money.",
    "Value-based pricing often earns more: if you save someone ₹500 a month, ₹99 feels cheap.",
    "Test prices with real offers. Try two prices with different groups and compare how many buy.",
    "It's easier to give a discount later than to raise a price people are used to.",
  ],
  example: "A student selling handmade bookmarks first priced them at ₹10, below their ₹12 cost. After switching to a set of three for ₹60 and pitching them as gifts, they earned a profit on every sale and sold more.",
  task: "Work out the cost of one unit of your product. Suggest a price using each of the three methods, then choose one and explain why.",
  quiz: [
    q("q1", "finance", "What is cost-plus pricing?", ["Price = cost + a margin", "Price = whatever a competitor charges", "Price = zero", "Price = investor's choice"], 0, "You add a margin on top of cost."),
    q("q2", "finance", "If one unit costs ₹12 and you sell it for ₹10, what happens?", ["You make ₹2 profit", "You lose ₹2 on every sale", "You break even", "Nothing"], 1, "Each sale loses ₹2."),
    q("q3", "business-model", "Value-based pricing means pricing by:", ["Your costs only", "What the benefit is worth to the customer", "Random choice", "The founder's age"], 1, "It links price to the value delivered."),
    tf("q4", "finance", "it is usually easier to give a discount later than to raise a low price.", true, "People resist price rises more than they welcome discounts."),
    q("q5", "validation", "How can you test a price?", ["Ask friends what they'd pay", "Make real offers at two prices to similar groups and compare sales", "Guess", "Copy the most expensive competitor"], 1, "Real buying behaviour shows how price affects sales."),
  ],
});

export const M6_COSTS = lesson({
  slug: "fixed-and-variable-costs",
  title: "Costs: Fixed vs Variable",
  min: 9,
  hook: "Rent is the same whether you sell 1 box or 1,000. Ingredients aren't. Knowing which is which tells you how sales change profit.",
  points: [
    "Fixed costs stay the same each month whatever you sell: rent, salaries, subscriptions.",
    "Variable costs go up with each sale: ingredients, packaging, delivery, payment fees.",
    "Total cost = fixed costs + (variable cost per unit × units sold).",
    "Keep fixed costs low early. They have to be paid even in a bad month.",
    "Track costs in a simple sheet from day one, with every rupee and its receipt.",
  ],
  example: "LateBite: fixed cost ₹3,000 a month (a shared kitchen slot and a phone plan). Variable cost ₹45 a box (food ₹35, box ₹6, delivery ₹4). Selling 200 boxes: total cost = 3,000 + 45 × 200 = ₹12,000.",
  task: "List every cost for your startup and mark each as fixed or variable. Work out your total cost if you sell 100 units in a month.",
  quiz: [
    q("q1", "finance", "Which is a fixed cost?", ["Ingredients for each box", "Monthly rent", "Packaging per order", "Delivery per order"], 1, "Rent doesn't change with sales."),
    q("q2", "finance", "Which is a variable cost?", ["A yearly software subscription", "Packaging for each order", "Office rent", "A fixed salary"], 1, "It rises with each order."),
    q("q3", "finance", "Fixed costs ₹3,000; variable ₹45 a unit; 200 units sold. Total cost?", ["₹3,045", "₹9,000", "₹12,000", "₹90,000"], 2, "3,000 + 45 × 200 = ₹12,000."),
    tf("q4", "finance", "early startups should try to keep fixed costs low.", true, "Fixed costs must be paid even when sales are slow."),
    q("q5", "finance", "What's the best habit for tracking costs?", ["Remembering roughly", "Recording every rupee in a sheet with receipts", "Checking once a year", "Letting customers track them"], 1, "Accurate records prevent surprises."),
  ],
});

export const M6_UNIT_ECONOMICS = lesson({
  slug: "unit-economics",
  title: "Unit Economics",
  min: 11,
  hook: "Some startups grow fast and still go bust, because they lose money on every customer. Unit economics stops that.",
  points: [
    "Unit economics means the money made or lost on one unit: one order, one customer or one subscription.",
    "Contribution margin = price − variable cost per unit. It must be positive.",
    "Customer acquisition cost (CAC) is what you spend to win one customer, such as on ads or free samples.",
    "Customer lifetime value (LTV) is the total margin a customer brings while they stay with you.",
    "A healthy business earns much more from a customer over time than it costs to win them, so LTV should be well above CAC.",
  ],
  example: "LateBite sells a ₹70 box with a ₹45 variable cost: margin ₹25. Free trial boxes cost ₹150 per new customer (CAC). A typical customer buys 12 boxes, so LTV = 12 × ₹25 = ₹300, twice the CAC.",
  task: "Calculate your contribution margin per unit. Estimate your CAC and LTV, and say whether the numbers work.",
  quiz: [
    q("q1", "finance", "Contribution margin per unit is:", ["Price + variable cost", "Price − variable cost", "Fixed cost ÷ price", "Number of customers"], 1, "It's what each sale contributes after variable costs."),
    q("q2", "finance", "What is CAC?", ["The cost to win one customer", "The company's address", "A tax", "The founder's salary"], 0, "Customer acquisition cost."),
    q("q3", "finance", "Margin ₹25 a box, and a customer buys 12 boxes. LTV?", ["₹37", "₹120", "₹300", "₹840"], 2, "12 × ₹25 = ₹300."),
    tf("q4", "finance", "a startup can lose money on every sale and fix it later just by growing bigger.", false, "If each unit loses money, more sales mean bigger losses."),
    q("q5", "finance", "Which is a healthy sign?", ["LTV well above CAC", "CAC higher than LTV", "Negative margin", "No idea of costs"], 0, "Customers should bring in more than they cost to win."),
  ],
});

// ---------------- Module 7: Marketing and first customers ----------------

export const M7_WHO_FIRST = lesson({
  slug: "who-to-sell-to-first",
  title: "Who to Sell to First",
  min: 11,
  video: "hyYCn_kAngI",
  hook: "Your first ten customers won't come from an ad. They come from you, one conversation at a time.",
  points: [
    "Early adopters are people who feel the problem most and are happy to try something new. Start with them.",
    "Your interview list is your first sales list. Go back to the people who had the strongest pain.",
    "Do things that don't scale: deliver personally, set people up yourself, message each user. Paul Graham's essay \"Do Things That Don't Scale\" explains why.",
    "Pick one channel where your early adopters already gather, such as a hostel group or a local market, and win there first.",
    "Ten happy users who tell friends beat a thousand who signed up and left.",
  ],
  example: "The founders of a campus laundry pickup service handled the first 30 orders themselves: knocking on hostel doors, collecting bags and returning them folded. Those 30 students brought in the next 100.",
  task: "Write the names or descriptions of your first 10 potential customers and how you'll personally reach each one this week.",
  quiz: [
    q("q1", "marketing", "Who are early adopters?", ["People who never try new things", "People who feel the problem most and like trying new solutions", "Investors", "Competitors"], 1, "They're the most motivated first users."),
    q("q2", "marketing", "Where should your first sales list come from?", ["A purchased phone list", "The people you interviewed who had the strongest pain", "Random strangers", "Celebrities"], 1, "You already know they have the problem."),
    tf("q3", "marketing", "doing things that don't scale, like delivering personally, is a waste of time early on.", false, "Hands-on work wins early customers and teaches you a lot."),
    q("q4", "marketing", "How many channels should you focus on first?", ["Every social network", "One where your early adopters already gather", "None", "Only TV"], 1, "Focus wins one channel before adding more."),
    q("q5", "marketing", "How did the laundry service grow from 30 to 130 users?", ["Expensive ads", "Happy early users told others", "A celebrity post", "Free laptops"], 1, "Word of mouth from satisfied users."),
  ],
});

export const M7_SOCIAL = lesson({
  slug: "social-media-basics",
  title: "Social Media Basics",
  min: 9,
  hook: "Posting every day to 40 followers feels like shouting into a well. Social media works when it's built around your customer, not your product.",
  points: [
    "Choose the platform your customers actually use, such as Instagram, WhatsApp, YouTube or LinkedIn.",
    "Post content that helps or interests your customer: tips, behind-the-scenes, customer stories. Don't just post ads.",
    "WhatsApp Business offers a catalogue, quick replies and labels, which work well for small local businesses.",
    "Measure what matters: messages, clicks and orders, not only likes.",
    "Stay safe online: don't share your home address or school details publicly, keep personal and business accounts separate, and follow each platform's age rules.",
  ],
  example: "A student baking brownies posted short videos of the baking process and customer reactions on Instagram, with a \"DM to order\" note. Orders came mostly through DMs and the WhatsApp Business catalogue.",
  task: "Pick one platform for your startup. Plan five posts that help or interest your customer, and decide what you'll measure.",
  quiz: [
    q("q1", "marketing", "How should you choose a platform?", ["Whatever is most popular worldwide", "Where your customers actually spend time", "Whatever the founder likes", "All of them at once"], 1, "Go where your customers are."),
    q("q2", "marketing", "Which post is most likely to build an audience?", ["Ad after ad", "Helpful tips and real customer stories", "Random memes", "Long lists of features"], 1, "Useful, human content earns attention."),
    q("q3", "marketing", "Which number matters most for a small business?", ["Likes only", "Messages, clicks and orders", "Number of hashtags", "Number of posts"], 1, "Actions that lead to sales matter most."),
    tf("q4", "legal", "it's fine to post your home address on a public business account so customers can find you.", false, "Protect your privacy, especially if you're under 18."),
    q("q5", "marketing", "Which WhatsApp Business feature helps show products?", ["Catalogue", "Status emojis", "Dark mode", "Stickers"], 0, "The catalogue lists products with prices."),
  ],
});

export const M7_WORD_OF_MOUTH = lesson({
  slug: "content-and-word-of-mouth",
  title: "Content and Word of Mouth",
  min: 9,
  hook: "The cheapest marketing in India is still a friend saying, \"Try this, it's good.\" How do you earn that sentence?",
  points: [
    "Word of mouth starts with a product people genuinely love. No campaign rescues a product people don't want.",
    "Make sharing easy: a simple link, a referral code, or a small thank-you for bringing a friend.",
    "Create moments worth talking about, such as a handwritten note, fast delivery or a surprise extra.",
    "Collect real testimonials, with permission, and use people's own words.",
    "Never post fake reviews or buy followers. It misleads customers and platforms remove them.",
  ],
  example: "boAt grew as a brand partly through social media and buzz around affordable, stylish audio products, building a community before it was well known. Your version can be much smaller: a class or a colony.",
  task: "Design a simple referral idea for your startup: what the referrer gets, what the friend gets, and how it's tracked.",
  quiz: [
    q("q1", "marketing", "What does word of mouth depend on most?", ["A big ad budget", "A product people genuinely love", "Fake reviews", "A long name"], 1, "Love for the product drives recommendations."),
    q("q2", "marketing", "Which makes sharing easy?", ["A referral link or code", "A complicated form", "Hiding contact details", "No website"], 0, "Simple referral mechanisms make sharing effortless."),
    tf("q3", "legal", "posting fake reviews is an acceptable way to get started.", false, "Fake reviews mislead customers and are removed by platforms."),
    q("q4", "marketing", "How should you use testimonials?", ["Make them up", "Use real ones with permission, in the customer's words", "Copy a competitor's", "Never use them"], 1, "Real testimonials build trust."),
    q("q5", "marketing", "Which creates a moment worth talking about?", ["Late delivery", "A handwritten thank-you note", "Ignoring messages", "Hidden charges"], 1, "Small surprises get people talking."),
  ],
});

export const M7_SALES_TALK = lesson({
  slug: "sales-conversations",
  title: "Sales Conversations",
  min: 10,
  hook: "Selling isn't about being pushy. Good selling is helping someone decide whether your product solves their problem.",
  points: [
    "Start with their problem, not your product: \"You mentioned you miss dinner on coaching days. Is that still happening?\"",
    "Show how your product fixes that specific problem. Skip features that don't matter to them.",
    "Handle objections honestly. If price is the worry, explain the value or offer a smaller first order.",
    "Ask for the decision clearly: \"Would you like to try it this week?\"",
    "If they say no, ask why and thank them. A clear no teaches you something.",
  ],
  example: "Selling a printing service to a school club, a student asked about their last event's posters, learned they'd been late and blurry, and offered a same-day sample print. The club placed an order for the next event.",
  task: "Write a short sales script for your product: an opening question, how you'll connect the product to their problem, one objection and your answer, and how you'll ask for the decision.",
  quiz: [
    q("q1", "marketing", "How should a sales conversation start?", ["With every feature", "With the customer's problem", "With the price", "With your life story"], 1, "Start where the customer is."),
    q("q2", "marketing", "What's a good way to handle a price objection?", ["Ignore it", "Explain the value or offer a smaller first order", "Pressure them", "End the talk angrily"], 1, "Address concerns honestly."),
    tf("q3", "marketing", "you should never directly ask for a decision.", false, "A clear ask helps the customer decide."),
    q("q4", "marketing", "What should you do after a \"no\"?", ["Argue", "Ask why and thank them", "Block them", "Lie about the product"], 1, "A clear no is useful feedback."),
    q("q5", "marketing", "What persuaded the school club?", ["A discount coupon", "A same-day sample that fixed their real problem", "A famous friend", "A long brochure"], 1, "The offer matched their exact pain."),
  ],
});

export const M7_MEASURE = lesson({
  slug: "measuring-what-works",
  title: "Measuring What Works",
  min: 10,
  hook: "You tried posters, Instagram and a WhatsApp message. You got 25 customers. Which one brought them?",
  points: [
    "Track each channel separately: give each a different link, code or question, such as \"How did you hear about us?\"",
    "Use a simple funnel: people reached → interested (clicked or asked) → bought → bought again.",
    "Calculate the cost per customer for each channel, including your time.",
    "Double down on what works and stop what doesn't. Decide using numbers, not feelings.",
    "Review your numbers weekly in a simple sheet.",
  ],
  example: "A tiffin startup found its posters cost ₹600 and brought 3 customers (₹200 each), while a message in a residents' WhatsApp group cost nothing and brought 11. It moved its effort to resident groups.",
  task: "Set up a sheet that tracks each marketing channel: reach, interested, bought and cost. Fill in one week of data.",
  quiz: [
    q("q1", "marketing", "How can you tell which channel brought a customer?", ["Guess", "Use different links or codes, or ask how they heard about you", "Count likes", "Ask investors"], 1, "Tracking each channel separately shows what works."),
    q("q2", "marketing", "What is the right order of a simple funnel?", ["Bought → reached → interested", "Reached → interested → bought → bought again", "Interested → reached → bought", "Bought again → reached"], 1, "People move from awareness to purchase to repeat."),
    q("q3", "finance", "Posters cost ₹600 and brought 3 customers. Cost per customer?", ["₹3", "₹60", "₹200", "₹1,800"], 2, "600 ÷ 3 = ₹200."),
    tf("q4", "marketing", "you should keep spending on a channel that doesn't bring customers because it feels popular.", false, "Use numbers, not feelings."),
    q("q5", "marketing", "How often should you review marketing numbers early on?", ["Never", "Weekly", "Once every five years", "Only when you're bored"], 1, "Weekly reviews let you adjust quickly."),
  ],
});

// ---------------- Module 8: Money and finance ----------------

export const M8_REVENUE_PROFIT_CASH = lesson({
  slug: "revenue-profit-cash-flow",
  title: "Revenue, Profit and Cash Flow",
  min: 11,
  hook: "A shop had a record month of sales, then couldn't pay its supplier. How can a business that's selling well run out of money?",
  points: [
    "Revenue is all the money from sales before costs.",
    "Profit is revenue minus all costs. You can have high revenue and still make a loss.",
    "Cash flow is the timing of money coming in and going out. If customers pay late but suppliers must be paid now, you can run out of cash while being profitable on paper.",
    "Keep a cash buffer and track when money actually arrives, not just when you make a sale.",
    "Many small businesses fail from running out of cash, not from a lack of sales.",
  ],
  example: "A student printing business took a ₹20,000 school order to be paid after the event, but had to pay the printer ₹14,000 upfront. It was profitable on paper, but it needed the cash first, so it asked for a 50% advance.",
  task: "For your startup, list when you'll pay each cost and when customers will pay you. Spot any month where cash could run short.",
  quiz: [
    q("q1", "finance", "What is revenue?", ["Money left after costs", "All money from sales before costs", "Money in the bank", "Loans"], 1, "Revenue is total sales income."),
    q("q2", "finance", "Profit is:", ["Revenue minus all costs", "Revenue plus costs", "Cash in hand", "Number of customers"], 0, "Profit = revenue − costs."),
    tf("q3", "finance", "a profitable business can still run out of cash.", true, "Timing gaps between paying and getting paid can drain cash."),
    q("q4", "finance", "How did the printing business fix its cash gap?", ["Took a big loan", "Asked the school for a 50% advance", "Cancelled the order", "Paid the printer late"], 1, "An advance brought cash in earlier."),
    q("q5", "finance", "What is a common reason small businesses fail?", ["Too many customers", "Running out of cash", "Having a logo", "Paying taxes on time"], 1, "Cash shortages are a frequent cause of failure."),
  ],
});

export const M8_BUDGET = lesson({
  slug: "simple-budget",
  title: "Making a Simple Budget",
  min: 10,
  video: "6DTK9yDP6p0",
  hook: "A budget is a plan for your money and a set of goals to measure against, so you can tell early when things go off track.",
  points: [
    "List expected income month by month, based on realistic sales, not hopes.",
    "List expected costs, both fixed and variable.",
    "Income minus costs each month shows your surplus or shortfall.",
    "Each month, compare actual numbers with the budget and write down why they differ.",
    "Set a few key numbers to track (key performance indicators, or KPIs), such as weekly orders or repeat customers, and set targets for them.",
  ],
  example: "A 12-month budget for a stationery stall planned higher sales in exam months and lower in holidays, so the founder saved surplus from exam months to cover the slow ones.",
  task: "Build a 12-month budget in Google Sheets: income, fixed costs, variable costs and monthly surplus. Choose two KPIs with targets.",
  quiz: [
    q("q1", "finance", "What should budget income be based on?", ["Hopes", "Realistic sales estimates", "A competitor's revenue", "Random numbers"], 1, "Realistic estimates make a budget useful."),
    q("q2", "finance", "Why compare actual numbers with the budget each month?", ["To spot problems early and learn why numbers differ", "It's not useful", "To impress friends", "To change the past"], 0, "Comparisons show where plans and reality differ."),
    q("q3", "finance", "What is a KPI?", ["A type of tax", "A key number you track against a target", "A bank account", "A logo design"], 1, "Key performance indicators measure progress."),
    tf("q4", "finance", "a seasonal business can use surplus from busy months to cover slow ones.", true, "Planning across the year smooths cash flow."),
    q("q5", "finance", "Monthly surplus is:", ["Income + costs", "Income − costs", "Costs − income", "Income × costs"], 1, "Surplus = income minus costs."),
  ],
});

export const M8_BREAK_EVEN = lesson({
  slug: "break-even-point",
  title: "The Break-even Point",
  min: 10,
  hook: "How many snack boxes must LateBite sell each month before it stops losing money? That number is the break-even point.",
  points: [
    "Break-even is where total revenue equals total cost: no profit, no loss.",
    "Break-even units = fixed costs ÷ contribution margin per unit.",
    "Every unit sold beyond break-even adds profit equal to the contribution margin.",
    "If the break-even number is much higher than you can realistically sell, change the price, the costs or the plan.",
    "Recalculate whenever prices or costs change.",
  ],
  example: "LateBite: fixed costs ₹3,000 a month; margin ₹25 a box. Break-even = 3,000 ÷ 25 = 120 boxes a month, about 4 a night. Selling 200 boxes gives a profit of (200 − 120) × ₹25 = ₹2,000.",
  task: "Calculate your break-even point in units per month. Is it realistic? If not, write two changes that would lower it.",
  quiz: [
    q("q1", "finance", "At break-even, profit is:", ["Very high", "Zero", "Negative", "Unknown"], 1, "Revenue exactly covers costs."),
    q("q2", "finance", "Fixed costs ₹3,000; margin ₹25 per unit. Break-even units?", ["25", "75", "120", "3,025"], 2, "3,000 ÷ 25 = 120."),
    q("q3", "finance", "Selling 200 units with break-even at 120 and margin ₹25 gives profit of:", ["₹2,000", "₹3,000", "₹5,000", "₹200"], 0, "(200 − 120) × 25 = ₹2,000."),
    q("q4", "finance", "Which TWO changes lower the break-even point?", ["Cutting fixed costs", "Raising fixed costs", "Raising the margin per unit", "Selling at a loss"], [0, 2], "Lower fixed costs or a higher margin reduce break-even."),
    tf("q5", "finance", "you only need to calculate break-even once.", false, "Recalculate when prices or costs change."),
  ],
});

export const M8_BOOTSTRAP = lesson({
  slug: "bootstrapping-vs-funding",
  title: "Bootstrapping vs Funding",
  min: 10,
  hook: "Zerodha grew into one of India's largest brokers without outside investors. Other companies raised crores early. Which is right for you?",
  points: [
    "Bootstrapping means growing with your own money and your customers' money. You keep full control and ownership.",
    "Outside funding (from angel investors or venture capital) gives money to grow faster, in exchange for part of the company and expectations of fast growth.",
    "Grants and competition prizes are non-dilutive: you don't give away ownership.",
    "Most good businesses don't need venture capital. Raise money when it clearly speeds up something that already works.",
    "For school students, the best funding is usually customers, small grants and competition prizes, handled with a parent or teacher.",
  ],
  example: "Zerodha's founders have spoken publicly about building the company without outside investment, funded by its own profits. Many other startups raised venture capital to grow faster. Both paths can work, with different trade-offs.",
  task: "Decide whether your startup should bootstrap or seek funding in the next year. Write three reasons for your choice.",
  quiz: [
    q("q1", "finance", "What is bootstrapping?", ["Raising money from many investors", "Growing with your own and your customers' money", "Taking a large loan", "Selling the company"], 1, "Self-funded growth."),
    q("q2", "finance", "What do venture investors usually get in return?", ["Nothing", "Part ownership of the company", "A free product", "A government licence"], 1, "They receive equity."),
    q("q3", "finance", "Which funding is non-dilutive?", ["Selling shares", "A grant or competition prize", "Venture capital", "Angel investment"], 1, "Grants don't take ownership."),
    tf("q4", "finance", "every good business needs venture capital.", false, "Many great businesses never raise it."),
    q("q5", "finance", "What's Zerodha's example used to show?", ["That funding is required", "That a company can grow large without outside investors", "That bootstrapping always fails", "That ads are free"], 1, "It grew from its own profits."),
  ],
});

export const M8_FOUNDER_MONEY = lesson({
  slug: "managing-money-as-a-founder",
  title: "Managing Money as a Founder",
  min: 9,
  hook: "Mixing your pocket money with business money feels easy, until you can't tell whether the business is making or losing money.",
  points: [
    "Keep business money separate from personal money, even if it's just a separate notebook, envelope or a bank account a parent helps you manage.",
    "Record every transaction with the date, amount, purpose and a receipt or screenshot.",
    "Never mix customer advances with spending money. Keep them until you deliver.",
    "Check your numbers weekly: cash in hand, what you're owed and what you owe.",
    "Under 18? A parent or guardian should be involved in any bank account, payments and contracts.",
  ],
  example: "Two students running a T-shirt business kept a shared Google Sheet and a dedicated envelope for deposits. When a printer delayed, they could refund every customer exactly because the deposits were untouched.",
  task: "Set up your money records: a sheet with date, item, money in, money out and balance. Record everything for one week.",
  quiz: [
    q("q1", "finance", "Why separate business and personal money?", ["It looks professional only", "So you can see whether the business makes or loses money", "It's never useful", "To avoid customers"], 1, "Separation makes the numbers clear."),
    q("q2", "finance", "What should every transaction record include?", ["Only the amount", "Date, amount, purpose and proof", "The customer's password", "Nothing"], 1, "Complete records prevent confusion."),
    tf("q3", "finance", "it's fine to spend customer deposits before delivering their order.", false, "Keep advances safe until you deliver."),
    q("q4", "legal", "If you're under 18, who should be involved in bank accounts and contracts?", ["No one", "A parent or guardian", "A stranger online", "A competitor"], 1, "Minors need an adult involved."),
    q("q5", "finance", "Why could the T-shirt team refund everyone?", ["They borrowed money", "They kept deposits untouched and recorded", "The printer paid them", "They didn't need to"], 1, "Good records and separate deposits made refunds simple."),
  ],
});

// ---------------- Module 9: Team and leadership ----------------

export const M9_COFOUNDERS = lesson({
  slug: "co-founders",
  title: "Choosing Co-founders",
  min: 12,
  video: "A4SLDQDXdp0",
  hook: "Fights between co-founders end many startups. Choosing who to build with matters as much as the idea.",
  points: [
    "Look for shared values and commitment, plus skills that complement yours. A builder and a seller often work well together.",
    "Work on a small project together before committing. You learn how someone handles deadlines and stress.",
    "Agree early on roles, time commitment and how decisions are made.",
    "Talk openly about ownership and what happens if someone leaves. Write it down.",
    "Friends can be great co-founders, but treat the business seriously so the friendship survives disagreements.",
  ],
  example: "Two classmates built a quiz app: one coded, one ran the school outreach. They wrote a one-page agreement on roles and weekly hours before the hackathon, which saved arguments when exams arrived.",
  task: "Describe your ideal co-founder: skills, values and time commitment. Write three questions you'd ask before teaming up.",
  quiz: [
    q("q1", "team", "What makes a strong co-founder match?", ["Identical skills", "Shared values and complementary skills", "Being the most popular", "Living far apart"], 1, "Common values plus different strengths."),
    q("q2", "team", "Why do a small project together first?", ["To waste time", "To see how you work together under deadlines", "To make money fast", "Because it's required"], 1, "It reveals working styles early."),
    tf("q3", "team", "co-founders should avoid discussing ownership until the company is successful.", false, "Agree early, in writing."),
    q("q4", "team", "What did the quiz-app pair write down?", ["A marketing plan", "Roles and weekly hours", "A loan agreement", "Nothing"], 1, "Clear roles and time commitment prevented arguments."),
    q("q5", "team", "Which TWO should co-founders agree early?", ["Roles", "Favourite food", "How decisions are made", "Phone brands"], [0, 2], "Roles and decision-making avoid confusion later."),
  ],
});

export const M9_ROLES = lesson({
  slug: "roles-in-a-startup",
  title: "Roles in a Startup",
  min: 9,
  hook: "In a three-person startup, who builds, who sells and who counts the money? If the answer is \"everyone\", nobody owns anything.",
  points: [
    "Early startups usually need three kinds of work: building the product, getting customers, and running operations and money.",
    "Give each area one owner who is responsible for it, even if others help.",
    "Write roles down with clear outcomes, such as \"Riya owns weekly sales: 20 orders\".",
    "Roles change as the startup grows, so review them every month or two.",
    "Fill skill gaps by learning, getting a mentor's help or adding a teammate.",
  ],
  example: "A three-person event-photography startup: Aman owned shoots and editing, Sara owned bookings and customers, and Dev owned the money sheet and equipment. Each reported one number every Sunday.",
  task: "Write the roles for your dream team of three: each person's area, main responsibilities and one measurable outcome.",
  quiz: [
    q("q1", "team", "What three kinds of work do early startups usually need?", ["Cooking, cleaning, driving", "Building, getting customers, and operations and money", "Only coding", "Only marketing"], 1, "These cover the core of an early startup."),
    q("q2", "team", "Why give each area one owner?", ["So someone is clearly responsible", "To create arguments", "Because it's the law", "To reduce work"], 0, "Clear ownership gets things done."),
    tf("q3", "team", "roles should be fixed forever once decided.", false, "Review roles as the startup grows."),
    q("q4", "team", "Which is a well-written role outcome?", ["\"Do marketing\"", "\"Owns weekly sales: 20 orders\"", "\"Be helpful\"", "\"Work hard\""], 1, "Specific, measurable outcomes are clear."),
    q("q5", "team", "In the photography startup, what did each person do on Sundays?", ["Took a holiday", "Reported one number", "Changed roles", "Hired someone"], 1, "Weekly numbers kept everyone accountable."),
  ],
});

export const M9_COMMUNICATION = lesson({
  slug: "team-communication",
  title: "Communication in a Team",
  min: 9,
  hook: "Two teammates both thought the other was ordering the stock. The event day came and there was nothing to sell.",
  points: [
    "Hold a short weekly meeting: what we did, what's next and what's blocking us.",
    "Write decisions and owners down in one shared place, such as a group note or a sheet.",
    "Be specific: \"I'll order 50 boxes by Thursday 6 pm\" beats \"I'll handle the stock\".",
    "Give feedback about the work, not the person, and say thank you often.",
    "Keep the team chat for work, and be respectful. Never share teammates' personal details.",
  ],
  example: "After the stock mix-up, the team started a 15-minute Sunday call and a shared task list with an owner and a deadline for each task. They never missed an order again.",
  task: "Create a shared task list for your team with columns for task, owner and deadline. Plan your first weekly meeting agenda.",
  quiz: [
    q("q1", "team", "What does a good weekly meeting cover?", ["Gossip", "What we did, what's next and what's blocking us", "Only celebrations", "Nothing"], 1, "Short structured updates keep everyone aligned."),
    q("q2", "team", "Which commitment is clearest?", ["\"I'll handle the stock\"", "\"I'll order 50 boxes by Thursday 6 pm\"", "\"Someone should order\"", "\"Maybe later\""], 1, "Specific owner, amount and deadline."),
    tf("q3", "team", "feedback should focus on the work, not on attacking the person.", true, "That keeps feedback useful and respectful."),
    q("q4", "team", "Where should decisions be recorded?", ["Nowhere", "In one shared place", "Only in someone's memory", "On a social media post"], 1, "One shared record avoids confusion."),
    q("q5", "team", "What fixed the stock mix-up?", ["Hiring more people", "A weekly call and a task list with owners and deadlines", "A bigger shop", "Ignoring it"], 1, "Clear owners and deadlines."),
  ],
});

export const M9_DECISIONS = lesson({
  slug: "making-decisions",
  title: "Making Decisions as a Team",
  min: 9,
  hook: "Should you spend ₹2,000 on posters or a stall at the school fair? Three founders, three opinions. How do you decide without a fight?",
  points: [
    "Agree in advance how decisions are made: by the role owner, by majority, or together for big ones.",
    "Use data from tests and customers where you can, not just opinions.",
    "Separate reversible decisions (try it and change later) from hard-to-reverse ones (big spending, legal promises). Move fast on the first kind and carefully on the second.",
    "Once decided, everyone commits, even those who disagreed. Then review the result.",
    "Write down the decision, the reason and when you'll check whether it worked.",
  ],
  example: "The team ran a cheap test: ₹300 of posters for one week versus asking the fair organiser about stall footfall. Posters brought 2 orders; past stalls had sold 40 or more. They chose the stall.",
  task: "Write your team's decision rules: who decides what, and how you'll handle big decisions and disagreements.",
  quiz: [
    q("q1", "team", "When should a team agree on how decisions are made?", ["After a fight", "In advance", "Never", "Only when investors ask"], 1, "Agreed rules prevent arguments."),
    q("q2", "team", "What should guide decisions where possible?", ["The loudest voice", "Data from tests and customers", "A coin toss", "Social media trends"], 1, "Evidence beats opinion."),
    tf("q3", "team", "hard-to-reverse decisions, like big spending, deserve more care than easy-to-reverse ones.", true, "Move fast on reversible choices and carefully on the rest."),
    q("q4", "team", "What should teammates do after a decision they disagreed with?", ["Quietly work against it", "Commit to it, then review the result", "Leave the team", "Ignore it"], 1, "Commit and review."),
    q("q5", "team", "Why did the team choose the stall?", ["It was cheaper", "Past stalls sold far more than the poster test", "The founder liked stalls", "Posters were banned"], 1, "Data showed the stall reached more buyers."),
  ],
});

export const M9_CONFLICT = lesson({
  slug: "handling-conflict",
  title: "Handling Conflict",
  min: 9,
  hook: "Disagreement isn't failure. Teams that never disagree often aren't saying what they think. The skill is disagreeing well.",
  points: [
    "Talk early, privately and calmly. Small issues grow when ignored.",
    "Describe the problem, not the person: \"The orders were late twice\" rather than \"You're careless\".",
    "Listen to understand, and repeat back what you heard before replying.",
    "Look for a solution together, write it down and set a date to check it.",
    "If you're stuck, ask a neutral mentor or teacher to help. If anyone feels unsafe or bullied, tell a trusted adult straight away.",
  ],
  example: "One co-founder felt she did most of the work. Instead of quitting, she raised it calmly, showing the task list. The team rebalanced roles and agreed weekly hours, and the startup kept going.",
  task: "Write how your team will handle disagreements: a step-by-step process and who you'd ask for help if you're stuck.",
  quiz: [
    q("q1", "team", "When should you raise a problem with a teammate?", ["Never", "Early, privately and calmly", "In front of everyone", "After quitting"], 1, "Early, calm conversations prevent bigger conflicts."),
    q("q2", "team", "Which statement describes the problem, not the person?", ["\"You're lazy\"", "\"The orders were late twice this week\"", "\"You always mess up\"", "\"You don't care\""], 1, "Focus on facts and behaviour."),
    tf("q3", "team", "repeating back what you heard helps the other person feel understood.", true, "It shows you listened."),
    q("q4", "team", "Who can help if the team is stuck?", ["A neutral mentor or teacher", "A competitor", "An anonymous stranger", "Nobody"], 0, "A neutral person can help find a fair solution."),
    q("q5", "team", "How was the workload conflict resolved?", ["Someone quit", "Roles were rebalanced and weekly hours agreed", "It was ignored", "They hired a lawyer"], 1, "A calm talk with evidence led to a fair fix."),
  ],
});

// ---------------- Module 10: Legal and registration (India) - overview ----------------

export const M10_BUSINESS_TYPES = lesson({
  slug: "business-types-in-india",
  title: "Business Types in India",
  min: 12,
  hook: "Sole proprietorship, partnership, LLP, private limited, OPC: what do these words mean, and when do they matter for you?",
  points: [
    "Sole proprietorship: one owner, the simplest to start, but the owner is personally responsible for all the business's debts.",
    "Partnership firm: two or more partners sharing profits under a partnership deed. Partners are generally personally responsible for debts.",
    "LLP (limited liability partnership): partners' liability is limited, and it is registered with the Ministry of Corporate Affairs (MCA).",
    "Private limited company: a separate legal entity with shareholders and directors, registered with the MCA. It is the usual choice for startups that plan to raise investment. A one person company (OPC) is a company with a single member.",
    "As a school student, you usually don't need to register anything to test an idea. Registration matters once you're earning regularly, signing contracts or raising money, and an adult must be involved because minors can't enter binding contracts in India.",
  ],
  example: "A student selling handmade candles at fairs can start without registration, with a parent helping. If it grows into a regular brand with online sales and a co-founder, the family might talk to a chartered accountant about a partnership or LLP.",
  task: "Write which business type might suit your startup in two years' time, and why. List two questions you'd ask a chartered accountant (CA) or company secretary (CS).",
  quiz: [
    q("q1", "legal", "Which business type is simplest to start, with one owner?", ["Private limited company", "Sole proprietorship", "LLP", "Public company"], 1, "One owner and few formalities."),
    q("q2", "legal", "What does \"limited liability\" mean?", ["Unlimited personal responsibility for debts", "Owners' personal risk is limited, usually to what they invested", "No taxes", "No customers"], 1, "Personal assets are better protected."),
    q("q3", "legal", "Which structure do startups often choose when planning to raise investment?", ["Sole proprietorship", "Private limited company", "No structure", "A club"], 1, "Investors usually buy shares in a private limited company."),
    tf("q4", "legal", "a school student must register a company before testing an idea with a few customers.", false, "Testing usually doesn't need registration. An adult should be involved for money and agreements."),
    q("q5", "legal", "Who registers LLPs and companies in India?", ["The Ministry of Corporate Affairs", "The school board", "The police", "A bank"], 0, "Registration is done through the MCA."),
  ],
});

export const M10_STARTUP_INDIA = lesson({
  slug: "startup-india-and-dpiit",
  title: "Startup India and DPIIT Recognition",
  min: 10,
  hook: "The government runs a programme that gives recognised startups tax, IP and compliance benefits. What is it, and who qualifies?",
  points: [
    "Startup India is the government's programme for startups, run by DPIIT (the Department for Promotion of Industry and Internal Trade). The portal is startupindia.gov.in.",
    "Under the notification of 4 February 2026, an entity can be recognised as a startup for up to 10 years from incorporation if its turnover has not exceeded ₹200 crore in any year (earlier the limit was ₹100 crore). Deep-tech startups get up to 20 years and ₹300 crore.",
    "It must be a registered entity, such as a private limited company, a registered partnership firm or an LLP, working on innovation or improving products, services or processes.",
    "Recognition can bring benefits such as cheaper patent and trademark fees, easier compliance, and access to schemes and mentorship like the MAARG mentorship portal.",
    "These rules change. Always confirm the current criteria on startupindia.gov.in before applying.",
  ],
  example: "A college team that registers as a private limited company to build a farm-sensor product could apply for DPIIT recognition online, then use the reduced trademark fee and apply to government-supported incubators.",
  task: "Visit startupindia.gov.in and note three benefits of DPIIT recognition that could matter to your startup later.",
  quiz: [
    q("q1", "legal", "Which department runs startup recognition in India?", ["DPIIT", "RBI", "CBSE", "ISRO"], 0, "The Department for Promotion of Industry and Internal Trade."),
    q("q2", "legal", "Under the February 2026 rules, the turnover limit for a regular recognised startup is:", ["₹10 lakh", "₹25 crore", "₹200 crore", "No limit"], 2, "It was raised from ₹100 crore to ₹200 crore."),
    q("q3", "legal", "For how long after incorporation can a regular entity be recognised as a startup?", ["1 year", "Up to 10 years", "50 years", "Forever"], 1, "Up to 10 years from incorporation (20 for deep tech)."),
    tf("q4", "legal", "an idea alone, without a registered entity, can get DPIIT recognition.", false, "Recognition is for registered entities such as companies, LLPs or registered partnerships."),
    q("q5", "legal", "Where should you confirm the current rules?", ["A random blog", "startupindia.gov.in", "A friend's message", "A news headline from years ago"], 1, "The official portal has the latest criteria."),
  ],
});

export const M10_GST_UDYAM = lesson({
  slug: "gst-and-udyam-basics",
  title: "GST and Udyam Basics",
  min: 11,
  hook: "Two registrations come up again and again for small businesses: GST and Udyam. What are they, and when do they apply?",
  points: [
    "GST (goods and services tax) is charged on most sales. Registration becomes compulsory once yearly turnover crosses a threshold: in most states ₹40 lakh for businesses selling only goods and ₹20 lakh for services, with lower limits in some special category states.",
    "Some businesses must register whatever their turnover, for example many that sell across states or through e-commerce platforms. Check the rules for your case on the GST portal (gst.gov.in) or with a CA.",
    "Udyam registration is the free, online registration for micro, small and medium enterprises (MSMEs) at udyamregistration.gov.in.",
    "From 1 April 2025, a micro enterprise has up to ₹2.5 crore of investment in plant and machinery and up to ₹10 crore turnover; small is up to ₹25 crore and ₹100 crore; medium is up to ₹125 crore and ₹500 crore.",
    "Udyam can help with access to some government schemes, priority-sector lending and protection against delayed payments from buyers.",
  ],
  example: "A small online T-shirt brand selling through a marketplace found it needed GST registration early because of marketplace selling rules, even though its turnover was small. Its founders checked with a CA before launching.",
  task: "Based on your plan, estimate your first-year turnover. Note whether you'd likely need GST registration, and which official page you'd check.",
  quiz: [
    q("q1", "legal", "In most states, the GST registration threshold for businesses selling only goods is:", ["₹1 lakh", "₹40 lakh", "₹5 crore", "No threshold"], 1, "₹40 lakh in most states (lower in some)."),
    q("q2", "legal", "And for service providers in most states?", ["₹20 lakh", "₹40 lakh", "₹1 crore", "₹10,000"], 0, "₹20 lakh in most states."),
    q("q3", "legal", "What does Udyam registration cost?", ["₹10,000", "It's free", "₹1 lakh", "It depends on your marks"], 1, "It's free on the official portal."),
    tf("q4", "legal", "some businesses, such as many selling through e-commerce platforms, may need GST registration even below the turnover threshold.", true, "Certain kinds of business must register regardless of turnover."),
    q("q5", "legal", "Under the April 2025 limits, a micro enterprise's turnover is up to:", ["₹10 crore", "₹500 crore", "₹1 lakh", "₹100 crore"], 0, "Micro: investment up to ₹2.5 crore and turnover up to ₹10 crore."),
  ],
});

export const M10_TRADEMARKS = lesson({
  slug: "trademarks-and-ip",
  title: "Trademarks and Intellectual Property",
  min: 10,
  hook: "You love your startup's name and designed a logo. Then you discover another business already registered it. Check before you print a thousand stickers.",
  points: [
    "Intellectual property (IP) includes trademarks (names, logos, slogans), copyright (creative work such as text, art and code), patents (new inventions) and designs (a product's look).",
    "Search the IP India trademark database (ipindia.gov.in) for your name before you invest in it.",
    "In India, a registered trademark lasts 10 years and can be renewed every 10 years.",
    "Individuals, recognised startups and small enterprises pay a lower government fee when filing a trademark application (₹4,500 per class instead of ₹9,000 when filed online).",
    "Respect others' IP too: don't copy logos, images, music or code without permission or a proper licence.",
  ],
  example: "A team naming its snack brand \"CrunchKing\" searched the trademark database and found a similar registered name in the food class, so it chose a different, more distinctive name before printing packaging.",
  task: "Search the IP India trademark database for your startup's name. Note any similar names in your category and whether you should change yours.",
  quiz: [
    q("q1", "legal", "What does a trademark protect?", ["Inventions", "Names, logos and slogans that identify a business", "Land", "Bank balances"], 1, "Trademarks protect brand identifiers."),
    q("q2", "legal", "How long does a registered trademark last in India before renewal?", ["1 year", "10 years", "100 years", "Forever without renewal"], 1, "10 years, renewable."),
    q("q3", "legal", "Where can you search for existing trademarks?", ["IP India's database", "A dictionary", "Your school website", "A social media poll"], 0, "IP India hosts the official trademark search."),
    tf("q4", "legal", "you can use any image you find online in your branding.", false, "Respect copyright and licences."),
    q("q5", "legal", "Which protects a new invention?", ["Trademark", "Patent", "Copyright", "Udyam"], 1, "Patents protect inventions."),
  ],
});

export const M10_CONTRACTS = lesson({
  slug: "contracts-and-founder-agreements",
  title: "Contracts and Founder Agreements",
  min: 10,
  hook: "\"We're best friends, we don't need anything in writing.\" Many startup disputes begin with exactly that sentence.",
  points: [
    "A contract is an agreement the law can enforce. Write down important agreements, even simple ones.",
    "A founder agreement covers roles, time commitment, ownership split, decision-making, what happens if someone leaves, and who owns the work created.",
    "Vesting means co-founders earn their ownership over time, so someone who leaves early doesn't keep a large share.",
    "Under Indian law (the Indian Contract Act, 1872), a minor, someone under 18, can't enter a binding contract. A parent or guardian needs to be involved in any formal agreement.",
    "For real legal documents, ask a qualified lawyer, CA or CS. Templates found online are a starting point, not legal advice.",
  ],
  example: "Three college founders signed a simple agreement: equal shares vesting over four years, one-year cliff, and all code owned by the company. When one left after eight months, there was no dispute over ownership.",
  task: "Draft a one-page, non-binding founder understanding for your team: roles, weekly hours, how decisions are made and what happens if someone leaves. If you're under 18, review it with a parent or teacher.",
  quiz: [
    q("q1", "legal", "What is a contract?", ["A friendly chat", "An agreement the law can enforce", "A social media post", "A rumour"], 1, "Contracts are legally enforceable agreements."),
    q("q2", "legal", "Which belongs in a founder agreement?", ["Ownership split and what happens if someone leaves", "Favourite movies", "Exam marks", "Phone numbers of relatives"], 0, "It covers ownership, roles and exits."),
    q("q3", "legal", "What is vesting?", ["Wearing a vest", "Earning ownership over time", "Selling shares at once", "A tax"], 1, "Ownership builds up over time."),
    tf("q4", "legal", "under Indian law, someone under 18 can sign a fully binding business contract alone.", false, "Minors can't enter binding contracts; an adult must be involved."),
    q("q5", "legal", "Who should you ask before signing real legal documents?", ["A qualified lawyer, CA or CS", "An anonymous forum", "Nobody", "A competitor"], 0, "Qualified professionals give proper advice."),
  ],
});

// ---------------- Module 11: Pitching and fundraising ----------------

export const M11_STORY = lesson({
  slug: "telling-your-story",
  title: "Telling Your Story",
  min: 9,
  hook: "Judges hear dozens of pitches a day. They remember stories, not feature lists.",
  points: [
    "Start with a real person and their problem, ideally someone you met in your interviews.",
    "Show why it matters: how often it happens and what it costs.",
    "Explain your solution simply, then show proof that it works, such as users, sales, tests or quotes.",
    "Share why you're the right team to solve it: what you know or have lived that others don't.",
    "End with a clear ask: what you want from the listener, such as feedback, mentorship, a grant or a pilot.",
  ],
  example: "\"Meera's coaching ends at 9 pm. By then her hostel mess is closed. Last month, 40 students like her bought 600 healthy snack boxes from us. We're asking for ₹50,000 to add a second kitchen.\"",
  task: "Write your startup's story in five sentences: the person, the problem, your solution, your proof and your ask.",
  quiz: [
    q("q1", "pitching", "What do judges remember best?", ["Long feature lists", "Stories about real people and problems", "Font choices", "Technical jargon"], 1, "Stories stick."),
    q("q2", "pitching", "What counts as proof?", ["Your opinion", "Users, sales, test results or real quotes", "A nice logo", "Your marks"], 1, "Evidence makes a pitch believable."),
    tf("q3", "pitching", "a pitch should end with a clear ask.", true, "Tell listeners what you want from them."),
    q("q4", "pitching", "Which opening is strongest?", ["\"Our app has 15 features\"", "\"Meera's coaching ends at 9 pm, after her mess closes\"", "\"We are very passionate\"", "\"Thank you for having us\""], 1, "A specific person and problem draws people in."),
    q("q5", "pitching", "What does the \"why us\" part explain?", ["Your favourite food", "What you know or have lived that makes you right for this problem", "Your family's income", "Nothing"], 1, "It shows founder-problem fit."),
  ],
});

export const M11_DECK = lesson({
  slug: "ten-slide-pitch-deck",
  title: "The 10-Slide Pitch Deck",
  min: 13,
  video: "17XZGUX_9iM",
  hook: "A good deck is short, clear and mostly visual. Ten slides is enough for almost any early startup.",
  points: [
    "A common 10-slide order: 1 Title and one-line description · 2 Problem · 3 Solution · 4 Why now · 5 Market size · 6 Product or demo · 7 Traction (proof) · 8 Business model · 9 Team · 10 The ask.",
    "One idea per slide, with big text and few words. The slides support you; you tell the story.",
    "Use real numbers and say where they came from. Never inflate them.",
    "Make it readable on a phone, because many people will open your deck there.",
    "Practise until you can present it in about 2-3 minutes without reading.",
  ],
  example: "A school team's deck used one photo of students queueing for a closed mess (problem), one screenshot of the order form (solution) and one bar chart of weekly orders (traction).",
  task: "Outline your 10 slides with one sentence each. Build the deck in Canva or Google Slides.",
  quiz: [
    q("q1", "pitching", "How many ideas should each slide carry?", ["One", "Five", "Ten", "As many as fit"], 0, "One idea per slide keeps it clear."),
    q("q2", "pitching", "Which slide shows proof such as users or sales?", ["Title", "Traction", "Team", "Thank you"], 1, "Traction is your evidence."),
    tf("q3", "pitching", "it's acceptable to round numbers up a lot to look more impressive.", false, "Inflated numbers destroy trust."),
    q("q4", "pitching", "Why make a deck readable on a phone?", ["Phones are banned", "Many people open decks on phones", "It's required by law", "It's not important"], 1, "Mobile readability matters."),
    q("q5", "pitching", "What should the last slide be?", ["Your hobbies", "The ask", "A blank page", "Your marks"], 1, "End with what you want."),
  ],
});

export const M11_INVESTORS_GRANTS = lesson({
  slug: "investors-and-grants",
  title: "Types of Investors and Grants",
  min: 12,
  video: "zBUhQPPS9AY",
  hook: "Angel, VC, grant, competition prize, incubator: which kinds of support can a student founder actually get?",
  points: [
    "Angel investors are individuals who invest their own money early, usually in exchange for shares. Venture capital (VC) firms invest larger amounts from funds, expecting fast growth.",
    "Grants and competition prizes don't take ownership. For school students these are the most realistic options, handled with a parent or teacher.",
    "Atal Innovation Mission (AIM) runs programmes for schools, such as the ATL Marathon innovation challenge for Atal Tinkering Lab students and the AI Tinkerpreneur programme with Intel. Check aim.gov.in for current calls.",
    "College founders can use campus E-Cells and incubators. The Startup India Seed Fund Scheme offered grants of up to ₹20 lakh for proof of concept through approved incubators to DPIIT-recognised startups. Its stated period was 2021-25, so check seedfund.startupindia.gov.in to see whether it's accepting applications.",
    "Be careful: genuine competitions and grants don't charge large fees to \"guarantee\" funding. Check organisers on official websites.",
  ],
  example: "A class 10 team built a water-saving sensor in their school's Atal Tinkering Lab and entered it in the ATL Marathon. Even without winning, the feedback from mentors improved their prototype.",
  task: "Find one competition, grant or programme your startup could apply to this year. Note the eligibility, deadline and official link.",
  quiz: [
    q("q1", "finance", "Which funding takes no ownership of your company?", ["Angel investment", "Venture capital", "A grant or competition prize", "Selling shares"], 2, "Grants and prizes are non-dilutive."),
    q("q2", "finance", "Who are angel investors?", ["Government officials", "Individuals investing their own money early", "Banks only", "Customers"], 1, "Angels are individual early investors."),
    q("q3", "finance", "Which programme is aimed at school students with Atal Tinkering Labs?", ["ATL Marathon", "Home loans", "Udyam", "GST"], 0, "AIM's ATL Marathon is for ATL students."),
    tf("q4", "legal", "a genuine grant may ask you to pay a large fee to guarantee you'll get funded.", false, "Guaranteed-funding fees are a warning sign."),
    q("q5", "finance", "The Startup India Seed Fund Scheme gave grants of up to:", ["₹20 lakh", "₹20 crore", "₹2,000", "₹200 crore"], 0, "Up to ₹20 lakh for proof of concept, through approved incubators."),
  ],
});

export const M11_PRACTICE = lesson({
  slug: "pitch-practice",
  title: "Pitch Practice",
  min: 9,
  hook: "The first time you pitch out loud, you'll go over time, forget your best number and rush the ending. That's why you practise.",
  points: [
    "Time yourself. Aim for 2 minutes for a short pitch, with a clear start, middle and ask.",
    "Record yourself on a phone and watch it back. Notice filler words, speed and eye contact.",
    "Pitch to three different people and ask: \"What do you remember?\" and \"What confused you?\"",
    "Prepare for the five most likely questions, such as how you make money, competitors, proof, team and what you'll do with support.",
    "Keep improving the pitch after every round. Small edits add up.",
  ],
  example: "A team recorded five practice runs. The first ran 3 min 40 s with 22 \"umms\". By the fifth, it ran 2 min 05 s, the traction number came earlier, and listeners remembered the ask.",
  task: "Record a 2-minute pitch video. Watch it, list three improvements, and record it again.",
  quiz: [
    q("q1", "pitching", "How long should a short pitch usually be?", ["About 2 minutes", "20 minutes", "10 seconds", "An hour"], 0, "A tight 2-minute pitch is common for competitions."),
    q("q2", "pitching", "Why record yourself?", ["For social media fame", "To spot filler words, speed and eye contact", "It's required", "To skip practising"], 1, "Recordings show what to improve."),
    q("q3", "pitching", "What should you ask practice listeners?", ["\"Was I perfect?\"", "\"What do you remember, and what confused you?\"", "\"Will you invest?\"", "Nothing"], 1, "These questions reveal clarity gaps."),
    tf("q4", "pitching", "you should prepare answers to the most likely questions.", true, "Preparation builds confidence."),
    q("q5", "pitching", "What changed between the first and fifth practice runs?", ["The pitch got longer", "It got shorter and clearer, with fewer filler words", "Nothing", "They stopped practising"], 1, "Repetition improved timing and clarity."),
  ],
});

export const M11_DEMO_DAY = lesson({
  slug: "demo-day",
  title: "Demo Day",
  min: 10,
  hook: "Demo Day is where your work meets an audience: judges, mentors, classmates, maybe customers. How do you make the most of five minutes on stage?",
  points: [
    "Show, don't just tell. A live demo or a short video of real use beats slides about features.",
    "Have a backup: screenshots or a recorded demo in case the internet or projector fails.",
    "Bring your Startup Portfolio: problem statement, interview notes, Lean Canvas, budget and pitch deck.",
    "After you present, collect contacts and feedback, and follow up within two days with a thank-you message.",
    "Celebrate what you learned, whatever the result. Founders improve most from what happens after Demo Day.",
  ],
  example: "At a school innovation fair, a team's live demo failed when the Wi-Fi dropped. They switched to a 40-second screen recording, kept their timing, and a judge later connected them with a local mentor.",
  task: "Plan your Demo Day: what you'll demo, your backup, what you'll bring, and how you'll follow up afterwards.",
  quiz: [
    q("q1", "pitching", "What usually works best on Demo Day?", ["Slides full of text", "A live demo or video of real use", "Reading from a script", "Skipping the demo"], 1, "Showing beats telling."),
    q("q2", "pitching", "Why prepare a backup?", ["In case technology fails", "To make it longer", "Judges require two demos", "It's not useful"], 0, "Wi-Fi and projectors can fail."),
    tf("q3", "pitching", "following up with judges and mentors after Demo Day is a waste of time.", false, "Follow-ups turn contacts into mentors and opportunities."),
    q("q4", "pitching", "What should you bring to show your work?", ["Your Startup Portfolio", "Nothing", "Only a logo", "Your report card"], 0, "Your portfolio shows the work behind the pitch."),
    q("q5", "pitching", "What saved the team whose demo failed?", ["Restarting the projector for ten minutes", "A short screen recording as backup", "Skipping their turn", "Arguing with judges"], 1, "A prepared backup kept the pitch on track."),
  ],
});

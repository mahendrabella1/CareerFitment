/**
 * Startups section content - Phase 1 (per "Startups Section - Complete Build
 * Plan.pdf"): Builder track (class 9-12), Modules 1-4 only. Static content,
 * not DB-driven - matches this project's existing pattern (every other
 * question bank in this app is a static data file, e.g.
 * data/graduates/questions-corrected.json), rather than building the PDF's
 * admin CMS, which is out of scope for this phase.
 *
 * A quiz question's `options` carry no correctness/explanation fields client
 * side - the Lesson page (a Server Component) strips those via
 * stripQuizSecrets() before handing questions to the client QuizPlayer. The
 * grading API route re-reads this file server-side to check answers, the
 * same "never trust the client" discipline new-assessment/score/route.ts
 * already follows.
 */

export type QuestionType = "SINGLE" | "MULTI" | "TRUE_FALSE";

export interface QuizOption {
  id: string; // stable within the question, e.g. "a"
  text: string;
}

export interface QuizQuestion {
  id: string;
  type: QuestionType;
  prompt: string;
  options: QuizOption[];
  correctOptionIds: string[]; // server-only once stripped for the client
  explanation: string;
  skillTag: SkillTag;
}

export type SkillTag =
  | "ideation" | "validation" | "customers" | "mvp" | "business-model"
  | "marketing" | "finance" | "team" | "legal" | "pitching";

export interface Lesson {
  slug: string;
  title: string;
  order: number;
  durationMin: number;
  youtubeId: string | null;
  videoStartSec?: number;
  hook: string;
  contentMd: string; // key ideas, short markdown-ish bullet text
  exampleMd?: string;
  taskPrompt: string;
  passMark: number; // percent
  quiz: QuizQuestion[];
}

export interface Module {
  slug: string;
  title: string;
  order: number;
  missionText: string;
  portfolioItem: string;
  passMark: number; // module test percent
  lessons: Lesson[];
  // Smaller-than-spec seed bank (PDF: 15-of-~30 per module) - mechanism is
  // faithful (random draw, 70% pass, 1hr retry cooldown enforced client/
  // server side), content set is a realistic Phase-1 size.
  moduleTestBank: QuizQuestion[];
  moduleTestDrawCount: number;
}

export interface Track {
  slug: string;
  title: string;
  level: "EXPLORER" | "BUILDER" | "FOUNDER" | "OPERATOR";
  minClass: number | null;
  maxClass: number | null;
  description: string;
  modules: Module[];
}

/** A moduleTestBank draws questions from several lessons, each of which
 *  independently numbers its own quiz "q1".."q5" - reusing those question
 *  objects directly would give a bank with DUPLICATE ids across lessons
 *  (confirmed live: grading "q1" matched 3 different questions from 3
 *  different lessons at once, inflating maxScore and corrupting the score).
 *  This remaps each bank entry to a globally-unique id, scoped by source
 *  lesson, before it ever reaches drawModuleTestQuestions()/grading. */
function bankQ(lessonSlug: string, q: QuizQuestion): QuizQuestion {
  return { ...q, id: `${lessonSlug}-${q.id}` };
}

const m1l1: Lesson = {
  slug: "what-is-a-startup",
  title: "What Is a Startup?",
  order: 1,
  durationMin: 8,
  youtubeId: "8VkGRAWmxp0",
  hook: "Riya's mother runs a tiffin service from home - same food, same customers, every week. Arjun is building an app that matches tiffin cooks across the city with hostel students who've never met them. Both make money. Only one is a startup. Why?",
  contentMd: [
    "A startup is a temporary organisation searching for a repeatable, scalable way to make money - not just any new business.",
    "A small business repeats a known model (a tiffin service, a tuition class). A startup is still figuring out what works, and is built to grow fast once it does.",
    "\"Scalable\" means serving 10x more customers doesn't need 10x more effort - Arjun's app can match thousands of students without hiring thousands of people; Riya's tiffin service genuinely does need more hands for more customers.",
    "Most startups fail not because the founders were lazy, but because they built something nobody needed badly enough to pay for.",
    "You don't need an app or an office to start thinking like a founder - you need a problem worth solving and a willingness to test your assumptions.",
  ].join("\n"),
  exampleMd: "Zerodha started as two brothers trying to fix something broken in their own trading experience - high broker fees - and built a model that scaled to millions of customers without scaling cost the same way. That's the startup pattern: search for the model, then scale it.",
  taskPrompt: "Think of one business you've seen in your own city (a shop, a service, an app). Write 2-3 sentences: is it a startup or a small business, and why?",
  passMark: 60,
  quiz: [
    {
      id: "q1", type: "SINGLE", skillTag: "ideation",
      prompt: "What mainly separates a startup from a small business?",
      options: [
        { id: "a", text: "A startup has a fancier office" },
        { id: "b", text: "A startup is searching for a scalable, repeatable model; a small business repeats a known one" },
        { id: "c", text: "A startup always has outside funding" },
        { id: "d", text: "A startup is always a tech company" },
      ],
      correctOptionIds: ["b"],
      explanation: "Scale and search, not funding or industry, is the real difference. Plenty of startups are bootstrapped, and plenty are not tech.",
    },
    {
      id: "q2", type: "SINGLE", skillTag: "ideation",
      prompt: "Riya's tiffin service and Arjun's tiffin-matching app both serve food-related customers. Why is only Arjun's a startup?",
      options: [
        { id: "a", text: "Riya's food is better" },
        { id: "b", text: "Arjun's app can serve far more customers without needing proportionally more effort" },
        { id: "c", text: "Apps are always startups" },
        { id: "d", text: "Riya doesn't charge money" },
      ],
      correctOptionIds: ["b"],
      explanation: "That's scalability - the core trait that makes something a startup rather than a small, repeating business.",
    },
    {
      id: "q3", type: "TRUE_FALSE", skillTag: "ideation",
      prompt: "True or false: most startups fail because the founders didn't work hard enough.",
      options: [{ id: "true", text: "True" }, { id: "false", text: "False" }],
      correctOptionIds: ["false"],
      explanation: "Most failures trace back to building something the market didn't actually want badly enough to pay for - not effort.",
    },
    {
      id: "q4", type: "SINGLE", skillTag: "business-model",
      prompt: "A bakery opens a second identical branch across town. Is this \"scaling\" in the startup sense?",
      options: [
        { id: "a", text: "Yes, any growth counts as scaling" },
        { id: "b", text: "No - each new branch still needs roughly proportional new staff, ovens and rent" },
        { id: "c", text: "Yes, because it increases revenue" },
        { id: "d", text: "No, because bakeries can never scale" },
      ],
      correctOptionIds: ["b"],
      explanation: "Scaling in the startup sense means growth that doesn't need proportional new resources - a second branch still needs its own staff and ovens, so this is replication, not scaling.",
    },
    {
      id: "q5", type: "SINGLE", skillTag: "ideation",
      prompt: "Which statement best reflects a founder's mindset from this lesson?",
      options: [
        { id: "a", text: "Build the fanciest product possible before showing anyone" },
        { id: "b", text: "A problem worth solving and a willingness to test assumptions matters more than having an app or office" },
        { id: "c", text: "You need significant funding before you can start" },
        { id: "d", text: "Only tech founders count as real founders" },
      ],
      correctOptionIds: ["b"],
      explanation: "The lesson's whole point: mindset and a real problem come first, not resources or credentials.",
    },
  ],
};

const m1l2: Lesson = {
  slug: "learning-from-failure",
  title: "Learning From Failure, Growing a Founder Mindset",
  order: 2,
  durationMin: 9,
  youtubeId: "nx3GuO41Jyg",
  hook: "Before Flipkart worked, Sachin and Binny Bansal's first idea - a price-comparison search engine - went nowhere. Before boAt became a household name, its founders had already tried and shelved other product ideas. Failure wasn't the end of their story; it was market research they didn't pay a consultant for.",
  contentMd: [
    "A growth mindset means believing your abilities and your idea can improve with real feedback - not that you're either \"born a founder\" or not.",
    "A fixed mindset treats a failed idea as proof you shouldn't try again. A growth mindset treats it as data: what did this attempt teach you that you didn't know before?",
    "Founders who recover fastest from a failed idea are the ones who separate \"this specific idea didn't work\" from \"I am not capable of building something that works.\"",
    "Journalling or tracking what you tried and what you learned (even informally) turns a vague sense of failure into a specific, reusable lesson.",
  ].join("\n"),
  exampleMd: "A founder who builds an app nobody downloads, and simply tries a new app idea without asking WHY nobody downloaded it, often repeats the same mistake in a new form. One who asks \"did I talk to the people I was building for before I built it?\" usually catches the real problem.",
  taskPrompt: "Write about one time something you tried (a project, a competition, a plan) didn't go as expected. What's one specific, concrete thing it taught you - not a vague lesson like \"try harder,\" something you'd actually do differently next time?",
  passMark: 60,
  quiz: [
    {
      id: "q1", type: "SINGLE", skillTag: "team",
      prompt: "What does a growth mindset mean in a startup context?",
      options: [
        { id: "a", text: "Only grow the business, never the founder's skills" },
        { id: "b", text: "Believing abilities and ideas can improve through feedback and effort, not that you're fixed as \"a founder\" or not" },
        { id: "c", text: "Always staying positive and ignoring setbacks" },
        { id: "d", text: "Growing revenue every single month without exception" },
      ],
      correctOptionIds: ["b"],
      explanation: "Growth mindset is about how you relate to feedback and setbacks, not a requirement to always be upbeat or always grow revenue.",
    },
    {
      id: "q2", type: "SINGLE", skillTag: "team",
      prompt: "A founder's first product idea fails. Which response best reflects a growth mindset?",
      options: [
        { id: "a", text: "\"I'm clearly not cut out to be a founder\"" },
        { id: "b", text: "\"This specific idea didn't work - what did I learn, and what would I test differently?\"" },
        { id: "c", text: "\"I'll quietly try a totally unrelated new idea without reviewing what happened\"" },
        { id: "d", text: "\"Failure means I should give up on this field\"" },
      ],
      correctOptionIds: ["b"],
      explanation: "This separates the idea's failure from the founder's identity, and turns the setback into something specific and actionable.",
    },
    {
      id: "q3", type: "TRUE_FALSE", skillTag: "team",
      prompt: "True or false: well-known Indian founders' early ideas often failed before their eventual successful product.",
      options: [{ id: "true", text: "True" }, { id: "false", text: "False" }],
      correctOptionIds: ["true"],
      explanation: "Several well-known founders' first attempts went nowhere - the eventual success came after real iteration, not a single perfect first try.",
    },
    {
      id: "q4", type: "SINGLE", skillTag: "team",
      prompt: "Why does tracking what you tried and learned help more than just remembering a general feeling of \"that didn't go well\"?",
      options: [
        { id: "a", text: "It doesn't - memory works just as well" },
        { id: "b", text: "It turns a vague sense of failure into a specific, reusable lesson you can act on next time" },
        { id: "c", text: "It's only useful for a resume" },
        { id: "d", text: "It guarantees your next idea will succeed" },
      ],
      correctOptionIds: ["b"],
      explanation: "Specificity is what makes a lesson usable - \"try harder\" doesn't change your next decision, \"I didn't talk to users before building\" does.",
    },
    {
      id: "q5", type: "SINGLE", skillTag: "ideation",
      prompt: "A founder keeps building new apps that nobody downloads, without changing their process each time. What's most likely missing?",
      options: [
        { id: "a", text: "A bigger marketing budget" },
        { id: "b", text: "Reflection on WHY the previous attempts failed, not just trying something new" },
        { id: "c", text: "A better app name" },
        { id: "d", text: "Nothing - repetition alone eventually works" },
      ],
      correctOptionIds: ["b"],
      explanation: "Without asking why past attempts failed, a founder tends to repeat the same underlying mistake in a new disguise.",
    },
  ],
};

const m1l3: Lesson = {
  slug: "problems-beat-ideas",
  title: "Why Problems Matter More Than Ideas",
  order: 3,
  durationMin: 7,
  youtubeId: "bNpx7gpSqbY",
  hook: "Two friends each want to start something. One starts with \"I want to build an app\" and spends a month picking a name and a logo. The other starts with \"my grandmother can never find a reliable plumber nearby\" and spends a month talking to 20 neighbours about it. Which one is more likely to build something people actually need?",
  contentMd: [
    "An idea is a guess at a solution. A problem is a real, specific pain someone already has - and it's a far more solid place to start.",
    "Falling in love with an idea before confirming the problem is real is one of the most common early-founder mistakes.",
    "A useful founder habit: before asking \"what should I build?\", ask \"what keeps going wrong for people around me, over and over?\"",
    "The best startup ideas often look boring or obvious from the outside - because they're solving a real, specific, already-felt problem, not chasing novelty.",
  ].join("\n"),
  exampleMd: "Amul didn't start from \"let's build a cooperative dairy brand\" as an idea - it started from the real problem of farmers being exploited by middlemen. The idea (a farmer-owned cooperative) came AFTER the problem was deeply understood.",
  taskPrompt: "List 3 problems you genuinely notice around you (at home, school, your neighbourhood) - not solutions, just the problems themselves, in plain language.",
  passMark: 60,
  quiz: [
    {
      id: "q1", type: "SINGLE", skillTag: "ideation",
      prompt: "What's the key difference between an idea and a problem, in the startup sense used here?",
      options: [
        { id: "a", text: "There is no real difference" },
        { id: "b", text: "An idea is a guess at a solution; a problem is a real, confirmed pain someone already experiences" },
        { id: "c", text: "Ideas are always better starting points than problems" },
        { id: "d", text: "Problems only matter for social enterprises" },
      ],
      correctOptionIds: ["b"],
      explanation: "This is the core distinction - a problem is grounded in reality, an idea is still a hypothesis until tested.",
    },
    {
      id: "q2", type: "SINGLE", skillTag: "ideation",
      prompt: "Which approach does this lesson recommend starting with?",
      options: [
        { id: "a", text: "Picking a catchy app name and logo first" },
        { id: "b", text: "Asking \"what keeps going wrong for people around me, over and over?\"" },
        { id: "c", text: "Copying whatever is trending online" },
        { id: "d", text: "Deciding on the business model before anything else" },
      ],
      correctOptionIds: ["b"],
      explanation: "Starting from a repeated, real pain point is the recommended entry point - everything else follows from there.",
    },
    {
      id: "q3", type: "TRUE_FALSE", skillTag: "ideation",
      prompt: "True or false: the best startup ideas usually look exciting and novel from the outside.",
      options: [{ id: "true", text: "True" }, { id: "false", text: "False" }],
      correctOptionIds: ["false"],
      explanation: "They often look boring or obvious - because they solve a real, already-felt problem rather than chasing novelty for its own sake.",
    },
    {
      id: "q4", type: "SINGLE", skillTag: "ideation",
      prompt: "Someone says \"I want to build an app, I just need to figure out what it does.\" What's the risk in this approach, per the lesson?",
      options: [
        { id: "a", text: "There is no risk, this is a normal way to start" },
        { id: "b", text: "Falling in love with the idea of building something before confirming a real problem exists" },
        { id: "c", text: "Apps are never good startup ideas" },
        { id: "d", text: "This approach guarantees success" },
      ],
      correctOptionIds: ["b"],
      explanation: "Starting from \"I want to build an app\" skips the step of confirming a real, specific pain exists - a common early mistake.",
    },
    {
      id: "q5", type: "SINGLE", skillTag: "ideation",
      prompt: "In the Amul example, which came first?",
      options: [
        { id: "a", text: "The cooperative brand idea, then the problem was found later" },
        { id: "b", text: "The real problem of farmers being exploited by middlemen, then the cooperative idea" },
        { id: "c", text: "A marketing campaign, then the product" },
        { id: "d", text: "Outside investor funding, then the business model" },
      ],
      correctOptionIds: ["b"],
      explanation: "The problem (exploitation by middlemen) was understood deeply before the solution (a farmer-owned cooperative) was designed.",
    },
  ],
};

const m2l1: Lesson = {
  slug: "spotting-real-pain-points",
  title: "Spotting Real Pain Points",
  order: 1,
  durationMin: 9,
  youtubeId: "Th8JoIan4dg",
  hook: "\"Students struggle with time management\" sounds like a problem. But ask three more questions - who exactly, how often, how badly - and it either turns into something you could actually build for, or falls apart as too vague to act on.",
  contentMd: [
    "A good problem statement answers three things: WHO has it, HOW OFTEN it happens, and HOW BIG the pain is (time, money or stress lost).",
    "\"People want better food\" is too vague to build anything from. \"Hostel students in my city run out of affordable dinner options after 9pm, 3-4 nights a week\" is specific enough to act on.",
    "A problem you only THINK exists (because it sounds plausible) is not the same as a problem you've CONFIRMED exists by watching or asking real people.",
    "Bigger isn't always better - a smaller, sharply-felt problem for a specific group beats a huge, vague problem nobody feels urgently.",
  ].join("\n"),
  exampleMd: "\"Farmers lose money\" is vague. \"Small vegetable farmers near my town lose 15-20% of produce to spoilage before reaching the local market, every harvest season\" is a real, specific, testable problem statement.",
  taskPrompt: "Take one problem from your list in the previous lesson. Rewrite it answering: who exactly has it, how often, and how big is the pain (in time, money or stress)?",
  passMark: 60,
  quiz: [
    {
      id: "q1", type: "MULTI", skillTag: "validation",
      prompt: "Which THREE things does a good problem statement answer? (select all that apply)",
      options: [
        { id: "a", text: "Who exactly has the problem" },
        { id: "b", text: "How often it happens" },
        { id: "c", text: "What the company's logo should look like" },
        { id: "d", text: "How big the pain is (time, money or stress)" },
      ],
      correctOptionIds: ["a", "b", "d"],
      explanation: "Who, how often, and how big - these three turn a vague feeling into something you can actually test and build for.",
    },
    {
      id: "q2", type: "SINGLE", skillTag: "validation",
      prompt: "Which of these is specific enough to act on?",
      options: [
        { id: "a", text: "\"People want better food\"" },
        { id: "b", text: "\"Hostel students in my city run out of affordable dinner options after 9pm, 3-4 nights a week\"" },
        { id: "c", text: "\"Food is important to everyone\"" },
        { id: "d", text: "\"Someone should fix the food industry\"" },
      ],
      correctOptionIds: ["b"],
      explanation: "It names who, how often, and the specific gap - unlike the vague alternatives.",
    },
    {
      id: "q3", type: "TRUE_FALSE", skillTag: "validation",
      prompt: "True or false: a bigger, broader problem is always a better one to build for than a smaller, specific one.",
      options: [{ id: "true", text: "True" }, { id: "false", text: "False" }],
      correctOptionIds: ["false"],
      explanation: "A smaller problem felt sharply by a specific group often beats a huge, vague problem nobody feels urgently enough to act on.",
    },
    {
      id: "q4", type: "SINGLE", skillTag: "validation",
      prompt: "What's the difference between a problem you \"think\" exists and one you've \"confirmed\"?",
      options: [
        { id: "a", text: "There is no real difference" },
        { id: "b", text: "A confirmed problem has been checked against real people's actual experience, not just assumed to be plausible" },
        { id: "c", text: "Confirmed problems are always bigger" },
        { id: "d", text: "Thought-of problems are always wrong" },
      ],
      correctOptionIds: ["b"],
      explanation: "Plausibility isn't confirmation - only watching or asking real people confirms a problem is genuinely felt.",
    },
    {
      id: "q5", type: "SINGLE", skillTag: "validation",
      prompt: "In the farmer example, what makes the rewritten statement stronger than \"farmers lose money\"?",
      options: [
        { id: "a", text: "It uses bigger words" },
        { id: "b", text: "It specifies who (small vegetable farmers near my town), how much (15-20%), and when (harvest season)" },
        { id: "c", text: "It mentions a bigger number" },
        { id: "d", text: "It is shorter" },
      ],
      correctOptionIds: ["b"],
      explanation: "Specificity on who/how much/when is what makes a problem statement testable and buildable.",
    },
  ],
};

const m2l2: Lesson = {
  slug: "writing-your-problem-statement",
  title: "Picking One Problem and Writing It Down",
  order: 2,
  durationMin: 7,
  youtubeId: null,
  hook: "You probably have 5-10 problems on your list by now. Trying to solve all of them at once is how most first projects quietly die. Today's job is picking exactly one.",
  contentMd: [
    "Pick the problem you (a) care most about, and (b) can actually talk to real people about this week - not the one that sounds most impressive.",
    "A problem statement template that works: \"[Specific group of people] struggle with [specific problem] when [specific situation], which costs them [time / money / stress].\"",
    "Writing it down forces precision - a problem that's still vague in your head usually reveals its gaps the moment you try to write one clean sentence.",
    "You're allowed to be wrong about which problem to pick. The next module (customer discovery) is literally designed to test that guess - picking is a starting point, not a final commitment.",
  ].join("\n"),
  exampleMd: "Weak: \"Students have trouble with studying.\" Strong: \"First-year engineering students in my college struggle to find previous years' solved question papers when exams are 2 weeks away, which costs them hours of searching across scattered WhatsApp groups.\"",
  taskPrompt: "Using the template, write your own one-sentence problem statement for the single problem you're choosing to explore.",
  passMark: 60,
  quiz: [
    {
      id: "q1", type: "SINGLE", skillTag: "validation",
      prompt: "What's the main risk of trying to work on 5-10 problems at once early on?",
      options: [
        { id: "a", text: "It's actually more efficient" },
        { id: "b", text: "Spreading effort across too many problems is how first projects commonly stall and die" },
        { id: "c", text: "Investors prefer founders working on many problems" },
        { id: "d", text: "There is no real downside" },
      ],
      correctOptionIds: ["b"],
      explanation: "Focus matters early - trying to chase everything at once usually means making real progress on nothing.",
    },
    {
      id: "q2", type: "SINGLE", skillTag: "validation",
      prompt: "Which problem should you pick first, per this lesson?",
      options: [
        { id: "a", text: "Whichever sounds most impressive to investors" },
        { id: "b", text: "One you care about and can actually talk to real people about this week" },
        { id: "c", text: "The one with the biggest potential market size, regardless of access" },
        { id: "d", text: "Whichever your friends suggest" },
      ],
      correctOptionIds: ["b"],
      explanation: "Access to real people you can talk to soon, plus genuine interest, matters more at this stage than theoretical market size.",
    },
    {
      id: "q3", type: "TRUE_FALSE", skillTag: "validation",
      prompt: "True or false: picking a problem statement now is a final, unchangeable commitment.",
      options: [{ id: "true", text: "True" }, { id: "false", text: "False" }],
      correctOptionIds: ["false"],
      explanation: "It's a starting guess - the next module's customer discovery work is specifically designed to test and refine it.",
    },
    {
      id: "q4", type: "SINGLE", skillTag: "validation",
      prompt: "Fill the template: \"[Specific group] struggle with [specific problem] when [situation], which costs them ___.\"",
      options: [
        { id: "a", text: "A catchy slogan" },
        { id: "b", text: "Time, money or stress" },
        { id: "c", text: "A logo design" },
        { id: "d", text: "Social media followers" },
      ],
      correctOptionIds: ["b"],
      explanation: "The template ends by naming the real cost of the problem - time, money or stress - which is what makes it worth solving.",
    },
    {
      id: "q5", type: "SINGLE", skillTag: "validation",
      prompt: "Why does writing a problem statement down (not just thinking it) help?",
      options: [
        { id: "a", text: "It doesn't really help" },
        { id: "b", text: "Writing one clean sentence forces precision and reveals gaps that stay hidden when the problem is only vague in your head" },
        { id: "c", text: "It's only useful for a grade" },
        { id: "d", text: "It guarantees the problem is real" },
      ],
      correctOptionIds: ["b"],
      explanation: "The act of writing a precise sentence exposes vagueness that's easy to miss when a problem just feels real in your head.",
    },
  ],
};

const m3l1: Lesson = {
  slug: "the-mom-test",
  title: "Asking Good Questions - The Mom Test",
  order: 1,
  durationMin: 12,
  youtubeId: "MT4Ig2uqjTc",
  hook: "Riya asks her mother, \"Would you buy my homemade cookies?\" Her mother says, \"Of course!\" Riya bakes 50 boxes and sells 3. What went wrong?",
  contentMd: [
    "People are polite. If you ask \"Do you like my idea?\", they will say yes.",
    "Ask about what they already did, not what they would do.",
    "Good questions: \"When did you last face this problem?\" · \"What did you do about it?\" · \"How much did that cost you in time or money?\"",
    "Bad questions: \"Would you use this?\" · \"Is this a good idea?\" · \"How much would you pay?\"",
    "Listen more than you talk. Aim for about 80% listening.",
  ].join("\n"),
  exampleMd: "A good question for Riya would be: \"When did you last buy snacks for your tiffin? Where from? What did you not like about them?\"",
  taskPrompt: "Write 5 interview questions for your own problem statement from Module 2. Mark each as past behaviour (good) or opinion (bad).",
  passMark: 60,
  quiz: [
    {
      id: "q1", type: "SINGLE", skillTag: "customers",
      prompt: "Which is the best question to ask a potential customer?",
      options: [
        { id: "a", text: "Would you buy this app?" },
        { id: "b", text: "When did you last face this problem?" },
        { id: "c", text: "Do you like my idea?" },
        { id: "d", text: "How much would you pay?" },
      ],
      correctOptionIds: ["b"],
      explanation: "It asks about real past behaviour, which is honest. The other options invite polite guesses.",
    },
    {
      id: "q2", type: "SINGLE", skillTag: "customers",
      prompt: "Your friend says \"Great idea, I'd totally use it!\" What does that tell you?",
      options: [
        { id: "a", text: "You have a customer" },
        { id: "b", text: "Very little, because it is a compliment" },
        { id: "c", text: "You should start building" },
        { id: "d", text: "You should raise money" },
      ],
      correctOptionIds: ["b"],
      explanation: "Compliments are not commitments. Look for actions such as signing up, paying or spending time.",
    },
    {
      id: "q3", type: "SINGLE", skillTag: "customers",
      prompt: "Scenario: 8 of 10 people you interviewed said the problem happens \"rarely.\" What should you do?",
      options: [
        { id: "a", text: "Build anyway" },
        { id: "b", text: "Find a more frequent or painful problem, or a different customer" },
        { id: "c", text: "Make the app cheaper" },
        { id: "d", text: "Add more features" },
      ],
      correctOptionIds: ["b"],
      explanation: "A problem people rarely face is hard to build a business on. Frequency and pain matter.",
    },
    {
      id: "q4", type: "TRUE_FALSE", skillTag: "customers",
      prompt: "True or false: in a customer interview, you should spend most of the time explaining your idea.",
      options: [{ id: "true", text: "True" }, { id: "false", text: "False" }],
      correctOptionIds: ["false"],
      explanation: "Interviews are for learning. Pitching comes later.",
    },
    {
      id: "q5", type: "SINGLE", skillTag: "customers",
      prompt: "Which shows real interest from a customer?",
      options: [
        { id: "a", text: "\"Sounds cool\"" },
        { id: "b", text: "\"Let me know when it's ready\"" },
        { id: "c", text: "They pay a ₹100 deposit" },
        { id: "d", text: "They like your Instagram post" },
      ],
      correctOptionIds: ["c"],
      explanation: "Money or real effort is the strongest signal.",
    },
  ],
};

const m4l1: Lesson = {
  slug: "from-problem-to-solution",
  title: "From Problem to Solution",
  order: 1,
  durationMin: 10,
  youtubeId: "oWZbWzAyHAE",
  hook: "You've confirmed a real problem through interviews. Now comes the part everyone was impatient to reach - but jumping straight to \"the one perfect solution\" skips a step that saves months of wasted building.",
  contentMd: [
    "Brainstorm multiple possible solutions before committing to one - the first idea you think of is rarely the best one, just the most obvious one.",
    "A value proposition is one sentence: \"[Product] helps [customer] do [benefit] by [how it's different from alternatives].\"",
    "Competitor research isn't just about other startups - it includes whatever the customer does TODAY instead of your solution (even if that's \"nothing\" or \"a WhatsApp group\").",
    "If a customer already pays for or does something close to your idea, that's a GOOD sign - it proves the problem is worth paying to solve, not a reason to give up.",
  ].join("\n"),
  exampleMd: "For the hostel-dinner problem: possible solutions could be a late-night food delivery group, a shared cooking roster, or a pre-order system with a local vendor. Each gets evaluated before picking one to test.",
  taskPrompt: "Brainstorm 3 different possible solutions to your problem statement (not just one). Write a one-sentence value proposition for your favourite.",
  passMark: 60,
  quiz: [
    {
      id: "q1", type: "SINGLE", skillTag: "ideation",
      prompt: "Why brainstorm multiple solutions instead of committing to the first idea?",
      options: [
        { id: "a", text: "The first idea is always wrong" },
        { id: "b", text: "The first idea you think of is rarely the best one, just the most obvious one" },
        { id: "c", text: "Investors require at least 3 ideas" },
        { id: "d", text: "It isn't actually useful" },
      ],
      correctOptionIds: ["b"],
      explanation: "Obvious isn't the same as best - a wider set of options surfaces stronger ones you'd otherwise miss.",
    },
    {
      id: "q2", type: "SINGLE", skillTag: "business-model",
      prompt: "A value proposition sentence includes all of these EXCEPT:",
      options: [
        { id: "a", text: "The customer it's for" },
        { id: "b", text: "The benefit it delivers" },
        { id: "c", text: "How it differs from alternatives" },
        { id: "d", text: "The founder's personal life story" },
      ],
      correctOptionIds: ["d"],
      explanation: "A value proposition is about the customer, the benefit, and the differentiation - not the founder's biography.",
    },
    {
      id: "q3", type: "SINGLE", skillTag: "ideation",
      prompt: "What counts as a \"competitor\" for a new solution?",
      options: [
        { id: "a", text: "Only other registered startups" },
        { id: "b", text: "Whatever the customer does today instead, even if that's a WhatsApp group or doing nothing" },
        { id: "c", text: "Only large, well-funded companies" },
        { id: "d", text: "Nothing, if no one else has built this exact product" },
      ],
      correctOptionIds: ["b"],
      explanation: "The real competitor is the customer's current workaround, however informal it looks.",
    },
    {
      id: "q4", type: "TRUE_FALSE", skillTag: "ideation",
      prompt: "True or false: finding out a customer already pays for something close to your idea is a bad sign that means you should quit.",
      options: [{ id: "true", text: "True" }, { id: "false", text: "False" }],
      correctOptionIds: ["false"],
      explanation: "It's actually a good sign - it proves people value this problem being solved enough to already pay for it.",
    },
    {
      id: "q5", type: "SINGLE", skillTag: "business-model",
      prompt: "In the hostel-dinner example, which is NOT one of the brainstormed solutions?",
      options: [
        { id: "a", text: "A late-night food delivery group" },
        { id: "b", text: "A shared cooking roster" },
        { id: "c", text: "A pre-order system with a local vendor" },
        { id: "d", text: "A loan scheme for buying a car" },
      ],
      correctOptionIds: ["d"],
      explanation: "The brainstormed options were all directly about solving the dinner-access problem - a car loan is unrelated.",
    },
  ],
};

export const BUILDER_TRACK: Track = {
  slug: "builder",
  title: "Builder",
  level: "BUILDER",
  minClass: 9,
  maxClass: 12,
  description: "Simple frameworks and real Indian examples - for class 9-12 learners exploring their first startup idea.",
  modules: [
    {
      slug: "founder-mindset",
      title: "Founder Mindset",
      order: 1,
      missionText: "Write down 10 problems you or people around you face this week",
      portfolioItem: "Problem journal (10 problems)",
      passMark: 70,
      lessons: [m1l1, m1l2, m1l3],
      moduleTestDrawCount: 5,
      moduleTestBank: [
        bankQ("what-is-a-startup", m1l1.quiz[0]), bankQ("what-is-a-startup", m1l1.quiz[2]), bankQ("what-is-a-startup", m1l1.quiz[4]),
        bankQ("learning-from-failure", m1l2.quiz[0]), bankQ("learning-from-failure", m1l2.quiz[2]),
        bankQ("problems-beat-ideas", m1l3.quiz[0]), bankQ("problems-beat-ideas", m1l3.quiz[2]), bankQ("problems-beat-ideas", m1l3.quiz[3]),
      ],
    },
    {
      slug: "finding-the-right-problem",
      title: "Finding the Right Problem",
      order: 2,
      missionText: "Pick your top problem and write it in one sentence",
      portfolioItem: "Problem statement",
      passMark: 70,
      lessons: [m2l1, m2l2],
      moduleTestDrawCount: 5,
      moduleTestBank: [
        bankQ("spotting-real-pain-points", m2l1.quiz[0]), bankQ("spotting-real-pain-points", m2l1.quiz[1]), bankQ("spotting-real-pain-points", m2l1.quiz[2]), bankQ("spotting-real-pain-points", m2l1.quiz[4]),
        bankQ("writing-your-problem-statement", m2l2.quiz[0]), bankQ("writing-your-problem-statement", m2l2.quiz[2]), bankQ("writing-your-problem-statement", m2l2.quiz[3]), bankQ("writing-your-problem-statement", m2l2.quiz[4]),
      ],
    },
    {
      slug: "customer-discovery",
      title: "Customer Discovery",
      order: 3,
      missionText: "Interview 5 real people about the problem",
      portfolioItem: "Interview notes + customer persona",
      passMark: 70,
      lessons: [m3l1],
      moduleTestDrawCount: 4,
      moduleTestBank: [m3l1.quiz[0], m3l1.quiz[1], m3l1.quiz[2], m3l1.quiz[3], m3l1.quiz[4]].map((q) => bankQ("the-mom-test", q)),
    },
    {
      slug: "solution-and-idea-validation",
      title: "Solution and Idea Validation",
      order: 4,
      missionText: "Get 10 people to say \"I'd pay for this\" or sign up",
      portfolioItem: "Value proposition + competitor table",
      passMark: 70,
      lessons: [m4l1],
      moduleTestDrawCount: 4,
      moduleTestBank: [m4l1.quiz[0], m4l1.quiz[1], m4l1.quiz[2], m4l1.quiz[3], m4l1.quiz[4]].map((q) => bankQ("from-problem-to-solution", q)),
    },
  ],
};

export const TRACKS: Track[] = [BUILDER_TRACK];

export function getTrack(slug: string): Track | undefined {
  return TRACKS.find((t) => t.slug === slug);
}
export function getModule(trackSlug: string, moduleSlug: string): Module | undefined {
  return getTrack(trackSlug)?.modules.find((m) => m.slug === moduleSlug);
}
export function getLesson(trackSlug: string, moduleSlug: string, lessonSlug: string): Lesson | undefined {
  return getModule(trackSlug, moduleSlug)?.lessons.find((l) => l.slug === lessonSlug);
}
export function allLessonsInOrder(track: Track): { module: Module; lesson: Lesson }[] {
  return track.modules.flatMap((module) => module.lessons.map((lesson) => ({ module, lesson })));
}

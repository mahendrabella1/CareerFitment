/**
 * AI & Certifications - free AI courses that end in a free certificate or
 * badge, and AI tools rated for safety and age. Everything links out to the
 * provider; OneGrasp never signs in anywhere for the learner.
 *
 * Built from the "Free AI Courses, Certifications and Tools" plan (AI Lab):
 * a four-level ladder (Aware, User, Maker, Builder), paths by class, a rating
 * card per tool, and age gating by the learner's class.
 *
 * Every course and tool was checked against the provider's own pages in
 * October 2026 (CHECKED). Free tiers, certificate rules and age limits change
 * often - recheck every quarter, and the page tells learners to confirm on the
 * provider's site.
 */

export const CHECKED = "October 2026";

export type Level = 1 | 2 | 3 | 4;
export const LEVELS: { level: Level; name: string; short: string; text: string }[] = [
  { level: 1, name: "AI Aware", short: "Aware", text: "What AI is, where it goes wrong, and how to stay safe. Everyone should finish this level." },
  { level: 2, name: "AI User", short: "User", text: "Use AI well for study and work: good prompts, checking answers, honest use." },
  { level: 3, name: "AI Maker", short: "Maker", text: "Make your own small AI projects: train models, write Python, work with data." },
  { level: 4, name: "AI Builder", short: "Builder", text: "Build real AI apps: language models, agents and APIs." },
];

/** Who a course suits. "everyone" also covers working adults and parents. */
export type Group = "6-8" | "9-12" | "college" | "teachers" | "everyone";
export const GROUP_LABEL: Record<Group, string> = { "6-8": "Class 6–8", "9-12": "Class 9–12", college: "College", teachers: "Teachers", everyone: "Everyone" };

export interface AiCourse {
  slug: string;
  name: string;
  provider: string;
  /** Government of India, a university, or a company. */
  kind: "india" | "university" | "company";
  url: string;
  level: Level;
  groups: Group[];
  /** "about 4 hours", "7 weeks". Left out where the provider doesn't say. */
  time?: string;
  /** What you get, and what it takes to get it. */
  certificate: "certificate" | "badge";
  certNote: string;
  why: string;
  languages?: string;
  /** Anything to know before signing up. */
  note?: string;
}

export const COURSES: AiCourse[] = [
  // ------------------------------------------------------------ 1. AI Aware
  {
    slug: "yuva-ai-for-all", name: "YUVA AI for All", provider: "IndiaAI Mission, MeitY (Government of India)", kind: "india",
    url: "https://www.futureskillsprime.in/course/yuva-ai-for-all/", level: 1, groups: ["6-8", "9-12", "college", "teachers", "everyone"],
    time: "4.5 hours, 6 short modules", certificate: "certificate",
    certNote: "Official Government of India certificate when you finish the course on FutureSkills Prime.",
    why: "The national AI course: what AI is, how to use it well and safely. The best first certificate for anyone.",
    languages: "11 languages, including Hindi, Tamil and Telugu",
  },
  {
    slug: "ai-for-all-cbse-intel", name: "AI For All", provider: "CBSE and Intel", kind: "company",
    url: "https://ai-for-all.in/", level: 1, groups: ["6-8", "9-12", "everyone"],
    time: "about 4 hours: AI Awareness (1.5 h) and AI Appreciation (2.5 h)", certificate: "badge",
    certNote: "A digital badge for each of the two parts, to share or keep.",
    why: "A gentle start in plain language, made for school students and families.",
    languages: "11 Indian languages",
  },
  {
    slug: "soar-ai-to-be-aware", name: "SOAR: AI to be Aware", provider: "Skill India Digital Hub, MSDE (Government of India)", kind: "india",
    url: "https://www.skillindiadigital.gov.in/", level: 1, groups: ["6-8", "9-12", "everyone"],
    certificate: "certificate", certNote: "Certificate on completion, on the Skill India Digital Hub.",
    why: "The government's Skilling for AI Readiness (SOAR) programme - \"AI to be Aware\" is its starting course.",
    note: "Sign-in uses Aadhaar-based verification. Search \"SOAR\" on the site.",
  },
  {
    slug: "code-org-ai-for-oceans", name: "AI for Oceans", provider: "Code.org", kind: "company",
    url: "https://studio.code.org/courses/oceans/units/1/lessons/1/levels/1", level: 1, groups: ["6-8"],
    time: "about 1 hour", certificate: "certificate",
    certNote: "A printable certificate at the end of the activity.",
    why: "Train an AI to sort fish from rubbish and see how training data changes what it learns. Made for younger students.",
  },
  {
    slug: "elements-of-ai", name: "Elements of AI", provider: "University of Helsinki and MinnaLearn", kind: "university",
    url: "https://www.elementsofai.com/", level: 1, groups: ["9-12", "college", "everyone"],
    time: "about 30 hours, 6 chapters", certificate: "certificate",
    certNote: "Free certificate from the University of Helsinki once you complete the exercises.",
    why: "The classic free university course on what AI can and can't do - no maths or coding needed.",
  },
  {
    slug: "google-intro-generative-ai", name: "Introduction to Generative AI", provider: "Google Skills (formerly Google Cloud Skills Boost)", kind: "company",
    url: "https://www.skills.google/paths/118", level: 1, groups: ["9-12", "college", "everyone"],
    time: "45-minute first course; the beginner path has 4 activities", certificate: "badge",
    certNote: "A skill badge for the beginner path, shareable on LinkedIn.",
    why: "Short, clear videos on how generative AI and large language models work, and responsible AI.",
    note: "Needs a Google account (13+).",
  },
  {
    slug: "anthropic-ai-fluency", name: "AI Fluency: Framework & Foundations", provider: "Anthropic Academy", kind: "company",
    url: "https://anthropic.skilljar.com/", level: 1, groups: ["college", "everyone"],
    time: "about 4 hours", certificate: "certificate",
    certNote: "Certificate of completion after the final quiz.",
    why: "How to work with any AI well: when to use it, how to ask, how to judge what it gives you.",
    note: "For learners aged 18 and over.",
  },
  // ------------------------------------------------------------ 2. AI User
  {
    slug: "anthropic-ai-fluency-students", name: "AI Fluency for Students", provider: "Anthropic Academy", kind: "company",
    url: "https://anthropic.skilljar.com/", level: 2, groups: ["college"],
    certificate: "certificate", certNote: "Certificate of completion after the final quiz.",
    why: "Using AI for learning and career planning without letting it do your thinking.",
    note: "For learners aged 18 and over.",
  },
  {
    slug: "anthropic-ai-capabilities", name: "AI Capabilities and Limitations", provider: "Anthropic Academy", kind: "company",
    url: "https://anthropic.skilljar.com/", level: 2, groups: ["college", "everyone"],
    time: "about 3.5 hours", certificate: "certificate", certNote: "Certificate of completion after the final quiz.",
    why: "What today's AI is genuinely good at, where it fails, and why it sounds sure when it's wrong.",
    note: "For learners aged 18 and over.",
  },
  {
    slug: "ibm-ai-fundamentals", name: "Artificial Intelligence Fundamentals", provider: "IBM SkillsBuild", kind: "company",
    url: "https://skillsbuild.org/learning-catalog", level: 2, groups: ["9-12", "college", "everyone"],
    time: "about 10 hours", certificate: "badge",
    certNote: "Free IBM digital credential (Credly badge) after the courses and the final assessment.",
    why: "Machine learning, neural networks, AI ethics and a first look at running a model - a badge employers recognise.",
    note: "Search \"Artificial Intelligence Fundamentals\" in the catalogue.",
  },
  {
    slug: "aws-educate-generative-ai", name: "Introduction to Generative AI", provider: "AWS Educate (Amazon)", kind: "company",
    url: "https://aws.amazon.com/education/awseducate/", level: 2, groups: ["9-12", "college", "everyone"],
    certificate: "badge", certNote: "Free AWS digital badge after you pass the post-course assessment.",
    why: "Generative AI basics with simulated hands-on labs - no credit card, sign up with an email.",
    note: "Open to learners aged 13 and over.",
  },
  {
    slug: "google-genai-for-educators", name: "Generative AI for Educators with Gemini", provider: "Google and MIT RAISE", kind: "company",
    url: "https://grow.google/ai-for-educators/", level: 2, groups: ["teachers"],
    time: "about 2 hours", certificate: "certificate",
    certNote: "Certificate when you finish; many schools accept it for professional development.",
    why: "Lesson planning, personalising teaching and saving time with AI - for teachers of any subject.",
  },
  {
    slug: "anthropic-ai-fluency-educators", name: "AI Fluency for Educators", provider: "Anthropic Academy", kind: "company",
    url: "https://anthropic.skilljar.com/", level: 2, groups: ["teachers"],
    certificate: "certificate", certNote: "Certificate of completion after the final quiz.",
    why: "Bringing AI into teaching honestly: planning, assessment design and academic integrity.",
  },
  // ------------------------------------------------------------ 3. AI Maker
  {
    slug: "kaggle-python", name: "Python", provider: "Kaggle Learn (Google)", kind: "company",
    url: "https://www.kaggle.com/learn/python", level: 3, groups: ["9-12", "college"],
    time: "about 5 hours", certificate: "certificate",
    certNote: "Free certificate when you finish every lesson and exercise (free Kaggle account).",
    why: "The language almost all AI is built in, taught with short exercises you run in the browser.",
  },
  {
    slug: "kaggle-intro-ml", name: "Intro to Machine Learning", provider: "Kaggle Learn (Google)", kind: "company",
    url: "https://www.kaggle.com/learn/intro-to-machine-learning", level: 3, groups: ["9-12", "college"],
    time: "about 3 hours, 7 lessons", certificate: "certificate",
    certNote: "Free certificate when you finish all seven lessons.",
    why: "Build and improve your first real machine-learning model on real data.",
    note: "Do Kaggle's Python course first.",
  },
  {
    slug: "kaggle-intro-deep-learning", name: "Intro to Deep Learning", provider: "Kaggle Learn (Google)", kind: "company",
    url: "https://www.kaggle.com/learn/intro-to-deep-learning", level: 3, groups: ["college"],
    time: "about 4 hours", certificate: "certificate",
    certNote: "Free certificate when you finish every lesson.",
    why: "Neural networks with Keras, step by step - the next step after Intro to Machine Learning.",
  },
  {
    slug: "cs50-ai", name: "CS50's Introduction to AI with Python", provider: "Harvard University (CS50)", kind: "university",
    url: "https://cs50.harvard.edu/ai/", level: 3, groups: ["college"],
    time: "7 weeks", certificate: "certificate",
    certNote: "Free CS50 certificate when you pass all the projects. (The edX verified certificate is paid - you don't need it.)",
    why: "Harvard's famous course: search, knowledge, probability, machine learning, neural networks and language.",
    note: "Needs comfortable Python first, such as CS50x or a year of coding.",
  },
  {
    slug: "freecodecamp-ml-python", name: "Machine Learning with Python", provider: "freeCodeCamp", kind: "company",
    url: "https://www.freecodecamp.org/learn/machine-learning-with-python/", level: 3, groups: ["college", "everyone"],
    time: "about 300 hours", certificate: "certificate",
    certNote: "Free freeCodeCamp certification after you build the required projects.",
    why: "A long, project-based route into machine learning, all free and self-paced.",
  },
  // ------------------------------------------------------------ 4. AI Builder
  {
    slug: "hugging-face-agents", name: "AI Agents Course", provider: "Hugging Face", kind: "company",
    url: "https://huggingface.co/learn/agents-course", level: 4, groups: ["college"],
    certificate: "certificate",
    certNote: "Two free certificates: Fundamentals (after Unit 1) and Completion (Unit 1, one use-case assignment and the final challenge).",
    why: "Build AI agents with open-source tools, from the basics to a final challenge.",
  },
  {
    slug: "anthropic-claude-api", name: "Building with the Claude API", provider: "Anthropic Academy", kind: "company",
    url: "https://anthropic.skilljar.com/", level: 4, groups: ["college"],
    certificate: "certificate", certNote: "Certificate of completion after the final quiz.",
    why: "Build your own app on a large language model: prompts, tools, retrieval and evaluation.",
    note: "For learners aged 18 and over. Some knowledge of Python helps.",
  },
];

// ------------------------------------------------------------------ tools

/** Who may use a tool: kids (under 13, classroom tools), teen (13+, a parent's
 *  permission until 18), adult (18+ only). From each provider's own rules. */
export type Band = "kids" | "teen" | "adult";
export const BAND_LABEL: Record<Band, string> = { kids: "All ages", teen: "13+ · parent permission", adult: "18+ only" };

export type ToolCategory = "Learn" | "Write" | "Research" | "Code" | "Design" | "Build" | "Indian languages";
export const TOOL_CATEGORIES: ToolCategory[] = ["Learn", "Write", "Research", "Code", "Design", "Build", "Indian languages"];

export interface AiTool {
  slug: string;
  name: string;
  maker: string;
  url: string;
  categories: ToolCategory[];
  band: Band;
  what: string;
  /** What is free, and what costs money. */
  free: string;
  account: string;
  privacy: string;
  safety: string;
  accuracy: string;
  languages?: string;
  tips: string[];
  /** One example to try (a prompt, or a first activity). */
  tryThis: string;
}

export const TOOLS: AiTool[] = [
  // ------------------------------------------------------------ all ages (made for children and classrooms)
  {
    slug: "teachable-machine", name: "Teachable Machine", maker: "Google", url: "https://teachablemachine.withgoogle.com/",
    categories: ["Build", "Learn"], band: "kids",
    what: "Train a computer to recognise your own pictures, sounds or poses - no coding.",
    free: "Everything - no paid plan.", account: "No account needed.",
    privacy: "Training happens in your browser; your samples stay on your device unless you choose to save the project to Google Drive.",
    safety: "No chat and nothing is shared unless you publish a model yourself.",
    accuracy: "It only knows what you showed it - test it on new examples to find where it gets confused.",
    tips: ["Use objects (fruit, pens, toys), not people's faces.", "Give each class 20 or more samples, with different backgrounds and light.", "Test with examples it has never seen, and note where it fails."],
    tryThis: "Train three classes - rock, paper and scissors - with your hand, then play a round against it.",
  },
  {
    slug: "ml-for-kids", name: "Machine Learning for Kids", maker: "Dale Lane (free project)", url: "https://machinelearningforkids.co.uk/",
    categories: ["Build", "Code"], band: "kids",
    what: "Train a model on words, numbers, pictures or sounds, then use it inside a Scratch game.",
    free: "Everything - no paid plan.", account: "\"Try it now\" without an account, or a class account made by your teacher.",
    privacy: "No personal details needed - use Try it now or your teacher's class.",
    safety: "Made for schools; teachers control class accounts.",
    accuracy: "Small training sets make mistakes - that is part of the lesson.",
    tips: ["Start with text: train \"kind\" and \"unkind\" messages.", "Add more examples when it guesses wrong, then test again.", "Explain to a friend why it made a mistake."],
    tryThis: "Make a \"recycle or not\" sorter in Scratch that answers using your model.",
  },
  {
    slug: "scratch", name: "Scratch", maker: "MIT Scratch Foundation", url: "https://scratch.mit.edu/",
    categories: ["Code"], band: "kids",
    what: "Make games, stories and animations with coding blocks - and add AI with Machine Learning for Kids.",
    free: "Everything - no paid plan.", account: "Optional; a parent's email is needed to share projects.",
    privacy: "Never put your real name, school or photo in projects or comments.",
    safety: "Built for ages 8–16, with a moderated community.",
    accuracy: "Not an AI itself - it runs the AI you build.",
    tips: ["Remix a project to see how it works.", "Keep usernames that don't reveal who you are.", "Pair it with Machine Learning for Kids for AI games."],
    tryThis: "Make a sprite that says something different when your model hears \"hello\" or \"bye\".",
  },
  {
    slug: "quick-draw", name: "Quick, Draw!", maker: "Google", url: "https://quickdraw.withgoogle.com/",
    categories: ["Learn"], band: "kids",
    what: "A drawing game where a neural network guesses your doodles - see how AI learns from examples.",
    free: "Everything - no paid plan.", account: "No account needed.",
    privacy: "Your drawings are added to Google's public Quick, Draw! dataset, so don't write names or words.",
    safety: "No chat, no personal details.",
    accuracy: "It guesses from millions of other people's drawings - look at why it got one wrong.",
    tips: ["After a round, open the examples to see what the AI expected.", "Talk about why some drawings are hard for it.", "Connect it to how other AI learns from data."],
    tryThis: "Play a round, then compare your drawing with the ones it learned from.",
  },
  {
    slug: "autodraw", name: "AutoDraw", maker: "Google", url: "https://www.autodraw.com/",
    categories: ["Design"], band: "kids",
    what: "Turns your rough sketch into a clean drawing by guessing what you meant.",
    free: "Everything - no paid plan.", account: "No account needed.",
    privacy: "Nothing to sign up for; download what you make.",
    safety: "No chat, no sharing.",
    accuracy: "Its guesses can be funny - pick from its list or keep your own drawing.",
    tips: ["Draw simply, one object at a time.", "Use it for posters and charts in projects.", "Say that you used AutoDraw when you hand work in."],
    tryThis: "Make a poster about saving water using three AutoDraw pictures.",
  },
  {
    slug: "canva-education", name: "Canva for Education", maker: "Canva", url: "https://www.canva.com/education/",
    categories: ["Design"], band: "kids",
    what: "Posters, presentations and short videos, with AI design tools - free for schools.",
    free: "Free for K–12 teachers and their students.", account: "Join through your teacher or school.",
    privacy: "Your school's settings apply; keep personal photos out of class projects.",
    safety: "Your teacher or school manages the class.",
    accuracy: "AI-written text in designs can be wrong - check every fact you put on a poster.",
    languages: "Many Indian languages for text",
    tips: ["Write your own words first, then let AI help with layout.", "Check every fact and number before you present.", "Add a line saying where you used AI."],
    tryThis: "Design a one-page poster explaining one thing you learned in AI for Oceans.",
  },
  // ------------------------------------------------------------ 13+ with a parent's permission
  {
    slug: "gemini", name: "Gemini", maker: "Google", url: "https://gemini.google.com/",
    categories: ["Learn", "Write"], band: "teen",
    what: "Google's AI assistant: explanations, brainstorming and practice questions.",
    free: "Free with a Google account; paid plans add more.", account: "Google account (13+; younger only with a parent-managed Family Link account where Google allows it).",
    privacy: "Chats are saved to your Google Account and some are reviewed by people - turn off Gemini Apps Activity to stop them being used to improve Google's AI.",
    safety: "Stricter content rules for under-18 accounts.",
    accuracy: "Can make up facts and sources - check anything important.",
    languages: "Hindi, Bengali, Gujarati, Kannada, Malayalam, Marathi, Tamil, Telugu, Urdu and more",
    tips: ["Ask it to explain, not to answer: \"Explain step by step, then give me one to try.\"", "Ask for sources, then open them.", "Never paste your name, phone number, Aadhaar or photos."],
    tryThis: "\"I'm in class 10. Explain photosynthesis simply, then ask me 3 questions to check I understood.\"",
  },
  {
    slug: "gemini-notebook", name: "Gemini Notebook (formerly NotebookLM)", maker: "Google", url: "https://notebook.google.com/",
    categories: ["Learn", "Research"], band: "teen",
    what: "Add your own notes or a chapter; it answers from those sources and makes quizzes, mind maps and audio overviews.",
    free: "Free with a Google account.", account: "Google account (13+); under-18 accounts get stricter content rules.",
    privacy: "Upload only your own notes or public material - nothing private or personal.",
    safety: "Under-18 accounts have stricter content rules.",
    accuracy: "Answers point back to your sources - click through and check them.",
    tips: ["Upload one chapter at a time.", "Ask for a 10-question quiz, then answer without looking.", "Use the citations to find the exact line in your notes."],
    tryThis: "Add your science chapter notes and ask: \"Make a 10-question quiz from these notes, with answers at the end.\"",
  },
  {
    slug: "chatgpt", name: "ChatGPT", maker: "OpenAI", url: "https://chatgpt.com/",
    categories: ["Learn", "Write", "Code"], band: "teen",
    what: "A general AI assistant for explaining, practising, writing feedback and coding help.",
    free: "Free plan; paid plans add more.", account: "13+; OpenAI requires a parent's or guardian's consent from 13 to 18.",
    privacy: "Chats can be used to train models unless you turn it off in Settings → Data controls.",
    safety: "Parents can link their account to a teen's and set controls.",
    accuracy: "Sounds confident even when wrong - check facts, numbers and sources.",
    languages: "Hindi and many other Indian languages",
    tips: ["Ask for feedback on your own draft instead of a finished answer.", "Say your class and what you already know.", "Ask \"How sure are you, and how can I check?\""],
    tryThis: "\"Here is my paragraph on climate change. Don't rewrite it - list 3 ways to make it clearer.\"",
  },
  {
    slug: "copilot", name: "Microsoft Copilot", maker: "Microsoft", url: "https://copilot.microsoft.com/",
    categories: ["Learn", "Write"], band: "teen",
    what: "Microsoft's AI assistant with web answers and links, in the browser and in Windows.",
    free: "Free with a Microsoft account.", account: "13+ in most countries (some set a higher age).",
    privacy: "You can switch off model training and personalisation in its privacy settings.",
    safety: "Microsoft's regional age limits apply even with a parent's consent.",
    accuracy: "Check the linked sources - summaries can miss details.",
    tips: ["Open the links it gives you.", "Ask it to compare two sources.", "Don't share school logins or personal details."],
    tryThis: "\"Find two reliable sources on India's monsoon and tell me where they disagree.\"",
  },
  {
    slug: "perplexity", name: "Perplexity", maker: "Perplexity AI", url: "https://www.perplexity.ai/",
    categories: ["Research"], band: "teen",
    what: "Answers questions with links to where each fact came from - good for checking sources.",
    free: "Free plan; Pro is paid.", account: "13+; its terms ask for a parent's or guardian's permission until 18.",
    privacy: "Check its privacy settings so your searches aren't used to improve its models.",
    safety: "Treat it like a search engine - open the sources before you trust them.",
    accuracy: "A source being linked doesn't mean the summary is right - read the source.",
    tips: ["Click at least two of the sources.", "Ask follow-ups on one source at a time.", "Prefer government, university and newspaper sites."],
    tryThis: "\"What is the cyber fraud helpline in India and what should I do in the first hour? Cite official sources.\"",
  },
  {
    slug: "bhashini", name: "Bhashini", maker: "Government of India (MeitY)", url: "https://bhashini.gov.in/",
    categories: ["Indian languages"], band: "teen",
    what: "Translation, speech-to-text and text-to-speech across Indian languages.",
    free: "Free (Government of India).", account: "Depends on the tool you open.",
    privacy: "Don't translate private documents or personal details.",
    safety: "A government service.",
    accuracy: "Machine translation can miss meaning - ask a speaker to check anything important.",
    languages: "22 scheduled Indian languages",
    tips: ["Translate short sentences, not whole documents.", "Listen to the read-aloud to check pronunciation.", "Use it to study in your own language."],
    tryThis: "Translate three lines of your notes into your home language and read them aloud.",
  },
  {
    slug: "colab", name: "Google Colab", maker: "Google", url: "https://colab.research.google.com/",
    categories: ["Code", "Build"], band: "teen",
    what: "Write and run Python in your browser, with free computing for machine-learning projects.",
    free: "Free tier; paid plans add more computing time.", account: "Google account (13+).",
    privacy: "Notebooks save to your Google Drive - never put passwords or API keys in a shared notebook.",
    safety: "Only run code you understand or trust.",
    accuracy: "AI code suggestions can be wrong - read and test every cell.",
    tips: ["Use it for Kaggle Learn and CS50 projects.", "Name and save a copy before you change a shared notebook.", "Comment your code so a teacher can follow it."],
    tryThis: "Load a public dataset about your city and plot one chart.",
  },
  {
    slug: "kaggle", name: "Kaggle", maker: "Google", url: "https://www.kaggle.com/code",
    categories: ["Code", "Build"], band: "teen",
    what: "Free notebooks and thousands of public datasets - and where Kaggle Learn's certificates live.",
    free: "Everything - no paid plan.", account: "Free Kaggle account.",
    privacy: "Public notebooks are visible to everyone - keep personal data out.",
    safety: "Use public datasets; don't upload other people's data.",
    accuracy: "A model's score on one dataset isn't the whole story - check how it was tested.",
    tips: ["Fork a beginner notebook and change one thing at a time.", "Read the dataset's description before using it.", "Finish a Kaggle Learn course for a free certificate."],
    tryThis: "Predict exam scores from hours studied with a simple regression.",
  },
  // ------------------------------------------------------------ 18+
  {
    slug: "claude", name: "Claude", maker: "Anthropic", url: "https://claude.ai/",
    categories: ["Learn", "Write", "Code", "Research"], band: "adult",
    what: "An AI assistant for long documents, writing feedback, analysis and coding.",
    free: "Free plan; paid plans add more.", account: "18 and over only.",
    privacy: "You choose in its privacy settings whether your chats can be used to improve Claude.",
    safety: "Adults only - not for school students under 18.",
    accuracy: "Can be wrong or out of date - check facts and run any code it writes.",
    languages: "Hindi and other Indian languages",
    tips: ["Give it context: your goal, your level, the format you want.", "Ask it to find weak points in your own work.", "Check anything it says against a reliable source."],
    tryThis: "\"Here's my CV and a job post. Which 3 things should I add or make clearer - and why?\"",
  },
  {
    slug: "hugging-face", name: "Hugging Face", maker: "Hugging Face", url: "https://huggingface.co/spaces",
    categories: ["Build"], band: "adult",
    what: "Try thousands of open AI models and demos (Spaces), and host your own project.",
    free: "Free tier; paid hardware for bigger models.", account: "Free account to publish.",
    privacy: "Demos are run by different people - don't upload personal photos or documents to them.",
    safety: "Anyone can publish a demo; prefer well-known ones.",
    accuracy: "Open models vary a lot - read each model card's limits.",
    tips: ["Read the model card first.", "Try the same question on two models and compare.", "Use it for the Agents Course projects."],
    tryThis: "Compare two translation models on the same Hindi sentence.",
  },
];

// ------------------------------------------------------------------ the learner

/** A learner's class -> which tools they may see, and which courses suit them first. */
export function learnerOf(category?: string | null): { band: Band; group: Group | null; label: string } {
  switch (category) {
    case "class_6": case "class_7": case "class_8":
      return { band: "kids", group: "6-8", label: "Class 6–8" };
    case "class_9_10": case "class_11": case "class_12": case "class_11_12":
      return { band: "teen", group: "9-12", label: "Class 9–12" };
    case "graduate":
      return { band: "adult", group: "college", label: "College" };
    case "experienced_professional":
      return { band: "adult", group: "everyone", label: "Working professional" };
    default:
      return { band: "adult", group: null, label: "" };
  }
}

const BAND_ORDER: Record<Band, number> = { kids: 0, teen: 1, adult: 2 };
export const toolsFor = (band: Band) => TOOLS.filter((t) => BAND_ORDER[t.band] <= BAND_ORDER[band]);

/** Courses for a group (with "everyone" courses for adults), level by level. */
export function coursesFor(group: Group | null): AiCourse[] {
  if (!group) return COURSES;
  return COURSES.filter((c) => c.groups.includes(group) || (group !== "6-8" && group !== "9-12" && c.groups.includes("everyone")));
}

// ------------------------------------------------------------------ responsible AI

export const RULES: { title: string; text: string; kids: string }[] = [
  { title: "Check before you trust", text: "AI can sound confident and still be wrong. Verify facts, numbers and sources.", kids: "AI can be wrong even when it sounds sure. Check with a book, a teacher or a trusted website." },
  { title: "Protect your data", text: "Never share passwords, Aadhaar, OTPs, your home address, photos of yourself or other people's private information with AI tools.", kids: "Never tell an AI your name, school, address, phone number or passwords, and don't upload photos of people." },
  { title: "Be honest", text: "Follow your school's or employer's rules and say when and how you used AI. Handing in AI work as your own is cheating.", kids: "Tell your teacher when you used AI. Copying AI work and calling it yours is cheating." },
  { title: "Respect others", text: "Don't create fake images, voices or messages of real people. Deepfakes can be harmful and, in many cases, illegal.", kids: "Never make fake pictures, voices or messages of real people - it can really hurt them." },
  { title: "Stay in charge", text: "Use AI to think better, not to stop thinking. Final decisions are yours.", kids: "Use AI to help you think, not to think for you. You decide." },
];

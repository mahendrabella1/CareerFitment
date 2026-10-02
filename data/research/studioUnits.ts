/**
 * Research Studio - 8 skills units (per "Research and International
 * Conferences Section - Plan.pdf", section 5). Unlike Startups' lessons,
 * these have no graded quiz - the PDF is explicit that the real assessment
 * is the learner's actual abstract/poster/talk, checked by a mentor with
 * the rubric (see lib/research/rubric.ts), not a quiz score. So each unit
 * is just content + a real task, submitted for mentor feedback rather than
 * auto-graded. No secrets here - safe to import client-side directly.
 */

export interface StudioUnit {
  unit: number;
  slug: string;
  title: string;
  stepTitle: string; // matches the Journey step this unit supports
  hook: string;
  contentMd: string;
  taskPrompt: string;
  freeTools: { name: string; url?: string }[];
}

export const STUDIO_UNITS: StudioUnit[] = [
  {
    unit: 1, slug: "what-is-research", title: "What Is Research?", stepTitle: "Choose a date",
    hook: "You notice your plants grow faster near the window. You wonder why. The moment you ask \"why\" instead of just noticing, you've taken the first step from observation to research.",
    contentMd: [
      "Research follows a simple chain: Observation → Question → Evidence → Answer. A project just DOES something; research also asks WHY and checks the answer against real evidence.",
      "You don't need a lab to do real research. A survey of 50 classmates, a week of measuring something, or a careful comparison of existing studies all count - as long as you're testing a real question against real evidence, not just stating an opinion.",
      "The difference between a project and research: a project (like a model volcano) demonstrates something already known. Research tries to find out something you genuinely don't know the answer to yet.",
    ].join("\n"),
    taskPrompt: "List 5 things you genuinely wonder about - not Google-able facts, but real open questions about the world around you.",
    freeTools: [],
  },
  {
    unit: 2, slug: "asking-a-good-question", title: "Asking a Good Question", stepTitle: "Ask a question",
    hook: "\"Is social media bad for teenagers?\" sounds like a research question. It isn't - it's too big to answer in weeks, and \"bad\" isn't something you can measure. A good question is small enough to actually finish.",
    contentMd: [
      "A good research question is small, specific, testable, and doable in the weeks you actually have before your conference.",
      "The \"So what?\" test: after you answer this question, does anyone (including you) learn something useful? If the honest answer is \"not really,\" the question needs sharpening.",
      "Turn a big topic into a small question by adding WHO, WHERE and WHEN: not \"does screen time affect sleep\" but \"does daily screen time affect the sleep hours of class 8-10 students in my school, this term.\"",
    ].join("\n"),
    taskPrompt: "Write one research question, and in one sentence explain why it matters - who would actually want to know the answer?",
    freeTools: [{ name: "Question-builder template" }],
  },
  {
    unit: 3, slug: "finding-and-reading-sources", title: "Finding and Reading Sources", stepTitle: "Read and plan",
    hook: "Not everything that sounds authoritative actually is. A blog post with no author and a peer-reviewed study can look equally confident - learning to tell them apart is half of doing real research.",
    contentMd: [
      "A trustworthy source usually has a named author or institution, is reasonably recent for fast-moving topics, and explains its own method (how do THEY know what they're claiming?).",
      "Reading an abstract first (the short summary at the top of most papers) tells you in 30 seconds whether a source is actually relevant, before you spend 20 minutes reading the whole thing.",
      "Take one-line notes as you go, in your own words, with the source attached. Writing \"source says X\" immediately is far more reliable than trying to remember which article said what, days later.",
      "Always cite what you use. Citing isn't just a rule - it lets a reader (and your mentor) check your claims against the original, and it's the line between research and copying.",
    ].join("\n"),
    taskPrompt: "Find and read 3-15 sources on your topic (scale to your level - poster: 3-5, oral talk: 8-12, full paper: 15+). For each, write one line: what it found, and whether you trust it.",
    freeTools: [{ name: "Google Scholar", url: "https://scholar.google.com" }, { name: "PubMed", url: "https://pubmed.ncbi.nlm.nih.gov" }, { name: "arXiv", url: "https://arxiv.org" }, { name: "DOAJ", url: "https://doaj.org" }, { name: "Zotero", url: "https://www.zotero.org" }],
  },
  {
    unit: 4, slug: "method-and-data", title: "Method and Data", stepTitle: "Collect data",
    hook: "A survey of 5 friends and a survey of 80 students across 3 classes can ask the exact same question - but only one of them lets you say anything meaningful about the answer.",
    contentMd: [
      "Pick a method that fits your question: a survey (opinions/experiences from many people), an experiment (you change one thing, measure the effect), an observation (you watch and record, without changing anything), or data analysis (you work with numbers that already exist).",
      "Sample size matters. A handful of responses can't tell you much - aim for as many real responses as you can realistically collect, and be honest in your conclusion about how small or large your sample was.",
      "A fair test changes only ONE thing at a time, so you can actually tell what caused a result rather than guessing between several possible causes.",
      "Ethics and consent: anyone you survey or interview should know what it's for and agree to take part. For school projects, keep surveys anonymous where possible, and get your school or a guardian's approval before surveying children (see Unit 11, safety).",
    ].join("\n"),
    taskPrompt: "Write a one-page method plan: what you'll do, with whom, roughly how many people/data points, and how you'll keep it fair and ethical.",
    freeTools: [{ name: "Google Forms", url: "https://forms.google.com" }, { name: "Google Sheets", url: "https://sheets.google.com" }],
  },
  {
    unit: 5, slug: "analysing-results", title: "Analysing Results", stepTitle: "Collect data",
    hook: "80 survey responses are just noise until you organise them. A simple table and one honest chart can say more than three paragraphs of description.",
    contentMd: [
      "Start with a table: group your data into categories or ranges, and count how many responses fall into each.",
      "A simple chart (bar chart for comparing groups, line chart for change over time) usually communicates a result faster than the same information in a sentence.",
      "Averages and percentages are usually enough for a poster or short talk. Older or more advanced learners doing a full paper can go further with basic statistics - but a clear, honest average beats an impressive-sounding statistic nobody (including you) fully understands.",
      "Report the real numbers, even inconvenient ones. A result that doesn't fully support your initial guess is still a real finding - and mentors are trained to notice numbers that look \"too clean\" to be genuine data.",
    ].join("\n"),
    taskPrompt: "Build a results table and 1-3 charts from your real data. Write 2-3 sentences describing what they show, in plain language.",
    freeTools: [{ name: "Google Sheets", url: "https://sheets.google.com" }],
  },
  {
    unit: 6, slug: "writing-the-abstract", title: "Writing the Abstract", stepTitle: "Write abstract",
    hook: "About 250 words stand between your months of work and a reader deciding whether to pay attention. The 5-part structure below is the fastest way to get there.",
    contentMd: [
      "1. Background (1-2 sentences): why the topic matters.",
      "2. Aim (1 sentence): the question you tried to answer.",
      "3. Method (2 sentences): what you did, with whom, how many.",
      "4. Results (2-3 sentences): the main findings, with real numbers.",
      "5. Conclusion (1-2 sentences): what it means, and what could come next.",
      "Write the Results section only after you actually have results - an abstract outline filled with placeholder numbers is easy to spot, and mentors will send it back.",
    ].join("\n"),
    taskPrompt: "Write your abstract draft using the 5-part structure, in about 250 words, using the Abstract Editor's word counter.",
    freeTools: [{ name: "Abstract template" }],
  },
  {
    unit: 7, slug: "poster-or-slides", title: "Poster or Slides", stepTitle: "Submit",
    hook: "A poster covered edge-to-edge in text gets read by nobody. One clear message, big visuals, and a reader who gets the point in 10 seconds - that's the actual job of a poster.",
    contentMd: [
      "Poster layout: title and names at the top; then Question, Method, Results (the biggest area - mostly charts, not paragraphs), Conclusion and References; a QR code linking to your research profile in a corner.",
      "10-slide talk structure: title → why it matters → question → method → results (2-3 slides) → what it means → limitations → thank you and questions.",
      "One message per slide or per poster section. If a sentence doesn't directly support your main finding, it probably belongs in your notes, not on the poster.",
      "Limitations aren't a weakness to hide - naming what your study couldn't cover (small sample, one school, short time frame) makes your real findings MORE credible, not less.",
    ].join("\n"),
    taskPrompt: "Build your poster or slide deck using the structure above. Share the link or file here.",
    freeTools: [{ name: "Canva", url: "https://canva.com" }, { name: "Google Slides", url: "https://slides.google.com" }, { name: "PowerPoint" }, { name: "Overleaf (LaTeX)", url: "https://overleaf.com" }],
  },
  {
    unit: 8, slug: "presenting-and-qa", title: "Presenting and Q&A", stepTitle: "Present",
    hook: "The first time you hear your own recorded voice explaining your research, it feels strange. By the second recording, it starts sounding like you know exactly what you're talking about - because by then, you do.",
    contentMd: [
      "Speak a little slower than feels natural - online audiences lose more from rushed, unclear speech than from a talk that's a touch too measured.",
      "Time yourself: a poster pitch runs about 3 minutes, a talk about the length your conference specifies (often 7-12 minutes). Practising against a timer is the only way to know if you're actually in range.",
      "For Q&A, it's genuinely fine to say \"that's a great question, I don't have a confident answer, but here's what I'd guess based on what I found.\" Honest uncertainty reads far better than a confident wrong answer.",
      "Check your camera framing, lighting and microphone before the real session - a 2-minute test run with a friend catches most problems before they matter.",
    ].join("\n"),
    taskPrompt: "Record two practice runs of your presentation (timed to your conference's format) and share them with your mentor for feedback.",
    freeTools: [{ name: "Practice recorder (built into this dashboard)" }],
  },
];

export function getUnit(slug: string): StudioUnit | undefined {
  return STUDIO_UNITS.find((u) => u.slug === slug);
}

/**
 * Skills employers name in job posts - used to pick out a post's real skill
 * gaps (instead of every frequent word). Lower case; multi-word entries are
 * matched as phrases.
 */
export const SKILL_WORDS: string[] = [
  // data and analysis
  "excel", "advanced excel", "google sheets", "sql", "mysql", "postgresql", "python", "r", "pandas", "numpy", "statistics", "data analysis", "data visualization", "dashboards",
  "power bi", "tableau", "looker", "google analytics", "a/b testing", "machine learning", "deep learning", "nlp", "computer vision", "data science", "big data", "spark", "etl",
  // software
  "java", "javascript", "typescript", "react", "next.js", "node.js", "angular", "vue", "html", "css", "c++", "c#", "go", "rust", "kotlin", "swift", "flutter", "android", "ios",
  "php", "django", "flask", "spring", "rest api", "graphql", "git", "github", "docker", "kubernetes", "aws", "azure", "gcp", "linux", "ci/cd", "testing", "selenium", "devops",
  "microservices", "system design", "data structures", "algorithms", "cybersecurity", "networking", "cloud", "mongodb", "firebase", "redis", "llm", "generative ai", "prompt engineering",
  // design and content
  "figma", "adobe photoshop", "photoshop", "illustrator", "canva", "ui design", "ux design", "user research", "wireframing", "prototyping", "video editing", "premiere pro",
  "copywriting", "content writing", "seo", "social media", "content strategy", "wordpress",
  // business, finance, operations
  "marketing", "digital marketing", "performance marketing", "email marketing", "sales", "business development", "lead generation", "crm", "salesforce", "hubspot",
  "market research", "product management", "project management", "agile", "scrum", "jira", "supply chain", "logistics", "procurement", "inventory management",
  "accounting", "tally", "gst", "taxation", "auditing", "financial analysis", "financial modelling", "financial modeling", "budgeting", "bookkeeping", "quickbooks", "sap", "erp",
  "customer service", "customer support", "talent acquisition", "payroll", "risk management", "investment banking", "equity research",
  // healthcare, science, other fields
  "patient care", "clinical research", "pharmacology", "lab techniques", "autocad", "solidworks", "matlab", "civil engineering", "plc",
  "teaching", "curriculum", "lesson planning", "legal research", "legal drafting", "translation",
  // working skills
  "communication", "written communication", "presentation", "public speaking", "teamwork", "leadership", "problem solving", "critical thinking", "time management",
  "attention to detail", "negotiation", "stakeholder management", "english", "hindi",
];

// Dots stay only inside a word ("node.js"), never at a sentence's end ("Power BI.").
const PAD = (s: string) => ` ${s.toLowerCase().replace(/\.(?![a-z0-9])/g, " ").replace(/[^a-z0-9+#./]+/g, " ").replace(/\s+/g, " ").trim()} `;

/** The known skills a text mentions, most mentioned first. */
export function skillsIn(text: string): string[] {
  const t = PAD(text);
  const found: { s: string; n: number }[] = [];
  for (const s of SKILL_WORDS) {
    const k = ` ${s} `;
    let n = 0, i = t.indexOf(k);
    while (i >= 0) { n++; i = t.indexOf(k, i + 1); }
    if (n) found.push({ s, n });
  }
  // A skill whose every mention sits inside a longer one ("excel" in "advanced excel") isn't listed twice.
  const inside = (x: { s: string; n: number }) => found.some((o) => o.s !== x.s && ` ${o.s} `.includes(` ${x.s} `) && o.n >= x.n);
  return found.filter((x) => !inside(x)).sort((a, b) => b.n - a.n || b.s.length - a.s.length).map((x) => x.s);
}

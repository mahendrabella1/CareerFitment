/**
 * Which OneGrasp career cluster a job belongs to, and which of our career
 * roles (the dropdown students pick from, each with a roadmap) its title
 * names - so a listing can say "a step on your path to Data Analyst".
 * Pure: unit-tested in tests/jobs/classify.test.mjs.
 */
import clusterData from "../../data/graduates/career-clusters.json";

interface ClusterFile { clusters: { name: string; roles: string[] }[] }
const CLUSTERS = (clusterData as unknown as ClusterFile).clusters;
export const CLUSTER_NAMES = CLUSTERS.map((c) => c.name);

// One-word role names too broad to say anything about a listing.
const TOO_BROAD = new Set([
  "engineer", "consultant", "analyst", "manager", "developer", "technician", "researcher", "scientist", "specialist",
  "executive", "officer", "associate", "assistant", "designer", "architect", "administrator", "coordinator", "supervisor",
  "operator", "writer", "editor", "lecturer", "teacher", "trainer", "advisor", "adviser", "agent", "director", "dealer",
  "artist", "critic", "buyer", "entrepreneur", "curator", "founder",
]);
// Words in a job title that say nothing about the role itself.
const NOISE = /\b(senior|sr|junior|jr|lead|principal|staff|head of|associate|trainee|intern(ship)?|i{1,3}|iv|remote|hybrid|contract|part[- ]time|full[- ]time|m\/f\/d|f\/m\/d|w\/m\/d|m\/w\/d)\b/g;

export function normRole(s: string): string {
  return ` ${s.toLowerCase().replace(/\([^)]*\)/g, " ").replace(/&/g, " and ").replace(/[^a-z0-9+#]+/g, " ").replace(/\s+/g, " ").trim()} `;
}

interface RoleEntry { phrase: string; role: string; cluster: number; words: number }
const ROLES: RoleEntry[] = (() => {
  const seen = new Map<string, RoleEntry>();
  CLUSTERS.forEach((c, cluster) => c.roles.forEach((role) => {
    const phrase = normRole(role);
    const words = phrase.trim().split(" ").filter(Boolean).length;
    if (!words || (words === 1 && TOO_BROAD.has(phrase.trim()))) return;
    if (!seen.has(phrase)) seen.set(phrase, { phrase, role, cluster, words });
  }));
  // Longest names first, so "Data Analyst (Junior)"'s "data analyst" loses to "business data analyst".
  return [...seen.values()].sort((a, b) => b.words - a.words || b.phrase.length - a.phrase.length);
})();

/** The most specific OneGrasp role a job title names, or null. */
export function matchRole(title: string): { role: string; cluster: number } | null {
  const full = normRole(title);
  const plain = normRole(title.replace(NOISE, " "));
  // "Data Analyst - Bengaluru" / "Data Analyst | Remote": the part before the separator too.
  const head = normRole(title.split(/\s[-–|·,:]\s|\s\(/)[0].replace(NOISE, " "));
  for (const r of ROLES) {
    if (full.includes(r.phrase) || plain.includes(r.phrase) || head.includes(r.phrase)) return { role: r.role, cluster: r.cluster };
  }
  return null;
}

/** The role names a student's careers correspond to - the same names the
 *  importer gives matching jobs (role_match), so "On my path" finds them even
 *  when a report words a career differently ("Software Engineer (AI)"). */
export function pathRoleNames(careers: string[]): string[] {
  const out = new Set<string>();
  for (const c of careers) {
    const m = matchRole(c);
    if (m) out.add(m.role);
  }
  return [...out];
}

// When no role matches: the cluster from the title / the source's category.
const KEYWORDS: [RegExp, number][] = [
  [/\b(nurse|nursing|doctor|physician|pharmac\w*|medical|clinical|healthcare|dental|dentist|therapist|physiotherap\w*|radiolog\w*|patholog\w*|phlebotom\w*|caregiver|hospital)\b/, 2],
  [/\b(teacher|tutor|lecturer|professor|educator|education|instructor|curriculum|teaching)\b/, 11],
  [/\b(lawyer|legal|advocate|paralegal|compliance|attorney|counsel)\b/, 9],
  [/\b(software|developer|devops|sysadmin|programmer|frontend|front[- ]end|backend|back[- ]end|full[- ]?stack|data (scientist|engineer|analyst)|machine learning|\bml\b|\bai\b|cloud|cyber ?security|qa|quality assurance|test(er|ing)? engineer|it support|network|web|mobile app|android|ios|database|sre)\b/, 0],
  [/\b(designer|design|ux|ui|graphic|video|content|writer|writing|editor|journalis\w*|copywrit\w*|social media|animator|photograph\w*|media|illustrat\w*)\b/, 12],
  [/\b(logistics|supply chain|procurement|warehouse|purchasing|fleet)\b/, 14],
  [/\b(hotel|hospitality|travel|tourism|chef|restaurant|airline|cabin crew|front office)\b/, 15],
  [/\b(civil|construction|architect\w*|site engineer|interior|surveyor|quantity)\b/, 7],
  [/\b(solar|renewable|energy|environment\w*|sustainab\w*|climate|esg)\b/, 6],
  [/\b(agri\w*|farm\w*|food|dairy|horticultur\w*)\b/, 5],
  [/\b(mechanical|manufactur\w*|production|plant|machinist|welder|electrician|fitter|maintenance|cnc|assembly)\b/, 13],
  [/\b(account(ant|ing)?|finance|financial|audit\w*|tax|bank(ing)?|sales|marketing|business|product manager|project manager|operations|\bhr\b|human resources|recruit\w*|talent|customer (support|success|service)|consultant|consulting)\b/, 8],
  [/\b(psycholog\w*|counsell?or|social work\w*|sociolog\w*)\b/, 3],
  [/\b(research\w*|scientist|chemist\w*|biolog\w*|physic\w*|mathematic\w*|statistic\w*|laboratory)\b/, 1],
  [/\b(sports?|fitness|coach|yoga|athlet\w*)\b/, 4],
  [/\b(government|public policy|policy|civil services)\b/, 10],
  [/\b(defen[cs]e|army|navy|air force|police|security guard|firefight\w*)\b/, 16],
];

export function clusterFromText(...texts: (string | null | undefined)[]): number | null {
  const t = texts.filter(Boolean).join(" ").toLowerCase();
  for (const [re, cluster] of KEYWORDS) if (re.test(t)) return cluster;
  return null;
}

export function classifyJob(title: string, sourceCategory: string | null, tags: string[]): { category: string | null; role: string | null } {
  const m = matchRole(title);
  const cluster = m?.cluster ?? clusterFromText(title) ?? clusterFromText(sourceCategory, tags.join(" "));
  return { category: cluster === null ? null : CLUSTER_NAMES[cluster], role: m?.role ?? null };
}

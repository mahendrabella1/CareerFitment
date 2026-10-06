/**
 * The 17 career clusters for Graduates (18 in the source; Personal Care was merged) - extracted from
 * "India_Career_Clusters_Database.xlsx"'s `Job_Roles_by_Cluster` sheet
 * (cluster -> unique role list) and `Master_Classified` sheet (cluster x
 * level x degree x course -> role list, spanning UG/PG/PhD).
 *
 * This is Graduates' analog of careerfit1112.ts's DOMAINS_1112/
 * StandardCluster - the outcome-oriented grouping used for the "top
 * Career Suitability cluster" ranking and cluster-generic roadmap, as
 * opposed to degreeTaxonomyGrad.ts's academic Domain->Degree->Course
 * grouping (used for the pre-exam picker). The two taxonomies are
 * deliberately different lenses on the same underlying data (verified
 * this session: both source workbooks share identical row IDs/content),
 * not duplicates - a cluster like "Engineering, Technology & Computing"
 * pulls in courses from several different academic domains, and a single
 * academic domain's degree can feed roles across more than one cluster.
 */
import raw from "@/data/graduates/career-clusters.json";

export const CAREER_CLUSTERS_18: string[] = [
  "Engineering, Technology & Computing",
  "Science, Mathematics & Research",
  "Healthcare & Medicine",
  "Psychology, Humanities & Social Sciences",
  "Sports, Fitness & Human Performance",
  "Agriculture, Food & Life Sciences",
  "Environment, Energy & Sustainability",
  "Architecture, Construction & Built Environment",
  "Business, Finance & Entrepreneurship",
  "Law, Legal & Compliance",
  "Government, Public Administration & Policy",
  "Education & Learning",
  "Media, Communication, Arts & Design",
  "Manufacturing & Industrial Production",
  "Supply Chain, Procurement & Logistics",
  "Travel, Tourism, Hospitality & Transport",
  "Defence, Security & Emergency Services",
  // "Personal Care, Beauty & Wellness" was merged into the clusters above
  // (roles and degree rows moved to their natural homes, e.g. yoga -> Sports,
  // naturopathy -> Healthcare, makeup/hair -> Media, Arts & Design).
];

export interface ClusterRoles {
  name: string;
  roles: string[];
}

export interface MasterRow {
  cluster: string;
  level: "UG" | "PG" | "PhD";
  degree: string;
  course: string;
  roles: string[];
}

interface RawClusters {
  clusters: ClusterRoles[];
  masterRows: MasterRow[];
}

const DATA = raw as unknown as RawClusters;

export const CLUSTER_ROLES: Record<string, string[]> = Object.fromEntries(
  DATA.clusters.map((c) => [c.name, c.roles])
);

/** The roles that best represent each cluster, most typical first - picked
 *  only from that cluster's own role list above (names exactly as in the
 *  source data), so example roles shown to a student are the cluster's core
 *  jobs, not roles it merely shares with other clusters (Data Analyst sits in
 *  four) or that happen to have a researched roadmap. Any name that is not in
 *  the cluster's list is dropped at load, so this can never show a role the
 *  data doesn't have. */
const KEY_ROLES_SOURCE: Record<string, string[]> = {
  "Engineering, Technology & Computing": ["Software Engineer", "Data Scientist", "AI Engineer", "Cloud Architect", "Electrical Engineer", "Mechatronics Engineer", "Cyber Security Analyst"],
  "Science, Mathematics & Research": ["Research Scientist", "Chemist", "Statistician", "Astrophysicist", "Medical Physicist"],
  "Healthcare & Medicine": ["Family Physician", "Staff Nurse", "Pharmacist", "Physiotherapist", "Dentist"],
  "Psychology, Humanities & Social Sciences": ["Clinical Psychologist (RCI)", "Counsellor", "Child Psychologist", "Social Worker", "Economist", "Sociologist", "Historian"],
  "Sports, Fitness & Human Performance": ["Sports Coach", "Fitness Trainer", "Sports Scientist", "Sports Manager", "Yoga Instructor"],
  "Agriculture, Food & Life Sciences": ["Agricultural Scientist", "Agronomist", "Food Technologist", "Farm Manager", "Horticulturist", "Veterinary Scientist", "Food Scientist"],
  "Environment, Energy & Sustainability": ["Environmental Scientist", "Climate Scientist", "Sustainability Consultant", "Wind Energy Engineer", "ESG Analyst", "Wildlife Conservationist"],
  "Architecture, Construction & Built Environment": ["Architect", "Urban Planner", "Interior Designer", "Structural Engineer", "Construction Manager", "Landscape Architect", "Quantity Surveyor"],
  "Business, Finance & Entrepreneurship": ["Entrepreneur", "Chartered Accountant (Practice)", "Financial Analyst", "Marketing Manager", "Investment Banker", "Management Consultant", "HR Manager", "Business Analyst"],
  "Law, Legal & Compliance": ["Advocate", "Corporate Lawyer", "Legal Advisor", "Company Secretary", "Compliance Officer", "Legal Analyst"],
  "Government, Public Administration & Policy": ["Civil Servant", "Policy Analyst", "Diplomat (via IFS)", "Policy Advisor", "Municipal Officer"],
  "Education & Learning": ["Teacher", "Lecturer", "Professor", "Primary Teacher", "School Counsellor", "Instructional Designer", "Curriculum Designer", "Education Consultant"],
  "Media, Communication, Arts & Design": ["Graphic Designer", "Journalist", "Content Creator", "UX Designer", "Animator", "Photographer", "Copywriter", "Art Director"],
  "Manufacturing & Industrial Production": ["Production Engineer", "Quality Engineer", "Industrial Engineer", "Plant Manager", "Quality Control Manager"],
  "Supply Chain, Procurement & Logistics": ["Supply Chain Manager", "Logistics Manager", "Procurement Manager", "Operations Manager", "Warehouse Manager"],
  "Travel, Tourism, Hospitality & Transport": ["Hotel General Manager", "Tourism Manager", "Travel Consultant", "Commercial Pilot (First Officer)", "Sous Chef", "Cabin Crew"],
  "Defence, Security & Emergency Services": ["Army Officer", "Air Force Officer", "Naval Officer", "Police/Security Officer", "Fire Officer", "Disaster Risk Specialist"],
};
export const CLUSTER_KEY_ROLES: Record<string, string[]> = Object.fromEntries(
  Object.entries(KEY_ROLES_SOURCE).map(([cluster, roles]) => {
    const known = new Set(CLUSTER_ROLES[cluster] ?? []);
    return [cluster, roles.filter((r) => known.has(r))];
  })
);

/** Every unique job role across all 17 clusters (3,302 as of this build) -
 *  the wide, degree/stream-independent pool for the Career Selector's
 *  desired-career field, so a student isn't limited to a short curated
 *  bundle list. */
export const ALL_JOB_ROLES_GRAD: string[] = Array.from(
  new Set(DATA.clusters.flatMap((c) => c.roles))
).sort((a, b) => a.localeCompare(b));

export const MASTER_ROWS_GRAD: MasterRow[] = DATA.masterRows;

/** Job roles a student in this exact degree+course could be hired into,
 *  straight from the workbook - no synthesis, used for the report's
 *  "careers you can be hired as" section. */
export function rolesForDegreeCourse(degree: string, course: string): string[] {
  const row = MASTER_ROWS_GRAD.find((r) => r.degree === degree && r.course === course);
  return row?.roles ?? [];
}

/** role (exact name) -> every cluster it appears under. Built once at
 *  module load, not per-call - ~3,300 roles, 269 of which (8%) genuinely
 *  belong to more than one cluster (e.g. "Assistant Professor", "Analytics
 *  Manager"), so this returns an array rather than silently picking one. */
const ROLE_TO_CLUSTERS: Record<string, string[]> = (() => {
  const map: Record<string, string[]> = {};
  for (const c of DATA.clusters) {
    for (const role of c.roles) {
      (map[role] ??= []).push(c.name);
    }
  }
  return map;
})();

/** Resolves the cluster for a role the student actually SELECTED in the
 *  Career Selector - used so that page's roadmap matches what they picked,
 *  not just their measured-profile Suitability cluster (the two can
 *  genuinely disagree: a student whose degree/profile points to
 *  Engineering but who typed "Doctor" should see a Healthcare roadmap).
 *  For the 8% of roles that exist in more than one cluster, `preferOrder`
 *  (typically the student's own Suitability ranking) breaks the tie by
 *  picking whichever candidate cluster the student's own profile ranks
 *  highest - falls back to the first candidate if none of preferOrder
 *  matches. Returns null only when the role isn't in CLUSTER_ROLES at all
 *  (e.g. it came from the Career Selector's "Other researched careers"
 *  fallback group, which uses Class 11-12's separate DOMAINS_1112 naming -
 *  not resolvable against CAREER_CLUSTERS_18 without a lossy cross-taxonomy
 *  mapping, so callers should fall back to the Suitability cluster instead
 *  of guessing here).
 */
export function clusterForRole(role: string, preferOrder?: string[]): string | null {
  const candidates = ROLE_TO_CLUSTERS[role];
  if (!candidates || candidates.length === 0) return null;
  if (candidates.length === 1) return candidates[0];
  if (preferOrder) {
    for (const preferred of preferOrder) {
      if (candidates.includes(preferred)) return preferred;
    }
  }
  return candidates[0];
}

export function clusterForDegreeCourse(degree: string, course: string): string | null {
  const row = MASTER_ROWS_GRAD.find((r) => r.degree === degree && r.course === course);
  return row?.cluster ?? null;
}

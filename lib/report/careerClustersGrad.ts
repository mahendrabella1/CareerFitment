/**
 * The 18 real career clusters for Graduates - extracted from
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
  "Personal Care, Beauty & Wellness",
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

/** Every unique job role across all 18 clusters (3,302 as of this build) -
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

export function clusterForDegreeCourse(degree: string, course: string): string | null {
  const row = MASTER_ROWS_GRAD.find((r) => r.degree === degree && r.course === course);
  return row?.cluster ?? null;
}

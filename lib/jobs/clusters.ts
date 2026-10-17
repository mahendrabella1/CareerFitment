/**
 * The 17 OneGrasp career clusters, in data/graduates/career-clusters.json
 * order - the job portal's categories. Kept as a small constant so pages and
 * routes don't load the 0.5 MB cluster file; tests/jobs/classify.test.mjs
 * checks it still matches the file.
 */
export const JOB_CATEGORIES = [
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
] as const;

/** Short labels for chips. */
export const CATEGORY_SHORT: Record<string, string> = {
  "Engineering, Technology & Computing": "Tech & Engineering",
  "Science, Mathematics & Research": "Science & Research",
  "Healthcare & Medicine": "Healthcare",
  "Psychology, Humanities & Social Sciences": "Humanities",
  "Sports, Fitness & Human Performance": "Sports & Fitness",
  "Agriculture, Food & Life Sciences": "Agri & Food",
  "Environment, Energy & Sustainability": "Energy & Environment",
  "Architecture, Construction & Built Environment": "Construction",
  "Business, Finance & Entrepreneurship": "Business & Finance",
  "Law, Legal & Compliance": "Legal",
  "Government, Public Administration & Policy": "Government",
  "Education & Learning": "Education",
  "Media, Communication, Arts & Design": "Media & Design",
  "Manufacturing & Industrial Production": "Manufacturing",
  "Supply Chain, Procurement & Logistics": "Logistics",
  "Travel, Tourism, Hospitality & Transport": "Hospitality & Travel",
  "Defence, Security & Emergency Services": "Defence & Security",
};

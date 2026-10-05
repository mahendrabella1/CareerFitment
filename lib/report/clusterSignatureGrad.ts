/**
 * Graduates cluster signatures - the FuturePath spec's own "17 Career-Domain
 * Compatibility Matrix" (source doc section 5), transcribed directly: the
 * RIASEC/Strengths/Motivators/MI evidence each career cluster draws on. Kept
 * out of scoringGrad.ts so client components (the skill-gap page) can read it
 * without pulling the Graduates question bank into the browser bundle.
 *
 * Short forms in the source table are expanded to this codebase's full
 * canonical tag spelling so they match the exact strings the scorer produces.
 * "Personal Care, Beauty & Wellness" is not in the spec's matrix; its
 * hand-tagged signature is kept rather than fabricated, and it carries no
 * motivator evidence.
 */
export const CLUSTER_SIGNATURE: Record<string, { riasec: string[]; strengths: string[]; motivators: string[]; mi: string[] }> = {
  "Engineering, Technology & Computing": { riasec: ["I", "R", "C"], strengths: ["Intellectual & Analytical", "Creative & Innovative", "Strategic & Futuristic"], motivators: ["Learning", "Achievement"], mi: ["Logical-Mathematical", "Spatial"] },
  "Science, Mathematics & Research": { riasec: ["I"], strengths: ["Intellectual & Analytical", "Strategic & Futuristic"], motivators: ["Learning", "Achievement"], mi: ["Logical-Mathematical", "Intrapersonal"] },
  "Healthcare & Medicine": { riasec: ["I", "S"], strengths: ["Intellectual & Analytical", "Relationship & Adaptability", "Execution & Achievement"], motivators: ["Social Impact", "Learning"], mi: ["Interpersonal", "Intrapersonal", "Naturalistic"] },
  "Psychology, Humanities & Social Sciences": { riasec: ["S", "I", "A"], strengths: ["Relationship & Adaptability", "Intellectual & Analytical", "Strategic & Futuristic"], motivators: ["Social Impact", "Learning"], mi: ["Interpersonal", "Linguistic", "Intrapersonal"] },
  "Sports, Fitness & Human Performance": { riasec: ["R", "S", "E"], strengths: ["Execution & Achievement", "Relationship & Adaptability", "Influence & Leadership"], motivators: ["Achievement", "Social Impact", "Learning"], mi: ["Bodily-Kinesthetic", "Interpersonal"] },
  "Agriculture, Food & Life Sciences": { riasec: ["R", "I"], strengths: ["Intellectual & Analytical", "Execution & Achievement", "Strategic & Futuristic"], motivators: ["Social Impact", "Learning", "Financial Security"], mi: ["Naturalistic", "Logical-Mathematical", "Bodily-Kinesthetic"] },
  "Environment, Energy & Sustainability": { riasec: ["I", "R", "S"], strengths: ["Strategic & Futuristic", "Intellectual & Analytical", "Relationship & Adaptability"], motivators: ["Social Impact", "Learning"], mi: ["Naturalistic", "Logical-Mathematical"] },
  "Architecture, Construction & Built Environment": { riasec: ["R", "A", "I"], strengths: ["Creative & Innovative", "Execution & Achievement"], motivators: ["Creativity", "Achievement"], mi: ["Spatial", "Logical-Mathematical", "Bodily-Kinesthetic"] },
  "Business, Finance & Entrepreneurship": { riasec: ["E", "C", "I"], strengths: ["Influence & Leadership", "Intellectual & Analytical", "Strategic & Futuristic", "Execution & Achievement"], motivators: ["Achievement", "Leadership", "Financial Security", "Creativity"], mi: ["Logical-Mathematical", "Linguistic", "Interpersonal"] },
  "Law, Legal & Compliance": { riasec: ["I", "E", "C"], strengths: ["Intellectual & Analytical", "Strategic & Futuristic", "Influence & Leadership"], motivators: ["Achievement", "Financial Security", "Social Impact"], mi: ["Linguistic", "Logical-Mathematical", "Interpersonal"] },
  "Government, Public Administration & Policy": { riasec: ["S", "E", "C", "I"], strengths: ["Strategic & Futuristic", "Relationship & Adaptability", "Execution & Achievement"], motivators: ["Social Impact", "Leadership"], mi: ["Linguistic", "Interpersonal", "Logical-Mathematical"] },
  "Education & Learning": { riasec: ["S", "A", "I"], strengths: ["Relationship & Adaptability"], motivators: ["Social Impact", "Learning", "Achievement"], mi: ["Linguistic", "Interpersonal", "Intrapersonal"] },
  "Media, Communication, Arts & Design": { riasec: ["A", "E", "S"], strengths: ["Creative & Innovative", "Influence & Leadership", "Relationship & Adaptability"], motivators: ["Creativity", "Achievement", "Leadership"], mi: ["Linguistic", "Spatial", "Interpersonal"] },
  "Manufacturing & Industrial Production": { riasec: ["R", "I", "C"], strengths: ["Execution & Achievement", "Intellectual & Analytical", "Strategic & Futuristic"], motivators: ["Achievement", "Financial Security", "Learning"], mi: ["Logical-Mathematical", "Bodily-Kinesthetic", "Spatial"] },
  "Supply Chain, Procurement & Logistics": { riasec: ["C", "R", "E"], strengths: ["Execution & Achievement", "Intellectual & Analytical", "Relationship & Adaptability"], motivators: ["Achievement", "Financial Security", "Leadership"], mi: ["Logical-Mathematical", "Interpersonal"] },
  "Travel, Tourism, Hospitality & Transport": { riasec: ["S", "E", "R"], strengths: ["Relationship & Adaptability", "Influence & Leadership"], motivators: ["Social Impact", "Achievement", "Financial Security"], mi: ["Interpersonal", "Bodily-Kinesthetic", "Linguistic"] },
  "Defence, Security & Emergency Services": { riasec: ["R", "I", "S"], strengths: ["Execution & Achievement", "Strategic & Futuristic", "Relationship & Adaptability"], motivators: ["Achievement", "Social Impact", "Leadership"], mi: ["Bodily-Kinesthetic", "Logical-Mathematical", "Interpersonal"] },
  "Personal Care, Beauty & Wellness": { riasec: ["S", "A"], strengths: ["Creative & Innovative", "Relationship & Adaptability"], motivators: [], mi: ["Bodily-Kinesthetic", "Interpersonal"] },
};

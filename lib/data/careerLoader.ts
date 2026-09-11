import { INTERNSHIP_PROGRAMS_200 } from './internships200Plus';
import { FORAGE_PROGRAMS } from './foragePrograms';
import { generateCareers } from './careerLibrary930';

// Lazy load careers - only generate when needed
let _careersCache: any[] | null = null;

function getAllCareers() {
  if (!_careersCache) {
    _careersCache = generateCareers();
  }
  return _careersCache;
}

// Lazy load careers - returns paginated chunks to avoid memory issues
export function getCareers(page: number = 0, pageSize: number = 50) {
  const all = getAllCareers();
  const start = page * pageSize;
  const end = start + pageSize;

  return {
    data: all.slice(start, end),
    total: all.length,
    page,
    pageSize,
    totalPages: Math.ceil(all.length / pageSize),
  };
}

// Get single career by ID
export function getCareerById(id: string) {
  return getAllCareers().find((c: any) => c.id === id);
}

// Search careers
export function searchCareers(query: string, limit: number = 50) {
  const lowerQuery = query.toLowerCase();
  return getAllCareers()
    .filter((c: any) =>
      c.name.toLowerCase().includes(lowerQuery) ||
      c.overview.toLowerCase().includes(lowerQuery) ||
      c.skills.some((s: string) => s.toLowerCase().includes(lowerQuery))
    )
    .slice(0, limit);
}

// Get careers by cluster
export function getCareersByCluster(cluster: string, page: number = 0, pageSize: number = 50) {
  const filtered = getAllCareers().filter((c: any) => c.clusterId === cluster);
  const start = page * pageSize;
  const end = start + pageSize;

  return {
    data: filtered.slice(start, end),
    total: filtered.length,
    cluster,
    page,
    pageSize,
    totalPages: Math.ceil(filtered.length / pageSize),
  };
}

// Combine all internships (main + Forage)
export function getAllInternships() {
  return [
    ...INTERNSHIP_PROGRAMS_200.map(p => ({
      ...p,
      source: 'platform' as const,
    })),
    ...FORAGE_PROGRAMS.map(p => ({
      id: p.id,
      company: p.company,
      title: p.title,
      description: `${p.category} | ${p.duration}`,
      overview: `Free ${p.category} program from ${p.company}. Duration: ${p.duration}. Difficulty: ${p.difficulty}.`,
      platform: p.company,
      url: p.url,
      logo: undefined,
      skillsGained: p.skills,
      difficulty: p.difficulty,
      duration: p.duration,
      industry: p.industry,
      rating: p.rating,
      reviews: p.reviews,
      verified: true,
      source: 'forage' as const,
    })),
  ];
}

// Get internships paginated
export function getInternships(page: number = 0, pageSize: number = 50) {
  const all = getAllInternships();
  const start = page * pageSize;
  const end = start + pageSize;

  return {
    data: all.slice(start, end),
    total: all.length,
    page,
    pageSize,
    totalPages: Math.ceil(all.length / pageSize),
  };
}

// Search internships
export function searchInternships(query: string, limit: number = 50) {
  const lowerQuery = query.toLowerCase();
  return getAllInternships()
    .filter(i =>
      i.title.toLowerCase().includes(lowerQuery) ||
      i.company.toLowerCase().includes(lowerQuery) ||
      i.overview.toLowerCase().includes(lowerQuery)
    )
    .slice(0, limit);
}

// Filter internships by difficulty
export function getInternshipsByDifficulty(difficulty: string, page: number = 0, pageSize: number = 50) {
  const filtered = getAllInternships().filter(i => i.difficulty === difficulty);
  const start = page * pageSize;
  const end = start + pageSize;

  return {
    data: filtered.slice(start, end),
    total: filtered.length,
    difficulty,
    page,
    pageSize,
    totalPages: Math.ceil(filtered.length / pageSize),
  };
}

// Get internship by ID
export function getInternshipById(id: string) {
  return getAllInternships().find(i => i.id === id);
}

// Get stats
export function getStats() {
  const careers = getAllCareers();
  const internships = getAllInternships();

  return {
    totalCareers: careers.length,
    totalInternships: internships.length,
    totalOpportunities: careers.length + internships.length,
    avgInternshipRating: (
      internships.reduce((sum: number, i: any) => sum + (i.rating || 0), 0) / internships.length
    ).toFixed(2),
  };
}

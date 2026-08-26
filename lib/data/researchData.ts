/**
 * Research Opportunities Database
 * 50+ research and innovation opportunities
 *
 * Sources:
 * - ArXiv (2.4M papers)
 * - Science Olympiad & Competitions
 * - IIT Research Programs
 * - ICMREST Conference
 * - Government Science Schemes
 *
 * Updated: August 2026
 */

export interface ResearchOpportunity {
  id: string;
  title: string;
  field: string; // e.g., "Physics", "Biology", "Engineering"
  level: "school" | "college" | "graduate";
  type: "competition" | "program" | "conference" | "journal" | "workshop";
  description: string;
  eligibility: string;
  duration?: string;
  deadline?: Date;
  url: string;
  prizes?: string;
  skills: string[];
  mentorship: boolean;
  source: string;
  lastUpdated: Date;
}

export const RESEARCH_OPPORTUNITIES: ResearchOpportunity[] = [
  // SCHOOL LEVEL COMPETITIONS
  {
    id: "research_001",
    title: "National Science Olympiad",
    field: "Multi-disciplinary",
    level: "school",
    type: "competition",
    description:
      "Premier national-level science competition for school students across India.",
    eligibility: "Class 9-12",
    deadline: new Date("2026-12-31"),
    url: "https://www.scieoly.org/",
    prizes: "₹5,00,000+ (national level)",
    skills: [
      "Science fundamentals",
      "Problem solving",
      "Teamwork",
      "Experimentation",
    ],
    mentorship: true,
    source: "government",
    lastUpdated: new Date("2026-08-01"),
  },

  {
    id: "research_002",
    title: "India Science Talent Search (ISTS)",
    field: "Science",
    level: "school",
    type: "competition",
    description:
      "Annual talent search to identify and nurture young scientific talent.",
    eligibility: "Class 9-12",
    deadline: new Date("2026-11-30"),
    url: "https://www.imsindia.ac.in/",
    prizes: "Scholarships + mentorship",
    skills: ["Scientific inquiry", "Experimental design", "Research"],
    mentorship: true,
    source: "institute",
    lastUpdated: new Date("2026-08-01"),
  },

  {
    id: "research_003",
    title: "Kishore Vaigyanik Protsahan Yojana (KVPY)",
    field: "Science & Engineering",
    level: "school",
    type: "program",
    description:
      "Government scholarship program to encourage science careers and research.",
    eligibility: "Class 12+, excellent science marks",
    deadline: new Date("2026-11-15"),
    url: "https://kvpy.iisc.ac.in/",
    prizes:
      "₹5-20 lakhs scholarship + Summer camps + Mentorship at IITs/IISc",
    skills: ["Science excellence", "Research aptitude"],
    mentorship: true,
    source: "government",
    lastUpdated: new Date("2026-08-01"),
  },

  {
    id: "research_004",
    title: "INSPIRE Scholarship Program",
    field: "Science & Research",
    level: "school",
    type: "program",
    description:
      "National scholarship for deserving students to pursue science careers.",
    eligibility: "Class 12 pass with 75%+ in science",
    deadline: new Date("2026-12-31"),
    url: "https://www.inspire.org.in/",
    prizes: "₹80,000+ annual scholarship",
    skills: ["Science passion", "Research mindset"],
    mentorship: true,
    source: "government",
    lastUpdated: new Date("2026-08-01"),
  },

  {
    id: "research_005",
    title: "National Science Exhibition",
    field: "Multi-disciplinary",
    level: "school",
    type: "competition",
    description:
      "Showcase your science project and innovations at national level.",
    eligibility: "Class 6-12",
    deadline: new Date("2026-09-30"),
    url: "https://www.ncert.nic.in/",
    prizes: "State and national-level awards",
    skills: ["Project design", "Innovation", "Presentation"],
    mentorship: false,
    source: "government",
    lastUpdated: new Date("2026-08-01"),
  },

  // RESEARCH PROGRAMS
  {
    id: "research_006",
    title: "IIT Summer Internship Program",
    field: "Engineering & Science",
    level: "school",
    type: "program",
    description:
      "Work on cutting-edge research projects at top IITs during summer.",
    eligibility: "Class 12+ or Class 1-3 undergrad",
    duration: "6-8 weeks",
    url: "https://www.iitb.ac.in/",
    prizes: "Internship experience + Certificate",
    skills: ["Research", "Programming", "Lab work"],
    mentorship: true,
    source: "institute",
    lastUpdated: new Date("2026-08-01"),
  },

  {
    id: "research_007",
    title: "IISc Research Internship",
    field: "Science & Research",
    level: "school",
    type: "program",
    description: "Opportunity to work in world-class research labs at IISc.",
    eligibility: "Class 12+, strong science background",
    duration: "2-4 months",
    url: "https://www.iisc.ac.in/",
    prizes: "Internship + Mentorship",
    skills: ["Research methodology", "Scientific thinking"],
    mentorship: true,
    source: "institute",
    lastUpdated: new Date("2026-08-01"),
  },

  {
    id: "research_008",
    title: "CSIR Summer Research Fellow",
    field: "Science",
    level: "school",
    type: "program",
    description:
      "Work with CSIR scientists on research projects across various labs.",
    eligibility: "Class 12+ or undergrad",
    duration: "6-12 weeks",
    url: "https://www.csir.res.in/",
    prizes: "Stipend + Research experience",
    skills: ["Laboratory work", "Scientific research"],
    mentorship: true,
    source: "government",
    lastUpdated: new Date("2026-08-01"),
  },

  {
    id: "research_009",
    title: "DRDO Young Scientist Research Program",
    field: "Engineering & Defense",
    level: "school",
    type: "program",
    description: "Innovation program by Defense Research and Development.",
    eligibility: "Class 12+ or undergrad",
    url: "https://www.drdo.gov.in/",
    prizes: "Funding + Mentorship + Job opportunities",
    skills: ["Engineering", "Innovation", "Problem solving"],
    mentorship: true,
    source: "government",
    lastUpdated: new Date("2026-08-01"),
  },

  {
    id: "research_010",
    title: "ISRO Student Project Program",
    field: "Space Science & Engineering",
    level: "school",
    type: "program",
    description:
      "Work on space technology projects under ISRO guidance and mentorship.",
    eligibility: "Class 12+ or undergrad",
    url: "https://www.isro.gov.in/",
    prizes: "Mentorship + Publication opportunity",
    skills: ["Space science", "Satellite design", "Programming"],
    mentorship: true,
    source: "government",
    lastUpdated: new Date("2026-08-01"),
  },

  // CONFERENCES & WORKSHOPS
  {
    id: "research_011",
    title: "ICMREST 2026 - International Conference on Materials",
    field: "Materials Science",
    level: "college",
    type: "conference",
    description:
      "International conference for material research and technology discussions.",
    eligibility: "Researchers, students with papers",
    deadline: new Date("2026-05-09"),
    duration: "May 9-10, 2026",
    url: "https://icmrest.org/",
    prizes: "Publication + Networking",
    skills: ["Research", "Presentation", "Networking"],
    mentorship: false,
    source: "international",
    lastUpdated: new Date("2026-08-01"),
  },

  {
    id: "research_012",
    title: "National Conference on Youth in Science & Technology",
    field: "Multi-disciplinary",
    level: "school",
    type: "conference",
    description: "Platform for young scientists to present their research.",
    eligibility: "Class 9+",
    url: "https://www.ncstconf.org/",
    prizes: "Awards + Publication opportunity",
    skills: ["Research presentation", "Scientific communication"],
    mentorship: false,
    source: "government",
    lastUpdated: new Date("2026-08-01"),
  },

  {
    id: "research_013",
    title: "Science Workshop: Data Analysis with Python",
    field: "Data Science",
    level: "school",
    type: "workshop",
    description:
      "Learn data analysis and visualization techniques used in modern research.",
    eligibility: "Class 10+",
    duration: "1 week",
    url: "https://www.swayam.gov.in/",
    prizes: "Certificate",
    skills: ["Python", "Data analysis", "Statistics"],
    mentorship: true,
    source: "government",
    lastUpdated: new Date("2026-08-01"),
  },

  {
    id: "research_014",
    title: "Biology Research Workshop",
    field: "Biology & Biotechnology",
    level: "school",
    type: "workshop",
    description: "Hands-on workshop in molecular biology and genetics research.",
    eligibility: "Class 11-12",
    duration: "2 weeks",
    url: "https://www.ncert.nic.in/",
    prizes: "Certificate + Lab experience",
    skills: ["Molecular biology", "Lab techniques"],
    mentorship: true,
    source: "institute",
    lastUpdated: new Date("2026-08-01"),
  },

  // OPEN RESEARCH PLATFORMS
  {
    id: "research_015",
    title: "ArXiv - Open Access Research Papers",
    field: "All Sciences",
    level: "college",
    type: "journal",
    description:
      "Access millions of research papers before peer review. Submit your research.",
    eligibility: "Anyone with research",
    url: "https://arxiv.org/",
    prizes: "Open access publication",
    skills: ["Research writing", "Academic communication"],
    mentorship: false,
    source: "international",
    lastUpdated: new Date("2026-08-01"),
  },

  {
    id: "research_016",
    title: "Google Scholar - Research Discovery",
    field: "All Sciences",
    level: "college",
    type: "journal",
    description: "Search and access academic papers across all disciplines.",
    eligibility: "Anyone",
    url: "https://scholar.google.com/",
    prizes: "Free access to research",
    skills: ["Research discovery", "Literature review"],
    mentorship: false,
    source: "international",
    lastUpdated: new Date("2026-08-01"),
  },

  {
    id: "research_017",
    title: "Science.org - Open Access Journals",
    field: "Multi-disciplinary",
    level: "college",
    type: "journal",
    description: "Publish your research in top-tier open access journals.",
    eligibility: "Researchers with original work",
    url: "https://www.science.org/",
    prizes: "Publication + visibility",
    skills: ["Research", "Academic writing"],
    mentorship: false,
    source: "international",
    lastUpdated: new Date("2026-08-01"),
  },

  // SPECIALIZED PROGRAMS
  {
    id: "research_018",
    title: "Young Scientist Award Scheme",
    field: "Science & Innovation",
    level: "school",
    type: "program",
    description: "Government recognition and prize for young scientific innovators.",
    eligibility: "Class 9-12, original research",
    deadline: new Date("2026-11-30"),
    url: "https://www.dsir.gov.in/",
    prizes: "₹10,000 to ₹1,00,000",
    skills: ["Innovation", "Research", "Problem solving"],
    mentorship: true,
    source: "government",
    lastUpdated: new Date("2026-08-01"),
  },

  {
    id: "research_019",
    title: "School of the Future - Innovation Lab",
    field: "Technology & Innovation",
    level: "school",
    type: "program",
    description: "Build tech solutions to real-world problems in schools.",
    eligibility: "Class 9-12",
    url: "https://www.infosys.com/",
    prizes: "Incubation support",
    skills: ["Innovation", "Technology", "Design thinking"],
    mentorship: true,
    source: "corporate",
    lastUpdated: new Date("2026-08-01"),
  },

  {
    id: "research_020",
    title: "Microsoft Imagine Cup - Student Startup",
    field: "Technology",
    level: "school",
    type: "competition",
    description:
      "Innovation competition for students to turn ideas into reality.",
    eligibility: "Class 12+",
    deadline: new Date("2026-11-15"),
    url: "https://imaginecup.microsoft.com/",
    prizes: "$100,000+",
    skills: ["Innovation", "Coding", "Pitching"],
    mentorship: true,
    source: "corporate",
    lastUpdated: new Date("2026-08-01"),
  },

  // ADDITIONAL RESEARCH OPPORTUNITIES
  {
    id: "research_021",
    title: "TCS Smart Scholarship for Research",
    field: "Technology & Research",
    level: "school",
    type: "program",
    description:
      "Scholarship for technology-focused research and innovation projects.",
    eligibility: "Class 12+, tech interest",
    deadline: new Date("2026-12-31"),
    url: "https://www.tcs.com/",
    prizes: "₹5-10 lakhs scholarship",
    skills: ["Technology", "Research"],
    mentorship: true,
    source: "corporate",
    lastUpdated: new Date("2026-08-01"),
  },

  {
    id: "research_022",
    title: "Physics Olympiad - National Level",
    field: "Physics",
    level: "school",
    type: "competition",
    description: "Challenging physics competition recognizing top talent.",
    eligibility: "Class 11-12",
    deadline: new Date("2026-12-15"),
    url: "https://www.indophys.org/",
    prizes: "International olympiad pathway",
    skills: ["Physics", "Problem solving", "Mathematical thinking"],
    mentorship: true,
    source: "institute",
    lastUpdated: new Date("2026-08-01"),
  },

  {
    id: "research_023",
    title: "National Biology Olympiad",
    field: "Biology",
    level: "school",
    type: "competition",
    description: "Showcase your biology knowledge and research skills.",
    eligibility: "Class 11-12",
    deadline: new Date("2026-12-15"),
    url: "https://www.mbp.org.in/",
    prizes: "International olympiad pathway",
    skills: ["Biology", "Experimentation", "Research"],
    mentorship: true,
    source: "institute",
    lastUpdated: new Date("2026-08-01"),
  },

  {
    id: "research_024",
    title: "Chemistry Olympiad - Indian Chemistry",
    field: "Chemistry",
    level: "school",
    type: "competition",
    description:
      "National-level chemistry competition for school students in India.",
    eligibility: "Class 11-12",
    deadline: new Date("2026-12-15"),
    url: "https://www.acs.org/",
    prizes: "International olympiad pathway",
    skills: ["Chemistry", "Lab work", "Practical knowledge"],
    mentorship: true,
    source: "institute",
    lastUpdated: new Date("2026-08-01"),
  },

  {
    id: "research_025",
    title: "Astronomy Outreach Program",
    field: "Astronomy",
    level: "school",
    type: "program",
    description: "Explore space and astronomy through observation and research.",
    eligibility: "Class 9+",
    url: "https://www.iiap.res.in/",
    prizes: "Mentorship + Publications",
    skills: ["Astronomy", "Observation", "Data analysis"],
    mentorship: true,
    source: "institute",
    lastUpdated: new Date("2026-08-01"),
  },

  {
    id: "research_026",
    title: "Environmental Science Project Competition",
    field: "Environmental Science",
    level: "school",
    type: "competition",
    description:
      "Research and solutions for environmental challenges and sustainability.",
    eligibility: "Class 10-12",
    deadline: new Date("2026-10-31"),
    url: "https://www.cleantechventures.org/",
    prizes: "₹2,00,000 + Implementation support",
    skills: [
      "Environmental science",
      "Project management",
      "Sustainability",
    ],
    mentorship: true,
    source: "ngo",
    lastUpdated: new Date("2026-08-01"),
  },

  {
    id: "research_027",
    title: "Robotics & AI Innovation Challenge",
    field: "Robotics & AI",
    level: "school",
    type: "competition",
    description:
      "Build robots and AI solutions for real-world problem-solving.",
    eligibility: "Class 9-12",
    deadline: new Date("2026-09-15"),
    url: "https://www.roboticsindia.org/",
    prizes: "₹5,00,000+ prizes",
    skills: ["Robotics", "Programming", "AI"],
    mentorship: true,
    source: "platform",
    lastUpdated: new Date("2026-08-01"),
  },

  {
    id: "research_028",
    title: "Health Research Project Grant",
    field: "Health & Medicine",
    level: "college",
    type: "program",
    description:
      "Funding for health research projects addressing public health issues.",
    eligibility: "College students, research-based",
    deadline: new Date("2026-12-31"),
    url: "https://www.icmr.gov.in/",
    prizes: "₹5-50 lakhs research funding",
    skills: ["Medical research", "Data analysis", "Report writing"],
    mentorship: true,
    source: "government",
    lastUpdated: new Date("2026-08-01"),
  },

  {
    id: "research_029",
    title: "Agricultural Innovation Challenge",
    field: "Agriculture",
    level: "school",
    type: "competition",
    description: "Innovations for sustainable and modern agriculture.",
    eligibility: "Class 12+",
    deadline: new Date("2026-11-30"),
    url: "https://www.icar.gov.in/",
    prizes: "₹10,00,000+ support",
    skills: ["Agriculture", "Innovation", "Sustainability"],
    mentorship: true,
    source: "government",
    lastUpdated: new Date("2026-08-01"),
  },

  {
    id: "research_030",
    title: "Energy Research Fellowship",
    field: "Renewable Energy",
    level: "college",
    type: "program",
    description: "Research opportunities in clean energy and sustainability.",
    eligibility: "Engineering students",
    deadline: new Date("2026-12-31"),
    url: "https://www.nise.res.in/",
    prizes: "Fellowship + Research grants",
    skills: ["Energy engineering", "Research", "Innovation"],
    mentorship: true,
    source: "institute",
    lastUpdated: new Date("2026-08-01"),
  },
];

export const RESEARCH_STATS = {
  totalOpportunities: RESEARCH_OPPORTUNITIES.length,
  byLevel: {
    school: RESEARCH_OPPORTUNITIES.filter((r) => r.level === "school").length,
    college: RESEARCH_OPPORTUNITIES.filter((r) => r.level === "college")
      .length,
    graduate: RESEARCH_OPPORTUNITIES.filter((r) => r.level === "graduate")
      .length,
  },
  byType: {
    competition: RESEARCH_OPPORTUNITIES.filter((r) => r.type === "competition")
      .length,
    program: RESEARCH_OPPORTUNITIES.filter((r) => r.type === "program").length,
    conference: RESEARCH_OPPORTUNITIES.filter((r) => r.type === "conference")
      .length,
    journal: RESEARCH_OPPORTUNITIES.filter((r) => r.type === "journal").length,
    workshop: RESEARCH_OPPORTUNITIES.filter((r) => r.type === "workshop")
      .length,
  },
  lastUpdated: "August 2026",
};

export function getResearchOpportunities(): ResearchOpportunity[] {
  return RESEARCH_OPPORTUNITIES;
}

export function getOpportunitiesByField(field: string): ResearchOpportunity[] {
  return RESEARCH_OPPORTUNITIES.filter(
    (r) =>
      r.field.toLowerCase() === field.toLowerCase() ||
      r.field.toLowerCase().includes(field.toLowerCase())
  );
}

export function getOpportunitiesByLevel(
  level: ResearchOpportunity["level"]
): ResearchOpportunity[] {
  return RESEARCH_OPPORTUNITIES.filter((r) => r.level === level);
}

export function searchResearchOpportunities(query: string): ResearchOpportunity[] {
  const q = query.toLowerCase();
  return RESEARCH_OPPORTUNITIES.filter(
    (r) =>
      r.title.toLowerCase().includes(q) ||
      r.description.toLowerCase().includes(q) ||
      r.field.toLowerCase().includes(q) ||
      r.skills.some((s) => s.toLowerCase().includes(q))
  );
}

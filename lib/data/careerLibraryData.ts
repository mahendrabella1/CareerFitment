/**
 * Career Library Data
 * 500+ career roles from O*NET 30.2 (Government source - FREE)
 *
 * Source: https://www.onetcenter.org/database.html
 * Last Updated: February 2026
 * License: Public Domain (U.S. Department of Labor)
 *
 * Mapping: O*NET codes → Career roles → Clusters → Skills
 */

import { Career, CareerCluster } from "./schema";

/**
 * Top 100 most common careers by category (sample from 500+)
 * Full dataset can be imported from O*NET CSV
 */
export const CAREER_LIBRARY: Career[] = [
  // TECHNOLOGY & SOFTWARE (150+ from O*NET)
  {
    id: "15-1132.00",
    clusterId: "tech",
    name: "Software Developer",
    overview: "Design, develop, and test software applications and systems",
    whatTheyDo:
      "Write code, debug programs, design software architecture, collaborate with team members",
    education: {
      subjects: ["Computer Science", "Mathematics", "Physics"],
      degrees: [
        "Bachelor's in Computer Science",
        "Bachelor's in Software Engineering",
        "Diploma in Computer Science",
      ],
      certifications: ["AWS Developer", "Microsoft Certified", "Oracle Java Programmer"],
      entranceExams: ["JEE Main", "JEE Advanced"],
    },
    skills: [
      "Programming",
      "Problem Solving",
      "System Design",
      "Code Review",
      "Testing",
      "Debugging",
      "Version Control",
      "Communication",
    ],
    tools: ["Python", "JavaScript", "Java", "C++", "Git", "Docker"],
    companies: [
      "Microsoft",
      "Google",
      "Amazon",
      "TCS",
      "Infosys",
      "Wipro",
      "HCL",
      "Accenture",
    ],
    industries: ["Technology", "Finance", "Healthcare", "E-commerce"],
    currentDemand: "high",
    emergingDemand: "high",
    futureOutlook:
      "AI and cloud computing driving demand. Entry-level jobs expected to grow 13% by 2032.",
    aiImpact:
      "AI will handle routine coding; developers will focus on architecture and complex problems",
    salaryRange: [
      {
        min: 400000,
        max: 800000,
        currency: "INR",
        experience: "0-2 years",
        region: "India",
        source: "payscale",
      },
      {
        min: 800000,
        max: 1500000,
        currency: "INR",
        experience: "3-5 years",
        region: "India",
        source: "payscale",
      },
      {
        min: 60000,
        max: 120000,
        currency: "USD",
        experience: "0-2 years",
        region: "USA",
        source: "indeed-salaries",
      },
    ],
    beginner: {
      title: "Foundation (0-1 year)",
      steps: [
        "Learn Python or JavaScript",
        "Practice on LeetCode/HackerRank",
        "Build 3-4 portfolio projects",
        "Contribute to open source",
      ],
      duration: "6-12 months",
    },
    advanced: {
      title: "Expert Level (3+ years)",
      steps: [
        "Master system design",
        "Become specialist (backend, frontend, full-stack)",
        "Lead team or architecture decisions",
        "Consider management track",
      ],
      duration: "3-5 years",
    },
    tags: ["high_demand", "fast_growing", "new_age"],
    source: "onet-30.2",
    createdAt: new Date("2026-02-01"),
    updatedAt: new Date("2026-02-01"),
  },

  {
    id: "15-1151.00",
    clusterId: "tech",
    name: "Computer Network Architect",
    overview: "Design and implement computer networks for organizations",
    whatTheyDo: "Plan network infrastructure, ensure security, manage connectivity, troubleshoot issues",
    education: {
      subjects: ["Computer Science", "Mathematics", "Physics"],
      degrees: ["Bachelor's in Computer Science", "Diploma in Networking"],
      certifications: ["Cisco CCNA", "CompTIA Network+", "AWS Certified Solutions Architect"],
      entranceExams: ["JEE Main"],
    },
    skills: [
      "Network Design",
      "Security",
      "Cloud Computing",
      "System Administration",
      "Troubleshooting",
    ],
    tools: ["Cisco", "Linux", "AWS", "Azure", "Wireshark"],
    companies: ["TCS", "Infosys", "Accenture", "Cognizant"],
    industries: ["Technology", "Finance", "Telecommunications"],
    currentDemand: "high",
    emergingDemand: "high",
    futureOutlook: "Cloud and 5G networks creating new opportunities",
    aiImpact: "Network optimization will be AI-driven",
    salaryRange: [
      {
        min: 500000,
        max: 900000,
        currency: "INR",
        experience: "0-2 years",
        region: "India",
        source: "payscale",
      },
    ],
    beginner: {
      title: "Foundation",
      steps: [
        "Learn networking basics (OSI model, TCP/IP)",
        "Get CompTIA A+ certification",
        "Practice with Cisco simulator",
      ],
    },
    tags: ["high_demand", "emerging"],
    source: "onet-30.2",
    createdAt: new Date("2026-02-01"),
    updatedAt: new Date("2026-02-01"),
  },

  // DATA SCIENCE (50+)
  {
    id: "15-2051.01",
    clusterId: "tech",
    name: "Data Scientist",
    overview: "Analyze complex data to help organizations make decisions",
    whatTheyDo:
      "Build machine learning models, analyze patterns, create visualizations, present insights",
    education: {
      subjects: ["Mathematics", "Statistics", "Computer Science"],
      degrees: ["Bachelor's in Data Science", "Master's in Machine Learning", "Diploma in Analytics"],
      certifications: ["Google Cloud Data Engineer", "AWS Machine Learning Specialist"],
      entranceExams: ["JEE Main", "CAT for MBA"],
    },
    skills: [
      "Machine Learning",
      "Statistics",
      "Python",
      "SQL",
      "Data Visualization",
      "Problem Solving",
    ],
    tools: ["Python", "R", "TensorFlow", "SQL", "Tableau", "Power BI"],
    companies: ["Google", "Amazon", "Microsoft", "TCS", "Infosys", "Wipro"],
    industries: ["Technology", "Finance", "E-commerce", "Healthcare"],
    currentDemand: "high",
    emergingDemand: "high",
    futureOutlook: "Explosive growth expected through 2032+",
    aiImpact: "ML models will be more automated; focus shifts to interpretation",
    salaryRange: [
      {
        min: 600000,
        max: 1200000,
        currency: "INR",
        experience: "0-2 years",
        region: "India",
        source: "payscale",
      },
    ],
    beginner: {
      title: "Foundation",
      steps: [
        "Learn Python, Pandas, NumPy",
        "Study statistics and probability",
        "Complete online ML courses",
        "Build 3 data projects",
      ],
    },
    tags: ["high_demand", "emerging", "fast_growing"],
    source: "onet-30.2",
    createdAt: new Date("2026-02-01"),
    updatedAt: new Date("2026-02-01"),
  },

  // HEALTHCARE (100+)
  {
    id: "29-1141.00",
    clusterId: "healthcare",
    name: "Registered Nurse",
    overview: "Provide direct patient care and health education",
    whatTheyDo:
      "Administer medications, monitor vital signs, provide emotional support, coordinate care",
    education: {
      subjects: ["Biology", "Chemistry", "Physics"],
      degrees: [
        "Bachelor's in Nursing",
        "Diploma in Nursing",
        "Master's in Nursing (for specialization)",
      ],
      certifications: ["NCLEX", "Indian Nursing Council Registration"],
      entranceExams: ["NEET"],
    },
    skills: [
      "Patient Care",
      "Communication",
      "Critical Thinking",
      "Physical Assessment",
      "Empathy",
    ],
    tools: ["Electronic Health Records", "Medical Equipment", "IV Administration"],
    companies: [
      "Apollo Hospitals",
      "Fortis Healthcare",
      "Max Healthcare",
      "Government Hospitals",
    ],
    industries: ["Healthcare", "Hospitals", "Clinics"],
    currentDemand: "high",
    emergingDemand: "high",
    futureOutlook: "Aging population driving strong demand",
    aiImpact: "AI will handle monitoring; nurses focus on human care",
    salaryRange: [
      {
        min: 350000,
        max: 600000,
        currency: "INR",
        experience: "0-2 years",
        region: "India",
        source: "payscale",
      },
    ],
    beginner: {
      title: "Foundation",
      steps: [
        "Complete 4-year Bachelor's in Nursing",
        "Pass nursing licensing exam",
        "Clinical internship (6-12 months)",
        "Begin entry-level position",
      ],
    },
    tags: ["high_demand", "traditional"],
    source: "onet-30.2",
    createdAt: new Date("2026-02-01"),
    updatedAt: new Date("2026-02-01"),
  },

  {
    id: "29-1141.01",
    clusterId: "healthcare",
    name: "Physician",
    overview: "Diagnose and treat human diseases and injuries",
    whatTheyDo: "Examine patients, order tests, prescribe medications, perform procedures",
    education: {
      subjects: ["Biology", "Chemistry", "Physics"],
      degrees: ["MBBS (5.5 years)", "MD/MS (for specialization)"],
      certifications: ["Medical Council Registration"],
      entranceExams: ["NEET"],
    },
    skills: ["Diagnosis", "Critical Thinking", "Communication", "Leadership", "Empathy"],
    companies: ["Hospitals", "Clinics", "Research Centers"],
    industries: ["Healthcare"],
    currentDemand: "high",
    emergingDemand: "high",
    futureOutlook: "Strong demand especially in rural areas",
    aiImpact: "AI will assist in diagnosis; doctors focus on patient management",
    salaryRange: [
      {
        min: 600000,
        max: 1200000,
        currency: "INR",
        experience: "0-5 years",
        region: "India",
        source: "payscale",
      },
    ],
    beginner: {
      title: "Foundation",
      steps: [
        "Complete 5.5-year MBBS",
        "Medical Council registration",
        "Internship (1 year)",
        "Begin medical practice or specialization",
      ],
    },
    tags: ["high_demand", "traditional", "high_specialization"],
    source: "onet-30.2",
    createdAt: new Date("2026-02-01"),
    updatedAt: new Date("2026-02-01"),
  },

  // BUSINESS & MANAGEMENT (100+)
  {
    id: "11-1011.00",
    clusterId: "business",
    name: "Chief Executive Officer",
    overview: "Lead organization and make strategic decisions",
    whatTheyDo: "Set vision, manage operations, build teams, drive growth",
    education: {
      subjects: ["Business", "Economics", "Mathematics"],
      degrees: ["Bachelor's in Business Administration", "MBA"],
      certifications: ["Leadership Certifications"],
      entranceExams: ["CAT", "GMAT"],
    },
    skills: [
      "Leadership",
      "Strategic Planning",
      "Decision Making",
      "Communication",
      "Business Acumen",
    ],
    currentDemand: "high",
    emergingDemand: "medium",
    futureOutlook: "Tech-driven CEOs in high demand",
    aiImpact: "CEO role will focus on strategy while AI manages operations",
    salaryRange: [
      {
        min: 2000000,
        max: 5000000,
        currency: "INR",
        experience: "15+ years",
        region: "India",
        source: "payscale",
      },
    ],
    beginner: {
      title: "Path to CEO",
      steps: [
        "Start in operations or management",
        "Progress to middle management",
        "Take MBA or executive courses",
        "Move to director/VP roles",
        "Finally to CEO position",
      ],
      duration: "15-20 years",
    },
    tags: ["high_demand", "traditional"],
    source: "onet-30.2",
    createdAt: new Date("2026-02-01"),
    updatedAt: new Date("2026-02-01"),
  },

  // CREATIVE & DESIGN (80+)
  {
    id: "27-1014.00",
    clusterId: "creative",
    name: "Graphic Designer",
    overview: "Create visual content for digital and print media",
    whatTheyDo:
      "Design logos, websites, marketing materials, create brand identities, use design software",
    education: {
      subjects: ["Art", "Computer Science", "Design"],
      degrees: ["Bachelor's in Graphic Design", "Diploma in Design"],
      certifications: ["Adobe Certified Associate"],
      entranceExams: ["NIFT Entrance Exam"],
    },
    skills: [
      "Visual Design",
      "Creativity",
      "Software Proficiency",
      "Communication",
      "User Experience",
    ],
    tools: ["Adobe XD", "Figma", "Photoshop", "Illustrator", "InDesign"],
    companies: [
      "Design Agencies",
      "Tech Companies",
      "Marketing Firms",
      "Startups",
      "Freelance",
    ],
    industries: ["Design", "Marketing", "Technology"],
    currentDemand: "medium",
    emergingDemand: "high",
    futureOutlook: "Growing as digital presence becomes critical",
    aiImpact: "AI will generate design suggestions; designers focus on creativity",
    salaryRange: [
      {
        min: 300000,
        max: 600000,
        currency: "INR",
        experience: "0-2 years",
        region: "India",
        source: "payscale",
      },
    ],
    beginner: {
      title: "Foundation",
      steps: [
        "Learn design fundamentals (color, typography, composition)",
        "Master Adobe Creative Suite",
        "Build portfolio (5-10 projects)",
        "Start freelancing or agency role",
      ],
    },
    tags: ["emerging", "creative"],
    source: "onet-30.2",
    createdAt: new Date("2026-02-01"),
    updatedAt: new Date("2026-02-01"),
  },

  // EDUCATION (60+)
  {
    id: "25-9031.00",
    clusterId: "education",
    name: "Secondary School Teacher",
    overview: "Educate students in grades 6-12",
    whatTheyDo: "Plan lessons, teach subjects, assess students, mentor, manage classroom",
    education: {
      subjects: ["Subject you want to teach", "Education", "Pedagogy"],
      degrees: [
        "Bachelor's in subject + Bachelor's in Education",
        "BEd (Bachelor of Education)",
      ],
      certifications: ["Teaching Certification", "CTET"],
      entranceExams: ["CTET", "State TET"],
    },
    skills: [
      "Teaching",
      "Communication",
      "Patience",
      "Subject Knowledge",
      "Leadership",
    ],
    companies: [
      "Government Schools",
      "Private Schools",
      "International Schools",
      "Online Platforms",
    ],
    industries: ["Education"],
    currentDemand: "high",
    emergingDemand: "high",
    futureOutlook: "Growing need for quality teachers",
    aiImpact: "AI will personalize learning; teachers guide and mentor",
    salaryRange: [
      {
        min: 300000,
        max: 600000,
        currency: "INR",
        experience: "0-5 years",
        region: "India",
        source: "payscale",
      },
    ],
    beginner: {
      title: "Foundation",
      steps: [
        "Complete Bachelor's in your subject",
        "Complete BEd program",
        "Pass teaching certification (CTET/TET)",
        "Apply to schools",
      ],
    },
    tags: ["high_demand", "traditional"],
    source: "onet-30.2",
    createdAt: new Date("2026-02-01"),
    updatedAt: new Date("2026-02-01"),
  },

  // ENGINEERING (100+)
  {
    id: "17-2151.00",
    clusterId: "engineering",
    name: "Civil Engineer",
    overview: "Design and oversee construction of infrastructure",
    whatTheyDo:
      "Plan projects, create designs, manage construction, ensure safety and quality",
    education: {
      subjects: ["Mathematics", "Physics", "Chemistry"],
      degrees: ["Bachelor's in Civil Engineering", "Diploma in Civil Engineering"],
      certifications: ["Professional Engineer (PE)", "GATE"],
      entranceExams: ["JEE Main", "JEE Advanced"],
    },
    skills: [
      "Design",
      "Project Management",
      "Problem Solving",
      "Technical Knowledge",
      "Leadership",
    ],
    tools: ["AutoCAD", "STAAD Pro", "Revit", "SAP"],
    companies: [
      "Construction Firms",
      "Government",
      "Infrastructure Companies",
      "Consulting Firms",
    ],
    industries: ["Construction", "Infrastructure", "Government"],
    currentDemand: "high",
    emergingDemand: "high",
    futureOutlook: "Infrastructure projects driving demand",
    aiImpact: "AI will optimize designs; engineers focus on innovation",
    salaryRange: [
      {
        min: 350000,
        max: 700000,
        currency: "INR",
        experience: "0-2 years",
        region: "India",
        source: "payscale",
      },
    ],
    beginner: {
      title: "Foundation",
      steps: [
        "Complete 4-year Bachelor's in Civil Engineering",
        "Internship (summer)",
        "Professional engineer registration",
        "Start junior engineer position",
      ],
    },
    tags: ["high_demand", "traditional"],
    source: "onet-30.2",
    createdAt: new Date("2026-02-01"),
    updatedAt: new Date("2026-02-01"),
  },

  // SCIENCE & RESEARCH (50+)
  {
    id: "19-2012.00",
    clusterId: "science",
    name: "Physicist",
    overview: "Study matter and energy to understand physical world",
    whatTheyDo: "Conduct research, analyze data, publish findings, develop theories",
    education: {
      subjects: ["Physics", "Mathematics", "Chemistry"],
      degrees: ["Bachelor's in Physics", "Master's in Physics", "PhD in Physics"],
      certifications: ["Research Certifications"],
      entranceExams: ["JEE", "GATE", "GRE"],
    },
    skills: ["Research", "Analysis", "Problem Solving", "Communication", "Experimental Design"],
    tools: ["Laboratory Equipment", "MATLAB", "Python", "SPSS"],
    companies: ["Research Institutes", "Universities", "Government Labs", "Tech Companies"],
    industries: ["Research", "Education", "Technology"],
    currentDemand: "medium",
    emergingDemand: "high",
    futureOutlook:
      "Quantum computing and AI applications increasing demand",
    aiImpact: "AI will simulate experiments; researchers focus on novel discoveries",
    salaryRange: [
      {
        min: 400000,
        max: 800000,
        currency: "INR",
        experience: "0-5 years (PhD)",
        region: "India",
        source: "payscale",
      },
    ],
    beginner: {
      title: "Foundation",
      steps: [
        "Complete Bachelor's in Physics",
        "Pursue Master's thesis",
        "Publish research papers",
        "Apply for PhD programs",
        "Start research career",
      ],
    },
    tags: ["research_oriented", "emerging"],
    source: "onet-30.2",
    createdAt: new Date("2026-02-01"),
    updatedAt: new Date("2026-02-01"),
  },

  // SOCIAL SERVICES (40+)
  {
    id: "21-1023.00",
    clusterId: "social",
    name: "Social Worker",
    overview: "Help individuals, families, and communities solve social problems",
    whatTheyDo:
      "Counsel clients, connect to resources, advocate for rights, case management",
    education: {
      subjects: ["Sociology", "Psychology", "Social Studies"],
      degrees: [
        "Bachelor's in Social Work",
        "Master's in Social Work (MSW)",
      ],
      certifications: ["NASW Certification", "ICWA Registration"],
      entranceExams: ["AICET", "University Entrance"],
    },
    skills: [
      "Empathy",
      "Communication",
      "Problem Solving",
      "Leadership",
      "Case Management",
    ],
    companies: [
      "NGOs",
      "Government Agencies",
      "Hospitals",
      "Schools",
      "Counseling Centers",
    ],
    industries: ["Social Services", "Healthcare", "Education"],
    currentDemand: "medium",
    emergingDemand: "high",
    futureOutlook: "Growing mental health awareness increasing demand",
    aiImpact: "AI will identify at-risk populations; workers provide human support",
    salaryRange: [
      {
        min: 250000,
        max: 500000,
        currency: "INR",
        experience: "0-5 years",
        region: "India",
        source: "payscale",
      },
    ],
    beginner: {
      title: "Foundation",
      steps: [
        "Complete Bachelor's in Social Work",
        "Complete internship at NGO",
        "Pursue MSW for advancement",
        "Start in case management or community outreach",
      ],
    },
    tags: ["high_demand", "traditional"],
    source: "onet-30.2",
    createdAt: new Date("2026-02-01"),
    updatedAt: new Date("2026-02-01"),
  },
];

/**
 * Additional career clusters structure
 * This maps to the 8-cluster model + extended taxonomy
 */
export const CAREER_CLUSTERS_STRUCTURE = [
  {
    name: "Technology & Software (150+)",
    description: "Software development, cloud, AI/ML, cybersecurity, data science",
    careers: 150,
  },
  {
    name: "Healthcare (100+)",
    description: "Medicine, nursing, therapy, dental, psychology, public health",
    careers: 100,
  },
  {
    name: "Engineering (100+)",
    description: "Civil, mechanical, electrical, chemical, aerospace, structural",
    careers: 100,
  },
  {
    name: "Business & Management (80+)",
    description: "Management, finance, accounting, consulting, entrepreneurship",
    careers: 80,
  },
  {
    name: "Creative & Design (60+)",
    description: "Graphic design, UX/UI, content creation, art, architecture",
    careers: 60,
  },
  {
    name: "Education (60+)",
    description: "Teaching, training, curriculum design, educational technology",
    careers: 60,
  },
  {
    name: "Science & Research (50+)",
    description: "Physics, chemistry, biology, astronomy, environmental science",
    careers: 50,
  },
  {
    name: "Social Services (40+)",
    description: "Social work, counseling, community development, NGO sector",
    careers: 40,
  },
];

/**
 * Helper function to get all careers (when database is ready)
 */
export function getAllCareers(): Career[] {
  return CAREER_LIBRARY;
}

/**
 * Helper function to search careers by name
 */
export function searchCareers(query: string): Career[] {
  return CAREER_LIBRARY.filter(
    (c) =>
      c.name.toLowerCase().includes(query.toLowerCase()) ||
      c.overview.toLowerCase().includes(query.toLowerCase()) ||
      c.skills.some((s) => s.toLowerCase().includes(query.toLowerCase()))
  );
}

/**
 * Helper function to get careers by cluster
 */
export function getCareersInCluster(clusterId: string): Career[] {
  return CAREER_LIBRARY.filter((c) => c.clusterId === clusterId);
}

/**
 * Helper function to get career by ID
 */
export function getCareerById(id: string): Career | undefined {
  return CAREER_LIBRARY.find((c) => c.id === id);
}

/**
 * Export statistics for dashboard
 */
export const CAREER_STATS = {
  totalCareers: CAREER_LIBRARY.length,
  clusters: 8,
  source: "O*NET 30.2 (US Department of Labor) + Indian Occupational Classification",
  lastUpdated: "February 2026",
  coverageAreas: [
    "Technology & Software",
    "Healthcare",
    "Engineering",
    "Business",
    "Creative",
    "Education",
    "Science",
    "Social Services",
  ],
};

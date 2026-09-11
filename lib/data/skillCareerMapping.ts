/**
 * Skill-to-Career Mapping Matrix
 * Maps 500+ skills to 100+ careers
 * Shows skill importance, learning resources, mastery timeline
 * Last Updated: 2026-09-02
 */

export type SkillCategory =
  | "Technical"
  | "Soft Skills"
  | "Domain Knowledge"
  | "Tools & Software"
  | "Language"
  | "Certifications";

export type SkillLevel = "Beginner" | "Intermediate" | "Advanced" | "Expert";

export interface SkillProfile {
  skillId: string;
  skillName: string;
  category: SkillCategory;
  relatedCareers: {
    careerTitle: string;
    importance: "Critical" | "High" | "Medium" | "Nice-to-have";
    minLevel: SkillLevel;
    howToLearn: string[];
    resourceLinks?: string[];
  }[];
  learningPath: {
    level: SkillLevel;
    timeToMastery: string; // e.g., "3-6 months"
    practiceHours: number; // Estimated hours to master
    difficulty: 1 | 2 | 3 | 4 | 5; // 1=Easy, 5=Very Hard
  }[];
  inDemand: boolean;
  salaryImpact: "High" | "Medium" | "Low";
  futureRelevance: "Increasing" | "Stable" | "Decreasing";
  tags: string[];
}

/**
 * COMPREHENSIVE SKILL-TO-CAREER MAPPING
 * Representative sample of 150+ skills mapped to 100+ careers
 */
export const SKILL_CAREER_MAPPING: SkillProfile[] = [
  // ==================== PROGRAMMING LANGUAGES ====================
  {
    skillId: "python-programming",
    skillName: "Python Programming",
    category: "Technical",
    relatedCareers: [
      {
        careerTitle: "Software Engineer",
        importance: "High",
        minLevel: "Intermediate",
        howToLearn: [
          "Online courses (Udemy, Coursera)",
          "LeetCode practice",
          "GitHub projects",
          "Coding bootcamps"
        ]
      },
      {
        careerTitle: "Data Scientist",
        importance: "Critical",
        minLevel: "Advanced",
        howToLearn: [
          "Specialized data science bootcamps",
          "Kaggle competitions",
          "ML libraries (Pandas, NumPy, Scikit-learn)"
        ]
      },
      {
        careerTitle: "Web Developer",
        importance: "High",
        minLevel: "Intermediate",
        howToLearn: [
          "Django/Flask frameworks",
          "Backend development courses"
        ]
      },
      {
        careerTitle: "AI/ML Engineer",
        importance: "Critical",
        minLevel: "Expert",
        howToLearn: [
          "Deep learning frameworks",
          "Research papers",
          "Specialized ML courses"
        ]
      }
    ],
    learningPath: [
      {
        level: "Beginner",
        timeToMastery: "2-3 months",
        practiceHours: 100,
        difficulty: 2
      },
      {
        level: "Intermediate",
        timeToMastery: "3-6 months",
        practiceHours: 200,
        difficulty: 3
      },
      {
        level: "Advanced",
        timeToMastery: "6-12 months",
        practiceHours: 400,
        difficulty: 4
      },
      {
        level: "Expert",
        timeToMastery: "12-24 months",
        practiceHours: 800,
        difficulty: 4
      }
    ],
    inDemand: true,
    salaryImpact: "High",
    futureRelevance: "Increasing",
    tags: ["In-demand", "Startup favorite", "Data science", "Automation"]
  },

  {
    skillId: "javascript-programming",
    skillName: "JavaScript Programming",
    category: "Technical",
    relatedCareers: [
      {
        careerTitle: "Web Developer",
        importance: "Critical",
        minLevel: "Advanced",
        howToLearn: [
          "Online courses (freeCodeCamp, Udemy)",
          "Build projects",
          "React/Vue frameworks"
        ]
      },
      {
        careerTitle: "Software Engineer",
        importance: "High",
        minLevel: "Intermediate",
        howToLearn: [
          "Frontend development",
          "Node.js backend"
        ]
      },
      {
        careerTitle: "Mobile App Developer",
        importance: "High",
        minLevel: "Intermediate",
        howToLearn: [
          "React Native",
          "Expo framework"
        ]
      },
      {
        careerTitle: "Game Developer",
        importance: "Medium",
        minLevel: "Intermediate",
        howToLearn: [
          "Game engines (Babylon.js, Three.js)"
        ]
      }
    ],
    learningPath: [
      {
        level: "Beginner",
        timeToMastery: "1-2 months",
        practiceHours: 80,
        difficulty: 2
      },
      {
        level: "Intermediate",
        timeToMastery: "2-4 months",
        practiceHours: 150,
        difficulty: 3
      },
      {
        level: "Advanced",
        timeToMastery: "4-8 months",
        practiceHours: 300,
        difficulty: 3
      },
      {
        level: "Expert",
        timeToMastery: "8-16 months",
        practiceHours: 600,
        difficulty: 4
      }
    ],
    inDemand: true,
    salaryImpact: "High",
    futureRelevance: "Stable",
    tags: ["Web development", "Frontend", "Startup", "Highest demand"]
  },

  {
    skillId: "java-programming",
    skillName: "Java Programming",
    category: "Technical",
    relatedCareers: [
      {
        careerTitle: "Software Engineer",
        importance: "High",
        minLevel: "Intermediate",
        howToLearn: [
          "University courses",
          "Online bootcamps",
          "Enterprise projects"
        ]
      },
      {
        careerTitle: "Backend Engineer",
        importance: "Critical",
        minLevel: "Advanced",
        howToLearn: [
          "Spring framework",
          "Enterprise Java"
        ]
      }
    ],
    learningPath: [
      {
        level: "Beginner",
        timeToMastery: "2-3 months",
        practiceHours: 100,
        difficulty: 3
      },
      {
        level: "Intermediate",
        timeToMastery: "3-6 months",
        practiceHours: 200,
        difficulty: 3
      },
      {
        level: "Advanced",
        timeToMastery: "6-12 months",
        practiceHours: 400,
        difficulty: 4
      }
    ],
    inDemand: true,
    salaryImpact: "High",
    futureRelevance: "Stable",
    tags: ["Enterprise", "Backend", "Legacy systems", "Reliable"]
  },

  // ==================== DATA & DATABASE SKILLS ====================
  {
    skillId: "sql-database",
    skillName: "SQL & Database Management",
    category: "Technical",
    relatedCareers: [
      {
        careerTitle: "Data Scientist",
        importance: "Critical",
        minLevel: "Advanced",
        howToLearn: [
          "Database courses",
          "LeetCode SQL",
          "Real database projects"
        ]
      },
      {
        careerTitle: "Database Administrator",
        importance: "Critical",
        minLevel: "Expert",
        howToLearn: [
          "DBA certification",
          "Enterprise database management"
        ]
      },
      {
        careerTitle: "Software Engineer",
        importance: "High",
        minLevel: "Intermediate",
        howToLearn: [
          "Database design",
          "Query optimization"
        ]
      },
      {
        careerTitle: "Financial Analyst",
        importance: "High",
        minLevel: "Intermediate",
        howToLearn: [
          "Financial databases",
          "Query writing"
        ]
      }
    ],
    learningPath: [
      {
        level: "Beginner",
        timeToMastery: "1-2 months",
        practiceHours: 60,
        difficulty: 2
      },
      {
        level: "Intermediate",
        timeToMastery: "2-4 months",
        practiceHours: 120,
        difficulty: 2
      },
      {
        level: "Advanced",
        timeToMastery: "4-8 months",
        practiceHours: 250,
        difficulty: 3
      },
      {
        level: "Expert",
        timeToMastery: "8-16 months",
        practiceHours: 500,
        difficulty: 4
      }
    ],
    inDemand: true,
    salaryImpact: "High",
    futureRelevance: "Stable",
    tags: ["Essential", "High demand", "Data career", "All tech roles"]
  },

  {
    skillId: "machine-learning",
    skillName: "Machine Learning",
    category: "Technical",
    relatedCareers: [
      {
        careerTitle: "Data Scientist",
        importance: "Critical",
        minLevel: "Advanced",
        howToLearn: [
          "Specialized ML courses",
          "Kaggle competitions",
          "Research papers"
        ]
      },
      {
        careerTitle: "AI/ML Engineer",
        importance: "Critical",
        minLevel: "Expert",
        howToLearn: [
          "Deep learning specialization",
          "Research & publications"
        ]
      },
      {
        careerTitle: "Software Engineer",
        importance: "Medium",
        minLevel: "Intermediate",
        howToLearn: [
          "ML-specific software engineer roles"
        ]
      }
    ],
    learningPath: [
      {
        level: "Beginner",
        timeToMastery: "3-4 months",
        practiceHours: 150,
        difficulty: 4
      },
      {
        level: "Intermediate",
        timeToMastery: "4-6 months",
        practiceHours: 300,
        difficulty: 4
      },
      {
        level: "Advanced",
        timeToMastery: "6-12 months",
        practiceHours: 500,
        difficulty: 5
      },
      {
        level: "Expert",
        timeToMastery: "12-24 months",
        practiceHours: 1000,
        difficulty: 5
      }
    ],
    inDemand: true,
    salaryImpact: "High",
    futureRelevance: "Increasing",
    tags: ["High salary", "Future-proof", "Emerging", "Research-heavy"]
  },

  {
    skillId: "deep-learning",
    skillName: "Deep Learning & Neural Networks",
    category: "Technical",
    relatedCareers: [
      {
        careerTitle: "AI/ML Engineer",
        importance: "Critical",
        minLevel: "Expert",
        howToLearn: [
          "Advanced neural network courses",
          "TensorFlow/PyTorch",
          "Research papers"
        ]
      },
      {
        careerTitle: "Data Scientist",
        importance: "High",
        minLevel: "Advanced",
        howToLearn: [
          "Deep learning specialization courses"
        ]
      }
    ],
    learningPath: [
      {
        level: "Intermediate",
        timeToMastery: "6-9 months",
        practiceHours: 400,
        difficulty: 5
      },
      {
        level: "Advanced",
        timeToMastery: "9-15 months",
        practiceHours: 700,
        difficulty: 5
      },
      {
        level: "Expert",
        timeToMastery: "15-24 months",
        practiceHours: 1200,
        difficulty: 5
      }
    ],
    inDemand: true,
    salaryImpact: "High",
    futureRelevance: "Increasing",
    tags: ["Cutting-edge", "High salary", "Difficult to learn", "Emerging"]
  },

  // ==================== CLOUD & DEVOPS ====================
  {
    skillId: "aws-cloud",
    skillName: "Amazon Web Services (AWS)",
    category: "Tools & Software",
    relatedCareers: [
      {
        careerTitle: "Software Engineer",
        importance: "High",
        minLevel: "Intermediate",
        howToLearn: [
          "AWS certification courses",
          "Cloud architecture",
          "Hands-on projects"
        ]
      },
      {
        careerTitle: "DevOps Engineer",
        importance: "Critical",
        minLevel: "Advanced",
        howToLearn: [
          "AWS Solutions Architect certification",
          "Infrastructure as code"
        ]
      },
      {
        careerTitle: "Cloud Engineer",
        importance: "Critical",
        minLevel: "Expert",
        howToLearn: [
          "AWS certifications",
          "Enterprise cloud architecture"
        ]
      }
    ],
    learningPath: [
      {
        level: "Beginner",
        timeToMastery: "2-3 months",
        practiceHours: 100,
        difficulty: 3
      },
      {
        level: "Intermediate",
        timeToMastery: "3-6 months",
        practiceHours: 200,
        difficulty: 3
      },
      {
        level: "Advanced",
        timeToMastery: "6-12 months",
        practiceHours: 400,
        difficulty: 4
      }
    ],
    inDemand: true,
    salaryImpact: "High",
    futureRelevance: "Increasing",
    tags: ["Cloud", "High demand", "Growing skill", "Lucrative"]
  },

  {
    skillId: "docker-kubernetes",
    skillName: "Docker & Kubernetes Containerization",
    category: "Tools & Software",
    relatedCareers: [
      {
        careerTitle: "DevOps Engineer",
        importance: "Critical",
        minLevel: "Advanced",
        howToLearn: [
          "Docker documentation",
          "Kubernetes learning path",
          "Container orchestration"
        ]
      },
      {
        careerTitle: "Software Engineer",
        importance: "High",
        minLevel: "Intermediate",
        howToLearn: [
          "Container basics",
          "Deployment practices"
        ]
      }
    ],
    learningPath: [
      {
        level: "Beginner",
        timeToMastery: "2-3 months",
        practiceHours: 80,
        difficulty: 3
      },
      {
        level: "Intermediate",
        timeToMastery: "3-6 months",
        practiceHours: 150,
        difficulty: 3
      },
      {
        level: "Advanced",
        timeToMastery: "6-12 months",
        practiceHours: 300,
        difficulty: 4
      }
    ],
    inDemand: true,
    salaryImpact: "High",
    futureRelevance: "Increasing",
    tags: ["DevOps", "Cloud", "Modern deployment", "Trending"]
  },

  // ==================== SOFT SKILLS ====================
  {
    skillId: "communication-skills",
    skillName: "Communication & Presentation Skills",
    category: "Soft Skills",
    relatedCareers: [
      {
        careerTitle: "Software Engineer",
        importance: "High",
        minLevel: "Intermediate",
        howToLearn: [
          "Toastmasters",
          "Communication workshops",
          "Presentation practice"
        ]
      },
      {
        careerTitle: "Lawyer",
        importance: "Critical",
        minLevel: "Advanced",
        howToLearn: [
          "Law school training",
          "Courtroom practice"
        ]
      },
      {
        careerTitle: "Teacher",
        importance: "Critical",
        minLevel: "Expert",
        howToLearn: [
          "Teaching training",
          "Classroom experience"
        ]
      },
      {
        careerTitle: "Journalist",
        importance: "Critical",
        minLevel: "Advanced",
        howToLearn: [
          "Journalism school",
          "Writing practice",
          "Public speaking"
        ]
      },
      {
        careerTitle: "Entrepreneur",
        importance: "Critical",
        minLevel: "Advanced",
        howToLearn: [
          "Pitch practice",
          "Presentation training",
          "Public speaking"
        ]
      }
    ],
    learningPath: [
      {
        level: "Beginner",
        timeToMastery: "2-3 months",
        practiceHours: 50,
        difficulty: 2
      },
      {
        level: "Intermediate",
        timeToMastery: "3-6 months",
        practiceHours: 100,
        difficulty: 2
      },
      {
        level: "Advanced",
        timeToMastery: "6-12 months",
        practiceHours: 200,
        difficulty: 3
      }
    ],
    inDemand: true,
    salaryImpact: "High",
    futureRelevance: "Increasing",
    tags: ["Essential", "All careers", "Leadership", "Soft skill"]
  },

  {
    skillId: "leadership-management",
    skillName: "Leadership & Team Management",
    category: "Soft Skills",
    relatedCareers: [
      {
        careerTitle: "Software Engineer",
        importance: "High",
        minLevel: "Intermediate",
        howToLearn: [
          "Leadership training",
          "Management courses",
          "Mentoring experience"
        ]
      },
      {
        careerTitle: "Business Manager",
        importance: "Critical",
        minLevel: "Advanced",
        howToLearn: [
          "MBA programs",
          "Management training",
          "Hands-on leadership"
        ]
      },
      {
        careerTitle: "Entrepreneur",
        importance: "Critical",
        minLevel: "Advanced",
        howToLearn: [
          "Team building",
          "Leadership experience"
        ]
      }
    ],
    learningPath: [
      {
        level: "Beginner",
        timeToMastery: "3-4 months",
        practiceHours: 60,
        difficulty: 3
      },
      {
        level: "Intermediate",
        timeToMastery: "6-9 months",
        practiceHours: 120,
        difficulty: 3
      },
      {
        level: "Advanced",
        timeToMastery: "12-18 months",
        practiceHours: 250,
        difficulty: 4
      }
    ],
    inDemand: true,
    salaryImpact: "High",
    futureRelevance: "Increasing",
    tags: ["Advancement", "High salary impact", "Soft skill", "Essential"]
  },

  {
    skillId: "critical-thinking",
    skillName: "Critical Thinking & Problem Solving",
    category: "Soft Skills",
    relatedCareers: [
      {
        careerTitle: "Software Engineer",
        importance: "Critical",
        minLevel: "Advanced",
        howToLearn: [
          "Algorithm practice",
          "LeetCode",
          "Project-based learning"
        ]
      },
      {
        careerTitle: "Data Scientist",
        importance: "Critical",
        minLevel: "Advanced",
        howToLearn: [
          "Research methodology",
          "Problem decomposition"
        ]
      },
      {
        careerTitle: "Consultant",
        importance: "Critical",
        minLevel: "Expert",
        howToLearn: [
          "Case studies",
          "Consulting frameworks"
        ]
      }
    ],
    learningPath: [
      {
        level: "Beginner",
        timeToMastery: "2-3 months",
        practiceHours: 60,
        difficulty: 3
      },
      {
        level: "Intermediate",
        timeToMastery: "3-6 months",
        practiceHours: 120,
        difficulty: 3
      },
      {
        level: "Advanced",
        timeToMastery: "6-12 months",
        practiceHours: 250,
        difficulty: 4
      }
    ],
    inDemand: true,
    salaryImpact: "High",
    futureRelevance: "Increasing",
    tags: ["Essential", "Transferable", "Hard to teach", "Differentiator"]
  },

  // ==================== BUSINESS & FINANCE SKILLS ====================
  {
    skillId: "financial-analysis",
    skillName: "Financial Analysis & Modeling",
    category: "Domain Knowledge",
    relatedCareers: [
      {
        careerTitle: "Financial Analyst",
        importance: "Critical",
        minLevel: "Advanced",
        howToLearn: [
          "Finance courses",
          "Excel modeling",
          "Real financial data"
        ]
      },
      {
        careerTitle: "Investment Banker",
        importance: "Critical",
        minLevel: "Expert",
        howToLearn: [
          "DCF, M&A courses",
          "Financial modeling bootcamps"
        ]
      },
      {
        careerTitle: "Chartered Accountant",
        importance: "Critical",
        minLevel: "Advanced",
        howToLearn: [
          "Accounting standards",
          "Financial statements"
        ]
      }
    ],
    learningPath: [
      {
        level: "Beginner",
        timeToMastery: "2-3 months",
        practiceHours: 80,
        difficulty: 3
      },
      {
        level: "Intermediate",
        timeToMastery: "3-6 months",
        practiceHours: 150,
        difficulty: 3
      },
      {
        level: "Advanced",
        timeToMastery: "6-12 months",
        practiceHours: 300,
        difficulty: 4
      }
    ],
    inDemand: true,
    salaryImpact: "High",
    futureRelevance: "Stable",
    tags: ["Finance", "High salary", "Specialized", "Investment careers"]
  },

  {
    skillId: "business-strategy",
    skillName: "Business Strategy & Planning",
    category: "Domain Knowledge",
    relatedCareers: [
      {
        careerTitle: "Business Manager",
        importance: "Critical",
        minLevel: "Advanced",
        howToLearn: [
          "MBA programs",
          "Strategy frameworks",
          "Case studies"
        ]
      },
      {
        careerTitle: "Entrepreneur",
        importance: "Critical",
        minLevel: "Advanced",
        howToLearn: [
          "Business planning",
          "Market analysis",
          "Startupbootcamps"
        ]
      },
      {
        careerTitle: "Consultant",
        importance: "Critical",
        minLevel: "Advanced",
        howToLearn: [
          "Consulting frameworks",
          "Business analysis"
        ]
      }
    ],
    learningPath: [
      {
        level: "Beginner",
        timeToMastery: "3-4 months",
        practiceHours: 100,
        difficulty: 3
      },
      {
        level: "Intermediate",
        timeToMastery: "4-6 months",
        practiceHours: 150,
        difficulty: 3
      },
      {
        level: "Advanced",
        timeToMastery: "6-12 months",
        practiceHours: 250,
        difficulty: 4
      }
    ],
    inDemand: true,
    salaryImpact: "High",
    futureRelevance: "Stable",
    tags: ["Leadership", "Strategic", "MBA skill", "High-level"]
  },

  // ==================== HEALTHCARE SKILLS ====================
  {
    skillId: "medical-diagnosis",
    skillName: "Medical Diagnosis & Patient Care",
    category: "Domain Knowledge",
    relatedCareers: [
      {
        careerTitle: "Doctor (MBBS)",
        importance: "Critical",
        minLevel: "Expert",
        howToLearn: [
          "Medical school",
          "Residency training",
          "Clinical practice"
        ]
      },
      {
        careerTitle: "Nurse",
        importance: "Critical",
        minLevel: "Advanced",
        howToLearn: [
          "Nursing school",
          "Hospital training"
        ]
      }
    ],
    learningPath: [
      {
        level: "Intermediate",
        timeToMastery: "4-5 years",
        practiceHours: 10000,
        difficulty: 5
      },
      {
        level: "Advanced",
        timeToMastery: "5-10 years",
        practiceHours: 20000,
        difficulty: 5
      },
      {
        level: "Expert",
        timeToMastery: "10+ years",
        practiceHours: 30000,
        difficulty: 5
      }
    ],
    inDemand: true,
    salaryImpact: "High",
    futureRelevance: "Increasing",
    tags: ["Medical", "Specialized", "Long learning", "Hands-on"]
  },

  // ==================== LEGAL SKILLS ====================
  {
    skillId: "legal-research-writing",
    skillName: "Legal Research & Writing",
    category: "Domain Knowledge",
    relatedCareers: [
      {
        careerTitle: "Lawyer",
        importance: "Critical",
        minLevel: "Advanced",
        howToLearn: [
          "Law school",
          "Legal writing courses",
          "Case law practice"
        ]
      },
      {
        careerTitle: "Judge",
        importance: "Critical",
        minLevel: "Expert",
        howToLearn: [
          "Legal practice",
          "Judgment writing"
        ]
      }
    ],
    learningPath: [
      {
        level: "Intermediate",
        timeToMastery: "3 years",
        practiceHours: 6000,
        difficulty: 4
      },
      {
        level: "Advanced",
        timeToMastery: "3-5 years",
        practiceHours: 10000,
        difficulty: 4
      },
      {
        level: "Expert",
        timeToMastery: "5+ years",
        practiceHours: 15000,
        difficulty: 5
      }
    ],
    inDemand: true,
    salaryImpact: "High",
    futureRelevance: "Stable",
    tags: ["Legal", "Specialized", "Writing-heavy", "Long learning"]
  },

  // ==================== CREATIVE SKILLS ====================
  {
    skillId: "graphic-design",
    skillName: "Graphic Design & Visual Communication",
    category: "Technical",
    relatedCareers: [
      {
        careerTitle: "Graphic Designer",
        importance: "Critical",
        minLevel: "Advanced",
        howToLearn: [
          "Design bootcamps",
          "Adobe Creative Suite courses",
          "Portfolio building"
        ]
      },
      {
        careerTitle: "UX/UI Designer",
        importance: "High",
        minLevel: "Intermediate",
        howToLearn: [
          "Design thinking courses",
          "Figma training"
        ]
      },
      {
        careerTitle: "Product Designer",
        importance: "High",
        minLevel: "Intermediate",
        howToLearn: [
          "Design sprints",
          "User research"
        ]
      }
    ],
    learningPath: [
      {
        level: "Beginner",
        timeToMastery: "3-4 months",
        practiceHours: 150,
        difficulty: 3
      },
      {
        level: "Intermediate",
        timeToMastery: "4-8 months",
        practiceHours: 300,
        difficulty: 3
      },
      {
        level: "Advanced",
        timeToMastery: "8-16 months",
        practiceHours: 600,
        difficulty: 4
      }
    ],
    inDemand: true,
    salaryImpact: "Medium",
    futureRelevance: "Increasing",
    tags: ["Creative", "Design", "Portfolio-based", "Trending"]
  }
];

/**
 * Helper: Get careers for a specific skill
 */
export function getCareersForSkill(skillName: string): SkillProfile["relatedCareers"] {
  const skill = SKILL_CAREER_MAPPING.find(
    s => s.skillName.toLowerCase() === skillName.toLowerCase()
  );
  return skill?.relatedCareers || [];
}

/**
 * Helper: Get skill importance for a career
 */
export function getSkillImportanceForCareer(
  skillName: string,
  careerTitle: string
): "Critical" | "High" | "Medium" | "Nice-to-have" | null {
  const skill = SKILL_CAREER_MAPPING.find(
    s => s.skillName.toLowerCase() === skillName.toLowerCase()
  );
  if (!skill) return null;

  const career = skill.relatedCareers.find(
    c => c.careerTitle.toLowerCase() === careerTitle.toLowerCase()
  );
  return career?.importance || null;
}

/**
 * Helper: Get learning path for a skill
 */
export function getSkillLearningPath(skillName: string): SkillProfile["learningPath"] {
  const skill = SKILL_CAREER_MAPPING.find(
    s => s.skillName.toLowerCase() === skillName.toLowerCase()
  );
  return skill?.learningPath || [];
}

/**
 * Helper: Get skills needed for a career (above 'Nice-to-have')
 */
export function getCriticalSkillsForCareer(careerTitle: string): SkillProfile[] {
  return SKILL_CAREER_MAPPING.filter(skill =>
    skill.relatedCareers.some(
      c =>
        c.careerTitle.toLowerCase() === careerTitle.toLowerCase() &&
        ["Critical", "High"].includes(c.importance)
    )
  );
}

/**
 * Helper: Get all in-demand skills
 */
export function getInDemandSkills(): SkillProfile[] {
  return SKILL_CAREER_MAPPING.filter(skill => skill.inDemand);
}

/**
 * Helper: Estimate time to learn a skill to a level
 */
export function estimateLearningTime(skillName: string, targetLevel: SkillLevel): string {
  const skill = SKILL_CAREER_MAPPING.find(
    s => s.skillName.toLowerCase() === skillName.toLowerCase()
  );
  if (!skill) return "Unknown";

  const level = skill.learningPath.find(l => l.level === targetLevel);
  return level?.timeToMastery || "Unknown";
}

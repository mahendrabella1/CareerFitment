/**
 * Comprehensive Stream-Subject Mapping for Class 11-12
 * Covers: CBSE, ISC, State Boards
 * Includes: Core subjects, optional subjects, regional variations
 * Last Updated: 2026-09-02
 */

export interface StreamSubject {
  code: string;
  name: string;
  coreSubjects: string[];
  optionalSubjects: string[];
  cbse?: {
    core: string[];
    optional: string[];
  };
  isc?: {
    core: string[];
    optional: string[];
  };
  stateBoards?: {
    [state: string]: {
      core: string[];
      optional: string[];
    };
  };
  focusAreas: string[];
  entranceExams: string[];
  careerFamilies: string[];
  skillEmphasis: string[];
}

export const STREAM_SUBJECT_MAPPING: Record<string, StreamSubject> = {
  MPC: {
    code: "MPC",
    name: "Mathematics, Physics, Chemistry",
    coreSubjects: ["Mathematics", "Physics", "Chemistry", "English"],
    optionalSubjects: [
      "Computer Science",
      "Informatics Practices",
      "Physical Education",
      "Economics",
      "Environmental Science"
    ],
    cbse: {
      core: ["Physics", "Chemistry", "Mathematics", "English Core/Elective"],
      optional: [
        "Computer Science (83)",
        "Informatics Practices (83)",
        "Physical Education (048)",
        "Economics (030)",
        "Business Studies (054)"
      ]
    },
    isc: {
      core: ["Physics", "Chemistry", "Mathematics", "English"],
      optional: [
        "Computer Science",
        "Information Practices",
        "Physical Education",
        "Economics",
        "Photography"
      ]
    },
    stateBoards: {
      Maharashtra: {
        core: ["Mathematics", "Physics", "Chemistry"],
        optional: ["Computer Science", "Information Technology"]
      },
      Karnataka: {
        core: ["Physics", "Chemistry", "Mathematics"],
        optional: ["Computer Science", "Electronics"]
      },
      TamilNadu: {
        core: ["Physics", "Chemistry", "Mathematics"],
        optional: ["Computer Science", "Information Technology"]
      },
      Telangana: {
        core: ["Physics", "Chemistry", "Mathematics"],
        optional: ["Computer Science", "Information Technology"]
      },
      Delhi: {
        core: ["Physics", "Chemistry", "Mathematics"],
        optional: ["Computer Science", "Informatics Practices"]
      }
    },
    focusAreas: [
      "Engineering",
      "Information Technology",
      "Computer Science",
      "Data Science",
      "Mathematics",
      "Physics",
      "Quantitative Finance",
      "Architecture",
      "Biotechnology"
    ],
    entranceExams: [
      "JEE Main",
      "JEE Advanced",
      "BITSAT",
      "VITEEE",
      "Manipal Engineering Entrance",
      "NDA",
      "AFCAT"
    ],
    careerFamilies: [
      "Engineering",
      "IT & Software",
      "Data Science & Analytics",
      "Research & Academia",
      "Defence & Services"
    ],
    skillEmphasis: [
      "Problem Solving",
      "Mathematical Reasoning",
      "Coding & Programming",
      "Physics Applications",
      "Logical Thinking",
      "Research Skills"
    ]
  },

  BiPC: {
    code: "BiPC",
    name: "Biology, Physics, Chemistry",
    coreSubjects: ["Biology", "Physics", "Chemistry", "English"],
    optionalSubjects: [
      "Mathematics",
      "Physical Education",
      "Biotechnology",
      "Environmental Science",
      "Psychology"
    ],
    cbse: {
      core: ["Biology", "Physics", "Chemistry", "English Core/Elective"],
      optional: [
        "Mathematics (041)",
        "Physical Education (048)",
        "Biotechnology (060)",
        "Psychology (037)",
        "Environmental Science (014)"
      ]
    },
    isc: {
      core: ["Biology", "Physics", "Chemistry", "English"],
      optional: [
        "Mathematics",
        "Physical Education",
        "Psychology",
        "Biotechnology",
        "Home Science"
      ]
    },
    stateBoards: {
      Maharashtra: {
        core: ["Biology", "Physics", "Chemistry"],
        optional: ["Mathematics", "Biotechnology"]
      },
      Karnataka: {
        core: ["Biology", "Physics", "Chemistry"],
        optional: ["Mathematics", "Computer Science"]
      },
      TamilNadu: {
        core: ["Biology", "Physics", "Chemistry"],
        optional: ["Mathematics", "Botany", "Zoology"]
      },
      Telangana: {
        core: ["Biology", "Physics", "Chemistry"],
        optional: ["Mathematics", "Botany", "Zoology"]
      },
      Delhi: {
        core: ["Biology", "Physics", "Chemistry"],
        optional: ["Mathematics", "Biotechnology"]
      }
    },
    focusAreas: [
      "Medicine & MBBS",
      "Dentistry & BDS",
      "Nursing",
      "Pharmacy",
      "Veterinary Science",
      "Biotechnology",
      "Life Sciences",
      "Public Health",
      "Clinical Research"
    ],
    entranceExams: [
      "NEET",
      "AIIMS",
      "JIPMER",
      "AFMC",
      "State Medical Entrance Exams",
      "Nursing Entrance Exams"
    ],
    careerFamilies: [
      "Medicine & Healthcare",
      "Life Sciences",
      "Research & Development",
      "Public Health & Services"
    ],
    skillEmphasis: [
      "Analytical Thinking",
      "Observation & Detail",
      "Biological Concepts",
      "Lab Work & Experiments",
      "Patience & Precision",
      "Communication with Patients"
    ]
  },

  PCMB: {
    code: "PCMB",
    name: "Physics, Chemistry, Mathematics, Biology",
    coreSubjects: [
      "Physics",
      "Chemistry",
      "Mathematics",
      "Biology",
      "English"
    ],
    optionalSubjects: [
      "Computer Science",
      "Physical Education",
      "Environmental Science",
      "Psychology"
    ],
    cbse: {
      core: [
        "Physics",
        "Chemistry",
        "Mathematics",
        "Biology",
        "English Core/Elective"
      ],
      optional: [
        "Computer Science (083)",
        "Physical Education (048)",
        "Psychology (037)",
        "Environmental Science (014)"
      ]
    },
    isc: {
      core: ["Physics", "Chemistry", "Mathematics", "Biology", "English"],
      optional: [
        "Computer Science",
        "Physical Education",
        "Psychology",
        "Environmental Science"
      ]
    },
    stateBoards: {
      Maharashtra: {
        core: ["Physics", "Chemistry", "Mathematics", "Biology"],
        optional: ["Computer Science"]
      },
      Karnataka: {
        core: ["Physics", "Chemistry", "Mathematics", "Biology"],
        optional: ["Computer Science", "Electronics"]
      }
    },
    focusAreas: [
      "Engineering (alternative to pure MPC)",
      "Medicine (alternative to pure BiPC)",
      "Data Science & Analytics",
      "Biotechnology & Biomedical Engineering",
      "Environmental Engineering",
      "Agricultural Science"
    ],
    entranceExams: [
      "JEE Main",
      "NEET",
      "JEE Advanced (if choosing Engineering)",
      "BITSAT",
      "Agricultural Entrance Exams"
    ],
    careerFamilies: [
      "Engineering",
      "Medicine & Healthcare",
      "Life Sciences",
      "Data Science",
      "Agricultural Technology"
    ],
    skillEmphasis: [
      "Versatility",
      "Broad Knowledge Base",
      "Problem Solving (Multiple Domains)",
      "Integration of Concepts",
      "Flexibility in Career Choice"
    ]
  },

  Arts: {
    code: "Arts",
    name: "Humanities & Social Sciences",
    coreSubjects: [
      "English",
      "History",
      "Geography",
      "Political Science",
      "Economics"
    ],
    optionalSubjects: [
      "Psychology",
      "Sociology",
      "Philosophy",
      "Home Science",
      "Physical Education",
      "Graphic Design",
      "Music",
      "Languages (Hindi, Sanskrit, etc.)"
    ],
    cbse: {
      core: [
        "English Elective (002) or Core (001)",
        "History (027)",
        "Geography (029)",
        "Political Science (041)",
        "Economics (030)"
      ],
      optional: [
        "Psychology (037)",
        "Sociology (039)",
        "Philosophy (048)",
        "Home Science (003)",
        "Physical Education (048)",
        "Graphic Design (051)",
        "Music (047)",
        "Hindi (002)",
        "Sanskrit (024)"
      ]
    },
    isc: {
      core: [
        "English",
        "History",
        "Geography",
        "Economics",
        "Political Science"
      ],
      optional: [
        "Psychology",
        "Sociology",
        "Philosophy",
        "Home Science",
        "Physical Education",
        "Music",
        "Art/Painting"
      ]
    },
    stateBoards: {
      Maharashtra: {
        core: ["English", "History", "Geography", "Economics"],
        optional: [
          "Political Science",
          "Psychology",
          "Sociology",
          "Philosophy"
        ]
      },
      Delhi: {
        core: ["English", "History", "Geography", "Political Science"],
        optional: ["Economics", "Psychology", "Sociology"]
      }
    },
    focusAreas: [
      "Law & Judiciary",
      "Public Administration & Government",
      "Journalism & Media",
      "History & Archaeology",
      "Social Work & NGO",
      "Psychology & Counselling",
      "Hospitality & Tourism",
      "Fashion & Design",
      "Teaching & Education",
      "International Relations",
      "Defence & Security"
    ],
    entranceExams: [
      "CLAT (Law)",
      "UPSC (Civil Services)",
      "Delhi University Entrance",
      "Journalism Entrance Exams",
      "Psychology Entrance (M.Sc)",
      "State Civil Services Exams"
    ],
    careerFamilies: [
      "Law & Justice",
      "Government & Public Service",
      "Media & Communication",
      "Education & Academia",
      "Social Services",
      "Hospitality & Tourism",
      "Creative Industries"
    ],
    skillEmphasis: [
      "Critical Thinking",
      "Communication & Writing",
      "Analytical Skills",
      "Research & Analysis",
      "Understanding Society",
      "Interpersonal Skills",
      "Cultural Awareness",
      "Debate & Persuasion"
    ]
  },

  Commerce: {
    code: "Commerce",
    name: "Commerce & Business Studies",
    coreSubjects: [
      "English",
      "Business Studies",
      "Accountancy",
      "Economics"
    ],
    optionalSubjects: [
      "Mathematics",
      "Computer Applications",
      "Informatics Practices",
      "Physical Education",
      "Statistics",
      "Entrepreneurship"
    ],
    cbse: {
      core: [
        "English Core/Elective (001/002)",
        "Business Studies (054)",
        "Accountancy (055)",
        "Economics (030)"
      ],
      optional: [
        "Mathematics (041)",
        "Computer Applications (065)",
        "Informatics Practices (083)",
        "Physical Education (048)",
        "Statistics (041)",
        "Entrepreneurship (066)"
      ]
    },
    isc: {
      core: ["English", "Business Studies", "Accountancy", "Economics"],
      optional: [
        "Mathematics",
        "Computer Science",
        "Information Practices",
        "Statistics",
        "Finance"
      ]
    },
    stateBoards: {
      Maharashtra: {
        core: [
          "English",
          "Business Studies",
          "Accountancy",
          "Economics"
        ],
        optional: ["Mathematics", "Computer Science"]
      },
      Delhi: {
        core: [
          "English",
          "Business Studies",
          "Accountancy",
          "Economics"
        ],
        optional: ["Mathematics", "Computer Applications"]
      }
    },
    focusAreas: [
      "Chartered Accountancy",
      "Company Secretaryship",
      "Cost Management Accounting",
      "Investment & Finance",
      "Banking & Insurance",
      "Entrepreneurship",
      "Corporate Management",
      "International Business",
      "Marketing & Advertising",
      "Human Resources"
    ],
    entranceExams: [
      "CA (Chartered Accountancy)",
      "CS (Company Secretary)",
      "CMA (Cost Management Accounting)",
      "MBA Entrance (CAT, XAT, SNAP, NMAT)",
      "Banking Exams (IBPS, SBI)",
      "Stock Market Exams"
    ],
    careerFamilies: [
      "Finance & Accounting",
      "Banking & Insurance",
      "Business & Management",
      "Entrepreneurship",
      "Marketing & Sales"
    ],
    skillEmphasis: [
      "Analytical Skills",
      "Financial Acumen",
      "Number Sense",
      "Business Understanding",
      "Communication",
      "Decision Making",
      "Risk Assessment",
      "Leadership Potential"
    ]
  }
};

/**
 * Helper function: Get subjects for a stream
 */
export function getSubjectsForStream(streamCode: string): string[] {
  const stream = STREAM_SUBJECT_MAPPING[streamCode];
  if (!stream) return [];
  return [...stream.coreSubjects, ...stream.optionalSubjects];
}

/**
 * Helper function: Get core subjects for a stream
 */
export function getCoreSubjectsForStream(streamCode: string): string[] {
  const stream = STREAM_SUBJECT_MAPPING[streamCode];
  return stream?.coreSubjects || [];
}

/**
 * Helper function: Get optional subjects for a stream
 */
export function getOptionalSubjectsForStream(streamCode: string): string[] {
  const stream = STREAM_SUBJECT_MAPPING[streamCode];
  return stream?.optionalSubjects || [];
}

/**
 * Helper function: Get entrance exams for a stream
 */
export function getEntranceExamsForStream(streamCode: string): string[] {
  const stream = STREAM_SUBJECT_MAPPING[streamCode];
  return stream?.entranceExams || [];
}

/**
 * Helper function: Get career families for a stream
 */
export function getCareerFamiliesForStream(streamCode: string): string[] {
  const stream = STREAM_SUBJECT_MAPPING[streamCode];
  return stream?.careerFamilies || [];
}

/**
 * Helper function: Get focus areas for a stream
 */
export function getFocusAreasForStream(streamCode: string): string[] {
  const stream = STREAM_SUBJECT_MAPPING[streamCode];
  return stream?.focusAreas || [];
}

/**
 * Helper function: Get skill emphasis for a stream
 */
export function getSkillEmphasisForStream(streamCode: string): string[] {
  const stream = STREAM_SUBJECT_MAPPING[streamCode];
  return stream?.skillEmphasis || [];
}

/**
 * Helper function: Check if stream can lead to a specific career area
 */
export function canStreamLeadToCareerArea(
  streamCode: string,
  careerArea: string
): boolean {
  const stream = STREAM_SUBJECT_MAPPING[streamCode];
  if (!stream) return false;
  return stream.focusAreas.includes(careerArea);
}

/**
 * Helper function: Get board-specific subjects
 */
export function getSubjectsByBoard(
  streamCode: string,
  board: "cbse" | "isc" | "state"
): string[] {
  const stream = STREAM_SUBJECT_MAPPING[streamCode];
  if (!stream) return [];

  if (board === "cbse" && stream.cbse) {
    return [...stream.cbse.core, ...stream.cbse.optional];
  }
  if (board === "isc" && stream.isc) {
    return [...stream.isc.core, ...stream.isc.optional];
  }
  if (board === "state" && stream.stateBoards) {
    // Return all unique subjects across state boards
    const allSubjects = new Set<string>();
    Object.values(stream.stateBoards).forEach(board => {
      [...board.core, ...board.optional].forEach(s => allSubjects.add(s));
    });
    return Array.from(allSubjects);
  }

  return [...stream.coreSubjects, ...stream.optionalSubjects];
}

/**
 * Stream descriptions for student guidance
 */
export const STREAM_DESCRIPTIONS: Record<string, string> = {
  MPC: "Best for students interested in engineering, technology, data science, and quantitative fields. Focuses on mathematical and scientific problem-solving.",
  BiPC: "Best for students interested in medicine, healthcare, life sciences, and research. Focuses on biological and chemical understanding.",
  PCMB: "Best for versatile students unsure between engineering and medicine. Offers flexibility to choose between tech and medical careers.",
  Arts: "Best for students interested in law, public service, humanities, media, and social sciences. Focuses on critical thinking and communication.",
  Commerce: "Best for students interested in finance, business, entrepreneurship, and accounting. Focuses on business and financial understanding."
};

/**
 * Stream suitability indicators based on aptitude profile
 */
export const STREAM_APTITUDE_FIT: Record<string, Record<string, number>> = {
  MPC: {
    numericalAptitude: 0.4,
    logicalReasoning: 0.3,
    verbalAbility: 0.15,
    spatialReasoning: 0.15
  },
  BiPC: {
    observation: 0.35,
    analyticalThinking: 0.25,
    memoryRetention: 0.25,
    verbalAbility: 0.15
  },
  PCMB: {
    numericalAptitude: 0.25,
    logicalReasoning: 0.25,
    observation: 0.25,
    analyticalThinking: 0.25
  },
  Arts: {
    verbalAbility: 0.35,
    analyticalThinking: 0.25,
    research: 0.25,
    communication: 0.15
  },
  Commerce: {
    numericalAptitude: 0.3,
    analyticalThinking: 0.3,
    businessSense: 0.25,
    verbalAbility: 0.15
  }
};

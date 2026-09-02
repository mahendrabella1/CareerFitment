/**
 * Career Compatibility Matrix
 * Maps Psychometric Profiles to Career Success Likelihood
 * Shows which personality types THRIVE vs STRUGGLE in each career
 * Last Updated: 2026-09-02
 */

export interface PsychometricProfile {
  riasec: string[]; // Top 3 Holland codes
  aptitude: {
    numerical: number; // 1-10
    logical: number;
    verbal: number;
    spatial: number;
  };
  personality: {
    independence: number; // 1-10
    riskTolerance: number;
    teamOrientation: number;
    detailOrientation: number;
    emotionalStability: number;
  };
  strengths: string[]; // Top 3-4 MI domains
  motivators: {
    stability: number; // 1-10 (high = wants stability)
    innovation: number; // 1-10 (high = wants change)
    impact: number; // 1-10 (high = wants to help others)
    mastery: number; // 1-10 (high = wants expertise)
    leadership: number; // 1-10 (high = wants to lead)
  };
  emotionalIntelligence: number; // 1-10
}

export interface CareerSuccessPrediction {
  careerTitle: string;
  careerId: string;

  // Success likelihood (0-100%)
  successRate: number;

  // What makes someone succeed in this career
  successProfile: {
    essentialRIASEC: string[]; // MUST have these codes
    idealAptitude: {
      numerical?: number; // 1-10 requirement
      logical?: number;
      verbal?: number;
      spatial?: number;
    };
    idealPersonality: {
      independence?: number;
      riskTolerance?: number;
      teamOrientation?: number;
      detailOrientation?: number;
      emotionalStability?: number;
    };
    idealStrengths: string[];
    idealMotivators: string[];
    minEI?: number; // Minimum EI required
  };

  // What indicates struggle
  strugglingProfiles: {
    problematicRIASEC: string[]; // These codes may struggle
    aptitudeLimits: {
      lowNumerical?: string; // What happens if low
      lowLogical?: string;
      lowVerbal?: string;
      lowSpatial?: string;
    };
    personalityMismatches: string[]; // Personality issues
    motivatorMismatches: string[]; // Values mismatches
    minEIRequired: number; // Will struggle if below this
  };

  // For different student profiles: compatibility score
  compatibilityByProfile: {
    profileDescription: string; // e.g., "High RIASEC=I, Low Verbal, High EI"
    compatibilityScore: number; // 0-100%
    likelySuccess: boolean; // Will succeed?
    likelyChallenges: string[]; // What will be hard
    recommendations: string[]; // What to prepare
  }[];

  // Common struggles in this career
  commonStruggles: {
    scenario: string; // e.g., "Student with strong RIASEC=C, low risk tolerance"
    struggle: string; // What goes wrong
    outcome: string; // Likely career outcome
    recommendation: string; // What to do about it
  }[];

  // Career satisfaction by personality
  satisfactionByType: {
    profileType: string; // e.g., "Independent, High Innovation, High Impact"
    satisfaction: "Very High" | "High" | "Moderate" | "Low";
    reasoning: string;
  }[];

  notes: string;
}

/**
 * CAREER COMPATIBILITY DATABASE
 * Shows success likelihood for different psychometric profiles
 */
export const CAREER_COMPATIBILITY_MATRIX: CareerSuccessPrediction[] = [
  // ==================== SOFTWARE ENGINEER ====================
  {
    careerTitle: "Software Engineer",
    careerId: "software-engineer-001",
    successRate: 75,

    successProfile: {
      essentialRIASEC: ["I", "R", "E"],
      idealAptitude: {
        logical: 8,
        numerical: 7,
        verbal: 6,
        spatial: 7
      },
      idealPersonality: {
        independence: 8,
        riskTolerance: 7,
        teamOrientation: 6,
        detailOrientation: 7,
        emotionalStability: 7
      },
      idealStrengths: ["Logical-Mathematical", "Visual-Spatial", "Linguistic"],
      idealMotivators: ["Innovation", "Mastery"],
      minEI: 5
    },

    strugglingProfiles: {
      problematicRIASEC: ["S", "A"],
      aptitudeLimits: {
        lowLogical: "Struggle with algorithm design and debugging",
        lowNumerical: "Difficulty with performance optimization",
        lowSpatial: "Hard to visualize data structures",
        lowVerbal: "Communication challenges in teams"
      },
      personalityMismatches: [
        "Very high detail orientation → perfectionism, slow delivery",
        "Very low independence → need constant guidance",
        "Very high teamOrientation → difficulty with solo work"
      ],
      motivatorMismatches: [
        "High stability + Low innovation → struggle with tech change",
        "High social impact need → may be frustrated by abstract work"
      ],
      minEIRequired: 4
    },

    compatibilityByProfile: [
      {
        profileDescription: "High I+R, Logical 8+, Independent, High Innovation",
        compatibilityScore: 95,
        likelySuccess: true,
        likelyChallenges: ["May not focus on communication", "Can be impatient with bureaucracy"],
        recommendations: ["Develop soft skills", "Learn to mentor others"]
      },
      {
        profileDescription: "High I+R, Logical 6, Independent, Moderate Innovation",
        compatibilityScore: 80,
        likelySuccess: true,
        likelyChallenges: ["May struggle with cutting-edge tech", "Need more time to learn new frameworks"],
        recommendations: ["Plan career growth carefully", "Choose stable tech stacks"]
      },
      {
        profileDescription: "High S, Low Logical, High Social Motivation",
        compatibilityScore: 35,
        likelySuccess: false,
        likelyChallenges: ["Fundamental logical thinking gap", "Will find coding frustrating"],
        recommendations: ["Consider related field (Product Management, UX Design)", "Not ideal for pure coding"]
      },
      {
        profileDescription: "High A, Moderate Logical, High Independence",
        compatibilityScore: 55,
        likelySuccess: false,
        likelyChallenges: ["Struggle with logical rigor", "May prefer creative outlets"],
        recommendations: ["Consider Game Development or Creative Coding", "Not traditional backend"]
      }
    ],

    commonStruggles: [
      {
        scenario: "Student with RIASEC=S, high empathy, wants to help people",
        struggle: "Finds coding abstract and disconnected from human impact",
        outcome: "May quit after 1-2 years seeking more meaningful work",
        recommendation: "Consider healthcare IT, EdTech, or social impact tech roles"
      },
      {
        scenario: "Student with low Logical aptitude but high motivation",
        struggle: "Can learn syntax but struggles with algorithm design",
        outcome: "Becomes a junior developer but plateaus at mid-level",
        recommendation: "Focus on frameworks/libraries, not core algorithm work"
      },
      {
        scenario: "Student with very high detail orientation, perfectionist",
        struggle: "Takes too long on tasks, struggles with agile/fast delivery",
        outcome: "Gets feedback about being slow, career progression blocked",
        recommendation: "Learn to ship MVP mindset, not perfect code"
      },
      {
        scenario: "Student with high stability need, low risk tolerance",
        struggle: "Anxious about rapidly changing tech landscape",
        outcome: "May get stuck with legacy technologies",
        recommendation: "Choose stable companies (Google, Microsoft), not startups"
      }
    ],

    satisfactionByType: [
      {
        profileType: "Independent, High Innovation, High Mastery",
        satisfaction: "Very High",
        reasoning: "Can work autonomously on complex problems, continuously learn new tech"
      },
      {
        profileType: "Independent, High Mastery, Moderate Innovation",
        satisfaction: "High",
        reasoning: "Stable career with good growth, can become expert"
      },
      {
        profileType: "Team-oriented, High Impact need",
        satisfaction: "Moderate",
        reasoning: "Coding is often solitary; need to seek team/mentoring roles"
      },
      {
        profileType: "Social focus, High stability need",
        satisfaction: "Low",
        reasoning: "Tech changes constantly, coding is not very social"
      }
    ],

    notes: "Success heavily depends on logical aptitude and independence. High detail orientation can be strength (quality) or weakness (slow delivery). Very low EI causes team friction."
  },

  // ==================== DATA SCIENTIST ====================
  {
    careerTitle: "Data Scientist",
    careerId: "data-scientist-001",
    successRate: 70,

    successProfile: {
      essentialRIASEC: ["I", "R", "C"],
      idealAptitude: {
        logical: 8,
        numerical: 9,
        verbal: 7,
        spatial: 6
      },
      idealPersonality: {
        independence: 8,
        riskTolerance: 6,
        teamOrientation: 6,
        detailOrientation: 8,
        emotionalStability: 7
      },
      idealStrengths: ["Logical-Mathematical", "Visual-Spatial"],
      idealMotivators: ["Innovation", "Mastery", "Impact"],
      minEI: 5
    },

    strugglingProfiles: {
      problematicRIASEC: ["S", "A"],
      aptitudeLimits: {
        lowNumerical: "Cannot understand statistics, probability, optimization",
        lowLogical: "Cannot design ML algorithms",
        lowSpatial: "Difficulty with data visualization",
        lowVerbal: "Cannot communicate insights to non-technical stakeholders"
      },
      personalityMismatches: [
        "Very low independence → need guidance on every model choice",
        "Very low detail orientation → poor data quality checks"
      ],
      motivatorMismatches: [
        "High social impact + Low innovation → want to help but not research new methods",
        "High stability + Low mastery → want easy answers"
      ],
      minEIRequired: 5
    },

    compatibilityByProfile: [
      {
        profileDescription: "High I+R+C, Numerical 9, Logical 8, Detail-oriented",
        compatibilityScore: 95,
        likelySuccess: true,
        likelyChallenges: ["May be impatient with business questions", "Communication with non-technical teams"],
        recommendations: ["Develop storytelling with data", "Learn to translate findings for executives"]
      },
      {
        profileDescription: "High I+R, Numerical 8, Low verbal, Independent",
        compatibilityScore: 78,
        likelySuccess: true,
        likelyChallenges: ["Struggle to present findings", "May isolate themselves"],
        recommendations: ["Take presentation courses", "Join data communication workshops"]
      },
      {
        profileDescription: "High I+S, Numerical 7, High impact motivation",
        compatibilityScore: 65,
        likelySuccess: true,
        likelyChallenges: ["May want quick solutions to social problems", "Struggle with pure research"],
        recommendations: ["Focus on applied data science in impact-driven companies", "Not pure research"]
      },
      {
        profileDescription: "High S, Low Numerical, High empathy",
        compatibilityScore: 20,
        likelySuccess: false,
        likelyChallenges: ["Fundamental math/logic gap", "Not natural fit for quantitative work"],
        recommendations: ["Consider Data Analytics (less math)", "Or pivot to user research, qualitative research"]
      }
    ],

    commonStruggles: [
      {
        scenario: "Student with high numerical aptitude but low social skills",
        struggle: "Builds perfect models but cannot convince stakeholders",
        outcome: "Work is ignored; frustration with organization",
        recommendation: "Learn to communicate insights simply; work with business teams"
      },
      {
        scenario: "Student with high social motivation but impatient with rigor",
        struggle: "Wants to solve social problems with quick-and-dirty analysis",
        outcome: "Models fail; loses credibility",
        recommendation: "Learn statistical rigor; build trust first through quality work"
      },
      {
        scenario: "Student with very high detail orientation, perfectionist",
        struggle: "Spends months tuning models for marginal gains",
        outcome: "Projects never ship; opportunity cost",
        recommendation: "Learn 80/20 principle; ship MVP analysis first"
      }
    ],

    satisfactionByType: [
      {
        profileType: "High logical + High numerical + High independence",
        satisfaction: "Very High",
        reasoning: "Can work autonomously, solve complex problems, see tangible impact"
      },
      {
        profileType: "High numerical + High impact motivation",
        satisfaction: "High",
        reasoning: "See data solving real problems"
      },
      {
        profileType: "High logical but low numerical aptitude",
        satisfaction: "Low",
        reasoning: "Statistics will be constant struggle"
      }
    ],

    notes: "Numerical aptitude is non-negotiable. Logical thinking essential. Communication skills increasingly important. EI helps greatly in cross-functional work."
  },

  // ==================== DOCTOR (MBBS) ====================
  {
    careerTitle: "Doctor (MBBS)",
    careerId: "doctor-mbbs-001",
    successRate: 72,

    successProfile: {
      essentialRIASEC: ["I", "S"],
      idealAptitude: {
        logical: 8,
        numerical: 6,
        verbal: 7,
        spatial: 7
      },
      idealPersonality: {
        independence: 6,
        riskTolerance: 6,
        teamOrientation: 8,
        detailOrientation: 9,
        emotionalStability: 8
      },
      idealStrengths: ["Linguistic", "Interpersonal", "Intrapersonal", "Logical"],
      idealMotivators: ["Impact", "Mastery"],
      minEI: 7
    },

    strugglingProfiles: {
      problematicRIASEC: ["R", "C"],
      aptitudeLimits: {
        lowLogical: "Difficult to understand medical principles and diagnosis",
        lowVerbal: "Communication with patients is poor",
        lowSpatial: "Difficulty with anatomy, surgery"
      },
      personalityMismatches: [
        "Very high independence → struggles with collaborative healthcare teams",
        "Very high risk tolerance → poor patient safety focus",
        "Low detail orientation → dangerous in medicine (life-or-death work)",
        "Low emotional stability → burnout, patient safety risk"
      ],
      motivatorMismatches: [
        "High status motivation only → lack compassion for patients",
        "Low impact motivation → why become doctor?",
        "High financial motivation + Low service motivation → ethical conflicts"
      ],
      minEIRequired: 6
    },

    compatibilityByProfile: [
      {
        profileDescription: "High I+S, Excellent detail orientation, Strong EI, High impact",
        compatibilityScore: 95,
        likelySuccess: true,
        likelyChallenges: ["May be emotionally drained by suffering", "Risk of burnout from overwork"],
        recommendations: ["Develop work-life balance", "Self-care practices", "Mentorship relationships"]
      },
      {
        profileDescription: "High I+S, Good detail orientation, Moderate EI",
        compatibilityScore: 82,
        likelySuccess: true,
        likelyChallenges: ["May distance self from patient emotions", "Technical focus but not compassionate"],
        recommendations: ["Develop empathy; remember why you chose medicine"]
      },
      {
        profileDescription: "High R, Low S, High independence, Low detail orientation",
        compatibilityScore: 25,
        likelySuccess: false,
        likelyChallenges: ["Lack of compassion for patients", "Dangerous lack of detail orientation"],
        recommendations: ["Not suitable for medicine", "Consider engineering in medical devices instead"]
      },
      {
        profileDescription: "High I but low EI, low interpersonal skills",
        compatibilityScore: 40,
        likelySuccess: false,
        likelyChallenges: ["Cannot communicate with patients effectively", "Team conflicts"],
        recommendations: ["Could pursue research medicine instead of patient care", "Consider pathology/radiology (less patient interaction)"]
      }
    ],

    commonStruggles: [
      {
        scenario: "Student with high aptitude but low emotional resilience",
        struggle: "Intellectually capable but emotionally devastated by patient deaths",
        outcome: "Mental health crisis; burnout; may leave medicine",
        recommendation: "Build emotional resilience NOW through practice; mentor relationships; self-care"
      },
      {
        scenario: "Student motivated only by prestige/money",
        struggle: "Lacks compassion; patients sense it; low job satisfaction",
        outcome: "Burned out, unfulfilled, or unethical practice",
        recommendation: "Reflect on true motivation; medicine needs service-oriented doctors"
      },
      {
        scenario: "Very intelligent but poor attention to detail",
        struggle: "Makes critical errors in diagnosis/treatment",
        outcome: "Patient harm; professional consequences",
        recommendation: "Develop checklists, second-opinion habits; acknowledge limitation"
      },
      {
        scenario: "Highly collaborative, struggles with autonomous decision-making",
        struggle: "In emergencies needs to make quick decisions alone",
        outcome: "Paralysis or panic; poor patient outcomes",
        recommendation: "Build confidence in solo decision-making; emergency medicine training"
      }
    ],

    satisfactionByType: [
      {
        profileType: "High I+S, High EI, High impact motivation",
        satisfaction: "Very High",
        reasoning: "Help people directly; intellectual challenge; team environment"
      },
      {
        profileType: "High I, High mastery, Lower social focus",
        satisfaction: "Moderate",
        reasoning: "Can pursue research or specialized medicine; less patient interaction"
      },
      {
        profileType: "High prestige motivation, Low impact motivation",
        satisfaction: "Low",
        reasoning: "Will feel empty; medicine has significant suffering and low pay relative to effort"
      },
      {
        profileType: "Low emotional stability",
        satisfaction: "Very Low",
        reasoning: "Will be overwhelmed; high suicide rate in medical profession"
      }
    ],

    notes: "HIGH EI is crucial - medicine has high suicide rate among those without it. Detail orientation is non-negotiable (life/death). Impact motivation essential for satisfaction. Consider personality fit, not just aptitude."
  },

  // ==================== ENTREPRENEUR ====================
  {
    careerTitle: "Entrepreneur",
    careerId: "entrepreneur-001",
    successRate: 65,

    successProfile: {
      essentialRIASEC: ["E", "I", "R"],
      idealAptitude: {
        logical: 7,
        numerical: 7,
        verbal: 8,
        spatial: 6
      },
      idealPersonality: {
        independence: 9,
        riskTolerance: 9,
        teamOrientation: 7,
        detailOrientation: 6,
        emotionalStability: 8
      },
      idealStrengths: ["Linguistic", "Logical-Mathematical", "Interpersonal"],
      idealMotivators: ["Innovation", "Leadership", "Impact"],
      minEI: 6
    },

    strugglingProfiles: {
      problematicRIASEC: ["C", "S"],
      aptitudeLimits: {
        lowNumerical: "Cannot do financial analysis, fundraising",
        lowLogical: "Cannot think through business problems systematically",
        lowVerbal: "Cannot pitch or persuade investors/customers"
      },
      personalityMismatches: [
        "Very low independence → cannot make decisions autonomously",
        "Very low risk tolerance → cannot handle startup failure risk",
        "Very low emotional stability → cannot handle rejection and uncertainty",
        "Very high detail orientation → gets stuck in perfectionism, never launches"
      ],
      motivatorMismatches: [
        "High stability motivation → startups are unstable",
        "High social status → wrong motivation for entrepreneurship",
        "No innovation drive → what's the point?"
      ],
      minEIRequired: 5
    },

    compatibilityByProfile: [
      {
        profileDescription: "High E+I+R, Risk-loving, Excellent verbal, Independent",
        compatibilityScore: 95,
        likelySuccess: true,
        likelyChallenges: ["May neglect operations/details", "Overconfidence risks"],
        recommendations: ["Build strong ops team to balance", "Humility and mentorship"]
      },
      {
        profileDescription: "High E, High numerical, Good verbal, Moderate risk tolerance",
        compatibilityScore: 80,
        likelySuccess: true,
        likelyChallenges: ["Might be risk-averse for startup", "Could succeed with right team"],
        recommendations: ["Build team to fill gaps", "Start with less risky venture"]
      },
      {
        profileDescription: "High I, Low E, Very risk-averse",
        compatibilityScore: 35,
        likelySuccess: false,
        likelyChallenges: ["Cannot do sales/fundraising", "Fear of failure paralyzes", "No leadership skills"],
        recommendations: ["Consider joining startup as first employee", "Or co-found with a business person"]
      },
      {
        profileDescription: "Low independence, high stability need, risk-averse",
        compatibilityScore: 10,
        likelySuccess: false,
        likelyChallenges: ["Fundamental personality mismatch with entrepreneurship"],
        recommendations: ["Not suitable; stick to employed roles"]
      }
    ],

    commonStruggles: [
      {
        scenario: "Brilliant idea person but poor at execution/operations",
        struggle: "Great vision but company falls apart operationally",
        outcome: "Startup fails despite good idea; investor loss",
        recommendation: "Co-found with operations-focused partner; hire strong COO"
      },
      {
        scenario: "Risk-averse person starting startup",
        struggle: "Cannot make bold decisions; constantly second-guesses",
        outcome: "Slow progress; misses windows of opportunity",
        recommendation: "Not suited for startups; join established company"
      },
      {
        scenario: "Low EI founder",
        struggle: "Cannot inspire team; investors don't trust them",
        outcome: "Loses best people; cannot raise funding",
        recommendation: "Work on EI; bring co-founder with high EI"
      },
      {
        scenario: "Perfectionist founder",
        struggle: "Never launches MVP; gets stuck on small things",
        outcome: "Competitors beat them to market",
        recommendation: "Embrace \"done is better than perfect\"; ship fast"
      }
    ],

    satisfactionByType: [
      {
        profileType: "High independence + High risk tolerance + High innovation",
        satisfaction: "Very High",
        reasoning: "Building something from nothing; autonomy; creating impact"
      },
      {
        profileType: "High innovation but low risk tolerance",
        satisfaction: "Moderate",
        reasoning: "Can start venture-backed or bootstrap lower-risk ideas"
      },
      {
        profileType: "High social status motivation",
        satisfaction: "Low",
        reasoning: "Most startups fail; need to love the process, not just success"
      },
      {
        profileType: "High stability need",
        satisfaction: "Very Low",
        reasoning: "Startups are inherently unstable; will be constantly anxious"
      }
    ],

    notes: "Risk tolerance and independence are CRUCIAL. Most important: motivation (love the problem, not just success). EI matters greatly for team building. Execution ability more important than ideas."
  },

  // ==================== LAWYER ====================
  {
    careerTitle: "Lawyer",
    careerId: "lawyer-001",
    successRate: 68,

    successProfile: {
      essentialRIASEC: ["I", "E", "C"],
      idealAptitude: {
        logical: 8,
        numerical: 6,
        verbal: 9,
        spatial: 5
      },
      idealPersonality: {
        independence: 7,
        riskTolerance: 6,
        teamOrientation: 7,
        detailOrientation: 9,
        emotionalStability: 8
      },
      idealStrengths: ["Linguistic", "Logical-Mathematical", "Interpersonal"],
      idealMotivators: ["Mastery", "Impact"],
      minEI: 6
    },

    strugglingProfiles: {
      problematicRIASEC: ["R", "A"],
      aptitudeLimits: {
        lowVerbal: "Cannot argue cases effectively",
        lowLogical: "Cannot analyze complex legal arguments",
        lowReading: "Cannot process law volumes efficiently"
      },
      personalityMismatches: [
        "Very low detail orientation → miss critical legal points",
        "Very low independence → weak in negotiations",
        "Low emotional stability → crumble under courtroom pressure",
        "Very high creativity/artistic → impatient with legal precedents"
      ],
      motivatorMismatches: [
        "Low mastery motivation → won't put in years to become expert",
        "High artistic creativity → law is rigid, frustrating",
        "High stability + Low assertiveness → will not advocate forcefully"
      ],
      minEIRequired: 5
    },

    compatibilityByProfile: [
      {
        profileDescription: "High I+E+C, Excellent verbal, Detail-oriented, Strong EI",
        compatibilityScore: 93,
        likelySuccess: true,
        likelyChallenges: ["May find some practice areas boring", "Work-life balance in BigLaw"],
        recommendations: ["Choose practice area carefully", "Manage hours expectations"]
      },
      {
        profileDescription: "High I+C, Good verbal, Lower social skills",
        compatibilityScore: 78,
        likelySuccess: true,
        likelyChallenges: ["Better in research than courtroom", "Not ideal for litigation"],
        recommendations: ["Consider corporate law or research-focused roles"]
      },
      {
        profileDescription: "High A (artistic), Good verbal but low logical",
        compatibilityScore: 35,
        likelySuccess: false,
        likelyChallenges: ["Law's rigidity will frustrate", "Cannot handle logical reasoning demands"],
        recommendations: ["Consider creative writing, journalism", "Not suitable for law"]
      },
      {
        profileDescription: "Low verbal, low logical, high detail orientation",
        compatibilityScore: 20,
        likelySuccess: false,
        likelyChallenges: ["Two critical gaps: verbal and logical ability"],
        recommendations: ["Not suitable for law school"]
      }
    ],

    commonStruggles: [
      {
        scenario: "Low emotional stability in litigation lawyer",
        struggle: "Courtroom hostility and aggression causes anxiety/depression",
        outcome: "Burnout; substance abuse; exit from law",
        recommendation: "Consider non-litigation law (corporate, tax, intellectual property)"
      },
      {
        scenario: "Creative person forced into legal structure",
        struggle: "Finds law tedious, precedent-bound, uncreative",
        outcome: "Unhappy lawyer; performs poorly",
        recommendation: "Choose creative law practice (entertainment, IP, startup law)"
      },
      {
        scenario: "Poor verbal skills despite trying",
        struggle: "Cannot argue effectively; clients lose cases",
        outcome: "Poor performance reviews; career stalls",
        recommendation: "Focus on contract/research roles rather than litigation"
      },
      {
        scenario: "High status motivation but low work ethic",
        struggle: "Prestige of lawyer career attracts them, but hard work doesn't",
        outcome: "Fails law school or barely passes; struggles in practice",
        recommendation: "Law is not a shortcut to status; need genuine mastery motivation"
      }
    ],

    satisfactionByType: [
      {
        profileType: "High I+E, High verbal, High mastery, Strong advocacy",
        satisfaction: "Very High",
        reasoning: "Master complex law; help people; win cases; intellectual challenge"
      },
      {
        profileType: "High I, Lower verbal, High mastery",
        satisfaction: "High",
        reasoning: "Can pursue legal research, contracts, corporate law"
      },
      {
        profileType: "Low verbal aptitude",
        satisfaction: "Low",
        reasoning: "Central to legal work; will struggle constantly"
      },
      {
        profileType: "Creative, artistic personality",
        satisfaction: "Very Low",
        reasoning: "Law's rigidity and precedent-focus will be frustrating"
      }
    ],

    notes: "Verbal ability is non-negotiable (more important than numerical). Detail orientation essential. EI crucial for interpersonal law. High burnout profession - emotional stability matters greatly."
  }
];

/**
 * Helper: Get career compatibility for a psychometric profile
 */
export function getCareerCompatibility(
  careerTitle: string,
  profile: PsychometricProfile
): CareerSuccessPrediction | null {
  return (
    CAREER_COMPATIBILITY_MATRIX.find(
      c => c.careerTitle.toLowerCase() === careerTitle.toLowerCase()
    ) || null
  );
}

/**
 * Helper: Calculate compatibility score for a profile
 */
export function calculateCompatibilityScore(
  career: CareerSuccessPrediction,
  profile: PsychometricProfile
): number {
  let score = 50; // Start at neutral

  // Check essential RIASEC codes
  const hasEssentialRIASEC = career.successProfile.essentialRIASEC.some(code =>
    profile.riasec.includes(code)
  );
  if (hasEssentialRIASEC) {
    score += 15;
  }

  // Check problematic RIASEC codes
  const hasProblematicRIASEC = career.strugglingProfiles.problematicRIASEC.some(
    code => profile.riasec.includes(code)
  );
  if (hasProblematicRIASEC) {
    score -= 10;
  }

  // Check aptitude alignment
  const aptitudeGaps = Object.entries(
    career.successProfile.idealAptitude
  ).filter(([key, required]) => {
    if (!required) return false;
    const actual = profile.aptitude[key as keyof typeof profile.aptitude];
    return actual < (required - 2); // Allow 2 point gap
  }).length;

  score -= aptitudeGaps * 5;

  // Check personality alignment
  const personalityGaps = Object.entries(
    career.successProfile.idealPersonality
  ).filter(([key, required]) => {
    if (!required) return false;
    const actual = profile.personality[key as keyof typeof profile.personality];
    return Math.abs(actual - required) > 3;
  }).length;

  score -= personalityGaps * 3;

  // Check motivators alignment
  const motivatorMatches = career.successProfile.idealMotivators.filter(m =>
    profile.motivators[m.toLowerCase().replace(/\s/g, "") as keyof typeof profile.motivators] > 5
  ).length;

  score += motivatorMatches * 5;

  // Check EI requirement
  if (career.successProfile.minEI && profile.emotionalIntelligence < career.successProfile.minEI) {
    score -= 10;
  }

  // Clamp to 0-100
  return Math.max(0, Math.min(100, score));
}

/**
 * Helper: Get common struggles for a profile in a career
 */
export function getCommonStrugglesForProfile(
  career: CareerSuccessPrediction,
  profile: PsychometricProfile
): CareerSuccessPrediction["commonStruggles"] {
  const struggles = career.commonStruggles.filter(struggle => {
    // Match struggles based on profile characteristics
    const text = (struggle.scenario + struggle.struggle).toLowerCase();

    // Check if profile characteristics match the struggle scenario
    if (text.includes("low") && profile.aptitude.logical < 5) return true;
    if (text.includes("high risk") && profile.personality.riskTolerance < 3) return true;
    if (text.includes("low emotional") && profile.emotionalIntelligence < 5) return true;
    if (text.includes("perfectionist") && profile.personality.detailOrientation > 8) return true;

    return false;
  });

  return struggles;
}

/**
 * Helper: Get satisfaction level for a profile in a career
 */
export function getSatisfactionForProfile(
  career: CareerSuccessPrediction,
  profile: PsychometricProfile
): CareerSuccessPrediction["satisfactionByType"][0] | null {
  // Find matching satisfaction profile
  const bestMatch = career.satisfactionByType.reduce(
    (best, current) => {
      // Score how well this satisfaction profile matches
      let score = 0;

      if (
        current.profileType.includes("High independence") &&
        profile.personality.independence > 7
      )
        score++;
      if (current.profileType.includes("Low emotional") && profile.emotionalIntelligence < 5)
        score++;
      if (current.profileType.includes("High EI") && profile.emotionalIntelligence > 7)
        score++;
      if (current.profileType.includes("High impact") && profile.motivators.impact > 7)
        score++;

      return score > (best.score || 0) ? { item: current, score } : best;
    },
    { item: null as any, score: 0 }
  );

  return bestMatch.item || career.satisfactionByType[0];
}

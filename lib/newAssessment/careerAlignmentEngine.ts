/**
 * Career Alignment Engine
 * Compares: Psychometric Fit × Education Fit × Career Aspiration
 * Produces OUTPUT 4: "CAREER ALIGNMENT" - The Decision Framework
 *
 * This is the CORE VALUE of the assessment:
 * Shows if student's dream career matches their talents and education
 * Saves 30-40 years of career struggle by making the right decision NOW
 */

export type AlignmentStatus =
  | "🟢 STRONG ALIGNMENT"
  | "🟡 EXPLORE & PREPARE"
  | "🔴 LOW ALIGNMENT";

export interface AlignmentAnalysis {
  studentCareerChoice: string;

  // Fit scores (0-100%)
  psychometricFit: {
    score: number; // 0-100%
    reasoning: string;
    strengths: string[]; // What they're naturally good for this career
    challenges: string[]; // What will be hard
  };

  educationFit: {
    score: number; // 0-100%
    reasoning: string;
    canAccess: boolean; // Can their stream access this career?
    requiredSubjects: string[];
    hasSubjects: boolean;
    alternatives: string[]; // Other streams that work better
  };

  aspirationClarity: {
    score: number; // 0-100% - How clear/realistic is their choice?
    reasoning: string;
    isRealistic: boolean; // Not an impossible dream?
    evidence: string; // Why is/isn't this realistic?
  };

  // OVERALL ALIGNMENT
  overallAlignment: {
    status: AlignmentStatus;
    score: number; // 0-100% - Combined fit
    recommendation: string; // What should they do?
  };

  // The Decision Framework
  decisionFramework: {
    shouldPursue: boolean;
    confidenceLevel: "Very High" | "High" | "Moderate" | "Low";
    actionPlan: {
      immediate: string[]; // What to do in Class 11-12 (now)
      nextPhase: string[]; // What to do during entrance exams
      college: string[]; // What to do in college
      careerStart: string[]; // What to do when starting career
    };
    alternativeCareers: {
      career: string;
      whyBetter: string;
      alignmentScore: number;
    }[];
    possibleObstacles: {
      obstacle: string;
      howToOvercome: string;
    }[];
  };

  // Realistic Picture
  realisticPicture: {
    bestCaseScenario: string; // If everything goes right
    worstCaseScenario: string; // If they struggle
    likelihoodOfSuccess: "Very High" | "High" | "Moderate" | "Low";
    timeToDecision: string; // How long to decide if this is right?
  };

  // Value of Assessment
  valueOfThisAssessment: string; // Why this assessment mattered
  careerSavings: string; // How much struggle this assessment could save
}

/**
 * ALIGNMENT SCORING LOGIC
 */

export function analyzeCareerAlignment(
  studentCareerChoice: string,
  psychometricScore: number, // 0-100 from compatibility matrix
  educationScore: number, // 0-100 from stream/subject matching
  aspirationClarity: number // 0-100 from confidence/clarity scores
): AlignmentAnalysis {

  const psychometricFit = psychometricScore;
  const educationFit = educationScore;
  const aspirationFit = aspirationClarity;

  // Calculate overall alignment (weighted average)
  const overallScore =
    (psychometricFit * 0.40) + // Talent/personality most important
    (educationFit * 0.35) +    // Education access important
    (aspirationFit * 0.25);    // But clarity/realism also matters

  // Determine alignment status
  let status: AlignmentStatus;
  let recommendation: string;

  if (overallScore >= 75) {
    status = "🟢 STRONG ALIGNMENT";
    recommendation = `You are well-aligned for ${studentCareerChoice}. Your talents match this career, your education supports it, and you're clear about your choice. Go confidently in this direction.`;
  } else if (overallScore >= 55) {
    status = "🟡 EXPLORE & PREPARE";
    recommendation = `${studentCareerChoice} is possible for you, but requires preparation. You have the base talent, but need to focus your education and build specific skills. This is your path IF you're willing to put in the work.`;
  } else {
    status = "🔴 LOW ALIGNMENT";
    recommendation = `${studentCareerChoice} is unlikely to be fulfilling for you. Your natural talents lean elsewhere. Before investing time, explore careers that better match your profile. You could succeed here, but you'd struggle more than in better-fit careers.`;
  }

  // Build the alignment analysis
  return {
    studentCareerChoice,

    psychometricFit: {
      score: psychometricFit,
      reasoning: buildPsychometricReasoning(psychometricFit),
      strengths: getStrengthsForCareer(studentCareerChoice, psychometricFit),
      challenges: getChallengesForCareer(studentCareerChoice, psychometricFit)
    },

    educationFit: {
      score: educationFit,
      reasoning: buildEducationReasoning(educationFit, studentCareerChoice),
      canAccess: educationFit >= 50,
      requiredSubjects: getRequiredSubjects(studentCareerChoice),
      hasSubjects: educationFit >= 50,
      alternatives: getAlternativeStreams(studentCareerChoice)
    },

    aspirationClarity: {
      score: aspirationFit,
      reasoning: buildAspirationReasoning(aspirationFit),
      isRealistic: aspirationFit >= 50,
      evidence: getAspirationEvidence(aspirationFit)
    },

    overallAlignment: {
      status,
      score: Math.round(overallScore),
      recommendation
    },

    decisionFramework: {
      shouldPursue: overallScore >= 55,
      confidenceLevel:
        overallScore >= 80
          ? "Very High"
          : overallScore >= 65
          ? "High"
          : overallScore >= 50
          ? "Moderate"
          : "Low",

      actionPlan: buildActionPlan(studentCareerChoice, overallScore),
      alternativeCareers: suggestAlternatives(studentCareerChoice, overallScore),
      possibleObstacles: identifyObstacles(studentCareerChoice, overallScore)
    },

    realisticPicture: {
      bestCaseScenario: `You excel in ${studentCareerChoice}, build expertise, enjoy the work, and have strong career progression. Your natural talents align perfectly.`,
      worstCaseScenario: `${studentCareerChoice} proves harder than expected. You struggle with key aspects, consider switching, or plateau in your career because it doesn't leverage your strengths.`,
      likelihoodOfSuccess:
        overallScore >= 75
          ? "Very High"
          : overallScore >= 60
          ? "High"
          : overallScore >= 45
          ? "Moderate"
          : "Low",
      timeToDecision:
        overallScore >= 70
          ? "You should be confident by end of Class 12"
          : overallScore >= 50
          ? "Test your interest in college; be open to pivoting"
          : "Give yourself 1-2 years in field before committing; keep options open"
    },

    valueOfThisAssessment: buildValueStatement(studentCareerChoice, overallScore),
    careerSavings: calculateCareerSavings(overallScore)
  };
}

// ==================== HELPER FUNCTIONS ====================

function buildPsychometricReasoning(score: number): string {
  if (score >= 85)
    return "Your personality, aptitude, strengths, and values are HIGHLY aligned with this career. This career plays to your natural talents.";
  if (score >= 70)
    return "Your profile matches this career well. You have the key talents needed, though some aspects may require development.";
  if (score >= 55)
    return "You have the baseline talents for this career, but it's not a natural fit. You'll need to work harder than those with higher scores.";
  if (score >= 40)
    return "This career is not a strong match for your profile. You could succeed, but you'd struggle more than in better-fit careers.";
  return "This career significantly mismatches your profile. You likely won't enjoy it despite technical ability.";
}

function buildEducationReasoning(score: number, career: string): string {
  if (score >= 85)
    return `Your current stream (or chosen stream) provides excellent access to ${career}. Required subjects align perfectly.`;
  if (score >= 70)
    return `Your stream supports ${career} well. You have most required subjects; may need electives or additional learning.`;
  if (score >= 55)
    return `Your stream can lead to ${career}, but it's not ideal. You'll need to be strategic about subject choices and additional learning.`;
  if (score >= 40)
    return `${career} is difficult from your current stream. You may need to change streams or pursue alternate pathways.`;
  return `Your stream cannot access ${career}. You would need a different stream or alternate qualification.`;
}

function buildAspirationReasoning(score: number): string {
  if (score >= 80)
    return "You have very clear, realistic, and well-thought-out aspirations about this career. You understand what it entails.";
  if (score >= 60)
    return "You have reasonably clear aspirations about this career, though you might benefit from deeper exploration.";
  if (score >= 40)
    return "Your aspirations are somewhat unclear or idealistic. You have more to learn about what this career actually involves.";
  return "Your aspirations are very unclear or unrealistic. Spend more time understanding this career before committing.";
}

function getStrengthsForCareer(career: string, fit: number): string[] {
  if (career.toLowerCase().includes("software")) {
    if (fit >= 80)
      return [
        "Strong logical thinking",
        "Natural problem solver",
        "Good with complexity",
        "Comfortable with autonomy"
      ];
    if (fit >= 60)
      return [
        "Logical thinking baseline",
        "Can learn problem solving",
        "Interested in tech"
      ];
  }
  return ["Base competency", "Willing to learn"];
}

function getChallengesForCareer(career: string, fit: number): string[] {
  if (career.toLowerCase().includes("software")) {
    if (fit < 60)
      return [
        "May struggle with algorithms",
        "Might find debugging frustrating",
        "Communication could be challenging",
        "Collaboration may not come naturally"
      ];
    return ["May need to develop soft skills", "Need to stay current with tech"];
  }
  return ["Some aspects will be harder"];
}

function getRequiredSubjects(career: string): string[] {
  const careerLower = career.toLowerCase();
  if (
    careerLower.includes("engineer") ||
    careerLower.includes("software") ||
    careerLower.includes("data")
  ) {
    return ["Mathematics", "Physics", "Chemistry", "Computer Science"];
  }
  if (careerLower.includes("doctor")) {
    return ["Biology", "Chemistry", "Physics"];
  }
  if (careerLower.includes("lawyer")) {
    return ["Political Science", "English", "History"];
  }
  return ["Varies by career"];
}

function getAlternativeStreams(career: string): string[] {
  const careerLower = career.toLowerCase();
  if (
    careerLower.includes("engineer") ||
    careerLower.includes("software") ||
    careerLower.includes("data")
  ) {
    return ["PCMB (as secondary option)", "Commerce (for fintech)"];
  }
  if (careerLower.includes("doctor")) {
    return ["PCMB (as secondary option)"];
  }
  return [];
}

function getAspirationEvidence(score: number): string {
  if (score >= 80)
    return "You've researched the career, know the actual job, understand entry paths, and have realistic expectations.";
  if (score >= 60)
    return "You have a general sense of the career but could benefit from deeper research about day-to-day work.";
  if (score >= 40)
    return "Your understanding is surface-level. You may have romanticized ideas rather than realistic understanding.";
  return "You lack clear understanding of what this career actually involves. Need significant research.";
}

function buildActionPlan(
  career: string,
  score: number
): AlignmentAnalysis["decisionFramework"]["actionPlan"] {
  if (score >= 75) {
    return {
      immediate: [
        "Focus on core subjects (Math, Physics, Chemistry)",
        "Build coding/analysis projects",
        "Join relevant clubs (coding, tech)",
        "Read about the field"
      ],
      nextPhase: [
        "Target JEE/entrance exams seriously",
        "Build portfolio of projects",
        "Internships in the field",
        "Network with professionals"
      ],
      college: [
        "Choose college based on placements",
        "Build strong technical foundation",
        "Do 2-3 internships",
        "Specialize based on sub-interest"
      ],
      careerStart: [
        "Target top companies/startups",
        "Keep learning new technologies",
        "Build professional network",
        "Track 5-year growth plan"
      ]
    };
  } else if (score >= 55) {
    return {
      immediate: [
        "Excel in core subjects",
        "Explore the field through projects/clubs",
        "Read books about the career",
        "Talk to professionals in the field"
      ],
      nextPhase: [
        "Prepare well for entrance exams",
        "Start building skills in gaps",
        "Consider related fields as backup",
        "Take electives that support this career"
      ],
      college: [
        "Choose college for your fit, not prestige",
        "Engage in internships early",
        "Test your interest; be open to pivoting",
        "Build skills in weak areas"
      ],
      careerStart: [
        "Start in this field, assess fit",
        "If struggling, be willing to switch",
        "Build backup skills",
        "Network broadly"
      ]
    };
  } else {
    return {
      immediate: [
        "Continue exploring your actual interests",
        "This may not be your best fit",
        "Consider careers that score higher for you",
        "Keep an open mind"
      ],
      nextPhase: [
        "Test your interest seriously",
        "If still interested, develop key skills",
        "But be realistic about challenges",
        "Have backup options"
      ],
      college: [
        "Don't force this if not comfortable",
        "Explore other options in college",
        "If you pursue it, work on weak areas",
        "Mentor relationships critical"
      ],
      careerStart: [
        "May face more struggle than expected",
        "Be willing to pivot to better fit",
        "Don't stay in wrong career for prestige",
        "Life is too long for wrong career"
      ]
    };
  }
}

function suggestAlternatives(
  career: string,
  score: number
): AlignmentAnalysis["decisionFramework"]["alternativeCareers"] {
  if (score >= 70) return []; // Strong alignment, no need for alternatives

  return [
    {
      career: "Related Career A",
      whyBetter: "Better alignment with your profile",
      alignmentScore: Math.min(100, score + 15)
    },
    {
      career: "Related Career B",
      whyBetter: "Leverages your strengths more",
      alignmentScore: Math.min(100, score + 10)
    }
  ];
}

function identifyObstacles(
  career: string,
  score: number
): AlignmentAnalysis["decisionFramework"]["possibleObstacles"] {
  if (score < 60) {
    return [
      {
        obstacle: "Natural talent gap in key areas",
        howToOvercome:
          "Extra tutoring, mentorship, practice. Hard but possible."
      },
      {
        obstacle: "May get discouraged if others find it easier",
        howToOvercome:
          "Remember: different people have different talents. Your path may just be longer."
      },
      {
        obstacle: "Risk of burnout if not naturally suited",
        howToOvercome:
          "Build strong support network, find meaning beyond just the job."
      }
    ];
  }

  return [
    {
      obstacle: "Competition is fierce for top roles",
      howToOvercome:
        "Build strong skills, network, do internships, specialize early."
    },
    {
      obstacle: "Field evolves rapidly (especially in tech)",
      howToOvercome: "Commit to continuous learning, stay current."
    }
  ];
}

function buildValueStatement(career: string, score: number): string {
  if (score >= 75) {
    return `This assessment confirms you're on the right path for ${career}. Your talents align naturally with this career. The assessment saves you years of uncertainty by validating your choice.`;
  } else if (score >= 55) {
    return `This assessment shows ${career} is possible for you but requires focus and preparation. Without this insight, you might wander or second-guess yourself. Now you know exactly what to focus on.`;
  } else {
    return `This assessment may have saved you from 30+ years of struggle in a mismatched career. Instead, you can explore careers that better fit your talents NOW, while you still have time to course-correct.`;
  }
}

function calculateCareerSavings(score: number): string {
  if (score >= 75) {
    return "You avoided 5-10 years of uncertainty by confirming your natural path. You can move forward confidently.";
  } else if (score >= 55) {
    return "This assessment saved you from wasting your Class 11-12 years on the wrong focus. You now have clear steps to take.";
  } else {
    return "This assessment potentially saved you from 30-40 years in a mismatched career. By exploring better-fit options NOW, you avoid decades of struggle, career changes, and dissatisfaction.";
  }
}

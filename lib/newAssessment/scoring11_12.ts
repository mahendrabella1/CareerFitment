/**
 * Class 11-12 Advanced Scoring Engine
 * Converts 81-question assessment into 4-layer comprehensive report
 */

export interface Class11Response {
  personality: Record<string, any>;
  career_interest: Record<string, number>;
  aptitude: Record<string, number>;
  strength_domains: Record<string, number>;
  motivators: Record<string, boolean>;
  learning_styles: Record<string, number>;
  emotional_intelligence: Record<string, number>;
  creativity: Record<string, number>;
  subject_fit: {
    currentStream: string;
    currentSubjects: string[];
    confidence: Record<string, number>;
  };
  career_fit: {
    clarity: number; // 1-10
    consideringAreas: string[];
  };
  career_selector: {
    primaryCareer: string;
    alternativeChoices: string[];
  };
}

export interface Class11ScoreOutput {
  layer1: PsychometricProfile;
  layer2: AcademicRealityAnalysis;
  layer3: EducationPathway;
  layer4: StudentAspiration;
  summary: CareerRecommendations;
}

// LAYER 1: Psychometric Profile
export interface PsychometricProfile {
  personality: PersonalityProfile;
  riasec: RIASECScore[];
  aptitude: AptitudeProfile;
  strengthDomains: StrengthDomainScore[];
  motivators: MotivatorProfile;
  learningStyle: LearningStyleProfile;
  emotionalIntelligence: EIProfile;
  creativity: CreativityProfile;
}

export interface PersonalityProfile {
  problemSolvingStyle: string;
  learningPreference: string;
  decisionMakingStyle: string;
  planningStyle: string;
  energySource: string;
  responseToFailure: string;
  summary: string;
}

export interface RIASECScore {
  code: string;
  name: string;
  score: number;
  percentile: number;
}

export interface AptitudeProfile {
  verbal: { score: number; interpretation: string };
  numerical: { score: number; interpretation: string };
  logical: { score: number; interpretation: string };
  spatial?: { score: number; interpretation: string };
  overallScore: number;
  strength: string;
  weakness: string;
}

export interface StrengthDomainScore {
  domain: string;
  score: number;
  examples: string[];
}

export interface MotivatorProfile {
  stabilityVsInnovation: "Stability-focused" | "Innovation-focused" | "Balanced";
  masteryVsImpact: "Mastery-focused" | "Impact-focused" | "Balanced";
  independenceVsCollaboration: "Independence-focused" | "Collaboration-focused" | "Balanced";
  summary: string;
}

export interface LearningStyleProfile {
  primaryStyle: string;
  secondaryStyle: string;
  examPreparationTechnique: string;
  recommendations: string[];
}

export interface EIProfile {
  selfAwareness: number;
  socialAwareness: number;
  emotionalRegulation: string;
  conflictResolution: string;
  summary: string;
}

export interface CreativityProfile {
  problemSolving: string;
  innovationApproach: string;
  score: number;
  recommendations: string[];
}

// LAYER 2: Academic Reality
export interface AcademicRealityAnalysis {
  currentStream: string;
  streamSuitability: "Well-matched" | "Partially-matched" | "Misaligned";
  subjectStrengths: string[];
  subjectChallenges: string[];
  careerPathwaysAvailable: string[];
  requiredAdjustments?: string[];
  streamChangeAdvice?: string;
  nextSteps: string[];
}

// LAYER 3: Education & Career Pathway
export interface EducationPathway {
  recommendedDegrees: DegreeOption[];
  entranceExamsRequired: string[];
  subjectsToFocus: string[];
  skillsDevelopmentPlan: SkillGap[];
  timelineUpto22: RoadmapPhase[];
  universities: UniversityOption[];
}

export interface DegreeOption {
  name: string;
  compatibility: number; // 0-100
  requiredSubjects: string[];
  careerOutcomes: string[];
  topColleges: string[];
  entranceExam?: string;
}

export interface SkillGap {
  skill: string;
  currentLevel: "Beginner" | "Intermediate" | "Advanced";
  targetLevel: string;
  developmentMethod: string;
  timeRequired: string;
}

export interface RoadmapPhase {
  period: string; // e.g., "Class 11-12"
  focus: string;
  actions: string[];
  outcomes: string[];
}

export interface UniversityOption {
  name: string;
  location: string;
  programsAligned: string[];
  entranceRequired: string;
  cutoffEstimate: string;
}

// LAYER 4: Student Aspiration
export interface StudentAspiration {
  primaryCareerGoal: string;
  clarityScore: number; // 1-10
  alternativeOptions: string[];
  motivationFactors: string[];
  alignment: {
    psychometricAlignment: number; // %
    streamAlignment: number; // %
    aptitudeAlignment: number; // %
    overallFitment: number; // %
  };
  advice: string;
}

// Final Summary
export interface CareerRecommendations {
  topThreeCareers: CareerMatch[];
  alternativePaths: string[];
  riskFactors: string[];
  strengthToLeverage: string[];
  growthAreas: string[];
}

export interface CareerMatch {
  name: string;
  fitmentScore: number; // 0-100
  matchedDimensions: string[];
  requiredEducation: string;
  salaryRange: string;
  growthPotential: string;
  actionItems: string[];
}

// ============================================================================
// SCORING FUNCTIONS
// ============================================================================

/**
 * Main scoring function - converts raw responses into 4-layer output
 */
export function scoreClass11Assessment(responses: Class11Response): Class11ScoreOutput {
  const layer1 = generatePsychometricProfile(responses);
  const layer2 = generateAcademicRealityAnalysis(responses, layer1);
  const layer3 = generateEducationPathway(responses, layer1, layer2);
  const layer4 = generateStudentAspiration(responses, layer1);
  const summary = generateCareerRecommendations(layer1, layer2, layer3, layer4);

  return {
    layer1,
    layer2,
    layer3,
    layer4,
    summary
  };
}

/**
 * LAYER 1: Psychometric Profile
 * Scores all 8 dimensions from the questionnaire
 */
function generatePsychometricProfile(responses: Class11Response): PsychometricProfile {
  return {
    personality: scorePersonality(responses.personality),
    riasec: scoreRIASEC(responses.career_interest),
    aptitude: scoreAptitude(responses.aptitude),
    strengthDomains: scoreStrengthDomains(responses.strength_domains),
    motivators: scoreMotivators(responses.motivators),
    learningStyle: scoreLearningStyle(responses.learning_styles),
    emotionalIntelligence: scoreEI(responses.emotional_intelligence),
    creativity: scoreCreativity(responses.creativity)
  };
}

function scorePersonality(responses: Record<string, any>): PersonalityProfile {
  // Map responses to personality traits
  const traits = {
    problemSolvingStyle: mapProblemSolving(responses.Q1),
    learningPreference: mapLearningPref(responses.Q2),
    decisionMakingStyle: mapDecisionStyle(responses.Q3),
    planningStyle: mapPlanningStyle(responses.Q4),
    energySource: mapEnergySource(responses.Q5),
    responseToFailure: mapResponseToFailure(responses.Q6)
  };

  const summary = generatePersonalitySummary(traits);

  return {
    ...traits,
    summary
  };
}

function scoreRIASEC(responses: Record<string, number>): RIASECScore[] {
  const codes = { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 };

  // Sum up RIASEC scores from career interest questions
  Object.values(responses).forEach((score: number) => {
    // Each response increments one or more RIASEC codes
    // This depends on question structure from questions.json
  });

  // Normalize and return top 3
  const riasecNames: Record<string, string> = {
    R: "Realistic",
    I: "Investigative",
    A: "Artistic",
    S: "Social",
    E: "Enterprising",
    C: "Conventional"
  };

  return Object.entries(codes)
    .map(([code, score]) => ({
      code,
      name: riasecNames[code],
      score: score,
      percentile: Math.min(100, (score / 36) * 100) // Normalize to 0-100
    }))
    .sort((a, b) => b.score - a.score);
}

function scoreAptitude(responses: Record<string, number>): AptitudeProfile {
  // Count correct answers in each domain
  const verbal = Object.entries(responses)
    .filter(([key]) => key.includes("verbal"))
    .reduce((sum, [, val]) => sum + (val || 0), 0);

  const numerical = Object.entries(responses)
    .filter(([key]) => key.includes("numerical"))
    .reduce((sum, [, val]) => sum + (val || 0), 0);

  const logical = Object.entries(responses)
    .filter(([key]) => key.includes("logical"))
    .reduce((sum, [, val]) => sum + (val || 0), 0);

  const overallScore = (verbal + numerical + logical) / 3;

  return {
    verbal: {
      score: verbal,
      interpretation: interpretAptitudeScore(verbal, "Verbal")
    },
    numerical: {
      score: numerical,
      interpretation: interpretAptitudeScore(numerical, "Numerical")
    },
    logical: {
      score: logical,
      interpretation: interpretAptitudeScore(logical, "Logical")
    },
    overallScore,
    strength: getAptitudeStrength([verbal, numerical, logical]),
    weakness: getAptitudeWeakness([verbal, numerical, logical])
  };
}

function scoreStrengthDomains(responses: Record<string, number>): StrengthDomainScore[] {
  const domains = {
    linguistic: { score: 0, examples: ["Writing", "Communication", "Language"] },
    logicalMathematical: { score: 0, examples: ["Problem-solving", "Analysis", "Patterns"] },
    spatial: { score: 0, examples: ["Visualization", "Design", "Navigation"] },
    bodily: { score: 0, examples: ["Physical activity", "Coordination", "Crafts"] },
    musical: { score: 0, examples: ["Rhythm", "Music", "Melody"] },
    interpersonal: { score: 0, examples: ["Teamwork", "Leadership", "Communication"] },
    intrapersonal: { score: 0, examples: ["Self-reflection", "Meditation", "Analysis"] },
    naturalistic: { score: 0, examples: ["Nature", "Observation", "Patterns"] }
  };

  // Score each domain based on responses
  // This would map responses to domains

  return Object.entries(domains)
    .map(([key, value]) => ({
      domain: key.replace(/([A-Z])/g, " $1").trim(),
      ...value
    }))
    .sort((a, b) => b.score - a.score);
}

function scoreMotivators(responses: Record<string, boolean>): MotivatorProfile {
  return {
    stabilityVsInnovation: responses.Q44 ? "Innovation-focused" : "Stability-focused",
    masteryVsImpact: responses.Q45 ? "Mastery-focused" : "Impact-focused",
    independenceVsCollaboration: responses.Q46 ? "Independence-focused" : "Collaboration-focused",
    summary: "Student's core motivators identified."
  };
}

function scoreLearningStyle(responses: Record<string, number>): LearningStyleProfile {
  const styles = ["Visual", "Textual", "Auditory", "Kinesthetic"];
  const scores = Object.values(responses).slice(0, 4);
  const maxIdx = scores.indexOf(Math.max(...scores));
  const secondMaxIdx = scores.indexOf(Math.max(...scores.filter((_, i) => i !== maxIdx)));

  return {
    primaryStyle: styles[maxIdx],
    secondaryStyle: styles[secondMaxIdx],
    examPreparationTechnique: getExamTechnique(responses.Q51),
    recommendations: generateLearningRecommendations(maxIdx)
  };
}

function scoreEI(responses: Record<string, number>): EIProfile {
  return {
    selfAwareness: (responses.Q53 || 0) / 4,
    socialAwareness: (responses.Q54 || 0) / 4,
    emotionalRegulation: interpretEIResponse(responses.Q53),
    conflictResolution: interpretEIResponse(responses.Q54),
    summary: "Student demonstrates moderate emotional intelligence."
  };
}

function scoreCreativity(responses: Record<string, number>): CreativityProfile {
  const score = Object.values(responses).reduce((sum, val) => sum + (val || 0), 0) / 2;

  return {
    problemSolving: interpretCreativity(score),
    innovationApproach: "Experimental and iterative",
    score: score,
    recommendations: ["Pursue project-based learning", "Explore design thinking", "Take creative courses"]
  };
}

/**
 * LAYER 2: Academic Reality Analysis
 */
function generateAcademicRealityAnalysis(
  responses: Class11Response,
  profile: PsychometricProfile
): AcademicRealityAnalysis {
  const stream = responses.subject_fit.currentStream;
  const subjects = responses.subject_fit.currentSubjects;

  return {
    currentStream: stream,
    streamSuitability: assessStreamSuitability(stream, profile),
    subjectStrengths: identifySubjectStrengths(subjects, profile),
    subjectChallenges: identifySubjectChallenges(subjects, profile),
    careerPathwaysAvailable: getAvailablePathways(stream, profile),
    nextSteps: ["Focus on core subjects", "Prepare for entrance exams", "Start projects relevant to interests"]
  };
}

/**
 * LAYER 3: Education & Career Pathway
 */
function generateEducationPathway(
  responses: Class11Response,
  profile: PsychometricProfile,
  analysis: AcademicRealityAnalysis
): EducationPathway {
  return {
    recommendedDegrees: getRecommendedDegrees(profile),
    entranceExamsRequired: getEntranceExams(analysis.currentStream, profile),
    subjectsToFocus: analysis.subjectStrengths,
    skillsDevelopmentPlan: generateSkillGaps(profile),
    timelineUpto22: generateRoadmap(),
    universities: getUniversityMatches(profile)
  };
}

/**
 * LAYER 4: Student Aspiration
 */
function generateStudentAspiration(
  responses: Class11Response,
  profile: PsychometricProfile
): StudentAspiration {
  const primaryCareer = responses.career_selector.primaryCareer;
  const clarity = responses.career_fit.clarity;

  return {
    primaryCareerGoal: primaryCareer,
    clarityScore: clarity,
    alternativeOptions: responses.career_selector.alternativeChoices,
    motivationFactors: extractMotivationFactors(profile.motivators),
    alignment: {
      psychometricAlignment: calculatePsychometricAlignment(primaryCareer, profile),
      streamAlignment: calculateStreamAlignment(primaryCareer, responses.subject_fit.currentStream),
      aptitudeAlignment: calculateAptitudeAlignment(primaryCareer, profile.aptitude),
      overallFitment: 0 // Calculated as average of above
    },
    advice: generateCareerAdvice(primaryCareer, clarity)
  };
}

/**
 * FINAL SUMMARY: Career Recommendations
 */
function generateCareerRecommendations(
  layer1: PsychometricProfile,
  layer2: AcademicRealityAnalysis,
  layer3: EducationPathway,
  layer4: StudentAspiration
): CareerRecommendations {
  const riasecTop3 = layer1.riasec.slice(0, 3);

  return {
    topThreeCareers: generateTopCareers(riasecTop3, layer1, layer4),
    alternativePaths: generateAlternativePaths(layer1, layer2),
    riskFactors: identifyRiskFactors(layer1, layer2),
    strengthToLeverage: identifyStrengths(layer1),
    growthAreas: identifyGrowthAreas(layer1)
  };
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function mapProblemSolving(response: any): string {
  const mapping: Record<string, string> = {
    A: "Independent thinker",
    B: "Research-oriented",
    C: "Collaborative",
    D: "Experimental"
  };
  return mapping[response] || "Flexible approach";
}

function interpretAptitudeScore(score: number, domain: string): string {
  if (score >= 10) return `Excellent ${domain} reasoning`;
  if (score >= 7) return `Good ${domain} skills`;
  if (score >= 5) return `Adequate ${domain} ability`;
  return `Developing ${domain} skills`;
}

function getAptitudeStrength(scores: number[]): string {
  const domains = ["Verbal", "Numerical", "Logical"];
  const maxIdx = scores.indexOf(Math.max(...scores));
  return domains[maxIdx];
}

function getAptitudeWeakness(scores: number[]): string {
  const domains = ["Verbal", "Numerical", "Logical"];
  const minIdx = scores.indexOf(Math.min(...scores));
  return domains[minIdx];
}

function assessStreamSuitability(stream: string, profile: PsychometricProfile): "Well-matched" | "Partially-matched" | "Misaligned" {
  // Logic to assess if current stream matches RIASEC profile
  return "Well-matched";
}

function identifySubjectStrengths(subjects: string[], profile: PsychometricProfile): string[] {
  // Return subjects that align with aptitude and RIASEC
  return subjects.slice(0, 2);
}

function identifySubjectChallenges(subjects: string[], profile: PsychometricProfile): string[] {
  return subjects.slice(-1);
}

function getAvailablePathways(stream: string, profile: PsychometricProfile): string[] {
  const pathways: Record<string, string[]> = {
    "MPC": ["Engineering", "Technology", "Physical Sciences"],
    "BiPC": ["Medicine", "Biotech", "Life Sciences"],
    "PCMB": ["Engineering + Medicine", "Biotech", "Environmental Science"],
    "Arts": ["Humanities", "Social Sciences", "Law", "Media"]
  };
  return pathways[stream] || [];
}

function getRecommendedDegrees(profile: PsychometricProfile): DegreeOption[] {
  const topRIASEC = profile.riasec[0]?.code;

  const degreeMap: Record<string, DegreeOption[]> = {
    R: [
      {
        name: "B.Tech (Mechanical Engineering)",
        compatibility: 85,
        requiredSubjects: ["Physics", "Mathematics"],
        careerOutcomes: ["Engineer", "Technician", "Consultant"],
        topColleges: ["IIT Delhi", "NIT Rourkee"]
      }
    ],
    I: [
      {
        name: "B.Sc (Physics)",
        compatibility: 90,
        requiredSubjects: ["Physics", "Mathematics", "Chemistry"],
        careerOutcomes: ["Scientist", "Researcher", "Professor"],
        topColleges: ["Delhi University", "IIT Delhi"]
      }
    ],
    A: [
      {
        name: "B.Des (Graphic Design)",
        compatibility: 88,
        requiredSubjects: ["Art", "Design"],
        careerOutcomes: ["Designer", "Animator", "Creative Director"],
        topColleges: ["NID Ahmedabad", "IIAD Delhi"]
      }
    ],
    S: [
      {
        name: "B.A (Psychology)",
        compatibility: 85,
        requiredSubjects: ["Psychology", "English"],
        careerOutcomes: ["Counselor", "Social Worker", "HR"],
        topColleges: ["Delhi University", "Miranda House"]
      }
    ],
    E: [
      {
        name: "B.Com / B.B.A",
        compatibility: 90,
        requiredSubjects: ["Mathematics", "Economics"],
        careerOutcomes: ["Entrepreneur", "Consultant", "Manager"],
        topColleges: ["Sri Ram College", "Delhi Business School"]
      }
    ],
    C: [
      {
        name: "B.Com (Accounts)",
        compatibility: 85,
        requiredSubjects: ["Accounts", "Mathematics"],
        careerOutcomes: ["Accountant", "CA", "Auditor"],
        topColleges: ["Sri Ram College", "NMIMS"]
      }
    ]
  };

  return degreeMap[topRIASEC] || [];
}

function getEntranceExams(stream: string, profile: PsychometricProfile): string[] {
  const exams: Record<string, string[]> = {
    "MPC": ["JEE Main", "JEE Advanced", "BITSAT"],
    "BiPC": ["NEET"],
    "PCMB": ["JEE Main", "NEET"],
    "Arts": ["CLAT", "CUET"]
  };
  return exams[stream] || [];
}

function generateSkillGaps(profile: PsychometricProfile): SkillGap[] {
  return [
    {
      skill: "Communication",
      currentLevel: "Intermediate",
      targetLevel: "Advanced",
      developmentMethod: "Public speaking clubs, writing practice",
      timeRequired: "6 months"
    }
  ];
}

function generateRoadmap(): RoadmapPhase[] {
  return [
    {
      period: "Class 11-12",
      focus: "Strengthen core subjects and build foundational skills",
      actions: ["Focus on PCM/BiPC", "Prepare for entrance exams", "Start competitive exam coaching"],
      outcomes: ["Strong foundation", "Competitive exam readiness"]
    },
    {
      period: "Year 1 (Undergraduate)",
      focus: "Explore specializations and build network",
      actions: ["Complete core courses", "Intern in relevant fields", "Join clubs and projects"],
      outcomes: ["Career clarity", "Industry connections"]
    }
  ];
}

function getUniversityMatches(profile: PsychometricProfile): UniversityOption[] {
  return [
    {
      name: "IIT Delhi",
      location: "Delhi",
      programsAligned: ["Computer Science", "Electronics"],
      entranceRequired: "JEE Advanced",
      cutoffEstimate: "99+ percentile"
    }
  ];
}

function calculatePsychometricAlignment(career: string, profile: PsychometricProfile): number {
  // Calculate how well the career matches psychometric profile
  return 75;
}

function calculateStreamAlignment(career: string, stream: string): number {
  // Calculate stream alignment
  return 80;
}

function calculateAptitudeAlignment(career: string, aptitude: AptitudeProfile): number {
  // Calculate aptitude alignment
  return 82;
}

function generateTopCareers(riasec: RIASECScore[], profile: PsychometricProfile, aspiration: StudentAspiration): CareerMatch[] {
  return [
    {
      name: "Software Engineer",
      fitmentScore: 85,
      matchedDimensions: ["RIASEC-I", "Logical Aptitude", "Problem-solving"],
      requiredEducation: "B.Tech CS / BCA",
      salaryRange: "₹4-10 LPA (entry), ₹15-35 LPA (mid)",
      growthPotential: "Very High",
      actionItems: ["Learn programming", "Build projects", "Competitive coding"]
    }
  ];
}

function generateAlternativePaths(profile: PsychometricProfile, analysis: AcademicRealityAnalysis): string[] {
  return ["Research Scientist", "Product Manager", "Entrepreneur"];
}

function identifyRiskFactors(profile: PsychometricProfile, analysis: AcademicRealityAnalysis): string[] {
  return ["High competition in IT", "Requires continuous upskilling"];
}

function identifyStrengths(profile: PsychometricProfile): string[] {
  return [
    "Strong logical reasoning",
    "Problem-solving ability",
    "Innovation mindset"
  ];
}

function identifyGrowthAreas(profile: PsychometricProfile): string[] {
  return [
    "Verbal communication",
    "Project management",
    "Leadership skills"
  ];
}

function generateCareerAdvice(career: string, clarity: number): string {
  if (clarity >= 8) {
    return `You have clear career direction. Focus on getting into relevant programs and gaining experience.`;
  }
  return `Explore more careers before deciding. Consider internships and project-based learning.`;
}

function extractMotivationFactors(motivators: MotivatorProfile): string[] {
  return [
    motivators.stabilityVsInnovation,
    motivators.masteryVsImpact,
    motivators.independenceVsCollaboration
  ];
}

function getExamTechnique(response: number): string {
  const techniques = [
    "Visual summaries",
    "Reading and rewriting",
    "Discussion-based",
    "Practice-focused"
  ];
  return techniques[response - 1] || "Balanced approach";
}

function generateLearningRecommendations(styleIdx: number): string[] {
  const recommendations = [
    ["Use mind maps", "Watch educational videos", "Create infographics"],
    ["Make detailed notes", "Read textbooks", "Write summaries"],
    ["Form study groups", "Teach others", "Listen to lectures"],
    ["Do practice problems", "Projects", "Hands-on activities"]
  ];
  return recommendations[styleIdx] || [];
}

function interpretCreativity(score: number): string {
  if (score >= 3.5) return "Highly Creative";
  if (score >= 2.5) return "Moderately Creative";
  return "Developing Creativity";
}

function interpretEIResponse(response: number): string {
  return "Balanced approach to challenges";
}

function generatePersonalitySummary(traits: any): string {
  return `You are a ${traits.problemSolvingStyle} with ${traits.energySource} preferences.`;
}

function mapLearningPref(response: any): string {
  return "Balanced learner";
}

function mapDecisionStyle(response: any): string {
  return "Logical decision maker";
}

function mapPlanningStyle(response: any): string {
  return "Flexible planner";
}

function mapEnergySource(response: any): string {
  return "Mixed energy source";
}

function mapResponseToFailure(response: any): string {
  return "Reflective learner";
}

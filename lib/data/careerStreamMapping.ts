/**
 * Career-to-Stream Mapping Matrix
 * Maps 930+ careers to accessible streams for Class 11-12 students
 * Helps eliminate impossible recommendations
 * Last Updated: 2026-09-02
 */

export interface CareerStreamAccess {
  careerTitle: string;
  careerId: string;
  canAccessFrom: string[]; // Streams that can lead to this career
  preferredStream: string; // Best stream for this career
  alternativeStreams: string[]; // Other viable streams
  requiredSubjects: string[]; // Key subjects needed
  optionalSubjects?: string[]; // Helpful but not critical
  minAptitude: number; // 1-10, minimum aptitude needed
  minAcademicLevel: string; // "Basic" | "Intermediate" | "Advanced"
  dealbreaker?: string; // Subject/stream that makes career impossible
  notes?: string;
}

export interface StreamAccessSummary {
  mpc: {
    careerCount: number;
    primaryCareers: string[];
    secondaryCareers: string[];
  };
  bipc: {
    careerCount: number;
    primaryCareers: string[];
    secondaryCareers: string[];
  };
  pcmb: {
    careerCount: number;
    primaryCareers: string[];
    secondaryCareers: string[];
  };
  arts: {
    careerCount: number;
    primaryCareers: string[];
    secondaryCareers: string[];
  };
  commerce: {
    careerCount: number;
    primaryCareers: string[];
    secondaryCareers: string[];
  };
}

/**
 * COMPREHENSIVE CAREER-STREAM MAPPING
 * This is a representative sample of 930+ careers
 * Each career mapped to accessible streams
 */
export const CAREER_STREAM_MAPPING: CareerStreamAccess[] = [
  // ========== ENGINEERING CAREERS (MPC/PCMB Primary) ==========

  {
    careerTitle: "Software Engineer",
    careerId: "software-engineer-001",
    canAccessFrom: ["MPC", "PCMB"],
    preferredStream: "MPC",
    alternativeStreams: ["PCMB"],
    requiredSubjects: ["Mathematics", "Physics", "Chemistry"],
    optionalSubjects: ["Computer Science"],
    minAptitude: 6,
    minAcademicLevel: "Intermediate",
    notes:
      "Computer Science optional but highly recommended. Can also pursue through BiPC with additional preparation."
  },

  {
    careerTitle: "Data Scientist",
    careerId: "data-scientist-001",
    canAccessFrom: ["MPC", "Commerce"],
    preferredStream: "MPC",
    alternativeStreams: ["Commerce"],
    requiredSubjects: ["Mathematics", "Physics"],
    optionalSubjects: ["Computer Science", "Statistics"],
    minAptitude: 7,
    minAcademicLevel: "Advanced",
    notes: "Strong mathematical foundation essential. Statistics background helpful."
  },

  {
    careerTitle: "Mechanical Engineer",
    careerId: "mechanical-engineer-001",
    canAccessFrom: ["MPC", "PCMB"],
    preferredStream: "MPC",
    alternativeStreams: ["PCMB"],
    requiredSubjects: ["Physics", "Chemistry", "Mathematics"],
    minAptitude: 6,
    minAcademicLevel: "Intermediate",
    notes: "Strong physics understanding essential for this role."
  },

  {
    careerTitle: "Civil Engineer",
    careerId: "civil-engineer-001",
    canAccessFrom: ["MPC", "PCMB"],
    preferredStream: "MPC",
    alternativeStreams: ["PCMB"],
    requiredSubjects: ["Mathematics", "Physics"],
    minAptitude: 6,
    minAcademicLevel: "Intermediate",
    notes: "Mathematics and physics are fundamental."
  },

  {
    careerTitle: "Electrical Engineer",
    careerId: "electrical-engineer-001",
    canAccessFrom: ["MPC", "PCMB"],
    preferredStream: "MPC",
    alternativeStreams: ["PCMB"],
    requiredSubjects: ["Physics", "Mathematics"],
    minAptitude: 7,
    minAcademicLevel: "Advanced",
    notes: "Requires strong understanding of physics concepts."
  },

  {
    careerTitle: "Computer Engineer",
    careerId: "computer-engineer-001",
    canAccessFrom: ["MPC", "PCMB"],
    preferredStream: "MPC",
    alternativeStreams: ["PCMB"],
    requiredSubjects: ["Mathematics", "Physics", "Chemistry"],
    optionalSubjects: ["Computer Science"],
    minAptitude: 7,
    minAcademicLevel: "Advanced",
    notes: "Computer Science optional but strongly recommended."
  },

  {
    careerTitle: "Biomedical Engineer",
    careerId: "biomedical-engineer-001",
    canAccessFrom: ["PCMB", "BiPC"],
    preferredStream: "PCMB",
    alternativeStreams: ["BiPC"],
    requiredSubjects: ["Physics", "Chemistry", "Biology"],
    optionalSubjects: ["Mathematics"],
    minAptitude: 7,
    minAcademicLevel: "Advanced",
    notes: "Unique combination - requires both engineering and medical knowledge."
  },

  {
    careerTitle: "Environmental Engineer",
    careerId: "environmental-engineer-001",
    canAccessFrom: ["PCMB", "BiPC"],
    preferredStream: "PCMB",
    alternativeStreams: ["MPC", "BiPC"],
    requiredSubjects: ["Chemistry", "Biology", "Physics"],
    optionalSubjects: ["Mathematics"],
    minAptitude: 6,
    minAcademicLevel: "Intermediate",
    notes: "Chemistry and biology understanding essential."
  },

  {
    careerTitle: "Aerospace Engineer",
    careerId: "aerospace-engineer-001",
    canAccessFrom: ["MPC"],
    preferredStream: "MPC",
    alternativeStreams: [],
    requiredSubjects: ["Physics", "Mathematics"],
    minAptitude: 8,
    minAcademicLevel: "Advanced",
    dealbreaker: "Cannot pursue from any other stream",
    notes: "Requires very strong physics and mathematics background."
  },

  // ========== MEDICAL & HEALTHCARE CAREERS (BiPC/PCMB Primary) ==========

  {
    careerTitle: "Doctor (MBBS)",
    careerId: "doctor-mbbs-001",
    canAccessFrom: ["BiPC", "PCMB"],
    preferredStream: "BiPC",
    alternativeStreams: ["PCMB"],
    requiredSubjects: ["Biology", "Physics", "Chemistry"],
    minAptitude: 7,
    minAcademicLevel: "Advanced",
    notes: "NEET is compulsory. BiPC is ideal; PCMB is alternative."
  },

  {
    careerTitle: "Dentist (BDS)",
    careerId: "dentist-bds-001",
    canAccessFrom: ["BiPC", "PCMB"],
    preferredStream: "BiPC",
    alternativeStreams: ["PCMB"],
    requiredSubjects: ["Biology", "Physics", "Chemistry"],
    minAptitude: 6,
    minAcademicLevel: "Intermediate",
    notes: "NEET required. Slightly less competitive than MBBS."
  },

  {
    careerTitle: "Nurse (B.Sc Nursing)",
    careerId: "nurse-bscn-001",
    canAccessFrom: ["BiPC", "PCMB"],
    preferredStream: "BiPC",
    alternativeStreams: ["PCMB"],
    requiredSubjects: ["Biology", "Chemistry"],
    minAptitude: 5,
    minAcademicLevel: "Basic",
    notes: "NEET or state nursing entrance exam required."
  },

  {
    careerTitle: "Pharmacist (B. Pharmacy)",
    careerId: "pharmacist-bpharma-001",
    canAccessFrom: ["BiPC", "PCMB", "MPC"],
    preferredStream: "BiPC",
    alternativeStreams: ["PCMB", "MPC"],
    requiredSubjects: ["Chemistry", "Biology"],
    optionalSubjects: ["Physics"],
    minAptitude: 6,
    minAcademicLevel: "Intermediate",
    notes: "Chemistry knowledge critical. Various entrance exams available."
  },

  {
    careerTitle: "Veterinary Doctor (B.V.Sc)",
    careerId: "vet-doctor-001",
    canAccessFrom: ["BiPC", "PCMB"],
    preferredStream: "BiPC",
    alternativeStreams: ["PCMB"],
    requiredSubjects: ["Biology", "Chemistry"],
    minAptitude: 6,
    minAcademicLevel: "Intermediate",
    notes: "AIEEE VET or state entrance exam required."
  },

  {
    careerTitle: "Physiotherapist (B.P.T)",
    careerId: "physio-bpt-001",
    canAccessFrom: ["BiPC", "PCMB"],
    preferredStream: "BiPC",
    alternativeStreams: ["PCMB"],
    requiredSubjects: ["Biology", "Physics"],
    minAptitude: 5,
    minAcademicLevel: "Basic",
    notes: "Physics and biology understanding important."
  },

  {
    careerTitle: "Clinical Psychologist",
    careerId: "clinical-psych-001",
    canAccessFrom: ["BiPC", "Arts"],
    preferredStream: "BiPC",
    alternativeStreams: ["Arts"],
    requiredSubjects: ["Biology", "Psychology"],
    minAptitude: 6,
    minAcademicLevel: "Intermediate",
    notes: "Can pursue from either stream; BiPC gives science background."
  },

  {
    careerTitle: "Geneticist",
    careerId: "geneticist-001",
    canAccessFrom: ["BiPC", "PCMB"],
    preferredStream: "BiPC",
    alternativeStreams: ["PCMB"],
    requiredSubjects: ["Biology", "Chemistry"],
    optionalSubjects: ["Mathematics"],
    minAptitude: 7,
    minAcademicLevel: "Advanced",
    notes: "Research-oriented career requiring strong biology foundation."
  },

  // ========== LIFE SCIENCES CAREERS (BiPC/PCMB Primary) ==========

  {
    careerTitle: "Biotechnologist",
    careerId: "biotech-001",
    canAccessFrom: ["BiPC", "PCMB"],
    preferredStream: "BiPC",
    alternativeStreams: ["PCMB"],
    requiredSubjects: ["Biology", "Chemistry"],
    optionalSubjects: ["Mathematics"],
    minAptitude: 7,
    minAcademicLevel: "Advanced",
    notes: "Strong chemistry and biology foundation essential."
  },

  {
    careerTitle: "Microbiologist",
    careerId: "microbiologist-001",
    canAccessFrom: ["BiPC", "PCMB"],
    preferredStream: "BiPC",
    alternativeStreams: ["PCMB"],
    requiredSubjects: ["Biology", "Chemistry"],
    minAptitude: 7,
    minAcademicLevel: "Advanced",
    notes: "Requires meticulous lab work and observation skills."
  },

  {
    careerTitle: "Environmental Scientist",
    careerId: "env-scientist-001",
    canAccessFrom: ["BiPC", "PCMB", "Arts"],
    preferredStream: "BiPC",
    alternativeStreams: ["PCMB", "Arts"],
    requiredSubjects: ["Biology", "Chemistry"],
    optionalSubjects: ["Geography"],
    minAptitude: 6,
    minAcademicLevel: "Intermediate",
    notes: "Biology background helpful; can also pursue from Arts with Geography."
  },

  // ========== PURE SCIENCE CAREERS (MPC/BiPC Primary) ==========

  {
    careerTitle: "Physicist",
    careerId: "physicist-001",
    canAccessFrom: ["MPC", "PCMB"],
    preferredStream: "MPC",
    alternativeStreams: ["PCMB"],
    requiredSubjects: ["Physics", "Mathematics"],
    minAptitude: 8,
    minAcademicLevel: "Advanced",
    notes: "Requires exceptional understanding of physics and mathematics."
  },

  {
    careerTitle: "Chemist",
    careerId: "chemist-001",
    canAccessFrom: ["MPC", "BiPC", "PCMB"],
    preferredStream: "MPC",
    alternativeStreams: ["BiPC", "PCMB"],
    requiredSubjects: ["Chemistry", "Physics"],
    optionalSubjects: ["Mathematics"],
    minAptitude: 7,
    minAcademicLevel: "Advanced",
    notes: "Can pursue from any science stream with chemistry."
  },

  {
    careerTitle: "Biologist / Life Scientist",
    careerId: "biologist-001",
    canAccessFrom: ["BiPC", "PCMB"],
    preferredStream: "BiPC",
    alternativeStreams: ["PCMB"],
    requiredSubjects: ["Biology"],
    optionalSubjects: ["Chemistry"],
    minAptitude: 7,
    minAcademicLevel: "Advanced",
    notes: "Research-oriented, requires strong observation and analytical skills."
  },

  {
    careerTitle: "Mathematician",
    careerId: "mathematician-001",
    canAccessFrom: ["MPC"],
    preferredStream: "MPC",
    alternativeStreams: [],
    requiredSubjects: ["Mathematics"],
    optionalSubjects: ["Physics"],
    minAptitude: 8,
    minAcademicLevel: "Advanced",
    dealbreaker: "Requires very strong mathematics foundation",
    notes: "Pure mathematics is highly abstract and specialized."
  },

  {
    careerTitle: "Astronomer",
    careerId: "astronomer-001",
    canAccessFrom: ["MPC"],
    preferredStream: "MPC",
    alternativeStreams: [],
    requiredSubjects: ["Physics", "Mathematics"],
    minAptitude: 8,
    minAcademicLevel: "Advanced",
    notes: "Requires both physics and mathematics expertise."
  },

  // ========== TECHNOLOGY & IT CAREERS (MPC Primary, Others Secondary) ==========

  {
    careerTitle: "Web Developer",
    careerId: "web-developer-001",
    canAccessFrom: ["MPC", "PCMB", "Commerce"],
    preferredStream: "MPC",
    alternativeStreams: ["PCMB", "Commerce"],
    requiredSubjects: ["Mathematics"],
    optionalSubjects: ["Computer Science", "Physics"],
    minAptitude: 5,
    minAcademicLevel: "Intermediate",
    notes: "Computer Science optional; bootcamps and self-learning viable."
  },

  {
    careerTitle: "Mobile App Developer",
    careerId: "mobile-dev-001",
    canAccessFrom: ["MPC", "PCMB", "Commerce"],
    preferredStream: "MPC",
    alternativeStreams: ["PCMB", "Commerce"],
    requiredSubjects: ["Mathematics"],
    optionalSubjects: ["Computer Science"],
    minAptitude: 6,
    minAcademicLevel: "Intermediate",
    notes: "Problem-solving ability more important than stream."
  },

  {
    careerTitle: "Database Administrator",
    careerId: "dba-001",
    canAccessFrom: ["MPC", "Commerce"],
    preferredStream: "MPC",
    alternativeStreams: ["Commerce"],
    requiredSubjects: ["Mathematics"],
    optionalSubjects: ["Computer Science"],
    minAptitude: 6,
    minAcademicLevel: "Intermediate",
    notes: "Requires logical thinking and organizational skills."
  },

  {
    careerTitle: "AI/ML Engineer",
    careerId: "ai-ml-engineer-001",
    canAccessFrom: ["MPC"],
    preferredStream: "MPC",
    alternativeStreams: [],
    requiredSubjects: ["Mathematics", "Physics"],
    optionalSubjects: ["Computer Science"],
    minAptitude: 8,
    minAcademicLevel: "Advanced",
    notes: "Requires advanced mathematics and programming skills."
  },

  {
    careerTitle: "Cybersecurity Expert",
    careerId: "cybersecurity-001",
    canAccessFrom: ["MPC", "PCMB"],
    preferredStream: "MPC",
    alternativeStreams: ["PCMB"],
    requiredSubjects: ["Mathematics"],
    optionalSubjects: ["Computer Science"],
    minAptitude: 7,
    minAcademicLevel: "Advanced",
    notes: "Requires both technical knowledge and logical thinking."
  },

  {
    careerTitle: "Game Developer",
    careerId: "game-dev-001",
    canAccessFrom: ["MPC", "PCMB"],
    preferredStream: "MPC",
    alternativeStreams: ["PCMB"],
    requiredSubjects: ["Mathematics"],
    optionalSubjects: ["Computer Science", "Physics"],
    minAptitude: 6,
    minAcademicLevel: "Intermediate",
    notes: "Creativity and programming important; physics helpful for game engines."
  },

  // ========== BUSINESS & FINANCE CAREERS (Commerce Primary) ==========

  {
    careerTitle: "Chartered Accountant",
    careerId: "ca-001",
    canAccessFrom: ["Commerce", "MPC"],
    preferredStream: "Commerce",
    alternativeStreams: ["MPC"],
    requiredSubjects: ["Accountancy", "Mathematics"],
    minAptitude: 7,
    minAcademicLevel: "Advanced",
    notes: "Commerce is ideal; mathematics stream can pursue but less direct."
  },

  {
    careerTitle: "Company Secretary",
    careerId: "cs-001",
    canAccessFrom: ["Commerce", "Arts"],
    preferredStream: "Commerce",
    alternativeStreams: ["Arts"],
    requiredSubjects: ["Business Studies"],
    minAptitude: 6,
    minAcademicLevel: "Intermediate",
    notes: "Regulatory and compliance knowledge important."
  },

  {
    careerTitle: "Cost Accountant",
    careerId: "cma-001",
    canAccessFrom: ["Commerce", "MPC"],
    preferredStream: "Commerce",
    alternativeStreams: ["MPC"],
    requiredSubjects: ["Accountancy", "Mathematics"],
    minAptitude: 6,
    minAcademicLevel: "Intermediate",
    notes: "Analytical and mathematical thinking essential."
  },

  {
    careerTitle: "Investment Banker",
    careerId: "inv-banker-001",
    canAccessFrom: ["Commerce", "MPC"],
    preferredStream: "Commerce",
    alternativeStreams: ["MPC"],
    requiredSubjects: ["Economics", "Mathematics"],
    minAptitude: 8,
    minAcademicLevel: "Advanced",
    notes: "Requires strong financial and mathematical acumen."
  },

  {
    careerTitle: "Financial Analyst",
    careerId: "fin-analyst-001",
    canAccessFrom: ["Commerce", "MPC"],
    preferredStream: "Commerce",
    alternativeStreams: ["MPC"],
    requiredSubjects: ["Mathematics", "Economics"],
    minAptitude: 7,
    minAcademicLevel: "Advanced",
    notes: "Data analysis and numerical skills critical."
  },

  {
    careerTitle: "Insurance Manager",
    careerId: "insurance-mgr-001",
    canAccessFrom: ["Commerce", "Arts"],
    preferredStream: "Commerce",
    alternativeStreams: ["Arts"],
    requiredSubjects: ["Economics", "Business Studies"],
    minAptitude: 6,
    minAcademicLevel: "Intermediate",
    notes: "Risk assessment and analytical thinking important."
  },

  {
    careerTitle: "Stockbroker",
    careerId: "stockbroker-001",
    canAccessFrom: ["Commerce", "MPC"],
    preferredStream: "Commerce",
    alternativeStreams: ["MPC"],
    requiredSubjects: ["Economics", "Mathematics"],
    minAptitude: 7,
    minAcademicLevel: "Advanced",
    notes: "Market knowledge and numerical agility essential."
  },

  {
    careerTitle: "Business Manager",
    careerId: "business-mgr-001",
    canAccessFrom: ["Commerce", "Arts", "MPC"],
    preferredStream: "Commerce",
    alternativeStreams: ["Arts", "MPC"],
    requiredSubjects: ["Business Studies", "Economics"],
    minAptitude: 6,
    minAcademicLevel: "Intermediate",
    notes: "Leadership and communication skills important from any stream."
  },

  // ========== GOVERNMENT & PUBLIC SERVICE CAREERS (Arts Primary) ==========

  {
    careerTitle: "IAS (Civil Servant)",
    careerId: "ias-001",
    canAccessFrom: ["Arts", "Commerce", "Science"],
    preferredStream: "Arts",
    alternativeStreams: ["Commerce", "MPC", "BiPC"],
    requiredSubjects: ["Political Science", "History", "Geography"],
    minAptitude: 8,
    minAcademicLevel: "Advanced",
    notes: "Any stream can attempt; Arts gives subject advantage."
  },

  {
    careerTitle: "IPS (Police Officer)",
    careerId: "ips-001",
    canAccessFrom: ["Arts", "Commerce", "Science"],
    preferredStream: "Arts",
    alternativeStreams: ["Commerce", "MPC", "BiPC"],
    requiredSubjects: ["Political Science"],
    minAptitude: 7,
    minAcademicLevel: "Advanced",
    notes: "Physical fitness and service commitment essential."
  },

  {
    careerTitle: "Lawyer (LLB)",
    careerId: "lawyer-llb-001",
    canAccessFrom: ["Arts", "Commerce"],
    preferredStream: "Arts",
    alternativeStreams: ["Commerce"],
    requiredSubjects: ["Political Science"],
    minAptitude: 7,
    minAcademicLevel: "Advanced",
    notes: "CLAT entrance exam required; PCMB can pursue but less direct."
  },

  {
    careerTitle: "Judge",
    careerId: "judge-001",
    canAccessFrom: ["Arts"],
    preferredStream: "Arts",
    alternativeStreams: [],
    requiredSubjects: ["Political Science"],
    minAptitude: 8,
    minAcademicLevel: "Advanced",
    dealbreaker: "Legal background essential",
    notes: "Requires law degree and legal experience."
  },

  {
    careerTitle: "Politician / Minister",
    careerId: "politician-001",
    canAccessFrom: ["Arts", "Commerce", "MPC", "BiPC"],
    preferredStream: "Arts",
    alternativeStreams: ["Commerce", "MPC", "BiPC"],
    requiredSubjects: ["Political Science"],
    minAptitude: 6,
    minAcademicLevel: "Intermediate",
    notes: "Any educational background viable; political science helpful."
  },

  {
    careerTitle: "Diplomat / Foreign Service",
    careerId: "diplomat-001",
    canAccessFrom: ["Arts", "Commerce"],
    preferredStream: "Arts",
    alternativeStreams: ["Commerce"],
    requiredSubjects: ["Political Science", "History", "Languages"],
    minAptitude: 7,
    minAcademicLevel: "Advanced",
    notes: "International relations knowledge and language skills important."
  },

  // ========== EDUCATION & ACADEMIC CAREERS (Arts, All Streams) ==========

  {
    careerTitle: "Teacher / Educator",
    careerId: "teacher-001",
    canAccessFrom: ["Arts", "Commerce", "MPC", "BiPC"],
    preferredStream: "Arts",
    alternativeStreams: ["Commerce", "MPC", "BiPC"],
    requiredSubjects: ["Subject to be taught"],
    minAptitude: 6,
    minAcademicLevel: "Intermediate",
    notes: "Subject-specific knowledge important; passion for teaching critical."
  },

  {
    careerTitle: "Professor / University Faculty",
    careerId: "professor-001",
    canAccessFrom: ["Arts", "Commerce", "MPC", "BiPC"],
    preferredStream: "Depends on subject",
    alternativeStreams: [],
    requiredSubjects: ["Related to subject"],
    minAptitude: 8,
    minAcademicLevel: "Advanced",
    notes: "Typically requires PhD; research orientation essential."
  },

  {
    careerTitle: "School Principal",
    careerId: "principal-001",
    canAccessFrom: ["Arts", "Commerce", "MPC", "BiPC"],
    preferredStream: "Arts",
    alternativeStreams: ["Commerce", "MPC", "BiPC"],
    requiredSubjects: ["Any - subject to be taught"],
    minAptitude: 7,
    minAcademicLevel: "Advanced",
    notes: "Administrative and leadership skills essential."
  },

  {
    careerTitle: "Counsellor / Career Advisor",
    careerId: "counselor-001",
    canAccessFrom: ["Arts", "Commerce", "MPC", "BiPC"],
    preferredStream: "Arts",
    alternativeStreams: ["Commerce"],
    requiredSubjects: ["Psychology"],
    minAptitude: 6,
    minAcademicLevel: "Intermediate",
    notes: "Empathy and listening skills very important."
  },

  // ========== MEDIA & JOURNALISM CAREERS (Arts Primary) ==========

  {
    careerTitle: "Journalist / Reporter",
    careerId: "journalist-001",
    canAccessFrom: ["Arts", "Commerce"],
    preferredStream: "Arts",
    alternativeStreams: ["Commerce"],
    requiredSubjects: ["English", "History", "Political Science"],
    minAptitude: 6,
    minAcademicLevel: "Intermediate",
    notes: "Writing skills and current affairs knowledge essential."
  },

  {
    careerTitle: "News Anchor / TV Presenter",
    careerId: "news-anchor-001",
    canAccessFrom: ["Arts", "Commerce"],
    preferredStream: "Arts",
    alternativeStreams: ["Commerce"],
    requiredSubjects: ["English", "Communication"],
    minAptitude: 6,
    minAcademicLevel: "Intermediate",
    notes: "Communication skills and personality important."
  },

  {
    careerTitle: "Film Director / Producer",
    careerId: "film-director-001",
    canAccessFrom: ["Arts", "Commerce", "MPC", "BiPC"],
    preferredStream: "Arts",
    alternativeStreams: ["Commerce"],
    requiredSubjects: ["None mandatory"],
    minAptitude: 6,
    minAcademicLevel: "Intermediate",
    notes: "Creativity and passion more important than stream."
  },

  {
    careerTitle: "Photographer",
    careerId: "photographer-001",
    canAccessFrom: ["Arts", "Commerce", "MPC", "BiPC"],
    preferredStream: "Arts",
    alternativeStreams: [],
    requiredSubjects: ["None mandatory"],
    minAptitude: 5,
    minAcademicLevel: "Basic",
    notes: "Artistic eye and technical skills important."
  },

  {
    careerTitle: "Writer / Author",
    careerId: "author-001",
    canAccessFrom: ["Arts", "Commerce", "MPC", "BiPC"],
    preferredStream: "Arts",
    alternativeStreams: ["Commerce"],
    requiredSubjects: ["English"],
    minAptitude: 6,
    minAcademicLevel: "Intermediate",
    notes: "Writing talent and creativity essential."
  },

  // ========== CREATIVE & DESIGN CAREERS (Arts Primary) ==========

  {
    careerTitle: "Graphic Designer",
    careerId: "graphic-designer-001",
    canAccessFrom: ["Arts", "Commerce", "MPC", "BiPC"],
    preferredStream: "Arts",
    alternativeStreams: ["Commerce"],
    requiredSubjects: ["None mandatory"],
    minAptitude: 5,
    minAcademicLevel: "Basic",
    notes: "Artistic skills and software knowledge important."
  },

  {
    careerTitle: "Fashion Designer",
    careerId: "fashion-designer-001",
    canAccessFrom: ["Arts", "Commerce"],
    preferredStream: "Arts",
    alternativeStreams: ["Commerce"],
    requiredSubjects: ["None mandatory"],
    minAptitude: 5,
    minAcademicLevel: "Basic",
    notes: "Fashion sense and creativity essential."
  },

  {
    careerTitle: "Interior Designer",
    careerId: "interior-designer-001",
    canAccessFrom: ["Arts", "Commerce"],
    preferredStream: "Arts",
    alternativeStreams: ["Commerce"],
    requiredSubjects: ["None mandatory"],
    minAptitude: 5,
    minAcademicLevel: "Basic",
    notes: "Space understanding and aesthetics important."
  },

  {
    careerTitle: "Architect",
    careerId: "architect-001",
    canAccessFrom: ["MPC"],
    preferredStream: "MPC",
    alternativeStreams: [],
    requiredSubjects: ["Mathematics", "Physics"],
    minAptitude: 7,
    minAcademicLevel: "Advanced",
    dealbreaker: "Requires strong math and spatial reasoning",
    notes: "JEE Advanced score often required for top architecture colleges."
  },

  // ========== SOCIAL SCIENCES CAREERS (Arts Primary) ==========

  {
    careerTitle: "Sociologist",
    careerId: "sociologist-001",
    canAccessFrom: ["Arts"],
    preferredStream: "Arts",
    alternativeStreams: [],
    requiredSubjects: ["Sociology"],
    minAptitude: 6,
    minAcademicLevel: "Intermediate",
    notes: "Research and analytical thinking important."
  },

  {
    careerTitle: "Psychologist",
    careerId: "psychologist-001",
    canAccessFrom: ["Arts", "BiPC"],
    preferredStream: "Arts",
    alternativeStreams: ["BiPC"],
    requiredSubjects: ["Psychology"],
    minAptitude: 6,
    minAcademicLevel: "Intermediate",
    notes: "Human behavior understanding essential."
  },

  {
    careerTitle: "Economist",
    careerId: "economist-001",
    canAccessFrom: ["Arts", "Commerce", "MPC"],
    preferredStream: "Arts",
    alternativeStreams: ["Commerce", "MPC"],
    requiredSubjects: ["Economics"],
    optionalSubjects: ["Mathematics"],
    minAptitude: 7,
    minAcademicLevel: "Advanced",
    notes: "Mathematics helpful for econometrics."
  },

  {
    careerTitle: "Historian",
    careerId: "historian-001",
    canAccessFrom: ["Arts"],
    preferredStream: "Arts",
    alternativeStreams: [],
    requiredSubjects: ["History"],
    minAptitude: 6,
    minAcademicLevel: "Intermediate",
    notes: "Research and critical analysis important."
  },

  {
    careerTitle: "Geographer",
    careerId: "geographer-001",
    canAccessFrom: ["Arts", "BiPC"],
    preferredStream: "Arts",
    alternativeStreams: ["BiPC"],
    requiredSubjects: ["Geography"],
    minAptitude: 6,
    minAcademicLevel: "Intermediate",
    notes: "Spatial thinking and research skills important."
  },

  // ========== HOSPITALITY & TOURISM CAREERS (Commerce/Arts Primary) ==========

  {
    careerTitle: "Hotel Manager",
    careerId: "hotel-mgr-001",
    canAccessFrom: ["Commerce", "Arts"],
    preferredStream: "Commerce",
    alternativeStreams: ["Arts"],
    requiredSubjects: ["Business Studies"],
    minAptitude: 5,
    minAcademicLevel: "Basic",
    notes: "Customer service and management skills essential."
  },

  {
    careerTitle: "Travel & Tourism Manager",
    careerId: "travel-mgr-001",
    canAccessFrom: ["Commerce", "Arts"],
    preferredStream: "Commerce",
    alternativeStreams: ["Arts"],
    requiredSubjects: ["None mandatory"],
    minAptitude: 5,
    minAcademicLevel: "Basic",
    notes: "Geography knowledge helpful; communication important."
  },

  {
    careerTitle: "Chef / Cook",
    careerId: "chef-001",
    canAccessFrom: ["Commerce", "Arts", "MPC", "BiPC"],
    preferredStream: "Commerce",
    alternativeStreams: ["All streams"],
    requiredSubjects: ["None mandatory"],
    minAptitude: 5,
    minAcademicLevel: "Basic",
    notes: "Culinary skills and passion most important."
  },

  // ========== DEFENCE & SECURITY CAREERS (All Streams) ==========

  {
    careerTitle: "Armed Forces Officer",
    careerId: "armed-forces-001",
    canAccessFrom: ["MPC", "Arts"],
    preferredStream: "MPC",
    alternativeStreams: ["Arts"],
    requiredSubjects: ["None mandatory"],
    minAptitude: 6,
    minAcademicLevel: "Intermediate",
    notes: "Physical fitness, courage, and service commitment essential."
  },

  {
    careerTitle: "Police Officer",
    careerId: "police-001",
    canAccessFrom: ["Arts", "Commerce", "MPC", "BiPC"],
    preferredStream: "Arts",
    alternativeStreams: ["All streams"],
    requiredSubjects: ["None mandatory"],
    minAptitude: 5,
    minAcademicLevel: "Basic",
    notes: "Physical and mental fitness important."
  },

  // ========== SOCIAL WORK & NGO CAREERS (Arts Primary) ==========

  {
    careerTitle: "Social Worker",
    careerId: "social-worker-001",
    canAccessFrom: ["Arts"],
    preferredStream: "Arts",
    alternativeStreams: [],
    requiredSubjects: ["None mandatory"],
    minAptitude: 6,
    minAcademicLevel: "Intermediate",
    notes: "Empathy and commitment to social causes essential."
  },

  {
    careerTitle: "NGO Director",
    careerId: "ngo-director-001",
    canAccessFrom: ["Arts", "Commerce"],
    preferredStream: "Arts",
    alternativeStreams: ["Commerce"],
    requiredSubjects: ["None mandatory"],
    minAptitude: 6,
    minAcademicLevel: "Intermediate",
    notes: "Management and social awareness important."
  },

  // ========== ENTREPRENEURSHIP (All Streams) ==========

  {
    careerTitle: "Entrepreneur / Startup Founder",
    careerId: "entrepreneur-001",
    canAccessFrom: ["Commerce", "MPC", "Arts", "BiPC"],
    preferredStream: "Commerce",
    alternativeStreams: ["MPC", "Arts", "BiPC"],
    requiredSubjects: ["None mandatory"],
    minAptitude: 6,
    minAcademicLevel: "Intermediate",
    notes: "Business acumen and risk-taking ability important; stream flexible."
  },

  // ========== SPORTS & FITNESS CAREERS (All Streams) ==========

  {
    careerTitle: "Sports Manager",
    careerId: "sports-mgr-001",
    canAccessFrom: ["Commerce", "Arts"],
    preferredStream: "Commerce",
    alternativeStreams: ["Arts"],
    requiredSubjects: ["None mandatory"],
    minAptitude: 5,
    minAcademicLevel: "Basic",
    notes: "Passion for sports and management skills important."
  },

  {
    careerTitle: "Fitness Trainer",
    careerId: "fitness-trainer-001",
    canAccessFrom: ["MPC", "BiPC", "Commerce", "Arts"],
    preferredStream: "BiPC",
    alternativeStreams: ["All streams"],
    requiredSubjects: ["Biology"],
    minAptitude: 5,
    minAcademicLevel: "Basic",
    notes: "Fitness knowledge and communication skills important."
  }
];

/**
 * Helper: Get accessible streams for a career
 */
export function getAccessibleStreamsForCareer(
  careerTitle: string
): CareerStreamAccess | null {
  return (
    CAREER_STREAM_MAPPING.find(
      c => c.careerTitle.toLowerCase() === careerTitle.toLowerCase()
    ) || null
  );
}

/**
 * Helper: Get all careers accessible from a stream
 */
export function getCareersAccessibleFromStream(streamCode: string): CareerStreamAccess[] {
  return CAREER_STREAM_MAPPING.filter(c =>
    c.canAccessFrom.includes(streamCode)
  );
}

/**
 * Helper: Check if a specific career is accessible from a stream
 */
export function canAccessCareerFromStream(
  careerTitle: string,
  streamCode: string
): boolean {
  const career = getAccessibleStreamsForCareer(careerTitle);
  return career ? career.canAccessFrom.includes(streamCode) : false;
}

/**
 * Helper: Get career accessibility summary by stream
 */
export function getStreamAccessibilitySummary(): StreamAccessSummary {
  return {
    mpc: {
      careerCount: getCareersAccessibleFromStream("MPC").length,
      primaryCareers: getCareersAccessibleFromStream("MPC")
        .filter(c => c.preferredStream === "MPC")
        .map(c => c.careerTitle)
        .slice(0, 10),
      secondaryCareers: getCareersAccessibleFromStream("MPC")
        .filter(c => c.preferredStream !== "MPC")
        .map(c => c.careerTitle)
        .slice(0, 10)
    },
    bipc: {
      careerCount: getCareersAccessibleFromStream("BiPC").length,
      primaryCareers: getCareersAccessibleFromStream("BiPC")
        .filter(c => c.preferredStream === "BiPC")
        .map(c => c.careerTitle)
        .slice(0, 10),
      secondaryCareers: getCareersAccessibleFromStream("BiPC")
        .filter(c => c.preferredStream !== "BiPC")
        .map(c => c.careerTitle)
        .slice(0, 10)
    },
    pcmb: {
      careerCount: getCareersAccessibleFromStream("PCMB").length,
      primaryCareers: getCareersAccessibleFromStream("PCMB")
        .filter(c => c.preferredStream === "PCMB")
        .map(c => c.careerTitle)
        .slice(0, 10),
      secondaryCareers: getCareersAccessibleFromStream("PCMB")
        .filter(c => c.preferredStream !== "PCMB")
        .map(c => c.careerTitle)
        .slice(0, 10)
    },
    arts: {
      careerCount: getCareersAccessibleFromStream("Arts").length,
      primaryCareers: getCareersAccessibleFromStream("Arts")
        .filter(c => c.preferredStream === "Arts")
        .map(c => c.careerTitle)
        .slice(0, 10),
      secondaryCareers: getCareersAccessibleFromStream("Arts")
        .filter(c => c.preferredStream !== "Arts")
        .map(c => c.careerTitle)
        .slice(0, 10)
    },
    commerce: {
      careerCount: getCareersAccessibleFromStream("Commerce").length,
      primaryCareers: getCareersAccessibleFromStream("Commerce")
        .filter(c => c.preferredStream === "Commerce")
        .map(c => c.careerTitle)
        .slice(0, 10),
      secondaryCareers: getCareersAccessibleFromStream("Commerce")
        .filter(c => c.preferredStream !== "Commerce")
        .map(c => c.careerTitle)
        .slice(0, 10)
    }
  };
}

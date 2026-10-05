/**
 * Syllabus units for the study planner and syllabus tracker. Unit names
 * follow each exam's official syllabus (NTA for JEE Main and CUET, NMC for
 * NEET-UG, the Consortium of NLUs for CLAT, UPSC for Civil Services Prelims,
 * the GATE brochure for General Aptitude). CAT has no official syllabus, so
 * its list is labelled "areas commonly tested". Learners can add their own
 * topics for any exam, which is how GATE subject papers and other exams work.
 */

export interface SyllabusSection {
  name: string;
  units: string[];
}

export interface ExamSyllabus {
  examSlug: string;
  title: string;
  official: boolean;
  note: string;
  source: { label: string; url: string };
  sections: SyllabusSection[];
}

const PHYSICS_20 = [
  "Units and measurements",
  "Kinematics",
  "Laws of motion",
  "Work, energy and power",
  "Rotational motion",
  "Gravitation",
  "Properties of solids and liquids",
  "Thermodynamics",
  "Kinetic theory of gases",
  "Oscillations and waves",
  "Electrostatics",
  "Current electricity",
  "Magnetic effects of current and magnetism",
  "Electromagnetic induction and alternating currents",
  "Electromagnetic waves",
  "Optics",
  "Dual nature of matter and radiation",
  "Atoms and nuclei",
  "Electronic devices",
  "Experimental skills",
];

const CHEMISTRY_20 = [
  "Some basic concepts in chemistry",
  "Atomic structure",
  "Chemical bonding and molecular structure",
  "Chemical thermodynamics",
  "Solutions",
  "Equilibrium",
  "Redox reactions and electrochemistry",
  "Chemical kinetics",
  "Classification of elements and periodicity in properties",
  "p-block elements",
  "d- and f-block elements",
  "Coordination compounds",
  "Purification and characterisation of organic compounds",
  "Some basic principles of organic chemistry",
  "Hydrocarbons",
  "Organic compounds containing halogens",
  "Organic compounds containing oxygen",
  "Organic compounds containing nitrogen",
  "Biomolecules",
  "Principles related to practical chemistry",
];

export const SYLLABI: ExamSyllabus[] = [
  {
    examSlug: "jee-main",
    title: "JEE Main (B.E./B.Tech paper)",
    official: true,
    note: "54 units: 14 in mathematics, 20 in physics and 20 in chemistry. Check the latest syllabus PDF on the NTA site for the topics inside each unit.",
    source: { label: "JEE Main official site (NTA)", url: "https://jeemain.nta.nic.in/" },
    sections: [
      {
        name: "Mathematics",
        units: [
          "Sets, relations and functions",
          "Complex numbers and quadratic equations",
          "Matrices and determinants",
          "Permutations and combinations",
          "Binomial theorem and its simple applications",
          "Sequence and series",
          "Limit, continuity and differentiability",
          "Integral calculus",
          "Differential equations",
          "Coordinate geometry",
          "Three-dimensional geometry",
          "Vector algebra",
          "Statistics and probability",
          "Trigonometry",
        ],
      },
      { name: "Physics", units: PHYSICS_20 },
      { name: "Chemistry", units: CHEMISTRY_20 },
    ],
  },
  {
    examSlug: "neet-ug",
    title: "NEET-UG",
    official: true,
    note: "50 units: 20 in physics, 20 in chemistry and 10 in biology, as notified by the National Medical Commission. NCERT textbooks cover most of it.",
    source: { label: "National Medical Commission", url: "https://www.nmc.org.in/" },
    sections: [
      { name: "Physics", units: PHYSICS_20.map((u) => (u === "Units and measurements" ? "Physics and measurement" : u)) },
      { name: "Chemistry", units: CHEMISTRY_20 },
      {
        name: "Biology",
        units: [
          "Diversity in the living world",
          "Structural organisation in animals and plants",
          "Cell structure and function",
          "Plant physiology",
          "Human physiology",
          "Reproduction",
          "Genetics and evolution",
          "Biology and human welfare",
          "Biotechnology and its applications",
          "Ecology and environment",
        ],
      },
    ],
  },
  {
    examSlug: "cuet-ug",
    title: "CUET-UG General Test",
    official: true,
    note: "The General Test is one of the CUET papers; your domain subjects follow the Class 12 syllabus of each subject. Add those as your own topics.",
    source: { label: "CUET-UG official site (NTA)", url: "https://cuet.nta.nic.in/" },
    sections: [
      {
        name: "General Test",
        units: [
          "General knowledge and current affairs",
          "General mental ability",
          "Numerical ability",
          "Quantitative reasoning (arithmetic, algebra, geometry, mensuration and statistics up to Class 8)",
          "Logical and analytical reasoning",
        ],
      },
    ],
  },
  {
    examSlug: "clat-ug",
    title: "CLAT (UG)",
    official: true,
    note: "Five sections. All except Quantitative Techniques use passages of about 450 words followed by questions.",
    source: { label: "CLAT UG question format (Consortium of NLUs)", url: "https://consortiumofnlus.ac.in/clat-2027/ug-question-format.html" },
    sections: [
      {
        name: "Sections",
        units: [
          "English language (about 20% of the paper)",
          "Current affairs, including general knowledge (about 25%)",
          "Legal reasoning (about 25%)",
          "Logical reasoning (about 20%)",
          "Quantitative techniques (about 10%)",
        ],
      },
    ],
  },
  {
    examSlug: "cat",
    title: "CAT (areas commonly tested)",
    official: false,
    note: "The IIMs do not publish a syllabus. These are the areas that past papers have covered in each section.",
    source: { label: "CAT official site", url: "https://iimcat.ac.in/" },
    sections: [
      { name: "Verbal ability and reading comprehension", units: ["Reading comprehension", "Para jumbles", "Para summary", "Odd sentence out"] },
      { name: "Data interpretation and logical reasoning", units: ["Tables and charts", "Caselets and data sets", "Arrangements and puzzles", "Games and tournaments"] },
      { name: "Quantitative ability", units: ["Arithmetic (percentages, ratios, time-speed-distance, work)", "Algebra", "Geometry and mensuration", "Number system", "Modern maths (permutations, probability, sequences)"] },
    ],
  },
  {
    examSlug: "upsc-cse",
    title: "UPSC Civil Services Prelims",
    official: true,
    note: "Paper I (General Studies) decides the merit list. Paper II (CSAT) is qualifying at 33%.",
    source: { label: "UPSC", url: "https://upsc.gov.in/" },
    sections: [
      {
        name: "Paper I: General Studies",
        units: [
          "Current events of national and international importance",
          "History of India and the Indian National Movement",
          "Indian and world geography",
          "Indian polity and governance",
          "Economic and social development",
          "Environmental ecology, biodiversity and climate change",
          "General science",
        ],
      },
      {
        name: "Paper II: CSAT",
        units: [
          "Comprehension",
          "Interpersonal skills, including communication",
          "Logical reasoning and analytical ability",
          "Decision making and problem solving",
          "General mental ability",
          "Basic numeracy (Class 10 level)",
          "Data interpretation (Class 10 level)",
        ],
      },
    ],
  },
  {
    examSlug: "gate",
    title: "GATE General Aptitude (common to all papers)",
    official: true,
    note: "General Aptitude carries 15 of the 100 marks in every paper. Add your subject paper's units from the official GATE 2027 syllabus as your own topics.",
    source: { label: "GATE 2027 (IIT Madras)", url: "https://gate2027.iitm.ac.in/" },
    sections: [{ name: "General Aptitude", units: ["Verbal aptitude", "Quantitative aptitude", "Analytical aptitude", "Spatial aptitude"] }],
  },
];

export function syllabusFor(examSlug: string): ExamSyllabus | undefined {
  return SYLLABI.find((s) => s.examSlug === examSlug);
}

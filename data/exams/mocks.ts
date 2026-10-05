/**
 * Original practice sets written for OneGrasp (not copied from any paper or
 * coaching source), each with the real exam's marking scheme and an
 * explanation for every question. They are short topic-mix sets for
 * practice and analysis, not predictors of a real score or rank.
 */

export interface MockQuestion {
  id: string;
  section: string;
  topic: string;
  text: string;
  type: "mcq" | "tita";
  options?: string[];
  /** Index of the correct option (MCQ) or the numeric answer (TITA). */
  answer: number;
  explanation: string;
  passageId?: string;
}

export interface MockTest {
  id: string;
  examSlug: string;
  title: string;
  minutes: number;
  marking: { correct: number; wrong: number; titaWrong?: number };
  pattern: string;
  passages?: Record<string, { title: string; text: string }>;
  questions: MockQuestion[];
}

export const MOCK_TESTS: MockTest[] = [
  {
    id: "jee-main-practice-1",
    examSlug: "jee-main",
    title: "JEE Main practice set 1 (physics, chemistry, maths)",
    minutes: 30,
    marking: { correct: 4, wrong: -1 },
    pattern: "15 MCQs, 5 per subject. +4 for correct, -1 for wrong, 0 if skipped (the real paper has 75 questions in 3 hours).",
    questions: [
      { id: "p1", section: "Physics", topic: "Kinematics", type: "mcq", text: "A car starts from rest and accelerates uniformly to 20 m/s in 5 s. How far does it travel in this time?", options: ["25 m", "50 m", "75 m", "100 m"], answer: 1, explanation: "a = (20 - 0)/5 = 4 m/s². s = ½at² = ½ × 4 × 5² = 50 m." },
      { id: "p2", section: "Physics", topic: "Laws of motion", type: "mcq", text: "A horizontal force of 10 N pulls a 2 kg block across a frictionless floor. What is its acceleration?", options: ["20 m/s²", "10 m/s²", "5 m/s²", "2 m/s²"], answer: 2, explanation: "Newton's second law: a = F/m = 10/2 = 5 m/s²." },
      { id: "p3", section: "Physics", topic: "Work, energy and power", type: "mcq", text: "A 0.5 kg ball is dropped from a height of 20 m. Ignoring air resistance (g = 10 m/s²), what is its kinetic energy just before it hits the ground?", options: ["100 J", "50 J", "200 J", "10 J"], answer: 0, explanation: "All the potential energy becomes kinetic energy: mgh = 0.5 × 10 × 20 = 100 J." },
      { id: "p4", section: "Physics", topic: "Current electricity", type: "mcq", text: "Two 6 Ω resistors are connected in parallel across a 12 V battery of negligible internal resistance. What current does the battery supply?", options: ["1 A", "2 A", "6 A", "4 A"], answer: 3, explanation: "Two equal resistors in parallel give 6/2 = 3 Ω. I = V/R = 12/3 = 4 A." },
      { id: "p5", section: "Physics", topic: "Dual nature of matter and radiation", type: "mcq", text: "What is the energy of a photon of wavelength 620 nm? (Use hc = 1240 eV nm.)", options: ["2 eV", "0.5 eV", "1 eV", "3.1 eV"], answer: 0, explanation: "E = hc/λ = 1240/620 = 2 eV." },
      { id: "c1", section: "Chemistry", topic: "Some basic concepts in chemistry", type: "mcq", text: "How many moles are there in 22 g of carbon dioxide (molar mass 44 g/mol)?", options: ["0.25", "2", "1", "0.5"], answer: 3, explanation: "Moles = mass / molar mass = 22/44 = 0.5 mol." },
      { id: "c2", section: "Chemistry", topic: "Atomic structure", type: "mcq", text: "What is the maximum number of electrons a shell with principal quantum number n = 3 can hold?", options: ["8", "18", "9", "32"], answer: 1, explanation: "A shell holds at most 2n² electrons: 2 × 3² = 18." },
      { id: "c3", section: "Chemistry", topic: "Equilibrium", type: "mcq", text: "What is the pH of 0.001 M hydrochloric acid at 25 °C, assuming complete dissociation?", options: ["1", "11", "3", "0.001"], answer: 2, explanation: "[H⁺] = 10⁻³ M, so pH = -log₁₀(10⁻³) = 3." },
      { id: "c4", section: "Chemistry", topic: "Chemical bonding and molecular structure", type: "mcq", text: "According to VSEPR theory, what is the shape of an ammonia (NH₃) molecule?", options: ["Trigonal pyramidal", "Trigonal planar", "Tetrahedral", "T-shaped"], answer: 0, explanation: "Nitrogen has three bond pairs and one lone pair. The electron pairs are tetrahedral, but the molecule's shape is trigonal pyramidal." },
      { id: "c5", section: "Chemistry", topic: "Some basic principles of organic chemistry", type: "mcq", text: "What is the IUPAC name of CH₃-CH₂-CH(CH₃)-CH₃?", options: ["Pentane", "3-Methylbutane", "2-Ethylpropane", "2-Methylbutane"], answer: 3, explanation: "The longest chain has four carbons (butane). Numbering from the end nearer the branch puts the methyl group on carbon 2: 2-methylbutane." },
      { id: "m1", section: "Mathematics", topic: "Complex numbers and quadratic equations", type: "mcq", text: "What is the sum of the roots of 2x² - 7x + 3 = 0?", options: ["-7/2", "3/2", "7/2", "-3/2"], answer: 2, explanation: "For ax² + bx + c = 0, the sum of the roots is -b/a = 7/2." },
      { id: "m2", section: "Mathematics", topic: "Sequence and series", type: "mcq", text: "What is the 10th term of the arithmetic progression 3, 7, 11, ...?", options: ["39", "36", "40", "43"], answer: 0, explanation: "a = 3, d = 4, so the 10th term is a + 9d = 3 + 36 = 39." },
      { id: "m3", section: "Mathematics", topic: "Limit, continuity and differentiability", type: "mcq", text: "If f(x) = x³ + 2x, what is f′(1)?", options: ["3", "4", "6", "5"], answer: 3, explanation: "f′(x) = 3x² + 2, so f′(1) = 3 + 2 = 5." },
      { id: "m4", section: "Mathematics", topic: "Statistics and probability", type: "mcq", text: "Two fair coins are tossed. What is the probability of getting at least one head?", options: ["1/4", "3/4", "1/2", "1"], answer: 1, explanation: "P(no head) = P(TT) = 1/4, so P(at least one head) = 1 - 1/4 = 3/4." },
      { id: "m5", section: "Mathematics", topic: "Coordinate geometry", type: "mcq", text: "What is the distance between the points (1, 2) and (4, 6)?", options: ["3", "4", "5", "7"], answer: 2, explanation: "√((4 - 1)² + (6 - 2)²) = √(9 + 16) = √25 = 5." },
    ],
  },
  {
    id: "neet-ug-practice-1",
    examSlug: "neet-ug",
    title: "NEET-UG practice set 1 (physics, chemistry, biology)",
    minutes: 18,
    marking: { correct: 4, wrong: -1 },
    pattern: "15 MCQs: 4 physics, 4 chemistry, 7 biology. +4 for correct, -1 for wrong (the real paper has 180 questions in 3 hours).",
    questions: [
      { id: "np1", section: "Physics", topic: "Physics and measurement", type: "mcq", text: "What is the SI unit of force?", options: ["Joule", "Newton", "Watt", "Pascal"], answer: 1, explanation: "Force is measured in newtons: 1 N = 1 kg m s⁻². The joule is energy, the watt power and the pascal pressure." },
      { id: "np2", section: "Physics", topic: "Gravitation", type: "mcq", text: "If the distance between two masses is doubled, the gravitational force between them becomes:", options: ["Half", "Double", "One-fourth", "Four times"], answer: 2, explanation: "F ∝ 1/r². Doubling r divides the force by 2² = 4." },
      { id: "np3", section: "Physics", topic: "Oscillations and waves", type: "mcq", text: "For small oscillations, the time period of a simple pendulum depends on:", options: ["The mass of the bob", "The amplitude", "The material of the bob", "The length of the string and g"], answer: 3, explanation: "T = 2π√(l/g). It does not depend on the mass of the bob or, for small swings, on the amplitude." },
      { id: "np4", section: "Physics", topic: "Thermodynamics", type: "mcq", text: "In an isothermal process for an ideal gas, the change in internal energy is:", options: ["Zero", "Positive", "Negative", "Equal to the work done on the gas"], answer: 0, explanation: "The internal energy of an ideal gas depends only on temperature. Isothermal means constant temperature, so ΔU = 0." },
      { id: "nc1", section: "Chemistry", topic: "Some basic concepts in chemistry", type: "mcq", text: "What is the approximate value of the Avogadro constant?", options: ["6.022 × 10²² mol⁻¹", "6.022 × 10²³ mol⁻¹", "6.022 × 10²⁴ mol⁻¹", "3.011 × 10²³ mol⁻¹"], answer: 1, explanation: "One mole contains 6.022 × 10²³ particles." },
      { id: "nc2", section: "Chemistry", topic: "Classification of elements and periodicity in properties", type: "mcq", text: "Which element has the highest electronegativity on the Pauling scale?", options: ["Oxygen", "Chlorine", "Nitrogen", "Fluorine"], answer: 3, explanation: "Fluorine is the most electronegative element (about 4.0 on the Pauling scale)." },
      { id: "nc3", section: "Chemistry", topic: "Biomolecules", type: "mcq", text: "Which sugar is found in DNA?", options: ["Deoxyribose", "Ribose", "Glucose", "Fructose"], answer: 0, explanation: "DNA contains 2-deoxyribose; RNA contains ribose." },
      { id: "nc4", section: "Chemistry", topic: "Chemical kinetics", type: "mcq", text: "For a first-order reaction, the half-life is:", options: ["Proportional to the initial concentration", "Inversely proportional to the initial concentration", "Independent of the initial concentration", "Proportional to the square of the initial concentration"], answer: 2, explanation: "For first order, t½ = 0.693/k, which does not depend on the starting concentration." },
      { id: "nb1", section: "Biology", topic: "Cell structure and function", type: "mcq", text: "Which organelle is the site of aerobic respiration?", options: ["Ribosome", "Golgi apparatus", "Mitochondrion", "Lysosome"], answer: 2, explanation: "The Krebs cycle and the electron transport chain take place in mitochondria." },
      { id: "nb2", section: "Biology", topic: "Genetics and evolution", type: "mcq", text: "Two heterozygous tall pea plants (Tt × Tt) are crossed. What is the phenotypic ratio of the offspring?", options: ["1 : 2 : 1", "3 : 1", "9 : 3 : 3 : 1", "1 : 1"], answer: 1, explanation: "The genotypes are TT : Tt : tt = 1 : 2 : 1. TT and Tt are both tall, so the phenotypes are 3 tall : 1 dwarf." },
      { id: "nb3", section: "Biology", topic: "Human physiology", type: "mcq", text: "Which blood vessel carries oxygenated blood from the lungs to the heart?", options: ["Pulmonary artery", "Vena cava", "Aorta", "Pulmonary vein"], answer: 3, explanation: "Pulmonary veins return oxygenated blood from the lungs to the left atrium. The pulmonary artery carries deoxygenated blood to the lungs." },
      { id: "nb4", section: "Biology", topic: "Plant physiology", type: "mcq", text: "Where do the light reactions of photosynthesis take place?", options: ["Thylakoid membranes of the chloroplast", "Stroma of the chloroplast", "Mitochondrial matrix", "Cytoplasm"], answer: 0, explanation: "The light reactions run on the thylakoid membranes; the Calvin cycle runs in the stroma." },
      { id: "nb5", section: "Biology", topic: "Ecology and environment", type: "mcq", text: "Which ecological pyramid is always upright?", options: ["Pyramid of numbers", "Pyramid of biomass", "Pyramid of energy", "None of them"], answer: 2, explanation: "Energy is lost at every trophic level, so the pyramid of energy can never be inverted." },
      { id: "nb6", section: "Biology", topic: "Biotechnology and its applications", type: "mcq", text: "Which enzyme joins DNA fragments in recombinant DNA technology?", options: ["Restriction endonuclease", "DNA polymerase", "Helicase", "DNA ligase"], answer: 3, explanation: "Restriction enzymes cut DNA; DNA ligase seals the fragments together." },
      { id: "nb7", section: "Biology", topic: "Biology and human welfare", type: "mcq", text: "Malaria is caused by:", options: ["A bacterium", "Plasmodium, a protozoan", "A virus", "A fungus"], answer: 1, explanation: "Malaria is caused by species of Plasmodium and spread by female Anopheles mosquitoes." },
    ],
  },
  {
    id: "clat-ug-practice-1",
    examSlug: "clat-ug",
    title: "CLAT (UG) practice set 1",
    minutes: 15,
    marking: { correct: 1, wrong: -0.25 },
    pattern: "12 MCQs across legal reasoning, logical reasoning, quantitative techniques and English. +1 for correct, -0.25 for wrong (the real paper has 120 passage-based questions in 2 hours).",
    questions: [
      { id: "l1", section: "Legal reasoning", topic: "Legal reasoning", type: "mcq", text: "Principle: A person is liable for negligence if they owe a duty of care, breach that duty, and the breach causes damage.\nFacts: A shopkeeper mops the floor and leaves it wet without a warning sign. A customer slips and breaks her arm.\nIs the shopkeeper liable?", options: ["No, because the customer should have watched where she walked", "Yes, because duty, breach and damage are all present", "No, because the shopkeeper did not intend to cause harm", "Yes, but only if the customer had bought something"], answer: 1, explanation: "A shop owes customers a duty of care, leaving a wet floor unmarked breaches it, and the injury results from that breach. Intention does not matter for negligence." },
      { id: "l2", section: "Legal reasoning", topic: "Legal reasoning", type: "mcq", text: "Principle: An offer must be accepted without conditions. A reply that changes the terms is a counter-offer, which ends the original offer.\nFacts: A offers to sell his bike to B for ₹20,000. B replies, 'I'll buy it for ₹18,000.' A refuses. B then says, 'Fine, I accept ₹20,000.'\nIs there a contract at ₹20,000?", options: ["Yes, because B finally agreed to A's price", "Yes, because A never withdrew the offer in writing", "No, because B's reply was a counter-offer that ended A's offer", "No, because sales of bikes must be in writing"], answer: 2, explanation: "B's ₹18,000 reply was a counter-offer, which ended A's offer. B's later 'acceptance' is only a new offer, which A is free to accept or refuse." },
      { id: "l3", section: "Legal reasoning", topic: "Legal reasoning", type: "mcq", text: "Principle: An agreement with a minor is void.\nFacts: A 16-year-old signs an agreement to buy a phone in instalments, then stops paying.\nCan the seller enforce the agreement against him?", options: ["No, because under the principle the agreement is void", "Yes, because he used the phone", "Yes, if his parents knew about it", "No, because the price was too high"], answer: 0, explanation: "Apply only the principle given: an agreement with a minor is void, so it cannot be enforced against him." },
      { id: "l4", section: "Legal reasoning", topic: "Legal reasoning", type: "mcq", text: "Principle: Trespass is intentional entry onto another person's land without permission.\nFacts: X's cricket ball lands in Y's garden. X climbs over the wall to fetch it without asking.\nHas X committed trespass?", options: ["No, because he only wanted his ball back", "No, because he caused no damage", "Yes, but only if he damaged the plants", "Yes, because he entered Y's land intentionally without permission"], answer: 3, explanation: "X chose to enter the garden without permission. Under the principle, a good reason or the absence of damage does not change that." },
      { id: "lr1", section: "Logical reasoning", topic: "Logical reasoning", type: "mcq", text: "All roses are flowers. Some flowers fade quickly.\nDoes it follow that some roses fade quickly?", options: ["Yes, it definitely follows", "No, it is definitely false", "It does not necessarily follow", "Yes, because roses are flowers"], answer: 2, explanation: "The flowers that fade quickly may not include any roses. The conclusion might be true, but it is not guaranteed." },
      { id: "lr2", section: "Logical reasoning", topic: "Logical reasoning", type: "mcq", text: "What comes next: 2, 6, 12, 20, 30, ?", options: ["40", "42", "44", "36"], answer: 1, explanation: "The differences are 4, 6, 8, 10, so the next is 12: 30 + 12 = 42. (Each term is n × (n + 1).)" },
      { id: "lr3", section: "Logical reasoning", topic: "Logical reasoning", type: "mcq", text: "If SOUTH is written as TPVUI, how is NORTH written?", options: ["OPSUI", "MNQSG", "OPTUI", "OQSUI"], answer: 0, explanation: "Each letter moves one place forward: N→O, O→P, R→S, T→U, H→I." },
      { id: "lr4", section: "Logical reasoning", topic: "Logical reasoning", type: "mcq", text: "Asha walks 5 km north, turns right and walks 3 km, then turns right again and walks 5 km. Where is she now from her starting point?", options: ["3 km west", "5 km south", "13 km north-east", "3 km east"], answer: 3, explanation: "North 5, then right is east 3, then right is south 5. The north and south legs cancel, leaving her 3 km east." },
      { id: "q1", section: "Quantitative techniques", topic: "Quantitative techniques", type: "mcq", text: "A shirt priced at ₹800 is sold at a 25% discount. What is the selling price?", options: ["₹560", "₹640", "₹600", "₹775"], answer: 2, explanation: "25% of ₹800 is ₹200, so the price is ₹800 - ₹200 = ₹600." },
      { id: "q2", section: "Quantitative techniques", topic: "Quantitative techniques", type: "mcq", text: "The ratio of boys to girls in a class of 40 is 3 : 2. How many girls are there?", options: ["24", "16", "20", "12"], answer: 1, explanation: "Girls are 2 of every 5 students: 40 × 2/5 = 16." },
      { id: "e1", section: "English language", topic: "English language", type: "mcq", text: "Choose the word closest in meaning to 'candid'.", options: ["Frank", "Careful", "Cunning", "Quiet"], answer: 0, explanation: "'Candid' means open and honest, which is 'frank'." },
      { id: "e2", section: "English language", topic: "English language", type: "mcq", text: "Choose the correctly spelt word.", options: ["Accomodation", "Acommodation", "Accommadation", "Accommodation"], answer: 3, explanation: "'Accommodation' has a double c and a double m." },
    ],
  },
  {
    id: "cat-practice-1",
    examSlug: "cat",
    title: "CAT practice set 1 (QA, DILR, VARC)",
    minutes: 30,
    marking: { correct: 3, wrong: -1, titaWrong: 0 },
    pattern: "12 questions: 5 QA, 4 DILR, 3 VARC, including 2 type-in-the-answer questions. +3 for correct, -1 for a wrong MCQ, no negative for typed answers.",
    passages: {
      habits: {
        title: "Read the passage and answer the questions",
        text: "Most people assume that habits are built through motivation: if you want something badly enough, you will keep doing it. Research on behaviour change suggests a different picture. Motivation rises and falls through the day, but the context around us stays relatively stable. A person who walks past a fruit bowl every morning is more likely to eat fruit than one who has to remember to buy it. Designing the environment so that the desired action is the easiest one available often does more than willpower. This does not mean motivation is useless; it explains why people start. But what keeps a behaviour going is usually a cue in the environment that triggers it with little thought.",
      },
      scores: {
        title: "Four friends' scores (out of 100) in three tests",
        text: "Asha: Test 1 = 72, Test 2 = 85, Test 3 = 90\nBilal: Test 1 = 88, Test 2 = 64, Test 3 = 79\nChitra: Test 1 = 95, Test 2 = 70, Test 3 = 66\nDev: Test 1 = 60, Test 2 = 92, Test 3 = 84",
      },
    },
    questions: [
      { id: "qa1", section: "Quantitative ability", topic: "Algebra", type: "mcq", text: "If x + 1/x = 4, what is x² + 1/x²?", options: ["16", "12", "14", "18"], answer: 2, explanation: "Square both sides: x² + 2 + 1/x² = 16, so x² + 1/x² = 14." },
      { id: "qa2", section: "Quantitative ability", topic: "Arithmetic", type: "mcq", text: "A sum doubles in 8 years at simple interest. What is the annual rate?", options: ["10%", "12.5%", "8%", "15%"], answer: 1, explanation: "Doubling means the interest equals the principal in 8 years: R = 100/8 = 12.5% a year." },
      { id: "qa3", section: "Quantitative ability", topic: "Arithmetic", type: "mcq", text: "A 150 m long train passes a pole in 10 seconds. What is its speed?", options: ["45 km/h", "60 km/h", "72 km/h", "54 km/h"], answer: 3, explanation: "Speed = 150/10 = 15 m/s = 15 × 18/5 = 54 km/h." },
      { id: "qa4", section: "Quantitative ability", topic: "Modern maths", type: "tita", text: "In how many different ways can the letters of the word LEVEL be arranged? Type the number.", answer: 30, explanation: "5 letters with L and E each repeated twice: 5!/(2! × 2!) = 120/4 = 30." },
      { id: "qa5", section: "Quantitative ability", topic: "Number system", type: "mcq", text: "What is the average of the first 10 natural numbers?", options: ["5.5", "5", "6", "10"], answer: 0, explanation: "The sum is 10 × 11/2 = 55, so the average is 55/10 = 5.5." },
      { id: "di1", section: "Data interpretation and logical reasoning", topic: "Tables and charts", type: "mcq", passageId: "scores", text: "Who has the highest total across the three tests?", options: ["Bilal", "Asha", "Chitra", "Dev"], answer: 1, explanation: "Totals: Asha 247, Bilal 231, Chitra 231, Dev 236. Asha is highest." },
      { id: "di2", section: "Data interpretation and logical reasoning", topic: "Tables and charts", type: "mcq", passageId: "scores", text: "In how many tests did Dev score more than Asha?", options: ["0", "2", "3", "1"], answer: 3, explanation: "Test 1: 60 < 72. Test 2: 92 > 85. Test 3: 84 < 90. Only one test." },
      { id: "di3", section: "Data interpretation and logical reasoning", topic: "Tables and charts", type: "tita", passageId: "scores", text: "What is Chitra's average score across the three tests? Type the number.", answer: 77, explanation: "(95 + 70 + 66)/3 = 231/3 = 77." },
      { id: "di4", section: "Data interpretation and logical reasoning", topic: "Tables and charts", type: "mcq", passageId: "scores", text: "Which two friends have the same total?", options: ["Bilal and Chitra", "Asha and Dev", "Chitra and Dev", "Asha and Bilal"], answer: 0, explanation: "Bilal: 88 + 64 + 79 = 231. Chitra: 95 + 70 + 66 = 231." },
      { id: "va1", section: "Verbal ability and reading comprehension", topic: "Reading comprehension", type: "mcq", passageId: "habits", text: "Which statement best captures the passage's main idea?", options: ["Motivation is useless for building habits", "Eating fruit every morning is the best habit to build", "Making the desired action easy in your surroundings sustains habits better than relying on motivation", "Willpower can be trained like a muscle"], answer: 2, explanation: "The passage argues that environment design does more than willpower to keep a behaviour going. It says motivation is not useless, so the first option overstates it." },
      { id: "va2", section: "Verbal ability and reading comprehension", topic: "Reading comprehension", type: "mcq", passageId: "habits", text: "The author would most likely agree that:", options: ["Motivation helps people start a habit but rarely keeps it going on its own", "People with strong motivation never need cues in their surroundings", "Our surroundings change more often than our motivation does", "Habits form only through repeated conscious decisions"], answer: 0, explanation: "The passage says motivation 'explains why people start' while environmental cues keep behaviour going. It also says context is more stable than motivation, which rules out the third option." },
      { id: "va3", section: "Verbal ability and reading comprehension", topic: "Reading comprehension", type: "mcq", passageId: "habits", text: "As used in the last sentence, 'cue' most nearly means:", options: ["A reward", "A rule", "A mistake", "A signal that prompts an action"], answer: 3, explanation: "The cue 'triggers' the behaviour with little thought, so it is a signal that prompts an action." },
    ],
  },
  {
    id: "cuet-gt-practice-1",
    examSlug: "cuet-ug",
    title: "CUET-UG General Test practice set 1",
    minutes: 15,
    marking: { correct: 5, wrong: -1 },
    pattern: "12 MCQs in numerical ability, reasoning and general mental ability. +5 for correct, -1 for wrong (the real General Test has 50 questions in 60 minutes).",
    questions: [
      { id: "g1", section: "General Test", topic: "Numerical ability", type: "mcq", text: "What is 15% of 240?", options: ["32", "36", "38", "24"], answer: 1, explanation: "15% of 240 = 0.15 × 240 = 36." },
      { id: "g2", section: "General Test", topic: "Numerical ability", type: "mcq", text: "The ratio of A's age to B's age is 4 : 5. If B is 25, how old is A?", options: ["24", "15", "30", "20"], answer: 3, explanation: "Each part is 25/5 = 5 years, so A is 4 × 5 = 20." },
      { id: "g3", section: "General Test", topic: "General mental ability", type: "mcq", text: "Which number is the odd one out: 2, 3, 5, 9, 11?", options: ["2", "9", "5", "11"], answer: 1, explanation: "All the others are prime numbers; 9 = 3 × 3 is not." },
      { id: "g4", section: "General Test", topic: "General mental ability", type: "mcq", text: "What is the angle between the hour and minute hands of a clock at exactly 3:00?", options: ["90°", "60°", "45°", "120°"], answer: 0, explanation: "Each hour mark is 30° apart. At 3:00 the hands are 3 marks apart: 3 × 30° = 90°." },
      { id: "g5", section: "General Test", topic: "Quantitative reasoning", type: "mcq", text: "A can finish a piece of work in 10 days and B in 15 days. How long will they take working together?", options: ["5 days", "8 days", "6 days", "12.5 days"], answer: 2, explanation: "Together they do 1/10 + 1/15 = 5/30 = 1/6 of the work a day, so they need 6 days." },
      { id: "g6", section: "General Test", topic: "Logical and analytical reasoning", type: "mcq", text: "If CAT is coded as 24 (C = 3, A = 1, T = 20), what is the code for DOG?", options: ["26", "24", "28", "30"], answer: 0, explanation: "D = 4, O = 15, G = 7, and 4 + 15 + 7 = 26." },
      { id: "g7", section: "General Test", topic: "Logical and analytical reasoning", type: "mcq", text: "If today is Monday, what day will it be 45 days from today?", options: ["Wednesday", "Friday", "Tuesday", "Thursday"], answer: 3, explanation: "45 = 6 weeks + 3 days. Three days after Monday is Thursday." },
      { id: "g8", section: "General Test", topic: "Logical and analytical reasoning", type: "mcq", text: "Statements: All pens are tools. No tool is a toy.\nConclusion: No pen is a toy.\nDoes the conclusion follow?", options: ["It does not follow", "It follows", "It follows only if some tools are toys", "It cannot be decided"], answer: 1, explanation: "Every pen is a tool, and no tool is a toy, so no pen can be a toy." },
      { id: "g9", section: "General Test", topic: "Numerical ability", type: "mcq", text: "What is the simple interest on ₹5,000 at 8% a year for 2 years?", options: ["₹400", "₹832", "₹800", "₹1,000"], answer: 2, explanation: "SI = P × R × T / 100 = 5,000 × 8 × 2 / 100 = ₹800." },
      { id: "g10", section: "General Test", topic: "General mental ability", type: "mcq", text: "What comes next: 3, 9, 27, 81, ?", options: ["162", "243", "324", "108"], answer: 1, explanation: "Each term is multiplied by 3: 81 × 3 = 243." },
      { id: "g11", section: "General Test", topic: "Logical and analytical reasoning", type: "mcq", text: "A is B's father. C is A's mother. How is C related to B?", options: ["Grandmother", "Mother", "Aunt", "Sister"], answer: 0, explanation: "C is the mother of B's father, so C is B's grandmother." },
      { id: "g12", section: "General Test", topic: "Quantitative reasoning", type: "mcq", text: "A bus covers 60 km in 1 hour 30 minutes. What is its average speed?", options: ["45 km/h", "50 km/h", "35 km/h", "40 km/h"], answer: 3, explanation: "Speed = 60 km / 1.5 h = 40 km/h." },
    ],
  },
];

export function mockById(id: string): MockTest | undefined {
  return MOCK_TESTS.find((m) => m.id === id);
}

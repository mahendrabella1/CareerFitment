/**
 * Rebalances the class 9-10 career-interest section.
 *
 * WHY THIS EXISTS
 * ---------------
 * scripts/audit_cluster_balance.ts measured what a random cohort actually gets
 * recommended, and the interest section was the bottleneck:
 *
 *   cluster                       share of weight   options where it led (of 60)
 *   E Business & Marketing              23.0%              12
 *   D Arts, Media & Design              20.1%              12
 *   C Health Science                    17.4%              12
 *   F Human & Public Services           14.5%               9
 *   A Engineering                        7.2%               3
 *   G Science, Nature & Agriculture      6.9%               6
 *   H Sports, Hospitality & Lifestyle    5.3%               4
 *   B Information Technology             5.6%               2
 *
 * Business, Arts and Health each owned an option in ALL twelve questions.
 * Information Technology owned two — and both only won on a 1-point tiebreak
 * inside a four-way split ("work out why the product keeps failing"). There was
 * no option anywhere in the section that plainly said "I like building
 * software". A student who loves computers could not say so, which is why IT
 * came out top for 0.3% of a random cohort.
 *
 * No weighting change fixes that: you cannot re-weight an option that was never
 * on the page. So the options themselves are rewritten here.
 *
 * WHAT THIS DOES
 * --------------
 * 1. Replaces the 12 questions' options, riasec, clusterWeights and careers so
 *    every cluster leads 7 or 8 of the 60 options (12 x 5 = 60 = 8x4 + 7x4),
 *    with all five clusters in a question distinct. The question stems are
 *    kept — they were good scenarios; it was the answers that were lopsided.
 *
 * 2. Fixes two professions filed under the wrong cluster: Product Engineer and
 *    Sales Engineer sat in "Sports, Hospitality & Lifestyle", so a student
 *    matched to hospitality was told to consider being a Product Engineer.
 *
 * 3. Renames cluster A to "Core Engineering & Infrastructure" — "Construction"
 *    led on a cluster that is mostly civil, mechanical, electrical and energy.
 *
 * Scoring weights are NOT touched. The scorer was reading its inputs correctly;
 * the inputs were the problem.
 *
 * Run:  node scripts/rebalance_interest_bank_9_10.mjs
 * Then: node scripts/run_verify_scoring60.mjs audit_cluster_balance
 */
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const PROJECT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const BANK = resolve(PROJECT, "data", "assessment-questions.json");
const MAP = resolve(PROJECT, "data", "career-map-9-10.json");
const CLUSTERS = resolve(PROJECT, "data", "career-clusters.json");

/* Each option is [clusterLetter, text, riasecVector, careers[]].
 *
 * Each option now awards its cluster and nothing else. The old bank spread 1-2
 * consolation points across three or four clusters per option, which is how
 * "the team working out why the product keeps failing" ended up counting as an
 * IT answer by a single point — and how picking the coding option scored you as
 * Science. One option, one cluster keeps a pick meaning what the student thinks
 * it means. Nuance belongs in the seven other dimensions, which already blend.
 *
 * RIASEC keeps its cross-loading: those six themes genuinely overlap, and that
 * vector feeds the Holland code rather than the cluster ranking.
 */
const Q = [
  ["Your family is opening a small food outlet and wants your help. Which part of it would you want to run?", [
    ["D", "Design the logo, the menu, the packaging and the look of the place.", { A: 3, E: 1 }, ["Graphic Designer", "Product Designer", "Interior Designer", "Creative Director"]],
    ["E", "Handle pricing, billing, suppliers and the daily accounts.", { C: 3, E: 2 }, ["Chartered Accountant", "Business Manager", "Financial Analyst", "Operations Manager", "Auditor"]],
    ["A", "Set up the kitchen equipment, wiring and layout — and fix whatever breaks.", { R: 3, I: 1 }, ["Mechanical Engineer", "Electrical Engineer", "Automation Engineer", "Engineer"]],
    ["C", "Make sure the food is safe, hygienic and genuinely good for people.", { S: 3, I: 2 }, ["Nutritionist", "Public Health Specialist", "Doctor"]],
    ["B", "Build the ordering website and a simple app for online orders.", { I: 3, C: 1 }, ["Software Engineer", "Mobile App Developer", "UX Designer"]],
  ]],
  ["Your community faces a serious water shortage. What would you do first?", [
    ["G", "Collect samples, identify the root cause and test possible solutions.", { I: 3, R: 1 }, ["Environmental Scientist", "Research Scientist", "Chemist", "Microbiologist"]],
    ["F", "Meet local residents and organise volunteers to solve it together.", { S: 3, E: 2 }, ["Social Worker", "Civil Services Officer", "Policy Analyst", "Counsellor"]],
    ["A", "Design and build the pipelines, storage tanks and rainwater harvesting.", { R: 3, I: 2 }, ["Civil Engineer", "Environmental Engineer", "Structural Engineer", "Urban Planner"]],
    ["B", "Build a sensor dashboard that tracks supply and flags leaks early.", { I: 3, R: 1 }, ["Data Analyst", "Software Engineer", "Network Engineer", "Cloud Engineer"]],
    ["H", "Set up a community kitchen and rest area for the families queueing for water.", { S: 3, E: 1 }, ["Chef", "Event Manager", "Hotel Manager"]],
  ]],
  ["Your teacher asks you to create something that helps students learn better.", [
    ["E", "Organise the project timeline, budget and responsibilities.", { E: 3, C: 2 }, ["Project Manager", "Business Manager", "Operations Manager", "Consultant"]],
    ["D", "Design engaging illustrations, animations and interactive visuals.", { A: 3, I: 1 }, ["Animator", "Graphic Designer", "Media Professional", "Content Creator"]],
    ["C", "Run sessions on sleep, stress and staying well enough to study.", { S: 3, I: 1 }, ["Clinical Psychologist", "Nutritionist", "Public Health Specialist"]],
    ["F", "Create a mentoring or peer-learning programme for classmates.", { S: 3, E: 2 }, ["Teacher", "Counsellor", "Technical Trainer", "Social Worker"]],
    ["G", "Build a school garden or lab corner where students learn by growing and testing.", { I: 3, R: 2 }, ["Agricultural Scientist", "Horticulturist", "Environmental Scientist", "Biotechnologist"]],
  ]],
  ["During a science exhibition, which project would excite you the most?", [
    ["C", "Model how an infection spreads through a school and how to stop it.", { S: 3, I: 2 }, ["Doctor", "Public Health Specialist", "Nurse"]],
    ["B", "An AI model that predicts the weather or spots crop disease from photos.", { I: 3, R: 1 }, ["AI Engineer", "Data Scientist", "Software Engineer", "Data Analyst"]],
    ["A", "A working model of a bridge, an engine or a solar power system.", { R: 3, I: 2 }, ["Civil Engineer", "Mechanical Engineer", "Renewable Energy Engineer", "Structural Engineer"]],
    ["D", "An interactive exhibit that makes a hard idea easy to understand.", { A: 3, S: 1 }, ["Industrial Designer", "Product Designer", "Media Professional", "Creative Director"]],
    ["H", "A project on sports performance — nutrition, training and recovery.", { R: 3, S: 2 }, ["Sports Scientist", "Fitness Trainer", "Dietician", "Sports Coach"]],
  ]],
  ["Your class must organise an event with a limited budget. Which responsibility would you prefer?", [
    ["E", "Prepare the budget, assign tasks and keep everything on schedule.", { C: 3, E: 2 }, ["Project Manager", "Operations Manager", "Business Manager", "Financial Planner"]],
    ["F", "Lead the team and coordinate with teachers, students and parents.", { S: 3, E: 2 }, ["Teacher", "HR Manager", "Public Speaker", "Civil Services Officer"]],
    ["H", "Handle the catering, the guest experience and hospitality on the day.", { S: 3, E: 1 }, ["Event Manager", "Hotel Manager", "Chef", "Travel Consultant"]],
    ["A", "Set up the stage, sound, lighting and the safe electrical work.", { R: 3, I: 1 }, ["Electrical Engineer", "Electronics Engineer", "Engineer", "Automation Engineer"]],
    ["G", "Make it a zero-waste event — measure the waste and design it out.", { I: 3, R: 2 }, ["Environmental Scientist", "Forestry Officer", "Horticulturist"]],
  ]],
  ["A weekend market gives students a free stall for one day. What would yours be?", [
    ["D", "My own artwork, prints and handmade design pieces.", { A: 3 }, ["Graphic Designer", "Fashion Designer", "Photographer", "Animator"]],
    ["F", "Free tutoring and study advice for younger students.", { S: 3 }, ["Teacher", "Technical Trainer", "Counsellor", "Social Worker"]],
    ["C", "Free health checks — height, weight, eyesight — with simple advice.", { S: 3, I: 2 }, ["Nurse", "Paramedic", "Physiotherapist", "Public Health Specialist"]],
    ["E", "Something I've sourced and priced to actually turn a profit.", { E: 3, C: 2 }, ["Entrepreneur", "Startup Founder", "Digital Marketer", "Business Analyst"]],
    ["B", "A booth where I build people a free one-page website on the spot.", { I: 3, R: 1 }, ["Software Engineer", "Mobile App Developer", "UX Designer", "IT Support Specialist"]],
  ]],
  ["Your school is launching a robotics club. Which activity interests you the most?", [
    ["A", "Build and assemble the robot's hardware, motors and frame.", { R: 3, I: 2 }, ["Robotics Engineer", "Mechanical Engineer", "Electronics Engineer", "Automation Engineer"]],
    ["B", "Write the code and the AI that decides what the robot does.", { I: 3, R: 2 }, ["AI Engineer", "Software Engineer", "Game Developer", "Research Engineer"]],
    ["C", "Build an assistive device — a prosthetic hand or a mobility aid.", { S: 3, R: 2 }, ["Biomedical Engineer", "Occupational Therapist", "Physiotherapist"]],
    ["G", "Research which materials and sensors work best, and test them properly.", { I: 3, R: 1 }, ["Research Scientist", "Chemist", "Biotechnologist"]],
    ["H", "Build a robot that referees a match or trains athletes.", { R: 2, S: 2 }, ["Sports Scientist", "Sports Coach", "Fitness Trainer"]],
  ]],
  ["A nearby hospital tells your school that patients keep missing appointments, and asks students for help. Which part would you take on?", [
    ["F", "Talk to patients and staff to understand what's really stopping them.", { S: 3, I: 1 }, ["Social Worker", "Counsellor", "Policy Analyst", "Psychologist"]],
    ["E", "Work out what the empty slots cost, and build a booking system that pays for itself.", { C: 3, E: 2 }, ["Business Analyst", "Operations Manager", "Consultant", "Project Manager"]],
    ["D", "Design reminder cards and signage that people actually read.", { A: 3, S: 1 }, ["Graphic Designer", "Content Creator", "Media Professional", "Creative Director"]],
    ["G", "Study whether illness patterns, seasons or harvest timing explain the no-shows.", { I: 3, C: 2 }, ["Microbiologist", "Research Scientist", "Environmental Scientist"]],
    ["H", "Arrange transport, refreshments and a comfortable waiting area.", { S: 3, E: 1 }, ["Hotel Manager", "Event Manager", "Travel Consultant"]],
  ]],
  ["You receive ₹5,000 to create a useful student project. How would you use it?", [
    ["A", "Build a working prototype — a device, a model or a machine.", { R: 3, I: 2 }, ["Mechanical Engineer", "Robotics Engineer", "Engineer", "Electronics Engineer"]],
    ["D", "Create a design product, a short film or an awareness campaign.", { A: 3, E: 1 }, ["Film Maker", "Content Creator", "Graphic Designer", "Photographer"]],
    ["E", "Start a small venture and track every rupee of profit and loss.", { E: 3, C: 2 }, ["Entrepreneur", "Startup Founder", "Financial Analyst", "Business Manager"]],
    ["B", "Develop an app or website that solves a real problem for students.", { I: 3, C: 1 }, ["Software Engineer", "Mobile App Developer", "UX Designer", "Data Analyst"]],
    ["C", "Set up a first-aid point and a health awareness corner.", { S: 3, I: 1 }, ["Nurse", "Paramedic", "Public Health Specialist", "Doctor"]],
  ]],
  ["Which YouTube channel would you watch for two hours without getting bored?", [
    ["B", "Coding, software, AI, cybersecurity and how computers really work.", { I: 3, R: 1 }, ["Software Engineer", "AI Engineer", "Cybersecurity Analyst", "Data Scientist", "Game Developer"]],
    ["G", "Space, wildlife, physics, farming and how the natural world works.", { I: 3, R: 2 }, ["Astrophysicist", "Marine Biologist", "Environmental Scientist", "Agricultural Scientist"]],
    ["A", "How bridges, engines, factories and power stations actually get built.", { R: 3, I: 2 }, ["Civil Engineer", "Mechanical Engineer", "Aerospace Engineer", "Renewable Energy Engineer"]],
    ["H", "Sport, fitness, travel, food and how people live well.", { S: 3, R: 1 }, ["Athlete", "Sports Coach", "Chef", "Travel Consultant", "Fitness Trainer"]],
    ["F", "Law, politics, social issues, teaching and public service.", { S: 3, E: 2 }, ["Lawyer", "IAS Officer", "Judge", "Teacher", "Policy Analyst"]],
  ]],
  ["A company offers ten students a one-month paid internship. Which team would you ask to join?", [
    ["C", "The team testing whether the product is safe for people to use.", { S: 3, I: 2 }, ["Public Health Specialist", "Pharmacist", "Doctor", "Nutritionist"]],
    ["D", "The team redesigning how the product looks and feels.", { A: 3, I: 1 }, ["Product Designer", "Industrial Designer", "UX Designer", "Creative Director"]],
    ["E", "The team tracking costs, stock and delivery schedules.", { C: 3, E: 2 }, ["Supply Chain Manager", "Operations Manager", "Business Analyst", "Auditor"]],
    ["F", "The team training new users and answering their questions.", { S: 3, E: 1 }, ["Technical Trainer", "Teacher", "HR Manager", "Public Speaker"]],
    ["G", "The team running lab tests on new materials and ingredients.", { I: 3, R: 2 }, ["Chemist", "Food Technologist", "Biotechnologist", "Microbiologist"]],
  ]],
  ["Your school is starting a student-run magazine and website. Which role would you take?", [
    ["D", "Design the layout, illustrations, photographs and cover art.", { A: 3 }, ["Graphic Designer", "Photographer", "Creative Director", "Journalist"]],
    ["B", "Build the website, keep it fast and handle everything technical.", { I: 3, R: 1 }, ["Software Engineer", "Cloud Engineer", "Network Engineer", "Database Administrator"]],
    ["C", "Cover health, fitness and student wellbeing.", { S: 3, I: 1 }, ["Nutritionist", "Public Health Specialist", "Clinical Psychologist"]],
    ["H", "Cover sport, food, travel and campus life.", { S: 2, E: 2 }, ["Sports Coach", "Chef", "Travel Consultant", "Event Manager"]],
    ["A", "Set up and run the studio — cameras, lighting and recording equipment.", { R: 3, I: 1 }, ["Electronics Engineer", "Electrical Engineer", "Engineer"]],
  ]],
];

/* ------------------------------ apply ---------------------------------- */
const bank = JSON.parse(readFileSync(BANK, "utf8"));
const set = bank.career_interest["9-10"]["Set 1"];
if (set.length !== Q.length) {
  console.error(`expected ${Q.length} questions in the bank, found ${set.length} — aborting`);
  process.exit(1);
}

const lead = {};
Q.forEach(([text, opts], i) => {
  const seen = new Set(opts.map(([c]) => c));
  if (seen.size !== 5) { console.error(`Q${i + 1} repeats a cluster — aborting`); process.exit(1); }
  set[i].text = text;
  set[i].options = opts.map(([, t]) => t);
  set[i].riasec = opts.map(([, , r]) => r);
  set[i].clusterWeights = opts.map(([c]) => ({ [c]: 5 }));
  set[i].careers = opts.map(([, , , careers]) => careers);
  for (const [c] of opts) lead[c] = (lead[c] ?? 0) + 1;
});

/* Cluster rename — the name lives in three places that must agree. */
const clusters = JSON.parse(readFileSync(CLUSTERS, "utf8"));
clusters.A.cluster = "Core Engineering & Infrastructure";
clusters.A.careers = ["Civil / Structural Engineer", "Mechanical Engineer", "Electrical & Electronics Engineer", "Renewable Energy Engineer", "Infrastructure & Project Manager"];

/* Two professions were filed under Sports, Hospitality & Lifestyle. */
const map = JSON.parse(readFileSync(MAP, "utf8"));
const moved = [];
for (const [p, c] of [["Product Engineer", "A"], ["Sales Engineer", "E"]]) {
  if (map.professionCluster[p] && map.professionCluster[p] !== c) {
    moved.push(`${p}: ${map.professionCluster[p]} -> ${c}`);
    map.professionCluster[p] = c;
  }
}

writeFileSync(BANK, JSON.stringify(bank, null, 1) + "\n");
writeFileSync(CLUSTERS, JSON.stringify(clusters, null, 1) + "\n");
writeFileSync(MAP, JSON.stringify(map, null, 1) + "\n");

console.log("rewrote career_interest 9-10 / Set 1");
console.log("options where each cluster leads (target 7-8 of 60):");
for (const k of ["A", "B", "C", "D", "E", "F", "G", "H"]) console.log(`   ${k}  ${lead[k] ?? 0}`);
console.log(`renamed cluster A -> ${clusters.A.cluster}`);
console.log(moved.length ? `reassigned: ${moved.join(", ")}` : "no profession reassignments needed");

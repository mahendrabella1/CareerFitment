/**
 * Aptitude Lab - every topic (its concept card, the time a good answer takes,
 * and where its questions come from), the four class tracks, their mock
 * tests, and the builders that turn a seed into a set of questions.
 */
import { choices, int, rngFrom, shuffle, type Draft, type Level, type Question, type Rng, type Section } from "./core";
import * as Q from "./quant";
import * as R from "./reasoning";
import { BANKS, type BankItem } from "./bank";
import { TOPIC_INFO, type AptTrack, type TopicId, type TrackTopic } from "./tracks";

export * from "./tracks";

export interface Concept {
  /** What the topic is about, in one or two sentences. */
  idea: string;
  /** The method, step by step. */
  steps: string[];
  example: string;
  shortcut?: string;
  /** The mistake most people make. */
  trap?: string;
}

export interface Topic {
  id: string;
  title: string;
  section: Section;
  /** Seconds a well-practised answer takes - the speed target. */
  targetSec: number;
  concept: Concept;
  gen?: (r: Rng, level: Level) => Draft;
  bank?: string;
}

const T = (id: TopicId, concept: Concept, src: ((r: Rng, level: Level) => Draft) | string): Topic =>
  ({ id, ...TOPIC_INFO[id], concept, ...(typeof src === "string" ? { bank: src } : { gen: src }) });

export const TOPICS: Topic[] = [
  // ---------------------------------------------------------------- quantitative
  T("q-arith", {
    idea: "Work out long sums in the right order so everyone gets the same answer.",
    steps: ["Brackets first.", "Then Orders (powers and roots) and \"of\".", "Then Division and Multiplication, left to right.", "Then Addition and Subtraction, left to right."],
    example: "8 + 4 × 3 − 2 = 8 + 12 − 2 = 18 (not 12 × 3 − 2 = 34).",
    shortcut: "For percentages of round numbers, find 10% first (move the decimal one place) and build from it: 25% = 10% + 10% + 5%.",
    trap: "Working strictly left to right - multiplication and division come before + and −.",
  }, Q.arith),
  T("q-numbers", {
    idea: "Factors, multiples, HCF and LCM, remainders and divisibility rules.",
    steps: ["HCF = the biggest number that divides both.", "LCM = the smallest number both divide into.", "For two numbers: HCF × LCM = the product of the numbers.", "\"Leaves the same remainder r\" → LCM + r."],
    example: "HCF of 12 and 18 = 6; LCM = 12 × 18 ÷ 6 = 36.",
    shortcut: "Divisibility: by 3 or 9 - digit sum; by 4 - last two digits; by 8 - last three digits; by 11 - alternating digit sum is 0 or a multiple of 11.",
    trap: "Giving the product of the numbers as the LCM - it's only true when the HCF is 1.",
  }, Q.numbers),
  T("q-fractions", {
    idea: "Adding, comparing and taking fractions \"of\" a number.",
    steps: ["To add, make the denominators the same.", "To compare, turn into decimals or cross-multiply.", "\"Of\" means multiply.", "Always give the answer in lowest terms."],
    example: "1/2 + 1/3 = 3/6 + 2/6 = 5/6.",
    shortcut: "To compare a/b and c/d, compare a × d with b × c.",
    trap: "Adding the tops and the bottoms (1/2 + 1/3 is not 2/5).",
  }, Q.fractions),
  T("q-percent", {
    idea: "A percentage is a number out of 100 - most questions turn on the base it's taken from.",
    steps: ["x% of N = x/100 × N.", "Percentage change = change ÷ original × 100.", "Successive changes multiply: +a% then −b% → × (1 + a/100) × (1 − b/100)."],
    example: "Up 20% then down 20%: 100 → 120 → 96, a 4% fall overall.",
    shortcut: "Net of two changes a and b: a + b + ab/100 (use a minus sign for a fall).",
    trap: "Adding percentages: +20% then −20% is not 0%.",
  }, Q.percent),
  T("q-ratio", {
    idea: "A ratio compares parts; the parts add up to the whole.",
    steps: ["Divide a total in a : b → one part = total ÷ (a + b).", "Chain ratios by making the shared term equal.", "Unknown numbers in a ratio a : b → write them as ax and bx."],
    example: "₹600 in 1 : 2 → 3 parts of ₹200 → ₹200 and ₹400.",
    shortcut: "A : B = a : b and B : C = c : d → A : C = ac : bd.",
    trap: "Dividing the total by one side of the ratio instead of by the total of the parts.",
  }, Q.ratioQ),
  T("q-average", {
    idea: "Average = total ÷ count. Most questions are about the total.",
    steps: ["Turn every average into a total (average × count).", "Add or subtract totals.", "Divide by the new count."],
    example: "5 numbers average 20 (total 100). Remove one and 4 average 18 (total 72) → removed 28.",
    shortcut: "When a newcomer raises the average of n people by d, the newcomer = old average + (n + 1) × d.",
    trap: "Averaging two averages directly when the groups are different sizes.",
  }, Q.average),
  T("q-profit", {
    idea: "Profit and loss percentages are on the cost price; discounts are on the marked price.",
    steps: ["Profit % = profit ÷ CP × 100.", "SP = CP × (100 + profit%) / 100.", "Discounted price = MP × (100 − discount%) / 100."],
    example: "CP ₹500, sold at ₹600 → profit ₹100 → 20%.",
    shortcut: "If selling at ₹S loses l%, then CP = S × 100 / (100 − l).",
    trap: "Calculating profit % on the selling price.",
  }, Q.profit),
  T("q-interest", {
    idea: "Simple interest is on the starting amount only; compound interest is also on earlier interest.",
    steps: ["SI = P × R × T / 100.", "Amount with CI = P × (1 + R/100)^T.", "CI = amount − P."],
    example: "₹1,000 at 10% for 2 years: SI = ₹200; CI = ₹210.",
    shortcut: "For 2 years, CI − SI = P × (R/100)².",
    trap: "Using the SI formula when the question says \"compounded\".",
  }, Q.interest),
  T("q-timework", {
    idea: "Turn days into work per day, add rates, then turn back.",
    steps: ["A finishes in a days → does 1/a a day.", "Together: add the daily work.", "Days = 1 ÷ daily work."],
    example: "A 10 days, B 15 days → 1/10 + 1/15 = 1/6 → 6 days together.",
    shortcut: "Take the total work as the LCM of the days - then every rate is a whole number of units.",
    trap: "Averaging the days ((10 + 15)/2) - working together is always faster than either alone.",
  }, Q.timeWork),
  T("q-speed", {
    idea: "Distance = speed × time - keep the units the same.",
    steps: ["km/h → m/s: × 5/18. m/s → km/h: × 18/5.", "A train crossing a pole covers its own length; a platform - its length plus the platform's.", "Same direction: subtract speeds; opposite: add them."],
    example: "72 km/h = 20 m/s; a 200 m train passes a pole in 10 s.",
    shortcut: "Average speed over two equal distances = 2xy ÷ (x + y).",
    trap: "Averaging the two speeds when the distances are equal - it's always lower than the simple average.",
  }, Q.speed),
  T("q-ages", {
    idea: "Everyone gets older by the same number of years.",
    steps: ["Let the present ages be x (or ax and bx for a ratio).", "Add the same years to both for \"after n years\".", "Write one equation and solve."],
    example: "Ratio 2 : 5 now, 3 : 6 in 4 years → (2x + 4)/(5x + 4) = 1/2 → x = 4 → ages 8 and 20.",
    shortcut: "Check your answer by putting it back into the question - it takes ten seconds.",
    trap: "Adding the years to only one person.",
  }, Q.ages),
  T("q-mensuration", {
    idea: "Formulas for flat shapes and solids - know a handful by heart.",
    steps: ["Rectangle: area l × b, perimeter 2(l + b).", "Circle: area πr², circumference 2πr.", "Cuboid: volume lbh, surface 2(lb + bh + hl). Cylinder: volume πr²h."],
    example: "Circle of radius 7: area = 22/7 × 49 = 154.",
    shortcut: "When π = 22/7 and the radius is a multiple of 7, cancel the 7 first.",
    trap: "Mixing up area (square units) with perimeter (length).",
  }, Q.mensuration),
  T("q-mixture", {
    idea: "Mixing two things at different prices or strengths to get one in between.",
    steps: ["Alligation: (dearer − mean) : (mean − cheaper) = cheaper : dearer.", "In milk-and-water problems, find what stays the same (usually the milk).", "Repeated replacement: multiply by (1 − x/V) each time."],
    example: "₹20 and ₹30 rice for ₹24 → (30 − 24) : (24 − 20) = 3 : 2.",
    shortcut: "Draw the alligation cross: two prices on top, the mean in the middle, differences diagonally.",
    trap: "Writing the alligation ratio the wrong way round.",
  }, Q.mixture),
  T("q-probability", {
    idea: "Probability = favourable outcomes ÷ all equally likely outcomes.",
    steps: ["Count all the outcomes (one die 6, two dice 36, a pack 52).", "Count the ones that fit.", "Divide and simplify."],
    example: "Total 7 with two dice: (1,6), (2,5), (3,4), (4,3), (5,2), (6,1) → 6/36 = 1/6.",
    shortcut: "P(not A) = 1 − P(A) - often much quicker to count.",
    trap: "Forgetting that (2,5) and (5,2) are different outcomes with two dice.",
  }, Q.probability),
  T("q-pnc", {
    idea: "Permutations count arrangements (order matters); combinations count selections (it doesn't).",
    steps: ["Arranging n different things: n!.", "Choosing r from n: nCr = n! ÷ (r! (n − r)!).", "Repeated letters: divide by the factorial of each repeat."],
    example: "Arrangements of APPLE: 5! ÷ 2! = 60 (P repeats).",
    shortcut: "\"And\" multiplies choices; \"or\" adds them.",
    trap: "Using permutations to pick a team - the order of team members doesn't matter.",
  }, Q.pnc),
  T("di-table", {
    idea: "Read the table carefully, then do one small calculation.",
    steps: ["Read the title and units first (hundreds? lakhs?).", "Find exactly the rows and columns asked for.", "For a change in %, divide by the earlier value."],
    example: "Sales 40 → 50: change = 10 on 40 = 25% increase.",
    shortcut: "Estimate before you calculate - wrong options are often far from the right size.",
    trap: "Dividing a percentage change by the later year.",
  }, Q.diTable),
  // ---------------------------------------------------------------- reasoning
  T("r-series", {
    idea: "Find the rule that turns each number into the next.",
    steps: ["Look at the differences between terms.", "If they aren't steady, look at the differences of differences, or ratios.", "Check squares, cubes, and two rules taking turns."],
    example: "2, 6, 12, 20, 30, ? → differences 4, 6, 8, 10 → next 42.",
    shortcut: "Know the squares to 30 and cubes to 15 - many series are built on them.",
    trap: "Stopping at the first pattern without checking it fits every term.",
  }, R.series),
  T("r-letters", {
    idea: "Letters are numbers in disguise: A = 1 ... Z = 26.",
    steps: ["Write each letter's position.", "Find the step between them.", "For \"from the right\", the nth from the right = (27 − n)th from the left."],
    example: "B, E, H, K, ? → +3 each → N.",
    shortcut: "Remember EJOTY = 5, 10, 15, 20, 25 to find positions fast.",
    trap: "Counting from the right end without converting first.",
  }, R.letters),
  T("r-coding", {
    idea: "Find how each letter of a word was changed, then apply it to the new word.",
    steps: ["Line up the word and its code letter by letter.", "Check: same shift? opposite letters (A↔Z)? reversed?", "Apply exactly the same rule."],
    example: "CAT → DBU is +1 each, so DOG → EPH.",
    shortcut: "Opposite pairs add up to 27: A-Z, B-Y, C-X, M-N.",
    trap: "Assuming every letter shifts the same way without checking each one.",
  }, R.coding),
  T("r-direction", {
    idea: "Track the walk on a rough sketch and use Pythagoras for the straight-line distance.",
    steps: ["Draw North up, East right.", "Turning right from North faces East; left faces West.", "Net north-south and east-west distances → √(a² + b²)."],
    example: "6 m North, right, 8 m → 10 m away, North-East.",
    shortcut: "Learn the triples 3-4-5, 5-12-13, 8-15-17 and their multiples.",
    trap: "Adding the walked distances instead of finding the straight-line distance.",
  }, R.direction),
  T("r-ranking", {
    idea: "Positions from both ends of a row.",
    steps: ["Total = position from left + position from right − 1.", "Rank from bottom = total − rank from top + 1.", "People between = difference of positions from the same end − 1."],
    example: "5th from left and 8th from right → 5 + 8 − 1 = 12 people.",
    trap: "Forgetting the −1 (the person is counted from both ends).",
  }, R.ranking),
  T("r-clock", {
    idea: "The minute hand moves 6° a minute; the hour hand 0.5° a minute.",
    steps: ["Angle = |30H − 5.5M|.", "If it's over 180°, subtract from 360°.", "Hands meet every 65 5/11 minutes."],
    example: "At 3:30: |90 − 165| = 75°.",
    shortcut: "Between H and H + 1, the hands overlap at 60H/11 minutes past H.",
    trap: "Forgetting that the hour hand also moves as the minutes pass.",
  }, R.clock),
  T("r-calendar", {
    idea: "Weekdays repeat every 7 days - only the remainder (\"odd days\") matters.",
    steps: ["Count the days between two dates.", "Divide by 7 and keep the remainder.", "Move that many days forward from the known day."],
    example: "Monday + 45 days: 45 = 6 weeks + 3 → Thursday.",
    shortcut: "An ordinary year = 1 odd day; a leap year = 2. Century years are leap only if divisible by 400.",
    trap: "Forgetting February 29 in a leap year.",
  }, R.calendar),
  T("r-odd", {
    idea: "Find the property three share (or the rule linking a pair) and apply it.",
    steps: ["Test common properties: prime, square, cube, multiple, even/odd.", "For a : b :: c : ?, find what turned a into b.", "For letter groups, check the gaps between letters."],
    example: "3 : 27 :: 4 : ? → cube → 64.",
    trap: "Choosing on looks (\"it's the biggest\") instead of a real property.",
  }, R.oddOne),
  T("r-blood", {
    idea: "Turn each statement into a small family tree.",
    steps: ["Draw people as circles (female) and squares (male), or just write names.", "Connect parents above children, siblings side by side.", "Read off the relation asked for."],
    example: "\"Son of my mother's only brother\" → mother's brother is uncle → his son is a cousin.",
    shortcut: "Phrases like \"only daughter of my mother\" often point back to the speaker.",
    trap: "Assuming someone's gender when the question doesn't give it.",
  }, "r-blood"),
  T("r-syllogism", {
    idea: "Decide which conclusions must be true if the statements are true - ignore real-world facts.",
    steps: ["Draw circles (Venn diagrams) for each statement.", "A conclusion follows only if it's true in every possible drawing.", "\"Some A are B\" and \"No A is B\" with the same terms form an \"either-or\" pair."],
    example: "All cats are animals; all animals live → all cats live.",
    shortcut: "\"All A are B\" also gives \"Some B are A\".",
    trap: "Accepting a conclusion because it's true in real life rather than from the statements.",
  }, "r-syllogism"),
  // ---------------------------------------------------------------- verbal
  T("v-synonyms", {
    idea: "Pick the word closest in meaning.",
    steps: ["Say the word in a sentence.", "Replace it with each option.", "The one that keeps the meaning is the answer."],
    example: "ABUNDANT: \"Water is abundant here\" → plentiful.",
    shortcut: "Learn word roots: bene- (good), mal- (bad), omni- (all), -phile (lover of).",
    trap: "Picking a word that's merely related (e.g. \"rain\" for \"abundant\").",
  }, "v-synonyms"),
  T("v-antonyms", {
    idea: "Pick the word most opposite in meaning.",
    steps: ["Be sure of the word's meaning first.", "Watch for options that are synonyms - they're traps.", "Choose the clearest opposite."],
    example: "SCARCE ↔ plentiful (not \"rare\", which means the same).",
    trap: "Choosing the synonym by mistake when reading fast.",
  }, "v-antonyms"),
  T("v-grammar", {
    idea: "Subject-verb agreement, tenses, articles and prepositions cover most questions.",
    steps: ["Find the real subject (ignore \"along with...\", \"one of...\").", "Match the verb to it: singular or plural.", "Check the tense matches the time words (yesterday, since, by the time)."],
    example: "\"One of my friends are...\" ✗ → \"One of my friends is...\" ✓.",
    shortcut: "Each, every, either, neither, one of - all take a singular verb.",
    trap: "Matching the verb to the nearest noun instead of the subject.",
  }, "v-grammar"),
  T("v-idioms", {
    idea: "Idioms mean something different from their words.",
    steps: ["Don't read them literally.", "Think of a sentence where you've heard it.", "Choose the everyday meaning."],
    example: "\"A piece of cake\" = very easy.",
    trap: "Picking the literal meaning.",
  }, "v-idioms"),
  T("v-onesub", {
    idea: "One word that replaces a whole phrase.",
    steps: ["Break the word into parts (omni = all, -scient = knowing).", "Rule out look-alikes (illegible vs illegal).", "Choose the exact fit."],
    example: "\"One who knows everything\" → omniscient.",
    trap: "Confusing near pairs: apiary (bees) and aviary (birds).",
  }, "v-onesub"),
  T("v-sentence", {
    idea: "The rest of the sentence tells you what the blank must mean.",
    steps: ["Find the clue words (despite, so, although, because).", "Predict the meaning of the blank before reading the options.", "Choose the option that matches your prediction."],
    example: "\"Despite the rain, the match wasn't ___\" → cancelled.",
    shortcut: "\"Although/despite/but\" signal a contrast; \"so/because\" a cause.",
    trap: "Choosing a word that sounds right but ignores the clue.",
  }, "v-sentence"),
  T("v-rc", {
    idea: "Answer from the passage, not from what you already know.",
    steps: ["Read the questions first, then the passage.", "Find the line that answers each question.", "For the \"main idea\", choose what covers the whole passage, not one detail."],
    example: "If the passage lists three reasons, the answer will name those three.",
    trap: "Choosing an option that's true in real life but isn't in the passage.",
  }, "v-rc"),
];

export const topicById = (id: string) => TOPICS.find((t) => t.id === id);

// ------------------------------------------------------------------ building sets

function fromBank(r: Rng, item: BankItem): Draft {
  if (item.fixed) {
    // Error spotting keeps sentence order: (A), (B), (C), then "No error".
    const all = [item.a, ...item.w].sort((x, y) => (x === "No error" ? 1 : y === "No error" ? -1 : x.localeCompare(y)));
    return { stem: item.stem, options: all, answer: all.indexOf(item.a), solution: [item.why], passage: item.passage };
  }
  return { stem: item.stem, ...choices(r, item.a, item.w), solution: [item.why], passage: item.passage };
}

/** Two questions are the same when their wording, options and data all match. */
const sameKey = (d: Draft) => `${d.passage ?? ""}|${d.stem}|${[...d.options].sort().join("|")}|${d.table ? JSON.stringify(d.table.rows) : ""}`;

/** Bank items at a level (falling back to nearby levels), shuffled. */
function bankPool(r: Rng, bank: string, level: Level, range?: TrackTopic): BankItem[] {
  const all = BANKS[bank] ?? [];
  const inRange = (i: BankItem) => !range || (i.level >= range.min && i.level <= range.max);
  const exact = shuffle(r, all.filter((i) => i.level === level && inRange(i)));
  const near = shuffle(r, all.filter((i) => i.level !== level && inRange(i))).sort((a, b) => Math.abs(a.level - level) - Math.abs(b.level - level));
  return [...exact, ...near];
}

/**
 * `n` questions on one topic at one level. Generated topics retry to avoid a
 * repeated question; bank topics draw without repeats (so a bank topic gives
 * at most as many as it holds in the track's range).
 */
export function topicSet(topicId: string, level: Level, seed: string, n = 10, range?: TrackTopic): Question[] {
  const topic = topicById(topicId);
  if (!topic) return [];
  const r = rngFrom(seed);
  const drafts: Draft[] = [];
  if (topic.bank) drafts.push(...bankPool(r, topic.bank, level, range).slice(0, n).map((i) => fromBank(r, i)));
  else {
    const seen = new Set<string>();
    for (let tries = 0; drafts.length < n && tries < n * 30; tries++) {
      const d = topic.gen!(r, level);
      const key = sameKey(d);
      if (seen.has(key)) continue;
      seen.add(key); drafts.push(d);
    }
  }
  return drafts.map((d, i) => ({ ...d, id: `${topicId}:${level}:${i}`, topic: topicId, section: topic.section, level }));
}

/** Today's ten: a mix across the track (4 quantitative or DI, 4 reasoning, 2 verbal) at the student's own level per topic. */
export function dailySet(track: AptTrack, levelOf: (t: TrackTopic) => Level, day: string): Question[] {
  const r = rngFrom(`daily:${track.id}:${day}`);
  const by = (s: Section[]) => shuffle(r, track.topics.filter((t) => s.includes(topicById(t.id)!.section)));
  const plan = [...by(["quant", "di"]).slice(0, 4), ...by(["reasoning"]).slice(0, 4), ...by(["verbal"]).slice(0, 2)];
  return shuffle(r, plan).map((t, i) => ({ ...topicSet(t.id, levelOf(t), `daily:${track.id}:${day}:${t.id}`, 1, t)[0], id: `daily:${i}` })).filter((q) => q.stem);
}

/**
 * A mock test: the blueprint's sections, topics spread across each section
 * and levels mixed from the track's range (easier first within a section).
 * Mock 1-3 have fixed seeds so a result can be reviewed exactly; "random" is new each time.
 */
export function mockSet(track: AptTrack, key: string): Question[] {
  const r = rngFrom(`mock:${track.id}:${key}`);
  const out: Question[] = [];
  for (const sec of track.mock.sections) {
    const pool = shuffle(r, track.topics.filter((t) => topicById(t.id)!.section === sec.section));
    if (!pool.length) continue;
    const picks: Question[] = [];
    const used = new Set<string>();
    for (let i = 0; picks.length < sec.count && i < sec.count * 6; i++) {
      const t = pool[i % pool.length];
      const level = int(r, t.min, t.max) as Level;
      const q = topicSet(t.id, level, `mock:${track.id}:${key}:${sec.section}:${i}`, 1, t)[0];
      if (!q || used.has(sameKey(q))) continue;
      used.add(sameKey(q));
      picks.push(q);
    }
    picks.sort((a, b) => a.level - b.level);
    out.push(...picks);
  }
  return out.map((q, i) => ({ ...q, id: `mock:${i}` }));
}

/** A fresh seed for a practice set or a surprise mock. */
export const freshSeed = () => `${Date.now().toString(36)}${Math.floor(Math.random() * 1e6).toString(36)}`;


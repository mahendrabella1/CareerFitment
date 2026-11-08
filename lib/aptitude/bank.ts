/**
 * Aptitude Lab - the written questions: blood relations and syllogisms
 * (reasoning) and every verbal topic. `a` is the right answer and `w` three
 * wrong ones; options are shuffled when a set is drawn, except `fixed` items
 * (error spotting reads A, B, C, "No error" in order).
 */
import type { Level } from "./core";

export interface BankItem {
  level: Level;
  stem: string;
  a: string;
  w: [string, string, string];
  why: string;
  passage?: string;
  fixed?: boolean;
}

const it = (level: Level, stem: string, a: string, w: [string, string, string], why: string): BankItem => ({ level, stem, a, w, why });

// ------------------------------------------------------------------ blood relations

const BLOOD: BankItem[] = [
  it(1, "Pointing to a man, Riya says, \"He is the son of my mother's only brother.\" How is the man related to Riya?", "Cousin", ["Brother", "Nephew", "Uncle"], "Riya's mother's brother is Riya's maternal uncle; his son is Riya's cousin."),
  it(1, "A is B's sister. C is B's mother. How is A related to C?", "Daughter", ["Sister", "Mother", "Niece"], "A and B are siblings, and C is B's mother - so C is A's mother too, and A is C's daughter."),
  it(1, "Ravi's father is Mohan's only son. How is Mohan related to Ravi?", "Grandfather", ["Father", "Uncle", "Brother"], "Mohan's only son is Ravi's father, so Mohan is Ravi's father's father: his grandfather."),
  it(1, "X is the brother of Y. Y is the father of Z. How is X related to Z?", "Uncle", ["Father", "Brother", "Grandfather"], "X is the brother of Z's father, so X is Z's (paternal) uncle."),
  it(1, "Meena's mother's mother is Kamala. How is Kamala related to Meena?", "Grandmother", ["Aunt", "Mother", "Sister"], "Mother's mother = grandmother."),
  it(1, "P is Q's wife. R is P's son. How is Q related to R?", "Father", ["Uncle", "Brother", "Grandfather"], "R is the son of P, and P's husband is Q - so Q is R's father."),
  it(2, "Pointing to a girl in a photograph, Arjun says, \"Her mother is the only daughter of my mother.\" How is Arjun related to the girl?", "Uncle", ["Father", "Brother", "Grandfather"], "The only daughter of Arjun's mother is Arjun's sister. The girl's mother is Arjun's sister, so Arjun is her (maternal) uncle."),
  it(2, "A is the father of B. B is the sister of C. D is the mother of A. How is C related to D?", "Grandchild", ["Child", "Niece", "Sister"], "B and C are siblings, so A is C's father too. D is A's mother, so C is D's grandchild (we don't know if C is a boy or a girl)."),
  it(2, "A is the brother of B. B is the sister of C. C is the father of D. How is A related to D?", "Uncle", ["Father", "Brother", "Cousin"], "A, B and C are siblings. C is D's father, so A is D's uncle."),
  it(2, "Introducing a woman, Kiran (a woman) says, \"She is the wife of the only son of my father.\" How is the woman related to Kiran?", "Sister-in-law", ["Sister", "Mother", "Daughter-in-law"], "The only son of Kiran's father is Kiran's brother. His wife is Kiran's sister-in-law."),
  it(2, "M is the son of N. N is the daughter of O. P is the husband of O. How is P related to M?", "Grandfather", ["Father", "Uncle", "Brother"], "N is O's daughter and P is O's husband, so P is N's father. M is N's son, so P is M's (maternal) grandfather."),
  it(2, "Pointing to a man, a woman says, \"His mother is the only daughter of my mother.\" How is the woman related to the man?", "Mother", ["Sister", "Aunt", "Grandmother"], "The only daughter of the woman's mother is the woman herself. So she is the man's mother."),
  it(3, "If A + B means A is the mother of B, A − B means A is the brother of B, and A × B means A is the father of B, what does P × Q − R mean?", "P is the father of R", ["P is the brother of R", "P is the uncle of R", "R is the father of P"], "P × Q: P is Q's father. Q − R: Q is R's brother. Q and R are siblings, so P is R's father too."),
  it(3, "If A # B means A is the sister of B, A $ B means A is the son of B, and A * B means A is the wife of B, what does P # Q $ R mean about P and R?", "P is the daughter of R", ["P is the sister of R", "P is the mother of R", "P is the wife of R"], "P # Q: P is Q's sister. Q $ R: Q is R's son. So P is also R's child - a girl, so R's daughter."),
  it(3, "A family has six members: A, B, C, D, E and F. A and B are a married couple, A being the husband. C is A's brother. D is the only son of C, and E is D's sister. How is E related to C?", "Daughter", ["Niece", "Sister", "Wife"], "D is C's son and E is D's sister, so E is C's daughter. (A, B and F don't change this.)"),
  it(3, "If A $ B means A is the father of B, A @ B means A is the wife of B, and A % B means A is the sister of B, what does X @ Y $ Z mean about X and Z?", "X is the mother of Z", ["X is the sister of Z", "X is the aunt of Z", "X is the grandmother of Z"], "X @ Y: X is Y's wife. Y $ Z: Y is Z's father. So X is Z's mother."),
];

// ------------------------------------------------------------------ syllogisms

const S5 = ["Only I follows", "Only II follows", "Both I and II follow", "Neither I nor II follows", "Either I or II follows"] as const;
const syl = (level: Level, statements: string, c1: string, c2: string, ans: (typeof S5)[number], why: string): BankItem => {
  const others = S5.filter((x) => x !== ans && (ans === "Either I or II follows" || x !== "Either I or II follows"));
  return { level, stem: `${statements}\nConclusions:\nI. ${c1}\nII. ${c2}`, a: ans, w: [others[0], others[1], others[2]], why };
};

const SYLLOGISMS: BankItem[] = [
  syl(1, "Statements: All cats are animals. All animals are living things.", "All cats are living things.", "Some living things are cats.", "Both I and II follow", "Cats ⊂ animals ⊂ living things, so all cats are living things (I). Reversing an \"All\" statement gives a \"Some\" statement, so some living things are cats (II)."),
  syl(1, "Statements: All pens are books. Some books are bags.", "Some pens are bags.", "Some bags are books.", "Only II follows", "The bags that are books may not be the pens, so I isn't certain. \"Some books are bags\" reversed is \"Some bags are books\" (II)."),
  syl(1, "Statements: No dog is a cat. All cats are pets.", "No dog is a pet.", "Some pets are cats.", "Only II follows", "Dogs could still be pets (just not cats), so I isn't certain. \"All cats are pets\" gives \"Some pets are cats\" (II)."),
  syl(1, "Statements: All mangoes are fruits. All fruits are sweet.", "All mangoes are sweet.", "All sweet things are mangoes.", "Only I follows", "Mangoes ⊂ fruits ⊂ sweet things, so I follows. Many sweet things needn't be mangoes, so II doesn't."),
  syl(2, "Statements: Some flowers are red. All red things are beautiful.", "Some flowers are beautiful.", "All beautiful things are flowers.", "Only I follows", "The flowers that are red are also beautiful, so some flowers are beautiful (I). Nothing says every beautiful thing is a flower."),
  syl(2, "Statements: All students are readers. No reader is lazy.", "No student is lazy.", "Some readers are students.", "Both I and II follow", "Students are inside readers and no reader is lazy, so no student is lazy (I). \"All students are readers\" gives \"Some readers are students\" (II)."),
  syl(2, "Statements: Some chairs are tables. Some tables are doors.", "Some chairs are doors.", "No chair is a door.", "Either I or II follows", "Neither is certain alone, but they cover every case between them - either some chairs are doors or none is - so either I or II follows."),
  syl(2, "Statements: All roses are flowers. Some flowers are yellow.", "Some roses are yellow.", "All roses are yellow.", "Neither I nor II follows", "The yellow flowers may or may not include roses, so neither conclusion is certain. (Unlike the chairs example, these two don't cover every case - so it isn't \"either\".)"),
  syl(2, "Statements: Some books are pens. No pen is a pencil.", "Some books are not pencils.", "Some pencils are books.", "Only I follows", "The books that are pens can't be pencils, so some books are not pencils (I). Whether any pencil is a book isn't known."),
  syl(3, "Statements: No bird is a fish. Some fish are whales.", "Some whales are not birds.", "No whale is a bird.", "Only I follows", "The whales that are fish can't be birds, so some whales are not birds (I). Other whales aren't described, so II isn't certain."),
  syl(3, "Statements: All doctors are graduates. Some graduates are teachers. No teacher is a singer.", "Some graduates are not singers.", "Some doctors are teachers.", "Only I follows", "The graduates who are teachers are not singers, so some graduates are not singers (I). The teachers among graduates may not be doctors, so II isn't certain."),
  syl(3, "Statements: Some boxes are cartons. All cartons are bags. No bag is a sack.", "Some boxes are not sacks.", "No carton is a sack.", "Both I and II follow", "Cartons are inside bags and no bag is a sack, so no carton is a sack (II). The boxes that are cartons are therefore not sacks (I)."),
];

// ------------------------------------------------------------------ verbal: synonyms

const SYNONYMS: BankItem[] = [
  it(1, "Choose the word closest in meaning to BEGIN.", "Start", ["Finish", "Wait", "Break"], "To begin is to start."),
  it(1, "Choose the word closest in meaning to HAPPY.", "Glad", ["Angry", "Tired", "Bored"], "Happy and glad both mean pleased or joyful."),
  it(1, "Choose the word closest in meaning to QUICK.", "Fast", ["Slow", "Late", "Quiet"], "Quick means fast."),
  it(1, "Choose the word closest in meaning to LARGE.", "Big", ["Narrow", "Light", "Short"], "Large means big."),
  it(1, "Choose the word closest in meaning to BRAVE.", "Courageous", ["Fearful", "Lazy", "Polite"], "A brave person is courageous."),
  it(1, "Choose the word closest in meaning to ASSIST.", "Help", ["Stop", "Ask", "Watch"], "To assist is to help."),
  it(1, "Choose the word closest in meaning to SILENT.", "Quiet", ["Loud", "Empty", "Dark"], "Silent means making no sound - quiet."),
  it(1, "Choose the word closest in meaning to PURCHASE.", "Buy", ["Sell", "Borrow", "Find"], "To purchase is to buy."),
  it(2, "Choose the word closest in meaning to ABUNDANT.", "Plentiful", ["Scarce", "Expensive", "Hidden"], "Abundant means existing in large amounts - plentiful."),
  it(2, "Choose the word closest in meaning to CANDID.", "Frank", ["Secretive", "Rude", "Shy"], "A candid person says honestly what they think - frank."),
  it(2, "Choose the word closest in meaning to DILIGENT.", "Hardworking", ["Careless", "Clever", "Cheerful"], "Diligent means showing steady, careful effort."),
  it(2, "Choose the word closest in meaning to OBSOLETE.", "Outdated", ["Modern", "Broken", "Rare"], "Obsolete means no longer used - outdated."),
  it(2, "Choose the word closest in meaning to RELUCTANT.", "Unwilling", ["Eager", "Angry", "Unable"], "Reluctant means not wanting to do something."),
  it(2, "Choose the word closest in meaning to CONCISE.", "Brief", ["Detailed", "Confusing", "Correct"], "Concise means saying a lot in few words - brief."),
  it(2, "Choose the word closest in meaning to METICULOUS.", "Careful", ["Quick", "Messy", "Generous"], "Meticulous means paying great attention to detail."),
  it(2, "Choose the word closest in meaning to VITAL.", "Essential", ["Optional", "Ordinary", "Minor"], "Vital means absolutely necessary - essential."),
  it(3, "Choose the word closest in meaning to UBIQUITOUS.", "Present everywhere", ["Very rare", "Extremely large", "Hard to see"], "Ubiquitous means found everywhere - like mobile phones today."),
  it(3, "Choose the word closest in meaning to EPHEMERAL.", "Short-lived", ["Everlasting", "Imaginary", "Peaceful"], "Ephemeral means lasting a very short time."),
  it(3, "Choose the word closest in meaning to GREGARIOUS.", "Sociable", ["Greedy", "Lonely", "Serious"], "A gregarious person enjoys company - sociable."),
  it(3, "Choose the word closest in meaning to SAGACIOUS.", "Wise", ["Foolish", "Talkative", "Sad"], "Sagacious means having good judgement - wise."),
  it(3, "Choose the word closest in meaning to PRAGMATIC.", "Practical", ["Idealistic", "Stubborn", "Dramatic"], "Pragmatic means dealing with things in a practical way."),
  it(3, "Choose the word closest in meaning to TENACIOUS.", "Persistent", ["Weak", "Tense", "Careless"], "Tenacious means holding on firmly; not giving up."),
  it(3, "Choose the word closest in meaning to FRUGAL.", "Thrifty", ["Wasteful", "Fruitful", "Poor"], "Frugal means careful not to waste money - thrifty."),
  it(3, "Choose the word closest in meaning to GARRULOUS.", "Talkative", ["Quiet", "Angry", "Clumsy"], "Garrulous means talking a lot, often about unimportant things."),
];

// ------------------------------------------------------------------ verbal: antonyms

const ANTONYMS: BankItem[] = [
  it(1, "Choose the word opposite in meaning to ANCIENT.", "Modern", ["Old", "Famous", "Large"], "Ancient means very old; its opposite is modern."),
  it(1, "Choose the word opposite in meaning to VICTORY.", "Defeat", ["Success", "Battle", "Prize"], "Victory is winning; defeat is losing."),
  it(1, "Choose the word opposite in meaning to ACCEPT.", "Refuse", ["Receive", "Agree", "Allow"], "To accept is to say yes; to refuse is to say no."),
  it(1, "Choose the word opposite in meaning to EXPAND.", "Shrink", ["Grow", "Spread", "Open"], "Expand means grow larger; shrink means become smaller."),
  it(1, "Choose the word opposite in meaning to GENEROUS.", "Mean", ["Kind", "Rich", "Honest"], "A generous person gives freely; a mean (stingy) one doesn't."),
  it(1, "Choose the word opposite in meaning to ARRIVE.", "Depart", ["Reach", "Enter", "Stay"], "Arrive means come; depart means leave."),
  it(1, "Choose the word opposite in meaning to SHALLOW.", "Deep", ["Wide", "Flat", "Narrow"], "Shallow water is not deep."),
  it(1, "Choose the word opposite in meaning to INCREASE.", "Decrease", ["Raise", "Double", "Gain"], "Increase means go up; decrease means go down."),
  it(2, "Choose the word opposite in meaning to SCARCE.", "Plentiful", ["Rare", "Costly", "Small"], "Scarce means in short supply; plentiful means more than enough."),
  it(2, "Choose the word opposite in meaning to HUMBLE.", "Arrogant", ["Modest", "Poor", "Gentle"], "Humble means modest; arrogant means proud and superior."),
  it(2, "Choose the word opposite in meaning to OPTIMISTIC.", "Pessimistic", ["Hopeful", "Realistic", "Cheerful"], "An optimist expects good things; a pessimist expects bad ones."),
  it(2, "Choose the word opposite in meaning to TRANSPARENT.", "Opaque", ["Clear", "Bright", "Thin"], "Transparent things can be seen through; opaque things cannot."),
  it(2, "Choose the word opposite in meaning to ARTIFICIAL.", "Natural", ["Fake", "Modern", "Simple"], "Artificial means made by people; natural means occurring in nature."),
  it(2, "Choose the word opposite in meaning to TEMPORARY.", "Permanent", ["Brief", "Recent", "Sudden"], "Temporary lasts a short time; permanent lasts for ever."),
  it(2, "Choose the word opposite in meaning to CONCEAL.", "Reveal", ["Hide", "Cover", "Protect"], "To conceal is to hide; to reveal is to show."),
  it(2, "Choose the word opposite in meaning to MAXIMUM.", "Minimum", ["Average", "Highest", "Total"], "Maximum is the most; minimum is the least."),
  it(3, "Choose the word opposite in meaning to VERBOSE.", "Concise", ["Wordy", "Loud", "Clear"], "Verbose means using too many words; concise means brief."),
  it(3, "Choose the word opposite in meaning to BENEVOLENT.", "Malevolent", ["Kind", "Generous", "Wealthy"], "Benevolent means wishing good; malevolent means wishing harm."),
  it(3, "Choose the word opposite in meaning to FRUGAL.", "Extravagant", ["Thrifty", "Careful", "Simple"], "Frugal means careful with money; extravagant means spending wastefully."),
  it(3, "Choose the word opposite in meaning to LETHARGIC.", "Energetic", ["Sleepy", "Slow", "Calm"], "Lethargic means sluggish and tired; energetic is the opposite."),
  it(3, "Choose the word opposite in meaning to AFFLUENT.", "Impoverished", ["Wealthy", "Fluent", "Generous"], "Affluent means rich; impoverished means very poor."),
  it(3, "Choose the word opposite in meaning to ADVERSITY.", "Prosperity", ["Hardship", "Enmity", "Difficulty"], "Adversity is hardship; prosperity is success and good fortune."),
  it(3, "Choose the word opposite in meaning to CANDID.", "Evasive", ["Honest", "Open", "Direct"], "Candid means frank and open; evasive means avoiding a direct answer."),
  it(3, "Choose the word opposite in meaning to DILIGENT.", "Negligent", ["Careful", "Hardworking", "Busy"], "Diligent means careful and hardworking; negligent means careless."),
];

// ------------------------------------------------------------------ verbal: grammar (fill in the blank and error spotting)

const spot = (level: Level, parts: [string, string, string], wrong: 0 | 1 | 2 | 3, why: string): BankItem => {
  const opts = [`(A) ${parts[0]}`, `(B) ${parts[1]}`, `(C) ${parts[2]}`, "No error"];
  return { level, stem: `Which part of the sentence has an error?\n"${parts.join(" ")}"`, a: opts[wrong], w: opts.filter((_, i) => i !== wrong) as [string, string, string], why, fixed: true };
};

const GRAMMAR: BankItem[] = [
  it(1, "Fill in the blank: She ___ to school every day.", "goes", ["go", "going", "gone"], "With he/she/it in the simple present, the verb takes -s/-es: she goes."),
  it(1, "Fill in the blank: There ___ many books on the shelf.", "are", ["is", "was", "be"], "\"Books\" is plural, so: there are."),
  it(1, "Fill in the blank: He is ___ honest man.", "an", ["a", "the", "no article"], "\"Honest\" starts with a vowel sound (the h is silent), so use \"an\"."),
  it(1, "Fill in the blank: I have been living here ___ 2019.", "since", ["for", "from", "by"], "\"Since\" goes with a point in time (2019); \"for\" goes with a length of time (five years)."),
  it(1, "Fill in the blank: The cat is hiding ___ the table.", "under", ["on", "between", "among"], "Hiding below the table: under."),
  it(1, "Fill in the blank: My brother and I ___ watching a film.", "are", ["is", "am", "was"], "Two people (my brother and I) take a plural verb: are."),
  it(1, "Fill in the blank: She is ___ than her sister.", "taller", ["tallest", "more tall", "tall"], "Comparing two people uses the comparative: taller."),
  it(1, "Fill in the blank: We ___ to the zoo last Sunday.", "went", ["go", "gone", "going"], "\"Last Sunday\" is the past, so use the past tense: went."),
  it(2, "Fill in the blank: Each of the students ___ a laptop.", "has", ["have", "are having", "were having"], "\"Each\" is singular, so the verb is singular: has."),
  it(2, "Fill in the blank: If I ___ you, I would apologise.", "were", ["was", "am", "be"], "In an imaginary \"if\" clause we use \"were\" for every person: if I were you."),
  it(2, "Fill in the blank: He prefers tea ___ coffee.", "to", ["than", "over", "from"], "\"Prefer\" takes \"to\": prefer tea to coffee."),
  it(2, "Fill in the blank: The teacher, along with her students, ___ going on the trip.", "is", ["are", "were", "have"], "The subject is \"the teacher\" (singular); \"along with...\" doesn't change it."),
  it(2, "Fill in the blank: Neither the manager nor the clerks ___ present.", "were", ["was", "is", "has been"], "With neither...nor, the verb agrees with the nearer subject - \"clerks\" (plural)."),
  it(2, "Fill in the blank: She has lived in Pune ___ ten years.", "for", ["since", "from", "during"], "\"For\" goes with a length of time (ten years)."),
  spot(2, ["The number of students", "who has passed", "is very large."], 1, "\"Who\" refers to \"students\" (plural), so it should be \"who have passed\"."),
  spot(2, ["One of my friends", "are going", "to Delhi tomorrow."], 1, "The subject is \"one\" (singular), so: \"is going\"."),
  spot(2, ["He did not", "went to school", "yesterday."], 1, "After \"did not\" we use the base form: \"did not go\"."),
  spot(3, ["Hardly had I reached the station", "when the train", "left."], 3, "\"Hardly ... when\" is correct here, and so is the past perfect \"had reached\" - there is no error."),
  spot(3, ["The furniture in the room", "were arranged", "very neatly."], 1, "\"Furniture\" is uncountable and takes a singular verb: \"was arranged\"."),
  spot(3, ["She is one of those girls", "who has won", "a scholarship."], 1, "\"Who\" refers to \"girls\" (plural): \"who have won\"."),
  spot(3, ["No sooner did he arrive", "than it", "starts raining."], 2, "The sentence is in the past, so the verb must be too: \"than it started raining\". (The error is in part C.)"),
  spot(3, ["Unless you do not work hard,", "you will not", "pass the exam."], 0, "\"Unless\" already means \"if not\", so \"unless you do not\" is a double negative. It should be \"Unless you work hard\"."),
  it(3, "Fill in the blank: By the time we reached the cinema, the film ___.", "had already started", ["already started", "has already started", "was already starting"], "An action finished before another past action takes the past perfect: had already started."),
  it(3, "Fill in the blank: I look forward to ___ you soon.", "meeting", ["meet", "met", "be meeting"], "\"Look forward to\" is followed by the -ing form: look forward to meeting."),
];

// ------------------------------------------------------------------ verbal: idioms

const IDIOMS: BankItem[] = [
  it(1, "What does \"a piece of cake\" mean?", "Something very easy", ["A sweet reward", "A small share", "A party"], "\"The test was a piece of cake\" - it was very easy."),
  it(1, "What does \"once in a blue moon\" mean?", "Very rarely", ["Every month", "At night", "Suddenly"], "Something that happens once in a blue moon happens very rarely."),
  it(1, "What does \"under the weather\" mean?", "Feeling unwell", ["Outdoors in the rain", "Very cold", "In trouble"], "\"I'm a bit under the weather\" means slightly ill."),
  it(1, "What does \"break the ice\" mean?", "Start a conversation in an awkward situation", ["Break a promise", "Make something cold", "Start a fight"], "You break the ice to make people feel relaxed and start talking."),
  it(2, "What does \"burn the midnight oil\" mean?", "Work or study late into the night", ["Waste money", "Cook late at night", "Get angry"], "Students burn the midnight oil before exams."),
  it(2, "What does \"spill the beans\" mean?", "Reveal a secret", ["Make a mess", "Waste food", "Tell a lie"], "To spill the beans is to let a secret out."),
  it(2, "What does \"cost an arm and a leg\" mean?", "Be very expensive", ["Be dangerous", "Hurt badly", "Be cheap"], "\"That phone cost an arm and a leg\" - it was very expensive."),
  it(2, "What does \"hit the nail on the head\" mean?", "Describe exactly what is right", ["Make a mistake", "Hurt yourself", "Work hard"], "You hit the nail on the head when you say exactly the right thing."),
  it(2, "What does \"beat around the bush\" mean?", "Avoid talking about the main point", ["Search carefully", "Win easily", "Go for a walk"], "\"Stop beating around the bush - tell me what happened.\""),
  it(2, "What does \"a blessing in disguise\" mean?", "Something good that first seemed bad", ["A hidden gift", "A false friend", "A lucky charm"], "Missing the bus was a blessing in disguise - it helped me avoid the jam."),
  it(3, "What does \"bite the bullet\" mean?", "Face something difficult with courage", ["Eat quickly", "Get hurt", "Refuse to speak"], "To bite the bullet is to do something unpleasant that can't be avoided."),
  it(3, "What does \"take something with a pinch of salt\" mean?", "Not believe it completely", ["Add flavour to it", "Accept it fully", "Treat it as urgent"], "Take online rumours with a pinch of salt - be a little doubtful."),
  it(3, "What does \"cry over spilt milk\" mean?", "Regret what cannot be changed", ["Waste food", "Be sad for no reason", "Complain about prices"], "\"It's no use crying over spilt milk\" - don't worry about past mistakes you can't fix."),
  it(3, "What does \"the ball is in your court\" mean?", "It is your turn to decide or act", ["You have won", "You are in trouble", "You must play a game"], "When the ball is in your court, the next move is yours."),
  it(3, "What does \"let sleeping dogs lie\" mean?", "Don't stir up an old problem", ["Be kind to animals", "Rest when tired", "Ignore your duties"], "Leave an old issue alone rather than cause new trouble."),
  it(3, "What does \"to turn over a new leaf\" mean?", "To change for the better", ["To start reading a book", "To become a gardener", "To change your mind often"], "To turn over a new leaf is to start behaving better."),
];

// ------------------------------------------------------------------ verbal: one-word substitution

const ONE_WORD: BankItem[] = [
  it(1, "One word for: a person who cannot read or write.", "Illiterate", ["Ignorant", "Innocent", "Immature"], "Illiterate = unable to read or write."),
  it(1, "One word for: animals that eat only plants.", "Herbivores", ["Carnivores", "Omnivores", "Insectivores"], "Herbivores eat plants; carnivores eat meat; omnivores eat both."),
  it(1, "One word for: the life story of a person written by that person.", "Autobiography", ["Biography", "Diary", "Novel"], "A biography is written by someone else; an autobiography by the person themselves."),
  it(1, "One word for: a group of ships.", "Fleet", ["Herd", "Flock", "Swarm"], "A fleet of ships; a herd of cattle; a flock of birds; a swarm of bees."),
  it(2, "One word for: a person who knows everything.", "Omniscient", ["Omnipotent", "Omnipresent", "Optimist"], "Omniscient = all-knowing; omnipotent = all-powerful; omnipresent = everywhere."),
  it(2, "One word for: a place where bees are kept.", "Apiary", ["Aviary", "Aquarium", "Granary"], "Apiary - bees; aviary - birds; aquarium - fish; granary - grain."),
  it(2, "One word for: a person who loves books.", "Bibliophile", ["Philanthropist", "Librarian", "Linguist"], "A bibliophile loves books; a philanthropist helps others with money."),
  it(2, "One word for: a speech given without any preparation.", "Extempore", ["Rehearsed", "Monologue", "Lecture"], "An extempore speech is made on the spot."),
  it(2, "One word for: handwriting that cannot be read.", "Illegible", ["Illegal", "Eligible", "Invisible"], "Illegible = impossible to read. (Illegal means against the law.)"),
  it(2, "One word for: a person who believes good things will happen.", "Optimist", ["Pessimist", "Realist", "Fatalist"], "An optimist expects the best; a pessimist expects the worst."),
  it(3, "One word for: the study of birds.", "Ornithology", ["Entomology", "Zoology", "Etymology"], "Ornithology - birds; entomology - insects; etymology - the origin of words."),
  it(3, "One word for: a person who walks in their sleep.", "Somnambulist", ["Insomniac", "Hypnotist", "Pedestrian"], "A somnambulist sleepwalks; an insomniac can't sleep."),
  it(3, "One word for: a fear of heights.", "Acrophobia", ["Claustrophobia", "Hydrophobia", "Agoraphobia"], "Acrophobia - heights; claustrophobia - closed spaces; hydrophobia - water."),
  it(3, "One word for: a person who does not believe in God.", "Atheist", ["Theist", "Agnostic", "Pagan"], "An atheist doesn't believe in God; an agnostic says it can't be known."),
  it(3, "One word for: a medicine that prevents infection by killing germs.", "Antiseptic", ["Antidote", "Anaesthetic", "Antibody"], "An antiseptic kills germs; an antidote works against a poison."),
  it(3, "One word for: something that cannot be avoided.", "Inevitable", ["Invincible", "Inaudible", "Incredible"], "Inevitable = certain to happen; invincible = can't be defeated."),
];

// ------------------------------------------------------------------ verbal: sentence completion

const SENTENCES: BankItem[] = [
  it(1, "Choose the best word: The library is a ___ place, so please don't talk loudly.", "quiet", ["noisy", "crowded", "busy"], "\"Don't talk loudly\" tells you the place is quiet."),
  it(1, "Choose the best word: She was so ___ that she fell asleep during the film.", "tired", ["excited", "hungry", "angry"], "Falling asleep suggests she was tired."),
  it(2, "Choose the best word: The scientist's ___ research, checked step by step, led to a breakthrough.", "meticulous", ["careless", "hasty", "casual"], "\"Checked step by step\" points to meticulous (very careful) work."),
  it(2, "Choose the best word: Despite the heavy rain, the match was not ___.", "cancelled", ["started", "watched", "played"], "\"Despite the rain\" signals a contrast: it was not cancelled."),
  it(2, "Choose the best word: Water is ___ in the desert, so travellers carry plenty with them.", "scarce", ["abundant", "cheap", "useless"], "Carrying plenty only makes sense if water is scarce."),
  it(2, "Choose the best word: His ___ reply - just one word - surprised everyone.", "brief", ["lengthy", "detailed", "loud"], "\"Just one word\" means the reply was brief."),
  it(3, "Choose the best word: The minister's speech was so ___ that even her critics were convinced.", "persuasive", ["dull", "confusing", "short"], "Convincing critics shows the speech was persuasive."),
  it(3, "Choose the best word: Many ancient customs have become ___ in modern cities.", "obsolete", ["popular", "compulsory", "expensive"], "Old customs that are no longer followed are obsolete."),
  it(3, "Choose the best pair: Although he was ___, he was ___ enough to admit his mistake.", "talented, humble", ["lazy, proud", "rich, arrogant", "famous, careless"], "\"Although\" contrasts two qualities; admitting a mistake fits \"humble\"."),
  it(3, "Choose the best word: The new policy will ___ the problem rather than solve it - it only treats the symptoms.", "mask", ["cure", "explain", "remove"], "Treating only the symptoms hides (masks) the problem."),
  it(3, "Choose the best word: Her ___ nature made her popular at parties - she loved meeting new people.", "gregarious", ["reserved", "timid", "gloomy"], "Loving to meet people is being gregarious (sociable)."),
  it(3, "Choose the best word: The witness gave a ___ account, full of contradictions.", "dubious", ["reliable", "clear", "honest"], "An account full of contradictions is doubtful - dubious."),
];

// ------------------------------------------------------------------ verbal: reading comprehension

const RC1 = "India's Unified Payments Interface, or UPI, lets people send money instantly from one bank account to another using just a phone. Before it, paying a small shopkeeper usually meant cash, and transferring money could take hours. UPI changed this by linking bank accounts to a simple address or a QR code. Vegetable sellers, auto drivers and tea stalls began displaying QR codes, and small payments moved online. Experts point to three reasons for its spread: it is free for most users, it works across all major banks, and it is simple enough for first-time smartphone users. However, the convenience brings risks. Fraudsters send fake payment requests, hoping users will enter their PIN without reading. The golden rule is simple: you never need to enter your PIN to receive money.";
const RC2 = "Bees do far more than make honey. As they move from flower to flower collecting nectar, they carry pollen, which allows many plants to produce fruits and seeds. A large share of the crops people eat depend, at least partly, on such pollinators. In recent decades, scientists have reported falling numbers of bees in many parts of the world. The causes are mixed: loss of wild flowers as land is cleared, some pesticides, diseases, and changing weather. Farmers and city dwellers can both help. Planting a variety of local flowering plants, avoiding unnecessary chemical sprays, and leaving small patches of land wild all give bees food and shelter. Protecting bees, in short, is also a way of protecting our own food supply.";
const RC3 = "Many students believe that rereading their notes many times is the best way to prepare for an exam. Research on learning suggests otherwise. Rereading makes material feel familiar, and that feeling is easily mistaken for real understanding. A more effective method is retrieval practice: closing the book and trying to recall the ideas, for example by answering questions or explaining a topic aloud. Each act of recalling strengthens memory. Spacing also helps - studying a topic for short sessions spread across several days works better than one long session the night before. These methods often feel harder at the time, which is exactly why they work: the effort of remembering is what makes learning stick.";

const rc = (level: Level, passage: string, stem: string, a: string, w: [string, string, string], why: string): BankItem => ({ level, passage, stem, a, w, why });

const READING: BankItem[] = [
  rc(2, RC1, "According to the passage, why did UPI spread quickly?", "It is free for most users, works across major banks and is simple to use", ["It replaced all bank accounts", "The government made cash illegal", "Only large shops accepted it"], "The passage names three reasons: free for most users, works across banks, simple for first-time users."),
  rc(2, RC1, "What is the \"golden rule\" mentioned in the passage?", "You never need to enter your PIN to receive money", ["Always pay in cash", "Share your QR code only with friends", "Change your PIN every day"], "The last sentence states the rule."),
  rc(3, RC1, "What is the main idea of the passage?", "UPI made digital payments easy and widespread, but users must stay alert to fraud", ["UPI is unsafe and should be avoided", "Small shopkeepers prefer cash", "Banks charge high fees for UPI"], "The passage explains UPI's spread and ends with a warning about fraud."),
  rc(2, RC2, "Why are bees important for food, according to the passage?", "They carry pollen that helps many crops produce fruits and seeds", ["They produce all the sugar people eat", "They eat harmful insects", "They improve the soil"], "Bees carry pollen from flower to flower, which many crops depend on."),
  rc(2, RC2, "Which of these is NOT given as a cause of falling bee numbers?", "Too many beekeepers", ["Loss of wild flowers", "Some pesticides", "Changing weather"], "The passage lists loss of flowers, pesticides, diseases and weather - not beekeepers."),
  rc(3, RC2, "What does the author suggest ordinary people can do?", "Plant local flowers, avoid unneeded sprays and leave some land wild", ["Stop eating fruit", "Keep bees indoors", "Buy imported honey"], "These three actions are listed as ways to help."),
  rc(2, RC3, "Why can rereading notes be misleading, according to the passage?", "It makes material feel familiar, which can be mistaken for understanding", ["It takes too little time", "It is too difficult", "It damages memory"], "The passage says familiarity is easily mistaken for real understanding."),
  rc(3, RC3, "What is \"retrieval practice\"?", "Trying to recall ideas without looking, such as answering questions", ["Rereading notes many times", "Copying the textbook neatly", "Studying all night before the exam"], "The passage defines it as closing the book and trying to recall."),
  rc(3, RC3, "Why do the recommended methods \"feel harder\", according to the author?", "Because the effort of remembering is what makes learning stick", ["Because they are badly designed", "Because they take less time", "Because they need special tools"], "The last sentence explains that the effort is what makes it work."),
];

export const BANKS: Record<string, BankItem[]> = {
  "r-blood": BLOOD,
  "r-syllogism": SYLLOGISMS,
  "v-synonyms": SYNONYMS,
  "v-antonyms": ANTONYMS,
  "v-grammar": GRAMMAR,
  "v-idioms": IDIOMS,
  "v-onesub": ONE_WORD,
  "v-sentence": SENTENCES,
  "v-rc": READING,
};

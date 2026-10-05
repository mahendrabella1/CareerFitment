/**
 * Concept card library - Phase 1 (PDF section 12: "30 concept cards (text)"
 * as the Phase 1 target). This is a smaller, real seed set (18 cards)
 * spanning the topic map's core areas, browsable as a library since the
 * full simulation (which would trigger cards by life event) isn't built in
 * this phase - each card still ends with a "Try it in a Lab" link where one
 * of the 3 Phase-1 Labs applies. No secrets here (unlike quiz/scam data) -
 * a concept card and its check question are meant to be read openly, so
 * this file is safe to import from client components directly.
 */

import type { LabSlug } from "@/data/money/labs";

export interface ConceptCard {
  id: string;
  topic: "Earning" | "Spending" | "Saving" | "Banking" | "Digital payments" | "Borrowing" | "Investing" | "Inflation" | "Protect";
  title: string;
  oneLineIdea: string;
  bodyMd: string;
  indianExample: string;
  checkQ: { prompt: string; options: string[]; correctIndex: number; explanation: string };
  labSlug: LabSlug | null;
}

export const CONCEPT_CARDS: ConceptCard[] = [
  {
    id: "needs-vs-wants", topic: "Spending", title: "Needs vs Wants",
    oneLineIdea: "A need keeps your life running. A want makes it nicer.",
    bodyMd: "Rent, food, travel to school or work, and bills are needs - things you can't skip without real consequences. Movies, eating out, and the latest gadget are wants - genuinely nice, but skippable in a tight month.\nThe trap: a want can FEEL like a need in the moment (\"everyone has this phone\"). Pausing to ask \"what happens if I skip this?\" usually sorts it out fast.",
    indianExample: "A ₹15,000 monthly budget might go: ₹8,000 needs (hostel fees, food), ₹3,000 wants (eating out, OTT), ₹2,000 save, ₹2,000 grow.",
    checkQ: { prompt: "Which of these is a NEED, not a want?", options: ["A new pair of sneakers", "This month's electricity bill", "A weekend trip with friends", "The newest phone model"], correctIndex: 1, explanation: "Bills keep essential services running - skipping one has real consequences, unlike the other options." },
    labSlug: null,
  },
  {
    id: "pay-yourself-first", topic: "Saving", title: "Pay Yourself First",
    oneLineIdea: "Save the moment money arrives - don't save whatever's left over.",
    bodyMd: "Most people plan to spend first and save \"whatever's left\" - which is usually nothing. Paying yourself first flips the order: the moment income arrives, a fixed amount moves to savings BEFORE anything else gets spent.\nEven a small, consistent amount (₹200 a month) builds a real habit that a bigger, irregular amount never does.",
    indianExample: "A student gets ₹1,500 pocket money on the 1st. Moving ₹200 to a piggy bank or savings account THAT DAY, before any spending happens, means the saving actually happens.",
    checkQ: { prompt: "What does \"pay yourself first\" mean?", options: ["Spend on yourself before anyone else", "Save a fixed amount the moment income arrives, before spending", "Only save money you don't need", "Pay off all debts before saving anything"], correctIndex: 1, explanation: "It's about ORDER - saving first, not saving whatever happens to be left over." },
    labSlug: "goal-planner",
  },
  {
    id: "emergency-fund", topic: "Saving", title: "The Emergency Fund",
    oneLineIdea: "Money set aside only for real, unplanned problems - never for wants.",
    bodyMd: "An emergency fund is money that exists purely to absorb a shock - a broken phone, a medical bill, a sudden expense - without going into debt or panic.\nIt's not invested (you need it instantly, not after a market recovers) and it's not touched for a sale or a trip, however tempting.",
    indianExample: "A working professional aiming for 3-6 months of essential expenses in a simple savings account - not shares, not an FD that locks the money away.",
    checkQ: { prompt: "Where should an emergency fund typically sit?", options: ["In the stock market for higher returns", "In a simple, instantly-accessible savings account", "Lent to a friend who'll pay it back with interest", "Spent immediately so it doesn't tempt you"], correctIndex: 1, explanation: "Instant access matters more than returns for money you might need tomorrow, not in 5 years." },
    labSlug: "goal-planner",
  },
  {
    id: "upi-pin-vs-otp", topic: "Digital payments", title: "UPI PIN vs OTP",
    oneLineIdea: "A PIN is to SEND money. An OTP confirms something. Neither is ever shared.",
    bodyMd: "Your UPI PIN authorises a payment OUT of your account - you only ever enter it when YOU are sending or paying. You should never need it to RECEIVE money.\nAn OTP (one-time password) confirms an action you initiated. If an OTP arrives when you didn't ask for anything, don't share it - someone else is trying to act as you.",
    indianExample: "A \"collect request\" that says \"approve to receive ₹500\" but then asks for your PIN is backwards - that's actually a request for YOU to pay, dressed up as a gift.",
    checkQ: { prompt: "When should you enter your UPI PIN?", options: ["Whenever someone asks, to verify your identity", "Only when YOU are actively sending or paying money", "To receive money from someone else", "When a bank employee calls and requests it"], correctIndex: 1, explanation: "The PIN authorises outgoing payments you initiate - never for receiving money or over a phone call." },
    labSlug: null,
  },
  {
    id: "what-interest-really-costs", topic: "Borrowing", title: "What Interest Really Costs",
    oneLineIdea: "Borrowed money isn't free - interest means you pay back more than you took.",
    bodyMd: "Interest is the price of borrowing. A higher rate or a longer repayment period both mean paying back significantly more than the original amount - even when the monthly instalment looks small and manageable.\n\"No-cost EMI\" often isn't truly free either - the cost is frequently built into the product's price or a processing fee instead of a separate interest line.",
    indianExample: "A ₹60,000 phone on a 24-month EMI at a typical rate can end up costing several thousand rupees more than paying the full price upfront.",
    checkQ: { prompt: "Why can \"no-cost EMI\" still cost more than paying upfront?", options: ["It never does - it's always genuinely free", "The cost is often built into the price or a processing fee instead of separate interest", "EMIs always have hidden late fees only", "No-cost EMI is illegal in India"], correctIndex: 1, explanation: "The word \"interest\" might be absent, but the cost frequently shows up elsewhere in the price structure." },
    labSlug: "emi",
  },
  {
    id: "emi-basics", topic: "Borrowing", title: "EMIs, in Plain Terms",
    oneLineIdea: "An EMI breaks a loan into equal monthly payments - principal plus interest.",
    bodyMd: "Every EMI payment is really two things combined: a slice of the amount you originally borrowed (principal), and a slice of interest for borrowing it. Early in a loan, more of each payment goes to interest; later, more goes to principal.\nA longer tenure means smaller monthly payments, but usually MORE total interest paid over the life of the loan.",
    indianExample: "The same ₹1,00,000 loan over 12 months has a bigger monthly payment but less total interest than spreading it over 36 months.",
    checkQ: { prompt: "What happens to TOTAL interest paid when a loan's tenure is stretched longer?", options: ["It usually goes down", "It usually goes up, even though monthly payments look smaller", "It stays exactly the same", "Tenure has no effect on interest"], correctIndex: 1, explanation: "A longer tenure spreads the same principal over more interest-charging periods - smaller monthly bite, bigger total cost." },
    labSlug: "emi",
  },
  {
    id: "compounding-basics", topic: "Investing", title: "How Compounding Works",
    oneLineIdea: "Growth on your growth - starting early matters more than starting big.",
    bodyMd: "Simple growth adds the same amount each period. Compounding adds growth ON TOP of previous growth too, so the curve bends upward over time rather than staying a straight line.\nThe biggest lever isn't the monthly amount - it's TIME. Money given more years to compound can end up far ahead of a larger amount given fewer years.",
    indianExample: "₹1,000 a month starting at age 22 can end up meaningfully larger by 50 than the same ₹1,000 a month started at 32 - a full 10 extra years of compounding, even though total money put in differs by just ₹1.2 lakh.",
    checkQ: { prompt: "What matters most for how much compounding can grow your money?", options: ["Only the monthly amount saved", "Time - how many years the money has to compound", "The colour of the app you use", "Only your starting salary"], correctIndex: 1, explanation: "Time is the one factor compounding rewards disproportionately - an early start beats a bigger but later one." },
    labSlug: "compounding",
  },
  {
    id: "risk-and-return", topic: "Investing", title: "Risk and Return",
    oneLineIdea: "Higher potential return almost always comes with higher potential loss.",
    bodyMd: "A savings account barely grows your money, but it also basically can't lose it. Markets can grow money much faster - but can also fall. There's no option that's both high-return and risk-free; if something claims to be, that's a warning sign, not good luck.\nSpreading money across different types of investments (diversification) is one of the few ways to manage risk without giving up all potential growth.",
    indianExample: "A Fixed Deposit returns a modest, near-guaranteed amount. A mutual fund SIP has historically grown faster over long periods, but its value can genuinely go down some years too.",
    checkQ: { prompt: "What does it mean when an investment promises high returns with \"zero risk\"?", options: ["It's a great, rare opportunity", "It's a major red flag - no real investment is both high-return and risk-free", "Only banks can offer this", "It's normal for government schemes"], correctIndex: 1, explanation: "This exact combination is one of the clearest scam signals in investing - genuine high returns always carry real risk." },
    labSlug: "save-vs-grow",
  },
  {
    id: "why-prices-rise", topic: "Inflation", title: "Why Prices Rise (Inflation)",
    oneLineIdea: "The same ₹100 buys a little less each year - money sitting idle slowly loses power.",
    bodyMd: "Inflation means prices generally rise over time, so a fixed amount of money buys less in the future than it does today. This is why money that just sits in a wallet (earning nothing) is quietly losing real value every year, even though the number on the note never changes.\nGrowth-focused saving (like an SIP) aims to beat inflation; money sitting completely idle rarely does.",
    indianExample: "A samosa that cost ₹5 some years ago costs considerably more today - the samosa didn't change, the value of a rupee did.",
    checkQ: { prompt: "What happens to idle cash (not saved or invested) over many years, because of inflation?", options: ["It keeps the same real buying power forever", "Its real buying power tends to shrink over time", "It automatically grows with prices", "Inflation only affects investments, not cash"], correctIndex: 1, explanation: "Prices rising while the cash amount stays fixed means that fixed amount buys less and less over time." },
    labSlug: "inflation",
  },
  {
    id: "salary-slip-basics", topic: "Earning", title: "Why Your In-Hand Pay Is Less Than Your Offer",
    oneLineIdea: "CTC (cost to company) is not the amount that reaches your bank account.",
    bodyMd: "A job offer's CTC (cost to company) bundles your base pay with other components - provident fund contributions, professional tax, and other deductions - several of which never land directly in your bank account as cash.\nUnderstanding this before your first salary avoids a confusing (and sometimes stressful) surprise on payday.",
    indianExample: "A ₹6,00,000 CTC offer commonly works out to meaningfully less than ₹50,000 a month in-hand, once PF and tax deductions are accounted for.",
    checkQ: { prompt: "Why is in-hand salary usually less than CTC divided by 12?", options: ["Companies often underpay on purpose", "CTC includes components like PF and tax that don't arrive as monthly cash", "In-hand pay is always a mistake to expect", "CTC and in-hand salary are always identical"], correctIndex: 1, explanation: "CTC is a bundled number - several of its components never show up as cash in your account each month." },
    labSlug: "salary-slip",
  },
  {
    id: "banking-basics", topic: "Banking", title: "Savings Accounts, FDs and RDs",
    oneLineIdea: "Three common ways to keep money safe at a bank - each trades flexibility for a bit more growth.",
    bodyMd: "A savings account keeps money accessible any time, with modest growth. A Fixed Deposit (FD) locks a lump sum away for a set period for a better rate. A Recurring Deposit (RD) lets you lock in a fixed amount every month instead of one lump sum.\nNone of these beat genuine investing for long-term growth, but all three are useful for money you need to keep safe and relatively accessible.",
    indianExample: "A student saving for a ₹20,000 laptop over 10 months might use an RD - depositing a fixed amount monthly, with a bit of extra growth versus a simple savings account.",
    checkQ: { prompt: "What's the key difference between an FD and an RD?", options: ["An FD locks in one lump sum; an RD locks in a fixed monthly amount", "They are exactly the same product", "An RD is only for businesses", "An FD can never be opened for less than ₹1,00,000"], correctIndex: 0, explanation: "FD = one-time lump sum locked away. RD = a fixed amount committed every month instead." },
    labSlug: "save-vs-grow",
  },
  {
    id: "sharing-and-giving", topic: "Spending", title: "Budgeting for Giving and Festivals",
    oneLineIdea: "Giving and festival spending are real, recurring costs worth planning for, not surprises.",
    bodyMd: "Festival gifts, donations, and helping family aren't \"extra\" spending that should feel like a shock each time - they're predictable, recurring parts of life worth their own small, planned space in a budget.\nPlanning for them (even a small monthly set-aside) means festival season doesn't wreck an otherwise careful budget.",
    indianExample: "Setting aside a small amount each month specifically for Diwali or Eid gifts means the festival itself doesn't require dipping into savings meant for something else.",
    checkQ: { prompt: "What's the benefit of planning a small monthly amount for festivals/giving in advance?", options: ["It guarantees you'll spend less overall", "Festival spending doesn't become an unplanned shock to the rest of your budget", "It replaces the need for an emergency fund", "It means you never need to give more than planned"], correctIndex: 1, explanation: "The point isn't spending less - it's making a predictable cost actually predictable in the budget." },
    labSlug: null,
  },
  {
    id: "reporting-fraud", topic: "Protect", title: "What To Do If You're Scammed",
    oneLineIdea: "Acting fast and telling someone matters more than feeling embarrassed.",
    bodyMd: "If money is sent or details are shared with a scammer: call the national cyber fraud helpline 1930 immediately - acting fast genuinely improves the chance of freezing the transaction. Then report it at cybercrime.gov.in, and inform your bank to block the card or UPI.\nTelling a parent or trusted adult matters too - being scammed is nothing to be ashamed of, and staying quiet only helps the scammer.",
    indianExample: "A friend enters their UPI PIN on a fake \"refund\" screen and ₹2,000 leaves the account - calling 1930 within the first hour has a real chance of stopping the transfer before it fully clears.",
    checkQ: { prompt: "What's the first thing to do immediately after realising you've been scammed?", options: ["Stay quiet and hope it resolves itself", "Call the national cyber fraud helpline 1930 right away", "Wait a week to see if the money comes back", "Delete the message and move on"], correctIndex: 1, explanation: "Speed matters - calling 1930 immediately gives the best chance of freezing a fraudulent transfer." },
    labSlug: null,
  },
  {
    id: "goal-saving", topic: "Saving", title: "Turning a Big Goal Into a Monthly Number",
    oneLineIdea: "A goal with no monthly number attached usually stays a wish, not a plan.",
    bodyMd: "\"I want to save for a laptop\" is a wish. \"I need to save ₹1,875 a month for 12 months to reach ₹22,500\" is a plan - because it tells you exactly what to do THIS month, not just someday.\nBreaking any goal into a monthly number (goal amount ÷ months remaining) is the single most useful habit for actually reaching it.",
    indianExample: "A ₹45,000 laptop goal in 18 months needs ₹2,500 saved every month - a concrete, checkable number instead of a vague hope.",
    checkQ: { prompt: "Why does turning a goal into a monthly number help?", options: ["It makes the goal feel further away", "It turns a vague wish into a concrete, checkable monthly action", "It's only useful for large goals", "It guarantees the goal will be reached"], correctIndex: 1, explanation: "A monthly number is something you can actually check against reality every single month, unlike a vague total." },
    labSlug: "goal-planner",
  },
  {
    id: "credit-card-minimum-due", topic: "Borrowing", title: "The Minimum-Due Trap",
    oneLineIdea: "Paying only the minimum due keeps a card debt alive for years.",
    bodyMd: "If you don't pay a credit card bill in full, the unpaid part is charged interest, often around 3.5% to 3.75% a month (42% to 45% a year), plus 18% GST on that interest. The minimum due is usually about 5% of the bill, so most of each minimum payment goes on interest.\nRBI's rules say the minimum due must at least cover the interest and taxes, so the debt doesn't grow while you pay it, but it can still take decades to clear.",
    indianExample: "On a ₹50,000 balance at 3.75% a month, paying only a 5% minimum (at least ₹200) takes about 30 years. Paying ₹5,000 a month clears it in 14 months.",
    checkQ: { prompt: "What's the cheapest way to use a credit card?", options: ["Pay the minimum due every month", "Pay the full statement balance by the due date", "Pay whenever you remember", "Pay half the bill"], correctIndex: 1, explanation: "Paying the full balance by the due date means no interest at all on purchases." },
    labSlug: "credit-card",
  },
  {
    id: "term-vs-endowment", topic: "Investing", title: "Term Insurance vs Endowment Plans",
    oneLineIdea: "Insurance protects; investing grows. Mixing the two usually does both jobs less well.",
    bodyMd: "Term insurance pays your family a large amount if you die during the policy, and nothing if you survive it. Because it is pure protection, the premium is small for the cover. An endowment plan adds a savings part that pays back at maturity, so for the same premium the cover is much smaller, and the savings part usually grows slowly.\nAsk two questions of any policy: how much would my family get, and what return am I really earning? Compare categories, not sales pitches.",
    indianExample: "In the Money Life game, ₹15,000 a year buys ₹1 crore of term cover, while ₹1,00,000 a year buys a ₹10 lakh endowment plan. These are game numbers, not quotes.",
    checkQ: { prompt: "What is term insurance mainly for?", options: ["Growing your savings", "Protecting your family's income if you die", "Getting a guaranteed return", "Saving tax only"], correctIndex: 1, explanation: "Term insurance is pure protection: a large cover for a small premium, with no maturity payout." },
    labSlug: null,
  },
  {
    id: "health-insurance", topic: "Saving", title: "Why Health Insurance Matters",
    oneLineIdea: "One hospital bill can undo years of saving. Health insurance spreads that risk.",
    bodyMd: "A health policy pays most hospital costs in return for a yearly premium. Premiums rise with age, and policies have waiting periods for existing illnesses, so buying early matters, especially for parents.\nRead what isn't covered: co-payments, room-rent limits and waiting periods decide how much you still pay yourself.",
    indianExample: "A ₹5 lakh surgery bill with no cover comes straight out of savings or a loan. With cover, the family may pay only the co-pay and items the policy excludes.",
    checkQ: { prompt: "Why buy health cover for parents sooner rather than later?", options: ["Premiums fall as people age", "Premiums rise with age and waiting periods start from when you buy", "Insurance is only useful for young people", "It replaces an emergency fund completely"], correctIndex: 1, explanation: "Buying earlier means lower premiums and waiting periods that finish sooner." },
    labSlug: null,
  },
  {
    id: "rent-vs-buy", topic: "Borrowing", title: "Rent or Buy a Home?",
    oneLineIdea: "The right answer depends on the numbers, not on what relatives say.",
    bodyMd: "Buying builds ownership but locks a large down payment into one asset and adds EMIs, stamp duty and upkeep. Renting keeps money free to invest and lets you move, but rent rises and you don't own the home.\nCompare them fairly: assume both households spend the same each month, and invest whatever one saves compared with the other.",
    indianExample: "Banks can lend up to 80% of a ₹70 lakh flat under RBI rules, so you need at least ₹14 lakh down, plus stamp duty and registration (often 5% to 8%, depending on the state).",
    checkQ: { prompt: "What decides whether renting or buying leaves you better off?", options: ["Always buying", "Always renting", "The actual numbers: price, rent, loan rate, growth and how long you stay", "What neighbours did"], correctIndex: 2, explanation: "Different prices, rents, rates and time horizons flip the answer." },
    labSlug: "rent-vs-buy",
  },
];

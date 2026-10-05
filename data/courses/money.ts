import type { CourseContent } from "@/lib/course/types";

export const MONEY_COURSE: CourseContent = {
  key: "money",
  accent: "#0ea05f",
  kicker: "Financial Literacy",
  title: "Money habits that hold up in real life",
  subtitle:
    "Money skills are habits, not facts. This course covers the decisions you make every month: splitting your money, borrowing, saving, spotting scams and reading a salary slip. Each lesson links to a practice tool.",
  outcomes: [
    "Split any income into needs, wants, savings and growth, and see what each choice does",
    "Work out what an EMI or a no-cost EMI really costs before you agree to it",
    "Spot UPI, OTP and phishing scams, and know the first three steps if you are scammed",
    "Read a salary slip and understand the gap between CTC and in-hand pay",
  ],
  modules: [
    {
      id: "basics",
      title: "Money basics",
      summary: "Where money goes, and why an emergency fund comes before anything else.",
      lessons: [
        {
          id: "four-jars",
          title: "Split your money into four jars",
          minutes: 12,
          summary: "Needs, wants, save and grow. Pick your own split, then watch what happens to it.",
          body: [
            "Most budgeting advice gives a single fixed rule. Real income does not always fit one rule, so it is better to understand what each jar is for and choose your own split.",
            "Needs are the costs you cannot skip: rent, food, travel, school or college fees and bills. Wants are everything that makes life enjoyable but could wait. Save is money kept aside for emergencies and planned goals. Grow is money put to work over a longer period.",
            "When the money for needs runs short, the shortfall does not disappear. It becomes debt or a missed payment. That is why the needs jar is filled first, every month.",
          ],
          points: [
            "Fill the needs jar first, every month",
            "Wants are fine, but decide them before the month starts",
            "An empty save jar turns the next shock into debt",
          ],
          tool: { href: "/account/money/cards", label: "Read the Concept Library" },
        },
        {
          id: "emergency-fund",
          title: "Build an emergency fund first",
          minutes: 8,
          summary: "A cushion for the phone screen, the medical bill and the sudden train ticket.",
          body: [
            "An emergency fund is money you can reach quickly when something unplanned costs money. A phone repair, a medical bill or a job gap are common examples.",
            "A common guideline is to hold three to six months of essential expenses. If that feels out of reach, start with one month and grow it. The first target matters more than the perfect one.",
            "Keep the fund somewhere you can withdraw from easily, such as a savings account. Money locked in investments can lose value at the moment you need it.",
          ],
          points: [
            "Start with one month of essential expenses, then build towards three to six",
            "Keep it in an account you can reach quickly",
            "Use it only for real emergencies, and rebuild it afterwards",
          ],
          tool: { href: "/account/money/labs/goal-planner", label: "Plan your emergency fund in the Goal Planner" },
        },
        {
          id: "track-spending",
          title: "Track what you actually spend",
          minutes: 8,
          summary: "Log every rupee for two weeks. The pattern shows up quickly.",
          body: [
            "Most people underestimate small, frequent spending. Logging every payment for two weeks shows the real pattern, which is more useful than any plan on paper.",
            "For each payment, note the amount, the category and whether it was a need or a want. A quick weekly review is enough: look at the biggest category and ask whether it matches what you wanted to spend.",
          ],
          points: [
            "Log the amount, the category, and need or want",
            "Review once a week, not every day",
            "Two weeks of honest data beats a perfect budget you never follow",
          ],
          tool: { href: "/account/money/cards", label: "Read the Concept Library" },
        },
      ],
    },
    {
      id: "payments",
      title: "Banking and digital payments",
      summary: "How your account and UPI work, and the codes you must never share.",
      lessons: [
        {
          id: "bank-and-upi",
          title: "Your bank account and UPI basics",
          minutes: 10,
          summary: "What a savings account does, and how a UPI payment moves money.",
          body: [
            "A savings account holds your money and gives you a way to send and receive payments. UPI lets you send money from one bank account to another using a payment app and your registered mobile number.",
            "To send money you approve a payment with your UPI PIN. To receive money you do not need your PIN at all. Anyone who asks you to enter a PIN to receive money is trying to take money from you.",
          ],
          points: [
            "You enter your UPI PIN to send money, never to receive it",
            "Check the name and amount on the screen before you approve",
            "Use the official banking app, not a link from a message",
          ],
          tool: { href: "/account/money/scam-shield", label: "Practise in Scam Shield" },
        },
        {
          id: "pin-otp-cvv",
          title: "UPI PIN, OTP and CVV: what each is for",
          minutes: 9,
          summary: "Three codes that unlock your money, and one rule for all of them.",
          body: [
            "Your UPI PIN approves payments. An OTP is a one-time code that confirms a login or a transaction. A CVV is the three-digit code on the back of a card, used for online card payments.",
            "Banks and payment companies do not ask for these codes over phone calls, messages or video calls. If someone asks for one, the request is almost certainly a scam, even if they know your name, your bank or your account details.",
          ],
          points: [
            "Never share your UPI PIN, OTP or CVV with anyone",
            "Banks do not ask for them by phone, SMS or video call",
            "If you shared one by mistake, call your bank at once and block the card or UPI",
          ],
          tool: { href: "/account/money/scam-shield/swipe", label: "Play Safe or Scam" },
        },
        {
          id: "payment-requests",
          title: "Spot a payment-request trap",
          minutes: 7,
          summary: "A collect request asks you to pay, not to be paid. The difference is everything.",
          body: [
            "A collect request asks you to approve a payment out of your account. Scammers used this to make people pay while pretending they were getting a refund or a reward. Since 1 October 2025, NPCI has stopped person-to-person collect requests on UPI; only merchants, such as shopping or ticket sites, can still send them.",
            "So a 'request' that seems to come from a person, or a screen asking for your PIN to receive money, is a warning sign. Before approving any payment, ask who it is for and why you owe it. If the reason is unclear, decline it and check another way.",
          ],
          points: [
            "A request you approve sends money from you",
            "A 'refund' that needs you to enter a PIN is a scam",
            "Decline anything you cannot explain",
          ],
          source: { label: "NPCI ends P2P collect requests from 1 Oct 2025 (Business Today)", url: "https://www.businesstoday.in/personal-finance/banking/story/npci-to-tighten-upi-rules-peer-to-peer-collect-feature-to-end-in-october-489244-2025-08-13" },
          tool: { href: "/account/money/scam-shield/spot-the-fake", label: "Practise in Spot the Fake" },
        },
      ],
    },
    {
      id: "borrowing",
      title: "Borrowing and credit",
      summary: "What loans, EMIs and credit cards really cost, before you sign.",
      lessons: [
        {
          id: "emi-cost",
          title: "What an EMI really costs",
          minutes: 10,
          summary: "A 'no-cost' EMI is a loan. The cost is often built into the price.",
          body: [
            "An EMI splits a purchase into monthly payments. The total you pay includes interest or fees, even when the offer says there is no cost. Sometimes the interest is hidden in a higher product price or in processing charges.",
            "Compare the total paid with the price you would pay in cash. The gap is what borrowing costs you. The EMI Truth Teller lab shows this for any price, interest rate and tenure.",
          ],
          points: [
            "Always compare the total paid with the cash price",
            "Processing fees and hidden charges count as cost",
            "Only borrow for things you can repay from your income without strain",
          ],
          tool: { href: "/account/money/labs/emi", label: "Open EMI Truth Teller" },
        },
        {
          id: "credit-card-minimum",
          title: "Credit cards and the minimum-due trap",
          minutes: 9,
          summary: "Paying only the minimum keeps the debt alive for a long time.",
          body: [
            "A credit card lets you borrow up to a limit. If you do not pay the full balance by the due date, interest is charged on the unpaid amount, usually at a high annual rate.",
            "Paying only the minimum due can keep a balance going for years. Each month the interest adds to the debt, so the final cost can exceed the original purchase by a wide margin.",
          ],
          points: [
            "Pay the full statement balance whenever you can",
            "Use the card only for amounts you can clear this month",
            "Set an automatic payment for the full balance, not the minimum",
          ],
          tool: { href: "/account/money/labs/credit-card", label: "Open the Credit Card Minimum-Due Trap" },
        },
        {
          id: "credit-score",
          title: "Credit score basics",
          minutes: 7,
          summary: "Your credit history decides whether lenders trust you with money later.",
          body: [
            "A credit score summarises how you have handled borrowing. In India, scores are commonly reported on a scale of 300 to 900, with higher scores generally helping you get better loan terms.",
            "The biggest factors are paying on time and keeping your balances low compared with your limits. A single missed due date can lower the score, so set reminders or automatic payments.",
          ],
          points: [
            "On-time payments matter most",
            "Keep card balances well below the limit",
            "Check your credit report for errors you can dispute",
          ],
        },
      ],
    },
    {
      id: "saving-growing",
      title: "Saving and growing money",
      summary: "Why starting early matters, and how risk and return are linked.",
      lessons: [
        {
          id: "compounding",
          title: "Compounding: why starting early matters",
          minutes: 10,
          summary: "Growth on growth. The earlier you start, the more time the growth has.",
          body: [
            "Compounding means your returns earn returns. If a monthly saving grows at a steady rate, the growth in the later years is larger than the growth in the early years, because each year starts from a bigger base.",
            "The Compounding Playground uses an assumed rate of return. It is an illustration, not a promise, and real returns can be lower or negative.",
          ],
          points: [
            "Time is the strongest input in compounding",
            "Rates shown in illustrations are assumptions, not guarantees",
            "A smaller amount started early can beat a bigger amount started late",
          ],
          tool: { href: "/account/money/labs/compounding", label: "Open the Compounding Playground" },
        },
        {
          id: "risk-return",
          title: "Risk and return",
          minutes: 9,
          summary: "Higher returns come with higher risk. There is no free lunch.",
          body: [
            "Savings accounts and fixed deposits are low risk and lower return. Investments such as mutual funds and shares can grow more over time but can also fall in value, sometimes sharply and for long periods.",
            "Any offer that promises high, guaranteed returns with little risk should raise a warning. Learn the categories and how to compare them. The Investor Education site from SEBI explains the basics of each.",
          ],
          points: [
            "Savings accounts and fixed deposits: low risk, lower return",
            "Mutual funds and shares: can grow more, can also lose value",
            "Guaranteed high returns with no risk are a warning sign",
          ],
          source: { label: "SEBI Investor Education", url: "https://investor.sebi.gov.in/" },
          tool: { href: "/account/money/labs/save-vs-grow", label: "Compare them in Save vs Grow" },
        },
        {
          id: "plan-a-goal",
          title: "Plan a goal in monthly steps",
          minutes: 7,
          summary: "A laptop or college fee becomes a monthly number once you break it down.",
          body: [
            "A big goal feels distant until you work out the monthly amount. Decide the target and the date, then divide the difference by the number of months left.",
            "Check whether the current monthly saving reaches the target. If it does not, you can change the amount or the date. The Goal Planner shows both options side by side.",
          ],
          points: [
            "Write the target amount and the date",
            "Divide the gap by the months left",
            "Adjust either the amount or the date, not the honesty of the plan",
          ],
          tool: { href: "/account/money/labs/goal-planner", label: "Open the Goal Planner" },
        },
      ],
    },
    {
      id: "scams",
      title: "Protect yourself from scams",
      summary: "The scams that target young people and families, and what to do if you are caught.",
      lessons: [
        {
          id: "common-scams",
          title: "Common scams to recognise",
          minutes: 10,
          summary: "Fake KYC messages, task jobs, investment groups and 'digital arrest' calls.",
          body: [
            "Fake KYC messages claim your account will be blocked unless you click a link or update details. Banks do not send links to update KYC. Fake task jobs ask you to pay a fee to withdraw earnings. Investment groups promise guaranteed returns and pressure you to join quickly.",
            "'Digital arrest' calls claim to be police or agencies and demand money over a video call. Police and government agencies do not arrest people or demand money over video calls. Screen-sharing apps should never be installed because a caller asks you to.",
          ],
          points: [
            "Do not click links or call numbers from unexpected SMS",
            "Never install an app because a caller asked you to",
            "Guaranteed returns and pressure to act quickly are warning signs",
          ],
          tool: { href: "/account/money/scam-shield/swipe", label: "Practise Safe or Scam" },
        },
        {
          id: "if-scammed",
          title: "If you have been scammed: the first three steps",
          minutes: 7,
          summary: "Speed matters. Call 1930 first, then report, then tell your bank.",
          body: [
            "Call the national cyber fraud helpline on 1930 immediately. Acting fast improves the chance that the money can be frozen. Then report the incident at cybercrime.gov.in, with as much detail as you can.",
            "Tell your bank and block the card or UPI ID. Tell a parent or another trusted adult as well. Being scammed is not a failure of intelligence, and scammers are skilled at this.",
          ],
          points: [
            "Call 1930 right away",
            "Report at cybercrime.gov.in",
            "Inform your bank and block the card or UPI",
            "Tell someone you trust",
          ],
          source: { label: "National Cyber Crime Reporting Portal", url: "https://cybercrime.gov.in/" },
          tool: { href: "/account/money/scam-shield", label: "Open Scam Shield" },
        },
      ],
    },
    {
      id: "salary-tax",
      title: "Salary and taxes basics",
      summary: "What appears on a salary slip, and why the number in your bank is smaller than the offer.",
      lessons: [
        {
          id: "salary-slip",
          title: "Read a salary slip",
          minutes: 9,
          summary: "CTC is not what reaches your bank account. Here is the gap, simplified.",
          body: [
            "Cost to company, or CTC, is the total cost of employing you. It includes amounts that never reach your bank, such as employer contributions to provident fund. The in-hand salary is what is left after deductions.",
            "Common deductions include provident fund contributions, professional tax where it applies, and tax deducted at source. The exact lines differ by employer and state, so read your own slip rather than relying on an average.",
          ],
          points: [
            "CTC is a cost figure, not your monthly pay",
            "In-hand pay is what remains after deductions",
            "Check each deduction line on your own slip",
          ],
          tool: { href: "/account/money/labs/salary-slip", label: "Decode a CTC in the Salary Slip Decoder" },
        },
        {
          id: "why-tax",
          title: "Why tax matters to you",
          minutes: 6,
          summary: "Income tax on what you earn, and GST built into what you buy.",
          body: [
            "Income tax is paid on income above certain limits, and the rules change in each budget. GST is added to many purchases, so the price you see often already includes tax.",
            "You do not need to memorise the rules. Know that tax exists, keep records of income and important payments, and ask a qualified tax adviser when a decision is large.",
          ],
          points: [
            "Keep records of income and major payments",
            "GST is often already included in shelf prices",
            "Ask a qualified adviser before big financial decisions",
          ],
          tool: { href: "/account/money/labs/salary-slip", label: "See tax on a salary in the Salary Slip Decoder" },
        },
      ],
    },
  ],
};

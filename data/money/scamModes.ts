/**
 * Content for the Scam Shield modes beyond Safe or Scam and Family Guard:
 * Spot the Fake, The Call, Too Good to Be True, and Scam of the Week.
 *
 * Screens use a made-up bank ("Nova Bank") so no real brand is imitated.
 * The rules each lesson teaches are real and dated in the lesson text.
 * Scam of the Week entries are real warnings from official sources, with links.
 * Practice answers live here because these are practice rounds, not tests.
 */

export interface FakeScreen {
  app: string; // what kind of screen this is, e.g. "Browser", "UPI app"
  from?: string;
  lines: string[];
  mono?: boolean;
}

export interface SpotPair {
  id: string;
  topic: string;
  prompt: string;
  a: FakeScreen;
  b: FakeScreen;
  fake: "a" | "b";
  lesson: string;
}

export const SPOT_PAIRS: SpotPair[] = [
  {
    id: "bank-website",
    topic: "Bank website",
    prompt: "You want to log in to Nova Bank. Which address is fake?",
    a: { app: "Browser", lines: ["https://novabank-secure-login.in/netbanking"], mono: true },
    b: { app: "Browser", lines: ["https://novabank.bank.in/netbanking"], mono: true },
    fake: "a",
    lesson: "RBI asked every bank in India to move its website to a '.bank.in' address by 31 October 2025, and over 400 banks have. An address like 'novabank-secure-login.in' is not a bank's. Type the address yourself or use the bank's own app.",
  },
  {
    id: "upi-collect",
    topic: "UPI request",
    prompt: "Two UPI screens. Which one is the trap?",
    a: { app: "UPI app", lines: ["Pay ₹2,000 to rahul.k@okbank", "Paying for: dinner split", "Enter UPI PIN to PAY"] },
    b: { app: "UPI app", lines: ["Rewards Team has sent you ₹2,000!", "Enter UPI PIN to RECEIVE the money"] },
    fake: "b",
    lesson: "Your UPI PIN only ever sends money out. You never enter it to receive money. Since 1 October 2025 NPCI has stopped person-to-person 'collect requests' on UPI, so a stranger 'requesting' or 'sending' through a PIN screen is a scam.",
  },
  {
    id: "sms-sender",
    topic: "Bank SMS",
    prompt: "Two messages about money in your account. Which one is fake?",
    a: { app: "SMS", from: "JD-NOVABK-T", lines: ["₹5,000 debited from A/c XX1234 on 03-Oct. Not you? Call the number on the back of your card."] },
    b: { app: "SMS", from: "+91 98XXX XX421", lines: ["Sir ₹5,000 credited to your account by mistake. Please return to this UPI ID fast or police case will be filed."] },
    fake: "b",
    lesson: "Genuine bank messages come from a sender name like 'JD-NOVABK-T', not a 10-digit mobile number. Since 2025, TRAI has required business SMS names to end in -P (promotional), -S (service), -T (transactional) or -G (government). Check your bank app before you 'return' any money.",
  },
  {
    id: "customer-care",
    topic: "Customer care number",
    prompt: "Your card is blocked and you need help. Which number should you NOT call?",
    a: { app: "Search results", lines: ["Ad · Nova Bank Customer Care 24x7", "Call now: 98XXX XXX07 · Instant refund help"] },
    b: { app: "Nova Bank app", lines: ["Help → Contact us", "Phone banking: number printed on your card and in this app"] },
    fake: "a",
    lesson: "Fraudsters buy ads and post fake 'customer care' numbers that show up in web searches. Use only the number in your bank's app, on the back of your card or on the bank's official '.bank.in' website.",
  },
  {
    id: "investment-upi",
    topic: "Paying a broker",
    prompt: "A stockbroker asks you to add money to your trading account. Which UPI ID is the warning sign?",
    a: { app: "UPI app", lines: ["Pay to: novacap.bkr@validnova", "✅ Verified by SEBI 'SEBI Check'"] },
    b: { app: "UPI app", lines: ["Pay to: novacap.trading.desk@ybl", "Sent by 'Relationship Manager' on WhatsApp"] },
    fake: "b",
    lesson: "Since 1 October 2025, SEBI-registered brokers and mutual funds collect UPI payments through IDs ending in '@valid' with a category tag such as '.bkr' or '.mf'. You can confirm an ID with SEBI's 'SEBI Check' tool before you pay.",
  },
  {
    id: "app-install",
    topic: "Installing an app",
    prompt: "You are told to update your bank app. Which one is dangerous?",
    a: { app: "WhatsApp", from: "Unknown number", lines: ["📎 NovaBank_KYC_Update.apk (12 MB)", "Install today or your account will be blocked"] },
    b: { app: "Play Store", lines: ["Nova Bank Mobile", "Nova Bank Ltd · Update available"] },
    fake: "a",
    lesson: "Never install an app file (.apk) sent over WhatsApp or SMS. These apps can read your messages and OTPs. Update apps only from the official app store, and check the developer's name.",
  },
  {
    id: "electricity",
    topic: "Electricity bill",
    prompt: "Which one is the fake electricity message?",
    a: { app: "SMS", from: "+91 70XXX XX893", lines: ["Dear consumer your power will be disconnected tonight 9.30 pm as last month bill not updated. Contact electricity officer 70XXXXXX93"] },
    b: { app: "Electricity board app", lines: ["Bill for Sept: ₹1,240", "Due date: 15 Oct", "Pay in app"] },
    fake: "a",
    lesson: "Power companies don't threaten same-night cuts from a personal mobile number. Check your bill in the official app or website. You can report messages like this on the government's Sanchar Saathi portal (Chakshu).",
  },
  {
    id: "govt-scheme",
    topic: "Government scheme",
    prompt: "Which link is the fake 'scheme'?",
    a: { app: "Browser", lines: ["https://www.mygov.in/"], mono: true },
    b: { app: "Browser", lines: ["https://free-laptop-yojana-2026.online/apply"], mono: true },
    fake: "b",
    lesson: "In January 2026 PIB Fact Check called a 'Students Laptop Scheme 2026' message fake and a phishing attempt. Real schemes are announced on official '.gov.in' or '.nic.in' sites, never on links like '.online' or '.xyz'.",
  },
];

// ---------- The Call ----------

export interface CallOption {
  label: string;
  next?: string;
  end?: { safe: boolean; text: string };
}
export interface CallNode {
  caller: string;
  options: CallOption[];
}
export interface CallScript {
  id: string;
  title: string;
  callerId: string;
  intro: string;
  start: string;
  nodes: Record<string, CallNode>;
  lesson: string;
}

export const CALL_SCRIPTS: CallScript[] = [
  {
    id: "bank-otp",
    title: "The 'bank security' call",
    callerId: "+91 98XXX XX310",
    intro: "Your phone rings during lunch.",
    start: "n1",
    nodes: {
      n1: {
        caller: "Good afternoon, I'm Rohit from Nova Bank's fraud team. Someone just tried to spend ₹48,000 on your debit card. I can block it, but I must verify you first.",
        options: [
          { label: "Okay, what do you need?", next: "n2" },
          { label: "I'll call the bank myself on the number on my card.", end: { safe: true, text: "Perfect. Hang up and call the number on your card or in your bank app. If the alert were real, the bank would see it too." } },
        ],
      },
      n2: {
        caller: "You'll get a 6-digit code now. Read it out so I can stop the payment. Hurry, the transaction goes through in two minutes.",
        options: [
          { label: "Read out the code: 123456", end: { safe: false, text: "That code was the OTP approving a payment out of your account. In real life the money would be gone. Call 1930 at once." } },
          { label: "Banks never ask for an OTP. I'm hanging up.", end: { safe: true, text: "Exactly right. An OTP is for you alone. No bank, police officer or company will ever ask you to read it out." } },
          { label: "Why do you need my code if you're the bank?", next: "n3" },
        ],
      },
      n3: {
        caller: "Ma'am/Sir, this is standard procedure. If you don't co-operate, your account will be frozen today and you'll be responsible for the loss.",
        options: [
          { label: "Fine, here's the code.", end: { safe: false, text: "Pressure and threats are the scammer's main tools. The code let them take the money. Call 1930 at once and report at cybercrime.gov.in." } },
          { label: "Then freeze it. I'll visit my branch.", end: { safe: true, text: "Great answer. Real banks never punish you for checking. Threats are a sign it's a scam." } },
        ],
      },
    },
    lesson: "Banks never ask for your OTP, UPI PIN, CVV or password. Urgency and threats are warning signs.",
  },
  {
    id: "digital-arrest",
    title: "The 'digital arrest' call",
    callerId: "Video call · 'Police Cyber Cell'",
    intro: "A video call shows a man in a police uniform with an office behind him.",
    start: "n1",
    nodes: {
      n1: {
        caller: "A courier parcel in your name was caught with fake passports and drugs. A case is registered. Stay on this video call. You are under digital arrest.",
        options: [
          { label: "I didn't send anything! What should I do?", next: "n2" },
          { label: "There's no such thing as a 'digital arrest'. I'm ending the call.", end: { safe: true, text: "Correct. Police and agencies never arrest anyone over a video call and never ask for money to 'clear' a case. Report it at cybercrime.gov.in or call 1930." } },
        ],
      },
      n2: {
        caller: "Don't tell your family or you will be charged too. To prove your innocence, transfer your savings to an RBI verification account. You'll get it back after checking.",
        options: [
          { label: "Okay, I'll transfer it now.", end: { safe: false, text: "There is no 'RBI verification account'. Victims of this scam have lost their life savings. If you've paid, call 1930 immediately: speed helps freeze the money." } },
          { label: "I'm going to call my parents first.", end: { safe: true, text: "That breaks the scam. They depend on keeping you isolated and scared. Talk to a trusted adult, then report it." } },
        ],
      },
    },
    lesson: "'Digital arrest' does not exist. Police don't demand money over calls, and real cases never ask you to keep them secret from family.",
  },
  {
    id: "screen-share",
    title: "The 'electricity refund' call",
    callerId: "+91 63XXX XX018",
    intro: "A caller says they are from the electricity board.",
    start: "n1",
    nodes: {
      n1: {
        caller: "Your last bill was charged twice. We'll refund ₹1,860 today. Please install the 'Quick Support' app so I can process it on your phone.",
        options: [
          { label: "Okay, installing it now.", next: "n2" },
          { label: "I'll check my bill in the official app instead.", end: { safe: true, text: "Right. Refunds never need you to install anything. Screen-sharing apps let a caller see your OTPs and banking apps." } },
        ],
      },
      n2: {
        caller: "Good. Now open your UPI app and enter ₹10 to 'activate' the refund. I can see your screen, so just follow me.",
        options: [
          { label: "Enter the amount and UPI PIN.", end: { safe: false, text: "The caller could see your PIN on screen and used it to empty the account. Uninstall the app, change your PIN, and call 1930 and your bank." } },
          { label: "Stop, uninstall the app and hang up.", end: { safe: true, text: "Good recovery. Uninstall the app, change your UPI PIN to be safe, and tell your bank about the call." } },
        ],
      },
    },
    lesson: "Never install an app because a caller asks, and never enter your PIN to 'receive' a refund.",
  },
];

// ---------- Too Good to Be True ----------

export interface OfferItem {
  id: string;
  channel: string;
  text: string;
  expert: 1 | 2 | 3 | 4 | 5; // 1 = safe, 5 = scam
  why: string;
}

export const OFFER_ITEMS: OfferItem[] = [
  { id: "o1", channel: "Bank branch", text: "A 1-year fixed deposit at your bank at 6.5% a year. Rate shown on the bank's official website. Deposits insured up to ₹5 lakh.", expert: 1, why: "A regulated bank, a published rate, and deposit insurance from DICGC. Low risk." },
  { id: "o2", channel: "WhatsApp group", text: "Double your money in 30 days, GUARANTEED! Only 20 slots left. Join our VIP plan before midnight.", expert: 5, why: "Guaranteed high returns plus a deadline is the classic scam pattern. No real investment doubles in a month safely." },
  { id: "o3", channel: "Registered distributor", text: "An equity mutual fund SIP. The papers say 'Mutual fund investments are subject to market risks' and show past returns that went up and down.", expert: 2, why: "A regulated product with honest risk disclosure. It can lose value, so it isn't risk-free, but it isn't a scam." },
  { id: "o4", channel: "Telegram", text: "Pay ₹5,000 for our stock-tip group. Our 'SEBI-registered expert' gives sure-shot tips: 5% profit every week.", expert: 5, why: "No one can promise weekly profits. Check any adviser on SEBI's website. Many fake groups use the word 'SEBI' falsely." },
  { id: "o5", channel: "Neighbour", text: "A local 'savings society' that isn't registered anywhere collects monthly deposits and promises 24% a year.", expert: 4, why: "Very high promised returns from an unregistered body is a serious red flag. Check on RBI's Sachet portal (sachet.rbi.org.in) and report it there." },
  { id: "o6", channel: "Instagram ad", text: "A crypto trading app shows your ₹10,000 grew 40% in one week. To withdraw, pay an 18% 'tax clearance fee' first.", expert: 5, why: "Fake trading apps show made-up profits, then demand a 'fee' to withdraw. You never get the money." },
  { id: "o7", channel: "Friend", text: "Join this business: pay ₹15,000, then earn by getting 3 more people to join. Your earnings come from their fees.", expert: 5, why: "Money that comes from new members rather than real sales is a pyramid or money-circulation scheme, which is illegal in India." },
  { id: "o8", channel: "Post office", text: "A Public Provident Fund (PPF) account at the post office. The government sets the rate every quarter. Money is locked in for 15 years.", expert: 1, why: "A government-backed small savings scheme. Low risk, though the money is locked in for a long time." },
  { id: "o9", channel: "App notification", text: "Buy 'digital gold' on our new app: fixed 3% return every month, guaranteed by our company.", expert: 4, why: "Gold prices go up and down. A fixed monthly 'guaranteed' return (about 42% a year) from an unknown company is a warning sign." },
];

// ---------- Scam of the Week ----------

export interface ScamWeek {
  date: string; // ISO date the warning was published
  title: string;
  what: string;
  redFlags: string[];
  doThis: string;
  source: { label: string; url: string };
}

/** Newest first. Each entry is a real official warning. */
export const SCAM_OF_THE_WEEK: ScamWeek[] = [
  {
    date: "2026-09-21",
    title: "Fake 'Dak Seva Gifts' from India Post",
    what: "A message offers a chance to win up to ₹10,000 from India Post if you answer a 4-question quiz, then 'pick a gift box' in three tries.",
    redFlags: ["A prize you never entered for", "A quiz and 'gift boxes' to keep you clicking", "It ends by asking for personal or bank details"],
    doThis: "PIB Fact Check called it fake: India Post has no 'Dak Seva Gifts' scheme. Don't click, and never share bank details, OTPs or Aadhaar numbers.",
    source: { label: "Outlook Money, on PIB Fact Check, 21 Sep 2026", url: "https://www.outlookmoney.com/news/got-an-india-post-gift-message-heres-what-pib-says-about-dak-seva-gifts" },
  },
  {
    date: "2026-05-26",
    title: "Fake RBI 'Donation Program 2026' email",
    what: "An email that looks like it is from the RBI says you will receive lottery compensation, an inheritance or a donation, but first asks for a 'crediting fee'.",
    redFlags: ["Money you weren't expecting", "A fee before you can receive it", "The RBI's name on an email"],
    doThis: "PIB Fact Check: the RBI runs no donation, compensation, inheritance or lottery scheme. Never pay to receive money.",
    source: { label: "Outlook Money, on PIB Fact Check, 26 May 2026", url: "https://www.outlookmoney.com/news/is-rbi-asking-for-a-crediting-fee-under-lottery-scheme-pib-clarifies" },
  },
  {
    date: "2026-05-23",
    title: "Lost-phone 'Find My iPhone' texts",
    what: "After someone loses a phone, criminals text them pretending to be Apple Support, saying the phone was 'found', with a link to a fake login page that steals the Apple ID and OTP.",
    redFlags: ["A message arriving right after a loss", "A link to 'log in' and see your phone", "International or unknown sender"],
    doThis: "I4C advises: don't click such links, block a lost phone on the government's CEIR portal (ceir.gov.in), and report fraud at cybercrime.gov.in or 1930.",
    source: { label: "ETV Bharat, on the I4C advisory, 23 May 2026", url: "https://www.etvbharat.com/en/bharat/fraud-alert-for-iphone-users-i4c-issues-advisory-about-sophisticated-hybrid-cybercrime-enn26052306407" },
  },
  {
    date: "2026-01-12",
    title: "Fake 'Students Laptop Scheme 2026'",
    what: "A WhatsApp message says the government is giving free laptops to students and asks you to fill in personal details through a link.",
    redFlags: ["Free goods for everyone", "A link that isn't on a .gov.in site", "Asks for personal details"],
    doThis: "PIB Fact Check: no such scheme exists, and the message is a phishing attempt. Check schemes only on official government websites.",
    source: { label: "All India Radio News, 12 Jan 2026", url: "https://www.newsonair.gov.in/govt-warns-public-against-fake-students-laptop-scheme-2026-messages" },
  },
  {
    date: "2025-04-21",
    title: "Fake pilgrimage and holiday bookings",
    what: "Fake websites and social media pages sell helicopter rides to Kedarnath, hotel rooms and taxis. After you pay, there is no booking and the numbers stop answering.",
    redFlags: ["Sponsored search or social media ads", "Payment to a personal UPI ID", "No confirmation after paying"],
    doThis: "I4C advises booking only through official portals, such as heliyatra.irctc.co.in for Kedarnath helicopter rides, and reporting fraud at cybercrime.gov.in or 1930.",
    source: { label: "Angel One, on the I4C advisory, 21 Apr 2025", url: "https://www.angelone.in/news/market-updates/online-booking-frauds-targeting-pilgrims-and-tourists-i4c-issues-advisory" },
  },
];

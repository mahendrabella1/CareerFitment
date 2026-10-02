/**
 * Scam Shield content - Phase 1 modes: "Swipe: Safe or Scam" and "Family
 * Guard" (per the Money Life PDF's own Phase 1 scope). `isScam`/`lesson`
 * are server-only, same discipline as the Startups quiz bank - a Server
 * Component strips them before any client component ever sees this file,
 * and grading happens via a POST route that re-reads this file server-side.
 */

export interface ScamItem {
  id: string;
  mode: "swipe" | "family";
  channel: "SMS" | "WhatsApp" | "Call" | "Email" | "App";
  text: string;
  isScam: boolean;
  lesson: string;
}

export const SCAM_ITEMS: ScamItem[] = [
  {
    id: "s1", mode: "swipe", channel: "SMS",
    text: "Dear customer, your electricity connection will be DISCONNECTED tonight at 9:30 PM due to unpaid bill. Contact our officer immediately: +91-98XXXXXXXX",
    isScam: true,
    lesson: "Real utility companies don't threaten same-night disconnection by SMS with a personal number to call. Use the official app or website instead.",
  },
  {
    id: "s2", mode: "swipe", channel: "App",
    text: "Payment request: Rahul Sharma is requesting ₹1 from you via UPI collect. Approve with your UPI PIN to receive ₹5,000 cashback.",
    isScam: true,
    lesson: "You NEVER enter your UPI PIN to receive money - a PIN is only for SENDING money. A \"collect request\" disguised as receiving cash is a classic scam.",
  },
  {
    id: "s3", mode: "swipe", channel: "Call",
    text: "\"Hello, I'm calling from your bank's security team. We've noticed suspicious activity. To stop it, please tell me the OTP you just received.\"",
    isScam: true,
    lesson: "Banks never ask for your OTP, PIN or CVV over a call. Hang up and call your bank's official number yourself if you're worried.",
  },
  {
    id: "s4", mode: "swipe", channel: "WhatsApp",
    text: "🚀 Join our VIP trading group! Members are doubling their investment in 30 days, guaranteed. Limited slots, join now before it closes!",
    isScam: true,
    lesson: "Guaranteed high returns in a short time, plus pressure to \"join now,\" are the two biggest investment-scam red flags.",
  },
  {
    id: "s5", mode: "swipe", channel: "SMS",
    text: "Your order #48291 from Amazon.in has been shipped and will arrive by Thursday. Track: amazon.in/track/48291",
    isScam: false,
    lesson: "A generic shipping update with no urgency, no link to click for \"verification,\" and no request for personal info - this one's safe.",
  },
  {
    id: "s6", mode: "swipe", channel: "SMS",
    text: "URGENT: Your KYC will expire today. Update immediately or your account will be permanently blocked: bit.ly/kyc-update-24",
    isScam: true,
    lesson: "Urgency + a shortened/unofficial link is a classic fake-KYC scam. Always go to your bank's official app, never a link from an SMS.",
  },
  {
    id: "s7", mode: "swipe", channel: "App",
    text: "Congratulations! Complete 5 simple tasks (like our videos) and earn ₹500 per day. Small registration fee of ₹49 required to activate your account.",
    isScam: true,
    lesson: "Any \"job\" that asks YOU to pay a fee before you can start earning is a scam - real jobs pay you, they don't charge you to begin.",
  },
  {
    id: "s8", mode: "swipe", channel: "Call",
    text: "\"This is the Cyber Crime Cell. A parcel with illegal items was found under your name. To avoid arrest, stay on this video call and transfer the fine immediately.\"",
    isScam: true,
    lesson: "This is a \"digital arrest\" scam. Real police and government agencies never arrest or demand money over a phone or video call.",
  },
  {
    id: "s9", mode: "swipe", channel: "SMS",
    text: "Reminder: your dentist appointment with Dr. Mehta is tomorrow at 4:00 PM. Reply CANCEL to reschedule.",
    isScam: false,
    lesson: "A plain appointment reminder with no money, links or urgency involved - nothing to worry about here.",
  },
  {
    id: "s10", mode: "swipe", channel: "WhatsApp",
    text: "Hi, this is a message from a friend's hacked account: \"I'm stuck abroad and need ₹15,000 urgently, can you send it to this new number? Will explain later.\"",
    isScam: true,
    lesson: "An unusual, urgent money request - especially from a \"new number\" - even from someone you know is a huge red flag. Call them directly to confirm first.",
  },
  {
    id: "s11", mode: "swipe", channel: "Email",
    text: "Your monthly statement from HDFC Bank is ready to view in NetBanking. Log in at the usual website to download it.",
    isScam: false,
    lesson: "No link to click, no urgency, directs you to log in the normal way yourself - this is how a real bank communicates.",
  },
  {
    id: "s12", mode: "swipe", channel: "Call",
    text: "\"Hi, I'm a technician from your internet provider. There's an issue with your connection - please install this screen-sharing app so I can fix it remotely.\"",
    isScam: true,
    lesson: "Never install a screen-sharing app because a caller asks, even if they sound official - this gives them full access to your banking apps.",
  },
  {
    id: "s13", mode: "swipe", channel: "App",
    text: "🎮 Get FREE diamonds and skins! Just share this game's OTP sent to your parent's phone to unlock the reward instantly.",
    isScam: true,
    lesson: "A game asking for an OTP sent to someone else's phone is a scam aimed at kids - that OTP is almost certainly for a real payment, not a game reward.",
  },
  {
    id: "s14", mode: "swipe", channel: "SMS",
    text: "Your Swiggy order has been delivered. Rate your experience and give feedback in the app.",
    isScam: false,
    lesson: "A standard post-delivery notification - no links to suspicious sites, no request for sensitive information.",
  },
  {
    id: "s15", mode: "swipe", channel: "Call",
    text: "\"Sir/Ma'am, I'm calling from the RBI Sachet team. We found your name linked to an illegal deposit scheme. Pay a ₹5,000 verification fee to clear your name.\"",
    isScam: true,
    lesson: "Government bodies don't call asking for a \"verification fee\" to clear your name - this mimics RBI's real Sachet portal to sound official. Check directly on sachet.rbi.org.in instead.",
  },
];

export const FAMILY_GUARD_ITEMS: ScamItem[] = [
  {
    id: "f1", mode: "family", channel: "SMS",
    text: "Dadi, you received this message: \"CONGRATULATIONS! You have won ₹25,00,000 in the KBC Lucky Draw! To claim, send your bank details and a processing fee of ₹2,000.\" What do you tell her?",
    isScam: true,
    lesson: "No real lottery asks for an upfront \"processing fee\" or your bank details by SMS. Tell Dadi to never reply, and to show you or another trusted family member any message like this.",
  },
  {
    id: "f2", mode: "family", channel: "Call",
    text: "Nana gets a call: \"This is your grandson, I'm in trouble and need ₹20,000 right now, please don't tell anyone, just transfer it to this account.\" The voice sounds a bit different. What do you tell him?",
    isScam: true,
    lesson: "\"Don't tell anyone\" plus urgency is the core trick. Tell Nana to hang up and call the grandchild's own number directly to check - real emergencies survive a 2-minute phone call to confirm.",
  },
  {
    id: "f3", mode: "family", channel: "WhatsApp",
    text: "Your uncle forwards a message: \"Government is giving ₹10,000 to every citizen, apply here before the scheme closes: bit.ly/govt-scheme-apply.\" Is this safe to click?",
    isScam: true,
    lesson: "Real government schemes are announced on official .gov.in sites, not shortened links forwarded on WhatsApp. Suggest checking mygov.in directly instead of clicking.",
  },
];

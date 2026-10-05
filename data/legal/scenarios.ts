export type ScenarioAge = "Class 6 to 8" | "Class 9 to 12" | "College" | "Working" | "60 and over" | "Everyone";

export interface ScenarioChoice {
  text: string;
  best: boolean;
  why: string;
}

export interface LegalScenario {
  id: string;
  age: ScenarioAge;
  situation: string;
  choices: ScenarioChoice[];
  bestResponse: string;
  guideSlug?: string;
  helpSlugs: string[];
}

export const LEGAL_SCENARIOS: LegalScenario[] = [
  {
    id: "group-chat-mean",
    age: "Class 6 to 8",
    situation: "A classmate keeps posting mean comments about you in a group chat.",
    choices: [
      { text: "Reply with an angry message to defend yourself", best: false, why: "An angry reply can escalate things, and it can be screenshotted and used against you." },
      { text: "Take screenshots, tell a parent or teacher, and use the block and report buttons", best: true, why: "This keeps evidence and brings a trusted adult in, which is the safest order of steps." },
      { text: "Ignore it and hope it stops", best: false, why: "Bullying often continues when nobody reports it, and you are left carrying it alone." },
    ],
    bestResponse: "Do not reply angrily. Take screenshots, tell a parent or teacher, and use the block and report buttons.",
    guideSlug: "cyberbullying",
    helpSlugs: ["child"],
  },
  {
    id: "special-secret",
    age: "Class 6 to 8",
    situation: "An adult you know asks you to keep a 'special secret' from your parents.",
    choices: [
      { text: "Keep the secret, because the adult is someone you trust", best: false, why: "Safe adults do not ask children to keep secrets from their parents. Keeping it can leave you at risk." },
      { text: "Tell a trusted adult, or call 1098 for help", best: true, why: "Telling a trusted adult or calling 1098 gets help quickly. You are never to blame for what an adult does." },
      { text: "Agree to keep it for now and decide later", best: false, why: "Waiting gives the problem time to grow. Tell someone you trust now." },
    ],
    bestResponse: "Safe adults don't ask children to keep secrets from parents. Tell a trusted adult or call 1098.",
    guideSlug: "safe-unsafe-touch",
    helpSlugs: ["child"],
  },
  {
    id: "coaching-seniors",
    age: "Class 9 to 12",
    situation: "Seniors at a coaching centre force juniors to do embarrassing tasks.",
    choices: [
      { text: "Do the tasks to avoid trouble", best: false, why: "Going along with it keeps the behaviour going and can leave you feeling trapped." },
      { text: "Report it to the centre and tell your parents. In college, ragging is banned and has a national helpline", best: true, why: "Reporting to the centre and to your parents gets adults involved. Ragging is banned in colleges too." },
      { text: "Post about it on social media to shame them", best: false, why: "Public shaming can cause further harm and can backfire, and it does not get the behaviour stopped." },
    ],
    bestResponse: "It's not okay. Report it to the centre and tell your parents. In college, ragging is banned and has a national helpline.",
    guideSlug: "ragging",
    helpSlugs: ["child", "ragging"],
  },
  {
    id: "no-exchange-sign",
    age: "College",
    situation: "A shop refuses to replace a phone that broke within a week, pointing to a 'no exchange' sign.",
    choices: [
      { text: "Accept the decision, because the sign says no exchange", best: false, why: "A 'no exchange' sign does not remove your rights when a product is defective." },
      { text: "Ask in writing for a repair, replacement or refund. If they refuse, call the National Consumer Helpline on 1915", best: true, why: "A written request creates a record, and the helpline often settles complaints with the company." },
      { text: "Post a bad review and leave it there", best: false, why: "A review does not get your phone fixed or your money back. The consumer route does." },
    ],
    bestResponse: "Ask in writing, call 1915, and you can file a consumer complaint.",
    guideSlug: "faulty-product",
    helpSlugs: ["consumer"],
  },
  {
    id: "unpaid-internship-hours",
    age: "College",
    situation: "Your internship offer says unpaid, but they want 60 hours a week.",
    choices: [
      { text: "Work the hours to prove yourself", best: false, why: "Unpaid overwork can hurt your health and studies, and it sets a bad precedent for future terms." },
      { text: "Ask for written terms, learn the rules on working hours, and talk to the college placement cell", best: true, why: "Written terms make the arrangement clear, and the placement cell can help you negotiate." },
      { text: "Quit without telling anyone", best: false, why: "Leaving silently closes off options. A written conversation with the placement cell keeps them open." },
    ],
    bestResponse: "Ask for written terms, know the law on working hours, and talk to the college placement cell.",
    guideSlug: "internships-gig-work",
    helpSlugs: ["legal-aid"],
  },
  {
    id: "salary-unpaid",
    age: "Working",
    situation: "Your salary hasn't come for two months.",
    choices: [
      { text: "Wait another month quietly", best: false, why: "Waiting without a record makes a claim harder later." },
      { text: "Ask in writing, keep proof of your work and any messages, then go to the labour department", best: true, why: "A written request and a paper trail are what the labour department needs to act." },
      { text: "Stop coming to work until you are paid", best: false, why: "Stopping work can put your job and your claim at risk. Use the written route first." },
    ],
    bestResponse: "Ask in writing, keep proof, then go to the labour department.",
    guideSlug: "unpaid-salary",
    helpSlugs: ["legal-aid"],
  },
  {
    id: "loan-app-threats",
    age: "Working",
    situation: "A loan app's agents call your relatives and threaten you.",
    choices: [
      { text: "Pay quickly to make the calls stop", best: false, why: "Paying under pressure does not end the harassment and can encourage more demands." },
      { text: "Do not pay under pressure. Complain to the lender and the RBI Integrated Ombudsman, and report threats to the police or on cybercrime.gov.in", best: true, why: "Complaints to the lender and the RBI ombudsman create an official record, and threats are a crime to report to the police." },
      { text: "Reply to the threats in the same tone", best: false, why: "Replying in kind can make you the one in trouble, and it does not stop the threats." },
    ],
    bestResponse: "Don't pay under pressure. Complain to the lender and the RBI ombudsman, and report threats to police or cybercrime.",
    guideSlug: "loan-recovery",
    helpSlugs: ["cyber-fraud", "rbi"],
  },
  {
    id: "property-papers",
    age: "60 and over",
    situation: "A relative asks you to sign property papers 'just as a formality'.",
    choices: [
      { text: "Sign to keep the peace", best: false, why: "Signing documents you do not understand can have lasting consequences for your property." },
      { text: "Do not sign what you do not understand. Get independent advice, and call Elderline 14567 for guidance", best: true, why: "Independent advice protects you, and Elderline offers guidance for senior citizens." },
      { text: "Sign now and check it later", best: false, why: "Once signed, a document can be hard to undo. Check first, then sign." },
    ],
    bestResponse: "Don't sign what you don't understand. Get independent advice, and call Elderline 14567.",
    guideSlug: "senior-citizens",
    helpSlugs: ["senior"],
  },
  {
    id: "police-phone-check",
    age: "Everyone",
    situation: "Police at a checkpoint ask for your phone to look through it.",
    choices: [
      { text: "Refuse angrily and argue with the officer", best: false, why: "An argument can escalate the situation. Staying calm protects you better." },
      { text: "Stay calm and polite, ask what the legal basis is, and note the officer's details", best: true, why: "Asking the legal basis and noting details keeps the encounter calm and gives you a record." },
      { text: "Hand over the phone and unlock it without asking anything", best: false, why: "Asking what the request is based on is your right before you agree to anything." },
    ],
    bestResponse: "Stay calm and polite. Ask what the legal basis is.",
    guideSlug: "police-rights",
    helpSlugs: ["emergency"],
  },
];

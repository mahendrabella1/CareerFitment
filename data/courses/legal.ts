import type { CourseContent, LessonContent, ModuleContent } from "@/lib/course/types";
import { LEGAL_AREAS, LEGAL_GUIDES, type LegalGuide } from "@/data/legal/guides";
import { HELP_CONTACTS } from "@/data/legal/helpContacts";
import { LETTER_TEMPLATES } from "@/lib/legal/templates";

const AREA_SUMMARIES: Record<string, string> = {
  "School and childhood": "Education, bullying, abuse, ragging, child labour and child marriage. Written so a student can follow them.",
  "Online and digital life": "Cyberbullying, scams, your personal data, and photos used without consent.",
  "Money, shopping and housing": "Faulty products, bank problems, loan harassment and renting a home.",
  Work: "Your first job, harassment at work, unpaid salary, and internship, freelance and gig work.",
  "Family, home and personal safety": "Domestic violence, safety in public, senior citizens and disability rights.",
  "Police, courts and government": "Your rights with the police, RTI, and free legal aid.",
};

const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

const helpName = (slug: string) => HELP_CONTACTS.find((c) => c.slug === slug)?.name ?? slug;

function guideLesson(g: LegalGuide): LessonContent {
  const helpers = g.helpSlugs.map(helpName).filter(Boolean);
  const body: string[] = [
    ...g.rights.map((r) => `Your right: ${r}`),
    `Keep this evidence: ${g.evidence.join("; ")}.`,
  ];
  if (helpers.length) body.push(`Who can help: ${helpers.join("; ")}.`);
  if (g.supportNote) body.push(g.supportNote);
  body.push(`Law: ${g.legalDetail.law} Drafted on ${g.draftedOn} and not yet reviewed by a lawyer; confirm with a qualified lawyer before relying on it.`);

  const tool = g.toolSlugs.find((slug) => LETTER_TEMPLATES.some((t) => t.slug === slug));
  return {
    id: `guide-${g.slug}`,
    title: `${g.number}. ${g.title}`,
    minutes: 6,
    summary: g.oneLine,
    body,
    points: g.firstSteps,
    tool: tool ? { href: `/account/legal/tools/${tool}`, label: "Open the ready-made draft" } : { href: `/account/legal/guides/${g.slug}`, label: "Open the full guide" },
  };
}

const guideModules: ModuleContent[] = (() => {
  const known = new Set<string>(LEGAL_AREAS);
  const extra = LEGAL_GUIDES.map((g) => g.area).filter((a) => !known.has(a));
  const order = [...LEGAL_AREAS, ...Array.from(new Set(extra))];
  return order
    .map((area) => ({ area, guides: LEGAL_GUIDES.filter((g) => g.area === area).sort((a, b) => a.number - b.number) }))
    .filter((x) => x.guides.length > 0)
    .map(({ area, guides }) => ({
      id: `area-${slugify(area)}`,
      title: area,
      summary: AREA_SUMMARIES[area] ?? "Plain-language guides. Each one starts with what to do first and ends with the law behind it.",
      lessons: guides.map(guideLesson),
    }));
})();

export const LEGAL_COURSE: CourseContent = {
  key: "legal",
  accent: "#6366f1",
  kicker: "Legal Resources and Rights",
  title: "Know your rights, and know what to do first",
  subtitle:
    "Situation-first help. Answer a few questions and get the right guide, the steps to take now, the helpline to call, and a ready-to-send letter. The guides are drafts until a practising lawyer signs them off.",
  outcomes: [
    "Know which emergency numbers to call, and in which order",
    "Find the guide for your situation in about three taps",
    "Know what evidence to keep before you complain",
    "Send a clear, polite letter or complaint that you wrote with the tool's help",
  ],
  modules: [
    {
      id: "start-here",
      title: "Start here",
      summary: "Safety first. Numbers, the navigator, and how this section keeps your answers private.",
      lessons: [
        {
          id: "in-danger",
          title: "Are you in danger right now?",
          minutes: 3,
          summary: "If yes, call 112 first. Everything else can wait.",
          body: [
            "If anyone is in immediate danger, call 112 now. It is the national number for police, fire and ambulance. Do not read further until you have made the call or reached a safe place.",
            "The SOS bar at the top of this section shows the most important numbers on every page. Quick exit at the top right takes you away from this page at once.",
          ],
          points: ["Call 112 for any emergency", "Use Quick exit if you need to leave this page quickly"],
          tool: { href: "/account/legal", label: "Open the situation navigator" },
        },
        {
          id: "emergency-numbers",
          title: "Your emergency and help numbers",
          minutes: 5,
          summary: "The helplines in this section, what each one is for, and their hours.",
          body: HELP_CONTACTS.map((c) =>
            c.number ? `${c.name}: ${c.number}${c.hours ? ` (${c.hours})` : ""}. ${c.note}` : `${c.name} (online portal): ${c.url}. ${c.note}`,
          ),
          points: ["Every number and portal here is an official, government-run service", "If a number does not connect, call 112"],
          tool: { href: "/account/legal/help", label: "Open the help directory" },
        },
        {
          id: "how-navigator-works",
          title: "How the navigator works, and what it keeps",
          minutes: 4,
          summary: "Your answers pick the guide. They are not saved unless you bookmark a guide.",
          body: [
            "The navigator asks one safety question first, then a few short questions about the situation. Your answers are used only to pick the right guide.",
            "Your problem, letters and evidence checklists stay on your device. Only the guides you bookmark and the scenario cards you complete can be saved to your profile.",
          ],
          points: ["Answers are used only to choose a guide", "Letters and checklists stay on your device"],
          tool: { href: "/account/legal", label: "Try the navigator" },
        },
      ],
    },
    ...guideModules,
    {
      id: "action-tools",
      title: "Action tools",
      summary: "Ready-made letters and complaints, built from your answers. You review and send them yourself.",
      lessons: LETTER_TEMPLATES.map((t) => ({
        id: `tool-${t.slug}`,
        title: t.name,
        minutes: 5,
        summary: "A polite draft built from your answers. Review it before you send it.",
        body: [
          "Answer the questions. The letter is built in your browser and nothing is sent for you.",
          "Review every draft before you send it, keep a copy, and send it through the channel the guide recommends.",
        ],
        points: t.fields.map((f) => f.label),
        tool: { href: `/account/legal/tools/${t.slug}`, label: "Open this tool" },
      })),
    },
    {
      id: "stay-private",
      title: "Stay private on a shared device",
      summary: "Quick exit, private browsing and what to clear afterwards.",
      lessons: [
        {
          id: "private-browsing",
          title: "Quick exit and private browsing",
          minutes: 4,
          summary: "Quick exit leaves the page, but earlier pages stay in your browser history.",
          body: [
            "Quick exit takes you to a neutral site straight away and removes this page from the back button. Earlier pages can still appear in your browser history.",
            "On a shared phone, open sensitive guides in a private or incognito window, and clear history afterwards if you need to. Sensitive guides never send notifications.",
          ],
          points: ["Use a private window for sensitive guides", "Clear history on a shared device afterwards"],
        },
      ],
    },
  ],
};

/**
 * Automated voice calls to parents, in their language. The templates are
 * filled per student; the call reads them with a text-to-speech voice.
 * (Translations should be reviewed by a native speaker before wide use.)
 */
import type { StudentRow } from "@/lib/institution/types";

export type VoiceLang = "en" | "hi" | "te";
export type VoiceTemplate = "assessment" | "monthly" | "custom";

export const VOICE_LANGS: { key: VoiceLang; label: string; ttsLang: string; voice: string }[] = [
  { key: "en", label: "English", ttsLang: "en-IN", voice: "Google.en-IN-Standard-A" },
  { key: "hi", label: "हिन्दी (Hindi)", ttsLang: "hi-IN", voice: "Google.hi-IN-Standard-A" },
  { key: "te", label: "తెలుగు (Telugu)", ttsLang: "te-IN", voice: "Google.te-IN-Standard-A" },
];

const T = {
  assessment: {
    en: "Hello. This is {school}. Your child {child} has not yet completed the career assessment on OneGrasp. Please encourage {child} to complete it this week. Thank you.",
    hi: "नमस्ते। यह {school} से संदेश है। आपके बच्चे {child} ने अभी तक OneGrasp पर करियर मूल्यांकन पूरा नहीं किया है। कृपया {child} को इस सप्ताह इसे पूरा करने के लिए प्रोत्साहित करें। धन्यवाद।",
    te: "నమస్కారం. ఇది {school} నుండి సందేశం. మీ పిల్లలు {child} ఇంకా OneGrasp లో కెరీర్ అసెస్‌మెంట్ పూర్తి చేయలేదు. దయచేసి ఈ వారం దాన్ని పూర్తి చేయమని {child} ని ప్రోత్సహించండి. ధన్యవాదాలు.",
  },
  monthly: {
    en: "Hello. This is {school}. This month, {child} spent {minutes} minutes on OneGrasp career guidance. {status} Please talk with {child} about the next step. Thank you.",
    hi: "नमस्ते। यह {school} से संदेश है। इस महीने {child} ने OneGrasp करियर मार्गदर्शन पर {minutes} मिनट बिताए। {status} कृपया {child} से अगले कदम के बारे में बात करें। धन्यवाद।",
    te: "నమస్కారం. ఇది {school} నుండి సందేశం. ఈ నెల {child} OneGrasp కెరీర్ మార్గదర్శకత్వంపై {minutes} నిమిషాలు గడిపారు. {status} దయచేసి {child} తో తదుపరి అడుగు గురించి మాట్లాడండి. ధన్యవాదాలు.",
  },
};

const STATUS = {
  done: { en: "The career assessment is complete.", hi: "करियर मूल्यांकन पूरा हो गया है।", te: "కెరీర్ అసెస్‌మెంట్ పూర్తయింది." },
  pending: { en: "The career assessment is not complete yet.", hi: "करियर मूल्यांकन अभी पूरा नहीं हुआ है।", te: "కెరీర్ అసెస్‌మెంట్ ఇంకా పూర్తి కాలేదు." },
};

export const VOICE_TEMPLATES: { key: VoiceTemplate; label: string }[] = [
  { key: "assessment", label: "Assessment reminder" },
  { key: "monthly", label: "Monthly progress update" },
  { key: "custom", label: "My own message" },
];

/** The words the call will speak for one student. */
export function voiceScript(template: VoiceTemplate, lang: VoiceLang, row: StudentRow, school: string, minutesThisMonth: number, custom = ""): string {
  const child = row.name.split(" ")[0] || row.name;
  const text = template === "custom" ? custom : T[template][lang];
  return text
    .replace(/\{school\}/g, school)
    .replace(/\{child\}/g, child)
    .replace(/\{minutes\}/g, String(minutesThisMonth))
    .replace(/\{status\}/g, STATUS[row.assessment.status === "completed" ? "done" : "pending"][lang]);
}

/** +91 for a plain 10-digit Indian mobile number; E.164 otherwise. */
export function toE164(phone: string): string | null {
  const d = phone.replace(/[^\d+]/g, "");
  if (/^\+\d{10,15}$/.test(d)) return d;
  if (/^\d{10}$/.test(d)) return `+91${d}`;
  if (/^0\d{10}$/.test(d)) return `+91${d.slice(1)}`;
  if (/^91\d{10}$/.test(d)) return `+${d}`;
  return null;
}

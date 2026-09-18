import React, { useMemo } from "react";
import type { AssessmentSummary } from "@/lib/auth/AuthProvider";
import { C, MBTICompass, type MBTIAxis } from "./viz";
import {
  Compass,
  Lightbulb,
  Target,
  Heart,
  Users,
} from "lucide-react";

interface PersonalityMBTIProps {
  a: AssessmentSummary;
}

const MBTI_TYPES: Record<
  string,
  { type: string; description: string; careers: string[]; strengths: string[] }
> = {
  ISTJ: { type: "The Logistician", description: "Practical, fact-oriented, reliable, and dependable. Excellent at organizing and implementing plans.", careers: ["Accountant", "Project Manager", "Military Officer", "Software Developer"], strengths: ["Detail-oriented", "Organized", "Responsible", "Practical"] },
  ISFJ: { type: "The Defender", description: "Warm, caring, and devoted. Natural at creating harmony and supporting others.", careers: ["Teacher", "Nurse", "Social Worker", "HR Professional"], strengths: ["Compassionate", "Loyal", "Dedicated", "Organized"] },
  INFJ: { type: "The Advocate", description: "Idealistic visionary with strong insight into people. Driven to create positive change.", careers: ["Counselor", "Writer", "Activist", "Mentor"], strengths: ["Insightful", "Passionate", "Creative", "Principled"] },
  INTJ: { type: "The Architect", description: "Strategic, innovative, and independent. Natural leader with a clear vision for the future.", careers: ["Engineer", "Entrepreneur", "Analyst", "Computer Scientist"], strengths: ["Strategic", "Independent", "Innovative", "Analytical"] },
  ISTP: { type: "The Virtuoso", description: "Practical problem-solver with strong technical skills and hands-on approach.", careers: ["Mechanic", "Engineer", "Technician", "Data Analyst"], strengths: ["Technical", "Logical", "Pragmatic", "Adaptable"] },
  ISFP: { type: "The Adventurer", description: "Artistic, sensitive, and spontaneous. Values personal expression and authentic experiences.", careers: ["Designer", "Artist", "Chef", "Photographer"], strengths: ["Creative", "Sensitive", "Spontaneous", "Flexible"] },
  INFP: { type: "The Mediator", description: "Idealistic, creative, and empathetic. Seeks meaning and authenticity in life and work.", careers: ["Psychologist", "Journalist", "Counselor", "Content Creator"], strengths: ["Empathetic", "Creative", "Authentic", "Passionate"] },
  INTP: { type: "The Logician", description: "Curious, analytical, and original. Enjoys exploring complex ideas and theories.", careers: ["Scientist", "Mathematician", "Programmer", "Researcher"], strengths: ["Analytical", "Creative", "Curious", "Independent"] },
  ESTP: { type: "The Entrepreneur", description: "Energetic, bold, and practical. Thrives in action and loves new challenges.", careers: ["Salesman", "Entrepreneur", "Emergency Responder", "Coach"], strengths: ["Bold", "Pragmatic", "Energetic", "Persuasive"] },
  ESFP: { type: "The Entertainer", description: "Spontaneous, sociable, and enthusiastic. Brings energy and fun to every situation.", careers: ["Performer", "Sales Manager", "Event Planner", "Sports Coach"], strengths: ["Sociable", "Spontaneous", "Enthusiastic", "Fun-loving"] },
  ENFP: { type: "The Campaigner", description: "Enthusiastic, creative, and people-focused. Natural communicator with infectious energy.", careers: ["Marketing Manager", "Teacher", "Performer", "Entrepreneur"], strengths: ["Charismatic", "Creative", "Enthusiastic", "Social"] },
  ENTP: { type: "The Debater", description: "Intellectual, innovative, and argumentative. Loves debate and exploring new possibilities.", careers: ["Lawyer", "Entrepreneur", "Inventor", "Consultant"], strengths: ["Innovative", "Intellectual", "Resourceful", "Quick-witted"] },
  ESTJ: { type: "The Executive", description: "Practical leader with strong organizational skills and efficient approach.", careers: ["Manager", "Executive", "Military Officer", "Administrator"], strengths: ["Organized", "Efficient", "Decisive", "Responsible"] },
  ESFJ: { type: "The Consul", description: "Supportive, conscientious, and sociable. Dedicated to helping others and creating harmony.", careers: ["Event Coordinator", "Administrator", "Counselor", "Healthcare Worker"], strengths: ["Supportive", "Cooperative", "Organized", "Loyal"] },
  ENFJ: { type: "The Protagonist", description: "Charismatic leader and mentor. Passionate about inspiring and helping others grow.", careers: ["Counselor", "Teacher", "Manager", "Religious Leader"], strengths: ["Charismatic", "Inspiring", "Empathetic", "Organized"] },
  ENTJ: { type: "The Commander", description: "Natural leader with strategic vision. Decisive and driven to accomplish goals.", careers: ["Executive", "Entrepreneur", "Lawyer", "Military Officer"], strengths: ["Strategic", "Leadership", "Decisive", "Ambitious"] },
};

const AxisRow: React.FC<{ label: string; left: string; right: string; score: number; icon: React.ReactNode; color: string }> = ({ label, left, right, score, icon, color }) => {
  const rightWins = score >= 5;
  const winnerScore = rightWins ? score : 10 - score;
  // The knob sits at the RAW score position on the fixed left-pole(0%) →
  // right-pole(100%) axis — never reordered — so "57% Extrovert" means the
  // knob genuinely sits 57% of the way from Introvert to Extrovert, not an
  // abstract winner-only number. The gradient's solid end tracks whichever
  // side actually won, so the visually "full" half always matches the bold/
  // underlined label instead of always being anchored to one fixed side.
  const knobPct = Math.round((score / 10) * 100);
  return (
    <div style={{ marginBottom: 26 }}>
      {/* Leads with the axis itself ("Energy source · 60%"), not the winning
          pole name — the two poles are already labelled on the bar right
          below, so naming the axis here (instead of repeating one of them)
          is what actually tells you which of the four axes this is. */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 7, marginBottom: 10 }}>
        <span style={{ display: "flex", color }}>{icon}</span>
        <span style={{ fontSize: 15, fontWeight: 800, color: C.ink2 }}>{label}</span>
        <span style={{ fontSize: 17, fontWeight: 900, color }}>· {Math.round(winnerScore * 10)}%</span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <span style={{
          fontSize: 12.5, width: 78, flex: "none",
          fontWeight: rightWins ? 600 : 800, color: rightWins ? C.muted : C.ink,
          textDecoration: rightWins ? "none" : "underline", textUnderlineOffset: 3,
        }}>{left}</span>
        <div style={{ position: "relative", flex: 1, height: 12 }}>
          <div style={{
            position: "absolute", inset: 0, borderRadius: 999,
            background: rightWins ? `linear-gradient(90deg, ${color}30, ${color})` : `linear-gradient(90deg, ${color}, ${color}30)`,
          }} />
          <div style={{
            position: "absolute", top: "50%", left: `${knobPct}%`, transform: "translate(-50%, -50%)",
            width: 24, height: 24, borderRadius: "50%", background: "#fff",
            border: `4px solid ${color}`, boxShadow: "0 2px 6px rgba(20,20,23,.25)",
          }} />
        </div>
        <span style={{
          fontSize: 12.5, width: 78, textAlign: "right", flex: "none",
          fontWeight: rightWins ? 800 : 600, color: rightWins ? C.ink : C.muted,
          textDecoration: rightWins ? "underline" : "none", textUnderlineOffset: 3,
        }}>{right}</span>
      </div>
    </div>
  );
};

/** Same E/I·S/N·T/F·J/P → 4-letter code the component itself derives, exposed
 *  so the report's hero ring/result chip (rendered by the parent, above this
 *  component) can show the real type instead of the older Big-Five result. */
export function getMBTIType(a: AssessmentSummary): string {
  const ei = (a as any).mbtiEI ?? 5, sn = (a as any).mbtiSN ?? 5, tf = (a as any).mbtiTF ?? 5, jp = (a as any).mbtiJP ?? 5;
  return (ei >= 5 ? "E" : "I") + (sn >= 5 ? "S" : "N") + (tf >= 5 ? "T" : "F") + (jp >= 5 ? "J" : "P");
}

export const PersonalityMBTI: React.FC<PersonalityMBTIProps> = ({ a }) => {
  const scores = useMemo(() => {
    const eiScore = (a as any).mbtiEI ?? 5;
    const snScore = (a as any).mbtiSN ?? 5;
    const tfScore = (a as any).mbtiTF ?? 5;
    const jpScore = (a as any).mbtiJP ?? 5;
    return { ei: eiScore, sn: snScore, tf: tfScore, jp: jpScore };
  }, [a]);

  const mbtiType = useMemo(() => getMBTIType(a), [a]);

  const typeInfo = MBTI_TYPES[mbtiType] || MBTI_TYPES.INFP;

  const axes: MBTIAxis[] = [
    { key: "ei", angle: 0, posLetter: "E", posLabel: "Extraversion", negLetter: "I", negLabel: "Introversion", score: scores.ei },
    { key: "sn", angle: 90, posLetter: "S", posLabel: "Sensing", negLetter: "N", negLabel: "Intuition", score: scores.sn },
    { key: "tf", angle: 45, posLetter: "T", posLabel: "Thinking", negLetter: "F", negLabel: "Feeling", score: scores.tf },
    { key: "jp", angle: 135, posLetter: "J", posLabel: "Judging", negLetter: "P", negLabel: "Perceiving", score: scores.jp },
  ];

  // Which letter each axis actually contributed to the 4-letter code, and by
  // how much — this is what turns "ENFP" from a label into something explained.
  const winners = axes.map((ax) => {
    const posWins = ax.score >= 5;
    return {
      key: ax.key,
      letter: posWins ? ax.posLetter : ax.negLetter, label: posWins ? ax.posLabel : ax.negLabel,
      score: posWins ? ax.score : 10 - ax.score,
    };
  });

  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "232px 1fr", gap: 28, alignItems: "center", background: C.redTint, border: `2px solid ${C.redLine}`, borderRadius: 16, padding: 26, marginBottom: 10 }}>
        <MBTICompass axes={axes} centerLabel={mbtiType} />
        <div>
          <div style={{ fontSize: 44, fontWeight: 900, color: C.redStrong, letterSpacing: "-0.02em", lineHeight: 1 }}>{mbtiType}</div>
          <div style={{ fontSize: 19, fontWeight: 800, color: C.ink, marginTop: 6 }}>{typeInfo.type}</div>
          <p style={{ fontSize: 13, lineHeight: 1.6, color: C.ink2, marginTop: 8 }}>{typeInfo.description}</p>
          <div style={{ display: "flex", gap: 8, marginTop: 14, flexWrap: "wrap" }}>
            {winners.map((w, i) => (
              <div key={w.key} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ background: "#fff", border: `1px solid ${C.redLine}`, borderRadius: 10, padding: "6px 11px", textAlign: "center", minWidth: 54 }}>
                  <div style={{ fontSize: 18, fontWeight: 900, color: C.redStrong, lineHeight: 1 }}>{w.letter}</div>
                  <div style={{ fontSize: 9, fontWeight: 700, color: C.ink3, marginTop: 2 }}>{w.label}</div>
                  <div style={{ fontSize: 9, fontWeight: 700, color: C.red, marginTop: 1 }}>{w.score.toFixed(1)}/10</div>
                </div>
                {i < winners.length - 1 ? <span style={{ color: C.faint, fontWeight: 800 }}>+</span> : null}
              </div>
            ))}
          </div>
        </div>
      </div>
      <p className="dimlede" style={{ marginTop: 0, marginBottom: 22 }}>
        That's how <b>{mbtiType}</b> was worked out: each of the four letters comes from an independent question — which side of that scale you picked more often. A score near 5.0/10 means you sit close to the middle and can flex either way; a score near 0 or 10 means a clear, consistent lean. Put the four winning letters together — {winners.map((w) => w.letter).join(" + ")} — and that spells {mbtiType}, {typeInfo.type.toLowerCase()}.
      </p>

      <div style={{ background: "#fff", border: `1px solid ${C.line}`, borderRadius: 14, padding: "20px 22px", marginBottom: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 9, fontSize: 15, fontWeight: 800, color: C.ink, marginBottom: 16 }}>
          <Compass size={18} color={C.red} /> Your personality dimensions
        </div>
        <AxisRow label="Energy source" left="Introversion" right="Extraversion" score={scores.ei} icon={<Users size={16} />} color="#2a9dc7" />
        <AxisRow label="Information intake" left="Intuition" right="Sensing" score={scores.sn} icon={<Lightbulb size={16} />} color="#eda100" />
        <AxisRow label="Decision making" left="Feeling" right="Thinking" score={scores.tf} icon={<Heart size={16} />} color="#1baf7a" />
        <AxisRow label="Lifestyle" left="Perceiving" right="Judging" score={scores.jp} icon={<Target size={16} />} color="#6b4e9e" />
      </div>

      <div className="twocard" style={{ marginTop: 0 }}>
        <div className="lc good">
          <h4>Where you’re strong</h4>
          <ul>
            <li>
              {mbtiType[1] === "N"
                ? "You naturally connect ideas and spot patterns and possibilities that others miss, rather than getting stuck on concrete details."
                : "You naturally notice concrete facts and details, and prefer practical, proven approaches over untested theories."}
            </li>
            <li>
              {mbtiType[2] === "T"
                ? "When you decide something, logic and consistency usually come first — you'd rather be right than smooth things over."
                : "When you decide something, how it affects people usually comes first — you weigh the human impact alongside the logic."}
            </li>
            <li>
              {mbtiType[0] === "E"
                ? "You learn best through interaction, discussion, and real-world application of concepts."
                : "You prefer reflective learning, reading, and having time to process information before discussing."}
            </li>
          </ul>
        </div>
        <div className="lc grow">
          <h4>Where you can grow</h4>
          <ul>
            <li>
              {mbtiType[1] === "N"
                ? "You're drawn to the big picture, so double-check the practical details and deadlines before committing to a plan — that's the part that's easiest for you to skip."
                : "You're drawn to concrete facts, so pause sometimes and ask what the bigger pattern is — that's the part that's easiest for you to skip."}
            </li>
            <li>
              {mbtiType[2] === "T"
                ? "Before delivering a decision, say out loud how it affects the people involved — you naturally lead with logic, so this step doesn't happen on its own."
                : "When a decision is unpopular but right, practise making it anyway — you naturally lead with people's feelings, so this is the harder call for you to make."}
            </li>
            <li>
              {mbtiType[3] === "J"
                ? "You're comfortable with structure, so a last-minute change can throw you — practise treating it as one more input, not a crisis."
                : "You're comfortable with flexibility, so fixed deadlines can sneak up on you — set yourself an earlier, private deadline so the real one never surprises you."}
            </li>
          </ul>
        </div>
      </div>

      <div className="recos">
        <div className="subhd">Recommended next steps</div>
        <ol>
          <li>
            {mbtiType[0] === "E"
              ? "Before your next big decision, spend 10 quiet minutes thinking it through alone before you discuss it with anyone — you default to thinking out loud, so this builds the other muscle."
              : "Share a half-formed idea with someone before you've fully worked it out — you default to thinking things through alone first, so this builds the other muscle."}
          </li>
          <li>
            {mbtiType[2] === "T"
              ? "Next time you give someone feedback, open with one honest thing that's working before the critique — it costs nothing and changes how it lands."
              : "Next time you face an unpopular but necessary call, write down the plain reasons for it first, then decide — it's easier to hold the line once it's on paper."}
          </li>
          <li>Ask two people who know you well whether {mbtiType} — {typeInfo.type.toLowerCase()} — actually sounds like you. Self-reports miss blind spots that people around you can see.</li>
        </ol>
      </div>
    </div>
  );
};

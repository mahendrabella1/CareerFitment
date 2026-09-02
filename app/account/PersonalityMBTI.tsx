import React, { useMemo } from "react";
import type { AssessmentSummary } from "@/lib/auth/AuthProvider";
import { Ring } from "./viz";
import {
  Zap,
  Brain,
  Heart,
  Compass,
  BookOpen,
  Users,
  Lightbulb,
  Target,
} from "lucide-react";

interface PersonalityMBTIProps {
  a: AssessmentSummary;
  sheetNum: string;
  name?: string;
}

const MBTI_TYPES: Record<
  string,
  {
    type: string;
    description: string;
    careers: string[];
    strengths: string[];
    color: string;
  }
> = {
  ISTJ: {
    type: "The Logistician",
    description:
      "Practical, fact-oriented, reliable, and dependable. Excellent at organizing and implementing plans.",
    careers: [
      "Accountant",
      "Project Manager",
      "Military Officer",
      "Software Developer",
    ],
    strengths: [
      "Detail-oriented",
      "Organized",
      "Responsible",
      "Practical",
    ],
    color: "from-blue-600 to-blue-400",
  },
  ISFJ: {
    type: "The Defender",
    description:
      "Warm, caring, and devoted. Natural at creating harmony and supporting others.",
    careers: ["Teacher", "Nurse", "Social Worker", "HR Professional"],
    strengths: [
      "Compassionate",
      "Loyal",
      "Dedicated",
      "Organized",
    ],
    color: "from-pink-600 to-pink-400",
  },
  INFJ: {
    type: "The Advocate",
    description:
      "Idealistic visionary with strong insight into people. Driven to create positive change.",
    careers: ["Counselor", "Writer", "Activist", "Mentor"],
    strengths: [
      "Insightful",
      "Passionate",
      "Creative",
      "Principled",
    ],
    color: "from-purple-600 to-purple-400",
  },
  INTJ: {
    type: "The Architect",
    description:
      "Strategic, innovative, and independent. Natural leader with a clear vision for the future.",
    careers: [
      "Engineer",
      "Entrepreneur",
      "Analyst",
      "Computer Scientist",
    ],
    strengths: [
      "Strategic",
      "Independent",
      "Innovative",
      "Analytical",
    ],
    color: "from-slate-700 to-slate-500",
  },
  ISTP: {
    type: "The Virtuoso",
    description:
      "Practical problem-solver with strong technical skills and hands-on approach.",
    careers: [
      "Mechanic",
      "Engineer",
      "Technician",
      "Data Analyst",
    ],
    strengths: [
      "Technical",
      "Logical",
      "Pragmatic",
      "Adaptable",
    ],
    color: "from-orange-600 to-orange-400",
  },
  ISFP: {
    type: "The Adventurer",
    description:
      "Artistic, sensitive, and spontaneous. Values personal expression and authentic experiences.",
    careers: ["Designer", "Artist", "Chef", "Photographer"],
    strengths: [
      "Creative",
      "Sensitive",
      "Spontaneous",
      "Flexible",
    ],
    color: "from-green-600 to-green-400",
  },
  INFP: {
    type: "The Mediator",
    description:
      "Idealistic, creative, and empathetic. Seeks meaning and authenticity in life and work.",
    careers: [
      "Psychologist",
      "Journalist",
      "Counselor",
      "Content Creator",
    ],
    strengths: [
      "Empathetic",
      "Creative",
      "Authentic",
      "Passionate",
    ],
    color: "from-cyan-600 to-cyan-400",
  },
  INTP: {
    type: "The Logician",
    description:
      "Curious, analytical, and original. Enjoys exploring complex ideas and theories.",
    careers: [
      "Scientist",
      "Mathematician",
      "Programmer",
      "Researcher",
    ],
    strengths: [
      "Analytical",
      "Creative",
      "Curious",
      "Independent",
    ],
    color: "from-indigo-600 to-indigo-400",
  },
  ESTP: {
    type: "The Entrepreneur",
    description:
      "Energetic, bold, and practical. Thrives in action and loves new challenges.",
    careers: [
      "Salesman",
      "Entrepreneur",
      "Emergency Responder",
      "Coach",
    ],
    strengths: [
      "Bold",
      "Pragmatic",
      "Energetic",
      "Persuasive",
    ],
    color: "from-red-600 to-red-400",
  },
  ESFP: {
    type: "The Entertainer",
    description:
      "Spontaneous, sociable, and enthusiastic. Brings energy and fun to every situation.",
    careers: [
      "Performer",
      "Sales Manager",
      "Event Planner",
      "Sports Coach",
    ],
    strengths: [
      "Sociable",
      "Spontaneous",
      "Enthusiastic",
      "Fun-loving",
    ],
    color: "from-yellow-600 to-yellow-400",
  },
  ENFP: {
    type: "The Campaigner",
    description:
      "Enthusiastic, creative, and people-focused. Natural communicator with infectious energy.",
    careers: [
      "Marketing Manager",
      "Teacher",
      "Performer",
      "Entrepreneur",
    ],
    strengths: [
      "Charismatic",
      "Creative",
      "Enthusiastic",
      "Social",
    ],
    color: "from-amber-600 to-amber-400",
  },
  ENTP: {
    type: "The Debater",
    description:
      "Intellectual, innovative, and argumentative. Loves debate and exploring new possibilities.",
    careers: [
      "Lawyer",
      "Entrepreneur",
      "Inventor",
      "Consultant",
    ],
    strengths: [
      "Innovative",
      "Intellectual",
      "Resourceful",
      "Quick-witted",
    ],
    color: "from-teal-600 to-teal-400",
  },
  ESTJ: {
    type: "The Executive",
    description:
      "Practical leader with strong organizational skills and efficient approach.",
    careers: [
      "Manager",
      "Executive",
      "Military Officer",
      "Administrator",
    ],
    strengths: [
      "Organized",
      "Efficient",
      "Decisive",
      "Responsible",
    ],
    color: "from-lime-600 to-lime-400",
  },
  ESFJ: {
    type: "The Consul",
    description:
      "Supportive, conscientious, and sociable. Dedicated to helping others and creating harmony.",
    careers: [
      "Event Coordinator",
      "Administrator",
      "Counselor",
      "Healthcare Worker",
    ],
    strengths: [
      "Supportive",
      "Cooperative",
      "Organized",
      "Loyal",
    ],
    color: "from-rose-600 to-rose-400",
  },
  ENFJ: {
    type: "The Protagonist",
    description:
      "Charismatic leader and mentor. Passionate about inspiring and helping others grow.",
    careers: [
      "Counselor",
      "Teacher",
      "Manager",
      "Religious Leader",
    ],
    strengths: [
      "Charismatic",
      "Inspiring",
      "Empathetic",
      "Organized",
    ],
    color: "from-fuchsia-600 to-fuchsia-400",
  },
  ENTJ: {
    type: "The Commander",
    description:
      "Natural leader with strategic vision. Decisive and driven to accomplish goals.",
    careers: [
      "Executive",
      "Entrepreneur",
      "Lawyer",
      "Military Officer",
    ],
    strengths: [
      "Strategic",
      "Leadership",
      "Decisive",
      "Ambitious",
    ],
    color: "from-violet-600 to-violet-400",
  },
};

const DimensionBar: React.FC<{
  label: string;
  left: string;
  right: string;
  score: number;
  icon: React.ReactNode;
}> = ({ label, left, right, score, icon }) => {
  const percentage = (score / 10) * 100;
  const displayScore = (score).toFixed(1);
  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="text-lg text-purple-600">{icon}</div>
          <span className="font-semibold text-gray-700">{label}</span>
        </div>
        <span className="text-sm font-bold text-purple-600">{displayScore}/10</span>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-xs font-medium text-gray-600 w-16">{left}</span>
        <div className="flex-1 h-3 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-500"
            style={{ width: `${percentage}%` }}
          />
        </div>
        <span className="text-xs font-medium text-gray-600 w-16 text-right">
          {right}
        </span>
      </div>
    </div>
  );
};

export const PersonalityMBTI: React.FC<PersonalityMBTIProps> = ({
  a,
  sheetNum,
  name,
}) => {
  const scores = useMemo(() => {
    const eiScore = (a as any).mbtiEI ?? 5;
    const snScore = (a as any).mbtiSN ?? 5;
    const tfScore = (a as any).mbtiTF ?? 5;
    const jpScore = (a as any).mbtiJP ?? 5;

    return {
      ei: [eiScore, 10 - eiScore],
      sn: [snScore, 10 - snScore],
      tf: [tfScore, 10 - tfScore],
      jp: [jpScore, 10 - jpScore],
    };
  }, [a]);

  const mbtiType = useMemo(() => {
    const e = scores.ei[0] > scores.ei[1] ? "E" : "I";
    const s = scores.sn[0] > scores.sn[1] ? "S" : "N";
    const t = scores.tf[0] > scores.tf[1] ? "T" : "F";
    const j = scores.jp[0] > scores.jp[1] ? "J" : "P";
    return e + s + t + j;
  }, [scores]);

  const typeInfo = MBTI_TYPES[mbtiType] || MBTI_TYPES.INFP;

  if (!scores) {
    return (
      <div className="text-center py-8 text-gray-500">
        No personality assessment data available.
      </div>
    );
  }

  const eiScore = Math.max(scores.ei[0], scores.ei[1]);
  const snScore = Math.max(scores.sn[0], scores.sn[1]);
  const tfScore = Math.max(scores.tf[0], scores.tf[1]);
  const jpScore = Math.max(scores.jp[0], scores.jp[1]);

  return (
    <div className="space-y-8">
      <div className="n-section">
        <h2 className="text-3xl font-bold mb-2 text-gray-800">
          Your MBTI Personality Type
        </h2>
        <p className="text-gray-600 mb-6">
          Discover how you work, think, and interact with the world
        </p>

        <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-8 mb-8 border-2 border-purple-200">
          <div className="text-center mb-4">
            <div className={`text-6xl font-black bg-gradient-to-r ${typeInfo.color} bg-clip-text text-transparent mb-2`}>
              {mbtiType}
            </div>
            <h3 className="text-2xl font-bold text-gray-800">{typeInfo.type}</h3>
          </div>
          <p className="text-gray-700 text-center mb-6 leading-relaxed">
            {typeInfo.description}
          </p>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-white rounded-lg p-4 border border-purple-200">
              <div className="text-xs font-semibold text-purple-600 mb-2">
                KEY STRENGTHS
              </div>
              <ul className="space-y-1">
                {typeInfo.strengths.map((strength) => (
                  <li
                    key={strength}
                    className="text-sm text-gray-700 flex items-center gap-2"
                  >
                    <span className="w-1.5 h-1.5 bg-purple-600 rounded-full" />
                    {strength}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-white rounded-lg p-4 border border-purple-200">
              <div className="text-xs font-semibold text-purple-600 mb-2">
                IDEAL CAREERS
              </div>
              <ul className="space-y-1">
                {typeInfo.careers.map((career) => (
                  <li
                    key={career}
                    className="text-sm text-gray-700 flex items-center gap-2"
                  >
                    <span className="w-1.5 h-1.5 bg-purple-600 rounded-full" />
                    {career}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-8 border-2 border-gray-200 mb-8">
          <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <Brain className="text-purple-600" />
            Your Personality Dimensions
          </h3>

          <DimensionBar
            label="Energy Source"
            left="Introversion"
            right="Extraversion"
            score={eiScore}
            icon={<Users size={20} />}
          />
          <DimensionBar
            label="Information Intake"
            left="Sensing"
            right="Intuition"
            score={snScore}
            icon={<Lightbulb size={20} />}
          />
          <DimensionBar
            label="Decision Making"
            left="Thinking"
            right="Feeling"
            score={tfScore}
            icon={<Heart size={20} />}
          />
          <DimensionBar
            label="Lifestyle"
            left="Judging"
            right="Perceiving"
            score={jpScore}
            icon={<Target size={20} />}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-blue-50 rounded-xl p-6 border-l-4 border-blue-600">
            <h4 className="font-bold text-blue-900 mb-3 flex items-center gap-2">
              <BookOpen size={18} className="text-blue-600" />
              Learning Style
            </h4>
            <p className="text-sm text-blue-800 leading-relaxed">
              {mbtiType[0] === "E"
                ? "You learn best through interaction, discussion, and real-world application of concepts."
                : "You prefer reflective learning, reading, and having time to process information before discussing."}
            </p>
          </div>

          <div className="bg-green-50 rounded-xl p-6 border-l-4 border-green-600">
            <h4 className="font-bold text-green-900 mb-3 flex items-center gap-2">
              <Compass size={18} className="text-green-600" />
              Work Environment
            </h4>
            <p className="text-sm text-green-800 leading-relaxed">
              {mbtiType[3] === "J"
                ? "You thrive in structured environments with clear goals, timelines, and defined roles."
                : "You work best in flexible, dynamic settings where you can adapt and explore new approaches."}
            </p>
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl p-8 text-white">
          <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
            <Zap size={20} />
            Growth Opportunities
          </h3>
          <p className="leading-relaxed text-sm">
            While your natural tendencies are strengths, remember that you can develop flexibility in
            other areas. Challenge yourself to sometimes embrace the opposite approach—it builds resilience and
            adaptability that will serve you well throughout your career and personal growth.
          </p>
        </div>
      </div>
    </div>
  );
};

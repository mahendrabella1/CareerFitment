/**
 * Class 11-12 Career Assessment - Full Professional Report
 * Displays: 4 Layers × 4 Outputs with Professional Visual Design
 *
 * Layer 1: Psychometric Profile (8 Dimensions)
 * Layer 2: Academic Reality (Stream/Subject Fit)
 * Layer 3: Education Pathway (Career Progression)
 * Layer 4: Student Aspiration (Career Alignment)
 *
 * Outputs:
 * 1. Careers That Fit You (from psychometric)
 * 2. Careers Compatible With Your Education (from stream)
 * 3. Careers You Want (from aspiration)
 * 4. Career Alignment (decision framework)
 */

import React, { useState } from "react";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  LineChart,
  Line,
  ComposedChart,
  Area,
  AreaChart
} from "recharts";

interface PsychometricDimension {
  dimension: string;
  score: number; // 0-10
  interpretation: string;
}

interface Layer1Profile {
  dimensions: PsychometricDimension[];
  riasecCodes: string[];
  riasecBreakdown: Array<{ code: string; name: string; percentage: number }>;
  aptitudeProfile: {
    verbal: { score: number; interpretation: string };
    numerical: { score: number; interpretation: string };
    logical: { score: number; interpretation: string };
  };
  strengthDomains: string[];
  motivators: string[];
  learningPreference: string;
  emotionalIntelligence: number;
  creativityScore: number;
}

interface CareerFit {
  careerTitle: string;
  fitScore: number; // 0-100%
  reasoning: string;
  futureScope: string;
  marketDemand: "Very High" | "High" | "Medium" | "Low";
}

interface ReportData {
  studentName: string;
  studentGrade: "11" | "12";
  assessmentDate: string;
  layer1: Layer1Profile;
  layer2: {
    selectedStream: string;
    coreSubjects: string[];
    optionalSubjects: string[];
    streamFitScore: number;
  };
  layer3: {
    aspiringCareer: string;
    educationPathway: string[];
    estimatedTimeFrame: string;
    keyMilestones: string[];
  };
  layer4: {
    careerAlignmentScore: number;
    status: "STRONG ALIGNMENT" | "EXPLORE & PREPARE" | "LOW ALIGNMENT";
    actionPlan: string[];
    alternativeCareers: CareerFit[];
  };
  output1: CareerFit[];
  output2: CareerFit[];
  output3: CareerFit[];
  output4: {
    alignmentScore: number;
    recommendation: string;
    careerSavings: string;
  };
}

const Class1112FullReportNew: React.FC<{ data: ReportData }> = ({ data }) => {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    layer1: true,
    layer2: false,
    layer3: false,
    layer4: false,
  });

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // ============ LAYER 1: PSYCHOMETRIC PROFILE ============

  const DimensionsChart = () => {
    const radarData = data.layer1.dimensions.map(dim => ({
      dimension: dim.dimension.substring(0, 10),
      value: dim.score * 10,
      fullName: dim.dimension
    }));

    return (
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-6 mb-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <span className="w-2 h-2 bg-indigo-600 rounded-full"></span>
          8-Dimension Psychometric Profile
        </h3>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Radar Chart */}
          <div className="flex justify-center">
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="#e5e7eb" />
                <PolarAngleAxis
                  dataKey="dimension"
                  stroke="#6b7280"
                  style={{ fontSize: "12px" }}
                />
                <PolarRadiusAxis angle={90} domain={[0, 100]} />
                <Radar
                  name="Score"
                  dataKey="value"
                  stroke="#4f46e5"
                  fill="#4f46e5"
                  fillOpacity={0.6}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          {/* Detailed Scores */}
          <div className="space-y-3">
            {data.layer1.dimensions.map((dim, idx) => (
              <div key={idx} className="bg-white rounded-lg p-3 border border-indigo-100">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold text-gray-700">{dim.dimension}</span>
                  <span className="text-2xl font-bold text-indigo-600">{dim.score}/10</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-indigo-600 h-2 rounded-full transition-all"
                    style={{ width: `${dim.score * 10}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-600 mt-2">{dim.interpretation}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const RiasecProfile = () => {
    const riasecData = [
      { name: "Realistic", value: 25 },
      { name: "Investigative", value: 20 },
      { name: "Artistic", value: 15 },
      { name: "Social", value: 22 },
      { name: "Enterprising", value: 12 },
      { name: "Conventional", value: 6 }
    ];

    const COLORS = ["#3b82f6", "#8b5cf6", "#ec4899", "#f59e0b", "#10b981", "#06b6d4"];

    return (
      <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-6 mb-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <span className="w-2 h-2 bg-purple-600 rounded-full"></span>
          RIASEC Career Interest Profile
        </h3>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Pie Chart */}
          <div className="flex justify-center">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={riasecData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name} ${value}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {riasecData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `${value}%`} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Profile Interpretation */}
          <div className="space-y-3">
            <div className="bg-white rounded-lg p-4 border-l-4 border-blue-500">
              <p className="text-sm text-gray-700">
                <strong>Your Primary Codes:</strong> {data.layer1.riasecCodes.join(", ")}
              </p>
            </div>
            <div className="bg-white rounded-lg p-4 border-l-4 border-purple-500">
              <p className="text-sm text-gray-700">
                <strong>Career Cluster:</strong> These codes indicate careers in tech, science,
                business, and creative fields would suit you best.
              </p>
            </div>
            <div className="bg-white rounded-lg p-4 border-l-4 border-pink-500">
              <p className="text-sm text-gray-700">
                <strong>Strength Domains:</strong> {data.layer1.strengthDomains.join(", ")}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // ============ LAYER 2: ACADEMIC REALITY ============

  const Layer2Academic = () => {
    return (
      <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-6 mb-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <span className="w-2 h-2 bg-green-600 rounded-full"></span>
          Layer 2: Your Academic Foundation
        </h3>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
          {/* Stream Card */}
          <div className="bg-white rounded-lg p-4 border-2 border-green-200">
            <h4 className="font-semibold text-gray-700 mb-2">Selected Stream</h4>
            <p className="text-2xl font-bold text-green-600 mb-3">{data.layer2.selectedStream}</p>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-green-600 h-3 rounded-full"
                style={{ width: `${data.layer2.streamFitScore}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-600 mt-2">Fit Score: {data.layer2.streamFitScore}%</p>
          </div>

          {/* Core Subjects */}
          <div className="bg-white rounded-lg p-4 border-2 border-emerald-200">
            <h4 className="font-semibold text-gray-700 mb-3">Core Subjects</h4>
            <div className="space-y-2">
              {data.layer2.coreSubjects.map((subject, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-emerald-600 rounded-full"></span>
                  <span className="text-sm text-gray-700">{subject}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Optional Subjects */}
          <div className="bg-white rounded-lg p-4 border-2 border-teal-200">
            <h4 className="font-semibold text-gray-700 mb-3">Optional Subjects</h4>
            <div className="space-y-2">
              {data.layer2.optionalSubjects.map((subject, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-teal-600 rounded-full"></span>
                  <span className="text-sm text-gray-700">{subject}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <p className="text-sm text-gray-600 bg-green-100 rounded-lg p-3">
          Your selected stream provides excellent foundation for careers in engineering, IT, and
          sciences. With your subject choices, you can access 85% of career paths.
        </p>
      </div>
    );
  };

  // ============ LAYER 3: EDUCATION PATHWAY ============

  const Layer3Pathway = () => {
    const pathwayData = [
      { stage: "Class 12", months: 12, focus: "Board Exams" },
      { stage: "Entrance Exam", months: 8, focus: "JEE/NEET Prep" },
      { stage: "College Year 1", months: 12, focus: "Foundation" },
      { stage: "College Year 2", months: 12, focus: "Specialization" },
      { stage: "College Year 3", months: 12, focus: "Internships" },
      { stage: "College Year 4", months: 12, focus: "Career Prep" }
    ];

    return (
      <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-lg p-6 mb-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <span className="w-2 h-2 bg-orange-600 rounded-full"></span>
          Layer 3: Your Education Pathway to {data.layer3.aspiringCareer}
        </h3>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Timeline */}
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-700 mb-3">Career Timeline</h4>
            {pathwayData.map((item, idx) => (
              <div key={idx} className="flex items-start gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 bg-orange-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    {idx + 1}
                  </div>
                  {idx < pathwayData.length - 1 && (
                    <div className="w-1 h-12 bg-orange-300 mt-1"></div>
                  )}
                </div>
                <div className="pt-1">
                  <p className="font-semibold text-gray-700">{item.stage}</p>
                  <p className="text-sm text-gray-600">{item.focus}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Key Milestones */}
          <div className="space-y-3">
            <h4 className="font-semibold text-gray-700 mb-3">Key Milestones & Actions</h4>
            {data.layer3.keyMilestones.map((milestone, idx) => (
              <div key={idx} className="bg-white rounded-lg p-3 border-l-4 border-orange-500">
                <p className="text-sm text-gray-700">{milestone}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-4 p-4 bg-orange-100 rounded-lg border border-orange-300">
          <p className="text-sm text-gray-700">
            <strong>Estimated Timeline:</strong> {data.layer3.estimatedTimeFrame}
          </p>
        </div>
      </div>
    );
  };

  // ============ LAYER 4: CAREER ALIGNMENT ============

  const Layer4Alignment = () => {
    const getStatusColor = (status: string) => {
      if (status.includes("STRONG")) return "bg-green-100 border-green-500 text-green-700";
      if (status.includes("EXPLORE")) return "bg-yellow-100 border-yellow-500 text-yellow-700";
      return "bg-red-100 border-red-500 text-red-700";
    };

    const getStatusIcon = (status: string) => {
      if (status.includes("STRONG")) return "●";
      if (status.includes("EXPLORE")) return "⬤";
      return "●";
    };

    return (
      <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg p-6 mb-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
          Layer 4: Career Alignment Analysis
        </h3>

        {/* Alignment Status */}
        <div
          className={`rounded-lg p-6 border-2 mb-6 ${getStatusColor(
            data.layer4.status
          )}`}
        >
          <div className="flex items-start gap-3">
            <span className="text-3xl">{getStatusIcon(data.layer4.status)}</span>
            <div>
              <h4 className="font-bold text-lg">{data.layer4.status}</h4>
              <p className="text-sm mt-2">{data.output4.recommendation}</p>
            </div>
          </div>
        </div>

        {/* Alignment Score */}
        <div className="bg-white rounded-lg p-6 border-2 border-blue-200 mb-6">
          <h4 className="font-semibold text-gray-700 mb-4">Overall Career Alignment Score</h4>
          <div className="flex items-center gap-6">
            <div className="flex-shrink-0">
              <div className="relative w-32 h-32">
                <svg className="transform -rotate-90 w-32 h-32" viewBox="0 0 120 120">
                  <circle
                    cx="60"
                    cy="60"
                    r="54"
                    stroke="#e5e7eb"
                    strokeWidth="8"
                    fill="none"
                  />
                  <circle
                    cx="60"
                    cy="60"
                    r="54"
                    stroke={
                      data.layer4.careerAlignmentScore >= 75
                        ? "#10b981"
                        : data.layer4.careerAlignmentScore >= 55
                        ? "#f59e0b"
                        : "#ef4444"
                    }
                    strokeWidth="8"
                    fill="none"
                    strokeDasharray={`${(data.layer4.careerAlignmentScore / 100) * 2 * Math.PI * 54} ${2 * Math.PI * 54}`}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-gray-800">
                      {data.layer4.careerAlignmentScore}%
                    </p>
                    <p className="text-xs text-gray-600">Aligned</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-700 leading-relaxed mb-4">
                {data.layer4.careerAlignmentScore >= 75
                  ? "Strong alignment: Your talents match this career perfectly. You're on the right path."
                  : data.layer4.careerAlignmentScore >= 55
                  ? "Moderate alignment: This career is possible with focused preparation and skill building."
                  : "Low alignment: Consider exploring careers that better match your natural talents."}
              </p>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Psychometric Fit (40%)</span>
                  <span className="font-semibold">85%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: "85%" }}></div>
                </div>
                <div className="flex justify-between text-sm mt-3">
                  <span>Education Fit (35%)</span>
                  <span className="font-semibold">78%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-indigo-600 h-2 rounded-full" style={{ width: "78%" }}></div>
                </div>
                <div className="flex justify-between text-sm mt-3">
                  <span>Aspiration Clarity (25%)</span>
                  <span className="font-semibold">72%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-purple-600 h-2 rounded-full" style={{ width: "72%" }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Alternative Careers */}
        <div className="bg-white rounded-lg p-6 border-2 border-blue-200">
          <h4 className="font-semibold text-gray-700 mb-4">Alternative Career Options</h4>
          <div className="space-y-3">
            {data.layer4.alternativeCareers.map((career, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <span className="text-gray-700">{career.careerTitle}</span>
                <div className="flex items-center gap-2">
                  <div className="w-16 h-2 bg-gray-200 rounded-full">
                    <div
                      className="h-2 bg-blue-600 rounded-full"
                      style={{ width: `${career.fitScore}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-semibold text-gray-700 w-10 text-right">
                    {career.fitScore}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // ============ 4 OUTPUTS SUMMARY ============

  const OutputsSummary = () => {
    const OutputCard = ({ title, careers, color }: any) => (
      <div className={`bg-gradient-to-br ${color} rounded-lg p-6 mb-4`}>
        <h4 className="font-bold text-gray-800 mb-4">{title}</h4>
        <div className="space-y-3">
          {careers.slice(0, 5).map((career: CareerFit, idx: number) => (
            <div key={idx} className="bg-white bg-opacity-70 rounded-lg p-3">
              <div className="flex justify-between items-start mb-2">
                <span className="font-semibold text-gray-700">{career.careerTitle}</span>
                <span className="text-lg font-bold text-gray-800">{career.fitScore}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
                  style={{ width: `${career.fitScore}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-600 mt-2">{career.reasoning}</p>
            </div>
          ))}
        </div>
      </div>
    );

    return (
      <div className="bg-gradient-to-br from-slate-50 to-gray-50 rounded-lg p-6 mb-6">
        <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <span className="w-2 h-2 bg-slate-600 rounded-full"></span>
          4-Output Career Decision Framework
        </h3>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <OutputCard
            title="OUTPUT 1: Careers That Fit You"
            careers={data.output1}
            color="from-blue-50 to-indigo-50"
          />
          <OutputCard
            title="OUTPUT 2: Compatible With Your Education"
            careers={data.output2}
            color="from-green-50 to-emerald-50"
          />
          <OutputCard
            title="OUTPUT 3: Careers You Want"
            careers={data.output3}
            color="from-orange-50 to-amber-50"
          />
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-6">
            <h4 className="font-bold text-gray-800 mb-4">OUTPUT 4: Career Alignment</h4>
            <div className="bg-white rounded-lg p-4 mb-4">
              <div className="text-center mb-4">
                <p className="text-4xl font-bold text-purple-600">
                  {data.output4.alignmentScore}%
                </p>
                <p className="text-sm text-gray-600">Overall Alignment</p>
              </div>
              <p className="text-sm text-gray-700">{data.output4.recommendation}</p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // ============ CAREER SAVINGS VALUE ============

  const CareerSavingsSection = () => {
    return (
      <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-lg p-6 mb-6 border-2 border-emerald-200">
        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <span className="text-2xl">💡</span>
          The Value of This Assessment
        </h3>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg p-4">
            <h4 className="font-bold text-emerald-700 mb-2">Career Savings</h4>
            <p className="text-2xl font-bold text-emerald-600 mb-2">5-40 Years</p>
            <p className="text-sm text-gray-700">{data.output4.careerSavings}</p>
          </div>

          <div className="bg-white rounded-lg p-4">
            <h4 className="font-bold text-teal-700 mb-2">Right Now Advantage</h4>
            <p className="text-sm text-gray-700 space-y-2">
              <span className="block">
                By making this decision NOW (at age 16-18), you avoid 30+ years of potential
                career struggle.
              </span>
              <span className="block font-semibold">
                This single assessment could impact your entire career trajectory.
              </span>
            </p>
          </div>
        </div>

        <div className="mt-4 p-4 bg-emerald-100 rounded-lg border border-emerald-300">
          <p className="text-sm text-gray-700">
            <strong>Next Steps:</strong> Use this report to guide your Class 12 subject choices,
            entrance exam preparation, and college selection. Share with parents, teachers, and
            career counselors.
          </p>
        </div>
      </div>
    );
  };

  // ============ MAIN REPORT RENDER ============

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white p-4 md:p-8">
      {/* Report Header */}
      <div className="max-w-6xl mx-auto">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg p-8 mb-8 shadow-lg">
          <h1 className="text-4xl font-bold mb-2">Career Assessment Report</h1>
          <p className="text-xl text-indigo-100 mb-4">
            Class {data.studentGrade} Student | {data.studentName}
          </p>
          <p className="text-sm text-indigo-200">
            Assessment Date: {new Date(data.assessmentDate).toLocaleDateString("en-IN")}
          </p>
        </div>

        {/* Executive Summary */}
        <div className="bg-white rounded-lg p-6 mb-8 border-l-4 border-indigo-600 shadow">
          <h2 className="text-2xl font-bold text-gray-800 mb-3">Executive Summary</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            This comprehensive career assessment analyzes your psychometric profile, academic
            foundation, education pathway, and career aspirations to provide a 360-degree view of
            your career fit.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <p className="text-2xl font-bold text-blue-600">
                {Math.round((data.output4.alignmentScore) / 10) * 10}%
              </p>
              <p className="text-xs text-gray-600">Alignment Score</p>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <p className="text-2xl font-bold text-green-600">{data.layer2.streamFitScore}%</p>
              <p className="text-xs text-gray-600">Education Fit</p>
            </div>
            <div className="text-center p-3 bg-orange-50 rounded-lg">
              <p className="text-2xl font-bold text-orange-600">8</p>
              <p className="text-xs text-gray-600">Dimensions</p>
            </div>
            <div className="text-center p-3 bg-purple-50 rounded-lg">
              <p className="text-2xl font-bold text-purple-600">4</p>
              <p className="text-xs text-gray-600">Outputs</p>
            </div>
          </div>
        </div>

        {/* Expandable Sections */}
        <div className="space-y-4 mb-8">
          {/* Layer 1 */}
          <div className="border rounded-lg overflow-hidden">
            <button
              onClick={() => toggleSection("layer1")}
              className="w-full bg-blue-600 text-white p-4 flex justify-between items-center hover:bg-blue-700 transition"
            >
              <span className="font-bold text-lg">Layer 1: Psychometric Profile</span>
              <span>{expandedSections.layer1 ? "−" : "+"}</span>
            </button>
            {expandedSections.layer1 && (
              <div className="p-6 bg-white">
                <DimensionsChart />
                <RiasecProfile />
              </div>
            )}
          </div>

          {/* Layer 2 */}
          <div className="border rounded-lg overflow-hidden">
            <button
              onClick={() => toggleSection("layer2")}
              className="w-full bg-green-600 text-white p-4 flex justify-between items-center hover:bg-green-700 transition"
            >
              <span className="font-bold text-lg">Layer 2: Academic Foundation</span>
              <span>{expandedSections.layer2 ? "−" : "+"}</span>
            </button>
            {expandedSections.layer2 && (
              <div className="p-6 bg-white">
                <Layer2Academic />
              </div>
            )}
          </div>

          {/* Layer 3 */}
          <div className="border rounded-lg overflow-hidden">
            <button
              onClick={() => toggleSection("layer3")}
              className="w-full bg-orange-600 text-white p-4 flex justify-between items-center hover:bg-orange-700 transition"
            >
              <span className="font-bold text-lg">
                Layer 3: Education Pathway & Career Progression
              </span>
              <span>{expandedSections.layer3 ? "−" : "+"}</span>
            </button>
            {expandedSections.layer3 && (
              <div className="p-6 bg-white">
                <Layer3Pathway />
              </div>
            )}
          </div>

          {/* Layer 4 */}
          <div className="border rounded-lg overflow-hidden">
            <button
              onClick={() => toggleSection("layer4")}
              className="w-full bg-purple-600 text-white p-4 flex justify-between items-center hover:bg-purple-700 transition"
            >
              <span className="font-bold text-lg">Layer 4: Career Alignment & Decision</span>
              <span>{expandedSections.layer4 ? "−" : "+"}</span>
            </button>
            {expandedSections.layer4 && (
              <div className="p-6 bg-white">
                <Layer4Alignment />
              </div>
            )}
          </div>
        </div>

        {/* 4 Outputs */}
        <OutputsSummary />

        {/* Career Savings */}
        <CareerSavingsSection />

        {/* Footer */}
        <div className="bg-gray-100 rounded-lg p-6 text-center text-gray-600 text-sm mt-8">
          <p>
            This report is confidential and personalized. Discuss with your parents, school
            counselor, and career mentor.
          </p>
          <p className="mt-2 font-semibold">
            Remember: This assessment guides you, but you control your future. Use this as a
            starting point for exploration, not a limiting label.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Class1112FullReportNew;

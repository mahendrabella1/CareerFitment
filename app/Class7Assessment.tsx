"use client";

import { useState, useMemo } from "react";
import { useAuth } from "@/lib/auth/AuthProvider";
import { scoreClass7Assessment, type Class7Response, type Class7ScoreOutput } from "@/lib/newAssessment/class7Scoring";
import { Class7Report } from "@/app/account/Class7Report";
import questions from "@/data/class7-assessment-questions.json";
import { Logo } from "@/app/Logo";

type Phase = "intro" | "quiz" | "results";

const DIMENSIONS = [
  { id: "personality", name: "Personality Preferences", qs: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] },
  { id: "riasec", name: "Career Interests", qs: [11, 12, 13, 14, 15, 16, 17, 18, 19, 20] },
  { id: "aptitude", name: "Aptitude & Reasoning", qs: [21, 22, 23, 24, 25, 26, 27, 28, 29, 30] },
  { id: "strengths", name: "MI Strengths", qs: [31, 32, 33, 34, 35, 36, 37, 38] },
  { id: "motivators", name: "Motivators", qs: [39, 40, 41, 42, 43, 44, 45] },
  { id: "learning", name: "Learning Style", qs: [46, 47, 48, 49, 50] },
  { id: "emotional", name: "Emotional Awareness", qs: [51, 52, 53, 54, 55] },
  { id: "creativity", name: "Future Readiness", qs: [56, 57, 58, 59, 60] },
];

export default function Class7Assessment() {
  const { profile } = useAuth();
  const [phase, setPhase] = useState<Phase>("intro");
  const [studentName, setStudentName] = useState(profile?.name || "");
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [responses, setResponses] = useState<Record<number, number>>({});
  const [results, setResults] = useState<Class7ScoreOutput | null>(null);

  const allQuestions = useMemo(() => {
    const loadedQuestions = (questions as any).questions || [];

    // Safety check: Class 7 assessment should have exactly 60 questions
    if (loadedQuestions.length !== 60) {
      console.warn(`⚠️ Class 7 Assessment loaded ${loadedQuestions.length} questions, expected 60`);
    }

    // Only use the first 60 questions to prevent loading extra questions
    const validQuestions = loadedQuestions.slice(0, 60);

    return validQuestions.map((q: any, idx: number) => ({
      ...q,
      originalIndex: idx,
    }));
  }, []);

  const totalQuestions = allQuestions.length;

  const currentDimension = useMemo(() => {
    const qId = currentQuestion + 1;
    return DIMENSIONS.find((d) => d.qs.includes(qId));
  }, [currentQuestion]);

  const handleAnswer = (optionIndex: number) => {
    const qId = currentQuestion + 1;
    setResponses((prev) => ({ ...prev, [qId]: optionIndex }));

    if (currentQuestion < totalQuestions - 1) {
      setCurrentQuestion((prev) => prev + 1);
    } else {
      submitAssessment();
    }
  };

  const submitAssessment = () => {
    if (!studentName.trim()) {
      alert("Please enter your name");
      return;
    }

    const response: Class7Response = {
      studentName: studentName.trim(),
      responses,
    };

    try {
      const scored = scoreClass7Assessment(response);
      setResults(scored);
      setPhase("results");
    } catch (err) {
      console.error("Scoring error:", err);
      alert("Error processing results. Please try again.");
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion((prev) => prev - 1);
    }
  };

  const handleNext = () => {
    if (currentQuestion < totalQuestions - 1) {
      setCurrentQuestion((prev) => prev + 1);
    }
  };

  const getDimensionProgress = (dimId: string) => {
    const dim = DIMENSIONS.find((d) => d.id === dimId);
    if (!dim) return 0;
    const answered = dim.qs.filter((q) => q in responses).length;
    return Math.round((answered / dim.qs.length) * 100);
  };

  if (phase === "results" && results) {
    return (
      <Class7Report
        studentName={results.studentName}
        studentEmail={profile?.email || ""}
        output={results}
      />
    );
  }

  if (phase === "intro") {
    return (
      <div style={styles.container}>
        <div style={styles.header}>
          <Logo />
        </div>
        <div style={styles.introCard}>
          <h1 style={styles.title}>Career Discovery Assessment</h1>
          <p style={styles.subtitle}>Class 6</p>
          <p style={styles.description}>
            Explore your personality, interests, strengths, and learning style to discover career areas that align with you.
          </p>
          <div style={styles.info}>
            <div style={styles.infoItem}>
              <div style={styles.infoIcon}>📝</div>
              <div>
                <div style={styles.infoTitle}>60 Questions</div>
                <div style={styles.infoText}>Across 8 dimensions</div>
              </div>
            </div>
            <div style={styles.infoItem}>
              <div style={styles.infoIcon}>⏱️</div>
              <div>
                <div style={styles.infoTitle}>25-30 Minutes</div>
                <div style={styles.infoText}>Take your time, no rush</div>
              </div>
            </div>
            <div style={styles.infoItem}>
              <div style={styles.infoIcon}>🎯</div>
              <div>
                <div style={styles.infoTitle}>No Wrong Answers</div>
                <div style={styles.infoText}>Your honest responses help</div>
              </div>
            </div>
          </div>

          <div style={styles.nameSection}>
            <label style={styles.label}>Your Name *</label>
            <input
              type="text"
              placeholder="Enter your full name"
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              style={styles.input}
            />
          </div>

          <button
            style={styles.button}
            onClick={() => {
              if (!studentName.trim()) {
                alert("Please enter your name to continue");
                return;
              }
              setPhase("quiz");
            }}
          >
            Start Assessment →
          </button>

          <p style={styles.disclaimer}>
            Your results are private and will help you explore career paths suited to your interests and strengths.
          </p>
        </div>
      </div>
    );
  }

  const q = allQuestions[currentQuestion];
  const qId = currentQuestion + 1;
  const progress = ((currentQuestion + 1) / totalQuestions) * 100;
  const isAnswered = qId in responses;

  return (
    <div style={styles.quizContainer}>
      {/* Header */}
      <div style={styles.quizHeader}>
        <div style={styles.headerLeft}>
          <div style={styles.logo}>
            <Logo />
          </div>
          <div style={styles.timerBadge}>{qId} / 60</div>
        </div>
        <div style={styles.dimensionLabel}>{currentDimension?.name}</div>
        <div style={styles.progressBar}>
          <div style={{ ...styles.progressFill, width: `${progress}%` }} />
        </div>
      </div>

      {/* Main Quiz */}
      <div style={styles.quizMain}>
        {/* Left Sidebar - Dimensions */}
        <div style={styles.sidebar}>
          <div style={styles.sidebarTitle}>Progress</div>
          {DIMENSIONS.map((dim) => (
            <div key={dim.id} style={styles.dimItem}>
              <div style={styles.dimName}>{dim.name}</div>
              <div style={styles.dimProgress}>
                <div
                  style={{
                    ...styles.dimProgressBar,
                    width: `${getDimensionProgress(dim.id)}%`,
                  }}
                />
              </div>
              <div style={styles.dimPercent}>{getDimensionProgress(dim.id)}%</div>
            </div>
          ))}
        </div>

        {/* Center - Question Card */}
        <div style={styles.questionCard}>
          <div style={styles.questionNumber}>Question {qId} of {totalQuestions}</div>
          <h2 style={styles.questionText}>{q.text}</h2>

          <div style={styles.optionsContainer}>
            {q.options?.map((option: string, idx: number) => (
              <button
                key={idx}
                style={{
                  ...styles.optionButton,
                  ...(isAnswered && responses[qId] === idx ? styles.optionButtonSelected : {}),
                }}
                onClick={() => handleAnswer(idx)}
              >
                <div style={styles.optionLabel}>{String.fromCharCode(65 + idx)}</div>
                <div style={styles.optionText}>{option}</div>
              </button>
            ))}
          </div>

          {/* Navigation */}
          <div style={styles.navigationContainer}>
            <button
              style={styles.navButton}
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
            >
              ← Previous
            </button>

            <div style={styles.navigationStatus}>
              {isAnswered ? (
                <div style={styles.answered}>✓ Answered</div>
              ) : (
                <div style={styles.unanswered}>Select an option</div>
              )}
            </div>

            {currentQuestion === totalQuestions - 1 ? (
              <button
                style={styles.submitButton}
                onClick={submitAssessment}
                disabled={!isAnswered}
              >
                Complete Assessment →
              </button>
            ) : (
              <button
                style={styles.navButton}
                onClick={handleNext}
                disabled={!isAnswered}
              >
                Next →
              </button>
            )}
          </div>
        </div>

        {/* Right Sidebar - Quick Navigation */}
        <div style={styles.navigationSidebar}>
          <div style={styles.navSidebarTitle}>Jump to Question</div>
          <div style={styles.questionGrid}>
            {allQuestions.map((_: any, idx: number) => (
              <button
                key={idx}
                style={{
                  ...styles.questionGridItem,
                  ...(idx === currentQuestion ? styles.questionGridItemActive : {}),
                  ...(idx + 1 in responses ? styles.questionGridItemAnswered : {}),
                }}
                onClick={() => setCurrentQuestion(idx)}
                title={`Q${idx + 1}`}
              >
                {idx + 1}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
    padding: "40px 20px",
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
  },
  header: {
    marginBottom: "40px",
  },
  introCard: {
    background: "white",
    borderRadius: "12px",
    padding: "40px",
    maxWidth: "600px",
    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
  },
  title: {
    fontSize: "32px",
    fontWeight: "600",
    color: "#1a1a1a",
    marginBottom: "8px",
    textAlign: "center" as const,
  },
  subtitle: {
    fontSize: "18px",
    color: "#666",
    textAlign: "center" as const,
    marginBottom: "16px",
  },
  description: {
    fontSize: "14px",
    color: "#555",
    lineHeight: "1.6",
    textAlign: "center" as const,
    marginBottom: "32px",
  },
  info: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr 1fr",
    gap: "20px",
    marginBottom: "32px",
  },
  infoItem: {
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
    textAlign: "center" as const,
  },
  infoIcon: {
    fontSize: "32px",
    marginBottom: "8px",
  },
  infoTitle: {
    fontSize: "13px",
    fontWeight: "600",
    color: "#1a1a1a",
  },
  infoText: {
    fontSize: "12px",
    color: "#888",
  },
  nameSection: {
    marginBottom: "24px",
  },
  label: {
    display: "block",
    fontSize: "13px",
    fontWeight: "600",
    color: "#333",
    marginBottom: "8px",
  },
  input: {
    width: "100%",
    padding: "10px 12px",
    fontSize: "14px",
    border: "1px solid #ddd",
    borderRadius: "6px",
    boxSizing: "border-box" as const,
  },
  button: {
    width: "100%",
    padding: "12px",
    fontSize: "15px",
    fontWeight: "600",
    color: "white",
    background: "linear-gradient(135deg, #2f6bff 0%, #1a4d9e 100%)",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    marginBottom: "16px",
  },
  disclaimer: {
    fontSize: "12px",
    color: "#888",
    textAlign: "center" as const,
  },

  // Quiz styles
  quizContainer: {
    height: "100vh",
    display: "flex",
    flexDirection: "column" as const,
    background: "#f8f9fa",
  },
  quizHeader: {
    background: "#2c3e50",
    color: "white",
    padding: "16px 24px",
    display: "flex",
    alignItems: "center",
    gap: "20px",
    borderBottom: "1px solid #34495e",
  },
  headerLeft: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  logo: {
    width: "40px",
  },
  timerBadge: {
    fontSize: "14px",
    fontWeight: "600",
    background: "#34495e",
    padding: "6px 12px",
    borderRadius: "20px",
  },
  dimensionLabel: {
    fontSize: "14px",
    fontWeight: "500",
    marginLeft: "auto",
  },
  progressBar: {
    flex: 1,
    height: "4px",
    background: "rgba(255,255,255,0.2)",
    borderRadius: "2px",
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    background: "#2ecc71",
    transition: "width 0.3s ease",
  },

  quizMain: {
    display: "flex",
    flex: 1,
    overflow: "hidden",
  },
  sidebar: {
    width: "200px",
    background: "white",
    borderRight: "1px solid #e0e0e0",
    padding: "20px",
    overflowY: "auto" as const,
  },
  sidebarTitle: {
    fontSize: "12px",
    fontWeight: "600",
    color: "#666",
    textTransform: "uppercase" as const,
    marginBottom: "16px",
  },
  dimItem: {
    marginBottom: "16px",
  },
  dimName: {
    fontSize: "12px",
    fontWeight: "500",
    color: "#333",
    marginBottom: "6px",
  },
  dimProgress: {
    height: "4px",
    background: "#e0e0e0",
    borderRadius: "2px",
    overflow: "hidden",
    marginBottom: "4px",
  },
  dimProgressBar: {
    height: "100%",
    background: "#2f6bff",
    transition: "width 0.3s ease",
  },
  dimPercent: {
    fontSize: "11px",
    color: "#888",
  },

  questionCard: {
    flex: 1,
    display: "flex",
    flexDirection: "column" as const,
    padding: "40px",
    overflow: "auto" as const,
  },
  questionNumber: {
    fontSize: "12px",
    color: "#888",
    fontWeight: "500",
    marginBottom: "16px",
  },
  questionText: {
    fontSize: "20px",
    fontWeight: "600",
    color: "#1a1a1a",
    marginBottom: "32px",
    lineHeight: "1.4",
  },
  optionsContainer: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "12px",
    marginBottom: "40px",
  },
  optionButton: {
    display: "flex",
    alignItems: "flex-start",
    gap: "16px",
    padding: "16px",
    background: "white",
    border: "2px solid #e0e0e0",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "all 0.2s ease",
  },
  optionButtonSelected: {
    background: "#e9f0ff",
    borderColor: "#2f6bff",
  },
  optionLabel: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "32px",
    height: "32px",
    background: "#f0f0f0",
    borderRadius: "50%",
    fontWeight: "600",
    color: "#666",
    fontSize: "14px",
    flexShrink: 0,
  },
  optionText: {
    fontSize: "14px",
    color: "#333",
    lineHeight: "1.4",
    paddingTop: "4px",
  },

  navigationContainer: {
    display: "flex",
    gap: "16px",
    marginTop: "auto",
    paddingTop: "20px",
    borderTop: "1px solid #e0e0e0",
    alignItems: "center",
  },
  navButton: {
    padding: "10px 20px",
    fontSize: "14px",
    fontWeight: "500",
    color: "#2f6bff",
    background: "white",
    border: "1px solid #2f6bff",
    borderRadius: "6px",
    cursor: "pointer",
  },
  navigationStatus: {
    flex: 1,
    textAlign: "center" as const,
  },
  answered: {
    fontSize: "12px",
    color: "#27ae60",
    fontWeight: "500",
  },
  unanswered: {
    fontSize: "12px",
    color: "#e74c3c",
  },
  submitButton: {
    padding: "10px 24px",
    fontSize: "14px",
    fontWeight: "600",
    color: "white",
    background: "#27ae60",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },

  navigationSidebar: {
    width: "160px",
    background: "white",
    borderLeft: "1px solid #e0e0e0",
    padding: "20px",
    overflowY: "auto" as const,
  },
  navSidebarTitle: {
    fontSize: "12px",
    fontWeight: "600",
    color: "#666",
    textTransform: "uppercase" as const,
    marginBottom: "12px",
  },
  questionGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "6px",
  },
  questionGridItem: {
    padding: "6px",
    fontSize: "11px",
    fontWeight: "500",
    color: "#666",
    background: "#f0f0f0",
    border: "1px solid #e0e0e0",
    borderRadius: "4px",
    cursor: "pointer",
  },
  questionGridItemActive: {
    background: "#2f6bff",
    color: "white",
    borderColor: "#2f6bff",
  },
  questionGridItemAnswered: {
    borderColor: "#27ae60",
    color: "#27ae60",
    fontWeight: "600",
  },
};

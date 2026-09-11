'use client';

import React, { useState, useCallback } from 'react';
import {
  CLASS8_QUESTIONS,
  DIMENSION_ORDER,
  DIMENSION_LABELS,
  DIMENSION_DESCRIPTIONS,
  QUESTIONS_PER_DIMENSION,
} from '@/lib/newAssessment/class8Questions';
import { class8Scorer, Class8ScoreOutput } from '@/lib/newAssessment/class8Scoring';

interface Class8AssessmentProps {
  studentName: string;
  onComplete: (results: Class8ScoreOutput, responses: number[]) => void;
  onCancel: () => void;
}

export default function Class8Assessment({ studentName, onComplete, onCancel }: Class8AssessmentProps) {
  const [responses, setResponses] = useState<(number | null)[]>(new Array(60).fill(null));
  const [currentDimensionIndex, setCurrentDimensionIndex] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const currentDimension = DIMENSION_ORDER[currentDimensionIndex];
  const dimensionRange = QUESTIONS_PER_DIMENSION[currentDimension as keyof typeof QUESTIONS_PER_DIMENSION];
  const dimensionQuestions = CLASS8_QUESTIONS.slice(dimensionRange.start - 1, dimensionRange.end);

  const answeredInDimension = responses
    .slice(dimensionRange.start - 1, dimensionRange.end)
    .filter((r) => r !== null).length;

  const totalAnswered = responses.filter((r) => r !== null).length;
  const completionPercentage = Math.round((totalAnswered / 60) * 100);

  const handleAnswer = useCallback((questionIndex: number, optionIndex: number) => {
    const actualIndex = dimensionRange.start - 1 + questionIndex;
    setResponses((prev) => {
      const newResponses = [...prev];
      newResponses[actualIndex] = optionIndex;
      return newResponses;
    });
  }, [dimensionRange.start]);

  const handlePrevious = () => {
    if (currentDimensionIndex > 0) {
      setCurrentDimensionIndex(currentDimensionIndex - 1);
      setError(null);
    }
  };

  const handleNext = () => {
    if (answeredInDimension < dimensionQuestions.length) {
      setError(`Please answer all questions in ${DIMENSION_LABELS[currentDimension as keyof typeof DIMENSION_LABELS]}`);
      return;
    }
    if (currentDimensionIndex < DIMENSION_ORDER.length - 1) {
      setCurrentDimensionIndex(currentDimensionIndex + 1);
      setError(null);
    }
  };

  const handleSubmit = async () => {
    if (totalAnswered < 60) {
      setError('Please complete all 60 questions before submitting');
      return;
    }

    setIsSubmitting(true);
    try {
      const validResponses = responses.map((r) => r ?? 0);
      const results = class8Scorer(validResponses);
      onComplete(results, validResponses);
    } catch (err) {
      setError('An error occurred while processing your assessment. Please try again.');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(to bottom, #0f172a, #1e293b)' }}>
      {/* Header */}
      <div className="sticky top-0 z-40 border-b border-slate-700/50">
        <div className="max-w-4xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-white">Class 8 Assessment</h1>
              <p className="text-sm text-slate-300 mt-1">Student: {studentName}</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-cyan-400">{completionPercentage}%</p>
              <p className="text-xs text-slate-400">Complete</p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-slate-700 rounded-full h-2 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 transition-all duration-300"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Dimension Header */}
        <div className="mb-8 p-6 bg-slate-800/50 rounded-lg border border-slate-700/50">
          <h2 className="text-xl font-semibold text-white mb-2">
            {DIMENSION_LABELS[currentDimension as keyof typeof DIMENSION_LABELS]}
          </h2>
          <p className="text-slate-300">
            {DIMENSION_DESCRIPTIONS[currentDimension as keyof typeof DIMENSION_DESCRIPTIONS]}
          </p>
          <p className="text-sm text-slate-400 mt-3">
            Question {dimensionRange.start} - {dimensionRange.end} of 60 ({answeredInDimension}/{dimensionQuestions.length} answered)
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-900/20 border border-red-700/30 rounded-lg text-red-300 text-sm">
            {error}
          </div>
        )}

        {/* Questions */}
        <div className="space-y-6 mb-8">
          {dimensionQuestions.map((question, idx) => {
            const questionIndex = dimensionRange.start - 1 + idx;
            const isAnswered = responses[questionIndex] !== null;

            return (
              <div
                key={question.id}
                className="p-6 bg-slate-800/30 border border-slate-700/50 rounded-lg hover:border-slate-600/50 transition-colors"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-cyan-400/20 flex items-center justify-center">
                    <span className="text-sm font-semibold text-cyan-400">{question.id}</span>
                  </div>
                  <div className="flex-grow">
                    <h3 className="text-lg font-medium text-white mb-4">
                      {question.question}
                      {question.hint && (
                        <span className="text-xs text-slate-400 ml-2">💡 {question.hint}</span>
                      )}
                    </h3>

                    <div className="space-y-2">
                      {question.options.map((option, optionIdx) => (
                        <button
                          key={optionIdx}
                          onClick={() => handleAnswer(idx, optionIdx)}
                          className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                            responses[questionIndex] === optionIdx
                              ? 'bg-cyan-500/20 border-cyan-400 text-white'
                              : 'bg-slate-700/20 border-slate-600/50 text-slate-200 hover:border-slate-500'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                                responses[questionIndex] === optionIdx
                                  ? 'bg-cyan-400 border-cyan-400'
                                  : 'border-slate-500'
                              }`}
                            >
                              {responses[questionIndex] === optionIdx && (
                                <span className="text-slate-900 font-bold">✓</span>
                              )}
                            </div>
                            <span>{typeof option === 'string' ? option : option.text}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Navigation */}
        <div className="flex gap-4 justify-between">
          <button
            onClick={handlePrevious}
            disabled={currentDimensionIndex === 0}
            className={`px-6 py-3 rounded-lg font-medium transition-all ${
              currentDimensionIndex === 0
                ? 'bg-slate-700/30 text-slate-500 cursor-not-allowed'
                : 'bg-slate-700 hover:bg-slate-600 text-white'
            }`}
          >
            ← Previous Section
          </button>

          <div className="flex gap-3">
            <button
              onClick={onCancel}
              className="px-6 py-3 rounded-lg font-medium bg-slate-700 hover:bg-slate-600 text-white transition-all"
            >
              Cancel
            </button>

            {currentDimensionIndex === DIMENSION_ORDER.length - 1 ? (
              <button
                onClick={handleSubmit}
                disabled={totalAnswered < 60 || isSubmitting}
                className={`px-8 py-3 rounded-lg font-medium transition-all ${
                  totalAnswered === 60 && !isSubmitting
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white'
                    : 'bg-slate-700/30 text-slate-500 cursor-not-allowed'
                }`}
              >
                {isSubmitting ? 'Processing...' : 'Submit & Generate Report'}
              </button>
            ) : (
              <button
                onClick={handleNext}
                className={`px-8 py-3 rounded-lg font-medium transition-all ${
                  answeredInDimension === dimensionQuestions.length
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white'
                    : 'bg-slate-700/30 text-slate-500 cursor-not-allowed'
                }`}
              >
                Next Section →
              </button>
            )}
          </div>
        </div>

        {/* Dimension Progress Tracker */}
        <div className="mt-8 pt-8 border-t border-slate-700/50">
          <h4 className="text-sm font-semibold text-slate-300 mb-4">Assessment Progress</h4>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {DIMENSION_ORDER.map((dim, idx) => {
              const range = QUESTIONS_PER_DIMENSION[dim as keyof typeof QUESTIONS_PER_DIMENSION];
              const dimAnswered = responses
                .slice(range.start - 1, range.end)
                .filter((r) => r !== null).length;
              const isComplete = dimAnswered === range.count;

              return (
                <button
                  key={dim}
                  onClick={() => setCurrentDimensionIndex(idx)}
                  className={`p-3 rounded-lg text-sm font-medium transition-all ${
                    idx === currentDimensionIndex
                      ? 'bg-cyan-500 text-white ring-2 ring-cyan-400'
                      : isComplete
                        ? 'bg-slate-700/50 text-slate-200 border border-slate-600/50'
                        : 'bg-slate-700/30 text-slate-400 border border-slate-700/50'
                  }`}
                >
                  <div className="text-xs opacity-75 mb-1">
                    {DIMENSION_LABELS[dim as keyof typeof DIMENSION_LABELS]}
                  </div>
                  <div className="text-lg font-bold">
                    {dimAnswered}/{range.count}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

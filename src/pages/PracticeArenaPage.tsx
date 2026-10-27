import React, { useState, useMemo } from 'react';
import {
  Target,
  CheckCircle2,
  XCircle,
  RotateCcw,
  BookOpen,
  ArrowRight,
  Filter,
  Sparkles,
  Award,
} from 'lucide-react';
import { useLab } from '../context/LabContext';
import { PRACTICE_QUESTIONS, PracticeQuestion } from '../data/practiceQuestions';

export const PracticeArenaPage: React.FC = () => {
  const {
    recordPracticeAttempt,
    practiceAttempts,
    setSelectedLessonId,
    setActiveTab,
    showToast,
  } = useLab();

  const [difficulty, setDifficulty] = useState<'all' | 'beginner' | 'intermediate' | 'advanced'>('all');
  const [selectedQuestionIndex, setSelectedQuestionIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);

  // Filter questions
  const filteredQuestions = useMemo(() => {
    return PRACTICE_QUESTIONS.filter((q) => {
      if (difficulty === 'all') return true;
      return q.difficulty === difficulty;
    });
  }, [difficulty]);

  const currentQuestion: PracticeQuestion =
    filteredQuestions[selectedQuestionIndex] || filteredQuestions[0];

  const handleSelectOption = (idx: number) => {
    if (isAnswered) return;
    setSelectedOption(idx);
  };

  const handleSubmitAnswer = () => {
    if (selectedOption === null || isAnswered) return;
    const isCorrect = selectedOption === currentQuestion.correctIndex;
    setIsAnswered(true);
    recordPracticeAttempt(currentQuestion.id, isCorrect);

    if (isCorrect) {
      showToast('success', 'Correct Answer!', '+20 Practice Points recorded.');
    } else {
      showToast('info', 'Incorrect', 'Review the detailed scientific explanation below.');
    }
  };

  const handleNextQuestion = () => {
    setSelectedOption(null);
    setIsAnswered(false);
    setSelectedQuestionIndex((prev) => (prev + 1) % filteredQuestions.length);
  };

  const handleRetryQuestion = () => {
    setSelectedOption(null);
    setIsAnswered(false);
  };

  // Accuracy stats
  const totalAttempted = practiceAttempts.length;
  const totalCorrect = practiceAttempts.filter((p) => p.correct).length;
  const accuracyPct = totalAttempted > 0 ? Math.round((totalCorrect / totalAttempted) * 100) : 0;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header & Stats Banner */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-mono mb-2">
            <Target className="w-3.5 h-3.5 text-blue-600" />
            <span>Interactive Practice Arena</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 font-display tracking-tight">
            Knowledge Drill & Problem Solving
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Low-pressure interactive quizzes with immediate feedback and mathematical explanations.
          </p>
        </div>

        {/* Stats Pill */}
        <div className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono shrink-0">
          <div>
            <span className="text-slate-500 block text-[10px]">Attempted</span>
            <span className="text-slate-900 font-bold">{totalAttempted}</span>
          </div>
          <div className="w-[1px] h-6 bg-slate-100" />
          <div>
            <span className="text-slate-500 block text-[10px]">Accuracy</span>
            <span className="text-blue-600 font-bold">{accuracyPct}%</span>
          </div>
          <div className="w-[1px] h-6 bg-slate-100" />
          <div>
            <span className="text-slate-500 block text-[10px]">Points</span>
            <span className="text-emerald-400 font-bold">{totalCorrect * 20}</span>
          </div>
        </div>
      </div>

      {/* Difficulty Filter */}
      <div className="flex items-center gap-2">
        <span className="text-xs font-mono text-slate-500">Filter Level:</span>
        <div className="flex items-center gap-1 p-1 bg-white border border-slate-200 rounded-xl">
          {(['all', 'beginner', 'intermediate', 'advanced'] as const).map((lvl) => (
            <button
              key={lvl}
              onClick={() => {
                setDifficulty(lvl);
                setSelectedQuestionIndex(0);
                setSelectedOption(null);
                setIsAnswered(false);
              }}
              className={`px-3 py-1 text-xs font-medium rounded-lg transition-colors cursor-pointer capitalize ${
                difficulty === lvl
                  ? 'bg-blue-600 text-white font-semibold shadow-sm font-bold'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              {lvl}
            </button>
          ))}
        </div>
        <span className="text-xs font-mono text-slate-500 ml-auto">
          Question {selectedQuestionIndex + 1} of {filteredQuestions.length}
        </span>
      </div>

      {/* Active Question Card */}
      {currentQuestion && (
        <div className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200 space-y-6">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="px-2 py-0.5 rounded bg-slate-50 border border-slate-200 text-blue-600 uppercase">
              {currentQuestion.category.replace('_', ' ')}
            </span>
            <span className="text-slate-500 uppercase">
              {currentQuestion.difficulty}
            </span>
          </div>

          <h2 className="text-base sm:text-lg font-bold text-slate-900 leading-relaxed">
            {currentQuestion.question}
          </h2>

          {/* Options */}
          <div className="space-y-2.5">
            {currentQuestion.options.map((opt, idx) => {
              let btnStyle = 'border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-200';

              if (selectedOption === idx) {
                btnStyle = 'border-cyan-500 bg-blue-50 text-slate-900';
              }

              if (isAnswered) {
                if (idx === currentQuestion.correctIndex) {
                  btnStyle = 'border-emerald-500 bg-emerald-500/15 text-emerald-300 font-semibold';
                } else if (selectedOption === idx) {
                  btnStyle = 'border-rose-500 bg-rose-500/15 text-rose-300';
                } else {
                  btnStyle = 'border-slate-200 bg-slate-50/70 text-slate-500';
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(idx)}
                  disabled={isAnswered}
                  className={`w-full p-4 rounded-xl border text-xs text-left transition-all flex items-start gap-3 cursor-pointer ${btnStyle}`}
                >
                  <span className="w-5 h-5 rounded-full border border-slate-200 flex items-center justify-center text-[10px] font-mono shrink-0">
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span className="leading-relaxed">{opt}</span>
                </button>
              );
            })}
          </div>

          {/* Explanation Box on Answer */}
          {isAnswered && (
            <div
              className={`p-4 rounded-xl text-xs space-y-2 leading-relaxed ${
                selectedOption === currentQuestion.correctIndex
                  ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-300'
                  : 'bg-rose-500/10 border border-rose-500/30 text-rose-300'
              }`}
            >
              <div className="flex items-center gap-2 font-bold text-sm">
                {selectedOption === currentQuestion.correctIndex ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Correct Answer!</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-4 h-4 text-rose-400" />
                    <span>Incorrect</span>
                  </>
                )}
              </div>
              <p className="text-slate-800">{currentQuestion.explanation}</p>
            </div>
          )}

          {/* Action Row */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-200">
            {isAnswered ? (
              <div className="flex items-center gap-3">
                <button
                  onClick={handleRetryQuestion}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-750 text-xs text-slate-700 hover:text-slate-900 transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Retry</span>
                </button>

                <button
                  onClick={() => {
                    setSelectedLessonId(currentQuestion.relevantLessonId);
                    setActiveTab('academy');
                  }}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-750 text-xs text-blue-600 hover:text-blue-700 transition-colors cursor-pointer"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Review Associated Lesson</span>
                </button>
              </div>
            ) : (
              <div />
            )}

            {!isAnswered ? (
              <button
                onClick={handleSubmitAnswer}
                disabled={selectedOption === null}
                className="py-2.5 px-6 bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-slate-950 font-semibold text-xs rounded-xl shadow-lg transition-all cursor-pointer"
              >
                Submit Answer
              </button>
            ) : (
              <button
                onClick={handleNextQuestion}
                className="flex items-center gap-2 py-2.5 px-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md shadow-blue-500/20 font-semibold text-xs rounded-xl shadow-lg transition-all cursor-pointer"
              >
                <span>Next Question</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

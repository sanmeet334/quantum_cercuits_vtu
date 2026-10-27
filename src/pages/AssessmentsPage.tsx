import React, { useState, useEffect } from 'react';
import {
  FileCheck,
  Clock,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Award,
  RotateCcw,
  BookOpen,
  Sparkles,
  ShieldAlert,
} from 'lucide-react';
import { useLab } from '../context/LabContext';
import { getAssessmentTest, AssessmentTest, AssessmentQuestion } from '../data/assessmentQuestions';
import { ConfirmModal } from '../components/common/ConfirmModal';

export const AssessmentsPage: React.FC = () => {
  const {
    recordAssessmentResult,
    assessmentHistory,
    completedLessons,
    setActiveTab,
    setSelectedLessonId,
    showToast,
  } = useLab();

  const [testType, setTestType] = useState<'full_assessment' | 'gate_test' | 'topic_test' | 'mixed_test'>('full_assessment');
  const [activeTest, setActiveTest] = useState<AssessmentTest | null>(null);

  // Active Test In-Progress State
  const [currentQIndex, setCurrentQIndex] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const [isTestActive, setIsTestActive] = useState<boolean>(false);
  const [submitConfirmOpen, setSubmitConfirmOpen] = useState<boolean>(false);

  // Completed Test Results View
  const [testResult, setTestResult] = useState<{
    score: number;
    total: number;
    percentage: number;
    passed: boolean;
    timeTakenSeconds: number;
    answers: Record<string, number>;
    test: AssessmentTest;
  } | null>(null);

  // Timer
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isTestActive) {
      interval = setInterval(() => {
        setElapsedSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTestActive]);

  const handleStartTest = (type: typeof testType) => {
    setTestType(type);
    const test = getAssessmentTest(type);
    setActiveTest(test);
    setCurrentQIndex(0);
    setAnswers({});
    setElapsedSeconds(0);
    setIsTestActive(true);
    setTestResult(null);
    showToast('info', 'Assessment Started', `You have started the 25-question examination: ${test.title}.`);
  };

  const handleSelectAnswer = (qId: string, optIndex: number) => {
    setAnswers((prev) => ({ ...prev, [qId]: optIndex }));
  };

  const handleFinishTest = () => {
    if (!activeTest) return;
    setIsTestActive(false);

    let score = 0;
    activeTest.questions.forEach((q) => {
      if (answers[q.id] === q.correctIndex) {
        score++;
      }
    });

    const total = activeTest.questions.length; // exactly 25
    const percentage = Math.round((score / total) * 100);
    const passed = percentage >= 70;

    const result = {
      score,
      total,
      percentage,
      passed,
      timeTakenSeconds: elapsedSeconds,
      answers,
      test: activeTest,
    };

    setTestResult(result);
    recordAssessmentResult({
      testType: activeTest.category,
      title: activeTest.title,
      date: new Date().toISOString(),
      score,
      total,
      percentage,
      passed,
      timeTakenSeconds: elapsedSeconds,
      answers,
    });
  };

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins}:${s.toString().padStart(2, '0')}`;
  };

  // If in-progress test
  if (isTestActive && activeTest) {
    const q: AssessmentQuestion = activeTest.questions[currentQIndex];
    const totalQuestions = activeTest.questions.length;
    const answeredCount = Object.keys(answers).length;

    return (
      <div className="space-y-6 max-w-4xl mx-auto">
        {/* Top Header & Progress */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200 flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="text-[10px] font-mono uppercase text-blue-600 block">
              {q.stageName} · Topic: {q.topic}
            </span>
            <h2 className="text-sm font-bold text-slate-900 font-display">
              {activeTest.title}
            </h2>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono">
            <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-50 border border-slate-200 rounded-xl">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>{formatTime(elapsedSeconds)}</span>
            </div>
            <button
              onClick={() => setSubmitConfirmOpen(true)}
              className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md shadow-blue-500/20 font-bold rounded-xl transition-colors cursor-pointer"
            >
              Submit Exam
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-2 bg-white rounded-full overflow-hidden border border-slate-200">
          <div
            className="h-full bg-gradient-to-r from-cyan-500 to-indigo-500 transition-all duration-300"
            style={{ width: `${((currentQIndex + 1) / totalQuestions) * 100}%` }}
          />
        </div>

        {/* Question Card */}
        <div className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200 space-y-6">
          <div className="flex items-center justify-between text-xs font-mono text-slate-500">
            <span>
              Question <strong className="text-slate-900">{currentQIndex + 1}</strong> of {totalQuestions}
            </span>
            <span>
              {answeredCount}/{totalQuestions} Answered
            </span>
          </div>

          <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-relaxed">
            {q.question}
          </h3>

          {/* Options */}
          <div className="space-y-2.5">
            {q.options.map((opt, idx) => {
              const isSelected = answers[q.id] === idx;
              return (
                <button
                  key={idx}
                  onClick={() => handleSelectAnswer(q.id, idx)}
                  className={`w-full p-4 rounded-xl border text-xs text-left transition-all flex items-start gap-3 cursor-pointer ${
                    isSelected
                      ? 'border-cyan-500 bg-blue-50 text-slate-900 font-medium'
                      : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-200'
                  }`}
                >
                  <span className="w-5 h-5 rounded-full border border-slate-200 flex items-center justify-center text-[10px] font-mono shrink-0">
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span className="leading-relaxed">{opt}</span>
                </button>
              );
            })}
          </div>

          {/* Question Navigator Grid */}
          <div className="pt-4 border-t border-slate-200">
            <span className="text-[10px] text-slate-500 uppercase font-mono block mb-2">
              Question Navigator (5 Stages):
            </span>
            <div className="grid grid-cols-5 sm:grid-cols-25 gap-1 font-mono text-xs">
              {activeTest.questions.map((ques, idx) => {
                const isAns = answers[ques.id] !== undefined;
                const isCurrent = idx === currentQIndex;
                return (
                  <button
                    key={ques.id}
                    onClick={() => setCurrentQIndex(idx)}
                    className={`h-7 rounded flex items-center justify-center text-[11px] font-bold transition-all cursor-pointer ${
                      isCurrent
                        ? 'border border-cyan-400 bg-blue-100 text-slate-900'
                        : isAns
                        ? 'bg-slate-100 text-blue-700'
                        : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
                    }`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Prev / Next controls */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-200">
            <button
              onClick={() => setCurrentQIndex((prev) => Math.max(0, prev - 1))}
              disabled={currentQIndex === 0}
              className="flex items-center gap-1.5 px-4 py-2 text-xs text-slate-700 hover:text-slate-900 disabled:opacity-30 bg-slate-100 hover:bg-slate-750 rounded-xl transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>

            {currentQIndex < totalQuestions - 1 ? (
              <button
                onClick={() => setCurrentQIndex((prev) => Math.min(totalQuestions - 1, prev + 1))}
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-950 bg-cyan-500 hover:bg-cyan-400 rounded-xl shadow transition-colors cursor-pointer"
              >
                <span>Next Question</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={() => setSubmitConfirmOpen(true)}
                className="flex items-center gap-1.5 px-5 py-2 text-xs font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-xl shadow transition-colors cursor-pointer"
              >
                <span>Review & Submit</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Confirmation Modal */}
        <ConfirmModal
          isOpen={submitConfirmOpen}
          title="Submit Final Examination?"
          message={
            answeredCount < totalQuestions
              ? `You have answered ${answeredCount} of 25 questions. Are you sure you wish to submit now?`
              : 'All 25 questions answered. Ready to generate your official assessment score and certificate?'
          }
          confirmLabel="Submit Exam"
          onConfirm={handleFinishTest}
          onCancel={() => setSubmitConfirmOpen(false)}
        />
      </div>
    );
  }

  // If viewing test results
  if (testResult) {
    return (
      <div className="space-y-6 max-w-4xl mx-auto">
        {/* Results Hero Card */}
        <div className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200 text-center space-y-4 shadow-xl">
          <div className="w-16 h-16 rounded-2xl mx-auto flex items-center justify-center bg-gradient-to-tr from-cyan-500 to-indigo-600 text-slate-950 shadow-lg shadow-blue-500/20">
            <Award className="w-9 h-9" />
          </div>

          <div>
            <span className="text-xs font-mono uppercase text-blue-600 block mb-1">
              Official Assessment Results
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 font-display">
              {testResult.test.title}
            </h2>
          </div>

          <div className="grid grid-cols-3 gap-3 max-w-md mx-auto font-mono text-center">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-slate-500 block text-[10px]">Score</span>
              <span className="text-xl font-bold text-slate-900">
                {testResult.score}/{testResult.total}
              </span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-slate-500 block text-[10px]">Percentage</span>
              <span className={`text-xl font-bold ${testResult.passed ? 'text-emerald-400' : 'text-rose-400'}`}>
                {testResult.percentage}%
              </span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-slate-500 block text-[10px]">Status</span>
              <span className={`text-xs font-bold block mt-1.5 ${testResult.passed ? 'text-emerald-400' : 'text-amber-400'}`}>
                {testResult.passed ? 'PASSED (≥70%)' : 'NEEDS REVIEW'}
              </span>
            </div>
          </div>

          {/* Action Row */}
          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              onClick={() => handleStartTest(testResult.test.category as any)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md shadow-blue-500/20 font-bold text-xs rounded-xl shadow cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Retake Test</span>
            </button>
            <button
              onClick={() => setTestResult(null)}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 text-xs rounded-xl border border-slate-200 cursor-pointer"
            >
              Back to Assessments Menu
            </button>
          </div>
        </div>

        {/* Detailed Review of All 25 Questions */}
        <div className="space-y-4">
          <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider font-mono">
            Detailed 25-Question Review & Scientific Explanations
          </h3>

          {testResult.test.questions.map((q, idx) => {
            const userChoice = testResult.answers[q.id];
            const isCorrect = userChoice === q.correctIndex;

            return (
              <div
                key={q.id}
                className={`p-5 rounded-2xl border text-xs space-y-3 ${
                  isCorrect
                    ? 'border-emerald-500/30 bg-white'
                    : 'border-rose-500/30 bg-white'
                }`}
              >
                <div className="flex items-center justify-between text-slate-500 font-mono text-[11px]">
                  <span>
                    Q{idx + 1} · {q.stageName} · {q.topic}
                  </span>
                  <span className={`font-bold ${isCorrect ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {isCorrect ? '✓ Correct' : '✗ Incorrect'}
                  </span>
                </div>

                <p className="text-sm font-bold text-slate-900 leading-relaxed">{q.question}</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                  <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                    <span className="text-slate-500 block text-[10px]">Your Answer:</span>
                    <span className={isCorrect ? 'text-emerald-300 font-semibold' : 'text-rose-300'}>
                      {userChoice !== undefined ? q.options[userChoice] : 'Unanswered'}
                    </span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                    <span className="text-slate-500 block text-[10px]">Correct Answer:</span>
                    <span className="text-emerald-400 font-semibold">{q.options[q.correctIndex]}</span>
                  </div>
                </div>

                <p className="text-slate-700 leading-relaxed pt-1 text-[11px] border-t border-slate-200">
                  {q.explanation}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // Assessment Selection Menu
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-mono mb-2">
          <FileCheck className="w-3.5 h-3.5 text-blue-600" />
          <span>Formal Testing Center</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 font-display tracking-tight">
          Quantum Computing Assessments
        </h1>
        <p className="text-sm text-slate-700 mt-2 max-w-2xl leading-relaxed">
          Standardized examinations featuring exactly 25 questions across 5 progressive stages: Fundamentals, Basic Applications, Intermediate Understanding, Advanced Applications, and Challenging Problem-Solving. Passing grade: 70% (18/25).
        </p>
      </div>

      {/* Test Selection Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[
          {
            type: 'full_assessment',
            title: 'Full Quantum Gates Comprehensive Exam',
            desc: 'The complete 25-question evaluation covering all quantum gates, superposition, entanglement, algorithms, and matrices.',
            duration: '30 min',
            badge: 'Flagship Exam',
          },
          {
            type: 'gate_test',
            title: 'Individual Gate & Matrix Exam',
            desc: 'Focuses on single-qubit rotations, multi-qubit gates, matrix algebra, and Dirac transformations.',
            duration: '25 min',
            badge: 'Gate Specialization',
          },
          {
            type: 'topic_test',
            title: 'Superposition & Entanglement Exam',
            desc: 'Tests deep conceptual and mathematical understanding of Bell states, phase kickback, and interference.',
            duration: '25 min',
            badge: 'Topic Mastery',
          },
          {
            type: 'mixed_test',
            title: 'Mixed Quantum Computing General Test',
            desc: 'A blended assessment covering theoretical physics, Qiskit code interpretation, and circuit debugging.',
            duration: '30 min',
            badge: 'Mixed Theory & Code',
          },
        ].map((t) => (
          <div
            key={t.type}
            className="p-6 rounded-2xl bg-white border border-slate-200 hover:border-blue-200 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between text-xs font-mono mb-2">
                <span className="text-blue-600 uppercase font-semibold">{t.badge}</span>
                <span className="text-slate-500">{t.duration} · 25 Qs</span>
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2 font-display">{t.title}</h3>
              <p className="text-xs text-slate-700 leading-relaxed mb-4">{t.desc}</p>
            </div>

            <button
              onClick={() => handleStartTest(t.type as any)}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md shadow-blue-500/20 font-bold text-xs rounded-xl shadow transition-all cursor-pointer"
            >
              <span>Begin Examination</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      {/* Test History */}
      {assessmentHistory.length > 0 && (
        <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-4">
          <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider font-mono">
            Past Assessment Attempts ({assessmentHistory.length})
          </h3>
          <div className="space-y-2">
            {assessmentHistory.map((rec) => (
              <div
                key={rec.id}
                className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs font-mono"
              >
                <div>
                  <span className="text-slate-900 font-semibold block">{rec.title}</span>
                  <span className="text-[11px] text-slate-500 block">
                    {new Date(rec.date).toLocaleDateString()} · {Math.floor(rec.timeTakenSeconds / 60)}m {rec.timeTakenSeconds % 60}s
                  </span>
                </div>
                <div className="text-right">
                  <span className={`font-bold text-sm block ${rec.passed ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {rec.score}/{rec.total} ({rec.percentage}%)
                  </span>
                  <span className={`text-[10px] ${rec.passed ? 'text-emerald-400' : 'text-amber-400'}`}>
                    {rec.passed ? 'PASSED' : 'NEEDS WORK'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

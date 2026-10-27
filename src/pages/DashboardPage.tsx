import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  BookOpen,
  Cpu,
  GitBranch,
  Play,
  FlaskConical,
  Award,
  Flame,
  CheckCircle2,
  Compass,
  Zap,
} from 'lucide-react';
import { useLab } from '../context/LabContext';
import { LESSONS_DATA } from '../data/lessonsData';
import { LABS_DATA } from '../data/labsData';
import { ACHIEVEMENTS_DATA } from '../data/achievementsData';

export const DashboardPage: React.FC = () => {
  const {
    studentName,
    setActiveTab,
    setSelectedLessonId,
    completedLessons,
    completedLabs,
    practiceAttempts,
    assessmentHistory,
    savedCircuits,
    streak,
    unlockedAchievements,
    setCurrentCircuit,
    showToast,
  } = useLab();

  const [dailyCompleted, setDailyCompleted] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [answeredFeedback, setAnsweredFeedback] = useState<string | null>(null);

  const totalLessons = LESSONS_DATA.length;
  const totalLabs = LABS_DATA.length;
  const overallProgress = Math.round(
    ((completedLessons.length + completedLabs.length) / (totalLessons + totalLabs)) * 100
  );

  const practiceCorrect = practiceAttempts.filter((p) => p.correct).length;
  const practiceAccuracy =
    practiceAttempts.length > 0
      ? Math.round((practiceCorrect / practiceAttempts.length) * 100)
      : 0;

  const latestAssessment = assessmentHistory[0];

  const nextLesson =
    LESSONS_DATA.find((l) => !completedLessons.includes(l.id)) || LESSONS_DATA[0];

  const dailyChallenge = {
    title: 'Daily Quantum Probe: Pauli-X Superposition Paradox',
    question:
      'What happens when a Pauli-X gate acts on the equal superposition state |+⟩ = (|0⟩ + |1⟩)/√2?',
    options: [
      'It flips to |−⟩ = (|0⟩ − |1⟩)/√2',
      'It leaves the state vector completely unchanged because |+⟩ is an eigenstate of X',
      'It causes the qubit to collapse immediately',
      'It rotates phase by 90° into |i+⟩',
    ],
    correctIndex: 1,
    explanation:
      'X|+⟩ = X(|0⟩ + |1⟩)/√2 = (|1⟩ + |0⟩)/√2 = |+⟩. The |+⟩ state is an eigenstate of Pauli-X with eigenvalue +1!',
  };

  const handleDailySubmit = () => {
    if (selectedOption === null) return;
    if (selectedOption === dailyChallenge.correctIndex) {
      setDailyCompleted(true);
      setAnsweredFeedback('Correct! +50 Quantum EXP added.');
      showToast('success', 'Daily Challenge Solved!', 'You mastered the Pauli-X eigenstate concept.');
    } else {
      setAnsweredFeedback('Not quite. Review the explanation below and try again.');
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-50 via-indigo-50/40 to-white border border-slate-200 p-6 sm:p-8 shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-mono mb-3">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>Quantum Lab Online · Cloud Node Active</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight font-display">
              Welcome back, {studentName || 'Student'}!
            </h1>
            <p className="text-sm text-slate-700 mt-2 leading-relaxed">
              Continue your journey into quantum mechanics. Build multi-qubit circuits, analyze statevector interference, and master quantum computing algorithms.
            </p>

            <div className="flex flex-wrap items-center gap-3 mt-5">
              <button
                onClick={() => {
                  setSelectedLessonId(nextLesson.id);
                  setActiveTab('academy');
                }}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md shadow-blue-500/20 font-semibold text-xs rounded-xl shadow-lg shadow-blue-500/20 transition-all cursor-pointer"
              >
                <span>Continue Learning: {nextLesson.title}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => setActiveTab('circuit_studio')}
                className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-900 font-medium text-xs rounded-xl border border-slate-200 transition-colors cursor-pointer"
              >
                <GitBranch className="w-4 h-4 text-blue-600" />
                <span>Open Circuit Studio</span>
              </button>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 shrink-0 w-full md:w-56 text-center">
            <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
              <span>Overall Progress</span>
              <span className="font-mono text-blue-600 font-bold">{overallProgress}%</span>
            </div>
            <div className="w-full h-2.5 bg-white rounded-full overflow-hidden border border-slate-200">
              <div
                className="h-full bg-gradient-to-r from-cyan-500 to-indigo-500 rounded-full transition-all duration-500"
                style={{ width: `${overallProgress}%` }}
              />
            </div>
            <div className="flex justify-between text-[11px] font-mono text-slate-500 mt-2">
              <span>{completedLessons.length}/{totalLessons} Lessons</span>
              <span>{completedLabs.length}/{totalLabs} Labs</span>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Metric Strips */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        <div className="p-4 rounded-xl bg-white border border-slate-200">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
            <span>Lessons</span>
            <BookOpen className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-xl font-bold text-slate-900 font-mono">
            {completedLessons.length} <span className="text-xs text-slate-500 font-normal">/ {totalLessons}</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Foundations & Theory</div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
            <span>Guided Labs</span>
            <FlaskConical className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-xl font-bold text-slate-900 font-mono">
            {completedLabs.length} <span className="text-xs text-slate-500 font-normal">/ {totalLabs}</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Experiments executed</div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
            <span>Practice Accuracy</span>
            <Award className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-xl font-bold text-slate-900 font-mono">
            {practiceAccuracy}%
          </div>
          <div className="text-[11px] text-slate-500 mt-1">{practiceAttempts.length} questions answered</div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
            <span>Latest Exam</span>
            <CheckCircle2 className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-xl font-bold text-slate-900 font-mono">
            {latestAssessment ? `${latestAssessment.percentage}%` : 'N/A'}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            {latestAssessment ? `${latestAssessment.score}/25 points` : 'Not attempted'}
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
            <span>Activity Streak</span>
            <Flame className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-xl font-bold text-slate-900 font-mono">
            {streak} <span className="text-xs text-slate-500 font-normal">Days</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Daily learning streak</div>
        </div>
      </div>

      {/* 2-Column Split: Daily Quantum Challenge & Learning Roadmap */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Daily Challenge Card */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200">
            <div className="flex items-center justify-between gap-3 mb-4">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  <Zap className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Daily Quantum Probe</h3>
                  <span className="text-xs text-slate-500">Streak booster problem</span>
                </div>
              </div>
              <span className="text-xs font-mono text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                +50 EXP
              </span>
            </div>

            <p className="text-sm text-slate-800 font-medium mb-4 leading-relaxed">
              {dailyChallenge.question}
            </p>

            <div className="space-y-2 mb-4">
              {dailyChallenge.options.map((opt, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    if (!dailyCompleted) setSelectedOption(idx);
                  }}
                  className={`w-full p-3 rounded-xl border text-xs text-left transition-all flex items-start gap-3 cursor-pointer ${
                    selectedOption === idx
                      ? 'border-cyan-500 bg-blue-50 text-slate-900'
                      : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-200'
                  }`}
                >
                  <span className="w-5 h-5 rounded-full border border-slate-200 flex items-center justify-center text-[10px] font-mono shrink-0">
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span className="leading-relaxed">{opt}</span>
                </button>
              ))}
            </div>

            {answeredFeedback && (
              <div
                className={`p-3 rounded-xl mb-4 text-xs ${
                  dailyCompleted
                    ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-300'
                    : 'bg-rose-500/10 border border-rose-500/20 text-rose-300'
                }`}
              >
                <p className="font-semibold mb-1">{answeredFeedback}</p>
                <p className="text-slate-700">{dailyChallenge.explanation}</p>
              </div>
            )}

            {!dailyCompleted ? (
              <button
                onClick={handleDailySubmit}
                disabled={selectedOption === null}
                className="w-full py-2.5 px-4 bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-slate-950 font-semibold text-xs rounded-xl shadow transition-all cursor-pointer"
              >
                Submit Answer
              </button>
            ) : (
              <div className="flex items-center justify-center gap-2 py-2 text-xs text-emerald-400 font-medium">
                <CheckCircle2 className="w-4 h-4" />
                <span>Daily Challenge Completed</span>
              </div>
            )}
          </div>

          {/* Quick Access Grid */}
          <div>
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 font-mono">
              Quick Launch Tools
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <button
                onClick={() => setActiveTab('simulator')}
                className="p-4 rounded-xl bg-white hover:bg-slate-850 border border-slate-200 hover:border-blue-300 transition-all text-left group cursor-pointer"
              >
                <Play className="w-5 h-5 text-blue-600 mb-2 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-semibold text-slate-900 block">Simulator</span>
                <span className="text-[11px] text-slate-500">Statevector & shots</span>
              </button>

              <button
                onClick={() => setActiveTab('gate_explorer')}
                className="p-4 rounded-xl bg-white hover:bg-slate-850 border border-slate-200 hover:border-indigo-500/40 transition-all text-left group cursor-pointer"
              >
                <Cpu className="w-5 h-5 text-indigo-400 mb-2 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-semibold text-slate-900 block">Gate Explorer</span>
                <span className="text-[11px] text-slate-500">20+ Gate matrices</span>
              </button>

              <button
                onClick={() => setActiveTab('entanglement')}
                className="p-4 rounded-xl bg-white hover:bg-slate-850 border border-slate-200 hover:border-violet-500/40 transition-all text-left group cursor-pointer"
              >
                <Compass className="w-5 h-5 text-violet-400 mb-2 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-semibold text-slate-900 block">Entanglement</span>
                <span className="text-[11px] text-slate-500">Bell & GHZ states</span>
              </button>

              <button
                onClick={() => setActiveTab('assessments')}
                className="p-4 rounded-xl bg-white hover:bg-slate-850 border border-slate-200 hover:border-amber-500/40 transition-all text-left group cursor-pointer"
              >
                <Award className="w-5 h-5 text-amber-400 mb-2 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-semibold text-slate-900 block">Assessments</span>
                <span className="text-[11px] text-slate-500">25-Question exams</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right 1 Col: Recent Circuits & Achievements */}
        <div className="space-y-6">
          <div className="p-5 rounded-2xl bg-white border border-slate-200">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider font-mono">
                Recent Circuits ({savedCircuits.length})
              </h3>
              <button
                onClick={() => setActiveTab('saved_circuits')}
                className="text-xs text-blue-600 hover:text-blue-700 font-medium cursor-pointer"
              >
                View All
              </button>
            </div>

            <div className="space-y-2">
              {savedCircuits.slice(0, 3).map((circ) => (
                <div
                  key={circ.id}
                  onClick={() => {
                    setCurrentCircuit(circ);
                    setActiveTab('circuit_studio');
                  }}
                  className="p-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 hover:border-slate-200 transition-all cursor-pointer group flex items-center justify-between"
                >
                  <div className="min-w-0">
                    <span className="text-xs font-semibold text-slate-900 block truncate group-hover:text-blue-700">
                      {circ.name}
                    </span>
                    <span className="text-[11px] text-slate-500 block font-mono">
                      {circ.qubitsCount} Qubits · {circ.gates.length} Gates
                    </span>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-blue-600 shrink-0 ml-2" />
                </div>
              ))}
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider font-mono">
                Achievements ({unlockedAchievements.length}/{ACHIEVEMENTS_DATA.length})
              </h3>
              <button
                onClick={() => setActiveTab('achievements')}
                className="text-xs text-blue-600 hover:text-blue-700 font-medium cursor-pointer"
              >
                Show Grid
              </button>
            </div>

            <div className="grid grid-cols-4 gap-2">
              {ACHIEVEMENTS_DATA.slice(0, 8).map((ach) => {
                const isUnlocked = unlockedAchievements.includes(ach.id);
                return (
                  <div
                    key={ach.id}
                    className={`aspect-square rounded-xl border flex flex-col items-center justify-center p-2 text-center transition-all ${
                      isUnlocked
                        ? 'bg-blue-50 border-blue-300 text-blue-600 shadow-sm'
                        : 'bg-slate-50/70 border-slate-200 text-slate-600'
                    }`}
                    title={`${ach.title}: ${isUnlocked ? 'Unlocked!' : ach.requirement}`}
                  >
                    <Award className={`w-5 h-5 ${isUnlocked ? 'text-blue-600' : 'text-slate-600'}`} />
                    <span className="text-[9px] font-mono mt-1 truncate max-w-full">
                      {ach.title.split(' ')[0]}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

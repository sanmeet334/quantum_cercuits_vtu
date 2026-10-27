import React from 'react';
import {
  BarChart3,
  BookOpen,
  FlaskConical,
  Award,
  Flame,
  CheckCircle2,
  Download,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Target,
  Compass,
} from 'lucide-react';
import { useLab } from '../context/LabContext';
import { LESSONS_DATA } from '../data/lessonsData';
import { LABS_DATA } from '../data/labsData';

export const AnalyticsPage: React.FC = () => {
  const {
    completedLessons,
    completedLabs,
    practiceAttempts,
    assessmentHistory,
    streak,
    setActiveTab,
    setSelectedLessonId,
    setSelectedLabId,
    showToast,
  } = useLab();

  const totalLessons = LESSONS_DATA.length;
  const totalLabs = LABS_DATA.length;

  const practiceCorrect = practiceAttempts.filter((p) => p.correct).length;
  const practiceAccuracy =
    practiceAttempts.length > 0
      ? Math.round((practiceCorrect / practiceAttempts.length) * 100)
      : 0;

  // Personalized Coach recommendations based on recorded results
  const coachRecommendations = React.useMemo(() => {
    const list: { title: string; reason: string; lessonId: string; labId?: string }[] = [];

    if (completedLessons.length < 5) {
      list.push({
        title: 'Complete Foundational Lessons',
        reason: 'Master the Dirac notation, computational basis states, and superposition fundamentals.',
        lessonId: 'lesson-1',
        labId: 'lab-1',
      });
    }

    if (practiceAccuracy < 70 && practiceAttempts.length >= 3) {
      list.push({
        title: 'Review Hadamard & Interference',
        reason: 'Practice questions indicate uncertainty with phase conversion and cancellation.',
        lessonId: 'lesson-9',
        labId: 'lab-5',
      });
    }

    if (!completedLabs.includes('lab-6')) {
      list.push({
        title: 'Construct the Bell State Lab',
        reason: 'Entanglement is essential for multi-qubit algorithms. Experiment with CNOT and H gates.',
        lessonId: 'lesson-15',
        labId: 'lab-6',
      });
    }

    if (assessmentHistory.length === 0) {
      list.push({
        title: 'Attempt First 25-Question Examination',
        reason: 'Validate your grasp of single-qubit and multi-qubit quantum operations.',
        lessonId: 'lesson-7',
      });
    }

    return list;
  }, [completedLessons.length, practiceAccuracy, practiceAttempts.length, completedLabs, assessmentHistory.length]);

  const handleExportSummaryCSV = () => {
    const rows = [
      ['Metric', 'Value'],
      ['Completed Lessons', `${completedLessons.length} / ${totalLessons}`],
      ['Completed Labs', `${completedLabs.length} / ${totalLabs}`],
      ['Practice Attempts', practiceAttempts.length.toString()],
      ['Practice Accuracy', `${practiceAccuracy}%`],
      ['Total Assessments Taken', assessmentHistory.length.toString()],
      ['Current Activity Streak', `${streak} Days`],
    ];
    const csvContent = 'data:text/csv;charset=utf-8,' + rows.map((e) => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `quantumgate_analytics_summary.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    showToast('success', 'Summary Exported', 'Analytics CSV downloaded.');
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="p-6 sm:p-8 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-800/40 text-cyan-300 text-xs font-mono mb-2">
            <BarChart3 className="w-3.5 h-3.5 text-cyan-400" />
            <span>Telemetry & Performance Records</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white font-display tracking-tight">
            Learning Analytics & Personalized Coach
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Genuine educational statistics derived from your browser practice attempts, labs, and formal exams.
          </p>
        </div>

        <button
          onClick={handleExportSummaryCSV}
          className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-750 text-white rounded-xl text-xs font-medium border border-slate-700 transition-colors cursor-pointer"
        >
          <Download className="w-4 h-4 text-cyan-400" />
          <span>Export Summary (CSV)</span>
        </button>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>Lessons Completed</span>
            <BookOpen className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-bold text-white font-mono">
            {completedLessons.length} <span className="text-sm font-normal text-slate-500">/ {totalLessons}</span>
          </div>
          <div className="w-full h-1.5 bg-slate-950 rounded-full mt-3 overflow-hidden">
            <div
              className="h-full bg-cyan-400 rounded-full"
              style={{ width: `${(completedLessons.length / totalLessons) * 100}%` }}
            />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>Labs Verified</span>
            <FlaskConical className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-white font-mono">
            {completedLabs.length} <span className="text-sm font-normal text-slate-500">/ {totalLabs}</span>
          </div>
          <div className="w-full h-1.5 bg-slate-950 rounded-full mt-3 overflow-hidden">
            <div
              className="h-full bg-emerald-400 rounded-full"
              style={{ width: `${(completedLabs.length / totalLabs) * 100}%` }}
            />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>Practice Accuracy</span>
            <Target className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold text-white font-mono">
            {practiceAccuracy}%
          </div>
          <span className="text-[11px] text-slate-500 font-mono mt-2 block">
            {practiceCorrect} correct of {practiceAttempts.length}
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>Active Streak</span>
            <Flame className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-2xl font-bold text-white font-mono">
            {streak} <span className="text-sm font-normal text-slate-500">Days</span>
          </div>
          <span className="text-[11px] text-slate-500 font-mono mt-2 block">
            Daily engagement streak
          </span>
        </div>
      </div>

      {/* Personalized Improvement Coach Card */}
      <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/30 to-slate-900 border border-slate-800 space-y-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white font-display">
              Personalized Improvement Coach (Rule-Based Diagnostics)
            </h3>
            <p className="text-xs text-slate-400">
              Targeted action plan generated strictly from your real lab, lesson, and practice records.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
          {coachRecommendations.map((rec, i) => (
            <div
              key={i}
              className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col justify-between"
            >
              <div>
                <span className="text-xs font-bold text-cyan-300 block mb-1">
                  {i + 1}. {rec.title}
                </span>
                <p className="text-xs text-slate-400 leading-relaxed mb-3">
                  {rec.reason}
                </p>
              </div>

              <div className="flex items-center gap-2 pt-2 border-t border-slate-900">
                <button
                  onClick={() => {
                    setSelectedLessonId(rec.lessonId);
                    setActiveTab('academy');
                  }}
                  className="text-xs text-cyan-400 hover:text-cyan-300 font-medium flex items-center gap-1 cursor-pointer"
                >
                  <span>Open Lesson</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                {rec.labId && (
                  <button
                    onClick={() => {
                      setSelectedLabId(rec.labId!);
                      setActiveTab('quantum_labs');
                    }}
                    className="text-xs text-emerald-400 hover:text-emerald-300 font-medium flex items-center gap-1 cursor-pointer ml-auto"
                  >
                    <span>Open Lab</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Assessment History Trend */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
        <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider font-mono">
          Assessment Score Trend
        </h3>

        {assessmentHistory.length === 0 ? (
          <div className="py-12 text-center text-slate-500 text-xs font-mono">
            No formal assessments completed yet. Take a 25-question exam in Tests & Assessments to record score history.
          </div>
        ) : (
          <div className="space-y-2">
            {assessmentHistory.map((rec, idx) => (
              <div
                key={rec.id}
                className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs font-mono"
              >
                <div>
                  <span className="text-white font-semibold block">{rec.title}</span>
                  <span className="text-slate-500 text-[10px]">
                    Attempt #{assessmentHistory.length - idx} · {new Date(rec.date).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <span className={`font-bold block ${rec.passed ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {rec.score}/25 ({rec.percentage}%)
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {rec.passed ? 'Passed' : 'Needs Work'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

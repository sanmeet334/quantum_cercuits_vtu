import React, { useState } from 'react';
import {
  GraduationCap,
  Clock,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  ArrowRight,
  Sparkles,
  FlaskConical,
  Cpu,
  HelpCircle,
  Play,
} from 'lucide-react';
import { useLab } from '../context/LabContext';
import { LESSONS_DATA, Lesson } from '../data/lessonsData';
import { GateType } from '../quantum/types';

export const AcademyPage: React.FC = () => {
  const {
    selectedLessonId,
    setSelectedLessonId,
    completedLessons,
    toggleLessonCompleted,
    setSelectedGateId,
    setSelectedLabId,
    setActiveTab,
    setCurrentCircuit,
    showToast,
  } = useLab();

  const [activeLevel, setActiveLevel] = useState<'all' | 'beginner' | 'intermediate' | 'advanced'>('all');
  const [selectedQuizAnswer, setSelectedQuizAnswer] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);

  const activeLesson: Lesson =
    LESSONS_DATA.find((l) => l.id === selectedLessonId) || LESSONS_DATA[0];

  const currentIndex = LESSONS_DATA.findIndex((l) => l.id === activeLesson.id);
  const isCompleted = completedLessons.includes(activeLesson.id);

  const prevLesson = currentIndex > 0 ? LESSONS_DATA[currentIndex - 1] : null;
  const nextLesson = currentIndex < LESSONS_DATA.length - 1 ? LESSONS_DATA[currentIndex + 1] : null;

  const filteredLessons = LESSONS_DATA.filter((l) => {
    if (activeLevel === 'all') return true;
    return l.level === activeLevel;
  });

  const handleQuizSubmit = () => {
    if (selectedQuizAnswer === null) return;
    setQuizSubmitted(true);
    if (selectedQuizAnswer === activeLesson.knowledgeCheck.correctIndex) {
      if (!isCompleted) {
        toggleLessonCompleted(activeLesson.id);
        showToast('success', 'Lesson Completed!', `You earned completion credit for "${activeLesson.title}".`);
      }
    }
  };

  const handleLaunchExperiment = () => {
    const gates = activeLesson.interactiveExperiment.suggestedGates;
    setCurrentCircuit({
      id: `lesson_circ_${activeLesson.id}`,
      name: `${activeLesson.title} Experiment`,
      description: activeLesson.interactiveExperiment.description,
      qubitsCount: gates.some((g) => g === 'CX' || g === 'CZ' || g === 'SWAP') ? 2 : 1,
      classicalBitsCount: 2,
      gates: gates.map((g, idx) => ({
        id: `g_${idx}`,
        type: g,
        target: 0,
        control: g === 'CX' || g === 'CZ' ? 0 : undefined,
        col: idx,
      })),
    });
    setActiveTab('circuit_studio');
    showToast('info', 'Experiment Loaded', 'Opening circuit in Circuit Studio...');
  };

  return (
    <div className="flex flex-col lg:flex-row items-start gap-6 max-w-7xl mx-auto">
      {/* Left Column: Lesson Directory Navigation */}
      <div className="w-full lg:w-80 shrink-0 space-y-4">
        {/* Level Filters */}
        <div className="p-3 bg-slate-900 border border-slate-800 rounded-2xl">
          <div className="flex items-center justify-between text-xs text-slate-400 font-mono mb-2 px-1">
            <span>Filter Curriculum</span>
            <span className="text-cyan-400 font-bold">{completedLessons.length}/{LESSONS_DATA.length} Done</span>
          </div>
          <div className="grid grid-cols-4 gap-1 p-1 bg-slate-950 rounded-xl border border-slate-800/80">
            {(['all', 'beginner', 'intermediate', 'advanced'] as const).map((lvl) => (
              <button
                key={lvl}
                onClick={() => setActiveLevel(lvl)}
                className={`py-1.5 text-[11px] font-medium rounded-lg transition-colors cursor-pointer capitalize ${
                  activeLevel === lvl
                    ? 'bg-cyan-500 text-slate-950 font-semibold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {lvl === 'all' ? 'All' : lvl.substring(0, 3)}
              </button>
            ))}
          </div>
        </div>

        {/* Lesson List */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-2 max-h-[70vh] overflow-y-auto space-y-1 custom-scrollbar">
          {filteredLessons.map((lesson) => {
            const isSelected = lesson.id === activeLesson.id;
            const done = completedLessons.includes(lesson.id);

            const levelBadges = {
              beginner: 'text-cyan-400 bg-cyan-950/60 border-cyan-800/40',
              intermediate: 'text-indigo-400 bg-indigo-950/60 border-indigo-800/40',
              advanced: 'text-violet-400 bg-violet-950/60 border-violet-800/40',
            };

            return (
              <button
                key={lesson.id}
                onClick={() => {
                  setSelectedLessonId(lesson.id);
                  setSelectedQuizAnswer(null);
                  setQuizSubmitted(false);
                }}
                className={`w-full p-3 rounded-xl border text-left transition-all flex items-start gap-3 cursor-pointer ${
                  isSelected
                    ? 'bg-cyan-500/10 border-cyan-500/40 text-white shadow-sm'
                    : 'bg-slate-950/40 border-transparent text-slate-300 hover:bg-slate-800/60'
                }`}
              >
                <div className="mt-0.5 shrink-0">
                  {done ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <div className="w-4 h-4 rounded-full border border-slate-700 flex items-center justify-center text-[9px] font-mono text-slate-400">
                      {lesson.id.replace('lesson-', '')}
                    </div>
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <span className={`text-xs font-semibold block truncate ${isSelected ? 'text-cyan-300' : 'text-slate-200'}`}>
                    {lesson.title}
                  </span>
                  <div className="flex items-center gap-2 mt-1 text-[10px] text-slate-400 font-mono">
                    <span className={`px-1.5 py-0.5 rounded border uppercase text-[9px] ${levelBadges[lesson.level]}`}>
                      {lesson.level}
                    </span>
                    <span>{lesson.estimatedMinutes} min</span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Right Column: Full Lesson Content Reader */}
      <div className="flex-1 w-full space-y-6">
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 text-slate-100 shadow-xl">
          {/* Header metadata */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-6 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-1">
                <span className="uppercase tracking-wider">{activeLesson.level} Track</span>
                <span aria-hidden="true">·</span>
                <span className="flex items-center gap-1 text-slate-400">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{activeLesson.estimatedMinutes} min read</span>
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight font-display">
                {activeLesson.title}
              </h1>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => toggleLessonCompleted(activeLesson.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                  isCompleted
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                    : 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white'
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{isCompleted ? 'Completed' : 'Mark as Complete'}</span>
              </button>
            </div>
          </div>

          {/* Objectives Box */}
          <div className="my-6 p-4 rounded-xl bg-slate-950/60 border border-slate-800">
            <h3 className="text-xs font-semibold text-cyan-400 uppercase tracking-wider mb-2 font-mono flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Learning Objectives</span>
            </h3>
            <ul className="space-y-1.5 text-xs text-slate-300 list-disc list-inside leading-relaxed">
              {activeLesson.objectives.map((obj, i) => (
                <li key={i}>{obj}</li>
              ))}
            </ul>
          </div>

          {/* Main Prose Content */}
          <div className="prose prose-invert prose-cyan max-w-none text-sm text-slate-200 leading-relaxed space-y-4">
            {activeLesson.content.split('\n\n').map((paragraph, idx) => {
              if (paragraph.startsWith('### ')) {
                return (
                  <h3 key={idx} className="text-lg font-bold text-white font-display pt-2">
                    {paragraph.replace('### ', '')}
                  </h3>
                );
              }
              if (paragraph.startsWith('$$') && paragraph.endsWith('$$')) {
                return (
                  <div
                    key={idx}
                    className="p-3 my-3 rounded-xl bg-slate-950 border border-slate-800 font-mono text-cyan-300 text-center overflow-x-auto text-sm"
                  >
                    {paragraph.replace(/\$\$/g, '')}
                  </div>
                );
              }
              return (
                <p key={idx} className="leading-relaxed text-slate-300">
                  {paragraph}
                </p>
              );
            })}
          </div>

          {/* Interactive Mini-Experiment Sandbox */}
          <div className="mt-8 p-5 rounded-2xl bg-gradient-to-br from-slate-950 to-indigo-950/40 border border-indigo-900/40">
            <div className="flex items-center justify-between gap-3 mb-2">
              <div className="flex items-center gap-2">
                <FlaskConical className="w-4 h-4 text-cyan-400" />
                <h3 className="text-sm font-bold text-white font-display">
                  {activeLesson.interactiveExperiment.title}
                </h3>
              </div>
              <span className="text-xs font-mono text-indigo-300 bg-indigo-950/60 px-2 py-0.5 rounded border border-indigo-800/40">
                Interactive Experiment
              </span>
            </div>
            <p className="text-xs text-slate-300 mb-3 leading-relaxed">
              {activeLesson.interactiveExperiment.description}
            </p>
            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 mb-4 text-xs font-mono text-slate-300">
              <span className="text-slate-400 block text-[10px] uppercase">Experiment Instructions:</span>
              <p className="mt-0.5">{activeLesson.interactiveExperiment.instructions}</p>
            </div>
            <button
              onClick={handleLaunchExperiment}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 font-semibold text-xs rounded-xl shadow transition-all cursor-pointer"
            >
              <Play className="w-4 h-4" />
              <span>Launch Experiment in Circuit Studio</span>
            </button>
          </div>

          {/* Knowledge Check Quiz */}
          <div className="mt-8 p-6 rounded-2xl bg-slate-950/70 border border-slate-800">
            <div className="flex items-center gap-2 text-xs font-mono text-amber-400 mb-2">
              <HelpCircle className="w-4 h-4" />
              <span>Essential Knowledge Check</span>
            </div>
            <h3 className="text-sm font-bold text-white mb-4 leading-relaxed">
              {activeLesson.knowledgeCheck.question}
            </h3>

            <div className="space-y-2 mb-4">
              {activeLesson.knowledgeCheck.options.map((opt, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setSelectedQuizAnswer(idx);
                    setQuizSubmitted(false);
                  }}
                  className={`w-full p-3 rounded-xl border text-xs text-left transition-all flex items-start gap-3 cursor-pointer ${
                    selectedQuizAnswer === idx
                      ? 'border-cyan-500 bg-cyan-500/10 text-white'
                      : 'border-slate-800 bg-slate-900/60 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <span className="w-5 h-5 rounded-full border border-slate-700 flex items-center justify-center text-[10px] font-mono shrink-0">
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span className="leading-relaxed">{opt}</span>
                </button>
              ))}
            </div>

            {quizSubmitted && (
              <div
                className={`p-3.5 rounded-xl mb-4 text-xs leading-relaxed ${
                  selectedQuizAnswer === activeLesson.knowledgeCheck.correctIndex
                    ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-300'
                    : 'bg-rose-500/10 border border-rose-500/30 text-rose-300'
                }`}
              >
                <p className="font-bold mb-1">
                  {selectedQuizAnswer === activeLesson.knowledgeCheck.correctIndex
                    ? '✓ Correct Answer!'
                    : '✗ Incorrect Answer'}
                </p>
                <p className="text-slate-300">{activeLesson.knowledgeCheck.explanation}</p>
              </div>
            )}

            <button
              onClick={handleQuizSubmit}
              disabled={selectedQuizAnswer === null}
              className="py-2.5 px-5 bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-slate-950 font-semibold text-xs rounded-xl shadow transition-all cursor-pointer"
            >
              Check Answer
            </button>
          </div>

          {/* Related Links */}
          <div className="mt-8 pt-6 border-t border-slate-800 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
              <span>Related Gates:</span>
              {activeLesson.relatedGates.map((g) => (
                <button
                  key={g}
                  onClick={() => {
                    setSelectedGateId(g);
                    setActiveTab('gate_explorer');
                  }}
                  className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-cyan-400 border border-slate-700 transition-colors cursor-pointer"
                >
                  {g} Gate
                </button>
              ))}
            </div>

            {activeLesson.relatedLabId && (
              <button
                onClick={() => {
                  setSelectedLabId(activeLesson.relatedLabId!);
                  setActiveTab('quantum_labs');
                }}
                className="flex items-center gap-1.5 text-xs text-emerald-400 hover:text-emerald-300 font-medium cursor-pointer"
              >
                <FlaskConical className="w-3.5 h-3.5" />
                <span>Open Associated Lab</span>
              </button>
            )}
          </div>

          {/* Next / Previous Controls */}
          <div className="mt-8 pt-6 border-t border-slate-800 flex items-center justify-between">
            {prevLesson ? (
              <button
                onClick={() => {
                  setSelectedLessonId(prevLesson.id);
                  setSelectedQuizAnswer(null);
                  setQuizSubmitted(false);
                }}
                className="flex items-center gap-2 px-4 py-2 text-xs text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-750 rounded-xl transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Prev: {prevLesson.title}</span>
              </button>
            ) : (
              <div />
            )}

            {nextLesson && (
              <button
                onClick={() => {
                  setSelectedLessonId(nextLesson.id);
                  setSelectedQuizAnswer(null);
                  setQuizSubmitted(false);
                }}
                className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-950 bg-cyan-500 hover:bg-cyan-400 rounded-xl shadow transition-colors cursor-pointer"
              >
                <span>Next: {nextLesson.title}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

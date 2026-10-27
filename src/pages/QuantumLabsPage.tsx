import React, { useState, useMemo } from 'react';
import {
  FlaskConical,
  Clock,
  CheckCircle2,
  Play,
  RotateCcw,
  Sparkles,
  HelpCircle,
  Lightbulb,
  ArrowRight,
  ChevronRight,
  ChevronLeft,
  Check,
} from 'lucide-react';
import { useLab } from '../context/LabContext';
import { LABS_DATA, QuantumLab } from '../data/labsData';
import { QuantumSimulator } from '../quantum/simulator';
import { ProbabilityChart } from '../components/common/ProbabilityChart';
import { CircuitModel } from '../quantum/types';

export const QuantumLabsPage: React.FC = () => {
  const {
    selectedLabId,
    setSelectedLabId,
    completedLabs,
    markLabCompleted,
    setCurrentCircuit,
    setActiveTab,
    showToast,
  } = useLab();

  const activeLab: QuantumLab =
    LABS_DATA.find((l) => l.id === selectedLabId) || LABS_DATA[0];

  const currentIndex = LABS_DATA.findIndex((l) => l.id === activeLab.id);
  const isDone = completedLabs.includes(activeLab.id);

  // Editable circuit state for active lab
  const [labCircuit, setLabCircuit] = useState<CircuitModel>(activeLab.initialCircuit);

  // Reset circuit if user switches labs
  React.useEffect(() => {
    setLabCircuit(activeLab.initialCircuit);
    setUserAnswers({});
    setQuestionsChecked(false);
  }, [activeLab.id]);

  // Questions state
  const [userAnswers, setUserAnswers] = useState<Record<string, number>>({});
  const [questionsChecked, setQuestionsChecked] = useState(false);
  const [showHints, setShowHints] = useState(false);

  // Run simulation
  const simulation = useMemo(() => {
    return QuantumSimulator.simulate(labCircuit, 1024);
  }, [labCircuit]);

  const handleResetCircuit = () => {
    setLabCircuit(activeLab.initialCircuit);
    showToast('info', 'Circuit Reset', 'Restored initial lab circuit layout.');
  };

  const handleOpenInStudio = () => {
    setCurrentCircuit(labCircuit);
    setActiveTab('circuit_studio');
    showToast('info', 'Opened in Studio', 'You can now freely edit, wire, and modify this experiment.');
  };

  const handleCheckQuestions = () => {
    if (Object.keys(userAnswers).length < activeLab.questions.length) {
      showToast('error', 'Incomplete Answers', 'Please answer all questions before submitting.');
      return;
    }
    setQuestionsChecked(true);

    const allCorrect = activeLab.questions.every(
      (q) => userAnswers[q.id] === q.correctIndex
    );

    if (allCorrect) {
      markLabCompleted(activeLab.id);
    } else {
      showToast('info', 'Review Answers', 'Some answers need review. Check explanations below.');
    }
  };

  const prevLab = currentIndex > 0 ? LABS_DATA[currentIndex - 1] : null;
  const nextLab = currentIndex < LABS_DATA.length - 1 ? LABS_DATA[currentIndex + 1] : null;

  return (
    <div className="flex flex-col lg:flex-row items-start gap-6 max-w-7xl mx-auto">
      {/* Left Column: 12 Labs Directory */}
      <div className="w-full lg:w-80 shrink-0 space-y-4">
        <div className="p-4 bg-white border border-slate-200 rounded-2xl">
          <div className="flex items-center justify-between text-xs text-slate-500 font-mono mb-2">
            <span>Guided Laboratories</span>
            <span className="text-blue-600 font-bold">{completedLabs.length}/{LABS_DATA.length} Passed</span>
          </div>

          <div className="space-y-1.5 max-h-[72vh] overflow-y-auto custom-scrollbar p-1">
            {LABS_DATA.map((lab) => {
              const isSelected = lab.id === activeLab.id;
              const done = completedLabs.includes(lab.id);

              return (
                <button
                  key={lab.id}
                  onClick={() => setSelectedLabId(lab.id)}
                  className={`w-full p-3 rounded-xl border text-left transition-all flex items-start gap-3 cursor-pointer ${
                    isSelected
                      ? 'bg-blue-50 border-blue-300 text-slate-900 shadow-sm'
                      : 'bg-slate-50/70 border-transparent text-slate-700 hover:bg-slate-100/60'
                  }`}
                >
                  <div className="mt-0.5 shrink-0">
                    {done ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <div className="w-4 h-4 rounded-full border border-slate-200 flex items-center justify-center text-[9px] font-mono text-slate-500">
                        {lab.order}
                      </div>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <span className={`text-xs font-semibold block truncate ${isSelected ? 'text-blue-700' : 'text-slate-800'}`}>
                      {lab.title}
                    </span>
                    <span className="text-[10px] text-slate-500 block font-mono mt-0.5">
                      {lab.estimatedMinutes} min · {lab.prerequisites[0]}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Right Column: Active Laboratory Workbench */}
      <div className="flex-1 w-full space-y-6">
        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 text-slate-900 shadow-xl space-y-6">
          {/* Header */}
          <div className="flex flex-wrap items-start justify-between gap-4 pb-6 border-b border-slate-200">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-blue-600 mb-1">
                <span>Experiment #{activeLab.order} of 12</span>
                <span aria-hidden="true">·</span>
                <span className="flex items-center gap-1 text-slate-500">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{activeLab.estimatedMinutes} min</span>
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight font-display">
                {activeLab.title}
              </h1>
            </div>

            <div className="flex items-center gap-2">
              {isDone && (
                <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-medium font-mono">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Completed</span>
                </span>
              )}
              <button
                onClick={handleOpenInStudio}
                className="flex items-center gap-1.5 px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 transition-colors cursor-pointer"
              >
                <span>Open in Studio</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Objectives & Instructions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider block font-mono">
                Learning Objectives:
              </span>
              <ul className="space-y-1 text-xs text-slate-700 list-disc list-inside leading-relaxed">
                {activeLab.objectives.map((obj, i) => (
                  <li key={i}>{obj}</li>
                ))}
              </ul>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider block font-mono">
                Laboratory Protocol:
              </span>
              <ol className="space-y-1 text-xs text-slate-700 list-decimal list-inside leading-relaxed">
                {activeLab.instructions.map((ins, i) => (
                  <li key={i}>{ins}</li>
                ))}
              </ol>
            </div>
          </div>

          {/* Interactive Lab Circuit Simulation Canvas */}
          <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-950 to-indigo-950/30 border border-slate-200 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Play className="w-4 h-4 text-blue-600" />
                <span>Active Experiment Circuit & Simulation Output</span>
              </h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleResetCircuit}
                  className="flex items-center gap-1 px-2.5 py-1 text-xs text-slate-500 hover:text-slate-900 bg-white border border-slate-200 rounded-lg cursor-pointer"
                  title="Reset initial circuit"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset</span>
                </button>
              </div>
            </div>

            {/* Circuit ASCII Representation */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 font-mono text-xs text-blue-700 overflow-x-auto">
              <span className="text-slate-500 text-[10px] uppercase block mb-1">
                Active Gate Sequence:
              </span>
              <div className="flex items-center gap-2 flex-wrap">
                {labCircuit.gates.map((g, idx) => (
                  <span
                    key={g.id}
                    className="px-2 py-1 rounded bg-white border border-slate-200 text-blue-700 font-bold"
                  >
                    {idx + 1}. {g.type} on q[{g.target}]
                    {g.control !== undefined ? ` (ctrl: q[${g.control}])` : ''}
                  </span>
                ))}
              </div>
            </div>

            {/* Expected vs Actual Results Table */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-slate-500 uppercase text-[10px]">Expected Theory:</span>
                <span className="text-slate-500">{activeLab.expectedTheoreticalResult.description}</span>
              </div>
            </div>

            {/* Probability Chart */}
            <ProbabilityChart
              basisStates={simulation.basisStates}
              probabilities={simulation.probabilities}
              counts={simulation.counts}
              shots={1024}
            />
          </div>

          {/* Hints Section */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <button
              onClick={() => setShowHints(!showHints)}
              className="w-full flex items-center justify-between text-xs text-amber-400 font-mono cursor-pointer"
            >
              <span className="flex items-center gap-1.5 font-bold">
                <Lightbulb className="w-4 h-4" />
                <span>Laboratory Hints ({activeLab.hints.length})</span>
              </span>
              <span className="text-slate-500 text-[11px]">{showHints ? 'Hide' : 'Reveal Hints'}</span>
            </button>
            {showHints && (
              <ul className="mt-3 space-y-1.5 text-xs text-slate-700 list-disc list-inside leading-relaxed pt-2 border-t border-slate-200">
                {activeLab.hints.map((h, i) => (
                  <li key={i}>{h}</li>
                ))}
              </ul>
            )}
          </div>

          {/* Interactive Questions & Certification */}
          <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 font-display">
                <HelpCircle className="w-4 h-4 text-blue-600" />
                <span>Laboratory Certification Check</span>
              </h3>
              <span className="text-xs font-mono text-slate-500">
                Answer correctly to earn completion credit
              </span>
            </div>

            <div className="space-y-4">
              {activeLab.questions.map((q, qIndex) => (
                <div key={q.id} className="p-4 rounded-xl bg-white border border-slate-200 space-y-3">
                  <p className="text-xs font-bold text-slate-900 leading-relaxed">
                    {qIndex + 1}. {q.question}
                  </p>
                  <div className="space-y-1.5">
                    {q.options.map((opt, optIndex) => (
                      <button
                        key={optIndex}
                        onClick={() => {
                          setUserAnswers((prev) => ({ ...prev, [q.id]: optIndex }));
                          setQuestionsChecked(false);
                        }}
                        className={`w-full p-2.5 rounded-lg border text-xs text-left transition-all flex items-start gap-2.5 cursor-pointer ${
                          userAnswers[q.id] === optIndex
                            ? 'border-cyan-500 bg-blue-50 text-slate-900'
                            : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-200'
                        }`}
                      >
                        <span className="w-4 h-4 rounded-full border border-slate-200 flex items-center justify-center text-[9px] font-mono shrink-0">
                          {String.fromCharCode(65 + optIndex)}
                        </span>
                        <span className="leading-relaxed">{opt}</span>
                      </button>
                    ))}
                  </div>

                  {questionsChecked && (
                    <div
                      className={`p-3 rounded-lg text-xs leading-relaxed ${
                        userAnswers[q.id] === q.correctIndex
                          ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-300'
                          : 'bg-rose-500/10 border border-rose-500/20 text-rose-300'
                      }`}
                    >
                      <p className="font-bold mb-0.5">
                        {userAnswers[q.id] === q.correctIndex ? '✓ Correct' : '✗ Incorrect'}
                      </p>
                      <p className="text-slate-700">{q.explanation}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <button
              onClick={handleCheckQuestions}
              className="py-2.5 px-5 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md shadow-blue-500/20 font-semibold text-xs rounded-xl shadow transition-all cursor-pointer"
            >
              Verify Answers & Complete Lab
            </button>
          </div>

          {/* Navigation Prev / Next */}
          <div className="pt-6 border-t border-slate-200 flex items-center justify-between">
            {prevLab ? (
              <button
                onClick={() => setSelectedLabId(prevLab.id)}
                className="flex items-center gap-2 px-4 py-2 text-xs text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-750 rounded-xl transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Prev Lab: {prevLab.title}</span>
              </button>
            ) : (
              <div />
            )}

            {nextLab && (
              <button
                onClick={() => setSelectedLabId(nextLab.id)}
                className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-950 bg-cyan-500 hover:bg-cyan-400 rounded-xl shadow transition-colors cursor-pointer"
              >
                <span>Next Lab: {nextLab.title}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

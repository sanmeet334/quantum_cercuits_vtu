import React, { useState, useEffect } from 'react';
import { Search, X, Cpu, GraduationCap, FlaskConical, BookMarked, ArrowRight, Bot, Sparkles } from 'lucide-react';
import { useLab } from '../../context/LabContext';
import { GATES_DATA } from '../../data/gatesData';
import { LESSONS_DATA } from '../../data/lessonsData';
import { LABS_DATA } from '../../data/labsData';
import { GLOSSARY_DATA } from '../../data/glossaryData';
import { GateType } from '../../quantum/types';

export const SearchModal: React.FC = () => {
  const {
    searchModalOpen,
    setSearchModalOpen,
    setActiveTab,
    setSelectedGateId,
    setSelectedLessonId,
    setSelectedLabId,
  } = useLab();

  const [query, setQuery] = useState('');

  // Keyboard shortcut ⌘K / Ctrl+K & Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchModalOpen(true);
      }
      if (e.key === 'Escape' && searchModalOpen) {
        setSearchModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [searchModalOpen, setSearchModalOpen]);

  if (!searchModalOpen) return null;

  const q = query.toLowerCase().trim();

  // Search Gates
  const filteredGates = Object.values(GATES_DATA).filter(
    (g) =>
      !q ||
      g.name.toLowerCase().includes(q) ||
      g.symbol.toLowerCase().includes(q) ||
      g.definition.toLowerCase().includes(q)
  );

  // Search Lessons
  const filteredLessons = LESSONS_DATA.filter(
    (l) =>
      !q ||
      l.title.toLowerCase().includes(q) ||
      l.summary.toLowerCase().includes(q)
  );

  // Search Labs
  const filteredLabs = LABS_DATA.filter(
    (lab) =>
      !q ||
      lab.title.toLowerCase().includes(q) ||
      lab.objectives.some((obj) => obj.toLowerCase().includes(q))
  );

  // Search Glossary
  const filteredGlossary = GLOSSARY_DATA.filter(
    (t) =>
      !q ||
      t.term.toLowerCase().includes(q) ||
      t.shortDef.toLowerCase().includes(q)
  );

  const totalResults =
    filteredGates.length + filteredLessons.length + filteredLabs.length + filteredGlossary.length;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 p-4 bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-150">
      <div className="relative w-full max-w-2xl bg-white border border-slate-200 shadow-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-slate-200 bg-white">
          <Search className="w-5 h-5 text-blue-600 shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search all quantum gates, lessons, labs, glossary..."
            className="flex-1 bg-transparent text-sm text-slate-900 placeholder-slate-500 outline-none font-sans"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-slate-500 hover:text-slate-900 rounded"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={() => setSearchModalOpen(false)}
            className="px-2 py-1 text-xs text-slate-500 hover:text-slate-900 bg-slate-800 rounded-md cursor-pointer"
          >
            Esc
          </button>
        </div>

        {/* Results List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar">
          {/* Quick AI Tutor match */}
          {(!q || 'quantum ai tutor bot chat assistant help ask'.includes(q)) && (
            <div className="p-3 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center">
                  <Bot className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-900 block">Quantum AI Tutor</span>
                  <span className="text-[11px] text-slate-600">Ask questions about gates, circuits, tests, and recommendations</span>
                </div>
              </div>
              <button
                onClick={() => {
                  setActiveTab('ai_tutor');
                  setSearchModalOpen(false);
                }}
                className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors"
              >
                <span>Open Tutor</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {totalResults === 0 && q && !'quantum ai tutor bot chat assistant help ask'.includes(q) ? (
            <div className="py-12 text-center text-slate-500 text-sm">
              No results found for &ldquo;<span className="text-slate-900">{query}</span>&rdquo;
            </div>
          ) : (
            <>
              {/* Quantum Gates */}
              {filteredGates.length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5 font-mono">
                    <Cpu className="w-3.5 h-3.5 text-blue-600" />
                    <span>Quantum Gates ({filteredGates.length})</span>
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {filteredGates.slice(0, 6).map((g) => (
                      <button
                        key={g.id}
                        onClick={() => {
                          setSelectedGateId(g.id as GateType);
                          setActiveTab('gate_explorer');
                          setSearchModalOpen(false);
                        }}
                        className="flex items-center justify-between p-2.5 rounded-xl bg-white/60 hover:bg-slate-50 border border-slate-100 transition-all text-left group cursor-pointer"
                      >
                        <div className="min-w-0">
                          <span className="text-xs font-semibold text-slate-900 block truncate group-hover:text-blue-700">
                            {g.name} ({g.symbol})
                          </span>
                          <span className="text-[11px] text-slate-500 block truncate">
                            {g.definition}
                          </span>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-blue-600 shrink-0 ml-2" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Academy Lessons */}
              {filteredLessons.length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5 font-mono">
                    <GraduationCap className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Academy Lessons ({filteredLessons.length})</span>
                  </h4>
                  <div className="space-y-1.5">
                    {filteredLessons.slice(0, 4).map((l) => (
                      <button
                        key={l.id}
                        onClick={() => {
                          setSelectedLessonId(l.id);
                          setActiveTab('academy');
                          setSearchModalOpen(false);
                        }}
                        className="w-full flex items-center justify-between p-2.5 rounded-xl bg-white/60 hover:bg-slate-50 border border-slate-100 transition-all text-left group cursor-pointer"
                      >
                        <div className="min-w-0">
                          <span className="text-xs font-semibold text-slate-900 block truncate group-hover:text-indigo-300">
                            {l.title}
                          </span>
                          <span className="text-[11px] text-slate-500 block truncate">
                            {l.summary}
                          </span>
                        </div>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-slate-500 uppercase ml-2 shrink-0">
                          {l.level}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Guided Labs */}
              {filteredLabs.length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5 font-mono">
                    <FlaskConical className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Guided Labs ({filteredLabs.length})</span>
                  </h4>
                  <div className="space-y-1.5">
                    {filteredLabs.slice(0, 3).map((lab) => (
                      <button
                        key={lab.id}
                        onClick={() => {
                          setSelectedLabId(lab.id);
                          setActiveTab('quantum_labs');
                          setSearchModalOpen(false);
                        }}
                        className="w-full flex items-center justify-between p-2.5 rounded-xl bg-white/60 hover:bg-slate-50 border border-slate-100 transition-all text-left group cursor-pointer"
                      >
                        <div className="min-w-0">
                          <span className="text-xs font-semibold text-slate-900 block truncate group-hover:text-emerald-300">
                            {lab.title}
                          </span>
                          <span className="text-[11px] text-slate-500 block truncate">
                            {lab.objectives[0]}
                          </span>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-emerald-400 shrink-0 ml-2" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Glossary Terms */}
              {filteredGlossary.length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5 font-mono">
                    <BookMarked className="w-3.5 h-3.5 text-amber-400" />
                    <span>Glossary Definitions ({filteredGlossary.length})</span>
                  </h4>
                  <div className="space-y-1.5">
                    {filteredGlossary.slice(0, 3).map((term) => (
                      <div
                        key={term.term}
                        className="p-2.5 rounded-xl bg-white/60 border border-slate-100 text-left"
                      >
                        <span className="text-xs font-semibold text-amber-300 block">
                          {term.term}
                        </span>
                        <span className="text-[11px] text-slate-700 block leading-relaxed mt-0.5">
                          {term.shortDef}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

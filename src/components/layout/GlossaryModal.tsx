import React, { useState, useEffect } from 'react';
import { BookOpen, Search, X, Cpu, Tag, ExternalLink } from 'lucide-react';
import { useLab } from '../../context/LabContext';
import { GLOSSARY_DATA, GlossaryTerm } from '../../data/glossaryData';
import { GateType } from '../../quantum/types';

export const GlossaryModal: React.FC = () => {
  const {
    glossaryModalOpen,
    setGlossaryModalOpen,
    setActiveTab,
    setSelectedGateId,
  } = useLab();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && glossaryModalOpen) {
        setGlossaryModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [glossaryModalOpen, setGlossaryModalOpen]);

  if (!glossaryModalOpen) return null;

  const categories = [
    { id: 'all', label: 'All Terms' },
    { id: 'core', label: 'Core Principles' },
    { id: 'math', label: 'Linear Algebra & Phase' },
    { id: 'hardware', label: 'QPU & Hardware' },
    { id: 'protocol', label: 'Quantum Protocols' },
  ];

  const q = searchQuery.toLowerCase().trim();

  const filteredTerms = GLOSSARY_DATA.filter((term: GlossaryTerm) => {
    const matchesCategory =
      selectedCategory === 'all' || term.category === selectedCategory;
    const matchesQuery =
      !q ||
      term.term.toLowerCase().includes(q) ||
      term.shortDef.toLowerCase().includes(q) ||
      term.detailedDef.toLowerCase().includes(q) ||
      term.relatedGates?.some((g) => g.toLowerCase().includes(q));
    return matchesCategory && matchesQuery;
  });

  const handleGateClick = (gateSymbol: string) => {
    // Attempt to match symbol to gate ID
    const symbolMap: Record<string, GateType> = {
      H: 'H',
      X: 'X',
      Y: 'Y',
      Z: 'Z',
      S: 'S',
      T: 'T',
      RX: 'RX',
      RY: 'RY',
      RZ: 'RZ',
      CX: 'CX',
      CNOT: 'CX',
      CZ: 'CZ',
      SWAP: 'SWAP',
      CCX: 'CCX',
    };
    const gateId = symbolMap[gateSymbol] || 'H';
    setSelectedGateId(gateId);
    setActiveTab('gate_explorer');
    setGlossaryModalOpen(false);
  };

  const getCategoryBadgeClass = (category: string) => {
    switch (category) {
      case 'core':
        return 'bg-blue-50 text-blue-600 border-blue-200';
      case 'math':
        return 'bg-purple-500/10 text-purple-400 border-purple-500/30';
      case 'hardware':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      case 'protocol':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      default:
        return 'bg-slate-100 text-slate-600 border-slate-300';
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="glossary-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-200"
      onClick={() => setGlossaryModalOpen(false)}
    >
      <div
        className="relative w-full max-w-3xl max-h-[85vh] flex flex-col bg-white border border-slate-200 shadow-2xl rounded-2xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2
                id="glossary-title"
                className="text-lg font-bold text-slate-900 flex items-center gap-2"
              >
                Quantum Terminology Glossary
                <span className="text-xs px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 border border-blue-200 font-mono">
                  {filteredTerms.length} terms
                </span>
              </h2>
              <p className="text-xs text-slate-600">
                Authoritative reference of quantum mechanical concepts, definitions, and equations
              </p>
            </div>
          </div>
          <button
            onClick={() => setGlossaryModalOpen(false)}
            className="p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors"
            aria-label="Close glossary"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Filter Toolbar */}
        <div className="p-4 border-b border-slate-200 bg-slate-900/90 space-y-3">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search concepts (e.g., superposition, amplitude, Born rule, decoherence)..."
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
              autoFocus
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-600 hover:text-slate-200"
              >
                Clear
              </button>
            )}
          </div>

          <div className="flex flex-wrap gap-2 pt-1">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`text-xs px-3 py-1 rounded-lg border font-medium transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-blue-100 text-blue-700 border-blue-300'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-slate-300 hover:text-slate-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Terms List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 divide-y divide-slate-800/50">
          {filteredTerms.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <h3 className="text-sm font-semibold text-slate-700">
                No matching terminology found
              </h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                Try searching for general keywords like "qubit", "entanglement", "phase", or switch categories.
              </p>
            </div>
          ) : (
            filteredTerms.map((t, idx) => (
              <div
                key={t.term}
                className={`pt-4 first:pt-0 space-y-2 group transition-all`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-semibold text-slate-900 group-hover:text-blue-700 transition-colors">
                      {t.term}
                    </h3>
                    <span
                      className={`text-[10px] uppercase font-mono px-2 py-0.5 rounded border ${getCategoryBadgeClass(
                        t.category
                      )}`}
                    >
                      {t.category}
                    </span>
                  </div>
                </div>

                <p className="text-sm text-blue-800 font-medium">
                  {t.shortDef}
                </p>

                <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-200 font-sans">
                  {t.detailedDef}
                </p>

                {t.relatedGates && t.relatedGates.length > 0 && (
                  <div className="flex items-center gap-2 pt-1 text-xs text-slate-600">
                    <span className="flex items-center gap-1 text-[11px] text-slate-500">
                      <Tag className="w-3 h-3" />
                      Associated Gates:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {t.relatedGates.map((g) => (
                        <button
                          key={g}
                          onClick={() => handleGateClick(g)}
                          className="px-2 py-0.5 bg-slate-100 hover:bg-blue-100 hover:text-blue-700 text-slate-700 rounded border border-slate-300 hover:border-blue-300 font-mono text-[11px] flex items-center gap-1 transition-colors"
                          title={`Explore ${g} Gate in Gate Explorer`}
                        >
                          <Cpu className="w-3 h-3 text-blue-600" />
                          {g}
                          <ExternalLink className="w-2.5 h-2.5 opacity-60" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-slate-200 bg-slate-50/70 flex items-center justify-between text-xs text-slate-600 px-6">
          <span>Press <kbd className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-300 font-mono text-[10px]">Esc</kbd> to dismiss</span>
          <button
            onClick={() => {
              setGlossaryModalOpen(false);
              setActiveTab('academy');
            }}
            className="text-blue-600 hover:text-blue-700 flex items-center gap-1 hover:underline"
          >
            Open Quantum Academy lessons →
          </button>
        </div>
      </div>
    </div>
  );
};

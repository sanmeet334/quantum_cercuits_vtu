import React, { useState } from 'react';
import { BarChart3, Layers, Percent, Hash } from 'lucide-react';

export interface ProbabilityChartProps {
  basisStates: string[];
  probabilities: number[];
  counts?: Record<string, number>;
  shots?: number;
  title?: string;
  showComparison?: boolean;
}

export const ProbabilityChart: React.FC<ProbabilityChartProps> = ({
  basisStates,
  probabilities,
  counts,
  shots = 1024,
  title = 'Measurement Probability Distribution',
  showComparison = true,
}) => {
  const [viewMode, setViewMode] = useState<'both' | 'prob' | 'counts'>(
    counts && Object.keys(counts).length > 0 ? 'both' : 'prob'
  );

  const hasCounts = counts && Object.keys(counts).length > 0;

  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
            <BarChart3 className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-mono">
              {title}
            </h3>
            <p className="text-[11px] text-slate-500">
              Born Rule: <span className="font-mono text-blue-700 font-semibold">P(x) = |⟨x|ψ⟩|²</span>
            </p>
          </div>
        </div>

        {/* View mode toggle */}
        {hasCounts && showComparison && (
          <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-[10px] font-mono">
            <button
              onClick={() => setViewMode('both')}
              className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
                viewMode === 'both'
                  ? 'bg-white text-blue-700 font-bold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Side-by-Side
            </button>
            <button
              onClick={() => setViewMode('prob')}
              className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
                viewMode === 'prob'
                  ? 'bg-white text-blue-700 font-bold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Theory %
            </button>
            <button
              onClick={() => setViewMode('counts')}
              className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
                viewMode === 'counts'
                  ? 'bg-white text-blue-700 font-bold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Shots ({shots})
            </button>
          </div>
        )}
      </div>

      {/* Chart Canvas Area */}
      <div className="py-4">
        {basisStates.length === 0 ? (
          <div className="py-8 text-center text-slate-500 text-xs font-mono">
            No quantum states to evaluate
          </div>
        ) : (
          <div className="space-y-3">
            {basisStates.map((state, index) => {
              const prob = probabilities[index] || 0;
              const probPercent = (prob * 100).toFixed(1);
              const count = counts ? counts[state] || 0 : 0;
              const sampledFreq = shots > 0 ? (count / shots) * 100 : 0;

              const probWidth = Math.min(100, Math.max(0, (prob / 1.0) * 100));
              const countWidth = shots > 0 ? Math.min(100, (count / shots) * 100) : 0;

              return (
                <div key={state} className="group">
                  <div className="flex items-center justify-between text-xs font-mono mb-1.5">
                    <span className="text-slate-900 font-bold px-2 py-0.5 rounded bg-slate-100 border border-slate-200">
                      |{state}⟩
                    </span>
                    <div className="flex items-center gap-3 text-[11px]">
                      {(viewMode === 'both' || viewMode === 'prob') && (
                        <span className="text-blue-700 font-semibold">
                          Theory: {probPercent}%
                        </span>
                      )}
                      {hasCounts && (viewMode === 'both' || viewMode === 'counts') && (
                        <span className="text-emerald-700 font-medium">
                          Sampled: {count} ({sampledFreq.toFixed(1)}%)
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Dual Bar Representation */}
                  <div className="space-y-1">
                    {(viewMode === 'both' || viewMode === 'prob') && (
                      <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200">
                        <div
                          className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full transition-all duration-500 shadow-xs"
                          style={{ width: `${probWidth}%` }}
                        />
                      </div>
                    )}

                    {hasCounts && (viewMode === 'both' || viewMode === 'counts') && (
                      <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200">
                        <div
                          className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-500"
                          style={{ width: `${countWidth}%` }}
                        />
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Chart Footer / Legend */}
      <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-[11px] text-slate-500 font-mono">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600 inline-block" />
            <span className="text-slate-700 font-medium">Theoretical |⟨x|ψ⟩|²</span>
          </div>
          {hasCounts && (
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
              <span className="text-slate-700 font-medium">Sampled Counts ({shots} shots)</span>
            </div>
          )}
        </div>

        <span className="text-[10px] text-slate-500 font-semibold">
          Σ P(x) = {probabilities.reduce((a, b) => a + b, 0).toFixed(3)}
        </span>
      </div>
    </div>
  );
};

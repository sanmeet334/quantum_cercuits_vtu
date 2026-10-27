import React, { useState, useMemo } from 'react';
import {
  Share2,
  Atom,
  Sparkles,
  ArrowRight,
  RotateCcw,
  ShieldCheck,
  Zap,
  Info,
  CheckCircle2,
} from 'lucide-react';
import { useLab } from '../context/LabContext';
import { QuantumSimulator } from '../quantum/simulator';
import { CircuitModel } from '../quantum/types';
import { ProbabilityChart } from '../components/common/ProbabilityChart';
import { C } from '../quantum/complex';

type EntangledPreset = 'phi_plus' | 'phi_minus' | 'psi_plus' | 'psi_minus' | 'ghz_3qubit' | 'separable_product';

export const EntanglementPage: React.FC = () => {
  const { unlockAchievement, showToast } = useLab();

  const [activePreset, setActivePreset] = useState<EntangledPreset>('phi_plus');
  const [shots, setShots] = useState<number>(1024);

  // Build circuit based on preset
  const circuit: CircuitModel = useMemo(() => {
    switch (activePreset) {
      case 'phi_plus':
        // |Φ⁺⟩ = (|00⟩ + |11⟩)/√2
        return {
          id: 'ent_phi_plus',
          name: 'Bell State |Φ⁺⟩',
          qubitsCount: 2,
          classicalBitsCount: 2,
          gates: [
            { id: 'g0', type: 'H', target: 0, col: 0 },
            { id: 'g1', type: 'CX', control: 0, target: 1, col: 1 },
            { id: 'g2', type: 'MEASURE', target: 0, classicalBit: 0, col: 2 },
            { id: 'g3', type: 'MEASURE', target: 1, classicalBit: 1, col: 2 },
          ],
        };

      case 'phi_minus':
        // |Φ⁻⟩ = (|00⟩ - |11⟩)/√2
        return {
          id: 'ent_phi_minus',
          name: 'Bell State |Φ⁻⟩',
          qubitsCount: 2,
          classicalBitsCount: 2,
          gates: [
            { id: 'g0', type: 'X', target: 0, col: 0 },
            { id: 'g1', type: 'H', target: 0, col: 1 },
            { id: 'g2', type: 'CX', control: 0, target: 1, col: 2 },
            { id: 'g3', type: 'MEASURE', target: 0, classicalBit: 0, col: 3 },
            { id: 'g4', type: 'MEASURE', target: 1, classicalBit: 1, col: 3 },
          ],
        };

      case 'psi_plus':
        // |Ψ⁺⟩ = (|01⟩ + |10⟩)/√2
        return {
          id: 'ent_psi_plus',
          name: 'Bell State |Ψ⁺⟩',
          qubitsCount: 2,
          classicalBitsCount: 2,
          gates: [
            { id: 'g0', type: 'H', target: 0, col: 0 },
            { id: 'g1', type: 'X', target: 1, col: 0 },
            { id: 'g2', type: 'CX', control: 0, target: 1, col: 1 },
            { id: 'g3', type: 'MEASURE', target: 0, classicalBit: 0, col: 2 },
            { id: 'g4', type: 'MEASURE', target: 1, classicalBit: 1, col: 2 },
          ],
        };

      case 'psi_minus':
        // |Ψ⁻⟩ = (|01⟩ - |10⟩)/√2
        return {
          id: 'ent_psi_minus',
          name: 'Bell State |Ψ⁻⟩',
          qubitsCount: 2,
          classicalBitsCount: 2,
          gates: [
            { id: 'g0', type: 'X', target: 0, col: 0 },
            { id: 'g1', type: 'H', target: 0, col: 1 },
            { id: 'g2', type: 'X', target: 1, col: 1 },
            { id: 'g3', type: 'CX', control: 0, target: 1, col: 2 },
            { id: 'g4', type: 'MEASURE', target: 0, classicalBit: 0, col: 3 },
            { id: 'g5', type: 'MEASURE', target: 1, classicalBit: 1, col: 3 },
          ],
        };

      case 'ghz_3qubit':
        // |GHZ⟩ = (|000⟩ + |111⟩)/√2
        return {
          id: 'ent_ghz',
          name: '3-Qubit GHZ State',
          qubitsCount: 3,
          classicalBitsCount: 3,
          gates: [
            { id: 'g0', type: 'H', target: 0, col: 0 },
            { id: 'g1', type: 'CX', control: 0, target: 1, col: 1 },
            { id: 'g2', type: 'CX', control: 1, target: 2, col: 2 },
            { id: 'g3', type: 'MEASURE', target: 0, classicalBit: 0, col: 3 },
            { id: 'g4', type: 'MEASURE', target: 1, classicalBit: 1, col: 3 },
            { id: 'g5', type: 'MEASURE', target: 2, classicalBit: 2, col: 3 },
          ],
        };

      case 'separable_product':
      default:
        // |+⟩ ⊗ |0⟩ = (|00⟩ + |10⟩)/√2 (Separable / Unentangled)
        return {
          id: 'sep_product',
          name: 'Separable Product State |+⟩ ⊗ |0⟩',
          qubitsCount: 2,
          classicalBitsCount: 2,
          gates: [
            { id: 'g0', type: 'H', target: 0, col: 0 },
            { id: 'g1', type: 'MEASURE', target: 0, classicalBit: 0, col: 1 },
            { id: 'g2', type: 'MEASURE', target: 1, classicalBit: 1, col: 1 },
          ],
        };
    }
  }, [activePreset]);

  // Run simulation
  const simulation = useMemo(() => {
    return QuantumSimulator.simulate(circuit, shots);
  }, [circuit, shots]);

  // Calculate correlations (for 2-qubit states)
  const correlation = useMemo(() => {
    if (circuit.qubitsCount !== 2) return null;
    const p00 = simulation.counts['00'] || 0;
    const p11 = simulation.counts['11'] || 0;
    const p01 = simulation.counts['01'] || 0;
    const p10 = simulation.counts['10'] || 0;
    const total = shots;

    const sameCount = p00 + p11;
    const diffCount = p01 + p10;
    const sameRatio = total > 0 ? (sameCount / total) * 100 : 0;
    const diffRatio = total > 0 ? (diffCount / total) * 100 : 0;
    const coef = total > 0 ? (sameCount - diffCount) / total : 0;

    return {
      sameRatio: sameRatio.toFixed(1),
      diffRatio: diffRatio.toFixed(1),
      coefficient: coef.toFixed(3),
      p00,
      p11,
      p01,
      p10,
    };
  }, [simulation, circuit.qubitsCount, shots]);

  const handleSelectPreset = (p: EntangledPreset) => {
    setActivePreset(p);
    if (p !== 'separable_product') {
      unlockAchievement('entanglement_explorer');
    }
    showToast('info', 'Preset Loaded', `Initialized ${circuit.name}.`);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Hero Visual Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-xl flex flex-col md:flex-row items-center gap-6">
        <div className="w-full md:w-1/3 aspect-square max-w-[240px] rounded-xl overflow-hidden border border-slate-800 shrink-0 relative group">
          <img
            src="/src/assets/images/entanglement_concept_1793102813000.jpg"
            alt="Quantum Entanglement Wavefunctions"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
          <span className="absolute bottom-2 left-2 text-[10px] font-mono text-cyan-300">
            EPR Non-Separable State
          </span>
        </div>

        <div className="flex-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-800/40 text-cyan-300 text-xs font-mono mb-2">
            <Share2 className="w-3.5 h-3.5 text-cyan-400" />
            <span>Spooky Action at a Distance</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight font-display">
            Entanglement Playground
          </h1>
          <p className="text-sm text-slate-300 mt-2 leading-relaxed">
            Experiment with non-separable quantum states where measurements on separated particles yield instantaneous mathematical correlations without violating the cosmic speed limit of light.
          </p>

          <div className="flex flex-wrap items-center gap-2 mt-4">
            <span className="text-xs text-slate-400 font-mono">Select State:</span>
            {[
              { id: 'phi_plus', label: '|Φ⁺⟩ Bell' },
              { id: 'phi_minus', label: '|Φ⁻⟩ Bell' },
              { id: 'psi_plus', label: '|Ψ⁺⟩ Bell' },
              { id: 'psi_minus', label: '|Ψ⁻⟩ Bell' },
              { id: 'ghz_3qubit', label: '3-Qubit GHZ' },
              { id: 'separable_product', label: 'Separable (Control)' },
            ].map((p) => (
              <button
                key={p.id}
                onClick={() => handleSelectPreset(p.id as EntangledPreset)}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono font-semibold transition-all cursor-pointer ${
                  activePreset === p.id
                    ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                    : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Simulation Split: State Details & Probability Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: State Breakdown & Correlations */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white font-display">
              {circuit.name}
            </h2>
            <span className="text-xs font-mono text-cyan-300 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800">
              {circuit.qubitsCount} Qubits
            </span>
          </div>

          {/* Amplitudes list */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 font-mono text-xs">
            <span className="text-slate-400 uppercase text-[10px] block">Wavefunction Expansion:</span>
            <div className="grid grid-cols-2 gap-2">
              {simulation.basisStates.map((b, idx) => {
                const amp = simulation.stateVector[idx];
                const prob = simulation.probabilities[idx];
                return (
                  <div key={b} className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between">
                    <span className="font-bold text-cyan-300">|{b}⟩</span>
                    <span className="text-slate-300">{C.format(amp)}</span>
                    <span className="text-slate-500 text-[10px]">{(prob * 100).toFixed(0)}%</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Correlation Table (if 2 qubits) */}
          {correlation && (
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3 font-mono text-xs">
              <span className="text-slate-400 uppercase text-[10px] block">
                Joint Measurement Correlation Statistics ({shots} Shots):
              </span>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">Same Outcomes (00/11)</span>
                  <span className="text-emerald-400 font-bold text-sm">{correlation.sameRatio}%</span>
                </div>
                <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">Different (01/10)</span>
                  <span className="text-rose-400 font-bold text-sm">{correlation.diffRatio}%</span>
                </div>
                <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">Correlation E</span>
                  <span className="text-cyan-400 font-bold text-sm">{correlation.coefficient}</span>
                </div>
              </div>
            </div>
          )}

          {/* No-Faster-Than-Light explanation */}
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-300 space-y-2 leading-relaxed">
            <h3 className="font-semibold text-white flex items-center gap-1.5 font-mono">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Why Entanglement Does NOT Enable Faster-Than-Light (FTL) Signalling:</span>
            </h3>
            <p>
              Even though the measurement of Qubit 1 instantly determines the outcome of Qubit 2 across arbitrary distances, Bob observing Qubit 2 cannot detect that Alice made a measurement.
            </p>
            <p>
              To Bob, his local qubit outcome is purely random: 50% chance of 0 and 50% chance of 1. Bob cannot tell whether Alice measured her qubit 1 microsecond ago, or if she has not measured it yet. Only when Alice sends her classical measurement record (which travels at or below the speed of light) can they cross-reference and verify the correlation!
            </p>
          </div>
        </div>

        {/* Right: Probability Chart */}
        <div className="space-y-6">
          <ProbabilityChart
            basisStates={simulation.basisStates}
            probabilities={simulation.probabilities}
            counts={simulation.counts}
            shots={shots}
          />

          {/* Side by Side Separable vs Entangled comparison */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 font-mono">
              Separable State vs Entangled State Comparison
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-300 leading-relaxed">
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                <strong className="text-white block mb-1">Separable Product State</strong>
                <p className="text-[11px] text-slate-400 mb-2">
                  Can be factored: |ψ⟩ = |a⟩ ⊗ |b⟩. Each particle possesses independent properties.
                </p>
                <span className="text-[10px] font-mono text-cyan-400">
                  Example: |+⟩ ⊗ |0⟩ = (|00⟩ + |10⟩)/√2
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950 border border-cyan-500/30 bg-cyan-950/10">
                <strong className="text-cyan-300 block mb-1">Entangled State (EPR Pair)</strong>
                <p className="text-[11px] text-slate-300 mb-2">
                  Non-separable: Cannot be factored into single-qubit states. Joint state is indivisible.
                </p>
                <span className="text-[10px] font-mono text-cyan-400">
                  Example: (|00⟩ + |11⟩)/√2
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

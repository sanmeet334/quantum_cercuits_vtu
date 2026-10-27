import React, { useState, useMemo } from 'react';
import {
  Cpu,
  Search,
  ExternalLink,
  Play,
  RotateCcw,
  Sparkles,
  Layers,
  ArrowRight,
  HelpCircle,
  Video,
} from 'lucide-react';
import { useLab } from '../context/LabContext';
import { GATES_DATA, GateInfo } from '../data/gatesData';
import { GateType } from '../quantum/types';
import { QuantumSimulator } from '../quantum/simulator';
import { BlochSphere } from '../components/common/BlochSphere';
import { ProbabilityChart } from '../components/common/ProbabilityChart';
import { C } from '../quantum/complex';

export const GateExplorerPage: React.FC = () => {
  const { selectedGateId, setSelectedGateId, setActiveTab, unlockAchievement, showToast } = useLab();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<'all' | 'single' | 'multi' | 'rotation'>('all');
  const [filterLevel, setFilterLevel] = useState<'all' | 'beginner' | 'intermediate' | 'advanced'>('all');

  // Interactive Gate Experiment state
  const [inputBasisState, setInputBasisState] = useState<'0' | '1' | '+' | '-' | 'i' | '-i'>('0');
  const [rotationTheta, setRotationTheta] = useState<number>(Math.PI / 2);
  const [appliedCount, setAppliedCount] = useState<number>(0);

  const activeGate: GateInfo = GATES_DATA[selectedGateId] || GATES_DATA['H'];

  // All gates list filtered
  const gatesList = useMemo(() => {
    return Object.values(GATES_DATA).filter((g) => {
      const matchesSearch =
        !searchQuery ||
        g.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        g.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
        g.definition.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCat = filterCategory === 'all' || g.category === filterCategory;
      const matchesLevel = filterLevel === 'all' || g.level === filterLevel;

      return matchesSearch && matchesCat && matchesLevel;
    });
  }, [searchQuery, filterCategory, filterLevel]);

  // Compute live simulation on single qubit gate
  const simulation = useMemo(() => {
    const isMulti = activeGate.qubits > 1;
    const n = isMulti ? activeGate.qubits : 1;

    // Build preparation gates for input basis state
    const prepGates: any[] = [];
    if (inputBasisState === '1') {
      prepGates.push({ type: 'X', target: 0, col: 0 });
    } else if (inputBasisState === '+') {
      prepGates.push({ type: 'H', target: 0, col: 0 });
    } else if (inputBasisState === '-') {
      prepGates.push({ type: 'X', target: 0, col: 0 });
      prepGates.push({ type: 'H', target: 0, col: 1 });
    } else if (inputBasisState === 'i') {
      prepGates.push({ type: 'H', target: 0, col: 0 });
      prepGates.push({ type: 'S', target: 0, col: 1 });
    } else if (inputBasisState === '-i') {
      prepGates.push({ type: 'H', target: 0, col: 0 });
      prepGates.push({ type: 'Sdg', target: 0, col: 1 });
    }

    // Now apply the active gate
    const colOffset = prepGates.length;
    const circuitGates = [...prepGates];

    if (isMulti) {
      if (activeGate.id === 'CX') {
        circuitGates.push({ type: 'CX', control: 0, target: 1, col: colOffset });
      } else if (activeGate.id === 'CZ') {
        circuitGates.push({ type: 'CZ', control: 0, target: 1, col: colOffset });
      } else if (activeGate.id === 'SWAP') {
        circuitGates.push({ type: 'SWAP', target: 0, target2: 1, col: colOffset });
      } else if (activeGate.id === 'CCX') {
        circuitGates.push({ type: 'CCX', control: 0, control2: 1, target: 2, col: colOffset });
      } else if (activeGate.id === 'CSWAP') {
        circuitGates.push({ type: 'CSWAP', control: 0, target: 1, target2: 2, col: colOffset });
      } else {
        circuitGates.push({ type: activeGate.id, control: 0, target: 1, params: { theta: rotationTheta }, col: colOffset });
      }
    } else {
      circuitGates.push({
        type: activeGate.id,
        target: 0,
        params: { theta: rotationTheta, phi: 0, lambda: Math.PI },
        col: colOffset,
      });
    }

    const testCircuit = {
      id: 'gate_test_circuit',
      name: `Test Circuit for ${activeGate.name}`,
      qubitsCount: n,
      classicalBitsCount: n,
      gates: circuitGates.map((g, idx) => ({ ...g, id: `g_${idx}` })),
    };

    return QuantumSimulator.simulate(testCircuit, 1024);
  }, [activeGate, inputBasisState, rotationTheta, appliedCount]);

  const handleApplyGate = () => {
    setAppliedCount((prev) => prev + 1);
    unlockAchievement('gate_explorer');
    showToast('success', 'Gate Applied', `Calculated statevector under ${activeGate.name} transformation.`);
  };

  return (
    <div className="flex flex-col lg:flex-row items-start gap-6 max-w-7xl mx-auto">
      {/* Left Column: Gate Selector Catalog */}
      <div className="w-full lg:w-80 shrink-0 space-y-4">
        {/* Search & Filter */}
        <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter gates (H, CX, T, RX)..."
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-sans"
            />
          </div>

          <div className="flex items-center gap-1 p-1 bg-slate-950 rounded-xl border border-slate-800">
            {(['all', 'single', 'multi', 'rotation'] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`flex-1 py-1 text-[11px] font-medium rounded-lg transition-colors cursor-pointer capitalize text-center ${
                  filterCategory === cat
                    ? 'bg-cyan-500 text-slate-950 font-semibold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {cat === 'all' ? 'All' : cat === 'rotation' ? 'Rot' : cat}
              </button>
            ))}
          </div>
        </div>

        {/* Gate Cards Grid */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-2 max-h-[72vh] overflow-y-auto space-y-1 custom-scrollbar">
          {gatesList.map((gate) => {
            const isSelected = gate.id === activeGate.id;
            return (
              <button
                key={gate.id}
                onClick={() => {
                  setSelectedGateId(gate.id);
                  if (gate.defaultParams?.theta) {
                    setRotationTheta(gate.defaultParams.theta);
                  }
                }}
                className={`w-full p-3 rounded-xl border text-left transition-all flex items-center justify-between cursor-pointer ${
                  isSelected
                    ? 'bg-cyan-500/10 border-cyan-500/40 text-white shadow-sm'
                    : 'bg-slate-950/40 border-transparent text-slate-300 hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center font-mono font-bold text-xs shrink-0 ${
                      isSelected
                        ? 'bg-cyan-500 text-slate-950'
                        : 'bg-slate-850 text-cyan-300 border border-slate-700'
                    }`}
                  >
                    {gate.symbol}
                  </div>
                  <div className="min-w-0">
                    <span className="text-xs font-semibold block truncate text-white">
                      {gate.name}
                    </span>
                    <span className="text-[10px] text-slate-400 block font-mono">
                      {gate.qubits} Qubit{gate.qubits > 1 ? 's' : ''} · {gate.level}
                    </span>
                  </div>
                </div>

                <span className="text-[10px] font-mono text-slate-400 uppercase ml-2 shrink-0">
                  {gate.category}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Right Column: Gate Dossier & Interactive Stage */}
      <div className="flex-1 w-full space-y-6">
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 text-slate-100 shadow-xl">
          {/* Header */}
          <div className="flex flex-wrap items-start justify-between gap-4 pb-6 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-1">
                <span>{activeGate.qubits}-Qubit Gate</span>
                <span aria-hidden="true">·</span>
                <span className="uppercase">{activeGate.level} Level</span>
                <span aria-hidden="true">·</span>
                <span className="uppercase">{activeGate.category} family</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight font-display flex items-center gap-3">
                <span>{activeGate.name}</span>
                <span className="px-2.5 py-0.5 rounded-lg bg-cyan-950 border border-cyan-800/60 text-cyan-300 text-base font-mono">
                  {activeGate.symbol}
                </span>
              </h1>
              <p className="text-sm text-slate-300 mt-2 max-w-2xl leading-relaxed">
                {activeGate.definition}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <a
                href={`https://www.youtube.com/results?search_query=${encodeURIComponent(
                  activeGate.videoSearchTopic
                )}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-white rounded-xl text-xs font-medium border border-slate-700 transition-colors"
                title="Search educational videos on YouTube"
              >
                <Video className="w-3.5 h-3.5 text-rose-400" />
                <span>Video Tutorials</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          {/* Matrix & State Transformation Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
            {/* Mathematical Matrix */}
            <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2 font-mono">
                Unitary Matrix Representation
              </span>
              <div className="p-3 rounded-lg bg-slate-900 border border-slate-800/80 overflow-x-auto flex items-center justify-center min-h-[90px]">
                <table className="border-collapse font-mono text-xs text-cyan-300 text-center">
                  <tbody>
                    {activeGate.matrixRows.map((row, rIdx) => (
                      <tr key={rIdx}>
                        {row.map((cell, cIdx) => (
                          <td key={cIdx} className="px-3 py-1.5 border border-slate-800">
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-[11px] text-slate-400 mt-2 font-mono">
                Formula: {activeGate.matrixTex}
              </p>
            </div>

            {/* State Transformation & Qiskit Equivalent */}
            <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 flex flex-col justify-between">
              <div>
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1 font-mono">
                  State Transformation
                </span>
                <p className="text-sm font-mono text-cyan-300 font-semibold mb-3">
                  {activeGate.transformation}
                </p>
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1 font-mono">
                  Qiskit 1.0+ Equivalent
                </span>
                <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 font-mono text-xs text-indigo-300">
                  {activeGate.qiskitCode}
                </div>
              </div>

              <div className="mt-3 flex items-center gap-1.5 text-xs text-slate-400">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                <span className="truncate">{activeGate.purpose}</span>
              </div>
            </div>
          </div>

          {/* Interactive Simulation Stage */}
          <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-950 to-indigo-950/30 border border-indigo-900/40 my-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Play className="w-4 h-4 text-cyan-400" />
                  <span>Live Interactive Gate Sandbox</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Select input state, adjust rotation parameters, and observe exact statevector evolution.
                </p>
              </div>

              <button
                onClick={handleApplyGate}
                className="flex items-center gap-2 px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold text-xs rounded-xl shadow transition-all cursor-pointer"
              >
                <span>Apply {activeGate.name}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Controls: Input State & Parameter Slider */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 font-mono">
                  Select Input Qubit State |ψ_in⟩
                </label>
                <div className="grid grid-cols-6 gap-1 p-1 bg-slate-900 border border-slate-800 rounded-xl">
                  {(['0', '1', '+', '-', 'i', '-i'] as const).map((st) => (
                    <button
                      key={st}
                      onClick={() => setInputBasisState(st)}
                      className={`py-1.5 text-xs font-mono font-semibold rounded-lg transition-colors cursor-pointer text-center ${
                        inputBasisState === st
                          ? 'bg-cyan-500 text-slate-950'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      |{st}⟩
                    </button>
                  ))}
                </div>
              </div>

              {activeGate.category === 'rotation' && (
                <div>
                  <div className="flex items-center justify-between text-xs font-mono text-slate-300 mb-2">
                    <span>Rotation Angle θ</span>
                    <span className="text-cyan-400 font-bold">
                      {rotationTheta.toFixed(3)} rad ({( (rotationTheta * 180) / Math.PI ).toFixed(0)}°)
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max={2 * Math.PI}
                    step="0.05"
                    value={rotationTheta}
                    onChange={(e) => setRotationTheta(parseFloat(e.target.value))}
                    className="w-full accent-cyan-400 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
                    <span>0</span>
                    <span>π/2</span>
                    <span>π</span>
                    <span>3π/2</span>
                    <span>2π</span>
                  </div>
                </div>
              )}
            </div>

            {/* Output Visualizations: Bloch Sphere & Probability Chart */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              {activeGate.qubits === 1 && simulation.blochSpheres[0] ? (
                <BlochSphere
                  x={simulation.blochSpheres[0].x}
                  y={simulation.blochSpheres[0].y}
                  z={simulation.blochSpheres[0].z}
                  stateLabel="|ψ_out⟩"
                />
              ) : (
                <div className="p-6 rounded-2xl bg-slate-950/60 border border-slate-800 flex flex-col items-center justify-center text-center">
                  <Layers className="w-8 h-8 text-indigo-400 mb-2" />
                  <span className="text-xs font-bold text-white">Multi-Qubit Entangled State</span>
                  <p className="text-xs text-slate-400 mt-1 max-w-xs leading-relaxed">
                    This is a {activeGate.qubits}-qubit gate. Multi-qubit states exist in a {1 << activeGate.qubits}-dimensional Hilbert space.
                  </p>
                </div>
              )}

              <ProbabilityChart
                basisStates={simulation.basisStates}
                probabilities={simulation.probabilities}
                counts={simulation.counts}
                shots={1024}
              />
            </div>
          </div>

          {/* Step-by-Step, Applications, and Misconceptions */}
          <div className="space-y-6">
            <div>
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 font-mono">
                Step-by-Step Transformation Process
              </h3>
              <ol className="space-y-1.5 text-xs text-slate-300 list-decimal list-inside leading-relaxed">
                {activeGate.stepByStep.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ol>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
                <h4 className="text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-2 font-mono">
                  Practical Applications
                </h4>
                <ul className="space-y-1 text-xs text-slate-300 list-disc list-inside">
                  {activeGate.applications.map((app, i) => (
                    <li key={i}>{app}</li>
                  ))}
                </ul>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
                <h4 className="text-xs font-semibold text-amber-400 uppercase tracking-wider mb-2 font-mono">
                  Common Misconceptions
                </h4>
                <ul className="space-y-1 text-xs text-slate-300 list-disc list-inside">
                  {activeGate.misconceptions.map((misc, i) => (
                    <li key={i}>{misc}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Related Gates */}
            <div className="pt-4 border-t border-slate-800 flex items-center gap-2 text-xs text-slate-400 font-mono">
              <span>Related Gates in Encyclopedia:</span>
              {activeGate.relatedGates.map((rg) => (
                <button
                  key={rg}
                  onClick={() => setSelectedGateId(rg)}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-750 text-cyan-400 border border-slate-700 transition-colors cursor-pointer"
                >
                  {rg}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

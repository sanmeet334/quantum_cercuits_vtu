import React, { useState, useMemo } from 'react';
import {
  Play,
  RotateCcw,
  Download,
  Layers,
  Sparkles,
  Info,
  ChevronRight,
  ChevronLeft,
  FileJson,
  BarChart3,
  Cpu,
} from 'lucide-react';
import { useLab } from '../context/LabContext';
import { QuantumSimulator } from '../quantum/simulator';
import { C } from '../quantum/complex';
import { ProbabilityChart } from '../components/common/ProbabilityChart';
import { BlochSphere } from '../components/common/BlochSphere';
import { EXAMPLE_CIRCUITS } from '../data/exampleCircuits';

export const SimulatorPage: React.FC = () => {
  const { currentCircuit, setCurrentCircuit, unlockAchievement, showToast } = useLab();

  const [shots, setShots] = useState<number>(1024);
  const [activeStepIndex, setActiveStepIndex] = useState<number>(0);
  const [selectedExampleId, setSelectedExampleId] = useState<string>('example_bell_state');

  // Compute full simulation
  const simulation = useMemo(() => {
    return QuantumSimulator.simulate(currentCircuit, shots);
  }, [currentCircuit, shots]);

  // Compute intermediate steps
  const steps = useMemo(() => {
    return QuantumSimulator.simulateSteps(currentCircuit);
  }, [currentCircuit]);

  const activeStep = steps[activeStepIndex] || steps[0];

  const handleRunSimulation = () => {
    unlockAchievement('first_simulation');
    showToast('success', 'Simulation Executed', `Simulated ${simulation.qubitsCount} qubits with ${shots} measurement shots.`);
  };

  const handleLoadExample = (exampleId: string) => {
    setSelectedExampleId(exampleId);
    const ex = EXAMPLE_CIRCUITS.find((c) => c.id === exampleId);
    if (ex) {
      setCurrentCircuit(ex);
      setActiveStepIndex(0);
      showToast('info', 'Loaded Example', `Loaded "${ex.name}" into simulator.`);
    }
  };

  const handleExportCSV = () => {
    const rows = [
      ['Basis State', 'Theoretical Probability', 'Sampled Count', 'Sampled Frequency'],
      ...simulation.basisStates.map((b, idx) => [
        `|${b}>`,
        simulation.probabilities[idx].toFixed(6),
        (simulation.counts[b] || 0).toString(),
        (shots > 0 ? (simulation.counts[b] || 0) / shots : 0).toFixed(6),
      ]),
    ];
    const csvContent = 'data:text/csv;charset=utf-8,' + rows.map((e) => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `quantum_simulation_${shots}_shots.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    showToast('success', 'CSV Downloaded', 'Simulation data table exported.');
  };

  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(simulation, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `simulation_results.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast('success', 'JSON Downloaded', 'Statevector and counts exported.');
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Controls Toolbar */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-wrap items-center justify-between gap-4">
        {/* Preset Selector */}
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono text-slate-400">Load Preset:</span>
          <select
            value={selectedExampleId}
            onChange={(e) => handleLoadExample(e.target.value)}
            className="px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white font-medium focus:outline-none focus:border-cyan-500"
          >
            {EXAMPLE_CIRCUITS.map((ex) => (
              <option key={ex.id} value={ex.id}>
                {ex.name} ({ex.qubitsCount} Qubits)
              </option>
            ))}
          </select>
        </div>

        {/* Shot Configuration & Run Actions */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 p-1 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono">
            <span className="px-2 text-slate-400">Shots:</span>
            {[100, 1024, 4096, 8192].map((s) => (
              <button
                key={s}
                onClick={() => setShots(s)}
                className={`px-2 py-1 rounded-lg transition-colors cursor-pointer ${
                  shots === s ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                {s}
              </button>
            ))}
          </div>

          <button
            onClick={handleExportCSV}
            className="p-2 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-xl text-slate-300 hover:text-white text-xs transition-colors cursor-pointer"
            title="Download CSV"
          >
            <Download className="w-4 h-4" />
          </button>

          <button
            onClick={handleExportJSON}
            className="p-2 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-xl text-slate-300 hover:text-white text-xs transition-colors cursor-pointer"
            title="Download JSON"
          >
            <FileJson className="w-4 h-4" />
          </button>

          <button
            onClick={handleRunSimulation}
            className="flex items-center gap-2 px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold text-xs rounded-xl shadow-lg shadow-cyan-500/20 transition-all cursor-pointer"
          >
            <Play className="w-4 h-4" />
            <span>Simulate ({simulation.executionTimeMs} ms)</span>
          </button>
        </div>
      </div>

      {/* Main Results Split: Statevector Table & Probability Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Statevector Table */}
        <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-cyan-400" />
                <span>Statevector Wavefunction |ψ⟩</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Hilbert space dimension: 2^{simulation.qubitsCount} = {simulation.stateVector.length} complex amplitudes
              </p>
            </div>
            <span className="text-xs font-mono text-cyan-300 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800/60">
              QPU Ideal
            </span>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950">
            <table className="w-full text-left font-mono text-xs">
              <thead className="bg-slate-900 border-b border-slate-800 text-slate-400 uppercase text-[10px]">
                <tr>
                  <th className="py-2.5 px-3">Basis |k⟩</th>
                  <th className="py-2.5 px-3">Complex Amplitude α_k</th>
                  <th className="py-2.5 px-3 text-right">Probability |α_k|²</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {simulation.basisStates.map((b, idx) => {
                  const amp = simulation.stateVector[idx];
                  const prob = simulation.probabilities[idx];
                  return (
                    <tr key={b} className="hover:bg-slate-900/40 transition-colors">
                      <td className="py-2.5 px-3 font-bold text-cyan-300">|{b}⟩</td>
                      <td className="py-2.5 px-3 text-slate-200">{C.format(amp, 4)}</td>
                      <td className="py-2.5 px-3 text-right font-bold text-white">
                        {(prob * 100).toFixed(2)}%
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Explanation Callout */}
          <div className="mt-4 p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs text-slate-400 leading-relaxed">
            <strong className="text-slate-300 block mb-1">State Evolution Model:</strong>
            This browser-based statevector simulator calculates exact unitary matrix-vector products. Unlike physical hardware prone to thermal decoherence ($T_1$) and dephasing ($T_2$), this execution represents pure unperturbed quantum evolution.
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

          {/* Bloch Sphere if 1 qubit */}
          {simulation.qubitsCount === 1 && simulation.blochSpheres[0] && (
            <BlochSphere
              x={simulation.blochSpheres[0].x}
              y={simulation.blochSpheres[0].y}
              z={simulation.blochSpheres[0].z}
              stateLabel="|ψ⟩"
            />
          )}
        </div>
      </div>

      {/* Step-by-Step Intermediate State Evolution */}
      {steps.length > 1 && (
        <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800">
          <div className="flex items-center justify-between gap-4 mb-4">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Cpu className="w-4 h-4 text-indigo-400" />
                <span>Step-by-Step Circuit Evolution</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Step through gate columns to inspect intermediate wavefunctions prior to measurement.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveStepIndex((prev) => Math.max(0, prev - 1))}
                disabled={activeStepIndex <= 0}
                className="p-1.5 text-slate-400 hover:text-white disabled:opacity-30 bg-slate-950 border border-slate-800 rounded-lg cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-xs font-mono text-cyan-300 font-semibold px-2">
                {activeStepIndex + 1} / {steps.length}
              </span>
              <button
                onClick={() => setActiveStepIndex((prev) => Math.min(steps.length - 1, prev + 1))}
                disabled={activeStepIndex >= steps.length - 1}
                className="p-1.5 text-slate-400 hover:text-white disabled:opacity-30 bg-slate-950 border border-slate-800 rounded-lg cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-xs font-bold text-cyan-400 block mb-2 font-mono">
              {activeStep.description}
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono text-xs">
              {activeStep.state.map((amp, idx) => {
                const basis = idx.toString(2).padStart(simulation.qubitsCount, '0');
                const prob = C.absSq(amp);
                return (
                  <div key={idx} className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800">
                    <span className="text-cyan-300 font-bold block">|{basis}⟩</span>
                    <span className="text-slate-300 block text-[11px] truncate">{C.format(amp)}</span>
                    <span className="text-slate-500 block text-[10px]">{(prob * 100).toFixed(1)}%</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

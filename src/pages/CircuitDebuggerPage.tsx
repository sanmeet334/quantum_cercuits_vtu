import React, { useState, useMemo } from 'react';
import {
  Bug,
  AlertTriangle,
  CheckCircle2,
  Info,
  Wrench,
  Play,
  Code2,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { useLab } from '../context/LabContext';
import { CircuitModel, DebugIssue } from '../quantum/types';
import { parseQiskitCode, validateCircuit } from '../quantum/circuitParser';
import { QuantumSimulator } from '../quantum/simulator';
import { ProbabilityChart } from '../components/common/ProbabilityChart';

export const CircuitDebuggerPage: React.FC = () => {
  const { currentCircuit, setCurrentCircuit, setActiveTab, showToast } = useLab();

  const [pastedCode, setPastedCode] = useState<string>(
    `# Paste Qiskit Code to Analyze\nfrom qiskit import QuantumCircuit\n\nqc = QuantumCircuit(2, 2)\nqc.h(0)\nqc.cx(0, 1)\nqc.measure_all()`
  );

  const [selectedGoal, setSelectedGoal] = useState<'none' | 'bell_state' | 'superposition' | 'inversion'>('bell_state');

  // Parse pasted code
  const parsed = useMemo(() => {
    return parseQiskitCode(pastedCode);
  }, [pastedCode]);

  // Circuit to analyze: current circuit or parsed circuit
  const [activeAnalysisMode, setActiveAnalysisMode] = useState<'current' | 'pasted'>('current');
  const circuitToAnalyze: CircuitModel = activeAnalysisMode === 'current' ? currentCircuit : (parsed.circuit || currentCircuit);

  // Issues found
  const issues: DebugIssue[] = useMemo(() => {
    const goal = selectedGoal === 'none' ? undefined : selectedGoal;
    const baseIssues = validateCircuit(circuitToAnalyze, goal);

    // Add parse errors if in pasted mode
    if (activeAnalysisMode === 'pasted' && parsed.errors.length > 0) {
      parsed.errors.forEach((err, idx) => {
        baseIssues.unshift({
          id: `parse_err_${idx}`,
          title: 'Syntax / Parse Error',
          severity: 'error',
          location: 'Code Input',
          explanation: err,
          suggestion: 'Check qubit indices and Qiskit 1.0 syntax.',
          fixable: false,
        });
      });
    }

    return baseIssues;
  }, [circuitToAnalyze, selectedGoal, activeAnalysisMode, parsed]);

  // Simulation
  const simulation = useMemo(() => {
    return QuantumSimulator.simulate(circuitToAnalyze, 1024);
  }, [circuitToAnalyze]);

  // Fix Action handler
  const handleApplyFix = (issue: DebugIssue) => {
    if (issue.id === 'missing_measurements') {
      const col = circuitToAnalyze.gates.length;
      const updatedGates = [...circuitToAnalyze.gates];
      for (let q = 0; q < circuitToAnalyze.qubitsCount; q++) {
        updatedGates.push({
          id: `meas_${q}_${Date.now()}`,
          type: 'MEASURE',
          target: q,
          classicalBit: q,
          col,
        });
      }
      const fixed: CircuitModel = { ...circuitToAnalyze, gates: updatedGates };
      setCurrentCircuit(fixed);
      showToast('success', 'Fix Applied', 'Appended measurement operators to all qubits.');
    } else if (issue.id === 'bell_state_mismatch') {
      const fixed: CircuitModel = {
        ...circuitToAnalyze,
        qubitsCount: Math.max(2, circuitToAnalyze.qubitsCount),
        classicalBitsCount: Math.max(2, circuitToAnalyze.classicalBitsCount),
        gates: [
          { id: 'h0', type: 'H', target: 0, col: 0 },
          { id: 'cx01', type: 'CX', control: 0, target: 1, col: 1 },
          { id: 'm0', type: 'MEASURE', target: 0, classicalBit: 0, col: 2 },
          { id: 'm1', type: 'MEASURE', target: 1, classicalBit: 1, col: 2 },
        ],
      };
      setCurrentCircuit(fixed);
      showToast('success', 'Fix Applied', 'Repaired circuit structure into standard Bell state.');
    } else if (issue.id === 'superposition_mismatch') {
      const fixed: CircuitModel = {
        ...circuitToAnalyze,
        gates: [{ id: 'h0', type: 'H', target: 0, col: 0 }, ...circuitToAnalyze.gates],
      };
      setCurrentCircuit(fixed);
      showToast('success', 'Fix Applied', 'Inserted Hadamard gate at column 0.');
    } else {
      showToast('info', 'Notice', 'Please inspect the circuit wires to manually adjust this parameter.');
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Controls Toolbar */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 p-1 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium">
            <button
              onClick={() => setActiveAnalysisMode('current')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                activeAnalysisMode === 'current'
                  ? 'bg-blue-600 text-white font-semibold shadow-sm font-bold'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Current Active Circuit ({currentCircuit.gates.length} Gates)
            </button>
            <button
              onClick={() => setActiveAnalysisMode('pasted')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                activeAnalysisMode === 'pasted'
                  ? 'bg-blue-600 text-white font-semibold shadow-sm font-bold'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Paste Qiskit Code
            </button>
          </div>
        </div>

        {/* Intended Goal Selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-slate-500">Target Goal:</span>
          <select
            value={selectedGoal}
            onChange={(e) => setSelectedGoal(e.target.value as any)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-medium focus:outline-none focus:border-cyan-500"
          >
            <option value="none">No Specific Goal (Syntax only)</option>
            <option value="bell_state">Goal: Prepare Bell State</option>
            <option value="superposition">Goal: Create Superposition</option>
            <option value="inversion">Goal: Invert Qubit State</option>
          </select>
        </div>
      </div>

      {/* If pasted mode, show code textarea */}
      {activeAnalysisMode === 'pasted' && (
        <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-500 font-mono">
            <span>Supported operations: qc.h, qc.x, qc.y, qc.z, qc.cx, qc.cz, qc.rx, qc.measure_all</span>
            <span className="text-blue-700">Safe Browser Parser (Zero Eval)</span>
          </div>
          <textarea
            value={pastedCode}
            onChange={(e) => setPastedCode(e.target.value)}
            rows={5}
            className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 font-mono text-xs text-blue-700 focus:outline-none focus:border-cyan-500 leading-relaxed"
          />
        </div>
      )}

      {/* Main Analysis Split: Detected Issues vs Simulation Diagnostics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Issues List */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 font-display">
              <Bug className="w-4 h-4 text-rose-400" />
              <span>Static Diagnostic Analysis</span>
            </h3>
            <span
              className={`text-xs font-mono px-2 py-0.5 rounded border ${
                issues.some((i) => i.severity === 'error')
                  ? 'bg-rose-950/60 border-rose-800/40 text-rose-300'
                  : 'bg-emerald-950/60 border-emerald-800/40 text-emerald-300'
              }`}
            >
              {issues.length} {issues.length === 1 ? 'Notice' : 'Notices'}
            </span>
          </div>

          {issues.length === 0 ? (
            <div className="p-6 rounded-xl bg-slate-50 border border-slate-200 text-center space-y-2">
              <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
              <h4 className="text-sm font-bold text-slate-900">Circuit Fully Verified</h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
                No structural errors, invalid indices, or goal mismatches detected. The circuit is ready for execution.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {issues.map((issue) => {
                const borderColors = {
                  error: 'border-rose-500/30 bg-rose-950/10 text-rose-300',
                  warning: 'border-amber-500/30 bg-amber-950/10 text-amber-300',
                  info: 'border-blue-200 bg-blue-50/10 text-blue-700',
                };
                const badgeColors = {
                  error: 'bg-rose-500/20 text-rose-400 border-rose-500/30',
                  warning: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
                  info: 'bg-blue-100 text-blue-600 border-blue-200',
                };

                return (
                  <div
                    key={issue.id}
                    className={`p-4 rounded-xl border ${borderColors[issue.severity]} space-y-2 text-xs`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-bold text-slate-900 text-sm">{issue.title}</span>
                      <span
                        className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded border ${
                          badgeColors[issue.severity]
                        }`}
                      >
                        {issue.severity}
                      </span>
                    </div>

                    <p className="text-slate-700 leading-relaxed">{issue.explanation}</p>

                    <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 font-mono text-[11px] text-slate-500">
                      <span className="text-slate-700 font-semibold block">Suggested Fix:</span>
                      {issue.suggestion}
                    </div>

                    {issue.fixable && (
                      <button
                        onClick={() => handleApplyFix(issue)}
                        className="mt-2 flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md shadow-blue-500/20 font-semibold rounded-lg text-xs transition-colors cursor-pointer"
                      >
                        <Wrench className="w-3.5 h-3.5" />
                        <span>Apply Automated Fix</span>
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right: Simulation Diagnostics & Output */}
        <div className="space-y-6">
          <ProbabilityChart
            basisStates={simulation.basisStates}
            probabilities={simulation.probabilities}
            counts={simulation.counts}
            shots={1024}
          />

          <div className="p-5 rounded-2xl bg-white border border-slate-200 text-xs text-slate-700 space-y-2 leading-relaxed">
            <h4 className="font-bold text-slate-900 flex items-center gap-1.5 font-mono">
              <Info className="w-4 h-4 text-blue-600" />
              <span>Circuit Debugging Guidelines</span>
            </h4>
            <p>
              Quantum circuits execute deterministically up to measurement. When debugging:
            </p>
            <ul className="list-disc list-inside space-y-1 text-slate-500">
              <li>Ensure control and target qubits are on distinct physical wires.</li>
              <li>Check that phase kickback is intended when target is in superposition.</li>
              <li>Include measurement operators when compiling for physical QPU hardware backends.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

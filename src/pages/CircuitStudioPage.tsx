import React, { useState, useMemo } from 'react';
import {
  Plus,
  Minus,
  RotateCcw,
  RotateCw,
  Trash2,
  Save,
  Download,
  Copy,
  Check,
  Play,
  Sliders,
  Code2,
  FileJson,
  Layers,
  Sparkles,
  Info,
} from 'lucide-react';
import { useLab } from '../context/LabContext';
import { CircuitGate, CircuitModel, GateType } from '../quantum/types';
import { QuantumSimulator } from '../quantum/simulator';
import { exportToQiskit } from '../quantum/qiskitExport';
import { validateCircuit } from '../quantum/circuitParser';
import { ProbabilityChart } from '../components/common/ProbabilityChart';
import { ConfirmModal } from '../components/common/ConfirmModal';
import { EXAMPLE_CIRCUITS } from '../data/exampleCircuits';

export const CircuitStudioPage: React.FC = () => {
  const { currentCircuit, setCurrentCircuit, saveCircuit, showToast, unlockAchievement } = useLab();

  // Undo / Redo history
  const [history, setHistory] = useState<CircuitModel[]>([currentCircuit]);
  const [historyIndex, setHistoryIndex] = useState<number>(0);

  // Selected tool from palette
  const [selectedTool, setSelectedTool] = useState<GateType | 'DELETE'>('H');
  // Selected gate on canvas for inspector
  const [selectedGateId, setSelectedGateId] = useState<string | null>(null);

  // Modals & Panels
  const [clearModalOpen, setClearModalOpen] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [activeTab, setActiveTab] = useState<'simulation' | 'qiskit' | 'inspector'>('simulation');

  // Push new state to history
  const pushCircuitChange = (newCircuit: CircuitModel) => {
    const updatedHistory = history.slice(0, historyIndex + 1);
    updatedHistory.push(newCircuit);
    setHistory(updatedHistory);
    setHistoryIndex(updatedHistory.length - 1);
    setCurrentCircuit(newCircuit);
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      const prev = history[historyIndex - 1];
      setHistoryIndex(historyIndex - 1);
      setCurrentCircuit(prev);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const next = history[historyIndex + 1];
      setHistoryIndex(historyIndex + 1);
      setCurrentCircuit(next);
    }
  };

  // Adjust qubit count
  const handleAddQubit = () => {
    if (currentCircuit.qubitsCount >= 6) {
      showToast('info', 'Qubit Limit Reached', 'For smooth browser execution, up to 6 qubits are supported.');
      return;
    }
    const updated: CircuitModel = {
      ...currentCircuit,
      qubitsCount: currentCircuit.qubitsCount + 1,
      classicalBitsCount: currentCircuit.classicalBitsCount + 1,
    };
    pushCircuitChange(updated);
  };

  const handleRemoveQubit = () => {
    if (currentCircuit.qubitsCount <= 1) return;
    const newCount = currentCircuit.qubitsCount - 1;
    const updated: CircuitModel = {
      ...currentCircuit,
      qubitsCount: newCount,
      classicalBitsCount: newCount,
      // Remove any gates that referenced the deleted qubit
      gates: currentCircuit.gates.filter(
        (g) => g.target < newCount && (g.control === undefined || g.control < newCount)
      ),
    };
    pushCircuitChange(updated);
  };

  // Click on a wire slot (qubit, col)
  const handleSlotClick = (qubit: number, col: number) => {
    // Check if slot already has a gate
    const existingIndex = currentCircuit.gates.findIndex(
      (g) => g.target === qubit && g.col === col
    );

    if (selectedTool === 'DELETE') {
      if (existingIndex >= 0) {
        const updatedGates = currentCircuit.gates.filter((_, idx) => idx !== existingIndex);
        pushCircuitChange({ ...currentCircuit, gates: updatedGates });
        if (selectedGateId === currentCircuit.gates[existingIndex].id) {
          setSelectedGateId(null);
        }
      }
      return;
    }

    if (existingIndex >= 0) {
      // Select for inspector
      setSelectedGateId(currentCircuit.gates[existingIndex].id);
      setActiveTab('inspector');
      return;
    }

    // Place new gate
    let controlQubit: number | undefined = undefined;
    let target2Qubit: number | undefined = undefined;

    if (selectedTool === 'CX' || selectedTool === 'CZ' || selectedTool === 'CP' || selectedTool === 'CRX') {
      controlQubit = (qubit + 1) % currentCircuit.qubitsCount;
    } else if (selectedTool === 'SWAP') {
      target2Qubit = (qubit + 1) % currentCircuit.qubitsCount;
    } else if (selectedTool === 'CCX') {
      controlQubit = (qubit + 1) % currentCircuit.qubitsCount;
    }

    const newGate: CircuitGate = {
      id: `g_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      type: selectedTool,
      target: qubit,
      control: controlQubit,
      target2: target2Qubit,
      col,
      params: selectedTool.startsWith('R') || selectedTool === 'CP' ? { theta: Math.PI / 2 } : undefined,
    };

    const updatedCircuit: CircuitModel = {
      ...currentCircuit,
      gates: [...currentCircuit.gates, newGate],
    };

    pushCircuitChange(updatedCircuit);
    setSelectedGateId(newGate.id);
    unlockAchievement('first_circuit');
  };

  // Selected gate for inspector
  const selectedGate = currentCircuit.gates.find((g) => g.id === selectedGateId);

  // Update selected gate properties
  const handleUpdateGateParams = (updates: Partial<CircuitGate>) => {
    if (!selectedGateId) return;
    const updatedGates = currentCircuit.gates.map((g) =>
      g.id === selectedGateId ? { ...g, ...updates } : g
    );
    pushCircuitChange({ ...currentCircuit, gates: updatedGates });
  };

  // Delete selected gate
  const handleDeleteSelectedGate = () => {
    if (!selectedGateId) return;
    const updatedGates = currentCircuit.gates.filter((g) => g.id !== selectedGateId);
    pushCircuitChange({ ...currentCircuit, gates: updatedGates });
    setSelectedGateId(null);
  };

  // Validation
  const validationIssues = useMemo(() => {
    return validateCircuit(currentCircuit);
  }, [currentCircuit]);

  // Simulation
  const simulation = useMemo(() => {
    return QuantumSimulator.simulate(currentCircuit, 1024);
  }, [currentCircuit]);

  // Qiskit code
  const qiskitCode = useMemo(() => {
    return exportToQiskit(currentCircuit);
  }, [currentCircuit]);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(qiskitCode);
    setCopiedCode(true);
    showToast('info', 'Copied to Clipboard', 'Qiskit Python code is ready to paste into Jupyter.');
    setTimeout(() => setCopiedCode(false), 2000);
  };

  // Export JSON
  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(currentCircuit, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `${currentCircuit.name.toLowerCase().replace(/\s+/g, '_')}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast('success', 'JSON Exported', 'Circuit data saved to local file.');
  };

  // Clear circuit
  const handleClearConfirm = () => {
    pushCircuitChange({
      ...currentCircuit,
      gates: [],
    });
    setSelectedGateId(null);
    showToast('info', 'Circuit Cleared', 'All gates have been removed from the canvas.');
  };

  const numCols = 8;

  const paletteGates: { category: string; gates: GateType[] }[] = [
    { category: 'Single Qubit', gates: ['H', 'X', 'Y', 'Z', 'S', 'T', 'SX'] },
    { category: 'Rotations', gates: ['RX', 'RY', 'RZ', 'U3'] },
    { category: 'Multi-Qubit', gates: ['CX', 'CZ', 'CP', 'SWAP', 'CCX'] },
    { category: 'Measurement', gates: ['MEASURE'] },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Controls Toolbar */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200 flex flex-wrap items-center justify-between gap-4">
        {/* Circuit Name & Dimensions */}
        <div className="flex items-center gap-3">
          <input
            type="text"
            value={currentCircuit.name}
            onChange={(e) => pushCircuitChange({ ...currentCircuit, name: e.target.value })}
            className="text-base font-bold text-slate-900 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 focus:outline-none focus:border-cyan-500 font-display min-w-[200px]"
            placeholder="Circuit Name..."
          />

          <div className="flex items-center gap-1.5 p-1 bg-slate-50 border border-slate-200 rounded-xl">
            <button
              onClick={handleRemoveQubit}
              disabled={currentCircuit.qubitsCount <= 1}
              className="p-1 text-slate-500 hover:text-slate-900 disabled:opacity-30 rounded hover:bg-slate-100 cursor-pointer"
              title="Remove Qubit wire"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="text-xs font-mono px-2 text-blue-700 font-bold">
              {currentCircuit.qubitsCount} Qubits
            </span>
            <button
              onClick={handleAddQubit}
              disabled={currentCircuit.qubitsCount >= 6}
              className="p-1 text-slate-500 hover:text-slate-900 disabled:opacity-30 rounded hover:bg-slate-100 cursor-pointer"
              title="Add Qubit wire"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Action Buttons: Undo, Redo, Save, Clear, Export */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleUndo}
            disabled={historyIndex <= 0}
            className="p-2 text-slate-500 hover:text-slate-900 disabled:opacity-30 bg-slate-50 border border-slate-200 rounded-xl transition-colors cursor-pointer"
            title="Undo"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button
            onClick={handleRedo}
            disabled={historyIndex >= history.length - 1}
            className="p-2 text-slate-500 hover:text-slate-900 disabled:opacity-30 bg-slate-50 border border-slate-200 rounded-xl transition-colors cursor-pointer"
            title="Redo"
          >
            <RotateCw className="w-4 h-4" />
          </button>

          <button
            onClick={() => setClearModalOpen(true)}
            className="p-2 text-slate-500 hover:text-rose-400 bg-slate-50 border border-slate-200 rounded-xl transition-colors cursor-pointer"
            title="Clear Circuit"
          >
            <Trash2 className="w-4 h-4" />
          </button>

          <button
            onClick={handleExportJSON}
            className="p-2 text-slate-500 hover:text-slate-900 bg-slate-50 border border-slate-200 rounded-xl transition-colors cursor-pointer"
            title="Export JSON"
          >
            <FileJson className="w-4 h-4" />
          </button>

          <button
            onClick={() => saveCircuit(currentCircuit)}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md shadow-blue-500/20 font-semibold text-xs rounded-xl shadow transition-colors cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Save Circuit</span>
          </button>
        </div>
      </div>

      {/* Gate Toolbox Palette */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200">
        <div className="flex items-center justify-between text-xs text-slate-500 font-mono mb-2">
          <span>Gate Palette (Click to select gate tool, then click wire slot to place)</span>
          <span className="text-blue-700">
            Active Tool: <strong>{selectedTool}</strong>
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          {paletteGates.map((group) => (
            <div key={group.category} className="flex items-center gap-1.5 p-1 bg-slate-50 border border-slate-200 rounded-xl">
              {group.gates.map((g) => {
                const isSelected = selectedTool === g;
                return (
                  <button
                    key={g}
                    onClick={() => setSelectedTool(g)}
                    className={`min-w-8 h-8 px-2 rounded-lg font-mono font-bold text-xs transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-blue-600 text-white font-semibold shadow-sm shadow-md shadow-blue-500/20 scale-105'
                        : 'text-slate-700 hover:text-slate-900 hover:bg-slate-200'
                    }`}
                    title={`Select ${g} gate`}
                  >
                    {g}
                  </button>
                );
              })}
            </div>
          ))}

          <button
            onClick={() => setSelectedTool('DELETE')}
            className={`min-w-8 h-8 px-3 rounded-xl font-mono text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
              selectedTool === 'DELETE'
                ? 'bg-rose-600 text-white shadow-md shadow-rose-500/20'
                : 'text-rose-400 bg-slate-50 border border-slate-200 hover:bg-rose-500/10'
            }`}
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Erase</span>
          </button>
        </div>
      </div>

      {/* Main Interactive Circuit Canvas */}
      <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 overflow-x-auto shadow-inner">
        <div className="min-w-[650px] relative py-2">
          {Array.from({ length: currentCircuit.qubitsCount }).map((_, qIdx) => (
            <div key={qIdx} className="relative h-16 flex items-center">
              {/* Qubit Label */}
              <div className="w-16 shrink-0 flex flex-col font-mono">
                <span className="text-xs font-bold text-blue-700">q[{qIdx}]</span>
                <span className="text-[10px] text-slate-500">|0⟩</span>
              </div>

              {/* Quantum Wire Line */}
              <div className="absolute left-16 right-0 h-[2px] bg-slate-300 pointer-events-none" />

              {/* Wire Column Grid Slots */}
              <div className="flex-1 grid grid-cols-8 gap-2 ml-4 relative z-10">
                {Array.from({ length: numCols }).map((_, cIdx) => {
                  const gateAtSlot = currentCircuit.gates.find(
                    (g) => g.target === qIdx && g.col === cIdx
                  );
                  const isControlAtSlot = currentCircuit.gates.find(
                    (g) => g.control === qIdx && g.col === cIdx
                  );
                  const isTarget2AtSlot = currentCircuit.gates.find(
                    (g) => g.target2 === qIdx && g.col === cIdx
                  );

                  return (
                    <div
                      key={cIdx}
                      onClick={() => handleSlotClick(qIdx, cIdx)}
                      className={`h-12 rounded-xl flex items-center justify-center cursor-pointer transition-all border ${
                        gateAtSlot
                          ? selectedGateId === gateAtSlot.id
                            ? 'bg-blue-600 text-white font-bold border-2 border-blue-600 shadow-md shadow-blue-500/25 scale-105'
                            : 'bg-white border-2 border-blue-500 text-blue-700 shadow-xs hover:border-blue-600'
                          : isControlAtSlot
                          ? 'border-transparent'
                          : 'border-dashed border-slate-300 hover:border-blue-500 hover:bg-white bg-white/70'
                      }`}
                    >
                      {gateAtSlot ? (
                        <span className="font-mono font-bold text-xs">
                          {gateAtSlot.type}
                        </span>
                      ) : isControlAtSlot ? (
                        <div className="w-3.5 h-3.5 rounded-full bg-blue-600 shadow-xs" />
                      ) : isTarget2AtSlot ? (
                        <span className="font-mono text-xs text-indigo-400">×</span>
                      ) : (
                        <span className="text-slate-700 text-xs opacity-0 hover:opacity-100 font-mono">
                          +
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Deck: Tabs for Simulation, Qiskit Code, and Selected Gate Inspector */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200">
        <div className="flex items-center gap-2 border-b border-slate-200 pb-3 mb-4">
          <button
            onClick={() => setActiveTab('simulation')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'simulation'
                ? 'bg-blue-600 text-white font-semibold shadow-sm'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Play className="w-3.5 h-3.5" />
            <span>Live Simulation</span>
          </button>
          <button
            onClick={() => setActiveTab('qiskit')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'qiskit'
                ? 'bg-blue-600 text-white font-semibold shadow-sm'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>Qiskit Code</span>
          </button>
          {selectedGate && (
            <button
              onClick={() => setActiveTab('inspector')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'inspector'
                  ? 'bg-blue-600 text-white font-semibold shadow-sm'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Inspector: {selectedGate.type}</span>
            </button>
          )}
        </div>

        {/* Tab 1: Live Simulation */}
        {activeTab === 'simulation' && (
          <div className="space-y-4">
            {validationIssues.length > 0 && (
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300">
                <span className="font-semibold block mb-0.5">Circuit Notice:</span>
                {validationIssues[0].explanation}
              </div>
            )}
            <ProbabilityChart
              basisStates={simulation.basisStates}
              probabilities={simulation.probabilities}
              counts={simulation.counts}
              shots={1024}
            />
          </div>
        )}

        {/* Tab 2: Qiskit Python Code */}
        {activeTab === 'qiskit' && (
          <div className="relative">
            <button
              onClick={handleCopyCode}
              className="absolute top-3 right-3 flex items-center gap-1.5 px-3 py-1 bg-slate-100 hover:bg-slate-200 text-xs text-slate-900 rounded-lg border border-slate-200 transition-colors cursor-pointer"
            >
              {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedCode ? 'Copied' : 'Copy Code'}</span>
            </button>
            <pre className="p-4 rounded-xl bg-slate-900 border border-slate-800 font-mono text-xs text-blue-300 overflow-x-auto leading-relaxed shadow-sm">
              {qiskitCode}
            </pre>
          </div>
        )}

        {/* Tab 3: Selected Gate Inspector */}
        {activeTab === 'inspector' && selectedGate && (
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-900 font-mono uppercase tracking-wider">
                Operation Parameters: {selectedGate.type} on Wire q[{selectedGate.target}]
              </h4>
              <button
                onClick={handleDeleteSelectedGate}
                className="px-2.5 py-1 text-xs text-rose-400 hover:bg-rose-500/10 rounded-lg border border-rose-500/30 transition-colors cursor-pointer"
              >
                Delete Operation
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-[11px] text-slate-500 font-mono mb-1">Target Qubit</label>
                <select
                  value={selectedGate.target}
                  onChange={(e) => handleUpdateGateParams({ target: parseInt(e.target.value, 10) })}
                  className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-900"
                >
                  {Array.from({ length: currentCircuit.qubitsCount }).map((_, i) => (
                    <option key={i} value={i}>
                      q[{i}]
                    </option>
                  ))}
                </select>
              </div>

              {selectedGate.control !== undefined && (
                <div>
                  <label className="block text-[11px] text-slate-500 font-mono mb-1">Control Qubit</label>
                  <select
                    value={selectedGate.control}
                    onChange={(e) => handleUpdateGateParams({ control: parseInt(e.target.value, 10) })}
                    className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-900"
                  >
                    {Array.from({ length: currentCircuit.qubitsCount }).map((_, i) => (
                      <option key={i} value={i}>
                        q[{i}]
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {selectedGate.params && (
                <div>
                  <label className="block text-[11px] text-slate-500 font-mono mb-1">
                    Angle θ ({selectedGate.params.theta?.toFixed(2)} rad)
                  </label>
                  <input
                    type="range"
                    min="0"
                    max={2 * Math.PI}
                    step="0.05"
                    value={selectedGate.params.theta ?? 0}
                    onChange={(e) =>
                      handleUpdateGateParams({
                        params: { ...selectedGate.params, theta: parseFloat(e.target.value) },
                      })
                    }
                    className="w-full accent-blue-600 cursor-pointer"
                  />
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Clear Confirmation Modal */}
      <ConfirmModal
        isOpen={clearModalOpen}
        title="Clear Quantum Circuit?"
        message="This will remove all placed gates from the canvas. You can undo this action if needed."
        confirmLabel="Clear Canvas"
        isDestructive={true}
        onConfirm={handleClearConfirm}
        onCancel={() => setClearModalOpen(false)}
      />
    </div>
  );
};

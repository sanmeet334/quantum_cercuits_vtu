import React, { useState, useMemo } from 'react';
import {
  FolderOpen,
  Plus,
  Play,
  Copy,
  Trash2,
  Edit2,
  FileJson,
  Search,
  ArrowRight,
  GitBranch,
} from 'lucide-react';
import { useLab } from '../context/LabContext';
import { CircuitModel } from '../quantum/types';
import { ConfirmModal } from '../components/common/ConfirmModal';

export const SavedCircuitsPage: React.FC = () => {
  const {
    savedCircuits,
    saveCircuit,
    duplicateCircuit,
    deleteCircuit,
    renameCircuit,
    setCurrentCircuit,
    setActiveTab,
    showToast,
  } = useLab();

  const [searchQuery, setSearchQuery] = useState('');
  const [deleteCircuitId, setDeleteCircuitId] = useState<string | null>(null);
  const [renameCircuitId, setRenameCircuitId] = useState<string | null>(null);
  const [newNameInput, setNewNameInput] = useState('');

  const filteredCircuits = useMemo(() => {
    return savedCircuits.filter(
      (c) =>
        !searchQuery ||
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (c.description && c.description.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [savedCircuits, searchQuery]);

  const handleOpenStudio = (circuit: CircuitModel) => {
    setCurrentCircuit(circuit);
    setActiveTab('circuit_studio');
  };

  const handleOpenSimulator = (circuit: CircuitModel) => {
    setCurrentCircuit(circuit);
    setActiveTab('simulator');
  };

  const handleCreateNew = () => {
    const newCircuit: CircuitModel = {
      id: `custom_${Date.now()}`,
      name: 'Untitled Quantum Circuit',
      description: 'Custom quantum circuit constructed in QuantumGate Lab',
      qubitsCount: 2,
      classicalBitsCount: 2,
      gates: [{ id: 'g0', type: 'H', target: 0, col: 0 }],
      createdAt: new Date().toISOString(),
    };
    saveCircuit(newCircuit);
    setCurrentCircuit(newCircuit);
    setActiveTab('circuit_studio');
  };

  const handleConfirmRename = () => {
    if (renameCircuitId && newNameInput.trim()) {
      renameCircuit(renameCircuitId, newNameInput.trim());
      setRenameCircuitId(null);
      setNewNameInput('');
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="p-6 sm:p-8 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-800/40 text-cyan-300 text-xs font-mono mb-2">
            <FolderOpen className="w-3.5 h-3.5 text-cyan-400" />
            <span>Persistent Laboratory Library</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white font-display tracking-tight">
            Saved Quantum Circuits
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Browse, duplicate, export, and simulate your saved circuits and reference algorithms.
          </p>
        </div>

        <button
          onClick={handleCreateNew}
          className="flex items-center gap-2 px-4 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs rounded-xl shadow transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>New Circuit</span>
        </button>
      </div>

      {/* Filter and Search */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search circuits by name..."
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-900 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-sans"
          />
        </div>

        <span className="text-xs font-mono text-slate-400">
          {filteredCircuits.length} {filteredCircuits.length === 1 ? 'Circuit' : 'Circuits'}
        </span>
      </div>

      {/* Circuit Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCircuits.map((circuit) => (
          <div
            key={circuit.id}
            className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2 font-mono text-xs">
                <span className="text-cyan-400 font-bold">
                  {circuit.qubitsCount} Qubits · {circuit.gates.length} Gates
                </span>
                <span className="text-slate-500 text-[10px]">
                  {circuit.createdAt ? new Date(circuit.createdAt).toLocaleDateString() : 'Example'}
                </span>
              </div>

              <h3 className="text-base font-bold text-white mb-1 font-display truncate">
                {circuit.name}
              </h3>

              <p className="text-xs text-slate-400 leading-relaxed mb-4 line-clamp-2">
                {circuit.description || 'Custom quantum circuit layout.'}
              </p>
            </div>

            <div className="space-y-3 pt-3 border-t border-slate-800">
              {/* Primary Actions */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleOpenStudio(circuit)}
                  className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white border border-slate-700 transition-colors cursor-pointer"
                >
                  <GitBranch className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Studio</span>
                </button>
                <button
                  onClick={() => handleOpenSimulator(circuit)}
                  className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-xs font-bold text-slate-950 transition-colors cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5" />
                  <span>Simulate</span>
                </button>
              </div>

              {/* Secondary Actions */}
              <div className="flex items-center justify-between pt-1 text-slate-400">
                <button
                  onClick={() => {
                    setRenameCircuitId(circuit.id);
                    setNewNameInput(circuit.name);
                  }}
                  className="p-1.5 hover:text-white rounded hover:bg-slate-800 transition-colors cursor-pointer"
                  title="Rename Circuit"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => duplicateCircuit(circuit.id)}
                  className="p-1.5 hover:text-white rounded hover:bg-slate-800 transition-colors cursor-pointer"
                  title="Duplicate Circuit"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => setDeleteCircuitId(circuit.id)}
                  className="p-1.5 hover:text-rose-400 rounded hover:bg-slate-800 transition-colors cursor-pointer"
                  title="Delete Circuit"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteCircuitId !== null}
        title="Delete Quantum Circuit?"
        message="This action cannot be undone. Are you sure you want to permanently delete this circuit?"
        confirmLabel="Delete"
        isDestructive={true}
        onConfirm={() => {
          if (deleteCircuitId) {
            deleteCircuit(deleteCircuitId);
            setDeleteCircuitId(null);
          }
        }}
        onCancel={() => setDeleteCircuitId(null)}
      />

      {/* Rename Modal */}
      {renameCircuitId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
            <h3 className="text-base font-bold text-white font-display">Rename Circuit</h3>
            <input
              type="text"
              autoFocus
              value={newNameInput}
              onChange={(e) => setNewNameInput(e.target.value)}
              className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white outline-none focus:border-cyan-500 font-sans"
            />
            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => setRenameCircuitId(null)}
                className="px-3 py-1.5 text-xs text-slate-400 hover:text-white rounded-lg cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmRename}
                className="px-4 py-1.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs rounded-xl shadow cursor-pointer"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

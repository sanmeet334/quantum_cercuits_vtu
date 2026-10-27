import React, { useState } from 'react';
import {
  Settings,
  User,
  Sun,
  Moon,
  Volume2,
  VolumeX,
  Eye,
  Download,
  RotateCcw,
  Trash2,
  CheckCircle2,
  ShieldCheck,
  Binary,
  Info,
} from 'lucide-react';
import { useLab } from '../context/LabContext';
import { runQuantumVerifications, TestResult } from '../quantum/quantumVerification';
import { ConfirmModal } from '../components/common/ConfirmModal';

export const SettingsPage: React.FC = () => {
  const {
    studentName,
    setStudentName,
    settings,
    updateSettings,
    resetAllProgress,
    resetSavedCircuits,
    deleteAllData,
    showToast,
  } = useLab();

  const [nameInput, setNameInput] = useState(studentName || '');
  const [resetProgressModal, setResetProgressModal] = useState(false);
  const [resetCircuitsModal, setResetCircuitsModal] = useState(false);
  const [deleteAllModal, setDeleteAllModal] = useState(false);

  // Automated quantum verification suite state
  const [testResults, setTestResults] = useState<TestResult[] | null>(null);

  const handleRunVerificationSuite = () => {
    const results = runQuantumVerifications();
    setTestResults(results);
    const passedAll = results.every((r) => r.passed);
    if (passedAll) {
      showToast('success', 'Mathematical Suite Verified', 'All 12 quantum mechanical proofs passed with 0% defect.');
    } else {
      showToast('error', 'Verification Failure', 'One or more mathematical proofs deviated.');
    }
  };

  const handleUpdateName = (e: React.FormEvent) => {
    e.preventDefault();
    if (nameInput.trim()) {
      setStudentName(nameInput.trim());
    }
  };

  const handleExportAllData = () => {
    const exportObject = {
      app: 'QuantumGate Cloud Lab',
      version: '1.0.0',
      exportedAt: new Date().toISOString(),
      studentName,
      localStorageData: { ...localStorage },
    };
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(exportObject, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `quantumgate_student_backup_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast('success', 'Backup Exported', 'All student data exported as JSON file.');
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="p-6 sm:p-8 rounded-2xl bg-slate-900 border border-slate-800">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-800/40 text-cyan-300 text-xs font-mono mb-2">
          <Settings className="w-3.5 h-3.5 text-cyan-400" />
          <span>Workstation Configuration</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white font-display tracking-tight">
          Settings & Mathematical Verification
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Customize laboratory preferences, export backups, and execute on-screen mathematical proofs.
        </p>
      </div>

      {/* Student Profile Settings */}
      <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
        <h3 className="text-sm font-bold text-white font-display flex items-center gap-2">
          <User className="w-4 h-4 text-cyan-400" />
          <span>Student Profile Name</span>
        </h3>

        <form onSubmit={handleUpdateName} className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={nameInput}
            onChange={(e) => setNameInput(e.target.value)}
            placeholder="Enter Student Name"
            maxLength={50}
            className="flex-1 px-4 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white outline-none focus:border-cyan-500 font-sans"
          />
          <button
            type="submit"
            className="px-5 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs rounded-xl shadow cursor-pointer transition-colors"
          >
            Update Name
          </button>
        </form>
      </div>

      {/* Interface Preferences */}
      <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
        <h3 className="text-sm font-bold text-white font-display">
          Appearance & Accessibility
        </h3>

        <div className="divide-y divide-slate-800 text-xs">
          {/* Theme */}
          <div className="py-3 flex items-center justify-between">
            <div>
              <span className="font-semibold text-white block">Theme Mode</span>
              <span className="text-slate-400 text-[11px]">Toggle between Deep Dark and High-Contrast Light</span>
            </div>
            <button
              onClick={() => updateSettings({ theme: settings.theme === 'dark' ? 'light' : 'dark' })}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-white font-medium cursor-pointer"
            >
              {settings.theme === 'dark' ? (
                <>
                  <Moon className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Dark Theme</span>
                </>
              ) : (
                <>
                  <Sun className="w-3.5 h-3.5 text-amber-400" />
                  <span>Light Theme</span>
                </>
              )}
            </button>
          </div>

          {/* Text Size */}
          <div className="py-3 flex items-center justify-between">
            <div>
              <span className="font-semibold text-white block">Typography Scale</span>
              <span className="text-slate-400 text-[11px]">Adjust reading readability scale</span>
            </div>
            <div className="flex items-center gap-1 p-1 bg-slate-950 border border-slate-800 rounded-lg">
              <button
                onClick={() => updateSettings({ textSize: 'normal' })}
                className={`px-3 py-1 rounded text-xs cursor-pointer ${
                  settings.textSize === 'normal' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                Standard
              </button>
              <button
                onClick={() => updateSettings({ textSize: 'large' })}
                className={`px-3 py-1 rounded text-xs cursor-pointer ${
                  settings.textSize === 'large' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                Large
              </button>
            </div>
          </div>

          {/* Reduced Motion */}
          <div className="py-3 flex items-center justify-between">
            <div>
              <span className="font-semibold text-white block">Reduced Motion</span>
              <span className="text-slate-400 text-[11px]">Suppress decorative canvas particles</span>
            </div>
            <button
              onClick={() => updateSettings({ reducedMotion: !settings.reducedMotion })}
              className={`px-3 py-1.5 rounded-lg border text-xs cursor-pointer ${
                settings.reducedMotion
                  ? 'bg-cyan-500/10 border-cyan-500/40 text-cyan-300 font-bold'
                  : 'bg-slate-950 border-slate-800 text-slate-400'
              }`}
            >
              {settings.reducedMotion ? 'Enabled' : 'Disabled'}
            </button>
          </div>
        </div>
      </div>

      {/* Mathematical Verification Suite (Section 23 of prompt!) */}
      <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 to-indigo-950/40 border border-indigo-900/40 space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2 font-display">
              <Binary className="w-4 h-4 text-cyan-400" />
              <span>Section 23: Quantum Mathematical Verification Suite</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Execute all 12 mandatory mathematical theorems (X inversions, Hadamard interference, Bell state preparation, Born rule normalization, CNOT truth table).
            </p>
          </div>

          <button
            onClick={handleRunVerificationSuite}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 font-bold text-xs rounded-xl shadow cursor-pointer transition-all shrink-0"
          >
            <span>Run All 12 Proofs</span>
          </button>
        </div>

        {testResults && (
          <div className="space-y-2 mt-4 max-h-[50vh] overflow-y-auto custom-scrollbar p-1">
            {testResults.map((t) => (
              <div
                key={t.id}
                className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs font-mono space-y-1"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white">
                    Test #{t.id}: {t.name}
                  </span>
                  <span
                    className={`font-bold text-[10px] uppercase px-2 py-0.5 rounded border ${
                      t.passed
                        ? 'bg-emerald-950 border-emerald-800 text-emerald-400'
                        : 'bg-rose-950 border-rose-800 text-rose-400'
                    }`}
                  >
                    {t.passed ? 'PASSED' : 'FAILED'}
                  </span>
                </div>
                <div className="text-slate-400 text-[11px] flex justify-between">
                  <span>Expected: {t.expected}</span>
                  <span className="text-cyan-300">Actual: {t.actual}</span>
                </div>
                <p className="text-slate-500 text-[10px]">{t.details}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Data Management & Destructive Controls */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
        <h3 className="text-sm font-bold text-white font-display">
          Data Backup & Laboratory Reset
        </h3>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleExportAllData}
            className="flex items-center gap-1.5 px-4 py-2 bg-slate-800 hover:bg-slate-750 text-white rounded-xl text-xs font-medium border border-slate-700 cursor-pointer transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-cyan-400" />
            <span>Export Full Backup (JSON)</span>
          </button>

          <button
            onClick={() => setResetProgressModal(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-slate-800 hover:bg-slate-750 text-amber-300 rounded-xl text-xs font-medium border border-slate-700 cursor-pointer transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Progress</span>
          </button>

          <button
            onClick={() => setResetCircuitsModal(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-slate-800 hover:bg-slate-750 text-amber-300 rounded-xl text-xs font-medium border border-slate-700 cursor-pointer transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Circuits</span>
          </button>

          <button
            onClick={() => setDeleteAllModal(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-rose-950/60 hover:bg-rose-900/60 text-rose-300 border border-rose-800/40 rounded-xl text-xs font-bold cursor-pointer transition-colors ml-auto"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Factory Reset All Data</span>
          </button>
        </div>
      </div>

      {/* Modals */}
      <ConfirmModal
        isOpen={resetProgressModal}
        title="Reset All Progress?"
        message="This will reset all lesson completions, quiz answers, and test scores. Your saved circuits will not be deleted."
        confirmLabel="Reset Progress"
        isDestructive={true}
        onConfirm={resetAllProgress}
        onCancel={() => setResetProgressModal(false)}
      />

      <ConfirmModal
        isOpen={resetCircuitsModal}
        title="Reset Saved Circuits?"
        message="This will restore the circuit library to standard reference example circuits."
        confirmLabel="Reset Circuits"
        isDestructive={true}
        onConfirm={resetSavedCircuits}
        onCancel={() => setResetCircuitsModal(false)}
      />

      <ConfirmModal
        isOpen={deleteAllModal}
        title="Factory Reset All Local Data?"
        message="This will permanently delete all student credentials, saved circuits, test history, and return to the Name-Only welcome screen."
        confirmLabel="Delete Everything"
        isDestructive={true}
        onConfirm={deleteAllData}
        onCancel={() => setDeleteAllModal(false)}
      />
    </div>
  );
};

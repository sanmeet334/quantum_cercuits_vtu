import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { CircuitModel, GateType } from '../quantum/types';
import { EXAMPLE_CIRCUITS } from '../data/exampleCircuits';
import { ACHIEVEMENTS_DATA } from '../data/achievementsData';
import {
  NavigationTab,
  PracticeRecord,
  AssessmentRecord,
  UserSettings,
  ToastNotification,
} from '../types/labTypes';

interface LabContextType {
  studentName: string | null;
  setStudentName: (name: string) => void;
  activeTab: NavigationTab;
  setActiveTab: (tab: NavigationTab) => void;
  selectedGateId: GateType;
  setSelectedGateId: (id: GateType) => void;
  selectedLessonId: string | null;
  setSelectedLessonId: (id: string | null) => void;
  selectedLabId: string | null;
  setSelectedLabId: (id: string | null) => void;
  currentCircuit: CircuitModel;
  setCurrentCircuit: React.Dispatch<React.SetStateAction<CircuitModel>>;
  savedCircuits: CircuitModel[];
  saveCircuit: (circuit: CircuitModel) => void;
  duplicateCircuit: (id: string) => void;
  deleteCircuit: (id: string) => void;
  renameCircuit: (id: string, newName: string) => void;
  completedLessons: string[];
  toggleLessonCompleted: (id: string) => void;
  completedLabs: string[];
  markLabCompleted: (id: string) => void;
  practiceAttempts: PracticeRecord[];
  recordPracticeAttempt: (questionId: string, correct: boolean) => void;
  assessmentHistory: AssessmentRecord[];
  recordAssessmentResult: (record: Omit<AssessmentRecord, 'id'>) => void;
  streak: number;
  unlockedAchievements: string[];
  unlockAchievement: (id: string) => void;
  settings: UserSettings;
  updateSettings: (newSettings: Partial<UserSettings>) => void;
  toast: ToastNotification | null;
  showToast: (type: 'success' | 'error' | 'info', title: string, message: string) => void;
  searchModalOpen: boolean;
  setSearchModalOpen: (open: boolean) => void;
  glossaryModalOpen: boolean;
  setGlossaryModalOpen: (open: boolean) => void;
  resetAllProgress: () => void;
  resetSavedCircuits: () => void;
  deleteAllData: () => void;
}

const STORAGE_KEYS = {
  NAME: 'quantumgate_student_name',
  SAVED_CIRCUITS: 'quantumgate_saved_circuits',
  COMPLETED_LESSONS: 'quantumgate_completed_lessons',
  COMPLETED_LABS: 'quantumgate_completed_labs',
  PRACTICE_ATTEMPTS: 'quantumgate_practice_attempts',
  ASSESSMENTS: 'quantumgate_assessment_history',
  ACHIEVEMENTS: 'quantumgate_achievements',
  SETTINGS: 'quantumgate_settings',
  LAST_ACTIVE: 'quantumgate_last_active_date',
  STREAK: 'quantumgate_streak',
};

const defaultSettings: UserSettings = {
  theme: 'light',
  textSize: 'normal',
  soundEnabled: false,
  reducedMotion: false,
};

const LabContext = createContext<LabContextType | undefined>(undefined);

export const LabProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // 1. Student Name
  const [studentName, setStudentNameState] = useState<string | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.NAME);
      return saved ? saved.trim() : null;
    } catch {
      return null;
    }
  });

  // 2. Navigation
  const [activeTab, setActiveTab] = useState<NavigationTab>('dashboard');
  const [selectedGateId, setSelectedGateId] = useState<GateType>('H');
  const [selectedLessonId, setSelectedLessonId] = useState<string | null>(null);
  const [selectedLabId, setSelectedLabId] = useState<string | null>(null);

  // 3. Modals & Notifications
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [glossaryModalOpen, setGlossaryModalOpen] = useState(false);
  const [toast, setToast] = useState<ToastNotification | null>(null);

  const showToast = useCallback((type: 'success' | 'error' | 'info', title: string, message: string) => {
    const id = Date.now().toString();
    setToast({ id, type, title, message });
    setTimeout(() => {
      setToast(prev => (prev?.id === id ? null : prev));
    }, 4000);
  }, []);

  // 4. Saved Circuits
  const [savedCircuits, setSavedCircuits] = useState<CircuitModel[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SAVED_CIRCUITS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.warn('Failed to parse saved circuits, fallback to examples:', e);
    }
    return EXAMPLE_CIRCUITS;
  });

  // Active Circuit model (starts with Bell state)
  const [currentCircuit, setCurrentCircuit] = useState<CircuitModel>(() => {
    return EXAMPLE_CIRCUITS[0] || {
      id: 'default_circuit',
      name: 'Default 2-Qubit Circuit',
      qubitsCount: 2,
      classicalBitsCount: 2,
      gates: [{ id: 'g0', type: 'H', target: 0, col: 0 }],
    };
  });

  // 5. Progress Tracking
  const [completedLessons, setCompletedLessons] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.COMPLETED_LESSONS);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [completedLabs, setCompletedLabs] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.COMPLETED_LABS);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [practiceAttempts, setPracticeAttempts] = useState<PracticeRecord[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PRACTICE_ATTEMPTS);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [assessmentHistory, setAssessmentHistory] = useState<AssessmentRecord[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ASSESSMENTS);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [unlockedAchievements, setUnlockedAchievements] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ACHIEVEMENTS);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // 6. Settings
  const [settings, setSettings] = useState<UserSettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      return saved ? { ...defaultSettings, ...JSON.parse(saved) } : defaultSettings;
    } catch {
      return defaultSettings;
    }
  });

  // 7. Streak
  const [streak, setStreak] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.STREAK);
      return saved ? parseInt(saved, 10) : 1;
    } catch {
      return 1;
    }
  });

  // Update streak on mount
  useEffect(() => {
    try {
      const today = new Date().toDateString();
      const lastActive = localStorage.getItem(STORAGE_KEYS.LAST_ACTIVE);

      if (!lastActive) {
        localStorage.setItem(STORAGE_KEYS.LAST_ACTIVE, today);
        localStorage.setItem(STORAGE_KEYS.STREAK, '1');
        setStreak(1);
      } else if (lastActive !== today) {
        const lastDate = new Date(lastActive);
        const currDate = new Date(today);
        const diffDays = Math.round((currDate.getTime() - lastDate.getTime()) / (1000 * 3600 * 24));

        let newStreak = streak;
        if (diffDays === 1) {
          newStreak = streak + 1;
        } else if (diffDays > 1) {
          newStreak = 1;
        }
        localStorage.setItem(STORAGE_KEYS.LAST_ACTIVE, today);
        localStorage.setItem(STORAGE_KEYS.STREAK, newStreak.toString());
        setStreak(newStreak);
      }
    } catch (e) {
      console.warn('Streak update error:', e);
    }
  }, []);

  // Update theme on HTML body
  useEffect(() => {
    if (settings.theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
    }
  }, [settings.theme]);

  // Set student name handler
  const setStudentName = useCallback((name: string) => {
    const cleanName = name.trim();
    if (!cleanName) return;
    try {
      localStorage.setItem(STORAGE_KEYS.NAME, cleanName);
      setStudentNameState(cleanName);
      // Automatically unlock first visit achievement
      unlockAchievement('first_visit');
      showToast('success', 'Lab Initialized', `Welcome to QuantumGate Cloud Lab, ${cleanName}!`);
    } catch (e) {
      console.error('Storage error:', e);
    }
  }, [showToast]);

  // Unlock achievement
  const unlockAchievement = useCallback((id: string) => {
    setUnlockedAchievements(prev => {
      if (prev.includes(id)) return prev;
      const next = [...prev, id];
      try {
        localStorage.setItem(STORAGE_KEYS.ACHIEVEMENTS, JSON.stringify(next));
      } catch {}

      const found = ACHIEVEMENTS_DATA.find(a => a.id === id);
      if (found) {
        showToast('success', 'Achievement Unlocked!', `${found.title} — ${found.description}`);
        try {
          confetti({
            particleCount: 50,
            spread: 55,
            origin: { y: 0.8 },
            colors: ['#06b6d4', '#8b5cf6', '#ec4899', '#3b82f6'],
          });
        } catch {}
      }
      return next;
    });
  }, [showToast]);

  // Save circuit
  const saveCircuit = useCallback((circuit: CircuitModel) => {
    setSavedCircuits(prev => {
      const idx = prev.findIndex(c => c.id === circuit.id);
      let updated: CircuitModel[];
      if (idx >= 0) {
        updated = [...prev];
        updated[idx] = { ...circuit, updatedAt: new Date().toISOString() };
      } else {
        updated = [
          {
            ...circuit,
            id: circuit.id || `circ_${Date.now()}`,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          ...prev,
        ];
      }
      try {
        localStorage.setItem(STORAGE_KEYS.SAVED_CIRCUITS, JSON.stringify(updated));
      } catch {}
      return updated;
    });
    unlockAchievement('first_circuit');
    showToast('success', 'Circuit Saved', `"${circuit.name}" has been stored in your laboratory.`);
  }, [showToast, unlockAchievement]);

  // Duplicate circuit
  const duplicateCircuit = useCallback((id: string) => {
    const orig = savedCircuits.find(c => c.id === id);
    if (!orig) return;
    const duplicated: CircuitModel = {
      ...orig,
      id: `copy_${Date.now()}`,
      name: `${orig.name} (Copy)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setSavedCircuits(prev => {
      const next = [duplicated, ...prev];
      try {
        localStorage.setItem(STORAGE_KEYS.SAVED_CIRCUITS, JSON.stringify(next));
      } catch {}
      return next;
    });
    showToast('info', 'Circuit Duplicated', `Created "${duplicated.name}".`);
  }, [savedCircuits, showToast]);

  // Delete circuit
  const deleteCircuit = useCallback((id: string) => {
    setSavedCircuits(prev => {
      const next = prev.filter(c => c.id !== id);
      try {
        localStorage.setItem(STORAGE_KEYS.SAVED_CIRCUITS, JSON.stringify(next));
      } catch {}
      return next;
    });
    showToast('info', 'Circuit Deleted', 'The circuit has been removed.');
  }, [showToast]);

  // Rename circuit
  const renameCircuit = useCallback((id: string, newName: string) => {
    const clean = newName.trim();
    if (!clean) return;
    setSavedCircuits(prev => {
      const next = prev.map(c => (c.id === id ? { ...c, name: clean, updatedAt: new Date().toISOString() } : c));
      try {
        localStorage.setItem(STORAGE_KEYS.SAVED_CIRCUITS, JSON.stringify(next));
      } catch {}
      return next;
    });
    showToast('success', 'Circuit Renamed', `Renamed to "${clean}".`);
  }, [showToast]);

  // Toggle completed lesson
  const toggleLessonCompleted = useCallback((id: string) => {
    setCompletedLessons(prev => {
      let next: string[];
      if (prev.includes(id)) {
        next = prev.filter(item => item !== id);
      } else {
        next = [...prev, id];
        unlockAchievement('first_lesson');
        if (next.length >= 5) {
          // Check quantum mastery condition
          if (completedLabs.length >= 3 && assessmentHistory.some(a => a.passed)) {
            unlockAchievement('quantum_mastery');
          }
        }
      }
      try {
        localStorage.setItem(STORAGE_KEYS.COMPLETED_LESSONS, JSON.stringify(next));
      } catch {}
      return next;
    });
  }, [unlockAchievement, completedLabs.length, assessmentHistory]);

  // Mark lab completed
  const markLabCompleted = useCallback((id: string) => {
    setCompletedLabs(prev => {
      if (prev.includes(id)) return prev;
      const next = [...prev, id];
      try {
        localStorage.setItem(STORAGE_KEYS.COMPLETED_LABS, JSON.stringify(next));
      } catch {}
      unlockAchievement('lab_completed');
      if (next.length >= 3 && completedLessons.length >= 5 && assessmentHistory.some(a => a.passed)) {
        unlockAchievement('quantum_mastery');
      }
      showToast('success', 'Lab Completed!', 'Congratulations on completing this guided quantum experiment.');
      return next;
    });
  }, [unlockAchievement, completedLessons.length, assessmentHistory, showToast]);

  // Record practice attempt
  const recordPracticeAttempt = useCallback((questionId: string, correct: boolean) => {
    setPracticeAttempts(prev => {
      const rec: PracticeRecord = {
        id: `pa_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        questionId,
        correct,
        timestamp: new Date().toISOString(),
      };
      const next = [rec, ...prev];
      try {
        localStorage.setItem(STORAGE_KEYS.PRACTICE_ATTEMPTS, JSON.stringify(next));
      } catch {}

      if (next.length >= 5) {
        unlockAchievement('practice_champion');
      }
      return next;
    });
  }, [unlockAchievement]);

  // Record assessment result
  const recordAssessmentResult = useCallback((record: Omit<AssessmentRecord, 'id'>) => {
    const id = `asmt_${Date.now()}`;
    const fullRecord: AssessmentRecord = { ...record, id };

    setAssessmentHistory(prev => {
      const next = [fullRecord, ...prev];
      try {
        localStorage.setItem(STORAGE_KEYS.ASSESSMENTS, JSON.stringify(next));
      } catch {}
      return next;
    });

    if (record.passed) {
      unlockAchievement('assessment_passed');
      if (completedLessons.length >= 5 && completedLabs.length >= 3) {
        unlockAchievement('quantum_mastery');
      }
      showToast('success', 'Assessment Passed!', `Scored ${record.score}/${record.total} (${record.percentage}%).`);
    } else {
      showToast('info', 'Assessment Submitted', `Score: ${record.score}/${record.total} (${record.percentage}%). Review recommendations below.`);
    }
  }, [completedLessons.length, completedLabs.length, unlockAchievement, showToast]);

  // Update settings
  const updateSettings = useCallback((newSettings: Partial<UserSettings>) => {
    setSettings(prev => {
      const next = { ...prev, ...newSettings };
      try {
        localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(next));
      } catch {}
      return next;
    });
  }, []);

  // Reset Progress
  const resetAllProgress = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEYS.COMPLETED_LESSONS);
      localStorage.removeItem(STORAGE_KEYS.COMPLETED_LABS);
      localStorage.removeItem(STORAGE_KEYS.PRACTICE_ATTEMPTS);
      localStorage.removeItem(STORAGE_KEYS.ASSESSMENTS);
      localStorage.removeItem(STORAGE_KEYS.ACHIEVEMENTS);
      setCompletedLessons([]);
      setCompletedLabs([]);
      setPracticeAttempts([]);
      setAssessmentHistory([]);
      setUnlockedAchievements(studentName ? ['first_visit'] : []);
      showToast('info', 'Progress Reset', 'All lesson, lab, and quiz progress has been cleared.');
    } catch {}
  }, [studentName, showToast]);

  // Reset saved circuits
  const resetSavedCircuits = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEYS.SAVED_CIRCUITS);
      setSavedCircuits(EXAMPLE_CIRCUITS);
      setCurrentCircuit(EXAMPLE_CIRCUITS[0]);
      showToast('info', 'Circuits Reset', 'Circuit library restored to default examples.');
    } catch {}
  }, [showToast]);

  // Delete all data
  const deleteAllData = useCallback(() => {
    try {
      localStorage.clear();
      setStudentNameState(null);
      setCompletedLessons([]);
      setCompletedLabs([]);
      setPracticeAttempts([]);
      setAssessmentHistory([]);
      setUnlockedAchievements([]);
      setSavedCircuits(EXAMPLE_CIRCUITS);
      setSettings(defaultSettings);
      showToast('info', 'All Data Deleted', 'Laboratory reset to factory initial state.');
    } catch {}
  }, [showToast]);

  return (
    <LabContext.Provider
      value={{
        studentName,
        setStudentName,
        activeTab,
        setActiveTab,
        selectedGateId,
        setSelectedGateId,
        selectedLessonId,
        setSelectedLessonId,
        selectedLabId,
        setSelectedLabId,
        currentCircuit,
        setCurrentCircuit,
        savedCircuits,
        saveCircuit,
        duplicateCircuit,
        deleteCircuit,
        renameCircuit,
        completedLessons,
        toggleLessonCompleted,
        completedLabs,
        markLabCompleted,
        practiceAttempts,
        recordPracticeAttempt,
        assessmentHistory,
        recordAssessmentResult,
        streak,
        unlockedAchievements,
        unlockAchievement,
        settings,
        updateSettings,
        toast,
        showToast,
        searchModalOpen,
        setSearchModalOpen,
        glossaryModalOpen,
        setGlossaryModalOpen,
        resetAllProgress,
        resetSavedCircuits,
        deleteAllData,
      }}
    >
      {children}
    </LabContext.Provider>
  );
};

export const useLab = () => {
  const context = useContext(LabContext);
  if (!context) {
    throw new Error('useLab must be used within a LabProvider');
  }
  return context;
};

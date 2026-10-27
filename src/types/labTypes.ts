import { CircuitModel, GateType } from '../quantum/types';

export type NavigationTab =
  | 'dashboard'
  | 'academy'
  | 'gate_explorer'
  | 'circuit_studio'
  | 'simulator'
  | 'entanglement'
  | 'quantum_labs'
  | 'circuit_debugger'
  | 'practice_arena'
  | 'assessments'
  | 'analytics'
  | 'saved_circuits'
  | 'achievements'
  | 'ai_tutor'
  | 'settings';

export interface TutorMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  contextActionUsed?: string;
  suggestedActions?: string[];
  relatedLessonId?: string;
  relatedGateId?: GateType;
  relatedLabId?: string;
  suggestedCircuit?: CircuitModel;
}

export interface PracticeRecord {
  id: string;
  questionId: string;
  correct: boolean;
  timestamp: string;
}

export interface AssessmentRecord {
  id: string;
  testType: string;
  title: string;
  date: string;
  score: number;
  total: number;
  percentage: number;
  passed: boolean;
  timeTakenSeconds: number;
  answers: Record<string, number>;
}

export interface UserSettings {
  theme: 'dark' | 'light';
  textSize: 'normal' | 'large';
  soundEnabled: boolean;
  reducedMotion: boolean;
}

export interface ToastNotification {
  id: string;
  type: 'success' | 'error' | 'info';
  title: string;
  message: string;
}

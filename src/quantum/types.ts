export interface Complex {
  r: number; // real part
  i: number; // imaginary part
}

export type GateType =
  // Single-qubit
  | 'I'
  | 'X'
  | 'Y'
  | 'Z'
  | 'H'
  | 'S'
  | 'Sdg'
  | 'T'
  | 'Tdg'
  | 'SX'
  | 'RX'
  | 'RY'
  | 'RZ'
  | 'U3'
  // Multi-qubit
  | 'CX'
  | 'CZ'
  | 'CP'
  | 'SWAP'
  | 'CCX'
  | 'CSWAP'
  | 'CRX'
  // Measurement
  | 'MEASURE';

export interface GateParams {
  theta?: number;
  phi?: number;
  lambda?: number;
}

export interface CircuitGate {
  id: string;
  type: GateType;
  target: number;
  control?: number;
  control2?: number; // for CCX / CSWAP
  target2?: number;  // for SWAP
  col: number;
  params?: GateParams;
  classicalBit?: number;
}

export interface CircuitModel {
  id: string;
  name: string;
  description?: string;
  qubitsCount: number;
  classicalBitsCount: number;
  gates: CircuitGate[];
  createdAt?: string;
  updatedAt?: string;
}

export interface SimulationResult {
  qubitsCount: number;
  stateVector: Complex[];
  probabilities: number[];
  basisStates: string[];
  shots: number;
  counts: Record<string, number>;
  blochSpheres: Array<{ x: number; y: number; z: number; theta: number; phi: number }>;
  executionTimeMs: number;
  timestamp: string;
}

export interface DebugIssue {
  id: string;
  title: string;
  severity: 'error' | 'warning' | 'info';
  location: string;
  explanation: string;
  suggestion: string;
  fixable: boolean;
  fixAction?: () => void;
}

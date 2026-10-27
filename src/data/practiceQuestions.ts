export interface PracticeQuestion {
  id: string;
  category: 'gate_matching' | 'state_prediction' | 'probability' | 'missing_gate' | 'qiskit' | 'concepts';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  question: string;
  codeSnippet?: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  relevantLessonId: string;
}

export const PRACTICE_QUESTIONS: PracticeQuestion[] = [
  // Beginner
  {
    id: 'pq_1',
    category: 'state_prediction',
    difficulty: 'beginner',
    question: 'What is the output state when a Pauli-X gate is applied to computational basis state |0⟩?',
    options: ['|0⟩', '|1⟩', '(|0⟩ + |1⟩)/√2', '-|0⟩'],
    correctIndex: 1,
    explanation: 'Pauli-X is the quantum bit-flip operator: X|0⟩ = |1⟩.',
    relevantLessonId: 'lesson-2',
  },
  {
    id: 'pq_2',
    category: 'probability',
    difficulty: 'beginner',
    question: 'If a qubit is in state |+⟩ = (|0⟩ + |1⟩)/√2, what is the probability of measuring 0 in the computational basis?',
    options: ['0%', '25%', '50%', '100%'],
    correctIndex: 2,
    explanation: 'Born rule: P(0) = |1/√2|² = 1/2 = 50%.',
    relevantLessonId: 'lesson-5',
  },
  {
    id: 'pq_3',
    category: 'gate_matching',
    difficulty: 'beginner',
    question: 'Which gate is represented by the 2x2 matrix [[0, 1], [1, 0]]?',
    options: ['Hadamard (H)', 'Pauli-X', 'Pauli-Z', 'Identity (I)'],
    correctIndex: 1,
    explanation: 'The Pauli-X matrix has zeros on the diagonal and ones on the off-diagonals.',
    relevantLessonId: 'lesson-10',
  },
  {
    id: 'pq_4',
    category: 'qiskit',
    difficulty: 'beginner',
    question: 'Which Qiskit code snippet places a Hadamard gate on qubit 0 of QuantumCircuit qc?',
    options: ['qc.hadamard(0)', 'qc.h(0)', 'qc.add_gate("H", 0)', 'qc.apply_h(0)'],
    correctIndex: 1,
    explanation: 'In Qiskit, qc.h(qubit_index) is the standard method for applying a Hadamard gate.',
    relevantLessonId: 'lesson-9',
  },
  {
    id: 'pq_5',
    category: 'missing_gate',
    difficulty: 'beginner',
    question: 'To invert a qubit initialized in state |0⟩ into state |1⟩, which gate must be placed in the circuit?',
    options: ['Identity', 'Hadamard', 'Pauli-X', 'Pauli-Z'],
    correctIndex: 2,
    explanation: 'The Pauli-X gate flips |0⟩ to |1⟩.',
    relevantLessonId: 'lesson-2',
  },
  {
    id: 'pq_6',
    category: 'concepts',
    difficulty: 'beginner',
    question: 'What happens to a qubit in superposition when it undergoes a projective measurement?',
    options: [
      'It creates a duplicate qubit',
      'It collapses into one definite computational basis state (|0⟩ or |1⟩)',
      'It speeds up its rotation',
      'It stays in superposition permanently',
    ],
    correctIndex: 1,
    explanation: 'Wavefunction collapse projects the state vector onto one of the measurement operator eigenstates.',
    relevantLessonId: 'lesson-6',
  },

  // Intermediate
  {
    id: 'pq_7',
    category: 'state_prediction',
    difficulty: 'intermediate',
    question: 'What is the output state when a Hadamard gate is applied to state |1⟩?',
    options: ['|+⟩ = (|0⟩ + |1⟩)/√2', '|−⟩ = (|0⟩ − |1⟩)/√2', '|1⟩', '-i|0⟩'],
    correctIndex: 1,
    explanation: 'H|1⟩ = (|0⟩ - |1⟩)/√2 = |−⟩.',
    relevantLessonId: 'lesson-9',
  },
  {
    id: 'pq_8',
    category: 'probability',
    difficulty: 'intermediate',
    question: 'For the Bell state |Φ⁺⟩ = (|00⟩ + |11⟩)/√2, what is the probability of measuring outcome 01?',
    options: ['50%', '25%', '0%', '100%'],
    correctIndex: 2,
    explanation: 'The state has zero amplitude for |01⟩, so P(01) = |0|² = 0%.',
    relevantLessonId: 'lesson-15',
  },
  {
    id: 'pq_9',
    category: 'gate_matching',
    difficulty: 'intermediate',
    question: 'Which gate applies a π/2 (90°) phase shift to state |1⟩ without changing |0⟩?',
    options: ['Pauli-X', 'Phase Gate S', 'T Gate', 'Hadamard'],
    correctIndex: 1,
    explanation: 'The S gate matrix is diag(1, i) = diag(1, e^(iπ/2)), which rotates phase by π/2.',
    relevantLessonId: 'lesson-11',
  },
  {
    id: 'pq_10',
    category: 'qiskit',
    difficulty: 'intermediate',
    question: 'In Qiskit, what does the command qc.cx(0, 1) do?',
    options: [
      'Applies CNOT with control qubit 1 and target qubit 0',
      'Applies CNOT with control qubit 0 and target qubit 1',
      'Swaps qubits 0 and 1',
      'Measures qubits 0 and 1',
    ],
    correctIndex: 1,
    explanation: 'In qc.cx(control, target), the first argument is control and second argument is target.',
    relevantLessonId: 'lesson-13',
  },
  {
    id: 'pq_11',
    category: 'missing_gate',
    difficulty: 'intermediate',
    question: 'To prepare a Bell state from |00⟩, qubit 0 receives a Hadamard gate. What gate connects qubit 0 to qubit 1 next?',
    options: ['SWAP', 'Pauli-Z', 'CNOT (CX)', 'Toffoli'],
    correctIndex: 2,
    explanation: 'CNOT with control on qubit 0 and target on qubit 1 entangles the two qubits into (|00⟩+|11⟩)/√2.',
    relevantLessonId: 'lesson-15',
  },
  {
    id: 'pq_12',
    category: 'concepts',
    difficulty: 'intermediate',
    question: 'Can two entangled qubits be used to transmit classical data faster than light?',
    options: [
      'Yes, quantum entanglement is instantaneous',
      'No, because the outcome on either side appears purely random without classical communication (No-Communication Theorem)',
      'Only if cooled to 0 Kelvin',
      'Yes, in optical fibers',
    ],
    correctIndex: 1,
    explanation: 'The No-Signaling Theorem proves that local measurements on an entangled state cannot transmit information.',
    relevantLessonId: 'lesson-15',
  },

  // Advanced
  {
    id: 'pq_13',
    category: 'state_prediction',
    difficulty: 'advanced',
    question: 'What is the action of an RY(π) rotation on basis state |0⟩?',
    options: ['|0⟩', '|1⟩', '-i|1⟩', '|+⟩'],
    correctIndex: 1,
    explanation: 'RY(π)|0⟩ = cos(π/2)|0⟩ + sin(π/2)|1⟩ = 0|0⟩ + 1|1⟩ = |1⟩.',
    relevantLessonId: 'lesson-19',
  },
  {
    id: 'pq_14',
    category: 'gate_matching',
    difficulty: 'advanced',
    question: 'Which universal reversible classical logic gate flips the target qubit if and only if two control qubits are both 1?',
    options: ['Fredkin gate (CSWAP)', 'Toffoli gate (CCX)', 'Peres gate', 'Feynman gate'],
    correctIndex: 1,
    explanation: 'The Toffoli (CCX) gate is the 3-qubit controlled-controlled-NOT gate.',
    relevantLessonId: 'lesson-13',
  },
  {
    id: 'pq_15',
    category: 'qiskit',
    difficulty: 'advanced',
    question: 'How do you create an arbitrary single-qubit unitary with Euler angles θ, φ, λ in Qiskit?',
    options: ['qc.unitary_single(0)', 'qc.u(theta, phi, lambda, 0)', 'qc.euler(0)', 'qc.rot(0)'],
    correctIndex: 1,
    explanation: 'qc.u(theta, phi, lambda, qubit) implements the universal single-qubit U3 gate.',
    relevantLessonId: 'lesson-19',
  },
  {
    id: 'pq_16',
    category: 'concepts',
    difficulty: 'advanced',
    question: 'What speedup does Grover search algorithm provide for searching an unsorted database of N items?',
    options: ['Exponential: O(log N)', 'Quadratic: O(√N) versus classical O(N)', 'Cubic: O(N^(1/3))', 'Linear: O(N)'],
    correctIndex: 1,
    explanation: 'Grover algorithm requires O(√N) oracle evaluations, a proven quadratic speedup.',
    relevantLessonId: 'lesson-24',
  },
];

export interface AssessmentQuestion {
  id: string;
  stage: 1 | 2 | 3 | 4 | 5; // 1: Fundamentals, 2: Basic Applications, 3: Intermediate, 4: Advanced, 5: Challenging
  stageName: string;
  topic: string;
  question: string;
  codeSnippet?: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface AssessmentTest {
  id: string;
  title: string;
  description: string;
  category: 'gate_test' | 'topic_test' | 'full_assessment' | 'mixed_test';
  timeLimitMinutes: number;
  questions: AssessmentQuestion[]; // Exactly 25 questions!
}

// Helper to create stage names
const STAGE_NAMES: Record<number, string> = {
  1: 'Stage 1: Fundamentals',
  2: 'Stage 2: Basic Applications',
  3: 'Stage 3: Intermediate Understanding',
  4: 'Stage 4: Advanced Applications',
  5: 'Stage 5: Challenging Problem-Solving',
};

// FULL QUANTUM GATES COMPREHENSIVE ASSESSMENT (25 Questions, 5 per stage)
export const FULL_ASSESSMENT_QUESTIONS: AssessmentQuestion[] = [
  // Stage 1: Fundamentals (Q1 - Q5)
  {
    id: 'fa_1',
    stage: 1,
    stageName: STAGE_NAMES[1],
    topic: 'Fundamentals',
    question: 'Which mathematical condition must the probability amplitudes α and β of a normalized pure qubit state α|0⟩ + β|1⟩ satisfy?',
    options: ['|α| + |β| = 1', '|α|² + |β|² = 1', 'α · β = 0', 'α² + β² = 1'],
    correctIndex: 1,
    explanation: 'By the Born rule, the sum of probabilities across all orthogonal basis states must equal 1: |α|² + |β|² = 1.',
  },
  {
    id: 'fa_2',
    stage: 1,
    stageName: STAGE_NAMES[1],
    topic: 'Pauli Gates',
    question: 'What is the matrix representation of the Pauli-X gate?',
    options: ['[[1, 0], [0, 1]]', '[[0, 1], [1, 0]]', '[[0, -i], [i, 0]]', '[[1, 0], [0, -1]]'],
    correctIndex: 1,
    explanation: 'Pauli-X has matrix elements [[0, 1], [1, 0]], mapping [1, 0]ᵀ to [0, 1]ᵀ and vice versa.',
  },
  {
    id: 'fa_3',
    stage: 1,
    stageName: STAGE_NAMES[1],
    topic: 'Hadamard',
    question: 'When the Hadamard gate acts on state |0⟩, what is the resulting state vector?',
    options: ['|1⟩', '(|0⟩ + |1⟩)/√2', '(|0⟩ - |1⟩)/√2', 'i|0⟩'],
    correctIndex: 1,
    explanation: 'H|0⟩ = (|0⟩ + |1⟩)/√2 = |+⟩, producing an equal superposition.',
  },
  {
    id: 'fa_4',
    stage: 1,
    stageName: STAGE_NAMES[1],
    topic: 'Phase Gates',
    question: 'What is the eigenvalue of Pauli-Z when applied to the computational basis state |0⟩?',
    options: ['+1', '-1', '0', '+i'],
    correctIndex: 0,
    explanation: 'Z|0⟩ = +1|0⟩, so |0⟩ is an eigenstate of Z with eigenvalue +1.',
  },
  {
    id: 'fa_5',
    stage: 1,
    stageName: STAGE_NAMES[1],
    topic: 'Reversibility',
    question: 'Why are all quantum gate operations (excluding measurement) mathematically reversible?',
    options: [
      'They are symmetric real matrices',
      'They are represented by unitary matrices (U†U = I)',
      'They have zero determinant',
      'They only operate on classical bits',
    ],
    correctIndex: 1,
    explanation: 'A unitary operator satisfies U⁻¹ = U†, guaranteeing an exact inverse operation exists.',
  },

  // Stage 2: Basic Applications (Q6 - Q10)
  {
    id: 'fa_6',
    stage: 2,
    stageName: STAGE_NAMES[2],
    topic: 'Bit-Flip Inversion',
    question: 'What is the output state when two consecutive Pauli-X gates are applied to state |0⟩?',
    options: ['|1⟩', '|0⟩', '(|0⟩ + |1⟩)/√2', '-|1⟩'],
    correctIndex: 1,
    explanation: 'Because X² = Identity, X(X|0⟩) = X|1⟩ = |0⟩.',
  },
  {
    id: 'fa_7',
    stage: 2,
    stageName: STAGE_NAMES[2],
    topic: 'Superposition Measurement',
    question: 'If a qubit in state |−⟩ = (|0⟩ − |1⟩)/√2 is measured in the computational Z-basis, what is the probability of measuring 1?',
    options: ['0%', '50%', '100%', '25%'],
    correctIndex: 1,
    explanation: 'P(1) = |-1/√2|² = 1/2 = 50%. Relative phase does not change Z-basis measurement probabilities.',
  },
  {
    id: 'fa_8',
    stage: 2,
    stageName: STAGE_NAMES[2],
    topic: 'Controlled Operations',
    question: 'In a 2-qubit CNOT gate where qubit 0 is control and qubit 1 is target, what is the output for input state |01⟩ (q0=1, q1=0)?',
    options: ['|01⟩', '|11⟩', '|00⟩', '|10⟩'],
    correctIndex: 1,
    explanation: 'Because control qubit 0 is 1, target qubit 1 is inverted from 0 to 1, producing state |11⟩.',
  },
  {
    id: 'fa_9',
    stage: 2,
    stageName: STAGE_NAMES[2],
    topic: 'Phase Gate S',
    question: 'What is the action of the Phase gate S on the basis state |1⟩?',
    options: ['S|1⟩ = |0⟩', 'S|1⟩ = i|1⟩', 'S|1⟩ = -|1⟩', 'S|1⟩ = e^(iπ/4)|1⟩'],
    correctIndex: 1,
    explanation: 'S = diag(1, i), so S|1⟩ = i|1⟩, applying a π/2 phase shift.',
  },
  {
    id: 'fa_10',
    stage: 2,
    stageName: STAGE_NAMES[2],
    topic: 'Qiskit Syntax',
    question: 'Which Qiskit command applies a CNOT gate with qubit 0 as control and qubit 1 as target?',
    options: ['qc.cnot(0, 1)', 'qc.cx(0, 1)', 'qc.controlled_x(0, 1)', 'qc.cx(1, 0)'],
    correctIndex: 1,
    explanation: 'In Qiskit, qc.cx(control, target) is the standard method for CNOT.',
  },

  // Stage 3: Intermediate Understanding (Q11 - Q15)
  {
    id: 'fa_11',
    stage: 3,
    stageName: STAGE_NAMES[3],
    topic: 'Quantum Interference',
    question: 'Starting from |0⟩, what state is produced by applying H, followed by Z, followed by H (H · Z · H)?',
    options: ['|0⟩', '|1⟩', '(|0⟩ + |1⟩)/√2', '-|0⟩'],
    correctIndex: 1,
    explanation: 'H|0⟩ = |+⟩. Z|+⟩ = |−⟩. H|−⟩ = |1⟩. Constructive interference on |1⟩ and destructive on |0⟩.',
  },
  {
    id: 'fa_12',
    stage: 3,
    stageName: STAGE_NAMES[3],
    topic: 'Bell State Synthesis',
    question: 'Which sequence of gates applied to initial state |00⟩ prepares the Bell state |Φ⁺⟩ = (|00⟩ + |11⟩)/√2?',
    options: [
      'X on q0, then CX(0, 1)',
      'H on q0, then CX(0, 1)',
      'H on q0, H on q1',
      'CZ(0, 1), then H on q1',
    ],
    correctIndex: 1,
    explanation: 'H on q0 creates (|0⟩+|1⟩)|0⟩/√2, and CX(0, 1) flips the second qubit whenever the first is 1, creating (|00⟩+|11⟩)/√2.',
  },
  {
    id: 'fa_13',
    stage: 3,
    stageName: STAGE_NAMES[3],
    topic: 'T Gate Properties',
    question: 'What is the relationship between the T gate and the S gate?',
    options: ['T · T = S', 'S · S = T', 'T · S = Identity', 'T = S†'],
    correctIndex: 0,
    explanation: 'The T gate matrix has diagonal entry e^(iπ/4). (e^(iπ/4))² = e^(iπ/2) = i, so T² = S.',
  },
  {
    id: 'fa_14',
    stage: 3,
    stageName: STAGE_NAMES[3],
    topic: 'SWAP Gate',
    question: 'How many CNOT gates are required to construct a SWAP gate between two qubits?',
    options: ['1', '2', '3 alternating CNOT gates', '4'],
    correctIndex: 2,
    explanation: 'SWAP(a, b) = CX(a, b) · CX(b, a) · CX(a, b).',
  },
  {
    id: 'fa_15',
    stage: 3,
    stageName: STAGE_NAMES[3],
    topic: 'Bloch Sphere',
    question: 'Which state vector corresponds to the point (x=0, y=1, z=0) on the equator of the Bloch sphere?',
    options: ['|0⟩', '|+⟩ = (|0⟩ + |1⟩)/√2', '|i+⟩ = (|0⟩ + i|1⟩)/√2', '|−⟩ = (|0⟩ − |1⟩)/√2'],
    correctIndex: 2,
    explanation: 'Point (0, 1, 0) corresponds to polar angle θ = π/2 and azimuthal angle φ = π/2, which is (|0⟩ + i|1⟩)/√2.',
  },

  // Stage 4: Advanced Applications (Q16 - Q20)
  {
    id: 'fa_16',
    stage: 4,
    stageName: STAGE_NAMES[4],
    topic: 'Phase Kickback',
    question: 'In a CNOT gate, if the target qubit is in the state |−⟩ = (|0⟩ − |1⟩)/√2, what happens to the control qubit?',
    options: [
      'Nothing happens to the control qubit',
      'The control qubit flips from |0⟩ to |1⟩',
      'A relative phase of -1 is kicked back to the control qubit state |1⟩ component',
      'The target collapses to |0⟩',
    ],
    correctIndex: 2,
    explanation: 'Because X|−⟩ = -|−⟩, the eigenvalue -1 is transferred to the control qubit through phase kickback.',
  },
  {
    id: 'fa_17',
    stage: 4,
    stageName: STAGE_NAMES[4],
    topic: 'Rotation Gates',
    question: 'What is the action of the rotation gate RY(π) on basis state |0⟩?',
    options: ['|0⟩', '|1⟩', '-i|1⟩', '(|0⟩ + |1⟩)/√2'],
    correctIndex: 1,
    explanation: 'RY(π)|0⟩ = cos(π/2)|0⟩ + sin(π/2)|1⟩ = |1⟩.',
  },
  {
    id: 'fa_18',
    stage: 4,
    stageName: STAGE_NAMES[4],
    topic: 'Toffoli Decomposition',
    question: 'Why can the 3-qubit Toffoli (CCX) gate not be implemented with Clifford gates alone?',
    options: [
      'It has 3 qubits',
      'It is a non-Clifford gate that requires non-Clifford elements like the T gate for decomposition',
      'It is not unitary',
      'It requires measurement',
    ],
    correctIndex: 1,
    explanation: 'By the Gottesman-Knill theorem, Clifford gates alone can be simulated efficiently classically; Toffoli is outside Clifford.',
  },
  {
    id: 'fa_19',
    stage: 4,
    stageName: STAGE_NAMES[4],
    topic: 'Entanglement Verification',
    question: 'If you measure Qubit 0 of the Bell state |Ψ⁺⟩ = (|01⟩ + |10⟩)/√2 and observe outcome 0, what is the state of Qubit 1?',
    options: ['|0⟩', '|1⟩', 'Superposition', 'Unknown until measured'],
    correctIndex: 1,
    explanation: 'Looking at basis states in |Ψ⁺⟩, when Qubit 0 is 0, the only matching term is |10⟩, so Qubit 1 must be |1⟩.',
  },
  {
    id: 'fa_20',
    stage: 4,
    stageName: STAGE_NAMES[4],
    topic: 'Universal Sets',
    question: 'According to the Solovay-Kitaev theorem, which gate set provides universal fault-tolerant quantum computation?',
    options: [
      '{X, Y, Z}',
      '{H, S, CNOT, T}',
      '{H, CX}',
      '{I, SWAP}',
    ],
    correctIndex: 1,
    explanation: 'The Clifford group (generated by H, S, CNOT) combined with the non-Clifford T gate forms a universal gate set.',
  },

  // Stage 5: Challenging Problem-Solving (Q21 - Q25)
  {
    id: 'fa_21',
    stage: 5,
    stageName: STAGE_NAMES[5],
    topic: 'Circuit Equivalence',
    question: 'What single gate is equivalent to the sandwich operation (H · Z · H)?',
    options: ['Pauli-Y', 'Pauli-X', 'Phase S', 'Identity I'],
    correctIndex: 1,
    explanation: 'HZH = X because H rotates the Z-axis into the X-axis.',
  },
  {
    id: 'fa_22',
    stage: 5,
    stageName: STAGE_NAMES[5],
    topic: 'Symmetric CZ',
    question: 'Which of the following identities correctly expresses the Controlled-Z (CZ) gate in terms of CNOT and single-qubit gates?',
    options: [
      'CZ = CX',
      'CZ = (I ⊗ H) · CX · (I ⊗ H)',
      'CZ = (H ⊗ I) · CX · (H ⊗ I)',
      'CZ = (X ⊗ X) · CX',
    ],
    correctIndex: 1,
    explanation: 'Surrounding the target of a CNOT with Hadamard gates converts the target X operation into a Z operation: CZ = (I ⊗ H) CX (I ⊗ H).',
  },
  {
    id: 'fa_23',
    stage: 5,
    stageName: STAGE_NAMES[5],
    topic: 'Spinor Symmetry',
    question: 'When a qubit is rotated by 2π (360°) around any axis using continuous rotation gates R_n(2π), what happens to its wavefunction?',
    options: [
      'It remains +|ψ⟩',
      'It acquires a global minus sign: -|ψ⟩ (Berry / spinor phase)',
      'It collapses to the ground state',
      'Its probability is halved',
    ],
    correctIndex: 1,
    explanation: 'Fermionic spin-1/2 systems acquire a sign flip of -1 upon a 360° rotation: R_n(2π) = cos(π)I - i·sin(π)(n·σ) = -I.',
  },
  {
    id: 'fa_24',
    stage: 5,
    stageName: STAGE_NAMES[5],
    topic: 'Grover Diffusion',
    question: 'In Grover search algorithm on 2 qubits (N = 4), what is the exact probability of measuring the marked state after exactly ONE iteration?',
    options: ['25%', '50%', '75%', '100%'],
    correctIndex: 3,
    explanation: 'For N = 4, the rotation angle per Grover step is θ = 2 arcsin(1/2) = π/3, which rotates the initial angle π/6 directly to π/2, yielding 100% probability.',
  },
  {
    id: 'fa_25',
    stage: 5,
    stageName: STAGE_NAMES[5],
    topic: 'No-Cloning Theorem',
    question: 'Why is an arbitrary unknown quantum state |ψ⟩ impossible to clone using unitary operations?',
    options: [
      'Because classical computers are too slow',
      'Because unitary operations are strictly linear, and cloning |ψ⟩|0⟩ → |ψ⟩|ψ⟩ is non-linear',
      'Because of thermal dissipation',
      'Because photons travel too fast',
    ],
    correctIndex: 1,
    explanation: 'Linearity of quantum mechanics requires U(a|0⟩ + b|1⟩)|0⟩ = a|00⟩ + b|11⟩, whereas a clone would require (a|0⟩ + b|1⟩)² = a²|00⟩ + ab|01⟩ + ab|10⟩ + b²|11⟩, which violates linearity unless a=0 or b=0.',
  },
];

// TOPIC TESTS AND GATE TESTS
export function getAssessmentTest(testType: 'full_assessment' | 'gate_test' | 'topic_test' | 'mixed_test'): AssessmentTest {
  switch (testType) {
    case 'full_assessment':
      return {
        id: 'full_assessment',
        title: 'Full Quantum Gates Comprehensive Assessment',
        description: 'Rigorous 25-question examination covering single-qubit, multi-qubit gates, matrices, probabilities, and algorithms.',
        category: 'full_assessment',
        timeLimitMinutes: 30,
        questions: FULL_ASSESSMENT_QUESTIONS,
      };

    case 'gate_test':
      return {
        id: 'gate_test',
        title: 'Quantum Gates In-Depth Exam',
        description: 'Comprehensive 25-question evaluation on matrices, eigenstates, and transformations of all fundamental quantum gates.',
        category: 'gate_test',
        timeLimitMinutes: 25,
        questions: FULL_ASSESSMENT_QUESTIONS.map((q, idx) => ({
          ...q,
          id: `gt_${idx + 1}`,
          topic: `Gate Logic & Algebra`,
        })),
      };

    case 'topic_test':
      return {
        id: 'topic_test',
        title: 'Superposition & Entanglement Specialization Test',
        description: 'Focuses on the core quantum physical mechanics: Bell states, interference, and measurements.',
        category: 'topic_test',
        timeLimitMinutes: 25,
        questions: FULL_ASSESSMENT_QUESTIONS.map((q, idx) => ({
          ...q,
          id: `tt_${idx + 1}`,
          topic: idx < 12 ? 'Superposition & Phase' : 'Entanglement & Multi-Qubit Systems',
        })),
      };

    case 'mixed_test':
    default:
      return {
        id: 'mixed_test',
        title: 'Mixed Quantum Computing General Assessment',
        description: 'Balanced 25-question assessment spanning quantum theory, Qiskit code, and practical problem-solving.',
        category: 'mixed_test',
        timeLimitMinutes: 30,
        questions: FULL_ASSESSMENT_QUESTIONS.map((q, idx) => ({
          ...q,
          id: `mt_${idx + 1}`,
        })),
      };
  }
}

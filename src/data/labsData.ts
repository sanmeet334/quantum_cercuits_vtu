import { CircuitModel } from '../quantum/types';

export interface LabQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface QuantumLab {
  id: string;
  title: string;
  order: number;
  estimatedMinutes: number;
  prerequisites: string[];
  objectives: string[];
  instructions: string[];
  hints: string[];
  initialCircuit: CircuitModel;
  expectedTheoreticalResult: {
    probabilities: Record<string, number>;
    description: string;
  };
  questions: LabQuestion[];
}

export const LABS_DATA: QuantumLab[] = [
  {
    id: 'lab-1',
    title: 'Lab 1: Your First Qubit',
    order: 1,
    estimatedMinutes: 8,
    prerequisites: ['Basic understanding of classical bits'],
    objectives: [
      'Initialize a single qubit in state |0⟩.',
      'Simulate the circuit and observe the theoretical state vector [1, 0]ᵀ.',
      'Run 1024 measurement shots to verify deterministic measurement of |0⟩.',
    ],
    instructions: [
      'Observe the preloaded 1-qubit circuit with an Identity (I) gate on wire 0.',
      'Click "Run Simulation" to calculate the state vector and measurement probabilities.',
      'Examine the single-qubit Bloch sphere showing the vector pointing straight up to the North Pole (z = +1).',
      'Answer the lab questions below to complete the laboratory.',
    ],
    hints: [
      'An unperturbed qubit initialized at |0⟩ has 100% probability of remaining in |0⟩.',
      'The Bloch coordinates for |0⟩ are (x=0, y=0, z=1).',
    ],
    initialCircuit: {
      id: 'circ_lab_1',
      name: 'Lab 1 Circuit',
      qubitsCount: 1,
      classicalBitsCount: 1,
      gates: [
        { id: 'g_0', type: 'I', target: 0, col: 0 },
        { id: 'g_1', type: 'MEASURE', target: 0, classicalBit: 0, col: 1 },
      ],
    },
    expectedTheoreticalResult: {
      probabilities: { '0': 1.0, '1': 0.0 },
      description: 'Qubit remains in basis state |0⟩ with P(|0⟩) = 1.0 and 1024 shots recorded for outcome 0.',
    },
    questions: [
      {
        id: 'q1_1',
        question: 'What is the theoretical probability of measuring outcome 1 on this circuit?',
        options: ['1.0 (100%)', '0.5 (50%)', '0.0 (0%)', 'Undefined'],
        correctIndex: 2,
        explanation: 'Because the qubit is in basis state |0⟩, the amplitude for |1⟩ is zero, yielding |0|² = 0.',
      },
      {
        id: 'q1_2',
        question: 'What do the Bloch coordinates (x=0, y=0, z=1) represent physically?',
        options: [
          'The state is pointing to the South Pole',
          'The state is in the ground state |0⟩ along the computational Z-axis',
          'The state is fully depolarized',
          'The state is entangled with another qubit',
        ],
        correctIndex: 1,
        explanation: 'The North Pole of the Bloch sphere (z = +1) corresponds to the computational ground state |0⟩.',
      },
    ],
  },
  {
    id: 'lab-2',
    title: 'Lab 2: Exploring the Pauli-X Gate',
    order: 2,
    estimatedMinutes: 10,
    prerequisites: ['Lab 1: Your First Qubit'],
    objectives: [
      'Apply the Pauli-X bit-flip gate to state |0⟩.',
      'Observe the transformation to state |1⟩ with state vector [0, 1]ᵀ.',
      'Verify that X² = I by applying two consecutive X gates.',
    ],
    instructions: [
      'Run the circuit with a single Pauli-X gate on wire 0.',
      'Check the Bloch sphere: notice the vector has rotated 180° down to the South Pole (z = -1).',
      'Add a second Pauli-X gate to wire 0 at column 1, and run again to confirm it returns to |0⟩.',
      'Answer the knowledge questions to earn completion credit.',
    ],
    hints: [
      'Pauli-X is the quantum equivalent of a classical NOT gate.',
      'Applying any unitary gate twice where U = U† returns the identity operator.',
    ],
    initialCircuit: {
      id: 'circ_lab_2',
      name: 'Lab 2 Circuit',
      qubitsCount: 1,
      classicalBitsCount: 1,
      gates: [
        { id: 'g_0', type: 'X', target: 0, col: 0 },
        { id: 'g_1', type: 'MEASURE', target: 0, classicalBit: 0, col: 1 },
      ],
    },
    expectedTheoreticalResult: {
      probabilities: { '0': 0.0, '1': 1.0 },
      description: 'The bit-flip gate inverts the ground state |0⟩ into excited state |1⟩ with P(|1⟩) = 1.0.',
    },
    questions: [
      {
        id: 'q2_1',
        question: 'What is the action of two consecutive Pauli-X gates on any state |ψ⟩?',
        options: [
          'It destroys the state vector',
          'It returns the initial state |ψ⟩ because X · X = Identity',
          'It introduces an imaginary phase of -i',
          'It puts the qubit in equal superposition',
        ],
        correctIndex: 1,
        explanation: 'X is its own inverse (Hermitian and unitary), so X² = I.',
      },
      {
        id: 'q2_2',
        question: 'On the Bloch sphere, the Pauli-X gate corresponds to a rotation of how many radians?',
        options: ['π/2 radians (90°)', 'π radians (180°) around the X-axis', '2π radians (360°)', '0 radians'],
        correctIndex: 1,
        explanation: 'Pauli gates correspond to π radian (180°) rotations about their respective Cartesian axes.',
      },
    ],
  },
  {
    id: 'lab-3',
    title: 'Lab 3: Creating Superposition with Hadamard',
    order: 3,
    estimatedMinutes: 12,
    prerequisites: ['Lab 1', 'Lab 2'],
    objectives: [
      'Apply a Hadamard (H) gate to create an equal superposition: (|0⟩ + |1⟩)/√2.',
      'Observe the split 50/50 probability distribution.',
      'Observe the Bloch vector pointing along the positive X-axis on the equator.',
    ],
    instructions: [
      'Execute the circuit containing a single Hadamard gate on qubit 0.',
      'Inspect the state vector: both amplitudes equal 1/√2 ≈ 0.707.',
      'Inspect the measurement counts for 1024 shots: notice finite statistical fluctuation around 512 each.',
      'Answer the check questions to finalize.',
    ],
    hints: [
      'In state |+⟩, the qubit has no bias toward 0 or 1 until measured.',
      'The Born rule states P(0) = |1/√2|² = 1/2.',
    ],
    initialCircuit: {
      id: 'circ_lab_3',
      name: 'Lab 3 Circuit',
      qubitsCount: 1,
      classicalBitsCount: 1,
      gates: [
        { id: 'g_0', type: 'H', target: 0, col: 0 },
        { id: 'g_1', type: 'MEASURE', target: 0, classicalBit: 0, col: 1 },
      ],
    },
    expectedTheoreticalResult: {
      probabilities: { '0': 0.5, '1': 0.5 },
      description: 'Equal superposition state |+⟩ with 50% probability of 0 and 50% probability of 1.',
    },
    questions: [
      {
        id: 'q3_1',
        question: 'Why are measurement shot counts (e.g. 518 vs 506) not exactly 512 each on a 1024-shot run?',
        options: [
          'Because the simulator has a mathematical defect',
          'Because quantum measurement is a statistical Poisson process with finite sampling variance',
          'Because the computer clock was desynchronized',
          'Because the Hadamard gate has floating point rounding errors',
        ],
        correctIndex: 1,
        explanation: 'Sampling 1024 independent quantum events produces statistical variance around the true mean of 512.',
      },
    ],
  },
  {
    id: 'lab-4',
    title: 'Lab 4: Understanding Quantum Phase',
    order: 4,
    estimatedMinutes: 12,
    prerequisites: ['Lab 3: Superposition'],
    objectives: [
      'Apply the Phase gate S to rotate equatorial phase by +90°.',
      'Verify that phase rotation does not alter Z-basis measurement probabilities.',
      'Observe the Bloch vector rotating from the X-axis (|+⟩) to the Y-axis (|i+⟩).',
    ],
    instructions: [
      'Run the circuit with H followed by S on wire 0.',
      'Notice that the probabilities are still exactly 50% for |0⟩ and 50% for |1⟩!',
      'Look at the state vector: the amplitude for |1⟩ is now pure imaginary (i/√2 = 0 + 0.707i).',
      'Look at the Bloch coordinates: x = 0, y = 1, z = 0.',
    ],
    hints: [
      'Phase only affects relative angles in the XY plane; it leaves Z-basis probabilities invariant.',
    ],
    initialCircuit: {
      id: 'circ_lab_4',
      name: 'Lab 4 Circuit',
      qubitsCount: 1,
      classicalBitsCount: 1,
      gates: [
        { id: 'g_0', type: 'H', target: 0, col: 0 },
        { id: 'g_1', type: 'S', target: 0, col: 1 },
        { id: 'g_2', type: 'MEASURE', target: 0, classicalBit: 0, col: 2 },
      ],
    },
    expectedTheoreticalResult: {
      probabilities: { '0': 0.5, '1': 0.5 },
      description: 'Equal 50/50 measurement distribution with relative phase e^(iπ/2) = +i on state |1⟩.',
    },
    questions: [
      {
        id: 'q4_1',
        question: 'Does applying an S gate to a qubit in state |+⟩ change the probability of measuring 0 in the Z-basis?',
        options: [
          'Yes, it changes probability from 50% to 100%',
          'No, the measurement probability remains exactly 50%',
          'Yes, it drops probability to 0%',
          'It forces immediate decoherence',
        ],
        correctIndex: 1,
        explanation: 'Because |i|² = 1, the squared magnitude |i/√2|² remains 1/2.',
      },
    ],
  },
  {
    id: 'lab-5',
    title: 'Lab 5: Quantum Interference with H-H',
    order: 5,
    estimatedMinutes: 11,
    prerequisites: ['Lab 3', 'Lab 4'],
    objectives: [
      'Observe constructive interference restoring state |0⟩.',
      'Witness destructive interference canceling amplitude for |1⟩ to 0.',
      'Insert a Pauli-Z phase gate between Hadamards to turn constructive interference toward |1⟩.',
    ],
    instructions: [
      'Run the preloaded H-H circuit and observe that the final outcome is 100% |0⟩ with zero randomness.',
      'Now replace the second gate or insert a Z gate between them (H -> Z -> H).',
      'Observe how the relative phase flip redirects interference to produce 100% |1⟩!',
    ],
    hints: [
      'Constructive interference adds amplitudes with identical phases (+1/2 + 1/2 = 1).',
      'Destructive interference subtracts amplitudes (+1/2 - 1/2 = 0).',
    ],
    initialCircuit: {
      id: 'circ_lab_5',
      name: 'Lab 5 Circuit',
      qubitsCount: 1,
      classicalBitsCount: 1,
      gates: [
        { id: 'g_0', type: 'H', target: 0, col: 0 },
        { id: 'g_1', type: 'H', target: 0, col: 1 },
        { id: 'g_2', type: 'MEASURE', target: 0, classicalBit: 0, col: 2 },
      ],
    },
    expectedTheoreticalResult: {
      probabilities: { '0': 1.0, '1': 0.0 },
      description: 'H followed by H restores initial state |0⟩ deterministically via destructive cancellation of |1⟩.',
    },
    questions: [
      {
        id: 'q5_1',
        question: 'What is the amplitude of state |1⟩ immediately before measurement in the H-H circuit?',
        options: ['1/√2', '1/2', '0', '-1'],
        correctIndex: 2,
        explanation: 'The amplitude is (1/√2)(1/√2) + (1/√2)(-1/√2) = 1/2 - 1/2 = 0.',
      },
    ],
  },
  {
    id: 'lab-6',
    title: 'Lab 6: Building a Bell State',
    order: 6,
    estimatedMinutes: 15,
    prerequisites: ['Lab 3: Superposition'],
    objectives: [
      'Construct the maximally entangled Bell state |Φ⁺⟩ = (|00⟩ + |11⟩)/√2.',
      'Observe 100% correlated measurement outcomes: only 00 and 11 ever appear.',
      'Verify that cross-terms |01⟩ and |10⟩ have 0% probability.',
    ],
    instructions: [
      'Run the circuit with H on q[0] and CNOT controlled by q[0] onto q[1].',
      'Observe the probability bar chart: 50% for 00 and 50% for 11.',
      'Check the 1024 shot histogram: outcomes 01 and 10 will receive exactly 0 shots!',
      'Complete the correlation questions below.',
    ],
    hints: [
      'H on q[0] creates (|0⟩+|1⟩)|0⟩ = (|00⟩+|10⟩)/√2.',
      'CNOT with q[0] control and q[1] target maps |10⟩ to |11⟩.',
    ],
    initialCircuit: {
      id: 'circ_lab_6',
      name: 'Lab 6 Circuit',
      qubitsCount: 2,
      classicalBitsCount: 2,
      gates: [
        { id: 'g_0', type: 'H', target: 0, col: 0 },
        { id: 'g_1', type: 'CX', control: 0, target: 1, col: 1 },
        { id: 'g_2', type: 'MEASURE', target: 0, classicalBit: 0, col: 2 },
        { id: 'g_3', type: 'MEASURE', target: 1, classicalBit: 1, col: 2 },
      ],
    },
    expectedTheoreticalResult: {
      probabilities: { '00': 0.5, '01': 0.0, '10': 0.0, '11': 0.5 },
      description: 'Maximally entangled Bell state with 50% |00⟩ and 50% |11⟩.',
    },
    questions: [
      {
        id: 'q6_1',
        question: 'If you measure Qubit 0 and observe outcome 1, what is the probability that Qubit 1 is also 1 upon immediate measurement?',
        options: ['50%', '100%', '0%', '25%'],
        correctIndex: 1,
        explanation: 'Because the state is (|00⟩ + |11⟩)/√2, observing 1 on Qubit 0 collapses the system into |11⟩, ensuring Qubit 1 is 1 with 100% certainty.',
      },
    ],
  },
  {
    id: 'lab-7',
    title: 'Lab 7: Exploring CNOT and Conditional Logic',
    order: 7,
    estimatedMinutes: 12,
    prerequisites: ['Lab 2', 'Lab 6'],
    objectives: [
      'Verify the full 4-entry computational truth table for Controlled-NOT.',
      'Observe how changing initial states (00, 01, 10, 11) affects target outcome.',
      'Understand target inversion conditioned on control bit value.',
    ],
    instructions: [
      'In the preloaded circuit, an X gate initializes the control qubit to |1⟩.',
      'Run simulation: observe that the target qubit flips to |1⟩ (output |11⟩).',
      'Remove the X gate and run again: observe output is |00⟩.',
    ],
    hints: ['If control is 0, target is unchanged. If control is 1, target is inverted.'],
    initialCircuit: {
      id: 'circ_lab_7',
      name: 'Lab 7 Circuit',
      qubitsCount: 2,
      classicalBitsCount: 2,
      gates: [
        { id: 'g_0', type: 'X', target: 0, col: 0 },
        { id: 'g_1', type: 'CX', control: 0, target: 1, col: 1 },
        { id: 'g_2', type: 'MEASURE', target: 0, classicalBit: 0, col: 2 },
        { id: 'g_3', type: 'MEASURE', target: 1, classicalBit: 1, col: 2 },
      ],
    },
    expectedTheoreticalResult: {
      probabilities: { '00': 0.0, '01': 0.0, '10': 0.0, '11': 1.0 },
      description: 'Control qubit 0 is initialized to 1, triggering CNOT to flip target qubit 1 to 1.',
    },
    questions: [
      {
        id: 'q7_1',
        question: 'What is the output state if input is |10⟩ with control q[0]=0 and target q[1]=1?',
        options: ['|10⟩ (unchanged)', '|11⟩', '|00⟩', '|01⟩'],
        correctIndex: 0,
        explanation: 'Since control qubit 0 is 0, target qubit 1 remains unchanged in state 1.',
      },
    ],
  },
  {
    id: 'lab-8',
    title: 'Lab 8: Quantum Measurement & Projection',
    order: 8,
    estimatedMinutes: 10,
    prerequisites: ['Lab 3'],
    objectives: [
      'Understand projective measurement in the computational Z-basis.',
      'Observe wavefunction collapse in repeated multi-shot trials.',
      'Compare theoretical probability distributions with experimental histograms.',
    ],
    instructions: [
      'Run simulation with 100, 1024, and 4096 shots.',
      'Notice how increasing the number of shots converges closer to theoretical 50% probabilities.',
      'Answer the questions to verify statistical understanding.',
    ],
    hints: ['The law of large numbers guarantees convergence as shot count increases.'],
    initialCircuit: {
      id: 'circ_lab_8',
      name: 'Lab 8 Circuit',
      qubitsCount: 1,
      classicalBitsCount: 1,
      gates: [
        { id: 'g_0', type: 'H', target: 0, col: 0 },
        { id: 'g_1', type: 'MEASURE', target: 0, classicalBit: 0, col: 1 },
      ],
    },
    expectedTheoreticalResult: {
      probabilities: { '0': 0.5, '1': 0.5 },
      description: 'Measurement projects superposition into discrete bits with 0.5 probability.',
    },
    questions: [
      {
        id: 'q8_1',
        question: 'Does performing a quantum measurement reveal the complete phase information of the qubit?',
        options: [
          'Yes, it outputs all complex numbers',
          'No, measurement only outputs a classical bit (0 or 1) and destroys the superposition phase',
          'Only if using a superconducting chip',
          'Yes, if measured twice in a row',
        ],
        correctIndex: 1,
        explanation: 'Measurement only reveals one classical bit; the relative phase is lost upon projection.',
      },
    ],
  },
  {
    id: 'lab-9',
    title: 'Lab 9: Quantum Teleportation',
    order: 9,
    estimatedMinutes: 18,
    prerequisites: ['Lab 6: Bell State', 'Lab 7: CNOT'],
    objectives: [
      'Assemble the 3-qubit quantum teleportation protocol.',
      'Create shared entanglement between Alice (q1) and Bob (q2).',
      'Perform Bell measurement on Alice qubits (q0 and q1).',
      'Verify state transfer to Bob.',
    ],
    instructions: [
      'Inspect the 3-qubit circuit: q[0] is Alice secret state (prepared with H), q[1] and q[2] form the Bell pair.',
      'Alice performs CNOT(0, 1) followed by H on q[0].',
      'Run simulation and observe the joint measurement distributions.',
    ],
    hints: ['Teleportation transfers quantum state information without moving the physical particle.'],
    initialCircuit: {
      id: 'circ_lab_9',
      name: 'Lab 9 Circuit',
      qubitsCount: 3,
      classicalBitsCount: 3,
      gates: [
        { id: 'g_0', type: 'H', target: 0, col: 0 },
        { id: 'g_1', type: 'H', target: 1, col: 0 },
        { id: 'g_2', type: 'CX', control: 1, target: 2, col: 1 },
        { id: 'g_3', type: 'CX', control: 0, target: 1, col: 2 },
        { id: 'g_4', type: 'H', target: 0, col: 3 },
        { id: 'g_5', type: 'MEASURE', target: 0, classicalBit: 0, col: 4 },
        { id: 'g_6', type: 'MEASURE', target: 1, classicalBit: 1, col: 4 },
      ],
    },
    expectedTheoreticalResult: {
      probabilities: { '000': 0.25, '001': 0.25, '010': 0.25, '011': 0.25 },
      description: 'Alice measurements yield 4 equally likely 2-bit messages requiring Bob Pauli corrections.',
    },
    questions: [
      {
        id: 'q9_1',
        question: 'Does quantum teleportation violate the No-Cloning Theorem?',
        options: [
          'Yes, it makes an exact copy',
          'No, because Alice original state is destroyed by her measurement during the protocol',
          'Only in imperfect simulations',
          'It clones the state temporarily',
        ],
        correctIndex: 1,
        explanation: 'The original state on qubit 0 is destroyed by Alice measurement, so only one copy ever exists.',
      },
    ],
  },
  {
    id: 'lab-10',
    title: 'Lab 10: Superdense Coding',
    order: 10,
    estimatedMinutes: 15,
    prerequisites: ['Lab 6: Bell State'],
    objectives: [
      'Transmit 2 classical bits by sending only 1 physical qubit.',
      'Apply Pauli operations to encode message "10" (Z gate).',
      'Execute Bell decoding measurement (CNOT then H) to reconstruct message.',
    ],
    instructions: [
      'The preloaded circuit creates a Bell state, then Alice applies Z to encode classical "10".',
      'Bob receives Alice qubit and executes the decoding circuit (CNOT followed by H).',
      'Run simulation: observe that the decoded classical outcome is 100% "10"!',
    ],
    hints: ['Bob decoding circuit is the exact inverse of Bell state preparation.'],
    initialCircuit: {
      id: 'circ_lab_10',
      name: 'Lab 10 Circuit',
      qubitsCount: 2,
      classicalBitsCount: 2,
      gates: [
        { id: 'g_0', type: 'H', target: 0, col: 0 },
        { id: 'g_1', type: 'CX', control: 0, target: 1, col: 1 },
        { id: 'g_2', type: 'Z', target: 0, col: 2 }, // Alice encodes message "10"
        { id: 'g_3', type: 'CX', control: 0, target: 1, col: 3 }, // Bob decodes
        { id: 'g_4', type: 'H', target: 0, col: 4 },
        { id: 'g_5', type: 'MEASURE', target: 0, classicalBit: 0, col: 5 },
        { id: 'g_6', type: 'MEASURE', target: 1, classicalBit: 1, col: 5 },
      ],
    },
    expectedTheoreticalResult: {
      probabilities: { '00': 0.0, '01': 0.0, '10': 0.0, '11': 0.0 }, // Note: in |q1 q0> notation with q0=0, q1=1 => state '01' or '10'
      description: 'Decodes Alice 2-bit message with 100% fidelity.',
    },
    questions: [
      {
        id: 'q10_1',
        question: 'Which gate would Alice apply to encode message "01" (bit flip)?',
        options: ['Identity (I)', 'Pauli-X', 'Pauli-Z', 'Hadamard (H)'],
        correctIndex: 1,
        explanation: 'Pauli-X flips the bit from |00⟩+|11⟩ into |01⟩+|10⟩ = |Ψ⁺⟩.',
      },
    ],
  },
  {
    id: 'lab-11',
    title: "Lab 11: Introduction to Grover's Search",
    order: 11,
    estimatedMinutes: 18,
    prerequisites: ['Lab 3', 'Lab 5', 'Lab 7'],
    objectives: [
      'Construct a 2-qubit search space of N = 4 items.',
      'Implement a phase oracle marking state |11⟩ using Controlled-Z.',
      'Apply the Grover diffusion operator to amplify marked state probability to 100%.',
    ],
    instructions: [
      'Observe the preloaded Grover circuit: Hadamards create uniform superposition of 4 items.',
      'CZ acts as the phase oracle marking item |11⟩ with a -1 phase factor.',
      'The subsequent H-X-CZ-X-H sequence is the diffusion reflection about the mean.',
      'Run simulation: observe that state |11⟩ is amplified to 100% probability in just 1 iteration!',
    ],
    hints: ['For N = 4 items, exactly one Grover iteration achieves 100% theoretical probability.'],
    initialCircuit: {
      id: 'circ_lab_11',
      name: 'Lab 11 Circuit',
      qubitsCount: 2,
      classicalBitsCount: 2,
      gates: [
        // Uniform superposition
        { id: 'g_0', type: 'H', target: 0, col: 0 },
        { id: 'g_1', type: 'H', target: 1, col: 0 },
        // Phase oracle marking |11>
        { id: 'g_2', type: 'CZ', control: 0, target: 1, col: 1 },
        // Diffusion operator
        { id: 'g_3', type: 'H', target: 0, col: 2 },
        { id: 'g_4', type: 'H', target: 1, col: 2 },
        { id: 'g_5', type: 'X', target: 0, col: 3 },
        { id: 'g_6', type: 'X', target: 1, col: 3 },
        { id: 'g_7', type: 'CZ', control: 0, target: 1, col: 4 },
        { id: 'g_8', type: 'X', target: 0, col: 5 },
        { id: 'g_9', type: 'X', target: 1, col: 5 },
        { id: 'g_10', type: 'H', target: 0, col: 6 },
        { id: 'g_11', type: 'H', target: 1, col: 6 },
        { id: 'g_12', type: 'MEASURE', target: 0, classicalBit: 0, col: 7 },
        { id: 'g_13', type: 'MEASURE', target: 1, classicalBit: 1, col: 7 },
      ],
    },
    expectedTheoreticalResult: {
      probabilities: { '00': 0.0, '01': 0.0, '10': 0.0, '11': 1.0 },
      description: 'Single Grover iteration amplifies marked state |11⟩ from 25% to 100% probability.',
    },
    questions: [
      {
        id: 'q11_1',
        question: 'What is the role of the diffusion operator in Grover search?',
        options: [
          'It adds random noise to the qubits',
          'It inverts/reflects amplitudes about their average mean, amplifying the marked negative amplitude',
          'It measures the quantum state',
          'It resets qubits to zero',
        ],
        correctIndex: 1,
        explanation: 'The diffusion operator reflects all amplitudes about their mean, boosting the marked state while suppressing others.',
      },
    ],
  },
  {
    id: 'lab-12',
    title: 'Lab 12: Introduction to Quantum Fourier Transform',
    order: 12,
    estimatedMinutes: 20,
    prerequisites: ['Lab 4: Phase', 'Lab 7: Controlled operations'],
    objectives: [
      'Construct a 2-qubit Quantum Fourier Transform circuit.',
      'Apply Hadamard followed by Controlled-Phase (CP) gate.',
      'Observe the transformation of computational basis states into periodic phase states.',
    ],
    instructions: [
      'Run the 2-qubit QFT circuit initialized with state |01⟩ (X on q[0]).',
      'Observe that all 4 computational basis outcomes have equal 25% probability magnitudes.',
      'Check the complex amplitudes: each basis state has a distinct phase angle incremented by π/2.',
    ],
    hints: ['QFT transforms basis states into uniform superpositions with linearly advancing phases.'],
    initialCircuit: {
      id: 'circ_lab_12',
      name: 'Lab 12 Circuit',
      qubitsCount: 2,
      classicalBitsCount: 2,
      gates: [
        { id: 'g_0', type: 'X', target: 0, col: 0 },
        { id: 'g_1', type: 'H', target: 1, col: 1 },
        { id: 'g_2', type: 'CP', control: 0, target: 1, params: { theta: Math.PI / 2 }, col: 2 },
        { id: 'g_3', type: 'H', target: 0, col: 3 },
        { id: 'g_4', type: 'SWAP', target: 0, target2: 1, col: 4 },
        { id: 'g_5', type: 'MEASURE', target: 0, classicalBit: 0, col: 5 },
        { id: 'g_6', type: 'MEASURE', target: 1, classicalBit: 1, col: 5 },
      ],
    },
    expectedTheoreticalResult: {
      probabilities: { '00': 0.25, '01': 0.25, '10': 0.25, '11': 0.25 },
      description: 'Equal magnitude distribution (0.25 each) with linear phase gradients in Hilbert space.',
    },
    questions: [
      {
        id: 'q12_1',
        question: 'Why does the QFT end with a SWAP gate between opposite qubits?',
        options: [
          'Because the natural recursive formulation of QFT outputs qubits in reversed bit order',
          'To increase circuit depth',
          'To cancel out noise',
          'To reset classical registers',
        ],
        correctIndex: 0,
        explanation: 'The mathematical tensor product of QFT outputs bits in reversed significance order, requiring SWAP gates to restore standard order.',
      },
    ],
  },
];

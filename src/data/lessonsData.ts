import { GateType } from '../quantum/types';

export interface Lesson {
  id: string;
  title: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  estimatedMinutes: number;
  objectives: string[];
  summary: string;
  content: string;
  interactiveExperiment: {
    title: string;
    description: string;
    suggestedGates: GateType[];
    expectedState: string;
    instructions: string;
  };
  knowledgeCheck: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  };
  relatedGates: GateType[];
  relatedLabId?: string;
}

export const LESSONS_DATA: Lesson[] = [
  // --- BEGINNER ---
  {
    id: 'lesson-1',
    title: 'Classical Bits versus Qubits',
    level: 'beginner',
    estimatedMinutes: 8,
    objectives: [
      'Contrast binary classical bits (0 or 1) with quantum qubits.',
      'Understand how qubits access infinite continuous state vectors in 2D Hilbert space.',
      'Explore why N qubits represent 2^N simultaneous basis amplitudes.',
    ],
    summary: 'Discover how qubits depart from classical digital logic by embodying superpositions of 0 and 1 until measured.',
    content: `
### The Classical Bit
In classical computing, the fundamental unit of information is the **bit**. A bit is physically implemented using microscopic transistors, charge levels in capacitors, or magnetic polarities. A classical bit can only ever exist in one of two mutually exclusive states:
- **0** (low voltage / off)
- **1** (high voltage / on)

Every classical program, algorithm, and memory register is composed of sequences of these binary digits.

### The Quantum Bit (Qubit)
A **qubit** (quantum bit) is the quantum mechanical counterpart of the classical bit. It is realized using two-level quantum systems such as the spin of an electron, the polarization of a photon, or the energy levels of an artificial superconducting atom (transmon).

Unlike a classical bit, a qubit can exist not only in the discrete basis states $|0\\rangle$ or $|1\\rangle$, but also in a continuous linear combination called a **superposition**:

$$|\\psi\\rangle = \\alpha |0\\rangle + \\beta |1\\rangle$$

Where $\\alpha$ and $\\beta$ are complex numbers called **probability amplitudes**.

### Exponential Information Capacity
While $N$ classical bits can store only one specific $N$-bit number at any instant (e.g., $101001$), $N$ entangled qubits exist across all $2^N$ possible configurations simultaneously. For example, 50 qubits describe over 1 quadrillion ($10^{15}$) basis states at once!
`,
    interactiveExperiment: {
      title: 'Observe a Single Qubit in State |0⟩',
      description: 'Run the simulator on an unperturbed qubit to observe its ground state amplitudes.',
      suggestedGates: ['I'],
      expectedState: '100% |0⟩',
      instructions: 'Place an Identity gate on qubit 0 and verify the measurement probability P(|0⟩) = 1.0.',
    },
    knowledgeCheck: {
      question: 'What is the mathematical condition that probability amplitudes α and β must satisfy for a valid normalized qubit?',
      options: [
        'α + β = 1',
        '|α|² + |β|² = 1',
        'α · β = 0',
        '|α| + |β| = 1',
      ],
      correctIndex: 1,
      explanation: 'According to the Born rule, the total probability across all measurement outcomes must equal 1, which requires |α|² + |β|² = 1.',
    },
    relatedGates: ['I', 'X'],
    relatedLabId: 'lab-1',
  },
  {
    id: 'lesson-2',
    title: 'What is Quantum Computing?',
    level: 'beginner',
    estimatedMinutes: 10,
    objectives: [
      'Define quantum computing and its underlying physical principles.',
      'Differentiate between classical computers and quantum processors.',
      'Identify the physical hardware platforms used to build quantum processors.',
    ],
    summary: 'An architectural introduction to quantum computing, hardware types, and quantum advantage.',
    content: `
### Beyond Moore's Law
Quantum computing is not simply a faster version of classical computing; it is a fundamentally different paradigm of computation based on quantum mechanics.

Classical algorithms evaluate problems through deterministic Boolean logic gates (AND, OR, NOT). Quantum computers use the laws of quantum mechanics—principally **superposition**, **interference**, and **entanglement**—to navigate complex computational spaces efficiently.

### Physical Architectures
Several competing technologies are used to build physical qubits today:
1. **Superconducting Circuits**: Artificial atoms made of Josephson junctions cooled in dilution refrigerators to 15 millikelvin (-273.13°C) (e.g., IBM, Google).
2. **Trapped Ion Systems**: Individual ionized atoms suspended in electromagnetic vacuum traps and addressed by ultraviolet lasers (e.g., IonQ, Quantinuum).
3. **Photonic Qubits**: Qubits encoded in the polarization or spatial path of single photons at room temperature (e.g., Xanadu, PsiQuantum).
4. **Neutral Atoms**: Arrays of neutral atoms trapped by optical tweezers (e.g., QuEra).
`,
    interactiveExperiment: {
      title: 'Bit Flip Execution',
      description: 'Apply a Pauli-X gate to change the state from ground state |0⟩ to excited state |1⟩.',
      suggestedGates: ['X'],
      expectedState: '100% |1⟩',
      instructions: 'Insert a Pauli-X gate on wire 0 and simulate the circuit.',
    },
    knowledgeCheck: {
      question: 'Which quantum mechanical phenomenon allows quantum algorithms to cancel incorrect answers while reinforcing correct answers?',
      options: [
        'Radioactive decay',
        'Quantum interference',
        'Thermal dissipation',
        'Gravitational lensing',
      ],
      correctIndex: 1,
      explanation: 'Quantum interference allows probability amplitudes with opposite phases to destructively interfere (cancel out) while desired computational paths constructively interfere.',
    },
    relatedGates: ['X', 'H'],
    relatedLabId: 'lab-2',
  },
  {
    id: 'lesson-3',
    title: 'Introduction to Quantum States',
    level: 'beginner',
    estimatedMinutes: 9,
    objectives: [
      'Learn Dirac bra-ket notation |ψ⟩.',
      'Understand the state vector representation in complex 2-dimensional space.',
      'Visualize pure single-qubit states on the Bloch sphere.',
    ],
    summary: 'Master Dirac notation and understand how quantum states live as unit vectors on the surface of the Bloch sphere.',
    content: `
### Dirac Bra-Ket Notation
In quantum mechanics, state vectors are denoted by a **ket**: $|\\psi\\rangle$.
The dual conjugate vector is called a **bra**: $\\langle \\psi |$.
The inner product (scalar product) between two states is written as $\\langle \\phi | \\psi \\rangle$.

### The Bloch Sphere Representation
Any pure single-qubit state $|\\psi\\rangle$ can be parameterized by two real angles, polar angle $\\theta \\in [0, \\pi]$ and azimuthal angle $\\phi \\in [0, 2\\pi)$:

$$|\\psi\\rangle = \\cos\\left(\\frac{\\theta}{2}\\right)|0\\rangle + e^{i\\phi}\\sin\\left(\\frac{\\theta}{2}\\right)|1\\rangle$$

This corresponds to a point on the surface of a unit sphere called the **Bloch Sphere**:
- **North Pole** ($\\theta = 0$): Basis state $|0\\rangle$.
- **South Pole** ($\\theta = \\pi$): Basis state $|1\\rangle$.
- **Equator** ($\\theta = \\pi/2$): Superposition states such as $|+\\rangle$ and $|i\\rangle$.
`,
    interactiveExperiment: {
      title: 'Move State to Bloch Equator',
      description: 'Apply a Hadamard gate to rotate the state vector from the North Pole to the positive X-axis on the equator.',
      suggestedGates: ['H'],
      expectedState: 'State |+⟩ on Bloch equator',
      instructions: 'Add gate H to wire 0 and inspect the Bloch Sphere coordinates (x=1, y=0, z=0).',
    },
    knowledgeCheck: {
      question: 'Where is the computational basis state |0⟩ located on the standard Bloch sphere?',
      options: [
        'At the South Pole (z = -1)',
        'At the North Pole (z = +1)',
        'On the positive Y-axis',
        'At the center origin (0, 0, 0)',
      ],
      correctIndex: 1,
      explanation: 'State |0⟩ corresponds to polar angle θ = 0, which sits at the North Pole (z = +1) of the Bloch sphere.',
    },
    relatedGates: ['H', 'Z', 'X'],
    relatedLabId: 'lab-3',
  },
  {
    id: 'lesson-4',
    title: 'Computational Basis States |0⟩ and |1⟩',
    level: 'beginner',
    estimatedMinutes: 8,
    objectives: [
      'Define the orthonormal computational basis {|0⟩, |1⟩}.',
      'Understand column vector representations [1, 0]ᵀ and [0, 1]ᵀ.',
      'Verify orthogonality: ⟨0|1⟩ = 0 and normalization: ⟨0|0⟩ = 1.',
    ],
    summary: 'The reference basis against which quantum measurements and computational outputs are defined.',
    content: `
### Basis Vectors in Hilbert Space
The standard computational basis consists of two orthonormal column vectors:

$$|0\\rangle = \\begin{bmatrix} 1 \\\\ 0 \\end{bmatrix}, \\quad |1\\rangle = \\begin{bmatrix} 0 \\\\ 1 \\end{bmatrix}$$

These two vectors form a complete basis for the 2-dimensional complex vector space $\\mathbb{C}^2$. Any arbitrary single-qubit state can be expanded uniquely as:

$$|\\psi\\rangle = \\alpha |0\\rangle + \\beta |1\\rangle = \\begin{bmatrix} \\alpha \\\\ \\beta \\end{bmatrix}$$

### Orthonormality
The basis states are:
1. **Normalized**: $\\langle 0|0\\rangle = 1$ and $\\langle 1|1\\rangle = 1$.
2. **Orthogonal**: $\\langle 0|1\\rangle = 0$.

Because they are mutually orthogonal, a measurement in the computational Z-basis can distinguish between $|0\\rangle$ and $|1\\rangle$ with 100% certainty.
`,
    interactiveExperiment: {
      title: 'State Orthogonality Verification',
      description: 'Test that |0⟩ and |1⟩ produce completely disjoint measurement outcomes.',
      suggestedGates: ['X'],
      expectedState: 'Complete inversion from 0 to 1',
      instructions: 'Compare the simulation of wire without gate (|0⟩) versus with X gate (|1⟩).',
    },
    knowledgeCheck: {
      question: 'What is the inner product ⟨0|1⟩ of the two computational basis states?',
      options: ['1', '0', '-1', '1/√2'],
      correctIndex: 1,
      explanation: 'Because |0⟩ and |1⟩ are orthogonal basis states, their inner product is ⟨0|1⟩ = [1, 0] · [0, 1]ᵀ = 0.',
    },
    relatedGates: ['I', 'X'],
    relatedLabId: 'lab-2',
  },
  {
    id: 'lesson-5',
    title: 'Quantum Superposition',
    level: 'beginner',
    estimatedMinutes: 11,
    objectives: [
      'Formulate the principle of quantum superposition.',
      'Distinguish between probabilistic classical uncertainty and coherent quantum superposition.',
      'Analyze the standard superposition states |+⟩ and |−⟩.',
    ],
    summary: 'Understand the physical reality of superposition and how it differs from a hidden classical coin flip.',
    content: `
### What is Superposition?
A common misconception is that a qubit in superposition is "secretly either 0 or 1, and we just do not know yet." That is classical probability!

In quantum mechanics, before measurement, a qubit does not have a definite value of 0 or 1. Instead, it occupies a genuine physical state that is a linear combination of both.

### The Hadamard Superposition States
When the Hadamard gate acts on basis states, it produces:

$$|+\\rangle = H|0\\rangle = \\frac{|0\\rangle + |1\\rangle}{\\sqrt{2}}$$
$$|-\\rangle = H|1\\rangle = \\frac{|0\\rangle - |1\\rangle}{\\sqrt{2}}$$

Both states yield exactly 50% probability of measuring $|0\\rangle$ and 50% probability of measuring $|1\\rangle$. However, $|+\\rangle$ and $|-\\rangle$ are completely distinct orthogonal physical states! Their difference lies in their **relative phase**.
`,
    interactiveExperiment: {
      title: 'Prepare the |+⟩ Superposition State',
      description: 'Apply the Hadamard gate to state |0⟩ and inspect the 50/50 probability distribution.',
      suggestedGates: ['H'],
      expectedState: 'P(|0⟩) = 0.5, P(|1⟩) = 0.5',
      instructions: 'Place H on wire 0 and verify the measurement probability histogram.',
    },
    knowledgeCheck: {
      question: 'If state |+⟩ is measured in the computational basis, what is the probability of obtaining outcome 0?',
      options: ['100%', '50%', '0%', '25%'],
      correctIndex: 1,
      explanation: 'The amplitude for |0⟩ in |+⟩ is 1/√2, so the measurement probability is |1/√2|² = 1/2 = 50%.',
    },
    relatedGates: ['H', 'Z'],
    relatedLabId: 'lab-3',
  },
  {
    id: 'lesson-6',
    title: 'Quantum Measurement',
    level: 'beginner',
    estimatedMinutes: 9,
    objectives: [
      'Understand the Born rule: P(k) = |α_k|².',
      'Explain wavefunction collapse (state reduction).',
      'Recognize that measurement is non-reversible and extracts only classical data.',
    ],
    summary: 'How observing a quantum system collapses superpositions into definitive classical outcomes.',
    content: `
### The Born Rule
In quantum mechanics, the probability of measuring outcome $|k\\rangle$ from state $|\\psi\\rangle = \\sum_k \\alpha_k |k\\rangle$ is given by the square of the magnitude of its complex amplitude:

$$P(k) = |\\alpha_k|^2 = \\alpha_k^* \\alpha_k$$

Because probabilities must sum to 1, we require:

$$\\sum_k |\\alpha_k|^2 = 1$$

### Wavefunction Collapse
Before measurement, a qubit may evolve deterministically through reversible unitary gates. However, the moment a measurement is performed:
1. The continuous superposition is destroyed.
2. The qubit collapses irreversibly into the observed eigenstate.
3. Subsequent immediate measurements on that qubit will return the exact same outcome with 100% certainty.
`,
    interactiveExperiment: {
      title: 'Simulate Repeated Measurements',
      description: 'Execute 1024 shots on a superposition state to witness finite statistical sampling.',
      suggestedGates: ['H', 'MEASURE'],
      expectedState: 'Approximately ~512 shots |0⟩ and ~512 shots |1⟩',
      instructions: 'Add H and Measure to wire 0, then run 1024 shots in the simulator.',
    },
    knowledgeCheck: {
      question: 'If a qubit has amplitude α = 1/2 for |0⟩ and β = √3/2 for |1⟩, what is the probability of measuring |1⟩?',
      options: ['1/2 (50%)', '3/4 (75%)', '√3/2 (~86.6%)', '1/4 (25%)'],
      correctIndex: 1,
      explanation: 'P(|1⟩) = |β|² = (√3/2)² = 3/4 = 75%.',
    },
    relatedGates: ['MEASURE', 'H'],
    relatedLabId: 'lab-8',
  },
  {
    id: 'lesson-7',
    title: 'Introduction to Quantum Gates',
    level: 'beginner',
    estimatedMinutes: 10,
    objectives: [
      'Understand quantum gates as unitary matrix operators.',
      'Learn why all quantum operations (except measurement) are reversible.',
      'Understand circuit timelines reading from left to right.',
    ],
    summary: 'The building blocks of quantum circuits: unitary operations that rotate quantum state vectors.',
    content: `
### Gates as Unitary Operators
In classical computing, logic gates like AND are irreversible: given an output of 0, you cannot deduce whether the inputs were 00, 01, or 10.

In quantum computing, all gate operations (excluding measurement) must be **reversible**. Mathematically, any quantum gate is represented by a **unitary matrix** $U$, which satisfies:

$$U^\\dagger U = U U^\\dagger = I$$

Where $U^\\dagger$ is the conjugate transpose (adjoint) of $U$, and $I$ is the identity matrix.

### Reading Circuit Diagrams
Quantum circuits are drawn with horizontal lines representing qubit wires:
- Time flows from **left to right**.
- Qubits begin initialized in $|0\\rangle$.
- Box symbols denote single-qubit gates.
- Vertical lines with dots represent multi-qubit controlled gates.
`,
    interactiveExperiment: {
      title: 'Gate Reversibility Test',
      description: 'Verify that applying X twice returns the qubit to |0⟩.',
      suggestedGates: ['X', 'X'],
      expectedState: 'P(|0⟩) = 1.0',
      instructions: 'Place two consecutive X gates on wire 0 and simulate.',
    },
    knowledgeCheck: {
      question: 'What mathematical property ensures that quantum gate operations preserve the total probability of 1.0?',
      options: ['Hermitian symmetry', 'Unitary property (U†U = I)', 'Non-linear amplification', 'Commutativity'],
      correctIndex: 1,
      explanation: 'Unitary transformations preserve the norm (length) of vectors in Hilbert space, ensuring total probability remains 1.',
    },
    relatedGates: ['I', 'X', 'H'],
    relatedLabId: 'lab-2',
  },
  {
    id: 'lesson-8',
    title: 'Understanding Probability Amplitudes',
    level: 'beginner',
    estimatedMinutes: 9,
    objectives: [
      'Examine the complex nature of probability amplitudes: α = r · e^(iθ).',
      'Distinguish between magnitude |α| and phase angle θ.',
      'Understand how phase enables constructive and destructive interference.',
    ],
    summary: 'The secret engine of quantum mechanics: complex numbers whose cancellation drives quantum computation.',
    content: `
### Beyond Positive Probabilities
Classical probabilities are always positive real numbers between 0 and 1. They can only add up: you can never add two positive probabilities together and end up with 0 probability!

Quantum mechanics works not with probabilities directly, but with **complex probability amplitudes**. A complex number $z = x + iy = r e^{i\\theta}$ possesses both a magnitude $r$ and a direction/phase $\\theta$.

### Cancellation via Phase
When two quantum paths lead to the same computational outcome with opposite phases:
- Path A amplitude: $+1/2$
- Path B amplitude: $-1/2$
- Total amplitude: $(+1/2) + (-1/2) = 0$
- Resulting probability: $|0|^2 = 0$!

This cancellation is **destructive interference**. It is impossible in classical probability and powers quantum speedups!
`,
    interactiveExperiment: {
      title: 'Relative Phase with S Gate',
      description: 'Apply H followed by S to observe imaginary amplitude component on state |1⟩.',
      suggestedGates: ['H', 'S'],
      expectedState: 'Amplitudes: [1/√2, i/√2]',
      instructions: 'Place H then S on wire 0 and inspect the complex statevector in the simulator.',
    },
    knowledgeCheck: {
      question: 'Can two probability amplitudes cancel each other to produce zero probability?',
      options: [
        'No, probabilities can only increase',
        'Yes, through destructive quantum interference if they have opposite phases',
        'Only in classical thermal noise',
        'Only if the qubit is disconnected',
      ],
      correctIndex: 1,
      explanation: 'Complex amplitudes with opposite phases (e.g. +a and -a) sum to zero, leading to destructive interference.',
    },
    relatedGates: ['H', 'S', 'Z'],
    relatedLabId: 'lab-4',
  },

  // --- INTERMEDIATE ---
  {
    id: 'lesson-9',
    title: 'Hadamard Transformations',
    level: 'intermediate',
    estimatedMinutes: 12,
    objectives: [
      'Derive the Hadamard matrix transformation algebraically.',
      'Understand the basis change between Z-basis and X-basis.',
      'Prove that H · H = I.',
    ],
    summary: 'Deep dive into the geometry, matrix multiplication, and interference dynamics of the Hadamard gate.',
    content: `
### Matrix Mechanics of H
The Hadamard gate matrix is:

$$H = \\frac{1}{\\sqrt{2}}\\begin{bmatrix} 1 & 1 \\\\ 1 & -1 \\end{bmatrix}$$

When applied to $|0\\rangle = \\begin{bmatrix} 1 \\\\ 0 \\end{bmatrix}$:

$$H|0\\rangle = \\frac{1}{\\sqrt{2}}\\begin{bmatrix} 1 & 1 \\\\ 1 & -1 \\end{bmatrix}\\begin{bmatrix} 1 \\\\ 0 \\end{bmatrix} = \\frac{1}{\\sqrt{2}}\\begin{bmatrix} 1 \\\\ 1 \\end{bmatrix} = |+\\rangle$$

When applied to $|1\\rangle = \\begin{bmatrix} 0 \\\\ 1 \\end{bmatrix}$:

$$H|1\\rangle = \\frac{1}{\\sqrt{2}}\\begin{bmatrix} 1 & 1 \\\\ 1 & -1 \\end{bmatrix}\\begin{bmatrix} 0 \\\\ 1 \\end{bmatrix} = \\frac{1}{\\sqrt{2}}\\begin{bmatrix} 1 \\\\ -1 \\end{bmatrix} = |-\\rangle$$

Notice the negative sign on $|1\\rangle$ in $|-\\rangle$! That minus sign is a relative phase of $\\pi$.
`,
    interactiveExperiment: {
      title: 'Transform |1⟩ into |−⟩',
      description: 'Apply X then H to create the negative superposition state |−⟩.',
      suggestedGates: ['X', 'H'],
      expectedState: 'Amplitudes: [1/√2, -1/√2]',
      instructions: 'Place X then H on wire 0 and check the negative sign in the statevector.',
    },
    knowledgeCheck: {
      question: 'What is the matrix product H · H?',
      options: ['The Pauli-X gate', 'The Identity matrix I', 'The Pauli-Z gate', 'Zero matrix'],
      correctIndex: 1,
      explanation: 'H is self-inverse (Hermitian and unitary), meaning H · H = I.',
    },
    relatedGates: ['H', 'X', 'Z'],
    relatedLabId: 'lab-5',
  },
  {
    id: 'lesson-10',
    title: 'The Pauli Gates (X, Y, Z)',
    level: 'intermediate',
    estimatedMinutes: 11,
    objectives: [
      'Master the three Pauli matrices σ_x, σ_y, σ_z.',
      'Understand their anti-commutation relations: {σ_i, σ_j} = 2δ_ij I.',
      'Visualize 180° rotations around the Cartesian axes of the Bloch sphere.',
    ],
    summary: 'The fundamental Pauli group spanning single-qubit space and governing quantum spin.',
    content: `
### The Pauli Algebra
The three Pauli operators form the basis for all $2 \\times 2$ Hermitian matrices:

$$\\sigma_x = \\begin{bmatrix} 0 & 1 \\\\ 1 & 0 \\end{bmatrix}, \\quad \\sigma_y = \\begin{bmatrix} 0 & -i \\\\ i & 0 \\end{bmatrix}, \\quad \\sigma_z = \\begin{bmatrix} 1 & 0 \\\\ 0 & -1 \\end{bmatrix}$$

Key algebraic properties:
1. **Self-Inverse**: $X^2 = Y^2 = Z^2 = I$.
2. **Anti-Commuting**: $XY = -YX = iZ$, $YZ = -ZY = iX$, $ZX = -XZ = iY$.
3. **Bloch Rotations**: Each Pauli operator corresponds to a rotation of $\\pi$ radians (180°) around its respective Cartesian axis on the Bloch sphere.
`,
    interactiveExperiment: {
      title: 'Pauli Algebra Verification',
      description: 'Verify that applying X then Y produces a state equivalent to iZ up to global phase.',
      suggestedGates: ['X', 'Y'],
      expectedState: 'State with phase shift',
      instructions: 'Place X and Y on wire 0 and inspect the resulting phase.',
    },
    knowledgeCheck: {
      question: 'What is the matrix product of Pauli-X and Pauli-Y (X · Y)?',
      options: ['Z', 'iZ', '-iZ', 'Identity'],
      correctIndex: 1,
      explanation: 'From the Pauli commutation relations, X · Y = iZ.',
    },
    relatedGates: ['X', 'Y', 'Z'],
    relatedLabId: 'lab-2',
  },
  {
    id: 'lesson-11',
    title: 'Quantum Phase: Global vs Relative',
    level: 'intermediate',
    estimatedMinutes: 10,
    objectives: [
      'Differentiate between physically unobservable global phase e^(iθ)|ψ⟩ and relative phase |0⟩ + e^(iθ)|1⟩.',
      'Understand why relative phase dictates interference.',
      'Explore the Phase gate S and T gate.',
    ],
    summary: 'Why global phase cannot be detected by any experiment, while relative phase creates all quantum interference.',
    content: `
### Global Phase is Physically Irrelevant
Consider multiplying an entire state vector by a phase factor $e^{i\\theta}$:

$$|\\psi'\\rangle = e^{i\\theta} |\\psi\\rangle$$

When we compute measurement probabilities according to the Born rule:

$$P(k) = |e^{i\\theta} \\alpha_k|^2 = |e^{i\\theta}|^2 |\\alpha_k|^2 = 1 \\cdot |\\alpha_k|^2 = |\\alpha_k|^2$$

Every observable expectation value $\\langle \\psi' | M | \\psi' \\rangle = \\langle \\psi | M | \\psi \\rangle$ is identical! Global phase cannot be measured by any physical apparatus.

### Relative Phase is Everything
Now consider:

$$|\\psi\\rangle = \\frac{|0\\rangle + e^{i\\theta}|1\\rangle}{\\sqrt{2}}$$

Here, $e^{i\\theta}$ is a **relative phase** between $|0\\rangle$ and $|1\\rangle$. If we apply a Hadamard gate, this phase directly determines whether the state ends up in $|0\\rangle$, $|1\\rangle$, or a superposition!
`,
    interactiveExperiment: {
      title: 'Relative Phase Detection with H',
      description: 'Prepare |+⟩, apply Z (phase flip to |−⟩), then apply H to see the phase convert into a bit flip to |1⟩.',
      suggestedGates: ['H', 'Z', 'H'],
      expectedState: '100% |1⟩',
      instructions: 'Place H, Z, then H on wire 0 and simulate. Notice that without Z, H-H would return |0⟩!',
    },
    knowledgeCheck: {
      question: 'Why does applying Z between two H gates result in |1⟩ instead of |0⟩?',
      options: [
        'Z changes the measurement device',
        'Z flips relative phase from + to -, turning constructive interference on |0⟩ into destructive interference',
        'Z increases the energy of the system',
        'Z is an irreversible measurement',
      ],
      correctIndex: 1,
      explanation: 'H converts relative phase into amplitude interference. Flipping the phase with Z converts constructive interference on |0⟩ into constructive interference on |1⟩.',
    },
    relatedGates: ['Z', 'S', 'T', 'H'],
    relatedLabId: 'lab-4',
  },
  {
    id: 'lesson-12',
    title: 'Quantum Interference',
    level: 'intermediate',
    estimatedMinutes: 11,
    objectives: [
      'Analyze the Mach-Zehnder interferometer analogy in quantum circuits.',
      'Trace constructive and destructive interference mathematically.',
      'Understand how algorithms like Deutsch, Grover, and Shor harness interference.',
    ],
    summary: 'Master the wave nature of quantum amplitudes and how constructive and destructive interference solve hard problems.',
    content: `
### The Wave Nature of Probability
When light passes through a double slit, waves from the two slits interfere: peaks meeting peaks create bright fringes (constructive), while peaks meeting troughs cancel to darkness (destructive).

In a quantum computer, the Hadamard gate acts as a **beam splitter**:
1. First H: splits basis state $|0\\rangle$ into two coherent computational paths: $|0\\rangle$ and $|1\\rangle$.
2. Gates in between: apply relative phases along paths.
3. Second H: recombines the paths, producing interference.

### Mathematical Proof of H · H = I
Starting with $|0\\rangle$:
- Step 1: $H|0\\rangle = \\frac{1}{\\sqrt{2}}|0\\rangle + \\frac{1}{\\sqrt{2}}|1\\rangle$
- Step 2: $H(H|0\\rangle) = \\frac{1}{\\sqrt{2}}H|0\\rangle + \\frac{1}{\\sqrt{2}}H|1\\rangle$
  $$= \\frac{1}{\\sqrt{2}}\\left(\\frac{|0\\rangle + |1\\rangle}{\\sqrt{2}}\\right) + \\frac{1}{\\sqrt{2}}\\left(\\frac{|0\\rangle - |1\\rangle}{\\sqrt{2}}\\right)$$
  $$= \\left(\\frac{1}{2} + \\frac{1}{2}\\right)|0\\rangle + \\left(\\frac{1}{2} - \\frac{1}{2}\\right)|1\\rangle$$
  $$= 1|0\\rangle + 0|1\\rangle = |0\\rangle$$

The amplitude for $|1\\rangle$ cancels to zero identically!
`,
    interactiveExperiment: {
      title: 'Interference Experiment H-H',
      description: 'Run H followed by H to witness perfect destructive cancellation of the |1⟩ outcome.',
      suggestedGates: ['H', 'H'],
      expectedState: '100% |0⟩',
      instructions: 'Place H then H on wire 0 and simulate. Confirm that P(|1⟩) = 0.',
    },
    knowledgeCheck: {
      question: 'In the H-H circuit, what happens to the amplitude of state |1⟩ upon the second Hadamard transformation?',
      options: [
        'It doubles in value',
        'It cancels to zero due to destructive interference (1/2 - 1/2 = 0)',
        'It becomes imaginary',
        'It is lost to environmental noise',
      ],
      correctIndex: 1,
      explanation: 'The two paths contributing to |1⟩ have amplitudes +1/2 and -1/2, which destructively cancel to 0.',
    },
    relatedGates: ['H', 'Z'],
    relatedLabId: 'lab-5',
  },
  {
    id: 'lesson-13',
    title: 'Controlled Quantum Operations',
    level: 'intermediate',
    estimatedMinutes: 12,
    objectives: [
      'Understand the general form of controlled gates: |0⟩⟨0| ⊗ I + |1⟩⟨1| ⊗ U.',
      'Explain the Controlled-NOT (CNOT / CX) gate.',
      'Learn the phenomenon of phase kickback.',
    ],
    summary: 'Multi-qubit conditional logic where one qubit dictates whether an operation is applied to another.',
    content: `
### Controlled Unitary Form
Given any single-qubit unitary gate $U$, a controlled version $CU$ acts on two qubits:
- If control qubit is $|0\\rangle$, target qubit remains untouched ($I$).
- If control qubit is $|1\\rangle$, target qubit has $U$ applied.

$$CU = |0\\rangle\\langle 0| \\otimes I + |1\\rangle\\langle 1| \\otimes U$$

### Controlled-NOT (CNOT)
When $U = X$, we have the famous CNOT gate:
- $|00\\rangle \\to |00\\rangle$
- $|01\\rangle \\to |01\\rangle$
- $|10\\rangle \\to |11\\rangle$
- $|11\\rangle \\to |10\\rangle$

### Phase Kickback
Remarkably, if the target qubit is prepared in an eigenstate of $U$ with eigenvalue $e^{i\\theta}$ (such as $|-\\rangle$ for $X$), applying $CU$ causes the phase factor $e^{i\\theta}$ to kick back onto the **control** qubit! This counter-intuitive mechanism is the mathematical engine of Deutsch-Jozsa, Simon, and Shor algorithms.
`,
    interactiveExperiment: {
      title: 'Witness Phase Kickback',
      description: 'Prepare target in |−⟩ (X then H), apply CNOT with control in |+⟩ (H), and observe control phase flip to |−⟩.',
      suggestedGates: ['H', 'X', 'H', 'CX'],
      expectedState: 'Phase kicked back to control qubit',
      instructions: 'Setup control q[0] with H, target q[1] with X then H. Connect CX(0, 1). Observe control state.',
    },
    knowledgeCheck: {
      question: 'What happens in phase kickback when a CNOT is applied with the target in state |−⟩?',
      options: [
        'The target flips from |−⟩ to |+⟩',
        'A relative phase of -1 is transferred to the control qubit',
        'Both qubits collapse to |0⟩',
        'No operation occurs',
      ],
      correctIndex: 1,
      explanation: 'Because X|−⟩ = -|−⟩, the eigenvalue -1 kicks back to the control qubit, flipping it from |+⟩ to |−⟩.',
    },
    relatedGates: ['CX', 'CZ', 'H'],
    relatedLabId: 'lab-7',
  },
  {
    id: 'lesson-14',
    title: 'Multi-Qubit Systems and Tensor Products',
    level: 'intermediate',
    estimatedMinutes: 13,
    objectives: [
      'Construct joint quantum states using the tensor product ⊗ (Kronecker product).',
      'Understand multi-qubit basis ordering conventions.',
      'Calculate state vector dimensions: 2^n.',
    ],
    summary: 'How individual qubits combine mathematically via tensor products into composite multi-qubit Hilbert spaces.',
    content: `
### The Tensor Product (⊗)
When two independent quantum systems $A$ and $B$ are combined, their composite state space is the tensor product $\\mathcal{H}_A \\otimes \\mathcal{H}_B$.

For single-qubit states $|\\psi\\rangle = \\begin{bmatrix} a_0 \\\\ a_1 \\end{bmatrix}$ and $|\\phi\\rangle = \\begin{bmatrix} b_0 \\\\ b_1 \\end{bmatrix}$:

$$|\\psi\\rangle \\otimes |\\phi\\rangle = \\begin{bmatrix} a_0 \\begin{bmatrix} b_0 \\\\ b_1 \\end{bmatrix} \\\\ a_1 \\begin{bmatrix} b_0 \\\\ b_1 \\end{bmatrix} \\end{bmatrix} = \\begin{bmatrix} a_0 b_0 \\\\ a_0 b_1 \\\\ a_1 b_0 \\\\ a_1 b_1 \\end{bmatrix}$$

### Qubit Indexing Conventions
In standard quantum computing and Qiskit, basis states are written as $|q_{n-1} \\dots q_1 q_0\\rangle$:
- Qubit 0 is the least significant bit (rightmost).
- Qubit $n-1$ is the most significant bit (leftmost).
For a 2-qubit system, the 4 basis vectors are $|00\\rangle, |01\\rangle, |10\\rangle, |11\\rangle$.
`,
    interactiveExperiment: {
      title: 'Build a 2-Qubit Product State',
      description: 'Prepare q[0] in |1⟩ and q[1] in |0⟩, resulting in composite state |01⟩ (amplitude at index 1).',
      suggestedGates: ['X'],
      expectedState: '100% |01⟩',
      instructions: 'On a 2-qubit circuit, place X on q[0] and leave q[1] empty. Verify outcome.',
    },
    knowledgeCheck: {
      question: 'How many complex amplitudes are required to describe an arbitrary pure state of 4 qubits?',
      options: ['4', '8', '16', '32'],
      correctIndex: 2,
      explanation: 'An n-qubit system has dimension 2^n. For n = 4, 2^4 = 16 complex amplitudes.',
    },
    relatedGates: ['X', 'CX'],
    relatedLabId: 'lab-1',
  },
  {
    id: 'lesson-15',
    title: 'Entanglement & Non-Separable States',
    level: 'intermediate',
    estimatedMinutes: 14,
    objectives: [
      'Define quantum entanglement mathematically as state non-separability: |ψ⟩ ≠ |ψ_A⟩ ⊗ |ψ_B⟩.',
      'Explore Einstein-Podolsky-Rosen (EPR) paradox and Bell test correlations.',
      'Explain why entanglement does NOT permit faster-than-light communication.',
    ],
    summary: 'The quintessential quantum phenomenon where multiple particles share a unified, indivisible physical identity.',
    content: `
### What is Entanglement?
A multi-qubit state is **separable** (product state) if it can be written as the tensor product of individual qubit states: $|\\psi\\rangle = |\\psi_1\\rangle \\otimes |\\psi_2\\rangle$.

If a state **cannot** be factored into individual states, it is **entangled**!
Consider the Bell state:

$$|\\Phi^+\\rangle = \\frac{|00\\rangle + |11\\rangle}{\\sqrt{2}}$$

Neither qubit has a definite state on its own. If you measure Qubit 1 and observe 0, Qubit 2 instantly collapses to 0. If you measure Qubit 1 and observe 1, Qubit 2 instantly collapses to 1. Their measurement outcomes are 100% correlated!

### No-Signaling Principle
Does this allow faster-than-light communication? **No!**
To the observer measuring Qubit 2, the outcome is completely random (50% 0, 50% 1). Only when the two observers compare notes classically can the correlation be verified. Information cannot travel faster than light.
`,
    interactiveExperiment: {
      title: 'Generate Maximum Entanglement',
      description: 'Build the Bell state |Φ⁺⟩ using Hadamard on q[0] and CNOT controlled by q[0] onto q[1].',
      suggestedGates: ['H', 'CX'],
      expectedState: '50% |00⟩, 50% |11⟩, 0% |01⟩, 0% |10⟩',
      instructions: 'Place H on wire 0 at col 0, and CNOT(0, 1) at col 1. Run simulation.',
    },
    knowledgeCheck: {
      question: 'Can the state (|00⟩ + |11⟩)/√2 be factored into (|a⟩ ⊗ |b⟩) for any single-qubit states |a⟩ and |b⟩?',
      options: [
        'Yes, with |a⟩=|0⟩ and |b⟩=|1⟩',
        'No, it is mathematically non-separable, meaning it is entangled',
        'Yes, using a classical transformation',
        'Only when measured',
      ],
      correctIndex: 1,
      explanation: 'Attempting to solve (a0|0⟩ + a1|1⟩) ⊗ (b0|0⟩ + b1|1⟩) = (|00⟩ + |11⟩)/√2 requires a0*b1 = 0 and a1*b0 = 0, which contradicts a0*b0 ≠ 0 and a1*b1 ≠ 0.',
    },
    relatedGates: ['H', 'CX'],
    relatedLabId: 'lab-6',
  },
  {
    id: 'lesson-16',
    title: 'State Vectors & Measurement Probabilities',
    level: 'intermediate',
    estimatedMinutes: 11,
    objectives: [
      'Calculate multi-qubit joint measurement probabilities.',
      'Understand marginal probabilities and partial traces.',
      'Compute expectation values of Pauli observables ⟨ψ|Z_i|ψ⟩.',
    ],
    summary: 'A rigorous mathematical guide to extracting probabilities and observables from composite state vectors.',
    content: `
### Multi-Qubit Probability Distribution
For an $n$-qubit state vector $|\\psi\\rangle = \\sum_{x=0}^{2^n-1} \\alpha_x |x\\rangle$:
The probability of observing bitstring $x$ is:

$$P(x) = |\\alpha_x|^2$$

### Marginal Probability for a Single Qubit
To determine the probability that qubit $j$ is measured as 0, sum the probabilities of all basis states where bit $j$ is 0:

$$P(q_j = 0) = \\sum_{x: \\text{bit } j \\text{ is } 0} |\\alpha_x|^2$$

### Expectation Values
The expectation value of Pauli-Z on qubit $j$ is:

$$\\langle Z_j \\rangle = P(q_j = 0) - P(q_j = 1)$$
`,
    interactiveExperiment: {
      title: 'Calculate Marginal Probabilities',
      description: 'In an entangled Bell state, verify that the marginal probability for each individual qubit is exactly 50%.',
      suggestedGates: ['H', 'CX'],
      expectedState: 'P(q0=0)=0.5, P(q1=0)=0.5',
      instructions: 'Run Bell state circuit and compare the joint distribution (|00⟩, |11⟩) with individual qubit Bloch vectors (z=0).',
    },
    knowledgeCheck: {
      question: 'For an entangled Bell state (|00⟩ + |11⟩)/√2, what is the expectation value ⟨Z₀⟩ of Pauli-Z on qubit 0?',
      options: ['+1', '-1', '0', '1/2'],
      correctIndex: 2,
      explanation: '⟨Z₀⟩ = P(q0=0) - P(q0=1) = 0.5 - 0.5 = 0. Qubit 0 alone is in a maximally mixed state.',
    },
    relatedGates: ['H', 'CX', 'Z'],
    relatedLabId: 'lab-6',
  },
  {
    id: 'lesson-17',
    title: 'Quantum Circuit Diagrams',
    level: 'intermediate',
    estimatedMinutes: 10,
    objectives: [
      'Master the syntax and conventions of quantum circuit diagrams.',
      'Understand circuit depth, gate count, and parallel operations.',
      'Differentiate between quantum wires and classical bit registers.',
    ],
    summary: 'How to read, design, and optimize quantum circuit schematics like a professional quantum engineer.',
    content: `
### Anatomy of a Quantum Circuit
A quantum circuit diagram provides a temporal roadmap of operations:
- **Single Line**: Represents a quantum wire (qubit state vector).
- **Double Line**: Represents a classical register (measured bit).
- **Gate Box**: Single-qubit unitary operation.
- **Control Dot (•)**: Qubit conditioning an operation when in state $|1\\rangle$.
- **Target Cross (⊕)**: Controlled bit-flip (X) on target.
- **Meter Icon**: Measurement operation projecting quantum state to classical bit.

### Circuit Depth vs Gate Count
- **Gate Count**: Total number of gates placed in the circuit.
- **Circuit Depth**: The maximum length of a sequence of dependent operations (number of parallel time steps). Minimizing depth reduces decoherence errors!
`,
    interactiveExperiment: {
      title: 'Analyze Parallel Operations',
      description: 'Place H gates on wire 0 and wire 1 at column 0 to see parallel execution with depth = 1.',
      suggestedGates: ['H', 'H'],
      expectedState: 'Depth 1, equal superposition over 4 states',
      instructions: 'Add H to q[0] and H to q[1] at col 0. Verify probabilities for 00, 01, 10, 11 are each 25%.',
    },
    knowledgeCheck: {
      question: 'Why is minimizing circuit depth critical on NISQ (Noisy Intermediate-Scale Quantum) hardware?',
      options: [
        'It reduces electricity usage',
        'Physical qubits have finite coherence times (T1 and T2); shorter circuits experience less noise',
        'It makes the code compile faster',
        'It allows more classical bits',
      ],
      correctIndex: 1,
      explanation: 'Because qubits suffer decoherence over time, circuits with smaller depth finish before quantum coherence decays.',
    },
    relatedGates: ['H', 'CX', 'MEASURE'],
    relatedLabId: 'lab-1',
  },

  // --- ADVANCED ---
  {
    id: 'lesson-18',
    title: 'Unitary Transformations',
    level: 'advanced',
    estimatedMinutes: 15,
    objectives: [
      'Define unitary matrices rigorously: U†U = I.',
      'Understand the preservation of inner products: ⟨Uψ|Uϕ⟩ = ⟨ψ|ϕ⟩.',
      'Examine eigenvalues on the complex unit circle: λ = e^(iθ).',
    ],
    summary: 'The mathematical bedrock of quantum mechanics: why quantum state evolution is strictly norm-preserving and reversible.',
    content: `
### Mathematical Rigor of Unitary Operators
A linear operator $U$ on Hilbert space is **unitary** if its adjoint $U^\\dagger$ (conjugate transpose) equals its inverse:

$$U^\\dagger U = U U^\\dagger = I$$

### Consequences of Unitarity:
1. **Norm Preservation**: For any state $|\\psi\\rangle$, $\\|U|\\psi\\rangle\\| = \\||\\psi\\rangle\\|$. Total probability is conserved at 100%.
2. **Inner Product Invariance**: $\\langle U\\phi | U\\psi \\rangle = \\langle \\phi | U^\\dagger U | \\psi \\rangle = \\langle \\phi | \\psi \\rangle$. Angles between states are invariant.
3. **Complex Eigenvalues**: Every eigenvalue $\\lambda$ of a unitary matrix has absolute value $|\lambda| = 1$, meaning $\\lambda = e^{i\\theta}$.
4. **Spectral Decomposition**: Any unitary matrix can be written as $U = \\exp(-iHt)$ for some Hermitian Hamiltonian operator $H$.
`,
    interactiveExperiment: {
      title: 'Verify Adjoint Inversion',
      description: 'Apply S gate followed by S-Dagger (S†) to prove S† · S = I.',
      suggestedGates: ['S', 'Sdg'],
      expectedState: 'P(|0⟩) = 1.0',
      instructions: 'Place S then Sdg on wire 0. Check that the final state matches the initial state.',
    },
    knowledgeCheck: {
      question: 'What is the absolute magnitude |λ| of any eigenvalue λ of a unitary operator?',
      options: ['0', '1', 'Depends on the qubit count', 'Infinity'],
      correctIndex: 1,
      explanation: 'Because unitary transformations preserve vector lengths, all eigenvalues must lie on the unit circle: |λ| = 1.',
    },
    relatedGates: ['S', 'Sdg', 'U3'],
    relatedLabId: 'lab-4',
  },
  {
    id: 'lesson-19',
    title: 'Continuous Rotation Gates (RX, RY, RZ)',
    level: 'advanced',
    estimatedMinutes: 14,
    objectives: [
      'Formulate rotation operators via matrix exponentials: R_n(θ) = exp(-i θ/2 n·σ).',
      'Understand Euler angle decomposition and the universal U3 gate.',
      'Learn why 4π rotation is required to restore the spinor wavefunction sign.',
    ],
    summary: 'Continuous analog rotations around the Bloch sphere axes and their role in quantum machine learning and VQE.',
    content: `
### Generator of Rotations
By exponentiating the Pauli matrices, we obtain continuous rotation operators:

$$R_x(\\theta) = e^{-i\\frac{\\theta}{2}X} = \\cos\\left(\\frac{\\theta}{2}\\right)I - i\\sin\\left(\\frac{\\theta}{2}\\right)X$$
$$R_y(\\theta) = e^{-i\\frac{\\theta}{2}Y} = \\cos\\left(\\frac{\\theta}{2}\\right)I - i\\sin\\left(\\frac{\\theta}{2}\\right)Y$$
$$R_z(\\theta) = e^{-i\\frac{\\theta}{2}Z} = \\cos\\left(\\frac{\\theta}{2}\\right)I - i\\sin\\left(\\frac{\\theta}{2}\\right)Z$$

### The Spinor Sign Property
Notice the factor of $\\theta/2$! If you rotate a qubit by $\\theta = 2\\pi$ (360°):

$$R_x(2\\pi) = \\cos(\\pi)I - i\\sin(\\pi)X = -I$$

Rotating a qubit 360° flips its sign to $-|\\psi\\rangle$! You must rotate by $4\\pi$ (720°) to return to $+|\\psi\\rangle$. This is the fundamental characteristic of spin-1/2 fermions.
`,
    interactiveExperiment: {
      title: 'Tune Superposition with RY(θ)',
      description: 'Set RY with θ = π/2 to produce an equal superposition, then sweep θ to observe continuous probability modulation.',
      suggestedGates: ['RY'],
      expectedState: 'Tunable probability: P(|1⟩) = sin²(θ/2)',
      instructions: 'Place RY on wire 0, open parameter inspector, and adjust θ.',
    },
    knowledgeCheck: {
      question: 'What is the mathematical result of applying an R_x(2π) rotation to a quantum state |ψ⟩?',
      options: ['+|ψ⟩', '-|ψ⟩ (sign inversion)', '|0⟩', 'Undefined'],
      correctIndex: 1,
      explanation: 'Because qubits are spin-1/2 particles, a 2π rotation introduces a factor of cos(π) = -1, yielding -|ψ⟩.',
    },
    relatedGates: ['RX', 'RY', 'RZ', 'U3'],
    relatedLabId: 'lab-3',
  },
  {
    id: 'lesson-20',
    title: 'The Four Bell States',
    level: 'advanced',
    estimatedMinutes: 13,
    objectives: [
      'Construct all 4 maximally entangled Bell states: |Φ⁺⟩, |Φ⁻⟩, |Ψ⁺⟩, |Ψ⁻⟩.',
      'Understand the Bell basis as an orthonormal basis for 2-qubit Hilbert space.',
      'Learn how Pauli operations on one qubit map between Bell states.',
    ],
    summary: 'The canonical maximally entangled 2-qubit states that form the foundation of quantum protocols.',
    content: `
### The Bell Basis
The four Bell states (EPR pairs) form an orthonormal basis for two qubits:

$$|\\Phi^+\\rangle = \\frac{|00\\rangle + |11\\rangle}{\\sqrt{2}}$$
$$|\\Phi^-\\rangle = \\frac{|00\\rangle - |11\\rangle}{\\sqrt{2}} = (Z \\otimes I)|\\Phi^+\\rangle$$
$$|\\Psi^+\\rangle = \\frac{|01\\rangle + |10\\rangle}{\\sqrt{2}} = (X \\otimes I)|\\Phi^+\\rangle$$
$$|\\Psi^-\\rangle = \\frac{|01\\rangle - |10\\rangle}{\\sqrt{2}} = (iY \\otimes I)|\\Phi^+\\rangle$$

### Transitions via Local Operations
A remarkable property of the Bell states is that Alice can transform between all 4 states simply by applying single-qubit Pauli gates ($I, X, Z, Y$) to **her qubit alone**, without touching Bob's qubit! This enables **Superdense Coding**.
`,
    interactiveExperiment: {
      title: 'Synthesize the |Φ⁻⟩ Bell State',
      description: 'Apply X then H on q[0], then CNOT(0, 1) to create the phase-flipped Bell state |Φ⁻⟩.',
      suggestedGates: ['X', 'H', 'CX'],
      expectedState: 'Amplitudes: [1/√2, 0, 0, -1/√2]',
      instructions: 'Setup q[0] with X then H. Connect CX to q[1]. Check statevector amplitudes.',
    },
    knowledgeCheck: {
      question: 'Which single-qubit Pauli gate applied to Qubit 1 converts |Φ⁺⟩ into |Φ⁻⟩?',
      options: ['Pauli-X', 'Pauli-Z', 'Hadamard', 'Identity'],
      correctIndex: 1,
      explanation: 'Pauli-Z flips the phase of |1⟩, turning (|00⟩ + |11⟩)/√2 into (|00⟩ - |11⟩)/√2 = |Φ⁻⟩.',
    },
    relatedGates: ['H', 'CX', 'Z', 'X'],
    relatedLabId: 'lab-6',
  },
  {
    id: 'lesson-21',
    title: 'Quantum Teleportation Protocol',
    level: 'advanced',
    estimatedMinutes: 16,
    objectives: [
      'Trace the 3-qubit quantum teleportation circuit step by step.',
      'Understand Bell measurement and classical feed-forward.',
      'Prove that the No-Cloning theorem is respected.',
    ],
    summary: 'Transmit an unknown quantum state across space using prior entanglement and 2 classical bits.',
    content: `
### The Teleportation Protocol
Suppose Alice possesses an unknown quantum state $|\\psi\\rangle = \\alpha |0\\rangle + \\beta |1\\rangle$. She wants to send it to Bob, but cannot measure it without destroying it, nor can she copy it (No-Cloning Theorem).

### The Steps:
1. **Shared Entanglement**: Alice and Bob share an EPR pair $|\\Phi^+\\rangle$ on qubits 1 and 2.
2. **Bell Measurement**: Alice performs a CNOT between her state $|\\psi\\rangle$ (qubit 0) and her half of the entangled pair (qubit 1), followed by a Hadamard on qubit 0.
3. **Classical Communication**: Alice measures qubits 0 and 1, obtaining 2 classical bits ($m_0, m_1$). She sends these bits to Bob via classical telephone/fiber optic.
4. **Reconstruction**: Depending on the 2 bits received:
   - $00 \\to I$ (do nothing)
   - $01 \\to X$ (apply X)
   - $10 \\to Z$ (apply Z)
   - $11 \\to Z X$ (apply X then Z)
Bob's qubit is now guaranteed to be in the exact original state $|\\psi\\rangle$!
`,
    interactiveExperiment: {
      title: 'Run Teleportation Circuit',
      description: 'Observe the state of qubit 0 transferred to qubit 2 through entanglement and measurements.',
      suggestedGates: ['H', 'CX'],
      expectedState: 'State transferred to Bob',
      instructions: 'Examine the 3-qubit teleportation circuit in the Quantum Labs module.',
    },
    knowledgeCheck: {
      question: 'How many classical bits must Alice transmit to Bob to complete the teleportation of one qubit?',
      options: ['0 bits', '1 bit', '2 classical bits', 'Infinite bits'],
      correctIndex: 2,
      explanation: 'Alice sends 2 classical bits (the outcomes of her two measurements) so Bob knows which Pauli correction to apply.',
    },
    relatedGates: ['H', 'CX', 'X', 'Z', 'MEASURE'],
    relatedLabId: 'lab-9',
  },
  {
    id: 'lesson-22',
    title: 'Superdense Coding',
    level: 'advanced',
    estimatedMinutes: 13,
    objectives: [
      'Understand the inverse of quantum teleportation: sending 2 classical bits using 1 qubit.',
      'Analyze the encoding operations (I, X, Z, XZ) on an entangled pair.',
      'Examine the decoding Bell measurement.',
    ],
    summary: 'Transmit two classical bits of information by manipulating and transmitting only a single physical qubit.',
    content: `
### Doubling Classical Channel Capacity
In classical communication, sending 1 bit requires sending 1 physical carrier. In **superdense coding**, prior entanglement allows Alice to transmit **2 classical bits** ($00, 01, 10, 11$) to Bob by physically sending only **one qubit**!

### Protocol:
1. Alice and Bob share Bell pair $|\\Phi^+\\rangle = (|00\\rangle + |11\\rangle)/\\sqrt{2}$.
2. Alice encodes her 2 classical bits onto her qubit:
   - For $00$: applies $I \\to |\\Phi^+\\rangle$
   - For $01$: applies $X \\to |\\Psi^+\\rangle$
   - For $10$: applies $Z \\to |\\Phi^-\\rangle$
   - For $11$: applies $XZ \\to |\\Psi^-\\rangle$
3. Alice sends her single qubit to Bob.
4. Bob performs a Bell measurement (CNOT then H) on both qubits, revealing Alice's 2 bits with 100% fidelity!
`,
    interactiveExperiment: {
      title: 'Encode Two Bits into One Qubit',
      description: 'Apply Z to Alice qubit on a Bell state to encode classical message "10", then decode.',
      suggestedGates: ['H', 'CX', 'Z', 'CX', 'H'],
      expectedState: 'Output bits "10"',
      instructions: 'Assemble Bell pair, apply Z to q[0], apply decoding CX and H, then measure.',
    },
    knowledgeCheck: {
      question: 'What allows superdense coding to achieve 2 classical bits per transmitted qubit without violating Holevo bound?',
      options: [
        'Faster-than-light signals',
        'Pre-shared quantum entanglement between sender and receiver',
        'Lossless compression',
        'Cryogenic cooling',
      ],
      correctIndex: 1,
      explanation: 'Pre-shared entanglement provides the necessary quantum correlations that enable double the classical capacity.',
    },
    relatedGates: ['H', 'CX', 'Z', 'X'],
    relatedLabId: 'lab-10',
  },
  {
    id: 'lesson-23',
    title: 'Quantum Fourier Transform (QFT)',
    level: 'advanced',
    estimatedMinutes: 17,
    objectives: [
      'Formulate the discrete Fourier transform in quantum amplitude space.',
      'Construct the QFT circuit using Hadamard and Controlled-Phase (CP) gates.',
      'Understand its role as the quantum speedup engine in Shor algorithm and Phase Estimation.',
    ],
    summary: 'The quantum analogue of the Discrete Fourier Transform providing an exponential speedup from O(n 2^n) to O(n²).',
    content: `
### Transforming Amplitudes to Frequencies
The Classical Fast Fourier Transform (FFT) on $N = 2^n$ numbers takes $\\mathcal{O}(n 2^n)$ operations. The **Quantum Fourier Transform (QFT)** computes the Fourier transform on amplitude vectors in only $\\mathcal{O}(n^2)$ gate operations—an exponential speedup!

### Mathematical Definition
$$|j\\rangle \\mapsto \\frac{1}{\\sqrt{2^n}} \\sum_{k=0}^{2^n-1} e^{2\\pi i j k / 2^n} |k\\rangle$$

### Circuit Architecture
For $n$ qubits:
1. Apply Hadamard to qubit $j$.
2. Apply controlled phase gates $R_k = \\begin{bmatrix} 1 & 0 \\\\ 0 & e^{2\\pi i / 2^k} \\end{bmatrix}$ from subsequent qubits.
3. Repeat for all qubits.
4. Reverse qubit order using SWAP gates.
`,
    interactiveExperiment: {
      title: 'Explore 2-Qubit QFT Circuit',
      description: 'Observe QFT transforming basis state |01⟩ into uniform phase rotation across all 4 basis states.',
      suggestedGates: ['X', 'H', 'CP', 'H', 'SWAP'],
      expectedState: 'Equal probabilities with quarterly phase offsets',
      instructions: 'Review the 2-qubit QFT circuit in the Quantum Labs tab.',
    },
    knowledgeCheck: {
      question: 'What is the asymptotic gate complexity of the Quantum Fourier Transform on n qubits?',
      options: ['O(2^n)', 'O(n²)', 'O(n³ · 2^n)', 'O(1)'],
      correctIndex: 1,
      explanation: 'The QFT requires O(n²) gates (specifically n(n+1)/2 gates), representing an exponential improvement over classical FFT.',
    },
    relatedGates: ['H', 'CP', 'SWAP'],
    relatedLabId: 'lab-12',
  },
  {
    id: 'lesson-24',
    title: "Introduction to Grover's Algorithm",
    level: 'advanced',
    estimatedMinutes: 16,
    objectives: [
      'Understand unstructured database search and the quadratic speedup: O(√N) vs O(N).',
      'Analyze the phase oracle and Grover diffusion operator (inversion about the mean).',
      'Trace geometric amplitude amplification in 2D subspace.',
    ],
    summary: 'Explore amplitude amplification and search unstructured databases with provable quantum advantage.',
    content: `
### Quadratic Speedup for Search
Searching through an unsorted database of $N$ items classically requires $\\mathcal{O}(N)$ checks in the worst case. **Grover's Algorithm** finds the marked item in only $\\mathcal{O}(\\sqrt{N})$ queries! For $N = 1,000,000$, Grover requires only $\\approx 1,000$ iterations.

### The Two Operators:
1. **The Oracle ($U_f$)**: Flips the phase of the marked target state: $|x\\rangle \\to -|x\\rangle$ if $f(x)=1$.
2. **The Diffusion Operator ($U_s = 2|s\\rangle\\langle s| - I$)**: Reflects amplitudes about their mean.

Through successive reflections in a 2-dimensional plane spanned by the target state and the uniform superposition, the probability amplitude of the target state amplifies toward 100%!
`,
    interactiveExperiment: {
      title: 'Run 2-Qubit Grover Iteration',
      description: 'Execute one Grover iteration on 4 items to amplify marked state |11⟩ to 100% probability.',
      suggestedGates: ['H', 'CZ', 'H', 'X', 'CZ', 'X', 'H'],
      expectedState: '100% |11⟩',
      instructions: 'Open Grover Lab in Guided Labs to step through oracle and diffusion.',
    },
    knowledgeCheck: {
      question: 'How many iterations does Grover search require to locate a marked item among N entries?',
      options: ['O(N)', 'O(log N)', 'O(√N)', 'O(N²)'],
      correctIndex: 2,
      explanation: 'Grover algorithm achieves an optimal quadratic speedup of O(√N) queries.',
    },
    relatedGates: ['H', 'X', 'CZ', 'Z'],
    relatedLabId: 'lab-11',
  },
  {
    id: 'lesson-25',
    title: 'Noise, Decoherence & Error Mitigation',
    level: 'advanced',
    estimatedMinutes: 14,
    objectives: [
      'Identify the physical sources of quantum noise: T1 (relaxation) and T2 (dephasing).',
      'Understand gate infidelities and measurement readout errors.',
      'Introduce quantum error mitigation (ZNE) and fault-tolerant quantum error correction (Surface Codes).',
    ],
    summary: 'The reality of physical quantum computing: why qubits lose information to environmental thermal fluctuations.',
    content: `
### The Fragility of Quantum Information
Unlike classical bits protected by macroscopic energy barriers, quantum superpositions are extraordinarily fragile. Environmental interactions cause **decoherence**:
1. **$T_1$ (Relaxation Time)**: Energy dissipation where excited state $|1\\rangle$ decays spontaneously into ground state $|0\\rangle$.
2. **$T_2$ (Dephasing Time)**: Phase randomization where the relative phase between $|0\\rangle$ and $|1\\rangle$ drifts due to magnetic fluctuations.

### Error Correction vs Mitigation
- **Quantum Error Mitigation (QEM)**: Post-processing techniques (such as Zero-Noise Extrapolation and Readout Symmetrization) that reduce noise without extra physical qubits.
- **Quantum Error Correction (QEC)**: Encoding 1 logical qubit across hundreds or thousands of physical qubits (e.g. Surface Code) to detect and correct errors without measuring the logical state.
`,
    interactiveExperiment: {
      title: 'Compare Ideal vs Hardware Expectations',
      description: 'Observe why statevector simulation yields exact mathematical probabilities whereas hardware produces noisy distributions.',
      suggestedGates: ['H', 'CX'],
      expectedState: 'Ideal Bell state (no leakage)',
      instructions: 'Review simulator results and observe that ideal simulations show exact 50/50 probabilities without thermal leakage.',
    },
    knowledgeCheck: {
      question: 'What is T1 relaxation time in physical superconducting qubits?',
      options: [
        'The time needed to compile Qiskit code',
        'The characteristic decay time for an excited state |1⟩ to lose energy and drop to |0⟩',
        'The time for quantum entanglement to cross the internet',
        'The speed of light inside silicon',
      ],
      correctIndex: 1,
      explanation: 'T1 measures energy relaxation: the time taken for a qubit in excited state |1⟩ to decay to ground state |0⟩.',
    },
    relatedGates: ['I', 'X'],
    relatedLabId: 'lab-8',
  },
  {
    id: 'lesson-26',
    title: 'Ideal Simulation vs Real Quantum Hardware',
    level: 'advanced',
    estimatedMinutes: 12,
    objectives: [
      'Compare local mathematical statevector simulation with physical quantum processing units (QPUs).',
      'Explain the computational wall of classical simulation: 2^n memory scaling.',
      'Understand quantum advantage and when quantum computers outperform classical supercomputers.',
    ],
    summary: 'Why classical computers can easily simulate 10 qubits but choke on 60, and what genuine quantum advantage means.',
    content: `
### The Classical Simulation Wall
In this browser simulator, we store $2^n$ complex numbers (amplitudes).
- For $n = 4$ qubits: $2^4 = 16$ amplitudes (a few bytes).
- For $n = 10$ qubits: $2^{10} = 1,024$ amplitudes (kilobytes).
- For $n = 30$ qubits: $2^{30} \\approx 1$ billion amplitudes (16 Gigabytes of RAM).
- For $n = 50$ qubits: $2^{50} \\approx 1$ quadrillion amplitudes (16 Petabytes—supercomputer limit).
- For $n = 300$ qubits: $2^{300}$ amplitudes exceeds the total number of atoms in the observable universe!

### Real Quantum Hardware
Physical quantum computers do not "calculate" statevectors; the physical qubits simply evolve naturally according to the Schrödinger equation. When quantum systems exceed ~50-60 qubits with sufficient depth and low error, classical supercomputers can no longer simulate them.
`,
    interactiveExperiment: {
      title: 'Observe Statevector Dimension Scaling',
      description: 'Increase qubit count from 1 to 4 in Circuit Studio and note how the number of basis states scales from 2 to 16.',
      suggestedGates: ['H'],
      expectedState: 'Exponential state basis expansion',
      instructions: 'Toggle between 2, 3, and 4 qubits in the Simulator to inspect the expanding probability table.',
    },
    knowledgeCheck: {
      question: 'Why can classical supercomputers not simulate an arbitrary 100-qubit quantum circuit?',
      options: [
        'Classical computers cannot use complex numbers',
        'Storing the 2^100 amplitudes requires more memory than all physical matter in the universe',
        'Quantum gates are secret algorithms',
        'Python cannot run on supercomputers',
      ],
      correctIndex: 1,
      explanation: '2^100 is approximately 1.27 × 10^30 complex amplitudes, far exceeding the physical storage capacity of the universe.',
    },
    relatedGates: ['H', 'CX'],
    relatedLabId: 'lab-1',
  },
];

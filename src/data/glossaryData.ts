export interface GlossaryTerm {
  term: string;
  category: 'core' | 'math' | 'hardware' | 'protocol';
  shortDef: string;
  detailedDef: string;
  relatedGates?: string[];
}

export const GLOSSARY_DATA: GlossaryTerm[] = [
  {
    term: 'Qubit',
    category: 'core',
    shortDef: 'The basic unit of quantum information, analogous to a classical digital bit.',
    detailedDef: 'A two-level quantum mechanical system mathematically represented as a unit vector in a 2D complex Hilbert space: |ψ⟩ = α|0⟩ + β|1⟩ with |α|² + |β|² = 1.',
  },
  {
    term: 'Superposition',
    category: 'core',
    shortDef: 'The ability of a quantum system to exist in a linear combination of multiple states simultaneously.',
    detailedDef: 'Unlike classical uncertainty, coherent quantum superposition exhibits definite relative phase differences that enable constructive and destructive interference.',
    relatedGates: ['H', 'RY', 'RX'],
  },
  {
    term: 'Probability Amplitude',
    category: 'math',
    shortDef: 'A complex number whose squared magnitude gives the probability of a measurement outcome.',
    detailedDef: 'Amplitudes can have positive, negative, or complex phase values, allowing interference cancellation between alternative computational paths.',
  },
  {
    term: 'Quantum Phase',
    category: 'math',
    shortDef: 'The complex argument θ in an amplitude α = r · e^(iθ).',
    detailedDef: 'While global phase is physically unobservable, relative phase between orthogonal basis states determines the axis and orientation of the state vector on the Bloch sphere.',
    relatedGates: ['Z', 'S', 'T', 'RZ'],
  },
  {
    term: 'Quantum Measurement',
    category: 'core',
    shortDef: 'The irreversible projection of a quantum superposition into a single classical basis state.',
    detailedDef: 'Governed by the Born rule: P(k) = |⟨k|ψ⟩|². The wavefunction collapses immediately, destroying coherence and outputting a classical bit.',
    relatedGates: ['MEASURE'],
  },
  {
    term: 'Entanglement',
    category: 'core',
    shortDef: 'A quantum correlation between multiple particles that cannot be described by individual states.',
    detailedDef: 'Mathematically defined as state non-separability (|ψ⟩ ≠ |a⟩ ⊗ |b⟩). Measuring one particle instantly determines the correlated property of the other.',
    relatedGates: ['CX', 'CZ', 'SWAP'],
  },
  {
    term: 'Unitary Matrix',
    category: 'math',
    shortDef: 'A complex square matrix whose conjugate transpose equals its inverse: U†U = I.',
    detailedDef: 'Unitary transformations preserve the norm (total probability of 1.0) and inner product angles between quantum states, making all gate evolutions reversible.',
  },
  {
    term: 'Bloch Sphere',
    category: 'math',
    shortDef: 'A geometrical representation of the pure state space of a two-level quantum system (qubit).',
    detailedDef: 'Points on the unit sphere surface correspond to pure single-qubit states, with the North Pole representing |0⟩ and the South Pole representing |1⟩.',
  },
  {
    term: 'Bell State',
    category: 'core',
    shortDef: 'One of four maximally entangled two-qubit quantum states (EPR pairs).',
    detailedDef: 'The Bell basis consists of |Φ⁺⟩, |Φ⁻⟩, |Ψ⁺⟩, |Ψ⁻⟩, which exhibit maximum entanglement and violate Bell inequalities.',
    relatedGates: ['H', 'CX'],
  },
  {
    term: 'Circuit Depth',
    category: 'hardware',
    shortDef: 'The number of discrete time slices required to execute a quantum circuit in parallel.',
    detailedDef: 'Shorter circuit depth is vital on NISQ quantum processors to execute algorithms before qubits decohere due to environmental noise.',
  },
  {
    term: 'Decoherence',
    category: 'hardware',
    shortDef: 'The loss of quantum coherence and superposition caused by environmental thermal noise.',
    detailedDef: 'Quantified by relaxation time T1 (relaxation to ground state) and dephasing time T2 (phase randomization).',
  },
  {
    term: 'State Vector',
    category: 'math',
    shortDef: 'A column vector of 2^n complex numbers describing the complete quantum state of an n-qubit system.',
    detailedDef: 'The fundamental mathematical representation used in quantum simulators to compute the evolution of pure states under unitary operations.',
  },
];

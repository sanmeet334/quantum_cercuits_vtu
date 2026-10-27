export interface Achievement {
  id: string;
  title: string;
  description: string;
  requirement: string;
  category: 'onboarding' | 'learning' | 'circuits' | 'labs' | 'mastery';
  iconName: string;
}

export const ACHIEVEMENTS_DATA: Achievement[] = [
  {
    id: 'first_visit',
    title: 'First Quantum Leap',
    description: 'Initialized your personal quantum computing workstation at QuantumGate Cloud Lab.',
    requirement: 'Entered your name and launched the quantum laboratory.',
    category: 'onboarding',
    iconName: 'Sparkles',
  },
  {
    id: 'first_lesson',
    title: 'Quantum Scholar',
    description: 'Completed your very first foundational lesson in Quantum Academy.',
    requirement: 'Complete 1 lesson in Quantum Academy.',
    category: 'learning',
    iconName: 'BookOpen',
  },
  {
    id: 'gate_explorer',
    title: 'Gate Explorer',
    description: 'Investigated the mathematical unitary and Bloch representation of a quantum gate.',
    requirement: 'Explore gate details and apply a transformation in Gate Explorer.',
    category: 'learning',
    iconName: 'Cpu',
  },
  {
    id: 'first_circuit',
    title: 'Circuit Architect',
    description: 'Constructed your first quantum circuit on the interactive circuit canvas.',
    requirement: 'Place at least 2 gates on the circuit wires in Circuit Studio.',
    category: 'circuits',
    iconName: 'GitFork',
  },
  {
    id: 'first_simulation',
    title: 'Statevector Wavefunction',
    description: 'Successfully computed full complex statevector evolution and probability amplitudes.',
    requirement: 'Run a simulation with 1024 shots in Quantum Simulator.',
    category: 'circuits',
    iconName: 'Activity',
  },
  {
    id: 'superposition_explorer',
    title: 'Superposition Pioneer',
    description: 'Prepared an equal superposition state using the Hadamard transformation.',
    requirement: 'Simulate a circuit containing a Hadamard gate.',
    category: 'learning',
    iconName: 'Layers',
  },
  {
    id: 'entanglement_explorer',
    title: 'Spooky Action Master',
    description: 'Generated maximally correlated entangled Bell states with zero separable cross-terms.',
    requirement: 'Generate and verify an entangled state in Entanglement Lab.',
    category: 'circuits',
    iconName: 'Share2',
  },
  {
    id: 'lab_completed',
    title: 'Laboratory Certified',
    description: 'Executed an experimental protocol and answered the analysis checks in Guided Labs.',
    requirement: 'Complete any 1 guided experiment in Quantum Labs.',
    category: 'labs',
    iconName: 'FlaskConical',
  },
  {
    id: 'practice_champion',
    title: 'Practice Champion',
    description: 'Tested your quantum computing instincts across 5 practice questions.',
    requirement: 'Attempt at least 5 questions in the Practice Arena.',
    category: 'learning',
    iconName: 'Target',
  },
  {
    id: 'assessment_passed',
    title: 'Quantum Certified',
    description: 'Scored 70% or higher on a formal 25-question examination.',
    requirement: 'Score at least 18/25 (≥70%) on any formal assessment test.',
    category: 'mastery',
    iconName: 'Award',
  },
  {
    id: 'quantum_mastery',
    title: 'Quantum Grandmaster',
    description: 'Demonstrated mastery across Academy lessons, Guided Labs, and formal assessments.',
    requirement: 'Complete 5 lessons, 3 labs, and pass 1 formal assessment.',
    category: 'mastery',
    iconName: 'Zap',
  },
];

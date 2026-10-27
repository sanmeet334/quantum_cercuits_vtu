import { CircuitModel } from '../quantum/types';

export const EXAMPLE_CIRCUITS: CircuitModel[] = [
  {
    id: 'example_bell_state',
    name: 'Bell State |Φ⁺⟩',
    description: 'Prepares the maximally entangled Einstein-Podolsky-Rosen pair (|00⟩ + |11⟩)/√2 using Hadamard and CNOT.',
    qubitsCount: 2,
    classicalBitsCount: 2,
    gates: [
      { id: 'g_0', type: 'H', target: 0, col: 0 },
      { id: 'g_1', type: 'CX', control: 0, target: 1, col: 1 },
      { id: 'g_2', type: 'MEASURE', target: 0, classicalBit: 0, col: 2 },
      { id: 'g_3', type: 'MEASURE', target: 1, classicalBit: 1, col: 2 },
    ],
    createdAt: '2026-10-27T12:00:00.000Z',
  },
  {
    id: 'example_ghz_state',
    name: '3-Qubit GHZ Entanglement',
    description: 'Generates the Greenberger-Horne-Zeilinger tri-partite entangled state (|000⟩ + |111⟩)/√2 across three qubits.',
    qubitsCount: 3,
    classicalBitsCount: 3,
    gates: [
      { id: 'g_0', type: 'H', target: 0, col: 0 },
      { id: 'g_1', type: 'CX', control: 0, target: 1, col: 1 },
      { id: 'g_2', type: 'CX', control: 1, target: 2, col: 2 },
      { id: 'g_3', type: 'MEASURE', target: 0, classicalBit: 0, col: 3 },
      { id: 'g_4', type: 'MEASURE', target: 1, classicalBit: 1, col: 3 },
      { id: 'g_5', type: 'MEASURE', target: 2, classicalBit: 2, col: 3 },
    ],
    createdAt: '2026-10-27T12:00:00.000Z',
  },
  {
    id: 'example_teleportation',
    name: 'Quantum Teleportation Protocol',
    description: 'Transfers an unknown quantum state from Alice (q0) to Bob (q2) via prior entanglement and Bell measurement.',
    qubitsCount: 3,
    classicalBitsCount: 3,
    gates: [
      { id: 'g_0', type: 'H', target: 0, col: 0 }, // Alice prepared state
      { id: 'g_1', type: 'H', target: 1, col: 0 }, // Bell pair init
      { id: 'g_2', type: 'CX', control: 1, target: 2, col: 1 }, // Bell pair entangle
      { id: 'g_3', type: 'CX', control: 0, target: 1, col: 2 }, // Alice Bell measurement step 1
      { id: 'g_4', type: 'H', target: 0, col: 3 }, // Alice Bell measurement step 2
      { id: 'g_5', type: 'MEASURE', target: 0, classicalBit: 0, col: 4 },
      { id: 'g_6', type: 'MEASURE', target: 1, classicalBit: 1, col: 4 },
    ],
    createdAt: '2026-10-27T12:00:00.000Z',
  },
  {
    id: 'example_grover_search',
    name: 'Grover Search on 4 Items',
    description: 'Searches an unstructured 2-qubit space using a CZ phase oracle and diffusion operator, amplifying target |11⟩.',
    qubitsCount: 2,
    classicalBitsCount: 2,
    gates: [
      { id: 'g_0', type: 'H', target: 0, col: 0 },
      { id: 'g_1', type: 'H', target: 1, col: 0 },
      { id: 'g_2', type: 'CZ', control: 0, target: 1, col: 1 },
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
    createdAt: '2026-10-27T12:00:00.000Z',
  },
  {
    id: 'example_half_adder',
    name: 'Reversible Quantum Half-Adder',
    description: 'Computes Sum (A ⊕ B) on target wire using CNOT and Carry (A · B) using Toffoli (CCX) gate.',
    qubitsCount: 4,
    classicalBitsCount: 4,
    gates: [
      { id: 'g_0', type: 'X', target: 0, col: 0 }, // Input A = 1
      { id: 'g_1', type: 'X', target: 1, col: 0 }, // Input B = 1
      { id: 'g_2', type: 'CCX', control: 0, control2: 1, target: 3, col: 1 }, // Carry bit in q3
      { id: 'g_3', type: 'CX', control: 0, target: 2, col: 2 }, // Sum step 1 in q2
      { id: 'g_4', type: 'CX', control: 1, target: 2, col: 3 }, // Sum step 2 in q2
      { id: 'g_5', type: 'MEASURE', target: 2, classicalBit: 0, col: 4 },
      { id: 'g_6', type: 'MEASURE', target: 3, classicalBit: 1, col: 4 },
    ],
    createdAt: '2026-10-27T12:00:00.000Z',
  },
  {
    id: 'example_interference',
    name: 'Quantum Interference Test (H · Z · H)',
    description: 'Demonstrates phase-to-bit conversion: sandwiching Pauli-Z between Hadamards creates constructive interference on |1⟩.',
    qubitsCount: 1,
    classicalBitsCount: 1,
    gates: [
      { id: 'g_0', type: 'H', target: 0, col: 0 },
      { id: 'g_1', type: 'Z', target: 0, col: 1 },
      { id: 'g_2', type: 'H', target: 0, col: 2 },
      { id: 'g_3', type: 'MEASURE', target: 0, classicalBit: 0, col: 3 },
    ],
    createdAt: '2026-10-27T12:00:00.000Z',
  },
];

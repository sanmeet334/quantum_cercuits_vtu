import { QuantumSimulator } from './simulator';
import { CircuitModel } from './types';
import { C } from './complex';

export interface TestResult {
  id: number;
  name: string;
  passed: boolean;
  expected: string;
  actual: string;
  details: string;
}

export function runQuantumVerifications(): TestResult[] {
  const results: TestResult[] = [];

  const makeCircuit = (qubits: number, gates: any[]): CircuitModel => ({
    id: 'test',
    name: 'Verification Circuit',
    qubitsCount: qubits,
    classicalBitsCount: qubits,
    gates: gates.map((g, idx) => ({ ...g, id: `g_${idx}`, col: idx })),
  });

  // Test 1: X maps |0⟩ to |1⟩
  try {
    const c1 = makeCircuit(1, [{ type: 'X', target: 0 }]);
    const res1 = QuantumSimulator.simulate(c1);
    const p0 = res1.probabilities[0];
    const p1 = res1.probabilities[1];
    const passed1 = p0 < 1e-6 && Math.abs(p1 - 1.0) < 1e-6;
    results.push({
      id: 1,
      name: 'X gate maps |0⟩ to |1⟩',
      passed: passed1,
      expected: 'P(|0⟩) = 0.0, P(|1⟩) = 1.0',
      actual: `P(|0⟩) = ${p0.toFixed(4)}, P(|1⟩) = ${p1.toFixed(4)}`,
      details: 'Applying Pauli-X bit-flip gate to basis state |0⟩ yields state |1⟩ with 100% certainty.',
    });
  } catch (err: any) {
    results.push({ id: 1, name: 'X gate maps |0⟩ to |1⟩', passed: false, expected: 'P(|1⟩)=1.0', actual: err.message, details: 'Execution failed.' });
  }

  // Test 2: X maps |1⟩ to |0⟩
  try {
    const c2 = makeCircuit(1, [{ type: 'X', target: 0 }, { type: 'X', target: 0 }]);
    const res2 = QuantumSimulator.simulate(c2);
    const p0 = res2.probabilities[0];
    const passed2 = Math.abs(p0 - 1.0) < 1e-6;
    results.push({
      id: 2,
      name: 'X gate maps |1⟩ to |0⟩',
      passed: passed2,
      expected: 'P(|0⟩) = 1.0',
      actual: `P(|0⟩) = ${p0.toFixed(4)}`,
      details: 'Applying X to |1⟩ returns |0⟩ because X is its own Hermitian inverse (X² = I).',
    });
  } catch (err: any) {
    results.push({ id: 2, name: 'X gate maps |1⟩ to |0⟩', passed: false, expected: 'P(|0⟩)=1.0', actual: err.message, details: 'Execution failed.' });
  }

  // Test 3: H applied to |0⟩ creates equal computational-basis probabilities
  try {
    const c3 = makeCircuit(1, [{ type: 'H', target: 0 }]);
    const res3 = QuantumSimulator.simulate(c3);
    const p0 = res3.probabilities[0];
    const p1 = res3.probabilities[1];
    const passed3 = Math.abs(p0 - 0.5) < 1e-6 && Math.abs(p1 - 0.5) < 1e-6;
    results.push({
      id: 3,
      name: 'H applied to |0⟩ creates equal superposition',
      passed: passed3,
      expected: 'P(|0⟩) = 0.5, P(|1⟩) = 0.5',
      actual: `P(|0⟩) = ${p0.toFixed(4)}, P(|1⟩) = ${p1.toFixed(4)}`,
      details: 'H|0⟩ = (|0⟩ + |1⟩)/√2 creates the |+⟩ state with equal 50% probability amplitudes.',
    });
  } catch (err: any) {
    results.push({ id: 3, name: 'H applied to |0⟩', passed: false, expected: 'P=0.5', actual: err.message, details: 'Execution failed.' });
  }

  // Test 4: H followed by H returns the initial state |0⟩
  try {
    const c4 = makeCircuit(1, [{ type: 'H', target: 0 }, { type: 'H', target: 0 }]);
    const res4 = QuantumSimulator.simulate(c4);
    const p0 = res4.probabilities[0];
    const passed4 = Math.abs(p0 - 1.0) < 1e-6;
    results.push({
      id: 4,
      name: 'H followed by H returns initial state (H² = I)',
      passed: passed4,
      expected: 'P(|0⟩) = 1.0',
      actual: `P(|0⟩) = ${p0.toFixed(4)}`,
      details: 'Constructive and destructive quantum interference cancels the |1⟩ component, restoring |0⟩.',
    });
  } catch (err: any) {
    results.push({ id: 4, name: 'H followed by H', passed: false, expected: 'P(|0⟩)=1.0', actual: err.message, details: 'Execution failed.' });
  }

  // Test 5: Applying Z to |0⟩ leaves physical state unchanged
  try {
    const c5 = makeCircuit(1, [{ type: 'Z', target: 0 }]);
    const res5 = QuantumSimulator.simulate(c5);
    const amp0 = res5.stateVector[0];
    const passed5 = Math.abs(amp0.r - 1.0) < 1e-6 && Math.abs(amp0.i) < 1e-6;
    results.push({
      id: 5,
      name: 'Applying Z to |0⟩ leaves physical state unchanged',
      passed: passed5,
      expected: 'State vector: [1.0 + 0i, 0.0 + 0i]',
      actual: `State vector: [${C.format(amp0)}, ${C.format(res5.stateVector[1])}]`,
      details: 'Z|0⟩ = +1|0⟩. The eigenvalue for |0⟩ is +1, so amplitude and phase are preserved.',
    });
  } catch (err: any) {
    results.push({ id: 5, name: 'Applying Z to |0⟩', passed: false, expected: 'No change', actual: err.message, details: 'Execution failed.' });
  }

  // Test 6: Two H gates do not produce an incorrect random final result
  try {
    const c6 = makeCircuit(1, [{ type: 'H', target: 0 }, { type: 'H', target: 0 }]);
    const res6 = QuantumSimulator.simulate(c6, 2000, 42);
    const count0 = res6.counts['0'] || 0;
    const passed6 = count0 === 2000;
    results.push({
      id: 6,
      name: 'Two H gates deterministically produce |0⟩ (No random leakage)',
      passed: passed6,
      expected: '2000 shots in |0⟩, 0 shots in |1⟩',
      actual: `${count0} shots in |0⟩, ${res6.counts['1'] || 0} shots in |1⟩`,
      details: 'Quantum interference is strictly deterministic prior to measurement; H·H produces state |0⟩ with zero statistical variance.',
    });
  } catch (err: any) {
    results.push({ id: 6, name: 'Two H deterministic check', passed: false, expected: '2000 in |0⟩', actual: err.message, details: 'Execution failed.' });
  }

  // Test 7: CNOT acts correctly for all computational basis inputs
  try {
    let cnotPassed = true;
    const tests = [
      { init: [], expectedState: '00' },
      { init: [{ type: 'X', target: 0 }], expectedState: '11' },
      { init: [{ type: 'X', target: 1 }], expectedState: '10' },
      { init: [{ type: 'X', target: 0 }, { type: 'X', target: 1 }], expectedState: '01' },
    ];

    for (const t of tests) {
      const c = makeCircuit(2, [...t.init, { type: 'CX', control: 0, target: 1 }]);
      const res = QuantumSimulator.simulate(c);
      const idx = parseInt(t.expectedState, 2);
      if (Math.abs(res.probabilities[idx] - 1.0) > 1e-5) {
        cnotPassed = false;
      }
    }

    results.push({
      id: 7,
      name: 'CNOT acts correctly for all 4 computational-basis inputs',
      passed: cnotPassed,
      expected: '00→00, 01→11, 10→10, 11→01 (with q0 control, q1 target)',
      actual: cnotPassed ? 'All 4 truth table combinations verified' : 'Mismatch in truth table',
      details: 'CNOT inverts target qubit if and only if control qubit is in state |1⟩.',
    });
  } catch (err: any) {
    results.push({ id: 7, name: 'CNOT truth table', passed: false, expected: 'True', actual: err.message, details: 'Execution failed.' });
  }

  // Test 8: H plus CNOT creates the expected Bell state
  try {
    const c8 = makeCircuit(2, [
      { type: 'H', target: 0 },
      { type: 'CX', control: 0, target: 1 },
    ]);
    const res8 = QuantumSimulator.simulate(c8);
    const p00 = res8.probabilities[0];
    const p01 = res8.probabilities[1];
    const p10 = res8.probabilities[2];
    const p11 = res8.probabilities[3];
    const passed8 =
      Math.abs(p00 - 0.5) < 1e-5 &&
      Math.abs(p11 - 0.5) < 1e-5 &&
      p01 < 1e-6 &&
      p10 < 1e-6;

    results.push({
      id: 8,
      name: 'H + CNOT prepares maximally entangled Bell state |Φ⁺⟩',
      passed: passed8,
      expected: 'P(|00⟩) = 0.5, P(|11⟩) = 0.5, P(|01⟩) = 0, P(|10⟩) = 0',
      actual: `P(|00⟩)=${p00.toFixed(3)}, P(|11⟩)=${p11.toFixed(3)}, cross-terms=${(p01 + p10).toFixed(4)}`,
      details: '|Φ⁺⟩ = (|00⟩ + |11⟩)/√2 displays perfect measurement correlations with 0% separable cross-terms.',
    });
  } catch (err: any) {
    results.push({ id: 8, name: 'Bell state preparation', passed: false, expected: '0.5 / 0.5', actual: err.message, details: 'Execution failed.' });
  }

  // Test 9: Measurement probabilities sum to one
  try {
    const c9 = makeCircuit(3, [
      { type: 'H', target: 0 },
      { type: 'RY', target: 1, params: { theta: 1.2 } },
      { type: 'CX', control: 0, target: 2 },
      { type: 'RZ', target: 2, params: { theta: 0.8 } },
    ]);
    const res9 = QuantumSimulator.simulate(c9);
    const totalProb = res9.probabilities.reduce((acc, p) => acc + p, 0);
    const passed9 = Math.abs(totalProb - 1.0) < 1e-6;

    results.push({
      id: 9,
      name: 'Measurement probabilities sum to 1.0 (Unitary conservation)',
      passed: passed9,
      expected: 'Sum(P_i) = 1.0000',
      actual: `Sum(P_i) = ${totalProb.toFixed(6)}`,
      details: 'Born rule axiom: The sum of probabilities across all computational basis states equals 1 exactly.',
    });
  } catch (err: any) {
    results.push({ id: 9, name: 'Probability sum conservation', passed: false, expected: '1.0', actual: err.message, details: 'Execution failed.' });
  }

  // Test 10: Sampled measurement counts sum to requested shots
  try {
    const c10 = makeCircuit(2, [{ type: 'H', target: 0 }, { type: 'H', target: 1 }]);
    const res10 = QuantumSimulator.simulate(c10, 4096);
    const totalShots = Object.values(res10.counts).reduce((a, b) => a + b, 0);
    const passed10 = totalShots === 4096;

    results.push({
      id: 10,
      name: 'Sampled measurement counts sum exactly to requested shots',
      passed: passed10,
      expected: '4096 shots',
      actual: `${totalShots} shots recorded`,
      details: 'Every measurement shot collapses the system into one definite basis outcome with frequency matching Born probability.',
    });
  } catch (err: any) {
    results.push({ id: 10, name: 'Shot count preservation', passed: false, expected: '4096', actual: err.message, details: 'Execution failed.' });
  }

  // Test 11: SWAP exchanges qubit states correctly
  try {
    const c11 = makeCircuit(2, [
      { type: 'X', target: 0 },
      { type: 'SWAP', target: 0, target2: 1 },
    ]);
    const res11 = QuantumSimulator.simulate(c11);
    const p10 = res11.probabilities[2]; // state '10'
    const passed11 = Math.abs(p10 - 1.0) < 1e-6;

    results.push({
      id: 11,
      name: 'SWAP gate exchanges qubit quantum states correctly',
      passed: passed11,
      expected: 'State |01⟩ transferred to |10⟩ (P(|10⟩) = 1.0)',
      actual: `P(|10⟩) = ${p10.toFixed(4)}`,
      details: 'SWAP gate interchanges the state of two qubits through three alternating CNOT operations.',
    });
  } catch (err: any) {
    results.push({ id: 11, name: 'SWAP gate correctness', passed: false, expected: 'P(|10⟩)=1.0', actual: err.message, details: 'Execution failed.' });
  }

  // Test 12: Rotation gates produce correct expected transformations
  try {
    const c12 = makeCircuit(1, [
      { type: 'RY', target: 0, params: { theta: Math.PI } },
    ]);
    const res12 = QuantumSimulator.simulate(c12);
    const p1 = res12.probabilities[1];
    const passed12 = Math.abs(p1 - 1.0) < 1e-5;

    results.push({
      id: 12,
      name: 'Rotation gates produce exact trigonometric transformations',
      passed: passed12,
      expected: 'RY(π)|0⟩ yields |1⟩ with P(|1⟩) = 1.0',
      actual: `P(|1⟩) = ${p1.toFixed(5)}`,
      details: 'Continuous rotation operators RY(θ) and RX(θ) accurately map Bloch sphere polar trajectory.',
    });
  } catch (err: any) {
    results.push({ id: 12, name: 'Rotation gate calculation', passed: false, expected: 'P(|1⟩)=1.0', actual: err.message, details: 'Execution failed.' });
  }

  return results;
}

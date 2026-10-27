import { CircuitGate, CircuitModel, DebugIssue, GateType } from './types';

export function parseQiskitCode(code: string): {
  circuit: CircuitModel | null;
  errors: string[];
  warnings: string[];
} {
  const errors: string[] = [];
  const warnings: string[] = [];

  let qubitsCount = 2;
  let classicalBitsCount = 2;
  const gates: CircuitGate[] = [];
  let colCounter = 0;

  const lines = code.split('\n');

  // Find QuantumCircuit initialization
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith('#') || trimmed.length === 0) continue;

    const initMatch = trimmed.match(/QuantumCircuit\s*\(\s*(\d+)(?:\s*,\s*(\d+))?\s*\)/);
    if (initMatch) {
      qubitsCount = Math.min(8, Math.max(1, parseInt(initMatch[1], 10)));
      if (initMatch[2]) {
        classicalBitsCount = Math.max(1, parseInt(initMatch[2], 10));
      }
      break;
    }
  }

  for (let lineIdx = 0; lineIdx < lines.length; lineIdx++) {
    const line = lines[lineIdx].trim();
    if (line.startsWith('#') || line.length === 0 || line.includes('QuantumCircuit(')) continue;

    // Single qubit standard: qc.h(0), qc.x(1), qc.z(0), etc.
    const singleMatch = line.match(/qc\.(h|x|y|z|s|sdg|t|tdg|sx|id)\s*\(\s*(\d+)\s*\)/i);
    if (singleMatch) {
      const rawGate = singleMatch[1].toUpperCase();
      let gateName: GateType = 'I';
      if (rawGate === 'ID' || rawGate === 'I') gateName = 'I';
      else if (rawGate === 'SDG') gateName = 'Sdg';
      else if (rawGate === 'TDG') gateName = 'Tdg';
      else gateName = rawGate as GateType;
      const target = parseInt(singleMatch[2], 10);
      if (target >= qubitsCount) {
        errors.push(`Line ${lineIdx + 1}: Target qubit index ${target} exceeds circuit limit (${qubitsCount} qubits).`);
      } else {
        gates.push({
          id: `p_${gates.length}_${Date.now()}`,
          type: gateName,
          target,
          col: colCounter++,
        });
      }
      continue;
    }

    // Rotations: qc.rx(angle, qubit), qc.ry(angle, qubit), qc.rz(angle, qubit)
    const rotMatch = line.match(/qc\.(rx|ry|rz)\s*\(\s*([-\d.e+*/]+|np\.pi(?:[/*]\d+)?)\s*,\s*(\d+)\s*\)/i);
    if (rotMatch) {
      const gateName = rotMatch[1].toUpperCase() as GateType;
      let thetaVal = 0;
      try {
        const raw = rotMatch[2].replace(/np\.pi/g, Math.PI.toString()).replace(/pi/g, Math.PI.toString());
        // Safe evaluation of simple math expression
        const clean = raw.replace(/[^0-9.+\-*/]/g, '');
        thetaVal = Function(`'use strict'; return (${clean})`)();
      } catch {
        thetaVal = Math.PI / 2;
      }
      const target = parseInt(rotMatch[3], 10);
      if (target >= qubitsCount) {
        errors.push(`Line ${lineIdx + 1}: Target qubit index ${target} exceeds circuit limit.`);
      } else {
        gates.push({
          id: `p_${gates.length}_${Date.now()}`,
          type: gateName,
          target,
          params: { theta: thetaVal },
          col: colCounter++,
        });
      }
      continue;
    }

    // 2-qubit gates: qc.cx(0, 1), qc.cz(0, 1), qc.swap(0, 1)
    const twoQubitMatch = line.match(/qc\.(cx|cz|swap)\s*\(\s*(\d+)\s*,\s*(\d+)\s*\)/i);
    if (twoQubitMatch) {
      const gType = twoQubitMatch[1].toUpperCase() as GateType;
      const qA = parseInt(twoQubitMatch[2], 10);
      const qB = parseInt(twoQubitMatch[3], 10);

      if (qA >= qubitsCount || qB >= qubitsCount) {
        errors.push(`Line ${lineIdx + 1}: Qubit indices (${qA}, ${qB}) exceed circuit limit.`);
      } else if (qA === qB) {
        warnings.push(`Line ${lineIdx + 1}: Gate ${gType} applied to same qubit for control and target.`);
      } else {
        if (gType === 'SWAP') {
          gates.push({
            id: `p_${gates.length}_${Date.now()}`,
            type: 'SWAP',
            target: qA,
            target2: qB,
            col: colCounter++,
          });
        } else {
          gates.push({
            id: `p_${gates.length}_${Date.now()}`,
            type: gType,
            control: qA,
            target: qB,
            col: colCounter++,
          });
        }
      }
      continue;
    }

    // 3-qubit gates: qc.ccx(0, 1, 2)
    const threeQubitMatch = line.match(/qc\.ccx\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/i);
    if (threeQubitMatch) {
      const c1 = parseInt(threeQubitMatch[1], 10);
      const c2 = parseInt(threeQubitMatch[2], 10);
      const tgt = parseInt(threeQubitMatch[3], 10);
      if (c1 >= qubitsCount || c2 >= qubitsCount || tgt >= qubitsCount) {
        errors.push(`Line ${lineIdx + 1}: CCX qubit indices exceed circuit limit.`);
      } else {
        gates.push({
          id: `p_${gates.length}_${Date.now()}`,
          type: 'CCX',
          control: c1,
          control2: c2,
          target: tgt,
          col: colCounter++,
        });
      }
      continue;
    }

    // Measurement: qc.measure(0, 0) or qc.measure_all()
    if (line.includes('qc.measure_all()')) {
      for (let q = 0; q < qubitsCount; q++) {
        gates.push({
          id: `p_${gates.length}_${Date.now()}`,
          type: 'MEASURE',
          target: q,
          classicalBit: q,
          col: colCounter,
        });
      }
      colCounter++;
      continue;
    }

    const measureMatch = line.match(/qc\.measure\s*\(\s*(\d+)\s*,\s*(\d+)\s*\)/i);
    if (measureMatch) {
      const q = parseInt(measureMatch[1], 10);
      const c = parseInt(measureMatch[2], 10);
      if (q >= qubitsCount) {
        errors.push(`Line ${lineIdx + 1}: Measured qubit ${q} exceeds circuit size.`);
      } else {
        gates.push({
          id: `p_${gates.length}_${Date.now()}`,
          type: 'MEASURE',
          target: q,
          classicalBit: c,
          col: colCounter++,
        });
      }
      continue;
    }

    // Unsupported or unknown statement
    if (line.startsWith('qc.')) {
      warnings.push(`Line ${lineIdx + 1}: Unsupported Qiskit operation '${line}'. Skipped.`);
    }
  }

  if (errors.length > 0) {
    return { circuit: null, errors, warnings };
  }

  const circuit: CircuitModel = {
    id: `parsed_${Date.now()}`,
    name: 'Imported Qiskit Circuit',
    description: 'Parsed from user-provided Qiskit source code',
    qubitsCount,
    classicalBitsCount,
    gates,
  };

  return { circuit, errors, warnings };
}

export function validateCircuit(
  circuit: CircuitModel,
  intendedGoal?: 'bell_state' | 'superposition' | 'inversion' | 'entangled_ghz'
): DebugIssue[] {
  const issues: DebugIssue[] = [];

  // 1. Check for empty circuit
  if (circuit.gates.length === 0) {
    issues.push({
      id: 'empty_circuit',
      title: 'Empty Circuit Canvas',
      severity: 'info',
      location: 'Circuit Studio',
      explanation: 'No quantum gates are placed on the circuit. State will remain trivial |00...0⟩.',
      suggestion: 'Place a Hadamard (H) or Pauli-X gate on qubit 0 to initiate quantum transformation.',
      fixable: false,
    });
    return issues;
  }

  // 2. Check for qubits with zero operations
  const usedQubits = new Set<number>();
  circuit.gates.forEach(g => {
    usedQubits.add(g.target);
    if (g.control !== undefined) usedQubits.add(g.control);
    if (g.control2 !== undefined) usedQubits.add(g.control2);
    if (g.target2 !== undefined) usedQubits.add(g.target2);
  });

  for (let q = 0; q < circuit.qubitsCount; q++) {
    if (!usedQubits.has(q)) {
      issues.push({
        id: `unused_qubit_${q}`,
        title: `Unused Qubit Wire q[${q}]`,
        severity: 'warning',
        location: `Wire q[${q}]`,
        explanation: `Qubit q[${q}] has no quantum gates or measurements connected. It stays in state |0⟩ throughout simulation.`,
        suggestion: `Remove unused qubit or add quantum operations if intended.`,
        fixable: false,
      });
    }
  }

  // 3. Check for multi-qubit gates connected to the same qubit
  circuit.gates.forEach((g, idx) => {
    if (g.control !== undefined && g.control === g.target) {
      issues.push({
        id: `same_control_target_${idx}`,
        title: `Invalid Self-Control on Gate ${g.type}`,
        severity: 'error',
        location: `Column ${g.col}, q[${g.target}]`,
        explanation: `Controlled gate ${g.type} has qubit ${g.target} assigned as both control and target. A qubit cannot control itself.`,
        suggestion: `Change the control qubit to a distinct wire or convert to a single-qubit gate.`,
        fixable: true,
      });
    }
  });

  // 4. Missing measurements warning for hardware simulation
  const hasMeasurement = circuit.gates.some(g => g.type === 'MEASURE');
  if (!hasMeasurement) {
    issues.push({
      id: 'missing_measurements',
      title: 'No Measurement Operations Placed',
      severity: 'info',
      location: 'Final Columns',
      explanation: 'The circuit produces an ideal statevector, but has no classical measurement gates for hardware shot acquisition.',
      suggestion: 'Add measurement operations to qubits if you wish to read out classical registers in Qiskit hardware runs.',
      fixable: true,
    });
  }

  // 5. Goal checks
  if (intendedGoal === 'bell_state') {
    const hasH = circuit.gates.some(g => g.type === 'H');
    const hasCX = circuit.gates.some(g => g.type === 'CX');
    if (!hasH || !hasCX) {
      issues.push({
        id: 'bell_state_mismatch',
        title: 'Goal Mismatch: Bell State Preparation',
        severity: 'warning',
        location: 'Overall Circuit',
        explanation: 'Creating a standard Bell state (|00⟩ + |11⟩)/√2 requires applying a Hadamard (H) gate to one qubit followed by a CNOT (CX) entangled with the second qubit.',
        suggestion: 'Place H on q[0] at column 0, then CNOT with control q[0] and target q[1] at column 1.',
        fixable: true,
      });
    }
  }

  if (intendedGoal === 'superposition') {
    const hasSuperpositionGate = circuit.gates.some(g => g.type === 'H' || g.type === 'RY' || g.type === 'RX');
    if (!hasSuperpositionGate) {
      issues.push({
        id: 'superposition_mismatch',
        title: 'Goal Mismatch: Superposition',
        severity: 'warning',
        location: 'Qubit 0',
        explanation: 'To prepare equal superposition from basis state |0⟩, apply a Hadamard (H) gate.',
        suggestion: 'Add a Hadamard gate at column 0 on target qubit 0.',
        fixable: true,
      });
    }
  }

  return issues;
}

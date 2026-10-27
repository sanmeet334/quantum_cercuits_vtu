import { Complex, CircuitGate, SimulationResult, CircuitModel, GateType } from './types';
import { C } from './complex';
import { getSingleQubitMatrix, Matrix2x2 } from './matrix';

export class QuantumSimulator {
  /**
   * Run simulation on a circuit model
   */
  public static simulate(
    circuit: CircuitModel,
    shots: number = 1024,
    randomSeed?: number
  ): SimulationResult {
    const startTime = performance.now();
    const n = Math.max(1, Math.min(circuit.qubitsCount, 8)); // clamp between 1 and 8 qubits
    const dim = 1 << n; // 2^n

    // Initialize state to |00...0>
    let state: Complex[] = new Array(dim);
    for (let i = 0; i < dim; i++) {
      state[i] = i === 0 ? C.one() : C.zero();
    }

    // Sort gates by column (time order), then target
    const sortedGates = [...circuit.gates].sort((a, b) => {
      if (a.col !== b.col) return a.col - b.col;
      return a.target - b.target;
    });

    // Apply gates sequentially
    for (const gate of sortedGates) {
      if (gate.type === 'MEASURE') {
        // Measurement in standard statevector does not alter pure evolution,
        // but classical registers record it.
        continue;
      }
      state = this.applyGate(state, gate, n);
    }

    // Normalize state vector to guard against floating point drift
    state = this.normalize(state);

    // Calculate probabilities
    const probabilities: number[] = new Array(dim);
    const basisStates: string[] = new Array(dim);
    for (let i = 0; i < dim; i++) {
      probabilities[i] = C.absSq(state[i]);
      basisStates[i] = i.toString(2).padStart(n, '0');
    }

    // Calculate measurement counts (shots)
    const counts = this.sampleShots(probabilities, basisStates, shots, randomSeed);

    // Calculate Bloch sphere vector for each qubit
    const blochSpheres = [];
    for (let q = 0; q < n; q++) {
      blochSpheres.push(this.calculateBlochVector(state, q, n));
    }

    const executionTimeMs = Number((performance.now() - startTime).toFixed(2));

    return {
      qubitsCount: n,
      stateVector: state,
      probabilities,
      basisStates,
      shots,
      counts,
      blochSpheres,
      executionTimeMs,
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Simulate step by step to allow the learner to view intermediate states
   */
  public static simulateSteps(circuit: CircuitModel): Array<{
    col: number;
    description: string;
    gate?: CircuitGate;
    state: Complex[];
    probabilities: number[];
  }> {
    const n = Math.max(1, Math.min(circuit.qubitsCount, 8));
    const dim = 1 << n;

    let state: Complex[] = new Array(dim);
    for (let i = 0; i < dim; i++) {
      state[i] = i === 0 ? C.one() : C.zero();
    }

    const steps: Array<{
      col: number;
      description: string;
      gate?: CircuitGate;
      state: Complex[];
      probabilities: number[];
    }> = [
      {
        col: -1,
        description: 'Initial State |0...0⟩',
        state: [...state],
        probabilities: state.map(c => C.absSq(c)),
      },
    ];

    const sortedGates = [...circuit.gates].sort((a, b) => a.col - b.col);
    const maxCol = sortedGates.length > 0 ? Math.max(...sortedGates.map(g => g.col)) : 0;

    for (let c = 0; c <= maxCol; c++) {
      const gatesAtCol = sortedGates.filter(g => g.col === c);
      if (gatesAtCol.length === 0) continue;

      for (const gate of gatesAtCol) {
        if (gate.type !== 'MEASURE') {
          state = this.applyGate(state, gate, n);
        }
      }
      state = this.normalize(state);

      const gateNames = gatesAtCol.map(g => `${g.type} on q[${g.target}]`).join(', ');
      steps.push({
        col: c,
        description: `Step ${c + 1}: ${gateNames}`,
        gate: gatesAtCol[0],
        state: [...state],
        probabilities: state.map(v => C.absSq(v)),
      });
    }

    return steps;
  }

  /**
   * Apply a single gate to the multi-qubit statevector
   */
  private static applyGate(state: Complex[], gate: CircuitGate, n: number): Complex[] {
    const { type, target, control, control2, target2, params } = gate;

    // Check bounds
    if (target >= n || (control !== undefined && control >= n)) {
      return state;
    }

    // Single-qubit unitary gates
    const singleQubitGates: GateType[] = [
      'I', 'X', 'Y', 'Z', 'H', 'S', 'Sdg', 'T', 'Tdg', 'SX', 'RX', 'RY', 'RZ', 'U3'
    ];

    if (singleQubitGates.includes(type) && control === undefined) {
      const mat = getSingleQubitMatrix(type, params);
      return this.apply1QubitMatrix(state, mat, target, n);
    }

    // Controlled 1-qubit gates
    if (type === 'CX' && control !== undefined) {
      return this.applyCX(state, control, target, n);
    }

    if (type === 'CZ' && control !== undefined) {
      return this.applyCZ(state, control, target, n);
    }

    if (type === 'CP' && control !== undefined) {
      const theta = params?.theta ?? Math.PI;
      return this.applyCP(state, control, target, theta, n);
    }

    if (type === 'CRX' && control !== undefined) {
      const mat = getSingleQubitMatrix('RX', params);
      return this.applyControlled1QubitMatrix(state, mat, control, target, n);
    }

    if (type === 'SWAP') {
      const t2 = target2 !== undefined ? target2 : (control !== undefined ? control : (target + 1) % n);
      return this.applySWAP(state, target, t2, n);
    }

    if (type === 'CCX' && control !== undefined && control2 !== undefined) {
      return this.applyToffoli(state, control, control2, target, n);
    }

    if (type === 'CSWAP' && control !== undefined && target2 !== undefined) {
      return this.applyCSWAP(state, control, target, target2, n);
    }

    return state;
  }

  /**
   * Apply 2x2 matrix to single target qubit
   */
  public static apply1QubitMatrix(
    state: Complex[],
    mat: Matrix2x2,
    target: number,
    n: number
  ): Complex[] {
    const dim = 1 << n;
    const newState = new Array<Complex>(dim);
    const targetMask = 1 << target;

    for (let k = 0; k < dim; k++) {
      if ((k & targetMask) === 0) {
        const k0 = k;
        const k1 = k | targetMask;

        const a0 = state[k0];
        const a1 = state[k1];

        // new_a0 = m00*a0 + m01*a1
        const term00 = C.mul(mat[0][0], a0);
        const term01 = C.mul(mat[0][1], a1);
        newState[k0] = C.add(term00, term01);

        // new_a1 = m10*a0 + m11*a1
        const term10 = C.mul(mat[1][0], a0);
        const term11 = C.mul(mat[1][1], a1);
        newState[k1] = C.add(term10, term11);
      }
    }

    return newState;
  }

  /**
   * Apply controlled 2x2 matrix
   */
  public static applyControlled1QubitMatrix(
    state: Complex[],
    mat: Matrix2x2,
    control: number,
    target: number,
    n: number
  ): Complex[] {
    const dim = 1 << n;
    const newState = [...state];
    const controlMask = 1 << control;
    const targetMask = 1 << target;

    for (let k = 0; k < dim; k++) {
      // Check if control bit is 1 and target bit is 0
      if ((k & controlMask) !== 0 && (k & targetMask) === 0) {
        const k0 = k;
        const k1 = k | targetMask;

        const a0 = state[k0];
        const a1 = state[k1];

        newState[k0] = C.add(C.mul(mat[0][0], a0), C.mul(mat[0][1], a1));
        newState[k1] = C.add(C.mul(mat[1][0], a0), C.mul(mat[1][1], a1));
      }
    }

    return newState;
  }

  /**
   * CNOT: Flip target qubit if control qubit is 1
   */
  private static applyCX(state: Complex[], control: number, target: number, n: number): Complex[] {
    const dim = 1 << n;
    const newState = new Array<Complex>(dim);
    const controlMask = 1 << control;
    const targetMask = 1 << target;

    for (let k = 0; k < dim; k++) {
      if ((k & controlMask) !== 0) {
        // Control bit is 1: flip target bit
        const flipped = k ^ targetMask;
        newState[k] = state[flipped];
      } else {
        // Control bit is 0: leave unchanged
        newState[k] = state[k];
      }
    }

    return newState;
  }

  /**
   * Controlled-Z: Multiply by -1 if both control and target are 1
   */
  private static applyCZ(state: Complex[], control: number, target: number, n: number): Complex[] {
    const dim = 1 << n;
    const newState = new Array<Complex>(dim);
    const controlMask = 1 << control;
    const targetMask = 1 << target;

    for (let k = 0; k < dim; k++) {
      if ((k & controlMask) !== 0 && (k & targetMask) !== 0) {
        newState[k] = C.create(-state[k].r, -state[k].i);
      } else {
        newState[k] = state[k];
      }
    }

    return newState;
  }

  /**
   * Controlled-Phase: Multiply by e^(i*theta) if both control and target are 1
   */
  private static applyCP(
    state: Complex[],
    control: number,
    target: number,
    theta: number,
    n: number
  ): Complex[] {
    const dim = 1 << n;
    const newState = new Array<Complex>(dim);
    const controlMask = 1 << control;
    const targetMask = 1 << target;
    const phaseFactor = C.expI(theta);

    for (let k = 0; k < dim; k++) {
      if ((k & controlMask) !== 0 && (k & targetMask) !== 0) {
        newState[k] = C.mul(state[k], phaseFactor);
      } else {
        newState[k] = state[k];
      }
    }

    return newState;
  }

  /**
   * SWAP: Exchange values of target1 and target2
   */
  private static applySWAP(state: Complex[], q1: number, q2: number, n: number): Complex[] {
    if (q1 === q2) return state;
    const dim = 1 << n;
    const newState = new Array<Complex>(dim);
    const mask1 = 1 << q1;
    const mask2 = 1 << q2;

    for (let k = 0; k < dim; k++) {
      const bit1 = (k & mask1) !== 0 ? 1 : 0;
      const bit2 = (k & mask2) !== 0 ? 1 : 0;

      if (bit1 !== bit2) {
        // Swap bits in index
        const swappedK = k ^ mask1 ^ mask2;
        newState[k] = state[swappedK];
      } else {
        newState[k] = state[k];
      }
    }

    return newState;
  }

  /**
   * Toffoli (CCX): Flip target if control1 and control2 are both 1
   */
  private static applyToffoli(
    state: Complex[],
    c1: number,
    c2: number,
    target: number,
    n: number
  ): Complex[] {
    const dim = 1 << n;
    const newState = new Array<Complex>(dim);
    const maskC1 = 1 << c1;
    const maskC2 = 1 << c2;
    const maskTarget = 1 << target;

    for (let k = 0; k < dim; k++) {
      if ((k & maskC1) !== 0 && (k & maskC2) !== 0) {
        const flipped = k ^ maskTarget;
        newState[k] = state[flipped];
      } else {
        newState[k] = state[k];
      }
    }

    return newState;
  }

  /**
   * Fredkin (CSWAP): Swap target1 and target2 if control is 1
   */
  private static applyCSWAP(
    state: Complex[],
    control: number,
    t1: number,
    t2: number,
    n: number
  ): Complex[] {
    const dim = 1 << n;
    const newState = new Array<Complex>(dim);
    const maskC = 1 << control;
    const maskT1 = 1 << t1;
    const maskT2 = 1 << t2;

    for (let k = 0; k < dim; k++) {
      if ((k & maskC) !== 0) {
        const bit1 = (k & maskT1) !== 0 ? 1 : 0;
        const bit2 = (k & maskT2) !== 0 ? 1 : 0;
        if (bit1 !== bit2) {
          const swapped = k ^ maskT1 ^ maskT2;
          newState[k] = state[swapped];
        } else {
          newState[k] = state[k];
        }
      } else {
        newState[k] = state[k];
      }
    }

    return newState;
  }

  /**
   * Calculate single qubit Bloch coordinates via partial trace density matrix
   */
  public static calculateBlochVector(
    state: Complex[],
    targetQubit: number,
    n: number
  ): { x: number; y: number; z: number; theta: number; phi: number } {
    const dim = 1 << n;
    const mask = 1 << targetQubit;

    let rho00 = 0;
    let rho11 = 0;
    let rho01_r = 0;
    let rho01_i = 0;

    for (let k = 0; k < dim; k++) {
      if ((k & mask) === 0) {
        const k0 = k;
        const k1 = k | mask;

        const a0 = state[k0];
        const a1 = state[k1];

        rho00 += C.absSq(a0);
        rho11 += C.absSq(a1);

        // rho01 = a0 * conj(a1)
        const term = C.mul(a0, C.conj(a1));
        rho01_r += term.r;
        rho01_i += term.i;
      }
    }

    // Bloch vector components:
    // x = 2 * Re(rho01)
    // y = -2 * Im(rho01) = 2 * Im(rho10)
    // z = rho00 - rho11
    const x = Number((2 * rho01_r).toFixed(4));
    const y = Number((-2 * rho01_i).toFixed(4));
    const z = Number((rho00 - rho11).toFixed(4));

    // Spherical angles
    // z = cos(theta) => theta = acos(z)
    // phi = atan2(y, x)
    const clampedZ = Math.max(-1, Math.min(1, z));
    const theta = Number(Math.acos(clampedZ).toFixed(4));
    const phi = Number(Math.atan2(y, x).toFixed(4));

    return { x, y, z, theta, phi };
  }

  /**
   * Sample measurement shots from theoretical probabilities
   */
  public static sampleShots(
    probabilities: number[],
    basisStates: string[],
    shots: number,
    seed?: number
  ): Record<string, number> {
    const counts: Record<string, number> = {};
    for (const b of basisStates) {
      counts[b] = 0;
    }

    if (shots <= 0) return counts;

    // Cumulative distribution
    const cdf: number[] = new Array(probabilities.length);
    let cumulative = 0;
    for (let i = 0; i < probabilities.length; i++) {
      cumulative += probabilities[i];
      cdf[i] = cumulative;
    }

    // Normalizing CDF in case sum != 1 due to tiny float rounding
    const totalWeight = cdf[cdf.length - 1];

    let random = seed !== undefined ? this.pseudoRandom(seed) : Math.random;

    for (let s = 0; s < shots; s++) {
      const r = random() * totalWeight;
      // Binary search for index
      let low = 0;
      let high = cdf.length - 1;
      let chosen = high;

      while (low <= high) {
        const mid = (low + high) >> 1;
        if (cdf[mid] >= r) {
          chosen = mid;
          high = mid - 1;
        } else {
          low = mid + 1;
        }
      }

      counts[basisStates[chosen]] = (counts[basisStates[chosen]] || 0) + 1;
    }

    return counts;
  }

  /**
   * Normalize state vector
   */
  private static normalize(state: Complex[]): Complex[] {
    let sumSq = 0;
    for (const c of state) {
      sumSq += C.absSq(c);
    }

    if (sumSq === 0) return state;
    const factor = 1 / Math.sqrt(sumSq);

    return state.map(c => C.scale(c, factor));
  }

  private static pseudoRandom(seed: number): () => number {
    let s = seed % 2147483647;
    if (s <= 0) s += 2147483646;
    return () => {
      s = (s * 16807) % 2147483647;
      return (s - 1) / 2147483646;
    };
  }
}

import { Complex, GateType } from './types';
import { C } from './complex';

export type Matrix2x2 = [
  [Complex, Complex],
  [Complex, Complex]
];

const INV_SQRT2 = 1 / Math.SQRT2;

export const I_MAT: Matrix2x2 = [
  [C.create(1, 0), C.create(0, 0)],
  [C.create(0, 0), C.create(1, 0)],
];

export const X_MAT: Matrix2x2 = [
  [C.create(0, 0), C.create(1, 0)],
  [C.create(1, 0), C.create(0, 0)],
];

export const Y_MAT: Matrix2x2 = [
  [C.create(0, 0), C.create(0, -1)],
  [C.create(0, 1), C.create(0, 0)],
];

export const Z_MAT: Matrix2x2 = [
  [C.create(1, 0), C.create(0, 0)],
  [C.create(0, 0), C.create(-1, 0)],
];

export const H_MAT: Matrix2x2 = [
  [C.create(INV_SQRT2, 0), C.create(INV_SQRT2, 0)],
  [C.create(INV_SQRT2, 0), C.create(-INV_SQRT2, 0)],
];

export const S_MAT: Matrix2x2 = [
  [C.create(1, 0), C.create(0, 0)],
  [C.create(0, 0), C.create(0, 1)],
];

export const SDG_MAT: Matrix2x2 = [
  [C.create(1, 0), C.create(0, 0)],
  [C.create(0, 0), C.create(0, -1)],
];

export const T_MAT: Matrix2x2 = [
  [C.create(1, 0), C.create(0, 0)],
  [C.create(0, 0), C.expI(Math.PI / 4)],
];

export const TDG_MAT: Matrix2x2 = [
  [C.create(1, 0), C.create(0, 0)],
  [C.create(0, 0), C.expI(-Math.PI / 4)],
];

// SX Gate: sqrt(X) = 1/2 * [[1+i, 1-i], [1-i, 1+i]]
export const SX_MAT: Matrix2x2 = [
  [C.create(0.5, 0.5), C.create(0.5, -0.5)],
  [C.create(0.5, -0.5), C.create(0.5, 0.5)],
];

export function rxMatrix(theta: number): Matrix2x2 {
  const half = theta / 2;
  const cos = Math.cos(half);
  const sin = Math.sin(half);
  return [
    [C.create(cos, 0), C.create(0, -sin)],
    [C.create(0, -sin), C.create(cos, 0)],
  ];
}

export function ryMatrix(theta: number): Matrix2x2 {
  const half = theta / 2;
  const cos = Math.cos(half);
  const sin = Math.sin(half);
  return [
    [C.create(cos, 0), C.create(-sin, 0)],
    [C.create(sin, 0), C.create(cos, 0)],
  ];
}

export function rzMatrix(theta: number): Matrix2x2 {
  const half = theta / 2;
  return [
    [C.expI(-half), C.create(0, 0)],
    [C.create(0, 0), C.expI(half)],
  ];
}

export function phaseMatrix(lambda: number): Matrix2x2 {
  return [
    [C.create(1, 0), C.create(0, 0)],
    [C.create(0, 0), C.expI(lambda)],
  ];
}

export function u3Matrix(theta: number, phi: number, lambda: number): Matrix2x2 {
  const half = theta / 2;
  const cos = Math.cos(half);
  const sin = Math.sin(half);

  const m00 = C.create(cos, 0);
  const m01 = C.scale(C.expI(lambda), -sin);
  const m10 = C.scale(C.expI(phi), sin);
  const m11 = C.scale(C.expI(phi + lambda), cos);

  return [
    [m00, m01],
    [m10, m11],
  ];
}

export function getSingleQubitMatrix(
  gate: GateType,
  params?: { theta?: number; phi?: number; lambda?: number }
): Matrix2x2 {
  const theta = params?.theta ?? Math.PI / 2;
  const phi = params?.phi ?? 0;
  const lambda = params?.lambda ?? 0;

  switch (gate) {
    case 'I':
      return I_MAT;
    case 'X':
      return X_MAT;
    case 'Y':
      return Y_MAT;
    case 'Z':
      return Z_MAT;
    case 'H':
      return H_MAT;
    case 'S':
      return S_MAT;
    case 'Sdg':
      return SDG_MAT;
    case 'T':
      return T_MAT;
    case 'Tdg':
      return TDG_MAT;
    case 'SX':
      return SX_MAT;
    case 'RX':
      return rxMatrix(theta);
    case 'RY':
      return ryMatrix(theta);
    case 'RZ':
      return rzMatrix(theta);
    case 'CP':
      return phaseMatrix(lambda || theta);
    case 'U3':
      return u3Matrix(theta, phi, lambda);
    default:
      return I_MAT;
  }
}

import { Complex } from './types';

export const C = {
  zero: (): Complex => ({ r: 0, i: 0 }),
  one: (): Complex => ({ r: 1, i: 0 }),
  i: (): Complex => ({ r: 0, i: 1 }),
  create: (r: number, i: number = 0): Complex => ({ r, i }),

  add: (a: Complex, b: Complex): Complex => ({
    r: a.r + b.r,
    i: a.i + b.i,
  }),

  sub: (a: Complex, b: Complex): Complex => ({
    r: a.r - b.r,
    i: a.i - b.i,
  }),

  mul: (a: Complex, b: Complex): Complex => ({
    r: a.r * b.r - a.i * b.i,
    i: a.r * b.i + a.i * b.r,
  }),

  scale: (a: Complex, s: number): Complex => ({
    r: a.r * s,
    i: a.i * s,
  }),

  conj: (a: Complex): Complex => ({
    r: a.r,
    i: -a.i,
  }),

  absSq: (a: Complex): number => {
    return a.r * a.r + a.i * a.i;
  },

  abs: (a: Complex): number => {
    return Math.sqrt(a.r * a.r + a.i * a.i);
  },

  expI: (theta: number): Complex => ({
    r: Math.cos(theta),
    i: Math.sin(theta),
  }),

  phase: (a: Complex): number => {
    return Math.atan2(a.i, a.r);
  },

  format: (a: Complex, precision: number = 3): string => {
    const r = Math.abs(a.r) < 1e-6 ? 0 : Number(a.r.toFixed(precision));
    const i = Math.abs(a.i) < 1e-6 ? 0 : Number(a.i.toFixed(precision));

    if (r === 0 && i === 0) return '0';
    if (i === 0) return `${r}`;
    if (r === 0) {
      if (i === 1) return 'i';
      if (i === -1) return '-i';
      return `${i}i`;
    }
    const sign = i > 0 ? '+' : '-';
    const absI = Math.abs(i);
    const iStr = absI === 1 ? 'i' : `${absI}i`;
    return `${r} ${sign} ${iStr}`;
  },
};

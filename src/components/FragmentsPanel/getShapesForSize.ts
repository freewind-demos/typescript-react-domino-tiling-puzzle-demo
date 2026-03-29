import { enumerateFixedPolyominoes } from './enumerateFixedPolyominoes';

/** 预计算，避免每次打开都枚举（仅中间栏形状库使用） */
const cache = new Map<number, [number, number][][]>();

export function getShapesForSize(n: number): [number, number][][] {
  if (!cache.has(n)) {
    cache.set(n, enumerateFixedPolyominoes(n));
  }
  return cache.get(n)!;
}

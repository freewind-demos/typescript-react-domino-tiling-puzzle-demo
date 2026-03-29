import { cellKey } from '../../Utils/cellKey';
import { normalizePolyomino } from './normalizePolyomino';

function polyKey(cells: [number, number][]): string {
  return normalizePolyomino(cells)
    .map((c) => `${c[0]},${c[1]}`)
    .join('|');
}

const NEI: [number, number][] = [
  [0, 1],
  [0, -1],
  [1, 0],
  [-1, 0],
];

/**
 * 枚举所有 **固定** n-格拼板（仅区分平移；旋转/翻面算不同形状，符合「只能平移」的题意）。
 * 从 (0,0) 生长，去重后返回归一化坐标。
 */
export function enumerateFixedPolyominoes(n: number): [number, number][][] {
  if (n <= 0) return [];
  const seen = new Set<string>();
  const out: [number, number][][] = [];

  function dfs(cells: [number, number][]) {
    if (cells.length === n) {
      const norm = normalizePolyomino(cells);
      const k = polyKey(norm);
      if (!seen.has(k)) {
        seen.add(k);
        out.push(norm);
      }
      return;
    }
    const cellSet = new Set(cells.map((c) => cellKey(c[0], c[1])));
    const frontier = new Set<string>();
    for (const [x, y] of cells) {
      for (const [dx, dy] of NEI) {
        const nx = x + dx;
        const ny = y + dy;
        const nk = cellKey(nx, ny);
        if (!cellSet.has(nk)) frontier.add(nk);
      }
    }
    for (const nk of frontier) {
      const [nx, ny] = nk.split(',').map(Number);
      dfs([...cells, [nx, ny] as [number, number]]);
    }
  }

  dfs([[0, 0]]);
  return out.sort((a, b) => polyKey(a).localeCompare(polyKey(b)));
}

/** 平移归一化到 min x、min y 为 0 */
export function normalizePolyomino(cells: [number, number][]): [number, number][] {
  if (cells.length === 0) return [];
  const minX = Math.min(...cells.map((c) => c[0]));
  const minY = Math.min(...cells.map((c) => c[1]));
  return cells
    .map(([x, y]) => [x - minX, y - minY] as [number, number])
    .sort((a, b) => a[0] - b[0] || a[1] - b[1]);
}

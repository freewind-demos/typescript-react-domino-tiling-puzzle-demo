/** 两格之间的网格线段（含端点），用于快速拖动时补全经过的格子 */
export function cellsBetween(ax: number, ay: number, bx: number, by: number): [number, number][] {
  const cells: [number, number][] = [];
  let x = ax;
  let y = ay;
  const dx = Math.abs(bx - ax);
  const dy = Math.abs(by - ay);
  const sx = ax < bx ? 1 : ax > bx ? -1 : 0;
  const sy = ay < by ? 1 : ay > by ? -1 : 0;
  let err = dx - dy;
  while (true) {
    cells.push([x, y]);
    if (x === bx && y === by) break;
    const e2 = 2 * err;
    if (e2 > -dy) {
      err -= dy;
      x += sx;
    }
    if (e2 < dx) {
      err += dx;
      y += sy;
    }
  }
  return cells;
}

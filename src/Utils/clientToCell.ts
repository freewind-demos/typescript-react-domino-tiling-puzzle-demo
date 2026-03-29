import { CELL_PX, GRID_GAP, GRID_HEIGHT, GRID_PAD, GRID_WIDTH } from './boardDimensions';

/** 与 App.css 中 .grid 的 padding、gap 一致，用于坐标命中 */
export function clientToCell(
  clientX: number,
  clientY: number,
  gridRect: DOMRect,
): { x: number; y: number } | null {
  const lx = clientX - gridRect.left - GRID_PAD;
  const ly = clientY - gridRect.top - GRID_PAD;
  const stride = CELL_PX + GRID_GAP;
  if (lx < 0 || ly < 0) return null;
  const col = Math.floor(lx / stride);
  const row = Math.floor(ly / stride);
  const remX = lx % stride;
  const remY = ly % stride;
  if (remX >= CELL_PX || remY >= CELL_PX) return null;
  if (col >= GRID_WIDTH || row >= GRID_HEIGHT) return null;
  return { x: col, y: row };
}

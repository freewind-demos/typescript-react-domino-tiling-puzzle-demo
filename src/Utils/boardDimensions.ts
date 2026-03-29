export const GRID_WIDTH = 8;
export const GRID_HEIGHT = 8;
export const CELL_PX = 30;
export const GRID_PAD = 2;
export const GRID_GAP = 2;

export const gridRows = Array.from({ length: GRID_HEIGHT }, (_, y) => y);
export const gridCols = Array.from({ length: GRID_WIDTH }, (_, x) => x);

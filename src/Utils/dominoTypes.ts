export interface Fragment {
  id: number;
  cells: [number, number][];
  offsetX: number;
  offsetY: number;
}

export interface Placement {
  offsetX: number;
  offsetY: number;
  usedCells: Set<string>;
}

export interface OriginalCell {
  x: number;
  y: number;
  key: string;
}

export interface SolveOutcome {
  success: boolean;
  message: string;
  elapsedMs: number;
  backtrackCount: number;
  maxDepth: number;
  placements: (Placement | null)[] | null;
}

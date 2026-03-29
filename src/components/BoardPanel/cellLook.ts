import type { CSSProperties } from 'react';
import { cellPlacementClass } from './cellPlacementClass';
import type { Fragment, Placement } from '../../Utils/dominoTypes';
import { FRAGMENT_PALETTE } from '../../Utils/fragmentPalette';

export function computeCellLook(args: {
  x: number;
  y: number;
  key: string;
  originalCells: Set<string>;
  fragments: Fragment[];
  solutionPlacements: (Placement | null)[] | null;
  selectedFragmentIndex: number;
}): { className: string; style?: CSSProperties } {
  const {
    x,
    y,
    key,
    originalCells,
    fragments,
    solutionPlacements,
    selectedFragmentIndex,
  } = args;

  if (solutionPlacements) {
    for (let fi = 0; fi < fragments.length; fi++) {
      const placement = solutionPlacements[fi];
      if (!placement) continue;
      const hasCell = fragments[fi]!.cells.some(
        (c) => c[0] + placement.offsetX === x && c[1] + placement.offsetY === y,
      );
      if (hasCell) {
        const color = FRAGMENT_PALETTE[fi % FRAGMENT_PALETTE.length];
        return {
          className: 'cell cell-solution',
          style: { backgroundColor: color },
        };
      }
    }
  }

  const kind = cellPlacementClass(
    x,
    y,
    key,
    originalCells,
    fragments,
    solutionPlacements,
    selectedFragmentIndex,
  );
  const className = kind === '' ? 'cell' : `cell ${kind}`;
  return { className };
}

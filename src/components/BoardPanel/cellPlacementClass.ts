import type { Fragment, Placement } from '../../Utils/dominoTypes';

export function cellPlacementClass(
  x: number,
  y: number,
  key: string,
  originalCells: Set<string>,
  fragments: Fragment[],
  placements: (Placement | null)[] | null,
  selectedFragmentIndex: number,
): 'filled' | 'selected' | 'placed' | '' {
  if (!originalCells.has(key)) {
    return '';
  }

  if (placements) {
    for (let fi = 0; fi < fragments.length; fi++) {
      const placement = placements[fi];
      if (!placement) continue;
      const hasCell = fragments[fi]!.cells.some(
        (c) => c[0] + placement.offsetX === x && c[1] + placement.offsetY === y,
      );
      if (hasCell) {
        return 'placed';
      }
    }
  }

  if (selectedFragmentIndex >= 0) {
    const fragment = fragments[selectedFragmentIndex];
    if (fragment?.cells.some((c) => c[0] === x && c[1] === y)) {
      return 'selected';
    }
  }

  return 'filled';
}

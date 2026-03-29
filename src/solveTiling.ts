/**
 * Demo 核心：判断给定碎块能否仅通过平移无重叠铺满题目区域（覆盖判定 + 回溯求解）。
 * 与 UI 解耦，固定放在 `src/` 根目录。
 */
import { cellKey } from './Utils/cellKey';
import type { Fragment, OriginalCell, Placement, SolveOutcome } from './Utils/dominoTypes';

function canPlace(
  fragment: Fragment,
  offsetX: number,
  offsetY: number,
  originalCells: Set<string>,
  placements: (Placement | null)[],
  currentIdx: number,
  indices: number[],
): boolean {
  for (const cell of fragment.cells) {
    const x = cell[0] + offsetX;
    const y = cell[1] + offsetY;
    const key = cellKey(x, y);

    if (!originalCells.has(key)) {
      return false;
    }

    for (let i = 0; i < currentIdx; i++) {
      const prevFragIdx = indices[i]!;
      const placement = placements[prevFragIdx];
      if (placement?.usedCells.has(key)) {
        return false;
      }
    }
  }

  return true;
}

function backtrack(
  indices: number[],
  idx: number,
  originalArray: OriginalCell[],
  placements: (Placement | null)[],
  fragments: Fragment[],
  originalCells: Set<string>,
  stats: { backtrackCount: number; maxDepth: number },
  progressCallback: (count: number, depth: number) => void,
): boolean {
  stats.backtrackCount++;
  stats.maxDepth = Math.max(stats.maxDepth, idx);

  if (idx >= indices.length) {
    return true;
  }

  const fragIdx = indices[idx]!;
  const fragment = fragments[fragIdx]!;

  const xs = fragment.cells.map((c) => c[0]);
  const ys = fragment.cells.map((c) => c[1]);
  const fragMinX = Math.min(...xs);
  const fragMinY = Math.min(...ys);

  for (const cell of originalArray) {
    const offsetX = cell.x - fragMinX;
    const offsetY = cell.y - fragMinY;

    if (
      canPlace(fragment, offsetX, offsetY, originalCells, placements, idx, indices)
    ) {
      const usedCells = new Set<string>();
      fragment.cells.forEach((c) => {
        usedCells.add(cellKey(c[0] + offsetX, c[1] + offsetY));
      });
      placements[fragIdx] = { offsetX, offsetY, usedCells };

      if (
        backtrack(
          indices,
          idx + 1,
          originalArray,
          placements,
          fragments,
          originalCells,
          stats,
          progressCallback,
        )
      ) {
        return true;
      }

      placements[fragIdx] = null;
    }
  }

  if (stats.backtrackCount % 100 === 0) {
    progressCallback(stats.backtrackCount, idx);
  }

  return false;
}

export function solveTiling(
  originalCells: Set<string>,
  fragments: Fragment[],
  onProgress: (count: number, depth: number) => void,
): SolveOutcome {
  if (originalCells.size === 0) {
    return {
      success: false,
      message: '请先绘制原始形状',
      elapsedMs: 0,
      backtrackCount: 0,
      maxDepth: 0,
      placements: null,
    };
  }

  if (fragments.length === 0) {
    return {
      success: false,
      message: '请先生成碎块',
      elapsedMs: 0,
      backtrackCount: 0,
      maxDepth: 0,
      placements: null,
    };
  }

  const totalFragmentCells = fragments.reduce((sum, f) => sum + f.cells.length, 0);
  if (totalFragmentCells !== originalCells.size) {
    return {
      success: false,
      message: `面积不匹配: 原始${originalCells.size} vs 碎块${totalFragmentCells}`,
      elapsedMs: 0,
      backtrackCount: 0,
      maxDepth: 0,
      placements: null,
    };
  }

  const originalArray: OriginalCell[] = Array.from(originalCells).map((key) => {
    const [x, y] = key.split(',').map(Number);
    return { x, y, key };
  });

  const sortedIndices = fragments
    .map((_, i) => i)
    .sort((a, b) => fragments[b]!.cells.length - fragments[a]!.cells.length);

  const placements: (Placement | null)[] = new Array(fragments.length).fill(null);

  const stats = { backtrackCount: 0, maxDepth: 0 };
  const startTime = performance.now();
  const success = backtrack(
    sortedIndices,
    0,
    originalArray,
    placements,
    fragments,
    originalCells,
    stats,
    onProgress,
  );
  const elapsed = performance.now() - startTime;

  if (success) {
    return {
      success: true,
      message: `成功! 用时${elapsed.toFixed(1)}ms, 回溯${stats.backtrackCount}次`,
      elapsedMs: elapsed,
      backtrackCount: stats.backtrackCount,
      maxDepth: stats.maxDepth,
      placements: [...placements],
    };
  }

  return {
    success: false,
    message: `失败! 用时${elapsed.toFixed(1)}ms, 回溯${stats.backtrackCount}次`,
    elapsedMs: elapsed,
    backtrackCount: stats.backtrackCount,
    maxDepth: stats.maxDepth,
    placements: null,
  };
}

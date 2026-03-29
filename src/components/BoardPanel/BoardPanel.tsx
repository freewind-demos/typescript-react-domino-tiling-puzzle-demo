import { cellKey } from '../../Utils/cellKey';
import type { Fragment, Placement } from '../../Utils/dominoTypes';
import {
  CELL_PX,
  GRID_WIDTH,
  gridCols,
  gridRows,
} from '../../Utils/boardDimensions';
import { computeCellLook } from './cellLook';

type BoardPanelProps = {
  originalCells: Set<string>;
  fragments: Fragment[];
  solutionPlacements: (Placement | null)[] | null;
  selectedFragmentIndex: number;
  onPointerDown: (e: React.PointerEvent<HTMLDivElement>) => void;
  onPointerMove: (e: React.PointerEvent<HTMLDivElement>) => void;
  onPointerUp: (e: React.PointerEvent<HTMLDivElement>) => void;
  onClearOriginal: () => void;
};

export function BoardPanel({
  originalCells,
  fragments,
  solutionPlacements,
  selectedFragmentIndex,
  onPointerDown,
  onPointerMove,
  onPointerUp,
  onClearOriginal,
}: BoardPanelProps) {
  return (
    <section className="panel panel--board" aria-label="棋盘">
      <h2>题目区域</h2>
      <div className="grid-container">
        <div
          className="grid board-grid"
          style={{ gridTemplateColumns: `repeat(${GRID_WIDTH}, ${CELL_PX}px)` }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
        >
          {gridRows.flatMap((y) =>
            gridCols.map((x) => {
              const key = cellKey(x, y);
              const { className, style } = computeCellLook({
                x,
                y,
                key,
                originalCells,
                fragments,
                solutionPlacements,
                selectedFragmentIndex,
              });
              return <div key={key} className={className} style={style} />;
            }),
          )}
        </div>
      </div>
      <div className="controls">
        <button type="button" className="btn-danger" onClick={onClearOriginal}>
          清空
        </button>
      </div>
      <p className="help-text">
        单击一格：无则画上，有则擦掉。按住左键拖动可连续铺色（快速划过也会自动补全经过的格子）。
      </p>
    </section>
  );
}

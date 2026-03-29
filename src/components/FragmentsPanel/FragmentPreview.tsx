import type { ReactElement } from 'react';
import type { Fragment } from '../../Utils/dominoTypes';

export function FragmentPreview({
  fragment,
  color,
  selected,
  onSelect,
}: {
  fragment: Fragment;
  color: string;
  selected: boolean;
  onSelect: () => void;
}) {
  const xs = fragment.cells.map((c) => c[0]);
  const ys = fragment.cells.map((c) => c[1]);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);
  const width = maxX - minX + 1;

  const cells: ReactElement[] = [];
  for (let y = minY; y <= maxY; y++) {
    for (let x = minX; x <= maxX; x++) {
      const hasCell = fragment.cells.some((c) => c[0] === x && c[1] === y);
      cells.push(
        <div
          key={`${x},${y}`}
          className={`fragment-cell${hasCell ? '' : ' empty'}`}
          style={hasCell ? { background: color } : undefined}
        />,
      );
    }
  }

  return (
    <div
      className={`fragment${selected ? ' selected' : ''}`}
      onClick={onSelect}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect();
        }
      }}
      role="button"
      tabIndex={0}
    >
      <div
        className="fragment-grid"
        style={{ gridTemplateColumns: `repeat(${width}, 20px)` }}
      >
        {cells}
      </div>
    </div>
  );
}

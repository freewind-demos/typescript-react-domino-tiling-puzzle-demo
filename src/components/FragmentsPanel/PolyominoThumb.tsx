import type { ReactElement } from 'react';

export function PolyominoThumb({ cells }: { cells: [number, number][] }) {
  const xs = cells.map((c) => c[0]);
  const ys = cells.map((c) => c[1]);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);
  const w = maxX - minX + 1;
  const px = 10;

  const out: ReactElement[] = [];
  for (let y = minY; y <= maxY; y++) {
    for (let x = minX; x <= maxX; x++) {
      const on = cells.some((c) => c[0] === x && c[1] === y);
      out.push(
        <div
          key={`${x},${y}`}
          className={`thumb-cell${on ? '' : ' empty'}`}
          style={{ width: px, height: px }}
        />,
      );
    }
  }

  return (
    <div
      className="thumb-grid"
      style={{
        gridTemplateColumns: `repeat(${w}, ${px}px)`,
        display: 'grid',
        gap: 1,
      }}
    >
      {out}
    </div>
  );
}

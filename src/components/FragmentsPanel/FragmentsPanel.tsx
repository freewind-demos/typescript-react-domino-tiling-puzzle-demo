import type { Fragment } from '../../Utils/dominoTypes';
import { FRAGMENT_PALETTE } from '../../Utils/fragmentPalette';
import { FragmentPreview } from './FragmentPreview';
import { PolyominoThumb } from './PolyominoThumb';
import { SIZE_OPTIONS } from './sizeOptions';

type FragmentsPanelProps = {
  statOriginal: number;
  statCells: number;
  cellBudgetRemaining: number;
  pickerSize: number | null;
  onPickerSizeChange: (size: number | null) => void;
  shapesForPicker: [number, number][][];
  fragments: Fragment[];
  selectedFragmentIndex: number;
  onAddFragmentShape: (cells: [number, number][]) => void;
  onRemoveFragmentAt: (index: number) => void;
  onSelectFragment: (index: number) => void;
  backtrackInfoVisible: boolean;
  backtrackInfoText: string;
  onClearFragments: () => void;
};

export function FragmentsPanel({
  statOriginal,
  statCells,
  cellBudgetRemaining,
  pickerSize,
  onPickerSizeChange,
  shapesForPicker,
  fragments,
  selectedFragmentIndex,
  onAddFragmentShape,
  onRemoveFragmentAt,
  onSelectFragment,
  backtrackInfoVisible,
  backtrackInfoText,
  onClearFragments,
}: FragmentsPanelProps) {
  return (
    <section className="panel panel--builder" aria-label="碎块">
      <h2>碎块</h2>

      {statOriginal === 0 ? (
        <p className="budget-hint budget-hint--muted">先画左侧题目。</p>
      ) : (
        <div
          className={`budget-hint budget-hint--ratio${
            cellBudgetRemaining > 0
              ? ' budget-hint--short'
              : cellBudgetRemaining === 0
                ? ' budget-hint--match'
                : ' budget-hint--over'
          }`}
          title="碎块总格数 / 题目格数"
        >
          <span className="budget-hint-fraction">
            {statCells}/{statOriginal}
          </span>
        </div>
      )}

      <div className="builder-block">
        <div className="builder-label">1. 选格子数</div>
        <div className="size-chips">
          {SIZE_OPTIONS.map((n) => (
            <button
              key={n}
              type="button"
              className={`size-chip${pickerSize === n ? ' active' : ''}`}
              onClick={() => onPickerSizeChange(pickerSize === n ? null : n)}
            >
              {n} 格
            </button>
          ))}
        </div>
      </div>

      {pickerSize !== null && (
        <div className="builder-block">
          <div className="builder-label">
            2. 点选一个形状（共 {shapesForPicker.length} 种），加入列表
          </div>
          <div className="shape-gallery">
            {shapesForPicker.map((cells, idx) => (
              <button
                key={`${pickerSize}-${idx}`}
                type="button"
                className="shape-gallery-item"
                onClick={() => onAddFragmentShape(cells)}
                title="点击加入"
              >
                <PolyominoThumb cells={cells} />
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="builder-block">
        <div className="builder-label">已添加的碎块（可点选高亮）</div>
        <div className="fragment-list">
          {fragments.length === 0 ? (
            <p className="panel-muted fragment-list-empty">尚未添加碎块，请先在上方选格子数并点形状</p>
          ) : (
            fragments.map((fragment, index) => (
              <div key={fragment.id} className="fragment-list-item">
                <FragmentPreview
                  fragment={fragment}
                  color={FRAGMENT_PALETTE[index % FRAGMENT_PALETTE.length]}
                  selected={index === selectedFragmentIndex}
                  onSelect={() => onSelectFragment(index)}
                />
                <button
                  type="button"
                  className="btn-danger btn-tiny"
                  onClick={() => onRemoveFragmentAt(index)}
                >
                  移除
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      <div className={`backtrack-info${backtrackInfoVisible ? ' visible' : ''}`}>
        {backtrackInfoText}
      </div>

      <div className="builder-clear-footer">
        <button type="button" className="btn-danger btn-tiny" onClick={onClearFragments}>
          清除
        </button>
      </div>
    </section>
  );
}

import {
  useCallback,
  useMemo,
  useRef,
  useState,
} from 'react';
import { cellKey } from '../../Utils/cellKey';
import type { Fragment, Placement } from '../../Utils/dominoTypes';
import { getShapesForSize } from '../FragmentsPanel/getShapesForSize';
import { solveTiling } from '../../solveTiling';
import { BoardPanel } from '../BoardPanel/BoardPanel';
import { cellsBetween } from '../../Utils/cellsBetween';
import { clientToCell } from '../../Utils/clientToCell';
import { FragmentsPanel } from '../FragmentsPanel/FragmentsPanel';
import { ResultPanel } from '../ResultPanel/ResultPanel';
import './App.css';

export function App() {
  const [originalCells, setOriginalCells] = useState<Set<string>>(() => new Set());
  const [fragmentDefs, setFragmentDefs] = useState<Fragment[]>([]);
  const [pickerSize, setPickerSize] = useState<number | null>(null);
  const [selectedFragmentIndex, setSelectedFragmentIndex] = useState(-1);

  const [resultIcon, setResultIcon] = useState('?');
  const [resultIconColor, setResultIconColor] = useState('#666');
  const [resultText, setResultText] = useState('等待判断');
  const [resultClass, setResultClass] = useState('result-text');

  const [solutionPlacements, setSolutionPlacements] = useState<(Placement | null)[] | null>(
    null,
  );
  const [backtrackInfoVisible, setBacktrackInfoVisible] = useState(false);
  const [backtrackInfoText, setBacktrackInfoText] = useState('');

  const isPaintingRef = useRef(false);
  const lastCellRef = useRef<{ x: number; y: number } | null>(null);
  const dragStartCellRef = useRef<{ x: number; y: number } | null>(null);
  const hasDraggedRef = useRef(false);
  /** 按下时该格是否已在题目中（用于抬起时单击擦除；空格已在按下时画上） */
  const clickStartedFilledRef = useRef(false);
  const originalCellsRef = useRef(originalCells);
  originalCellsRef.current = originalCells;

  const fragments = useMemo(
    () =>
      fragmentDefs.map((f, i) => ({
        ...f,
        id: i,
      })),
    [fragmentDefs],
  );

  const clearResult = useCallback(() => {
    setResultIcon('?');
    setResultIconColor('#666');
    setResultText('等待判断');
    setResultClass('result-text');
    setBacktrackInfoVisible(false);
    setSolutionPlacements(null);
  }, []);

  /** 拖动时沿路铺色（只加不删） */
  const paintShapeCellAdd = useCallback(
    (x: number, y: number, shouldClearResult: boolean) => {
      setOriginalCells((prev) => {
        const next = new Set(prev);
        next.add(cellKey(x, y));
        return next;
      });
      if (shouldClearResult) clearResult();
    },
    [clearResult],
  );

  /** 单击抬起时擦除已存在的格子 */
  const removeShapeCell = useCallback(
    (x: number, y: number) => {
      const key = cellKey(x, y);
      setOriginalCells((prev) => {
        const next = new Set(prev);
        next.delete(key);
        return next;
      });
      clearResult();
    },
    [clearResult],
  );

  const clearOriginal = useCallback(() => {
    setOriginalCells(new Set());
    clearResult();
  }, [clearResult]);

  const addFragmentShape = useCallback(
    (cells: [number, number][]) => {
      if (cells.length === 0) return;
      setFragmentDefs((prev) => [
        ...prev,
        {
          id: prev.length,
          cells: [...cells],
          offsetX: 0,
          offsetY: 0,
        },
      ]);
      setSelectedFragmentIndex(-1);
      clearResult();
    },
    [clearResult],
  );

  const removeFragmentAt = useCallback(
    (index: number) => {
      setFragmentDefs((prev) => prev.filter((_, i) => i !== index));
      setSelectedFragmentIndex((s) => (s === index ? -1 : s > index ? s - 1 : s));
      clearResult();
    },
    [clearResult],
  );

  const clearFragments = useCallback(() => {
    setFragmentDefs([]);
    setSelectedFragmentIndex(-1);
    setPickerSize(null);
    clearResult();
  }, [clearResult]);

  const onBoardPointerDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (e.button !== 0) return;
      e.preventDefault();
      const cell = clientToCell(e.clientX, e.clientY, e.currentTarget.getBoundingClientRect());
      if (!cell) return;
      const key = cellKey(cell.x, cell.y);
      const wasFilled = originalCellsRef.current.has(key);
      clickStartedFilledRef.current = wasFilled;
      clearResult();
      isPaintingRef.current = true;
      dragStartCellRef.current = cell;
      lastCellRef.current = cell;
      hasDraggedRef.current = false;
      if (!wasFilled) {
        paintShapeCellAdd(cell.x, cell.y, false);
      }
      e.currentTarget.setPointerCapture(e.pointerId);
    },
    [clearResult, paintShapeCellAdd],
  );

  const onBoardPointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!isPaintingRef.current) return;
      const cell = clientToCell(e.clientX, e.clientY, e.currentTarget.getBoundingClientRect());
      if (!cell) return;
      const start = dragStartCellRef.current;
      if (!start) return;
      if (cell.x !== start.x || cell.y !== start.y) {
        hasDraggedRef.current = true;
      }
      const last = lastCellRef.current;
      if (last && last.x === cell.x && last.y === cell.y) return;
      const segment =
        last === null
          ? ([[cell.x, cell.y]] as [number, number][])
          : cellsBetween(last.x, last.y, cell.x, cell.y);
      for (const [cx, cy] of segment) {
        paintShapeCellAdd(cx, cy, false);
      }
      lastCellRef.current = cell;
    },
    [paintShapeCellAdd],
  );

  const onBoardPointerUp = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (isPaintingRef.current && !hasDraggedRef.current && dragStartCellRef.current) {
        const c = dragStartCellRef.current;
        if (clickStartedFilledRef.current) {
          removeShapeCell(c.x, c.y);
        }
      }
      isPaintingRef.current = false;
      lastCellRef.current = null;
      dragStartCellRef.current = null;
      hasDraggedRef.current = false;
      try {
        e.currentTarget.releasePointerCapture(e.pointerId);
      } catch {
        /* already released */
      }
    },
    [removeShapeCell],
  );

  const runSolve = useCallback(() => {
    if (originalCells.size === 0) {
      setResultIcon('✗');
      setResultIconColor('#e94560');
      setResultText('请先在左侧棋盘绘制题目区域');
      setResultClass('result-text result-fail');
      setSolutionPlacements(null);
      return;
    }

    if (fragments.length === 0) {
      setResultIcon('✗');
      setResultIconColor('#e94560');
      setResultText('请在中间栏添加至少一块碎块');
      setResultClass('result-text result-fail');
      setSolutionPlacements(null);
      return;
    }

    const totalCells = fragments.reduce((s, f) => s + f.cells.length, 0);
    if (totalCells !== originalCells.size) {
      setResultIcon('✗');
      setResultIconColor('#e94560');
      setResultText(
        `格子数不一致：题目 ${originalCells.size} 格，碎块合计 ${totalCells} 格`,
      );
      setResultClass('result-text result-fail');
      setSolutionPlacements(null);
      return;
    }

    setBacktrackInfoVisible(true);
    setBacktrackInfoText('搜索中...');

    const outcome = solveTiling(originalCells, fragments, (count, depth) => {
      setBacktrackInfoText(`搜索中... 已回溯${count}次, 深度${depth}`);
    });

    if (outcome.success) {
      setResultIcon('✓');
      setResultIconColor('#4ecca3');
      setResultText(outcome.message);
      setResultClass('result-text result-success');
      setSolutionPlacements(outcome.placements);
    } else {
      setResultIcon('✗');
      setResultIconColor('#e94560');
      setResultText(outcome.message);
      setResultClass('result-text result-fail');
      setSolutionPlacements(null);
    }
  }, [originalCells, fragments]);

  const selectFragment = useCallback((index: number) => {
    setSelectedFragmentIndex(index);
  }, []);

  const statOriginal = originalCells.size;
  const statFragmentCount = fragments.length;
  const statCells = fragments.reduce((sum, f) => sum + f.cells.length, 0);
  const cellBudgetRemaining = statOriginal - statCells;

  const shapesForPicker = pickerSize !== null ? getShapesForSize(pickerSize) : [];

  return (
    <>
      <h1>骨牌平铺问题</h1>
      <p className="description">
        左：画题目区域；中：选格子数 → 点形状加入碎块列表；右：判断。
      </p>

      <div className="layout-three">
        <BoardPanel
          originalCells={originalCells}
          fragments={fragments}
          solutionPlacements={solutionPlacements}
          selectedFragmentIndex={selectedFragmentIndex}
          onPointerDown={onBoardPointerDown}
          onPointerMove={onBoardPointerMove}
          onPointerUp={onBoardPointerUp}
          onClearOriginal={clearOriginal}
        />

        <FragmentsPanel
          statOriginal={statOriginal}
          statCells={statCells}
          cellBudgetRemaining={cellBudgetRemaining}
          pickerSize={pickerSize}
          onPickerSizeChange={setPickerSize}
          shapesForPicker={shapesForPicker}
          fragments={fragments}
          selectedFragmentIndex={selectedFragmentIndex}
          onAddFragmentShape={addFragmentShape}
          onRemoveFragmentAt={removeFragmentAt}
          onSelectFragment={selectFragment}
          backtrackInfoVisible={backtrackInfoVisible}
          backtrackInfoText={backtrackInfoText}
          onClearFragments={clearFragments}
        />

        <ResultPanel
          resultIcon={resultIcon}
          resultIconColor={resultIconColor}
          resultText={resultText}
          resultClass={resultClass}
          statOriginal={statOriginal}
          statFragmentCount={statFragmentCount}
          statCells={statCells}
          onRunSolve={runSolve}
        />
      </div>
    </>
  );
}

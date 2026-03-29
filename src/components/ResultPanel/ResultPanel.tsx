type ResultPanelProps = {
  resultIcon: string;
  resultIconColor: string;
  resultText: string;
  resultClass: string;
  statOriginal: number;
  statFragmentCount: number;
  statCells: number;
  onRunSolve: () => void;
};

export function ResultPanel({
  resultIcon,
  resultIconColor,
  resultText,
  resultClass,
  statOriginal,
  statFragmentCount,
  statCells,
  onRunSolve,
}: ResultPanelProps) {
  return (
    <section className="panel panel--result result-panel" aria-label="结果">
      <h2>结果</h2>
      <div className="result-icon" style={{ color: resultIconColor }}>
        {resultIcon}
      </div>
      <div className={resultClass}>{resultText}</div>
      <div className="stats">
        <div>
          题目格子: <span>{statOriginal}</span>
        </div>
        <div>
          碎块块数: <span>{statFragmentCount}</span>
        </div>
        <div>
          碎块总格: <span>{statCells}</span>
        </div>
      </div>
      <div className="controls" style={{ marginTop: 20, justifyContent: 'center' }}>
        <button type="button" className="btn-secondary" onClick={onRunSolve}>
          开始判断
        </button>
      </div>
    </section>
  );
}

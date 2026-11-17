import { chartImage } from '../../data/content';

// Shows the question's source data next to the chart the learner picked.
// The picture is real Matplotlib output, generated from the same data by tools/build_assets.py.
export function PlotCanvas({ plot, chosen, dataset }) {
  const image = chosen ? chartImage(plot.id, chosen.id) : null;
  return (
    <div className={`plot-canvas plot-${plot.id}`}>
      <div className="plot-title"><b>{dataset.title}</b><small>NovaTech data</small></div>
      <div className="plot-layout">
        <SourceTable dataset={dataset} />
        <div className="plot-visual">
          {image
            ? <img className="line-graph-image" src={image} alt={`${chosen.label} of ${dataset.title}`} />
            : <div className="plot-placeholder">Choose a chart below to see this data drawn.</div>}
        </div>
      </div>
    </div>
  );
}

function SourceTable({ dataset }) {
  return (
    <div className="data-table-wrap">
      <span className="data-table-label">Source data</span>
      <div className="table-scroll">
        <table className="source-table">
          <thead><tr>{dataset.columns.map((name) => <th key={name}>{name}</th>)}</tr></thead>
          <tbody>
            {dataset.rows.map((row, i) => <tr key={i}>{row.map((cell, j) => <td key={j}>{cell}</td>)}</tr>)}
          </tbody>
        </table>
      </div>
    </div>
  );
}

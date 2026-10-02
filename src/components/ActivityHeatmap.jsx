export default function ActivityHeatmap(props) {
  const grid = props.grid;
  const labels = ['Mon', '', 'Wed', '', 'Fri', '', ''];
  return (
    <section className="heat">
      <h2 className="sidetitle">Contribution activity</h2>
      <div className="heat__wrap">
        <div className="heat__labels">
          {labels.map(function (label, i) {
            return <span key={i} className="heat__label">{label}</span>;
          })}
        </div>
        <div className="heat__grid" role="img" aria-label="Recent public activity">
          {grid.map(function (column, ci) {
            return (
              <div className="heat__col" key={ci}>
                {column.map(function (cell, ri) {
                  const level = cell.count < 0 ? 'future' : cell.count === 0 ? 'l0' : cell.count < 2 ? 'l1' : cell.count < 4 ? 'l2' : cell.count < 7 ? 'l3' : 'l4';
                  return (
                    <span
                      key={ri}
                      className={'heat__cell heat__cell--' + level}
                      title={cell.count < 0 ? '' : cell.count + ' events'}
                    />
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

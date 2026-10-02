import { langColor } from '../lib/languages.js';
import { percent } from '../lib/format.js';

export default function LanguageBreakdown(props) {
  const rows = props.rows;
  return (
    <section className="langs">
      <h2 className="sidetitle">Languages</h2>
      {rows.length === 0 ? (
        <p className="langs__empty">No language data</p>
      ) : (
        <ul className="langs__list">
          {rows.map(function (row) {
            const color = langColor(row.name);
            const width = Math.max(row.percent, 1.5);
            return (
              <li className="langs__row" key={row.name}>
                <div className="langs__meta">
                  <span className="langs__name">{row.name}</span>
                  <span className="langs__pct">{percent(row.percent)}</span>
                </div>
                <div className="langs__track">
                  <span
                    className="langs__fill"
                    style={{ width: width + '%', background: color }}
                  />
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}

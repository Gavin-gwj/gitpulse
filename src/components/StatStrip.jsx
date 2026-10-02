import { formatNumber } from '../lib/format.js';

export default function StatStrip(props) {
  const stats = props.stats;
  const items = [
    { label: 'Repositories', value: stats.repos },
    { label: 'Total Stars', value: stats.stars },
    { label: 'Followers', value: stats.followers },
    { label: 'Following', value: stats.following },
  ];
  return (
    <section className="statstrip" aria-label="Account totals">
      {items.map(function (item) {
        return (
          <div className="statstrip__cell" key={item.label}>
            <span className="statstrip__label">{item.label}</span>
            <span className="statstrip__value">{formatNumber(item.value)}</span>
          </div>
        );
      })}
    </section>
  );
}

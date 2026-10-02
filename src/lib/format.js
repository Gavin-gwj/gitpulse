export function formatNumber(value) {
  const n = Number(value);
  if (!Number.isFinite(n)) return '0';
  return n.toLocaleString('en-US');
}

const UNITS = [
  ['year', 31536000],
  ['month', 2592000],
  ['week', 604800],
  ['day', 86400],
  ['hour', 3600],
  ['minute', 60],
];

export function relativeTime(iso) {
  if (!iso) return 'unknown';
  const then = new Date(iso).getTime();
  if (!Number.isFinite(then)) return 'unknown';
  const secs = Math.max(1, Math.floor((Date.now() - then) / 1000));
  for (let i = 0; i < UNITS.length; i++) {
    const label = UNITS[i][0];
    const step = UNITS[i][1];
    const value = Math.floor(secs / step);
    if (value >= 1) {
      if (value === 1) return value + ' ' + label + ' ago';
      return value + ' ' + label + 's ago';
    }
  }
  return 'just now';
}

export function percent(value) {
  const n = Math.round(Number(value) || 0);
  return n + '%';
}

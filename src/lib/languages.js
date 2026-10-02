export const LANG_COLORS = {
  TypeScript: '#1f8fef',
  JavaScript: '#f7e04d',
  Python: '#4d34de',
  CSS: '#c3479f',
  HTML: '#f0883e',
  Java: '#b07219',
  Go: '#00add8',
  Rust: '#dea584',
  'C++': '#f34b7d',
  C: '#555555',
  'C#': '#178600',
  Ruby: '#701516',
  PHP: '#4f5d95',
  Swift: '#f05138',
  Kotlin: '#a97bff',
  Shell: '#89e051',
  Vue: '#41b883',
  Svelte: '#ff3e00',
  Dart: '#00b4ab',
  Scala: '#c22d40',
  Jupyter: '#da5b0b',
  'Jupyter Notebook': '#da5b0b',
  SCSS: '#c6538c',
  Less: '#1d365d',
  Astro: '#ff5a03',
  MDX: '#fcb32c',
  Dockerfile: '#384d54',
  Makefile: '#427819',
};

const FALLBACK = ['#6e7681', '#8b949e', '#5c6773', '#768390'];

export function langColor(name) {
  if (!name) return FALLBACK[3];
  if (LANG_COLORS[name]) return LANG_COLORS[name];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = (hash * 31 + name.charCodeAt(i)) % 9973;
  }
  return FALLBACK[hash % FALLBACK.length];
}

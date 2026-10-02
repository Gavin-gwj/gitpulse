const base = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.7,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
};

export function SearchIcon(props) {
  return (
    <svg viewBox="0 0 20 20" width="16" height="16" {...base} {...props}>
      <circle cx="9" cy="9" r="5.6" />
      <path d="M13.2 13.2 17 17" />
    </svg>
  );
}

export function PinIcon(props) {
  return (
    <svg viewBox="0 0 20 20" width="15" height="15" {...base} {...props}>
      <path d="M10 17s5.2-4.4 5.2-8.4A5.2 5.2 0 0 0 10 3.4a5.2 5.2 0 0 0-5.2 5.2C4.8 12.6 10 17 10 17Z" />
      <circle cx="10" cy="8.6" r="1.9" />
    </svg>
  );
}

export function StarIcon(props) {
  return (
    <svg viewBox="0 0 20 20" width="15" height="15" {...base} {...props}>
      <path d="M10 3.4l1.9 4 4.4.6-3.2 3 .8 4.3-3.9-2.1-3.9 2.1.8-4.3-3.2-3 4.4-.6z" />
    </svg>
  );
}

export function RepoIcon(props) {
  return (
    <svg viewBox="0 0 20 20" width="17" height="17" {...base} {...props}>
      <path d="M5 3.6h8.2a1.8 1.8 0 0 1 1.8 1.8v11H6.6A1.6 1.6 0 0 1 5 14.8z" />
      <path d="M5 3.6A1.6 1.6 0 0 0 3.4 5.2v9.6c0 .9.7 1.6 1.6 1.6" />
      <path d="M5 3.6v11.2" />
    </svg>
  );
}

export function ChevronIcon(props) {
  return (
    <svg viewBox="0 0 20 20" width="14" height="14" {...base} {...props}>
      <path d="m6 8.2 4 4 4-4" />
    </svg>
  );
}

export function ForkIcon(props) {
  return (
    <svg viewBox="0 0 20 20" width="15" height="15" {...base} {...props}>
      <circle cx="5.4" cy="5" r="1.9" />
      <circle cx="14.6" cy="5" r="1.9" />
      <circle cx="10" cy="15" r="1.9" />
      <path d="M5.4 6.9v1.6a2 2 0 0 0 2 2h5.2a2 2 0 0 0 2-2V6.9" />
      <path d="M10 10.5v2.6" />
    </svg>
  );
}

export function GithubMark(props) {
  return (
    <svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor" {...props}>
      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82a7.4 7.4 0 0 1 2-.27c.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z" />
    </svg>
  );
}

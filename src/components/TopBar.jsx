import { SearchIcon } from './Icons.jsx';

export default function TopBar(props) {
  const draft = props.draft;
  const onDraft = props.onDraft;
  const onSubmit = props.onSubmit;
  const view = props.view;
  const onView = props.onView;
  const loading = props.loading;

  function handleSubmit(event) {
    event.preventDefault();
    onSubmit();
  }

  return (
    <header className="topbar">
      <div className="topbar__brand">
        <span className="topbar__brand-git">Git</span>
        <span className="topbar__brand-pulse">Pulse</span>
      </div>

      <form className="searchbar" onSubmit={handleSubmit} role="search">
        <button type="submit" className="searchbar__icon" aria-label="Search">
          <SearchIcon />
        </button>
        <input
          className="searchbar__input"
          value={draft}
          onChange={function (e) { onDraft(e.target.value); }}
          placeholder="Search a GitHub username..."
          spellCheck="false"
          autoComplete="off"
          aria-label="GitHub username"
        />
        {loading ? <span className="searchbar__spinner" aria-hidden="true" /> : null}
      </form>

      <div className="segmented" role="tablist" aria-label="View">
        <button
          type="button"
          role="tab"
          aria-selected={view === 'overview'}
          className={'segmented__btn' + (view === 'overview' ? ' is-active' : '')}
          onClick={function () { onView('overview'); }}
        >
          Overview
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={view === 'repositories'}
          className={'segmented__btn' + (view === 'repositories' ? ' is-active' : '')}
          onClick={function () { onView('repositories'); }}
        >
          Repositories
        </button>
      </div>
    </header>
  );
}

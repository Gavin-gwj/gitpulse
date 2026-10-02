import React from 'react';
import TopBar from './components/TopBar.jsx';
import StatStrip from './components/StatStrip.jsx';
import ProfilePanel from './components/ProfilePanel.jsx';
import LanguageBreakdown from './components/LanguageBreakdown.jsx';
import ActivityHeatmap from './components/ActivityHeatmap.jsx';
import RepoTable from './components/RepoTable.jsx';
import { fetchProfile } from './lib/github.js';
import fallback from './data/fallback.json';

const DEFAULT_USER = 'Gavin-gwj';

function initialParams() {
  const params = new URLSearchParams(window.location.search);
  const user = params.get('user') || DEFAULT_USER;
  const view = params.get('view') === 'repositories' ? 'repositories' : 'overview';
  return { user: user, view: view };
}
const INIT = initialParams();

function messageFor(error) {
  const code = error && error.message ? error.message : '';
  if (code === 'NOT_FOUND') return 'No GitHub account matches that username.';
  if (code === 'RATE_LIMIT') return 'GitHub API rate limit reached. Try again in a little while.';
  if (code === 'EMPTY') return 'Type a username to search.';
  return 'Could not load that profile. Check the username and try again.';
}

export default function App() {
  const [draft, setDraft] = React.useState(INIT.user);
  const [snapshot, setSnapshot] = React.useState(fallback);
  const [status, setStatus] = React.useState('ready');
  const [error, setError] = React.useState('');
  const [notice, setNotice] = React.useState('');
  const [view, setView] = React.useState(INIT.view);
  const [sort, setSort] = React.useState('stars');
  const [langFilter, setLangFilter] = React.useState('all');
  const [selectedId, setSelectedId] = React.useState(null);

  const runSearch = React.useCallback(async function (rawName) {
    const target = (rawName || '').trim();
    if (!target) {
      setError(messageFor(new Error('EMPTY')));
      setStatus('error');
      return;
    }
    setStatus('loading');
    setError('');
    setNotice('');
    try {
      const next = await fetchProfile(target);
      setSnapshot(next);
      setDraft(target);
      setSelectedId(null);
      setLangFilter('all');
      setStatus('ready');
    } catch (err) {
      if (err && err.message === 'NOT_FOUND') {
        setError(messageFor(err));
        setStatus('error');
      } else if (fallback.profile.login.toLowerCase() === target.toLowerCase()) {
        setSnapshot(fallback);
        setNotice('Live GitHub API is unavailable, showing the last saved snapshot.');
        setStatus('ready');
      } else {
        setError(messageFor(err));
        setStatus('error');
      }
    }
  }, []);

  React.useEffect(function () {
    let alive = true;
    fetchProfile(INIT.user)
      .then(function (next) {
        if (!alive) return;
        setSnapshot(next);
        setNotice('');
      })
      .catch(function () {
        if (!alive) return;
        setSnapshot(fallback);
        setNotice('Live GitHub API is unavailable, showing the last saved snapshot.');
      });
    return function () { alive = false; };
  }, []);

  const facets = React.useMemo(function () {
    const set = new Set();
    snapshot.repos.forEach(function (r) { if (r.language) set.add(r.language); });
    return Array.from(set).sort();
  }, [snapshot]);

  const visibleRepos = React.useMemo(function () {
    const rows = snapshot.repos.filter(function (r) {
      if (langFilter === 'all') return true;
      return r.language === langFilter;
    });
    const copy = rows.slice();
    if (sort === 'stars') copy.sort(function (a, b) { return b.stars - a.stars; });
    else if (sort === 'updated') copy.sort(function (a, b) { return new Date(b.updatedAt) - new Date(a.updatedAt); });
    else copy.sort(function (a, b) { return a.name.localeCompare(b.name); });
    if (view === 'overview') return copy.slice(0, 5);
    return copy;
  }, [snapshot, sort, langFilter, view]);

  React.useEffect(function () {
    if (visibleRepos.length > 0 && !visibleRepos.some(function (r) { return r.id === selectedId; })) {
      setSelectedId(visibleRepos[0].id);
    } else if (visibleRepos.length === 0) {
      setSelectedId(null);
    }
  }, [visibleRepos, selectedId]);

  const busy = status === 'loading';

  return (
    <div className="app">
      <TopBar
        draft={draft}
        onDraft={setDraft}
        onSubmit={function () { runSearch(draft); }}
        view={view}
        onView={setView}
        loading={busy}
      />

      {view === 'overview' ? <StatStrip stats={snapshot.stats} /> : null}

      <div className="body">
        {view === 'overview' ? (
          <aside className="sidebar">
            <ProfilePanel profile={snapshot.profile} />
            <LanguageBreakdown rows={snapshot.languages} />
            <ActivityHeatmap grid={snapshot.heatmap} />
          </aside>
        ) : null}

        <main className="main">
          {notice ? <p className="banner">{notice}</p> : null}
          {error ? <p className="banner banner--error">{error}</p> : null}
          <RepoTable
            repos={visibleRepos}
            total={snapshot.repos.length}
            sort={sort}
            onSort={setSort}
            langFilter={langFilter}
            onLangFilter={setLangFilter}
            facets={facets}
            selectedId={selectedId}
            onSelect={setSelectedId}
          />
        </main>
      </div>

      {busy ? <div className="loadingbar" aria-hidden="true" /> : null}
    </div>
  );
}

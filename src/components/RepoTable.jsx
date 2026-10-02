import { RepoIcon, StarIcon, ChevronIcon } from './Icons.jsx';
import { langColor } from '../lib/languages.js';
import { formatNumber, relativeTime } from '../lib/format.js';

const SORTS = [
  { value: 'stars', label: 'Stars' },
  { value: 'updated', label: 'Recently updated' },
  { value: 'name', label: 'Name' },
];

function Select(props) {
  const value = props.value;
  const onChange = props.onChange;
  const options = props.options;
  const prefix = props.prefix;
  const label = props.label;
  const current = options.filter(function (o) { return o.value === value; })[0];
  return (
    <div className="select">
      <span className="select__text">{prefix + (current ? current.label : '')}</span>
      <ChevronIcon className="select__chevron" />
      <select
        className="select__native"
        value={value}
        aria-label={label}
        onChange={function (e) { onChange(e.target.value); }}
      >
        {options.map(function (o) {
          return <option key={o.value} value={o.value}>{o.label}</option>;
        })}
      </select>
    </div>
  );
}

export default function RepoTable(props) {
  const repos = props.repos;
  const sort = props.sort;
  const onSort = props.onSort;
  const langFilter = props.langFilter;
  const onLangFilter = props.onLangFilter;
  const facets = props.facets;
  const selectedId = props.selectedId;
  const onSelect = props.onSelect;
  const total = props.total;

  const langOptions = [{ value: 'all', label: 'All' }].concat(
    facets.map(function (name) { return { value: name, label: name }; })
  );

  return (
    <section className="repos">
      <div className="repos__head">
        <h2 className="repos__title">Repositories</h2>
        <div className="repos__controls">
          <Select prefix="Sort: " value={sort} onChange={onSort} options={SORTS} label="Sort repositories" />
          <Select prefix="Language: " value={langFilter} onChange={onLangFilter} options={langOptions} label="Filter by language" />
        </div>
      </div>

      <div className="tablerow tablerow--head">
        <span>Name</span>
        <span>Language</span>
        <span className="num">Stars</span>
        <span className="num">Forks</span>
        <span className="num">Updated</span>
      </div>

      <div className="repos__list">
        {repos.length === 0 ? (
          <p className="repos__empty">No repositories match this filter.</p>
        ) : (
          repos.map(function (repo) {
            const active = repo.id === selectedId;
            return (
              <div
                key={repo.id}
                className={'tablerow tablerow--data' + (active ? ' is-selected' : '')}
                onClick={function () { onSelect(active ? null : repo.id); }}
                role="button"
                tabIndex={0}
                onKeyDown={function (e) {
                  if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onSelect(active ? null : repo.id); }
                }}
              >
                <span className="cellname">
                  <span className="cellname__icon"><RepoIcon /></span>
                  <span className="cellname__text">
                    <span className="cellname__title">
                      <a
                        href={repo.url}
                        target="_blank"
                        rel="noreferrer"
                        onClick={function (e) { e.stopPropagation(); }}
                      >
                        {repo.name}
                      </a>
                      <StarIcon className="cellname__star" />
                    </span>
                    {repo.description ? <span className="cellname__desc">{repo.description}</span> : null}
                  </span>
                </span>

                <span className="celllang">
                  {repo.language ? (
                    <span className="langtag">
                      <span className="langtag__dot" style={{ background: langColor(repo.language) }} />
                      {repo.language}
                    </span>
                  ) : (
                    <span className="langtag langtag--none">None</span>
                  )}
                </span>

                <span className="cellnum">{formatNumber(repo.stars)}</span>
                <span className="cellnum">{formatNumber(repo.forks)}</span>
                <span className="cellnum cellnum--time">{relativeTime(repo.updatedAt)}</span>
              </div>
            );
          })
        )}
      </div>

      {total > repos.length ? (
        <p className="repos__count">Showing {repos.length} of {total} repositories</p>
      ) : null}
    </section>
  );
}

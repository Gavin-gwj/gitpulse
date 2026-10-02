const API = 'https://api.github.com';

async function getJSON(path) {
  const res = await fetch(API + path, {
    headers: { Accept: 'application/vnd.github+json' },
  });
  if (res.status === 404) throw new Error('NOT_FOUND');
  if (res.status === 403 || res.status === 429) throw new Error('RATE_LIMIT');
  if (!res.ok) throw new Error('HTTP_' + res.status);
  return res.json();
}

export function buildLanguages(repos, maxSlices) {
  const limit = maxSlices || 5;
  const totals = new Map();
  let grand = 0;
  repos.forEach((repo) => {
    if (repo.fork) return;
    const name = repo.language;
    if (!name) return;
    const weight = Math.max(repo.size || 0, 1);
    totals.set(name, (totals.get(name) || 0) + weight);
    grand += weight;
  });
  if (grand === 0) return [];
  const sorted = Array.from(totals.entries())
    .map((entry) => ({ name: entry[0], weight: entry[1] }))
    .sort((a, b) => b.weight - a.weight);
  const head = sorted.slice(0, limit - 1);
  const tail = sorted.slice(limit - 1);
  const otherWeight = tail.reduce((sum, item) => sum + item.weight, 0);
  const rows = head.map((item) => ({
    name: item.name,
    percent: (item.weight / grand) * 100,
  }));
  if (otherWeight > 0) {
    rows.push({ name: 'Other', percent: (otherWeight / grand) * 100 });
  }
  return rows;
}

export function buildHeatmap(events, weeks) {
  const weekCount = weeks || 12;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const dayOfWeek = (today.getDay() + 6) % 7;
  const monday = new Date(today);
  monday.setDate(today.getDate() - dayOfWeek);
  const start = new Date(monday);
  start.setDate(monday.getDate() - (weekCount - 1) * 7);

  const counts = new Map();
  (events || []).forEach((ev) => {
    if (!ev || !ev.created_at) return;
    const d = new Date(ev.created_at);
    const key = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
    counts.set(key, (counts.get(key) || 0) + 1);
  });

  const grid = [];
  for (let col = 0; col < weekCount; col++) {
    const column = [];
    for (let row = 0; row < 7; row++) {
      const d = new Date(start);
      d.setDate(start.getDate() + col * 7 + row);
      const key = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
      const future = d.getTime() > today.getTime();
      column.push({ key: key, count: future ? -1 : counts.get(key) || 0, date: d });
    }
    grid.push(column);
  }
  return grid;
}

export function buildSnapshot(user, repos, events) {
  const stars = repos.reduce((sum, r) => sum + (r.stargazers_count || 0), 0);
  const forks = repos.reduce((sum, r) => sum + (r.forks_count || 0), 0);
  return {
    fetchedAt: new Date().toISOString(),
    live: true,
    profile: {
      login: user.login,
      name: (user.name || user.login).trim(),
      avatar: user.avatar_url,
      bio: user.bio || '',
      company: user.company || '',
      location: user.location || '',
      blog: user.blog || '',
      url: user.html_url,
      createdAt: user.created_at,
    },
    stats: {
      repos: user.public_repos || repos.length,
      stars: stars,
      forks: forks,
      followers: user.followers || 0,
      following: user.following || 0,
    },
    languages: buildLanguages(repos, 5),
    heatmap: buildHeatmap(events, 12),
    repos: repos
      .map((r) => ({
        id: r.id,
        name: r.name,
        description: r.description || '',
        language: r.language || '',
        stars: r.stargazers_count || 0,
        forks: r.forks_count || 0,
        updatedAt: r.pushed_at || r.updated_at,
        url: r.html_url,
        fork: !!r.fork,
        size: r.size || 0,
        topics: r.topics || [],
      }))
      .sort((a, b) => b.stars - a.stars),
  };
}

export async function fetchProfile(username) {
  const safe = encodeURIComponent(username.trim());
  if (!safe) throw new Error('EMPTY');
  const results = await Promise.all([
    getJSON('/users/' + safe),
    getJSON('/users/' + safe + '/repos?per_page=100&sort=pushed'),
    getJSON('/users/' + safe + '/events/public?per_page=100').catch(function () {
      return [];
    }),
  ]);
  return buildSnapshot(results[0], results[1], results[2]);
}

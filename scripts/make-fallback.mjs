import fs from 'node:fs';
import { fetchProfile } from '../src/lib/github.js';

const login = process.argv[2] || 'Gavin-gwj';
const snap = await fetchProfile(login);
snap.live = false;
snap.fetchedAt = new Date().toISOString();
fs.writeFileSync(new URL('../src/data/fallback.json', import.meta.url), JSON.stringify(snap, null, 2));
console.log('wrote fallback for', login, '| repos:', snap.repos.length, '| langs:', snap.languages.length);

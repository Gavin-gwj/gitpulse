import { chromium } from 'playwright';
const log = (m) => { console.log(m); };

const base = 'http://localhost:5173/';
const root = 'C:/Users/LENOVO/Documents/Codex/2026-10-02/build-web-apps-plugin-build-web-4/work/qa';
const browser = await chromium.launch();
log('browser launched');
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const errors = [];
page.on('pageerror', (e) => errors.push('pageerror: ' + e.message));
page.on('console', (m) => { if (m.type() === 'error') errors.push('console: ' + m.text()); });

log('goto...');
await page.goto(base, { waitUntil: 'domcontentloaded', timeout: 20000 });
log('waiting rows...');
await page.waitForSelector('.tablerow--data', { timeout: 20000 });
log('rows present, settle 1.2s');
await page.waitForTimeout(1200);

const snap = () => page.evaluate(() => ({
  brand: (document.querySelector('.topbar__brand') || {}).innerText || '',
  stats: Array.from(document.querySelectorAll('.statstrip__cell')).map(c => c.innerText.trim().replace(/\n/g, ' ')),
  rows: document.querySelectorAll('.tablerow--data').length,
  selected: Array.from(document.querySelectorAll('.tablerow--data.is-selected .cellname__title a')).map(a => a.innerText),
  langs: Array.from(document.querySelectorAll('.langs__row .langs__name')).map(e => e.innerText),
  profile: (document.querySelector('.profile__name') || {}).innerText || '',
  searchVal: (document.querySelector('.searchbar__input') || {}).value || '',
}));

log('INITIAL ' + JSON.stringify(await snap()));

log('filling torvalds...');
await page.fill('.searchbar__input', 'torvalds', { timeout: 10000 });
await page.keyboard.press('Enter');
log('entered, waiting for Linus...');
try {
  await page.waitForFunction(() => {
    const n = document.querySelector('.profile__name');
    return n && n.innerText.indexOf('Linus') !== -1;
  }, { timeout: 25000 });
  log('SEARCH_OK ' + JSON.stringify(await snap()));
} catch (e) {
  log('SEARCH_ERR ' + e.message.split('\n')[0]);
  log('CURRENT ' + JSON.stringify(await snap()));
}


log('click Repositories tab...');
await page.click('.segmented__btn:nth-child(2)', { timeout: 10000 });
await page.waitForTimeout(400);
log('REPOS_VIEW ' + JSON.stringify(await page.evaluate(() => ({
  sidebarVisible: !!document.querySelector('.sidebar'),
  rows: document.querySelectorAll('.tablerow--data').length,
}))));

log('sort by name...');
await page.selectOption('.select__native >> nth=0', 'name', { timeout: 10000 });
await page.waitForTimeout(400);
log('SORTED ' + JSON.stringify(await page.evaluate(() => Array.from(document.querySelectorAll('.cellname__title a')).slice(0, 3).map(a => a.innerText))));

log('click 3rd row...');
await page.locator('.tablerow--data').nth(2).click({ timeout: 10000 });
await page.waitForTimeout(300);
log('SELECTED_AFTER_CLICK ' + JSON.stringify(await page.evaluate(() => Array.from(document.querySelectorAll('.tablerow--data.is-selected .cellname__title a')).map(a => a.innerText))));


log('back to overview...');
await page.click('.segmented__btn:nth-child(1)', { timeout: 10000 });
await page.waitForTimeout(400);


log('ERRORS ' + (errors.length ? errors.slice(0, 5).join(' | ') : 'none'));
await browser.close();
log('E2E DONE');

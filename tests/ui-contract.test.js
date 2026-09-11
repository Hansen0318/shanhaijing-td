import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { UIController } from '../src/ui/UIController.js';

test('HTML exposes the complete mobile game interface', async () => {
  const html = await readFile(new URL('../index.html', import.meta.url), 'utf8');
  for (const value of ['viewport-fit=cover', 'game-canvas', 'base-hp', 'gold', 'wave', 'pause-button', 'speed-button', 'context-panel', 'blessing-overlay', 'pause-overlay', 'result-overlay', 'next-level-button', 'boss-name', 'src/main.js']) assert.match(html, new RegExp(value));
});

test('preparation CTA lives in wave preview and no longer overlays battlefield', async () => {
  const html = await readFile(new URL('../index.html', import.meta.url), 'utf8');
  const ui = await readFile(new URL('../src/ui/UIController.js', import.meta.url), 'utf8');
  const fixes = await readFile(new URL('../styles-fixes.css', import.meta.url), 'utf8');
  const preview = html.match(/<div id="wave-preview"[\s\S]*?<\/div>\s*<div id="boss-hud"/)?.[0] ?? '';
  const battlefield = html.match(/<section class="battlefield"[\s\S]*?<\/section>/)?.[0] ?? '';

  assert.match(preview, /id="start-wave-button"/);
  assert.doesNotMatch(battlefield, /wave-control|countdown-label|start-wave-button/);
  assert.match(ui, /start-wave-button'\]\.hidden = !preparing/);
  assert.match(ui, /`開始 W\$\{game\.wave\.waveNumber \+ 1\}`/);
  assert.match(fixes, /\.start-wave-inline\s*\{/);
  assert.doesNotMatch(fixes, /body\[data-level="3"\] \.wave-control/);
});

test('dev menu is opt-in only and direct level initialization selects the ArtStore level first', async () => {
  const html = await readFile(new URL('../index.html', import.meta.url), 'utf8');
  const main = await readFile(new URL('../src/main.js', import.meta.url), 'utf8');

  assert.doesNotMatch(html, /dev-level-menu|Level1<\/button>|Level2<\/button>|Level3<\/button>/);
  assert.match(main, /params\.get\('devMenu'\) === '1'/);
  assert.match(main, /renderDevMenu\(\)/);
  assert.match(main, /data-dev-level="1"[\s\S]*data-dev-level="2"[\s\S]*data-dev-level="3"/);
  assert.match(main, /\[1, 2, 3\]\.includes\(devLevel\) \? devLevel : 1/);
  assert.match(main, /new ArtStore\(Image, initialLevelId\)/);
  assert.match(main, /new Renderer\(canvas, art\)/);
  assert.doesNotMatch(main, /renderer\.prepareLevel\(initialLevelId\)/);
});

test('dev path diagnostics and fresh-load metrics are opt-in/runtime only', async () => {
  const html = await readFile(new URL('../index.html', import.meta.url), 'utf8');
  const main = await readFile(new URL('../src/main.js', import.meta.url), 'utf8');
  assert.doesNotMatch(html, /devPath|SHANHAIJING_LOAD_METRICS/);
  assert.match(main, /params\.get\('devPath'\) !== '1' \|\| game\.levelId !== 3/);
  assert.match(main, /const runtime = game\.map\.waypoints/);
  assert.match(main, /const anchors = game\.level\.map\.waypoints/);
  assert.match(main, /game\.enemies\.forEach\(enemy =>/);
  assert.match(main, /__SHANHAIJING_LOAD_METRICS__/);
  assert.match(main, /requiredAssets: LEVEL_REQUIRED_ART_IDS\[game\.levelId\]\.length/);
  assert.match(main, /blockingMs: Math\.round\(performance\.now\(\) - blockingStartedAt\)/);
});

test('entry and style cache versions are fresh for this release', async () => {
  const html = await readFile(new URL('../index.html', import.meta.url), 'utf8');
  assert.match(html, /styles-fixes\.css\?v=prep-loading-1/);
  assert.match(html, /src\/main\.js\?v=level3-ui-2/);
});

test('context panel is not rebuilt when its state signature is unchanged', () => {
  const ui = Object.create(UIController.prototype);
  assert.equal(ui.shouldRenderContext('slot-0-gold-300'), true);
  assert.equal(ui.shouldRenderContext('slot-0-gold-300'), false);
  assert.equal(ui.shouldRenderContext('slot-0-gold-180'), true);
});

test('mobile layout reserves invariant space for context controls and boss health', async () => {
  const html = await readFile(new URL('../index.html', import.meta.url), 'utf8');
  const css = await readFile(new URL('../styles.css', import.meta.url), 'utf8');

  assert.match(html, /class="boss-slot"[\s\S]*id="wave-preview"[\s\S]*id="boss-hud"/);
  assert.match(css, /\.boss-slot\s*\{[^}]*flex:\s*0\s+0\s+44px[^}]*min-height:\s*44px/s);
  assert.match(css, /\.wave-preview\s*\{[^}]*height:\s*100%/s);
  assert.match(css, /\.context-panel\s*\{[^}]*min-height:\s*142px[^}]*flex:\s*0\s+0\s+142px/s);
  assert.doesNotMatch(css, /\.context-open\s+\.context-panel/);
});

test('CSS prevents horizontal overflow and provides minimum tap targets', async () => {
  const css = await readFile(new URL('../styles.css', import.meta.url), 'utf8');
  assert.match(css, /overflow-x:\s*hidden/);
  assert.match(css, /min-height:\s*44px/);
  assert.match(css, /env\(safe-area-inset-bottom\)/);
  assert.doesNotMatch(css, /min-height:\s*(?:[0-3]?\d|4[0-3])px/);
});

test('short iPhone layout keeps context actions inside the reserved panel', async () => {
  const css = await readFile(new URL('../styles.css', import.meta.url), 'utf8');
  const shortRule = css.match(/@media \(max-height:\s*720px\)\s*\{([\s\S]*?)\n\}/)?.[1] ?? '';

  assert.match(css, /\.game-shell\s*\{[^}]*height:\s*100svh/s);
  assert.match(shortRule, /\.context-panel\s*\{[^}]*min-height:\s*142px[^}]*flex-basis:\s*142px/s);
  assert.match(css, /\.unit-card\s*\{[^}]*min-height:\s*110px/s);
  assert.match(css, /\.tower-actions\s*\{[^}]*margin-top:\s*3px/s);
});

test('level three removes duplicate wave wording and makes boss/terrain feedback explicit', async () => {
  const ui = await readFile(new URL('../src/ui/UIController.js', import.meta.url), 'utf8');
  const renderer = await readFile(new URL('../src/render/Renderer.js', import.meta.url), 'utf8');

  assert.doesNotMatch(ui, /const phaseLabel/);
  assert.match(ui, /wave-preview-title'\]\.textContent = `第\$\{this\.game\.level\.id\}關・\$\{this\.game\.level\.name\}`/);
  assert.match(ui, /bossNameInArt = boss\.type === 'xiangliu'/);
  assert.match(ui, /boss-name'\]\.hidden = bossNameInArt/);
  assert.match(ui, /汲取弱水/);
  assert.match(renderer, /game\.level\.id === 3/);
  assert.match(renderer, /Math\.max\(34, art\.spawnPosition\.x\)/);
  assert.match(renderer, /Math\.max\(40, art\.basePosition\.x\)/);
  assert.match(renderer, /enemy\.map\?\.isWeakWater\?\.\(enemy\)/);
  assert.match(renderer, /'waterRing'/);
});

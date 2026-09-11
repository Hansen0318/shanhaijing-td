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
});

test('entry and style cache versions are fresh for this release', async () => {
  const html = await readFile(new URL('../index.html', import.meta.url), 'utf8');
  assert.match(html, /styles-fixes\.css\?v=boss-viewport-1/);
  assert.match(html, /src\/main\.js\?v=boss-viewport-1/);
});

test('context panel is not rebuilt when its state signature is unchanged', () => {
  const ui = Object.create(UIController.prototype);
  assert.equal(ui.shouldRenderContext('slot-0-gold-300'), true);
  assert.equal(ui.shouldRenderContext('slot-0-gold-300'), false);
  assert.equal(ui.shouldRenderContext('slot-0-gold-180'), true);
});

test('boss names stay programmatic, Xiangliu art title is masked, and heal feedback is explicit', async () => {
  const ui = await readFile(new URL('../src/ui/UIController.js', import.meta.url), 'utf8');
  const fixes = await readFile(new URL('../styles-fixes.css', import.meta.url), 'utf8');
  const game = await readFile(new URL('../src/core/Game.js', import.meta.url), 'utf8');
  assert.doesNotMatch(ui, /bossNameInArt/);
  assert.match(ui, /boss-name'\]\.textContent = boss\.data\.name/);
  assert.match(ui, /boss-hud'\]\.dataset\.bossType = boss\.type/);
  assert.match(ui, /回血 \+\$\{healEffect\.amount\} HP/);
  assert.match(fixes, /body\[data-level="3"\] \.boss-hud\[data-boss-type="xiangliu"\]::before/);
  assert.match(fixes, /boss-hud > \*/);
  assert.match(game, /xiangliuHealPulse'[\s\S]*life: 1\.2, duration: 1\.2/);
  assert.match(game, /bossHealText'[\s\S]*amount: event\.healAmount[\s\S]*life: 1\.2, duration: 1\.2/);
});

test('mobile entry resets browser scroll restoration and anchors the game at the top', async () => {
  const main = await readFile(new URL('../src/main.js', import.meta.url), 'utf8');
  assert.match(main, /history\.scrollRestoration = 'manual'/);
  assert.match(main, /function resetViewport\(\)/);
  assert.match(main, /window\.scrollTo\(0, 0\)/);
  assert.match(main, /window\.addEventListener\('pageshow', resetViewport\)/);
  assert.match(main, /document\.body\.classList\.remove\('art-loading'\);[\s\S]*resetViewport\(\)/);
});

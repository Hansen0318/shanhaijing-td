import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { UIController } from '../src/ui/UIController.js';

test('HTML exposes the complete mobile game interface', async () => {
  const html = await readFile(new URL('../index.html', import.meta.url), 'utf8');
  for (const value of ['viewport-fit=cover', 'game-canvas', 'base-hp', 'gold', 'wave', 'pause-button', 'speed-button', 'context-panel', 'blessing-overlay', 'pause-overlay', 'result-overlay', 'next-level-button', 'boss-name', 'src/main.js']) assert.match(html, new RegExp(value));
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

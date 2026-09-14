import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { UIController } from '../src/ui/UIController.js';

test('lineup choices are not rebuilt when the selection signature is unchanged', () => {
  const ui = Object.create(UIController.prototype);
  assert.equal(ui.shouldRenderLineup('lineup:bifang|fuzhu'), true);
  assert.equal(ui.shouldRenderLineup('lineup:bifang|fuzhu'), false);
  assert.equal(ui.shouldRenderLineup('lineup:bifang|fuzhu|baize'), true);
});

test('lineup render is keyed instead of replacing card DOM every animation frame', async () => {
  const source = await readFile(new URL('../src/ui/UIController.js', import.meta.url), 'utf8');
  assert.match(source, /shouldRenderLineup\(key\)/);
  assert.match(source, /const key = `lineup:\$\{\[\.\.\.selected\]\.join\('\|'\)\}`/);
  assert.match(source, /if \(!this\.shouldRenderLineup\(key\)\) return/);
});

test('Level4 lineup copy uses dark high-contrast text over the pale art panel', async () => {
  const css = await readFile(new URL('../styles-lineup.css', import.meta.url), 'utf8');
  assert.match(css, /\.lineup-modal\s*\{[\s\S]*color:\s*#1b2b4a/i);
  assert.match(css, /\.lineup-modal h1\s*\{[\s\S]*color:\s*#182846/i);
  assert.match(css, /\.lineup-help\s*\{[\s\S]*color:\s*#354564/i);
  assert.match(css, /\.lineup-help\s*\{[\s\S]*font-weight:\s*650/i);
});

test('lineup styling remains covered by the current document and module cache bust', async () => {
  const html = await readFile(new URL('../index.html', import.meta.url), 'utf8');
  const main = await readFile(new URL('../src/main.js', import.meta.url), 'utf8');
  assert.match(html, /styles-lineup\.css\?v=level5-1/);
  assert.match(html, /src\/main\.js\?v=level5-1/);
  assert.match(main, /UIController\.js\?v=level5-1/);
});

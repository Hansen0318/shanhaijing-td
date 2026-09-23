import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { UIController } from '../src/ui/UIController.js';
import { LEVELS } from '../src/config/gameData.js';

test('lineup choices are not rebuilt when the selection signature is unchanged', () => {
  const ui = Object.create(UIController.prototype);
  assert.equal(ui.shouldRenderLineup('lineup:bifang|fuzhu'), true);
  assert.equal(ui.shouldRenderLineup('lineup:bifang|fuzhu'), false);
  assert.equal(ui.shouldRenderLineup('lineup:bifang|fuzhu|baize'), true);
});

test('lineup render preserves card DOM until selection or eligible roster changes', () => {
  const choices = {
    writes: 0,
    value: '',
    set innerHTML(value) { this.writes += 1; this.value = value; },
    get innerHTML() { return this.value; },
  };
  let roster = ['bifang', 'fuzhu', 'yinglong', 'baize'];
  const ui = Object.create(UIController.prototype);
  ui.lineupKey = null;
  ui.game = {
    level: LEVELS[4], levelId: 4, state: 'lineup', lineupSelection: [],
    lineupRoster: () => roster,
  };
  ui.dom = {
    'lineup-overlay': { hidden: true }, 'lineup-choices': choices,
    'confirm-lineup-button': { disabled: true },
  };

  ui.renderLineup();
  ui.renderLineup();
  assert.equal(choices.writes, 1, 'unchanged lineup keeps the existing card DOM');

  roster = ['bifang', 'fuzhu', 'yinglong'];
  ui.renderLineup();
  assert.equal(choices.writes, 2, 'a changed eligible roster rebuilds the cards');
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
  assert.match(html, /styles-lineup\.css\?v=level8-1/);
  assert.match(html, /src\/main\.js\?v=level8-1/);
  assert.match(main, /UIController\.js\?v=level8-1/);
});

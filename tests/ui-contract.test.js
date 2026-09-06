import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { UIController } from '../src/ui/UIController.js';

test('HTML exposes the complete mobile game interface', async () => {
  const html = await readFile(new URL('../index.html', import.meta.url), 'utf8');
  for (const value of ['viewport-fit=cover', 'game-canvas', 'base-hp', 'gold', 'wave', 'pause-button', 'speed-button', 'context-panel', 'blessing-overlay', 'pause-overlay', 'result-overlay', 'src/main.js']) assert.match(html, new RegExp(value));
});

test('context panel is not rebuilt when its state signature is unchanged', () => {
  const ui = Object.create(UIController.prototype);
  assert.equal(ui.shouldRenderContext('slot-0-gold-300'), true);
  assert.equal(ui.shouldRenderContext('slot-0-gold-300'), false);
  assert.equal(ui.shouldRenderContext('slot-0-gold-180'), true);
});

test('context panel expands only while a tower slot is selected', () => {
  const states = new Map();
  const ui = Object.create(UIController.prototype);
  ui.dom = {
    'game-shell': {
      classList: {
        toggle(name, enabled) { states.set(name, enabled); },
      },
    },
  };

  ui.setContextExpanded(false);
  assert.equal(states.get('context-open'), false);

  ui.setContextExpanded(true);
  assert.equal(states.get('context-open'), true);
});

test('CSS prevents horizontal overflow and provides minimum tap targets', async () => {
  const css = await readFile(new URL('../styles.css', import.meta.url), 'utf8');
  assert.match(css, /overflow-x:\s*hidden/);
  assert.match(css, /min-height:\s*44px/);
  assert.match(css, /env\(safe-area-inset-bottom\)/);
  assert.doesNotMatch(css, /min-height:\s*(?:[0-3]?\d|4[0-3])px/);
});

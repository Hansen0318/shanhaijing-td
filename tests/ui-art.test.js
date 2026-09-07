import test from 'node:test';
import assert from 'node:assert/strict';
import { UIController } from '../src/ui/UIController.js';

test('build choices render the three packaged tower images', () => {
  const ui = Object.create(UIController.prototype);
  ui.contextKey = null;
  ui.game = {
    selectedSlot: 0,
    towers: [null],
    economy: { gold: 300, canAfford: () => true },
    state: 'preparation', pendingSellSlot: null,
    blessings: { modifiers: {} },
    canManageTowers: () => true,
  };
  ui.dom = { 'context-panel': { innerHTML: '' } };

  ui.renderContext();

  assert.match(ui.dom['context-panel'].innerHTML, /assets\/towers\/tower_bifang_v1\.png/);
  assert.match(ui.dom['context-panel'].innerHTML, /assets\/towers\/tower_fuzhu_v1\.png/);
  assert.match(ui.dom['context-panel'].innerHTML, /assets\/towers\/tower_yinglong_v1\.png/);
  assert.equal((ui.dom['context-panel'].innerHTML.match(/class="unit-art"/g) ?? []).length, 3);
});

test('wave preview renders packaged enemy images from configured groups', () => {
  const ui = Object.create(UIController.prototype);
  ui.game = {
    state: 'preparation', enemies: [],
    wave: { waveNumber: 0, getWaveGroups: () => [{ type: 'minion', count: 8 }, { type: 'swift', count: 4 }] },
  };
  ui.dom = {
    'wave-preview': { hidden: true }, 'boss-hud': { hidden: true },
    'wave-preview-title': { textContent: '' }, 'wave-preview-enemies': { innerHTML: '' },
    'boss-hp-fill': { style: {} }, 'boss-hp-text': { textContent: '' },
  };

  ui.renderBossSlot();

  assert.match(ui.dom['wave-preview-enemies'].innerHTML, /assets\/enemies\/enemy_xiaoyao_v1\.png/);
  assert.match(ui.dom['wave-preview-enemies'].innerHTML, /assets\/enemies\/enemy_jiyao_v1\.png/);
});

test('result panel exposes victory and defeat state for the matching skin', () => {
  const ui = Object.create(UIController.prototype);
  ui.game = { state: 'victory', baseHp: 12, wave: { waveNumber: 10 }, stats: { kills: 99, built: 8 } };
  ui.dom = {
    'result-overlay': { hidden: true }, 'result-panel': { dataset: {} },
    'result-title': { textContent: '' }, 'result-stats': { innerHTML: '' }, 'retry-button': { textContent: '' },
  };

  ui.renderResult();
  assert.equal(ui.dom['result-panel'].dataset.result, 'victory');

  ui.game.state = 'defeat';
  ui.renderResult();
  assert.equal(ui.dom['result-panel'].dataset.result, 'defeat');
});

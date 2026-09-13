import test from 'node:test';
import assert from 'node:assert/strict';
import { UIController } from '../src/ui/UIController.js';
import { LEVELS } from '../src/config/gameData.js';

function bossSlotDom() {
  return {
    'wave-preview': { hidden: true },
    'boss-hud': { hidden: true, dataset: {}, style: {} },
    'boss-name': { hidden: true, textContent: '', style: {} },
    'wave-preview-title': { textContent: '' },
    'wave-preview-enemies': { innerHTML: '' },
    'boss-hp-fill': { style: {} },
    'boss-hp-text': { textContent: '' },
  };
}

test('build choices render the three packaged tower images', () => {
  const ui = Object.create(UIController.prototype);
  ui.contextKey = null;
  ui.game = {
    level: LEVELS[1], levelId: 1,
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

test('level-four build choices render only the confirmed lineup', () => {
  const ui = Object.create(UIController.prototype);
  ui.contextKey = null;
  ui.game = {
    level: LEVELS[4], levelId: 4, selectedSlot: 0, towers: [null],
    economy: { gold: 300, canAfford: () => true }, state: 'preparation', pendingSellSlot: null,
    blessings: { modifiers: {} }, canManageTowers: () => true,
    availableTowerTypes: () => ['bifang', 'yinglong', 'baize'],
  };
  ui.dom = { 'context-panel': { innerHTML: '' } };
  ui.renderContext();
  assert.match(ui.dom['context-panel'].innerHTML, /tower_bifang_v1\.png/);
  assert.match(ui.dom['context-panel'].innerHTML, /tower_yinglong_v1\.png/);
  assert.match(ui.dom['context-panel'].innerHTML, /tower_baize_v1\.png/);
  assert.doesNotMatch(ui.dom['context-panel'].innerHTML, /tower_fuzhu_v1\.png/);
});

test('lineup renderer marks selection and enables confirm only at exactly three', () => {
  const ui = Object.create(UIController.prototype);
  ui.game = { state: 'lineup', lineupSelection: ['bifang', 'fuzhu', 'baize'] };
  ui.dom = {
    'lineup-overlay': { hidden: true }, 'lineup-choices': { innerHTML: '' },
    'confirm-lineup-button': { disabled: true },
  };
  ui.renderLineup();
  assert.equal(ui.dom['lineup-overlay'].hidden, false);
  assert.equal(ui.dom['confirm-lineup-button'].disabled, false);
  assert.equal((ui.dom['lineup-choices'].innerHTML.match(/aria-pressed="true"/g) ?? []).length, 3);
  assert.match(ui.dom['lineup-choices'].innerHTML, /tower_baize_v1\.png/);
});

test('wave preview renders packaged enemy images and first-level identity', () => {
  const ui = Object.create(UIController.prototype);
  ui.game = {
    level: LEVELS[1], levelId: 1,
    state: 'preparation', enemies: [],
    wave: { waveNumber: 0, queue: [], getWaveGroups: () => [{ type: 'minion', count: 8 }, { type: 'swift', count: 4 }] },
  };
  ui.dom = bossSlotDom();

  ui.renderBossSlot();

  assert.equal(ui.dom['wave-preview-title'].textContent, '第1關・崑崙山門');
  assert.match(ui.dom['wave-preview-enemies'].innerHTML, /assets\/enemies\/enemy_xiaoyao_v1\.png/);
  assert.match(ui.dom['wave-preview-enemies'].innerHTML, /assets\/enemies\/enemy_jiyao_v1\.png/);
});

test('wave enemy status remains visible after combat starts', () => {
  const ui = Object.create(UIController.prototype);
  ui.game = {
    level: LEVELS[1], levelId: 1,
    state: 'combat',
    enemies: [{ type: 'swift', alive: true }, { type: 'giant', alive: true }],
    wave: { waveNumber: 9, queue: ['swift', 'swift', 'giant'], getWaveGroups: () => [{ type: 'swift', count: 12 }, { type: 'giant', count: 6 }] },
  };
  ui.dom = bossSlotDom();

  ui.renderBossSlot();

  assert.equal(ui.dom['wave-preview'].hidden, false);
  assert.equal(ui.dom['wave-preview-title'].textContent, '第1關・崑崙山門');
  assert.match(ui.dom['wave-preview-enemies'].innerHTML, /疾妖 ×3/);
  assert.match(ui.dom['wave-preview-enemies'].innerHTML, /巨妖 ×2/);
});

test('combat enemy counts decrease when enemies leave play', () => {
  const ui = Object.create(UIController.prototype);
  ui.game = {
    level: LEVELS[1], levelId: 1,
    state: 'combat',
    enemies: [{ type: 'swift', alive: true }, { type: 'giant', alive: true }],
    wave: { waveNumber: 9, queue: ['swift', 'swift', 'giant'], getWaveGroups: () => [{ type: 'swift', count: 12 }, { type: 'giant', count: 6 }] },
  };
  ui.dom = bossSlotDom();

  ui.renderBossSlot();
  ui.game.enemies = [{ type: 'giant', alive: true }];
  ui.game.wave.queue = ['swift', 'giant'];
  ui.renderBossSlot();

  assert.match(ui.dom['wave-preview-enemies'].innerHTML, /疾妖 ×1/);
  assert.match(ui.dom['wave-preview-enemies'].innerHTML, /巨妖 ×2/);
});

test('result panel exposes victory and defeat state for the matching skin', () => {
  const ui = Object.create(UIController.prototype);
  ui.game = { state: 'victory', levelId: 1, baseHp: 12, wave: { waveNumber: 10 }, stats: { kills: 99, built: 8 } };
  ui.dom = {
    'result-overlay': { hidden: true }, 'result-panel': { dataset: {} },
    'result-title': { textContent: '' }, 'result-stats': { innerHTML: '' }, 'retry-button': { textContent: '' },
    'next-level-button': { hidden: true },
  };

  ui.renderResult();
  assert.equal(ui.dom['result-panel'].dataset.result, 'victory');
  assert.equal(ui.dom['next-level-button'].hidden, false);

  ui.game.levelId = 2;
  ui.renderResult();
  assert.equal(ui.dom['next-level-button'].hidden, false);
  assert.equal(ui.dom['next-level-button'].textContent, '前往第3關');

  ui.game.levelId = 3;
  ui.renderResult();
  assert.equal(ui.dom['next-level-button'].hidden, false);
  assert.equal(ui.dom['next-level-button'].textContent, '前往第4關');
  assert.match(ui.dom['result-stats'].innerHTML, /新異獸解鎖：白澤/);
  assert.match(ui.dom['result-stats'].innerHTML, /unlock_baize_v1\.png/);

  ui.game.levelId = 4;
  ui.renderResult();
  assert.equal(ui.dom['next-level-button'].hidden, true);

  ui.game.state = 'defeat';
  ui.renderResult();
  assert.equal(ui.dom['result-panel'].dataset.result, 'defeat');
});

test('wave preview and boss HUD use the active second-level identity and art', () => {
  const ui = Object.create(UIController.prototype);
  const boss = { isBoss: true, type: 'paoxiao', hp: 4320, maxHp: 5400, data: { name: '狍鴞' } };
  ui.game = {
    level: LEVELS[2], levelId: 2, state: 'combat', enemies: [boss], effects: [],
    wave: { waveNumber: 10, queue: [], getWaveGroups: () => [] },
  };
  ui.dom = bossSlotDom();

  ui.renderBossSlot();

  assert.equal(ui.dom['boss-name'].textContent, '狍鴞');
  assert.equal(ui.dom['boss-hp-text'].textContent, '4320 / 5400');
  assert.equal(ui.dom['boss-hud'].dataset.bossType, 'paoxiao');
  assert.match(ui.dom['boss-hud'].style.borderImageSource, /ui_boss_paoxiao_panel_v1\.png/);
});

test('level-four wave ten preview uses the phase-one Jiuweihu art', () => {
  const ui = Object.create(UIController.prototype);
  ui.game = {
    level: LEVELS[4], levelId: 4, state: 'preparation', enemies: [],
    wave: { waveNumber: 9, queue: [], getWaveGroups: () => LEVELS[4].waves[9].groups },
  };
  ui.dom = bossSlotDom();
  ui.renderBossSlot();
  assert.match(ui.dom['wave-preview-enemies'].innerHTML, /boss_jiuweihu_phase1_v1\.png/);
});

test('Jiuweihu HP fill follows 100, 50 and 25 percent health', () => {
  const boss = { isBoss: true, type: 'jiuweihu', hp: 4000, maxHp: 4000, data: { name: '九尾狐' } };
  const ui = Object.create(UIController.prototype);
  ui.game = {
    level: LEVELS[4], levelId: 4, state: 'combat', enemies: [boss], effects: [],
    wave: { waveNumber: 10, queue: [], getWaveGroups: () => [] },
  };
  ui.dom = bossSlotDom();

  for (const [hp, width] of [[4000, '100%'], [2000, '50%'], [1000, '25%']]) {
    boss.hp = hp;
    ui.renderBossSlot();
    assert.equal(ui.dom['boss-hp-fill'].style.width, width);
  }
  assert.match(ui.dom['boss-hud'].style.borderImageSource, /ui_boss_jiuweihu_panel_v2\.png/);
});

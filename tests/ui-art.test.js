import test from 'node:test';
import assert from 'node:assert/strict';
import { UIController } from '../src/ui/UIController.js';
import { LEVELS } from '../src/config/gameData.js';

function bossSlotDom() {
  const bossHudStyle = {
    setProperty(name, value) { this[name] = value; },
  };
  return {
    'wave-preview': { hidden: true },
    'boss-hud': { hidden: true, dataset: {}, style: bossHudStyle },
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
  ui.game = {
    level: LEVELS[4], levelId: 4, state: 'lineup', lineupSelection: ['bifang', 'fuzhu', 'baize'],
    lineupRoster: () => ['bifang', 'fuzhu', 'yinglong', 'baize'],
  };
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

test('level-five lineup uses its supplied banner and preview inside the existing overlay', () => {
  const ui = Object.create(UIController.prototype);
  ui.game = {
    level: LEVELS[5], levelId: 5, state: 'lineup', lineupSelection: [],
    lineupRoster: () => ['bifang', 'fuzhu', 'yinglong', 'baize'],
  };
  ui.dom = {
    'lineup-overlay': { hidden: true }, 'lineup-choices': { innerHTML: '' },
    'confirm-lineup-button': { disabled: true }, 'lineup-count': { textContent: '' },
    'lineup-eyebrow': { textContent: '' },
    'lineup-title': { textContent: '' }, 'lineup-help': { innerHTML: '' },
    'lineup-banner': { hidden: true, src: '' }, 'lineup-preview': { hidden: true, src: '' },
  };
  ui.renderLineup();
  assert.equal(ui.dom['lineup-banner'].hidden, false);
  assert.match(ui.dom['lineup-banner'].src, /ui_level5_banner_v1\.png/);
  assert.equal(ui.dom['lineup-preview'].hidden, false);
  assert.match(ui.dom['lineup-preview'].src, /ui_level5_preview_v1\.jpg/);
  assert.equal(ui.dom['lineup-title'].textContent, '第5關・不周山墟');
  assert.equal(ui.dom['lineup-eyebrow'].textContent, '第五關・不周山墟');
  assert.match(ui.dom['lineup-help'].innerHTML, /朱厭與狸力/);
  for (const name of ['畢方', '夫諸', '應龍', '白澤']) assert.match(ui.dom['lineup-choices'].innerHTML, new RegExp(name));
  assert.equal((ui.dom['lineup-choices'].innerHTML.match(/data-action="toggle-lineup"/g) ?? []).length, 4);
});

test('first Level7 lineup marks newly unlocked Jumang and keeps the five-choice roster unchanged', () => {
  const ui = Object.create(UIController.prototype);
  ui.game = {
    level: LEVELS[7], levelId: 7, state: 'lineup', lineupSelection: [], lineupNewType: 'jumang',
    lineupRoster: () => ['bifang', 'fuzhu', 'yinglong', 'baize', 'jumang'],
  };
  ui.dom = {
    'lineup-overlay': { hidden: true }, 'lineup-choices': { innerHTML: '' },
    'confirm-lineup-button': { disabled: true }, 'lineup-count': { textContent: '' },
    'lineup-eyebrow': { textContent: '' }, 'lineup-title': { textContent: '' }, 'lineup-help': { innerHTML: '' },
    'lineup-banner': { hidden: true, src: '' }, 'lineup-preview': { hidden: true, src: '' },
  };
  ui.renderLineup();
  assert.equal((ui.dom['lineup-choices'].innerHTML.match(/data-action="toggle-lineup"/g) ?? []).length, 5);
  assert.match(ui.dom['lineup-choices'].innerHTML, /data-type="jumang"[\s\S]*NEW/);
  assert.match(ui.dom['lineup-choices'].innerHTML, /unlock_jumang_v1\.png/);

  ui.game.lineupNewType = null;
  ui.lineupKey = null;
  ui.renderLineup();
  assert.doesNotMatch(ui.dom['lineup-choices'].innerHTML, />NEW</);
  assert.equal((ui.dom['lineup-choices'].innerHTML.match(/data-action="toggle-lineup"/g) ?? []).length, 5);
});

test('Level8 lineup renders exactly the five owned beasts and excludes locked Xuangui', () => {
  const ui = Object.create(UIController.prototype);
  ui.game = {
    level: LEVELS[8], levelId: 8, state: 'lineup', lineupSelection: [], lineupNewType: null,
    lineupRoster: () => ['bifang', 'fuzhu', 'yinglong', 'baize', 'jumang'],
  };
  ui.dom = {
    'lineup-overlay': { hidden: true }, 'lineup-choices': { innerHTML: '' },
    'confirm-lineup-button': { disabled: true }, 'lineup-count': { textContent: '' },
    'lineup-eyebrow': { textContent: '' }, 'lineup-title': { textContent: '' }, 'lineup-help': { innerHTML: '' },
    'lineup-banner': { hidden: true, src: '' }, 'lineup-preview': { hidden: true, src: '' },
  };
  ui.renderLineup();
  assert.equal((ui.dom['lineup-choices'].innerHTML.match(/data-action="toggle-lineup"/g) ?? []).length, 5);
  assert.doesNotMatch(ui.dom['lineup-choices'].innerHTML, /data-type="xuangui"/);
  assert.equal(ui.dom['lineup-title'].textContent, '第8關・幽冥沼澤');
  assert.match(ui.dom['lineup-help'].innerHTML, /長右與蠱雕/);
});

test('Level8 wave preview and Huashe HUD use approved art and empty-channel geometry', () => {
  const ui = Object.create(UIController.prototype);
  ui.game = {
    level: LEVELS[8], levelId: 8, state: 'preparation', enemies: [], effects: [],
    wave: { waveNumber: 9, queue: [], getWaveGroups: () => LEVELS[8].waves[9].groups },
  };
  ui.dom = bossSlotDom();
  ui.renderBossSlot();
  for (const file of ['enemy_changyou_v1.png', 'enemy_gudiao_v1.png', 'boss_huashe_v1.png']) assert.match(ui.dom['wave-preview-enemies'].innerHTML, new RegExp(file));
  ui.game.state = 'combat';
  ui.game.enemies = [{ isBoss: true, type: 'huashe', hp: 4180, maxHp: 8360, data: { name: '化蛇' } }];
  ui.renderBossSlot();
  assert.match(ui.dom['boss-hud'].style.borderImageSource, /ui_boss_huashe_panel_v1\.png/);
  assert.deepEqual([
    ui.dom['boss-hud'].style['--boss-track-left'], ui.dom['boss-hud'].style['--boss-track-top'],
    ui.dom['boss-hud'].style['--boss-track-width'], ui.dom['boss-hud'].style['--boss-track-height'],
  ], ['11.6%', '60.9%', '76.7%', '17.3%']);
  assert.equal(ui.dom['boss-hp-fill'].style.width, '50%');
});

test('Level7 wave preview and Kui HUD use packaged art and measured track geometry', () => {
  const ui = Object.create(UIController.prototype);
  ui.game = {
    level: LEVELS[7], levelId: 7, state: 'preparation', enemies: [], effects: [],
    wave: { waveNumber: 9, queue: [], getWaveGroups: () => LEVELS[7].waves[9].groups },
  };
  ui.dom = bossSlotDom();
  ui.renderBossSlot();
  for (const file of ['enemy_qinyuan_v1.png', 'enemy_zhuhuai_v1.png', 'boss_kui_v1.png']) assert.match(ui.dom['wave-preview-enemies'].innerHTML, new RegExp(file));

  const boss = { isBoss: true, type: 'kui', hp: 3500, maxHp: 7000, data: { name: '夔' } };
  ui.game.state = 'combat';
  ui.game.enemies = [boss];
  ui.renderBossSlot();
  assert.match(ui.dom['boss-hud'].style.borderImageSource, /ui_boss_kui_panel_v1\.png/);
  assert.deepEqual([
    ui.dom['boss-hud'].style['--boss-track-left'], ui.dom['boss-hud'].style['--boss-track-top'],
    ui.dom['boss-hud'].style['--boss-track-width'], ui.dom['boss-hud'].style['--boss-track-height'],
  ], ['9.9%', '52.6%', '80.4%', '14.2%']);
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
  ui.game = {
    state: 'victory', levelId: 1, baseHp: 12, pendingUnlock: null,
    wave: { waveNumber: 10 }, stats: { kills: 99, built: 8 },
    nextLevelId() { return this.levelId < 6 ? this.levelId + 1 : null; },
  };
  ui.dom = {
    'result-overlay': { hidden: true }, 'result-panel': { dataset: {} },
    'result-title': { textContent: '' }, 'result-stats': { innerHTML: '' }, 'retry-button': { textContent: '' },
    'next-level-button': { hidden: true },
  };
  ui.renderer = { art: { ensureLevel() {} } };
  ui.prefetchedNextLevelId = null;

  ui.renderResult();
  assert.equal(ui.dom['result-panel'].dataset.result, 'victory');
  assert.equal(ui.dom['next-level-button'].hidden, false);
  assert.equal(ui.dom['next-level-button'].textContent, '前往第2關');

  ui.game.levelId = 2;
  ui.renderResult();
  assert.equal(ui.dom['next-level-button'].hidden, false);
  assert.equal(ui.dom['next-level-button'].textContent, '前往第3關');

  ui.game.levelId = 3;
  ui.game.pendingUnlock = 'baize';
  ui.renderResult();
  assert.equal(ui.dom['next-level-button'].hidden, false);
  assert.equal(ui.dom['next-level-button'].textContent, '前往第4關');
  assert.match(ui.dom['result-stats'].innerHTML, /新異獸解鎖：白澤/);
  assert.match(ui.dom['result-stats'].innerHTML, /unlock_baize_v1\.png/);

  ui.game.levelId = 4;
  ui.game.pendingUnlock = null;
  ui.renderResult();
  assert.equal(ui.dom['next-level-button'].hidden, false);
  assert.equal(ui.dom['next-level-button'].textContent, '前往第5關');
  assert.doesNotMatch(ui.dom['result-stats'].innerHTML, /新異獸解鎖：白澤/);

  ui.game.levelId = 5;
  ui.renderResult();
  assert.equal(ui.dom['next-level-button'].hidden, false);
  assert.equal(ui.dom['next-level-button'].textContent, '前往第6關');

  ui.game.levelId = 6;
  ui.game.pendingUnlock = 'jumang';
  ui.renderResult();
  assert.equal(ui.dom['next-level-button'].hidden, true);
  assert.match(ui.dom['result-stats'].innerHTML, /新異獸解鎖：句芒/);

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
  assert.match(ui.dom['boss-hud'].style.borderImageSource, /ui_boss_paoxiao_panel_v2\.png/);
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

test('level-five preview and warning use supplied art while Boss HUD remains programmatic', () => {
  const ui = Object.create(UIController.prototype);
  ui.game = {
    level: LEVELS[5], levelId: 5, state: 'preparation', enemies: [], effects: [],
    wave: { waveNumber: 9, queue: [], getWaveGroups: () => LEVELS[5].waves[9].groups },
    banner: 'BOSS 警告', bannerTimer: 1, bannerArtId: 'level5BossWarning',
  };
  ui.dom = { ...bossSlotDom(), banner: { hidden: true, textContent: '', dataset: {}, style: {} } };
  ui.renderBossSlot();
  assert.match(ui.dom['wave-preview-enemies'].innerHTML, /enemy_zhuyan_v1\.png/);
  assert.match(ui.dom['wave-preview-enemies'].innerHTML, /enemy_lili_v1\.png/);
  assert.match(ui.dom['wave-preview-enemies'].innerHTML, /boss_xingtian_phase1_v1\.png/);
  ui.renderBanner();
  assert.match(ui.dom.banner.style.backgroundImage, /ui_level5_boss_warning_v1\.png/);

  const boss = { isBoss: true, type: 'xingtian', hp: 3335, maxHp: 6670, data: { name: '刑天' } };
  ui.game.enemies = [boss];
  ui.renderBossSlot();
  assert.equal(ui.dom['boss-name'].textContent, '刑天');
  assert.equal(ui.dom['boss-hp-text'].textContent, '3335 / 6670');
});

test('each Boss HUD applies its measured track geometry and follows 100, 50 and 25 percent health', () => {
  const cases = [
    { levelId: 1, type: 'qiongqi', name: '窮奇', panel: /ui_boss_qiongqi_panel_v2\.png/, rect: ['1.5%', '55%', '97%', '14.4%'] },
    { levelId: 2, type: 'paoxiao', name: '狍鴞', panel: /ui_boss_paoxiao_panel_v2\.png/, rect: ['3.9%', '55.6%', '92.1%', '10.3%'] },
    { levelId: 3, type: 'xiangliu', name: '相柳', panel: /ui_boss_xiangliu_panel_v2\.png/, rect: ['0.9%', '55.3%', '98.1%', '10.4%'] },
    { levelId: 4, type: 'jiuweihu', name: '九尾狐', panel: /ui_boss_jiuweihu_panel_v2\.png/, rect: ['15.3%', '61.6%', '78.7%', '11%'] },
    { levelId: 5, type: 'xingtian', name: '刑天', panel: /ui_boss_xingtian_panel_v1\.png/, rect: ['9.7%', '52.3%', '80.8%', '17%'] },
    { levelId: 6, type: 'jinwu', name: '金烏', panel: /ui_boss_jinwu_panel_v1\.png/, rect: ['3.7%', '43.8%', '92.5%', '21.9%'] },
    { levelId: 7, type: 'kui', name: '夔', panel: /ui_boss_kui_panel_v1\.png/, rect: ['9.9%', '52.6%', '80.4%', '14.2%'] },
    { levelId: 8, type: 'huashe', name: '化蛇', panel: /ui_boss_huashe_panel_v1\.png/, rect: ['11.6%', '60.9%', '76.7%', '17.3%'] },
    { levelId: 9, type: 'zhulong', name: '燭龍', panel: /ui_boss_zhulong_panel_v2\.png/, rect: ['14.2%', '59.4%', '71.3%', '12.6%'] },
  ];

  for (const { levelId, type, name, panel, rect } of cases) {
    const boss = { isBoss: true, type, hp: 4000, maxHp: 4000, data: { name } };
    const ui = Object.create(UIController.prototype);
    ui.game = {
      level: LEVELS[levelId], levelId, state: 'combat', enemies: [boss], effects: [],
      wave: { waveNumber: 10, queue: [], getWaveGroups: () => [] },
    };
    ui.dom = bossSlotDom();

    for (const [hp, width] of [[4000, '100%'], [2000, '50%'], [1000, '25%']]) {
      boss.hp = hp;
      ui.renderBossSlot();
      assert.equal(ui.dom['boss-hp-fill'].style.width, width);
    }
    assert.equal(ui.dom['boss-name'].textContent, name);
    assert.match(ui.dom['boss-hud'].style.borderImageSource, panel);
    assert.deepEqual([
      ui.dom['boss-hud'].style['--boss-track-left'],
      ui.dom['boss-hud'].style['--boss-track-top'],
      ui.dom['boss-hud'].style['--boss-track-width'],
      ui.dom['boss-hud'].style['--boss-track-height'],
    ], rect);
  }
});

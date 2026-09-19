import test from 'node:test';
import assert from 'node:assert/strict';
import { BLESSING_DATA, TOWER_DATA, WAVE_DATA } from '../src/config/gameData.js';
import { BlessingSystem } from '../src/systems/BlessingSystem.js';
import { WaveManager } from '../src/systems/WaveManager.js';
import { Enemy } from '../src/entities/Enemy.js';
import { ENEMY_DATA, MAP_DATA } from '../src/config/gameData.js';
import { GameMap } from '../src/map/GameMap.js';
import { Game } from '../src/core/Game.js';
import {
  PLAYABLE_LEVEL_IDS,
  UNLOCK_BY_LEVEL,
  baseOwnedRoster,
  nextPlayableLevelId,
  ownedRosterThrough,
} from '../src/config/progressionData.js';

test('campaign progression is derived from playable levels and unlock data', () => {
  assert.deepEqual(PLAYABLE_LEVEL_IDS, [1, 2, 3, 4, 5, 6]);
  assert.deepEqual(UNLOCK_BY_LEVEL, { 3: 'baize', 6: 'jumang' });
  assert.deepEqual(baseOwnedRoster(), ['bifang', 'fuzhu', 'yinglong']);
  assert.deepEqual(ownedRosterThrough(3), ['bifang', 'fuzhu', 'yinglong', 'baize']);
  assert.deepEqual(ownedRosterThrough(6), ['bifang', 'fuzhu', 'yinglong', 'baize', 'jumang']);
  assert.equal(nextPlayableLevelId(5), 6);
  assert.equal(nextPlayableLevelId(6), null);
});

test('Level5 victory enters an empty Level6 four-beast lineup', () => {
  const game = new Game(() => 0.2, 5);
  game.end('victory');
  assert.equal(game.nextLevelId(), 6);
  assert.equal(game.enterLevel(6), true);
  assert.equal(game.state, 'lineup');
  assert.deepEqual(game.lineupRoster(), ['bifang', 'fuzhu', 'yinglong', 'baize']);
  assert.deepEqual(game.lineupSelection, []);
});

test('lineup eligibility reads the persistent owned roster instead of inferring unlocks from level number', () => {
  const game = new Game(() => 0.2, 6);
  game.unlockedBeasts.delete('baize');
  assert.deepEqual(game.lineupRoster(), ['bifang', 'fuzhu', 'yinglong']);
  game.unlockedBeasts.add('baize');
  assert.deepEqual(game.lineupRoster(), ['bifang', 'fuzhu', 'yinglong', 'baize']);
});

test('Level6 victory unlocks Jumang once and has no Level7 action', () => {
  const game = new Game(() => 0.2, 6);
  game.end('victory');
  assert.equal(game.unlockedBeasts.has('jumang'), true);
  assert.equal(game.pendingUnlock, 'jumang');
  assert.equal(game.nextLevelId(), null);
  game.end('victory');
  assert.equal(game.pendingUnlock, null, 'the unlock presentation is emitted only once');
});

test('blessing draw returns three distinct choices and weights deployed towers', () => {
  const blessings = new BlessingSystem(BLESSING_DATA, () => 0.2);
  const choices = blessings.drawChoices(['bifang']);
  assert.equal(choices.length, 3);
  assert.equal(new Set(choices.map(choice => choice.id)).size, 3);
  assert.ok(blessings.weightFor(BLESSING_DATA.find(b => b.tower === 'bifang'), ['bifang']) > blessings.weightFor(BLESSING_DATA.find(b => b.tower === 'fuzhu'), ['bifang']));
  assert.equal(blessings.select('bifangDamage'), true);
  assert.equal(blessings.select('bifangDamage'), true);
  assert.equal(blessings.select('bifangDamage'), false);
  assert.equal(blessings.stacks.bifangDamage, 2);
  assert.equal(blessings.modifiers.bifangDamage, 0.4);
});

test('capped blessings are removed from later choice pools', () => {
  const blessings = new BlessingSystem(BLESSING_DATA, () => 0);
  blessings.select('bifangDamage');
  blessings.select('bifangDamage');
  const choices = blessings.drawChoices(['bifang']);
  assert.equal(choices.some(choice => choice.id === 'bifangDamage'), false);
});

test('global damage and attack speed blessings also cap at two stacks', () => {
  const blessings = new BlessingSystem(BLESSING_DATA, () => 0.2);
  for (const id of ['allDamage', 'attackSpeed']) {
    assert.equal(blessings.select(id), true);
    assert.equal(blessings.select(id), true);
    assert.equal(blessings.select(id), false);
    assert.equal(blessings.stacks[id], 2);
  }
  assert.equal(blessings.modifiers.allDamage, 0.2);
  assert.equal(blessings.modifiers.attackSpeed, 0.2);
});

test('wave manager expands fixed queues without overlap', () => {
  const manager = new WaveManager(WAVE_DATA);
  manager.start(1);
  assert.equal(manager.queue.length, 8);
  assert.equal(manager.start(2), false);
  manager.queue.length = 0;
  manager.spawnedAlive = 0;
  assert.equal(manager.isComplete(), true);
});

test('wave manager keeps the next enemy queued until the spacing gate opens', () => {
  const manager = new WaveManager([{ groups: [{ type: 'giant', count: 2 }], interval: 0.5 }]);
  const spawned = [];
  let spacingReady = true;
  manager.start(1);

  manager.update(0, type => spawned.push(type), () => spacingReady);
  spacingReady = false;
  manager.update(0.5, type => spawned.push(type), () => spacingReady);

  assert.deepEqual(spawned, ['giant']);
  assert.deepEqual(manager.queue, ['giant']);
  assert.equal(manager.spawnedAlive, 1);

  spacingReady = true;
  manager.update(0, type => spawned.push(type), () => spacingReady);
  assert.deepEqual(spawned, ['giant', 'giant']);
  assert.deepEqual(manager.queue, []);
  assert.equal(manager.spawnedAlive, 2);
});

test('blocked spawn time cannot become interval catch-up debt', () => {
  const manager = new WaveManager([{ groups: [{ type: 'giant', count: 3 }], interval: 0.5 }]);
  const spawned = [];
  let spacingReady = true;
  manager.start(1);

  manager.update(0, type => spawned.push(type), () => spacingReady);
  spacingReady = false;
  manager.update(1.5, type => spawned.push(type), () => spacingReady);
  spacingReady = true;
  manager.update(0, type => spawned.push(type), () => spacingReady);
  manager.update(0.49, type => spawned.push(type), () => spacingReady);

  assert.equal(spawned.length, 2, 'a delayed spawn must begin a fresh interval');
  manager.update(0.02, type => spawned.push(type), () => spacingReady);
  assert.equal(spawned.length, 3);
});

test('wave preview returns the configured groups without duplicating UI wave data', () => {
  const manager = new WaveManager(WAVE_DATA);
  assert.deepEqual(manager.getWaveGroups(8), [
    { type: 'minion', count: 18 },
    { type: 'swift', count: 8 },
    { type: 'giant', count: 5 },
  ]);
  assert.deepEqual(manager.getWaveGroups(11), []);
});

test('qiongqi frenzy triggers exactly once at 50 percent health', () => {
  const boss = new Enemy('qiongqi', ENEMY_DATA.qiongqi, new GameMap(MAP_DATA));
  boss.hp = 1250;
  assert.equal(boss.checkFrenzy(), true);
  assert.equal(boss.speedMultiplier, 1.5);
  assert.equal(boss.checkFrenzy(), false);
});

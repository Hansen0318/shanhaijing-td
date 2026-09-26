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
  assert.deepEqual(PLAYABLE_LEVEL_IDS, [1, 2, 3, 4, 5, 6, 7, 8, 9]);
  assert.deepEqual(UNLOCK_BY_LEVEL, { 3: 'baize', 6: 'jumang', 8: 'xuangui', 9: 'dijiang' });
  assert.deepEqual(baseOwnedRoster(), ['bifang', 'fuzhu', 'yinglong']);
  assert.deepEqual(ownedRosterThrough(3), ['bifang', 'fuzhu', 'yinglong', 'baize']);
  assert.deepEqual(ownedRosterThrough(6), ['bifang', 'fuzhu', 'yinglong', 'baize', 'jumang']);
  assert.deepEqual(ownedRosterThrough(8), ['bifang', 'fuzhu', 'yinglong', 'baize', 'jumang', 'xuangui']);
  assert.equal(nextPlayableLevelId(5), 6);
  assert.equal(nextPlayableLevelId(6), 7);
  assert.equal(nextPlayableLevelId(7), 8);
  assert.equal(nextPlayableLevelId(8), 9);
  assert.equal(nextPlayableLevelId(9), null);
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

test('Level6 victory unlocks Jumang once and enters an empty Level7 five-beast lineup', () => {
  const game = new Game(() => 0.2, 6);
  game.end('victory');
  assert.equal(game.unlockedBeasts.has('jumang'), true);
  assert.equal(game.pendingUnlock, 'jumang');
  assert.equal(game.nextLevelId(), 7);
  assert.equal(game.enterLevel(7), true);
  assert.equal(game.state, 'lineup');
  assert.deepEqual(game.lineupRoster(), ['bifang', 'fuzhu', 'yinglong', 'baize', 'jumang']);
  assert.deepEqual(game.lineupSelection, []);
});

test('Level7 requires exactly three, remains valid without Jumang, and retry clears lineup', () => {
  const game = new Game(() => 0.2, 7);
  for (const type of ['bifang', 'fuzhu']) game.toggleLineup(type);
  assert.equal(game.confirmLineup(), false);
  game.toggleLineup('yinglong');
  assert.equal(game.confirmLineup(), true, 'a three-beast lineup without Jumang remains valid');
  game.end('defeat');
  assert.equal(game.restart(), true);
  assert.equal(game.state, 'lineup');
  assert.deepEqual(game.lineupSelection, []);
  game.end('victory');
  assert.equal(game.nextLevelId(), 8);
});

test('Level7 victory enters an empty Level8 five-beast exact-three lineup', () => {
  const game = new Game(() => 0.2, 7);
  game.end('victory');
  assert.equal(game.enterLevel(8), true);
  assert.equal(game.state, 'lineup');
  assert.deepEqual(game.lineupRoster(), ['bifang', 'fuzhu', 'yinglong', 'baize', 'jumang']);
  assert.deepEqual(game.lineupSelection, []);
  for (const type of ['bifang', 'baize']) game.toggleLineup(type);
  assert.equal(game.confirmLineup(), false);
  game.toggleLineup('jumang');
  assert.equal(game.confirmLineup(), true);
  game.end('defeat');
  assert.equal(game.restart(), true);
  assert.equal(game.state, 'lineup');
  assert.deepEqual(game.lineupSelection, []);
});

test('Level8 victory unlocks Xuangui once and enters Level9 six-beast lineup', () => {
  const game = new Game(() => 0.2, 8);
  assert.equal(game.unlockedBeasts.has('xuangui'), false);
  game.end('victory');
  assert.equal(game.pendingUnlock, 'xuangui');
  assert.equal(game.unlockedBeasts.has('xuangui'), true);
  assert.equal(game.nextLevelId(), 9);
  assert.equal(game.enterLevel(9), true);
  assert.deepEqual(game.lineupRoster(), ['bifang', 'fuzhu', 'yinglong', 'baize', 'jumang', 'xuangui']);
  assert.deepEqual(game.lineupSelection, []);
});

test('Level9 requires exactly three, unlocks Dijiang once, and has no phantom Level10', () => {
  const game = new Game(() => 0.2, 9);
  for (const type of ['xuangui', 'bifang']) game.toggleLineup(type);
  assert.equal(game.confirmLineup(), false);
  game.toggleLineup('jumang');
  assert.equal(game.confirmLineup(), true);
  game.end('defeat');
  assert.equal(game.restart(), true);
  assert.deepEqual(game.lineupSelection, []);
  game.end('victory');
  assert.equal(game.pendingUnlock, 'dijiang');
  assert.equal(game.unlockedBeasts.has('dijiang'), true);
  assert.equal(game.lineupRoster().includes('dijiang'), false, 'future-only Dijiang has no Level9 tower data');
  assert.equal(game.nextLevelId(), null);
  game.end('victory');
  assert.equal(game.pendingUnlock, null);
});



test('blessing eligibility never exposes future or unselected beasts across campaign levels', () => {
  const early = new Game(() => 0, 1);
  assert.deepEqual(early.blessingEligibleTowerTypes(), ['bifang', 'fuzhu', 'yinglong']);
  const earlyChoices = early.blessings.drawChoices([], early.blessingEligibleTowerTypes());
  assert.equal(earlyChoices.some(choice => ['baize', 'jumang', 'xuangui', 'dijiang'].includes(choice.tower)), false);

  const level4 = new Game(() => 0, 4);
  for (const type of ['bifang', 'fuzhu', 'baize']) level4.toggleLineup(type);
  assert.equal(level4.confirmLineup(), true);
  assert.deepEqual(level4.blessingEligibleTowerTypes(), ['bifang', 'fuzhu', 'baize']);
  const level4Choices = level4.blessings.drawChoices([], level4.blessingEligibleTowerTypes());
  assert.equal(level4Choices.some(choice => choice.tower === 'yinglong'), false);
  assert.equal(level4Choices.some(choice => choice.tower === 'jumang'), false);

  const level7 = new Game(() => 0, 7);
  for (const type of ['bifang', 'baize', 'jumang']) level7.toggleLineup(type);
  assert.equal(level7.confirmLineup(), true);
  assert.deepEqual(level7.blessingEligibleTowerTypes(), ['bifang', 'baize', 'jumang']);
  const level7Choices = level7.blessings.drawChoices([], level7.blessingEligibleTowerTypes());
  assert.equal(level7Choices.some(choice => choice.tower === 'xuangui'), false);

  const level9 = new Game(() => 0, 9);
  for (const type of ['fuzhu', 'jumang', 'xuangui']) level9.toggleLineup(type);
  assert.equal(level9.confirmLineup(), true);
  assert.deepEqual(level9.blessingEligibleTowerTypes(), ['fuzhu', 'jumang', 'xuangui']);
  const level9Choices = level9.blessings.drawChoices([], level9.blessingEligibleTowerTypes());
  assert.equal(level9Choices.some(choice => choice.tower && !['fuzhu', 'jumang', 'xuangui'].includes(choice.tower)), false);
});

test('blessing draw returns three distinct choices and weights deployed towers', () => {
  const blessings = new BlessingSystem(BLESSING_DATA, () => 0.2);
  const choices = blessings.drawChoices(['bifang'], ['bifang', 'fuzhu', 'yinglong']);
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
  const choices = blessings.drawChoices(['bifang'], ['bifang', 'fuzhu', 'yinglong']);
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

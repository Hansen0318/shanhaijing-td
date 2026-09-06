import test from 'node:test';
import assert from 'node:assert/strict';
import { BLESSING_DATA, TOWER_DATA, WAVE_DATA } from '../src/config/gameData.js';
import { BlessingSystem } from '../src/systems/BlessingSystem.js';
import { WaveManager } from '../src/systems/WaveManager.js';
import { Enemy } from '../src/entities/Enemy.js';
import { ENEMY_DATA, MAP_DATA } from '../src/config/gameData.js';
import { GameMap } from '../src/map/GameMap.js';

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

import test from 'node:test';
import assert from 'node:assert/strict';
import { GAME_CONFIG, TOWER_DATA, ENEMY_DATA, WAVE_DATA, BLESSING_DATA, MAP_DATA } from '../src/config/gameData.js';
import { Economy } from '../src/systems/Economy.js';
import { GameTime } from '../src/core/Time.js';
import { GameMap } from '../src/map/GameMap.js';
import { Enemy } from '../src/entities/Enemy.js';
import { Tower } from '../src/entities/Tower.js';

test('configuration contains the complete V0.01 roster and waves', () => {
  assert.equal(GAME_CONFIG.initialGold, 300);
  assert.equal(GAME_CONFIG.baseHp, 20);
  assert.deepEqual(Object.keys(TOWER_DATA), ['bifang', 'fuzhu', 'yinglong']);
  assert.deepEqual(Object.keys(ENEMY_DATA), ['minion', 'swift', 'giant', 'qiongqi']);
  assert.equal(WAVE_DATA.length, 10);
  assert.equal(BLESSING_DATA.length, 12);
  assert.equal(MAP_DATA.slots.length, 8);
  assert.deepEqual(WAVE_DATA[9].groups, [{ type: 'minion', count: 4 }, { type: 'qiongqi', count: 1 }]);
});

test('economy spends, rewards, upgrades and sells exactly', () => {
  const economy = new Economy(300);
  assert.equal(economy.spend(160), true);
  assert.equal(economy.gold, 140);
  assert.equal(economy.spend(160), false);
  assert.equal(economy.gold, 140);
  economy.reward(10, 1.2);
  assert.equal(economy.gold, 152);
  assert.equal(Economy.upgradeCost(TOWER_DATA.bifang, 1), 96);
  assert.equal(Economy.upgradeCost(TOWER_DATA.bifang, 2), 144);
  assert.equal(Economy.sellValue(120 + 96 + 144), 216);
});

test('one time scale changes all simulation delta and pause stops it', () => {
  const time = new GameTime();
  assert.equal(time.step(0.05), 0.05);
  time.setScale(2);
  assert.equal(time.step(0.05), 0.1);
  time.setPaused(true);
  assert.equal(time.step(0.05), 0);
});

test('enemy follows waypoints and deals base damage at the end', () => {
  const map = new GameMap(MAP_DATA);
  const enemy = new Enemy('giant', ENEMY_DATA.giant, map);
  enemy.update(999);
  assert.equal(enemy.reachedBase, true);
  assert.equal(enemy.baseDamage, 3);
});

test('tower level stats use cumulative damage and specialties', () => {
  const bifang = new Tower('bifang', TOWER_DATA.bifang, MAP_DATA.slots[0]);
  bifang.level = 3;
  assert.equal(bifang.getStats().damage, 30.42);
  assert.ok(bifang.getStats().explosionRadius > 55);
  const fuzhu = new Tower('fuzhu', TOWER_DATA.fuzhu, MAP_DATA.slots[1]);
  fuzhu.level = 3;
  assert.ok(fuzhu.getStats().slow > 0.25);
  const yinglong = new Tower('yinglong', TOWER_DATA.yinglong, MAP_DATA.slots[2]);
  yinglong.level = 3;
  assert.equal(yinglong.getStats().penetration, 3);
});

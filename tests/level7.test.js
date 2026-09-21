import test from 'node:test';
import assert from 'node:assert/strict';
import {
  ENEMY_DATA,
  LEVEL7_MAP_DATA,
  LEVEL7_WAVE_DATA,
  LEVELS,
  TOWER_DATA,
  getLevelData,
} from '../src/config/gameData.js';

const GEOMETRY_V3 = [
  [40,34],[45,77],[81,93],[124,106],[165,120],[183,128],[190,147],[224,157],
  [259,181],[251,206],[199,230],[156,249],[169,269],[209,291],[242,308],[241,331],
  [200,353],[178,375],[195,391],[226,405],[263,425],[307,450],[323,480],[343,497],
].map(([x, y]) => ({ x, y }));

test('Level7 defines the frozen identity, Geometry V3, enemies, tower and Waves', () => {
  const level = getLevelData(7);
  assert.equal(level, LEVELS[7]);
  assert.deepEqual(
    { id: level.id, name: level.name, baseName: level.baseName, bossType: level.bossType },
    { id: 7, name: '雷澤天野', baseName: '震木神壇', bossType: 'kui' },
  );
  assert.equal(level.map, LEVEL7_MAP_DATA);
  assert.deepEqual(level.map.waypoints, GEOMETRY_V3);
  assert.deepEqual(level.map.slots, [
    { x: 138, y: 78 }, { x: 294, y: 124 }, { x: 135, y: 161 }, { x: 97, y: 259 },
    { x: 287, y: 249 }, { x: 293, y: 358 }, { x: 138, y: 423 }, { x: 258, y: 464 },
  ]);
  assert.deepEqual(level.map.thunderZones, [
    { id: 'A', x: 187, y: 116, width: 63, height: 42 },
    { id: 'B', x: 153, y: 360, width: 66, height: 49 },
  ]);
  assert.deepEqual(
    Object.fromEntries(['qinyuan', 'zhuhuai', 'kui'].map(type => [type, ENEMY_DATA[type]])),
    {
      qinyuan: { id: 'qinyuan', name: '欽原', emoji: '🐝', hp: 100, speed: 88, baseDamage: 1, reward: 14, radius: 11 },
      zhuhuai: { id: 'zhuhuai', name: '諸懷', emoji: '🐂', hp: 390, speed: 25, baseDamage: 3, reward: 30, radius: 18 },
      kui: { id: 'kui', name: '夔', emoji: '⚡', hp: 7000, speed: 16, baseDamage: 20, reward: 0, radius: 29, isBoss: true, bossMechanic: { type: 'kui' } },
    },
  );
  assert.deepEqual(TOWER_DATA.jumang, {
    id: 'jumang', name: '句芒', emoji: '🌿', role: '全隊增益', cost: 130,
    damage: 10, interval: 1.15, range: 138, projectileSpeed: 380,
  });
  assert.equal(level.waves, LEVEL7_WAVE_DATA);
  assert.deepEqual(level.waves.map(wave => wave.groups), [
    [{ type: 'qinyuan', count: 6 }],
    [{ type: 'qinyuan', count: 8 }],
    [{ type: 'qinyuan', count: 6 }, { type: 'zhuhuai', count: 2 }],
    [{ type: 'zhuhuai', count: 4 }],
    [{ type: 'qinyuan', count: 10 }, { type: 'zhuhuai', count: 3 }],
    [{ type: 'qinyuan', count: 14 }, { type: 'zhuhuai', count: 4 }],
    [{ type: 'qinyuan', count: 10 }, { type: 'zhuhuai', count: 6 }],
    [{ type: 'qinyuan', count: 16 }, { type: 'zhuhuai', count: 6 }],
    [{ type: 'qinyuan', count: 18 }, { type: 'zhuhuai', count: 8 }],
    [{ type: 'qinyuan', count: 8 }, { type: 'zhuhuai', count: 4 }, { type: 'kui', count: 1 }],
  ]);
  assert.deepEqual(level.waves.map(wave => wave.interval), [1.1, 1, 1, 1.05, 0.9, 0.78, 0.82, 0.7, 0.64, 0.84]);
  assert.deepEqual(level.waves.map(wave => wave.hpMultiplier ?? 1), [1, 1, 1, 1, 1.05, 1.1, 1.15, 1.22, 1.3, 1.18]);
  assert.equal(level.waves[9].bossHpMultiplier, 1.1);
});

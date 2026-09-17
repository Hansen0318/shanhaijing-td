import test from 'node:test';
import assert from 'node:assert/strict';
import { ENEMY_DATA, LEVELS, getLevelData } from '../src/config/gameData.js';
import { Game } from '../src/core/Game.js';
import { Enemy } from '../src/entities/Enemy.js';
import { GameMap } from '../src/map/GameMap.js';
import { BossSystem } from '../src/systems/BossSystem.js';
import { StatusSystem } from '../src/systems/StatusSystem.js';
import { WaveManager } from '../src/systems/WaveManager.js';
import { minimumEnemyPathSpacing } from '../src/config/enemyVisuals.js';

function distanceToSegment(point, from, to) {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const lengthSquared = dx * dx + dy * dy;
  const t = lengthSquared ? Math.max(0, Math.min(1, ((point.x - from.x) * dx + (point.y - from.y) * dy) / lengthSquared)) : 0;
  return Math.hypot(point.x - (from.x + dx * t), point.y - (from.y + dy * t));
}

function distanceToPath(point, waypoints) {
  return Math.min(...waypoints.slice(1).map((to, index) => distanceToSegment(point, waypoints[index], to)));
}

test('level three defines Ruoshui identity, ten waves, eight slots and Xiangliu finale', () => {
  const level = getLevelData(3);
  assert.equal(level, LEVELS[3]);
  assert.deepEqual(
    { id: level.id, name: level.name, baseName: level.baseName, bossType: level.bossType },
    { id: 3, name: '弱水幽谷', baseName: '玄水祭壇', bossType: 'xiangliu' },
  );
  assert.equal(level.waves.length, 10);
  assert.equal(level.map.slots.length, 8);
  assert.equal(level.waves[9].groups.at(-1).type, 'xiangliu');
});

test('level-three recalibrated anchors preserve all eight painted platforms', () => {
  const map = LEVELS[3].map;
  assert.ok(map.waypoints.length >= 40, 'dense manual anchors are required around S bends');
  assert.deepEqual(map.slots, [
    { x: 132, y: 61 }, { x: 288, y: 88 }, { x: 121, y: 165 }, { x: 344, y: 190 },
    { x: 190, y: 283 }, { x: 350, y: 348 }, { x: 153, y: 434 }, { x: 323, y: 492 },
  ]);
  for (const point of [{ x: 281, y: 226 }, { x: 132, y: 308 }, { x: 289, y: 434 }, { x: 154, y: 500 }]) {
    assert.ok(distanceToPath(point, map.waypoints) <= 0.01);
  }
});

test('level three uses weaker smoothing over denser manual road anchors', () => {
  const game = new Game(() => 0.2, 3);
  assert.equal(game.level.map.pathSmoothing, 2);
  assert.ok(game.map.waypoints.length > game.level.map.waypoints.length);
  for (const waypoint of game.level.map.waypoints) {
    assert.ok(game.map.waypoints.some(point => Math.hypot(point.x - waypoint.x, point.y - waypoint.y) <= 0.01));
  }
});

test('level-three runtime curve remains centered on independently measured Ruoshui road samples', () => {
  const runtimePath = new GameMap(LEVELS[3].map).waypoints;
  const paintedRoadCenters = [
    { x: 20, y: 40 }, { x: 80, y: 78 }, { x: 150, y: 148 }, { x: 240, y: 176 },
    { x: 278, y: 215 }, { x: 270, y: 245 }, { x: 200, y: 264 }, { x: 145, y: 284 },
    { x: 133, y: 310 }, { x: 165, y: 340 }, { x: 245, y: 362 }, { x: 280, y: 395 },
    { x: 288, y: 440 }, { x: 260, y: 472 }, { x: 190, y: 493 }, { x: 110, y: 514 },
    { x: 45, y: 552 },
  ];

  for (const point of paintedRoadCenters) {
    assert.ok(distanceToPath(point, runtimePath) <= 10, `path misses painted road center near ${point.x},${point.y}`);
  }
});

test('level-three large enemies wait at spawn until their silhouettes have a visible gap', () => {
  const game = new Game(() => 0.2, 3);
  game.wave = new WaveManager([{ groups: [{ type: 'xuanjiashou', count: 2 }], interval: 0.5 }]);
  game.state = 'combat';
  game.time.setPaused(false);
  game.wave.start(1);

  game.update(0);
  for (let step = 0; step < 5; step += 1) game.update(0.1);

  assert.equal(game.enemies.length, 1, 'fixed interval alone must not fuse two 52px enemy silhouettes');
  assert.deepEqual(game.wave.queue, ['xuanjiashou']);

  for (let step = 0; step < 19; step += 1) game.update(0.1);
  assert.equal(game.enemies.length, 2);
  const required = minimumEnemyPathSpacing('xuanjiashou', 'xuanjiashou');
  assert.ok(
    game.enemies[0].pathDistance - game.enemies[1].pathDistance >= required,
    'rendered silhouettes need a 6px visible gap before the next spawn',
  );
});

test('level three water speed and waves one to three are eased again while wave four stays unchanged', () => {
  const waves = LEVELS[3].waves;
  assert.equal(ENEMY_DATA.shuixiao.speed, 90);
  assert.equal(ENEMY_DATA.shuixiao.weakWaterSpeedMultiplier, 1.25);
  assert.equal(ENEMY_DATA.shuixiao.speed * ENEMY_DATA.shuixiao.weakWaterSpeedMultiplier, 112.5);
  assert.deepEqual(waves[0], { groups: [{ type: 'shuixiao', count: 6 }], interval: 1.1 });
  assert.deepEqual(waves[1], { groups: [{ type: 'shuixiao', count: 8 }], interval: 1 });
  assert.deepEqual(waves[2], { groups: [{ type: 'shuixiao', count: 6 }, { type: 'xuanjiashou', count: 1 }], interval: 1 });
  assert.deepEqual(waves[3], { groups: [{ type: 'xuanjiashou', count: 7 }], interval: 1.02, hpMultiplier: 1.05 });
});

test('level two victory enters a clean level three and level three victory unlocks the level-four lineup', () => {
  const game = new Game(() => 0.2);
  game.end('victory');
  assert.equal(game.enterLevel(2), true);
  game.buildTower(0, 'bifang');
  game.blessings.select('allDamage');
  game.baseHp = 4;
  game.stats.kills = 30;
  game.end('victory');

  assert.equal(game.enterLevel(3), true);
  assert.equal(game.levelId, 3);
  assert.equal(game.state, 'preparation');
  assert.equal(game.baseHp, 20);
  assert.equal(game.economy.gold, 300);
  assert.equal(game.wave.waveNumber, 0);
  assert.equal(game.towers.every(tower => tower === null), true);
  assert.deepEqual(game.blessings.stacks, {});

  game.end('victory');
  assert.equal(game.unlockedBeasts.has('baize'), true);
  game.restart();
  assert.equal(game.unlockedBeasts.has('baize'), true, 'unlock record must survive a retry reset');
  game.end('victory');
  assert.equal(game.enterLevel(4), true);
  assert.equal(game.state, 'lineup');
});

test('weak water modifies actual movement without changing path or render coordinates', () => {
  const mapData = {
    width: 390, height: 610, pathWidth: 54,
    waypoints: [{ x: 0, y: 0 }, { x: 300, y: 0 }],
    weakWaterZones: [{ x: 0, y: -20, width: 300, height: 40 }],
    slots: [],
  };
  const map = new GameMap(mapData);
  const normal = new Enemy('minion', { ...ENEMY_DATA.minion, speed: 100 }, map);
  const shuixiao = new Enemy('shuixiao', { ...ENEMY_DATA.shuixiao, speed: 100 }, map);
  const xuanjia = new Enemy('xuanjiashou', { ...ENEMY_DATA.xuanjiashou, speed: 100 }, map);
  StatusSystem.applySlow(xuanjia, 0.4, 2);

  normal.update(1);
  shuixiao.update(1);
  xuanjia.update(1);

  assert.equal(normal.pathDistance, 85);
  assert.equal(shuixiao.pathDistance, 125);
  assert.equal(xuanjia.pathDistance, 68, '40% slow at 50% effectiveness combines with weak-water 0.85×');
  assert.deepEqual({ x: normal.x, y: normal.y }, map.positionAt(normal.pathDistance));
});

test('Xiangliu heals six and eight percent once, then enrages once at 25 percent', () => {
  const data = ENEMY_DATA.xiangliu;
  const boss = new Enemy('xiangliu', data, new GameMap({
    width: 390, height: 610, pathWidth: 54,
    waypoints: [{ x: 0, y: 0 }, { x: 300, y: 0 }], slots: [],
  }));

  boss.hp = boss.maxHp * 0.75;
  assert.deepEqual(BossSystem.check(boss), [{ type: 'heal', threshold: 0.75, healAmount: Math.round(boss.maxHp * 0.06) }]);
  assert.deepEqual(BossSystem.check(boss), []);

  boss.hp = boss.maxHp * 0.5;
  assert.deepEqual(BossSystem.check(boss), [{ type: 'heal', threshold: 0.5, healAmount: Math.round(boss.maxHp * 0.08) }]);
  assert.deepEqual(BossSystem.check(boss), []);

  boss.hp = boss.maxHp * 0.25;
  assert.deepEqual(BossSystem.check(boss), [{ type: 'frenzy', threshold: 0.25 }]);
  assert.equal(boss.speedMultiplier, 1.2);
  assert.deepEqual(BossSystem.check(boss), []);
});

test('all boss arrival and frenzy banners use the unified wording', () => {
  for (const [levelId, bossType] of [[1, 'qiongqi'], [2, 'paoxiao'], [3, 'xiangliu']]) {
    const game = new Game(() => 0.2, levelId);
    game.spawnEnemy(bossType);
    assert.equal(game.banner, `Boss現身：${ENEMY_DATA[bossType].name}`);
  }

  const game = new Game(() => 0.2, 3);
  game.spawnEnemy('xiangliu');
  game.state = 'combat';
  game.time.setPaused(false);
  const boss = game.enemies[0];
  boss.triggeredBossThresholds.add(0.75);
  boss.triggeredBossThresholds.add(0.5);
  boss.hp = boss.maxHp * 0.25;
  game.update(0);
  assert.equal(game.bannerQueue.at(-1).text, '相柳 狂暴化！');
});

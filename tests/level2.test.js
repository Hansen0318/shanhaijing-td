import test from 'node:test';
import assert from 'node:assert/strict';
import { ENEMY_DATA, LEVELS, MAP_DATA, getLevelData } from '../src/config/gameData.js';
import { Game } from '../src/core/Game.js';
import { Enemy } from '../src/entities/Enemy.js';
import { GameMap } from '../src/map/GameMap.js';
import { BossSystem } from '../src/systems/BossSystem.js';

test('level two data defines Chishui identity, ten waves and eight tactical slots', () => {
  const level = getLevelData(2);
  assert.equal(level, LEVELS[2]);
  assert.deepEqual(
    { id: level.id, name: level.name, baseName: level.baseName, bossType: level.bossType },
    { id: 2, name: '赤水荒原', baseName: '赤水古寨', bossType: 'paoxiao' },
  );
  assert.equal(level.waves.length, 10);
  assert.equal(level.map.slots.length, 8);
  assert.deepEqual(level.waves[9].groups, [
    { type: 'chiyu', count: 10 },
    { type: 'yanjia', count: 4 },
    { type: 'paoxiao', count: 1 },
  ]);
  assert.equal(level.waves[9].hpMultiplier, 1.55);
  assert.equal(level.waves[9].bossHpMultiplier, 1.5);
});

test('level two enemy values and fixed wave groups match the approved first pass', () => {
  assert.deepEqual(
    ['chiyu', 'yanjia', 'paoxiao'].map(type => {
      const enemy = ENEMY_DATA[type];
      return [type, enemy.hp, enemy.speed, enemy.baseDamage, enemy.reward];
    }),
    [['chiyu', 34, 108, 1, 9], ['yanjia', 170, 28, 2, 20], ['paoxiao', 3600, 19, 20, 0]],
  );
  assert.deepEqual(LEVELS[2].waves.map(item => item.groups), [
    [{ type: 'minion', count: 10 }],
    [{ type: 'chiyu', count: 12 }],
    [{ type: 'minion', count: 8 }, { type: 'chiyu', count: 10 }],
    [{ type: 'yanjia', count: 6 }],
    [{ type: 'swift', count: 8 }, { type: 'yanjia', count: 6 }],
    [{ type: 'chiyu', count: 20 }, { type: 'minion', count: 8 }],
    [{ type: 'yanjia', count: 8 }, { type: 'giant', count: 5 }],
    [{ type: 'chiyu', count: 16 }, { type: 'swift', count: 10 }, { type: 'yanjia', count: 6 }],
    [{ type: 'minion', count: 12 }, { type: 'chiyu', count: 18 }, { type: 'yanjia', count: 8 }, { type: 'giant', count: 4 }],
    [{ type: 'chiyu', count: 10 }, { type: 'yanjia', count: 4 }, { type: 'paoxiao', count: 1 }],
  ]);
});

test('all eight level-two slot centers share hit, build and tower coordinates', () => {
  const game = new Game(() => 0.2);
  game.end('victory');
  game.enterLevel(2);
  game.economy.add(1000);
  game.level.map.slots.forEach((slot, index) => {
    assert.equal(game.map.slotAt(slot, 34), index);
    assert.equal(game.buildTower(index, 'fuzhu').ok, true);
    assert.deepEqual({ x: game.towers[index].x, y: game.towers[index].y }, slot);
  });
});

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

test('level-two gameplay path stays near sampled centers of the painted Chishui road', () => {
  const paintedRoadCenters = [
    { x: 25, y: 88 }, { x: 75, y: 137 }, { x: 165, y: 145 }, { x: 213, y: 190 },
    { x: 285, y: 215 }, { x: 378, y: 248 }, { x: 330, y: 282 }, { x: 220, y: 265 },
    { x: 105, y: 240 }, { x: 20, y: 310 }, { x: 65, y: 374 }, { x: 175, y: 375 },
    { x: 225, y: 410 }, { x: 232, y: 462 }, { x: 280, y: 500 }, { x: 360, y: 510 },
  ];

  paintedRoadCenters.forEach(point => {
    assert.ok(distanceToPath(point, LEVELS[2].map.waypoints) <= 12, `path misses painted road center near ${point.x},${point.y}`);
  });
});

test('level-one gameplay path remains near sampled centers of the painted Kunlun road', () => {
  const paintedRoadCenters = [
    { x: 20, y: 70 }, { x: 150, y: 70 }, { x: 280, y: 70 }, { x: 310, y: 170 },
    { x: 250, y: 204 }, { x: 100, y: 236 }, { x: 68, y: 300 }, { x: 65, y: 370 },
    { x: 180, y: 402 }, { x: 310, y: 428 }, { x: 360, y: 495 },
  ];

  paintedRoadCenters.forEach(point => {
    assert.ok(distanceToPath(point, MAP_DATA.waypoints) <= 12, `path misses painted road center near ${point.x},${point.y}`);
  });
});

test('paoxiao uses the unified boss arrival banner and keeps its consume banner', () => {
  const game = new Game(() => 0.2);
  game.end('victory');
  game.enterLevel(2);
  game.wave.waveNumber = 9;
  game.startWaveNow();
  game.spawnEnemy('paoxiao');
  const boss = game.enemies.at(-1);
  boss.hp = boss.maxHp * 0.7;
  game.update(0);

  assert.deepEqual(
    [game.banner, ...game.bannerQueue.map(item => item.text)],
    ['BOSS 警告', 'Boss 現身・狍鴞', '狍鴞吞噬妖氣！'],
  );
});

test('only level-one victory can enter level two and the new run is clean', () => {
  const game = new Game(() => 0.2);
  game.buildTower(0, 'bifang');
  game.blessings.select('allDamage');
  game.baseHp = 7;
  game.wave.waveNumber = 10;
  game.effects.push({ type: 'gold', life: 1 });
  game.stats.kills = 25;

  assert.equal(game.enterLevel(2), false);
  game.end('victory');
  assert.equal(game.enterLevel(2), true);

  assert.equal(game.levelId, 2);
  assert.equal(game.level.name, '赤水荒原');
  assert.equal(game.state, 'preparation');
  assert.equal(game.baseHp, 20);
  assert.equal(game.economy.gold, 300);
  assert.equal(game.wave.waveNumber, 0);
  assert.equal(game.towers.length, 8);
  assert.equal(game.towers.every(tower => tower === null), true);
  assert.deepEqual(game.blessings.stacks, {});
  assert.deepEqual(game.effects, []);
  assert.deepEqual(game.stats, { kills: 0, built: 0 });
});

test('restart keeps the active level while resetting its run', () => {
  const game = new Game(() => 0.2);
  game.end('victory');
  game.enterLevel(2);
  game.economy.add(500);
  game.wave.waveNumber = 6;

  game.restart();

  assert.equal(game.levelId, 2);
  assert.equal(game.level.baseName, '赤水古寨');
  assert.equal(game.economy.gold, 300);
  assert.equal(game.wave.waveNumber, 0);
});

test('second-level victory does not expose an unimplemented third level', () => {
  const game = new Game(() => 0.2);
  game.end('victory');
  game.enterLevel(2);
  game.end('victory');
  assert.equal(game.enterLevel(3), false);
  assert.equal(game.levelId, 2);
});

test('paoxiao consumes twice at 70 and 40 percent and heals eight percent each time', () => {
  const level = getLevelData(2);
  const data = {
    hp: 5400, speed: 19, baseDamage: 20, reward: 0, radius: 24, isBoss: true,
    bossMechanic: { type: 'consume', thresholds: [0.7, 0.4], healRatio: 0.08 },
  };
  const boss = new Enemy('paoxiao', data, new GameMap(level.map));

  boss.hp = 3700;
  const first = BossSystem.check(boss);
  assert.equal(first.length, 1);
  assert.deepEqual(first[0], { type: 'consume', threshold: 0.7, healAmount: 432 });
  assert.equal(boss.hp, 4132);
  assert.deepEqual(BossSystem.check(boss), []);

  boss.hp = 2100;
  const second = BossSystem.check(boss);
  assert.deepEqual(second, [{ type: 'consume', threshold: 0.4, healAmount: 432 }]);
  assert.equal(boss.hp, 2532);
  assert.deepEqual(BossSystem.check(boss), []);
});

test('level two wave ten spawns a 5400 HP paoxiao and victory waits for its death', () => {
  const game = new Game(() => 0.2);
  game.end('victory');
  game.enterLevel(2);
  game.wave.waveNumber = 9;
  game.startWaveNow();
  game.spawnEnemy('paoxiao');
  const boss = game.enemies.at(-1);

  assert.equal(boss.maxHp, 5400);
  game.wave.queue = [];
  game.wave.spawnedAll = true;
  game.wave.alive = 1;
  game.update(0);
  assert.equal(game.state, 'combat');

  boss.takeDamage(boss.maxHp);
  game.update(0);
  assert.equal(game.state, 'victory');
});

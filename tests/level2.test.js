import test from 'node:test';
import assert from 'node:assert/strict';
import { ENEMY_DATA, LEVELS, getLevelData } from '../src/config/gameData.js';
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

test('level-two waypoints follow the painted Chishui road center', () => {
  assert.deepEqual(LEVELS[2].map.waypoints, [
    { x: -20, y: 86 }, { x: 20, y: 86 }, { x: 55, y: 156 }, { x: 195, y: 156 },
    { x: 220, y: 233 }, { x: 365, y: 233 }, { x: 380, y: 263 }, { x: 350, y: 293 },
    { x: 75, y: 268 }, { x: 48, y: 303 }, { x: 48, y: 368 }, { x: 72, y: 393 },
    { x: 195, y: 403 }, { x: 225, y: 433 }, { x: 238, y: 488 }, { x: 365, y: 518 },
    { x: 410, y: 568 },
  ]);
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

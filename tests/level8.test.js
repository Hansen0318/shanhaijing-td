import test from 'node:test';
import assert from 'node:assert/strict';
import {
  BLESSING_DATA,
  ENEMY_DATA,
  LEVEL8_MAP_DATA,
  LEVEL8_WAVE_DATA,
  LEVELS,
  TOWER_DATA,
} from '../src/config/gameData.js';
import { Game } from '../src/core/Game.js';
import { Projectile } from '../src/entities/Projectile.js';
import { Tower } from '../src/entities/Tower.js';
import { BossSystem } from '../src/systems/BossSystem.js';
import { BlessingSystem } from '../src/systems/BlessingSystem.js';
import { CombatSystem } from '../src/systems/CombatSystem.js';
import { StatusSystem } from '../src/systems/StatusSystem.js';
import { TideSystem } from '../src/systems/TideSystem.js';
import { WaveManager } from '../src/systems/WaveManager.js';

test('Level8 uses the frozen 幽冥沼澤 identity and exact runtime geometry', () => {
  const level = LEVELS[8];
  assert.equal(level.name, '幽冥沼澤');
  assert.equal(level.bossType, 'huashe');
  assert.equal(level.bossVictoryRequiresWaveClear, true);
  assert.equal(level.art.background, 'level8Background');
  assert.deepEqual(level.art.backgroundCrop, { x: 0, y: 0, width: 780, height: 1220 });
  assert.deepEqual(LEVEL8_MAP_DATA.waypoints, [
    { x: 44, y: 33 }, { x: 65, y: 60 }, { x: 135, y: 85 }, { x: 225, y: 99 },
    { x: 303, y: 116 }, { x: 340, y: 147 }, { x: 314, y: 188 }, { x: 247, y: 210 },
    { x: 172, y: 240 }, { x: 196, y: 272 }, { x: 247, y: 307 }, { x: 164, y: 339 },
    { x: 120, y: 366 }, { x: 175, y: 404 }, { x: 250, y: 425 }, { x: 281, y: 452 },
    { x: 248, y: 494 }, { x: 231, y: 519 },
  ]);
  assert.deepEqual(LEVEL8_MAP_DATA.slots, [
    { x: 115, y: 114 }, { x: 289, y: 156 }, { x: 142, y: 211 }, { x: 269, y: 272 },
    { x: 104, y: 313 }, { x: 267, y: 386 }, { x: 113, y: 421 }, { x: 342, y: 462 },
  ]);
  assert.deepEqual(LEVEL8_MAP_DATA.wetlandZones, [
    { id: 'A', points: [{ x: 292, y: 121 }, { x: 325, y: 126 }, { x: 348, y: 141 }, { x: 350, y: 166 }, { x: 334, y: 189 }, { x: 305, y: 199 }, { x: 285, y: 186 }, { x: 292, y: 161 }] },
    { id: 'B', points: [{ x: 166, y: 238 }, { x: 202, y: 231 }, { x: 235, y: 247 }, { x: 252, y: 273 }, { x: 248, y: 301 }, { x: 222, y: 319 }, { x: 186, y: 314 }, { x: 168, y: 287 }] },
    { id: 'C', points: [{ x: 172, y: 399 }, { x: 210, y: 395 }, { x: 250, y: 409 }, { x: 283, y: 433 }, { x: 294, y: 459 }, { x: 280, y: 485 }, { x: 247, y: 499 }, { x: 225, y: 477 }, { x: 225, y: 449 }, { x: 198, y: 428 }] },
  ]);
  assert.deepEqual(LEVEL8_MAP_DATA.environmentMotion, {
    fog: { x: 8, y: 147, width: 86, height: 66 },
    ripple: { x: 205, y: 124, width: 78, height: 55 },
    bubbles: { x: 304, y: 210, width: 69, height: 63 },
    reeds: { x: 247, y: 287, width: 52, height: 46 },
  });
});

test('Level8 runtime interpolation keeps every frozen anchor while smoothing phone-visible hairpins', () => {
  const game = new Game(() => 0.2, 8);
  for (const anchor of LEVEL8_MAP_DATA.waypoints) {
    assert.equal(game.map.waypoints.some(point => point.x === anchor.x && point.y === anchor.y), true,
      `runtime path dropped frozen anchor ${anchor.x},${anchor.y}`);
  }

  let maximumTurn = 0;
  for (let index = 1; index < game.map.waypoints.length - 1; index += 1) {
    const previous = game.map.waypoints[index - 1];
    const point = game.map.waypoints[index];
    const next = game.map.waypoints[index + 1];
    const incoming = Math.atan2(point.y - previous.y, point.x - previous.x);
    const outgoing = Math.atan2(next.y - point.y, next.x - point.x);
    let turn = Math.abs(outgoing - incoming);
    if (turn > Math.PI) turn = Math.PI * 2 - turn;
    maximumTurn = Math.max(maximumTurn, turn);
  }
  assert.ok(maximumTurn * 180 / Math.PI <= 20,
    `runtime path contains a ${Math.round(maximumTurn * 180 / Math.PI)}° phone-visible kink`);
});

test('Level8 W1-W10 and frozen enemy/tower values match canonical production data', () => {
  assert.deepEqual(LEVEL8_WAVE_DATA, [
    { groups: [{ type: 'changyou', count: 6 }], interval: 1.1 },
    { groups: [{ type: 'changyou', count: 8 }], interval: 1 },
    { groups: [{ type: 'changyou', count: 6 }, { type: 'gudiao', count: 2 }], interval: 1 },
    { groups: [{ type: 'gudiao', count: 4 }], interval: 1.05 },
    { groups: [{ type: 'changyou', count: 10 }, { type: 'gudiao', count: 3 }], interval: 0.9, hpMultiplier: 1.06 },
    { groups: [{ type: 'changyou', count: 14 }, { type: 'gudiao', count: 4 }], interval: 0.78, hpMultiplier: 1.12 },
    { groups: [{ type: 'changyou', count: 10 }, { type: 'gudiao', count: 6 }], interval: 0.82, hpMultiplier: 1.18 },
    { groups: [{ type: 'changyou', count: 16 }, { type: 'gudiao', count: 6 }], interval: 0.7, hpMultiplier: 1.26 },
    { groups: [{ type: 'changyou', count: 18 }, { type: 'gudiao', count: 8 }], interval: 0.64, hpMultiplier: 1.34 },
    { groups: [{ type: 'huashe', count: 1 }, { type: 'changyou', count: 8 }, { type: 'gudiao', count: 4 }], interval: 0.84, hpMultiplier: 1.2, bossHpMultiplier: 1.1 },
  ]);
  assert.deepEqual(ENEMY_DATA.changyou, { id: 'changyou', name: '長右', emoji: '🐒', hp: 110, speed: 86, baseDamage: 1, reward: 15, radius: 12, marshLeapSpeedMultiplier: 1.3, marshLeapDuration: 1.6 });
  assert.deepEqual(ENEMY_DATA.gudiao, { id: 'gudiao', name: '蠱雕', emoji: '🦅', hp: 420, speed: 24, baseDamage: 3, reward: 32, radius: 18, marshArmorDamageMultiplier: 0.78, marshArmorLinger: 0.6 });
  assert.deepEqual(ENEMY_DATA.huashe, { id: 'huashe', name: '化蛇', emoji: '🐍', hp: 7600, speed: 15, baseDamage: 20, reward: 0, radius: 30, isBoss: true, bossMechanic: { type: 'huashe', phase2Threshold: 0.5, phase2SpeedMultiplier: 1.15, phase1ForcedTideInterval: 7, phase1ForcedTideDuration: 2.4, phase2ForcedTideInterval: 5, phase2ForcedTideDuration: 3 } });
  assert.deepEqual(TOWER_DATA.xuangui, { id: 'xuangui', name: '玄龜', emoji: '🐢', role: '潮震控場', cost: 145, damage: 13, interval: 1.2, range: 140, projectileSpeed: 360, shockEvery: 4, shockDelay: 0.35, shockRadius: 52, shockDamage: 18, shockPushback: 18 });
});

test('wetland polygons use exact logical edges and reject their surrounding boxes', () => {
  const game = new Game(() => 0.2, 8);
  assert.equal(game.map.wetlandZoneAt({ x: 320, y: 175 }), 'A');
  assert.equal(game.map.wetlandZoneAt({ x: 170, y: 235 }), null, 'polygon lookup cannot fall back to its bounding box');
  assert.equal(game.map.wetlandZoneAt({ x: 205, y: 292 }), 'B');
  assert.equal(game.map.wetlandZoneAt({ x: 250, y: 470 }), 'C');
  assert.equal(game.map.wetlandZoneAt({ x: 20, y: 20 }), null);
});

test('natural tide has 7.6s quiet, a 0.8s subtle telegraph, then activates all wetlands for 2.4s', () => {
  const game = new Game(() => 0.2, 8);
  assert.deepEqual(game.tide, TideSystem.reset());
  TideSystem.update(game, 6.79);
  assert.equal(game.tide.high, false);
  assert.equal(game.tide.telegraph, false);
  TideSystem.update(game, 0.01);
  assert.equal(game.tide.telegraph, true);
  assert.equal(game.effects.filter(effect => effect.type === 'tideTelegraph').length, 1);
  TideSystem.update(game, 0.8);
  assert.equal(game.tide.high, true);
  assert.deepEqual(game.tide.activeZoneIds, ['A', 'B', 'C']);
  assert.equal(game.tide.activationId, 1);
  TideSystem.update(game, 2.39);
  assert.equal(game.tide.high, true);
  TideSystem.update(game, 0.01);
  assert.equal(game.tide.high, false);
  assert.deepEqual(game.tide.activeZoneIds, []);
});

test('forced tide starts immediately and overlapping calls refresh rather than stack', () => {
  const game = new Game(() => 0.2, 8);
  TideSystem.forceHighTide(game, 2.4);
  assert.equal(game.tide.high, true);
  assert.equal(game.tide.forcedRemaining, 2.4);
  assert.equal(game.tide.activationId, 1);
  TideSystem.update(game, 2);
  assert.ok(Math.abs(game.tide.forcedRemaining - 0.4) < 1e-9);
  TideSystem.forceHighTide(game, 2.4);
  assert.equal(game.tide.forcedRemaining, 2.4, 'refresh resets one window instead of summing durations');
  assert.equal(game.tide.activationId, 1, 'a refresh is still the same uninterrupted activation');
});

test('forced tide restarts one exact window instead of extending into the natural high phase', () => {
  const game = new Game(() => 0.2, 8);
  TideSystem.update(game, 6.8);
  assert.equal(game.tide.telegraph, true);
  TideSystem.forceHighTide(game, 2.4);
  TideSystem.update(game, 2.39);
  assert.equal(game.tide.high, true);
  TideSystem.update(game, 0.01);
  assert.equal(game.tide.high, false);
  assert.equal(game.tide.telegraph, false);
});

test('長右 mud leap triggers once per wetland patch activation and never buffs 化蛇', () => {
  const game = new Game(() => 0.2, 8);
  const changyou = game.spawnEnemy('changyou');
  const huashe = game.spawnEnemy('huashe');
  Object.assign(changyou, { x: 320, y: 175 });
  Object.assign(huashe, { x: 320, y: 175 });
  TideSystem.forceHighTide(game, 2.4);
  TideSystem.update(game, 0);
  assert.deepEqual(changyou.statuses.marshLeap, { remaining: 1.6, multiplier: 1.3 });
  assert.equal(huashe.statuses.marshLeap, undefined);
  changyou.statuses.marshLeap.remaining = 0.2;
  Object.assign(changyou, { x: 20, y: 20 });
  TideSystem.update(game, 0);
  Object.assign(changyou, { x: 320, y: 175 });
  TideSystem.update(game, 0);
  assert.equal(changyou.statuses.marshLeap.remaining, 0.2, 'same patch cannot retrigger during one activation');
  StatusSystem.update(changyou, 0.21);
  TideSystem.update(game, 2.41);
  TideSystem.forceHighTide(game, 2.4);
  TideSystem.update(game, 0);
  assert.equal(changyou.statuses.marshLeap.remaining, 1.6, 'a new activation may retrigger the same patch');
  assert.equal(StatusSystem.speedMultiplier(changyou), 1.3);
});

test('蠱雕 marsh armor mitigates by 0.78 in active wetland and lingers only 0.6s', () => {
  const game = new Game(() => 0.2, 8);
  const gudiao = game.spawnEnemy('gudiao');
  Object.assign(gudiao, { x: 205, y: 292 });
  TideSystem.forceHighTide(game, 2.4);
  TideSystem.update(game, 0);
  assert.deepEqual(gudiao.statuses.marshArmor, { remaining: 0.6, damageMultiplier: 0.78 });
  assert.equal(CombatSystem.resolveDamage(100, gudiao), 78);
  Object.assign(gudiao, { x: 20, y: 20 });
  StatusSystem.update(gudiao, 0.59);
  assert.equal(CombatSystem.resolveDamage(100, gudiao), 78);
  StatusSystem.update(gudiao, 0.02);
  assert.equal(CombatSystem.resolveDamage(100, gudiao), 100);
});

test('化蛇 opens W10 with a readable tide telegraph, then keeps exact P1/P2 cadence', () => {
  const game = new Game(() => 0.2, 8);
  game.wave.waveNumber = 10;
  const boss = game.spawnEnemy('huashe');
  assert.equal(boss.maxHp, 8360);

  assert.deepEqual(BossSystem.update(boss, 0, { escortAlive: false }), [], 'opening tide waits until escort enters');
  game.spawnEnemy('changyou');
  assert.deepEqual(BossSystem.update(boss, 0, { escortAlive: true }), [{ type: 'huasheTideTelegraph', duration: 0.8 }]);
  game.handleBossEvent(boss, { type: 'huasheTideTelegraph', duration: 0.8 });
  assert.equal(game.tide.telegraph, true);
  assert.equal(game.tide.high, false);
  assert.deepEqual(BossSystem.update(boss, 0.79, { escortAlive: true }), []);
  assert.deepEqual(BossSystem.update(boss, 0.01, { escortAlive: true }), [{ type: 'huasheForcedTide', duration: 2.4 }]);
  game.handleBossEvent(boss, { type: 'huasheForcedTide', duration: 2.4 });
  assert.equal(game.tide.forcedRemaining, 2.4);
  assert.equal(game.tide.high, true);

  assert.deepEqual(BossSystem.update(boss, 6.99), []);
  assert.deepEqual(BossSystem.update(boss, 0.01), [{ type: 'huasheForcedTide', duration: 2.4 }]);

  boss.hp = boss.maxHp * 0.5;
  assert.deepEqual(BossSystem.update(boss, 0), [{ type: 'huashePhase2', phase: 2, duration: 0.8 }]);
  assert.equal(boss.speedMultiplier, 1.15);
  assert.deepEqual(BossSystem.update(boss, 4.99), []);
  assert.deepEqual(BossSystem.update(boss, 0.01), [{ type: 'huasheForcedTide', duration: 3 }]);
  assert.deepEqual(BossSystem.update(boss, 0), []);
});

test('Level8 W10 spawns 化蛇 before its 長右／蠱雕 escort', () => {
  const wave = new WaveManager(LEVEL8_WAVE_DATA);
  assert.equal(wave.start(10), true);
  assert.equal(wave.queue[0], 'huashe');
  assert.deepEqual(wave.queue.slice(0, 4), ['huashe', 'changyou', 'changyou', 'changyou']);
  assert.equal(wave.queue.filter(type => type === 'changyou').length, 8);
  assert.equal(wave.queue.filter(type => type === 'gudiao').length, 4);
});

test('Level8 victory waits for escort resolution, queue completion and 化蛇 death', () => {
  const game = new Game(() => 0.2, 8);
  game.state = 'combat';
  game.time.setPaused(false);
  game.wave.waveNumber = 10;
  game.wave.active = true;
  game.wave.queue.length = 0;
  game.wave.spawnedAlive = 2;
  const ordinary = game.spawnEnemy('changyou');
  const boss = game.spawnEnemy('huashe');
  boss.takeDamage(boss.maxHp);
  game.update(0);
  assert.equal(game.state, 'combat');
  assert.equal(game.levelBossDefeated, true);
  ordinary.takeDamage(ordinary.maxHp);
  game.update(0);
  assert.equal(game.state, 'victory');
});

test('玄龜 Blessings filter by lineup, cap at two, and modify only 潮震 values', () => {
  const blessings = BLESSING_DATA.filter(item => item.tower === 'xuangui');
  assert.deepEqual(blessings.map(item => item.id), ['xuanguiWave', 'xuanguiBroadTide', 'xuanguiReturnTide']);
  const system = new BlessingSystem(blessings, () => 0);
  assert.deepEqual(system.drawChoices([], ['bifang']), []);
  assert.equal(system.drawChoices([], ['xuangui']).length, 3);
  for (const blessing of blessings) {
    assert.equal(system.select(blessing.id), true);
    assert.equal(system.select(blessing.id), true);
    assert.equal(system.select(blessing.id), false);
  }
  const tower = new Tower('xuangui', TOWER_DATA.xuangui, { x: 100, y: 100 });
  const stats = tower.getStats(system.modifiers);
  assert.equal(stats.damage, 13);
  assert.equal(stats.interval, 1.2);
  assert.equal(stats.shockDamage, 25.2);
  assert.equal(stats.shockRadius, 68);
  assert.equal(stats.shockPushback, 28);
  assert.equal(stats.shockEvery, 4);
  assert.equal(stats.shockDelay, 0.35);
});

test('玄龜 schedules one delayed 潮震 after every four successful projectile hits', () => {
  const game = new Game(() => 0.2, 8);
  const tower = new Tower('xuangui', TOWER_DATA.xuangui, { x: 100, y: 100 });
  const stats = tower.getStats();
  for (let index = 0; index < 4; index += 1) {
    const target = game.spawnEnemy('changyou');
    Object.assign(target, { x: 120 + index, y: 100 });
    new Projectile(tower, target, stats, {}, game.effects, game.pendingShocks).impact([target]);
    assert.equal(game.pendingShocks.length, index === 3 ? 1 : 0);
  }
  assert.equal(tower.successfulAttacks, 4);
  assert.deepEqual(game.pendingShocks[0], {
    x: 123, y: 100, remaining: 0.35, radius: 52, damage: 18, pushback: 18,
  });
  assert.equal(game.effects.filter(effect => effect.type === 'xuanguiShockTelegraph').length, 1);

  const defeated = game.spawnEnemy('changyou');
  defeated.alive = false;
  new Projectile(tower, defeated, stats, {}, game.effects, game.pendingShocks).impact([defeated]);
  assert.equal(tower.successfulAttacks, 4, 'a projectile without a living target is not a successful attack');
});

test('潮震 waits 0.35s, damages the area, pushes only non-Boss path distance, and clamps at Spawn', () => {
  const game = new Game(() => 0.2, 8);
  const nearSpawn = game.spawnEnemy('changyou');
  const normal = game.spawnEnemy('gudiao');
  const boss = game.spawnEnemy('huashe');
  nearSpawn.pathDistance = 8;
  normal.pathDistance = 80;
  boss.pathDistance = 70;
  for (const enemy of [nearSpawn, normal, boss]) Object.assign(enemy, game.map.positionAt(enemy.pathDistance));
  const center = { x: normal.x, y: normal.y };
  Object.assign(nearSpawn, center);
  Object.assign(boss, center);
  game.pendingShocks.push({ ...center, remaining: 0.35, radius: 52, damage: 18, pushback: 18 });

  game.updatePendingShocks(0.34);
  assert.equal(normal.hp, normal.maxHp);
  game.updatePendingShocks(0.01);
  assert.equal(nearSpawn.hp, nearSpawn.maxHp - 18);
  assert.equal(normal.hp, normal.maxHp - 18);
  assert.equal(boss.hp, boss.maxHp - 18);
  assert.equal(nearSpawn.pathDistance, 0);
  assert.equal(normal.pathDistance, 62);
  assert.equal(boss.pathDistance, 70, 'Boss receives damage but is push-immune');
  assert.deepEqual({ x: normal.x, y: normal.y }, game.map.positionAt(62));
  assert.equal(game.effects.filter(effect => effect.type === 'xuanguiShock').length, 1);
});

test('wave completion waits for a queued final-hit 潮震 to resolve', () => {
  const game = new Game(() => 0.2, 8);
  game.state = 'combat';
  game.time.setPaused(false);
  game.wave.waveNumber = 1;
  game.wave.active = true;
  game.wave.queue.length = 0;
  game.wave.spawnedAlive = 0;
  game.pendingShocks.push({ x: 100, y: 100, remaining: 0.35, radius: 52, damage: 18, pushback: 18 });

  game.update(0);
  assert.equal(game.state, 'combat');
  for (let index = 0; index < 4; index += 1) game.update(0.1);
  assert.equal(game.pendingShocks.length, 0);
  assert.equal(game.state, 'blessing');
});

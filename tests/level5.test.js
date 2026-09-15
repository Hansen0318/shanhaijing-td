import test from 'node:test';
import assert from 'node:assert/strict';
import { ENEMY_DATA, LEVELS, getLevelData } from '../src/config/gameData.js';
import { Game } from '../src/core/Game.js';
import { Enemy } from '../src/entities/Enemy.js';
import { GameMap } from '../src/map/GameMap.js';
import { CombatSystem } from '../src/systems/CombatSystem.js';
import { StatusSystem } from '../src/systems/StatusSystem.js';
import { BossSystem } from '../src/systems/BossSystem.js';

test('level five defines Buzhoushan identity, exact waves, measured geometry, and enemy stats', () => {
  const level = getLevelData(5);
  assert.equal(level, LEVELS[5]);
  assert.deepEqual(
    { id: level.id, name: level.name, baseName: level.baseName, bossType: level.bossType },
    { id: 5, name: '不周山墟', baseName: '天柱核心', bossType: 'xingtian' },
  );
  assert.deepEqual(level.waves.map(item => item.groups), [
    [{ type: 'zhuyan', count: 6 }],
    [{ type: 'zhuyan', count: 8 }],
    [{ type: 'zhuyan', count: 6 }, { type: 'lili', count: 2 }],
    [{ type: 'lili', count: 4 }],
    [{ type: 'zhuyan', count: 10 }, { type: 'lili', count: 3 }],
    [{ type: 'zhuyan', count: 14 }, { type: 'lili', count: 4 }],
    [{ type: 'zhuyan', count: 8 }, { type: 'lili', count: 7 }],
    [{ type: 'zhuyan', count: 16 }, { type: 'lili', count: 6 }],
    [{ type: 'zhuyan', count: 18 }, { type: 'lili', count: 8 }],
    [{ type: 'zhuyan', count: 8 }, { type: 'lili', count: 4 }, { type: 'xingtian', count: 1 }],
  ]);
  assert.deepEqual(level.waves.map(item => item.interval), [1.1, 1, 1, 1.05, 0.9, 0.78, 0.82, 0.68, 0.62, 0.82]);
  assert.deepEqual(level.waves.map(item => item.hpMultiplier ?? 1), [1, 1, 1, 1, 1.05, 1.1, 1.15, 1.25, 1.35, 1.2]);
  assert.equal(level.waves[9].bossHpMultiplier, 1.15);
  assert.equal(level.map.slots.length, 8);
  assert.deepEqual(level.map.slots, [
    { x: 119, y: 68 }, { x: 99, y: 119 }, { x: 265, y: 150 }, { x: 315, y: 198 },
    { x: 105, y: 280 }, { x: 146, y: 305 }, { x: 271, y: 421 }, { x: 229, y: 518 },
  ]);
  assert.deepEqual(level.map.chargeCorridor, { x: 100, y: 360, width: 195, height: 66 });
  assert.deepEqual(
    Object.fromEntries(['zhuyan', 'lili', 'xingtian'].map(type => [type, ENEMY_DATA[type]])),
    {
      zhuyan: { id: 'zhuyan', name: '朱厭', emoji: '🐒', hp: 85, speed: 84, baseDamage: 1, reward: 13, radius: 12 },
      lili: { id: 'lili', name: '狸力', emoji: '🐗', hp: 320, speed: 27, baseDamage: 3, reward: 27, radius: 18, earthArmorLayers: 1 },
      xingtian: { id: 'xingtian', name: '刑天', emoji: '🪓', hp: 5800, speed: 16, baseDamage: 20, reward: 0, radius: 29, isBoss: true, bossMechanic: { type: 'xingtian' } },
    },
  );
});

test('level four victory enters an empty level five lineup and retry clears it', () => {
  const game = new Game(() => 0.25, 4);
  for (const type of ['bifang', 'fuzhu', 'baize']) game.toggleLineup(type);
  game.confirmLineup();
  game.end('victory');
  assert.equal(game.enterLevel(5), true);
  assert.equal(game.state, 'lineup');
  assert.deepEqual(game.lineupSelection, []);
  for (const type of ['bifang', 'yinglong', 'baize']) game.toggleLineup(type);
  assert.equal(game.confirmLineup(), true);
  assert.deepEqual(game.availableTowerTypes(), ['bifang', 'yinglong', 'baize']);
  assert.equal(game.buildTower(0, 'fuzhu').ok, false);
  assert.equal(game.buildTower(0, 'baize').ok, true);
  game.end('defeat');
  game.restart();
  assert.equal(game.state, 'lineup');
  assert.deepEqual(game.lineupSelection, []);
});

test('level five Blessings stay filtered by the selected lineup', () => {
  const game = new Game(() => 0.1, 5);
  for (const type of ['bifang', 'fuzhu', 'baize']) game.toggleLineup(type);
  game.confirmLineup();
  const choices = game.blessings.drawChoices([], game.lineupSelection);
  assert.equal(choices.length, 3);
  assert.equal(choices.every(choice => !choice.tower || game.lineupSelection.includes(choice.tower)), true);
  assert.equal(game.blessings.data.some(choice => choice.tower === 'baize'), true);
});

test('wave ten spawns a 6670 HP Xingtian after ordinary enemy groups', () => {
  const game = new Game(() => 0.25, 5);
  game.wave.waveNumber = 10;
  assert.deepEqual(game.level.waves[9].groups.map(group => group.type), ['zhuyan', 'lili', 'xingtian']);
  const boss = game.spawnEnemy('xingtian');
  assert.equal(boss.maxHp, 6670);
  assert.equal(boss.hp, 6670);
});

function straightChargeMap() {
  return new GameMap({
    width: 390, height: 610, pathWidth: 54, slots: [],
    waypoints: [{ x: 0, y: 20 }, { x: 300, y: 20 }],
    chargeCorridor: { x: 50, y: 0, width: 180, height: 40 },
  });
}

test('Zhuyan telegraphs while moving normally, charges once for 0.6 seconds, and remains slowable', () => {
  const enemy = new Enemy('zhuyan', ENEMY_DATA.zhuyan, straightChargeMap());
  enemy.pathDistance = 50;
  Object.assign(enemy, enemy.map.positionAt(50));
  assert.deepEqual(enemy.update(0), { type: 'zhuyanChargeTelegraph', x: 50, y: 20, duration: 0.2 });
  const beforeTelegraph = enemy.pathDistance;
  enemy.update(0.2);
  assert.ok(Math.abs((enemy.pathDistance - beforeTelegraph) - 16.8) < 1e-9);
  assert.equal(enemy.chargeRemaining, 0.6);
  StatusSystem.applySlow(enemy, 0.25, 2);
  const beforeCharge = enemy.pathDistance;
  enemy.update(0.1);
  assert.ok(Math.abs((enemy.pathDistance - beforeCharge) - 10.395) < 1e-9);
  enemy.update(0.5);
  assert.equal(enemy.chargeRemaining, 0);
  enemy.pathDistance = 50;
  Object.assign(enemy, enemy.map.positionAt(50));
  assert.equal(enemy.update(0), null);
  assert.equal(enemy.chargeConsumed, true);
});

test('Lili earth armor breaks only on raw direct damage at least 30 after amplification', () => {
  const enemy = new Enemy('lili', ENEMY_DATA.lili, straightChargeMap());
  StatusSystem.applyInsight(enemy, { duration: 3, vulnerability: 0.15, bossVulnerability: 0.1, defensePierce: 0 });
  const below = CombatSystem.hit(enemy, 29, { damageKind: 'direct' });
  assert.deepEqual(below, { damage: 33.35, armorBroken: false });
  assert.equal(enemy.earthArmorLayers, 1);
  const triggering = CombatSystem.hit(enemy, 30, { damageKind: 'direct' });
  assert.deepEqual(triggering, { damage: 15.525, armorBroken: true });
  assert.equal(enemy.earthArmorLayers, 0);
  const after = CombatSystem.hit(enemy, 30, { damageKind: 'direct' });
  assert.deepEqual(after, { damage: 34.5, armorBroken: false });
});

test('Lili AoE and DoT deal normal damage without triggering or consuming earth armor', () => {
  const aoeTarget = new Enemy('lili', ENEMY_DATA.lili, straightChargeMap());
  const hit = CombatSystem.areaDamage([aoeTarget], aoeTarget, 10, 40);
  assert.equal(hit.length, 1);
  assert.equal(aoeTarget.hp, 280);
  assert.equal(aoeTarget.earthArmorLayers, 1);

  const dotTarget = new Enemy('lili', ENEMY_DATA.lili, straightChargeMap());
  StatusSystem.applyBurn(dotTarget, 40, 1);
  StatusSystem.update(dotTarget, 1);
  assert.equal(dotTarget.hp, 280);
  assert.equal(dotTarget.earthArmorLayers, 1);
});

function xingtian() {
  return new Enemy('xingtian', ENEMY_DATA.xingtian, new GameMap(LEVELS[5].map));
}

test('Xingtian P1 shields after 5.5 seconds and applies reduction after insight', () => {
  const boss = xingtian();
  assert.deepEqual(BossSystem.update(boss, 0), []);
  assert.deepEqual(BossSystem.update(boss, 5.4), []);
  assert.deepEqual(BossSystem.update(boss, 0.1), [{ type: 'xingtianShield', duration: 1.2 }]);
  assert.equal(boss.activeDefenseMultiplier, 0.65);
  StatusSystem.applyInsight(boss, { duration: 3, vulnerability: 0.15, bossVulnerability: 0.1, defensePierce: 0 });
  assert.deepEqual(CombatSystem.hit(boss, 100), { damage: 71.5, armorBroken: false });
});

test('Xingtian enters P2 once at 50 percent, cancels shield, and schedules earthquake', () => {
  const boss = xingtian();
  BossSystem.update(boss, 5.5);
  assert.ok(boss.statuses.bossShield);
  boss.hp = boss.maxHp * 0.5;
  assert.deepEqual(BossSystem.update(boss, 0), [{ type: 'xingtianEvolution', phase: 2 }]);
  assert.equal(boss.bossPhase, 2);
  assert.equal(boss.speedMultiplier, 1.15);
  assert.equal(boss.data.speed * boss.speedMultiplier, 18.4);
  assert.equal(boss.statuses.bossShield, undefined);
  assert.equal(boss.activeDefenseMultiplier, 1);
  assert.deepEqual(BossSystem.update(boss, 0), []);
  assert.deepEqual(BossSystem.update(boss, 4.7), []);
  assert.deepEqual(BossSystem.update(boss, 0.1), [{ type: 'xingtianEarthquakeCharge', duration: 0.45 }]);
  assert.deepEqual(BossSystem.update(boss, 0.44), []);
  assert.deepEqual(BossSystem.update(boss, 0.01), [{ type: 'xingtianEarthquakeRelease', radius: 95, stunDuration: 1 }]);
});

test('Xingtian earthquake stuns only the nearest tower in range and still emits with no target', () => {
  const game = new Game(() => 0.2, 5);
  for (const type of ['bifang', 'fuzhu', 'baize']) game.toggleLineup(type);
  game.confirmLineup();
  game.economy.add(500);
  game.buildTower(4, 'bifang');
  game.buildTower(5, 'fuzhu');
  const boss = game.spawnEnemy('xingtian');
  Object.assign(boss, { x: 135, y: 300 });
  const [farther, nearest] = [game.towers[4], game.towers[5]];
  game.handleBossEvent(boss, { type: 'xingtianEarthquakeRelease', radius: 95, stunDuration: 1 });
  assert.equal(nearest.stunRemaining, 1);
  assert.equal(farther.stunRemaining, 0);
  assert.equal(game.effects.at(-1).type, 'xingtianEarthquake');

  farther.stunRemaining = 0;
  nearest.stunRemaining = 0;
  Object.assign(boss, { x: 380, y: 590 });
  game.handleBossEvent(boss, { type: 'xingtianEarthquakeRelease', radius: 95, stunDuration: 1 });
  assert.equal(game.towers.every(tower => !tower || tower.stunRemaining === 0), true);
  assert.equal(game.effects.at(-1).type, 'xingtianEarthquake');
});

test('tower stun pauses only attack cooldown progression', () => {
  const game = new Game(() => 0.2, 5);
  for (const type of ['bifang', 'fuzhu', 'baize']) game.toggleLineup(type);
  game.confirmLineup();
  game.buildTower(0, 'bifang');
  const tower = game.towers[0];
  tower.cooldown = 0.5;
  tower.stunRemaining = 1;
  game.updateTowers(0.25);
  assert.equal(tower.cooldown, 0.5);
  assert.equal(tower.stunRemaining, 0.75);
  game.updateTowers(0.75);
  assert.equal(tower.cooldown, 0.5);
  game.updateTowers(0.1);
  assert.equal(tower.cooldown, 0.4);
  tower.stunRemaining = 0.05;
  game.updateTowers(0.1);
  assert.equal(tower.stunRemaining, 0);
  assert.ok(Math.abs(tower.cooldown - 0.35) < 1e-12);
  assert.equal(game.upgradeTower(0).ok, true);
  assert.equal(game.sellTower(0).confirm, true);
});

test('level five victory waits for both Xingtian death and wave-ten completion', () => {
  const game = new Game(() => 0.2, 5);
  for (const type of ['bifang', 'fuzhu', 'baize']) game.toggleLineup(type);
  game.confirmLineup();
  game.state = 'combat';
  game.time.setPaused(false);
  game.wave.waveNumber = 10;
  game.wave.active = true;
  game.wave.queue.length = 0;
  game.wave.spawnedAlive = 2;
  const ordinary = game.spawnEnemy('zhuyan');
  const boss = game.spawnEnemy('xingtian');
  boss.takeDamage(boss.maxHp);
  game.update(0);
  assert.equal(game.state, 'combat');
  assert.equal(game.levelBossDefeated, true);
  ordinary.takeDamage(ordinary.maxHp);
  game.update(0);
  assert.equal(game.state, 'victory');
});

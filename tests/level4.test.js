import test from 'node:test';
import assert from 'node:assert/strict';
import { ENEMY_DATA, LEVELS, TOWER_DATA, getLevelData } from '../src/config/gameData.js';
import { Game } from '../src/core/Game.js';
import { Enemy } from '../src/entities/Enemy.js';
import { Tower } from '../src/entities/Tower.js';
import { GameMap } from '../src/map/GameMap.js';
import { CombatSystem } from '../src/systems/CombatSystem.js';
import { StatusSystem } from '../src/systems/StatusSystem.js';
import { BossSystem } from '../src/systems/BossSystem.js';
import { isValidLineup, normalizeLineup } from '../src/systems/LineupSystem.js';

test('level four defines Qingqiu, ten waves, eight slots and two fog zones', () => {
  const level = getLevelData(4);
  assert.equal(level, LEVELS[4]);
  assert.deepEqual(
    { id: level.id, name: level.name, baseName: level.baseName, bossType: level.bossType },
    { id: 4, name: '青丘妖境', baseName: '青丘靈臺', bossType: 'jiuweihu' },
  );
  assert.equal(level.waves.length, 10);
  assert.equal(level.map.slots.length, 8);
  assert.equal(level.map.fogZones.length, 2);
  assert.deepEqual(level.map.fogZones, [
    { id: 'upper', x: 128, y: 111, width: 116, height: 111 },
    { id: 'lower', x: 244, y: 375, width: 137, height: 105 },
  ]);
  assert.deepEqual(level.waves[9].groups, [
    { type: 'meihu', count: 10 },
    { type: 'huanli', count: 6 },
    { type: 'jiuweihu', count: 1 },
  ]);
});

test('level four requires exactly three unique lineup members', () => {
  assert.equal(isValidLineup(['bifang', 'fuzhu']), false);
  assert.equal(isValidLineup(['bifang', 'fuzhu', 'bifang']), false);
  assert.equal(isValidLineup(['bifang', 'fuzhu', 'baize']), true);
  assert.deepEqual(normalizeLineup(['baize', 'bad', 'baize', 'yinglong']), ['baize', 'yinglong']);
});

test('level three victory enters lineup and level four builds only the selected roster', () => {
  const game = new Game(() => 0.2, 3);
  game.end('victory');
  assert.equal(game.enterLevel(4), true);
  assert.equal(game.state, 'lineup');
  for (const type of ['bifang', 'fuzhu', 'baize']) game.toggleLineup(type);
  assert.equal(game.confirmLineup(), true);
  assert.equal(game.state, 'preparation');
  assert.deepEqual(game.availableTowerTypes(), ['bifang', 'fuzhu', 'baize']);
  assert.equal(game.buildTower(0, 'yinglong').ok, false);
  assert.equal(game.buildTower(0, 'baize').ok, true);
});

test('level four retry clears the roster and returns to lineup', () => {
  const game = new Game(() => 0, 4);
  for (const type of ['bifang', 'fuzhu', 'baize']) game.toggleLineup(type);
  game.confirmLineup();
  game.end('defeat');
  assert.equal(game.restart(), true);
  assert.equal(game.state, 'lineup');
  assert.deepEqual(game.lineupSelection, []);
});

test('Meihu triggers each fog zone once and insight halves the boost', () => {
  const map = new GameMap({
    width: 390, height: 610, pathWidth: 54,
    waypoints: [{ x: 0, y: 20 }, { x: 300, y: 20 }], slots: [],
    fogZones: [
      { id: 'upper', x: 0, y: 0, width: 80, height: 40 },
      { id: 'lower', x: 160, y: 0, width: 80, height: 40 },
    ],
  });
  const enemy = new Enemy('meihu', ENEMY_DATA.meihu, map);
  assert.deepEqual(enemy.update(0.1), {
    type: 'fogEntry', zoneId: 'upper', x: 0, y: 20, weakened: false,
  });
  assert.equal(enemy.statuses.fogSprint.amount, 0.3);
  assert.equal(enemy.enteredFogZones.size, 1);
  assert.equal(enemy.update(0.1), null);
  assert.equal(enemy.enteredFogZones.size, 1);
  enemy.statuses.insight = { remaining: 3 };
  enemy.pathDistance = 160;
  Object.assign(enemy, map.positionAt(enemy.pathDistance));
  assert.deepEqual(enemy.update(0.01), {
    type: 'fogEntry', zoneId: 'lower', x: 160, y: 20, weakened: true,
  });
  assert.equal(enemy.statuses.fogSprint.amount, 0.15);
  assert.equal(enemy.enteredFogZones.size, 2);
  assert.equal(enemy.update(0.01), null);
  assert.equal(enemy.enteredFogZones.size, 2);
});

test('Game emits one short fog-entry visual for each fog zone a Meihu enters', () => {
  const game = new Game(() => 0.2, 4);
  game.state = 'combat';
  game.time.setPaused(false);
  const enemy = game.spawnEnemy('meihu');
  Object.assign(enemy, { x: 140, y: 125 });

  game.update(0);
  assert.deepEqual(game.effects.find(effect => effect.type === 'fogEntry'), {
    type: 'fogEntry', sourceId: enemy.id, unitType: 'meihu', zoneId: 'upper',
    x: 140, y: 125, weakened: false, life: 0.4, duration: 0.4,
  });
  game.update(0);
  assert.equal(game.effects.filter(effect => effect.type === 'fogEntry').length, 1);

  enemy.statuses.insight = { remaining: 3 };
  enemy.pathDistance = 936;
  Object.assign(enemy, game.map.positionAt(enemy.pathDistance));
  game.update(0);
  assert.deepEqual(
    game.effects.filter(effect => effect.type === 'fogEntry').map(({ zoneId, weakened, life, duration }) => ({ zoneId, weakened, life, duration })),
    [
      { zoneId: 'upper', weakened: false, life: 0.4, duration: 0.4 },
      { zoneId: 'lower', weakened: true, life: 0.4, duration: 0.4 },
    ],
  );
  game.update(0);
  assert.equal(game.effects.filter(effect => effect.type === 'fogEntry').length, 2);
});

test('Huanli creates two one-hit non-wave illusions once below sixty percent', () => {
  const game = new Game(() => 0.2, 4);
  game.state = 'combat';
  game.time.setPaused(false);
  game.wave.active = true;
  game.wave.spawnedAlive = 1;
  const huanli = game.spawnEnemy('huanli');
  huanli.takeDamage(huanli.maxHp * 0.41);
  game.update(0);
  assert.equal(game.illusions.length, 2);
  assert.equal(game.wave.spawnedAlive, 1);
  game.update(0);
  assert.equal(game.illusions.length, 2, 'the threshold triggers only once');
  game.illusions[0].takeDamage(1);
  game.update(0);
  assert.equal(game.illusions.length, 1);
  assert.equal(game.stats.kills, 0);
  assert.equal(game.wave.spawnedAlive, 1);
});

test('illusions follow their source and disappear when the source dies', () => {
  const game = new Game(() => 0.2, 4);
  const huanli = game.spawnEnemy('huanli');
  const [illusion] = game.spawnIllusions(huanli, 1, 1.6);
  const offset = { x: illusion.x - huanli.x, y: illusion.y - huanli.y };
  huanli.pathDistance = 80;
  Object.assign(huanli, huanli.map.positionAt(huanli.pathDistance));
  illusion.update(0.1);
  assert.deepEqual({ x: illusion.x, y: illusion.y }, { x: huanli.x + offset.x, y: huanli.y + offset.y });
  huanli.alive = false;
  illusion.update(0);
  assert.equal(illusion.alive, false);
});

test('Baize insight shortens existing illusions from the marked source', () => {
  const game = new Game(() => 0.2, 4);
  const huanli = game.spawnEnemy('huanli');
  const illusions = game.spawnIllusions(huanli, 2, 1.6);
  const baize = new Tower('baize', TOWER_DATA.baize, { x: huanli.x, y: huanli.y });
  game.towers[0] = baize;
  game.updateTowers(0);
  assert.ok(huanli.statuses.insight);
  assert.deepEqual(illusions.map(illusion => illusion.life), [0.8, 0.8]);
});

test('Baize levels apply exact insight duration, range, and defense pierce', () => {
  const tower = new Tower('baize', TOWER_DATA.baize, { x: 0, y: 0 });
  const pick = stats => ({ duration: stats.insightDuration, range: stats.range, defensePierce: stats.defensePierce });
  assert.deepEqual(pick(tower.getStats()), { duration: 3, range: 128, defensePierce: 0 });
  tower.level = 2;
  assert.deepEqual(pick(tower.getStats()), { duration: 4, range: 136, defensePierce: 0 });
  tower.level = 3;
  assert.deepEqual(pick(tower.getStats()), { duration: 4, range: 136, defensePierce: 0.25 });
});

test('insight refreshes without stacking and adds fifteen or ten percent damage', () => {
  const minion = new Enemy('meihu', ENEMY_DATA.meihu, new GameMap(LEVELS[4].map));
  const boss = new Enemy('jiuweihu', ENEMY_DATA.jiuweihu, new GameMap(LEVELS[4].map));
  const insight = { duration: 3, vulnerability: 0.15, bossVulnerability: 0.1, defensePierce: 0 };
  StatusSystem.applyInsight(minion, insight);
  StatusSystem.applyInsight(boss, insight);
  assert.equal(CombatSystem.resolveDamage(100, minion), 115);
  assert.equal(CombatSystem.resolveDamage(100, boss), 110);
  StatusSystem.applyInsight(minion, insight);
  assert.equal(CombatSystem.resolveDamage(100, minion), 115);
  assert.equal(minion.statuses.insight.remaining, 3);
});

test('Baize targets a real enemy before an illusion at equal progress', () => {
  const tower = { x: 0, y: 0 };
  const real = { x: 20, y: 0, pathDistance: 50, alive: true };
  const illusion = { ...real, isIllusion: true };
  assert.equal(CombatSystem.acquireTarget(tower, [illusion, real], 128, { preferReal: true }), real);
});

function jiuweihu() {
  return new Enemy('jiuweihu', ENEMY_DATA.jiuweihu, new GameMap(LEVELS[4].map));
}

test('Jiuweihu enters phases two and three exactly once', () => {
  const boss = jiuweihu();
  boss.hp = boss.maxHp * 0.6;
  assert.deepEqual(BossSystem.update(boss, 0, {}), [{ type: 'bossEvolution', phase: 2, duration: 0.7 }]);
  assert.deepEqual(BossSystem.update(boss, 0, {}), []);
  boss.hp = boss.maxHp * 0.25;
  assert.deepEqual(BossSystem.update(boss, 0, {}), [{ type: 'bossEvolution', phase: 3, duration: 0.9 }]);
  assert.equal(boss.speedMultiplier, 1.2);
  assert.deepEqual(BossSystem.update(boss, 0, {}), []);
});

test('phase one shield and fox step use exact cadence and duration', () => {
  const boss = jiuweihu();
  const events = BossSystem.update(boss, 10, {});
  assert.equal(events.some(event => event.type === 'bossShield' && event.duration === 2.5), true);
  assert.equal(events.some(event => event.type === 'bossStep' && event.duration === 1.3), true);
  assert.equal(boss.activeDefenseMultiplier, 0.85);
  assert.equal(StatusSystem.speedMultiplier(boss), 1.25);
});

test('phase two creates three fog-extended illusions and insight shortens them', () => {
  const boss = jiuweihu();
  boss.bossPhase = 2;
  boss.bossTimers = { illusions: 8 };
  assert.deepEqual(BossSystem.update(boss, 8, { inFog: true, insightActive: false }), [
    { type: 'bossIllusions', count: 3, duration: 2.3 },
  ]);
  assert.deepEqual(BossSystem.update(boss, 8, { inFog: false, insightActive: true }), [
    { type: 'bossIllusions', count: 3, duration: 0.9 },
  ]);
});

test('phase three ultimate leaves slow at sixty percent effectiveness for four seconds', () => {
  const boss = jiuweihu();
  boss.bossPhase = 3;
  boss.bossTimers = { ultimate: 7 };
  assert.deepEqual(BossSystem.update(boss, 7, {}), [{ type: 'bossUltimateCharge', duration: 0.6 }]);
  assert.deepEqual(BossSystem.update(boss, 0.6, {}), [{ type: 'bossUltimateRelease', duration: 4 }]);
  StatusSystem.applySlow(boss, 0.4, 2);
  assert.equal(StatusSystem.speedMultiplier(boss), 0.76);
});

test('level-four boss evolution never adds a phase banner', () => {
  const game = new Game(() => 0.2, 4);
  game.state = 'combat';
  game.time.setPaused(false);
  const boss = game.spawnEnemy('jiuweihu');
  boss.hp = boss.maxHp * 0.6;
  game.update(0);
  assert.equal(game.bannerQueue.some(item => /Phase|階段|進化/.test(item.text)), false);
  assert.equal(game.effects.some(effect => effect.type === 'jiuweihuEvolution'), true);
});

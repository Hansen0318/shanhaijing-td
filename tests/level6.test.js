import test from 'node:test';
import assert from 'node:assert/strict';
import { ENEMY_DATA, LEVELS, getLevelData } from '../src/config/gameData.js';
import { Game } from '../src/core/Game.js';
import { Enemy } from '../src/entities/Enemy.js';
import { GameMap } from '../src/map/GameMap.js';
import { CombatSystem } from '../src/systems/CombatSystem.js';
import { SunlightSystem } from '../src/systems/SunlightSystem.js';
import { BossSystem } from '../src/systems/BossSystem.js';

const GEOMETRY_V4 = [
  [57,55],[60,72],[78,91],[111,101],[150,105],[190,105],[229,109],[264,119],[296,137],[323,162],
  [342,193],[354,230],[360,271],[360,311],[354,347],[341,381],[321,408],[295,427],[266,434],[262,429],
  [253,428],[244,428],[235,428],[226,428],[217,428],[208,428],[199,428],[190,428],[181,428],[173,426],
  [165,423],[159,417],[152,411],[147,404],[142,397],[141,389],[139,380],[134,373],[129,366],[121,362],
  [112,361],[103,361],[94,362],[87,366],[79,370],[76,378],[73,386],[68,393],[63,400],[60,408],
  [59,417],[58,426],[59,435],[64,445],[73,453],[85,459],[99,464],[114,466],[130,466],[146,463],
  [162,458],[178,452],[190,449],[194,452],[194,475],
].map(([x, y]) => ({ x, y }));

test('Level6 defines the approved identity, Geometry V4, slots, zones, enemies and waves', () => {
  const level = getLevelData(6);
  assert.equal(level, LEVELS[6]);
  assert.deepEqual(
    { id: level.id, name: level.name, baseName: level.baseName, bossType: level.bossType },
    { id: 6, name: '扶桑神域', baseName: '扶桑靈核', bossType: 'jinwu' },
  );
  assert.deepEqual(level.map.waypoints, GEOMETRY_V4);
  assert.deepEqual(level.map.slots, [
    { x: 98, y: 138 }, { x: 285, y: 94 }, { x: 285, y: 203 }, { x: 96, y: 269 },
    { x: 307, y: 312 }, { x: 195, y: 382 }, { x: 107, y: 417 }, { x: 309, y: 461 },
  ]);
  assert.deepEqual(level.map.sunlightZones, [
    { id: 'A', x: 137, y: 90, width: 85, height: 34 },
    { id: 'B', x: 302, y: 365, width: 61, height: 49 },
  ]);
  assert.deepEqual(
    Object.fromEntries(['yangyu', 'fusangjiashou', 'jinwu'].map(type => [type, ENEMY_DATA[type]])),
    {
      yangyu: { id: 'yangyu', name: '陽羽', emoji: '☀️', hp: 90, speed: 86, baseDamage: 1, reward: 13, radius: 11 },
      fusangjiashou: { id: 'fusangjiashou', name: '扶桑甲獸', emoji: '🪲', hp: 350, speed: 26, baseDamage: 3, reward: 28, radius: 18 },
      jinwu: { id: 'jinwu', name: '金烏', emoji: '🐦', hp: 6200, speed: 17, baseDamage: 20, reward: 0, radius: 29, isBoss: true, bossMechanic: { type: 'jinwu' } },
    },
  );
  assert.deepEqual(level.waves.map(wave => wave.groups), [
    [{ type: 'yangyu', count: 6 }],
    [{ type: 'yangyu', count: 8 }],
    [{ type: 'yangyu', count: 6 }, { type: 'fusangjiashou', count: 2 }],
    [{ type: 'fusangjiashou', count: 4 }],
    [{ type: 'yangyu', count: 10 }, { type: 'fusangjiashou', count: 3 }],
    [{ type: 'yangyu', count: 14 }, { type: 'fusangjiashou', count: 4 }],
    [{ type: 'yangyu', count: 8 }, { type: 'fusangjiashou', count: 7 }],
    [{ type: 'yangyu', count: 16 }, { type: 'fusangjiashou', count: 6 }],
    [{ type: 'yangyu', count: 18 }, { type: 'fusangjiashou', count: 8 }],
    [{ type: 'yangyu', count: 8 }, { type: 'fusangjiashou', count: 4 }, { type: 'jinwu', count: 1 }],
  ]);
  assert.deepEqual(level.waves.map(wave => wave.interval), [1.1, 1, 1, 1.05, 0.9, 0.78, 0.82, 0.68, 0.62, 0.82]);
  assert.deepEqual(level.waves.map(wave => wave.hpMultiplier ?? 1), [1, 1, 1, 1, 1.05, 1.1, 1.15, 1.25, 1.35, 1.2]);
  assert.equal(level.waves[9].bossHpMultiplier, 1.1);
});

test('Level6 lineup requires exactly three, filters Blessings, and retry returns to zero of three', () => {
  const game = new Game(() => 0.1, 6);
  assert.deepEqual(game.lineupRoster(), ['bifang', 'fuzhu', 'yinglong', 'baize']);
  for (const type of ['bifang', 'fuzhu']) game.toggleLineup(type);
  assert.equal(game.confirmLineup(), false);
  game.toggleLineup('baize');
  assert.equal(game.confirmLineup(), true);
  const choices = game.blessings.drawChoices([], game.lineupSelection);
  assert.equal(choices.every(choice => !choice.tower || choice.tower !== 'yinglong'), true);
  game.end('defeat');
  assert.equal(game.restart(), true);
  assert.equal(game.state, 'lineup');
  assert.deepEqual(game.lineupSelection, []);
});

test('Level6 wave ten applies the approved 6820 HP Boss multiplier', () => {
  const game = new Game(() => 0.2, 6);
  game.wave.waveNumber = 10;
  const boss = game.spawnEnemy('jinwu');
  assert.equal(boss.maxHp, 6820);
  assert.equal(boss.hp, 6820);
});

test('sunlight zones use logical coordinates and alternate A/B every six seconds', () => {
  const game = new Game(() => 0.2, 6);
  const inA = game.spawnEnemy('yangyu');
  const inB = game.spawnEnemy('fusangjiashou');
  Object.assign(inA, { x: 150, y: 100 });
  Object.assign(inB, { x: 320, y: 380 });

  assert.equal(game.map.sunlightZoneAt(inA), 'A');
  assert.equal(game.map.sunlightZoneAt(inB), 'B');
  assert.equal(game.map.sunlightZoneAt({ x: 20, y: 20 }), null);

  SunlightSystem.update(game, 0);
  assert.deepEqual(SunlightSystem.activeZoneIds(game), ['A']);
  assert.equal(inA.inSunlight, true);
  assert.equal(inB.inSunlight, false);

  SunlightSystem.update(game, 5.99);
  assert.deepEqual(SunlightSystem.activeZoneIds(game), ['A']);
  SunlightSystem.update(game, 0.01);
  assert.deepEqual(SunlightSystem.activeZoneIds(game), ['B']);
  assert.equal(inA.inSunlight, false);
  assert.equal(inB.inSunlight, true);

  game.sunlight.phase2 = true;
  SunlightSystem.update(game, 0);
  assert.deepEqual(SunlightSystem.activeZoneIds(game), ['A', 'B']);
  assert.equal(inA.inSunlight, true);
  assert.equal(inB.inSunlight, true);
});

test('Yangyu receives exactly 1.28 movement speed only in active sunlight', () => {
  const map = new GameMap({
    width: 390, height: 610, pathWidth: 54, slots: [],
    waypoints: [{ x: 0, y: 0 }, { x: 300, y: 0 }],
  });
  const boosted = new Enemy('yangyu', ENEMY_DATA.yangyu, map);
  boosted.inSunlight = true;
  boosted.update(0.1);
  assert.ok(Math.abs(boosted.pathDistance - 86 * 1.28 * 0.1) < 1e-9);

  const normal = new Enemy('yangyu', ENEMY_DATA.yangyu, map);
  normal.inSunlight = false;
  normal.update(0.1);
  assert.ok(Math.abs(normal.pathDistance - 86 * 0.1) < 1e-9);
});

test('sunlight armor and shield reduce damage only while active and armor removal fires once', () => {
  const game = new Game(() => 0.2, 6);
  const armor = game.spawnEnemy('fusangjiashou');
  const shield = game.spawnEnemy('jinwu');
  Object.assign(armor, { x: 150, y: 100 });
  Object.assign(shield, { x: 160, y: 105 });

  SunlightSystem.update(game, 0);
  assert.equal(armor.yangmuArmorActive, true);
  assert.equal(shield.sunShieldActive, true);
  assert.equal(CombatSystem.hit(armor, 100).damage, 75);
  assert.equal(CombatSystem.hit(shield, 100).damage, 80);

  Object.assign(armor, { x: 20, y: 20 });
  Object.assign(shield, { x: 20, y: 20 });
  SunlightSystem.update(game, 0);
  assert.equal(armor.yangmuArmorActive, false);
  assert.equal(shield.sunShieldActive, false);
  assert.equal(armor.sunlightArmorBreakPending, true);
  armor.sunlightArmorBreakPending = false;
  SunlightSystem.update(game, 0);
  assert.equal(armor.sunlightArmorBreakPending, false, 'armor break is not emitted repeatedly while inactive');
  assert.equal(CombatSystem.hit(armor, 100).damage, 100);
  assert.equal(CombatSystem.hit(shield, 100).damage, 100);
});

test('Jinwu enters P2 once at 50 percent without healing', () => {
  const boss = new Enemy('jinwu', ENEMY_DATA.jinwu, new GameMap(LEVELS[6].map));
  boss.hp = boss.maxHp * 0.5;
  assert.deepEqual(BossSystem.update(boss, 0, {}), [{ type: 'jinwuPhase2', phase: 2, duration: 0.8 }]);
  assert.equal(boss.hp, boss.maxHp * 0.5);
  assert.equal(boss.speedMultiplier, 1.12);
  assert.deepEqual(BossSystem.update(boss, 0, {}), []);
});

test('Jinwu P2 activates both sunlight zones and emits one presentation effect', () => {
  const game = new Game(() => 0.2, 6);
  game.state = 'combat';
  game.time.setPaused(false);
  const boss = game.spawnEnemy('jinwu');
  boss.hp = boss.maxHp * 0.5;

  game.update(0);
  assert.equal(game.sunlight.phase2, true);
  assert.deepEqual(SunlightSystem.activeZoneIds(game), ['A', 'B']);
  assert.equal(game.effects.filter(effect => effect.type === 'jinwuPhase2').length, 1);
  game.update(0);
  assert.equal(game.effects.filter(effect => effect.type === 'jinwuPhase2').length, 1);
});

test('Level6 victory waits for empty queue, resolved normals, and Jinwu defeat', () => {
  const game = new Game(() => 0.2, 6);
  for (const type of ['bifang', 'fuzhu', 'baize']) game.toggleLineup(type);
  game.confirmLineup();
  game.state = 'combat';
  game.time.setPaused(false);
  game.wave.waveNumber = 10;
  game.wave.active = true;
  game.wave.queue.length = 0;
  game.wave.spawnedAlive = 2;
  const ordinary = game.spawnEnemy('yangyu');
  const boss = game.spawnEnemy('jinwu');

  game.completeWave();
  assert.equal(game.state, 'combat', 'an empty queue cannot win while Jinwu is alive');

  boss.takeDamage(boss.maxHp);
  game.update(0);
  assert.equal(game.state, 'combat', 'Jinwu death cannot win while a normal enemy remains');
  assert.equal(game.levelBossDefeated, true);

  ordinary.takeDamage(ordinary.maxHp);
  game.update(0);
  assert.equal(game.state, 'victory');
});

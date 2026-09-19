import test from 'node:test';
import assert from 'node:assert/strict';
import { ENEMY_DATA, LEVELS, getLevelData } from '../src/config/gameData.js';
import { Game } from '../src/core/Game.js';

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

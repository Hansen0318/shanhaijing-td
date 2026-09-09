import test from 'node:test';
import assert from 'node:assert/strict';
import { Game } from '../src/core/Game.js';
import { Renderer } from '../src/render/Renderer.js';
import { Enemy } from '../src/entities/Enemy.js';
import { ENEMY_DATA, LEVELS } from '../src/config/gameData.js';
import { GameMap } from '../src/map/GameMap.js';

function fakeContext() {
  const calls = { drawImage: [], translate: [], scale: [], filters: [] };
  let filter = 'none';
  return {
    calls,
    set filter(value) { filter = value; calls.filters.push(value); },
    get filter() { return filter; },
    setTransform() {}, clearRect() {}, fillRect() {}, beginPath() {}, moveTo() {}, lineTo() {}, stroke() {},
    setLineDash() {}, arc() {}, fill() {}, fillText() {}, strokeText() {}, save() {}, restore() {}, rotate() {},
    translate(x, y) { calls.translate.push([x, y]); },
    scale(x, y) { calls.scale.push([x, y]); },
    drawImage(...args) { calls.drawImage.push(args); },
  };
}

function fakeArt() {
  const images = new Map();
  return {
    get(id) {
      if (!images.has(id)) images.set(id, { id, naturalWidth: 100, naturalHeight: 100 });
      return images.get(id);
    },
  };
}

function rendererFixture(options) {
  const ctx = fakeContext();
  const previousAddEventListener = globalThis.addEventListener;
  const previousDevicePixelRatio = globalThis.devicePixelRatio;
  globalThis.addEventListener = () => {};
  globalThis.devicePixelRatio = 1;
  const renderer = new Renderer({ getContext: () => ctx }, fakeArt(), options);
  globalThis.addEventListener = previousAddEventListener;
  globalThis.devicePixelRatio = previousDevicePixelRatio;
  return { renderer, ctx };
}

function visualEnemy(type, x, y) {
  return {
    id: type === 'chiyu' ? 1 : 2,
    type, x, y, radius: ENEMY_DATA[type].radius, hp: 100, maxHp: 100,
    isBoss: type === 'paoxiao', hitFlash: 0, visualHitFlash: 0,
    statuses: {}, pathDistance: 20,
    map: { totalLength: 100, positionAt: () => ({ x: x + 1, y }) },
  };
}

test('disabled Motion Lite preserves the original static sprite transforms', () => {
  const { renderer, ctx } = rendererFixture({ motionEnabled: false });
  const enemy = visualEnemy('chiyu', 70, 90);
  const tower = { type: 'bifang', x: 120, y: 140, level: 1, getStats: () => ({ range: 130 }) };
  const game = {
    visualTime: 0.125, enemies: [enemy], towers: [tower], selectedSlot: null,
    effects: [{ type: 'towerRecoil', towerType: 'bifang', x: 120, y: 140, dx: 1, dy: 0, life: 0.09, duration: 0.09 }],
    blessings: { modifiers: {} },
  };

  renderer.drawEnemies(ctx, game);
  renderer.drawTowers(ctx, game);

  assert.deepEqual(ctx.calls.translate, [[70, 93], [120, 144]]);
  assert.deepEqual(ctx.calls.scale, []);
});

test('enemy bob is render-only and gives chiyu a lighter motion than yanjia', () => {
  const { renderer, ctx } = rendererFixture({ motionEnabled: true });
  const chiyu = visualEnemy('chiyu', 70, 90);
  const yanjia = visualEnemy('yanjia', 120, 130);
  const original = [[chiyu.x, chiyu.y, chiyu.pathDistance], [yanjia.x, yanjia.y, yanjia.pathDistance]];

  renderer.drawEnemies(ctx, { visualTime: 0.125, enemies: [chiyu, yanjia], effects: [] });

  const chiyuOffset = ctx.calls.translate[0][1] - 93;
  const yanjiaOffset = ctx.calls.translate[1][1] - 133;
  assert.ok(Math.abs(chiyuOffset) > Math.abs(yanjiaOffset));
  assert.ok(Math.abs(chiyuOffset) <= 3 && Math.abs(yanjiaOffset) <= 2);
  assert.deepEqual([[chiyu.x, chiyu.y, chiyu.pathDistance], [yanjia.x, yanjia.y, yanjia.pathDistance]], original);
});

test('hit flash lasts 90ms and death visuals expire without changing enemy coordinates', () => {
  const map = new GameMap(LEVELS[2].map);
  const enemy = new Enemy('chiyu', ENEMY_DATA.chiyu, map);
  const original = { x: enemy.x, y: enemy.y, pathDistance: enemy.pathDistance };
  enemy.takeDamage(1);
  assert.equal(enemy.visualHitFlash, 0.09);

  const game = new Game(() => 0, 2);
  game.spawnEnemy('chiyu');
  const doomed = game.enemies[0];
  doomed.takeDamage(doomed.maxHp);
  game.onEnemyKilled(doomed);
  const death = game.effects.find(effect => effect.type === 'unitDeath');
  assert.equal(death.duration, 0.18);
  assert.deepEqual({ x: enemy.x, y: enemy.y, pathDistance: enemy.pathDistance }, original);

  const { renderer, ctx } = rendererFixture({ motionEnabled: true });
  renderer.drawEffects(ctx, { effects: [death, { ...death, life: 0 }] });
  assert.equal(ctx.calls.drawImage.filter(args => args[0].id === 'chiyu').length, 1);
});

test('tower recoil is visual-only and projectile or beam origins stay on gameplay coordinates', () => {
  const game = new Game(() => 0, 2);
  game.economy.add(1000);
  game.buildTower(0, 'yinglong');
  const tower = game.towers[0];
  game.spawnEnemy('yanjia');
  const enemy = game.enemies[0];
  enemy.x = tower.x + 40;
  enemy.y = tower.y;
  enemy.pathDistance = 40;
  const original = { x: tower.x, y: tower.y };

  game.updateTowers(0);

  const recoil = game.effects.find(effect => effect.type === 'towerRecoil');
  const beam = game.effects.find(effect => effect.type === 'beam');
  assert.ok(recoil);
  assert.deepEqual(beam.points[0], original);
  assert.deepEqual({ x: tower.x, y: tower.y }, original);

  const { renderer, ctx } = rendererFixture({ motionEnabled: true });
  renderer.drawTowers(ctx, { ...game, visualTime: 0.125, selectedSlot: null });
  assert.notDeepEqual(ctx.calls.translate[0], [tower.x, tower.y + 4]);
  assert.deepEqual({ x: tower.x, y: tower.y }, original);
});

test('paoxiao consume scale is visual-only and preserves HP and threshold results', () => {
  const game = new Game(() => 0, 2);
  game.state = 'combat';
  game.time.setPaused(false);
  game.spawnEnemy('paoxiao');
  const boss = game.enemies[0];
  boss.hp = boss.maxHp * 0.7;
  const x = boss.x;
  const y = boss.y;

  game.update(0);

  assert.equal(boss.hp, 2808);
  assert.deepEqual([...boss.triggeredBossThresholds], [0.7]);
  const { renderer, ctx } = rendererFixture({ motionEnabled: true });
  renderer.drawEnemies(ctx, game);
  assert.ok(ctx.calls.scale.some(([sx, sy]) => sx > 1 && sy > 1));
  assert.deepEqual({ x: boss.x, y: boss.y }, { x, y });
});

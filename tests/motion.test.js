import test from 'node:test';
import assert from 'node:assert/strict';
import { Game } from '../src/core/Game.js';
import { Renderer } from '../src/render/Renderer.js';
import { Enemy } from '../src/entities/Enemy.js';
import { ENEMY_DATA, LEVELS } from '../src/config/gameData.js';
import { GameMap } from '../src/map/GameMap.js';
import { MotionSystem } from '../src/systems/MotionSystem.js?v=motion-lite-1';
import { UNIT_MOTION_CONFIG } from '../src/config/motionData.js?v=motion-lite-1';

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
    type, x, y, radius: ENEMY_DATA[type]?.radius ?? 12, hp: 100, maxHp: 100,
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
  const flashFixture = rendererFixture({ motionEnabled: true });
  flashFixture.renderer.drawEnemies(flashFixture.ctx, { visualTime: 0, enemies: [enemy], effects: [] });
  assert.equal(flashFixture.ctx.calls.drawImage.filter(args => args[0].id === 'chiyu').length, 2);
  assert.ok(flashFixture.ctx.calls.filters.some(value => value.includes('brightness')));

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

  const armoredGame = new Game(() => 0, 2);
  armoredGame.spawnEnemy('yanjia');
  armoredGame.enemies[0].takeDamage(armoredGame.enemies[0].maxHp);
  armoredGame.onEnemyKilled(armoredGame.enemies[0]);
  assert.equal(armoredGame.effects.find(effect => effect.type === 'unitDeath').duration, 0.22);
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

  const projectileGame = new Game(() => 0, 2);
  projectileGame.economy.add(1000);
  projectileGame.buildTower(0, 'bifang');
  const bifang = projectileGame.towers[0];
  projectileGame.spawnEnemy('yanjia');
  projectileGame.enemies[0].x = bifang.x + 40;
  projectileGame.enemies[0].y = bifang.y;
  projectileGame.updateTowers(0);
  assert.deepEqual({ x: projectileGame.projectiles[0].x, y: projectileGame.projectiles[0].y }, { x: bifang.x, y: bifang.y });
  assert.deepEqual({ x: bifang.x, y: bifang.y }, { x: LEVELS[2].map.slots[0].x, y: LEVELS[2].map.slots[0].y });
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

test('first-level enemies have distinct render-only weight and speed motion', () => {
  const samples = ['minion', 'swift', 'giant'].map(type => {
    const enemy = visualEnemy(type, 80, 120);
    const before = { x: enemy.x, y: enemy.y, pathDistance: enemy.pathDistance };
    const transform = MotionSystem.enemyTransform(enemy, 0.125, []);
    assert.equal(transform.xOffset, 0);
    assert.deepEqual({ x: enemy.x, y: enemy.y, pathDistance: enemy.pathDistance }, before);
    return [type, transform, UNIT_MOTION_CONFIG.enemies[type]];
  });

  const configs = Object.fromEntries(samples.map(([type, , config]) => [type, config]));
  assert.ok(configs.swift.bobHz > configs.minion.bobHz);
  assert.ok(configs.giant.bobHz < configs.minion.bobHz);
  assert.ok(configs.giant.bobPixels < configs.minion.bobPixels);
  assert.ok(samples.every(([, transform]) => transform.yOffset !== 0));
});

test('first-level enemy hit and death visuals use configured durations', () => {
  const game = new Game(() => 0, 1);
  for (const [type, expectedDeath] of [['minion', 0.18], ['swift', 0.16], ['giant', 0.22]]) {
    game.spawnEnemy(type);
    const enemy = game.enemies.at(-1);
    enemy.takeDamage(1);
    assert.equal(enemy.visualHitFlash, UNIT_MOTION_CONFIG.hitFlashSeconds);
    enemy.takeDamage(enemy.maxHp);
    game.onEnemyKilled(enemy);
    assert.equal(game.effects.findLast(effect => effect.type === 'unitDeath')?.duration, expectedDeath);
  }
});

test('qiongqi frenzy pulse and hit flash never alter boss gameplay state', () => {
  const game = new Game(() => 0, 1);
  game.state = 'combat';
  game.time.setPaused(false);
  game.spawnEnemy('qiongqi');
  const boss = game.enemies[0];
  const position = { x: boss.x, y: boss.y, pathDistance: boss.pathDistance };
  boss.takeDamage(1);
  assert.equal(boss.visualHitFlash, UNIT_MOTION_CONFIG.hitFlashSeconds);
  boss.hp = boss.maxHp * 0.5;
  game.update(0);

  assert.equal(boss.frenzied, true);
  assert.equal(boss.speedMultiplier, 1.5);
  assert.deepEqual({ x: boss.x, y: boss.y, pathDistance: boss.pathDistance }, position);
  assert.ok(game.effects.some(effect => effect.type === 'qiongqiFrenzyPulse'));
  assert.ok(MotionSystem.enemyTransform(boss, game.visualTime, game.effects).scale > 1);
});

test('fuzhu idle and recoil keep slow projectile origin on its gameplay coordinates', () => {
  const game = new Game(() => 0, 1);
  game.economy.add(1000);
  game.buildTower(0, 'fuzhu');
  const tower = game.towers[0];
  game.spawnEnemy('minion');
  game.enemies[0].x = tower.x + 40;
  game.enemies[0].y = tower.y;
  const before = { x: tower.x, y: tower.y };

  game.updateTowers(0);

  assert.ok(game.effects.some(effect => effect.type === 'towerRecoil' && effect.towerType === 'fuzhu'));
  assert.deepEqual({ x: game.projectiles[0].x, y: game.projectiles[0].y }, before);
  assert.deepEqual({ x: tower.x, y: tower.y }, before);
  assert.ok(MotionSystem.towerTransform(tower, 0.125, game.effects).scale !== 1);
});

test('missing motion configuration falls back to a centered static sprite', () => {
  const enemy = visualEnemy('unknown', 88, 99);
  assert.deepEqual(MotionSystem.enemyTransform(enemy, 1, []), { xOffset: 0, yOffset: 0, scale: 1, flash: false });
  assert.deepEqual(MotionSystem.towerTransform({ type: 'unknown', x: 1, y: 2 }, 1, []), { xOffset: 0, yOffset: 0, scale: 1 });
});

test('different source image sizes keep their render origin horizontally centered', () => {
  const { renderer, ctx } = rendererFixture();
  renderer.art = {
    get(id) {
      return id === 'minion'
        ? { id, naturalWidth: 80, naturalHeight: 100 }
        : { id, naturalWidth: 180, naturalHeight: 90 };
    },
  };

  renderer.drawContained(ctx, 'minion', 120, 90, 36, 38);
  renderer.drawContained(ctx, 'giant', 120, 90, 48, 48);

  assert.deepEqual(ctx.calls.translate, [[120, 90], [120, 90]]);
  ctx.calls.drawImage.forEach(([, drawX, , width]) => assert.equal(drawX, -width / 2));
});

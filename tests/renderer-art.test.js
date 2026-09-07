import test from 'node:test';
import assert from 'node:assert/strict';
import { Renderer } from '../src/render/Renderer.js';
import { MAP_DATA } from '../src/config/gameData.js';

function fakeContext() {
  const calls = { drawImage: [], rotate: [], scale: [] };
  return {
    calls,
    setTransform() {}, clearRect() {}, fillRect() {}, beginPath() {}, moveTo() {}, lineTo() {}, stroke() {},
    setLineDash() {}, arc() {}, fill() {}, fillText() {}, strokeText() {}, save() {}, restore() {}, translate() {},
    drawImage(...args) { calls.drawImage.push(args); },
    rotate(value) { calls.rotate.push(value); },
    scale(x, y) { calls.scale.push([x, y]); },
  };
}

function fakeArt() {
  const images = new Map();
  return {
    get(id) {
      if (!images.has(id)) images.set(id, { id, complete: true, naturalWidth: id === 'yinglongBeam' ? 1501 : 1200, naturalHeight: id === 'yinglongBeam' ? 387 : 1200 });
      return images.get(id);
    },
  };
}

function rendererFixture() {
  const ctx = fakeContext();
  const canvas = { getContext: () => ctx };
  const previousAddEventListener = globalThis.addEventListener;
  const previousDevicePixelRatio = globalThis.devicePixelRatio;
  globalThis.addEventListener = () => {};
  globalThis.devicePixelRatio = 1;
  const renderer = new Renderer(canvas, fakeArt());
  globalThis.addEventListener = previousAddEventListener;
  globalThis.devicePixelRatio = previousDevicePixelRatio;
  return { renderer, ctx };
}

test('renderer draws the cropped map art, eight platforms, spawn and base without changing map coordinates', () => {
  const { renderer, ctx } = rendererFixture();
  renderer.render({
    towers: Array(MAP_DATA.slots.length).fill(null), selectedSlot: null, enemies: [], projectiles: [], effects: [],
    blessings: { modifiers: {} },
  });

  assert.ok(ctx.calls.drawImage.length > 0, 'renderer did not draw packaged art');
  assert.equal(ctx.calls.drawImage[0][0].id, 'background');
  assert.equal(ctx.calls.drawImage[0].length, 9, 'background must use a source crop instead of stretching the full image');
  assert.equal(ctx.calls.drawImage.filter(args => args[0].id === 'slotPlatform').length, 8);
  assert.equal(ctx.calls.drawImage.some(args => args[0].id === 'spawnRift'), true);
  assert.equal(ctx.calls.drawImage.some(args => args[0].id === 'baseSeal'), true);
});

test('directional projectile art rotates toward its target while radial art does not rotate', () => {
  const { renderer, ctx } = rendererFixture();
  renderer.drawProjectiles(ctx, { projectiles: [{ type: 'bifang', x: 20, y: 30, targetPoint: { x: 40, y: 50 } }] });
  const projectileRotations = ctx.calls.rotate.length;
  renderer.drawEffects(ctx, { effects: [{ type: 'explosion', x: 80, y: 90, radius: 55, hitPoints: [], life: 0.2, duration: 0.36 }] });

  assert.equal(ctx.calls.drawImage.some(args => args[0].id === 'bifangFireball'), true);
  assert.equal(projectileRotations, 1);
  assert.equal(ctx.calls.rotate.length, projectileRotations, 'explosion art must remain radial');
});

test('enemy renderer swaps to frenzy qiongqi art and mirrors only by travel direction', () => {
  const { renderer, ctx } = rendererFixture();
  const map = { totalLength: 100, positionAt: () => ({ x: 40, y: 20 }) };
  renderer.drawEnemies(ctx, { enemies: [{
    type: 'qiongqi', x: 50, y: 20, radius: 22, hp: 2000, maxHp: 4000, isBoss: true, frenzied: true,
    hitFlash: 0, statuses: {}, map, pathDistance: 40,
  }] });

  assert.equal(ctx.calls.drawImage.some(args => args[0].id === 'qiongqiFrenzy'), true);
  assert.deepEqual(ctx.calls.scale.at(-1), [-1, 1]);
  assert.equal(ctx.calls.rotate.length, 0, 'enemy art must stay upright');
});

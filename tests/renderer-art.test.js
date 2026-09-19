import test from 'node:test';
import assert from 'node:assert/strict';
import { Renderer } from '../src/render/Renderer.js';
import { LEVELS, MAP_DATA } from '../src/config/gameData.js';

function fakeContext() {
  const calls = { drawImage: [], rotate: [], scale: [], translate: [], fillRect: [], fillText: [], strokeText: [], moveTo: [], clip: 0, closePath: 0, bezierCurveTo: [], arc: [] };
  return {
    calls,
    setTransform() {}, clearRect() {}, fillRect(...args) { calls.fillRect.push(args); }, beginPath() {}, moveTo(...args) { calls.moveTo.push(args); }, lineTo() {}, stroke() {},
    setLineDash() {}, arc() {}, fill() {}, fillText(...args) { calls.fillText.push(args); }, strokeText(...args) { calls.strokeText.push(args); }, save() {}, restore() {}, translate(...args) { calls.translate.push(args); },
    quadraticCurveTo() {}, closePath() { calls.closePath += 1; }, clip() { calls.clip += 1; }, bezierCurveTo(...args) { calls.bezierCurveTo.push(args); },
    drawImage(...args) { calls.drawImage.push(args); },
    rotate(value) { calls.rotate.push(value); },
    scale(x, y) { calls.scale.push([x, y]); },
  };
}

function fakeArt(dimensions = {}) {
  const images = new Map();
  return {
    get(id) {
      if (!images.has(id)) {
        const [naturalWidth, naturalHeight] = dimensions[id] ?? (id === 'yinglongBeam' ? [1501, 387] : [1200, 1200]);
        images.set(id, { id, complete: true, naturalWidth, naturalHeight });
      }
      return images.get(id);
    },
  };
}

function rendererFixture({ art = fakeArt(), motionEnabled } = {}) {
  const ctx = fakeContext();
  const canvas = { getContext: () => ctx };
  const previousAddEventListener = globalThis.addEventListener;
  const previousDevicePixelRatio = globalThis.devicePixelRatio;
  globalThis.addEventListener = () => {};
  globalThis.devicePixelRatio = 1;
  const renderer = new Renderer(canvas, art, { motionEnabled });
  globalThis.addEventListener = previousAddEventListener;
  globalThis.devicePixelRatio = previousDevicePixelRatio;
  return { renderer, ctx };
}

test('each enemy sprite visible center stays on its logical path anchor', () => {
  const cases = [
    ['minion', 'minion', 256, 247, 123], ['swift', 'swift', 256, 235, 116.5],
    ['giant', 'giant', 256, 247, 122.5], ['qiongqi', 'qiongqi', 384, 373, 186],
    ['chiyu', 'chiyu', 256, 256, 127.5], ['yanjia', 'yanjia', 256, 256, 128.5],
    ['paoxiao', 'paoxiao', 384, 384, 190], ['shuixiao', 'shuixiao', 384, 384, 194.5],
    ['xuanjiashou', 'xuanjiashou', 384, 384, 194], ['xiangliu', 'xiangliu', 512, 512, 251.5],
    ['meihu', 'meihu', 256, 256, 127.5], ['huanli', 'huanli', 256, 256, 127.5],
    ['jiuweihu', 'jiuweihuPhase1', 512, 512, 255], ['zhuyan', 'zhuyan', 256, 256, 127.5],
    ['lili', 'lili', 256, 256, 127.5], ['xingtian', 'xingtianPhase1', 384, 384, 191.5],
  ];
  const dimensions = Object.fromEntries(cases.map(([, artId, width, height]) => [artId, [width, height]]));
  const { renderer, ctx } = rendererFixture({ art: fakeArt(dimensions), motionEnabled: false });
  const map = { totalLength: 100, positionAt: () => ({ x: 101, y: 100 }), isWeakWater: () => false };

  for (const [type, artId, , , visibleCenterY] of cases) {
    const beforeDraws = ctx.calls.drawImage.length;
    const beforeTranslations = ctx.calls.translate.length;
    renderer.drawEnemies(ctx, { visualTime: 0, effects: [], illusions: [], enemies: [{
      type, bossPhase: 1, id: type, x: 100, y: 100, radius: 12, hp: 100, maxHp: 100,
      isBoss: ['qiongqi', 'paoxiao', 'xiangliu', 'jiuweihu', 'xingtian'].includes(type),
      hitFlash: 0, visualHitFlash: 0, statuses: {}, map, pathDistance: 40,
    }] });
    const draw = ctx.calls.drawImage.slice(beforeDraws).find(args => args[0].id === artId);
    const translate = ctx.calls.translate.slice(beforeTranslations).at(0);
    const renderedScale = draw[4] / draw[0].naturalHeight;
    assert.equal(translate[1], 100, `${type} adds an unmeasured common Y offset`);
    assert.ok(Math.abs(draw[2] + visibleCenterY * renderedScale) <= 0.1, `${type} visible center misses its logical path anchor`);
  }
});

function emptyGame(level = LEVELS[1]) {
  return {
    level,
    map: { data: level.map },
    towers: Array(level.map.slots.length).fill(null), selectedSlot: null,
    enemies: [], projectiles: [], effects: [], blessings: { modifiers: {} },
  };
}

test('renderer draws the cropped map art, eight platforms, spawn and base without changing map coordinates', () => {
  const { renderer, ctx } = rendererFixture();
  renderer.render(emptyGame());

  assert.ok(ctx.calls.drawImage.length > 0, 'renderer did not draw packaged art');
  assert.equal(ctx.calls.drawImage[0][0].id, 'background');
  assert.equal(ctx.calls.drawImage[0].length, 9, 'background must use a source crop instead of stretching the full image');
  assert.equal(ctx.calls.drawImage.filter(args => args[0].id === 'slotPlatform').length, 8);
  assert.equal(ctx.calls.drawImage.some(args => args[0].id === 'spawnRift'), true);
  assert.equal(ctx.calls.drawImage.some(args => args[0].id === 'baseSeal'), true);
});

test('renderer uses the active level map, crop, props and eight slots', () => {
  const { renderer, ctx } = rendererFixture();
  renderer.render(emptyGame(LEVELS[2]));

  assert.equal(ctx.calls.drawImage[0][0].id, 'level2Background');
  assert.deepEqual(ctx.calls.drawImage[0].slice(1, 5), [70, 0, 897, 1402]);
  assert.equal(ctx.calls.drawImage.filter(args => args[0].id === 'slotPlatform').length, 8);
  assert.equal(ctx.calls.drawImage.some(args => args[0].id === 'level2Spawn'), true);
  assert.equal(ctx.calls.drawImage.some(args => args[0].id === 'level2Base'), true);
});

test('renderer uses level-three map art and draws both enemies plus Xiangliu', () => {
  const { renderer, ctx } = rendererFixture();
  renderer.render(emptyGame(LEVELS[3]));
  assert.equal(ctx.calls.drawImage[0][0].id, 'level3Background');
  assert.deepEqual(ctx.calls.drawImage[0].slice(1, 5), [0, 0, 390, 610]);
  assert.equal(ctx.calls.drawImage.filter(args => args[0].id === 'slotPlatform').length, 8);
  assert.equal(ctx.calls.drawImage.some(args => args[0].id === 'level3Spawn'), true);
  assert.equal(ctx.calls.drawImage.some(args => args[0].id === 'level3Base'), true);

  const map = { totalLength: 100, positionAt: () => ({ x: 80, y: 20 }) };
  renderer.drawEnemies(ctx, { visualTime: 0, effects: [], enemies: ['shuixiao', 'xuanjiashou', 'xiangliu'].map((type, index) => ({
    type, x: 50 + index * 20, y: 20, radius: 12, hp: 100, maxHp: 100,
    isBoss: type === 'xiangliu', hitFlash: 0, visualHitFlash: 0, statuses: {}, map, pathDistance: 40,
  })) });
  for (const id of ['shuixiao', 'xuanjiashou', 'xiangliu']) assert.equal(ctx.calls.drawImage.some(args => args[0].id === id), true);
});

test('renderer uses Qingqiu map art, Baize, illusions, and Jiuweihu phase sprites', () => {
  const { renderer, ctx } = rendererFixture();
  const game = emptyGame(LEVELS[4]);
  game.visualTime = 0.2;
  game.towers[0] = { type: 'baize', x: 95, y: 91, level: 1, getStats: () => ({ range: 128 }) };
  const map = { totalLength: 100, positionAt: () => ({ x: 81, y: 20 }), isWeakWater: () => false };
  game.enemies = [{ type: 'jiuweihu', bossPhase: 2, id: 4, x: 80, y: 20, radius: 27, hp: 100, maxHp: 100, isBoss: true, hitFlash: 0, visualHitFlash: 0, statuses: {}, map, pathDistance: 40 }];
  game.illusions = [{ type: 'huanli', id: 'illusion-1', x: 100, y: 40, radius: 17, hp: 1, maxHp: 1, isBoss: false, isIllusion: true, hitFlash: 0, visualHitFlash: 0, statuses: {}, map, pathDistance: 30 }];
  renderer.render(game);
  for (const id of ['level4Background', 'level4Spawn', 'level4Base', 'baize', 'jiuweihuPhase2', 'huanli']) {
    assert.equal(ctx.calls.drawImage.some(args => args[0].id === id), true, `${id} art was not drawn`);
  }
});

test('renderer uses Buzhoushan map art, Xingtian phases, and all level-five mechanic VFX', () => {
  const { renderer, ctx } = rendererFixture();
  const game = emptyGame(LEVELS[5]);
  game.visualTime = 0.2;
  game.illusions = [];
  const map = { totalLength: 100, positionAt: () => ({ x: 81, y: 20 }), isWeakWater: () => false };
  game.enemies = [
    { type: 'zhuyan', id: 1, x: 100, y: 370, radius: 12, hp: 85, maxHp: 85, isBoss: false, visualHitFlash: 0, statuses: {}, map, pathDistance: 40 },
    { type: 'lili', id: 2, x: 180, y: 390, radius: 18, hp: 320, maxHp: 320, isBoss: false, visualHitFlash: 0, statuses: {}, map, pathDistance: 30 },
    { type: 'xingtian', id: 3, bossPhase: 2, x: 260, y: 405, radius: 29, hp: 3000, maxHp: 6670, isBoss: true, visualHitFlash: 0, statuses: {}, map, pathDistance: 20 },
  ];
  game.effects = [
    { type: 'zhuyanCharge', sourceId: 1, x: 100, y: 370, stage: 'charge', life: 0.4, duration: 0.6 },
    { type: 'liliArmorBreak', x: 180, y: 390, life: 0.3, duration: 0.45 },
    { type: 'xingtianShield', sourceId: 3, x: 260, y: 405, life: 1, duration: 1.2 },
    { type: 'xingtianEvolution', sourceId: 3, x: 260, y: 405, life: 0.5, duration: 0.7 },
    { type: 'xingtianEarthquake', sourceId: 3, x: 260, y: 405, radius: 95, life: 0.5, duration: 0.65 },
  ];
  renderer.render(game);
  for (const id of ['level5Background', 'level5Spawn', 'level5Base', 'zhuyan', 'lili', 'xingtianPhase2', 'zhuyanCharge', 'liliArmorBreak', 'xingtianShield', 'xingtianEvolution', 'xingtianEarthquake']) {
    assert.equal(ctx.calls.drawImage.some(args => args[0].id === id), true, `${id} art was not drawn`);
  }
});

test('Level6 keeps inactive sunlight zones visible as faint landmarks', () => {
  const { renderer, ctx } = rendererFixture({ motionEnabled: false });
  const game = emptyGame(LEVELS[6]);
  game.visualTime = 0;
  game.sunlight = { activeZoneIds: ['A'] };
  renderer.drawSunlightZones(ctx, game);

  assert.ok(ctx.calls.drawImage.filter(args => args[0].id === 'sunlightZone').length >= 3);
  assert.equal(ctx.calls.fillText.some(args => args[0] === '日照A・啟動'), true);
  assert.equal(ctx.calls.fillText.some(args => args[0] === '日照B'), true);
});

test('Level6 renders baked map props, sunlight, units, states, phase, death and facing through shared paths', () => {
  const { renderer, ctx } = rendererFixture({ motionEnabled: false });
  const game = emptyGame(LEVELS[6]);
  game.visualTime = 0.2;
  game.illusions = [];
  game.sunlight = { activeZoneIds: ['A', 'B'] };
  const map = { totalLength: 100, positionAt: () => ({ x: 40, y: 20 }), isWeakWater: () => false };
  game.enemies = [
    { type: 'yangyu', id: 1, x: 50, y: 20, radius: 11, hp: 90, maxHp: 90, isBoss: false, inSunlight: true, visualHitFlash: 0, hitFlash: 0, statuses: {}, map, pathDistance: 40 },
    { type: 'fusangjiashou', id: 2, x: 100, y: 40, radius: 18, hp: 350, maxHp: 350, isBoss: false, yangmuArmorActive: true, visualHitFlash: 0, hitFlash: 0, statuses: {}, map, pathDistance: 30 },
    { type: 'jinwu', id: 3, bossPhase: 2, x: 150, y: 60, radius: 29, hp: 3100, maxHp: 6200, isBoss: true, sunShieldActive: true, visualHitFlash: 0, hitFlash: 0, statuses: {}, map, pathDistance: 20 },
  ];
  game.effects = [
    { type: 'yangmuArmorBreak', x: 100, y: 40, life: 0.3, duration: 0.45 },
    { type: 'jinwuPhase2', sourceId: 3, x: 150, y: 60, life: 0.6, duration: 0.8 },
    { type: 'unitDeath', unitType: 'jinwu', x: 180, y: 80, life: 0.3, duration: 0.45, mirror: true, bossPhase: 2 },
  ];

  renderer.render(game);

  assert.equal(ctx.calls.drawImage[0][0].id, 'level6Background');
  assert.equal(ctx.calls.drawImage.some(args => args[0].id === undefined), false);
  assert.ok(ctx.calls.drawImage.filter(args => args[0].id === 'sunlightZone').length >= 4, 'both sunlight zones need landmark + active passes');
  for (const id of ['yangyu', 'fusangjiashou', 'jinwu', 'yangyuSunboost', 'yangmuArmorOn', 'jinwuSunshield', 'yangmuArmorBreak', 'jinwuPhase2']) {
    assert.equal(ctx.calls.drawImage.some(args => args[0].id === id), true, `${id} art was not drawn`);
  }
  for (const label of ['日照A・啟動', '日照B・啟動', '加速', '陽木甲', '日輪護體']) {
    assert.equal(ctx.calls.fillText.some(args => args[0] === label), true, `${label} readability label was not drawn`);
  }
  assert.ok(ctx.calls.scale.some(([x, y]) => x < 0 && y > 0), 'Level6 enemies and death art keep shared path-facing');
});

test('optional map props draw for Levels 1-5 and are omitted for Level6', () => {
  for (const levelId of [1, 2, 3, 4, 5]) {
    const { renderer, ctx } = rendererFixture();
    renderer.drawMapProps(ctx, emptyGame(LEVELS[levelId]));
    assert.equal(ctx.calls.drawImage.length, 2, `Level${levelId} must retain Spawn/Base overlays`);
  }
  const levelSix = rendererFixture();
  levelSix.renderer.drawMapProps(levelSix.ctx, emptyGame(LEVELS[6]));
  assert.equal(levelSix.ctx.calls.drawImage.length, 0, 'Level6 baked Spawn/Base must not request undefined art');

  const partial = rendererFixture();
  const incomplete = emptyGame({
    ...LEVELS[6],
    art: { ...LEVELS[6].art, spawnPosition: { x: 10, y: 10 }, basePosition: { x: 20, y: 20 } },
  });
  partial.renderer.drawMapProps(partial.ctx, incomplete);
  assert.equal(partial.ctx.calls.drawImage.length, 0, 'positions without matching art ids stay optional');
});

test('only Level4 renders soft curved fog without rectangular fills, clips, or borders', () => {
  const levelFour = rendererFixture();
  const game = emptyGame(LEVELS[4]);
  game.visualTime = 0;
  levelFour.renderer.drawFogZones(levelFour.ctx, game);
  assert.equal(levelFour.ctx.calls.bezierCurveTo.length, 6);
  assert.deepEqual(levelFour.ctx.calls.moveTo[1], [218, 116]);
  assert.deepEqual(levelFour.ctx.calls.bezierCurveTo[1], [214, 140, 137, 181, 140, 214]);
  assert.deepEqual(levelFour.ctx.calls.moveTo[4], [245, 406]);
  assert.deepEqual(levelFour.ctx.calls.bezierCurveTo[4], [277, 407, 335, 438, 335, 467]);
  assert.equal(levelFour.ctx.calls.fillRect.length, 0);
  assert.equal(levelFour.ctx.calls.clip, 0);
  assert.equal(levelFour.ctx.calls.closePath, 0);

  for (const levelId of [1, 2, 3]) {
    const otherLevel = rendererFixture();
    otherLevel.renderer.render(emptyGame(LEVELS[levelId]));
    assert.equal(otherLevel.ctx.calls.fillRect.length, 0, `Level${levelId} must not render fog regions`);
    assert.equal(otherLevel.ctx.calls.clip, 0, `Level${levelId} must not clip fog regions`);
  }
});

test('fog entry draws two bright Meihu echoes, while insight draws one weaker echo', () => {
  const normal = rendererFixture();
  normal.renderer.drawEffects(normal.ctx, { effects: [{
    type: 'fogEntry', unitType: 'meihu', x: 150, y: 160,
    weakened: false, life: 0.3, duration: 0.4,
  }] });
  assert.equal(normal.ctx.calls.drawImage.filter(args => args[0].id === 'meihu').length, 2);

  const insight = rendererFixture();
  insight.renderer.drawEffects(insight.ctx, { effects: [{
    type: 'fogEntry', unitType: 'meihu', x: 150, y: 160,
    weakened: true, life: 0.3, duration: 0.4,
  }] });
  assert.equal(insight.ctx.calls.drawImage.filter(args => args[0].id === 'meihu').length, 1);
});

test('renderer draws all new level-two enemy and boss art', () => {
  const { renderer, ctx } = rendererFixture();
  const map = { totalLength: 100, positionAt: () => ({ x: 80, y: 20 }) };
  renderer.drawEnemies(ctx, { enemies: ['chiyu', 'yanjia', 'paoxiao'].map((type, index) => ({
    type, x: 50 + index * 20, y: 20, radius: 12, hp: 100, maxHp: 100,
    isBoss: type === 'paoxiao', hitFlash: 0, statuses: {}, map, pathDistance: 40,
  })) });
  for (const id of ['chiyu', 'yanjia', 'paoxiao']) {
    assert.equal(ctx.calls.drawImage.some(args => args[0].id === id), true, `${id} art was not drawn`);
  }
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
  const [scaleX, scaleY] = ctx.calls.scale.at(-1);
  assert.ok(scaleX < 0 && scaleY > 0);
  assert.equal(Math.abs(scaleX), scaleY, 'idle motion must preserve proportional horizontal mirroring');
  assert.equal(ctx.calls.rotate.length, 0, 'enemy art must stay upright');
});

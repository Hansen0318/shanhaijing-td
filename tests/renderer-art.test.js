import test from 'node:test';
import assert from 'node:assert/strict';
import { Renderer } from '../src/render/Renderer.js';
import { LEVELS, MAP_DATA, TOWER_DATA } from '../src/config/gameData.js';
import { Tower } from '../src/entities/Tower.js';

function fakeContext() {
  const calls = { drawImage: [], rotate: [], scale: [], translate: [], fillRect: [], strokeRect: [], fillText: [], strokeText: [], moveTo: [], lineTo: [], quadraticCurveTo: [], clip: 0, closePath: 0, bezierCurveTo: [], arc: [], ellipse: [], gradients: 0, radialGradients: [], strokes: [], fills: [] };
  const context = {
    calls,
    setTransform() {}, clearRect() {}, fillRect(...args) { calls.fillRect.push(args); }, beginPath() {}, moveTo(...args) { calls.moveTo.push(args); }, lineTo(...args) { calls.lineTo.push(args); }, stroke() { calls.strokes.push({ lineWidth: context.lineWidth, strokeStyle: context.strokeStyle }); },
    strokeRect(...args) { calls.strokeRect.push(args); }, setLineDash() {}, arc(...args) { calls.arc.push(args); }, fill() { calls.fills.push({ fillStyle: context.fillStyle }); }, fillText(...args) { calls.fillText.push(args); }, strokeText(...args) { calls.strokeText.push(args); }, save() {}, restore() {}, translate(...args) { calls.translate.push(args); },
    quadraticCurveTo(...args) { calls.quadraticCurveTo.push(args); }, closePath() { calls.closePath += 1; }, clip() { calls.clip += 1; }, bezierCurveTo(...args) { calls.bezierCurveTo.push(args); }, ellipse(...args) { calls.ellipse.push(args); },
    createLinearGradient() { calls.gradients += 1; return { addColorStop() {} }; }, createRadialGradient(...args) { const record = { args, stops: [] }; calls.gradients += 1; calls.radialGradients.push(record); return { addColorStop(offset, color) { record.stops.push([offset, color]); } }; },
    drawImage(...args) { calls.drawImage.push(args); },
    rotate(value) { calls.rotate.push(value); },
    scale(x, y) { calls.scale.push([x, y]); },
  };
  return context;
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
    ['changyou', 'changyou', 256, 228, 107.489, 139.249], ['gudiao', 'gudiao', 256, 244, 117.151, 129.063],
    ['huashe', 'huashe', 512, 501, 250.5],
  ];
  const dimensions = Object.fromEntries(cases.map(([, artId, width, height]) => [artId, [width, height]]));
  const { renderer, ctx } = rendererFixture({ art: fakeArt(dimensions), motionEnabled: false });
  const map = { totalLength: 100, positionAt: () => ({ x: 101, y: 100 }), isWeakWater: () => false };

  for (const [type, artId, sourceWidth, , visibleCenterY, measuredCenterX = sourceWidth / 2] of cases) {
    const beforeDraws = ctx.calls.drawImage.length;
    const beforeTranslations = ctx.calls.translate.length;
    renderer.drawEnemies(ctx, { visualTime: 0, effects: [], illusions: [], enemies: [{
      type, bossPhase: 1, id: type, x: 100, y: 100, radius: 12, hp: 100, maxHp: 100,
      isBoss: ['qiongqi', 'paoxiao', 'xiangliu', 'jiuweihu', 'xingtian', 'huashe'].includes(type),
      hitFlash: 0, visualHitFlash: 0, statuses: {}, map, pathDistance: 40,
    }] });
    const draw = ctx.calls.drawImage.slice(beforeDraws).find(args => args[0].id === artId);
    const translate = ctx.calls.translate.slice(beforeTranslations).at(0);
    const renderedScale = draw[4] / draw[0].naturalHeight;
    assert.equal(translate[1], 100, `${type} adds an unmeasured common Y offset`);
    assert.ok(Math.abs(draw[1] + measuredCenterX * renderedScale) <= 0.1, `${type} visible horizontal center misses its logical path anchor`);
    assert.ok(Math.abs(draw[2] + visibleCenterY * renderedScale) <= 0.1, `${type} visible center misses its logical path anchor`);
  }
});

test('Level8 tower-pad visible centroid lands on each frozen tower slot', () => {
  const { renderer, ctx } = rendererFixture({ art: fakeArt({ slotPlatform: [256, 197] }) });
  const game = emptyGame(LEVELS[8]);
  renderer.render(game);

  const draws = ctx.calls.drawImage.filter(args => args[0].id === 'slotPlatform');
  const firstSlot = LEVELS[8].map.slots[0];
  const firstDraw = draws[0];
  const renderedScale = firstDraw[4] / firstDraw[0].naturalHeight;
  const platformTranslations = ctx.calls.translate.filter(([x]) => LEVELS[8].map.slots.some(slot => slot.x === x));
  const visibleCenterY = platformTranslations[0][1] + firstDraw[2] + 115.842 * renderedScale;
  assert.ok(Math.abs(visibleCenterY - firstSlot.y) <= 0.2,
    `tower pad visible center is ${visibleCenterY - firstSlot.y}px away from its frozen slot`);
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

test('Level8 renderer uses the approved background crop, eight slots, wetlands and Motion Lite anchors', () => {
  const { renderer, ctx } = rendererFixture();
  const game = emptyGame(LEVELS[8]);
  game.visualTime = 1.25;
  game.tide = { high: true, telegraph: false, activeZoneIds: ['A', 'B', 'C'] };
  renderer.render(game);
  assert.equal(ctx.calls.drawImage[0][0].id, 'level8Background');
  assert.deepEqual(ctx.calls.drawImage[0].slice(1, 5), [0, 0, 780, 1220]);
  assert.equal(ctx.calls.drawImage.filter(args => args[0].id === 'slotPlatform').length, 8);
  assert.ok(ctx.calls.clip >= 3, 'wetland polygons must clip low-luminance water motion to their exact shapes');
  assert.ok(ctx.calls.gradients >= 4, 'fog, ripple and active wetland motion require procedural gradients');
  assert.ok(ctx.calls.ellipse.length >= 2, 'ripple and bubble anchors must remain visibly animated');
});

test('Level8 Motion Lite stays inside frozen anchors while remaining readable at 390px', () => {
  const motion = LEVELS[8].map.environmentMotion;
  const gameFor = (environmentMotion, visualTime) => ({
    level: { id: 8, map: { wetlandZones: [], environmentMotion } },
    tide: { high: false, telegraph: false },
    visualTime,
  });

  const fogFixture = rendererFixture();
  fogFixture.renderer.drawLevelEightEnvironment(fogFixture.ctx, gameFor({ fog: motion.fog }, Math.PI / (2 * 0.34)));
  const fog = fogFixture.ctx.calls.radialGradients[0];
  assert.deepEqual(fog.args.slice(0, 2), [motion.fog.x + motion.fog.width / 2 + 8, motion.fog.y + motion.fog.height / 2]);
  assert.deepEqual(fog.stops.slice(0, 2), [[0, 'rgba(163, 207, 205, .16)'], [0.55, 'rgba(104, 165, 169, .10)']]);

  const rippleFixture = rendererFixture();
  rippleFixture.renderer.drawLevelEightEnvironment(rippleFixture.ctx, gameFor({ ripple: motion.ripple, bubbles: motion.bubbles }, 0));
  assert.equal(rippleFixture.ctx.calls.strokes[0].lineWidth, 2);
  assert.equal(rippleFixture.ctx.calls.strokes[0].strokeStyle, 'rgba(138, 226, 211, 0.24)');

  const expandedRippleFixture = rendererFixture();
  expandedRippleFixture.renderer.drawLevelEightEnvironment(expandedRippleFixture.ctx, gameFor({ ripple: motion.ripple }, 0.9 / 0.35));
  assert.ok(expandedRippleFixture.ctx.calls.ellipse[0][2] >= 38, 'ripple radius expansion must remain readable at phone width');

  assert.equal(rippleFixture.ctx.calls.arc.length, 5, 'bubble anchor should render five sparse bubbles');
  const bubbleRadii = rippleFixture.ctx.calls.arc.map(args => args[2]);
  assert.ok(Math.min(...bubbleRadii) >= 2.5 && Math.max(...bubbleRadii) <= 4.5);

  const reedFixture = rendererFixture();
  reedFixture.renderer.drawLevelEightEnvironment(reedFixture.ctx, gameFor({ reeds: motion.reeds }, Math.PI / (2 * 0.65)));
  const firstReedBase = reedFixture.ctx.calls.moveTo[0][0];
  const firstReedTip = reedFixture.ctx.calls.quadraticCurveTo[0][2];
  assert.ok(Math.abs(firstReedTip - firstReedBase) >= 4 && Math.abs(firstReedTip - firstReedBase) <= 6,
    'reed tip sway must stay within the approved 4-6px readability band');
});

test('Level9 renders the approved crop, frozen anchors, state cue and four restrained Motion Lite families', () => {
  const { renderer, ctx } = rendererFixture();
  const game = emptyGame(LEVELS[9]);
  game.visualTime = 1.2;
  game.dayNight = { state: 'day', telegraph: true };
  renderer.render(game);

  assert.equal(ctx.calls.drawImage[0][0].id, 'level9Background');
  assert.deepEqual(ctx.calls.drawImage[0].slice(1, 5), [0, 0, 780, 1220]);
  assert.equal(ctx.calls.drawImage.filter(args => args[0].id === 'slotPlatform').length, 8);
  assert.ok(ctx.calls.radialGradients.some(({ args }) => args[0] === 203 && args[1] === 251), 'celestial cue must stay registered at (203,251)');
  assert.ok(ctx.calls.fillRect.some(args => args[0] === 0 && args[1] === 0 && args[2] === 390 && args[3] === 610), 'day/night needs a restrained overall battlefield cue');
  assert.ok(ctx.calls.arc.filter(args => args[0] === 203 && args[1] === 251).length >= 2, 'telegraph must add phone-readable shrine rings');
  assert.ok(ctx.calls.quadraticCurveTo.length >= 2, 'banner micro-sway must be visibly procedural');
  assert.ok(ctx.calls.arc.length >= 6, 'corona plus sparse embers must remain recognizable at 390px');
  assert.deepEqual(ctx.calls.fillText.find(args => args[0] === '敵人入口'), ['敵人入口', 39, 40]);
  assert.deepEqual(ctx.calls.fillText.find(args => args[0] === '鐘山天門'), ['鐘山天門', 343, 544]);
});

test('Level9 enemy cues distinguish daylight speed, night armor and Zhulong P2', () => {
  const { renderer, ctx } = rendererFixture({ motionEnabled: false });
  const map = { totalLength: 100, positionAt: () => ({ x: 121, y: 100 }), isWeakWater: () => false };
  const enemy = (type, extra = {}) => ({
    type, id: type, x: 100, y: 100, radius: type === 'zhulong' ? 30 : 16,
    hp: 100, maxHp: 100, isBoss: type === 'zhulong', hitFlash: 0, visualHitFlash: 0,
    statuses: {}, map, pathDistance: 40, ...extra,
  });
  renderer.drawEnemies(ctx, {
    visualTime: 0.4, effects: [], illusions: [],
    enemies: [enemy('tiangou', { dayNightState: 'day' }), enemy('zheng', { dayNightState: 'night' }), enemy('zhulong', { bossPhase: 2, dayNightState: 'night' })],
  });

  assert.ok(ctx.calls.lineTo.length >= 3, 'daylight Tiangou needs short warm speed streaks');
  assert.ok(ctx.calls.arc.some(args => args[2] >= 22 && args[2] <= 26), 'night Zheng needs a cold armor rim');
  for (const label of ['晝馳', '夜甲', '極夜']) assert.ok(ctx.calls.fillText.some(args => args[0] === label), `${label} state tag missing`);
  assert.ok(ctx.calls.arc.some(args => args[2] >= 38), 'Zhulong P2 needs a strong procedural overlay');
});

test('Level8 base label is centered below the canonical Base instead of the map corner', () => {
  const { renderer, ctx } = rendererFixture();
  renderer.render(emptyGame(LEVELS[8]));
  const label = ctx.calls.fillText.find(args => args[0] === '幽冥靈核');
  assert.deepEqual(label, ['幽冥靈核', 231, 547]);
});

test('Huashe opening tide telegraph renders as two readable Boss-centered rings', () => {
  const { renderer, ctx } = rendererFixture();
  renderer.drawEffects(ctx, {
    enemies: [{ id: 'huashe-opening', x: 180, y: 120 }],
    effects: [{ type: 'huasheTideTelegraph', sourceId: 'huashe-opening', x: 180, y: 120, life: 0.4, duration: 0.8 }],
  });
  const rings = ctx.calls.arc.filter(args => args[0] === 180 && args[1] === 120);
  assert.ok(rings.length >= 2, '化蛇 opening warning must render two Boss-centered rings');
});

test('Xuangui projectile and delayed shock render procedurally without static VFX art', () => {
  const { renderer, ctx } = rendererFixture();
  renderer.drawProjectiles(ctx, { projectiles: [{ type: 'xuangui', x: 30, y: 40, targetPoint: { x: 70, y: 50 } }] });
  renderer.drawEffects(ctx, { enemies: [], effects: [
    { type: 'xuanguiShockTelegraph', x: 80, y: 90, radius: 52, life: 0.2, duration: 0.35 },
    { type: 'xuanguiShock', x: 80, y: 90, radius: 52, life: 0.4, duration: 0.58 },
  ] });
  assert.equal(ctx.calls.drawImage.some(args => /xuangui.*(?:projectile|shock)/i.test(args[0].id)), false);
  assert.ok(ctx.calls.arc.length >= 4, 'water core plus contraction and two shock rings must be drawn');
  assert.ok(ctx.calls.gradients >= 1, 'water-core projectile and mist accent use procedural gradients');
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

test('Level7 renders thunder landmarks, states, units, Jumang projectile, and Kui P2 emphasis', () => {
  const { renderer, ctx } = rendererFixture({ motionEnabled: false });
  const game = emptyGame(LEVELS[7]);
  game.visualTime = 0.25;
  game.illusions = [];
  game.thunder = { chargingZoneIds: ['A'], lastPulseZoneIds: ['B'] };
  game.effects = [
    { type: 'thunderCharge', zoneIds: ['A'], life: 0.5, duration: 0.9 },
    { type: 'thunderPulse', zoneIds: ['B'], life: 0.2, duration: 0.42 },
    { type: 'kuiPhase2', x: 150, y: 60, life: 0.5, duration: 0.8 },
    { type: 'jumangImpact', x: 220, y: 90, life: 0.2, duration: 0.3 },
  ];
  const map = { totalLength: 100, positionAt: () => ({ x: 40, y: 20 }), isWeakWater: () => false };
  game.enemies = [
    { type: 'qinyuan', id: 1, x: 50, y: 20, radius: 11, hp: 100, maxHp: 100, isBoss: false, visualHitFlash: 0, hitFlash: 0, statuses: { thunderSprint: { remaining: 1 } }, map, pathDistance: 40 },
    { type: 'zhuhuai', id: 2, x: 100, y: 40, radius: 18, hp: 390, maxHp: 390, isBoss: false, visualHitFlash: 0, hitFlash: 0, statuses: { thunderShell: { remaining: 1 } }, map, pathDistance: 30 },
    { type: 'kui', id: 3, bossPhase: 2, x: 150, y: 60, radius: 29, hp: 3500, maxHp: 7000, isBoss: true, visualHitFlash: 0, hitFlash: 0, statuses: {}, map, pathDistance: 20 },
  ];
  game.towers[0] = new Tower('jumang', TOWER_DATA.jumang, game.level.map.slots[0]);
  game.projectiles = [{ type: 'jumang', x: 195, y: 80, targetPoint: { x: 230, y: 100 } }];

  renderer.render(game);

  assert.equal(ctx.calls.drawImage[0][0].id, 'level7Background');
  assert.equal(ctx.calls.drawImage.filter(args => args[0].id === 'slotPlatform').length, 8);
  for (const id of ['qinyuan', 'zhuhuai', 'kui', 'jumang', 'jumangLeafblade']) {
    assert.equal(ctx.calls.drawImage.some(args => args[0].id === id), true, `${id} art was not drawn`);
  }
  for (const label of ['雷脈A・蓄能', '雷脈B・脈衝', '雷行', '雷殼', '雷怒']) {
    assert.equal(ctx.calls.fillText.some(args => args[0] === label), true, `${label} presentation was not drawn`);
  }
  assert.ok(ctx.calls.rotate.length >= 1, 'leafblade must rotate toward its target');
  assert.ok(ctx.calls.moveTo.some(([x, y]) => x === 195 && y === 80), 'leafblade must emit a short procedural trail');
  assert.ok(ctx.calls.arc.some(([x, y]) => x === 220 && y === 90), 'Jumang impact glow must be localized at impact');
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

test('Baize insight attack draws a visible beam plus impact mark without changing gameplay', () => {
  const { renderer, ctx } = rendererFixture();
  renderer.drawEffects(ctx, { effects: [{
    type: 'baizeInsight',
    from: { x: 40, y: 80 },
    to: { x: 150, y: 120 },
    life: 0.25,
    duration: 0.35,
  }] });

  assert.ok(ctx.calls.moveTo.some(([x, y]) => x === 40 && y === 80), 'Baize beam must start at the tower');
  assert.ok(ctx.calls.lineTo.some(([x, y]) => x === 150 && y === 120), 'Baize beam must reach the target');
  assert.equal(ctx.calls.drawImage.some(args => args[0].id === 'baizeInsightMark'), true, 'Baize impact mark must render on target');
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

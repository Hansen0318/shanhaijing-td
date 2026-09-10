import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const moduleUrl = new URL('../src/config/artAssets.js', import.meta.url);

test('art catalog exposes all 50 packaged assets and every file is deployable', async () => {
  assert.equal(existsSync(fileURLToPath(moduleUrl)), true, 'art asset catalog is missing');
  const { ART_ASSETS, assetUrl } = await import(moduleUrl);
  const entries = Object.entries(ART_ASSETS);

  assert.equal(entries.length, 50);
  assert.equal(new Set(entries.map(([, path]) => path)).size, 50);
  assert.equal(ART_ASSETS.background, 'assets/backgrounds/bg_kunlun_gate_v1.png');
  assert.equal(ART_ASSETS.qiongqiFrenzy, 'assets/bosses/boss_qiongqi_frenzy_v1.png');
  assert.equal(ART_ASSETS.level2Background, 'assets/levels/level2/bg_chishui_wasteland_v1.png');
  assert.equal(ART_ASSETS.chiyu, 'assets/enemies/enemy_chiyu_v1.png');
  assert.equal(ART_ASSETS.yanjia, 'assets/enemies/enemy_yanjia_v1.png');
  assert.equal(ART_ASSETS.paoxiao, 'assets/bosses/boss_paoxiao_v1.png');
  assert.equal(ART_ASSETS.level3Background, 'assets/levels/level3/bg_ruoshui_valley_v1.jpg');
  assert.equal(ART_ASSETS.shuixiao, 'assets/enemies/enemy_shuixiao_v1.png');
  assert.equal(ART_ASSETS.xuanjiashou, 'assets/enemies/enemy_xuanjiashou_v1.png');
  assert.equal(ART_ASSETS.xiangliu, 'assets/bosses/boss_xiangliu_v1.png');

  for (const [id, path] of entries) {
    const diskPath = fileURLToPath(new URL(`../../${path}`, moduleUrl));
    assert.equal(existsSync(diskPath), true, `${id} is missing at ${path}`);
    assert.match(assetUrl(id), new RegExp(`${path.replaceAll('/', '\\/')}$`));
  }
});

test('level-three optimized art is complete and small enough for reliable deployment', async () => {
  const { ART_ASSETS } = await import(moduleUrl);
  const transparentIds = [
    'level3Spawn', 'level3Base', 'shuixiao', 'xuanjiashou', 'xiangliu',
    'waterSplash', 'waterProjectile', 'waterRing', 'whirlpool', 'xiangliuBossPanel', 'baizeUnlock',
  ];
  for (const id of transparentIds) {
    const bytes = await readFile(fileURLToPath(new URL(`../../${ART_ASSETS[id]}`, moduleUrl)));
    assert.deepEqual([...bytes.subarray(0, 8)], [137, 80, 78, 71, 13, 10, 26, 10], `${id} must be a real PNG`);
    assert.equal(bytes.subarray(-8, -4).toString('ascii'), 'IEND', `${id} PNG is truncated`);
    assert.ok(bytes.length < 700_000, `${id} is too large for reliable deployment: ${bytes.length}`);
  }
  const background = await readFile(fileURLToPath(new URL(`../../${ART_ASSETS.level3Background}`, moduleUrl)));
  assert.deepEqual([...background.subarray(0, 2)], [255, 216]);
  assert.deepEqual([...background.subarray(-2)], [255, 217]);
  assert.ok(background.length < 700_000);
});

test('art store returns a drawable image only after that image has loaded', async () => {
  assert.equal(existsSync(fileURLToPath(moduleUrl)), true, 'art asset catalog is missing');
  const { ArtStore } = await import(moduleUrl);
  class FakeImage {
    constructor() { this.complete = false; this.naturalWidth = 0; }
  }
  const store = new ArtStore(FakeImage);
  assert.equal(store.get('bifang'), null);
  store.images.bifang.complete = true;
  store.images.bifang.naturalWidth = 1192;
  assert.equal(store.get('bifang'), store.images.bifang);
  assert.equal(store.get('unknown'), null);
});

test('art store reveals a level when required art settles, including failed assets', async () => {
  const { ArtStore } = await import(moduleUrl);
  class FakeImage {
    constructor() { this.complete = false; this.naturalWidth = 0; }
  }
  const store = new ArtStore(FakeImage);
  assert.equal(store.isReady(), false);
  for (const image of Object.values(store.images)) image.onerror();
  await Promise.resolve();
  assert.equal(store.isReady(), true, 'failed images count as settled so fallback can render');
});

test('art store blocks on immediate level art but defers boss and late-wave VFX', async () => {
  const { ArtStore, LEVEL_ART_IDS, LEVEL_REQUIRED_ART_IDS, LEVEL_DEFERRED_ART_IDS } = await import(moduleUrl);
  class FakeImage {
    constructor() { this.complete = false; this.naturalWidth = 100; }
  }
  const store = new ArtStore(FakeImage);
  assert.equal(store.images.level2Background, undefined);
  const ready = store.ensureLevel(2);
  assert.ok(store.images.level2Background);
  assert.ok(store.images.minion);
  assert.equal(store.images.paoxiao, undefined, 'level-two boss must not block the preparation screen');
  assert.equal(store.images.paoxiaoExplosion, undefined, 'late boss VFX must not block the preparation screen');
  for (const image of Object.values(store.images)) image.onload();
  await ready;
  assert.equal(store.isLevelReady(2), true);
  assert.ok(LEVEL_ART_IDS[2].includes('paoxiaoBossPanel'));
  assert.ok(LEVEL_REQUIRED_ART_IDS[2].includes('level2Background'));
  assert.equal(LEVEL_REQUIRED_ART_IDS[2].includes('paoxiao'), false);
  assert.ok(LEVEL_DEFERRED_ART_IDS[2].includes('paoxiao'));
  store.preloadDeferred(2);
  assert.ok(store.images.paoxiao);
  assert.ok(store.images.paoxiaoExplosion);

  const levelThreeReady = store.ensureLevel(3);
  assert.ok(store.images.level3Background);
  assert.ok(store.images.shuixiao);
  assert.equal(store.images.xiangliu, undefined, 'level-three boss must not block the preparation screen');
  for (const image of Object.values(store.images)) image.onload();
  await levelThreeReady;
  assert.equal(store.isLevelReady(3), true);
  assert.ok(LEVEL_DEFERRED_ART_IDS[3].includes('xiangliu'));
  assert.ok(LEVEL_DEFERRED_ART_IDS[3].includes('baizeUnlock'));
});

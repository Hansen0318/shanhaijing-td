import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const moduleUrl = new URL('../src/config/artAssets.js', import.meta.url);

test('art catalog exposes all 38 packaged assets and every file is deployable', async () => {
  assert.equal(existsSync(fileURLToPath(moduleUrl)), true, 'art asset catalog is missing');
  const { ART_ASSETS, assetUrl } = await import(moduleUrl);
  const entries = Object.entries(ART_ASSETS);

  assert.equal(entries.length, 38);
  assert.equal(new Set(entries.map(([, path]) => path)).size, 38);
  assert.equal(ART_ASSETS.background, 'assets/backgrounds/bg_kunlun_gate_v1.png');
  assert.equal(ART_ASSETS.qiongqiFrenzy, 'assets/bosses/boss_qiongqi_frenzy_v1.png');
  assert.equal(ART_ASSETS.level2Background, 'assets/levels/level2/bg_chishui_wasteland_v1.png');
  assert.equal(ART_ASSETS.chiyu, 'assets/enemies/enemy_chiyu_v1.png');
  assert.equal(ART_ASSETS.yanjia, 'assets/enemies/enemy_yanjia_v1.png');
  assert.equal(ART_ASSETS.paoxiao, 'assets/bosses/boss_paoxiao_v1.png');

  for (const [id, path] of entries) {
    const diskPath = fileURLToPath(new URL(`../../${path}`, moduleUrl));
    assert.equal(existsSync(diskPath), true, `${id} is missing at ${path}`);
    assert.match(assetUrl(id), new RegExp(`${path.replaceAll('/', '\\/')}$`));
  }
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

test('art store waits until every packaged image has settled before revealing the game', async () => {
  const { ArtStore } = await import(moduleUrl);
  class FakeImage {
    constructor() { this.complete = false; this.naturalWidth = 0; }
  }
  const store = new ArtStore(FakeImage);
  assert.equal(store.isReady(), false);
  for (const image of Object.values(store.images)) image.complete = true;
  assert.equal(store.isReady(), true, 'failed images count as settled so fallback can render');
});

test('art store loads second-level assets only when that level is requested', async () => {
  const { ArtStore, LEVEL_ART_IDS } = await import(moduleUrl);
  class FakeImage {
    constructor() { this.complete = true; this.naturalWidth = 100; }
  }
  const store = new ArtStore(FakeImage);
  assert.equal(store.images.level2Background, undefined);
  await store.ensureLevel(2);
  assert.ok(store.images.level2Background);
  assert.equal(store.isLevelReady(2), true);
  assert.ok(LEVEL_ART_IDS[2].includes('paoxiaoBossPanel'));
});

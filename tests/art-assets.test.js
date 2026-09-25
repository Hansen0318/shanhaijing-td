import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const moduleUrl = new URL('../src/config/artAssets.js', import.meta.url);

function pngDimensions(bytes) {
  assert.deepEqual([...bytes.subarray(0, 8)], [137, 80, 78, 71, 13, 10, 26, 10]);
  return { width: bytes.readUInt32BE(16), height: bytes.readUInt32BE(20) };
}

function assertCompletePngWithAlpha(bytes, id) {
  pngDimensions(bytes);
  assert.equal(bytes.subarray(-8, -4).toString('ascii'), 'IEND', `${id} PNG is truncated`);
  const colorType = bytes[25];
  const hasAlpha = colorType === 4 || colorType === 6 || bytes.indexOf(Buffer.from('tRNS')) >= 0;
  assert.equal(hasAlpha, true, `${id} must retain alpha transparency`);
}

test('art catalog exposes all 115 asset IDs and every file is deployable', async () => {
  assert.equal(existsSync(fileURLToPath(moduleUrl)), true, 'art asset catalog is missing');
  const { ART_ASSETS, assetUrl } = await import(moduleUrl);
  const entries = Object.entries(ART_ASSETS);

  assert.equal(entries.length, 115);
  assert.equal(new Set(entries.map(([, path]) => path)).size, 113, 'Jumang and Xuangui unlock/body pairs may share their approved paths');
  assert.equal(ART_ASSETS.background, 'assets/backgrounds/bg_kunlun_gate_v1.jpg');
  assert.equal(ART_ASSETS.qiongqiFrenzy, 'assets/bosses/boss_qiongqi_frenzy_v1.png');
  assert.equal(ART_ASSETS.level2Background, 'assets/levels/level2/bg_chishui_wasteland_v1.jpg');
  assert.equal(ART_ASSETS.chiyu, 'assets/enemies/enemy_chiyu_v1.png');
  assert.equal(ART_ASSETS.yanjia, 'assets/enemies/enemy_yanjia_v1.png');
  assert.equal(ART_ASSETS.paoxiao, 'assets/bosses/boss_paoxiao_v1.png');
  assert.equal(ART_ASSETS.level3Background, 'assets/levels/level3/bg_ruoshui_valley_v1.jpg');
  assert.equal(ART_ASSETS.shuixiao, 'assets/enemies/enemy_shuixiao_v1.png');
  assert.equal(ART_ASSETS.xuanjiashou, 'assets/enemies/enemy_xuanjiashou_v1.png');
  assert.equal(ART_ASSETS.xiangliu, 'assets/bosses/boss_xiangliu_v1.png');
  assert.equal(ART_ASSETS.level4Background, 'assets/levels/level4/bg_qingqiu_realm_v1.jpg');
  assert.equal(ART_ASSETS.baize, 'assets/towers/tower_baize_v1.png');
  assert.equal(ART_ASSETS.jiuweihuPhase3, 'assets/bosses/boss_jiuweihu_phase3_v1.png');
  assert.equal(ART_ASSETS.bossPanel, 'assets/ui/ui_boss_qiongqi_panel_v2.png');
  assert.equal(ART_ASSETS.paoxiaoBossPanel, 'assets/ui/ui_boss_paoxiao_panel_v2.png');
  assert.equal(ART_ASSETS.xiangliuBossPanel, 'assets/ui/ui_boss_xiangliu_panel_v2.png');
  assert.equal(ART_ASSETS.jiuweihuBossPanel, 'assets/ui/ui_boss_jiuweihu_panel_v2.png');
  assert.equal(ART_ASSETS.xingtianBossPanel, 'assets/ui/ui_boss_xingtian_panel_v1.png');
  assert.equal(ART_ASSETS.level6Background, 'assets/levels/level6/bg_fusang_realm_v1.jpg');
  assert.equal(ART_ASSETS.yangyu, 'assets/enemies/enemy_yangyu_v1.png');
  assert.equal(ART_ASSETS.fusangjiashou, 'assets/enemies/enemy_fusangjiashou_v1.png');
  assert.equal(ART_ASSETS.jinwu, 'assets/bosses/boss_jinwu_v1.png');
  assert.equal(ART_ASSETS.jinwuBossPanel, 'assets/ui/ui_boss_jinwu_panel_v1.png');
  assert.equal(ART_ASSETS.jumangUnlock, 'assets/ui/unlock_jumang_v1.png');
  assert.equal(ART_ASSETS.level7Background, 'assets/levels/level7/bg_leize_tianye_v1.jpg');
  assert.equal(ART_ASSETS.qinyuan, 'assets/enemies/enemy_qinyuan_v1.png');
  assert.equal(ART_ASSETS.zhuhuai, 'assets/enemies/enemy_zhuhuai_v1.png');
  assert.equal(ART_ASSETS.kui, 'assets/bosses/boss_kui_v1.png');
  assert.equal(ART_ASSETS.kuiBossPanel, 'assets/ui/ui_boss_kui_panel_v1.png');
  assert.equal(ART_ASSETS.jumangLeafblade, 'assets/effects/fx_jumang_leafblade_v1.png');
  assert.equal(ART_ASSETS.jumang, ART_ASSETS.jumangUnlock, 'deployed Jumang reuses the approved unlock visual');
  assert.equal(ART_ASSETS.level8Background, 'assets/levels/level8/bg_level8_youming_marsh_v1.jpg');
  assert.equal(ART_ASSETS.changyou, 'assets/enemies/enemy_changyou_v1.png');
  assert.equal(ART_ASSETS.gudiao, 'assets/enemies/enemy_gudiao_v1.png');
  assert.equal(ART_ASSETS.huashe, 'assets/bosses/boss_huashe_v1.png');
  assert.equal(ART_ASSETS.huasheBossPanel, 'assets/ui/ui_boss_huashe_panel_v1.png');
  assert.equal(ART_ASSETS.xuangui, 'assets/towers/tower_xuangui_v1.png');
  assert.equal(ART_ASSETS.xuangui, ART_ASSETS.xuanguiUnlock, 'Xuangui unlock reuses the approved tower visual');

  for (const [id, path] of entries) {
    const diskPath = fileURLToPath(new URL(`../../${path}`, moduleUrl));
    assert.equal(existsSync(diskPath), true, `${id} is missing at ${path}`);
    assert.match(assetUrl(id), new RegExp(`${path.replaceAll('/', '\\/')}\\?v=level9-1$`));
  }
});

test('level-eight runtime candidates are exact, alpha-safe, mobile-sized, and staged', async () => {
  const { ART_ASSETS, LEVEL_REQUIRED_ART_IDS, LEVEL_DEFERRED_ART_IDS } = await import(moduleUrl);
  const alphaBudgets = {
    changyou: [256, 228, 150_000], gudiao: [256, 244, 150_000], huashe: [512, 501, 400_000],
    xuangui: [256, 216, 150_000], huasheBossPanel: [768, 183, 250_000],
  };
  for (const [id, [width, height, maxBytes]] of Object.entries(alphaBudgets)) {
    const bytes = await readFile(fileURLToPath(new URL(`../../${ART_ASSETS[id]}`, moduleUrl)));
    assertCompletePngWithAlpha(bytes, id);
    assert.deepEqual(pngDimensions(bytes), { width, height });
    assert.ok(bytes.length < maxBytes, `${id} exceeds ${maxBytes} bytes`);
  }
  const background = await readFile(fileURLToPath(new URL(`../../${ART_ASSETS.level8Background}`, moduleUrl)));
  assert.deepEqual([...background.subarray(0, 2)], [255, 216]);
  assert.deepEqual([...background.subarray(-2)], [255, 217]);
  assert.ok(background.length < 500_000);

  for (const id of ['slotPlatform', 'level8Background', 'bifang', 'fuzhu', 'yinglong', 'baize', 'jumang', 'changyou']) {
    assert.equal(LEVEL_REQUIRED_ART_IDS[8].includes(id), true, `${id} must be ready for Level8 first paint`);
  }
  for (const id of ['gudiao', 'huashe', 'huasheBossPanel', 'xuangui', 'xuanguiUnlock']) {
    assert.equal(LEVEL_DEFERRED_ART_IDS[8].includes(id), true, `${id} must remain deferred`);
  }
});

test('level-nine audited art is staged for first paint and deferred combat use', async () => {
  const { ART_ASSETS, LEVEL_REQUIRED_ART_IDS, LEVEL_DEFERRED_ART_IDS } = await import(moduleUrl);
  assert.equal(ART_ASSETS.level9Background, 'assets/levels/level9/bg_zhongshan_extreme_night_v1.jpg');
  for (const id of ['tiangou', 'zheng', 'zhulong', 'zhulongBossPanel', 'dijiangUnlock']) {
    const bytes = await readFile(fileURLToPath(new URL(`../../${ART_ASSETS[id]}`, moduleUrl)));
    assertCompletePngWithAlpha(bytes, id);
  }
  for (const id of ['slotPlatform', 'level9Background', 'bifang', 'fuzhu', 'yinglong', 'baize', 'jumang', 'xuangui', 'tiangou']) {
    assert.equal(LEVEL_REQUIRED_ART_IDS[9].includes(id), true, `${id} must be ready for Level9 first paint`);
  }
  for (const id of ['zheng', 'zhulong', 'zhulongBossPanel', 'dijiangUnlock']) {
    assert.equal(LEVEL_DEFERRED_ART_IDS[9].includes(id), true, `${id} must remain deferred`);
  }
});

test('level-seven runtime art is alpha-safe, mobile-sized, and staged', async () => {
  const { ART_ASSETS, LEVEL_REQUIRED_ART_IDS, LEVEL_DEFERRED_ART_IDS } = await import(moduleUrl);
  const alphaBudgets = {
    qinyuan: [256, 256, 300_000], zhuhuai: [320, 225, 300_000], kui: [384, 293, 500_000],
    kuiBossPanel: [1152, 351, 500_000], jumangLeafblade: [160, 83, 300_000],
  };
  for (const [id, [width, height, maxBytes]] of Object.entries(alphaBudgets)) {
    const bytes = await readFile(fileURLToPath(new URL(`../../${ART_ASSETS[id]}`, moduleUrl)));
    assertCompletePngWithAlpha(bytes, id);
    assert.deepEqual(pngDimensions(bytes), { width, height });
    assert.ok(bytes.length < maxBytes, `${id} exceeds ${maxBytes} bytes`);
  }
  const background = await readFile(fileURLToPath(new URL(`../../${ART_ASSETS.level7Background}`, moduleUrl)));
  assert.deepEqual([...background.subarray(0, 2)], [255, 216]);
  assert.deepEqual([...background.subarray(-2)], [255, 217]);
  assert.ok(background.length < 800_000);

  for (const id of ['slotPlatform', 'level7Background', 'bifang', 'fuzhu', 'yinglong', 'baize', 'jumang', 'qinyuan']) {
    assert.equal(LEVEL_REQUIRED_ART_IDS[7].includes(id), true, `${id} must be ready for Level7 first paint`);
  }
  for (const id of ['zhuhuai', 'kui', 'kuiBossPanel', 'jumangLeafblade']) {
    assert.equal(LEVEL_DEFERRED_ART_IDS[7].includes(id), true, `${id} must remain deferred`);
  }
});

test('level-six runtime art is complete, alpha-safe, mobile-sized, and staged', async () => {
  const { ART_ASSETS, LEVEL_REQUIRED_ART_IDS, LEVEL_DEFERRED_ART_IDS } = await import(moduleUrl);
  const alphaBudgets = {
    yangyu: [256, 249, 300_000], fusangjiashou: [256, 229, 300_000], jinwu: [384, 384, 500_000],
    yangyuSunboost: [192, 88, 300_000], yangmuArmorOn: [256, 247, 300_000],
    yangmuArmorBreak: [229, 256, 300_000], jinwuSunshield: [256, 256, 300_000],
    jinwuPhase2: [384, 384, 300_000], sunlightZone: [384, 73, 300_000],
    jinwuBossPanel: [768, 256, 500_000], jumangUnlock: [307, 384, 300_000],
  };
  for (const [id, [width, height, maxBytes]] of Object.entries(alphaBudgets)) {
    const bytes = await readFile(fileURLToPath(new URL(`../../${ART_ASSETS[id]}`, moduleUrl)));
    assertCompletePngWithAlpha(bytes, id);
    assert.deepEqual(pngDimensions(bytes), { width, height });
    assert.ok(bytes.length < maxBytes, `${id} exceeds ${maxBytes} bytes`);
  }
  const background = await readFile(fileURLToPath(new URL(`../../${ART_ASSETS.level6Background}`, moduleUrl)));
  assert.deepEqual([...background.subarray(0, 2)], [255, 216]);
  assert.deepEqual([...background.subarray(-2)], [255, 217]);
  assert.ok(background.length < 800_000);

  for (const id of ['slotPlatform', 'level6Background', 'bifang', 'fuzhu', 'yinglong', 'baize', 'yangyu', 'sunlightZone']) {
    assert.equal(LEVEL_REQUIRED_ART_IDS[6].includes(id), true, `${id} must be ready for Level6 first paint`);
  }
  for (const id of ['fusangjiashou', 'jinwu', 'yangyuSunboost', 'yangmuArmorOn', 'yangmuArmorBreak', 'jinwuSunshield', 'jinwuPhase2', 'jinwuBossPanel', 'jumangUnlock']) {
    assert.equal(LEVEL_DEFERRED_ART_IDS[6].includes(id), true, `${id} must remain deferred`);
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

test('level-four runtime art is complete, transparent where required, and mobile-sized', async () => {
  const alphaBudgets = {
    'assets/levels/level4/map_spawn_mist_rift_v1.png': 300_000,
    'assets/levels/level4/map_base_qingqiu_altar_v1.png': 300_000,
    'assets/towers/tower_baize_v1.png': 300_000,
    'assets/enemies/enemy_meihu_v1.png': 300_000,
    'assets/enemies/enemy_huanli_v1.png': 300_000,
    'assets/bosses/boss_jiuweihu_phase1_v1.png': 500_000,
    'assets/bosses/boss_jiuweihu_phase2_v1.png': 500_000,
    'assets/bosses/boss_jiuweihu_phase3_v1.png': 500_000,
    'assets/bosses/boss_jiuweihu_cast_v1.png': 500_000,
    'assets/effects/fx_jiuweihu_projectile_v1.png': 300_000,
    'assets/effects/fx_jiuweihu_burst_v1.png': 300_000,
    'assets/effects/fx_jiuweihu_phase_aura_v1.png': 300_000,
    'assets/effects/fx_jiuweihu_ultimate_v1.png': 300_000,
    'assets/effects/fx_baize_insight_mark_v1.png': 300_000,
    'assets/ui/ui_boss_jiuweihu_panel_v2.png': 500_000,
    'assets/ui/ui_level4_lineup_panel_v1.png': 500_000,
  };
  for (const [path, maxBytes] of Object.entries(alphaBudgets)) {
    const bytes = await readFile(new URL(`../${path}`, import.meta.url));
    assertCompletePngWithAlpha(bytes, path);
    assert.ok(bytes.length < maxBytes, `${path} exceeds ${maxBytes} bytes`);
  }
  const background = await readFile(new URL('../assets/levels/level4/bg_qingqiu_realm_v1.jpg', import.meta.url));
  assert.deepEqual([...background.subarray(0, 2)], [255, 216]);
  assert.deepEqual([...background.subarray(-2)], [255, 217]);
  assert.ok(background.length < 800_000);
});

test('level-five runtime art includes all sixteen optimized source derivatives', async () => {
  const alphaBudgets = {
    'assets/levels/level5/map_spawn_lava_portal_v1.png': [256, 256, 300_000],
    'assets/levels/level5/map_base_tianzhu_core_v1.png': [256, 256, 300_000],
    'assets/enemies/enemy_zhuyan_v1.png': [256, 256, 300_000],
    'assets/enemies/enemy_lili_v1.png': [256, 256, 300_000],
    'assets/bosses/boss_xingtian_phase1_v1.png': [384, 384, 500_000],
    'assets/bosses/boss_xingtian_phase2_v1.png': [384, 384, 500_000],
    'assets/effects/fx_zhuyan_charge_v1.png': [384, 384, 300_000],
    'assets/effects/fx_lili_armor_break_v1.png': [384, 384, 300_000],
    'assets/effects/fx_xingtian_shield_v1.png': [384, 384, 300_000],
    'assets/effects/fx_xingtian_evolution_v1.png': [384, 384, 300_000],
    'assets/effects/fx_xingtian_earthquake_v1.png': [384, 384, 300_000],
    'assets/ui/ui_boss_xingtian_panel_v1.png': [768, 256, 500_000],
    'assets/ui/ui_level5_banner_v1.png': [768, 256, 500_000],
    'assets/ui/ui_level5_boss_warning_v1.png': [768, 256, 500_000],
  };
  for (const [path, [maxWidth, maxHeight, maxBytes]] of Object.entries(alphaBudgets)) {
    const bytes = await readFile(new URL(`../${path}`, import.meta.url));
    assertCompletePngWithAlpha(bytes, path);
    const { width, height } = pngDimensions(bytes);
    assert.ok(width <= maxWidth && height <= maxHeight, `${path} is ${width}x${height}`);
    assert.ok(bytes.length < maxBytes, `${path} exceeds ${maxBytes} bytes`);
  }

  for (const [path, dimensions, maxBytes] of [
    ['assets/levels/level5/bg_buzhoushan_ruins_v1.jpg', { width: 390, height: 610 }, 800_000],
    ['assets/ui/ui_level5_preview_v1.jpg', { width: 384, height: 512 }, 500_000],
  ]) {
    const bytes = await readFile(new URL(`../${path}`, import.meta.url));
    assert.deepEqual([...bytes.subarray(0, 2)], [255, 216], `${path} must be JPEG`);
    assert.deepEqual([...bytes.subarray(-2)], [255, 217], `${path} is truncated`);
    assert.ok(bytes.length < maxBytes, `${path} exceeds ${maxBytes} bytes`);
    const identify = await import('node:child_process').then(({ execFileSync }) => execFileSync('identify', ['-format', '%wx%h', fileURLToPath(new URL(`../${path}`, import.meta.url))], { encoding: 'utf8' }));
    assert.equal(identify, `${dimensions.width}x${dimensions.height}`);
  }
});

test('level-five art catalog stages first-paint assets and defers Boss combat art', async () => {
  const { ART_ASSETS, LEVEL_REQUIRED_ART_IDS, LEVEL_DEFERRED_ART_IDS } = await import(moduleUrl);
  assert.deepEqual(
    Object.fromEntries([
      'level5Background', 'level5Spawn', 'level5Base', 'zhuyan', 'lili',
      'xingtianPhase1', 'xingtianPhase2', 'zhuyanCharge', 'liliArmorBreak',
      'xingtianShield', 'xingtianEvolution', 'xingtianEarthquake',
      'xingtianBossPanel', 'level5Banner', 'level5BossWarning', 'level5Preview',
    ].map(id => [id, ART_ASSETS[id]])),
    {
      level5Background: 'assets/levels/level5/bg_buzhoushan_ruins_v1.jpg',
      level5Spawn: 'assets/levels/level5/map_spawn_lava_portal_v1.png',
      level5Base: 'assets/levels/level5/map_base_tianzhu_core_v1.png',
      zhuyan: 'assets/enemies/enemy_zhuyan_v1.png',
      lili: 'assets/enemies/enemy_lili_v1.png',
      xingtianPhase1: 'assets/bosses/boss_xingtian_phase1_v1.png',
      xingtianPhase2: 'assets/bosses/boss_xingtian_phase2_v1.png',
      zhuyanCharge: 'assets/effects/fx_zhuyan_charge_v1.png',
      liliArmorBreak: 'assets/effects/fx_lili_armor_break_v1.png',
      xingtianShield: 'assets/effects/fx_xingtian_shield_v1.png',
      xingtianEvolution: 'assets/effects/fx_xingtian_evolution_v1.png',
      xingtianEarthquake: 'assets/effects/fx_xingtian_earthquake_v1.png',
      xingtianBossPanel: 'assets/ui/ui_boss_xingtian_panel_v1.png',
      level5Banner: 'assets/ui/ui_level5_banner_v1.png',
      level5BossWarning: 'assets/ui/ui_level5_boss_warning_v1.png',
      level5Preview: 'assets/ui/ui_level5_preview_v1.jpg',
    },
  );
  for (const id of ['level5Background', 'level5Spawn', 'level5Base', 'bifang', 'fuzhu', 'yinglong', 'baize', 'zhuyan', 'level5Banner', 'level5Preview']) {
    assert.equal(LEVEL_REQUIRED_ART_IDS[5].includes(id), true, `${id} must be ready for Level5 first paint`);
  }
  for (const id of ['lili', 'xingtianPhase1', 'xingtianPhase2', 'xingtianBossPanel', 'level5BossWarning', 'zhuyanCharge', 'liliArmorBreak', 'xingtianShield', 'xingtianEvolution', 'xingtianEarthquake']) {
    assert.equal(LEVEL_DEFERRED_ART_IDS[5].includes(id), true, `${id} must remain deferred`);
  }
});

test('all seven standard Boss HUD panels plus the approved fixed-footprint Huashe panel are optimized', async () => {
  const { ART_ASSETS } = await import(moduleUrl);
  for (const id of ['bossPanel', 'paoxiaoBossPanel', 'xiangliuBossPanel', 'jiuweihuBossPanel', 'xingtianBossPanel', 'jinwuBossPanel']) {
    const bytes = await readFile(fileURLToPath(new URL(`../../${ART_ASSETS[id]}`, moduleUrl)));
    assertCompletePngWithAlpha(bytes, id);
    assert.deepEqual(pngDimensions(bytes), { width: 768, height: 256 }, `${id} must match the optimized HUD runtime size`);
    assert.ok(bytes.length < 500_000, `${id} is ${bytes.length} bytes; expected under 500000`);
  }
  const huashe = await readFile(fileURLToPath(new URL(`../../${ART_ASSETS.huasheBossPanel}`, moduleUrl)));
  assertCompletePngWithAlpha(huashe, 'huasheBossPanel');
  assert.deepEqual(pngDimensions(huashe), { width: 768, height: 183 });
  assert.ok(huashe.length < 250_000);
});

test('mobile-rendered level-one and level-two art stays within source-pixel and transfer budgets', async () => {
  const { ART_ASSETS } = await import(moduleUrl);
  const budgets = {
    bifang: [512, 512, 300_000], fuzhu: [512, 512, 300_000], yinglong: [512, 512, 300_000],
    minion: [512, 512, 300_000], swift: [512, 512, 300_000], giant: [512, 512, 300_000],
    chiyu: [512, 512, 300_000], yanjia: [512, 512, 300_000],
    qiongqi: [512, 512, 500_000], qiongqiFrenzy: [512, 512, 500_000], paoxiao: [512, 512, 500_000],
    bifangFireball: [512, 512, 300_000], bifangExplosion: [512, 512, 300_000],
    fuzhuFrostshot: [512, 512, 300_000], slowMark: [512, 512, 300_000], yinglongBeam: [512, 512, 300_000],
    paoxiaoProjectile: [512, 512, 300_000], paoxiaoExplosion: [512, 512, 300_000],
    paoxiaoEnrage: [512, 512, 300_000], paoxiaoGroundslam: [512, 512, 300_000],
    slotPlatform: [512, 512, 300_000], spawnRift: [512, 512, 300_000], baseSeal: [512, 512, 300_000],
    level2Spawn: [512, 512, 300_000], level2Base: [512, 512, 300_000],
  };

  for (const [id, [maxWidth, maxHeight, maxBytes]] of Object.entries(budgets)) {
    const bytes = await readFile(fileURLToPath(new URL(`../../${ART_ASSETS[id]}`, moduleUrl)));
    assertCompletePngWithAlpha(bytes, id);
    const { width, height } = pngDimensions(bytes);
    assert.ok(width <= maxWidth && height <= maxHeight, `${id} source is ${width}x${height}; expected at most ${maxWidth}x${maxHeight}`);
    assert.ok(bytes.length < maxBytes, `${id} is ${bytes.length} bytes; expected under ${maxBytes}`);
  }

  for (const id of ['background', 'level2Background']) {
    const bytes = await readFile(fileURLToPath(new URL(`../../${ART_ASSETS[id]}`, moduleUrl)));
    assert.deepEqual([...bytes.subarray(0, 2)], [255, 216], `${id} must be a JPEG`);
    assert.deepEqual([...bytes.subarray(-2)], [255, 217], `${id} JPEG is truncated`);
    assert.ok(bytes.length < 800_000, `${id} is ${bytes.length} bytes; expected under 800000`);
  }

  for (const id of ['resourcePanel', 'hudButton', 'bossPanel', 'buildCard', 'blessingCard', 'victoryOverlay', 'defeatOverlay', 'paoxiaoBossPanel']) {
    const bytes = await readFile(fileURLToPath(new URL(`../../${ART_ASSETS[id]}`, moduleUrl)));
    assertCompletePngWithAlpha(bytes, id);
    assert.ok(bytes.length < 500_000, `${id} is ${bytes.length} bytes; expected under 500000`);
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
  store.images.bifang = new FakeImage();
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

test('UI frame preload is staged so first paint is complete without blocking later overlays', async () => {
  const { ArtStore, LEVEL_ART_IDS, LEVEL_REQUIRED_ART_IDS, LEVEL_DEFERRED_ART_IDS } = await import(moduleUrl);
  const shellUi = ['resourcePanel', 'hudButton', 'wavePreviewPanel', 'contextPanel', 'actionButton'];
  const laterUi = ['buildCard', 'blessingCard', 'victoryOverlay', 'defeatOverlay'];

  for (const levelId of [1, 2, 3]) {
    for (const id of shellUi) assert.ok(LEVEL_REQUIRED_ART_IDS[levelId].includes(id), `${id} must be ready with first paint`);
    for (const id of ['bifang', 'fuzhu', 'yinglong']) assert.ok(LEVEL_REQUIRED_ART_IDS[levelId].includes(id), `${id} must be ready before the first build menu can open`);
    for (const id of laterUi) assert.ok(LEVEL_DEFERRED_ART_IDS[levelId].includes(id), `${id} should load after first paint`);
  }
  assert.ok(LEVEL_DEFERRED_ART_IDS[1].includes('bossPanel'));
  assert.ok(LEVEL_DEFERRED_ART_IDS[2].includes('paoxiaoBossPanel'));
  assert.ok(LEVEL_DEFERRED_ART_IDS[3].includes('xiangliuBossPanel'));
  assert.deepEqual(
    LEVEL_REQUIRED_ART_IDS[4].filter(id => ['bifang', 'fuzhu', 'yinglong', 'baize'].includes(id)),
    ['bifang', 'fuzhu', 'yinglong', 'baize'],
  );
  for (const id of ['jiuweihuPhase1', 'jiuweihuPhase2', 'jiuweihuPhase3', 'jiuweihuCast', 'jiuweihuUltimate']) {
    assert.equal(LEVEL_REQUIRED_ART_IDS[4].includes(id), false, `${id} must remain deferred`);
    assert.equal(LEVEL_DEFERRED_ART_IDS[4].includes(id), true, `${id} must be deferred`);
  }

  for (const id of ['bifangFireball', 'bifangExplosion', 'fuzhuFrostshot', 'slowMark', 'yinglongBeam']) {
    assert.equal(LEVEL_REQUIRED_ART_IDS[1].includes(id), false, `${id} must remain deferred`);
  }
  for (const id of [...shellUi, ...laterUi, 'bossPanel', 'paoxiaoBossPanel', 'xiangliuBossPanel']) {
    assert.ok(LEVEL_ART_IDS[1].includes(id) || LEVEL_ART_IDS[2].includes(id) || LEVEL_ART_IDS[3].includes(id), `${id} must participate in staged preload`);
  }

  class FakeImage {
    constructor() { this.complete = false; this.naturalWidth = 100; }
  }
  const directLevelThree = new ArtStore(FakeImage, 3);
  assert.ok(directLevelThree.images.level3Background);
  assert.ok(directLevelThree.images.shuixiao);
  assert.ok(directLevelThree.images.resourcePanel);
  assert.equal(directLevelThree.images.background, undefined, 'direct Level3 must not begin Level1 unique preload');
  assert.equal(directLevelThree.images.xiangliu, undefined, 'boss remains deferred');
  assert.equal(directLevelThree.images.xiangliuBossPanel, undefined, 'boss frame remains deferred');
  for (const image of Object.values(directLevelThree.images)) image.onload();
  await Promise.resolve();
  assert.equal(directLevelThree.isReady(), true);
});

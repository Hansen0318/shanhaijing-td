import test from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import * as GameData from '../src/config/gameData.js';
import { ART_ASSETS } from '../src/config/artAssets.js';
import { ENEMY_VISUALS, minimumEnemyPathSpacing } from '../src/config/enemyVisuals.js';
import { UNIT_MOTION_CONFIG } from '../src/config/motionData.js';
import { Game } from '../src/core/Game.js';
import { CombatSystem } from '../src/systems/CombatSystem.js';
import { BossSystem } from '../src/systems/BossSystem.js';
import { DayNightSystem } from '../src/systems/DayNightSystem.js';
import { WaveManager } from '../src/systems/WaveManager.js';
import { setupLevelNineDev } from '../src/dev/LevelNineDev.js';

const expectedWaypoints = [
  { x: 39, y: 68 }, { x: 45, y: 77 }, { x: 50, y: 89 }, { x: 64, y: 101 },
  { x: 77, y: 113 }, { x: 101, y: 125 }, { x: 166, y: 137 }, { x: 228, y: 149 },
  { x: 261, y: 161 }, { x: 284, y: 173 }, { x: 298, y: 185 }, { x: 314, y: 197 },
  { x: 323, y: 208 }, { x: 329, y: 220 }, { x: 336, y: 232 }, { x: 340, y: 244 },
  { x: 343, y: 256 }, { x: 344, y: 268 }, { x: 344, y: 280 }, { x: 342, y: 292 },
  { x: 340, y: 304 }, { x: 335, y: 316 }, { x: 329, y: 328 }, { x: 318, y: 340 },
  { x: 309, y: 351 }, { x: 287, y: 363 }, { x: 252, y: 375 }, { x: 171, y: 387 },
  { x: 120, y: 399 }, { x: 117, y: 411 }, { x: 123, y: 423 }, { x: 143, y: 435 },
  { x: 175, y: 447 }, { x: 214, y: 459 }, { x: 247, y: 471 }, { x: 264, y: 483 },
  { x: 285, y: 494 }, { x: 309, y: 506 }, { x: 327, y: 518 }, { x: 343, y: 516 },
];

test('Level9 uses the frozen 鐘山極夜 identity and registered geometry', () => {
  const level = GameData.LEVELS[9];
  assert.ok(level, 'Level9 must be playable');
  assert.equal(level.name, '鐘山極夜');
  assert.equal(level.baseName, '鐘山天門');
  assert.equal(level.bossType, 'zhulong');
  assert.equal(level.bossVictoryRequiresWaveClear, true);
  assert.equal(level.art.background, 'level9Background');
  assert.deepEqual(level.art.backgroundCrop, { x: 0, y: 0, width: 780, height: 1220 });
  assert.deepEqual(GameData.LEVEL9_MAP_DATA.waypoints, expectedWaypoints);
  assert.deepEqual(GameData.LEVEL9_MAP_DATA.slots, [
    { x: 125, y: 106 }, { x: 264, y: 142 }, { x: 292, y: 233 }, { x: 352, y: 333 },
    { x: 216, y: 324 }, { x: 106, y: 250 }, { x: 88, y: 374 }, { x: 288, y: 461 },
  ]);
  assert.deepEqual(GameData.LEVEL9_MAP_DATA.celestialAnchor, { x: 203, y: 251 });
});

test('Level9 runtime interpolation preserves every frozen anchor and removes phone-visible hairpin kinks', () => {
  const game = new Game(() => 0.2, 9);
  for (const anchor of expectedWaypoints) {
    assert.equal(game.map.waypoints.some(point => point.x === anchor.x && point.y === anchor.y), true,
      `runtime path dropped frozen anchor ${anchor.x},${anchor.y}`);
  }
  let maximumTurn = 0;
  for (let index = 1; index < game.map.waypoints.length - 1; index += 1) {
    const previous = game.map.waypoints[index - 1];
    const point = game.map.waypoints[index];
    const next = game.map.waypoints[index + 1];
    const incoming = Math.atan2(point.y - previous.y, point.x - previous.x);
    const outgoing = Math.atan2(next.y - point.y, next.x - point.x);
    let turn = Math.abs(outgoing - incoming);
    if (turn > Math.PI) turn = Math.PI * 2 - turn;
    maximumTurn = Math.max(maximumTurn, turn);
  }
  assert.ok(maximumTurn * 180 / Math.PI <= 20,
    `runtime path contains a ${Math.round(maximumTurn * 180 / Math.PI)}° phone-visible kink`);
});

test('Level9 frozen waves and enemies preserve Boss-first W10', () => {
  assert.deepEqual(GameData.LEVEL9_WAVE_DATA, [
    { groups: [{ type: 'tiangou', count: 6 }], interval: 1.1 },
    { groups: [{ type: 'tiangou', count: 8 }], interval: 1 },
    { groups: [{ type: 'tiangou', count: 6 }, { type: 'zheng', count: 2 }], interval: 1 },
    { groups: [{ type: 'zheng', count: 4 }], interval: 1.05 },
    { groups: [{ type: 'tiangou', count: 10 }, { type: 'zheng', count: 3 }], interval: 0.9, hpMultiplier: 1.06 },
    { groups: [{ type: 'tiangou', count: 14 }, { type: 'zheng', count: 4 }], interval: 0.78, hpMultiplier: 1.12 },
    { groups: [{ type: 'tiangou', count: 10 }, { type: 'zheng', count: 6 }], interval: 0.82, hpMultiplier: 1.18 },
    { groups: [{ type: 'tiangou', count: 16 }, { type: 'zheng', count: 6 }], interval: 0.7, hpMultiplier: 1.26 },
    { groups: [{ type: 'tiangou', count: 18 }, { type: 'zheng', count: 8 }], interval: 0.64, hpMultiplier: 1.34 },
    { groups: [{ type: 'zhulong', count: 1 }, { type: 'tiangou', count: 8 }, { type: 'zheng', count: 4 }], interval: 0.84, hpMultiplier: 1.2, bossHpMultiplier: 1.1 },
  ]);
  assert.deepEqual(GameData.ENEMY_DATA.tiangou, { id: 'tiangou', name: '天狗', emoji: '🐕', hp: 120, speed: 90, baseDamage: 1, reward: 16, radius: 12, daylightSpeedMultiplier: 1.2 });
  assert.deepEqual(GameData.ENEMY_DATA.zheng, { id: 'zheng', name: '猙', emoji: '🐆', hp: 450, speed: 24, baseDamage: 3, reward: 34, radius: 18, nightNormalDamageMultiplier: 0.82 });
  assert.deepEqual(GameData.ENEMY_DATA.zhulong, { id: 'zhulong', name: '燭龍', emoji: '🐉', hp: 8200, speed: 15, baseDamage: 20, reward: 0, radius: 30, isBoss: true, bossMechanic: { type: 'zhulong', phase2Threshold: 0.5, phase2SpeedMultiplier: 1.12, phase1SwitchInterval: 6, phase2SwitchInterval: 4.5, telegraphDuration: 0.8 } });

  const manager = new WaveManager(GameData.LEVEL9_WAVE_DATA);
  assert.equal(manager.start(10), true);
  assert.deepEqual(manager.queue.slice(0, 4), ['zhulong', 'tiangou', 'tiangou', 'tiangou']);
  assert.equal(manager.queue.filter(type => type === 'tiangou').length, 8);
  assert.equal(manager.queue.filter(type => type === 'zheng').length, 4);

  const game = new Game(() => 0.2, 9);
  game.wave.waveNumber = 10;
  assert.equal(game.spawnEnemy('zhulong').maxHp, 9020);
});

test('Level9 enemy visuals provide measured spacing and shared Motion Lite', () => {
  for (const type of ['tiangou', 'zheng', 'zhulong']) {
    assert.ok(ENEMY_VISUALS[type]?.footprint > 0, `${type} needs a spacing footprint`);
    assert.ok(UNIT_MOTION_CONFIG.enemies[type], `${type} needs shared Motion Lite`);
  }
  assert.ok(minimumEnemyPathSpacing('tiangou', 'zheng') > 40);
  assert.ok(minimumEnemyPathSpacing('zheng', 'zhulong') > 60);
});

test('Level9 runtime assets match the audited v2 files', async () => {
  const expected = {
    level9Background: ['assets/levels/level9/bg_zhongshan_extreme_night_v1.jpg', 516931, 'bab355fb7c323f8d150e4bb55237f9cd63dfccb50c36622262300d1473c179ec'],
    tiangou: ['assets/enemies/enemy_tiangou_v1.png', 149653, 'd0f8b77457a2d55f3c225ec14d268ac74838bc9f10cede9ddc1da8c2f586cc55'],
    zheng: ['assets/enemies/enemy_zheng_v1.png', 184120, '330cbaae04bd40ed2952f1af45e5fbe152fe0f3ef1d5ea33b7eadb4539960b61'],
    zhulong: ['assets/bosses/boss_zhulong_v1.png', 324156, '9e152e176cbd6ff2da90d6e735d77479fe13244553dee903b30fc4f6446984ee'],
    zhulongBossPanel: ['assets/ui/ui_boss_zhulong_panel_v2.png', 106121, 'e7e243c9a339626a5735ce6bc81853f247a38900338d8a56c45d286859efe9f2'],
    dijiangUnlock: ['assets/ui/unlock_dijiang_v1.png', 196178, '4234e1b087399e9886e51cd44f77855d58ed074f9e7c825b4adc16c9f067591a'],
  };
  for (const [id, [path, bytes, sha256]] of Object.entries(expected)) {
    assert.equal(ART_ASSETS[id], path);
    const body = await readFile(fileURLToPath(new URL(`../${path}`, import.meta.url)));
    assert.equal(body.length, bytes);
    assert.equal(createHash('sha256').update(body).digest('hex'), sha256);
  }
});

test('Level9 normal combat telegraphs at 7.2s and switches at 8.0s', () => {
  const game = new Game(() => 0.2, 9);
  game.state = 'combat';
  game.time.setPaused(false);
  game.wave.active = true;
  game.wave.spawnedAlive = 1;
  game.spawnEnemy('zheng');
  for (let step = 0; step < 71; step += 1) game.update(0.1);
  assert.equal(game.dayNight.state, 'day');
  assert.equal(game.dayNight.telegraph, false);
  game.update(0.1);
  assert.equal(game.dayNight.telegraph, true);
  assert.equal(game.effects.filter(effect => effect.type === 'dayNightTelegraph').length, 1);
  for (let step = 0; step < 8; step += 1) game.update(0.1);
  assert.equal(game.dayNight.state, 'night');
  assert.equal(game.dayNight.telegraph, false);
  assert.equal(game.effects.filter(effect => effect.type === 'dayNightSwitch').length, 1);
});

test('Tiangou receives exactly 1.20 movement speed only in daylight', () => {
  const daylight = new Game(() => 0.2, 9).spawnEnemy('tiangou');
  daylight.dayNightState = 'day';
  daylight.update(1);
  assert.equal(daylight.pathDistance, 108);

  const night = new Game(() => 0.2, 9).spawnEnemy('tiangou');
  night.dayNightState = 'night';
  night.update(1);
  assert.equal(night.pathDistance, 90);
});

test('Zheng night armor mitigates direct attacks but not AoE or DoT', () => {
  const enemy = new Game(() => 0.2, 9).spawnEnemy('zheng');
  enemy.dayNightState = 'night';
  assert.equal(CombatSystem.resolveDamage(100, enemy, { damageKind: 'direct' }), 82);
  assert.equal(CombatSystem.resolveDamage(100, enemy, { damageKind: 'aoe' }), 100);
  assert.equal(CombatSystem.resolveDamage(100, enemy, { damageKind: 'dot' }), 100);
  enemy.dayNightState = 'day';
  assert.equal(CombatSystem.resolveDamage(100, enemy, { damageKind: 'direct' }), 100);
});

test('Zhulong forces daylight and controls exact P1/P2 switch cadence', () => {
  const game = new Game(() => 0.2, 9);
  game.wave.waveNumber = 10;
  game.dayNight.state = 'night';
  game.dayNight.elapsed = 4;
  const boss = game.spawnEnemy('zhulong');
  assert.deepEqual(game.dayNight, { state: 'day', elapsed: 0, telegraph: false, switchInterval: 6, bossControlled: true });

  DayNightSystem.update(game, 5.19);
  assert.equal(game.dayNight.telegraph, false);
  DayNightSystem.update(game, 0.01);
  assert.equal(game.dayNight.telegraph, true);
  DayNightSystem.update(game, 0.8);
  assert.equal(game.dayNight.state, 'night');

  boss.hp = boss.maxHp * 0.5;
  const events = BossSystem.update(boss, 0);
  assert.deepEqual(events, [{ type: 'zhulongPhase2', phase: 2, duration: 0.8, switchInterval: 4.5 }]);
  game.handleBossEvent(boss, events[0]);
  assert.equal(boss.speedMultiplier, 1.12);
  assert.deepEqual(game.dayNight, { state: 'night', elapsed: 0, telegraph: false, switchInterval: 4.5, bossControlled: true });
  DayNightSystem.update(game, 3.69);
  assert.equal(game.dayNight.telegraph, false);
  DayNightSystem.update(game, 0.01);
  assert.equal(game.dayNight.telegraph, true);
  DayNightSystem.update(game, 0.8);
  assert.equal(game.dayNight.state, 'day');
  assert.equal(BossSystem.update(boss, 0).length, 0, 'P2 transition is one-shot');
});

test('Level9 W10 preserves the Boss-first escort timeline through the size-aware spawn gate', () => {
  const game = new Game(() => 0.2, 9);
  for (const type of ['bifang', 'xuangui', 'jumang']) game.toggleLineup(type);
  game.confirmLineup();
  game.wave.waveNumber = 9;
  game.startWaveNow();
  const firstSeen = {};
  for (let step = 1; step <= 110; step += 1) {
    game.update(0.1);
    for (const type of ['zhulong', 'tiangou', 'zheng']) {
      if (firstSeen[type] == null && game.enemies.some(enemy => enemy.type === type)) firstSeen[type] = step / 10;
    }
  }
  assert.ok(firstSeen.zhulong <= 0.1);
  assert.ok(firstSeen.tiangou >= 0.8 && firstSeen.tiangou <= 1, `first Tiangou entered at ${firstSeen.tiangou}s`);
  assert.ok(firstSeen.zheng >= 7.6 && firstSeen.zheng <= 10.1, `first Zheng entered at ${firstSeen.zheng}s`);
  assert.equal(game.enemies.some(enemy => enemy.type === 'tiangou'), true, 'day→night switch needs a live Tiangou escort');
  assert.equal(game.enemies.find(enemy => enemy.type === 'zheng').dayNightState, 'night');
});

test('Level9 victory waits for queue, escorts, and Zhulong death', () => {
  const game = new Game(() => 0.2, 9);
  game.state = 'combat';
  game.time.setPaused(false);
  game.wave.waveNumber = 10;
  game.wave.active = true;
  game.wave.queue.length = 0;
  game.wave.spawnedAlive = 2;
  const ordinary = game.spawnEnemy('zheng');
  const boss = game.spawnEnemy('zhulong');
  boss.takeDamage(boss.maxHp);
  game.update(0);
  assert.equal(game.state, 'combat');
  assert.equal(game.levelBossDefeated, true);
  ordinary.takeDamage(ordinary.maxHp);
  game.update(0);
  assert.equal(game.state, 'victory');
});

test('guarded Level9 fixtures expose day, night, telegraph, enemy cues, Boss phases and end states', () => {
  const fixture = query => {
    const game = new Game(() => 0.2, 9);
    assert.equal(setupLevelNineDev(game, 9, new URLSearchParams(query)), true);
    return game;
  };

  const day = fixture('devState=day&devEnemy=tiangou');
  assert.equal(day.dayNight.state, 'day');
  assert.equal(day.enemies.some(enemy => enemy.type === 'tiangou'), true);

  const night = fixture('devState=night&devEnemy=zheng');
  assert.equal(night.dayNight.state, 'night');
  assert.equal(night.enemies.find(enemy => enemy.type === 'zheng').dayNightState, 'night');

  const telegraph = fixture('devState=telegraph');
  assert.equal(telegraph.dayNight.telegraph, true);

  const phase2 = fixture('devBossPhase=2');
  assert.equal(phase2.enemies.find(enemy => enemy.type === 'zhulong').bossPhase, 2);
  assert.equal(phase2.dayNight.switchInterval, 4.5);

  const xuangui = fixture('devXuangui=1');
  assert.equal(xuangui.towers.some(tower => tower?.type === 'xuangui'), true);
  assert.equal(xuangui.pendingShocks.length, 0);
  assert.equal(xuangui.effects.some(effect => effect.type === 'xuanguiShock' && effect.life > 3000), true);

  const victory = fixture('devVictory=1');
  assert.equal(victory.state, 'victory');
  assert.equal(victory.pendingUnlock, 'dijiang');
  assert.equal(victory.nextLevelId(), null);

  assert.equal(fixture('devRetry=1').state, 'defeat');
  assert.equal(setupLevelNineDev(new Game(() => 0.2, 8), 8, new URLSearchParams('devVictory=1')), false);
});

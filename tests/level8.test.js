import test from 'node:test';
import assert from 'node:assert/strict';
import {
  ENEMY_DATA,
  LEVEL8_MAP_DATA,
  LEVEL8_WAVE_DATA,
  LEVELS,
  TOWER_DATA,
} from '../src/config/gameData.js';

test('Level8 uses the frozen 幽冥沼澤 identity and exact runtime geometry', () => {
  const level = LEVELS[8];
  assert.equal(level.name, '幽冥沼澤');
  assert.equal(level.bossType, 'huashe');
  assert.equal(level.bossVictoryRequiresWaveClear, true);
  assert.equal(level.art.background, 'level8Background');
  assert.deepEqual(level.art.backgroundCrop, { x: 0, y: 0, width: 780, height: 1220 });
  assert.deepEqual(LEVEL8_MAP_DATA.waypoints, [
    { x: 44, y: 52 }, { x: 65, y: 79 }, { x: 135, y: 104 }, { x: 225, y: 118 },
    { x: 303, y: 135 }, { x: 340, y: 166 }, { x: 314, y: 207 }, { x: 247, y: 229 },
    { x: 172, y: 259 }, { x: 196, y: 291 }, { x: 247, y: 326 }, { x: 164, y: 358 },
    { x: 120, y: 385 }, { x: 175, y: 423 }, { x: 250, y: 444 }, { x: 281, y: 471 },
    { x: 248, y: 513 }, { x: 231, y: 538 },
  ]);
  assert.deepEqual(LEVEL8_MAP_DATA.slots, [
    { x: 115, y: 133 }, { x: 289, y: 175 }, { x: 142, y: 230 }, { x: 269, y: 291 },
    { x: 104, y: 332 }, { x: 267, y: 405 }, { x: 113, y: 440 }, { x: 342, y: 481 },
  ]);
  assert.deepEqual(LEVEL8_MAP_DATA.wetlandZones, [
    { id: 'A', points: [{ x: 292, y: 140 }, { x: 325, y: 145 }, { x: 348, y: 160 }, { x: 350, y: 185 }, { x: 334, y: 208 }, { x: 305, y: 218 }, { x: 285, y: 205 }, { x: 292, y: 180 }] },
    { id: 'B', points: [{ x: 166, y: 257 }, { x: 202, y: 250 }, { x: 235, y: 266 }, { x: 252, y: 292 }, { x: 248, y: 320 }, { x: 222, y: 338 }, { x: 186, y: 333 }, { x: 168, y: 306 }] },
    { id: 'C', points: [{ x: 172, y: 418 }, { x: 210, y: 414 }, { x: 250, y: 428 }, { x: 283, y: 452 }, { x: 294, y: 478 }, { x: 280, y: 504 }, { x: 247, y: 518 }, { x: 225, y: 496 }, { x: 225, y: 468 }, { x: 198, y: 447 }] },
  ]);
  assert.deepEqual(LEVEL8_MAP_DATA.environmentMotion, {
    fog: { x: 8, y: 166, width: 86, height: 66 },
    ripple: { x: 205, y: 143, width: 78, height: 55 },
    bubbles: { x: 304, y: 229, width: 69, height: 63 },
    reeds: { x: 247, y: 306, width: 52, height: 46 },
  });
});

test('Level8 W1-W10 and frozen enemy/tower values match canonical production data', () => {
  assert.deepEqual(LEVEL8_WAVE_DATA, [
    { groups: [{ type: 'changyou', count: 6 }], interval: 1.1 },
    { groups: [{ type: 'changyou', count: 8 }], interval: 1 },
    { groups: [{ type: 'changyou', count: 6 }, { type: 'gudiao', count: 2 }], interval: 1 },
    { groups: [{ type: 'gudiao', count: 4 }], interval: 1.05 },
    { groups: [{ type: 'changyou', count: 10 }, { type: 'gudiao', count: 3 }], interval: 0.9, hpMultiplier: 1.06 },
    { groups: [{ type: 'changyou', count: 14 }, { type: 'gudiao', count: 4 }], interval: 0.78, hpMultiplier: 1.12 },
    { groups: [{ type: 'changyou', count: 10 }, { type: 'gudiao', count: 6 }], interval: 0.82, hpMultiplier: 1.18 },
    { groups: [{ type: 'changyou', count: 16 }, { type: 'gudiao', count: 6 }], interval: 0.7, hpMultiplier: 1.26 },
    { groups: [{ type: 'changyou', count: 18 }, { type: 'gudiao', count: 8 }], interval: 0.64, hpMultiplier: 1.34 },
    { groups: [{ type: 'changyou', count: 8 }, { type: 'gudiao', count: 4 }, { type: 'huashe', count: 1 }], interval: 0.84, hpMultiplier: 1.2, bossHpMultiplier: 1.1 },
  ]);
  assert.deepEqual(ENEMY_DATA.changyou, { id: 'changyou', name: '長右', emoji: '🐒', hp: 110, speed: 86, baseDamage: 1, reward: 15, radius: 12, marshLeapSpeedMultiplier: 1.3, marshLeapDuration: 1.6 });
  assert.deepEqual(ENEMY_DATA.gudiao, { id: 'gudiao', name: '蠱雕', emoji: '🦅', hp: 420, speed: 24, baseDamage: 3, reward: 32, radius: 18, marshArmorDamageMultiplier: 0.78, marshArmorLinger: 0.6 });
  assert.deepEqual(ENEMY_DATA.huashe, { id: 'huashe', name: '化蛇', emoji: '🐍', hp: 7600, speed: 15, baseDamage: 20, reward: 0, radius: 30, isBoss: true, bossMechanic: { type: 'huashe', phase2Threshold: 0.5, phase2SpeedMultiplier: 1.15, phase1ForcedTideInterval: 7, phase1ForcedTideDuration: 2.4, phase2ForcedTideInterval: 5, phase2ForcedTideDuration: 3 } });
  assert.deepEqual(TOWER_DATA.xuangui, { id: 'xuangui', name: '玄龜', emoji: '🐢', role: '潮震控場', cost: 145, damage: 13, interval: 1.2, range: 140, projectileSpeed: 360, shockEvery: 4, shockDelay: 0.35, shockRadius: 52, shockDamage: 18, shockPushback: 18 });
});

import test from 'node:test';
import assert from 'node:assert/strict';
import { UNIT_MOTION_CONFIG } from '../src/config/motionData.js';
import { MotionSystem } from '../src/systems/MotionSystem.js';

const boss = (phase = 3) => ({
  id: 77, type: 'jiuweihu', bossPhase: phase, x: 100, y: 100,
  visualHitFlash: 0, pathDistance: 10,
});

const effectAt = (type, progress, duration = 1) => ({
  type, sourceId: 77, duration, life: duration * (1 - progress),
});

test('Jiuweihu idle scale and phase-three float are visible at 390px', () => {
  const phases = UNIT_MOTION_CONFIG.enemies.jiuweihu.phases;
  assert.equal(phases[1].idleScale >= 0.025, true);
  assert.equal(phases[2].idleScale >= 0.035, true);
  assert.equal(phases[3].idleScale >= 0.045, true);
  assert.equal(phases[3].bobPixels >= 3, true);
  assert.ok(Math.abs(MotionSystem.enemyTransform(boss(3), 0.2).yOffset) >= 2);
});

test('Jiuweihu hit recoil is at least three pixels on its visible frame', () => {
  const enemy = boss(1);
  enemy.visualHitFlash = UNIT_MOTION_CONFIG.hitFlashSeconds / 2;
  const motion = MotionSystem.enemyTransform(enemy, 0, []);
  assert.ok(Math.abs(motion.xOffset) >= 3);
  assert.equal(motion.flash, true);
});

test('Jiuweihu skill has obvious charge, action, and rebound segments', () => {
  const enemy = boss(3);
  const charge = MotionSystem.enemyTransform(enemy, 0, [effectAt('jiuweihuSkill', 0.2)]);
  const action = MotionSystem.enemyTransform(enemy, 0, [effectAt('jiuweihuSkill', 0.5)]);
  const rebound = MotionSystem.enemyTransform(enemy, 0, [effectAt('jiuweihuSkill', 0.85)]);
  assert.ok(charge.scale >= 1.05);
  assert.ok(Math.abs(action.xOffset) >= 4);
  assert.notEqual(rebound.scale, 1);
});

test('Jiuweihu evolution has a strong transform and death lasts 450ms', () => {
  const enemy = boss(2);
  const evolution = MotionSystem.enemyTransform(enemy, 0, [effectAt('jiuweihuEvolution', 0.5, 0.7)]);
  assert.ok(evolution.scale >= 1.12);
  assert.ok(Math.abs(evolution.yOffset) >= 3);
  assert.equal(UNIT_MOTION_CONFIG.enemies.jiuweihu.deathSeconds, 0.45);
});

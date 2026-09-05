import test from 'node:test';
import assert from 'node:assert/strict';
import { StatusSystem } from '../src/systems/StatusSystem.js';
import { CombatSystem } from '../src/systems/CombatSystem.js';

const target = (x, hp = 100) => ({
  x, y: 0, hp, maxHp: hp, alive: true, statuses: {}, isBoss: false, hitFlash: 0,
  takeDamage(amount) { this.hp = Math.max(0, this.hp - amount); this.alive = this.hp > 0; },
});

test('slow expires using scaled combat time and burn deals DOT', () => {
  const enemy = target(0);
  StatusSystem.applySlow(enemy, 0.25, 2);
  StatusSystem.applyBurn(enemy, 5, 2);
  StatusSystem.update(enemy, 1);
  assert.equal(enemy.hp, 95);
  assert.equal(StatusSystem.speedMultiplier(enemy), 0.75);
  StatusSystem.update(enemy, 1.01);
  assert.equal(StatusSystem.speedMultiplier(enemy), 1);
});

test('bifang impact damages every enemy in explosion radius', () => {
  const enemies = [target(0), target(30), target(80)];
  CombatSystem.areaDamage(enemies, { x: 0, y: 0 }, 55, 18, {});
  assert.deepEqual(enemies.map(e => e.hp), [82, 82, 100]);
});

test('yinglong penetration hits only ordered targets', () => {
  const enemies = [target(40), target(10), target(25)];
  enemies.forEach((enemy, index) => { enemy.pathDistance = [40, 10, 25][index]; });
  const hit = CombatSystem.penetrate(enemies, 2, 32, {});
  assert.deepEqual(hit.map(e => e.pathDistance), [40, 25]);
  assert.deepEqual(enemies.map(e => e.hp), [68, 100, 68]);
});

test('slowed vulnerability and boss bonus apply in one pipeline', () => {
  const enemy = target(0);
  enemy.statuses.slow = { amount: 0.25, remaining: 1 };
  enemy.isBoss = true;
  const damage = CombatSystem.resolveDamage(100, enemy, { slowedVulnerability: 0.1, bossBonus: 0.3 });
  assert.equal(damage, 143);
});

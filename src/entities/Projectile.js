import { CombatSystem } from '../systems/CombatSystem.js?v=level8-2';
import { StatusSystem } from '../systems/StatusSystem.js?v=level8-2';

export class Projectile {
  constructor(tower, target, stats, modifiers, effects = [], pendingShocks = []) {
    this.type = tower.type;
    this.sourceTower = tower;
    this.x = tower.x;
    this.y = tower.y;
    this.target = target;
    this.targetPoint = { x: target.x, y: target.y };
    this.stats = stats;
    this.modifiers = modifiers;
    this.effects = effects;
    this.pendingShocks = pendingShocks;
    this.alive = true;
  }
  update(dt, enemies) {
    if (!this.alive) return;
    if (this.target.alive) this.targetPoint = { x: this.target.x, y: this.target.y };
    const distance = Math.hypot(this.targetPoint.x - this.x, this.targetPoint.y - this.y);
    const travel = this.stats.projectileSpeed * dt;
    if (travel >= distance || distance < 3) { this.impact(enemies); return; }
    this.x += (this.targetPoint.x - this.x) / distance * travel;
    this.y += (this.targetPoint.y - this.y) / distance * travel;
  }
  impact(enemies) {
    if (this.type === 'bifang') {
      const hit = CombatSystem.areaDamage(enemies, this.targetPoint, this.stats.explosionRadius, this.stats.damage, { slowedVulnerability: this.modifiers.slowedVulnerability });
      hit.forEach(enemy => StatusSystem.applyBurn(enemy, this.stats.burnDps, 2));
      this.effects.push({
        type: 'explosion', x: this.targetPoint.x, y: this.targetPoint.y,
        radius: this.stats.explosionRadius, hitCount: hit.length,
        hitPoints: hit.map(enemy => ({ x: enemy.x, y: enemy.y })),
        life: 0.36, duration: 0.36,
      });
    } else if (this.target.alive) {
      CombatSystem.hit(this.target, this.stats.damage, { slowedVulnerability: this.modifiers.slowedVulnerability });
      if (this.type === 'fuzhu') StatusSystem.applySlow(this.target, this.stats.slow, this.stats.slowDuration);
      if (this.type === 'jumang') {
        this.effects.push({
          type: 'jumangImpact', x: this.targetPoint.x, y: this.targetPoint.y,
          life: 0.3, duration: 0.3,
        });
      }
      if (this.type === 'xuangui') {
        this.effects.push({
          type: 'xuanguiImpact', x: this.targetPoint.x, y: this.targetPoint.y,
          life: 0.24, duration: 0.24,
        });
        this.sourceTower.successfulAttacks += 1;
        if (this.sourceTower.successfulAttacks % this.stats.shockEvery === 0) {
          this.pendingShocks.push({
            x: this.targetPoint.x,
            y: this.targetPoint.y,
            remaining: this.stats.shockDelay,
            radius: this.stats.shockRadius,
            damage: this.stats.shockDamage,
            pushback: this.stats.shockPushback,
          });
          this.effects.push({
            type: 'xuanguiShockTelegraph', x: this.targetPoint.x, y: this.targetPoint.y,
            radius: this.stats.shockRadius, life: this.stats.shockDelay, duration: this.stats.shockDelay,
          });
        }
      }
    }
    this.alive = false;
  }
}

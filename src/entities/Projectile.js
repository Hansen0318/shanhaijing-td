import { CombatSystem } from '../systems/CombatSystem.js';
import { StatusSystem } from '../systems/StatusSystem.js';

export class Projectile {
  constructor(tower, target, stats, modifiers) {
    this.type = tower.type;
    this.x = tower.x;
    this.y = tower.y;
    this.target = target;
    this.targetPoint = { x: target.x, y: target.y };
    this.stats = stats;
    this.modifiers = modifiers;
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
    } else if (this.target.alive) {
      CombatSystem.hit(this.target, this.stats.damage, { slowedVulnerability: this.modifiers.slowedVulnerability });
      StatusSystem.applySlow(this.target, this.stats.slow, this.stats.slowDuration);
    }
    this.alive = false;
  }
}

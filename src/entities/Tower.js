export class Tower {
  constructor(type, data, slot) {
    this.type = type;
    this.data = data;
    this.x = slot.x;
    this.y = slot.y;
    this.level = 1;
    this.cooldown = 0;
    this.invested = data.cost;
  }
  getStats(modifiers = {}) {
    const levelDamageMultiplier = this.level >= 3 ? 1.5 : this.level >= 2 ? 1.3 : 1;
    const levelDamage = this.data.damage * levelDamageMultiplier;
    const towerDamage = modifiers[`${this.type}Damage`] ?? 0;
    const stats = {
      damage: Number((levelDamage * (1 + (modifiers.allDamage ?? 0)) * (1 + towerDamage)).toFixed(3)),
      interval: this.data.interval / (1 + (modifiers.attackSpeed ?? 0)),
      range: this.data.range * (1 + (this.type === 'fuzhu' ? modifiers.fuzhuRange ?? 0 : 0)),
      projectileSpeed: this.data.projectileSpeed,
      explosionRadius: this.data.explosionRadius,
      slow: this.data.slow,
      slowDuration: this.data.slowDuration,
      penetration: this.data.penetration,
      burnDps: modifiers.bifangBurn ?? 0,
      bossBonus: this.type === 'yinglong' ? modifiers.yinglongBoss ?? 0 : 0,
    };
    if (this.level === 3 && this.type === 'bifang') stats.explosionRadius *= this.data.level3.explosionRadiusMultiplier;
    if (this.type === 'bifang') stats.explosionRadius *= 1 + (modifiers.bifangRadius ?? 0);
    if (this.level === 3 && this.type === 'fuzhu') stats.slow += this.data.level3.slowBonus;
    if (this.type === 'fuzhu') stats.slow = Math.min(0.75, stats.slow + (modifiers.fuzhuSlow ?? 0));
    if (this.level === 3 && this.type === 'yinglong') stats.penetration += this.data.level3.penetrationBonus;
    if (this.type === 'yinglong') stats.penetration += modifiers.yinglongPenetration ?? 0;
    return stats;
  }
}

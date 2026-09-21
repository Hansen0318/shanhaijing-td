export class CombatSystem {
  static distance(a, b) { return Math.hypot(a.x - b.x, a.y - b.y); }
  static acquireTarget(tower, enemies, range, { preferReal = false } = {}) {
    return enemies.filter(enemy => enemy.alive && this.distance(tower, enemy) <= range).sort((a, b) => {
      if (preferReal && Boolean(a.isIllusion) !== Boolean(b.isIllusion)) return a.isIllusion ? 1 : -1;
      return b.pathDistance - a.pathDistance;
    })[0] ?? null;
  }
  static resolveDamage(base, enemy, modifiers = {}) {
    const damageKind = modifiers.damageKind ?? 'direct';
    let damage = base;
    if (enemy.statuses?.slow) damage *= 1 + (modifiers.slowedVulnerability ?? 0);
    if (enemy.isBoss) damage *= 1 + (modifiers.bossBonus ?? 0);
    const insight = enemy.statuses?.insight;
    if (insight) damage *= 1 + (enemy.isBoss ? insight.bossVulnerability : insight.vulnerability);
    if (damageKind !== 'dot') damage *= enemy.data?.normalDamageMultiplier ?? 1;
    if (enemy.activeDefenseMultiplier != null) {
      const defensePierce = insight?.defensePierce ?? 0;
      const reduction = (1 - enemy.activeDefenseMultiplier) * (1 - defensePierce);
      damage *= 1 - reduction;
    }
    damage *= enemy.sunlightDamageMultiplier ?? 1;
    damage *= enemy.statuses?.thunderShell?.damageMultiplier ?? 1;
    if (damage > 0) damage = Math.max(enemy.data?.minimumNormalDamage ?? 0, damage);
    return Number(damage.toFixed(3));
  }
  static hit(enemy, damage, modifiers = {}) {
    const damageKind = modifiers.damageKind ?? 'direct';
    let resolved = this.resolveDamage(damage, enemy, { ...modifiers, damageKind });
    const armorBroken = damageKind === 'direct' && damage >= 30 && enemy.earthArmorLayers > 0;
    if (armorBroken) {
      enemy.earthArmorLayers -= 1;
      enemy.armorBreakEffectPending = true;
      resolved = Number((resolved * 0.45).toFixed(3));
    }
    enemy.takeDamage(resolved);
    return { damage: resolved, armorBroken };
  }
  static areaDamage(enemies, point, radius, damage, modifiers = {}) {
    const hit = enemies.filter(enemy => enemy.alive && this.distance(enemy, point) <= radius);
    hit.forEach(enemy => this.hit(enemy, damage, { ...modifiers, damageKind: 'aoe' }));
    return hit;
  }
  static penetrate(enemies, count, damage, modifiers = {}, origin = null, range = Infinity) {
    const candidates = enemies.filter(enemy => enemy.alive && (!origin || this.distance(origin, enemy) <= range)).sort((a, b) => b.pathDistance - a.pathDistance).slice(0, count);
    candidates.forEach(enemy => this.hit(enemy, damage, { ...modifiers, damageKind: 'direct' }));
    return candidates;
  }
}

export class BossSystem {
  static check(enemy) {
    if (!enemy.alive || !enemy.isBoss) return [];
    const mechanic = enemy.data.bossMechanic;
    if (!mechanic) return [];
    if (mechanic.type === 'frenzy') return enemy.checkFrenzy() ? [{ type: 'frenzy' }] : [];
    if (mechanic.type !== 'consume') return [];

    const healthRatio = enemy.hp / enemy.maxHp;
    const triggered = mechanic.thresholds.filter(threshold => (
      healthRatio <= threshold && !enemy.triggeredBossThresholds.has(threshold)
    ));
    return triggered.map(threshold => {
      enemy.triggeredBossThresholds.add(threshold);
      const healAmount = Math.round(enemy.maxHp * mechanic.healRatio);
      enemy.hp = Math.min(enemy.maxHp, enemy.hp + healAmount);
      return { type: 'consume', threshold, healAmount };
    });
  }
}

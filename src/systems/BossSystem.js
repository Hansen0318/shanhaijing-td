export class BossSystem {
  static check(enemy) {
    if (!enemy.alive || !enemy.isBoss) return [];
    const mechanic = enemy.data.bossMechanic;
    if (!mechanic) return [];
    if (mechanic.type === 'frenzy') return enemy.checkFrenzy() ? [{ type: 'frenzy' }] : [];
    if (mechanic.type === 'staged') {
      const healthRatio = enemy.hp / enemy.maxHp;
      const stage = mechanic.stages.find(item => (
        healthRatio <= item.threshold && !enemy.triggeredBossThresholds.has(item.threshold)
      ));
      if (!stage) return [];
      enemy.triggeredBossThresholds.add(stage.threshold);
      if (stage.action === 'heal') {
        const healAmount = Math.round(enemy.maxHp * stage.healRatio);
        enemy.hp = Math.min(enemy.maxHp, enemy.hp + healAmount);
        return [{ type: 'heal', threshold: stage.threshold, healAmount }];
      }
      enemy.frenzied = true;
      enemy.speedMultiplier = stage.speedMultiplier;
      return [{ type: 'frenzy', threshold: stage.threshold }];
    }
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

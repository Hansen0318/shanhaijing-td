export class BossSystem {
  static update(enemy, dt, context = {}) {
    if (!enemy.alive || enemy.type !== 'jiuweihu') return this.check(enemy);
    if (!enemy.bossPhase) {
      enemy.bossPhase = 1;
      enemy.bossTimers = { shield: 8, step: 10 };
    }
    const healthRatio = enemy.hp / enemy.maxHp;
    if (enemy.bossPhase < 2 && healthRatio <= 0.6) {
      enemy.bossPhase = 2;
      enemy.bossTimers = { illusions: 8 };
      return [{ type: 'bossEvolution', phase: 2, duration: 0.7 }];
    }
    if (enemy.bossPhase < 3 && healthRatio <= 0.25) {
      enemy.bossPhase = 3;
      enemy.speedMultiplier = 1.2;
      enemy.bossTimers = { ultimate: 7 };
      return [{ type: 'bossEvolution', phase: 3, duration: 0.9 }];
    }

    const events = [];
    const timers = enemy.bossTimers ?? (enemy.bossTimers = {});
    if (enemy.bossPhase === 1) {
      timers.shield = (timers.shield ?? 8) - dt;
      timers.step = (timers.step ?? 10) - dt;
      if (timers.shield <= 0) {
        timers.shield += 8;
        enemy.activeDefenseMultiplier = 0.85;
        enemy.statuses.bossShield = { remaining: 2.5 };
        events.push({ type: 'bossShield', duration: 2.5 });
      }
      if (timers.step <= 0) {
        timers.step += 10;
        enemy.statuses.bossStep = { remaining: 1.3 };
        events.push({ type: 'bossStep', duration: 1.3 });
      }
    } else if (enemy.bossPhase === 2) {
      timers.illusions = (timers.illusions ?? 8) - dt;
      if (timers.illusions <= 0) {
        timers.illusions += 8;
        const baseDuration = context.inFog ? 2.3 : 1.8;
        events.push({ type: 'bossIllusions', count: 3, duration: context.insightActive ? baseDuration / 2 : baseDuration });
      }
    } else {
      if (timers.ultimateRelease != null) {
        timers.ultimateRelease -= dt;
        if (timers.ultimateRelease <= 0) {
          delete timers.ultimateRelease;
          enemy.statuses.ultimateWard = { remaining: 4 };
          enemy.slowEffectivenessMultiplier = 0.6;
          events.push({ type: 'bossUltimateRelease', duration: 4 });
        }
      }
      timers.ultimate = (timers.ultimate ?? 7) - dt;
      if (timers.ultimate <= 0) {
        timers.ultimate += 7;
        timers.ultimateRelease = 0.6;
        events.push({ type: 'bossUltimateCharge', duration: 0.6 });
      }
    }
    return events;
  }
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

import { CombatSystem } from './CombatSystem.js?v=level8-3';

export class StatusSystem {
  static applyInsight(enemy, { duration, vulnerability, bossVulnerability, defensePierce }) {
    const current = enemy.statuses.insight;
    enemy.statuses.insight = {
      remaining: Math.max(duration, current?.remaining ?? 0),
      vulnerability: Math.max(vulnerability ?? 0, current?.vulnerability ?? 0),
      bossVulnerability: Math.max(bossVulnerability ?? 0, current?.bossVulnerability ?? 0),
      defensePierce: Math.max(defensePierce ?? 0, current?.defensePierce ?? 0),
    };
  }
  static applySlow(enemy, amount, duration) {
    const current = enemy.statuses.slow;
    enemy.statuses.slow = { amount: Math.max(amount, current?.amount ?? 0), remaining: Math.max(duration, current?.remaining ?? 0) };
  }
  static applyBurn(enemy, dps, duration) {
    if (dps <= 0) return;
    enemy.statuses.burn = { dps: Math.max(dps, enemy.statuses.burn?.dps ?? 0), remaining: duration };
  }
  static speedMultiplier(enemy) {
    const slow = enemy.statuses.slow?.amount ?? 0;
    const sprint = enemy.statuses.fogSprint?.amount ?? 0;
    const bossStep = enemy.statuses.bossStep ? 0.25 : 0;
    const slowEffectiveness = (enemy.data?.slowEffectiveness ?? 1) * (enemy.slowEffectivenessMultiplier ?? 1);
    const thunderSprint = enemy.statuses.thunderSprint?.multiplier ?? 1;
    const marshLeap = enemy.statuses.marshLeap?.multiplier ?? 1;
    return Math.max(0.2, 1 - slow * slowEffectiveness) * (1 + sprint + bossStep) * thunderSprint * marshLeap;
  }
  static update(enemy, dt) {
    const burn = enemy.statuses.burn;
    if (burn) {
      CombatSystem.hit(enemy, burn.dps * Math.min(dt, burn.remaining), { damageKind: 'dot' });
      burn.remaining -= dt;
      if (burn.remaining <= 0) delete enemy.statuses.burn;
    }
    const slow = enemy.statuses.slow;
    if (slow) { slow.remaining -= dt; if (slow.remaining <= 0) delete enemy.statuses.slow; }
    for (const key of ['fogSprint', 'insight', 'thunderSprint', 'thunderShell', 'marshLeap', 'marshArmor']) {
      const status = enemy.statuses[key];
      if (!status) continue;
      status.remaining -= dt;
      if (status.remaining <= 0) delete enemy.statuses[key];
    }
    for (const key of ['bossShield', 'bossStep', 'ultimateWard']) {
      const status = enemy.statuses[key];
      if (!status) continue;
      status.remaining -= dt;
      if (status.remaining > 0) continue;
      delete enemy.statuses[key];
      if (key === 'bossShield') enemy.activeDefenseMultiplier = 1;
      if (key === 'ultimateWard') enemy.slowEffectivenessMultiplier = 1;
    }
  }
}

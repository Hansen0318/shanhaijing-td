export class StatusSystem {
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
    return Math.max(0.2, 1 - slow * (enemy.data?.slowEffectiveness ?? 1));
  }
  static update(enemy, dt) {
    const burn = enemy.statuses.burn;
    if (burn) {
      enemy.takeDamage(burn.dps * Math.min(dt, burn.remaining));
      burn.remaining -= dt;
      if (burn.remaining <= 0) delete enemy.statuses.burn;
    }
    const slow = enemy.statuses.slow;
    if (slow) { slow.remaining -= dt; if (slow.remaining <= 0) delete enemy.statuses.slow; }
  }
}

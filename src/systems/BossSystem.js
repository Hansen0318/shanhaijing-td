export class BossSystem {
  static update(enemy, dt, context = {}) {
    if (!enemy.alive) return [];
    if (enemy.type === 'xingtian') return this.updateXingtian(enemy, dt);
    if (enemy.type === 'jinwu') return this.updateJinwu(enemy);
    if (enemy.type === 'kui') return this.updateKui(enemy);
    if (enemy.type === 'huashe') return this.updateHuashe(enemy, dt, context);
    if (enemy.type === 'zhulong') return this.updateZhulong(enemy);
    if (enemy.type !== 'jiuweihu') return this.check(enemy);
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
  static updateJinwu(enemy) {
    enemy.bossPhase ??= 1;
    if (enemy.bossPhase === 1 && enemy.hp / enemy.maxHp <= 0.5) {
      enemy.bossPhase = 2;
      enemy.speedMultiplier = 1.12;
      return [{ type: 'jinwuPhase2', phase: 2, duration: 0.8 }];
    }
    return [];
  }
  static updateKui(enemy) {
    enemy.bossPhase ??= 1;
    if (enemy.bossPhase === 1 && enemy.hp / enemy.maxHp <= 0.5) {
      enemy.bossPhase = 2;
      enemy.speedMultiplier = 1.15;
      return [{ type: 'kuiPhase2', phase: 2, duration: 0.8 }];
    }
    return [];
  }
  static updateZhulong(enemy) {
    enemy.bossPhase ??= 1;
    const mechanic = enemy.data.bossMechanic;
    if (enemy.bossPhase === 1 && enemy.hp / enemy.maxHp <= mechanic.phase2Threshold) {
      enemy.bossPhase = 2;
      enemy.speedMultiplier = mechanic.phase2SpeedMultiplier;
      return [{
        type: 'zhulongPhase2',
        phase: 2,
        duration: mechanic.telegraphDuration,
        switchInterval: mechanic.phase2SwitchInterval,
      }];
    }
    return [];
  }
  static updateHuashe(enemy, dt, context = {}) {
    const mechanic = enemy.data.bossMechanic;
    if (!enemy.bossPhase) {
      enemy.bossPhase = 1;
      enemy.bossTimers = {
        tide: mechanic.phase1ForcedTideInterval,
        openingTide: 0.8,
        openingTelegraphSent: false,
      };
    }
    if (enemy.bossTimers.openingTide != null) {
      if (!enemy.bossTimers.openingTelegraphSent) {
        // Wait until the first escort has entered so the opening tide actually changes the Boss fight.
        if (!context.escortAlive) return [];
        enemy.bossTimers.openingTelegraphSent = true;
        return [{ type: 'huasheTideTelegraph', duration: 0.8 }];
      }
      enemy.bossTimers.openingTide -= Math.max(0, dt);
      if (enemy.bossTimers.openingTide > 1e-9) return [];
      delete enemy.bossTimers.openingTide;
      delete enemy.bossTimers.openingTelegraphSent;
      enemy.bossTimers.tide = mechanic.phase1ForcedTideInterval;
      return [{ type: 'huasheForcedTide', duration: mechanic.phase1ForcedTideDuration }];
    }
    if (enemy.bossPhase === 1 && enemy.hp / enemy.maxHp <= mechanic.phase2Threshold) {
      enemy.bossPhase = 2;
      enemy.speedMultiplier = mechanic.phase2SpeedMultiplier;
      enemy.bossTimers = { tide: mechanic.phase2ForcedTideInterval };
      return [{ type: 'huashePhase2', phase: 2, duration: 0.8 }];
    }
    const interval = enemy.bossPhase === 2
      ? mechanic.phase2ForcedTideInterval
      : mechanic.phase1ForcedTideInterval;
    enemy.bossTimers.tide -= Math.max(0, dt);
    if (enemy.bossTimers.tide > 1e-9) return [];
    enemy.bossTimers.tide += interval;
    return [{
      type: 'huasheForcedTide',
      duration: enemy.bossPhase === 2
        ? mechanic.phase2ForcedTideDuration
        : mechanic.phase1ForcedTideDuration,
    }];
  }
  static updateXingtian(enemy, dt) {
    if (!enemy.bossPhase) {
      enemy.bossPhase = 1;
      enemy.bossTimers = { shield: 5.5 };
    }
    if (enemy.bossPhase === 1 && enemy.hp / enemy.maxHp <= 0.5) {
      enemy.bossPhase = 2;
      enemy.speedMultiplier = 1.15;
      enemy.bossTimers = { earthquake: 4.8 };
      delete enemy.statuses.bossShield;
      enemy.activeDefenseMultiplier = 1;
      return [{ type: 'xingtianEvolution', phase: 2 }];
    }

    const events = [];
    const timers = enemy.bossTimers;
    if (enemy.bossPhase === 1) {
      timers.shield -= dt;
      if (timers.shield <= 1e-9) {
        timers.shield += 5.5;
        enemy.activeDefenseMultiplier = 0.65;
        enemy.statuses.bossShield = { remaining: 1.2 };
        events.push({ type: 'xingtianShield', duration: 1.2 });
      }
      return events;
    }

    if (timers.earthquakeRelease != null) {
      timers.earthquakeRelease -= dt;
      if (timers.earthquakeRelease <= 1e-9) {
        delete timers.earthquakeRelease;
        events.push({ type: 'xingtianEarthquakeRelease', radius: 95, stunDuration: 1 });
      }
    }
    timers.earthquake -= dt;
    if (timers.earthquake <= 1e-9) {
      timers.earthquake += 4.8;
      timers.earthquakeRelease = 0.45;
      events.push({ type: 'xingtianEarthquakeCharge', duration: 0.45 });
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

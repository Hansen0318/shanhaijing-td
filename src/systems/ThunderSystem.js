const TELEGRAPH_SECONDS = 0.9;
const P1_CADENCE = 7;
const P2_CADENCE = 5;
const P1_SEQUENCE = Object.freeze([Object.freeze(['A']), Object.freeze(['B'])]);
const P2_SEQUENCE = Object.freeze([Object.freeze(['A']), Object.freeze(['B']), Object.freeze(['A', 'B'])]);

function activeSequence(thunder) {
  return thunder.phase2 ? P2_SEQUENCE : P1_SEQUENCE;
}

export class ThunderSystem {
  static reset({ phase2 = false } = {}) {
    return {
      countdown: phase2 ? P2_CADENCE : P1_CADENCE,
      phase2,
      sequenceIndex: 0,
      chargingZoneIds: [],
      lastPulseZoneIds: [],
    };
  }

  static update(game, dt) {
    if (!(game.map?.data.thunderZones?.length)) return [];
    game.thunder ??= this.reset();
    const thunder = game.thunder;
    thunder.countdown = Math.max(0, thunder.countdown - Math.max(0, dt));
    const sequence = activeSequence(thunder);
    const zoneIds = sequence[thunder.sequenceIndex % sequence.length];

    if (thunder.countdown <= TELEGRAPH_SECONDS + 1e-9 && thunder.countdown > 1e-9 && thunder.chargingZoneIds.length === 0) {
      thunder.chargingZoneIds = [...zoneIds];
      game.effects.push({ type: 'thunderCharge', zoneIds: [...zoneIds], life: thunder.countdown, duration: TELEGRAPH_SECONDS });
    }
    if (thunder.countdown > 1e-9) return [];

    thunder.lastPulseZoneIds = [...zoneIds];
    const active = new Set(zoneIds);
    for (const enemy of game.enemies) {
      if (!enemy.alive || enemy.type === 'kui' || !active.has(game.map.thunderZoneAt(enemy))) continue;
      if (enemy.type === 'qinyuan') enemy.statuses.thunderSprint = { remaining: 1.4, multiplier: 1.25 };
      if (enemy.type === 'zhuhuai') enemy.statuses.thunderShell = { remaining: 1.6, damageMultiplier: 0.8 };
    }
    game.effects.push({ type: 'thunderPulse', zoneIds: [...zoneIds], life: 0.42, duration: 0.42 });
    thunder.sequenceIndex = (thunder.sequenceIndex + 1) % sequence.length;
    thunder.countdown = thunder.phase2 ? P2_CADENCE : P1_CADENCE;
    thunder.chargingZoneIds = [];
    return [...zoneIds];
  }
}

const NATURAL_CYCLE_SECONDS = 10;
const HIGH_TIDE_SECONDS = 2.4;
const NATURAL_HIGH_START = NATURAL_CYCLE_SECONDS - HIGH_TIDE_SECONDS;
const TELEGRAPH_SECONDS = 0.8;
const EPSILON = 1e-9;

function naturalState(elapsed) {
  const phase = (elapsed + EPSILON) % NATURAL_CYCLE_SECONDS;
  return {
    high: phase >= NATURAL_HIGH_START,
    telegraph: phase >= NATURAL_HIGH_START - TELEGRAPH_SECONDS && phase < NATURAL_HIGH_START,
  };
}

export class TideSystem {
  static reset() {
    return {
      elapsed: 0,
      forcedRemaining: 0,
      high: false,
      telegraph: false,
      activationId: 0,
      activeZoneIds: [],
    };
  }

  static forceHighTide(game, duration) {
    if (!(game.map?.data.wetlandZones?.length)) return [];
    game.tide ??= this.reset();
    game.tide.forcedRemaining = Math.max(0, duration);
    return this.sync(game);
  }

  static update(game, dt) {
    if (!(game.map?.data.wetlandZones?.length)) return [];
    game.tide ??= this.reset();
    const delta = Math.max(0, dt);
    game.tide.elapsed += delta;
    game.tide.forcedRemaining = Math.max(0, game.tide.forcedRemaining - delta);
    return this.sync(game);
  }

  static sync(game) {
    const tide = game.tide;
    const previousHigh = tide.high;
    const previousTelegraph = tide.telegraph;
    const natural = naturalState(tide.elapsed);
    tide.high = natural.high || tide.forcedRemaining > EPSILON;
    tide.telegraph = !tide.high && natural.telegraph;
    tide.activeZoneIds = tide.high ? game.map.data.wetlandZones.map(zone => zone.id) : [];

    if (!previousTelegraph && tide.telegraph) {
      game.effects.push({ type: 'tideTelegraph', zoneIds: [...tide.activeZoneIds], life: TELEGRAPH_SECONDS, duration: TELEGRAPH_SECONDS });
    }
    if (!previousHigh && tide.high) {
      tide.activationId += 1;
      game.effects.push({ type: 'tideRise', zoneIds: [...tide.activeZoneIds], life: 0.45, duration: 0.45 });
    } else if (previousHigh && !tide.high) {
      game.effects.push({ type: 'tideFall', life: 0.35, duration: 0.35 });
    }

    const active = new Set(tide.activeZoneIds);
    for (const enemy of game.enemies) {
      if (!enemy.alive || enemy.type === 'huashe') continue;
      const zoneId = game.map.wetlandZoneAt(enemy);
      const inActiveWetland = zoneId != null && active.has(zoneId);
      enemy.inActiveWetland = inActiveWetland;
      if (enemy.type === 'changyou' && inActiveWetland) {
        enemy.marshLeapActivations ??= new Set();
        const activationKey = `${tide.activationId}:${zoneId}`;
        if (!enemy.marshLeapActivations.has(activationKey)) {
          enemy.marshLeapActivations.add(activationKey);
          enemy.statuses.marshLeap = {
            remaining: enemy.data.marshLeapDuration,
            multiplier: enemy.data.marshLeapSpeedMultiplier,
          };
        }
      }
      if (enemy.type === 'gudiao' && inActiveWetland) {
        enemy.statuses.marshArmor = {
          remaining: enemy.data.marshArmorLinger,
          damageMultiplier: enemy.data.marshArmorDamageMultiplier,
        };
      }
    }
    return [...tide.activeZoneIds];
  }
}

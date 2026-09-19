const SUNLIGHT_INTERVAL = 6;

export class SunlightSystem {
  static activeZoneIds(game) {
    if (!(game.map?.data.sunlightZones?.length)) return [];
    if (game.sunlight?.phase2) return game.map.data.sunlightZones.map(zone => zone.id);
    const cycle = Math.floor(((game.sunlight?.elapsed ?? 0) + 1e-9) / SUNLIGHT_INTERVAL);
    return [cycle % 2 === 0 ? 'A' : 'B'];
  }

  static update(game, dt) {
    if (!(game.map?.data.sunlightZones?.length)) return [];
    game.sunlight ??= { elapsed: 0, phase2: false };
    game.sunlight.elapsed += Math.max(0, dt);
    const active = new Set(this.activeZoneIds(game));

    for (const enemy of game.enemies) {
      const zoneId = game.map.sunlightZoneAt(enemy);
      const inSunlight = active.has(zoneId);
      const hadArmor = Boolean(enemy.yangmuArmorActive);
      enemy.inSunlight = inSunlight;
      enemy.yangmuArmorActive = enemy.type === 'fusangjiashou' && inSunlight;
      enemy.sunShieldActive = enemy.type === 'jinwu' && inSunlight;
      enemy.sunlightDamageMultiplier = enemy.yangmuArmorActive
        ? 0.75
        : enemy.sunShieldActive ? 0.8 : 1;
      if (hadArmor && !enemy.yangmuArmorActive) enemy.sunlightArmorBreakPending = true;
    }
    return [...active];
  }
}

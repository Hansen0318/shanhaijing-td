const LEVEL_INTERVAL_MULTIPLIERS = Object.freeze({ 1: 0.95, 2: 0.92, 3: 0.89 });

export class JumangSupportSystem {
  static intervalMultiplier(towers = [], modifiers = {}) {
    const highestLevel = towers.reduce((highest, tower) => (
      tower?.type === 'jumang' ? Math.max(highest, Math.min(3, tower.level)) : highest
    ), 0);
    if (!highestLevel) return 1;
    const springLayers = Math.min(2, Math.max(0, modifiers.jumangSpring ?? 0));
    return Number((LEVEL_INTERVAL_MULTIPLIERS[highestLevel] - (0.02 * springLayers)).toFixed(2));
  }
}

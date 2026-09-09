import { ENABLE_UNIT_MOTION, UNIT_MOTION_CONFIG } from '../config/motionData.js';

const TAU = Math.PI * 2;

export class MotionSystem {
  static enemyTransform(enemy, visualTime, effects = [], enabled = ENABLE_UNIT_MOTION) {
    if (!enabled) return { xOffset: 0, yOffset: 0, scale: 1, flash: false };
    const config = UNIT_MOTION_CONFIG.enemies[enemy.type];
    if (!config) return { xOffset: 0, yOffset: 0, scale: 1, flash: false };

    const yOffset = config.bobPixels ? Math.sin(visualTime * TAU * config.bobHz) * config.bobPixels : 0;
    let scale = config.idleScale
      ? 1 + config.idleScale * (0.5 + Math.sin(visualTime * TAU * config.idleHz) * 0.5)
      : 1;

    if (enemy.type === 'paoxiao') {
      const consume = effects.find(effect => effect.type === 'paoxiaoEnrage' && effect.life > 0);
      if (consume) {
        const elapsed = consume.duration - consume.life;
        if (elapsed >= 0 && elapsed <= config.consumeSeconds) {
          const pulse = Math.sin(Math.PI * elapsed / config.consumeSeconds);
          scale = Math.max(scale, 1 + config.consumeScale * pulse);
        }
      }
    }

    return { xOffset: 0, yOffset, scale, flash: enemy.visualHitFlash > 0 };
  }

  static towerTransform(tower, visualTime, effects = [], enabled = ENABLE_UNIT_MOTION) {
    if (!enabled) return { xOffset: 0, yOffset: 0, scale: 1 };
    const config = UNIT_MOTION_CONFIG.towers[tower.type];
    if (!config) return { xOffset: 0, yOffset: 0, scale: 1 };

    const scale = 1 + Math.sin(visualTime * TAU * config.idleHz) * config.idleScale;
    const recoil = effects.find(effect => (
      effect.type === 'towerRecoil' && effect.towerType === tower.type
      && effect.x === tower.x && effect.y === tower.y && effect.life > 0
    ));
    if (!recoil) return { xOffset: 0, yOffset: 0, scale };
    const strength = Math.max(0, recoil.life / recoil.duration);
    return {
      xOffset: -recoil.dx * config.recoilPixels * strength,
      yOffset: -recoil.dy * config.recoilPixels * strength,
      scale,
    };
  }

  static recoilEffect(tower, target, enabled = ENABLE_UNIT_MOTION) {
    const config = enabled ? UNIT_MOTION_CONFIG.towers[tower.type] : null;
    if (!config) return null;
    const dx = target.x - tower.x;
    const dy = target.y - tower.y;
    const length = Math.hypot(dx, dy) || 1;
    return {
      type: 'towerRecoil', towerType: tower.type, x: tower.x, y: tower.y,
      dx: dx / length, dy: dy / length,
      life: config.recoilSeconds, duration: config.recoilSeconds,
    };
  }

  static deathEffect(enemy, enabled = ENABLE_UNIT_MOTION) {
    const config = enabled ? UNIT_MOTION_CONFIG.enemies[enemy.type] : null;
    if (!config?.deathSeconds) return null;
    const next = enemy.map.positionAt(Math.min(enemy.map.totalLength, enemy.pathDistance + 1));
    return {
      type: 'unitDeath', unitType: enemy.type, x: enemy.x, y: enemy.y,
      mirror: next.x < enemy.x,
      life: config.deathSeconds, duration: config.deathSeconds,
    };
  }

  static deathTransform(effect) {
    const progress = Math.min(1, Math.max(0, 1 - effect.life / effect.duration));
    return {
      scale: 1 - (1 - UNIT_MOTION_CONFIG.deathEndScale) * progress,
      alpha: Math.max(0, effect.life / effect.duration),
    };
  }
}

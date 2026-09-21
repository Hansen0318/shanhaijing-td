import { ENABLE_UNIT_MOTION, UNIT_MOTION_CONFIG } from '../config/motionData.js?v=level7-1';

const TAU = Math.PI * 2;

export class MotionSystem {
  static enemyTransform(enemy, visualTime, effects = [], enabled = ENABLE_UNIT_MOTION) {
    if (!enabled) return { xOffset: 0, yOffset: 0, scale: 1, flash: false };
    const baseConfig = UNIT_MOTION_CONFIG.enemies[enemy.type];
    const config = baseConfig?.phases ? { ...baseConfig, ...baseConfig.phases[enemy.bossPhase ?? 1] } : baseConfig;
    if (!config) return { xOffset: 0, yOffset: 0, scale: 1, flash: false };

    let xOffset = config.stridePixels ? Math.sin(visualTime * TAU * config.strideHz) * config.stridePixels : 0;
    let yOffset = config.bobPixels ? Math.sin(visualTime * TAU * config.bobHz) * config.bobPixels : 0;
    let scale = config.idleScale
      ? 1 + config.idleScale * (0.5 + Math.sin(visualTime * TAU * config.idleHz) * 0.5)
      : 1;

    if (config.pulseEffect) {
      const pulseTypes = Array.isArray(config.pulseEffect) ? config.pulseEffect : [config.pulseEffect];
      const pulseEffect = effects.find(effect => pulseTypes.includes(effect.type) && effect.life > 0);
      if (pulseEffect) {
        const elapsed = pulseEffect.duration - pulseEffect.life;
        if (elapsed >= 0 && elapsed <= config.pulseSeconds) {
          const pulse = Math.sin(Math.PI * elapsed / config.pulseSeconds);
          scale = Math.max(scale, 1 + config.pulseScale * pulse);
        }
      }
    }

    if (enemy.visualHitFlash > 0 && config.hitRecoilPixels) {
      const hitProgress = 1 - enemy.visualHitFlash / UNIT_MOTION_CONFIG.hitFlashSeconds;
      xOffset -= Math.sin(Math.PI * Math.max(0, Math.min(1, hitProgress))) * config.hitRecoilPixels;
    }

    const matchingEffect = type => effects.find(effect => (
      effect.type === type && effect.life > 0
      && (effect.sourceId === enemy.id || (effect.sourceId == null && effect.x === enemy.x && effect.y === enemy.y))
    ));
    const skill = matchingEffect('jiuweihuSkill');
    if (skill && config.skillScale) {
      const progress = Math.max(0, Math.min(1, 1 - skill.life / skill.duration));
      if (progress < 0.35) scale = Math.max(scale, 1 + config.skillScale * progress / 0.35);
      else if (progress < 0.7) {
        const action = (progress - 0.35) / 0.35;
        scale = Math.max(scale, 1 + config.skillScale * (1 - action * 0.25));
        xOffset += 4 + Math.sin(action * Math.PI) * 3;
        yOffset -= 3;
      } else {
        const rebound = (progress - 0.7) / 0.3;
        scale = Math.max(scale, 1 + config.skillScale * 0.5 * (1 - rebound));
        xOffset -= Math.sin(rebound * Math.PI) * 3;
      }
    }

    const evolution = matchingEffect('jiuweihuEvolution');
    if (evolution && config.evolutionScale) {
      const progress = Math.max(0, Math.min(1, 1 - evolution.life / evolution.duration));
      const pulse = Math.sin(Math.PI * progress);
      scale = Math.max(scale, 1 + config.evolutionScale * pulse);
      yOffset -= 6 * pulse;
    }

    return { xOffset, yOffset, scale, flash: enemy.visualHitFlash > 0 };
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
    const next = enemy.map?.positionAt
      ? enemy.map.positionAt(Math.min(enemy.map.totalLength, enemy.pathDistance + 1))
      : { x: enemy.x, y: enemy.y };
    return {
      type: 'unitDeath', unitType: enemy.type, x: enemy.x, y: enemy.y,
      bossPhase: enemy.bossPhase,
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

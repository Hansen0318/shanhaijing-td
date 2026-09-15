import { StatusSystem } from '../systems/StatusSystem.js';
import { UNIT_MOTION_CONFIG } from '../config/motionData.js?v=level5-1';

let nextEnemyId = 1;
export class Enemy {
  constructor(type, data, map) {
    this.id = nextEnemyId++;
    this.type = type;
    this.data = data;
    this.map = map;
    this.maxHp = data.hp;
    this.hp = data.hp;
    this.baseDamage = data.baseDamage;
    this.reward = data.reward;
    this.radius = data.radius;
    this.isBoss = Boolean(data.isBoss);
    this.pathDistance = 0;
    this.alive = true;
    this.reachedBase = false;
    this.statuses = {};
    this.hitFlash = 0;
    this.visualHitFlash = 0;
    this.speedMultiplier = 1;
    this.frenzied = false;
    this.triggeredBossThresholds = new Set();
    this.enteredFogZones = new Set();
    this.spawnedIllusions = false;
    this.earthArmorLayers = data.earthArmorLayers ?? 0;
    this.chargeConsumed = false;
    this.chargeTelegraphRemaining = 0;
    this.chargeRemaining = 0;
    Object.assign(this, map.positionAt(0));
  }
  update(dt) {
    if (!this.alive) return null;
    StatusSystem.update(this, dt);
    if (!this.alive) return null;
    this.hitFlash = Math.max(0, this.hitFlash - dt);
    let chargeEvent = null;
    if (this.type === 'zhuyan' && !this.chargeConsumed && this.map.chargeCorridorAt(this)) {
      this.chargeConsumed = true;
      this.chargeTelegraphRemaining = 0.2;
      chargeEvent = { type: 'zhuyanChargeTelegraph', x: this.x, y: this.y, duration: 0.2 };
    }
    const fogZone = this.map.fogZoneAt(this);
    let fogEntry = null;
    if (this.type === 'meihu' && fogZone && !this.enteredFogZones.has(fogZone)) {
      this.enteredFogZones.add(fogZone);
      const weakened = Boolean(this.statuses.insight);
      this.statuses.fogSprint = {
        amount: weakened ? 0.15 : 0.3,
        remaining: 1.4,
      };
      fogEntry = { type: 'fogEntry', zoneId: fogZone, x: this.x, y: this.y, weakened };
    }
    const terrainMultiplier = this.map.isWeakWater(this)
      ? (this.data.weakWaterSpeedMultiplier ?? 0.85)
      : 1;
    const chargeMultiplier = this.chargeRemaining > 0 ? 1.65 : 1;
    this.pathDistance += this.data.speed * this.speedMultiplier * StatusSystem.speedMultiplier(this) * terrainMultiplier * chargeMultiplier * dt;
    Object.assign(this, this.map.positionAt(this.pathDistance));
    if (this.chargeTelegraphRemaining > 0) {
      this.chargeTelegraphRemaining = Math.max(0, this.chargeTelegraphRemaining - dt);
      if (this.chargeTelegraphRemaining === 0) {
        this.chargeRemaining = 0.6;
        chargeEvent = { type: 'zhuyanChargeStart', x: this.x, y: this.y, duration: 0.6 };
      }
    } else if (this.chargeRemaining > 0) {
      this.chargeRemaining = Math.max(0, this.chargeRemaining - dt);
    }
    if (this.pathDistance >= this.map.totalLength) { this.reachedBase = true; this.alive = false; }
    return chargeEvent ?? fogEntry;
  }
  shouldSpawnIllusions() {
    if (this.type !== 'huanli' || this.spawnedIllusions || !this.alive || this.hp > this.maxHp * 0.6) return false;
    this.spawnedIllusions = true;
    return true;
  }
  updateVisual(realDelta) { this.visualHitFlash = Math.max(0, this.visualHitFlash - realDelta); }
  takeDamage(amount) {
    if (!this.alive) return false;
    this.hp = Math.max(0, this.hp - amount);
    this.hitFlash = 0.8;
    if (UNIT_MOTION_CONFIG.enemies[this.type]) this.visualHitFlash = UNIT_MOTION_CONFIG.hitFlashSeconds;
    if (this.hp <= 0) this.alive = false;
    return true;
  }
  checkFrenzy() {
    const mechanic = this.data.bossMechanic;
    if (!this.isBoss || mechanic?.type !== 'frenzy' || this.frenzied || this.hp > this.maxHp * mechanic.threshold) return false;
    this.frenzied = true;
    this.speedMultiplier = mechanic.speedMultiplier;
    return true;
  }
}

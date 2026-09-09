import { StatusSystem } from '../systems/StatusSystem.js';

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
    this.speedMultiplier = 1;
    this.frenzied = false;
    this.triggeredBossThresholds = new Set();
    Object.assign(this, map.positionAt(0));
  }
  update(dt) {
    if (!this.alive) return;
    StatusSystem.update(this, dt);
    if (!this.alive) return;
    this.hitFlash = Math.max(0, this.hitFlash - dt);
    this.pathDistance += this.data.speed * this.speedMultiplier * StatusSystem.speedMultiplier(this) * dt;
    Object.assign(this, this.map.positionAt(this.pathDistance));
    if (this.pathDistance >= this.map.totalLength) { this.reachedBase = true; this.alive = false; }
  }
  takeDamage(amount) {
    if (!this.alive) return false;
    this.hp = Math.max(0, this.hp - amount);
    this.hitFlash = 0.8;
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

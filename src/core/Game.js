import { GAME_CONFIG, TOWER_DATA, ENEMY_DATA, BLESSING_DATA, getLevelData } from '../config/gameData.js';
import { GameTime } from './Time.js';
import { GameMap } from '../map/GameMap.js';
import { Enemy } from '../entities/Enemy.js';
import { Tower } from '../entities/Tower.js';
import { Projectile } from '../entities/Projectile.js';
import { Economy } from '../systems/Economy.js';
import { CombatSystem } from '../systems/CombatSystem.js';
import { BlessingSystem } from '../systems/BlessingSystem.js';
import { WaveManager } from '../systems/WaveManager.js';
import { BossSystem } from '../systems/BossSystem.js';

const PLAYABLE_STATES = new Set(['preparation', 'combat']);

export class Game {
  constructor(random = Math.random, initialLevelId = 1) { this.random = random; this.resetRun(initialLevelId); }
  resetRun(levelId = this.levelId ?? 1) {
    const level = getLevelData(levelId);
    if (!level) return false;
    this.levelId = level.id;
    this.level = level;
    this.time = new GameTime();
    this.map = new GameMap(level.map);
    this.economy = new Economy(GAME_CONFIG.initialGold);
    this.blessings = new BlessingSystem(BLESSING_DATA, this.random);
    this.wave = new WaveManager(level.waves);
    this.baseHp = GAME_CONFIG.baseHp;
    this.state = 'preparation';
    this.previousState = null;
    this.enemies = [];
    this.towers = Array(level.map.slots.length).fill(null);
    this.projectiles = [];
    this.effects = [];
    this.currentChoices = [];
    this.pendingSellSlot = null;
    this.selectedSlot = null;
    this.banner = '';
    this.bannerTimer = 0;
    this.bannerQueue = [];
    this.stats = { kills: 0, built: 0 };
    this.time.setPaused(true);
    return true;
  }
  restart() { return this.resetRun(this.levelId); }
  enterLevel(levelId) {
    if (this.state !== 'victory' || this.levelId !== 1 || levelId !== 2) return false;
    return this.resetRun(levelId);
  }
  canManageTowers() { return PLAYABLE_STATES.has(this.state); }
  buildTower(slotIndex, type) {
    const data = TOWER_DATA[type];
    if (!this.canManageTowers() || !data || this.towers[slotIndex] || !this.level.map.slots[slotIndex]) return { ok: false };
    if (!this.economy.spend(data.cost)) return { ok: false, reason: 'gold' };
    this.towers[slotIndex] = new Tower(type, data, this.level.map.slots[slotIndex]);
    this.stats.built += 1;
    this.pendingSellSlot = null;
    return { ok: true };
  }
  upgradeTower(slotIndex) {
    const tower = this.towers[slotIndex];
    if (!this.canManageTowers() || !tower || tower.level >= 3) return { ok: false };
    const cost = Economy.upgradeCost(tower.data, tower.level);
    if (!this.economy.spend(cost)) return { ok: false, reason: 'gold' };
    tower.level += 1;
    tower.invested += cost;
    this.pendingSellSlot = null;
    return { ok: true };
  }
  sellTower(slotIndex) {
    const tower = this.towers[slotIndex];
    if (!this.canManageTowers() || !tower) return { ok: false };
    if (this.pendingSellSlot !== slotIndex) { this.pendingSellSlot = slotIndex; return { ok: false, confirm: true }; }
    const value = Economy.sellValue(tower.invested);
    this.economy.add(value);
    this.towers[slotIndex] = null;
    this.pendingSellSlot = null;
    this.selectedSlot = null;
    return { ok: true, value };
  }
  cancelSell() { this.pendingSellSlot = null; }
  startWaveNow() {
    if (this.state !== 'preparation') return false;
    const next = this.wave.waveNumber + 1;
    if (next > this.level.waves.length) return false;
    if (next === 10) this.queueBanner('BOSS 警告', GAME_CONFIG.bossBannerSeconds);
    this.wave.start(next);
    this.state = 'combat';
    this.time.setPaused(false);
    return true;
  }
  setTimeScale(scale) { this.time.setScale(scale); return this.time.scale; }
  togglePause() {
    if (['victory', 'defeat', 'blessing'].includes(this.state)) return false;
    if (this.state === 'paused') {
      this.state = this.previousState;
      this.previousState = null;
      this.time.setPaused(this.state === 'preparation');
    } else {
      this.previousState = this.state;
      this.state = 'paused';
      this.time.setPaused(true);
    }
    return true;
  }
  selectBlessing(id) {
    if (this.state !== 'blessing' || !this.currentChoices.some(choice => choice.id === id) || !this.blessings.select(id)) return false;
    this.currentChoices = [];
    this.state = 'preparation';
    this.time.setPaused(true);
    return true;
  }
  damageBase(amount) {
    this.baseHp = Math.max(0, this.baseHp - amount);
    if (this.baseHp <= 0) this.end('defeat');
  }
  end(state) { this.state = state; this.time.setPaused(true); this.pendingSellSlot = null; }
  queueBanner(text, duration) {
    if (this.bannerTimer <= 0) {
      this.banner = text;
      this.bannerTimer = duration;
      return;
    }
    this.bannerQueue.push({ text, duration });
  }
  advanceBanner(realDelta) {
    let remaining = realDelta;
    while (this.bannerTimer > 0 && remaining >= this.bannerTimer) {
      remaining -= this.bannerTimer;
      const next = this.bannerQueue.shift();
      if (!next) { this.banner = ''; this.bannerTimer = 0; return; }
      this.banner = next.text;
      this.bannerTimer = next.duration;
    }
    this.bannerTimer = Math.max(0, this.bannerTimer - remaining);
    if (this.bannerTimer <= 0 && this.bannerQueue.length) {
      const next = this.bannerQueue.shift();
      this.banner = next.text;
      this.bannerTimer = next.duration;
    }
  }
  spawnEnemy(type) {
    const baseData = ENEMY_DATA[type];
    if (!baseData) return;
    const waveData = this.level.waves[this.wave.waveNumber - 1];
    const hpMultiplier = baseData.isBoss
      ? (waveData?.bossHpMultiplier ?? waveData?.hpMultiplier ?? 1)
      : (waveData?.hpMultiplier ?? 1);
    const enemyData = hpMultiplier === 1
      ? baseData
      : { ...baseData, hp: Math.round(baseData.hp * hpMultiplier) };
    this.enemies.push(new Enemy(type, enemyData, this.map));
    if (baseData.isBoss) this.queueBanner(`${baseData.name}現身`, 1.1);
  }
  onEnemyKilled(enemy) {
    if (enemy.rewarded) return;
    enemy.rewarded = true;
    this.stats.kills += 1;
    const reward = this.economy.reward(enemy.reward, 1 + (this.blessings.modifiers.goldReward ?? 0));
    if (reward > 0) this.effects.push({ type: 'gold', x: enemy.x, y: enemy.y, amount: reward, life: 0.9, duration: 0.9 });
    if (enemy.isBoss || enemy.type === this.level.bossType) this.end('victory');
  }
  update(realDelta) {
    this.advanceBanner(realDelta);
    this.effects.forEach(effect => { effect.life -= realDelta; });
    this.effects = this.effects.filter(effect => effect.life > 0);
    if (this.state === 'preparation') return;
    if (this.state !== 'combat') return;
    const dt = this.time.step(realDelta);
    this.wave.update(dt, type => this.spawnEnemy(type));
    this.enemies.forEach(enemy => enemy.update(dt));
    this.updateTowers(dt);
    this.projectiles.forEach(projectile => projectile.update(dt, this.enemies));
    this.projectiles = this.projectiles.filter(projectile => projectile.alive);
    this.enemies.forEach(enemy => {
      for (const event of BossSystem.check(enemy)) this.handleBossEvent(enemy, event);
      if (!enemy.alive && !enemy.processed) {
        enemy.processed = true;
        if (enemy.reachedBase) this.damageBase(enemy.baseDamage); else this.onEnemyKilled(enemy);
        this.wave.enemyRemoved();
      }
    });
    this.enemies = this.enemies.filter(enemy => !enemy.processed);
    if (this.state === 'combat' && this.wave.isComplete()) this.completeWave();
  }
  handleBossEvent(enemy, event) {
    if (event.type === 'frenzy') {
      this.queueBanner(`${enemy.data.name}進入狂暴！`, 1.4);
      return;
    }
    if (event.type !== 'consume') return;
    this.queueBanner('狍鴞吞噬妖氣！', 1.4);
    this.effects.push({ type: 'paoxiaoEnrage', x: enemy.x, y: enemy.y, life: 0.8, duration: 0.8 });
    if (event.threshold === 0.7) {
      this.effects.push({ type: 'paoxiaoProjectile', from: { x: enemy.x + 90, y: enemy.y - 45 }, to: { x: enemy.x, y: enemy.y }, life: 0.48, duration: 0.48 });
      this.effects.push({ type: 'paoxiaoExplosion', x: enemy.x, y: enemy.y, life: 0.55, duration: 0.55 });
    } else {
      this.effects.push({ type: 'paoxiaoGroundslam', x: enemy.x, y: enemy.y, life: 0.7, duration: 0.7 });
    }
  }
  updateTowers(dt) {
    for (const tower of this.towers) {
      if (!tower) continue;
      tower.cooldown -= dt;
      if (tower.cooldown > 0) continue;
      const stats = tower.getStats(this.blessings.modifiers);
      const target = CombatSystem.acquireTarget(tower, this.enemies, stats.range);
      if (!target) continue;
      tower.cooldown += stats.interval;
      if (tower.type === 'yinglong') {
        const hit = CombatSystem.penetrate(this.enemies, stats.penetration, stats.damage, { slowedVulnerability: this.blessings.modifiers.slowedVulnerability, bossBonus: stats.bossBonus }, tower, stats.range);
        this.effects.push({
          type: 'beam',
          points: [{ x: tower.x, y: tower.y }, ...hit.map(item => ({ x: item.x, y: item.y }))],
          hitCount: hit.length,
          life: 0.2,
          duration: 0.2,
        });
      } else this.projectiles.push(new Projectile(tower, target, stats, this.blessings.modifiers, this.effects));
    }
  }
  completeWave() {
    const number = this.wave.waveNumber;
    if (number >= this.level.waves.length) return;
    this.wave.finish();
    this.currentChoices = this.blessings.drawChoices([...new Set(this.towers.filter(Boolean).map(tower => tower.type))]);
    this.state = 'blessing';
    this.time.setPaused(true);
  }
}

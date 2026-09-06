import { GAME_CONFIG, TOWER_DATA, ENEMY_DATA, WAVE_DATA, BLESSING_DATA, MAP_DATA } from '../config/gameData.js';
import { GameTime } from './Time.js';
import { GameMap } from '../map/GameMap.js';
import { Enemy } from '../entities/Enemy.js';
import { Tower } from '../entities/Tower.js';
import { Projectile } from '../entities/Projectile.js';
import { Economy } from '../systems/Economy.js';
import { CombatSystem } from '../systems/CombatSystem.js';
import { BlessingSystem } from '../systems/BlessingSystem.js';
import { WaveManager } from '../systems/WaveManager.js';

const PLAYABLE_STATES = new Set(['preparation', 'combat']);

export class Game {
  constructor(random = Math.random) { this.random = random; this.resetRun(); }
  resetRun() {
    this.time = new GameTime();
    this.map = new GameMap(MAP_DATA);
    this.economy = new Economy(GAME_CONFIG.initialGold);
    this.blessings = new BlessingSystem(BLESSING_DATA, this.random);
    this.wave = new WaveManager(WAVE_DATA);
    this.baseHp = GAME_CONFIG.baseHp;
    this.state = 'preparation';
    this.previousState = null;
    this.enemies = [];
    this.towers = Array(MAP_DATA.slots.length).fill(null);
    this.projectiles = [];
    this.effects = [];
    this.currentChoices = [];
    this.pendingSellSlot = null;
    this.selectedSlot = null;
    this.banner = '';
    this.bannerTimer = 0;
    this.stats = { kills: 0, built: 0 };
    this.time.setPaused(true);
  }
  restart() { this.resetRun(); return true; }
  canManageTowers() { return PLAYABLE_STATES.has(this.state); }
  buildTower(slotIndex, type) {
    const data = TOWER_DATA[type];
    if (!this.canManageTowers() || !data || this.towers[slotIndex] || !MAP_DATA.slots[slotIndex]) return { ok: false };
    if (!this.economy.spend(data.cost)) return { ok: false, reason: 'gold' };
    this.towers[slotIndex] = new Tower(type, data, MAP_DATA.slots[slotIndex]);
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
    if (next > GAME_CONFIG.totalWaves) return false;
    if (next === 10) { this.banner = 'BOSS\n窮奇'; this.bannerTimer = GAME_CONFIG.bossBannerSeconds; }
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
  spawnEnemy(type) { this.enemies.push(new Enemy(type, ENEMY_DATA[type], this.map)); }
  onEnemyKilled(enemy) {
    if (enemy.rewarded) return;
    enemy.rewarded = true;
    this.stats.kills += 1;
    this.economy.reward(enemy.reward, 1 + (this.blessings.modifiers.goldReward ?? 0));
    if (enemy.type === 'qiongqi') this.end('victory');
  }
  update(realDelta) {
    this.bannerTimer = Math.max(0, this.bannerTimer - realDelta);
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
      if (enemy.alive && enemy.checkFrenzy()) { this.banner = '窮奇進入狂暴！'; this.bannerTimer = 1.4; }
      if (!enemy.alive && !enemy.processed) {
        enemy.processed = true;
        if (enemy.reachedBase) this.damageBase(enemy.baseDamage); else this.onEnemyKilled(enemy);
        this.wave.enemyRemoved();
      }
    });
    this.enemies = this.enemies.filter(enemy => !enemy.processed);
    if (this.state === 'combat' && this.wave.isComplete()) this.completeWave();
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
        this.effects.push({ type: 'beam', x1: tower.x, y1: tower.y, targets: hit.map(item => ({ x: item.x, y: item.y })), life: 0.14 });
      } else this.projectiles.push(new Projectile(tower, target, stats, this.blessings.modifiers));
    }
  }
  completeWave() {
    const number = this.wave.waveNumber;
    this.wave.finish();
    if (number >= 10) { if (this.state !== 'victory') this.end('victory'); return; }
    this.currentChoices = this.blessings.drawChoices([...new Set(this.towers.filter(Boolean).map(tower => tower.type))]);
    this.state = 'blessing';
    this.time.setPaused(true);
  }
}
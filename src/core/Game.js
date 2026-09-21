import { GAME_CONFIG, TOWER_DATA, ENEMY_DATA, BLESSING_DATA, getLevelData } from '../config/gameData.js?v=level7-mapfix-1';
import { LEVEL4_BAIZE_BLESSINGS } from '../config/level4Blessings.js?v=blessing-fix-1';
import { GameTime } from './Time.js';
import { GameMap } from '../map/GameMap.js';
import { Enemy } from '../entities/Enemy.js?v=fog-visual-1';
import { Illusion } from '../entities/Illusion.js';
import { Tower } from '../entities/Tower.js?v=blessing-fix-1&tower-facing=1';
import { Projectile } from '../entities/Projectile.js';
import { Economy } from '../systems/Economy.js';
import { CombatSystem } from '../systems/CombatSystem.js';
import { BlessingSystem } from '../systems/BlessingSystem.js?v=blessing-fix-1';
import { WaveManager } from '../systems/WaveManager.js?v=level7-1';
import { BossSystem } from '../systems/BossSystem.js';
import { StatusSystem } from '../systems/StatusSystem.js';
import { isValidLineup, normalizeLineup } from '../systems/LineupSystem.js';
import { UNLOCK_BY_LEVEL, nextPlayableLevelId, ownedRosterThrough } from '../config/progressionData.js';
import { MotionSystem } from '../systems/MotionSystem.js?v=level7-1';
import { ENABLE_UNIT_MOTION } from '../config/motionData.js?v=level7-1';
import { minimumEnemyPathSpacing } from '../config/enemyVisuals.js?v=level7-1';
import { SunlightSystem } from '../systems/SunlightSystem.js';
import { ThunderSystem } from '../systems/ThunderSystem.js';
import { JumangSupportSystem } from '../systems/JumangSupportSystem.js';

const PLAYABLE_STATES = new Set(['preparation', 'combat']);

export class Game {
  constructor(random = Math.random, initialLevelId = 1, { motionEnabled = ENABLE_UNIT_MOTION } = {}) {
    this.random = random;
    this.motionEnabled = motionEnabled;
    this.unlockedBeasts = new Set(ownedRosterThrough(initialLevelId - 1));
    this.lineupNewType = null;
    this.resetRun(initialLevelId);
  }
  resetRun(levelId = this.levelId ?? 1) {
    const level = getLevelData(levelId);
    if (!level) return false;
    this.levelId = level.id;
    this.level = level;
    this.lineupNewType = null;
    this.time = new GameTime();
    this.map = new GameMap(level.map);
    this.economy = new Economy(GAME_CONFIG.initialGold);
    const blessingData = level.id >= 4 ? [...BLESSING_DATA, ...LEVEL4_BAIZE_BLESSINGS] : BLESSING_DATA;
    this.blessings = new BlessingSystem(blessingData, this.random);
    this.wave = new WaveManager(level.waves);
    this.baseHp = GAME_CONFIG.baseHp;
    this.lineupSelection = [];
    this.pendingUnlock = null;
    this.state = level.id >= 4 ? 'lineup' : 'preparation';
    this.previousState = null;
    this.enemies = [];
    this.illusions = [];
    this.towers = Array(level.map.slots.length).fill(null);
    this.projectiles = [];
    this.effects = [];
    this.visualTime = 0;
    this.currentChoices = [];
    this.pendingSellSlot = null;
    this.selectedSlot = null;
    this.banner = '';
    this.bannerArtId = '';
    this.bannerTimer = 0;
    this.bannerQueue = [];
    this.stats = { kills: 0, built: 0 };
    this.levelBossDefeated = false;
    this.sunlight = { elapsed: 0, phase2: false, activeZoneIds: ['A'] };
    this.thunder = ThunderSystem.reset();
    this.time.setPaused(true);
    return true;
  }
  restart() { return this.resetRun(this.levelId); }
  nextLevelId() { return nextPlayableLevelId(this.levelId); }
  lineupRoster() {
    return [...this.unlockedBeasts].filter(type => Boolean(TOWER_DATA[type]));
  }
  enterLevel(levelId) {
    if (this.state !== 'victory' || levelId !== this.nextLevelId() || !getLevelData(levelId)) return false;
    const newlyUnlockedType = this.pendingUnlock;
    const entered = this.resetRun(levelId);
    if (entered) this.lineupNewType = newlyUnlockedType;
    return entered;
  }
  beginLevelFourLineup() {
    if (this.levelId !== 4) return false;
    this.lineupSelection = [];
    this.state = 'lineup';
    this.time.setPaused(true);
    return true;
  }
  toggleLineup(type) {
    const roster = this.lineupRoster();
    if (this.levelId < 4 || this.state !== 'lineup' || !roster.includes(type)) return false;
    if (this.lineupSelection.includes(type)) {
      this.lineupSelection = this.lineupSelection.filter(item => item !== type);
      return true;
    }
    if (this.lineupSelection.length >= 3) return false;
    this.lineupSelection = normalizeLineup([...this.lineupSelection, type], roster);
    return true;
  }
  confirmLineup() {
    if (this.levelId < 4 || this.state !== 'lineup' || !isValidLineup(this.lineupSelection, this.lineupRoster())) return false;
    this.state = 'preparation';
    this.time.setPaused(true);
    return true;
  }
  availableTowerTypes() {
    return this.levelId >= 4 ? [...this.lineupSelection] : ['bifang', 'fuzhu', 'yinglong'];
  }
  canManageTowers() { return PLAYABLE_STATES.has(this.state); }
  teamIntervalMultiplier() {
    return JumangSupportSystem.intervalMultiplier(this.towers, this.blessings.modifiers);
  }
  buildTower(slotIndex, type) {
    const data = TOWER_DATA[type];
    if (!this.canManageTowers() || !this.availableTowerTypes().includes(type) || !data || this.towers[slotIndex] || !this.level.map.slots[slotIndex]) return { ok: false };
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
    if (next === 10) this.queueBanner('BOSS 警告', GAME_CONFIG.bossBannerSeconds, this.levelId === 5 ? 'level5BossWarning' : '');
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
  end(state) {
    this.state = state;
    const unlock = state === 'victory' ? UNLOCK_BY_LEVEL[this.levelId] : null;
    this.pendingUnlock = unlock && !this.unlockedBeasts.has(unlock) ? unlock : null;
    if (this.pendingUnlock) this.unlockedBeasts.add(this.pendingUnlock);
    this.time.setPaused(true);
    this.pendingSellSlot = null;
  }
  queueBanner(text, duration, artId = '') {
    if (this.bannerTimer <= 0) {
      this.banner = text;
      this.bannerArtId = artId;
      this.bannerTimer = duration;
      return;
    }
    this.bannerQueue.push({ text, duration, artId });
  }
  advanceBanner(realDelta) {
    let remaining = realDelta;
    while (this.bannerTimer > 0 && remaining >= this.bannerTimer) {
      remaining -= this.bannerTimer;
      const next = this.bannerQueue.shift();
      if (!next) { this.banner = ''; this.bannerArtId = ''; this.bannerTimer = 0; return; }
      this.banner = next.text;
      this.bannerArtId = next.artId ?? '';
      this.bannerTimer = next.duration;
    }
    this.bannerTimer = Math.max(0, this.bannerTimer - remaining);
    if (this.bannerTimer <= 0 && this.bannerQueue.length) {
      const next = this.bannerQueue.shift();
      this.banner = next.text;
      this.bannerArtId = next.artId ?? '';
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
    const enemy = new Enemy(type, enemyData, this.map);
    this.enemies.push(enemy);
    if (baseData.isBoss) this.queueBanner(`Boss現身：${baseData.name}`, 1.1);
    return enemy;
  }
  canSpawnEnemy(type) {
    const nearest = this.enemies
      .filter(enemy => enemy.alive)
      .reduce((candidate, enemy) => (
        !candidate || enemy.pathDistance < candidate.pathDistance ? enemy : candidate
    ), null);
    if (!nearest) return true;
    return nearest.pathDistance >= minimumEnemyPathSpacing(nearest.type, type);
  }
  spawnIllusions(source, count = 2, duration = source.statuses.insight ? 0.8 : 1.6) {
    const offsets = [{ x: -15, y: -8 }, { x: 15, y: 8 }, { x: 0, y: -18 }];
    const created = offsets.slice(0, count).map(offset => new Illusion(source, offset, duration));
    this.illusions.push(...created);
    return created;
  }
  onEnemyKilled(enemy) {
    if (enemy.rewarded) return;
    enemy.rewarded = true;
    const deathEffect = MotionSystem.deathEffect(enemy, this.motionEnabled);
    if (deathEffect) this.effects.push(deathEffect);
    this.stats.kills += 1;
    const reward = this.economy.reward(enemy.reward, 1 + (this.blessings.modifiers.goldReward ?? 0));
    if (reward > 0) this.effects.push({ type: 'gold', x: enemy.x, y: enemy.y, amount: reward, life: 0.9, duration: 0.9 });
    if (enemy.isBoss || enemy.type === this.level.bossType) {
      if (this.level.bossVictoryRequiresWaveClear) this.levelBossDefeated = true;
      else this.end('victory');
    }
  }
  update(realDelta) {
    this.advanceBanner(realDelta);
    this.effects.forEach(effect => { effect.life -= realDelta; });
    this.effects = this.effects.filter(effect => effect.life > 0);
    if (this.motionEnabled) {
      this.visualTime += realDelta;
      this.enemies.forEach(enemy => enemy.updateVisual(realDelta));
    }
    if (this.state === 'preparation') return;
    if (this.state !== 'combat') return;
    const dt = this.time.step(realDelta);
    this.wave.update(dt, type => this.spawnEnemy(type), type => this.canSpawnEnemy(type));
    SunlightSystem.update(this, dt);
    this.enemies.forEach(enemy => {
      if (!enemy.alive && enemy.reachedBase && enemy.baseArrivalRemaining > 0) {
        enemy.updateBaseArrival(dt);
        return;
      }
      const event = enemy.update(dt);
      if (event?.type === 'fogEntry') {
        this.effects.push({
          ...event,
          sourceId: enemy.id,
          unitType: enemy.type,
          life: 0.4,
          duration: 0.4,
        });
      }
      if (event?.type === 'zhuyanChargeTelegraph' || event?.type === 'zhuyanChargeStart') {
        this.effects.push({
          type: 'zhuyanCharge', sourceId: enemy.id, x: event.x, y: event.y,
          stage: event.type === 'zhuyanChargeStart' ? 'charge' : 'telegraph',
          life: event.duration, duration: event.duration,
        });
      }
    });
    ThunderSystem.update(this, dt);
    SunlightSystem.update(this, 0);
    this.enemies.forEach(enemy => { if (enemy.shouldSpawnIllusions()) this.spawnIllusions(enemy); });
    this.illusions.forEach(illusion => illusion.update(dt));
    this.updateTowers(dt);
    this.projectiles.forEach(projectile => projectile.update(dt, [...this.enemies, ...this.illusions]));
    this.enemies.filter(enemy => enemy.armorBreakEffectPending).forEach(enemy => {
      enemy.armorBreakEffectPending = false;
      this.effects.push({ type: 'liliArmorBreak', x: enemy.x, y: enemy.y, life: 0.45, duration: 0.45 });
    });
    this.enemies.filter(enemy => enemy.sunlightArmorBreakPending).forEach(enemy => {
      enemy.sunlightArmorBreakPending = false;
      this.effects.push({ type: 'yangmuArmorBreak', x: enemy.x, y: enemy.y, life: 0.45, duration: 0.45 });
    });
    this.projectiles = this.projectiles.filter(projectile => projectile.alive);
    this.illusions = this.illusions.filter(illusion => illusion.alive);
    this.enemies.forEach(enemy => {
      const bossContext = { inFog: Boolean(this.map.fogZoneAt(enemy)), insightActive: Boolean(enemy.statuses.insight) };
      for (const event of BossSystem.update(enemy, dt, bossContext)) this.handleBossEvent(enemy, event);
      if (!enemy.alive && !enemy.processed) {
        if (enemy.reachedBase && enemy.baseArrivalRemaining > 0) return;
        enemy.processed = true;
        if (enemy.reachedBase) this.damageBase(enemy.baseDamage); else this.onEnemyKilled(enemy);
        this.wave.enemyRemoved();
      }
    });
    this.enemies = this.enemies.filter(enemy => !enemy.processed);
    if (this.state === 'combat' && this.wave.isComplete()) this.completeWave();
  }
  handleBossEvent(enemy, event) {
    if (event.type === 'kuiPhase2') {
      this.thunder = ThunderSystem.reset({ phase2: true });
      this.effects.push({ type: 'kuiPhase2', sourceId: enemy.id, x: enemy.x, y: enemy.y, life: event.duration, duration: event.duration });
      return;
    }
    if (event.type === 'jinwuPhase2') {
      this.sunlight.phase2 = true;
      this.effects.push({ type: 'jinwuPhase2', sourceId: enemy.id, x: enemy.x, y: enemy.y, life: event.duration, duration: event.duration });
      return;
    }
    if (event.type === 'xingtianEvolution') {
      this.effects.push({ type: 'xingtianEvolution', sourceId: enemy.id, x: enemy.x, y: enemy.y, life: 0.7, duration: 0.7 });
      return;
    }
    if (event.type === 'xingtianShield') {
      this.effects.push({ type: 'xingtianShield', sourceId: enemy.id, x: enemy.x, y: enemy.y, life: event.duration, duration: event.duration });
      return;
    }
    if (event.type === 'xingtianEarthquakeCharge') {
      this.effects.push({ type: 'xingtianEarthquakeWindup', sourceId: enemy.id, x: enemy.x, y: enemy.y, life: event.duration, duration: event.duration });
      return;
    }
    if (event.type === 'xingtianEarthquakeRelease') {
      const towers = this.towers.filter(Boolean).filter(tower => Math.hypot(tower.x - enemy.x, tower.y - enemy.y) <= event.radius);
      towers.sort((a, b) => Math.hypot(a.x - enemy.x, a.y - enemy.y) - Math.hypot(b.x - enemy.x, b.y - enemy.y));
      if (towers[0]) towers[0].stunRemaining = Math.max(towers[0].stunRemaining, event.stunDuration);
      this.effects.push({ type: 'xingtianEarthquake', sourceId: enemy.id, x: enemy.x, y: enemy.y, radius: event.radius, life: 0.65, duration: 0.65 });
      return;
    }
    if (event.type === 'bossEvolution') {
      this.effects.push({ type: 'jiuweihuEvolution', sourceId: enemy.id, x: enemy.x, y: enemy.y, phase: event.phase, life: event.duration, duration: event.duration });
      return;
    }
    if (event.type === 'bossIllusions') {
      this.spawnIllusions(enemy, event.count, event.duration);
      this.effects.push({ type: 'jiuweihuSkill', sourceId: enemy.id, x: enemy.x, y: enemy.y, skill: 'illusions', life: 0.65, duration: 0.65 });
      return;
    }
    if (event.type === 'bossShield' || event.type === 'bossStep') {
      this.effects.push({ type: 'jiuweihuSkill', sourceId: enemy.id, x: enemy.x, y: enemy.y, skill: event.type, life: event.duration, duration: event.duration });
      return;
    }
    if (event.type === 'bossUltimateCharge') {
      this.effects.push({ type: 'jiuweihuSkill', sourceId: enemy.id, x: enemy.x, y: enemy.y, skill: 'ultimateCharge', life: event.duration, duration: event.duration });
      return;
    }
    if (event.type === 'bossUltimateRelease') {
      this.effects.push({ type: 'jiuweihuUltimate', x: enemy.x, y: enemy.y, life: event.duration, duration: event.duration });
      return;
    }
    if (event.type === 'frenzy') {
      this.queueBanner(`${enemy.data.name} 狂暴化！`, 1.4);
      const type = enemy.type === 'xiangliu' ? 'xiangliuEnragePulse' : 'qiongqiFrenzyPulse';
      this.effects.push({ type, x: enemy.x, y: enemy.y, life: 0.32, duration: 0.32 });
      return;
    }
    if (event.type === 'heal') {
      this.queueBanner(`${enemy.data.name}汲取弱水！`, 1.4);
      this.effects.push({ type: 'xiangliuHealPulse', x: enemy.x, y: enemy.y, life: 1.2, duration: 1.2 });
      this.effects.push({ type: 'bossHealText', x: enemy.x, y: enemy.y, amount: event.healAmount, life: 1.2, duration: 1.2 });
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
    const targets = [...this.enemies, ...this.illusions];
    const intervalMultiplier = this.teamIntervalMultiplier();
    for (const tower of this.towers) {
      if (!tower) continue;
      let activeDt = dt;
      if (tower.stunRemaining > 0) {
        const pausedDt = Math.min(activeDt, tower.stunRemaining);
        tower.stunRemaining -= pausedDt;
        activeDt -= pausedDt;
        if (activeDt <= 0) continue;
      }
      tower.cooldown -= activeDt;
      if (tower.cooldown > 0) continue;
      const stats = tower.getStats(this.blessings.modifiers, intervalMultiplier);
      const target = CombatSystem.acquireTarget(tower, targets, stats.range, { preferReal: tower.type === 'baize' });
      if (!target) continue;
      tower.faceTarget(target.x);
      tower.cooldown += stats.interval;
      const recoil = MotionSystem.recoilEffect(tower, target, this.motionEnabled);
      if (recoil) this.effects.push(recoil);
      if (tower.type === 'baize') {
        CombatSystem.hit(target, stats.damage, { slowedVulnerability: this.blessings.modifiers.slowedVulnerability });
        StatusSystem.applyInsight(target, stats);
        if (!target.isIllusion) {
          this.illusions.filter(illusion => illusion.sourceId === target.id).forEach(illusion => {
            illusion.life = Math.min(illusion.life, stats.illusionRevealDuration);
            illusion.duration = Math.min(illusion.duration, stats.illusionRevealDuration);
          });
        }
        this.effects.push({ type: 'baizeInsight', from: { x: tower.x, y: tower.y }, to: { x: target.x, y: target.y }, life: 0.35, duration: 0.35 });
      } else if (tower.type === 'yinglong') {
        const hit = CombatSystem.penetrate(targets, stats.penetration, stats.damage, { slowedVulnerability: this.blessings.modifiers.slowedVulnerability, bossBonus: stats.bossBonus }, tower, stats.range);
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
    if (number >= this.level.waves.length) {
      if (this.level.bossVictoryRequiresWaveClear && this.levelBossDefeated && this.wave.isComplete()) this.end('victory');
      return;
    }
    this.wave.finish();
    const deployedTypes = [...new Set(this.towers.filter(Boolean).map(tower => tower.type))];
    const allowedTowerTypes = this.levelId >= 4 ? this.lineupSelection : null;
    this.currentChoices = this.blessings.drawChoices(deployedTypes, allowedTowerTypes);
    this.state = 'blessing';
    this.time.setPaused(true);
  }
}

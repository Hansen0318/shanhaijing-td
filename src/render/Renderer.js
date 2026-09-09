import { MAP_DATA, TOWER_DATA, ENEMY_DATA } from '../config/gameData.js';
import { ArtStore } from '../config/artAssets.js';
import { ENABLE_UNIT_MOTION, UNIT_MOTION_CONFIG } from '../config/motionData.js?v=motion-lite-2';
import { MotionSystem } from '../systems/MotionSystem.js?v=motion-lite-2';

const TOWER_BOXES = Object.freeze({ bifang: [54, 58], fuzhu: [48, 58], yinglong: [56, 54] });
const ENEMY_BOXES = Object.freeze({ minion: [36, 38], swift: [36, 36], giant: [48, 48], qiongqi: [68, 68], chiyu: [38, 42], yanjia: [50, 50], paoxiao: [72, 72] });

export class Renderer {
  constructor(canvas, art = new ArtStore(), { motionEnabled = ENABLE_UNIT_MOTION } = {}) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.art = art;
    this.motionEnabled = motionEnabled;
    this.resize();
    addEventListener('resize', () => this.resize());
  }
  resize() {
    const ratio = Math.min(devicePixelRatio || 1, 2);
    this.canvas.width = MAP_DATA.width * ratio;
    this.canvas.height = MAP_DATA.height * ratio;
    this.ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  }
  pointFromEvent(event) {
    const rect = this.canvas.getBoundingClientRect();
    return { x: (event.clientX - rect.left) * MAP_DATA.width / rect.width, y: (event.clientY - rect.top) * MAP_DATA.height / rect.height };
  }
  prepareLevel(levelId) { return this.art.ensureLevel(levelId); }
  render(game) {
    const ctx = this.ctx;
    const map = game.level.map;
    ctx.clearRect(0, 0, map.width, map.height);
    this.drawBackground(ctx, game);
    this.drawSlots(ctx, game);
    this.drawMapProps(ctx, game);
    this.drawTowers(ctx, game);
    this.drawEnemies(ctx, game);
    this.drawProjectiles(ctx, game);
    this.drawEffects(ctx, game);
    this.drawLabels(ctx, game);
  }
  drawBackground(ctx, game) {
    const { map, art } = game.level;
    const image = this.art.get(art.background);
    if (image) {
      const crop = art.backgroundCrop;
      ctx.drawImage(image, crop.x, crop.y, crop.width, crop.height, 0, 0, map.width, map.height);
      return;
    }
    ctx.fillStyle = '#17231d'; ctx.fillRect(0, 0, map.width, map.height);
    this.drawGrid(ctx, map);
    this.drawPath(ctx, map);
  }
  drawContained(ctx, id, x, y, boxWidth, boxHeight, { anchorY = 0.5, mirror = false, rotation = 0, alpha = 1, scale: visualScale = 1, filter = 'none' } = {}) {
    const image = this.art.get(id);
    if (!image) return false;
    const scale = Math.min(boxWidth / image.naturalWidth, boxHeight / image.naturalHeight);
    const width = image.naturalWidth * scale;
    const height = image.naturalHeight * scale;
    ctx.save();
    ctx.translate(x, y);
    if (rotation) ctx.rotate(rotation);
    if (mirror || visualScale !== 1) ctx.scale(mirror ? -visualScale : visualScale, visualScale);
    ctx.globalAlpha = alpha;
    ctx.filter = filter;
    ctx.drawImage(image, -width / 2, -height * anchorY, width, height);
    ctx.restore();
    return true;
  }
  drawDirectional(ctx, id, start, end, width, alpha = 1) {
    const image = this.art.get(id);
    if (!image) return false;
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const length = Math.hypot(dx, dy);
    if (length <= 0) return false;
    ctx.save();
    ctx.translate((start.x + end.x) / 2, (start.y + end.y) / 2);
    ctx.rotate(Math.atan2(dy, dx));
    ctx.globalAlpha = alpha;
    ctx.drawImage(image, -length / 2, -width / 2, length, width);
    ctx.restore();
    return true;
  }
  drawGrid(ctx, map) {
    ctx.strokeStyle = 'rgba(255,255,255,.035)'; ctx.lineWidth = 1;
    for (let x = 0; x < map.width; x += 30) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, map.height); ctx.stroke(); }
    for (let y = 0; y < map.height; y += 30) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(map.width, y); ctx.stroke(); }
  }
  drawPath(ctx, map) {
    const points = map.waypoints;
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    ctx.strokeStyle = '#37443c'; ctx.lineWidth = map.pathWidth + 8; ctx.beginPath(); ctx.moveTo(points[0].x, points[0].y); points.slice(1).forEach(p => ctx.lineTo(p.x, p.y)); ctx.stroke();
    ctx.strokeStyle = '#7b725c'; ctx.lineWidth = map.pathWidth; ctx.stroke();
    ctx.setLineDash([7, 12]); ctx.strokeStyle = 'rgba(245,229,180,.32)'; ctx.lineWidth = 2; ctx.stroke(); ctx.setLineDash([]);
  }
  drawSlots(ctx, game) {
    game.level.map.slots.forEach((slot, index) => {
      const drewPlatform = this.drawContained(ctx, 'slotPlatform', slot.x, slot.y + 2, 52, 40);
      if (game.towers[index]) return;
      ctx.beginPath(); ctx.arc(slot.x, slot.y, 19, 0, Math.PI * 2);
      ctx.fillStyle = index === game.selectedSlot ? 'rgba(214,184,90,.5)' : drewPlatform ? 'rgba(14,36,29,.2)' : '#314c3c'; ctx.fill();
      ctx.strokeStyle = index === game.selectedSlot ? '#f0cf67' : '#a7c3aa'; ctx.lineWidth = 2; ctx.stroke();
      ctx.fillStyle = '#e7efe7'; ctx.font = 'bold 20px system-ui'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('+', slot.x, slot.y - 1);
    });
  }
  drawMapProps(ctx, game) {
    const { art } = game.level;
    this.drawContained(ctx, art.spawn, art.spawnPosition.x, art.spawnPosition.y, 66, 66, { anchorY: 0.54 });
    this.drawContained(ctx, art.base, art.basePosition.x, art.basePosition.y, 76, 76, { anchorY: 0.58 });
  }
  drawTowers(ctx, game) {
    game.towers.forEach((tower, index) => {
      if (!tower) return;
      if (index === game.selectedSlot) { const range = tower.getStats(game.blessings.modifiers).range; ctx.beginPath(); ctx.arc(tower.x, tower.y, range, 0, Math.PI * 2); ctx.fillStyle = 'rgba(241,205,103,.09)'; ctx.fill(); ctx.strokeStyle = 'rgba(241,205,103,.65)'; ctx.lineWidth = 1.5; ctx.stroke(); }
      const [width, height] = TOWER_BOXES[tower.type];
      const motion = MotionSystem.towerTransform(tower, game.visualTime ?? 0, game.effects, this.motionEnabled);
      const drewTower = this.drawContained(ctx, tower.type, tower.x + motion.xOffset, tower.y + 4 + motion.yOffset, width, height, { anchorY: 0.58, scale: motion.scale });
      if (!drewTower) {
        ctx.beginPath(); ctx.arc(tower.x, tower.y, 22, 0, Math.PI * 2); ctx.fillStyle = '#102d25'; ctx.fill(); ctx.strokeStyle = '#e5c15a'; ctx.lineWidth = 3; ctx.stroke();
        ctx.font = '24px system-ui'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(TOWER_DATA[tower.type].emoji, tower.x, tower.y);
      }
      ctx.fillStyle = '#fff4c7'; ctx.font = 'bold 10px system-ui'; ctx.fillText(`Lv.${tower.level}`, tower.x, tower.y + 31);
    });
  }
  drawEnemies(ctx, game) {
    game.enemies.forEach(enemy => {
      if (enemy.statuses.slow) {
        const size = (enemy.radius + 9) * 2;
        if (!this.drawContained(ctx, 'slowMark', enemy.x, enemy.y + 1, size, size, { alpha: 0.82 })) {
          ctx.save(); ctx.strokeStyle = 'rgba(104,224,255,.95)'; ctx.lineWidth = 2.5;
          ctx.beginPath(); ctx.arc(enemy.x, enemy.y, enemy.radius + 7, 0, Math.PI * 2); ctx.stroke(); ctx.restore();
        }
      }
      const next = enemy.map.positionAt(Math.min(enemy.map.totalLength, enemy.pathDistance + 1));
      const id = enemy.type === 'qiongqi' && enemy.frenzied ? 'qiongqiFrenzy' : enemy.type;
      const [width, height] = ENEMY_BOXES[enemy.type];
      const motion = MotionSystem.enemyTransform(enemy, game.visualTime ?? 0, game.effects, this.motionEnabled);
      const spriteOptions = { anchorY: 0.56, mirror: next.x < enemy.x, scale: motion.scale };
      const drewEnemy = this.drawContained(ctx, id, enemy.x + motion.xOffset, enemy.y + 3 + motion.yOffset, width, height, spriteOptions);
      if (drewEnemy && motion.flash) {
        this.drawContained(ctx, id, enemy.x + motion.xOffset, enemy.y + 3 + motion.yOffset, width, height, {
          ...spriteOptions,
          alpha: UNIT_MOTION_CONFIG.hitFlashAlpha,
          filter: UNIT_MOTION_CONFIG.hitFlashFilter,
        });
      }
      if (!drewEnemy) {
        ctx.beginPath(); ctx.arc(enemy.x, enemy.y, enemy.radius + 3, 0, Math.PI * 2); ctx.fillStyle = enemy.isBoss ? '#6b1d28' : '#39272b'; ctx.fill();
        ctx.font = `${enemy.isBoss ? 28 : 18}px system-ui`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(ENEMY_DATA[enemy.type].emoji, enemy.x, enemy.y);
      }
      if (enemy.hitFlash > 0 && !enemy.isBoss) this.healthBar(ctx, enemy.x - 17, enemy.y - enemy.radius - 10, 34, enemy.hp / enemy.maxHp);
    });
  }
  healthBar(ctx, x, y, width, ratio) { ctx.fillStyle = '#28181b'; ctx.fillRect(x, y, width, 4); ctx.fillStyle = ratio > .5 ? '#77d176' : '#e35757'; ctx.fillRect(x, y, width * Math.max(0, ratio), 4); }
  drawProjectiles(ctx, game) {
    game.projectiles.forEach(p => {
      const angle = Math.atan2(p.targetPoint.y - p.y, p.targetPoint.x - p.x);
      const id = p.type === 'bifang' ? 'bifangFireball' : 'fuzhuFrostshot';
      if (this.drawContained(ctx, id, p.x, p.y, p.type === 'bifang' ? 19 : 20, 13, { rotation: angle })) return;
      ctx.beginPath(); ctx.arc(p.x, p.y, p.type === 'bifang' ? 6 : 5, 0, Math.PI * 2); ctx.fillStyle = p.type === 'bifang' ? '#ff7b38' : '#9eeeff'; ctx.fill();
    });
  }
  drawEffects(ctx, game) {
    game.effects.filter(effect => effect.type === 'unitDeath' && effect.life > 0).forEach(effect => {
      const [width, height] = ENEMY_BOXES[effect.unitType];
      const motion = MotionSystem.deathTransform(effect);
      this.drawContained(ctx, effect.unitType, effect.x, effect.y + 3, width, height, {
        anchorY: 0.56, mirror: effect.mirror, scale: motion.scale, alpha: motion.alpha,
      });
    });
    game.effects.filter(effect => effect.type === 'paoxiaoEnrage').forEach(effect => {
      const alpha = Math.max(0, effect.life / effect.duration);
      this.drawContained(ctx, 'paoxiaoEnrage', effect.x, effect.y, 105, 105, { alpha });
    });
    game.effects.filter(effect => effect.type === 'paoxiaoProjectile').forEach(effect => {
      const progress = 1 - effect.life / effect.duration;
      const x = effect.from.x + (effect.to.x - effect.from.x) * progress;
      const y = effect.from.y + (effect.to.y - effect.from.y) * progress;
      this.drawContained(ctx, 'paoxiaoProjectile', x, y, 38, 38, { rotation: Math.atan2(effect.to.y - effect.from.y, effect.to.x - effect.from.x) });
    });
    game.effects.filter(effect => effect.type === 'paoxiaoExplosion').forEach(effect => {
      const progress = 1 - effect.life / effect.duration;
      this.drawContained(ctx, 'paoxiaoExplosion', effect.x, effect.y, 90 + progress * 30, 90 + progress * 30, { alpha: effect.life / effect.duration });
    });
    game.effects.filter(effect => effect.type === 'paoxiaoGroundslam').forEach(effect => {
      const progress = 1 - effect.life / effect.duration;
      this.drawContained(ctx, 'paoxiaoGroundslam', effect.x, effect.y + 12, 120 + progress * 35, 72 + progress * 20, { alpha: effect.life / effect.duration });
    });
    game.effects.filter(effect => effect.type === 'explosion').forEach(effect => {
      const progress = 1 - effect.life / effect.duration;
      const radius = effect.radius * (0.35 + progress * 0.65);
      const alpha = Math.max(0, effect.life / effect.duration);
      if (this.drawContained(ctx, 'bifangExplosion', effect.x, effect.y, radius * 2.2, radius * 2.2, { alpha })) return;
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.fillStyle = 'rgba(255,105,44,.2)';
      ctx.strokeStyle = '#ffb33f';
      ctx.lineWidth = 4 - progress * 2;
      ctx.beginPath(); ctx.arc(effect.x, effect.y, radius, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      ctx.strokeStyle = 'rgba(255,239,148,.9)'; ctx.lineWidth = 2;
      effect.hitPoints.forEach(point => { ctx.beginPath(); ctx.arc(point.x, point.y, 8 + progress * 6, 0, Math.PI * 2); ctx.stroke(); });
      ctx.restore();
    });
    game.effects.filter(effect => effect.type === 'beam').forEach(effect => {
      const alpha = Math.max(0, effect.life / effect.duration);
      const segments = effect.points.slice(1).map((point, index) => [effect.points[index], point]);
      if (segments.length && segments.every(([start, end]) => this.drawDirectional(ctx, 'yinglongBeam', start, end, 12, alpha))) return;
      ctx.save();
      ctx.lineCap = 'round'; ctx.lineJoin = 'round';
      ctx.strokeStyle = `rgba(255,220,87,${alpha})`; ctx.lineWidth = 6;
      ctx.beginPath();
      effect.points.forEach((point, index) => index === 0 ? ctx.moveTo(point.x, point.y) : ctx.lineTo(point.x, point.y));
      ctx.stroke();
      ctx.strokeStyle = `rgba(255,250,205,${alpha})`; ctx.lineWidth = 2; ctx.stroke();
      effect.points.slice(1).forEach(point => { ctx.beginPath(); ctx.arc(point.x, point.y, 7, 0, Math.PI * 2); ctx.stroke(); });
      ctx.restore();
    });
    game.effects.filter(effect => effect.type === 'gold').forEach(effect => {
      const progress = 1 - effect.life / effect.duration;
      ctx.save();
      ctx.globalAlpha = Math.min(1, effect.life * 2.5);
      ctx.fillStyle = '#ffe27a';
      ctx.strokeStyle = 'rgba(20,24,17,.8)';
      ctx.lineWidth = 3;
      ctx.font = 'bold 15px system-ui';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      const y = effect.y - 20 - progress * 24;
      ctx.strokeText(`+${effect.amount} G`, effect.x, y);
      ctx.fillText(`+${effect.amount} G`, effect.x, y);
      ctx.restore();
    });
  }
  drawLabels(ctx, game) {
    const map = game.level.map;
    ctx.textAlign = 'left'; ctx.textBaseline = 'middle'; ctx.font = 'bold 11px system-ui'; ctx.fillStyle = '#d7e7d8'; ctx.fillText('敵人入口', 10, 38);
    ctx.textAlign = 'right'; ctx.fillText(game.level.baseName, map.width - 10, map.height - 20);
  }
}

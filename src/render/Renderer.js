import { MAP_DATA, TOWER_DATA, ENEMY_DATA } from '../config/gameData.js';
import { ArtStore } from '../config/artAssets.js';

const BACKGROUND_CROP = Object.freeze({ x: 100, y: 129, width: 1083, height: 1145 });
const TOWER_BOXES = Object.freeze({ bifang: [54, 58], fuzhu: [48, 58], yinglong: [56, 54] });
const ENEMY_BOXES = Object.freeze({ minion: [36, 38], swift: [36, 36], giant: [48, 48], qiongqi: [68, 68] });

export class Renderer {
  constructor(canvas, art = new ArtStore()) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.art = art;
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
  render(game) {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, MAP_DATA.width, MAP_DATA.height);
    this.drawBackground(ctx);
    this.drawSlots(ctx, game);
    this.drawMapProps(ctx);
    this.drawTowers(ctx, game);
    this.drawEnemies(ctx, game);
    this.drawProjectiles(ctx, game);
    this.drawEffects(ctx, game);
    this.drawLabels(ctx);
  }
  drawBackground(ctx) {
    const image = this.art.get('background');
    if (image) {
      const crop = BACKGROUND_CROP;
      ctx.drawImage(image, crop.x, crop.y, crop.width, crop.height, 0, 0, MAP_DATA.width, MAP_DATA.height);
      return;
    }
    ctx.fillStyle = '#17231d'; ctx.fillRect(0, 0, MAP_DATA.width, MAP_DATA.height);
    this.drawGrid(ctx);
    this.drawPath(ctx);
  }
  drawContained(ctx, id, x, y, boxWidth, boxHeight, { anchorY = 0.5, mirror = false, rotation = 0, alpha = 1 } = {}) {
    const image = this.art.get(id);
    if (!image) return false;
    const scale = Math.min(boxWidth / image.naturalWidth, boxHeight / image.naturalHeight);
    const width = image.naturalWidth * scale;
    const height = image.naturalHeight * scale;
    ctx.save();
    ctx.translate(x, y);
    if (rotation) ctx.rotate(rotation);
    if (mirror) ctx.scale(-1, 1);
    ctx.globalAlpha = alpha;
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
  drawGrid(ctx) {
    ctx.strokeStyle = 'rgba(255,255,255,.035)'; ctx.lineWidth = 1;
    for (let x = 0; x < MAP_DATA.width; x += 30) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, MAP_DATA.height); ctx.stroke(); }
    for (let y = 0; y < MAP_DATA.height; y += 30) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(MAP_DATA.width, y); ctx.stroke(); }
  }
  drawPath(ctx) {
    const points = MAP_DATA.waypoints;
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    ctx.strokeStyle = '#37443c'; ctx.lineWidth = MAP_DATA.pathWidth + 8; ctx.beginPath(); ctx.moveTo(points[0].x, points[0].y); points.slice(1).forEach(p => ctx.lineTo(p.x, p.y)); ctx.stroke();
    ctx.strokeStyle = '#7b725c'; ctx.lineWidth = MAP_DATA.pathWidth; ctx.stroke();
    ctx.setLineDash([7, 12]); ctx.strokeStyle = 'rgba(245,229,180,.32)'; ctx.lineWidth = 2; ctx.stroke(); ctx.setLineDash([]);
  }
  drawSlots(ctx, game) {
    MAP_DATA.slots.forEach((slot, index) => {
      const drewPlatform = this.drawContained(ctx, 'slotPlatform', slot.x, slot.y + 2, 52, 40);
      if (game.towers[index]) return;
      ctx.beginPath(); ctx.arc(slot.x, slot.y, 19, 0, Math.PI * 2);
      ctx.fillStyle = index === game.selectedSlot ? 'rgba(214,184,90,.5)' : drewPlatform ? 'rgba(14,36,29,.2)' : '#314c3c'; ctx.fill();
      ctx.strokeStyle = index === game.selectedSlot ? '#f0cf67' : '#a7c3aa'; ctx.lineWidth = 2; ctx.stroke();
      ctx.fillStyle = '#e7efe7'; ctx.font = 'bold 20px system-ui'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('+', slot.x, slot.y - 1);
    });
  }
  drawMapProps(ctx) {
    this.drawContained(ctx, 'spawnRift', 10, 70, 66, 66, { anchorY: 0.54 });
    this.drawContained(ctx, 'baseSeal', 372, 558, 76, 76, { anchorY: 0.58 });
  }
  drawTowers(ctx, game) {
    game.towers.forEach((tower, index) => {
      if (!tower) return;
      if (index === game.selectedSlot) { const range = tower.getStats(game.blessings.modifiers).range; ctx.beginPath(); ctx.arc(tower.x, tower.y, range, 0, Math.PI * 2); ctx.fillStyle = 'rgba(241,205,103,.09)'; ctx.fill(); ctx.strokeStyle = 'rgba(241,205,103,.65)'; ctx.lineWidth = 1.5; ctx.stroke(); }
      const [width, height] = TOWER_BOXES[tower.type];
      const drewTower = this.drawContained(ctx, tower.type, tower.x, tower.y + 4, width, height, { anchorY: 0.58 });
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
      const drewEnemy = this.drawContained(ctx, id, enemy.x, enemy.y + 3, width, height, { anchorY: 0.56, mirror: next.x < enemy.x });
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
  drawLabels(ctx) {
    ctx.textAlign = 'left'; ctx.textBaseline = 'middle'; ctx.font = 'bold 11px system-ui'; ctx.fillStyle = '#d7e7d8'; ctx.fillText('敵人入口', 10, 38);
    ctx.textAlign = 'right'; ctx.fillText('山海關', MAP_DATA.width - 10, MAP_DATA.height - 20);
  }
}

import { MAP_DATA, TOWER_DATA, ENEMY_DATA } from '../config/gameData.js';

export class Renderer {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
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
    ctx.fillStyle = '#17231d'; ctx.fillRect(0, 0, MAP_DATA.width, MAP_DATA.height);
    this.drawGrid(ctx); this.drawPath(ctx); this.drawSlots(ctx, game); this.drawTowers(ctx, game); this.drawEnemies(ctx, game); this.drawProjectiles(ctx, game); this.drawLabels(ctx);
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
      if (game.towers[index]) return;
      ctx.beginPath(); ctx.arc(slot.x, slot.y, 19, 0, Math.PI * 2);
      ctx.fillStyle = index === game.selectedSlot ? '#d6b85a' : '#314c3c'; ctx.fill();
      ctx.strokeStyle = '#a7c3aa'; ctx.lineWidth = 2; ctx.stroke();
      ctx.fillStyle = '#e7efe7'; ctx.font = 'bold 20px system-ui'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('+', slot.x, slot.y - 1);
    });
  }
  drawTowers(ctx, game) {
    game.towers.forEach((tower, index) => {
      if (!tower) return;
      if (index === game.selectedSlot) { const range = tower.getStats(game.blessings.modifiers).range; ctx.beginPath(); ctx.arc(tower.x, tower.y, range, 0, Math.PI * 2); ctx.fillStyle = 'rgba(241,205,103,.09)'; ctx.fill(); ctx.strokeStyle = 'rgba(241,205,103,.65)'; ctx.lineWidth = 1.5; ctx.stroke(); }
      ctx.beginPath(); ctx.arc(tower.x, tower.y, 22, 0, Math.PI * 2); ctx.fillStyle = '#102d25'; ctx.fill(); ctx.strokeStyle = '#e5c15a'; ctx.lineWidth = 3; ctx.stroke();
      ctx.font = '24px system-ui'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(TOWER_DATA[tower.type].emoji, tower.x, tower.y);
      ctx.fillStyle = '#fff4c7'; ctx.font = 'bold 10px system-ui'; ctx.fillText(`Lv.${tower.level}`, tower.x, tower.y + 31);
    });
  }
  drawEnemies(ctx, game) {
    game.enemies.forEach(enemy => {
      ctx.beginPath(); ctx.arc(enemy.x, enemy.y, enemy.radius + 3, 0, Math.PI * 2); ctx.fillStyle = enemy.isBoss ? '#6b1d28' : '#39272b'; ctx.fill();
      ctx.font = `${enemy.isBoss ? 28 : 18}px system-ui`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(ENEMY_DATA[enemy.type].emoji, enemy.x, enemy.y);
      if (enemy.hitFlash > 0 && !enemy.isBoss) this.healthBar(ctx, enemy.x - 17, enemy.y - enemy.radius - 10, 34, enemy.hp / enemy.maxHp);
    });
  }
  healthBar(ctx, x, y, width, ratio) { ctx.fillStyle = '#28181b'; ctx.fillRect(x, y, width, 4); ctx.fillStyle = ratio > .5 ? '#77d176' : '#e35757'; ctx.fillRect(x, y, width * Math.max(0, ratio), 4); }
  drawProjectiles(ctx, game) {
    game.projectiles.forEach(p => { ctx.beginPath(); ctx.arc(p.x, p.y, p.type === 'bifang' ? 6 : 5, 0, Math.PI * 2); ctx.fillStyle = p.type === 'bifang' ? '#ff7b38' : '#9eeeff'; ctx.fill(); });
    game.effects.filter(e => e.type === 'beam').forEach(effect => { ctx.strokeStyle = `rgba(255,220,87,${Math.min(1, effect.life * 7)})`; ctx.lineWidth = 4; effect.targets.forEach(target => { ctx.beginPath(); ctx.moveTo(effect.x1, effect.y1); ctx.lineTo(target.x, target.y); ctx.stroke(); }); });
  }
  drawLabels(ctx) {
    ctx.textAlign = 'left'; ctx.textBaseline = 'middle'; ctx.font = 'bold 11px system-ui'; ctx.fillStyle = '#d7e7d8'; ctx.fillText('敵人入口', 10, 38);
    ctx.textAlign = 'right'; ctx.fillText('山海關', MAP_DATA.width - 10, MAP_DATA.height - 20);
    ctx.font = '24px system-ui'; ctx.fillText('🏯', MAP_DATA.width - 10, MAP_DATA.height - 48);
  }
}

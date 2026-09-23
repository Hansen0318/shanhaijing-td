import { MAP_DATA, TOWER_DATA, ENEMY_DATA } from '../config/gameData.js?v=level8-2';
import { ArtStore } from '../config/artAssets.js?v=level8-2';
import { ENABLE_UNIT_MOTION, UNIT_MOTION_CONFIG } from '../config/motionData.js?v=level8-2';
import { MotionSystem } from '../systems/MotionSystem.js?v=level8-2';
import { ENEMY_VISUALS } from '../config/enemyVisuals.js?v=level8-2';

const TOWER_BOXES = Object.freeze({ bifang: [54, 58], fuzhu: [48, 58], yinglong: [56, 54], baize: [56, 58], jumang: [56, 58], xuangui: [58, 56] });
const LEVEL7_WATERFALLS = Object.freeze([
  // Player-confirmed waterfall locations from phone smoke. Width follows the visible waterfall body.
  Object.freeze({ x: 48, y: 137, width: 22, height: 57, phase: 0.1 }),
  Object.freeze({ x: 21, y: 266, width: 12, height: 61, phase: 0.8 }),
  Object.freeze({ x: 315, y: 157, width: 7, height: 53, phase: 1.5 }),
  Object.freeze({ x: 171, y: 492, width: 23, height: 58, phase: 2.2 }),
]);

const FOG_VISUAL_PATHS = Object.freeze({
  upper: { start: [218, 116], c1: [214, 140], c2: [137, 181], end: [140, 214], normal: [-0.78, -0.62] },
  lower: { start: [245, 406], c1: [277, 407], c2: [335, 438], end: [335, 467], normal: [-0.56, 0.83] },
});

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
    this.drawLevelEightEnvironment(ctx, game);
    this.drawLevelSevenWaterfalls(ctx, game);
    this.drawFogZones(ctx, game);
    this.drawSunlightZones(ctx, game);
    this.drawThunderZones(ctx, game);
    this.drawSlots(ctx, game);
    this.drawMapProps(ctx, game);
    this.drawTowers(ctx, game);
    this.drawEnemies(ctx, game);
    this.drawProjectiles(ctx, game);
    this.drawEffects(ctx, game);
    this.drawLabels(ctx, game);
  }
  drawLevelEightEnvironment(ctx, game) {
    if (game.level.id !== 8) return;
    const zones = game.level.map.wetlandZones ?? [];
    const motion = game.level.map.environmentMotion ?? {};
    const time = game.visualTime ?? 0;
    const high = Boolean(game.tide?.high);
    const telegraph = Boolean(game.tide?.telegraph);

    for (const [index, zone] of zones.entries()) {
      const xs = zone.points.map(point => point.x);
      const ys = zone.points.map(point => point.y);
      const left = Math.min(...xs); const right = Math.max(...xs);
      const top = Math.min(...ys); const bottom = Math.max(...ys);
      const centerX = (left + right) / 2; const centerY = (top + bottom) / 2;
      const pulse = 0.5 + Math.sin(time * 2.2 + index * 1.3) * 0.5;
      ctx.save();
      ctx.beginPath();
      zone.points.forEach((point, pointIndex) => pointIndex === 0 ? ctx.moveTo(point.x, point.y) : ctx.lineTo(point.x, point.y));
      ctx.closePath();
      ctx.clip();
      const water = ctx.createRadialGradient(centerX, centerY, 2, centerX, centerY, Math.max(right - left, bottom - top) * 0.72);
      const alpha = high ? 0.17 + pulse * 0.055 : telegraph ? 0.075 + pulse * 0.025 : 0.025;
      water.addColorStop(0, `rgba(91, 221, 207, ${alpha})`);
      water.addColorStop(0.55, `rgba(47, 151, 151, ${alpha * 0.72})`);
      water.addColorStop(1, 'rgba(22, 84, 92, 0)');
      ctx.fillStyle = water;
      ctx.fillRect(left, top, right - left, bottom - top);
      if (high || telegraph) {
        ctx.strokeStyle = `rgba(158, 239, 223, ${high ? 0.18 : 0.1})`;
        ctx.lineWidth = 1;
        for (let ripple = 0; ripple < 2; ripple += 1) {
          const phase = (time * 0.42 + ripple * 0.5 + index * 0.17) % 1;
          ctx.beginPath();
          ctx.ellipse(centerX, centerY, 8 + phase * (right - left) * 0.42, 3 + phase * (bottom - top) * 0.28, 0, 0, Math.PI * 2);
          ctx.stroke();
        }
      }
      ctx.restore();
    }

    if (motion.fog) {
      const area = motion.fog;
      const drift = Math.sin(time * 0.34) * 5;
      const fog = ctx.createRadialGradient(area.x + area.width / 2 + drift, area.y + area.height / 2, 2, area.x + area.width / 2 + drift, area.y + area.height / 2, area.width * 0.58);
      fog.addColorStop(0, 'rgba(163, 207, 205, .105)');
      fog.addColorStop(0.55, 'rgba(104, 165, 169, .065)');
      fog.addColorStop(1, 'rgba(104, 165, 169, 0)');
      ctx.fillStyle = fog;
      ctx.fillRect(area.x, area.y, area.width, area.height);
    }
    if (motion.ripple) {
      const area = motion.ripple;
      const phase = (time * 0.35) % 1;
      ctx.save();
      ctx.strokeStyle = `rgba(138, 226, 211, ${0.13 * (1 - phase)})`;
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.ellipse(area.x + area.width / 2, area.y + area.height / 2, 8 + phase * 28, 3 + phase * 12, -0.08, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }
    if (motion.bubbles) {
      const area = motion.bubbles;
      ctx.save();
      ctx.fillStyle = 'rgba(158, 233, 218, .17)';
      for (let index = 0; index < 4; index += 1) {
        const phase = (time * (0.22 + index * 0.025) + index * 0.23) % 1;
        const x = area.x + 10 + (index * 17) % Math.max(18, area.width - 14);
        const y = area.y + area.height * (1 - phase);
        ctx.beginPath(); ctx.arc(x, y, 1.2 + index * 0.35, 0, Math.PI * 2); ctx.fill();
      }
      ctx.restore();
    }
    if (motion.reeds) {
      const area = motion.reeds;
      ctx.save();
      ctx.strokeStyle = 'rgba(129, 171, 103, .32)';
      ctx.lineWidth = 1.2;
      for (let index = 0; index < 5; index += 1) {
        const x = area.x + 5 + index * 10;
        const sway = Math.sin(time * 0.8 + index * 0.7) * 2;
        ctx.beginPath(); ctx.moveTo(x, area.y + area.height); ctx.quadraticCurveTo(x + sway, area.y + area.height * 0.48, x + sway * 1.4, area.y + 6); ctx.stroke();
      }
      ctx.restore();
    }
  }
  drawSunlightZones(ctx, game) {
    const zones = game.level.map.sunlightZones ?? [];
    if (!zones.length) return;
    const active = new Set(game.sunlight?.activeZoneIds ?? []);
    const time = game.visualTime ?? 0;

    zones.forEach(zone => {
      const isActive = active.has(zone.id);
      const pulse = 0.86 + Math.sin(time * 2.1 + (zone.id === 'B' ? 1.2 : 0)) * 0.08;
      const centerX = zone.x + zone.width / 2;
      const centerY = zone.y + zone.height / 2;

      // Always leave a faint landmark so players can learn where sunlight can appear.
      this.drawContained(ctx, 'sunlightZone', centerX, centerY, zone.width * 1.08, zone.height * 1.22, {
        alpha: isActive ? 0.24 : 0.11,
        filter: isActive ? 'brightness(1.35) saturate(1.18) blur(1px)' : 'brightness(0.82) saturate(0.75)',
      });

      if (isActive) {
        this.drawContained(ctx, 'sunlightZone', centerX, centerY, zone.width, zone.height, {
          alpha: pulse,
          filter: 'brightness(1.3) saturate(1.2)',
        });
      }

      ctx.save();
      ctx.textAlign = 'center';
      ctx.textBaseline = 'bottom';
      ctx.font = 'bold 10px system-ui';
      ctx.lineWidth = 3;
      ctx.strokeStyle = 'rgba(45,30,8,.88)';
      ctx.fillStyle = isActive ? '#fff1a8' : 'rgba(255,231,151,.62)';
      const label = isActive ? `日照${zone.id}・啟動` : `日照${zone.id}`;
      ctx.strokeText(label, centerX, zone.y - 3);
      ctx.fillText(label, centerX, zone.y - 3);
      ctx.restore();
    });
  }
  drawThunderZones(ctx, game) {
    const zones = game.level.map.thunderZones ?? [];
    if (!zones.length) return;
    const charge = new Set(game.effects.filter(effect => effect.type === 'thunderCharge' && effect.life > 0).flatMap(effect => effect.zoneIds));
    const pulse = new Set(game.effects.filter(effect => effect.type === 'thunderPulse' && effect.life > 0).flatMap(effect => effect.zoneIds));
    const time = game.visualTime ?? 0;

    const strokeBolt = (ctx, points, alpha, width, shadowBlur) => {
      ctx.save();
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.shadowColor = `rgba(104, 224, 255, ${Math.min(1, alpha)})`;
      ctx.shadowBlur = shadowBlur;
      ctx.strokeStyle = `rgba(111, 225, 255, ${alpha * 0.72})`;
      ctx.lineWidth = width + 3;
      ctx.beginPath();
      points.forEach((point, index) => index === 0 ? ctx.moveTo(point[0], point[1]) : ctx.lineTo(point[0], point[1]));
      ctx.stroke();
      ctx.shadowBlur = Math.max(2, shadowBlur * 0.45);
      ctx.strokeStyle = `rgba(244, 253, 255, ${alpha})`;
      ctx.lineWidth = width;
      ctx.stroke();
      ctx.restore();
    };

    for (const zone of zones) {
      const isCharging = charge.has(zone.id);
      const isPulsing = pulse.has(zone.id);
      const flicker = 0.5 + Math.sin(time * 23 + (zone.id === 'B' ? 1.7 : 0)) * 0.5;
      const alpha = isPulsing ? 0.5 : isCharging ? 0.24 + flicker * 0.08 : 0.035;
      const centerX = zone.x + zone.width / 2;
      const centerY = zone.y + zone.height / 2;
      const radiusX = zone.width * 0.56;
      const radiusY = zone.height * 0.64;

      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.scale(radiusX, radiusY);
      const glow = ctx.createRadialGradient(0, 0, 0.03, 0, 0, 1);
      glow.addColorStop(0, `rgba(205, 248, 255, ${Math.min(0.72, alpha * 1.35)})`);
      glow.addColorStop(0.28, `rgba(108, 218, 255, ${Math.min(0.58, alpha * 1.05)})`);
      glow.addColorStop(0.68, `rgba(51, 158, 232, ${alpha * 0.52})`);
      glow.addColorStop(1, 'rgba(51, 158, 232, 0)');
      ctx.fillStyle = glow;
      ctx.fillRect(-1, -1, 2, 2);
      ctx.restore();

      if (isCharging || isPulsing) {
        const boltAlpha = isPulsing ? 0.98 : 0.5 + flicker * 0.18;
        const mainBolt = [
          [centerX - radiusX * 0.26, centerY - radiusY * 0.78],
          [centerX + radiusX * 0.02, centerY - radiusY * 0.26],
          [centerX - radiusX * 0.12, centerY + radiusY * 0.02],
          [centerX + radiusX * 0.12, centerY + radiusY * 0.33],
          [centerX - radiusX * 0.02, centerY + radiusY * 0.78],
        ];
        strokeBolt(ctx, mainBolt, boltAlpha, isPulsing ? 2.2 : 1.35, isPulsing ? 13 : 8);

        const branchLeft = [
          [centerX - radiusX * 0.1, centerY - radiusY * 0.02],
          [centerX - radiusX * 0.46, centerY + radiusY * 0.18],
          [centerX - radiusX * 0.58, centerY + radiusY * 0.48],
        ];
        const branchRight = [
          [centerX + radiusX * 0.08, centerY + radiusY * 0.29],
          [centerX + radiusX * 0.42, centerY + radiusY * 0.09],
          [centerX + radiusX * 0.58, centerY + radiusY * 0.34],
        ];
        strokeBolt(ctx, branchLeft, boltAlpha * 0.78, isPulsing ? 1.6 : 1, isPulsing ? 10 : 6);
        strokeBolt(ctx, branchRight, boltAlpha * 0.74, isPulsing ? 1.5 : 1, isPulsing ? 10 : 6);

        if (isPulsing) {
          const flash = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, Math.max(radiusX, radiusY) * 0.9);
          flash.addColorStop(0, 'rgba(235, 253, 255, .46)');
          flash.addColorStop(0.4, 'rgba(116, 224, 255, .18)');
          flash.addColorStop(1, 'rgba(116, 224, 255, 0)');
          ctx.fillStyle = flash;
          ctx.fillRect(centerX - radiusX, centerY - radiusY, radiusX * 2, radiusY * 2);
        }

        ctx.save();
        ctx.textAlign = 'center';
        ctx.textBaseline = 'bottom';
        ctx.font = 'bold 10px system-ui';
        ctx.lineWidth = 3;
        ctx.strokeStyle = 'rgba(6,20,34,.9)';
        ctx.fillStyle = isPulsing ? '#f5feff' : '#bcefff';
        const label = `雷脈${zone.id}${isPulsing ? '・脈衝' : '・蓄能'}`;
        ctx.strokeText(label, centerX, zone.y - 3);
        ctx.fillText(label, centerX, zone.y - 3);
        ctx.restore();
      }
    }
  }
  drawStateTag(ctx, text, x, y, { fill = '#fff1a8', background = 'rgba(34,23,8,.78)' } = {}) {
    const width = 14 + text.length * 11;
    const height = 16;
    ctx.save();
    ctx.fillStyle = background;
    ctx.fillRect(x - width / 2, y - height + 2, width, height);
    ctx.font = 'bold 10px system-ui';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.lineWidth = 2;
    ctx.strokeStyle = 'rgba(24,16,5,.92)';
    ctx.fillStyle = fill;
    ctx.strokeText(text, x, y - 6);
    ctx.fillText(text, x, y - 6);
    ctx.restore();
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
  drawLevelSevenWaterfalls(ctx, game) {
    if (game.level.id !== 7) return;
    const time = game.visualTime ?? 0;

    for (const fall of LEVEL7_WATERFALLS) {
      const flow = (time * 1.15 + fall.phase) % 1;
      const centerX = fall.x + fall.width / 2;
      const bottomY = fall.y + fall.height;

      ctx.save();
      ctx.globalCompositeOperation = 'screen';

      const halo = ctx.createLinearGradient(fall.x, fall.y, fall.x, bottomY);
      halo.addColorStop(0, 'rgba(198, 242, 255, 0)');
      halo.addColorStop(0.14, 'rgba(184, 236, 255, .13)');
      halo.addColorStop(0.7, 'rgba(127, 211, 252, .20)');
      halo.addColorStop(1, 'rgba(221, 250, 255, .08)');
      ctx.fillStyle = halo;
      ctx.fillRect(fall.x - 3, fall.y, fall.width + 6, fall.height);

      for (let index = 0; index < 5; index += 1) {
        const lane = (index - 2) * (fall.width / 6);
        const wobble = Math.sin(time * 1.6 + fall.phase + index * 1.25) * 1.1;
        const offset = ((flow + index * 0.19) % 1) * 15;
        const startY = fall.y - 9 + offset;

        ctx.strokeStyle = `rgba(224, 249, 255, ${0.18 + index * 0.018})`;
        ctx.lineWidth = index === 2 ? 2.2 : index === 1 || index === 3 ? 1.65 : 1.15;
        ctx.lineCap = 'round';
        ctx.shadowColor = 'rgba(121, 218, 255, .34)';
        ctx.shadowBlur = 4;
        ctx.beginPath();
        ctx.moveTo(centerX + lane + wobble, startY);
        ctx.bezierCurveTo(
          centerX + lane - 1.8 + wobble, fall.y + fall.height * 0.32,
          centerX + lane + 1.8 - wobble, fall.y + fall.height * 0.69,
          centerX + lane + wobble * 0.35, bottomY - 2,
        );
        ctx.stroke();
      }

      const bandY = fall.y + ((flow + 0.38) % 1) * fall.height;
      const band = ctx.createLinearGradient(fall.x, bandY - 7, fall.x, bandY + 7);
      band.addColorStop(0, 'rgba(232, 252, 255, 0)');
      band.addColorStop(0.5, 'rgba(232, 252, 255, .20)');
      band.addColorStop(1, 'rgba(232, 252, 255, 0)');
      ctx.fillStyle = band;
      ctx.fillRect(fall.x - 2, bandY - 7, fall.width + 4, 14);

      const mistPulse = 0.075 + (Math.sin(time * 1.25 + fall.phase) + 1) * 0.025;
      const mist = ctx.createRadialGradient(centerX, bottomY - 1, 0, centerX, bottomY - 1, fall.width);
      mist.addColorStop(0, `rgba(228, 252, 255, ${mistPulse + 0.08})`);
      mist.addColorStop(0.48, `rgba(181, 233, 249, ${mistPulse})`);
      mist.addColorStop(1, 'rgba(181, 233, 249, 0)');
      ctx.fillStyle = mist;
      ctx.fillRect(centerX - fall.width * 1.1, bottomY - fall.width, fall.width * 2.2, fall.width * 1.65);

      ctx.restore();
    }
  }

  drawFogZones(ctx, game) {
    if (game.level.id !== 4) return;
    const zones = game.level.map.fogZones ?? [];
    const time = game.visualTime ?? 0;
    zones.forEach((zone, index) => {
      const path = FOG_VISUAL_PATHS[zone.id];
      if (!path) return;
      const breathe = (Math.sin(time * 0.9 + index * 1.7) + 1) / 2;
      ctx.save();
      ctx.globalCompositeOperation = 'screen';
      for (let layer = 0; layer < 3; layer += 1) {
        const spread = (layer - 1) * 7;
        const drift = Math.sin(time * (0.55 + layer * 0.08) + (layer - 1) * 1.2) * 3;
        const dx = path.normal[0] * (spread + drift);
        const dy = path.normal[1] * (spread + drift);
        ctx.beginPath();
        ctx.moveTo(path.start[0] + dx, path.start[1] + dy);
        ctx.bezierCurveTo(
          path.c1[0] + dx, path.c1[1] + dy,
          path.c2[0] + dx, path.c2[1] + dy,
          path.end[0] + dx, path.end[1] + dy,
        );
        ctx.strokeStyle = layer % 2
          ? `rgba(105, 218, 232, ${0.09 + breathe * 0.03})`
          : `rgba(176, 119, 238, ${0.1 + breathe * 0.035})`;
        ctx.lineWidth = 24 - layer * 7;
        ctx.lineCap = 'round';
        ctx.shadowColor = layer % 2 ? 'rgba(105, 218, 232, .24)' : 'rgba(176, 119, 238, .25)';
        ctx.shadowBlur = 12 + layer * 3;
        ctx.stroke();
      }
      ctx.restore();
    });
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
    if (!art.spawnPosition && !art.basePosition) return;
    const levelThree = game.level.id === 3;
    if (art.spawn && art.spawnPosition) {
      const spawnX = levelThree ? Math.max(34, art.spawnPosition.x) : art.spawnPosition.x;
      const spawnY = levelThree ? Math.max(36, art.spawnPosition.y) : art.spawnPosition.y;
      this.drawContained(ctx, art.spawn, spawnX, spawnY, 66, 66, { anchorY: 0.54 });
    }
    if (art.base && art.basePosition) {
      const baseX = levelThree ? Math.max(40, art.basePosition.x) : art.basePosition.x;
      this.drawContained(ctx, art.base, baseX, art.basePosition.y, 76, 76, { anchorY: 0.58 });
    }
  }
  drawTowers(ctx, game) {
    game.towers.forEach((tower, index) => {
      if (!tower) return;
      if (index === game.selectedSlot) { const range = tower.getStats(game.blessings.modifiers, game.teamIntervalMultiplier?.() ?? 1).range; ctx.beginPath(); ctx.arc(tower.x, tower.y, range, 0, Math.PI * 2); ctx.fillStyle = 'rgba(241,205,103,.09)'; ctx.fill(); ctx.strokeStyle = 'rgba(241,205,103,.65)'; ctx.lineWidth = 1.5; ctx.stroke(); }
      const [width, height] = TOWER_BOXES[tower.type];
      const motion = MotionSystem.towerTransform(tower, game.visualTime ?? 0, game.effects, this.motionEnabled);
      const drewTower = this.drawContained(ctx, tower.type, tower.x + motion.xOffset, tower.y + 4 + motion.yOffset, width, height, {
        anchorY: 0.58,
        mirror: tower.facing === -1,
        scale: motion.scale,
      });
      if (!drewTower) {
        ctx.beginPath(); ctx.arc(tower.x, tower.y, 22, 0, Math.PI * 2); ctx.fillStyle = '#102d25'; ctx.fill(); ctx.strokeStyle = '#e5c15a'; ctx.lineWidth = 3; ctx.stroke();
        ctx.font = '24px system-ui'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(TOWER_DATA[tower.type].emoji, tower.x, tower.y);
      }
      ctx.fillStyle = '#fff4c7'; ctx.font = 'bold 10px system-ui'; ctx.fillText(`Lv.${tower.level}`, tower.x, tower.y + 31);
    });
  }
  drawEnemies(ctx, game) {
    [...game.enemies, ...(game.illusions ?? [])].forEach(enemy => {
      if (enemy.map?.isWeakWater?.(enemy)) {
        const size = (enemy.radius + 12) * 2;
        if (!this.drawContained(ctx, 'waterRing', enemy.x, enemy.y + 5, size, size, { alpha: 0.46 })) {
          ctx.save();
          ctx.fillStyle = 'rgba(72,205,255,.12)';
          ctx.strokeStyle = 'rgba(101,226,255,.78)';
          ctx.lineWidth = 2;
          ctx.beginPath(); ctx.arc(enemy.x, enemy.y + 3, enemy.radius + 10, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
          ctx.restore();
        }
      }
      if (enemy.statuses.slow) {
        const size = (enemy.radius + 9) * 2;
        if (!this.drawContained(ctx, 'slowMark', enemy.x, enemy.y + 1, size, size, { alpha: 0.82 })) {
          ctx.save(); ctx.strokeStyle = 'rgba(104,224,255,.95)'; ctx.lineWidth = 2.5;
          ctx.beginPath(); ctx.arc(enemy.x, enemy.y, enemy.radius + 7, 0, Math.PI * 2); ctx.stroke(); ctx.restore();
        }
      }
      if (enemy.statuses.insight) this.drawContained(ctx, 'baizeInsightMark', enemy.x, enemy.y, (enemy.radius + 11) * 2, (enemy.radius + 11) * 2, { alpha: 0.9 });
      const sunlightPulse = 0.9 + Math.sin((game.visualTime ?? 0) * 4 + enemy.pathDistance * 0.03) * 0.08;
      if (enemy.type === 'jinwu' && (enemy.bossPhase ?? 1) >= 2) {
        this.drawContained(ctx, 'jinwuPhase2', enemy.x, enemy.y, 124, 124, {
          alpha: 0.24 + Math.sin((game.visualTime ?? 0) * 1.6) * 0.04,
          rotation: (game.visualTime ?? 0) * 0.16,
          filter: 'brightness(1.1) saturate(1.15)',
        });
      }
      if (enemy.type === 'yangyu' && enemy.inSunlight) {
        this.drawContained(ctx, 'yangyuSunboost', enemy.x, enemy.y + 2, 68, 44, {
          alpha: sunlightPulse,
          filter: 'brightness(1.25) saturate(1.25)',
        });
      }
      if (enemy.yangmuArmorActive) {
        this.drawContained(ctx, 'yangmuArmorOn', enemy.x, enemy.y, 82, 82, {
          alpha: sunlightPulse,
          filter: 'brightness(1.16) saturate(1.12)',
        });
      }
      if (enemy.sunShieldActive) {
        this.drawContained(ctx, 'jinwuSunshield', enemy.x, enemy.y, 124, 124, {
          alpha: 0.92,
          filter: 'brightness(1.2) saturate(1.15)',
        });
      }
      const next = enemy.map.positionAt(Math.min(enemy.map.totalLength, enemy.pathDistance + 1));
      const skill = enemy.type === 'jiuweihu' ? game.effects.find(effect => effect.type === 'jiuweihuSkill' && effect.sourceId === enemy.id && effect.life > 0) : null;
      const skillProgress = skill ? 1 - skill.life / skill.duration : -1;
      const id = enemy.type === 'qiongqi' && enemy.frenzied
        ? 'qiongqiFrenzy'
        : enemy.type === 'jiuweihu'
          ? (skillProgress >= 0.35 && skillProgress < 0.7 ? 'jiuweihuCast' : `jiuweihuPhase${enemy.bossPhase ?? 1}`)
          : enemy.type === 'xingtian'
            ? `xingtianPhase${enemy.bossPhase ?? 1}`
          : enemy.type;
      const { width, height, anchorY: visualAnchorY } = ENEMY_VISUALS[enemy.type];
      const motion = MotionSystem.enemyTransform(enemy, game.visualTime ?? 0, game.effects, this.motionEnabled);
      const spriteOptions = { anchorY: visualAnchorY, mirror: next.x < enemy.x, scale: motion.scale, alpha: enemy.isIllusion ? 0.52 : 1 };
      const drewEnemy = this.drawContained(ctx, id, enemy.x + motion.xOffset, enemy.y + motion.yOffset, width, height, spriteOptions);
      if (drewEnemy && motion.flash) {
        this.drawContained(ctx, id, enemy.x + motion.xOffset, enemy.y + motion.yOffset, width, height, {
          ...spriteOptions,
          alpha: UNIT_MOTION_CONFIG.hitFlashAlpha,
          filter: UNIT_MOTION_CONFIG.hitFlashFilter,
        });
      }
      if (!drewEnemy) {
        ctx.beginPath(); ctx.arc(enemy.x, enemy.y, enemy.radius + 3, 0, Math.PI * 2); ctx.fillStyle = enemy.isBoss ? '#6b1d28' : '#39272b'; ctx.fill();
        ctx.font = `${enemy.isBoss ? 28 : 18}px system-ui`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(ENEMY_DATA[enemy.type].emoji, enemy.x, enemy.y);
      }
      if (!enemy.isIllusion) {
        const tagY = enemy.y - enemy.radius - 9;
        if (enemy.type === 'yangyu' && enemy.inSunlight) this.drawStateTag(ctx, '加速', enemy.x, tagY);
        if (enemy.yangmuArmorActive) this.drawStateTag(ctx, '陽木甲', enemy.x, tagY, { fill: '#ffe58a', background: 'rgba(58,40,15,.82)' });
        if (enemy.sunShieldActive) this.drawStateTag(ctx, '日輪護體', enemy.x, tagY, { fill: '#fff3b0', background: 'rgba(83,46,4,.84)' });
        if (enemy.statuses.thunderSprint) this.drawStateTag(ctx, '雷行', enemy.x, tagY, { fill: '#b8f3ff', background: 'rgba(13,45,72,.84)' });
        if (enemy.statuses.thunderShell) this.drawStateTag(ctx, '雷殼', enemy.x, tagY, { fill: '#d3f6ff', background: 'rgba(21,50,75,.86)' });
        if (enemy.type === 'kui' && (enemy.bossPhase ?? 1) >= 2) this.drawStateTag(ctx, '雷怒', enemy.x, tagY, { fill: '#ecfbff', background: 'rgba(15,49,84,.9)' });
        if (enemy.statuses.marshLeap) this.drawStateTag(ctx, '泥躍', enemy.x, tagY, { fill: '#bff8e9', background: 'rgba(17,66,62,.86)' });
        if (enemy.statuses.marshArmor) this.drawStateTag(ctx, '沼甲', enemy.x, tagY, { fill: '#d8efc4', background: 'rgba(40,68,34,.88)' });
        if (enemy.type === 'huashe' && (enemy.bossPhase ?? 1) >= 2) this.drawStateTag(ctx, '洪潮', enemy.x, tagY, { fill: '#d5fffa', background: 'rgba(20,54,62,.9)' });
      }
      if (enemy.hitFlash > 0 && !enemy.isBoss && !enemy.isIllusion) this.healthBar(ctx, enemy.x - 17, enemy.y - enemy.radius - 10, 34, enemy.hp / enemy.maxHp);
    });
  }
  healthBar(ctx, x, y, width, ratio) { ctx.fillStyle = '#28181b'; ctx.fillRect(x, y, width, 4); ctx.fillStyle = ratio > .5 ? '#77d176' : '#e35757'; ctx.fillRect(x, y, width * Math.max(0, ratio), 4); }
  drawProjectiles(ctx, game) {
    game.projectiles.forEach(p => {
      const angle = Math.atan2(p.targetPoint.y - p.y, p.targetPoint.x - p.x);
      if (p.type === 'xuangui') {
        ctx.save();
        ctx.lineCap = 'round';
        ctx.shadowColor = 'rgba(94, 239, 226, .72)';
        ctx.shadowBlur = 7;
        ctx.strokeStyle = 'rgba(86, 215, 210, .58)';
        ctx.lineWidth = 3.2;
        ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(p.x - Math.cos(angle) * 14, p.y - Math.sin(angle) * 14); ctx.stroke();
        const core = ctx.createRadialGradient(p.x - 1, p.y - 1, 0, p.x, p.y, 6);
        core.addColorStop(0, '#e4fffa'); core.addColorStop(0.42, '#63e4dc'); core.addColorStop(1, 'rgba(24,126,140,0)');
        ctx.fillStyle = core; ctx.beginPath(); ctx.arc(p.x, p.y, 6, 0, Math.PI * 2); ctx.fill();
        ctx.restore();
        return;
      }
      const id = p.type === 'bifang' ? 'bifangFireball' : p.type === 'jumang' ? 'jumangLeafblade' : 'fuzhuFrostshot';
      if (p.type === 'jumang') {
        ctx.save();
        ctx.strokeStyle = 'rgba(141, 242, 174, .72)';
        ctx.lineWidth = 3;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(p.x - Math.cos(angle) * 13, p.y - Math.sin(angle) * 13);
        ctx.stroke();
        ctx.restore();
      }
      if (this.drawContained(ctx, id, p.x, p.y, p.type === 'bifang' ? 19 : p.type === 'jumang' ? 22 : 20, 13, { rotation: angle })) return;
      ctx.beginPath(); ctx.arc(p.x, p.y, p.type === 'bifang' ? 6 : 5, 0, Math.PI * 2); ctx.fillStyle = p.type === 'bifang' ? '#ff7b38' : p.type === 'jumang' ? '#8df2ae' : '#9eeeff'; ctx.fill();
    });
  }
  drawEffects(ctx, game) {
    game.effects.filter(effect => effect.type === 'xuanguiShockTelegraph').forEach(effect => {
      const progress = 1 - effect.life / effect.duration;
      ctx.save();
      ctx.globalAlpha = Math.max(0, effect.life / effect.duration);
      ctx.strokeStyle = '#82eee3'; ctx.lineWidth = 1.8;
      ctx.beginPath(); ctx.arc(effect.x, effect.y, effect.radius * (0.7 - progress * 0.42), 0, Math.PI * 2); ctx.stroke();
      ctx.restore();
    });
    game.effects.filter(effect => effect.type === 'xuanguiShock').forEach(effect => {
      const progress = 1 - effect.life / effect.duration;
      ctx.save();
      ctx.globalAlpha = Math.max(0, effect.life / effect.duration);
      for (let ring = 0; ring < 2; ring += 1) {
        const ringProgress = Math.max(0, Math.min(1, progress * 1.35 - ring * 0.18));
        ctx.strokeStyle = ring === 0 ? '#b5fff4' : '#57d7d1';
        ctx.lineWidth = 3 - ring;
        ctx.beginPath(); ctx.arc(effect.x, effect.y, 8 + ringProgress * effect.radius, 0, Math.PI * 2); ctx.stroke();
      }
      const mist = ctx.createRadialGradient(effect.x, effect.y - 4, 0, effect.x, effect.y - 4, effect.radius * 0.72);
      mist.addColorStop(0, 'rgba(181,255,245,.2)'); mist.addColorStop(1, 'rgba(67,190,188,0)');
      ctx.fillStyle = mist; ctx.fillRect(effect.x - effect.radius, effect.y - effect.radius, effect.radius * 2, effect.radius * 1.5);
      ctx.restore();
    });
    game.effects.filter(effect => effect.type === 'huashePhase2').forEach(effect => {
      const source = game.enemies?.find(enemy => enemy.id === effect.sourceId);
      const point = source ?? effect;
      const progress = 1 - effect.life / effect.duration;
      ctx.save(); ctx.globalAlpha = Math.max(0, effect.life / effect.duration);
      ctx.strokeStyle = '#a3eee5'; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.arc(point.x, point.y, 44 + progress * 28, 0, Math.PI * 2); ctx.stroke(); ctx.restore();
    });
    game.effects.filter(effect => effect.type === 'kuiPhase2').forEach(effect => {
      const source = game.enemies?.find(enemy => enemy.id === effect.sourceId);
      const point = source ?? effect;
      const progress = 1 - effect.life / effect.duration;
      ctx.save();
      ctx.globalAlpha = Math.max(0.25, effect.life / effect.duration);
      ctx.strokeStyle = '#bfeeff';
      ctx.lineWidth = 4 - progress * 2;
      ctx.beginPath();
      ctx.arc(point.x, point.y, 42 + progress * 24, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    });
    game.effects.filter(effect => effect.type === 'jumangImpact').forEach(effect => {
      const progress = 1 - effect.life / effect.duration;
      ctx.save();
      ctx.globalAlpha = Math.max(0, effect.life / effect.duration);
      ctx.fillStyle = 'rgba(136, 246, 175, .24)';
      ctx.strokeStyle = '#baffce';
      ctx.lineWidth = 3 - progress;
      ctx.beginPath();
      ctx.arc(effect.x, effect.y, 7 + progress * 10, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.restore();
    });
    game.effects.filter(effect => effect.type === 'fogEntry').forEach(effect => {
      const progress = 1 - effect.life / effect.duration;
      const fade = Math.max(0, effect.life / effect.duration);
      const echoCount = effect.weakened ? 1 : 2;
      for (let index = echoCount; index >= 1; index -= 1) {
        const offset = (6 + progress * 10) * index;
        this.drawContained(ctx, effect.unitType, effect.x - offset, effect.y + index * 2, 40, 42, {
          anchorY: 0.56,
          alpha: fade * (effect.weakened ? 0.16 : 0.24) / index,
          filter: effect.weakened
            ? 'brightness(1.15) saturate(1.2) hue-rotate(18deg)'
            : 'brightness(1.45) saturate(1.55) hue-rotate(35deg)',
        });
      }
      ctx.save();
      ctx.globalAlpha = fade * (effect.weakened ? 0.42 : 0.78);
      ctx.fillStyle = effect.weakened ? 'rgba(91, 204, 222, .08)' : 'rgba(161, 100, 235, .13)';
      ctx.strokeStyle = effect.weakened ? '#76cbd8' : '#c58aff';
      ctx.lineWidth = effect.weakened ? 1.6 : 2.8;
      ctx.beginPath();
      ctx.arc(effect.x, effect.y + 3, 14 + progress * (effect.weakened ? 10 : 18), 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.restore();
    });
    game.effects.filter(effect => effect.type === 'unitDeath' && effect.life > 0).forEach(effect => {
      const { width, height, anchorY: visualAnchorY } = ENEMY_VISUALS[effect.unitType];
      const motion = MotionSystem.deathTransform(effect);
      const id = effect.unitType === 'jiuweihu'
        ? `jiuweihuPhase${effect.bossPhase ?? 1}`
        : effect.unitType === 'xingtian'
          ? `xingtianPhase${effect.bossPhase ?? 1}`
          : effect.unitType;
      this.drawContained(ctx, id, effect.x, effect.y, width, height, {
        anchorY: visualAnchorY, mirror: effect.mirror, scale: motion.scale, alpha: motion.alpha,
      });
    });
    game.effects.filter(effect => effect.type === 'baizeInsight').forEach(effect => {
      const alpha = Math.max(0, effect.life / effect.duration);
      const dx = effect.to.x - effect.from.x;
      const dy = effect.to.y - effect.from.y;
      const length = Math.hypot(dx, dy) || 1;
      const nx = -dy / length;
      const ny = dx / length;
      ctx.save();
      ctx.lineCap = 'round';
      ctx.shadowColor = 'rgba(160,245,255,.9)';
      ctx.shadowBlur = 8;
      ctx.strokeStyle = `rgba(194,252,255,${0.35 + alpha * 0.55})`;
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.moveTo(effect.from.x, effect.from.y);
      ctx.lineTo(effect.to.x, effect.to.y);
      ctx.stroke();
      ctx.shadowBlur = 0;
      ctx.strokeStyle = `rgba(255,255,224,${0.55 + alpha * 0.4})`;
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.moveTo(effect.from.x + nx * 2, effect.from.y + ny * 2);
      ctx.lineTo(effect.to.x + nx * 2, effect.to.y + ny * 2);
      ctx.stroke();
      ctx.restore();

      this.drawContained(ctx, 'baizeInsightMark', effect.to.x, effect.to.y, 30, 30, {
        alpha: Math.min(1, 0.45 + alpha * 0.55),
        scale: 1 + (1 - alpha) * 0.12,
        filter: 'brightness(1.35) saturate(1.15)',
      });
    });
    game.effects.filter(effect => effect.type === 'zhuyanCharge').forEach(effect => {
      const source = game.enemies.find(enemy => enemy.id === effect.sourceId);
      const point = source ?? effect;
      const progress = 1 - effect.life / effect.duration;
      this.drawContained(ctx, 'zhuyanCharge', point.x, point.y + 2, 66 + progress * 24, 66 + progress * 24, {
        alpha: effect.stage === 'telegraph' ? 0.55 : Math.max(0.35, effect.life / effect.duration),
      });
    });
    game.effects.filter(effect => effect.type === 'liliArmorBreak').forEach(effect => {
      const progress = 1 - effect.life / effect.duration;
      this.drawContained(ctx, 'liliArmorBreak', effect.x, effect.y, 76 + progress * 34, 76 + progress * 34, { alpha: effect.life / effect.duration });
    });
    game.effects.filter(effect => effect.type === 'yangmuArmorBreak').forEach(effect => {
      const progress = 1 - effect.life / effect.duration;
      this.drawContained(ctx, 'yangmuArmorBreak', effect.x, effect.y, 78 + progress * 28, 78 + progress * 28, { alpha: effect.life / effect.duration });
    });
    game.effects.filter(effect => effect.type === 'jinwuPhase2').forEach(effect => {
      const source = game.enemies.find(enemy => enemy.id === effect.sourceId);
      const point = source ?? effect;
      const progress = 1 - effect.life / effect.duration;
      this.drawContained(ctx, 'jinwuPhase2', point.x, point.y, 126 + progress * 36, 126 + progress * 36, {
        alpha: Math.max(0.3, effect.life / effect.duration), rotation: progress * Math.PI * 0.35,
      });
    });
    game.effects.filter(effect => effect.type === 'xingtianShield').forEach(effect => {
      const source = game.enemies.find(enemy => enemy.id === effect.sourceId);
      const point = source ?? effect;
      this.drawContained(ctx, 'xingtianShield', point.x, point.y, 112, 112, { alpha: Math.max(0.35, effect.life / effect.duration) });
    });
    game.effects.filter(effect => effect.type === 'xingtianEvolution').forEach(effect => {
      const progress = 1 - effect.life / effect.duration;
      this.drawContained(ctx, 'xingtianEvolution', effect.x, effect.y, 116 + progress * 42, 116 + progress * 42, { alpha: effect.life / effect.duration });
    });
    game.effects.filter(effect => ['xingtianEarthquakeWindup', 'xingtianEarthquake'].includes(effect.type)).forEach(effect => {
      const source = game.enemies.find(enemy => enemy.id === effect.sourceId);
      const point = source ?? effect;
      const progress = 1 - effect.life / effect.duration;
      const diameter = effect.type === 'xingtianEarthquake' ? effect.radius * 2.15 : 72 + progress * 34;
      this.drawContained(ctx, 'xingtianEarthquake', point.x, point.y + 10, diameter, diameter, { alpha: Math.max(0.3, effect.life / effect.duration) });
    });
    game.effects.filter(effect => effect.type === 'jiuweihuEvolution').forEach(effect => {
      const progress = 1 - effect.life / effect.duration;
      this.drawContained(ctx, 'jiuweihuPhaseAura', effect.x, effect.y, 110 + progress * 45, 110 + progress * 45, { alpha: effect.life / effect.duration, rotation: progress * Math.PI });
    });
    game.effects.filter(effect => effect.type === 'jiuweihuSkill').forEach(effect => {
      const progress = 1 - effect.life / effect.duration;
      const id = effect.skill === 'bossShield' ? 'jiuweihuPhaseAura' : effect.skill === 'bossStep' ? 'jiuweihuProjectile' : 'jiuweihuBurst';
      this.drawContained(ctx, id, effect.x, effect.y, 86 + progress * 30, 86 + progress * 30, { alpha: Math.max(0.3, effect.life / effect.duration) });
    });
    game.effects.filter(effect => effect.type === 'jiuweihuUltimate').forEach(effect => {
      const progress = 1 - effect.life / effect.duration;
      this.drawContained(ctx, 'jiuweihuUltimate', effect.x, effect.y, 125 + progress * 40, 125 + progress * 40, { alpha: Math.min(1, effect.life) });
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
    game.effects.filter(effect => ['xiangliuHealPulse', 'xiangliuEnragePulse'].includes(effect.type)).forEach(effect => {
      const progress = 1 - effect.life / effect.duration;
      const id = effect.type === 'xiangliuHealPulse' ? 'waterRing' : 'whirlpool';
      const size = effect.type === 'xiangliuHealPulse' ? 116 + progress * 64 : 82 + progress * 34;
      this.drawContained(ctx, id, effect.x, effect.y + 6, size, size, {
        alpha: Math.max(0, effect.life / effect.duration),
        rotation: effect.type === 'xiangliuEnragePulse' ? progress * Math.PI : 0,
      });
    });
    game.effects.filter(effect => effect.type === 'bossHealText').forEach(effect => {
      const progress = 1 - effect.life / effect.duration;
      ctx.save();
      ctx.globalAlpha = Math.min(1, effect.life * 2.2);
      ctx.fillStyle = '#b9fbff';
      ctx.strokeStyle = 'rgba(5,35,45,.92)';
      ctx.lineWidth = 4;
      ctx.font = 'bold 17px system-ui';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      const y = effect.y - 38 - progress * 20;
      ctx.strokeText(`+${effect.amount} HP`, effect.x, y);
      ctx.fillText(`+${effect.amount} HP`, effect.x, y);
      ctx.restore();
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

import { MAP_DATA, TOWER_DATA, ENEMY_DATA } from '../config/gameData.js?v=level9-1';
import { ArtStore } from '../config/artAssets.js?v=level9-visual-3';
import { ENABLE_UNIT_MOTION, UNIT_MOTION_CONFIG } from '../config/motionData.js?v=level9-1';
import { MotionSystem } from '../systems/MotionSystem.js?v=level9-1';
import { ENEMY_VISUALS } from '../config/enemyVisuals.js?v=level9-1';

const TOWER_BOXES = Object.freeze({ bifang: [54, 58], fuzhu: [48, 58], yinglong: [56, 54], baize: [56, 58], jumang: [56, 58], xuangui: [58, 56] });
const blessingStacks = (modifiers, key, step = 1) => Math.max(0, Math.min(2, Math.round((modifiers?.[key] ?? 0) / step)));
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
    this.drawLevelNineEnvironment(ctx, game);
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
      const drift = Math.sin(time * 0.34) * 8;
      const fog = ctx.createRadialGradient(area.x + area.width / 2 + drift, area.y + area.height / 2, 2, area.x + area.width / 2 + drift, area.y + area.height / 2, area.width * 0.58);
      fog.addColorStop(0, 'rgba(163, 207, 205, .16)');
      fog.addColorStop(0.55, 'rgba(104, 165, 169, .10)');
      fog.addColorStop(1, 'rgba(104, 165, 169, 0)');
      ctx.fillStyle = fog;
      ctx.fillRect(area.x, area.y, area.width, area.height);
    }
    if (motion.ripple) {
      const area = motion.ripple;
      const phase = (time * 0.35) % 1;
      ctx.save();
      ctx.strokeStyle = `rgba(138, 226, 211, ${0.24 * (1 - phase)})`;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.ellipse(area.x + area.width / 2, area.y + area.height / 2, 7 + phase * 35, 3 + phase * 15, -0.08, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }
    if (motion.bubbles) {
      const area = motion.bubbles;
      ctx.save();
      ctx.fillStyle = 'rgba(158, 233, 218, .24)';
      for (let index = 0; index < 5; index += 1) {
        const phase = (time * (0.28 + index * 0.025) + index * 0.19) % 1;
        const x = area.x + 9 + (index * 14) % Math.max(18, area.width - 14);
        const y = area.y + area.height * (1 - phase);
        ctx.beginPath(); ctx.arc(x, y, 2.5 + index * 0.45, 0, Math.PI * 2); ctx.fill();
      }
      ctx.restore();
    }
    if (motion.reeds) {
      const area = motion.reeds;
      ctx.save();
      ctx.strokeStyle = 'rgba(129, 171, 103, .42)';
      ctx.lineWidth = 1.5;
      for (let index = 0; index < 5; index += 1) {
        const x = area.x + 5 + index * 10;
        const sway = Math.sin(time * 0.65 + index * 0.7) * 5;
        ctx.beginPath(); ctx.moveTo(x, area.y + area.height); ctx.quadraticCurveTo(x + sway, area.y + area.height * 0.48, x + sway, area.y + 6); ctx.stroke();
      }
      ctx.restore();
    }
  }
  drawLevelNineEnvironment(ctx, game) {
    if (game.level.id !== 9) return;
    const time = game.visualTime ?? 0;
    const state = game.dayNight?.state ?? 'day';
    const telegraph = Boolean(game.dayNight?.telegraph);
    const anchor = game.level.map.celestialAnchor;
    const warm = state === 'day';

    // Keep the approved daytime presentation at its original luminance.
    // Readability comes from making night distinctly darker, not from over-brightening day.
    ctx.save();
    if (warm) {
      ctx.globalCompositeOperation = 'source-over';
      ctx.fillStyle = 'rgba(154,45,18,.075)';
      ctx.fillRect(0, 0, game.level.map.width, game.level.map.height);
    } else {
      ctx.globalCompositeOperation = 'multiply';
      ctx.fillStyle = 'rgba(20,27,61,.42)';
      ctx.fillRect(0, 0, game.level.map.width, game.level.map.height);
      ctx.globalCompositeOperation = 'source-over';
      ctx.fillStyle = 'rgba(45,63,145,.10)';
      ctx.fillRect(0, 0, game.level.map.width, game.level.map.height);
    }

    // Slow cloud drift stays in the existing upper-right mist bank.
    const cloudX = 286 + Math.sin(time * 0.22) * 7;
    const cloud = ctx.createRadialGradient(cloudX, 115, 4, cloudX, 115, 78);
    cloud.addColorStop(0, warm ? 'rgba(232,174,139,.09)' : 'rgba(145,161,221,.12)');
    cloud.addColorStop(1, 'rgba(80,92,137,0)');
    ctx.fillStyle = cloud;
    ctx.fillRect(205, 64, 164, 105);

    // Two visible hanging banners receive a restrained 3-4px tip sway.
    ctx.strokeStyle = 'rgba(245,104,61,.25)';
    ctx.lineWidth = 2;
    for (const [x, y, height, phase] of [[66, 194, 76, 0], [321, 157, 74, 1.2]]) {
      const sway = Math.sin(time * 0.7 + phase) * 4;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.quadraticCurveTo(x + sway * 0.45, y + height * 0.52, x + sway, y + height);
      ctx.stroke();
    }

    // Corona breathing is localized at the frozen celestial shrine anchor.
    const breath = 0.5 + Math.sin(time * 0.8) * 0.5;
    const corona = ctx.createRadialGradient(anchor.x, anchor.y, 3, anchor.x, anchor.y, 31 + breath * 5);
    corona.addColorStop(0, warm ? 'rgba(255,223,126,.23)' : 'rgba(169,204,255,.22)');
    corona.addColorStop(0.55, warm ? 'rgba(255,103,45,.10)' : 'rgba(91,117,219,.11)');
    corona.addColorStop(1, 'rgba(85,44,62,0)');
    ctx.fillStyle = corona;
    ctx.fillRect(anchor.x - 40, anchor.y - 40, 80, 80);

    // Four sparse embers/stars keep ambient motion subordinate to combat cues.
    ctx.fillStyle = warm ? 'rgba(255,182,90,.34)' : 'rgba(184,205,255,.3)';
    for (let index = 0; index < 4; index += 1) {
      const phase = (time * (0.13 + index * 0.018) + index * 0.23) % 1;
      const x = 147 + index * 47 + Math.sin(time * 0.5 + index) * 3;
      const y = 358 - phase * 170;
      ctx.beginPath(); ctx.arc(x, y, 1.5 + index * 0.35, 0, Math.PI * 2); ctx.fill();
    }

    if (telegraph) {
      const pulse = 0.5 + Math.sin(time * 9) * 0.5;
      ctx.strokeStyle = warm ? `rgba(255,225,145,${0.72 + pulse * 0.24})` : `rgba(195,220,255,${0.72 + pulse * 0.24})`;
      ctx.lineWidth = 3;
      ctx.beginPath(); ctx.arc(anchor.x, anchor.y, 30 + pulse * 7, 0, Math.PI * 2); ctx.stroke();
      ctx.lineWidth = 1.3;
      ctx.beginPath(); ctx.arc(anchor.x, anchor.y, 43 + pulse * 9, 0, Math.PI * 2); ctx.stroke();
    }
    ctx.restore();
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
  drawContained(ctx, id, x, y, boxWidth, boxHeight, { anchorX = 0.5, anchorY = 0.5, mirror = false, rotation = 0, alpha = 1, scale: visualScale = 1, filter = 'none' } = {}) {
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
    ctx.drawImage(image, -width * anchorX, -height * anchorY, width, height);
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
      const drewPlatform = this.drawContained(ctx, 'slotPlatform', slot.x, slot.y, 52, 40, { anchorY: 115.842 / 197 });
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
      if (index === game.selectedSlot) {
        const range = tower.getStats(game.blessings.modifiers, game.teamIntervalMultiplier?.() ?? 1).range;
        const rangeStacks = tower.type === 'fuzhu'
          ? blessingStacks(game.blessings.modifiers, 'fuzhuRange', 0.2)
          : tower.type === 'jumang'
            ? blessingStacks(game.blessings.modifiers, 'jumangRange', 0.15)
            : tower.type === 'baize'
              ? blessingStacks(game.blessings.modifiers, 'baizeSight', 1)
              : 0;
        ctx.beginPath(); ctx.arc(tower.x, tower.y, range, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(241,205,103,.09)'; ctx.fill();
        ctx.strokeStyle = rangeStacks ? 'rgba(255,232,151,.92)' : 'rgba(241,205,103,.65)';
        ctx.lineWidth = rangeStacks ? 2.2 : 1.5; ctx.stroke();
        if (rangeStacks) {
          ctx.save();
          ctx.setLineDash([5, 5]);
          ctx.strokeStyle = rangeStacks === 2 ? 'rgba(255,244,196,.9)' : 'rgba(255,225,132,.72)';
          ctx.lineWidth = 1.2;
          ctx.beginPath(); ctx.arc(tower.x, tower.y, Math.max(8, range - 4 - rangeStacks * 2), 0, Math.PI * 2); ctx.stroke();
          ctx.restore();
        }
      }
      const springStacks = blessingStacks(game.blessings.modifiers, 'jumangSpring', 1);
      if (springStacks) {
        const pulse = 0.5 + Math.sin((game.visualTime ?? 0) * 4 + index) * 0.5;
        ctx.save();
        ctx.globalAlpha = 0.35 + pulse * 0.18;
        ctx.strokeStyle = springStacks === 2 ? '#caff9c' : '#9cf2a8';
        ctx.lineWidth = 1.4 + springStacks * 0.35;
        ctx.beginPath(); ctx.arc(tower.x, tower.y + 6, 24 + pulse * 2, 0.15 * Math.PI, 0.85 * Math.PI); ctx.stroke();
        ctx.restore();
      }
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
      if (enemy.type === 'tiangou' && enemy.dayNightState === 'day' && !enemy.isIllusion) {
        ctx.save();
        ctx.strokeStyle = 'rgba(255,174,78,.72)';
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        for (let streak = 0; streak < 3; streak += 1) {
          ctx.beginPath();
          ctx.moveTo(enemy.x - 13 - streak * 5, enemy.y - 5 + streak * 5);
          ctx.lineTo(enemy.x - 25 - streak * 7, enemy.y - 5 + streak * 5);
          ctx.stroke();
        }
        ctx.restore();
      }
      if (enemy.type === 'zheng' && enemy.dayNightState === 'night' && !enemy.isIllusion) {
        ctx.save();
        ctx.strokeStyle = 'rgba(159,202,255,.84)';
        ctx.lineWidth = 2.4;
        ctx.beginPath(); ctx.arc(enemy.x, enemy.y, enemy.radius + 7, 0, Math.PI * 2); ctx.stroke();
        ctx.restore();
      }
      if (enemy.type === 'zhulong' && (enemy.bossPhase ?? 1) >= 2) {
        const pulse = 0.5 + Math.sin((game.visualTime ?? 0) * 2.4) * 0.5;
        ctx.save();
        ctx.strokeStyle = `rgba(211,180,255,${0.5 + pulse * 0.28})`;
        ctx.lineWidth = 3;
        ctx.beginPath(); ctx.arc(enemy.x, enemy.y, enemy.radius + 12 + pulse * 4, 0, Math.PI * 2); ctx.stroke();
        ctx.restore();
      }
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
      if (enemy.statuses.burn) {
        const burnStacks = blessingStacks(game.blessings.modifiers, 'bifangBurn', 4);
        const flicker = 0.5 + Math.sin((game.visualTime ?? 0) * 11 + enemy.pathDistance * 0.07) * 0.5;
        ctx.save();
        ctx.globalAlpha = 0.62 + flicker * 0.25;
        ctx.fillStyle = burnStacks === 2 ? '#ffd45c' : '#ff8a38';
        for (const offset of [-6, 0, 6]) {
          const h = 5 + burnStacks * 2 + (offset === 0 ? 3 : 0);
          ctx.beginPath();
          ctx.moveTo(enemy.x + offset - 2, enemy.y - enemy.radius + 2);
          ctx.quadraticCurveTo(enemy.x + offset, enemy.y - enemy.radius - h - flicker * 2, enemy.x + offset + 2, enemy.y - enemy.radius + 2);
          ctx.fill();
        }
        ctx.restore();
      }
      if (enemy.statuses.slow) {
        const slowStacks = blessingStacks(game.blessings.modifiers, 'fuzhuSlow', 0.1);
        const vulnerableStacks = blessingStacks(game.blessings.modifiers, 'slowedVulnerability', 0.1);
        const size = (enemy.radius + 9 + slowStacks * 2) * 2;
        if (!this.drawContained(ctx, 'slowMark', enemy.x, enemy.y + 1, size, size, { alpha: 0.82 + slowStacks * 0.07 })) {
          ctx.save(); ctx.strokeStyle = 'rgba(104,224,255,.95)'; ctx.lineWidth = 2.5 + slowStacks * 0.6;
          ctx.beginPath(); ctx.arc(enemy.x, enemy.y, enemy.radius + 7 + slowStacks * 2, 0, Math.PI * 2); ctx.stroke(); ctx.restore();
        }
        if (vulnerableStacks) {
          ctx.save();
          ctx.strokeStyle = vulnerableStacks === 2 ? '#f4feff' : '#bdeeff';
          ctx.lineWidth = 1.4 + vulnerableStacks * 0.4;
          for (let crack = 0; crack < 3; crack += 1) {
            const a = crack * Math.PI * 2 / 3 - 0.5;
            const r0 = enemy.radius + 4;
            const r1 = enemy.radius + 10 + vulnerableStacks * 2;
            ctx.beginPath();
            ctx.moveTo(enemy.x + Math.cos(a) * r0, enemy.y + Math.sin(a) * r0);
            ctx.lineTo(enemy.x + Math.cos(a + 0.08) * r1, enemy.y + Math.sin(a + 0.08) * r1);
            ctx.stroke();
          }
          ctx.restore();
        }
      }
      if (enemy.statuses.insight) {
        const insightStacks = blessingStacks(game.blessings.modifiers, 'baizeVulnerability', 0.05);
        const sightStacks = blessingStacks(game.blessings.modifiers, 'baizeSight', 1);
        this.drawContained(ctx, 'baizeInsightMark', enemy.x, enemy.y, (enemy.radius + 11 + insightStacks * 2) * 2, (enemy.radius + 11 + insightStacks * 2) * 2, {
          alpha: 0.9,
          filter: insightStacks ? `brightness(${1.15 + insightStacks * 0.12}) saturate(${1.1 + insightStacks * 0.12})` : '',
        });
        if (sightStacks) {
          ctx.save();
          ctx.strokeStyle = sightStacks === 2 ? 'rgba(244,255,216,.9)' : 'rgba(209,255,242,.7)';
          ctx.lineWidth = 1 + sightStacks * 0.35;
          ctx.beginPath(); ctx.arc(enemy.x, enemy.y, enemy.radius + 14 + sightStacks * 2, 0, Math.PI * 2); ctx.stroke();
          ctx.restore();
        }
      }
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
      const { width, height, anchorX: visualAnchorX, anchorY: visualAnchorY } = ENEMY_VISUALS[enemy.type];
      const motion = MotionSystem.enemyTransform(enemy, game.visualTime ?? 0, game.effects, this.motionEnabled);
      const spriteOptions = { anchorX: visualAnchorX, anchorY: visualAnchorY, mirror: next.x < enemy.x, scale: motion.scale, alpha: enemy.isIllusion ? 0.52 : 1 };
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
        if (enemy.type === 'tiangou' && enemy.dayNightState === 'day') this.drawStateTag(ctx, '晝馳', enemy.x, tagY, { fill: '#ffe7a2', background: 'rgba(91,42,12,.88)' });
        if (enemy.type === 'zheng' && enemy.dayNightState === 'night') this.drawStateTag(ctx, '夜甲', enemy.x, tagY, { fill: '#d9e8ff', background: 'rgba(25,38,79,.9)' });
        if (enemy.type === 'zhulong' && (enemy.bossPhase ?? 1) >= 2) this.drawStateTag(ctx, '極夜', enemy.x, tagY, { fill: '#f0dcff', background: 'rgba(53,22,80,.92)' });
      }
      if (enemy.hitFlash > 0 && !enemy.isBoss && !enemy.isIllusion) this.healthBar(ctx, enemy.x - 17, enemy.y - enemy.radius - 10, 34, enemy.hp / enemy.maxHp);
    });
  }
  healthBar(ctx, x, y, width, ratio) { ctx.fillStyle = '#28181b'; ctx.fillRect(x, y, width, 4); ctx.fillStyle = ratio > .5 ? '#77d176' : '#e35757'; ctx.fillRect(x, y, width * Math.max(0, ratio), 4); }
  drawProjectiles(ctx, game) {
    game.projectiles.forEach(p => {
      const angle = Math.atan2(p.targetPoint.y - p.y, p.targetPoint.x - p.x);

      // 玄龜: moving crescent/tide front, intentionally not another blue orb.
      if (p.type === 'xuangui') {
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(angle);
        ctx.lineCap = 'round';
        ctx.shadowColor = 'rgba(94,239,226,.78)';
        ctx.shadowBlur = 6;
        const waveStacks = blessingStacks(game.blessings.modifiers, 'xuanguiShockDamage', 0.2);
        ctx.strokeStyle = waveStacks === 2 ? '#d7fffb' : waveStacks === 1 ? '#a9fbf1' : '#8ff5eb';
        ctx.lineWidth = 3.2 + waveStacks * 0.5;
        ctx.beginPath();
        ctx.arc(0, 0, 8, -1.05, 1.05);
        ctx.stroke();
        ctx.shadowBlur = 0;
        ctx.strokeStyle = 'rgba(69,193,199,.64)';
        ctx.lineWidth = 1.7;
        ctx.beginPath();
        ctx.arc(-5, 0, 10, -0.9, 0.9);
        ctx.stroke();
        ctx.restore();
        return;
      }

      // 夫諸: long ice crystal / spear silhouette instead of a generic blue pellet.
      if (p.type === 'fuzhu') {
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(angle);
        ctx.shadowColor = 'rgba(158,238,255,.65)';
        const slowStacks = blessingStacks(game.blessings.modifiers, 'fuzhuSlow', 0.1);
        ctx.shadowBlur = 5 + slowStacks * 2;
        ctx.fillStyle = slowStacks === 2 ? '#f4feff' : '#d9fbff';
        ctx.strokeStyle = '#72d7ed';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(12, 0);
        ctx.lineTo(-3, -4.2);
        ctx.lineTo(-9, 0);
        ctx.lineTo(-3, 4.2);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        ctx.shadowBlur = 0;
        ctx.strokeStyle = 'rgba(154,232,255,.55)';
        ctx.beginPath();
        ctx.moveTo(-9, 0);
        ctx.lineTo(-17, 0);
        ctx.stroke();
        ctx.restore();
        return;
      }

      if (p.type === 'jumang') {
        // 句芒: visibly spinning curved leaf-blade plus a short green wake.
        ctx.save();
        ctx.strokeStyle = 'rgba(141,242,174,.68)';
        ctx.lineWidth = 2.4;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(p.x - Math.cos(angle) * 11, p.y - Math.sin(angle) * 11);
        ctx.stroke();
        ctx.restore();
        const damageStacks = blessingStacks(game.blessings.modifiers, 'jumangDamage', 0.2);
        const spin = (game.visualTime ?? 0) * (11 + damageStacks * 1.5);
        if (this.drawContained(ctx, 'jumangLeafblade', p.x, p.y, 24 + damageStacks * 2, 11 + damageStacks, {
          rotation: angle + spin,
          filter: damageStacks ? `brightness(${1.08 + damageStacks * 0.08}) saturate(${1.08 + damageStacks * 0.12})` : '',
        })) return;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(angle + spin);
        ctx.fillStyle = '#8df2ae';
        ctx.beginPath();
        ctx.ellipse(0, 0, 9, 3.5, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
        return;
      }

      // 畢方 keeps its established fireball identity; damage blessings intensify the fireball without changing hit logic.
      const bifangDamageStacks = blessingStacks(game.blessings.modifiers, 'bifangDamage', 0.2);
      if (this.drawContained(ctx, 'bifangFireball', p.x, p.y, 19 + bifangDamageStacks * 2, 13 + bifangDamageStacks, {
        rotation: angle,
        filter: bifangDamageStacks ? `brightness(${1.08 + bifangDamageStacks * 0.08}) saturate(${1.1 + bifangDamageStacks * 0.12})` : '',
      })) return;
      ctx.beginPath(); ctx.arc(p.x, p.y, 6, 0, Math.PI * 2); ctx.fillStyle = '#ff7b38'; ctx.fill();
    });
  }
  drawEffects(ctx, game) {
    game.effects.filter(effect => effect.type === 'xuanguiImpact').forEach(effect => {
      const progress = 1 - effect.life / effect.duration;
      const waveStacks = blessingStacks(game.blessings.modifiers, 'xuanguiShockDamage', 0.2);
      ctx.save();
      ctx.globalAlpha = Math.max(0, effect.life / effect.duration);
      ctx.strokeStyle = waveStacks === 2 ? '#e7fffb' : '#9ff6ec';
      ctx.lineWidth = 2 + waveStacks * 0.6;
      ctx.beginPath(); ctx.arc(effect.x, effect.y, 5 + progress * (10 + waveStacks * 2), 0, Math.PI * 2); ctx.stroke();
      ctx.restore();
    });
    game.effects.filter(effect => effect.type === 'xuanguiShockTelegraph').forEach(effect => {
      const progress = 1 - effect.life / effect.duration;
      const radiusStacks = blessingStacks(game.blessings.modifiers, 'xuanguiShockRadius', 8);
      ctx.save();
      ctx.globalAlpha = Math.max(0, effect.life / effect.duration);
      ctx.strokeStyle = radiusStacks === 2 ? '#d8fffa' : '#82eee3'; ctx.lineWidth = 1.8 + radiusStacks * 0.5;
      ctx.beginPath(); ctx.arc(effect.x, effect.y, effect.radius * (0.7 - progress * 0.42), 0, Math.PI * 2); ctx.stroke();
      if (radiusStacks) {
        ctx.strokeStyle = 'rgba(181,255,245,.6)';
        ctx.lineWidth = 1;
        ctx.beginPath(); ctx.arc(effect.x, effect.y, effect.radius * (0.82 - progress * 0.34), 0, Math.PI * 2); ctx.stroke();
      }
      ctx.restore();
    });
    game.effects.filter(effect => effect.type === 'xuanguiShock').forEach(effect => {
      const progress = 1 - effect.life / effect.duration;
      const damageStacks = blessingStacks(game.blessings.modifiers, 'xuanguiShockDamage', 0.2);
      const pushStacks = blessingStacks(game.blessings.modifiers, 'xuanguiShockPushback', 5);
      ctx.save();
      ctx.globalAlpha = Math.max(0, effect.life / effect.duration);
      for (let ring = 0; ring < 2 + (damageStacks === 2 ? 1 : 0); ring += 1) {
        const ringProgress = Math.max(0, Math.min(1, progress * 1.35 - ring * 0.18));
        ctx.strokeStyle = ring === 0 ? '#b5fff4' : ring === 1 ? '#57d7d1' : 'rgba(211,255,249,.72)';
        ctx.lineWidth = Math.max(1, 3 + damageStacks * 0.35 - ring);
        ctx.beginPath(); ctx.arc(effect.x, effect.y, 8 + ringProgress * effect.radius, 0, Math.PI * 2); ctx.stroke();
      }
      const mist = ctx.createRadialGradient(effect.x, effect.y - 4, 0, effect.x, effect.y - 4, effect.radius * 0.72);
      mist.addColorStop(0, 'rgba(181,255,245,.2)'); mist.addColorStop(1, 'rgba(67,190,188,0)');
      ctx.fillStyle = mist; ctx.fillRect(effect.x - effect.radius, effect.y - effect.radius, effect.radius * 2, effect.radius * 1.5);
      if (pushStacks) {
        ctx.strokeStyle = pushStacks === 2 ? 'rgba(220,255,250,.85)' : 'rgba(151,244,237,.72)';
        ctx.lineWidth = 1.5 + pushStacks * 0.4;
        for (let streak = -1; streak <= 1; streak += 1) {
          ctx.beginPath();
          ctx.moveTo(effect.x + streak * 8, effect.y + 4);
          ctx.lineTo(effect.x + streak * 11, effect.y + 14 + pushStacks * 3);
          ctx.stroke();
        }
      }
      ctx.restore();
    });
    game.effects.filter(effect => effect.type === 'huasheTideTelegraph').forEach(effect => {
      const source = game.enemies?.find(enemy => enemy.id === effect.sourceId);
      const point = source ?? effect;
      const progress = 1 - effect.life / effect.duration;
      ctx.save();
      ctx.globalAlpha = Math.max(0, effect.life / effect.duration);
      ctx.strokeStyle = '#a8f5ea';
      ctx.lineWidth = 2.4;
      ctx.beginPath(); ctx.arc(point.x, point.y, 28 + progress * 22, 0, Math.PI * 2); ctx.stroke();
      ctx.strokeStyle = 'rgba(91, 221, 207, .7)';
      ctx.lineWidth = 1.2;
      ctx.beginPath(); ctx.arc(point.x, point.y, 42 + progress * 28, 0, Math.PI * 2); ctx.stroke();
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
    game.effects.filter(effect => effect.type === 'zhulongPhase2').forEach(effect => {
      const source = game.enemies?.find(enemy => enemy.id === effect.sourceId);
      const point = source ?? effect;
      const progress = 1 - effect.life / effect.duration;
      ctx.save();
      ctx.globalAlpha = Math.max(0, effect.life / effect.duration);
      for (let ring = 0; ring < 3; ring += 1) {
        ctx.strokeStyle = ring === 0 ? '#fff0bd' : 'rgba(190,147,255,.82)';
        ctx.lineWidth = 4 - ring;
        ctx.beginPath(); ctx.arc(point.x, point.y, 34 + ring * 12 + progress * 28, 0, Math.PI * 2); ctx.stroke();
      }
      ctx.restore();
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
      const { width, height, anchorX: visualAnchorX, anchorY: visualAnchorY } = ENEMY_VISUALS[effect.unitType];
      const motion = MotionSystem.deathTransform(effect);
      const id = effect.unitType === 'jiuweihu'
        ? `jiuweihuPhase${effect.bossPhase ?? 1}`
        : effect.unitType === 'xingtian'
          ? `xingtianPhase${effect.bossPhase ?? 1}`
          : effect.unitType;
      this.drawContained(ctx, id, effect.x, effect.y, width, height, {
        anchorX: visualAnchorX, anchorY: visualAnchorY, mirror: effect.mirror, scale: motion.scale, alpha: motion.alpha,
      });
    });
    game.effects.filter(effect => effect.type === 'baizeInsight').forEach(effect => {
      const alpha = Math.max(0, effect.life / effect.duration);
      const dx = effect.to.x - effect.from.x;
      const dy = effect.to.y - effect.from.y;
      const length = Math.hypot(dx, dy) || 1;
      const ux = dx / length;
      const uy = dy / length;
      const nx = -uy;
      const ny = ux;
      ctx.save();
      // 白澤 is a brief "insight flash", not a sustained beam like 應龍.
      ctx.lineCap = 'round';
      ctx.setLineDash([8, 7]);
      ctx.lineDashOffset = -6 * (1 - alpha);
      const insightStacks = blessingStacks(game.blessings.modifiers, 'baizeVulnerability', 0.05);
      ctx.strokeStyle = `rgba(206,253,255,${0.18 + alpha * 0.62})`;
      ctx.lineWidth = 1.6 + insightStacks * 0.45;
      ctx.beginPath();
      ctx.moveTo(effect.from.x + ux * 8, effect.from.y + uy * 8);
      ctx.lineTo(effect.to.x - ux * 8, effect.to.y - uy * 8);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.strokeStyle = `rgba(255,255,226,${0.32 + alpha * 0.5})`;
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(effect.to.x - nx * 7, effect.to.y - ny * 7);
      ctx.lineTo(effect.to.x + nx * 7, effect.to.y + ny * 7);
      ctx.moveTo(effect.to.x - ux * 7, effect.to.y - uy * 7);
      ctx.lineTo(effect.to.x + ux * 7, effect.to.y + uy * 7);
      ctx.stroke();
      ctx.restore();

      const durationStacks = blessingStacks(game.blessings.modifiers, 'baizeInsightDuration', 1);
      this.drawContained(ctx, 'baizeInsightMark', effect.to.x, effect.to.y, 34 + insightStacks * 3, 34 + insightStacks * 3, {
        alpha: Math.min(1, 0.55 + alpha * 0.45),
        scale: 1 + (1 - alpha) * (0.16 + durationStacks * 0.03),
        filter: `brightness(${1.4 + insightStacks * 0.1}) saturate(${1.2 + insightStacks * 0.08})`,
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
      const radiusStacks = blessingStacks(game.blessings.modifiers, 'bifangRadius', 0.2);
      const damageStacks = blessingStacks(game.blessings.modifiers, 'bifangDamage', 0.2);
      const drewArt = this.drawContained(ctx, 'bifangExplosion', effect.x, effect.y, radius * 2.2, radius * 2.2, {
        alpha,
        filter: damageStacks ? `brightness(${1.08 + damageStacks * 0.08}) saturate(${1.08 + damageStacks * 0.1})` : '',
      });
      ctx.save();
      ctx.globalAlpha = alpha;
      if (!drewArt) {
        ctx.fillStyle = 'rgba(255,105,44,.2)';
        ctx.strokeStyle = '#ffb33f';
        ctx.lineWidth = 4 - progress * 2;
        ctx.beginPath(); ctx.arc(effect.x, effect.y, radius, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      }
      if (radiusStacks) {
        ctx.strokeStyle = radiusStacks === 2 ? 'rgba(255,244,169,.98)' : 'rgba(255,194,78,.92)';
        ctx.lineWidth = 2 + radiusStacks * 0.6;
        ctx.beginPath(); ctx.arc(effect.x, effect.y, radius * (1.02 + radiusStacks * 0.04), 0, Math.PI * 2); ctx.stroke();
        if (radiusStacks === 2) {
          ctx.strokeStyle = 'rgba(255,138,52,.58)';
          ctx.lineWidth = 1.2;
          ctx.beginPath(); ctx.arc(effect.x, effect.y, radius * 1.14, 0, Math.PI * 2); ctx.stroke();
        }
      }
      ctx.strokeStyle = 'rgba(255,239,148,.9)'; ctx.lineWidth = 2;
      effect.hitPoints.forEach(point => { ctx.beginPath(); ctx.arc(point.x, point.y, 8 + progress * 6, 0, Math.PI * 2); ctx.stroke(); });
      ctx.restore();
    });
    game.effects.filter(effect => effect.type === 'beam').forEach(effect => {
      const alpha = Math.max(0, effect.life / effect.duration);
      const damageStacks = effect.damageStacks ?? 0;
      const penetrationStacks = effect.penetrationStacks ?? 0;
      const bossStacks = effect.bossStacks ?? 0;
      const segments = effect.points.slice(1).map((point, index) => [effect.points[index], point]);
      const beamWidth = 12 + damageStacks * 1.5;
      const drewArt = segments.length && segments.every(([start, end]) => this.drawDirectional(ctx, 'yinglongBeam', start, end, beamWidth, alpha));
      ctx.save();
      ctx.lineCap = 'round'; ctx.lineJoin = 'round';
      if (!drewArt) {
        ctx.strokeStyle = `rgba(255,220,87,${alpha})`; ctx.lineWidth = 6 + damageStacks;
        ctx.beginPath();
        effect.points.forEach((point, index) => index === 0 ? ctx.moveTo(point.x, point.y) : ctx.lineTo(point.x, point.y));
        ctx.stroke();
        ctx.strokeStyle = `rgba(255,250,205,${alpha})`; ctx.lineWidth = 2 + damageStacks * 0.35; ctx.stroke();
      }
      if (penetrationStacks) {
        ctx.strokeStyle = penetrationStacks === 2 ? `rgba(255,255,225,${alpha * 0.9})` : `rgba(255,236,144,${alpha * 0.72})`;
        ctx.lineWidth = 1 + penetrationStacks * 0.45;
        effect.points.slice(1).forEach(point => { ctx.beginPath(); ctx.arc(point.x, point.y, 7 + penetrationStacks * 2, 0, Math.PI * 2); ctx.stroke(); });
      }
      if (effect.bossHit && bossStacks) {
        const point = effect.points.at(-1);
        ctx.strokeStyle = `rgba(255,170,88,${alpha})`;
        ctx.lineWidth = 2 + bossStacks * 0.5;
        ctx.beginPath(); ctx.arc(point.x, point.y, 12 + bossStacks * 3, 0, Math.PI * 2); ctx.stroke();
      }
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
    const spawn = map.waypoints[0];
    ctx.textAlign = game.level.id === 9 ? 'center' : 'left'; ctx.textBaseline = 'middle'; ctx.font = 'bold 11px system-ui'; ctx.fillStyle = '#d7e7d8';
    ctx.fillText('敵人入口', game.level.id === 9 ? spawn.x : 10, game.level.id === 9 ? Math.max(14, spawn.y - 28) : 38);
    if (game.level.id === 8 || game.level.id === 9) {
      const base = map.waypoints.at(-1);
      ctx.textAlign = 'center';
      ctx.fillText(game.level.baseName, base.x, Math.min(map.height - 12, base.y + 28));
      return;
    }
    ctx.textAlign = 'right'; ctx.fillText(game.level.baseName, map.width - 10, map.height - 20);
  }
}

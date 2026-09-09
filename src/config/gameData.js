export const LEVEL_DATA = Object.freeze({
  id: 1,
  name: '崑崙山門',
  baseName: '山海關',
  bossType: 'qiongqi',
});

export const GAME_CONFIG = Object.freeze({
  baseHp: 20,
  initialGold: 300,
  preparationSeconds: 15,
  nextWaveSeconds: 3,
  totalWaves: 10,
  maxDelta: 0.1,
  sellRate: 0.6,
  deployedBlessingWeight: 2.5,
  bossBannerSeconds: 1.3,
});

export const TOWER_DATA = Object.freeze({
  bifang: { id: 'bifang', name: '畢方', emoji: '🔥', role: '範圍輸出', cost: 120, damage: 18, interval: 1, range: 130, projectileSpeed: 310, explosionRadius: 55, level3: { explosionRadiusMultiplier: 1.35 } },
  fuzhu: { id: 'fuzhu', name: '夫諸', emoji: '🦌', role: '緩速控場', cost: 100, damage: 8, interval: 1.2, range: 125, projectileSpeed: 360, slow: 0.25, slowDuration: 2, level3: { slowBonus: 0.15 } },
  yinglong: { id: 'yinglong', name: '應龍', emoji: '🐉', role: '高傷穿透', cost: 160, damage: 32, interval: 1.4, range: 170, projectileSpeed: 520, penetration: 2, level3: { penetrationBonus: 1 } },
});

export const ENEMY_DATA = Object.freeze({
  minion: { id: 'minion', name: '小妖', emoji: '👺', hp: 60, speed: 52, baseDamage: 1, reward: 10, radius: 12 },
  swift: { id: 'swift', name: '疾妖', emoji: '💨', hp: 40, speed: 88.4, baseDamage: 1, reward: 12, radius: 10 },
  giant: { id: 'giant', name: '巨妖', emoji: '👹', hp: 220, speed: 31.2, baseDamage: 3, reward: 25, radius: 16 },
  qiongqi: { id: 'qiongqi', name: '窮奇', emoji: '🐅', hp: 2500, speed: 23, baseDamage: 20, reward: 0, radius: 22, isBoss: true, bossMechanic: { type: 'frenzy', threshold: 0.5, speedMultiplier: 1.5 } },
  chiyu: { id: 'chiyu', name: '赤羽妖', emoji: '🪶', hp: 34, speed: 108, baseDamage: 1, reward: 9, radius: 10 },
  yanjia: { id: 'yanjia', name: '岩甲妖', emoji: '🪨', hp: 170, speed: 28, baseDamage: 2, reward: 20, radius: 16, normalDamageMultiplier: 0.65, minimumNormalDamage: 1 },
  paoxiao: { id: 'paoxiao', name: '狍鴞', emoji: '🐐', hp: 3600, speed: 19, baseDamage: 20, reward: 0, radius: 24, isBoss: true, bossMechanic: { type: 'consume', thresholds: [0.7, 0.4], healRatio: 0.08 } },
});

const wave = (groups, interval, modifiers = {}) => ({ groups, interval, ...modifiers });
export const WAVE_DATA = Object.freeze([
  wave([{ type: 'minion', count: 8 }], 1.05),
  wave([{ type: 'minion', count: 12 }], 0.95),
  wave([{ type: 'minion', count: 8 }, { type: 'swift', count: 4 }], 0.9),
  wave([{ type: 'minion', count: 12 }, { type: 'swift', count: 6 }], 0.82),
  wave([{ type: 'minion', count: 8 }, { type: 'giant', count: 3 }], 1.1),
  wave([{ type: 'minion', count: 14 }, { type: 'swift', count: 10 }], 0.68, { hpMultiplier: 1.5 }),
  wave([{ type: 'swift', count: 10 }, { type: 'giant', count: 7 }], 0.82, { hpMultiplier: 1.8 }),
  wave([{ type: 'minion', count: 18 }, { type: 'swift', count: 8 }, { type: 'giant', count: 5 }], 0.62, { hpMultiplier: 2.2 }),
  wave([{ type: 'swift', count: 16 }, { type: 'giant', count: 8 }], 0.7, { hpMultiplier: 2.8 }),
  wave([{ type: 'minion', count: 4 }, { type: 'qiongqi', count: 1 }], 1.2, { hpMultiplier: 2.4, bossHpMultiplier: 1.6 }),
]);

export const LEVEL2_WAVE_DATA = Object.freeze([
  wave([{ type: 'minion', count: 10 }], 1),
  wave([{ type: 'chiyu', count: 12 }], 0.82),
  wave([{ type: 'minion', count: 8 }, { type: 'chiyu', count: 10 }], 0.78, { hpMultiplier: 1.05 }),
  wave([{ type: 'yanjia', count: 6 }], 1.05, { hpMultiplier: 1.1 }),
  wave([{ type: 'swift', count: 8 }, { type: 'yanjia', count: 6 }], 0.88, { hpMultiplier: 1.15 }),
  wave([{ type: 'chiyu', count: 20 }, { type: 'minion', count: 8 }], 0.62, { hpMultiplier: 1.25 }),
  wave([{ type: 'yanjia', count: 8 }, { type: 'giant', count: 5 }], 0.92, { hpMultiplier: 1.35 }),
  wave([{ type: 'chiyu', count: 16 }, { type: 'swift', count: 10 }, { type: 'yanjia', count: 6 }], 0.6, { hpMultiplier: 1.5 }),
  wave([{ type: 'minion', count: 12 }, { type: 'chiyu', count: 18 }, { type: 'yanjia', count: 8 }, { type: 'giant', count: 4 }], 0.56, { hpMultiplier: 1.7 }),
  wave([{ type: 'chiyu', count: 10 }, { type: 'yanjia', count: 4 }, { type: 'paoxiao', count: 1 }], 0.9, { hpMultiplier: 1.55, bossHpMultiplier: 1.5 }),
]);

export const BLESSING_DATA = Object.freeze([
  { id: 'bifangDamage', name: '烈焰', description: '畢方傷害 +20%', tower: 'bifang', effect: { key: 'bifangDamage', add: 0.2 }, weight: 1 },
  { id: 'bifangRadius', name: '火海', description: '畢方爆炸範圍 +20%', tower: 'bifang', effect: { key: 'bifangRadius', add: 0.2 }, weight: 1 },
  { id: 'bifangBurn', name: '灼燒', description: '畢方命中附加持續傷害', tower: 'bifang', effect: { key: 'bifangBurn', add: 4 }, weight: 1 },
  { id: 'fuzhuSlow', name: '寒氣', description: '夫諸緩速效果 +10%', tower: 'fuzhu', effect: { key: 'fuzhuSlow', add: 0.1 }, weight: 1 },
  { id: 'fuzhuRange', name: '冰域', description: '夫諸射程 +20%', tower: 'fuzhu', effect: { key: 'fuzhuRange', add: 0.2 }, weight: 1 },
  { id: 'slowVulnerability', name: '霜蝕', description: '緩速敵人受到傷害 +10%', tower: 'fuzhu', effect: { key: 'slowedVulnerability', add: 0.1 }, weight: 1 },
  { id: 'yinglongDamage', name: '龍威', description: '應龍傷害 +20%', tower: 'yinglong', effect: { key: 'yinglongDamage', add: 0.2 }, weight: 1 },
  { id: 'yinglongPenetration', name: '龍息', description: '應龍穿透 +1', tower: 'yinglong', effect: { key: 'yinglongPenetration', add: 1 }, weight: 1 },
  { id: 'yinglongBoss', name: '逆鱗', description: '應龍對 Boss 傷害 +30%', tower: 'yinglong', effect: { key: 'yinglongBoss', add: 0.3 }, weight: 1 },
  { id: 'allDamage', name: '山海靈氣', description: '所有異獸傷害 +10%', effect: { key: 'allDamage', add: 0.1 }, weight: 1.35 },
  { id: 'attackSpeed', name: '靈脈', description: '所有異獸攻速 +10%', effect: { key: 'attackSpeed', add: 0.1 }, weight: 1.35 },
  { id: 'goldReward', name: '財運', description: '敵人金幣獎勵 +20%', effect: { key: 'goldReward', add: 0.2 }, weight: 1.35 },
]);

export const MAP_DATA = Object.freeze({
  width: 390,
  height: 610,
  pathWidth: 54,
  waypoints: [{ x: -20, y: 70 }, { x: 285, y: 70 }, { x: 315, y: 190 }, { x: 80, y: 240 }, { x: 65, y: 380 }, { x: 320, y: 430 }, { x: 400, y: 560 }],
  slots: [{ x: 80, y: 135 }, { x: 190, y: 135 }, { x: 345, y: 120 }, { x: 245, y: 260 }, { x: 115, y: 320 }, { x: 35, y: 305 }, { x: 185, y: 395 }, { x: 300, y: 505 }],
});

export const LEVEL2_MAP_DATA = Object.freeze({
  width: 390,
  height: 610,
  pathWidth: 54,
  waypoints: [
    { x: -20, y: 87 }, { x: 25, y: 87 }, { x: 55, y: 100 }, { x: 70, y: 130 },
    { x: 90, y: 145 }, { x: 180, y: 145 }, { x: 205, y: 160 }, { x: 214, y: 195 },
    { x: 230, y: 215 }, { x: 350, y: 215 }, { x: 375, y: 225 }, { x: 385, y: 250 },
    { x: 375, y: 270 }, { x: 350, y: 282 }, { x: 250, y: 282 }, { x: 220, y: 265 },
    { x: 195, y: 240 }, { x: 60, y: 240 }, { x: 30, y: 255 }, { x: 20, y: 285 },
    { x: 20, y: 340 }, { x: 35, y: 365 }, { x: 75, y: 375 }, { x: 190, y: 375 },
    { x: 215, y: 390 }, { x: 230, y: 420 }, { x: 230, y: 475 }, { x: 250, y: 495 },
    { x: 350, y: 505 }, { x: 400, y: 540 },
  ],
  slots: [
    { x: 26, y: 115 }, { x: 248, y: 111 }, { x: 139, y: 190 }, { x: 340, y: 254 },
    { x: 139, y: 307 }, { x: 346, y: 401 }, { x: 214, y: 474 }, { x: 92, y: 487 },
  ],
});

const levelOne = Object.freeze({
  ...LEVEL_DATA,
  map: MAP_DATA,
  waves: WAVE_DATA,
  art: Object.freeze({
    background: 'background', backgroundCrop: { x: 100, y: 129, width: 1083, height: 1145 },
    spawn: 'spawnRift', spawnPosition: { x: 10, y: 70 },
    base: 'baseSeal', basePosition: { x: 372, y: 558 }, bossPanel: 'bossPanel',
  }),
});

const levelTwo = Object.freeze({
  id: 2,
  name: '赤水荒原',
  baseName: '赤水古寨',
  bossType: 'paoxiao',
  map: LEVEL2_MAP_DATA,
  waves: LEVEL2_WAVE_DATA,
  art: Object.freeze({
    background: 'level2Background', backgroundCrop: { x: 70, y: 0, width: 897, height: 1402 },
    spawn: 'level2Spawn', spawnPosition: { x: 4, y: 68 },
    base: 'level2Base', basePosition: { x: 378, y: 520 }, bossPanel: 'paoxiaoBossPanel',
  }),
});

export const LEVELS = Object.freeze({ 1: levelOne, 2: levelTwo });

export function getLevelData(levelId) {
  return LEVELS[levelId] ?? null;
}

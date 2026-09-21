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
  baize: { id: 'baize', name: '白澤', emoji: '🦄', role: '洞察輔助', cost: 125, damage: 14, interval: 1.05, range: 128, projectileSpeed: 400, insightDuration: 3, vulnerability: 0.15, bossVulnerability: 0.1, level2: { insightDuration: 4, rangeBonus: 8 }, level3: { defensePierce: 0.25 } },
  jumang: { id: 'jumang', name: '句芒', emoji: '🌿', role: '全隊增益', cost: 130, damage: 10, interval: 1.15, range: 138, projectileSpeed: 380 },
});

export const ENEMY_DATA = Object.freeze({
  minion: { id: 'minion', name: '小妖', emoji: '👺', hp: 60, speed: 52, baseDamage: 1, reward: 10, radius: 12 },
  swift: { id: 'swift', name: '疾妖', emoji: '💨', hp: 40, speed: 88.4, baseDamage: 1, reward: 12, radius: 10 },
  giant: { id: 'giant', name: '巨妖', emoji: '👹', hp: 220, speed: 31.2, baseDamage: 3, reward: 25, radius: 16 },
  qiongqi: { id: 'qiongqi', name: '窮奇', emoji: '🐅', hp: 2500, speed: 23, baseDamage: 20, reward: 0, radius: 22, isBoss: true, bossMechanic: { type: 'frenzy', threshold: 0.5, speedMultiplier: 1.5 } },
  chiyu: { id: 'chiyu', name: '赤羽妖', emoji: '🪶', hp: 34, speed: 108, baseDamage: 1, reward: 9, radius: 10 },
  yanjia: { id: 'yanjia', name: '岩甲妖', emoji: '🪨', hp: 170, speed: 28, baseDamage: 2, reward: 20, radius: 16, normalDamageMultiplier: 0.65, minimumNormalDamage: 1 },
  paoxiao: { id: 'paoxiao', name: '狍鴞', emoji: '🐐', hp: 3600, speed: 19, baseDamage: 20, reward: 0, radius: 24, isBoss: true, bossMechanic: { type: 'consume', thresholds: [0.7, 0.4], healRatio: 0.08 } },
  shuixiao: { id: 'shuixiao', name: '水魈', emoji: '🌊', hp: 48, speed: 90, baseDamage: 1, reward: 11, radius: 11, weakWaterSpeedMultiplier: 1.25 },
  xuanjiashou: { id: 'xuanjiashou', name: '玄甲獸', emoji: '🐢', hp: 240, speed: 26, baseDamage: 3, reward: 24, radius: 17, slowEffectiveness: 0.5 },
  xiangliu: { id: 'xiangliu', name: '相柳', emoji: '🐍', hp: 4500, speed: 17, baseDamage: 20, reward: 0, radius: 25, isBoss: true, bossMechanic: { type: 'staged', stages: [{ threshold: 0.75, action: 'heal', healRatio: 0.06 }, { threshold: 0.5, action: 'heal', healRatio: 0.08 }, { threshold: 0.25, action: 'frenzy', speedMultiplier: 1.2 }] } },
  meihu: { id: 'meihu', name: '魅狐', emoji: '🦊', hp: 70, speed: 92, baseDamage: 1, reward: 12, radius: 11 },
  huanli: { id: 'huanli', name: '幻狸', emoji: '🐈', hp: 260, speed: 34, baseDamage: 3, reward: 25, radius: 17 },
  jiuweihu: { id: 'jiuweihu', name: '九尾狐', emoji: '🦊', hp: 5200, speed: 18, baseDamage: 20, reward: 0, radius: 27, isBoss: true, bossMechanic: { type: 'jiuweihu' } },
  zhuyan: { id: 'zhuyan', name: '朱厭', emoji: '🐒', hp: 85, speed: 84, baseDamage: 1, reward: 13, radius: 12 },
  lili: { id: 'lili', name: '狸力', emoji: '🐗', hp: 320, speed: 27, baseDamage: 3, reward: 27, radius: 18, earthArmorLayers: 1 },
  xingtian: { id: 'xingtian', name: '刑天', emoji: '🪓', hp: 5800, speed: 16, baseDamage: 20, reward: 0, radius: 29, isBoss: true, bossMechanic: { type: 'xingtian' } },
  yangyu: { id: 'yangyu', name: '陽羽', emoji: '☀️', hp: 90, speed: 86, baseDamage: 1, reward: 13, radius: 11 },
  fusangjiashou: { id: 'fusangjiashou', name: '扶桑甲獸', emoji: '🪲', hp: 350, speed: 26, baseDamage: 3, reward: 28, radius: 18 },
  jinwu: { id: 'jinwu', name: '金烏', emoji: '🐦', hp: 6200, speed: 17, baseDamage: 20, reward: 0, radius: 29, isBoss: true, bossMechanic: { type: 'jinwu' } },
  qinyuan: { id: 'qinyuan', name: '欽原', emoji: '🐝', hp: 100, speed: 88, baseDamage: 1, reward: 14, radius: 11 },
  zhuhuai: { id: 'zhuhuai', name: '諸懷', emoji: '🐂', hp: 390, speed: 25, baseDamage: 3, reward: 30, radius: 18 },
  kui: { id: 'kui', name: '夔', emoji: '⚡', hp: 7000, speed: 16, baseDamage: 20, reward: 0, radius: 29, isBoss: true, bossMechanic: { type: 'kui' } },
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

export const LEVEL3_WAVE_DATA = Object.freeze([
  wave([{ type: 'shuixiao', count: 6 }], 1.1),
  wave([{ type: 'shuixiao', count: 8 }], 1),
  wave([{ type: 'shuixiao', count: 6 }, { type: 'xuanjiashou', count: 1 }], 1),
  wave([{ type: 'xuanjiashou', count: 7 }], 1.02, { hpMultiplier: 1.05 }),
  wave([{ type: 'shuixiao', count: 14 }, { type: 'xuanjiashou', count: 6 }], 0.74, { hpMultiplier: 1.1 }),
  wave([{ type: 'shuixiao', count: 22 }, { type: 'xuanjiashou', count: 5 }], 0.56, { hpMultiplier: 1.15 }),
  wave([{ type: 'xuanjiashou', count: 10 }, { type: 'shuixiao', count: 10 }], 0.78, { hpMultiplier: 1.25 }),
  wave([{ type: 'shuixiao', count: 22 }, { type: 'xuanjiashou', count: 9 }], 0.54, { hpMultiplier: 1.4 }),
  wave([{ type: 'shuixiao', count: 26 }, { type: 'xuanjiashou', count: 12 }], 0.5, { hpMultiplier: 1.55 }),
  wave([{ type: 'shuixiao', count: 12 }, { type: 'xuanjiashou', count: 5 }, { type: 'xiangliu', count: 1 }], 0.86, { hpMultiplier: 1.45, bossHpMultiplier: 1.5 }),
]);

export const LEVEL4_WAVE_DATA = Object.freeze([
  wave([{ type: 'meihu', count: 6 }], 1.1),
  wave([{ type: 'meihu', count: 8 }], 1),
  wave([{ type: 'meihu', count: 6 }, { type: 'huanli', count: 1 }], 1.05),
  wave([{ type: 'meihu', count: 8 }, { type: 'huanli', count: 2 }], 0.92),
  wave([{ type: 'meihu', count: 7 }, { type: 'huanli', count: 4 }], 0.88, { hpMultiplier: 1.05 }),
  wave([{ type: 'meihu', count: 10 }, { type: 'huanli', count: 4 }], 0.74, { hpMultiplier: 1.1 }),
  wave([{ type: 'meihu', count: 8 }, { type: 'huanli', count: 6 }], 0.78, { hpMultiplier: 1.2 }),
  wave([{ type: 'meihu', count: 12 }, { type: 'huanli', count: 6 }], 0.62, { hpMultiplier: 1.3 }),
  wave([{ type: 'meihu', count: 10 }, { type: 'huanli', count: 8 }], 0.58, { hpMultiplier: 1.45 }),
  wave([{ type: 'meihu', count: 10 }, { type: 'huanli', count: 6 }, { type: 'jiuweihu', count: 1 }], 0.82, { hpMultiplier: 1.35, bossHpMultiplier: 1 }),
]);

export const LEVEL5_WAVE_DATA = Object.freeze([
  wave([{ type: 'zhuyan', count: 6 }], 1.1),
  wave([{ type: 'zhuyan', count: 8 }], 1),
  wave([{ type: 'zhuyan', count: 6 }, { type: 'lili', count: 2 }], 1),
  wave([{ type: 'lili', count: 4 }], 1.05),
  wave([{ type: 'zhuyan', count: 10 }, { type: 'lili', count: 3 }], 0.9, { hpMultiplier: 1.05 }),
  wave([{ type: 'zhuyan', count: 14 }, { type: 'lili', count: 4 }], 0.78, { hpMultiplier: 1.1 }),
  wave([{ type: 'zhuyan', count: 8 }, { type: 'lili', count: 7 }], 0.82, { hpMultiplier: 1.15 }),
  wave([{ type: 'zhuyan', count: 16 }, { type: 'lili', count: 6 }], 0.68, { hpMultiplier: 1.25 }),
  wave([{ type: 'zhuyan', count: 18 }, { type: 'lili', count: 8 }], 0.62, { hpMultiplier: 1.35 }),
  wave([{ type: 'zhuyan', count: 8 }, { type: 'lili', count: 4 }, { type: 'xingtian', count: 1 }], 0.82, { hpMultiplier: 1.2, bossHpMultiplier: 1.15 }),
]);

export const LEVEL6_WAVE_DATA = Object.freeze([
  wave([{ type: 'yangyu', count: 6 }], 1.1),
  wave([{ type: 'yangyu', count: 8 }], 1),
  wave([{ type: 'yangyu', count: 6 }, { type: 'fusangjiashou', count: 2 }], 1),
  wave([{ type: 'fusangjiashou', count: 4 }], 1.05),
  wave([{ type: 'yangyu', count: 10 }, { type: 'fusangjiashou', count: 3 }], 0.9, { hpMultiplier: 1.05 }),
  wave([{ type: 'yangyu', count: 14 }, { type: 'fusangjiashou', count: 4 }], 0.78, { hpMultiplier: 1.1 }),
  wave([{ type: 'yangyu', count: 8 }, { type: 'fusangjiashou', count: 7 }], 0.82, { hpMultiplier: 1.15 }),
  wave([{ type: 'yangyu', count: 16 }, { type: 'fusangjiashou', count: 6 }], 0.68, { hpMultiplier: 1.25 }),
  wave([{ type: 'yangyu', count: 18 }, { type: 'fusangjiashou', count: 8 }], 0.62, { hpMultiplier: 1.35 }),
  wave([{ type: 'yangyu', count: 8 }, { type: 'fusangjiashou', count: 4 }, { type: 'jinwu', count: 1 }], 0.82, { hpMultiplier: 1.2, bossHpMultiplier: 1.1 }),
]);

export const LEVEL7_WAVE_DATA = Object.freeze([
  wave([{ type: 'qinyuan', count: 6 }], 1.1),
  wave([{ type: 'qinyuan', count: 8 }], 1),
  wave([{ type: 'qinyuan', count: 6 }, { type: 'zhuhuai', count: 2 }], 1),
  wave([{ type: 'zhuhuai', count: 4 }], 1.05),
  wave([{ type: 'qinyuan', count: 10 }, { type: 'zhuhuai', count: 3 }], 0.9, { hpMultiplier: 1.05 }),
  wave([{ type: 'qinyuan', count: 14 }, { type: 'zhuhuai', count: 4 }], 0.78, { hpMultiplier: 1.1 }),
  wave([{ type: 'qinyuan', count: 10 }, { type: 'zhuhuai', count: 6 }], 0.82, { hpMultiplier: 1.15 }),
  wave([{ type: 'qinyuan', count: 16 }, { type: 'zhuhuai', count: 6 }], 0.7, { hpMultiplier: 1.22 }),
  wave([{ type: 'qinyuan', count: 18 }, { type: 'zhuhuai', count: 8 }], 0.64, { hpMultiplier: 1.3 }),
  wave([{ type: 'qinyuan', count: 8 }, { type: 'zhuhuai', count: 4 }, { type: 'kui', count: 1 }], 0.84, { hpMultiplier: 1.18, bossHpMultiplier: 1.1 }),
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

export const LEVEL3_MAP_DATA = Object.freeze({
  width: 390,
  height: 610,
  pathWidth: 54,
  pathSmoothing: 2,
  waypoints: [
    { x: -20, y: 30 }, { x: 18, y: 39 }, { x: 48, y: 55 }, { x: 75, y: 75 },
    { x: 98, y: 99 }, { x: 118, y: 124 }, { x: 144, y: 144 }, { x: 174, y: 155 },
    { x: 205, y: 163 }, { x: 235, y: 174 }, { x: 260, y: 190 }, { x: 276, y: 208 },
    { x: 281, y: 226 }, { x: 273, y: 241 }, { x: 257, y: 252 }, { x: 232, y: 260 },
    { x: 202, y: 264 }, { x: 174, y: 269 }, { x: 151, y: 279 }, { x: 136, y: 294 },
    { x: 132, y: 308 }, { x: 139, y: 322 }, { x: 156, y: 335 }, { x: 183, y: 345 },
    { x: 214, y: 351 }, { x: 242, y: 360 }, { x: 263, y: 374 }, { x: 278, y: 392 },
    { x: 287, y: 414 }, { x: 289, y: 434 }, { x: 283, y: 452 }, { x: 269, y: 467 },
    { x: 247, y: 479 }, { x: 218, y: 488 }, { x: 187, y: 494 }, { x: 154, y: 500 },
    { x: 123, y: 509 }, { x: 94, y: 521 }, { x: 68, y: 537 }, { x: 43, y: 553 },
    { x: 20, y: 567 }, { x: -20, y: 579 },
  ],
  weakWaterZones: [
    { x: 130, y: 135, width: 175, height: 115 },
    { x: 245, y: 350, width: 65, height: 125 },
  ],
  slots: [
    { x: 132, y: 61 }, { x: 288, y: 88 }, { x: 121, y: 165 }, { x: 344, y: 190 },
    { x: 190, y: 283 }, { x: 350, y: 348 }, { x: 153, y: 434 }, { x: 323, y: 492 },
  ],
});

export const LEVEL4_MAP_DATA = Object.freeze({
  width: 390,
  height: 610,
  pathWidth: 54,
  pathSmoothing: 2,
  waypoints: [
    { x: -20, y: 3 }, { x: 20, y: 8 }, { x: 39, y: 10 }, { x: 48, y: 30 },
    { x: 66, y: 40 }, { x: 81, y: 50 }, { x: 98, y: 60 }, { x: 124, y: 70 },
    { x: 149, y: 80 }, { x: 173, y: 90 }, { x: 187, y: 100 }, { x: 195, y: 110 },
    { x: 200, y: 120 }, { x: 200, y: 130 }, { x: 198, y: 140 }, { x: 196, y: 150 },
    { x: 189, y: 160 }, { x: 177, y: 170 }, { x: 169, y: 180 }, { x: 159, y: 190 },
    { x: 153, y: 200 }, { x: 153, y: 210 }, { x: 168, y: 220 }, { x: 206, y: 230 },
    { x: 225, y: 240 }, { x: 265, y: 250 }, { x: 276, y: 270 }, { x: 273, y: 280 },
    { x: 254, y: 290 }, { x: 228, y: 300 }, { x: 198, y: 310 }, { x: 184, y: 320 },
    { x: 175, y: 330 }, { x: 175, y: 340 }, { x: 174, y: 350 }, { x: 180, y: 365 },
    { x: 190, y: 380 }, { x: 223, y: 390 }, { x: 254, y: 400 }, { x: 290, y: 410 },
    { x: 312, y: 420 }, { x: 321, y: 430 }, { x: 321, y: 440 }, { x: 326, y: 460 },
    { x: 321, y: 480 }, { x: 311, y: 500 }, { x: 315, y: 510 }, { x: 335, y: 520 },
    { x: 341, y: 540 }, { x: 341, y: 550 }, { x: 350, y: 565 }, { x: 370, y: 583 },
    { x: 410, y: 600 },
  ],
  fogZones: [
    { id: 'upper', x: 128, y: 111, width: 116, height: 111 },
    { id: 'lower', x: 244, y: 375, width: 137, height: 105 },
  ],
  slots: [
    { x: 95, y: 91 }, { x: 123, y: 166 }, { x: 227, y: 183 }, { x: 305, y: 235 },
    { x: 112, y: 319 }, { x: 243, y: 330 }, { x: 269, y: 451 }, { x: 367, y: 483 },
  ],
});

export const LEVEL5_MAP_DATA = Object.freeze({
  width: 390,
  height: 610,
  pathWidth: 54,
  pathSmoothing: 2,
  waypoints: [
    { x: -20, y: 18 }, { x: 15, y: 20 }, { x: 35, y: 32 }, { x: 48, y: 48 },
    { x: 54, y: 65 }, { x: 70, y: 80 }, { x: 100, y: 90 }, { x: 140, y: 100 },
    { x: 178, y: 110 }, { x: 240, y: 118 }, { x: 280, y: 130 }, { x: 302, y: 140 },
    { x: 315, y: 155 }, { x: 305, y: 170 }, { x: 280, y: 190 }, { x: 250, y: 205 },
    { x: 220, y: 220 }, { x: 180, y: 230 }, { x: 140, y: 240 }, { x: 100, y: 245 },
    { x: 82, y: 250 }, { x: 68, y: 260 }, { x: 60, y: 280 }, { x: 65, y: 295 },
    { x: 81, y: 310 }, { x: 110, y: 322 }, { x: 140, y: 334 }, { x: 160, y: 350 },
    { x: 185, y: 360 }, { x: 220, y: 370 }, { x: 250, y: 380 }, { x: 275, y: 390 },
    { x: 302, y: 400 }, { x: 316, y: 410 }, { x: 326, y: 425 }, { x: 330, y: 440 },
    { x: 316, y: 455 }, { x: 306, y: 470 }, { x: 280, y: 485 }, { x: 280, y: 500 },
    { x: 290, y: 512 }, { x: 310, y: 522 }, { x: 338, y: 532 }, { x: 365, y: 545 },
    { x: 385, y: 555 }, { x: 410, y: 565 },
  ],
  chargeCorridor: { x: 100, y: 360, width: 195, height: 66 },
  slots: [
    { x: 119, y: 68 }, { x: 99, y: 119 }, { x: 265, y: 150 }, { x: 315, y: 198 },
    { x: 105, y: 280 }, { x: 146, y: 305 }, { x: 271, y: 421 }, { x: 229, y: 518 },
  ],
});

export const LEVEL6_MAP_DATA = Object.freeze({
  width: 390,
  height: 610,
  pathWidth: 54,
  pathSmoothing: 2,
  waypoints: [
    { x: 57, y: 55 }, { x: 60, y: 72 }, { x: 78, y: 91 }, { x: 111, y: 101 },
    { x: 150, y: 105 }, { x: 190, y: 105 }, { x: 229, y: 109 }, { x: 264, y: 119 },
    { x: 296, y: 137 }, { x: 323, y: 162 }, { x: 342, y: 193 }, { x: 354, y: 230 },
    { x: 360, y: 271 }, { x: 360, y: 311 }, { x: 354, y: 347 }, { x: 341, y: 381 },
    { x: 321, y: 408 }, { x: 295, y: 427 }, { x: 266, y: 434 }, { x: 262, y: 429 },
    { x: 253, y: 428 }, { x: 244, y: 428 }, { x: 235, y: 428 }, { x: 226, y: 428 },
    { x: 217, y: 428 }, { x: 208, y: 428 }, { x: 199, y: 428 }, { x: 190, y: 428 },
    { x: 181, y: 428 }, { x: 173, y: 426 }, { x: 165, y: 423 }, { x: 159, y: 417 },
    { x: 152, y: 411 }, { x: 147, y: 404 }, { x: 142, y: 397 }, { x: 141, y: 389 },
    { x: 139, y: 380 }, { x: 134, y: 373 }, { x: 129, y: 366 }, { x: 121, y: 362 },
    { x: 112, y: 361 }, { x: 103, y: 361 }, { x: 94, y: 362 }, { x: 87, y: 366 },
    { x: 79, y: 370 }, { x: 76, y: 378 }, { x: 73, y: 386 }, { x: 68, y: 393 },
    { x: 63, y: 400 }, { x: 60, y: 408 }, { x: 59, y: 417 }, { x: 58, y: 426 },
    { x: 59, y: 435 }, { x: 64, y: 445 }, { x: 73, y: 453 }, { x: 85, y: 459 },
    { x: 99, y: 464 }, { x: 114, y: 466 }, { x: 130, y: 466 }, { x: 146, y: 463 },
    { x: 162, y: 458 }, { x: 178, y: 452 }, { x: 190, y: 449 }, { x: 194, y: 452 },
    { x: 194, y: 475 },
  ],
  sunlightZones: [
    { id: 'A', x: 137, y: 90, width: 85, height: 34 },
    { id: 'B', x: 302, y: 365, width: 61, height: 49 },
  ],
  slots: [
    { x: 98, y: 138 }, { x: 285, y: 94 }, { x: 285, y: 203 }, { x: 96, y: 269 },
    { x: 307, y: 312 }, { x: 195, y: 382 }, { x: 107, y: 417 }, { x: 309, y: 461 },
  ],
});

export const LEVEL7_MAP_DATA = Object.freeze({
  width: 390,
  height: 610,
  pathWidth: 54,
  pathSmoothing: 2,
  waypoints: [
    { x: 40, y: 34 }, { x: 45, y: 77 }, { x: 81, y: 93 }, { x: 124, y: 106 },
    { x: 165, y: 120 }, { x: 183, y: 128 }, { x: 190, y: 147 }, { x: 224, y: 157 },
    { x: 259, y: 181 }, { x: 251, y: 206 }, { x: 199, y: 230 }, { x: 156, y: 249 },
    { x: 169, y: 269 }, { x: 209, y: 291 }, { x: 242, y: 308 }, { x: 241, y: 331 },
    { x: 200, y: 353 }, { x: 178, y: 375 }, { x: 195, y: 391 }, { x: 226, y: 405 },
    { x: 263, y: 425 }, { x: 307, y: 450 }, { x: 323, y: 480 }, { x: 343, y: 497 },
  ],
  thunderZones: [
    { id: 'A', x: 187, y: 116, width: 63, height: 42 },
    { id: 'B', x: 153, y: 360, width: 66, height: 49 },
  ],
  slots: [
    { x: 138, y: 78 }, { x: 294, y: 124 }, { x: 135, y: 161 }, { x: 97, y: 259 },
    { x: 287, y: 249 }, { x: 293, y: 358 }, { x: 138, y: 423 }, { x: 258, y: 464 },
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

const levelThree = Object.freeze({
  id: 3,
  name: '弱水幽谷',
  baseName: '玄水祭壇',
  bossType: 'xiangliu',
  map: LEVEL3_MAP_DATA,
  waves: LEVEL3_WAVE_DATA,
  art: Object.freeze({
    background: 'level3Background', backgroundCrop: { x: 0, y: 0, width: 390, height: 610 },
    spawn: 'level3Spawn', spawnPosition: { x: 5, y: 26 },
    base: 'level3Base', basePosition: { x: 5, y: 566 }, bossPanel: 'xiangliuBossPanel',
  }),
});

const levelFour = Object.freeze({
  id: 4,
  name: '青丘妖境',
  baseName: '青丘靈臺',
  bossType: 'jiuweihu',
  map: LEVEL4_MAP_DATA,
  waves: LEVEL4_WAVE_DATA,
  art: Object.freeze({
    background: 'level4Background', backgroundCrop: { x: 0, y: 0, width: 390, height: 610 },
    spawn: 'level4Spawn', spawnPosition: { x: 5, y: 8 },
    base: 'level4Base', basePosition: { x: 378, y: 590 }, bossPanel: 'jiuweihuBossPanel',
  }),
  lineup: Object.freeze({
    eyebrow: '第四關・青丘妖境', title: '選擇 3 隻異獸',
    help: '本關可從四隻異獸中選擇三隻出戰<br>敵情：妖霧籠罩青丘，敵人擅長高速突進與幻術干擾<br>推薦職能：控制／洞察／範圍攻擊',
  }),
});

const levelFive = Object.freeze({
  id: 5,
  name: '不周山墟',
  baseName: '天柱核心',
  bossType: 'xingtian',
  bossVictoryRequiresWaveClear: true,
  map: LEVEL5_MAP_DATA,
  waves: LEVEL5_WAVE_DATA,
  art: Object.freeze({
    background: 'level5Background', backgroundCrop: { x: 0, y: 0, width: 390, height: 610 },
    spawn: 'level5Spawn', spawnPosition: { x: 18, y: 20 },
    base: 'level5Base', basePosition: { x: 360, y: 574 }, bossPanel: 'xingtianBossPanel',
  }),
  lineup: Object.freeze({
    eyebrow: '第五關・不周山墟', title: '第5關・不周山墟',
    help: '本關可從四隻異獸中選擇三隻出戰<br>敵情：朱厭與狸力突破不周山道，刑天鎮守天柱核心<br>推薦職能：控制／洞察／單擊高傷',
    banner: 'level5Banner', preview: 'level5Preview',
  }),
});

const levelSix = Object.freeze({
  id: 6,
  name: '扶桑神域',
  baseName: '扶桑靈核',
  bossType: 'jinwu',
  bossVictoryRequiresWaveClear: true,
  map: LEVEL6_MAP_DATA,
  waves: LEVEL6_WAVE_DATA,
  art: Object.freeze({
    background: 'level6Background', backgroundCrop: { x: 0, y: 0, width: 390, height: 610 },
    bossPanel: 'jinwuBossPanel',
  }),
  lineup: Object.freeze({
    eyebrow: '第六關・扶桑神域', title: '第6關・扶桑神域',
    help: '本關可從四隻異獸中選擇三隻出戰<br>敵情：陽羽與扶桑甲獸借烈日突進，金烏鎮守扶桑靈核<br>推薦職能：控制／洞察／範圍攻擊',
  }),
});

const levelSeven = Object.freeze({
  id: 7,
  name: '雷澤天野',
  baseName: '震木神壇',
  bossType: 'kui',
  bossVictoryRequiresWaveClear: true,
  map: LEVEL7_MAP_DATA,
  waves: LEVEL7_WAVE_DATA,
  art: Object.freeze({
    background: 'level7Background', backgroundCrop: { x: 0, y: 0, width: 390, height: 610 },
    bossPanel: 'kuiBossPanel',
  }),
  lineup: Object.freeze({
    eyebrow: '第七關・雷澤天野', title: '第7關・雷澤天野',
    help: '本關可從五隻異獸中選擇三隻出戰<br>敵情：欽原與諸懷穿越雷脈，夔掌控雷擊區<br>推薦職能：控制／全隊增益／範圍攻擊',
  }),
});

export const LEVELS = Object.freeze({ 1: levelOne, 2: levelTwo, 3: levelThree, 4: levelFour, 5: levelFive, 6: levelSix, 7: levelSeven });

export function getLevelData(levelId) {
  return LEVELS[levelId] ?? null;
}

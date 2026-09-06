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
  qiongqi: { id: 'qiongqi', name: '窮奇', emoji: '🐅', hp: 2500, speed: 23, baseDamage: 20, reward: 0, radius: 22, isBoss: true },
});

const wave = (groups, interval, modifiers = {}) => ({ groups, interval, ...modifiers });
export const WAVE_DATA = Object.freeze([
  wave([{ type: 'minion', count: 8 }], 1.05),
  wave([{ type: 'minion', count: 12 }], 0.95),
  wave([{ type: 'minion', count: 8 }, { type: 'swift', count: 4 }], 0.9),
  wave([{ type: 'minion', count: 12 }, { type: 'swift', count: 6 }], 0.82),
  wave([{ type: 'minion', count: 8 }, { type: 'giant', count: 3 }], 1.1),
  wave([{ type: 'minion', count: 14 }, { type: 'swift', count: 10 }], 0.68, { hpMultiplier: 1.15 }),
  wave([{ type: 'swift', count: 10 }, { type: 'giant', count: 7 }], 0.82, { hpMultiplier: 1.25 }),
  wave([{ type: 'minion', count: 18 }, { type: 'swift', count: 8 }, { type: 'giant', count: 5 }], 0.62, { hpMultiplier: 1.35 }),
  wave([{ type: 'swift', count: 16 }, { type: 'giant', count: 8 }], 0.7, { hpMultiplier: 1.45 }),
  wave([{ type: 'minion', count: 4 }, { type: 'qiongqi', count: 1 }], 1.2, { hpMultiplier: 1.35, bossHpMultiplier: 1.3 }),
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

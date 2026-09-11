export const ENABLE_UNIT_MOTION = true;

export const UNIT_MOTION_CONFIG = Object.freeze({
  hitFlashSeconds: 0.09,
  hitFlashAlpha: 0.78,
  hitFlashFilter: 'brightness(0) invert(1)',
  deathEndScale: 0.24,
  enemies: Object.freeze({
    minion: Object.freeze({ bobPixels: 2, bobHz: 1.8, deathSeconds: 0.18 }),
    swift: Object.freeze({ bobPixels: 2.5, bobHz: 2.9, deathSeconds: 0.16 }),
    giant: Object.freeze({ bobPixels: 1.1, bobHz: 0.95, deathSeconds: 0.22 }),
    qiongqi: Object.freeze({ idleScale: 0.012, idleHz: 0.72, pulseScale: 0.05, pulseSeconds: 0.32, pulseEffect: 'qiongqiFrenzyPulse' }),
    chiyu: Object.freeze({ bobPixels: 2.5, bobHz: 2.4, deathSeconds: 0.18 }),
    yanjia: Object.freeze({ bobPixels: 1.5, bobHz: 1.2, deathSeconds: 0.22 }),
    paoxiao: Object.freeze({ idleScale: 0.02, idleHz: 0.72, pulseScale: 0.05, pulseSeconds: 0.32, pulseEffect: 'paoxiaoEnrage' }),
    shuixiao: Object.freeze({ bobPixels: 2.4, bobHz: 2.65, deathSeconds: 0.18 }),
    xuanjiashou: Object.freeze({ bobPixels: 1.1, bobHz: 0.9, deathSeconds: 0.22 }),
    xiangliu: Object.freeze({ idleScale: 0.016, idleHz: 0.58, pulseScale: 0.07, pulseSeconds: 0.7, pulseEffect: ['xiangliuHealPulse', 'xiangliuEnragePulse'] }),
  }),
  towers: Object.freeze({
    bifang: Object.freeze({ idleScale: 0.01, idleHz: 1.15, recoilPixels: 2.5, recoilSeconds: 0.09 }),
    fuzhu: Object.freeze({ idleScale: 0.004, idleHz: 0.72, recoilPixels: 1.5, recoilSeconds: 0.09 }),
    yinglong: Object.freeze({ idleScale: 0.005, idleHz: 0.8, recoilPixels: 2.25, recoilSeconds: 0.09 }),
  }),
});

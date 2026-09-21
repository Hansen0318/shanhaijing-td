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
    meihu: Object.freeze({ bobPixels: 2.8, bobHz: 2.3, deathSeconds: 0.2 }),
    huanli: Object.freeze({ bobPixels: 1.6, bobHz: 1.1, deathSeconds: 0.24 }),
    jiuweihu: Object.freeze({
      phases: Object.freeze({
        1: Object.freeze({ idleScale: 0.025, idleHz: 0.72, bobPixels: 1.5, bobHz: 0.8 }),
        2: Object.freeze({ idleScale: 0.035, idleHz: 0.82, bobPixels: 2.2, bobHz: 0.92 }),
        3: Object.freeze({ idleScale: 0.045, idleHz: 0.95, bobPixels: 3, bobHz: 1.25 }),
      }),
      hitRecoilPixels: 4,
      skillScale: 0.12,
      evolutionScale: 0.16,
      deathSeconds: 0.45,
    }),
    zhuyan: Object.freeze({ bobPixels: 2.6, bobHz: 2.2, deathSeconds: 0.2 }),
    lili: Object.freeze({ bobPixels: 1.2, bobHz: 0.95, deathSeconds: 0.24 }),
    xingtian: Object.freeze({
      phases: Object.freeze({
        1: Object.freeze({ idleScale: 0.018, idleHz: 0.68, bobPixels: 1.2, bobHz: 0.72 }),
        2: Object.freeze({ idleScale: 0.03, idleHz: 0.82, bobPixels: 2.2, bobHz: 0.9 }),
      }),
      hitRecoilPixels: 4,
      deathSeconds: 0.45,
    }),
    yangyu: Object.freeze({ bobPixels: 2.6, bobHz: 2.5, deathSeconds: 0.18 }),
    fusangjiashou: Object.freeze({ bobPixels: 2.1, bobHz: 1.08, stridePixels: 0.9, strideHz: 1.08, idleScale: 0.018, idleHz: 1.08, hitRecoilPixels: 2.5, deathSeconds: 0.24 }),
    jinwu: Object.freeze({
      phases: Object.freeze({
        1: Object.freeze({ idleScale: 0.02, idleHz: 0.7, bobPixels: 1.4, bobHz: 0.75 }),
        2: Object.freeze({ idleScale: 0.035, idleHz: 0.88, bobPixels: 2.4, bobHz: 1 }),
      }),
      hitRecoilPixels: 4,
      deathSeconds: 0.45,
    }),
    qinyuan: Object.freeze({ bobPixels: 2.7, bobHz: 2.6, deathSeconds: 0.18 }),
    zhuhuai: Object.freeze({ bobPixels: 1.2, bobHz: 0.92, deathSeconds: 0.24 }),
    kui: Object.freeze({
      phases: Object.freeze({
        1: Object.freeze({ idleScale: 0.02, idleHz: 0.68, bobPixels: 1.2, bobHz: 0.72 }),
        2: Object.freeze({ idleScale: 0.04, idleHz: 0.9, bobPixels: 2.4, bobHz: 1.02 }),
      }),
      hitRecoilPixels: 4,
      deathSeconds: 0.45,
    }),
  }),
  towers: Object.freeze({
    bifang: Object.freeze({ idleScale: 0.01, idleHz: 1.15, recoilPixels: 2.5, recoilSeconds: 0.09 }),
    fuzhu: Object.freeze({ idleScale: 0.004, idleHz: 0.72, recoilPixels: 1.5, recoilSeconds: 0.09 }),
    yinglong: Object.freeze({ idleScale: 0.005, idleHz: 0.8, recoilPixels: 2.25, recoilSeconds: 0.09 }),
    baize: Object.freeze({ idleScale: 0.012, idleHz: 0.9, recoilPixels: 2, recoilSeconds: 0.1 }),
    jumang: Object.freeze({ idleScale: 0.012, idleHz: 0.88, recoilPixels: 2, recoilSeconds: 0.1 }),
  }),
});

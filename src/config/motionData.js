export const ENABLE_UNIT_MOTION = true;

export const UNIT_MOTION_CONFIG = Object.freeze({
  hitFlashSeconds: 0.09,
  hitFlashAlpha: 0.78,
  hitFlashFilter: 'brightness(0) invert(1)',
  deathEndScale: 0.24,
  enemies: Object.freeze({
    chiyu: Object.freeze({ bobPixels: 2.5, bobHz: 2.4, deathSeconds: 0.18 }),
    yanjia: Object.freeze({ bobPixels: 1.5, bobHz: 1.2, deathSeconds: 0.22 }),
    paoxiao: Object.freeze({ idleScale: 0.02, idleHz: 0.72, consumeScale: 0.05, consumeSeconds: 0.32 }),
  }),
  towers: Object.freeze({
    bifang: Object.freeze({ idleScale: 0.01, idleHz: 1.15, recoilPixels: 2.5, recoilSeconds: 0.09 }),
    yinglong: Object.freeze({ idleScale: 0.005, idleHz: 0.8, recoilPixels: 2.25, recoilSeconds: 0.09 }),
  }),
});

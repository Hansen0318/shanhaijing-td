export const ENEMY_VISUAL_GAP = 6;

function visual(width, height, anchorY, sourceWidth, sourceHeight, visibleWidth, visibleHeight) {
  const scale = Math.min(width / sourceWidth, height / sourceHeight);
  return Object.freeze({
    width,
    height,
    anchorY,
    sourceWidth,
    sourceHeight,
    visibleWidth,
    visibleHeight,
    footprint: Math.max(visibleWidth * scale, visibleHeight * scale),
  });
}

export const ENEMY_VISUALS = Object.freeze({
  minion: visual(36, 38, 123 / 247, 256, 247, 256, 247),
  swift: visual(36, 36, 116.5 / 235, 256, 235, 256, 235),
  giant: visual(48, 48, 122.5 / 247, 256, 247, 256, 247),
  qiongqi: visual(68, 68, 186 / 373, 384, 373, 384, 373),
  chiyu: visual(38, 42, 127.5 / 256, 256, 256, 247, 241),
  yanjia: visual(50, 50, 128.5 / 256, 256, 256, 255, 252),
  paoxiao: visual(72, 72, 190 / 384, 384, 384, 383, 377),
  shuixiao: visual(40, 42, 194.5 / 384, 384, 384, 363, 360),
  xuanjiashou: visual(52, 50, 194 / 384, 384, 384, 365, 291),
  xiangliu: visual(76, 76, 251.5 / 512, 512, 512, 492, 488),
  meihu: visual(40, 42, 127.5 / 256, 256, 256, 256, 218),
  huanli: visual(52, 50, 127.5 / 256, 256, 256, 256, 196),
  jiuweihu: visual(82, 82, 255 / 512, 512, 512, 512, 501),
  zhuyan: visual(42, 44, 127.5 / 256, 256, 256, 236, 234),
  lili: visual(54, 52, 127.5 / 256, 256, 256, 236, 208),
  xingtian: visual(84, 84, 191.5 / 384, 384, 384, 360, 354),
  yangyu: visual(40, 40, 0.496, 256, 249, 244, 235),
  fusangjiashou: visual(54, 52, 0.5, 256, 229, 252, 213),
  jinwu: visual(84, 84, 0.5, 384, 384, 372, 384),
});

export function minimumEnemyPathSpacing(leaderType, followerType) {
  const leader = ENEMY_VISUALS[leaderType];
  const follower = ENEMY_VISUALS[followerType];
  if (!leader || !follower) return 0;
  return leader.footprint / 2 + follower.footprint / 2 + ENEMY_VISUAL_GAP;
}

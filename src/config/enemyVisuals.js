export const ENEMY_VISUAL_GAP = 6;

export const ENEMY_VISUALS = Object.freeze({
  minion: Object.freeze({ width: 36, height: 38, anchorY: 123 / 247 }),
  swift: Object.freeze({ width: 36, height: 36, anchorY: 116.5 / 235 }),
  giant: Object.freeze({ width: 48, height: 48, anchorY: 122.5 / 247 }),
  qiongqi: Object.freeze({ width: 68, height: 68, anchorY: 186 / 373 }),
  chiyu: Object.freeze({ width: 38, height: 42, anchorY: 127.5 / 256 }),
  yanjia: Object.freeze({ width: 50, height: 50, anchorY: 128.5 / 256 }),
  paoxiao: Object.freeze({ width: 72, height: 72, anchorY: 190 / 384 }),
  shuixiao: Object.freeze({ width: 40, height: 42, anchorY: 194.5 / 384 }),
  xuanjiashou: Object.freeze({ width: 52, height: 50, anchorY: 194 / 384 }),
  xiangliu: Object.freeze({ width: 76, height: 76, anchorY: 251.5 / 512 }),
  meihu: Object.freeze({ width: 40, height: 42, anchorY: 127.5 / 256 }),
  huanli: Object.freeze({ width: 52, height: 50, anchorY: 127.5 / 256 }),
  jiuweihu: Object.freeze({ width: 82, height: 82, anchorY: 255 / 512 }),
  zhuyan: Object.freeze({ width: 42, height: 44, anchorY: 127.5 / 256 }),
  lili: Object.freeze({ width: 54, height: 52, anchorY: 127.5 / 256 }),
  xingtian: Object.freeze({ width: 84, height: 84, anchorY: 191.5 / 384 }),
});

export function minimumEnemyPathSpacing(leaderType, followerType) {
  const leader = ENEMY_VISUALS[leaderType];
  const follower = ENEMY_VISUALS[followerType];
  if (!leader || !follower) return 0;
  const leaderFootprint = Math.max(leader.width, leader.height);
  const followerFootprint = Math.max(follower.width, follower.height);
  return leaderFootprint / 2 + followerFootprint / 2 + ENEMY_VISUAL_GAP;
}

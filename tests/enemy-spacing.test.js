import test from 'node:test';
import assert from 'node:assert/strict';
import { ENEMY_DATA, LEVELS } from '../src/config/gameData.js';
import { ENEMY_VISUALS, minimumEnemyPathSpacing } from '../src/config/enemyVisuals.js';
import { Game } from '../src/core/Game.js';
import { WaveManager } from '../src/systems/WaveManager.js';

test('every enemy used by Levels 1–5 has shared visual geometry for spacing and anchoring', () => {
  const usedTypes = new Set(
    Object.values(LEVELS).flatMap(level => level.waves.flatMap(wave => wave.groups.map(group => group.type))),
  );

  assert.deepEqual([...usedTypes].filter(type => !ENEMY_DATA[type]), []);
  assert.deepEqual([...usedTypes].filter(type => !ENEMY_VISUALS[type]), []);
  for (const type of usedTypes) {
    const visual = ENEMY_VISUALS[type];
    assert.ok(visual.width > 0 && visual.height > 0, `${type} needs a positive runtime footprint`);
    assert.ok(visual.anchorY > 0 && visual.anchorY < 1, `${type} needs a measured visual anchor`);
  }
});

test('minimum path spacing uses both enemy footprints plus a six-pixel visible gap', () => {
  assert.equal(minimumEnemyPathSpacing('xuanjiashou', 'xuanjiashou'), 53.52604166666667);
  assert.equal(minimumEnemyPathSpacing('chiyu', 'yanjia'), 49.234375);
  assert.equal(minimumEnemyPathSpacing('xingtian', 'zhuyan'), 64.734375);
});

test('spacing footprints match drawContained scale and measured visible alpha bounds', () => {
  for (const [type, visual] of Object.entries(ENEMY_VISUALS)) {
    const scale = Math.min(visual.width / visual.sourceWidth, visual.height / visual.sourceHeight);
    const expected = Math.max(visual.visibleWidth * scale, visual.visibleHeight * scale);
    assert.equal(visual.footprint, expected, `${type} footprint must match its rendered visible pixels`);
  }
});

test('the shared spawn gate applies size-aware path spacing in every playable level', () => {
  const cases = [
    { levelId: 1, type: 'giant' },
    { levelId: 2, type: 'yanjia' },
    { levelId: 3, type: 'xuanjiashou' },
    { levelId: 4, type: 'huanli' },
    { levelId: 5, type: 'lili' },
  ];

  for (const { levelId, type } of cases) {
    const spacing = minimumEnemyPathSpacing(type, type);
    const game = new Game(() => 0.2, levelId);
    game.wave = new WaveManager([{ groups: [{ type, count: 2 }], interval: 0 }]);
    game.state = 'combat';
    game.time.setPaused(false);
    game.wave.start(1);

    for (let step = 0; step < 200 && game.enemies.length < 2; step += 1) game.update(0.1);

    assert.equal(game.enemies.length, 2, `Level${levelId} did not release the queued enemy`);
    assert.ok(
      game.enemies[0].pathDistance - game.enemies[1].pathDistance >= spacing,
      `Level${levelId} ${type} spawned without its ${spacing}px center spacing`,
    );
  }
});

test('mixed-type followers use both rendered footprints at the spawn gate', () => {
  const cases = [
    { levelId: 1, leader: 'minion', follower: 'swift' },
    { levelId: 2, leader: 'minion', follower: 'chiyu' },
    { levelId: 3, leader: 'xuanjiashou', follower: 'shuixiao' },
    { levelId: 4, leader: 'huanli', follower: 'meihu' },
    { levelId: 5, leader: 'lili', follower: 'zhuyan' },
  ];

  for (const { levelId, leader, follower } of cases) {
    const game = new Game(() => 0.2, levelId);
    const leadingEnemy = game.spawnEnemy(leader);
    const required = minimumEnemyPathSpacing(leader, follower);

    leadingEnemy.pathDistance = required - 0.01;
    assert.equal(game.canSpawnEnemy(follower), false, `Level${levelId} released ${follower} too early`);
    leadingEnemy.pathDistance = required;
    assert.equal(game.canSpawnEnemy(follower), true, `Level${levelId} held ${follower} past its measured gap`);
  }
});

test('spacing never slows an already spawned follower', () => {
  const game = new Game(() => 0.2, 1);
  game.wave = new WaveManager([{ groups: [{ type: 'minion', count: 2 }], interval: 0 }]);
  game.state = 'combat';
  game.time.setPaused(false);
  game.wave.start(1);

  for (let step = 0; step < 200 && game.enemies.length < 2; step += 1) game.update(0.1);
  game.enemies[0].statuses.slow = { amount: 0.25, remaining: 10 };
  const follower = game.enemies[1];
  const startDistance = follower.pathDistance;
  for (let step = 0; step < 30; step += 1) game.update(0.1);

  assert.ok(Math.abs(follower.pathDistance - startDistance - ENEMY_DATA.minion.speed * 3) < 1e-9);
});

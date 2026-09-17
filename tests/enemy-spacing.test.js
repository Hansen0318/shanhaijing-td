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
  assert.equal(minimumEnemyPathSpacing('xuanjiashou', 'xuanjiashou'), 58);
  assert.equal(minimumEnemyPathSpacing('chiyu', 'yanjia'), 52);
  assert.equal(minimumEnemyPathSpacing('xingtian', 'zhuyan'), 70);
});

test('the shared spawn gate applies size-aware path spacing in every playable level', () => {
  const cases = [
    { levelId: 1, type: 'giant', spacing: 54 },
    { levelId: 2, type: 'yanjia', spacing: 56 },
    { levelId: 3, type: 'xuanjiashou', spacing: 58 },
    { levelId: 4, type: 'huanli', spacing: 58 },
    { levelId: 5, type: 'lili', spacing: 60 },
  ];

  for (const { levelId, type, spacing } of cases) {
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

import test from 'node:test';
import assert from 'node:assert/strict';
import { Game } from '../src/core/Game.js';
import { setupLevelEightDev } from '../src/dev/LevelEightDev.js';

test('Level8 dev tide fixtures synchronize while preparation is paused', () => {
  const telegraph = new Game(() => 0.2, 8);
  setupLevelEightDev(telegraph, 8, new URLSearchParams('devTide=telegraph'));
  assert.equal(telegraph.state, 'preparation');
  assert.equal(telegraph.tide.telegraph, true);
  assert.equal(telegraph.tide.high, false);

  const high = new Game(() => 0.2, 8);
  setupLevelEightDev(high, 8, new URLSearchParams('devTide=high'));
  assert.equal(high.state, 'preparation');
  assert.equal(high.tide.high, true);
  assert.deepEqual(high.tide.activeZoneIds, ['A', 'B', 'C']);
});

test('Level8 guarded victory and retry fixtures expose their result states', () => {
  const victory = new Game(() => 0.2, 8);
  setupLevelEightDev(victory, 8, new URLSearchParams('devVictory=1'));
  assert.equal(victory.state, 'victory');
  assert.equal(victory.pendingUnlock, 'xuangui');

  const retry = new Game(() => 0.2, 8);
  setupLevelEightDev(retry, 8, new URLSearchParams('devRetry=1'));
  assert.equal(retry.state, 'defeat');
  retry.restart();
  assert.equal(retry.state, 'lineup');
  assert.deepEqual(retry.lineupSelection, []);
});

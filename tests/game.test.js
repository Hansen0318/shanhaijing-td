import test from 'node:test';
import assert from 'node:assert/strict';
import { Game } from '../src/core/Game.js';

test('game starts in preparation and waits for the player to start wave one', () => {
  const game = new Game();
  assert.equal(game.state, 'preparation');
  assert.equal(game.baseHp, 20);
  assert.equal(game.economy.gold, 300);
  game.update(30);
  assert.equal(game.state, 'preparation');
  assert.equal(game.wave.waveNumber, 0);
  assert.equal(game.startWaveNow(), true);
  assert.equal(game.state, 'combat');
  assert.equal(game.wave.waveNumber, 1);
});

test('build, upgrade, insufficient funds and double-confirm sell are validated', () => {
  const game = new Game();
  assert.equal(game.buildTower(0, 'bifang').ok, true);
  assert.equal(game.economy.gold, 180);
  assert.equal(game.buildTower(1, 'yinglong').ok, true);
  assert.equal(game.economy.gold, 20);
  assert.equal(game.buildTower(2, 'fuzhu').ok, false);
  game.economy.add(300);
  assert.equal(game.upgradeTower(0).ok, true);
  assert.equal(game.upgradeTower(0).ok, true);
  assert.equal(game.towers[0].level, 3);
  assert.equal(game.upgradeTower(0).ok, false);
  assert.equal(game.sellTower(0).confirm, true);
  assert.equal(game.towers[0] instanceof Object, true);
  assert.equal(game.sellTower(0).ok, true);
  assert.equal(game.towers[0], null);
  assert.equal(game.stats.built, 2);
});

test('pause preserves state and speed affects the shared clock', () => {
  const game = new Game();
  game.setTimeScale(2);
  assert.equal(game.time.scale, 2);
  game.togglePause();
  assert.equal(game.state, 'paused');
  assert.equal(game.time.step(0.05), 0);
  game.togglePause();
  assert.equal(game.state, 'preparation');
});

test('wave completion requires blessing then waits in preparation until the player starts', () => {
  const game = new Game();
  game.startWaveNow();
  game.wave.queue.length = 0;
  game.wave.spawnedAlive = 0;
  game.update(0.016);
  assert.equal(game.state, 'blessing');
  assert.equal(game.currentChoices.length, 3);
  assert.equal(game.selectBlessing(game.currentChoices[0].id), true);
  assert.equal(game.state, 'preparation');
  game.update(30);
  assert.equal(game.state, 'preparation');
  assert.equal(game.wave.waveNumber, 1);
  assert.equal(game.startWaveNow(), true);
  assert.equal(game.state, 'combat');
  assert.equal(game.wave.waveNumber, 2);
});

test('tower management remains available during combat', () => {
  const game = new Game();
  game.startWaveNow();
  assert.equal(game.state, 'combat');
  assert.equal(game.buildTower(0, 'bifang').ok, true);
  game.economy.add(300);
  assert.equal(game.upgradeTower(0).ok, true);
});

test('base damage causes defeat and restart creates a fresh run', () => {
  const game = new Game();
  game.damageBase(20);
  assert.equal(game.state, 'defeat');
  game.restart();
  assert.equal(game.state, 'preparation');
  assert.equal(game.baseHp, 20);
  assert.equal(game.stats.kills, 0);
});

test('killing qiongqi produces victory', () => {
  const game = new Game();
  game.wave.waveNumber = 10;
  game.onEnemyKilled({ type: 'qiongqi', reward: 0, rewarded: false });
  assert.equal(game.state, 'victory');
});
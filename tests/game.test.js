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

test('wave ten cannot clear while qiongqi is still alive', () => {
  const game = new Game();
  game.state = 'combat';
  game.wave.waveNumber = 10;
  game.wave.active = true;
  game.wave.queue.length = 0;
  game.wave.spawnedAlive = 0;
  game.spawnEnemy('qiongqi');
  const boss = game.enemies.find(enemy => enemy.isBoss);
  assert.equal(boss.alive, true);

  game.completeWave();

  assert.equal(game.state, 'combat');
  assert.equal(boss.alive, true);
});

test('a kill emits the actual Fortune-adjusted gold reward at the death position', () => {
  const game = new Game();
  game.blessings.select('goldReward');
  game.onEnemyKilled({ type: 'giant', reward: 25, rewarded: false, x: 123, y: 234 });
  assert.equal(game.economy.gold, 330);
  assert.deepEqual(game.effects.at(-1), {
    type: 'gold', x: 123, y: 234, amount: 30, life: 0.9, duration: 0.9,
  });
});

test('yinglong effect records one ordered beam through every penetrated target', () => {
  const game = new Game();
  assert.equal(game.buildTower(0, 'yinglong').ok, true);
  const enemy = (x, pathDistance) => ({
    x, y: 100, pathDistance, alive: true, statuses: {}, isBoss: false,
    takeDamage(amount) { this.hp -= amount; }, hp: 100,
  });
  game.enemies = [enemy(80, 20), enemy(90, 10)];
  game.updateTowers(0.1);
  assert.deepEqual(game.effects[0], {
    type: 'beam',
    points: [{ x: 80, y: 135 }, { x: 80, y: 100 }, { x: 90, y: 100 }],
    hitCount: 2,
    life: 0.2,
    duration: 0.2,
  });
});

test('wave ten presents boss warning, arrival and one frenzy message in order', () => {
  const game = new Game();
  game.wave.waveNumber = 9;
  assert.equal(game.startWaveNow(), true);
  game.spawnEnemy('qiongqi');
  const boss = game.enemies.at(-1);
  boss.hp = boss.maxHp * 0.5;
  game.update(0);
  game.update(0);

  assert.deepEqual(
    [game.banner, ...game.bannerQueue.map(item => item.text)],
    ['BOSS 警告', '窮奇現身', '窮奇進入狂暴！'],
  );
  assert.equal(boss.frenzied, true);

  game.advanceBanner(1.31);
  assert.equal(game.banner, '窮奇現身');
  game.advanceBanner(1.11);
  assert.equal(game.banner, '窮奇進入狂暴！');
});

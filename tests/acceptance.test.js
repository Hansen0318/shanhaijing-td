import test from 'node:test';
import assert from 'node:assert/strict';
import { Game } from '../src/core/Game.js';

function advance(game, predicate, limit = 250000) {
  let bossSeen = false;
  let frenzySeen = false;
  for (let step = 0; step < limit && !predicate(game); step += 1) {
    if (game.state === 'blessing') game.selectBlessing(game.currentChoices[0].id);
    if (game.state === 'preparation' || game.state === 'countdown') game.startWaveNow();
    game.update(0.05);
    const boss = game.enemies.find(enemy => enemy.isBoss);
    bossSeen ||= Boolean(boss);
    frenzySeen ||= Boolean(boss?.frenzied);
  }
  return { bossSeen, frenzySeen };
}

test('a fortified run advances through all ten waves, enrages qiongqi and wins', () => {
  const game = new Game(() => 0.37);
  game.economy.add(10000);
  ['bifang', 'fuzhu', 'yinglong', 'bifang', 'fuzhu', 'yinglong', 'bifang', 'yinglong'].forEach((type, slot) => {
    assert.equal(game.buildTower(slot, type).ok, true);
    assert.equal(game.upgradeTower(slot).ok, true);
    assert.equal(game.upgradeTower(slot).ok, true);
  });
  game.blessings.select('allDamage');
  game.blessings.select('attackSpeed');
  const observed = advance(game, current => current.state === 'victory');
  assert.equal(game.state, 'victory');
  assert.equal(game.wave.waveNumber, 10);
  assert.equal(observed.bossSeen, true);
  assert.equal(observed.frenzySeen, true);
  assert.ok(game.stats.kills > 0);
});

test('an undefended run loses base HP and reaches defeat', () => {
  const game = new Game(() => 0.52);
  advance(game, current => current.state === 'defeat');
  assert.equal(game.state, 'defeat');
  assert.equal(game.baseHp, 0);
  game.restart();
  assert.equal(game.wave.waveNumber, 0);
  assert.equal(game.economy.gold, 300);
});

test('a legal no-cheat build can defeat the fixed campaign', () => {
  const game = new Game(() => 0.28);
  game.buildTower(0, 'bifang');
  game.buildTower(4, 'fuzhu');
  const buildOrder = [[3, 'yinglong'], [6, 'bifang'], [7, 'yinglong'], [2, 'fuzhu'], [1, 'bifang'], [5, 'yinglong']];
  let nextBuild = 0;
  for (let step = 0; step < 250000 && !['victory', 'defeat'].includes(game.state); step += 1) {
    if (game.state === 'blessing') game.selectBlessing(game.currentChoices[0].id);
    if (game.state === 'preparation' || game.state === 'countdown') game.startWaveNow();
    if (nextBuild < buildOrder.length) {
      const [slot, type] = buildOrder[nextBuild];
      if (game.economy.canAfford({ bifang: 120, fuzhu: 100, yinglong: 160 }[type])) { game.buildTower(slot, type); nextBuild += 1; }
    } else {
      const slot = game.towers.findIndex(tower => tower && tower.level < 3 && game.economy.canAfford(tower.data.cost * (tower.level === 1 ? 0.8 : 1.2)));
      if (slot >= 0) game.upgradeTower(slot);
    }
    game.update(0.05);
  }
  assert.equal(game.state, 'victory');
  assert.ok(game.baseHp > 0);
});

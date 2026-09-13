import test from 'node:test';
import assert from 'node:assert/strict';
import { BLESSING_DATA, TOWER_DATA } from '../src/config/gameData.js';
import { BlessingSystem } from '../src/systems/BlessingSystem.js';
import { Tower } from '../src/entities/Tower.js';

test('level four blessing pool excludes unselected tower blessings', () => {
  const system = new BlessingSystem(BLESSING_DATA, () => 0);
  const allowed = ['bifang', 'yinglong', 'baize'];
  const seen = new Set();
  for (let i = 0; i < 20; i += 1) {
    for (const choice of system.drawChoices([], allowed)) seen.add(choice.tower ?? 'all');
  }
  assert.equal(seen.has('fuzhu'), false);
});

test('Baize has three selectable blessings', () => {
  const baize = BLESSING_DATA.filter(item => item.tower === 'baize');
  assert.deepEqual(baize.map(item => item.name), ['明察', '破妄', '天眼']);
});

test('Baize blessings change insight duration, vulnerability, range and illusion reveal time', () => {
  const tower = new Tower('baize', TOWER_DATA.baize, { x: 0, y: 0 });
  const stats = tower.getStats({ baizeInsightDuration: 1, baizeVulnerability: 0.05, baizeSight: 1 });
  assert.equal(stats.insightDuration, 4);
  assert.equal(stats.vulnerability, 0.2);
  assert.equal(stats.bossVulnerability, 0.15);
  assert.equal(Math.round(stats.range * 100) / 100, 147.2);
  assert.equal(stats.illusionRevealDuration, 0.6);
});

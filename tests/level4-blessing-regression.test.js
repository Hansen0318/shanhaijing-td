import test from 'node:test';
import assert from 'node:assert/strict';
import { BLESSING_DATA, TOWER_DATA } from '../src/config/gameData.js';
import { LEVEL4_BAIZE_BLESSINGS } from '../src/config/level4Blessings.js';
import { BlessingSystem } from '../src/systems/BlessingSystem.js';
import { Tower } from '../src/entities/Tower.js';

const LEVEL4_BLESSINGS = [...BLESSING_DATA, ...LEVEL4_BAIZE_BLESSINGS];

test('level four blessing pool excludes unselected tower blessings', () => {
  const system = new BlessingSystem(LEVEL4_BLESSINGS, () => 0.25);
  const allowed = ['bifang', 'yinglong', 'baize'];
  const choices = system.drawChoices([], allowed);
  assert.equal(choices.some(choice => choice.tower === 'fuzhu'), false);
});

test('Baize has three selectable blessings', () => {
  assert.deepEqual(LEVEL4_BAIZE_BLESSINGS.map(item => item.name), ['明察', '破妄', '天眼']);
});

test('Baize blessings change insight duration, vulnerability, range and illusion reveal time', () => {
  const tower = new Tower('baize', TOWER_DATA.baize, { x: 0, y: 0 });
  const stats = tower.getStats({ baizeInsightDuration: 1, baizeVulnerability: 0.05, baizeSight: 1 });
  assert.equal(stats.insightDuration, 4);
  assert.equal(stats.vulnerability, 0.2);
  assert.ok(Math.abs(stats.bossVulnerability - 0.15) < 1e-12);
  assert.equal(Math.round(stats.range * 100) / 100, 147.2);
  assert.ok(Math.abs(stats.illusionRevealDuration - 0.6) < 1e-12);
});


test('blessing system fails closed for tower-specific blessings when eligibility is omitted', () => {
  const system = new BlessingSystem(LEVEL4_BLESSINGS, () => 0);
  const choices = system.drawChoices(['jumang']);
  assert.equal(choices.some(choice => Boolean(choice.tower)), false);
});

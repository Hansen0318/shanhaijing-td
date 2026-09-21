import test from 'node:test';
import assert from 'node:assert/strict';
import {
  ENEMY_DATA,
  LEVEL7_MAP_DATA,
  LEVEL7_WAVE_DATA,
  LEVELS,
  TOWER_DATA,
  getLevelData,
} from '../src/config/gameData.js';
import { Game } from '../src/core/Game.js';
import { BossSystem } from '../src/systems/BossSystem.js';
import { CombatSystem } from '../src/systems/CombatSystem.js';
import { StatusSystem } from '../src/systems/StatusSystem.js';
import { ThunderSystem } from '../src/systems/ThunderSystem.js';

const GEOMETRY_V3 = [
  [40,34],[45,77],[81,93],[124,106],[165,120],[183,128],[190,147],[224,157],
  [259,181],[251,206],[199,230],[156,249],[169,269],[209,291],[242,308],[241,331],
  [200,353],[178,375],[195,391],[226,405],[263,425],[307,450],[323,480],[343,497],
].map(([x, y]) => ({ x, y }));

test('Level7 defines the frozen identity, Geometry V3, enemies, tower and Waves', () => {
  const level = getLevelData(7);
  assert.equal(level, LEVELS[7]);
  assert.deepEqual(
    { id: level.id, name: level.name, baseName: level.baseName, bossType: level.bossType },
    { id: 7, name: '雷澤天野', baseName: '震木神壇', bossType: 'kui' },
  );
  assert.equal(level.map, LEVEL7_MAP_DATA);
  assert.deepEqual(level.map.waypoints, GEOMETRY_V3);
  assert.deepEqual(level.map.slots, [
    { x: 138, y: 78 }, { x: 294, y: 124 }, { x: 135, y: 161 }, { x: 97, y: 259 },
    { x: 287, y: 249 }, { x: 293, y: 358 }, { x: 138, y: 423 }, { x: 258, y: 464 },
  ]);
  assert.deepEqual(level.map.thunderZones, [
    { id: 'A', x: 187, y: 116, width: 63, height: 42 },
    { id: 'B', x: 153, y: 360, width: 66, height: 49 },
  ]);
  assert.deepEqual(
    Object.fromEntries(['qinyuan', 'zhuhuai', 'kui'].map(type => [type, ENEMY_DATA[type]])),
    {
      qinyuan: { id: 'qinyuan', name: '欽原', emoji: '🐝', hp: 100, speed: 88, baseDamage: 1, reward: 14, radius: 11 },
      zhuhuai: { id: 'zhuhuai', name: '諸懷', emoji: '🐂', hp: 390, speed: 25, baseDamage: 3, reward: 30, radius: 18 },
      kui: { id: 'kui', name: '夔', emoji: '⚡', hp: 7000, speed: 16, baseDamage: 20, reward: 0, radius: 29, isBoss: true, bossMechanic: { type: 'kui' } },
    },
  );
  assert.deepEqual(TOWER_DATA.jumang, {
    id: 'jumang', name: '句芒', emoji: '🌿', role: '全隊增益', cost: 130,
    damage: 10, interval: 1.15, range: 138, projectileSpeed: 380,
  });
  assert.equal(level.waves, LEVEL7_WAVE_DATA);
  assert.deepEqual(level.waves.map(wave => wave.groups), [
    [{ type: 'qinyuan', count: 6 }],
    [{ type: 'qinyuan', count: 8 }],
    [{ type: 'qinyuan', count: 6 }, { type: 'zhuhuai', count: 2 }],
    [{ type: 'zhuhuai', count: 4 }],
    [{ type: 'qinyuan', count: 10 }, { type: 'zhuhuai', count: 3 }],
    [{ type: 'qinyuan', count: 14 }, { type: 'zhuhuai', count: 4 }],
    [{ type: 'qinyuan', count: 10 }, { type: 'zhuhuai', count: 6 }],
    [{ type: 'qinyuan', count: 16 }, { type: 'zhuhuai', count: 6 }],
    [{ type: 'qinyuan', count: 18 }, { type: 'zhuhuai', count: 8 }],
    [{ type: 'qinyuan', count: 8 }, { type: 'zhuhuai', count: 4 }, { type: 'kui', count: 1 }],
  ]);
  assert.deepEqual(level.waves.map(wave => wave.interval), [1.1, 1, 1, 1.05, 0.9, 0.78, 0.82, 0.7, 0.64, 0.84]);
  assert.deepEqual(level.waves.map(wave => wave.hpMultiplier ?? 1), [1, 1, 1, 1, 1.05, 1.1, 1.15, 1.22, 1.3, 1.18]);
  assert.equal(level.waves[9].bossHpMultiplier, 1.1);
});

test('thunder pulses use logical A/B edges and apply refresh-only enemy statuses', () => {
  const game = new Game(() => 0.2, 7);
  const qinyuan = game.spawnEnemy('qinyuan');
  const zhuhuai = game.spawnEnemy('zhuhuai');
  const kui = game.spawnEnemy('kui');
  Object.assign(qinyuan, { x: 187, y: 116 });
  Object.assign(zhuhuai, { x: 250, y: 158 });
  Object.assign(kui, { x: 200, y: 130 });

  assert.equal(game.map.thunderZoneAt({ x: 187, y: 116 }), 'A');
  assert.equal(game.map.thunderZoneAt({ x: 250, y: 158 }), 'A');
  assert.equal(game.map.thunderZoneAt({ x: 251, y: 158 }), null);
  ThunderSystem.update(game, 6.1);
  assert.deepEqual(game.thunder.chargingZoneIds, ['A']);
  ThunderSystem.update(game, 0.9);
  assert.deepEqual(game.thunder.lastPulseZoneIds, ['A']);
  assert.deepEqual(qinyuan.statuses.thunderSprint, { remaining: 1.4, multiplier: 1.25 });
  assert.deepEqual(zhuhuai.statuses.thunderShell, { remaining: 1.6, damageMultiplier: 0.8 });
  assert.equal(kui.statuses.thunderSprint, undefined);
  assert.equal(kui.statuses.thunderShell, undefined);

  qinyuan.statuses.thunderSprint.remaining = 0.2;
  game.thunder.sequenceIndex = 0;
  game.thunder.countdown = 0.9;
  ThunderSystem.update(game, 0.9);
  assert.deepEqual(qinyuan.statuses.thunderSprint, { remaining: 1.4, multiplier: 1.25 }, 'pulse refreshes rather than stacks');
  assert.equal(StatusSystem.speedMultiplier(qinyuan), 1.25);
  Object.assign(qinyuan, { x: 20, y: 20 });
  assert.equal(StatusSystem.speedMultiplier(qinyuan), 1.25, 'leaving a zone does not cancel sprint');
  StatusSystem.update(qinyuan, 1.41);
  assert.equal(StatusSystem.speedMultiplier(qinyuan), 1);
  assert.equal(CombatSystem.resolveDamage(100, zhuhuai), 80);
  StatusSystem.update(zhuhuai, 1.61);
  assert.equal(CombatSystem.resolveDamage(100, zhuhuai), 100);
});

test('thunder sequence alternates in P1 and cycles A, B, A+B in P2', () => {
  const game = new Game(() => 0.2, 7);
  const pulse = () => {
    ThunderSystem.update(game, game.thunder.countdown - 0.9);
    const charging = [...game.thunder.chargingZoneIds];
    ThunderSystem.update(game, 0.9);
    return { charging, pulse: [...game.thunder.lastPulseZoneIds] };
  };
  assert.deepEqual(pulse(), { charging: ['A'], pulse: ['A'] });
  assert.deepEqual(pulse(), { charging: ['B'], pulse: ['B'] });
  game.thunder.phase2 = true;
  game.thunder.sequenceIndex = 0;
  game.thunder.countdown = 5;
  assert.deepEqual(pulse(), { charging: ['A'], pulse: ['A'] });
  assert.deepEqual(pulse(), { charging: ['B'], pulse: ['B'] });
  assert.deepEqual(pulse(), { charging: ['A', 'B'], pulse: ['A', 'B'] });
});

test('Kui enters P2 once without healing and resets thunder cadence to A', () => {
  const game = new Game(() => 0.2, 7);
  game.wave.waveNumber = 10;
  const boss = game.spawnEnemy('kui');
  assert.equal(boss.maxHp, 7700);
  boss.hp = 3850;
  assert.deepEqual(BossSystem.update(boss, 0), [{ type: 'kuiPhase2', phase: 2, duration: 0.8 }]);
  assert.equal(boss.hp, 3850);
  assert.equal(boss.speedMultiplier, 1.15);
  game.thunder.sequenceIndex = 1;
  game.thunder.countdown = 2;
  game.handleBossEvent(boss, { type: 'kuiPhase2', phase: 2, duration: 0.8 });
  assert.deepEqual(game.thunder, {
    countdown: 5, phase2: true, sequenceIndex: 0, chargingZoneIds: [], lastPulseZoneIds: [],
  });
  assert.deepEqual(BossSystem.update(boss, 0), []);
  assert.equal(game.effects.filter(effect => effect.type === 'kuiPhase2').length, 1);
});

test('Level7 victory waits for normal enemies, queue completion, and Kui death', () => {
  const game = new Game(() => 0.2, 7);
  game.state = 'combat';
  game.time.setPaused(false);
  game.wave.waveNumber = 10;
  game.wave.active = true;
  game.wave.queue.length = 0;
  game.wave.spawnedAlive = 2;
  const ordinary = game.spawnEnemy('qinyuan');
  const boss = game.spawnEnemy('kui');
  game.completeWave();
  assert.equal(game.state, 'combat');
  boss.takeDamage(boss.maxHp);
  game.update(0);
  assert.equal(game.state, 'combat');
  assert.equal(game.levelBossDefeated, true);
  ordinary.takeDamage(ordinary.maxHp);
  game.update(0);
  assert.equal(game.state, 'victory');
});

import { DayNightSystem } from '../systems/DayNightSystem.js?v=level9-1';

export function setupLevelNineDev(game, devLevel, params) {
  if (devLevel !== 9) return false;
  const devWave = Number.parseInt(params.get('devWave') ?? '', 10);
  const devBossPhase = Number.parseInt(params.get('devBossPhase') ?? '', 10);
  const devState = params.get('devState');
  const devEnemy = params.get('devEnemy');
  const devXuangui = params.get('devXuangui') === '1';
  const devVictory = params.get('devVictory') === '1';
  const devRetry = params.get('devRetry') === '1';
  const needsBattlefield = params.get('devPath') === '1' || Number.isInteger(devWave)
    || [1, 2].includes(devBossPhase) || ['day', 'night', 'telegraph'].includes(devState)
    || ['tiangou', 'zheng'].includes(devEnemy) || devXuangui || devVictory || devRetry;
  if (!needsBattlefield) return false;

  game.unlockedBeasts.add('xuangui');
  for (const type of ['xuangui', 'bifang', 'jumang']) game.toggleLineup(type);
  game.confirmLineup();

  if (devVictory) { game.end('victory'); return true; }
  if (devRetry) { game.end('defeat'); return true; }

  if ([1, 2].includes(devBossPhase)) {
    game.wave.waveNumber = 9;
    game.startWaveNow();
    game.wave.queue.length = 0;
    game.wave.spawnedAlive = 1;
    const boss = game.spawnEnemy('zhulong');
    if (devBossPhase === 2) { boss.hp = boss.maxHp * 0.5; game.update(0); }
    return true;
  }

  if (devWave >= 1 && devWave <= 10) {
    game.wave.waveNumber = devWave - 1;
    game.startWaveNow();
  } else {
    game.state = 'combat';
    game.time.setPaused(false);
  }

  if (devEnemy === 'tiangou' || devEnemy === 'zheng') game.spawnEnemy(devEnemy);
  if (devState === 'night') DayNightSystem.configure(game, { state: 'night', interval: 8, bossControlled: false });
  else DayNightSystem.configure(game, { state: 'day', interval: 8, bossControlled: false });
  if (devState === 'telegraph') {
    game.dayNight.elapsed = 7.19;
    DayNightSystem.update(game, 0.01);
  }

  if (devXuangui) {
    game.economy.add(1000);
    game.buildTower(0, 'xuangui');
    const tower = game.towers[0];
    tower.successfulAttacks = 3;
    const enemy = game.spawnEnemy('zheng');
    Object.assign(enemy, { x: tower.x + 28, y: tower.y });
    game.updateTowers(0);
    game.projectiles.at(-1)?.impact(game.enemies);
    game.updatePendingShocks(0.35);
    const shock = game.effects.find(effect => effect.type === 'xuanguiShock');
    if (shock) Object.assign(shock, { life: 3600, duration: 3600 });
  }
  game.update(0);
  return true;
}

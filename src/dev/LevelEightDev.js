import { TideSystem } from '../systems/TideSystem.js?v=level9-1';

export function setupLevelEightDev(game, devLevel, params) {
  if (devLevel !== 8) return false;
  const devWave = Number.parseInt(params.get('devWave') ?? '', 10);
  const devBossPhase = Number.parseInt(params.get('devBossPhase') ?? '', 10);
  const devTide = params.get('devTide');
  const devXuangui = params.get('devXuangui') === '1';
  const devVictory = params.get('devVictory') === '1';
  const devRetry = params.get('devRetry') === '1';
  const needsBattlefield = params.get('devPath') === '1' || Number.isInteger(devWave)
    || [1, 2].includes(devBossPhase) || ['telegraph', 'high'].includes(devTide)
    || devXuangui || devVictory || devRetry;
  if (!needsBattlefield) return false;
  if (devXuangui) game.unlockedBeasts.add('xuangui');
  for (const type of devXuangui ? ['xuangui', 'bifang', 'jumang'] : ['bifang', 'baize', 'jumang']) game.toggleLineup(type);
  game.confirmLineup();
  if (devTide === 'telegraph') {
    game.tide.elapsed = 6.8;
    TideSystem.update(game, 0);
  }
  if (devTide === 'high') TideSystem.forceHighTide(game, 2.4);
  if (devVictory) { game.end('victory'); return true; }
  if (devRetry) { game.end('defeat'); return true; }
  if ([1, 2].includes(devBossPhase)) {
    game.wave.waveNumber = 9;
    game.startWaveNow();
    game.wave.queue.length = 0;
    game.wave.spawnedAlive = 1;
    const boss = game.spawnEnemy('huashe');
    if (devBossPhase === 2) { boss.hp = boss.maxHp * 0.5; game.update(0); }
    return true;
  }
  if (devXuangui) {
    game.economy.add(1000);
    game.buildTower(0, 'xuangui');
    game.wave.waveNumber = 0;
    game.startWaveNow();
  } else if (devWave >= 1 && devWave <= 10) {
    game.wave.waveNumber = devWave - 1;
    game.startWaveNow();
  }
  game.update(0);
  return true;
}

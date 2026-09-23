import { Game } from './core/Game.js?v=level8-6';
import { Renderer } from './render/Renderer.js?v=level8-7';
import { UIController } from './ui/UIController.js?v=level8-5';
import { ArtStore, LEVEL_REQUIRED_ART_IDS } from './config/artAssets.js?v=level8-3';
import { setupLevelEightDev } from './dev/LevelEightDev.js?v=level8-3';

if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
function resetViewport() { window.scrollTo(0, 0); }
window.addEventListener('pageshow', resetViewport);
resetViewport();

const params = new URLSearchParams(window.location.search);

if (params.get('devMenu') === '1') {
  renderDevMenu();
} else {
  initializeGame();
}

function renderDevMenu() {
  document.body.classList.remove('art-loading');
  resetViewport();
  document.body.innerHTML = `
    <main class="dev-level-menu" aria-label="開發測試關卡選單">
      <h1>Shanhaijing TD Dev Menu</h1>
      <button data-dev-level="1">Level1</button>
      <button data-dev-level="2">Level2</button>
      <button data-dev-level="3">Level3</button>
      <button data-dev-level="4">Level4</button>
      <button data-dev-level="5">Level5</button>
      <button data-dev-level="6">Level6</button>
      <button data-dev-level="7">Level7</button>
      <button data-dev-level="8">Level8</button>
    </main>`;
  document.querySelectorAll('[data-dev-level]').forEach(button => {
    button.addEventListener('click', () => {
      const level = button.dataset.devLevel;
      window.location.href = `${window.location.pathname}?devLevel=${level}`;
    });
  });
}

function drawPathDebug(renderer, game) {
  if (params.get('devPath') !== '1' || ![3, 4, 5, 6, 7, 8].includes(game.levelId)) return;
  const ctx = renderer.ctx;
  const runtime = game.map.waypoints;
  const anchors = game.level.map.waypoints;
  ctx.save();
  ctx.lineWidth = 2;
  ctx.strokeStyle = 'rgba(80, 255, 215, .9)';
  ctx.beginPath();
  ctx.moveTo(runtime[0].x, runtime[0].y);
  runtime.slice(1).forEach(point => ctx.lineTo(point.x, point.y));
  ctx.stroke();
  ctx.fillStyle = 'rgba(255, 220, 80, .95)';
  anchors.forEach(point => {
    ctx.beginPath();
    ctx.arc(point.x, point.y, 2.5, 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.strokeStyle = 'rgba(255, 170, 55, .95)';
  ctx.lineWidth = 1.5;
  for (const slot of game.level.map.slots) {
    ctx.beginPath();
    ctx.arc(slot.x, slot.y, 7, 0, Math.PI * 2);
    ctx.stroke();
  }
  ctx.strokeStyle = 'rgba(184, 112, 255, .95)';
  ctx.lineWidth = 2;
  for (const zone of game.level.map.fogZones ?? []) ctx.strokeRect(zone.x, zone.y, zone.width, zone.height);
  const chargeCorridor = game.level.map.chargeCorridor;
  if (chargeCorridor) {
    ctx.strokeStyle = 'rgba(255, 225, 70, .95)';
    ctx.strokeRect(chargeCorridor.x, chargeCorridor.y, chargeCorridor.width, chargeCorridor.height);
  }
  for (const zone of game.level.map.sunlightZones ?? []) {
    const active = game.sunlight.activeZoneIds.includes(zone.id);
    ctx.strokeStyle = active ? 'rgba(255, 235, 70, .98)' : 'rgba(255, 145, 45, .78)';
    ctx.lineWidth = active ? 3 : 1.5;
    ctx.strokeRect(zone.x, zone.y, zone.width, zone.height);
  }
  for (const zone of game.level.map.thunderZones ?? []) {
    ctx.strokeStyle = 'rgba(105, 224, 255, .95)';
    ctx.lineWidth = 2;
    ctx.strokeRect(zone.x, zone.y, zone.width, zone.height);
  }
  for (const zone of game.level.map.wetlandZones ?? []) {
    ctx.strokeStyle = 'rgba(91, 231, 213, .95)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    zone.points.forEach((point, index) => index === 0 ? ctx.moveTo(point.x, point.y) : ctx.lineTo(point.x, point.y));
    ctx.closePath();
    ctx.stroke();
  }
  ctx.strokeStyle = 'rgba(255, 80, 120, .95)';
  ctx.lineWidth = 1.5;
  game.enemies.forEach(enemy => {
    ctx.beginPath();
    ctx.moveTo(enemy.x - 5, enemy.y);
    ctx.lineTo(enemy.x + 5, enemy.y);
    ctx.moveTo(enemy.x, enemy.y - 5);
    ctx.lineTo(enemy.x, enemy.y + 5);
    ctx.stroke();
  });
  ctx.restore();
}

function setupLevelSevenDev(game, devLevel) {
  if (devLevel !== 7) return;
  const devWave = Number.parseInt(params.get('devWave') ?? '', 10);
  const devBossPhase = Number.parseInt(params.get('devBossPhase') ?? '', 10);
  const devThunder = params.get('devThunder');
  const needsBattlefield = params.get('devPath') === '1' || Number.isInteger(devWave)
    || [1, 2].includes(devBossPhase) || ['A', 'B'].includes(devThunder);
  if (!needsBattlefield) return;
  for (const type of ['bifang', 'baize', 'jumang']) game.toggleLineup(type);
  game.confirmLineup();
  if (['A', 'B'].includes(devThunder)) {
    game.thunder.sequenceIndex = devThunder === 'B' ? 1 : 0;
    game.thunder.countdown = 0.9;
  }
  if ([1, 2].includes(devBossPhase)) {
    game.wave.waveNumber = 9;
    game.startWaveNow();
    game.wave.queue.length = 0;
    game.wave.spawnedAlive = 1;
    const boss = game.spawnEnemy('kui');
    if (devBossPhase === 2) { boss.hp = boss.maxHp * 0.5; game.update(0); }
    return;
  }
  if (devWave >= 1 && devWave <= 10) {
    game.wave.waveNumber = devWave - 1;
    game.startWaveNow();
  }
  game.update(0);
}

function setupLevelSixDev(game, devLevel) {
  if (devLevel !== 6) return;
  const devWave = Number.parseInt(params.get('devWave') ?? '', 10);
  const devBossPhase = Number.parseInt(params.get('devBossPhase') ?? '', 10);
  const devSunlight = params.get('devSunlight');
  const needsBattlefield = params.get('devPath') === '1' || Number.isInteger(devWave)
    || [1, 2].includes(devBossPhase) || ['A', 'B', 'both'].includes(devSunlight);
  if (!needsBattlefield) return;
  for (const type of ['bifang', 'fuzhu', 'baize']) game.toggleLineup(type);
  game.confirmLineup();
  if (devSunlight === 'B') game.sunlight.elapsed = 6;
  if (devSunlight === 'both') game.sunlight.phase2 = true;
  if ([1, 2].includes(devBossPhase)) {
    game.wave.waveNumber = 9;
    game.startWaveNow();
    game.wave.queue.length = 0;
    game.wave.spawnedAlive = 1;
    const boss = game.spawnEnemy('jinwu');
    if (devBossPhase === 2) { boss.hp = boss.maxHp * 0.5; game.update(0); }
    return;
  }
  if (devWave >= 1 && devWave <= 10) {
    game.wave.waveNumber = devWave - 1;
    game.startWaveNow();
  }
  game.update(0);
}

function setupLevelFiveDev(game, devLevel) {
  if (devLevel !== 5) return;
  const devWave = Number.parseInt(params.get('devWave') ?? '', 10);
  const devBossPhase = Number.parseInt(params.get('devBossPhase') ?? '', 10);
  const needsBattlefield = params.get('devPath') === '1' || Number.isInteger(devWave) || [1, 2].includes(devBossPhase);
  if (!needsBattlefield) return;
  for (const type of ['bifang', 'fuzhu', 'baize']) game.toggleLineup(type);
  game.confirmLineup();
  if ([1, 2].includes(devBossPhase)) {
    game.wave.waveNumber = 9;
    game.startWaveNow();
    game.wave.queue.length = 0;
    game.wave.spawnedAlive = 1;
    const boss = game.spawnEnemy('xingtian');
    if (devBossPhase === 2) { boss.hp = boss.maxHp * 0.5; game.update(0); }
    return;
  }
  if (devWave >= 1 && devWave <= 10) {
    game.wave.waveNumber = devWave - 1;
    game.startWaveNow();
  }
}

function setupLevelFourDev(game, devLevel) {
  if (devLevel !== 4) return;
  const devWave = Number.parseInt(params.get('devWave') ?? '', 10);
  const devBossPhase = Number.parseInt(params.get('devBossPhase') ?? '', 10);
  const needsBattlefield = params.get('devPath') === '1' || Number.isInteger(devWave) || [1, 2, 3].includes(devBossPhase);
  if (!needsBattlefield) return;
  for (const type of ['bifang', 'fuzhu', 'baize']) game.toggleLineup(type);
  game.confirmLineup();
  if ([1, 2, 3].includes(devBossPhase)) {
    game.wave.waveNumber = 9;
    game.startWaveNow();
    game.wave.queue.length = 0;
    game.wave.spawnedAlive = 1;
    const boss = game.spawnEnemy('jiuweihu');
    if (devBossPhase >= 2) { boss.hp = boss.maxHp * 0.6; game.update(0); }
    if (devBossPhase >= 3) { boss.hp = boss.maxHp * 0.25; game.update(0); }
    return;
  }
  if (devWave >= 1 && devWave <= 10) {
    game.wave.waveNumber = devWave - 1;
    game.startWaveNow();
  }
}

function initializeGame() {
  resetViewport();
  const devLevel = Number.parseInt(params.get('devLevel') ?? '', 10);
  const initialLevelId = [1, 2, 3, 4, 5, 6, 7, 8].includes(devLevel) ? devLevel : 1;
  const canvas = document.querySelector('#game-canvas');
  const blockingStartedAt = performance.now();
  const game = new Game(Math.random, initialLevelId);
  setupLevelFourDev(game, devLevel);
  setupLevelFiveDev(game, devLevel);
  setupLevelSixDev(game, devLevel);
  setupLevelSevenDev(game, devLevel);
  setupLevelEightDev(game, devLevel, params);
  const art = new ArtStore(Image, initialLevelId);
  const renderer = new Renderer(canvas, art);
  document.body.dataset.level = String(game.levelId);
  const ui = new UIController(game, renderer);
  let previous = performance.now();
  let initialLoadRecorded = false;

  function frame(now) {
    const delta = Math.min((now - previous) / 1000, 0.1);
    previous = now;
    document.body.dataset.level = String(game.levelId);
    game.update(delta);
    renderer.render(game);
    drawPathDebug(renderer, game);
    ui.render();
    if (document.body.classList.contains('art-loading') && renderer.art.isLevelReady(game.levelId)) {
      document.body.classList.remove('art-loading');
      resetViewport();
      if (!initialLoadRecorded) {
        globalThis.__SHANHAIJING_LOAD_METRICS__ = {
          levelId: game.levelId,
          requiredAssets: LEVEL_REQUIRED_ART_IDS[game.levelId].length,
          blockingMs: Math.round(performance.now() - blockingStartedAt),
        };
        initialLoadRecorded = true;
      }
      renderer.art.preloadDeferred(game.levelId);
    }
    requestAnimationFrame(frame);
  }

  requestAnimationFrame(frame);
  globalThis.__SHANHAIJING_TD__ = game;
}

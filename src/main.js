import { Game } from './core/Game.js?v=level3-1';
import { Renderer } from './render/Renderer.js?v=level3-1';
import { UIController } from './ui/UIController.js?v=level3-1';
import { ArtStore, LEVEL_REQUIRED_ART_IDS } from './config/artAssets.js?v=prep-loading-2';

const params = new URLSearchParams(window.location.search);

if (params.get('devMenu') === '1') {
  renderDevMenu();
} else {
  initializeGame();
}

function renderDevMenu() {
  document.body.classList.remove('art-loading');
  document.body.innerHTML = `
    <main class="dev-level-menu" aria-label="開發測試關卡選單">
      <h1>Shanhaijing TD Dev Menu</h1>
      <button data-dev-level="1">Level1</button>
      <button data-dev-level="2">Level2</button>
      <button data-dev-level="3">Level3</button>
    </main>`;
  document.querySelectorAll('[data-dev-level]').forEach(button => {
    button.addEventListener('click', () => {
      const level = button.dataset.devLevel;
      window.location.href = `${window.location.pathname}?devLevel=${level}`;
    });
  });
}

function drawPathDebug(renderer, game) {
  if (params.get('devPath') !== '1' || game.levelId !== 3) return;
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

function initializeGame() {
  const devLevel = Number.parseInt(params.get('devLevel') ?? '', 10);
  const initialLevelId = [1, 2, 3].includes(devLevel) ? devLevel : 1;
  const canvas = document.querySelector('#game-canvas');
  const blockingStartedAt = performance.now();
  const game = new Game(Math.random, initialLevelId);
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

import { Game } from './core/Game.js?v=level3-1';
import { Renderer } from './render/Renderer.js?v=level3-1';
import { UIController } from './ui/UIController.js?v=level3-1';
import { ArtStore } from './config/artAssets.js?v=prep-loading-1';

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

function initializeGame() {
  const devLevel = Number.parseInt(params.get('devLevel') ?? '', 10);
  const initialLevelId = [1, 2, 3].includes(devLevel) ? devLevel : 1;
  const canvas = document.querySelector('#game-canvas');
  const game = new Game(Math.random, initialLevelId);
  const art = new ArtStore(Image, initialLevelId);
  const renderer = new Renderer(canvas, art);
  document.body.dataset.level = String(game.levelId);
  const ui = new UIController(game, renderer);
  let previous = performance.now();

  function frame(now) {
    const delta = Math.min((now - previous) / 1000, 0.1);
    previous = now;
    document.body.dataset.level = String(game.levelId);
    game.update(delta);
    renderer.render(game);
    ui.render();
    if (document.body.classList.contains('art-loading') && renderer.art.isLevelReady(game.levelId)) {
      document.body.classList.remove('art-loading');
      renderer.art.preloadDeferred(game.levelId);
    }
    requestAnimationFrame(frame);
  }

  requestAnimationFrame(frame);
  globalThis.__SHANHAIJING_TD__ = game;
}

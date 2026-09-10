import { Game } from './core/Game.js?v=level3-1';
import { Renderer } from './render/Renderer.js?v=level3-1';
import { UIController } from './ui/UIController.js?v=level3-1';

const canvas = document.querySelector('#game-canvas');
const game = new Game();
const renderer = new Renderer(canvas);
const ui = new UIController(game, renderer);
let previous = performance.now();

function frame(now) {
  const delta = Math.min((now - previous) / 1000, 0.1);
  previous = now;
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

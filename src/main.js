import { Game } from './core/Game.js?v=level3-1';
import { Renderer } from './render/Renderer.js?v=level3-1';
import { UIController } from './ui/UIController.js?v=level3-1';

const canvas = document.querySelector('#game-canvas');
const devLevel = Number.parseInt(new URLSearchParams(window.location.search).get('devLevel') ?? '', 10);
const initialLevelId = [1, 2, 3].includes(devLevel) ? devLevel : 1;
const game = new Game(Math.random, initialLevelId);
const renderer = new Renderer(canvas);
if (initialLevelId !== 1) renderer.prepareLevel(initialLevelId);
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

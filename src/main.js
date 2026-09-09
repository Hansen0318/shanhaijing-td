import { Game } from './core/Game.js?v=motion-lite-1';
import { Renderer } from './render/Renderer.js?v=motion-lite-1';
import { UIController } from './ui/UIController.js';

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
  if (renderer.art.isLevelReady(game.levelId)) document.body.classList.remove('art-loading');
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);

globalThis.__SHANHAIJING_TD__ = game;

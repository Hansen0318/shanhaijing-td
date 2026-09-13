import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

test('Level4 Jiuweihu HUD uses the empty-channel art and one code-driven fill', async () => {
  const css = await readFile(new URL('../styles-lineup.css', import.meta.url), 'utf8');
  const art = await readFile(new URL('../src/config/artAssets.js', import.meta.url), 'utf8');
  const html = await readFile(new URL('../index.html', import.meta.url), 'utf8');
  const main = await readFile(new URL('../src/main.js', import.meta.url), 'utf8');
  const ui = await readFile(new URL('../src/ui/UIController.js', import.meta.url), 'utf8');
  const renderer = await readFile(new URL('../src/render/Renderer.js', import.meta.url), 'utf8');
  const selector = 'body[data-level="4"] .boss-hud[data-boss-type="jiuweihu"]';
  assert.match(art, /jiuweihuBossPanel:\s*'assets\/ui\/ui_boss_jiuweihu_panel_v2\.png'/);
  assert.match(css, new RegExp(`${selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')} \\.boss-track\\s*\\{[\\s\\S]*?background:\\s*transparent`));
  assert.match(css, new RegExp(`${selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')} \\.boss-track span\\s*\\{[\\s\\S]*?background:\\s*#e34658`));
  assert.doesNotMatch(css, /boss-hud\[data-boss-type="jiuweihu"\]::before/);
  assert.doesNotMatch(css, /background:\s*#202638/);
  assert.equal((html.match(/id="boss-hp-fill"/g) ?? []).length, 1);
  assert.match(html, /styles-lineup\.css\?v=blessing-fix-1&bossbar=2/);
  assert.match(html, /src\/main\.js\?v=bossbar-2/);
  assert.match(main, /Renderer\.js\?v=bossbar-2/);
  assert.match(main, /UIController\.js\?v=bossbar-2/);
  assert.match(main, /artAssets\.js\?v=bossbar-2/);
  assert.match(ui, /artAssets\.js\?v=bossbar-2/);
  assert.match(renderer, /artAssets\.js\?v=bossbar-2/);
  assert.match(ui, /boss-hp-fill'\]\.style\.width = `\$\{boss\.hp \/ boss\.maxHp \* 100\}%`/);
});

import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

test('all seven Boss HUDs use one variable-positioned code-driven fill without image masks', async () => {
  const base = await readFile(new URL('../styles.css', import.meta.url), 'utf8');
  const fixes = await readFile(new URL('../styles-fixes.css', import.meta.url), 'utf8');
  const css = await readFile(new URL('../styles-lineup.css', import.meta.url), 'utf8');
  const art = await readFile(new URL('../src/config/artAssets.js', import.meta.url), 'utf8');
  const html = await readFile(new URL('../index.html', import.meta.url), 'utf8');
  const main = await readFile(new URL('../src/main.js', import.meta.url), 'utf8');
  const ui = await readFile(new URL('../src/ui/UIController.js', import.meta.url), 'utf8');
  const renderer = await readFile(new URL('../src/render/Renderer.js', import.meta.url), 'utf8');
  assert.match(art, /bossPanel:\s*'assets\/ui\/ui_boss_qiongqi_panel_v2\.png'/);
  assert.match(art, /paoxiaoBossPanel:\s*'assets\/ui\/ui_boss_paoxiao_panel_v2\.png'/);
  assert.match(art, /xiangliuBossPanel:\s*'assets\/ui\/ui_boss_xiangliu_panel_v2\.png'/);
  assert.match(art, /jiuweihuBossPanel:\s*'assets\/ui\/ui_boss_jiuweihu_panel_v2\.png'/);
  assert.match(art, /xingtianBossPanel:\s*'assets\/ui\/ui_boss_xingtian_panel_v1\.png'/);
  assert.match(art, /jinwuBossPanel:\s*'assets\/ui\/ui_boss_jinwu_panel_v1\.png'/);
  assert.match(art, /zhulongBossPanel:\s*'assets\/ui\/ui_boss_zhulong_panel_v1\.png'/);
  assert.match(base, /left:\s*var\(--boss-track-left\)/);
  assert.match(base, /top:\s*var\(--boss-track-top\)/);
  assert.match(base, /width:\s*var\(--boss-track-width\)/);
  assert.match(base, /height:\s*var\(--boss-track-height\)/);
  assert.match(base, /\.boss-hud strong\s*\{[^}]*position:\s*absolute[^}]*line-height:\s*14px/);
  assert.match(base, /\.boss-track\s*\{[\s\S]*?background:\s*transparent/);
  assert.doesNotMatch(`${base}\n${fixes}\n${css}`, /boss-hud\[data-boss-type="(?:qiongqi|paoxiao|xiangliu|jiuweihu|xingtian|jinwu)"\]::before/);
  assert.doesNotMatch(`${base}\n${fixes}\n${css}`, /background:\s*#202638/);
  assert.equal((html.match(/id="boss-hp-fill"/g) ?? []).length, 1);
  assert.match(html, /styles\.css\?v=level8-3/);
  assert.match(html, /styles-fixes\.css\?v=level8-3/);
  assert.match(html, /styles-lineup\.css\?v=level8-3/);
  assert.match(html, /src\/main\.js\?v=level8-7/);
  assert.match(main, /Renderer\.js\?v=level8-7/);
  assert.match(main, /UIController\.js\?v=level8-5/);
  assert.match(main, /artAssets\.js\?v=level8-3/);
  assert.match(ui, /artAssets\.js\?v=level8-3/);
  assert.match(renderer, /artAssets\.js\?v=level8-3/);
  assert.match(ui, /boss-hp-fill'\]\.style\.width = `\$\{boss\.hp \/ boss\.maxHp \* 100\}%`/);
});

test('Huashe preserves its panel proportions inside the same fixed Boss HUD footprint', async () => {
  const css = await readFile(new URL('../styles.css', import.meta.url), 'utf8');
  assert.match(css, /\.boss-slot\s*\{[^}]*flex:\s*0 0 44px[^}]*min-height:\s*44px/);
  const huasheRule = css.match(/\.boss-hud\[data-boss-type="huashe"\]\s*\{([^}]*)\}/)?.[1] ?? '';
  assert.match(huasheRule, /border-image-slice:\s*25 fill/);
  assert.doesNotMatch(huasheRule, /(?:height|min-height|padding)\s*:/, 'Huashe cannot enlarge the shared HUD footprint');
});

test('Zhulong keeps the shared 44px Boss HUD footprint and programmatic text/fill', async () => {
  const css = await readFile(new URL('../styles.css', import.meta.url), 'utf8');
  const rule = css.match(/\.boss-hud\[data-boss-type="zhulong"\]\s*\{([^}]*)\}/)?.[1] ?? '';
  assert.doesNotMatch(rule, /(?:height|min-height|padding)\s*:/, 'Zhulong cannot enlarge the shared HUD footprint');
});

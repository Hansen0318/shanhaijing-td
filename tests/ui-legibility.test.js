import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

async function combinedCss() {
  const base = await readFile(new URL('../styles.css', import.meta.url), 'utf8');
  const fixes = await readFile(new URL('../styles-fixes.css', import.meta.url), 'utf8').catch(() => '');
  return `${base}\n${fixes}`;
}

test('wave preview keeps title, enemy icons, and counts vertically aligned', async () => {
  const css = await combinedCss();
  assert.match(css, /\.wave-preview > strong\s*\{[^}]*display:\s*flex[^}]*flex-direction:\s*column[^}]*align-items:\s*flex-start[^}]*line-height:\s*1/s);
  assert.match(css, /\.wave-preview-enemies\s*\{[^}]*align-items:\s*center[^}]*justify-content:\s*flex-start[^}]*line-height:\s*1/s);
  assert.match(css, /\.preview-art\s*\{[^}]*display:\s*block[^}]*flex:\s*0\s+0\s+18px/s);
});

test('level label is readable without crowding wave enemy counts', async () => {
  const css = await combinedCss();
  const titleRule = [...css.matchAll(/\.wave-preview > strong\s*\{[^}]*\}/gs)].at(-1)?.[0] ?? '';
  const levelRule = [...css.matchAll(/\.wave-preview > strong \.level-name\s*\{[^}]*\}/gs)].at(-1)?.[0] ?? '';
  assert.match(titleRule, /flex:\s*0\s+0\s+30%/);
  assert.match(levelRule, /font-size:\s*12px/);
  assert.match(levelRule, /font-weight:\s*800/);
  assert.match(levelRule, /color:\s*#fff0b0/);
  assert.match(levelRule, /text-shadow:/);
  assert.match(levelRule, /white-space:\s*nowrap/);
});

test('blessing cards reserve a clean readable content field', async () => {
  const css = await combinedCss();
  assert.match(css, /\.blessing-card\s*\{[^}]*grid-template-columns:\s*1fr;[^}]*align-content:\s*center[^}]*text-shadow:/s);
  assert.match(css, /border-image:\s*url\('\.\/assets\/ui\/ui_blessing_card_v1\.png\?v=asset-opt-1'\)\s+160\s*\/\s*10px\s*\/\s*0\s+stretch/);
});

test('result panel reserves artwork-safe header space and readable stats', async () => {
  const css = await combinedCss();
  assert.match(css, /\.result-panel\s*\{[^}]*min-height:\s*430px[^}]*padding:\s*106px\s+32px\s+28px[^}]*text-shadow:/s);
  assert.match(css, /#result-stats\s*\{[^}]*border-radius:\s*12px[^}]*background:\s*rgba\(7,\s*28,\s*21,\s*\.72\)/s);
  assert.match(css, /#retry-button\s*\{[^}]*width:\s*100%/s);
});

test('result eyebrow has its own dark contrast field over decorative artwork', async () => {
  const css = await combinedCss();
  const rule = css.match(/\.result-panel \.eyebrow\s*\{[^}]*\}/s)?.[0] ?? '';
  assert.match(rule, /justify-self:\s*center/);
  assert.match(rule, /background:\s*rgba\(5,\s*22,\s*16,\s*\.9\)/);
  assert.match(rule, /border-radius:\s*999px/);
});

test('index loads the art readability override after the base stylesheet', async () => {
  const html = await readFile(new URL('../index.html', import.meta.url), 'utf8').catch(() => '<link rel="stylesheet" href="./styles.css">');
  assert.match(html, /styles\.css[\s\S]*styles-fixes\.css/);
});

test('initial page stays behind an art-loading gate until packaged images settle', async () => {
  const [html, css, main] = await Promise.all([
    readFile(new URL('../index.html', import.meta.url), 'utf8'),
    combinedCss(),
    readFile(new URL('../src/main.js', import.meta.url), 'utf8'),
  ]);
  assert.match(html, /<body class="art-loading">/);
  assert.match(html, /id="art-loading-overlay"[^>]*role="status"/);
  assert.match(html, /山海異獸載入中/);
  assert.match(css, /body\.art-loading\s+\.game-shell[^}]*visibility:\s*hidden/s);
  assert.match(css, /\.art-loading-overlay\s*\{[^}]*position:\s*fixed[^}]*transition:\s*opacity\s+\.2s/s);
  assert.match(css, /body\.art-loading\s+\.art-loading-overlay[^}]*opacity:\s*1[^}]*pointer-events:\s*auto/s);
  assert.match(css, /@keyframes\s+loading-pulse/);
  assert.match(main, /renderer\.art\.isLevelReady\(game\.levelId\)[\s\S]*classList\.remove\('art-loading'\)/);
  assert.match(main, /renderer\.art\.preloadDeferred\(game\.levelId\)/);
});

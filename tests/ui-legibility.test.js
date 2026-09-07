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
  assert.match(css, /\.wave-preview > strong\s*\{[^}]*display:\s*flex[^}]*align-items:\s*center[^}]*line-height:\s*1/s);
  assert.match(css, /\.wave-preview-enemies\s*\{[^}]*align-items:\s*center[^}]*justify-content:\s*flex-start[^}]*line-height:\s*1/s);
  assert.match(css, /\.preview-art\s*\{[^}]*display:\s*block[^}]*flex:\s*0\s+0\s+18px/s);
});

test('blessing cards reserve a clean readable content field', async () => {
  const css = await combinedCss();
  assert.match(css, /\.blessing-card\s*\{[^}]*grid-template-columns:\s*1fr;[^}]*align-content:\s*center[^}]*text-shadow:/s);
  assert.match(css, /border-image:\s*url\('\.\/assets\/ui\/ui_blessing_card_v1\.png'\)\s+160\s*\/\s*10px\s*\/\s*0\s+stretch/);
});

test('result panel reserves artwork-safe header space and readable stats', async () => {
  const css = await combinedCss();
  assert.match(css, /\.result-panel\s*\{[^}]*min-height:\s*430px[^}]*padding:\s*106px\s+32px\s+28px[^}]*text-shadow:/s);
  assert.match(css, /#result-stats\s*\{[^}]*border-radius:\s*12px[^}]*background:\s*rgba\(7,\s*28,\s*21,\s*\.72\)/s);
  assert.match(css, /#retry-button\s*\{[^}]*width:\s*100%/s);
});

test('result eyebrow has its own dark contrast field over decorative artwork', async () => {
  const css = await combinedCss();
  assert.match(css, /\.result-panel \.eyebrow\s*\{[^}]*justify-self:\s*center[^}]*background:\s*rgba\(5,\s*22,\s*16,\s*\.9\)[^}]*border-radius:/s);
});

test('index loads the art readability override after the base stylesheet', async () => {
  const html = await readFile(new URL('../index.html', import.meta.url), 'utf8').catch(() => '<link rel="stylesheet" href="./styles.css">');
  assert.match(html, /styles\.css[\s\S]*styles-fixes\.css/);
});

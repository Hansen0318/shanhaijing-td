import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

test('Level4 Jiuwweihu HUD uses an empty art channel with one code-driven HP fill', async () => {
  const css = await readFile(new URL('../styles-lineup.css', import.meta.url), 'utf8');
  const art = await readFile(new URL('../src/config/artAssets.js', import.meta.url), 'utf8');
  assert.match(art, /jiuweihuBossPanel:\s*'assets\/ui\/ui_boss_jiuweihu_panel_v2\.png'/);
  assert.match(css, /body\[data-level="4"\][\s\S]*\.boss-track\s*\{[\s\S]*background:\s*transparent/);
  assert.match(css, /body\[data-level="4"\][\s\S]*\.boss-track span\s*\{[\s\S]*background:\s*#e34658/);
});

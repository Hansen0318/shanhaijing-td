import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

test('Level4 Jiuwweihu HUD masks baked HP art and renders one code-driven fill', async () => {
  const css = await readFile(new URL('../styles-lineup.css', import.meta.url), 'utf8');
  const ui = await readFile(new URL('../src/ui/UIController.js', import.meta.url), 'utf8');
  assert.match(css, /body\[data-level="4"\] \.boss-hud\[data-boss-type="jiuweihu"\]::before/);
  assert.match(css, /::before\s*\{[\s\S]*background:\s*#202638/);
  assert.match(css, /\.boss-track\s*\{[\s\S]*background:\s*transparent/);
  assert.match(css, /\.boss-track span\s*\{[\s\S]*background:\s*#e34658/);
  assert.match(ui, /boss-hp-fill'\]\.style\.width = `\$\{boss\.hp \/ boss\.maxHp \* 100\}%`/);
});

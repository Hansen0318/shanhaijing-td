import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { UIController } from '../src/ui/UIController.js';

test('HTML exposes the complete mobile game interface', async () => {
  const html = await readFile(new URL('../index.html', import.meta.url), 'utf8');
  for (const value of ['viewport-fit=cover', 'game-canvas', 'base-hp', 'gold', 'wave', 'pause-button', 'speed-button', 'context-panel', 'blessing-overlay', 'pause-overlay', 'result-overlay', 'next-level-button', 'boss-name', 'src/main.js']) assert.match(html, new RegExp(value));
});

test('HTML exposes the level-four three-of-four lineup dialog', async () => {
  const html = await readFile(new URL('../index.html', import.meta.url), 'utf8');
  for (const value of ['lineup-overlay', 'lineup-choices', 'confirm-lineup-button']) {
    assert.match(html, new RegExp(`id="${value}"`));
  }
  assert.match(html, /選擇 3 隻異獸/);
  assert.match(html, /敵情：妖霧籠罩青丘，敵人擅長高速突進與幻術干擾/);
  assert.match(html, /推薦職能：控制／洞察／範圍攻擊/);
});

test('preparation CTA lives in wave preview and no longer overlays battlefield', async () => {
  const html = await readFile(new URL('../index.html', import.meta.url), 'utf8');
  const ui = await readFile(new URL('../src/ui/UIController.js', import.meta.url), 'utf8');
  const fixes = await readFile(new URL('../styles-fixes.css', import.meta.url), 'utf8');
  const preview = html.match(/<div id="wave-preview"[\s\S]*?<\/div>\s*<div id="boss-hud"/)?.[0] ?? '';
  const battlefield = html.match(/<section class="battlefield"[\s\S]*?<\/section>/)?.[0] ?? '';
  assert.match(preview, /id="start-wave-button"/);
  assert.doesNotMatch(battlefield, /wave-control|countdown-label|start-wave-button/);
  assert.match(ui, /start-wave-button'\]\.hidden = !preparing/);
  assert.match(ui, /`開始 W\$\{game\.wave\.waveNumber \+ 1\}`/);
  assert.match(fixes, /\.start-wave-inline\s*\{/);
});

test('dev menu is opt-in only and direct level initialization selects the ArtStore level first', async () => {
  const html = await readFile(new URL('../index.html', import.meta.url), 'utf8');
  const main = await readFile(new URL('../src/main.js', import.meta.url), 'utf8');
  assert.doesNotMatch(html, /dev-level-menu|Level1<\/button>|Level2<\/button>|Level3<\/button>/);
  assert.match(main, /params\.get\('devMenu'\) === '1'/);
  assert.match(main, /renderDevMenu\(\)/);
  assert.match(main, /data-dev-level="1"[\s\S]*data-dev-level="2"[\s\S]*data-dev-level="3"[\s\S]*data-dev-level="4"[\s\S]*data-dev-level="5"[\s\S]*data-dev-level="6"/);
  assert.match(main, /\[1, 2, 3, 4, 5, 6, 7, 8, 9\]\.includes\(devLevel\) \? devLevel : 1/);
  assert.match(main, /new ArtStore\(Image, initialLevelId\)/);
  assert.match(main, /new Renderer\(canvas, art\)/);
});

test('dev menu and guarded direct controls include level four', async () => {
  const main = await readFile(new URL('../src/main.js', import.meta.url), 'utf8');
  assert.match(main, /data-dev-level="4"/);
  assert.match(main, /\[1, 2, 3, 4, 5, 6, 7, 8, 9\]\.includes\(devLevel\)/);
  assert.match(main, /params\.get\('devWave'\)/);
  assert.match(main, /params\.get\('devBossPhase'\)/);
  assert.match(main, /devLevel !== 4/);
  assert.match(main, /game\.level\.map\.fogZones/);
});

test('dev menu and guarded direct controls include level five path, wave, and Boss phases', async () => {
  const main = await readFile(new URL('../src/main.js', import.meta.url), 'utf8');
  assert.match(main, /data-dev-level="5"/);
  assert.match(main, /\[1, 2, 3, 4, 5, 6, 7, 8, 9\]\.includes\(devLevel\)/);
  assert.match(main, /function setupLevelFiveDev\(game, devLevel\)/);
  assert.match(main, /devLevel !== 5/);
  assert.match(main, /game\.level\.map\.chargeCorridor/);
  assert.match(main, /game\.spawnEnemy\('xingtian'\)/);
});

test('dev menu and guarded direct controls include Level6 geometry, sunlight, waves, and Jinwu phases', async () => {
  const html = await readFile(new URL('../index.html', import.meta.url), 'utf8');
  const main = await readFile(new URL('../src/main.js', import.meta.url), 'utf8');
  const smoke = await readFile(new URL('./browser-smoke.html', import.meta.url), 'utf8');
  assert.doesNotMatch(html, /data-dev-level="6"/);
  assert.match(main, /data-dev-level="6"/);
  assert.match(main, /\[1, 2, 3, 4, 5, 6, 7, 8, 9\]\.includes\(devLevel\)/);
  assert.match(main, /function setupLevelSixDev\(game, devLevel\)/);
  assert.match(main, /devLevel !== 6/);
  assert.match(main, /game\.level\.map\.sunlightZones/);
  assert.match(main, /game\.spawnEnemy\('jinwu'\)/);
  assert.match(main, /setupLevelSixDev\(game, devLevel\)/);
  for (const state of ['level5', 'level6', 'level6wave1', 'sunlightA', 'sunlightB', 'jinwu1', 'jinwu2', 'jinwu25', 'level6victory', 'level6retry']) {
    assert.match(smoke, new RegExp(`data-state="${state}"`));
  }
  assert.match(smoke, /index\.html\?v=level9-1/);
});

test('dev menu and guarded direct controls include Level7 thunder, Kui phases, victory, and retry', async () => {
  const html = await readFile(new URL('../index.html', import.meta.url), 'utf8');
  const main = await readFile(new URL('../src/main.js', import.meta.url), 'utf8');
  const smoke = await readFile(new URL('./browser-smoke.html', import.meta.url), 'utf8');
  assert.doesNotMatch(html, /data-dev-level="7"/);
  assert.match(main, /data-dev-level="7"/);
  assert.match(main, /\[1, 2, 3, 4, 5, 6, 7, 8, 9\]\.includes\(devLevel\)/);
  assert.match(main, /function setupLevelSevenDev\(game, devLevel\)/);
  assert.match(main, /devLevel !== 7/);
  assert.match(main, /game\.level\.map\.thunderZones/);
  assert.match(main, /game\.spawnEnemy\('kui'\)/);
  assert.match(main, /setupLevelSevenDev\(game, devLevel\)/);
  for (const state of ['level7', 'level7wave1', 'thunderA', 'thunderB', 'kui1', 'kui2', 'kui25', 'level7victory', 'level7retry']) {
    assert.match(smoke, new RegExp(`data-state="${state}"`));
  }
  assert.match(smoke, /index\.html\?v=level9-1/);
});

test('dev menu and smoke controls include Level8 tide, Huashe, Xuangui, victory, and retry', async () => {
  const html = await readFile(new URL('../index.html', import.meta.url), 'utf8');
  const main = await readFile(new URL('../src/main.js', import.meta.url), 'utf8');
  const dev = await readFile(new URL('../src/dev/LevelEightDev.js', import.meta.url), 'utf8');
  const smoke = await readFile(new URL('./browser-smoke.html', import.meta.url), 'utf8');
  assert.doesNotMatch(html, /data-dev-level="8"/);
  assert.match(main, /data-dev-level="8"/);
  assert.match(main, /\[1, 2, 3, 4, 5, 6, 7, 8, 9\]\.includes\(devLevel\)/);
  assert.match(main, /setupLevelEightDev\(game, devLevel, params\)/);
  assert.match(main, /game\.level\.map\.wetlandZones/);
  assert.match(dev, /game\.spawnEnemy\('huashe'\)/);
  assert.match(dev, /game\.unlockedBeasts\.add\('xuangui'\)/);
  assert.match(dev, /params\.get\('devVictory'\)/);
  assert.match(dev, /params\.get\('devRetry'\)/);
  for (const state of ['level8', 'level8wave1', 'tideTelegraph', 'tideHigh', 'huashe1', 'huashe2', 'xuanguiShock', 'level8victory', 'level8retry']) {
    assert.match(smoke, new RegExp(`data-state="${state}"`));
  }
});

test('guarded Level9 controls cover lineup, path, day/night cues, Zhulong, Xuangui and terminal victory', async () => {
  const html = await readFile(new URL('../index.html', import.meta.url), 'utf8');
  const main = await readFile(new URL('../src/main.js', import.meta.url), 'utf8');
  const dev = await readFile(new URL('../src/dev/LevelNineDev.js', import.meta.url), 'utf8');
  const smoke = await readFile(new URL('./browser-smoke.html', import.meta.url), 'utf8');
  const responsive = await readFile(new URL('./responsive.html', import.meta.url), 'utf8');
  assert.doesNotMatch(html, /data-dev-level="9"/);
  assert.match(main, /data-dev-level="9"/);
  assert.match(main, /\[1, 2, 3, 4, 5, 6, 7, 8, 9\]\.includes\(devLevel\)/);
  assert.match(main, /setupLevelNineDev\(game, devLevel, params\)/);
  assert.match(dev, /devLevel !== 9/);
  assert.match(dev, /game\.spawnEnemy\('zhulong'\)/);
  assert.match(dev, /game\.unlockedBeasts\.add\('xuangui'\)/);
  assert.match(dev, /params\.get\('devState'\)/);
  for (const state of ['level8To9', 'level9', 'level9wave1', 'level9day', 'level9night', 'level9telegraph', 'tiangouDay', 'zhengNight', 'zhulong1', 'zhulong2', 'level9Xuangui', 'level9victory', 'level9retry']) {
    assert.match(smoke, new RegExp(`data-state="${state}"`));
  }
  assert.match(smoke, /devLevel=8&devVictory=1/);
  assert.match(smoke, /next-level-button/);
  for (const title of ['Level9 lineup 390x700', 'Level9 path 390x700', 'Level9 night 390x700', 'Level9 Zhulong P2 390x700', 'Level9 victory 390x700']) {
    assert.match(responsive, new RegExp(`title="${title}"`));
  }
});

test('entry and style cache versions are fresh for this release', async () => {
  const html = await readFile(new URL('../index.html', import.meta.url), 'utf8');
  const game = await readFile(new URL('../src/core/Game.js', import.meta.url), 'utf8');
  const main = await readFile(new URL('../src/main.js', import.meta.url), 'utf8');
  const enemy = await readFile(new URL('../src/entities/Enemy.js', import.meta.url), 'utf8');
  const projectile = await readFile(new URL('../src/entities/Projectile.js', import.meta.url), 'utf8');
  const progression = await readFile(new URL('../src/config/progressionData.js', import.meta.url), 'utf8');
  for (const path of ['styles.css', 'styles-fixes.css', 'styles-lineup.css']) {
    assert.match(html, new RegExp(`${path.replace('.', '\\.')}\\?v=level9-1`));
  }
  assert.match(html, /src\/main\.js\?v=level9-1/);
  assert.match(main, /Game\.js\?v=level9-1/);
  assert.match(main, /Renderer\.js\?v=level9-1/);
  assert.match(main, /UIController\.js\?v=level9-1/);
  for (const module of ['artAssets', 'LevelEightDev']) assert.match(main, new RegExp(`${module}\\.js\\?v=level9-1`));
  for (const module of ['gameData', 'BossSystem', 'TideSystem', 'DayNightSystem']) assert.match(game, new RegExp(`${module}\\.js\\?v=level9-1`));
  for (const module of ['GameMap', 'Enemy', 'Tower', 'Projectile', 'CombatSystem', 'BlessingSystem', 'StatusSystem', 'LineupSystem', 'progressionData', 'MotionSystem', 'motionData']) {
    assert.match(game, new RegExp(`${module}\\.js\\?v=level9-1`));
  }
  assert.match(enemy, /StatusSystem\.js\?v=level9-1/);
  assert.match(projectile, /CombatSystem\.js\?v=level9-1/);
  assert.match(projectile, /StatusSystem\.js\?v=level9-1/);
  assert.match(progression, /gameData\.js\?v=level9-1/);
});

test('context panel is not rebuilt when its state signature is unchanged', () => {
  const ui = Object.create(UIController.prototype);
  assert.equal(ui.shouldRenderContext('slot-0-gold-300'), true);
  assert.equal(ui.shouldRenderContext('slot-0-gold-300'), false);
  assert.equal(ui.shouldRenderContext('slot-0-gold-180'), true);
});

test('boss names stay programmatic, Boss art masks are absent, and heal feedback is explicit', async () => {
  const ui = await readFile(new URL('../src/ui/UIController.js', import.meta.url), 'utf8');
  const fixes = await readFile(new URL('../styles-fixes.css', import.meta.url), 'utf8');
  const game = await readFile(new URL('../src/core/Game.js', import.meta.url), 'utf8');
  assert.doesNotMatch(ui, /bossNameInArt/);
  assert.match(ui, /boss-name'\]\.textContent = boss\.data\.name/);
  assert.match(ui, /boss-hud'\]\.dataset\.bossType = boss\.type/);
  assert.match(ui, /回血 \+\$\{healEffect\.amount\} HP/);
  assert.doesNotMatch(fixes, /boss-hud\[data-boss-type="xiangliu"\]::before/);
  assert.doesNotMatch(fixes, /\.boss-hud\[data-boss-type="xiangliu"\] > \*/);
  assert.match(game, /xiangliuHealPulse'[\s\S]*life: 1\.2, duration: 1\.2/);
  assert.match(game, /bossHealText'[\s\S]*amount: event\.healAmount[\s\S]*life: 1\.2, duration: 1\.2/);
});

test('mobile entry resets browser scroll restoration and anchors the game at the top', async () => {
  const main = await readFile(new URL('../src/main.js', import.meta.url), 'utf8');
  assert.match(main, /history\.scrollRestoration = 'manual'/);
  assert.match(main, /function resetViewport\(\)/);
  assert.match(main, /window\.scrollTo\(0, 0\)/);
  assert.match(main, /window\.addEventListener\('pageshow', resetViewport\)/);
  assert.match(main, /document\.body\.classList\.remove\('art-loading'\);[\s\S]*resetViewport\(\)/);
});

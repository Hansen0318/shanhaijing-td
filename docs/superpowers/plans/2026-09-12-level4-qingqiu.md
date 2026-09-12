# Level 4 Qingqiu Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship a playable, asset-optimized Level4 with 4→3 lineup selection, Baize insight support, Qingqiu fog and illusion enemies, a three-phase Jiuweihu boss, and visibly strong Motion V2 on 390px mobile.

**Architecture:** Extend the existing data-driven level and combat pipeline. Keep lineup validation and illusion lifecycle in small focused modules, while existing `Game`, `StatusSystem`, `BossSystem`, `MotionSystem`, `Renderer`, and `UIController` coordinate state, damage, boss events, rendering, and UI. Level1–3 continue to use their current fixed roster and mechanics.

**Tech Stack:** Vanilla ES modules, HTML/CSS, Canvas 2D, Node.js built-in test runner, ImageMagick asset tooling, GitHub Pages.

**Spec:** `docs/superpowers/specs/2026-09-12-level4-qingqiu-design.md`

## Global Constraints

- Level1–3 gameplay, balance, paths, fixed roster, and visuals must not change.
- Preparation stays unlimited and starts only through the existing manual Start Wave action.
- Canvas logic size stays 390×610; the battlefield, fixed Context Panel, Boss HUD reservation, and safe-area behavior stay intact.
- Level4 retry after victory or defeat returns to an empty 4→3 lineup selection.
- Boss evolution never queues a center Banner or phase-name text.
- Motion V2 Idle, Hit, Skill, Evolution, and Death must be visibly obvious at 390px; 1–2px-only movement or barely perceptible scale is rejected.
- Runtime sprite/VFX/UI overlay assets use alpha; the background may remain JPEG.
- Required preload contains first-paint and lineup/build-ready art only; Boss and later VFX remain deferred.
- Use TDD for behavior changes and create a safe commit after each task.
- Do not manually replay all ten waves of all four levels; use focused Level4 and shared regression smoke.

## File Structure

- Create `src/systems/LineupSystem.js`: validate and normalize Level4 roster choices.
- Create `src/entities/Illusion.js`: one-hit, time-limited, non-wave target lifecycle.
- Create `tests/level4.test.js`: Level4 data, lineup, fog, enemies, Baize, Boss, and progression contracts.
- Create `tests/level4-motion.test.js`: Motion V2 phase and minimum-visibility contracts.
- Create `scripts/prepare-level4-assets.sh`: reproducible Level4 source-to-runtime image pipeline.
- Create `assets/levels/level4/*`, `assets/towers/tower_baize_v1.png`, Level4 enemy/Boss/VFX/UI runtime files.
- Modify `src/config/gameData.js`: Baize, Level4 enemies, waves, map, fog zones, level record.
- Modify `src/config/artAssets.js`: Level4 art catalog and staged preload groups.
- Modify `src/core/Game.js`: lineup state, roster enforcement, Level4 enemy/Boss events, dev hooks.
- Modify `src/entities/Enemy.js`: terrain-entry state, insight-compatible status, phase metadata.
- Modify `src/entities/Tower.js`: Baize level stats.
- Modify `src/map/GameMap.js`: indexed Level4 fog-zone lookup.
- Modify `src/systems/StatusSystem.js`: insight, temporary speed boost, timed defense/slow modifiers.
- Modify `src/systems/CombatSystem.js`: insight vulnerability and true-body target priority.
- Modify `src/systems/BossSystem.js`: deterministic Jiuweihu phase and timed skill events.
- Modify `src/config/motionData.js`, `src/systems/MotionSystem.js`, `src/render/Renderer.js`: Level4 art and Motion V2.
- Modify `index.html`, `styles.css`, `styles-fixes.css`, `src/ui/UIController.js`, `src/main.js`: lineup overlay, Level4 navigation, dev entry, cache version.
- Modify shared tests and `tests/browser-smoke.html` only where shared contracts genuinely change.
- Modify `docs/WORK_PROGRESS.md`: checkpoints, asset report, tests, smoke, next step, SHA.

---

### Task 1: Level4 Data and Lineup Domain

**Files:**
- Create: `src/systems/LineupSystem.js`
- Create: `tests/level4.test.js`
- Modify: `src/config/gameData.js`
- Modify: `src/core/Game.js`
- Test: `tests/level4.test.js`
- Test: `tests/core.test.js`
- Test: `tests/level3.test.js`

**Interfaces:**
- Produces: `LEVEL4_ROSTER`, `normalizeLineup(types)`, `isValidLineup(types)`.
- Produces: `Game.beginLevelFourLineup()`, `Game.toggleLineup(type)`, `Game.confirmLineup()`, `Game.availableTowerTypes()`.
- Produces: `LEVEL4_MAP_DATA`, `LEVEL4_WAVE_DATA`, and `LEVELS[4]`.

- [ ] **Step 1: Write failing Level4 data and lineup tests**

```js
test('level four defines Qingqiu, ten waves, eight slots and two fog zones', () => {
  const level = getLevelData(4);
  assert.equal(level.name, '青丘妖境');
  assert.equal(level.baseName, '青丘靈臺');
  assert.equal(level.bossType, 'jiuweihu');
  assert.equal(level.waves.length, 10);
  assert.equal(level.map.slots.length, 8);
  assert.equal(level.map.fogZones.length, 2);
  assert.deepEqual(level.waves[9].groups, [
    { type: 'meihu', count: 10 },
    { type: 'huanli', count: 6 },
    { type: 'jiuweihu', count: 1 },
  ]);
});

test('level four requires exactly three unique lineup members', () => {
  assert.equal(isValidLineup(['bifang', 'fuzhu']), false);
  assert.equal(isValidLineup(['bifang', 'fuzhu', 'bifang']), false);
  assert.equal(isValidLineup(['bifang', 'fuzhu', 'baize']), true);
  assert.deepEqual(normalizeLineup(['baize', 'bad', 'baize', 'yinglong']), ['baize', 'yinglong']);
});

test('level three victory enters lineup and level four builds only the selected roster', () => {
  const game = new Game(() => 0.2, 3);
  game.end('victory');
  assert.equal(game.enterLevel(4), true);
  assert.equal(game.state, 'lineup');
  for (const type of ['bifang', 'fuzhu', 'baize']) game.toggleLineup(type);
  assert.equal(game.confirmLineup(), true);
  assert.equal(game.state, 'preparation');
  assert.deepEqual(game.availableTowerTypes(), ['bifang', 'fuzhu', 'baize']);
  assert.equal(game.buildTower(0, 'yinglong').ok, false);
  assert.equal(game.buildTower(0, 'baize').ok, true);
});

test('level four retry clears the roster and returns to lineup', () => {
  const game = new Game(() => 0, 4);
  for (const type of ['bifang', 'fuzhu', 'baize']) game.toggleLineup(type);
  game.confirmLineup();
  game.end('defeat');
  assert.equal(game.restart(), true);
  assert.equal(game.state, 'lineup');
  assert.deepEqual(game.lineupSelection, []);
});
```

- [ ] **Step 2: Run the new tests and verify RED**

Run: `node --test tests/level4.test.js tests/core.test.js tests/level3.test.js`

Expected: FAIL because Level4 data, Baize data, and lineup methods do not exist; existing Level1–3 tests remain green.

- [ ] **Step 3: Implement lineup helpers and Level4 configuration**

```js
export const LEVEL4_ROSTER = Object.freeze(['bifang', 'fuzhu', 'yinglong', 'baize']);

export function normalizeLineup(types = []) {
  return [...new Set(types)].filter(type => LEVEL4_ROSTER.includes(type));
}

export function isValidLineup(types = []) {
  return normalizeLineup(types).length === 3 && types.length === 3;
}
```

Add exact Level4 baseline data from the spec. Use these map anchors and zones as the committed runtime contract:

```js
waypoints: [
  { x: -20, y: 3 }, { x: 28, y: 8 }, { x: 67, y: 24 }, { x: 108, y: 45 },
  { x: 151, y: 59 }, { x: 188, y: 74 }, { x: 211, y: 96 }, { x: 218, y: 119 },
  { x: 207, y: 140 }, { x: 181, y: 159 }, { x: 151, y: 181 }, { x: 137, y: 203 },
  { x: 148, y: 224 }, { x: 181, y: 239 }, { x: 226, y: 244 }, { x: 268, y: 254 },
  { x: 290, y: 273 }, { x: 292, y: 294 }, { x: 278, y: 313 }, { x: 247, y: 327 },
  { x: 205, y: 338 }, { x: 170, y: 353 }, { x: 152, y: 372 }, { x: 163, y: 390 },
  { x: 197, y: 402 }, { x: 242, y: 406 }, { x: 284, y: 414 }, { x: 317, y: 431 },
  { x: 335, y: 454 }, { x: 335, y: 479 }, { x: 321, y: 506 }, { x: 321, y: 533 },
  { x: 338, y: 560 }, { x: 367, y: 583 }, { x: 410, y: 600 },
],
fogZones: [
  { id: 'upper', x: 128, y: 111, width: 116, height: 111 },
  { id: 'lower', x: 244, y: 375, width: 137, height: 105 },
],
slots: [
  { x: 95, y: 91 }, { x: 123, y: 166 }, { x: 227, y: 183 }, { x: 305, y: 235 },
  { x: 112, y: 319 }, { x: 243, y: 330 }, { x: 269, y: 451 }, { x: 367, y: 483 },
],
```

Implement Game lineup transitions with exact-three validation and roster enforcement. For Level1–3, `availableTowerTypes()` must always return `['bifang', 'fuzhu', 'yinglong']`.

- [ ] **Step 4: Run focused tests and verify GREEN**

Run: `node --test tests/level4.test.js tests/core.test.js tests/level3.test.js`

Expected: PASS.

- [ ] **Step 5: Commit Task 1**

```bash
git add src/systems/LineupSystem.js src/config/gameData.js src/core/Game.js tests/level4.test.js tests/core.test.js tests/level3.test.js
git commit -m "feat: add level four lineup domain"
```

### Task 2: Lineup UI, Transition, and Build-Ready Loading

**Files:**
- Modify: `index.html`
- Modify: `styles.css`
- Modify: `styles-fixes.css`
- Modify: `src/ui/UIController.js`
- Modify: `src/main.js`
- Modify: `src/config/artAssets.js`
- Modify: `tests/ui-contract.test.js`
- Modify: `tests/ui-art.test.js`
- Modify: `tests/art-assets.test.js`

**Interfaces:**
- Consumes: `Game.lineupSelection`, `Game.toggleLineup(type)`, `Game.confirmLineup()`, `Game.availableTowerTypes()`.
- Produces: `#lineup-overlay`, `#lineup-choices`, `#confirm-lineup-button`, and `UIController.renderLineup()`.
- Produces: `ArtStore.ensureLevel(4)` and Level4 required/deferred groups.

- [ ] **Step 1: Write failing UI and preload tests**

```js
test('lineup overlay exposes four choices and requires three selections', async () => {
  assert.match(html, /id="lineup-overlay"/);
  assert.match(html, /id="confirm-lineup-button"[^>]*disabled/);
  assert.match(uiSource, /renderLineup\(\)/);
  assert.match(uiSource, /availableTowerTypes\(\)/);
});

test('level four required art includes lineup and all four candidate towers but defers boss art', () => {
  for (const id of ['level4LineupPanel', 'bifang', 'fuzhu', 'yinglong', 'baize']) {
    assert.equal(LEVEL_REQUIRED_ART_IDS[4].includes(id), true);
  }
  for (const id of ['jiuweihuPhase1', 'jiuweihuPhase2', 'jiuweihuPhase3', 'jiuweihuUltimate']) {
    assert.equal(LEVEL_REQUIRED_ART_IDS[4].includes(id), false);
    assert.equal(LEVEL_DEFERRED_ART_IDS[4].includes(id), true);
  }
});
```

- [ ] **Step 2: Run focused tests and verify RED**

Run: `node --test tests/ui-contract.test.js tests/ui-art.test.js tests/art-assets.test.js`

Expected: FAIL because lineup DOM, renderer method, and Level4 art groups are absent.

- [ ] **Step 3: Implement lineup overlay and transitions**

Add a hidden overlay whose cards use programmatic text and `assetUrl(type)`. `renderLineup()` must derive selected state from `game.lineupSelection`, disable confirm unless length is exactly three, and keep gameplay shell hidden from interaction while state is `lineup`.

```js
if (action === 'lineup-choice') this.game.toggleLineup(button.dataset.type);
if (action === 'confirm-lineup') {
  if (this.game.confirmLineup()) await this.transitionToPreparedLevel(4);
  return;
}
```

Render empty build slots from `this.game.availableTowerTypes().map(type => TOWER_DATA[type])`, not `Object.values(TOWER_DATA)`. Change the next-level condition from `levelId < 3` to `levelId < 4`.

- [ ] **Step 4: Implement Level4 staged loading**

Add Level4 art IDs and keep `LEVEL_REQUIRED_ART_IDS[4]` limited to first-paint UI, four lineup towers, slot, background, spawn, base, lineup panel, and `meihu`. Put `huanli`, all Boss sprites, Boss panel, and Level4 VFX in deferred.

- [ ] **Step 5: Run focused and shared UI tests**

Run: `node --test tests/ui-contract.test.js tests/ui-art.test.js tests/ui-legibility.test.js tests/art-assets.test.js`

Expected: PASS.

- [ ] **Step 6: Commit Task 2**

```bash
git add index.html styles.css styles-fixes.css src/ui/UIController.js src/main.js src/config/artAssets.js tests/ui-contract.test.js tests/ui-art.test.js tests/art-assets.test.js
git commit -m "feat: add level four lineup UI"
```

### Task 3: Fog Entry, Meihu, Huanli, and Illusions

**Files:**
- Create: `src/entities/Illusion.js`
- Modify: `src/map/GameMap.js`
- Modify: `src/entities/Enemy.js`
- Modify: `src/core/Game.js`
- Modify: `src/systems/StatusSystem.js`
- Modify: `src/systems/CombatSystem.js`
- Modify: `tests/level4.test.js`
- Modify: `tests/combat.test.js`

**Interfaces:**
- Produces: `GameMap.fogZoneAt(point): string|null`.
- Produces: `Illusion` with `isIllusion=true`, `countsTowardWave=false`, `takeDamage()`, `update(dt)`, and `alive`.
- Produces: `Game.spawnIllusions(source, count, duration)`.

- [ ] **Step 1: Write failing fog and illusion tests**

```js
test('Meihu triggers each fog zone once and insight halves the boost', () => {
  const map = new GameMap({
    width: 390, height: 610, pathWidth: 54,
    waypoints: [{ x: 0, y: 20 }, { x: 300, y: 20 }], slots: [],
    fogZones: [
      { id: 'upper', x: 0, y: 0, width: 80, height: 40 },
      { id: 'lower', x: 160, y: 0, width: 80, height: 40 },
    ],
  });
  const enemy = new Enemy('meihu', ENEMY_DATA.meihu, map);
  enemy.update(0.1);
  assert.equal(enemy.statuses.fogSprint.amount, 0.30);
  enemy.update(0.1);
  assert.equal(enemy.enteredFogZones.size, 1);
  StatusSystem.applyInsight(enemy, { duration: 3, vulnerability: 0.15, defensePierce: 0 });
  enemy.pathDistance = 200;
  enemy.update(0.1);
  assert.equal(enemy.statuses.fogSprint.amount, 0.15);
});

test('Huanli creates two non-wave illusions once below sixty percent', () => {
  const game = new Game(() => 0.2, 4);
  game.state = 'combat';
  game.wave.active = true;
  game.wave.remaining = 1;
  const huanli = game.spawnEnemy('huanli');
  huanli.takeDamage(huanli.maxHp * 0.41);
  game.update(0);
  assert.equal(game.illusions.length, 2);
  assert.equal(game.wave.remaining, 1);
  game.illusions[0].takeDamage(1);
  assert.equal(game.illusions[0].alive, false);
  assert.equal(game.stats.kills, 0);
});
```

- [ ] **Step 2: Run focused tests and verify RED**

Run: `node --test tests/level4.test.js tests/combat.test.js`

Expected: FAIL because fog indexing and illusion lifecycle do not exist.

- [ ] **Step 3: Implement indexed fog entry and sprint status**

`fogZoneAt()` returns the first matching zone ID or `null`. Enemy tracks `enteredFogZones`; Meihu applies `fogSprint` only when entering a previously unseen zone. `StatusSystem.speedMultiplier()` multiplies slow, fog sprint, and Boss speed effects without mutating base data.

- [ ] **Step 4: Implement one-hit non-wave illusions**

```js
export class Illusion {
  constructor(source, offset, duration) {
    this.sourceId = source.id;
    this.type = source.type;
    this.x = source.x + offset.x;
    this.y = source.y + offset.y;
    this.pathDistance = source.pathDistance;
    this.life = duration;
    this.duration = duration;
    this.alive = true;
    this.isIllusion = true;
    this.countsTowardWave = false;
  }
  takeDamage() { this.alive = false; return true; }
  update(dt) { this.life -= dt; if (this.life <= 0) this.alive = false; }
}
```

Keep illusions in `game.illusions`, combine them with real enemies only for target acquisition, and clean them without reward, Base damage, kill count, or `wave.enemyRemoved()`.

- [ ] **Step 5: Run focused tests and verify GREEN**

Run: `node --test tests/level4.test.js tests/combat.test.js tests/game.test.js tests/level2.test.js tests/level3.test.js`

Expected: PASS.

- [ ] **Step 6: Commit Task 3**

```bash
git add src/entities/Illusion.js src/map/GameMap.js src/entities/Enemy.js src/core/Game.js src/systems/StatusSystem.js src/systems/CombatSystem.js tests/level4.test.js tests/combat.test.js
git commit -m "feat: add Qingqiu fog and illusions"
```

### Task 4: Baize Insight Combat Pipeline

**Files:**
- Modify: `src/entities/Tower.js`
- Modify: `src/systems/StatusSystem.js`
- Modify: `src/systems/CombatSystem.js`
- Modify: `src/core/Game.js`
- Modify: `src/ui/UIController.js`
- Modify: `tests/level4.test.js`
- Modify: `tests/combat.test.js`
- Modify: `tests/ui-art.test.js`

**Interfaces:**
- Produces: `StatusSystem.applyInsight(enemy, { duration, vulnerability, bossVulnerability, defensePierce })`.
- Produces: Baize stats `insightDuration`, `vulnerability`, `bossVulnerability`, `defensePierce`.
- Produces: `CombatSystem.acquireTarget(..., { preferReal: true })`.

- [ ] **Step 1: Write failing Baize tests**

```js
test('Baize levels apply exact insight duration, range and defense pierce', () => {
  const tower = new Tower('baize', TOWER_DATA.baize, { x: 0, y: 0 });
  const pickInsight = stats => ({ duration: stats.insightDuration, range: stats.range, defensePierce: stats.defensePierce });
  assert.deepEqual(pickInsight(tower.getStats()), { duration: 3, range: 128, defensePierce: 0 });
  tower.level = 2;
  assert.deepEqual(pickInsight(tower.getStats()), { duration: 4, range: 136, defensePierce: 0 });
  tower.level = 3;
  assert.equal(tower.getStats().defensePierce, 0.25);
});

test('insight refreshes without stacking and adds fifteen or ten percent damage', () => {
  const minion = target(0);
  const boss = { ...target(0), isBoss: true };
  StatusSystem.applyInsight(minion, { duration: 3, vulnerability: 0.15, bossVulnerability: 0.10, defensePierce: 0 });
  assert.equal(CombatSystem.resolveDamage(100, minion), 115);
  assert.equal(CombatSystem.resolveDamage(100, boss), 110);
  StatusSystem.applyInsight(minion, { duration: 3, vulnerability: 0.15, bossVulnerability: 0.10, defensePierce: 0 });
  assert.equal(CombatSystem.resolveDamage(100, minion), 115);
});

test('Baize targets a real enemy before an illusion at equal progress', () => {
  const baize = { x: 0, y: 0 };
  const real = { ...target(20), pathDistance: 50 };
  const illusion = { ...target(20), pathDistance: 50, isIllusion: true };
  assert.equal(CombatSystem.acquireTarget(baize, [illusion, real], 128, { preferReal: true }), real);
});
```

- [ ] **Step 2: Run focused tests and verify RED**

Run: `node --test tests/level4.test.js tests/combat.test.js tests/ui-art.test.js`

Expected: FAIL because Baize stats, insight damage, and target preference are absent.

- [ ] **Step 3: Implement Baize stats, attack, and UI description**

Baize uses direct-hit damage and pushes a `baizeInsight` visual effect from tower to target. Apply insight after the hit so Baize's first hit remains base damage; subsequent hits use vulnerability. Level2 changes duration/range, and Level3 sets defense pierce to 0.25.

Update the Context Panel special text to show `洞察 {duration}秒 / 易傷 {percent}%` rather than falling through to Yinglong penetration.

- [ ] **Step 4: Apply insight through the shared damage pipeline**

Multiply resolved damage by `1 + insight.vulnerability` or `1 + insight.bossVulnerability`. Refresh remaining duration and retain the strongest defense pierce; never sum vulnerability.

- [ ] **Step 5: Run focused and regression tests**

Run: `node --test tests/level4.test.js tests/combat.test.js tests/core.test.js tests/game.test.js tests/ui-art.test.js`

Expected: PASS.

- [ ] **Step 6: Commit Task 4**

```bash
git add src/entities/Tower.js src/systems/StatusSystem.js src/systems/CombatSystem.js src/core/Game.js src/ui/UIController.js tests/level4.test.js tests/combat.test.js tests/ui-art.test.js
git commit -m "feat: add Baize insight support"
```

### Task 5: Jiuweihu Three-Phase Gameplay

**Files:**
- Modify: `src/entities/Enemy.js`
- Modify: `src/systems/BossSystem.js`
- Modify: `src/systems/StatusSystem.js`
- Modify: `src/core/Game.js`
- Modify: `tests/level4.test.js`
- Modify: `tests/game.test.js`

**Interfaces:**
- Produces: `BossSystem.update(enemy, dt, context): BossEvent[]` while retaining `BossSystem.check(enemy)` compatibility for Level1–3.
- Produces events: `bossShield`, `bossStep`, `bossEvolution`, `bossIllusions`, `bossUltimateCharge`, `bossUltimateRelease`.
- Enemy fields: `bossPhase`, `bossTimers`, `activeDefenseMultiplier`, `slowEffectivenessMultiplier`.

- [ ] **Step 1: Write failing phase and cadence tests**

```js
test('Jiuweihu enters phases two and three exactly once without banner text', () => {
  const game = new Game(() => 0.2, 4);
  const boss = new Enemy('jiuweihu', ENEMY_DATA.jiuweihu, game.map);
  const context = { inFog: false, insightActive: false };
  boss.hp = boss.maxHp * 0.60;
  assert.deepEqual(BossSystem.update(boss, 0, context), [{ type: 'bossEvolution', phase: 2, duration: 0.7 }]);
  assert.deepEqual(BossSystem.update(boss, 0, context), []);
  boss.hp = boss.maxHp * 0.25;
  assert.deepEqual(BossSystem.update(boss, 0, context), [{ type: 'bossEvolution', phase: 3, duration: 0.9 }]);
  assert.equal(boss.speedMultiplier, 1.2);
  assert.equal(game.bannerQueue.some(item => /Phase|階段|進化/.test(item.text)), false);
});

test('phase one shield and step use exact cadence and duration', () => {
  const game = new Game(() => 0.2, 4);
  const boss = new Enemy('jiuweihu', ENEMY_DATA.jiuweihu, game.map);
  const context = { inFog: false, insightActive: false };
  const events = BossSystem.update(boss, 10, context);
  assert.equal(events.some(event => event.type === 'bossShield' && event.duration === 2.5), true);
  assert.equal(events.some(event => event.type === 'bossStep' && event.duration === 1.3), true);
});

test('phase three ultimate leaves slow at sixty percent effectiveness for four seconds', () => {
  const game = new Game(() => 0.2, 4);
  const boss = new Enemy('jiuweihu', ENEMY_DATA.jiuweihu, game.map);
  const context = { inFog: false, insightActive: false };
  boss.bossPhase = 3;
  const events = BossSystem.update(boss, 7, context);
  assert.equal(events.some(event => event.type === 'bossUltimateCharge' && event.duration === 0.6), true);
  BossSystem.update(boss, 0.6, context);
  assert.equal(boss.statuses.ultimateWard.remaining, 4);
  StatusSystem.applySlow(boss, 0.4, 2);
  assert.equal(StatusSystem.speedMultiplier(boss), 0.76);
});
```

- [ ] **Step 2: Run focused tests and verify RED**

Run: `node --test tests/level4.test.js tests/game.test.js tests/level2.test.js tests/level3.test.js`

Expected: FAIL only on Jiuweihu contracts.

- [ ] **Step 3: Implement deterministic Boss timers and phase transitions**

Initialize P1 timers to 8 seconds for shield and 10 seconds for fox step. P2 resets an illusion timer to 8 seconds. P3 resets ultimate timer to 7 seconds and permanently sets base phase speed multiplier to 1.2. Use a pending release timer of 0.6 seconds for the ultimate; on release apply a four-second `ultimateWard` with `slowEffectivenessMultiplier=0.6`.

Shield sets a 0.85 normal-damage multiplier for 2.5 seconds. If Lv3 Baize insight is active, effective reduction is `0.15 * (1 - 0.25)`, producing multiplier 0.8875.

- [ ] **Step 4: Handle Boss events without phase banners**

Evolution pushes only `jiuweihuEvolution` visual effects. Skill events push cast/projectile/burst/ultimate effects. Do not call `queueBanner()` for `bossEvolution`; the normal W10 Boss arrival banner remains.

- [ ] **Step 5: Verify Boss death gate and Level1–3 regression**

Run: `node --test tests/level4.test.js tests/game.test.js tests/level2.test.js tests/level3.test.js tests/acceptance.test.js`

Expected: PASS, including victory only after Jiuweihu death.

- [ ] **Step 6: Commit Task 5**

```bash
git add src/entities/Enemy.js src/systems/BossSystem.js src/systems/StatusSystem.js src/core/Game.js tests/level4.test.js tests/game.test.js
git commit -m "feat: add Jiuweihu phase mechanics"
```

### Task 6: Runtime Asset Pipeline and Level4 Art Catalog

**Files:**
- Create: `scripts/prepare-level4-assets.sh`
- Create: `assets/levels/level4/bg_qingqiu_realm_v1.jpg`
- Create: `assets/levels/level4/map_spawn_mist_rift_v1.png`
- Create: `assets/levels/level4/map_base_qingqiu_altar_v1.png`
- Create: `assets/towers/tower_baize_v1.png`
- Create: `assets/enemies/enemy_meihu_v1.png`
- Create: `assets/enemies/enemy_huanli_v1.png`
- Create: `assets/bosses/boss_jiuweihu_phase1_v1.png`
- Create: `assets/bosses/boss_jiuweihu_phase2_v1.png`
- Create: `assets/bosses/boss_jiuweihu_phase3_v1.png`
- Create: `assets/bosses/boss_jiuweihu_cast_v1.png`
- Create: `assets/effects/fx_jiuweihu_projectile_v1.png`
- Create: `assets/effects/fx_jiuweihu_burst_v1.png`
- Create: `assets/effects/fx_jiuweihu_phase_aura_v1.png`
- Create: `assets/effects/fx_jiuweihu_ultimate_v1.png`
- Create: `assets/effects/fx_baize_insight_mark_v1.png`
- Create: `assets/ui/ui_boss_jiuweihu_panel_v1.png`
- Create: `assets/ui/ui_level4_lineup_panel_v1.png`
- Modify: `src/config/artAssets.js`
- Modify: `tests/art-assets.test.js`

**Interfaces:**
- Produces the exact Level4 IDs already reserved in Task 2.
- Consumes source art from the extracted `shanhaijing_td_level4_package(1).zip`.

- [ ] **Step 1: Add failing asset existence, alpha, and budget tests**

```js
test('all level four runtime art resolves and stays within mobile budgets', async () => {
  const { ART_ASSETS, LEVEL_ART_IDS } = await import(moduleUrl);
  const alphaBudgets = {
    level4Spawn: 300_000, level4Base: 300_000, baize: 300_000,
    meihu: 300_000, huanli: 300_000, jiuweihuPhase1: 500_000,
    jiuweihuPhase2: 500_000, jiuweihuPhase3: 500_000, jiuweihuCast: 500_000,
    jiuweihuProjectile: 300_000, jiuweihuBurst: 300_000,
    jiuweihuPhaseAura: 300_000, jiuweihuUltimate: 300_000,
    baizeInsightMark: 300_000, jiuweihuBossPanel: 500_000, level4LineupPanel: 500_000,
  };
  for (const id of LEVEL_ART_IDS[4]) {
    assert.equal(typeof ART_ASSETS[id], 'string', `${id} is missing from ART_ASSETS`);
  }
  for (const [id, maxBytes] of Object.entries(alphaBudgets)) {
    const bytes = await readFile(fileURLToPath(new URL(`../../${ART_ASSETS[id]}`, moduleUrl)));
    assertCompletePngWithAlpha(bytes, id);
    assert.ok(bytes.length < maxBytes, `${id} exceeds ${maxBytes} bytes`);
  }
  const background = await readFile(fileURLToPath(new URL(`../../${ART_ASSETS.level4Background}`, moduleUrl)));
  assert.deepEqual([...background.subarray(0, 2)], [255, 216]);
  assert.deepEqual([...background.subarray(-2)], [255, 217]);
  assert.ok(background.length < 800_000);
});
```

- [ ] **Step 2: Run asset tests and verify RED**

Run: `node --test tests/art-assets.test.js`

Expected: FAIL because runtime files do not exist.

- [ ] **Step 3: Write and run the reproducible conversion script**

The script must use explicit source and destination roots, never delete source files, and perform border-connected white removal before resizing. Target sizes:

```text
background 390x610 JPEG q84
baize/meihu/huanli 256x256 bounding box
Boss P1/P2/P3/cast 512x512 bounding box
projectile 192x192; burst 256x256; phase aura 384x384
ultimate 384x384; insight mark 256x256
spawn/base 256x256
Boss panel/lineup panel 768x256
```

Use an alpha-safe connected-border mask, trim only after masking, resize with Lanczos, and run `pngquant --quality 75-95 --speed 1` only when it preserves alpha and visible glow. Do not use global white replacement because Baize and Jiuweihu contain white fur.

Use these concrete shell helpers; every call passes an explicit input, output, and bounding box:

```bash
#!/usr/bin/env bash
set -euo pipefail

source_root=${1:?"source root required"}
repo_root=${2:?"repository root required"}

rgba_sprite() {
  local input=$1 output=$2 box=$3
  mkdir -p "$(dirname "$output")"
  convert "$input" -alpha on -bordercolor white -border 1 -fuzz 12% \
    -fill none -draw 'matte 0,0 floodfill' -shave 1x1 -trim +repage \
    -filter Lanczos -resize "${box}>" -gravity center -background none \
    -extent "$box" -define png:compression-level=9 "PNG32:$output"
}

copy_alpha_sprite() {
  local input=$1 output=$2 box=$3
  mkdir -p "$(dirname "$output")"
  convert "$input" -trim +repage -filter Lanczos -resize "${box}>" \
    -gravity center -background none -extent "$box" \
    -define png:compression-level=9 "PNG32:$output"
}

mkdir -p "$repo_root/assets/levels/level4"
convert "$source_root/assets/backgrounds/bg_qingqiu_realm_source.jpg" -filter Lanczos \
  -resize '390x610^' -gravity center -extent 390x610 -strip -quality 84 \
  "$repo_root/assets/levels/level4/bg_qingqiu_realm_v1.jpg"

rgba_sprite "$source_root/assets/towers/tower_baize_source.jpg" "$repo_root/assets/towers/tower_baize_v1.png" 256x256
rgba_sprite "$source_root/assets/enemies/enemy_meihu_source.jpg" "$repo_root/assets/enemies/enemy_meihu_v1.png" 256x256
rgba_sprite "$source_root/assets/enemies/enemy_huanli_source.jpg" "$repo_root/assets/enemies/enemy_huanli_v1.png" 256x256
rgba_sprite "$source_root/assets/bosses/boss_jiuweihu_phase1_source.jpg" "$repo_root/assets/bosses/boss_jiuweihu_phase1_v1.png" 512x512
rgba_sprite "$source_root/assets/bosses/boss_jiuweihu_phase2_source.jpg" "$repo_root/assets/bosses/boss_jiuweihu_phase2_v1.png" 512x512
rgba_sprite "$source_root/assets/bosses/boss_jiuweihu_phase3_source.jpg" "$repo_root/assets/bosses/boss_jiuweihu_phase3_v1.png" 512x512
rgba_sprite "$source_root/assets/bosses/boss_jiuweihu_cast_source.jpg" "$repo_root/assets/bosses/boss_jiuweihu_cast_v1.png" 512x512
copy_alpha_sprite "$source_root/assets/effects/fx_jiuweihu_projectile_source.png" "$repo_root/assets/effects/fx_jiuweihu_projectile_v1.png" 192x192
rgba_sprite "$source_root/assets/effects/fx_jiuweihu_burst_source.jpg" "$repo_root/assets/effects/fx_jiuweihu_burst_v1.png" 256x256
rgba_sprite "$source_root/assets/effects/fx_jiuweihu_phase_aura_source.jpg" "$repo_root/assets/effects/fx_jiuweihu_phase_aura_v1.png" 384x384
rgba_sprite "$source_root/assets/effects/fx_jiuweihu_ultimate_source.jpg" "$repo_root/assets/effects/fx_jiuweihu_ultimate_v1.png" 384x384
copy_alpha_sprite "$source_root/assets/effects/fx_baize_insight_mark_source.png" "$repo_root/assets/effects/fx_baize_insight_mark_v1.png" 256x256
rgba_sprite "$source_root/assets/levels/level4/map_spawn_mist_rift_source.jpg" "$repo_root/assets/levels/level4/map_spawn_mist_rift_v1.png" 256x256
rgba_sprite "$source_root/assets/levels/level4/map_base_qingqiu_altar_source.jpg" "$repo_root/assets/levels/level4/map_base_qingqiu_altar_v1.png" 256x256
rgba_sprite "$source_root/assets/ui/ui_boss_jiuweihu_panel_source.jpg" "$repo_root/assets/ui/ui_boss_jiuweihu_panel_v1.png" 768x256
rgba_sprite "$source_root/assets/ui/ui_level4_lineup_panel_source.jpg" "$repo_root/assets/ui/ui_level4_lineup_panel_v1.png" 768x256
```

- [ ] **Step 4: Inspect alpha and contact sheets**

Run:

```bash
identify -format '%f %wx%h %[channels] %b\n' assets/levels/level4/* assets/towers/tower_baize_v1.png assets/enemies/enemy_{meihu,huanli}_v1.png assets/bosses/boss_jiuweihu_* assets/effects/fx_{jiuweihu_*,baize_insight_mark}_v1.png assets/ui/ui_{boss_jiuweihu_panel,level4_lineup_panel}_v1.png
```

Generate dark- and light-background contact sheets. Reject any white rectangle, black fringe, clipped fur, clipped tails, clipped glow, or unreadable 2×-scaled insight mark.

- [ ] **Step 5: Run asset tests and verify GREEN**

Run: `node --test tests/art-assets.test.js`

Expected: PASS with every runtime file under its assigned budget.

- [ ] **Step 6: Commit Task 6**

```bash
git add scripts/prepare-level4-assets.sh assets/ src/config/artAssets.js tests/art-assets.test.js
git commit -m "feat: add optimized level four art"
```

### Task 7: Renderer and Motion V2

**Files:**
- Create: `tests/level4-motion.test.js`
- Modify: `src/config/motionData.js`
- Modify: `src/systems/MotionSystem.js`
- Modify: `src/render/Renderer.js`
- Modify: `tests/renderer-art.test.js`
- Modify: `tests/motion.test.js`

**Interfaces:**
- Produces: `MotionSystem.jiuweihuTransform(enemy, visualTime, effects)` through `enemyTransform()`.
- Produces effect transforms for `jiuweihuEvolution`, `jiuweihuSkill`, and `unitDeath`.
- Renderer selects `jiuweihuPhase1|2|3` and cast art from `bossPhase` and active effects.

- [ ] **Step 1: Write failing Motion V2 visibility tests**

```js
test('Jiuweihu idle scale and phase-three float are visible at 390px', () => {
  assert.equal(UNIT_MOTION_CONFIG.enemies.jiuweihu.phases[1].idleScale >= 0.025, true);
  assert.equal(UNIT_MOTION_CONFIG.enemies.jiuweihu.phases[2].idleScale >= 0.035, true);
  assert.equal(UNIT_MOTION_CONFIG.enemies.jiuweihu.phases[3].idleScale >= 0.045, true);
  assert.equal(UNIT_MOTION_CONFIG.enemies.jiuweihu.phases[3].bobPixels >= 3, true);
});

test('Jiuweihu hit, skill, evolution and death exceed mobile visibility floors', () => {
  const config = UNIT_MOTION_CONFIG.enemies.jiuweihu;
  assert.equal(config.hitRecoilPixels >= 3, true);
  assert.equal(config.skillScale >= 0.10, true);
  assert.equal(config.evolutionScale >= 0.12, true);
  assert.equal(config.deathSeconds >= 0.45, true);
});

test('skill transform has charge action and rebound segments', () => {
  const boss = { type: 'jiuweihu', bossPhase: 3, x: 100, y: 100, visualState: {} };
  const skillAt = progress => ({ type: 'jiuweihuSkill', source: boss, progress, life: 1 - progress, duration: 1 });
  assert.equal(MotionSystem.enemyTransform(boss, 0, [skillAt(0.1)]).scale > 1.05, true);
  assert.equal(Math.abs(MotionSystem.enemyTransform(boss, 0, [skillAt(0.5)]).xOffset) >= 3, true);
  assert.notEqual(MotionSystem.enemyTransform(boss, 0, [skillAt(0.9)]).scale, 1);
});
```

- [ ] **Step 2: Run Motion tests and verify RED**

Run: `node --test tests/level4-motion.test.js tests/motion.test.js tests/renderer-art.test.js`

Expected: FAIL because Jiuweihu configuration and transforms do not exist.

- [ ] **Step 3: Implement exact Motion V2 floors**

Configure P1/P2/P3 idle scale 0.025/0.035/0.045, P3 bob 3px, hit recoil 4px over 0.10s, skill scale at least 0.10 with at least 4px action displacement, evolution scale at least 0.12 over 0.7/0.9s, and death 0.45s. The skill transform uses three normalized segments: charge 0–0.35, action 0.35–0.70, rebound 0.70–1.0.

- [ ] **Step 4: Render phase/cast swaps and Level4 effects**

Use Phase1 art for phase 1, Phase2 for phase 2, Phase3 for phase 3, and cast art only during the action segment. Draw insight mark on real marked targets. Draw illusions at reduced alpha without altering target coordinates. Draw evolution, projectile, burst, aura, and ultimate effects after enemies but before labels.

- [ ] **Step 5: Run Motion/Renderer tests and verify GREEN**

Run: `node --test tests/level4-motion.test.js tests/motion.test.js tests/renderer-art.test.js tests/level4.test.js`

Expected: PASS.

- [ ] **Step 6: Commit Task 7**

```bash
git add src/config/motionData.js src/systems/MotionSystem.js src/render/Renderer.js tests/level4-motion.test.js tests/motion.test.js tests/renderer-art.test.js
git commit -m "feat: add visible Jiuweihu Motion V2"
```

### Task 8: Dev Entries, Mobile Smoke, Regression, and Deployment

**Files:**
- Modify: `src/main.js`
- Modify: `tests/ui-contract.test.js`
- Modify: `tests/browser-smoke.html`
- Modify: `tests/responsive.html`
- Modify: `index.html`
- Modify: `docs/WORK_PROGRESS.md`

**Interfaces:**
- Produces query contracts: `devLevel=4`, `devPath=1`, `devWave=10`, `devBossPhase=1|2|3`.
- Produces Level4 browser smoke helpers without altering production behavior for normal URLs.

- [ ] **Step 1: Write failing dev-entry tests**

```js
test('dev menu and direct level parsing include level four', async () => {
  assert.match(main, /\[1, 2, 3, 4\]\.includes\(devLevel\)/);
  assert.match(main, /data-dev-level="4"/);
  assert.match(main, /params\.get\('devBossPhase'\)/);
  assert.match(main, /params\.get\('devWave'\)/);
});
```

- [ ] **Step 2: Run dev tests and verify RED**

Run: `node --test tests/ui-contract.test.js`

Expected: FAIL because Level4 dev entry is absent.

- [ ] **Step 3: Implement guarded Level4 dev setup**

Apply `devWave=10` and `devBossPhase=1|2|3` only when `devLevel===4`. Invalid values leave the game in a normal Level4 lineup state. Extend path debug to Level4 and draw both fog-zone outlines.

- [ ] **Step 4: Run repository verification**

Run:

```bash
npm test
npm run check
find src tests -type f \( -name '*.js' -o -name '*.mjs' \) -print0 | xargs -0 -n1 node --check
git diff --check
```

Expected: all tests PASS, all syntax checks exit 0, and diff check is clean.

- [ ] **Step 5: Run targeted browser smoke**

At 390px and 390×700 verify:

```text
Level4 lineup: no overflow, exactly three required, confirm reachable
first build menu: selected three images complete on first sample
Preparation: eight tower slots clickable, Start Wave manual
path debug: runtime path follows road center; fog rectangles cover painted fog
W1–W3: expected enemy mix and no state errors
W10/P1/P2/P3: direct dev entry, sprite swaps, no phase Banner
Motion: idle/hit/skill/evolution/death frame deltas meet Task 7 floors
loading: Boss/VFX first use has complete images; no text-before-frame delay
shared L1/L2/L3: next-level, fixed roster, background, build, Boss HUD smoke
```

- [ ] **Step 6: Update progress and asset report**

Record source→runtime pixel dimensions and KB for all 17 images, total Level4 source→runtime MB, required/deferred counts, test totals, 390/390×700 results, player-only checks, and final SHA in `docs/WORK_PROGRESS.md`.

- [ ] **Step 7: Commit verification checkpoint**

```bash
git add src/main.js tests/ui-contract.test.js tests/browser-smoke.html tests/responsive.html index.html docs/WORK_PROGRESS.md
git commit -m "test: verify level four mobile flow"
```

- [ ] **Step 8: Push and verify GitHub Pages**

Push the reviewed commit chain to `main`, wait for Pages to publish, then fresh-load the production URL and repeat the Level4 direct-entry, lineup, first-build, P1/P2/P3, 390px, and 390×700 targeted smoke. Do not report PASS until the deployed commit SHA and Pages behavior match.

## Completion Report

Return only:

```text
PASS/FAIL、完成項目、tests PASS/FAIL、check、Level4 asset 總容量前→後、主要圖片前→後、390/390×700 smoke、玩家仍需實測項目、最新 SHA
```

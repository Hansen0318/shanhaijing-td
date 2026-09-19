# Level6・扶桑神域 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement the approved Level6・扶桑神域 campaign, data-driven Level4+ progression, supplied runtime art, sunlight/Boss mechanics, and executable regressions without changing observable Level1–5 gameplay.

**Architecture:** Extend the existing level/config-driven game rather than adding Level6 conditionals. Progression becomes a small data API consumed by `Game` and `UIController`; Level6 map, enemies, waves, sunlight state, Boss events, art, motion and geometry plug into the existing systems. Spawn/Base overlays become optional at the renderer contract, and all new visual state remains separate from tower stats and completed-level balance.

**Tech Stack:** Browser ES modules, Canvas 2D, HTML/CSS, Node.js built-in test runner, ImageMagick/static image inspection, Git/GitHub feature branch.

**Spec:** `docs/levels/LEVEL6_FUSANG_SPEC.md`

## Global Constraints

- Use Geometry V4 exactly; do not re-guess path coordinates from screenshots.
- Level6 logical map remains 390×610 with the approved eight slots and sunlight A/B bounds.
- Preserve Level1–5 enemy/tower stats, waves, paths, mechanics, lineup behavior and visuals.
- Level6 entry roster is 畢方／夫諸／應龍／白澤, exactly 3; retry returns to empty lineup.
- Level6 victory unlocks 句芒 for future playable levels but does not make it deployable in Level6.
- No Level7 action while Level7 is absent.
- Use the supplied optimized assets unchanged unless executable evidence proves a specific binary invalid.
- Spawn/Base overlays are generically optional; do not add `levelId === 6` rendering logic.
- Global footprint spacing, Motion Lite and facing remain shared systems.
- Jinwu HUD uses the existing thin-panel DOM/CSS and a runtime-measured `trackRect`.
- Work ends after a verified feature-branch push; do not merge or deploy Pages.

## Review Focus

- Owned roster growth: a fifth unlocked beast must render generically without becoming usable one level early.
- Final-level victory: missing Level7 must hide next-level even after 句芒 unlock presentation.
- Sunlight transitions: leaving or deactivating a zone must remove armor/shield once without stale state or repeated break effects.
- W10 completion: neither Boss death nor empty queue alone may produce victory while another required condition remains.
- Optional map props and deferred assets: Level6 must not request undefined Spawn/Base art, while Level1–5 continue drawing theirs.

---

### Task 1: Data-driven progression and Level4+ lineup

**Files:**
- Create: `src/config/progressionData.js`
- Modify: `src/systems/LineupSystem.js`
- Modify: `src/core/Game.js`
- Modify: `src/ui/UIController.js`
- Test: `tests/progression.test.js`
- Test: `tests/level4.test.js`
- Test: `tests/level5.test.js`
- Create: `tests/level6.test.js`

**Interfaces:**
- Produces: `PLAYABLE_LEVEL_IDS`, `UNLOCK_BY_LEVEL`, `baseOwnedRoster()`, `ownedRosterThrough(levelId)`, `nextPlayableLevelId(levelId)`.
- Produces: `Game.lineupRoster(): string[]`, `Game.nextLevelId(): number | null`, and persistent `unlockedBeasts` across `resetRun()`.
- Consumes: `LEVELS`, `TOWER_DATA`, existing `normalizeLineup()` and `isValidLineup()`.

- [ ] **Step 1: Write failing progression tests**

```js
test('Level5 victory enters an empty Level6 four-beast lineup', () => {
  const game = new Game(() => 0.2, 5);
  game.end('victory');
  assert.equal(game.nextLevelId(), 6);
  assert.equal(game.enterLevel(6), true);
  assert.equal(game.state, 'lineup');
  assert.deepEqual(game.lineupRoster(), ['bifang', 'fuzhu', 'yinglong', 'baize']);
  assert.deepEqual(game.lineupSelection, []);
});

test('Level6 victory unlocks Jumang once and has no Level7 action', () => {
  const game = new Game(() => 0.2, 6);
  game.end('victory');
  assert.equal(game.unlockedBeasts.has('jumang'), true);
  assert.equal(game.nextLevelId(), null);
});
```

Also assert exactly-three confirmation, retry to 0/3, Blessing choices exclude the omitted fourth beast, and repeated Level6 victory does not create a second unlock presentation.

- [ ] **Step 2: Run the focused tests and confirm RED**

Run: `node --test tests/progression.test.js tests/level4.test.js tests/level5.test.js tests/level6.test.js`

Expected: FAIL because Level6/progression APIs do not exist and Level5 is still treated as final.

- [ ] **Step 3: Add the minimal progression data API**

```js
export const BASE_OWNED_ROSTER = Object.freeze(['bifang', 'fuzhu', 'yinglong']);
export const UNLOCK_BY_LEVEL = Object.freeze({ 3: 'baize', 6: 'jumang' });
export const PLAYABLE_LEVEL_IDS = Object.freeze(Object.keys(LEVELS).map(Number).sort((a, b) => a - b));
export function nextPlayableLevelId(levelId) {
  return PLAYABLE_LEVEL_IDS.find(id => id > levelId) ?? null;
}
```

Make lineup validation consume the caller-supplied eligible roster instead of `LEVEL4_ROSTER`; preserve the existing exactly-three unique rule.

- [ ] **Step 4: Replace Game/UI hardcodes with progression queries**

Use `nextPlayableLevelId()` for `enterLevel()` and result-button visibility. Render lineup cards from `game.lineupRoster()`. Preserve Level4/5 copy/art presentation while providing Level6 copy from level metadata rather than a new fixed roster branch. Render unlock result data for 白澤 and 句芒 from the same unlock contract.

- [ ] **Step 5: Run regression tests and confirm GREEN**

Run: `node --test tests/progression.test.js tests/level3.test.js tests/level4.test.js tests/level5.test.js tests/level6.test.js tests/ui-art.test.js`

- [ ] **Step 6: Commit and push safe progression checkpoint**

```bash
git add src/config/progressionData.js src/systems/LineupSystem.js src/core/Game.js src/ui/UIController.js tests
git commit -m "refactor: make late-game progression data driven"
git push -u origin feat/level6-fusang
```

### Task 2: Level6 data, Geometry V4 and sunlight state

**Files:**
- Modify: `src/config/gameData.js`
- Modify: `src/map/GameMap.js`
- Create: `src/systems/SunlightSystem.js`
- Modify: `src/entities/Enemy.js`
- Modify: `src/systems/CombatSystem.js`
- Modify: `src/core/Game.js`
- Test: `tests/level6.test.js`

**Interfaces:**
- Produces: `LEVEL6_MAP_DATA`, `LEVEL6_WAVE_DATA`, `LEVELS[6]` and enemy data for `yangyu`, `fusangjiashou`, `jinwu`.
- Produces: `GameMap.sunlightZoneAt(point): 'A' | 'B' | null`.
- Produces: `SunlightSystem.update(game, dt)` and `SunlightSystem.activeZoneIds(game): string[]`.
- Enemy state fields: `inSunlight`, `yangmuArmorActive`, `sunShieldActive`, `bossPhase`.

- [ ] **Step 1: Write failing Level6 identity/geometry/wave tests**

Pin the 65 ordered Geometry V4 waypoints, eight slot centers, both sunlight rectangles, enemy base data, all ten wave rows, W10 boss multiplier and `6820` runtime Boss HP.

```js
assert.deepEqual(LEVELS[6].map.sunlightZones, [
  { id: 'A', x: 137, y: 90, width: 85, height: 34 },
  { id: 'B', x: 302, y: 365, width: 61, height: 49 },
]);
assert.equal(ENEMY_DATA.jinwu.hp, 6200);
```

- [ ] **Step 2: Run the focused test and confirm RED**

Run: `node --test tests/level6.test.js`

- [ ] **Step 3: Add Level6 config exactly from the canonical spec**

Add the approved map, slots, sunlight zones, enemy stats and W1–W10 data. Keep W10 groups in approved order so ordinary enemies and Boss coexist after spawning; do not wait for ordinary enemies to die before spawning Jinwu.

- [ ] **Step 4: Write failing sunlight lifecycle tests**

Cover 6-second A/B alternation in W1–W9, simultaneous A+B in Jinwu P2, Yangyu ×1.28 speed only inside active sunlight, 扶桑甲獸 ×0.75 damage with one break event, and Jinwu ×0.80 damage only while logically inside an active zone.

- [ ] **Step 5: Implement shared map/sunlight state and combat modifiers**

Keep membership based on logical `enemy.x/y`. Store timed zone state on `Game`; let `Enemy.update()` consume the sunlight speed multiplier and let `CombatSystem.hit()` consume the active armor/shield multipliers without changing base stats.

- [ ] **Step 6: Run Level6 plus combat regressions**

Run: `node --test tests/level6.test.js tests/combat.test.js tests/level3.test.js tests/level4.test.js tests/level5.test.js`

- [ ] **Step 7: Commit and push gameplay checkpoint**

```bash
git add src/config/gameData.js src/map/GameMap.js src/systems/SunlightSystem.js src/entities/Enemy.js src/systems/CombatSystem.js src/core/Game.js tests
git commit -m "feat: add Level6 sunlight battlefield"
git push
```

### Task 3: Jinwu phases, events and Level6 victory gate

**Files:**
- Modify: `src/systems/BossSystem.js`
- Modify: `src/core/Game.js`
- Test: `tests/level6.test.js`

**Interfaces:**
- Produces: `BossSystem.updateJinwu(enemy, dt, context)` events `{ type: 'jinwuPhase2', phase: 2, duration: 0.8 }`.
- Consumes: shared `bossPhase`, sunlight state and `levelBossDefeated`/wave completion flow.

- [ ] **Step 1: Write failing Boss phase and victory-gate tests**

```js
test('Jinwu enters P2 once at 50 percent without healing', () => {
  const boss = new Enemy('jinwu', ENEMY_DATA.jinwu, new GameMap(LEVELS[6].map));
  boss.hp = boss.maxHp * 0.5;
  assert.deepEqual(BossSystem.update(boss, 0, {}), [{ type: 'jinwuPhase2', phase: 2, duration: 0.8 }]);
  assert.equal(boss.hp, boss.maxHp * 0.5);
  assert.deepEqual(BossSystem.update(boss, 0, {}), []);
});
```

Also prove Boss death with normal enemies alive does not win, and queue completion with Jinwu alive does not win.

- [ ] **Step 2: Run and confirm RED**

Run: `node --test tests/level6.test.js`

- [ ] **Step 3: Implement the minimal Jinwu Boss branch and Game event handling**

Set P2 speed multiplier to 1.12 once, emit presentation only, switch sunlight to permanent A+B, preserve continuous HP, and require queue empty + all normal enemies resolved + Boss defeated before `end('victory')`.

- [ ] **Step 4: Run Level4–6 Boss regressions**

Run: `node --test tests/level4.test.js tests/level5.test.js tests/level6.test.js`

- [ ] **Step 5: Commit and push Boss checkpoint**

```bash
git add src/systems/BossSystem.js src/core/Game.js tests/level6.test.js
git commit -m "feat: add Jinwu phase and victory gate"
git push
```

### Task 4: Integrate supplied runtime assets and shared visual geometry

**Files:**
- Add: `assets/levels/level6/bg_fusang_realm_v1.jpg`
- Add: `assets/enemies/enemy_yangyu_v1.png`
- Add: `assets/enemies/enemy_fusangjiashou_v1.png`
- Add: `assets/bosses/boss_jinwu_v1.png`
- Add: `assets/effects/fx_yangyu_sunboost_v1.png`
- Add: `assets/effects/fx_yangmujia_on_v1.png`
- Add: `assets/effects/fx_yangmujia_break_v1.png`
- Add: `assets/effects/fx_jinwu_sunshield_v1.png`
- Add: `assets/effects/fx_jinwu_phase2_v1.png`
- Add: `assets/effects/fx_sunlight_zone_v1.png`
- Add: `assets/ui/ui_boss_jinwu_panel_v1.png`
- Add: `assets/ui/unlock_jumang_v1.png`
- Modify: `src/config/artAssets.js`
- Modify: `src/config/enemyVisuals.js`
- Modify: `src/config/motionData.js`
- Test: `tests/art-assets.test.js`
- Test: `tests/enemy-spacing.test.js`
- Test: `tests/motion.test.js`

**Interfaces:**
- Produces ArtStore IDs: `level6Background`, `yangyu`, `fusangjiashou`, `jinwu`, `yangyuSunboost`, `yangmuArmorOn`, `yangmuArmorBreak`, `jinwuSunshield`, `jinwuPhase2`, `sunlightZone`, `jinwuBossPanel`, `jumangUnlock`.
- Produces Level6 `ENEMY_VISUALS` and `UNIT_MOTION_CONFIG` entries.

- [ ] **Step 1: Verify package hashes before copying**

Run from a temporary extraction directory:

```bash
sha256sum -c ASSET_SHA256SUMS.txt
identify assets/levels/level6/bg_fusang_realm_v1.jpg assets/{enemies,bosses,effects,ui}/*
```

Expected: 12 checksum successes; background 390×610 RGB; all other files decode with alpha.

- [ ] **Step 2: Write failing asset/geometry/preload tests**

Assert semantic paths, byte/pixel budgets, Level6 required group (`slotPlatform`, background, lineup/build art, `yangyu`), deferred late assets, and audited visual entries:

```js
assert.equal(ENEMY_VISUALS.yangyu.footprint, Math.max(244 * (40 / 256), 235 * (40 / 249)));
assert.equal(ENEMY_VISUALS.fusangjiashou.anchorY, 0.5);
assert.equal(ENEMY_VISUALS.jinwu.footprint, 84);
```

- [ ] **Step 3: Copy only the verified runtime candidates into their intended repo paths**

Do not regenerate, recolor, re-trim or re-compress the binaries.

- [ ] **Step 4: Add ArtStore, cache, visual spacing and Motion Lite data**

Use the audited source/visible dimensions verbatim. Add mobile-readable bob/hit/death settings consistent with existing enemies; Jinwu uses shared path-facing and an 84×84 box.

- [ ] **Step 5: Run asset/motion/spacing tests and syntax checks**

Run: `node --test tests/art-assets.test.js tests/enemy-spacing.test.js tests/motion.test.js && find src tests -name '*.js' -print0 | xargs -0 -n1 node --check`

- [ ] **Step 6: Commit and push asset checkpoint**

```bash
git add assets src/config tests
git commit -m "feat: integrate Level6 runtime art"
git push
```

### Task 5: Renderer, optional map props, sunlight VFX and Jinwu HUD

**Files:**
- Modify: `src/render/Renderer.js`
- Modify: `src/config/artAssets.js`
- Modify: `src/ui/UIController.js`
- Modify: `styles.css`
- Modify: `styles-fixes.css`
- Modify: `index.html`
- Test: `tests/renderer-art.test.js`
- Test: `tests/boss-hud-geometry.test.js`
- Test: `tests/level4-boss-hud-contract.test.js`
- Test: `tests/ui-art.test.js`

**Interfaces:**
- Renderer draws map props only when both art id and position exist.
- Renderer draws active sunlight zones, per-unit sunlight states, armor break and Jinwu phase effects from Game effect/state data.
- Produces `BOSS_HUD_GEOMETRY.jinwu` after rendered-channel measurement.

- [ ] **Step 1: Write failing optional-prop and rendering tests**

Assert Level6 omits Spawn/Base `drawContained()` calls while Level1–5 retain them. Assert Level6 background, enemies, sunlight VFX, armor/shield states, phase VFX, death art and horizontal facing are rendered through shared paths.

- [ ] **Step 2: Implement generic optional map props and Level6 visuals**

Use truthy art ids/positions rather than a Level6 conditional. Keep sunlight zone drawing below enemies and state rings above/beside units without hiding sprites.

- [ ] **Step 3: Measure the Jinwu empty track through the real 44px border-image pipeline**

Render the panel at the production DOM size, inspect the empty-channel inner edges, convert them to the CSS variables used by `boss-hp-track`, and record the measured normalized rectangle in `BOSS_HUD_GEOMETRY.jinwu`.

- [ ] **Step 4: Add 100/50/25 percent HUD regressions**

Use the existing geometry harness to prove fill left/top/height stay inside the measured channel and width scales without crossing its right edge.

- [ ] **Step 5: Update cache versions and verify affected UI contracts**

Run: `node --test tests/renderer-art.test.js tests/boss-hud-geometry.test.js tests/level4-boss-hud-contract.test.js tests/ui-art.test.js tests/ui-contract.test.js`

- [ ] **Step 6: Commit and push visual checkpoint**

```bash
git add src/render src/config/artAssets.js src/ui styles*.css index.html tests
git commit -m "feat: render Level6 sunlight and Jinwu HUD"
git push
```

### Task 6: Dev controls, browser smoke and full verification

**Files:**
- Modify: `src/main.js`
- Modify: `tests/browser-smoke.html`
- Modify: `tests/ui-contract.test.js`
- Modify: `docs/WORK_PROGRESS.md`

**Interfaces:**
- Dev controls accept `devLevel=6`, `devPath=1`, Level6 wave/Boss states and sunlight overlay inspection without changing production entry behavior.

- [ ] **Step 1: Write failing dev-entry tests**

Assert dev menu exposes Level6, guarded parameters can initialize Level6 path/waves/Jinwu P1/P2, and production URLs remain unchanged.

- [ ] **Step 2: Implement the minimal guarded Level6 dev setup**

Reuse existing query parsing and overlay code; expose Geometry V4, slot centers and sunlight rectangles in `devPath` without adding production DOM.

- [ ] **Step 3: Run targeted campaign and UI tests**

Run: `node --test tests/level6.test.js tests/progression.test.js tests/art-assets.test.js tests/enemy-spacing.test.js tests/renderer-art.test.js tests/boss-hud-geometry.test.js tests/ui-art.test.js tests/ui-contract.test.js`

- [ ] **Step 4: Run the complete automated verification**

```bash
npm test
npm run check
find src tests -type f -name '*.js' -print0 | xargs -0 -n1 node --check
git diff --check origin/main..HEAD
```

- [ ] **Step 5: Run available 390px and 390×700 runtime smoke**

Verify Level5 victory → Level6 lineup, four cards/exactly-three confirm, first preparation art readiness, Geometry V4/path/slots/sunlight overlays, optional baked Spawn/Base, 1×/2× spacing, Yangyu/armor states, Jinwu P1/P2/HUD at 100/50/25, Level6 victory unlock, retry empty lineup, no Level7 button and no horizontal overflow. If browser access is limited, record `ENGINEERING PASS / PLAYER SMOKE PENDING` with the exact phone checks.

- [ ] **Step 6: Request whole-branch code review and fix all Critical/Important findings**

Review range: `origin/main..HEAD`. Re-run the owning targeted tests after every fix.

- [ ] **Step 7: Update progress evidence, commit and push final feature checkpoint**

```bash
git add docs/WORK_PROGRESS.md src tests assets index.html styles*.css
git commit -m "test: verify Level6 Fusang release"
git push
```

- [ ] **Step 8: Stop at the feature branch handoff**

Report branch, latest remote SHA, changed files, actual test counts, browser/runtime result, unresolved blockers and exact player-phone smoke items. Do not merge `main` or trigger Pages from this Work task.

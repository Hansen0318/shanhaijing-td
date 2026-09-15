# Level 5 Buzhoushan Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship Level 5「不周山墟」with measured map geometry, 4→3 lineup, Zhuyan charge, Lili earth armor, two-phase Xingtian, and all 16 optimized assets.

**Architecture:** Extend the existing level data and Level 4 lineup flow. Add Level 5 mechanics through explicit enemy state, typed damage context, BossSystem events, tower stun state, and existing Renderer/UI effect paths; keep Level 1–4 behavior locked.

**Tech Stack:** Vanilla ES modules, Canvas 2D, HTML/CSS, Node.js built-in test runner, ImageMagick, Playwright/Chromium smoke when available, GitHub Pages.

**Spec:** `docs/superpowers/specs/2026-09-14-level5-buzhoushan-design.md`

## Global Constraints

- `LEVEL5_FINAL_GAMEPLAY_SPEC.md` is the gameplay source of truth; do not invent unlisted gameplay values.
- Level 1–4 gameplay and balance remain unchanged except the approved Level 4 floating-point assertion contract.
- Level 5 uses the existing 4→3 roster and filtered Blessing pool; no new beast or Blessing.
- Map, eight slots, Spawn, Base, and charge corridor use the measured coordinates in the spec.
- Source JPEG-in-PNG files never ship unchanged; runtime overlay art has alpha.
- Boss HP/name remain programmatic over the supplied empty-channel frame.
- Use TDD and safe commit+push checkpoints after design, gameplay, and assets.

---

### Task 1: Level 5 Data, Progression, and Lineup

**Files:**
- Create: `tests/level5.test.js`
- Modify: `src/config/gameData.js`, `src/systems/LineupSystem.js`, `src/core/Game.js`
- Test: `tests/level5.test.js`, `tests/level4.test.js`, `tests/progression.test.js`

**Interfaces:** Produces `LEVEL5_WAVE_DATA`, `LEVEL5_MAP_DATA`, `LEVELS[5]`; Level 4–5 shared lineup behavior.

- [ ] Write failing tests with literal Level 5 identity, exact ten wave groups/intervals/multipliers, 8 measured slots, charge corridor, 6670 W10 Boss HP, Level 4→5 progression, empty Level 5 retry lineup, and selected-roster Blessing filtering.
- [ ] Run `node --test tests/level5.test.js tests/level4.test.js tests/progression.test.js`; verify failures are missing Level 5 behavior.
- [ ] Add exact data and generalize existing Level 4 lineup guards to `[4,5]` while retaining `LEVEL4_ROSTER` compatibility.
- [ ] Re-run the focused command and verify green.
- [ ] Commit `feat: add level five data and progression`.

### Task 2: Zhuyan Charge and Lili Earth Armor

**Files:**
- Modify: `src/entities/Enemy.js`, `src/map/GameMap.js`, `src/systems/CombatSystem.js`, `src/systems/StatusSystem.js`, `src/entities/Projectile.js`, `src/core/Game.js`
- Test: `tests/level5.test.js`, `tests/combat.test.js`

**Interfaces:** Produces `GameMap.chargeCorridorAt(point)`, enemy `chargeState`, `earthArmorLayers`, and `CombatSystem.hit(...): { damage, armorBroken }`.

- [ ] Write failing tests proving charge triggers once, telegraph moves at normal speed, charge is 1.65× for 0.6s, and slow remains multiplicative.
- [ ] Write failing tests proving only raw direct hit `>=30` breaks one armor layer, amplification precedes `×0.45`, and AoE/DoT neither break nor consume armor.
- [ ] Run `node --test tests/level5.test.js tests/combat.test.js`; verify expected RED.
- [ ] Implement the minimum state and typed damage pipeline; emit `zhuyanCharge` and one `liliArmorBreak` visual event without coupling art to damage math.
- [ ] Re-run focused tests and verify green.
- [ ] Commit `feat: add level five enemy mechanics`.

### Task 3: Xingtian Phases, Earthquake, and Victory Gate

**Files:**
- Modify: `src/systems/BossSystem.js`, `src/systems/StatusSystem.js`, `src/entities/Tower.js`, `src/core/Game.js`
- Test: `tests/level5.test.js`, `tests/game.test.js`

**Interfaces:** Xingtian Boss events `xingtianShield`, `xingtianEvolution`, `xingtianEarthquakeCharge`, `xingtianEarthquakeRelease`; tower `stunRemaining`.

- [ ] Write failing tests for P1 first shield/cooldown 5.5s, 1.2s all-damage `×0.65`, 50% transition/cancel, P2 speed 18.4, first earthquake after 4.8s, 0.45s windup, radius 95, nearest-one tower, no-target VFX, and 1s cooldown pause.
- [ ] Write failing tests that Level 5 victory requires both wave completion and dead Xingtian.
- [ ] Run focused tests and verify expected RED.
- [ ] Implement BossSystem event state, Game event handling/nearest tower selection, stun-paused tower updates, and Level 5 final-wave gate.
- [ ] Re-run focused tests and verify green.
- [ ] Commit and push gameplay checkpoint `feat: add Xingtian boss encounter`.

### Task 4: Runtime Asset Preparation

**Files:**
- Create: `scripts/prepare-level5-assets.sh`
- Create: semantic runtime files under `assets/levels/level5`, `assets/enemies`, `assets/bosses`, `assets/effects`, `assets/ui`
- Test: `tests/art-assets.test.js`

**Interfaces:** Produces 16 optimized runtime assets with stable semantic names.

- [ ] Write failing asset catalog/decode/alpha/dimension/byte-budget tests for all 16 files.
- [ ] Run `node --test tests/art-assets.test.js`; verify missing Level 5 assets fail.
- [ ] Implement a reproducible ImageMagick pipeline: background/preview resize, edge-connected white removal for overlay art, trim, resize, PNG compression; preserve glow and internal white details.
- [ ] Generate assets, inspect light/dark contact sheets and source/runtime byte table; correct fringe or crop issues.
- [ ] Re-run asset tests and verify green.
- [ ] Commit and push `feat: integrate optimized level five art`.

### Task 5: Art Catalog, Renderer, UI, and Dev Smoke Hooks

**Files:**
- Modify: `src/config/artAssets.js`, `src/render/Renderer.js`, `src/config/motionData.js`, `src/systems/MotionSystem.js`, `src/ui/UIController.js`, `src/main.js`, `index.html`, `styles*.css`, `tests/browser-smoke.html`, `tests/responsive.html`
- Test: `tests/renderer-art.test.js`, `tests/ui-art.test.js`, `tests/ui-contract.test.js`, `tests/art-assets.test.js`

**Interfaces:** Adds Level 5 asset IDs/staged preload, Xingtian Boss HUD geometry, Level 5 lineup banner/preview, warning-art banner, P1/P2 sprites and four mechanic effects, `?devLevel=5` hooks.

- [ ] Write failing Renderer/UI/dev tests that exercise real output calls or DOM state: Level 5 preview icons, Banner/Preview, Warning, Boss panel ratios, P1/P2 sprite swap, VFX and dev parameters.
- [ ] Run focused tests and verify expected RED.
- [ ] Add catalog/preload groups and implement existing-path rendering/UI changes; do not add a second UI framework.
- [ ] Re-run focused tests and shared Level 1–4 Renderer/HUD regression tests.
- [ ] Commit and push the complete pre-smoke checkpoint.

### Task 6: Contract Fix and Final Verification

**Files:**
- Modify: `tests/level4-blessing-regression.test.js`, `docs/WORK_PROGRESS.md`

- [ ] Replace only the Level 4 floating strict-equality assertion with an absolute-tolerance assertion; run the test and verify production code is unchanged.
- [ ] Run fresh `npm test`, `npm run check`, `find src tests -name '*.js' -exec node --check {} \;`, and `git diff --check`.
- [ ] Run local 390px and 390×700 Level 5 browser smoke for lineup, map/path/corridor, first build, W10 P1/P2, warning, four VFX, HUD at 100/50/25%, safe-area and overflow.
- [ ] Run targeted Level 1–4 smoke only for shared Renderer/HUD/preload/lineup surfaces touched.
- [ ] Update `docs/WORK_PROGRESS.md` with exact tests, smoke, asset totals and latest SHA; commit and push.


# Shanhaijing TD V0.01 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build and verify the complete mobile-first Shanhaijing TD Graybox Prototype V0.01 as a static GitHub Pages game.

**Architecture:** A Canvas renders the battlefield while semantic HTML/CSS renders HUD, context panels, and overlays. JavaScript ES modules separate configuration, deterministic simulation, entities, systems, rendering, and UI; one shared scaled delta drives every combat timer.

**Tech Stack:** HTML5, CSS, JavaScript ES modules, Node.js built-in test runner, Playwright/WebKit when available, GitHub Pages.

**Spec:** `docs/superpowers/specs/2026-09-05-shanhaijing-td-v0-01-design.md`

## Global Constraints

- Static frontend with no backend or runtime network dependency.
- Portrait-first layout for 320–430 CSS px and iPhone Safari.
- Core controls use tap only and expose at least 44×44 CSS px targets.
- All tower, enemy, boss, wave, blessing, economy, and upgrade values live in configuration.
- No production art, audio, persistence, menus, accounts, monetization, or V0.02 scope.
- Write each gameplay behavior test first, run it to observe the expected failure, then implement minimally.

---

### Task 1: Static shell and configuration

**Files:**
- Create: `package.json`, `index.html`, `styles.css`, `src/config/gameData.js`
- Test: `tests/config.test.js`

**Interfaces:**
- Produces: frozen `GAME_CONFIG`, `TOWER_DATA`, `ENEMY_DATA`, `WAVE_DATA`, `BLESSING_DATA`, `MAP_DATA` exports.

- [ ] Write tests asserting the exact initial resources, three towers, three normal enemies, Qiongqi, ten waves, twelve blessings, upgrade costs, and eight slots.
- [ ] Run `npm test -- tests/config.test.js`; expect failure because configuration modules do not exist.
- [ ] Add package scripts and the minimum configuration objects needed by the tests.
- [ ] Run the test again and confirm it passes.
- [ ] Add the accessible HTML application shell and responsive CSS without game behavior.
- [ ] Commit with `feat: add game shell and balance data`.

### Task 2: Economy, time, map, and entities

**Files:**
- Create: `src/core/Time.js`, `src/map/GameMap.js`, `src/entities/Enemy.js`, `src/entities/Tower.js`, `src/systems/Economy.js`
- Test: `tests/economy.test.js`, `tests/map-enemy.test.js`, `tests/tower.test.js`, `tests/time.test.js`

**Interfaces:**
- Produces: `GameTime.setScale(number)`, `GameTime.step(realDelta)`, `GameMap.positionAt(distance)`, `Enemy.update(dt)`, `Tower.getStats(modifiers)`, and Economy build/upgrade/sell/reward helpers.

- [ ] Test affordability, exact deductions, reward multipliers, Level 2/3 costs, cumulative 1.69 damage, 60% sell value, time scaling, waypoint completion, base damage, and tower specialty levels.
- [ ] Run the task tests and confirm expected missing-module failures.
- [ ] Implement only the tested calculations and entity state.
- [ ] Run all tests; confirm pass.
- [ ] Refactor shared numeric helpers while keeping tests green.
- [ ] Commit with `feat: add economy map and entity foundations`.

### Task 3: Status, projectiles, and combat

**Files:**
- Create: `src/entities/Projectile.js`, `src/systems/StatusSystem.js`, `src/systems/CombatSystem.js`
- Test: `tests/status.test.js`, `tests/combat.test.js`

**Interfaces:**
- Produces: `StatusSystem.applySlow`, `StatusSystem.applyBurn`, `StatusSystem.update`; `CombatSystem.resolveDamage`, `acquireTarget`, `resolveImpact`; projectile `update(dt)` and hit callbacks.

- [ ] Test Fuzhu slow strength/duration, scaled DOT ticks, slowed vulnerability, Bifang AOE membership, Yinglong ordered penetration, Boss damage bonus, and attack-speed interval calculation.
- [ ] Run task tests and confirm they fail because combat modules are absent.
- [ ] Implement status records, centralized modifier pipeline, target selection, and three attack resolution strategies.
- [ ] Run all tests; confirm pass.
- [ ] Commit with `feat: implement tower combat effects`.

### Task 4: Blessings, waves, boss, and game state

**Files:**
- Create: `src/systems/BlessingSystem.js`, `src/systems/WaveManager.js`, `src/core/Game.js`
- Test: `tests/blessings.test.js`, `tests/waves.test.js`, `tests/game-state.test.js`

**Interfaces:**
- Produces: weighted distinct `drawChoices`, stackable `select`; deterministic spawn queue; validated Game commands and transitions across preparation, combat, blessing, countdown, pause, victory, defeat, and restart.

- [ ] Test deployed-tower weight increases without excluding other categories, three distinct choices, stacking, fixed wave compositions, spawn intervals, no overlap, one-shot Boss frenzy at 50%, victory, defeat, pause/resume, speed, and clean restart.
- [ ] Run task tests and confirm the expected failures.
- [ ] Implement the systems and command API with mutation guards.
- [ ] Run all tests; confirm pass.
- [ ] Commit with `feat: add waves blessings boss and game states`.

### Task 5: Renderer and mobile UI

**Files:**
- Create: `src/render/Renderer.js`, `src/ui/UIController.js`, `src/main.js`
- Modify: `index.html`, `styles.css`
- Test: `tests/ui-contract.test.js`

**Interfaces:**
- Consumes: Game snapshot and command API.
- Produces: Canvas graybox map/entities/effects; HUD, build/details, sell confirmation, blessing, pause, Boss, and result UI.

- [ ] Test that required DOM ids, button labels, viewport metadata, accessible names, and module entry point exist.
- [ ] Run the UI contract test and confirm it fails on missing entry/module contracts.
- [ ] Implement logical-to-CSS Canvas sizing, device-pixel-ratio rendering, pointer translation, enlarged tower-slot hit areas, and all panels/overlays.
- [ ] Wire taps only through Game commands; add banners and temporary health bars.
- [ ] Run all tests; confirm pass.
- [ ] Serve locally and verify there are no import/runtime errors.
- [ ] Commit with `feat: deliver playable mobile graybox`.

### Task 6: Acceptance simulation and browser verification

**Files:**
- Create: `tests/acceptance.test.js`, `scripts/smoke-browser.mjs`, `README.md`, `.nojekyll`
- Modify: production files only for test-proven fixes.

**Interfaces:**
- Produces: repeatable acceptance evidence for gameplay and responsive layout.

- [ ] Add controlled-simulation tests covering building all towers, insufficient gold, attacks, AOE, slow, penetration, path/base damage, rewards, upgrades, selling, Waves 1–10, blessings, pause, 1×/2×, Boss spawn/frenzy, victory, defeat, and restart.
- [ ] Run the acceptance tests and confirm failures expose missing behavior rather than test errors.
- [ ] Fix each behavior through red-green cycles and run the complete suite.
- [ ] Add a browser smoke script that opens the game, checks console/page errors, taps a slot and tower, toggles speed/pause, and measures overflow/touch targets at 320, 375, 390, and 430 px.
- [ ] Run browser smoke verification with WebKit if installed; otherwise report the unavailable engine and run the available browser plus static responsive checks.
- [ ] Add setup, local test, gameplay, configuration, and GitHub Pages instructions to README.
- [ ] Run `npm test` and the browser smoke script fresh; require zero failures before completion.
- [ ] Commit with `test: verify complete V0.01 gameplay`.

### Task 7: Publish source to GitHub

**Files:**
- Review: all project files and commits.

**Interfaces:**
- Produces: `Hansen0318/shanhaijing-td` `main` as the canonical source.

- [ ] Confirm `git diff --check`, clean tests, browser smoke result, and no files outside the project directory are staged.
- [ ] Push the exact verified source state to the empty GitHub repository using the connected GitHub integration.
- [ ] Read the GitHub branch/files back and confirm the remote commit matches the verified local source.
- [ ] Report the repository URL, completed scope, prototype limitations, known issues, and highest-priority hands-on tests.

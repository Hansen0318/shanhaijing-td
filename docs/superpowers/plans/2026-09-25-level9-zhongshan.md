# Level9 鐘山極夜 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Integrate and release the frozen Level9 鐘山極夜 campaign level from the audited v2 handoff without changing Levels1–8.

**Architecture:** Extend the existing data-driven level, progression, asset, shared motion/facing, Boss, renderer, and dev-smoke paths. Add a focused `DayNightSystem` for the one new battlefield state, while keeping enemy state effects and 燭龍 cadence as consumers of that shared state. Runtime art comes only from the audited `runtime_candidates/` files.

**Tech Stack:** Browser-native ES modules, Canvas 2D, Node.js `node:test`, GitHub Pages.

**Spec:** `docs/levels/level9/SPEC.md` (with `GEOMETRY.md` and `ASSETS.md` authoritative for their domains)

## Global Constraints

- Preserve Levels1–8 gameplay and released visuals.
- Use the exact 390×610 Level9 waypoints, Spawn/Base, T1–T8 and shrine anchor from `docs/levels/level9/GEOMETRY.md`.
- Wire only the audited semantic files from `runtime_candidates/`; never wire `source/` or `reference/`.
- Keep the shared Boss HUD outer slot at 44px and program-render name/HP.
- Normal combat starts in 晝相, switches every 8.0s with a 0.8s telegraph; 燭龍 controls 6.0s P1 and 4.5s P2 cadence.
- W10 order is 燭龍 first, then 天狗×8, then 猙×4; effective Boss HP is 9020.
- Level9 lineup is owned roster six, exactly choose three; retry clears it; first clear unlocks 帝江; no Level10 action exists yet.
- Maintain size-aware enemy spacing, shared enemy path-facing, shared tower target-facing, Motion Lite, Blessing filtering, and 390×700/short-screen safety.
- Final delivery follows `AGENTS.md` Section 8: verified feature branch, merge `main`, Pages deployment, public dev and normal progression checks.

## Review Focus

- Day/night timer boundary: no duplicate switch/telegraph when one update crosses a boundary.
- 燭龍 state ownership: P2 resets cadence without producing a third state or missing the 0.8s warning.
- Damage semantics: 猙 mitigation affects normal attacks only and does not leak into DoT/AoE contracts.
- Progression persistence: 帝江 unlock is recorded once but cannot enter Level9's current run or a nonexistent Level10.
- Visual registration: the runtime background crop, path, slots, labels, shrine cue and HUD track remain aligned at 390×610/390×700.

---

### Task 1: Audited assets, Level9 data, geometry, and progression

**Files:**
- Create: `tests/level9.test.js`
- Modify: `tests/art-assets.test.js`
- Modify: `tests/progression.test.js`
- Modify: `src/config/gameData.js`
- Modify: `src/config/progressionData.js`
- Modify: `src/config/artAssets.js`
- Modify: `src/config/enemyVisuals.js`
- Modify: `src/config/motionData.js`
- Create: `assets/levels/level9/bg_zhongshan_extreme_night_v1.jpg`
- Create: `assets/enemies/enemy_tiangou_v1.png`
- Create: `assets/enemies/enemy_zheng_v1.png`
- Create: `assets/bosses/boss_zhulong_v1.png`
- Create: `assets/ui/ui_boss_zhulong_panel_v1.png`
- Create: `assets/ui/unlock_dijiang_v1.png`

**Interfaces:**
- Produces: `LEVEL9_MAP_DATA`, `LEVEL9_WAVE_DATA`, `LEVELS[9]`, enemy types `tiangou|zheng|zhulong`, art IDs `level9Background|tiangou|zheng|zhulong|zhulongBossPanel|dijiangUnlock`, progression unlock `9: 'dijiang'`.
- Consumes: existing `wave()`, data-driven `LEVELS`, `UNLOCK_BY_LEVEL`, `ArtStore`, `ENEMY_VISUALS`, shared motion renderer.

- [ ] **Step 1: Write failing Level9 data, asset identity, spacing, and progression tests**

Add literal assertions for the frozen enemy/wave/map values, exact ordered W10 queue, six-beast Level9 roster, first-clear 帝江 unlock, no Level10 action, audited dimensions/alpha/checksums, and minimum spacing for mixed 天狗/猙/燭龍.

- [ ] **Step 2: Run tests to verify RED**

Run: `node --test tests/level9.test.js tests/art-assets.test.js tests/progression.test.js tests/enemy-spacing.test.js tests/motion.test.js`

Expected: FAIL because Level9 data, types, assets, and progression do not exist.

- [ ] **Step 3: Integrate audited runtime files and minimal configuration**

Copy the six exact `runtime_candidates/` files to the semantic destinations above. Add literal Level9 map/waves/level data, the three enemy definitions, motion/visual geometry entries, art staging, and `9: 'dijiang'` plus the 帝江 display name. Do not add 帝江 to `TOWER_DATA` because it is first playable only in Level10.

- [ ] **Step 4: Run tests to verify GREEN**

Run: `node --test tests/level9.test.js tests/art-assets.test.js tests/progression.test.js tests/enemy-spacing.test.js tests/motion.test.js`

Expected: PASS.

- [ ] **Step 5: Commit and push safe checkpoint**

Commit: `feat(level9): add audited assets and frozen level data`

### Task 2: Day/night gameplay and 燭龍 phase control

**Files:**
- Create: `src/systems/DayNightSystem.js`
- Modify: `src/core/Game.js`
- Modify: `src/entities/Enemy.js`
- Modify: `src/systems/BossSystem.js`
- Modify: `src/systems/CombatSystem.js`
- Modify: `tests/level9.test.js`

**Interfaces:**
- Consumes: Task 1 enemy data and `LEVELS[9]`.
- Produces: `game.dayNight = { state, elapsed, telegraph, switchInterval, bossControlled }`; effects `dayNightTelegraph|dayNightSwitch|zhulongPhase2`; normal-hit mitigation context for 猙; 晝相 speed context for 天狗.

- [ ] **Step 1: Write failing tests for normal cadence and enemy state effects**

Test literal 7.2s quiet → 0.8s telegraph → switch at 8.0s; 天狗 speed ×1.20 only in 晝相; 猙 normal damage ×0.82 only in 夜相; no change to non-normal damage.

- [ ] **Step 2: Verify RED**

Run: `node --test tests/level9.test.js`

Expected: FAIL because `DayNightSystem` and state-aware enemy behavior do not exist.

- [ ] **Step 3: Implement the minimal shared day/night state**

Create a deterministic two-state timer with a single telegraph edge and switch edge. Reset it only for Level9, update it only during combat, apply 天狗 speed in `Enemy.update`, and pass the current state through the existing damage context for 猙's normal-hit mitigation.

- [ ] **Step 4: Verify GREEN and full regression**

Run: `node --test tests/level9.test.js tests/combat.test.js tests/level6.test.js tests/level7.test.js tests/level8.test.js`

Expected: PASS.

- [ ] **Step 5: Write failing 燭龍 tests**

Test forced 晝相 at W10 start, first warning at 5.2s, first switch at 6.0s, P2 at 50%, ×1.12 speed, 4.5s cadence, and victory blocked until queue/normals/Boss are all resolved.

- [ ] **Step 6: Verify RED**

Run: `node --test tests/level9.test.js`

Expected: FAIL because 燭龍 has no day/night controller or P2 event.

- [ ] **Step 7: Implement 燭龍 controller and event handling**

Extend `BossSystem` and `Game.handleBossEvent` using the frozen cadence. Keep the day/night state binary and preserve shared Boss victory gating.

- [ ] **Step 8: Verify GREEN, commit, and push checkpoint**

Run: `node --test tests/level9.test.js tests/game.test.js tests/level8.test.js`

Expected: PASS.

Commit: `feat(level9): implement day night combat and zhulong phases`

### Task 3: Renderer, HUD, Motion Lite, and mobile-readable cues

**Files:**
- Modify: `src/render/Renderer.js`
- Modify: `src/ui/UIController.js`
- Modify: `src/config/artAssets.js`
- Modify: `styles.css`
- Modify: `tests/renderer-art.test.js`
- Modify: `tests/ui-art.test.js`
- Modify: `tests/boss-hud-geometry.test.js`
- Modify: `tests/level4-boss-hud-contract.test.js`

**Interfaces:**
- Consumes: Task 1 Level9 art/geometry and Task 2 state/effects.
- Produces: exact-background rendering, localized shrine and overall state cues, state-switch telegraph, 天狗 streak, 猙 armor rim, 燭龍 P2 overlay, 2–4 ambient Motion Lite effects, measured `BOSS_HUD_GEOMETRY.zhulong`.

- [ ] **Step 1: Write failing renderer/HUD tests**

Assert background/crop, eight slot centers, Spawn/Base labels, shrine cue at (203,251), day/night colors, telegraph visibility, enemy state cues, P2 emphasis, Motion Lite minimum alpha/amplitude, and 44px HUD outer footprint with 100/50/25% fill inside the measured channel.

- [ ] **Step 2: Verify RED**

Run: `node --test tests/renderer-art.test.js tests/ui-art.test.js tests/boss-hud-geometry.test.js tests/level4-boss-hud-contract.test.js`

Expected: FAIL because Level9 rendering and HUD geometry do not exist.

- [ ] **Step 3: Implement minimal Canvas/CSS presentation**

Reuse shared sprite draw/facing/Motion Lite paths. Add only Level9 environmental/state drawing and status overlays. Measure the accepted HUD's inner channel and add a Level9-only `border-image-slice` if required; do not alter shared height/padding.

- [ ] **Step 4: Verify GREEN, commit, and push checkpoint**

Run: `node --test tests/renderer-art.test.js tests/ui-art.test.js tests/boss-hud-geometry.test.js tests/level4-boss-hud-contract.test.js tests/motion.test.js`

Expected: PASS.

Commit: `feat(level9): render readable state cues and fixed boss hud`

### Task 4: Dev fixtures, responsive smoke entries, and cache contract

**Files:**
- Create: `src/dev/LevelNineDev.js`
- Modify: `src/main.js`
- Modify: `tests/browser-smoke.html`
- Modify: `tests/responsive.html`
- Modify: `tests/ui-contract.test.js`
- Modify: `tests/level9.test.js`
- Modify: `index.html`

**Interfaces:**
- Consumes: Tasks 1–3 complete runtime behavior.
- Produces: guarded Level9 dev entry and fixtures for lineup/path, 晝/夜/telegraph, 天狗/猙 cues, 燭龍 P1/P2, 玄龜 first-playable, victory/unlock/retry; cache version `level9-1` (or one consistent newer Level9 token).

- [ ] **Step 1: Write failing dev/UI contract tests**

Require opt-in Level9 controls and 390×700/short-screen entries, including prior-level victory → Level9 lineup and Level9 victory without Level10 action.

- [ ] **Step 2: Verify RED**

Run: `node --test tests/ui-contract.test.js tests/level9.test.js tests/lineup-ui-regression.test.js`

Expected: FAIL because Level9 dev controls and cache contract do not exist.

- [ ] **Step 3: Implement guarded fixtures and cache-bust updates**

Follow `LevelEightDev` patterns without adding production cheats. Include Xuangui first-playable state and every Level9 presentation state needed for browser evidence.

- [ ] **Step 4: Verify GREEN, commit, and push checkpoint**

Run: `node --test tests/ui-contract.test.js tests/level9.test.js tests/lineup-ui-regression.test.js`

Expected: PASS.

Commit: `test(level9): add guarded runtime smoke fixtures`

### Task 5: Full verification, governance audit, state closure, and release

**Files:**
- Modify: `docs/levels/level9/STATE.md`
- Modify: `docs/WORK_PROGRESS.md`
- Modify only if runtime evidence requires: Level9 production/tests from Tasks 1–4.

**Interfaces:**
- Consumes: complete Level9 implementation and all prior task tests.
- Produces: Gate H evidence, bounded Red Team result, feature/main SHAs, Pages verification, and precise player-smoke status.

- [ ] **Step 1: Run targeted and full engineering checks**

Run: `node --test tests/level9.test.js tests/progression.test.js tests/art-assets.test.js tests/enemy-spacing.test.js tests/boss-hud-geometry.test.js tests/renderer-art.test.js tests/ui-art.test.js tests/ui-contract.test.js`

Run: `npm test`

Run: `npm run check`

Expected: all PASS with zero failures.

- [ ] **Step 2: Run browser/runtime smoke at 390×700 and short-screen**

Verify Level9 lineup/path, day/night/telegraph, enemy cues, Boss P1/P2/HUD 100/50/25%, Motion Lite, Xuangui projectile/潮震, victory/unlock/retry; verify Level8 victory exposes Level9 through normal flow.

Expected: engineering-owned smoke PASS, or record the exact concrete environment blocker without claiming it passed.

- [ ] **Step 3: Perform bounded pre-merge Red Team audit**

Compare the diff against L9-R001–L9-R108, L9-G100–G150, L9-A001–A033, check asset checksums, shared-system impact, stale docs, scope expansion, and Level1–8 regression.

Expected: no unresolved Critical/Important issue.

- [ ] **Step 4: Update canonical state and commit final verification checkpoint**

Record branch/SHA, exact checks, remaining player phone smoke, and release next step in `STATE.md` and `WORK_PROGRESS.md`.

Commit: `docs(level9): record engineering verification`

- [ ] **Step 5: Merge and release per repository rules**

Push verified branch, merge to `main`, rerun the full suite on merged `main`, push `main`, wait for Pages, then verify public `?devMenu=1` exposes Level9 and normal Level8 victory reaches the Level9 lineup.

Expected: released main SHA and public URL evidence recorded; player phone visual acceptance remains separate until the player confirms it.

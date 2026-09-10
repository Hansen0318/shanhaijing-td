# Level 3 Ruoshui Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a playable ten-wave Level 3, 弱水幽谷, entered from Level 2 victory and ending with a 白澤 unlock record.

**Architecture:** Extend the existing data-driven level, enemy, boss, motion, renderer, UI, and staged-art-loading paths. Add a map-owned weak-water zone query so movement modifiers remain gameplay data rather than renderer behavior. Reuse existing towers, economy, blessings, and mobile layout.

**Tech Stack:** HTML/CSS, browser Canvas, ES modules, Node.js built-in test runner.

**Spec:** `shanhaijing_td_level3_package/LEVEL3_WORK_PROMPT_MIN.txt` from the supplied archive.

## Global Constraints

- Do not introduce GIFs, sprite sheets, a new animation system, a fourth level, new skills, or a large AssetStore refactor.
- Preserve Level 1 and Level 2 balance and behavior.
- Level 3 has ten fixed waves; 相柳 heals once at 75% and 50%, then gains 1.20× speed once at 25%.
- Normal enemies move at 0.85× in weak water; 水魈 at 1.35×; 玄甲獸 receives only half of slow strength.
- Required art failures must settle the loading gate; deferred Boss/VFX art must not block Preparation.
- Validate only focused flows and mobile smoke; do not manually replay every wave.

---

### Task 1: Level progression and Level 3 data

**Files:**
- Modify: `src/config/gameData.js`
- Modify: `src/core/Game.js`
- Modify: `src/ui/UIController.js`
- Test: `tests/level3.test.js`

**Interfaces:**
- Produces: `LEVEL3_MAP_DATA`, `LEVEL3_WAVE_DATA`, `LEVELS[3]`, and sequential `Game.enterLevel(levelId)`.

- [ ] Write failing tests for Level 3 identity, ten waves, eight slots, clean Level 2→3 transition, and 白澤 unlock state.
- [ ] Run the focused tests and confirm failure because Level 3 is absent.
- [ ] Add minimal data/progression/UI behavior.
- [ ] Run focused tests and existing progression regressions.
- [ ] Commit and push the checkpoint.

### Task 2: Weak-water movement and 相柳 mechanics

**Files:**
- Modify: `src/map/GameMap.js`
- Modify: `src/entities/Enemy.js`
- Modify: `src/systems/BossSystem.js`
- Modify: `src/core/Game.js`
- Test: `tests/level3.test.js`

**Interfaces:**
- Produces: `GameMap.isWeakWater(point)`, enemy terrain/slow movement calculation, and BossSystem `heal`/`frenzy` events.

- [ ] Write failing behavior tests for normal, 水魈, and 玄甲獸 movement plus all three one-shot 相柳 thresholds.
- [ ] Confirm each fails for the missing behavior.
- [ ] Implement the smallest data-driven movement and Boss changes.
- [ ] Run focused tests and relevant combat/Boss regressions.
- [ ] Commit and push the checkpoint.

### Task 3: Art, Motion Lite, loading, and rendering

**Files:**
- Create: `assets/levels/level3/*`, `assets/enemies/enemy_shuixiao_v1.png`, `assets/enemies/enemy_xuanjiashou_v1.png`, `assets/bosses/boss_xiangliu_v1.png`, relevant effect/UI/unlock images
- Modify: `src/config/artAssets.js`
- Modify: `src/config/motionData.js`
- Modify: `src/render/Renderer.js`
- Modify: `src/core/Game.js`
- Test: `tests/art-assets.test.js`, `tests/motion.test.js`, `tests/renderer-art.test.js`

**Interfaces:**
- Produces: Level 3 required/deferred art catalogs and reuse of the existing MotionSystem transforms.

- [ ] Write failing tests for deployable Level 3 assets, staged loading, centered rendering, Motion X=0, and 相柳 pulse effects.
- [ ] Confirm failure because Level 3 art/motion is absent.
- [ ] Convert supplied mislabeled JPEG payloads to real PNG; edge-remove only non-background assets, preserving white 白澤 details.
- [ ] Add minimal catalog, renderer, effects, and motion configuration.
- [ ] Run focused art/render/motion tests.
- [ ] Commit and push the checkpoint.

### Task 4: Final verification and handoff

**Files:**
- Modify: `docs/WORK_PROGRESS.md`
- Modify: cache-version imports only if required for GitHub Pages freshness.

**Interfaces:**
- Produces: a pushed `main` commit and COMPLETE progress record.

- [ ] Run all tests, JS/MJS syntax checks, and `git diff --check`.
- [ ] Smoke Level 2→3 loading, failed-asset release, 1×/2×, path alignment, Boss thresholds, victory/unlock, 390px, and 390×700 without replaying all waves.
- [ ] Record exact evidence and remaining player checks in `docs/WORK_PROGRESS.md`.
- [ ] Commit, push to `main`, and verify the remote SHA.

# Level7 雷澤天野 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement the frozen Level7 雷澤天野 specification, integrate the six audited runtime assets, preserve Level1–6, and release the verified result through `main` and GitHub Pages.

**Architecture:** Extend the existing data-driven level/progression/art catalogs, then add one focused `ThunderSystem` for discrete A/B pulses and one focused `JumangSupportSystem` for the strongest-deployed-句芒 team multiplier. Keep movement, spacing, Motion Lite, facing, targeting, projectile, Blessing, Boss HUD, lineup, and release pipelines shared; add only Level7 data and narrowly required branches.

**Tech Stack:** Vanilla ES modules, Canvas 2D, DOM/CSS, Node.js built-in test runner, GitHub Pages.

**Spec:** `docs/levels/level7/SPEC.md` with canonical `GEOMETRY.md` and `ASSETS.md`.

## Global Constraints

- Preserve Level1–6 gameplay, balance, Waves, geometry, art, Motion Lite, facing, spacing, UI, and progression behavior.
- Use canonical 390×610 Geometry V3 exactly; do not re-measure or redraw the route.
- Use exactly the six audited package assets and reuse `assets/ui/unlock_jumang_v1.png` as 句芒's visual source.
- Keep 雷脈, 雷行, 雷殼, 夔 thunder, 句芒 support/trail/impact procedural; only the approved leafblade core is image-backed.
- Preserve all frozen Level7 values and W1–W10 composition from `SPEC.md`.
- Level7 lineup is owned-roster-driven, five choose three; retry returns to 0/3.
- Level6 victory unlocks 句芒 once and reaches Level7 lineup; Level7 victory has no next-level action until Level8 exists.
- Every production behavior follows RED → GREEN → REFACTOR; no production code precedes its failing test.
- Run targeted tests after each task, then full `npm test`, `npm run check`, JS syntax, `git diff --check`, 390px/390×700 runtime smoke, bounded Red Team audit, release, and deployed-flow verification.

## Review Focus

- A large/slow follower after a small/fast enemy must still obey the existing visual-footprint spacing gate; covered by Task 1 spacing tests.
- A thunder pulse exactly at a zone edge must use logical coordinates, refresh but never stack statuses, and never buff 夔; covered by Task 2 tests.
- Changing to 夔 P2 must not heal, duplicate a HP bar, or carry a stale P1 cadence/sequence; covered by Task 2 tests.
- Selling or upgrading the strongest 句芒 must recompute the single global multiplier without compounding cooldowns or multiple 句芒; covered by Task 3 tests.
- A lineup without 句芒 must remain fully playable and never receive 句芒-only Blessings; covered by Tasks 1 and 3 progression/Blessing tests.

---

### Task 1: Level7 data, geometry, progression, art catalog, and assets

**Files:**
- Create: `tests/level7.test.js`
- Modify: `tests/progression.test.js`
- Modify: `tests/art-assets.test.js`
- Modify: `tests/enemy-spacing.test.js`
- Modify: `tests/motion.test.js`
- Modify: `src/config/gameData.js`
- Modify: `src/config/progressionData.js`
- Modify: `src/config/artAssets.js`
- Modify: `src/config/enemyVisuals.js`
- Modify: `src/config/motionData.js`
- Create: `assets/levels/level7/bg_leize_tianye_v1.jpg`
- Create: `assets/enemies/enemy_qinyuan_v1.png`
- Create: `assets/enemies/enemy_zhuhuai_v1.png`
- Create: `assets/bosses/boss_kui_v1.png`
- Create: `assets/ui/ui_boss_kui_panel_v1.png`
- Create: `assets/effects/fx_jumang_leafblade_v1.png`

**Interfaces:**
- Consumes: canonical values from `SPEC.md`, coordinates from `GEOMETRY.md`, audited runtime files from the handoff package.
- Produces: `LEVELS[7]`, `LEVEL7_MAP_DATA`, `LEVEL7_WAVE_DATA`, `TOWER_DATA.jumang`, `ENEMY_DATA.qinyuan/zhuhuai/kui`, Level7 asset IDs, and visual/motion geometry consumed by later tasks.

- [ ] **Step 1: Write failing data/progression tests**

Add literal assertions that Level7 identity, 24 canonical waypoints, 8 slots, A/B rectangles, enemy/tower stats, exact 10 Waves, and `bossHpMultiplier: 1.10` match the frozen spec. Update progression expectations to:

```js
assert.deepEqual(PLAYABLE_LEVEL_IDS, [1, 2, 3, 4, 5, 6, 7]);
assert.equal(nextPlayableLevelId(6), 7);
game.end('victory');
assert.equal(game.enterLevel(7), true);
assert.deepEqual(game.lineupRoster(), ['bifang', 'fuzhu', 'yinglong', 'baize', 'jumang']);
assert.deepEqual(game.lineupSelection, []);
```

Assert exactly-three confirmation, Level7 retry → empty lineup, lineup without 句芒 remains valid, and Level7 victory → `nextLevelId() === null`.

- [ ] **Step 2: Write failing asset/spacing/motion tests**

Assert the six exact runtime paths, decode/alpha/size budgets, Level7 required/deferred preload split, and 句芒 body reuse. Extend real spacing and Motion Lite fixtures:

```js
for (const type of ['qinyuan', 'zhuhuai', 'kui']) {
  assert.ok(ENEMY_VISUALS[type].footprint > 0);
  assert.ok(UNIT_MOTION_CONFIG.enemies[type]);
}
assert.ok(UNIT_MOTION_CONFIG.towers.jumang);
```

The mixed spacing regression must spawn `qinyuan → zhuhuai → kui` through `Game.canSpawnEnemy`, not merely inspect constants.

- [ ] **Step 3: Run RED tests**

Run: `node --test tests/level7.test.js tests/progression.test.js tests/art-assets.test.js tests/enemy-spacing.test.js tests/motion.test.js`

Expected: FAIL because Level7 data/assets/visuals do not exist and Level6 has no next playable level.

- [ ] **Step 4: Add minimal data/catalog implementation and audited binaries**

Add frozen records only. The map contract is:

```js
export const LEVEL7_MAP_DATA = Object.freeze({
  width: 390, height: 610, pathWidth: 54, pathSmoothing: 2,
  waypoints: [
    {x:40,y:34},{x:45,y:77},{x:81,y:93},{x:124,y:106},{x:165,y:120},{x:183,y:128},
    {x:190,y:147},{x:224,y:157},{x:259,y:181},{x:251,y:206},{x:199,y:230},{x:156,y:249},
    {x:169,y:269},{x:209,y:291},{x:242,y:308},{x:241,y:331},{x:200,y:353},{x:178,y:375},
    {x:195,y:391},{x:226,y:405},{x:263,y:425},{x:307,y:450},{x:323,y:480},{x:343,y:497},
  ],
  thunderZones: [
    { id: 'A', x: 187, y: 116, width: 63, height: 42 },
    { id: 'B', x: 153, y: 360, width: 66, height: 49 },
  ],
  slots: [{x:138,y:78},{x:294,y:124},{x:135,y:161},{x:97,y:259},{x:287,y:249},{x:293,y:358},{x:138,y:423},{x:258,y:464}],
});
```

Copy only the six checksum-verified package files to their exact repo paths. Add Level7 cache busting without changing old asset bytes.

- [ ] **Step 5: Run GREEN tests and commit checkpoint**

Run the same targeted command; expected PASS. Then run `npm test` and commit/push the coherent data/asset checkpoint.

---

### Task 2: Discrete thunder pulses and 夔 two-phase behavior

**Files:**
- Create: `src/systems/ThunderSystem.js`
- Modify: `src/map/GameMap.js`
- Modify: `src/systems/StatusSystem.js`
- Modify: `src/systems/CombatSystem.js`
- Modify: `src/systems/BossSystem.js`
- Modify: `src/entities/Enemy.js`
- Modify: `src/core/Game.js`
- Modify: `tests/level7.test.js`
- Modify: `tests/combat.test.js`

**Interfaces:**
- Consumes: `map.data.thunderZones`, Level7 enemy IDs, existing enemy statuses/effects and `BossSystem.update` pipeline.
- Produces: `GameMap.thunderZoneAt(point)`, `ThunderSystem.update(game, dt)`, `game.thunder`, `thunderCharge`/`thunderPulse` effects, refresh-only `thunderSprint`/`thunderShell`, and `kuiPhase2` event.

- [ ] **Step 1: Write failing ThunderSystem tests**

Exercise real `Game`, `Enemy`, and `GameMap` instances. Required observable sequence:

```js
ThunderSystem.update(game, 6.1); // A enters 0.9s telegraph
assert.deepEqual(game.thunder.chargingZoneIds, ['A']);
ThunderSystem.update(game, 0.9); // one discrete A pulse
assert.equal(qinyuan.statuses.thunderSprint.remaining, 1.4);
assert.equal(zhuhuai.statuses.thunderShell.remaining, 1.6);
```

Assert A→B in P1, A→B→A+B in P2, logical edge inclusion, refresh-not-stack, leaving does not cancel 雷行, expired effects restore normal movement/damage, and 夔 receives neither status.

- [ ] **Step 2: Run Thunder RED**

Run: `node --test tests/level7.test.js tests/combat.test.js`

Expected: FAIL because `ThunderSystem`, thunder map lookup, statuses, and damage handling are absent.

- [ ] **Step 3: Implement the minimal pulse state machine**

`game.thunder` owns `countdown`, `phase2`, `sequenceIndex`, `chargingZoneIds`, and `lastPulseZoneIds`. P1 uses 7.0s cadence; P2 uses 5.0s; both expose a 0.9s charge window. On pulse, apply/refresh only:

```js
if (enemy.type === 'qinyuan') enemy.statuses.thunderSprint = { remaining: 1.4, multiplier: 1.25 };
if (enemy.type === 'zhuhuai') enemy.statuses.thunderShell = { remaining: 1.6, damageMultiplier: 0.8 };
```

Use `StatusSystem.speedMultiplier` and `CombatSystem.resolveDamage`; never alter base stats. Emit effect records with zone IDs, not guessed pixels.

- [ ] **Step 4: Write failing 夔 phase tests**

Assert W10 spawns 7700 HP; at exactly 50% `BossSystem.update` emits one `kuiPhase2`, leaves HP unchanged, sets speed ×1.15, resets thunder sequence to A with 5s cadence, and emits no duplicate transition on later updates. Assert final victory waits for queue/normals and 夔 death.

- [ ] **Step 5: Run Boss RED, implement GREEN, and commit**

Add `BossSystem.updateKui`, handle its event in `Game`, and preserve the shared Boss victory contract. Run targeted tests, then `npm test`; commit/push the gameplay checkpoint.

---

### Task 3: 句芒 global support, Blessings, and projectile behavior

**Files:**
- Create: `src/systems/JumangSupportSystem.js`
- Modify: `src/config/gameData.js`
- Modify: `src/entities/Tower.js`
- Modify: `src/entities/Projectile.js`
- Modify: `src/core/Game.js`
- Modify: `src/ui/UIController.js`
- Modify: `tests/level7.test.js`
- Modify: `tests/combat.test.js`
- Modify: `tests/progression.test.js`

**Interfaces:**
- Consumes: deployed `Tower` objects, 句芒 level, Blessing modifiers, shared tower stat/projectile pipeline.
- Produces: `JumangSupportSystem.intervalMultiplier(towers, modifiers)`, stats-aware 句芒 attack, `jumangImpact` effect, and filtered 句芒 Blessings.

- [ ] **Step 1: Write failing support tests**

Use real towers in `Game.towers` and assert literal multipliers:

```js
assert.equal(JumangSupportSystem.intervalMultiplier([level1], {}), 0.95);
assert.equal(JumangSupportSystem.intervalMultiplier([level1, level3], {}), 0.89);
assert.equal(JumangSupportSystem.intervalMultiplier([level3], { jumangSpring: 2 }), 0.85);
```

Assert all towers including 句芒 receive the multiplier once; multiple 句芒 do not multiply; upgrade/sell recomputes; removing the last returns `1`; existing `attackSpeed` composes without changing its formula.

- [ ] **Step 2: Write failing Blessing/projectile tests and run RED**

Assert 青羽 +20% damage/layer, 神木 +15% range/layer, 春生 -0.02/layer, max two stacks, and lineup filtering excludes all three when 句芒 is not selected. Fire a real 句芒 projectile and assert one 10-damage hit, no slow status, and one `jumangImpact` effect.

Run: `node --test tests/level7.test.js tests/combat.test.js tests/progression.test.js`

Expected: FAIL because the support system and 句芒-specific branches do not exist.

- [ ] **Step 3: Implement minimal support/stat/projectile branches**

`JumangSupportSystem` selects only the highest deployed 句芒 level and clamps the two-layer frozen values. Extend `Tower.getStats(modifiers, intervalMultiplier = 1)` so interval is existing interval/attackSpeed multiplied once; add only `jumangDamage` and `jumangRange` branches. In `Projectile.impact`, apply slow only for `fuzhu`; 句芒 emits the procedural impact event.

- [ ] **Step 4: Run GREEN/full tests and commit**

Run targeted tests, then `npm test`; commit/push the 句芒 checkpoint.

---

### Task 4: Canvas presentation, Boss HUD, lineup discoverability, dev entry, and smoke fixtures

**Files:**
- Modify: `src/render/Renderer.js`
- Modify: `src/ui/UIController.js`
- Modify: `src/main.js`
- Modify: `src/config/artAssets.js`
- Modify: `styles-lineup.css`
- Modify: `index.html`
- Modify: `tests/renderer-art.test.js`
- Modify: `tests/ui-art.test.js`
- Modify: `tests/ui-contract.test.js`
- Modify: `tests/boss-hud-geometry.test.js`
- Modify: `tests/browser-smoke.html`
- Modify: `tests/responsive.html`

**Interfaces:**
- Consumes: Task 1 art IDs/visuals, Task 2 thunder state/effects, Task 3 projectile/support state, shared UI/Boss HUD contracts.
- Produces: readable Level7 visuals, measured `BOSS_HUD_GEOMETRY.kui`, reusable newly-unlocked emphasis, `?devLevel=7` controls, and 390/390×700 smoke states.

- [ ] **Step 1: Write failing renderer/UI/dev tests**

Assert real Canvas calls for: background, slots, qinyuan/zhuhuai/kui, Motion Lite/facing, idle/charge/pulse A/B, 雷行 tag, 雷殼 tag, Kui P2 emphasis, 句芒 sprite reuse, leafblade rotation + short procedural trail, and impact glow. Assert Level7 wave preview uses correct art and dev menu/control exposes Level7/path/Waves/Kui P1/P2/thunder A/B/victory/retry.

Assert first Level7 lineup marks 句芒 with reusable `NEW` presentation derived from unlock ownership, while subsequent render/state does not change roster/progression rules.

- [ ] **Step 2: Run presentation RED**

Run: `node --test tests/renderer-art.test.js tests/ui-art.test.js tests/ui-contract.test.js tests/boss-hud-geometry.test.js`

Expected: FAIL on all missing Level7 presentation contracts.

- [ ] **Step 3: Implement procedural rendering and UI/dev wiring**

Add `drawThunderZones` before units, keeping faint landmarks and localized charge/pulse only. Add Level7 status/tag/projectile/effect branches to existing shared draw functions. Reuse `jumangUnlock` for build/lineup/tower draw via the art catalog alias rather than duplicating the binary. Add Level7 dev setup and smoke states without changing production defaults.

- [ ] **Step 4: Measure and test 夔 Boss HUD trackRect**

Use the actual 1152×351 alpha image with the existing `70px slice / 6px border / stretch` pipeline. Map the conservative empty-channel interior through the 414×44 HUD containing box, store normalized `left/top/width/height`, and assert the rendered rectangle stays inside the measured channel at 100%, 50%, and 25%. Do not mask or paint over the HUD image.

- [ ] **Step 5: Run GREEN/full tests and checkpoint**

Run targeted tests, `npm test`, and `npm run check`; commit/push before browser smoke.

---

### Task 5: Runtime verification, documentation, Red Team audit, and release

**Files:**
- Modify: `docs/levels/level7/STATE.md`
- Modify: `docs/WORK_PROGRESS.md`
- Modify only if evidence requires a tested fix: files already listed in Tasks 1–4.

**Interfaces:**
- Consumes: complete feature branch and repository release rules.
- Produces: fresh engineering evidence, current Level7 handoff state, feature SHA, merged main SHA, Pages deployment evidence.

- [ ] **Step 1: Run fresh automated verification**

Run:

```bash
node --test tests/level7.test.js tests/progression.test.js tests/combat.test.js tests/enemy-spacing.test.js tests/motion.test.js tests/renderer-art.test.js tests/ui-art.test.js tests/ui-contract.test.js tests/boss-hud-geometry.test.js tests/art-assets.test.js
npm test
npm run check
find src tests -name '*.js' -print0 | xargs -0 -n1 node --check
git diff --check origin/main...HEAD
```

Expected: all PASS, no warnings attributable to production code, no Level1–6 regression.

- [ ] **Step 2: Run 390px and 390×700 runtime smoke**

Verify lineup 5 choose 3, NEW 句芒 discoverability, all 8 slots, canonical path overlay, A/B idle/charge/pulse, qinyuan/zhuhuai states, Kui P1/P2 and HUD 100/50/25, Jumang support/projectile, 1×/2×, victory/retry, no overflow. If browser infrastructure is unavailable under the Guide, record `ENGINEERING PASS / PLAYER SMOKE PENDING` and do not claim visual/player verification.

- [ ] **Step 3: Perform bounded changed-scope Red Team audit**

Confirm: no gate crossing; no unapproved art; no geometry/balance drift; no Level1–6 behavior change; every L7-R/L7-G implemented requirement has STATIC/TARGETED_TEST/WORK_RUNTIME/PLAYER_SMOKE evidence; docs do not overstate player approval.

- [ ] **Step 4: Update canonical state and push final feature checkpoint**

Record branch/SHA, completed work, exact commands/results, runtime limitations, release status, and singular next step in `STATE.md` and `WORK_PROGRESS.md`; commit and push.

- [ ] **Step 5: Review, merge, deploy, and verify public flows**

Follow `AGENTS.md` Section 8: final whole-branch review; sync/reconcile latest `main`; merge verified `feat/level7-leize`; push `main`; wait for Pages source/deploy; verify public `?devMenu=1` exposes Level7 and normal Level6 victory unlocks 句芒 then enters Level7 5-choose-3 lineup. Record final main SHA and deployment evidence before reporting.


# Level8 幽冥沼澤 Production Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 將已 frozen 的 Level8「幽冥沼澤」完整接入既有 campaign、combat、renderer、UI、asset 與 release pipeline，最後由最新 `main` 部署到 GitHub Pages。

**Architecture:** 沿用 Level4+ data-driven roster/progression、Level6/7 環境系統、共用 enemy/tower facing、Motion Lite、Boss HUD 與 staged preload。新增一個聚焦的 `TideSystem` 管理自然／強制潮位；玄龜仍走共用 Tower/Projectile/Combat pipeline，僅在成功命中後排程潮震，不建立 Level8-only combat loop。

**Tech Stack:** Vanilla ES modules、Canvas 2D、Node.js `node:test`、GitHub Pages。

**Spec:** `docs/levels/level8/SPEC.md`（幾何與素材分別以 `GEOMETRY.md`、`ASSETS.md` 為 binding authority）

## Global Constraints

- 從 `origin/main` SHA `454b06dc7db7d5908f322d77515d2d5c408ac712` 開始，branch 為 `feat/level8-youming-marsh`。
- Level1–7 gameplay、數值、Wave、geometry、art 與既有可觀察行為 frozen；shared change 只跑 affected regression。
- Level8 使用 owned/unlocked roster exactly-3；Level7 勝利進 Level8 空陣容；Level8 retry 回空陣容。
- Level8 通關解鎖玄龜；目前沒有 Level9，所以不得顯示 next-level action。
- Geometry、三個 irregular wetland polygons、四個 Motion Lite anchors 必須逐字採用 canonical 文件，不重新量測。
- ZIP `runtime_candidates/` 為 production bytes；`source/` 與 geometry guide 不可進 runtime。
- 玄龜 projectile、潮震、潮位與 environment motion 全部 Procedural-only；不得生成或加入靜態 VFX 圖。
- 新行為一律 RED→GREEN；每一批完成即 commit + push safe checkpoint。
- 驗證順序：Level8 targeted → affected shared regression → full `npm test` → `npm run check` → JS syntax/diff → 390/390×700 runtime smoke。

## Review Focus

- Forced tide refresh 發生在 natural tide／既有 forced tide 重疊時，必須只重設 duration、不堆疊或延長兩份 timer；由 Task 2 targeted test 覆蓋。
- 長右同一濕地在同一次 activation 期間不得重複觸發泥躍，下一次 activation 才可再觸發；由 Task 2 targeted test 覆蓋。
- 潮震命中 Boss 時有傷害但無 push，普通敵 push 不得越過 Spawn，且不改 facing/spacing contract；由 Task 3 targeted test 覆蓋。
- 第一次 Level8 勝利解鎖玄龜一次，再次勝利不重複 unlock presentation；由 Task 1 progression test 覆蓋。
- Level8 first paint、Boss deferred preload、HUD 100/50/25%、390×700 無 overflow 與公開 Level7→8 production flow；由 Task 4/5 tests 與 runtime smoke 覆蓋。

---

### Task 1: Level8 Data、Progression、Geometry 與 Asset Contract

**Files:**
- Modify: `src/config/gameData.js`
- Modify: `src/config/progressionData.js`
- Modify: `src/config/artAssets.js`
- Modify: `src/config/enemyVisuals.js`
- Modify: `src/config/motionData.js`
- Modify: `tests/progression.test.js`
- Modify: `tests/art-assets.test.js`
- Modify: `tests/enemy-spacing.test.js`
- Create: `tests/level8.test.js`
- Add runtime files under `assets/levels/level8/`, `assets/enemies/`, `assets/bosses/`, `assets/towers/`, `assets/ui/`

**Interfaces:**
- Consumes: `SPEC.md` numerical baseline, `GEOMETRY.md` coordinates, `ASSETS.md` approved runtime inventory.
- Produces: `LEVEL8_MAP_DATA`, `LEVEL8_WAVE_DATA`, `LEVELS[8]`, `TOWER_DATA.xuangui`, `ENEMY_DATA.changyou/gudiao/huashe`, `UNLOCK_BY_LEVEL[8]`, Level8 art IDs and visual/motion configs.

- [ ] **Step 1: Write failing Level8 configuration and progression tests**

```js
test('Level8 defines frozen identity, geometry, enemies, tower and Waves', () => {
  const level = getLevelData(8);
  assert.equal(level.name, '幽冥沼澤');
  assert.deepEqual(level.map.slots[0], { x: 115, y: 133 });
  assert.equal(level.map.wetlandPolygons.length, 3);
  assert.equal(level.waves[9].bossHpMultiplier, 1.1);
  assert.equal(ENEMY_DATA.huashe.hp, 7600);
  assert.equal(TOWER_DATA.xuangui.cost, 145);
});

test('Level7 victory enters Level8 empty five-beast lineup and Level8 unlocks Xuangui once', () => {
  const game = new Game(() => 0.2, 7);
  game.end('victory');
  assert.equal(game.enterLevel(8), true);
  assert.deepEqual(game.lineupRoster(), ['bifang', 'fuzhu', 'yinglong', 'baize', 'jumang']);
  assert.deepEqual(game.lineupSelection, []);
  game.end('victory');
  assert.equal(game.pendingUnlock, 'xuangui');
  assert.equal(game.nextLevelId(), null);
});
```

- [ ] **Step 2: Run tests and verify RED**

Run: `node --test tests/level8.test.js tests/progression.test.js tests/art-assets.test.js tests/enemy-spacing.test.js`

Expected: FAIL because Level8 data, Xuangui unlock, assets and visual footprints do not exist.

- [ ] **Step 3: Add frozen data and copy audited runtime candidates**

Implement exact values from canonical docs. Use `pointInPolygon`-ready polygon arrays, exact 16 path anchors plus Spawn/Base endpoints, eight slots, Level8 lineup copy and `bossVictoryRequiresWaveClear: true`. Copy only audited runtime candidates to semantic production paths and register staged preload.

- [ ] **Step 4: Run Task 1 tests and verify GREEN**

Run: `node --test tests/level8.test.js tests/progression.test.js tests/art-assets.test.js tests/enemy-spacing.test.js`

Expected: all Task 1 tests PASS, including exact image dimensions/alpha/byte budgets and Level7→8 / retry / unlock contracts.

- [ ] **Step 5: Commit and safe-push**

```bash
git add src/config tests assets docs/levels/level8/STATE.md docs/levels/level8/SPEC.md
git commit -m "feat: add Level8 data progression and assets"
git push -u origin feat/level8-youming-marsh
```

### Task 2: Tide、Wetland Enemy Mechanics 與化蛇 Boss

**Files:**
- Create: `src/systems/TideSystem.js`
- Modify: `src/map/GameMap.js`
- Modify: `src/entities/Enemy.js`
- Modify: `src/systems/BossSystem.js`
- Modify: `src/systems/CombatSystem.js`
- Modify: `src/core/Game.js`
- Modify: `tests/level8.test.js`
- Modify: `tests/combat.test.js`

**Interfaces:**
- Consumes: `LEVEL8_MAP_DATA.wetlandPolygons`, `ENEMY_DATA` Level8 records.
- Produces: `Game.tide`, `GameMap.wetlandZoneAt(point)`, Changyou mud-leap status, Gudiao marsh-armor mitigation, Huashe P2/forced-tide events.

- [ ] **Step 1: Write failing tide and enemy/Boss behavior tests**

```js
test('natural and forced tides activate every wetland together without stacking', () => {
  const game = new Game(() => 0.2, 8);
  TideSystem.update(game, 6.8);
  assert.equal(game.tide.telegraphing, true);
  TideSystem.forceHighTide(game, 3);
  TideSystem.forceHighTide(game, 3);
  assert.equal(game.tide.highRemaining, 3);
});

test('Changyou retriggers once per wetland activation and Gudiao armor lingers 0.6s', () => {
  // Place both real enemies in a canonical active wetland, update twice,
  // leave the polygon, and assert refresh-only statuses and exact multipliers.
});

test('Huashe enters P2 once and forced tide cadence changes from 7s to 5s', () => {
  // Spawn Wave10 Huashe, cross 50% once, assert 8360 max HP, ×1.15 speed,
  // no heal/second bar, and P2 forced high tide duration 3.0s.
});
```

- [ ] **Step 2: Run Level8 tests and verify RED**

Run: `node --test tests/level8.test.js tests/combat.test.js`

Expected: FAIL because `TideSystem`, polygon membership and Level8 combat states are absent.

- [ ] **Step 3: Implement the smallest shared tide integration**

`TideSystem.reset()` returns one state object with natural countdown, high-tide remaining, telegraph state and activation serial. `forceHighTide(game, seconds)` refreshes the same high window. Enemy update uses `activationSerial + wetland id` to gate Changyou and a refresh-only timer for Gudiao. `CombatSystem.resolveDamage` applies Gudiao's active/linger multiplier after insight without changing completed-level branches. `BossSystem.updateHuashe` emits one P2 transition plus forced-tide requests.

- [ ] **Step 4: Verify GREEN and affected combat regressions**

Run: `node --test tests/level8.test.js tests/combat.test.js tests/level6.test.js tests/level7.test.js tests/game.test.js`

Expected: PASS; the shared endpoint floating-point case is fixed with an epsilon-safe completion check, not by weakening the assertion.

- [ ] **Step 5: Commit and safe-push**

```bash
git add src tests
git commit -m "feat: implement Level8 tide enemies and Huashe"
git push origin feat/level8-youming-marsh
```

### Task 3: 玄龜 Projectile、潮震 Pushback 與 Blessings

**Files:**
- Modify: `src/entities/Tower.js`
- Modify: `src/entities/Projectile.js`
- Modify: `src/core/Game.js`
- Modify: `src/config/gameData.js`
- Modify: `src/config/motionData.js`
- Modify: `tests/level8.test.js`
- Modify: `tests/combat.test.js`
- Modify: `tests/motion.test.js`

**Interfaces:**
- Consumes: shared target-facing, Projectile successful-impact pipeline, `GameMap.positionAt` and Level8 blessing modifiers.
- Produces: per-tower `successfulAttackCount`, delayed `tideShockPending` effect, AoE damage and bounded non-Boss path-distance pushback.

- [ ] **Step 1: Write failing Xuangui behavior and blessing tests**

```js
test('Xuangui triggers one delayed tide shock every four successful hits', () => {
  // Impact four living targets; assert one 0.35s pending event and no earlier pulse.
});

test('tide shock damages Boss without push and clamps normal enemy push at Spawn', () => {
  // Hand-derive 18 damage, radius 52 and path distances after base push 18.
});

test('Xuangui blessings stack twice and remain filtered when Xuangui is not selected', () => {
  assert.deepEqual(
    BLESSING_DATA.filter(item => item.tower === 'xuangui').map(item => item.id),
    ['xuanguiWave', 'xuanguiWideTide', 'xuanguiReturnTide'],
  );
});
```

- [ ] **Step 2: Run tests and verify RED**

Run: `node --test tests/level8.test.js tests/combat.test.js tests/motion.test.js`

Expected: FAIL because Xuangui impact counting, delayed shock and modifiers are absent.

- [ ] **Step 3: Implement Xuangui through shared Tower/Projectile/Game pipeline**

Add Xuangui stats to `Tower.getStats`, including exact derived tide-shock damage/radius/push. A real projectile impact increments the source tower only after a valid hit. The fourth hit schedules one local telegraph; Game resolves it after 0.35s through `CombatSystem.areaDamage`, then subtracts bounded path distance for non-Boss hit enemies and refreshes their coordinates with `map.positionAt`.

- [ ] **Step 4: Verify GREEN and shared facing/projectile regression**

Run: `node --test tests/level8.test.js tests/combat.test.js tests/motion.test.js tests/level7.test.js tests/renderer-art.test.js`

Expected: PASS, including retained Xuangui facing after attack and unaffected Jumang/Bifang/Fuzhu/Yinglong/Baize behavior.

- [ ] **Step 5: Commit and safe-push**

```bash
git add src tests
git commit -m "feat: add Xuangui tide shock combat"
git push origin feat/level8-youming-marsh
```

### Task 4: Level8 Renderer、Motion Lite、HUD、UI 與 Dev Entries

**Files:**
- Modify: `src/render/Renderer.js`
- Modify: `src/ui/UIController.js`
- Modify: `src/main.js`
- Modify: `index.html`
- Modify: `tests/renderer-art.test.js`
- Modify: `tests/ui-art.test.js`
- Modify: `tests/ui-contract.test.js`
- Modify: `tests/lineup-ui-regression.test.js`
- Modify: `tests/level4-boss-hud-contract.test.js`
- Modify: `tests/boss-hud-geometry.test.js`
- Modify: `tests/browser-smoke.html`
- Modify: `tests/responsive.html`

**Interfaces:**
- Consumes: Level8 art IDs, tide state/effects, wetland polygons, environment anchors, Xuangui projectile/effects.
- Produces: Level8 Canvas presentation, procedural tide/telegraph/motion/projectile/shock visuals, Huashe HUD, dev menu and guarded runtime fixtures.

- [ ] **Step 1: Write failing renderer/UI/dev contract tests**

```js
test('Level8 renders wetlands, motion anchors, units, Xuangui projectile and Huashe P2', () => {
  // Use a complete Canvas fake with linear/radial gradients and assert real draw calls,
  // state labels, procedural projectile trail and localized shock arcs.
});

test('dev menu and guarded controls expose Level8 tide, Huashe phases, victory and retry', async () => {
  assert.match(main, /setupLevelEightDev/);
  assert.match(main, /devTide/);
  assert.match(html, /src\/main\.js\?v=level8-1/);
});
```

- [ ] **Step 2: Run UI/renderer tests and verify RED**

Run: `node --test tests/renderer-art.test.js tests/ui-art.test.js tests/ui-contract.test.js tests/lineup-ui-regression.test.js tests/level4-boss-hud-contract.test.js tests/boss-hud-geometry.test.js`

Expected: FAIL because Level8 draw paths/HUD/dev entry/cache version are absent; existing stale fake-gradient/cache assertions are replaced by release-wide `level8-1` contracts.

- [ ] **Step 3: Implement presentation and dev fixtures**

Render order: background → Level8 environment Motion Lite → feathered wetland tide landmarks/telegraph → slots/map props → towers/enemies/projectiles/effects. Add Level8 unit state tags, Huashe P2 emphasis, Xuangui water-core projectile and tide-shock telegraph/impact. Add dev menu Level8 plus guarded `devWave`, `devBossPhase`, `devTide`, `devVictory`, `devRetry`; add path-debug polygons without using the reference guide at runtime. Measure and store Huashe rendered Boss channel geometry, then validate 100/50/25% fill.

- [ ] **Step 4: Verify GREEN**

Run: `node --test tests/renderer-art.test.js tests/ui-art.test.js tests/ui-contract.test.js tests/lineup-ui-regression.test.js tests/level4-boss-hud-contract.test.js tests/boss-hud-geometry.test.js tests/art-assets.test.js`

Expected: all named suites PASS with one consistent `level8-1` entry/module/art cache contract.

- [ ] **Step 5: Commit and safe-push before long smoke**

```bash
git add src tests index.html
git commit -m "feat: integrate Level8 presentation and dev runtime"
git push origin feat/level8-youming-marsh
```

### Task 5: Canonical State、Verification、Review、Merge 與 Pages Release

**Files:**
- Modify: `docs/levels/level8/STATE.md`
- Modify: `docs/levels/level8/SPEC.md`
- Modify: `docs/levels/level8/ASSETS.md`
- Modify: `docs/WORK_PROGRESS.md`

**Interfaces:**
- Consumes: Tasks 1–4 production branch and test evidence.
- Produces: engineering/release trace, merged `main`, deployed Pages verification and explicit remaining player-phone smoke status.

- [ ] **Step 1: Run targeted and affected regressions**

Run: `node --test tests/level8.test.js tests/progression.test.js tests/combat.test.js tests/motion.test.js tests/renderer-art.test.js tests/ui-art.test.js tests/ui-contract.test.js tests/art-assets.test.js tests/boss-hud-geometry.test.js tests/enemy-spacing.test.js`

Expected: PASS with no Level8 or affected shared failure.

- [ ] **Step 2: Run release-wide checks**

```bash
npm test
npm run check
find src tests -name '*.js' -print0 | xargs -0 -n1 node --check
git diff --check origin/main...HEAD
```

Expected: all commands exit 0. The baseline five failures must be resolved by the narrow timer/cache/test-harness changes already covered by targeted tests.

- [ ] **Step 3: Run local 390px / 390×700 runtime smoke**

Start `npm run dev`, use the available browser/runtime harness, and verify `?devMenu=1`, Level8 lineup, path/slots/wetlands/motion, mud-leap, marsh armor, Huashe P1/P2/HUD/forced tide, Xuangui unlock/tower/projectile/tide shock/Blessings, victory and retry. Capture failures as tests before any fix.

- [ ] **Step 4: Complete bounded Red Team review and final branch review**

Review `origin/main...HEAD` against the Review Focus and canonical docs. Critical/Important findings require one RED→GREEN fix pass and a fresh full suite; minor findings are recorded without scope expansion.

- [ ] **Step 5: Update canonical state and safe-push verified branch**

Record exact branch SHAs, test counts, runtime smoke evidence, release gate and next exact step in `STATE.md` and `WORK_PROGRESS.md`; remove stale `SPEC.md` text that says frozen geometry/motion remains unapproved.

```bash
git add docs
git commit -m "docs: record Level8 engineering verification"
git push origin feat/level8-youming-marsh
```

- [ ] **Step 6: Merge verified feature branch and push main**

Fetch latest `origin/main`, confirm no conflict, merge the feature branch without rewriting history, and push `main`. Record the merged main SHA.

- [ ] **Step 7: Verify Pages release and both public paths**

Poll until public assets serve the merged release. Verify public `?devMenu=1` exposes Level8 and public normal production flow reaches Level8 through Level7 victory. Run the same Level8 dev states against public Pages and record any player-phone-only visual checks separately.

- [ ] **Step 8: Release cleanup**

After ancestry and Pages SHA are verified, remove only disposable local package/extract/runtime-smoke artifacts and the fully merged temporary feature branch if it has no unique commits. Preserve canonical docs, shipped assets, tests and release evidence.

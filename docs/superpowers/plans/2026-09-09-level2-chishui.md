# 第2關・赤水荒原 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 加入保留第一關 baseline 的可玩第二關、正式素材、兩種敵人與狍鴞 Boss。

**Architecture:** 關卡差異集中在 `LEVELS` data；`Game` 只持有當前關卡並在切關時重建 run state。Renderer、UI、Wave 與 Boss feedback 都由當前關卡／敵人資料決定，不用散落的 level-id if/else 控制玩法。

**Tech Stack:** HTML、CSS、ES Modules、Canvas 2D、Node test runner、GitHub Pages。

**Spec:** `docs/superpowers/specs/2026-09-09-level2-chishui-design.md`

## Global Constraints

- 不修改第一關數值、地圖座標或素材。
- 不新增第四塔、雙入口、第3關、存檔、主選單或額外 Boss 主動技能。
- 第二關進入時重置 Base HP、Gold、Towers、Blessings、Wave 與 transient state。
- 只做 focused automated tests 與 390px／390×700px state-injection smoke，不人工完整打 Wave 1–10。

---

### Task 1: Data-driven 關卡資料與切換

**Files:**
- Modify: `src/config/gameData.js`
- Modify: `src/core/Game.js`
- Create: `tests/level2.test.js`

**Interfaces:**
- Produces: `LEVELS`, `getLevelData(levelId)`, `Game.enterLevel(levelId)`, `game.levelId`, `game.level`。
- Preserves: `LEVEL_DATA`, `MAP_DATA`, `WAVE_DATA` as Level 1 aliases。

- [ ] 寫入會失敗的測試：第二關 identity、10 Waves、8 slots，以及第一關 Victory 後 `enterLevel(2)` 重置所有 run state。
- [ ] 執行 `node --test tests/level2.test.js`，確認因 `LEVELS`／`enterLevel` 尚不存在而失敗。
- [ ] 新增第二關 data，讓 `resetRun(levelId)` 使用 `level.map` 與 `level.waves`，並使 `restart()` 保留當前 level。
- [ ] 重跑 `tests/level2.test.js tests/game.test.js tests/core.test.js` 至通過。
- [ ] Commit：`feat: add data-driven second level progression`。

### Task 2: 岩甲減傷與狍鴞吞噬

**Files:**
- Create: `src/systems/BossSystem.js`
- Modify: `src/systems/CombatSystem.js`
- Modify: `src/entities/Enemy.js`
- Modify: `src/core/Game.js`
- Modify: `tests/level2.test.js`
- Modify: `tests/combat.test.js`

**Interfaces:**
- `CombatSystem.resolveDamage(base, enemy, modifiers)` 套用 `enemy.data.normalDamageMultiplier`，最低普通傷害為 `enemy.data.minimumNormalDamage ?? 0`。
- `BossSystem.check(enemy)` 回傳事件陣列；事件為 `{type:'frenzy'}` 或 `{type:'consume', threshold, healAmount}`。

- [ ] 寫入會失敗的測試：岩甲普通傷害 100→65、低傷最低1、Burn不減傷；狍鴞 70%／40%各回432且只觸發一次；窮奇狂暴不變。
- [ ] 執行直接測試並確認預期失敗。
- [ ] 實作 data-driven boss triggers，Game 依事件顯示 banner、建立純視覺 effects，Boss死亡才 Victory。
- [ ] 重跑 `tests/level2.test.js tests/combat.test.js tests/game.test.js tests/progression.test.js`。
- [ ] Commit：`feat: add level-two enemies and paoxiao consume`。

### Task 3: 第二關素材與 Canvas 地圖

**Files:**
- Add: ZIP 中 11 張 PNG 至 Manifest 指定路徑
- Modify: `src/config/artAssets.js`
- Modify: `src/render/Renderer.js`
- Create: `tests/level2-renderer.test.js`
- Modify: `tests/art-assets.test.js`

**Interfaces:**
- `LEVEL_ART_IDS[levelId]` 列出關卡需要 preload 的素材。
- `ArtStore.ensureLevel(levelId)` 載入該關素材並回傳 Promise；`isLevelReady(levelId)` 提供 gate。
- Renderer 由 `game.level.art` 選擇背景 crop、Spawn、Base、Boss HUD id 與特效 id。

- [ ] 寫入會失敗的素材清單與 Renderer spy tests，鎖定11張檔案、第二關 crop、8 slots、props、敵人水平鏡像與四種 Boss feedback。
- [ ] 執行直接測試並確認失敗。
- [ ] 匯入 PNG；實作關卡素材 lazy preload 與動態 Canvas rendering，載入前不畫舊關卡 fallback。
- [ ] 重跑 `tests/art-assets.test.js tests/renderer-art.test.js tests/level2-renderer.test.js`。
- [ ] Commit：`feat: integrate chishui battlefield art`。

### Task 4: Victory 切關與動態 UI

**Files:**
- Modify: `index.html`
- Modify: `styles.css`
- Modify: `styles-fixes.css`
- Modify: `src/ui/UIController.js`
- Modify: `src/main.js`
- Modify: `tests/ui-art.test.js`
- Modify: `tests/ui-contract.test.js`

**Interfaces:**
- 第一關 Victory 顯示 `data-action="next-level"`；第二關 Victory 不顯示此按鈕。
- `UIController` 的 async transition 先啟用 art gate，`await renderer.prepareLevel(2)` 後才 `game.enterLevel(2)`。
- HUD、Wave preview、Base label 與 Boss HUD 都讀 `game.level`／active boss。

- [ ] 寫入會失敗的 UI tests：第一關有兩個結果按鈕、第二關只重試、關卡／Base／Boss名稱動態、transition preload順序。
- [ ] 執行直接測試確認失敗。
- [ ] 實作最小 DOM／CSS 與 async action，不改通用 layout 高度。
- [ ] 重跑 UI focused tests。
- [ ] Commit：`feat: connect level-one victory to chishui`。

### Task 5: Smoke fixture 與專案狀態

**Files:**
- Modify: `tests/browser-smoke.html`
- Modify: `docs/PROJECT_STATE.md`
- Create: `docs/LEVEL2_PROGRESS.md`

**Interfaces:**
- Smoke fixture 提供 Level 1 Victory→Level 2、Level 2 Wave 1／8／10、70%／40% consume 與 Victory 注入按鈕。

- [ ] 新增 smoke controls，確保只移除 queue 中的一隻 Boss，避免重複生成。
- [ ] 更新文件，明確標示第二關為第一版待玩家實機平衡驗收。
- [ ] 執行全 JS/MJS syntax check 與 focused tests。
- [ ] 在正式 GitHub Pages 前先以本地 server 驗證 390px 與390×700px：8 slots、背景道路、關卡名稱、Boss HUD、兩段回血、Victory 無第3關按鈕、無 overflow/runtime error。
- [ ] Commit：`test: cover second-level mobile flow`。

### Task 6: 最終驗證與 main

**Files:**
- Modify only if a directly reproduced regression requires it.

- [ ] 執行一次最終必要 syntax check、Level 1 regression tests 與 Level 2 focused suite；不人工完整跑兩關。
- [ ] `git diff --check` 並確認未改第一關 data。
- [ ] Push 已完成階段至 `main`，確認遠端 SHA 與 GitHub Pages 部署。
- [ ] 回報 PASS/FAIL、修改檔案、最小驗證、最新 SHA 與玩家需實機確認項目。


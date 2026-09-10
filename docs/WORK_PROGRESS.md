# Shanhaijing TD Work Progress

## 基線

- 本輪從 `c8def07871d063f3160f7f92d585119a66bc9686` 接續。
- 上一輪已完成的 Level3 基礎整合、正式素材、Motion Lite、Boss/祝福/解鎖與既有完整流程不重做。
- 本輪只處理玩家指定 A–F 六項。

## 2026-09-11 本輪已完成

### A. Preparation UI 改版

- 已移除 battlefield 內舊 `.wave-control` / `countdown-label` 大黑條 DOM。
- `start-wave-button` 已搬到上方 `wave-preview` 最右側，文案為 `開始 W{n}`。
- 只在 `preparation` 顯示；Wave 開始後 `render()` 立即設為 hidden。
- Start Wave listener 仍呼叫既有 `game.startWaveNow()`；Preparation 無限時間與 gameplay 行為不變。
- 改為三關共用 UI；已移除上一輪 Level3-only pointer-events workaround。
- battlefield 現在只有 canvas + banner，不再有 Preparation/Start overlay 擋塔位。

### B. Level3 enemy path 真正校準

- 已確認 Motion Lite enemy config 沒有水平 bob/xOffset 參數；不把偏路歸因於 Motion Lite。
- Level1/2 path 與 8 個 Level3 塔位完全未改。
- Level3 path 從較疏 waypoint + `pathSmoothing: 4` 改成 42 個較密人工 anchor + `pathSmoothing: 2`。
- S 彎增加進彎 / 中彎 / 出彎 anchors，弱水區與後段彎道亦增加中心線控制點，降低 spline 在彎內切角的空間。
- 新增 dev-only `?devLevel=3&devPath=1`：綠線=runtime path、黃點=gameplay anchors、紅十字=enemy logical center，可直接疊背景檢查路徑/精靈中心。
- 背景 binary 無法在目前 GitHub connector/terminal 環境直接做可視化瀏覽器疊圖，因此最終道路視覺貼合仍列玩家實機 smoke；未把這項未觀察結果記成已通過。

### C. Level3 W1–W3 再降難度

- 水魈 speed：`112 → 90`。
- weakWaterSpeedMultiplier：`1.35 → 1.25`。
- 弱水中基礎實際速度：`151.2 → 112.5`。
- W1：水魈 ×6，interval 1.10。
- W2：水魈 ×8，interval 1.00。
- W3：水魈 ×6 + 玄甲獸 ×1，interval 1.00。
- W4–W10 未改；玩家塔傷害未改。

### D. dev-only 關卡選單

- 保留 `?devLevel=1/2/3`；非法值 fallback Level1。
- 新增 `?devMenu=1`，顯示 Level1 / Level2 / Level3 三按鈕。
- 點選後導向 `?devLevel=n`。
- devMenu branch 不建立 Game、Renderer 或 ArtStore instance，也不 preload 關卡素材。
- 正式 `index.html` 不含 dev menu DOM；只有 query `devMenu=1` 才由 JS 建立。

### E. 正式頁 + 切關 Loading / preload 優化

修改前 blocking required assets：

- Level1：19。
- Level2：19。
- Level3：20。

修改後 blocking required assets：

- Level1：5 = `slotPlatform / background / spawnRift / baseSeal / minion`。
- Level2：5 = `slotPlatform / level2Background / level2Spawn / level2Base / minion`。
- Level3：5 = `slotPlatform / level3Background / level3Spawn / level3Base / shuixiao`。

變化：Level1 19→5（-73.7%）、Level2 19→5（-73.7%）、Level3 20→5（-75.0%）。

- projectile / explosion / slow mark / beam / Boss / Boss VFX / late-wave enemy / unlock 等已改為 deferred。
- CSS 自行載入的 resource/hud/wave preview/context/build/action/blessing/result/Boss border-image 不再被 ArtStore 當 readiness blocker。
- `body.art-loading` 仍保留「山海異獸載入中…」與 pulse/dots，只等待 LEVEL_REQUIRED_ART_IDS。
- `loadIds()` 原有 onerror→settle 行為保留，失敗資產不會造成無限 loading，Renderer fallback 仍可接手。
- `?devLevel=3` 現在直接 `new ArtStore(Image, 3)`；不再先啟動 Level1 unique preload 再 ensure Level3。
- fresh load 新增 `globalThis.__SHANHAIJING_LOAD_METRICS__`，記錄 `levelId / requiredAssets / blockingMs`，供正式 Pages 實測 wall-clock。
- 目前環境無法執行正式 GitHub Pages/iPhone Safari，因此修改前後真實 wall-clock 毫秒數沒有可靠觀測值；不得以 asset count 推算成實際時間。

### F. 驗證 / 中斷續作

已完成的 targeted repository verification：

- 最新 diff 相對 `c8def078`：ahead 12 commits、behind 0；只動本輪相關 9 個 production/test 檔案，未碰 Level1/2 path、塔傷害或完整 Wave gameplay。
- Preparation CTA 結構 regression 已加入 `tests/ui-contract.test.js`。
- devMenu / devLevel / direct ArtStore initialLevelId / devPath / loading metrics regression 已加入 `tests/ui-contract.test.js`。
- blocking art budget / error settle / direct Level3 no-Level1-preload regression 已加入 `tests/art-assets.test.js`。
- Level3 dense path anchors / weaker smoothing / 8 slots unchanged / 水魈速度與 W1–W3 baseline regression 已加入 `tests/level3.test.js`。
- GitHub API compare 已確認本輪 production 變更集中在 `index.html`, `src/config/artAssets.js`, `src/config/gameData.js`, `src/main.js`, `src/ui/UIController.js`, `styles-fixes.css`，另有對應 3 個 targeted test files。

目前工具環境限制：

- container 無法解析 `github.com`，不能 clone main 後直接執行 repo 的 `npm test` / browser smoke。
- 無可用互動瀏覽器連到 GitHub Pages，因此 390px / 390×700 真實渲染、Start CTA 實機點擊、切關 loading、1×/2×、道路疊圖與 wall-clock loading time 尚需玩家 smoke。
- 不重跑完整 1–10 Waves，符合本輪 scope。

## Root cause

- Preparation 塔位被擋：Start/Preparation 控件原本 absolute 疊在 battlefield，DOM hit area 會攔截 canvas pointer；已改為上方共用 wave-preview CTA，根因移除而非用 Level3 pointer exception 繞過。
- Level3 彎道切角：較疏 waypoint 配較強 smoothing 仍可在 S 彎偏離背景中心；改用較密人工 anchor 約束曲線，並降低 smoothing。
- Level3 前期過快：水魈 base 112 × 弱水 1.35 = 151.2，加上前 3 波數量仍高；本輪同時降 base、弱水倍率、數量與 interval 壓力。
- 正式 loading 偏慢：ArtStore 把大量戰鬥期 FX、Boss 與 CSS 自載 UI 圖也納入 Preparation readiness；已縮成每關 5 張真正首屏 blocking assets。
- 舊 `?devLevel=3`：Renderer 預設 ArtStore(1) 先啟動 Level1 required，再補 Level3；已改為先解析 initialLevelId 再建立 ArtStore。

## 修改檔案

- `index.html`
- `styles-fixes.css`
- `src/ui/UIController.js`
- `src/main.js`
- `src/config/artAssets.js`
- `src/config/gameData.js`
- `tests/ui-contract.test.js`
- `tests/art-assets.test.js`
- `tests/level3.test.js`
- `docs/WORK_PROGRESS.md`

## 尚需玩家實測

1. 正式首頁 fresh load：feedback 正常，讀取 `__SHANHAIJING_LOAD_METRICS__` 的 blockingMs。
2. Level1→2、Level2→3：loading overlay 正常進出。
3. `?devLevel=3` 直接第三關；`?devMenu=1` 可選 1/2/3；正式網址不顯示 dev menu。
4. 三關 Preparation 8 塔位可點，尤其 Level3 最上方；CTA 位於 wave-preview 右側且 Wave 開始後消失。
5. `?devLevel=3&devPath=1` 疊圖確認直線 / S 彎 / 弱水段貼道路中心，精靈透明邊界不造成視覺中心錯覺。
6. W1–W3 新難度、1×/2×、390px 與 390×700 targeted smoke。

## 最新 production checkpoint

- Production/test head before this docs update: `3bb3f7533de07e756a3e54a80b914852035cc204`。

## 狀態

ENGINEERING IMPLEMENTED / TARGETED PLAYER SMOKE PENDING

# Shanhaijing TD Work Progress

## 2026-09-11 圖片資產體積與載入速度優化

### Scope / 顯示尺寸盤點

- 只處理圖片資產、圖片引用與 preload 分組；未改 gameplay、UI 版型、Renderer 尺寸或 Motion Lite。
- Canvas 固定為 390×610 CSS px，DPR 上限 2。
- 三塔 canvas 最大約 48–56×54–58 px，建造卡 / 已部署資訊為 34×34 / 30×30 px。
- 普通敵人為 36–50×36–50 px；Level1/2 Boss 為 68–72 px。
- 指定 VFX 實際約 19×13 至 155×92 px；Spawn/Base 為 66 / 76 px；塔位底座為 52×40 px。
- 背景實際繪製為 390×610 px；UI 圖以 border-image 顯示於 44px HUD、110px build card、96px blessing card、360×430 result panel 等容器。

### 已完成

- Level1/2 背景由不含 alpha 的 PNG 改為同尺寸 JPEG（quality 84、4:4:4），保留原 crop 與構圖。
- 角色 / Boss / VFX / Spawn / Base / slot 依 2× 顯示需求縮至 192–512px，保留 RGBA。
- 九宮格 UI 保留原像素尺寸與既有 border-slice 數值，只做 256 色含 alpha PNG 壓縮，沒有修改版型。
- 三塔加入三關 required preload；Boss、VFX、build/blessing/result 與 Boss panel 仍維持 deferred。
- JS `assetUrl()`、CSS border-image、stylesheet 與 changed-module URL 統一加上 `asset-opt-1`，避免回訪裝置沿用同名舊大圖快取。
- required 資產數每關 10→13，但 blocking transfer：Level1 11.737→2.619MiB、Level2 10.973→2.682MiB、Level3 4.183→2.538MiB。
- 全部 assets：54.559→9.855MiB（-81.9%）。

### 處理圖片（35 張）

| 圖片 | 原尺寸 | 新尺寸 | 前 KB | 後 KB |
|---|---:|---:|---:|---:|
| `backgrounds/bg_kunlun_gate_v1.jpg` | 1214x1295 | 1214x1295 | 2666.5 | 425.4 |
| `bosses/boss_paoxiao_v1.png` | 1254x1254 | 384x384 | 1237.1 | 213.7 |
| `bosses/boss_qiongqi_frenzy_v1.png` | 1254x1254 | 384x384 | 2729.9 | 343.4 |
| `bosses/boss_qiongqi_v1.png` | 1235x1199 | 384x373 | 1533.3 | 245.5 |
| `effects/fx_bifang_explosion_v1.png` | 1331x1136 | 384x328 | 1635.2 | 217.1 |
| `effects/fx_bifang_fireball_v1.png` | 1368x1134 | 192x159 | 916.0 | 35.5 |
| `effects/fx_fuzhu_frostshot_v1.png` | 1372x1138 | 192x159 | 817.8 | 39.3 |
| `effects/fx_paoxiao_enrage_v1.png` | 1254x1254 | 256x256 | 1770.8 | 113.4 |
| `effects/fx_paoxiao_explosion_v1.png` | 1254x1254 | 256x256 | 1816.0 | 125.6 |
| `effects/fx_paoxiao_groundslam_v1.png` | 1254x1254 | 256x256 | 1633.5 | 113.1 |
| `effects/fx_paoxiao_projectile_v1.png` | 1254x1254 | 192x192 | 1037.6 | 42.3 |
| `effects/fx_slow_mark_v1.png` | 1190x1188 | 256x256 | 1168.4 | 74.8 |
| `effects/fx_yinglong_beam_v1.png` | 1501x387 | 512x132 | 542.1 | 90.3 |
| `enemies/enemy_chiyu_v1.png` | 1254x1254 | 256x256 | 1418.0 | 109.2 |
| `enemies/enemy_jiyao_v1.png` | 1237x1135 | 256x235 | 1176.5 | 102.1 |
| `enemies/enemy_juyao_v1.png` | 1241x1197 | 256x247 | 1855.9 | 123.6 |
| `enemies/enemy_xiaoyao_v1.png` | 1182x1140 | 256x247 | 1255.3 | 109.6 |
| `enemies/enemy_yanjia_v1.png` | 1254x1254 | 256x256 | 1995.2 | 131.2 |
| `levels/level2/bg_chishui_wasteland_v1.jpg` | 1122x1402 | 1122x1402 | 2893.3 | 529.2 |
| `levels/level2/map_base_chishui_fort_v1.png` | 1254x1254 | 256x256 | 1401.1 | 97.1 |
| `levels/level2/map_spawn_fire_rift_v1.png` | 1254x1254 | 256x256 | 2118.4 | 127.4 |
| `map/map_base_kunlun_seal_v1.png` | 1234x1251 | 253x256 | 2273.3 | 130.5 |
| `map/map_slot_platform_v1.png` | 1185x913 | 256x197 | 1374.4 | 86.0 |
| `map/map_spawn_rift_v1.png` | 1235x1254 | 252x256 | 2256.2 | 133.1 |
| `towers/tower_bifang_v1.png` | 1192x1239 | 246x256 | 1699.6 | 117.9 |
| `towers/tower_fuzhu_v1.png` | 937x1223 | 196x256 | 1073.1 | 85.9 |
| `towers/tower_yinglong_v1.png` | 1192x1140 | 256x245 | 1960.1 | 135.9 |
| `ui/ui_blessing_card_v1.png` | 830x1327 | 830x1327 | 1078.5 | 334.8 |
| `ui/ui_boss_panel_v1.png` | 1527x433 | 1527x433 | 514.1 | 122.3 |
| `ui/ui_boss_paoxiao_panel_v1.png` | 2172x724 | 2172x724 | 1426.5 | 374.3 |
| `ui/ui_build_card_v1.png` | 851x1347 | 851x1347 | 959.2 | 330.0 |
| `ui/ui_defeat_overlay_v1.png` | 1418x979 | 1418x979 | 1419.2 | 422.3 |
| `ui/ui_hud_button_v1.png` | 874x819 | 874x819 | 562.9 | 187.3 |
| `ui/ui_resource_panel_v1.png` | 1377x439 | 1377x439 | 526.3 | 166.2 |
| `ui/ui_victory_overlay_v1.png` | 1448x1050 | 1448x1050 | 1488.3 | 417.7 |

### 驗證狀態

- 資產 / preload / Level1–3 / Renderer / Motion targeted：43/43 PASS。
- JS syntax、50 張圖片 decode、33 張處理後透明 PNG 的 alpha：PASS；自動測試亦檢查 PNG signature / IEND / alpha-capable color type。
- 品質拼圖已比較原圖與新圖；以 ImageMagick `compare -metric RMSE` 對同尺寸完整背景量測，Level1 / Level2 normalized RMSE 為 0.0139847 / 0.0152068；UI / sprite 亦於深、淺底檢視，肉眼未見明顯劣化或白黑邊。
- 本機 no-store 並行讀取 Level1 blocking 組（交替 12 輪中位數）：10 assets / 11.737MiB / 37.3ms → 13 assets / 2.619MiB / 11.9ms；正式手機 wall-clock 仍以 Pages 實測為準。
- 最新 main 的既有基線為 94 tests、87 PASS、7 FAIL（上一輪 UI 測試契約）；本輪不修該 UI scope，要求不得新增第 8 個失敗。
- 本輪加入測試後全套為 95 tests、88 PASS、7 個相同既有 FAIL，未新增失敗。
- GitHub Pages fresh-load blockingMs、第一次塔位點擊與 390 / 390×700 視覺 smoke：待推送部署後驗證。

### 中斷續作

- 若在部署 smoke 前中斷：不要重新壓縮上述 35 張；先跑 targeted tests，再 commit / push，最後於正式 Pages 驗證三關。
- 初始資產 checkpoint：`fc20bb7a3471622c7b4a7a70e3b887d8d711e89c`；review cache-bust 修正待 final commit。

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

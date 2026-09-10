# Level 3 弱水幽谷工作進度

## 原始 Level 3 整合狀態

第三關基礎整合已於 `b4acb3c21a8883bee804581e5a55260284163ce1` 前完成：Level 3 資料、10 Waves、8 塔位、弱水機制、相柳三階段、正式素材、Motion Lite、Renderer/Boss HUD、白澤解鎖、staged loading、390px／390×700 Pages smoke 與圖片完整性 regression 均已有既有驗證紀錄。本輪不重做上述工作。

## 2026-09-10 Level 3 手機實測修正

### 本輪任務

1. Preparation UI 擋住最上方塔位。
2. Level3 enemy path 偏離道路／彎道切角。
3. Level3 W1–W3 過難。
4. 新增 dev-only `?devLevel=3` 快速測試入口。

### 已完成

- Preparation UI：只對 `body[data-level="3"] .wave-control` 設 `pointer-events: none`，並對 Start Wave button 恢復 `pointer-events: auto`。沒有修改 Level1/2 共用 layout、背景或 8 個塔位座標。
- Enemy path：保留既有正式背景校準後的所有 waypoint，僅 Level3 加 `pathSmoothing: 4`；`GameMap` 依 opt-in smoothing 產生較密 runtime path，降低折線在彎道直接切角。Level1/2 未啟用 smoothing，維持原行為。
- W1–W3：只局部降低開局壓力；W1 `水魈×7 / 1.05s`、W2 `水魈×10 / 0.95s`、W3 `水魈×8 + 玄甲獸×2 / 0.95s`。W4 起資料未改。
- dev-only 入口：`?devLevel=3` 可直接以 Level3 建立 Game；對直接進入的非 Level1 關卡補 `renderer.prepareLevel(initialLevelId)`，避免只 preload Level1 素材造成 loading overlay 無法結束。
- `body.dataset.level` 在初始建立時即同步，並於 frame 持續同步，讓 Level3-local UI 規則在 Preparation 首屏即生效。
- GitHub Pages entry cache 已更新：`src/main.js?v=level3-mobilefix-2`；Level3 UI CSS 使用 `styles-fixes.css?v=level3-mobilefix-1`。
- focused regression tests 已對齊本輪數值、path smoothing、cache 與 dev entry preload。

### Root cause

- 最上方塔位：Level3 第一塔位 `(132,61)` 落在 battlefield 上方 absolute `.wave-control` 的 hit area，pointer event 被 DOM 攔截，canvas 收不到該次點擊。
- 彎道切角：`GameMap` 原本只在 waypoint 間做直線 interpolation；即使 waypoint 位於道路中心，較大轉角仍會呈現折線切彎。
- W1–W3：第三關初版 W1/W2/W3 為 `10 / 14 / 10+4`，且水魈在弱水區有速度加成，手機首輪實測開局壓力過高。
- dev entry：原本 `src/main.js` 固定 `new Game()`，且 Renderer/ArtStore 初始只載 Level1 required art；直接建立 Level3 後若未額外 prepare Level3，loading ready 條件無法成立。

### 本輪驗證

- focused Level3 mobile-fix verification：4/4 PASS：
  - runtime path smoothing 會加密路徑且保留全部原 waypoint；未 opt-in 的地圖維持原 waypoint 數量。
  - W1–W3 新組成／interval 與 W4 baseline 符合預期。
  - Level3 Preparation panel pointer pass-through 與 Start Wave button 可互動規則符合預期。
  - `devLevel` 選關、direct-level preload、level marker 與 cache-busted entry 符合預期。
- 更新後 `src/main.js` `node --check`：PASS。
- 依本輪 scope 與節省 token 要求，未重跑先前已完成且未受影響的完整 1–10 關流程／舊整合 smoke。

### 尚需玩家實測

- iPhone Safari 直接開 `?devLevel=3`：確認可直接載入第三關，不需從 Level1/2 重玩。
- Preparation 首屏：確認最上方塔位可點選／建塔，Start Wave 仍正常。
- Level3 實戰：確認敵人在幾個主要彎道不再明顯切角、道路中心視覺貼合。
- W1–W3：確認新開局難度手感；只需從 dev Level3 入口測，不需重跑 Level1/2。

## 未完成

- 工程實作：無。
- 玩家實機驗證：上述 4 項。

## 最新 production checkpoint

- `a7a3f46b764823a3c5fce111d4429199d8604142`（dev entry preload regression；本文件另以 docs commit 保存）

## 狀態

ENGINEERING COMPLETE / PLAYER SMOKE PENDING

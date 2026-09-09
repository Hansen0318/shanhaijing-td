# Loading UX 與道路中心線工作進度

## 本輪任務目標

以最新 `main` 為基線，查明第一、第二關 gameplay anchor 與道路中心線的偏差來源，並沿用既有 ArtStore／`art-loading` 架構補上可見、可退出且不被非首屏素材阻塞的 Loading UX。

## 已完成

- 已同步最新 GitHub `main`，本輪基線為 `e62f86063a6489af6670c25fd1826ad25191cc5d`。
- 已讀取前一輪 COMPLETE 進度與 Git history，未重做已通過的 Motion Lite。
- 已完成 RED → GREEN：failed asset readiness、critical/deferred preload、Loading overlay 契約皆有 focused tests。
- 已沿用 `ArtStore` 與 `art-loading`，加入全畫面「山海異獸載入中…」狀態、輕量 pulse/dots 與 200ms fade out；退出後 `pointer-events: none`。
- failed asset 以 `onerror` 記為 settled，保留既有靜態 fallback，不會永久卡 loading。
- fresh load 必要 preload：當前關背景／Spawn／Base、塔位、三塔、Wave 1 小妖、即時攻擊特效與 HUD／Wave／Context／操作按鈕。
- Level 1 → Level 2 必要 preload：共用首屏素材加赤水背景／Spawn／Base；Wave 2 後敵人、Boss、Boss VFX、Blessing／結果面板改為 ready 後背景載入。
- 已疊加正式背景與 logical waypoints 診斷兩關：第一關與目前第二關 path centerline 均貼近道路中央，未再修改 waypoint。
- 已確認 enemy gameplay anchor 與 render translate 共用相同 X；Motion Lite enemy `xOffset` 固定為 0，bob 僅作用 Y。
- 已量測不同 enemy PNG 的透明邊界與 alpha centroid；換算現有 36–50px render box 後水平視覺重心差約 0–2px，不足以造成截圖中的大幅偏移。
- 已完成 390×700 正式 Pages smoke：Canvas 368×424、Context Panel bottom 688／viewport 696、無水平溢出、loader 結束後不攔截操作。
- 已完成第一關 Wave 1 與第二關 Wave 8、1×／2× smoke；兩關 Canvas 尺寸一致，應用程式 runtime error 0。

## 進行中

- 無。

## 未完成

- 無工程項目；僅待玩家在 iPhone 慢速／fresh cache 環境確認 Loading 顯示時間與道路視覺體感。

## 已修改檔案

- `docs/WORK_PROGRESS.md`
- `index.html`
- `styles-fixes.css`
- `src/config/artAssets.js`
- `src/main.js`
- `src/render/Renderer.js`
- `src/ui/UIController.js`
- `tests/art-assets.test.js`
- `tests/ui-legibility.test.js`

## 已執行測試與結果

- Loading／preload／path／Motion focused tests：33/33 PASS（production 前先確認 3 項 RED）。
- `npm test`：81/81 PASS。
- 全 JS/MJS `node --check`：PASS。
- `git diff --check`：PASS。
- 正式 GitHub Pages browser smoke：390×700、Level 1 Wave 1、Level 2 transition／Wave 8、1×／2×、runtime error 0；PASS。

## 尚未執行測試

- 未完整人工重跑 Wave 1–10（依本輪最小驗證約束）。

## Root cause

- Loading 黑屏：原本 `art-loading` 只有純色 pseudo-element，沒有任何狀態文字；同時 `LEVEL_ART_IDS` 把非首屏 Boss、Boss VFX 與結果 UI 全部納入 ready 條件。
- 道路觀感：最新兩關 gameplay centerline 與背景道路一致，Motion 不改 X；畫面中密集敵人使用相同 path centerline 並互相疊圖，sprite 外緣會超出道路，但 anchor 並未水平漂移，因此本輪不再移動 waypoint。

## 最新 commit SHA

- Loading／preload implementation baseline：`f1c82670996ce0d9f371f4209a18c4bda40f5fe9`

## 下一步從哪裡接

等待玩家以 iPhone fresh cache 或較慢網路確認 Loading 顯示與淡出體感；若仍認為敵群錯位，下一步應先顯示單一 enemy anchor debug，而不是再次整段搬動 waypoint。

## 尚未解決問題及原因

- 無工程 blocker。

## 狀態

COMPLETE

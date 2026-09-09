# Motion Lite 工作進度

## 本輪任務目標

以可快速關閉的純渲染 Motion Lite，改善赤羽妖、岩甲妖、畢方、應龍與狍鴞的視覺動態，不改任何 gameplay 數值、座標或判定。

## 已完成項目

- 已確認 GitHub `main` 最新基線為 `d4ff6bf4c2021533fdece5f94816f6045a45d56d`，本地工作樹內容與該基線一致。
- 已建立隔離分支 `feature/motion-lite`。
- 已執行基線 `npm test`：69/69 通過。
- 已新增 `tests/motion.test.js`；RED 階段 5 項中 4 項依預期失敗，證明 bob、hit/death、recoil 與吞噬 scale 尚未實作；靜態回退既有行為測試通過。
- 已新增集中式 `ENABLE_UNIT_MOTION` 與 Motion Lite config。
- 已完成赤羽妖／岩甲妖 bob、90ms hit flash、180ms／220ms death shrink + fade。
- 已完成畢方／應龍 idle scale 與 90ms render-only recoil；Beam 起點維持 gameplay tower 座標。
- 已完成狍鴞 idle scale 與吞噬短暫 scale；既有吞噬 HP／threshold 結果未變。
- Motion Lite focused tests 5/5、相關 combat/game/renderer/level2 regression 38/38 通過。
- 全 `src/`、`tests/` JS/MJS syntax 與 `git diff --check` 通過。
- 正式 Pages smoke 發現舊模組 URL 快取仍載入前版；已為本輪入口與新動畫模組加入 `motion-lite-1` 版本參數，避免玩家取得混合版本。
- 資源版本修正後 focused regression 21/21、全 JS/MJS syntax 與 `git diff --check` 通過。
- 已完成正式 GitHub Pages 最小 smoke：390px 與 390×700px、1×／2×、第二關混合 Wave、狍鴞 70%／40% 吞噬流程皆正常，沒有遊戲 runtime error。
- 390×700 下 Canvas 為 368×424，Context Panel 底緣 688px、viewport 696px，操作區完整可見且無水平溢出。
- 最終 `npm test`：74/74 PASS；全 `src/`、`tests/` JS/MJS syntax 與 `git diff --check` PASS。

## 尚未完成項目

- 無；僅待玩家實機確認 Motion Lite 動畫體感。

## 已修改檔案

- `docs/WORK_PROGRESS.md`
- `tests/motion.test.js`
- `src/config/motionData.js`
- `src/systems/MotionSystem.js`
- `src/entities/Enemy.js`
- `src/core/Game.js`
- `src/render/Renderer.js`
- `tests/game.test.js`
- `index.html`
- `src/main.js`
- `tests/browser-smoke.html`

## 已執行測試與結果

- `npm test`：69/69 PASS（修改前基線）。
- `node --test tests/motion.test.js`：RED 已確認（1 PASS／4 項預期 FAIL）。
- `node --test tests/motion.test.js`：5/5 PASS（GREEN）。
- Motion Lite + combat/game/renderer/level2 focused regression：38/38 PASS。
- 全 `src/`、`tests/` JS/MJS syntax：PASS。
- 資源版本修正後 Motion/Game/Renderer focused regression：21/21 PASS。
- 最終 `npm test`：74/74 PASS。
- 全 `src/`、`tests/` JS/MJS syntax：PASS。
- `git diff --check`：PASS。
- 正式 GitHub Pages browser smoke：390px、390×700px、1×／2×、第二關 Wave 8、第二關 Wave 10、狍鴞 70%／40% 吞噬均 PASS；遊戲 runtime error 0。

## 尚未執行測試

- 無。

## 最新 commit SHA

- 已驗證 GitHub `main` Motion Lite baseline：`fbb499d3fcf749c686d9a32082d3f9dc5f7d5e8e`

## 下一步應從哪裡開始

等待玩家在 iPhone 實機確認 bob、hit flash、death fade、塔 recoil 與狍鴞吞噬 scale 的體感，再決定是否保留預設開啟或微調集中式參數。

## 尚未解決問題及原因

- 無工程 blocker；動畫舒適度仍需玩家實機主觀確認。

## 狀態

COMPLETE

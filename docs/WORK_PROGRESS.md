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

## 尚未完成項目

- 1×／2×、390px／390×700 browser smoke。
- 分階段 push main 與最終 COMPLETE 標記。

## 已修改檔案

- `docs/WORK_PROGRESS.md`
- `tests/motion.test.js`
- `src/config/motionData.js`
- `src/systems/MotionSystem.js`
- `src/entities/Enemy.js`
- `src/core/Game.js`
- `src/render/Renderer.js`
- `tests/game.test.js`

## 已執行測試與結果

- `npm test`：69/69 PASS（修改前基線）。
- `node --test tests/motion.test.js`：RED 已確認（1 PASS／4 項預期 FAIL）。
- `node --test tests/motion.test.js`：5/5 PASS（GREEN）。
- Motion Lite + combat/game/renderer/level2 focused regression：38/38 PASS。
- 全 `src/`、`tests/` JS/MJS syntax：PASS。

## 尚未執行測試

- 正式 GitHub Pages browser smoke。

## 最新 commit SHA

- GitHub `main`：`d4ff6bf4c2021533fdece5f94816f6045a45d56d`

## 下一步應從哪裡開始

將 production implementation 與測試 checkpoint 推送 main，等待 GitHub Pages 更新後執行指定 browser smoke。

## 尚未解決問題及原因

- 無；尚在正常 TDD 實作階段。

## 狀態

IN_PROGRESS

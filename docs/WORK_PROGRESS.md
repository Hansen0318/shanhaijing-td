# Motion Lite 工作進度

## 本輪任務目標

以可快速關閉的純渲染 Motion Lite，改善赤羽妖、岩甲妖、畢方、應龍與狍鴞的視覺動態，不改任何 gameplay 數值、座標或判定。

## 已完成項目

- 已確認 GitHub `main` 最新基線為 `d4ff6bf4c2021533fdece5f94816f6045a45d56d`，本地工作樹內容與該基線一致。
- 已建立隔離分支 `feature/motion-lite`。
- 已執行基線 `npm test`：69/69 通過。

## 尚未完成項目

- Motion Lite 最小 failing tests。
- 集中式 `ENABLE_UNIT_MOTION` 與 motion config。
- 赤羽妖、岩甲妖、畢方、應龍與狍鴞指定動畫。
- focused tests、JS/MJS syntax、1×／2×、390px／390×700 browser smoke。
- 分階段 push main 與最終 COMPLETE 標記。

## 已修改檔案

- `docs/WORK_PROGRESS.md`

## 已執行測試與結果

- `npm test`：69/69 PASS（修改前基線）。

## 尚未執行測試

- Motion Lite focused tests。
- 全 JS/MJS syntax check。
- 正式 GitHub Pages browser smoke。

## 最新 commit SHA

- GitHub `main`：`d4ff6bf4c2021533fdece5f94816f6045a45d56d`

## 下一步應從哪裡開始

新增 `tests/motion.test.js`，先驗證 motion 關閉、座標隔離、攻擊起點與狍鴞吞噬邏輯，確認 RED 後再寫 production code。

## 尚未解決問題及原因

- 無；尚在正常 TDD 實作階段。

## 狀態

IN_PROGRESS

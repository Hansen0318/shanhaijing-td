# Motion Lite 第二輪工作進度

## 本輪任務目標

將 Motion Lite 正式擴充至小妖、疾妖、巨妖、窮奇與夫諸，並以實際 gameplay anchor、sprite anchor 與背景道路為依據修正第一、第二關道路錯位，不改 gameplay 數值、塔位或關卡平衡。

## 已完成項目

- 已同步 GitHub `main`，本輪基線為 `2c6eced68fd6bba127c2435b6e434b397fb3c4a9`。
- 已讀取上一輪 `docs/WORK_PROGRESS.md` 與 Git history，未重做已通過的 Motion Lite 第一輪。
- 已執行基線 `npm test`：74/74 PASS。
- 已檢查 Renderer transform：現有 Motion bob 的 `xOffset` 固定為 0，gameplay `x/y/pathDistance` 與 visual transform 分離。
- 已量測正式 PNG 透明邊界；各素材左右透明邊界接近對稱，尚無證據顯示圖片尺寸造成明顯水平偏移。
- 初次合併式基線命令遭環境網路審核中止；拆分為純本地命令後正常，未造成檔案變更。
- 已用正式背景 crop 疊加 gameplay path 診斷：第一關中心線正常；第二關舊 waypoints 在上、下兩個回彎直接切過道路外側，確認 root cause 為第二關 path data。
- 已完成 RED：道路中心測試與小妖／疾妖／巨妖／窮奇／夫諸 Motion 測試共 5 項依預期失敗。
- 已完成第二關 waypoint 最小修正；未修改第一關 path、背景或任何 tower slot。
- 已將 Motion Lite 擴充至小妖、疾妖、巨妖、窮奇與夫諸；窮奇 frenzy pulse 共用既有 pulse helper。
- focused Motion／path／Game／Renderer regression：38/38 PASS。
- 已將瀏覽器入口與 Motion 模組版本更新為 `motion-lite-2`，避免 Pages 混用第一輪快取。
- 版本更新後 focused regression 38/38、全 JS/MJS syntax 與 `git diff --check` PASS。
- 最終 `npm test`：81/81 PASS；全 JS/MJS syntax、`git diff --check` PASS。
- 正式 GitHub Pages smoke 已完成：390px、390×700px、1×／2×、第一關 Wave 8、窮奇 Wave 10／50% 狂暴、第二關 Wave 8／Wave 10／狍鴞吞噬均正常，runtime error 0。
- 正式頁目視確認第二關敵人沿修正後道路中心線行走；Canvas 在 390×700 為 368×424，Context Panel 完整可見且無水平溢出。
- Motion Lite 為正式預設；不提供玩家 UI，集中式 config 與靜態 fallback 保留。

## 尚未完成項目

- 無；僅待玩家手機實機確認新增單位動畫體感與第二關道路貼合度。

## 已修改檔案

- `docs/WORK_PROGRESS.md`
- `src/config/gameData.js`
- `src/config/motionData.js`
- `src/core/Game.js`
- `src/systems/MotionSystem.js`
- `tests/level2.test.js`
- `tests/motion.test.js`
- `tests/renderer-art.test.js`
- `index.html`
- `src/main.js`
- `src/entities/Enemy.js`
- `src/render/Renderer.js`
- `tests/browser-smoke.html`

## 已執行測試與結果

- `npm test`：74/74 PASS（修改前基線）。
- 正式素材透明邊界診斷：PASS；未發現足以解釋明顯水平錯位的不對稱透明留白。
- Motion／path RED：15 PASS／5 項預期 FAIL。
- focused Motion／path／Game／Renderer regression：38/38 PASS。
- 資源版本更新後 focused regression：38/38 PASS。
- 全 JS/MJS syntax、`git diff --check`：PASS。
- 最終 `npm test`：81/81 PASS。
- 正式 GitHub Pages browser smoke：PASS；390px、390×700px、1×／2×、第一關 Wave 8／10、第二關 Wave 8／10，runtime error 0。

## 尚未執行測試

- 無。

## 最新 commit SHA

- GitHub `main` 基線：`2c6eced68fd6bba127c2435b6e434b397fb3c4a9`
- 已驗證 Motion Lite 第二輪程式 baseline：`aa59e81007666a6ab854a825b93230d63599e718`

## 下一步應從哪裡開始

等待玩家以 iPhone 實機確認小妖／疾妖／巨妖／窮奇／夫諸動畫體感，以及第二關各回彎道路貼合度。

## 尚未解決問題及原因

- 無工程 blocker；僅剩玩家實機主觀確認。

## 狀態

COMPLETE

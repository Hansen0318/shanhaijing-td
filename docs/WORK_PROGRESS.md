# Level 3 弱水幽谷工作進度

## 本輪任務目標

在最新 `main` 基線上，以既有 data-driven 關卡、Motion Lite 與 staged loading 架構整合第三關最小可測版。

## 已完成

- 已確認第三關壓縮包含 12 張完整素材及建置指令。
- 已建立隔離工作區 `feature/level3-ruoshui`，基線為 `2dbd7ee`。
- 基線 `npm test`：81/81 PASS。
- 已確認素材副檔名雖為 `.png`，實際內容為 JPEG；背景保持不透明，其餘需轉為真正 PNG 並做邊界式去背。
- 已建立實作計畫 `docs/superpowers/plans/2026-09-10-level3-ruoshui.md`。
- 已完成 Level 3 資料、10 Waves、8 塔位、Level 2→3 清空重置與白澤解鎖紀錄。
- 已完成弱水區 data-driven 判定：一般敵人 0.85×、水魈 1.35×、玄甲獸緩速效果減半。
- 已完成相柳 75% 回 6%、50% 回 8%、25% 速度 1.20×，各階段僅觸發一次。
- 已將 12 張來源素材轉為真正 PNG；非背景素材採邊界式去背，保留白澤內部白色細節。
- 已完成第三關 critical/deferred preload、共用 Motion Lite、Renderer、Boss HUD、結果解鎖 UI。
- 已用正式背景疊加 waypoint 與塔位中心診斷，修正第三關道路中心線與 8 個圓台座標。
- 已將入口與所有變更模組快取版本統一為 `level3-1`，避免 GitHub Pages 載入舊版。
- 已擴充 browser smoke helper，可直接驗證第三關混合 Wave、相柳三階段與白澤解鎖，不需完整重跑 10 Waves。
- 正式 Pages smoke 發現第三關背景僅顯示頂部；已確認為大型 binary 經 GitHub 寫入介面時遭截斷，非 Canvas crop 或 waypoint。
- 已將背景裁切為實際 390×610 並壓縮為完整 JPG；其餘 11 張素材依實際顯示尺寸縮圖並重新輸出完整透明 PNG，單檔皆低於 700KB。
- 已新增檔頭、IEND／EOI 與部署大小 regression，防止不完整圖片再次進入正式站。
- 正式 Pages 已完成第三關 390px／390×700、Wave 8、1×／2×、相柳三階段、勝利與白澤解鎖 smoke。

## 進行中

- 無。

## 未完成

- 無。

## 已修改檔案

- `docs/WORK_PROGRESS.md`
- `docs/superpowers/plans/2026-09-10-level3-ruoshui.md`
- `assets/levels/level3/*`
- `assets/enemies/enemy_shuixiao_v1.png`
- `assets/enemies/enemy_xuanjiashou_v1.png`
- `assets/bosses/boss_xiangliu_v1.png`
- `assets/effects/fx_water_*_v1.png`
- `assets/effects/fx_whirlpool_v1.png`
- `assets/ui/ui_boss_xiangliu_panel_v1.png`
- `assets/ui/unlock_baize_v1.png`
- `src/config/artAssets.js`
- `src/config/gameData.js`
- `src/config/motionData.js`
- `src/core/Game.js`
- `src/entities/Enemy.js`
- `src/map/GameMap.js`
- `src/render/Renderer.js`
- `src/systems/BossSystem.js`
- `src/systems/MotionSystem.js`
- `src/systems/StatusSystem.js`
- `src/ui/UIController.js`
- `styles-fixes.css`
- `tests/art-assets.test.js`
- `tests/game.test.js`
- `tests/level2.test.js`
- `tests/level3.test.js`
- `tests/motion.test.js`
- `tests/renderer-art.test.js`
- `tests/ui-art.test.js`
- `tests/ui-contract.test.js`
- `tests/browser-smoke.html`
- `index.html`
- `src/main.js`

## 已執行測試與結果

- `npm test`：81/81 PASS（基線）。
- Level 3 data/mechanics/path focused tests：6/6 PASS（production 前已確認 RED）。
- Art/Motion/Renderer/UI focused tests：44/44 PASS（production 前已確認 6 項 RED）。
- `npm test`：89/89 PASS（第一個可玩 checkpoint）。
- 全 JS/MJS `node --check`：PASS。
- `git diff --check`：PASS。
- Cache-version focused test：6/6 PASS（production 前已確認 RED）。
- `npm test`：90/90 PASS（快取版本與 smoke helper 完成後）。
- 圖片完整性／大小 tests：11/11 PASS（修正前已重現 truncated PNG 與背景過大）。
- `npm test`：91/91 PASS（圖片完整性修正後）。
- 全部第三關圖片以 ImageMagick decode：PASS。
- 正式 Pages fresh load／Level 2→3：loading feedback 正常顯示，必要素材 ready 後正常淡出。
- 正式 Pages 390px／390×700：PASS；390×700 Canvas 為 368×424。
- 正式 Pages 第三關 Wave 8 混合敵人：PASS。
- 正式 Pages 1×／2× 切換：PASS。
- 正式 Pages 相柳 75%／50%／25%：PASS；三階段 Banner 與 HP 變化正常。
- 正式 Pages Victory：PASS；顯示「新異獸解鎖：白澤」。
- 遊戲頁來源 runtime error：0（瀏覽器測試擴充本身的 metadata 訊息不屬於遊戲來源）。

## 尚未執行測試

- 無。

## Root cause / 已知問題

- 無工程 blocker；未指定的初版數值與 wave 組成已沿用第二關曲線建立最小可測版。
- 正式背景只顯示頂部的 root cause：大型 binary 上傳內容遭截斷；已改為符合實際渲染尺寸的部署資產並加入完整性測試。

## 最新 commit SHA

- `00db793bbf727e972cbb279f094cb070afc57060`（最終 production checkpoint；COMPLETE 紀錄另以 docs commit 保存）

## 下一步從哪裡接

第三關建置已完成；後續只需玩家在實機確認初版平衡手感、弱水速度辨識度與道路視覺貼合。

## 狀態

COMPLETE

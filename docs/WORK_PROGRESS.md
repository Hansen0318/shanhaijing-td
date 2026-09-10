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

## 進行中

- 第一個可玩 checkpoint commit/push，接著執行手機 browser smoke。

## 未完成

- 手機 browser smoke、正式 Pages 驗證與推送 main。

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

## 已執行測試與結果

- `npm test`：81/81 PASS（基線）。
- Level 3 data/mechanics/path focused tests：6/6 PASS（production 前已確認 RED）。
- Art/Motion/Renderer/UI focused tests：44/44 PASS（production 前已確認 6 項 RED）。
- `npm test`：89/89 PASS（第一個可玩 checkpoint）。
- 全 JS/MJS `node --check`：PASS。
- `git diff --check`：PASS。

## 尚未執行測試

- 390px／390×700 browser smoke。

## Root cause / 已知問題

- 無工程 blocker；未指定的初版數值與 wave 組成將沿用第二關曲線建立最小可測版。
- 素材內容格式與副檔名不一致，整合前需確實轉檔。

## 最新 commit SHA

- `2dbd7ee`

## 下一步從哪裡接

先跑完整 regression 與 syntax；通過後 commit/push checkpoint，再做手機 browser smoke。

## 狀態

IN_PROGRESS

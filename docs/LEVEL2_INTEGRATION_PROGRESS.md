# 第2關・赤水荒原整合進度

## 已完成

- Data-driven Level 1 / Level 2 設定與明確的玩家確認轉場。
- 第二關重置 HP、Gold、Towers、Blessings、Wave 與暫態資料。
- 赤水荒原地圖、道路、Spawn、赤水古寨與 8 個固定塔位。
- 赤羽妖、岩甲妖及岩甲 65% 普通傷害規則。
- 10 Waves 與 Wave 10 狍鴞 5400 HP。
- 狍鴞 70%／40% 各一次吞噬，每次回復 8% Max HP。
- 11 張第二關素材、關卡專用載入、敵人／Boss／特效／Boss HUD 渲染。
- 第一關 Victory 的「前往第2關」與「再次挑戰」；第二關沒有第3關按鈕。
- 第二關 smoke state injection：入口、Wave 8、Wave 10、兩段吞噬、Victory。
- `npm test` 66/66、全 JS/MJS syntax、`git diff --check` 通過。
- 正式 GitHub Pages 390px 與 390×700 smoke 通過：Canvas 分別為 `368×475`、`368×440`，無頁面溢出或遊戲 runtime error。
- Wave 10 注入確認只有 1 隻狍鴞且 queue 無重複 Boss；Boss HUD 顯示 `狍鴞`／`5400 HP`。
- 70% 吞噬後 HP 為 `4212 / 5400`；40% 吞噬後為 `2592 / 5400`；第二關 Victory 正常且無第3關按鈕。

## 未完成

- 玩家實機 iPhone 對道路中心、7+1 塔位視覺對齊與戰鬥辨識度的最終確認。
- 第二關完整正常遊玩平衡驗證（本輪依指令不人工重跑 Wave 1–10）。

## 主要修改檔案

- `assets/levels/level2/`
- `assets/enemies/enemy_chiyu_v1.png`
- `assets/enemies/enemy_yanjia_v1.png`
- `assets/bosses/boss_paoxiao_v1.png`
- `assets/effects/fx_paoxiao_*.png`
- `assets/ui/ui_boss_paoxiao_panel_v1.png`
- `src/config/gameData.js`
- `src/config/artAssets.js`
- `src/core/Game.js`
- `src/systems/BossSystem.js`
- `src/systems/CombatSystem.js`
- `src/render/Renderer.js`
- `src/ui/UIController.js`
- `tests/level2.test.js`
- `tests/browser-smoke.html`

## 目前 commit SHA

- 第二關功能 baseline 已推送至 GitHub `main`：`48261627b0d4206cb355c1cfb405170b439c5119`

## 下一步

在正式 GitHub Pages 使用 iPhone 實玩第二關；只針對可重現的視覺、路徑或平衡問題進行下一輪修正，不開始第3關。

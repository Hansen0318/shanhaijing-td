# 第2關・赤水荒原設計規格

## 目標

在不改動第一關既有平衡與美術的前提下，加入可由第一關 Victory 結算畫面主動進入的第二關。第二關沿用三種異獸塔、Gold、Blessing、Pause 與統一時間倍率，但擁有獨立地圖、Wave、敵人、Boss 與正式素材。

## 關卡與流程

- 第1關：崑崙山門；Base 山海關；Boss 窮奇。
- 第2關：赤水荒原；Base 赤水古寨；Boss 狍鴞。
- 第一關 Victory 顯示「前往第2關」與「再次挑戰」，由玩家選擇，不自動跳關。
- 進入第二關以及重試第二關時，Base HP、Gold、Towers、Blessings、Wave、投射物、狀態與統計全部重新建立。
- 第二關 Victory 只顯示再次挑戰，不顯示不存在的第3關。
- 重新整理網頁仍由第一關開始，不加入永久存檔或選關畫面。

## Data-driven 結構

`src/config/gameData.js` 保留共享塔與 Blessing，新增 `LEVELS` 關卡表。每關包含 `id`、`name`、`baseName`、`bossType`、`map`、`waves` 與關卡素材 id；舊的 `LEVEL_DATA`、`MAP_DATA`、`WAVE_DATA` 維持為第一關相容匯出，避免破壞已鎖定測試。

`Game` 持有 `levelId` 與 `level`，所有 Map、Wave、敵人 HP scaling、Boss 結算和 UI 都讀取當前關卡資料。`restart()` 重開當前關卡；`enterLevel(2)` 只允許從第一關 Victory 進入。

## 第二關內容

- 赤羽妖：HP 34、Speed 108、Base Damage 1、Reward 9。
- 岩甲妖：HP 170、Speed 28、Base Damage 2、Reward 20；塔的直接／範圍／穿透普通傷害乘 0.65，單次最低 1；灼燒 DOT 不列入普通傷害。
- 狍鴞：Base HP 3600、Speed 19、Base Damage 20；Wave 10 Boss HP multiplier 1.5，有效 Max HP 5400。
- 狍鴞首次低於 70% 與首次低於 40% 時，各回復 Max HP 8%，各只觸發一次，顯示「狍鴞吞噬妖氣！」。
- 窮奇原本 50% 狂暴與 Victory gate 保持不變。
- 狍鴞素材只提供視覺 feedback：70% 使用吞噬光效、火球與爆炸；40% 使用吞噬光效與地裂。上述效果不造成額外傷害或狀態。

## 第二關 Wave

| Wave | 配置 | HP multiplier |
|---|---|---:|
| 1 | 小妖×10 | 1.00 |
| 2 | 赤羽妖×12 | 1.00 |
| 3 | 小妖×8＋赤羽妖×10 | 1.05 |
| 4 | 岩甲妖×6 | 1.10 |
| 5 | 疾妖×8＋岩甲妖×6 | 1.15 |
| 6 | 赤羽妖×20＋小妖×8 | 1.25 |
| 7 | 岩甲妖×8＋巨妖×5 | 1.35 |
| 8 | 赤羽妖×16＋疾妖×10＋岩甲妖×6 | 1.50 |
| 9 | 小妖×12＋赤羽妖×18＋岩甲妖×8＋巨妖×4 | 1.70 |
| 10 | 赤羽妖×10＋岩甲妖×4＋狍鴞×1 | 1.55；Boss 1.50 |

Wave spawn interval 使用 1.0、0.82、0.78、1.05、0.88、0.62、0.92、0.60、0.56、0.90 秒，僅屬第二關第一版資料，不回頭調整第一關。

## 地圖與正式素材

- Canvas 邏輯尺寸保持 390×610，手機固定 Battlefield／Context Panel 架構不變。
- 第二關背景以 `{x:70,y:0,width:897,height:1402}` 等比例裁切到 Canvas；不拉伸背景。
- 7 個塔位對齊背景圓形標記，約為 `(26,115)`、`(248,111)`、`(139,190)`、`(340,254)`、`(139,307)`、`(346,401)`、`(214,474)`；第8個平台置於道路旁空地 `(92,487)`。
- 第二關 waypoint 沿背景米色道路中心線，入口由左上、終點由右下離場；Spawn 與 Base props 對齊相同端點。
- 塔位 hit point、塔 sprite 中心與射程圈中心共用同一座標。
- 敵人與 Boss 保持直立，只依行進方向水平翻轉；Boss 火球可旋轉。
- 第二關素材採關卡式 lazy preload；載入完成前沿用現有 `art-loading` gate，不能露出第一關背景、Graybox 或 Emoji fallback。

## 驗證

不人工完整跑兩關 Wave 1–10。以 unit/system tests 驗證關卡資料、切換重置、岩甲減傷、狍鴞兩段回血與 Victory；用 browser state injection 驗證第一關 Victory 入口、第二關 8 塔位、Wave 10 Boss、390px 與 390×700px layout、動態 Boss HUD 與無 runtime error。


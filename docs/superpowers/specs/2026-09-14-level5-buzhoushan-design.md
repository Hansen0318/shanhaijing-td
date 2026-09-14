# 第 5 關・不周山墟設計規格

## 目標與範圍

在現有 data-driven 關卡、4 選 3 編隊、Blessing、Canvas Renderer、Boss HUD 與 staged preload 架構上新增第 5 關「不周山墟」。Level 5 使用畢方／夫諸／應龍／白澤 4 選 3，不新增第五隻可部署異獸，也不重做或重平衡 Level 1–4。

`LEVEL5_FINAL_GAMEPLAY_SPEC.md` 是 gameplay 數值與判定的唯一依據。本設計只補足現有程式邊界、背景實圖量測結果與不影響 gameplay 的視覺整合方式。

## 玩家流程與共用編隊

Level 4 勝利後可前往 Level 5，先進入空白 4 選 3 編隊。Level 5 勝敗後 Retry 同樣清空陣容並回到編隊；確認三隻後才進入無限時間 Preparation。Blessing 池沿用 Level 4 規則，依 `lineupSelection` 過濾，沒有新 Blessing。

既有 `LineupSystem` 改為 Level 4–5 共用；保留 `LEVEL4_ROSTER` 相容別名，避免既有測試與模組被無關重寫。Level 1–3 仍固定畢方／夫諸／應龍。

## 關卡資料與實圖量測

背景 982×1536 與遊戲 390×610 比例一致，runtime 直接縮為 390×610，不裁切。道路從左上 Spawn 通往右下 Base。以下座標均由最終 390×610 背景實圖量測：

```js
waypoints: [
  { x: -20, y: 18 }, { x: 15, y: 20 }, { x: 35, y: 32 }, { x: 48, y: 48 },
  { x: 54, y: 65 }, { x: 67, y: 80 }, { x: 90, y: 91 }, { x: 120, y: 97 },
  { x: 155, y: 101 }, { x: 190, y: 106 }, { x: 225, y: 111 }, { x: 258, y: 120 },
  { x: 288, y: 134 }, { x: 310, y: 150 }, { x: 323, y: 170 }, { x: 325, y: 192 },
  { x: 318, y: 213 }, { x: 303, y: 231 }, { x: 281, y: 244 }, { x: 253, y: 255 },
  { x: 221, y: 263 }, { x: 186, y: 269 }, { x: 153, y: 278 }, { x: 122, y: 290 },
  { x: 98, y: 305 }, { x: 83, y: 323 }, { x: 80, y: 342 }, { x: 89, y: 357 },
  { x: 107, y: 370 }, { x: 132, y: 379 }, { x: 162, y: 384 }, { x: 195, y: 389 },
  { x: 229, y: 397 }, { x: 261, y: 405 }, { x: 287, y: 418 }, { x: 305, y: 435 },
  { x: 315, y: 455 }, { x: 313, y: 475 }, { x: 305, y: 492 }, { x: 290, y: 508 },
  { x: 275, y: 523 }, { x: 269, y: 540 }, { x: 273, y: 555 }, { x: 286, y: 570 },
  { x: 307, y: 582 }, { x: 334, y: 587 }, { x: 365, y: 584 }, { x: 410, y: 570 },
],
slots: [
  { x: 119, y: 68 }, { x: 99, y: 119 }, { x: 265, y: 150 }, { x: 315, y: 198 },
  { x: 105, y: 280 }, { x: 146, y: 305 }, { x: 271, y: 421 }, { x: 229, y: 518 },
],
chargeCorridor: { x: 100, y: 360, width: 195, height: 66 },
```

Spawn artwork anchor 為 `{ x: 18, y: 20 }`，Base artwork anchor 為 `{ x: 360, y: 574 }`。`chargeCorridor` 覆蓋中下段由左往右的長直線；朱厭第一次進入該區時啟動 telegraph，離開或再次進入都不重觸發。

## Waves 與敵人

十波組成、interval、普通敵 HP multiplier 與 W10 spawn 順序完全照 `LEVEL5_FINAL_GAMEPLAY_SPEC.md`。朱厭為 85 HP／84 speed／1 Base Damage／13 reward／12 radius；狸力為 320 HP／27 speed／3 Base Damage／27 reward／18 radius；刑天基礎 5800 HP，W10 `bossHpMultiplier=1.15` 得 6670 HP，speed 16／20 Base Damage／0 reward／29 radius。

朱厭把一次性 charge 狀態保存在 enemy instance。telegraph 0.2 秒仍以正常速度前進；接著 0.6 秒移動倍率 1.65。倍率在現有 slow 計算之後相乘，因此夫諸 slow 仍有效。

狸力出生時只有一層 `earthArmor`. Damage pipeline 明確傳入 `damageKind`：單體 direct hit 的原始單擊傷害達 30 才破甲；該擊先算洞察／其他增幅，再乘 0.45，並產生一次 armor-break event。AoE 與 DoT 正常傷害，不觸發、不消耗也不套用土甲減傷。

## 刑天 Boss

`BossSystem` 依 enemy type 分派九尾狐與刑天，不建立新通用技能引擎。

P1 初始化 shield timer 5.5 秒；啟動 1.2 秒、所有傷害乘 0.65，slow／insight 不受影響。HP 進入 50% 以下時只轉換一次到 P2，立即取消 active shield，speed multiplier 設為 1.15。

P2 初始化 earthquake timer 4.8 秒。到時先產生 0.45 秒 windup；release 時以刑天當前座標為中心播放 95px VFX，找半徑內最近一座塔並設 `stunRemaining=1.0`。沒有塔仍播放 VFX。stun 期間該塔的攻擊與 cooldown progression 暫停；建造、升級、出售不受影響。之後每 4.8 秒重複。

W10 完成且刑天死亡才 Victory。刑天死亡不會在 wave queue／其他 W10 敵人尚未清空時提前結算；此延後判定只套用 Level 5，Level 1–4 既有結算不變。

## UI、素材與載入

16 張 source art 全部轉為 runtime asset：背景與關卡預覽可為實底；Spawn、Base、敵人、Boss、VFX、Boss HUD、Banner、Warning 必須去白底、裁透明邊與依手機顯示尺寸縮圖。不得把副檔名為 PNG、實際內容為 JPEG 的 source 檔直接上線。

Level 5 編隊畫面沿用既有 lineup overlay，動態顯示 Level 5 Banner 與關卡預覽。Wave preview 使用朱厭／狸力／刑天 P1。W10 開始時既有 banner 顯示 Boss Warning 圖；刑天 spawn 時仍顯示程式化 `Boss現身：刑天`。

Boss HUD 使用空槽框；`BOSS_HUD_GEOMETRY.xingtian` 由 runtime panel 的空槽內緣量測，名稱、HP fill 與數字仍由程式渲染。滿血、50%、25% 均不得越框或遮名稱。

Level 5 required preload 限於 slot、背景、Spawn、Base、四張 lineup/build 塔圖、第一波朱厭、Level 5 Banner 與預覽。狸力、刑天兩階段、Boss panel、Warning 與 VFX deferred，但必須在首次使用前完成預載。

## Renderer 與視覺事件

Renderer 新增朱厭、狸力、刑天兩階段與四種 VFX 的既有 Canvas draw path。Charge telegraph／charge、armor break、shield、phase transition、earthquake 都是結構化 effect；visual duration 與顯示尺寸可依手機辨識度調整，但不改 gameplay timer、radius 或判定。

`?devLevel=5` 進入空編隊；`?devLevel=5&devPath=1` 顯示 runtime path、anchors、charge corridor 與 logical center；`?devLevel=5&devWave=10` 建立 W10；`?devLevel=5&devBossPhase=1|2` 建立刑天對應階段。正式網址不顯示 debug。

## 測試與驗收

先寫並確認失敗的 Level 5 測試，再做最小實作。測試覆蓋 Level 5 data／waves／geometry／4 選 3／Blessing 過濾、朱厭一次性 charge 與 slow 共存、狸力 raw direct threshold／運算順序／AoE／DoT、刑天 P1 cadence／減傷／轉階取消盾、P2 earthquake windup／最近單塔／無塔／stun cooldown 暫停，以及 W10 刑天未死或 wave 未完成不得勝利。

素材測試覆蓋 16 個引用、decode、alpha、尺寸與容量；UI／Renderer 測試覆蓋 preview、Banner、Warning、Boss HUD geometry、P1/P2 sprite 與 VFX。Level 4 浮點失敗只把嚴格相等改為容差斷言，不改 production gameplay。

Fresh verification：`npm test`、`npm run check`、JS syntax、`git diff --check`，以及本機瀏覽器 390px 與 390×700 Level 5 smoke。若共用 Renderer／HUD／asset pipeline 有改動，只補受影響的 Level 1–4 targeted smoke，不完整重跑每關十波。


# Shanhaijing TD Asset Integration Guide

本文件是本專案所有圖片素材的長期整合規範。任何新增／替換／重新定位圖片的 Work、Chat 或 Codex 任務都應先遵守此文件；任務 prompt 只寫本輪差異，不重複本文件內容，以節省 token。

## 1. Source art 與 runtime asset
- 原始生成圖可保留高解析版本，但正式遊戲只能使用最佳化後的 runtime asset。
- 不可把 1000–2000px、1–3MB 的 source art 原封不動放入 runtime。
- Runtime 尺寸依「實際顯示尺寸 × 合理 DPR」決定，不依生成圖原始尺寸。

## 2. 格式與透明背景
- 背景地圖：可用 JPG/WebP，不要求 alpha。
- 塔／可部署異獸、普通敵人、Boss、Spawn、Base、VFX、UI 裝飾：使用透明 alpha PNG/WebP。
- 若來源是 JPG 或白底圖，整合前必須去背並檢查白邊／黑邊／毛髮／尾巴／火焰／glow。
- 不可把白底來源直接當 sprite 上線。

## 3. 容量目標
以下為目標，不是犧牲畫質的硬限制：
- 小型 sprite / VFX：通常 < 200–300KB。
- Boss / 大型 UI：通常 < 400–500KB。
- 背景：通常 < 500–800KB。
- 若超標有合理視覺需求，記錄原因；不要為達數字破壞畫質。

## 4. Sprite 與位置
- 去除無效透明留白，避免 sprite 視覺中心與實際 anchor 偏離。
- 敵人道路對位以 sprite anchor／腳底或視覺中心為基準；bob/recoil 僅加視覺 offset，不改 path center。
- 不同敵人不得被迫共用同一 visual anchor；應允許每個 enemy type 擁有自己的 `visualAnchorY` / `visualYOffset`，由 runtime 去背 sprite 的可見像素 bounds 與接地點量測決定。
- Spawn／Base 位於畫面邊緣時必須檢查 clipping。
- 不為了解決遮擋任意移動背景或既定塔位；先找 overlay / anchor / hit area root cause。

## 5. Map path geometry 固定規格
- 新關卡不得只提供背景圖後再由 Work 目測猜路徑。
- 必須以正式 runtime 背景圖為準，映射到遊戲座標系（目前主要為 390×610）建立道路 centerline。
- Waypoints 必須位於可行走道路中央；直線可疏、彎道要加密，避免 path smoothing 後切角離開道路。
- 每關至少要明確保存：ordered waypoints、Spawn、Base、tower slots、特殊區域（例如 fog zone / charge corridor）。
- 路徑校正需使用實際 runtime 背景 + debug overlay 疊合檢查，不得只檢查數字表。
- 大型／橫向 sprite 還需同時驗證其 visual anchor；不得用移動 gameplay path 來補救單一 sprite 的 anchor 偏差。
- 路徑／anchor 修正原則上是 visual/geometry 修正，不得順便改 speed、HP、damage、targeting、技能門檻或 Wave。
- 建議將可維護幾何資料集中在單一 geometry/config source，避免散落 magic numbers。

## 6. UI 圖片與程式動態內容
- UI 圖主要負責外框、裝飾、主題造型與必要的靜態圖形。
- 會變動的內容（HP、數字、Wave、金幣、角色名稱、進度、倒數、選擇狀態）原則上由程式產生。
- 不可讓圖片畫一份動態內容、程式再疊一份，造成重複或 mask issue。
- 若程式需要疊加，素材必須提供清楚、規則、可量測的空槽／content channel。

## 7. Boss HUD / HP bar 固定規格
- Boss HUD 素材只能包含：外框、Boss 主題裝飾、頭像／象徵元素、標題區、空的 HP channel。
- 禁止把固定紅／藍／其他 HP fill 畫死在圖片裡。
- 真正 HP fill 與 HP 數字一律由程式動態顯示。
- 每個 Boss panel 可有自己的 `trackRect`；不可假設所有關卡共用相同位置。
- `trackRect` 至少包含 left / top / width / height，建議使用相對 panel 的 normalized / percentage geometry，而非手機絕對像素。
- trackRect 必須以 panel 圖檔本身的「空血槽內緣」量測；並考慮實際 CSS / border-image / nine-slice 後的 rendered geometry，不可只量 source PNG 就直接套百分比。
- fill 必須完全落在空槽內，不可超出、壓框、遮名稱或漂離槽位。
- 每次新增／替換 Boss panel，整合前就必須完成 trackRect pixel audit；不得等玩家實機發現才補。
- 舊素材若含固定 HP fill，必須先改成空槽版再整合；不可用 CSS 遮罩長期掩蓋舊錯誤素材。

## 8. 文字規則
- Boss 名稱、Level 名稱、數值與可能變動／多語系文字原則上不要燒進圖片。
- 若素材確實含靜態裝飾文字，需明確標示，避免程式再重複顯示。

## 9. Preload / 首次顯示
- 首屏必要素材才 blocking；Boss、後期 VFX、結果頁等原則上 deferred。
- Deferred 素材仍必須在「第一次實際使用之前」預載完成。
- 不可為解決首次出圖延遲，把所有圖片改成 blocking。
- 新增可部署異獸後，要驗證第一次打開建造選單時其 sprite 已 ready。

## 10. 命名與 cache
- 使用穩定語義命名，例如 `enemy_meihu_v1.png`、`boss_jiuweihu_phase2_v1.png`、`ui_boss_jiuweihu_panel_v2.png`。
- 禁止 `final-final-new2` 類命名。
- 替換圖片、路徑或 CSS 引用後，必須同步更新 asset/style cache bust 與相關測試。

## 11. 進 repo 前檢查
每張新圖至少確認：
- 是否需要 alpha；格式是否正確。
- 原始像素、runtime 像素、KB/MB、實際顯示尺寸。
- 是否有多餘透明留白或 anchor 偏移。
- 是否含不應畫死的動態資訊。
- 是否會造成首次載入卡頓。
- 透明邊緣是否有白／黑 fringe。

每張新關卡背景另外確認：
- runtime 背景 crop/scale 已確定；
- path centerline 已量測；
- Spawn / Base / tower slots / special zones 已量測；
- 大型 enemy 的 visual anchor 已在彎道與 Base 前核對。

每張新 Boss HUD 另外確認：
- 空 HP channel 內緣已量測；
- rendered trackRect 已換算；
- 滿血／約 50%／約 25% fill 均完全落槽。

## 12. 驗證基準
- 以 iPhone 直式 390px 與 390×700 作主要視覺 smoke 基準。
- 涉及共用 UI / Renderer 時，補受影響關卡 regression。
- Boss HUD 要至少驗證滿血／約 50%／約 25% 三種比例。
- 路徑要以 debug overlay + 實際背景檢查，並抽查小型、大型、Boss sprite 全程道路對位。
- 圖片位置與動態 overlay 必須實機可讀且不遮蔽。
- 若雲端 browser smoke 受環境限制，不要反覆下載 Chromium 浪費大量時間；先完成 targeted 自動檢查並由玩家手機補實機 smoke。
- 若玩家手機 smoke 已明確委派給玩家，Work 在必要自動測試／targeted geometry checks 全部通過後，可回報 `ENGINEERING PASS / PLAYER SMOKE PENDING`；不得僅因玩家尚未實測而標記 FAIL。
- 只有當 prompt 明確要求 Work 自己完成 browser smoke，而 Work 未完成時，該項才算 Work 驗證未完成。
- 玩家未實測前，不得宣稱 `PLAYER VERIFIED` 或最終視覺驗收完成。

## 13. Work / Chat 任務引用方式（省 token）
任務若涉及圖片，只需在 prompt 開頭寫：

> Sync 最新 main，先讀 `docs/WORK_PROGRESS.md`；本輪涉及圖片，另外讀 `docs/ASSET_INTEGRATION_GUIDE.md`。已寫在 Guide 的規則不要在 prompt 重述，只描述本輪差異。

本文件是圖片整合、地圖幾何、sprite anchor、Boss HUD 定位的 source of truth；若未來規則更新，優先修改本文件，不另建零散的血條、定位、容量規範檔。

## 14. 美術風格與手機可讀性固定規格
- 新素材必須先匹配既有 Shanhaijing TD 的遊戲語言，再追求單張插畫精緻度：簡化 2D fantasy、清楚大輪廓、大色塊、有限細節、手機高對比。
- 不以高細節卡牌插畫、寫實材質、密集羽毛／毛髮／裂紋／飾品作為預設方向；若縮到 runtime 尺寸後變成一團，視為不合格，即使 source art 放大看很漂亮。
- 普通敵、Boss、塔與 VFX 必須在 390px gameplay 畫面仍可辨識種類、朝向與重要狀態。
- 對 gameplay 有意義的狀態變化必須有可讀的視覺回饋，例如加速、緩速、護甲、破甲、Boss 護盾與 Phase 變化；特效不得蓋掉本體輪廓。
- 同一關卡的新敵人之間要有不同 silhouette / size class / 主色塊；Boss 不得只是普通敵放大版。
- 玩家已確認的角色造型／風格視為 approved source，不得在後續整合階段自行重新生成或改風格。

## 15. 格式矩陣、runtime 視覺尺度與 VFX 尺度
預設格式：
- 背景：JPG/WebP；只有確實需要 alpha 時才使用 PNG/WebP alpha。
- 塔／可部署異獸／普通敵／Boss／Spawn／Base／VFX：透明 alpha PNG/WebP。
- Boss HUD／UI frame：透明 PNG 為預設，除非既有 UI pipeline 明確使用其他格式。
- Preview / 純場景插圖：JPG/WebP；沒有實際 UI 用途時不要為了「完整」額外製作。

Runtime 顯示尺寸應以既有同類單位為基準，而不是以 source art 原尺寸決定。現行大致基準：
- Tower：約 48–58px 級。
- Small enemy：約 36–42px。
- Medium enemy：約 40–48px。
- Heavy enemy：約 50–56px。
- Boss：約 68–84px。
- Spawn：約 66px；Base：約 76px；slot platform 約 52×40px。
- 超出同級基準必須有明確 gameplay / readability 理由並記錄，不得為了「新關卡更華麗」任意放大。

VFX 尺度以受影響物件／區域為基準：
- hit / status：約本體附近；
- shield / armor：通常只略大於本體；
- break：短暫可略大；
- Boss phase transition 可明顯更大，但不得長時間遮蔽戰場；
- map zone 依 canonical special-zone geometry 顯示，不依 source PNG 尺寸直接拉伸猜測。

## 16. UI 必須先符合程式 contract，再製圖
- 生成或替換 UI 圖以前，先檢查現有 DOM / CSS / Renderer / border-image / nine-slice / dynamic overlay contract。
- **Art must fit the existing program contract.** 不得先生成一張新的裝飾 layout，再為了配合該圖重寫成熟共用 UI，除非玩家明確要求 UI 改版。
- 新 Boss HUD 必須先參考 Level1–5 的共用 runtime contract：薄型橫向 panel、程式動態 Boss 名稱、程式動態 HP fill、程式動態 HP 數字、圖內只留可量測空 HP channel 與主題裝飾。
- Boss HUD 不得自行加入大型 portrait/card layout、固定血量、固定數字或其他與既有 DOM 不相容的結構。
- 每次新增 Boss HUD，先確認素材 layout 符合共用程式，再量 rendered empty channel，最後寫入對應 trackRect 與 regression；不可反過來用 CSS 補救一張不相容的圖。

## 17. Map Geometry Contract 與截圖使用限制
- 一關的正式背景版本／crop／390×610 logical transform／ordered waypoints／Spawn／Base／tower slots／special zones 視為一組 Map Geometry Contract。
- 玩家確認的 geometry 版本一旦記錄為 canonical，後續 Chat / Work 不得重新目測一套。
- 手機截圖只可作為「哪裡看起來偏」的視覺證據，不可作為正式座標來源。正式修正必須回到 canonical runtime background / logical coordinates。
- 若背景被替換或 crop/scale 改變，必須重新驗證 affected geometry；若只是一隻 sprite 偏路，先查 alpha bounds / visual anchor，不得先動全關 path。
- path logical center、sprite visual anchor、Motion Lite offset 三者必須分離：path 控 gameplay；anchor 控圖像對位；bob/recoil 只控 presentation。

## 18. 最終素材交付、檔名確認與部署前最佳化
- 正式開發／部署前，玩家會提供最終選定並下載保存的 source images；Chat 先依 level asset inventory 檢查是否齊全、版本是否正確、檔名是否唯一且符合語義命名。
- 在建立 Work ZIP 前，必須有 asset manifest，至少列出：用途、source filename、runtime filename、格式、alpha 要求、預計 runtime 尺寸、preload 分組、是否 player-approved。
- 高解析 source art 可以保留於 handoff/source，但**不得原封不動當 production runtime asset**。正式 runtime 圖必須依實際顯示尺寸與 DPR 做 trim / resize / format / compression。
- 部署前必須重新記錄 source → runtime 的像素與檔案大小，遵守第 3 節容量目標；若超標要有視覺理由。不可犧牲清楚輪廓換取極端壓縮，也不可因懶惰把 1000–2000px source 直接部署。
- 透明 sprite / VFX 最佳化後仍需檢查 alpha、白黑 fringe、裁切、glow、visible bounds 與 anchor；背景壓縮後要檢查 path / UI 可讀性。
- blocking / deferred 仍依第 9 節：只有首屏必要圖 blocking，其餘在第一次使用前完成 preload，避免頁面初次載入被大型 Boss/VFX 拖慢。
- Approved source、optimized runtime、runtime-verified、player-verified 是不同狀態；不要把「圖片已選定」寫成「已完成實機驗收」。

## 19. Tower slot geometry / coverage validation
- Tower slots are part of the same canonical 390×610 Map Geometry Contract as the background, path, Spawn, Base, and special zones. Slot coordinates must be measured/approved against the same runtime background transform; do not place slots by looking for empty screen space only.
- Before a new map's slots are frozen, check each slot against: nearby path segments, special gameplay zones, UI overlays/hit areas, edge clipping, and the established tower range classes.
- Slot quality is intentionally non-uniform: some positions may be stronger than others. However, avoid a single slot trivially covering every important special zone or most of the full route unless that dominance is an explicit level-design decision.
- When a hairpin or folded route creates unusually high repeated path coverage, record that slot as a targeted runtime/balance smoke point instead of immediately nerfing existing tower range/damage.
- If runtime evidence shows one new-map slot is excessively dominant, prefer a narrow new-level slot-position adjustment before changing shared tower stats or previously completed levels.
- A path correction does not automatically justify moving approved tower slots. Re-check whether the slot itself is visually or mechanically wrong before changing it.
- Debug/acceptance should confirm that the rendered slot platform, pointer hit area, and logical slot center all refer to the same intended map position.


## 20. Attack Visual Production Policy

Before generating any new attack/projectile/VFX asset, classify the visual as **Procedural-first**, **PNG-first**, or **Hybrid**.

### 20.1 Procedural-first — do not add to batch art by default
Use programmatic rendering first for:
- beam / laser / spiritual ray / lightning line;
- shield / aura / glow;
- map-zone highlight;
- status ring / status emphasis;
- short hit flash;
- speed trail / motion streak.

These should not enter the formal batch-image list unless player/runtime smoke later proves the result insufficient.

### 20.2 PNG-first — include in batch art
Use a dedicated transparent PNG/WebP when the attack identity depends on seeing a concrete projectile body, such as:
- fireball;
- rock;
- feather blade;
- leaf blade;
- solar orb;
- ice shard;
- thorn / seed / other physical-looking shot.

### 20.3 Hybrid
Prefer a small optimized projectile image plus code-generated trail/glow/impact when that gives better readability with less asset weight than a large all-in-one effect.

### 20.4 Borderline cases
If the implementation type is unclear:
1. do not immediately create a final production asset;
2. prepare a small mockup, concept image, textual visual spec, or lightweight procedural prototype;
3. review with the player;
4. then decide whether the item belongs in the production asset list.

### 20.5 Batch-list admission rule
The batch image list should contain only assets that are actually required:
- unit sprites;
- Boss sprites;
- map/background assets;
- UI/HUD frames;
- confirmed PNG-first / Hybrid projectiles;
- VFX that genuinely require dedicated art.

Do not include:
- procedural beams;
- procedural zone highlights;
- procedural labels/state text;
- procedural hit flashes;
- procedural trails;
- redundant “backup” projectile images.

### 20.6 Mobile acceptance / escalation
At 390px / 390×700 the player must be able to identify:
- who attacked;
- what target was hit;
- whether the visual is an attack / state / zone;
- the important gameplay state.

If this is clear, keep the Procedural-first solution. If not, discuss escalation to Hybrid or PNG-first rather than silently generating more art.

### 20.7 Current project examples
- 白澤 attack beam → Procedural-first beam + existing Insight impact mark.
- 日照區 emphasis → Procedural-first / existing zone asset support.
- speed / armor / shield readability → Procedural-first or Hybrid depending on mobile smoke.
- future fireball / solar orb / leaf blade / rock projectile → normally PNG-first or Hybrid.

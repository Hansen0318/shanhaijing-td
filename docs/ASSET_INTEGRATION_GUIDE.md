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
- 以 iPhone 直式 390px 與 390×700 作主要 smoke。
- 涉及共用 UI / Renderer 時，補受影響關卡 regression。
- Boss HUD 要至少驗證滿血／約 50%／約 25% 三種比例。
- 路徑要以 debug overlay + 實際背景檢查，並抽查小型、大型、Boss sprite 全程道路對位。
- 圖片位置與動態 overlay 必須實機可讀且不遮蔽。
- 若雲端 browser smoke 受環境限制，不要反覆下載 Chromium 浪費大量時間；先完成 targeted 自動檢查並由玩家手機補實機 smoke。
- 沒有 fresh test / smoke 證據，不得宣稱 PASS。

## 13. Work / Chat 任務引用方式（省 token）
任務若涉及圖片，只需在 prompt 開頭寫：

> Sync 最新 main，先讀 `docs/WORK_PROGRESS.md`；本輪涉及圖片，另外讀 `docs/ASSET_INTEGRATION_GUIDE.md`。已寫在 Guide 的規則不要在 prompt 重述，只描述本輪差異。

本文件是圖片整合、地圖幾何、sprite anchor、Boss HUD 定位的 source of truth；若未來規則更新，優先修改本文件，不另建零散的血條、定位、容量規範檔。

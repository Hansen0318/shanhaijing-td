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
- Spawn／Base 位於畫面邊緣時必須檢查 clipping。
- 不為了解決遮擋任意移動背景或既定塔位；先找 overlay / anchor / hit area root cause。

## 5. UI 圖片與程式動態內容
- UI 圖主要負責外框、裝飾、主題造型與必要的靜態圖形。
- 會變動的內容（HP、數字、Wave、金幣、角色名稱、進度、倒數、選擇狀態）原則上由程式產生。
- 不可讓圖片畫一份動態內容、程式再疊一份，造成重複或 mask issue。
- 若程式需要疊加，素材必須提供清楚、規則、可量測的空槽／content channel。

## 6. Boss HUD / HP bar 固定規格
- Boss HUD 素材只能包含：外框、Boss 主題裝飾、頭像／象徵元素、標題區、空的 HP channel。
- 禁止把固定紅／藍／其他 HP fill 畫死在圖片裡。
- 真正 HP fill 與 HP 數字一律由程式動態顯示。
- 每個 Boss panel 可有自己的 `trackRect`；不可假設所有關卡共用相同位置。
- `trackRect` 至少包含 left / top / width / height，建議使用相對 panel 的 normalized / percentage geometry，而非手機絕對像素。
- trackRect 必須以 panel 圖檔本身的「空血槽內緣」量測；fill 不可超出、壓框或遮名稱。
- 舊素材若含固定 HP fill，必須先改成空槽版再整合；不可用 CSS 遮罩長期掩蓋舊錯誤素材。

## 7. 文字規則
- Boss 名稱、Level 名稱、數值與可能變動／多語系文字原則上不要燒進圖片。
- 若素材確實含靜態裝飾文字，需明確標示，避免程式再重複顯示。

## 8. Preload / 首次顯示
- 首屏必要素材才 blocking；Boss、後期 VFX、結果頁等原則上 deferred。
- Deferred 素材仍必須在「第一次實際使用之前」預載完成。
- 不可為解決首次出圖延遲，把所有圖片改成 blocking。
- 新增可部署異獸後，要驗證第一次打開建造選單時其 sprite 已 ready。

## 9. 命名與 cache
- 使用穩定語義命名，例如 `enemy_meihu_v1.png`、`boss_jiuweihu_phase2_v1.png`、`ui_boss_jiuweihu_panel_v2.png`。
- 禁止 `final-final-new2` 類命名。
- 替換圖片、路徑或 CSS 引用後，必須同步更新 asset/style cache bust 與相關測試。

## 10. 進 repo 前檢查
每張新圖至少確認：
- 是否需要 alpha；格式是否正確。
- 原始像素、runtime 像素、KB/MB、實際顯示尺寸。
- 是否有多餘透明留白或 anchor 偏移。
- 是否含不應畫死的動態資訊。
- 是否會造成首次載入卡頓。
- 透明邊緣是否有白／黑 fringe。

## 11. 驗證基準
- 以 iPhone 直式 390px 與 390×700 作主要 smoke。
- 涉及共用 UI / Renderer 時，補受影響關卡 regression。
- Boss HUD 要至少驗證滿血／約 50%／約 25% 三種比例。
- 圖片位置與動態 overlay 必須實機可讀且不遮蔽。
- 沒有 fresh test / smoke 證據，不得宣稱 PASS。

## 12. Work / Chat 任務引用方式（省 token）
任務若涉及圖片，只需在 prompt 開頭寫：

> Sync 最新 main，先讀 `docs/WORK_PROGRESS.md`；本輪涉及圖片，另外讀 `docs/ASSET_INTEGRATION_GUIDE.md`。已寫在 Guide 的規則不要在 prompt 重述，只描述本輪差異。

本文件是圖片整合的 source of truth；若未來規則更新，優先修改本文件，不另建零散的血條、定位、容量規範檔。

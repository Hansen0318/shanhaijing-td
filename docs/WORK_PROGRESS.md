# Loading UX 與道路中心線工作進度

## 本輪任務目標

以最新 `main` 為基線，查明第一、第二關 gameplay anchor 與道路中心線的偏差來源，並沿用既有 ArtStore／`art-loading` 架構補上可見、可退出且不被非首屏素材阻塞的 Loading UX。

## 已完成

- 已同步最新 GitHub `main`：`e62f86063a6489af6670c25fd1826ad25191cc5d`。
- 已讀取前一輪 COMPLETE 進度與 Git history，未重做已通過的 Motion Lite。
- 已確認 Motion Lite enemy transform 的 `xOffset` 固定為 0，gameplay `x/y/pathDistance` 與 render transform 分離。
- 已量測各敵人透明邊界與 alpha centroid；不同圖片存在少量視覺重心差異，但換算至目前 render 尺寸不足以解釋截圖中的大幅道路偏離。
- 已定位黑屏原因：既有 `art-loading` 僅顯示純色全螢幕遮罩，沒有載入文字；而 `LEVEL_ART_IDS` 目前把 Boss、Boss VFX、結果 UI 也納入關卡 ready 條件。

## 進行中

- 建立 Loading ready／failed asset／deferred preload 與道路 anchor 的最小 failing tests。

## 未完成

- Loading overlay 文字、輕量動畫與 150–250ms fade out。
- 將首屏必要素材與 Boss／後期 VFX 等 deferred preload 分離。
- 完成第一、第二關道路診斷；只對仍有實證偏差的關卡做最小修正。
- focused tests、syntax、390px／390×700、1×／2× browser smoke。
- 完成後 commit、push，並將本檔標記 COMPLETE。

## 已修改檔案

- `docs/WORK_PROGRESS.md`

## 已執行測試與結果

- 尚未進入 production implementation；已完成靜態程式與素材 alpha 診斷。

## 尚未執行測試

- Loading 與 preload focused tests。
- Path／Motion regression。
- JS/MJS syntax。
- Browser smoke。

## Root cause

- Loading：純色 pseudo-element 遮罩沒有狀態文字；全關素材（含非首屏 Boss／VFX）共同阻塞 ready。
- 道路：Motion bob 無 X 位移，透明邊界造成的換算偏移很小；正在以背景中心線抽樣確認是否仍是第二關 waypoint 局部偏差。

## 最新 commit SHA

- GitHub `main` 基線：`e62f86063a6489af6670c25fd1826ad25191cc5d`

## 下一步從哪裡接

先完成 RED tests，再實作 ArtStore critical/deferred scope 與 Loading overlay；其後以相同診斷只修仍失準的路段。

## 尚未解決問題及原因

- 第二關截圖顯示部分隊列視覺上離開道路中心；需完成 gameplay anchor 與背景中心線的同座標比對，才能區分 waypoint 與 sprite 視覺重心。

## 狀態

IN_PROGRESS

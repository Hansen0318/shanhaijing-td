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

## 尚未完成項目

- 建立道路錯位 reproduction／diagnostic 與 Motion 第二輪 failing tests。
- 確認道路錯位 root cause，完成最小修正。
- 擴充 Motion config／helper 至指定單位並移除 A/B 實驗總開關。
- focused regression、JS/MJS syntax、390px／390×700px、1×／2× browser smoke。

## 已修改檔案

- `docs/WORK_PROGRESS.md`

## 已執行測試與結果

- `npm test`：74/74 PASS（修改前基線）。
- 正式素材透明邊界診斷：PASS；未發現足以解釋明顯水平錯位的不對稱透明留白。

## 尚未執行測試

- Motion 第二輪 RED/GREEN tests。
- 道路中心 reproduction／regression test。
- 最終完整 `npm test`、syntax check 與 browser smoke。

## 最新 commit SHA

- GitHub `main` 基線：`2c6eced68fd6bba127c2435b6e434b397fb3c4a9`

## 下一步應從哪裡開始

以背景 crop 對應的 logical coordinate 建立道路中心診斷，先產生會失敗的測試，再依診斷結果修 render anchor 或該關 waypoint。

## 尚未解決問題及原因

- 道路錯位 root cause 尚未完成量測；目前已排除 Motion 水平 offset 與明顯素材左右透明留白。

## 狀態

IN_PROGRESS

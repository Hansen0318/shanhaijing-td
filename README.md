# Shanhaijing TD

山海經 Roguelike Tower Defense — Graybox Prototype V0.01

這個版本只用來驗證核心塔防循環：固定塔位、三種異獸、十波敵人、每波三選一祝福，以及窮奇 Boss。畫面刻意維持 Graybox，不包含正式美術、音效、帳號或永久存檔。

## 遊玩方式

1. 點擊戰場上的圓形塔位。
2. 在底部選擇畢方、夫諸或應龍。
3. 使用「立即開始」跳過準備倒數。
4. 擊殺敵人獲得金幣，升級或增建異獸。
5. Wave 結束後從三個 Blessing 選一個。
6. 在 Wave 10 擊敗窮奇。

## 本機啟動

需要 Node.js 18 以上版本。

```bash
npm run dev
```

瀏覽器開啟 `http://localhost:4173`。

## 測試

```bash
npm test
npm run check
```

測試涵蓋配置、經濟、塔升級、出售、路徑、緩速、持續傷害、範圍傷害、穿透、Blessing 權重、Wave、Boss 狂暴、勝敗及重新開始。

## GitHub Pages

專案使用相對路徑與純靜態前端，不需要建置步驟。可在 repository 的 Pages 設定中選擇從 `main` branch 的 `/ (root)` 發布。

## 調整數值

主要平衡數值集中在 [`src/config/gameData.js`](src/config/gameData.js)：

- `TOWER_DATA`：塔的成本、傷害、攻速、射程與特色。
- `ENEMY_DATA`：敵人的 HP、速度、基地傷害與獎勵。
- `WAVE_DATA`：十波組成及生成間隔。
- `BLESSING_DATA`：十二種祝福及權重。
- `MAP_DATA`：道路 Waypoints 與八個塔位。

## Prototype 限制

- 使用 Emoji 與幾何色塊，並非正式角色美術。
- 只有一張地圖與固定 Wave。
- 沒有音效、永久存檔、帳號、排行榜或後端。
- 平衡數值仍需由手機實際遊玩回饋調整。

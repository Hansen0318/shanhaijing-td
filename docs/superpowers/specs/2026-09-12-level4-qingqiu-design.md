# 第 4 關・青丘妖境設計規格

## 目標與範圍

第 4 關首次正式啟用「已解鎖異獸池 → 選 3 隻 → 進關」流程，並加入白澤、魅狐、幻狸、兩段幻霧區，以及九尾狐三階段 Boss。實作採方案 A：擴充現有 data-driven 關卡架構與既有 `Game`、`StatusSystem`、`BossSystem`、`MotionSystem`、`Renderer`、`UIController` 邊界，不建立全新的通用技能引擎，也不把 Level4 邏輯集中硬編碼在單一類別。

Level1–3 的固定三塔、數值、路徑、玩法、視覺與進關流程維持不變。只有 Level4 與 Level4 必需的共用擴充納入本次範圍。

## 玩家流程與編隊狀態

Level3 勝利時解鎖白澤並顯示既有解鎖訊息。「前往第4關」先進入 Level4 關卡情報／編隊狀態，不直接建立可戰鬥關卡。編隊畫面顯示：

- 敵情：妖霧籠罩青丘，敵人擅長高速突進與幻術干擾。
- 推薦職能：控制／洞察／範圍攻擊。這只是提示，不指定固定答案。
- 畢方、夫諸、應龍、白澤四張可選卡。

玩家必須主動選滿三隻才能確認。未滿三隻時確認按鈕不可用；已滿三隻時點擊其他未選角色不會暗中替換。確認後才重設 Level4 run、載入選定三塔與 Level4 首屏資產，進入無限時間 Preparation。

Level4 建造選單只顯示當次選定三隻。`Game.buildTower()` 同時驗證 active roster，避免只靠 UI 隱藏。Level1–3 仍使用畢方、夫諸、應龍，不受 roster 狀態影響。

Level4 勝利後「再次挑戰」及失敗後「重新挑戰」都回到編隊畫面，清空本次選擇，讓玩家重新選三隻。重開頁面不新增帳號式永久存檔；本次解鎖沿用現有 session 內 progression。開發入口 `?devLevel=4` 視為已開放四隻異獸，仍先顯示編隊畫面。

## Level4 關卡資料

關卡名稱為「第4關・青丘妖境」，Base 為「青丘靈臺」。地圖維持 390×610 邏輯尺寸、單一路徑、八個固定塔位與現有 battlefield／Context Panel／safe-area 規格。

背景道路是 path 的 source of truth。以 390×610 實際裁切背景建立密集 waypoint，先疊圖校準道路中心，再定義八塔位。兩段幻霧區以 Level4 map data 的矩形或多邊形區域表示，地形判定只套用 Level4 敵人規則。Boss 中後段行經區域要保留足夠視覺空間，Boss HUD、進化光效與塔位不得遮住本體或道路。

Waves baseline：

| Wave | 敵人 | 初始 interval |
|---|---|---:|
| 1 | 魅狐×6 | 1.10 秒 |
| 2 | 魅狐×8 | 1.00 秒 |
| 3 | 魅狐×6＋幻狸×1 | 1.05 秒 |
| 4 | 魅狐×8＋幻狸×2 | 0.92 秒 |
| 5 | 魅狐×7＋幻狸×4 | 0.88 秒 |
| 6 | 魅狐×10＋幻狸×4 | 0.74 秒 |
| 7 | 魅狐×8＋幻狸×6 | 0.78 秒 |
| 8 | 魅狐×12＋幻狸×6 | 0.62 秒 |
| 9 | 魅狐×10＋幻狸×8 | 0.58 秒 |
| 10 | 魅狐×10＋幻狸×6＋九尾狐×1 | 0.82 秒 |

一般敵人 HP multiplier 為 W1–4 1.0、W5 1.05、W6 1.10、W7 1.20、W8 1.30、W9 1.45、W10 1.35。W1–3 必須明顯低壓，W6–9 才形成配置壓力。九尾狐基礎 HP 5200，W10 Boss multiplier 固定 1.0，不以額外極高倍率堆難度。

## 白澤：支援／洞察

白澤資料：Cost 125、Damage 14、Attack interval 1.05 秒、Range 128。攻擊命中造成傷害並附加洞察標記；沒有指定獨立飛行彈素材，因此使用短促洞察連線／印記效果，不新增未提供的 projectile art。

- Lv1：標記 3.0 秒；一般敵人承受傷害 +15%，Boss +10%。
- Lv2：標記 4.0 秒，Range +8。
- Lv3：被標記目標的特殊防禦效果降低 25%。對九尾狐狐火護身，原 15% 減傷降為 11.25%；其他特殊防禦必須透過資料欄位套用，不更動 Level1–3 未受白澤攻擊時的行為。
- 白澤選敵時優先真身，只有範圍內沒有可用真身才會處理幻影。
- 白澤命中幻狸真身後，現存及後續由該真身建立的幻影壽命縮短為 0.8 秒，並以洞察印記清楚標出真身。

易傷由 `StatusSystem` 維護時間，`CombatSystem.resolveDamage()` 讀取同一條 damage pipeline，確保畢方範圍、夫諸、應龍穿透與白澤自身都一致套用。狀態到期後完全恢復，重複命中只刷新剩餘時間，不無限疊加易傷倍率。

## 魅狐與幻霧

魅狐資料：HP 70、Speed 92、BaseDamage 1、Reward 12、Radius 11。

魅狐每次首次進入一段幻霧區時獲得 +30% speed、持續 1.4 秒；兩段幻霧各只觸發一次，因此一生最多兩次。離開後再進入同一區不重複觸發。被白澤洞察標記時，該次幻霧加速倍率減半為 +15%。區域進入紀錄保存在 enemy instance，不污染其他敵人或其他關卡。

## 幻狸與幻影

幻狸資料：HP 260、Speed 34、BaseDamage 3、Reward 25、Radius 17。真身第一次低於 60% HP 時建立兩個幻影，整個生命週期只觸發一次。

幻影是可被一般塔選取的短命戰鬥目標，但不是 Wave 單位：

- 存活 1.6 秒，被任一有效攻擊命中一次立即消失。
- 不抵達或傷害 Base、不給 reward、不增加 kill、不影響 Wave remaining／完成條件。
- 跟隨真身附近的可辨識偏移位置，不改真身 pathDistance 或碰撞中心。
- 一般塔可被幻影干擾；白澤優先真身。
- 真身有洞察時，真身顯示印記，幻影壽命為 0.8 秒並降低視覺 alpha，讓 390px 畫面能辨識真假。

幻影採明確 `isIllusion`／`countsTowardWave=false` 契約，避免以特殊 case 猜測 type 名稱。清理幻影時不呼叫 `wave.enemyRemoved()`。

## 九尾狐三階段 Boss

九尾狐資料：基礎 HP 5200、Speed 18、BaseDamage 20、Reward 0、Radius 27。Boss phase 保存在 enemy instance，threshold 各只觸發一次。

### Phase 1：100%–61%

- 使用 Phase1 sprite。
- 狐火護身每 8 秒啟動一次：減傷 15%，持續 2.5 秒。
- 狐步每 10 秒啟動一次：速度 +25%，持續 1.3 秒。

### Phase 2：60%–26%

- 60% threshold 進入一次，使用 Phase2 sprite。
- 進化視覺約 0.7 秒，不顯示中央 Banner 或階段名稱。
- 每 8 秒建立三個幻影，通常存活 1.8 秒；Boss 位於幻霧時加 0.5 秒。
- 白澤洞察標記真身並縮短幻影壽命。

### Phase 3：25%–0%

- 25% threshold 進入一次，使用 Phase3 sprite，視覺尺寸約增加 10%。
- 進化視覺約 0.9 秒，不顯示中央 Banner 或階段名稱。
- 永久 speed +20%。
- 天妖狐火每 7 秒觸發：蓄力 0.6 秒，後續 4 秒內夫諸等 slow 效果只剩原本 60%。不做完全免控。

Boss 死亡後才可 Victory。Phase transition 與技能事件以結構化事件交給 `Game`／Renderer 產生動作和 VFX；不將顯示字串混進 Boss 狀態判定。

## Boss Motion V2 視覺門檻

Motion V2 只改 render transform／sprite／effect，不改 logical path、collision、targeting 或 gameplay clock。所有狀態必須在 390px 手機上肉眼明顯，不接受僅 1–2px 位移或極輕微 scale 造成「測試有變化、實機看不出來」的結果。

- Idle：P1 約 1.00↔1.025；P2 約 1.00↔1.035；P3 約 1.00↔1.045，P3 另有至少 3px 可見浮動。
- Hit：約 100ms，至少 3–5px recoil，搭配明顯 hit flash。
- Skill：本體必須有蓄力→動作→回彈三段，搭配 cast／projectile／burst／ultimate 素材；不能只有 VFX。
- Evolution：P1→P2 約 0.7 秒、P2→P3 約 0.9 秒，含可辨識的收束、放大／展尾與 sprite swap；不得產生中央文字。
- Death：約 450ms，狐火熄滅、尾巴失力、縮放／旋轉後淡出。

自動測試鎖定最小數值與事件順序；390px browser smoke 必須以連續幀位移／scale 差值和 sprite swap 證明可見幅度，最後仍由玩家在真實 iPhone Safari 判斷動作是否自然、是否一眼可見。

## UI 與開發入口

編隊使用獨立 overlay／state，沿用套件的 lineup panel 作裝飾底框，文字、角色名稱、職能、選取狀態與按鈕均由 HTML/CSS 產生。畫面需支援 320／375／390／430px，不得水平溢位；390×700 下確認按鈕與四張選角卡都可操作。

開發入口：

- `?devMenu=1` 顯示 Level1–4。
- `?devLevel=4` 直接開啟 Level4 編隊。
- `?devLevel=4&devPath=1` 疊加 runtime path、原始 anchor、敵人 logical center 與兩段幻霧區。
- `?devLevel=4&devWave=10` 直接建立 W10 測試狀態。
- `?devLevel=4&devBossPhase=1|2|3` 建立對應九尾狐 phase 測試狀態；參數只在 devLevel=4 生效。

正式網址不顯示 dev menu 或 debug overlay。

## 素材處理與載入

套件內 17 張圖片都是 source art。背景輸出為符合 crop 的 JPG；白澤、兩種敵人、四張 Boss／cast、Spawn、Base、VFX 與 UI 裝飾輸出為 runtime-ready 資產。需要疊在遊戲上的素材必須有透明 alpha；白底 JPG 使用邊界連通去背並檢查白邊、黑邊、白色角色毛髮與狐火 glow，不以全域刪白破壞角色內部。

依實際 1×／2× 顯示尺寸裁邊、縮圖與壓縮：一般 sprite／VFX 優先低於 200–300KB，Boss／大型 UI 優先低於 400–500KB，背景低於 500–800KB。畫質與透明邊緣優先於硬壓到數字。

Level4 blocking 組只包含首屏 UI、背景、Spawn、Base、slot、第一波敵人，以及編隊畫面四隻候選塔和 lineup panel。確認編隊前四隻候選圖必須 ready；進入戰場後 build menu 的三隻圖必須立即出現。後期敵人、Boss、phase sprites 與 VFX 維持 deferred，但需在 W10 前完成預載。載入失敗沿用 settle＋fallback，不可造成無限 loading。

所有新增檔案使用新 cache version，並列出每張主要圖片的來源／runtime 像素與 KB，以及 Level4 新資產總量前後差異。

## 錯誤處理與相容性

- 非法或不足三隻的 lineup 不可進關；重複角色去重。
- Level1–3 不讀取 Level4 roster，既有建造測試維持原結果。
- 無效 `devBossPhase`／`devWave` 忽略並回到正常 Level4 編隊，不進入半初始化狀態。
- 素材載入錯誤會 settle，Renderer 使用現有 emoji／shape fallback。
- 幻影逾時、被擊中或真身死亡時都能安全清除，不重複 reward 或 wave decrement。
- Boss threshold 即使單次傷害跨越多個區間，也依序且各一次進入 P2、P3；不得跳回前一階段。

## 測試與驗收

行為變更採 TDD。最低自動驗證包括：

- lineup 恰選三隻、Level4 retry 回 lineup、build 僅允許 active roster。
- Level1–3 roster／progression／balance regression。
- Level4 map、八塔位、兩段幻霧、十 Waves 與敵人 baseline。
- 魅狐每區一次加速及洞察減半。
- 幻狸 threshold 一次、幻影一擊消失、逾時、無 Base／reward／Wave 副作用。
- 白澤一般／Boss 易傷、刷新不疊加、Lv2、Lv3、真假目標優先。
- 九尾狐 P1 技能 cadence、P2／P3 threshold 各一次、幻影、狐火、抗 slow、死亡後勝利。
- Boss phase transition 不建立中央 Banner／階段文字。
- Motion V2 Idle／Hit／Skill／Evolution／Death 的事件順序與最小可見幅度。
- 所有 Level4 asset refs、decode、alpha、尺寸、檔案大小、blocking／deferred 分組。
- `?devLevel=4`、dev menu、path、W10、P1／P2／P3 入口。

Fresh verification：`npm test`、`npm run check`、全部 JS syntax、圖片 decode／alpha、`git diff --check`。Browser smoke 針對 390px 與 390×700 驗證編隊、首開建造、Preparation 塔位、path／幻霧、W1–3、W10 phases、無 phase Banner、Motion V2、safe-area、Boss HUD 與首次素材顯示；不人工完整重跑四關各十波。

部署後仍需玩家以真實 iPhone Safari／Chrome確認道路視覺、編隊直覺、W1–3 與 W6–10 體感、幻影辨識、白澤價值、Boss 三階段差異與 Motion V2 自然度。

## 分階段交付

1. 編隊與 Level4 進關骨架。
2. Graybox map、path、幻霧、敵人與 Waves。
3. 白澤洞察與幻影互動。
4. 九尾狐三階段 gameplay。
5. runtime art、VFX、Motion V2 與 preload。
6. balance、共用 regression、手機 smoke、文件與部署。

每階段建立可安全回復的 commit。若工作階段中斷，更新 `docs/WORK_PROGRESS.md`，記錄已完成、未完成、root cause、測試、素材前後容量、下一步與 SHA。

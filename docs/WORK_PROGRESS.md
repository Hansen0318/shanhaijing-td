# Shanhaijing TD Work Progress

## 2026-09-20：Level7 first character sub-batch proposal — 欽原

- Asset/VFX gate remains active; no production implementation or Work handoff.
- To avoid jumping ahead, Chat prepared only the **欽原** visual direction as the next discussion item.
- Proposed silhouette: compact fast 蜂鳥／毒蜂型異獸, right-facing source pose, readable wings/head/stinger, low-detail mobile silhouette.
- 雷行 remains Procedural-first; no powered-up alternate PNG or dedicated trail image.
- 欽原 remains `PENDING_DISCUSSION`; no image generation is authorized yet.
- 諸懷 / 夔 / 句芒 / Boss HUD / projectile remain blocked.
- Next exact step: player approves/revises 欽原 visual direction; only then open the first character generation sub-batch.

---

## 2026-09-20：Level7 Geometry V3 player-approved and frozen

- Player approved the latest Geometry Guide V3 after correcting Spawn entry, Base endpoint, and two path turns.
- Promoted Geometry V3 to canonical `docs/levels/level7/GEOMETRY.md`.
- Canonical 390×610 path, Spawn/Base, T1–T8 and 雷脈 A/B initial gameplay bounds are now frozen.
- Geometry Guide V1/V2 are obsolete; future Chat/Work must not re-guess coordinates.
- Runtime interpolation may add local anchors only to preserve the approved centerline; it may not move the route.
- Level7 gate advanced from MAP CONCEPT / CANONICAL GEOMETRY to **ASSET / VFX PLANNING**.
- No production code or Work handoff yet.
- Next exact step: finalize Level7 asset/VFX inventory and discuss the next exact source-art sub-batch.

---

## 2026-09-20：Level7 background approved / Geometry Guide V1 prepared

- Player approved the clean no-text 雷澤天野 background.
- 雷脈 A/B micro-animation, 0.9s charge and pulse are approved as Procedural-first code VFX; no animation sprite-sheet/PNG batch.
- Prepared Geometry Guide V1 on the approved background: yellow candidate centerline, red anchors, Spawn/Base, T1–T8 candidate centers and 雷脈 A/B candidate bounds.
- Candidate coordinates are recorded in `docs/levels/level7/GEOMETRY.md` but explicitly **not canonical** until player review/correction.
- Next step: player corrects/approves Geometry Guide V1; Chat then creates V2 and freezes geometry only after approval.
- No production gameplay implementation and no later character/HUD/projectile image batch started.

---

## 2026-09-20：Level7 clean background candidate generated

- Generated one clean Level7 雷澤天野 background candidate using the approved lightning-zigzag direction.
- Candidate intentionally contains no gameplay labels/text overlay.
- Asset status is **GENERATED_UNAPPROVED**; it is not yet canonical and is not committed as production art.
- No geometry coordinates were assigned.
- Next step is player review of the actual candidate/crop. If accepted, Chat will create the geometry overlay first for player correction, then freeze 390×610 coordinates.

---

## 2026-09-20：Level7 route revised to lightning-zigzag

- Player approved moving away from the conventional smooth S-shaped road.
- Canonical design direction is now a lightning-bolt / Z-like zigzag route with a few strong turns.
- 雷脈 A/B should align with two meaningful route turns/crossings.
- Upper-left Spawn and lower-right 震木神壇 remain.
- No canonical coordinates are frozen yet; the actual background candidate must be approved first.
- Background-only generation allowlist remains unchanged; all character/HUD/projectile art is still blocked.

---

## 2026-09-20：Level7 map composition approved / background-only sub-batch opened

- Player continuation accepted the proposed Level7 map composition.
- Promoted the composition contract into `SPEC.md` as L7-G001..G010.
- Approved **only** the Level7 雷澤天野 background for image generation.
- Character/Boss/HUD/句芒 projectile assets remain blocked; no later asset batch is authorized.
- Next step: generate one background candidate, obtain player approval of the actual crop, then measure canonical 390×610 path/slots/thunder zones from that accepted background.

---

## 2026-09-20：Level7 gameplay baseline frozen / geometry gate opened

- Player continuation instruction treated as approval to advance the previously reviewed Level7 gameplay direction.
- Promoted Level7 theme, enemy set, Boss, 雷脈 mechanic, 句芒 baseline, W1–W10 and clear behavior from proposal into `docs/levels/level7/SPEC.md`.
- Added stable Level7 Decision/Requirement IDs for implementation traceability.
- Level7 current gate advanced to **MAP CONCEPT / CANONICAL GEOMETRY**.
- Added first map composition proposal to `DESIGN.md`: upper-left Spawn → upper crossing / 雷脈A → middle fold → lower approach / 雷脈B → lower-right 震木神壇.
- No production code, geometry coordinates, or image generation performed.
- Next exact step: player review/approval of the background/map composition; only after approval may canonical 390×610 coordinates be measured.

---

## 2026-09-20：Anti-leak governance + Work budget

- 新增 `docs/DEVELOPMENT_GOVERNANCE.md`。
- 將四個高價值機制正式化：Machine-checkable Preflight、Decision/Requirement ID、Change Impact/Traceability、bounded Pre-merge Red Team Audit。
- 新增 requirement verification owner：STATIC / TARGETED_TEST / WORK_RUNTIME / PLAYER_SMOKE / MIXED。
- 明確規定治理機制不得拖垮 Work；Chat 必須先完成可安全完成的規格、文件、靜態檢查、impact/preflight，再只交給 Work 最小 executable delta。
- 玩家可自行快速驗證的手機視覺／操作 smoke 預設由 PLAYER_SMOKE 負責，不要求 Work 重複。
- full tests / browser smoke 改為依風險與 scope 決定，不因「有測試」就自動全部跑。
- Pre-merge Red Team Audit 只針對本次 changed scope，禁止演變成全 repo 重審或全關卡重玩。

---

## 2026-09-20：Global development continuity system completed

- 新增 `docs/DEVELOPMENT_PLAYBOOK.md`，作為所有新開發者 / Chat / Work / Codex 的專案接手與執行導航。
- `AGENTS.md` 新增全專案級硬規則：新 session onboarding、同一長 session 的 pre-action context refresh、pre-question check、decision promotion、stage-completeness audit、handoff-completeness audit。
- 這些規則適用所有未來關卡與子系統，不限 Level7。
- 新關卡必須使用 `docs/levels/_TEMPLATE/` 的 STATE / SPEC / DESIGN / GEOMETRY / ASSETS 五檔結構，再開始正式設計/實作。
- 核心工作循環固定為：了解目前狀態 → 確認 current gate / allowed action → 執行 → 立即記錄決策/狀態 → 再進下一步。
- 新接手者應能只靠 GitHub 文件了解：整體架構、規則、目前進度、已核准內容、當前 gate、branch/SHA、驗證狀態與 Next exact step。

---

## 2026-09-20：Stage-gate enforcement added

- 對長期開發新增「不是只有記錄，而是限制執行順序」的硬規則。
- `STATE.md` 現在必須明列 Current gate / Allowed now / Forbidden until gate exit / Gate exit condition / Next exact step。
- 圖片批量生成新增強制 allowlist：只有 `ASSETS.md` 標成 `APPROVED_FOR_GENERATION` 的項目可以進當前批次。
- 未討論、mockup first、Procedural-first、未核准、屬於後續階段的圖片，不得提前生成。
- 若發現自己已跨 gate 做太早，必須停止，不得因為「都開始了」就把後面整批做完。
- Level7 目前 gate = PLAYER REVIEW / DESIGN APPROVAL；目前 final image-generation allowlist = none。

---

## Active development pointer — Level7

- Active level: **Level7**
- Canonical handoff entry: `docs/levels/level7/STATE.md`
- Approved requirements: `docs/levels/level7/SPEC.md`
- Design proposals/history: `docs/levels/level7/DESIGN.md`
- Geometry source: `docs/levels/level7/GEOMETRY.md`
- Asset/VFX ledger: `docs/levels/level7/ASSETS.md`
- New Chat / Work sessions must follow `AGENTS.md` Section 17 read order and continue from `STATE.md -> Next exact step`.
- Legacy `docs/levels/LEVEL7_DESIGN_DRAFT.md` is now a redirect only and is not authoritative.
- Current Level7 phase: **DESIGN / PLAYER APPROVAL PENDING**; production implementation has not started.

---

## 2026-09-20：Level7 balance proposal

- Chat 已補第一版 Level7 數值與 Wave baseline，仍標示為 player approval pending，未改 production gameplay。
- 欽原暫定：HP100 / Sp88 / DMG1 / R14；雷脈 pulse 命中時雷行 ×1.25、1.4s、刷新不疊加。
- 諸懷暫定：HP390 / Sp25 / DMG3 / R30；雷脈 pulse 命中時雷殼 damage taken ×0.80、1.6s、刷新不疊加。
- 夔暫定：BaseHP7000 / Sp16 / DMG20；W10 Boss ×1.10 = 7700；P1 7s pulse / 0.9s telegraph / A↔B；P2 50% HP、Sp×1.15、5s pulse、A→B→A+B 循環，不回血、不第二條血。
- 句芒暫定：Cost130 / Dmg10 / Interval1.15 / Range138 / projectileSpeed380；global attack interval support Lv1 ×0.95、Lv2 ×0.92、Lv3 ×0.89，多隻不疊、最高等級生效、包含自身。
- 句芒仍採 shared level damage ×1.30 / ×1.50，不另造等級公式。
- 已建立 W1–W10 第一版：W1/2 欽原，W3 混合，W4 諸懷，W5–9 漸增，W10 欽原×8 + 諸懷×4 + 夔×1。
- Level7 暫不新增另一隻 deployable unlock，避免 roster 每關膨脹；通關只接 Level8（存在時）。
- 圖片仍未開始生產；句芒 projectile 需先做 Hybrid mockup 給玩家確認。

---

## 2026-09-20：Level7 concept proposal

- Chat 已完成第一版 Level7 concept draft，尚未視為玩家核准。
- 暫定主題：`第7關・雷澤天野`；Base working name：`震木神壇`。
- 暫定普通敵：欽原（快壓力）／諸懷（重壓力）；Boss：夔。
- 暫定 map mechanic：兩個固定「雷脈／雷擊區」，採離散 pulse + telegraph，不複製 Level6 持續日照區。
- 句芒 working role：全隊增益／木神支援 + 輕量單體輸出；global buff 非近距離光環，多隻不疊加，最高等級決定 bonus。
- 暫定 global attack interval bonus：Lv1 ×0.94、Lv2 ×0.91、Lv3 ×0.88；尚未 freeze。
- 句芒攻擊視覺建議先做 Hybrid mockup（青木靈羽／葉刃小型投射物 + 程式 trail/impact），未核准前不進批量圖片。
- 本輪只更新 design draft，不改 production gameplay。

---

## 2026-09-20：Level7 design start

- Level7 開發正式開始，但目前只鎖定 progression / 句芒進場規則，尚未鎖定關卡主題與數值。
- Level6 通關解鎖句芒；Level7 lineup 必須顯示 畢方／夫諸／應龍／白澤／句芒 五隻，仍然 5 選 3。
- 句芒在 Level7 可立即選擇；Retry 回 0/3；Blessing 依本場三隻過濾。
- 建議第一次進 Level7 時對句芒卡做一次輕量「NEW」提示，但資料來源仍是 shared unlock/progression，不做 Level7 特例。
- 句芒角色方向維持全隊型木神支援，與白澤敵方 debuff 分離；數值、攻擊方式、投射物與 Blessing 尚未定案。
- 已新增 `docs/levels/LEVEL7_DESIGN_DRAFT.md`，後續先由 Chat 完成主題、敵人、Boss、機制、句芒數值與圖片需求，再決定 Work handoff。

---

## 2026-09-20：Attack visual / asset production hard rule

- 已將攻擊視覺正式分類為 **Procedural-first / PNG-first / Hybrid**。
- 可由程式清楚表達的 beam / laser / aura / zone / status / hit flash / trail，預設不進入批量圖片生產清單。
- 有明確實體投射物本體的火球／石塊／羽刃／葉刃／太陽彈等，才預設列入 PNG 或 Hybrid 素材需求。
- 邊界案例先做示意圖、文字 visual spec 或小型 runtime prototype，玩家確認後再決定是否產圖。
- 手機 390px / 390×700 可讀性是保留 procedural 或升級為 Hybrid/PNG 的主要驗收依據。
- 白澤 beam 作為目前 reference case：程式 beam + 既有 Insight impact mark，不新增專屬 beam 圖。

---

## 2026-09-19：Level6 readability polish

### Player feedback

- Level6 enemy abilities and sunlight zones were functionally present but not visually obvious enough on the public game.

### Chat-owned implementation completed

- Player smoke follow-up: 白澤攻擊原本有傷害/洞察事件但視覺不明顯；Chat 已改為程序化青白光束 + 既有洞察命中標記，不新增素材、不改傷害/攻速。扶桑甲獸原本只有 1.2px slow bob，手機上近似靜態平移；已加強為 render-only bob + stride + breathing scale + hit recoil，不改 speed/path/facing/spacing。對應 renderer/motion tests 與 cache-bust 已補。

- Branch: `feat/level6-readability-20260919`.
- No gameplay/balance changes.
- Sunlight A/B are now always visible as faint landmarks; active zone receives a brighter pulse and `日照A・啟動` / `日照B・啟動` label.
- `sunlightZone` moved into Level6 first-paint required assets (+~23 KB) so the map mechanic is visible immediately.
- 陽羽 sunboost, 扶桑甲獸陽木甲, 金烏日輪護體 VFX were enlarged/brightened; active state tags added.
- 金烏 Phase2 now retains a faint persistent solar aura after the transition VFX, with no phase/balance changes.
- Cache-bust updated for `main.js`, `Renderer.js`, and the changed art catalog module so Pages/Safari will not silently reuse the previous presentation code.
- Targeted tests were updated to cover inactive/active sunlight landmarks, labels/state tags, and the first-paint preload contract.

### Remaining Work-only closure

- Run fresh targeted tests + full `npm test` + `npm run check` + syntax/diff checks on this branch.
- Run browser/runtime smoke at 390px / 390×700 for A/B visibility, enemy state readability, Jinwu P2 persistent aura, no overlap/overflow, and Level1–5 regression.
- If clean, follow `AGENTS.md` Section 8 through merge to `main`, Pages deployment, deployed `?devMenu=1` Level6 smoke, and normal Level5→Level6 production-flow smoke.
- Do not alter Level6 balance or regenerate assets unless executable evidence identifies a real defect.

### Status

CHAT IMPLEMENTED / EXECUTABLE VERIFICATION + RELEASE PENDING

---
## 2026-09-19：Release flow correction

### Root cause

- Repository `AGENTS.md` Section 8 already defined merge + Pages as the default delivery flow.
- The Level6 handoff package incorrectly overrode that default with “feature branch only / do not merge / do not deploy” even though the player never requested a checkpoint-only delivery.
- Work therefore correctly stopped on `feat/level6-fusang`, while the public Pages site still served the old `main`; this made Work's PASS look like a completed release when the player could not yet test Level6 publicly.

### Permanent correction

- A substantial Work implementation is not considered delivered at feature-branch PASS.
- Default Work completion now requires: feature implementation → fresh tests → final whole-branch review → merge to `main` → Pages release → deployed dev/test entry check → deployed normal production-flow check.
- For a new level, `?devMenu=1` must show the new level and normal previous-level victory/progression must reach the new level before the release is called delivered.
- If Work lacks permission/tooling to merge/deploy/verify Pages, status must be **ENGINEERING PASS / RELEASE BLOCKED**, with the exact SHA/blocker; it must not claim completion.
- Future ZIP/TXT handoffs must never invent “feature branch only” for token savings. Only an explicit player request may stop before release.
- Chat-first remains unchanged: Chat still completes all safe pre-handoff work first. The correction only changes the end boundary after Work owns substantial implementation.

### Level6 incident recovery

- Level6 feature branch head: `18fe2ac343f833576a4a5ab60e103dc5559866bc`.
- Chat subsequently merged PR #9 to `main` at `2e03c9d0d0f46b3059ede796a20b2dc2709e5b21`.
- Player-facing Pages smoke remains the release acceptance step after Pages refresh.

### 狀態

PROCESS RULE CORRECTED / LEVEL6 MAIN MERGED / PAGES PLAYER SMOKE PENDING

---
## 2026-09-19：Level6・扶桑神域工程完成

### 已完成

- 新增第6關「扶桑神域」：Geometry V4、8 塔位、10 Waves、陽羽／扶桑甲獸／金烏、A/B 日照區與金烏 P2 雙區常亮。
- Level5 勝利以共用 progression 進入 Level6 空陣容；畢方／夫諸／應龍／白澤 4 選 3。Level6 Retry 回空陣容，勝利解鎖句芒且因尚無 Level7 不顯示下一關。
- 日照機制、甲獸減傷／破甲、金烏日盾與 P2 均接入共用 combat/event pipeline；未修改 Level1–5 gameplay、數值或 Wave。
- 12 張最終 runtime assets 已按 handoff checksum 原樣整合並分 required/deferred preload；Level6 baked 入口／終點透過共用 optional map-prop contract，不請求不存在素材。
- Level6 敵人沿用共用 visual-anchor、footprint spacing、path-facing、Motion Lite 與 death pipeline；Renderer 已加入日照區、加速、護甲、護盾、破甲及進化 VFX。
- 金烏 Boss panel 依實際 `70px slice / 6px border / stretch` 的 414×44 九宮格輸出與 CSS 402×32 padding-box 定位容器量測；空槽約 `x=21–393, y=20–27`，trackRect 為 `3.7% / 43.8% / 92.5% / 21.9%`，100%／50%／25% fill regression 全通過。
- Dev Menu 新增 Level6；支援 `?devLevel=6&devPath=1`、`devWave=1..10`、`devBossPhase=1|2`、`devSunlight=A|B|both`。Path debug 同時標示 runtime path、waypoints、8 slot centers 與 sunlight rectangles。
- Browser smoke 面板新增 Level5→6、Level6 lineup/Wave 1、A/B 日照敵人、金烏 P1/P2/25%、Victory 與 Retry 快捷狀態。

### 驗證

- Targeted progression／Level3–6／renderer／Boss HUD／UI：89/89 PASS。
- 完整 `npm test`：188/188 PASS；`npm run check`、所有 `src/tests` JavaScript syntax、`git diff --check origin/main..HEAD`：PASS。
- 雲端 Chrome 阻擋 localhost，執行環境亦無本機 Chromium：`ENGINEERING PASS / PLAYER SMOKE PENDING`。
- 玩家手機需補測：390px／390×700 無水平溢位、Level5 勝利→Level6 4 選 3、首次素材載入、Geometry V4/path/slots/日照 overlay、1×/2× spacing、陽羽/甲獸狀態、金烏 P1/P2 與 HUD 100%/50%/25%、勝利句芒解鎖、Retry 空陣容、無 Level7 按鈕。

### 發布邊界

- 本輪只推 `feat/level6-fusang` feature branch；不 merge `main`、不觸發 GitHub Pages。最終 merge／Pages deploy 由後續 review 工作接手。

---

## 2026-09-19：Level6 前置規則與規格固化

### 已完成

- Level6 最小 Work handoff package 已由 Chat 建立並自我驗證：12 張 optimized runtime assets + 2.9KB 短 prompt + asset checksums，ZIP 約 1.2MiB，SHA-256 `3227dc7400be47cf7d60c8ee9de47d05c9f7fba6718f1881e10618f6be0a74cc`。解壓後 12/12 hashes PASS、全部 decode PASS、除背景外皆 RGBA。Work 明確只做 irreducible implementation/tests/runtime，feature branch push 後停止；Chat 負責 review/merge/Pages deploy。

- Chat 已完成 Level6 static asset audit：final background 與 390×610 canonical transform 相符、12 張 source 全部建立 optimized runtime candidates（約 5.38 MiB → 1.12 MiB）、量測陽羽/扶桑甲獸/金烏 visible bounds/anchor/footprint、完成金烏 HUD source empty-channel audit。另確認日隙/扶桑靈核已 baked 進背景，不需要額外 Spawn/Base PNG；未來由 generic optional map-prop contract 處理，Level1–5 不變。

- 玩家已分兩批提供 Level6 最終 source images，共 12/12 齊全；新增 `docs/levels/LEVEL6_ASSET_MANIFEST.md`，逐張記錄 source 尺寸/格式、runtime 檔名、alpha 要求與最佳化狀態。僅背景可維持 JPG/WebP；敵人/Boss/VFX/句芒 unlock/Boss HUD 正式 runtime 需透明 alpha。

- Level6 gameplay implementation-prep baseline 已記錄：陽羽/扶桑甲獸/金烏 base stats、A/B 日照切換與效果、W1–W10、金烏 P1/P2、Victory condition、Blessing scope、tower-slot runtime smoke focus。

- 確認 Level6 8 個 tower slot 候選座標與目前 390×610 地圖 overlay 對應；V4 修正的是 enemy path，不是 slot center。新增通用 tower-slot geometry/coverage hard rule；最終仍需 final source + runtime hit-area/range smoke 才能標 RUNTIME-VERIFIED。

- 追加永久規則：Level4+ roster／lineup／Blessing／unlock／next-level UI 必須 data-driven；禁止以 `LEVEL6_ROSTER`、`levelId < N` 或逐關分支持續擴充。Level6 spec 已加入對應 progression acceptance。

- 補強 `AGENTS.md`：完成關卡預設 frozen、共用 Motion Lite、enemy path-facing mirror、tower target-facing、既有行為 regression、player-approved canonical artifact、pre-handoff asset gate。
- 補強 `docs/ASSET_INTEGRATION_GUIDE.md`：美術風格／手機可讀性、格式矩陣、runtime scale、VFX 尺度、UI program-contract-first、Boss HUD 共用邏輯、Map Geometry Contract、截圖非座標來源、final source→runtime 最佳化與 asset manifest。
- 已確認既有 Chat-first / Work-only token 節省規則本來就存在於 `AGENTS.md` Sections 9 / 11，並新增 Section 14 將『玩家先提供最終 source images → Chat 完整 audit → 只把不可由 Chat 完成的 delta 打包給 Work』設為正式 handoff gate。
- 新增 `docs/levels/LEVEL6_FUSANG_SPEC.md`，記錄第6關・扶桑神域目前 canonical 設計、Geometry V4 ordered waypoints、progression、asset inventory、Boss HUD contract、句芒 unlock 與 pending runtime audit 項目。
- Geometry V4 明確標記為 player-approved；V1/V2/V3 obsolete。Tower slots / Sunlight bounds 保留為 final-source audit 前的 candidate，避免把尚未 runtime 驗證的數值誤標成 final。
- 正式部署前，高解析 source art 不得直接上線；必須依實際顯示尺寸/DPR 做 trim、resize、format/compression、alpha/fringe/anchor 檢查與 preload 分組。

### 下一步 gate

- Chat-owned pre-handoff gate 已完成；最終 source 12/12、runtime 最佳化、manifest、geometry/anchor/HUD static audit 與 minimal ZIP 自我驗證均已完成。
- 下一步才交由 Work 處理完整 repo 才能可靠完成的 production implementation、TDD/tests、Boss HUD rendered trackRect 與 browser/runtime smoke。
- Work 只 push feature branch，不 merge/deploy；Chat 在 engineering evidence clean 後接手 review、merge、Pages deploy 與玩家手機 smoke checklist。

### 狀態

HANDOFF READY / WORK ENGINEERING PENDING

---

## 2026-09-12 Level4・青丘妖境

### 已完成

- 新增第4關「青丘妖境」與「青丘靈臺」：10 Waves、8 塔位、2 段幻霧、Level3 勝利後解鎖白澤並可進入第4關。
- 新增 4 選 3 空陣容畫面；必須恰選三隻才可確認，第4關勝敗重試都回到空陣容。
- 新增白澤：Lv1/2/3 洞察秒數、射程與 Lv3 25% 防禦削減；普通敵人 +15%、Boss +10% 易傷，刷新但不疊加，優先辨識同進度真身。
- 新增魅狐幻霧首次加速與洞察減半；新增幻狸 60% HP 觸發一次的兩個幻影，幻影一擊消失且不計 Wave、擊殺、獎勵或 Base 傷害。
- 幻影會維持相對真身的可辨識偏移並在真身死亡時清除；白澤標記真身後，現存與後續幻影都縮短壽命。
- 新增九尾狐 P1/P2/P3：護盾、狐步、幻影、0.6 秒終極蓄力與 4 秒緩速效力降低；60% / 25% 進化只觸發一次且不顯示中央階段 Banner。
- Motion V2 以 390px 肉眼可辨下限實作：P1/P2/P3 idle scale 2.5% / 3.5% / 4.5%，P3 bob 3px，Hit 4px，Skill action 至少 4px，Evolution 峰值 16%，Death 0.45 秒。
- 新增 `?devLevel=4`、`?devLevel=4&devPath=1`、`?devLevel=4&devWave=10`、`?devLevel=4&devBossPhase=1|2|3`，dev menu 加入 Level4。
- Level4 required preload 包含首屏、陣容、四塔、背景、Spawn/Base 與魅狐；Boss、後期敵人與大型 VFX 維持 deferred。
- 無作弊自動模擬以畢方／夫諸／白澤陣容完成 W1–10：Victory、Base HP 14、擊殺 117。

### Level4 素材（17 張）

- Source 合計 6,925,377 bytes（6.60 MiB）→ runtime 合計 3,444,294 bytes（3.28 MiB）。
- 所有 sprite / Boss / VFX / UI runtime 圖均為含 alpha PNG；背景為 390×610 JPEG。
- 深色與淺色 contact sheet 已檢查，未見白底矩形、黑邊、毛髮／尾巴裁切或發光邊緣破壞。

| 圖片 | 原尺寸 | 新尺寸 | 前 KB | 後 KB |
|---|---:|---:|---:|---:|
| `bg_qingqiu_realm_source.jpg` | 982x1536 | 390x610 | 544.2 | 65.7 |
| `map_spawn_mist_rift_source.jpg` | 1254x1254 | 256x256 | 397.9 | 120.7 |
| `map_base_qingqiu_altar_source.jpg` | 1254x1254 | 256x256 | 480.0 | 138.4 |
| `tower_baize_source.jpg` | 1254x1254 | 256x256 | 349.0 | 111.6 |
| `enemy_meihu_source.jpg` | 1254x1254 | 256x256 | 232.3 | 74.1 |
| `enemy_huanli_source.jpg` | 1254x1254 | 256x256 | 170.4 | 67.0 |
| `boss_jiuweihu_phase1_source.jpg` | 1254x1254 | 512x512 | 287.6 | 285.2 |
| `boss_jiuweihu_phase2_source.jpg` | 1254x1254 | 512x512 | 413.9 | 399.2 |
| `boss_jiuweihu_phase3_source.jpg` | 1254x1254 | 512x512 | 483.2 | 454.7 |
| `boss_jiuweihu_cast_source.jpg` | 1254x1254 | 512x512 | 434.2 | 429.2 |
| `fx_jiuweihu_projectile_source.png` | 1254x1254 | 192x192 | 610.7 | 33.6 |
| `fx_jiuweihu_burst_source.jpg` | 1254x1254 | 256x256 | 261.2 | 103.3 |
| `fx_jiuweihu_phase_aura_source.jpg` | 1254x1254 | 384x384 | 255.0 | 190.2 |
| `fx_jiuweihu_ultimate_source.jpg` | 1254x1254 | 384x384 | 450.7 | 269.9 |
| `fx_baize_insight_mark_source.png` | 1254x1254 | 256x256 | 986.7 | 90.4 |
| `ui_boss_jiuweihu_panel_source.jpg` | 1536x512 | 768x256 | 181.9 | 232.5 |
| `ui_level4_lineup_panel_source.jpg` | 1536x512 | 768x256 | 224.1 | 298.0 |

### 驗證與續作

- Implementation checkpoint：`f3b0288`；GitHub `main` 部署提交：`0c3c365`；設計：`docs/superpowers/specs/2026-09-12-level4-qingqiu-design.md`；計畫：`docs/superpowers/plans/2026-09-12-level4-qingqiu.md`。
- Fresh 自動測試共 122 項全數通過；`npm run check`、逐檔 `node --check`、`git diff --check` 亦通過。
- GitHub Pages 390×700 smoke：Level4 lineup 與 Boss P3 均解除 `art-loading`，`clientWidth=scrollWidth=390`，無水平溢位；四張陣容圖皆 `complete=true`。
- 選定畢方／夫諸／白澤後第一次點塔位，三張建造圖立即出現且皆 `complete=true`；Boss P3 於相隔 650ms 的 390px 畫面中可肉眼辨識 idle scale／bob 差異。
- 玩家仍需實測：Level3→4 解鎖理解、4 選 3 直覺性、首次建造／Boss／VFX 載入、路徑與兩段幻霧貼圖、W1–3 與 W6–10 體感、幻影真偽辨識、五種 Boss Motion、真實手機 Safari safe-area。

## 2026-09-11 圖片資產體積與載入速度優化

### Scope / 顯示尺寸盤點

- 只處理圖片資產、圖片引用與 preload 分組；未改 gameplay、UI 版型、Renderer 尺寸或 Motion Lite。
- Canvas 固定為 390×610 CSS px，DPR 上限 2。
- 三塔 canvas 最大約 48–56×54–58 px，建造卡 / 已部署資訊為 34×34 / 30×30 px。
- 普通敵人為 36–50×36–50 px；Level1/2 Boss 為 68–72 px。
- 指定 VFX 實際約 19×13 至 155×92 px；Spawn/Base 為 66 / 76 px；塔位底座為 52×40 px。
- 背景實際繪製為 390×610 px；UI 圖以 border-image 顯示於 44px HUD、110px build card、96px blessing card、360×430 result panel 等容器。

### 已完成

- Level1/2 背景由不含 alpha 的 PNG 改為同尺寸 JPEG（quality 84、4:4:4），保留原 crop 與構圖。
- 角色 / Boss / VFX / Spawn / Base / slot 依 2× 顯示需求縮至 192–512px，保留 RGBA。
- 九宮格 UI 保留原像素尺寸與既有 border-slice 數值，只做 256 色含 alpha PNG 壓縮，沒有修改版型。
- 三塔加入三關 required preload；Boss、VFX、build/blessing/result 與 Boss panel 仍維持 deferred。
- JS `assetUrl()`、CSS border-image、stylesheet 與 changed-module URL 統一加上 `asset-opt-1`，避免回訪裝置沿用同名舊大圖快取。
- required 資產數每關 10→13，但 blocking transfer：Level1 11.737→2.619MiB、Level2 10.973→2.682MiB、Level3 4.183→2.538MiB。
- 全部 assets：54.559→9.855MiB（-81.9%）。

### 處理圖片（35 張）

| 圖片 | 原尺寸 | 新尺寸 | 前 KB | 後 KB |
|---|---:|---:|---:|---:|
| `backgrounds/bg_kunlun_gate_v1.jpg` | 1214x1295 | 1214x1295 | 2666.5 | 425.4 |
| `bosses/boss_paoxiao_v1.png` | 1254x1254 | 384x384 | 1237.1 | 213.7 |
| `bosses/boss_qiongqi_frenzy_v1.png` | 1254x1254 | 384x384 | 2729.9 | 343.4 |
| `bosses/boss_qiongqi_v1.png` | 1235x1199 | 384x373 | 1533.3 | 245.5 |
| `effects/fx_bifang_explosion_v1.png` | 1331x1136 | 384x328 | 1635.2 | 217.1 |
| `effects/fx_bifang_fireball_v1.png` | 1368x1134 | 192x159 | 916.0 | 35.5 |
| `effects/fx_fuzhu_frostshot_v1.png` | 1372x1138 | 192x159 | 817.8 | 39.3 |
| `effects/fx_paoxiao_enrage_v1.png` | 1254x1254 | 256x256 | 1770.8 | 113.4 |
| `effects/fx_paoxiao_explosion_v1.png` | 1254x1254 | 256x256 | 1816.0 | 125.6 |
| `effects/fx_paoxiao_groundslam_v1.png` | 1254x1254 | 256x256 | 1633.5 | 113.1 |
| `effects/fx_paoxiao_projectile_v1.png` | 1254x1254 | 192x192 | 1037.6 | 42.3 |
| `effects/fx_slow_mark_v1.png` | 1190x1188 | 256x256 | 1168.4 | 74.8 |
| `effects/fx_yinglong_beam_v1.png` | 1501x387 | 512x132 | 542.1 | 90.3 |
| `enemies/enemy_chiyu_v1.png` | 1254x1254 | 256x256 | 1418.0 | 109.2 |
| `enemies/enemy_jiyao_v1.png` | 1237x1135 | 256x235 | 1176.5 | 102.1 |
| `enemies/enemy_juyao_v1.png` | 1241x1197 | 256x247 | 1855.9 | 123.6 |
| `enemies/enemy_xiaoyao_v1.png` | 1182x1140 | 256x247 | 1255.3 | 109.6 |
| `enemies/enemy_yanjia_v1.png` | 1254x1254 | 256x256 | 1995.2 | 131.2 |
| `levels/level2/bg_chishui_wasteland_v1.jpg` | 1122x1402 | 1122x1402 | 2893.3 | 529.2 |
| `levels/level2/map_base_chishui_fort_v1.png` | 1254x1254 | 256x256 | 1401.1 | 97.1 |
| `levels/level2/map_spawn_fire_rift_v1.png` | 1254x1254 | 256x256 | 2118.4 | 127.4 |
| `map/map_base_kunlun_seal_v1.png` | 1234x1251 | 253x256 | 2273.3 | 130.5 |
| `map/map_slot_platform_v1.png` | 1185x913 | 256x197 | 1374.4 | 86.0 |
| `map/map_spawn_rift_v1.png` | 1235x1254 | 252x256 | 2256.2 | 133.1 |
| `towers/tower_bifang_v1.png` | 1192x1239 | 246x256 | 1699.6 | 117.9 |
| `towers/tower_fuzhu_v1.png` | 937x1223 | 196x256 | 1073.1 | 85.9 |
| `towers/tower_yinglong_v1.png` | 1192x1140 | 256x245 | 1960.1 | 135.9 |
| `ui/ui_blessing_card_v1.png` | 830x1327 | 830x1327 | 1078.5 | 334.8 |
| `ui/ui_boss_panel_v1.png` | 1527x433 | 1527x433 | 514.1 | 122.3 |
| `ui/ui_boss_paoxiao_panel_v1.png` | 2172x724 | 2172x724 | 1426.5 | 374.3 |
| `ui/ui_build_card_v1.png` | 851x1347 | 851x1347 | 959.2 | 330.0 |
| `ui/ui_defeat_overlay_v1.png` | 1418x979 | 1418x979 | 1419.2 | 422.3 |
| `ui/ui_hud_button_v1.png` | 874x819 | 874x819 | 562.9 | 187.3 |
| `ui/ui_resource_panel_v1.png` | 1377x439 | 1377x439 | 526.3 | 166.2 |
| `ui/ui_victory_overlay_v1.png` | 1448x1050 | 1448x1050 | 1488.3 | 417.7 |

### 驗證狀態

- 資產 / preload / Level1–3 / Renderer / Motion targeted：43/43 PASS。
- JS syntax、50 張圖片 decode、33 張處理後透明 PNG 的 alpha：PASS；自動測試亦檢查 PNG signature / IEND / alpha-capable color type。
- 品質拼圖已比較原圖與新圖；以 ImageMagick `compare -metric RMSE` 對同尺寸完整背景量測，Level1 / Level2 normalized RMSE 為 0.0139847 / 0.0152068；UI / sprite 亦於深、淺底檢視，肉眼未見明顯劣化或白黑邊。
- 本機 no-store 並行讀取 Level1 blocking 組（交替 12 輪中位數）：10 assets / 11.737MiB / 37.3ms → 13 assets / 2.619MiB / 11.9ms；正式手機 wall-clock 仍以 Pages 實測為準。
- 最新 main 的既有基線為 94 tests、87 PASS、7 FAIL（上一輪 UI 測試契約）；本輪不修該 UI scope，要求不得新增第 8 個失敗。
- 本輪加入測試後全套為 95 tests、88 PASS、7 個相同既有 FAIL，未新增失敗。
- GitHub Pages 已部署驗證 Level1 / 2 / 3：三關皆解除 `art-loading`、390×610 canvas 邏輯尺寸正確，背景與塔位於 targeted smoke 未見明顯品質劣化。
- Level1 第一次點塔位後首個取樣即出現 3 張塔卡；三張 `.unit-art` 均為 `complete=true`、natural size 246×256 / 196×256 / 256×245，未觀察到文字先出、圖片延遲補上的狀況。
- 雲端驗證視窗不支援改為 390×700 viewport，且頁面自訂 global metric 無法由該讀取層取得；真實手機 Safari 的 390×700 wall-clock / 首次 Boss、VFX 動態觀感仍列玩家實測。

### 中斷續作

- 已完成發布，不要重新壓縮上述 35 張；後續若續作，只需真實手機 Safari 390×700 與首次 Boss / VFX 玩家 smoke。
- 資產 release SHA：`033e26c5a82a782ba29a9383e9729e0f85e621e0`；其後只追加本段 Pages 驗證紀錄。

## 基線

- 本輪從 `c8def07871d063f3160f7f92d585119a66bc9686` 接續。
- 上一輪已完成的 Level3 基礎整合、正式素材、Motion Lite、Boss/祝福/解鎖與既有完整流程不重做。
- 本輪只處理玩家指定 A–F 六項。

## 2026-09-11 本輪已完成

### A. Preparation UI 改版

- 已移除 battlefield 內舊 `.wave-control` / `countdown-label` 大黑條 DOM。
- `start-wave-button` 已搬到上方 `wave-preview` 最右側，文案為 `開始 W{n}`。
- 只在 `preparation` 顯示；Wave 開始後 `render()` 立即設為 hidden。
- Start Wave listener 仍呼叫既有 `game.startWaveNow()`；Preparation 無限時間與 gameplay 行為不變。
- 改為三關共用 UI；已移除上一輪 Level3-only pointer-events workaround。
- battlefield 現在只有 canvas + banner，不再有 Preparation/Start overlay 擋塔位。

### B. Level3 enemy path 真正校準

- 已確認 Motion Lite enemy config 沒有水平 bob/xOffset 參數；不把偏路歸因於 Motion Lite。
- Level1/2 path 與 8 個 Level3 塔位完全未改。
- Level3 path 從較疏 waypoint + `pathSmoothing: 4` 改成 42 個較密人工 anchor + `pathSmoothing: 2`。
- S 彎增加進彎 / 中彎 / 出彎 anchors，弱水區與後段彎道亦增加中心線控制點，降低 spline 在彎內切角的空間。
- 新增 dev-only `?devLevel=3&devPath=1`：綠線=runtime path、黃點=gameplay anchors、紅十字=enemy logical center，可直接疊背景檢查路徑/精靈中心。
- 背景 binary 無法在目前 GitHub connector/terminal 環境直接做可視化瀏覽器疊圖，因此最終道路視覺貼合仍列玩家實機 smoke；未把這項未觀察結果記成已通過。

### C. Level3 W1–W3 再降難度

- 水魈 speed：`112 → 90`。
- weakWaterSpeedMultiplier：`1.35 → 1.25`。
- 弱水中基礎實際速度：`151.2 → 112.5`。
- W1：水魈 ×6，interval 1.10。
- W2：水魈 ×8，interval 1.00。
- W3：水魈 ×6 + 玄甲獸 ×1，interval 1.00。
- W4–W10 未改；玩家塔傷害未改。

### D. dev-only 關卡選單

- 保留 `?devLevel=1/2/3`；非法值 fallback Level1。
- 新增 `?devMenu=1`，顯示 Level1 / Level2 / Level3 三按鈕。
- 點選後導向 `?devLevel=n`。
- devMenu branch 不建立 Game、Renderer 或 ArtStore instance，也不 preload 關卡素材。
- 正式 `index.html` 不含 dev menu DOM；只有 query `devMenu=1` 才由 JS 建立。

### E. 正式頁 + 切關 Loading / preload 優化

修改前 blocking required assets：

- Level1：19。
- Level2：19。
- Level3：20。

修改後 blocking required assets：

- Level1：5 = `slotPlatform / background / spawnRift / baseSeal / minion`。
- Level2：5 = `slotPlatform / level2Background / level2Spawn / level2Base / minion`。
- Level3：5 = `slotPlatform / level3Background / level3Spawn / level3Base / shuixiao`。

變化：Level1 19→5（-73.7%）、Level2 19→5（-73.7%）、Level3 20→5（-75.0%）。

- projectile / explosion / slow mark / beam / Boss / Boss VFX / late-wave enemy / unlock 等已改為 deferred。
- CSS 自行載入的 resource/hud/wave preview/context/build/action/blessing/result/Boss border-image 不再被 ArtStore 當 readiness blocker。
- `body.art-loading` 仍保留「山海異獸載入中…」與 pulse/dots，只等待 LEVEL_REQUIRED_ART_IDS。
- `loadIds()` 原有 onerror→settle 行為保留，失敗資產不會造成無限 loading，Renderer fallback 仍可接手。
- `?devLevel=3` 現在直接 `new ArtStore(Image, 3)`；不再先啟動 Level1 unique preload 再 ensure Level3。
- fresh load 新增 `globalThis.__SHANHAIJING_LOAD_METRICS__`，記錄 `levelId / requiredAssets / blockingMs`，供正式 Pages 實測 wall-clock。
- 目前環境無法執行正式 GitHub Pages/iPhone Safari，因此修改前後真實 wall-clock 毫秒數沒有可靠觀測值；不得以 asset count 推算成實際時間。

### F. 驗證 / 中斷續作

已完成的 targeted repository verification：

- 最新 diff 相對 `c8def078`：ahead 12 commits、behind 0；只動本輪相關 9 個 production/test 檔案，未碰 Level1/2 path、塔傷害或完整 Wave gameplay。
- Preparation CTA 結構 regression 已加入 `tests/ui-contract.test.js`。
- devMenu / devLevel / direct ArtStore initialLevelId / devPath / loading metrics regression 已加入 `tests/ui-contract.test.js`。
- blocking art budget / error settle / direct Level3 no-Level1-preload regression 已加入 `tests/art-assets.test.js`。
- Level3 dense path anchors / weaker smoothing / 8 slots unchanged / 水魈速度與 W1–W3 baseline regression 已加入 `tests/level3.test.js`。
- GitHub API compare 已確認本輪 production 變更集中在 `index.html`, `src/config/artAssets.js`, `src/config/gameData.js`, `src/main.js`, `src/ui/UIController.js`, `styles-fixes.css`，另有對應 3 個 targeted test files。

目前工具環境限制：

- container 無法解析 `github.com`，不能 clone main 後直接執行 repo 的 `npm test` / browser smoke。
- 無可用互動瀏覽器連到 GitHub Pages，因此 390px / 390×700 真實渲染、Start CTA 實機點擊、切關 loading、1×/2×、道路疊圖與 wall-clock loading time 尚需玩家 smoke。
- 不重跑完整 1–10 Waves，符合本輪 scope。

## Root cause

- Preparation 塔位被擋：Start/Preparation 控件原本 absolute 疊在 battlefield，DOM hit area 會攔截 canvas pointer；已改為上方共用 wave-preview CTA，根因移除而非用 Level3 pointer exception 繞過。
- Level3 彎道切角：較疏 waypoint 配較強 smoothing 仍可在 S 彎偏離背景中心；改用較密人工 anchor 約束曲線，並降低 smoothing。
- Level3 前期過快：水魈 base 112 × 弱水 1.35 = 151.2，加上前 3 波數量仍高；本輪同時降 base、弱水倍率、數量與 interval 壓力。
- 正式 loading 偏慢：ArtStore 把大量戰鬥期 FX、Boss 與 CSS 自載 UI 圖也納入 Preparation readiness；已縮成每關 5 張真正首屏 blocking assets。
- 舊 `?devLevel=3`：Renderer 預設 ArtStore(1) 先啟動 Level1 required，再補 Level3；已改為先解析 initialLevelId 再建立 ArtStore。

## 修改檔案

- `index.html`
- `styles-fixes.css`
- `src/ui/UIController.js`
- `src/main.js`
- `src/config/artAssets.js`
- `src/config/gameData.js`
- `tests/ui-contract.test.js`
- `tests/art-assets.test.js`
- `tests/level3.test.js`
- `docs/WORK_PROGRESS.md`

## 尚需玩家實測

1. 正式首頁 fresh load：feedback 正常，讀取 `__SHANHAIJING_LOAD_METRICS__` 的 blockingMs。
2. Level1→2、Level2→3：loading overlay 正常進出。
3. `?devLevel=3` 直接第三關；`?devMenu=1` 可選 1/2/3；正式網址不顯示 dev menu。
4. 三關 Preparation 8 塔位可點，尤其 Level3 最上方；CTA 位於 wave-preview 右側且 Wave 開始後消失。
5. `?devLevel=3&devPath=1` 疊圖確認直線 / S 彎 / 弱水段貼道路中心，精靈透明邊界不造成視覺中心錯覺。
6. W1–W3 新難度、1×/2×、390px 與 390×700 targeted smoke。

## 最新 production checkpoint

- Production/test head before this docs update: `3bb3f7533de07e756a3e54a80b914852035cc204`。

## 狀態

ENGINEERING IMPLEMENTED / TARGETED PLAYER SMOKE PENDING

---

## 2026-09-14：Level5「第5關・不周山墟」

### 已完成

- 新增 Level5 正式資料、10 波敵軍、不周山背景量測路徑、8 塔位、熔岩 Spawn、天柱核心 Base 與朱厭 charge corridor。
- 新增朱厭一次性蓄力衝鋒、狸力一次性土甲破甲判定、刑天 P1 護盾／P2 地震與單塔暈眩；W10 勝利需同時滿足波次清空與刑天死亡。
- Level4 勝利可進入 Level5 四選三編隊；重試會清空陣容；Blessing 只保留所選異獸的專屬項目。
- ZIP 內 16 張 Level5 素材全部經去背、裁邊、縮放及壓縮後接入 runtime；來源合計 6,684,496 bytes，runtime 合計 2,487,992 bytes（約減少 62.8%）。
- 刑天 Boss HUD 使用空槽框，名稱與 HP fill 由程式動態渲染；Banner、Boss Warning、Preview 沿用既有 UI 架構。
- 新增 `?devLevel=5`、`devPath=1`、`devWave=1..10`、`devBossPhase=1|2` 測試入口，以及 390×700 responsive fixtures。
- Level4 既有 `0.15000000000000002` 浮點測試只改成容差斷言，未修改 Level1–4 production gameplay。

### 驗證狀態

- 聚焦 Level5／共享 Renderer／HUD／asset pipeline：59/59 PASS。
- 完整 `npm test`：155/155 PASS。
- `npm run check`、必要 JS syntax、`git diff --check`：PASS。
- Browser smoke：雲端瀏覽器禁止 localhost；公開唯讀 checkpoint 頁另有第三方確認警告且未取得授權；本機 Playwright 有套件但無瀏覽器執行檔，下載亦逾時。因此 390／390×700 真實 browser smoke 尚未完成，不得標記 PASS。

### Safe-push checkpoints

- design/TDD：`43adb1627bf52b4e6e2df2bf25fe42a7e9f3d854`
- 核心 gameplay：`baeebf18359282df65deb98537a7cfe0252e3f60`
- 素材／Renderer／HUD／UI：`c9d18a994facac5c285d2aadc6b3a2dad296b66a`

### 狀態

ENGINEERING COMPLETE / 390 BROWSER SMOKE BLOCKED

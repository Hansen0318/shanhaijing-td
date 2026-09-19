# Level6・扶桑神域 — Pre-Implementation Canonical Spec

> Status: PRE-IMPLEMENTATION / PLAYER-APPROVED DESIGN PARTS RECORDED  
> This file records the current Level6 source-of-truth before the Work ZIP is built. Permanent engineering rules remain in `AGENTS.md`; permanent art/geometry rules remain in `docs/ASSET_INTEGRATION_GUIDE.md`.

## 1. Level identity

- Official name: **第6關・扶桑神域**
- Theme: 扶桑神木／烈日／金烏
- Spawn concept: **日隙**
- Base concept: **扶桑靈核**
- Boss: **金烏**
- Normal enemies: **陽羽**、**扶桑甲獸**
- Level6 remains a mobile portrait TD level using the existing 390×610 logical map coordinate system.

## 2. Progression / lineup

- Level5 victory must expose progression to Level6 once Level6 is implemented.
- Entering Level6 uses the permanent Level4+ lineup flow.
- Level6 selectable roster at entry: 畢方／夫諸／應龍／白澤; select exactly 3.
- Retry returns to an empty lineup and requires selecting 3 again.
- Level6 victory unlocks **句芒**.
- 句芒 is **not deployable during Level6**; it becomes eligible for the following playable level.
- When Level7 is eventually implemented, the owned roster becomes five beasts and the player still selects exactly 3 unless a future level-specific rule explicitly changes eligibility.
- While Level6 is the final implemented level, Level6 victory must not show a nonexistent Level7 button.
- Progression / roster logic must become data-driven rather than hard-coding future levels to the original four-beast roster.

## 3. Canonical map path — Geometry V4

The player explicitly approved **Geometry V4** after correcting the lower-left C-shaped turn. V1/V2/V3 are obsolete and must not be reused.

- Canonical logical map: **390×610**
- The path must be implemented from the ordered V4 waypoints below.
- Work must not redraw or re-measure a different path from the background by eye.
- Phone screenshots may be used only to report visual mismatch; they are not coordinate sources.

### Ordered V4 waypoints

```text
(57,55)
(60,72)
(78,91)
(111,101)
(150,105)
(190,105)
(229,109)
(264,119)
(296,137)
(323,162)
(342,193)
(354,230)
(360,271)
(360,311)
(354,347)
(341,381)
(321,408)
(295,427)
(266,434)
(262,429)
(253,428)
(244,428)
(235,428)
(226,428)
(217,428)
(208,428)
(199,428)
(190,428)
(181,428)
(173,426)
(165,423)
(159,417)
(152,411)
(147,404)
(142,397)
(141,389)
(139,380)
(134,373)
(129,366)
(121,362)
(112,361)
(103,361)
(94,362)
(87,366)
(79,370)
(76,378)
(73,386)
(68,393)
(63,400)
(60,408)
(59,417)
(58,426)
(59,435)
(64,445)
(73,453)
(85,459)
(99,464)
(114,466)
(130,466)
(146,463)
(162,458)
(178,452)
(190,449)
(194,452)
(194,475)
```

### Current map-placement candidates — not yet runtime-frozen

These values came from the current background overlay and remain subject to the final source-image audit before the Work ZIP:

- Tower slots:
  - T1 (98,138)
  - T2 (285,94)
  - T3 (285,203)
  - T4 (96,269)
  - T5 (307,312)
  - T6 (195,382)
  - T7 (107,417)
  - T8 (309,461)
- Current Sunlight A candidate bounds: (137,90)–(222,124)
- Current Sunlight B candidate bounds: (302,365)–(363,414)

Do not promote these candidate slots/zones to runtime-final until they are checked against the exact final background source supplied before implementation.

### Tower-slot geometry status

- The eight candidate slot coordinates were placed on the same current 390×610 Level6 background/geometry overlay as the path. The player's later V4 correction changed the lower-left enemy route, not these slot centers.
- Therefore the current program-coordinate candidates are visually aligned to the intended map locations and should be carried forward unchanged into the final-source audit rather than re-guessed.
- They are still **not RUNTIME-VERIFIED** until the exact final background/source package is supplied and the slot platform + hit area + tower range are checked in the runtime build.
- Coverage audit focus for runtime smoke: T1/T2 versus Sunlight A, T5/T8 versus Sunlight B, and the high repeated-path coverage around T6/T7 created by the lower-left hairpin.
- Do not change existing tower range/damage because of Level6 slot geometry. If runtime evidence shows a new Level6 slot is too dominant, prefer a narrow Level6 slot-position adjustment.

## 4. Level mechanic — sunlight

The Level6 shared mechanic is **日照區**.

Confirmed design direction:
- 陽羽 receives a clearly visible speed-up state when affected by active sunlight.
- 扶桑甲獸 receives **陽木甲**, with a clear armor-on presentation and a clear armor-break presentation.
- 金烏 receives **日輪護體** while benefiting from active sunlight.
- 金烏 Phase 2 / **十日凌空** escalates the battlefield sunlight pressure; the established direction is that both sunlight zones are active together in Phase 2.
- Speed-up / slow-down changes must be visibly obvious on a phone, not only numerical.
- Exact numerical multipliers, durations, trigger cooldowns, and Wave composition are not frozen by this document unless separately added later.

## 5. Motion, facing, spacing and visual scale

Level6 inherits the permanent shared contracts in `AGENTS.md`:

- Motion Lite for new enemies / Boss.
- Enemy/Boss horizontal facing mirrors from path travel direction using the existing shared Renderer logic.
- Existing deployable beasts continue to face attack targets through the shared tower-facing logic and retain facing after attack.
- Do not alter Level1–5 motion/facing behavior while adding Level6.
- Global enemy visual spacing remains footprint-based and uses the shared spacing system; do not create Level6-only spacing logic.

Current provisional runtime boxes, pending final alpha-bound audit of the exact player-supplied PNGs:
- 陽羽: **40×40**
- 扶桑甲獸: **54×52**
- 金烏: **84×84**

Final `sourceWidth/sourceHeight/visibleWidth/visibleHeight/anchorY/footprint` must be measured from the exact optimized runtime PNGs before implementation is considered complete.

## 6. Art direction

All Level6 art must follow `docs/ASSET_INTEGRATION_GUIDE.md`:

- same game visual language as Level1–5;
- simplified, mobile-readable, high-contrast silhouettes;
- limited small detail; avoid card-illustration density;
- gameplay states remain visually readable;
- approved art must not be regenerated/restyled during integration without player request.

The player will provide the final chosen downloaded source images before the formal Work ZIP is created.

## 7. Planned asset inventory

The final filenames will be audited against the player's supplied files before handoff. Planned runtime semantic names:

1. `bg_fusang_realm_v1.jpg`
2. `enemy_yangyu_v1.png`
3. `enemy_fusangjiashou_v1.png`
4. `boss_jinwu_v1.png`
5. `fx_yangyu_sunboost_v1.png`
6. `fx_yangmujia_on_v1.png`
7. `fx_yangmujia_break_v1.png`
8. `fx_jinwu_sunshield_v1.png`
9. `fx_jinwu_phase2_v1.png`
10. `fx_sunlight_zone_v1.png`
11. `ui_boss_jinwu_panel_v1.png`
12. `unlock_jumang_v1.png`

### Preview decision

A Level6 preview illustration is **not currently required**. Level5's small lineup preview is not to be copied automatically. Do not generate or integrate a Level6 preview unless the UI use-case is deliberately redesigned later.

## 8. Boss HUD contract

`ui_boss_jinwu_panel_v1.png` must follow the same runtime logic as Level1–5:

- thin horizontal Boss panel;
- transparent PNG;
- decorative frame/theme only;
- **empty measurable HP channel**;
- no fixed red HP fill;
- no baked Boss name;
- no baked HP numbers;
- no incompatible large portrait/card layout.

Boss name, red HP fill and HP text remain code-driven.

Before integration:
1. audit the exact final panel;
2. measure the rendered empty channel after the real CSS/border-image pipeline;
3. add `BOSS_HUD_GEOMETRY.jinwu`;
4. regression-test ~100% / 50% / 25% fill entirely inside the channel.

## 9. 句芒 unlock

- Level6 victory unlocks 句芒.
- Current visual identity: clearly bird/deity-like rather than deer-like, green/white/gold, branch-and-leaf crest, wing/leaf silhouette, simplified for mobile readability.
- Level6 only needs the unlock presentation asset.
- Do not build the production tower sprite, projectile, global-buff VFX, or detailed Level7 numbers until Level7 development requires them.
- Future gameplay role direction: global ally-support / wood-god support, distinct from 白澤's enemy-debuff role. Exact upgrade numbers remain future-level scope.

## 10. Source → runtime optimization gate

Before deployment:
- preserve the player's high-resolution chosen source files;
- produce optimized runtime copies based on actual display size and DPR;
- trim transparent padding;
- verify alpha / fringe / crop / visible bounds;
- record source size → runtime size and source KB → runtime KB;
- follow the size targets and preload rules in the Asset Integration Guide;
- do not deploy 1000–2000px AI source art directly.

## 11. Chat → Work handoff gate

No Work ZIP is created until:
- the player supplies all final selected source images;
- Chat verifies completeness and filenames against Section 7;
- canonical geometry/specs are complete;
- all safe Chat-owned static analysis, asset inventory, naming, geometry, UI contracts and acceptance criteria are complete.

The Work ZIP then contains only the smallest implementation / executable-verification delta that Chat cannot reliably perform, consistent with `AGENTS.md` Sections 9, 11 and 14.

## 12. Approval / verification states

Current state:
- Level name/theme: **PLAYER-APPROVED**
- Geometry V4 path: **PLAYER-APPROVED**
- Character/VFX/Boss HUD/unlock source set: **PLAYER-SUPPLIED 12/12 COMPLETE**; see `docs/levels/LEVEL6_ASSET_MANIFEST.md`
- Tower slots: **MAP-ALIGNED CANDIDATE / FINAL SOURCE + RUNTIME AUDIT PENDING**
- Sunlight-zone bounds: **DESIGN BASELINE / FINAL SOURCE + RUNTIME AUDIT PENDING**
- Runtime anchors / footprints: **PENDING FINAL ASSET AUDIT**
- Jinwu Boss HUD trackRect: **PENDING RUNTIME MEASUREMENT**
- Level6 implementation: **NOT STARTED**
- Runtime/browser verification: **NOT STARTED**
- Player phone smoke: **NOT STARTED**

## 13. Level6 progression acceptance (inherits AGENTS.md Section 15)

Level6 implementation must use the shared data-driven progression contract; it must not introduce `LEVEL6_ROSTER`-style hard-coded UI/gameplay branches.

- Level5 victory exposes Level6 only because Level6 exists in playable level data.
- Entering Level6 opens lineup first.
- Level6 entry roster is the four currently owned eligible beasts: 畢方／夫諸／應龍／白澤.
- Exactly 3 must be selected before confirmation.
- Retry returns to 0/3 selection.
- Blessing choices may include selected-beast-specific and shared Blessings, but never a tower-specific Blessing for the omitted fourth beast.
- First successful Level6 clear adds 句芒 to the owned roster and may show the unlock presentation once.
- 句芒 is not usable in the Level6 battle that unlocks it.
- While Level7 is absent from playable level data, Level6 victory shows no next-level action.
- When Level7 is later added, Level6 victory should expose it through the same generic next-level lookup, and the Level7 lineup should automatically include 句芒 if eligible.
- The lineup UI must render from roster/progression data and remain usable at 390px / 390×700 when the owned roster grows from four to five beasts.

## 14. Level6 gameplay balance / sunlight / Boss design — implementation-prep baseline

These values are the current agreed design baseline for implementation preparation. They may still be tuned after executable simulation/runtime evidence, but Work must not invent different mechanics or numbers without recording the reason.

### Enemy base data

- 陽羽: HP **90**, Speed **86**, Base Damage **1**, Reward **13**.
- 扶桑甲獸: HP **350**, Speed **26**, Base Damage **3**, Reward **28**.
- 金烏: Base HP **6200**, Speed **17**, Base Damage **20**, Reward **0**; Boss.

### Sunlight zones / activation

- Sunlight A candidate gameplay bounds: `x=137, y=90, width=85, height=34`.
- Sunlight B candidate gameplay bounds: `x=302, y=365, width=61, height=49`.
- W1–W9: A/B alternate every **6 seconds**, with exactly one gameplay-active zone at a time.
- Gameplay state switches immediately; presentation may cross-fade for about **0.25s** without extending gameplay state.
- Enemy sunlight membership is determined from the enemy logical/path position, not sprite alpha-bounds overlap.
- Active-zone VFX should be clearly visible but not obscure units; inactive zones may remain as a very faint landmark.

### Sunlight effects

- 陽羽 inside active sunlight: Speed × **1.28**; leaving the active zone removes the boost immediately; no lingering buff.
- 扶桑甲獸 inside active sunlight: **陽木甲**, damage taken × **0.75**. Leaving the active zone or zone deactivation removes the armor immediately and triggers the armor-break presentation once.
- 陽木甲 break VFX is a state-removal presentation, not a separate damage-threshold armor-break mechanic.
- 金烏 inside active sunlight: **日輪護體**, damage taken × **0.80**. Outside active sunlight the shield is off.

### Wave 1–10 baseline

| Wave | Composition | interval | hpMultiplier | bossHpMultiplier |
|---|---|---:|---:|---:|
| W1 | 陽羽 ×6 | 1.10 | 1.00 | — |
| W2 | 陽羽 ×8 | 1.00 | 1.00 | — |
| W3 | 陽羽 ×6 + 扶桑甲獸 ×2 | 1.00 | 1.00 | — |
| W4 | 扶桑甲獸 ×4 | 1.05 | 1.00 | — |
| W5 | 陽羽 ×10 + 扶桑甲獸 ×3 | 0.90 | 1.05 | — |
| W6 | 陽羽 ×14 + 扶桑甲獸 ×4 | 0.78 | 1.10 | — |
| W7 | 陽羽 ×8 + 扶桑甲獸 ×7 | 0.82 | 1.15 | — |
| W8 | 陽羽 ×16 + 扶桑甲獸 ×6 | 0.68 | 1.25 | — |
| W9 | 陽羽 ×18 + 扶桑甲獸 ×8 | 0.62 | 1.35 | — |
| W10 | 陽羽 ×8 + 扶桑甲獸 ×4 + 金烏 ×1 | 0.82 | 1.20 | 1.10 |

- W10 boss runtime HP baseline: `6200 × 1.10 = 6820`.
- W10 should interleave Boss pressure with remaining minions instead of waiting for every minion to finish before Boss appearance. Preserve global visual spacing when ordering the queue.

### 金烏 P1 / P2

- P1: follows normal A/B 6-second alternating sunlight. No extra periodic heal, invulnerability, summon, or tower-stun mechanic.
- Phase 2 triggers once at **50% HP**.
- Phase 2 / **十日凌空**: A and B become simultaneously active for the rest of the Boss battle.
- Phase 2 speed multiplier: × **1.12** (17 → ~19.0).
- 日輪護體 remains location-bound in P2; 金烏 only receives the ×0.80 damage-taken multiplier while logically inside A or B.
- Phase transition is presentation, not a gameplay pause. Suggested transition VFX duration ~**0.8s**.
- HP is continuous across the phase transition; P2 does not refill or create a second health bar.

### Victory condition

Level6 victory requires all of the following:

1. Wave 10 spawn queue is empty.
2. All normal enemies are resolved.
3. 金烏 is defeated.

Boss death alone must not end the level if normal enemies remain; Wave completion alone must not end the level while 金烏 is alive.

### Blessing scope

- Do not add Level6-only Blessings merely for the sunlight mechanic.
- Reuse the shared Blessing system and filter tower-specific choices by the selected lineup as defined by `AGENTS.md` Section 15.

### Runtime verification focus

- Confirm the sunlight speed/armor/shield states are visibly readable at 390px.
- Confirm T1/T2 interaction with A and T5/T8 interaction with B.
- Smoke T6/T7 because the lower-left hairpin creates repeated path coverage; do not pre-nerf shared tower stats.
- Balance tuning after simulation may adjust Level6-only enemy/Wave numbers, but it must not change completed Level1–5 gameplay.


## 15. Final source-image set

The player has supplied the complete Level6 source-image set: **12 / 12 planned assets**.

Source/runtime format, alpha requirements, original dimensions, target filenames, and optimization status are recorded in `docs/levels/LEVEL6_ASSET_MANIFEST.md`.

Important:
- only the map background is expected to remain JPG/WebP without alpha;
- enemy/Boss sprites, VFX, unlock art, and Boss HUD require transparent-alpha runtime assets;
- JPEG source art with white background is accepted only as source/reference and must be background-removed before deployment;
- source collection is complete, but runtime optimization / alpha cleanup / anchor measurement / HUD audit are still pending.

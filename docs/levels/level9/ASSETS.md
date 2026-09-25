# Level9 — Asset / VFX Ledger

## Status
**GATE E — PLAYER REVIEW / INVENTORY PROPOSAL**

## Generation status vocabulary
- APPROVED_FOR_GENERATION
- MOCKUP_APPROVED_ONLY
- PENDING_DISCUSSION
- PROCEDURAL_FIRST
- REUSE_APPROVED
- GENERATED_UNAPPROVED
- APPROVED_FINAL

## A. Approved existing / carry-over

| ID | Item | Production role | Classification | Status |
|---|---|---|---|---|
| L9-A001 | `bg_zhongshan_extreme_night_v1.jpg` | Level9 battlefield background | JPG runtime background | APPROVED_FINAL |
| L9-A002 | 玄龜 existing tower sprite | first-playable Level9 tower | Existing transparent PNG | REUSE_APPROVED |
| L9-A003 | 玄龜 base projectile + 潮震 | inherited attack presentation | Procedural-first | REUSE_APPROVED |
| L9-A004 | shared tower-slot / shared common UI | existing architecture | Existing shared assets | REUSE_APPROVED |

### Background contract
- clean source: **1024×1536**
- runtime: **780×1220 JPG**
- logical display: **390×610**
- SHA-256: **c7efc42eeca17c494d6b53c551ad0fc6e783358dc221409730ea3ff0ec5fee99**
- registration must remain exactly aligned to Level9 `GEOMETRY.md`.
- no labels/debug route/T1–T8 are baked into runtime art.

## B. New character / UI images proposed

| ID | Proposed filename | Subject | Classification | Status | Requirements |
|---|---|---|---|---|---|
| L9-A010 | `enemy_tiangou_v1.png` | 天狗 | PNG-first | APPROVED_FOR_GENERATION | transparent; lean fast silhouette; simplified large color blocks; readable ~36–44px |
| L9-A011 | `enemy_zheng_v1.png` | 猙 | PNG-first | APPROVED_FOR_GENERATION | transparent; visibly heavier than 天狗; no silhouette confusion at 390px |
| L9-A012 | `boss_zhulong_v1.png` | 燭龍 base/P1 | PNG-first | APPROVED_FOR_GENERATION | transparent; long-dragon identity but compact readable silhouette; no baked aura/state tint |
| L9-A013 | `ui_boss_zhulong_panel_v1.png` | 燭龍 Boss HUD frame | PNG-first | APPROVED_FOR_GENERATION | fixed released outer footprint; name area + empty HP channel; no baked HP fill |
| L9-A014 | `unlock_dijiang_v1.png` | 帝江 unlock presentation | PNG-first | APPROVED_FOR_GENERATION | transparent; simplified recognizable silhouette; this is unlock art, not Level9 playable tower art |

## C. Gameplay VFX — no static image unless runtime evidence fails

| ID | Effect | Classification | Status | Phone-readability contract |
|---|---|---|---|---|
| L9-A020 | 晝相 overall state | Procedural-first | PROCEDURAL_FIRST | warm red-gold overall cue + localized central shrine cue; tint alone insufficient |
| L9-A021 | 夜相 overall state | Procedural-first | PROCEDURAL_FIRST | indigo/cold-blue overall cue + localized shrine cue; tint alone insufficient |
| L9-A022 | 0.8s state-switch telegraph | Procedural-first | PROCEDURAL_FIRST | visible at 390px before switch; localized pulse/corona around (203,251) plus restrained battlefield cue |
| L9-A023 | 天狗 晝相 acceleration | Procedural-first | PROCEDURAL_FIRST | short warm speed streak / foot trail, visually distinct but not projectile-like |
| L9-A024 | 猙 夜甲 | Procedural-first | PROCEDURAL_FIRST | cold rim/shield pulse or body outline; must clearly communicate mitigation |
| L9-A025 | 燭龍 P2 transition | Hybrid / procedural overlay | PROCEDURAL_FIRST | strong one-time state transition on base Boss sprite; avoid second static sprite unless runtime readability proves necessary |
| L9-A026 | 帝江 混沌震 | Procedural-first for future Level10 | PROCEDURAL_FIRST | radial distortion/ring; no Level9 combat integration |
| L9-A027 | 玄龜 潮震 | inherited procedural | REUSE_APPROVED | 4-hit → 0.35s contraction → twin water rings + splash readable on first Level9 use |

## D. Environment Motion Lite proposal

Exact anchors are tied to the approved clean background and remain presentation-only.

| ID | Effect | Classification | Status | Intent |
|---|---|---|---|---|
| L9-A030 | high-altitude cloud drift | Procedural-first | PROCEDURAL_FIRST | slow low-contrast drift in open chasm/sky regions |
| L9-A031 | red banner micro-sway | Procedural-first | PROCEDURAL_FIRST | low-frequency small-angle sway on visible hanging banners |
| L9-A032 | celestial armillary/corona breathing | Procedural-first | PROCEDURAL_FIRST | subtle low-frequency light motion at central anchor; not the gameplay telegraph itself |
| L9-A033 | sparse ember/star drift | Procedural-first | PROCEDURAL_FIRST | very low density; subordinate to combat |

Motion Lite target: **2–4 effects total**; each must be recognizable at 390px when the player knows where to look, but must not resemble attack/Boss telegraphs.

## E. Spawn / Base
- Spawn and Base architectural/portal identity is already baked into the approved background.
- No separate Spawn/Base PNG is required unless runtime layering later proves necessary.
- Program-rendered labels are optional presentation and must not replace the visible architecture.

## F. Image generation sub-batches

### Batch 1 — normal enemies
1. 天狗
2. 猙

### Batch 2 — Boss + fixed HUD
3. 燭龍 base/P1
4. 燭龍 Boss HUD empty-slot frame

### Batch 3 — progression unlock
5. 帝江 unlock image

Do not generate later batches before the earlier batch is reviewed unless the player explicitly says to continue through them.

## G. Final-fileset / ZIP rule
Before Work implementation:
1. player re-uploads/identifies the exact final files actually accepted;
2. Chat reconciles exact filenames, dimensions, alpha, byte size and checksum;
3. background + character/UI assets + canonical docs + geometry/reference overlay are packed;
4. procedural VFX remain specifications/code requirements, not fake PNG placeholders;
5. only after **FINAL FILESET AUDIT PASS** may Chat produce the minimal Work ZIP.

## Gate E exit decision
Player must approve or revise:
- the 5-image new PNG inventory;
- Procedural-first decisions for 晝夜 / enemy state cues / 燭龍 P2;
- Motion Lite family;
- three generation sub-batches.

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
| L9-A010 | `enemy_tiangou_v1.png` | 天狗 | PNG-first | APPROVED_FINAL | 512×365 RGBA; 138,441 bytes; SHA-256 `8f00d39cd242ffb7be8e279b96bb86dd2fe74329c1ca21a0073c5ef7010ffa2b`; simplified white-head/charcoal/red blocks; phone-readable |
| L9-A011 | `enemy_zheng_v1.png` | 猙 | PNG-first | APPROVED_FINAL | 512×382 RGBA; 160,089 bytes; SHA-256 `aab0d8e90decd535b74912f6f946472fa085b5d7f7a2da7ca00c329c1cea7680`; red heavy feline / five-tail / single-horn silhouette |
| L9-A012 | `boss_zhulong_v1.png` | 燭龍 base/P1 | PNG-first | APPROVED_FINAL | 640×445 RGBA; 271,978 bytes; SHA-256 `e9aab92330528ca99048fe2b2944eaf96733f307f836775a24e067b37d7390d9`; simplified red/black/ivory blocks; no baked aura/state tint |
| L9-A013 | `ui_boss_zhulong_panel_v1.png` | 燭龍 Boss HUD frame | PNG-first | APPROVED_FINAL | 1152×324 RGBA; 264,018 bytes; SHA-256 `eddea739a9a2f661baf1910965fc7a14348a097f7408871a93e7e7d1cff36960`; fixed 44px runtime slot; upper-center name reserve + one middle/lower empty HP channel; no baked text/fill |
| L9-A014 | `unlock_dijiang_v1.png` | 帝江 unlock presentation | PNG-first | APPROVED_FINAL | 512×375 RGBA; 166,729 bytes; SHA-256 `3813ae7912511c94eb53a5546923d43a9b21325f700bbe778196a51a80764cc2`; simplified unlock-only presentation, not Level9 playable tower art |

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

## Gate E / Gate F closure
- Player approved the complete five-image inventory and each image sequentially.
- Final static audit PASS: all five production PNGs are RGBA with real transparency; phone-scale silhouette audit passed; HUD 390×44 footprint preview remained readable.
- Procedural-first decisions for 晝夜 / enemy state cues / 燭龍 P2 / Motion Lite remain frozen as code requirements rather than fake PNGs.
- Gate E inventory planning is CLOSED.
- Gate F asset production/static audit is COMPLETE.
- Exact final file identities/dimensions/byte sizes/checksums above are the canonical final-fileset contract for packaging.


## H. Level9 Boss HUD runtime-alignment decision — FROZEN
- The accepted 燭龍 HUD direction follows the shared runtime overlay architecture rather than artwork-only layout.
- Runtime outer slot: **44 px high**, unchanged.
- Runtime Boss name: program text, upper center, approximately **top 2px / left 20% / width 60%**.
- Runtime HP track: separate middle/lower rectangle supplied by `BOSS_HUD_GEOMETRY`; Level9 implementation must choose/tune the Level9 track rectangle so it lands inside the accepted visible empty channel.
- Source-art proportion reference: released Level7 夔 HUD **1152×351 (~3.28:1)** wide/flat footprint.
- PNG contains frame/background only: **no baked 燭龍 text, no HP fill, no HP number**.
- Decorative dragon/flame shapes must stay outside the practical text/track read zones.
- The previously generated two-large-box HUD concepts are **REJECTED / SUPERSEDED**.
- The latest player-accepted HUD with a small upper-center name reserve and one long central/lower empty HP channel is the canonical visual direction for `L9-A013`.
- Final exact file still enters the final-fileset audit later; visual approval does not bypass dimensions/alpha/checksum reconciliation.

# Level9 — Asset / VFX Ledger

## Status
**GATE F — FINAL FILESET AUDIT PASS / GATE G HANDOFF READY**

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
- runtime JPG bytes: **516,931**
- runtime SHA-256: **bab355fb7c323f8d150e4bb55237f9cd63dfccb50c36622262300d1473c179ec**
- registration must remain exactly aligned to Level9 `GEOMETRY.md`.
- no labels/debug route/T1–T8 are baked into runtime art.

## B. New character / UI images proposed

| ID | Proposed filename | Subject | Classification | Status | Requirements |
|---|---|---|---|---|---|
| L9-A010 | `enemy_tiangou_v1.png` | 天狗 | PNG-first | APPROVED_FINAL | runtime 512×364 RGBA; 149,653 bytes; SHA-256 `d0f8b77457a2d55f3c225ec14d268ac74838bc9f10cede9ddc1da8c2f586cc55`; exact re-upload source recorded below |
| L9-A011 | `enemy_zheng_v1.png` | 猙 | PNG-first | APPROVED_FINAL | runtime 512×376 RGBA; 184,120 bytes; SHA-256 `330cbaae04bd40ed2952f1af45e5fbe152fe0f3ef1d5ea33b7eadb4539960b61`; exact re-upload source recorded below |
| L9-A012 | `boss_zhulong_v1.png` | 燭龍 base/P1 | PNG-first | APPROVED_FINAL | runtime 640×442 RGBA; 324,156 bytes; SHA-256 `9e152e176cbd6ff2da90d6e735d77479fe13244553dee903b30fc4f6446984ee`; exact re-upload source recorded below |
| L9-A013 | `ui_boss_zhulong_panel_v2.png` | 燭龍 Boss HUD frame | PNG-first | PLAYER_REPLACEMENT / ENGINEERING_VERIFYING | valid 768×213 RGBA PNG; 106,121 bytes; SHA-256 `e7e243c9a339626a5735ce6bc81853f247a38900338d8a56c45d286859efe9f2`; fixed 44px runtime slot |
| L9-A014 | `unlock_dijiang_v1.png` | 帝江 unlock presentation | PNG-first | APPROVED_FINAL | runtime 512×382 RGBA; 196,178 bytes; SHA-256 `4234e1b087399e9886e51cd44f77855d58ed074f9e7c825b4adc16c9f067591a`; unlock-only presentation |

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
- Gate E inventory planning is CLOSED.
- Player approved each required image sequentially.
- Player re-uploaded all six concrete final source files.
- FINAL FILESET AUDIT PASS against those exact uploaded bytes.
- Chat-side transparent-PNG conversion, trimming/resizing/optimization, background-JPG conversion, checksum generation and registration recheck are complete.
- Procedural-first decisions for 晝夜 / enemy state cues / 燭龍 P2 / Motion Lite remain frozen as code requirements rather than fake PNGs.
- Gate F is COMPLETE.
- Gate G production implementation handoff is now valid.

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
- Final exact HUD source was re-uploaded and reconciled in Section J; dimensions/alpha/checksum audit is complete.


## I. Level9 handoff packaging correction — 2026-09-25
- The previously created Level9 ZIP was produced too early and is **INVALID FOR WORK HANDOFF**.
- Reason: the permanent Final Fileset rule requires the player to re-upload the exact accepted/downloaded final files before Chat may claim FINAL FILESET AUDIT PASS or create the implementation ZIP.
- Visual approval of an image in Chat is not equivalent to proof that the exact player-held file is the packaged source.
- After re-upload, Chat must compare the concrete files against this ledger, then create runtime candidates/checksums.
- Handoff structure should follow the established prior-level convention:
  - `source/` = player's exact re-uploaded approved source files;
  - `runtime_candidates/` = Chat-normalized/optimized integration copies;
  - `reference/` = geometry/registration evidence only when needed, never runtime assets;
  - `ASSET_MANIFEST.json`;
  - `SHA256SUMS.txt`;
  - `WORK_INTEGRATION_PROMPT.txt`.
- Work receives only the irreducible production integration/tests/release delta after Chat finishes all static preparation.


## J. Exact player re-upload audit — FINAL FILESET AUDIT PASS

The six files below are the exact player re-uploaded attachments used as the final source-of-truth for packaging:

| Role | Exact uploaded filename | Format / dimensions | Bytes | SHA-256 |
|---|---|---:|---:|---|
| 天狗 | `F171A2C9-332B-4550-9E5C-60EFE89D31DD.jpeg` | JPEG RGB 1536×1024 | 237,533 | `3865f2e0e6db43de0e922117358c5fdee919160d15c6161d8025a0bd272c156c` |
| 猙 | `A8380094-1B6D-461A-963F-66910DC06A44.jpeg` | JPEG RGB 1536×1024 | 282,834 | `d642fe61dce08f2fb21ea84d075eeaefeb1c0a418c455069051ff3cea0d7d040` |
| 燭龍 | `F2DD871A-D2E5-4454-92D5-523A58553EB0.jpeg` | JPEG RGB 1536×1024 | 407,416 | `4011d35f729e16bf84f4f7ea0240978f96767a026646fd6189182ed7132b2392` |
| 燭龍 HUD | `042B5FE8-70D0-405D-A5B6-BA42C6265785.png` | PNG RGBA 2172×724 | 832,929 | `7109c77c05e616039d22339de95eb74bae182e329401c46f16ff75adc8419e4f` |
| 帝江 unlock | `775EBE9E-4F5C-4C54-8F8D-BB268ECB2C29.jpeg` | JPEG RGB 1536×1024 | 323,067 | `35b5a8cbebd3d79a00729960dbcf907a5c5518d7e7b62efd08c8544591d24dd4` |
| Level9 background | `EA953F84-13E0-47B5-8489-52FDD8F12788.jpeg` | JPEG RGB 1024×1536 | 996,503 | `525202e10eec34f0a54c1ac477c9a6302ca5f0a31a1306d92f5a7304bdc43324` |

Chat-owned runtime preparation completed:
- four JPEG character/unlock sources were background-removed and converted to transparent RGBA PNG;
- HUD retained source alpha and was cropped/normalized without redesign;
- background was resized/optimized to `780×1220` JPG;
- exact re-uploaded background was rechecked with canonical geometry and registration PASS;
- all runtime candidates decode successfully;
- procedural-first effects remain code requirements and no redundant VFX PNGs were added.

Runtime background:
- `bg_zhongshan_extreme_night_v1.jpg`
- 780×1220 RGB
- 516,931 bytes
- SHA-256 `bab355fb7c323f8d150e4bb55237f9cd63dfccb50c36622262300d1473c179ec`

Valid Work handoff:
- filename: `shanhaijing_td_level9_minimal_handoff_v3.zip`
- SHA-256: `efeb32e0b30486d456d7619e0d75779bb356988eb1b20a9311dbbb3a8337ff51`
- structure: `source/`, `runtime_candidates/`, `reference/`, `ASSET_MANIFEST.json`, `SHA256SUMS.txt`, `WORK_INTEGRATION_PROMPT.txt`
- the earlier premature Level9 ZIP remains **INVALID / SUPERSEDED**.


## K. Canonical handoff filenames — v2 correction
The valid Work ZIP uses semantic filenames in both audit and integration folders to prevent UUID attachment names from being mistaken for runtime paths.

### Canonical source aliases inside the valid handoff ZIP
These files preserve the **exact re-uploaded bytes**; only the ZIP-internal filename is normalized:
- `source/enemy_tiangou_v1.jpeg` ← exact 天狗 JPEG bytes
- `source/enemy_zheng_v1.jpeg` ← exact 猙 JPEG bytes
- `source/boss_zhulong_v1.jpeg` ← exact 燭龍 JPEG bytes
- `source/ui_boss_zhulong_panel_v1.png` ← exact HUD PNG bytes
- `source/unlock_dijiang_v1.jpeg` ← exact 帝江 JPEG bytes
- `source/bg_zhongshan_extreme_night_v1.jpeg` ← exact clean-background JPEG bytes

### Program-ready runtime filenames
Work must wire **only these files** into runtime asset paths:
- `runtime_candidates/enemy_tiangou_v1.png`
- `runtime_candidates/enemy_zheng_v1.png`
- `runtime_candidates/boss_zhulong_v1.png`
- `runtime_candidates/ui_boss_zhulong_panel_v1.png`
- `runtime_candidates/unlock_dijiang_v1.png`
- `runtime_candidates/bg_zhongshan_extreme_night_v1.jpg`

All five character/UI runtime assets are RGBA PNG. The battlefield is intentionally JPG, matching the project background convention.

Valid corrected handoff:
- filename: `shanhaijing_td_level9_minimal_handoff_v3.zip`
- SHA-256: `efeb32e0b30486d456d7619e0d75779bb356988eb1b20a9311dbbb3a8337ff51`
- previous non-v2 handoff is **SUPERSEDED**.


## L. Dynamic released-baseline handoff rule
- Work must resolve the protected/reference baseline from the **currently released product state at execution time**.
- Do not interpret historical phrases such as `Level1–8` as permanent future scope.
- At this Level9 handoff, Level1–8 happen to be the released baseline; after later releases, the protected/reference baseline expands automatically.
- Regression remains impact-driven: do not rerun or alter unaffected released levels merely because they are part of the baseline.
- Valid handoff is now `shanhaijing_td_level9_minimal_handoff_v3.zip`, SHA-256 `efeb32e0b30486d456d7619e0d75779bb356988eb1b20a9311dbbb3a8337ff51`.
- The earlier handoff package v2 is superseded by handoff package v3.


## M. 2026-09-26 player-replacement HUD correction
- Physical-phone smoke showed the programmatic `燭龍` name and HP fill visually misaligned with the previous frame; the player supplied the replacement source used here.
- Uploaded source is a valid 2172×724 RGBA PNG, 704,668 bytes, SHA-256 `2edafb3749ed49e2fdb0d06d5401da0085e25b4653261a37f632be25daa8e3ef`.
- Runtime asset is `assets/ui/ui_boss_zhulong_panel_v2.png`: valid 768×213 RGBA PNG, 106,121 bytes, SHA-256 `e7e243c9a339626a5735ce6bc81853f247a38900338d8a56c45d286859efe9f2`.
- Transparent trim + aspect-preserving resize reduced transfer size by **84.9%** versus the uploaded source. Visible-art ratio is preserved from about **3.851:1** to **3.850:1** without stretching.
- Runtime keeps the shared **44 px** outer Boss slot. The visible name reserve measures source x310–458 / y80–106; the programmatic name uses `top: 7px`, `left: 39.4%`, `width: 21.2%`, `font-size: 12px`, `line-height: 12px`.
- Conservative HP groove interior measures source x134–632 / y120–138; runtime geometry is `left 14.2% / top 59.4% / width 71.3% / height 12.6%`.
- `border-image-slice` for the compressed v2 source is **35 fill**.
- The original re-uploaded v1 source/checksum records above remain historical audit evidence; they are not deleted or rewritten.
- Engineering and deployed visual verification are still required; player phone confirmation remains separate.

# Level6・扶桑神域 — Chat Asset Audit

> Status: CHAT STATIC AUDIT COMPLETE / RUNTIME EXECUTION PENDING  
> This document records all asset work Chat could safely complete before a Work handoff, in accordance with `AGENTS.md` Chat-first rules and `docs/ASSET_INTEGRATION_GUIDE.md`.

## 1. Final background / geometry source check

Player-supplied final background:
- source: `1E7B3F9B-6750-4ECC-BA6B-BC393C5E4103.jpeg`
- source size: **982×1536**
- target logical map: **390×610**

The source aspect ratio and logical-map aspect ratio differ by only about **0.003%**, so no meaningful crop is required. A direct 390×610 resize preserves the same full composition used for the canonical Level6 geometry work.

The resized final source was compared against the previously prepared canonical `level6_bg_390x610.png`; the normalized pixel RMSE is about **0.0102**, consistent with compression/resampling differences rather than a different composition. Therefore:
- Geometry V4 remains the canonical path.
- The eight tower-slot coordinates do not need to be re-guessed.
- Sunlight A/B candidate bounds remain on the intended same map transform.
- Runtime still needs the normal debug-overlay / hit-area / visual smoke before the geometry can be labelled RUNTIME-VERIFIED.

Prepared background candidate:
- runtime: **390×610 JPG**
- quality: 84, 4:4:4
- size: about **109.6 KB**
- source size: about **766.1 KB**
- reduction: about **85.7%**

## 2. Deterministic alpha/background cleanup

Chat performed a non-generative, pixel-preserving background-removal pass for the JPEG source art. This is not AI re-generation and does not redraw the approved art.

Method:
- identify border-connected near-white background;
- remove only the connected background field;
- preserve enclosed internal whites such as 句芒's white plumage and bright VFX cores;
- apply a narrow edge feather;
- trim non-content transparent padding;
- inspect the results on both light and dark backgrounds.

The resulting sprites/VFX show clean silhouettes without an obvious white rectangle or black matte in the static contact-sheet audit.

Existing true-alpha PNG sources were preserved and only trimmed/resized:
- 陽羽加速 VFX
- 金烏日輪護體 VFX
- 金烏 Boss HUD

## 3. Prepared runtime candidates

| Runtime asset | Prepared pixels | Prepared size | Source size | Reduction |
|---|---:|---:|---:|---:|
| `bg_fusang_realm_v1.jpg` | 390×610 | 109.6 KB | 766.1 KB | 85.7% |
| `enemy_yangyu_v1.png` | 256×249 | 64.0 KB | 238.7 KB | 73.2% |
| `enemy_fusangjiashou_v1.png` | 256×229 | 84.1 KB | 276.0 KB | 69.5% |
| `boss_jinwu_v1.png` | 384×384 | 202.0 KB | 384.2 KB | 47.4% |
| `fx_yangyu_sunboost_v1.png` | 192×88 | 18.6 KB | 748.2 KB | 97.5% |
| `fx_yangmujia_on_v1.png` | 256×247 | 85.3 KB | 319.6 KB | 73.3% |
| `fx_yangmujia_break_v1.png` | 229×256 | 86.0 KB | 228.8 KB | 62.4% |
| `fx_jinwu_sunshield_v1.png` | 256×256 | 45.5 KB | 1022.4 KB | 95.6% |
| `fx_jinwu_phase2_v1.png` | 384×384 | 191.0 KB | 306.2 KB | 37.6% |
| `fx_sunlight_zone_v1.png` | 384×73 | 22.9 KB | 47.5 KB | 51.8% |
| `unlock_jumang_v1.png` | 307×384 | 144.3 KB | 304.7 KB | 52.7% |
| `ui_boss_jinwu_panel_v1.png` | 768×256 | 98.4 KB | 862.4 KB | 88.6% |

Total source transfer size: about **5.38 MiB**.  
Total prepared runtime candidates: about **1.12 MiB**.  
Static preparation therefore reduces this Level6 asset set by about **79%** before browser caching/compression effects.

All prepared files fall within the repository's existing target ranges.

## 4. Enemy/Boss visible-bounds audit

After background cleanup / trim / resize, using alpha > 16 as the visible-pixel audit threshold:

### 陽羽
- source runtime canvas: **256×249**
- visible bounds: approximately **244×235**
- visible-center anchorY: **0.496**
- intended render box: **40×40**
- calculated shared-spacing footprint: about **38.1 px**

Recommended config baseline:
```text
visual(40, 40, ~0.496, 256, 249, 244, 235)
```

### 扶桑甲獸
- source runtime canvas: **256×229**
- visible bounds: approximately **252×213**
- visible-center anchorY: **0.500**
- intended render box: **54×52**
- calculated shared-spacing footprint: about **53.2 px**

Recommended config baseline:
```text
visual(54, 52, 0.500, 256, 229, 252, 213)
```

### 金烏
- source runtime canvas: **384×384**
- visible bounds: approximately **372×384**
- visible-center anchorY: **0.500**
- intended render box: **84×84**
- calculated shared-spacing footprint: **84.0 px**

Recommended config baseline:
```text
visual(84, 84, 0.500, 384, 384, 372, 384)
```

These values fit the existing Level1–5 size classes and global footprint-based enemy-spacing architecture. Runtime integration must use the final committed optimized files and re-measure if any binary transformation changes their alpha bounds.

## 5. Boss HUD static channel audit

Player-supplied Jinwu Boss HUD:
- source: **2172×724 PNG RGBA**
- prepared runtime source panel: **768×256 PNG RGBA**
- panel ratio: exactly **3:1**, matching the established thin horizontal Boss-panel family
- no baked Boss name
- no baked HP number
- no fixed HP fill
- center contains a measurable empty/transparent channel

A conservative source-space empty-channel rectangle was found at approximately:
- x: **270–1900**
- y: **340–412**

Normalized source guidance:
- left: ~**12.4%**
- top: ~**47.0%**
- width: ~**75.0%**
- height: ~**9.9%**

This is **source-panel guidance only**, not the final `BOSS_HUD_GEOMETRY.jinwu`. The repository's existing CSS border-image / nine-slice changes rendered geometry, so the final trackRect still belongs to Work/browser runtime measurement. Work must verify 100% / 50% / 25% fill in the actual 44px Boss HUD.

## 6. Runtime/preload recommendation

Blocking should remain limited to what is needed to enter Level6 / first preparation screen.

Recommended Level6 loading groups:

### Required / first-screen
- shared slot platform
- Level6 background
- Level6 Spawn
- Level6 Base
- current lineup tower art already required by the shared lineup/build UI
- first-wave enemy: 陽羽

### Deferred before first use
- 扶桑甲獸
- 金烏
- 陽羽 speed VFX
- 陽木甲 ON / BREAK VFX
- 金烏 shield VFX
- 金烏 Phase2 VFX
- sunlight-zone VFX if it is not visible before combat begins
- Jinwu Boss HUD
- 句芒 unlock art

Do not make the entire Level6 asset set blocking merely to hide first-use delays.

## 7. Items intentionally not completed in Chat

The following remain Work-only or runtime-dependent:

- commit/integrate the runtime binaries into the real repository asset tree;
- execute code changes across gameData / map / Renderer / BossSystem / UI / progression systems;
- final Boss HUD rendered `trackRect`;
- executable automated tests and regression suite;
- browser/runtime smoke;
- actual Pages deployment;
- runtime confirmation of slot platform center, pointer hit area, path overlay, sunlight zone drawing, and VFX scale;
- balance simulation / tuning evidence.

These are the only categories that should remain in the Work handoff after the package is assembled.

## 8. Handoff rule

Do **not** send Work the original full discussion.

The eventual Work package must include:
- the 12 approved source assets only when Work needs the source for reproducibility;
- preferably the prepared runtime candidates so Work does not repeat Chat-owned image processing;
- the canonical Level6 spec / manifest / this audit;
- one short integration TXT that references repository hard rules and lists only unresolved implementation + executable verification work.

No Work ZIP should be generated until the remaining Chat-owned package checks are finished.

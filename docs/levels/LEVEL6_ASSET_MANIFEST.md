# Level6・扶桑神域 — Asset Manifest

> Status: SOURCE SET COMPLETE / RUNTIME OPTIMIZATION PENDING  
> This manifest records the complete Level6 source-image set supplied by the player before implementation. Runtime assets must follow `docs/ASSET_INTEGRATION_GUIDE.md`.

## 1. Source set completeness

Received source images: **12 / 12 planned assets**.

| # | Use | Received source | Source size | Source format | Runtime target | Alpha required | Status |
|---|---|---|---:|---|---|---|---|
| 1 | Level6 background | `1E7B3F9B-6750-4ECC-BA6B-BC393C5E4103.jpeg` | 982×1536 | JPEG | `bg_fusang_realm_v1.jpg` | No | READY FOR CROP/RESIZE/COMPRESS |
| 2 | 陽羽 enemy | `9D172EC6-58F3-44D9-B08D-6E843ECD7921.jpeg` | 1254×1254 | JPEG | `enemy_yangyu_v1.png` | Yes | NEEDS BACKGROUND REMOVAL + PNG |
| 3 | 扶桑甲獸 enemy | `5AD2A9D5-2434-44D4-914C-3D1AC2B64C49.jpeg` | 1254×1254 | JPEG | `enemy_fusangjiashou_v1.png` | Yes | NEEDS BACKGROUND REMOVAL + PNG |
| 4 | 金烏 Boss | `543B7E54-64DA-4DDC-A922-D704CE146E6A.jpeg` | 1254×1254 | JPEG | `boss_jinwu_v1.png` | Yes | NEEDS BACKGROUND REMOVAL + PNG |
| 5 | 陽羽日照加速 VFX | `A4E5AE84-7BCB-4CB9-8238-E9A2EAB1AC14.png` | 1254×1254 | PNG RGBA | `fx_yangyu_sunboost_v1.png` | Yes | ALPHA PRESENT / OPTIMIZE ONLY |
| 6 | 陽木甲 ON VFX | `8F2461BB-B2CF-45C3-B310-60BAD1B36B51.jpeg` | 1254×1254 | JPEG | `fx_yangmujia_on_v1.png` | Yes | NEEDS BACKGROUND REMOVAL + PNG |
| 7 | 陽木甲 BREAK VFX | `B946111B-EFAC-40B0-80C1-CA59DEDB044F.jpeg` | 1254×1254 | JPEG | `fx_yangmujia_break_v1.png` | Yes | NEEDS BACKGROUND REMOVAL + PNG |
| 8 | 金烏日輪護體 VFX | `1CA2258A-9B74-45AE-B16D-FFEB209DBAFF.png` | 1254×1254 | PNG RGBA | `fx_jinwu_sunshield_v1.png` | Yes | ALPHA PRESENT / OPTIMIZE ONLY |
| 9 | 金烏 Phase2 / 十日凌空 VFX | `01242052-9BC3-4090-89A5-01D4960C2B55.jpeg` | 1254×1254 | JPEG | `fx_jinwu_phase2_v1.png` | Yes | NEEDS BACKGROUND REMOVAL + PNG |
| 10 | 日照區 VFX | `B3023320-9A38-4EA8-B599-C695EEBC1EA2.jpeg` | 1536×512 | JPEG | `fx_sunlight_zone_v1.png` | Yes | NEEDS BACKGROUND REMOVAL + PNG |
| 11 | 句芒 unlock art | `A57C6580-C9FD-4189-91BB-96FFE7508F28.jpeg` | 1122×1402 | JPEG | `unlock_jumang_v1.png` | Yes | NEEDS BACKGROUND REMOVAL + PNG |
| 12 | 金烏 Boss HUD | `699D388A-8655-478B-9090-40D78EC3794E.png` | 2172×724 | PNG RGBA | `ui_boss_jinwu_panel_v1.png` | Yes | ALPHA PRESENT / HUD AUDIT + OPTIMIZE |

## 2. Format decision

Only the **map background** should remain non-alpha image data by default.

- Background: JPG/WebP is correct and preferred for transfer size.
- Enemy sprites, Boss sprite, VFX, unlock art, and Boss HUD must use transparent-alpha PNG/WebP in production.
- The player's JPEG character/VFX sources are accepted as source art, but they are **not deployment-ready** because their white backgrounds must be removed.
- Do not convert JPEG → PNG by file extension alone. Background removal and fringe cleanup must happen first.
- Existing PNG sources #5, #8, and #12 already contain real alpha data; preserve it during optimization.

## 3. Runtime-size preparation

Final runtime dimensions must be derived from actual display size, visible alpha bounds, and reasonable DPR. Current design targets remain:

- 陽羽 rendered box: about **40×40 px**.
- 扶桑甲獸 rendered box: about **54×52 px**.
- 金烏 rendered box: about **84×84 px**.
- Source files should normally be reduced to compact runtime pixel dimensions rather than deployed at 1122–2172 px.
- VFX dimensions must be set from the affected unit/zone, not from source canvas size.
- Boss HUD should be reduced to the established thin-panel pipeline size/ratio after its empty HP channel is audited.
- Background must be cropped/mapped to the canonical 390×610 Level6 transform before final compression.

## 4. Required image-processing audit

Before a Work handoff is built:

1. preserve these 12 original source files as source/reference assets;
2. remove white backgrounds from JPEG sprites/VFX/unlock art;
3. inspect anti-aliased edges for white/black fringe;
4. trim unnecessary transparent padding;
5. measure visible alpha bounds;
6. determine runtime sprite anchor / footprint from the optimized image, not the source canvas;
7. resize/compress into production runtime copies;
8. record source pixels/bytes → runtime pixels/bytes;
9. verify no crop destroys feathers, leaves, glow, horns, claws, armor fragments, or HUD decoration;
10. assign required/deferred preload grouping.

## 5. Boss HUD special audit

`ui_boss_jinwu_panel_v1.png` is a source candidate, not yet runtime-verified.

Required before integration:

- confirm it stays compatible with the existing Level1–5 thin Boss HUD DOM/CSS contract;
- retain transparent outer/background regions;
- verify the central HP channel is truly empty and measurable;
- measure the rendered channel through the actual border-image/nine-slice pipeline;
- add `BOSS_HUD_GEOMETRY.jinwu`;
- test 100% / ~50% / ~25% code-driven fill entirely inside the channel;
- do not add fixed Boss name, HP number, or baked HP fill to the image.

## 6. Handoff state

The source-image collection gate is now **COMPLETE**.

Still pending before the Work ZIP:

- Chat-owned background/source audit against canonical Geometry V4;
- sprite/VFX alpha conversion and visible-bound/anchor measurements where reliably possible;
- runtime size and preload manifest finalization;
- Boss HUD source-channel audit;
- final package naming and source/runtime separation.

Work should receive only the remaining implementation/executable-verification delta after these Chat-owned tasks are finished.

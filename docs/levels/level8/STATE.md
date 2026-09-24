# Level8 — Current State / Handoff

> New/returning sessions must first follow `AGENTS.md`, `docs/DEVELOPMENT_PLAYBOOK.md`, `docs/WORK_PROGRESS.md`, then this file.

## Active level
- Level: **8**
- Development phase: **RELEASE COMPLETE / FROZEN**
- Production implementation: **POST-RELEASE MOTION LITE READABILITY PASS RELEASED**
- Active canonical folder: `docs/levels/level8/`

## Current gate
**PLAYER PHONE VERIFICATION — MOTION LITE READABILITY**

### Allowed now
- verify the released fog / ripple / bubbles / reeds readability on a physical 390px-class phone;
- report concrete visual evidence if one of the four existing regions is still unreadable;
- preserve all anchors, geometry, map, 化蛇, HUD, waves, stats, tide timing, progression and tower systems.

### Forbidden until gate exit
- gate is closed; do not reopen Level8 design, gameplay, geometry, or assets without new concrete evidence;
- no unrelated Level1–7 work.

### Gate exit condition
Player confirms all four existing Motion Lite regions are directly recognizable on a physical phone without competing with enemies, projectiles, tide or Boss.

## Confirmed / approved
- Level1–7 remain frozen unless later evidence shows a shared regression.
- Level8 theme: **幽冥沼澤 / 毒霧濕地**.
- Level8 clear unlocks **玄龜** as the sixth deployable beast.
- Normal enemies are **長右** and **蠱雕**; Boss is **化蛇**.
- Environment mechanic is a shared **潮位 / 濕地活化** cycle, with species-specific 長右／蠱雕 benefits and 化蛇 forced-tide control.
- 玄龜 role is **潮震控場 / delayed area utility** with non-Boss path pushback.
- Level8 inherits the existing data-driven owned roster, exactly-3 lineup, Blessing filtering, Motion Lite, facing, spacing, release and verification rules.
- Future map design must define background aspect/display contract before geometry and asset approval.
- Environment Motion Lite is part of the Level8 design goal; exact elements are measured only after a background is approved.

## Current proposals — not yet frozen


## Completed
- Level8 canonical folder initialized.
- map/display contract frozen.
- player approved the Level8 Geometry Guide V1 route shape, upper-left Spawn, lower-center Base, and T1–T8 composition.
- exact geometry is now frozen from the approved guide/background: Spawn, 16 path anchors, Base, T1–T8, and three irregular wetland polygons in 390×610 logical coordinates.
- Environment Motion Lite anchors are frozen from visible background features: left-basin fog, central-pool ripples, right-middle bubble clusters, and middle-lower reed micro-sway.
- 長右 source art approved.
- 蠱雕 source art approved.
- 化蛇 source art approved.
- 化蛇 Boss HUD approved.
- 玄龜 source art **APPROVED_FINAL**: deep-green turtle body, gold shell ornaments, cyan water-pattern / water-vapor accents, no snake, simplified large color blocks; only the player-approved “這張可以” candidate is canonical.
- Later extra 玄龜 variant and the 劇毒蛙王 / frog-type monster are **REJECTED** and must not be used.
- 玄龜 ordinary attack / 潮震 VFX are frozen **procedural-only**; no static VFX art required.
- 玄龜 Blessings frozen: **玄波** (+20% 潮震 damage/layer), **闊潮** (+8 radius/layer), **回瀾** (+5 non-Boss push path-distance/layer); max 2 layers each.
- Work-budget/no-repeat/no-stall governance already lives in project-wide rules and must not be duplicated here.
- FINAL ASSET AUDIT PASS: approved JPEG sources retained; Chat-generated alpha PNG/runtime candidates verified for Level8 integration.

## Not completed
- physical-phone acceptance of direct fog / ripple / bubbles / reeds readability after PR #73.
- physical-phone confirmation that W10 now reads as 化蛇 + escort, with the opening tide visibly affecting 長右／蠱雕.

## Current branch / SHA
- current `main`: `f4205f7cb255e87e443ba7d47386d2f609d6bb28` (PR #73)
- completed Motion Lite branch: `fix/level8-motion-lite-readability-20260924`
- completed boss-flow branch: `fix/level8-huashe-boss-escort-20260923`
- previous alignment branch: `fix/level8-post-release-alignment-20260923`

## Verification status
- Motion Lite targeted tests: **57/57 PASS**.
- affected shared regressions: **75/75 PASS**.
- full `npm test`: **244/244 PASS** for PR #73.
- `npm run check`, changed-JS syntax and release-diff whitespace checks: PASS for PR #73.
- fresh PR #73 final review: **Ready to merge: Yes**, no Critical/Important/Minor findings.
- GitHub Pages deployment: PASS; public entry serves `level8-7` from main `f4205f7`.
- public exact 390×700 smoke: Level8 Wave 1, high-tide wetland and 化蛇 P1 states load successfully; four Motion Lite anchors remain fixed and supporting effects remain visually subordinate to combat.
- FINAL ASSET AUDIT / ZIP checksum: PASS.
- background normalization re-audit: PASS; runtime asset matches canonical center-crop/resize pipeline.
- canonical Spawn/Base/path anchors and T1–T8: unchanged.
- path/pad targeted renderer tests: **34/34 PASS**.
- runtime curve audit: old/new route lengths **1048.771 → 1058.486 (+0.926%)**; maximum curve departure **3.64 logical px**, within the 54 px road width; no canonical anchor moved.
- enemy anchor + affected motion/spacing regressions: **60/60 PASS**.
- Huashe fixed-footprint HUD/cache regressions: **52/52 PASS**.
- full `npm test`: **240/240 PASS**.
- `npm run check`, changed JS syntax checks, and release-diff whitespace check: PASS.
- fresh final review: **Ready to merge: Yes**, no Critical/Important findings.
- GitHub Pages deployment: PASS; public entry serves `level8-3`.
- public `?devMenu=1`: Level8 entry PASS; lineup shows five currently owned beasts and enforces exactly three.
- public 390×700: Level8 pads, Changyou/Gudiao road-center presentation, wetlands/Motion Lite and Huashe P1/P2 PASS.
- public HUD footprint comparison: Level8 Huashe and Level7 Kui both **44 px** Boss slot/HUD and **426 px** battlefield; no battlefield compression.
- Level8 victory/retry/progression logic was unchanged and remains covered by the green suite; historical public production-flow evidence remains valid.
- physical player-phone recheck is not claimed by Work.

## Do not redo
- do not retest or redesign completed Level1–7 unless a Level8 change actually affects a shared contract.
- do not ask the player to choose implementation details already covered by repository-safe defaults.
- do not regenerate or replace 長右、蠱雕、化蛇、化蛇 Boss HUD、玄龜; their canonical source-art decisions are already frozen.
- rejected 玄龜 / frog-type drafts must never be promoted merely because a file exists.

## Latest narrow follow-up
- PR #73 released the approved phone-readability-only Motion Lite tuning: fog alpha/drift 0.16 / 8 px; ripple 2 px with stronger expansion; five 2.5–4.3 px bubbles with clearer rise; reeds at 5 px low-frequency sway. No anchor or gameplay position changed.
- Player reconfirmed Geometry Guide V1 as the sole source of truth. Pixel re-audit showed the existing Spawn/path/Base/T1–T8 coordinates already match the guide; no gameplay geometry was moved.
- PR #68 merged to `main` at `12435e8c5820a8dafc50ab7ec92f12f0ae6f616b`.
- Level8 base-name text now renders centered below the canonical Base waypoint instead of the lower-right map corner.
- 化蛇 follow-up remains intentionally deferred until the player rechecks the map/base presentation.

## Next exact step
**Player performs a physical-phone acceptance pass for direct visibility of fog / ripple / bubbles / reeds. No implementation work remains unless that evidence shows a concrete readability defect.**

# Level8 — Current State / Handoff

> New/returning sessions must first follow `AGENTS.md`, `docs/DEVELOPMENT_PLAYBOOK.md`, `docs/WORK_PROGRESS.md`, then this file.

## Active level
- Level: **8**
- Development phase: **RELEASE COMPLETE / FROZEN**
- Production implementation: **POST-RELEASE 化蛇 FLOW FIX MERGED TO MAIN**
- Active canonical folder: `docs/levels/level8/`

## Current gate
**PLAYER PHONE VERIFICATION — 化蛇 BOSS-FLOW**

### Allowed now
- preserve the now player-confirmed Level8 geometry;
- change only W10 spawn sequencing so 化蛇 leads the escort;
- add the 0.8s opening tide telegraph and opening forced high tide;
- preserve all existing stats, P1/P2 cadence, HUD, progression and tower systems.

### Forbidden until gate exit
- gate is closed; do not reopen Level8 design, gameplay, geometry, or assets without new concrete evidence;
- no unrelated Level1–7 work.

### Gate exit condition
Satisfied: PR #66 merged, Pages serves `level8-3`, and public Level8/Level7 phone-size verification passed.

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
- physical-phone confirmation that W10 now reads as 化蛇 + escort, with the opening tide visibly affecting 長右／蠱雕.
- automated suite execution for PR #71 was not available from this Chat environment; regression coverage was added but execution is not claimed here.

## Current branch / SHA
- current `main`: `f592c541cc51a5a83e60bd86dc6c54eb903453de` (PR #71)
- completed boss-flow branch: `fix/level8-huashe-boss-escort-20260923`
- previous alignment branch: `fix/level8-post-release-alignment-20260923`

## Verification status
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
- Player reconfirmed Geometry Guide V1 as the sole source of truth. Pixel re-audit showed the existing Spawn/path/Base/T1–T8 coordinates already match the guide; no gameplay geometry was moved.
- PR #68 merged to `main` at `12435e8c5820a8dafc50ab7ec92f12f0ae6f616b`.
- Level8 base-name text now renders centered below the canonical Base waypoint instead of the lower-right map corner.
- 化蛇 follow-up remains intentionally deferred until the player rechecks the map/base presentation.

## Next exact step
**Player rechecks Level8 map/base presentation on phone; only after that, review 化蛇 ability/HUD readability if still requested.**

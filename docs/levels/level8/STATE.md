# Level8 — Current State / Handoff

> New/returning sessions must first follow `AGENTS.md`, `docs/DEVELOPMENT_PLAYBOOK.md`, `docs/WORK_PROGRESS.md`, then this file.

## Active level
- Level: **8**
- Development phase: **POST-RELEASE ALIGNMENT / RELEASE VERIFICATION**
- Production implementation: **RELEASED BASELINE + NARROW PHONE-EVIDENCE FIX ON FEATURE BRANCH**
- Active canonical folder: `docs/levels/level8/`

## Current gate
**FINAL REVIEW / MERGE / PUBLIC PHONE-SIZE VERIFICATION**

### Allowed now
- verify and release the player-reported Level8 alignment correction;
- correct only concrete road-center, tower-pad, and fixed-footprint Huashe HUD defects;
- keep all frozen gameplay, progression, timing, stats, and canonical geometry unchanged.

### Forbidden until gate exit
- no gameplay/design redesign, asset regeneration, geometry remeasurement, or map recrop;
- no unrelated Level1–7 work; regress only shared renderer/HUD contracts actually touched.

### Gate exit condition
Review and merge the narrow fix, deploy Pages, then verify Level8 at 390 px / 390×700 and compare the unchanged Level7 Boss HUD footprint.

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
- final whole-branch review;
- merge to `main` and Pages deployment;
- public 390 px / 390×700 verification;
- player phone recheck of the three corrected presentation defects.

## Current branch / SHA
- latest remote `main` baseline: `301258e3c166884e64a21499ee512e7858022ef4`
- active branch: `fix/level8-post-release-alignment-20260923`
- safe-push checkpoints: `2a4db638590049ac04ca855f90ee39c7d7d13def`, `38647388db286f41326b0306d55cb5129e965fb7`, `8001a8cfba1b4aed6163f66c1a46b4bcc6b85226`

## Verification status
- FINAL ASSET AUDIT / ZIP checksum: PASS.
- background normalization re-audit: PASS; runtime asset matches canonical center-crop/resize pipeline.
- canonical Spawn/Base/path anchors and T1–T8: unchanged.
- path/pad targeted renderer tests: **34/34 PASS**.
- enemy anchor + affected motion/spacing regressions: **60/60 PASS**.
- Huashe fixed-footprint HUD/cache regressions: **52/52 PASS**.
- full `npm test`: **240/240 PASS**.
- `npm run check`, changed JS syntax checks, and release-diff whitespace check: PASS.
- browser/public and deployment evidence: pending final gate.

## Do not redo
- do not retest or redesign completed Level1–7 unless a Level8 change actually affects a shared contract.
- do not ask the player to choose implementation details already covered by repository-safe defaults.
- do not regenerate or replace 長右、蠱雕、化蛇、化蛇 Boss HUD、玄龜; their canonical source-art decisions are already frozen.
- rejected 玄龜 / frog-type drafts must never be promoted merely because a file exists.

## Next exact step
**Complete full verification and fresh code review, merge to `main`, deploy Pages, verify public Level8/Level7 phone-size rendering, then request only the remaining player-phone recheck.**

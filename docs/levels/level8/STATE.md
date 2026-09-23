# Level8 — Current State / Handoff

> New/returning sessions must first follow `AGENTS.md`, `docs/DEVELOPMENT_PLAYBOOK.md`, `docs/WORK_PROGRESS.md`, then this file.

## Active level
- Level: **8**
- Development phase: **RELEASE COMPLETE / FROZEN**
- Production implementation: **RELEASED ON MAIN**
- Active canonical folder: `docs/levels/level8/`

## Current gate
**CLOSED — RELEASE COMPLETE**

### Allowed now
- player phone/device smoke and narrow follow-up fixes only;
- regression repair only when concrete evidence shows a shipped defect;
- initialize Level9 from the project template when the player starts the next level.

### Forbidden until gate exit
- gate is already closed; do not reopen Level8 design merely because a new session starts;
- no regeneration/remeasurement/rebalancing without an explicit new request or concrete shipped defect.

### Gate exit condition
Already satisfied: reviewed implementation merged to `main` and release completed.

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
- optional physical player-phone smoke / any player-reported narrow visual correction

## Current branch / SHA
- released `main`: `e38711aa88641ad3c9cfea4c6e798291d8c77fd5`
- merged PR: **#64**
- implementation branch: `feat/level8-youming-marsh` (fully merged; recovery no longer depends on it)
- historical safe-push checkpoints: `dd2c63b`, `d113148`, `479f505`, `8935528`, `d8208d9`, final head `3f3f46a`

## Verification status
- FINAL ASSET AUDIT / ZIP checksum: PASS.
- Level8 targeted and affected shared regressions: PASS.
- final pre-merge `npm test`: **237/237 PASS**.
- `npm run check`, key JS syntax checks, and `git diff --check`: PASS.
- PR #64 merged to `main`.
- Work release closure reported GitHub Pages/public Level8 verification complete, including dev entry and normal Level7→Level8 progression.
- physical player-phone smoke is separate and is not claimed here.

## Do not redo
- do not retest or redesign completed Level1–7 unless a Level8 change actually affects a shared contract.
- do not ask the player to choose implementation details already covered by repository-safe defaults.
- do not regenerate or replace 長右、蠱雕、化蛇、化蛇 Boss HUD、玄龜; their canonical source-art decisions are already frozen.
- rejected 玄龜 / frog-type drafts must never be promoted merely because a file exists.

## Next exact step
**If continuing level development, initialize Level9 from `docs/levels/_TEMPLATE/`; otherwise only perform player-owned Level8 phone smoke or a narrow evidence-backed fix.**

# Level8 — Current State / Handoff

> New/returning sessions must first follow `AGENTS.md`, `docs/DEVELOPMENT_PLAYBOOK.md`, `docs/WORK_PROGRESS.md`, then this file.

## Active level
- Level: **8**
- Development phase: **NUMERICAL BASELINE**
- Production implementation: **NOT STARTED**
- Active canonical folder: `docs/levels/level8/`

## Current gate
**NUMERICAL BASELINE**

### Allowed now
- define base stats for 長右／蠱雕／化蛇／玄龜;
- define tide cadence, active duration and 化蛇 phase threshold;
- define 玄龜 潮震 trigger count/radius/damage/push distance;
- define Level8 W1–W10 composition and scaling intent.

### Forbidden until gate exit
- no production implementation;
- no canonical path/slot coordinates;
- no final asset batch;
- no Work implementation handoff;
- no image generation until an item is explicitly allowlisted in `ASSETS.md`.

### Gate exit condition
Freeze the complete Level8 numerical baseline and W1–W10 composition in `SPEC.md`.

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
- Numerical baseline and W1–W10 composition.
- Environment Motion Lite principle remains 2–4 subtle effects tied to background elements that actually exist in the approved map; exact anchors wait for the approved background.

## Completed
- Level8 canonical folder initialized.
- Work-budget/no-repeat/no-stall governance already lives in project-wide rules and must not be duplicated here.

## Not completed
- numerical baseline
- environment mechanic
- geometry
- assets
- implementation
- verification
- release
- player smoke

## Current branch / SHA
- initialize from latest `main`; inspect current Git state before implementation.

## Verification status
- documentation initialization only.

## Do not redo
- do not retest or redesign completed Level1–7 unless a Level8 change actually affects a shared contract.
- do not ask the player to choose implementation details already covered by repository-safe defaults.
- do not generate Level8 art before the corresponding asset is explicitly approved for generation.

## Next exact step
**Freeze Level8 numerical baseline: unit stats, tide cadence, 化蛇 phases, 玄龜 潮震 values, then W1–W10.**

# Level8 — Current State / Handoff

> New/returning sessions must first follow `AGENTS.md`, `docs/DEVELOPMENT_PLAYBOOK.md`, `docs/WORK_PROGRESS.md`, then this file.

## Active level
- Level: **8**
- Development phase: **MAP CONCEPT / DISPLAY CONTRACT**
- Production implementation: **NOT STARTED**
- Active canonical folder: `docs/levels/level8/`

## Current gate
**MAP CONCEPT / DISPLAY CONTRACT**

### Allowed now
- define Level8 map composition and route shape;
- freeze the background source aspect ratio + runtime battlefield/display contract before image generation;
- decide Spawn/Base region, eight tower-slot composition, and approximate wetland-pocket placement;
- define which background elements are intended candidates for Environment Motion Lite;
- prepare one background-only generation direction after the display contract is frozen.

### Forbidden until gate exit
- no production implementation;
- no final path/slot/wetland coordinates until an actual background is approved and measured;
- no character/Boss/HUD/deployable asset generation;
- no Work implementation handoff.

### Gate exit condition
Freeze the map/display composition contract and explicitly allowlist **Level8 background only** for generation in `ASSETS.md`.

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
- Map composition / route shape / Spawn-Base arrangement.
- Background source aspect ratio and runtime display contract.
- Wetland-pocket composition and background Motion Lite candidates.

## Completed
- Level8 canonical folder initialized.
- Work-budget/no-repeat/no-stall governance already lives in project-wide rules and must not be duplicated here.

## Not completed
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
**Freeze Level8 map composition + background/display contract, then open background-only generation.**

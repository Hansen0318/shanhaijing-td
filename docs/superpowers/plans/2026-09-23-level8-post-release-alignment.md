# Level 8 Post-release Alignment Fix Plan

> Execute this plan in order. Preserve all frozen Level 8 gameplay, progression, timing, stats, and canonical geometry.

**Goal:** Correct the three player-reported phone defects without changing approved Level 8 design: road-center enemy presentation, tower-pad overlay alignment, and the Huashe Boss HUD rendering inside the shared fixed footprint.

**Baseline:** Remote `main` is `301258e3c166884e64a21499ee512e7858022ef4`. The runtime background matches the canonical 1024×1536 → crop 21 px per side → 982×1536 → 780×1220 pipeline. Spawn/Base, path anchors, and T1–T8 stay unchanged.

## Task 1: Add targeted failing alignment tests

- Add Level 8 path-rendering coverage that rejects the current coarse hairpin interpolation while confirming the canonical anchors remain unchanged.
- Add asset-centroid/renderer coverage for the tower pad and affected Level 8 enemies.
- Add Boss HUD coverage for the shared 44 px footprint and a Huashe-compatible nine-slice configuration.
- Run the new tests and record the expected failures.

## Task 2: Fix Level 8 path and tower-pad presentation

- Increase only Level 8 runtime interpolation density; do not move canonical path anchors.
- Render the tower-pad asset around its measured alpha centroid instead of its image-box midpoint.
- Run targeted map/geometry/renderer tests and a 390 px browser smoke.
- Commit and safe-push checkpoint 1.

## Task 3: Fix Level 8 enemy sprite anchors

- Apply measured visual anchors/render offsets for Changyou and Gudiao; adjust Huashe only if browser evidence requires it.
- Keep collision position, movement, stats, and mechanics unchanged.
- Run targeted enemy and Level 8 combat regressions plus a 390 px browser smoke.
- Commit and safe-push checkpoint 2.

## Task 4: Fix Huashe Boss HUD presentation

- Keep the shared Boss HUD outer footprint fixed at 44 px.
- Give Huashe a compatible panel-slice mapping so its name strip and HP channel fit without deformation or battlefield compression.
- Replace the PNG only if the existing panel cannot satisfy the fixed-footprint contract.
- Compare Level 7 and Level 8 DOM footprints and run Boss HUD tests.
- Commit and safe-push checkpoint 3.

## Task 5: Verification, documentation, merge, and deployment

- Run Level 8 targeted tests, affected shared regressions, `npm test`, `npm run check`, syntax/diff checks, and 390 px / 390×700 browser smoke.
- Update Level 8 `STATE.md` and `WORK_PROGRESS.md` with evidence and remaining player-phone acceptance scope.
- Request final code review and resolve any concrete findings.
- Merge the feature branch to `main`, deploy GitHub Pages, and verify the public Level 8 runtime plus unaffected Level 7 HUD footprint.

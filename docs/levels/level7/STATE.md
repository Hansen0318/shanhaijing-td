# Level7 — Current State / Handoff

> This is the Level7 handoff entry. New/returning sessions must first follow `AGENTS.md` and `docs/DEVELOPMENT_PLAYBOOK.md`, then `docs/WORK_PROGRESS.md`, then this file.

## Active level

- Level: **7**
- Development phase: **DESIGN / PLAYER APPROVAL PENDING**
- Production implementation: **NOT STARTED**
- Active canonical folder: `docs/levels/level7/`
- Last continuity-structure update: 2026-09-20


## Current gate

**PLAYER REVIEW / DESIGN APPROVAL**

### Allowed now

- review/revise the proposed Level7 theme, enemy set, Boss, thunder mechanic, 句芒 role and proposed numerical baseline;
- discuss alternatives;
- promote only player-approved decisions into `SPEC.md`;
- prepare a concept/mockup only when the current discussion explicitly calls for one;
- update documentation to reflect player decisions.

### Forbidden until gate exit

- no production gameplay implementation;
- no canonical map/path/slot coordinates;
- no final Level7 image batch;
- no Boss HUD generation;
- no enemy/Boss/tower final art batch;
- no 句芒 projectile final asset;
- no Work implementation handoff;
- no tests/release work for unimplemented Level7.

### Gate exit condition

The player has approved or revised the Level7 core gameplay concept sufficiently to freeze:
- final level theme/name direction;
- normal enemies;
- Boss;
- map mechanic;
- 句芒 gameplay baseline;
- W1–W10 / Boss phase baseline.

After that, accepted decisions move to `SPEC.md` and the next gate becomes **MAP CONCEPT / CANONICAL GEOMETRY**.

## Confirmed / approved

- Level6 clear unlocks **句芒** through shared progression data.
- Level7 lineup must show owned eligible roster: 畢方／夫諸／應龍／白澤／句芒.
- Level7 remains **5 choose 3**.
- Retry returns to an empty 0/3 lineup.
- Blessing filtering follows the selected 3.
- 句芒 is selectable in Level7 and is a global ally-support / wood-god support archetype, mechanically distinct from 白澤's enemy-debuff role.
- The first Level7 entry should make the newly unlocked 句芒 discoverable; any one-time NEW treatment must be data-driven/reusable, not a Level7-only roster branch.
- Project-wide attack visuals follow `AGENTS.md` Section 16: Procedural-first / PNG-first / Hybrid classification before batch image production.
- No Level7 production code, balance, geometry, or asset batch is frozen merely because it appears in `DESIGN.md`.

## Current proposals — not yet frozen

See `DESIGN.md` for full rationale. Current working proposal includes:

- Level name/theme: **第7關・雷澤天野**.
- Base working name: **震木神壇**.
- Normal enemies: **欽原** / **諸懷**.
- Boss: **夔**.
- Map mechanic: two pulsed **雷脈／雷擊區** with telegraph; distinct from Level6 continuous sunlight.
- 句芒: global attack-speed support + light single-target attack.
- Draft enemy/Boss/tower numbers and W1–W10 exist in `DESIGN.md`.
- Level7 clear currently proposes no additional deployable-beast unlock.
- 句芒 projectile currently proposes Hybrid: small 青木靈羽／葉刃 body + procedural trail/impact.

These items require player approval before promotion to `SPEC.md`.

## Completed

- Project-wide continuity/handoff structure defined in `AGENTS.md`.
- Level7 per-level documentation folder established.
- Existing Level7 design proposals preserved in `DESIGN.md`.
- Confirmed progression requirements separated into `SPEC.md`.
- Geometry and asset ledgers created for future canonical data.

## Not completed

- Player approval/freeze of Level7 theme, enemies, Boss, thunder mechanic.
- Player approval/freeze of 句芒 numerical gameplay.
- Player approval/freeze of W1–W10 / Boss phase numbers.
- Background concept approval.
- Canonical 390×610 path.
- Spawn/Base/tower-slot/thunder-zone geometry.
- Final asset inventory.
- 句芒 projectile mockup decision.
- Production implementation.
- Automated tests / check.
- 390px / 390×700 runtime smoke.
- Merge/release/Pages verification.
- Player phone smoke.

## Current branch / SHA

This continuity structure was prepared on branch:
- `docs/active-level-handoff-20260920`

After merge, future sessions must inspect current `main` and the active feature branch rather than assuming this branch remains active.

## Verification status

Documentation-only change. No production gameplay was changed and no executable test claim is made here.

## Do not redo

- Do not redesign Level1–6 while developing Level7.
- Do not recreate shared progression, Motion Lite, facing, spacing, Boss HUD, release, or attack-visual policies.
- Do not make a Level7-only five-roster implementation; use shared owned/unlocked progression.
- Do not generate a Level7 image batch before classification/approval.
- Do not infer canonical geometry from a phone screenshot.
- Do not implement values from `DESIGN.md` as if they were already player-approved.

## Next exact step

**Review the Level7 gameplay proposal with the player and either approve or revise the proposed theme/enemies/Boss/thunder mechanic/句芒 baseline. Once approved, promote only the accepted values into `SPEC.md`; then proceed to the background/map concept and canonical geometry.**

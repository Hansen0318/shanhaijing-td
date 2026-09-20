# Level7 — Asset / VFX Ledger

> Follow `docs/ASSET_INTEGRATION_GUIDE.md` and `AGENTS.md` Section 16.

## Status

**PLANNING / NO FINAL BATCH APPROVED**

## Confirmed existing/shared assets

- Existing Level1–6 shared UI/runtime assets remain reusable where contracts match.
- 句芒 unlock art from Level6 is an unlock presentation asset; it is not automatically the Level7 production tower sprite.

## Proposed Level7 asset needs — not yet approved

| Item | Purpose | Classification | Production status |
|---|---|---|---|
| Level7 background | map | image required | pending concept |
| 欽原 | normal enemy | PNG sprite | pending approval |
| 諸懷 | heavy enemy | PNG sprite | pending approval |
| 夔 | Boss | PNG sprite | pending approval |
| 夔 Boss HUD | HUD frame with empty HP channel | PNG | pending approval |
| 句芒 production tower sprite | deployable tower | PNG sprite | pending approval |
| 雷脈 landmark/charge/pulse | mechanic VFX | Procedural-first | do not batch yet |
| 欽原 雷行 emphasis | state VFX | Procedural-first | do not batch |
| 諸懷 雷殼 | state VFX | Procedural-first or Hybrid | decide after review |
| 夔 thunder pulse | Boss/mechanic VFX | Procedural-first | do not batch |
| 句芒 team-support indicator | state VFX | Procedural-first | do not batch |
| 句芒 青木靈羽／葉刃 | projectile | Hybrid candidate | mockup first |
| 句芒 impact glow | hit VFX | Procedural-first | do not batch |

## Batch-admission rule

- Do not create final image assets for purely procedural items.
- Do not generate “backup” projectile art just in case.
- Borderline cases get a mockup/spec/prototype first.
- Player/runtime smoke may later escalate Procedural-first → Hybrid/PNG-first.
- All final sprites/HUD/VFX must be optimized before deployment and checked at 390px / 390×700.

## Final inventory

Pending player approval of gameplay concept and background direction.


## Generation status vocabulary

Only these statuses control image generation:

- **APPROVED_FOR_GENERATION** — allowed in the next/current image batch.
- **MOCKUP_APPROVED_ONLY** — may generate a small concept/mockup, not final production art.
- **PENDING_DISCUSSION** — do not generate.
- **PROCEDURAL_FIRST** — do not generate a dedicated image unless later escalated.
- **BLOCKED_BY_GEOMETRY** — do not generate final map-dependent art yet.
- **GENERATED_UNAPPROVED** — output exists but is not canonical/usable until player accepts it.
- **APPROVED_FINAL** — player-approved final source art; proceed to optimization/integration when the project gate permits.

## Current Level7 image-generation allowlist

**None.**

At the current `STATE.md` gate, no final Level7 batch is approved for generation.

The 句芒 projectile remains a **Hybrid candidate / PENDING_DISCUSSION** and must first be discussed or mocked up when the player reaches that decision. Enemy/Boss/map/HUD final assets are also not yet approved for generation.

A future batch must list exact filenames/items here with **APPROVED_FOR_GENERATION** before generation begins.

# Level7 — Asset / VFX Ledger

> Follow `docs/ASSET_INTEGRATION_GUIDE.md` and `AGENTS.md` Section 16.

## Status

**ASSET / VFX PLANNING — GEOMETRY FROZEN**

## Confirmed existing/shared assets

- Existing Level1–6 shared UI/runtime assets remain reusable where contracts match.
- 句芒 unlock art from Level6 is an unlock presentation asset; it is not automatically the Level7 production tower sprite.

## Proposed Level7 asset needs — not yet approved

| Item | Purpose | Classification | Production status |
|---|---|---|---|
| Level7 background | map | image required | APPROVED_FINAL |
| 欽原 | normal enemy | PNG-first sprite | APPROVED_FOR_GENERATION |
| 諸懷 | heavy enemy | PNG sprite | pending approval |
| 夔 | Boss | PNG sprite | pending approval |
| 夔 Boss HUD | HUD frame with empty HP channel | PNG | pending approval |
| 句芒 production tower sprite | deployable tower | PNG sprite | pending approval |
| 雷脈 landmark/charge/pulse | mechanic VFX | Procedural-first | APPROVED — code-only micro-flow / charge / pulse |
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

Gameplay and Geometry V3 are frozen. Final source-art inventory is now being resolved.

Current classification direction:
- Level7 background — APPROVED_FINAL.
- 欽原 — PNG-first character sprite; visual design still requires player discussion.
- 諸懷 — PNG-first character sprite; visual design still requires player discussion.
- 夔 — PNG-first Boss sprite; visual design still requires player discussion.
- 夔 Boss HUD — PNG-first empty-channel frame; produce after Boss visual direction is approved.
- 句芒 production tower sprite — PNG-first deployable sprite; Level6 unlock art is not automatically reused.
- 雷脈 idle/charge/pulse — Procedural-first; no image.
- 欽原 雷行 — Procedural-first.
- 諸懷 雷殼 — default Procedural-first; escalate to Hybrid only if 390px smoke is unclear.
- 夔 thunder pulse — Procedural-first.
- 句芒 team-support indicator — Procedural-first.
- 句芒 attack projectile — Hybrid candidate; mockup/discussion first.
- 句芒 impact — Procedural-first.


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

**Current approved source-art sub-batch: 欽原 only.**

- Level7 background for 雷澤天野 — **APPROVED_FINAL** as geometry source

Everything else remains blocked:
- 諸懷 / 夔 / 夔 Boss HUD / 句芒 production tower sprite — not approved for generation yet;
- 句芒 projectile — Hybrid candidate / PENDING_DISCUSSION;
- procedural thunder/status visuals — do not create dedicated art.

This approval is limited to the background sub-batch. Generating the background does **not** authorize later character/HUD/projectile assets.


### Proposed next sub-batch — 欽原 only

Status: **APPROVED_FOR_GENERATION**

Visual proposal is recorded in `DESIGN.md` Section 20.

Player continuation accepted this visual direction. Generate 欽原 only. Do not automatically include 諸懷, 夔, 句芒, Boss HUD, or projectile art in the same batch.

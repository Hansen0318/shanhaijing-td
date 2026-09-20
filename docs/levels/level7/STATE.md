# Level7 — Current State / Handoff

> This is the Level7 handoff entry. New/returning sessions must first follow `AGENTS.md` and `docs/DEVELOPMENT_PLAYBOOK.md`, then `docs/WORK_PROGRESS.md`, then this file.

## Active level

- Level: **7**
- Development phase: **ASSET / VFX PLANNING**
- Production implementation: **NOT STARTED**
- Active canonical folder: `docs/levels/level7/`
- Last continuity-structure update: 2026-09-20


## Current gate

**ASSET / VFX PLANNING**

### Allowed now

- finalize Level7 asset inventory against the frozen gameplay + geometry;
- classify each visual as existing reuse / Procedural-first / PNG-first / Hybrid;
- discuss visual direction for 欽原 / 諸懷 / 夔 / 句芒 production sprite / 夔 Boss HUD;
- decide whether 句芒 projectile requires a mockup before final generation;
- open only the exact player-approved asset sub-batch in `ASSETS.md`.

### Forbidden until gate exit

- no production gameplay implementation;
- no Work implementation handoff;
- no unapproved future asset batch;
- no dedicated PNG for procedural thunder/status effects;
- no geometry re-design unless player explicitly reopens it.

### Gate exit condition

The final Level7 asset inventory is classified and the required source-art sub-batches have been discussed/approved. Any mockup-first item has been resolved. Only then may the project advance to **ASSET PRODUCTION / STATIC AUDIT**.

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

Current geometry-stage proposal is recorded in `DESIGN.md`. Gameplay/theme/enemy/Boss/句芒/Wave baseline has now been promoted to `SPEC.md`.

Still pending:
- 句芒 projectile mockup/classification resolution;
- final Level7 asset inventory/classification closure;

## Completed

- Project-wide continuity/handoff structure defined in `AGENTS.md`.
- Level7 per-level documentation folder established.
- Existing Level7 design proposals preserved in `DESIGN.md`.
- Confirmed progression requirements separated into `SPEC.md`.
- Geometry and asset ledgers created for future canonical data.
- Level7 map composition direction approved: upper-left Spawn → **lightning-zigzag route** → 雷脈A / 雷脈B at major turns → lower-right 震木神壇.
- Background-only image generation sub-batch approved; all character/HUD/projectile art remains blocked.
- Clean no-text Level7 background candidate has been **PLAYER APPROVED** as the geometry source.
- Thunder-vein idle micro-animation / 0.9s charge / pulse is approved as **Procedural-first**; no dedicated animation image batch.
- Geometry Guide V3 was player-approved and has been promoted to canonical 390×610 geometry in `GEOMETRY.md`.
- 欽原 final simplified single-creature PNG visual has been player-approved; preserve it as canonical source-art identity.
- 諸懷 simplified four-horn heavy-enemy single PNG visual has been player-approved.
- 夔 revised blue-white thunder-beast Boss single PNG visual has been player-approved after rejecting the first too-similar version.
- 夔 Boss HUD blue-white empty-channel candidate has been player-approved → APPROVED_FINAL.
- 句芒 deployable tower will reuse the exact visual identity of the existing Level6 unlock art; no second creature design/generation is required. Runtime optimization may derive a separate file without redesign.

## Not completed

- Final asset inventory.
- 句芒 projectile mockup decision.
- Production implementation.
- Automated tests / check.
- 390px / 390×700 runtime smoke.
- Merge/release/Pages verification.
- Player phone smoke.

## Current branch / SHA

Current documentation branch:
- `docs/level7-jumang-source-reuse-20260920`

After merge, future sessions must inspect current `main` and any active feature branch rather than assuming this branch remains active.

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

**Resolve 句芒 attack projectile: review the Hybrid candidate (small leaf/green-feather projectile core + procedural trail/impact) and either approve it, simplify it to Procedural-first, or revise it. Do not generate a new 句芒 creature body image.**

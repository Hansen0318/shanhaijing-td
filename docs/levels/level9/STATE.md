# Level9 — Current State / Handoff

> New/returning sessions must first follow `AGENTS.md`, `docs/DEVELOPMENT_PLAYBOOK.md`, the CURRENT HANDOFF POINTER in `docs/WORK_PROGRESS.md`, then this file.

## Active level
- Level: **9**
- Development phase: **MAP CONCEPT / CANONICAL GEOMETRY**
- Production implementation: **NOT STARTED**
- Active canonical folder: `docs/levels/level9/`

## Current gate
**GATE D — MAP CONCEPT / CANONICAL GEOMETRY**

### Allowed now
- use the approved Level9 Gameplay Geometry Guide V1 as the controlling map skeleton;
- create/select a production background that follows the frozen guide composition;
- record source dimensions and normalization/crop;
- derive explicit source→390×610 registration;
- overlay the unchanged guide on that exact background;
- reject/regenerate background art if it materially misses the guide;
- after player approval, freeze the registered geometry.

### Forbidden until gate exit
- do not derive the gameplay path from an AI-generated background;
- do not move Spawn/Base/T1–T8/central shrine merely to fit an attractive background;
- no geometry freeze before the exact production-background overlay is approved;
- no final asset batch beyond the Gate D background task;
- no production implementation;
- no Work implementation handoff.
- no guessed/final coordinates before the exact production background exists;
- no geometry freeze before player-approved overlay;
- no final asset batch or image-generation batch beyond the Gate D production-background task;
- no production implementation;
- no Work implementation handoff.
- no canonical geometry or coordinate guessing;
- no production-background freeze;
- no final asset batch or image-generation allowlist;
- no production implementation;
- no Work implementation handoff.
- no numerical gameplay baseline;
- no W1–W10 freeze;
- no canonical geometry or coordinate guessing;
- no final asset batch or image generation allowlist;
- no production implementation;
- no Work implementation handoff.

### Gate exit condition
Exact production background + transform + player-approved overlay exist, and `GEOMETRY.md` contains the reproducible frozen geometry contract.

## Confirmed / approved
- Gate A progression/scope is frozen from inherited campaign rules.
- Level9 is reached from Level8 victory once Level9 is implemented.
- Entering Level9 opens the persistent roster-selection flow before combat.
- Owned roster entering Level9 contains six deployable beasts: **畢方／夫諸／應龍／白澤／句芒／玄龜**.
- Player selects exactly **3** beasts.
- Retry returns to an empty lineup and requires choosing 3 again.
- Level9 victory must not expose a dead Level10 action while Level10 is not implemented.
- Level1–8 remain frozen; do not redo or rebalance them for Level9 development.
- Level8 retrospective guardrails apply to Level9 geometry, Boss timeline, HUD footprint, Motion Lite/readability, and visual-integration preflight.

## Current proposals — not yet frozen
- Gameplay Geometry Guide V1 is defined and statically validated:
  - Spawn **(20,70)**
  - Base **(375,550)**
  - T1–T8 = **(110,150), (250,95), (285,265), (375,365), (230,330), (165,300), (90,410), (330,430)**
  - central 晝夜 anchor **(220,260)**
  - road width **54**
- The exact production background and registration overlay remain pending.

## Completed
- zero-context takeover from latest `main`;
- read CURRENT HANDOFF POINTER;
- read Level8 retrospective and permanent development rules;
- initialized `docs/levels/level9/` from repository template;
- Gate A progression/scope contract completed and frozen;
- Gate B core design approved and frozen: 鐘山極夜 / 天狗・猙 / 燭龍 / 晝夜輪轉 / 帝江 / state-reading difficulty;
- Gate C numerical/gameplay contract approved and frozen, including 玄龜 first-playable verification and exact W1–W10/Boss timeline;
- Gate D map concept approved;
- Gameplay Geometry Guide V1 defined and static-check PASS.

## Not completed
- production background / geometry;
- assets / VFX planning and production;
- implementation;
- engineering verification;
- release;
- player smoke.

## Current branch / SHA
- active documentation branch: `docs/level9-geometry-guide-v1-hardrule-20260925`
- branch base: `2d5e8f647e36369c95e3c4371223d02eaab61549`

## Verification status
- documentation-only initialization; no production code changed.
- no gameplay/browser tests required for this initialization step.

## Do not redo
- Level1–8 released content;
- Level8 retrospective analysis;
- inherited roster/progression architecture;
- permanent project rules in `AGENTS.md`.

## Next exact step
**Create the Level9 production background from Gameplay Geometry Guide V1. The road/pads/shrine must follow the guide. Then register that exact image to 390×610 and overlay the unchanged guide for player approval before final geometry freeze.**

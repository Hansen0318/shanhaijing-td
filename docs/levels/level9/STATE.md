# Level9 — Current State / Handoff

> New/returning sessions must first follow `AGENTS.md`, `docs/DEVELOPMENT_PLAYBOOK.md`, the CURRENT HANDOFF POINTER in `docs/WORK_PROGRESS.md`, then this file.

## Active level
- Level: **9**
- Development phase: **CORE DESIGN**
- Production implementation: **NOT STARTED**
- Active canonical folder: `docs/levels/level9/`

## Current gate
**GATE B — CORE DESIGN**

### Allowed now
- define Level9 theme / level name;
- define normal enemies;
- define Boss identity;
- define the level's signature mechanic;
- define whether Level9 introduces a new deployable/unlock;
- define broad difficulty intent;
- record proposals in `DESIGN.md` and promote only accepted decisions to `SPEC.md`.

### Forbidden until gate exit
- no numerical gameplay baseline;
- no W1–W10 freeze;
- no canonical geometry or coordinate guessing;
- no final asset batch or image generation allowlist;
- no production implementation;
- no Work implementation handoff.

### Gate exit condition
Record the approved Level9 core-design decisions in `SPEC.md` and leave no unresolved core-design blocker.

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
- Level9 theme/name: pending.
- normal enemies: pending.
- Boss: pending.
- signature mechanic: pending.
- Level9 clear unlock/new deployable: pending.
- broad difficulty intent: pending.

## Completed
- zero-context takeover from latest `main`;
- read CURRENT HANDOFF POINTER;
- read Level8 retrospective and permanent development rules;
- initialized `docs/levels/level9/` from repository template;
- Gate A progression/scope contract completed and frozen.

## Not completed
- Gate B core design;
- numerical baseline;
- production background / geometry;
- assets / VFX planning and production;
- implementation;
- engineering verification;
- release;
- player smoke.

## Current branch / SHA
- initialization branch: `docs/level9-init-gate-a-20260924`
- branch base: `07e83d001cc21ed88ec647721408dc1ff3268232`
- latest initialization SHA: update after documentation commit sequence.

## Verification status
- documentation-only initialization; no production code changed.
- no gameplay/browser tests required for this initialization step.

## Do not redo
- Level1–8 released content;
- Level8 retrospective analysis;
- inherited roster/progression architecture;
- permanent project rules in `AGENTS.md`.

## Next exact step
**Gate B: propose the Level9 theme/name, normal-enemy set, Boss, signature mechanic, Level9-clear unlock/new deployable decision, and broad difficulty intent for player approval.**

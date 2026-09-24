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
- Proposal A — **第9關・鐘山極夜**.
- normal enemies: **天狗／猙**.
- Boss: **燭龍**.
- signature mechanic: **晝夜輪轉**.
- Level9 clear unlock/new deployable: **帝江**.
- broad difficulty intent: harder through state-reading/timing rather than large stat inflation.
- all items above remain **PLAYER_APPROVAL_PENDING** and are not yet frozen.

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
- active documentation branch: `docs/level9-gate-b-proposal-20260924`
- branch base: `6070b4592aac70eb9e39586b72eee81fc073647b`
- latest Gate B proposal checkpoint: `7f1e190b612f85c469a0112aeabdb1e93e6dddbe`.

## Verification status
- documentation-only initialization; no production code changed.
- no gameplay/browser tests required for this initialization step.

## Do not redo
- Level1–8 released content;
- Level8 retrospective analysis;
- inherited roster/progression architecture;
- permanent project rules in `AGENTS.md`.

## Next exact step
**Player reviews Proposal A in `DESIGN.md`. If approved, promote L9-D001–L9-D006 into `SPEC.md` and advance to Gate C. If any item is rejected, revise only Gate B design before advancing.**

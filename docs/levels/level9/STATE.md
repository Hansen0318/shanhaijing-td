# Level9 — Current State / Handoff

> New/returning sessions must first follow `AGENTS.md`, `docs/DEVELOPMENT_PLAYBOOK.md`, the CURRENT HANDOFF POINTER in `docs/WORK_PROGRESS.md`, then this file.

## Active level
- Level: **9**
- Development phase: **NUMERICAL BASELINE**
- Production implementation: **NOT STARTED**
- Active canonical folder: `docs/levels/level9/`

## Current gate
**GATE C — NUMERICAL BASELINE**

### Allowed now
- freeze enemy stats/abilities;
- freeze exact 晝相／夜相 gameplay effects;
- define 帝江's concrete combat/support kit and Blessings;
- freeze Boss phase thresholds/mechanics;
- freeze W1–W10 including exact spawn order where order matters;
- write a Boss encounter timeline proving 燭龍's signature mechanic overlaps its intended supporting enemies / battlefield state;
- freeze victory conditions.

### Forbidden until gate exit
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
Record the approved numerical/gameplay contract in `SPEC.md`, including exact W1–W10 and the W10 Boss encounter timeline.

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
- Gate C numerical baseline: pending proposal.

## Completed
- zero-context takeover from latest `main`;
- read CURRENT HANDOFF POINTER;
- read Level8 retrospective and permanent development rules;
- initialized `docs/levels/level9/` from repository template;
- Gate A progression/scope contract completed and frozen;
- Gate B core design approved and frozen: 鐘山極夜 / 天狗・猙 / 燭龍 / 晝夜輪轉 / 帝江 / state-reading difficulty.

## Not completed
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
**Gate C: prepare a concrete numerical/gameplay proposal for 天狗、猙、晝夜輪轉、帝江、燭龍 phases, W1–W10 exact order and the W10 Boss encounter timeline for player approval.**

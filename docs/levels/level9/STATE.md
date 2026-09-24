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
- Gate C proposal is documented in `DESIGN.md` and remains **PLAYER_APPROVAL_PENDING**.
- Level9 is explicitly the **first playable level for 玄龜**; its Level8-approved stats/ability/VFX are inherited and must be verified in Level9, not redesigned.
- Proposed baselines: 天狗 120 HP / 90 speed; 猙 450 HP / 24 speed; 燭龍 8200 HP / 15 speed.
- Proposed 晝夜: normal 8 s cadence; Boss P1 6 s, P2 4.5 s; 0.8 s telegraph.
- Inherited 玄龜 first-use contract: 145 cost / 13 damage / 1.20s interval / every 4 hits triggers 0.35s-delayed 潮震 (52 radius / 18 damage / 18 non-Boss pushback), with procedural cyan projectile + water-shock rings.
- Proposed 帝江: 150 cost, short movement-lock pulse every 5th successful attack; 帝江 is a Level9-clear unlock and is **not playable until Level10**.
- Proposed W10 order: 燭龍 first → 天狗 ×8 → 猙 ×4.

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
- active documentation branch: `docs/level9-gate-c-proposal-20260924`
- branch base: `fba696cc6967e55711c2d26b737343d8494c82e7`
- latest Gate C proposal checkpoint: pending current documentation commit.

## Verification status
- documentation-only initialization; no production code changed.
- no gameplay/browser tests required for this initialization step.

## Do not redo
- Level1–8 released content;
- Level8 retrospective analysis;
- inherited roster/progression architecture;
- permanent project rules in `AGENTS.md`.

## Next exact step
**Player reviews the Gate C proposal in `DESIGN.md`, including the inherited L9-R100 玄龜 first-playable verification. If approved, promote L9-R101–L9-R108 into `SPEC.md`; retain L9-R100 as an inherited verification contract, then advance to Gate D.**

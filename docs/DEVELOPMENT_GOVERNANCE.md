# Shanhaijing TD — Development Governance & Work Budget

This document turns the project's continuity rules into a practical anti-leak system while keeping Work usage minimal.

The objective is:

> Catch omissions early, preserve decisions, and keep handoffs precise **without forcing Work to reread, retest, or over-execute work that Chat or the player can handle more cheaply.**

## 1. Governance priority

Use the smallest effective control first:

1. Chat/document check
2. lightweight deterministic preflight
3. targeted executable verification
4. Work-only engineering
5. player/device smoke where the player can verify faster and more directly

Do not escalate to Work merely because a check exists.

## 2. Machine-checkable Preflight

The project should maintain a **lightweight preflight** for structural consistency.

Its purpose is to fail fast on cheap, objective mistakes such as:

- active level has no `STATE.md`;
- `STATE.md` has no Current gate / Next exact step;
- a gate claims advancement while required canonical files are missing;
- a final asset batch contains items not marked `APPROVED_FOR_GENERATION`;
- a Work handoff is attempted while the active gate forbids implementation;
- active pointer and active level folder disagree;
- required Decision/Requirement references are missing where explicitly required;
- a release/handoff state omits branch/SHA or verification status.

### Preflight budget

Preflight must remain:
- deterministic;
- local/static where possible;
- seconds, not minutes;
- no browser;
- no gameplay simulation;
- no full regression suite;
- no external AI reasoning.

A preflight failure should tell Chat what to fix before Work is involved.

## 3. Decision / Requirement IDs

Important approved decisions and implementation requirements should receive stable IDs.

Suggested forms:
- decision: `L7-D001`
- requirement: `L7-R001`
- geometry contract item: `L7-G001`
- asset contract item: `L7-A001`

Do not assign IDs to every sentence. Use them only when the item:
- drives implementation;
- affects multiple files/systems;
- may be changed later;
- requires verification;
- would be costly to lose or reinterpret.

Example:
- `L7-D001`: Boss identity = 夔
- `L7-R004`: Level7 lineup shows all five owned beasts and requires exactly 3
- `L7-R012`: W10 cannot end while Boss is alive
- `L7-A006`: 句芒 projectile is Hybrid after player approval

IDs provide traceability; they are not bureaucracy for its own sake.

## 4. Change Impact / Traceability

When an approved decision changes, record a compact impact entry before implementation.

Minimum fields:
- changed ID;
- affected code/data/docs;
- required revalidation;
- explicitly unaffected scope;
- whether downstream assets/tests become stale.

Example:

```
Change: L7-D003 句芒 support multiplier
Affected:
- TOWER_DATA / support system
- Level7 balance assumptions
- related targeted tests
Revalidate:
- stacking
- sell/recompute
- lineup without 句芒 remains viable
Must not change:
- Level1–6 tower stats
- path geometry
```

The purpose is to avoid:
- changing one source but leaving stale downstream behavior;
- broad shared-system changes when a narrow change is enough;
- unnecessary regression work.

## 5. Requirement-to-verification traceability

Important frozen requirements should point to the cheapest valid verification owner.

Use one of:

- `STATIC` — Chat/document/source inspection is sufficient
- `TARGETED_TEST` — executable automated test required
- `WORK_RUNTIME` — Work/browser/runtime evidence genuinely required
- `PLAYER_SMOKE` — player/device visual or usability confirmation
- `MIXED` — more than one is truly necessary

Examples:

```
L7-R004 lineup 5 choose 3 -> TARGETED_TEST
L7-G003 path visually follows road -> PLAYER_SMOKE + targeted debug overlay
L7-A006 projectile silhouette readable -> PLAYER_SMOKE
Boss victory condition -> TARGETED_TEST
```

Do not upgrade a `PLAYER_SMOKE` item into an expensive Work browser task unless the player explicitly asks or engineering evidence is genuinely required.

## 6. Pre-merge Red Team Audit

Before merge, perform a **short adversarial audit of the changed scope**, not a full-project re-review.

Default owner:
- Chat first for static/document/scope consistency;
- Work only checks executable risks directly related to its implementation.

Questions:
- Did we cross a gate without approval?
- Did production diverge from `SPEC.md`?
- Did a shared-system change alter completed levels unintentionally?
- Is any generated/used asset still unapproved?
- Are any canonical docs stale?
- Did we add behavior with no appropriate verification?
- Is the handoff/release status overstated?
- Did implementation expand scope beyond the requested delta?

This audit must be bounded to the current change. It must not become an excuse to replay every old level or reread the whole project.

## 7. Work Budget Rule

**Work is a scarce execution environment. Governance must reduce Work load, not increase it.**

Before creating any Work task, Chat must finish all safe work it can complete without invalidating later execution.

Chat-owned by default:
- requirement clarification;
- player discussion;
- decision recording;
- spec/design/state updates;
- geometry planning/measurement that is statically reliable;
- asset inventory/classification;
- static repo inspection;
- impact analysis;
- preflight repair;
- compact Work handoff;
- static red-team review;
- interpretation of test output;
- release recovery when Work reports a concrete blocker.

Work-owned only when materially necessary:
- multi-file production implementation requiring a checked-out repo;
- iterative executable debugging;
- targeted automated tests that Chat cannot reliably run;
- full test/check only when justified by changed scope/shared architecture/release contract;
- runtime/browser/devtools verification when truly engineering-owned;
- merge/deploy when Work owns the implementation and can complete the release flow.

Player-owned by default where appropriate:
- phone visual readability;
- touch/usability feel;
- visual path alignment;
- VFX clarity;
- balance feel;
- other device smoke that the player can verify directly and cheaply.

## 8. No-overexecution rules for Work

Work must not:

- redo Chat-completed planning;
- re-derive approved numbers/geometry/assets;
- reread full historical design files when `STATE.md` + canonical files are enough;
- run browser smoke unrelated to the changed scope;
- replay every completed level without an identified shared regression risk;
- run full regression merely because it exists if a targeted check is sufficient;
- rerun an already-PASS checkpoint/test/smoke when no later change touches its verified scope;
- repeat player-owned smoke unless explicitly requested;
- generate extra assets or implement later-gate ideas;
- “improve” unrelated code during a narrow task.

If a required check can be performed by the player more efficiently, record it as `PLAYER SMOKE PENDING` rather than consuming Work budget.

## 9. Chat-before-Work closure

Before Work handoff, Chat must establish:

- active scope and current gate;
- approved decisions;
- frozen implementation requirements;
- exact affected files/systems when known;
- known invariants / must-not-change scope;
- relevant asset/geometry contracts;
- expected targeted tests;
- player-owned checks that Work must not duplicate;
- exact release expectation.

The Work prompt should then contain only:
- repo/branch start point;
- files to read;
- the unresolved executable delta;
- required engineering checks;
- release instruction if applicable.

Do not paste long project history into Work when the repository already contains it.

## 10. Full-test policy

Full tests are not automatically required for every change.

Use:
- documentation-only change -> no production test run required;
- static asset inventory/status change -> no gameplay test required;
- isolated implementation -> targeted tests first;
- shared core system change -> targeted + affected regressions;
- broad architecture/release-sensitive change -> full suite when justified;
- final release gate -> follow the task/repository release contract.

The reason for running a full suite must be the risk/scope, not habit.

## 11. Lightweight release trace

For each released level/major feature, record:
- final main SHA;
- deployed Pages SHA/evidence if applicable;
- key requirement IDs delivered;
- engineering verification status;
- player smoke status;
- known non-blocking follow-up.

This gives a rollback/reference anchor without creating another heavy workflow.

## 12. Core anti-leak loop

The project-wide operating loop is:

> Refresh context -> verify current gate -> check decision/requirement source -> assess impact -> perform the smallest valid action -> verify with the cheapest valid owner -> record result -> advance only if the gate is complete.

The cost rule is equally important:

> Stronger governance should make Work smaller, not bigger.

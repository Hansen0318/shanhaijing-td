# Shanhaijing TD — Development Playbook

This is the onboarding and execution map for any developer, Chat, Work, Codex session, or future maintainer taking over the project.

The goal is not only to remember prior work. The goal is to keep development decisions, sequence, implementation, verification, and release consistent from start to finish.

## 1. Source-of-truth map

### Project-wide

- `AGENTS.md`
  - permanent hard rules;
  - execution boundaries;
  - recovery/release rules;
  - shared gameplay/presentation contracts;
  - continuity and stage-gate rules.

- `docs/WORK_PROGRESS.md`
  - current active pointer;
  - cross-project chronology;
  - recent branches/SHAs/results/blockers.

- `docs/ASSET_INTEGRATION_GUIDE.md`
  - image/VFX/UI/HUD/geometry integration rules;
  - runtime size/alpha/preload/mobile-readability contracts.

### Per active level

Each newly developed level uses:

```
docs/levels/levelN/
  STATE.md
  SPEC.md
  DESIGN.md
  GEOMETRY.md
  ASSETS.md
```

Interpretation:
- `STATE.md` = where we are now and what to do next;
- `SPEC.md` = what has actually been approved;
- `DESIGN.md` = proposals, alternatives and reasoning;
- `GEOMETRY.md` = canonical map coordinates/anchors;
- `ASSETS.md` = canonical asset/VFX inventory and statuses.

## 2. Mandatory takeover/read order

This is a **zero-context bootstrap**. A new Chat / Work / Codex session is expected to recover from GitHub without requiring the player to paste the prior conversation or a handoff prompt.

A new owner must read in this order before substantial execution:

1. `AGENTS.md`
2. this `DEVELOPMENT_PLAYBOOK.md`
3. the **CURRENT HANDOFF POINTER** at the top of `docs/WORK_PROGRESS.md`, then the newest relevant progress entry
4. active level `STATE.md`
5. active level `SPEC.md`
6. `GEOMETRY.md` if touching map/path/slots/zones/anchors
7. `ASSETS.md` if touching art/VFX/HUD/projectiles/preload
8. `DESIGN.md` if resolving proposals or rationale
9. current branch / latest relevant SHA / diff

Do not implement from a Work prompt or conversation transcript alone.

If the pointer records an active remote feature branch/safe-push SHA, recover that work before starting a replacement branch. If the pointer says the latest level is RELEASE COMPLETE/FROZEN and no newer active level exists, a request to build the next level initializes the next numbered folder from `docs/levels/_TEMPLATE/` and updates the pointer before design begins.

## 3. Standard development lifecycle

The default lifecycle for a new level is:

### Gate A — Progression / scope
Establish:
- how the player reaches the level;
- available roster/unlocks;
- selection rules;
- retry/victory/next-level behavior.

Output:
- approved items in `SPEC.md`;
- current status in `STATE.md`.

### Gate B — Core design
Discuss and approve:
- level theme/name;
- normal enemies;
- Boss;
- special mechanic;
- new deployable role if applicable;
- broad difficulty intent.

Output:
- proposals in `DESIGN.md`;
- accepted decisions promoted to `SPEC.md`.

### Gate C — Numerical baseline
Freeze enough to implement later:
- enemy stats/abilities;
- tower/new unit stats;
- Boss phase thresholds/mechanics;
- W1–W10 **including exact order when order affects gameplay**;
- a Boss encounter timeline proving the signature mechanic overlaps the enemies/terrain it is intended to affect;
- victory conditions;
- Blessing/unlock decisions.

Output:
- approved numerical contract in `SPEC.md`.

### Gate D — Map concept / canonical geometry
First approve the map concept/background direction, then establish:
- the **exact production background file**, source dimensions and crop;
- one explicit source→390×610 logical transform;
- ordered path;
- Spawn/Base;
- tower slots;
- special zones;
- Motion Lite / other visual anchors where applicable.

Before freezing coordinates, overlay all of those elements on the **actual production background** using the recorded transform and obtain player approval. If the guide and clean background are different files, measure their registration explicitly; never assume they share identical pixels.

Output:
- `GEOMETRY.md`;
- reproducible transform/registration notes;
- approved runtime-background overlay evidence.

Do not reverse the order by guessing geometry before the background contract is ready.

### Gate E — Asset/VFX planning
For every visual:
- decide existing reuse vs new asset;
- classify Procedural-first / PNG-first / Hybrid;
- decide whether a concept/mockup is needed;
- decide exact final production inventory;
- for Boss HUDs, compare the proposed source/runtime aspect against a released Boss HUD and preserve the fixed outer footprint;
- for required ambient effects, define a minimum phone-readable presentation target rather than only "subtle".

Output:
- `ASSETS.md`.

Only items explicitly approved for generation enter a batch.

### Gate F — Asset production / static audit
Proceed in approved order/sub-batches only.

After each player decision:
- update asset status;
- do not generate later-stage items early;
- preserve approved source;
- optimize final runtime copies;
- record dimensions/alpha/size/preload information.

### Gate G — Production implementation
Only after design/geometry/assets needed for implementation are ready.

Follow:
- Chat-first for safe static/bounded work;
- Work only for irreducible executable engineering;
- no re-invention of approved data.

### Gate H — Engineering verification
Run fresh:
- targeted tests;
- full tests;
- `npm run check`;
- syntax/diff checks as applicable;
- required browser/runtime smoke;
- regression for affected completed levels;
- a visual-integration preflight at target phone width covering path/tower registration, Spawn/Base labels, sprite anchors, Boss HUD footprint, Boss-mechanic timeline readability, special-zone readability and Motion Lite visibility.

Green tests prove code contracts; they do not by themselves prove that player-visible geometry matches the background art.

### Gate I — Release
Unless explicitly overridden:
- merge verified branch to `main`;
- ensure Pages source/deploy;
- verify public dev entry;
- verify normal progression path;
- distinguish engineering/release/player-smoke state.

### Gate J — Player acceptance / closure
Record:
- phone/device visual feedback;
- any narrow correction;
- final release SHA;
- remaining known non-blocking note.

Then mark the level released in `STATE.md`, record the merged main SHA / Pages-public verification / player-smoke state, and update the CURRENT HANDOFF POINTER in `WORK_PROGRESS.md`. A release with stale handoff docs is not closed.

### Gate K — Release cleanup
After the release source is confirmed in `main` and Pages, and no unique unmerged work remains:
- remove the completed isolated worktree;
- remove disposable temp/build/debug/cache artifacts;
- optionally remove the fully merged feature branch after ancestry/content verification;
- preserve canonical docs, approved assets, production files, permanent tests and release evidence;
- never delete the only recoverable copy of any unfinished work.

This gate is cleanup-only and must not change shipped gameplay or reopen completed design.

## 4. Before every substantial action

Even within the same conversation/session:

1. identify active scope;
2. read/refresh `STATE.md`;
3. check the current gate;
4. check `Allowed now` / `Forbidden until gate exit`;
5. read the domain-specific canonical file;
6. inspect repo state if edits have occurred;
7. perform only the next valid action;
8. immediately record resulting decisions/status.

This is the normal loop.

## 5. Before asking the player

Do not ask from memory.

Check:
- has this already been decided?
- is it already frozen in a canonical file?
- is this question required now?
- is it a later-stage topic?
- what is the smallest unresolved decision that advances the current gate?

When a player answers, record the decision in GitHub before moving far ahead.

## 6. Decision-state vocabulary

Use explicit states rather than ambiguous prose:

- `PROPOSAL`
- `PLAYER_APPROVAL_PENDING`
- `PLAYER_APPROVED`
- `FROZEN_FOR_IMPLEMENTATION`
- `IMPLEMENTED`
- `ENGINEERING_VERIFIED`
- `DEPLOYED`
- `PLAYER_VERIFIED`
- `BLOCKED`

For assets, also use the generation statuses defined in each level's `ASSETS.md`.

“Generated”, “implemented”, “tested”, “deployed”, and “player approved” are separate states.

## 7. Stage advancement checklist

A gate may advance only if:

- required player decisions for that gate are recorded;
- no unresolved blocker is hidden in chat;
- canonical files are current;
- `STATE.md` has the new gate/status;
- next exact step is singular and clear;
- handoff dependencies are available.

If not, stay in the current gate.

## 8. Change-control rules

If a player changes an earlier decision:
- update the canonical source first;
- mark affected downstream items;
- revalidate only the impacted scope;
- do not silently retain conflicting old values.

If runtime evidence disproves a prior approved assumption:
- record it in `STATE.md`;
- preserve the prior known-good state/commit;
- resolve the discrepancy explicitly.

## 9. Handoff standard

A handoff should be possible from GitHub documents alone.

The next owner should not need the old Chat to know:
- overall project rules;
- current level;
- current gate;
- approved gameplay;
- canonical map/assets;
- latest branch/SHA;
- tests already run;
- blockers;
- exact next step.

If any of those are missing, the handoff is incomplete.

## 10. Future-level initialization

For every future level after the currently released baseline:

1. copy the templates under `docs/levels/_TEMPLATE/`;
2. rename/fill the new level folder;
3. set `STATE.md` to the initial progression/scope gate;
4. add/update the active pointer in `WORK_PROGRESS.md`;
5. do not start design/implementation before the new folder exists.

This keeps every future level consistent even when development changes hands.


## 11. Governance / verification cost control

Read `docs/DEVELOPMENT_GOVERNANCE.md` before creating a Work handoff.

For every important requirement, choose the cheapest valid verification owner:
- STATIC
- TARGETED_TEST
- WORK_RUNTIME
- PLAYER_SMOKE
- MIXED

Before Work:
1. Chat finishes safe specification, documentation, static inspection, impact analysis and preflight repair.
2. Chat records what Work must change and what Work must **not** change.
3. Chat marks player-owned smoke so Work does not duplicate it.
4. Work receives only the unresolved executable delta.

Before merge:
- Chat/static review performs the bounded Red Team audit first;
- Work runs only executable checks justified by its changed scope;
- full-suite/runtime work is not automatic unless risk/release requirements justify it.

The governance system is successful only if it both reduces omissions **and** keeps Work tasks smaller.

## 12. Final asset-set reconciliation before Work

Before the project leaves asset production/static audit and enters Work implementation:

1. player re-uploads the exact final files they actually downloaded;
2. Chat reconciles those concrete files with the approved `ASSETS.md` inventory;
3. discrepancies stop the gate;
4. after `FINAL FILESET AUDIT PASS`, Chat creates manifests/checksums/runtime candidates;
5. only then may the minimal Work package be created.

The purpose is to make the handoff depend on verified files, not conversation memory.

This step is Chat-owned/static and must not be delegated to Work.

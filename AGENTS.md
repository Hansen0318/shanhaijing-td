# Shanhaijing TD — Work / Agent Hard Rules

These rules are permanent for substantial Work/Codex development in this repository.

## 1. Safe push checkpoints are mandatory

For any multi-step or long-running task, do **not** keep substantial completed work only in the local workspace until the very end.

Create a safe checkpoint with `commit + push` to the current feature branch at these milestones whenever they exist:

1. design/spec completed;
2. core gameplay / implementation completed;
3. asset integration completed;
4. before long browser smoke / final verification;
5. whenever token/session budget is getting low, the environment is unstable, or interruption risk increases.

Intermediate feature-branch pushes are allowed before final verification. They are safety checkpoints, **not** a PASS or deployment claim.

## 2. Token/session exhaustion procedure

If token/session limits are approaching or the execution environment may stop:

- stop starting new scope;
- preserve the current coherent state;
- update `docs/WORK_PROGRESS.md` with:
  - branch name;
  - latest SHA;
  - completed work;
  - remaining work;
  - tests/checks already run and their actual results;
  - known failures / root cause;
  - exact next step;
- commit the progress note together with the safe code state when appropriate;
- **push the feature branch before continuing**.

Do not postpone the first push until all smoke tests are complete.

## 3. Engineering verification vs player smoke

Do not treat a player-owned manual smoke step as an engineering failure.

- If the task explicitly requires Work to run a browser/runtime smoke and that smoke cannot be completed, report the Work task as incomplete / FAIL for that required item.
- If browser access is environment-limited **and** the prompt/Guide allows the player to perform the final phone smoke, then successful implementation plus all required automated/targeted checks may be reported as **ENGINEERING PASS / PLAYER SMOKE PENDING** (or equivalent wording), not FAIL.
- Player smoke is acceptance evidence owned by the player when explicitly delegated. Its absence does not retroactively fail completed engineering work.
- Never claim **PLAYER VERIFIED / FINAL VISUAL PASS** until the player actually confirms the deployed build on device.
- If player smoke is pending, push the feature branch/checkpoint and clearly list only the specific player checks still needed.
- Merge/deploy rules are task-specific only when the prompt explicitly overrides the repository default delivery flow in Section 8.

## 4. Recovery in a new Work session

Before redoing any work after interruption:

1. sync the latest `main`;
2. check whether the feature branch exists remotely;
3. read the newest relevant entry in `docs/WORK_PROGRESS.md` and the active level's current `STATE.md`;
4. inspect current branch / HEAD / status / diff;
5. continue from the first unfinished item only.

Do not reimplement already committed/pushed work. Do not automatically reread every canonical/historical document on recovery; read only the specific file needed when the compact recovery state is insufficient or contradictory.

A checkpoint/test/smoke already recorded as PASS is reusable evidence. Do not rerun it merely because the session restarted or the task continued. Rerun only when a later change can materially affect that verified scope, when the recorded evidence is missing/ambiguous, or when a release contract explicitly requires fresh evidence.

If the expected branch or SHA is missing remotely, first inspect the current/local workspace and reflog for recoverable commits. Recovery comes before reimplementation.

For substantial new-level implementation, default to an isolated worktree + feature branch from the latest `origin/main` when the current workspace is dirty, stale, or diverged. This safe default is pre-authorized and should not trigger a user-choice prompt unless there is a concrete destructive/conflict risk or permission blocker.

## 5. Push failure / unavailable environment

If the environment becomes unavailable before a local checkpoint can be pushed:

- explicitly state that completed work may exist only locally and is not yet recoverable from GitHub;
- when the environment returns, the **first action is to locate and push the local feature branch / commits**;
- only after the push succeeds should remaining smoke tests or new development continue.

## 6. Completion claims

A safe checkpoint push does not equal completion.

Use precise status labels:

- **ENGINEERING PASS**: all engineering checks required by the task that Work can execute have fresh successful evidence.
- **ENGINEERING PASS / PLAYER SMOKE PENDING**: engineering checks pass and only an explicitly delegated player/device smoke remains.
- **PASS / PLAYER VERIFIED** (or equivalent): player-required smoke has also been confirmed when that confirmation is part of acceptance.
- **FAIL / INCOMPLETE**: a required engineering check failed or a required Work-owned verification step could not be completed.

Do not label a task FAIL merely because an optional or explicitly player-owned smoke has not happened yet. Keep engineering status, player acceptance, safe-push status, and merge/deployment status separate.

## 7. Post-Level4 lineup / progression is permanent

Starting with Level4, every playable level must use the persistent roster-selection flow before combat.

- The player owns a roster of unlocked deployable beasts.
- For Level4 and every later playable level, entering the level must first open a lineup screen instead of starting combat immediately.
- The lineup screen must show **all currently owned / unlocked deployable beasts** that are eligible for that level.
- The player selects exactly **3** beasts from that owned roster, then confirms before entering preparation/combat.
- Do not hard-code future levels to only the original Level4 four-beast roster. As new beasts are unlocked in later progression, subsequent levels must include them in the selectable owned roster unless a level-specific design explicitly restricts them.
- Retry on Level4+ returns to an empty lineup and requires choosing 3 again.
- Victory progression must preserve the existing next-level flow: if a next playable level exists, show the next-level button and transition into that next level's lineup screen.
- A level with no implemented next level must not show a next-level button.
- Unlock presentation is level-specific (for example Level3 victory unlocks 白澤) and must not be duplicated on unrelated victories.
- When adding a new level, add targeted progression regression covering previous-level victory → next-level lineup, lineup roster contents, exactly-3 confirmation, retry → empty lineup, and no-next-level behavior for the current final level.

This progression rule is gameplay architecture, not optional UI polish. Future Work prompts and asset-integration packages should assume it unless the user explicitly changes the rule.

### Unlock → first-playable sequencing is permanent

For every future level, a deployable beast unlocked by clearing Level N is a **post-clear reward**, not a unit that becomes usable during that same first-clear run.

- Level N clear presents/unlocks the new beast.
- The newly unlocked beast joins the owned roster starting with the **next playable level (Level N+1)**.
- Therefore the first playable level for a newly unlocked beast is Level N+1, unless the player explicitly defines a different progression rule.
- The Level N+1 development contract must include a **first-playable verification** for that inherited beast:
  - roster/lineup inclusion;
  - approved sprite and facing;
  - inherited ability and frozen numbers;
  - attack/VFX readability at target phone width;
  - special-mechanic behavior against normal enemies/Bosses as applicable;
  - Blessing/filter integration;
  - no unintended rebalance merely because this is the first live-use level.
- Do not redesign or silently retune a previously frozen unlock when it first becomes playable. If the prior level already froze its kit, Level N+1 inherits that contract and verifies it.
- Example progression: Level8 clear unlocks 玄龜 → 玄龜 first playable in Level9; Level9 clear unlocks 帝江 → 帝江 first playable in Level10.

Future level specs, Work handoffs, progression tests and player smoke must preserve this sequence unless the player explicitly changes the architecture.

## 8. Default delivery flow: Work completion means released to main + Pages

Unless the user explicitly says **feature branch only**, **do not merge**, **do not deploy**, or otherwise asks for a review checkpoint before release, a substantial Work/Codex implementation is **not complete at feature-branch PASS**.

The default end-to-end completion flow is:

1. implement on a safe feature branch;
2. run the task-required targeted and regression checks;
3. push safe feature-branch checkpoints during development;
4. after fresh engineering verification passes, perform the final whole-branch review;
5. safely merge the verified branch into `main`;
6. ensure the merged `main` commit is the release source used by GitHub Pages;
7. verify the public Pages deployment has picked up that `main` release;
8. verify the deployed **dev/test entry** for the changed scope (for a new level, `?devMenu=1` must expose it);
9. verify the deployed **normal production flow** reaches the changed scope (for a new level, previous-level victory/progression must expose the new level);
10. only then report the engineering task as delivered, with any remaining player-owned visual/device smoke listed separately.

A new level/fix is therefore expected to be testable on the public test/dev URL and usable on the normal public game URL when Work says the development task is finished.

Do **not** stop merely because player phone smoke has not happened yet. When player smoke requires a deployed build, deployment is a prerequisite for that smoke.

If Work cannot merge or verify Pages because of permissions/environment/tooling, it must:

- push the latest verified feature branch;
- record the exact blocking reason and latest SHA;
- report **ENGINEERING PASS / RELEASE BLOCKED**, not "complete";
- hand off only the blocked release step for immediate completion by Chat or another authorized executor.

Stop before merge/deploy only when one of these is true:

- a required engineering test/check fails;
- an unresolved known defect makes deployment unsafe;
- the user explicitly requested a pre-merge review/checkpoint or feature-branch-only delivery;
- merge would conflict with newer `main` and requires reconciliation;
- repository permissions/tooling genuinely prevent the release action.

A handoff TXT/ZIP must **never add a feature-branch-only restriction on its own**. That restriction is valid only when the user explicitly requested it.

### Release cleanup is mandatory after a verified release

After the final release commit is confirmed in `main`, GitHub Pages has picked up that release, and there is no unmerged/unique work left in the implementation workspace, perform a bounded cleanup so future sessions do not rediscover stale temporary state.

Clean up:
- remove the isolated local worktree used only for the finished feature when it is no longer needed;
- remove untracked/temp/build/debug artifacts, ad-hoc screenshots, generated intermediate conversion files, and local caches that are not part of the shipped product or permanent verification contract;
- remove stale local implementation-only scratch files that have no canonical role;
- a fully merged feature branch may be deleted after verifying its final commits/content are reachable from `main`; keep it when release is blocked, follow-up work is still active, or it still contains unique commits.

Never delete:
- canonical docs / active-level STATE-SPEC-DESIGN-GEOMETRY-ASSETS records;
- player-approved source assets or their canonical manifests/checksums;
- production assets/code;
- permanent automated tests/fixtures that define shipped behavior;
- release/verification evidence that the repository intentionally retains;
- any file/commit that is still the only recoverable copy of work.

Cleanup is a hygiene step, not a gameplay change. It must not rewrite history, reset unrelated work, or remove anything needed by the deployed game. When safety is uncertain, preserve the item and record why instead of deleting it.

## 9. Chat-first delegation: use Work only for capabilities Chat cannot reliably provide

Token efficiency is the default project policy. Before sending any task to Work/Codex, first determine whether Chat can complete it safely with the available GitHub, file, image, analysis, and deployment tools.

- **Chat-first is mandatory.** If Chat can complete a task reliably, do it in Chat instead of delegating it to Work merely because Work is convenient.
- When Chat-owned and Work-only steps are independent or can be safely sequenced, **Chat must finish its part first** before creating the Work handoff. Do not send unfinished Chat-owned analysis/planning into Work when completing it first would reduce Work scope.
- Delegate only the smallest necessary engineering segment to Work. Do not hand Work an entire workflow when only one step requires its environment.
- Typical Chat-owned work includes: requirements/specification, GitHub inspection, root-cause narrowing, documentation/hard-rule updates, compact Work prompts, asset inventory and package planning, image/static inspection, small bounded repository edits when independently verifiable, release recovery when Work is blocked, and interpreting Work/test results.
- Work is appropriate when the task materially requires capabilities Chat cannot reliably reproduce, such as a full checked-out repository with iterative multi-file implementation, executable TDD/debug loops, `npm test` / `npm run check` / syntax or diff verification after substantial code changes, browser/runtime/devtools smoke, or long-running asset transformation/integration that must be verified in the development environment.
- If a task mixes Chat-owned and Work-only steps, Chat should complete its portion first, then send Work only the unresolved engineering delta with existing repo rules referenced instead of repeated.
- When Work is the implementation executor, Work normally continues through the Section 8 release closure itself. Chat resumes only for player-smoke interpretation, post-release follow-up, or a release step that Work explicitly reports as blocked.
- Player phone/device smoke is player-owned when explicitly delegated and should not consume Work token unless Work itself was specifically asked to perform runtime/browser verification.
- Do not send Work back to repeat analysis or documentation already completed by Chat. However, merge/deploy is part of Work's default completion boundary once Work owns a substantial implementation, unless the user explicitly requested checkpoint-only delivery.

### Asset / level ZIP handoff rule

Any future level-development ZIP, integration TXT, or Work handoff prepared in Chat must follow this delegation policy:

1. **Before building the ZIP, Chat completes every safe, order-independent Chat-owned step first.**
2. The ZIP and its TXT contain only the smallest unresolved implementation/verification delta that genuinely requires Work.
3. Keep Chat-owned planning, asset inventory, geometry/spec preparation, root-cause findings, and known decisions out of Work's active scope once already completed; include them only as concise reference evidence when Work needs them to implement correctly.
4. Tell Work to read `AGENTS.md` and relevant repo Guides instead of duplicating permanent rules in the TXT.
5. The TXT must inherit Section 8: after implementation/tests/review, Work continues through merge + Pages release + deployed dev/production verification unless the user explicitly requested a checkpoint-only handoff.

The purpose of this rule is to preserve Work token/session budget for execution capabilities that are genuinely unavailable or unreliable in Chat.

## 10. Enemy spacing is a global visual-readability rule

The player screenshot from Level3 is an example of the problem, not a Level3-only exception. Enemy spacing/readability applies to **Level1–5 and every future level**.

- Audit every level for cases where consecutive enemies visually overlap, touch, or read as one continuous sprite mass during normal movement.
- Keep enough on-path separation for individual enemy silhouettes to remain readable on a phone, including large enemies and mixed-size packs.
- Fix spacing through spawn timing / path-distance spacing logic or another non-balance presentation-safe mechanism. Do **not** change enemy HP, damage, speed, Wave composition/counts, rewards, Boss stats, or tower balance merely to create visual separation.
- Different sprite sizes may require different minimum visual gaps; do not assume one fixed pixel gap is correct for all enemy types.
- Dense waves may still look intentionally busy, but sprites must not appear accidentally fused into a single chain because spawn spacing is too small.
- When adding a new enemy, Wave, or level, include spacing/readability in the same path/anchor audit before release.
- Future level ZIPs and integration TXT files must treat this as an inherited global requirement rather than a one-off Level3 fix.

This rule concerns visual readability and spawn presentation. It must preserve the designed combat balance unless the user explicitly requests a balance change.

## 11. Future level development pipeline: Chat prepares first, Work receives only the irreducible delta

For every new level (Level6 and later), preserve dependency order but minimize Work usage.

- Chat first completes all work that can be done safely **without blocking or invalidating later implementation**: level specification, progression requirements, roster/unlock rules, asset list and naming, package manifest, geometry planning/measurements that can be established statically, integration notes, acceptance criteria, test scope planning, and any bounded repository/document changes Chat can verify independently.
- Chat must not perform a step early if doing so would be invalidated by later Work implementation or if correct execution genuinely depends on the full runtime/repository environment. In that case, leave that step to Work.
- Only after the Chat-owned preparation is complete should Chat build the development ZIP. The ZIP must package the finished reference assets/specs plus a **short TXT containing only the remaining Work-only implementation and verification tasks**.
- The TXT should reference `AGENTS.md` and relevant Guides for permanent rules instead of repeating them, and should state only the current level's delta, unresolved technical work, and required executable checks.
- Work must not redo completed Chat-owned planning, measurements, inventory, or documentation unless runtime evidence proves them wrong.
- When Work owns the implementation, the same Work task should finish the Section 8 release closure. Chat only takes over a release step if Work records a concrete blocker, or if the user explicitly requested a checkpoint before release.

This is the default new-level workflow unless the user explicitly requests a different division of labor.
## 12. Completed-level compatibility and shared unit behavior are permanent

Future-level development is **additive by default**. Existing playable levels are frozen unless the player explicitly asks to change them.

- Do not change completed levels' gameplay, Wave composition, balance, path geometry, tower slots, unit sizing, Motion Lite behavior, facing behavior, UI behavior, or approved art merely because a new level is being added.
- If a shared-system change is genuinely required for a new level, preserve the observable behavior of all completed levels and add targeted regression for every affected shared contract.
- Reuse shared movement / rendering systems instead of creating level-specific duplicates when the shared system already provides the behavior.
- **Motion Lite is inherited by all future units.** New enemies / Bosses must use the existing subtle idle/bob/hit/death motion architecture; future deployable beasts must use the existing idle/recoil architecture unless the level design explicitly documents a justified exception.
- **Enemy path-facing is inherited.** Moving enemies / Bosses use the shared path-direction facing logic and mirror when their travel direction changes. Do not create a second per-level facing system.
- **Tower target-facing is inherited.** Deployable beasts face their attack target through the shared facing mechanism and retain the resulting facing after the attack. New future towers must join the same contract.
- Unit motion / facing are presentation rules only. Do not alter damage, interval, range, speed, targeting, pathDistance, or timing merely to make animation look better.
- Runtime visual scale should remain consistent with established same-class units unless a documented gameplay/readability reason requires an exception. An exception must be narrow and must not silently rescale older levels.

## 13. Player-approved artifacts and geometry are canonical

When the player approves a geometry, asset choice, UI contract, or level specification and it is recorded in the repository or handoff package, that approved artifact becomes the canonical source.

- A later Chat / Work / Codex session must not re-measure, reinterpret, regenerate, restyle, or replace an approved artifact merely because the session changed.
- Rework is allowed only when the player explicitly requests it or runtime evidence proves the approved artifact is invalid.
- Player screenshots may identify a mismatch, but canonical coordinates must come from the approved runtime geometry / source background, not from browser chrome or phone-screen pixel guessing.
- For maps, keep background version/crop, logical coordinate system, ordered waypoints, Spawn, Base, slots, and special zones as one geometry contract. Changing one requires re-validating the whole affected contract.
- Work must use the approved geometry supplied in the level spec / package; it must not redraw a path from the background by eye.
- Approval state must be reported precisely: design/player approval is not the same as runtime verification or phone smoke.

## 14. Pre-handoff asset gate for future levels

Before Chat creates a new-level ZIP for Work:

1. the player re-uploads the **actual final files they downloaded and intend to hand off** for implementation; do not build the Work ZIP directly from temporary chat-generation references, previews, or assumed filenames;
2. Chat performs a final asset-identity audit against the repository's approved records (`ASSETS.md`, level `STATE.md`, manifests, and any canonical approval notes);
3. the audit must confirm, per asset:
   - the uploaded file is the same approved visual/version;
   - purpose and asset identity are correct;
   - no obsolete or unapproved variant is mixed in;
   - filename mapping is unambiguous;
   - format is correct;
   - transparency/alpha exists where required;
   - dimensions/aspect/crop are acceptable;
   - the file can be mapped to the intended runtime inventory;
4. Chat compares the **player-uploaded final set** against the **recorded approved set** and confirms the two sets are complete and consistent;
5. if any mismatch, missing file, stale version, wrong alpha/background, or uncertain identity is found, **stop the handoff gate** and resolve that discrepancy before packaging;
6. only after that audit passes does Chat normalize filenames, create/refresh the final asset manifest and checksums, and prepare runtime-optimization candidates as appropriate;
7. Chat finishes every other safe static task it can complete, including canonical geometry/specs, UI contracts, runtime-size targets, manifests, and acceptance criteria;
8. source art and runtime deployment assets remain distinct; oversized source art is not considered ready for deployment;
9. the ZIP contains only the audited player-uploaded final assets/reference specs plus the smallest unresolved implementation/verification delta that genuinely requires Work.

### Final-file identity rule

The authoritative input to a Work ZIP is the **player re-uploaded, audited final file set**, not Chat memory and not a prior temporary generation attachment.

A chat-generated image may become approved source art during design, but before Work packaging the player must re-upload the copy they actually kept/downloaded. Chat then verifies that this concrete file matches the recorded approved identity.

The purpose is to prevent:
- packaging the wrong revision;
- mixing approved and obsolete variants;
- filename/content drift;
- alpha/crop/format mismatches;
- Work integrating an image that differs from what the player approved.

This gate supplements Sections 9 and 11. The purpose is to prevent Work from spending tokens rediscovering decisions, inventing missing art rules, or redoing tasks Chat can safely complete.
## 15. Post-Level4 roster, Blessing, unlock, and next-level UI must be data-driven

Level4+ progression must not grow through per-level hard-coded roster arrays or repeated level-number conditionals.

- The source of truth is the player's owned/unlocked deployable roster plus optional level-specific eligibility. Lineup UI must render that data; it must not embed a fixed list such as the original four beasts.
- Level4+ continues to require exactly 3 selected beasts unless the player explicitly changes the global lineup rule.
- Retry on Level4+ always clears the current lineup and returns to an empty selection.
- Unlocks are progression data, not UI-only effects. A victory unlock must update owned roster state once, while its presentation may be shown conditionally for the first unlock.
- A beast unlocked by clearing a level becomes eligible for later playable levels, not retroactively for the battle that just ended.
- Next-level availability must be derived from actual playable level data (for example whether the next level exists), not from comparisons such as `levelId < N`.
- If no next playable level exists, the result UI must not show a next-level action. When a next level is later added to level data, the prior level's victory flow should expose it without a new level-number patch.
- Blessing filtering must be driven by the current lineup / eligible tower types. Tower-specific Blessings for beasts not selected in the lineup must not appear; shared/all-team Blessings may still appear.
- Blessing ownership should scale through common blessing data tagged by tower/beast identity. Avoid accumulating files or branches whose semantics are only `LEVEL4_*`, `LEVEL6_*`, etc. when the mechanic is globally reusable.
- UI labels, cards, result unlocks, and roster grids should consume level/progression data rather than duplicate game rules in presentation code.
- Any migration from existing hard-coded Level4/5 behavior to data-driven progression must preserve current Level1–5 observable behavior and add targeted regression for lineup contents, exactly-3 validation, retry reset, Blessing filtering, unlock state, first-unlock presentation, and next-level visibility.


## 16. Attack-visual implementation and asset-production policy

Every new tower attack, enemy attack, Boss skill, projectile, status effect, or battlefield VFX must be classified **before** it is added to an image-generation batch.

### A. Procedural-first

Use code-generated rendering by default when the visual is primarily:
- beam / laser / energy line / linked ray;
- aura / shield / glow;
- area / zone highlight;
- status indicator;
- short hit flash / impact spark;
- speed / motion trail.

Procedural-first items are **not** added to the formal batch-image production list by default.

### B. PNG-first

Use a dedicated transparent runtime asset when the player needs to see a distinct physical projectile body, for example:
- fireball;
- ice shard;
- rock shot;
- feather / leaf / blade projectile;
- solar orb;
- thorn / seed / other identifiable object.

PNG-first items belong in the formal asset-production list after the visual direction is approved.

### C. Hybrid

Use a small clear PNG core plus procedural trail / glow / impact when a recognizable projectile body is needed but a fully image-driven effect would be unnecessarily heavy.

### Decision and escalation rules

- Decide Procedural-first / PNG-first / Hybrid **before** batch image generation.
- Do not generate projectile art “just in case”.
- If a Procedural-first result is clear at 390px / 390×700, keep it procedural and do not later add redundant art merely for decoration.
- If player/runtime smoke shows the procedural result is unclear, it may be escalated to Hybrid or PNG-first.
- If classification is uncertain, first provide a lightweight mockup, textual visual spec, or small runtime prototype for player review. Do not add it to the final production list until the direction is agreed.
- Visual choice must preserve gameplay timing, damage, targeting, range, pathing, and balance unless the player explicitly requests a gameplay change.
- Reuse existing approved effects/assets when suitable instead of generating near-duplicate art.
- This policy applies project-wide to all future levels and all future Chat / Work sessions.


## 17. Active-level continuity, read order, and handoff state are mandatory

The repository, not conversation memory, is the source of continuity for long-running level development. A new Chat, Work, Codex session, or recovered session must identify the active level and read its current state before planning or implementation.

### Required read order

Before changing an active level:

1. read `AGENTS.md`;
2. read the newest relevant summary in `docs/WORK_PROGRESS.md`;
3. identify the active level;
4. read `docs/levels/levelN/STATE.md`;
5. read `docs/levels/levelN/SPEC.md`;
6. read `GEOMETRY.md` when touching map/path/slots/zones/anchors;
7. read `ASSETS.md` when touching art/VFX/HUD/projectiles/preload;
8. read `DESIGN.md` only for proposals, alternatives, rationale, and items not yet promoted to the formal spec;
9. inspect the current branch / latest relevant SHA and diff;
10. continue from the **Next exact step** recorded in `STATE.md`.

**Do not start implementation until the active-level state has been identified.**

### Per-level document contract

For every newly developed level, use:

```
docs/levels/levelN/
  STATE.md
  SPEC.md
  DESIGN.md
  GEOMETRY.md
  ASSETS.md
```

- **STATE.md** — the handoff entry point: current phase, approval state, branch/SHA, completed work, pending work, blockers, verification status, and one precise Next exact step.
- **SPEC.md** — only approved/frozen implementation requirements. Draft proposals must not be silently promoted here.
- **DESIGN.md** — proposals, alternatives, rationale, balance drafts, and player-approval-pending decisions.
- **GEOMETRY.md** — canonical logical map size, background/crop identity, ordered path, Spawn/Base, tower slots, special zones, anchors, and geometry approval/runtime status.
- **ASSETS.md** — approved/planned asset inventory, filenames, Procedural-first / PNG-first / Hybrid classification, alpha/format/size/preload state, and asset approval status.

### Source-of-truth priority

If documents disagree, resolve in this order:

1. `AGENTS.md` for project-wide hard rules;
2. active-level `STATE.md` for current phase/status and what work is next;
3. active-level `SPEC.md` for approved gameplay/acceptance requirements;
4. active-level `GEOMETRY.md` / `ASSETS.md` for their domains;
5. `docs/WORK_PROGRESS.md` for cross-project chronology/recovery notes;
6. active-level `DESIGN.md` and older drafts for non-authoritative proposals/history.

A newer player-approved decision recorded in the appropriate canonical file supersedes an older proposal. Do not use an old draft to override a formal spec.

### State-update checkpoints

Update the active level's `STATE.md` whenever any of these changes:

- player approval/freeze status;
- design/spec milestone;
- canonical geometry;
- asset inventory/classification;
- implementation branch or relevant SHA;
- engineering test/check status;
- merge/main release status;
- Pages deployment status;
- player phone/device smoke status;
- blocker;
- Next exact step.

For a substantial session, update `STATE.md` before handoff or interruption even if `WORK_PROGRESS.md` is also updated.

### No-memory / no-rework rule

- Do not rely on a previous Chat's memory, a long conversation transcript, or an old Work prompt as the canonical source.
- Do not ask the player to re-explain information already recorded in the active-level canonical files.
- Do not re-design, re-measure, regenerate, or re-implement work marked approved/completed merely because a new session started.
- If runtime evidence contradicts a canonical document, record the discrepancy in `STATE.md`, preserve the last known-good source, and resolve it explicitly before changing the spec.
- Work handoffs should reference these files rather than restating large permanent context blocks.


## Dynamic released-baseline rule

Future-facing rules must **never hard-code a historical level range** such as `Level1–8`, `Level1–10`, etc. as the permanent comparison, regression, protection, or architecture baseline.

For any new level or shared-system change:
- resolve the **currently released / deployed / player-verified product baseline** from repository state at execution time;
- every level already released at that time is part of the protected/reference baseline unless the concrete change impact proves a narrower regression scope is sufficient;
- historical documents may state the exact released range that was true at that date; those historical ranges are evidence of past state, **not future-facing scope limits**;
- instructions such as "do not redo old levels", "compare against released HUDs", "preserve prior behavior", and "run affected regressions" always refer to the dynamically resolved released baseline;
- when a new level is released, the baseline automatically expands for all later development without requiring this rule to be rewritten.

Use specific level numbers only when the rule genuinely concerns those particular levels as historical facts or explicitly scoped exceptions.

### Level closure

When a level is fully released:
- mark `STATE.md` as released;
- record final main/release SHA, deployment verification, and any remaining player-smoke note;
- preserve the level folder as the historical/canonical record;
- move the active-level pointer in `WORK_PROGRESS.md` to the next level rather than deleting prior-level documentation.


## 18. Stage-gate execution and current-action allowlist are mandatory

The active-level documents are not only memory aids; they are execution gates. A Chat / Work / Codex session must stay inside the currently approved development stage and may not jump ahead just because a later task is already foreseeable.

### Stage gate rule

Before taking any substantial action, identify the active level's current gate from `STATE.md`.

Examples of gates:
- concept/design review;
- player approval;
- numerical freeze;
- map concept;
- canonical geometry;
- asset mockup review;
- approved asset batch;
- production implementation;
- engineering verification;
- release;
- player smoke.

Do not execute work from a later gate until the current gate's exit condition is satisfied.

### Current-action allowlist

`STATE.md` must contain:
- **Current gate**
- **Allowed now**
- **Forbidden until gate exit**
- **Gate exit condition**
- **Next exact step**

Only actions listed under **Allowed now** are in scope by default.

If a proposed action is not clearly allowed:
1. stop;
2. check `SPEC.md`, `ASSETS.md`, `GEOMETRY.md`, and the player's latest instruction;
3. if still unclear, ask/confirm rather than silently expanding scope.

### Batch image generation gate

Image generation is especially strict because it is easy to jump ahead.

- Never generate a whole future asset list merely because the items are known.
- A batch may contain only assets marked **APPROVED_FOR_GENERATION** in the active level's `ASSETS.md`.
- Items marked `proposal`, `mockup first`, `pending discussion`, `Procedural-first`, `not yet approved`, or equivalent are **not allowed** in the batch.
- Before every batch, compare the requested/generated items against the current approved allowlist.
- If the batch is sequential, generate only the current approved batch/sub-batch. Do not include assets planned for a later discussion stage.
- If a later asset becomes obviously necessary while producing an earlier batch, record it as pending; do not generate it early.
- Player approval of one item does not imply approval of adjacent/future items.
- A newly generated image must not retroactively be treated as approved simply because it now exists.

### Discussion-before-generation gate

For any item whose design was supposed to be discussed first:
- discuss/approve the concept first;
- update `ASSETS.md` status;
- only then generate it.

This includes borderline Procedural/PNG/Hybrid cases, new Boss/HUD concepts, new deployable-beast projectiles, and any asset whose visual direction has not yet been agreed.

### Self-check before action

Before acting, the agent should be able to answer:
1. What is the active level?
2. What is the current gate?
3. Is this exact action in **Allowed now**?
4. Does it require player approval first?
5. Am I accidentally doing work from a later gate?
6. Will this action invalidate or bypass an earlier decision step?

If any answer is uncertain, do not proceed silently.

### Drift correction

If a session notices it has already crossed a gate incorrectly:
- stop the out-of-order work;
- do not continue merely to “finish the batch”;
- mark the premature output as unapproved/unused unless the player explicitly accepts it;
- update `STATE.md` with the process deviation and correct Next exact step;
- resume from the proper gate.

The purpose is to keep the whole development path consistent from initial design through release, including when the same Chat continues for a long time.


## 19. Project onboarding, pre-action context refresh, and document-completeness audit are mandatory

These continuity rules apply to **all future development**, not only Level7 or any specific level. They are intended for any new developer, Chat, Work, Codex session, or returning session that takes over this repository.

### New-session onboarding before execution

Before proposing, asking, editing, implementing, generating assets, delegating to Work, or running release work, a new/returning session must first understand the project at three levels:

1. **Project-wide rules and architecture**
   - read `AGENTS.md`;
   - read `docs/DEVELOPMENT_PLAYBOOK.md`;
   - read any domain guide relevant to the task, especially `docs/ASSET_INTEGRATION_GUIDE.md` for art/VFX/UI/geometry work.
2. **Current cross-project progress**
   - read the newest active pointer / relevant summary in `docs/WORK_PROGRESS.md`;
   - identify the active level or active subsystem.
3. **Current local state**
   - for level work, read that level's `STATE.md` first, then the relevant `SPEC.md`, `GEOMETRY.md`, `ASSETS.md`, and `DESIGN.md`;
   - inspect the current branch, latest relevant SHA, and diff before changing code or documents.

A session must not begin execution merely from conversation memory or from the latest user sentence in isolation.

### Pre-action context refresh

This rule also applies **inside the same long Chat/Work session**.

Before any substantial next action, the agent must refresh enough current context to answer:

- What is the active scope?
- What is already approved/frozen?
- What is still proposal/pending?
- What is the current stage/gate?
- What actions are allowed now?
- What action is forbidden until later?
- What is the one current Next exact step?
- Has anything changed in GitHub since the last action?

“Substantial action” includes:
- asking the player to make a design decision;
- proposing a new feature/mechanic that changes scope;
- generating or requesting assets;
- editing canonical specs/geometry;
- implementing production code;
- sending a Work handoff;
- merging/deploying/releasing.

Do not keep marching forward from an old mental snapshot when the repository state should be checked.

### Pre-question check

Before asking the player a development question:

1. check whether the answer is already recorded as approved in `SPEC.md`, `STATE.md`, `GEOMETRY.md`, or `ASSETS.md`;
2. check whether the question belongs to the **current gate**;
3. do not re-ask decisions that are already frozen;
4. do not ask later-stage questions merely because they will eventually be needed;
5. if one option is already the repository-safe default and does not change approved design, player-visible behavior, gameplay/balance, frozen geometry/assets, scope, or destructive risk, **take that default and continue without asking**;
6. if multiple implementation options are functionally equivalent, prefer the smallest reversible change that follows existing architecture and preserves completed behavior;
7. if a safe fallback is available after a non-destructive failure, try the fallback before asking the player;
8. ask only the smallest unresolved decision needed to advance the current gate.

A player choice is required only when the unresolved choice materially changes approved design or player-visible behavior, changes gameplay/balance or frozen geometry/assets, expands scope, introduces destructive/conflict risk, or cannot proceed because of a genuine permission/environment blocker.

If the player says **「繼續」 / "continue"** and `STATE.md` contains one unambiguous **Next exact step**, execute that step immediately. Do not stop to present implementation choices that are already covered by repository defaults.

This prevents repeated questions, avoids unnecessary Work stalls, and prevents discussion from jumping ahead of the intended development sequence.

### Decision promotion is immediate

When the player approves, rejects, or revises a development decision:

- update the appropriate canonical file in the same development stage;
- approved gameplay/acceptance requirements move into `SPEC.md`;
- approved map geometry moves into `GEOMETRY.md`;
- approved asset classifications/inventory/status move into `ASSETS.md`;
- unresolved alternatives and rationale remain in `DESIGN.md`;
- update `STATE.md` so the next session can see the decision without reading the chat.

A decision is not considered safely preserved if it exists only in conversation text.

### Stage-completeness audit before advancing

A gate may advance only after its required documentation is complete enough for the next stage.

Before changing the current gate, verify:
- all decisions required by the current gate are recorded;
- unresolved `TBD` / pending items are either intentionally deferred or are not blockers for the next gate;
- the canonical file for each affected domain exists and is current;
- `STATE.md` reflects the new phase;
- the next stage's prerequisites are explicit.

If required information is missing, remain in the current gate. Do not let Work or implementation invent the missing decision.

### Handoff-completeness audit

Before handing work to another Chat/Work/developer:

- confirm the new owner can identify project architecture, active scope, current gate, approved requirements, canonical geometry/assets if applicable, current branch/SHA, verification status, blockers, and Next exact step **from repository documents alone**;
- update `STATE.md` immediately before handoff when needed;
- keep the handoff prompt short and point to canonical docs instead of reconstructing the project from memory;
- never make the next owner infer decisions from old chat transcripts.

### Documentation lifecycle

The documentation system is part of production development, not optional notes.

For each active level:
- `STATE.md` stays small/current and is updated continuously;
- `SPEC.md` contains only approved/frozen implementation requirements;
- `DESIGN.md` can be long and retain proposals/history;
- `GEOMETRY.md` is the canonical geometry record;
- `ASSETS.md` is the canonical asset/VFX status and generation/integration record.

When a level is complete, freeze its final state rather than deleting the documentation. Future levels start from the same structure.

### Drift prevention principle

At every stage, prefer:
**understand current state → confirm allowed next step → act → record the resulting decision/state → then continue.**

Do not use:
**remember roughly → act several steps ahead → document afterward.**


## 20. Anti-leak governance and Work budget are permanent

All future development must also follow `docs/DEVELOPMENT_GOVERNANCE.md`.

The high-level rules are:

- use lightweight machine-checkable preflight for structural/gate mistakes;
- assign stable Decision/Requirement IDs only to important cross-file or verifiable decisions;
- perform compact change-impact / traceability checks when an approved decision changes;
- perform a bounded pre-merge Red Team audit on the changed scope;
- map requirements to the **cheapest valid verification owner**: STATIC, TARGETED_TEST, WORK_RUNTIME, PLAYER_SMOKE, or MIXED;
- governance must reduce Work usage rather than create more Work;
- Chat completes all safe planning/spec/static/preflight/impact work before handoff;
- Work receives only the smallest executable delta that genuinely requires its environment;
- player-owned phone/visual/usability smoke must not be duplicated by Work unless explicitly requested;
- full tests/browser smoke are risk- and scope-driven, not automatic rituals.

Before any Work handoff, Chat must confirm that the repository already contains enough canonical context for Work to execute without rediscovering decisions.

If a new governance rule would require Work to spend substantial time/tokens on checks that Chat, a static script, or the player can perform more cheaply, redesign the rule before adopting it.


## 21. Creature / monster art generation is a permanent mobile-readability contract

This rule applies to every future **enemy, Boss, and creature sprite** unless a documented asset-specific exception is approved.

### Reference existing game art before generation

Before proposing or generating a new creature:
- inspect the established creature sprites from completed levels;
- match the existing game's simplification level, silhouette language, cel-shading/flat-color treatment, outline weight, contrast, and mobile-scale readability;
- do not design a creature as a standalone illustration that looks good only when enlarged;
- do not introduce a visibly different art style merely because a new level has a different theme.

The target is **same game, new creature**, not **new art style per level**.

### Silhouette and major features come before detail

Creature design priority is:

1. readable outer silhouette;
2. immediately identifiable major feature(s);
3. clear facing / movement direction;
4. a small amount of supporting detail.

Rules:
- ordinary enemies must be especially simple;
- Bosses may carry more detail, but their silhouette and major feature still come first;
- remove decorative fragments, armor pieces, feather subdivisions, micro-patterns, tiny glow marks, or texture that do not survive the intended mobile runtime size;
- if removing roughly half the small detail does not hurt recognition, prefer the simpler version.

### Color and contrast are gameplay requirements

- Use a small number of clear color groups.
- Major identifying parts must contrast against the body: head/face, eye, horn, wing, tail, weapon, core, shell, etc.
- Avoid large dark/black masses with low internal separation; on a phone they can collapse into one unreadable blob.
- Avoid many neighboring mid-tone colors that merge after downscaling.
- Attribute color (thunder/fire/wood/etc.) is secondary to silhouette and contrast.
- Judge the sprite at expected runtime scale, not only at source-image size.

### Production-facing source art

For a creature intended to enter the game:
- final discussion candidates should already be **single-creature, transparent-background PNG-style assets** suitable for game integration;
- no text, labels, captions, frames, comparison grids, orthographic boards, concept-sheet layouts, size-preview panels, or multiple separated poses unless the player explicitly asks for a design sheet;
- no baked environment/background;
- no baked ground shadow unless the runtime contract explicitly requires one;
- no baked motion trail, speed line, aura, shield, status effect, or large glow when that effect is classified Procedural-first;
- preserve enough transparent margin for Motion Lite / hit / death presentation without clipping;
- default facing must follow the shared facing contract so runtime mirrorX can handle opposite travel/target direction.

### Player-discussion workflow for creature art

The default iteration loop is:

1. discuss the creature's role and the few defining visual features;
2. generate **one single production-style PNG candidate**;
3. player reviews that actual game-usable candidate;
4. revise the same creature as another single PNG candidate if needed;
5. when the player approves it, record it as the canonical approved source art;
6. only then move to the next creature/sub-batch.

Do **not** insert concept sheets, multi-panel creature boards, sprite atlases, or unrelated future assets into this loop unless the player explicitly requests them.

Approval of one creature does not approve adjacent creatures, Boss HUDs, projectiles, or VFX.

### Boss HUD name / health-channel contract

For every Boss HUD source asset:
- reserve a distinct **Boss-name panel above the health channel**; the runtime writes the Boss name there;
- the name panel may use a dark solid or near-solid fill so the existing Boss-name text stays readable over bright maps/VFX;
- keep the health channel itself visually separate and empty; runtime HP remains the only dynamic fill;
- **do not guess the visual slot placement from the artwork alone**. Before asset approval, inspect the actual runtime contract in `index.html`, `styles.css`, `UIController` and `BOSS_HUD_GEOMETRY`;
- the current shared runtime contract uses a fixed **44 px Boss slot height**. The Boss name is program text in the upper center (`top: 2px; left: 20%; width: 60%`), while the HP track is a separate runtime rectangle positioned in the middle/lower portion by `BOSS_HUD_GEOMETRY`;
- therefore source art must visually support **one upper-center name reserve + one middle/lower empty HP channel**, both inside the same fixed outer HUD footprint. Do not create two large independent stacked boxes;
- compare the proposed source aspect ratio against a released HUD before approval. A released reference is Level7 夔 at **1152×351 (~3.28:1)**; use an equivalent wide/flat footprint unless a layout change is explicitly approved;
- keep decorative Boss art away from the reserved runtime name/track rectangles so program text/fill remains readable and centered;
- do **not** increase the HUD's overall runtime footprint merely to add the name panel if the existing Boss-HUD container can accommodate it;
- prefer integrating the name reserve inside the same fixed HUD image/container height so battlefield/map height is not compressed;
- any HUD source-art redesign must preserve the established runtime outer bounds/aspect contract unless a layout change is explicitly approved;
- if a proposed HUD would require a taller runtime container or shift the battlefield, stop and treat that as a player-visible layout change rather than a cosmetic asset edit.

### Boss HUD approval preflight

Before calling a Boss HUD image `PLAYER_APPROVED` / `APPROVED_FINAL`, verify all of the following:
1. source aspect is consistent with a released Boss HUD;
2. intended runtime box remains the shared 44 px slot;
3. upper-center runtime Boss-name rectangle is visually unobstructed;
4. the intended `BOSS_HUD_GEOMETRY` HP track lands inside the visible empty channel;
5. HP text remains readable within/adjacent to that track;
6. no baked Boss name, HP fill, HP number, or debug marker exists in the PNG;
7. no extra vertical height or battlefield compression is introduced.

When generating a new HUD, the source art is a **frame/background for runtime overlays**, not the final composed HUD screenshot.

This rule applies project-wide to future Boss HUDs unless the player explicitly changes the UI contract.

### Mobile-readability check before approval

Before calling a creature art direction ready, verify conceptually/staticly:
- major silhouette remains recognizable around the established same-class runtime size;
- major feature remains visible after downscaling;
- color blocks stay separated;
- the body does not become one dark mass;
- source pose works with shared path-facing/target-facing mirror behavior;
- procedural effects have not been unnecessarily baked into the sprite.

Runtime/player smoke remains the final visual acceptance when the creature is integrated.

### Canonical-art rule

Once the player approves a single creature PNG candidate:
- do not regenerate/restyle it merely because a new Chat/Work session starts;
- later processing may trim/resize/compress/optimize it for runtime, but must preserve the approved visual identity;
- replacement requires explicit player request or concrete runtime evidence that the approved asset is unusable.


## 22. Zero-context takeover is the default for every new Chat / Work / Codex session

The repository must be sufficient for a brand-new session to continue without the player reconstructing the previous conversation.

This rule applies equally to **Chat, Work, Codex, and any future developer/agent**.

### Mandatory zero-context bootstrap

When a user says only that they want to continue this repository/project, continue the current level, start the next level, or resume after an interruption, the new session must **not ask the player to restate prior decisions first**.

Before substantial work:

1. sync / inspect the latest remote `main`;
2. read `AGENTS.md`;
3. read `docs/DEVELOPMENT_PLAYBOOK.md`;
4. read the **CURRENT HANDOFF POINTER** at the top of `docs/WORK_PROGRESS.md`;
5. read the active level's `STATE.md`;
6. read only the canonical domain files required by the next action (`SPEC.md`, `GEOMETRY.md`, `ASSETS.md`, `DESIGN.md`);
7. inspect any recorded active feature branch / latest safe-push SHA before creating new implementation work;
8. continue from the **first unfinished item / Next exact step**.

A conversation transcript, old Work prompt, or player-written recap is optional context, never the primary source of truth.

### Mid-development recovery

If the current handoff pointer or active `STATE.md` records an active feature branch / safe-push SHA:

- recover that remote work first;
- compare it with current `main`;
- reuse recorded PASS evidence unless later changes invalidate it;
- do not start a replacement branch or reimplement completed work merely because the session is new.

If Work/session capacity ends, Section 2 must be completed before stopping so the next zero-context session can recover from GitHub.

### Starting the next level

If the latest level is recorded as **RELEASE COMPLETE / FROZEN** and no newer active level folder exists, a request to develop the next level means:

1. determine the next numeric level from the released baseline;
2. initialize `docs/levels/levelN/` from `docs/levels/_TEMPLATE/`;
3. set the initial progression/scope gate;
4. update the CURRENT HANDOFF POINTER in `docs/WORK_PROGRESS.md`;
5. then proceed through the normal Chat-first stage gates.

Do not ask the player for an old handoff prompt just to initialize the next level.

### Release-state closure is mandatory documentation

A release is not handoff-complete until repository docs are closed out after merge/deployment.

After a verified release, update:
- active level `STATE.md` to released/frozen status;
- merged `main` SHA;
- Pages/public verification state;
- player-smoke status separately;
- `docs/WORK_PROGRESS.md` CURRENT HANDOFF POINTER;
- the singular next action (for example player smoke only, or initialize the next level).

A stale `STATE.md` that still says implementation/release is pending after the code is deployed is a handoff defect and must be corrected before considering release cleanup complete.

### No unnecessary player re-briefing

Ask the player to repeat context only when:
- required information is genuinely absent from repository canonical docs;
- two canonical sources conflict and the conflict cannot be resolved from commits/runtime evidence;
- an explicit new design choice is required.

Otherwise proceed from GitHub state directly.


## 23. Pre-release visual integration gate is mandatory for every future level

The Level8 retrospective in `docs/retrospectives/LEVEL8_RETROSPECTIVE.md` is a permanent source for why this gate exists.

For **every future level after Level8** (Level9, Level10, Level11, and onward), do **not** treat internally consistent coordinates, green unit tests, or a visually plausible source image as sufficient proof of player-visible alignment. This is a permanent project-wide rule, not a Level9-specific exception.

Before production implementation / Work handoff:

1. **Gameplay geometry comes before background art.** Define a logical Gameplay Geometry Guide first (normally 390×610) containing the intended path centerline, road width, Spawn/Base, T1–T8 and any gameplay-critical landmark/special-zone anchors.
2. Statically validate that guide for path continuity/turns, tower-road clearance, tower spacing/useful coverage, Spawn/Base/UI clearance and special-anchor clearance.
3. Create/select the production background so its visible road, buildable pads/ground and gameplay landmarks **follow the approved guide**. Do not let an attractive AI-generated background redefine the gameplay layout after the fact.
4. Freeze the **exact production background file**, source dimensions, crop, logical/runtime dimensions and source→logical transform.
5. Overlay the unchanged Gameplay Geometry Guide on that exact production background. If the background materially misses the guide, reject/regenerate/correct the background rather than moving gameplay geometry for convenience.
6. Obtain player approval of the registered overlay before freezing final geometry;
4. compare any new Boss HUD against an already released Boss HUD outer footprint; name panel + empty HP channel must fit inside the established footprint unless the player explicitly approves a layout change;
5. validate the W10/Boss **timeline**, including exact spawn order and whether the Boss signature mechanic actually overlaps the enemies/terrain it is intended to affect;
6. check required ambient/VFX readability at ~390 px width before release; subtle is acceptable, effectively invisible is not.

Before final release closure, verify the player-visible integration checklist from the retrospective:
- background/geometry registration;
- path and tower-pad centering;
- Spawn/Base and labels;
- sprite visual anchors;
- Boss HUD footprint;
- Boss mechanic readability in the actual encounter timeline;
- environment/special-zone readability;
- Motion Lite visibility;
- progression/unlock presentation.

Automated tests must cover internal contracts, but **visual geometry truth must also be tied to the approved production background transform**. A test that only matches hard-coded coordinates cannot prove visible alignment.

When a guide image and clean production background are separate files, never assume identical pixel registration. Measure/derive the transform explicitly before freezing any guide-derived coordinates.

### Geometry-source precedence is permanent
For every future level, the source-of-truth order is:
**approved gameplay geometry guide → production background constrained to that guide → exact registration overlay → final geometry freeze**.

Never use:
**AI background first → eyeball/trace a route afterward → move gameplay to match art**.

If a generated background cannot represent the approved route/pads/anchors accurately, the background is the rejected artifact, not the gameplay guide.


## 31. Scalable asset-loading reliability

This rule applies to all current and future levels.

1. The blocking loading gate must be **state-specific and minimal**. It may wait only for assets required to render the immediately visible entry state (for example battlefield essentials for Preparation, or visible roster art for Lineup).
2. Do not hard-code a preload policy whose blocking set grows monotonically with every future unlocked beast, level, Boss, VFX, or UI asset. Newly released content must not make every later level wait for the whole historical asset catalog.
3. Decorative UI frames, later-wave enemies, Boss art, Boss HUDs, unlock art, and combat VFX belong in deferred/background preload unless the current first-visible state genuinely needs them.
4. A transient image network error must not become an immediate permanent fallback. Required/deferred assets must receive a bounded retry policy before terminal failure.
5. Terminal failures must remain observable: expose the failed asset IDs/URLs through debug/load metrics or equivalent release diagnostics.
6. Failure handling must never create an infinite loading screen. After bounded retries, allow the existing fallback renderer to continue while preserving failure evidence.
7. When a next level is known at a victory/result screen, prefetch that next level's minimal required entry assets while the player is still on the result screen.
8. Public release verification must check not only that the page opens, but that representative real assets are present: production background, lineup/tower art, and any current-level first-paint asset. A fallback road or `?` placeholder is a release defect.
9. Use the currently released product state dynamically. Do not encode today's level range or roster size as a permanent preload assumption.


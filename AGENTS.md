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
3. read `docs/WORK_PROGRESS.md`;
4. inspect recent commits and diff;
5. continue from the first unfinished item only.

Do not reimplement already committed/pushed work.

If the expected branch or SHA is missing remotely, first inspect the current/local workspace and reflog for recoverable commits. Recovery comes before reimplementation.

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

## 8. Default delivery flow: verified work continues through main deployment

Unless the user explicitly says **feature branch only**, **do not merge**, **do not deploy**, or otherwise asks for a review checkpoint before release, the default completion flow for this repository is:

1. implement on a safe feature branch;
2. run the task-required targeted and regression checks;
3. if engineering verification passes, push the feature branch checkpoint;
4. safely merge the verified change into `main`;
5. push `main` so GitHub Pages can deploy the build;
6. report **ENGINEERING PASS / PLAYER SMOKE PENDING** when the remaining visual/device acceptance is explicitly delegated to the player.

Do **not** stop merely because player phone smoke has not happened yet when that smoke requires the deployed Pages build. In that case, deployment is a prerequisite for the player's acceptance test, not a reason to withhold deployment.

Stop before merge/deploy only when one of these is true:

- a required engineering test/check fails;
- the change has an unresolved known defect that makes deployment unsafe;
- the user explicitly requested a pre-merge review/checkpoint or feature-branch-only delivery;
- merge would overwrite or conflict with newer `main` work and requires reconciliation first.

Do not invent a feature-branch-only restriction that the user did not ask for. For routine fixes intended for immediate player testing, engineering PASS should normally produce a deployable Pages build in the same Work task.

## 9. Chat-first delegation: use Work only for capabilities Chat cannot reliably provide

Token efficiency is the default project policy. Before sending any task to Work/Codex, first determine whether Chat can complete it safely with the available GitHub, file, image, analysis, and deployment tools.

- **Chat-first is mandatory.** If Chat can complete a task reliably, do it in Chat instead of delegating it to Work merely because Work is convenient.
- When Chat-owned and Work-only steps are independent or can be safely sequenced, **Chat must finish its part first** before creating the Work handoff. Do not send unfinished Chat-owned analysis/planning into Work when completing it first would reduce Work scope.
- Delegate only the smallest necessary engineering segment to Work. Do not hand Work an entire workflow when only one step requires its environment.
- Typical Chat-owned work includes: requirements/specification, GitHub inspection, root-cause narrowing, documentation/hard-rule updates, compact Work prompts, asset inventory and package planning, image/static inspection, small bounded repository edits when independently verifiable, PR/merge/main integration, GitHub Pages deployment checks, and interpreting Work/test results.
- Work is appropriate when the task materially requires capabilities Chat cannot reliably reproduce, such as a full checked-out repository with iterative multi-file implementation, executable TDD/debug loops, `npm test` / `npm run check` / syntax or diff verification after substantial code changes, browser/runtime/devtools smoke, or long-running asset transformation/integration that must be verified in the development environment.
- If a task mixes Chat-owned and Work-only steps, Chat should complete its portion first, then send Work only the unresolved engineering delta with existing repo rules referenced instead of repeated.
- After Work completes the Work-only segment, Chat should resume ownership of any remaining steps it can perform, including result review, safe PR/merge, deployment verification, and preparing the player's phone smoke checklist.
- Player phone/device smoke is player-owned when explicitly delegated and should not consume Work token unless Work itself was specifically asked to perform runtime/browser verification.
- Do not send Work back to repeat analysis, documentation, merge/deploy, or other tasks already completed or safely executable by Chat.

### Asset / level ZIP handoff rule

Any future level-development ZIP, integration TXT, or Work handoff prepared in Chat must follow this delegation policy:

1. **Before building the ZIP, Chat completes every safe, order-independent Chat-owned step first.**
2. The ZIP and its TXT contain only the smallest unresolved implementation/verification delta that genuinely requires Work.
3. Keep Chat-owned planning, asset inventory, geometry/spec preparation, root-cause findings, and known decisions out of Work's active scope once already completed; include them only as concise reference evidence when Work needs them to implement correctly.
4. Tell Work to read `AGENTS.md` and relevant repo Guides instead of duplicating permanent rules in the TXT.
5. After Work finishes its required engineering segment, use the default delivery flow in Section 8 unless the user explicitly requested a checkpoint-only handoff.

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
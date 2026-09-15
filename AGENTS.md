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

## 3. If final verification is incomplete

If implementation is complete but browser smoke or another final check is still pending:

- push the feature branch anyway as a safety checkpoint;
- report the status as incomplete / FAIL, not PASS;
- do not merge/deploy to `main` until the required verification is fresh and complete.

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

Only report PASS after the task's required fresh tests/checks/smoke have actually run successfully. Keep feature-branch safety pushes separate from final merge/deployment decisions.

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

# Level9 — Current State / Handoff

> New/returning sessions must first follow `AGENTS.md`, `docs/DEVELOPMENT_PLAYBOOK.md`, the CURRENT HANDOFF POINTER in `docs/WORK_PROGRESS.md`, then this file.

## Active level
- Level: **9**
- Development phase: **RELEASE COMPLETE / FROZEN**
- Production implementation: **RELEASED / PLAYER VERIFIED**
- Active canonical folder: `docs/levels/level9/`

## Current gate
**GATE J CLOSED — PLAYER ACCEPTANCE COMPLETE / LEVEL9 FROZEN**

### Allowed now
- preserve Level9 as released/frozen;
- open Level9 again only for a concrete regression or defect;
- initialize Level10 from the repository template when the player requests the next level.

### Forbidden until gate exit
- no asset redesign/regeneration without a concrete deployed defect;
- no movement of frozen Spawn/Base/T1–T8/shrine/path anchors;
- no Level1–8 rebalance;
- no claim of player phone acceptance before the player confirms it.

### Gate exit evidence
PR #90 merged at `e473c7111555e5c98364bcb1fe8c0af3dee69847`; Pages exposes Level9 in `?devMenu=1`, and the deployed 390×700 smoke fixture confirms the real Level8 victory button enters Level9 lineup.

## Confirmed / approved
- Gate A progression/scope is frozen from inherited campaign rules.
- Level9 is reached from Level8 victory once Level9 is implemented.
- Entering Level9 opens the persistent roster-selection flow before combat.
- Owned roster entering Level9 contains six deployable beasts: **畢方／夫諸／應龍／白澤／句芒／玄龜**.
- Player selects exactly **3** beasts.
- Retry returns to an empty lineup and requires choosing 3 again.
- Level9 victory must not expose a dead Level10 action while Level10 is not implemented.
- the currently released product baseline remains frozen; as of this Level9 handoff that baseline is Level1–8, but future sessions must resolve the released baseline dynamically rather than treating `Level1–8` as a permanent rule.
- Level8 retrospective guardrails apply to Level9 geometry, Boss timeline, HUD footprint, Motion Lite/readability, and visual-integration preflight.

## Current proposals — not yet frozen
- none for final fileset; all six player re-uploaded source files have been reconciled.

## Completed
- zero-context takeover from latest `main`;
- read CURRENT HANDOFF POINTER;
- read Level8 retrospective and permanent development rules;
- initialized `docs/levels/level9/` from repository template;
- Gate A progression/scope contract completed and frozen;
- Gate B core design approved and frozen: 鐘山極夜 / 天狗・猙 / 燭龍 / 晝夜輪轉 / 帝江 / state-reading difficulty;
- Gate C numerical/gameplay contract approved and frozen, including 玄龜 first-playable verification and exact W1–W10/Boss timeline;
- Gate D map concept approved;
- Gameplay Geometry Guide V1 defined and static-check PASS;
- player corrected the route against the background;
- final registered path / Spawn / Base / T1–T8 / celestial anchor measured into 390×610 logical coordinates and player-approved;
- clean 1024×1536 background registration PASS; runtime 780×1220 JPG candidate recorded; Gate D closed.
- player re-uploaded all six exact accepted Level9 source files;
- exact uploaded-byte audit PASS;
- exact re-uploaded background re-registration PASS against the canonical 390×610 path / Spawn / Base / T1–T8 / shrine anchor;
- Chat-side conversion/optimization complete: five runtime RGBA PNG assets + one 780×1220 JPG background;
- minimal Work handoff ZIP built with `source/`, `runtime_candidates/`, `reference/`, `ASSET_MANIFEST.json`, `SHA256SUMS.txt`, `WORK_INTEGRATION_PROMPT.txt`;
- `source/` filenames are canonical semantic aliases while preserving the exact re-uploaded bytes; `runtime_candidates/` is the only program-integration source.
- handoff ZIP SHA-256 `efeb32e0b30486d456d7619e0d75779bb356988eb1b20a9311dbbb3a8337ff51`.

## Not completed
- none for Level9 release closure.

### Player acceptance closed 2026-09-26
- Player confirmed **Level9 complete** on the deployed build.
- This closes the remaining physical-phone/player acceptance requirement after the HUD, day/night luminance, asset-loading and attack-identity corrections.
- Level9 is now the released/frozen baseline and must not be reopened absent a concrete defect/regression.

## Current branch / SHA
- merged implementation PR: #90.
- final production corrections through PR #99 are in `main`.
- final player-accepted release baseline before this closure doc: `f9d31cd0ef4c06b770f7d2add2f7f0de71823396`.

## Verification status
- Chat-side Final Fileset Audit: **PASS**.
- exact user-uploaded source bytes recorded in `ASSETS.md`.
- runtime candidates decode PASS; monster/Boss/unlock/HUD candidates are RGBA with real transparency; background is optimized JPG.
- deterministic registration check against the exact re-uploaded background: **PASS**.
- Level9 target suite: **110/110 PASS** after review fixes.
- full `npm test`: **265/265 PASS** after review fixes.
- `npm run check`, all `src/` + `tests/` JavaScript syntax, `git diff --check`, asset decode/checksum and stale-cache scan: **PASS**.
- independent pre-merge review found no Critical issue; its four Important findings were addressed by W10 observed-timeline coverage/escort staging, Level9 runtime path smoothing acceptance, deterministic Level9 玄龜潮震 + Level8→9 smoke fixtures, cache identity, and this canonical state closure.
- W10 impact analysis: the shared nearest-enemy spawn gate originally held the first escort behind slow 燭龍 until 4.4s. Level9 W10 now exempts only the Boss-to-first-escort boundary and ignores 燭龍 for the already-started escort stream; escort-to-escort spacing remains size-aware. Executable evidence verifies Boss first, first 天狗 at 0.8–1.0s, first 猙 within 7.6–10.1s, and the intended day/night overlap.
- local cloud browser could not open `127.0.0.1:4173` (`net::ERR_BLOCKED_BY_CLIENT`), so runtime smoke was completed against public Pages instead.
- public dev entry PASS: `?devMenu=1` visibly exposes Level1–Level9.
- public production progression PASS at 390×700: deployed fixture used the actual Level8 victory next-level button and reached `level 9 鐘山極夜 / state lineup / wave 0`; the six-beast roster and NEW 玄龜 are visible.

## Do not redo
- all currently released content; resolve the released baseline dynamically from repository/release state rather than hard-coding a historical range;
- Level8 retrospective analysis;
- inherited roster/progression architecture;
- permanent project rules in `AGENTS.md`.

## Next exact step
**Level9 is complete and frozen. When the player requests continued campaign development, initialize Level10 from `docs/levels/_TEMPLATE/`, recover all permanent rules from GitHub, and begin Gate A without reopening Level9.**

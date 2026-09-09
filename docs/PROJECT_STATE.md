# Shanhaijing TD Project State

## Current Release

- Version: Prototype V0.02 + Level 2 First Pass
- Scope: First and second levels implemented; no Level 3
- Status: `第一關完成；第2關・赤水荒原已完成工程整合，待玩家實機驗證`
- Gameplay baseline commit: `b03f9102097d7419734bee76b6341660b0bd7a8b`
- First-level completion baseline commit: `7714ff815efcaeb9ae4947236db8aa026d652d10`
- Platform: Mobile Web, optimized for 320–430px portrait screens
- Deployment: GitHub Pages from `Hansen0318/shanhaijing-td`

## First-Level Identity

- Level: `第1關・崑崙山門`
- Defended Base / map endpoint: `山海關`
- Boss: `窮奇`
- Level length: 10 Waves
- `山海關` is the defended Base name, not the second-level name.
- The Wave preview/status area displays the level identity together with the current/next Wave.

## Second-Level Identity

- Level: `第2關・赤水荒原`
- Defended Base / map endpoint: `赤水古寨`
- Boss: `狍鴞`
- Level length: 10 Waves
- Level 1 Victory offers `前往第2關` and `再次挑戰`; progression is never automatic.
- Entering Level 2 resets Base HP, Gold, Towers, Blessings, Wave, effects, selection, and run statistics.

## Campaign Progression Direction

This is the intended campaign contract for future Work/Codex tasks unless a later design explicitly replaces it:

1. Each level has its own level id, level name, map/background, Wave configuration, enemy mix, and Boss identity.
2. A level contains its internal Waves; completing Wave 10/Boss completes that level, not the entire campaign.
3. Do not auto-jump directly into the next level at the instant of victory. The result screen is shown first.
4. Once Level 2 exists, a successful result screen should offer `前往第2關` plus `再次挑戰`.
5. Level 2 Victory does not expose a dead Level 3 action.
6. Future campaign UI may provide a level-select screen where cleared levels can be replayed and the next level becomes unlocked.
7. Planned naming direction (not yet implemented gameplay):
   - 第1關・崑崙山門 — implemented; Boss 窮奇
   - 第2關・赤水荒原 — implemented first pass; Boss 狍鴞
   - 第3關・扶桑神域 — provisional
   - 第4關・北冥玄境 — provisional
   - 第5關・不周山 — provisional

Levels 1 and 2 are implemented. The later names are design direction, not completed content.

## Implemented Second-Level Systems

- Separate Chishui map/background, waypoint path, Spawn, `赤水古寨`, and eight fixed build slots
- Ten data-driven Waves with existing enemies plus `赤羽妖` and armored `岩甲妖`
- `岩甲妖` takes 65% normal attack damage with a minimum of 1; damage-over-time remains unaffected
- Wave 10 `狍鴞` has 5400 HP and one 8% Max HP consume heal at each 70% and 40% threshold
- Consume banner and supplied projectile, explosion, enrage, and ground-slam feedback are visual only
- Dynamic level identity, Wave preview, Base label, Boss name/skin, and Level 2 result behavior
- Level-specific art preload prevents Level 1 art or emoji from flashing during transition

## Implemented First-Level Systems

- Fixed S-shaped waypoint map with eight fixed tower slots
- Bifang AOE, Fuzhu Slow, and Yinglong penetration towers with three levels
- Build, upgrade, double-confirm sell, Gold economy, Pause, and shared 1×/2× time scale
- Ten fixed Waves, weighted repeatable Blessing choices with a two-stack cap, and unlimited player-confirmed preparation
- Next/current-Wave enemy status with remaining counts during combat
- Bifang explosion radius feedback, Fuzhu Slow marker, Yinglong ordered penetration beam, and actual Gold reward float text
- Late-wave HP scaling for Waves 6–10 and a reduced Wave 10 Qiongqi target of about 4000 HP
- Wave 10 Qiongqi warning, arrival, fixed Boss HP HUD, one-shot 50% frenzy, Boss-defeat-gated Victory, Defeat, and Restart
- Fixed-height Boss/preview slot and Context Panel so gameplay canvas size does not change with UI state
- First formal-art set for map, towers, enemies, Boss states, combat effects, and UI skins
- Formal-art preload gate prevents temporary graybox/emoji fallback from flashing before art settles

## Architecture

- `src/config/gameData.js`: data-driven level identities, maps, waves, enemies, towers, blessings, and shared constants
- `src/config/artAssets.js`: shared/level-specific formal-art catalog and preload readiness
- `src/core/`: run state, game loop coordination, and shared game time
- `src/map/`: waypoint path and tower-slot hit testing
- `src/entities/`: tower, enemy, and projectile state
- `src/systems/`: wave, combat, status, blessing, economy, and Boss threshold rules
- `src/render/Renderer.js`: Canvas battlefield drawing and transient feedback
- `src/ui/UIController.js`: HUD, level/Wave status, preview, fixed context panel, overlays, and input binding
- `tests/`: unit/system acceptance coverage plus responsive and state-injection browser fixtures

## Verification Strategy

- Automated tests cover Wave Preview data, reward calculation, AOE, Slow, penetration, Blessing stack limits, Boss frenzy, Boss-defeat-gated Victory, campaign acceptance, and formal-art integration contracts.
- `tests/browser-smoke.html` injects Wave 1, Wave 8, Wave 10, and Boss states without shipping debug controls in the production game UI.
- First-level gameplay closeout verification previously covered `npm test`, JS/MJS syntax checks, recent balance/logic changes, a 390px mobile viewport, and a short 390×700px viewport.
- Formal GitHub Pages playtesting confirmed the first-level flow and first-round balance were acceptable before the gameplay baseline was recorded.
- During art/UI iteration, targeted regression checks plus user mobile playtesting are preferred to repeated full Wave 1–10 runs; perform a final focused engineering closeout once the visual direction is locked.
- Final first-level closeout verified all JS/MJS syntax, focused Victory/Boss/Blessing tests, the formal-art preload gate, and a 390px GitHub Pages Wave preview without running the full Wave 1–10 acceptance route.
- Level 2 verification uses focused system tests and browser state injection for Level 2 entry, mixed Wave 8, Wave 10, both consume thresholds, and Victory; it does not replay Waves 1–10 manually.

## Remaining First-Level Issues / Closeout

- Broader external player balance testing has not yet been done beyond the current first-round validation.
- Dense combat can visually overlap floating rewards and enemy markers.
- Accessibility is basic: the Canvas battle state has labels but no complete screen-reader representation.
- No persistence, audio, analytics, or long-session performance profiling is included yet.
- The first-level closeout is complete; the remaining items above are prototype limitations rather than blockers for the current baseline.

## Scope Boundary

The gameplay-balance baseline remains `b03f9102097d7419734bee76b6341660b0bd7a8b`. The completed first-level baseline, including formal art and level identity, is locked at `7714ff815efcaeb9ae4947236db8aa026d652d10`. Level 1 remains regression-protected. Level 2 is an initial engineering/balance pass and still requires player iPhone validation before its baseline is locked.

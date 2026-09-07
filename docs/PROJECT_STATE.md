# Shanhaijing TD Project State

## Current Release

- Version: Graybox Prototype V0.02
- Scope: First level only
- Status: First level functionality and first-round balance verification complete
- Baseline commit: `b03f9102097d7419734bee76b6341660b0bd7a8b`
- Platform: Mobile Web, optimized for 320–430px portrait screens
- Deployment: GitHub Pages from `Hansen0318/shanhaijing-td`

## Implemented First-Level Systems

- Fixed S-shaped waypoint map with eight fixed tower slots
- Bifang AOE, Fuzhu Slow, and Yinglong penetration towers with three levels
- Build, upgrade, double-confirm sell, Gold economy, Pause, and shared 1×/2× time scale
- Ten fixed Waves, weighted repeatable Blessing choices with a two-stack cap, and unlimited player-confirmed preparation
- Data-driven next-wave preview during preparation
- Bifang explosion radius feedback, Fuzhu Slow marker, Yinglong ordered penetration beam, and actual Gold reward float text
- Late-wave HP scaling for Waves 6–10 and a reduced Wave 10 Qiongqi target of about 4000 HP
- Wave 10 Qiongqi warning, arrival, fixed Boss HP HUD, one-shot 50% frenzy, Boss-defeat-gated Victory, Defeat, and Restart
- Fixed-height Boss/preview slot and Context Panel so gameplay canvas size does not change with UI state

## Architecture

- `src/config/gameData.js`: tower, enemy, blessing, wave, map, and shared game constants
- `src/core/`: run state, game loop coordination, and shared game time
- `src/map/`: waypoint path and tower-slot hit testing
- `src/entities/`: tower, enemy, and projectile state
- `src/systems/`: wave, combat, status, blessing, and economy rules
- `src/render/Renderer.js`: Canvas-only battlefield drawing and transient feedback
- `src/ui/UIController.js`: HUD, preview, fixed context panel, overlays, and input binding
- `tests/`: unit/system acceptance coverage plus responsive and state-injection browser fixtures

## V0.02 Verification Strategy

- Automated tests cover Wave Preview data, reward calculation, AOE, Slow, penetration, Blessing stack limits, Boss frenzy, Boss-defeat-gated Victory, and campaign acceptance.
- `tests/browser-smoke.html` injects Wave 1, Wave 8, Wave 10, and Boss states without shipping debug controls in the production game UI.
- First-level closeout verification covered `npm test`, JS/MJS syntax checks, recent balance/logic changes, a 390px mobile viewport, and a short 390×700px viewport.
- Formal GitHub Pages playtesting confirmed the latest first-level flow and first-round balance were acceptable before this baseline was recorded.

## Remaining First-Level Prototype Issues

- Broader external player balance testing has not yet been done beyond the current first-round validation.
- Emoji appearance varies by operating system and remains temporary graybox presentation.
- Dense combat can visually overlap floating rewards and enemy markers.
- Accessibility is basic: the Canvas battle state has labels but no complete screen-reader representation.
- No persistence, audio, formal art, analytics, or long-session performance profiling is included in V0.02.

## Scope Boundary

The first-level gameplay baseline is now locked at `b03f9102097d7419734bee76b6341660b0bd7a8b`. Future first-level work should focus on presentation, formal art, audio, accessibility, or clearly reproduced regressions rather than reopening validated balance without new playtest evidence. Second-level work can proceed once the shared visual and UI direction is defined from this baseline.

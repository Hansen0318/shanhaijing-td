# Shanhaijing TD Project State

## Current Release

- Version: Graybox Prototype V0.02
- Scope: First level only
- Platform: Mobile Web, optimized for 320–430px portrait screens
- Deployment: GitHub Pages from `Hansen0318/shanhaijing-td`

## Implemented First-Level Systems

- Fixed S-shaped waypoint map with eight fixed tower slots
- Bifang AOE, Fuzhu Slow, and Yinglong penetration towers with three levels
- Build, upgrade, double-confirm sell, Gold economy, Pause, and shared 1×/2× time scale
- Ten fixed Waves, weighted repeatable Blessing choices, and unlimited player-confirmed preparation
- Data-driven next-wave preview during preparation
- Bifang explosion radius feedback, Fuzhu Slow marker, Yinglong ordered penetration beam, and actual Gold reward float text
- Wave 10 Qiongqi warning, arrival, fixed Boss HP HUD, one-shot 50% frenzy, Victory, Defeat, and Restart
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

- Automated tests cover Wave Preview data, reward calculation, AOE, Slow, penetration, Boss frenzy, and campaign acceptance.
- `tests/browser-smoke.html` injects Wave 1, Wave 8, Wave 10, and Boss 50% states without shipping debug controls in the production game UI.
- Mobile browser checks compare exact Canvas bounding boxes before and after selection, management, and Boss state changes.

## Remaining First-Level Prototype Issues

- Balance still needs broader testing by real players; automated acceptance only proves the campaign can be won and lost.
- Emoji appearance varies by operating system and remains temporary graybox presentation.
- Dense combat can visually overlap floating rewards and enemy markers.
- Accessibility is basic: the Canvas battle state has labels but no complete screen-reader representation.
- No persistence, audio, formal art, analytics, or long-session performance profiling is included in V0.02.

## Scope Boundary

Do not start a second level until first-level playtesting confirms tower roles, economy pacing, Wave readability, Blessing value, and Qiongqi difficulty.

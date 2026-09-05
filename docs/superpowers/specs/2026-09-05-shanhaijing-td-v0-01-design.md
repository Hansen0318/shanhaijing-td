# Shanhaijing TD — Graybox Prototype V0.01 Design

## Purpose

Build a mobile-first, portrait web prototype that answers one question: is the core Shanhaijing roguelike tower-defense loop fun? The prototype prioritizes reliable play, touch usability, easy tuning, and clear system boundaries. It deliberately excludes production art, audio, persistence, accounts, monetization, additional maps, and all V0.02 work.

## Delivery target

- Static frontend deployable to GitHub Pages.
- Primary viewport: 320–430 CSS px wide, tested at representative iPhone sizes.
- No backend and no runtime network dependency.
- Plain HTML, CSS, and JavaScript ES modules.
- HTML5 Canvas for the battlefield; semantic HTML/CSS overlays for controls and modal panels.

## Runtime architecture

`Game` owns the requestAnimationFrame loop and coordinates systems. Simulation uses delta time multiplied by one shared time scale. UI animations remain on real time. Simulation stops whenever the game state is paused, choosing a blessing, victorious, or defeated.

Game states:

1. `PREPARATION`: 15-second Wave 1 countdown; building is allowed.
2. `COUNTDOWN`: 3-second countdown after each blessing; building is allowed.
3. `COMBAT`: spawning, movement, targeting, projectiles, damage, and status effects run.
4. `BLESSING`: simulation fully paused until one of three choices is selected.
5. `PAUSED`: pause menu; resume returns to the previous playable state.
6. `VICTORY` / `DEFEAT`: terminal state until restart.

The game loop updates systems in a deterministic order: wave spawning, enemy movement/status, tower targeting/cooldowns, projectiles/hits, deaths/rewards, wave completion, boss events, and finally presentation synchronization.

## Proposed files and responsibilities

- `index.html`: application shell, accessible controls, HUD, panels, overlays.
- `styles.css`: responsive portrait layout, 44 px touch targets, safe-area handling, no horizontal overflow.
- `src/main.js`: bootstrapping and DOM wiring.
- `src/config/gameData.js`: global values, tower/enemy/boss/wave/blessing definitions.
- `src/core/Game.js`: lifecycle, state transitions, restart, update/render orchestration.
- `src/core/Time.js`: real delta, scaled delta, 1×/2×, pause behavior.
- `src/map/Map.js`: logical canvas dimensions, path waypoints, eight tower slots, hit testing.
- `src/entities/Enemy.js`: path progress, health, damage receipt, temporary health-bar visibility.
- `src/entities/Tower.js`: level stats, cooldown, target acquisition, upgrade investment.
- `src/entities/Projectile.js`: travel, collision, AOE, slow, and penetration resolution.
- `src/systems/WaveManager.js`: fixed wave queue, spawn intervals, completion detection.
- `src/systems/CombatSystem.js`: targeting, damage modifiers, death processing.
- `src/systems/StatusSystem.js`: slow duration, burn DOT, slowed-target vulnerability.
- `src/systems/BlessingSystem.js`: weighted three-choice draw and stackable effects.
- `src/systems/Economy.js`: affordability, spend, reward multiplier, upgrades, sell value.
- `src/ui/UIController.js`: renders game state and converts taps into Game commands.
- `src/render/Renderer.js`: graybox Canvas drawing, range circle, boss bar support.
- `tests/*.test.js`: unit and integration coverage for gameplay rules.

UI never mutates entities directly. It calls commands such as `buildTower`, `upgradeTower`, `requestSell`, `confirmSell`, `selectBlessing`, `startWaveNow`, `togglePause`, and `setTimeScale`; `Game` validates state and delegates to the correct system.

## Data-driven model

All balance data lives in `gameData.js`. Each tower definition contains build cost, role, base damage, attack interval, range, projectile behavior, and level modifiers. Enemy definitions contain HP, path speed, base damage, reward, radius, and display token. Waves contain ordered spawn groups and an explicit interval. Blessings contain id, category, label, description, base weight, and effect descriptors.

Tower level calculations are derived from configuration:

- Level 2 cost: build cost × 0.8; damage multiplier 1.3.
- Level 3 cost: build cost × 1.2; damage multiplier 1.3 again, for a cumulative 1.69 multiplier.
- Level 3 specialty: Bifang explosion radius increases; Fuzhu slow increases; Yinglong penetration increases by one.
- Sell value: floor of total invested gold × 0.6.

This interpretation makes “Damage 再 +30%” multiplicative from the current level and keeps the rule explicit for later tuning.

## Map and interaction design

The Canvas uses a fixed logical coordinate system and scales to the available CSS width. Pointer coordinates are translated back to logical coordinates, preserving consistent gameplay across phones. The map contains one curved/S path, labeled entrance and base, and eight fixed tower slots positioned at straights and bends. Each slot has a larger invisible tap radius than its visible marker.

Tap priority is tower/slot hit testing first, then battlefield deselection. Tapping an empty slot opens the bottom build panel. Tapping an occupied slot opens its details and range circle. Tapping elsewhere closes the selection and cancels pending sell confirmation. Build taps execute immediately after affordability and state validation. Sell requires two taps on the same sell action; any other battlefield or panel selection cancels it.

The battlefield takes the flexible central area. HUD stays above it and the context panel is reserved below it, so controls do not cover the active map. iOS safe-area insets are respected. Touch actions do not require hover, drag, keyboard, right click, or wheel input.

## Combat behavior

- Bifang selects one enemy in range and launches a projectile. On impact, every living enemy within the configured explosion radius takes the resolved damage. Burn blessings add stack-refreshing DOT behavior as defined in config.
- Fuzhu launches a projectile that deals damage and applies a 25% slow for two scaled seconds. Its Level 3 specialty and blessing stacks modify the slow percentage, subject to a configurable safety cap.
- Yinglong fires along the line from tower to target and damages up to its penetration count in ordered intersection/path-progress order. Boss bonus is applied only to Qiongqi.
- Attack-speed bonuses reduce attack interval by dividing the base interval by the cumulative speed multiplier.
- All-tower, tower-specific, slowed-target, boss, and other modifiers are resolved in one damage pipeline.

Enemies move along waypoint segments without teleporting across corners. Reaching the final waypoint damages the base and removes that enemy. Ordinary enemy health bars appear briefly after taking damage; Qiongqi uses a persistent boss bar.

## Waves and boss

The ten fixed waves follow the supplied composition. Spawn groups are expanded into a deterministic queue so enemies appear sequentially at configured 0.7–1.2 second intervals. A wave ends only after the queue is exhausted and all spawned enemies have either died or reached the base.

After Waves 1–9, the state changes to `BLESSING`. After a selection, a 3-second build/countdown phase begins. Waves never overlap. Before Wave 10, a 1–1.5 second “BOSS / 窮奇” announcement appears without accelerating with game speed.

Qiongqi has 2500 HP, 20 base damage, and slow initial speed. Crossing from above 50% HP to 50% or below triggers frenzy once, shows “窮奇進入狂暴！”, and multiplies movement speed by 1.5 until death. Reaching the base applies 20 damage, which defeats the initial 20-HP base. Killing Qiongqi immediately produces victory after all death/reward bookkeeping completes.

## Blessing selection

The system draws three distinct blessing ids per selection using weighted sampling without replacement. Generic blessings keep their base weight. A tower-specific blessing gains a configurable weight multiplier when at least one matching tower is deployed. Undeployed tower blessings remain eligible. Selected blessings are stored as stack counts and their effects are computed from descriptors rather than scattered conditional branches.

## Economy and statistics

The run starts at 20 base HP and 300 gold. Gold is spent only after command validation and awarded exactly once per enemy death. The Fortune blessing multiplies future rewards. The run tracks enemies defeated and successful tower builds; upgrades and rebuilds do not inflate the build count except that each newly built tower counts once. Results show the statistics required for victory or defeat.

## Error handling and stability

Invalid commands—wrong state, occupied slot, insufficient gold, maximum level, or missing selection—return a failure result and do not mutate state. Entity collections are updated safely so removals cannot skip later entities. Delta time is capped after tab suspension to avoid a single giant simulation step. Canvas is resized for device pixel ratio while retaining logical coordinates.

## Verification strategy

Development follows red-green-refactor for testable rules. Unit tests cover configuration, economy, upgrades, selling, time scale, status durations, AOE, penetration, blessing modifiers/weights, boss frenzy, path completion, and state transitions. Integration tests run the fixed wave queue through controlled simulation steps, including victory, defeat, restart, pause, and speed changes.

The final gate includes:

- complete automated test suite;
- static module/import validation and a production/static serving check;
- scripted smoke checks for all 24 acceptance items where automation is practical;
- responsive checks at 320, 375, 390, and 430 CSS px widths;
- browser-based touch-flow verification on a WebKit-compatible engine when available.

Any item not directly verified will be reported explicitly instead of being presented as working.

## Scope boundary

V0.01 remains graybox. Emoji, flat shapes, short banners, and simple projectiles are sufficient. There will be no formal character/environment art, audio, particles beyond minimal hit feedback, menu, stage selection, collection, achievements, account, leaderboard, backend, multiplayer, permanent save/progression, second map, free placement, tower damage/death, complex boss AI, ads, purchases, or revival.

# First Level V0.02 Design

## Goal

Improve the first level's tactical readability and combat feedback without changing its map, tower positions, enemy roster, progression, or core balance.

## Design

- Reuse the fixed 44px boss slot for a preparation-only next-wave preview. Wave composition comes from `WAVE_DATA.groups`; labels and emoji come from `ENEMY_DATA`. The boss HUD replaces the preview in the same reserved space when Qiongqi is alive.
- Keep transient battlefield feedback in the existing `Game.effects` collection. Bifang impacts create an explosion ring using the actual attack radius, slowed enemies receive a persistent renderer-only marker, Yinglong beams connect the tower and ordered hit targets, and kills create an upward-moving gold label using the actual credited reward.
- Extend the existing banner state with a minimal queue. Wave 10 queues a boss warning, the Qiongqi spawn queues an arrival message, and the existing one-shot frenzy transition queues the frenzy message. Spawn timing and boss mechanics remain unchanged.
- Add a test-only same-origin smoke page that controls an iframe of the production game. It injects Wave 1, Wave 8, Wave 10, and frenzy states without adding debug controls to the production UI.

## Layout Invariant

The HUD, 44px boss/preview slot, flexible battlefield, and fixed context panel retain their current flex sizes. Preview, tower selection, build controls, tower actions, and boss health only replace content inside already-reserved regions.

## Verification

- Node unit/system tests for preview data, actual rewards, combat effect creation, banner order, and one-shot frenzy.
- Browser smoke tests at 320, 375, 390, and 430 CSS pixels.
- Exact canvas bounding-box comparison across no selection, empty slot, occupied slot, upgrade/sell, pre-boss, and boss-visible states.
- Wave 1, Wave 8, and Wave 10 browser checks via test-only state injection; no redundant full manual Wave 1–10 run.

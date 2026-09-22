# Level8 — Design / Proposal Record

> Proposals, alternatives, rationale and player-approval-pending content live here. Do not implement from this file unless the accepted decision has been promoted to `SPEC.md`.

## Current proposals

### Direction A — 幽冥沼澤 / 毒霧濕地
- Strong contrast with Level6 sunlight and Level7 thunder.
- Candidate environment mechanic: localized swamp/mist interaction rather than another bright pulsing zone.
- Candidate Motion Lite:
  - water ripples;
  - swamp bubbles;
  - slow drifting ground fog;
  - subtle bioluminescent plant breathing;
  - optional small water-flow motion where the final background visibly contains water.
- Visual goal: active/living background without turning the map into a VFX layer.

### Direction B — 風蝕荒原 / 砂海古城
- Candidate environment mechanic: periodic gust lanes or wind exposure.
- Candidate Motion Lite:
  - sand drift;
  - hanging cloth/flag motion where present;
  - dry grass/branches sway;
  - distant sandfall.
- Keeps palette and environment distinct from Levels6–7.

## Environment Motion Lite design rule
- Target **2–4** subtle environment motions per level.
- Motion must correspond to an element visibly present in the approved background.
- Width/shape/position must be measured from the actual approved background, not guessed from a generic template.
- Environment motion is visual-only unless `SPEC.md` explicitly defines a gameplay effect.
- Avoid repeated reliance on full-screen glow, lightning, fire or generic pulsing zones.
- Phone readability wins over quantity.

## Map-production lesson carried forward from Level7
Before final background approval and geometry freeze, establish:
1. background source aspect ratio and intended runtime battlefield/display contract;
2. path composition and major gameplay zones;
3. which visible background elements are candidates for procedural Motion Lite.

This avoids retrofitting aspect ratio or guessing effect positions after integration.

## Alternatives / rationale
- 火山熔谷 and 冰原神域 remain possible future themes, but are lower priority for Level8 because Level6/7 already use strong luminous environmental VFX.

## Rejected / superseded ideas
- None yet.

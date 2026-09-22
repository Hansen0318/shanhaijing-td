# Level8 — Design / Proposal Record

> Proposals, alternatives, rationale and player-approval-pending content live here. Do not implement from this file unless the accepted decision has been promoted to `SPEC.md`.

## Current proposals

### Approved theme — 幽冥沼澤 / 毒霧濕地
- Strong contrast with Level6 sunlight and Level7 thunder.
- Candidate environment mechanic: localized swamp/mist interaction rather than another bright pulsing zone.
- Candidate Motion Lite:
  - water ripples;
  - swamp bubbles;
  - slow drifting ground fog;
  - subtle bioluminescent plant breathing;
  - optional small water-flow motion where the final background visibly contains water.
- Visual goal: active/living background without turning the map into a VFX layer.

### Gameplay set proposal — not yet frozen
- **Normal enemy A: 長右** — agile marsh raider; flood-associated identity fits the wetland theme. Proposed role: faster pressure unit with short wetland-triggered movement burst, avoiding another permanent speed aura.
- **Normal enemy B: 蠱雕** — heavier predatory water-edge beast. Proposed role: durable enemy that benefits from swamp cover/mitigation rather than simple raw HP inflation.
- **Boss: 化蛇** — flood-linked winged serpent/beast as the visual centerpiece. Proposed role: two-phase Boss that actively changes swamp-state timing rather than copying 雷脈 or sunlight-zone cadence.
- **Level8-clear unlock: 玄龜** — proposed sixth deployable. Role should emphasize controlled splash/area utility and avoid duplicating 夫諸 slow, 白澤 debuff, or 句芒 global attack-speed support.

### Environment mechanic proposal — not yet frozen
- Use **沼氣 / 水脈** as localized terrain states rather than another bright rectangular/pulsing buff zone.
- Candidate behavior: selected wetland pockets briefly become active; qualifying enemies gain a species-specific benefit while inside/after crossing.
- Visual telegraph should be low-luminance fog/ripple/bubble activity, clearly distinct from Level6 sunlight and Level7 lightning.
- Exact timing, affected enemy species, and numerical effects remain for the next gameplay step.

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
- 風蝕荒原 / 砂海古城 deferred for a future level after the player continued with the recommended 幽冥沼澤 direction.

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

### Approved gameplay set
- **長右** — agile pressure enemy; wetland-triggered **泥躍** movement burst.
- **蠱雕** — durable marsh predator; active-wetland **沼甲** mitigation with short post-exit carry-over.
- **化蛇** — two-phase Boss that forces/accelerates high-tide windows and controls the environment instead of consuming the normal-enemy wetland buffs.
- **玄龜** — Level8-clear unlock; sixth deployable, using delayed **潮震** pulses for area damage + small non-Boss path pushback.

### Approved environment mechanic
- The map contains several visually natural wetland pockets.
- A shared **潮位** cycle moves the whole map between quiet and high-tide states; high tide activates the approved wetland pockets together.
- This deliberately avoids Level7's alternating A/B rhythm.
- 長右 and 蠱雕 receive different species-specific benefits from an active wetland.
- 化蛇 can force an early high tide; P2 increases that pressure and may activate all approved wetland pockets during its surge window.
- 化蛇 itself does not receive 長右／蠱雕's normal wetland buffs.
- Visual telegraph stays low-luminance: ripple, mist density, small bubbles, soft water movement. No bright zone rectangle/ellipse.
- Exact cadence/durations/thresholds are numerical-gate work, not frozen here.

### Numerical baseline rationale
- 長右 stays near Level7 fast-enemy speed but gains its pressure through conditional 泥躍 rather than higher permanent speed.
- 蠱雕 is slightly tougher/slower than 諸懷; most of its identity comes from timed 沼甲 instead of a large HP jump.
- 化蛇's effective Wave10 HP (8360) advances beyond 夔 without a heal/reset mechanic.
- Tide is intentionally slower and map-wide, differentiating it from Level7's 7s/5s alternating thunder pulses.
- 玄龜's 潮震 is periodic delayed utility, so it does not become another every-shot 畢方 explosion or 夫諸 slow tower.

### Approved map composition / display contract
- Use the player-approved **broad asymmetric S / meandering wetland route**, deliberately different from Level7's lightning-Z and from a conventional smooth symmetric S.
- Spawn enters from the **upper-left** edge.
- Base sits at the **lower-center sanctuary/islet** after the final inward curve.
- Preserve the player-approved **T1–T8 composition** from Level8 Geometry Guide V1; implementation may measure/interpolate but must not redistribute the tower pads.
- Use **3 natural wetland pockets** distributed along the route; all share the global tide state.
- Logical battlefield remains **390×610**.
- Canonical runtime background target is **780×1220**, exact 39:61 aspect, using the full normalized image rather than a later partial crop.
- Preserve the current full-width mobile battlefield presentation; do not reintroduce the narrow/pillarboxed Level7 experiment.
- Background should visibly contain water/marsh at each future gameplay pocket so wetland bounds and Motion Lite can be measured from real art.
- Planned Motion Lite budget after background approval: slow fog, water ripples, bubble clusters, plus optional bioluminescent plant breathing only if such a cluster is visibly present.

### Approved 玄龜 art / attack presentation
- Canonical 玄龜 source art: deep-green turtle body, gold shell ornaments, cyan water-pattern / water-vapor accents, **no snake**, simplified large color blocks for phone readability.
- Ordinary attack VFX is **procedural-only**: compact cyan/teal water-core projectile with a short soft trail.
- 潮震 VFX is **procedural-only**: local 0.35s contraction telegraph followed by two expanding water-shock rings plus a brief mist/splash accent.
- No static VFX image should be generated unless runtime evidence proves a concrete readability failure that procedural drawing cannot solve.
- Rejected extra 玄龜 and frog-like drafts are not canonical and must not be reused.

### Boss HUD UI contract
- 化蛇 Boss HUD follows the shared project Boss-HUD rule.
- Upper name area uses a dark solid / near-solid panel so the program-rendered yellow Boss name remains legible.
- Lower area remains an empty HP channel; the program is the only HP fill source.
- Name area and health channel are designed inside the **same fixed outer HUD footprint** rather than stacking an extra UI row above the existing HUD.
- Therefore, the intended implementation must **not reduce battlefield/map height**. If integration would require a taller HUD container, treat it as a layout change and return for player approval.

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

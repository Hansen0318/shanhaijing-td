# Level9 — Design / Proposal Record

> Proposals, alternatives, rationale and player-approval-pending content live here. Do not implement from this file unless the accepted decision has been promoted to `SPEC.md`.

## Current gate
**Gate B — Core Design**

## Proposal A — 鐘山極夜 / 燭龍

Status: **PLAYER_APPROVED / PROMOTED TO SPEC**

### Level identity
- Working level name: **第9關・鐘山極夜**
- Visual/theme direction: high-altitude black-red mountain shrine / perpetual dusk-night, with one dominant celestial-light source.
- The level should read clearly as a new biome after Level8's marsh without reusing swamp/tide language.

### Normal enemies
- **天狗** — fast pressure enemy; visually lean / forward-moving, intended to create lane pressure without relying on raw HP.
- **猙** — sturdier frontline enemy; visually heavier and easier to distinguish from 天狗 at 390px width.

These are role-level concepts only. No HP/speed/armor numbers are approved in Gate B.

### Boss
- **燭龍**
- Boss fantasy: the battlefield's light-state controller rather than a simple high-HP target.
- Boss visual identity should remain readable inside the existing fixed Boss-HUD footprint; no taller HUD is allowed.

### Signature mechanic — 晝夜輪轉
- The battlefield alternates between two highly legible states:
  - **晝相**: warm/red-gold illumination state.
  - **夜相**: cold/dark-blue illumination state.
- 燭龍 is the authoritative controller of this state during the Boss encounter.
- Normal enemies may later receive species-specific behavior tied to the current state, but the exact effects belong to Gate C.
- The mechanic must remain visually obvious at ~390px width and must not depend on subtle full-screen tint alone; it needs at least one localized, phone-readable battlefield cue.
- W10 must later be frozen as an **ordered encounter timeline**, proving the light-state mechanic is active while its intended enemies/terrain interactions are still present.

### Level9 clear unlock
- Proposed unlock: **帝江** as the seventh deployable beast.
- Proposed role direction: **混沌干擾 / 範圍節奏控制** rather than another pure DPS tower.
- Exact attack pattern, stats, projectile/VFX and Blessings are deferred to later gates.

### Broad difficulty intent
- Level9 should be harder than Level8 through **state-reading and timing**, not through a large HP/stat spike.
- Keep one dominant new mechanic (晝夜輪轉) and make enemy roles visually distinct.
- Do not stack multiple unrelated environmental systems on top of the day/night mechanic.
- The player should be able to understand why the battlefield changed without reading dense text.

## Why this proposal fits the current project
- It gives Level9 a biome and color-language clearly different from Level6–8.
- 燭龍 naturally supports a battlefield-state mechanic that can be communicated visually.
- The design directly incorporates the Level8 retrospective: Boss mechanic timeline, fixed HUD footprint, phone-readable environment state, and early visual-integration planning.
- 帝江 adds a new roster role without duplicating 玄龜's delayed area-control identity.

## Alternatives / rationale
If Proposal A is rejected, Gate B should replace the whole identity coherently rather than mixing Boss/mechanic pieces from unrelated themes.

Potential alternate directions kept only as placeholders:
- **北冥玄境** — cold/deep-water theme, Boss centered on pressure/freeze control.
- **天門風域** — high-wind sky theme, Boss centered on lane displacement / wind-state control.

No alternate is approved and no downstream work should use them.

## Gate B decisions still requiring player approval
- L9-D001: level theme/name.
- L9-D002: normal enemy set.
- L9-D003: Boss identity.
- L9-D004: signature mechanic.
- L9-D005: Level9-clear unlock/new deployable.
- L9-D006: broad difficulty intent.

## Rejected / superseded ideas
- none yet.


## Gate B closure
- Player approved Proposal A on 2026-09-24.
- L9-D001–L9-D006 were promoted to `SPEC.md`.
- Gate B is closed; later changes require explicit change control / impact analysis.




## L9-R100 — 玄龜 first-playable-level carry-over verification
Status: **INHERITED / MUST VERIFY IN LEVEL9**

Level9 is the first level in which 玄龜 is selectable after being unlocked by the first Level8 clear. Do **not** redesign or rebalance 玄龜 here; its Level8-approved production contract is inherited:

- cost **145**
- damage **13**
- attack interval **1.20s**
- range **140**
- projectile speed **360**
- every **4 successful attacks** triggers 潮震
- 潮震 delay **0.35s**
- 潮震 radius **52**
- 潮震 damage **18**
- non-Boss path pushback **18**
- Boss receives pulse damage but is immune to pushback

Inherited procedural VFX:
- base attack = compact cyan/teal water-core projectile with short trail
- 潮震 = local contraction telegraph → two expanding water-shock rings → brief mist/splash accent
- no static VFX image is required unless runtime evidence shows a concrete readability failure

Inherited Blessings:
- 玄波: 潮震 damage +20% / layer
- 闊潮: 潮震 radius +8 / layer
- 回瀾: non-Boss pushback +5 / layer
- max 2 layers each

Level9-specific verification requirement:
- lineup must visibly include 玄龜 as one of the six owned beasts
- first placement must use the approved 玄龜 sprite and facing rules
- base projectile must be visible on a ~390px phone viewport
- the 4-hit → 0.35s → 潮震 sequence must be visually recognizable
- non-Boss pushback must be visible without breaking path spacing/facing
- Boss must take 潮震 damage without being pushed
- Blessing filtering must include only 玄龜 Blessings when 玄龜 is selected, following the existing lineup filter architecture

This is a **carry-over verification**, not a new Level9 balance design.

## Unlock sequencing rule clarified
- A beast unlocked by clearing Level N is **not playable during that same first-clear run**.
- It joins the owned roster starting with the **next playable level**.
- Therefore:
  - Level8 clear → unlock 玄龜 → first playable in **Level9**
  - Level9 clear → unlock 帝江 → first playable in **Level10** (once Level10 exists)
- Future levels should preserve this sequence unless the player explicitly changes progression architecture.

# Gate C — Numerical / Gameplay Proposal

Status: **PLAYER_APPROVED / PROMOTED TO SPEC**

This proposal is calibrated against released Level7/8 baselines rather than using a large raw-stat jump:
- Level7: 欽原 100 HP / 88 speed, 諸懷 390 HP / 25 speed, 夔 7000 HP.
- Level8: 長右 110 HP / 86 speed, 蠱雕 420 HP / 24 speed, 化蛇 7600 HP.
- Level9 therefore increases pressure mostly through 晝夜 state-reading, not HP inflation.

## L9-R101 — 天狗 baseline
- HP: **120**
- Speed: **90**
- Base damage: **1**
- Reward: **16**
- Radius target: **11–12**
- State interaction:
  - **晝相:** movement speed × **1.20**
  - **夜相:** no speed bonus
- Readability goal: during 晝相 the speed change must be visually obvious without making the sprite appear to teleport.

## L9-R102 — 猙 baseline
- HP: **450**
- Speed: **24**
- Base damage: **3**
- Reward: **34**
- Radius target: **18**
- State interaction:
  - **夜相:** incoming normal attack damage × **0.82** (“夜甲”)
  - **晝相:** no armor bonus
- Damage-over-time / special mechanics remain unaffected unless a later implementation contract explicitly says otherwise.

## L9-R103 — 晝夜輪轉
- Normal Level9 combat begins in **晝相**.
- Outside the Boss fight, state alternates every **8 seconds**.
- Transition telegraph: **0.8 seconds** before each state switch.
- Required presentation:
  - 晝相 and 夜相 must each have a localized battlefield cue plus an overall state cue;
  - the state may not rely on subtle full-screen tint alone;
  - transition cue must remain recognizable at ~390px width.
- Only one state is active at a time.
- State effects are limited to the species-specific rules above; no additional global player-tower buff/debuff is proposed.

## L9-R104 — 帝江 deployable baseline
Role: **混沌干擾／短暫定身節奏控制**

Proposed base tower:
- Cost: **150**
- Damage: **12**
- Attack interval: **1.10 s**
- Range: **145**
- Projectile speed: **380**
- Every **5th** successful attack triggers **混沌震** around the target:
  - radius: **46**
  - non-Boss enemies: movement lock **0.35 s**
  - Boss: movement lock **0.12 s**
  - no path pushback
  - no stacking extension from overlapping 帝江 pulses in the same instant

This distinguishes 帝江 from:
- 夫諸 = sustained slow;
- 玄龜 = delayed AOE + path pushback;
- 白澤 = vulnerability support;
- 句芒 = team attack-speed support.

Proposed Blessings, max 2 layers each:
- **亂流** — 混沌震 radius **+7** per layer
- **凝滯** — non-Boss movement lock **+0.07 s** per layer; Boss lock **+0.03 s** per layer
- **回響** — trigger cadence improves by **1 attack** per layer, floor **3 attacks** per 混沌震

## L9-R105 — 燭龍 Boss baseline
- HP: **8200**
- Speed: **15**
- Base damage: **20**
- Reward: **0**
- Boss radius target: **30**
- Phase 2 threshold: **50% HP**
- Boss victory gate remains: W10 cannot complete until 燭龍 is dead and all escort enemies are cleared.

### Phase 1
- 燭龍 owns the battlefield state controller.
- State starts in **晝相** when 燭龍 enters.
- Switch interval: **6.0 s**
- Transition telegraph: **0.8 s**
- 天狗／猙 receive their normal state-specific bonuses.

### Phase 2
- Trigger at 50% HP with a distinct visual transition.
- Boss movement speed × **1.12**.
- State switch interval tightens to **4.5 s**.
- Transition telegraph remains **0.8 s**.
- No extra third environmental system is added.

## L9-R106 — W1–W10 proposal
Exact group order matters and is part of the proposal.

- **W1:** 天狗 ×6 — interval 1.10
- **W2:** 天狗 ×8 — interval 1.00
- **W3:** 天狗 ×6 → 猙 ×2 — interval 1.00
- **W4:** 猙 ×4 — interval 1.05
- **W5:** 天狗 ×10 → 猙 ×3 — interval 0.90, HP multiplier 1.06
- **W6:** 天狗 ×14 → 猙 ×4 — interval 0.78, HP multiplier 1.12
- **W7:** 天狗 ×10 → 猙 ×6 — interval 0.82, HP multiplier 1.18
- **W8:** 天狗 ×16 → 猙 ×6 — interval 0.70, HP multiplier 1.26
- **W9:** 天狗 ×18 → 猙 ×8 — interval 0.64, HP multiplier 1.34
- **W10:** **燭龍 ×1 first → 天狗 ×8 → 猙 ×4** — interval **0.84**, escort HP multiplier **1.20**, Boss HP multiplier **1.10**

W10 therefore targets an effective Boss HP of **9020** before any future implementation-only rounding/representation decisions.

## L9-R107 — W10 Boss encounter timeline preflight
This timeline is mandatory because Level8 proved aggregate wave counts are insufficient.

At nominal 1× game time:
1. **t=0.0:** 燭龍 spawns first; battlefield enters 晝相.
2. **t≈0.8:** first 天狗 escort begins spawning.
3. **t=5.2:** 0.8 s telegraph begins for the first Boss-controlled switch.
4. **t=6.0:** battlefield enters 夜相 while escorts are still active.
5. **t≈7.6–10.1:** later 天狗 / first 猙 escorts are present during or shortly after the 夜相 transition.
6. Subsequent switches continue every 6.0 s in P1.
7. At 50% Boss HP, P2 telegraphs distinctly and the switch cadence becomes 4.5 s.

Acceptance intent:
- the first 晝→夜 switch must occur while a meaningful portion of the escort is still alive/present;
- both 天狗's 晝相 speed bonus and 猙's 夜相 armor must be observable during W10;
- if later executable simulation shows normal combat kills escorts before these overlaps are visible, adjust W10 timing/order before implementation freeze rather than shipping an invisible Boss mechanic.

## L9-R108 — Victory / progression
- W10 victory requires: wave queue exhausted + all normal enemies defeated + 燭龍 defeated.
- First Level9 clear presents **帝江 unlock**.
- Retry clears lineup and returns to empty 6-select-3.
- Until Level10 exists, Level9 victory shows no next-level button.

## Gate C scope boundary
Not part of Gate C:
- production background;
- path / Spawn / Base / T1–T8;
- special visual-anchor coordinates;
- final art/VFX inventory;
- image generation;
- production implementation.


## Gate C closure
- Player approved the Gate C proposal on 2026-09-24 by continuing from the recorded Gate C review step.
- L9-R101–L9-R108 are promoted to `SPEC.md`.
- L9-R100 remains an inherited first-playable verification contract for 玄龜.
- Gate C is closed; later changes require impact analysis.

# Gate D — Map Concept / Production Background Proposal

Status: **PLAYER_APPROVAL_PENDING**

## L9-G001 — battlefield composition proposal
- Working composition: **斷環天壇 / broken-ring switchback**.
- Spawn enters from the **upper-left** edge.
- The route descends diagonally toward a central circular/semicircular celestial shrine, bends around that shrine without forming a symmetric S, then exits through a lower-right mountain gate to the Base.
- The route must remain clearly different from:
  - Level7's lightning-Z composition;
  - Level8's broad asymmetric S / wetland meander.
- Eight tower pads should be distributed on both the inner and outer sides of the broken ring so no single side owns all strong positions.
- The central shrine is the principal visual landmark and the strongest candidate for the localized 晝夜 state cue.
- Avoid narrow bridges, extreme one-pixel-looking lanes, or scenery that would force enemy sprites/tower pads to overlap decorative edges at 390px.

## L9-G002 — background visual direction
- High-altitude **鐘山極夜**.
- Black / charcoal mountain stone with restrained dark crimson architecture.
- One dominant celestial-light source associated with 燭龍.
- Day-state visual language: warm red-gold light concentrated around the central shrine / celestial disc.
- Night-state visual language: cold indigo-blue moon/star light around the same landmark.
- Keep battlefield road value/contrast readable in both states; visual-state changes must not erase path readability.
- Do not bake bright gameplay telegraphs directly into the background. The production background should provide natural anchor surfaces; runtime state cues remain procedural/hybrid later.

## L9-G003 — production background contract before geometry freeze
Gate D may not freeze coordinates until all of the following exist:
1. exact final production background file;
2. source pixel dimensions;
3. exact crop/normalization, if any;
4. runtime target **390×610 logical** and its 2× production equivalent where used;
5. explicit source→logical transform;
6. overlay on that exact production background containing:
   - ordered path centerline;
   - Spawn;
   - Base;
   - T1–T8;
   - central 晝夜 cue anchor / any other gameplay-relevant visual anchor;
7. player approval of the overlay.

No coordinate values in `GEOMETRY.md` may be marked frozen before that overlay is approved.

## L9-G004 — Motion Lite / environment candidates
Candidates only; exact anchors wait for the production background:
- slow high-altitude cloud drift;
- sparse hanging prayer-ribbon / banner sway if visibly present;
- subtle celestial-disc breathing / corona movement;
- tiny drifting ember/star particles, low density.

Target: **2–4** subtle motions, each tied to a visible background element and directly recognizable at 390px when pointed out, while staying subordinate to combat.

## Gate D decision required
Player approval is needed for:
- broken-ring switchback composition;
- upper-left Spawn / lower-right Base;
- central celestial shrine as the main 晝夜 visual anchor;
- black-red mountain shrine art direction;
- Motion Lite candidate family.

After approval, the next action is to create/select the exact production background, then perform registration and overlay measurement before any geometry freeze.


## Gate D workflow correction — player approved 2026-09-25
The first generated background proved that a visually attractive AI map cannot safely define tower-defense geometry after the fact.

Level9 therefore adopts a gameplay-first sequence:
1. define the 390×610 Gameplay Geometry Guide;
2. statically validate path turns, road clearance, slot spacing/coverage and special-anchor clearance;
3. make production background art follow that guide;
4. register the exact production image back to the same guide;
5. reject/regenerate art when mismatch is material;
6. freeze only after registered overlay approval.

Gameplay Geometry Guide V1 is now recorded in `GEOMETRY.md`.
The old generated background/blue overlay is non-canonical and must not drive implementation.

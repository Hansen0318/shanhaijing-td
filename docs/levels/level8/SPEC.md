# Level8 — Approved Specification

> Only player-approved/frozen requirements belong here.

## Entry progression
- Level7 victory proceeds to Level8 through the existing data-driven progression flow.
- Level8 uses the player's currently owned/unlocked deployable roster.
- Exactly 3 deployables must be selected before starting the level.
- Retry returns to an empty lineup using the existing shared behavior.

## Core gameplay
- Theme: **幽冥沼澤 / 毒霧濕地**.
- Normal enemy A: **長右** — agile pressure enemy. **泥躍**: when it enters an active wetland patch, it gains a short movement burst; the same patch cannot repeatedly stack the burst.
- Normal enemy B: **蠱雕** — durable marsh predator. **沼甲**: while inside an active wetland patch it gains temporary damage mitigation, with only a short carry-over after leaving.
- Boss: **化蛇** — two-phase flood/mist controller. It manipulates the wetland state rather than receiving the normal 長右／蠱雕 wetland buffs.
- Level8 environment mechanic: **潮位 / 濕地活化**. Several map wetland pockets are normally quiet; a shared tide cycle temporarily activates them together. This is not an A/B alternation and must not visually copy Level6 sunlight or Level7 thunder zones.
- 化蛇 enters **before its W10 escort**. Once the first 長右／蠱雕 escort actually enters the battlefield, 化蛇 gives a **0.8s tide telegraph**, then forces the opening high tide so its terrain-control identity visibly affects the escort fight. P1 then periodically forces early high-tide activation. P2 begins once at the Boss HP threshold, increases the forced-tide pressure, and may make all approved wetland pockets active during its surge window.
- Environment telegraph uses low-luminance ripple / drifting mist / bubble activity instead of bright rectangular or elliptical fields.
- Environment Motion Lite is a required presentation layer for Level8; its approved fog/ripple/bubble/reed anchors are frozen in `GEOMETRY.md`.

## New deployable unlocked by Level8 clear
- **玄龜** becomes the sixth owned deployable after the first Level8 clear through the existing data-driven unlock flow.
- Role: **潮震控場 / delayed area utility**.
- Base attacks remain readable single-target attacks.
- **潮震**: every configured number of successful attacks, create a short-delay impact pulse at the target location; the pulse deals area damage and pushes non-Boss enemies a small distance backward along the path.
- Bosses take the pulse damage but are not pushed.
- 玄龜 must not duplicate 夫諸's slow, 白澤's vulnerability/debuff role, 句芒's global attack-speed support, 畢方's every-shot explosion pattern, or 應龍's penetration role.
- Canonical source-art direction is frozen: deep-green turtle body, gold shell ornaments, cyan water-pattern / water-vapor accents, no snake, simplified large color blocks. The later extra 玄龜 variant and 劇毒蛙王 / frog-type draft are rejected.

## Numerical baseline

### 長右
- HP: **110**
- Speed: **86**
- BaseDamage: **1**
- Reward: **15**
- Radius: **12**
- 泥躍: entering an active wetland patch grants **×1.30 movement speed for 1.6s**.
- 泥躍 does not stack; re-entering the same active patch does not retrigger until that patch has returned to quiet state and activated again.

### 蠱雕
- HP: **420**
- Speed: **24**
- BaseDamage: **3**
- Reward: **32**
- Radius: **18**
- 沼甲: while inside an active wetland patch, damage taken is **×0.78**.
- After leaving the active wetland, 沼甲 lingers for **0.6s**.
- Re-entry refreshes the linger timer; mitigation does not stack.

### 化蛇
- BaseHP: **7600**
- Speed: **15**
- BaseDamage: **20**
- Reward: **0**
- Radius: **30**
- Boss: yes.
- Wave10 Boss HP multiplier: **×1.10** → effective Wave10 HP **8360**.
- P2 threshold: **50% HP**, one-time transition, no heal and no second health bar.
- P1 forced high tide: every **7.0s**, immediately begins a **2.4s** high-tide window.
- P2 forced high tide: every **5.0s**, high-tide window lasts **3.0s**.
- P2 movement speed multiplier: **×1.15**.
- 化蛇 is immune to 泥躍 and 沼甲 and does not receive normal-enemy wetland buffs.

### 潮位 / 濕地活化
- Natural tide cycle: **10.0s total**.
- High tide duration: **2.4s**.
- Quiet/low-tide duration: **7.6s**.
- All approved wetland pockets activate together during high tide.
- A forced high tide immediately starts/restarts the high-tide window; overlapping forced activations refresh duration rather than stack.
- High-tide telegraph must begin **0.8s** before activation using subtle ripple/mist/bubble buildup.
- No full-screen flash; no rectangular/elliptical zone outline.

### 玄龜
- Cost: **145**
- Damage: **13**
- Attack interval: **1.20s**
- Range: **140**
- ProjectileSpeed: **360**
- Base attack: single-target.
- 潮震 trigger: every **4 successful attacks** by that 玄龜.
- 潮震 delay: **0.35s** after the triggering hit.
- 潮震 radius: **52**
- 潮震 damage: **18**
- 潮震 push distance: **18 path-distance units** backward for non-Boss enemies.
- Bosses take 潮震 damage but are immune to the push.
- A pushed enemy may not be moved behind Spawn; pushback changes path distance only and must preserve the canonical path/facing/spacing systems.
- Base-attack VFX is procedural-only: compact cyan/teal water-core projectile with short trail.
- 潮震 VFX is procedural-only: local 0.35s contraction telegraph followed by two expanding water-shock rings and a brief mist/splash accent; no persistent zone and no static image asset.

### 玄龜 Blessings
- **玄波** — 潮震 damage **+20% per layer**. Same-item maximum remains **2 layers**.
- **闊潮** — 潮震 radius **+8 per layer**. Same-item maximum remains **2 layers**.
- **回瀾** — 潮震 non-Boss push distance **+5 path-distance units per layer**. Same-item maximum remains **2 layers**; Boss push immunity remains unchanged.
- Blessings do not change 潮震 trigger count, 0.35s delay, base attack interval, targeting, or wetland tide timing.

### W1–W10
1. W1 — 長右 ×6, spawn interval **1.10s**
2. W2 — 長右 ×8, **1.00s**
3. W3 — 長右 ×6 + 蠱雕 ×2, **1.00s**
4. W4 — 蠱雕 ×4, **1.05s**
5. W5 — 長右 ×10 + 蠱雕 ×3, **0.90s**, HP ×**1.06**
6. W6 — 長右 ×14 + 蠱雕 ×4, **0.78s**, HP ×**1.12**
7. W7 — 長右 ×10 + 蠱雕 ×6, **0.82s**, HP ×**1.18**
8. W8 — 長右 ×16 + 蠱雕 ×6, **0.70s**, HP ×**1.26**
9. W9 — 長右 ×18 + 蠱雕 ×8, **0.64s**, HP ×**1.34**
10. W10 — **化蛇 ×1 first**, then 長右 ×8 + 蠱雕 ×4 as escort, **0.84s**, normal-enemy HP ×**1.20**, Boss HP ×**1.10**. 化蛇 opening once the first escort enters: **0.8s tide telegraph → forced 2.4s high tide**; subsequent P1/P2 cadence remains unchanged.

### Difficulty intent
- W1–W3: readable introduction to 潮位 and species-specific wetland behavior.
- W4–W6: lineup role coverage begins to matter.
- W7–W9: active use of upgrades/Blessings and mixed-role coverage required.
- W10: 化蛇 tide pressure + mixed escort should require a developed three-beast setup, without depending on a single mandatory tower.

## Victory / retry / next-level
- Retry/lineup behavior inherits the shared contract.
- Level8 clear unlocks one new deployable beast through the existing data-driven progression system; identity is **玄龜**.
- Level9 visibility/next-level behavior: pending future scope.

## Shared inherited requirements
- follow `AGENTS.md`;
- completed Level1–7 remain frozen unless a shared-system change materially affects them;
- Motion Lite, enemy path-facing, tower target-facing, spacing/readability, Boss HUD, progression and release contracts remain inherited;
- testing is impact-driven: targeted first, affected regressions only, full suite/browser smoke only when justified.

## Production status
- Exact measured path waypoints, Spawn, Base, T1–T8, three wetland polygons, and Environment Motion Lite anchors are frozen in `GEOMETRY.md` and implemented without redesign.
- Runtime implementation and engineering verification are complete on `feat/level8-youming-marsh`; release/public verification is tracked in `STATE.md`.

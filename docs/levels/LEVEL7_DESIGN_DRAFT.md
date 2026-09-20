# Level7 — Design Start / Progression Contract

> Status: CHAT DESIGN STARTED / THEME + GAMEPLAY DRAFT PENDING PLAYER APPROVAL

This file starts Level7 development under the permanent rules in `AGENTS.md` and `docs/ASSET_INTEGRATION_GUIDE.md`.

## 1. Confirmed progression entering Level7

Level6 victory unlocks **句芒**.

Therefore Level7 must open with the Level4+ lineup flow and show the currently owned deployable roster:

- 畢方
- 夫諸
- 應龍
- 白澤
- 句芒

The player still selects exactly **3** beasts.

This is a hard acceptance item:
- Level6 victory → unlock 句芒;
- entering Level7 → lineup opens;
- lineup shows all 5 owned eligible beasts;
- 句芒 is selectable immediately in Level7;
- exactly 3 selections are required;
- Retry Level7 returns to an empty 0/3 lineup;
- Blessing filtering must follow the selected 3;
- UI must remain usable at 390px / 390×700 with five roster cards.

Do not introduce a Level7-only hard-coded roster array. The roster must come from the shared owned/unlocked progression data.

## 2. 句芒 role direction

Current approved direction from Level6 planning:

- 句芒 is a **global ally-support / wood-god support** deployable beast.
- It must remain mechanically distinct from 白澤's enemy-debuff / Insight role.
- Its support effect is team-wide when brought into the lineup, not a short-range proximity aura.
- Level7 is the first playable level in which 句芒 can be selected and deployed.
- Exact cost, damage, interval, range, upgrade values, support multiplier, projectile type, Blessings, and VFX are not yet frozen.

Before asset generation, classify every 句芒 attack/support visual under `AGENTS.md` Section 16:
- Procedural-first,
- PNG-first,
- or Hybrid.

Do not generate projectile art until that classification is approved.

## 3. Level7 design sequence

Chat should complete these items before any Work handoff:

1. level theme / name / Base / Spawn;
2. special map mechanic;
3. two normal enemies + Boss;
4. enemy abilities;
5. 句芒 gameplay stats and support contract;
6. W1–W10 baseline;
7. Boss phases / victory condition;
8. map background concept and canonical 390×610 geometry;
9. 8 tower slots and mechanic-zone placement;
10. attack-visual classification;
11. final asset inventory;
12. player-supplied final images;
13. Chat static asset optimization/audit;
14. only then create the minimal Work delta.

## 4. Current open design choices

The following are intentionally **not frozen yet**:

- Level7 theme / location;
- Boss identity;
- normal-enemy identities;
- map mechanic;
- 句芒 numerical values;
- Level7 clear reward / next unlock;
- projectile/VFX art list;
- map geometry and tower slots.

Do not let Work invent these decisions.

## 5. Level7 player-facing reminder

When Level7 becomes playable, the lineup screen/result transition must make it obvious that the newly unlocked **句芒** is now available.

Preferred presentation:
- normal five-card lineup roster remains the source of truth;
- the 句芒 card may receive a one-time lightweight `NEW` / newly unlocked emphasis on first Level7 entry;
- this emphasis is presentation-only and must not create a separate unlock state or hard-coded Level7 roster branch;
- after the player has seen it, normal roster presentation may resume.

The exact one-time reminder implementation should remain data-driven and reusable for future newly unlocked beasts.

## 6. Next Chat task

Next, define the Level7 theme, enemies, Boss, mechanic, and 句芒 combat role before any new image batch is generated.


## 7. Proposed Level7 concept — 雷澤天野

> Status: CHAT PROPOSAL / PLAYER APPROVAL PENDING

### Identity

- Level name: **第7關・雷澤天野**
- Base working name: **震木神壇**
- Theme: open stormland / dark thunderclouds / wet grassland / fractured ancient stone / glowing thunder veins.
- The visual language should contrast strongly with Level6 扶桑神域: cooler palette, storm pressure, intermittent flashes, less warm sunlight.

### Normal enemies

#### 欽原 — fast pressure unit
Working gameplay identity:
- small / fast silhouette;
- high movement readability through quick bob and wing/hover motion;
- when struck by a battlefield thunder pulse while inside a charged thunder zone, receives a short **雷行** speed burst;
- no permanent stacking.

The thunder interaction should be visible, not only numerical.

#### 諸懷 — heavy pressure unit
Working gameplay identity:
- heavy / broad silhouette;
- slower base movement;
- uses strong Motion Lite so it does not read as a static sprite sliding on the road;
- first thunder pulse received while inside a charged zone grants a short **雷殼** presentation / defensive state;
- exact mitigation value/duration remains unfrozen until balance pass.

The mechanic must not become a clone of Level6 陽木甲. If retained, use a discrete pulse-triggered short state rather than continuous zone armor.

### Boss — 夔

Working role:
- large thunder Boss;
- two phases;
- readable drum/thunder pulse identity;
- Boss does not simply repeat Jinwu's sunlight-zone shield logic.

Proposed phase structure:

**P1**
- standard movement;
- battlefield thunder pulse on a readable cadence;
- a short telegraph occurs before the pulse.

**P2 at 50% HP**
- one clear transformation / thunderstorm escalation;
- pulse cadence becomes faster;
- 夔 gains a modest movement-speed increase;
- thunder-zone pressure increases;
- no HP refill / second HP bar.

Exact cadence, speed multiplier, and any tower-side debuff remain design values to freeze later.

## 8. Proposed map mechanic — 雷脈 / 雷擊區

The map contains two fixed thunder-vein regions.

Unlike Level6 sunlight:
- thunder is **discrete/pulsed**, not a continuously active buff field;
- each pulse has a short visual telegraph;
- only units logically inside a charged thunder region at pulse time receive the region interaction;
- zone coordinates come from canonical 390×610 geometry later.

Presentation contract:
1. faint thunder-vein landmark always visible;
2. charging state ramps up for roughly 0.8–1.0s;
3. pulse / strike happens clearly;
4. state resolves immediately after the pulse;
5. no rapid strobe / unsafe flashing.

Gameplay timing and exact values are not frozen yet.

## 9. Proposed 句芒 combat role for Level7

句芒 should be the first new selectable deployable beast after 白澤 and must feel useful without becoming mandatory.

### Role
**全隊增益 / 木神支援 + 輕量單體輸出**

### Global support contract
- Having at least one deployed 句芒 grants a team-wide support bonus.
- The bonus is **global**, not proximity-based.
- Multiple 句芒 do **not** stack the global bonus.
- The strongest currently deployed 句芒 level determines the active team bonus.
- Removing/selling the last 句芒 removes the global bonus.
- This must be data-driven/shared enough for later levels; do not implement it as a Level7-only special case.

### Provisional upgrade direction
Numbers below are proposal only, not frozen:

- Lv1: all allied towers attack interval ×0.94 (~6% faster)
- Lv2: all allied towers attack interval ×0.91 (~9% faster)
- Lv3: all allied towers attack interval ×0.88 (~12% faster)

The bonus should apply to the other deployable beasts and may include 句芒 itself only if the implementation remains simple and balanced. Final stacking/self-application must be frozen before coding.

### 句芒 own attack
Working direction:
- light single-target attack;
- lower personal DPS than pure damage towers;
- range around the existing medium support class;
- attack visual should be classified before image production.

Recommended visual classification:
- **Hybrid candidate**: small 青木靈羽 / 葉刃 projectile PNG + procedural green trail / impact.
- Before adding this projectile to the batch image list, first provide a small visual mockup for player approval as required by `AGENTS.md` Section 16.

This gives 句芒 a visible identity while keeping the global support effect as the main reason to choose it.

## 10. Level7 gameplay goals

Target difficulty curve:
- W1–W2: introduce Level7 enemy silhouettes and thunder telegraph safely;
- W3–W4: first meaningful mixed-pressure waves;
- W5–W7: lineup composition and upgrades begin to matter;
- W8–W9: high pressure but readable spacing;
- W10: 夔 + remaining normal enemies, with thunder pulses still visually readable.

Do not tune Level7 around assuming the player selected 句芒. A lineup without 句芒 must remain viable.

## 11. Attack-visual classification — current proposal

| Visual | Proposed class | Batch image now? |
|---|---|---:|
| 雷脈 zone landmark / charge / pulse | Procedural-first | No |
| 夔 thunder pulse ring / flash | Procedural-first | No |
| 欽原 雷行 speed emphasis | Procedural-first | No |
| 諸懷 雷殼 state | Procedural-first or Hybrid | Not yet |
| 句芒 global support indicator | Procedural-first | No |
| 句芒 青木靈羽 / 葉刃 projectile | Hybrid candidate | Mockup first |
| 句芒 impact glow | Procedural-first | No |

Do not generate the Level7 asset batch until the player approves the concept and the final classification.

## 12. What remains before image production

1. player approves/rejects 雷澤天野 / 夔 / 欽原 / 諸懷 direction;
2. freeze 句芒 support mechanic and numerical baseline;
3. freeze normal-enemy values/abilities;
4. freeze Boss P1/P2 numbers;
5. build W1–W10;
6. define Level7 clear reward/unlock;
7. approve background composition;
8. measure canonical 390×610 path / slots / thunder zones;
9. approve final asset inventory;
10. create only the image assets that survive the Procedural / PNG / Hybrid classification.


## 13. Proposed Level7 numerical baseline

> Status: CHAT BALANCE PROPOSAL / PLAYER APPROVAL PENDING

These values are designed to step up moderately from Level6 without assuming the player brings 句芒.

### 欽原

Proposed base stats:
- HP: **100**
- Speed: **88**
- Base Damage: **1**
- Reward: **14**
- Radius class: small

**雷行**
- Trigger: 欽原 is logically inside the thunder region at the instant that region pulses.
- Effect: movement speed × **1.25** for **1.4s**.
- Re-trigger refreshes duration; it does not multiply/stack with itself.
- Leaving the zone does not cancel an already-triggered short 雷行 burst.
- Presentation: procedural speed streak / electric edge emphasis; no dedicated projectile asset.

This deliberately differs from Level6 陽羽, whose sunlight speed bonus exists only while inside the currently active continuous zone.

### 諸懷

Proposed base stats:
- HP: **390**
- Speed: **25**
- Base Damage: **3**
- Reward: **30**
- Radius class: heavy

**雷殼**
- Trigger: 諸懷 is logically inside a thunder region when that region pulses.
- Effect: damage taken × **0.80** for **1.6s**.
- Re-trigger refreshes duration; the defense multiplier does not stack.
- Once the short duration ends, defense returns immediately to normal.
- Presentation: brief charged shell / electric outline around the body.

This is a discrete pulse-triggered temporary defense state, not the continuous location-bound armor used by Level6 扶桑甲獸.

### 夔

Proposed base stats:
- Base HP: **7000**
- Speed: **16**
- Base Damage: **20**
- Reward: **0**
- Radius class: Boss

W10 proposed Boss HP multiplier: **×1.10**
- Runtime W10 HP baseline: **7700**

#### P1
- Boss phase: 1
- Thunder pulse cadence: every **7.0s**
- Telegraph: **0.9s**
- Pulse targets one thunder region at a time, alternating A → B → A → B.
- 夔 itself does not receive 欽原雷行 or 諸懷雷殼 from its own battlefield pulse.

#### P2
Trigger once at **50% HP**:
- no healing;
- no second HP bar;
- Speed × **1.15**;
- pulse cadence becomes **5.0s**;
- telegraph remains **0.9s**;
- pulse sequence becomes:
  - first pulse: A
  - second pulse: B
  - third pulse: **A+B**
  - then repeat.

This creates escalating battlefield pressure without copying 金烏's permanently active dual sunlight zones.

## 14. Proposed 句芒 gameplay baseline

> Status: CHAT BALANCE PROPOSAL / PLAYER APPROVAL PENDING

### Base tower data

- Cost: **130**
- Damage: **10**
- Attack interval: **1.15s**
- Range: **138**
- Projectile speed: **380**
- Role label: **全隊增益 / 木神支援**

句芒 should contribute visible single-target damage, but its individual DPS stays below dedicated damage towers because the global team support is its primary value.

### Global support

At least one deployed 句芒 enables a team-wide attack-interval multiplier.

- Lv1 strongest deployed 句芒: all deployed towers attack interval × **0.95**
- Lv2: × **0.92**
- Lv3: × **0.89**

Rules:
- includes 句芒 itself;
- multiple deployed 句芒 do not stack;
- use only the strongest currently deployed 句芒 level;
- selling/removing the strongest recalculates from the remaining 句芒;
- selling/removing the last 句芒 removes the support bonus immediately;
- this multiplier is a shared team-support layer and must compose predictably with existing Blessing attack-speed modifiers rather than rewriting them.

### Level scaling

Use the existing common tower level-damage contract unless implementation evidence requires a narrow exception:
- Lv1 damage: base
- Lv2 damage: existing shared ×1.30
- Lv3 damage: existing shared ×1.50

Do not invent a second 句芒-specific damage-level formula.

### Proposed Blessing direction

Do not add Level7-only mechanics just to fill three cards. Candidate 句芒-specific Blessings:

- **青羽**: 句芒 damage +20%
- **春生**: global support improves by a small fixed amount
- **神木**: 句芒 range +15%

Exact 春生 support increment remains unfrozen until executable balance simulation.

### Attack visual

Current recommendation remains:
- small 青木靈羽 / 葉刃 body: **Hybrid candidate**
- procedural green trail
- procedural impact glow

Do not create the projectile asset until the player approves the mockup direction.

## 15. Proposed W1–W10 baseline

The wave structure introduces each enemy independently before mixing them, then increases pressure gradually.

| Wave | Composition | interval | hpMultiplier | bossHpMultiplier |
|---|---|---:|---:|---:|
| W1 | 欽原 ×6 | 1.10 | 1.00 | — |
| W2 | 欽原 ×8 | 1.00 | 1.00 | — |
| W3 | 欽原 ×6 + 諸懷 ×2 | 1.00 | 1.00 | — |
| W4 | 諸懷 ×4 | 1.05 | 1.00 | — |
| W5 | 欽原 ×10 + 諸懷 ×3 | 0.90 | 1.05 | — |
| W6 | 欽原 ×14 + 諸懷 ×4 | 0.78 | 1.10 | — |
| W7 | 欽原 ×10 + 諸懷 ×6 | 0.82 | 1.15 | — |
| W8 | 欽原 ×16 + 諸懷 ×6 | 0.70 | 1.22 | — |
| W9 | 欽原 ×18 + 諸懷 ×8 | 0.64 | 1.30 | — |
| W10 | 欽原 ×8 + 諸懷 ×4 + 夔 ×1 | 0.84 | 1.18 | 1.10 |

Design constraints:
- W1–W2 must remain comfortable enough for the player to read the thunder telegraph.
- W3–W4 teach the interaction of fast and heavy enemies with the same pulse mechanic.
- W8–W9 may be dense, but global enemy-spacing/readability rules still apply.
- W10 must not end when 夔 dies if normal enemies remain.
- W10 must not end while 夔 is alive even if the normal queue is empty.
- Boss and remaining minions may overlap in time, but spawning must preserve the shared spacing contract.

## 16. Thunder mechanic timing proposal

### P1 / normal waves

- Two fixed thunder regions: A / B.
- One region charges at a time.
- Cycle interval: **7.0s**.
- Telegraph duration: **0.9s**.
- After telegraph, the region pulses once, then returns to faint landmark state.
- Next cycle charges the other region.

### Boss P2

- Cycle interval: **5.0s**.
- Telegraph remains **0.9s**.
- Sequence: A → B → A+B → repeat.
- The A+B pulse is still one discrete event, not a persistent dual-zone field.

### Safety / readability

- no rapid white full-screen flash;
- use localized glow / electric veins / ring expansion;
- no strobing faster than the readable telegraph cadence;
- active telegraph must remain identifiable at 390px / 390×700;
- zone VFX must not obscure HP bars, towers, or enemy silhouettes.

## 17. Level7 clear reward / progression proposal

Do **not** add another deployable-beast unlock at Level7 by default.

Reason:
- Level3 unlocked 白澤;
- Level6 unlocked 句芒;
- unlocking a new deployable every single level would rapidly inflate roster/UI/balance scope.

Proposed Level7 clear behavior:
- victory progresses to Level8 once Level8 exists;
- no new beast unlock is required for Level7;
- if a later design decides Level7 needs a special unlock, add it through shared progression data rather than a Level7-specific UI branch.

This keeps Level7 focused on teaching and validating 句芒 as the newly available fifth roster member.

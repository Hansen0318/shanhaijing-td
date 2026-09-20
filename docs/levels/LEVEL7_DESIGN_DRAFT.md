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

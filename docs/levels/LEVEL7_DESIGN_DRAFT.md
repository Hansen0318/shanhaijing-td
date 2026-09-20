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

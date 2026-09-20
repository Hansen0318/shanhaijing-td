# Level7 — Approved Specification

> Only player-approved/frozen requirements belong here. Proposals remain in `DESIGN.md`.

## 1. Entry progression

- **L7-R001** Level6 victory unlocks **句芒** through shared progression data.
- **L7-R002** Level7 entry uses the existing Level4+ lineup flow.
- **L7-R003** Owned eligible roster at Level7 entry is 畢方／夫諸／應龍／白澤／句芒.
- **L7-R004** Player selects exactly **3**.
- **L7-R005** Retry returns to empty **0/3**.
- **L7-R006** Blessing filtering uses the selected lineup.
- **L7-R007** No Level7-only hard-coded roster array.

## 2. Level identity / enemy set

- **L7-D001** Level name: **第7關・雷澤天野**.
- **L7-D002** Base name: **震木神壇**.
- **L7-D003** Visual direction: open stormland / dark thunderclouds / wet grassland / fractured ancient stone / glowing thunder veins, clearly contrasting with Level6 warm sunlight.
- **L7-D004** Normal enemy 1: **欽原** — small / fast pressure unit.
- **L7-D005** Normal enemy 2: **諸懷** — heavy / slow pressure unit.
- **L7-D006** Boss: **夔** — two-phase thunder Boss.
- **L7-D007** Map mechanic: two fixed **雷脈／雷擊區** using discrete pulsed activation with telegraph, not a continuous sunlight-style field.

## 3. 欽原

- **L7-R010** HP 100.
- **L7-R011** Speed 88.
- **L7-R012** Base Damage 1.
- **L7-R013** Reward 14.
- **L7-R014** When logically inside the pulsing thunder region at pulse time, 雷行 applies Speed ×1.25 for 1.4s.
- **L7-R015** Re-trigger refreshes duration; it does not stack multiplicatively with itself.
- **L7-R016** Leaving the region does not cancel an already-triggered 雷行 burst.
- 雷行 visual emphasis is Procedural-first unless player/runtime smoke later rejects readability.

## 4. 諸懷

- **L7-R020** HP 390.
- **L7-R021** Speed 25.
- **L7-R022** Base Damage 3.
- **L7-R023** Reward 30.
- **L7-R024** Thunder pulse while logically inside the charged region grants 雷殼: damage taken ×0.80 for 1.6s.
- **L7-R025** Re-trigger refreshes duration; defense does not stack.
- **L7-R026** The effect ends immediately after its short duration and is not location-persistent.
- This must remain mechanically distinct from Level6 扶桑甲獸 continuous location-bound armor.

## 5. 夔

- **L7-R030** Base HP 7000.
- **L7-R031** Speed 16.
- **L7-R032** Base Damage 20.
- **L7-R033** W10 Boss HP multiplier ×1.10, runtime baseline 7700 HP.
- **L7-R034** P1 thunder cadence 7.0s, telegraph 0.9s, alternating A → B → A → B.
- **L7-R035** P2 triggers once at 50% HP.
- **L7-R036** P2 does not heal and does not create a second HP bar.
- **L7-R037** P2 movement speed ×1.15.
- **L7-R038** P2 thunder cadence 5.0s, telegraph remains 0.9s.
- **L7-R039** P2 pulse sequence A → B → A+B → repeat.
- **L7-R040** 夔 does not receive 欽原雷行 or 諸懷雷殼 from its own battlefield pulse.

## 6. 雷脈 / 雷擊區

- **L7-R050** Two fixed thunder regions A / B.
- **L7-R051** Normal/P1 cadence: one region charges at a time every 7.0s, telegraph 0.9s, then one discrete pulse.
- **L7-R052** Normal/P1 alternates A ↔ B.
- **L7-R053** Boss P2 cadence becomes 5.0s and sequence is A → B → A+B → repeat.
- **L7-R054** A+B is still one discrete event, not a persistent dual-zone state.
- **L7-R055** No rapid full-screen white strobe; use localized glow / electric veins / ring expansion.
- **L7-R056** Telegraph and pulse must remain readable at 390px / 390×700 without obscuring HP bars, towers, or enemy silhouettes.

## 7. 句芒

- **L7-D010** Role: **全隊增益 / 木神支援 + 輕量單體輸出**.
- **L7-R060** Cost 130.
- **L7-R061** Damage 10.
- **L7-R062** Attack interval 1.15s.
- **L7-R063** Range 138.
- **L7-R064** Projectile speed 380.
- **L7-R065** At least one deployed 句芒 grants a global team attack-interval multiplier.
- **L7-R066** Support values: Lv1 ×0.95, Lv2 ×0.92, Lv3 ×0.89.
- **L7-R067** Multiple 句芒 do not stack; strongest deployed 句芒 level determines the active team bonus.
- **L7-R068** Selling/removing the strongest recomputes from remaining 句芒; removing the last one removes the bonus.
- **L7-R069** The support multiplier includes 句芒 itself.
- **L7-R070** Use the existing shared tower damage scaling contract: Lv2 ×1.30, Lv3 ×1.50. Do not create a separate 句芒 damage-level formula.
- 句芒 attack visual remains a Hybrid candidate: small 青木靈羽／葉刃 body + procedural trail/impact. Final asset generation is not yet approved.

## 8. W1–W10 baseline

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

- **L7-R080** W1–W2 remain readable/introductory enough to teach thunder telegraph.
- **L7-R081** W10 victory requires all normal enemies cleared and 夔 dead.
- **L7-R082** W10 must not end while 夔 is alive even if the normal queue is empty.
- **L7-R083** Global enemy spacing/readability contract remains in force.
- **L7-R084** Level7 must remain viable without selecting 句芒.

## 9. Level7 clear / next progression

- **L7-D020** Level7 does not unlock another deployable beast by default.
- **L7-R090** Once Level8 exists, Level7 victory progresses to Level8 using the shared next-level progression flow.
- No Level7-specific unlock branch is introduced unless a later player-approved design explicitly changes this.

## 10. Newly unlocked reminder

- **L7-R100** On the player's first relevant Level7 lineup experience, 句芒 should be visibly discoverable as newly available.
- **L7-R101** Any NEW / newly-unlocked emphasis is presentation-only and reusable/data-driven.
- **L7-R102** It must not create a Level7-specific progression state or roster branch.

## 11. Shared inherited requirements

Level7 inherits all applicable `AGENTS.md`, `docs/DEVELOPMENT_PLAYBOOK.md`, and `docs/DEVELOPMENT_GOVERNANCE.md` rules, including:

- Chat-first / minimal Work delta;
- completed Level1–6 compatibility;
- shared Motion Lite;
- enemy path-facing / tower target-facing;
- global spacing/readability;
- data-driven roster/Blessing/progression;
- canonical geometry discipline;
- mobile 390px / 390×700 acceptance;
- attack-visual classification;
- stage-gated development;
- cheapest-valid verification owner;
- default release closure through main + Pages unless explicitly overridden.

## 12. Still open / not yet frozen

- final background composition;
- canonical 390×610 path;
- Spawn/Base positions;
- 8 tower slots;
- thunder-zone coordinates;
- enemy/Boss sprite anchors/footprints against final art;
- final asset inventory and image-generation allowlist;
- 句芒 final projectile art direction/mockup;
- exact 句芒-specific Blessing values, including 春生 increment.


## 13. Approved map composition direction

- **L7-G001** Battlefield is a vertical stormland map targeting the established 390×610 logical runtime.
- **L7-G002** Spawn direction: upper-left / left-upper edge, using a storm-rift or broken thunder-gate presentation.
- **L7-G003** Base direction: lower-right **震木神壇**, using a compact ancient wood-and-stone altar/core presentation.
- **L7-G004** Route structure: upper approach → 雷脈A crossing → middle fold/hairpin → lower approach → 雷脈B crossing → lower-right Base.
- **L7-G005** The middle fold may create repeated path coverage, but must not become so tight that one ordinary central slot trivially dominates most of the route.
- **L7-G006** Thunder A/B must be spatially separated enough that one normal-range tower does not automatically dominate both regions.
- **L7-G007** Background may bake faint thunder-vein landmarks into the terrain, but active charging/pulse brightness remains procedural.
- **L7-G008** Background must avoid permanent full-screen lightning, large rectangular zone plates, or props that hide enemies/HP readability.
- **L7-G009** Target tower-slot distribution for later measurement: roughly 2 upper / 3 middle / 3 lower, subject to final background/crop audit.
- **L7-G010** No canonical path/slot/zone coordinates are valid until the final background/crop is player-approved and measured.

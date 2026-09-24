# Level9 — Approved Specification

> Only player-approved or inherited/frozen requirements belong here.

## Entry progression
- **L9-R001 — FROZEN:** Level9 becomes reachable from the Level8 victory flow once Level9 production implementation exists.
- **L9-R002 — FROZEN:** entering Level9 opens the persistent lineup screen before preparation/combat.
- **L9-R003 — FROZEN:** the owned Level9 roster is **畢方／夫諸／應龍／白澤／句芒／玄龜**.
- **L9-R004 — FROZEN:** lineup selection requires exactly **3** owned beasts before confirmation.

## Core gameplay
- **L9-D001 — PLAYER_APPROVED / FROZEN:** level identity = **第9關・鐘山極夜**; visual direction is a high-altitude black-red mountain shrine / perpetual dusk-night biome.
- **L9-D002 — PLAYER_APPROVED / FROZEN:** normal enemies = **天狗** and **猙**.
- **L9-D003 — PLAYER_APPROVED / FROZEN:** Boss = **燭龍**.
- **L9-D004 — PLAYER_APPROVED / FROZEN:** signature mechanic = **晝夜輪轉**, with two clearly readable battlefield states, **晝相** and **夜相**; exact gameplay effects are deferred to Gate C.
- **L9-D005 — PLAYER_APPROVED / FROZEN:** Level9 clear unlock = **帝江**, role direction **混沌干擾／範圍節奏控制**; exact tower kit/stats are deferred to Gate C.
- **L9-D006 — PLAYER_APPROVED / FROZEN:** difficulty intent = harder than Level8 primarily through state-reading/timing, not large stat inflation; keep one dominant new mechanic rather than stacking unrelated environment systems.

## Numerical baseline

### L9-R100 — 玄龜 first-playable carry-over — INHERITED / FROZEN
- Level9 is 玄龜's first playable level.
- Inherit Level8 frozen contract without rebalance: cost **145**, damage **13**, interval **1.20s**, range **140**, projectile speed **360**.
- Every **4 successful attacks** triggers 潮震 after **0.35s**: radius **52**, damage **18**, non-Boss pushback **18** path-distance units; Boss takes pulse damage but is not pushed.
- Inherit procedural cyan/teal projectile and contraction → twin water-ring → mist/splash 潮震 presentation.
- Inherit 玄波 / 闊潮 / 回瀾 Blessings and lineup filtering.
- Level9 verification must prove phone-readable projectile/潮震, correct push/no-Boss-push behavior, sprite/facing and roster inclusion.

### L9-R101 — 天狗 — PLAYER_APPROVED / FROZEN
- HP **120**; speed **90**; base damage **1**; reward **16**; radius target **11–12**.
- 晝相 movement speed ×**1.20**; 夜相 no speed bonus.

### L9-R102 — 猙 — PLAYER_APPROVED / FROZEN
- HP **450**; speed **24**; base damage **3**; reward **34**; radius **18**.
- 夜相 incoming normal attack damage ×**0.82**; 晝相 no armor bonus.

### L9-R103 — 晝夜輪轉 — PLAYER_APPROVED / FROZEN
- Normal combat begins in 晝相.
- Outside Boss control, state alternates every **8.0s**.
- Each transition telegraphs **0.8s** before the switch.
- Must use a localized battlefield cue plus an overall cue; subtle full-screen tint alone is insufficient.
- No additional global player-tower buff/debuff.

### L9-R104 — 帝江 unlock kit — PLAYER_APPROVED / FROZEN FOR FUTURE PLAY
- Level9 clear unlock; first playable in Level10 once implemented.
- Role: 混沌干擾／短暫定身節奏控制.
- Cost **150**; damage **12**; interval **1.10s**; range **145**; projectile speed **380**.
- Every **5th successful attack** triggers 混沌震: radius **46**; non-Boss movement lock **0.35s**; Boss lock **0.12s**; no path pushback; no same-instant stacking extension.
- Blessings, max 2 layers each:
  - 亂流: radius +**7**/layer
  - 凝滯: non-Boss lock +**0.07s**/layer; Boss +**0.03s**/layer
  - 回響: trigger cadence improves by 1 attack/layer, floor **3**

### L9-R105 — 燭龍 — PLAYER_APPROVED / FROZEN
- Base HP **8200**; speed **15**; base damage **20**; reward **0**; radius **30**.
- P2 at **50% HP**.
- P1: enters with 晝相; state switch every **6.0s** with **0.8s** telegraph.
- P2: movement speed ×**1.12**; switch every **4.5s**; telegraph remains **0.8s**.
- No third unrelated environment mechanic.

### L9-R106 — W1–W10 — PLAYER_APPROVED / FROZEN
1. W1 天狗×6, **1.10s**
2. W2 天狗×8, **1.00s**
3. W3 天狗×6 → 猙×2, **1.00s**
4. W4 猙×4, **1.05s**
5. W5 天狗×10 → 猙×3, **0.90s**, HP ×**1.06**
6. W6 天狗×14 → 猙×4, **0.78s**, HP ×**1.12**
7. W7 天狗×10 → 猙×6, **0.82s**, HP ×**1.18**
8. W8 天狗×16 → 猙×6, **0.70s**, HP ×**1.26**
9. W9 天狗×18 → 猙×8, **0.64s**, HP ×**1.34**
10. W10 **燭龍×1 first → 天狗×8 → 猙×4**, **0.84s**, escort HP ×**1.20**, Boss HP ×**1.10** → effective Boss HP **9020**.

### L9-R107 — W10 encounter timeline — PLAYER_APPROVED / FROZEN
- t=0.0 燭龍 first, force 晝相.
- t≈0.8 first 天狗 escort begins.
- t=5.2 first switch telegraph begins.
- t=6.0 enter 夜相 while escort remains active.
- later 天狗 / first 猙 overlap the state transition.
- P1 continues 6.0s switches; P2 changes to 4.5s at 50% Boss HP.
- Implementation must prove both 天狗晝相 speed and 猙夜相 armor are observable; if executable evidence disproves the intended overlap, correct W10 timing/order before release.

### L9-R108 — victory/progression — PLAYER_APPROVED / FROZEN
- W10 requires queue exhausted + all normal enemies dead + 燭龍 dead.
- First Level9 clear presents 帝江 unlock.
- Retry returns to empty 6-select-3.
- No Level10 button until Level10 exists.

## Victory / retry / next-level
- **L9-R005 — FROZEN:** retry clears the lineup and returns to an empty selection state; exactly 3 must be chosen again.
- **L9-R006 — FROZEN:** while Level10 is not implemented, Level9 victory must not show a dead/nonfunctional Level10 button.
- Level9 clear unlock / reward: **帝江**, per L9-D005.

## Shared inherited requirements
- follow `AGENTS.md`, `docs/DEVELOPMENT_PLAYBOOK.md`, and `docs/DEVELOPMENT_GOVERNANCE.md`;
- preserve Level1–8 unless an identified shared-system change requires targeted regression;
- enemy spacing/readability, facing, lineup/Blessing filtering, Boss victory gating, fixed Boss-HUD footprint, PNG alpha rules, mobile 390px readability and release flow remain inherited contracts;
- before Gate D geometry freeze, the exact production background, source dimensions, crop and source→390×610 transform must be frozen and an overlay against that exact background must be player-approved;
- before W10 numerical freeze, Boss/escort/special-mechanic timing must be validated as an ordered encounter timeline;
- required Motion Lite / environmental effects must have an explicit phone-readable threshold, not merely be technically present.

## Verification ownership
- L9-R001/R002/R003/R004/R005/R006: later production implementation requires targeted progression tests.
- geometry registration and visual path/pad alignment: static overlay preflight + player visual approval before Work implementation.
- phone readability / Motion Lite / final visual integration: player smoke unless a later requirement explicitly assigns Work runtime verification.

## Not yet approved
- Gate D map concept / production background / canonical geometry;
- final asset/VFX inventory.

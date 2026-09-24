# Level9 — Approved Specification

> Only player-approved or inherited/frozen requirements belong here.

## Entry progression
- **L9-R001 — FROZEN:** Level9 becomes reachable from the Level8 victory flow once Level9 production implementation exists.
- **L9-R002 — FROZEN:** entering Level9 opens the persistent lineup screen before preparation/combat.
- **L9-R003 — FROZEN:** the owned Level9 roster is **畢方／夫諸／應龍／白澤／句芒／玄龜**.
- **L9-R004 — FROZEN:** lineup selection requires exactly **3** owned beasts before confirmation.

## Core gameplay
- pending Gate B approval.

## Numerical baseline
- pending Gate C approval.

## Victory / retry / next-level
- **L9-R005 — FROZEN:** retry clears the lineup and returns to an empty selection state; exactly 3 must be chosen again.
- **L9-R006 — FROZEN:** while Level10 is not implemented, Level9 victory must not show a dead/nonfunctional Level10 button.
- Level9 clear unlock / reward: pending Gate B approval.

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
- Level9 theme/name;
- normal enemies;
- Boss;
- signature mechanic;
- Level9 clear unlock/new deployable;
- broad difficulty intent;
- numerical stats, W1–W10, Boss phases/timeline;
- production map/background and geometry;
- final asset/VFX inventory.

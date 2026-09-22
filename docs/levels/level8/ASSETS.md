# Level8 — Asset / VFX Ledger

## Status
**BACKGROUND-ONLY GENERATION OPEN**

## Generation status vocabulary
- APPROVED_FOR_GENERATION
- MOCKUP_APPROVED_ONLY
- PENDING_DISCUSSION
- PROCEDURAL_FIRST
- BLOCKED_BY_GEOMETRY
- GENERATED_UNAPPROVED
- APPROVED_FINAL

## Existing/shared reuse
- inherited tower/deployable art: reuse unless Level8 progression explicitly unlocks a new deployable.
- common Motion Lite / procedural VFX systems: reuse where suitable.

## Planned inventory
| Item | Purpose | Classification | Status |
|---|---|---|---|
| Level8 background | battlefield/map | PNG/JPG source | APPROVED_FOR_GENERATION |
| Normal enemy A | gameplay sprite | PNG-first | PENDING_DISCUSSION |
| Normal enemy B | gameplay sprite | PNG-first | PENDING_DISCUSSION |
| Boss | gameplay sprite | PNG-first | PENDING_DISCUSSION |
| Boss HUD empty slot | Boss UI | PNG-first | PENDING_DISCUSSION |
| Environment Motion Lite | living-map visuals | Procedural-first by default | PENDING_DISCUSSION |
| New deployable / projectile | only if progression requires it | pending | BLOCKED_BY_PROGRESSION |

## Current image-generation allowlist
**Level8 background only.**

## Runtime optimization / preload
- Final runtime background target: 780×1220, exact 39:61 aspect.
- Generated source may be larger but must preserve the approved 39:61 composition when normalized.
- No character/Boss/HUD/玄龜/projectile art is authorized in this batch.

## Boss HUD contract for Level8
- Boss: **化蛇**.
- HUD source must contain two visually distinct internal regions within one fixed outer footprint:
  - upper **solid / near-solid dark name panel** for runtime yellow Boss-name text;
  - lower **empty health channel** for the runtime-only HP fill.
- Do not bake Boss name text or HP into the source image.
- Do not make the runtime HUD container taller just to add the name panel; keep the established Boss-HUD footprint so the battlefield/map is not compressed.
- Any candidate that changes outer HUD bounds/aspect enough to shift the battlefield requires explicit player review before integration.

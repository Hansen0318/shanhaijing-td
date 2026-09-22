# Level8 — Asset / VFX Ledger

## Status
**SEQUENTIAL CHARACTER ASSET REVIEW**

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
| Normal enemy A — 長右 | gameplay sprite | PNG-first | APPROVED_FINAL |
| Normal enemy B — 蠱雕 | gameplay sprite | PNG-first | APPROVED_FOR_GENERATION |
| Boss — 化蛇 | gameplay sprite | PNG-first | APPROVED_FINAL |
| 化蛇 Boss HUD empty slot | Boss UI | PNG-first | APPROVED_FINAL |
| Environment Motion Lite | living-map visuals | Procedural-first by default | PENDING_DISCUSSION |
| New deployable — 玄龜 | gameplay sprite | PNG-first | PENDING_DISCUSSION |

## Current image-generation allowlist
**蠱雕 only.**

## Runtime optimization / preload
- Final runtime background target: 780×1220, exact 39:61 aspect.
- Generated source may be larger but must preserve the approved 39:61 composition when normalized.
- Current generation batch authorizes **蠱雕 only**. 玄龜 remains blocked until 蠱雕 review is complete.

## Boss HUD contract for Level8
- Boss: **化蛇**.
- HUD source must contain two visually distinct internal regions within one fixed outer footprint:
  - upper **solid / near-solid dark name panel** for runtime yellow Boss-name text;
  - lower **empty health channel** for the runtime-only HP fill.
- Do not bake Boss name text or HP into the source image.
- Do not make the runtime HUD container taller just to add the name panel; keep the established Boss-HUD footprint so the battlefield/map is not compressed.
- Any candidate that changes outer HUD bounds/aspect enough to shift the battlefield requires explicit player review before integration.


## Rejected generation attempts
- Generic swamp insect / armored swamp beast / frog-like candidates generated during the early Level8 asset pass are **REJECTED** and are not canonical 長右、蠱雕、化蛇 or 玄龜 source art.
- Any rejected candidate must not be reused merely because it already exists in a local/temp folder.

## Player-approved Level8 source art
- **長右**: four-eared agile simian candidate approved through player continuation.
- **化蛇**: simplified green/cream winged serpent Boss candidate approved by the player.
- **化蛇 Boss HUD**: fixed-footprint HUD with dark solid/near-solid name panel above the empty HP channel approved by the player.

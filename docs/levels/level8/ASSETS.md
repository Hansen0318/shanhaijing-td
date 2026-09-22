# Level8 — Asset / VFX Ledger

## Status
**FINAL CHARACTER ASSET SET APPROVED / VFX REVIEW**

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
| Normal enemy B — 蠱雕 | gameplay sprite | PNG-first | APPROVED_FINAL |
| Boss — 化蛇 | gameplay sprite | PNG-first | APPROVED_FINAL |
| 化蛇 Boss HUD empty slot | Boss UI | PNG-first | APPROVED_FINAL |
| Environment Motion Lite | living-map visuals | Procedural-first by default | PENDING_DISCUSSION |
| New deployable — 玄龜 | gameplay sprite | PNG-first | APPROVED_FINAL |

## Current image-generation allowlist
**None.** Character source art is frozen. 玄龜 ordinary attack / 潮震 must be evaluated Procedural-first before any image generation is considered.

## Runtime optimization / preload
- Final runtime background target: 780×1220, exact 39:61 aspect.
- Generated source may be larger but must preserve the approved 39:61 composition when normalized.
- No Level8 character generation is currently authorized. 長右、蠱雕、化蛇、化蛇 Boss HUD、玄龜 are already approved; effects remain Procedural-first unless a later audit proves static art is necessary.

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
- The over-detailed moss/bone-armored raptor draft generated before the approved 蠱雕 candidate is **REJECTED**; do not reuse it.
- Extra 化蛇 variants generated after the player had already approved 化蛇 are **REJECTED duplicates** and must not replace the canonical approved Boss art.
- The extra 玄龜 variant generated after the player approved “這張可以” is **REJECTED** and must not replace the canonical 玄龜.
- The later **劇毒蛙王 / frog-type monster** is **REJECTED** and is not a 玄龜 candidate or any Level8 canonical unit.
- Any rejected candidate must not be reused merely because it already exists in a local/temp folder.

## Player-approved Level8 source art
- **長右**: four-eared agile simian candidate approved through player continuation.
- **蠱雕**: simplified horned raptor/eagle candidate approved by the player; broad winged silhouette, bird beak and talons remain the defining read.
- **化蛇**: simplified green/cream winged serpent Boss candidate approved by the player.
- **化蛇 Boss HUD**: fixed-footprint HUD with dark solid/near-solid name panel above the empty HP channel approved by the player.
- **玄龜**: the player-approved “這張可以” candidate is canonical — deep-green turtle body, gold shell ornaments, cyan water-pattern / water-vapor accents, no snake, simplified large color blocks for phone readability.

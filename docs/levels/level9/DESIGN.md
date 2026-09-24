# Level9 — Design / Proposal Record

> Proposals, alternatives, rationale and player-approval-pending content live here. Do not implement from this file unless the accepted decision has been promoted to `SPEC.md`.

## Current gate
**Gate B — Core Design**

## Proposal A — 鐘山極夜 / 燭龍

Status: **PLAYER_APPROVAL_PENDING**

### Level identity
- Working level name: **第9關・鐘山極夜**
- Visual/theme direction: high-altitude black-red mountain shrine / perpetual dusk-night, with one dominant celestial-light source.
- The level should read clearly as a new biome after Level8's marsh without reusing swamp/tide language.

### Normal enemies
- **天狗** — fast pressure enemy; visually lean / forward-moving, intended to create lane pressure without relying on raw HP.
- **猙** — sturdier frontline enemy; visually heavier and easier to distinguish from 天狗 at 390px width.

These are role-level concepts only. No HP/speed/armor numbers are approved in Gate B.

### Boss
- **燭龍**
- Boss fantasy: the battlefield's light-state controller rather than a simple high-HP target.
- Boss visual identity should remain readable inside the existing fixed Boss-HUD footprint; no taller HUD is allowed.

### Signature mechanic — 晝夜輪轉
- The battlefield alternates between two highly legible states:
  - **晝相**: warm/red-gold illumination state.
  - **夜相**: cold/dark-blue illumination state.
- 燭龍 is the authoritative controller of this state during the Boss encounter.
- Normal enemies may later receive species-specific behavior tied to the current state, but the exact effects belong to Gate C.
- The mechanic must remain visually obvious at ~390px width and must not depend on subtle full-screen tint alone; it needs at least one localized, phone-readable battlefield cue.
- W10 must later be frozen as an **ordered encounter timeline**, proving the light-state mechanic is active while its intended enemies/terrain interactions are still present.

### Level9 clear unlock
- Proposed unlock: **帝江** as the seventh deployable beast.
- Proposed role direction: **混沌干擾 / 範圍節奏控制** rather than another pure DPS tower.
- Exact attack pattern, stats, projectile/VFX and Blessings are deferred to later gates.

### Broad difficulty intent
- Level9 should be harder than Level8 through **state-reading and timing**, not through a large HP/stat spike.
- Keep one dominant new mechanic (晝夜輪轉) and make enemy roles visually distinct.
- Do not stack multiple unrelated environmental systems on top of the day/night mechanic.
- The player should be able to understand why the battlefield changed without reading dense text.

## Why this proposal fits the current project
- It gives Level9 a biome and color-language clearly different from Level6–8.
- 燭龍 naturally supports a battlefield-state mechanic that can be communicated visually.
- The design directly incorporates the Level8 retrospective: Boss mechanic timeline, fixed HUD footprint, phone-readable environment state, and early visual-integration planning.
- 帝江 adds a new roster role without duplicating 玄龜's delayed area-control identity.

## Alternatives / rationale
If Proposal A is rejected, Gate B should replace the whole identity coherently rather than mixing Boss/mechanic pieces from unrelated themes.

Potential alternate directions kept only as placeholders:
- **北冥玄境** — cold/deep-water theme, Boss centered on pressure/freeze control.
- **天門風域** — high-wind sky theme, Boss centered on lane displacement / wind-state control.

No alternate is approved and no downstream work should use them.

## Gate B decisions still requiring player approval
- L9-D001: level theme/name.
- L9-D002: normal enemy set.
- L9-D003: Boss identity.
- L9-D004: signature mechanic.
- L9-D005: Level9-clear unlock/new deployable.
- L9-D006: broad difficulty intent.

## Rejected / superseded ideas
- none yet.

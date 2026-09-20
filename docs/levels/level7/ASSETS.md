# Level7 — Asset / VFX Ledger

> Follow `docs/ASSET_INTEGRATION_GUIDE.md` and `AGENTS.md` Section 16.

## Status

**ASSET INVENTORY CLOSED — FINAL SOURCE FILE AUDIT PENDING**

## Confirmed existing/shared assets

- Existing Level1–6 shared UI/runtime assets remain reusable where contracts match.
- 句芒 Level6 unlock art is the **canonical approved visual source** for both the unlock presentation and the Level7 deployable tower. Runtime may use a separately optimized copy/path, but must not redesign the creature.

## Proposed Level7 asset needs — not yet approved

| Item | Purpose | Classification | Production status |
|---|---|---|---|
| Level7 background | map | image required | APPROVED_FINAL |
| 欽原 | normal enemy | PNG-first sprite | APPROVED_FINAL — player-approved single-creature PNG visual |
| 諸懷 | heavy enemy | PNG-first sprite | APPROVED_FINAL — player-approved single-creature PNG visual |
| 夔 | Boss | PNG-first sprite | APPROVED_FINAL — player-approved revised thunder-beast visual |
| 夔 Boss HUD | HUD frame with empty HP channel | PNG-first | APPROVED_FINAL — player-approved blue-white empty-channel HUD |
| 句芒 deployable tower | reuse Level6 unlock visual source | existing-source reuse | APPROVED_FINAL visual identity — no new creature generation |
| 雷脈 landmark/charge/pulse | mechanic VFX | Procedural-first | APPROVED — code-only micro-flow / charge / pulse |
| 欽原 雷行 emphasis | state VFX | Procedural-first | do not batch |
| 諸懷 雷殼 | state VFX | Procedural-first or Hybrid | decide after review |
| 夔 thunder pulse | Boss/mechanic VFX | Procedural-first | do not batch |
| 句芒 team-support indicator | state VFX | Procedural-first | do not batch |
| 句芒 青木靈羽／葉刃 | projectile | Hybrid | APPROVED_FINAL — player-approved simplified high-contrast projectile core |
| 句芒 impact glow | hit VFX | Procedural-first | do not batch |

## Batch-admission rule

- Do not create final image assets for purely procedural items.
- Do not generate “backup” projectile art just in case.
- Borderline cases get a mockup/spec/prototype first.
- Player/runtime smoke may later escalate Procedural-first → Hybrid/PNG-first.
- All final sprites/HUD/VFX must be optimized before deployment and checked at 390px / 390×700.

## Final inventory

Gameplay and Geometry V3 are frozen. Final source-art inventory is now being resolved.

Current classification direction:
- Level7 background — APPROVED_FINAL.
- 欽原 — APPROVED_FINAL single-creature PNG visual.
- 諸懷 — APPROVED_FINAL single-creature PNG visual.
- 夔 — APPROVED_FINAL revised single-Boss PNG visual, clearly differentiated from 諸懷.
- 夔 Boss HUD — APPROVED_FINAL player-approved blue-white empty-channel HUD.
- 句芒 deployable tower — reuse the Level6 unlock art as the same canonical visual source; create only an optimized runtime copy/path if implementation needs one, with no visual redesign.
- 雷脈 idle/charge/pulse — Procedural-first; no image.
- 欽原 雷行 — Procedural-first.
- 諸懷 雷殼 — default Procedural-first; escalate to Hybrid only if 390px smoke is unclear.
- 夔 thunder pulse — Procedural-first.
- 句芒 team-support indicator — Procedural-first.
- 句芒 attack projectile — **Hybrid approved**: one minimal 青木靈羽／葉刃 transparent PNG core + procedural short green trail + procedural impact glow.
- 句芒 impact — Procedural-first.


## Generation status vocabulary

Only these statuses control image generation:

- **APPROVED_FOR_GENERATION** — allowed in the next/current image batch.
- **MOCKUP_APPROVED_ONLY** — may generate a small concept/mockup, not final production art.
- **PENDING_DISCUSSION** — do not generate.
- **PROCEDURAL_FIRST** — do not generate a dedicated image unless later escalated.
- **BLOCKED_BY_GEOMETRY** — do not generate final map-dependent art yet.
- **GENERATED_UNAPPROVED** — output exists but is not canonical/usable until player accepts it.
- **APPROVED_FINAL** — player-approved final source art; proceed to optimization/integration when the project gate permits.

## Current Level7 image-generation allowlist

**欽原 / 諸懷 / 夔 / 夔 Boss HUD are approved. 句芒 reuses its approved Level6 unlock visual; no new 句芒 creature-art batch is needed.**

- Level7 background for 雷澤天野 — **APPROVED_FINAL** as geometry source

Current exact image-generation allowlist:
- 句芒 青木靈羽／葉刃 projectile core — **APPROVED_FINAL**; do not regenerate.

Everything else remains blocked:
- procedural thunder/status/support/trail/impact visuals — do not create dedicated art.

This approval is limited to the background sub-batch. Generating the background does **not** authorize later character/HUD/projectile assets.


### Proposed next sub-batch — 欽原 only

Status: **APPROVED_FINAL**

Visual proposal is recorded in `DESIGN.md` Section 20.

The player approved the final simplified single-creature 欽原 PNG direction. Preserve this visual identity; later work may only perform runtime optimization/integration. Do not automatically include 諸懷, 夔, 句芒, Boss HUD, or projectile art in the same batch.


### Level7 creature-generation rule inheritance

All remaining Level7 creature art follows `AGENTS.md` Section 21 and the creature source-art contract in `docs/ASSET_INTEGRATION_GUIDE.md`.

For 諸懷 / 夔 / 句芒 production sprite:
- discuss visual identity first;
- show the player only a single game-usable transparent PNG candidate by default;
- no concept sheet / multi-panel board unless explicitly requested;
- simplify for phone readability;
- use strong feature/body color separation;
- avoid dark-detail-heavy bodies that collapse into a blob;
- approve the current creature before opening the next sub-batch.


### Proposed next sub-batch — 諸懷 only

Status: **APPROVED_FOR_GENERATION**

Visual proposal is recorded in `DESIGN.md` Section 21.

Player continuation accepted this visual direction. Generate 諸懷 only as one single transparent-background game-usable PNG. Keep 夔, 句芒, Boss HUD and projectile art blocked.


### Asset sync after player approvals — 諸懷 / 夔

- 諸懷: player accepted the simplified broad four-horn heavy-beast single PNG direction → **APPROVED_FINAL**.
- 夔: first version was rejected as too similar to 諸懷; revised version changed silhouette/palette to a distinct blue-white thunder beast and was accepted by player continuation → **APPROVED_FINAL**.
- 夔 Boss HUD: a candidate was generated afterward, but no explicit player approval has been recorded → **GENERATED_UNAPPROVED**.
- Do not infer approval of the HUD from approval of the Boss sprite.
- Final Work ZIP still waits for the player's re-uploaded concrete files and FINAL FILESET AUDIT PASS per AGENTS.md Section 14.


### Player decision — 句芒 source reuse / 夔 HUD approval

- Player approved the existing blue-white 夔 Boss HUD candidate → **APPROVED_FINAL**.
- Player chose to reuse the **same 句芒 visual source already shown by the Level6 unlock reward** for the Level7 deployable tower.
- Therefore **do not generate a second 句芒 creature image** merely for tower deployment.
- Runtime integration may create a trimmed/resized/compressed derivative such as a tower-runtime asset path, but it must preserve the exact approved visual identity.
- Unlock presentation and deployed tower may use different optimized files only for runtime/layout reasons; they are still derivatives of the same canonical source.
- This reuse decision applies to 句芒 for this release; it does not retroactively change 白澤's existing separate unlock/tower assets.
- Next unresolved visual decision: 句芒 attack projectile classification/mockup.


### Approved next sub-batch — 句芒 projectile core only

Status: **APPROVED_FOR_GENERATION**

Player continuation accepted the Hybrid direction.

Generate exactly **one** game-usable transparent PNG:
- identity: 青木靈羽／葉刃;
- purpose: 句芒's lightweight single-target attack projectile core;
- silhouette: one compact leaf-feather/blade shape, readable at very small mobile size;
- palette: bright spring green / jade with a small warm-gold highlight; avoid dark mass;
- detail: extremely simple, large color regions, no micro-veins or ornate texture;
- orientation: clear horizontal travel direction so runtime rotation/facing is predictable;
- background: transparent;
- no text, no sheet, no multiple variants, no trail baked into the PNG, no impact baked into the PNG.

Runtime companion visuals remain code-only:
- short soft green trail → Procedural-first;
- hit glow / small scatter → Procedural-first;
- global team-support indicator → Procedural-first.

After the single PNG is shown, wait for explicit player approval before marking it APPROVED_FINAL or opening any later asset step.

### Player approval — 句芒 projectile

- Player approved the simplified second 青木靈羽／葉刃 candidate with reduced detail and stronger color-block readability.
- Status → **APPROVED_FINAL**.
- Preserve this exact visual identity; later runtime work may only trim/resize/compress it.
- Trail and impact remain Procedural-first and must not be baked into a replacement projectile image.
- No further Level7 source-art generation is opened by this approval.

### Asset inventory closure

- Player-approved required source-art set is now fully classified.
- No further Level7 image generation is required before implementation.
- Remaining procedural visuals are code-owned and stay out of the image package.
- Next asset gate is the mandatory FINAL FILESET AUDIT: player re-uploads the concrete final files intended for Work; Chat verifies version/purpose/format/alpha/dimensions/crop/filename mapping and rejects stale variants before packaging.

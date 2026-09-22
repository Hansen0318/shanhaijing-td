# Level8 — Geometry Contract

## Status
**PLAYER-APPROVED ROUTE / TOWER LAYOUT — EXACT COORDINATES PENDING MEASUREMENT**

## Logical map
- width: **390**
- height: **610**
- logical aspect ratio: **39:61**
- canonical runtime background target: **780×1220** (exact 2× logical map, same 39:61 aspect)
- generated source may be larger, but the approved composition must be normalized to the exact 39:61 runtime source before geometry measurement.
- runtime battlefield/display contract: **preserve the current full-width mobile battlefield behavior; do not introduce Level7-style narrow/pillarboxed containment.** Level8 background art is composed for the 390×610 logical canvas from the start.
- background/crop: final normalized background should use the full source image; no post-approval partial crop that changes composition.

## Map composition
- Theme: **幽冥沼澤 / 毒霧濕地**.
- Player-approved route guide: **broad asymmetric S/meander** with visibly different upper/middle/lower bend radii; not a smooth symmetric S and not Level7's lightning-Z.
- Spawn region: **upper-left edge**, entering through the wet marsh road.
- Base region: **lower-center sanctuary/islet**, reached after the final inward curve.
- Player approved the **8 tower-pad composition** shown in the Level8 Geometry Guide V1: early/mid/late pads alternate across both sides of the route rather than forming a regular grid.
- Route surface should read as damp/soft marsh road, not dry stone highway.
- Wetland water/mud remains on both sides of the road; future gameplay wetland pockets must follow visible marsh shapes rather than generic boxes.
- Keep tower pads visually separated from busy reeds/props at phone scale.

## Canonical path
- **Shape / route placement: APPROVED by player from Level8 Geometry Guide V1.**
- ordered waypoints: pending exact measurement from the approved guide/background
- Spawn: pending exact measurement in the approved **upper-left** entry
- Base: pending exact measurement at the approved **lower-center** sanctuary
- Do not redesign the path shape during implementation; only measure/interpolate anchors needed to preserve the approved centerline.

## Tower slots
- **T1–T8 placement/composition: APPROVED by player from Level8 Geometry Guide V1.**
- exact x/y coordinates: pending measurement from the approved guide/background
- preserve the approved relative ordering and side-of-road placement; do not redistribute pads for convenience.
- no tower slot should sit inside a wetland pocket or behind a major foreground prop.

## Special zones
- target: **3 wetland pockets**, all sharing the global tide state
- exact bounds: pending approved-background measurement
- wetland shapes should follow visible water/marsh contours, not generic rectangles/ellipses.

## Environment Motion Lite anchors
- target budget: **3–4** subtle motions, measured from visible art only:
  1. slow ground-fog drift across one low basin;
  2. ripple motion inside visible wetland water;
  3. occasional bubble clusters in one marsh pool;
  4. optional bioluminescent plant breathing only if the approved background contains a clear plant cluster.
- exact anchors/widths/heights: pending approved-background measurement
- do not invent motion locations that are not visible environmental features.

## Anchor / footprint notes
- Background generation must leave the route and tower-slot candidate land visually readable at phone scale.
- Avoid large foreground reeds/trees covering the centerline.
- Avoid high-contrast decorative objects directly under expected enemy silhouettes.
- Geometry measurement begins only after the player approves the actual background candidate.

## Approval / runtime verification
- Map/display composition contract: **FROZEN**
- Route shape / Spawn-Base arrangement / T1–T8 composition: **PLAYER APPROVED**
- Exact measured geometry: pending
- Runtime/player smoke: pending

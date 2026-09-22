# Level8 — Geometry Contract

## Status
**PLAYER-APPROVED ROUTE / TOWER LAYOUT — EXACT GEOMETRY MEASURED**

## Logical map
- width: **390**
- height: **610**
- logical aspect ratio: **39:61**
- canonical runtime background target: **780×1220** (exact 2× logical map, same 39:61 aspect)
- approved source pair is 1024×1536. Normalize by horizontal center-crop **x=21..1003** → **982×1536**, then scale to 390×610 logical (or 780×1220 runtime). This preserves the approved composition while matching 39:61.
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
- logical coordinate system: **390×610**, origin at top-left after the 982×1536 normalization crop.
- Spawn: **(44, 52)**
- Ordered path anchors:
  1. **(65, 79)**
  2. **(135, 104)**
  3. **(225, 118)**
  4. **(303, 135)**
  5. **(340, 166)**
  6. **(314, 207)**
  7. **(247, 229)**
  8. **(172, 259)**
  9. **(196, 291)**
  10. **(247, 326)**
  11. **(164, 358)**
  12. **(120, 385)**
  13. **(175, 423)**
  14. **(250, 444)**
  15. **(281, 471)**
  16. **(248, 513)**
- Base: **(231, 538)**
- Runtime may add interpolation points only to follow this measured centerline smoothly. It must not move the approved bends or create a new route.

## Tower slots
- **T1–T8 placement/composition: APPROVED by player from Level8 Geometry Guide V1.**
- exact logical centers:
  - T1 **(115, 133)**
  - T2 **(289, 175)**
  - T3 **(142, 230)**
  - T4 **(269, 291)**
  - T5 **(104, 332)**
  - T6 **(267, 405)**
  - T7 **(113, 440)**
  - T8 **(342, 481)**
- preserve the approved relative ordering and side-of-road placement; do not redistribute pads for convenience.
- no tower slot should sit inside a wetland pocket or behind a major foreground prop.

## Special zones
- **3 wetland pockets**, all sharing the global tide state.
- These are measured as irregular on-path floodable polygons following the visibly wet/marsh-adjacent roadway rather than generic rectangles/ellipses.
- Wetland A — upper-right bend:
  - polygon: **[(292,140), (325,145), (348,160), (350,185), (334,208), (305,218), (285,205), (292,180)]**
- Wetland B — middle S basin:
  - polygon: **[(166,257), (202,250), (235,266), (252,292), (248,320), (222,338), (186,333), (168,306)]**
- Wetland C — lower bend:
  - polygon: **[(172,418), (210,414), (250,428), (283,452), (294,478), (280,504), (247,518), (225,496), (225,468), (198,447)]**
- Polygon membership is the gameplay wetland test. Visual tide VFX must feather inside/around these contours and must not draw hard polygon outlines.

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
- Exact measured geometry: **FROZEN FROM APPROVED GUIDE + BACKGROUND**
- Runtime/player smoke: pending; only runtime overlay evidence may justify sub-pixel/interpolation refinement without changing the frozen route.

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
- Spawn: **(44, 33)**
- Ordered path anchors:
  1. **(65, 60)**
  2. **(135, 85)**
  3. **(225, 99)**
  4. **(303, 116)**
  5. **(340, 147)**
  6. **(314, 188)**
  7. **(247, 210)**
  8. **(172, 240)**
  9. **(196, 272)**
  10. **(247, 307)**
  11. **(164, 339)**
  12. **(120, 366)**
  13. **(175, 404)**
  14. **(250, 425)**
  15. **(281, 452)**
  16. **(248, 494)**
- Base: **(231, 519)**
- Runtime may add interpolation points only to follow this measured centerline smoothly. It must not move the approved bends or create a new route.

## Tower slots
- **T1–T8 placement/composition: APPROVED by player from Level8 Geometry Guide V1.**
- exact logical centers:
  - T1 **(115, 114)**
  - T2 **(289, 156)**
  - T3 **(142, 211)**
  - T4 **(269, 272)**
  - T5 **(104, 313)**
  - T6 **(267, 386)**
  - T7 **(113, 421)**
  - T8 **(342, 462)**
- preserve the approved relative ordering and side-of-road placement; do not redistribute pads for convenience.
- no tower slot should sit inside a wetland pocket or behind a major foreground prop.

## Special zones
- **3 wetland pockets**, all sharing the global tide state.
- These are measured as irregular on-path floodable polygons following the visibly wet/marsh-adjacent roadway rather than generic rectangles/ellipses.
- Wetland A — upper-right bend:
  - polygon: **[(292,121), (325,126), (348,141), (350,166), (334,189), (305,199), (285,186), (292,161)]**
- Wetland B — middle S basin:
  - polygon: **[(166,238), (202,231), (235,247), (252,273), (248,301), (222,319), (186,314), (168,287)]**
- Wetland C — lower bend:
  - polygon: **[(172,399), (210,395), (250,409), (283,433), (294,459), (280,485), (247,499), (225,477), (225,449), (198,428)]**
- Polygon membership is the gameplay wetland test. Visual tide VFX must feather inside/around these contours and must not draw hard polygon outlines.

## Environment Motion Lite anchors
- Budget: **4 subtle motions**, all measured from visible background features in the normalized 390×610 logical map.
- **M1 — ground fog drift**
  - bounds: **x=8, y=147, w=86, h=66**
  - feature: left-side low marsh basin around the half-submerged stone head / dead roots.
  - motion: slow horizontal drift + opacity breathing only; no bright glow.
- **M2 — water ripple**
  - bounds: **x=205, y=124, w=78, h=55**
  - feature: central open pool around the wrecked boat / lily pads.
  - motion: sparse expanding ripple arcs with long idle gaps; keep them below enemy/projectile contrast.
- **M3 — bubble clusters**
  - bounds: **x=304, y=210, w=69, h=63**
  - feature: right-middle marsh pool beside the wooden bridge / posts.
  - motion: occasional 2–4 small bubbles rising and fading locally; no continuous particle fountain.
- **M4 — reed micro-sway**
  - bounds: **x=247, y=287, w=52, h=46**
  - feature: clear reed cluster beside the middle-lower road bend.
  - motion: very small low-frequency sway, phase-offset across 2–3 reed groups; no whole-patch translation.
- These anchors are presentation-only and do not define gameplay wetland membership; gameplay uses the three frozen wetland polygons above.
- Keep all four motions low-frequency and low-luminance. They must not resemble attack telegraphs, tide activation boundaries, tower range indicators, or Boss skills.
- Do not invent additional motion locations during implementation unless runtime readability proves one of these unusable; any replacement must remain tied to a visible background feature and must not alter gameplay geometry.

## Anchor / footprint notes
- Background generation must leave the route and tower-slot candidate land visually readable at phone scale.
- Avoid large foreground reeds/trees covering the centerline.
- Avoid high-contrast decorative objects directly under expected enemy silhouettes.
- Geometry measurement begins only after the player approves the actual background candidate.

## Runtime label placement
- Player reconfirmed **Level8 Geometry Guide V1** as the sole geometry source of truth.
- Fresh image registration between Geometry Guide V1 and the clean approved background found a **~48 source-pixel vertical offset**: the guide's map content sits lower than the clean runtime background. At 390×610 this equals **~19 logical px**.
- Therefore all guide-derived background-registered Y coordinates (Spawn/path/Base/T1–T8/wetland polygons/Motion Lite anchors) are corrected by **Y -19**. X registration is effectively unchanged.
- Level8 runtime base-name text must be centered **below the canonical Base waypoint**, not pinned to the map's lower-right corner.

## Approval / runtime verification
- Map/display composition contract: **FROZEN**
- Route shape / Spawn-Base arrangement / T1–T8 composition: **PLAYER APPROVED**
- Exact measured geometry: **FROZEN FROM APPROVED GUIDE + BACKGROUND**
- Runtime/player smoke: pending; only runtime overlay evidence may justify sub-pixel/interpolation refinement without changing the frozen route.

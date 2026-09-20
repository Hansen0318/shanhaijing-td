# Level7 — Geometry Contract

> Canonical geometry lives here once player-approved. Candidate values below come from Geometry Guide V1 and must not be implemented as final until the player confirms/corrects the overlay.

## Status

**GEOMETRY GUIDE V1 / PLAYER CORRECTION PENDING**

## Logical map

- Width: **390**
- Height: **610**
- Background source: player-approved clean 雷澤天野 background generated 2026-09-20
- Crop contract: minimal center crop to the established 390:610 aspect, then runtime scale to 390×610
- Geometry Guide: `level7_geometry_guide_v1.png` (conversation artifact; candidate overlay only)

## Candidate enemy centerline — V1

Ordered candidate anchors, 390×610 logical coordinates:

```
(18,61)
(55,82)
(104,96)
(154,109)
(207,131)
(250,158)
(267,190)
(241,215)
(199,238)
(155,261)
(130,284)
(151,309)
(195,332)
(239,356)
(271,381)
(260,408)
(225,431)
(201,455)
(220,478)
(265,501)
(309,523)
(341,548)
(354,570)
```

- Spawn candidate: **(18,61)**
- Base candidate: **(354,570)**
- Path smoothing: **pending player correction / implementation audit**

These coordinates are deliberately not canonical yet.

## Candidate tower-slot centers — V1

- T1: **(139,78)**
- T2: **(291,122)**
- T3: **(131,160)**
- T4: **(95,257)**
- T5: **(281,247)**
- T6: **(289,352)**
- T7: **(136,420)**
- T8: **(253,463)**

Player review must confirm that the logical centers match the visible baked stone platforms and that later UI/hit areas will not be blocked.

## Candidate thunder regions — V1

Candidate overlay bounds:

- Thunder A: **x=170..245, y=120..164**
- Thunder B: **x=154..235, y=367..416**

The exact gameplay hit region may be refined after player correction. The background lightning veins are only landmarks; active animation remains procedural.

## Procedural thunder presentation

Approved presentation:
1. idle: low-frequency subtle electric flow / alpha shimmer;
2. charge: **0.9s** localized brightness ramp + small branching arcs;
3. pulse: short localized electric burst / expanding ring;
4. return to idle.

No full-screen flash. No rapid strobe. No dedicated animation PNG/sprite-sheet required.

## Sprite / anchor notes

- 欽原: pending final runtime asset
- 諸懷: pending final runtime asset
- 夔: pending final runtime asset
- Enemy/Boss path-facing mirror is inherited from shared AGENTS.md contract.
- Tower target-facing mirror is inherited from shared AGENTS.md contract.

## Player correction procedure

1. Review Geometry Guide V1.
2. Correct the yellow centerline first; the line should follow the visible road center.
3. Correct Spawn/Base if needed.
4. Correct T1–T8 centers if any marker is off the baked platform center.
5. Correct 雷脈 A/B bounds if the gameplay region should cover a different road segment.
6. Chat converts the correction into 390×610 logical values and produces Geometry Guide V2.
7. Only after player approval are the corrected values marked **CANONICAL / PLAYER APPROVED**.

## Rules

- Geometry must be measured against the approved runtime background/crop.
- Phone screenshots may report mismatches but are not coordinate sources.
- Background/path/Spawn/Base/slots/zones are one contract; a material change requires re-validation of affected coordinates.
- Motion offsets must not mutate gameplay path coordinates.
- Once player-approved, record approval state/date and never re-guess the path in a new Chat/Work session.

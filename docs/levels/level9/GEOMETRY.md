# Level9 — Geometry Contract

## Status
**PLAYER-APPROVED REGISTERED GEOMETRY / PROGRAM COORDINATE SOURCE**

This file is the canonical coordinate source for Level9 map implementation.

The player manually corrected the route on the Level9 registration overlay and approved the final corrected version on 2026-09-25. The route below was measured back into the **390×610 logical coordinate system** from that approved overlay. Future runtime code must use these coordinates rather than the superseded Guide V1 route.

## Logical map / registration

- logical battlefield: **390×610**
- approved reference background dimensions: **1024×1536**
- registration transform:
  - logicalX = sourceX × **390 / 1024**
  - logicalY = sourceY × **610 / 1536**
- coordinate origin: upper-left
- runtime background target when normalized at 2× logical size: **780×1220**
- the final clean runtime background must preserve this registration; removing overlay labels/guide graphics must not recompose or reposition roads, tower pads, Spawn/Base architecture, or the celestial shrine.

## L9-G100 — Final player-approved enemy centerline

Spawn: **(39,68)**

Base: **(343,516)**

Ordered runtime waypoints:

1. **(39,68)**
2. **(45,77)**
3. **(50,89)**
4. **(64,101)**
5. **(77,113)**
6. **(101,125)**
7. **(166,137)**
8. **(228,149)**
9. **(261,161)**
10. **(284,173)**
11. **(298,185)**
12. **(314,197)**
13. **(323,208)**
14. **(329,220)**
15. **(336,232)**
16. **(340,244)**
17. **(343,256)**
18. **(344,268)**
19. **(344,280)**
20. **(342,292)**
21. **(340,304)**
22. **(335,316)**
23. **(329,328)**
24. **(318,340)**
25. **(309,351)**
26. **(287,363)**
27. **(252,375)**
28. **(171,387)**
29. **(120,399)**
30. **(117,411)**
31. **(123,423)**
32. **(143,435)**
33. **(175,447)**
34. **(214,459)**
35. **(247,471)**
36. **(264,483)**
37. **(285,494)**
38. **(309,506)**
39. **(327,518)**
40. **(343,516)**

### Implementation-ready form

```js
waypoints: [
  { x: 39, y: 68 },
  { x: 45, y: 77 },
  { x: 50, y: 89 },
  { x: 64, y: 101 },
  { x: 77, y: 113 },
  { x: 101, y: 125 },
  { x: 166, y: 137 },
  { x: 228, y: 149 },
  { x: 261, y: 161 },
  { x: 284, y: 173 },
  { x: 298, y: 185 },
  { x: 314, y: 197 },
  { x: 323, y: 208 },
  { x: 329, y: 220 },
  { x: 336, y: 232 },
  { x: 340, y: 244 },
  { x: 343, y: 256 },
  { x: 344, y: 268 },
  { x: 344, y: 280 },
  { x: 342, y: 292 },
  { x: 340, y: 304 },
  { x: 335, y: 316 },
  { x: 329, y: 328 },
  { x: 318, y: 340 },
  { x: 309, y: 351 },
  { x: 287, y: 363 },
  { x: 252, y: 375 },
  { x: 171, y: 387 },
  { x: 120, y: 399 },
  { x: 117, y: 411 },
  { x: 123, y: 423 },
  { x: 143, y: 435 },
  { x: 175, y: 447 },
  { x: 214, y: 459 },
  { x: 247, y: 471 },
  { x: 264, y: 483 },
  { x: 285, y: 494 },
  { x: 309, y: 506 },
  { x: 327, y: 518 },
  { x: 343, y: 516 },
]
```

Rules:
- runtime may interpolate/densify only to smooth motion along this exact centerline;
- do not replace the lower hairpin with a straight diagonal;
- do not restore the superseded Guide V1 top/lower route;
- if smoothing cuts across the visible road, add local interpolation density rather than moving these approved anchors;
- Spawn and Base endpoints above are part of the path contract.

## L9-G110 — Final tower-slot centers

- T1: **(125,106)**
- T2: **(264,142)**
- T3: **(292,233)**
- T4: **(352,333)**
- T5: **(216,324)**
- T6: **(106,250)**
- T7: **(88,374)**
- T8: **(288,461)**

### Implementation-ready form

```js
slots: [
  { x: 125, y: 106 },
  { x: 264, y: 142 },
  { x: 292, y: 233 },
  { x: 352, y: 333 },
  { x: 216, y: 324 },
  { x: 106, y: 250 },
  { x: 88, y: 374 },
  { x: 288, y: 461 },
]
```

Tower rules:
- these centers correspond to the player-approved visible tower-pad centers;
- runtime slot marker / touch target must remain centered on these coordinates;
- do not move a slot merely to simplify implementation;
- background cleanup must preserve the visible pad centers.

## L9-G120 — Spawn / Base / celestial anchor

- Spawn: **(39,68)**
- Base: **(343,516)**
- central 晝夜 celestial anchor: **(203,251)**

Spawn/Base presentation:
- both locations must retain a visible architectural/portal identity;
- they are not text-only markers;
- final runtime text labels, if any, are program-rendered and must not be the sole identification method.

Central anchor:
- principal localized 晝相／夜相 visual landmark;
- runtime day/night presentation must register to this position;
- the static background must not bake the actual gameplay state cue into a permanent state.

## L9-G130 — Approved overlay evidence

Player-approved route correction history:
1. first generated overlay was rejected because route did not follow the road;
2. player corrected the upper Spawn entry;
3. player corrected the lower-left hairpin and lower road with hand-drawn red guidance;
4. corrected overlay was shown again;
5. player explicitly confirmed **「好這個可以」**;
6. this file records the coordinates measured from that accepted overlay.

The accepted route therefore supersedes all earlier Level9 Guide V1 path values.

## L9-G140 — Runtime registration acceptance

Before Gate D is considered fully closed for production art:
- create/retain a **clean background** with the same composition but without debug route/coordinate labels;
- overlay these exact program coordinates on that clean file deterministically;
- verify road-center / pad-center / Spawn / Base / shrine registration remains visually matched;
- any cleanup/edit that materially shifts the composition invalidates the clean runtime candidate and must be redone.

Production implementation later must use this file as the source of truth.

## L9-G150 — Motion Lite candidates

Exact environment anchors are still deferred until the clean runtime background is finalized.

Candidate family:
- high-altitude cloud drift;
- restrained banner/ribbon sway where visibly present;
- subtle celestial-disc/corona breathing around **(203,251)**;
- sparse ember/star drift.

Motion Lite is presentation-only unless SPEC explicitly defines gameplay.

## Superseded geometry

The following Level9 values are no longer valid and must not be implemented:
- Spawn **(20,70)**
- Base **(375,550)**
- T1–T8 **(110,150), (250,95), (285,265), (375,365), (230,330), (165,300), (90,410), (330,430)**
- central anchor **(220,260)**
- the 20-anchor Guide V1 route previously recorded before background/player correction.

## Verification ownership
- canonical coordinate contract: **STATIC / PLAYER APPROVED**
- deterministic overlay on clean runtime background: **STATIC + PLAYER VISUAL APPROVAL**
- runtime smoothing/no corner cut: **TARGETED_TEST + PLAYER_SMOKE**
- slot touch/readability: **PLAYER_SMOKE**

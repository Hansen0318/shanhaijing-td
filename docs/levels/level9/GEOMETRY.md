# Level9 — Geometry Contract

## Status
**GAMEPLAY GEOMETRY GUIDE V1 DEFINED / BACKGROUND REGISTRATION PENDING**

Level9 now uses a gameplay-first geometry workflow. The path and tower layout are defined independently of background art first. The production background must be created to follow this guide; the guide must not be distorted later merely to fit an AI-generated background.

This V1 guide is engineering-defined and passes static spacing/turn/readability checks. It is not yet the final production-background registration freeze.

## Logical map
- logical width: **390**
- logical height: **610**
- road width target: **54 logical px**
- production runtime target after art approval: **780×1220** where the existing 2× asset convention is used
- coordinate origin: upper-left
- exact production background file: pending
- source dimensions/crop: pending until production background exists
- source→logical registration transform: pending until production background exists

## L9-G100 — Gameplay Geometry Guide V1

### Spawn / Base
- Spawn centerline entry: **(20,70)**
- Base endpoint: **(375,550)**

The road intentionally enters/exits the logical edge region so sprites transition naturally from off-map/on-map space.

### Ordered enemy centerline
1. **(20,70)**
2. **(70,75)**
3. **(125,90)**
4. **(180,115)**
5. **(235,145)**
6. **(290,180)**
7. **(330,220)**
8. **(345,265)**
9. **(340,310)**
10. **(315,350)**
11. **(275,380)**
12. **(225,395)**
13. **(175,390)**
14. **(140,370)**
15. **(155,420)**
16. **(200,450)**
17. **(255,470)**
18. **(310,490)**
19. **(350,520)**
20. **(375,550)**

Composition intent:
- upper-left entry;
- broad clockwise broken-ring sweep around the central celestial shrine;
- no self-crossing;
- ring breaks on the lower-left/lower-middle side;
- route then exits diagonally toward the lower-right Base;
- visibly distinct from Level7 lightning-Z and Level8 broad asymmetric S/meander.

### Static geometry checks
- approximate centerline length: **~997 logical px**
- segment lengths are moderate; no single extreme jump is used as a fake curve
- smallest internal turn remains broad enough for interpolation without a hairpin reversal
- runtime smoothing may densify/interpolate the approved centerline, but must not move the designed bends or cut through the central shrine

## L9-G110 — Tower-slot centers

- T1: **(110,150)**
- T2: **(250,95)**
- T3: **(285,265)**
- T4: **(375,365)**
- T5: **(230,330)**
- T6: **(165,300)**
- T7: **(90,410)**
- T8: **(330,430)**

Static validation:
- nearest tower-center → road-center distance range: **~51–74 px**
- with road width 54 (27 px half-width), slots remain separated from the road body rather than sitting on it
- nearest tower-to-tower center distance: **~72 px**
- every slot remains close enough to meaningful route segments for the established tower ranges (~125–170 px) to matter
- slots are split across inner/outer sides of the route; no single side owns all useful positions

Runtime/visual acceptance later:
- production art must provide a readable buildable pad/ground area around each center
- slot art/touch target must remain centered at the frozen center
- production props may not cover or visually merge a slot with the road
- if background generation cannot respect these locations, reject/regenerate the background rather than moving the slots casually

## L9-G120 — Central 晝夜 celestial anchor
- anchor center: **(220,260)**
- reserved visual shrine radius target: **46 px**
- nearest road-center distance: **~105 px**

Purpose:
- primary localized 晝相／夜相 visual landmark
- sufficient separation from enemy silhouettes and route body
- background must leave this area visually dominant but must not bake the actual combat telegraph/state effect into static art

## L9-G130 — Background production contract
The production background must be authored/generated **from this Gameplay Geometry Guide V1**.

Required:
1. road surface follows the L9-G100 centerline and 54 px gameplay corridor;
2. upper-left entry and lower-right Base region remain visually compatible with the frozen endpoints;
3. visible buildable surfaces/pads exist around T1–T8;
4. central shrine is centered on/registered to L9-G120;
5. no major foreground prop blocks the road, a tower center, Spawn/Base, or the shrine anchor;
6. no bright static state telegraph is baked into the art.

After a candidate exists:
1. record exact source dimensions;
2. record crop/normalization;
3. derive explicit source→390×610 transform;
4. overlay **this same guide** on the exact clean candidate;
5. measure registration error;
6. if the art materially misses the guide, regenerate/correct the art;
7. only small registration refinement is allowed after art approval;
8. obtain player approval before changing status to CANONICAL / FROZEN.

The background does **not** define the path. It must conform to the approved gameplay geometry.

## L9-G140 — Motion Lite candidates
Exact anchors remain pending production art, because Motion Lite must attach to visible art features.

Candidate family:
- high-altitude cloud drift;
- restrained banner/ribbon sway where such props are actually present;
- subtle celestial-disc/corona breathing around L9-G120;
- sparse ember/star drift.

Final Motion Lite anchors must be measured from the approved production background and remain presentation-only unless SPEC explicitly defines gameplay.

## Rejected / non-canonical
- The previously generated ornate fantasy background and the later hand-drawn overlay are **style/concept references only**.
- Their visible roads, pads, shrine placement and manually drawn blue route are **not geometry evidence** and must not be used for production measurement.
- Do not re-derive coordinates from those images.

## Approval / verification state
- map concept: **PLAYER APPROVED**
- Gameplay Geometry Guide V1: **ENGINEERING DEFINED / STATIC CHECK PASS**
- production background: **PENDING**
- exact source→logical registration: **PENDING**
- registered overlay on production background: **PENDING PLAYER APPROVAL**
- final geometry freeze: **NOT YET**

# Level7 — Geometry Contract

> This file is the canonical geometry source for Level7. New Chat / Work sessions must not re-guess these coordinates from screenshots or regenerate the route.

## Status

**CANONICAL / PLAYER APPROVED — Geometry Guide V3 (2026-09-20)**

The player explicitly approved the final Geometry Guide V3 path after correcting Spawn entry, Base endpoint, and two route turns.

## Logical map

- Width: **390**
- Height: **610**
- Geometry source image: approved Geometry Guide V3
- Source guide dimensions used for measurement: **1004×1567**
- Logical transform:
  - x = sourceX × 390 / 1004
  - y = sourceY × 610 / 1567
- Background: player-approved clean Level7 雷澤天野 background
- Runtime contract: preserve this background/crop relationship; do not re-crop independently after implementation.

## L7-G100 — Canonical enemy centerline

Ordered 390×610 logical anchors:

```
(40,34)
(45,77)
(81,93)
(124,106)
(165,120)
(183,128)
(190,147)
(224,157)
(259,181)
(251,206)
(199,230)
(156,249)
(169,269)
(209,291)
(242,308)
(241,331)
(200,353)
(178,375)
(195,391)
(226,405)
(263,425)
(307,450)
(323,480)
(343,497)
```

- **L7-G101 Spawn logical entry:** **(40,34)**
- **L7-G102 Base logical endpoint:** **(343,497)**

Notes:
- The path starts from the player-corrected upper entry, not from the decorative Spawn label marker.
- The path terminates at the player-circled glowing altar/core center, not at the lower UI label.
- The two player-corrected turns around 雷脈 A and the mid/lower fold are represented in the ordered anchors above.
- Runtime interpolation/smoothing must remain close to the approved centerline and must not cut across terrain at the zigzag turns.
- If implementation smoothing visibly cuts corners, increase local anchor density rather than moving the approved route.

## L7-G110 — Canonical tower-slot centers

390×610 logical centers:

- T1: **(138,78)**
- T2: **(294,124)**
- T3: **(135,161)**
- T4: **(97,259)**
- T5: **(287,249)**
- T6: **(293,358)**
- T7: **(138,423)**
- T8: **(258,464)**

These centers correspond to the baked circular stone platforms in the approved background.

Runtime acceptance:
- visual slot marker must remain centered on the baked platform;
- touch/hit area must remain usable at 390px / 390×700;
- no Preparation/UI overlay may block a slot;
- range overlays may not be used to justify silently moving a canonical slot.

## L7-G120 — Canonical thunder regions

390×610 logical candidate/interaction rectangles derived from the approved V3 guide:

- Thunder A: **x=187, y=116, width=63, height=42**
- Thunder B: **x=153, y=360, width=66, height=49**

These are the canonical initial gameplay regions for implementation.

Rules:
- background lightning veins are landmarks only;
- idle/charge/pulse animation is procedural;
- gameplay checks use the logical region, not sampled image brightness;
- if runtime/player smoke shows the visible lightning landmark and gameplay region feel misaligned, correct only the narrow region bounds and record the revision here before release.

## L7-G130 — Procedural thunder presentation

Approved sequence:

1. idle — subtle low-frequency electric flow / alpha shimmer;
2. charge — **0.9s** localized brightness ramp + small branching arcs;
3. pulse — short localized electric burst / expanding ring;
4. return to idle.

Constraints:
- no full-screen white flash;
- no rapid strobe;
- A/B state must correspond to gameplay state;
- Boss P2 A+B triggers both regions in the same discrete event;
- no dedicated animation PNG or sprite sheet.

## L7-G140 — Facing / motion inheritance

- Enemy/Boss path-facing mirror uses the shared inherited facing contract.
- Towers, including 句芒, use shared target-facing mirror and retain facing after attack.
- Motion Lite is inherited.
- Render-only motion must not mutate gameplay coordinates/pathDistance.

## Geometry verification ownership

- Static coordinate contract: **STATIC**
- Runtime path interpolation / no corner-cutting: **TARGETED_TEST + PLAYER_SMOKE**
- Tower slot touch/readability at 390px / 390×700: **PLAYER_SMOKE**
- Thunder visual/gameplay alignment: **PLAYER_SMOKE**
- Shared facing behavior regression: **TARGETED_TEST**

## Change control

This geometry is now frozen.

Do not:
- re-measure from a later screenshot;
- generate a new route because a new Chat/Work session starts;
- let Work invent alternate anchors;
- move tower slots for convenience.

A revision requires either:
- explicit player request; or
- runtime evidence of a concrete mismatch.

Any revision must be recorded here and in `STATE.md` before implementation continues.

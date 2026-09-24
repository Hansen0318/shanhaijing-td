# Level8 Retrospective — Why post-release fixes accumulated, and what Level9 must do differently

## Purpose

Level8 is now player-accepted. This retrospective converts the repeated Level8 corrections into permanent development safeguards so Level9+ should reach player acceptance with materially fewer post-release edits.

This file is not a bug log. It is a reusable pre-production and verification contract.

## What caused the repeated Level8 changes

### 1. Approved guide and production background were not registered as one coordinate system

The largest visual defect was not eight independent tower/path mistakes. Geometry Guide V1 and the clean production background had a fixed vertical registration difference of about 48 source pixels, approximately 19 logical pixels on the 390×610 battlefield.

Because path, Spawn/Base, tower slots, wetland polygons and Motion Lite anchors all came from the same guide-space measurements, they all drifted together.

**Root lesson:** never freeze coordinates from a guide until the exact production background asset, crop and scale transform have been applied and a guide→runtime overlay proves registration.

### 2. An incorrect comparison overlay created false confidence / false diagnosis

One intermediate comparison put 390×610 logical coordinates directly onto a 1024×1536 image without the proper transform. That made correct data appear dramatically wrong and temporarily confused the diagnosis.

**Root lesson:** visual overlays are evidence only when the coordinate transform is explicitly defined and reproducible. Every geometry overlay must state source size, crop, logical size and transform.

### 3. Automated tests verified internal consistency, not visual truth

Several tests correctly proved that runtime code matched the coordinates stored in the repository, but the stored coordinates were derived from the wrong registration. Green tests therefore did not prove that the units matched the visible road / tower pads.

**Root lesson:** for player-visible geometry, one test must verify the approved source-to-runtime transform or a generated overlay artifact, not only equality against hard-coded coordinates.

### 4. Boss HUD asset design drifted outside the established runtime footprint

Adding a Boss-name area produced a taller/differently proportioned Huashe HUD candidate. The runtime then distorted it or risked compressing the battlefield.

**Root lesson:** Boss HUD outer footprint is a frozen shared layout contract. New name panels must fit inside the existing footprint. Compare against a released Boss HUD before asset approval, not after integration.

### 5. Huashe's mechanic was designed without validating the W10 timeline

Huashe controlled the tide, but W10 originally spawned all escorts before the Boss. In real play, most escorts were already dead when Huashe arrived, so its defining interaction was effectively invisible.

**Root lesson:** a Boss mechanic that affects other enemies must be validated against the actual spawn timeline. Before freezing W10, simulate the encounter order and answer: "When the Boss uses its mechanic, are the intended targets/escorts still present?"

### 6. Motion Lite was technically present but below phone readability

Fog/ripple/bubbles/reeds existed at correct anchors after registration, but the first implementation was intentionally so subtle that the player could not reliably see it at ~390 px width.

**Root lesson:** "subtle" still needs a minimum phone-readability threshold. Motion Lite must be checked at target viewport scale before release, not only at source/background scale.

### 7. Final player-visible integration checks happened too late

Static asset approval, code tests and browser smoke all passed, but the most important integration questions—road center, tower pad center, HUD footprint, Boss mechanic readability, Motion Lite visibility—were discovered incrementally on the physical phone.

**Root lesson:** move visual integration validation earlier. The final phone pass should catch device-specific nuance, not foundational coordinate/layout/mechanic mismatches.

## Permanent guardrails for Level9+

### A. Production Background Registration Gate — before geometry freeze

Before any path/tower/special-zone coordinate is frozen:

1. identify the exact production background file;
2. freeze source dimensions, crop rectangle and runtime/logical dimensions;
3. define one explicit source→logical transform;
4. overlay path, Spawn/Base, tower slots and visual anchors onto the **actual production background** using that transform;
5. player approves this overlay;
6. only then write final coordinates into GEOMETRY.md.

Do not freeze geometry from a guide-only image and assume it registers to a separate clean background.

### B. Geometry transforms must be derived, not eyeballed

Canonical geometry must record:
- source image dimensions;
- crop;
- runtime/logical canvas dimensions;
- transform formula;
- any fixed registration offset and why it exists.

If the final production background changes, geometry and all derived visual anchors become impacted until the transform is revalidated.

### C. Runtime overlay preflight before implementation handoff

Before Work receives a new level package, Chat should produce/review a static overlay of:
- path centerline;
- Spawn/Base;
- T1–T8;
- special gameplay zones;
- Motion Lite anchors;
on the exact runtime background candidate.

If the overlay is not visibly correct, Work implementation must not start.

### D. Boss HUD fixed-footprint preflight

Before approving a new Boss HUD:
- compare its source aspect and intended runtime box to a released Boss HUD;
- preserve the established outer runtime footprint;
- place Boss-name panel and empty HP channel **inside** that footprint;
- reject any asset/layout that requires extra battlefield height unless the player explicitly approves a layout change.

### E. Boss encounter timeline preflight

Before freezing W10:
- write the exact spawn order, not only aggregate counts;
- simulate or reason through the Boss/escort overlap;
- verify the Boss signature mechanic is observable while its intended supporting enemies or terrain states are relevant;
- for a controller/support Boss, ensure the mechanic changes the fight before escorts are gone.

Aggregate notation like "A×8 + B×4 + Boss×1" is insufficient when order matters.

### F. Phone-readable presentation threshold

For Motion Lite and other ambient effects:
- validate at 390 px class width;
- "subordinate to combat" does not mean "invisible";
- each required effect must be directly recognizable when the player knows where to look;
- prefer increasing amplitude/alpha/size at the approved anchor before inventing extra regions.

### G. Visual acceptance checklist before release closure

Before calling a new level release-ready, explicitly check these player-visible contracts:

- production background and geometry registration;
- path centerline;
- tower-pad centering;
- Spawn/Base placement and labels;
- normal-enemy/Boss sprite visual anchors;
- Boss HUD fixed footprint;
- Boss mechanic readability in its actual wave timeline;
- environment/special-zone readability;
- Motion Lite visibility at target phone width;
- progression/unlock presentation.

Engineering tests remain necessary, but they do not substitute for this visual checklist.

## Level8 final outcome

Level8 is accepted after:
- background/geometry registration correction;
- path/tower/Base alignment correction;
- Base label placement fix;
- enemy sprite-anchor correction;
- Huashe Boss-HUD footprint correction;
- Huashe-first W10 escort/tide interaction correction;
- Motion Lite readability tuning.

The objective for Level9 is not "no iteration". It is to catch these classes of defects **before production release**, so post-release edits are narrow rather than structural.

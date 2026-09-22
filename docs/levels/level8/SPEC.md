# Level8 — Approved Specification

> Only player-approved/frozen requirements belong here.

## Entry progression
- Level7 victory proceeds to Level8 through the existing data-driven progression flow.
- Level8 uses the player's currently owned/unlocked deployable roster.
- Exactly 3 deployables must be selected before starting the level.
- Retry returns to an empty lineup using the existing shared behavior.

## Core gameplay
- Theme: **幽冥沼澤 / 毒霧濕地**.
- Normal enemy A: **長右** — agile pressure enemy. **泥躍**: when it enters an active wetland patch, it gains a short movement burst; the same patch cannot repeatedly stack the burst.
- Normal enemy B: **蠱雕** — durable marsh predator. **沼甲**: while inside an active wetland patch it gains temporary damage mitigation, with only a short carry-over after leaving.
- Boss: **化蛇** — two-phase flood/mist controller. It manipulates the wetland state rather than receiving the normal 長右／蠱雕 wetland buffs.
- Level8 environment mechanic: **潮位 / 濕地活化**. Several map wetland pockets are normally quiet; a shared tide cycle temporarily activates them together. This is not an A/B alternation and must not visually copy Level6 sunlight or Level7 thunder zones.
- 化蛇 P1 periodically forces an early high-tide activation. P2 begins once at the Boss HP threshold to be frozen in the numerical gate, increases the forced-tide pressure, and may make all approved wetland pockets active during its surge window.
- Environment telegraph uses low-luminance ripple / drifting mist / bubble activity instead of bright rectangular or elliptical fields.
- Environment Motion Lite is a required presentation layer for Level8; exact visual effects/anchors remain blocked until the background is approved.

## New deployable unlocked by Level8 clear
- **玄龜** becomes the sixth owned deployable after the first Level8 clear through the existing data-driven unlock flow.
- Role: **潮震控場 / delayed area utility**.
- Base attacks remain readable single-target attacks.
- **潮震**: every configured number of successful attacks, create a short-delay impact pulse at the target location; the pulse deals area damage and pushes non-Boss enemies a small distance backward along the path.
- Bosses take the pulse damage but are not pushed.
- 玄龜 must not duplicate 夫諸's slow, 白澤's vulnerability/debuff role, 句芒's global attack-speed support, 畢方's every-shot explosion pattern, or 應龍's penetration role.

## Numerical baseline
- pending

## Victory / retry / next-level
- Retry/lineup behavior inherits the shared contract.
- Level8 clear unlocks one new deployable beast through the existing data-driven progression system; identity is **玄龜**.
- Level9 visibility/next-level behavior: pending future scope.

## Shared inherited requirements
- follow `AGENTS.md`;
- completed Level1–7 remain frozen unless a shared-system change materially affects them;
- Motion Lite, enemy path-facing, tower target-facing, spacing/readability, Boss HUD, progression and release contracts remain inherited;
- testing is impact-driven: targeted first, affected regressions only, full suite/browser smoke only when justified.

## Not yet approved
- numerical values for 長右／蠱雕／化蛇／玄龜;
- exact tide cadence / active duration / P2 threshold;
- exact 潮震 trigger count, radius, damage and push distance;
- wave composition;

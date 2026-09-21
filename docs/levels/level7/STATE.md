# Level7 — Current State / Handoff

> New/returning sessions must first follow `AGENTS.md`, `docs/DEVELOPMENT_PLAYBOOK.md`, `docs/WORK_PROGRESS.md`, then this file.

## Active level

- Level: **7 — 雷澤天野**
- Base: **震木神壇**
- Development phase: **ENGINEERING PASS / PUBLIC RUNTIME SMOKE PENDING**
- Active branch: `feat/level7-leize`
- Canonical folder: `docs/levels/level7/`
- Last state update: 2026-09-21

## Current gate

**RELEASE CLOSURE**

Production implementation, approved-asset integration, automated verification, and the pre-smoke checkpoint are complete. Remaining work is final branch review, reconciliation with current remote `main`, merge, GitHub Pages deployment, and public runtime verification.

## Implemented

- Exact Geometry V3 route, Spawn, Base, Thunder Vein A/B, and eight deploy slots.
- Level6 victory unlocks 句芒; Level7 presents 畢方／夫諸／應龍／白澤／句芒 as an empty 5-choose-3 roster.
- First Level7 entry shows the reusable data-driven NEW treatment for 句芒; retry clears the lineup and the one-time treatment.
- Ten Waves, 欽原／諸懷 enemy behavior, 夔 Boss phases, and the victory gate requiring both Wave completion and Boss death.
- Thunder system: Phase 1 A/B alternation, 0.9-second charge, pulses, Phase 2 A/B/A+B patterns, statuses, and 夔 immunity.
- 夔 Phase 2 behavior and Boss HUD.
- 句芒 support aura applies the strongest active attack-interval multiplier; 春生 improves that multiplier, with 青羽／神木 blessings and hybrid projectile visuals.
- Six approved Level7 assets plus the Level6 句芒 visual alias, integrated without redesign.
- Shared progression, motion, spacing, rendering, UI, dev fixtures, and browser-smoke fixtures extended for Level7.
- 夔 HUD geometry fixed from the real 1152×351 alpha channel with a 70px nine-slice and 6px border.
- Static-module cache version advanced to `level7-1` across entry points and contract tests.

## Verification evidence

- Level7/shared targeted suite: **110/110 PASS**.
- Full suite: **209/209 PASS**.
- `npm run check`: **PASS**.
- Every JavaScript file under `src/` and `tests/` passes `node --check`.
- Safe-push checkpoints through the approved art/UI integration are present locally and on the remote feature branch.
- Local cloud-browser navigation to `127.0.0.1` was blocked with `net::ERR_BLOCKED_BY_CLIENT`; no local visual or player-device PASS is claimed from that attempt.

## Bounded Red Team audit

- No gate crossing or unapproved art substitution.
- No intentional Level1–6 gameplay, geometry, or balance change.
- Level1–6 behavior remains covered by the full regression suite.
- Evidence language distinguishes automated engineering verification from runtime/player smoke.

## Do not redo

- Do not redesign Level1–6 while closing Level7.
- Do not recreate approved assets, geometry, balance, shared progression, Motion Lite, facing, spacing, Boss HUD, or attack-visual policies.
- Do not replace the shared owned/unlocked roster with a Level7-only branch.
- Do not infer canonical geometry from a screenshot; `GEOMETRY.md` remains authoritative.
- Do not claim a browser/player smoke PASS without observing the deployed runtime.

## Remaining release checks

1. Complete the final branch diff and requirement review.
2. Reconcile the remote feature head against the latest remote `main`, then merge without force-pushing.
3. Verify GitHub Pages deploys the merged `main` SHA.
4. On the public site, verify `?devMenu=1`, direct Level7 entry, the normal Level6→Level7 NEW transition fixture, 390×700 layout, eight slots, Thunder A/B behavior, 句芒 support, 夔 Phase 2, and victory.
5. Keep real-player phone smoke distinct if no physical-device test is performed.

## Next exact step

Commit and push the cache/version and handoff-documentation closure, perform the final review, merge to current remote `main`, verify Pages, and record the deployed `main` SHA and public smoke evidence.

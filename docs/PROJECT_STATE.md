# Shanhaijing TD — Project State

Last updated: 2026-09-06

## Current version

Graybox Prototype V0.01

## Source of truth

- Repository: `Hansen0318/shanhaijing-td`
- Branch: `main`
- GitHub is the canonical project source. Do not resume from an older Work sandbox copy without first syncing latest `main`.

## Current gameplay decisions

- Mobile-first vertical Web tower defense.
- Three towers: 畢方 / 夫諸 / 應龍.
- Ten fixed waves; Wave 10 includes 窮奇 Boss.
- Wave combat allows building, upgrading and selling towers using Gold earned during combat.
- Wave completion opens a Roguelike Blessing choice.
- After choosing a Blessing, the game enters an unlimited Preparation phase.
- Preparation has no automatic countdown.
- Only the player's `開始 Wave N` action starts the next wave.
- Gold remains the only combat economy resource; no extra score/mana currency should be introduced at this stage.

## Changes completed in the latest Chat handoff

1. Replaced the automatic 3-second post-Blessing countdown with an unlimited manual Preparation phase.
2. Initial preparation also waits indefinitely for the player.
3. Tower management remains enabled during combat.
4. Updated UI copy from countdown language to `配置完成後開始 Wave N` / `開始 Wave N`.
5. Moved the Boss HP HUD outside the battlefield DOM so it reserves its own layout space and does not overlay the Boss or enemies.
6. Updated mobile CSS so the Boss HUD is a separate flex item and the preparation control remains usable on narrow screens.
7. Updated README to document the new flow and expected GitHub Pages URL.
8. Updated unit tests to specify manual preparation behavior and combat-time tower management.

## Validation status

Static source review confirms the state-machine changes are present on `main`.

This Chat environment cannot execute the repository's Node test suite or launch an interactive browser instance from the connected GitHub repository. Therefore the following must still be verified by Work or another executable development environment before claiming full completion:

- `npm test`
- `npm run check`
- Manual/automated browser test at 320–430px width
- Preparation waits indefinitely after Blessing selection
- `開始 Wave N` is the only transition from Preparation to Combat
- Build / upgrade / sell work during Combat
- Gold earned during Combat immediately enables purchases/upgrades
- Boss HP HUD never overlaps 窮奇 at spawn or during movement
- Pause and 1×/2× remain compatible with Preparation and Combat states
- GitHub Pages is actually enabled and serving the current `main`

## GitHub Pages

The repository is already structured as a static site and contains `.nojekyll`. The intended public URL is:

`https://hansen0318.github.io/shanhaijing-td/`

If the URL is not live, enable GitHub Pages from `main` / root, then verify the deployed revision matches latest `main`.

## Next recommended Work task

1. Sync latest `main` first.
2. Run the full test suite and syntax checks.
3. Fix any failures caused by the new Preparation state.
4. Launch the game at mobile viewport sizes and verify the UX items above.
5. Verify/enable GitHub Pages and return the live `github.io` URL.
6. Do not add new gameplay features until the current flow passes these checks.

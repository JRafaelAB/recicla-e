# Project State

## Decisions

### AD-001: Vite + React single-file build for the recicla-E prototype
- **Date:** 2026-11-14
- **Status:** active
- **Decision:** Build with Vite + React + TypeScript and `vite-plugin-singlefile`, producing self-contained `dist/index.html` and `dist/gallery.html` via two Vite builds.
- **Why:** User choice over vanilla JS and Preact; better developer experience.
- **Consequence:** Spec NFR-02 amended: the *built* files open from disk; editing source requires `npm run build`.

## Handoff

- **Feature:** recicla-e-prototype
- **Phase:** Done. T1–T28 complete; Verifier PASS (validation.md, iteration 2).
- **Commits:** 02f2418..HEAD on local `master`; nothing pushed, no remote.
- **Deliverables:** `npm run build` → `dist/index.html`, `dist/gallery.html`.
- **Open (non-blocking):** mascot-tip Fonte and onboarding-card fact not asserted in e2e; INFO-05 e2e only on Lâmpadas; html.to.design import to be checked manually by the user; jsdom wants Node ≥22.22.2 (machine has 22.17.1).
- **Uncommitted:** `.screens/` (local screenshots).

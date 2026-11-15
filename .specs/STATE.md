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
- **Phase:** Design drafted, awaiting user approval → then Tasks.
- **Git:** user approved `git init` (local only, no push).

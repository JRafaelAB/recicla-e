# recicla-E Prototype Tasks

## Execution Protocol (MANDATORY -- do not skip)

Implement these tasks with the `tlc-spec-driven` skill: **activate it by name and follow its Execute flow and Critical Rules.** Do not search for skill files by filesystem path. The skill is the source of truth for the full flow (per-task cycle, sub-agent delegation, adequacy review, Verifier, discrimination sensor).

**If the skill cannot be activated, STOP and tell the user - do not proceed without it.**

---

**Spec**: `.specs/features/recicla-e-prototype/spec.md` (rev. 3 + AD-001)
**Design**: `.specs/features/recicla-e-prototype/design.md`
**Status**: Draft

---

## Test Coverage Matrix

> Greenfield project. Guidelines found: none - strong defaults applied. Test types were fixed in the approved design (Vitest + Playwright).

| Code Layer | Required Test Type | Coverage Expectation | Location Pattern | Run Command |
| ---------- | ------------------ | -------------------- | ---------------- | ----------- |
| Data (`src/data`) | unit | Every Mock Data row, level and CAT-R rule asserted against spec values | `src/data/*.test.ts` | `npm run test:unit` |
| Logic (`src/logic`) | unit | All branches; 1:1 to spec ACs; every listed edge case | `src/logic/*.test.ts` | `npm run test:unit` |
| Store (`src/app/store.tsx`) | unit | Every action and every state transition named in ACs | `src/app/*.test.ts` | `npm run test:unit` |
| Components (`src/components`) | component (Vitest + Testing Library, jsdom) | Every prop-driven behavior in its ACs; interaction paths | `src/components/*.test.tsx` | `npm run test:unit` |
| Screens (`src/screens`) | e2e (Playwright on built `dist/*.html`, network blocked) | Happy path + each edge/error AC of the story | `e2e/*.spec.ts` | `npm run test:e2e` |
| Gallery (`src/gallery`) | unit (fixtures) + e2e (page) | 18 inventory states, captions, same components | `src/gallery/*.test.ts`, `e2e/gallery.spec.ts` | both |
| Config / scaffold | e2e smoke | Both dist files build and load offline | `e2e/smoke.spec.ts` | `npm run test:e2e` |

## Gate Check Commands

| Gate Level | When to Use | Command |
| ---------- | ----------- | ------- |
| Quick | Tasks with unit/component tests only | `npm run typecheck && npm run test:unit` |
| Full | Tasks with e2e tests | `npm run typecheck && npm run test:unit && npm run build && npm run test:e2e` |
| Build | End of each phase | same as Full (no separate linter, per design) |

---

## Execution Plan

### Phase 1: Foundation and data

```
T1 → T2 → T3 → T4
```

### Phase 2: Pure logic

```
T5 → T6 → T7 → T8 → T9 → T10 → T11 → T12
```

(T5–T12 depend only on Phase 1; they're chained for sequential execution, and T6 needs T5's `filterPoints`.)

### Phase 3: App shell and components

```
T13 → T14 → T15 → T16 → T17 → T18
```

### Phase 4: Screens

```
T19 → T20 → T21 → T22 → T23 → T24 → T25
```

### Phase 5: Gallery and goals

```
T26 → T27 → T28
```

---

## Task Breakdown

### T1: Scaffold project and offline smoke test

**What**: `git init`; Vite + React + TS project with `vite-plugin-singlefile` building `dist/index.html` and `dist/gallery.html` in two passes; Vitest (jsdom) and Playwright configured; npm scripts `build`, `typecheck`, `test:unit`, `test:e2e`; Playwright fixture that fails on any non-`file:` request.
**Where**: project root config (`package.json`, `vite.config.ts`, `tsconfig.json`, `playwright.config.ts`, `index.html`, `gallery.html`, `e2e/fixtures.ts`, `e2e/smoke.spec.ts`, `.gitignore`)
**Depends on**: None
**Reuses**: None (greenfield)
**Requirement**: NFR-01, NFR-02

**Tools**: MCP: NONE · Skill: NONE

**Done when**:
- [x] `npm run build` produces exactly `dist/index.html` and `dist/gallery.html`, with no other assets
- [x] Smoke e2e opens both via `file://` with network blocked and finds a root element
- [x] If Vite 8 / TS 7 / Vitest 5 fail to work together, previous majors are pinned and the deviation is noted here
- [x] Gate passes: Full; 2 tests pass

**Tests**: e2e
**Gate**: full
**Commit**: `chore(scaffold): set up vite single-file build with vitest and playwright`

**Versions**: latest majors work together; no pins needed (vite 8.3.8, @vitejs/plugin-react 6.3.0, react 19.3.1, vite-plugin-singlefile 2.3.4, vitest 5.1.0, @playwright/test 1.65.1, typescript 7.0.2, @testing-library/react 16.3.3, jsdom 31.0.1). Notes: Vitest 5 has no `environmentMatchGlobs`, so `vite.config.ts` uses two `test.projects` (`unit` = node for `*.test.ts`, `dom` = jsdom for `*.test.tsx`). jsdom 31 declares Node ≥22.22.2 and the machine runs 22.17.1; npm warns but a jsdom render probe passed. `test:unit` uses `--passWithNoTests` so the gate runs before the first unit test exists.

**Status**: ✅ Complete (commit 02f2418)

---

### T2: Categories and sub-types data

**What**: `CATEGORIES`, `SUBTYPES` (14, with levels from Mock Data), `categoryLevel()` as max of sub-type levels.
**Where**: `src/data/categories.ts`
**Depends on**: T1
**Requirement**: SCALE-02

**Done when**:
- [x] Tests assert all 14 sub-type levels and the 8 category levels (2,5,4,4,3,4,3,1) exactly as in the spec
- [x] Power bank is listed under `bateria-litio`
- [x] Gate passes: Quick

**Tests**: unit · **Gate**: quick
**Commit**: `feat(data): add device categories and sub-types with danger levels`

**Status**: ✅ Complete (commit f81e358)

---

### T3: Collection points data

**What**: `POINTS` (10) with name, neighborhood, fictional address, phone `(31) 3000-00NN`, distance, accepted sub-types, hours, map coordinates.
**Where**: `src/data/points.ts`
**Depends on**: T2
**Requirement**: Mock Data, PT-04, PT-05

**Done when**:
- [x] Test asserts the derived category acceptance list from the spec (pilhas 1,2,3,6,7,8 … cabos 1,2,4,6,7,10)
- [x] Test asserts distances are unique and match the table; point 7 accepts all 14 sub-types; only 7 accepts `bateria-automotiva`
- [x] Gate passes: Quick

**Tests**: unit · **Gate**: quick
**Commit**: `feat(data): add fictional belo horizonte collection points`

**Notes**: `map` coordinates are normalized 0–100 for T16 to scale; `USER_LOCATION` (Funcionários) is exported for the user dot.

**Status**: ✅ Complete (commit b16f00e)

---

### T4: Approved content catalog

**What**: `SOURCES`, `FACTS`, `TIPS` (≥12), `GUIDES` (one per sub-type), `LEVEL_JUSTIFICATION`, `MULTIPLIABLE`, the PNRS card and the BH URPV note, all from `research.md` with `researchRef`.
**Where**: `src/data/catalog.ts`
**Depends on**: T3
**Requirement**: CAT-R1..R6, NFR-03, SCALE-03

**Done when**:
- [x] Tests: every fact has text, ≥1 sub-type, a known source with URL, and a `researchRef` (CAT-R1)
- [x] Tests: no text matches the §11 claims (e.g. "20 mil litros", "5º maior", "reciclado e reaproveitado") (CAT-R2)
- [x] Tests: `MULTIPLIABLE` equals exactly the 5 CAT-R4 values; every sub-type has a guide and ≥1 fact; ≥12 tips; URPV note present (CAT-R6)
- [x] Gate passes: Quick

**Tests**: unit · **Gate**: quick
**Commit**: `feat(data): add sourced educational content catalog`

**Notes**: 34 facts, 17 tips, 23 sources, 14 guides, 14 justifications, PNRS card, URPV note. Tips, guides, justifications and notes also carry `sourceId(s)` + `researchRef` so Fonte can render everywhere. `perUnit` exists only on the 5 CAT-R4 facts. Extra guards: every source URL must appear verbatim in research.md, and every numeric token must appear as a whole token in research.md. Spec-precision gaps: research §10 has no dedicated row for `linhabranca-outros` (its justification reuses the linha branca row); `lampada-led` has only a qualitative fact; `tv-led` and `linhabranca-outros` have only global aggregate numbers, none per unit. Research items without a URL were left out (CRT "25% chumbo no vidro", Sony/Purdue LED claim, Green Eletron storage tip).

**Status**: ✅ Complete (this commit)

---

### T5: Text normalization and point filtering

**What**: `normalize()`, `pointAcceptsCategory()`, `filterPoints()` (category OR, search on name/neighborhood/category labels, AND between them, sorted by distance then name).
**Where**: `src/logic/filter.ts`
**Depends on**: T4
**Requirement**: MAP-08..11, EDGE-03

**Done when**:
- [x] Tests: linhabranca → [5,7,9,10]; "pampulha" → [7,8]; linhabranca+"pampulha" → [7]; "xyz" → []; "lampada" and "efigenia" match accented data
- [x] Gate passes: Quick

**Tests**: unit · **Gate**: quick
**Commit**: `feat(logic): add accent-insensitive point filtering`

**Notes**: `normalize()` lives in `filter.ts` (task spec), not a separate `normalize.ts` as the design table says. Query is trimmed before matching.

**Status**: ✅ Complete

---

### T6: Nearest point per category

**What**: `nearestPointFor(categoryId)`.
**Where**: `src/logic/nearest.ts`
**Depends on**: T5
**Requirement**: ONB-09, EDGE-02

**Done when**:
- [x] Tests: celulares → 1, pilhas → 1, linhabranca → 5, tvs → 2, lampadas → 1, computadores → 2
- [x] Gate passes: Quick

**Tests**: unit · **Gate**: quick
**Commit**: `feat(logic): add nearest accepting point lookup`

**Notes**: Second arg `points` defaults to `POINTS`.

**Status**: ✅ Complete

---

### T7: Map filter state transitions

**What**: `applyHandoff`, `toggleChip`, `selectAll`, `clearFilters`.
**Where**: `src/logic/mapState.ts`
**Depends on**: T6
**Requirement**: MAP-02..07, MAP-13

**Done when**:
- [x] Tests cover: no handoff keeps state; category handoff replaces categories and clears query; reset handoff → Todos + empty; toggle select/deselect; deselecting the only chip → Todos; Todos clears; clearFilters
- [x] Gate passes: Quick

**Tests**: unit · **Gate**: quick
**Commit**: `feat(logic): add map filter state transitions`

**Notes**: Search text is kept by `toggleChip`/`selectAll` (MAP-07 only clears categories); `clearFilters()` takes no argument.

**Status**: ✅ Complete

---

### T8: Booking availability

**What**: `nextSevenDays(now)`, `isOpen(point, date)`, `slotsFor(point, date, now)`.
**Where**: `src/logic/slots.ts`
**Depends on**: T7
**Requirement**: SCH-03..05, EDGE-04

**Done when**:
- [x] Tests: 7 days start today; point 2 closed Sat/Sun; point 1 Saturday slots 08:00–11:00; weekday point 1 08:00–17:00; past slots hidden today; after closing → [] (no-slot state)
- [x] Gate passes: Quick

**Tests**: unit · **Gate**: quick
**Commit**: `feat(logic): add collection point time-slot availability`

**Notes**: `slotsFor` compares each slot start with `now` (so slots on future days always show and slots on past days all hide); `now` is a parameter, no `Date.now` inside. Local time is used for weekdays.

**Status**: ✅ Complete

---

### T9: Impact calculation

**What**: `impactFor(items)` and `sumImpact(bookings)` per CAT-R4/R5.
**Where**: `src/logic/impact.ts`
**Depends on**: T8
**Requirement**: SCH-09..11, PROF-06, PROF-07

**Done when**:
- [x] Tests: 2 celulares → "cerca de 18 g de cobre", "cerca de 7 g de cobalto"; 1 LED lamp → no multiplied line, ≥1 qualitative fact; 2 celulares + 1 fluorescente summed → cobre 18 g, cobalto 7 g, mercúrio 4 mg; wording contains "contêm" and never "recuperou"/"evitou"
- [x] Gate passes: Quick

**Tests**: unit · **Gate**: quick
**Commit**: `feat(logic): add sourced potential-impact calculation`

**Notes**: Returns `ImpactLine` objects (kind, subtypeId, categoryId, factId, text, sourceId, researchRef); `sumImpact` returns `{totals, qualitative}` (totals grouped per sub-type value, qualitative = one fact per booked category for PROF-07). Quantity scaling (mg/g/kg) is private here and moves to `format.ts` in T12.

**Status**: ✅ Complete

---

### T10: Auth validation

**What**: `validateLogin`, `validateSignup`, `nameFromEmail`.
**Where**: `src/logic/auth.ts`
**Depends on**: T9
**Requirement**: AUTH-04..06, AUTH-11

**Done when**:
- [x] Tests assert the three exact error messages, valid cases, and `nameFromEmail("ana@x.com") === "ana"`
- [x] Gate passes: Quick

**Tests**: unit · **Gate**: quick
**Commit**: `feat(logic): add login and sign-up validation`

**Notes**: Error map keys: `nome`, `email`, `password`; empty map = valid. Whitespace-only nome counts as empty.

**Status**: ✅ Complete

---

### T11: Persistent storage with memory fallback

**What**: `createStorage(backend?)` with `load/save/clear`, shape validation, and fallback to memory.
**Where**: `src/logic/storage.ts`
**Depends on**: T10
**Requirement**: EDGE-01, PROF-03..05

**Done when**:
- [x] Tests: round-trip; corrupt JSON → defaults; throwing backend → memory works; clear removes everything
- [x] Gate passes: Quick

**Tests**: unit · **Gate**: quick
**Commit**: `feat(logic): add local storage with in-memory fallback`

**Notes**: Exports `Booking`, `Persisted`, `StorageBackend`, `DEFAULT_PERSISTED`, `STORAGE_KEY`. Memory mirrors every save, so a backend that fails mid-session keeps the latest state.

**Status**: ✅ Complete

---

### T12: pt-BR formatting

**What**: `km()`, `quantity()` (mg/g/kg), `dayLabel()`.
**Where**: `src/logic/format.ts`
**Depends on**: T11
**Requirement**: MAP-11, SCH-03

**Done when**:
- [x] Tests: `km(0.8)` → "0,8 km"; `km(12.3)` → "12,3 km"; quantity formats; day labels in pt-BR
- [x] Gate passes: Quick

**Tests**: unit · **Gate**: quick
**Commit**: `feat(logic): add pt-BR formatters`

**Notes**: `dayLabel(date)` returns "Seg, 16/11" (spec-precision gap: spec gives no day-label format; chosen abbreviated pt-BR weekday + dd/mm). `quantity(value, unit)` auto-scales mg/g/kg; `impact.ts` now uses it instead of its private copy. Phase 2 Build gate passed: 166 unit + 2 e2e.

**Status**: ✅ Complete

---

### T13: App store and clock

**What**: `AppState`, pure `reducer`, `AppProvider` persisting through `storage.ts`, `useApp`, and `ClockContext`.
**Where**: `src/app/store.tsx`
**Depends on**: T12
**Requirement**: AUTH-02, AUTH-07..11, ONB-04..09, ONB-12..13, NAV-02..03, PROF-03..05, SCH-07

**Done when**:
- [x] Reducer tests: login routes to onboarding or home; signup stores name; answerCard; skip; navigate/back keeps map state; book; logout keeps data; resetDemo clears
- [x] Gate passes: Quick

**Tests**: unit · **Gate**: quick
**Commit**: `feat(app): add app store with persistence and navigation stack`

**Notes**: Extra actions beyond the design list: `switchTab(home|learn|profile)` (replaces the stack with the tab root), `openMap(handoff?)` (ONB-08/12/13, NAV-03, PROF-02, INFO-06), `dismissTip`. `book` replaces the schedule entry with `celebration {bookingId}`, so back from the celebration returns to the point detail. Answering the 8th card sets `onboarding.done` and opens `onboardingSummary`; the current card = first unanswered category. `ClockContext`/`useClock` live in `store.tsx` (task), not `clock.ts` (design). The provider clears the storage key when the persisted slice equals the defaults (PROF-05). Spec-precision gap: TIP-02 "until the home map is opened again". Chosen: tab switch to Mapa or `openMap` reopens the tip; `back` from a point detail does not. Gate: 200 unit/component tests.

**Status**: ✅ Complete

---

### T14: Theme and UI primitives

**What**: `theme.css` (Duolingo-like tokens) and `ui.tsx` with Button (3D), Chip, Stepper, Balloon, InfoIcon, FonteNote, FictionalBadge, TabBar, Mascot (SVG), Confetti.
**Where**: `src/components/ui.tsx` (+ `src/components/theme.css`)
**Depends on**: T13
**Requirement**: SCH-02, TIP-02..04, NAV-01, PT-05

**Done when**:
- [x] Component tests: Stepper bounds 0–20 with disabled ends; Balloon closes on ✕ and on an outside tap; TabBar marks the active tab; FictionalBadge text
- [x] Gate passes: Quick

**Tests**: component · **Gate**: quick
**Commit**: `feat(ui): add theme and shared ui primitives`

**Notes**: `theme.css` is imported by `ui.tsx`, so any consumer of a primitive gets the tokens. Balloon closes on `pointerdown` outside; `dismissOnOutside={false}` lets the mascot tip close only on ✕ (TIP-02); `boundaryRef` keeps the ⓘ trigger from counting as outside. Stepper buttons are labelled "Diminuir/Aumentar {label}", value has test id `stepper-value`. TabBar ids: home/learn/profile, active tab has `aria-current="page"`. FonteNote renders "Fonte: {source name}" linking the URL (no request unless clicked). Mascot (`pose`: idle/talking/celebrating) and Confetti are visual only, not unit-tested. Gate: 214 tests.

**Status**: ✅ Complete

---

### T15: Danger scale component

**What**: `DangerScale` with 5 segments, emoji, label, and a justification balloon on tap.
**Where**: `src/components/DangerScale.tsx`
**Depends on**: T14
**Requirement**: SCALE-01, SCALE-03

**Done when**:
- [x] Tests: level 4 → 4 filled segments, 😨, "Muito alto"; tap shows the justification + "Escala educativa recicla-E: toxicidade + risco de fogo"
- [x] Gate passes: Quick

**Tests**: component · **Gate**: quick
**Commit**: `feat(ui): add emoji danger scale`

**Notes**: Props `{level, label, justification, sourceId?, compact?}`; screens pass `LEVEL_JUSTIFICATION[subtypeId]` (for a category, the justification of its highest-level sub-type). Exports `DANGER_LEVELS` and `SCALE_NOTE`. The balloon shows a FonteNote when `sourceId` is given. Level colors: `--lvl-1..5` in theme.css. Spec-precision gap: SCALE-01 says "the level's color" but the spec defines no colors; chosen green → lime → yellow → orange → magenta. Gate: 222 tests.

**Status**: ✅ Complete

---

### T16: Illustrated BH map

**What**: `BHMap` SVG (Pampulha lagoon, Serra do Curral, avenues), user dot, pins with click, optional dashed route, `mini` variant.
**Where**: `src/components/BHMap.tsx`
**Depends on**: T15
**Requirement**: MAP-01, ONB-10, PT-06

**Done when**:
- [x] Tests: renders exactly the given pins and user dot; clicking a pin calls back with its id; the route path is present only when `routeTo` is set
- [x] Gate passes: Quick

**Tests**: component · **Gate**: quick
**Commit**: `feat(ui): add illustrated belo horizonte map`

**Notes**: Props `{points, onPinClick?, routeTo? (point id), mini?, highlight? (CategoryId[]), selectedId?}`. viewBox `0 -8 100 106` over the 0–100 point coordinates; the `mini` variant zooms its viewBox to the pins + user dot and hides labels. Pins are `role=button` groups with test id `pin-{id}`, named "{name}, {neighborhood}", and respond to click and Enter. Pin emoji/color: the first `highlight` category the point accepts, else ♻️ green. Route: test id `route`, dashed quadratic path from `USER_LOCATION` to the point. User dot: test id `user-dot`, pulsing. Landmarks: Lagoa da Pampulha, Serra do Curral, Av. Afonso Pena, Av. do Contorno, Av. Antônio Carlos, Av. Cristiano Machado, Av. Amazonas; one label per neighborhood plus Funcionários. Gate: 231 tests.

**Status**: ✅ Complete

---

### T17: Swipe card

**What**: `SwipeCard` with pointer drag (±100 px threshold), exit animation, and a lock during the animation.
**Where**: `src/components/SwipeCard.tsx`
**Depends on**: T16
**Requirement**: ONB-04, ONB-05, ONB-07

**Done when**:
- [x] Tests: drag right past the threshold → `onAnswer('tenho')`; left → `'nao'`; below the threshold → snaps back with no answer; a second answer during the animation is ignored
- [x] Gate passes: Quick

**Tests**: component · **Gate**: quick
**Commit**: `feat(ui): add swipeable onboarding card`

**Notes**: SwipeCard renders its own ✕ "Não tenho" / ✅ "Tenho" buttons so taps and drags share one lock (ONB-07); buttons are disabled while the card exits. `onAnswer` fires after `EXIT_MS` (280 ms) via a timer (jsdom fires no transitionend); the card then resets, so the parent can reuse it or remount with a new `key`. Exports `SWIPE_THRESHOLD` (100), `EXIT_MS`, `SwipeAnswer`. Test id `swipe-card`, `data-exiting` while animating. Gate: 240 tests.

**Status**: ✅ Complete

---

### T18: Phone frame, navigator and app entry

**What**: `PhoneFrame`, `Navigator` (renders the top of the nav stack, hides TabBar per ONB-03/NAV-01), `main.tsx` mounting the app in `index.html`; placeholder screens.
**Where**: `src/app/Navigator.tsx` (+ `src/main.tsx`, `src/components/PhoneFrame.tsx`)
**Depends on**: T17
**Requirement**: AUTH-01, AUTH-02, NAV-01

**Done when**:
- [x] E2e: a fresh open shows the login placeholder; with a saved session the home placeholder shows; the 390×844 frame is present
- [x] Gate passes: Full

**Tests**: e2e · **Gate**: full
**Commit**: `feat(app): add phone frame and screen navigator`

**Notes**: `Navigator` renders `SCREENS[top(state).screen](ctx)` inside `PhoneFrame`, where `ctx = {state, dispatch, params, now}` and `SCREENS: Record<ScreenId, ScreenRenderer>`. Phase 4 replaces each placeholder entry with an adapter that maps the store to its pure screen component. Placeholders have test id `screen-{ScreenId}` and an `<h1>`. `tabFor(state)` shows the TabBar only when logged in, onboarding done and the top screen is home/learn/profile (NAV-01, ONB-03); tab taps dispatch `switchTab`. `main.tsx` mounts `<AppProvider><Navigator/></AppProvider>` (StrictMode) and `index.html` now loads it. `PhoneFrame({children, footer?})` is 390×844 with a status bar and a scrollable `.phone-screen`; test id `phone-frame`. E2e: 5 new tests in `e2e/app.spec.ts` (fresh → login; saved session → home + tab bar; session without onboarding → onboarding, no tab bar; tab switching; frame size). Phase 3 Build gate: 240 unit/component + 7 e2e.

**Status**: ✅ Complete

---

### T19: Login and sign-up screens

**Where**: `src/screens/Auth.tsx` · **Depends on**: T18 · **Requirement**: AUTH-01..11 (S1–S3)

**Done when**:
- [x] E2e: each error message; valid login → onboarding; sign up "Ana" → onboarding; "Já tenho conta" returns; reload stays logged in
- [x] Gate passes: Full

**Tests**: e2e · **Gate**: full
**Commit**: `feat(screens): add login and sign-up`

**Notes**: Pure `LoginScreen`/`SignupScreen` in `src/screens/Auth.tsx` keep form state locally and validate with `logic/auth`; adapters dispatch `login`/`signup`, "Criar conta" navigates to signup, "Já tenho conta" goes back. Gallery props: `initialEmail/initialPassword/initialErrors` (and `initialNome` on signup) render S2 with errors shown. Errors are linked to their input with `aria-describedby` ("under the field"). Shared `ScreenHeader`/`SectionTitle` in `src/screens/common.tsx`; e2e helpers in `e2e/helpers.ts` (seed once per test so reloads keep app state, `fixClock` = Mon 2026-11-16 10:00). Gate: 240 unit/component + 17 e2e (10 new).

**Status**: ✅ Complete

---

### T20: Onboarding and summary screens

**Where**: `src/screens/Onboarding.tsx` · **Depends on**: T19 · **Requirement**: ONB-01..13 (S4–S6)

**Done when**:
- [x] E2e: 8 cards with "N de 8"; ✅ Celulares + Pilhas, ✕ rest → summary lists both, nearest Coleta Verde Savassi, 1 mini-map pin; all ✕ → empty message; skip → home Todos; "Ir para o mapa" → home filtered by celulares+pilhas; one real mouse-drag swipe; no tab bar during onboarding
- [x] Gate passes: Full

**Tests**: e2e · **Gate**: full
**Commit**: `feat(screens): add swipe onboarding and summary`

**Notes**: `OnboardingScreen({index, onAnswer, onSkip})` and `OnboardingSummaryScreen({answers, onGoToMap(tenho)})` in `src/screens/Onboarding.tsx`; the adapter derives `index` = first unanswered category and turns `tenho` into a category handoff (or reset when empty). Each card shows a curated catalog fact (`CARD_FACT`) with Fonte and the category scale (justification of its highest-level sub-type, helper `categoryDanger` in `common.tsx`). Approved fix: `BHMap` mini now fits the pin heads + user dot with padding at a 2:1 aspect (`miniView`, unit test in `BHMap.test.tsx`; e2e asserts pins and dot inside the mini-map box). Spec-precision gap: ONB-09 "one-line como descartar" is not defined; chosen: first sentence of the guide of the category's highest-level sub-type. Deviation: the home screen is still a placeholder in this task, so the e2e here asserts "Ir para o mapa"/skip open the home map; the chip-state assertions (celulares+pilhas selected, Todos after skip/empty) are added to `e2e/onboarding.spec.ts` in T21. Gate: 241 unit/component + 25 e2e (8 new).

**Status**: ✅ Complete

---

### T21: Home map screen with tips

**Where**: `src/screens/HomeMap.tsx` · **Depends on**: T20 · **Requirement**: MAP-01..13, TIP-01..04 (S7–S9)

**Done when**:
- [x] E2e: 10 pins + fictional label on first open; chip and search cases from the spec's Independent Tests; empty state + Limpar filtros; state kept after visiting a point and coming back; tip balloon shows, closes, reappears after a tab switch; ⓘ balloon closes on an outside tap
- [x] Gate passes: Full

**Tests**: e2e · **Gate**: full
**Commit**: `feat(screens): add home map with filters, search and tips`

**Notes**: `HomeMapScreen({map, tip, onMapChange, onDismissTip, onOpenPoint})` in `src/screens/HomeMap.tsx`: search + chip row on top, illustrated map in the middle, a fixed bottom sheet over the map listing the visible points (scrolls inside), empty state with "Limpar filtros". The screen applies `toggleChip/selectAll/clearFilters` and hands the new `MapState` to `onMapChange` (adapter dispatches `setMap`). TIP-01: the adapter gives each new home nav entry the next catalog tip (`tipFor`, WeakMap by entry), `tip=null` when dismissed; the mascot balloon uses `dismissOnOutside={false}`. TIP-03: the ⓘ next to the list heading shows the URPV note with Fonte. Also adds the T20 deferred chip assertions to `e2e/onboarding.spec.ts` (summary → Pilhas+Celulares selected, empty search; skip/empty summary → Todos). Deviation: the point screen is still a placeholder without a back control, so "state kept after visiting a point" is asserted in T22 (PT-08); MAP-02 is asserted here via a tab switch. Gate: 241 unit/component + 37 e2e (12 new).

**Status**: ✅ Complete

---

### T22: Point detail and route screens

**Where**: `src/screens/Point.tsx` · **Depends on**: T21 · **Requirement**: PT-01..08 (S10–S11)

**Done when**:
- [x] E2e: point 1 shows every field, "Como levar" per sub-type, streams, `tel:` href, fictional label; Como chegar → dashed route; Fechar rota → detail; back → previous screen unchanged
- [x] Gate passes: Full

**Tests**: e2e · **Gate**: full
**Commit**: `feat(screens): add collection point detail and route view`

**Notes**: `PointDetailScreen({pointId, onBack, onRoute, onSchedule})` and `RouteScreen({pointId, onClose})` in `src/screens/Point.tsx` (no screen-local state). Sub-type chips grouped by category; hours in Mock Data notation (`hoursLabel`: "Seg–Sex 8h–18h", "Sáb 8h–12h", "Seg–Dom 8h–17h"); phone href `tel:+55` + digits; "Como levar" = `GUIDES.comoLevar` per accepted sub-type; "Por que descartar aqui" lists each distinct stream with the accepted sub-types it covers, ⓘ shows the PNRS card. Route: full map with only the point's pin, dashed route, header back and "Fechar rota" both go back. PT-08 e2e also covers the T21 deferred "filters kept after visiting a point". Gate: 241 unit/component + 43 e2e (6 new).

**Status**: ✅ Complete

---

### T23: Scheduling and celebration screens

**Where**: `src/screens/Schedule.tsx` · **Depends on**: T22 · **Requirement**: SCH-01..12 (S12–S14)

**Done when**:
- [x] E2e (fixed clock): only accepted sub-types listed; stepper bounds; closed days disabled; day change clears the slot; no-slot message; Confirmar disabled until valid; 2 celulares → "cerca de 18 g de cobre" + Fonte + "ao entregar"; LED lamp → no number; back doesn't save
- [x] Gate passes: Full

**Tests**: e2e · **Gate**: full
**Commit**: `feat(screens): add drop-off scheduling and impact celebration`

**Notes**: `ScheduleScreen({pointId, now: () => Date, onBack, onConfirm(NewBooking), initialQty?, initialDate?, initialSlot?})` and `CelebrationScreen({booking, onBackToMap})` in `src/screens/Schedule.tsx`. Screen-local state: quantities, selected day (YYYY-MM-DD), the slot list computed when the day was picked (EDGE-04) and the selected slot; the gallery sets them with the `initial*` props (S13: pick a day with no slots, e.g. point 1 on Monday with `now` after 17:00). `now` is a clock function so a re-render driven only by local state reads the current time (found by the EDGE-04 test). The adapter generates the booking id and dispatches `book`; "Voltar ao mapa" dispatches `openMap` with no handoff (NAV-03). Approved fix: sub-types carry pt-BR nouns (`noun: {singular, plural, gender}` in `categories.ts`) and `impactFor` now reads "Os 2 celulares que você vai entregar contêm cerca de 18 g de cobre" / "O 1 celular … contém" (feminine: "As 2 lâmpadas fluorescentes", "A 1 lâmpada fluorescente"); `impact.test.ts` asserts the full spec example strings, `categories.test.ts` asserts the nouns. Spec-precision gap: the spec gives only the masculine example; feminine articles for lâmpada/TV/bateria were chosen by grammar. Gate: 243 unit/component + 54 e2e (11 new).

**Status**: ✅ Complete

---

### T24: Aprender list and device pages

**Where**: `src/screens/Learn.tsx` · **Depends on**: T23 · **Requirement**: INFO-01..06, SCALE-02 (S15–S16)

**Done when**:
- [x] E2e: 8 categories sorted by level desc then name; logística reversa card + URPV note; Lâmpadas page shows fluorescent 3 and LED 1 sections with Fonte; "Ver pontos de coleta" → map with points 1,3,7,8
- [x] Gate passes: Full

**Tests**: e2e · **Gate**: full
**Commit**: `feat(screens): add learn tab and device pages`

**Notes**: `LearnScreen({onOpenCategory})` and `DeviceScreen({categoryId, onBack, onSeePoints})` in `src/screens/Learn.tsx` (no screen-local state besides the ⓘ/scale balloons). Order `LEARN_ORDER`: level desc, then pt-BR name. Each list row has an open button plus its own compact scale (tap → justification, SCALE-03). The device page shows the category scale, then per sub-type (with its own title + scale when the category has more than one, INFO-04) the three guide sections, the stream, and the guide facts each with Fonte (guide texts contain no numbers, INFO-05); the ⓘ next to "Por que não guardar em casa" shows the sub-type's first catalog tip. `SectionTitle` gained `level` (h3 under a sub-type title). Navigator now resets the shared phone scroll area to the top whenever the nav entry changes (a new screen opened mid-scroll otherwise). Gate: 243 unit/component + 63 e2e (9 new).

**Status**: ✅ Complete

---

### T25: Profile screen

**Where**: `src/screens/Profile.tsx` · **Depends on**: T24 · **Requirement**: PROF-01..07, NAV-01..03 (S17–S18)

**Done when**:
- [x] E2e: empty state + button to the map; after booking 2 celulares → "Itens agendados: 2" and the booking listed; potential totals; Sair → login → login again skips onboarding; Reiniciar demo confirm → onboarding after login; Cancelar keeps data
- [x] Gate passes: Full

**Tests**: e2e · **Gate**: full
**Commit**: `feat(screens): add profile with bookings, logout and demo reset`

**Notes**: `ProfileScreen({name, bookings, onOpenMap, onLogout, onReset, initialConfirmOpen?})` in `src/screens/Profile.tsx`. Screen-local state: the reset confirmation (gallery can open it with `initialConfirmOpen`). "Itens agendados" = sum of booked quantities; `sumImpact` totals with Fonte under "Impacto potencial" (PROF-06) or, with no multipliable sub-type, "Seus itens vão para a reciclagem certa" with one qualitative fact per category (PROF-07). The confirmation is an `alertdialog` that stays in view when Perfil is scrolled. Adapters: "Agende seu primeiro descarte" → `openMap` (no handoff), "Sair" → `logout`, "Apagar" → `resetDemo`. The unused `placeholder` helper was removed from `Navigator.tsx` (every screen now has an adapter). Phase 4 Build gate: 243 unit/component + 71 e2e (8 new).

**Status**: ✅ Complete

---

### T26: Gallery fixtures

**What**: 18 fixtures S1–S18 built from real data with a fixed clock.
**Where**: `src/gallery/fixtures.tsx` · **Depends on**: T25 · **Requirement**: GAL-01, GAL-02

**Done when**:
- [ ] Unit tests: ids S1–S18 and names exactly match the Screen Inventory; each fixture renders a screen component from `src/screens`
- [ ] Gate passes: Quick

**Tests**: unit · **Gate**: quick
**Commit**: `feat(gallery): add screen-state fixtures`

---

### T27: Gallery page

**What**: `Gallery.tsx` grid of captioned 390×844 frames, mounted by `gallery.html`.
**Where**: `src/gallery/Gallery.tsx` · **Depends on**: T26 · **Requirement**: GAL-01, GAL-02

**Done when**:
- [ ] E2e: `dist/gallery.html` offline shows 18 frames captioned "S# — name", each 390×844
- [ ] Gate passes: Full

**Tests**: e2e · **Gate**: full
**Commit**: `feat(gallery): add static screen gallery page`

---

### T28: Goal and offline acceptance tests

**What**: E2e tests for Goal 1 (2 taps from fresh home to the nearest point), Goal 2 (≤2 taps login → map via skip), and a full offline run.
**Where**: `e2e/goals.spec.ts` · **Depends on**: T27 · **Requirement**: Goals 1–2, NFR-01

**Done when**:
- [ ] Tap counts asserted; zero non-`file:` requests across the full flow
- [ ] Gate passes: Full

**Tests**: e2e · **Gate**: full
**Commit**: `test(e2e): add goal tap-count and offline acceptance tests`

---

## Phase Execution Map

```
Phase 1:  T1 → T2 → T3 → T4
Phase 2:  T5 → T6 → T7 → T8 → T9 → T10 → T11 → T12
Phase 3:  T13 → T14 → T15 → T16 → T17 → T18
Phase 4:  T19 → T20 → T21 → T22 → T23 → T24 → T25
Phase 5:  T26 → T27 → T28
```

Batches (~7 tasks, whole phases): **B1** = Phase 1 (4 tasks); **B2** = Phase 2 (8); **B3** = Phase 3 (6); **B4** = Phase 4 (7); **B5** = Phase 5 (3). B1 and B5 are small but can't merge without splitting a phase over budget: B1+B2 would be 12 tasks.

---

## Task Granularity Check

| Task | Scope | Status |
| ---- | ----- | ------ |
| T1 | Scaffold config (inherently multi-file, one concern) | ⚠️ Accepted: config-only, no domain logic |
| T2–T12 | 1 file / 1 module each | ✅ |
| T13 | 1 file (store + clock context) | ✅ |
| T14 | 1 file of small primitives + its CSS | ⚠️ Cohesive (shared primitives) |
| T15–T17 | 1 component each | ✅ |
| T18 | Navigator + entry + frame (wiring) | ⚠️ Cohesive: can't be tested apart (merge-backward rule) |
| T19–T25 | 1 screen file each (paired states in one file) | ✅ |
| T26–T28 | 1 file each | ✅ |

## Diagram-Definition Cross-Check

| Task | Depends on (body) | Diagram | Status |
| ---- | ----------------- | ------- | ------ |
| T1 | None | start | ✅ |
| T2 | T1 | T1→T2 | ✅ |
| T3 | T2 | T2→T3 | ✅ |
| T4 | T3 | T3→T4 | ✅ |
| T5–T12 | previous task | chain | ✅ |
| T13–T18 | previous task | chain | ✅ |
| T19–T25 | previous task | chain | ✅ |
| T26–T28 | previous task | chain | ✅ |

No dependency points to a later phase.

## Test Co-location Validation

| Task | Layer | Matrix requires | Task says | Status |
| ---- | ----- | --------------- | --------- | ------ |
| T1 | Config | e2e smoke | e2e | ✅ |
| T2–T4 | Data | unit | unit | ✅ |
| T5–T12 | Logic | unit | unit | ✅ |
| T13 | Store | unit | unit | ✅ |
| T14–T17 | Components | component | component | ✅ |
| T18 | Navigator / entry | e2e | e2e | ✅ |
| T19–T25 | Screens | e2e | e2e | ✅ |
| T26 | Gallery fixtures | unit | unit | ✅ |
| T27 | Gallery page | e2e | e2e | ✅ |
| T28 | Acceptance | e2e | e2e | ✅ |

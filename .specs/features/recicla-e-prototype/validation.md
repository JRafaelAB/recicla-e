# recicla-E HTML Prototype Validation

**Verdict**: PASS

**Date**: 2026-11-14
**Spec**: `.specs/features/recicla-e-prototype/spec.md` (rev. 3; NFR-02 amended by AD-001)
**Diff range**: `02f2418..66a7609` (27 commits) plus root commit `02f2418` (T1 + `.specs/`), 28 task commits in total; HEAD `66a7609` on `master`
**Verifier**: independent sub-agent (author ≠ verifier)
**Re-verified**: iteration 2 (fix commits `4915906`, `080957a`; HEAD `080957a`). Iteration 1 verdict was FAIL; see "Iteration 2" at the end.

Iteration 2: the S13 gap below is closed by `4915906` (see "Iteration 2"). Iteration 1 text follows. One gap blocked PASS: the gallery frame S13 does not show its state. The "Sem horários disponíveis neste dia" message sits below the fold of the 390×844 frame, so the frame looks like an empty S12 (GAL-01, Goal 5). Every other AC has `file:line` evidence that asserts the spec-defined outcome, the gate is green, and the sensor killed every non-equivalent mutant.

---

## Task Completion

| Task | Status | Notes |
| ---- | ------ | ----- |
| T1–T28 | ✅ Done (28/28 marked `✅ Complete` in tasks.md) | 28 commits in range. Deviations are documented in tasks.md: T20 chip-handoff checks were added in T21, and T21's "state after visiting a point" check was added in T22. Both are now covered (see item 3a below). |

---

## Gate Check

- **Gate command**: `npm run typecheck && npm run test:unit && npm run build && npm run test:e2e` (real tree, HEAD 66a7609)
- **Exit**: 0
- **typecheck**: pass
- **test:unit (Vitest)**: 19 files, **265 passed**, 0 failed, 0 skipped
- **build**: `dist/index.html` (341.06 kB) and `dist/gallery.html` (338.29 kB), and no other files (also asserted at `e2e/smoke.spec.ts:8`)
- **test:e2e (Playwright, file://, network-blocking fixture)**: **77 passed**, 0 failed, 0 skipped
- **Total**: 342 passed, 0 failed, 0 skipped
- **Test count before feature**: 0 (greenfield). **After**: 342.

---

## Spec-Anchored Acceptance Criteria

Legend: ✅ the assertion targets the spec outcome · ⚠️ covered, but with a precision or shallowness note · ❌ gap

### AUTH

| AC | Spec-defined outcome | `file:line` + assertion | Result |
| -- | -------------------- | ----------------------- | ------ |
| AUTH-01 | S1 with email, senha, "Entrar", "Criar conta" | `e2e/auth.spec.ts:23-26` `getByLabel('Email').toBeVisible()`, `getByLabel('Senha').toHaveAttribute('type','password')`, buttons `Entrar`/`Criar conta` visible; `src/app/store.test.ts:12` `nav toEqual [{screen:'login'}]` | ✅ |
| AUTH-02 | session → home if onboarding done, else onboarding | `e2e/app.spec.ts:23` `screen-home` visible; `e2e/app.spec.ts:30` `screen-onboarding` visible; `e2e/auth.spec.ts:102-104` reload keeps onboarding; `src/app/store.test.ts:15,18` | ✅ |
| AUTH-03 | sign-up form: nome, email, senha, "Cadastrar" | `e2e/auth.spec.ts:49-52` | ✅ |
| AUTH-04 | "Informe um email válido" under email; stays | `e2e/auth.spec.ts:32` `getByLabel('Email').toHaveAccessibleDescription('Informe um email válido')`, `:34` still on login, `:35` nothing saved; signup `:60`; `src/logic/auth.test.ts:9` | ✅ |
| AUTH-05 | "A senha precisa ter pelo menos 6 caracteres" under senha; stays | `e2e/auth.spec.ts:41` `toHaveAccessibleDescription(...)`; `src/logic/auth.test.ts:12` (5 chars → error), `:15` (6 chars valid) | ✅ |
| AUTH-06 | "Informe seu nome" under nome; stays | `e2e/auth.spec.ts:59`, `:70` `getByRole('alert').toHaveText(['Informe seu nome'])`; `src/logic/auth.test.ts:30,33` | ✅ |
| AUTH-07 | saves session; opens onboarding | `e2e/auth.spec.ts:84-85` onboarding visible + `readSaved toMatchObject({session:true,name:'ana'})`; `src/app/store.test.ts:30-31` | ✅ |
| AUTH-08 | saves session; opens home | `e2e/auth.spec.ts:91-93`; `src/app/store.test.ts:35-36` | ✅ |
| AUTH-09 | "Já tenho conta" → login | `e2e/auth.spec.ts:77-78` | ✅ |
| AUTH-10 | typed nome stored as name | `e2e/auth.spec.ts:101` `toMatchObject({session:true,name:'Ana'})`; `src/app/store.test.ts:46` | ✅ |
| AUTH-11 | name = part before "@" when none stored | `e2e/auth.spec.ts:85` `name:'ana'`; `:93` keeps a stored name; `src/app/store.test.ts:39,42`; `src/logic/auth.test.ts:46` | ✅ |

### ONB

| AC | Spec-defined outcome | `file:line` + assertion | Result |
| -- | -------------------- | ----------------------- | ------ |
| ONB-01 | 8 cards, one per category: emoji, name, category scale, one approved fact | `e2e/onboarding.spec.ts:32-37` heading `toHaveText(LABELS[i])`, emoji not empty, 5 segments, `danger-label toHaveText(LEVEL_LABELS[i])`, "Você sabia?" + `fonte` visible | ⚠️ The test does not check that the fact text comes from `FACTS` (only that it has a Fonte). |
| ONB-02 | progress bar + "N de 8" | `e2e/onboarding.spec.ts:29-30` `onb-count toHaveText('${i+1} de 8')`, `progressbar aria-valuenow` | ✅ |
| ONB-03 | tab bar hidden | `e2e/onboarding.spec.ts:38` `tabBar toHaveCount(0)`; `e2e/app.spec.ts:31` | ✅ |
| ONB-04 | right / ✅ → "tenho" | `e2e/onboarding.spec.ts:132-136` real mouse drag → `answers toEqual({pilhas:'tenho', baterias:'nao'})`; `src/components/SwipeCard.test.tsx:29,71`; `src/app/store.test.ts:61` | ✅ |
| ONB-05 | left / ✕ → "não tenho" | same as ONB-04 (`baterias:'nao'`); `src/components/SwipeCard.test.tsx:38` | ✅ |
| ONB-06 | next card shown | `e2e/onboarding.spec.ts:32` heading advances through `LABELS[i]`; `:145` "Baterias" after "Pilhas" | ✅ |
| ONB-07 | second answer during exit ignored | `e2e/onboarding.spec.ts:143-148` `answers toEqual({pilhas:'tenho'})`, count stays "2 de 8"; `src/components/SwipeCard.test.tsx:95,104` `mock.calls toEqual([['tenho']])` | ✅ |
| ONB-08 | onboarding done + home with reset handoff | `e2e/onboarding.spec.ts:113-115` pressed `[/Todos$/]`, search `''`, `onboarding.done === true`; `src/app/store.test.ts:82-84` | ✅ |
| ONB-09 | summary lists each "tenho" category with level, como descartar, nearest point | `e2e/onboarding.spec.ts:53-58` headings `['Pilhas','Celulares']`, labels Moderado/Muito alto, "Como descartar: …", nearest `Coleta Verde Savassi · 0,8 km` ×2 | ⚠️ "one-line como descartar" is a spec-precision gap. The author chose the first sentence of the guide, documented in tasks.md T20. |
| ONB-10 | mini map with user dot + one pin per distinct nearest point | `e2e/onboarding.spec.ts:65-71` 1 pin (`pin-1`) and the dot inside the box; `:79-84` 2 pins (1, 5); `src/components/BHMap.test.tsx:35-46` | ✅ |
| ONB-11 | "Ótimo! Você não tem lixo eletrônico parado em casa." + "Ir para o mapa" | `e2e/onboarding.spec.ts:90-92` | ✅ |
| ONB-12 | category handoff of exactly the "tenho" categories | `e2e/onboarding.spec.ts:104-106` pressed `[/Pilhas$/, /Celulares$/]`, search `''`, 9-point list | ✅ (this is the T20 check that landed in T21) |
| ONB-13 | empty summary → reset handoff | `e2e/onboarding.spec.ts:93-95` pressed `[/Todos$/]`, search `''` | ✅ |

### MAP

| AC | Spec-defined outcome | `file:line` + assertion | Result |
| -- | -------------------- | ----------------------- | ------ |
| MAP-01 | map, user dot, search, Todos + 8 chips, sheet, "Pontos fictícios (demonstração)" | `e2e/home.spec.ts:35-41` | ✅ |
| MAP-02 | no handoff keeps filters and search; first open is Todos + empty | `e2e/home.spec.ts:37,39` first open; `:107-115` tab round-trip keeps Lâmpadas + "pampulha"; `src/logic/mapState.test.ts:8`; `src/app/store.test.ts:119-124` | ✅ |
| MAP-03 | exactly the handed-off categories, search cleared | `e2e/learn.spec.ts:113-119` ("xyz" → `''`, only Lâmpadas); `src/logic/mapState.test.ts:11-14` | ✅ |
| MAP-04 | Todos + empty search | `e2e/onboarding.spec.ts:113-114`; `src/logic/mapState.test.ts:17`; `src/app/store.test.ts:96` | ✅ |
| MAP-05 | select chip, deselect Todos | `e2e/home.spec.ts:52-53`; `src/logic/mapState.test.ts:23,26` | ✅ |
| MAP-06 | deselect a non-only chip | `e2e/home.spec.ts:61-63`; `src/logic/mapState.test.ts:29` | ✅ |
| MAP-07 | Todos / the only chip → Todos, selections cleared | `e2e/home.spec.ts:64-72`; `src/logic/mapState.test.ts:32,38` | ✅ |
| MAP-08 | OR over selected categories | `e2e/home.spec.ts:54` `[5,7,9,10]`, `:60` `[1,3,5,7,8,9,10]`; `src/logic/filter.test.ts:30,33` | ✅ |
| MAP-09 | name / neighborhood / category label, case- and accent-insensitive | `e2e/home.spec.ts:77-78` `[7,8]`; `src/logic/filter.test.ts:36,49-50` | ✅ |
| MAP-10 | both filters apply | `e2e/home.spec.ts:84` `[7]`; `src/logic/filter.test.ts:39` | ✅ |
| MAP-11 | ascending distance; name, neighborhood, "0,8 km", category emojis | `e2e/home.spec.ts:41-47` order 1..10, `'Savassi · 0,8 km'`, emojis `['🔋','🪫','📱','💡','🔌']`; `src/logic/filter.test.ts:55` tie-break; `src/logic/format.test.ts:6-8` | ✅ |
| MAP-12 | "Nenhum ponto encontrado" + "Limpar filtros" | `e2e/home.spec.ts:97-100` | ✅ |
| MAP-13 | Todos + empty search | `e2e/home.spec.ts:101-104`; `src/logic/mapState.test.ts:41` | ✅ |

### PT

| AC | Spec-defined outcome | `file:line` + assertion | Result |
| -- | -------------------- | ----------------------- | ------ |
| PT-01 | detail fields; sub-types grouped by category; hours; phone; both actions | `e2e/point.spec.ts:23-36`, `:58-62` (point 7: 8 groups, 14 sub-types); entry via list/pin `e2e/home.spec.ts:146-153`; `src/components/BHMap.test.tsx:60` `toHaveBeenCalledWith(7)` | ✅ |
| PT-02 | one catalog prep tip per accepted sub-type | `e2e/point.spec.ts:43-44` count 6 + each `guide(id).comoLevar` | ✅ |
| PT-03 | stream of each accepted sub-type | `e2e/point.spec.ts:51` `toContainText(guide(id).stream)` | ✅ |
| PT-04 | `tel:` link | `e2e/point.spec.ts:33` `href 'tel:+553130000001'`, `:62`; `src/data/points.test.ts:99` | ✅ |
| PT-05 | "Ponto fictício (demonstração)" | `e2e/point.spec.ts:34` | ✅ |
| PT-06 | dashed route from user dot to point + "Fechar rota" | `e2e/point.spec.ts:70-74` `stroke-dasharray`, `d /^M52 60 Q.* 55 63$/`; `src/components/BHMap.test.tsx:80-84` | ✅ |
| PT-07 | "Fechar rota" → detail | `e2e/point.spec.ts:74-75` | ✅ |
| PT-08 | back → origin with state unchanged | `e2e/point.spec.ts:88-92` chips, search "pampulha", list, tip still closed | ✅ (this is the T21 check that landed in T22) |

### SCH

| AC | Spec-defined outcome | `file:line` + assertion | Result |
| -- | -------------------- | ----------------------- | ------ |
| SCH-01 | only accepted sub-types, grouped, with steppers | `e2e/schedule.spec.ts:32-36` | ✅ |
| SCH-02 | 0..20, "−" disabled at 0, "+" disabled at 20 | `e2e/schedule.spec.ts:41-47`; `src/components/ui.test.tsx:16-17,38-41,49-50` | ✅ |
| SCH-03 | 7 days from today; closed days disabled | `e2e/schedule.spec.ts:53-57,62-63`; `src/logic/slots.test.ts:15-18,28-30` | ✅ |
| SCH-04 | hourly slots open → close−1, past hidden, slot cleared on day change | `e2e/schedule.spec.ts:65,67,71-72`; `src/logic/slots.test.ts:40,43,49-51` | ✅ |
| SCH-05 | "Sem horários disponíveis neste dia" | `e2e/schedule.spec.ts:78-79`; `src/logic/slots.test.ts:57-58` | ✅ |
| SCH-06 | Confirm disabled while qty 0 / no day / no slot | `e2e/schedule.spec.ts:95-106` | ✅ |
| SCH-07 | saves point, sub-types, quantities, day, slot | `e2e/schedule.spec.ts:120` `toMatchObject({pointId:1, items:[{subtypeId:'celular',qty:2}], date:'2026-11-17', slot:'09:00'})`; `src/app/store.test.ts:159` | ✅ |
| SCH-08 | celebration with mascot, confetti, summary | `e2e/schedule.spec.ts:123-128` | ✅ |
| SCH-09 | ≥1 catalog entry per booked sub-type, with Fonte | `e2e/schedule.spec.ts:133-136`, `:147-150` (LED fact ∈ FACTS + Fonte); `src/logic/impact.test.ts:44-48` | ✅ |
| SCH-10 | multipliable value × qty, CAT-R5 phrasing | `e2e/schedule.spec.ts:134-135` exact "Os 2 celulares … 18 g de cobre" / "7 g de cobalto"; `:151` no mg/g/kg for LED; `src/logic/impact.test.ts:13-14,52-55` | ✅ |
| SCH-11 | potential wording, never achieved | `e2e/schedule.spec.ts:131` "Ao entregar, você vai", `:137` `not /recuperou\|evitou\|você salvou/` | ✅ |
| SCH-12 | back → point detail, nothing saved | `e2e/schedule.spec.ts:160-161` `bookings toEqual([])` | ✅ |

### SCALE / INFO / TIP / NAV / PROF

| AC | Spec-defined outcome | `file:line` + assertion | Result |
| -- | -------------------- | ----------------------- | ------ |
| SCALE-01 | 5 segments, 1..N filled in the level color, emoji + label | `src/components/DangerScale.test.tsx:14-16,26-29,35-37` | ✅ |
| SCALE-02 | levels match Mock Data | `src/data/categories.test.ts:41,62` (14 sub-types + 8 categories); `e2e/learn.spec.ts:31,59-63,83-84` | ✅ |
| SCALE-03 | balloon with justification + scale note | `src/components/DangerScale.test.tsx:47-48`; `e2e/learn.spec.ts:49-50` | ✅ |
| INFO-01 | 8 categories by level desc, then name | `e2e/learn.spec.ts:24-33` | ✅ |
| INFO-02 | PNRS card + URPV note | `e2e/learn.spec.ts:39-42` | ✅ |
| INFO-03 | three sections + stream + "Ver pontos de coleta" | `e2e/learn.spec.ts:65-69`, `:116` | ✅ |
| INFO-04 | per-sub-type scale and guidance | `e2e/learn.spec.ts:57-63`; single sub-type `:89-92` | ✅ |
| INFO-05 | every number has Fonte | `e2e/learn.spec.ts:74-76` (facts carry Fonte; guide texts contain no digits) | ⚠️ Only the Lâmpadas page is checked e2e. The catalog-wide number guard is at `src/data/catalog.test.ts:83-91`. |
| INFO-06 | category handoff of that category | `e2e/learn.spec.ts:118-122` points 1, 3, 7, 8 | ✅ |
| TIP-01 | mascot balloon with a catalog tip | `e2e/home.spec.ts:119-120` `TIPS.map(t=>t.text) toContain(text)` | ✅ |
| TIP-02 | ✕ hides until the map is reopened | `e2e/home.spec.ts:124-131`; `src/app/store.test.ts:140-149` | ✅ |
| TIP-03 | ⓘ shows a related catalog fact | `e2e/home.spec.ts:136-139`; `e2e/learn.spec.ts:97-100`; `src/components/ui.test.tsx:96-97` | ✅ |
| TIP-04 | outside tap closes | `e2e/home.spec.ts:140-141`; `e2e/learn.spec.ts:101-102`; `src/components/ui.test.tsx:74-75` | ✅ |
| NAV-01 | tab bar Mapa / Aprender / Perfil on main screens | `e2e/app.spec.ts:24-25,36-42`; `src/components/ui.test.tsx:107-110` | ✅ |
| NAV-02 | back on point / route / schedule / device | `e2e/point.spec.ts:77-78,88`; `e2e/schedule.spec.ts:159-160`; `e2e/learn.spec.ts:107-108` | ✅ |
| NAV-03 | "Voltar ao mapa" → home, no handoff | `e2e/schedule.spec.ts:175-177` filter Celulares kept | ✅ |
| PROF-01 | name, "Itens agendados" (sum of qty), bookings (point, day, slot, items) | `e2e/profile.spec.ts:54-59` "Itens agendados: 2", point, "Ter, 17/11 às 09:00", "2 × Celular"; name `:31` | ✅ Iteration 2: now "2 celulares" at `e2e/profile.spec.ts:59` (`080957a`). Iteration 1: ⚠️ The spec does not define the item format. "2 × Celular" is a style choice, not a violation (see item 3c below). |
| PROF-02 | "Itens agendados: 0" + button → map without handoff | `e2e/profile.spec.ts:32-36` (Pilhas filter kept) | ✅ |
| PROF-03 | session deleted; name, answers, bookings kept | `e2e/profile.spec.ts:114` `readSaved toEqual({...saved, session:false})`; `src/app/store.test.ts:177-181` | ✅ |
| PROF-04 | confirm "Apagar todos os dados da demonstração?" with Cancelar / Apagar | `e2e/profile.spec.ts:127-128` | ✅ |
| PROF-05 | erase all, login | `e2e/profile.spec.ts:139-140` `readSaved toBeNull()`; `src/app/store.test.tsx:41` | ✅ |
| PROF-06 | totals per value, summed, CAT-R5, Fonte | `e2e/profile.spec.ts:74-79` (18 g / 7 g / 4 mg), `:87` (36 g summed across bookings); `src/logic/impact.test.ts:82-87` | ✅ |
| PROF-07 | "Seus itens vão para a reciclagem certa" + 1 qualitative fact per category | `e2e/profile.spec.ts:95-103`; `src/logic/impact.test.ts:109-112` | ✅ |

### GAL / EDGE / NFR / CAT

| AC | Spec-defined outcome | `file:line` + assertion | Result |
| -- | -------------------- | ----------------------- | ------ |
| GAL-01 | 18 states rendered as static 390×844 frames, captioned "S# — name" | `e2e/gallery.spec.ts:28-33` 18 items, captions, 390×844; `src/gallery/fixtures.test.tsx:36` | ✅ Closed in iteration 2 (`e2e/gallery.spec.ts:36-44`, see "Iteration 2"). Iteration 1: ❌ **Gap**: frame S13 does not show its state. The verifier probe on the built `dist/gallery.html` found "Sem horários disponíveis neste dia" at y = 6682–6702, while the `.phone-screen` scroll container ends at y = 6536. The message is clipped below the fold, and the frame looks identical to an empty S12 (screenshot checked). The other 17 frames were probed and their state markers are visible. No test asserts state visibility inside the frame. |
| GAL-02 | same components + data | `src/gallery/fixtures.test.tsx:43-48` (real screen test ids); `e2e/gallery.spec.ts:39-42` | ✅ |
| EDGE-01 | memory fallback | `src/logic/storage.test.ts:85-113`; `src/app/store.test.tsx:45-55` | ✅ |
| EDGE-02 | nearest per specific category | `src/logic/nearest.test.ts:6-15` (tvs → 2, computadores → 2, linhabranca → 5); `e2e/onboarding.spec.ts:77` | ✅ |
| EDGE-03 | accent-free search matches | `src/logic/filter.test.ts:45-46`; `e2e/home.spec.ts:88-91` | ✅ |
| EDGE-04 | shown slots kept until the day is reselected | `e2e/schedule.spec.ts:84-90` | ✅ |
| NFR-01 | no network requests | `e2e/fixtures.ts:16-31` (auto fixture on every e2e test, `blocked toEqual([])`); `e2e/goals.spec.ts:84-86` | ✅ |
| NFR-02 | built files work from disk (AD-001) | `e2e/smoke.spec.ts:8-11`; every e2e test uses `file://` (`e2e/fixtures.ts:8-10`) | ✅ |
| NFR-03 | CAT-R1..R3 checked by automated test | `src/data/catalog.test.ts:51-133` | ✅ |
| CAT-R1 | id, text, sub-types, source + URL, optional per-unit value | `src/data/catalog.test.ts:41-42,53-60,68-73` | ✅ |
| CAT-R2 | §11 / duvidosa / unsourced excluded | `src/data/catalog.test.ts:95-116` (11 forbidden patterns + 3% must carry 2022), `:83-91` (every number in research.md) | ✅ |
| CAT-R3 | qualifiers kept | `src/data/catalog.test.ts:120-132` | ✅ |
| CAT-R4 | exactly 5 multipliable values | `src/data/catalog.test.ts:136-162`; `src/logic/impact.test.ts:32-36` | ✅ |
| CAT-R5 | "contained" phrasing, never recovered or avoided | `src/logic/impact.test.ts:13-14,70-71` | ✅ |
| CAT-R6 | ≥12 tips, URPV note, ≥1 entry per sub-type | `src/data/catalog.test.ts:166-195` | ✅ |

### Goals

| Goal | Evidence | Result |
| ---- | -------- | ------ |
| G1: 2 taps to the nearest point | `e2e/goals.spec.ts:21-37` `expect(t.taps).toBe(2)` + heading = nearest (Ponto Verde Cidade Nova, Coleta Verde Savassi) | ✅ |
| G2: ≤ 2 taps login → map | `e2e/goals.spec.ts:41-52` `toBeLessThanOrEqual(2)` | ✅ |
| G3: every category / sub-type has level justification, guide fields, ≥1 fact | `src/data/catalog.test.ts:180-195,67-74` | ✅ |
| G4: every quantitative claim from the catalog shows Fonte | `src/data/catalog.test.ts:83-91`; Fonte asserted on cards, device facts, celebration, profile, ⓘ balloons | ⚠️ The mascot tip renders `FonteNote` (`src/screens/HomeMap.tsx:61`), but `e2e/home.spec.ts:117-131` does not assert it. Tip `catalog.ts:232` contains "3%". |
| G5: every Screen Inventory state appears as a captioned frame | `e2e/gallery.spec.ts:24-33` | ✅ Closed in iteration 2 (iteration 1: ❌ S13 state not visible, see GAL-01) |

**Status**: ❌ 1 gap (GAL-01 / Goal 5). ⚠️ 5 precision or shallowness notes, none blocking.

---

## Discrimination Sensor

Scratch: `git worktree add --detach %TEMP%\recicla-sensor HEAD`, then `npm ci --prefer-offline` (no symlink to the real node_modules). Each mutation was applied with an exact-anchor replace script, the listed tests were run, and the file was restored with `git checkout`. The worktree was then removed with `git worktree remove --force` and `git worktree prune`. `git stash` was never used.

| # | Mutation | File:line (original) | Tests run | Result |
| - | -------- | -------------------- | --------- | ------ |
| 1 | filterPoints OR → AND between categories (`some` → `every`) | `src/logic/filter.ts:24` | `src/logic/filter.test.ts` | ✅ Killed (1 failed) |
| 2 | nearestPointFor picks the farthest (`[0]` → `.at(-1)`) | `src/logic/nearest.ts:7` | `src/logic/nearest.test.ts` | ✅ Killed (7 failed) |
| 3 | slotsFor off-by-one at closing (`hour < close` → `<=`) | `src/logic/slots.ts:21` | `src/logic/slots.test.ts` | ✅ Killed (5 failed) |
| 4 | impact drops quantity (`m.value * qty` → `m.value`) | `src/logic/impact.ts:25` | `src/logic/impact.test.ts` | ✅ Killed (4 failed) |
| 5 | impact multiplies a non-multipliable (qualitative) fact by qty | `src/logic/impact.ts:67` | `src/logic/impact.test.ts` | ✅ Killed (2 failed) |
| 6 | validateLogin accepts a 5-char password (`< 6` → `< 5`) | `src/logic/auth.ts:14` | `src/logic/auth.test.ts` | ✅ Killed (1 failed) |
| 7 | category handoff keeps the query (`query: ''` → `state.query`) | `src/logic/mapState.ts:14` | `mapState.test.ts`, `store.test.ts` | ✅ Killed (2 failed) |
| 8 | logout clears bookings | `src/app/store.tsx:90` | `store.test.ts`, `store.test.tsx` | ✅ Killed (1 failed) |
| 9a | SwipeCard: `answer()` lock guard neutralized (`locked.current = false` on entry) | `src/components/SwipeCard.tsx:23-24` | `SwipeCard.test.tsx` + `e2e/onboarding.spec.ts` | ⚪ Survived, **equivalent mutant**. Disabled buttons (`:84,87`) and the pointer guards (`:37,44,49`) still block a second answer, so the observable ONB-07 behavior is unchanged. This is not a test weakness. |
| 9b | SwipeCard accepts a second answer during exit (guard neutralized + buttons not disabled) | `src/components/SwipeCard.tsx:23,84,87` | `SwipeCard.test.tsx` | ✅ Killed (3 failed) |
| 10 | Schedule: changing day does not clear the selected slot | `src/screens/Schedule.tsx:55` | build + `e2e/schedule.spec.ts` | ✅ Killed (2 failed) |
| 11 | Profile "Itens agendados" counts bookings instead of summing quantities | `src/screens/Profile.tsx:33` | build + `e2e/profile.spec.ts` | ✅ Killed (5 failed) |
| 12 | Onboarding "Ir para o mapa" hands off only the first "tenho" category | `src/screens/Onboarding.tsx:146` | build + `e2e/onboarding.spec.ts` | ✅ Killed (1 failed) |
| 13 | Mascot tip stays dismissed when the home map is reopened | `src/app/store.tsx:76` | `src/app/store.test.ts` | ✅ Killed (1 failed) |

**Sensor depth**: P0-expanded (13 behavior mutations plus 1 equivalent probe across logic, store, component and screen layers)
**Result**: 13/13 non-equivalent mutants killed; 1 equivalent mutant survived. ✅ PASS

### Porcelain isolation

- **Before sensor** (`git status --porcelain`, real tree): `?? .screens/`
- **After cleanup**: `?? .screens/`. Identical (`diff` empty). `git worktree list` shows only the main tree.
- The real `dist/` was rebuilt by the real-tree gate run (gitignored; not in porcelain). The verifier's read-only gallery probe read the real `dist/gallery.html` from a spec file inside the scratch worktree, and that file was deleted with the worktree.

---

## Known Items Judged

**(a) Tests placed one task late.** Coverage exists.
- T20's chip-handoff checks are at `e2e/onboarding.spec.ts:98-107` (ONB-12: Pilhas + Celulares pressed, search empty), `:93-95` (ONB-13: Todos) and `:113-114` (ONB-08: Todos + empty search).
- T21's "state after visiting a point" check is at `e2e/point.spec.ts:81-93` (PT-08: chips, search, list and closed tip all unchanged).
- Mutation 12 confirms the handoff check discriminates.

**(b) Gallery S13.** GAL-01's intent is **not met**. The message exists in the DOM but is clipped by `.phone-screen` 146 px below the visible bottom of the frame. A designer importing the frame into Figma sees an empty scheduling form. This is a gap (see Fix 1).

**(c) "2 × Celular" in Perfil.** This is **not a spec violation**. PROF-01 only requires "items" in the booking list and defines no format. CAT-R5 noun phrasing applies to multiplied impact values, not to the booking list, and the impact lines in Perfil use "contêm". The only issue is cosmetic: the celebration screen says "2 celulares" while Perfil says "2 × Celular". This is logged as a spec-precision gap and does not block.

**(d) Content accuracy.** 26 numeric catalog facts were spot-checked against research.md, and all match with qualifiers kept:
- Hg 0,0005% (§0.1/§1); 2 a 20 ml; 2,3 milhões kg (2010); 245 incêndios / 64 instalações / 2013–2020
- 65 g Co per notebook battery; até 8 kg Pb; 52/30/6%; 99%; 353 mil t (2024)
- 9 g Cu and 3,5 g Co (estimativa UNEP 2009); 250/24/9 mg; 23%; 1 g / 220 mg / 80 mg / 500 g; 6 kg Fe; até 5 mg Hg (CCFL)
- GWP 10.900 / 4.750 / 1.430; 3,9 t CO₂e only "com CFC"; US$ 91 / 28 bi; 1,8 kg Pb; 58 t Hg / 45 mil t BFR; 4 mg Hg; <1% of a thermometer; 3,4 t CO₂/t Cu

A grep of all non-test `src/**/*.ts(x)` for every §11 claim found none. Two patterns were close calls:
- "lixo comum" appears only in negated guidance ("não vai para o lixo comum"), which is the alternative §11.9 recommends.
- "3%" appears once (`catalog.ts:232`) with "2022 (Global E-waste Monitor 2024)", as §11.5 requires.

The mercury destination is phrased "separado e isolado com segurança em aterro Classe I", as §11.7 requires. No hard-coded numbers in `src/screens/*.tsx` UI text.

---

## Spec-Precision Gaps

1. **GAL-01**: "render the states as frames" does not say that the distinguishing content must be visible within the 390×844 viewport. The implementation met the letter (frame exists, caption correct) but not the intent for S13.
2. **PROF-01**: the item format in the booking list is undefined ("2 × Celular" vs "2 celulares" on the celebration screen).
3. **ONB-09**: "one-line como descartar" is undefined. The author's choice (first sentence of the guide) is documented in T20.
4. **ONB-01**: "one approved fact" per card. The test checks a Fonte but not catalog membership.
5. **INFO-05**: only exercised on one category page e2e. The other pages rely on the catalog-wide number guard.

---

## Code Quality (spot-check)

| Principle | Status |
| --------- | ------ |
| Minimum code / no scope creep | ✅ |
| Matches patterns (pure logic in `src/logic`, screens as props-in components, adapters in Navigator) | ✅ |
| Spec-anchored outcome check | ✅ except GAL-01 |
| Per-layer coverage: logic 1:1 to ACs; e2e covers happy + edge + error paths | ✅ |
| Every test maps to an AC, edge case or Done-when | ✅ |
| Documented guidelines: none in repo (strong defaults applied) | ✅ |

---

## Fix Plans

### Fix 1: S13 gallery frame must show the no-slot state (GAL-01, Goal 5). Priority: Major

- **Root cause**: the S13 fixture renders `ScheduleScreen` for point 1 with 6 sub-type rows above the day/slot section. `.phone-screen` scrolls, and the static frame shows only the top 797 px.
- **Fix task**: make the S13 frame show the day/slot section with the "Sem horários disponíveis neste dia" message inside the visible frame. Options:
  - an initial scroll position for gallery frames, with a fixture prop such as `initialScrollTo="slots"`;
  - a fixture for a point with fewer sub-types;
  - a collapsed item list in that fixture.

  Keep the same component and data (GAL-02).
- **Verify**: add an e2e check in `e2e/gallery.spec.ts` that, for S13, the message's bounding box lies within the frame's `.phone-screen` box. Optionally generalize this to one state marker per frame (the verifier probe found S2, S5–S7, S9, S11, S12, S14, S16–S18 already visible).
- **Done when**: the gate passes and the new assertion fails on the current HEAD (it discriminates).

### Non-blocking hardening (optional)

- Assert the mascot tip's `fonte` at `e2e/home.spec.ts:119`.
- Assert that the onboarding card fact text ∈ `FACTS` at `e2e/onboarding.spec.ts:36`.

---

## Requirement Traceability Update

The spec.md traceability table still shows "Design / Pending" for every story. The verifier did not edit spec.md (it was scoped to write only this file). Recommended statuses:
- ✅ Verified: AUTH, ONB, MAP, PT, SCH, SCALE, INFO, TIP, NAV/PROF, PROF-06..07, CAT/EDGE/NFR
- ✅ Verified (iteration 2): GAL-01, GAL-02

---

## Lessons (candidates)

`scripts/lessons.py` needs Python, which is not available on this machine, so lessons are listed here for later recording:

1. **Gallery / screenshot frames**: when a spec requires that a *state* appear as a fixed-size frame, assert that the state's distinguishing element is inside the frame's visible viewport, not just present in the DOM. Grounded in the GAL-01/S13 gap.
2. **Defense in depth produces equivalent mutants**: when a UI lock has redundant guards (disabled buttons plus a handler guard), mutate all guards together to test the behavior. A survivor from mutating one guard is equivalent, not a test weakness. Grounded in mutant 9a.
3. **Specs with list items**: define the item text format when the same data appears on several screens (booking items "2 celulares" vs "2 × Celular"). Grounded in the PROF-01 precision gap.

---

## Summary

**Overall**: ✅ Ready after iteration 2 (iteration 1: ❌ Not Ready, one Major gap, now closed; see "Iteration 2").

**Spec-anchored check**: 94/95 ACs matched the spec outcome (GAL-01 gap); 4 of 5 Goals ✅ (Goal 5 ❌); 5 non-blocking precision notes
**Sensor**: 13/13 non-equivalent mutants killed (1 equivalent survivor)
**Gate**: 342 passed (265 unit/component + 77 e2e), 0 failed, 0 skipped

**What works**: auth, onboarding, map filters and handoffs, point detail and route, scheduling with slot rules, impact phrasing per CAT-R4/R5, Aprender, tips, profile and logout/reset, offline file:// builds, and a sourced catalog with no §11 claims.

**Issues found**: S13 gallery frame hides its state below the fold (Fix 1).

**Next steps**: route Fix 1 to an implementer, then re-run the verifier (fix → re-verify loop, 1 of 3).

---

## Iteration 2 (fix → re-verify loop, 2 of 3)

**Date**: 2026-11-14. **Diff range**: `66a7609..080957a` (2 commits: `4915906`, `080957a`; 4 files, +14/−3). **Verifier**: independent sub-agent, not the fix author.

### Gate (real tree, HEAD `080957a`)

- `npm run typecheck && npm run test:unit && npm run build && npm run test:e2e`: exit 0
- typecheck: pass
- test:unit: 19 files, **265 passed**, 0 failed, 0 skipped (unchanged)
- build: `dist/index.html` + `dist/gallery.html`
- test:e2e: **78 passed**, 0 failed, 0 skipped (+1: the new S13 test)
- **Total**: 343 passed (was 342). No test removed or weakened. The only changed assertion is `e2e/profile.spec.ts:59`, `'2 × Celular'` → `'2 celulares'`, which is equally specific.

### Gap 1 (GAL-01 / Goal 5): ✅ closed

- **Fix**: `src/gallery/fixtures.tsx:86-90`. S13 now renders `ScheduleScreen pointId={3}` (Coleta Lourdes) with `now={MONDAY_EVENING}` (`src/gallery/fixtures.tsx:25`, Mon 16/11/2026 18:00) and `initialDate="2026-11-16"`. The caption is still "Scheduling, day with no slots", which matches Screen Inventory S13 (`spec.md:137`) and SCH-05 (`spec.md:247`).
- **No slots are left, so the state is genuine**: point 3 is open `MON_SAT`, 8–14 (`src/data/points.ts:50`). At Monday 18:00 the day is open but every hourly slot is in the past, so the "no remaining slots" path applies, not the "closed day" path. Point 3 accepts only 3 sub-types (`src/data/points.ts:49`). This keeps the item list short, so the message renders inside the frame.
- **The assertion is not vacuous**: `e2e/gallery.spec.ts:36-44` takes frame 13 (`nth(12)`) and measures the bounding boxes of its `.phone-screen`, its `.sch-footer` and the text "Sem horários disponíveis neste dia". It asserts `msg.y >= screen.y` and `msg.y + msg.height <= min(screen.bottom, footer.y)`. The test locates the message by text, so a missing message fails it on the `boundingBox` wait. A message clipped below the fold fails the bottom bound, which mutation I2-1 shows. A message hidden behind the sticky footer fails the `footer.y` bound.

### Commit `080957a` (PROF-01 wording)

- `src/screens/Profile.tsx:88` now renders `${qty} ${qty === 1 ? noun.singular : noun.plural}`, using the catalog nouns that `src/data/categories.test.ts:82-87` already asserts (`celular`/`celulares`). The Perfil list now matches the celebration's "2 celulares". This resolves the iteration-1 PROF-01 style note.
- **Singular path**: by code reading it is correct ("1 celular", "1 lâmpada fluorescente"). No test asserts it, and the sensor shows this (I2-3 survived). PROF-01 (`spec.md:315`) defines no item format, so this is an untested cosmetic branch, not a failed AC. It is non-blocking. See Fix I2-1.
- **No other evidence changed**: the diff touches only `e2e/gallery.spec.ts` (added test), `e2e/profile.spec.ts:59`, `src/gallery/fixtures.tsx:88-89` and `src/screens/Profile.tsx:88`. Every other per-AC citation above is still valid. The 77 pre-existing e2e tests and 265 unit tests still pass.

### Discrimination sensor (iteration 2)

Scratch: a detached `git worktree` at `%TEMP%\recicla-sensor` (HEAD `080957a`, `node_modules` junction). Each mutant ran `npm run build` and then `playwright test e2e/gallery.spec.ts e2e/profile.spec.ts`, and was reverted with `git checkout -- src` inside the scratch.

| # | File:line | Mutation | Result |
| - | --------- | -------- | ------ |
| I2-1 | `src/gallery/fixtures.tsx:89` | S13 `pointId={3}` → `{1}` (the iteration-1 state) | ✅ Killed: `e2e/gallery.spec.ts:36` failed (message below the frame), 10 passed |
| I2-2 | `src/gallery/fixtures.tsx:89` | S13 `initialDate="2026-11-16"` → `"2026-11-17"` (Tue, point 3 has slots 08–13) | ✅ Killed: `e2e/gallery.spec.ts:36` failed (message absent), 10 passed |
| I2-3 | `src/screens/Profile.tsx:88` | singular branch → `noun.plural` ("1 celulares") | ❌ Survived (11 passed). No test books qty 1 and checks Perfil. Non-blocking, see Fix I2-1. |

**Result**: 3 injected, 2 killed, 1 survived. The two GAL-01 mutants (the blocking gap) are both killed. The survivor is in an unspecified cosmetic branch.

### Porcelain

- Before the sensor: `?? .screens/`, `?? .specs/features/recicla-e-prototype/validation.md`
- After the sensor (worktree removed, junction removed first with `rmdir`, real `node_modules` intact, `git worktree list` shows only the main tree): `?? .screens/`, `?? .specs/features/recicla-e-prototype/validation.md`. It is identical to the baseline.

### Fix I2-1 (Minor, non-blocking): assert the singular noun in Perfil

- **What**: add an e2e case (or extend `e2e/profile.spec.ts:39-60`) that books 1 celular and expects the Perfil booking to contain `'1 celular'` and not `'celulares'`.
- **Why**: kills mutant I2-3 and locks the singular branch added in `080957a`.

### Verdict (iteration 2)

**PASS**. No blocking gap remains. GAL-01 / Goal 5 is closed with a discriminating test. One Minor follow-up remains (Fix I2-1, the untested singular wording), and the spec does not require it.

**Lesson candidate** (Python unavailable, so it was not recorded with `lessons.py`): when a fix adds a conditional branch (singular/plural), the fix's test must cover each branch, not only the one that was reported. Grounded in surviving mutant I2-3.

# recicla-E HTML Prototype Specification

**Revision:** 3 (after Codex review rounds 1–2, 2026-11-13)

## Problem Statement

People keep obsolete electronics at home or throw them in the regular trash because they don't know what is dangerous, where to take it, or why it matters. recicla-E is an educational app that teaches the risks of storing and discarding e-waste incorrectly and points the user to the nearest collection point for each type of device. This feature delivers a clickable HTML prototype (no backend) to validate the concept and import into Figma.

## Goals

- [ ] From the home map in its fresh state ("Todos", empty search), a user reaches the details of the nearest point accepting a chosen category in 2 taps (category chip → first list item).
- [ ] A new user reaches the home map from login without answering onboarding in ≤ 2 taps after typing credentials ("Entrar" → "Pular e ver mapa").
- [ ] Every category and sub-type has a danger level with a justification, "Por que não guardar", "Como descartar" (with its Brazilian reverse-logistics stream), "O que causa ao meio ambiente", and at least one approved fact.
- [ ] Every educational quantitative claim in the UI comes from the Approved Content Catalog and shows a "Fonte" note.
- [ ] Every screen state in the Screen Inventory appears as a captioned frame in `gallery.html`.

## Out of Scope

| Feature | Reason |
| ------- | ------ |
| Real backend, real accounts, real scheduling | Prototype only; all data is mocked |
| Multiple user accounts | One shared demo identity (see Assumptions) |
| Real map tiles / GPS | User chose an illustrated map |
| Real collection-point data | Points are fictional to avoid showing wrong info for real businesses |
| Turn-by-turn navigation | "Como chegar" draws a route on the illustrated map only |
| Gamification (XP, streaks, leagues) | Not in the brief |
| Desktop layout | Prototype targets a 390×844 phone frame |
| Automated verification of html.to.design import | Third-party plugin; checked manually by the user |

---

## Assumptions & Open Questions

### Confirmed by the user

| Decision | Value |
| -------- | ----- |
| Map | Illustrated SVG map of Belo Horizonte, offline |
| City | Belo Horizonte |
| Deliverables | `index.html` (clickable phone prototype) + `gallery.html` (static screen states) |
| Visual style | Playful, Duolingo-like (bright green, chunky rounded buttons with 3D bottom border, bold friendly type) |
| Impact content | Real published facts with a visible "Fonte"; multiply by quantity only where the source gives a per-unit value |
| Logout | "Sair" ends the session only; "Reiniciar demo" in Perfil erases all saved state |

### Provisional defaults (author's choice, not yet confirmed)

| Assumption | Chosen default | Rationale |
| ---------- | -------------- | --------- |
| Points | The 10 fictional points in Mock Data, in real BH neighborhoods, labeled "Ponto fictício (demonstração)" | Deterministic data; avoids implying real municipal facilities |
| User location | Fixed, in Funcionários; distances are fixed mock values | No GPS on an illustrated map |
| Categories and sub-types | 8 categories, 14 sub-types (see Mock Data) | Covers the brief; sub-types carry different hazards and collection streams |
| Danger scale | "Escala educativa recicla-E": level = toxicidade (0–3) + risco de fogo (0–2), clamped 1–5, from `research.md` §10, with one documented override (lithium → 5) | Defensible, reviewable basis, clearly labeled as an educational model |
| Danger emojis | 1 🙂 Baixo, 2 😐 Moderado, 3 😟 Alto, 4 😨 Muito alto, 5 ☠️ Crítico | "Duolingo-style" scale from the brief |
| Mascot | "Reci", a friendly battery drawn in inline SVG | Fits the playful style |
| Font | System rounded stack (`ui-rounded, "SF Pro Rounded", "Segoe UI", system-ui, sans-serif`) | Keeps the prototype fully offline |
| UI language | Brazilian Portuguese | Brief and audience are Brazilian |
| Onboarding question | "Você tem este aparelho parado em casa?" | Devices in use are not waste |
| Identity | One demo identity. Name = the name typed at sign-up; if the user only logged in, the part of the email before "@" | Prototype has no accounts |
| Auth | Any email containing "@" + password ≥ 6 chars logs in | Prototype |
| Persistence | `localStorage`: session, name, onboarding-done flag + answers, bookings | Reload keeps state for reviewers |
| Booking availability | Hourly slots from opening hour to one hour before closing; closed days disabled; slots already past today hidden | Deterministic, realistic |
| Phone frame | 390×844 (iPhone 14) | Common Figma frame |

**Open questions:** none blocking. Provisional defaults stand unless the user overrides them.

---

## Mock Data

### Categories and sub-types

| Category id | Label | Sub-types (id → label) | Category level shown on cards/lists |
| ----------- | ----- | ---------------------- | ----------------------------------- |
| pilhas | Pilhas | `pilha` Pilha comum/alcalina | 2 |
| baterias | Baterias | `bateria-litio` Bateria de lítio (celular, notebook, power bank); `bateria-automotiva` Bateria automotiva (chumbo-ácido) | 5 |
| celulares | Celulares | `celular` Celular | 4 |
| computadores | Computadores e notebooks | `notebook` Notebook; `desktop` Computador de mesa | 4 |
| linhabranca | Geladeiras e linha branca | `geladeira` Geladeira/freezer; `linhabranca-outros` Outros (lavadora, micro-ondas, fogão elétrico) | 3 |
| tvs | TVs e monitores | `tv-tubo` TV/monitor de tubo (CRT); `tv-lcd` TV/monitor LCD antigo (até ~2009); `tv-led` TV/monitor LED | 4 |
| lampadas | Lâmpadas | `lampada-fluorescente` Fluorescente; `lampada-led` LED | 3 |
| cabos | Cabos e carregadores | `cabos` Cabos e carregadores | 1 |

Sub-type levels follow `research.md` §10: bateria-litio 5 (override: T2+F2=4, raised to 5 because lithium thermal runaway is the most dangerous home-storage risk), bateria-automotiva 4, notebook 4, desktop 2, geladeira 3, linhabranca-outros 3, tv-tubo 4, tv-lcd 2, tv-led 1, lampada-fluorescente 3, lampada-led 1, others equal to their category. Power banks belong to `bateria-litio`, never to `cabos`. Category level = the highest sub-type level.

### Collection points (fictional, real neighborhoods)

| # | Name | Neighborhood | Distance | Accepts (sub-types) | Hours |
| - | ---- | ------------ | -------- | ------------------- | ----- |
| 1 | Coleta Verde Savassi | Savassi | 0,8 km | pilha, bateria-litio, celular, cabos, lampada-fluorescente, lampada-led | Seg–Sex 8h–18h, Sáb 8h–12h |
| 2 | Recicla Centro | Centro | 1,6 km | pilha, celular, notebook, desktop, tv-lcd, tv-led, cabos | Seg–Sex 9h–17h |
| 3 | Coleta Lourdes | Lourdes | 1,9 km | pilha, lampada-fluorescente, lampada-led | Seg–Sáb 8h–14h |
| 4 | Santa Efigênia Eletro | Santa Efigênia | 2,4 km | bateria-litio, celular, notebook, desktop, tv-tubo, tv-lcd, tv-led, cabos | Seg–Sex 8h–18h |
| 5 | Ponto Verde Cidade Nova | Cidade Nova | 5,2 km | geladeira, linhabranca-outros, notebook, desktop, tv-tubo, tv-lcd, tv-led | Seg–Sex 8h–16h |
| 6 | Buritis Recicla | Buritis | 6,1 km | pilha, bateria-litio, celular, cabos | Seg–Sáb 9h–17h |
| 7 | Central de Coleta Pampulha | Pampulha | 9,4 km | all 14 sub-types | Seg–Dom 8h–17h |
| 8 | Pampulha Lâmpadas & Pilhas | Pampulha | 9,8 km | pilha, bateria-litio, lampada-fluorescente, lampada-led | Seg–Sex 9h–15h |
| 9 | Barreiro Coleta | Barreiro | 12,3 km | celular, notebook, desktop, geladeira, linhabranca-outros, tv-tubo, tv-lcd, tv-led | Seg–Sex 8h–17h |
| 10 | Venda Nova Eletro | Venda Nova | 13,7 km | celular, notebook, desktop, geladeira, linhabranca-outros, cabos | Seg–Sáb 8h–16h |

A point **accepts a category** when it accepts at least one of that category's sub-types. Each point has a fictional address and a fictional phone `(31) 3000-00NN` (NN = point number). Distances are unique; if data changes, ties break by name A→Z.

Derived category acceptance (used by tests): pilhas 1,2,3,6,7,8 · baterias 1,4,6,7,8 · celulares 1,2,4,6,7,9,10 · computadores 2,4,5,7,9,10 · linhabranca 5,7,9,10 · tvs 2,4,5,7,9 · lampadas 1,3,7,8 · cabos 1,2,4,6,7,10.

---

## Approved Content Catalog

All educational text (card facts, tips, category pages, celebration and profile impact) comes from one catalog in the prototype's data file. Rules:

- CAT-R1: Each entry has: id, text (pt-BR), applicable sub-types, source name + URL from `research.md`, and optionally a per-unit value (number + unit + qualifier "cerca de" / "até").
- CAT-R2: Entries marked "duvidosa", listed in `research.md` §11 ("Claims to avoid"), or without a source are excluded.
- CAT-R3: Entries keep the qualifiers of their source (year, geography, "estimativa", subtype condition such as "aparelhos com CFC").
- CAT-R4: Only these per-unit values may be multiplied by a booked quantity: `lampada-fluorescente` mercúrio cerca de 4 mg; `tv-tubo` chumbo cerca de 1,8 kg; `bateria-automotiva` chumbo até 8 kg; `celular` cobre cerca de 9 g and cobalto cerca de 3,5 g (estimativa UNEP 2009). Any other entry is shown unmultiplied.
- CAT-R5: Multiplied values are phrased as material contained in the items ("Os 2 celulares que você vai entregar contêm cerca de 18 g de cobre"), never as an amount recovered or pollution avoided.
- CAT-R6: The catalog contains at least 12 tips, a BH note ("As URPVs de BH não recebem eletrônicos, pilhas nem lâmpadas"), and at least one entry per sub-type.

---

## Screen Inventory

Every state exists in `index.html` and as one frame in `gallery.html` (18 frames).

| # | Screen state |
| - | ------------ |
| S1 | Login |
| S2 | Login with validation errors |
| S3 | Cadastro (sign-up) |
| S4 | Onboarding card (with progress) |
| S5 | Onboarding summary with devices |
| S6 | Onboarding summary, no devices |
| S7 | Home map, default, with mascot tip balloon |
| S8 | Home map, filtered by a category |
| S9 | Home map, no results |
| S10 | Point detail |
| S11 | Point detail with route ("Como chegar") |
| S12 | Scheduling form |
| S13 | Scheduling, day with no slots |
| S14 | Celebration / impact after booking |
| S15 | Aprender list |
| S16 | Device page (Aprender detail) |
| S17 | Perfil, no bookings |
| S18 | Perfil with bookings |

---

## User Stories

### P1: Login and sign-up ⭐ MVP

**User Story**: As a user, I want to log in or create an account so that I can enter the app.

**Acceptance Criteria**:

1. AUTH-01: WHEN the prototype opens with no saved session THEN the system SHALL show the login screen (S1) with email, senha, "Entrar" and "Criar conta".
2. AUTH-02: WHEN the prototype opens with a saved session THEN the system SHALL open the home map if onboarding is done, otherwise the onboarding.
3. AUTH-03: WHEN the user taps "Criar conta" THEN the system SHALL show the sign-up form (S3) with nome, email, senha and "Cadastrar".
4. AUTH-04: IF, when "Entrar" or "Cadastrar" is tapped, the email has no "@" THEN the system SHALL show "Informe um email válido" under the email field and stay on the screen.
5. AUTH-05: IF, when "Entrar" or "Cadastrar" is tapped, the password has fewer than 6 characters THEN the system SHALL show "A senha precisa ter pelo menos 6 caracteres" under the password field and stay on the screen.
6. AUTH-06: IF, when "Cadastrar" is tapped, the nome is empty THEN the system SHALL show "Informe seu nome" under the nome field and stay on the screen.
7. AUTH-07: WHEN valid credentials are submitted and onboarding is not done THEN the system SHALL save the session and open the onboarding.
8. AUTH-08: WHEN valid credentials are submitted and onboarding is done THEN the system SHALL save the session and open the home map.
9. AUTH-09: WHEN the user taps "Já tenho conta" on the sign-up form THEN the system SHALL return to the login screen.
10. AUTH-10: WHEN sign-up succeeds THEN the system SHALL store the typed nome as the demo identity's name.
11. AUTH-11: WHEN login succeeds and no name is stored THEN the system SHALL store the part of the email before "@" as the name.

**Independent Test**: Submit invalid fields and see each error; sign up as "Ana" and land on onboarding; reload and stay logged in.

---

### P1: Swipe onboarding ("tinder" of devices) ⭐ MVP

**User Story**: As a new user, I want to swipe through device cards and say which ones I have stored at home so that the app shows me how dangerous they are, how to discard them, and where the nearest collection point is.

**Acceptance Criteria**:

1. ONB-01: WHEN onboarding starts THEN the system SHALL show a stack of 8 cards, one per category, each with emoji illustration, name, category danger scale, and one approved fact.
2. ONB-02: WHILE onboarding is active the system SHALL show a progress bar and the text "N de 8", where N is the current card number.
3. ONB-03: WHILE onboarding is active the system SHALL hide the bottom tab bar.
4. ONB-04: WHEN the user swipes a card right or taps ✅ THEN the system SHALL record the category as "tenho".
5. ONB-05: WHEN the user swipes a card left or taps ✕ THEN the system SHALL record the category as "não tenho".
6. ONB-06: WHEN a card is answered THEN the system SHALL show the next card.
7. ONB-07: IF a card receives a second answer while its exit animation runs THEN the system SHALL ignore the second answer.
8. ONB-08: WHEN the user taps "Pular e ver mapa" THEN the system SHALL mark onboarding as done and open the home map with a reset handoff.
9. ONB-09: WHEN the last card is answered THEN the system SHALL mark onboarding as done and show the summary (S5) listing each "tenho" category with its danger level, a one-line "como descartar", and its nearest accepting point.
10. ONB-10: The summary SHALL show a mini map with the user's dot and one pin per distinct nearest point listed.
11. ONB-11: IF no category was recorded as "tenho" THEN the summary (S6) SHALL show "Ótimo! Você não tem lixo eletrônico parado em casa." and the "Ir para o mapa" button.
12. ONB-12: WHEN the user taps "Ir para o mapa" on a summary with devices THEN the system SHALL open the home map with a category handoff of exactly the "tenho" categories.
13. ONB-13: WHEN the user taps "Ir para o mapa" on the empty summary THEN the system SHALL open the home map with a reset handoff.

**Independent Test**: Answer ✅ on Celulares and Pilhas and ✕ on the rest; the summary lists exactly those two, with Coleta Verde Savassi as nearest for both and one pin on the mini map.

---

### P1: Home map with filters and search ⭐ MVP

**User Story**: As a user, I want to see collection points around me and filter them by device type so that I find where to take my item quickly.

**Acceptance Criteria**:

1. MAP-01: The home map SHALL show the illustrated BH map, the user's location dot, a search field, a row of filter chips ("Todos" + 8 categories), a bottom sheet listing the visible points, and the label "Pontos fictícios (demonstração)".
2. MAP-02: WHEN the home map opens without a handoff THEN the system SHALL keep the filters and search text it had the last time it was shown ("Todos" and empty search on first open).
3. MAP-03: WHEN the home map opens with a category handoff THEN the system SHALL select exactly the handed-off categories and clear the search text.
4. MAP-04: WHEN the home map opens with a reset handoff THEN the system SHALL select "Todos" and clear the search text.
5. MAP-05: WHEN the user taps an unselected category chip THEN the system SHALL select it and deselect "Todos".
6. MAP-06: WHEN the user taps a selected category chip that is not the only selection THEN the system SHALL deselect it.
7. MAP-07: WHEN the user taps "Todos", or taps the only selected category chip THEN the system SHALL select "Todos" and clear all category selections.
8. MAP-08: WHILE one or more categories are selected the system SHALL show only points accepting at least one selected category.
9. MAP-09: WHILE the search field contains text the system SHALL show only points whose name, neighborhood, or accepted category labels contain the text, ignoring case and accents.
10. MAP-10: WHILE both a category selection and search text are active the system SHALL show only points satisfying both.
11. MAP-11: The bottom sheet SHALL list visible points by ascending distance, each with name, neighborhood, distance ("0,8 km"), and accepted-category emojis.
12. MAP-12: IF no point is visible THEN the system SHALL show "Nenhum ponto encontrado" and a "Limpar filtros" button.
13. MAP-13: WHEN the user taps "Limpar filtros" THEN the system SHALL select "Todos" and clear the search text.

**Independent Tests** (each from fresh state): select "Geladeiras e linha branca" → points 5, 7, 9, 10 in that order; search "pampulha" → points 7, 8; select "Geladeiras e linha branca" then search "pampulha" → point 7 only; search "xyz" → empty state.

---

### P1: Collection point details ⭐ MVP

**User Story**: As a user, I want to tap a collection point and see what it accepts, its hours, phone and scheduling so that I know if I can go there.

**Acceptance Criteria**:

1. PT-01: WHEN the user taps a pin or a list item THEN the system SHALL open the point detail (S10) with name, address, distance, accepted sub-types grouped by category as emoji chips, opening hours, phone, "Como chegar" and "Agendar entrega".
2. PT-02: The point detail SHALL show a "Como levar" section with one preparation tip per accepted sub-type, taken from the catalog.
3. PT-03: The point detail SHALL show a "Por que descartar aqui" line naming the reverse-logistics stream of each accepted sub-type.
4. PT-04: The phone SHALL be a `tel:` link.
5. PT-05: The point detail SHALL show the label "Ponto fictício (demonstração)".
6. PT-06: WHEN the user taps "Como chegar" THEN the system SHALL show the map with a dashed route from the user's dot to the point and a "Fechar rota" button (S11).
7. PT-07: WHEN the user taps "Fechar rota" THEN the system SHALL return to the point detail.
8. PT-08: WHEN the user taps the back arrow on the point detail THEN the system SHALL return to the screen it was opened from with its state unchanged.

**Independent Test**: Tap pin 1; see all fields and the fictional label; open and close the route; go back and see the same filters.

---

### P1: Scheduling and environmental impact ⭐ MVP

**User Story**: As a user, I want to schedule a drop-off and see how my action helps the environment so that I feel motivated to discard correctly.

**Acceptance Criteria**:

1. SCH-01: WHEN the user taps "Agendar entrega" THEN the system SHALL show the scheduling form (S12) listing only the sub-types the point accepts, grouped by category, each with a quantity stepper.
2. SCH-02: The quantity stepper SHALL accept integers from 0 to 20, with "−" disabled at 0 and "+" disabled at 20.
3. SCH-03: The form SHALL show the next 7 days starting today, with days the point is closed disabled.
4. SCH-04: WHEN the user selects a day THEN the system SHALL show that day's hourly slots from opening hour to one hour before closing, hiding slots already past, and clear any previously selected slot.
5. SCH-05: IF the selected day has no remaining slots THEN the system SHALL show "Sem horários disponíveis neste dia" (S13).
6. SCH-06: WHILE total quantity is 0, or no day, or no slot is selected the system SHALL disable "Confirmar agendamento".
7. SCH-07: WHEN the user confirms THEN the system SHALL save the booking (point, sub-types, quantities, day, slot).
8. SCH-08: WHEN a booking is saved THEN the system SHALL show the celebration screen (S14) with the mascot, confetti, and booking summary.
9. SCH-09: The celebration screen SHALL show, per booked sub-type, at least one catalog entry applicable to that sub-type, with a "Fonte" note.
10. SCH-10: WHERE a booked sub-type has a multipliable value (CAT-R4) the celebration screen SHALL show that value × booked quantity, phrased per CAT-R5.
11. SCH-11: The celebration screen SHALL describe impact as potential ("ao entregar, você vai…"), never as already achieved.
12. SCH-12: WHEN the user taps the back arrow on the scheduling form THEN the system SHALL return to the point detail without saving.

**Independent Test**: At point 1, schedule 2 celulares; the celebration shows "contêm cerca de 18 g de cobre" and "cerca de 7 g de cobalto" with Fonte. At point 3, schedule 1 lâmpada LED; the celebration shows a qualitative LED fact and no multiplied number.

---

### P1: Danger scale ⭐ MVP

**User Story**: As a user, I want a visual emoji scale of how harmful each device is so that I grasp the risk at a glance.

**Acceptance Criteria**:

1. SCALE-01: The danger scale SHALL show 5 segments, filling segments 1..N in the level's color, with the level's emoji and label.
2. SCALE-02: Each category and sub-type level SHALL match the Mock Data levels.
3. SCALE-03: WHEN the user taps a scale THEN the system SHALL show a balloon with that item's justification and the note "Escala educativa recicla-E: toxicidade + risco de fogo".

**Independent Test**: Baterias shows 5 ☠️; Lâmpadas page shows Fluorescente 3 😟 and LED 1 🙂; tapping shows the justification and note.

---

### P1: Info tab per device ⭐ MVP

**User Story**: As a user, I want an info tab with details for each electronic so that I understand why not to store it, how to discard it and what damage it causes.

**Acceptance Criteria**:

1. INFO-01: WHEN the user opens the "Aprender" tab THEN the system SHALL list the 8 categories with emoji, name and category danger scale, sorted by level descending, then name A→Z.
2. INFO-02: The Aprender tab SHALL show an "O que é logística reversa?" card explaining the PNRS in plain language and the BH URPV note.
3. INFO-03: WHEN the user taps a category THEN the system SHALL show its page (S16) with: "Por que não guardar em casa", "Como descartar corretamente" (with its Brazilian collection stream), "O que causa ao meio ambiente", and a "Ver pontos de coleta" button.
4. INFO-04: WHERE a category has more than one sub-type the page SHALL show each sub-type's danger scale and guidance separately.
5. INFO-05: Every number on a category page SHALL show a "Fonte" note.
6. INFO-06: WHEN the user taps "Ver pontos de coleta" THEN the system SHALL open the home map with a category handoff of that category.

**Independent Test**: Open Aprender → Lâmpadas; see fluorescent and LED sections with their own scales and Fonte notes; tap the button and see points 1, 3, 7, 8.

---

### P1: Information balloons ⭐ MVP

**User Story**: As a user, I want short tip balloons around the app so that I learn about storage and disposal dangers while I use it.

**Acceptance Criteria**:

1. TIP-01: WHEN the home map opens THEN the system SHALL show a mascot speech balloon with a tip chosen from the catalog's tips.
2. TIP-02: WHEN the user taps "✕" on the mascot balloon THEN the system SHALL hide it until the home map is opened again.
3. TIP-03: WHEN the user taps an "ⓘ" icon next to a section heading THEN the system SHALL show a balloon with a related catalog fact.
4. TIP-04: WHEN the user taps outside an open "ⓘ" balloon THEN the system SHALL close it.

**Independent Test**: Open home, see a tip, close it; go to Aprender and back, see a tip again.

---

### P1: Navigation and profile basics ⭐ MVP

**User Story**: As a user, I want a consistent way to move around the app, see my bookings and log out so that I never get stuck.

**Acceptance Criteria**:

1. NAV-01: WHILE the user is logged in and onboarding is done the system SHALL show a bottom tab bar with "Mapa", "Aprender" and "Perfil" on the three main screens.
2. NAV-02: Every non-main screen (point detail, route, scheduling, device page) SHALL have a back control returning to the screen it was opened from.
3. NAV-03: WHEN the user taps "Voltar ao mapa" on the celebration screen THEN the system SHALL open the home map without a handoff.
4. PROF-01: WHEN the user opens "Perfil" THEN the system SHALL show the stored name, "Itens agendados" (sum of booked quantities), and the list of bookings (point, day, slot, items).
5. PROF-02: IF the user has no booking THEN Perfil (S17) SHALL show "Itens agendados: 0" and an "Agende seu primeiro descarte" button that opens the home map without a handoff.
6. PROF-03: WHEN the user taps "Sair" THEN the system SHALL delete the session and show the login screen, keeping name, onboarding answers and bookings.
7. PROF-04: WHEN the user taps "Reiniciar demo" THEN the system SHALL ask "Apagar todos os dados da demonstração?" with "Cancelar" and "Apagar".
8. PROF-05: WHEN the user confirms "Apagar" THEN the system SHALL erase all saved state and show the login screen.

**Independent Test**: After booking 2 celulares, Perfil shows "Itens agendados: 2"; Sair then log in skips onboarding; Reiniciar demo then log in shows onboarding.

---

### P2: Accumulated potential impact

**User Story**: As a user, I want to see the combined potential impact of my bookings so that I stay motivated.

**Acceptance Criteria**:

1. PROF-06: WHERE bookings include sub-types with multipliable values (CAT-R4) Perfil SHALL show "Impacto potencial" totals per value, summed over all bookings, phrased per CAT-R5, with "Fonte".
2. PROF-07: IF no booked sub-type has a multipliable value THEN Perfil SHALL show "Seus itens vão para a reciclagem certa" with one qualitative catalog fact per booked category instead of totals.

**Independent Test**: Book 2 celulares and 1 lâmpada fluorescente; Perfil shows cobre 18 g, cobalto 7 g, mercúrio 4 mg.

---

### P2: Screen gallery

**User Story**: As a designer, I want all screen states side by side on one page so that I can import them into Figma.

**Acceptance Criteria**:

1. GAL-01: WHEN `gallery.html` opens THEN the system SHALL render the 18 states of the Screen Inventory as static 390×844 frames, each captioned "S# — name".
2. GAL-02: Gallery frames SHALL be rendered by the same components and data as `index.html`.

**Independent Test**: Open `gallery.html` and count 18 captioned frames matching the inventory.

---

## Edge Cases

- EDGE-01: IF `localStorage` is unavailable THEN the system SHALL keep state in memory for the session and work normally.
- EDGE-02: WHEN computing the onboarding summary THEN the system SHALL pick, for each "tenho" category, the nearest point accepting that specific category.
- EDGE-03: WHEN search text has accents removed ("lampada", "efigenia") THEN the system SHALL still match accented data.
- EDGE-04: IF the user stays on the scheduling form after the last slot of today passes THEN the system SHALL keep the shown slots until the user reselects the day.

---

## Non-functional

- NFR-01: The prototype SHALL make no network requests (fonts, images and scripts are inline or local).
- NFR-02: The built `dist/index.html` and `dist/gallery.html` SHALL each work when opened directly from disk; producing them requires `npm run build` (amended by AD-001).
- NFR-03: Every catalog entry SHALL satisfy CAT-R1..R3, checked by an automated test against the catalog data.

---

## Requirement Traceability

Brief → criteria:

| Brief requirement | Criteria |
| ----------------- | -------- |
| Fácil localização dos pontos (prioridade) | MAP-01..13, PT-01, ONB-08, Goal 1 |
| Onde, como, o que levar e por quê | PT-01..03, INFO-03..04 |
| Escala com emoji estilo Duolingo | SCALE-01..03 |
| Onboarding tipo Tinder com perigo, descarte e mapinha | ONB-01..13 |
| Balõezinhos de informação | TIP-01..04, CAT-R6 |
| Filtros por eletrônico | MAP-05..10 |
| Interações sobre contribuição ao meio ambiente | SCH-08..11, PROF-06..07 |
| Login / cadastro | AUTH-01..11 |
| Mapa com minha localização + filtro e pesquisa | MAP-01..13 |
| Ponto: o que descarta, horário, telefone, agendamento | PT-01, PT-04, SCH-01..07 |
| Aba de informações por eletrônico | INFO-01..06 |

| Story | Criteria | Phase | Status |
| ----- | -------- | ----- | ------ |
| P1 Login and sign-up | AUTH-01..11 | Design | Pending |
| P1 Swipe onboarding | ONB-01..13 | Design | Pending |
| P1 Home map | MAP-01..13 | Design | Pending |
| P1 Point details | PT-01..08 | Design | Pending |
| P1 Scheduling and impact | SCH-01..12 | Design | Pending |
| P1 Danger scale | SCALE-01..03 | Design | Pending |
| P1 Info tab | INFO-01..06 | Design | Pending |
| P1 Information balloons | TIP-01..04 | Design | Pending |
| P1 Navigation and profile basics | NAV-01..03, PROF-01..05 | Design | Pending |
| P2 Accumulated potential impact | PROF-06..07 | Design | Pending |
| P2 Screen gallery | GAL-01..02 | Design | Pending |
| Catalog / Edge / NFR | CAT-R1..R6, EDGE-01..04, NFR-01..03 | Design | Pending |

**Coverage:** 95 criteria (89 story/edge/NFR + 6 catalog rules), 0 mapped to tasks.

---

## Success Criteria

- [ ] Goals 1 and 2 pass as Playwright tests with tap counts asserted.
- [ ] Every educational quantitative claim in the UI traces to a catalog entry with a `research.md` source (NFR-03); operational numbers (distances, hours, quantities, dates) match Mock Data and state rules.
- [ ] A Playwright run with all network requests blocked passes (NFR-01).
- [ ] `gallery.html` shows 18 frames; the user confirms the html.to.design import manually.

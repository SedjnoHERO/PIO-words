# SDD — formyprettymom

## 1. Goal

Private travel phrasebook PWA for mom: French + English, same study modes as Dinara, discreet URL so casual visitors do not stumble on it.

**Public URL:** `https://<pages-host>/PIO-words/formyprettymom/`  
**Repo folder:** `formyprettymom/` (sibling of `dinarasecret/`)

Not linked from the spelling app or Dinara. Discovery is by bookmark / direct URL only.

## 2. Product summary

| Aspect | Decision |
|--------|----------|
| Languages | `en` (English), `fr` (French) — UI labels in Russian |
| Content | Tourism: reception, shops, liner/cruise, directions, asking & finding out |
| Entry kinds | `word` (сумка / bag / бэг) and `phrase` (How much… / Сколько стоит? / хау мач) |
| Modes | Same as Dinara: cards (direction, mixed, favorites, weak, multi), games (sprint, match, quiz, type, scramble, memory) |
| Design | Restrained travel aesthetic — cool slate + deep teal, no pink/cute Dinara look |
| PWA | Own icons, name, theme color, offline-first CacheFirst |
| Storage keys | Prefixed `mom-*` so they never collide with Dinara |

## 3. Architecture

```
PIO-words/                    # GitHub Pages site root
  index.html                  # spelling app (unchanged)
  dinarasecret/               # Dinara (unchanged)
  formyprettymom/             # THIS APP
```

Monorepo build (CI):

1. `npm run build` → spelling → `dist/`
2. `dinarasecret/npm run build` → `dinarasecret/dist/`
3. `formyprettymom/npm run build` → `formyprettymom/dist/`
4. Assemble into `site/`, `site/dinarasecret/`, `site/formyprettymom/`

Stack: Vite 6 + React 19 + TS + vite-plugin-pwa (copy pattern from Dinara).

**Code strategy:** fork Dinara sources into `formyprettymom/` (not a shared package). Keeps secret app isolated; copy then adapt branding, types, vocab, theme.

## 4. Domain model

```ts
type AppLanguage = 'en' | 'fr';
type EntryKind = 'word' | 'phrase';

interface WordEntry {
  id: string;
  kind: EntryKind;
  ru: string;                 // Russian gloss
  terms: string[];            // foreign forms
  transcriptions?: string[];  // Russian-phonetic or IPA-like for learner
  topic: string;
  ruVariants?: string[];
}

interface TopicGroup {
  id: string;
  title: string;              // Russian UI title
  words: WordEntry[];
}
```

### Topics (v1)

| id | Title (RU) | Focus |
|----|------------|--------|
| `basics` | Простые слова | have/want/need/can/like + short A2 patterns |
| `reception` | Ресепшен / отель | check-in, keys, wifi, room |
| `shops` | Магазины | prices, sizes, payment |
| `directions` | Как пройти | wayfinding, left/right, landmarks |
| `asking` | Как спросить | polite asks, clarification |
| `liner` | Лайнер / круиз | cabin, deck, excursions |
| `transport` | Транспорт | taxi, bus, tickets |
| `cafe` | Кафе / ресторан | order, bill, allergy |

Level: keep all entries at **A2 or below** — short words and simple travel phrases.

Each topic mixes `word` + `phrase` entries. Modes that need filtering:

- **Только слова** / **Только фразы** — optional filters on home or as study modes `words-only` | `phrases-only` under Cards.
- **По теме** — restore `single-topic` in cards menu (essential for tourism blocks).

## 5. Modes (parity with Dinara)

### Cards

- RU → Foreign, Foreign → RU  
- По теме (`single-topic`)  
- Только слова (`words-only`)  
- Только фразы (`phrases-only`)  
- Избранное, Слабые, Вперемешку, Несколько переводов  

### Games

- Спринт, Соедини пары, Выбор из трёх, Напиши перевод, Собери слово, Память  

Speech: Web Speech for `en-GB` / `fr-FR`. Favorites / weak / activity storage keys: `mom-favorites-v1-{lang}`, `mom-word-stats-v1-{lang}`, `mom-activity-v1-{lang}`.

## 6. Visual design system

| Token | Value | Role |
|-------|-------|------|
| `--bg` | `#f3f5f4` | Soft cool ground |
| `--surface` | `#ffffff` | Cards |
| `--text` | `#1c2422` | Primary text |
| `--text-muted` | `#5f6d68` | Secondary |
| `--accent` | `#1f6f66` | Deep teal |
| `--accent-light` | `#4a9a90` | Hover / light |
| `--accent-soft` | `#e4f2ef` | Soft fills |
| `--border` | `#d5e0dc` | Hairlines |
| Font UI | **Outfit** | Body / buttons |
| Font display | **Fraunces** | Titles / brand |

Tone: quiet travel journal — no hearts, no pink fireworks overload. Keep confetti/praise optional but toned (teal accents). Hero brand: discreet wordmark “English For Travelling” / short Russian subtitle for mom.

PWA:

- `name`: English For Travelling  
- `short_name`: Travelling  
- `theme_color` / `background_color`: `#f3f5f4`  
- Icons: “English For Travelling” wordmark with small compass/plane accent  

## 7. Vocabulary volume (v1 target)

Minimum viable content so all modes work:

- ≥ 8 words + ≥ 8 phrases **per language** overall  
- Prefer ≥ 4–6 entries per topic where possible  
- Transcriptions required for EN and FR (learner-friendly Cyrillic phonetics OK, e.g. `бэг`, `хау мач`)  

EN and FR decks are separate files: `vocabulary.en.ts`, `vocabulary.fr.ts`.

## 8. Implementation phases

### Phase A — Scaffold & design shell

1. Copy `dinarasecret` → `formyprettymom`  
2. Change `base`, PWA manifest, HTML title, package name  
3. Replace CSS tokens + fonts  
4. Swap language type `de|en` → `en|fr`  
5. New PWA icons  
6. Update CI assemble step  

### Phase B — Domain & modes

1. Add `kind` to `WordEntry`  
2. Modes: `words-only`, `phrases-only`, restore `single-topic` in menu  
3. Prefix all localStorage keys with `mom-`  
4. Soften/remove Dinara-specific praise copy; travel-appropriate messages  

### Phase C — Content

1. Author EN tourism vocab (words + phrases, transcriptions)  
2. Author FR tourism vocab  
3. Topic titles in Russian  

### Phase D — Polish

1. Speech langs `en-GB` / `fr-FR`  
2. Build + deploy verify  
3. Smoke: language picker → cards → game → offline  

## 9. Non-goals (v1)

- Shared npm package between Dinara and mom app  
- Backend / accounts  
- Linking from other apps  
- Perfect native TTS quality  
- Full cruise / airline corpus  

## 10. Success criteria

- [ ] App loads only at `/PIO-words/formyprettymom/`  
- [ ] EN and FR selectable; no German  
- [ ] Topics cover tourism asks / directions / shops / reception / liner  
- [ ] Words and phrases distinguishable and filterable  
- [ ] Same core study/game modes as Dinara  
- [ ] Distinct visual identity + PWA icon  
- [ ] Offline-first PWA  
- [ ] CI deploys three apps from `main`  

## 11. File map (target)

```
formyprettymom/
  SDD.md                          # this document
  package.json
  vite.config.ts                  # base /PIO-words/formyprettymom/
  index.html
  public/pwa-192.png, pwa-512.png, apple-touch-icon.png
  src/
    App.tsx
    main.tsx
    styles/global.css             # teal/slate tokens
    types/vocabulary.ts           # en|fr, kind
    data/
      vocabulary.ts
      vocabulary.en.ts
      vocabulary.fr.ts
      modes.ts
      praiseMessages.ts
    components/…                  # forked screens
    hooks/…
    utils/                        # favorites, wordStats, activity, speech
```

## 12. Working rules for agents

1. Always re-read this SDD before large changes.  
2. Do not change Dinara or spelling app unless deploy wiring requires it.  
3. Keep components ≤ ~150 lines; flex only (no `display: grid`).  
4. Code comments in English; user-facing strings in Russian.  
5. Conventional Commits in English.  
6. Prefer extending forked Dinara patterns over inventing new architecture.

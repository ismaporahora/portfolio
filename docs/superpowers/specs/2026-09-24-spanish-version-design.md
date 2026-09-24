# Spanish version of the portfolio — design

Date: 2026-09-24
Status: approved by Ismael in chat, pending implementation plan

## Goal

Add a complete Spanish version of ismenegolla.vercel.app so a recruiter in a
Spanish-speaking search can receive a link and read the whole portfolio in
Spanish. English stays the default. Both languages are reachable from each
other on every page through an `EN / ES` toggle.

## Decisions taken

| Question | Decision |
|---|---|
| URL strategy | Separate static pages under `/es/` (mirror of the English tree). No JS toggle, no in-place text swap. |
| Register | Neutral Spanish. First person as in the English. Calls to action in infinitive ("Leer el caso →"), no `vos`/`tú`. |
| Toggle placement | Home: replaces "Work ↓" top right. Case pages: appended to the right of the case counter, `Case 03 / 05 · EN / ES`. |
| Language detection | None. No redirect on `Accept-Language`, no `localStorage`. The URL is the language. |
| Hidden brand case | `cases/04-brand-for-teachers.dc.html` is not translated (superseded by case 05, not linked). |

## File structure

```
es/index.html
es/cases/01-shipping-design-changes.dc.html
es/cases/02-deciding-not-to-scale.dc.html
es/cases/03-ux-bug-data-model.dc.html
es/cases/04-redesigning-the-core-flow.dc.html
es/cases/05-design-system-in-code.dc.html
```

File names stay in English so every page and its translation share an
identical path below the language prefix; the toggle is "add or remove
`/es`". Vercel serves `es/index.html` at `/es/`.

Spanish pages reference shared resources with absolute paths: `/support.js`,
`/assets/...`, `/favicon.png`, `/apple-touch-icon.png`. No third copy of the
runtime, no duplicated images. The runtime (`support.js`, `dcNameFromPath`)
uses only the file basename, so it behaves identically from `/es/cases/`.

## Toggle

Markup, same IBM Plex Mono style as the surrounding bar. Active language in
the bar's normal text colour, inactive language a link to the counterpart
page:

- Home EN, top right (replaces `Work ↓`): `EN / <a href="/es/">ES</a>`
- Home ES, top right: `<a href="/">EN</a> / ES`
- Case EN, right of counter: `Case 03 / 05 · EN / <a href="/es/cases/…">ES</a>`
- Case ES, right of counter: `Caso 03 / 05 · <a href="/cases/…">EN</a> / ES`

The hero already invites scrolling and the "Where this is going" section has
a "Read the cases →" button, so dropping `Work ↓` loses no navigation.

All internal links inside `es/` point to other `es/` pages (home, previous and
next case, `#work` anchor stays on-page). Navigating never leaves the
language.

## Content

Full translation of all prose in the six pages: hero, case cards, "Where this
is going", both post-its, footer; in each case the top bar, the tag pills,
the status pill, the title, the Role/Timeline/Tools grid, TL;DR, body,
figure captions, callouts, caveats and the previous/next footer links.

Kept untouched: proper nouns (Planificando, FADU/UBA, Claude Code), product
terms that already appear in Spanish in the screenshots (materia, grado),
dates and numbers, `alt` text of images is translated, image files are not.
Spanish is typically 15–20 % longer than English; the hero `h1` uses
`white-space:nowrap` per line and must be re-broken so no line overflows at
phone width.

## Metadata and SEO

- Every page (EN and ES) gets `<html lang="en">` / `<html lang="es">` (the
  English pages currently have no `lang`).
- ES pages: translated `<title>`, `meta description`, `og:title`,
  `og:description`; `og:url` pointing at the `/es/` URL; `og:locale` `es_AR`
  is not set (neutral Spanish, no regional claim).
- Cross `hreflang` on every page pair:
  `<link rel="alternate" hreflang="en" href="…">`,
  `<link rel="alternate" hreflang="es" href="…/es/…">`,
  `<link rel="alternate" hreflang="x-default" href="…">` (English).
- `sitemap.xml` gains the six Spanish URLs with today's `lastmod`.

## Verification

A throwaway script in the scratchpad checks:

1. Every EN page in scope has an ES twin at the mirrored path and vice versa.
2. No `href`/`src` inside `es/` resolves to a path outside `es/` except the
   shared `/support.js`, `/assets/`, `/favicon.png`, `/apple-touch-icon.png`,
   the EN toggle link, `mailto:` and external `https://` links.
3. No relative `../assets` or `./support.js` references remain in `es/`.
4. `hreflang` links are symmetric (EN page → ES URL, ES page → EN URL) and
   match the `og:url` of the target.
5. `sitemap.xml` lists every page in both languages.

Then visual review in the built-in browser at desktop and 375 px width:
toggle on every page, hero line breaks, cards, case top bars, no horizontal
overflow.

## Out of scope

- Translating the hidden brand case.
- Automatic language redirect or remembering the choice.
- A build step or templating to keep the two trees in sync. Content edits
  are made in both files by hand; this is accepted for a six-page site.

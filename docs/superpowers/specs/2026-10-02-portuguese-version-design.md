# Brazilian Portuguese version of the portfolio — design

Date: 2026-10-02
Status: approved by Ismael in chat, pending implementation plan

## Goal

Add a complete Brazilian Portuguese version of ismenegolla.vercel.app, on the
same pattern as the Spanish version
(`docs/superpowers/specs/2026-09-24-spanish-version-design.md`). English stays
the default. All three languages are reachable from each other on every page
through an `EN / ES / PT` toggle.

## Decisions taken

| Question | Decision |
|---|---|
| URL strategy | Separate static pages under `/pt/`, mirroring the English tree, same as `/es/`. |
| Language tag | `pt-BR` in `<html lang>` and `hreflang`. The URL prefix stays short (`/pt/`). |
| Register | Professional Brazilian Portuguese. First person as in the English. Calls to action in infinitive ("Ler o caso →"). `você` if the reader is ever addressed. |
| Anglicisms | Keep the terms the Brazilian tech market uses in English: owner, design system, deploy, bug, feature, handoff, and similar. |
| Toggle | `EN / ES / PT` on all 18 pages, always in that order. |
| Language detection | None, as in Spanish. The URL is the language. |
| Hidden brand case | `cases/04-brand-for-teachers.dc.html` is not translated. |

## File structure

```
pt/index.html
pt/cases/01-shipping-design-changes.dc.html
pt/cases/02-deciding-not-to-scale.dc.html
pt/cases/03-ux-bug-data-model.dc.html
pt/cases/04-redesigning-the-core-flow.dc.html
pt/cases/05-design-system-in-code.dc.html
```

File names stay in English, so every page has the same path below the language
prefix in all three trees. Shared resources use absolute paths: `/support.js`,
`/assets/...`, `/favicon.png`, `/apple-touch-icon.png`. Internal links inside
`pt/` point to other `pt/` pages: `../index.html`, sibling cases, and on-page
anchors.

## Toggle

Same markup and colours as the current two-language toggle. The active
language is a `<span>` in the bar's normal text colour. The other two are
links to the counterpart page, each with its `hreflang` attribute
(`en`, `es`, `pt-BR`).

- Home, top right: `<span>EN / ES / PT</span>`, the whole toggle in one outer
  `<span>`, so the flex bar keeps two children.
- Case pages: `Case 04 / 05 · EN / ES / PT` in English, `Caso 04 / 05 · …` in
  Spanish and Portuguese.

The 12 existing pages (6 EN, 6 ES) change from two languages to three. The 6 new
PT pages are created with the three-language toggle.

### Narrow screens

At 375 px the case top bar is about 8 px too wide for
`← Ismael Menegolla` plus `Caso 04 / 05 · EN / ES / PT`. Without a fix, the
toggle breaks in the middle ("EN /" on one line, "ES / PT" on the next).

Fix on every case page (EN, ES, PT):

- The bar gets `flex-wrap:wrap;gap:6px 16px`.
- The counter-plus-toggle `<span>` gets `white-space:nowrap`.

On a phone the whole block drops under the back link as one unit. On desktop
nothing changes. The home bar fits at 375 px and needs no change.

## Content

Full translation of all prose in the six pages, from the English source. The
Spanish pages are the reference for decisions already taken: which titles were
reworded, what stays untranslated, and how `alt` text was handled.

Kept untouched, as in the English pages:

- Proper nouns: Planificando, FADU/UBA, Claude Code.
- Product terms that appear in Spanish in the English text, such as `materia`.
- The recreated product UI in case 05 (`Nombre del grado`, `1° grado`,
  `✎ Editar`…). The product is in Spanish, and that UI stays in Spanish in
  every language.
- Dates, numbers and image files.

`alt` text is translated.

### Typography

- Brazilian Portuguese uses a spaced travessão: `palavra — aposto — palavra`.
  Every travessão that sets off an aside is preceded by a no-break space
  (U+00A0) instead of a normal space, so it never starts a line.
- Spaced label dashes, such as `TL;DR — …`, follow the same rule.
- Quotation marks are curly double quotes (“ ”).
- The hero `h1` uses one `white-space:nowrap` span per line. It is re-broken
  so no line overflows at 375 px.

## Metadata and SEO

- PT pages: `<html lang="pt-BR">`.
- Every page in all three trees has four alternates:
  `hreflang="en"`, `hreflang="es"`, `hreflang="pt-BR"` and
  `hreflang="x-default"` (English).
- PT pages: translated `<title>`, `meta description`, `og:title` and
  `og:description`, plus their own `og:url` under `/pt/`. The home title keeps
  the job title in English (`Ismael Menegolla — Product Designer`).
- `sitemap.xml` gains the six `/pt/` URLs, with the date of the change as
  `lastmod`.

## Verification

The throwaway checker from the Spanish version is extended to three languages:

1. Each EN page in scope has an ES twin and a PT twin at the mirrored path, and
   no extra pages exist in `es/` or `pt/`.
2. No `href` or `src` inside `pt/` leaves `pt/`. The exceptions are the shared
   absolute resources, the toggle links to the EN and ES twins, `mailto:` and
   external `https://` links.
3. No relative `../assets` or `./support.js` references remain in `es/` or `pt/`.
4. Each page has the four `hreflang` links. Each URL matches the `og:url` of
   its target page.
5. Each page's toggle links to exactly the two other languages, at the
   mirrored path.
6. `sitemap.xml` lists all 18 pages.
7. No untranslated copy remains in `pt/`. The scan looks for the English and
   Spanish fixed strings, plus English function words (`the`, `and`, `with`…)
   in body text. Kept anglicisms (`owner`, `design system`…) are not function
   words, so they pass without an allowlist.

After the checker, a visual review in the built-in browser at desktop width and
375 px:

- the toggle on every page,
- the case top bar wrapping on phones,
- the hero line breaks,
- the cards,
- no horizontal overflow.

## Out of scope

- Translating the hidden brand case.
- Automatic language redirect or remembering the choice.
- A build step or templating to keep three trees in sync. Content edits are
  made in each file by hand, which is acceptable for an 18-page site.

# Spanish Version Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Publish a complete Spanish mirror of the portfolio under `/es/`, reachable from every English page through an `EN / ES` toggle, with correct `lang`, `hreflang` and sitemap entries.

**Architecture:** The site is hand-written static HTML with inline styles and no build step (`index.html`, `cases/*.dc.html`, shared runtime `support.js`). The Spanish version is a second tree of static files under `es/` with the same file names. Shared resources (`/support.js`, `/assets/`, favicons) are referenced with absolute paths from the Spanish tree so nothing is duplicated. A throwaway Python script is the test: it asserts the two trees mirror each other and that links, `hreflang` and the sitemap are consistent.

**Tech Stack:** Static HTML, Python 3.9 (macOS system python, standard library only) for the checker, the built-in browser for visual review. Deployed on Vercel from the `main` branch.

**Spec:** `docs/superpowers/specs/2026-09-24-spanish-version-design.md`

## Global Constraints

- English stays the default at `/`. No `Accept-Language` redirect, no `localStorage`, no JavaScript for the toggle.
- Spanish register: **neutral Spanish, first person, calls to action in infinitive**. Never `vos`, never `tú`, never `usted`. Example: "Leer el caso →", not "Leé el caso →".
- File names under `es/` are identical to the English ones (English slugs). The toggle is "add or remove `/es`".
- Spanish pages reference `/support.js`, `/assets/...`, `/favicon.png`, `/apple-touch-icon.png` with absolute paths. No `../assets`, no `./support.js` inside `es/`.
- Every internal link inside `es/` points to another `es/` page, except the `EN` toggle link.
- Keep untouched: proper nouns (Planificando, FADU/UBA, Claude Code, Vercel, Figma), product terms already in Spanish in the screenshots (`materia`, `grado`, `Pedir cambios`, `Regenerar`), dates, numbers, hex colours, all `style="..."` attributes and all markup structure. Translate `alt` text. Do not rename image files.
- The hidden brand case `cases/04-brand-for-teachers.dc.html` is out of scope.
- Commit after every task. Commit messages in English, imperative, matching the repo's style (`Case 03: ...`, `Case index: ...`). End every commit message with `Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>`.
- Site origin for absolute URLs in metadata: `https://ismenegolla.vercel.app`.

## Glossary (use these exact strings everywhere)

Case titles (used in `<title>`, `<h1>`, index cards, previous/next links):

| EN | ES |
|---|---|
| Rebuilding the core flow | Reconstruir el flujo central |
| Deciding not to scale the product | Decidir no escalar el producto |
| Shipping design changes directly | Cambios de diseño directo a producción |
| A UX bug traced to the data model | Un bug de UX que venía del modelo de datos |
| Carrying the brand into code | Llevar la marca al código |
| Scaling type without breaking hierarchy | Escalar la tipografía sin romper la jerarquía |

Pills and labels:

| EN | ES |
|---|---|
| 01 · Craft | 01 · Oficio |
| 02 · Evidence | 02 · Evidencia |
| 03 · Process | 03 · Proceso |
| 04 · Systems | 04 · Sistemas |
| 05 · Brand | 05 · Marca |
| 06 · Access | 06 · Acceso |
| Shipped | En producción |
| Shipped · 2026 | En producción · 2026 |
| Shipped · in production | En producción |
| Strategic call | Decisión estratégica |
| Deployed 17/6 | En producción · 17/6 |
| Writing this up — October 2026 | En redacción — octubre 2026 |
| Role | Rol |
| Team | Equipo |
| Timeline | Período |
| Tools | Herramientas |
| Status | Estado |
| Size | Tamaño |
| TL;DR — | En resumen — |
| Case NN / 05 | Caso NN / 05 |
| Case studies | Casos de estudio |
| Where this is going | Hacia dónde va esto |
| Read the case → | Leer el caso → |
| Read the cases → | Leer los casos → |
| Next: X → | Siguiente: X → |
| ← All cases | ← Todos los casos |
| Back to all cases → | Volver a todos los casos → |
| Availability | Disponibilidad |
| Currently — | Actualmente — |
| Research · Craft · Shipping | Investigación · Oficio · Producción |
| Context | Contexto |
| The problem | El problema |
| Caveat | Salvedad |
| Before — | Antes — |
| After — | Después — |
| Closing | Cierre |
| Decision N · | Decisión N · |

Toggle markup, verbatim:

```html
<!-- index.html (EN), replaces the "Work ↓" link -->
<span style="color:#F3F2EA">EN</span> / <a href="/es/" hreflang="es" style="color:#9B9A90;text-decoration:none;border-bottom:1px solid #2A2D3A;padding-bottom:2px">ES</a>

<!-- es/index.html (ES) -->
<a href="/" hreflang="en" style="color:#9B9A90;text-decoration:none;border-bottom:1px solid #2A2D3A;padding-bottom:2px">EN</a> / <span style="color:#F3F2EA">ES</span>

<!-- cases/NN-slug.dc.html (EN), replaces <span>Case NN / 05</span> -->
<span>Case NN / 05 · <span style="color:#14161F">EN</span> / <a href="/es/cases/NN-slug.dc.html" hreflang="es" style="color:#6B6A63;text-decoration:none;border-bottom:1px solid #C9C7BA;padding-bottom:2px">ES</a></span>

<!-- es/cases/NN-slug.dc.html (ES) -->
<span>Caso NN / 05 · <a href="/cases/NN-slug.dc.html" hreflang="en" style="color:#6B6A63;text-decoration:none;border-bottom:1px solid #C9C7BA;padding-bottom:2px">EN</a> / <span style="color:#14161F">ES</span></span>
```

`hreflang` head block, verbatim (replace `PATH` with `` for the home or `cases/NN-slug.dc.html` for a case; the same three lines go in both the EN and the ES page of a pair):

```html
<link rel="alternate" hreflang="en" href="https://ismenegolla.vercel.app/PATH">
<link rel="alternate" hreflang="es" href="https://ismenegolla.vercel.app/es/PATH">
<link rel="alternate" hreflang="x-default" href="https://ismenegolla.vercel.app/PATH">
```

Case order and counters (from the English pages; keep them):

| File | Counter | Previous link | Next link |
|---|---|---|---|
| 04-redesigning-the-core-flow | Case 01 / 05 | ← All cases (home) | Next: Deciding not to scale the product → (02) |
| 02-deciding-not-to-scale | Case 02 / 05 | ← Rebuilding the core flow (04) | Next: Shipping design changes directly → (01) |
| 01-shipping-design-changes | Case 03 / 05 | ← Deciding not to scale the product (02) | Next: A UX bug traced to the data model → (03) |
| 03-ux-bug-data-model | Case 04 / 05 | ← Shipping design changes directly (01) | Next: Carrying the brand into code → (05) |
| 05-design-system-in-code | Case 05 / 05 | ← A UX bug traced to the data model (03) | Back to all cases → (home) |

Checker script location (scratchpad, not committed):
`/private/tmp/claude-502/-Users-usuario-portfolio--claude-worktrees-remove-evidence-rebuild-sentences-9f8821/bccbc4ab-c67d-4f84-aa63-e65b10371575/scratchpad/check_i18n.py`
Referred to below as `$CHECK`. Run it from the repo root: `python3 $CHECK`.

---

### Task 1: The i18n checker (the test)

**Files:**
- Create: `$CHECK` (scratchpad, throwaway, not committed)

**Interfaces:**
- Produces: `python3 $CHECK` exits 0 when every check passes and 1 otherwise, printing one `FAIL <check>: <detail>` line per failure and a final `OK` or `N failures`.
- Consumes: nothing; reads `index.html`, `cases/*.dc.html`, `es/**`, `sitemap.xml` from the cwd.

- [ ] **Step 1: Write the checker**

```python
#!/usr/bin/env python3
"""Throwaway checker for the EN/ES mirror of the portfolio. Run from repo root."""
import re, sys, os
from pathlib import Path

ORIGIN = "https://ismenegolla.vercel.app"
PAGES = [  # path below the language root; hidden brand case excluded
    "index.html",
    "cases/01-shipping-design-changes.dc.html",
    "cases/02-deciding-not-to-scale.dc.html",
    "cases/03-ux-bug-data-model.dc.html",
    "cases/04-redesigning-the-core-flow.dc.html",
    "cases/05-design-system-in-code.dc.html",
]
SHARED_ABS = ("/support.js", "/assets/", "/favicon.png", "/apple-touch-icon.png")
fails = []

def fail(check, detail):
    fails.append((check, detail))
    print(f"FAIL {check}: {detail}")

def url_for(lang, page):
    p = "" if page == "index.html" else page
    return f"{ORIGIN}/{p}" if lang == "en" else f"{ORIGIN}/es/{p}"

def read(path):
    try:
        return Path(path).read_text(encoding="utf-8")
    except FileNotFoundError:
        return None

def attrs(html, attr):
    return re.findall(rf'\b{attr}="([^"]*)"', html)

def hreflangs(html):
    out = {}
    for m in re.finditer(r'<link rel="alternate" hreflang="([^"]+)" href="([^"]+)">', html):
        out[m.group(1)] = m.group(2)
    return out

for page in PAGES:
    en_path, es_path = page, f"es/{page}"
    en, es = read(en_path), read(es_path)

    # 1. twins exist
    if en is None:
        fail("twin", f"missing {en_path}"); continue
    if es is None:
        fail("twin", f"missing {es_path}"); continue

    # lang attribute
    if '<html lang="en">' not in en:
        fail("lang", f"{en_path} lacks <html lang=\"en\">")
    if '<html lang="es">' not in es:
        fail("lang", f"{es_path} lacks <html lang=\"es\">")

    # 4. hreflang symmetric and matching og:url
    want = {"en": url_for("en", page), "es": url_for("es", page), "x-default": url_for("en", page)}
    for lang, path, html in (("en", en_path, en), ("es", es_path, es)):
        got = hreflangs(html)
        if got != want:
            fail("hreflang", f"{path}: got {got}, want {want}")
        og = re.search(r'<meta property="og:url" content="([^"]+)">', html)
        if not og or og.group(1) != url_for(lang, page):
            fail("og:url", f"{path}: got {og.group(1) if og else None}, want {url_for(lang, page)}")

    # toggle present
    es_target = "/es/" if page == "index.html" else f"/es/{page}"
    en_target = "/" if page == "index.html" else f"/{page}"
    if f'href="{es_target}" hreflang="es"' not in en:
        fail("toggle", f"{en_path} has no ES toggle link to {es_target}")
    if f'href="{en_target}" hreflang="en"' not in es:
        fail("toggle", f"{es_path} has no EN toggle link to {en_target}")
    if "Work ↓" in en or "Work ↓" in es:
        fail("toggle", f"{page}: 'Work ↓' link still present")

    # 2 + 3. every href/src in the ES page stays inside es/ or is a shared absolute resource
    es_dir = Path(es_path).parent
    for ref in attrs(es, "href") + attrs(es, "src"):
        if ref.startswith(("http://", "https://", "mailto:", "#")):
            continue
        if ref == en_target:  # the EN toggle
            continue
        if ref.startswith(SHARED_ABS):
            local = ref.lstrip("/")
            if not ref.startswith("/assets/") and not Path(local).exists():
                fail("shared", f"{es_path}: {ref} does not exist")
            continue
        if ref.startswith("/") and not ref.startswith("/es/"):
            fail("leak", f"{es_path}: absolute link leaves es/: {ref}")
            continue
        if ".." in ref or ref.startswith("./"):
            fail("relative", f"{es_path}: relative path to shared resource: {ref}")
            continue
        target = (es_dir / ref).resolve() if not ref.startswith("/") else Path(ref.lstrip("/")).resolve()
        if not str(target).startswith(str(Path("es").resolve())):
            fail("leak", f"{es_path}: link leaves es/: {ref}")
        elif not target.exists():
            fail("dangling", f"{es_path}: {ref} -> {target} does not exist")

    # untranslated markers that always indicate a missed string
    for needle in ("Read the case", "Read the cases", "Case studies", "Where this is going",
                   "Next: ", "All cases", "Back to all cases", "TL;DR", ">Role<", ">Timeline<", ">Tools<"):
        if needle in es:
            fail("untranslated", f"{es_path}: contains '{needle}'")

# 5. sitemap lists both languages
sm = read("sitemap.xml") or ""
for page in PAGES:
    for lang in ("en", "es"):
        u = url_for(lang, page)
        if f"<loc>{u}</loc>" not in sm:
            fail("sitemap", f"missing {u}")

if fails:
    print(f"{len(fails)} failures"); sys.exit(1)
print("OK")
```

- [ ] **Step 2: Run it and confirm it fails for the right reason**

Run: `python3 $CHECK`
Expected: many `FAIL twin: missing es/...` lines (six of them), `FAIL sitemap` lines for the six `/es/` URLs, and `6 failures`-or-more at the end, exit code 1. No Python traceback.

- [ ] **Step 3: No commit**

The checker lives in the scratchpad and is not part of the repo.

---

### Task 2: English pages — `lang`, `hreflang`, toggle, sitemap

**Files:**
- Modify: `index.html:2` (`<html>`), `index.html:18-19` (head, after the apple-touch-icon link), `index.html:41` (the `Work ↓` link)
- Modify: `cases/01-shipping-design-changes.dc.html`, `cases/02-deciding-not-to-scale.dc.html`, `cases/03-ux-bug-data-model.dc.html`, `cases/04-redesigning-the-core-flow.dc.html`, `cases/05-design-system-in-code.dc.html`: line 2 (`<html>`), head after `<link rel="apple-touch-icon" ...>`, and the `<span>Case NN / 05</span>` in the top bar
- Modify: `sitemap.xml`

**Interfaces:**
- Produces: English pages that link to `/es/...` twins that do not exist yet (Tasks 3–8 create them).

- [ ] **Step 1: `lang="en"` on all six English pages**

```bash
sed -i '' 's|^<html>$|<html lang="en">|' index.html cases/01-shipping-design-changes.dc.html cases/02-deciding-not-to-scale.dc.html cases/03-ux-bug-data-model.dc.html cases/04-redesigning-the-core-flow.dc.html cases/05-design-system-in-code.dc.html
grep -c '<html lang="en">' index.html cases/0[1-5]-*.html
```
Expected: `1` for each of the six files, `0` for `cases/04-brand-for-teachers.dc.html`.

- [ ] **Step 2: `hreflang` block in every English head**

Insert after the `<link rel="apple-touch-icon" href="/apple-touch-icon.png">` line. For `index.html`:

```html
<link rel="alternate" hreflang="en" href="https://ismenegolla.vercel.app/">
<link rel="alternate" hreflang="es" href="https://ismenegolla.vercel.app/es/">
<link rel="alternate" hreflang="x-default" href="https://ismenegolla.vercel.app/">
```

For each case, with its own file name, e.g. `cases/03-ux-bug-data-model.dc.html`:

```html
<link rel="alternate" hreflang="en" href="https://ismenegolla.vercel.app/cases/03-ux-bug-data-model.dc.html">
<link rel="alternate" hreflang="es" href="https://ismenegolla.vercel.app/es/cases/03-ux-bug-data-model.dc.html">
<link rel="alternate" hreflang="x-default" href="https://ismenegolla.vercel.app/cases/03-ux-bug-data-model.dc.html">
```

One way to do all six:

```bash
for f in index.html cases/01-shipping-design-changes.dc.html cases/02-deciding-not-to-scale.dc.html cases/03-ux-bug-data-model.dc.html cases/04-redesigning-the-core-flow.dc.html cases/05-design-system-in-code.dc.html; do
  p=$([ "$f" = index.html ] && echo "" || echo "$f")
  sed -i '' "s|^<link rel=\"apple-touch-icon\" href=\"/apple-touch-icon.png\">$|&\n<link rel=\"alternate\" hreflang=\"en\" href=\"https://ismenegolla.vercel.app/$p\">\n<link rel=\"alternate\" hreflang=\"es\" href=\"https://ismenegolla.vercel.app/es/$p\">\n<link rel=\"alternate\" hreflang=\"x-default\" href=\"https://ismenegolla.vercel.app/$p\">|" "$f"
done
grep -c 'hreflang=' index.html cases/0[1-5]-*.html
```
Expected: `3` for each of the six files (the brand case stays at `0`). Note: BSD `sed` on macOS accepts `\n` in the replacement with `-i ''`; if the output shows a literal `n`, use `perl -0pi -e` instead.

- [ ] **Step 3: Toggle on the home**

In `index.html`, replace the whole line

```html
    <a href="#work" style="color:#F3F2EA;text-decoration:none;border-bottom:1px solid #2A2D3A;padding-bottom:2px">Work ↓</a>
```
with
```html
    <span><span style="color:#F3F2EA">EN</span> / <a href="/es/" hreflang="es" style="color:#9B9A90;text-decoration:none;border-bottom:1px solid #2A2D3A;padding-bottom:2px">ES</a></span>
```

- [ ] **Step 4: Toggle on the five case pages**

In each case file replace the counter span. Example for `cases/03-ux-bug-data-model.dc.html` (counter `Case 04 / 05`):

```html
    <span>Case 04 / 05</span>
```
becomes
```html
    <span>Case 04 / 05 · <span style="color:#14161F">EN</span> / <a href="/es/cases/03-ux-bug-data-model.dc.html" hreflang="es" style="color:#6B6A63;text-decoration:none;border-bottom:1px solid #C9C7BA;padding-bottom:2px">ES</a></span>
```

Counters per file: 04-redesigning → `Case 01 / 05`, 02-deciding → `Case 02 / 05`, 01-shipping → `Case 03 / 05`, 03-ux-bug → `Case 04 / 05`, 05-design-system → `Case 05 / 05`. Script:

```bash
for f in cases/01-shipping-design-changes.dc.html cases/02-deciding-not-to-scale.dc.html cases/03-ux-bug-data-model.dc.html cases/04-redesigning-the-core-flow.dc.html cases/05-design-system-in-code.dc.html; do
  sed -i '' -E "s|<span>(Case 0[1-5] / 05)</span>|<span>\1 · <span style=\"color:#14161F\">EN</span> / <a href=\"/es/$f\" hreflang=\"es\" style=\"color:#6B6A63;text-decoration:none;border-bottom:1px solid #C9C7BA;padding-bottom:2px\">ES</a></span>|" "$f"
done
grep -n 'hreflang="es" style' cases/0[1-5]-*.html
```
Expected: exactly one match per live case file, none in the brand case.

- [ ] **Step 5: Sitemap**

Append the six Spanish URLs inside `<urlset>` in `sitemap.xml`, `lastmod` `2026-09-24`:

```xml
  <url><loc>https://ismenegolla.vercel.app/es/</loc><lastmod>2026-09-24</lastmod></url>
  <url><loc>https://ismenegolla.vercel.app/es/cases/01-shipping-design-changes.dc.html</loc><lastmod>2026-09-24</lastmod></url>
  <url><loc>https://ismenegolla.vercel.app/es/cases/02-deciding-not-to-scale.dc.html</loc><lastmod>2026-09-24</lastmod></url>
  <url><loc>https://ismenegolla.vercel.app/es/cases/03-ux-bug-data-model.dc.html</loc><lastmod>2026-09-24</lastmod></url>
  <url><loc>https://ismenegolla.vercel.app/es/cases/04-redesigning-the-core-flow.dc.html</loc><lastmod>2026-09-24</lastmod></url>
  <url><loc>https://ismenegolla.vercel.app/es/cases/05-design-system-in-code.dc.html</loc><lastmod>2026-09-24</lastmod></url>
```

- [ ] **Step 6: Run the checker**

Run: `python3 $CHECK`
Expected: only `FAIL twin: missing es/...` lines (six), no `sitemap`, `lang`, `hreflang`, `og:url` or `toggle` failures for the English side (those checks run per pair and are skipped while the twin is missing, so the count is exactly `6 failures`).

- [ ] **Step 7: Open `index.html` and one case in the browser and eyeball the toggle**

Serve the repo root (`python3 -m http.server 8787` in the background, or the built-in browser's preview) and confirm the top-right of the home reads `EN / ES` in the mono style with `ES` underlined, and a case's bar reads `Case 04 / 05 · EN / ES`. The `ES` links 404 for now.

- [ ] **Step 8: Commit**

```bash
git add index.html cases/01-shipping-design-changes.dc.html cases/02-deciding-not-to-scale.dc.html cases/03-ux-bug-data-model.dc.html cases/04-redesigning-the-core-flow.dc.html cases/05-design-system-in-code.dc.html sitemap.xml
git commit -m "EN pages: lang, hreflang, EN/ES toggle, Spanish URLs in the sitemap

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

### Task 3: `es/index.html`

**Files:**
- Create: `es/index.html` (copy of `index.html`, then edited)

**Interfaces:**
- Consumes: English `index.html` as modified in Task 2.
- Produces: the Spanish home, linking to `es/cases/...` files that Tasks 4–8 create.

- [ ] **Step 1: Copy and apply the mechanical rewrites**

```bash
mkdir -p es/cases
cp index.html es/index.html
sed -i '' \
  -e 's|^<html lang="en">$|<html lang="es">|' \
  -e 's|<script src="./support.js"></script>|<script src="/support.js"></script>|' \
  -e 's|src="assets/|src="/assets/|g' \
  -e 's|href="cases/|href="cases/|g' \
  -e 's|<meta property="og:url" content="https://ismenegolla.vercel.app/">|<meta property="og:url" content="https://ismenegolla.vercel.app/es/">|' \
  es/index.html
```
(`href="cases/..."` is already relative to `es/`, so it resolves to `es/cases/...` — that line is a no-op kept for clarity.)

Then replace the toggle line
```html
    <span><span style="color:#F3F2EA">EN</span> / <a href="/es/" hreflang="es" style="color:#9B9A90;text-decoration:none;border-bottom:1px solid #2A2D3A;padding-bottom:2px">ES</a></span>
```
with
```html
    <span><a href="/" hreflang="en" style="color:#9B9A90;text-decoration:none;border-bottom:1px solid #2A2D3A;padding-bottom:2px">EN</a> / <span style="color:#F3F2EA">ES</span></span>
```

- [ ] **Step 2: Head metadata**

```html
<title>Ismael Menegolla — Diseñador de Producto</title>
<meta name="description" content="Busco la forma más directa de resolver un problema, en los dos extremos del proceso: probando con docentes dentro de aulas reales y llevando mis propios cambios de diseño al código en producción.">
<meta property="og:title" content="Ismael Menegolla — Diseñador de Producto">
<meta property="og:description" content="Busco la forma más directa de resolver un problema, en los dos extremos del proceso: probando con docentes dentro de aulas reales y llevando mis propios cambios de diseño al código en producción.">
```
`og:site_name`, `og:image` and dimensions stay. The three `hreflang` lines stay exactly as copied (they are identical on both sides of the pair).

- [ ] **Step 3: Hero**

`h1` (four lines; Spanish is longer, so the third English line is split in two and the accent words move to `personas` and `software`):

```html
<h1 style="font-family:Fraunces,serif;font-weight:600;font-size:clamp(26px,10cqw,64px);line-height:1.06;letter-spacing:-0.01em;margin:0 0 26px"><span style="white-space:nowrap">Diseño de producto,</span><br><span style="white-space:nowrap">de la investigación</span><br><span style="white-space:nowrap">con <em style="font-weight:400;color:#F5D563">personas</em></span><br><span style="white-space:nowrap">al <em style="font-weight:400;color:#F5D563">software</em> real.</span></h1>
```

Lead paragraph:

```
Busco la forma más directa de resolver un problema, en los dos extremos del proceso: probando con docentes dentro de aulas reales y llevando mis propios cambios de diseño al código en producción. Diez años de oficio en diseño — editorial, marca, docencia — aplicados hoy a un producto con IA para escuelas primarias argentinas.
```

Meta row:

```html
<span>Actualmente — <b style="color:#F3F2EA;font-weight:500">Planificando</b></span>
<span>10 años de diseño · 7 años enseñando en FADU/UBA</span>
<span>Buenos Aires · trabajo en español, inglés y portugués</span>
```

Hero post-it:

```
Sí, hice este sitio con IA. El mismo flujo de trabajo con el que llevo cambios de producto a producción en mi trabajo :)
```

- [ ] **Step 4: Case index header**

```html
<h2 ...>Casos de estudio</h2>
<p ...>Cinco casos de 18 meses en Planificando, una herramienta con IA para planificar clases, para docentes de primaria en Argentina.</p>
```

- [ ] **Step 5: The six cards** (pills and status from the Glossary; `Read the case →` → `Leer el caso →` on all five live cards)

Card 01 · Oficio / En producción / `Reconstruir el flujo central`:
```
La V1 era un formulario que hacía las mismas preguntas cada semana y olvidaba las respuestas. Cinco decisiones, en producción, y lo que los primeros 18 días de datos pueden y no pueden decir.
```

Card 02 · Evidencia / Decisión estratégica / `Decidir no escalar el producto`:
```
El equipo explicaba el bajo uso como un problema de relevancia. Pedí datos antes de comprometernos con un rediseño, y apuntaron a otro lado.
```

Card 03 · Proceso / En producción / `Cambios de diseño directo a producción`:
```
Los arreglos de diseño quedaban trabados esperando a un equipo técnico de dos personas. Empecé a implementar los cambios yo mismo con Claude Code, con revisión del equipo técnico antes del merge.
```

Card 04 · Sistemas / En producción · 17/6 / `Un bug de UX que venía del modelo de datos`:
```
Las docentes veían sus grados duplicados. La causa estaba en el modelo de datos, no en la interfaz. Diagnosticado y llevado a producción.
```

Card 05 · Marca / En producción / `Llevar la marca al código`:
```
Rediseñé la marca de Planificando y luego la escribí en el repositorio del producto como tokens y componentes compartidos. Las reglas viven en el código fuente, no en una biblioteca de Figma.
```

Card 06 · Acceso (placeholder, no link) / `Escalar la tipografía sin romper la jerarquía` / status `En redacción — octubre 2026`:
```
Una capa de accesibilidad — modo de alto contraste, escala tipográfica proporcional, un único control persistente — construida para directores de escuela después de ver a uno inclinarse hacia la pantalla. En producción detrás de un flag.
```

- [ ] **Step 6: "Hacia dónde va esto"**

```html
<h2 ...>Hacia dónde va esto</h2>
<p ...>Cuando empecé, pensaba que el diseño era sobre todo oficio visual. Con los años aprendí que la mayoría de los problemas de diseño son problemas de decisión: personas tratando de ponerse de acuerdo sobre qué construir y por qué.</p>
<p ...>La IA cambió la parte del medio. Convertir una decisión en software que funciona se volvió rápido — este año lo pasé llevando mis propios cambios de diseño a producción. Lo que no se volvió más rápido son los extremos: entender qué vale la pena construir y comprobar si funcionó para una persona real. Ahí pongo mi tiempo.</p>
<span>Investigación</span>·<span>Oficio</span>·<span>Producción</span>
```

Availability post-it (appears twice, `.pic-mobile` and `.pic-desktop`; translate both):
```html
<b ...>Disponibilidad</b>
Abierto a roles remotos en LATAM e internacionales. Dispuesto a mudarme por la oportunidad correcta.
```

Buttons row: `Leer los casos →`, email unchanged, `LinkedIn ↗` unchanged, `impresos y trabajos anteriores → Behance ↗`.

Photo `alt` stays `Ismael Menegolla`.

Footer:
```
Esta página está hecha con Claude Code y desplegada en Vercel.
```

- [ ] **Step 7: Sweep for anything left in English**

```bash
grep -n -i -E '\b(the|and|with|from|for|that|this|what|read|case|shipped|design|teacher|work)\b' es/index.html | grep -v -E 'style=|href=|src=|font-family|Claude Code|Planificando|LinkedIn|Behance' 
```
Expected: no prose lines. Anything printed is a missed string; translate it.

- [ ] **Step 8: Run the checker**

Run: `python3 $CHECK`
Expected: `FAIL twin: missing es/cases/...` for the five cases, plus `FAIL dangling: es/index.html: cases/... does not exist` for each of the five card links. No `lang`, `hreflang`, `og:url`, `toggle`, `relative`, `leak` or `untranslated` failure for `es/index.html`.

- [ ] **Step 9: Visual check**

Open `/es/` in the browser at desktop width and at 375 px. The four `h1` lines must not overflow the column (no horizontal scrollbar, no clipped `real.`). If a line overflows at any width, change that page's `clamp(26px,10cqw,64px)` to `clamp(26px,9cqw,58px)` and re-check.

- [ ] **Step 10: Commit**

```bash
git add es/index.html
git commit -m "ES home: Spanish version of the index

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

### Task 4: `es/cases/04-redesigning-the-core-flow.dc.html` (Case 01 / 05)

**Files:**
- Create: `es/cases/04-redesigning-the-core-flow.dc.html` (copy of `cases/04-redesigning-the-core-flow.dc.html`, 140 lines)

**Interfaces:**
- Consumes: the English case as modified in Task 2 (already has `lang`, `hreflang`, toggle).
- Produces: previous/next links to `../index.html` (ES home) and `02-deciding-not-to-scale.dc.html` (ES, Task 5).

- [ ] **Step 1: Copy and apply the mechanical rewrites**

```bash
f=cases/04-redesigning-the-core-flow.dc.html
cp "$f" "es/$f"
sed -i '' \
  -e 's|^<html lang="en">$|<html lang="es">|' \
  -e 's|<script src="./support.js"></script>|<script src="/support.js"></script>|' \
  -e 's|src="../assets/|src="/assets/|g' \
  -e "s|<meta property=\"og:url\" content=\"https://ismenegolla.vercel.app/$f\">|<meta property=\"og:url\" content=\"https://ismenegolla.vercel.app/es/$f\">|" \
  -e "s|<span>Case 01 / 05 · <span style=\"color:#14161F\">EN</span> / <a href=\"/es/$f\" hreflang=\"es\" style=\"color:#6B6A63;text-decoration:none;border-bottom:1px solid #C9C7BA;padding-bottom:2px\">ES</a></span>|<span>Caso 01 / 05 · <a href=\"/$f\" hreflang=\"en\" style=\"color:#6B6A63;text-decoration:none;border-bottom:1px solid #C9C7BA;padding-bottom:2px\">EN</a> / <span style=\"color:#14161F\">ES</span></span>|" \
  "es/$f"
grep -c 'Caso 01 / 05' "es/$f"; grep -c '\.\./assets\|\./support.js' "es/$f"
```
Expected: `1` then `0`.

`href="../index.html"` links (top bar and `← All cases`) already resolve to `es/index.html`; leave them. `href="02-deciding-not-to-scale.dc.html"` resolves to `es/cases/…`; leave it.

- [ ] **Step 2: Head metadata**

```html
<title>Reconstruir el flujo central — Ismael Menegolla</title>
```
Translate `meta name="description"`, `og:title` (same as the title) and `og:description` (same as the description). Keep `og:image` and its dimensions.

- [ ] **Step 3: Translate the page body**

Work top to bottom. Fixed strings from the Glossary: the pill `01 · Oficio`, the status pill (`Shipped` variants → `En producción` variants), `Rol`/`Estado`/`Período` grid labels, `En resumen —` for `TL;DR —`, `Decisión N ·` in headings, `← Todos los casos`, `Siguiente: Decidir no escalar el producto →`. Everything else is prose: translate it in neutral Spanish, first person, preserving paragraph count, emphasis (`<b>`, `<em>`), links and every `style` attribute. Translate `alt` attributes. Leave `Planificando`, `materia`, `grado`, dates, numbers and hex colours as they are. When the English quotes a UI label that appears in Spanish in the screenshot (e.g. `"Regenerar"`), keep the Spanish label and drop the translation gloss if it becomes redundant.

- [ ] **Step 4: Sweep for anything left in English**

```bash
grep -n -i -E '\b(the|and|with|from|for|that|this|what|read|case|shipped|teacher|week|screen|decision)\b' es/cases/04-redesigning-the-core-flow.dc.html | grep -v -E 'style=|href=|src=|font-family|Claude Code|Planificando|data-screen-label'
```
Expected: no prose lines.

- [ ] **Step 5: Run the checker**

Run: `python3 $CHECK`
Expected: no failure line mentions `es/cases/04-redesigning-the-core-flow.dc.html` except `dangling` for the link to `02-deciding-not-to-scale.dc.html` (created in Task 5). `twin` failures remain for the four other cases.

- [ ] **Step 6: Visual check**

Open `/es/cases/04-redesigning-the-core-flow.dc.html` at desktop and 375 px: top bar reads `Caso 01 / 05 · EN / ES`, `h1` fits, images load (they come from `/assets/`), footer links present.

- [ ] **Step 7: Commit**

```bash
git add es/cases/04-redesigning-the-core-flow.dc.html
git commit -m "ES case 01: Reconstruir el flujo central

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

### Task 5: `es/cases/02-deciding-not-to-scale.dc.html` (Case 02 / 05)

**Files:**
- Create: `es/cases/02-deciding-not-to-scale.dc.html` (copy of `cases/02-deciding-not-to-scale.dc.html`, 114 lines)

**Interfaces:**
- Produces: previous link `04-redesigning-the-core-flow.dc.html` (Task 4), next link `01-shipping-design-changes.dc.html` (Task 6), both relative and therefore inside `es/cases/`.

- [ ] **Step 1: Copy and apply the mechanical rewrites**

```bash
f=cases/02-deciding-not-to-scale.dc.html
cp "$f" "es/$f"
sed -i '' \
  -e 's|^<html lang="en">$|<html lang="es">|' \
  -e 's|<script src="./support.js"></script>|<script src="/support.js"></script>|' \
  -e 's|src="../assets/|src="/assets/|g' \
  -e "s|<meta property=\"og:url\" content=\"https://ismenegolla.vercel.app/$f\">|<meta property=\"og:url\" content=\"https://ismenegolla.vercel.app/es/$f\">|" \
  -e "s|<span>Case 02 / 05 · <span style=\"color:#14161F\">EN</span> / <a href=\"/es/$f\" hreflang=\"es\" style=\"color:#6B6A63;text-decoration:none;border-bottom:1px solid #C9C7BA;padding-bottom:2px\">ES</a></span>|<span>Caso 02 / 05 · <a href=\"/$f\" hreflang=\"en\" style=\"color:#6B6A63;text-decoration:none;border-bottom:1px solid #C9C7BA;padding-bottom:2px\">EN</a> / <span style=\"color:#14161F\">ES</span></span>|" \
  "es/$f"
grep -c 'Caso 02 / 05' "es/$f"; grep -c '\.\./assets\|\./support.js' "es/$f"
```
Expected: `1` then `0`.

- [ ] **Step 2: Head metadata**

```html
<title>Decidir no escalar el producto — Ismael Menegolla</title>
```
Translate description, `og:title`, `og:description`. Keep `og:image`.

- [ ] **Step 3: Translate the page body**

Fixed strings: pill `02 · Evidencia`, status `Decisión estratégica`, grid labels `Rol` / `Equipo` / `Período`, `En resumen —`, footer links `← Reconstruir el flujo central` and `Siguiente: Cambios de diseño directo a producción →`. Section headings are prose (e.g. "The explanation we had", "What the data changed", "Two hypotheses the data could not separate", "Why we rebuilt anyway", "The grade as home", "What we left out", "What the bet returned"): translate them in the same voice. Body: neutral Spanish, first person, structure and styles untouched, `alt` translated. Any figure label already in Spanish (`uso diario`) stays.

- [ ] **Step 4: Sweep**

```bash
grep -n -i -E '\b(the|and|with|from|for|that|this|what|read|case|teacher|data|usage|month)\b' es/cases/02-deciding-not-to-scale.dc.html | grep -v -E 'style=|href=|src=|font-family|Claude Code|Planificando|data-screen-label'
```
Expected: no prose lines.

- [ ] **Step 5: Run the checker**

Run: `python3 $CHECK`
Expected: no failure mentions `es/cases/02-deciding-not-to-scale.dc.html` except `dangling` for `01-shipping-design-changes.dc.html` (Task 6). The Task 4 `dangling` failure is gone.

- [ ] **Step 6: Visual check** at desktop and 375 px, as in Task 4.

- [ ] **Step 7: Commit**

```bash
git add es/cases/02-deciding-not-to-scale.dc.html
git commit -m "ES case 02: Decidir no escalar el producto

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

### Task 6: `es/cases/01-shipping-design-changes.dc.html` (Case 03 / 05)

**Files:**
- Create: `es/cases/01-shipping-design-changes.dc.html` (copy of `cases/01-shipping-design-changes.dc.html`, 138 lines)

**Interfaces:**
- Produces: previous link `02-deciding-not-to-scale.dc.html` (Task 5), next link `03-ux-bug-data-model.dc.html` (Task 7).

- [ ] **Step 1: Copy and apply the mechanical rewrites**

```bash
f=cases/01-shipping-design-changes.dc.html
cp "$f" "es/$f"
sed -i '' \
  -e 's|^<html lang="en">$|<html lang="es">|' \
  -e 's|<script src="./support.js"></script>|<script src="/support.js"></script>|' \
  -e 's|src="../assets/|src="/assets/|g' \
  -e "s|<meta property=\"og:url\" content=\"https://ismenegolla.vercel.app/$f\">|<meta property=\"og:url\" content=\"https://ismenegolla.vercel.app/es/$f\">|" \
  -e "s|<span>Case 03 / 05 · <span style=\"color:#14161F\">EN</span> / <a href=\"/es/$f\" hreflang=\"es\" style=\"color:#6B6A63;text-decoration:none;border-bottom:1px solid #C9C7BA;padding-bottom:2px\">ES</a></span>|<span>Caso 03 / 05 · <a href=\"/$f\" hreflang=\"en\" style=\"color:#6B6A63;text-decoration:none;border-bottom:1px solid #C9C7BA;padding-bottom:2px\">EN</a> / <span style=\"color:#14161F\">ES</span></span>|" \
  "es/$f"
grep -c 'Caso 03 / 05' "es/$f"; grep -c '\.\./assets\|\./support.js' "es/$f"
```
Expected: `1` then `0`.

- [ ] **Step 2: Head metadata**

```html
<title>Cambios de diseño directo a producción — Ismael Menegolla</title>
```
Translate description, `og:title`, `og:description`. Keep `og:image`.

- [ ] **Step 3: Translate the page body**

Fixed strings: pill `03 · Proceso`, status `En producción` (variants per Glossary), grid labels `Rol` / `Equipo` / `Período` / `Herramientas`, `En resumen —`, headings `Contexto`, `El problema`, `Cierre`; figure labels `Antes — "Regenerar"` and `Después — "Pedir cambios"`; footer `← Decidir no escalar el producto` and `Siguiente: Un bug de UX que venía del modelo de datos →`. The heading `One change in detail: "Regenerate" → "Request changes"` becomes `Un cambio en detalle: "Regenerar" → "Pedir cambios"` (the product labels are Spanish already). Other headings ("The method change", "What shipped") are prose. Body as in the previous tasks.

- [ ] **Step 4: Sweep**

```bash
grep -n -i -E '\b(the|and|with|from|for|that|this|what|read|case|shipped|team|change|review)\b' es/cases/01-shipping-design-changes.dc.html | grep -v -E 'style=|href=|src=|font-family|Claude Code|Planificando|data-screen-label'
```
Expected: no prose lines.

- [ ] **Step 5: Run the checker**

Run: `python3 $CHECK`
Expected: no failure mentions `es/cases/01-shipping-design-changes.dc.html` except `dangling` for `03-ux-bug-data-model.dc.html` (Task 7).

- [ ] **Step 6: Visual check** at desktop and 375 px.

- [ ] **Step 7: Commit**

```bash
git add es/cases/01-shipping-design-changes.dc.html
git commit -m "ES case 03: Cambios de diseño directo a producción

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

### Task 7: `es/cases/03-ux-bug-data-model.dc.html` (Case 04 / 05)

**Files:**
- Create: `es/cases/03-ux-bug-data-model.dc.html` (copy of `cases/03-ux-bug-data-model.dc.html`, 91 lines)

**Interfaces:**
- Produces: previous link `01-shipping-design-changes.dc.html` (Task 6), next link `05-design-system-in-code.dc.html` (Task 8).

- [ ] **Step 1: Copy and apply the mechanical rewrites**

```bash
f=cases/03-ux-bug-data-model.dc.html
cp "$f" "es/$f"
sed -i '' \
  -e 's|^<html lang="en">$|<html lang="es">|' \
  -e 's|<script src="./support.js"></script>|<script src="/support.js"></script>|' \
  -e 's|src="../assets/|src="/assets/|g' \
  -e "s|<meta property=\"og:url\" content=\"https://ismenegolla.vercel.app/$f\">|<meta property=\"og:url\" content=\"https://ismenegolla.vercel.app/es/$f\">|" \
  -e "s|<span>Case 04 / 05 · <span style=\"color:#14161F\">EN</span> / <a href=\"/es/$f\" hreflang=\"es\" style=\"color:#6B6A63;text-decoration:none;border-bottom:1px solid #C9C7BA;padding-bottom:2px\">ES</a></span>|<span>Caso 04 / 05 · <a href=\"/$f\" hreflang=\"en\" style=\"color:#6B6A63;text-decoration:none;border-bottom:1px solid #C9C7BA;padding-bottom:2px\">EN</a> / <span style=\"color:#14161F\">ES</span></span>|" \
  "es/$f"
grep -c 'Caso 04 / 05' "es/$f"; grep -c '\.\./assets\|\./support.js' "es/$f"
```
Expected: `1` then `0`.

- [ ] **Step 2: Head metadata**

```html
<title>Un bug de UX que venía del modelo de datos — Ismael Menegolla</title>
<meta name="description" content="Las docentes veían grados duplicados. La causa estaba en el modelo de datos, no en la interfaz. Diagnosticado, propuesto y en producción en junio de 2026.">
```
`og:title` = title, `og:description` = description. Keep `og:image`.

- [ ] **Step 3: Translate the page body**

Fixed strings: pill `04 · Sistemas`, status `En producción · 17/6`, grid `Rol` / `Período` / `Herramientas`, `En resumen —`, headings `El problema`, `El diagnóstico`, `La propuesta`, `El arreglo`, `Salvedad` (also in the hidden side nav, `display:none`, translate anyway), footer `← Cambios de diseño directo a producción` and `Siguiente: Llevar la marca al código →`. The TL;DR gloss `a subject (materia)` becomes just `una materia`. Body as before.

- [ ] **Step 4: Sweep**

```bash
grep -n -i -E '\b(the|and|with|from|for|that|this|what|read|case|teacher|grade|subject|fix)\b' es/cases/03-ux-bug-data-model.dc.html | grep -v -E 'style=|href=|src=|font-family|Claude Code|Planificando|data-screen-label'
```
Expected: no prose lines.

- [ ] **Step 5: Run the checker**

Run: `python3 $CHECK`
Expected: no failure mentions `es/cases/03-ux-bug-data-model.dc.html` except `dangling` for `05-design-system-in-code.dc.html` (Task 8).

- [ ] **Step 6: Visual check** at desktop and 375 px.

- [ ] **Step 7: Commit**

```bash
git add es/cases/03-ux-bug-data-model.dc.html
git commit -m "ES case 04: Un bug de UX que venía del modelo de datos

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

### Task 8: `es/cases/05-design-system-in-code.dc.html` (Case 05 / 05)

**Files:**
- Create: `es/cases/05-design-system-in-code.dc.html` (copy of `cases/05-design-system-in-code.dc.html`, 463 lines — the largest page; much of it is design-token demo markup with short labels)

**Interfaces:**
- Produces: previous link `03-ux-bug-data-model.dc.html` (Task 7), `Volver a todos los casos →` to `../index.html` (ES home).

- [ ] **Step 1: Copy and apply the mechanical rewrites**

```bash
f=cases/05-design-system-in-code.dc.html
cp "$f" "es/$f"
sed -i '' \
  -e 's|^<html lang="en">$|<html lang="es">|' \
  -e 's|<script src="./support.js"></script>|<script src="/support.js"></script>|' \
  -e 's|src="../assets/|src="/assets/|g' \
  -e "s|<meta property=\"og:url\" content=\"https://ismenegolla.vercel.app/$f\">|<meta property=\"og:url\" content=\"https://ismenegolla.vercel.app/es/$f\">|" \
  -e "s|<span>Case 05 / 05 · <span style=\"color:#14161F\">EN</span> / <a href=\"/es/$f\" hreflang=\"es\" style=\"color:#6B6A63;text-decoration:none;border-bottom:1px solid #C9C7BA;padding-bottom:2px\">ES</a></span>|<span>Caso 05 / 05 · <a href=\"/$f\" hreflang=\"en\" style=\"color:#6B6A63;text-decoration:none;border-bottom:1px solid #C9C7BA;padding-bottom:2px\">EN</a> / <span style=\"color:#14161F\">ES</span></span>|" \
  "es/$f"
grep -c 'Caso 05 / 05' "es/$f"; grep -c '\.\./assets\|\./support.js' "es/$f"
```
Expected: `1` then `0`.

- [ ] **Step 2: Head metadata**

```html
<title>Llevar la marca al código — Ismael Menegolla</title>
```
Translate description, `og:title`, `og:description`. Keep `og:image`.

- [ ] **Step 3: Translate the page body**

Fixed strings: pill `05 · Marca`, status `En producción` variant, grid `Rol` / `Período` / `Herramientas` / `Tamaño`, `En resumen —`, footer `← Un bug de UX que venía del modelo de datos` and `Volver a todos los casos →`. Section headings are prose (`Why it lives in code`, `The palette, with its rules attached`, `Type: one face, sized in half-pixels`, `v1 → v2, the visual cleanup`, `The primitives, alive`, `Composed: the screen a teacher lands on`, `Three themes from one token sheet`, `Where it's applied`): translate them. Token-sheet labels (`Brand · the single accent`, `Ground & surfaces · warm`, `Ink & borders · four steps each`, `Semantic · each a full set, not one hex`, `Shadows · border-led, flat by default`, `Radii · "redondeado"`, `v1 · accumulated`, `v2 · systematic`, `What v2 dropped`, `Why violet`) are translated too; token names in code font (e.g. `--color-brand-500`, `redondeado`) and hex values stay. Demo UI strings already in Spanish (`Con actividad`, `Recomendado`, `Recurrentes`, `Usuarias nuevas`, `Secuencias creadas`) stay. Any `<script data-dc-script>` or `data-props` content, if present, is not touched.

- [ ] **Step 4: Sweep**

```bash
grep -n -i -E '\b(the|and|with|from|for|that|this|what|read|case|brand|token|component|colour|color)\b' es/cases/05-design-system-in-code.dc.html | grep -v -E 'style=|href=|src=|font-family|Claude Code|Planificando|data-screen-label|--color|var\('
```
Expected: no prose lines (CSS custom-property names like `--color-…` are filtered out).

- [ ] **Step 5: Run the checker**

Run: `python3 $CHECK`
Expected: `OK`, exit 0. This is the first time the whole suite passes.

- [ ] **Step 6: Visual check** at desktop and 375 px: the token grids and the composed screen render identically to the English page (same layout, only labels differ).

- [ ] **Step 7: Commit**

```bash
git add es/cases/05-design-system-in-code.dc.html
git commit -m "ES case 05: Llevar la marca al código

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

### Task 9: Cross-page visual review and hero overflow

**Files:**
- Possibly modify: `es/index.html` (`h1` clamp), any `es/` page where a longer Spanish string overflows

**Interfaces:**
- Consumes: all twelve pages.

- [ ] **Step 1: Serve and walk every page in both languages**

Serve the repo root and, in the built-in browser, visit in this order at desktop width, then again at 375 px (mobile preset):

1. `/` → click `ES` → lands on `/es/` → click `EN` → back on `/`
2. From `/es/`, click each of the five cards; on each case click `EN`, confirm the same case in English, click `ES`, confirm it returns.
3. On each ES case, follow the previous/next footer links through all five and back to `/es/`.

- [ ] **Step 2: Check for overflow**

On every ES page at 375 px, run in the browser console:

```js
document.documentElement.scrollWidth > document.documentElement.clientWidth
```
Expected: `false` on every page. If `true`, find the offending element (`[...document.querySelectorAll('*')].filter(e => e.getBoundingClientRect().right > innerWidth)`) and fix the Spanish string or, for the hero `h1`, lower the clamp as described in Task 3 Step 9.

- [ ] **Step 3: Compare bars side by side**

Take a screenshot of the top bar of `/` and `/es/`, and of one EN case and its ES twin. `EN / ES` must sit at the same height and size as the surrounding mono text; the active language reads in the bar's strong colour, the other is underlined.

- [ ] **Step 4: Run the checker one last time**

Run: `python3 $CHECK`
Expected: `OK`.

- [ ] **Step 5: Commit any fixes**

```bash
git add es/
git commit -m "ES: fit longer strings at phone width

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```
(Skip if nothing changed.)

- [ ] **Step 6: Report**

List for Ismael the twelve URLs, note that he should read the hero, the card summaries and the five TL;DRs in Spanish before merging, and hand the branch to the finishing-a-development-branch skill.

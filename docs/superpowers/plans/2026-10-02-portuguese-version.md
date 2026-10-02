# Brazilian Portuguese Version Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Publish a complete Brazilian Portuguese mirror of the portfolio under `/pt/`, reachable from every page through an `EN / ES / PT` toggle, with correct `lang`, `hreflang` and sitemap entries.

**Architecture:** The site is hand-written static HTML with inline styles and no build step (`index.html`, `cases/*.dc.html`, shared runtime `support.js`). It already has a Spanish mirror under `es/`. The Portuguese version is a third tree under `pt/`, with the same file names. Shared resources (`/support.js`, `/assets/`, favicons) are referenced with absolute paths. Three throwaway Python scripts in the scratchpad do the mechanical work and the testing:
- One script adds PT to the 12 existing pages.
- One script creates each PT twin with its links already rewritten.
- One checker asserts that the three trees mirror each other and that links, `hreflang`, toggles, typography and the sitemap are consistent.

All three scripts were dry-run on a scratch copy of the repo during planning. The narrow-bar fix and the PT hero line breaks were checked in the browser at 375 px.

**Tech Stack:** Static HTML. Python 3.9 (macOS system python, standard library only) for the scripts. The built-in browser for visual review. Deployed on Vercel from `main`.

**Spec:** `docs/superpowers/specs/2026-10-02-portuguese-version-design.md`. The Spanish predecessor is `docs/superpowers/specs/2026-09-24-spanish-version-design.md`, and its pages under `es/` are the reference for translation decisions.

## Global Constraints

- English stays the default at `/`. No `Accept-Language` redirect, no `localStorage`, no JavaScript for the toggle.
- Language tag `pt-BR` in `<html lang>` and `hreflang`. The URL prefix is `/pt/`.
- Register: professional Brazilian Portuguese, in the first person, with calls to action in the infinitive ("Ler o caso →"). Use `você` if the reader is ever addressed. Never `tu`, never European Portuguese forms.
- **Keep these English terms as used in the Brazilian tech market:**
  - owner, design system, deploy, bug, feature, feature flag, handoff, merge, pull request, redesign, token(s), frontend, UX, UI
  - the job title `Product Designer`

  Use `IA`, not `AI`.
- **Teachers are feminine plural, mirroring the Spanish pages** (`las docentes` → `as professoras`, `la docente` → `a professora`, `una docente` → `uma professora`). School directors are `diretores de escola`. Users are `usuários`.
- **The product's `grado` maps to `turma` when it means the class-group object** (e.g. `2° A — Turno Mañana`). When it means the grade level, it is `ano`. The product's `materia` maps to `disciplina`. Where the English glosses the Spanish term, as in `a subject (materia)`, keep the Spanish in parentheses: `uma disciplina (materia)`.
- **Leave these untouched:**
  - proper nouns: Planificando, FADU/UBA, Claude Code, Vercel, Figma
  - every Spanish string the English page shows from the product: UI labels (`Regenerar`, `Pedir cambios`, `¿Qué cambiamos?`), the recreated UI in case 05 (`Nombre del grado`, `1° grado`, `2° A — Turno Mañana`, `✎ Editar`, `Con actividad`, `Usuarias nuevas`…), and Spanish quotes from users and the owner (“se ven un poco grandes”, “lo usa gente grande”)
  - dates as digits, numbers, CSS/token values (`12.5`, `14.5`; keep the dot), hex colours, token names in code font
  - every `style="..."` attribute and all markup structure
- Translate `alt` text and the `data-screen-label` value `Where this is going` (→ `Para onde isso vai`). Other `data-screen-label` values (`Hero`, `Case index`, `Case 0N`…) stay in English, as in `es/`.
- **Typography:**
  - Write every travessão (`—`) in body text as `&nbsp;—`. A no-break space goes before the dash and a normal space after: `palavra&nbsp;— aposto&nbsp;— palavra`. Labels follow the same rule (`Em resumo&nbsp;— `, `Atualmente&nbsp;— `).
  - Head metadata (`<title>`, `meta`, `og:*`) keeps a plain space before `—`.
  - The only body exception is the product string `2° A — Turno Mañana`.
  - Quotation marks are curly double quotes “ ” in prose that the English writes with straight quotes, except inside quoted product UI labels, which keep the English page's quote style.
- File names under `pt/` are identical to the English ones.
- Every internal link inside `pt/` points to another `pt/` page. The exceptions are the EN and ES toggle links.
- The hidden brand case `cases/04-brand-for-teachers.dc.html` is out of scope.
- Commit after every task, with messages in English and in the imperative. End every commit message with `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.
- Site origin for absolute URLs: `https://ismenegolla.vercel.app`. `lastmod` for the new sitemap rows: `2026-10-02`.
- Work in the current worktree, on branch `claude/portuguese-version` (already created from `origin/main`; the spec is committed there).

## Glossary (use these exact strings everywhere)

Case titles (used in `<title>`, `og:title`, `<h1>`, index cards, previous/next links):

| EN | PT |
|---|---|
| Rebuilding the core flow | Reconstruindo o fluxo principal |
| Deciding not to scale the product | Decidindo não escalar o produto |
| Shipping design changes directly | Mudanças de design direto em produção |
| A UX bug traced to the data model | Um bug de UX que vinha do modelo de dados |
| Carrying the brand into code | Levando a marca para o código |
| Scaling type without breaking hierarchy | Escalando a tipografia sem quebrar a hierarquia |

Pills and labels (`&nbsp;` shown where it goes):

| EN | PT |
|---|---|
| 01 · Craft | 01 · Ofício |
| 02 · Evidence | 02 · Evidência |
| 03 · Process | 03 · Processo |
| 04 · Systems | 04 · Sistemas |
| 05 · Brand | 05 · Marca |
| 06 · Access | 06 · Acesso |
| Shipped / Shipped · 2026 / Shipped · in production | Em produção / Em produção · 2026 / Em produção |
| Strategic call | Decisão estratégica |
| Deployed 17/6 | Em produção · 17/6 |
| Writing this up — October 2026 | Em redação&nbsp;— outubro de 2026 |
| Role | Função |
| Team | Equipe |
| Timeline | Período |
| Tools | Ferramentas |
| Status | Status |
| Size | Tamanho |
| TL;DR — | Em resumo&nbsp;— |
| Case NN / 05 | Caso NN / 05 (done by the twin script) |
| Case studies | Estudos de caso |
| Where this is going | Para onde isso vai |
| Read the case → | Ler o caso → |
| Read the cases → | Ler os casos → |
| Next: X → | Próximo: X → |
| ← All cases | ← Todos os casos |
| Back to all cases → | Voltar para todos os casos → |
| Availability | Disponibilidade |
| Currently — | Atualmente&nbsp;— |
| Research · Craft · Shipping | Pesquisa · Ofício · Produção |
| Context | Contexto |
| The problem | O problema |
| Caveat | Ressalva |
| Before — / After — | Antes&nbsp;— / Depois&nbsp;— |
| Closing | Fechamento |
| Decision N · | Decisão N · |
| team (prose) | equipe (`equipe técnica` for "tech team") |
| month names | lowercase, with `de`: `junho de 2026`, `17 de junho` |

Case order and counters (unchanged):

| File | Counter | Previous link | Next link |
|---|---|---|---|
| 04-redesigning-the-core-flow | Caso 01 / 05 | ← Todos os casos (`../index.html`) | Próximo: Decidindo não escalar o produto → |
| 02-deciding-not-to-scale | Caso 02 / 05 | ← Reconstruindo o fluxo principal | Próximo: Mudanças de design direto em produção → |
| 01-shipping-design-changes | Caso 03 / 05 | ← Decidindo não escalar o produto | Próximo: Um bug de UX que vinha do modelo de dados → |
| 03-ux-bug-data-model | Caso 04 / 05 | ← Mudanças de design direto em produção | Próximo: Levando a marca para o código → |
| 05-design-system-in-code | Caso 05 / 05 | ← Um bug de UX que vinha do modelo de dados | Voltar para todos os casos → (`../index.html`) |

Scripts (scratchpad, not committed). Run them from the repo root:

```bash
SP=/private/tmp/claude-502/-Users-usuario-portfolio--claude-worktrees-remove-evidence-rebuild-sentences-9f8821/bccbc4ab-c67d-4f84-aa63-e65b10371575/scratchpad
CHECK=$SP/check_i18n.py      # the test
ADDPT=$SP/add_pt_to_existing.py  # Task 2, run once
MKPT=$SP/make_pt_twin.py     # Tasks 3-8, once per page
```

---

### Task 1: Tooling — checker and the two mechanical scripts

**Files:**
- Create, if missing: `$CHECK`, `$ADDPT`, `$MKPT` (scratchpad, throwaway, not committed)

**Interfaces:**
- Produces:
  - `python3 $CHECK` exits 0 and prints `OK` when every check passes. Otherwise it exits 1, prints one `FAIL <check>: <detail>` line per failure, then `N failures`. The check names are `extra`, `twin`, `lang`, `hreflang`, `og:url`, `toggle`, `narrow`, `sitemap`, `shared`, `leak`, `relative`, `dangling`, `untranslated` and `dash`.
  - `python3 $ADDPT` modifies the 12 EN/ES pages and `sitemap.xml` in place. Every edit asserts exactly one match, so a second run fails loudly instead of duplicating.
  - `python3 $MKPT <page>` creates `pt/<page>` from the English `<page>` and prints `created pt/<page>`. It refuses to overwrite an existing file.

- [ ] **Step 1: Check whether the scripts already exist**

```bash
ls -l $CHECK $ADDPT $MKPT
```
If all three exist, skip to Step 3. The scratchpad can be wiped between sessions. If any is missing, recreate it in Step 2, exactly as written.

- [ ] **Step 2: Write the scripts**

`$CHECK`:

```python
#!/usr/bin/env python3
"""Throwaway checker for the EN/ES/PT mirrors of the portfolio. Run from repo root."""
import re, sys
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
LANGS = {  # code -> (directory prefix, <html lang>, hreflang value)
    "en": ("", "en", "en"),
    "es": ("es/", "es", "es"),
    "pt": ("pt/", "pt-BR", "pt-BR"),
}
SHARED_ABS = ("/support.js", "/assets/", "/favicon.png", "/apple-touch-icon.png")
# Recreated product UI in case 05 is Spanish in every language and keeps its normal-space dash.
PRODUCT_UI_DASH = "2° A — Turno Mañana"
EN_NEEDLES = ("Read the case", "Read the cases", "Case studies", "Where this is going", "Next: ",
              "All cases", "Back to all cases", "TL;DR", ">Role<", ">Timeline<", ">Tools<", ">Team<")
ES_NEEDLES = ("Leer el caso", "Leer los casos", "Casos de estudio", "Hacia dónde va esto", "Siguiente: ",
              "Todos los casos", "Volver a todos los casos", "En resumen", ">Rol<", ">Herramientas<", ">Equipo<")
EN_STOPWORDS = re.compile(r"\b(the|and|with|that|this|was|were|from|what|when|because|into|which|"
                          r"they|their|there|would|could|should|have|been|about|every)\b", re.I)
fails = []

def fail(check, detail):
    fails.append((check, detail))
    print(f"FAIL {check}: {detail}")

def url_for(lang, page):
    p = "" if page == "index.html" else page
    return f"{ORIGIN}/{LANGS[lang][0]}{p}"

def toggle_target(lang, page):
    p = "" if page == "index.html" else page
    return f"/{LANGS[lang][0]}{p}"

def read(path):
    try:
        return Path(path).read_text(encoding="utf-8")
    except FileNotFoundError:
        return None

def attrs(html, attr):
    return re.findall(rf'\b{attr}="([^"]*)"', html)

def hreflangs(html):
    return {m.group(1): m.group(2) for m in
            re.finditer(r'<link rel="alternate" hreflang="([^"]+)" href="([^"]+)">', html)}

def toggle_links(html):
    return {m.group(2): m.group(1) for m in re.finditer(r'<a href="([^"]+)" hreflang="([^"]+)"', html)}

def body_text_nodes(html):
    body = html.split("<body>", 1)[-1]
    body = re.sub(r"<!--.*?-->", "", body, flags=re.S)
    body = re.sub(r"<(script|style)\b.*?</\1>", "", body, flags=re.S)
    return [t for t in re.findall(r">([^<]+)<", body) if t.strip()]

# 1. no extra pages in the translated trees
for lang in ("es", "pt"):
    prefix = LANGS[lang][0]
    for f in Path(prefix).rglob("*.html") if Path(prefix).exists() else []:
        rel = str(f)[len(prefix):]
        if rel not in PAGES:
            fail("extra", f"{f} has no English twin in scope")

sitemap = read("sitemap.xml") or ""

for page in PAGES:
    want_hreflang = {LANGS[l][2]: url_for(l, page) for l in LANGS}
    want_hreflang["x-default"] = url_for("en", page)
    for lang, (prefix, html_lang, code) in LANGS.items():
        path = f"{prefix}{page}"
        html = read(path)

        # 7. sitemap
        if f"<loc>{url_for(lang, page)}</loc>" not in sitemap:
            fail("sitemap", f"missing {url_for(lang, page)}")

        # 1. twins exist
        if html is None:
            fail("twin", f"missing {path}")
            continue

        # lang attribute
        if f'<html lang="{html_lang}">' not in html:
            fail("lang", f'{path} lacks <html lang="{html_lang}">')

        # 4. hreflang and og:url
        got = hreflangs(html)
        if got != want_hreflang:
            fail("hreflang", f"{path}: got {got}, want {want_hreflang}")
        og = re.search(r'<meta property="og:url" content="([^"]+)">', html)
        if not og or og.group(1) != url_for(lang, page):
            fail("og:url", f"{path}: got {og.group(1) if og else None}, want {url_for(lang, page)}")

        # 5. toggle: links to exactly the two other languages, reads EN / ES / PT
        want_toggle = {LANGS[l][2]: toggle_target(l, page) for l in LANGS if l != lang}
        if toggle_links(html) != want_toggle:
            fail("toggle", f"{path}: got {toggle_links(html)}, want {want_toggle}")
        if not re.search(r">EN</(a|span)> / <(a|span)[^>]*>ES</(a|span)> / <(a|span)[^>]*>PT</(a|span)>", html):
            fail("toggle", f"{path}: toggle does not read 'EN / ES / PT'")
        if "Work ↓" in html:
            fail("toggle", f"{path}: 'Work ↓' link still present")

        # 6. case top bar wraps as a unit on phones
        if page != "index.html":
            if "justify-content:space-between;align-items:center;flex-wrap:wrap;gap:6px 16px;font-family:'IBM Plex Mono'" not in html:
                fail("narrow", f"{path}: case top bar lacks flex-wrap:wrap;gap:6px 16px")
            if not re.search(r'<span style="white-space:nowrap">Cas[eo] 0[1-5] / 05 · ', html):
                fail("narrow", f"{path}: counter-plus-toggle span lacks white-space:nowrap")

        if lang == "en":
            continue

        # 2 + 3. every href/src stays inside the language tree or is a shared absolute resource
        own_dir = Path(path).parent
        own_root = Path(prefix).resolve()
        others = {toggle_target(l, page) for l in LANGS if l != lang}
        for ref in attrs(html, "href") + attrs(html, "src"):
            if ref.startswith(("http://", "https://", "mailto:", "#")) or ref in others:
                continue
            if ref.startswith(SHARED_ABS):
                if not ref.startswith("/assets/") and not Path(ref.lstrip("/")).exists():
                    fail("shared", f"{path}: {ref} does not exist")
                continue
            if ref.startswith("/") and not ref.startswith(f"/{prefix}"):
                fail("leak", f"{path}: absolute link leaves {prefix}: {ref}")
                continue
            if ref.startswith("./") or re.search(r"(^|/)(assets/|support\.js$|favicon\.png$|apple-touch-icon\.png$)", ref):
                fail("relative", f"{path}: relative path to shared resource: {ref}")
                continue
            target = (own_dir / ref).resolve() if not ref.startswith("/") else Path(ref.lstrip("/")).resolve()
            if not str(target).startswith(str(own_root)):
                fail("leak", f"{path}: link leaves {prefix}: {ref}")
            elif not target.exists():
                fail("dangling", f"{path}: {ref} does not exist")

        if lang != "pt":
            continue

        # 8. untranslated English or Spanish copy in the PT tree
        for needle in EN_NEEDLES + ES_NEEDLES:
            if needle in html:
                fail("untranslated", f"{path}: contains '{needle}'")
        for text in body_text_nodes(html):
            m = EN_STOPWORDS.search(text)
            if m:
                fail("untranslated", f"{path}: English word '{m.group(0)}' in: {text.strip()[:80]}")

        # 9. every travessão is preceded by a no-break space, never a normal space or newline
        for text in body_text_nodes(html):
            if re.search(r"[ \t\n]—", text.replace(PRODUCT_UI_DASH, "")):
                fail("dash", f"{path}: normal space before '—' in: {text.strip()[:80]}")

if fails:
    print(f"{len(fails)} failures")
    sys.exit(1)
print("OK")
```

`$ADDPT`:

```python
#!/usr/bin/env python3
"""Task 2: add PT to the 12 existing EN/ES pages and the sitemap. Run once from repo root."""
from pathlib import Path

ORIGIN = "https://ismenegolla.vercel.app"
LASTMOD = "2026-10-02"
PAGES = [
    "index.html",
    "cases/01-shipping-design-changes.dc.html",
    "cases/02-deciding-not-to-scale.dc.html",
    "cases/03-ux-bug-data-model.dc.html",
    "cases/04-redesigning-the-core-flow.dc.html",
    "cases/05-design-system-in-code.dc.html",
]
HOME_LINK = "color:#9B9A90;text-decoration:none;border-bottom:1px solid #2A2D3A;padding-bottom:2px"
CASE_LINK = "color:#6B6A63;text-decoration:none;border-bottom:1px solid #C9C7BA;padding-bottom:2px"
BAR_OLD = "justify-content:space-between;align-items:center;font-family:'IBM Plex Mono'"
BAR_NEW = "justify-content:space-between;align-items:center;flex-wrap:wrap;gap:6px 16px;font-family:'IBM Plex Mono'"


def replace_once(s, old, new, where):
    n = s.count(old)
    assert n == 1, f"{where}: expected 1 occurrence of {old!r}, found {n}"
    return s.replace(old, new)


for page in PAGES:
    p = "" if page == "index.html" else page
    for prefix in ("", "es/"):
        path = f"{prefix}{page}"
        s = Path(path).read_text(encoding="utf-8")

        # hreflang: pt-BR goes right after es
        es_line = f'<link rel="alternate" hreflang="es" href="{ORIGIN}/es/{p}">'
        pt_line = f'<link rel="alternate" hreflang="pt-BR" href="{ORIGIN}/pt/{p}">'
        s = replace_once(s, es_line, f"{es_line}\n{pt_line}", path)

        if page == "index.html":
            # the toggle line ends with "ES</span></span>" (ES active) or "ES</a></span>" (EN active)
            active = "</span>" if prefix == "es/" else "</a>"
            old = f">ES{active}</span>\n"
            new = f'>ES{active} / <a href="/pt/" hreflang="pt-BR" style="{HOME_LINK}">PT</a></span>\n'
            s = replace_once(s, old, new, path)
        else:
            s = replace_once(s, BAR_OLD, BAR_NEW, path)
            label = "Caso" if prefix == "es/" else "Case"
            s = replace_once(s, f"    <span>{label} 0", f'    <span style="white-space:nowrap">{label} 0', path)
            active = "</span>" if prefix == "es/" else "</a>"
            old = f">ES{active}</span>\n"
            new = f'>ES{active} / <a href="/pt/{page}" hreflang="pt-BR" style="{CASE_LINK}">PT</a></span>\n'
            s = replace_once(s, old, new, path)

        Path(path).write_text(s, encoding="utf-8")

# sitemap: six PT URLs before </urlset>
sm = Path("sitemap.xml").read_text(encoding="utf-8")
rows = "".join(
    f"  <url><loc>{ORIGIN}/pt/{'' if page == 'index.html' else page}</loc><lastmod>{LASTMOD}</lastmod></url>\n"
    for page in PAGES
)
sm = replace_once(sm, "</urlset>", rows + "</urlset>", "sitemap.xml")
Path("sitemap.xml").write_text(sm, encoding="utf-8")
print("done")
```

`$MKPT`:

```python
#!/usr/bin/env python3
"""Create pt/<page> from the English <page> with the mechanical rewrites only (no translation).
Usage, from repo root, after Task 2:  python3 make_pt_twin.py cases/03-ux-bug-data-model.dc.html"""
import sys
from pathlib import Path

ORIGIN = "https://ismenegolla.vercel.app"
HOME_LINK = "color:#9B9A90;text-decoration:none;border-bottom:1px solid #2A2D3A;padding-bottom:2px"
CASE_LINK = "color:#6B6A63;text-decoration:none;border-bottom:1px solid #C9C7BA;padding-bottom:2px"


def replace_once(s, old, new):
    n = s.count(old)
    assert n == 1, f"expected 1 occurrence of {old!r}, found {n}"
    return s.replace(old, new)


page = sys.argv[1]
src, dst = Path(page), Path("pt") / page
assert not dst.exists(), f"{dst} already exists; delete it first if you really want to regenerate it"
p = "" if page == "index.html" else page
s = src.read_text(encoding="utf-8")

s = replace_once(s, '<html lang="en">', '<html lang="pt-BR">')
s = replace_once(s, '<script src="./support.js"></script>', '<script src="/support.js"></script>')
s = s.replace('src="../assets/', 'src="/assets/').replace('src="assets/', 'src="/assets/')
s = replace_once(s, f'<meta property="og:url" content="{ORIGIN}/{p}">',
                 f'<meta property="og:url" content="{ORIGIN}/pt/{p}">')

if page == "index.html":
    s = replace_once(s, '<span><span style="color:#F3F2EA">EN</span> / ',
                     f'<span><a href="/" hreflang="en" style="{HOME_LINK}">EN</a> / ')
    s = replace_once(s, f'<a href="/pt/" hreflang="pt-BR" style="{HOME_LINK}">PT</a></span>',
                     '<span style="color:#F3F2EA">PT</span></span>')
else:
    s = replace_once(s, '<span style="white-space:nowrap">Case 0', '<span style="white-space:nowrap">Caso 0')
    s = replace_once(s, ' · <span style="color:#14161F">EN</span> / ',
                     f' · <a href="/{page}" hreflang="en" style="{CASE_LINK}">EN</a> / ')
    s = replace_once(s, f'<a href="/pt/{page}" hreflang="pt-BR" style="{CASE_LINK}">PT</a></span>',
                     '<span style="color:#14161F">PT</span></span>')

dst.parent.mkdir(parents=True, exist_ok=True)
dst.write_text(s, encoding="utf-8")
print(f"created {dst}")
```

- [ ] **Step 3: Run the checker and confirm the baseline**

Run: `python3 $CHECK | awk '{print $1, $2}' | sort | uniq -c`
Expected, with exit code 1 and no traceback:
- `12 FAIL hreflang:`
- `20 FAIL narrow:`
- `6 FAIL sitemap:`
- `24 FAIL toggle:`
- `6 FAIL twin:`
- the final line `68 failures`

- [ ] **Step 4: No commit.** The scripts live in the scratchpad.

---

### Task 2: Existing 12 pages — `pt-BR` hreflang, three-language toggle, narrow bar, sitemap

**Files:**
- Modify: `index.html`, `cases/0{1,2,3,4,5}-*.dc.html` (not `04-brand-for-teachers`), `es/index.html`, `es/cases/*.dc.html`, `sitemap.xml`

**Interfaces:**
- Consumes: `$ADDPT` from Task 1.
- Produces: 12 pages whose toggle links to `/pt/...` twins that Tasks 3–8 create. Each case top bar is `flex-wrap:wrap;gap:6px 16px`, and its counter span is `<span style="white-space:nowrap">`. `$MKPT` depends on these exact strings.

- [ ] **Step 1: Run the script**

Run: `python3 $ADDPT`
Expected: `done`. If it stops with an `AssertionError`, a page differs from what the plan expects. Read the message, inspect that file, and report it. Do not patch around it.

- [ ] **Step 2: Inspect one diff from each kind of page**

```bash
git diff --stat
git diff index.html es/cases/03-ux-bug-data-model.dc.html sitemap.xml
```
Expected:
- 13 files changed.
- Each page gains one `hreflang="pt-BR"` line, right after the `es` line.
- Each toggle line ends with ` / <a href="/pt/…" hreflang="pt-BR" …>PT</a></span>`.
- Each case bar gains `flex-wrap:wrap;gap:6px 16px;`, and its span gains `style="white-space:nowrap"`.
- The sitemap gains six `/pt/` rows with `2026-10-02`.

- [ ] **Step 3: Run the checker**

Run: `python3 $CHECK | awk '{print $1, $2}' | sort | uniq -c`
Expected: only `6 FAIL twin:` and the final line `6 failures`.

- [ ] **Step 4: Visual check of the bar**

Serve the repo root in the background with `python3 -m http.server 8787`, run from the repo root. In the built-in browser, at the 375 px mobile preset, open `/cases/03-ux-bug-data-model.dc.html` and `/es/cases/03-ux-bug-data-model.dc.html`.

On both pages:
- `← Ismael Menegolla` is on line 1.
- The whole `Case 04 / 05 · EN / ES / PT` block is on line 2, left-aligned. It is never split.
- `document.documentElement.scrollWidth > document.documentElement.clientWidth` is `false`.

At desktop width, both items sit on one line, as before. On `/` the top right reads `EN / ES / PT`. The `PT` links 404 for now.

- [ ] **Step 5: Commit**

```bash
git add index.html cases/01-shipping-design-changes.dc.html cases/02-deciding-not-to-scale.dc.html cases/03-ux-bug-data-model.dc.html cases/04-redesigning-the-core-flow.dc.html cases/05-design-system-in-code.dc.html es/ sitemap.xml
git commit -m "EN and ES pages: add PT to the toggle and hreflang, wrap the case bar on phones

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 3: `pt/index.html`

**Files:**
- Create: `pt/index.html`

**Interfaces:**
- Consumes: `$MKPT`; English `index.html` as modified in Task 2.
- Produces: the PT home. Its card links point to `cases/...` relative to `pt/`, so they resolve to the PT cases that Tasks 4–8 create.

- [ ] **Step 1: Create the twin**

Run: `python3 $MKPT index.html`
Expected: `created pt/index.html`. The file has `lang="pt-BR"`, `/support.js`, `/assets/…`, the `/pt/` `og:url`, and the toggle with `PT` active. Its content is still English.

- [ ] **Step 2: Head metadata**

`<title>` and `og:title` stay `Ismael Menegolla — Product Designer`, because the job title is kept in English. Replace both descriptions with:

```html
<meta name="description" content="Busco o caminho mais direto para resolver um problema, nas duas pontas do processo: testando com professoras dentro de salas de aula reais e levando minhas próprias mudanças de design para o código em produção.">
<meta property="og:description" content="Busco o caminho mais direto para resolver um problema, nas duas pontas do processo: testando com professoras dentro de salas de aula reais e levando minhas próprias mudanças de design para o código em produção.">
```

- [ ] **Step 3: Hero**

Replace the `h1` with this markup. It has four lines and was checked at 375 px: the widest line is 278 of 315 px. A three-line version overflows.

```html
<h1 style="font-family:Fraunces,serif;font-weight:600;font-size:clamp(26px,10cqw,64px);line-height:1.06;letter-spacing:-0.01em;margin:0 0 26px"><span style="white-space:nowrap">Design de produto,</span><br><span style="white-space:nowrap">da pesquisa</span><br><span style="white-space:nowrap">com <em style="font-weight:400;color:#F5D563">pessoas</em></span><br><span style="white-space:nowrap">ao <em style="font-weight:400;color:#F5D563">software</em> real.</span></h1>
```

Lead paragraph text:
```
Busco o caminho mais direto para resolver um problema, nas duas pontas do processo: testando com professoras dentro de salas de aula reais e levando minhas próprias mudanças de design para o código em produção. Dez anos de ofício em design&nbsp;— editorial, marca, docência&nbsp;— aplicados hoje a um produto com IA para escolas primárias argentinas.
```

Meta row:
```html
<span>Atualmente&nbsp;— <b style="color:#F3F2EA;font-weight:500">Planificando</b></span>
<span>10 anos de design · 7 anos dando aula na FADU/UBA</span>
<span>Buenos Aires · trabalho em português, inglês e espanhol</span>
```

Hero post-it text:
```
Sim, fiz este site com IA. O mesmo fluxo que uso para levar mudanças de produto para produção no trabalho :)
```

- [ ] **Step 4: Case index header**

`h2`: `Estudos de caso`. Intro `p`:
```
Cinco casos de 18 meses no Planificando, uma ferramenta com IA de planejamento de aulas para professoras de escolas primárias argentinas.
```

- [ ] **Step 5: The six cards**

Use the pills and statuses from the Glossary. Change `Read the case →` to `Ler o caso →` on all five live cards.

Card 01 · Ofício / Em produção / `Reconstruindo o fluxo principal`:
```
A V1 era um formulário que fazia as mesmas perguntas toda semana e esquecia as respostas. Cinco decisões, em produção, e o que os primeiros 18 dias de dados podem e não podem dizer.
```

Card 02 · Evidência / Decisão estratégica / `Decidindo não escalar o produto`:
```
A equipe explicava o baixo uso como um problema de relevância. Pedi dados antes de nos comprometermos com um redesign, e eles apontaram para outro lugar.
```

Card 03 · Processo / Em produção / `Mudanças de design direto em produção`:
```
As correções de design ficavam travadas esperando uma equipe técnica de duas pessoas. Comecei a implementar as mudanças eu mesmo com Claude Code, com revisão da equipe técnica antes do merge.
```

Card 04 · Sistemas / Em produção · 17/6 / `Um bug de UX que vinha do modelo de dados`:
```
As professoras viam suas turmas duplicadas. A causa estava no modelo de dados, não na interface. Diagnosticado e levado para produção.
```

Card 05 · Marca / Em produção / `Levando a marca para o código`:
```
Redesenhei a marca do Planificando e depois a escrevi no repositório do produto como tokens e componentes compartilhados. As regras vivem no código-fonte, não numa biblioteca do Figma.
```

Card 06 · Acesso (placeholder, no link) / `Escalando a tipografia sem quebrar a hierarquia` / status `Em redação&nbsp;— outubro de 2026`:
```
Uma camada de acessibilidade&nbsp;— modo de alto contraste, escala tipográfica proporcional, um único controle persistente&nbsp;— criada para diretores de escola depois de ver um deles se inclinar na direção da tela. Em produção atrás de uma feature flag.
```

- [ ] **Step 6: "Para onde isso vai"**

Set `data-screen-label="Para onde isso vai"`. Then translate the section:

```html
<h2 ...>Para onde isso vai</h2>
<p ...>Quando comecei, achava que design era sobretudo ofício visual. Com os anos, aprendi que a maioria dos problemas de design são problemas de decisão: pessoas tentando chegar a um acordo sobre o que construir e por quê.</p>
<p ...>A IA mudou a parte do meio. Transformar uma decisão em software funcionando ficou rápido&nbsp;— passei este ano levando minhas próprias mudanças de design para produção. O que não ficou mais rápido são as pontas: entender o que vale a pena construir e verificar se funcionou para uma pessoa real. É aí que eu coloco o meu tempo.</p>
<span>Pesquisa</span>·<span>Ofício</span>·<span>Produção</span>
```

The availability post-it appears twice, in `.pic-mobile` and `.pic-desktop`. Translate both:
```html
<b ...>Disponibilidade</b>
Aberto a vagas remotas na América Latina e no exterior. Disposto a me mudar pela oportunidade certa.
```

Buttons row:
- `Ler os casos →`
- the email address, unchanged
- `LinkedIn ↗`, unchanged
- `impressos e trabalhos anteriores → Behance ↗`

The photo `alt` stays `Ismael Menegolla`. Footer:
```
Esta página foi feita com Claude Code e publicada na Vercel.
```

- [ ] **Step 7: Run the checker**

Run: `python3 $CHECK`
Expected:
- `FAIL twin: missing pt/cases/...` for the five cases.
- `FAIL dangling: pt/index.html: cases/... does not exist` for each of the five card links.
- No `untranslated`, `dash`, `lang`, `hreflang`, `og:url`, `toggle`, `relative` or `leak` failure for `pt/index.html`.

If `untranslated` flags a string, translate it. If it flags something that must stay English, such as code or a proper noun, stop and report it. Do not edit the checker.

- [ ] **Step 8: Visual check**

Open `/pt/` at desktop width and at 375 px:
- The four `h1` lines don't overflow, and there is no horizontal scroll.
- The top right reads `EN / ES / PT`, with `PT` active.
- The `Atualmente — Planificando` meta row wraps cleanly.

- [ ] **Step 9: Commit**

```bash
git add pt/index.html
git commit -m "PT home: Brazilian Portuguese version of the index

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Tasks 4–8: shared procedure for each PT case

Each case task follows these steps with its own `$F`, title and fixed strings, listed in the task.

1. **Create the twin:** run `python3 $MKPT $F`. Expected: `created pt/$F`, with `Caso NN / 05`, the toggle with PT active, `/support.js` and `/assets/`.
2. **Head:**
   - Set `<title>` and `og:title` to `<PT title> — Ismael Menegolla`.
   - Translate `meta name="description"` and `og:description`. They are identical to each other.
   - Keep `og:image` and its dimensions.
3. **Body:** translate top to bottom.
   - Fixed strings come from the Glossary and from the task.
   - Everything else is prose. Translate it following the Global Constraints: register, kept anglicisms, feminine `professoras`, `turma`/`disciplina`, untouched Spanish product strings, and `&nbsp;—`.
   - Preserve paragraph count, emphasis (`<b>`, `<em>`, `<code>`), links and every `style` attribute.
   - Translate `alt`.
   - Read the matching `es/$F` before starting. It shows which strings stay in Spanish and how glosses were handled.
   - When the English glosses a Spanish UI label that a Portuguese reader understands without help (`"Regenerar"`), drop the gloss. When the label is not transparent (`¿Qué cambiamos?`), keep a Portuguese gloss in parentheses.
4. **Checker:** run `python3 $CHECK | grep "pt/$F"`. The only acceptable line is a `dangling` failure for the next case's link, when that case isn't created yet. It is listed per task.
5. **Visual check:** open `/pt/$F` at desktop width and at 375 px:
   - The bar reads `Caso NN / 05 · EN / ES / PT` and wraps as a unit on the phone.
   - The `h1` fits.
   - The images load.
   - The footer links are present.
   - There is no horizontal scroll.
6. **Commit:** `git add pt/$F`, then commit with the task's message plus the trailer `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.

---

### Task 4: `pt/cases/04-redesigning-the-core-flow.dc.html` (Caso 01 / 05)

**Files:** Create `pt/cases/04-redesigning-the-core-flow.dc.html`.

**Interfaces:**
- Consumes: `$MKPT`; `pt/index.html` from Task 3, the target of `../index.html`.
- Produces: a next link to `02-deciding-not-to-scale.dc.html`, which Task 5 creates.

- [ ] **Step 1:** `python3 $MKPT cases/04-redesigning-the-core-flow.dc.html`
- [ ] **Step 2: Head.** Title: `Reconstruindo o fluxo principal — Ismael Menegolla`.
- [ ] **Step 3: Body.**
  - Pill `01 · Ofício`; status variant of `Em produção`.
  - Grid labels `Função` / `Status` / `Período`.
  - Headings use `Decisão N ·`.
  - Footer `← Todos os casos` and `Próximo: Decidindo não escalar o produto →`.
  - Spanish UI labels in quotes and in `alt` (`¿Qué cambiamos?`, `Regenerar`) stay in Spanish.
- [ ] **Step 4: Checker.** Only `dangling … 02-deciding-not-to-scale.dc.html` is acceptable for this file.
- [ ] **Step 5: Visual check.**
- [ ] **Step 6: Commit** `PT case 01: Reconstruindo o fluxo principal`.

---

### Task 5: `pt/cases/02-deciding-not-to-scale.dc.html` (Caso 02 / 05)

**Files:** Create `pt/cases/02-deciding-not-to-scale.dc.html`.

**Interfaces:**
- Produces: a previous link to `04-redesigning-the-core-flow.dc.html` (Task 4) and a next link to `01-shipping-design-changes.dc.html` (Task 6).

- [ ] **Step 1:** `python3 $MKPT cases/02-deciding-not-to-scale.dc.html`
- [ ] **Step 2: Head.** Title: `Decidindo não escalar o produto — Ismael Menegolla`.
- [ ] **Step 3: Body.**
  - Pill `02 · Evidência`; status `Decisão estratégica`.
  - Grid labels `Função` / `Equipe` / `Período`.
  - Footer `← Reconstruindo o fluxo principal` and `Próximo: Mudanças de design direto em produção →`.
  - Translate the section headings in the same voice.
  - Figure labels already in Spanish (`uso diario`) stay.
- [ ] **Step 4: Checker.** Only `dangling … 01-shipping-design-changes.dc.html` is acceptable. The Task 4 `dangling` failure is gone.
- [ ] **Step 5: Visual check.**
- [ ] **Step 6: Commit** `PT case 02: Decidindo não escalar o produto`.

---

### Task 6: `pt/cases/01-shipping-design-changes.dc.html` (Caso 03 / 05)

**Files:** Create `pt/cases/01-shipping-design-changes.dc.html`.

**Interfaces:**
- Produces: a previous link to `02-deciding-not-to-scale.dc.html` (Task 5) and a next link to `03-ux-bug-data-model.dc.html` (Task 7).

- [ ] **Step 1:** `python3 $MKPT cases/01-shipping-design-changes.dc.html`
- [ ] **Step 2: Head.** Title: `Mudanças de design direto em produção — Ismael Menegolla`.
- [ ] **Step 3: Body.**
  - Pill `03 · Processo`; status variant of `Em produção`.
  - Grid labels `Função` / `Equipe` / `Período` / `Ferramentas`.
  - `Em resumo&nbsp;— `; headings `Contexto`, `O problema`, `Fechamento`.
  - Figure labels: `Antes&nbsp;— "Regenerar"` and `Depois&nbsp;— "Pedir cambios"`.
  - The heading `One change in detail: "Regenerate" → "Request changes"` becomes `Uma mudança em detalhe: "Regenerar" → "Pedir cambios"`.
  - Footer `← Decidindo não escalar o produto` and `Próximo: Um bug de UX que vinha do modelo de dados →`.
- [ ] **Step 4: Checker.** Only `dangling … 03-ux-bug-data-model.dc.html` is acceptable.
- [ ] **Step 5: Visual check.**
- [ ] **Step 6: Commit** `PT case 03: Mudanças de design direto em produção`.

---

### Task 7: `pt/cases/03-ux-bug-data-model.dc.html` (Caso 04 / 05)

**Files:** Create `pt/cases/03-ux-bug-data-model.dc.html`.

**Interfaces:**
- Produces: a previous link to `01-shipping-design-changes.dc.html` (Task 6) and a next link to `05-design-system-in-code.dc.html` (Task 8).

- [ ] **Step 1:** `python3 $MKPT cases/03-ux-bug-data-model.dc.html`
- [ ] **Step 2: Head.** Title: `Um bug de UX que vinha do modelo de dados — Ismael Menegolla`. Description:
  ```
  As professoras viam turmas duplicadas. A causa estava no modelo de dados, não na interface. Diagnosticado, proposto e em produção em junho de 2026.
  ```
- [ ] **Step 3: Body.**
  - Pill `04 · Sistemas`; status `Em produção · 17/6`.
  - Grid labels `Função` / `Período` / `Ferramentas`. The role value is `Product Designer&nbsp;— diagnóstico, proposta, implementação de frontend`.
  - `Em resumo&nbsp;— `.
  - Headings `O problema`, `O diagnóstico`, `A proposta`, `A correção`, `Ressalva`. Translate them in the hidden side nav too (`display:none`).
  - In this case, `grade` is the class-group object, so it becomes `turma`. `a subject (materia)` becomes `uma disciplina (materia)`.
  - The `alt` of the database-row image keeps the Spanish values `identificación del número 1` and `Materia: Lengua`.
  - Footer `← Mudanças de design direto em produção` and `Próximo: Levando a marca para o código →`.
- [ ] **Step 4: Checker.** Only `dangling … 05-design-system-in-code.dc.html` is acceptable.
- [ ] **Step 5: Visual check.**
- [ ] **Step 6: Commit** `PT case 04: Um bug de UX que vinha do modelo de dados`.

---

### Task 8: `pt/cases/05-design-system-in-code.dc.html` (Caso 05 / 05)

**Files:** Create `pt/cases/05-design-system-in-code.dc.html`. This is the largest page, about 465 lines. Much of it is token-demo markup with short labels.

**Interfaces:**
- Produces: a previous link to `03-ux-bug-data-model.dc.html` (Task 7) and `Voltar para todos os casos →` to `../index.html`.

- [ ] **Step 1:** `python3 $MKPT cases/05-design-system-in-code.dc.html`
- [ ] **Step 2: Head.** Title: `Levando a marca para o código — Ismael Menegolla`.
- [ ] **Step 3: Body.**
  - Pill `05 · Marca`; status variant of `Em produção`.
  - Grid labels `Função` / `Período` / `Ferramentas` / `Tamanho`.
  - Footer `← Um bug de UX que vinha do modelo de dados` and `Voltar para todos os casos →`.
  - Translate the section headings and token-sheet labels (`Brand · the single accent`, `Ground & surfaces · warm`, `What v2 dropped`, `Why violet`…).
  - Component captions such as `PillButton — 5 variants × 3 sizes…` keep the component name and translate the rest: `PillButton&nbsp;— 5 variantes × 3 tamanhos…`.
  - Code identifiers, file paths (`/grados · grade-card.tsx`), token names, hex values and all Spanish demo UI stay as they are.
  - `owner` stays in English (`o owner pediu…`).
  - The Spanish quotes “se ven un poco grandes” and “lo usa gente grande” stay in Spanish.
  - Do not touch `<script>` content, `data-props` or `defaultValue` attributes.
- [ ] **Step 4: Checker.** `python3 $CHECK` prints `OK` with exit 0. This is the first time the whole suite passes.
- [ ] **Step 5: Visual check.** The token grids, the live components and the composed screen render exactly like the English page. Only the labels differ.
- [ ] **Step 6: Commit** `PT case 05: Levando a marca para o código`.

---

### Task 9: Cross-page review

**Files:**
- Possibly modify: any `pt/` page where a longer Portuguese string overflows at phone width.

**Interfaces:**
- Consumes: all 18 pages.

- [ ] **Step 1: Walk the toggles**

Serve the repo root. In the built-in browser at desktop width:
1. On `/`, click `PT` to land on `/pt/`. Then click `ES` (`/es/`), then `PT` (`/pt/`), then `EN` (`/`).
2. From `/pt/`, open each of the five cards. On each case, click `EN`, then `ES`, then `PT`. Confirm that it is the same case every time.
3. On the PT cases, follow the previous/next footer links through all five cases and back to `/pt/`.

- [ ] **Step 2: Overflow on all 18 pages at 375 px**

At the mobile preset, on every page of `/`, `/es/` and `/pt/`, run:
```js
document.documentElement.scrollWidth > document.documentElement.clientWidth
```
Expected: `false` everywhere.

If a page overflows, find the culprit with:
```js
[...document.querySelectorAll('*')].filter(e => e.getBoundingClientRect().right > innerWidth)
```
Then fix the Portuguese string. For the hero `h1`, lower the clamp to `clamp(26px,9cqw,58px)`, on `pt/index.html` only.

- [ ] **Step 3: Checker, final run**

Run: `python3 $CHECK`
Expected: `OK`.

- [ ] **Step 4: Commit any fixes**

```bash
git add pt/
git commit -m "PT: fit longer strings at phone width

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```
Skip this step if nothing changed.

- [ ] **Step 5: Report**

Give Ismael:
- the six `/pt/` URLs,
- the strings that needed judgment calls (glosses kept or dropped, `turma` versus `ano`),
- a suggestion to read the hero, the card summaries and the five TL;DRs in Portuguese before merging.

Then hand the branch to the finishing-a-development-branch skill.

# cosmo-docs

Documentation for the Cosmo localisation libraries in JavaScript, PHP, Python,
Java, and C#, built with [MkDocs Material](https://squidfunk.github.io/mkdocs-material/).

Each language has its own pages, examples, and navigation. The language dropdown in
the header keeps the reader in their chosen language. Feature parity remains
a shared comparison page.

Dependencies are managed with [uv](https://docs.astral.sh/uv/). It installs a
matching Python automatically — you don't need one preinstalled.

## Local preview

```bash
uv sync                 # create .venv from uv.lock
uv run mkdocs serve     # http://127.0.0.1:8765
```

## Build

```bash
uv run mkdocs build --strict   # output in ./site
```

## Deploy (GitHub Pages)

Pushing to `main` runs `.github/workflows/deploy.yml`, which builds the site with
uv and publishes it via the GitHub Pages Actions pipeline.

**One-time repo setup:** in **Settings → Pages**, set **Source = GitHub Actions**.
The site is served at its custom domain `https://cosmo.miloun.com/`, kept in place by
the `docs/CNAME` file (copied into `site/` on every build) plus the Pages custom-domain
setting. DNS must point `cosmo.miloun.com` at GitHub Pages.

> The docs repo lives at `cosmo-intl/cosmo-docs`. `site_url` in `mkdocs.yml` is the
> custom domain; `repo_url` points at the `cosmo-intl` org that hosts the library
> family. Adjust those values if the repo names differ.

## Content

| Page | Source |
|---|---|
| `docs/index.md` | landing page |
| `docs/getting-started.md` | install + quick start (per-language tabs) |
| `docs/guide/*.md` | topic guides with synced PHP/JS/Python tabs |
| `docs/api-reference.md` | full method list per language |
| `docs/parity.md` | the feature-parity matrix |
| `docs/platform-notes.md` | what each port can and cannot do, and why |

## Language-specific content

`hooks/languages.py` generates `/javascript/`, `/php/`, `/python/`, `/java/`, and
`/csharp/` pages from the shared Markdown sources. Existing unprefixed URLs and
`?lang=python` links continue to work. The reader's choice is stored locally.

Code samples use `=== "Python"` (or another language name) in source files. The
build unwraps the selected sample, so readers see a code block without repeated
tabs. A missing sample never falls back to another language's code.

Use Jinja conditions for runtime-specific prose or sections:

```jinja
{% if language == 'python' %}
This note appears only in the Python documentation.
{% endif %}
```

The available keys are `javascript`, `php`, `python`, `java`, and `csharp`.
Use `[[ language ]]` or `[[ language_name ]]` for substitutions; ordinary `{{ }}`
and ICU MessageFormat braces are preserved. Page availability is declared in
`AVAILABILITY` in the hook. Unsupported pages are omitted from that language's
navigation, and internal links to them lead to its platform notes.

After changes, run `uv run python -m unittest discover -s tests` and
`uv run mkdocs build --strict`.

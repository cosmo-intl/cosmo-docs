# cosmo-docs

Unified documentation site for the **Cosmopolitan** localisation libraries —
[PHP](https://github.com/salarmehr/cosmopolitan), JavaScript, and Python — built
with [MkDocs Material](https://squidfunk.github.io/mkdocs-material/).

Every example is shown in all three languages via synchronised code tabs: pick
your language once and every snippet on the site follows.

Dependencies are managed with [uv](https://docs.astral.sh/uv/). It installs a
matching Python automatically — you don't need one preinstalled.

## Local preview

```bash
uv sync                 # create .venv from uv.lock
uv run mkdocs serve     # http://127.0.0.1:8000
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
| `docs/parity.md` | the feature-parity matrix (kept in sync with `../compare.md`) |
| `docs/platform-notes.md` | what each port can and cannot do, and why |

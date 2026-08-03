# Finjener Portfolio

Personal portfolio website for **Ferhat Sencer** — software engineer focused on
desktop applications (C++/Qt), DevOps, embedded systems, and medical device
development. Deployed to GitHub Pages at <https://finjener.github.io>.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 18.2 + Create React App (via `react-app-rewired`) |
| Routing | react-router-dom 6 (`HashRouter` for GitHub Pages) |
| Styling | TailwindCSS 3 + per-theme CSS |
| Animation | framer-motion |
| Content | Local JSON + Markdown (optional Contentful CMS) |
| PDF | @react-pdf/renderer (client-side resume download) |
| Tests | Jest + React Testing Library |
| Deploy | `gh-pages` |

Requires **Node 24** (installed via nvm at `~/.nvm/versions/node/v24.12.0` on the
dev machine — it is not on the default `PATH`).

## Quickstart

```bash
export PATH="$HOME/.nvm/versions/node/v24.12.0/bin:$PATH"
npm install
npm start          # dev server on http://localhost:3000
npm test           # jest (watch mode); CI=true npm test -- --watchAll=false for one run
npm run build      # production build to build/
npm run deploy     # build + publish to GitHub Pages via gh-pages
```

## Theme System

The site supports switchable themes through a central registry in
`src/themes/index.js`:

```js
export const ACTIVE_THEME = 'theme2'; // change to switch themes
```

Each theme exports: `Navbar`, `Footer`, `MatrixBackground`, `BackgroundMusic`,
`config`, and `themeMeta`.

| Theme | Style | Status |
|-------|-------|--------|
| theme1 | EDEX/Tron — Matrix p5 background, scan effects, background music | Available (inactive) |
| theme2 | Minimalist — clean zinc palette, system fonts, no effects | **Active** |
| theme3–5 | Stubs (`export default null`) | Not implemented |

Performance notes: routes are lazy-loaded (React.lazy + Suspense); `p5` is
dynamic-imported so it only downloads when theme1 is active; the background
music file is a 60 s / 64 kbps loop (472 kB).

## Content Pipeline

- **Structured content** — JSON files in `src/data/content/` (home, projects,
  experience, skills, articles metadata, etc.), loaded through `getContent()`
  in `src/data/index.js` with validation/caching via `ContentModel`.
- **Articles** — Markdown with frontmatter in `src/data/content/articles/`,
  rendered by `ArticleDetailPage` → `articleService` → `MarkdownContent`
  (react-markdown + GFM + sanitized raw HTML).
- **Contentful CMS (optional)** — `src/services/contentful.js` activates only
  when the `CONTENTFUL_*` env vars are set; falls back to local content.

## i18n

English is the only enabled language. Russian (`ru/`) is hidden from
`SUPPORTED_LANGUAGES` in `src/contexts/LanguageContext.js` until its translation
files reach key parity with `en/` (they currently hold placeholder template
content).

## Architecture

MVC-inspired layering: pages → controllers (`ContentController`) → models
(`ContentModel`) → data. Note that most pages call `getContent()` directly;
the controller/model layer is currently used by the About page only.

## License

GPL-3.0 — see [LICENSE](LICENSE).

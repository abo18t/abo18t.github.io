# Project Tools (Project Info + FE Daily Report)

[![Deploy to GitHub Pages](https://github.com/abo18tuoi/abo18tuoi.github.io/actions/workflows/pages.yml/badge.svg)](https://github.com/abo18tuoi/abo18tuoi.github.io/actions/workflows/pages.yml)

A tiny static toolset to generate Discord-ready texts:
- Project Info: aggregate project metadata (links, team, Git access)
- FE Daily Report: structured daily report with live Markdown preview

## Folder Structure

```
project-info/
├─ assets/
│  └─ css/
│     └─ styles.css
├─ apps/
│  ├─ project-info/
│  │  ├─ index.html
│  │  ├─ app.js
│  │  ├─ config.json
│  │  └─ sample.json
│  └─ daily-report/
│     ├─ index.html
│     └─ app.js
├─ index.html            # Hub page to navigate between apps
└─ server.js             # Local static server (optional)
```

## Local Development

Option A — use the built-in Node server (no dependencies):

```
node server.js 8080
# open http://localhost:8080
```

Option B — serve with any static server of your choice (nginx, python -m http.server, etc.)

## GitHub Pages (CI/CD)

This repo is set up to deploy via GitHub Actions to GitHub Pages. The site will be publicly accessible even if the repository is private.

- Repository: `abo18tuoi/abo18tuoi.github.io`
- Site URL: `https://abo18tuoi.github.io/`
- Build: Push to `main` triggers deployment

### Enable Pages
1. Go to Settings → Pages
2. Build and deployment → Source: GitHub Actions
3. Ensure the default branch is `main`

### Workflow
See `.github/workflows/pages.yml`. It:
- Checks out the repository
- Uploads the repository as a Pages artifact
- Deploys it to GitHub Pages

Caching: GitHub Pages serves static content via its CDN and handles cache invalidation automatically on each deployment. If you still see stale content, hard refresh (Cmd/Ctrl+Shift+R) or clear browser cache.

## Notes
- Project Info loads data from `apps/project-info/config.json` and allows JSON import/export.
- FE Daily provides live Markdown preview for bold and line breaks and copies text in Discord-friendly format.
- No runtime dependencies or bundlers. Pure HTML/CSS/JS.

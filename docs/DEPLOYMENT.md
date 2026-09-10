# Deployment

The site is a static Astro build deployed with GitHub Pages.

## URLs

- Repository: `Rice-SIAM/rice-siam.github.io`
- Temporary GitHub Pages URL: `https://rice-siam.github.io/`
- Planned production domain: `https://siam.rice.edu/`

Do not add a `CNAME` file for `siam.rice.edu` until the public pages have real chapter content, Rice IT has completed accessibility review, and they have asked for the domain mapping.

## GitHub Pages setup

1. In the GitHub repository, open **Settings → Pages**.
2. Set **Source** to **GitHub Actions**.
3. Push to `main` or run the **Deploy to GitHub Pages** workflow manually.

The workflow is `.github/workflows/deploy.yml`. It uses the official Astro GitHub Action (`withastro/action`) and `actions/deploy-pages`. It also rebuilds nightly so dated events move from upcoming to past without client-side JavaScript.

## Build locally

```bash
npm install
npm run build
```

Confirm that `dist/` contains the Rice SIAM pages and does not include starter demo routes such as `/blog` or `/portfolio`.

`npm install` should report **0 vulnerabilities**. If a count appears, the install still succeeded; npm is reporting issues in build tools, not the live site. Do not run `npm audit fix --force`. Patched copies of those packages are pinned in `package.json` `overrides`. Update the overrides (or wait for an `astro-compress` release) instead of forcing a downgrade.

## Changing the site URL later

When Rice IT maps `siam.rice.edu`:

1. Add `public/CNAME` with a single line: `siam.rice.edu`
2. Change `site` in `astro.config.mjs` from `https://rice-siam.github.io` to `https://siam.rice.edu`
3. Do not set a `base` path. This repository is the organization root Pages site.

## Node version

The project expects Node.js 24.19 or later, matching `.nvmrc`.

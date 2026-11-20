# Deployment

The site is a static Astro build deployed with GitHub Pages.

## URLs

- Repository: `Rice-SIAM/rice-siam.github.io`
- Public site: `https://siam.rice.edu/`
- `https://rice-siam.github.io/` redirects there

`public/CNAME` is `siam.rice.edu`. `site` in `astro.config.mjs` is `https://siam.rice.edu`. Do not set a `base` path. This repository is the organization root Pages site.

## GitHub Pages setup

1. In the GitHub repository, open **Settings → Pages**.
2. Set **Source** to **GitHub Actions**.
3. Push to `main` or run the **Deploy to GitHub Pages** workflow manually.

The workflow is `.github/workflows/deploy.yml`. It uses the official Astro GitHub Action (`withastro/action`) and `actions/deploy-pages`. It also rebuilds nightly so dated events move from upcoming to past, and expired opportunity listings leave the public list, without client-side JavaScript.

## Build locally

Choose the Node.js version as described in the README, then:

```bash
npm ci
npm run build
```

Confirm that `dist/` contains the Rice SIAM pages and does not include starter demo routes such as `/blog` or `/portfolio`.

Do not run `npm audit fix --force`. Patched packages are pinned in `package.json` `overrides`: `deepmerge-ts`, `sharp`, and `svgo`.

## Node version

The Node.js version is `.nvmrc`. Local setup is in the README. GitHub Actions reads that same file.

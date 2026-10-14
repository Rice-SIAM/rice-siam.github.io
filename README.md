# Rice University SIAM Student Chapter

Official website for the Rice University SIAM Student Chapter.

- Public site: [https://siam.rice.edu/](https://siam.rice.edu/)
- Repository: [Rice-SIAM/rice-siam.github.io](https://github.com/Rice-SIAM/rice-siam.github.io)

## Stack

Astro, TypeScript, Tailwind CSS, and Sass. Static HTML output. Atkinson Hyperlegible is bundled locally as the site typeface.

## Local development

Node.js version: `.nvmrc`.

macOS ([nvm](https://github.com/nvm-sh/nvm)):

```bash
nvm install
nvm use
npm ci
npm run dev
```

Windows ([fnm](https://github.com/Schniz/fnm)). Once: `winget install Schniz.fnm`, then its [shell setup](https://github.com/Schniz/fnm#shell-setup).

```bash
fnm install
fnm use
npm ci
npm run dev
```

Later sessions: `nvm use` or `fnm use`, then `npm run dev`. Run `npm ci` again when `package-lock.json` changes, and commit that file with the dependency change. Do not run `npm audit fix --force`.

Dev server: http://localhost:4321/. If one is already running, open the URL Astro prints, or stop it with `npx astro dev stop`.

## Checks

GitHub Actions runs these on every push. Run them locally before committing.

```bash
npm run lint
npm run format:check
npm run build
npm run preview
npm run test:a11y
```

If `format:check` fails, run `npm run format` and commit the result. `npm run build` writes `dist/`. `npm run preview` serves that folder.

## Content editing

Start with [docs/CONTENT-GUIDE.md](docs/CONTENT-GUIDE.md). Ordinary updates should not require editing Astro components.

| Update                       | File or folder                                             |
| ---------------------------- | ---------------------------------------------------------- |
| Officers                     | `src/data/officers.yaml`, `src/data/officers-history.yaml` |
| Events                       | `src/content/events/`                                      |
| Conferences                  | `src/content/conferences/`                                 |
| Opportunities                | `src/content/opportunities/`                               |
| Homepage, contact email, SEO | `src/data/site.yaml`                                       |
| About / Get involved copy    | `src/pages/about.md`, `src/pages/get-involved.md`          |
| Navigation                   | `src/data/navigation.yaml`                                 |
| Partners                     | `src/data/partners.yaml`                                   |
| Social links                 | `src/data/social.yaml`                                     |
| Newsletter                   | `src/data/newsletter.yaml`                                 |

Brand files are in `public/images/branding/`. Domain mapping is in [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md). Accessibility review is in [docs/ACCESSIBILITY.md](docs/ACCESSIBILITY.md). Newsletter cadence is in [docs/NEWSLETTER.md](docs/NEWSLETTER.md).

## Attribution

This project is derived from [Accessible Astro Starter](https://github.com/incluud/accessible-astro-starter) by Incluud / Mark Teekman and remains under the MIT License. Original starter documentation is preserved in [docs/ACCESSIBLE-ASTRO-STARTER.md](docs/ACCESSIBLE-ASTRO-STARTER.md).

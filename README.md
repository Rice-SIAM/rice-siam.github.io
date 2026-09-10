# Rice University SIAM Student Chapter

Official website for the Rice University SIAM Student Chapter.

- Planned production domain: [https://siam.rice.edu/](https://siam.rice.edu/)
- Temporary GitHub Pages URL: [https://rice-siam.github.io/](https://rice-siam.github.io/)
- Repository: [Rice-SIAM/rice-siam.github.io](https://github.com/Rice-SIAM/rice-siam.github.io)

The custom domain is not active yet. Rice University IT can map `siam.rice.edu` after accessibility review.

## Stack

Astro, TypeScript, Tailwind CSS, and Sass. Static HTML output. Atkinson Hyperlegible is bundled locally as the site typeface.

## Local development

Requires Node.js 24.19 or later.

```bash
npm install
npm run dev
```

The development server runs at http://localhost:4321/.

## Checks

```bash
npm run lint
npm run format:check
npm run build
npm run preview
npm run test:a11y
```

If `format:check` fails, run `npm run format` and commit the result.

Output is written to `dist/`.

## Content editing

Start with [docs/CONTENT-GUIDE.md](docs/CONTENT-GUIDE.md). Ordinary updates should not require editing Astro components.

| Update                       | File or folder                                    |
| ---------------------------- | ------------------------------------------------- |
| Officers                     | `src/data/officers.yaml`                          |
| Events                       | `src/content/events/`                             |
| Homepage, contact email, SEO | `src/data/site.yaml`                              |
| About / Get involved copy    | `src/pages/about.md`, `src/pages/get-involved.md` |
| Navigation                   | `src/data/navigation.yaml`                        |
| Partners                     | `src/data/partners.yaml`                          |
| Social links                 | `src/data/social.yaml`                            |

Brand files are in `public/images/branding/`. Domain mapping is in [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md). Accessibility review is in [docs/ACCESSIBILITY.md](docs/ACCESSIBILITY.md).

## Attribution

This project is derived from [Accessible Astro Starter](https://github.com/incluud/accessible-astro-starter) by Incluud / Mark Teekman and remains under the MIT License. Original starter documentation is preserved in [docs/ACCESSIBLE-ASTRO-STARTER.md](docs/ACCESSIBLE-ASTRO-STARTER.md).

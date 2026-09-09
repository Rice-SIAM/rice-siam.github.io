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

## Build

```bash
npm run build
npm run preview
npm run test:a11y
```

Output is written to `dist/`.

## Content editing

Ordinary updates should not require editing Astro components.

| Update | File or folder |
| --- | --- |
| Officers | `src/data/officers.yaml` |
| Events | `src/content/events/` |
| Partners | `src/data/partners.yaml` |
| Navigation | `src/data/navigation.yaml` |
| Site name, SEO, contact email | `src/data/site.yaml` |
| Social links | `src/data/social.yaml` |
| Page copy | `src/pages/` |

See [docs/CONTENT-GUIDE.md](docs/CONTENT-GUIDE.md), [docs/ACCESSIBILITY.md](docs/ACCESSIBILITY.md), [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md), and [docs/OFFICER-HANDOFF.md](docs/OFFICER-HANDOFF.md).

## Attribution

This project is derived from [Accessible Astro Starter](https://github.com/incluud/accessible-astro-starter) by Incluud / Mark Teekman and remains under the MIT License. Original starter documentation is preserved in [docs/ACCESSIBLE-ASTRO-STARTER.md](docs/ACCESSIBLE-ASTRO-STARTER.md).

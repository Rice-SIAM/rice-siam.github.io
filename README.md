# Rice University SIAM Student Chapter

Official website for the Rice University SIAM Student Chapter.

- Planned production domain: [https://siam.rice.edu/](https://siam.rice.edu/)
- Temporary GitHub Pages URL: [https://rice-siam.github.io/](https://rice-siam.github.io/)
- Repository: [Rice-SIAM/rice-siam.github.io](https://github.com/Rice-SIAM/rice-siam.github.io)

Rice University IT can map `siam.rice.edu` to this GitHub Pages site after the website is ready and passes accessibility review. The custom domain is not active yet.

## Technology

This site is a static website built with [Astro](https://astro.build/), TypeScript, Tailwind CSS, and Sass. It is based on the [Accessible Astro Starter](https://github.com/incluud/accessible-astro-starter) and keeps that project's accessibility infrastructure.

## Local setup

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
```

The production output is written to `dist/` as static HTML.

## How future officers update the site

You should not need to edit Astro components for ordinary updates.

| Update | File or folder |
| --- | --- |
| Officers | `src/data/officers.yaml` |
| Events | `src/content/events/` |
| Partners | `src/data/partners.yaml` |
| Navigation | `src/data/navigation.yaml` |
| Site name and SEO text | `src/data/site.yaml` |
| Social links | `src/data/social.yaml` |
| Page copy | `src/pages/` Markdown or Astro pages |

See:

- [Content guide](docs/CONTENT-GUIDE.md)
- [Accessibility](docs/ACCESSIBILITY.md)
- [Deployment](docs/DEPLOYMENT.md)
- [Officer handoff](docs/OFFICER-HANDOFF.md)

## Repository organization

```
src/
  components/     Reusable UI used by pages
  content/         Markdown collections (events, news)
  data/            YAML files officers can edit
  layouts/         Page wrappers, SEO, skip link, landmarks
  pages/           Routes
  styles/          Global CSS
  assets/scss/     Design tokens and accessibility styles
public/images/     Officer, event, partner, and branding images
docs/              Maintainer documentation
```

## Attribution

This project is derived from [Accessible Astro Starter](https://github.com/incluud/accessible-astro-starter) by Incluud / Mark Teekman and remains under the MIT License. Original starter documentation is preserved in [docs/ACCESSIBLE-ASTRO-STARTER.md](docs/ACCESSIBLE-ASTRO-STARTER.md).

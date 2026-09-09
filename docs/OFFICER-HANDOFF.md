# Officer handoff

This website is meant to survive annual leadership turnover. Most updates should be data or Markdown, not code.

## First-week checklist

1. Clone the repository and run `npm install` then `npm run dev`.
2. Read [README.md](../README.md) and [CONTENT-GUIDE.md](./CONTENT-GUIDE.md).
3. Update `src/data/officers.yaml` for the new term.
4. Remove or archive events that should no longer appear.
5. Confirm that contact information on `/contact` is still accurate.
6. Do not publish emails, photos, or social accounts without permission.

## What officers can usually edit

- `src/data/officers.yaml`
- `src/data/partners.yaml`
- `src/data/navigation.yaml`
- `src/data/social.yaml`
- `src/data/site.yaml`
- Markdown files in `src/content/events/`
- Ordinary page copy in `src/pages/`

## What to leave to someone who knows Astro

- `src/components/` and `src/layouts/`
- `astro.config.mjs`
- GitHub Actions
- Dependency upgrades
- Visual redesign or Rice brand-asset work

## Branding reminder

Do not download Rice or SIAM logos from random websites. Official marks need an approved source and permitted use. The current navy color is provisional and should be checked against Rice's official brand guide before launch.

## Accessibility reminder

Rice IT will not map `siam.rice.edu` until the site passes accessibility testing. Keep skip links, headings, keyboard access, alt text, and contrast intact. See [ACCESSIBILITY.md](./ACCESSIBILITY.md).

## If something breaks

A malformed YAML or event Markdown file can fail `npm run build`. Fix the file rather than bypassing the check. The build failure is there to stop broken content from going live.

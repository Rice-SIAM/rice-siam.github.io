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

Rice Blue `#00205B` is the official digital value from the [Rice Brand Guide](https://brand.rice.edu/colors). Official Rice marks are not used until an approved asset and permitted use are available. The orange focus color is for accessibility, not a Rice trademark color.

## Accessibility reminder

Rice IT will not map `siam.rice.edu` until the site passes accessibility testing. Keep skip links, headings, keyboard access, alt text, and contrast intact. See [ACCESSIBILITY.md](./ACCESSIBILITY.md).

## If something breaks

A malformed YAML or event Markdown file can fail `npm run build`. Fix the file rather than bypassing the check. The build failure is there to stop broken content from going live.

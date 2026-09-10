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

Rice Blue `#00205B` is the official digital value from the [Rice Brand Guide](https://brand.rice.edu/colors). Full Rice and SIAM palettes are in `src/data/brand-colors.yaml`. Approved marks are in `public/images/branding/`. Do not use the Rice shield alone, recolor a mark, or combine Rice and SIAM into one homemade lockup. The orange focus color is for accessibility, not a Rice trademark color.

## Optional branding (later)

Not required to launch or restyle the site. The repo already has official Rice marks, SIAM wordmarks, and both color palettes. Do these only if a later need appears:

- Request a Rice-designed chapter lockup (full words, no acronyms) at [publicaffairs.rice.edu/logo-proj-req-form](https://publicaffairs.rice.edu/logo-proj-req-form). Until then, place a Rice mark next to the SIAM logo with clear space.
- Check whether an existing unit lockup exists at [bit.ly/rice-logo-lockups](https://bit.ly/rice-logo-lockups) (Rice NetID / Box).
- Capture Rice’s AA text-on-color pairing table from [brand.rice.edu/colors](https://brand.rice.edu/colors) if you want their published combinations instead of checking contrast in this repo’s accessibility tests.
- Email [sactclubs@rice.edu](mailto:sactclubs@rice.edu) if Student Activities has not yet confirmed public use of the Rice name and logo.
- Send a custom chapter mark to [SIAM Marketing](https://www.siam.org/advertising/contact-siam-marketing-staff/) before using it. The unaltered SIAM logo on the website does not need that review.

## Accessibility reminder

Rice IT will not map `siam.rice.edu` until the site passes accessibility testing. Keep skip links, headings, keyboard access, alt text, and contrast intact. See [ACCESSIBILITY.md](./ACCESSIBILITY.md).

## If something breaks

A malformed YAML or event Markdown file can fail `npm run build`. Fix the file rather than bypassing the check. The build failure is there to stop broken content from going live.

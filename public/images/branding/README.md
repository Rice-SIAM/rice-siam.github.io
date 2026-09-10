# Branding assets

Official Rice University and SIAM marks, copied from the university logo pack and the SIAM Logo Guide. Do not redraw, recolor, or combine these into a homemade lockup.

Hex, RGB, and CMYK values for both brands are in `src/data/brand-colors.yaml`. Web files in this folder are public on the site. Print EPS files live in `brand-assets/siam/` and are not deployed.

## Rice (`rice/`)

| File pattern | What it is | Typical use |
| --- | --- | --- |
| `logo-rice-{color}.svg` | Shield + **RICE** wordmark | Header on light backgrounds (blue, black, gray) or dark (`white`) |
| `logo-rice-*-shield-white-wordmark.svg` | Colored shield, white **RICE** | Dark or colored backgrounds |
| `logo-rice-university-{color}.svg` | Shield + **Rice University** (horizontal) | When the full university name should appear |
| `logo-rice-university-stacked-*.png` | Preferred stacked “Rice University” lockup | Footer, posters, when a taller mark fits better |
| `wordmark-rice-university-*.png` | **Rice University** type only (no shield) | Small sizes where the shield would muddy |
| `owl-flat-*.svg` | Standalone owl graphic | Decoration only — not a substitute for the official logo |

Rice brand rules that matter here:

- The shield must not be used alone. Those files were **not** copied (the pack labels them “USE WITH PA PERMISSION ONLY”).
- The academic seal was not copied.
- Do not mash a Rice mark together with the SIAM mark. Place them side by side with clear space.
- Digital Rice Blue in these SVGs is the print-oriented fill (`#002169`). Site CSS should still use the web value `#00205B` from [brand.rice.edu/colors](https://brand.rice.edu/colors).

## SIAM (`siam/`)

| File pattern | What it is | Typical use |
| --- | --- | --- |
| `logo-siam-{color}.png` | Wordmark only | Website; must link to `https://www.siam.org` |
| `logo-siam-{color}-compact.png` | Small wordmark + full name on one line | Tight nav or captions |
| `logo-siam-{color}-horizontal.png` | Wordmark + full name | Footer or about page |
| `logo-siam-{color}-stacked.png` | Wordmark over the full name | Square-ish layouts |
| `in-cooperation-siam-*.png` | “In cooperation with SIAM” | Guest talks or events **with SIAM**, not chapter identity |

Logo colors: blue, teal, black, white. White marks are transparent PNGs (invisible on a white page). Wordmark blue/teal sampled from official PNGs: `#0073BC`, `#00ACA0`. SIAM’s published Color Palette figure is `siam/siam-official-color-palette.png` (gold, teal, blue, purple, and neutrals with labeled hex/CMYK).

Do not edit these files. Student chapters may use the unaltered SIAM logo on the website. A custom chapter logo still needs SIAM Marketing review.

## On this site

- Header: `rice/logo-rice-blue.svg` (light) and `rice/logo-rice-white.svg` (dark), plus typeset “SIAM Student Chapter”. This is not an official Rice lockup and is not a shield-only crop.
- Footer: `rice/logo-rice-white.svg` linking to `https://www.rice.edu`, and `siam/logo-siam-white.png` linking to `https://www.siam.org`.
- Favicon is a simple Rice Blue mark, not an official Rice or SIAM logo.

## Not copied (on purpose)

- JPEG versions (no transparency, duplicate of PNG/SVG)
- Rice EPS/PDF/AI and mesh/print specialty files (keep the original Box download)
- Rice white-border variants
- Shield-only and academic seal
- SIAM cobranded EPS (large; PNG covers web use)

If you need a missing print file, copy it from the original download folders rather than inventing a new version.

## Optional later (not required to launch)

Asset files here are enough for a Rice + SIAM website. Extra lockup requests, Box lockup browsing, and Rice’s WCAG pairing screenshot are listed in [docs/OFFICER-HANDOFF.md](../../../docs/OFFICER-HANDOFF.md#optional-branding-later).

# Branding assets

Official Rice University and SIAM marks, copied from the university logo pack and the SIAM Logo Guide. Do not redraw, recolor, or combine these into a homemade lockup.

Hex, RGB, and CMYK values for both brands are in `src/data/brand-colors.yaml`. Web files in this folder are public on the site. SIAM print EPS files live in `brand-assets/siam/` and are not deployed. Rice print EPS stays in the original **University Logos** Box download (each file is about 2 MB).

Source pack folders (Rice): `Rice Logo`, `Rice Owl`, `Rice University horizontal logo`, `__Preferred Logo Stacked with _University___`. There is no SIAM, CMOR, or Student Chapter lockup in that pack.

## Rice (`rice/`)

Filenames are lowercase kebab-case. Prefer SVG on the website; PNG is for email, slides, and tools that do not take SVG.

| File pattern                                       | What it is                                 | Typical use                                                       |
| -------------------------------------------------- | ------------------------------------------ | ----------------------------------------------------------------- |
| `logo-rice-{color}.svg` / `.png`                   | Shield + **RICE** wordmark                 | Header on light backgrounds (blue, black, gray) or dark (`white`) |
| `logo-rice-*-shield-white-wordmark.svg` / `.png`   | Colored shield, white **RICE**             | Dark or colored backgrounds                                       |
| `logo-rice-university-{color}.svg` / `.png`        | Shield + **Rice University** (horizontal)  | When the full university name should appear                       |
| `logo-rice-university-*-shield-white-wordmark.png` | Horizontal reverse (no SVG in the pack)    | Dark or gray backgrounds with the full name                       |
| `logo-rice-university-stacked-*.png`               | Preferred stacked “Rice University” lockup | Footer, posters, when a taller mark fits better                   |
| `wordmark-rice-university-*.png`                   | **Rice University** type only, horizontal  | Small sizes where the shield would muddy                          |
| `wordmark-rice-university-stacked-*.png`           | Stacked type only (no shield)              | Tall, narrow layouts                                              |
| `owl-flat-*.svg` / `.png`                          | Standalone owl graphic                     | Decoration only — not a substitute for the official logo          |
| `shield-rice-{color}.svg` / `.png`                 | Shield only (no **RICE** wordmark)         | Browser favicon. Do not use in the header                         |

Rice brand rules that matter here:

- The pack labels shield-only files “USE WITH PA PERMISSION ONLY”. They are here because Public Affairs approved the browser-tab favicon. The header still uses shield + **RICE**, never the shield alone.
- The academic seal was not copied.
- Do not mash a Rice mark together with the SIAM mark. Place them side by side with clear space.
- Digital Rice Blue in these SVGs is the print-oriented fill (`#002169`). Site CSS should still use the web value `#00205B` from [brand.rice.edu/colors](https://brand.rice.edu/colors).

## SIAM (`siam/`)

| File pattern                       | What it is                             | Typical use                                               |
| ---------------------------------- | -------------------------------------- | --------------------------------------------------------- |
| `logo-siam-{color}.png`            | Wordmark only                          | Website; must link to `https://www.siam.org`              |
| `logo-siam-{color}-compact.png`    | Small wordmark + full name on one line | Tight nav or captions                                     |
| `logo-siam-{color}-horizontal.png` | Wordmark + full name                   | Footer or about page                                      |
| `logo-siam-{color}-stacked.png`    | Wordmark over the full name            | Square-ish layouts                                        |
| `in-cooperation-siam-*.png`        | “In cooperation with SIAM”             | Guest talks or events **with SIAM**, not chapter identity |

Logo colors: blue, teal, black, white. White marks are transparent PNGs (invisible on a white page). Wordmark blue/teal sampled from official PNGs: `#0073BC`, `#00ACA0`. SIAM’s published Color Palette figure is `siam/siam-official-color-palette.png` (gold, teal, blue, purple, and neutrals with labeled hex/CMYK).

Do not edit these files. Student chapters may use the unaltered SIAM logo on the website. A custom chapter logo still needs SIAM Marketing review.

## On this site

- Header: `rice/logo-rice-blue.svg` (light) and `rice/logo-rice-white.svg` (dark), plus typeset “SIAM Student Chapter”. This is not an official Rice lockup and is not a shield-only crop.
- Footer: `rice/logo-rice-white.svg` linking to `https://www.rice.edu`, and `siam/logo-siam-white.png` linking to `https://www.siam.org`.
- Hero: faint `rice/owl-flat-white.svg` as decoration only, not a logo.
- Favicon is the official Rice Blue shield (`public/favicon.svg`, from `rice/shield-rice-blue.svg`). PNG sizes are scaled from the official shield PNG. Do not use the shield alone in the header.

## Not copied (on purpose)

- JPEG versions (no transparency, duplicate of PNG/SVG)
- Rice EPS, PDF, AI, and mesh files (keep the original Box download; see [brand-assets/rice/README.md](../../../brand-assets/rice/README.md))
- Rice white-border variants
- Academic seal
- Owl “15% gray” specialty PNG
- SIAM cobranded EPS (large; PNG covers web use)
- Academic or administration unit lockups from the larger Box **Rice Logo Lockups** library

If you need a missing print file, copy it from the original download folders rather than inventing a new version.

## Optional later (not required to launch)

Asset files here are enough for a Rice + SIAM website. Do these only if a later need appears:

- Request a Rice-designed chapter lockup (full words, no acronyms) at [publicaffairs.rice.edu/logo-proj-req-form](https://publicaffairs.rice.edu/logo-proj-req-form). Filename if issued: `logo-rice-siam-student-chapter-{color}.svg` (and `.png` / `.eps` in `brand-assets/rice/` for print). Until then, place a Rice mark next to the SIAM logo with clear space. Do not build a homemade lockup. Lockups cannot use acronyms; the request is “SIAM Student Chapter,” not “Rice SIAM.”
- Check whether an existing unit lockup exists at [bit.ly/rice-logo-lockups](https://bit.ly/rice-logo-lockups) (Rice NetID / Box).
- Capture Rice’s AA text-on-color pairing table from [brand.rice.edu/colors](https://brand.rice.edu/colors) if you want their published combinations instead of checking contrast in this repo’s accessibility tests.
- Email [sactclubs@rice.edu](mailto:sactclubs@rice.edu) if Student Activities has not yet confirmed public use of the Rice name and logo.
- Send a custom chapter mark to [SIAM Marketing](https://www.siam.org/advertising/contact-siam-marketing-staff/) before using it. The unaltered SIAM logo on the website does not need that review.

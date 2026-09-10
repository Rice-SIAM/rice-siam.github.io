# Editing this website

Ordinary updates are YAML and Markdown. You do not need to edit Astro components for officers, events, opportunities, partners, or page copy.

This is still an Astro site. Markdown files are documents that Astro turns into pages.

## First week

1. Clone the repository, run `npm install`, then `npm run dev`.
2. Open http://localhost:4321/ and skim the public pages.
3. Update `src/data/officers.yaml` for the new term.
4. Set `draft: true` on events that should not appear, or leave past events in place so they stay under Past events.
5. Confirm `contactEmail` in `src/data/site.yaml`.
6. Do not publish emails, photos, or social accounts without permission.

## What to edit

| Task                                       | Where                                                        |
| ------------------------------------------ | ------------------------------------------------------------ |
| Officers                                   | `src/data/officers.yaml`                                     |
| Events                                     | `src/content/events/` (one Markdown file per event)          |
| Opportunities                              | `src/content/opportunities/` (one Markdown file per opening) |
| Homepage hero, tagline, contact email, SEO | `src/data/site.yaml`                                         |
| About copy                                 | `src/pages/about.md`                                         |
| Get involved copy                          | `src/pages/get-involved.md`                                  |
| Navigation labels or order                 | `src/data/navigation.yaml`                                   |
| Partners                                   | `src/data/partners.yaml`                                     |
| Social links                               | `src/data/social.yaml`                                       |

Leave a field out until the value is confirmed. Do not invent contact details, membership requirements, sponsorships, officer personal information, or job facts.

The public contact address is `contactEmail` in `site.yaml`. It appears on `/contact`. An `email` on an officer record appears on `/leadership`; omit it unless that person wants it public.

## Site identity

`src/data/site.yaml` fields:

| Field                           | Where it appears                        |
| ------------------------------- | --------------------------------------- |
| `name`                          | Homepage title and footer copyright     |
| `header.title`                  | Text beside the Rice mark in the header |
| `homepage.hero`                 | Homepage intro paragraph                |
| `homepage.about`                | Homepage about sentence                 |
| `tagline`                       | Footer                                  |
| `contactEmail`                  | Contact page                            |
| `seo.title` / `seo.description` | Search and social previews              |

## Page copy

About, Get involved, and the accessibility statement are Markdown files in `src/pages/`. Leave the block between the first two `---` lines unless you are renaming the page. Edit the headings and paragraphs below that block. Links use `[visible text](/path)`.

## Officers

```yaml
- name: Example Name
  role: Treasurer
  term: 2026–2027
  email: example@rice.edu
  photo: /images/officers/example.jpg
  photoAlt: Example Name standing outdoors on campus.
  order: 4
```

- `name` and `order` are the most important fields.
- Add `role` when the public title is confirmed. Officers can appear without a title until then.
- If you add a `photo`, also add `photoAlt`. Put photos in `public/images/officers/`.

Homepage leadership and `/leadership` read this same file.

## Events

Create one Markdown file per event in `src/content/events/`. Name it like `2026-09-18-welcome-meeting.md`. Keep events as separate files so long abstracts stay readable; do not merge them into one YAML list.

```md
---
title: Welcome meeting
start: 2026-09-18T18:00:00-05:00
end: 2026-09-18T19:00:00-05:00
location: Duncan Hall 1075
summary: Opening meeting for the academic year.
registrationUrl: https://example.com/register
calendarUrl: https://example.com/calendar
image: /images/events/welcome.jpg
imageAlt: Students talking before a chapter meeting.
featured: true
draft: false
---

Optional longer description goes here.
```

- `title`, `start`, and `summary` are required.
- Use ISO dates with an offset such as `-05:00` or `-06:00` so GitHub Actions does not shift the clock. A date-only value such as `2026-10-15` is that calendar day, with no time shown.
- `draft: true` keeps an event off the public site, including its detail page.
- After the start time passes, the next site rebuild moves it to Past events. Leave the file unless you want it gone.
- Renaming the file changes the public URL `/events/<filename-without-extension>`.
- `featured: true` prefers an upcoming event on the homepage.
- If you add an `image`, also add `imageAlt`. Event images belong in `public/images/events/`.
- A broken event file fails the build on purpose.

If nothing is published, the events page shows a short empty state.

## Opportunities

Create one Markdown file per opening in `src/content/opportunities/`. Name it like `2026-example-internship.md`. Link to the employer’s posting. Do not copy the employer’s full description onto this site.

```md
---
title: Example internship
organization: Example Lab
type: internship
level: graduate
location: Houston, TX
audience: PhD students
url: https://example.com/posting
summary: Summer research internship in applied mathematics.
deadline: 2026-11-01
draft: false
---
```

- `title`, `organization`, `type`, `url`, and `summary` are required.
- `type` must be `internship`, `postdoc`, or `job`.
- Internships also need `level`: `undergraduate`, `graduate`, or `both`. Listings with `both` appear in both internship sections.
- Write a short chapter summary. Do not paste the employer’s about text, pay, or legal copy.
- `deadline` is shown as “Apply by …” when the posting lists a close date.
- Either `deadline` or `removeAfter` is required so the listing does not stay up indefinitely. Use `removeAfter` when there is no public close date; that field is not shown on the page.
- After that date passes, the next site rebuild removes the listing from the public page. Leave the file unless you want it gone.
- The site does not scrape employer pages to detect closed postings. A live URL can still point to a closed job. Set `deadline` or `removeAfter`, and take a listing down with `draft: true` if the posting closes early.
- `draft: true` keeps an opening off the public site.
- Do not add employer logos.
- The opportunities page already links to SIAM, Rice CCD, and a few public internship lists. Do not copy those tables into this repository. If a listing on those lists is a good fit, add one Markdown file that links to the employer’s posting.
- If nothing is published for a section, that section shows a short empty state.

## Partners and social links

Add a partner only when the relationship is confirmed. Put logos in `public/images/partners/` and include `logoAlt`.

Add a social link only when the account exists. Do not add unused placeholder profiles.

## Navigation

`src/data/navigation.yaml` controls the header, footer, and sitemap titles. Keep the menu one level unless a dropdown is truly needed. Adding a link does not create a page; the page file must already exist.

## What not to edit for ordinary updates

Leave `src/components/`, `src/layouts/`, `astro.config.mjs`, GitHub Actions, and `package.json` to someone who knows Astro.

`src/data/brand-colors.yaml` is a reference list of official Rice and SIAM colors. Changing it does not restyle the site.

Official Rice and SIAM marks are in `public/images/branding/`. See that folder’s README before using a file. Do not recolor marks or combine Rice and SIAM into one homemade lockup.

Rice IT will not map `siam.rice.edu` until accessibility review. Keep skip links, headings, keyboard access, alt text, and contrast intact. See [ACCESSIBILITY.md](./ACCESSIBILITY.md) and [DEPLOYMENT.md](./DEPLOYMENT.md) only when you are preparing domain mapping.

Do not treat [ACCESSIBLE-ASTRO-STARTER.md](./ACCESSIBLE-ASTRO-STARTER.md) as a guide to this chapter site. It is kept for license attribution.

## If something breaks

A malformed YAML, event Markdown, or opportunity Markdown file can fail `npm run build`. Fix the file rather than bypassing the check.

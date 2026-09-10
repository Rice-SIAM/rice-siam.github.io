# Content guide

This site is set up so future officers can update ordinary content without editing Astro components.

## What to edit

| Task                                                   | Where                             |
| ------------------------------------------------------ | --------------------------------- |
| Change officers                                        | `src/data/officers.yaml`          |
| Add or update an event                                 | `src/content/events/`             |
| Add a partner                                          | `src/data/partners.yaml`          |
| Change navigation labels or order                      | `src/data/navigation.yaml`        |
| Change the site name, header title, or SEO description | `src/data/site.yaml`              |
| Add a public social link                               | `src/data/social.yaml`            |
| Change About, Get involved, or Contact copy            | the matching file in `src/pages/` |
| Consult brand color values                             | `src/data/brand-colors.yaml`      |

Do not invent contact details, membership requirements, sponsorships, or officer personal information. Leave a field out until it is confirmed.

## Officers

Edit `src/data/officers.yaml`. Each officer can include:

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
- Omit `email` and `photo` until you have permission to publish them.
- If you add a `photo`, also add `photoAlt`.
- Put photos in `public/images/officers/`.

## Events

Create one Markdown file per event in `src/content/events/`. Use a filename such as `2026-09-18-welcome-meeting.md`.

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

Rules:

- `title`, `start`, and `summary` are required.
- Use ISO dates. For a timed event, include an offset such as `-05:00` or `-06:00` so GitHub Actions does not shift the clock. A date-only value such as `2026-10-15` is treated as that calendar day, with no time shown.
- Set `draft: true` to keep an event out of the public site.
- Set `featured: true` to prefer an upcoming event on the homepage.
- If you add an `image`, also add `imageAlt`.
- Malformed event files will fail the build. That is intentional.
- Event images belong in `public/images/events/`.

If there are no published events, the events page shows a short empty state instead of fake content. Each published file also gets a detail page at `/events/<filename-without-extension>`.

## Partners

Edit `src/data/partners.yaml`. Start from an empty list:

```yaml
- name: Example Partner
  url: https://example.edu
  logo: /images/partners/example.svg
  logoAlt: Example Partner logo
  description: Optional one-sentence description.
```

Add a partner only when the relationship is confirmed. Put logos in `public/images/partners/`.

## News

There is no public news section yet. Do not add placeholder announcements. A news collection can be introduced later if the chapter needs one.

## Social links

Add a link to `src/data/social.yaml` only when the account exists:

```yaml
- label: Example
  href: https://example.com/rice-siam
  icon: lucide:globe
  external: true
```

Do not add unused placeholder profiles. Do not add the chapter GitHub organization unless leadership wants it on the public site.

## Site identity

Edit `src/data/site.yaml` for the chapter name, header title, and SEO text. Add `contactEmail` only when a public chapter address is confirmed.

Official Rice and SIAM logos live in `public/images/branding/`. Color values for both brands are in `src/data/brand-colors.yaml`. See the branding folder README before using a file. Print EPS copies of the SIAM wordmark are in `brand-assets/siam/`.

## Navigation

`src/data/navigation.yaml` controls the header and footer links. Keep the menu one level unless a dropdown is truly needed.

## What not to edit for ordinary updates

Avoid editing files in `src/components/`, `src/layouts/`, `astro.config.mjs`, or `package.json` unless you are changing how the site works. Ask someone comfortable with Astro for those changes.

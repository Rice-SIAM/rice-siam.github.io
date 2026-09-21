# Chapter newsletter

The printable flyer is `/newsletter`. The paste-ready email is `/newsletter/email`. Neither is in the header. Both are `noindex`.

The newsletter is monthly: one issue for that month, not a weekly or day-of reminder. Details can be thin at first. Put a date on the calendar when you have one; add time, place, and RSVP later. A short email for one event can still go out when that event is ready. That mail is separate from the monthly issue.

Edit `src/data/newsletter.yaml` for the issue, greeting, and featured blurb. Upcoming chapter events, internships, jobs, and fellowships are pulled from the site collections as of `asOf`. Related workshops and conferences belong in `src/content/conferences/` unless the chapter hosts them.

## Two pieces each issue

1. **Flyer** (`/newsletter`, then `npm run newsletter:pdf`). One page for the month: the featured item, then internships, jobs, fellowships, and conferences. Attach the PDF if you want. Do not use the browser Print dialog; it drops the layout.
2. **Email** (`/newsletter/email`). Greeting, the featured item, internships, jobs, fellowships, and conferences. Copy the plain-text block into OwlNest, Mailchimp, or another list tool so links stay clickable.

A single-event poster is `/events/<id>/flyer` for upcoming events. After the event ends, that route is removed. For an upcoming event:

```bash
FLYER_PATH=/events/<id>/flyer npm run flyer:pdf
```

That writes `out/rice-siam-events-<id>.pdf` and a matching `.png`.

Each new month, change `id`, `issue`, `month`, `subject`, and `asOf`, then point `featured` at this month’s lead. Rebuild. Do not send another full issue in the same month.

```bash
npm run newsletter:pdf
```

That writes `out/rice-siam-newsletter-<id>.pdf` and a matching `.png` rasterized from the PDF, so the preview has the same even margins. That folder is not committed. Links in the PDF use the public site from `astro.config.mjs` (`site`), not the local preview used to print. Send the PNG for a glance; attach the PDF for print and clickable links. The email body should still be the text from `/newsletter/email`.

## What goes in YAML vs event files

| Field                                                   | Where                                                                                                                       |
| ------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| Issue number, month, subject, greeting, intro, headline | `src/data/newsletter.yaml`                                                                                                  |
| Featured item                                           | `featured.eventId` once that event file exists, or a title and summary already backed by the site                           |
| Dated chapter events                                    | `src/content/events/` (on the events page; the monthly issue features one when `featured.eventId` is set)                   |
| Internships, jobs, and fellowships                      | `src/content/opportunities/` (open listings as of `asOf`; `opportunityUntil` keeps this issue to nearby apply-by dates)     |
| Workshops and conferences the chapter does not host     | `src/content/conferences/`                                                                                                  |
| Keep up with us                                         | `follow` in the YAML; Instagram, Slack, and similar links also come from `src/data/social.yaml` when that file has accounts |
| Notes and career links                                  | `notes` and `resources` in the YAML                                                                                         |

Do not invent dated events in `newsletter.yaml`. When a date is known, add an event Markdown file even if the clock time and room are not. Use a date-only `start` with `allDay: true` until a time is confirmed. Omit `location` and `registrationUrl` until they are confirmed. The one-line `summary` is enough for the poster (for example, “Movie night with food and drinks”). Do not write “TBA,” “check back,” or “details as they are confirmed.”

To spotlight the next gathering:

```yaml
featured:
  kicker: Next gathering
  eventId: <event collection id>
  hrefLabel: Event details
```

`title`, `summary`, date, location, and registration then come from that event file. You can still override `title` or `summary` in YAML if the email needs a longer pitch.

## Cadence

- **One issue each month.** `id` is `YYYY-MM`. Increment `issue`. Set `asOf` to the day you build the issue. The October 2026 issue waits until after the RTG NASC workshop (October 2–3), which the September issue already included.
- **Featured block.** Use `featured.eventId` when a chapter event has a date. If the month has no dated chapter event, feature a deadline or meeting that is already on the site. Do not invent a gathering, a date, or a room.
- **New dates during the month.** Add the event file when the date is known. Leave `location` off until the room is confirmed. The event appears on the events page at the next site rebuild. It joins the newsletter in the next monthly issue, unless officers send a separate event email.
- **After the event.** Leave the file in `src/content/events/`. It moves under Past events on the next rebuild. Do not keep a separate history YAML.

## Programming menu

These are ideas for officers, not a public schedule. Add an event file only when the date is known. Chapter history already includes pub nights at Valhalla, game nights, and fall / spring / end-of-semester barbecues.

| Idea                                 | Notes from chapter history or similar Rice groups                                                                                     |
| ------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------- |
| SIAM Pub Night                       | Recurring social at Valhalla, under Keck Hall. Food and drinks. A natural first gathering.                                            |
| Halloween movie night                | One-night social with a film, snacks, and drinks. Use a chapter title; do not copy another group’s name.                              |
| Game night                           | Board, card, or video games. Past joint events with GradGames.                                                                        |
| End-of-semester BBQ                  | Late November or after finals. Graduate Commons, outside Valhalla in past years. Needs a grill lead and a date before you publish it. |
| Welcome social                       | Food and drinks, optional structured intros. Valhalla, under Keck Hall, is a usual room when it is booked.                            |
| Quiet make-and-take or study hangout | Crafts or snacks without a program, if someone will host it.                                                                          |
| Talk, panel, or journal club         | Academic events still belong on the same calendar.                                                                                    |

Do not list CMOR-only graduate seminars as chapter events.

## Channels

Add a link only when the account or list exists:

- Events page on this site (already in `follow`)
- OwlNest for RSVP (`registrationUrl` on the event file)
- Instagram, Slack, or a listserv (`src/data/social.yaml`, then they also appear under “Keep up with us”)
- Public chapter email (`contactEmail` in `src/data/site.yaml`)

Do not add placeholder social profiles.

## Copy

Public newsletter pages follow the same rules as the rest of the site. Describe what is listed now. Do not explain how the site will be updated. Greeting and intro belong in `newsletter.yaml`; keep them present tense.

Rice-first identity on the newsletter and event flyers: official Rice mark plus typeset chapter name in the header; official SIAM wordmark in the footer, linking to siam.org. Rice Blue and Atkinson Hyperlegible. Do not paste another student group’s artwork into this repository. Do not put the Rice and SIAM marks together as a homemade lockup.

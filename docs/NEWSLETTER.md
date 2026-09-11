# Chapter newsletter

The printable flyer is `/newsletter`. The paste-ready email is `/newsletter/email`. Neither is in the header. Both are `noindex`.

This is the same shape other Rice student groups use: one semester poster, then short reminder emails as each gathering approaches. Details can be thin at first. Put a date on the calendar when you have one; add time, place, and RSVP later.

Edit `src/data/newsletter.yaml` for the issue, greeting, and featured blurb. Upcoming chapter events, internships, and jobs are pulled from the site collections as of `asOf`. Related workshops and conferences belong in `meetings` unless the chapter hosts them.

## Two pieces each issue

1. **Flyer** (`/newsletter`, then `npm run newsletter:pdf`). A semester-at-a-glance poster: date pills, event name, and a one-line summary. Attach the PDF if you want. Do not use the browser Print dialog; it drops the layout.
2. **Email** (`/newsletter/email`). Greeting, the next gathering with time and place when those exist, the semester list, internships, jobs, workshops, and “Keep up with us.” Copy the plain-text block into OwlNest, Mailchimp, or another list tool so links stay clickable.

A single-event poster is `/events/<id>/flyer` for upcoming events. For the current pub night:

```bash
FLYER_PATH=/events/2026-09-17-siam-pub-night/flyer npm run flyer:pdf
```

That writes `out/rice-siam-events-2026-09-17-siam-pub-night.pdf`.

Send a reminder email when an event is close. Change `featured.eventId` to that event’s collection id, update `subject` and `intro`, and rebuild. Leave the rest of the semester list in place.

```bash
npm run newsletter:pdf
```

That writes `out/rice-siam-newsletter-<id>.pdf`. That folder is not committed.

## What goes in YAML vs event files

| Field                                                   | Where                                                                                                                       |
| ------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| Issue number, month, subject, greeting, intro, headline | `src/data/newsletter.yaml`                                                                                                  |
| Featured next gathering                                 | `featured.eventId` once that event file exists                                                                              |
| Semester list                                           | `src/content/events/` (upcoming as of `asOf`)                                                                               |
| Internships and jobs                                    | `src/content/opportunities/`                                                                                                |
| Workshops and conferences the chapter does not host     | `meetings` in `src/data/newsletter.yaml`                                                                                    |
| Keep up with us                                         | `follow` in the YAML; Instagram, Slack, and similar links also come from `src/data/social.yaml` when that file has accounts |
| Notes and career links                                  | `notes` and `resources` in the YAML                                                                                         |

Do not invent dated events in `newsletter.yaml`. When a date is known, add an event Markdown file even if the clock time and room are not. Use a date-only `start` with `allDay: true` until a time is confirmed. Omit `location` and `registrationUrl` until they are confirmed. The one-line `summary` is enough for the poster (for example, “Movie night with food and drinks”). Do not write “TBA,” “check back,” or “details as they are confirmed.”

To spotlight the next gathering:

```yaml
featured:
  kicker: Next gathering
  eventId: 2026-10-15-siam-movie-night
  hrefLabel: Event details
```

`title`, `summary`, date, location, and registration then come from that event file. You can still override `title` or `summary` in YAML if the email needs a longer pitch.

## Cadence that works

- **Start of term:** flyer plus email. List every dated event you are willing to stand behind, plus internships.
- **About a week before each event, and the day of:** short email. Same semester list; featured block is that event.
- **After the term:** leave past event files in `src/content/events/`. They move under Past events on the next rebuild. Do not keep a separate history YAML.

## Programming menu

These are ideas for officers, not a public schedule. Add an event file only when the date is known. Chapter history already includes pub nights at Valhalla, game nights, and fall / spring / end-of-semester barbecues.

| Idea                                 | Notes from chapter history or similar Rice groups                                                                                       |
| ------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------- |
| SIAM Pub Night                       | Recurring social at Valhalla. Food and drinks. A natural first gathering.                                                               |
| Halloween movie night                | One-night social with a film, snacks, and drinks. Use a chapter title; do not copy another group’s name.                                |
| Game night                           | Board, card, or video games. Past joint events with GradGames.                                                                          |
| End-of-semester BBQ                  | Late November or after finals. Graduate Commons or outside Valhalla in past years. Needs a grill lead and a date before you publish it. |
| Welcome social                       | Food and drinks, optional structured intros. Valhalla is a usual room when it is booked.                                                |
| Quiet make-and-take or study hangout | Crafts or snacks without a program, if someone will host it.                                                                            |
| Talk, panel, or journal club         | Academic events still belong on the same calendar.                                                                                      |

Do not list CMOR-only graduate seminars as chapter events.

## Channels

Add a link only when the account or list exists:

- Events page on this site (already in `follow`)
- OwlNest for RSVP (`registrationUrl` on the event file)
- Instagram, Slack, Google Calendar, or a listserv (`src/data/social.yaml`, then they also appear under “Keep up with us”)
- Public chapter email (`contactEmail` in `src/data/site.yaml`)

Do not add placeholder social profiles.

## Copy

Public newsletter pages follow the same rules as the rest of the site. Describe what is listed now. Do not explain how the site will be updated. Greeting and intro belong in `newsletter.yaml`; keep them present tense.

Rice-first identity on the flyer: official Rice and SIAM marks, Rice Blue, Atkinson Hyperlegible. Do not paste another student group’s artwork into this repository.

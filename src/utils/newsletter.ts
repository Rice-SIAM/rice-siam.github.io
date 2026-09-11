import { getEntry } from 'astro:content'
import { z } from 'astro/zod'
import { loadYaml } from './loadYaml'
import { formatEventDateRange, getUpcomingEvents, type EventEntry } from './events'
import { formatDeadline, getOpenOpportunities, type OpportunityEntry } from './opportunities'
import { getSite, getSocials, type SiteData } from './siteData'

function requireHrefLabel(item: { href?: string; hrefLabel?: string }, ctx: z.RefinementCtx) {
  if (item.href && !item.hrefLabel) {
    ctx.addIssue({
      code: 'custom',
      message: 'hrefLabel is required when href is set',
      path: ['hrefLabel'],
    })
  }
}

const NewsletterLinkSchema = z
  .object({
    title: z.string(),
    body: z.string().optional(),
    href: z.string().optional(),
    hrefLabel: z.string().optional(),
  })
  .superRefine(requireHrefLabel)

const NewsletterFeaturedSchema = z
  .object({
    kicker: z.string().optional(),
    title: z.string().optional(),
    summary: z.string().optional(),
    href: z.string().optional(),
    hrefLabel: z.string().optional(),
    eventId: z.string().optional(),
  })
  .superRefine((item, ctx) => {
    requireHrefLabel(item, ctx)
    if (!item.eventId && (!item.title || !item.summary)) {
      ctx.addIssue({
        code: 'custom',
        message: 'title and summary are required unless eventId is set',
        path: item.title ? ['summary'] : ['title'],
      })
    }
  })

const NewsletterResourceItemSchema = z.object({
  label: z.string(),
  href: z.string(),
  note: z.string().optional(),
})

const NewsletterMeetingSchema = z.object({
  title: z.string(),
  when: z.string().optional(),
  location: z.string().optional(),
  href: z.string(),
  hrefLabel: z.string().optional(),
  note: z.string().optional(),
})

const NewsletterIssueSchema = z.object({
  id: z.string().regex(/^\d{4}-\d{2}$/, 'Use YYYY-MM, such as 2026-09'),
  issue: z.number().int().positive(),
  month: z.string(),
  subject: z.string(),
  headline: z.string().optional(),
  greeting: z.string().optional(),
  intro: z.string().optional(),
  semesterTitle: z.string().default('Events for the semester'),
  asOf: z.coerce.date(),
  maxEvents: z.number().int().positive().default(8),
  maxOpportunities: z.number().int().positive().default(5),
  maxJobs: z.number().int().positive().default(4),
  maxFellowships: z.number().int().positive().default(4),
  featured: NewsletterFeaturedSchema,
  notes: z.array(NewsletterLinkSchema).default([]),
  follow: z
    .object({
      title: z.string(),
      body: z.string().optional(),
      items: z.array(NewsletterResourceItemSchema).default([]),
    })
    .optional(),
  meetings: z
    .object({
      title: z.string(),
      items: z.array(NewsletterMeetingSchema),
    })
    .optional(),
  resources: z
    .object({
      title: z.string(),
      items: z.array(NewsletterResourceItemSchema),
    })
    .optional(),
})

export type NewsletterIssue = z.infer<typeof NewsletterIssueSchema>

export type NewsletterFeatured = {
  kicker?: string
  title: string
  summary: string
  href?: string
  hrefLabel?: string
  eventId?: string
  when?: string
  location?: string
  registrationUrl?: string
}

export type NewsletterFollow = {
  title: string
  body?: string
  items: { label: string; href: string; note?: string }[]
}

export type NewsletterMeeting = z.infer<typeof NewsletterMeetingSchema>

export type NewsletterData = {
  site: SiteData
  issue: NewsletterIssue
  featured: NewsletterFeatured
  events: EventEntry[]
  internships: OpportunityEntry[]
  jobs: OpportunityEntry[]
  fellowships: OpportunityEntry[]
  follow?: NewsletterFollow
}

export function getNewsletterIssue(): NewsletterIssue {
  return NewsletterIssueSchema.parse(loadYaml('newsletter.yaml'))
}

export function isHttpUrl(href: string): boolean {
  return /^https?:\/\//.test(href)
}

export function toAbsoluteUrl(path: string, site: URL | string): string {
  if (isHttpUrl(path)) {
    return path
  }

  return new URL(path, site).href
}

export function eventWhenWhere(event: EventEntry): string {
  const when = formatEventDateRange(event.data.start, event.data.end, event.data.allDay)
  return event.data.location ? `${when} · ${event.data.location}` : when
}

async function resolveFeatured(issue: NewsletterIssue): Promise<NewsletterFeatured> {
  const { featured } = issue
  if (!featured.eventId) {
    return {
      kicker: featured.kicker,
      title: featured.title ?? '',
      summary: featured.summary ?? '',
      href: featured.href,
      hrefLabel: featured.hrefLabel,
    }
  }

  const event = await getEntry('events', featured.eventId)
  if (!event || event.data.draft) {
    throw new Error(`Newsletter featured event "${featured.eventId}" is missing or draft.`)
  }

  return {
    kicker: featured.kicker,
    title: featured.title ?? event.data.title,
    summary: featured.summary ?? event.data.summary,
    href: featured.href ?? `/events/${event.id}`,
    hrefLabel: featured.hrefLabel ?? 'Event details',
    eventId: event.id,
    when: formatEventDateRange(event.data.start, event.data.end, event.data.allDay),
    location: event.data.location,
    registrationUrl: event.data.registrationUrl,
  }
}

function resolveFollow(issue: NewsletterIssue): NewsletterFollow | undefined {
  if (!issue.follow) {
    return undefined
  }

  const items = [...issue.follow.items]
  for (const social of getSocials()) {
    if (!items.some((item) => item.href === social.href)) {
      items.push({ label: social.label, href: social.href })
    }
  }

  if (!issue.follow.body && items.length === 0) {
    return undefined
  }

  return {
    title: issue.follow.title,
    body: issue.follow.body,
    items,
  }
}

export async function getNewsletterData(): Promise<NewsletterData> {
  const issue = getNewsletterIssue()
  const open = await getOpenOpportunities(issue.asOf)
  const internships = open.filter((opportunity) => opportunity.data.type === 'internship')
  const jobs = open.filter((opportunity) => opportunity.data.type === 'job')
  const fellowships = open.filter((opportunity) => opportunity.data.type === 'fellowship')

  return {
    site: getSite(),
    issue,
    featured: await resolveFeatured(issue),
    events: (await getUpcomingEvents(issue.asOf)).slice(0, issue.maxEvents),
    internships: internships.slice(0, issue.maxOpportunities),
    jobs: jobs.slice(0, issue.maxJobs),
    fellowships: fellowships.slice(0, issue.maxFellowships),
    follow: resolveFollow(issue),
  }
}

function pushLinkBlock(
  lines: string[],
  title: string,
  body: string | undefined,
  href: string | undefined,
  site: URL | string,
) {
  lines.push(title)
  if (body) {
    lines.push(body)
  }
  if (href) {
    lines.push(toAbsoluteUrl(href, site))
  }
  lines.push('')
}

function pushOpportunityBlock(
  lines: string[],
  heading: string,
  empty: string,
  items: OpportunityEntry[],
  emptyHref: string,
  site: URL | string,
) {
  if (items.length > 0) {
    lines.push(heading, '')
    for (const opportunity of items) {
      lines.push(`${opportunity.data.organization}: ${opportunity.data.title}`)
      if (opportunity.data.deadline) {
        lines.push(`Apply by ${formatDeadline(opportunity.data.deadline)}.`)
      }
      lines.push(opportunity.data.url, '')
    }
  } else {
    lines.push(empty, toAbsoluteUrl(emptyHref, site), '')
  }
}

export function renderNewsletterText(data: NewsletterData, site: URL | string): string {
  const { issue, featured, events, internships, jobs, fellowships, follow } = data
  const lines: string[] = [issue.subject, '']

  if (issue.greeting) {
    lines.push(issue.greeting, '')
  }

  if (issue.intro) {
    lines.push(issue.intro, '')
  }

  if (featured.kicker) {
    lines.push(featured.kicker)
  }
  lines.push(featured.title)
  if (featured.when) {
    lines.push(featured.location ? `${featured.when} · ${featured.location}` : featured.when)
  }
  lines.push(featured.summary)
  if (featured.href) {
    lines.push(toAbsoluteUrl(featured.href, site))
  }
  if (featured.registrationUrl) {
    lines.push(toAbsoluteUrl(featured.registrationUrl, site))
  }
  lines.push('')

  lines.push(issue.semesterTitle, '')
  if (events.length > 0) {
    for (const event of events) {
      lines.push(event.data.title)
      lines.push(eventWhenWhere(event))
      lines.push(event.data.summary)
      lines.push(toAbsoluteUrl(`/events/${event.id}`, site))
      if (event.data.registrationUrl) {
        lines.push(toAbsoluteUrl(event.data.registrationUrl, site))
      }
      lines.push('')
    }
  } else {
    lines.push('No upcoming events are listed.', toAbsoluteUrl('/events', site), '')
  }

  pushOpportunityBlock(lines, 'Internships', 'No internships are listed.', internships, '/opportunities', site)
  pushOpportunityBlock(lines, 'Jobs', 'No jobs are listed.', jobs, '/opportunities', site)
  pushOpportunityBlock(lines, 'Fellowships', 'No fellowships are listed.', fellowships, '/opportunities', site)

  if (issue.meetings && issue.meetings.items.length > 0) {
    lines.push(issue.meetings.title, '')
    for (const meeting of issue.meetings.items) {
      lines.push(meeting.title)
      if (meeting.when) {
        lines.push(meeting.location ? `${meeting.when} · ${meeting.location}` : meeting.when)
      } else if (meeting.location) {
        lines.push(meeting.location)
      }
      if (meeting.note) {
        lines.push(meeting.note)
      }
      lines.push(toAbsoluteUrl(meeting.href, site), '')
    }
  }

  for (const note of issue.notes) {
    pushLinkBlock(lines, note.title, note.body, note.href, site)
  }

  if (follow) {
    lines.push(follow.title)
    if (follow.body) {
      lines.push(follow.body)
    }
    lines.push('')
    for (const item of follow.items) {
      lines.push(item.label)
      if (item.note) {
        lines.push(item.note)
      }
      lines.push(toAbsoluteUrl(item.href, site), '')
    }
  }

  if (issue.resources) {
    lines.push(issue.resources.title, '')
    for (const item of issue.resources.items) {
      lines.push(item.label)
      if (item.note) {
        lines.push(item.note)
      }
      lines.push(toAbsoluteUrl(item.href, site), '')
    }
  }

  lines.push(data.site.name, toAbsoluteUrl('/', site))
  if (data.site.contactEmail) {
    lines.push(data.site.contactEmail)
  }

  return `${lines
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim()}\n`
}

import { getEntry } from 'astro:content'
import { z } from 'astro/zod'
import { loadYaml } from './loadYaml'
import { formatEventDateRange, getUpcomingEvents, type EventEntry } from './events'
import { formatDeadline, getOpenOpportunities, type OpportunityEntry } from './opportunities'
import { getSite, type SiteData } from './siteData'

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
  href: z.string().url(),
  note: z.string().optional(),
})

const NewsletterIssueSchema = z.object({
  id: z.string().regex(/^\d{4}-\d{2}$/, 'Use YYYY-MM, such as 2026-09'),
  issue: z.number().int().positive(),
  month: z.string(),
  subject: z.string(),
  asOf: z.coerce.date(),
  maxEvents: z.number().int().positive().default(3),
  maxOpportunities: z.number().int().positive().default(5),
  featured: NewsletterFeaturedSchema,
  notes: z.array(NewsletterLinkSchema).default([]),
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
}

export type NewsletterData = {
  site: SiteData
  issue: NewsletterIssue
  featured: NewsletterFeatured
  events: EventEntry[]
  opportunities: OpportunityEntry[]
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
    title: event.data.title,
    summary: event.data.summary,
    href: `/events/${event.id}`,
    hrefLabel: featured.hrefLabel ?? 'Event details',
  }
}

export async function getNewsletterData(): Promise<NewsletterData> {
  const issue = getNewsletterIssue()
  const internships = (await getOpenOpportunities(issue.asOf)).filter(
    (opportunity) => opportunity.data.type === 'internship',
  )

  return {
    site: getSite(),
    issue,
    featured: await resolveFeatured(issue),
    events: (await getUpcomingEvents(issue.asOf)).slice(0, issue.maxEvents),
    opportunities: internships.slice(0, issue.maxOpportunities),
  }
}

export function renderNewsletterText(data: NewsletterData, site: URL | string): string {
  const { issue, featured, events, opportunities } = data
  const lines: string[] = [issue.subject, '', featured.title, featured.summary]

  if (featured.href) {
    lines.push(toAbsoluteUrl(featured.href, site))
  }

  lines.push('')

  if (events.length > 0) {
    lines.push('Upcoming events', '')
    for (const event of events) {
      lines.push(event.data.title)
      lines.push(formatEventDateRange(event.data.start, event.data.end))
      if (event.data.location) {
        lines.push(event.data.location)
      }
      lines.push(toAbsoluteUrl(`/events/${event.id}`, site), '')
    }
  } else {
    lines.push('No upcoming events are listed.', toAbsoluteUrl('/events', site), '')
  }

  if (opportunities.length > 0) {
    lines.push('Internships', '')
    for (const opportunity of opportunities) {
      lines.push(`${opportunity.data.organization}: ${opportunity.data.title}`)
      if (opportunity.data.deadline) {
        lines.push(`Apply by ${formatDeadline(opportunity.data.deadline)}.`)
      }
      lines.push(opportunity.data.url, '')
    }
  } else {
    lines.push('No internships are listed.', toAbsoluteUrl('/opportunities', site), '')
  }

  for (const note of issue.notes) {
    lines.push(note.title)
    if (note.body) {
      lines.push(note.body)
    }
    if (note.href) {
      lines.push(toAbsoluteUrl(note.href, site))
    }
    lines.push('')
  }

  if (issue.resources) {
    lines.push(issue.resources.title, '')
    for (const item of issue.resources.items) {
      lines.push(item.label)
      if (item.note) {
        lines.push(item.note)
      }
      lines.push(item.href, '')
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

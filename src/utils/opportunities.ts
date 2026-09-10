import { getCollection, type CollectionEntry } from 'astro:content'

export const OPPORTUNITY_TYPES = ['internship', 'postdoc', 'job'] as const

export type OpportunityType = (typeof OPPORTUNITY_TYPES)[number]
export type OpportunityEntry = CollectionEntry<'opportunities'>

export const OPPORTUNITY_TYPE_LABELS: Record<OpportunityType, string> = {
  internship: 'Internship',
  postdoc: 'Postdoc',
  job: 'Job',
}

export const OPPORTUNITY_SECTION_TITLES: Record<OpportunityType, string> = {
  internship: 'Internships',
  postdoc: 'Postdocs',
  job: 'Jobs',
}

export const OPPORTUNITY_EMPTY_MESSAGES: Record<OpportunityType, string> = {
  internship: 'No internships are listed.',
  postdoc: 'No postdocs are listed.',
  job: 'No jobs are listed.',
}

function isDateOnly(date: Date): boolean {
  return (
    date.getUTCHours() === 0 &&
    date.getUTCMinutes() === 0 &&
    date.getUTCSeconds() === 0 &&
    date.getUTCMilliseconds() === 0
  )
}

function endOfListingDay(date: Date): Date {
  if (isDateOnly(date)) {
    return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), 23, 59, 59, 999))
  }

  return date
}

function listingEnd(opportunity: OpportunityEntry): Date {
  const { deadline, removeAfter } = opportunity.data
  const ends = [deadline, removeAfter].filter((value): value is Date => Boolean(value)).map(endOfListingDay)
  return new Date(Math.min(...ends.map((value) => value.valueOf())))
}

function compareOpportunities(a: OpportunityEntry, b: OpportunityEntry): number {
  const aDeadline = a.data.deadline?.valueOf() ?? Number.POSITIVE_INFINITY
  const bDeadline = b.data.deadline?.valueOf() ?? Number.POSITIVE_INFINITY
  if (aDeadline !== bDeadline) {
    return aDeadline - bDeadline
  }

  return a.data.organization.localeCompare(b.data.organization) || a.data.title.localeCompare(b.data.title)
}

export async function getOpenOpportunities(): Promise<OpportunityEntry[]> {
  const now = new Date()
  const opportunities = await getCollection('opportunities', ({ data }) => !data.draft)
  return opportunities.filter((opportunity) => listingEnd(opportunity) >= now).sort(compareOpportunities)
}

export async function getOpenOpportunitySections(): Promise<Record<OpportunityType, OpportunityEntry[]>> {
  const opportunities = await getOpenOpportunities()
  return {
    internship: opportunities.filter((opportunity) => opportunity.data.type === 'internship'),
    postdoc: opportunities.filter((opportunity) => opportunity.data.type === 'postdoc'),
    job: opportunities.filter((opportunity) => opportunity.data.type === 'job'),
  }
}

export function formatDeadline(date: Date): string {
  if (isDateOnly(date)) {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      timeZone: 'UTC',
    })
  }

  return date.toLocaleString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    timeZone: 'America/Chicago',
  })
}

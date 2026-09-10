import { getCollection, type CollectionEntry } from 'astro:content'

export const OPPORTUNITY_TYPES = ['internship', 'postdoc', 'job'] as const

export type OpportunityType = (typeof OPPORTUNITY_TYPES)[number]
export type OpportunityEntry = CollectionEntry<'opportunities'>
export type OpportunityLevel = NonNullable<OpportunityEntry['data']['level']>

export type OpportunityPageSection = {
  id: string
  title: string
  emptyMessage: string
  opportunities: OpportunityEntry[]
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

function isInternshipFor(opportunity: OpportunityEntry, level: Exclude<OpportunityLevel, 'both'>): boolean {
  return (
    opportunity.data.type === 'internship' && (opportunity.data.level === level || opportunity.data.level === 'both')
  )
}

export async function getOpenOpportunities(): Promise<OpportunityEntry[]> {
  const now = new Date()
  const opportunities = await getCollection('opportunities', ({ data }) => !data.draft)
  return opportunities.filter((opportunity) => listingEnd(opportunity) >= now).sort(compareOpportunities)
}

export async function getOpenOpportunitySections(): Promise<OpportunityPageSection[]> {
  const opportunities = await getOpenOpportunities()

  return [
    {
      id: 'undergraduate-internships',
      title: 'Undergraduate internships',
      emptyMessage: 'No undergraduate internships are listed.',
      opportunities: opportunities.filter((opportunity) => isInternshipFor(opportunity, 'undergraduate')),
    },
    {
      id: 'graduate-internships',
      title: 'Graduate internships',
      emptyMessage: 'No graduate internships are listed.',
      opportunities: opportunities.filter((opportunity) => isInternshipFor(opportunity, 'graduate')),
    },
    {
      id: 'postdocs',
      title: 'Postdocs',
      emptyMessage: 'No postdocs are listed.',
      opportunities: opportunities.filter((opportunity) => opportunity.data.type === 'postdoc'),
    },
    {
      id: 'jobs',
      title: 'Jobs',
      emptyMessage: 'No jobs are listed.',
      opportunities: opportunities.filter((opportunity) => opportunity.data.type === 'job'),
    },
  ]
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

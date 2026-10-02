import { getCollection, type CollectionEntry } from 'astro:content'
import { OPPORTUNITY_SECTIONS } from './opportunity-sections'
import { isUtcDateOnly, listingClosesAt } from './schedule'

export const OPPORTUNITY_TYPES = ['internship', 'postdoc', 'fellowship', 'job'] as const

export type OpportunityType = (typeof OPPORTUNITY_TYPES)[number]
export type OpportunityEntry = CollectionEntry<'opportunities'>

export type OpportunityPageSection = {
  id: string
  title: string
  emptyMessage: string
  opportunities: OpportunityEntry[]
}

function listingEnd(opportunity: OpportunityEntry): Date {
  return listingClosesAt(opportunity.data.deadline, opportunity.data.removeAfter)
}

function compareOpportunities(a: OpportunityEntry, b: OpportunityEntry): number {
  const aDeadline = a.data.deadline?.valueOf() ?? Number.POSITIVE_INFINITY
  const bDeadline = b.data.deadline?.valueOf() ?? Number.POSITIVE_INFINITY
  if (aDeadline !== bDeadline) {
    return aDeadline - bDeadline
  }

  return a.data.organization.localeCompare(b.data.organization) || a.data.title.localeCompare(b.data.title)
}

export async function getOpenOpportunities(asOf = new Date()): Promise<OpportunityEntry[]> {
  const opportunities = await getCollection('opportunities', ({ data }) => !data.draft)
  return opportunities.filter((opportunity) => listingEnd(opportunity) >= asOf).sort(compareOpportunities)
}

export async function getOpenOpportunitySections(): Promise<OpportunityPageSection[]> {
  const opportunities = await getOpenOpportunities()

  return OPPORTUNITY_SECTIONS.map((section) => ({
    id: section.id,
    title: section.title,
    emptyMessage: section.emptyMessage,
    opportunities: opportunities.filter((opportunity) =>
      section.includes({ type: opportunity.data.type, level: opportunity.data.level }),
    ),
  }))
}

export function formatDeadline(date: Date): string {
  if (isUtcDateOnly(date)) {
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

import { readdirSync, readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { parse } from 'yaml'
import { OPPORTUNITY_SECTIONS, type OpportunityShape } from '../src/utils/opportunity-sections.ts'
import {
  academicYearId,
  academicYearLabel,
  academicYearStartYear,
  isListedPast,
  isListingClosed,
  type ListedRange,
} from '../src/utils/schedule.ts'

// The pages are built with this same clock. Assertions follow the files, so a listing
// aging out does not require a new expected title or id.
const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')
const asOf = new Date()

export type ListedEvent = ListedRange & {
  id: string
  title: string
  summary: string
  featured: boolean
  yearId: string
}

export type ListedConference = {
  title: string
  url: string
}

export type ListedOpportunity = OpportunityShape & {
  title: string
  url: string
  summary: string
  showSummary: boolean
}

export type PastYearGroup = {
  term: string
  yearId: string
  events: ListedEvent[]
}

type Frontmatter = Record<string, unknown>

function readFrontmatter(filePath: string): Frontmatter {
  const text = readFileSync(filePath, 'utf8')
  const match = text.match(/^---\r?\n([\s\S]*?)\r?\n---/)
  if (!match) {
    throw new Error(`No frontmatter in ${filePath}`)
  }

  const data = parse(match[1])
  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    throw new Error(`Invalid frontmatter in ${filePath}`)
  }

  return data as Frontmatter
}

function asDate(value: unknown, filePath: string, field: string): Date {
  const date =
    value instanceof Date ? value : typeof value === 'string' || typeof value === 'number' ? new Date(value) : null
  if (!date || Number.isNaN(date.valueOf())) {
    throw new Error(`${filePath} ${field} is not a date`)
  }

  return date
}

function optionalDate(value: unknown, filePath: string, field: string): Date | undefined {
  if (value == null) return undefined
  return asDate(value, filePath, field)
}

function markdownFiles(directory: string): string[] {
  return readdirSync(path.join(root, directory))
    .filter((name) => name.endsWith('.md') || name.endsWith('.mdx'))
    .map((name) => path.join(root, directory, name))
}

function splitBy<T>(items: T[], isPast: (item: T) => boolean): { upcoming: T[]; past: T[] } {
  return {
    upcoming: items.filter((item) => !isPast(item)),
    past: items.filter(isPast),
  }
}

function loadEvents(): { upcomingEvents: ListedEvent[]; pastEvents: ListedEvent[]; pastYearGroups: PastYearGroup[] } {
  const events = markdownFiles('src/content/events')
    .map((filePath) => {
      const data = readFrontmatter(filePath)
      const id = path.basename(filePath).replace(/\.mdx?$/, '')
      const start = asDate(data.start, filePath, 'start')
      const allDay = data.allDay === true
      const startYear = academicYearStartYear(start, allDay)
      const event: ListedEvent = {
        id,
        title: String(data.title),
        summary: String(data.summary),
        start,
        end: optionalDate(data.end, filePath, 'end'),
        allDay,
        featured: data.featured === true,
        yearId: academicYearId(startYear),
      }
      return { event, draft: data.draft === true, startYear }
    })
    .filter((item) => !item.draft)
    .sort((a, b) => a.event.start.valueOf() - b.event.start.valueOf())

  const { upcoming, past } = splitBy(events, (item) => isListedPast(item.event, asOf))
  const pastEvents = past.map((item) => item.event).reverse()
  const groups = new Map<number, PastYearGroup>()

  for (const item of past) {
    const group = groups.get(item.startYear) ?? {
      term: academicYearLabel(item.startYear),
      yearId: academicYearId(item.startYear),
      events: [],
    }
    group.events.push(item.event)
    groups.set(item.startYear, group)
  }

  const pastYearGroups = [...groups.values()].sort((a, b) => b.yearId.localeCompare(a.yearId))

  return {
    upcomingEvents: upcoming.map((item) => item.event),
    pastEvents,
    pastYearGroups,
  }
}

function loadConferences(): { upcomingConferences: ListedConference[]; pastConferences: ListedConference[] } {
  const conferences = markdownFiles('src/content/conferences')
    .map((filePath) => {
      const data = readFrontmatter(filePath)
      return {
        draft: data.draft === true,
        title: String(data.title),
        url: String(data.url),
        start: asDate(data.start, filePath, 'start'),
        end: optionalDate(data.end, filePath, 'end'),
        allDay: true,
      }
    })
    .filter((conference) => !conference.draft)
    .sort((a, b) => a.start.valueOf() - b.start.valueOf())

  const { upcoming, past } = splitBy(conferences, (conference) => isListedPast(conference, asOf))
  const toListed = (conference: (typeof conferences)[number]): ListedConference => ({
    title: conference.title,
    url: conference.url,
  })

  return {
    upcomingConferences: upcoming.map(toListed),
    pastConferences: past.map(toListed),
  }
}

function loadOpportunities(): { openOpportunities: ListedOpportunity[]; closedOpportunities: ListedOpportunity[] } {
  const opportunities = markdownFiles('src/content/opportunities').map((filePath) => {
    const data = readFrontmatter(filePath)
    const deadline = optionalDate(data.deadline, filePath, 'deadline')
    const removeAfter = optionalDate(data.removeAfter, filePath, 'removeAfter')
    return {
      draft: data.draft === true,
      title: String(data.title),
      url: String(data.url),
      summary: String(data.summary),
      showSummary: data.showSummary === true,
      type: data.type as ListedOpportunity['type'],
      level: data.level as ListedOpportunity['level'],
      deadline,
      removeAfter,
    }
  })

  const published = opportunities.filter((opportunity) => !opportunity.draft)
  const hidden = opportunities.filter((opportunity) => opportunity.draft)
  const { upcoming, past } = splitBy(published, (opportunity) =>
    isListingClosed(opportunity.deadline, opportunity.removeAfter, asOf),
  )
  const toListed = (opportunity: (typeof opportunities)[number]): ListedOpportunity => ({
    title: opportunity.title,
    url: opportunity.url,
    summary: opportunity.summary,
    showSummary: opportunity.showSummary,
    type: opportunity.type,
    level: opportunity.level,
  })

  return {
    openOpportunities: upcoming.map(toListed),
    closedOpportunities: [...past, ...hidden].map(toListed),
  }
}

const events = loadEvents()
const conferences = loadConferences()
const opportunities = loadOpportunities()

export const upcomingEvents = events.upcomingEvents
export const pastEvents = events.pastEvents
export const pastYearGroups = events.pastYearGroups
export const upcomingConferences = conferences.upcomingConferences
export const pastConferences = conferences.pastConferences
export const openOpportunities = opportunities.openOpportunities
export const closedOpportunities = opportunities.closedOpportunities

export function homepageEvents(limit = 3): ListedEvent[] {
  const featured = upcomingEvents.filter((event) => event.featured)
  const rest = upcomingEvents.filter((event) => !event.featured)
  return [...featured, ...rest].slice(0, limit)
}

export function countLabel(count: number, singular: string, plural: string): string {
  return count === 1 ? `1 ${singular}` : `${count} ${plural}`
}

export function openOpportunitiesInSection(sectionId: string): ListedOpportunity[] {
  const section = OPPORTUNITY_SECTIONS.find((item) => item.id === sectionId)
  if (!section) {
    throw new Error(`Unknown opportunity section ${sectionId}`)
  }

  return openOpportunities.filter((opportunity) => section.includes(opportunity))
}

export { OPPORTUNITY_SECTIONS }

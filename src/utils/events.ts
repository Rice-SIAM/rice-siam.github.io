import { getCollection, type CollectionEntry } from 'astro:content'

export type EventEntry = CollectionEntry<'events'>

export type EventYearGroup = {
  term: string
  yearId: string
  events: EventEntry[]
}

const DISPLAY_TIME_ZONE = 'America/Chicago'
// Academic years run August–July so they match officer terms.
const ACADEMIC_YEAR_START_MONTH = 8

function eventEnd(event: EventEntry): Date {
  const end = event.data.end ?? event.data.start
  if (event.data.allDay) {
    return new Date(Date.UTC(end.getUTCFullYear(), end.getUTCMonth(), end.getUTCDate(), 23, 59, 59, 999))
  }
  return end
}

function chicagoDateKey(date: Date): string {
  return date.toLocaleDateString('en-CA', { timeZone: DISPLAY_TIME_ZONE })
}

function eventCalendarDate(date: Date, allDay = false): { year: number; month: number } {
  if (allDay) {
    return { year: date.getUTCFullYear(), month: date.getUTCMonth() + 1 }
  }

  const [year, month] = chicagoDateKey(date).split('-').map(Number)
  return { year, month }
}

export function academicYearStartYear(date: Date, allDay = false): number {
  const { year, month } = eventCalendarDate(date, allDay)
  return month >= ACADEMIC_YEAR_START_MONTH ? year : year - 1
}

export function academicYearLabel(startYear: number): string {
  return `${startYear}–${startYear + 1}`
}

export function isEventPast(event: EventEntry, asOf = new Date()): boolean {
  return eventEnd(event) < asOf
}

export function groupEventsByAcademicYear(events: EventEntry[]): EventYearGroup[] {
  const groups = new Map<number, EventEntry[]>()

  for (const event of events) {
    const startYear = academicYearStartYear(event.data.start, event.data.allDay)
    const list = groups.get(startYear) ?? []
    list.push(event)
    groups.set(startYear, list)
  }

  return [...groups.entries()]
    .sort((a, b) => b[0] - a[0])
    .map(([startYear, yearEvents]) => {
      const term = academicYearLabel(startYear)
      return {
        term,
        yearId: `academic-year-${startYear}-${startYear + 1}`,
        events: yearEvents,
      }
    })
}

export async function getPublishedEvents(): Promise<EventEntry[]> {
  const events = await getCollection('events', ({ data }) => !data.draft)
  return events.sort((a, b) => a.data.start.valueOf() - b.data.start.valueOf())
}

export async function getUpcomingEvents(asOf = new Date()): Promise<EventEntry[]> {
  const events = await getPublishedEvents()
  return events.filter((event) => eventEnd(event) >= asOf)
}

export async function getPastEvents(asOf = new Date()): Promise<EventEntry[]> {
  const events = await getPublishedEvents()
  return events.filter((event) => eventEnd(event) < asOf).reverse()
}

export async function getHomepageEvents(limit = 3): Promise<EventEntry[]> {
  const upcoming = await getUpcomingEvents()
  const featured = upcoming.filter((event) => event.data.featured)
  const rest = upcoming.filter((event) => !event.data.featured)
  return [...featured, ...rest].slice(0, limit)
}

export function formatEventDate(date: Date, allDay = false): string {
  if (allDay) {
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
    timeZone: DISPLAY_TIME_ZONE,
  })
}

export function formatEventParts(date: Date, allDay = false) {
  if (allDay) {
    return {
      weekday: date.toLocaleDateString('en-US', { weekday: 'short', timeZone: 'UTC' }),
      month: date.toLocaleDateString('en-US', { month: 'short', timeZone: 'UTC' }),
      day: date.toLocaleDateString('en-US', { day: 'numeric', timeZone: 'UTC' }),
      time: null,
    }
  }

  return {
    weekday: date.toLocaleDateString('en-US', { weekday: 'short', timeZone: DISPLAY_TIME_ZONE }),
    month: date.toLocaleDateString('en-US', { month: 'short', timeZone: DISPLAY_TIME_ZONE }),
    day: date.toLocaleDateString('en-US', { day: 'numeric', timeZone: DISPLAY_TIME_ZONE }),
    time: date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      timeZone: DISPLAY_TIME_ZONE,
    }),
  }
}

export function formatEventDateRange(start: Date, end?: Date, allDay = false): string {
  if (!end) {
    return formatEventDate(start, allDay)
  }

  const sameDay = allDay
    ? start.toISOString().slice(0, 10) === end.toISOString().slice(0, 10)
    : chicagoDateKey(start) === chicagoDateKey(end)

  if (sameDay) {
    if (allDay) {
      return formatEventDate(start, true)
    }

    return `${formatEventDate(start)} – ${end.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      timeZone: DISPLAY_TIME_ZONE,
    })}`
  }

  return `${formatEventDate(start, allDay)} – ${formatEventDate(end, allDay)}`
}

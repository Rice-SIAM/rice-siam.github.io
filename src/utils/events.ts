import { getCollection, type CollectionEntry } from 'astro:content'
import {
  CHICAGO_TIME_ZONE,
  academicYearId,
  academicYearLabel,
  academicYearStartYear,
  chicagoDateKey,
  listedUntil,
} from './schedule'

export type EventEntry = CollectionEntry<'events'>

export type EventYearGroup = {
  term: string
  yearId: string
  events: EventEntry[]
}

function eventEnd(event: EventEntry): Date {
  return listedUntil({
    start: event.data.start,
    end: event.data.end,
    allDay: event.data.allDay,
  })
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
        yearId: academicYearId(startYear),
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
    timeZone: CHICAGO_TIME_ZONE,
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
    weekday: date.toLocaleDateString('en-US', { weekday: 'short', timeZone: CHICAGO_TIME_ZONE }),
    month: date.toLocaleDateString('en-US', { month: 'short', timeZone: CHICAGO_TIME_ZONE }),
    day: date.toLocaleDateString('en-US', { day: 'numeric', timeZone: CHICAGO_TIME_ZONE }),
    time: date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      timeZone: CHICAGO_TIME_ZONE,
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
      timeZone: CHICAGO_TIME_ZONE,
    })}`
  }

  return `${formatEventDate(start, allDay)} – ${formatEventDate(end, allDay)}`
}

export function formatCompactDateRange(start: Date, end?: Date): string {
  const stop = end ?? start
  const startKey = start.toISOString().slice(0, 10)
  const stopKey = stop.toISOString().slice(0, 10)

  if (startKey === stopKey) {
    return start.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      timeZone: 'UTC',
    })
  }

  const sameYear = start.getUTCFullYear() === stop.getUTCFullYear()
  const sameMonth = sameYear && start.getUTCMonth() === stop.getUTCMonth()
  const month = (date: Date) => date.toLocaleDateString('en-US', { month: 'long', timeZone: 'UTC' })

  if (sameMonth) {
    return `${month(start)} ${start.getUTCDate()}–${stop.getUTCDate()}, ${start.getUTCFullYear()}`
  }

  if (sameYear) {
    return `${month(start)} ${start.getUTCDate()} – ${month(stop)} ${stop.getUTCDate()}, ${start.getUTCFullYear()}`
  }

  return `${start.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  })} – ${stop.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  })}`
}

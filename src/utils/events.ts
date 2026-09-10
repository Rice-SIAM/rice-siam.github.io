import { getCollection, type CollectionEntry } from 'astro:content'

export type EventEntry = CollectionEntry<'events'>

const DISPLAY_TIME_ZONE = 'America/Chicago'

function isDateOnly(date: Date): boolean {
  return (
    date.getUTCHours() === 0 &&
    date.getUTCMinutes() === 0 &&
    date.getUTCSeconds() === 0 &&
    date.getUTCMilliseconds() === 0
  )
}

function eventEnd(event: EventEntry): Date {
  const end = event.data.end ?? event.data.start
  if (isDateOnly(end)) {
    return new Date(Date.UTC(end.getUTCFullYear(), end.getUTCMonth(), end.getUTCDate(), 23, 59, 59, 999))
  }
  return end
}

function chicagoDateKey(date: Date): string {
  return date.toLocaleDateString('en-CA', { timeZone: DISPLAY_TIME_ZONE })
}

export async function getPublishedEvents(): Promise<EventEntry[]> {
  const events = await getCollection('events', ({ data }) => !data.draft)
  return events.sort((a, b) => a.data.start.valueOf() - b.data.start.valueOf())
}

export async function getUpcomingEvents(): Promise<EventEntry[]> {
  const now = new Date()
  const events = await getPublishedEvents()
  return events.filter((event) => eventEnd(event) >= now)
}

export async function getPastEvents(): Promise<EventEntry[]> {
  const now = new Date()
  const events = await getPublishedEvents()
  return events.filter((event) => eventEnd(event) < now).reverse()
}

export async function getHomepageEvents(limit = 3): Promise<EventEntry[]> {
  const upcoming = await getUpcomingEvents()
  const featured = upcoming.filter((event) => event.data.featured)
  const rest = upcoming.filter((event) => !event.data.featured)
  return [...featured, ...rest].slice(0, limit)
}

export function formatEventDate(date: Date): string {
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
    timeZone: DISPLAY_TIME_ZONE,
  })
}

export function formatEventParts(date: Date) {
  if (isDateOnly(date)) {
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

export function formatEventDateRange(start: Date, end?: Date): string {
  if (!end) {
    return formatEventDate(start)
  }

  const sameDay =
    isDateOnly(start) && isDateOnly(end)
      ? start.toISOString().slice(0, 10) === end.toISOString().slice(0, 10)
      : chicagoDateKey(start) === chicagoDateKey(end)

  if (sameDay) {
    if (isDateOnly(start) && isDateOnly(end)) {
      return formatEventDate(start)
    }

    return `${formatEventDate(start)} – ${end.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      timeZone: DISPLAY_TIME_ZONE,
    })}`
  }

  return `${formatEventDate(start)} – ${formatEventDate(end)}`
}

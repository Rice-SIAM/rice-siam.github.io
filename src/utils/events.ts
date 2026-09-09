import { getCollection, type CollectionEntry } from 'astro:content'

export type EventEntry = CollectionEntry<'events'>

function eventEnd(event: EventEntry): Date {
  return event.data.end ?? event.data.start
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

export function formatEventDate(date: Date): string {
  return date.toLocaleString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: date.getHours() === 0 && date.getMinutes() === 0 ? undefined : 'numeric',
    minute: date.getHours() === 0 && date.getMinutes() === 0 ? undefined : '2-digit',
    timeZone: 'America/Chicago',
  })
}

export function formatEventParts(date: Date) {
  return {
    weekday: date.toLocaleDateString('en-US', { weekday: 'short', timeZone: 'America/Chicago' }),
    month: date.toLocaleDateString('en-US', { month: 'short', timeZone: 'America/Chicago' }),
    day: date.toLocaleDateString('en-US', { day: 'numeric', timeZone: 'America/Chicago' }),
    time:
      date.getHours() === 0 && date.getMinutes() === 0
        ? null
        : date.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            timeZone: 'America/Chicago',
          }),
  }
}

export function formatEventDateRange(start: Date, end?: Date): string {
  if (!end) {
    return formatEventDate(start)
  }

  const sameDay = start.toDateString() === end.toDateString()
  if (sameDay) {
    return `${formatEventDate(start)} – ${end.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      timeZone: 'America/Chicago',
    })}`
  }

  return `${formatEventDate(start)} – ${formatEventDate(end)}`
}

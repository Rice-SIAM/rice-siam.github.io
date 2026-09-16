import type { EventEntry } from './events'
import type { SiteData } from './siteData'

export const CALENDAR_FEED_PATH = '/calendar.ics'
/** Timed events without `end` last 90 minutes in calendar files. */
export const DEFAULT_EVENT_DURATION_MINUTES = 90

const CRLF = '\r\n'
const encoder = new TextEncoder()

export type CalendarSubscribeLinks = {
  google: string
  apple: string
  outlook: string
  ics: string
}

export function eventPagePath(id: string): string {
  return `/events/${id}`
}

export function eventIcsPath(id: string): string {
  return `/calendar/${id}.ics`
}

export function eventUid(event: EventEntry, siteId: string): string {
  return `${event.id}@${siteId}`
}

export function calendarBounds(event: EventEntry): { start: Date; end: Date; allDay: boolean } {
  const start = event.data.start
  const allDay = event.data.allDay

  if (allDay) {
    const startDay = utcDateOnly(start)
    const lastDay = event.data.end && event.data.end > start ? utcDateOnly(event.data.end) : startDay
    return { start: startDay, end: addUtcDays(lastDay, 1), allDay: true }
  }

  const end =
    event.data.end && event.data.end > start ? event.data.end : addMinutes(start, DEFAULT_EVENT_DURATION_MINUTES)
  return { start, end, allDay: false }
}

export function googleEventUrl(event: EventEntry, origin: URL): string {
  const { start, end, allDay } = calendarBounds(event)
  const pageUrl = new URL(eventPagePath(event.id), origin).href
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: event.data.title,
    dates: `${formatGoogleDate(start, allDay)}/${formatGoogleDate(end, allDay)}`,
    details: [event.data.summary, pageUrl].filter(Boolean).join('\n'),
  })
  if (event.data.location) {
    params.set('location', event.data.location)
  }
  return `https://calendar.google.com/calendar/render?${params.toString()}`
}

export function getCalendarSubscribeLinks(origin: URL, calendarName: string): CalendarSubscribeLinks {
  const httpsUrl = new URL(CALENDAR_FEED_PATH, origin).href
  const webcalUrl = httpsUrl.replace(/^https:/, 'webcal:')
  return {
    google: `https://calendar.google.com/calendar/r?cid=${encodeURIComponent(webcalUrl)}`,
    apple: webcalUrl,
    outlook: `https://outlook.office.com/calendar/0/addfromweb?url=${encodeURIComponent(httpsUrl)}&name=${encodeURIComponent(calendarName)}`,
    ics: CALENDAR_FEED_PATH,
  }
}

export function buildEventIcs(event: EventEntry, origin: URL, site: SiteData): string {
  return serializeCalendar([icsEventLines(event, origin, site)], site)
}

export function buildCalendarIcs(events: EventEntry[], origin: URL, site: SiteData): string {
  return serializeCalendar(
    events.flatMap((event) => icsEventLines(event, origin, site)),
    site,
  )
}

export function icsResponse(body: string, filename: string): Response {
  return new Response(body, {
    headers: {
      'Content-Type': 'text/calendar; charset=utf-8',
      'Content-Disposition': `inline; filename="${filename}"`,
    },
  })
}

function serializeCalendar(eventLines: string[], site: SiteData): string {
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Rice SIAM//Chapter Calendar//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    `X-WR-CALNAME:${escapeText(site.shortName)}`,
    `X-WR-CALDESC:${escapeText(`Upcoming events of the ${site.name}.`)}`,
    'X-WR-TIMEZONE:America/Chicago',
    'X-PUBLISHED-TTL:PT12H',
    ...eventLines,
    'END:VCALENDAR',
  ]
  return `${lines.map(foldIcsLine).join(CRLF)}${CRLF}`
}

function icsEventLines(event: EventEntry, origin: URL, site: SiteData): string[] {
  const { start, end, allDay } = calendarBounds(event)
  const pageUrl = new URL(eventPagePath(event.id), origin).href
  const stamp = event.data.end && event.data.end > event.data.start ? event.data.end : event.data.start
  const lines = [
    'BEGIN:VEVENT',
    `UID:${eventUid(event, site.id)}`,
    `DTSTAMP:${formatUtcStamp(stamp)}`,
    allDay ? `DTSTART;VALUE=DATE:${formatDateOnly(start)}` : `DTSTART:${formatUtcStamp(start)}`,
    allDay ? `DTEND;VALUE=DATE:${formatDateOnly(end)}` : `DTEND:${formatUtcStamp(end)}`,
    `SUMMARY:${escapeText(event.data.title)}`,
    `DESCRIPTION:${escapeText([event.data.summary, pageUrl].filter(Boolean).join('\n'))}`,
    `URL:${pageUrl}`,
    'STATUS:CONFIRMED',
    'TRANSP:OPAQUE',
  ]
  if (event.data.location) {
    lines.push(`LOCATION:${escapeText(event.data.location)}`)
  }
  lines.push('END:VEVENT')
  return lines
}

function utcDateOnly(date: Date): Date {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()))
}

function addUtcDays(date: Date, days: number): Date {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate() + days))
}

function addMinutes(date: Date, minutes: number): Date {
  return new Date(date.getTime() + minutes * 60_000)
}

function formatUtcStamp(date: Date): string {
  return date
    .toISOString()
    .replace(/[-:]/g, '')
    .replace(/\.\d{3}/, '')
}

function formatDateOnly(date: Date): string {
  return date.toISOString().slice(0, 10).replaceAll('-', '')
}

function formatGoogleDate(date: Date, allDay: boolean): string {
  return allDay ? formatDateOnly(date) : formatUtcStamp(date)
}

function escapeText(value: string): string {
  return value
    .replaceAll('\\', '\\\\')
    .replaceAll(';', '\\;')
    .replaceAll(',', '\\,')
    .replaceAll(/\r\n|\n|\r/g, '\\n')
}

function foldIcsLine(line: string): string {
  const chunks: string[] = []
  let rest = line
  let limit = 75
  while (encoder.encode(rest).length > limit) {
    let take = Math.min(rest.length, limit)
    while (take > 1 && encoder.encode(rest.slice(0, take)).length > limit) {
      take -= 1
    }
    chunks.push(rest.slice(0, take))
    rest = rest.slice(take)
    limit = 74
  }
  chunks.push(rest)
  return chunks.map((chunk, index) => (index === 0 ? chunk : ` ${chunk}`)).join(CRLF)
}

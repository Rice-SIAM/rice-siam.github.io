import { getCollection, type CollectionEntry } from 'astro:content'
import { formatEventDateRange } from './events'
import { listedUntil } from './schedule'

export type ConferenceEntry = CollectionEntry<'conferences'>

function conferenceEnd(conference: ConferenceEntry): Date {
  return listedUntil({
    start: conference.data.start,
    end: conference.data.end,
    allDay: true,
  })
}

export function conferenceWhenWhere(conference: ConferenceEntry): string {
  const when = formatEventDateRange(conference.data.start, conference.data.end, true)
  return conference.data.location ? `${when} · ${conference.data.location}` : when
}

export async function getUpcomingConferences(asOf = new Date()): Promise<ConferenceEntry[]> {
  const conferences = await getCollection('conferences', ({ data }) => !data.draft)
  return conferences
    .filter((conference) => conferenceEnd(conference) >= asOf)
    .sort((a, b) => a.data.start.valueOf() - b.data.start.valueOf())
}

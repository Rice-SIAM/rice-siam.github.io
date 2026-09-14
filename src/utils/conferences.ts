import { getCollection, type CollectionEntry } from 'astro:content'
import { formatEventDateRange } from './events'

export type ConferenceEntry = CollectionEntry<'conferences'>

function conferenceEnd(conference: ConferenceEntry): Date {
  const end = conference.data.end ?? conference.data.start
  return new Date(Date.UTC(end.getUTCFullYear(), end.getUTCMonth(), end.getUTCDate(), 23, 59, 59, 999))
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

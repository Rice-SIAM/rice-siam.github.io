import type { APIRoute } from 'astro'
import { buildEventIcs, icsResponse } from '@utils/calendar'
import { getUpcomingEvents, type EventEntry } from '@utils/events'
import { getSite } from '@utils/siteData'

export async function getStaticPaths() {
  const events = await getUpcomingEvents()
  return events.map((event) => ({
    params: { id: event.id },
    props: { event },
  }))
}

export const GET: APIRoute<{ event: EventEntry }> = ({ props, site }) => {
  const origin = site ?? new URL('https://siam.rice.edu')
  return icsResponse(buildEventIcs(props.event, origin, getSite()), `${props.event.id}.ics`)
}

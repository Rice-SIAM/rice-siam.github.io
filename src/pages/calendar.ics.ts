import type { APIRoute } from 'astro'
import { buildCalendarIcs, icsResponse } from '@utils/calendar'
import { getUpcomingEvents } from '@utils/events'
import { getSite } from '@utils/siteData'

export const GET: APIRoute = async ({ site }) => {
  const origin = site ?? new URL('https://siam.rice.edu')
  const body = buildCalendarIcs(await getUpcomingEvents(), origin, getSite())
  return icsResponse(body, 'rice-siam.ics')
}

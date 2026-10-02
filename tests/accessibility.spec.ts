import { test, expect, type Page } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'
import {
  OPPORTUNITY_SECTIONS,
  closedOpportunities,
  countLabel,
  homepageEvents,
  openOpportunities,
  openOpportunitiesInSection,
  pastConferences,
  pastEvents,
  pastYearGroups,
  upcomingConferences,
  upcomingEvents,
  type ListedEvent,
} from './listed-content.ts'

const pages = [
  '/',
  '/about',
  '/events',
  '/conferences',
  '/opportunities',
  '/leadership',
  '/get-involved',
  '/contact',
  '/accessibility-statement',
  '/newsletter',
  '/newsletter/email',
  '/events/2022-03-25-tapia-art-of-giving-great-talks',
]

const currentEvent = upcomingEvents[0]
if (currentEvent) {
  pages.push(`/events/${currentEvent.id}`, `/events/${currentEvent.id}/flyer`)
}

test.describe('axe', () => {
  for (const path of pages) {
    test(`${path} has no critical or serious violations`, async ({ page }) => {
      await page.goto(path)
      const results = await new AxeBuilder({ page }).analyze()
      const serious = results.violations.filter(
        (violation) => violation.impact === 'critical' || violation.impact === 'serious',
      )
      expect(serious, JSON.stringify(serious, null, 2)).toEqual([])
    })
  }
})

test('internal links on representative pages resolve', async ({ page, request }) => {
  const hrefs = new Set<string>()

  for (const path of pages) {
    await page.goto(path)
    const links = await page
      .locator('a[href]')
      .evaluateAll((anchors) =>
        anchors.map((anchor) => anchor.getAttribute('href')).filter((href): href is string => Boolean(href)),
      )
    for (const href of links) {
      hrefs.add(href)
    }
  }

  for (const href of hrefs) {
    if (!href.startsWith('/') || href.startsWith('//')) continue
    const path = href.split('#')[0]
    if (!path) continue
    const response = await request.get(path)
    expect(response.status(), path).toBeLessThan(400)
  }
})

test('footer affiliation marks link to Rice and SIAM', async ({ page }) => {
  await page.goto('/')
  const rice = page.locator('footer a[href="https://www.rice.edu"]')
  const siam = page.locator('footer a[href="https://www.siam.org"]')
  await expect(rice).toHaveCount(1)
  await expect(siam).toHaveCount(1)
})

test('public pages do not link to the GitHub repository', async ({ page }) => {
  for (const path of pages) {
    await page.goto(path)
    await expect(page.locator('a[href*="github.com/Rice-SIAM"]')).toHaveCount(0)
  }
})

test('starter demo routes are absent', async ({ request }) => {
  for (const path of ['/blog', '/portfolio', '/components']) {
    const response = await request.get(path)
    expect(response.status(), path).toBe(404)
  }
})

test('newsletter flyer uses official Rice and SIAM marks', async ({ page }) => {
  await page.goto('/newsletter')
  await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1)
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Newsletter')
  await expect(page.getByRole('heading', { level: 2, name: 'Internships' })).toBeVisible()
  await expect(page.getByRole('heading', { level: 2, name: 'Jobs' })).toBeVisible()
  await expect(page.getByRole('heading', { level: 2, name: 'Fellowships' })).toBeVisible()
  await expect(page.getByRole('heading', { level: 2, name: 'Conferences and workshops' })).toBeVisible()
  await expect(page.getByRole('heading', { level: 2, name: 'Keep up with us' })).toHaveCount(0)
  await expect(page.locator('.flyer-brand')).toHaveText('SIAM Student Chapter')
  await expect(page.locator('a[href="https://www.rice.edu"]')).toHaveCount(1)
  await expect(page.locator('a[href="https://www.siam.org"]')).toHaveCount(1)
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/)
})

test('printable flyers exist only for upcoming events', async ({ request }) => {
  for (const event of pastEvents) {
    const path = `/events/${event.id}/flyer`
    const response = await request.get(path)
    expect(response.status(), path).toBe(404)
  }

  for (const event of upcomingEvents) {
    const path = `/events/${event.id}/flyer`
    const response = await request.get(path)
    expect(response.status(), path).toBe(200)
  }
})

test('newsletter email page includes a plain-text body', async ({ page }) => {
  await page.goto('/newsletter/email')
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Rice SIAM')
  await expect(page.locator('.email-greeting')).toHaveText('Hi, Rice SIAM.')
  await expect(page.locator('pre')).not.toContainText('Events for the semester')
  await expect(page.locator('pre')).toContainText('Internships')
  await expect(page.locator('pre')).toContainText('Jobs')
  await expect(page.locator('pre')).toContainText('Fellowships')
  await expect(page.locator('pre')).toContainText('NSF Graduate Research Fellowship Program')
  await expect(page.locator('pre')).toContainText('MGB-SIAM Early Career Fellowship')
  await expect(page.locator('pre')).not.toContainText('RTG NASC Annual Workshop')
  await expect(page.locator('pre')).toContainText('SIAM Texas')
  await expect(page.locator('pre')).not.toContainText('Keep up with us')
})

test('leadership lists current officers and past slates by year', async ({ page }) => {
  await page.goto('/leadership')
  await expect(page.getByRole('heading', { level: 1, name: 'Leadership' })).toBeVisible()
  await expect(page.getByRole('heading', { level: 2, name: 'Current officers' })).toBeVisible()
  await expect(page.getByRole('heading', { level: 2, name: 'Past officers' })).toBeVisible()
  const contents = page.getByRole('navigation', { name: 'On this page' })
  await expect(contents.getByRole('link', { name: 'Current officers' })).toHaveAttribute('href', '#current-officers')
  await expect(contents.getByRole('link', { name: 'Past officers', exact: true })).toHaveAttribute(
    'href',
    '#past-officers',
  )
  await expect(contents.getByRole('link', { name: /2025.2026/ })).toHaveAttribute('href', '#officer-term-2025-2026')
  await expect(page.getByRole('heading', { level: 3, name: /2025.2026/ })).toBeVisible()
  await expect(page.getByText('John Steinman')).toHaveCount(2)
  await expect(page.getByText('Logan Smith')).toBeVisible()
})

test('events page groups past events by academic year', async ({ page }) => {
  await page.goto('/events')
  await expect(page.getByRole('heading', { level: 1, name: 'Events' })).toBeVisible()
  await expect(page.getByRole('heading', { level: 2, name: 'Upcoming' })).toBeVisible()

  const emptyUpcoming = page.getByText('No upcoming events are listed.')
  if (upcomingEvents.length === 0) {
    await expect(emptyUpcoming).toBeVisible()
  } else {
    await expect(emptyUpcoming).toHaveCount(0)
  }

  for (const event of upcomingEvents) {
    await expect(page.locator(`#upcoming a[href="/events/${event.id}"]`)).toBeVisible()
    await expect(page.locator('#upcoming')).toContainText(event.summary)
    await expect(page.locator(`#past-events a[href="/events/${event.id}"]`)).toHaveCount(0)
  }

  if (pastEvents.length === 0) {
    await expect(page.getByRole('heading', { level: 2, name: 'Past events' })).toHaveCount(0)
  } else {
    await expect(page.getByRole('heading', { level: 2, name: 'Past events' })).toBeVisible()
  }

  for (const event of pastEvents) {
    const year = page.locator('li.event-history-year').filter({ has: page.locator(`#${event.yearId}`) })
    await expect(year.locator(`a[href="/events/${event.id}"]`)).toBeVisible()
    await expect(page.locator(`#upcoming a[href="/events/${event.id}"]`)).toHaveCount(0)
    await expect(year).not.toContainText(event.summary)
  }

  await expect(page.getByRole('heading', { level: 3, name: 'Chapter calendar' })).toBeVisible()
  await expect(page.getByRole('link', { name: 'Add Rice SIAM events to Google Calendar' })).toBeVisible()
  await expect(page.getByRole('link', { name: 'Add Rice SIAM events to Apple Calendar' })).toBeVisible()
  await expect(page.getByRole('link', { name: 'Add Rice SIAM events to Outlook' })).toBeVisible()
  await expect(page.getByRole('link', { name: 'Rice SIAM calendar file' })).toHaveAttribute('href', '/calendar.ics')
  await expect(page.locator('link[rel="alternate"][type="text/calendar"]')).toHaveAttribute('href', '/calendar.ics')

  const contents = page.getByRole('navigation', { name: 'On this page' })
  await expect(
    contents.getByRole('link', {
      name: `Upcoming (${countLabel(upcomingEvents.length, 'event', 'events')})`,
      exact: true,
    }),
  ).toHaveAttribute('href', '#upcoming')
  await expect(contents.getByRole('link', { name: 'Chapter calendar' })).toHaveAttribute('href', '#calendar')

  if (pastYearGroups.length > 0) {
    await expect(contents.getByRole('link', { name: 'Past events', exact: true })).toHaveAttribute(
      'href',
      '#past-events',
    )
  }

  for (const group of pastYearGroups) {
    await expect(
      contents.getByRole('link', {
        name: `${group.term} (${countLabel(group.events.length, 'event', 'events')})`,
        exact: true,
      }),
    ).toHaveAttribute('href', `#${group.yearId}`)
    await expect(page.getByRole('heading', { level: 3, name: group.term, exact: true })).toBeVisible()
  }
})

test('homepage lists the current upcoming events', async ({ page }) => {
  await page.goto('/')
  const section = page.locator('section').filter({ has: page.getByRole('heading', { name: 'Upcoming events' }) })
  const shown = homepageEvents()

  if (shown.length === 0) {
    await expect(section.getByText('No upcoming events are listed.')).toBeVisible()
  }

  for (const event of shown) {
    await expect(section.locator(`a[href="/events/${event.id}"]`)).toBeVisible()
  }

  for (const event of upcomingEvents.filter((event) => !shown.some((item) => item.id === event.id))) {
    await expect(section.locator(`a[href="/events/${event.id}"]`)).toHaveCount(0)
  }

  for (const event of pastEvents) {
    await expect(section.locator(`a[href="/events/${event.id}"]`)).toHaveCount(0)
  }
})

test('opportunities page lists open listings by section', async ({ page }) => {
  await page.goto('/opportunities')
  await expect(page.getByRole('heading', { level: 1, name: 'Opportunities' })).toBeVisible()
  await expect(page.getByRole('link', { name: 'Other places to look' })).toBeVisible()

  if (openOpportunities.length === 0) {
    await expect(page.getByText('No opportunities are listed.')).toBeVisible()
    return
  }

  await expect(page.getByText('No opportunities are listed.')).toHaveCount(0)
  const contents = page.getByRole('navigation', { name: 'On this page' })
  await expect(contents.getByRole('link', { name: 'Other places to look' })).toHaveAttribute(
    'href',
    '#other-places-to-look',
  )

  for (const section of OPPORTUNITY_SECTIONS) {
    const listed = openOpportunitiesInSection(section.id)
    const heading = page.getByRole('heading', { level: 2, name: section.title, exact: true })
    if (listed.length === 0) {
      await expect(heading).toHaveCount(0)
      continue
    }

    await expect(heading).toBeVisible()
    await expect(
      contents.getByRole('link', {
        name: `${section.title} (${countLabel(listed.length, 'listing', 'listings')})`,
        exact: true,
      }),
    ).toHaveAttribute('href', `#${section.id}`)
  }

  for (const opportunity of openOpportunities) {
    await expect(page.locator(`a[href="${opportunity.url}"]`)).toBeVisible()
    if (opportunity.showSummary) {
      await expect(page.getByText(opportunity.summary)).toBeVisible()
    } else {
      await expect(page.getByText(opportunity.summary)).toHaveCount(0)
    }
  }

  for (const opportunity of closedOpportunities) {
    await expect(page.locator(`a[href="${opportunity.url}"]`)).toHaveCount(0)
  }
})

test('conferences page lists meetings that have not ended', async ({ page }) => {
  await page.goto('/conferences')
  await expect(page.getByRole('heading', { level: 1, name: 'Conferences' })).toBeVisible()
  await expect(page.getByRole('heading', { level: 2, name: 'Upcoming' })).toBeVisible()

  if (upcomingConferences.length === 0) {
    await expect(page.getByText('No upcoming conferences are listed.')).toBeVisible()
  } else {
    await expect(page.getByText('No upcoming conferences are listed.')).toHaveCount(0)
  }

  for (const conference of upcomingConferences) {
    await expect(page.locator(`a[href="${conference.url}"]`)).toBeVisible()
  }

  for (const conference of pastConferences) {
    await expect(page.locator(`a[href="${conference.url}"]`)).toHaveCount(0)
  }
})

test('past event detail page keeps historical facts', async ({ page }) => {
  await page.goto('/events/2022-03-25-tapia-art-of-giving-great-talks')
  await expect(page.getByRole('heading', { level: 1, name: 'The Art of Giving Great Talks' })).toBeVisible()
  await expect(
    page.getByRole('navigation', { name: 'Breadcrumbs' }).getByText('The Art of Giving Great Talks'),
  ).toBeVisible()
  await expect(page.getByText('2022 03 25 Tapia')).toHaveCount(0)
  await expect(page.getByText('Speaker: University Professor Richard Tapia')).toBeVisible()
  await expect(page.getByText('Registration details')).toHaveCount(0)
  await expect(page.getByText('Add The Art of Giving Great Talks to Google Calendar')).toHaveCount(0)
  await expect(page.getByText('Download The Art of Giving Great Talks calendar file')).toHaveCount(0)
  await expect(page.getByText('Printable flyer')).toHaveCount(0)
})

async function expectCalendarActions(page: Page, event: ListedEvent, visible: boolean) {
  await page.goto(`/events/${event.id}`)
  await expect(page.getByRole('heading', { level: 1, name: event.title })).toBeVisible()
  const links = [
    page.getByRole('link', { name: `Add ${event.title} to Google Calendar` }),
    page.getByRole('link', { name: `Download ${event.title} calendar file` }),
    page.getByRole('link', { name: 'Printable flyer' }),
  ]
  for (const link of links) {
    await expect(link).toHaveCount(visible ? 1 : 0)
  }
}

test('chapter calendar lists upcoming events only', async ({ page, request }) => {
  if (upcomingEvents[0]) {
    await expectCalendarActions(page, upcomingEvents[0], true)
  }
  if (pastEvents[0]) {
    await expectCalendarActions(page, pastEvents[0], false)
  }

  const feed = await request.get('/calendar.ics')
  expect(feed.status()).toBe(200)
  expect(feed.headers()['content-type']).toMatch(/text\/calendar/)
  const body = await feed.text()
  expect(body).toContain('BEGIN:VCALENDAR')
  expect(body).toContain('X-WR-CALNAME:Rice SIAM')
  expect(body.includes('BEGIN:VEVENT')).toBe(upcomingEvents.length > 0)

  for (const event of upcomingEvents) {
    expect(body).toContain(`UID:${event.id}@rice-siam`)
    const eventIcs = await request.get(`/calendar/${event.id}.ics`)
    expect(eventIcs.status(), event.id).toBe(200)
  }

  for (const event of pastEvents) {
    expect(body).not.toContain(`UID:${event.id}@rice-siam`)
    const eventIcs = await request.get(`/calendar/${event.id}.ics`)
    expect(eventIcs.status(), event.id).toBe(404)
  }
})

test('legacy join URL reaches get involved', async ({ page }) => {
  await page.goto('/join')
  await expect(page).toHaveURL(/\/get-involved\/?$/)
  await expect(page.getByRole('heading', { level: 1, name: 'Get involved' })).toBeVisible()
})

test('wide header keeps the Rice mark and links on one row', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 720 })
  await page.goto('/')
  await expect(page.locator('.desktop-menu')).toBeVisible()
  await expect(page.locator('.responsive-toggle')).toBeHidden()

  const logoBox = await page.locator('.site-identity').boundingBox()
  const navBox = await page.locator('.desktop-menu').boundingBox()
  expect(logoBox).toBeTruthy()
  expect(navBox).toBeTruthy()
  expect(Math.abs(logoBox!.y - navBox!.y)).toBeLessThan(12)
  expect(navBox!.x).toBeGreaterThan(logoBox!.x + logoBox!.width - 1)

  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  )
  expect(overflow).toBeLessThanOrEqual(1)
})

test('narrow header uses the menu button', async ({ page }) => {
  await page.setViewportSize({ width: 1100, height: 720 })
  await page.goto('/')
  await expect(page.locator('.responsive-toggle')).toBeVisible()
  await expect(page.locator('.desktop-menu')).toBeHidden()
})

test('phone header keeps the Rice mark and menu on one row', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 })
  await page.goto('/')
  await expect(page.locator('.responsive-toggle')).toBeVisible()
  await expect(page.locator('.desktop-menu')).toBeHidden()

  const logoBox = await page.locator('.site-identity').boundingBox()
  const toggleBox = await page.locator('.responsive-toggle').boundingBox()
  expect(logoBox).toBeTruthy()
  expect(toggleBox).toBeTruthy()
  expect(Math.abs(logoBox!.y - toggleBox!.y)).toBeLessThan(24)
  expect(toggleBox!.x).toBeGreaterThan(logoBox!.x + logoBox!.width - 8)

  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  )
  expect(overflow).toBeLessThanOrEqual(1)
})

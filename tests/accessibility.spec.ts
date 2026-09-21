import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

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
  '/events/2026-09-17-siam-pub-night',
  '/events/2026-10-01-siam-game-night',
  '/events/2026-10-01-siam-game-night/flyer',
]

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

test('past events do not keep printable flyers', async ({ request }) => {
  const response = await request.get('/events/2026-09-17-siam-pub-night/flyer')
  expect(response.status()).toBe(404)
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
  await expect(page.getByText('No upcoming events are listed.')).toHaveCount(0)
  await expect(page.locator('#upcoming a[href="/events/2026-10-01-siam-game-night"]')).toBeVisible()
  await expect(page.locator('#upcoming')).toContainText('Thursday, October 1, 2026')
  await expect(page.locator('#upcoming')).toContainText('Game night with pizza and cookies.')
  await expect(page.locator('a[href="/events/2026-09-17-siam-pub-night"]')).toBeVisible()
  await expect(page.getByRole('heading', { level: 3, name: 'Chapter calendar' })).toBeVisible()
  await expect(page.getByRole('link', { name: 'Add Rice SIAM events to Google Calendar' })).toBeVisible()
  await expect(page.getByRole('link', { name: 'Add Rice SIAM events to Apple Calendar' })).toBeVisible()
  await expect(page.getByRole('link', { name: 'Add Rice SIAM events to Outlook' })).toBeVisible()
  await expect(page.getByRole('link', { name: 'Rice SIAM calendar file' })).toHaveAttribute('href', '/calendar.ics')
  await expect(page.locator('link[rel="alternate"][type="text/calendar"]')).toHaveAttribute('href', '/calendar.ics')
  await expect(page.getByRole('heading', { level: 2, name: 'Past events' })).toBeVisible()
  const contents = page.getByRole('navigation', { name: 'On this page' })
  await expect(contents.getByRole('link', { name: /Upcoming \(\d+ events?\)/ })).toHaveAttribute('href', '#upcoming')
  await expect(contents.getByRole('link', { name: 'Chapter calendar' })).toHaveAttribute('href', '#calendar')
  await expect(contents.getByRole('link', { name: 'Past events', exact: true })).toHaveAttribute('href', '#past-events')
  await expect(contents.getByRole('link', { name: /2026.2027 \(\d+ events?\)/ })).toHaveAttribute(
    'href',
    '#academic-year-2026-2027',
  )
  await expect(contents.getByRole('link', { name: /2024.2025 \(\d+ events?\)/ })).toHaveAttribute(
    'href',
    '#academic-year-2024-2025',
  )
  await expect(page.getByRole('heading', { level: 3, name: /2026.2027/ })).toBeVisible()
  await expect(page.getByRole('heading', { level: 3, name: /2024.2025/ })).toBeVisible()
  await expect(page.getByRole('heading', { level: 3, name: /2021.2022/ })).toBeVisible()
  await expect(page.getByRole('heading', { level: 3, name: /2020.2021/ })).toBeVisible()
  await expect(page.locator('a[href="/events/2025-01-23-siam-pub-night"]')).toBeVisible()
  await expect(page.getByText('Valhalla, under Keck Hall').first()).toBeVisible()
  await expect(page.locator('a[href="/events/2022-03-25-tapia-art-of-giving-great-talks"]')).toBeVisible()
  await expect(page.getByText('University Professor Richard Tapia on what makes a strong research talk')).toHaveCount(0)
})

test('opportunities page uses section jumps and compact listings', async ({ page }) => {
  await page.goto('/opportunities')
  const contents = page.getByRole('navigation', { name: 'On this page' })
  await expect(contents).toBeVisible()
  await expect(contents.getByRole('link', { name: /Graduate internships \(\d+ listings?\)/ })).toHaveAttribute(
    'href',
    '#graduate-internships',
  )
  await expect(contents.getByRole('link', { name: 'Other places to look' })).toHaveAttribute(
    'href',
    '#other-places-to-look',
  )
  await expect(page.getByRole('heading', { level: 2, name: 'Graduate internships', exact: true })).toBeVisible()
  await expect(page.getByText('No opportunities are listed.')).toHaveCount(0)
  await expect(page.getByText('Practical research with Computing staff')).toHaveCount(0)
  await expect(page.getByRole('link', { name: /Computing undergraduate intern/ })).toBeVisible()
})

test('conferences page lists upcoming meetings', async ({ page }) => {
  await page.goto('/conferences')
  await expect(page.getByRole('heading', { level: 1, name: 'Conferences' })).toBeVisible()
  await expect(page.getByRole('heading', { level: 2, name: 'Upcoming' })).toBeVisible()
  await expect(page.getByRole('link', { name: 'RTG NASC Annual Workshop' })).toBeVisible()
  await expect(page.getByRole('link', { name: 'SIAM Texas–Louisiana Sectional Meeting' })).toBeVisible()
  await expect(page.getByRole('link', { name: 'SIAM Conference on Mathematics of Data Science' })).toBeVisible()
  await expect(page.getByRole('link', { name: 'INFORMS Annual Meeting' })).toBeVisible()
  await expect(page.getByRole('link', { name: 'Joint Mathematics Meetings' })).toBeVisible()
  await expect(
    page.getByRole('link', { name: 'International Congress on Industrial and Applied Mathematics' }),
  ).toBeVisible()
  await expect(page.getByText('If you would like to attend and present, contact the RTG PIs.')).toBeVisible()
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

test('chapter calendar lists upcoming events only', async ({ page, request }) => {
  await page.goto('/events/2026-09-17-siam-pub-night')
  await expect(page.getByRole('heading', { level: 1, name: 'SIAM Pub Night' })).toBeVisible()
  await expect(page.getByText('Add SIAM Pub Night to Google Calendar')).toHaveCount(0)
  await expect(page.getByText('Download SIAM Pub Night calendar file')).toHaveCount(0)
  await expect(page.getByText('Printable flyer')).toHaveCount(0)

  const feed = await request.get('/calendar.ics')
  expect(feed.status()).toBe(200)
  expect(feed.headers()['content-type']).toMatch(/text\/calendar/)
  const body = await feed.text()
  expect(body).toContain('BEGIN:VCALENDAR')
  expect(body).toContain('X-WR-CALNAME:Rice SIAM')
  expect(body).not.toContain('BEGIN:VEVENT\r\nUID:2026-09-17-siam-pub-night@rice-siam')
  expect(body).not.toContain('SUMMARY:SIAM Pub Night')
  expect(body).not.toContain('The Art of Giving Great Talks')
  expect(body).toContain('UID:2026-10-01-siam-game-night@rice-siam')
  expect(body).toContain('SUMMARY:SIAM Game Night')
  expect(body).toContain('DTSTART;VALUE=DATE:20261001')
  expect(body).toContain('Game night with pizza and cookies.')
  expect(body).not.toContain('LOCATION:')

  const eventIcs = await request.get('/calendar/2026-09-17-siam-pub-night.ics')
  expect(eventIcs.status()).toBe(404)

  const gameNightIcs = await request.get('/calendar/2026-10-01-siam-game-night.ics')
  expect(gameNightIcs.status()).toBe(200)

  const pastIcs = await request.get('/calendar/2022-03-25-tapia-art-of-giving-great-talks.ics')
  expect(pastIcs.status()).toBe(404)
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

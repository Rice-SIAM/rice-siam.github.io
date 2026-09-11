import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

const pages = [
  '/',
  '/about',
  '/events',
  '/opportunities',
  '/leadership',
  '/get-involved',
  '/contact',
  '/accessibility-statement',
  '/newsletter',
  '/newsletter/email',
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
  await expect(page.locator('.flyer-brand')).toHaveText('Rice SIAM')
  await expect(page.locator('a[href="https://www.rice.edu"]')).toHaveCount(1)
  await expect(page.locator('a[href="https://www.siam.org"]')).toHaveCount(1)
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/)
})

test('newsletter email page includes a plain-text body', async ({ page }) => {
  await page.goto('/newsletter/email')
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Rice SIAM')
  await expect(page.locator('pre')).toContainText('Rice SIAM')
})

test('leadership lists current officers and past slates by year', async ({ page }) => {
  await page.goto('/leadership')
  await expect(page.getByRole('heading', { level: 1, name: 'Leadership' })).toBeVisible()
  await expect(page.getByRole('heading', { level: 2, name: 'Current officers' })).toBeVisible()
  await expect(page.getByRole('heading', { level: 2, name: 'Past officers' })).toBeVisible()
  await expect(page.getByRole('heading', { level: 3, name: /2025.2026/ })).toBeVisible()
  await expect(page.getByText('John Steinman')).toHaveCount(2)
  await expect(page.getByText('Logan Smith')).toBeVisible()
})

test('events page groups past events by academic year', async ({ page }) => {
  await page.goto('/events')
  await expect(page.getByRole('heading', { level: 1, name: 'Events' })).toBeVisible()
  await expect(page.getByRole('heading', { level: 2, name: 'Upcoming' })).toBeVisible()
  await expect(page.getByRole('heading', { level: 2, name: 'Past events' })).toBeVisible()
  await expect(page.getByRole('heading', { level: 3, name: /2024.2025/ })).toBeVisible()
  await expect(page.getByRole('heading', { level: 3, name: /2021.2022/ })).toBeVisible()
  await expect(page.getByRole('heading', { level: 3, name: /2020.2021/ })).toBeVisible()
  await expect(page.locator('a[href="/events/2025-01-23-siam-pub-night"]')).toBeVisible()
  await expect(page.locator('a[href="/events/2022-03-25-tapia-art-of-giving-great-talks"]')).toBeVisible()
})

test('past event detail page keeps historical facts', async ({ page }) => {
  await page.goto('/events/2022-03-25-tapia-art-of-giving-great-talks')
  await expect(page.getByRole('heading', { level: 1, name: 'The Art of Giving Great Talks' })).toBeVisible()
  await expect(page.getByText('Speaker: University Professor Richard Tapia')).toBeVisible()
  await expect(page.getByText('Registration details')).toHaveCount(0)
  await expect(page.getByText('Add to calendar')).toHaveCount(0)
})

test('legacy join URL reaches get involved', async ({ page }) => {
  await page.goto('/join')
  await expect(page).toHaveURL(/\/get-involved\/?$/)
  await expect(page.getByRole('heading', { level: 1, name: 'Get involved' })).toBeVisible()
})

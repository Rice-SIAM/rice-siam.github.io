import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

const pages = ['/', '/about', '/events', '/leadership', '/join', '/contact', '/accessibility-statement']

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
    const links = await page.locator('a[href]').evaluateAll((anchors) =>
      anchors
        .map((anchor) => anchor.getAttribute('href'))
        .filter((href): href is string => Boolean(href)),
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

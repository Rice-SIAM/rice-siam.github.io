/**
 * Print a flyer page to out/. Default is /newsletter.
 * Override the page with FLYER_PATH (for example /events/2026-09-17-siam-pub-night/flyer)
 * and the filename with FLYER_OUT. Override the port with NEWSLETTER_PDF_PORT.
 *
 * Serves dist/ on a dedicated port so a running `astro preview` is not reused
 * or replaced. Do not use the browser Print dialog; it drops layout.
 */
import { createServer } from 'node:http'
import { existsSync } from 'node:fs'
import { mkdir, readFile, stat } from 'node:fs/promises'
import path from 'node:path'
import { chromium } from '@playwright/test'
import { parse } from 'yaml'

const root = process.cwd()
const dist = path.join(root, 'dist')
const previewPort = Number(process.env.NEWSLETTER_PDF_PORT ?? 4371)
const previewUrl = `http://127.0.0.1:${previewPort}`
const flyerPath = process.env.FLYER_PATH ?? '/newsletter'
const flyerUrl = `${previewUrl}${flyerPath.startsWith('/') ? flyerPath : `/${flyerPath}`}`

const MIME = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.ico': 'image/x-icon',
  '.jpeg': 'image/jpeg',
  '.jpg': 'image/jpeg',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json',
  '.mjs': 'text/javascript; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.ttf': 'font/ttf',
  '.webp': 'image/webp',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
}

function contentType(filePath) {
  return MIME[path.extname(filePath).toLowerCase()] ?? 'application/octet-stream'
}

async function resolveFile(urlPath) {
  const relative = path
    .normalize(urlPath)
    .replace(/^([/\\])+/, '')
    .replace(/^(\.\.([/\\]|$))+/, '')
  const candidates = [
    path.join(dist, relative),
    path.join(dist, relative, 'index.html'),
    path.join(dist, `${relative}.html`),
  ]
  const distRoot = path.resolve(dist)

  for (const candidate of candidates) {
    const resolved = path.resolve(candidate)
    if (resolved !== distRoot && !resolved.startsWith(`${distRoot}${path.sep}`)) {
      continue
    }

    try {
      const info = await stat(resolved)
      if (info.isFile()) {
        return resolved
      }
    } catch {
      // try the next candidate
    }
  }

  return null
}

async function isReady(url) {
  try {
    const response = await fetch(url)
    return response.ok
  } catch {
    return false
  }
}

async function waitFor(url, attempts = 60) {
  for (let attempt = 0; attempt < attempts; attempt += 1) {
    if (await isReady(url)) {
      return
    }

    await new Promise((resolve) => setTimeout(resolve, 250))
  }

  throw new Error(`Preview did not become ready at ${url}`)
}

function startStaticServer() {
  const server = createServer(async (req, res) => {
    const urlPath = decodeURIComponent(new URL(req.url ?? '/', previewUrl).pathname)
    const filePath = await resolveFile(urlPath)

    if (!filePath) {
      res.writeHead(404)
      res.end('Not found')
      return
    }

    try {
      const body = await readFile(filePath)
      res.writeHead(200, { 'Content-Type': contentType(filePath) })
      res.end(body)
    } catch {
      res.writeHead(500)
      res.end()
    }
  })

  return new Promise((resolve, reject) => {
    server.once('error', reject)
    server.listen(previewPort, '127.0.0.1', () => resolve(server))
  })
}

async function main() {
  if (!existsSync(dist)) {
    throw new Error('No dist/ folder. Run npm run newsletter:pdf (it builds first).')
  }

  if (await isReady(previewUrl)) {
    throw new Error(
      `Port ${previewPort} is already in use. Stop that process or set NEWSLETTER_PDF_PORT to a free port.`,
    )
  }

  const issue = parse(await readFile(path.join(root, 'src/data/newsletter.yaml'), 'utf8'))
  if (typeof issue?.id !== 'string' || !/^\d{4}-\d{2}$/.test(issue.id)) {
    throw new Error('src/data/newsletter.yaml is missing a YYYY-MM id.')
  }

  const defaultName = `rice-siam-newsletter-${issue.id}.pdf`
  const fromPath = `rice-siam${flyerPath.replaceAll('/', '-')}.pdf`.replace(/-flyer\.pdf$/, '.pdf')
  const outName = process.env.FLYER_OUT ?? (flyerPath === '/newsletter' ? defaultName : fromPath)
  const outFile = path.join(root, 'out', outName)
  await mkdir(path.dirname(outFile), { recursive: true })

  const server = await startStaticServer()

  try {
    await waitFor(flyerUrl)

    const browser = await chromium.launch()
    const page = await browser.newPage({
      viewport: { width: 1100, height: 1800 },
    })
    await page.goto(flyerUrl, { waitUntil: 'networkidle' })
    await page.locator('.flyer').waitFor()
    await page.evaluate(() => document.fonts.ready)
    await page.emulateMedia({ media: 'screen' })
    await page.addStyleTag({
      content: `
        .skip-link { display: none !important; }
        html[data-flyer], .flyer-body { background-color: #fff8f0 !important; }
      `,
    })

    const height = await page.evaluate(() => document.documentElement.scrollHeight)
    await page.pdf({
      path: outFile,
      printBackground: true,
      width: '1100px',
      height: `${height}px`,
      margin: { top: '0', right: '0', bottom: '0', left: '0' },
    })
    await browser.close()
  } finally {
    await new Promise((resolve) => server.close(resolve))
  }

  console.log(`Wrote ${outFile}`)
}

await main()

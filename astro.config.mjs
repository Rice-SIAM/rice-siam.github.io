import { defineConfig } from 'astro/config'
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'url'
import compress from 'astro-compress'
import icon from 'astro-icon'
import mdx from '@astrojs/mdx'
import sitemap from '@astrojs/sitemap'
import tailwindcss from '@tailwindcss/vite'

const viteConfig = {
  css: {
    preprocessorOptions: {
      scss: {
        loadPaths: [fileURLToPath(new URL('./src/assets', import.meta.url))],
        logger: {
          warn: () => {},
        },
      },
    },
  },
  plugins: [tailwindcss()],
  resolve: {
    alias: {
      '@components': fileURLToPath(new URL('./src/components', import.meta.url)),
      '@layouts': fileURLToPath(new URL('./src/layouts', import.meta.url)),
      '@assets': fileURLToPath(new URL('./src/assets', import.meta.url)),
      '@content': fileURLToPath(new URL('./src/content', import.meta.url)),
      '@pages': fileURLToPath(new URL('./src/pages', import.meta.url)),
      '@public': fileURLToPath(new URL('./public', import.meta.url)),
      '@data': fileURLToPath(new URL('./src/data', import.meta.url)),
      '@utils': fileURLToPath(new URL('./src/utils', import.meta.url)),
      '@theme-config': fileURLToPath(new URL('./theme.config.ts', import.meta.url)),
    },
  },
}

const site = 'https://siam.rice.edu'

export default defineConfig({
  output: 'static',
  compressHTML: true,
  site,
  redirects: {
    '/join': '/get-involved',
  },
  integrations: [
    compress({
      // Official Rice and SIAM marks must ship unmodified. ICS files must keep RFC 5545 line breaks.
      SVG: false,
      Image: false,
      Exclude: (file) => file.endsWith('.ics'),
    }),
    icon(),
    mdx(),
    sitemap({
      filter: (page) => {
        const path = new URL(page).pathname
        return (
          !path.startsWith('/newsletter') &&
          !path.endsWith('/flyer/') &&
          !path.endsWith('/flyer') &&
          !path.endsWith('.ics')
        )
      },
    }),
    {
      name: 'chapter-event-calendars',
      hooks: {
        // Dynamic .ics routes are HTML-minified during prerender; rewrite them from the feed.
        'astro:build:done': async ({ dir }) => {
          const distDir = fileURLToPath(dir)
          const feed = readFileSync(join(distDir, 'calendar.ics'), 'utf8')
          const [header, ...eventChunks] = feed.split(/BEGIN:VEVENT\r?\n/)
          const outDir = join(distDir, 'calendar')
          mkdirSync(outDir, { recursive: true })
          for (const chunk of eventChunks) {
            const vevent = chunk.replace(/END:VCALENDAR\r?\n$/, '')
            const uidMatch = vevent.match(/^UID:([^\r\n@]+)/m)
            if (!uidMatch) continue
            writeFileSync(join(outDir, `${uidMatch[1]}.ics`), `${header}BEGIN:VEVENT\r\n${vevent}END:VCALENDAR\r\n`)
          }
        },
      },
    },
  ],
  vite: viteConfig,
})

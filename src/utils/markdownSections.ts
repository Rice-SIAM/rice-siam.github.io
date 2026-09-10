const H2_SPLIT = /(?=<h2\b)/i
const HAS_LIST = /<(ul|ol)\b/i
const EXTERNAL_MARKDOWN_LINK = /<a href="(https?:\/\/[^"]+)"([^>]*)>([\s\S]*?)<\/a>/g

const EXTERNAL_LINK_ICON =
  '<svg aria-hidden="true" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h6v6m-11 5L21 3m-3 10v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /></svg><span class="sr-only"> Opens in a new tab</span>'

function openExternalMarkdownLinks(html: string): string {
  return html.replace(EXTERNAL_MARKDOWN_LINK, (match, href: string, attrs: string, inner: string) => {
    if (/\btarget=/i.test(attrs) || inner.includes('Opens in a new tab')) {
      return match
    }

    return `<a class="link link--external" href="${href}" target="_blank" rel="noopener noreferrer">${inner}${EXTERNAL_LINK_ICON}</a>`
  })
}

export function wrapMarkdownSections(
  html: string,
  options: { narrow?: boolean } = {},
): { html: string; sectionCount: number } {
  const withExternalLinks = openExternalMarkdownLinks(html)
  const chunks = withExternalLinks
    .split(H2_SPLIT)
    .map((chunk) => chunk.trim())
    .filter(Boolean)

  if (chunks.length === 0) {
    return { html: '', sectionCount: 0 }
  }

  const containerClass = options.narrow ? 'container narrow' : 'container'

  const wrapped = chunks
    .map((chunk, index) => {
      const muted = index % 2 === 1
      const centered = muted && !HAS_LIST.test(chunk)
      const sectionClass = ['site-section', muted && 'is-muted', centered && 'is-centered-copy']
        .filter(Boolean)
        .join(' ')

      return `<section class="${sectionClass}"><div class="${containerClass}"><div class="space-content">${chunk}</div></div></section>`
    })
    .join('')

  return { html: wrapped, sectionCount: chunks.length }
}

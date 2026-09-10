const H2_SPLIT = /(?=<h2\b)/i
const HAS_LIST = /<(ul|ol)\b/i

export function wrapMarkdownSections(
  html: string,
  options: { narrow?: boolean } = {},
): { html: string; sectionCount: number } {
  const chunks = html
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

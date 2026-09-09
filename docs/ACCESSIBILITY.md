# Accessibility

Rice University IT will not map `siam.rice.edu` until this website passes accessibility testing. Accessibility is a launch requirement, not an optional enhancement.

## Target

Aim for WCAG 2.2 Level AA. The accessibility statement currently describes the site as partially conformant until a full review is complete.

## Features already in the site

- Semantic HTML and landmark regions
- Skip link to main content
- One `h1` per page and a heading hierarchy
- Keyboard-accessible navigation, including a mobile menu with Escape to close
- Visible focus indicators
- Dark mode, high-contrast, and reduced-motion preferences
- Atkinson Hyperlegible as the primary typeface
- Responsive layout
- Meaningful link text
- No carousels, autoplay, or background video
- Static HTML output, with only small scripts for the menu and preference toggles

## When adding content

- Write a unique page title and a short description.
- Keep heading order logical. Do not skip levels.
- Use descriptive link text. Avoid “click here”.
- Provide `photoAlt` or `imageAlt` whenever you add an image.
- Decorative images can use empty alt text.
- Do not convey meaning with color alone.
- Do not add hover-only interactions.
- Prefer native HTML controls over custom widgets.

## Testing before launch

Before asking Rice IT to map the domain:

1. Build the site with `npm run build`.
2. Tab through every page with the keyboard only.
3. Check skip link, mobile menu, and dark mode.
4. Run an automated scan such as axe, WAVE, or Lighthouse.
5. Test with a screen reader if possible (VoiceOver, NVDA, or Narrator).
6. Confirm contrast of any new colors against the official Rice brand guide.

## Reporting issues

Use GitHub issues on this repository. Label accessibility work clearly so it is not lost during officer turnover.

# Accessibility

Rice University IT will not map `siam.rice.edu` until this website passes accessibility testing. Automated checks catch regressions; they do not prove WCAG conformance.

## Target

Aim for WCAG 2.2 Level AA. The public statement currently describes the site as partially conformant until a full review is complete.

## Automated checks

`npm run lint`, `npm run build`, and `npm run test:a11y` run in CI. The accessibility tests use axe on representative pages. A passing axe run is necessary, not sufficient.

## Pre-release checklist

Before asking Rice IT to map the domain:

1. Tab and Shift+Tab through every page. Confirm a visible focus indicator at all times.
2. Confirm the skip link appears on focus and moves focus to main content.
3. Confirm one `h1` per page and a logical heading order.
4. Use Enter and Space on buttons and the mobile menu toggle.
5. Confirm Escape closes the mobile menu and returns focus to the toggle.
6. Zoom to 200% and 400%. Check that content reflows without horizontal scrolling of the whole page.
7. Check 320px, 375px, and 768px widths.
8. Enable reduced motion in the OS and confirm decorative motion is suppressed.
9. Check Windows high-contrast / forced-colors if available.
10. Confirm event date, time, location, and registration remain understandable without color or icons. Opportunity type, deadline, location, and posting link should also remain understandable without color or icons.
11. Confirm informative images have `imageAlt` or `photoAlt`. Decorative images may use empty alt text.
12. Confirm link text makes sense out of context. Avoid “click here”.
13. Test with a screen reader if possible (VoiceOver, NVDA, or Narrator).
14. Run `npm run test:a11y` after `npm run build`.

## Reporting issues

Use GitHub issues on this repository. Label accessibility work clearly so it is not lost during officer turnover.

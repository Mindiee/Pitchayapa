# Portfolio implementation plan

## Source and scope

The user supplied Closet (2).zip on 2026-10-04 as the design source after Figma connector access failed. Its 6.svg is Home (1280 × 1905), 7.svg is TooSuePha (1280 × 8229), and 9.svg is Wua Lai (1280 × 3640). The SVGs outline text. Transcribe that text into semantic HTML, and extract only artwork for use as images. Never render a whole exported page as the website.

Build the requested portfolio in Inter. Preserve the desktop composition, typography hierarchy, whitespace, imagery, and content; reflow on tablet and mobile without adding content. Home links to separate project pages. Resume and Visit Website use the exact user URLs. Each available project section has a sticky anchor link with scroll tracking.

Wua Lai contains only an overview; its other four navigation labels have no section content in the export. The user clarified: keep the links and omit the content for now. Preserve the blank area with empty section anchors; do not manufacture case-study prose.

## Architecture

Astro builds three static routes, with shared Layout, Header, SectionNav, and project artwork components. Global CSS owns spacing, typography, and breakpoints. A small TypeScript module tracks the current section and updates aria-current. No client framework or backend is needed.

## Milestones

- [x] Extract supplied artwork, create shared layout, and build Home. Test its two project routes and resume link, then commit and push.
- [x] Build both case studies, responsive layouts, sticky section anchors and scroll tracking. Test direct routes, section navigation, external links, and image loading, then commit and push.
- [x] Check production build and types, desktop/tablet/mobile layouts, reduced-motion and keyboard navigation. Review all source, fix findings, commit and push. Deploy Vercel project pitchayapa and verify production routes.

## Verification

Playwright tests exercise actual rendered pages at 1280, 768, and 390 px, check overflow and image geometry, navigate from Home, click every section anchor, verify active sections during scroll and direct hash entry, and inspect external destinations. Capture screenshots for visual comparison against the supplied exports. Keep generated screenshots and original full-page exports out of the shipped site.

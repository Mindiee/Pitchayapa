# Verification — 2026-10-04

- `npm run check`: no errors, warnings, or hints.
- `npm test`: 17 tests passed against the generated static production build.
- `npm run build`: all three routes generated successfully.
- Browser matrix: 390 × 900, 768 × 900, 1280 × 900.
- Independent review also checked all routes at 320 × 568, keyboard skip navigation, and smooth-scroll anchors at 390 × 844.
- All artwork loaded; no document overflow or uncaught page errors in the tested layouts.
- Every project-section link, including Wua Lai's intentionally blank destinations, updates the current section.
- Direct hash navigation and manual scroll tracking checked, including the short final section.
- Home-to-project navigation, return-home link, Resume navigation, and exact external URLs checked.
- Both project websites and the Google Drive resume folder returned HTTP 200.
- Visual comparisons used the three supplied SVG exports. A duplicated image callout was found and corrected by extracting the original embedded bitmap separately from the HTML callout lines.
- Final read-only review found no remaining actionable issues.

## Source limitations

Only desktop exports were supplied. Smaller layouts reflow the same content and artwork. Wua Lai's four empty sections and their links remain per the user's explicit clarification.

## Dependency note

The installed Astro dependency tree reports the unpatched `http-cache-semantics` advisory GHSA-ch52-4w7c-c8xp. This portfolio emits only static files, has no server runtime or user sessions, and uses only local images. It does not execute the affected remote response cache in production. No forced downgrade was applied.

## Deployment

Vercel project `pitchayapa`, linked to `Mindiee/Pitchayapa`. Production verification is recorded after deployment below.

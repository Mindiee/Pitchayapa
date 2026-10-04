# Pitchayapa portfolio

Responsive static portfolio built with Astro and Inter, using the supplied `Closet (2).zip` and revised `6.svg`, `7.svg`, and `9.svg` exports as the visual source.

## Development

Requires Node.js 22.12+ (validated with Node.js 24).

```sh
npm ci
npm run dev
```

## Checks and production build

```sh
npx playwright install chromium
npm run check
npm test
npm run build
npm run preview
```

The browser tests build the production site, start a temporary preview server, and check routing, the provided destinations, loaded artwork, horizontal overflow, sticky anchors, active sections, and direct hash navigation at desktop, tablet, and mobile widths.

To test a deployed build: `TEST_BASE_URL=https://your-deployment.vercel.app npm test` (PowerShell: `$env:TEST_BASE_URL='https://your-deployment.vercel.app'; npm test`).

## Structure

- `src/pages/`: Home, TooSueaPha, and Wua Lai.
- `src/components/`: shared header, artwork, and section navigation.
- `src/scripts/section-navigation.ts`: scroll and anchor state.
- `src/styles/`: shared layout and project styles, including responsive breakpoints.
- `src/data/links.ts`: the three destinations supplied by the owner.
- `public/images/`: artwork extracted from the supplied SVGs; provenance records source coordinates.
- `tests/`: browser behavior tests.

Body copy is HTML. The website never embeds a full-page design screenshot. Artwork files are already committed; the original exports are not needed to build or deploy. To regenerate artwork, place the supplied `6.svg`, `7.svg`, and `9.svg` in `.design-reference/`, then run `node scripts/extract-artwork.mjs`.

The revised Wua Lai export supplies all five sections: Overall, Why Wua-lai, How it works, Design & Interaction, and Outcome. TooSueaPha includes revised UX KEY mockups and three Reflection cards. To regenerate revised assets after the original extraction, place the newer exports in `.design-reference/revision-2/` and run `node scripts/extract-revision-2.mjs`.

## Deployment

Vercel project: `pitchayapa`. `vercel.json` configures Astro's static output in `dist/`. No application secrets, database, server runtime, or environment variables are required.

```sh
npx vercel link --project pitchayapa
npx vercel deploy --prod
```

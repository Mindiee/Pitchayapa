import sharp from 'sharp';
import { mkdir, writeFile } from 'node:fs/promises';

// Coordinates refer to the user-supplied 1280px SVG exports. Only artwork is
// extracted; page headings, body copy, buttons and navigation remain HTML.
const crops = [
  ['toosuepha-laptop', '6', 50, 724, 563, 316],
  ['wua-lai-laptop', '6', 647, 724, 563, 314],
  ['toosuepha-logo', '7', 230, 463, 105, 105],
  ['lender-icon', '7', 178, 1759, 70, 70],
  ['renter-icon', '7', 1032, 1759, 70, 70],
  ['platform-icon', '7', 417, 1515, 61, 61],
  ['find-icon', '7', 137, 2858, 50, 49],
  ['fit-icon', '7', 332, 2858, 50, 49],
  ['try-on-icon', '7', 528, 2858, 50, 49],
  ['rent-icon', '7', 723, 2858, 50, 49],
  ['receive-icon', '7', 918, 2858, 50, 49],
  ['return-icon', '7', 1113, 2858, 50, 49],
  ['virtual-try-on', '7', 50, 3110, 783, 565],
  ['rental-flow', '7', 50, 3874, 548, 396],
  ['rental-notification', '7', 50, 4270, 548, 396],
  ['lender-overview', '7', 704, 3874, 548, 396],
  ['lender-returns', '7', 704, 4270, 548, 396],
  ['journey', '7', 373, 4908, 599, 728],
  ['prototype', '7', 50, 5878, 1071, 1594],
];
await mkdir('public/images', { recursive: true });
for (const [name, source, x, y, width, height] of crops) {
  await sharp(`.design-reference/${source}.svg`, { density: 144 })
    .extract({ left: x * 2, top: y * 2, width: width * 2, height: height * 2 })
    .webp({ quality: 95 })
    .toFile(`public/images/${name}.webp`);
}
await writeFile('public/images/provenance.json', JSON.stringify(crops.map(([name, source, x, y, width, height]) => ({
  file: `${name}.webp`, source: `Closet (2).zip/${source}.svg`, crop: { x, y, width, height }, scale: 2,
})), null, 2));

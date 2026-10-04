import sharp from 'sharp';
import { mkdir, readFile, writeFile } from 'node:fs/promises';

const sourceDirectory = '.design-reference/revision-2';
const crops = [
  ['wua-lai-collage', '9', 819, 441, 327, 516],
  ['wua-lai-design', '9', 120, 2851, 749, 418],
  ['wua-activity-data', '9', 133, 1946, 50, 50],
  ['wua-activity-density', '9', 372, 1946, 50, 50],
  ['wua-category-weight', '9', 611, 1946, 50, 50],
  ['wua-sound-intensity', '9', 850, 1946, 50, 50],
  ['wua-generative-sound', '9', 1089, 1946, 50, 50],
  ['wua-activity-legend', '9', 62, 2108, 312, 190],
  ['wua-category-table', '9', 498, 2108, 284, 190],
  ['wua-intensity-table', '9', 887, 2108, 313, 190],
  ['wua-explore-map', '9', 164, 2430, 50, 50],
  ['wua-discover-activity', '9', 465, 2430, 50, 50],
  ['wua-select-place', '9', 766, 2430, 50, 50],
  ['wua-listen-deeply', '9', 1068, 2430, 50, 50],
  ['wua-audio', '9', 919, 2910, 16, 17],
  ['wua-markers', '9', 919, 2985, 16, 17],
  ['wua-active', '9', 919, 3062, 16, 17],
  ['wua-hover', '9', 919, 3159, 16, 17],
  ['reflection-screen', '7', 89, 8117, 25, 25],
  ['reflection-people', '7', 492, 8117, 25, 25],
  ['reflection-operations', '7', 895, 8117, 25, 25],
];
await mkdir('public/images', { recursive: true });
const rendered = new Map();
for (const [name, source, x, y, width, height] of crops) {
  if (!rendered.has(source)) rendered.set(source, await sharp(`${sourceDirectory}/${source}.svg`, { density: 144 }).png().toBuffer());
  await sharp(rendered.get(source)).extract({ left: x * 2, top: y * 2, width: width * 2, height: height * 2 })
    .webp({ quality: 95 }).toFile(`public/images/${name}.webp`);
}
const existing = JSON.parse(await readFile('public/images/provenance.json', 'utf8'));
// Render only the image-filled rectangle and its pattern. This preserves the
// exact supplied laptop/mockup framing while excluding overlaid callout lines.
const imageSlots = [
  ['virtual-try-on', 'pattern27_211_6324', 813.383, 454.485],
  ['rental-flow', 'pattern28_211_6324', 584, 327],
  ['rental-notification', 'pattern29_211_6324', 584, 327],
  ['lender-overview', 'pattern30_211_6324', 584, 327],
  ['lender-returns', 'pattern31_211_6324', 597, 355],
  ['journey', 'pattern32_211_6324', 599, 727],
  ['prototype', 'pattern33_211_6324', 1070, 1592],
];
const svg = await readFile(`${sourceDirectory}/7.svg`, 'utf8');
for (const [name, patternId, width, height] of imageSlots) {
  const pattern = svg.match(new RegExp(`<pattern\\b[^>]*id="${patternId}"[^>]*>[\\s\\S]*?</pattern>`))?.[0];
  const imageId = pattern?.match(/xlink:href="#([^"]+)"/)?.[1];
  const image = svg.match(new RegExp(`<image\\b[^>]*id="${imageId}"[^>]*>`))?.[0];
  if (!pattern || !image) throw new Error(`Missing source artwork: ${name}`);
  const isolated = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}"><defs>${pattern}${image}</defs><rect width="${width}" height="${height}" fill="url(#${patternId})"/></svg>`;
  await sharp(Buffer.from(isolated), { density: 144 }).webp({ quality: 95 }).toFile(`public/images/${name}.webp`);
}
const names = new Set([...crops, ...imageSlots].map(([name]) => `${name}.webp`));
await writeFile('public/images/provenance.json', JSON.stringify([
  ...existing.filter(item => !names.has(item.file)),
  ...crops.map(([name, source, x, y, width, height]) => ({ file: `${name}.webp`, source: `SVG revision 2/${source}.svg`, crop: { x, y, width, height }, scale: 2 })),
  ...imageSlots.map(([name, pattern, width, height]) => ({ file: `${name}.webp`, source: 'SVG revision 2/7.svg', pattern, width, height, scale: 2, note: 'Isolated original image fill, without page text or callout overlays.' })),
], null, 2));

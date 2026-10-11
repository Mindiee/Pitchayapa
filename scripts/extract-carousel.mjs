import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

// Original files are design inputs only; deployment uses the extracted WebP files.
const directory = process.argv[2] || '.design-reference/carousel';
const photos = [
  ['wall', 140, 'pattern1_241_1840'],
  ['temple', 139, 'pattern0_241_1839'],
  ['craft', 139, 'pattern1_241_1839'],
  ['market', 138, 'pattern0_241_1838'],
  ['shop', 141, 'pattern1_241_1841'],
];
const provenance = [];
for (const [name, group, id] of photos) {
  const source = `Group ${group}.svg`;
  const svg = await fs.readFile(path.join(directory, source), 'utf8');
  const pattern = [...svg.matchAll(/<pattern[\s\S]*?<\/pattern>/g)].find(([value]) => value.includes(`id="${id}"`))?.[0];
  const imageId = pattern?.match(/href="#([^"]+)"/)?.[1];
  const image = [...svg.matchAll(/<image\b[^>]*\/>/g)].find(([value]) => value.includes(`id="${imageId}"`))?.[0];
  if (!pattern || !image) throw new Error(`Missing image pattern in ${source}`);
  const isolated = `<svg width="327" height="245" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><defs>${pattern}${image}</defs><rect width="327" height="245" fill="url(#${id})"/></svg>`;
  const file = `wua-photo-${name}.webp`;
  await sharp(Buffer.from(isolated), { density: 144 }).webp({ quality: 92 }).toFile(`public/images/${file}`);
  provenance.push({ file, source, pattern: id });
}
await fs.writeFile('public/images/carousel-provenance.json', JSON.stringify(provenance, null, 2) + '\n');

import { chromium } from '@playwright/test';
import { mkdir } from 'node:fs/promises';

await mkdir('.design-reference/qa', { recursive: true });
const browser = await chromium.launch();
for (const width of [1280, 768, 390]) {
  const page = await browser.newPage({ viewport: { width, height: 900 }, reducedMotion: 'reduce' });
  for (const [name, route] of [['home', '/'], ['toosuepha', '/toosuepha/'], ['wua-lai', '/wua-lai/']]) {
    await page.goto(`http://127.0.0.1:4321${route}`);
    await page.evaluate(async () => {
      await document.fonts.ready;
      await Promise.all(Array.from(document.images).map(async img => { img.loading = 'eager'; await img.decode().catch(() => {}); }));
    });
    await page.screenshot({ path: `.design-reference/qa/${name}-${width}.png`, fullPage: true });
    if (width === 1280) console.log(name, await page.locator('main section').evaluateAll(sections => sections.map(section => ({ id: section.id, top: section.getBoundingClientRect().top, height: section.getBoundingClientRect().height }))));
  }
  await page.goto('http://127.0.0.1:4321/toosuepha/#reflection');
  console.log('Reflection scroll', width, await page.evaluate(() => ({ scrollY, viewport: innerHeight, fullHeight: document.documentElement.scrollHeight, sectionTop: document.getElementById('reflection').getBoundingClientRect().top, navBottom: document.querySelector('.section-nav').getBoundingClientRect().bottom, active: document.querySelector('.section-nav [aria-current]')?.textContent })));
  await page.close();
}
await browser.close();

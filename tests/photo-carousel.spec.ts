import { test, expect } from '@playwright/test';

test('Wua-lai photos advance automatically and can be paused', async ({ page }) => {
  await page.clock.install();
  await page.goto('/wua-lai/');
  const gallery = page.getByRole('region', { name: 'Wua-lai neighborhood photos' });
  await gallery.scrollIntoViewIfNeeded();
  for (const img of await gallery.locator('img').all()) {
    await expect.poll(() => img.evaluate((el: HTMLImageElement) => el.complete && el.naturalWidth > 0)).toBe(true);
  }
  await page.mouse.move(0, 0);
  const current = gallery.locator('[aria-current="true"] img');
  const first = await current.getAttribute('src');
  await page.clock.runFor(5000);
  await expect(current).not.toHaveAttribute('src', first!);
  await gallery.getByRole('button', { name: 'Pause slideshow' }).click();
  const paused = await current.getAttribute('src');
  await page.mouse.move(0, 0);
  await page.clock.runFor(10000);
  await expect(current).toHaveAttribute('src', paused!);
  await gallery.getByRole('button', { name: 'Play slideshow' }).click();
  await page.mouse.move(0, 0);
  await page.clock.runFor(5000);
  await expect(current).not.toHaveAttribute('src', paused!);
});

test('Wua-lai gallery supports touch swipe, keyboard, and reduced motion', async ({ browser }) => {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true, reducedMotion: 'reduce' });
  const page = await context.newPage();
  await page.goto('/wua-lai/');
  const gallery = page.getByRole('region', { name: 'Wua-lai neighborhood photos' });
  await gallery.scrollIntoViewIfNeeded();
  await expect(gallery.getByRole('button', { name: 'Play slideshow' })).toBeVisible();
  const current = gallery.locator('[aria-current="true"] img');
  const first = await current.getAttribute('src');
  const box = (await gallery.boundingBox())!;
  const cdp = await context.newCDPSession(page);
  const x = box.x + box.width / 2;
  const y = box.y + box.height / 2;
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x, y }] });
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x, y: y - 100 }] });
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
  await expect(current).not.toHaveAttribute('src', first!);
  await gallery.focus();
  await page.keyboard.press('ArrowUp');
  await expect(current).toHaveAttribute('src', first!);
  await page.keyboard.press('End');
  await page.keyboard.press('ArrowDown');
  await expect(current).toHaveAttribute('src', '/images/wua-photo-wall.webp');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await context.close();
});

test('Wua-lai gallery responds to mouse dragging and wheel scrolling', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/wua-lai/');
  const gallery = page.getByRole('region', { name: 'Wua-lai neighborhood photos' });
  await gallery.scrollIntoViewIfNeeded();
  const box = (await gallery.boundingBox())!;
  const current = gallery.locator('[aria-current="true"] img');
  const first = await current.getAttribute('src');
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.mouse.down();
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2 - 100, { steps: 8 });
  await page.mouse.up();
  await expect(current).not.toHaveAttribute('src', first!);
  await page.mouse.wheel(0, -100);
  await expect(current).toHaveAttribute('src', first!);
});

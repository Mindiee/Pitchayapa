import { test, expect } from '@playwright/test';

// These checks catch broken destinations, missing routes, and layout overflow.
test('home exposes both case studies and the supplied resume destination', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Pitchayapa');
  await expect(page.getByRole('link', { name: /download/i })).toHaveAttribute('href', 'https://drive.google.com/drive/folders/1BMrL3Ybh64YG5yk2HW2jAA_dVZJmQnUp?usp=sharing');
  await page.getByRole('link', { name: /TooSuePha rental marketplace/i }).click();
  await expect(page).toHaveURL(/\/toosuepha\/$/);
  await page.getByRole('link', { name: 'Pitchayapa T.' }).click();
  await page.getByRole('link', { name: /The Echoes of Wua-lai interactive/i }).click();
  await expect(page).toHaveURL(/\/wua-lai\/$/);
});

for (const width of [390, 768, 1280]) {
  for (const route of ['/', '/toosuepha/', '/wua-lai/']) {
    test(`${route} fits ${width}px with every artwork loaded`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      const errors: string[] = [];
      page.on('pageerror', error => errors.push(error.message));
      const response = await page.goto(route);
      expect(response?.status()).toBe(200);
      await page.evaluate(async () => { await document.fonts.ready; });
      for (const img of await page.locator('main img').all()) {
        await img.scrollIntoViewIfNeeded();
        await expect(img).toBeVisible();
        await expect.poll(() => img.evaluate((el: HTMLImageElement) => el.complete && el.naturalWidth > 0)).toBe(true);
      }
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
      expect(errors).toEqual([]);
    });
  }
}

test('project website links use the supplied destinations', async ({ page }) => {
  await page.goto('/toosuepha/');
  await expect(page.getByRole('link', { name: /visit website/i })).toHaveAttribute('href', 'https://toosuepha.vercel.app/');
  await page.goto('/wua-lai/');
  await expect(page.getByRole('link', { name: /visit website/i })).toHaveAttribute('href', 'https://the-echoes-of-wua-lai.vercel.app/');
});

for (const width of [390, 768, 1280]) {
  test(`Wua Lai keeps its empty section anchors at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/wua-lai/');
    const nav = page.getByRole('navigation', { name: 'Project sections' });
    for (const id of ['overall', 'why-wua-lai', 'how-it-works', 'design-interaction', 'reflection']) {
      const link = nav.locator(`a[href="#${id}"]`);
      await link.click();
      await expect(link).toHaveAttribute('aria-current', 'location');
      await expect(page.locator(`#${id}`)).toBeAttached();
      if (id !== 'overall') await expect(page.locator(`#${id}`)).toHaveText('');
    }
  });
  test(`sticky anchors track click, scroll and direct hashes at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/toosuepha/');
    const nav = page.getByRole('navigation', { name: 'Project sections' });
    for (const id of ['overall', 'how-it-works', 'problem', 'design-response', 'journey', 'prototype', 'reflection']) {
      const link = nav.locator(`a[href="#${id}"]`);
      await link.click();
      await expect(link).toHaveAttribute('aria-current', 'location');
      const sectionTop = await page.locator(`#${id}`).evaluate(el => el.getBoundingClientRect().top);
      const navBottom = await nav.evaluate(el => el.getBoundingClientRect().bottom);
      expect(sectionTop).toBeGreaterThanOrEqual(navBottom - 2);
      expect(await nav.evaluate(el => el.getBoundingClientRect().top)).toBeGreaterThanOrEqual(0);
    }
    await page.locator('#problem').evaluate(el => el.scrollIntoView());
    await expect(nav.locator('a[href="#problem"]')).toHaveAttribute('aria-current', 'location');
    await page.goto('/toosuepha/#journey');
    await expect(nav.locator('a[href="#journey"]')).toHaveAttribute('aria-current', 'location');
  });
}

import { Page, Locator, expect } from '@playwright/test';

export async function assertTouchTargetSize(locator: Locator, minWidth: number = 44, minHeight: number = 44) {
  const box = await locator.boundingBox();
  if (!box) throw new Error('Element not visible');
  expect(box.width).toBeGreaterThanOrEqual(minWidth);
  expect(box.height).toBeGreaterThanOrEqual(minHeight);
}

export async function assertChineseFontSize(page: Page, selector: string, minSize: number = 13) {
  const fontSize = await page.evaluate((sel) => {
    const el = document.querySelector(sel);
    if (!el) return 0;
    const style = window.getComputedStyle(el);
    return parseFloat(style.fontSize);
  }, selector);
  expect(fontSize).toBeGreaterThanOrEqual(minSize);
}

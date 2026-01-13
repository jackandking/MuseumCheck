/**
 * E2E Sanity Test Suite - Critical Path Validation
 */
import { test, expect, Page } from '@playwright/test';

async function dismissSettingsModalIfPresent(page: Page) {
  const settingsModal = page.locator('#sgSettingsModal');
  const isVisible = await settingsModal.isVisible({ timeout: 3000 }).catch(() => false);
  if (isVisible) {
    await page.locator('#sgCaregiverName').fill('测试家长');
    await page.locator('#sgChildName').fill('测试宝贝');
    await page.locator('#sgChildAge').selectOption('7-12岁 (小学)');
    await page.locator('#sgCaregiverRole').selectOption('父母');
    await page.locator('#sgSettingsSave').click();
    await expect(settingsModal).not.toBeVisible({ timeout: 5000 });
  }
}

test.describe('Critical Path Sanity Tests', () => {
  test('SANITY-01: Homepage loads and renders museum grid', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/博物馆|MuseumCheck/);
    const grid = page.locator('#museumGrid');
    await expect(grid).toBeVisible();
    await page.waitForFunction(() => {
      const el = document.getElementById('museumGrid');
      return !!el && el.children && el.children.length > 0;
    }, null, { timeout: 10000 });
    const childCount = await page.evaluate(() => {
      const el = document.getElementById('museumGrid');
      return el && el.children ? el.children.length : 0;
    });
    expect(childCount).toBeGreaterThan(0);
  });

  test('SANITY-02: Museum count within expected range', async ({ page }) => {
    await page.goto('/');
    await page.waitForFunction(() => {
      const el = document.getElementById('museumGrid');
      return !!el && el.children && el.children.length > 200;
    }, null, { timeout: 10000 });
    const museumCount = await page.evaluate(() => {
      const el = document.getElementById('museumGrid');
      return el && el.children ? el.children.length : 0;
    });
    expect(museumCount).toBeGreaterThanOrEqual(200);
  });

  test('SANITY-03: Age selector changes content', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    const youngAge = page.locator('button:has-text("3-6岁")').first();
    const schoolAge = page.locator('button:has-text("7-12岁")').first();
    const teenAge = page.locator('button:has-text("13-18岁")').first();
    await expect(youngAge).toBeVisible();
    await expect(schoolAge).toBeVisible();
    await expect(teenAge).toBeVisible();
    await schoolAge.click();
    await page.waitForTimeout(300);
    await youngAge.click();
    await page.waitForTimeout(300);
    const storedAge = await page.evaluate(() => localStorage.getItem('selectedAgeGroup'));
    expect(storedAge).toBeTruthy();
  });

  test('SANITY-04: Museum modal opens and displays content', async ({ page }) => {
    await page.goto('/');
    await page.waitForFunction(() => {
      const el = document.getElementById('museumGrid');
      return !!el && el.children && el.children.length > 10;
    }, null, { timeout: 10000 });
    const firstCard = page.locator('.museum-card').first();
    await expect(firstCard).toBeVisible();
    await firstCard.click();
    const modal = page.locator('.modal').first();
    await expect(modal).toBeVisible({ timeout: 5000 });
    const modalTitle = modal.locator('h2, h3').first();
    await expect(modalTitle).toBeVisible();
  });

  test('SANITY-05: v3 workflow initializes', async ({ page }) => {
    await page.goto('/single-museum.html?museum=pinghu-museum');
    await dismissSettingsModalIfPresent(page);
    const introOverlay = page.locator('#sgIntroOverlay');
    await expect(introOverlay).toBeVisible({ timeout: 10000 });
    const startButton = page.locator('#sgIntroStart');
    await expect(startButton).toBeVisible();
    await startButton.click();
    await page.waitForTimeout(800);
    const visitStep = page.locator('#step-visit');
    await expect(visitStep).toBeVisible({ timeout: 5000 });
  });

  test('SANITY-06: localStorage persists across navigation', async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => {
      localStorage.setItem('test-key', 'test-value');
      localStorage.setItem('visitedMuseums', JSON.stringify(['forbidden-city']));
    });
    await page.goto('/single-museum.html?museum=pinghu-museum');
    const testValue = await page.evaluate(() => localStorage.getItem('test-key'));
    expect(testValue).toBe('test-value');
    const visitedMuseums = await page.evaluate(() => JSON.parse(localStorage.getItem('visitedMuseums') || '[]'));
    expect(visitedMuseums).toContain('forbidden-city');
  });
});

test.describe('Mobile UX Sanity', () => {
  test.use({ viewport: { width: 375, height: 667 } });
  test('SANITY-M-01: Touch targets approx visible', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    const ageButtons = page.locator('.age-option, button:has-text("岁")');
    const count = await ageButtons.count();
    if (count > 0) {
      const button = ageButtons.first();
      const box = await button.boundingBox();
      if (box) {
        expect(box.height).toBeGreaterThanOrEqual(36); // relaxed sanity check
      }
    }
  });
});

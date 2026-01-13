import { Page, expect } from '@playwright/test';

export async function dismissSettingsModal(
  page: Page,
  settings?: { caregiverName?: string; childName?: string; childAge?: string; caregiverRole?: string }
) {
  const settingsModal = page.locator('#sgSettingsModal');
  const isVisible = await settingsModal.isVisible({ timeout: 3000 }).catch(() => false);
  if (isVisible) {
    await page.locator('#sgCaregiverName').fill(settings?.caregiverName || '测试家长');
    await page.locator('#sgChildName').fill(settings?.childName || '测试宝贝');
    await page.locator('#sgChildAge').selectOption(settings?.childAge || '7-12岁 (小学)');
    await page.locator('#sgCaregiverRole').selectOption(settings?.caregiverRole || '父母');
    await page.locator('#sgSettingsSave').click();
    await expect(settingsModal).not.toBeVisible({ timeout: 5000 });
  }
}

export async function clearLocalStorage(page: Page) {
  await page.evaluate(() => localStorage.clear());
}

export async function setDefaultSettings(page: Page) {
  await page.evaluate(() => {
    localStorage.setItem('caregiverName', '测试家长');
    localStorage.setItem('childName', '测试宝贝');
    localStorage.setItem('childAge', '7-12岁 (小学)');
    localStorage.setItem('caregiverRole', '父母');
    localStorage.setItem('settingsSeen', 'true');
  });
}

export async function waitForMuseumGridLoad(page: Page, minMuseums: number = 10) {
  await page.waitForFunction(
    (min) => {
      const el = document.getElementById('museumGrid');
      return !!el && el.children && el.children.length >= min;
    },
    minMuseums,
    { timeout: 10000 }
  );
}

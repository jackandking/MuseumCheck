import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import os from 'os';

/**
 * Regression guard for the iPhone check-in photo bug (user report, 南京博物院):
 *
 * The user opened the task dialog, picked a photo, and the flow went dead -
 * no preview, no confirmation, no way to attach the photo; they ended up
 * cancelling and completing the task without one.
 *
 * Root causes fixed:
 *  1. The file input was collapsed to a 1x1 transparent box, a pattern iOS
 *     Safari / in-app WebViews handle unreliably.
 *  2. The HEIC -> JPEG conversion could hang forever (no decode error/timeout
 *     path), so nothing ever happened after picking a photo.
 *
 * These tests pin the mobile behaviour: picking a photo always produces
 * feedback, the photo is stored, and the 完成任务 button stays reachable.
 */

test.describe('Museum check-in photo attach (iPhone regression)', () => {
  test.use({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
  });

  /** Minimal valid 1x1 JPEG (solid colour). */
  const JPEG_B64 =
    '/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwg' +
    'JC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/wAALCAABAAEBAREA/8QAFAABAAAAAAAAAAAAAAA' +
    'AAAAACf/EABQQAQAAAAAAAAAAAAAAAAAAAAD/2gAIAQEAAD8AKp//2Q==';

  /** Bytes that no engine can decode as an image (the HEIC-on-non-Apple case). */
  const UNDECODABLE_B64 = 'AAABAAEAICAAAAEAIACoEAAAFgAAACgAAAAIAAAAEAAAAAEAIAAAAAAA';

  function writeTempFixture(name: string, b64: string): string {
    const file = path.join(os.tmpdir(), `museumcheck-${process.pid}-${name}`);
    fs.writeFileSync(file, Buffer.from(b64, 'base64'));
    return file;
  }

  async function openFirstTask(page: import('@playwright/test').Page) {
    await page.goto('/museum-checkin.html?museum=forbidden-city&age=7-12');
    await expect(page.locator('#museumName')).toContainText('故宫博物院');
    await expect(page.locator('#taskGrid > *').first()).toBeVisible();
    await page.locator('#taskGrid > *').first().click();
    await expect(page.locator('#taskModal')).toHaveClass(/show/);
    // openTaskDetail() finishes asynchronously (contributor sections, family photos,
    // photo preview init). A real user is still inside the OS picker at this point;
    // give the dialog time to settle so the file injection is not racing the setup.
    await page.waitForTimeout(1500);
  }

  function savedPhotos(page: import('@playwright/test').Page) {
    return page.evaluate(() => {
      const key = Object.keys(localStorage).find((k) => k.startsWith('museumPhotos_'));
      if (!key) return null;
      const photos = JSON.parse(localStorage.getItem(key) || '{}');
      return Object.keys(photos).map((k) => ({ task: k, isDataUrl: String(photos[k]).startsWith('data:image/') }));
    });
  }

  test('picking a photo shows feedback and keeps 完成任务 tappable', async ({ page }) => {
    await openFirstTask(page);

    await expect(page.locator('#photoInputWrapper')).toBeVisible();
    await page.setInputFiles('#taskPhotoInput', writeTempFixture('photo.jpg', JPEG_B64));

    // The photo step must confirm itself - this is what was missing on iPhone.
    await expect(page.locator('#photoPreview img')).toBeVisible();
    await expect(page.locator('#photoStatus')).toContainText('照片已添加');
    await expect(page.locator('#photoInputWrapper')).toBeHidden();
    await expect(page.locator('#retakeButton')).toBeVisible();

    // The primary action stays reachable above the fold after the preview is appended.
    await expect(page.locator('#completeButton')).toBeVisible();
    await expect(page.locator('#completeButton')).toBeEnabled();
    await expect(page.locator('#completeButton')).toBeInViewport();

    expect(await savedPhotos(page)).toEqual([{ task: '0', isDataUrl: true }]);
  });

  test('an undecodable photo never stalls the flow', async ({ page }) => {
    await openFirstTask(page);

    const pending = page.waitForTimeout(4000); // would hang the old code forever
    await page.setInputFiles('#taskPhotoInput', writeTempFixture('photo.heic', UNDECODABLE_B64));
    await pending;

    // Fallback path: the original file is kept, the user is told, nothing hangs.
    await expect(page.locator('#photoStatus')).toContainText('照片已添加');
    await expect(page.locator('#photoPreview img')).toBeVisible();
    await expect(page.locator('#completeButton')).toBeEnabled();

    expect(await savedPhotos(page)).toEqual([{ task: '0', isDataUrl: true }]);
  });

  test('completing right after picking does not drop the photo', async ({ page }) => {
    await openFirstTask(page);

    await page.setInputFiles('#taskPhotoInput', writeTempFixture('photo.jpg', JPEG_B64));
    // No waiting for the conversion: a fast tap on the primary button used to lose the photo.
    await page.locator('#completeButton').click();

    await expect(page.locator('#taskModal')).not.toHaveClass(/show/);
    const photos = await savedPhotos(page);
    expect(photos).toBeTruthy();
    expect(photos![0].isDataUrl).toBe(true);
  });
});

import { test, expect } from '@playwright/test';
import { trackConsoleErrors } from './helpers/assertions';

test.describe('Museum check-in mobile visit guide', () => {
  test.use({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
  });

  test.beforeEach(async ({ page }) => {
    await page.route('**/default/keyValueStore', route => {
      route.fulfill({ status: 200, contentType: 'application/json', body: '{}' });
    });
    await page.route('**/mysql/query', route => {
      route.fulfill({ status: 200, contentType: 'application/json', body: '{"rows":[]}' });
    });
  });

  test('guides an on-site mobile visitor into the first task', async ({ page }) => {
    const assertNoConsoleErrors = trackConsoleErrors(page);
    const letmetryRequests: string[] = [];

    page.on('request', request => {
      if (request.url().includes('letmetry.cloud')) {
        letmetryRequests.push(request.url());
      }
    });

    await page.addInitScript(() => {
      localStorage.clear();
      localStorage.setItem('childNickname', '测试小朋友');
      localStorage.setItem('ageGroup', '7-12');
      localStorage.setItem('childModeEnabled', 'false');
      localStorage.setItem('gameRewardEnabled', 'false');
      localStorage.setItem('nicknameHasBeenSet', 'true');
    });

    await page.goto('/museum-checkin.html?museum=forbidden-city&age=7-12');
    await expect(page.locator('#museumName')).toContainText('故宫博物院');
    await page.waitForSelector('.task-card', { timeout: 10000 });

    const visitCoach = page.locator('#visitCoach');
    await expect(visitCoach).toBeVisible();
    await expect(page.locator('#visitCoachTitle')).toContainText('先做第 1 个任务');
    await expect(page.locator('#visitCoachDescription')).toContainText('门口');

    const coachBox = await visitCoach.boundingBox();
    expect(coachBox).not.toBeNull();
    expect(coachBox!.y).toBeGreaterThanOrEqual(0);
    expect(coachBox!.y + coachBox!.height).toBeLessThan(844);

    const startButton = page.locator('#visitCoachButton');
    await expect(startButton).toBeVisible();
    await expect(startButton).toContainText('开始第1个');
    const buttonBox = await startButton.boundingBox();
    expect(buttonBox).not.toBeNull();
    expect(buttonBox!.height).toBeGreaterThanOrEqual(44);

    const firstTask = page.locator('.task-card').first();
    await expect(firstTask).toHaveAttribute('role', 'button');
    await expect(firstTask).toHaveAttribute('aria-label', /开始任务：门口打卡/);

    await startButton.click();

    const taskModal = page.locator('#taskModal');
    await expect(taskModal).toHaveClass(/show/);
    await expect(page.locator('#modalTaskTitle')).toContainText('门口打卡');

    await page.locator('#completeButton').click();
    await expect(taskModal).not.toHaveClass(/show/);
    await expect(page.locator('#completedCount')).toHaveText('1');
    await expect(page.locator('#visitCoachTitle')).toContainText('第 2 个任务');
    await expect(page.locator('.task-card').first()).toHaveClass(/completed/);

    expect(letmetryRequests).toEqual([]);
    assertNoConsoleErrors();
  });

  test('does not block a brand-new visitor with nickname onboarding', async ({ page }) => {
    const assertNoConsoleErrors = trackConsoleErrors(page);
    const letmetryRequests: string[] = [];

    page.on('request', request => {
      if (request.url().includes('letmetry.cloud')) {
        letmetryRequests.push(request.url());
      }
    });

    await page.addInitScript(() => {
      localStorage.clear();
      localStorage.setItem('ageGroup', '7-12');
      localStorage.setItem('childModeEnabled', 'false');
      localStorage.setItem('gameRewardEnabled', 'false');
    });

    await page.goto('/museum-checkin.html?museum=forbidden-city&age=7-12');
    await expect(page.locator('#museumName')).toContainText('故宫博物院');
    await page.waitForSelector('.task-card', { timeout: 10000 });
    await page.waitForTimeout(1000);

    await expect(page.locator('#nicknameOnboardingModal')).not.toBeVisible();
    await expect(page.locator('#visitCoachButton')).toBeVisible();

    await page.locator('#visitCoachButton').click();
    await expect(page.locator('#taskModal')).toHaveClass(/show/);
    await expect(page.locator('#modalTaskTitle')).toContainText('门口打卡');

    const nicknameState = await page.evaluate(() => ({
      childNickname: localStorage.getItem('childNickname'),
      nicknameHasBeenSet: localStorage.getItem('nicknameHasBeenSet'),
    }));

    expect(nicknameState.childNickname).toMatch(/^用户[0-9a-f]{6}$/);
    expect(nicknameState.nicknameHasBeenSet).toBeNull();
    expect(letmetryRequests).toEqual([]);
    assertNoConsoleErrors();
  });
});

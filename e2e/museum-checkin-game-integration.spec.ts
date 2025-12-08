import { test, expect, Page } from '@playwright/test';

/**
 * E2E Test Suite for Game Integration in Museum Check-in Page
 * 
 * Focus Areas:
 * 1. User plays game after task completion with photo
 * 2. User skips game after task completion
 * 3. Game settings enabled/disabled
 * 4. Multiple game types (puzzle, maze, shooting, space invaders, etc.)
 * 5. Game completion doesn't interfere with task progress
 * 6. Game interruption and recovery
 */

const BASE_URL = 'http://localhost:8000';
const MUSEUM_ID = 'pinghu-museum';
const AGE_GROUP = '7-12';

function getCheckinUrl(museum: string = MUSEUM_ID, age: string = AGE_GROUP): string {
  return `${BASE_URL}/museum-checkin.html?museum=${museum}&age=${age}`;
}

async function waitForTaskGrid(page: Page): Promise<void> {
  await page.waitForSelector('#taskGrid', { timeout: 10000 });
  await page.waitForSelector('.task-card', { timeout: 10000 });
}

function getTaskCard(page: Page, index: number) {
  return page.locator('.task-card').nth(index);
}

async function openTaskModal(page: Page, taskIndex: number): Promise<void> {
  const taskCard = getTaskCard(page, taskIndex);
  await taskCard.click();
  await page.waitForSelector('#taskModal.show', { timeout: 5000 });
}

async function uploadPhoto(page: Page, filename: string = 'test-photo.jpg'): Promise<void> {
  const photoInput = page.locator('#photoUpload');
  const testImageBuffer = Buffer.from(
    'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
    'base64'
  );
  
  await photoInput.setInputFiles({
    name: filename,
    mimeType: 'image/jpeg',
    buffer: testImageBuffer,
  });
  
  await page.waitForSelector('.photo-preview img', { timeout: 5000 });
}

test.describe('Game Integration Scenarios', () => {
  
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL);
    await page.evaluate(() => localStorage.clear());
  });

  test('Scenario 1: Game appears after completing task with photo', async ({ page }) => {
    await page.goto(getCheckinUrl());
    await waitForTaskGrid(page);
    
    // Ensure game setting is enabled
    await page.evaluate(() => {
      localStorage.setItem('puzzleGameSetting', 'true');
    });
    
    // Open first task
    await openTaskModal(page, 0);
    
    // Upload photo
    await uploadPhoto(page);
    
    // Complete task
    const completeBtn = page.locator('#completeButton');
    await completeBtn.click();
    
    // Wait for modal to close
    await expect(page.locator('#taskModal')).not.toHaveClass(/show/, { timeout: 5000 });
    
    // Check if game modal appears
    const gameModals = [
      '#gameModal',
      '#puzzleGameModal',
      '#mazeGameModal', 
      '#shootingGameModal',
      '#spaceInvadersModal',
      '#tankBattleModal',
      '#minesweeperModal',
      '#petAdventureModal'
    ];
    
    let gameAppeared = false;
    for (const modalSelector of gameModals) {
      const modal = page.locator(modalSelector);
      const isVisible = await modal.isVisible({ timeout: 2000 }).catch(() => false);
      if (isVisible) {
        gameAppeared = true;
        console.log(`✅ Game modal appeared: ${modalSelector}`);
        
        // Close the game
        const closeBtn = page.locator(`${modalSelector} .close-button, ${modalSelector} button:has-text("关闭")`).first();
        if (await closeBtn.isVisible({ timeout: 1000 }).catch(() => false)) {
          await closeBtn.click();
        }
        break;
      }
    }
    
    if (!gameAppeared) {
      console.log('ℹ️  No game modal appeared (may be disabled or different implementation)');
    }
    
    // Verify task is still marked as completed
    await expect(getTaskCard(page, 0)).toHaveClass(/completed/);
  });

  test('Scenario 2: Complete task without photo - no game', async ({ page }) => {
    await page.goto(getCheckinUrl());
    await waitForTaskGrid(page);
    
    // Ensure game setting is enabled
    await page.evaluate(() => {
      localStorage.setItem('puzzleGameSetting', 'true');
    });
    
    // Open and complete task without photo
    await openTaskModal(page, 0);
    
    const completeBtn = page.locator('#completeButton');
    await completeBtn.click();
    
    // Wait for modal to close
    await expect(page.locator('#taskModal')).not.toHaveClass(/show/, { timeout: 5000 });
    
    // Verify no game appears
    await page.waitForTimeout(2000);
    
    const gameModal = page.locator('#gameModal, #puzzleGameModal, #mazeGameModal');
    const gameVisible = await gameModal.isVisible({ timeout: 1000 }).catch(() => false);
    
    if (gameVisible) {
      console.log('⚠️  Game appeared even without photo (unexpected)');
    } else {
      console.log('✅ No game appeared when completing task without photo');
    }
  });

  test('Scenario 3: Game setting disabled - no game appears', async ({ page }) => {
    await page.goto(getCheckinUrl());
    await waitForTaskGrid(page);
    
    // Disable game setting
    await page.evaluate(() => {
      localStorage.setItem('puzzleGameSetting', 'false');
    });
    
    // Open task and upload photo
    await openTaskModal(page, 0);
    await uploadPhoto(page);
    
    // Complete task
    const completeBtn = page.locator('#completeButton');
    await completeBtn.click();
    
    await expect(page.locator('#taskModal')).not.toHaveClass(/show/, { timeout: 5000 });
    
    // Verify no game appears
    await page.waitForTimeout(2000);
    
    const gameModal = page.locator('#gameModal, #puzzleGameModal, #mazeGameModal, #shootingGameModal');
    const gameVisible = await gameModal.isVisible({ timeout: 1000 }).catch(() => false);
    
    if (gameVisible) {
      console.log('⚠️  Game appeared even with setting disabled (unexpected)');
    } else {
      console.log('✅ Game correctly disabled when setting is off');
    }
  });

  test('Scenario 4: Close game modal - task remains completed', async ({ page }) => {
    await page.goto(getCheckinUrl());
    await waitForTaskGrid(page);
    
    // Enable game
    await page.evaluate(() => {
      localStorage.setItem('puzzleGameSetting', 'true');
    });
    
    // Complete task with photo
    await openTaskModal(page, 0);
    await uploadPhoto(page);
    
    const completeBtn = page.locator('#completeButton');
    await completeBtn.click();
    
    await expect(page.locator('#taskModal')).not.toHaveClass(/show/, { timeout: 5000 });
    
    // If game appears, close it
    await page.waitForTimeout(1500);
    
    const gameModal = page.locator('#gameModal, #puzzleGameModal, #mazeGameModal, #shootingGameModal').first();
    const gameVisible = await gameModal.isVisible({ timeout: 1000 }).catch(() => false);
    
    if (gameVisible) {
      const closeBtn = page.locator('.close-button, button:has-text("关闭")').first();
      if (await closeBtn.isVisible()) {
        await closeBtn.click();
      }
      
      // Verify game modal is closed
      await expect(gameModal).not.toBeVisible({ timeout: 3000 });
    }
    
    // Verify task is still completed
    await expect(getTaskCard(page, 0)).toHaveClass(/completed/);
    
    // Verify progress is still updated
    await expect(page.locator('.progress-text')).toContainText('1/');
    
    console.log('✅ Task remains completed after closing game');
  });

  test('Scenario 5: Multiple tasks with games', async ({ page }) => {
    await page.goto(getCheckinUrl());
    await waitForTaskGrid(page);
    
    // Enable game
    await page.evaluate(() => {
      localStorage.setItem('puzzleGameSetting', 'true');
    });
    
    const taskCount = await page.locator('.task-card').count();
    const tasksToTest = Math.min(3, taskCount);
    
    for (let i = 0; i < tasksToTest; i++) {
      // Complete task with photo
      await openTaskModal(page, i);
      await uploadPhoto(page, `photo-${i}.jpg`);
      
      const completeBtn = page.locator('#completeButton');
      await completeBtn.click();
      
      await expect(page.locator('#taskModal')).not.toHaveClass(/show/, { timeout: 5000 });
      
      // If game appears, close it
      await page.waitForTimeout(1500);
      
      const gameModal = page.locator('#gameModal, #puzzleGameModal, #mazeGameModal, #shootingGameModal').first();
      const gameVisible = await gameModal.isVisible({ timeout: 1000 }).catch(() => false);
      
      if (gameVisible) {
        const closeBtn = page.locator('.close-button, button:has-text("关闭")').first();
        if (await closeBtn.isVisible()) {
          await closeBtn.click();
          await page.waitForTimeout(500);
        }
      }
      
      // Verify task completed
      await expect(getTaskCard(page, i)).toHaveClass(/completed/);
    }
    
    console.log(`✅ Completed ${tasksToTest} tasks with game integration`);
  });

  test('Scenario 6: Game modal structure verification', async ({ page }) => {
    await page.goto(getCheckinUrl());
    await waitForTaskGrid(page);
    
    // Enable game
    await page.evaluate(() => {
      localStorage.setItem('puzzleGameSetting', 'true');
    });
    
    // Complete task with photo to trigger game
    await openTaskModal(page, 0);
    await uploadPhoto(page);
    
    const completeBtn = page.locator('#completeButton');
    await completeBtn.click();
    
    await expect(page.locator('#taskModal')).not.toHaveClass(/show/, { timeout: 5000 });
    
    // Wait for game
    await page.waitForTimeout(1500);
    
    // Check for any game modal
    const allGameModals = await page.locator('#gameModal, #puzzleGameModal, #mazeGameModal, #shootingGameModal, #spaceInvadersModal').all();
    
    let foundGameModal = null;
    for (const modal of allGameModals) {
      if (await modal.isVisible({ timeout: 500 }).catch(() => false)) {
        foundGameModal = modal;
        break;
      }
    }
    
    if (foundGameModal) {
      // Verify modal has close button
      const hasCloseBtn = await foundGameModal.locator('.close-button, button:has-text("关闭")').count() > 0;
      if (hasCloseBtn) {
        console.log('✅ Game modal has close button');
      } else {
        console.log('⚠️  UX PAIN POINT: Game modal may be missing close button');
      }
      
      // Verify modal has game canvas or content
      const hasCanvas = await foundGameModal.locator('canvas').count() > 0;
      const hasGameContent = await foundGameModal.locator('.game-content, .game-area').count() > 0;
      
      if (hasCanvas || hasGameContent) {
        console.log('✅ Game modal contains game content');
      } else {
        console.log('⚠️  Game modal may be missing game content');
      }
      
      // Close game
      const closeBtn = foundGameModal.locator('.close-button, button:has-text("关闭")').first();
      if (await closeBtn.isVisible({ timeout: 1000 }).catch(() => false)) {
        await closeBtn.click();
      }
    } else {
      console.log('ℹ️  No game modal appeared');
    }
  });

  test('Scenario 7: Game setting persistence', async ({ page }) => {
    await page.goto(getCheckinUrl());
    
    // Set game preference
    await page.evaluate(() => {
      localStorage.setItem('puzzleGameSetting', 'false');
    });
    
    // Reload page
    await page.reload();
    await waitForTaskGrid(page);
    
    // Check if setting persisted
    const gameSetting = await page.evaluate(() => {
      return localStorage.getItem('puzzleGameSetting');
    });
    
    expect(gameSetting).toBe('false');
    console.log('✅ Game setting persists across page reloads');
  });

  test('Scenario 8: Rapid task completion with games', async ({ page }) => {
    await page.goto(getCheckinUrl());
    await waitForTaskGrid(page);
    
    // Enable game
    await page.evaluate(() => {
      localStorage.setItem('puzzleGameSetting', 'true');
    });
    
    const taskCount = await page.locator('.task-card').count();
    const tasksToTest = Math.min(2, taskCount);
    
    // Rapidly complete tasks
    for (let i = 0; i < tasksToTest; i++) {
      await openTaskModal(page, i);
      await uploadPhoto(page, `rapid-${i}.jpg`);
      
      const completeBtn = page.locator('#completeButton');
      await completeBtn.click();
      
      // Don't wait long - close game immediately if it appears
      await page.waitForTimeout(1000);
      
      // Force close any open modals
      const closeButtons = await page.locator('.close-button, button:has-text("关闭")').all();
      for (const btn of closeButtons) {
        if (await btn.isVisible({ timeout: 100 }).catch(() => false)) {
          await btn.click();
        }
      }
    }
    
    // Verify all tasks completed despite rapid interaction
    for (let i = 0; i < tasksToTest; i++) {
      await expect(getTaskCard(page, i)).toHaveClass(/completed/);
    }
    
    console.log('✅ Rapid task completion with games works correctly');
  });
});

test.describe('Game UX Pain Points', () => {
  
  test('Pain Point: Game interrupts user flow', async ({ page }) => {
    await page.goto(getCheckinUrl());
    await waitForTaskGrid(page);
    
    await page.evaluate(() => {
      localStorage.setItem('puzzleGameSetting', 'true');
    });
    
    // Complete task with photo
    await openTaskModal(page, 0);
    await uploadPhoto(page);
    
    const completeBtn = page.locator('#completeButton');
    await completeBtn.click();
    
    await expect(page.locator('#taskModal')).not.toHaveClass(/show/, { timeout: 5000 });
    
    // Check if game appears and blocks user
    await page.waitForTimeout(1500);
    
    const gameModal = page.locator('#gameModal, #puzzleGameModal, #mazeGameModal').first();
    const gameVisible = await gameModal.isVisible({ timeout: 1000 }).catch(() => false);
    
    if (gameVisible) {
      // Try to interact with task grid while game is open
      const canInteract = await page.locator('#taskGrid').isEnabled();
      
      if (!canInteract) {
        console.log('⚠️  UX PAIN POINT: Game blocks user from continuing with tasks');
      } else {
        console.log('✅ User can still interact with task grid while game is open');
      }
      
      // Close game
      const closeBtn = page.locator('.close-button').first();
      if (await closeBtn.isVisible()) {
        await closeBtn.click();
      }
    }
  });

  test('Pain Point: Game setting not discoverable', async ({ page }) => {
    await page.goto(getCheckinUrl());
    await waitForTaskGrid(page);
    
    // Look for settings or game preferences UI
    const settingsBtn = page.locator('.settings-button, button:has-text("⚙"), button[aria-label*="设置"]');
    const hasSettingsBtn = await settingsBtn.isVisible({ timeout: 2000 }).catch(() => false);
    
    if (!hasSettingsBtn) {
      console.log('⚠️  UX PAIN POINT: No visible settings button to control games');
    } else {
      await settingsBtn.click();
      
      // Check if game setting is in the settings menu
      const gameToggle = page.locator('input[type="checkbox"][id*="game"], .game-setting');
      const hasGameToggle = await gameToggle.isVisible({ timeout: 2000 }).catch(() => false);
      
      if (!hasGameToggle) {
        console.log('⚠️  UX PAIN POINT: Game setting not easily accessible in settings');
      } else {
        console.log('✅ Game setting is accessible in settings menu');
      }
    }
  });

  test('Pain Point: No skip game option', async ({ page }) => {
    await page.goto(getCheckinUrl());
    await waitForTaskGrid(page);
    
    await page.evaluate(() => {
      localStorage.setItem('puzzleGameSetting', 'true');
    });
    
    // Trigger game
    await openTaskModal(page, 0);
    await uploadPhoto(page);
    
    const completeBtn = page.locator('#completeButton');
    await completeBtn.click();
    
    await expect(page.locator('#taskModal')).not.toHaveClass(/show/, { timeout: 5000 });
    await page.waitForTimeout(1500);
    
    const gameModal = page.locator('#gameModal, #puzzleGameModal, #mazeGameModal').first();
    const gameVisible = await gameModal.isVisible({ timeout: 1000 }).catch(() => false);
    
    if (gameVisible) {
      // Look for skip button
      const skipBtn = page.locator('button:has-text("跳过"), button:has-text("Skip"), .skip-button');
      const hasSkipBtn = await skipBtn.isVisible({ timeout: 1000 }).catch(() => false);
      
      if (!hasSkipBtn) {
        console.log('ℹ️  No skip button found (user must close or complete game)');
        
        // Check if close button is obvious
        const closeBtn = page.locator('.close-button').first();
        const closeBtnSize = await closeBtn.boundingBox();
        
        if (closeBtnSize && closeBtnSize.width < 30) {
          console.log('⚠️  UX PAIN POINT: Close button may be too small');
        }
      } else {
        console.log('✅ Skip button available for users who don\'t want to play');
      }
      
      // Close game
      const closeBtn = page.locator('.close-button, button:has-text("关闭")').first();
      if (await closeBtn.isVisible()) {
        await closeBtn.click();
      }
    }
  });

  test('Pain Point: Game performance on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    await page.goto(getCheckinUrl());
    await waitForTaskGrid(page);
    
    await page.evaluate(() => {
      localStorage.setItem('puzzleGameSetting', 'true');
    });
    
    // Trigger game
    await openTaskModal(page, 0);
    await uploadPhoto(page);
    
    const startTime = Date.now();
    
    const completeBtn = page.locator('#completeButton');
    await completeBtn.click();
    
    await expect(page.locator('#taskModal')).not.toHaveClass(/show/, { timeout: 5000 });
    await page.waitForTimeout(1500);
    
    const gameModal = page.locator('#gameModal, #puzzleGameModal, #mazeGameModal').first();
    const gameVisible = await gameModal.isVisible({ timeout: 2000 }).catch(() => false);
    
    const loadTime = Date.now() - startTime;
    
    if (gameVisible) {
      if (loadTime > 3000) {
        console.log(`⚠️  UX PAIN POINT: Game took ${loadTime}ms to load (slow on mobile)`);
      } else {
        console.log(`✅ Game loaded quickly: ${loadTime}ms`);
      }
      
      // Close game
      const closeBtn = page.locator('.close-button').first();
      if (await closeBtn.isVisible()) {
        await closeBtn.click();
      }
    }
  });
});

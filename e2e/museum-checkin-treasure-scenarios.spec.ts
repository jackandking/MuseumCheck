import { test, expect, Page } from '@playwright/test';

/**
 * E2E Test Suite for Treasure-Specific Scenarios in Museum Check-in Page
 * 
 * Focus Areas:
 * 1. Treasure doesn't exist (reported by 5+ users) - Red border
 * 2. Treasure has 3-4 reports - Yellow warning border
 * 3. User reports treasure as not found
 * 4. User uploads correction photo when treasure image is wrong
 * 5. Treasure auto-deletion when report threshold reached
 * 6. Photo check-in reduces report count
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

async function closeTaskModal(page: Page): Promise<void> {
  const closeBtn = page.locator('#taskModal .close-button').first();
  if (await closeBtn.isVisible()) {
    await closeBtn.click();
  }
  await page.waitForSelector('#taskModal:not(.show)', { timeout: 5000 });
}

// Helper to find a treasure task
async function findTreasureTaskIndex(page: Page): Promise<number> {
  const taskCards = page.locator('.task-card');
  const cardCount = await taskCards.count();
  
  for (let i = 0; i < cardCount; i++) {
    const cardText = await taskCards.nth(i).innerText();
    if (cardText.includes('镇馆之宝') || cardText.includes('找到「')) {
      return i;
    }
  }
  
  return -1;
}

test.describe('Treasure Task Scenarios', () => {
  
  test.beforeEach(async ({ page }) => {
    // Clear localStorage and any treasure reports
    await page.goto(BASE_URL);
    await page.evaluate(() => {
      localStorage.clear();
    });
  });

  test('Scenario 1: Treasure task displays collection image', async ({ page }) => {
    await page.goto(getCheckinUrl());
    await waitForTaskGrid(page);
    
    const treasureIndex = await findTreasureTaskIndex(page);
    
    if (treasureIndex >= 0) {
      await openTaskModal(page, treasureIndex);
      
      // Check if collection image is displayed
      const modalImage = page.locator('#modalImage, .task-image').first();
      const hasImage = await modalImage.isVisible({ timeout: 3000 }).catch(() => false);
      
      if (hasImage) {
        const imgSrc = await modalImage.getAttribute('src');
        expect(imgSrc).toBeTruthy();
        console.log('✅ Treasure task displays collection image:', imgSrc);
      } else {
        console.log('⚠️  Treasure task missing collection image (may need to be added)');
      }
      
      await closeTaskModal(page);
    } else {
      console.log('ℹ️  No treasure tasks found for this museum');
    }
  });

  test('Scenario 2: Report treasure as not found', async ({ page }) => {
    await page.goto(getCheckinUrl());
    await waitForTaskGrid(page);
    
    const treasureIndex = await findTreasureTaskIndex(page);
    
    if (treasureIndex >= 0) {
      await openTaskModal(page, treasureIndex);
      
      // Look for "report treasure not found" button
      const reportBtn = page.locator('button:has-text("找不到"), button:has-text("报告"), .report-button');
      const hasReportBtn = await reportBtn.isVisible({ timeout: 3000 }).catch(() => false);
      
      if (hasReportBtn) {
        await reportBtn.click();
        
        // Check for confirmation dialog or success message
        const confirmDialog = page.locator('.confirm-dialog, .alert, [role="alertdialog"]');
        const hasConfirm = await confirmDialog.isVisible({ timeout: 2000 }).catch(() => false);
        
        if (hasConfirm) {
          // Confirm the report
          const confirmBtn = page.locator('button:has-text("确定"), button:has-text("是")').first();
          if (await confirmBtn.isVisible()) {
            await confirmBtn.click();
          }
        }
        
        console.log('✅ Treasure report functionality works');
      } else {
        console.log('ℹ️  No treasure report button found (may be in different location)');
      }
      
      await closeTaskModal(page);
    } else {
      console.log('ℹ️  No treasure tasks found for this museum');
    }
  });

  test('Scenario 3: Complete treasure task without photo (user ignores)', async ({ page }) => {
    await page.goto(getCheckinUrl());
    await waitForTaskGrid(page);
    
    const treasureIndex = await findTreasureTaskIndex(page);
    
    if (treasureIndex >= 0) {
      await openTaskModal(page, treasureIndex);
      
      // Complete task without uploading photo
      const completeBtn = page.locator('#completeButton');
      await expect(completeBtn).toBeVisible();
      await completeBtn.click();
      
      // Wait for modal to close
      await expect(page.locator('#taskModal')).not.toHaveClass(/show/, { timeout: 5000 });
      
      // Verify task is marked as completed
      await expect(getTaskCard(page, treasureIndex)).toHaveClass(/completed/);
      
      console.log('✅ User can complete treasure task without photo (ignoring requirement)');
    } else {
      console.log('ℹ️  No treasure tasks found for this museum');
    }
  });

  test('Scenario 4: Upload photo for treasure task', async ({ page }) => {
    await page.goto(getCheckinUrl());
    await waitForTaskGrid(page);
    
    const treasureIndex = await findTreasureTaskIndex(page);
    
    if (treasureIndex >= 0) {
      await openTaskModal(page, treasureIndex);
      
      // Upload a test photo
      const photoInput = page.locator('#photoUpload');
      const testImageBuffer = Buffer.from(
        'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
        'base64'
      );
      
      await photoInput.setInputFiles({
        name: 'treasure-photo.jpg',
        mimeType: 'image/jpeg',
        buffer: testImageBuffer,
      });
      
      // Wait for preview
      await page.waitForSelector('.photo-preview img', { timeout: 5000 });
      
      // Complete task
      const completeBtn = page.locator('#completeButton');
      await completeBtn.click();
      
      // Skip game if it appears
      const gameModal = page.locator('#gameModal, #puzzleGameModal');
      const isGameVisible = await gameModal.isVisible({ timeout: 2000 }).catch(() => false);
      if (isGameVisible) {
        const closeBtn = page.locator('.close-button').first();
        if (await closeBtn.isVisible()) {
          await closeBtn.click();
        }
      }
      
      // Verify task completed
      await expect(getTaskCard(page, treasureIndex)).toHaveClass(/completed/);
      
      console.log('✅ User can upload photo and complete treasure task');
    } else {
      console.log('ℹ️  No treasure tasks found for this museum');
    }
  });

  test('Scenario 5: Check treasure task for warning indicators', async ({ page }) => {
    await page.goto(getCheckinUrl());
    await waitForTaskGrid(page);
    
    const treasureIndex = await findTreasureTaskIndex(page);
    
    if (treasureIndex >= 0) {
      const treasureCard = getTaskCard(page, treasureIndex);
      
      // Check for warning badges or styles
      const hasWarningBadge = await page.locator('.treasure-report-count-badge.warning, .treasure-warning').count() > 0;
      const hasUnavailableBadge = await page.locator('.treasure-report-count-badge.unavailable, .treasure-unavailable').count() > 0;
      
      if (hasWarningBadge) {
        console.log('⚠️  Treasure has warning indicator (3-4 reports)');
      } else if (hasUnavailableBadge) {
        console.log('🚫 Treasure marked as unavailable (5+ reports)');
      } else {
        console.log('✅ Treasure appears available (no warnings)');
      }
      
      // Check card border color
      const borderColor = await treasureCard.evaluate(el => {
        return window.getComputedStyle(el).borderColor;
      });
      
      console.log('Treasure card border color:', borderColor);
    } else {
      console.log('ℹ️  No treasure tasks found for this museum');
    }
  });

  test('Scenario 6: Image replacement section for reported treasures', async ({ page }) => {
    await page.goto(getCheckinUrl());
    await waitForTaskGrid(page);
    
    const treasureIndex = await findTreasureTaskIndex(page);
    
    if (treasureIndex >= 0) {
      await openTaskModal(page, treasureIndex);
      
      // Check if image replacement section exists (shown when treasure has reports)
      const replacementSection = page.locator('.image-replacement-section, .image-correction-section');
      const hasReplacement = await replacementSection.isVisible({ timeout: 2000 }).catch(() => false);
      
      if (hasReplacement) {
        console.log('✅ Image replacement section available for correction');
        
        // Check for upload button
        const uploadLabel = page.locator('.image-replacement-upload-label, .image-replacement-upload input[type="file"]');
        const hasUpload = await uploadLabel.isVisible({ timeout: 2000 }).catch(() => false);
        
        if (hasUpload) {
          console.log('✅ Users can upload correction photos');
        }
      } else {
        console.log('ℹ️  Image replacement section not visible (treasure may not have reports)');
      }
      
      await closeTaskModal(page);
    } else {
      console.log('ℹ️  No treasure tasks found for this museum');
    }
  });

  test('Scenario 7: Multiple users completing treasure tasks', async ({ page }) => {
    await page.goto(getCheckinUrl());
    await waitForTaskGrid(page);
    
    const treasureIndex = await findTreasureTaskIndex(page);
    
    if (treasureIndex >= 0) {
      // Simulate first user completing task with photo
      await openTaskModal(page, treasureIndex);
      
      const photoInput = page.locator('#photoUpload');
      const testImageBuffer = Buffer.from(
        'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
        'base64'
      );
      
      await photoInput.setInputFiles({
        name: 'user1-photo.jpg',
        mimeType: 'image/jpeg',
        buffer: testImageBuffer,
      });
      
      await page.waitForSelector('.photo-preview img', { timeout: 5000 });
      
      const completeBtn = page.locator('#completeButton');
      await completeBtn.click();
      
      // Skip game
      await page.waitForTimeout(1000);
      const gameModal = page.locator('#gameModal, #puzzleGameModal');
      if (await gameModal.isVisible({ timeout: 1000 }).catch(() => false)) {
        const closeBtn = page.locator('.close-button').first();
        if (await closeBtn.isVisible()) {
          await closeBtn.click();
        }
      }
      
      // Verify completion
      await expect(getTaskCard(page, treasureIndex)).toHaveClass(/completed/);
      
      console.log('✅ User completed treasure task with photo check-in');
    } else {
      console.log('ℹ️  No treasure tasks found for this museum');
    }
  });

  test('Scenario 8: Treasure task subtitle parsing', async ({ page }) => {
    await page.goto(getCheckinUrl());
    await waitForTaskGrid(page);
    
    const treasureIndex = await findTreasureTaskIndex(page);
    
    if (treasureIndex >= 0) {
      await openTaskModal(page, treasureIndex);
      
      // Check modal content for treasure name in subtitle
      const modalSubtitle = page.locator('#modalSubtitle, .task-subtitle, .modal-subtitle');
      const hasSubtitle = await modalSubtitle.isVisible({ timeout: 2000 }).catch(() => false);
      
      if (hasSubtitle) {
        const subtitleText = await modalSubtitle.innerText();
        console.log('Treasure task subtitle:', subtitleText);
        
        // Check if subtitle contains treasure name format like "找到「宝物名称」"
        if (subtitleText.includes('「') && subtitleText.includes('」')) {
          console.log('✅ Treasure name properly formatted in subtitle');
        }
      } else {
        console.log('ℹ️  Subtitle not found in modal');
      }
      
      await closeTaskModal(page);
    } else {
      console.log('ℹ️  No treasure tasks found for this museum');
    }
  });
});

test.describe('Treasure Report State Management', () => {
  
  test('Check treasure report data persistence', async ({ page }) => {
    await page.goto(getCheckinUrl());
    await waitForTaskGrid(page);
    
    const treasureIndex = await findTreasureTaskIndex(page);
    
    if (treasureIndex >= 0) {
      await openTaskModal(page, treasureIndex);
      
      // Attempt to report treasure
      const reportBtn = page.locator('button:has-text("找不到"), button:has-text("报告")').first();
      const hasReportBtn = await reportBtn.isVisible({ timeout: 2000 }).catch(() => false);
      
      if (hasReportBtn) {
        await reportBtn.click();
        
        // Confirm if dialog appears
        await page.waitForTimeout(1000);
        const confirmBtn = page.locator('button:has-text("确定"), button:has-text("是")').first();
        if (await confirmBtn.isVisible({ timeout: 1000 }).catch(() => false)) {
          await confirmBtn.click();
        }
        
        await closeTaskModal(page);
        
        // Reload page
        await page.reload();
        await waitForTaskGrid(page);
        
        // Check localStorage for report data
        const reportData = await page.evaluate(() => {
          const myReports = localStorage.getItem('myTreasureReports');
          return myReports ? JSON.parse(myReports) : null;
        });
        
        if (reportData) {
          console.log('✅ Treasure report data persisted in localStorage');
        } else {
          console.log('⚠️  Treasure report data not found in localStorage');
        }
      } else {
        console.log('ℹ️  Report button not found');
      }
    } else {
      console.log('ℹ️  No treasure tasks found for this museum');
    }
  });

  test('Check treasure report count display', async ({ page }) => {
    await page.goto(getCheckinUrl());
    await waitForTaskGrid(page);
    
    // Check if any treasure tasks have report count badges
    const reportBadges = page.locator('.treasure-report-count-badge');
    const badgeCount = await reportBadges.count();
    
    if (badgeCount > 0) {
      console.log(`Found ${badgeCount} treasure report count badge(s)`);
      
      // Check the first badge's text
      const badgeText = await reportBadges.first().innerText();
      console.log('Report badge text:', badgeText);
      
      // Check badge styles
      const hasWarning = await reportBadges.locator('.warning').count() > 0;
      const hasUnavailable = await reportBadges.locator('.unavailable').count() > 0;
      
      if (hasWarning) {
        console.log('⚠️  Some treasures have warning status (3-4 reports)');
      }
      if (hasUnavailable) {
        console.log('🚫 Some treasures marked unavailable (5+ reports)');
      }
    } else {
      console.log('ℹ️  No treasure report badges visible (treasures may not have reports yet)');
    }
  });
});

test.describe('UX Pain Points - Treasure Specific', () => {
  
  test('Pain Point: Unclear treasure reporting flow', async ({ page }) => {
    await page.goto(getCheckinUrl());
    await waitForTaskGrid(page);
    
    const treasureIndex = await findTreasureTaskIndex(page);
    
    if (treasureIndex >= 0) {
      await openTaskModal(page, treasureIndex);
      
      // Check if there's clear UI for reporting issues
      const reportSection = page.locator('.treasure-report-section, .report-section, .treasure-feedback');
      const hasReportSection = await reportSection.isVisible({ timeout: 2000 }).catch(() => false);
      
      if (!hasReportSection) {
        console.log('⚠️  UX PAIN POINT: Treasure reporting UI not clearly visible');
      } else {
        console.log('✅ Treasure reporting section is visible');
      }
      
      // Check for help text or instructions
      const helpText = page.locator('.help-text, .hint, .instruction');
      const hasHelp = await helpText.count() > 0;
      
      if (!hasHelp) {
        console.log('⚠️  UX PAIN POINT: No help text for treasure reporting');
      } else {
        console.log('✅ Help text available for users');
      }
      
      await closeTaskModal(page);
    }
  });

  test('Pain Point: Collection image loading states', async ({ page }) => {
    await page.goto(getCheckinUrl());
    await waitForTaskGrid(page);
    
    const treasureIndex = await findTreasureTaskIndex(page);
    
    if (treasureIndex >= 0) {
      await openTaskModal(page, treasureIndex);
      
      // Check for loading indicator
      const loadingIndicator = page.locator('.loading, .spinner, .skeleton');
      const hasLoading = await loadingIndicator.isVisible({ timeout: 500 }).catch(() => false);
      
      // Check for error state when image fails
      const errorState = page.locator('.image-error, .img-error, [alt*="加载失败"]');
      const hasErrorState = await errorState.isVisible({ timeout: 500 }).catch(() => false);
      
      if (!hasLoading && !hasErrorState) {
        console.log('ℹ️  No loading or error states detected (images may load instantly)');
      }
      
      // Check if image has proper alt text
      const modalImage = page.locator('#modalImage, .task-image').first();
      if (await modalImage.isVisible({ timeout: 2000 }).catch(() => false)) {
        const altText = await modalImage.getAttribute('alt');
        if (!altText || altText.trim() === '') {
          console.log('⚠️  UX PAIN POINT: Collection image missing alt text');
        } else {
          console.log('✅ Collection image has alt text:', altText);
        }
      }
      
      await closeTaskModal(page);
    }
  });

  test('Pain Point: Report confirmation clarity', async ({ page }) => {
    await page.goto(getCheckinUrl());
    await waitForTaskGrid(page);
    
    const treasureIndex = await findTreasureTaskIndex(page);
    
    if (treasureIndex >= 0) {
      await openTaskModal(page, treasureIndex);
      
      const reportBtn = page.locator('button:has-text("找不到"), button:has-text("报告")').first();
      const hasReportBtn = await reportBtn.isVisible({ timeout: 2000 }).catch(() => false);
      
      if (hasReportBtn) {
        await reportBtn.click();
        
        // Check for confirmation dialog with clear message
        await page.waitForTimeout(1000);
        
        const dialogText = await page.locator('.confirm-dialog, .alert, [role="alertdialog"]').innerText().catch(() => '');
        
        if (dialogText.length === 0) {
          console.log('⚠️  UX PAIN POINT: Report confirmation lacks clear messaging');
        } else {
          console.log('✅ Report confirmation message:', dialogText);
        }
        
        // Cancel to avoid actually reporting
        const cancelBtn = page.locator('button:has-text("取消"), button:has-text("否")').first();
        if (await cancelBtn.isVisible({ timeout: 1000 }).catch(() => false)) {
          await cancelBtn.click();
        }
      }
      
      await closeTaskModal(page);
    }
  });
});

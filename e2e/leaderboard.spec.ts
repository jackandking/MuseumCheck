/**
 * E2E Test for Leaderboard Page
 * 
 * Tests the leaderboard functionality including:
 * - Page loading and initialization
 * - Tab switching between rankings (visits/pet)
 * - Data display and rendering
 * - User stats display
 * - Refresh functionality
 * - Empty state handling
 * - Responsive design
 */

import { test, expect } from '@playwright/test';

test.describe('Leaderboard Page', () => {
    test.beforeEach(async ({ page }) => {
        // Navigate to leaderboard page
        await page.goto('/leaderboard.html');
        
        // Wait for page to be ready
        await page.waitForLoadState('networkidle');
    });

    test('should load leaderboard page successfully', async ({ page }) => {
        // Check page title
        await expect(page).toHaveTitle(/排行榜/);
        
        // Check main header
        const header = page.locator('.page-title');
        await expect(header).toBeVisible();
        await expect(header).toContainText('排行榜');
        
        // Check trophy icon
        const trophy = page.locator('.trophy-icon');
        await expect(trophy).toBeVisible();
        await expect(trophy).toContainText('🏆');
    });

    test('should display ranking tabs correctly', async ({ page }) => {
        // Check both tabs exist
        const visitsTab = page.locator('[data-ranking-type="visits"]');
        const petTab = page.locator('[data-ranking-type="pet"]');
        
        await expect(visitsTab).toBeVisible();
        await expect(petTab).toBeVisible();
        
        // Check visits tab is active by default
        await expect(visitsTab).toHaveClass(/active/);
        await expect(petTab).not.toHaveClass(/active/);
        
        // Check tab labels
        await expect(visitsTab).toContainText('博物馆');
        await expect(petTab).toContainText('宠物');
    });

    test('should switch tabs when clicked', async ({ page }) => {
        const visitsTab = page.locator('[data-ranking-type="visits"]');
        const petTab = page.locator('[data-ranking-type="pet"]');
        
        // Initially visits tab should be active
        await expect(visitsTab).toHaveClass(/active/);
        
        // Click pet tab
        await petTab.click();
        
        // Wait for tab switch animation
        await page.waitForTimeout(500);
        
        // Pet tab should now be active
        await expect(petTab).toHaveClass(/active/);
        await expect(visitsTab).not.toHaveClass(/active/);
        
        // Check intro text changed
        const introTitle = page.locator('.intro-title');
        await expect(introTitle).toContainText('宠物');
        
        // Switch back to visits
        await visitsTab.click();
        await page.waitForTimeout(500);
        
        // Visits tab should be active again
        await expect(visitsTab).toHaveClass(/active/);
        await expect(introTitle).toContainText('博物馆');
    });

    test('should display user stats card', async ({ page }) => {
        const statsCard = page.locator('#userStatsCard');
        await expect(statsCard).toBeVisible();
        
        // Check avatar
        const avatar = page.locator('.avatar-placeholder');
        await expect(avatar).toBeVisible();
        await expect(avatar).toContainText('👤');
        
        // Check user rank section
        const rankSection = page.locator('#myRank');
        await expect(rankSection).toBeVisible();
        
        // Check score section
        const scoreSection = page.locator('#myScore');
        await expect(scoreSection).toBeVisible();
        
        // Check score label for visits tab
        const scoreLabel = page.locator('#scoreLabel');
        await expect(scoreLabel).toBeVisible();
        await expect(scoreLabel).toContainText('参观数量');
    });

    test('should display user stats with actual data, not empty dashes', async ({ page }) => {
        // Wait for data to load
        await page.waitForTimeout(2000);
        
        const myRank = page.locator('#myRank');
        const myScore = page.locator('#myScore');
        
        // Get the text content
        const rankText = await myRank.textContent();
        const scoreText = await myScore.textContent();
        
        // Validate that user stats show actual data
        // The rank should either show a number (like "第 15 名") or "未上榜"
        // It should NOT show "第 - 名" which indicates missing data
        expect(rankText).toBeTruthy();
        
        // BUG: This test will fail because current implementation shows "第 - 名"
        // Expected: Should show either "第 X 名" (with a number) or "未上榜"
        // Actual: Shows "第 - 名" (dash indicates missing/empty data)
        const hasValidRank = rankText?.includes('未上榜') || 
                            (rankText?.includes('第') && 
                             rankText?.includes('名') && 
                             !rankText?.includes('-'));
        
        // Log the actual values for debugging
        console.log('[Test] Rank text:', rankText);
        console.log('[Test] Score text:', scoreText);
        console.log('[Test] Has valid rank:', hasValidRank);
        
        // This assertion will catch the bug where rank shows "第 - 名"
        expect(hasValidRank).toBe(true);
        
        // Score should also not be just "-"
        // It should be either a number or "未上榜" state should be clear
        if (rankText?.includes('未上榜')) {
            // If not ranked, score being "-" is acceptable
            expect(scoreText).toBe('-');
        } else {
            // If ranked, score should be a valid number, not "-"
            expect(scoreText).not.toBe('-');
            expect(scoreText).toMatch(/\d+/); // Should contain at least one digit
        }
    });

    test('should update score label when switching tabs', async ({ page }) => {
        const scoreLabel = page.locator('#scoreLabel');
        const petTab = page.locator('[data-ranking-type="pet"]');
        
        // Initially should show visits label
        await expect(scoreLabel).toContainText('参观数量');
        
        // Switch to pet tab
        await petTab.click();
        await page.waitForTimeout(500);
        
        // Should now show pet level label
        await expect(scoreLabel).toContainText('宠物等级');
    });

    test('should display leaderboard list section', async ({ page }) => {
        const listSection = page.locator('.leaderboard-list-section');
        await expect(listSection).toBeVisible();
        
        // Check list header
        const listTitle = page.locator('.list-title');
        await expect(listTitle).toBeVisible();
        await expect(listTitle).toContainText('排行榜');
        
        // Check last update timestamp
        const lastUpdate = page.locator('#lastUpdate');
        await expect(lastUpdate).toBeVisible();
    });

    test('should handle loading state', async ({ page }) => {
        // Reload page to catch loading state
        await page.reload();
        
        // Loading state should be visible initially
        const loadingState = page.locator('#loadingState');
        const isLoadingVisible = await loadingState.isVisible().catch(() => false);
        
        // Either loading is visible or data loaded too fast
        if (isLoadingVisible) {
            await expect(loadingState).toBeVisible();
            
            // Check loading spinner
            const spinner = page.locator('.loading-spinner');
            await expect(spinner).toBeVisible();
            
            // Wait for loading to complete
            await expect(loadingState).toBeHidden({ timeout: 5000 });
        }
        
        // After loading, leaderboard list should be visible
        const leaderboardList = page.locator('#leaderboardList');
        await expect(leaderboardList).toBeVisible();
    });

    test('should display leaderboard items or empty state', async ({ page }) => {
        // Wait for data to load
        await page.waitForTimeout(2000);
        
        const leaderboardList = page.locator('#leaderboardList');
        const emptyState = page.locator('#emptyState');
        
        // Either leaderboard has items or empty state is shown
        const hasItems = await leaderboardList.locator('.leaderboard-item').count() > 0;
        const isEmptyVisible = await emptyState.isVisible();
        
        if (hasItems) {
            // Check items are displayed
            expect(hasItems).toBe(true);
            
            // Check first item has required elements
            const firstItem = leaderboardList.locator('.leaderboard-item').first();
            await expect(firstItem).toBeVisible();
            
            // Should have rank indicator (rank-medal class)
            const rankBadge = firstItem.locator('.rank-medal');
            await expect(rankBadge).toBeVisible();
        } else if (isEmptyVisible) {
            // Check empty state is displayed correctly
            await expect(emptyState).toBeVisible();
            
            // Check empty icon
            const emptyIcon = emptyState.locator('.empty-icon');
            await expect(emptyIcon).toBeVisible();
            
            // Check empty title
            const emptyTitle = emptyState.locator('.empty-title');
            await expect(emptyTitle).toBeVisible();
        }
    });

    test('should have working refresh button', async ({ page }) => {
        const refreshBtn = page.locator('.refresh-btn');
        await expect(refreshBtn).toBeVisible();
        
        // Check refresh icon
        const refreshIcon = page.locator('.refresh-icon');
        await expect(refreshIcon).toBeVisible();
        await expect(refreshIcon).toContainText('🔄');
        
        // Click refresh button
        await refreshBtn.click();
        
        // Wait for refresh to complete
        await page.waitForTimeout(1000);
        
        // Page should still be functional
        const header = page.locator('.page-title');
        await expect(header).toBeVisible();
    });

    test('should have working back button', async ({ page }) => {
        const backBtn = page.locator('.back-btn');
        await expect(backBtn).toBeVisible();
        
        // Check back button text
        await expect(backBtn).toContainText('返回');
        
        // Check back icon
        const backIcon = page.locator('.back-icon');
        await expect(backIcon).toBeVisible();
        await expect(backIcon).toContainText('←');
    });

    test('should display footer with navigation links', async ({ page }) => {
        const footer = page.locator('.page-footer');
        await expect(footer).toBeVisible();
        
        // Check footer links
        const homeLink = page.locator('.footer-link[href="index.html"]');
        await expect(homeLink).toBeVisible();
        await expect(homeLink).toContainText('首页');
        
        const checkinLink = page.locator('.footer-link[href="museum-checkin.html"]');
        await expect(checkinLink).toBeVisible();
        await expect(checkinLink).toContainText('打卡');
        
        const achievementsLink = page.locator('.footer-link[href="achievements.html"]');
        await expect(achievementsLink).toBeVisible();
        await expect(achievementsLink).toContainText('成就');
    });

    test('should be responsive on mobile viewport', async ({ page }) => {
        // Set mobile viewport
        await page.setViewportSize({ width: 375, height: 667 });
        
        // Page should still be visible and functional
        const header = page.locator('.page-title');
        await expect(header).toBeVisible();
        
        // Tabs should be visible
        const visitsTab = page.locator('[data-ranking-type="visits"]');
        await expect(visitsTab).toBeVisible();
        
        // User stats card should be visible
        const statsCard = page.locator('#userStatsCard');
        await expect(statsCard).toBeVisible();
        
        // List should be visible
        const listSection = page.locator('.leaderboard-list-section');
        await expect(listSection).toBeVisible();
    });

    test('should be responsive on tablet viewport', async ({ page }) => {
        // Set tablet viewport
        await page.setViewportSize({ width: 768, height: 1024 });
        
        // All major sections should be visible
        const header = page.locator('.page-title');
        await expect(header).toBeVisible();
        
        const tabs = page.locator('.leaderboard-tabs');
        await expect(tabs).toBeVisible();
        
        const statsCard = page.locator('#userStatsCard');
        await expect(statsCard).toBeVisible();
        
        const listSection = page.locator('.leaderboard-list-section');
        await expect(listSection).toBeVisible();
    });

    test('should load required JavaScript files', async ({ page }) => {
        // Check that required scripts are loaded
        const scripts = await page.evaluate(() => {
            return {
                hasLeaderboardPage: typeof window.LeaderboardPage !== 'undefined',
                hasEventWallService: typeof window.EventWallService !== 'undefined'
            };
        });
        
        // LeaderboardPage should be available
        expect(scripts.hasLeaderboardPage).toBe(true);
    });

    test('should have proper styling for rank badges', async ({ page }) => {
        // Wait for data to load
        await page.waitForTimeout(2000);
        
        const leaderboardList = page.locator('#leaderboardList');
        const itemCount = await leaderboardList.locator('.leaderboard-item').count();
        
        if (itemCount > 0) {
            // Check that top 3 items have special styling or medals
            const firstItem = leaderboardList.locator('.leaderboard-item').first();
            const rankBadge = firstItem.locator('.rank-medal');
            
            // Rank medal should be visible
            await expect(rankBadge).toBeVisible();
            
            // Top 3 might have medal emoji (🥇, 🥈, 🥉)
            const badgeText = await rankBadge.textContent();
            const hasMedal = badgeText && (
                badgeText.includes('🥇') || 
                badgeText.includes('🥈') || 
                badgeText.includes('🥉') ||
                badgeText.includes('1') ||
                badgeText.includes('2') ||
                badgeText.includes('3')
            );
            expect(hasMedal).toBe(true);
        }
    });

    test('should handle tab switching with keyboard', async ({ page }) => {
        const visitsTab = page.locator('[data-ranking-type="visits"]');
        const petTab = page.locator('[data-ranking-type="pet"]');
        
        // Focus on pet tab
        await petTab.focus();
        
        // Press Enter to activate
        await page.keyboard.press('Enter');
        
        // Wait for tab switch
        await page.waitForTimeout(500);
        
        // Pet tab should be active
        await expect(petTab).toHaveClass(/active/);
    });

    test('should persist state when navigating back', async ({ page }) => {
        // Switch to pet tab
        const petTab = page.locator('[data-ranking-type="pet"]');
        await petTab.click();
        await page.waitForTimeout(500);
        
        // Navigate to home page
        await page.goto('/index.html');
        await page.waitForLoadState('networkidle');
        
        // Navigate back to leaderboard
        await page.goto('/leaderboard.html');
        await page.waitForLoadState('networkidle');
        
        // Page should load with default visits tab (not persist previous state)
        const visitsTab = page.locator('[data-ranking-type="visits"]');
        await expect(visitsTab).toHaveClass(/active/);
    });

    test('should handle rapid tab switching', async ({ page }) => {
        const visitsTab = page.locator('[data-ranking-type="visits"]');
        const petTab = page.locator('[data-ranking-type="pet"]');
        
        // Rapidly switch tabs
        await petTab.click();
        await page.waitForTimeout(100);
        await visitsTab.click();
        await page.waitForTimeout(100);
        await petTab.click();
        await page.waitForTimeout(100);
        await visitsTab.click();
        
        // Wait for animations to settle
        await page.waitForTimeout(1000);
        
        // Page should still be functional
        await expect(visitsTab).toHaveClass(/active/);
        const header = page.locator('.page-title');
        await expect(header).toBeVisible();
    });

    test('should have proper meta tags for SEO', async ({ page }) => {
        // Check page has proper meta tags
        const description = await page.locator('meta[name="description"]').getAttribute('content');
        expect(description).toContain('排行榜');
        
        const ogTitle = await page.locator('meta[property="og:title"]').getAttribute('content');
        expect(ogTitle).toContain('排行榜');
    });

    test('should load CSS files correctly', async ({ page }) => {
        // Check that leaderboard CSS is loaded
        const hasLeaderboardCSS = await page.evaluate(() => {
            const stylesheets = Array.from(document.styleSheets);
            return stylesheets.some(sheet => {
                try {
                    return sheet.href && sheet.href.includes('leaderboard.css');
                } catch {
                    return false;
                }
            });
        });
        
        expect(hasLeaderboardCSS).toBe(true);
    });
});

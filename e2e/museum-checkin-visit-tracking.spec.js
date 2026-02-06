/**
 * E2E Test: Museum Check-in Page Visit Tracking
 * 
 * This test verifies that:
 * When a museum check-in page is visited, it records "xxx访问了xxx博物馆" to the event wall
 * 
 * Addresses Issue: 事件墙记录博物馆访问
 */

const { test, expect } = require('@playwright/test');

test.describe('Museum Check-in Page Visit Tracking', () => {
    
    test('should track museum visit when check-in page loads', async ({ page }) => {
        // Navigate to a specific museum check-in page (故宫博物院)
        await page.goto('/museum-checkin.html?id=forbidden-city&age=7-12');
        await page.waitForLoadState('domcontentloaded');
        
        // Wait for museum data to load and page to initialize
        await page.waitForTimeout(2000);
        
        // Check if EventWallService is available
        const hasEventWallService = await page.evaluate(() => {
            return (window.eventWallService && 
                   typeof window.eventWallService.recordEvent === 'function');
        });
        expect(hasEventWallService).toBeTruthy();
        
        // Track all events by intercepting recordEvent calls
        await page.evaluate(() => {
            window.testEvents = [];
            if (window.eventWallService) {
                const originalRecordEvent = window.eventWallService.recordEvent;
                window.eventWallService.recordEvent = function(eventType, title, description, parameters) {
                    window.testEvents.push({ eventType, title, description, parameters });
                    return originalRecordEvent.call(this, eventType, title, description, parameters);
                };
            }
        });
        
        // Trigger tracking by reloading the page (simulating a fresh visit)
        await page.reload();
        await page.waitForLoadState('domcontentloaded');
        await page.waitForTimeout(2000);
        
        // Check if visit event was recorded
        const visitEvents = await page.evaluate(() => {
            return window.testEvents ? window.testEvents.filter(e => e.eventType === 'visit') : [];
        });
        
        // Verify the event was recorded
        expect(visitEvents.length).toBeGreaterThan(0);
        const visitEvent = visitEvents[0];
        expect(visitEvent.title).toBe('参观博物馆');
        expect(visitEvent.description).toBe('故宫博物院');
        expect(visitEvent.parameters.museumId).toBe('forbidden-city');
        expect(visitEvent.parameters.museumName).toBe('故宫博物院');
    });
    
    test('should track visit for different museums', async ({ page }) => {
        // Test with a different museum (中国国家博物馆)
        await page.goto('/museum-checkin.html?id=national-museum&age=7-12');
        await page.waitForLoadState('domcontentloaded');
        await page.waitForTimeout(2000);
        
        // Track events
        await page.evaluate(() => {
            window.testEvents = [];
            if (window.eventWallService) {
                const originalRecordEvent = window.eventWallService.recordEvent;
                window.eventWallService.recordEvent = function(eventType, title, description, parameters) {
                    window.testEvents.push({ eventType, title, description, parameters });
                    return originalRecordEvent.call(this, eventType, title, description, parameters);
                };
            }
        });
        
        // Reload to trigger tracking
        await page.reload();
        await page.waitForLoadState('domcontentloaded');
        await page.waitForTimeout(2000);
        
        // Verify event for national museum
        const visitEvents = await page.evaluate(() => {
            return window.testEvents ? window.testEvents.filter(e => e.eventType === 'visit') : [];
        });
        
        expect(visitEvents.length).toBeGreaterThan(0);
        const visitEvent = visitEvents[0];
        expect(visitEvent.title).toBe('参观博物馆');
        expect(visitEvent.description).toBe('中国国家博物馆');
        expect(visitEvent.parameters.museumId).toBe('national-museum');
        expect(visitEvent.parameters.museumName).toBe('中国国家博物馆');
    });
    
    test('should track visit on mobile devices', async ({ page }) => {
        // Set mobile viewport (iPhone 12)
        await page.setViewportSize({ width: 390, height: 844 });
        
        // Navigate to museum check-in page
        await page.goto('/museum-checkin.html?id=shanghai-museum&age=7-12');
        await page.waitForLoadState('domcontentloaded');
        await page.waitForTimeout(2000);
        
        // Check EventWallService on mobile
        const hasEventWallService = await page.evaluate(() => {
            return (window.eventWallService && 
                   typeof window.eventWallService.recordEvent === 'function');
        });
        expect(hasEventWallService).toBeTruthy();
        
        // Track events
        await page.evaluate(() => {
            window.testEvents = [];
            if (window.eventWallService) {
                const originalRecordEvent = window.eventWallService.recordEvent;
                window.eventWallService.recordEvent = function(eventType, title, description, parameters) {
                    window.testEvents.push({ eventType, title, description, parameters });
                    return originalRecordEvent.call(this, eventType, title, description, parameters);
                };
            }
        });
        
        // Reload to trigger tracking on mobile
        await page.reload();
        await page.waitForLoadState('domcontentloaded');
        await page.waitForTimeout(2000);
        
        // Verify event was tracked on mobile
        const visitEvents = await page.evaluate(() => {
            return window.testEvents ? window.testEvents.filter(e => e.eventType === 'visit') : [];
        });
        
        expect(visitEvents.length).toBeGreaterThan(0);
        const visitEvent = visitEvents[0];
        expect(visitEvent.title).toBe('参观博物馆');
        expect(visitEvent.description).toBe('上海博物馆');
        expect(visitEvent.parameters.museumId).toBe('shanghai-museum');
        expect(visitEvent.parameters.museumName).toBe('上海博物馆');
    });
    
    test('should only track visit once per page load', async ({ page }) => {
        // Navigate to check-in page
        await page.goto('/museum-checkin.html?id=forbidden-city&age=7-12');
        await page.waitForLoadState('domcontentloaded');
        
        // Track events from the start
        await page.evaluate(() => {
            window.testEvents = [];
            if (window.eventWallService) {
                const originalRecordEvent = window.eventWallService.recordEvent;
                window.eventWallService.recordEvent = function(eventType, title, description, parameters) {
                    window.testEvents.push({ eventType, title, description, parameters });
                    return originalRecordEvent.call(this, eventType, title, description, parameters);
                };
            }
        });
        
        // Wait for initialization
        await page.waitForTimeout(3000);
        
        // Get visit events
        const visitEvents = await page.evaluate(() => {
            return window.testEvents ? window.testEvents.filter(e => e.eventType === 'visit') : [];
        });
        
        // Should have exactly one visit event (not duplicates)
        expect(visitEvents.length).toBe(1);
    });
});

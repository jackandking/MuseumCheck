/**
 * Google Analytics Tracking Tests
 * 
 * Regression tests for Issue #1112:
 * "漏了很多。目前只有主页访问的事件被记录。博物馆访问，搜索，页面访问都没有记录"
 * 
 * Tests verify that all user interactions are properly tracked to Google Analytics:
 * 1. Page view tracking - when user loads the page
 * 2. Museum visit tracking - when user opens museum modal
 * 3. Search tracking - when user searches for museums
 */

const fs = require('fs');
const path = require('path');

describe('Google Analytics Tracking - Issue #1112', () => {
    let scriptContent;
    
    beforeAll(() => {
        // Read the script.js file to verify tracking code exists
        const scriptPath = path.join(__dirname, '../js/script.js');
        scriptContent = fs.readFileSync(scriptPath, 'utf8');
    });

    describe('Page View Tracking', () => {
        test('should have trackEvent call for page views in init() method', () => {
            // Check that init() method contains page view tracking
            const hasPageViewTracking = scriptContent.includes("this.trackEvent('page_view'");
            expect(hasPageViewTracking).toBe(true);
        });

        test('should track page_name parameter', () => {
            // Verify page_name is included in tracking parameters
            const pageViewSection = scriptContent.match(/this\.trackEvent\('page_view',\s*\{[^}]+\}/s);
            expect(pageViewSection).toBeTruthy();
            expect(pageViewSection[0]).toContain('page_name:');
        });

        test('should track page_location parameter', () => {
            // Verify page_location (URL) is tracked
            const pageViewSection = scriptContent.match(/this\.trackEvent\('page_view',\s*\{[^}]+\}/s);
            expect(pageViewSection).toBeTruthy();
            expect(pageViewSection[0]).toContain('page_location:');
        });

        test('should track page_path parameter', () => {
            // Verify page_path is tracked in the page view call
            const hasPagePath = scriptContent.includes("page_path: window.location.pathname");
            expect(hasPagePath).toBe(true);
        });

        test('should call getPageName() to map file names to Chinese names', () => {
            // Verify getPageName() is used for page name mapping
            const hasGetPageName = scriptContent.includes('getPageName()');
            expect(hasGetPageName).toBe(true);
        });
    });

    describe('Museum Visit Tracking', () => {
        test('should have trackEvent call for museum modal opened', () => {
            // Check that openMuseumModal contains museum tracking
            const hasMuseumTracking = scriptContent.includes("this.trackEvent('museum_modal_opened'");
            expect(hasMuseumTracking).toBe(true);
        });

        test('should track museum_id parameter', () => {
            // Verify museum_id is tracked
            const museumTrackingSection = scriptContent.match(/this\.trackEvent\('museum_modal_opened',\s*\{[^}]+\}/s);
            expect(museumTrackingSection).toBeTruthy();
            expect(museumTrackingSection[0]).toContain('museum_id');
        });

        test('should track museum_name parameter', () => {
            // Verify museum_name is tracked
            const museumTrackingSection = scriptContent.match(/this\.trackEvent\('museum_modal_opened',\s*\{[^}]+\}/s);
            expect(museumTrackingSection).toBeTruthy();
            expect(museumTrackingSection[0]).toContain('museum_name');
        });

        test('should track age_group parameter', () => {
            // Verify age_group is tracked for museum visits
            const museumTrackingSection = scriptContent.match(/this\.trackEvent\('museum_modal_opened',\s*\{[^}]+\}/s);
            expect(museumTrackingSection).toBeTruthy();
            expect(museumTrackingSection[0]).toContain('age_group');
        });
    });

    describe('Search Tracking', () => {
        test('should have trackEvent call for search performed', () => {
            // Check that search functionality contains tracking
            const hasSearchTracking = scriptContent.includes("app.trackEvent('search_performed'");
            expect(hasSearchTracking).toBe(true);
        });

        test('should track query_length parameter', () => {
            // Verify query_length is tracked
            const searchTrackingSection = scriptContent.match(/app\.trackEvent\('search_performed',\s*\{[^}]+\}/s);
            expect(searchTrackingSection).toBeTruthy();
            expect(searchTrackingSection[0]).toContain('query_length');
        });

        test('should track results_count parameter', () => {
            // Verify results_count is tracked
            const searchTrackingSection = scriptContent.match(/app\.trackEvent\('search_performed',\s*\{[^}]+\}/s);
            expect(searchTrackingSection).toBeTruthy();
            expect(searchTrackingSection[0]).toContain('results_count');
        });

        test('should only track searches with 2+ characters', () => {
            // Verify tracking is conditional on query length >= 2
            const searchHandlerSection = scriptContent.match(/if \(query\.length >= 2\)[\s\S]*?app\.trackEvent\('search_performed'/);
            expect(searchHandlerSection).toBeTruthy();
        });
    });

    describe('Analytics Manager Integration', () => {
        test('should have trackEvent method that calls gtag', () => {
            // Verify trackEvent method exists and calls gtag
            const hasTrackEventMethod = scriptContent.includes('trackEvent(eventName, parameters = {})');
            expect(hasTrackEventMethod).toBe(true);
            
            // Check that it calls gtag when available
            const callsGtag = scriptContent.includes("gtag('event', eventName");
            expect(callsGtag).toBe(true);
        });

        test('should have AnalyticsManager class', () => {
            // Verify AnalyticsManager exists
            const hasAnalyticsManager = scriptContent.includes('class AnalyticsManager');
            expect(hasAnalyticsManager).toBe(true);
        });

        test('should check for Google Analytics availability', () => {
            // Verify gtag availability check
            const checksGtag = scriptContent.includes('typeof gtag');
            expect(checksGtag).toBe(true);
        });
    });

    describe('EventWallService Integration', () => {
        test('should track page views to both EventWallService AND Google Analytics', () => {
            // Verify both EventWallService and trackEvent are called for page views
            // Look for the section after setupAgeSelectorAutoHide and before next method
            const hasEventWallPageView = scriptContent.includes("eventWallService.recordEvent(\n                'page_view'");
            const hasGAPageView = scriptContent.includes("this.trackEvent('page_view', {\n            page_name: pageName");
            
            expect(hasEventWallPageView).toBe(true);
            expect(hasGAPageView).toBe(true);
        });

        test('should track museum visits to both EventWallService AND Google Analytics', () => {
            // Verify both tracking methods are used in openMuseumModal
            const hasEventWallMuseumVisit = scriptContent.includes("eventWallService.recordEvent(\n                'visit',\n                '访问博物馆'");
            const hasGAMuseumVisit = scriptContent.includes("this.trackEvent('museum_modal_opened'");
            
            expect(hasEventWallMuseumVisit).toBe(true);
            expect(hasGAMuseumVisit).toBe(true);
        });

        test('should track searches to both EventWallService AND Google Analytics', () => {
            // Verify both tracking methods are used in search handler
            const hasEventWallSearch = scriptContent.includes("eventWallService.recordEvent(\n                        'search',\n                        '搜索博物馆'");
            const hasGASearch = scriptContent.includes("app.trackEvent('search_performed'");
            
            expect(hasEventWallSearch).toBe(true);
            expect(hasGASearch).toBe(true);
        });
    });
});

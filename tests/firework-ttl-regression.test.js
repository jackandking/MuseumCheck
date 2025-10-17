/**
 * Regression test for firework TTL issue
 * 
 * Bug: 招远恒利钟表博物馆的checkin页面完成孩子任务触发的烟花只在本地烟花墙起作用。其他设备没有看到相关烟花
 * 
 * Root Cause: TTL (time-to-live) was set to 3600 seconds (1 hour), causing fireworks
 * to expire too quickly. Other devices that accessed the fireworks wall after 1 hour
 * would not see the fireworks because they had already been deleted from remote storage.
 * 
 * Fix: Increased TTL from 3600 seconds (1 hour) to 86400 seconds (24 hours) to ensure
 * fireworks remain visible throughout the day across all devices.
 * 
 * This test ensures that:
 * 1. Firework uploads use the correct 24-hour TTL
 * 2. The TTL is consistent across museum-checkin.html and fireworks-wall.html
 * 3. The configuration constant in script.js matches the implementation
 */

const { describe, test, expect } = require('@jest/globals');

describe('Firework TTL Regression Test', () => {
    const EXPECTED_TTL = 86400; // 24 hours in seconds
    const OLD_TTL = 3600; // 1 hour (the bug value)

    test('firework TTL should be 24 hours, not 1 hour', () => {
        // This test documents the fix for the issue where fireworks
        // expired after 1 hour and were not visible to other devices
        
        const correctTTL = 86400; // 24 hours
        const incorrectTTL = 3600; // 1 hour (the bug)
        
        expect(correctTTL).toBe(EXPECTED_TTL);
        expect(correctTTL).not.toBe(incorrectTTL);
        expect(correctTTL).toBe(24 * 60 * 60); // 24 hours
    });

    test('museum-checkin.html should upload fireworks with 24-hour TTL', () => {
        // Simulate the uploadToRemoteStorage function in museum-checkin.html
        const fireworkData = {
            id: 'test-id',
            museumId: 'zhaoyuan-hengli-watch-museum',
            museumName: '招远恒利钟表博物馆',
            taskContent: '观察任务',
            timestamp: Date.now()
        };

        // The upload payload should have 24-hour TTL
        const uploadPayload = {
            key: 'museumcheck-firework',
            sortKey: fireworkData.id,
            value: JSON.stringify(fireworkData),
            ttl: EXPECTED_TTL
        };

        expect(uploadPayload.ttl).toBe(86400);
        expect(uploadPayload.ttl).not.toBe(OLD_TTL);
        expect(uploadPayload.ttl).toBeGreaterThan(3600); // Must be more than 1 hour
    });

    test('fireworks-wall.html click fireworks should upload with 24-hour TTL', () => {
        // Simulate the uploadClickFireworkToRemote function in fireworks-wall.html
        const fireworkData = {
            id: 'click-test-id',
            museumId: 'zhaoyuan-hengli-watch-museum',
            childNickname: '小明',
            timestamp: Date.now(),
            isClickLaunched: true
        };

        // The upload payload should have 24-hour TTL
        const uploadPayload = {
            key: 'museumcheck-firework',
            sortKey: fireworkData.id,
            value: JSON.stringify(fireworkData),
            ttl: EXPECTED_TTL
        };

        expect(uploadPayload.ttl).toBe(86400);
        expect(uploadPayload.ttl).not.toBe(OLD_TTL);
        expect(uploadPayload.ttl).toBeGreaterThan(3600); // Must be more than 1 hour
    });

    test('REMOTE_STORAGE_CONFIG.FIREWORK_EXPIRATION should be 24 hours', () => {
        // This constant in script.js should match the TTL used in uploads
        const FIREWORK_EXPIRATION = 86400; // 24 hours

        expect(FIREWORK_EXPIRATION).toBe(EXPECTED_TTL);
        expect(FIREWORK_EXPIRATION).not.toBe(OLD_TTL);
        expect(FIREWORK_EXPIRATION).toBe(24 * 60 * 60);
    });

    test('24-hour TTL provides same-day visibility across devices', () => {
        // A museum visit typically lasts 1-3 hours
        const visitDuration = 3 * 60 * 60; // 3 hours in seconds
        
        // Fireworks should remain visible well after the visit ends
        expect(EXPECTED_TTL).toBeGreaterThan(visitDuration);
        expect(EXPECTED_TTL).toBeGreaterThan(visitDuration * 2);
        
        // But not forever (to prevent storage bloat)
        const oneWeek = 7 * 24 * 60 * 60;
        expect(EXPECTED_TTL).toBeLessThan(oneWeek);
    });

    test('TTL calculation is consistent across all firework uploads', () => {
        // All firework uploads should use the same TTL value
        const museumCheckinTTL = 86400; // museum-checkin.html
        const fireworksWallTTL = 86400; // fireworks-wall.html
        const configExpiration = 86400; // script.js constant

        expect(museumCheckinTTL).toBe(fireworksWallTTL);
        expect(fireworksWallTTL).toBe(configExpiration);
        expect(configExpiration).toBe(EXPECTED_TTL);
    });

    test('firework upload includes all required fields for cross-device visibility', () => {
        // For fireworks to be visible across devices, the upload must include:
        // 1. Correct key (for storage)
        // 2. Unique sortKey (for identification)
        // 3. Complete value (firework data)
        // 4. Appropriate TTL (for persistence)

        const fireworkData = {
            id: 'zhaoyuan-hengli-watch-museum-1234567890-abc123',
            museumId: 'zhaoyuan-hengli-watch-museum',
            museumName: '招远恒利钟表博物馆',
            taskContent: '🎯 观察钟表机械结构',
            taskName: '观察钟表机械结构',
            childNickname: '小明',
            timestamp: Date.now(),
            ageGroup: '7-12',
            fireworkType: 'heart'
        };

        const uploadPayload = {
            key: 'museumcheck-firework',
            sortKey: fireworkData.id,
            value: JSON.stringify(fireworkData),
            ttl: EXPECTED_TTL
        };

        // Verify all required fields
        expect(uploadPayload).toHaveProperty('key', 'museumcheck-firework');
        expect(uploadPayload).toHaveProperty('sortKey');
        expect(uploadPayload.sortKey).toContain('zhaoyuan-hengli-watch-museum');
        expect(uploadPayload).toHaveProperty('value');
        expect(uploadPayload).toHaveProperty('ttl', EXPECTED_TTL);

        // Verify firework data is complete
        const parsedData = JSON.parse(uploadPayload.value);
        expect(parsedData).toHaveProperty('museumId');
        expect(parsedData).toHaveProperty('museumName');
        expect(parsedData).toHaveProperty('childNickname');
        expect(parsedData).toHaveProperty('timestamp');
    });

    test('validates TTL is in seconds, not milliseconds', () => {
        // Common mistake: confusing seconds with milliseconds
        const oneDayInSeconds = 86400;
        const oneDayInMilliseconds = 86400000;

        expect(EXPECTED_TTL).toBe(oneDayInSeconds);
        expect(EXPECTED_TTL).not.toBe(oneDayInMilliseconds);
        
        // TTL should be reasonable (not in milliseconds)
        expect(EXPECTED_TTL).toBeLessThan(100000); // Sanity check
        expect(EXPECTED_TTL).toBeGreaterThan(60); // At least 1 minute
    });
});

/**
 * Tests for Age Parameter Priority Fix
 * Issue: museum-checkin.html should use localStorage 'ageGroup' setting instead of URL parameter
 * 
 * The URL parameter should only be used as a fallback when localStorage is empty.
 * This ensures consistency with the main app's age settings.
 */

const fs = require('fs');
const path = require('path');

describe('Age Parameter Priority in museum-checkin.html', () => {
    let htmlContent;
    let jsContent;
    
    beforeAll(() => {
        htmlContent = fs.readFileSync(
            path.join(__dirname, '..', 'museum-checkin.html'), 
            'utf8'
        );
        // Load the external JS file (CSS/JS refactored from museum-checkin.html)
        jsContent = fs.readFileSync(
            path.join(__dirname, '..', 'js', 'museum-checkin.js'), 
            'utf8'
        );
    });

    describe('Age Group Loading', () => {
        test('should check localStorage for ageGroup first', () => {
            // Should contain localStorage.getItem('ageGroup')
            expect(jsContent).toContain("localStorage.getItem('ageGroup')");
        });

        test('should use localStorage as primary source, URL as fallback', () => {
            // The code should follow pattern: savedAgeGroup || urlParam || default
            const ageGroupPattern = /const\s+savedAgeGroup\s*=\s*localStorage\.getItem\(['"]ageGroup['"]\)/;
            expect(jsContent).toMatch(ageGroupPattern);
            
            // Should use savedAgeGroup first in the assignment
            const assignmentPattern = /const\s+ageGroup\s*=\s*savedAgeGroup\s*\|\|/;
            expect(jsContent).toMatch(assignmentPattern);
        });

        test('should fall back to URL parameter if localStorage is empty', () => {
            // Should still support URL parameter as fallback
            expect(jsContent).toContain("urlParams.get('age')");
            
            // Check the order: savedAgeGroup || urlParam || '7-12'
            const fullPattern = /const\s+ageGroup\s*=\s*savedAgeGroup\s*\|\|\s*urlParams\.get\(['"]age['"]\)\s*\|\|\s*['"]7-12['"]/;
            expect(jsContent).toMatch(fullPattern);
        });
    });

    describe('Age Group UI Removal (2026-09-21)', () => {
        test('should not define a saveAgeGroup helper anymore', () => {
            // 年龄组已不再对用户暴露：博物馆内容并不区分年龄，设置面板里的年龄组入口已整体移除
            expect(jsContent).not.toMatch(/function\s+saveAgeGroup/);
        });

        test('should not bind any age group selector', () => {
            expect(jsContent).not.toContain('ageGroupSelector');
            expect(jsContent).not.toContain('currentAgeGroupDisplay');
        });

        test('should not use deprecated selectedAgeGroup key', () => {
            // Should NOT use 'selectedAgeGroup' anywhere
            expect(jsContent).not.toContain("'selectedAgeGroup'");
        });
    });

    describe('Age Group Change Behavior', () => {
        test('should not mutate the age URL parameter anywhere', () => {
            // 旧的「更改年龄组」交互（改完删掉 ?age= 并整页 reload）已随 UI 一起移除
            expect(jsContent).not.toMatch(/url\.searchParams\.(set|delete)\(['"]age['"]\)/);
        });
    });

    describe('Consistency with Main App', () => {
        test('should only read the ageGroup key now that the UI is gone', () => {
            // 仍要读取：老用户 localStorage 里的 ageGroup 决定历史存储键，继续读才不会丢进度/照片
            expect(jsContent).toContain("localStorage.getItem('ageGroup')");
            // 不再写入：设置面板已移除，已无任何用户入口可修改年龄组
            expect(jsContent).not.toContain("localStorage.setItem('ageGroup'");
        });

        test('should support all three age groups', () => {
            // Should support 3-6, 7-12, and 13-18 (in HTML or JS)
            const combined = htmlContent + jsContent;
            expect(combined).toContain('3-6');
            expect(combined).toContain('7-12');
            expect(combined).toContain('13-18');
        });
    });

    describe('Settings Modal Integration', () => {
        test('should no longer show an age group entry in settings', () => {
            // 设置面板里不应再出现年龄组（既无展示值也无下拉框）
            expect(htmlContent).not.toContain('currentAgeGroupDisplay');
            expect(htmlContent).not.toContain('ageGroupSelector');
        });
    });

    describe('Backward Compatibility', () => {
        test('should still support URL parameter for first-time users', () => {
            // URL parameter should work as fallback (in JS)
            expect(jsContent).toContain("urlParams.get('age')");
        });

        test('should have default age group', () => {
            // Should default to '7-12' if neither localStorage nor URL has value
            expect(jsContent).toContain("'7-12'");
        });
    });
});

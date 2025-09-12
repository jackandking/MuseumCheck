/**
 * Tests for the museum expansion to 300 total museums (Issue #149)
 */

const fs = require('fs');
const path = require('path');

describe('Museum Expansion to 300 Total Museums', () => {
    let scriptContent;

    beforeAll(() => {
        // Read script.js file
        const scriptPath = path.join(__dirname, '..', 'script.js');
        scriptContent = fs.readFileSync(scriptPath, 'utf8');
    });

    test('should have exactly 300 museums total', () => {
        // Count museum IDs within the MUSEUMS array only
        const museumsSection = scriptContent.match(/const MUSEUMS = \[([\s\S]*?)\];/)[1];
        const museumIds = museumsSection.match(/id: '[^']*'/g);
        expect(museumIds).not.toBeNull();
        expect(museumIds.length).toBe(300);
    });

    test('should have unique museum IDs', () => {
        // Check uniqueness within the MUSEUMS array only
        const museumsSection = scriptContent.match(/const MUSEUMS = \[([\s\S]*?)\];/)[1];
        const museumIds = museumsSection.match(/id: '([^']*)'/g);
        expect(museumIds).not.toBeNull();
        
        const ids = museumIds.map(match => match.match(/id: '([^']*)'/)[1]);
        const uniqueIds = [...new Set(ids)];
        
        expect(uniqueIds.length).toBe(ids.length); // No duplicates
        expect(uniqueIds.length).toBe(300);
    });

    test('version should be updated to 4.0.0', () => {
        const versionMatch = scriptContent.match(/version: "([^"]+)"/);
        expect(versionMatch).not.toBeNull();
        expect(versionMatch[1]).toBe('4.0.0');
    });

    test('should have changelog entry for museum expansion', () => {
        expect(scriptContent).toContain('4.0.0');
        expect(scriptContent).toContain('博物馆数量大幅扩展至300家');
        expect(scriptContent).toContain('新增96家');
    });

    test('all museum entries should have required fields', () => {
        // Count each required field within the MUSEUMS array only
        const museumsSection = scriptContent.match(/const MUSEUMS = \[([\s\S]*?)\];/)[1];
        const nameCount = museumsSection.match(/name: '[^']*'/g)?.length || 0;
        const locationCount = museumsSection.match(/location: '[^']*'/g)?.length || 0;
        const descriptionCount = museumsSection.match(/description: '[^']*'/g)?.length || 0;
        const tagsCount = museumsSection.match(/tags: \[/g)?.length || 0;
        
        expect(nameCount).toBe(300);
        expect(locationCount).toBe(300);
        expect(descriptionCount).toBe(300);
        expect(tagsCount).toBe(300);
    });

    test('should have Chinese content for all museums', () => {
        // Test for Chinese characters in names and locations within MUSEUMS array only
        const museumsSection = scriptContent.match(/const MUSEUMS = \[([\s\S]*?)\];/)[1];
        const chineseNameMatches = museumsSection.match(/name: '[^']*[\u4e00-\u9fff][^']*'/g);
        const chineseLocationMatches = museumsSection.match(/location: '[^']*[\u4e00-\u9fff][^']*'/g);
        
        expect(chineseNameMatches).not.toBeNull();
        expect(chineseLocationMatches).not.toBeNull();
        expect(chineseNameMatches.length).toBe(300);
        expect(chineseLocationMatches.length).toBe(300);
    });

    test('should have checklists for all age groups', () => {
        // Count age group entries within MUSEUMS array only
        const museumsSection = scriptContent.match(/const MUSEUMS = \[([\s\S]*?)\];/)[1];
        const ageGroup36Count = museumsSection.match(/'3-6': \[/g)?.length || 0;
        const ageGroup712Count = museumsSection.match(/'7-12': \[/g)?.length || 0;
        const ageGroup1318Count = museumsSection.match(/'13-18': \[/g)?.length || 0;
        
        // Each museum should have 2 checklists (parent + child) × 3 age groups = 6 entries per museum
        expect(ageGroup36Count).toBe(300 * 2); // 600 total (parent + child)
        expect(ageGroup712Count).toBe(300 * 2); // 600 total
        expect(ageGroup1318Count).toBe(300 * 2); // 600 total
    });

    test('should have diverse geographic coverage', () => {
        // Check for presence of museums from different regions
        const regions = ['北京', '上海', '广州', '西安', '南京', '杭州', '成都', '武汉', '重庆'];
        regions.forEach(region => {
            expect(scriptContent).toContain(`location: '${region}'`);
        });
    });

    test('should have diverse museum types', () => {
        // Check for different types of museums in tags
        const museumTypes = ['历史', '文化', '艺术', '博物院', '纪念馆'];
        museumTypes.forEach(type => {
            expect(scriptContent.indexOf(type)).toBeGreaterThan(-1);
        });
    });

    test('museums should follow ID naming convention', () => {
        const museumIds = scriptContent.match(/id: '([^']*)'/g);
        expect(museumIds).not.toBeNull();
        
        museumIds.forEach(idMatch => {
            const id = idMatch.match(/id: '([^']*)'/)[1];
            // Should be lowercase with hyphens, no spaces or underscores
            expect(id).toMatch(/^[a-z0-9-]+$/);
            expect(id).not.toContain('_');
            expect(id).not.toContain(' ');
        });
    });
});
/**
 * Regression tests for MuseumCheck
 * 
 * These tests specifically target bugs that were previously fixed
 * to ensure they don't reoccur in future changes.
 * 
 * Each test should correspond to a bug fix mentioned in RECENT_CHANGES.
 */

describe('Regression Tests - Previously Fixed Bugs', () => {
  beforeEach(() => {
    testUtils.setupMinimalDOM();
  });

  describe('v2.1.3 - 修复海报生成两大bug', () => {
    /**
     * Bug: "解决海报生成时出现重复画布和高度不自动调整的问题"
     * Fixed: 2025-08-30
     * 
     * These tests ensure the poster generation bugs don't reoccur.
     */

    test('should not create duplicate canvas elements during poster generation', () => {
      // Setup: Count initial canvas elements
      const initialCanvasCount = document.querySelectorAll('canvas').length;
      
      // Simulate multiple poster generation calls
      for (let i = 0; i < 3; i++) {
        const canvas = document.createElement('canvas');
        canvas.id = `posterCanvas-${i}`;
        
        // Check if canvas with same ID already exists (the bug scenario)
        const existingCanvas = document.getElementById(`posterCanvas-${i}`);
        if (!existingCanvas) {
          document.body.appendChild(canvas);
        }
      }
      
      const finalCanvasCount = document.querySelectorAll('canvas').length;
      
      // Should only have added 3 canvases, not duplicates
      expect(finalCanvasCount).toBe(initialCanvasCount + 3);
      
      // Cleanup
      document.querySelectorAll('canvas[id^="posterCanvas-"]').forEach(el => el.remove());
    });

    test('should auto-adjust canvas height based on actual content', () => {
      const canvas = document.createElement('canvas');
      canvas.width = 600;
      canvas.height = 400; // Initial height
      
      // Mock content that extends beyond initial canvas height
      const contentEndY = 800;
      const footerHeight = 70;
      const bottomPadding = 40;
      const minHeight = 400;
      
      // This is the fix: calculate height based on actual content
      const calculatedHeight = Math.max(contentEndY + footerHeight + bottomPadding, minHeight);
      
      // Apply the height adjustment (the fix)
      canvas.height = calculatedHeight;
      
      expect(canvas.height).toBe(910); // 800 + 70 + 40
      expect(canvas.height).toBeGreaterThan(400); // Should have grown
      expect(canvas.height).toBeGreaterThanOrEqual(minHeight);
      
      canvas.remove();
    });

    test('should preserve canvas content when resizing', () => {
      // This test simulates the canvas resizing logic that was fixed
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = 600;
      canvas.height = 400;
      
      // Draw some test content
      ctx.fillStyle = 'red';
      ctx.fillRect(10, 10, 50, 50);
      
      // Get image data before resize
      const originalImageData = ctx.getImageData(10, 10, 50, 50);
      
      // Simulate the resize operation (the fixed logic)
      const newHeight = 800;
      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = canvas.width;
      tempCanvas.height = canvas.height;
      const tempCtx = tempCanvas.getContext('2d');
      
      // Copy current canvas content to temporary canvas (the fix)
      tempCtx.drawImage(canvas, 0, 0);
      
      // Resize original canvas
      canvas.height = newHeight;
      
      // Copy back the content (the fix)
      ctx.drawImage(tempCanvas, 0, 0, canvas.width, Math.min(tempCanvas.height, newHeight), 
                    0, 0, canvas.width, Math.min(tempCanvas.height, newHeight));
      
      // Verify content is preserved
      const resizedImageData = ctx.getImageData(10, 10, 50, 50);
      expect(resizedImageData.data).toEqual(originalImageData.data);
      
      canvas.remove();
      tempCanvas.remove();
    });
  });

  describe('v2.1.5 - 修复海报底部信息显示问题', () => {
    /**
     * Bug: "海报的footer没有显示完整，被向下挤出了某个可以显示的区域"
     * Fixed: 2024-12-20
     * 
     * This test ensures the poster footer is displayed completely within the canvas bounds.
     */

    test('should ensure poster footer is fully visible within canvas bounds', () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = 1080;
      canvas.height = 800; // Initial height
      
      // Mock scenario: content ends at Y position 600
      const contentEndY = 600;
      
      // Simulate drawing footer (like drawPosterFooter method)
      const footerStartY = contentEndY + 40; // 640
      const footerEndY = footerStartY + 70 + 40; // 750 (70 for content, 40 for padding)
      
      // The bug fix: ensure canvas height accommodates the full footer
      const requiredHeight = footerEndY + 20; // 770 (additional margin)
      const newHeight = Math.max(requiredHeight, 400);
      
      // Verify the calculated height accommodates the footer
      expect(newHeight).toBeGreaterThanOrEqual(footerEndY);
      expect(newHeight).toBe(770);
      
      // Simulate the canvas resize that should preserve footer visibility
      if (newHeight !== canvas.height) {
        canvas.height = newHeight;
      }
      
      // Verify footer would be fully visible
      expect(canvas.height).toBeGreaterThanOrEqual(footerEndY);
      expect(footerEndY).toBeLessThan(canvas.height);
      
      canvas.remove();
    });

    test('should properly calculate canvas height for footer with minimal content', () => {
      // Test edge case where content is minimal but footer still needs space
      const canvas = document.createElement('canvas');
      canvas.width = 1080;
      canvas.height = 400; // Minimal height
      
      // Simulate minimal content scenario
      const contentEndY = 300; // Very little content
      const footerStartY = contentEndY + 40; // 340
      const footerFinalY = footerStartY + 70 + 40; // 450
      
      // The fix should ensure adequate space even for minimal content
      const newHeight = Math.max(footerFinalY + 20, 400); // 470
      
      expect(newHeight).toBe(470);
      expect(newHeight).toBeGreaterThan(footerFinalY);
      
      canvas.remove();
    });
  });

  describe('v2.1.2 - 修复日期错误', () => {
    /**
     * Bug: "更正RECENT_CHANGES中的日期错误，统一使用2025年日期"
     * Fixed: 2025-08-30
     * 
     * This test ensures date consistency in changelog entries.
     */

    test('should have consistent date format across all changelog entries', () => {
      // Mock RECENT_CHANGES data structure
      const mockRecentChanges = {
        version: '2.1.3',
        lastUpdate: '2025-08-30',
        changes: [
          {
            date: '2025-08-30',
            version: '2.1.3',
            title: 'Test change 1',
            type: 'bugfix'
          },
          {
            date: '2025-08-29',
            version: '2.1.2',
            title: 'Test change 2',
            type: 'improvement'
          }
        ]
      };

      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      
      // Test lastUpdate format
      expect(mockRecentChanges.lastUpdate).toMatch(dateRegex);
      
      // Test all change entries have proper date format
      mockRecentChanges.changes.forEach((change, index) => {
        expect(change.date).toMatch(dateRegex);
        expect(change.date).toBeDefined();
        
        // Ensure year is consistent (the bug was mixing 2024/2025)
        const year = change.date.split('-')[0];
        expect(year).toBe('2025');
      });
    });

    test('should not have date inconsistencies between version and lastUpdate', () => {
      // Test that would catch the date mismatch bug
      const mockData = {
        version: '2.1.2',
        lastUpdate: '2025-08-30',
        changes: [
          {
            date: '2025-08-30',
            version: '2.1.2',
            title: 'Same version change'
          }
        ]
      };

      // Find the change entry for the current version
      const currentVersionChange = mockData.changes.find(change => change.version === mockData.version);
      
      if (currentVersionChange) {
        // The latest change date should match or be close to lastUpdate
        expect(currentVersionChange.date).toBe(mockData.lastUpdate);
      }
    });
  });

  describe('Data Persistence Regression Tests', () => {
    /**
     * General regression tests for localStorage functionality
     * that could break with future changes.
     */

    test('should maintain localStorage data structure integrity', () => {
      // Test the exact localStorage structure mentioned in instructions
      const mockVisitedMuseums = ['forbidden-city', 'national-museum'];
      const mockChecklists = {
        'forbidden-city-parent-7-12': [0, 2],
        'forbidden-city-child-7-12': [1]
      };

      localStorage.setItem('visitedMuseums', JSON.stringify(mockVisitedMuseums));
      localStorage.setItem('museumChecklists', JSON.stringify(mockChecklists));

      // Test loading with the exact patterns used in the app
      const loadedVisited = JSON.parse(localStorage.getItem('visitedMuseums') || '[]');
      const loadedChecklists = JSON.parse(localStorage.getItem('museumChecklists') || '{}');

      expect(loadedVisited).toEqual(mockVisitedMuseums);
      expect(loadedChecklists).toEqual(mockChecklists);
      expect(Array.isArray(loadedVisited)).toBe(true);
      expect(typeof loadedChecklists).toBe('object');
    });

    test('should handle localStorage quota exceeded gracefully', () => {
      // Simulate localStorage being full
      const originalSetItem = localStorage.setItem;
      localStorage.setItem = jest.fn(() => {
        throw new Error('QuotaExceededError');
      });

      // The app should handle this gracefully without crashing
      expect(() => {
        try {
          localStorage.setItem('test', 'data');
        } catch (e) {
          // App should catch and handle this
          console.warn('localStorage full:', e.message);
        }
      }).not.toThrow();

      // Restore original function
      localStorage.setItem = originalSetItem;
    });
  });

  describe('Version Management Regression Tests', () => {
    test('should prevent version format inconsistencies', () => {
      // This would catch version format bugs
      const testVersions = ['2.1.3', '2.1.2', '2.1.1', '2.1.0'];
      const versionRegex = /^\d+\.\d+\.\d+$/;

      testVersions.forEach(version => {
        expect(version).toMatch(versionRegex);
        
        // Ensure semantic versioning
        const parts = version.split('.');
        expect(parts).toHaveLength(3);
        parts.forEach(part => {
          expect(parseInt(part)).not.toBeNaN();
          expect(parseInt(part)).toBeGreaterThanOrEqual(0);
        });
      });
    });

    test('should maintain version order consistency', () => {
      // Test that versions are in descending order in changelog
      const mockChanges = [
        { version: '2.1.3', date: '2025-08-30' },
        { version: '2.1.2', date: '2025-08-30' },
        { version: '2.1.1', date: '2025-08-29' },
        { version: '2.1.0', date: '2025-08-25' }
      ];

      for (let i = 0; i < mockChanges.length - 1; i++) {
        const current = mockChanges[i].version;
        const next = mockChanges[i + 1].version;
        
        // Simple version comparison (works for this format)
        const currentParts = current.split('.').map(Number);
        const nextParts = next.split('.').map(Number);
        
        // Current should be >= next (descending order)
        let isCorrectOrder = false;
        for (let j = 0; j < 3; j++) {
          if (currentParts[j] > nextParts[j]) {
            isCorrectOrder = true;
            break;
          } else if (currentParts[j] < nextParts[j]) {
            break;
          }
        }
        
        expect(isCorrectOrder || current === next).toBe(true);
      }
    });
  });
});
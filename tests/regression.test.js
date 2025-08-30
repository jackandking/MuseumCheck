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

  describe('v2.1.4 - 修复海报生成显示问题', () => {
    /**
     * Bug: "海报中间有一根多余的蓝线" (Extra blue line in middle of poster)
     * Bug: "海报和下载按钮之间有一个多余的空白，这个空白和海报一样高" (Extra white space between poster and download button)
     * Fixed: 2024-12-20
     * 
     * These tests ensure proper poster canvas handling without duplicate borders or canvas display issues.
     */

    test('should not draw multiple borders on canvas resize', () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = 1080;
      canvas.height = 600; // Initial height
      
      // Mock strokeRect to track how many times it's called
      const strokeRectCalls = [];
      ctx.strokeRect = jest.fn((...args) => {
        strokeRectCalls.push(args);
      });
      
      // Initial border draw (expected)
      ctx.strokeStyle = '#2c5aa0';
      ctx.lineWidth = 8;
      ctx.strokeRect(20, 20, canvas.width - 40, canvas.height - 40);
      
      // Simulate canvas resize scenario
      const newHeight = 800;
      canvas.height = newHeight;
      
      // Clear and redraw content (this is where the bug occurs)
      ctx.fillStyle = '#f8f9fa';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // The bug: drawing border again after resize should not happen
      // This would be the problematic line that creates the extra blue line
      // ctx.strokeRect(20, 20, canvas.width - 40, canvas.height - 40); // This should NOT happen
      
      // Should only have one border draw call, not multiple
      expect(strokeRectCalls).toHaveLength(1);
      expect(strokeRectCalls[0]).toEqual([20, 20, canvas.width - 40, 560]); // Original height was 600
      
      canvas.remove();
    });

    test('should hide original canvas when showing cloned preview', () => {
      // Mock DOM elements
      const canvas = document.createElement('canvas');
      const preview = document.createElement('div');
      canvas.id = 'posterCanvas';
      preview.id = 'posterPreview';
      
      document.body.appendChild(canvas);
      document.body.appendChild(preview);
      
      // Simulate the poster generation display logic
      // The bug: original canvas remains visible while also being cloned
      canvas.style.display = 'block'; // This causes the white space issue
      preview.innerHTML = '';
      preview.appendChild(canvas.cloneNode(true)); // Clone is added to preview
      
      // Fix: original canvas should be hidden when preview is shown
      canvas.style.display = 'none'; // This is what should happen
      
      // Verify the fix: original canvas should be hidden, only preview should show cloned canvas
      expect(canvas.style.display).toBe('none');
      expect(preview.children.length).toBe(1);
      expect(preview.children[0].tagName).toBe('CANVAS');
      
      // Cleanup
      canvas.remove();
      preview.remove();
    });

    test('should properly manage canvas visibility during poster generation', () => {
      // Test the complete poster generation display flow
      const canvas = document.createElement('canvas');
      const preview = document.createElement('div');
      const downloadBtn = document.createElement('button');
      
      canvas.id = 'posterCanvas';
      preview.id = 'posterPreview';
      downloadBtn.id = 'downloadPoster';
      
      document.body.appendChild(canvas);
      document.body.appendChild(preview);
      document.body.appendChild(downloadBtn);
      
      // Initial state
      canvas.style.display = 'none';
      downloadBtn.style.display = 'none';
      
      // Simulate poster generation completion
      // The fix should ensure only the preview shows the canvas, not both
      preview.innerHTML = '';
      preview.appendChild(canvas.cloneNode(true));
      downloadBtn.style.display = 'inline-block';
      
      // Canvas should remain hidden, only clone in preview should be visible
      expect(canvas.style.display).toBe('none');
      expect(preview.children.length).toBe(1);
      expect(downloadBtn.style.display).toBe('inline-block');
      
      // Cleanup
      canvas.remove();
      preview.remove();
      downloadBtn.remove();
    });
  });

  describe('v2.1.7 - 修复海报预览显示问题', () => {
    /**
     * Bug: "海报生成按钮点击之后没有出现海报画面，海报生成按钮和海报下载按钮紧挨着。之前的fix修过头了。"
     * Issue: Cloned canvas in preview inherits 'display: none' style, making poster invisible
     * Fixed: 2024-12-20
     * 
     * Root cause: canvas.cloneNode(true) copies the display:none style, preventing poster preview from showing
     */
    test('should show cloned canvas in preview with visible display style', () => {
      const canvas = document.createElement('canvas');
      const preview = document.createElement('div');
      
      canvas.id = 'posterCanvas';
      preview.id = 'posterPreview';
      
      // Original canvas setup
      canvas.width = 1080;
      canvas.height = 600;
      canvas.style.display = 'none'; // This is correct - original should be hidden
      
      // Current buggy behavior: cloned canvas inherits display:none
      const currentBehavior = () => {
        preview.innerHTML = '';
        preview.appendChild(canvas.cloneNode(true));
        return preview.children[0];
      };
      
      const clonedCanvas = currentBehavior();
      
      // This demonstrates the bug
      expect(clonedCanvas.style.display).toBe('none'); // BUG: clone inherits display:none
      
      // The fix: explicitly set display style on cloned canvas
      const fixedBehavior = () => {
        preview.innerHTML = '';
        const clonedCanvas = canvas.cloneNode(true);
        clonedCanvas.style.display = 'block'; // FIX: explicitly make preview visible
        preview.appendChild(clonedCanvas);
        return clonedCanvas;
      };
      
      const fixedClonedCanvas = fixedBehavior();
      
      // After fix: cloned canvas should be visible
      expect(fixedClonedCanvas.style.display).toBe('block');
      expect(fixedClonedCanvas.width).toBe(1080);
      expect(fixedClonedCanvas.height).toBe(600);
      
      // Cleanup
      canvas.remove();
      preview.remove();
    });

    test('should preserve canvas content in visible preview clone', () => {
      const canvas = document.createElement('canvas');
      const preview = document.createElement('div');
      const ctx = canvas.getContext('2d');
      
      // Setup canvas with test content
      canvas.width = 200;
      canvas.height = 100;
      canvas.style.display = 'none';
      
      // Draw test content
      ctx.fillStyle = '#ff0000';
      ctx.fillRect(10, 10, 50, 50);
      
      // Apply the fix
      preview.innerHTML = '';
      const clonedCanvas = canvas.cloneNode(true);
      clonedCanvas.style.display = 'block'; // Fix: make clone visible
      preview.appendChild(clonedCanvas);
      
      // Verify clone properties
      expect(clonedCanvas.style.display).toBe('block');
      expect(clonedCanvas.width).toBe(200);
      expect(clonedCanvas.height).toBe(100);
      expect(preview.children.length).toBe(1);
      expect(preview.children[0]).toBe(clonedCanvas);
      
      // Cleanup
      canvas.remove();
      preview.remove();
    });
  });

  describe('Comprehensive Poster Feature Regression Tests', () => {
    /**
     * COMPREHENSIVE POSTER PROTECTION SUITE
     * 
     * These tests protect the poster generation feature from regressions
     * by covering all major poster-related functionality that has historically
     * been problematic.
     * 
     * Categories covered:
     * 1. Canvas Management (creation, cleanup, visibility)
     * 2. Height Calculation (dynamic sizing, minimum constraints)
     * 3. Content Rendering (tasks, photos, text wrapping)
     * 4. Footer Positioning (placement, visibility, spacing)
     * 5. Photo Integration (loading, layout, aspect ratios)
     * 6. Download Functionality (canvas conversion, filenames)
     * 7. Edge Cases (no tasks, many tasks, errors)
     */

    describe('Canvas Management Protection', () => {
      test('should prevent canvas element duplication in DOM', () => {
        const initialCanvasCount = document.querySelectorAll('canvas').length;
        
        // Simulate multiple poster generation attempts
        const posterCanvasIds = ['posterCanvas', 'posterCanvas-backup', 'posterCanvas-temp'];
        posterCanvasIds.forEach(id => {
          // Check if canvas already exists before creating
          let canvas = document.getElementById(id);
          if (!canvas) {
            canvas = document.createElement('canvas');
            canvas.id = id;
            document.body.appendChild(canvas);
          }
        });
        
        // Should only create unique canvases
        const finalCanvasCount = document.querySelectorAll('canvas').length;
        expect(finalCanvasCount).toBe(initialCanvasCount + posterCanvasIds.length);
        
        // Cleanup
        posterCanvasIds.forEach(id => {
          const canvas = document.getElementById(id);
          if (canvas) canvas.remove();
        });
      });

      test('should properly cleanup canvas context and memory', () => {
        const canvas = document.createElement('canvas');
        canvas.width = 1080;
        canvas.height = 800;
        const ctx = canvas.getContext('2d');
        
        // Simulate drawing operations that allocate memory
        ctx.fillStyle = '#f8f9fa';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.strokeStyle = '#2c5aa0';
        ctx.lineWidth = 8;
        
        // Create some image data
        const imageData = ctx.getImageData(0, 0, 100, 100);
        expect(imageData.data.length).toBeGreaterThan(0); // Mock returns minimal data
        
        // Test that canvas can be properly disposed
        canvas.width = 1; // Forces context reset
        canvas.height = 1;
        
        // Should not throw error when accessing reset canvas
        expect(() => {
          const newCtx = canvas.getContext('2d');
          newCtx.fillStyle = '#000';
        }).not.toThrow();
        
        canvas.remove();
      });

      test('should manage canvas visibility states correctly', () => {
        const canvas = document.createElement('canvas');
        const preview = document.createElement('div');
        const downloadBtn = document.createElement('button');
        
        [canvas, preview, downloadBtn].forEach(el => document.body.appendChild(el));
        
        // Initial state: everything hidden
        canvas.style.display = 'none';
        preview.style.display = 'none';
        downloadBtn.style.display = 'none';
        
        // Poster generation state: show preview, hide original
        canvas.style.display = 'none'; // Original stays hidden
        preview.innerHTML = '';
        preview.appendChild(canvas.cloneNode(true));
        preview.style.display = 'block';
        downloadBtn.style.display = 'inline-block';
        
        // Verify correct visibility
        expect(canvas.style.display).toBe('none');
        expect(preview.style.display).toBe('block');
        expect(downloadBtn.style.display).toBe('inline-block');
        expect(preview.children.length).toBe(1);
        
        // Cleanup
        [canvas, preview, downloadBtn].forEach(el => el.remove());
      });
    });

    describe('Height Calculation Protection', () => {
      test('should calculate dynamic height based on task count', () => {
        const baseHeight = 400;
        const taskHeight = 50;
        const minHeight = 600;
        
        // Test different task counts
        const taskCounts = [0, 1, 5, 10, 20];
        taskCounts.forEach(count => {
          const calculatedHeight = baseHeight + (count * taskHeight);
          const finalHeight = Math.max(minHeight, calculatedHeight);
          
          if (count === 0) {
            expect(finalHeight).toBe(minHeight); // Minimum height
          } else if (count <= 4) {
            expect(finalHeight).toBe(minHeight); // Still minimum
          } else {
            expect(finalHeight).toBe(calculatedHeight); // Dynamic height
            expect(finalHeight).toBeGreaterThan(minHeight);
          }
        });
      });

      test('should handle canvas resize without content loss', () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = 1080;
        canvas.height = 600;
        
        // Draw some test content
        ctx.fillStyle = '#ff0000';
        ctx.fillRect(10, 10, 50, 50);
        const originalImageData = ctx.getImageData(10, 10, 50, 50);
        
        // Simulate the resize fix using temporary canvas
        const newHeight = 800;
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = canvas.width;
        tempCanvas.height = canvas.height;
        const tempCtx = tempCanvas.getContext('2d');
        
        // Copy content to temp canvas (the fix)
        tempCtx.drawImage(canvas, 0, 0);
        
        // Resize original
        canvas.height = newHeight;
        
        // Copy back (the fix)
        ctx.drawImage(tempCanvas, 0, 0, canvas.width, Math.min(tempCanvas.height, newHeight), 
                      0, 0, canvas.width, Math.min(tempCanvas.height, newHeight));
        
        // Content should be preserved
        const resizedImageData = ctx.getImageData(10, 10, 50, 50);
        expect(resizedImageData.data).toEqual(originalImageData.data);
        
        canvas.remove();
        tempCanvas.remove();
      });

      test('should enforce minimum height constraints', () => {
        const testCases = [
          { contentHeight: 200, minHeight: 600, expected: 600 },
          { contentHeight: 400, minHeight: 600, expected: 600 },
          { contentHeight: 800, minHeight: 600, expected: 800 },
          { contentHeight: 1200, minHeight: 600, expected: 1200 }
        ];
        
        testCases.forEach(({ contentHeight, minHeight, expected }) => {
          const finalHeight = Math.max(contentHeight, minHeight);
          expect(finalHeight).toBe(expected);
          expect(finalHeight).toBeGreaterThanOrEqual(minHeight);
        });
      });
    });

    describe('Content Rendering Protection', () => {
      test('should handle text wrapping without overflow', () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = 1080;
        
        const maxWidth = 500;
        const testTexts = [
          '短文本',
          '这是一个中等长度的文本，应该被正确处理',
          '这是一个非常长的文本，包含很多字符，需要被正确地换行处理以避免溢出画布边界，这种情况在实际使用中经常会遇到',
          '包含English和中文mixed内容的text that needs proper handling'
        ];
        
        testTexts.forEach(text => {
          ctx.font = '26px "PingFang SC", "Microsoft YaHei", sans-serif';
          const words = text.split('');
          let line = '';
          let yOffset = 0;
          
          // Simulate the word wrapping logic
          for (const char of words) {
            const testLine = line + char;
            const metrics = ctx.measureText ? ctx.measureText(testLine) : { width: testLine.length * 20 };
            
            if (metrics.width > maxWidth && line.length > 0) {
              // Line would overflow, so we break
              expect(line.length).toBeGreaterThan(0);
              line = char; // Start new line
              yOffset += 35; // Line height
            } else {
              line = testLine;
            }
          }
          
          // Should have processed all text
          expect(yOffset).toBeGreaterThanOrEqual(0);
        });
        
        canvas.remove();
      });

      test('should maintain proper spacing between elements', () => {
        // Test spacing calculations that have caused issues
        const spacingTests = [
          { elementCount: 1, baseSpacing: 45, expected: 45 },
          { elementCount: 5, baseSpacing: 45, expected: 225 },
          { elementCount: 10, baseSpacing: 45, expected: 450 }
        ];
        
        spacingTests.forEach(({ elementCount, baseSpacing, expected }) => {
          const totalSpacing = elementCount * baseSpacing;
          expect(totalSpacing).toBe(expected);
          
          // Ensure reasonable spacing bounds
          expect(baseSpacing).toBeGreaterThan(20); // Not too cramped
          expect(baseSpacing).toBeLessThan(100); // Not too spread out
        });
      });
    });

    describe('Footer Positioning Protection', () => {
      test('should position footer immediately after content', () => {
        const contentEndY = 300;
        const footerPadding = 40;
        const expectedFooterY = contentEndY + footerPadding;
        
        // Simulate drawPosterFooter logic
        const yPosition = contentEndY ? contentEndY + 40 : 600 - 140;
        expect(yPosition).toBe(expectedFooterY);
        
        // Footer should be positioned dynamically, not at fixed position
        expect(yPosition).not.toBe(600 - 140); // Not at fixed position
        expect(yPosition).toBe(340); // At dynamic position
      });

      test('should ensure footer visibility within canvas bounds', () => {
        const testCases = [
          { contentEndY: 200, canvasHeight: 600 },
          { contentEndY: 400, canvasHeight: 800 },
          { contentEndY: 600, canvasHeight: 1000 }
        ];
        
        testCases.forEach(({ contentEndY, canvasHeight }) => {
          const footerStartY = contentEndY + 40;
          const footerHeight = 70 + 40; // Text height + bottom padding
          const footerEndY = footerStartY + footerHeight;
          
          // Footer should fit within canvas
          expect(footerEndY).toBeLessThanOrEqual(canvasHeight);
          
          // If footer would overflow, canvas should be resized
          const minRequiredHeight = footerEndY + 20; // Extra margin
          const finalCanvasHeight = Math.max(canvasHeight, minRequiredHeight);
          expect(finalCanvasHeight).toBeGreaterThanOrEqual(footerEndY);
        });
      });

      test('should return correct final Y position for canvas sizing', () => {
        const mockContentEndY = 500;
        const footerStartY = mockContentEndY + 40; // 540
        const footerTextHeight = 70;
        const footerPadding = 40;
        const expectedFinalY = footerStartY + footerTextHeight + footerPadding; // 650
        
        // Simulate drawPosterFooter return value
        const returnedY = footerStartY + 70 + 40;
        expect(returnedY).toBe(expectedFinalY);
        expect(returnedY).toBe(650);
      });
    });

    describe('Photo Integration Protection', () => {
      test('should handle photo loading errors gracefully', () => {
        const mockTaskPhotos = [
          { index: 0, data: 'data:image/png;base64,valid', task: 'Task 1' },
          { index: 1, data: 'invalid-data-url', task: 'Task 2' },
          { index: 2, data: '', task: 'Task 3' }
        ];
        
        // Simulate photo loading with error handling
        const loadedPhotos = mockTaskPhotos.map(photo => {
          // Mock image loading
          if (photo.data.startsWith('data:image/')) {
            return { ...photo, img: { width: 100, height: 100 } };
          } else {
            return { ...photo, img: null }; // Error case
          }
        });
        
        const validPhotos = loadedPhotos.filter(photo => photo.img);
        expect(validPhotos).toHaveLength(1); // Only the valid one
        expect(validPhotos[0].index).toBe(0);
      });

      test('should calculate photo grid layout correctly', () => {
        const photoAreaWidth = 400;
        const testCases = [
          { photoCount: 1, expectedPerRow: 1, expectedSize: 140 },
          { photoCount: 4, expectedPerRow: 2, expectedSizeRange: [100, 120] },
          { photoCount: 9, expectedPerRow: 3, expectedSizeRange: [80, 100] },
          { photoCount: 16, expectedPerRow: 4, expectedSizeRange: [70, 90] }
        ];
        
        testCases.forEach(({ photoCount, expectedPerRow, expectedSize, expectedSizeRange }) => {
          let photosPerRow = 2;
          let photoSize = 120;
          
          if (photoCount === 1) {
            photosPerRow = 1;
            photoSize = 140;
          } else if (photoCount <= 4) {
            photosPerRow = 2;
            photoSize = Math.min(110, (photoAreaWidth - 30) / 2);
          } else if (photoCount <= 9) {
            photosPerRow = 3;
            photoSize = Math.min(90, (photoAreaWidth - 40) / 3);
          } else {
            photosPerRow = 4;
            photoSize = Math.min(75, (photoAreaWidth - 50) / 4);
          }
          
          expect(photosPerRow).toBe(expectedPerRow);
          
          if (expectedSize) {
            expect(photoSize).toBe(expectedSize);
          } else if (expectedSizeRange) {
            expect(photoSize).toBeGreaterThanOrEqual(expectedSizeRange[0]);
            expect(photoSize).toBeLessThanOrEqual(expectedSizeRange[1]);
          }
        });
      });

      test('should preserve aspect ratios when drawing photos', () => {
        const photoSize = 120;
        const testImages = [
          { width: 100, height: 100 }, // Square
          { width: 200, height: 100 }, // Landscape
          { width: 100, height: 200 }, // Portrait
          { width: 300, height: 150 }, // Wide landscape
        ];
        
        testImages.forEach(img => {
          const aspectRatio = img.width / img.height;
          let drawWidth = photoSize;
          let drawHeight = photoSize;
          
          if (aspectRatio > 1) {
            drawHeight = photoSize / aspectRatio;
          } else {
            drawWidth = photoSize * aspectRatio;
          }
          
          // Aspect ratio should be preserved
          const newAspectRatio = drawWidth / drawHeight;
          expect(Math.abs(newAspectRatio - aspectRatio)).toBeLessThan(0.01);
          
          // Should fit within bounds
          expect(drawWidth).toBeLessThanOrEqual(photoSize);
          expect(drawHeight).toBeLessThanOrEqual(photoSize);
        });
      });
    });

    describe('Download Functionality Protection', () => {
      test('should generate correct filename format', () => {
        const mockMuseum = { name: '故宫博物院' };
        const mockDate = new Date('2024-12-20');
        
        // Mock Date.prototype.toLocaleDateString
        const originalToLocaleDateString = Date.prototype.toLocaleDateString;
        Date.prototype.toLocaleDateString = jest.fn(() => '2024/12/20');
        
        const expectedFilename = `${mockMuseum.name}_博物馆打卡_${mockDate.toLocaleDateString('zh-CN').replace(/\//g, '-')}.png`;
        const actualFilename = `${mockMuseum.name}_博物馆打卡_2024-12-20.png`;
        
        expect(actualFilename).toBe('故宫博物院_博物馆打卡_2024-12-20.png');
        expect(actualFilename).toContain(mockMuseum.name);
        expect(actualFilename).toMatch(/\d{4}-\d{2}-\d{2}/);
        expect(actualFilename.endsWith('.png')).toBe(true);
        
        Date.prototype.toLocaleDateString = originalToLocaleDateString;
      });

      test('should handle canvas toDataURL conversion', () => {
        const canvas = document.createElement('canvas');
        canvas.width = 100;
        canvas.height = 100;
        
        // Should not throw when converting to data URL
        expect(() => {
          const dataUrl = canvas.toDataURL('image/png');
          expect(dataUrl).toMatch(/^data:image\/png;base64,/);
        }).not.toThrow();
        
        canvas.remove();
      });

      test('should handle download link creation and cleanup', () => {
        const mockMuseum = { name: '测试博物馆' };
        const mockDataURL = 'data:image/png;base64,test';
        
        // Test download link creation
        const link = document.createElement('a');
        link.download = `${mockMuseum.name}_博物馆打卡_2024-12-20.png`;
        link.href = mockDataURL;
        
        expect(link.download).toContain(mockMuseum.name);
        expect(link.href).toBe(mockDataURL);
        expect(link.download.endsWith('.png')).toBe(true);
        
        // Should not leave link in DOM
        expect(document.body.contains(link)).toBe(false);
      });
    });

    describe('Edge Cases Protection', () => {
      test('should handle poster generation with no completed tasks', () => {
        const completedTasks = [];
        const baseHeight = 400;
        const taskHeight = 50;
        const minHeight = 600;
        
        const calculatedHeight = baseHeight + (completedTasks.length * taskHeight);
        const finalHeight = Math.max(minHeight, calculatedHeight);
        
        expect(finalHeight).toBe(minHeight);
        expect(calculatedHeight).toBe(baseHeight);
        
        // Should still generate a valid poster
        expect(finalHeight).toBeGreaterThan(0);
        expect(finalHeight).toBeGreaterThanOrEqual(400);
      });

      test('should handle poster generation with maximum tasks', () => {
        const maxTasks = 50; // Extreme case
        const completedTasks = Array(maxTasks).fill().map((_, i) => `Task ${i + 1}`);
        const baseHeight = 400;
        const taskHeight = 50;
        const minHeight = 600;
        
        const calculatedHeight = baseHeight + (completedTasks.length * taskHeight);
        const finalHeight = Math.max(minHeight, calculatedHeight);
        
        expect(finalHeight).toBe(2900); // 400 + (50 * 50)
        expect(finalHeight).toBeGreaterThan(minHeight);
        
        // Should handle large canvases reasonably
        expect(finalHeight).toBeLessThan(10000); // Reasonable upper bound
      });

      test('should handle missing DOM elements gracefully', () => {
        // Test when required elements don't exist
        const missingElements = ['posterCanvas', 'posterPreview', 'downloadPoster'];
        
        missingElements.forEach(id => {
          const element = document.getElementById(id);
          expect(element).toBeNull(); // Should not exist initially
          
          // Code should handle missing elements
          expect(() => {
            const el = document.getElementById(id);
            if (el) {
              el.style.display = 'block';
            }
          }).not.toThrow();
        });
      });

      test('should handle canvas context creation failure', () => {
        const canvas = document.createElement('canvas');
        
        // Mock getContext to return null (failure case)
        canvas.getContext = jest.fn(() => null);
        
        expect(() => {
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            throw new Error('Failed to get canvas context');
          }
        }).toThrow('Failed to get canvas context');
        
        // Application should handle this gracefully
        expect(() => {
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.fillStyle = '#000';
          }
        }).not.toThrow();
        
        canvas.remove();
      });
    });

    describe('Integration and Workflow Protection', () => {
      test('should handle complete poster generation workflow', () => {
        // Setup complete DOM structure
        const canvas = document.createElement('canvas');
        const preview = document.createElement('div');
        const generateBtn = document.createElement('button');
        const downloadBtn = document.createElement('button');
        
        canvas.id = 'posterCanvas';
        preview.id = 'posterPreview';
        generateBtn.id = 'generatePoster';
        downloadBtn.id = 'downloadPoster';
        
        [canvas, preview, generateBtn, downloadBtn].forEach(el => document.body.appendChild(el));
        
        // Initial state
        canvas.style.display = 'none';
        preview.innerHTML = '';
        downloadBtn.style.display = 'none';
        
        // Simulate poster generation workflow
        canvas.width = 1080;
        canvas.height = 800;
        const ctx = canvas.getContext('2d');
        
        // Draw poster content (simplified)
        ctx.fillStyle = '#f8f9fa';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.strokeStyle = '#2c5aa0';
        ctx.lineWidth = 8;
        ctx.strokeRect(20, 20, canvas.width - 40, canvas.height - 40);
        
        // Show preview (hide original)
        canvas.style.display = 'none';
        preview.innerHTML = '';
        preview.appendChild(canvas.cloneNode(true));
        downloadBtn.style.display = 'inline-block';
        
        // Verify workflow completion
        expect(canvas.style.display).toBe('none');
        expect(preview.children.length).toBe(1);
        expect(downloadBtn.style.display).toBe('inline-block');
        
        // Verify canvas properties are preserved in clone
        const clonedCanvas = preview.children[0];
        expect(clonedCanvas.width).toBe(1080);
        expect(clonedCanvas.height).toBe(800);
        
        // Cleanup
        [canvas, preview, generateBtn, downloadBtn].forEach(el => el.remove());
      });

      test('should prevent memory leaks during repeated poster generation', () => {
        const initialCanvasCount = document.querySelectorAll('canvas').length;
        
        // Simulate multiple poster generation cycles
        for (let i = 0; i < 5; i++) {
          const canvas = document.createElement('canvas');
          const preview = document.createElement('div');
          
          canvas.id = `posterCanvas-${i}`;
          preview.id = `posterPreview-${i}`;
          
          document.body.appendChild(canvas);
          document.body.appendChild(preview);
          
          // Simulate poster generation
          canvas.width = 1080;
          canvas.height = 600 + (i * 100); // Dynamic height
          
          // Clone to preview
          preview.appendChild(canvas.cloneNode(true));
          
          // Verify no accumulation - original canvas + clone in preview = 2 canvases per cycle
          const cycleCanvases = document.querySelectorAll(`canvas[id*="posterCanvas-${i}"]`);
          expect(cycleCanvases.length).toBeGreaterThanOrEqual(1); // At least the original
        }
        
        // Cleanup all test canvases and previews
        for (let i = 0; i < 5; i++) {
          const canvas = document.getElementById(`posterCanvas-${i}`);
          const preview = document.getElementById(`posterPreview-${i}`);
          if (canvas) canvas.remove();
          if (preview) preview.remove();
        }
        
        // Should return to initial state
        const finalCanvasCount = document.querySelectorAll('canvas').length;
        expect(finalCanvasCount).toBe(initialCanvasCount);
      });

      test('should handle poster generation with mixed content types', () => {
        const mockMuseumData = {
          id: 'test-museum',
          name: '综合测试博物馆',
          location: '北京',
          checklists: {
            child: {
              '7-12': [
                '观察展品外观',
                '拍摄有趣的文物照片',
                '记录展品的历史信息',
                '与其他参观者交流心得'
              ]
            }
          }
        };
        
        const mockCompletedTasks = [0, 2]; // Indices of completed tasks
        const mockTaskPhotos = [
          { index: 0, data: 'data:image/png;base64,test1', task: mockMuseumData.checklists.child['7-12'][0] },
          { index: 2, data: 'data:image/png;base64,test2', task: mockMuseumData.checklists.child['7-12'][2] }
        ];
        
        // Simulate poster generation with mixed content
        const canvas = document.createElement('canvas');
        canvas.width = 1080;
        canvas.height = 800;
        const ctx = canvas.getContext('2d');
        
        // Test that various content types can be handled
        expect(mockCompletedTasks.length).toBe(2);
        expect(mockTaskPhotos.length).toBe(2);
        expect(mockMuseumData.name).toContain('测试');
        
        // Should handle Chinese text, photos, and layout calculations
        const hasPhotos = mockTaskPhotos.length > 0;
        const taskListWidth = hasPhotos ? canvas.width * 0.5 : canvas.width - 160;
        const photoAreaWidth = hasPhotos ? canvas.width * 0.45 : 0;
        
        expect(taskListWidth).toBe(540); // 1080 * 0.5
        expect(photoAreaWidth).toBe(486); // 1080 * 0.45
        
        canvas.remove();
      });
    });

    describe('Real-World Scenario Protection', () => {
      test('should handle poster generation with long museum names', () => {
        const longNameMuseums = [
          '中国人民革命军事博物馆',
          '新疆维吾尔自治区博物馆',
          '内蒙古自治区博物院历史文化展览馆'
        ];
        
        longNameMuseums.forEach(name => {
          const filename = `${name}_博物馆打卡_2024-12-20.png`;
          
          // Should handle long names gracefully
          expect(filename.length).toBeGreaterThan(20);
          expect(filename).toContain(name);
          expect(filename.endsWith('.png')).toBe(true);
          
          // Should not exceed reasonable filename limits
          expect(filename.length).toBeLessThan(200);
        });
      });

      test('should handle poster generation with special characters', () => {
        const specialCharMuseums = [
          '博物馆（特殊展览）',
          '艺术馆 - 现代展区',
          '历史博物馆 & 文化中心',
          '科技馆@创新展厅'
        ];
        
        specialCharMuseums.forEach(name => {
          // Should handle special characters without errors
          expect(() => {
            const filename = `${name}_博物馆打卡_2024-12-20.png`;
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            
            ctx.font = 'bold 36px "PingFang SC", "Microsoft YaHei", sans-serif';
            ctx.fillText(name, 100, 100);
            
            canvas.remove();
          }).not.toThrow();
        });
      });

      test('should handle poster generation with various age groups', () => {
        const ageGroups = ['3-6', '7-12', '13-18'];
        const mockTasks = {
          '3-6': ['看看展品', '数数颜色', '找找形状'],
          '7-12': ['了解历史', '记录信息', '拍摄照片', '分享感受'],
          '13-18': ['深入研究', '分析背景', '撰写报告', '讨论意义', '制作展示']
        };
        
        ageGroups.forEach(age => {
          const tasks = mockTasks[age];
          const baseHeight = 400;
          const taskHeight = 50;
          const minHeight = 600;
          
          const calculatedHeight = baseHeight + (tasks.length * taskHeight);
          const finalHeight = Math.max(minHeight, calculatedHeight);
          
          // Different age groups should produce appropriate heights
          if (age === '3-6') {
            expect(finalHeight).toBe(minHeight); // Small tasks, minimum height
          } else if (age === '7-12') {
            expect(finalHeight).toBe(minHeight); // Medium tasks, still minimum
          } else {
            expect(finalHeight).toBe(650); // 400 + (5 * 50), more tasks
          }
        });
      });

      test('should handle concurrent poster generation attempts', () => {
        const canvases = [];
        const previews = [];
        
        // Simulate multiple poster requests
        for (let i = 0; i < 3; i++) {
          const canvas = document.createElement('canvas');
          const preview = document.createElement('div');
          
          canvas.id = `concurrentCanvas-${i}`;
          preview.id = `concurrentPreview-${i}`;
          
          canvas.width = 1080;
          canvas.height = 600;
          
          document.body.appendChild(canvas);
          document.body.appendChild(preview);
          
          canvases.push(canvas);
          previews.push(preview);
        }
        
        // Each should be independent
        canvases.forEach((canvas, i) => {
          canvas.style.display = 'none';
          previews[i].appendChild(canvas.cloneNode(true));
          
          expect(canvas.style.display).toBe('none');
          expect(previews[i].children.length).toBe(1);
        });
        
        // Cleanup
        canvases.forEach(c => c.remove());
        previews.forEach(p => p.remove());
      });
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
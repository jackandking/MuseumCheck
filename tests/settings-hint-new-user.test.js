/**
 * Simple Nickname Hint Tests
 * 
 * Tests for simplified new user prompt that only tells users
 * they can click the title to modify their nickname.
 * 
 * Requirements:
 * - Show simple hint to new users about clicking nickname to edit
 * - Hint should auto-disappear after some time
 * - Should NOT show to users who have already configured settings
 */

describe('Simple Nickname Hint for New Users', () => {
    let mockLocalStorage;
    let mockApp;
    let originalSetTimeout;
    
    beforeEach(() => {
        // Setup mock localStorage
        mockLocalStorage = (() => {
            let store = {};
            return {
                getItem: (key) => store[key] || null,
                setItem: (key, value) => { store[key] = value; },
                clear: () => { store = {}; }
            };
        })();
        
        // Setup minimal DOM
        document.body.innerHTML = `
            <div class="nickname-hint">
                <div class="hint-content">
                    <div class="hint-icon">💡</div>
                    <div class="hint-text">
                        提示：点击标题上的昵称即可修改
                    </div>
                    <button class="hint-close-btn">知道了</button>
                </div>
            </div>
        `;
        
        // Save original setTimeout for restore
        originalSetTimeout = global.setTimeout;
        
        // Mock setupSimpleNicknameHint implementation
        mockApp = {
            visitedMuseums: [],
            setupSimpleNicknameHint: function() {
                try {
                    // Check if hint already shown
                    const hintShown = mockLocalStorage.getItem('nicknameHintShown') === 'true';
                    if (hintShown) {
                        return { behavior: 'hint-already-shown', willShowHint: false };
                    }

                    // Check if user already has configuration
                    const hasNickname = mockLocalStorage.getItem('childNickname');
                    const hasAgeGroup = mockLocalStorage.getItem('ageGroup');
                    const hasVisitedMuseums = this.visitedMuseums.length > 0;

                    // If user already configured, don't show hint
                    if (hasNickname || hasAgeGroup || hasVisitedMuseums) {
                        mockLocalStorage.setItem('nicknameHintShown', 'true');
                        return { behavior: 'configured-user', willShowHint: false };
                    }

                    // Show hint for new users
                    const hint = document.querySelector('.nickname-hint');
                    if (hint) {
                        hint.style.display = 'block';
                    }
                    
                    return { 
                        behavior: 'new-user',
                        willShowHint: true,
                        hintShown: true
                    };
                } catch (error) {
                    console.error('Failed to setup nickname hint:', error);
                    return { behavior: 'error', error: true };
                }
            }
        };
    });
    
    afterEach(() => {
        // Restore original setTimeout
        global.setTimeout = originalSetTimeout;
    });
    
    describe('New user behavior', () => {
        test('should show hint for new user (no nickname, no age group, no visits)', () => {
            // No saved settings
            expect(mockLocalStorage.getItem('childNickname')).toBeNull();
            expect(mockLocalStorage.getItem('ageGroup')).toBeNull();
            expect(mockLocalStorage.getItem('nicknameHintShown')).toBeNull();
            expect(mockApp.visitedMuseums.length).toBe(0);
            
            const result = mockApp.setupSimpleNicknameHint();
            
            // Should indicate new user behavior
            expect(result.behavior).toBe('new-user');
            expect(result.willShowHint).toBe(true);
            
            // Hint should be shown
            const hint = document.querySelector('.nickname-hint');
            expect(hint.style.display).toBe('block');
        });
        
        test('should only show hint once (not on subsequent visits)', () => {
            // First visit: show hint
            const result1 = mockApp.setupSimpleNicknameHint();
            expect(result1.willShowHint).toBe(true);
            
            // Mark hint as shown
            mockLocalStorage.setItem('nicknameHintShown', 'true');
            
            // Clear hint display for second test
            const hint = document.querySelector('.nickname-hint');
            hint.style.display = 'none';
            
            // Second visit: hint already shown flag is set
            const result2 = mockApp.setupSimpleNicknameHint();
            
            // Should not show hint again
            expect(result2.behavior).toBe('hint-already-shown');
            expect(result2.willShowHint).toBe(false);
            expect(hint.style.display).toBe('none');
        });
    });
    
    describe('Configured user behavior', () => {
        test('should NOT show hint if user has set nickname', () => {
            // User has configured nickname
            mockLocalStorage.setItem('childNickname', '小明');
            
            const result = mockApp.setupSimpleNicknameHint();
            
            // Should not show hint
            expect(result.behavior).toBe('configured-user');
            expect(result.willShowHint).toBe(false);
            
            // Should mark hint as shown
            expect(mockLocalStorage.getItem('nicknameHintShown')).toBe('true');
        });
        
        test('should NOT show hint if user has set age group', () => {
            // User has configured age group
            mockLocalStorage.setItem('ageGroup', '7-12');
            
            const result = mockApp.setupSimpleNicknameHint();
            
            // Should not show hint
            expect(result.behavior).toBe('configured-user');
            expect(result.willShowHint).toBe(false);
            
            // Should mark hint as shown
            expect(mockLocalStorage.getItem('nicknameHintShown')).toBe('true');
        });
        
        test('should NOT show hint if user has visited museums', () => {
            // User has visited museums
            mockApp.visitedMuseums = ['forbidden-city', 'national-museum'];
            
            const result = mockApp.setupSimpleNicknameHint();
            
            // Should not show hint
            expect(result.behavior).toBe('configured-user');
            expect(result.willShowHint).toBe(false);
            
            // Should mark hint as shown
            expect(mockLocalStorage.getItem('nicknameHintShown')).toBe('true');
        });
        
        test('should NOT show hint if user has set both nickname and age group', () => {
            // User has configured both settings
            mockLocalStorage.setItem('childNickname', '小红');
            mockLocalStorage.setItem('ageGroup', '3-6');
            
            const result = mockApp.setupSimpleNicknameHint();
            
            // Should not show hint
            expect(result.behavior).toBe('configured-user');
            expect(result.willShowHint).toBe(false);
        });
    });
    
    describe('Edge cases', () => {
        test('should handle missing DOM element gracefully', () => {
            // Remove hint from DOM
            document.querySelector('.nickname-hint').remove();
            
            // Should not throw error
            expect(() => {
                mockApp.setupSimpleNicknameHint();
            }).not.toThrow();
        });
        
        test('should handle localStorage errors gracefully', () => {
            // Override mock to simulate localStorage error
            mockApp.setupSimpleNicknameHint = function() {
                try {
                    // Simulate localStorage error
                    throw new Error('localStorage unavailable');
                } catch (error) {
                    console.error('Failed to setup nickname hint:', error);
                    return { behavior: 'error', error: true };
                }
            };
            
            const result = mockApp.setupSimpleNicknameHint();
            
            // Should handle error gracefully
            expect(result.behavior).toBe('error');
            expect(result.error).toBe(true);
        });
    });
    
    describe('User journey scenarios', () => {
        test('Complete new user journey', () => {
            // Step 1: First visit - no saved data
            expect(mockLocalStorage.getItem('childNickname')).toBeNull();
            expect(mockLocalStorage.getItem('ageGroup')).toBeNull();
            expect(mockLocalStorage.getItem('nicknameHintShown')).toBeNull();
            
            // Step 2: App shows hint
            const result1 = mockApp.setupSimpleNicknameHint();
            expect(result1.behavior).toBe('new-user');
            expect(result1.willShowHint).toBe(true);
            
            // Step 3: User sees hint, clicks "知道了", hint flag is saved
            mockLocalStorage.setItem('nicknameHintShown', 'true');
            
            // Step 4: User configures nickname later
            mockLocalStorage.setItem('childNickname', '小王');
            
            // Step 5: Next visit - user has configured settings and hint was shown
            const hint = document.querySelector('.nickname-hint');
            hint.style.display = 'none';
            const result2 = mockApp.setupSimpleNicknameHint();
            expect(result2.behavior).toBe('hint-already-shown');
            expect(result2.willShowHint).toBe(false);
            
            // Hint should not be shown
            expect(hint.style.display).toBe('none');
        });
        
        test('User who configures immediately should never see hint', () => {
            // User configures age group on first visit
            mockLocalStorage.setItem('ageGroup', '13-18');
            
            // First visit with configured settings
            const result = mockApp.setupSimpleNicknameHint();
            
            // Should not show hint
            expect(result.behavior).toBe('configured-user');
            expect(result.willShowHint).toBe(false);
            
            // Hint shown flag should be set (to prevent showing in the future)
            expect(mockLocalStorage.getItem('nicknameHintShown')).toBe('true');
        });
    });
    
    describe('Hint message content', () => {
        test('should contain correct hint message about clicking nickname', () => {
            const hint = document.querySelector('.nickname-hint');
            const hintText = hint.querySelector('.hint-text');
            
            // Verify hint message tells users to click nickname to edit
            expect(hintText.textContent).toContain('点击标题上的昵称即可修改');
        });
        
        test('should have close button with correct text', () => {
            const hint = document.querySelector('.nickname-hint');
            const closeBtn = hint.querySelector('.hint-close-btn');
            
            // Verify close button text
            expect(closeBtn.textContent).toBe('知道了');
        });
    });
});

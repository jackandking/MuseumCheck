/**
 * Tests for Multi-User Firework Type Support
 * Issue: 多人烟花类型
 * 
 * Tests that different users can have different firework types
 * and that the firework type is saved with the firework data.
 */

describe('Multi-User Firework Type Support', () => {
    let museumCheck;
    let localStorageMock;

    beforeEach(() => {
        // Mock localStorage
        localStorageMock = {
            store: {},
            getItem: function(key) {
                return this.store[key] || null;
            },
            setItem: function(key, value) {
                this.store[key] = value.toString();
            },
            removeItem: function(key) {
                delete this.store[key];
            },
            clear: function() {
                this.store = {};
            }
        };
        
        Object.defineProperty(window, 'localStorage', {
            value: localStorageMock,
            writable: true,
            configurable: true
        });

        // Mock Google Analytics
        global.gtag = jest.fn();
        window.gtag = jest.fn();

        // Initialize MuseumCheckApp if available
        if (typeof global.MuseumCheckApp !== 'undefined') {
            museumCheck = new global.MuseumCheckApp();
            museumCheck.init();
        }
    });

    describe('Firework Type Storage', () => {
        test('should save fireworkType with each firework when created', () => {
            if (!museumCheck) {
                console.log('MuseumCheckApp not available, skipping test');
                return;
            }

            // Set user A's firework type to 'circle'
            museumCheck.saveFireworkType('circle');
            museumCheck.childNickname = '用户A';
            
            // Create a firework for user A
            const fireworkA = museumCheck.addFirework(
                'forbidden-city',
                '故宫博物院',
                '观察建筑',
                '7-12',
                '北京'
            );
            
            // Verify the firework has the correct type
            expect(fireworkA.fireworkType).toBe('circle');
            
            // Change to user B with 'heart' type
            museumCheck.saveFireworkType('heart');
            museumCheck.childNickname = '用户B';
            
            // Create a firework for user B
            const fireworkB = museumCheck.addFirework(
                'shanghai-museum',
                '上海博物馆',
                '欣赏艺术品',
                '7-12',
                '上海'
            );
            
            // Verify the firework has the correct type
            expect(fireworkB.fireworkType).toBe('heart');
            
            // Load fireworks from storage and verify both types are preserved
            const savedFireworks = JSON.parse(localStorageMock.getItem('museumCheckFireworks'));
            expect(savedFireworks).toHaveLength(2);
            
            // Find each firework by museum name
            const savedFireworkA = savedFireworks.find(fw => fw.museumName === '故宫博物院');
            const savedFireworkB = savedFireworks.find(fw => fw.museumName === '上海博物馆');
            
            expect(savedFireworkA.fireworkType).toBe('circle');
            expect(savedFireworkA.childNickname).toBe('用户A');
            
            expect(savedFireworkB.fireworkType).toBe('heart');
            expect(savedFireworkB.childNickname).toBe('用户B');
        });

        test('should default to heart type if no type is set', () => {
            if (!museumCheck) {
                console.log('MuseumCheckApp not available, skipping test');
                return;
            }

            // Don't set any firework type
            museumCheck.childNickname = '新用户';
            
            // Create a firework
            const firework = museumCheck.addFirework(
                'national-museum',
                '中国国家博物馆',
                '了解历史',
                '7-12',
                '北京'
            );
            
            // Should default to 'heart'
            expect(firework.fireworkType).toBe('heart');
        });

        test('should support all three firework types: heart, circle, star', () => {
            if (!museumCheck) {
                console.log('MuseumCheckApp not available, skipping test');
                return;
            }

            const types = ['heart', 'circle', 'star'];
            
            types.forEach((type, index) => {
                museumCheck.saveFireworkType(type);
                museumCheck.childNickname = `用户${index + 1}`;
                
                const firework = museumCheck.addFirework(
                    `museum-${index}`,
                    `博物馆${index + 1}`,
                    '参观任务',
                    '7-12',
                    '城市'
                );
                
                expect(firework.fireworkType).toBe(type);
            });
            
            // Verify all are saved correctly
            const savedFireworks = JSON.parse(localStorageMock.getItem('museumCheckFireworks'));
            expect(savedFireworks).toHaveLength(3);
            
            types.forEach((type, index) => {
                const saved = savedFireworks.find(fw => fw.museumName === `博物馆${index + 1}`);
                expect(saved.fireworkType).toBe(type);
            });
        });

        test('should preserve fireworkType through save/load cycle', () => {
            if (!museumCheck) {
                console.log('MuseumCheckApp not available, skipping test');
                return;
            }

            // User sets firework type to 'star'
            museumCheck.saveFireworkType('star');
            museumCheck.childNickname = '测试用户';
            
            // Create multiple fireworks
            for (let i = 0; i < 3; i++) {
                museumCheck.addFirework(
                    `test-museum-${i}`,
                    `测试博物馆${i}`,
                    '任务内容',
                    '7-12',
                    '测试城市'
                );
            }
            
            // Load fireworks (simulating app restart)
            const loadedFireworks = museumCheck.loadFireworks();
            
            // All fireworks should have 'star' type
            expect(loadedFireworks).toHaveLength(3);
            loadedFireworks.forEach(fw => {
                expect(fw.fireworkType).toBe('star');
            });
        });
    });

    describe('Backwards Compatibility', () => {
        test('should handle old fireworks without fireworkType field', () => {
            if (!museumCheck) {
                console.log('MuseumCheckApp not available, skipping test');
                return;
            }

            // Create old-format firework without fireworkType
            const oldFirework = {
                id: 'old-firework-id',
                museumId: 'old-museum',
                museumName: '旧博物馆',
                museumCity: '旧城市',
                taskContent: '旧任务',
                ageGroup: '7-12',
                childNickname: '旧用户',
                timestamp: Date.now(),
                date: new Date().toISOString()
                // Note: no fireworkType field
            };
            
            // Save to localStorage
            localStorageMock.setItem('museumCheckFireworks', JSON.stringify([oldFirework]));
            
            // Load fireworks
            const loaded = museumCheck.loadFireworks();
            
            // Should load successfully
            expect(loaded).toHaveLength(1);
            expect(loaded[0].museumName).toBe('旧博物馆');
            // fireworkType should be undefined (will default to 'heart' when displayed)
        });
    });
});

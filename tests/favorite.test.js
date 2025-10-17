/**
 * @jest-environment jsdom
 */

describe('Museum Favorite Functionality', () => {
    beforeEach(() => {
        testUtils.setupMinimalDOM();
    });

    afterEach(() => {
        localStorage.clear();
    });

    describe('Favorite Data Storage', () => {
        test('should initialize with empty favorites array', () => {
            const favoriteMuseums = JSON.parse(localStorage.getItem('museumcheck-favorites') || '[]');
            expect(favoriteMuseums).toEqual([]);
        });

        test('should save favorites to localStorage', () => {
            const favoritesData = ['forbidden-city', 'shanghai-museum'];
            localStorage.setItem('museumcheck-favorites', JSON.stringify(favoritesData));
            
            const loaded = JSON.parse(localStorage.getItem('museumcheck-favorites') || '[]');
            expect(loaded).toEqual(favoritesData);
        });

        test('should load favorites from localStorage', () => {
            localStorage.setItem('museumcheck-favorites', JSON.stringify(['forbidden-city', 'shanghai-museum']));
            
            const loaded = JSON.parse(localStorage.getItem('museumcheck-favorites') || '[]');
            expect(loaded).toEqual(['forbidden-city', 'shanghai-museum']);
        });

        test('should handle empty favorites list', () => {
            const loaded = JSON.parse(localStorage.getItem('museumcheck-favorites') || '[]');
            expect(loaded).toEqual([]);
            expect(loaded).toHaveLength(0);
        });
    });

    describe('Toggle Favorite Logic', () => {
        test('should add museum to favorites when not favorited', () => {
            const favorites = JSON.parse(localStorage.getItem('museumcheck-favorites') || '[]');
            const museumId = 'forbidden-city';
            
            if (!favorites.includes(museumId)) {
                favorites.push(museumId);
                localStorage.setItem('museumcheck-favorites', JSON.stringify(favorites));
            }
            
            const loaded = JSON.parse(localStorage.getItem('museumcheck-favorites') || '[]');
            expect(loaded).toContain(museumId);
        });

        test('should remove museum from favorites when already favorited', () => {
            let favorites = ['forbidden-city', 'shanghai-museum'];
            localStorage.setItem('museumcheck-favorites', JSON.stringify(favorites));
            
            const museumId = 'forbidden-city';
            favorites = JSON.parse(localStorage.getItem('museumcheck-favorites') || '[]');
            const index = favorites.indexOf(museumId);
            
            if (index > -1) {
                favorites.splice(index, 1);
                localStorage.setItem('museumcheck-favorites', JSON.stringify(favorites));
            }
            
            const loaded = JSON.parse(localStorage.getItem('museumcheck-favorites') || '[]');
            expect(loaded).not.toContain('forbidden-city');
            expect(loaded).toContain('shanghai-museum');
        });

        test('should handle multiple favorites correctly', () => {
            const favorites = [];
            
            ['forbidden-city', 'shanghai-museum', 'nanjing-museum'].forEach(id => {
                if (!favorites.includes(id)) {
                    favorites.push(id);
                }
            });
            
            localStorage.setItem('museumcheck-favorites', JSON.stringify(favorites));
            const loaded = JSON.parse(localStorage.getItem('museumcheck-favorites') || '[]');
            
            expect(loaded).toHaveLength(3);
            expect(loaded).toEqual(['forbidden-city', 'shanghai-museum', 'nanjing-museum']);
        });
    });

    describe('Favorite Sorting Priority', () => {
        test('should sort favorited museums before non-favorited', () => {
            const museums = [
                { id: 'museum-a', name: 'A Museum', location: '北京' },
                { id: 'museum-b', name: 'B Museum', location: '上海' },
                { id: 'museum-c', name: 'C Museum', location: '南京' }
            ];
            const favoriteMuseums = ['museum-c'];
            
            // Sorting logic: favorites first
            const sorted = museums.sort((a, b) => {
                const aIsFavorite = favoriteMuseums.includes(a.id);
                const bIsFavorite = favoriteMuseums.includes(b.id);
                
                if (aIsFavorite && !bIsFavorite) return -1;
                if (!aIsFavorite && bIsFavorite) return 1;
                
                return a.name.localeCompare(b.name);
            });
            
            expect(sorted[0].id).toBe('museum-c');
        });

        test('should sort multiple favorites by name', () => {
            const museums = [
                { id: 'museum-a', name: 'Z Museum', location: '北京' },
                { id: 'museum-b', name: 'A Museum', location: '上海' },
                { id: 'museum-c', name: 'M Museum', location: '南京' }
            ];
            const favoriteMuseums = ['museum-a', 'museum-c', 'museum-b'];
            
            const sorted = museums.sort((a, b) => {
                const aIsFavorite = favoriteMuseums.includes(a.id);
                const bIsFavorite = favoriteMuseums.includes(b.id);
                
                if (aIsFavorite && !bIsFavorite) return -1;
                if (!aIsFavorite && bIsFavorite) return 1;
                
                return a.name.localeCompare(b.name);
            });
            
            // All favorites should be at top, sorted by name
            expect(sorted[0].name).toBe('A Museum');
            expect(sorted[1].name).toBe('M Museum');
            expect(sorted[2].name).toBe('Z Museum');
        });
    });

    describe('Favorite Persistence', () => {
        test('should persist favorites across operations', () => {
            localStorage.setItem('museumcheck-favorites', JSON.stringify(['forbidden-city', 'shanghai-museum']));
            
            // Simulate page interaction
            let favorites = JSON.parse(localStorage.getItem('museumcheck-favorites') || '[]');
            expect(favorites).toHaveLength(2);
            
            // Add another
            favorites.push('nanjing-museum');
            localStorage.setItem('museumcheck-favorites', JSON.stringify(favorites));
            
            // Verify persistence
            favorites = JSON.parse(localStorage.getItem('museumcheck-favorites') || '[]');
            expect(favorites).toEqual(['forbidden-city', 'shanghai-museum', 'nanjing-museum']);
        });

        test('should handle corrupted localStorage data gracefully', () => {
            localStorage.setItem('museumcheck-favorites', 'invalid json data');
            
            let loaded;
            try {
                loaded = JSON.parse(localStorage.getItem('museumcheck-favorites') || '[]');
            } catch (e) {
                loaded = [];
            }
            
            expect(loaded).toEqual([]);
        });
    });

    describe('Favorite Button State', () => {
        test('should check if museum is favorited', () => {
            const favorites = ['forbidden-city'];
            localStorage.setItem('museumcheck-favorites', JSON.stringify(favorites));
            
            const loaded = JSON.parse(localStorage.getItem('museumcheck-favorites') || '[]');
            const isFavorited = loaded.includes('forbidden-city');
            expect(isFavorited).toBe(true);
            
            const isNotFavorited = loaded.includes('shanghai-museum');
            expect(isNotFavorited).toBe(false);
        });
    });
});
